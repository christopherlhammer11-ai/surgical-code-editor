# Surgical Code Editor

**Precise code edits for AI agents.** Surgical Code Editor makes targeted search-replace edits and clean diffs instead of rewriting whole files.

Demo: **Watch the demo:** [Surgical Code Editor](https://christopherhammer.dev/assets/videos/narrated/project-demos/surgical-code-editor-narrated.mp4)

## Who Uses It

- Coding agents that need safe file edits
- Developer tools that generate patches
- Solo developers who want clean diffs
- Teams trying to reduce noisy AI-generated changes

## What It Solves

AI coding tools often over-edit: they rewrite unrelated code, change formatting, and make review harder. Surgical Code Editor focuses on the exact block that needs to change.

## Core Features

- Replace, replace-all, insert-before, insert-after, and delete operations
- Pattern-based targeting instead of fragile line numbers
- Dry-run mode
- Unified diff generation
- TypeScript CLI/library surface

## Example

```bash
sce replace src/auth.ts \
  --find "function login(email: string)" \
  --replace "async function login(email: string, password: string)" \
  --dry-run
```

## Quick Start

```bash
npm install
npm run build
npm test
```

## Portfolio Context

This is the editing layer a coding agent like Craig needs. It proves attention to reviewability, minimal diffs, and practical safety rather than flashy but risky AI rewrites.

---

Built by **Christopher L. Hammer** - self-taught AI/product builder shipping local-first tools, demos, and real product surfaces.

- Portfolio: [christopherhammer.dev](https://christopherhammer.dev)
- Proof demos: [https://christopherhammer.dev#proof](https://christopherhammer.dev#proof)
- GitHub: [christopherlhammer11-ai](https://github.com/christopherlhammer11-ai)

