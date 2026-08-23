import type { World } from "./types";

export interface PatrolStatus {
  boats: number;
  atSea: number;
  generated: boolean;
  warning: number;
  casdLine: string;
}

export function patrolStatus(world: World): PatrolStatus {
  const you = world.actors[world.playerId];
  const slbm = you.systems.filter((s) => s.kind === "slbm");
  const boats = slbm.reduce((n, s) => n + Math.max(1, s.launchers), 0);
  const fraction = you.alert >= 5 ? 0.95 : you.alert >= 4 ? 0.75 : you.alert >= 3 ? 0.55 : 0.4;
  const atSea = boats ? Math.max(1, Math.round(boats * fraction)) : 0;
  const generated = you.alert >= 4;
  const pid = world.playerId;
  let casdLine = "No SSBN leg on this seat. Generation is aircraft and TELs.";
  if (pid === "UK") {
    casdLine =
      atSea >= 1
        ? "CASD: at least one Vanguard on station. A missed window is designed — until it is a casualty."
        : "CASD broken. No boat on station. That is a political fact before it is a military one.";
  } else if (pid === "FR") {
    casdLine = atSea >= 1 ? "Triomphant on patrol. The force de frappe is at sea." : "No SSBN on station. Independence is a speech until a boat is out.";
  } else if (pid === "US") {
    casdLine = generated
      ? `Trident boats at sea ~${atSea}. Bombers generated. Visible.`
      : `Trident boats at sea ~${atSea}. Quiet alert. A notice still matters.`;
  } else if (pid === "RU" || pid === "SU") {
    casdLine = generated ? `Borei/Yars generate. Boats ~${atSea}.` : `Boats at sea ~${atSea}. Snap generate is the next step.`;
  } else if (pid === "CN") {
    casdLine = generated ? "Jin boats and TELs visible. Guam file is open." : `Jin boats ~${atSea}. Opacity is still the doctrine.`;
  } else if (slbm.length) {
    casdLine = `SSBN/SLBM launchers ${boats}. At sea ~${atSea}.`;
  }
  return { boats, atSea, generated, warning: you.warning, casdLine };
}
