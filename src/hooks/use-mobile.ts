import * as React from "react"

const MOBILE_BREAKPOINT = 768
const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

/**
 * True below the md breakpoint. Read during render (not in an effect), so a phone gets the
 * phone layout on the first paint instead of a flash of the desktop one.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}
