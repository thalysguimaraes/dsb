import { readdir } from "node:fs/promises";
import path from "node:path";

import { exists } from "./fs.js";

export async function findSandboxes(root) {
  try {
    await readdir(root, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const sandboxes = [];

  async function walk(currentPath, relativePath = ".") {
    const agentsPath = path.join(currentPath, "AGENTS.md");

    if (await exists(agentsPath)) {
      sandboxes.push({
        sandbox: relativePath === "." ? path.basename(currentPath) : relativePath,
        path: currentPath,
        hasAgents: true
      });
      return;
    }

    let entries = [];

    try {
      entries = await readdir(currentPath, { withFileTypes: true });
    } catch (error) {
      if (error.code === "ENOENT") {
        return;
      }

      throw error;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const nextPath = path.join(currentPath, entry.name);
      const nextRelativePath = relativePath === "." ? entry.name : path.join(relativePath, entry.name);
      await walk(nextPath, nextRelativePath);
    }
  }

  await walk(root);

  return sandboxes.sort((left, right) => left.sandbox.localeCompare(right.sandbox));
}
