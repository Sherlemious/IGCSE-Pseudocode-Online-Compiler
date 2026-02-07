import React, { useState, useEffect, useRef } from 'react';
import { Book, Search, X, ChevronRight, ChevronLeft, FileCode, ArrowRight } from 'lucide-react';
import { examples, type Example } from '../../data/examples';

const ExamplePicker: React.FC<{ onSelectExample: (code: string) => void }> = ({ onSelectExample }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  // Mobile: 'list' shows the browser, 'detail' shows the code preview
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const modalRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (search) {
      setExpandedCategories(new Set(categories));
    }
  }, [search]);

  const filteredExamples = examples.filter(
    (ex) =>
      ex.title.toLowerCase().includes(search.toLowerCase()) ||
      ex.category.toLowerCase().includes(search.toLowerCase()),
  );

  const categories = [...new Set(examples.map((ex) => ex.category))];

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleOpen = () => {
    setSearch('');
    setSelectedExample(null);
    setMobileView('list');
    setExpandedCategories(new Set([categories[0]]));
    setIsOpen(true);
  };

  const handleSelectExample = (example: Example) => {
    setSelectedExample(example);
    setMobileView('detail');
  };

  const handleUse = () => {
    if (selectedExample) {
      onSelectExample(selectedExample.code);
      setIsOpen(false);
    }
  };

  /* ── Browser panel (list of examples) ────────────────── */
  const renderBrowser = () => (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search */}
      <div className="p-2 border-b border-border shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-dark-text" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Filter examples..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-background border border-border
              rounded focus:border-primary focus:outline-none text-light-text
              placeholder:text-dark-text"
          />
        </div>
      </div>

      {/* Tree list */}
      <div
        className="flex-1 overflow-y-auto py-1
          scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
          scrollbar-track-background scrollbar-thumb-rounded-full"
      >
        {categories.map((category) => {
          const categoryExamples = filteredExamples.filter((ex) => ex.category === category);
          if (categoryExamples.length === 0) return null;
          const isExpanded = expandedCategories.has(category) || search.length > 0;

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-1 px-2 py-1.5 md:py-1 text-xs font-semibold text-dark-text
                  hover:text-light-text hover:bg-surface/50 transition-colors"
              >
                <ChevronRight
                  size={12}
                  className={`shrink-0 transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''}`}
                />
                <span className="uppercase tracking-wider">{category}</span>
                <span className="text-dark-text/60 font-normal ml-auto">{categoryExamples.length}</span>
              </button>

              {isExpanded && (
                <div className="ml-2">
                  {categoryExamples.map((example) => {
                    const isSelected = selectedExample?.title === example.title;
                    return (
                      <button
                        key={example.title}
                        onClick={() => handleSelectExample(example)}
                        className={`w-full flex items-center gap-1.5 px-3 py-1.5 md:py-1 text-xs rounded-sm transition-colors
                          ${isSelected
                            ? 'bg-primary/15 text-primary'
                            : 'text-light-text hover:bg-surface'
                          }`}
                      >
                        <FileCode size={12} className={`shrink-0 ${isSelected ? 'text-primary' : 'text-dark-text'}`} />
                        <span className="truncate text-left">{example.title}</span>
                        {/* Mobile: show a chevron hint */}
                        <ChevronRight size={12} className="shrink-0 text-dark-text/40 ml-auto md:hidden" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredExamples.length === 0 && (
          <div className="px-4 py-6 text-center text-xs text-dark-text">
            No examples match &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </div>
  );

  /* ── Preview panel (code) ────────────────────────────── */
  const renderPreview = () => (
    <div className="flex-1 flex flex-col min-h-0">
      {selectedExample ? (
        <>
          {/* Preview header */}
          <div className="h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {/* Mobile back button */}
              <button
                onClick={() => setMobileView('list')}
                className="md:hidden flex items-center gap-0.5 text-dark-text hover:text-light-text mr-1 -ml-1 p-0.5 rounded transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <FileCode size={12} className="text-primary shrink-0" />
              <span className="text-xs font-mono text-light-text truncate">{selectedExample.title}</span>
              <span className="text-xs text-dark-text hidden sm:inline">— {selectedExample.category}</span>
            </div>
            <button
              onClick={handleUse}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded
                bg-primary/15 text-primary hover:bg-primary/25 transition-colors shrink-0"
            >
              Load
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Code preview */}
          <pre
            style={{ fontSize: 'var(--editor-font-size)' }}
            className="flex-1 p-4 font-mono text-light-text overflow-auto leading-relaxed
              scrollbar-thin scrollbar-thumb-primary hover:scrollbar-thumb-primary-hover
              scrollbar-track-background scrollbar-thumb-rounded-full"
          >
            <code>{selectedExample.code}</code>
          </pre>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-dark-text">
          <Book size={32} className="opacity-30" />
          <div className="text-sm">Select an example to preview</div>
          <div className="text-xs opacity-60">
            {examples.length} examples across {categories.length} categories
          </div>
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
        title="Browse Examples"
      >
        <Book size={15} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center md:p-3">
          <div
            ref={modalRef}
            className="bg-background border-0 md:border border-border md:rounded-md
              w-full h-full md:h-auto md:max-w-5xl md:max-h-[85vh]
              flex flex-col shadow-intense overflow-hidden"
          >
            {/* Header bar */}
            <div className="h-10 md:h-9 bg-surface border-b border-border flex items-center justify-between px-3 shrink-0">
              <div className="flex items-center gap-2">
                <Book className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-light-text uppercase">Examples</span>
                <span className="text-xs text-dark-text">({filteredExamples.length})</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-dark-text hover:text-light-text p-1 rounded hover:bg-background transition-colors"
              >
                <X size={16} className="md:w-3.5 md:h-3.5" />
              </button>
            </div>

            {/* Desktop: side-by-side layout */}
            <div className="hidden md:flex flex-1 min-h-0">
              {/* Left panel */}
              <div className="w-64 border-r border-border flex flex-col min-h-0 shrink-0">
                {renderBrowser()}
              </div>
              {/* Right panel */}
              {renderPreview()}
            </div>

            {/* Mobile: single-pane navigation */}
            <div className="flex md:hidden flex-1 min-h-0">
              {mobileView === 'list' ? renderBrowser() : renderPreview()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamplePicker;
