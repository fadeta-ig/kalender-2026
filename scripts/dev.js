#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

process.env.NEXT_DISABLE_TURBOPACK = process.env.NEXT_DISABLE_TURBOPACK || "1";
const args = process.argv.slice(2).filter((arg) => arg !== "--");
if (!args.some((arg) => arg === "--webpack" || arg === "--turbo" || arg === "--turbopack")) {
  args.unshift("--webpack");
}
process.argv.splice(2, process.argv.length - 2, "dev", ...args);
require("next/dist/bin/next");
