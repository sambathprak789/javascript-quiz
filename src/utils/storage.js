const STORAGE_KEY = "js-quiz-progress-v1";

export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Storage can fail (private browsing, quota, disabled) — quiz still works, just won't persist.
  }
}

export function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
}

export function hasSavedProgress(saved) {
  return !!(saved && saved.level && Array.isArray(saved.questions) && saved.questions.length);
}
