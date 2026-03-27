<p align="center">
  <img src="assets/icon.png" width="128" alt="DSB icon" />
</p>

# DSB — Design Sandbox

A spec and reference CLI for giving design work a persistent working directory. Design work that doesn't live in a repo yet — new products, early exploration, design system iterations — needs a place where agent session history accumulates. `cd` into a sandbox, open Claude Code or Codex, and `/resume` just works.

## Features

- **History accumulates** — every session builds on the last, `/resume` just works
- **Context is portable** — works with any agent that reads the filesystem
- **Interactive onboarding** — `dsb init` walks through project details and generates `AGENTS.md`
- **Auto-discovery** — detects the nearest `design/` directory, or set `DSB_HOME` to override
- **Convention-based** — the spec is small enough to reimplement in any language

## Install

```bash
npm install && npm link
```

## Usage

```bash
dsb init mobile-settings-refresh   # create a new sandbox
dsb list                           # discover existing sandboxes
```

Then `cd` into the sandbox, open your agent of choice, and work. Come back later, `/resume`, pick up where you left off.

Nested paths work too: `dsb init product/mobile-settings-refresh`.

## Directory layout

```
your-workspace/
├── apps/
├── repos/
└── design/
    └── mobile-settings-refresh/
        ├── AGENTS.md      <- the context file
        └── .claude/       <- created by the agent
```

## Spec

The full specification is in [SPEC.md](SPEC.md). It defines the directory layout, `AGENTS.md` format, and sandbox lifecycle.

## License

MIT
