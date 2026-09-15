export const SAVE_PROMPT_SHOWN_KEY = 'save_prompt_shown';
export const SAVE_PROMPT_DEV_PARAM = 'save_prompt';

export function hasShownSavePrompt(): boolean {
  try {
    return localStorage.getItem(SAVE_PROMPT_SHOWN_KEY) === '1';
  } catch {
    return false;
  }
}

export function markSavePromptShown(): void {
  try {
    localStorage.setItem(SAVE_PROMPT_SHOWN_KEY, '1');
  } catch {
    /* ignore */
  }
}

export function forceSavePromptFromUrl(): boolean {
  try {
    return new URLSearchParams(window.location.search).get(SAVE_PROMPT_DEV_PARAM) === '1';
  } catch {
    return false;
  }
}
