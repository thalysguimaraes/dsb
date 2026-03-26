import packageJson from "../package.json" with { type: "json" };

import { initCommand } from "./commands/init.js";
import { listCommand } from "./commands/list.js";

function renderHelp() {
  return [
    "DSB — Design Sandbox",
    "",
    "Usage:",
    "  dsb init <sandbox-path>      Create a design sandbox and generate AGENTS.md",
    "  dsb list                     List existing design sandboxes",
    "  dsb help                     Show this help message",
    "",
    "Options:",
    "  dsb init --force             Overwrite an existing AGENTS.md without prompting",
    "",
    "Environment:",
    "  DSB_HOME                     Override the default root (defaults to ~/development/design)"
  ].join("\n");
}

export async function run(
  argv = process.argv.slice(2),
  io = {
    env: process.env,
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr
  }
) {
  const [command, ...args] = argv;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    io.stdout.write(`${renderHelp()}\n`);
    return 0;
  }

  if (command === "--version" || command === "-v") {
    io.stdout.write(`${packageJson.version}\n`);
    return 0;
  }

  if (command === "init") {
    return initCommand(args, io);
  }

  if (command === "list") {
    return listCommand(args, io);
  }

  io.stderr.write(`Unknown command: ${command}\n`);
  io.stderr.write(`${renderHelp()}\n`);
  return 1;
}
