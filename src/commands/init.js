import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { exists } from "../lib/fs.js";
import { parseTarget } from "../lib/parse-target.js";
import { getSandboxPath, humanizeSegment, resolveSandboxesRoot } from "../lib/paths.js";
import { createPromptSession } from "../lib/prompts.js";
import { renderAgentsFile } from "../lib/render-agents.js";

function countCapturedOptionalFields(data) {
  return Object.entries(data).filter(([key, value]) => {
    if (["name", "description"].includes(key)) {
      return false;
    }

    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  }).length;
}

function printSummary(stdout, sandboxPath, data) {
  const optionalCount = countCapturedOptionalFields(data);

  stdout.write("\nSummary\n");
  stdout.write(`  Path: ${sandboxPath}\n`);
  stdout.write(`  Project: ${data.name}\n`);
  stdout.write(`  Description: ${data.description}\n`);
  if (data.context) {
    stdout.write(`  Context: ${data.context}\n`);
  }
  stdout.write(`  Optional fields captured: ${optionalCount}\n\n`);
}

export async function initCommand(args, io) {
  if (args.includes("--help")) {
    io.stdout.write("Usage: dsb init <sandbox-path> [--force]\n");
    return 0;
  }

  const supportedFlags = new Set(["--force"]);
  const flags = args.filter((arg) => arg.startsWith("--"));
  const unknownFlags = flags.filter((flag) => !supportedFlags.has(flag));

  if (unknownFlags.length > 0) {
    io.stderr.write(`Unknown option: ${unknownFlags[0]}\n`);
    io.stderr.write("Usage: dsb init <sandbox-path> [--force]\n");
    return 1;
  }

  const positional = args.filter((arg) => !arg.startsWith("--"));
  const [target] = positional;
  const force = flags.includes("--force");

  if (positional.length !== 1) {
    io.stderr.write("Usage: dsb init <sandbox-path> [--force]\n");
    return 1;
  }

  if (!io.stdin.isTTY || !io.stdout.isTTY) {
    io.stderr.write("dsb init requires an interactive terminal.\n");
    return 1;
  }

  let parsedTarget;

  try {
    parsedTarget = parseTarget(target);
  } catch (error) {
    io.stderr.write(`${error.message}\n`);
    io.stderr.write("Usage: dsb init <sandbox-path>\n");
    return 1;
  }

  const root = resolveSandboxesRoot(io.env);
  const sandboxPath = getSandboxPath(root, parsedTarget);
  const agentsPath = path.join(sandboxPath, "AGENTS.md");
  const prompts = createPromptSession({ input: io.stdin, output: io.stdout });

  try {
    if ((await exists(agentsPath)) && !force) {
      const overwrite = await prompts.askConfirm(`AGENTS.md already exists at ${agentsPath}. Overwrite it`, false);

      if (!overwrite) {
        io.stdout.write("Canceled. Existing AGENTS.md was not changed.\n");
        return 0;
      }
    }

    io.stdout.write(`Creating sandbox in ${sandboxPath}\n`);
    io.stdout.write("Press Enter to skip any optional field.\n\n");

    const data = {
      name: await prompts.askRequired("Project name", humanizeSegment(parsedTarget.segments.at(-1))),
      description: await prompts.askRequired("Description"),
      context: await prompts.askOptional("Context / area"),
      figma_files: await prompts.askList("Figma files (comma-separated URLs)"),
      design_system: await prompts.askOptional("Design system"),
      colors: await prompts.askList("Colors (comma-separated)"),
      typography: await prompts.askList("Typography (comma-separated)"),
      components: await prompts.askList("Components (comma-separated)"),
      resources: await prompts.askList("Resources (comma-separated URLs)"),
      constraints: await prompts.askList("Constraints (comma-separated)"),
      decisions: await prompts.askList("Decisions (comma-separated)"),
      stack: await prompts.askList("Stack (comma-separated)")
    };

    printSummary(io.stdout, sandboxPath, data);

    const confirmed = await prompts.askConfirm("Create sandbox", true);

    if (!confirmed) {
      io.stdout.write("Canceled. No files were written.\n");
      return 0;
    }

    await mkdir(sandboxPath, { recursive: true });
    await writeFile(agentsPath, renderAgentsFile(data), "utf8");

    io.stdout.write(`Created sandbox at ${sandboxPath}\n`);
    io.stdout.write(`Generated AGENTS.md at ${agentsPath}\n`);

    return 0;
  } finally {
    prompts.close();
  }
}
