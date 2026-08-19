// WhaleDock — the whale band rendered into the `conversation.input.dock`
// slot: the full-width strip right above the composer card, the same visual
// position the built-in "Deep diving..." turn-status line occupies (the
// plugin hides that line via scoped CSS). Idle renders nothing at all, so
// the band never affects reading or typing while the model is quiet; while
// visible the row is pointer-events:none except the whale glyph itself.
// All live facts come from the standard useSession selector hook.

const React = require('react')

const h = React.createElement
const { useEffect, useRef, useState, useSyncExternalStore } = React

const { settingsStore, COLORS } = local.store
const { KIND, derivePhase } = local.state

const SETTLE_MS = { success: 1100, error: 900 }
const LEAVE_MS = 320

// DeepSeek brand whale (figma I39:24057;88:8943 fillGeometry — the exact
// extract the harness's own FishLogo primitive uses). Native 23.16x17.04,
// faces left like the emoji it replaces, so the flip layer needs no change.
const WHALE_PATH = 'M22.9168 1.43018C22.6713 1.31018 22.5658 1.53918 22.4223 1.65519C22.3733 1.69269 22.3318 1.74169 22.2903 1.78669C21.9317 2.1697 21.5127 2.42121 20.9657 2.39121C20.1657 2.34621 19.4827 2.59771 18.8787 3.20973C18.7502 2.45521 18.3236 2.0047 17.6746 1.71569C17.3351 1.56568 16.9916 1.41518 16.7536 1.08867C16.5876 0.856163 16.5421 0.597155 16.4591 0.341647C16.4061 0.187643 16.3536 0.0301382 16.1761 0.00363739C15.9836 -0.0263635 15.9081 0.135141 15.8326 0.270145C15.5306 0.822162 15.4136 1.43018 15.4251 2.0462C15.4516 3.43174 16.0366 4.53527 17.1991 5.3203C17.3311 5.4103 17.3651 5.5003 17.3236 5.63181C17.2441 5.90231 17.1501 6.16482 17.0671 6.43533C17.0141 6.60784 16.9351 6.64584 16.7501 6.57033C16.1121 6.30383 15.5611 5.90931 15.074 5.4328C14.2475 4.63328 13.5 3.75075 12.568 3.05973C12.349 2.89822 12.13 2.74822 11.9034 2.60522C10.9524 1.68169 12.028 0.923165 12.277 0.833162C12.5375 0.739159 12.3675 0.41615 11.5259 0.42015C10.6844 0.42365 9.91439 0.705658 8.93286 1.08117C8.78935 1.13767 8.63835 1.17867 8.48384 1.21267C7.59332 1.04367 6.66829 1.00617 5.70226 1.11517C3.88321 1.31768 2.43016 2.1777 1.36213 3.64575C0.0790928 5.4103 -0.222916 7.41536 0.146595 9.50642C0.535106 11.7105 1.66014 13.535 3.38869 14.9616C5.18125 16.4406 7.24581 17.1657 9.60138 17.0266C11.0319 16.9441 12.6245 16.7526 14.421 15.2321C14.874 15.4576 15.3496 15.5476 16.1381 15.6151C16.7456 15.6716 17.3306 15.5851 17.7836 15.4911C18.4931 15.3411 18.4441 14.6841 18.1876 14.5636C16.1081 13.595 16.5646 13.9891 16.1496 13.67C17.2061 12.42 18.8202 10.1979 19.3182 7.17235C19.3672 6.83834 19.4297 6.36783 19.4222 6.09732C19.4182 5.93231 19.4562 5.86831 19.6447 5.84931C20.1657 5.78931 20.6712 5.64681 21.1357 5.3913C22.4833 4.65528 23.0268 3.44624 23.1548 1.9972C23.1738 1.77569 23.1508 1.54668 22.9168 1.43018ZM11.1749 14.4736C9.15936 12.889 8.18184 12.3675 7.77832 12.39C7.40081 12.4125 7.46881 12.8445 7.55182 13.126C7.63882 13.404 7.75182 13.5955 7.91033 13.8396C8.01983 14.0011 8.09533 14.2411 7.80083 14.4216C7.15181 14.8231 6.02327 14.2866 5.97027 14.2601C4.65673 13.4865 3.5587 12.4655 2.78467 11.069C2.03715 9.72493 1.60314 8.28289 1.53164 6.74384C1.51264 6.37233 1.62214 6.24082 1.99215 6.17332C2.47916 6.08332 2.98118 6.06432 3.46769 6.13582C5.52476 6.43633 7.27581 7.35586 8.74385 8.8129C9.58188 9.64243 10.2159 10.634 10.8689 11.6025C11.5634 12.631 12.3105 13.611 13.262 14.4146C13.598 14.6961 13.866 14.9101 14.1225 15.0681C13.349 15.1546 12.058 15.1731 11.1749 14.4746L11.1749 14.4736ZM12.141 8.25988C12.141 8.09488 12.273 7.96338 12.439 7.96338C12.4765 7.96338 12.5105 7.97088 12.541 7.98188C12.5825 7.99688 12.6205 8.01938 12.6505 8.05338C12.7035 8.10588 12.7335 8.18088 12.7335 8.25988C12.7335 8.42489 12.6015 8.55639 12.4355 8.55639C12.2695 8.55639 12.141 8.42489 12.141 8.25988ZM15.1415 9.79893C14.949 9.87793 14.7565 9.94544 14.5715 9.95294C14.2845 9.96794 13.9715 9.85143 13.8015 9.70893C13.5375 9.48742 13.3485 9.36342 13.2695 8.97691C13.2355 8.8119 13.2545 8.55639 13.2845 8.40989C13.3525 8.09438 13.277 7.89187 13.0545 7.70787C12.8735 7.55786 12.643 7.51636 12.39 7.51636C12.2955 7.51636 12.209 7.47486 12.1445 7.44136C12.039 7.38886 11.9519 7.25735 12.035 7.09585C12.0615 7.04335 12.19 6.91584 12.22 6.89334C12.5635 6.69784 12.9595 6.76184 13.326 6.90834C13.6655 7.04735 13.9225 7.30236 14.292 7.66287C14.6695 8.09838 14.7375 8.21838 14.9525 8.54539C15.1225 8.8009 15.277 9.06341 15.3831 9.36392C15.4471 9.55142 15.3641 9.70493 15.1415 9.79893Z'

function WhaleGlyph(props) {
  // An uploaded custom logo (data URL persisted in settings) replaces the
  // brand path; both sit identically on the waterline and mirror with the
  // flip layer, so swim/flip/bob/spout all keep working unchanged.
  if (props && props.src) {
    return h('img', {
      className: 'ds-whale-ui-logo is-custom',
      src: props.src,
      alt: '',
      draggable: false,
      'aria-hidden': 'true',
    })
  }
  return h('svg', {
    className: 'ds-whale-ui-logo',
    viewBox: '0 0 23.16 17.04',
    width: 26,
    height: 19,
    fill: 'none',
    'aria-hidden': 'true',
  }, h('path', { d: WHALE_PATH, fill: 'currentColor' }))
}

function formatElapsed(ms) {
  const total = Math.floor(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/** Latest still-open turn's start time off the turn-timings map. */
function runningTurnStart(timings) {
  let start = null
  let latest = -1
  if (timings) {
    for (const [turn, timing] of timings) {
      if (timing.endTime === undefined && turn > latest) {
        latest = turn
        start = timing.startTime ?? null
      }
    }
  }
  return start
}

/**
 * The dock component. Session-scope kit props (useSession etc.) plus the
 * bound translator handed over at registration.
 * @param props - { useSession, t }
 */
mod.WhaleDock = function WhaleDock(props) {
  const { useSession, useProjection, t } = props

  // Selector-only reads off the standard session hook: every selector
  // returns a primitive or a stable reference, so re-renders stay rare.
  const running = useSession((s) => s.running === true)
  const partial = useSession((s) => s.partial != null)
  const runningCalls = useSession((s) => (s.runningCalls ? s.runningCalls.length : 0))
  const turnTimings = useSession((s) => s.turnTimings)
  const lastNodeKind = useSession((s) => (s.nodes && s.nodes.length > 0 ? s.nodes[s.nodes.length - 1].kind : null))

  // Plugin preferences (arrow-method store: safe to pass straight to uSES).
  const settings = useSyncExternalStore(settingsStore.subscribe, settingsStore.getSnapshot, settingsStore.getSnapshot)

  // Agent progress off the host-computed 'todos' projection (the same source
  // as the built-in plan strip). No plan published → no progress coupling.
  const todos = (typeof useProjection === 'function' ? useProjection('todos') : null) || null
  const todoTotal = todos ? todos.length : 0
  const todoDone = todos ? todos.filter((item) => item.status === 'completed').length : 0
  const hasPlan = todoTotal > 0
  const progress = hasPlan ? todoDone / todoTotal : 1

  const facts = {
    running,
    partial,
    runningCalls,
    turnStart: runningTurnStart(turnTimings),
    lastError: lastNodeKind === 'turn-error',
  }

  // Edge detection is render-synchronous: the ref seeds with the mount-time
  // running value, so a turn already in flight starts directly in
  // thinking/working, while a turn starting later still plays the enter phase.
  const prev = useRef({ running })
  const [finish, setFinish] = useState(null) // null | 'success' | 'error'
  const [leaving, setLeaving] = useState(false)
  const [playful, setPlayful] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const was = prev.current.running
    if (running && !was) {
      setFinish(null)
      setPlayful(false)
    }
    if (!running && was) setFinish(facts.lastError ? 'error' : 'success')
    prev.current.running = running
  }, [running, facts.lastError])

  useEffect(() => {
    if (!running || !settings.showElapsed) {
      setElapsed(0)
      return undefined
    }
    const tick = () => setElapsed(facts.turnStart != null ? Math.max(0, Date.now() - facts.turnStart) : 0)
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [running, settings.showElapsed, facts.turnStart])

  useEffect(() => {
    if (!playful) return undefined
    const id = setTimeout(() => setPlayful(false), 1100)
    return () => clearTimeout(id)
  }, [playful])

  // Exit choreography: after the finish animation settles, the band plays
  // its collapse (.is-leaving) and then unmounts entirely.
  useEffect(() => {
    if (running) {
      setLeaving(false)
      return undefined
    }
    if (finish == null) return undefined
    const settle = SETTLE_MS[finish] ?? SETTLE_MS.success
    const t1 = setTimeout(() => setLeaving(true), settle)
    const t2 = setTimeout(() => {
      setFinish(null)
      setLeaving(false)
    }, settle + LEAVE_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [running, finish])

  if (!settings.enabled) return null
  // Idle: nothing rendered, zero height, zero distraction.
  if (!running && finish == null) return null

  const phase = running
    ? derivePhase(prev.current, { ...facts, running })
    : (finish === 'success' ? KIND.finishSuccess : KIND.finishError)

  const finishing = !running && finish != null
  const active = running || finishing
  const phaseKey = finishing ? (finish === 'success' ? 'phase.finishSuccess' : 'phase.finishError') : `phase.${phase}`

  const color = COLORS[settings.color] || COLORS.blue
  const fullFx = settings.intensity === 'full'
  const showSpout = fullFx && running
  const showBubbles = fullFx && running && phase === KIND.working

  const speed = phase === KIND.working ? '2.8s' : phase === KIND.enter ? '4.5s' : '7s'

  const swimClass = 'ds-whale-ui-whale'
    + (fullFx ? ' swimming' : '')
    + (finishing ? ' paused' : '')
  const bodyClass = 'ds-whale-ui-body'
    + (finishing ? (finish === 'success' ? ' breaching' : ' diving') : '')
    + (playful ? ' playful' : '')
    + (running && phase === KIND.working ? ' working' : '')
    + (running && phase === KIND.thinking ? ' thinking' : '')

  const chip = hovered && active
    ? h('div', { className: 'ds-whale-ui-chip' },
        h('span', null, t(phaseKey)),
        hasPlan ? h('span', { className: 'ds-whale-ui-chip-time' }, `${todoDone}/${todoTotal}`) : null,
        settings.showElapsed ? h('span', { className: 'ds-whale-ui-chip-time' }, formatElapsed(elapsed)) : null,
        facts.runningCalls > 0 ? h('span', null, `${facts.runningCalls} ${t('chip.tools')}`) : null)
    : null

  // Progress lane: with a live plan the whale patrols only the completed
  // share of the row (min 18% so it still swims at 0/N), and the waterline
  // lights up to the same point. Without a plan the lane is the full row.
  const lanePercent = hasPlan ? 18 + 82 * progress : 100

  // Inline clock mirrors the replaced status line: appears only after the
  // turn has clearly been running for a while.
  const showInlineClock = running && settings.showElapsed && elapsed >= 15000

  return h('div', {
    className: 'ds-whale-ui-dock'
      + (finishing ? ' is-finishing' : '')
      + (leaving ? ' is-leaving' : '')
      + (running && phase === KIND.working ? ' is-working' : '')
      + (hasPlan ? ' has-progress' : '')
      + (fullFx ? '' : ' is-eco'),
    style: { '--ds-whale-color': color, '--ds-whale-speed': speed },
    role: 'status',
    'aria-live': 'polite',
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  },
    h('div', { className: 'ds-whale-ui-bar', 'aria-hidden': 'true' },
      h('div', { className: 'ds-whale-ui-bar-fill' }),
      hasPlan ? h('div', { className: 'ds-whale-ui-bar-progress', style: { width: `${lanePercent}%` } }) : null),
    fullFx && running
      ? h('div', { className: 'ds-whale-ui-ambient', 'aria-hidden': 'true' }, h('i'), h('i'))
      : null,
    showInlineClock
      ? h('span', { className: 'ds-whale-ui-elapsed', 'aria-hidden': 'true' }, formatElapsed(elapsed))
      : null,
    h('div', { className: 'ds-whale-ui-lane', style: { width: `${lanePercent}%` } },
      h('div', { className: swimClass, onClick: () => setPlayful(true), title: t(phaseKey) },
        h('div', { className: 'ds-whale-ui-flip' },
          h('div', { className: bodyClass },
            h(WhaleGlyph, { src: settings.customLogo || null }),
            showSpout
              ? h('div', { className: 'ds-whale-ui-spout', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'))
              : null,
            showBubbles
              ? h('div', { className: 'ds-whale-ui-bubbles', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'))
              : null)))),
    chip)
}
