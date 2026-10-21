"use client";

import { useSyncExternalStore } from "react";

// Facilitator mode: add ?facilitator=1 to any page URL to reveal answer keys and demo scripts.
// Convenience only, not security: the keys ship in the page payload.
const subscribe = (cb: () => void) => {
  window.addEventListener("popstate", cb);
  return () => window.removeEventListener("popstate", cb);
};

export function useFacilitator(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get("facilitator") === "1",
    () => false,
  );
}
