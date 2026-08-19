// Module-level preferences store shared by the dock row and the settings
// panel. Host settings mirror in through the attached settings scope; user
// edits persist back through scope.set(field, value).

const DEFAULT_SETTINGS = {
  enabled: true,
  intensity: 'full', // full | eco
  showElapsed: true,
  // Legacy field kept for compatibility with previously stored sections;
  // the whale now lives above the composer, so barPosition is unused.
  barPosition: 'top', // top | bottom (deprecated)
  color: 'blue', // blue | pink | orange — accents the waterline bar + chip
  customLogo: '', // data URL of an uploaded whale image; '' = brand logo
}

const COLORS = {
  blue: '#4d6bfe', // DeepSeek brand blue
  pink: '#f284b8',
  orange: '#f0a050',
}

let value = { ...DEFAULT_SETTINGS }
let scope = null
let attached = false
const listeners = new Set()

const store = {
  getSnapshot: () => value,
  subscribe: (listener) => {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
  set(patch) {
    value = { ...value, ...patch }
    for (const listener of [...listeners]) listener()
  },
  /** Local + durable write: mirror immediately, then persist field by field. */
  persist(patch) {
    store.set(patch)
    if (scope == null) return
    for (const key of Object.keys(patch)) void scope.set(key, patch[key])
  },
  /** Wire one bound settings scope (may be null → local defaults only). */
  attach(bound) {
    if (attached) return
    attached = true
    if (bound == null) return
    scope = bound
    const apply = () => {
      const snap = bound.getSnapshot()
      if (snap && snap.status === 'ready' && snap.value && typeof snap.value === 'object') {
        store.set(snap.value)
      }
    }
    apply()
    bound.subscribe(apply)
  },
}

mod.DEFAULT_SETTINGS = DEFAULT_SETTINGS
mod.COLORS = COLORS
mod.settingsStore = store
