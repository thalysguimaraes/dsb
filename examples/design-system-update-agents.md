---
spec_version: 0.2.0
name: Design System Update
description: Coordinate a small design system update focused on buttons, form fields, and documentation.
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
resources:
  - https://example.com/specs/design-system-update
constraints:
  - Avoid breaking existing component APIs.
  - Keep tokens backwards-compatible where possible.
decisions:
  - Ship buttons and fields first, then update the documentation pages.
stack:
  - React
  - TypeScript
---

# Design System Update

Use this sandbox to preserve context while iterating on foundational UI components.

## Notes

- Keep implementation constraints and rollout notes together.
- Add new token or component decisions here as they are made.
