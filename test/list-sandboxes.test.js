import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { findSandboxes } from "../src/lib/list-sandboxes.js";

test("findSandboxes returns sandboxes sorted by relative sandbox path", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "dsb-test-"));
  const firstSandbox = path.join(root, "mobile-settings");
  const secondSandbox = path.join(root, "product", "dashboard");

  await mkdir(firstSandbox, { recursive: true });
  await mkdir(secondSandbox, { recursive: true });
  await writeFile(path.join(firstSandbox, "AGENTS.md"), "# context\n", "utf8");
  await writeFile(path.join(secondSandbox, "AGENTS.md"), "# context\n", "utf8");

  const sandboxes = await findSandboxes(root);

  assert.deepEqual(sandboxes, [
    {
      sandbox: "mobile-settings",
      path: firstSandbox,
      hasAgents: true
    },
    {
      sandbox: "product/dashboard",
      path: secondSandbox,
      hasAgents: true
    }
  ]);
});
