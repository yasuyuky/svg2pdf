#!/usr/bin/env node

const { chromium } = require("playwright-chromium");
const { program } = require("commander");
const path = require("path");
const process = require("process");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

program.arguments("<input> <output>").action(async (input, output) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file:${path.join(process.cwd(), input)}`);
  await page.waitForLoadState("domcontentloaded");
  await sleep(1000);
  await page.pdf({ path: path.join(process.cwd(), output) });
  await browser.close();
});
program.parse();
