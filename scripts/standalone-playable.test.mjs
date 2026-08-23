import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";
import { gunzipSync } from "node:zlib";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const previewDir = join(root, "play/v4b");
const partNames = Array.from({ length: 13 }, (_, index) =>
  `part-${String(index + 1).padStart(2, "0")}.txt`,
);

function loadStandaloneHtml() {
  const encoded = partNames
    .map((name) => readFileSync(join(previewDir, name), "utf8"))
    .join("");
  return gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");
}

test("standalone loader references every immutable payload chunk", () => {
  const loader = readFileSync(join(previewDir, "index.html"), "utf8");
  for (const name of partNames) assert.match(loader, new RegExp(name.replace(".", "\\.")));
  assert.match(loader, /DecompressionStream\('gzip'\)/);
  assert.match(loader, /Unable to load THRESHOLD/);
});

test("standalone payload decodes and its inline application script parses", () => {
  const html = loadStandaloneHtml();
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /THRESHOLD — Playable Command Preview v4/);
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, "standalone application script missing");
  assert.doesNotThrow(() => new Script(script));
});

test("execute flow visibly advances through choose, resolve, review, and continue", () => {
  const html = loadStandaloneHtml();
  for (const marker of [
    "Choose",
    "Execute",
    "Review",
    "Resolving decision",
    "Turn ${r.turn} complete",
    "Continue to turn ${state.turn}",
    "Last decision resolved",
  ]) {
    assert.ok(html.includes(marker), `missing Execute-flow marker: ${marker}`);
  }
  for (const action of [
    "Verify Evidence",
    "Open Human Channel",
    "Reinforce Resilience",
    "Humanitarian Surge",
    "Hold Position",
  ]) {
    assert.ok(html.includes(action), `missing standalone action: ${action}`);
  }
});

test("short mobile screens reserve space above fixed Execute controls", () => {
  const html = loadStandaloneHtml();
  assert.match(html, /padding-bottom:calc\(224px \+ var\(--safe-bottom\)\)/);
  assert.match(html, /scroll-margin-bottom:calc\(196px \+ var\(--safe-bottom\)\)/);
  assert.match(html, /bottom:calc\(78px \+ var\(--safe-bottom\)\)/);
  assert.match(html, /viewport-fit=cover/);
  assert.match(html, /aria-live=/);
});
