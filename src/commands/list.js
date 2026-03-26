import { findSandboxes } from "../lib/list-sandboxes.js";
import { resolveSandboxesRoot } from "../lib/paths.js";

function formatRows(rows) {
  const headers = ["SANDBOX", "AGENTS", "PATH"];
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...rows.map((row) => row[index].length))
  );

  const serialize = (row) => row.map((cell, index) => cell.padEnd(widths[index])).join("  ");

  return [serialize(headers), serialize(widths.map((width) => "-".repeat(width))), ...rows.map(serialize)].join("\n");
}

export async function listCommand(args, io) {
  if (args.includes("--help")) {
    io.stdout.write("Usage: dsb list\n");
    return 0;
  }

  if (args.length > 0) {
    if (args[0].startsWith("--")) {
      io.stderr.write(`Unknown option: ${args[0]}\n`);
    }
    io.stderr.write("Usage: dsb list\n");
    return 1;
  }

  const root = resolveSandboxesRoot(io.env, io.cwd);
  const sandboxes = await findSandboxes(root);

  if (sandboxes.length === 0) {
    io.stdout.write(`No sandboxes found in ${root}.\n`);
    return 0;
  }

  const rows = sandboxes.map((sandbox) => [
    sandbox.sandbox,
    sandbox.hasAgents ? "yes" : "no",
    sandbox.path
  ]);

  io.stdout.write(`${formatRows(rows)}\n`);
  return 0;
}
