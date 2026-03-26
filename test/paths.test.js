import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { resolveSandboxesRoot } from "../src/lib/paths.js";

test("resolveSandboxesRoot uses DSB_HOME when provided", () => {
  const root = resolveSandboxesRoot({ DSB_HOME: "~/custom-design-root" }, "/tmp/ignored", "/Users/tester");
  assert.equal(root, "/Users/tester/custom-design-root");
});

test("resolveSandboxesRoot falls back to cwd/design when no design directory exists", () => {
  const root = resolveSandboxesRoot({}, "/tmp/workspace", "/Users/tester");
  assert.equal(root, "/tmp/workspace/design");
});

test("resolveSandboxesRoot reuses an existing design directory in the current path", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "dsb-paths-"));
  const workspaceRoot = path.join(tempRoot, "kanastra");
  const designRoot = path.join(workspaceRoot, "design");

  await mkdir(designRoot, { recursive: true });

  const root = resolveSandboxesRoot({}, workspaceRoot, os.homedir());
  assert.equal(root, designRoot);
});

test("resolveSandboxesRoot reuses the nearest ancestor design directory", async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "dsb-paths-"));
  const workspaceRoot = path.join(tempRoot, "kanastra");
  const nestedPath = path.join(workspaceRoot, "repo", "src");
  const designRoot = path.join(workspaceRoot, "design");

  await mkdir(nestedPath, { recursive: true });
  await mkdir(designRoot, { recursive: true });

  const root = resolveSandboxesRoot({}, nestedPath, os.homedir());
  assert.equal(root, designRoot);
});
