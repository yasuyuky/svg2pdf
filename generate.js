#!/usr/bin/env node

const { chromium } = require("playwright-chromium");
const path = require("path");
const process = require("process");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file:${path.join(process.cwd(), args[0])}`);
  await page.waitForLoadState("domcontentloaded");
  await sleep(5000);
  await page.pdf({ path: path.join(process.cwd(), args[1]) });
  await browser.close();
})();
