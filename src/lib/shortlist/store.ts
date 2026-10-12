"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The visitor's shortlist of properties, kept in their own browser.
 * It is a convenience, not a record: the request sent to Majestia is what counts.
 */

const STORAGE_KEY = "majestia.shortlist.v1";
const EMPTY: readonly string[] = Object.freeze([]);

let snapshot: readonly string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): readonly string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return EMPTY;
    const slugs = parsed.filter((item): item is string => typeof item === "string");
    return slugs.length > 0 ? slugs : EMPTY;
  } catch {
    return EMPTY;
  }
}

function ensureLoaded(): void {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  snapshot = readStorage();
}

function commit(next: readonly string[]): void {
  snapshot = next.length > 0 ? next : EMPTY;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage unavailable: the shortlist lasts for this visit only.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  ensureLoaded();
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    snapshot = readStorage();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): readonly string[] {
  ensureLoaded();
  return snapshot;
}

function getServerSnapshot(): readonly string[] {
  return EMPTY;
}

export const shortlist = {
  toggle(slug: string): void {
    ensureLoaded();
    commit(
      snapshot.includes(slug) ? snapshot.filter((item) => item !== slug) : [...snapshot, slug],
    );
  },
  remove(slug: string): void {
    ensureLoaded();
    if (snapshot.includes(slug)) commit(snapshot.filter((item) => item !== slug));
  },
  clear(): void {
    ensureLoaded();
    if (snapshot.length > 0) commit(EMPTY);
  },
};

export function useShortlist() {
  const slugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);
  return { slugs, has, toggle: shortlist.toggle, remove: shortlist.remove, clear: shortlist.clear };
}
