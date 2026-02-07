import React, { useState, useEffect, useRef } from 'react';
import { FolderOpen, FileText, Trash2, X, HardDrive } from 'lucide-react';

const FILE_PREFIX = 'pseudocode_file_';

interface FileEntry {
  name: string;
  content: string;
}

const FileViewer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
    setIsOpen(true);
  };

  const handleDelete = (fileName: string) => {
    localStorage.removeItem(FILE_PREFIX + fileName);
    if (selectedFile?.name === fileName) setSelectedFile(null);
    setConfirmDelete(null);
    loadFiles();
  };

  const handleDeleteAll = () => {
    files.forEach((f) => localStorage.removeItem(FILE_PREFIX + f.name));
    setSelectedFile(null);
    setConfirmDelete(null);
    loadFiles();
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

  const lineCount = (content: string) => content.split('\n').length;

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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3">
          <div
            ref={modalRef}
            className="bg-background border border-border rounded-md w-full max-w-4xl max-h-[80vh] flex flex-col shadow-intense overflow-hidden"
          >
            {/* Header bar */}
            <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
              <div className="flex items-center gap-2">
                <HardDrive className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-light-text uppercase">Files</span>
                {files.length > 0 && (
                  <span className="text-xs text-dark-text">({files.length})</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {files.length > 0 && (
                  confirmDelete === '__all__' ? (
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
                  )
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-dark-text hover:text-light-text p-1 rounded hover:bg-background transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row min-h-0">
              {/* Left panel — file list */}
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-border flex flex-col min-h-0 shrink-0">
                <div
                  className="flex-1 overflow-y-auto py-1
                    scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
                    scrollbar-track-background scrollbar-thumb-rounded-full"
                >
                  {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 px-4 py-8">
                      <FolderOpen size={28} className="text-dark-text opacity-30" />
                      <div className="text-xs text-dark-text text-center leading-relaxed">
                        No files yet.<br />
                        Use <code className="bg-code-bg px-1 py-0.5 rounded text-primary text-[0.85em]">OPENFILE</code> / <code className="bg-code-bg px-1 py-0.5 rounded text-primary text-[0.85em]">WRITEFILE</code> in your pseudocode to create files.
                      </div>
                    </div>
                  ) : (
                    files.map((file) => {
                      const isSelected = selectedFile?.name === file.name;
                      return (
                        <div
                          key={file.name}
                          className={`group flex items-center gap-1.5 px-2 py-1 mx-1 rounded-sm cursor-pointer transition-colors
                            ${isSelected ? 'bg-primary/15 text-primary' : 'text-light-text hover:bg-surface'}`}
                        >
                          <FileText size={12} className={`shrink-0 ${isSelected ? 'text-primary' : 'text-dark-text'}`} />
                          <button
                            onClick={() => { setSelectedFile(file); setConfirmDelete(null); }}
                            className="flex-1 text-left text-xs truncate font-mono"
                          >
                            {file.name}
                          </button>
                          <span className="text-[10px] text-dark-text/50 shrink-0 mr-1">
                            {lineCount(file.content)}L
                          </span>
                          {confirmDelete === file.name ? (
                            <div className="flex gap-0.5 shrink-0">
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
                            <button
                              onClick={() => setConfirmDelete(file.name)}
                              className="text-dark-text/40 hover:text-error shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete file"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right panel — file content */}
              <div className="flex-1 flex flex-col min-h-0">
                {selectedFile ? (
                  <>
                    {/* File header */}
                    <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileText size={12} className="text-primary shrink-0" />
                        <span className="text-xs font-mono text-light-text truncate">{selectedFile.name}</span>
                      </div>
                      <span className="text-[10px] text-dark-text shrink-0">
                        {lineCount(selectedFile.content)} lines · {selectedFile.content.length} chars
                      </span>
                    </div>

                    {/* File content with line numbers */}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileViewer;
