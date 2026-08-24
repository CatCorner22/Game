import type { World } from "@/lib/game/types";
import { currentPost, inTransit } from "@/lib/game/posts";
import { addressFor } from "@/lib/game/advisors/address";
import { type Advisor, ageOf } from "@/lib/game/advisors/roster";
import type { ConferenceLine } from "@/lib/game/advisors/script";
import { RUNGS } from "@/lib/game/advisors/conference";

/**
 * Client half of the advisor dialogue proxy.
 *
 * Components stay fetch-free; this module owns the request, mirroring the shape
 * of `src/lib/multiplayer/p2p.ts` — relative same-origin URL, explicit `!res.ok`
 * handling, typed response.
 *
 * The contract that matters: `elaborate` can only ever change the *wording* of
 * a line that already exists. It is handed the scripted line and returns either
 * a rewritten one or that same line back. There is no path by which a failure,
 * a timeout, or a hostile response changes what the player is offered or what
 * the simulation does.
 */

export interface AdvisorReply {
  mode: "model" | "scripted";
  text: string;
  note?: string;
}

let unavailableUntil = 0;

/** True once the server has told us there is no model configured. */
export function modelKnownUnavailable(): boolean {
  return unavailableUntil > Date.now();
}

/**
 * Build the whitelisted situation summary. Deliberately a list of short
 * strings: the raw `World` must never be shipped to a third-party provider,
 * and this is the only thing that crosses the boundary.
 */
function situationOf(world: World): string[] {
  const out: string[] = [];
  const cc = world.closeCall;
  const post = currentPost(world);
  const rung = RUNGS.find((r) => r.rung === (world.conferenceRung ?? 1));
  out.push(`Conference rung: ${rung?.name ?? "Missile Display Conference"}`);
  out.push(`Command post: ${post.short}${inTransit(world) ? " (in transit, degraded)" : ""}`);
  out.push(`Alert state: DEFCON ${world.defcon}, phase ${world.phase}`);
  if (cc) {
    const t = cc.track;
    out.push(`Track source: ${t.source}`);
    out.push(`Confidence: ${t.confidence}%`);
    out.push(`Boost events: ${t.boosts}`);
    out.push(`Azimuth: ${t.azimuth}`);
    out.push(`Attributed to: ${world.actors[t.from]?.shortName ?? t.from}`);
    out.push(`Minutes to impact if real: ${t.minutesToImpact}`);
    out.push(`Launch notice on file: ${t.notified ? "yes" : "no"}`);
  } else {
    out.push("No active track.");
  }
  return out;
}

/**
 * Ask the server to re-voice one line. Returns the scripted line unchanged on
 * any failure, so callers never need an error branch.
 */
export async function elaborate(
  world: World,
  advisor: Advisor,
  line: ConferenceLine,
  playerMessage?: string,
): Promise<AdvisorReply> {
  if (modelKnownUnavailable()) return { mode: "scripted", text: line.text };
  try {
    const res = await fetch("/api/advisor", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        speaker: {
          name: advisor.name,
          rank: advisor.rank,
          role: advisor.role,
          age: ageOf(advisor, world),
          voice: advisor.voice,
          deferring: line.deferring,
        },
        address: addressFor(world),
        situation: situationOf(world),
        scripted: line.text,
        playerMessage,
      }),
    });
    if (!res.ok) return { mode: "scripted", text: line.text, note: `advisor route ${res.status}` };
    const body = (await res.json()) as AdvisorReply;
    if (body.mode === "scripted") {
      // Nothing configured. Stop asking for a while rather than issuing a
      // request per line for the rest of the session.
      if (body.note?.includes("ADVISOR_API_KEY")) unavailableUntil = Date.now() + 10 * 60 * 1000;
      return { mode: "scripted", text: body.text || line.text, note: body.note };
    }
    return { mode: "model", text: body.text || line.text };
  } catch {
    return { mode: "scripted", text: line.text, note: "advisor route unreachable" };
  }
}
