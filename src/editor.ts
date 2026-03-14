import { EditOperation, EditResult } from './types';
import { unifiedDiff } from './differ';

/**
 * Apply surgical edits to source code.
 * Each operation targets a specific string — no line numbers needed.
 */
export function edit(source: string, operations: EditOperation[]): EditResult {
  let result = source;
  let appliedOps = 0;
  const errors: string[] = [];

  for (const op of operations) {
    const before = result;

    switch (op.type) {
      case 'replace': {
        const idx = result.indexOf(op.search);
        if (idx === -1) {
          errors.push(`Not found: "${truncate(op.search, 50)}"`);
          continue;
        }
        // Verify uniqueness
        const secondIdx = result.indexOf(op.search, idx + 1);
        if (secondIdx !== -1) {
          errors.push(`Ambiguous match: "${truncate(op.search, 50)}" found ${countOccurrences(result, op.search)} times — use replace-all or provide more context`);
          continue;
        }
        result = result.slice(0, idx) + (op.replace ?? '') + result.slice(idx + op.search.length);
        appliedOps++;
        break;
      }

      case 'replace-all': {
        if (!result.includes(op.search)) {
          errors.push(`Not found: "${truncate(op.search, 50)}"`);
          continue;
        }
        result = result.split(op.search).join(op.replace ?? '');
        appliedOps++;
        break;
      }

      case 'insert-before': {
        const idx = result.indexOf(op.search);
        if (idx === -1) {
          errors.push(`Not found: "${truncate(op.search, 50)}"`);
          continue;
        }
        result = result.slice(0, idx) + (op.replace ?? '') + result.slice(idx);
        appliedOps++;
        break;
      }

      case 'insert-after': {
        const idx = result.indexOf(op.search);
        if (idx === -1) {
          errors.push(`Not found: "${truncate(op.search, 50)}"`);
          continue;
        }
        const end = idx + op.search.length;
        result = result.slice(0, end) + (op.replace ?? '') + result.slice(end);
        appliedOps++;
        break;
      }

      case 'delete': {
        const idx = result.indexOf(op.search);
        if (idx === -1) {
          errors.push(`Not found: "${truncate(op.search, 50)}"`);
          continue;
        }
        result = result.slice(0, idx) + result.slice(idx + op.search.length);
        appliedOps++;
        break;
      }
    }
  }

  const diff = unifiedDiff(source, result);
  const linesChanged = diff.split('\n').filter(l => l.startsWith('+') || l.startsWith('-')).length;

  return {
    success: errors.length === 0,
    original: source,
    modified: result,
    diff,
    operations: appliedOps,
    linesChanged,
    error: errors.length > 0 ? errors.join('; ') : undefined,
  };
}

/**
 * Apply edits to a file (read, modify, write back).
 */
export async function editFile(
  filePath: string,
  operations: EditOperation[],
  dryRun = false,
): Promise<EditResult> {
  const fs = await import('fs');
  const source = await fs.promises.readFile(filePath, 'utf-8');
  const result = edit(source, operations);

  if (!dryRun && result.success && result.modified !== result.original) {
    await fs.promises.writeFile(filePath, result.modified, 'utf-8');
  }

  return result;
}

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + '...';
}

function countOccurrences(text: string, search: string): number {
  let count = 0;
  let pos = 0;
  while ((pos = text.indexOf(search, pos)) !== -1) {
    count++;
    pos += 1;
  }
  return count;
}
