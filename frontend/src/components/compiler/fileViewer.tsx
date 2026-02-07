import React, { useState, useEffect, useRef } from 'react';
import { FolderOpen, Trash2, X } from 'lucide-react';

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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div ref={modalRef} className="bg-background rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-border">
              <h2 className="text-xl font-semibold text-primary">
                Files {files.length > 0 && <span className="text-sm text-dark-text">({files.length})</span>}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-dark-text hover:text-primary">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row min-h-0">
              {/* Left Panel - File List */}
              <div className="w-full md:w-64 border-r-2 border-border flex flex-col min-h-0">
                <div
                  className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary
                    hover:scrollbar-thumb-primary-hover scrollbar-track-background scrollbar-thumb-rounded-full"
                >
                  {files.length === 0 ? (
                    <div className="p-4 text-sm text-dark-text">
                      No files yet. Use OPENFILE/WRITEFILE in your pseudocode to create files.
                    </div>
                  ) : (
                    files.map((file) => (
                      <div
                        key={file.name}
                        className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors duration-150
                          ${selectedFile?.name === file.name ? 'bg-surface text-primary' : 'hover:bg-surface'}`}
                      >
                        <button
                          onClick={() => setSelectedFile(file)}
                          className="flex-1 text-left truncate mr-2"
                        >
                          {file.name}
                        </button>
                        {confirmDelete === file.name ? (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => handleDelete(file.name)}
                              className="text-xs px-2 py-0.5 bg-error rounded text-light-text hover:bg-error-hover"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-xs px-2 py-0.5 border border-border rounded hover:border-primary"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(file.name)}
                            className="text-dark-text hover:text-error shrink-0"
                            title="Delete file"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Panel - File Content */}
              <div className="flex-1 flex flex-col min-h-0 p-4">
                {selectedFile ? (
                  <>
                    <h3 className="text-lg font-semibold text-primary mb-4">{selectedFile.name}</h3>
                    <pre
                      className="flex-1 bg-code-bg p-4 rounded-lg overflow-y-auto
                        scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
                        scrollbar-track-background scrollbar-thumb-rounded-full"
                    >
                      <code className="text-light-text">{selectedFile.content}</code>
                    </pre>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-dark-text">
                    {files.length > 0 ? 'Select a file to view its contents' : 'No files to display'}
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
