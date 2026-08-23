import type { ActionKind, ActorId, GameEvent, PlayerAction, World } from "./types";
import { chance, pick } from "./rng";
import { eventFlash } from "./flash";

export function decisionKey(eventId: string, action: PlayerAction): string {
  return `${eventId}|${action.kind}|${action.intensity}|${action.target ?? "-"}`;
}

export function rememberDecision(world: World, action: PlayerAction) {
  const key = decisionKey(world.event.id, action);
  world.lastAction = { ...action };
  world.lastDecisionKey = key;
  world.recentDecisionKeys = [...(world.recentDecisionKeys ?? []), key].slice(-8);
  world.threadActor = action.target ?? world.event.actor;
  world.threadTag = world.event.tags[0] ?? eventFlash(world.event.actor);
}

function nameOf(world: World, id: ActorId | null | undefined): string {
  if (!id) return "the other capital";
  return world.actors[id]?.shortName ?? id;
}

function followId(world: World, stem: string): string {
  return `follow-${stem}-${world.turn}`;
}

/** Build a next-month card that is a direct result of this month's move. */
export function followUpEvent(world: World, action: PlayerAction): GameEvent | null {
  const prev = world.event;
  const target = action.target ?? prev.actor;
  const them = nameOf(world, target);
  const you = nameOf(world, world.playerId);
  const tag = prev.tags[0] ?? eventFlash(target) ?? "crisis";
  const because = `${you} ${action.kind.toUpperCase()}${action.target ? ` → ${them}` : ""} last month.`;

  if (prev.id === "close-call") {
    if (action.kind === "hold") {
      return {
        id: followId(world, "petrov-after"),
        title: "Desk wants a rule",
        body: `After you held on the track, ${them} and your own warning shop are writing after-action. Hawks say you gambled the homeland. Professionals say you saved the species. The next track will not get the same slack unless you retask sensors or file a notice regime.`,
        actor: target,
        heat: "med",
        ignoreLine: "The shop stays split. Next false alarm is more likely to leak to politicians.",
        tags: [tag, "warning", "follow"],
        because,
      };
    }
    if (action.kind === "diplomacy") {
      return {
        id: followId(world, "hotline-reply"),
        title: "Hotline minutes leak",
        body: `${them} answered — or someone who sounded like them did. Staffs on both sides now argue whether the all-clear was real. INTEL on the line. HOLD is how rumor becomes doctrine.`,
        actor: target,
        heat: "high",
        ignoreLine: "The rumor stands. Trust on that line drops.",
        tags: [tag, "hotline", "follow"],
        because,
      };
    }
  }

  if (action.kind === "hold") {
    return {
      id: followId(world, "held"),
      title: `${them} reads the silence`,
      body: `You held on ${prev.title.toLowerCase()}. ${them} treats that as room. The same file is still open — generation, a test, or a leak — and your staff is asking for a real lever this month, not another wait.`,
      actor: target,
      heat: prev.heat === "low" ? "med" : prev.heat,
      ignoreLine: "They keep the initiative. Heat in that theater stays or climbs.",
      tags: [tag, "follow", "silence"],
      because,
    };
  }

  if (action.kind === "diplomacy") {
    return {
      id: followId(world, "talks"),
      title: `${them} answers the line`,
      body: `Last month you opened a channel. ${them} sent a formula: freeze, inspect, or a face-saving exercise notice. It may be a stall. Weight 2 tests it. PRESSURE kills it. HOLD lets hawks on their side pocket the pause.`,
      actor: target,
      heat: "med",
      ignoreLine: "The formula expires. Their hawks brief that you blinked.",
      tags: [tag, "follow", "talks"],
      because,
    };
  }

  if (action.kind === "pressure") {
    return {
      id: followId(world, "backlash"),
      title: `Nationalist hour in ${them}`,
      body: `Sanctions and isolation landed. Streets and colonels in ${them} want a visible reply — a test, a generate, or a cut of your access. You can walk it back on the line or match them and own the spiral.`,
      actor: target,
      heat: "high",
      ignoreLine: "They reply on their own clock. Nationalism ticks up.",
      tags: [tag, "follow", "backlash"],
      because,
    };
  }

  if (action.kind === "posture") {
    return {
      id: followId(world, "match"),
      title: `${them} matches generate`,
      body: `Your posture was visible from orbit. ${them} generated in kind${action.notify ? " — they logged your notice and still matched" : " and filed no notice"}. Security-dilemma month. DIPLOMACY asks if this is an exercise. Another POSTURE without a notice is how desks write first-strike.`,
      actor: target,
      heat: "high",
      ignoreLine: "Both sides stay generated. Crisis instability is the cost of survival.",
      tags: [tag, "follow", "posture"],
      because,
    };
  }

  if (action.kind === "intelligence") {
    return {
      id: followId(world, "take"),
      title: "Product from last month's take",
      body: `INTEL you tasked is back: a fence-line report, a bus count, or a denial that does not match radar. The file on ${them} is sharper. COVERT can act on it. HOLD lets the take go stale.`,
      actor: target,
      heat: "med",
      ignoreLine: "The take ages. Someone else acts on a worse picture.",
      tags: [tag, "follow", "intel"],
      because,
    };
  }

  if (action.kind === "covert") {
    return {
      id: followId(world, "cell"),
      title: "Cell reports — or burns",
      body: `Last month's covert on ${them} produced a name, a gap, or a rolled-up officer. If the cell is live, INTEL can run it. If it burned, they will look for yours. HOLD is how a blown net becomes a diplomatic note.`,
      actor: target,
      heat: "high",
      ignoreLine: "The net goes quiet. You do not know if it is dead or dark.",
      tags: [tag, "follow", "covert"],
      because,
    };
  }

  if (action.kind === "kill") {
    return {
      id: followId(world, "attr"),
      title: "Attribution fight",
      body: `Lights flickered. ${them} is briefing that you cut ${action.intensity >= 2 ? "grid" : "net"}. Allies want a statement. A notice now looks like confession. DIPLOMACY or HOLD — both are read as something.`,
      actor: target,
      heat: "critical",
      ignoreLine: "They write the first draft of history. It names you.",
      tags: [tag, "follow", "cyber"],
      because,
    };
  }

  if (action.kind === "employ") {
    const strike = world.lastStrike;
    if (strike && (strike.outcome === "failed" || strike.outcome === "intercepted")) {
      return {
        id: followId(world, "miss"),
        title: strike.outcome === "intercepted" ? `${them} claims the intercept` : "The pulse did not land",
        body: `${strike.summary} ${them} is briefing that defense worked — or that you fizzled. Cabinets still saw boosts. DIPLOMACY is how you say limited. Another EMPLOY is how you prove the bus. HOLD lets them write the first draft.`,
        actor: target,
        heat: "critical",
        ignoreLine: "They treat a launch as a launch. Pre-delegation clocks run.",
        tags: [tag, "follow", "intercept"],
        because,
      };
    }
    if (strike && strike.outcome === "partial") {
      return {
        id: followId(world, "leak"),
        title: "Leaky pulse",
        body: `${strike.summary} ${them} lost some aimpoints and kept others. They are deciding whether this was incompetence or mercy. The next file is pause, talk, or climb.`,
        actor: target,
        heat: "critical",
        ignoreLine: "They assume another pulse to finish the package.",
        tags: [tag, "follow", "war"],
        because,
      };
    }
    return {
      id: followId(world, "shot"),
      title: "After the shot",
      body: `You employed force last month. ${them} is deciding whether this was limited or the first pulse. Cabinets are in bunkers. The next move is still yours — hold for a pause, talk, or climb.`,
      actor: target,
      heat: "critical",
      ignoreLine: "They assume another pulse. Pre-delegation clocks run.",
      tags: [tag, "follow", "war"],
      because,
    };
  }

  return null;
}

export function isRepeatDecision(world: World, eventId: string, action: PlayerAction): boolean {
  const key = decisionKey(eventId, action);
  return (world.recentDecisionKeys ?? []).includes(key);
}

export function recentEventIds(world: World): string[] {
  return world.usedEventIds.slice(-4);
}

/** Prefer same theater / actor as the thread; never the last card. */
export function scoreCandidate(world: World, ev: GameEvent, lastAction: PlayerAction | null): number {
  const recent = recentEventIds(world);
  if (ev.id === world.event.id) return -1000;
  if (recent.includes(ev.id)) return -400;
  if (ev.id.startsWith("follow-") && world.event.id.startsWith("follow-") && ev.tags.includes(world.event.tags[1] ?? "")) {
    return -80;
  }
  let s = 0;
  const threadActor = lastAction?.target ?? world.threadActor ?? world.event.actor;
  const threadTags = new Set([world.threadTag, world.event.tags[0], eventFlash(world.event.actor)].filter(Boolean) as string[]);
  if (ev.actor === threadActor) s += 6;
  if (ev.tags.some((t) => threadTags.has(t))) s += 8;
  const fp = eventFlash(ev.actor);
  if (fp) {
    const heat = world.flashpoints.find((f) => f.id === fp)?.heat ?? 0;
    s += heat / 20;
  }
  if (lastAction?.kind === "hold" && ev.heat === "low") s -= 2;
  if (lastAction?.kind === "diplomacy" && ev.tags.includes("talks")) s += 4;
  if (lastAction?.kind === "posture" && (ev.tags.includes("nato-ru") || ev.tags.includes("warning"))) s += 3;
  return s;
}

export function shouldFollowUp(world: World, action: PlayerAction): boolean {
  if (world.event.id.startsWith("follow-") && action.kind === "hold") return chance(world, 0.35);
  if (action.kind === "hold") return chance(world, 0.72);
  if (action.kind === "employ" || action.kind === "kill") return chance(world, 0.88);
  return chance(world, 0.78);
}

export function pickWeighted<T>(world: World, items: T[], scoreOf: (item: T) => number): T {
  const scored = items.map((item) => ({ item, s: scoreOf(item) }));
  const viable = scored.filter((x) => x.s > -200);
  const pool = viable.length ? viable : scored;
  const best = Math.max(...pool.map((x) => x.s));
  const top = pool.filter((x) => x.s >= best - 3);
  return pick(world, top).item;
}

export function sameFollowBeat(prev: GameEvent, next: GameEvent): boolean {
  if (!prev.id.startsWith("follow-") || !next.id.startsWith("follow-")) return false;
  const beats = ["silence", "talks", "backlash", "posture", "intel", "covert", "cyber", "war", "intercept"];
  const a = prev.tags.filter((t) => beats.includes(t));
  const b = next.tags.filter((t) => beats.includes(t));
  return a.length > 0 && a[0] === b[0];
}

export function actionLabel(kind: ActionKind): string {
  return kind.toUpperCase();
}
