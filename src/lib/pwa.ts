// Whether the app is running as an installed PWA (added to the home screen /
// launched standalone) rather than in a normal browser tab. Both load the same
// URL, so the only reliable signal is the display mode.
export function isInstalledPwa(): boolean {
  // Chrome/Edge/Android/desktop installs report standalone (or fullscreen /
  // minimal-ui) via the display-mode media query.
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  // iOS Safari predates display-mode and exposes a legacy navigator flag.
  if ((navigator as unknown as { standalone?: boolean }).standalone) return true
  return false
}
