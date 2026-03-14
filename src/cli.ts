#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import { edit, editFile } from './editor';
import { unifiedDiff } from './differ';

const program = new Command();

program
  .name('sce')
  .description('Surgical Code Editor — targeted code changes')
  .version('0.1.0');

program
  .command('replace')
  .description('Replace a string in a file')
  .argument('<file>', 'File to edit')
  .requiredOption('-s, --search <text>', 'Text to find')
  .requiredOption('-r, --replace <text>', 'Replacement text')
  .option('--all', 'Replace all occurrences')
  .option('--dry-run', 'Show diff without writing')
  .action(async (file: string, opts: Record<string, string | boolean>) => {
    try {
      const result = await editFile(file, [{
        type: opts['all'] ? 'replace-all' : 'replace',
        search: opts['search'] as string,
        replace: opts['replace'] as string,
      }], !!opts['dryRun']);

      if (result.diff) {
        console.log(result.diff);
      } else {
        console.log('No changes.');
      }

      if (result.error) {
        console.error('Errors:', result.error);
        process.exit(1);
      }
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

program
  .command('patch')
  .description('Apply multiple edits from a JSON operations file')
  .argument('<file>', 'File to edit')
  .argument('<ops>', 'JSON file with operations array')
  .option('--dry-run', 'Show diff without writing')
  .action(async (file: string, opsFile: string, opts: Record<string, boolean>) => {
    try {
      const ops = JSON.parse(fs.readFileSync(opsFile, 'utf-8'));
      const result = await editFile(file, ops, !!opts['dryRun']);

      if (result.diff) {
        console.log(result.diff);
        console.log(`\n${result.operations} operation(s), ${result.linesChanged} line(s) changed`);
      } else {
        console.log('No changes.');
      }

      if (result.error) {
        console.error('Errors:', result.error);
        process.exit(1);
      }
    } catch (err) {
      console.error('Error:', (err as Error).message);
      process.exit(1);
    }
  });

program
  .command('diff')
  .description('Show diff between two files')
  .argument('<file1>', 'Original file')
  .argument('<file2>', 'Modified file')
  .action((file1: string, file2: string) => {
    const a = fs.readFileSync(file1, 'utf-8');
    const b = fs.readFileSync(file2, 'utf-8');
    const diff = unifiedDiff(a, b, file1);
    if (diff) {
      console.log(diff);
    } else {
      console.log('Files are identical.');
    }
  });

program.parse();
