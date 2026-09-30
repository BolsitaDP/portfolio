"use client";

import { useSyncExternalStore } from "react";

// next-themes applies the `dark` class in its own effect, which runs after the
// effects of its children, so `resolvedTheme` flips before the CSS tokens do.
// Watching the class itself guarantees the tokens are already in place.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [ "class" ],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function useIsDarkTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
