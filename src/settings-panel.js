// SettingsPanel — the whale preferences section rendered into the
// settings.section slot. Plain inputs, styled by the injected CSS.

const React = require('react')

const h = React.createElement
const { useRef, useState, useSyncExternalStore } = React

const { settingsStore, COLORS } = local.store

function row(label, control) {
  return h('div', { className: 'row' }, h('label', null, label), control)
}

// Downscale an uploaded image to a small transparent-friendly PNG data URL.
// 52px cap ≈ 2x the 26px display size (crisp on retina, tiny in settings.yaml
// — worst case ~10 KB). SVG uploads stay verbatim (vector, usually small).
const LOGO_MAX_EDGE = 52
const LOGO_MAX_BYTES = 512 * 1024

function readLogoFile(file) {
  return new Promise((resolve, reject) => {
    if (file.size > LOGO_MAX_BYTES) {
      reject(new Error('too-large'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read-failed'))
    reader.onload = () => {
      const dataUrl = String(reader.result)
      if (file.type === 'image/svg+xml') {
        resolve(dataUrl)
        return
      }
      const img = new Image()
      img.onerror = () => reject(new Error('decode-failed'))
      img.onload = () => {
        const scale = Math.min(1, LOGO_MAX_EDGE / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const hpx = Math.max(1, Math.round(img.height * scale))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = hpx
        canvas.getContext('2d').drawImage(img, 0, 0, w, hpx)
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Preferences panel; edits mirror into the shared store immediately and
 * persist through the settings scope.
 * @param props - { t: translator }
 */
mod.SettingsPanel = function SettingsPanel(props) {
  const { t } = props
  const settings = useSyncExternalStore(settingsStore.subscribe, settingsStore.getSnapshot, settingsStore.getSnapshot)
  const set = (patch) => settingsStore.persist(patch)
  const fileRef = useRef(null)
  const [logoError, setLogoError] = useState(null)

  const onLogoPick = async (event) => {
    const file = event.target.files && event.target.files[0]
    event.target.value = ''
    if (!file) return
    setLogoError(null)
    try {
      set({ customLogo: await readLogoFile(file) })
    } catch (_error) {
      setLogoError(t('settings.logo.error'))
    }
  }

  return h('div', { className: 'ds-whale-ui-settings' },
    row(t('settings.enabled'),
      h('input', {
        type: 'checkbox',
        checked: settings.enabled === true,
        onChange: (event) => set({ enabled: event.target.checked }),
      })),
    row(t('settings.intensity'),
      h('select', {
        value: settings.intensity,
        onChange: (event) => set({ intensity: event.target.value }),
      },
        h('option', { value: 'full' }, t('settings.intensity.full')),
        h('option', { value: 'eco' }, t('settings.intensity.eco')))),
    row(t('settings.showElapsed'),
      h('input', {
        type: 'checkbox',
        checked: settings.showElapsed === true,
        onChange: (event) => set({ showElapsed: event.target.checked }),
      })),
    row(t('settings.color'),
      h('div', { className: 'ds-whale-ui-swatches' },
        Object.keys(COLORS).map((name) => h('button', {
          key: name,
          type: 'button',
          className: 'ds-whale-ui-swatch' + (settings.color === name ? ' active' : ''),
          style: { background: COLORS[name] },
          title: name,
          onClick: () => set({ color: name }),
        })))),
    row(t('settings.logo'),
      h('div', { className: 'ds-whale-ui-logo-row' },
        h('span', { className: 'ds-whale-ui-logo-preview' },
          settings.customLogo
            ? h('img', { src: settings.customLogo, alt: '', draggable: false })
            : h('span', { className: 'ds-whale-ui-logo-default' }, t('settings.logo.default'))),
        h('button', {
          type: 'button',
          className: 'ds-whale-ui-logo-btn',
          onClick: () => { if (fileRef.current) fileRef.current.click() },
        }, t('settings.logo.upload')),
        settings.customLogo
          ? h('button', {
              type: 'button',
              className: 'ds-whale-ui-logo-btn',
              onClick: () => { setLogoError(null); set({ customLogo: '' }) },
            }, t('settings.logo.reset'))
          : null,
        h('input', {
          ref: fileRef,
          type: 'file',
          accept: 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml',
          style: { display: 'none' },
          onChange: onLogoPick,
        }))),
    logoError ? h('div', { className: 'ds-whale-ui-logo-error' }, logoError) : null,
  )
}
