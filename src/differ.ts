/**
 * Minimal unified diff generator.
 * Produces readable diffs without external dependencies.
 */

export function unifiedDiff(
  original: string,
  modified: string,
  filename = 'file',
  contextLines = 3,
): string {
  const oldLines = original.split('\n');
  const newLines = modified.split('\n');

  // Simple LCS-based diff
  const changes = computeChanges(oldLines, newLines);
  if (changes.length === 0) return '';

  // Check if there are actual changes (not just equal lines)
  if (!changes.some(c => c.type !== 'equal')) return '';

  const hunks = groupIntoHunks(changes, oldLines, newLines, contextLines);
  if (hunks.length === 0) return '';

  const lines: string[] = [
    `--- a/${filename}`,
    `+++ b/${filename}`,
  ];

  for (const hunk of hunks) {
    lines.push(hunk.header);
    lines.push(...hunk.lines);
  }

  return lines.join('\n');
}

interface Change {
  type: 'add' | 'remove' | 'equal';
  oldLine: number;
  newLine: number;
  content: string;
}

interface Hunk {
  header: string;
  lines: string[];
}

function computeChanges(oldLines: string[], newLines: string[]): Change[] {
  const m = oldLines.length;
  const n = newLines.length;

  // LCS table (memory-efficient for reasonable file sizes)
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find changes
  const changes: Change[] = [];
  let i = m, j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      changes.unshift({ type: 'equal', oldLine: i, newLine: j, content: oldLines[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      changes.unshift({ type: 'add', oldLine: i, newLine: j, content: newLines[j - 1] });
      j--;
    } else {
      changes.unshift({ type: 'remove', oldLine: i, newLine: j, content: oldLines[i - 1] });
      i--;
    }
  }

  return changes;
}

function groupIntoHunks(
  changes: Change[],
  oldLines: string[],
  newLines: string[],
  contextLines: number,
): Hunk[] {
  // Find ranges of non-equal changes
  const changeIndices = changes
    .map((c, i) => c.type !== 'equal' ? i : -1)
    .filter(i => i !== -1);

  if (changeIndices.length === 0) return [];

  const hunks: Hunk[] = [];
  let hunkStart = Math.max(0, changeIndices[0] - contextLines);
  let hunkEnd = Math.min(changes.length - 1, changeIndices[0] + contextLines);

  for (let k = 1; k < changeIndices.length; k++) {
    const nextStart = Math.max(0, changeIndices[k] - contextLines);
    const nextEnd = Math.min(changes.length - 1, changeIndices[k] + contextLines);

    if (nextStart <= hunkEnd + 1) {
      // Merge with current hunk
      hunkEnd = nextEnd;
    } else {
      // Emit current hunk and start new one
      hunks.push(buildHunk(changes, hunkStart, hunkEnd));
      hunkStart = nextStart;
      hunkEnd = nextEnd;
    }
  }

  hunks.push(buildHunk(changes, hunkStart, hunkEnd));
  return hunks;
}

function buildHunk(changes: Change[], start: number, end: number): Hunk {
  const slice = changes.slice(start, end + 1);
  let oldStart = 0, oldCount = 0, newStart = 0, newCount = 0;

  const lines: string[] = [];

  for (let i = 0; i < slice.length; i++) {
    const c = slice[i];
    switch (c.type) {
      case 'equal':
        if (i === 0) { oldStart = c.oldLine; newStart = c.newLine; }
        oldCount++;
        newCount++;
        lines.push(` ${c.content}`);
        break;
      case 'remove':
        if (i === 0 || (oldStart === 0 && oldCount === 0)) { oldStart = c.oldLine; newStart = c.newLine; }
        oldCount++;
        lines.push(`-${c.content}`);
        break;
      case 'add':
        if (i === 0 || (newStart === 0 && newCount === 0)) { oldStart = c.oldLine; newStart = c.newLine; }
        newCount++;
        lines.push(`+${c.content}`);
        break;
    }
  }

  return {
    header: `@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`,
    lines,
  };
}
