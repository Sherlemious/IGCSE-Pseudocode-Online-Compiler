import React, { useState, useEffect, useRef } from 'react';
import {
  FolderOpen,
  FileText,
  Trash2,
  X,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { FILE_PREFIX } from '../../utils/constants';

interface FileEntry {
  name: string;
  content: string;
}

interface FileViewerProps {
  onOpenFile?: (fileName: string, content: string) => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ onOpenFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  // Mobile: 'list' shows file list, 'detail' shows file content
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [createFileError, setCreateFileError] = useState<string>('');

  const modalRef = useRef<HTMLDivElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = () => {
    const entries: FileEntry[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(FILE_PREFIX)) {
        entries.push({
          name: key.slice(FILE_PREFIX.length),
          content: localStorage.getItem(key) || '',
        });
      }
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    setFiles(entries);
  };

  const handleOpen = () => {
    loadFiles();
    setSelectedFile(null);
    setConfirmDelete(null);
    setMobileView('list');
    setIsCreating(false);
    setCreateFileError('');
    setIsOpen(true);
  };

  const handleSelectFile = (file: FileEntry) => {
    setSelectedFile(file);
    setConfirmDelete(null);
    setMobileView('detail');
  };

  const handleDelete = (fileName: string) => {
    localStorage.removeItem(FILE_PREFIX + fileName);
    toast.success(`Deleted ${fileName}`);
    if (selectedFile?.name === fileName) {
      setSelectedFile(null);
      setMobileView('list');
    }
    setConfirmDelete(null);
    loadFiles();
  };

  const handleDeleteAll = () => {
    files.forEach((f) => localStorage.removeItem(FILE_PREFIX + f.name));
    toast.success('All files deleted');
    setSelectedFile(null);
    setConfirmDelete(null);
    setMobileView('list');
    loadFiles();
  };

  const handleCreateFile = () => {
    const name = newFileName.trim();
    if (!name) {
      setCreateFileError('File name cannot be empty');
      return;
    }

    if (localStorage.getItem(FILE_PREFIX + name) !== null) {
      setCreateFileError(`File '${name}' already exists`);
      return;
    }

    try {
      localStorage.setItem(FILE_PREFIX + name, '');
      toast.success(`Created ${name}`);
      loadFiles();
      setIsCreating(false);
      setCreateFileError('');
      setNewFileName('');
      // Auto-open
      onOpenFile?.(name, '');
      setIsOpen(false);
    } catch {
      setCreateFileError('Failed to create file: Storage full?');
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus the new file input when creating a file
  useEffect(() => {
    if (isCreating) {
      newFileInputRef.current?.focus();
    }
  }, [isCreating]);

  const lineCount = (content: string) => content.split('\n').length;

  /* ── File list panel ─────────────────────────────────── */
  const renderFileList = () => (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        className="flex-1 overflow-y-auto py-1
          scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
          scrollbar-track-background scrollbar-thumb-rounded-full"
      >
        {/* New file input */}
        {isCreating && (
          <div className="mx-1 mb-1">
            <div className="flex items-center gap-1.5 px-2 py-2 md:py-1 rounded-sm bg-surface border border-primary/30">
              <FileText size={14} className="text-primary shrink-0" />
              <input
                ref={newFileInputRef}
                type="text"
                value={newFileName}
                onChange={(e) => {
                  setNewFileName(e.target.value);
                  if (createFileError) setCreateFileError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFile();
                  if (e.key === 'Escape') {
                    setIsCreating(false);
                    setCreateFileError('');
                    setNewFileName('');
                  }
                }}
                placeholder="filename.pseudo"
                className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-light-text placeholder-dark-text/40 min-w-0"
              />
              <button
                onClick={handleCreateFile}
                className="text-success hover:bg-success/10 p-0.5 rounded transition-colors"
                title="Create"
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setCreateFileError('');
                  setNewFileName('');
                }}
                className="text-dark-text hover:text-error hover:bg-error/10 p-0.5 rounded transition-colors"
                title="Cancel"
              >
                <X size={12} />
              </button>
            </div>
            {createFileError && (
              <div className="mt-1 px-2 py-1 text-[10px] text-error bg-error/10 rounded-sm border border-error/20">
                {createFileError}
              </div>
            )}
          </div>
        )}

        {files.length === 0 && !isCreating ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4 py-8">
            <FolderOpen size={28} className="text-dark-text opacity-30" />
            <div className="text-xs text-dark-text text-center leading-relaxed">
              No files yet.
              <br />
              Use <code className="bg-code-bg px-1 py-0.5 rounded text-primary text-[0.85em]">OPENFILE</code> /{' '}
              <code className="bg-code-bg px-1 py-0.5 rounded text-primary text-[0.85em]">WRITEFILE</code> in your
              pseudocode to create files.
            </div>
          </div>
        ) : (
          files.map((file) => {
            const isSelected = selectedFile?.name === file.name;
            return (
              <div
                key={file.name}
                className={`group flex items-center gap-1.5 px-2 py-2 md:py-1 mx-1 rounded-sm cursor-pointer transition-colors
                  ${isSelected ? 'bg-primary/15 text-primary' : 'text-light-text hover:bg-surface'}`}
                onClick={() => handleSelectFile(file)}
              >
                <FileText
                  size={14}
                  className={`shrink-0 md:w-3 md:h-3 ${isSelected ? 'text-primary' : 'text-dark-text'}`}
                />
                <span className="flex-1 text-xs truncate font-mono text-left">{file.name}</span>
                <span className="text-[10px] text-dark-text/50 shrink-0 mr-1">{lineCount(file.content)}L</span>
                {confirmDelete === file.name ? (
                  <div className="flex gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="text-[10px] px-1.5 py-0.5 bg-error/20 text-error rounded hover:bg-error/30 transition-colors"
                    >
                      Del
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="text-[10px] px-1.5 py-0.5 text-dark-text hover:text-light-text rounded hover:bg-background transition-colors"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(file.name);
                      }}
                      className="text-dark-text/40 hover:text-error shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                      title="Delete file"
                    >
                      <Trash2 size={12} />
                    </button>
                    {/* Mobile: chevron hint */}
                    <ChevronRight size={14} className="shrink-0 text-dark-text/30 md:hidden" />
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  /* ── File content panel ──────────────────────────────── */
  const renderFileContent = () => (
    <div className="flex-1 flex flex-col min-h-0">
      {selectedFile ? (
        <>
          {/* File header */}
          <div className="h-10 md:h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {/* Mobile back button */}
              <button
                onClick={() => setMobileView('list')}
                className="md:hidden flex items-center gap-0.5 text-dark-text hover:text-light-text mr-1 -ml-1 p-0.5 rounded transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <FileText size={12} className="text-primary shrink-0" />
              <span className="text-xs font-mono text-light-text truncate">{selectedFile.name}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-dark-text">
                {lineCount(selectedFile.content)} lines · {selectedFile.content.length} chars
              </span>
              {onOpenFile && (
                <button
                  onClick={() => {
                    onOpenFile(selectedFile.name, selectedFile.content);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-primary hover:text-light-text
                    bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                  title="Open in editor tab"
                >
                  <ExternalLink size={10} />
                  <span className="hidden sm:inline">Open in Editor</span>
                  <span className="sm:hidden">Open</span>
                </button>
              )}
            </div>
          </div>

          {/* File content */}
          <pre
            style={{ fontSize: 'var(--editor-font-size)' }}
            className="flex-1 p-4 font-mono text-light-text overflow-auto leading-relaxed
              scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
              scrollbar-track-background scrollbar-thumb-rounded-full"
          >
            <code>{selectedFile.content || <span className="text-dark-text italic">(empty file)</span>}</code>
          </pre>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-dark-text">
          <HardDrive size={32} className="opacity-30" />
          <div className="text-sm">
            {files.length > 0 ? 'Select a file to view its contents' : 'No files to display'}
          </div>
          {files.length > 0 && (
            <div className="text-xs opacity-60">
              {files.length} file{files.length !== 1 ? 's' : ''} stored in localStorage
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center justify-center w-7 h-7 text-dark-text hover:text-light-text
          hover:bg-background rounded transition-colors"
        title="View Files"
      >
        <FolderOpen size={15} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-3">
          <div
            ref={modalRef}
            className="bg-background border-0 md:border border-border md:rounded-md
              w-full h-full md:h-auto md:max-w-4xl md:max-h-[80vh]
              flex flex-col shadow-intense overflow-hidden"
          >
            {/* Header bar */}
            <div className="h-10 md:h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
              <div className="flex items-center gap-2">
                <HardDrive className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-light-text uppercase">Files</span>
                {files.length > 0 && <span className="text-xs text-dark-text">({files.length})</span>}
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setNewFileName('');
                    setCreateFileError('');
                  }}
                  className="ml-2 text-dark-text hover:text-primary p-0.5 rounded hover:bg-background transition-colors"
                  title="New File"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex items-center gap-1">
                {files.length > 0 &&
                  (confirmDelete === '__all__' ? (
                    <div className="flex items-center gap-1 mr-1">
                      <span className="text-xs text-dark-text">Delete all?</span>
                      <button
                        onClick={handleDeleteAll}
                        className="text-xs px-1.5 py-0.5 bg-error/20 text-error rounded hover:bg-error/30 transition-colors"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs px-1.5 py-0.5 text-dark-text hover:text-light-text rounded hover:bg-background transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete('__all__')}
                      className="text-dark-text hover:text-error p-1 rounded hover:bg-background transition-colors"
                      title="Delete all files"
                    >
                      <Trash2 size={13} />
                    </button>
                  ))}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-dark-text hover:text-light-text p-1 rounded hover:bg-background transition-colors"
                >
                  <X size={16} className="md:w-3.5 md:h-3.5" />
                </button>
              </div>
            </div>

            {/* Desktop: side-by-side layout */}
            <div className="hidden md:flex flex-1 min-h-0">
              <div className="w-56 border-r border-border flex flex-col min-h-0 shrink-0">{renderFileList()}</div>
              {renderFileContent()}
            </div>

            {/* Mobile: single-pane navigation */}
            <div className="flex md:hidden flex-1 min-h-0">
              {mobileView === 'list' ? renderFileList() : renderFileContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileViewer;
