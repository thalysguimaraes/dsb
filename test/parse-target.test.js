import test from "node:test";
import assert from "node:assert/strict";

import { parseTarget } from "../src/lib/parse-target.js";

test("parseTarget accepts single-segment sandbox paths", () => {
  assert.deepEqual(parseTarget("checkout-refresh"), {
    relativePath: "checkout-refresh",
    segments: ["checkout-refresh"]
  });
});

test("parseTarget accepts nested sandbox paths", () => {
  assert.deepEqual(parseTarget("product/mobile-settings"), {
    relativePath: "product/mobile-settings",
    segments: ["product", "mobile-settings"]
  });
});

test("parseTarget rejects malformed targets", () => {
  assert.throws(() => parseTarget(""), /Expected target/);
  assert.throws(() => parseTarget("../private"), /Path segment cannot be "." or ".."/);
  assert.throws(() => parseTarget("product//checkout"), /Expected target/);
});
