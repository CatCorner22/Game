import type { ActorId, FlashKind } from "./types";

export function eventFlash(actor: ActorId): FlashKind | null {
  if (actor === "KP") return "korea";
  if (actor === "CN") return "taiwan";
  if (actor === "RU" || actor === "UK" || actor === "FR") return "nato-ru";
  if (actor === "SU") return "union";
  if (actor === "CU") return "cuba";
  if (actor === "CR") return "cartel";
  if (actor === "IR" || actor === "IL") return "iran";
  if (actor === "IN" || actor === "PK") return "kashmir";
  if (actor === "NS") return "terror";
  return null;
}
