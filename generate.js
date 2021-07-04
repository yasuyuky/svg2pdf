#!/usr/bin/env node

const { chromium } = require("playwright-chromium");
const { program, Option } = require("commander");
const path = require("path");
const process = require("process");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

program.addOption(
  new Option("-f, --format <format>").choices(["pdf", "png"]).default("pdf")
);

program.arguments("<input> <output>").action(async (input, output) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file:${path.join(process.cwd(), input)}`);
  await page.waitForLoadState("domcontentloaded");
  await sleep(1000);
  const svg = await page.$("svg");
  const width = await svg?.getAttribute("width");
  const height = await svg?.getAttribute("height");
  await page.pdf({ path: path.join(process.cwd(), output), width, height });
  await browser.close();
});
program.parse();
