#!/usr/bin/env node
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4174/play/standalone/";
const viewports = [
  { name: "iphone", width: 390, height: 844, mobile: true },
  { name: "desktop", width: 1365, height: 900, mobile: false },
];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitVisible(locator, label) {
  await locator.waitFor({ state: "visible", timeout: 15_000 }).catch((error) => {
    throw new Error(`${label} did not become visible: ${error.message}`);
  });
}

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  for (const spec of viewports) {
    const context = await browser.newContext({
      viewport: { width: spec.width, height: spec.height },
      isMobile: spec.mobile,
      hasTouch: spec.mobile,
    });
    const page = await context.newPage();
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(String(error?.message ?? error)));
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    const response = await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
    invariant(response && response.status() < 400, `${spec.name}: HTTP ${response?.status() ?? 0}`);

    const begin = page.locator("#start");
    await waitVisible(begin, `${spec.name}: Begin watch`);
    await begin.click();

    const reviewOptions = page.locator("#goDecision");
    await waitVisible(reviewOptions, `${spec.name}: Review decision options`);
    await reviewOptions.click();

    const verify = page.locator('[data-action="verify"]');
    await waitVisible(verify, `${spec.name}: Verify Evidence`);
    await verify.click();

    const execute = page.locator("#execute");
    await waitVisible(execute, `${spec.name}: Execute decision`);
    invariant(!(await execute.isDisabled()), `${spec.name}: Execute stayed disabled after selection`);
    await execute.click();

    const resultDialog = page.locator("#resultDialog");
    await waitVisible(resultDialog, `${spec.name}: Turn resolution dialog`);
    const resultTitle = page.locator("#resultTitle");
    invariant(
      (await resultTitle.textContent())?.trim() === "Turn 1 complete",
      `${spec.name}: expected Turn 1 complete result`,
    );
    invariant(
      /next decision\s*·\s*turn 2/i.test((await page.locator(".next-preview").textContent()) ?? ""),
      `${spec.name}: next-turn preview missing`,
    );

    const continueButton = page.locator("#continueResolution");
    await waitVisible(continueButton, `${spec.name}: Continue to turn 2`);
    await continueButton.click();
    await page.waitForFunction(() => /Turn 2\//i.test(document.querySelector(".brand span")?.textContent ?? ""));

    invariant(pageErrors.length === 0, `${spec.name}: page errors: ${pageErrors.join(" | ")}`);
    const severe = consoleErrors.filter((message) => !/favicon|failed to load resource/i.test(message));
    invariant(severe.length === 0, `${spec.name}: console errors: ${severe.join(" | ")}`);

    const overflow = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    invariant(overflow.scrollWidth <= overflow.clientWidth + 1, `${spec.name}: horizontal overflow`);
    console.log(`PASS ${spec.name}: initialized, resolved turn 1, continued to turn 2`);
    await context.close();
  }
} finally {
  await browser.close();
}
