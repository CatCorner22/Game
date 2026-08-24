import type { PlayableId, World } from "../types";

/**
 * How the room addresses you.
 *
 * Every scripted and generated line renders this rather than hardcoding "Mr.",
 * so a player who picks a different form is addressed correctly by everyone,
 * every time. The neutral variant is the default because it is the one that is
 * correct without the game having to assume anything about the player.
 */
export type AddressStyle = "neutral" | "masculine" | "feminine";

export const ADDRESS_STYLES: { id: AddressStyle; label: string }[] = [
  { id: "neutral", label: "Neutral" },
  { id: "masculine", label: "Mr." },
  { id: "feminine", label: "Madam" },
];

interface AddressForms {
  neutral: string;
  masculine: string;
  feminine: string;
  /** How the seat is referred to in the third person. */
  office: string;
}

const FORMS: Record<PlayableId, AddressForms> = {
  US: { neutral: "President", masculine: "Mr. President", feminine: "Madam President", office: "the President" },
  RU: { neutral: "President", masculine: "Mr. President", feminine: "Madam President", office: "the President" },
  SU: {
    neutral: "Comrade General Secretary",
    masculine: "Comrade General Secretary",
    feminine: "Comrade General Secretary",
    office: "the General Secretary",
  },
  CN: { neutral: "Chairman", masculine: "Mr. Chairman", feminine: "Madam Chairman", office: "the Chairman" },
  FR: {
    neutral: "President",
    masculine: "Monsieur le Président",
    feminine: "Madame la Présidente",
    office: "the President",
  },
  UK: { neutral: "Prime Minister", masculine: "Prime Minister", feminine: "Prime Minister", office: "the Prime Minister" },
  IN: { neutral: "Prime Minister", masculine: "Prime Minister", feminine: "Prime Minister", office: "the Prime Minister" },
  PK: { neutral: "Prime Minister", masculine: "Prime Minister", feminine: "Prime Minister", office: "the Prime Minister" },
  IL: { neutral: "Prime Minister", masculine: "Prime Minister", feminine: "Prime Minister", office: "the Prime Minister" },
  KP: {
    neutral: "Supreme Commander",
    masculine: "Supreme Commander",
    feminine: "Supreme Commander",
    office: "the Supreme Commander",
  },
  IR: { neutral: "Supreme Leader", masculine: "Supreme Leader", feminine: "Supreme Leader", office: "the Supreme Leader" },
  CU: {
    neutral: "First Secretary",
    masculine: "Compañero First Secretary",
    feminine: "Compañera First Secretary",
    office: "the First Secretary",
  },
  CR: { neutral: "Jefe", masculine: "Patrón", feminine: "Patrona", office: "the plaza" },
  NS: { neutral: "Emir", masculine: "Emir", feminine: "Emira", office: "the Emir" },
};

declare module "../types" {
  interface World {
    /** Which form of address the room uses for the player. */
    addressStyle?: AddressStyle;
  }
}

/** The vocative the room uses — "Mr. President", "Prime Minister", "Jefe". */
export function addressFor(world: World): string {
  const seat = (Object.keys(FORMS) as PlayableId[]).includes(world.playerId as PlayableId)
    ? (world.playerId as PlayableId)
    : "US";
  const forms = FORMS[seat];
  return forms[world.addressStyle ?? "neutral"];
}

/** Third-person reference to the office, for when advisors talk about you. */
export function officeFor(world: World): string {
  const seat = (Object.keys(FORMS) as PlayableId[]).includes(world.playerId as PlayableId)
    ? (world.playerId as PlayableId)
    : "US";
  return FORMS[seat].office;
}

export function addressVariants(seat: PlayableId): AddressForms {
  return FORMS[seat] ?? FORMS.US;
}
