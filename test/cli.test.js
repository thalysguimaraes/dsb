import test from "node:test";
import assert from "node:assert/strict";

import { run } from "../src/cli.js";

function createIO() {
  let stdout = "";
  let stderr = "";

  return {
    env: {},
    stdin: { isTTY: false },
    stdout: {
      isTTY: false,
      write(value) {
        stdout += value;
      }
    },
    stderr: {
      isTTY: false,
      write(value) {
        stderr += value;
      }
    },
    read() {
      return { stdout, stderr };
    }
  };
}

test("run prints version", async () => {
  const io = createIO();
  const exitCode = await run(["--version"], io);

  assert.equal(exitCode, 0);
  assert.match(io.read().stdout, /^0\.2\.1\n$/);
});

test("run rejects unknown list options", async () => {
  const io = createIO();
  const exitCode = await run(["list", "--json"], io);

  assert.equal(exitCode, 1);
  assert.match(io.read().stderr, /Unknown option: --json/);
});

test("run rejects unknown init options", async () => {
  const io = createIO();
  const exitCode = await run(["init", "mobile-settings", "--json"], io);

  assert.equal(exitCode, 1);
  assert.match(io.read().stderr, /Unknown option: --json/);
});
