import { useEffect, useRef } from 'react'

// While `isOpen`, pushes a history entry so the device/browser Back button closes
// the thing (calls `onClose`) instead of navigating away. When it closes by other
// means (✕ / Save / tapping the scrim), the pushed entry is unwound so Back still
// works normally afterwards. Pairs with App's tab history (Back here only pops the
// extra entry; App's popstate just re-applies the unchanged current tab).
export function useBackToClose(isOpen: boolean, onClose: () => void): void {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!isOpen) return
    window.history.pushState({ modal: true }, '')
    function onPop() {
      onCloseRef.current()
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      // Closed by something other than Back: remove the entry we pushed.
      if ((window.history.state as { modal?: boolean } | null)?.modal) {
        window.history.back()
      }
    }
  }, [isOpen])
}
