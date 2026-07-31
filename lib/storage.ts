import type { Thought } from "./types";

const STORAGE_KEY = "pepi-thoughts-v1";

export function loadThoughts() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as Thought[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveThoughts(thoughts: Thought[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
}
