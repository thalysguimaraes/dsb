# DSB

DSB is a spec and reference CLI for organizing design sandboxes for AI-assisted design work.

It solves a simple problem: design sessions usually start from random directories, which makes the context hard to recover later. DSB gives each project a durable home and a structured `AGENTS.md` file that agents can use immediately.

## Install

```bash
npm install
npm link
```

This exposes the local reference CLI as `dsb`.

Without linking, you can run the local binary directly:

```bash
node ./bin/dsb.js --help
```

## What DSB Defines

- A filesystem convention for design sandboxes
- A normative `AGENTS.md` format
- A reference CLI named `dsb`

## Directory Layout

```text
<your-workspace>/
├── apps/
├── repos/
└── design/
    └── <project>/
        ├── AGENTS.md
        └── .claude/
```

## Reference Commands

`dsb init <sandbox-path>`

- creates the sandbox directory
- runs onboarding to collect project context
- writes `AGENTS.md`
- supports `--force` to overwrite an existing `AGENTS.md` without an extra prompt

`dsb list`

- lists existing sandboxes
- shows sandbox path and location

By default the CLI detects the nearest `design/` directory from your current location. If none exists, it creates and uses `<current-directory>/design`.

Set `DSB_HOME` only when you want to override that behavior explicitly.

## `AGENTS.md`

The generated `AGENTS.md` contains:

- required fields: `name`, `description`
- optional fields: `context`, `figma_files`, `design_system`, `colors`, `typography`, `components`, `resources`, `constraints`, `decisions`, `stack`

Fields with no useful value are omitted. The file is meant to be useful for both humans and agents.

## Typical Workflow

1. `cd` into the workspace you want to use
2. Create a sandbox with `dsb init mobile-settings-refresh`
3. Fill in the project context during onboarding
4. Open the sandbox when starting a design session
5. Reuse the same sandbox for follow-up sessions

Nested paths are also valid when you want more structure, for example `dsb init product/mobile-settings-refresh`.

## Examples

- [Mobile settings refresh sandbox](examples/mobile-settings-refresh-agents.md)
- [Design system update sandbox](examples/design-system-update-agents.md)

## Scope

DSB is about context, not orchestration. It does not manage design versioning, sync external tools, or automate agent workflows.

## Status

This repository currently documents the convention and serves as a reference for the CLI implementation.
