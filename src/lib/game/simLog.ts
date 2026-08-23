import type { LogEntry, World } from "./types";

const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

let seq = 0;

export function log(
  world: World,
  kind: LogEntry["kind"],
  text: string,
  why: string,
) {
  seq += 1;
  world.log.unshift({
    id: `${world.turn}-${seq}`,
    turn: world.turn,
    date: `${MONTHS[world.month]!} ${world.year}`,
    text,
    why,
    kind,
  });
  if (world.log.length > 80) world.log.length = 80;
}
