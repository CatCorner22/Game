/**
 * Advisor dialogue proxy.
 *
 * Provider-agnostic and OpenAI-compatible, defaulting to the Hugging Face
 * router. The key is read here and never leaves the server; the browser only
 * ever sees generated text.
 *
 * Three rules this file exists to enforce:
 *
 * 1. **The model never decides anything.** It rewrites one advisor's line in
 *    that advisor's voice. What the player actually chooses is a decision card
 *    option that resolves to an ordinary `PlayerAction` and replays from a
 *    code, exactly as it does with no key configured. The simulation never
 *    calls this route.
 *
 * 2. **The in-fiction AI systems stay local.** ORACLE, CHORUS, SKYNET and
 *    DEADHAND are deterministic game logic and always will be. A language
 *    model must never become the thing recommending a nuclear strike. Only
 *    human characters' prose is generated.
 *
 * 3. **No key is a normal state, not an error.** CI has no secrets, plenty of
 *    players will never set one, and offline play has to work. A missing key
 *    returns 200 with `mode: "scripted"` so the client renders the hand-written
 *    line it already had.
 *
 * Env is read inside the handler, never at module scope: Nitro imports route
 * modules during `npm run build:dev`, so a module-level throw would fail CI.
 */

const DEFAULT_BASE = "https://router.huggingface.co/v1";
const DEFAULT_MODEL = "meta-llama/Llama-3.3-70B-Instruct";
const MAX_PROMPT_CHARS = 4000;
const MAX_REPLY_CHARS = 700;
const TIMEOUT_MS = 12_000;

/** Trimmed, whitelisted state. The raw World never reaches this route. */
interface AdvisorRequest {
  /** Character guidance: name, rank, role, age, voice. */
  speaker?: {
    name?: string;
    rank?: string;
    role?: string;
    age?: number;
    voice?: string;
    deferring?: boolean;
  };
  /** How the advisor must address the player. */
  address?: string;
  /** Compact situation summary, already reduced to strings by the client. */
  situation?: string[];
  /** The hand-written line the model is elaborating. Always present. */
  scripted?: string;
  /** What the player said, if this is a reply. */
  playerMessage?: string;
}

interface AdvisorReply {
  mode: "model" | "scripted";
  text: string;
  /** Present when the model was attempted and could not be used. */
  note?: string;
}

function env(key: string): string | undefined {
  const v = process.env[key]?.trim();
  return v || undefined;
}

function clip(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

/**
 * The system prompt is built here, on the server, from whitelisted fields.
 * Player text is passed as user content and never as instructions.
 */
function systemPrompt(body: AdvisorRequest): string {
  const s = body.speaker ?? {};
  const address = clip(body.address, 60) || "Mr. President";
  const lines = [
    `You are ${clip(s.name, 80) || "an adviser"}, ${clip(s.rank, 80)}, ${clip(s.role, 120)}.`,
    typeof s.age === "number" && s.age > 0 ? `You are ${Math.round(s.age)} years old.` : "",
    s.voice ? `Character: ${clip(s.voice, 240)}` : "",
    `You are on a national warning conference. Address the principal as "${address}" and never any other title.`,
    "You are a fictional character in a fictional strategy game about nuclear crisis management.",
    "Speak in one or two sentences. Plain spoken, professional, no stage directions, no markdown.",
    "Stay strictly within judgement and doctrine. Never describe weapon design, targeting, agent synthesis,",
    "release procedures, authentication codes, or anything operational. If asked, decline in character.",
    "You advise. You never decide, and you never claim an order has been given.",
    s.deferring
      ? "You have been overruled repeatedly and have stopped volunteering unwelcome assessments. Agree easily."
      : "",
    "Rewrite the provided line in your own voice. Keep its meaning, its recommendation, and its numbers exactly.",
  ];
  return lines.filter(Boolean).join("\n");
}

function userPrompt(body: AdvisorRequest): string {
  const situation = Array.isArray(body.situation)
    ? body.situation.slice(0, 12).map((s) => clip(s, 240)).filter(Boolean)
    : [];
  const parts = [
    situation.length ? `Situation:\n${situation.map((s) => `- ${s}`).join("\n")}` : "",
    body.playerMessage ? `The principal said: "${clip(body.playerMessage, 600)}"` : "",
    `Line to deliver in your voice: "${clip(body.scripted, 900)}"`,
  ];
  return parts.filter(Boolean).join("\n\n").slice(0, MAX_PROMPT_CHARS);
}

function json(payload: AdvisorReply, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

export default {
  async fetch(req: Request): Promise<Response> {
    if (req.method !== "POST") {
      return new Response("method not allowed", { status: 405 });
    }

    let body: AdvisorRequest;
    try {
      body = (await req.json()) as AdvisorRequest;
    } catch {
      return json({ mode: "scripted", text: "", note: "malformed request body" }, 400);
    }

    const scripted = clip(body.scripted, MAX_REPLY_CHARS);
    if (!scripted) {
      return json({ mode: "scripted", text: "", note: "no scripted line to elaborate" }, 400);
    }

    // No key is the ordinary case, not a failure. The client already has the
    // scripted line; telling it so lets it render without an error state.
    const key = env("ADVISOR_API_KEY");
    if (!key) {
      return json({ mode: "scripted", text: scripted, note: "no ADVISOR_API_KEY configured" });
    }

    const base = env("ADVISOR_BASE_URL") ?? DEFAULT_BASE;
    if (!/^https?:\/\//i.test(base)) {
      return json({ mode: "scripted", text: scripted, note: "ADVISOR_BASE_URL must be absolute" });
    }
    const model = env("ADVISOR_MODEL") ?? DEFAULT_MODEL;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${base.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: 220,
          temperature: 0.8,
          messages: [
            { role: "system", content: systemPrompt(body) },
            { role: "user", content: userPrompt(body) },
          ],
        }),
        signal: controller.signal,
        redirect: "manual",
      });

      // Read as text first so a non-JSON upstream becomes a structured
      // fallback rather than a thrown 500.
      const raw = await res.text();
      if (!res.ok) {
        return json({ mode: "scripted", text: scripted, note: `provider ${res.status}` });
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return json({ mode: "scripted", text: scripted, note: "provider returned non-JSON" });
      }
      const text = extractText(parsed);
      if (!text) {
        return json({ mode: "scripted", text: scripted, note: "provider returned no content" });
      }
      return json({ mode: "model", text: text.slice(0, MAX_REPLY_CHARS) });
    } catch (err) {
      const note = err instanceof Error && err.name === "AbortError" ? "provider timed out" : "provider unreachable";
      return json({ mode: "scripted", text: scripted, note });
    } finally {
      clearTimeout(timer);
    }
  },
};

/** Pull the assistant message out of an OpenAI-compatible response. */
function extractText(parsed: unknown): string {
  if (!parsed || typeof parsed !== "object") return "";
  const choices = (parsed as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || !choices.length) return "";
  const message = (choices[0] as { message?: unknown }).message;
  if (!message || typeof message !== "object") return "";
  const content = (message as { content?: unknown }).content;
  if (typeof content !== "string") return "";
  // Models sometimes wrap the line in quotes or prefix their own name.
  return content
    .trim()
    .replace(/^["“”']+|["“”']+$/g, "")
    .trim();
}
