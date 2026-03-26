import test from "node:test";
import assert from "node:assert/strict";

import { renderAgentsFile } from "../src/lib/render-agents.js";

test("renderAgentsFile omits empty optional fields", () => {
  const rendered = renderAgentsFile({
    name: "Mobile Settings Refresh",
    description: "Improve navigation and clarity in settings.",
    context: "Growth Surface",
    colors: [],
    stack: ["React", "Tailwind"]
  });

  assert.match(rendered, /name: "Mobile Settings Refresh"/);
  assert.match(rendered, /context: "Growth Surface"/);
  assert.match(rendered, /stack:\n  - "React"\n  - "Tailwind"/);
  assert.doesNotMatch(rendered, /colors:/);
});
