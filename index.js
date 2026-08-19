/**
 * ds-whale-ui — host half.
 * Registers the durable settings namespace when a settings provider exists;
 * the browser half renders the whale dock row above the composer (replacing
 * the built-in "Deep diving..." status line). The Loader mounts this row so
 * the client-module scanner can serve `./client`.
 *
 * The settings imports are lazy and guarded: with `link:` installs pnpm does
 * not hoist this package's dependencies, and a failed namespace registration
 * must degrade to local-only preferences instead of failing the row.
 */
export const name = 'ds-whale-ui'

/** Settings namespace owned by this plugin (mirrored by the browser half). */
export const WHALE_SETTINGS_NAMESPACE = 'ds-whale-ui'

/** Durable section schema (built lazily next to the guarded import). */
function buildSchema(z) {
  return z.object({
    enabled: z.boolean().default(true),
    intensity: z.union(['full', 'eco']).default('full'),
    showElapsed: z.boolean().default(true),
    color: z.union(['blue', 'pink', 'orange']).default('blue'),
    // Custom whale image as a data URL (uploaded in the settings panel,
    // downscaled client-side before persisting). Empty = brand logo.
    customLogo: z.string().default(''),
  })
}

export function apply(ctx) {
  ctx.inject(['settings'], (settingsCtx) => {
    void (async () => {
      try {
        const [{ settingsNamespace }, z] = await Promise.all([
          import('@deepseek-ai/dsh-settings'),
          import('@deepseek-ai/schemastery'),
        ])
        settingsCtx.settings.register(settingsNamespace(WHALE_SETTINGS_NAMESPACE), buildSchema(z.default))
      } catch (error) {
        // Settings persistence is optional: the whale overlay still works with
        // local defaults when the namespace cannot be registered.
        console.warn('[ds-whale-ui] settings namespace registration skipped:', error && error.message)
      }
    })()
  })
}
