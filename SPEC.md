# DSB Specification

Version: `0.2.0`

## 1. Purpose

DSB defines a convention for organizing design workspaces for AI-assisted design sessions. The goal is to make design context durable, discoverable, and easy to reopen across tools such as Claude Code, Codex, and future agents.

DSB is intentionally narrow:

- It standardizes directory layout for design sandboxes.
- It defines the `AGENTS.md` file format used to seed and restore project context.
- It provides a reference CLI implementation for creating and discovering sandboxes.

DSB does not standardize design workflow, artifact versioning, MCP configuration, OAuth, or synchronization with external design tools.

## 2. Terms

- `sandbox`: The filesystem location for a single design project under DSB conventions.
- `sandbox path`: A relative path under the DSB root. It MAY be a single directory name or a nested path.
- `root`: The top-level directory containing DSB sandboxes.
- `AGENTS.md`: The context file stored at the root of a sandbox.

## 3. Root Directory Convention

The default root is:

```text
~/development/design
```

Implementations MAY allow the root to be overridden via configuration or environment variable, but the default layout MUST remain compatible with this structure.

The canonical directory structure is:

```text
~/development/
└── design/
    └── <project>/
        ├── AGENTS.md
        └── .claude/
```

Requirements:

- `design/` contains DSB-managed sandboxes by default.
- Each sandbox MUST live somewhere under the configured DSB root.
- `AGENTS.md` MUST be present at the sandbox root.
- `.claude/` MAY be created by the agent runtime and is not authored by DSB.
- Implementations MAY support nested sandbox paths such as `product/mobile-settings`, but DSB MUST NOT require a fixed intermediate grouping.

## 4. Sandbox Lifecycle

### 4.1 Create

A sandbox is created when a user runs the reference CLI to initialize a new sandbox path.

The CLI MUST:

- create any missing parent directories
- refuse to overwrite an existing `AGENTS.md` without explicit confirmation
- write a valid `AGENTS.md`

### 4.2 Discover

A sandbox is discoverable when it exists under the root directory and contains `AGENTS.md`.

Implementations SHOULD treat sandboxes as filesystem-first objects. No central registry is required.

### 4.3 Reopen

Users SHOULD be able to revisit a sandbox by opening the directory directly. DSB does not require a special database, service, or lockfile to restore context.

## 5. `AGENTS.md` Format

`AGENTS.md` is a Markdown document with YAML frontmatter followed by human-readable project context.

The file MUST contain these required frontmatter fields:

- `name`
- `description`

The file SHOULD contain `spec_version`.

Optional frontmatter fields:

- `context`
- `figma_files`
- `design_system`
- `colors`
- `typography`
- `components`
- `resources`
- `constraints`
- `decisions`
- `stack`

Rules:

- Omit optional fields when no value is available.
- Represent list values as YAML arrays.
- Keep values concise and factual.
- Prefer links over copied prose for external resources.
- Keep the body of the document readable by humans and useful to agents.

## 6. Required Field Semantics

### `name`

The project or initiative name used by the design team.

### `description`

A short summary of what the sandbox is for.

## 7. Optional Field Semantics

### `context`

An optional high-level label for the sandbox, such as a team, initiative, product area, or other grouping.

### `figma_files`

Links to the relevant Figma files for the project.

### `design_system`

The primary design system or UI kit used by the project.

### `colors`

The main color palette or brand colors relevant to the sandbox.

### `typography`

The fonts or type system in use.

### `components`

Important component libraries, shared systems, or module names.

### `resources`

Supporting documents such as briefs, specs, notes, tickets, or research links.

### `constraints`

Known technical, product, legal, or visual constraints.

### `decisions`

Design decisions already made and worth preserving.

### `stack`

The implementation stack if the sandbox is coupled to front-end or product code.

## 8. Reference CLI

The reference CLI is named `dsb`.

### `dsb init <sandbox-path>`

The command MUST:

- resolve the target sandbox path
- create the sandbox directory if it does not exist
- run an onboarding flow that collects project context
- generate `AGENTS.md`
- support a fast path when only required fields are available

The onboarding flow SHOULD be interactive and MUST allow the user to skip optional fields.

### `dsb list`

The command SHOULD enumerate existing sandboxes under the root directory and display at least:

- sandbox path
- path
- presence of `AGENTS.md`

## 9. Non-Goals

DSB does not define:

- version control of design artifacts
- sync with Figma or other design tools
- automatic MCP or OAuth setup per project
- task orchestration, timers, or workflow automation
- a GUI dashboard

## 10. Compatibility Guidance

Implementations SHOULD keep `AGENTS.md` compatible with agent tools that already understand Markdown and YAML frontmatter.

Implementations MAY add tool-specific fields in the future, but they MUST preserve the required fields and the directory convention defined here.
