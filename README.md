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
~/development/
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

By default the CLI uses `~/development/design` as its root. Set `DSB_HOME` to override that path during testing or for a custom local setup.

## `AGENTS.md`

The generated `AGENTS.md` contains:

- required fields: `name`, `description`
- optional fields: `context`, `figma_files`, `design_system`, `colors`, `typography`, `components`, `resources`, `constraints`, `decisions`, `stack`

Fields with no useful value are omitted. The file is meant to be useful for both humans and agents.

## Typical Workflow

1. Create a sandbox with `dsb init mobile-settings-refresh`
2. Fill in the project context during onboarding
3. Open the sandbox when starting a design session
4. Reuse the same sandbox for follow-up sessions

## Examples

- [Mobile settings refresh sandbox](examples/mobile-settings-refresh-agents.md)
- [Design system update sandbox](examples/design-system-update-agents.md)

## Scope

DSB is about context, not orchestration. It does not manage design versioning, sync external tools, or automate agent workflows.

## Status

This repository currently documents the convention and serves as a reference for the CLI implementation.
