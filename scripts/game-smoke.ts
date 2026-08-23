import { runIntegrityChecks } from "../src/lib/game/integrity.ts";

const result = runIntegrityChecks();
for (const c of result.checks) {
  console.log(`${c.ok ? "ok" : "FAIL"}  ${c.name}  ${c.detail}`);
}
if (!result.ok) {
  console.error("integrity failed");
  process.exit(1);
}
console.log(`${result.checks.length} checks passed`);
