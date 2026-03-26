import { statSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { DSB_HOME_ENV } from "../constants.js";

function expandHome(input, homedir) {
  if (input === "~") {
    return homedir;
  }

  if (input.startsWith("~/")) {
    return path.join(homedir, input.slice(2));
  }

  return input;
}

function directoryExists(targetPath) {
  try {
    return statSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

function findNearestDesignRoot(cwd, homedir) {
  let currentPath = path.resolve(cwd);
  const homePath = path.resolve(homedir);

  while (true) {
    if (path.basename(currentPath) === "design") {
      return currentPath;
    }

    const candidate = path.join(currentPath, "design");
    if (directoryExists(candidate)) {
      return candidate;
    }

    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath || currentPath === homePath) {
      break;
    }

    currentPath = parentPath;
  }

  return null;
}

export function resolveSandboxesRoot(env = process.env, cwd = process.cwd(), homedir = os.homedir()) {
  const configuredRoot = env[DSB_HOME_ENV]?.trim();

  if (configuredRoot) {
    return path.resolve(expandHome(configuredRoot, homedir));
  }

  const detectedRoot = findNearestDesignRoot(cwd, homedir);
  if (detectedRoot) {
    return detectedRoot;
  }

  return path.join(path.resolve(cwd), "design");
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
