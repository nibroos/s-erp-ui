// Display formatting for the app version shown on the login page.
//
// The version itself comes from package.json, read in nuxt.config.ts and
// exposed as runtimeConfig.public.APP_VERSION. With ssr:false that value is
// baked into the bundle at BUILD time, which is what makes it useful: it
// identifies the deployed artifact, not the machine serving it.

/**
 * Render a version for display: `1.2.0` -> `v1.2.0`.
 *
 * Returns an empty string when there is no usable version, so a caller can
 * `v-if` the label away rather than showing a stray "v" or "vundefined" —
 * which is exactly what a login page must not do if the build metadata is
 * missing.
 */
export function formatVersion(version: unknown, build?: unknown): string {
  if (typeof version !== 'string') return ''

  const v = version.trim()
  if (!v) return ''

  // Tolerate a version that already carries its own prefix, so a future
  // `APP_VERSION=v2.0.0` does not render as "vv2.0.0".
  const label = /^v/i.test(v) ? `v${v.slice(1)}` : `v${v}`

  const b = typeof build === 'string' ? build.trim() : ''
  return b ? `${label} · build ${b}` : label
}
