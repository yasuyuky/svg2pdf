#!/usr/bin/env node

const { chromium } = require("playwright-chromium");
const { program, Option } = require("commander");
const path = require("path");
const process = require("process");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

program.addOption(
  new Option("-f, --format <format>").choices(["pdf", "png"]).default("pdf")
);
program.addOption(new Option("-p, --pageRanges <pageRanges>").default("1"));

program.arguments("<input> <output>");
program.action(async (input, output, { format, pageRanges }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file:${path.join(process.cwd(), input)}`);
  await page.waitForLoadState("domcontentloaded");
  await sleep(1000);
  const svg = await page.$("svg");
  const width = await svg?.getAttribute("width");
  const height = await svg?.getAttribute("height");
  const outputPath = path.join(process.cwd(), output);
  if (format == "png")
    await page.screenshot({ path: outputPath, width, height, fullPage: true });
  else await page.pdf({ path: outputPath, width, height, pageRanges });
  await browser.close();
});
program.parse();
