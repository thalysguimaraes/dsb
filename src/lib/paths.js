import os from "node:os";
import path from "node:path";

import { DEFAULT_DSB_HOME_SEGMENTS, DSB_HOME_ENV } from "../constants.js";

function expandHome(input, homedir) {
  if (input === "~") {
    return homedir;
  }

  if (input.startsWith("~/")) {
    return path.join(homedir, input.slice(2));
  }

  return input;
}

export function resolveSandboxesRoot(env = process.env, homedir = os.homedir()) {
  const configuredRoot = env[DSB_HOME_ENV]?.trim();
  return configuredRoot
    ? path.resolve(expandHome(configuredRoot, homedir))
    : path.join(homedir, ...DEFAULT_DSB_HOME_SEGMENTS);
}

export function getSandboxPath(root, sandboxPath) {
  return path.join(root, ...sandboxPath.segments);
}

export function humanizeSegment(value) {
  return value
    .trim()
    .split(/[-_]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
