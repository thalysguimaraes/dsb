function validateSegment(segment, label) {
  const value = segment.trim();

  if (!value) {
    throw new Error(`${label} cannot be empty.`);
  }

  if (value === "." || value === "..") {
    throw new Error(`${label} cannot be "." or "..".`);
  }

  if (value.includes("/") || value.includes("\\")) {
    throw new Error(`${label} cannot contain path separators.`);
  }

  return value;
}

export function parseTarget(target) {
  if (typeof target !== "string" || !target.trim()) {
    throw new Error("Expected target in the form <sandbox-path>.");
  }

  const normalized = target.trim().replace(/^\/+|\/+$/g, "");
  const parts = normalized.split("/");

  if (parts.length === 0 || parts.some((part) => !part.trim())) {
    throw new Error("Expected target in the form <sandbox-path>.");
  }

  return {
    relativePath: parts.map((part) => validateSegment(part, "Path segment")).join("/"),
    segments: parts.map((part) => validateSegment(part, "Path segment"))
  };
}
