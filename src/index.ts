/**
 * Surgical Code Editor — Targeted code changes for LLM agents.
 *
 * @example
 * ```typescript
 * import { edit, editFile } from 'surgical-code-editor';
 *
 * // In-memory edit
 * const result = edit(sourceCode, [
 *   { type: 'replace', search: 'const x = 1', replace: 'const x = 42' },
 *   { type: 'insert-after', search: 'import express', replace: "\nimport cors from 'cors';" },
 *   { type: 'delete', search: '// TODO: remove this' },
 * ]);
 *
 * console.log(result.diff);        // unified diff
 * console.log(result.linesChanged); // number of lines affected
 *
 * // File edit (reads, modifies, writes back)
 * await editFile('./src/app.ts', operations);
 *
 * // Dry run (returns diff without writing)
 * await editFile('./src/app.ts', operations, true);
 * ```
 */

export { edit, editFile } from './editor';
export { unifiedDiff } from './differ';
export type { EditOperation, EditResult, BatchEditResult, FileEditResult, DiffLine } from './types';
