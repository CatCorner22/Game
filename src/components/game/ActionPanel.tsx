import { useMemo, useState, type FormEvent } from "react";
import { ACTIONS } from "@/lib/game/actions";
import { forecast } from "@/lib/game/sim";
import { useGame } from "@/lib/game/store";
import type { World } from "@/lib/game/types";
import { cn } from "@/lib/utils";
import { fmtRange } from "@/lib/game/geo";
import { COMMAND, asPlayable, biscuitsMatch, concurrenceOutlook, isFirstUse, stanceLine } from "@/lib/game/command";
import { blackBook, footballContents } from "@/lib/game/blackbook";
import { hotlineBetween, warningLine, winterLabel } from "@/lib/game/warning";
import { pinnedLogEntry } from "./SituationLog";
import { doctrineOptions } from "@/lib/game/doctrine";
import { loadSettings } from "@/lib/game/settings";

export function ActionPanel({ world }: { world: World }) {
  const kind = useGame((s) => s.actionKind);
  const intensity = useGame((s) => s.intensity);
  const selected = useGame((s) => s.selected);
  const notify = useGame((s) => s.notify);
  const book = useGame((s) => s.book);
  const setKind = useGame((s) => s.setKind);
  const setIntensity = useGame((s) => s.setIntensity);
  const setNotify = useGame((s) => s.setNotify);
  const execute = useGame((s) => s.execute);
  const pickDoctrine = useGame((s) => s.pickDoctrine);
  const def = ACTIONS.find((a) => a.kind === kind)!;
  const action = {
    kind,
    intensity,
    target: kind === "hold" ? null : selected,
    notify: kind === "hold" ? false : notify,
    book: kind === "employ" ? book : undefined,
  };
  const fc = useMemo(() => forecast(world, action), [world, kind, intensity, selected, notify, book]);
  const line = hotlineBetween(world, world.playerId, selected);
  const showNotice = kind === "posture" || kind === "employ" || kind === "diplomacy";
  const pinned = pinnedLogEntry(world);
  const forecastSummary = loadSettings().forecastDetail === "summary";
  const doctrineChoices = world.doctrinePending ? doctrineOptions(world) : [];

  if (world.doctrinePending && doctrineChoices.length) {
    return (
      <section className="flex flex-col gap-3">
        <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">Doctrine investment · turn {world.turn}</p>
        <p className="text-sm text-muted">Pick one upgrade before this month&apos;s action. Every six months the file offers a choice.</p>
        {doctrineChoices.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => pickDoctrine(d.id)}
            className="min-h-14 rounded-md bg-elevated p-3 text-left shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
          >
            <span className="font-display text-sm tracking-wide text-fg uppercase">{d.label}</span>
            <span className="mt-1 block text-xs text-subtle">{d.detail}</span>
          </button>
        ))}
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      {pinned && (pinned.kind === "critical" || pinned.kind === "you") ? (
        <div className="rounded-md border border-danger/30 bg-danger/10 p-3">
          <p className="font-mono text-[10px] tracking-[0.22em] text-danger uppercase">Priority</p>
          <p className="mt-1 text-sm text-fg">{pinned.text}</p>
        </div>
      ) : null}
      <div>
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">This month</p>
        <h2 className="mt-1 font-display text-2xl tracking-[0.06em] text-fg">{world.event.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{world.event.body}</p>
        <p className="mt-2 text-xs leading-relaxed text-subtle">{world.event.ignoreLine}</p>
        {world.brokenArrow && !world.brokenArrow.recovered ? (
          <p className="mt-2 text-xs text-danger">
            BROKEN ARROW: {world.actors[world.brokenArrow.owner].shortName} · {world.brokenArrow.kind} ·{" "}
            {world.brokenArrow.place}
            {world.brokenArrow.found ? " · located" : " · not located"} · age {world.brokenArrow.age}. INTEL locates.
            COVERT recovers.
          </p>
        ) : null}
        {world.trickery &&
        (world.trickery.hotlineSpoof ||
          world.trickery.noticeSpoof ||
          world.trickery.humintPoison ||
          world.trickery.fakeVoice) ? (
          <p className="mt-2 text-xs text-accent">
            TRICKERY ACTIVE:
            {world.trickery.hotlineSpoof ? " cloned hotline voice." : ""}
            {world.trickery.fakeVoice ? " order in your voice." : ""}
            {world.trickery.noticeSpoof ? " forged launch notice." : ""}
            {world.trickery.humintPoison ? " poisoned HUMINT." : ""} INTEL on yourself hunts the spoof.
          </p>
        ) : null}
        {world.closeCall ? (
          <dl className="mt-3 space-y-1 rounded-md bg-elevated p-3 shadow-[var(--shadow-border)]">
            <Row k="Source" v={world.closeCall.track.source} />
            <Row k="Boosts" v={String(world.closeCall.track.boosts)} />
            <Row k="Azimuth" v={world.closeCall.track.azimuth} />
            <Row k="If real" v={`~${world.closeCall.track.minutesToImpact} min`} />
            <Row k="Confidence" v={`${world.closeCall.track.confidence}%`} />
            <Row k="Notice on file" v={world.closeCall.track.notified ? "yes" : "no"} />
            {world.closeCall.humint ? (
              <Row k="HUMINT" v={world.closeCall.humint.slice(0, 72)} />
            ) : (
              <Row k="HUMINT" v="no cell at origin" />
            )}
          </dl>
        ) : null}
        {world.reactions?.length ? (
          <div className="mt-3 rounded-md bg-elevated p-3 shadow-[var(--shadow-border)]">
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">Humans this month</p>
            {world.reactions.slice(0, 3).map((r, i) => (
              <p key={`${r.actor}-${i}`} className="mt-1 text-xs leading-snug text-fg">
                <span className="font-mono text-accent">{r.temper.toUpperCase()}</span> {r.line}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">Your move</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {ACTIONS.map((a) => (
            <button
              key={a.kind}
              onClick={() => setKind(a.kind)}
              className={cn(
                "min-h-11 rounded-sm px-3 text-left font-display text-sm tracking-[0.14em] uppercase transition-[box-shadow,background-color] duration-150",
                a.kind === kind
                  ? "bg-fg text-bg"
                  : "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">{def.blurb}</p>
      </div>

      {kind !== "hold" ? (
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
            Weight · target {selected}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {([1, 2, 3] as const).map((i) => (
              <button
                key={i}
                onClick={() => setIntensity(i)}
                className={cn(
                  "min-h-11 rounded-sm px-2 font-display text-xs tracking-[0.08em] uppercase",
                  intensity === i ? "bg-accent text-accent-fg" : "bg-elevated text-muted",
                )}
              >
                {i} {def.intensities[i - 1]}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-subtle">{def.intensityHint[intensity - 1]}</p>
          {kind === "diplomacy" ? (
            <p className="mt-2 text-xs text-muted">
              Line: {line ? `${line.name} · reliability ${line.reliability}` : "No dedicated line. Third party. Hours, not minutes."}
            </p>
          ) : null}
        </div>
      ) : null}

      {showNotice ? (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md bg-elevated px-3 shadow-[var(--shadow-border)]">
          <input
            type="checkbox"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
            className="size-4 accent-accent"
          />
          <span className="text-sm text-fg">
            File launch notice / disclose intent
            <span className="mt-0.5 block text-xs text-subtle">
              Tell them this is a test, exercise, or limited shot — not a bolt from the blue. They may not believe you.
            </span>
          </span>
        </label>
      ) : null}

      <div className="rounded-md bg-elevated p-3 shadow-[var(--shadow-border)]">
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">Forecast</p>
        <p className="mt-2 text-sm text-fg">{fc.summary}</p>
        <p className="mt-1 text-xs text-subtle">{fc.riskLine}</p>
        {!forecastSummary ? (
          <ul className="mt-3 space-y-1">
            {fc.deltas.map((d) => (
              <li key={d.label} className="flex justify-between font-mono text-xs tabular text-muted">
                <span>{d.label}</span>
                <span className="text-fg">{fmtRange(d.low, d.high)}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-2 text-[11px] text-subtle">
          {warningLine(world)} · winter {winterLabel(world.nuclearWinter)}
        </p>
      </div>

      <button
        onClick={execute}
        className={cn(
          "min-h-12 rounded-md font-display text-lg tracking-[0.22em] uppercase",
          kind === "employ" && intensity >= 2 ? "bg-danger text-fg" : "bg-accent text-accent-fg",
        )}
      >
        {kind === "employ" && intensity >= 2
          ? "Open Black Book"
          : kind === "employ"
            ? "Execute conventional"
            : "Execute"}
      </button>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 font-mono text-[11px] uppercase">
      <span className="text-subtle">{k}</span>
      <span className="text-right text-fg">{v}</span>
    </div>
  );
}

export function NuclearConfirm() {
  const world = useGame((s) => s.world);
  const selected = useGame((s) => s.selected);
  const book = useGame((s) => s.book);
  const setBook = useGame((s) => s.setBook);
  const cancel = useGame((s) => s.cancelConfirm);
  const commit = useGame((s) => s.confirmAndExecute);
  const [typed, setTyped] = useState("");
  const [error, setError] = useState<string | null>(null);
  if (!world) return null;
  const c = COMMAND[asPlayable(world.playerId)];
  const first = isFirstUse(world);
  const outlook = concurrenceOutlook(world, first);
  const match = biscuitsMatch(typed, world.authCode);
  const bag = world.footballPresent;
  const card = world.biscuitOnPerson !== false;
  const ok = match && bag && card;
  const challenge = world.authCode;
  const pages = blackBook(world);
  const page = pages.find((p) => p.id === book) ?? pages[0]!;
  const fc = footballContents(world.playerId);
  const minutes = world.closeCall?.track.minutesToImpact;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!bag) {
      setError("The aide is not in the room. No Black Book. No SATCOM. The order dies.");
      return;
    }
    if (!card) {
      setError("The biscuit is not in your pocket. Gold codes are not in the bag. NMCC will not take the voice.");
      return;
    }
    if (!match) {
      setError(`No match. Type gold code ${challenge}. Hyphens optional.`);
      return;
    }
    commit();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/85 p-3 sm:items-center">
      <form
        onSubmit={onSubmit}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
      >
        <p className="font-mono text-[10px] tracking-[0.22em] text-danger uppercase">
          {c.satchel} · Presidential Emergency Satchel
        </p>
        <h2 className="mt-1 font-display text-3xl tracking-wide text-fg">BLACK BOOK</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted">{fc.bag}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{fc.biscuit}</p>
        <p className="mt-1 text-xs leading-relaxed text-subtle">{fc.radio}</p>
        {minutes != null ? (
          <p className="mt-2 font-mono text-xs text-danger uppercase">
            Decision window ~{minutes} min · Jacobsen: bolt-from-the-blue is about six. ICBMs cannot turn around.
          </p>
        ) : (
          <p className="mt-2 font-mono text-xs text-subtle uppercase">
            Sole authority. SecDef authenticates you. Aide fires nothing. No button.
          </p>
        )}
        <dl className="mt-3 space-y-1">
          <Row k="Aide + bag" v={bag ? "on hip" : "NO — book not in the room"} />
          <Row k="Biscuit" v={card ? "on your person" : "MISSING — gold codes not in the bag"} />
          <Row k="Second" v={`${world.secondOfficer.title} · ${world.secondOfficer.stance}`} />
          <Row k="Target" v={world.actors[selected].name} />
        </dl>

        <p className="mt-4 font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
          Packaged options · you pick a page, not a city
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {pages.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setBook(p.id)}
              className={cn(
                "min-h-14 rounded-md px-2 py-2 text-left",
                book === p.id ? "bg-danger text-fg" : "bg-elevated text-fg shadow-[var(--shadow-border)]",
              )}
            >
              <span className="font-display text-sm tracking-[0.12em]">
                {p.letter} · {p.short}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug opacity-80">{p.yieldLine}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-md bg-elevated p-3 shadow-[var(--shadow-border)]">
          <p className="font-display text-lg tracking-wide text-fg">
            {page.letter} · {page.name}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{page.body}</p>
          <p className="mt-2 font-mono text-[11px] text-fg">Yield {page.yieldLine}</p>
          <p className="font-mono text-[11px] text-muted">Dead {page.deathsLine}</p>
          <p className="font-mono text-[11px] text-muted">Recall {page.recall}</p>
          <p className="font-mono text-[11px] text-accent">Winter {page.winter}</p>
        </div>

        <p className="mt-4 font-mono text-xs tracking-[0.18em] text-accent uppercase">
          Gold codes · biscuit · type {world.authCode}
        </p>
        <input
          autoFocus
          name="biscuit"
          value={typed}
          onChange={(e) => {
            setTyped(e.target.value);
            setError(null);
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          inputMode="text"
          enterKeyHint="done"
          className="mt-2 h-12 w-full rounded-md bg-elevated px-3 font-mono text-lg tracking-widest text-fg uppercase outline-none shadow-[var(--shadow-border)]"
          placeholder={world.authCode}
          aria-label="Type gold-code biscuit"
        />
        <p className={cn("mt-2 font-mono text-xs uppercase", match ? "text-olive" : "text-subtle")}>
          {typed.length === 0
            ? `Card in your pocket. Challenge ${world.authCode}. Enter voices the order to NMCC.`
            : match
              ? bag && card
                ? `Biscuit matches. Page ${page.letter} will be voiced. Irreversible for ICBMs.`
                : "Biscuit matches. Bag or card still missing."
              : "No match yet."}
        </p>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        <p className="mt-2 text-xs leading-relaxed text-subtle">
          {stanceLine(world.secondOfficer.stance)} {outlook.risk} {fc.cog}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={cancel}
            className="min-h-11 flex-1 rounded-sm font-display tracking-[0.16em] text-muted uppercase"
          >
            Close book
          </button>
          <button
            type="submit"
            className="min-h-11 flex-1 rounded-sm bg-danger font-display tracking-[0.12em] text-fg uppercase disabled:opacity-30"
            disabled={!ok}
          >
            Voice order
          </button>
        </div>
      </form>
    </div>
  );
}
