import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("commercial scenario catalog contains broad, metadata-rich coverage", async () => {
  const text = await source("src/lib/game/scenarios.ts");
  const scenarioCount = (text.match(/defaultAI:/g) ?? []).length;
  assert.ok(scenarioCount >= 18, `expected at least 18 scenarios, found ${scenarioCount}`);
  for (const field of ["variables:", "dependencies:", "contentNote:", "learningGoal:", "defaultDeadhand:"]) {
    assert.ok(text.includes(field), `missing scenario field ${field}`);
  }
  assert.match(text, /public-health-cascade/);
  assert.match(text, /contamination-corridor/);
  assert.match(text, /deadhand-dilemma/);
  assert.match(text, /machine-chorus/);
  assert.match(text, /malmstrom-1967/);
  assert.match(text, /"phenomenology"/);
});

test("omnibus research doc links close calls and phenomenology", async () => {
  const text = await source("docs/omnibus-close-calls-and-phenomenology.md");
  assert.match(text, /black-brant-1995/);
  assert.match(text, /malmstrom-1967/);
  assert.match(text, /DEFCON/);
});

test("mock command intelligence is local, inspectable, and human-vetoed", async () => {
  const text = await source("src/lib/game/strategicSystems.ts");
  for (const field of [
    "calibration",
    "dataIntegrity",
    "dissent",
    "hallucinationRisk",
    "automationBias",
    "alignment",
    "humanVeto",
    "verificationGates",
  ]) {
    assert.ok(text.includes(field), `missing strategic variable ${field}`);
  }
  assert.doesNotMatch(text, /\bfetch\s*\(/);
  assert.doesNotMatch(text, /XMLHttpRequest|WebSocket|EventSource/);
  assert.match(text, /No real trigger logic/);
});

test("mobile command shell reserves safe areas and avoids simultaneous map overlays", async () => {
  const text = await source("src/components/game/PlayScreen.tsx");
  assert.match(text, /safe-area-inset-top/);
  assert.match(text, /safe-area-inset-bottom/);
  assert.match(text, /MOBILE_TABS/);
  assert.match(text, /min-h-12/);
  assert.match(text, /!radarOpen && world\.closeCall/);
  assert.match(text, /world\.closeCall \? \(/);
});

test("player-facing setup includes content guidance and explicit abstract modes", async () => {
  const text = await source("src/components/game/TitleScreen.tsx");
  assert.match(text, /recommended 16\+/i);
  assert.match(text, /No real operational weapon/);
  assert.match(text, /DEADHAND_CONFIGS/);
  assert.match(text, /STRATEGIC_AI_CONFIGS/);
});
