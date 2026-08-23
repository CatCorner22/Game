import type { ActionIntensity, ActionKind, ActorId, PlayerAction } from "./types";

export interface ActionDef {
  kind: ActionKind;
  label: string;
  verb: string;
  blurb: string;
  intensities: [string, string, string];
  intensityHint: [string, string, string];
  needsTarget: boolean;
}

export const ACTIONS: ActionDef[] = [
  {
    kind: "hold",
    label: "HOLD",
    verb: "Hold",
    blurb: "Do not move. Sometimes the correct order is no order.",
    intensities: ["Hold", "Hold", "Hold"],
    intensityHint: ["No change to posture or policy.", "No change.", "No change."],
    needsTarget: false,
  },
  {
    kind: "diplomacy",
    label: "DIPLOMACY",
    verb: "Talk",
    blurb: "Hotline, talks, summit. Weight 1 is the dedicated line: ask whether a launch is hostile.",
    intensities: ["Hotline", "Talks", "Summit"],
    intensityHint: [
      "Dedicated line. Ask if a track is hostile. They can answer, lie, or not pick up.",
      "Public process. Audience costs if you later strike.",
      "Leaders in a room. Biggest swing. Failure is also public.",
    ],
    needsTarget: true,
  },
  {
    kind: "pressure",
    label: "PRESSURE",
    verb: "Pressure",
    blurb: "Statements, sanctions, coalitions. Hurts their economy. Raises their nationalism.",
    intensities: ["Statement", "Sanctions", "Coalition"],
    intensityHint: [
      "Words. Cheap. Mostly signaling.",
      "Sanctions bite. They also unify the target against you.",
      "Bring allies. Stronger, but you spend alliance capital.",
    ],
    needsTarget: true,
  },
  {
    kind: "posture",
    label: "POSTURE",
    verb: "Posture",
    blurb: "Alert, boats to sea, bombers generated. File a notice so their satellites are not a surprise. Safer against surprise. More likely to cause war.",
    intensities: ["Quiet alert", "Generate", "Maximum"],
    intensityHint: [
      "SSBNs to sea. Optionally notify. Alert down one if already calm.",
      "Bombers generated, dual-capable aircraft on strip. Visible. A notice says 'exercise.'",
      "ICBM generate. You are telling the world a strike is possible. Notify or they read bolt-from-the-blue.",
    ],
    needsTarget: true,
  },
  {
    kind: "intelligence",
    label: "INTEL",
    verb: "Collect",
    blurb: "Satellites, radar, and people who live next to silos. Confidence is a number. Raise it.",
    intensities: ["Review", "Collect", "Intrusive"],
    intensityHint: [
      "Re-read the file. Task your cells for a fence-line report.",
      "Satellites plus HUMINT. On yourself: look for their spies in your missile towns.",
      "Intrusive. Can name a mole. Can burn the person you have living near their hatches.",
    ],
    needsTarget: true,
  },
  {
    kind: "covert",
    label: "COVERT",
    verb: "Covert",
    blurb: "Insert a spy next to their launch site. On yourself: mole hunt. Exposure starts crises.",
    intensities: ["Insert", "Run", "Direct action"],
    intensityHint: [
      "Put a person in town — hardware store, dacha, boatyard. They live there.",
      "Run the cell, or hunt moles on your own fields if the target is you.",
      "Sabotage via the spy, or roll up a named hostile cell. Burns cover.",
    ],
    needsTarget: true,
  },
  {
    kind: "kill",
    label: "KILL",
    verb: "Kill switch",
    blurb: "Internet and electricity. On yourself: isolation. On them: attack. Dedicated hotlines can survive a net cut. Radar does not survive a grid cut.",
    intensities: ["Internet", "Electricity", "Both"],
    intensityHint: [
      "National net isolation or a strike on theirs. Cloud models starve. Spies and MOLINK still work.",
      "Grid down. Unrest. Radar and fusion nodes go dark. Silos last on diesel. Custody accidents get more likely.",
      "Net + grid. On yourself this is the hard air-gap. On them it looks like the opening of a disarming strike.",
    ],
    needsTarget: true,
  },
  {
    kind: "employ",
    label: "EMPLOY",
    verb: "Employ",
    blurb: "Force. Conventional is still a threshold. Nuclear opens the Black Book — packaged options, not a button.",
    intensities: ["Conventional", "Open the book", "Major page"],
    intensityHint: [
      "Raids, strikes, interdiction. May hit dual-use command.",
      "Opens the football/Cheget. You will pick a Black Book page (LAO/SAO) and type gold codes.",
      "Opens the book on a major page. MAO, cities, or Tsar-class if that is in your satchel.",
    ],
    needsTarget: true,
  },
];

export function actionDef(kind: ActionKind): ActionDef {
  return ACTIONS.find((a) => a.kind === kind)!;
}

export function defaultAction(target: ActorId | null): PlayerAction {
  return { kind: "hold", intensity: 1, target };
}

export const ALLY_IDS: ActorId[] = ["UK", "FR"];
export const ADVERSARY_IDS: ActorId[] = ["RU", "CN", "KP", "IR", "NS"];
