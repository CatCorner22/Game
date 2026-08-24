import type { ActorId } from "./types";

/**
 * Who each actor is, in words.
 *
 * The game has always modelled actors precisely and described them barely. An
 * `Actor` carries fifty-six fields, of which exactly one is descriptive prose:
 * `doctrineLine`. All fourteen of those lines together come to about 1,700
 * characters — **less than a single scenario brief**. So a player could read
 * that Russia's hostility was 74 and its nerve was 68 and have no idea what
 * Russia was trying to achieve, what it was afraid of, or what would stop it.
 *
 * That is the gap this closes. Numbers tell you the state of a relationship;
 * they never tell you what somebody wants.
 *
 * Lives in a module table rather than on `Actor` deliberately. `World` is
 * `structuredClone`d twice per `ActionPanel` render by `forecast()` and
 * JSON-encoded on every save; rich static text belongs beside it, keyed by id,
 * the way `posts.ts`, `leaders.ts` and `advisors/roster.ts` already do it.
 *
 * Content rule, same as everywhere else in this repo: doctrine, interests and
 * judgement. No operational detail, and no real living official is named.
 */
export interface ActorDossier {
  /** The objective, stated as an objective rather than a mood. */
  wants: string;
  /** What they would spend real capital to avoid. Often not the obvious thing. */
  fears: string;
  /** What stops them doing the obvious thing. */
  constraint: string;
  /** The body that actually decides, which is rarely one person. */
  answersTo: string;
  /** What would make them act, in their own terms. */
  redLine: string;
  /** How they read a crisis — the lens, not the policy. */
  reads: string;
}

export const ACTOR_DOSSIERS: Record<ActorId, ActorDossier> = {
  US: {
    wants:
      "To keep every alliance credible at once without being dragged into a war by any of them. Extended deterrence is a promise made to about thirty capitals, and its value depends entirely on none of them ever needing to test it.",
    fears:
      "Not defeat. Being the party that has to choose between abandoning an ally and a general war — the exact choice the whole arrangement exists to never present.",
    constraint:
      "A four-year electoral clock, a Congress that funds it, allies who each want a different answer, and a public that will accept a long crisis but not a surprising one.",
    answersTo:
      "The National Security Council. Release authority is the President's alone, and everything short of that is argued out by the Secretaries of State and Defense, the Chairman, and the Director of National Intelligence.",
    redLine:
      "An attack on the homeland or on treaty-covered territory. The ambiguity about everything below that line is deliberate and is itself the policy.",
    reads:
      "Through process. Wants the assessment, the confidence interval and the legal opinion before it moves, which makes it slow, predictable, and hard to panic.",
  },
  RU: {
    wants:
      "To be treated as a great power with a recognised sphere, and to make the cost of NATO expansion visible enough that it stops. Status is not decoration here; it is the objective.",
    fears:
      "Encirclement, and more specifically a conventional defeat that has no nuclear off-ramp. The doctrine exists because the conventional balance does not favour it.",
    constraint:
      "An economy narrower than its ambitions, a demographic floor under how long it can sustain a war, and elites whose loyalty is transactional rather than ideological.",
    answersTo:
      "The Security Council of the Russian Federation — the Secretary of the Council, the Minister of Defence, the Chief of the General Staff, and the heads of the services. It meets in private and it is not a debating chamber.",
    redLine:
      "Any threat to the existence of the state, which is defined broadly enough on purpose that nobody outside can price it.",
    reads:
      "Through intent. Assumes the other side is doing deliberately what it may only be doing carelessly, and treats an exercise as a rehearsal until proven otherwise.",
  },
  SU: {
    wants:
      "Recognition as the lawful successor to a state that no longer exists, and physical custody of the arsenal that would prove it. The claim is the whole strategy.",
    fears:
      "Being handled as a criminal enterprise rather than a government — because a government can be negotiated with and an enterprise is simply hunted.",
    constraint:
      "Garrisons that have received two sets of lawful-looking orders and have not all decided which briefcase is real. Its authority is contested inside its own perimeter.",
    answersTo:
      "A restorationist command claiming continuity with Soviet institutions. Which of its bodies actually holds release authority is exactly what nobody outside can establish.",
    redLine:
      "An attempt to seize or disable the silo fields it claims, which it would read as the moment its claim dies.",
    reads:
      "Through legitimacy. Every exchange is judged by whether it treated the claim as real, and a technically correct answer that ignores the claim reads as a refusal.",
  },
  CN: {
    wants:
      "Reunification on its own timetable, and enough survivable retaliation that nobody can coerce it while it waits. The timetable matters more than the speed.",
    fears:
      "A blockade it cannot break and a coalition it cannot split — economic strangulation, not invasion. And, increasingly, a first strike its early warning would not see coming.",
    constraint:
      "An export economy that a real war would end, a leadership that has staked its legitimacy on growth, and a military that has not fought one since 1979.",
    answersTo:
      "The Central Military Commission. Its Chairman holds the authority; the Vice-Chairmen, the Joint Staff Department and the Rocket Force commander are the people in the room.",
    redLine:
      "A formal declaration of independence by Taipei, or foreign forces stationed on the island. Both are stated openly and neither is ambiguous.",
    reads:
      "Through patience. Prefers the move that improves its position in ten years to the one that wins the week, which makes it hard to provoke and hard to hurry.",
  },
  FR: {
    wants:
      "A deterrent that is credible without anybody else's permission, and a Europe that eventually depends on it rather than on Washington. Independence is the point of the whole force.",
    fears:
      "Being folded into an alliance nuclear structure, which would make the deterrent an instrument of someone else's policy and end its meaning.",
    constraint:
      "A force sized for sufficiency rather than parity, and the fact that a deterrent nobody coordinates with may not deter anything jointly.",
    answersTo:
      "The Conseil de défense et de sécurité nationale. Employment rests with the President alone — there is no second signature, which is a different design choice from the American two-person rule and was made deliberately.",
    redLine:
      "Vital interests, defined by the President and never published. The vagueness is the doctrine, not a gap in it.",
    reads:
      "Through sovereignty. The first question asked of any proposal is who would be deciding, and a good answer to the wrong question gets refused.",
  },
  UK: {
    wants:
      "To remain a nuclear power that matters at a scale it can afford, and to keep the American relationship close enough to be useful without becoming a dependency it cannot admit to.",
    fears:
      "A gap in continuous at-sea deterrence, and the day somebody works out that the independence of the deterrent has a technical answer it would rather not discuss.",
    constraint:
      "One leg only — no air or land component — so a single boat is the whole force, and the fleet is small enough that a maintenance problem is a strategic one.",
    answersTo:
      "The National Security Council, with the Chief of the Defence Staff and the Cabinet Secretary in the room. Each patrol carries a handwritten letter from the Prime Minister that nobody has ever read.",
    redLine:
      "An existential attack on the United Kingdom, deliberately left undefined so that the letters never have to be.",
    reads:
      "Through precedent and law. Wants to know what was done last time and whether it was lawful, which makes it a restraining voice in almost every room it is in.",
  },
  IN: {
    wants:
      "Recognition as a responsible nuclear power outside the treaty, credible minimum deterrence against two adversaries at once, and to be left alone to grow.",
    fears:
      "A two-front crisis, and a domestic politics that makes restraint after an attack electorally impossible. The second is the more dangerous of the two.",
    constraint:
      "A declared no-first-use policy that its own military increasingly argues against, and a public that has seen the footage before the cabinet has seen the assessment.",
    answersTo:
      "The Cabinet Committee on Security and the Nuclear Command Authority, advised by the National Security Adviser and the Chief of Defence Staff. Release is a political decision by design.",
    redLine:
      "A major attack with biological or chemical weapons, the one stated exception to no first use, plus the unstated line where a conventional defeat becomes unacceptable.",
    reads:
      "Through restraint under pressure. Absorbs the first blow more often than not, then answers on a timetable it chooses rather than the one it was handed.",
  },
  PK: {
    wants:
      "To make an Indian conventional advantage unusable. Full-spectrum deterrence exists precisely to close the gap between a border incident and a strategic exchange.",
    fears:
      "A conventional breakthrough it cannot stop, and — separately and more quietly — losing custody of something to its own insiders.",
    constraint:
      "An economy that cannot match its neighbour's, an army that outweighs its civilian government, and short-range systems that must sit close to the border to matter at all.",
    answersTo:
      "The National Command Authority, chaired by the Prime Minister, with the Chairman of the Joint Chiefs and the Director-General of the Strategic Plans Division, which is its secretariat and its real institutional memory.",
    redLine:
      "Loss of territory, destruction of its forces, economic strangulation, or internal destabilisation — four stated thresholds, none of them precisely defined.",
    reads:
      "Through survival arithmetic. Assumes it has less time and less depth than its adversary, which makes it fast, and fast is the dangerous property here.",
  },
  IL: {
    wants:
      "To remain the only nuclear power in its region, and to never have to confirm that it is one. Opacity is not evasion here; it is the entire policy.",
    fears:
      "A hostile state crossing the threshold, and being manoeuvred into acknowledging its own arsenal — which would start a regional proliferation cascade it could not stop.",
    constraint:
      "Strategic depth measured in minutes, a coalition government that can fall in a week, and an American relationship it needs and cannot be seen to need.",
    answersTo:
      "The Security Cabinet, with the Chief of the General Staff and the heads of Mossad, Shin Bet and military intelligence. A small room, and one that has acted without warning anybody before.",
    redLine:
      "Another state in the region approaching a weapon. This has been acted on twice, in 1981 and 2007, and neither strike was preceded by a public warning.",
    reads:
      "Through worst case. Prices the adversary's capability rather than its stated intention, and treats a capability that exists as a decision already taken.",
  },
  KP: {
    wants:
      "Regime survival, sanctions relief, and to be treated as a nuclear state rather than a proliferation problem. Every test is addressed to that third goal.",
    fears:
      "Decapitation, and being ignored. The second sounds trivial and is not — a programme whose value is attention loses value the moment attention moves elsewhere.",
    constraint:
      "An economy dependent on one neighbour, and a leadership circle small enough that a purge and a succession crisis are the same event.",
    answersTo:
      "The Central Military Commission and the State Affairs Commission. In practice it answers to one person, and the room's function is to agree with him first and reason backwards.",
    redLine:
      "Any indication of a strike on leadership. Use-it-or-lose-it is acute here because the arsenal is small enough that waiting could mean not having one.",
    reads:
      "Through threat and theatre simultaneously. A move can be both a real preparation and a message, and it is usually a mistake to decide it is only one of them.",
  },
  IR: {
    wants:
      "Regional influence through partners rather than conquest, sanctions relief that does not look like surrender, and to keep a weapon within reach without reaching.",
    fears:
      "A strike on the programme that unifies the country behind the hardest faction, and a negotiated deal that its own system reads as capitulation. Both are internal fears more than external ones.",
    constraint:
      "A government split between elected and unelected authority, an economy under sustained pressure, and a population whose patience is not unlimited.",
    answersTo:
      "The Supreme National Security Council. The President chairs it — and the Supreme Leader's representatives in the room outrank him, which is the fact most outside analysis gets wrong.",
    redLine:
      "A strike on nuclear facilities or on senior leadership. Threshold ambiguity has protected it for twenty years and it guards that ambiguity carefully.",
    reads:
      "Through factional consequence. The first question about any external move is which internal faction it strengthens, and the answer often matters more than the move.",
  },
  CU: {
    wants:
      "Survival, sanctions relief, and to never again be the board somebody else's game is played on. Hosting is a bargaining position, not an ambition.",
    fears:
      "Becoming an aimpoint in a quarrel between larger states, which is exactly what happened in 1962 and is remembered in detail.",
    constraint:
      "It has no arsenal, no veto over what a patron deploys on its soil, and no way to make either of them listen once the shipment sails.",
    answersTo:
      "A small leadership with long institutional memory of exactly this situation, and very little room to manoeuvre inside it.",
    redLine:
      "Invasion. Everything else is negotiable and it knows the difference.",
    reads:
      "Through the 1962 file. Assumes it will be traded away, and its behaviour makes far more sense once you accept that the assumption is well founded.",
  },
  NS: {
    wants:
      "A demonstration that cannot be attributed. The point is not territory or terms — it is the act, and the impossibility of answering it.",
    fears:
      "Losing the material to a state that would rather have it back, and the internal informant. Both are more dangerous to it than any air strike.",
    constraint:
      "No industrial base, no delivery system worth the name, and a supply chain of amateurs. Almost every seller in the historical record was caught while looking for a buyer.",
    answersTo:
      "Nobody that a state could negotiate with. This is what breaks deterrence: there is no return address, so there is nothing to hold at risk.",
    redLine:
      "It does not have one. Deterrence assumes something it wants to keep, and that assumption is the part that fails here.",
    reads:
      "Through opportunity. Does not plan around your doctrine because your doctrine does not reach it, and moves when a gap opens rather than when a threshold is crossed.",
  },
  CR: {
    wants:
      "Money and corridors. A warhead is inventory — extremely valuable, extremely hot inventory that it would rather sell than hold.",
    fears:
      "State attention at a scale it cannot bribe. It has priced every official in the chain and cannot price a decision taken in another country's capital.",
    constraint:
      "It understands leverage perfectly and deterrence not at all, which makes it simultaneously easy to bargain with and impossible to threaten.",
    answersTo:
      "A plaza structure, a set of colonels, and the arithmetic of the corridor. Nobody in it has ever thought about strategic stability and nobody needs to.",
    redLine:
      "None that is ideological. It walks away from anything the moment the price stops working, which is the only real handle anyone has on it.",
    reads:
      "Through the transaction. Reads a diplomatic overture as an opening bid and a military threat as a cost of doing business, and prices both the same way.",
  },
};

export function dossierFor(id: ActorId): ActorDossier | null {
  return ACTOR_DOSSIERS[id] ?? null;
}
