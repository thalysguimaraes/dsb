import { SPEC_VERSION } from "../constants.js";

const FIELD_ORDER = [
  "spec_version",
  "name",
  "description",
  "context",
  "figma_files",
  "design_system",
  "colors",
  "typography",
  "components",
  "resources",
  "constraints",
  "decisions",
  "stack"
];

const SECTION_LABELS = {
  figma_files: "Figma Files",
  design_system: "Design System",
  colors: "Colors",
  typography: "Typography",
  components: "Components",
  resources: "Resources",
  constraints: "Constraints",
  decisions: "Decisions",
  stack: "Stack"
};

function isPresent(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return typeof value === "string" ? value.trim().length > 0 : value != null;
}

function quoteYaml(value) {
  return JSON.stringify(String(value));
}

function renderSection(key, value) {
  if (!isPresent(value)) {
    return [];
  }

  const lines = [`## ${SECTION_LABELS[key]}`, ""];

  if (Array.isArray(value)) {
    lines.push(...value.map((item) => `- ${item}`));
  } else {
    lines.push(value);
  }

  lines.push("");
  return lines;
}

export function normalizeAgentsData(input) {
  const normalized = {
    spec_version: SPEC_VERSION,
    name: input.name?.trim(),
    description: input.description?.trim(),
    context: input.context?.trim()
  };

  for (const key of [
    "figma_files",
    "design_system",
    "colors",
    "typography",
    "components",
    "resources",
    "constraints",
    "decisions",
    "stack"
  ]) {
    const value = input[key];

    if (Array.isArray(value)) {
      const items = value.map((item) => String(item).trim()).filter(Boolean);
      if (items.length > 0) {
        normalized[key] = items;
      }
      continue;
    }

    if (typeof value === "string" && value.trim()) {
      normalized[key] = value.trim();
    }
  }

  return normalized;
}

export function renderAgentsFile(input) {
  const data = normalizeAgentsData(input);
  const lines = ["---"];

  for (const key of FIELD_ORDER) {
    const value = data[key];

    if (!isPresent(value)) {
      continue;
    }

    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${quoteYaml(item)}`);
      }
      continue;
    }

    lines.push(`${key}: ${quoteYaml(value)}`);
  }

  lines.push("---", "", `# ${data.name}`, "", data.description, "");
  lines.push("This sandbox stores working context for design sessions with AI agents.", "");

  for (const key of FIELD_ORDER.slice(4)) {
    lines.push(...renderSection(key, data[key]));
  }

  lines.push("## Notes", "");
  lines.push("Add new decisions, constraints, and links here as the project evolves.", "");

  return lines.join("\n");
}
