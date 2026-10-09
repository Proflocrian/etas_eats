const UNLOCK_KEY = 'etaseats-unlocked'
export const UNLOCK_CODE = 'GRETAS-BDAY'

export function isUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === 'true'
  } catch {
    return false
  }
}

export function setUnlocked(value: boolean): void {
  try {
    localStorage.setItem(UNLOCK_KEY, value ? 'true' : 'false')
  } catch {
    // ignore (private mode / blocked storage)
  }
}
