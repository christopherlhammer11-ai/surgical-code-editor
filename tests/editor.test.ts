import { edit } from '../src/editor';

const SAMPLE_CODE = `import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// TODO: add authentication
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(\`Server on \${PORT}\`);
});`;

describe('edit', () => {
  it('replaces a unique string', () => {
    const result = edit(SAMPLE_CODE, [
      { type: 'replace', search: 'const PORT = 3000', replace: 'const PORT = 8080' },
    ]);
    expect(result.success).toBe(true);
    expect(result.modified).toContain('const PORT = 8080');
    expect(result.modified).not.toContain('const PORT = 3000');
    expect(result.operations).toBe(1);
    expect(result.diff).toContain('-');
    expect(result.diff).toContain('+');
  });

  it('inserts before a target', () => {
    const result = edit(SAMPLE_CODE, [
      { type: 'insert-before', search: "app.get('/health'", replace: "app.use(cors());\n\n" },
    ]);
    expect(result.success).toBe(true);
    expect(result.modified).toContain("app.use(cors());\n\napp.get('/health'");
  });

  it('inserts after a target', () => {
    const result = edit(SAMPLE_CODE, [
      { type: 'insert-after', search: "import cors from 'cors';", replace: "\nimport helmet from 'helmet';" },
    ]);
    expect(result.success).toBe(true);
    expect(result.modified).toContain("import helmet from 'helmet';");
  });

  it('deletes a target', () => {
    const result = edit(SAMPLE_CODE, [
      { type: 'delete', search: '// TODO: add authentication\n' },
    ]);
    expect(result.success).toBe(true);
    expect(result.modified).not.toContain('TODO');
  });

  it('replace-all replaces every occurrence', () => {
    const source = 'foo bar foo baz foo';
    const result = edit(source, [
      { type: 'replace-all', search: 'foo', replace: 'qux' },
    ]);
    expect(result.success).toBe(true);
    expect(result.modified).toBe('qux bar qux baz qux');
  });

  it('errors on ambiguous replace', () => {
    const source = 'hello world hello universe';
    const result = edit(source, [
      { type: 'replace', search: 'hello', replace: 'hi' },
    ]);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Ambiguous');
    // Original should be unchanged
    expect(result.modified).toBe(source);
  });

  it('errors when search string not found', () => {
    const result = edit(SAMPLE_CODE, [
      { type: 'replace', search: 'NONEXISTENT_STRING', replace: 'replacement' },
    ]);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Not found');
  });

  it('applies multiple operations sequentially', () => {
    const result = edit(SAMPLE_CODE, [
      { type: 'replace', search: 'const PORT = 3000', replace: 'const PORT = 8080' },
      { type: 'delete', search: '// TODO: add authentication\n' },
      { type: 'insert-after', search: "import cors from 'cors';", replace: "\nimport helmet from 'helmet';" },
    ]);
    expect(result.success).toBe(true);
    expect(result.operations).toBe(3);
    expect(result.modified).toContain('8080');
    expect(result.modified).not.toContain('TODO');
    expect(result.modified).toContain('helmet');
  });

  it('generates a valid unified diff', () => {
    const result = edit(SAMPLE_CODE, [
      { type: 'replace', search: 'const PORT = 3000', replace: 'const PORT = 8080' },
    ]);
    expect(result.diff).toContain('---');
    expect(result.diff).toContain('+++');
    expect(result.diff).toContain('@@');
  });

  it('returns empty diff when no changes', () => {
    const result = edit(SAMPLE_CODE, []);
    expect(result.diff).toBe('');
    expect(result.linesChanged).toBe(0);
  });

  it('handles empty source', () => {
    const result = edit('', [
      { type: 'replace', search: 'hello', replace: 'world' },
    ]);
    expect(result.success).toBe(false);
  });
});
