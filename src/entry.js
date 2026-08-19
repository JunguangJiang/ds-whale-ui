// Plugin entry: register the whale dock row (above the composer, replacing
// the built-in "Deep diving..." status line), the settings-panel slot, locale
// dictionaries, and the settings scope wiring.

const React = require('react')

const NS = 'ds-whale-ui'

mod.name = NS
mod.inject = ['slots', 'locale', 'settingsScope']

mod.apply = function apply(ctx) {
  // One-time style injection (module-level side effect equivalent; the module
  // system tracks the data-plugin tag for HMR cleanup).
  const styleEl = document.createElement('style')
  styleEl.setAttribute('data-plugin', NS)
  styleEl.textContent = local.styles.css
  document.head.appendChild(styleEl)

  ctx.effect(() => ctx.locale.register(NS, local.locales.dictionaries), 'ds-whale-ui: dictionaries')
  const t = ctx.locale.bind(NS)

  // Durable preferences: attach the host-backed scope when available; the
  // store degrades to local defaults otherwise.
  let bound = null
  try {
    bound = ctx.settingsScope.bind({ namespace: NS })
  } catch (_error) {
    bound = null
  }
  local.store.settingsStore.attach(bound)

  const { WhaleDock } = local.dock
  const { SettingsPanel } = local['settings-panel']

  // The row above the composer card (conversation.input.dock, session scope):
  // the same visual band the built-in turn-status line occupies. Session
  // scope means the standard kit carries useSession/useSessions/sessionId,
  // and the entry disappears with the session (hero/no-session → no row).
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
    name: 'conversation.input.dock',
    id: NS,
    order: 0,
    label: () => 'ds-whale-ui',
  }, (props) => React.createElement(WhaleDock, { ...props, t })))

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: NS,
    order: 60,
    label: () => t('settings.nav'),
    locale: NS,
  }, () => React.createElement(SettingsPanel, { t })))
}
