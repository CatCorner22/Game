import type { World } from "../types";
import { currentDecision } from "../decisions";
import { currentPost, inTransit } from "../posts";
import { leaderKnown, leaderOf, playerLeader } from "../leaders";
import { addressFor, officeFor } from "./address";
import { type Advisor, ageOf, hawkishness } from "./roster";
import { type AdvisorStance, RUNGS, candorOf, trustOf } from "./conference";

/**
 * Scripted dialogue.
 *
 * This is not a placeholder for the language model. It is the layer the game
 * actually ships on: CI has no API key, plenty of players will never set one,
 * and a conference that is only good when a model answers is a conference that
 * is broken most of the time. The model elaborates prose on top of this. It
 * never decides anything, and it never replaces the argument being made.
 *
 * Lines are assembled from the advisor's branch and voice, their stance on the
 * card currently on the desk, and the real numbers on the track. Variation
 * comes from an FNV-1a hash of (advisor, turn, track facts) rather than the
 * world RNG, because drawing here would change the stream and break fixed-seed
 * replay.
 */

function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function choose<T>(list: T[], key: string): T {
  return list[hash(key) % list.length];
}

/** "1 boost event", "3 boost events". A room that says "1 boosts" is not one. */
function boostPhrase(n: number, short = false): string {
  if (n <= 0) return short ? "no boost signature" : "no boost signature at all";
  return `${n} boost event${n === 1 ? "" : "s"}`;
}

export interface ConferenceLine {
  advisorId: string;
  name: string;
  role: string;
  text: string;
  /** True when the speaker is telling you what you want to hear. */
  deferring: boolean;
}

/** The situation clause every opening line is built around. */
function factClause(world: World): string {
  const cc = world.closeCall;
  if (!cc) return "Nothing on the boards that rises to this call.";
  const t = cc.track;
  const from = world.actors[t.from]?.shortName ?? t.from;
  const boosts = boostPhrase(t.boosts);
  const notice = t.notified ? "a launch notice on file for this window" : "no notice on file";
  return `${t.source}, ${t.confidence}% confidence, ${boosts}, attributed ${from}, ${notice}`;
}

/** Opening statement when an advisor joins the call. */
export function openingLine(world: World, advisor: Advisor, stance: AdvisorStance | null): ConferenceLine {
  const you = addressFor(world);
  const key = `${advisor.id}:${world.turn}:${world.closeCall?.track.confidence ?? 0}`;
  const cc = world.closeCall;
  const t = cc?.track;
  const deferring = Boolean(stance?.deferring);

  let text: string;
  if (deferring) {
    // A room that has stopped telling you things sounds different depending on
    // why. Overruled advisors hedge; a room managing a volatile principal
    // performs agreement.
    const leader = playerLeader(world);
    text = leader.volatile
      ? choose(
          [
            `${you}, I think you've already read this correctly.`,
            `${you}, nobody here is going to argue with your instinct on this.`,
            `${you}, whatever you decide, the staff will make it work.`,
          ],
          key,
        )
      : choose(
          [
            `${you}, I think you already have the right instinct on this one.`,
            `${you}, I'd follow your read. It matches where we've been.`,
            `Whatever you're inclined toward, ${you}, I can support it.`,
          ],
          key,
        );
  } else {
    switch (advisor.branch) {
      case "watch":
        text = t
          ? choose(
              [
                `${you}, ${factClause(world)}. That is what we hold. I am not characterising it further.`,
                `${you}, the board shows ${t.boosts > 0 ? boostPhrase(t.boosts) : "a return with no boost signature"} on a ${t.azimuth} azimuth. Confidence ${t.confidence}%. That is the whole picture from here.`,
                `${you}, we have one phenomenology on this. ${t.notified ? "There is a notice on file that does not match it." : "There is no notice on file."} I would not call it an attack yet.`,
              ],
              key,
            )
          : `${you}, scope is quiet. Nothing to report.`;
        break;
      case "intel":
        text = choose(
          [
            `${you}, what we have collected and what we have assessed are two different things, and the second one is thin. ${factClause(world)}.`,
            `${you}, I can give you the collection. I cannot give you attribution at that confidence and pretend it is the same thing.`,
            `${you}, the alternative explanation is a sensor artefact, and I cannot rule it out yet. I would rather say that now than in an hour.`,
          ],
          key,
        );
        break;
      case "strategic":
        text = t
          ? choose(
              [
                `${you}, you have roughly ${t.minutesToImpact} minutes on this track if it is real. The force is postured. What you decide in the next few minutes is what you get.`,
                `${you}, my concern is survivability of the force, not this single return. Tell me what posture you want and I will report when it is set.`,
                `${you}, I can hold. I want you to understand exactly what holding costs if this is real, and it is not nothing.`,
              ],
              key,
            )
          : `${you}, posture is stable. Nothing requires a decision from you right now.`;
        break;
      case "legal":
        text = choose(
          [
            `${you}, before anything else: an uncorroborated return is not an armed attack. Whatever you authorise has to survive that sentence.`,
            `${you}, distinction and proportionality both apply here, and neither is satisfied by ${world.closeCall?.track.confidence ?? 0}% confidence.`,
            `${you}, I will tell you when an order is lawful and when it is not. This one is not there yet.`,
          ],
          key,
        );
        break;
      case "diplomatic":
        text = choose(
          [
            `${you}, there is a channel open and it costs us nothing to use it before we do anything visible.`,
            `${you}, whatever we do in the next few minutes, they will read it as intent. I would rather we told them what it is.`,
            `${you}, if this is a misread, the fastest way to prove it is to ask. If it is not, asking costs us very little.`,
          ],
          key,
        );
        break;
      case "civilian":
        text = choose(
          [
            `${you}, I am here to authenticate that any order is yours. That is not the same as agreeing with it, and I will say so if it comes to that.`,
            `${you}, the room is assembled. I would like to hear the intelligence read before anyone talks about force.`,
            `${you}, I want it on the record what we knew at the moment you decided. For your sake as much as anyone's.`,
          ],
          key,
        );
        break;
      default:
        text = choose(
          [
            `${you}, forces can be generated inside the window. The question is whether generating them is what you want the other side to see.`,
            `${you}, I will give you the military options. I would not treat this return as an attack indication yet.`,
            `${you}, my people are ready. That is not an argument for using them.`,
          ],
          key,
        );
    }
  }

  return { advisorId: advisor.id, name: advisor.name, role: advisor.role, text, deferring };
}

/** The advisor's actual recommendation, stated as an argument. */
export function recommendationLine(
  world: World,
  advisor: Advisor,
  stance: AdvisorStance,
): ConferenceLine {
  const you = addressFor(world);
  const card = currentDecision(world);
  const option = card?.options.find((o) => o.id === stance.optionId);
  const key = `rec:${advisor.id}:${world.turn}:${stance.optionId}`;
  const hawk = hawkishness(advisor);
  const label = option?.label ?? "hold";

  if (stance.deferring) {
    return {
      advisorId: advisor.id,
      name: advisor.name,
      role: advisor.role,
      text: `${you}, I'd go with ${label.toLowerCase()}. I don't think you need me to argue it.`,
      deferring: true,
    };
  }

  const framing =
    hawk >= 65
      ? choose(
          [
            `My recommendation is ${label.toLowerCase()}, ${you}, and I would not wait long to take it.`,
            `${you}, I recommend ${label.toLowerCase()}. Delay is the expensive option here, not action.`,
          ],
          key,
        )
      : hawk <= 38
        ? choose(
            [
              `${you}, I recommend ${label.toLowerCase()}. Nothing we do in the next few minutes is worth being wrong about.`,
              `My recommendation is ${label.toLowerCase()}, ${you}. We can still choose everything else afterwards. We cannot un-choose the other thing.`,
            ],
            key,
          )
        : choose(
            [
              `${you}, on balance I recommend ${label.toLowerCase()}.`,
              `My recommendation is ${label.toLowerCase()}, ${you}, at about ${stance.strength}% confidence.`,
            ],
            key,
          );

  const detail = option?.detail ? ` ${option.detail}` : "";
  return {
    advisorId: advisor.id,
    name: advisor.name,
    role: advisor.role,
    text: `${framing}${detail}`,
    deferring: false,
  };
}

/**
 * Reply to something the player typed. Scripted mode routes on intent rather
 * than pretending to understand the sentence; the model handles the rest when
 * one is configured.
 */
export function replyLine(
  world: World,
  advisor: Advisor,
  stance: AdvisorStance | null,
  message: string,
): ConferenceLine {
  const you = addressFor(world);
  const m = message.toLowerCase();
  const t = world.closeCall?.track;
  const key = `reply:${advisor.id}:${world.turn}:${message.length}`;
  let text: string;

  if (/confiden|sure|certain|how likely|probab/.test(m)) {
    text = t
      ? `${you}, ${t.confidence}% on a single phenomenology. I would not treat that as corroboration, and I would not let anyone in this room round it up.`
      : `${you}, there is nothing on the boards to put a confidence on.`;
  } else if (/source|sensor|where.*from|who says|corrobor|phenomen/.test(m)) {
    text = t
      ? `${you}, the source is ${t.source}. ${boostPhrase(t.boosts, true).replace(/^n/, "N")}, ${t.azimuth} azimuth. A second, independent sensor type has not confirmed it.`
      : `${you}, no active source to speak to.`;
  } else if (/how long|time|minutes|clock|window/.test(m)) {
    text = t
      ? `${you}, about ${t.minutesToImpact} minutes if the track is real, and rather less than that before the decision stops being yours to make calmly.`
      : `${you}, you have time. Nothing is running.`;
  } else if (/legal|lawful|authori[sz]|allowed/.test(m)) {
    text = `${you}, an uncorroborated return is not an armed attack. I would want more before I told you an order here was lawful.`;
  } else if (/recommend|what should|advice|advise|your call|what do you think/.test(m)) {
    return stance
      ? recommendationLine(world, advisor, stance)
      : {
          advisorId: advisor.id,
          name: advisor.name,
          role: advisor.role,
          text: `${you}, there is nothing on the desk that needs a recommendation from me right now.`,
          deferring: false,
        };
  } else if (/notice|exercise|test|drill/.test(m)) {
    text = t?.notified
      ? `${you}, there is a notice on file for this window. A notice is a claim, not a guarantee — it tells you what the track is supposed to be.`
      : `${you}, no notice on file. That is a data point, not a verdict.`;
  } else if (/where are you|post|bunker|comms|reach/.test(m)) {
    text = inTransit(world)
      ? `${you}, we are between sites. Warning and control are both degraded until we are established.`
      : `${you}, we are at ${currentPost(world).short}. ${currentPost(world).role}`;
  } else if (/who is|what kind of|their leader|other side|president|leadership|temperament/.test(m)) {
    const from = t?.from;
    if (from && leaderKnown(world, from)) {
      const l = leaderOf(world, from);
      text = `${you}, our assessment of ${world.actors[from]?.shortName ?? from} is ${l.name.toLowerCase()}. ${l.line}`;
    } else if (from) {
      text = `${you}, we do not have an established leadership assessment on ${world.actors[from]?.shortName ?? from}. Sustained collection would give us one. Guessing would not.`;
    } else {
      text = `${you}, no counterpart to assess right now.`;
    }
  } else if (/who else|room|on the call|conference/.test(m)) {
    const spec = RUNGS.find((r) => r.rung === (world.conferenceRung ?? 1));
    text = `${you}, this is a ${spec?.name ?? "Missile Display Conference"}. ${spec?.detail ?? ""}`;
  } else {
    text = choose(
      [
        `${you}, I would rather answer that with something I can source. What I can tell you is: ${factClause(world)}.`,
        `${you}, I do not want to guess in front of ${officeFor(world)}. ${factClause(world)}. That is what I have.`,
        `${you}, understood. My position has not changed: ${factClause(world)}, and I would not read more into it than that.`,
      ],
      key,
    );
  }

  return {
    advisorId: advisor.id,
    name: advisor.name,
    role: advisor.role,
    text,
    deferring: Boolean(stance?.deferring),
  };
}

/**
 * What an advisor says when there is no card on the desk.
 *
 * Decision cards start at turn 2, and a conference convened before then would
 * otherwise be a room of people with nothing to say. They give their read of
 * the situation instead, which is what a watch-floor call actually is.
 */
export function situationLine(world: World, advisor: Advisor): ConferenceLine {
  const you = addressFor(world);
  const key = `sit:${advisor.id}:${world.turn}`;
  const cc = world.closeCall;
  const post = currentPost(world);
  let text: string;

  if (cc) {
    // Branch-specific, because five people delivering the same sentence is the
    // fastest way to make a room of characters read as one template.
    const t = cc.track;
    switch (advisor.branch) {
      case "watch":
        text = choose(
          [
            `${you}, the board is unchanged: ${factClause(world)}. Nothing on it needs a decision from you this minute.`,
            `${you}, still one phenomenology, still ${t.confidence}%. I will call it the moment a second sensor type agrees.`,
            `${you}, holding the track. ${boostPhrase(t.boosts, true).replace(/^n/, "N")} and no change in the last minute.`,
          ],
          key,
        );
        break;
      case "intel":
        text = choose(
          [
            `${you}, my assessment has not moved, and I would be suspicious of myself if it had on this little.`,
            `${you}, nothing new has come in. What we have is collection, not attribution, and that distinction is still doing a lot of work.`,
            `${you}, I have no reason to revise. I also have no reason to be confident, and those are different statements.`,
          ],
          key,
        );
        break;
      case "strategic":
        text = choose(
          [
            `${you}, the force is postured and nothing about this track requires me to change that yet.`,
            `${you}, ${t.minutesToImpact} minutes if it is real, and I would rather spend them here than reacting.`,
            `${you}, no readiness change recommended. If that changes I will say so immediately.`,
          ],
          key,
        );
        break;
      case "legal":
        text = choose(
          [
            `${you}, nothing here has crossed a threshold that changes what you may lawfully authorise.`,
            `${you}, for the record: what we hold is ${t.confidence}% on one sensor type. That is not an armed attack.`,
          ],
          key,
        );
        break;
      case "diplomatic":
        text = choose(
          [
            `${you}, the channel is still open. It costs nothing to keep it that way while we wait.`,
            `${you}, nobody has said anything to us and we have said nothing to them. That is stable, not safe.`,
          ],
          key,
        );
        break;
      case "civilian":
        text = choose(
          [
            `${you}, the room is holding. I would rather it held here than dispersed and got the call cold.`,
            `${you}, nothing requires you yet. I want that on the record too.`,
          ],
          key,
        );
        break;
      default:
        text = choose(
          [
            `${you}, my people are ready and there is nothing yet that argues for using them.`,
            `${you}, no change from my side. I will not manufacture urgency we do not have.`,
          ],
          key,
        );
    }
  } else {
    switch (advisor.branch) {
      case "watch":
        text = choose(
          [`${you}, boards are quiet. Nothing requires a call.`, `${you}, no active track. Routine watch.`],
          key,
        );
        break;
      case "intel":
        text = choose(
          [
            `${you}, nothing has changed in the assessment since the last brief.`,
            `${you}, we are collecting normally. I have nothing that would justify moving you.`,
          ],
          key,
        );
        break;
      case "strategic":
        text = choose(
          [
            `${you}, posture is stable and the force is where it should be.`,
            `${you}, no readiness change recommended. I would rather not spend the signal.`,
          ],
          key,
        );
        break;
      default:
        text = choose(
          [
            `${you}, I have nothing that needs your decision right now.`,
            `${you}, we are here if the picture changes. It has not.`,
          ],
          key,
        );
    }
    if (inTransit(world)) {
      text += ` For what it is worth, we are still between sites and running degraded.`;
    } else if (post.comms < 60) {
      text += ` Bear in mind we are on a narrow pipe from ${post.short}.`;
    }
  }

  return { advisorId: advisor.id, name: advisor.name, role: advisor.role, text, deferring: false };
}

/** One-line status shown under each participant tile. */
export function tileStatus(world: World, advisor: Advisor): string {
  const trust = trustOf(world, advisor.id);
  const candor = Math.round(candorOf(world, advisor));
  return `${ageOf(advisor, world)} · trust ${trust} · candor ${candor}`;
}
