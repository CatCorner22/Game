#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4173/";
const outputDir = resolve(process.env.MOBILE_SMOKE_OUTPUT_DIR ?? "artifacts/mobile-smoke");
const viewports = [
  { name: "iphone", width: 390, height: 844 },
  { name: "narrow-android", width: 360, height: 800 },
];
const scenarioTitles = {
  "deadhand-dilemma": "Deadhand Dilemma",
  "signal-window": "The Nine-Minute Window",
};

await mkdir(outputDir, { recursive: true });

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitVisible(locator, label) {
  await locator.waitFor({ state: "visible", timeout: 20_000 }).catch((error) => {
    throw new Error(`${label} did not become visible: ${error.message}`);
  });
}

async function assertNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  invariant(
    dimensions.scrollWidth <= dimensions.clientWidth + 1,
    `${label} has horizontal overflow (${dimensions.scrollWidth}px > ${dimensions.clientWidth}px)`,
  );
  return dimensions;
}

async function screenshot(page, name) {
  const path = join(outputDir, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  return path;
}

async function chooseScenario(page, scenarioId) {
  const scenarioSelect = page.locator("select").nth(1);
  await waitVisible(scenarioSelect, "scenario selector");
  const title = scenarioTitles[scenarioId];
  invariant(title, `missing expected title for scenario ${scenarioId}`);
  const details = page.getByText(title, { exact: true });

  // The title screen is server-rendered and the scenario select is controlled,
  // so a change that lands before React is listening is simply lost and nothing
  // retries it. The old code slept a fixed second and hoped. Drive the same
  // interaction until application state actually agrees instead -- the
  // assertion below is unchanged, only the interaction is now reliable.
  for (let attempt = 0; attempt < 6; attempt += 1) {
    await page.waitForTimeout(attempt === 0 ? 1_000 : 500);
    await scenarioSelect.selectOption(scenarioId).catch(() => undefined);
    if (await details.isVisible().catch(() => false)) return;
  }

  // Still nothing. Say what we can see, so a CI-only failure is legible from
  // the log rather than needing the screenshot artifact.
  const value = await scenarioSelect.inputValue().catch(() => "<unreadable>");
  const options = await scenarioSelect
    .locator("option")
    .evaluateAll((els) => els.map((el) => el.value))
    .catch(() => []);
  const inDom = await details.count().catch(() => -1);
  const selectCount = await page.locator("select").count().catch(() => -1);
  await waitVisible(
    details,
    `${title} scenario details ` +
      `(select value "${value}", ${options.length} options, option present: ${options.includes(scenarioId)}, ` +
      `matching nodes in DOM: ${inDom}, selects on page: ${selectCount})`,
  );
}

/**
 * The first-watch tutorial, exercised rather than routed around.
 *
 * Each page here starts with empty storage, so every run is somebody's first
 * watch and the overlay is genuinely on screen — it used to be suppressed on
 * scenario watches, which is exactly the bug this now covers. Asserting it fits
 * the viewport and dismisses cleanly is worth more than skipping it would save.
 */
async function clearFirstWatchTutorial(page, spec, expected) {
  const dialog = page.getByRole("dialog").first();
  const showed = await dialog.isVisible({ timeout: expected ? 5_000 : 1_500 }).catch(() => false);
  if (!expected) {
    // Second watch in the same session: Skip persists, so it must stay gone.
    invariant(!showed, "first-watch tutorial came back after being dismissed");
    return;
  }
  invariant(showed, "first-watch tutorial did not appear on a fresh watch");

  const box = await dialog.boundingBox();
  invariant(box, "first-watch tutorial has no measurable box");
  invariant(box.x >= -1, "first-watch tutorial starts left of the viewport");
  invariant(box.x + box.width <= spec.width + 1, "first-watch tutorial runs off the right edge");
  invariant(box.y + box.height <= spec.height + 1, "first-watch tutorial runs off the bottom");

  const skip = page.getByRole("button", { name: "Skip", exact: true });
  await waitVisible(skip, "tutorial skip control");
  await skip.click();
  await dialog.waitFor({ state: "hidden", timeout: 5_000 });
}

async function beginWatch(page, spec, expectTutorial) {
  const begin = page.getByRole("button", { name: "Begin watch", exact: true });
  await waitVisible(begin, "Begin watch button");
  await begin.click();
  const nav = page.getByRole("navigation", { name: "Game views" });
  await waitVisible(nav, "mobile game navigation");
  await clearFirstWatchTutorial(page, spec, expectTutorial);
  return nav;
}

async function verifyBottomNavigation(page, nav, height) {
  const box = await nav.boundingBox();
  invariant(box, "mobile navigation has no measurable box");
  invariant(box.y >= 0, "mobile navigation begins above the viewport");
  invariant(box.y + box.height <= height + 1, "mobile navigation extends below the viewport");
  invariant(box.height >= 48, "mobile navigation is too short for reliable touch targets");
  return box;
}

async function exerciseViewport(browser, spec) {
  const page = await browser.newPage({
    viewport: { width: spec.width, height: spec.height },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
  });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(String(error?.message ?? error)));

  const evidence = [];
  try {
    const response = await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
    invariant(response && response.status() < 400, `title screen returned HTTP ${response?.status() ?? 0}`);
    await waitVisible(page.getByRole("button", { name: "Begin watch", exact: true }), "title screen");
    evidence.push({ step: "title", ...(await assertNoHorizontalOverflow(page, "title screen")) });

    await chooseScenario(page, "deadhand-dilemma");
    let nav = await beginWatch(page, spec, true);
    const navBox = await verifyBottomNavigation(page, nav, spec.height);

    const execute = page.getByRole("button", { name: "Execute", exact: true });
    await waitVisible(execute, "action control");
    await execute.scrollIntoViewIfNeeded();
    const executeBox = await execute.boundingBox();
    invariant(executeBox, "Execute button has no measurable box");
    invariant(
      executeBox.y + executeBox.height <= navBox.y + 1,
      "bottom navigation obscures the Execute control",
    );
    evidence.push({ step: "act", ...(await assertNoHorizontalOverflow(page, "Act view")) });
    await screenshot(page, `${spec.name}-01-act`);

    await nav.getByRole("button", { name: "Status", exact: true }).click();
    await waitVisible(page.getByText("Command intelligence", { exact: true }), "Status view");
    await waitVisible(page.getByText("Continuity protocol", { exact: true }), "continuity status");
    evidence.push({ step: "status", ...(await assertNoHorizontalOverflow(page, "Status view")) });
    await screenshot(page, `${spec.name}-02-status`);

    await nav.getByRole("button", { name: "Map", exact: true }).click();
    await waitVisible(page.locator("canvas").first(), "interactive globe");
    evidence.push({ step: "map", ...(await assertNoHorizontalOverflow(page, "Map view")) });

    const radar = page.getByRole("button", { name: "Radar", exact: true });
    await waitVisible(radar, "Radar button");
    await radar.click();
    await waitVisible(page.getByText("Radar evidence view", { exact: true }), "Radar sheet");
    invariant(
      (await page.getByText("Radar evidence view", { exact: true }).count()) === 1,
      "more than one radar sheet is mounted",
    );
    evidence.push({ step: "radar", ...(await assertNoHorizontalOverflow(page, "Radar sheet")) });
    await screenshot(page, `${spec.name}-03-radar`);
    await page.getByRole("button", { name: "Close", exact: true }).click();

    await page.getByRole("button", { name: "More", exact: true }).click();
    await waitVisible(page.getByRole("button", { name: "Settings", exact: true }), "command menu");
    evidence.push({ step: "command-menu", ...(await assertNoHorizontalOverflow(page, "command menu")) });
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    const settings = page.getByRole("dialog", { name: "Settings" });
    await waitVisible(settings, "Settings dialog");
    const settingsBox = await settings.boundingBox();
    invariant(settingsBox, "Settings dialog has no measurable box");
    invariant(settingsBox.y >= 0 && settingsBox.y + settingsBox.height <= spec.height + 1, "Settings dialog escapes the viewport");
    evidence.push({ step: "settings", ...(await assertNoHorizontalOverflow(page, "Settings dialog")) });
    await screenshot(page, `${spec.name}-04-settings`);
    await settings.getByRole("button", { name: "Close", exact: true }).click();

    await page.getByRole("button", { name: "More", exact: true }).click();
    await page.getByRole("button", { name: "Main menu", exact: true }).click();
    await waitVisible(page.getByRole("button", { name: "Begin watch", exact: true }), "returned title screen");

    await chooseScenario(page, "signal-window");
    nav = await beginWatch(page, spec, false);
    await nav.getByRole("button", { name: "Map", exact: true }).click();
    await waitVisible(page.getByText(/Close call · unverified track/i), "close-call card");
    invariant(
      !(await page.getByText("Radar evidence view", { exact: true }).isVisible()),
      "radar sheet is visible before the player opens it",
    );
    await page.getByRole("button", { name: "Radar", exact: true }).click();
    await waitVisible(page.getByText("Radar evidence view", { exact: true }), "close-call radar sheet");
    invariant(
      !(await page.getByText(/Close call · unverified track/i).isVisible()),
      "close-call card overlaps the open radar sheet",
    );
    evidence.push({ step: "close-call-radar", ...(await assertNoHorizontalOverflow(page, "close-call radar")) });
    await screenshot(page, `${spec.name}-05-close-call-radar`);
    await page.getByRole("button", { name: "Close", exact: true }).click();
    await waitVisible(page.getByText(/Close call · unverified track/i), "restored close-call card");

    invariant(pageErrors.length === 0, `page errors: ${pageErrors.join(" | ")}`);
    const severeConsoleErrors = consoleErrors.filter(
      (message) => !/Failed to load resource|favicon/i.test(message),
    );
    invariant(
      severeConsoleErrors.length === 0,
      `console errors: ${severeConsoleErrors.join(" | ")}`,
    );

    return { viewport: spec, ok: true, evidence, consoleErrors, pageErrors };
  } catch (error) {
    await screenshot(page, `${spec.name}-failure`).catch(() => undefined);
    return {
      viewport: spec,
      ok: false,
      evidence,
      consoleErrors,
      pageErrors,
      error: String(error?.message ?? error),
    };
  } finally {
    await page.close();
  }
}

let browser;
const results = [];
try {
  browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-gl=swiftshader",
    ],
  });
  for (const viewport of viewports) {
    results.push(await exerciseViewport(browser, viewport));
  }
} finally {
  await browser?.close();
}

const reportPath = join(outputDir, "report.json");
await writeFile(reportPath, `${JSON.stringify({ baseUrl, results }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ reportPath, results }, null, 2));

const failures = results.filter((result) => !result.ok);
if (failures.length) {
  throw new Error(failures.map((failure) => `${failure.viewport.name}: ${failure.error}`).join("\n"));
}
