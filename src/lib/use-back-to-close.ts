import { useEffect, useRef } from 'react'

// Wires the device/browser Back button to close "closable" overlays (entry form,
// detail sheets, the GERD view, the fullscreen photo viewer, ...). Each open
// overlay pushes a history entry; Back pops it and closes that overlay instead
// of navigating away. Closing by other means (✕ / Save / tapping the scrim)
// unwinds the pushed entry so Back still works normally afterwards.
//
// Overlays may nest (e.g. the photo viewer sits inside the entry form), so this
// is built around a shared stack rather than one listener per hook. Two popstate
// subtleties this handles:
//   - A single Back fires EVERY popstate listener. So there's one shared listener
//     and only the top-of-stack overlay reacts - a Back closes just the innermost.
//   - The unwind on a non-Back close calls history.back(), which itself fires
//     popstate. A pending counter makes the shared listener ignore those
//     self-induced pops, so unwinding a child never closes its parent.
//
// Pairs with App's own tab history: when no overlay is open the shared listener
// no-ops, leaving App's popstate handler to re-apply the (unchanged) tab.

interface ModalEntry {
  close: () => void
}

const stack: ModalEntry[] = []
let pendingUnwind = 0 // self-induced history.back()s still to be ignored
let listening = false

function onPop() {
  if (pendingUnwind > 0) {
    pendingUnwind--
    return
  }
  // A real Back: it already popped the top entry's state, so drop it from the
  // stack (its cleanup then has nothing to unwind) and close that overlay only.
  const top = stack.pop()
  if (top) top.close()
}

function startListening() {
  if (listening) return
  window.addEventListener('popstate', onPop)
  listening = true
}

// Call this from a component that stays mounted while `isOpen` toggles (a view
// or the thing that renders the overlay), NOT from the overlay itself with a
// constant `isOpen={true}`: mounting with it already open makes StrictMode's
// double-invoked effect push+unwind+push and desync the history stack.
export function useBackToClose(isOpen: boolean, onClose: () => void): void {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return
    startListening()
    const entry: ModalEntry = { close: () => onCloseRef.current() }
    stack.push(entry)
    // Carry the current state (notably App's `tab`) onto the modal entry, so when
    // Back lands here App's popstate handler keeps the right tab instead of
    // defaulting to 'calendar'.
    window.history.pushState({ ...(window.history.state ?? {}), modal: true }, '')
    return () => {
      const i = stack.indexOf(entry)
      // Already popped by a real Back: nothing to unwind.
      if (i === -1) return
      stack.splice(i, 1)
      // Closed by other means: unwind our pushed entry. The resulting popstate
      // is counted so onPop ignores it.
      pendingUnwind++
      window.history.back()
    }
  }, [isOpen])
}
