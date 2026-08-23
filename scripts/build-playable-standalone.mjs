#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(root, path), "utf8");

const [index, baseCss, feedbackCss, ...parts] = await Promise.all([
  read("play/v2/index.html"),
  read("play/v2/base.css"),
  read("play/v2/feedback.css"),
  read("play/v2/app.part1.js"),
  read("play/v2/app.part2.js"),
  read("play/v2/app.part3.js"),
]);

const stylesheet = '<link rel="stylesheet" href="./styles.css" />';
const loader = '<script src="./app.js"></script>';
if (!index.includes(stylesheet)) throw new Error("v2 stylesheet marker not found");
if (!index.includes(loader)) throw new Error("v2 loader marker not found");

const inlineCss = `<style>\n${baseCss}\n${feedbackCss}\n</style>`;
const inlineRuntime = `<script>\n${parts.join("\n")}\n</script>`;
const output = index
  .replace(stylesheet, inlineCss)
  .replace(loader, inlineRuntime)
  .replace("Playable Command Preview v2", "Playable Command Preview v2.3 — Standalone")
  .replace("Portable playable preview · UX v2.2", "Portable playable preview · UX v2.3 standalone");

for (const forbidden of ["<script src=", '<link rel="stylesheet"']) {
  if (output.toLowerCase().includes(forbidden)) {
    throw new Error(`standalone output still contains external dependency marker: ${forbidden}`);
  }
}
for (const required of ["Begin watch", "Resolving decision", "Turn ${r.turn} complete", "continueResolution", "threshold.portable.v4"]) {
  if (!output.includes(required)) throw new Error(`standalone output missing required behavior marker: ${required}`);
}

const target = resolve(root, "play/standalone/index.html");
await mkdir(dirname(target), { recursive: true });
await writeFile(target, output, "utf8");
console.log(`Wrote ${target} (${Buffer.byteLength(output)} bytes)`);
