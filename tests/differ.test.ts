import { unifiedDiff } from '../src/differ';

describe('unifiedDiff', () => {
  it('shows added lines with +', () => {
    const diff = unifiedDiff('line1\nline2', 'line1\nnewline\nline2');
    expect(diff).toContain('+newline');
  });

  it('shows removed lines with -', () => {
    const diff = unifiedDiff('line1\nline2\nline3', 'line1\nline3');
    expect(diff).toContain('-line2');
  });

  it('shows context lines', () => {
    const diff = unifiedDiff('a\nb\nc\nd\ne', 'a\nb\nX\nd\ne');
    expect(diff).toContain(' a');
    expect(diff).toContain('-c');
    expect(diff).toContain('+X');
  });

  it('returns empty string for identical inputs', () => {
    const diff = unifiedDiff('same\ncontent', 'same\ncontent');
    expect(diff).toBe('');
  });

  it('includes file header', () => {
    const diff = unifiedDiff('old', 'new', 'test.ts');
    expect(diff).toContain('--- a/test.ts');
    expect(diff).toContain('+++ b/test.ts');
  });

  it('handles completely different content', () => {
    const diff = unifiedDiff('alpha\nbeta', 'gamma\ndelta');
    expect(diff).toContain('-alpha');
    expect(diff).toContain('+gamma');
  });

  it('handles empty original', () => {
    const diff = unifiedDiff('', 'new content');
    expect(diff).toContain('+new content');
  });

  it('handles empty modified', () => {
    const diff = unifiedDiff('old content', '');
    expect(diff).toContain('-old content');
  });
});
