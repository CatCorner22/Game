import type { PlayableId } from "../types";

/**
 * The body that actually meets.
 *
 * The rosters have always been real institutions -- the US list is a genuine
 * National Security Council, not a bag of job titles -- but nothing on screen
 * ever said so. The panel was headed "Staff split · not an order" and the
 * advisors were anonymous desk strings, so a player had no way to learn that
 * Pakistan decides this in a National Command Authority whose secretariat is the
 * Strategic Plans Division, or that Iran's Supreme National Security Council
 * seats the Supreme Leader's representatives above the President who chairs it.
 *
 * Naming the body is most of the education. `note` is the one thing worth
 * knowing about how that room actually works.
 */
export interface DecisionBody {
  /** What the body is called. */
  name: string;
  /** Short form for a cramped header. */
  short: string;
  /** How this particular room works, in one line. */
  note: string;
}

export const BODIES: Record<PlayableId, DecisionBody> = {
  US: {
    name: "National Security Council",
    short: "NSC",
    note: "Statutory advisers are the Chairman of the Joint Chiefs on military matters and the Director of National Intelligence on intelligence. Release authority is the President's alone.",
  },
  RU: {
    name: "Security Council of the Russian Federation",
    short: "Security Council",
    note: "Chaired by the President, run by its Secretary. It is not a debating chamber, and its permanent members have held their seats for a very long time.",
  },
  SU: {
    name: "Restorationist Defence Council",
    short: "Defence Council",
    note: "Claims continuity with Soviet command institutions. Which of its bodies actually holds release authority is exactly what nobody outside can establish.",
  },
  CN: {
    name: "Central Military Commission",
    short: "CMC",
    note: "Its Chairman holds the authority. The Vice-Chairmen, the Joint Staff Department and the Rocket Force commander are the people in the room.",
  },
  FR: {
    name: "Conseil de défense et de sécurité nationale",
    short: "Conseil de défense",
    note: "Employment rests with the President alone. There is no second signature in the French chain — a deliberate design choice, and a different one from the American two-person rule.",
  },
  UK: {
    name: "National Security Council",
    short: "NSC",
    note: "A Cabinet committee. The Chief of the Defence Staff and the intelligence chiefs attend; the Cabinet Secretary keeps the record.",
  },
  IN: {
    name: "Cabinet Committee on Security",
    short: "CCS",
    note: "Nuclear release runs through the Nuclear Command Authority, whose political council the Prime Minister chairs. The design keeps the decision civilian on purpose.",
  },
  PK: {
    name: "National Command Authority",
    short: "NCA",
    note: "Chaired by the Prime Minister. Its secretariat, the Strategic Plans Division, is the institutional memory and in practice the most consequential seat at the table.",
  },
  IL: {
    name: "Security Cabinet",
    short: "Security Cabinet",
    note: "A small room. The Chief of the General Staff and the heads of the three services attend, and it has acted without warning anybody before.",
  },
  KP: {
    name: "Central Military Commission",
    short: "CMC",
    note: "Formally a commission. In practice it answers to one person, and the room's function is to agree with him first and reason backwards from there.",
  },
  IR: {
    name: "Supreme National Security Council",
    short: "SNSC",
    note: "The President chairs it. The Supreme Leader's representatives sit in it and outrank him, which is the fact most outside analysis gets wrong.",
  },
  CU: {
    name: "National Defence Council",
    short: "Defence Council",
    note: "It has no arsenal and no veto over what a patron deploys on its soil. Its leverage is entirely in what it agrees to host.",
  },
  NS: {
    name: "The cell",
    short: "The cell",
    note: "There is no body, no record and nobody a state could negotiate with. That is the point, and it is what breaks deterrence.",
  },
  CR: {
    name: "The plaza",
    short: "The plaza",
    note: "A structure of colonels and corridors. It understands leverage perfectly and deterrence not at all.",
  },
};

export function bodyFor(seat: PlayableId): DecisionBody {
  return BODIES[seat] ?? BODIES.US;
}
