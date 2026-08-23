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

    const begin = page.getByRole("button", { name: "Begin watch", exact: true });
    await begin.waitFor({ state: "visible", timeout: 15_000 });
    await begin.click();

    const reviewOptions = page.getByRole("button", { name: /Review decision options/i });
    await reviewOptions.waitFor({ state: "visible", timeout: 15_000 });
    await reviewOptions.click();

    const verify = page.getByRole("button", { name: /Verify Evidence/i }).first();
    await verify.waitFor({ state: "visible", timeout: 15_000 });
    await verify.click();

    const execute = page.getByRole("button", { name: /Execute Verify Evidence/i });
    await execute.waitFor({ state: "visible", timeout: 15_000 });
    await execute.click();

    const resultTitle = page.getByRole("heading", { name: "Turn 1 complete", exact: true });
    await resultTitle.waitFor({ state: "visible", timeout: 15_000 });
    invariant(await page.getByText(/Next decision · turn 2/i).isVisible(), `${spec.name}: next-turn preview missing`);

    const continueButton = page.getByRole("button", { name: /Continue to turn 2/i });
    await continueButton.click();
    await page.getByText(/Turn 2\//i).first().waitFor({ state: "visible", timeout: 15_000 });

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
