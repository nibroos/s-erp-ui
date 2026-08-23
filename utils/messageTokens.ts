// Chat message tokenizer: splits raw message text into plain text, links and
// @mentions so the template can render each kind differently.
//
// Extracted from pages/chat/index.vue. It lived inline there, which meant the
// one piece of logic deciding what ends up in an `<a :href>` was untestable and
// sat ~500 lines from the template that trusted it.

import { safeHref } from '~/utils/security'

export interface MentionRef {
  user_id: number
  name: string
}

export type MessageToken =
  | { kind: 'text'; text: string }
  | { kind: 'url'; text: string; href: string }
  | { kind: 'mention'; text: string; userId?: number }

/**
 * Matches a bare http(s) URL, or an @mention starting with a letter.
 * `u` flag so \p{L} covers non-ASCII names.
 */
const TOKEN_RE = /(https?:\/\/[^\s]+)|(@[\p{L}][\p{L}\d._-]*)/gu

/** Resolve an @mention against the message's mention list. */
function findMention(mentions: MentionRef[], query: string): MentionRef | undefined {
  const q = query.toLowerCase()
  return mentions.find(
    (x) =>
      x.name.toLowerCase().startsWith(q) ||
      x.name.split(/\s+/)[0].toLowerCase() === q
  )
}

/**
 * Tokenize `content`, resolving @mentions against `mentions`.
 *
 * A candidate URL is emitted as a `url` token only when safeHref accepts it.
 * Anything it rejects stays plain text, so it renders as inert characters
 * rather than a clickable link. The regex already limits matches to http(s),
 * but the check is repeated here on purpose: this function's contract is that a
 * `url` token's href is safe to bind, and that must not depend on a reader
 * noticing the scheme restriction in the pattern above.
 */
export function tokenizeMessage(
  content: string | null | undefined,
  mentions: MentionRef[] = []
): MessageToken[] {
  const src = content || ''
  const tokens: MessageToken[] = []
  let last = 0
  let m: RegExpExecArray | null

  // Fresh regex per call: TOKEN_RE is global, and a shared lastIndex would make
  // consecutive calls skip matches.
  const re = new RegExp(TOKEN_RE.source, TOKEN_RE.flags)

  while ((m = re.exec(src)) !== null) {
    if (m.index > last) {
      tokens.push({ kind: 'text', text: src.slice(last, m.index) })
    }

    if (m[1]) {
      const href = safeHref(m[1])
      tokens.push(
        href
          ? { kind: 'url', text: m[1], href }
          : { kind: 'text', text: m[1] }
      )
    } else {
      const hit = findMention(mentions, m[2].slice(1))
      tokens.push({ kind: 'mention', text: m[2], userId: hit?.user_id })
    }

    last = m.index + m[0].length
  }

  if (last < src.length) {
    tokens.push({ kind: 'text', text: src.slice(last) })
  }

  return tokens.length ? tokens : [{ kind: 'text', text: src }]
}
