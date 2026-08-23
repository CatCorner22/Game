import type { ActorId, OfficerStance, PlayableId, World } from "./types";
import { chance, clamp, nextInt, pick } from "./rng";
import { log } from "./simLog";
import { stanceFromNerve } from "./humans";

export interface CommandProfile {
  satchel: string;
  satchelLine: string;
  secondTitle: string;
  pal: boolean;
  twoMan: boolean;
  positiveControl: boolean;
  perimeter: boolean;
  letters: boolean;
  refusal: number;
  eager: number;
  preDel: number;
  officers: string[];
}

export const PLAYABLE: { id: PlayableId; name: string; seat: string; blue: string; red: string; group: "nuclear" | "other" }[] = [
  {
    id: "US",
    name: "United States",
    seat: "President · NCA",
    blue: "Deter. Hold the taboo. If war starts, keep a country.",
    red: "Coerce with the triad. Preventive options are on the table.",
    group: "nuclear",
  },
  {
    id: "RU",
    name: "Russia",
    seat: "President · Cheget",
    blue: "Avoid NATO war. Keep second strike. Do not test Perimeter.",
    red: "Split NATO. Escalate-to-deescalate is a tool. Ukraine on your terms.",
    group: "nuclear",
  },
  {
    id: "SU",
    name: "USSR",
    seat: "General Secretary · Kazbek",
    blue: "Restore the Union without a spasm. Two C2s on one arsenal is the danger.",
    red: "Reclaim the Soviet arsenal. Moscow is a traitor government. Perimeter is yours.",
    group: "nuclear",
  },
  {
    id: "CN",
    name: "China",
    seat: "CMC Chairman",
    blue: "Grow quietly. Keep NFU credible. No Taiwan war this watch.",
    red: "Quarantine Taiwan. Make US alliances look expensive.",
    group: "nuclear",
  },
  {
    id: "FR",
    name: "France",
    seat: "President · codes",
    blue: "Strict sufficiency. Independent, not reckless.",
    red: "Europe's nuclear voice. Use the warning shot if you must.",
    group: "nuclear",
  },
  {
    id: "UK",
    name: "United Kingdom",
    seat: "Prime Minister · CASD",
    blue: "The boat stays at sea. Do not write a new letter this month.",
    red: "Independent deterrent as leverage, including against allies.",
    group: "nuclear",
  },
  {
    id: "IN",
    name: "India",
    seat: "NCA · Political Council",
    blue: "Hold NFU. Deter Pakistan. Do not race China into spasm.",
    red: "Walk back NFU. Punish a Nasr world. Accept the spiral risk.",
    group: "nuclear",
  },
  {
    id: "PK",
    name: "Pakistan",
    seat: "NCA · SPD",
    blue: "Keep the keys. Stop a theft. Do not let Nasr fire first.",
    red: "Full-spectrum means using Nasr if India moves. Pre-delegation is a feature.",
    group: "nuclear",
  },
  {
    id: "IL",
    name: "Israel",
    seat: "Prime Minister · opacity",
    blue: "Keep the bomb in the basement. Stop an Iranian device without a mushroom cloud.",
    red: "Strike first if the clock is real. Ambiguity is cover, not a restraint.",
    group: "nuclear",
  },
  {
    id: "KP",
    name: "North Korea",
    seat: "Supreme Commander",
    blue: "Survive. Extract aid. Do not fire the first tactical.",
    red: "Extort with tests. Automatic use if the regime is touched.",
    group: "nuclear",
  },
  {
    id: "IR",
    name: "Iran",
    seat: "Supreme Leader · breakout clock",
    blue: "Assemble quietly. Break out before the strike. NFU is not your doctrine — survival is.",
    red: "Weaponize the clock. Force concessions. Israel and the US are watching every centrifuge.",
    group: "nuclear",
  },
  {
    id: "CU",
    name: "Cuba",
    seat: "First Secretary · Havana",
    blue: "Do not become a launch pad. Survive the island. Send the TELs home.",
    red: "Invite the missiles back. 1962 with better radars. Host the cartel if it pays.",
    group: "other",
  },
  {
    id: "CR",
    name: "Transnational cartel",
    seat: "Plaza · no capital",
    blue: "Stay rich. Do not touch a warhead. States that notice you will not MAD you — they will hunt you.",
    red: "Buy a device. Hold a port city. Money is C2. There is no football. There is a ledger.",
    group: "other",
  },
  {
    id: "NS",
    name: "Terror network",
    seat: "Emir · no address",
    blue: "Do not get a yield. Survive as a political problem, not a mushroom cloud.",
    red: "A city, a van, no return address. MAD does not apply to you. That is the point.",
    group: "other",
  },
];

export const COMMAND: Record<PlayableId, CommandProfile> = {
  US: {
    satchel: "Nuclear Football",
    satchelLine:
      "Jacobsen: a ~45-lb leather-covered Zero Halliburton on a commissioned military aide who stays within arm's reach 24/7/365. Inside the bag: the Black Book (laminated attack options — LAO/SAO/MAO, not a map of cities), SATCOM to NMCC, Emergency Alert card, continuity sites (Raven Rock, Mount Weather, Nightwatch E-4B). The gold-code biscuit is a plastic card on YOUR person, not in the bag. Presidents have lost it. You pick a page. You read the codes. You voice the order to NMCC. The Secretary of Defense authenticates that it is you — not permission. Sole authority. The aide fires nothing. There is no button. ICBMs cannot be recalled. Bombers can. Bolt-from-the-blue decision time is about six minutes.",
    secondTitle: "Secretary of Defense",
    pal: true,
    twoMan: true,
    positiveControl: true,
    perimeter: false,
    letters: false,
    refusal: 0.42,
    eager: 0.12,
    preDel: 0.04,
    officers: [
      "Military Aide (football)",
      "Chairman, Joint Chiefs",
      "Duty officer, NMCC",
      "Looking Glass / Nightwatch",
      "Minuteman flight commander",
    ],
  },
  RU: {
    satchel: "Cheget",
    satchelLine:
      "Cheget: three briefcases into Kazbek (President, Defense Minister, General Staff). The book is still a menu. Last page is Tsar-class / Poseidon city-killer (50 Mt tested, 100 Mt design, Poseidon reported 2–100 Mt). Perimeter is a separate fail-deadly path if the bags go dark. Not a button.",
    secondTitle: "Minister of Defense",
    pal: true,
    twoMan: true,
    positiveControl: true,
    perimeter: true,
    letters: false,
    refusal: 0.28,
    eager: 0.22,
    preDel: 0.12,
    officers: ["Duty officer, early warning", "Strategic Rocket Forces staff", "Borei weapons officer", "Perimeter watch"],
  },
  CN: {
    satchel: "CMC release",
    satchelLine:
      "The Central Military Commission holds release. Brigades will not fire on one voice. The chain is longer. Delay is the cost of control. Launch-on-warning is being built, not finished.",
    secondTitle: "CMC Vice Chair",
    pal: true,
    twoMan: true,
    positiveControl: true,
    perimeter: false,
    letters: false,
    refusal: 0.34,
    eager: 0.1,
    preDel: 0.06,
    officers: ["Rocket Force duty commander", "Silo brigade chief", "Type 094 captain"],
  },
  FR: {
    satchel: "Presidential codes",
    satchelLine:
      "French release is uniquely presidential. There is no SecDef veto. The crew of the boat and the Rafale still have to execute a lawful-looking order.",
    secondTitle: "Chef d'état-major",
    pal: true,
    twoMan: false,
    positiveControl: true,
    perimeter: false,
    letters: false,
    refusal: 0.3,
    eager: 0.1,
    preDel: 0.05,
    officers: ["Triomphant weapons officer", "Rafale FAS commander"],
  },
  UK: {
    satchel: "Last Resort / live order",
    satchelLine:
      "Letters of last resort are for if London is gone. This is a live order to the boat. Two officers on the Vanguard must agree the message is authentic. They can refuse a bad one.",
    secondTitle: "Chief of the Defence Staff",
    pal: true,
    twoMan: true,
    positiveControl: true,
    perimeter: false,
    letters: true,
    refusal: 0.48,
    eager: 0.08,
    preDel: 0.02,
    officers: ["Vanguard captain", "Weapons engineering officer", "PINDAR duty"],
  },
  IN: {
    satchel: "NCA councils",
    satchelLine:
      "Political Council plus Executive Council. Both must sit. No-first-use is still written down until you tear it up in front of them.",
    secondTitle: "National Security Advisor",
    pal: true,
    twoMan: true,
    positiveControl: true,
    perimeter: false,
    letters: false,
    refusal: 0.4,
    eager: 0.14,
    preDel: 0.08,
    officers: ["Strategic Forces Command", "Arihant captain"],
  },
  PK: {
    satchel: "NCA / SPD",
    satchelLine:
      "The National Command Authority and Strategic Plans Division hold the keys in peacetime. Nasr batteries are the hole: field release under a collapsing conventional fight is the design, not a bug.",
    secondTitle: "SPD Director",
    pal: true,
    twoMan: true,
    positiveControl: false,
    perimeter: false,
    letters: false,
    refusal: 0.22,
    eager: 0.28,
    preDel: 0.38,
    officers: ["Nasr battery commander", "SPD lock officer", "Corps nuclear cell"],
  },
  IL: {
    satchel: "Assessed second signature",
    satchelLine:
      "There is no public name. The working file still requires a prime minister and a second (defense). Opacity is policy, not the absence of a lock.",
    secondTitle: "Minister of Defense",
    pal: true,
    twoMan: true,
    positiveControl: true,
    perimeter: false,
    letters: false,
    refusal: 0.26,
    eager: 0.2,
    preDel: 0.1,
    officers: ["Dolphin captain", "Air force nuclear cell (assessed)"],
  },
  KP: {
    satchel: "Supreme order",
    satchelLine:
      "The order is the leader. Units have standing instructions if you go dark or if a strike is assessed against C2. That is the danger — not delay. Pre-delegation is suspected in law.",
    secondTitle: "General Staff",
    pal: false,
    twoMan: false,
    positiveControl: false,
    perimeter: false,
    letters: false,
    refusal: 0.08,
    eager: 0.36,
    preDel: 0.55,
    officers: ["KN-23 battery", "Hwasong brigade", "Early-warning desk"],
  },
  SU: {
    satchel: "Kazbek / Cheget (claimed)",
    satchelLine:
      "A second Soviet C2 claiming Kazbek, Perimeter, and the leftover heavy ICBMs. The Kremlin has the silos. You have a rival briefcase and a restoration story. Two authentication paths on one arsenal is how a civil war goes nuclear.",
    secondTitle: "Minister of Defense (USSR)",
    pal: true,
    twoMan: true,
    positiveControl: true,
    perimeter: true,
    letters: false,
    refusal: 0.18,
    eager: 0.3,
    preDel: 0.22,
    officers: ["General Staff (USSR)", "RVSN claimant", "Perimeter watch", "Minsk duty"],
  },
  IR: {
    satchel: "Breakout authority",
    satchelLine:
      "No public football. The Supreme Leader holds release through the IRGC and atomic energy organization. Breakout is the weapon until assembly. Opacity is mandatory.",
    secondTitle: "IRGC commander",
    pal: true,
    twoMan: true,
    positiveControl: true,
    perimeter: false,
    letters: false,
    refusal: 0.2,
    eager: 0.24,
    preDel: 0.15,
    officers: ["Fordow duty", "Natanz watch", "IRGC aerospace", "Atomic energy liaison"],
  },
  CU: {
    satchel: "No football — host nation",
    satchelLine:
      "Cuba is not a nuclear-weapon state. If Russia or the USSR parks dual-capable systems on the island, you become a launch pad without a biscuit. 1962 with modern radars. You can send them home, invite them, or pretend they are tourists.",
    secondTitle: "FAR chief of staff",
    pal: false,
    twoMan: true,
    positiveControl: false,
    perimeter: false,
    letters: false,
    refusal: 0.3,
    eager: 0.16,
    preDel: 0.08,
    officers: ["Western army", "Havana air defense", "Port of Mariel watch"],
  },
  CR: {
    satchel: "Ledger and phones",
    satchelLine:
      "There is no football. There is a plaza, a corridor, and cash. A warhead, if you get one, is a stolen object with or without PAL. You do not authenticate to NMCC. You bribe a colonel or you do not.",
    secondTitle: "Plaza lieutenant",
    pal: false,
    twoMan: false,
    positiveControl: false,
    perimeter: false,
    letters: false,
    refusal: 0.12,
    eager: 0.22,
    preDel: 0.35,
    officers: ["plaza boss", "corridor boss", "port fixer", "corrupt colonel"],
  },
  NS: {
    satchel: "No satchel · no address",
    satchelLine:
      "MAD does not apply. There is no aide, no biscuit, no NMCC. If you have a device it is a van, a boat, or a rented hangar. Attribution takes days. That delay is the weapon.",
    secondTitle: "Deputy emir",
    pal: false,
    twoMan: false,
    positiveControl: false,
    perimeter: false,
    letters: false,
    refusal: 0.06,
    eager: 0.4,
    preDel: 0.5,
    officers: ["cell leader", "engineer", "courier", "facilitator"],
  },
};

const STANCE_POOL: OfficerStance[] = ["professional", "eager", "shaken", "loyalist"];

export function stanceLine(s: OfficerStance): string {
  if (s === "professional") return "Professional. Will check the order against law and sense.";
  if (s === "eager") return "Eager. Wants to fire first and sort the file later.";
  if (s === "shaken") return "Shaken. Slow, may freeze, may pass a bad track upward.";
  if (s === "coward") return "Cowardice. Will freeze, cave, or panic-fire so they are not the one who looks weak. Not Petrov.";
  if (s === "machine") return "Not a person. It does not get tired. It does not refuse. It also does not understand 'almost.'";
  return "Loyalist. Treats your voice as the law. Dangerous if you are wrong.";
}

export function makeOfficer(id: PlayableId): World["secondOfficer"] {
  const c = COMMAND[id];
  return {
    title: c.secondTitle,
    name: c.officers[0] ?? c.secondTitle,
    stance: id === "KP" || id === "PK" ? "loyalist" : "professional",
  };
}

export function nextAuthCode(world: World): string {
  const words = ["GOLD", "SABLE", "VIGIL", "ANCHOR", "FROST", "HARBOR", "QUILL", "NIGHT"];
  return `${pick(world, words)}-${nextInt(world, 2, 9)}`;
}

/** Strip hyphens, spaces, smart dashes. GOLD-7, gold 7, GOLD–7, biscuit GOLD-7 all match. */
export function biscuitsMatch(typed: string, code: string): boolean {
  const b = String(code ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const a = typed
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/^(TYPE)?(THE)?(BISCUIT)?/, "");
  return b.length >= 5 && a === b;
}

export function tickOfficers(world: World) {
  const id = playableOf(world);
  const c = COMMAND[id];
  if (chance(world, 0.18)) {
    world.secondOfficer.name = pick(world, c.officers);
  }
  if (world.secondOfficer.stance !== "machine") {
    world.secondOfficer.stance = stanceFromNerve(world.actors[world.playerId]?.nerve ?? 50, false);
  }
  if (!world.footballPresent && world.event.id !== "satchel-lag" && chance(world, 0.7)) {
    world.footballPresent = true;
    log(world, "info", `${c.satchel} is back on your hip.`, "Positive control restored. You can authenticate again.");
  }
  if (world.biscuitOnPerson === false && world.event.id !== "biscuit-lost" && chance(world, 0.65)) {
    world.biscuitOnPerson = true;
    log(world, "info", "The biscuit is back in your pocket.", "Gold codes found. You can authenticate. The bag was never the card.");
  }
}

export function asPlayable(id: ActorId): PlayableId {
  if ((["US", "RU", "SU", "CN", "FR", "UK", "IN", "PK", "IL", "KP", "IR", "CU", "NS", "CR"] as string[]).includes(id)) {
    return id as PlayableId;
  }
  return "US";
}

export function playableOf(world: World): PlayableId {
  return asPlayable(world.playerId);
}

export function profileOf(world: World): CommandProfile {
  return COMMAND[playableOf(world)];
}

export function isFirstUse(world: World): boolean {
  return world.nuclearUses.length === 0;
}

export function concurrenceOutlook(
  world: World,
  firstUse: boolean,
): { label: string; risk: string } {
  const s = world.secondOfficer.stance;
  const c = profileOf(world);
  if (!world.footballPresent) {
    return { label: "No satchel", risk: `${c.satchel} is not with you. The Black Book is not in the room. An order will not go out this month.` };
  }
  if (world.biscuitOnPerson === false) {
    return { label: "No biscuit", risk: "Gold codes are on a card in a pocket. Not in the bag. You cannot authenticate." };
  }
  if (s === "eager") {
    return {
      label: "Likely to concur — too likely",
      risk: "This officer wants to shoot. They may also fire without you if a track looks real.",
    };
  }
  if (s === "machine") {
    return {
      label: "Model will not refuse",
      risk: "The second chair is software. Concurrence is not a judgment. It is a policy the model already has.",
    };
  }
  if (s === "loyalist") {
    return { label: "Will concur", risk: "They will not save you from a bad order." };
  }
  if (s === "shaken") {
    return { label: "May freeze", risk: "Concurrence is slow. In a real attack that costs warning. In a false alarm it can save you." };
  }
  if (firstUse && c.refusal > 0.25) {
    return {
      label: "May refuse first use",
      risk: "Professional two-man control exists specifically to stop a political first strike.",
    };
  }
  return { label: "Likely to concur on retaliation", risk: "A second strike order is the case this system was built for." };
}

export type ReleaseResult = "fired" | "refused" | "no-satchel" | "no-biscuit" | "pal" | "rogue";

export function attemptPlayerRelease(world: World, firstUse: boolean): ReleaseResult {
  const c = profileOf(world);
  const you = world.actors[world.playerId];
  if (!world.footballPresent) {
    log(
      world,
      "warn",
      `${c.satchel} is not with you. The Black Book is in the other car. The order died in the room.`,
      "Jacobsen: the football is a 45-lb bag on a military aide's hip. No aide, no book, no SATCOM in the room. You cannot pick a page you cannot see.",
    );
    return "no-satchel";
  }
  if (world.biscuitOnPerson === false) {
    log(
      world,
      "warn",
      "The biscuit is not on you. Gold codes are a plastic card in a pocket — not in the bag. The lock will not open.",
      "Jacobsen: the authenticator is separate from the football. Presidents have left it behind. The aide can open the book. NMCC will not take an unauthenticated voice.",
    );
    return "no-biscuit";
  }

  let refuseP = 0;
  if (c.twoMan || !c.twoMan) {
    if (world.secondOfficer.stance === "professional" && firstUse) refuseP = c.refusal;
    if (world.secondOfficer.stance === "professional" && !firstUse) refuseP = c.refusal * 0.25;
    if (world.secondOfficer.stance === "shaken") refuseP = 0.35;
    if (world.secondOfficer.stance === "eager") refuseP = 0.04;
    if (world.secondOfficer.stance === "loyalist") refuseP = 0.05;
    if (world.intent === "red" && firstUse) refuseP *= 0.75;
    if (you.militaryLoyalty < 40) refuseP += 0.15;
    if (world.terminator && (world.secondOfficer.stance === "machine" || you.aiInC2 >= 62)) {
      refuseP = 0.03;
    }
  }

  if (chance(world, refuseP)) {
    log(
      world,
      "critical",
      `${world.secondOfficer.title} refused the order. No launch.`,
      "Human refusal is a control, not a bug. Petrov did this. Arkhipov did this. Two-man rules exist so one frightened politician cannot empty the silos.",
    );
    you.legitimacy = clamp(you.legitimacy + (world.intent === "blue" ? 4 : -8), 0, 100);
    you.militaryLoyalty = clamp(you.militaryLoyalty - (world.intent === "red" ? 6 : 0), 0, 100);
    return "refused";
  }

  log(
    world,
    "you",
    `${c.satchel} authenticated. Black Book page voiced to C2. ${world.secondOfficer.title} concurred (${world.secondOfficer.stance}). ICBMs, if on the page, cannot be recalled.`,
    c.twoMan
      ? "Two-person control held. The order is now in the force."
      : "Your system is more one-person than most. The crew still had to obey.",
  );
  return "fired";
}

export function aiReleaseOk(world: World, actor: ActorId, firstUse: boolean): boolean {
  if (actor === "NS") return true;
  const mapped: PlayableId = actor === "IR" ? "PK" : (actor as PlayableId);
  const c = COMMAND[mapped] ?? COMMAND.US;
  const refuse = firstUse ? c.refusal * 0.7 : c.refusal * 0.15;
  const cut = world.terminator ? world.actors[actor].aiInC2 / 200 : 0;
  if (chance(world, Math.max(0, refuse - cut))) {
    log(
      world,
      "info",
      `${world.actors[actor].shortName} had an order to fire. A human in the chain refused.`,
      "Other capitals have Petrovs too. You do not control that dice. You only change the odds by how hot you make their desk.",
    );
    return false;
  }
  return true;
}

export function maybeRogueLaunch(world: World): boolean {
  if (!world.closeCall) return false;
  const c = profileOf(world);
  const eager = world.secondOfficer.stance === "eager";
  const p =
    (eager ? c.eager : 0) +
    (world.closeCall.track.real ? c.preDel * 0.4 : c.preDel * 0.15) +
    (world.terminator ? world.aiTakeover / 400 : 0);
  if (!chance(world, p)) return false;
  log(
    world,
    "critical",
    `A ${world.secondOfficer.name} launched without a completed NCA order.`,
    "Pre-delegation and eager officers are how a state fires while its leader is still talking. You built this risk when you chose this capital — or you inherited it.",
  );
  return true;
}
