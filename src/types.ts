export interface EditOperation {
  /** Type of edit */
  type: 'replace' | 'insert-before' | 'insert-after' | 'delete' | 'replace-all';
  /** Text to find (exact match) */
  search: string;
  /** Replacement text (not needed for delete) */
  replace?: string;
}

export interface EditResult {
  success: boolean;
  original: string;
  modified: string;
  diff: string;
  operations: number;
  linesChanged: number;
  error?: string;
}

export interface BatchEditResult {
  files: FileEditResult[];
  totalOperations: number;
  totalFilesChanged: number;
  errors: string[];
}

export interface FileEditResult {
  filePath: string;
  success: boolean;
  diff: string;
  linesChanged: number;
  error?: string;
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  lineNumber: number;
}
