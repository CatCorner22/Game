#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { constants as osConstants, tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const scriptsDir = join(root, "scripts");
const pwaTest = join(scriptsDir, "grok-pwa-plugin.test.mjs");

function collectTests(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...collectTests(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".test.mjs")) files.push(fullPath);
  }
  return files.sort();
}

function runNode(args, cwd = root) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`[test-runner] ${result.error.message}`);
    process.exit(127);
  }
  if (result.signal) {
    const signalNumber = osConstants.signals[result.signal];
    process.exit(128 + (typeof signalNumber === "number" ? signalNumber : 1));
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const scriptTests = collectTests(scriptsDir).filter(
  (testPath) => resolve(testPath) !== resolve(pwaTest),
);
runNode(["--test", ...scriptTests]);

// Generic PWA helper tests must not inherit this app's site.json or public/og.jpg.
const isolatedRoot = mkdtempSync(join(tmpdir(), "grok-pwa-tests-"));
try {
  runNode(["--test", pwaTest], isolatedRoot);
} finally {
  rmSync(isolatedRoot, { recursive: true, force: true });
}

runNode([
  "--experimental-strip-types",
  "--test",
  join(root, "src/lib/app-data/app-data.test.ts"),
  join(root, "src/lib/auth/gate-identity.test.ts"),
]);
