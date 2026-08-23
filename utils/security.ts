// URL safety helpers for anything that reaches an `href`.
//
// Why this exists as its own module: the chat message tokenizer used to be the
// only thing standing between user-typed text and an `<a :href>` binding, and
// it guarded by matching `https?://` in a regex several hundred lines away from
// the template that trusted it. That worked, but nothing tested it and nothing
// marked it as load-bearing. A named, tested function is harder to quietly
// break — and Vue does NOT sanitise `:href`, so a `javascript:` value in that
// binding executes on click.

/** Schemes considered safe to place in an href for user-supplied content. */
const SAFE_SCHEMES = ['http:', 'https:', 'mailto:']

// Space and every C0/C7 control character. Browsers strip these when resolving
// a URL, so `java\tscript:alert(1)` and ` javascript:alert(1)` are live vectors
// that a naive startsWith() or a trim() alone would miss.
const STRIPPED = /[\u0000-\u0020\u007F]/g

/**
 * True when `raw` parses as an absolute URL carrying a safe scheme.
 *
 * Deliberately strict: only absolute URLs pass. A relative path cannot carry a
 * scheme and so cannot be dangerous, but user-typed message text is not meant
 * to become a same-origin link either, so it is not accepted here.
 */
export function isSafeHttpUrl(raw: unknown): boolean {
  if (typeof raw !== 'string') return false

  const cleaned = raw.replace(STRIPPED, '')
  if (!cleaned) return false

  let parsed: URL
  try {
    parsed = new URL(cleaned)
  } catch {
    return false // relative, malformed, or not parseable at all
  }

  // `protocol` includes the trailing colon and is lowercased by the URL parser,
  // so `JavaScript:` and `javascript:` both arrive here as `javascript:`.
  return SAFE_SCHEMES.includes(parsed.protocol)
}

/**
 * The value to bind to an href: `raw` when safe, otherwise null.
 *
 * Returns null rather than '#' so callers can `v-if` the anchor away entirely
 * instead of rendering a dead link that still looks clickable.
 */
export function safeHref(raw: unknown): string | null {
  return isSafeHttpUrl(raw) ? (raw as string).trim() : null
}
