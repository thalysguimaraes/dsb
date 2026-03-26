#!/usr/bin/env node

import { run } from "../src/cli.js";

try {
  const exitCode = await run(process.argv.slice(2), {
    env: process.env,
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr
  });

  if (typeof exitCode === "number") {
    process.exitCode = exitCode;
  }
} catch (error) {
  if (error && typeof error === "object" && error.code === "ABORT_ERR") {
    process.stderr.write("Aborted.\n");
    process.exitCode = 130;
  } else {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Error: ${message}\n`);
    process.exitCode = 1;
  }
}
