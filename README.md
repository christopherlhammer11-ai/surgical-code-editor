# Surgical Code Editor

CLI tool for targeted code edits without line numbers—precision surgical strikes on your codebase.

<!-- badges -->

## What It Does

Surgical Code Editor (`sce`) enables precise, targeted edits to source files using semantic patterns instead of fragile line numbers. Generate unified diffs, dry-run changes, and edit with confidence.

## Features

- **CLI Command**: `sce` with intuitive subcommands
- **5 Edit Operations**: replace, replace-all, insert-before, insert-after, delete
- **No Line Numbers**: Target code by semantic context, not brittle row indices
- **Unified Diff Output**: See exactly what will change before committing
- **Dry-Run Mode**: editFile() with `--dry-run` flag to preview changes
- **Smart Search**: Context-aware pattern matching for reliable edits

## Quick Start

```bash
npm install -g surgical-code-editor
sce --help
```

## Usage

```bash
# Replace a function signature
sce replace src/auth.ts \
  --find "function login(email: string)" \
  --replace "async function login(email: string, password: string)"

# Insert before a pattern
sce insert-before src/app.ts \
  --find "app.listen()" \
  --text "console.log('Starting server...');"

# Dry-run to preview
sce replace src/db.ts \
  --find "const pool = new Pool()" \
  --replace "const pool = await Pool.create()" \
  --dry-run
```

## Tech Stack

- Commander.js (CLI framework)
- TypeScript (type safety)

## Part of Genesis Marketplace

Powers the code transformation agent in the Genesis skill ecosystem.

## Author

Christopher L. Hammer  
GitHub: [christopherlhammer11-ai](https://github.com/christopherlhammer11-ai)  
Sites: [hammercg.com](https://hammercg.com) | [hammerlockai.com](https://hammerlockai.com)
