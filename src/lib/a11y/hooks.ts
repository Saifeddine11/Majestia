"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.getClientRects().length > 0,
  );
}

/**
 * Keeps keyboard focus inside `container` while `active`, moves focus in on
 * activation and gives it back to the previously focused element afterwards.
 * An element marked `data-autofocus` receives the initial focus.
 */
export function useFocusTrap(container: RefObject<HTMLElement | null>, active: boolean): void {
  useEffect(() => {
    const node = container.current;
    if (!active || !node) return;

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const initial =
      node.querySelector<HTMLElement>("[data-autofocus]") ?? focusableWithin(node)[0] ?? node;
    initial.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusableWithin(node);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (event.shiftKey && (current === first || !node.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !node.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [container, active]);
}

const escapeStack: Array<() => void> = [];

function onDocumentEscape(event: KeyboardEvent): void {
  if (event.key !== "Escape" || escapeStack.length === 0) return;
  event.preventDefault();
  escapeStack[escapeStack.length - 1]();
}

/**
 * Calls `onEscape` when Escape is pressed. When several surfaces are open at
 * once, only the one opened last responds, so layers close one at a time.
 */
export function useEscapeKey(active: boolean, onEscape: () => void): void {
  const handler = useRef(onEscape);

  useEffect(() => {
    handler.current = onEscape;
  });

  useEffect(() => {
    if (!active) return;
    const entry = () => handler.current();
    escapeStack.push(entry);
    if (escapeStack.length === 1) document.addEventListener("keydown", onDocumentEscape);
    return () => {
      const index = escapeStack.indexOf(entry);
      if (index >= 0) escapeStack.splice(index, 1);
      if (escapeStack.length === 0) document.removeEventListener("keydown", onDocumentEscape);
    };
  }, [active]);
}

/** Calls `onOutside` for a press that lands outside every given element. */
export function useOutsidePress(
  refs: RefObject<HTMLElement | null>[],
  active: boolean,
  onOutside: () => void,
): void {
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      onOutside();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // `refs` is a fresh array on each render; its members are stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onOutside]);
}

let scrollLocks = 0;

/** Stops the page behind a modal surface from scrolling. Safe to nest. */
export function useLockBodyScroll(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    if (scrollLocks === 0) {
      const scrollbar = window.innerWidth - root.clientWidth;
      root.style.overflow = "hidden";
      if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    }
    scrollLocks += 1;
    return () => {
      scrollLocks -= 1;
      if (scrollLocks === 0) {
        root.style.overflow = "";
        root.style.paddingRight = "";
      }
    };
  }, [active]);
}

/** Tracks a media query. Reports `false` on the server and during hydration. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** `false` on the server and during hydration, `true` afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
