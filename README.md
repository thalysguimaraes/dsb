<p align="center">
  <img src="assets/icon.png" width="128" alt="DSB icon" />
</p>

# DSB — Design Sandbox

If you're designing inside an existing codebase, the repo is your working directory. Session history, agent state, `/resume`, all just work. But a lot of design work doesn't live in a repo yet. New products, early exploration, design system iterations, things that haven't become code. Those sessions start from nowhere.

DSB gives that work a place to happen. You `cd` into a sandbox, open Claude Code or Codex, and everything that happens in that session stays in that directory: conversation history, `.claude/` state, decisions. Come back tomorrow, `/resume`, pick up where you left off. The context accumulates like it does in a code repo, because the sandbox *is* the repo.

## Why this matters now

AI agents can write directly to design canvases. Figma through MCP, Paper as a full agent-native design tool, more showing up every month. But a writable canvas without a persistent working directory is just a sketchpad. The session ends and the context is gone.

DSB is for design work that doesn't have a codebase to call home yet.

- **History accumulates.** Every session in the sandbox builds on the last. `/resume` just works.
- **Context is portable.** The sandbox works with any agent that reads the filesystem. Claude Code, Codex, whatever ships next.
- **No platform needed.** It's a directory. `ls` is your dashboard.

## What DSB is

DSB is a **spec** and a **reference CLI**.

The spec defines the convention: directory layout, `AGENTS.md` format, sandbox lifecycle. It's small enough that anyone can reimplement it, or that an agent can scaffold a sandbox just from reading the spec. The convention is the product. The CLI is one way to use it.

The CLI, `dsb`, makes the convention practical:

```bash
npm install && npm link
```

```bash
dsb init mobile-settings-refresh
```

`dsb init` creates the sandbox directory, walks you through interactive onboarding (project name, description, Figma links, colors, typography, constraints, past decisions, stack), and generates an `AGENTS.md` with everything the agent needs on the first session. Skip anything you don't have yet.

```bash
dsb list                   # discover existing sandboxes
```

## Directory layout

```text
your-workspace/
├── apps/
├── repos/
└── design/
    └── mobile-settings-refresh/
        ├── AGENTS.md      ← the context file
        └── .claude/       ← created by the agent, not by you
```

DSB auto-detects the nearest `design/` directory. Set `DSB_HOME` to override.

## `AGENTS.md`

The sandbox's seed file. Markdown with YAML frontmatter that gives the agent starting context so the first message in a new session isn't "here's the project background." Two required fields (`name`, `description`) and optional fields for everything else:

`context` · `figma_files` · `design_system` · `colors` · `typography` · `components` · `resources` · `constraints` · `decisions` · `stack`

Empty fields are omitted. The file stays clean.

<details>
<summary>Example: Mobile Settings Refresh</summary>

```yaml
---
name: Mobile Settings Refresh
description: Refresh the settings experience to make navigation clearer.
context: Product Surface
figma_files:
  - https://www.figma.com/design/example-mobile-settings-refresh
design_system: Core UI
colors:
  - "#111827"
  - "#2563EB"
  - "#F9FAFB"
typography:
  - Inter
components:
  - List item
  - Toggle
  - Section header
constraints:
  - Keep the information architecture familiar to returning users.
  - Prioritize mobile readability.
decisions:
  - Surface account-level actions above device-level settings.
stack:
  - React Native
  - Expo
---
```

</details>

<details>
<summary>Example: Design System Update</summary>

```yaml
---
name: Design System Update
description: Buttons, form fields, and documentation. A focused DS iteration.
context: Platform Foundations
figma_files:
  - https://www.figma.com/design/example-design-system-update
design_system: Core UI
colors:
  - "#0F172A"
  - "#F8FAFC"
  - "#14B8A6"
typography:
  - Instrument Sans
components:
  - Button
  - Input
  - Select
constraints:
  - Avoid breaking existing component APIs.
  - Keep tokens backwards-compatible where possible.
decisions:
  - Ship buttons and fields first, then update the documentation pages.
stack:
  - React
  - TypeScript
---
```

</details>

## Workflow

1. `dsb init <project-name>`, answer the prompts
2. `cd` into the sandbox
3. Open Claude Code, Codex, or your agent of choice
4. Work. Close the session.
5. Come back next week. `cd` into the same sandbox, `/resume`.

Nested paths work too: `dsb init product/mobile-settings-refresh`.

## Scope

DSB gives you a place to work from, nothing more. It doesn't version design artifacts, sync with Figma, or automate agent workflows. It's just a convention, so it sits underneath whatever tools and agents you already use.

## Spec

The full specification is in [SPEC.md](SPEC.md). It's self-contained. You can reimplement `dsb` in any language, or skip the CLI entirely and follow the convention by hand.

## License

[MIT](LICENSE) — Thalys Guimaraes
