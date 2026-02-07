import * as Popover from '@radix-ui/react-popover';
import { Settings, Minus, Plus, Check } from 'lucide-react';
import { themes, type ThemeId, useTheme } from '../../theme';

const themeOrder: ThemeId[] = ['electron', 'midnight-purple', 'nord', 'monokai', 'light'];

export default function SettingsPanel() {
  const { themeId, setTheme, fontSize, setFontSize } = useTheme();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-1 rounded hover:bg-white/10 transition duration-200" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-72 rounded-lg bg-surface border border-border p-4 shadow-intense"
          sideOffset={8}
          align="end"
        >
          {/* Theme selector */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-light-text mb-3">Theme</h3>
            <div className="grid grid-cols-5 gap-2">
              {themeOrder.map((id) => {
                const theme = themes[id];
                const isActive = id === themeId;
                return (
                  <button
                    key={id}
                    onClick={() => setTheme(id)}
                    className="flex flex-col items-center gap-1 group"
                    aria-label={theme.label}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                        ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : 'hover:scale-110'}`}
                      style={{
                        backgroundColor: theme.swatch,
                        border: id === 'light' ? '2px solid var(--color-border)' : undefined,
                      }}
                    >
                      {isActive && (
                        <Check className="h-4 w-4" style={{ color: id === 'light' ? '#1E293B' : '#FFFFFF' }} />
                      )}
                    </div>
                    <span className="text-[10px] text-dark-text leading-tight text-center">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font size control */}
          <div>
            <h3 className="text-sm font-semibold text-light-text mb-3">Font Size</h3>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setFontSize(fontSize - 1)}
                disabled={fontSize <= 12}
                className="p-1.5 rounded-md bg-background hover:opacity-80 transition disabled:opacity-40"
                aria-label="Decrease font size"
              >
                <Minus className="h-4 w-4 text-light-text" />
              </button>
              <span className="text-light-text font-mono text-sm min-w-[3ch] text-center">{fontSize}px</span>
              <button
                onClick={() => setFontSize(fontSize + 1)}
                disabled={fontSize >= 24}
                className="p-1.5 rounded-md bg-background hover:opacity-80 transition disabled:opacity-40"
                aria-label="Increase font size"
              >
                <Plus className="h-4 w-4 text-light-text" />
              </button>
            </div>
          </div>

          <Popover.Arrow className="fill-surface" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
