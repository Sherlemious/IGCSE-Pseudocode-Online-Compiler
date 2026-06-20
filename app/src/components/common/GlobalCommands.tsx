'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTheme, themes, type PresetThemeId } from '../../theme';
import { useRegisterCommands, type Command } from './CommandPalette';
import { SITE_URL } from '@/lib/seo';

const GITHUB_URL = 'https://github.com/Sherlemious/IGCSE-Pseudocode-Online-Compiler';
const PORTFOLIO_URL = 'https://www.sherlemious.com';
const SHORTCUTS_EVENT = 'pseudocode:open-shortcuts';

const themeOrder: PresetThemeId[] = ['one-dark-pro', 'dracula', 'nord', 'monokai', 'github-light'];

async function shareTool() {
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: 'IGCSE & AS/A Level Pseudocode Compiler', url: SITE_URL });
      return;
    }
  } catch {
    return; // user cancelled the native sheet
  }
  try {
    await navigator.clipboard.writeText(SITE_URL);
    toast.success('Link copied — share it with classmates');
  } catch {
    /* clipboard unavailable */
  }
}

/**
 * Registers the always-available commands (navigation, theme, links, keyboard
 * shortcuts) into the palette. Renders nothing.
 */
export default function GlobalCommands() {
  const router = useRouter();
  const theme = useTheme();

  const commands: Command[] = [
    { id: 'go-home', label: 'Go to Compiler', group: 'Go to', keywords: 'home editor run', run: () => router.push('/') },
    { id: 'go-docs', label: 'Go to Docs', group: 'Go to', keywords: 'reference help', run: () => router.push('/docs') },
    { id: 'go-practice', label: 'Go to Practice', group: 'Go to', keywords: 'questions', run: () => router.push('/practice') },
    { id: 'go-exam', label: 'Go to Exam', group: 'Go to', keywords: 'timed test', run: () => router.push('/exam') },

    { id: 'view-wrap', label: 'Toggle word wrap', group: 'View', run: () => theme.setWordWrap(!theme.wordWrap) },
    { id: 'view-dyslexic', label: 'Toggle dyslexia-friendly font', group: 'View', keywords: 'opendyslexic accessibility', run: () => theme.setDyslexicFont(!theme.dyslexicFont) },
    { id: 'view-font-inc', label: 'Increase font size', group: 'View', keywords: 'bigger zoom', run: () => theme.setFontSize(theme.fontSize + 1) },
    { id: 'view-font-dec', label: 'Decrease font size', group: 'View', keywords: 'smaller zoom', run: () => theme.setFontSize(theme.fontSize - 1) },
    { id: 'view-shortcuts', label: 'Keyboard shortcuts', group: 'View', keywords: 'keys help', run: () => window.dispatchEvent(new CustomEvent(SHORTCUTS_EVENT)) },
    ...themeOrder.map<Command>((id) => ({
      id: `view-theme-${id}`,
      label: `Theme: ${themes[id].label}`,
      group: 'View',
      keywords: 'colour color appearance',
      run: () => theme.setTheme(id),
    })),

    { id: 'link-github', label: 'GitHub repository', group: 'Links', keywords: 'source code', run: () => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer') },
    { id: 'link-portfolio', label: 'Portfolio — Sherlemious', group: 'Links', keywords: 'author about', run: () => window.open(PORTFOLIO_URL, '_blank', 'noopener,noreferrer') },
    { id: 'link-share', label: 'Share this tool', group: 'Links', keywords: 'recommend classmates teacher', run: shareTool },
  ];

  useRegisterCommands(commands);
  return null;
}
