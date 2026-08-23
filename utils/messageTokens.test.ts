import { describe, it, expect } from 'vitest'
import { tokenizeMessage } from './messageTokens'

const mentions = [
  { user_id: 7, name: 'Budi Santoso' },
  { user_id: 9, name: 'Ayu' }
]

describe('tokenizeMessage', () => {
  it('returns a single text token for plain content', () => {
    expect(tokenizeMessage('hello there')).toEqual([
      { kind: 'text', text: 'hello there' }
    ])
  })

  it('handles empty and nullish content without throwing', () => {
    expect(tokenizeMessage('')).toEqual([{ kind: 'text', text: '' }])
    expect(tokenizeMessage(null)).toEqual([{ kind: 'text', text: '' }])
    expect(tokenizeMessage(undefined)).toEqual([{ kind: 'text', text: '' }])
  })

  it('splits a URL out of surrounding text', () => {
    expect(tokenizeMessage('see https://example.com now')).toEqual([
      { kind: 'text', text: 'see ' },
      { kind: 'url', text: 'https://example.com', href: 'https://example.com' },
      { kind: 'text', text: ' now' }
    ])
  })

  it('emits every URL in a message, not just the first', () => {
    const tokens = tokenizeMessage('a https://one.example b https://two.example')
    const urls = tokens.filter((t) => t.kind === 'url')
    expect(urls).toHaveLength(2)
  })

  it('does not leak regex lastIndex between calls', () => {
    // TOKEN_RE is a global regex; a shared lastIndex would make the second call
    // start mid-string and miss the link.
    const first = tokenizeMessage('go https://example.com')
    const second = tokenizeMessage('go https://example.com')
    expect(second).toEqual(first)
    expect(second.some((t) => t.kind === 'url')).toBe(true)
  })

  it('never emits a url token for a dangerous scheme', () => {
    // The tokenizer only matches http(s), so these stay plain text and can
    // never reach an href binding.
    for (const bad of [
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)'
    ]) {
      const tokens = tokenizeMessage(`click ${bad} please`)
      expect(tokens.every((t) => t.kind !== 'url')).toBe(true)
    }
  })

  it('every url token carries an href safe to bind', () => {
    const tokens = tokenizeMessage('https://example.com/x?y=1')
    for (const t of tokens) {
      if (t.kind === 'url') {
        expect(t.href).toMatch(/^https?:\/\//)
      }
    }
  })

  it('resolves a mention by first name to its user id', () => {
    const tokens = tokenizeMessage('hi @Budi', mentions)
    expect(tokens).toContainEqual({ kind: 'mention', text: '@Budi', userId: 7 })
  })

  it('resolves a mention case-insensitively', () => {
    const tokens = tokenizeMessage('hi @ayu', mentions)
    expect(tokens).toContainEqual({ kind: 'mention', text: '@ayu', userId: 9 })
  })

  it('emits an unresolved mention with no user id rather than dropping it', () => {
    const tokens = tokenizeMessage('hi @nobody', mentions)
    expect(tokens).toContainEqual({
      kind: 'mention',
      text: '@nobody',
      userId: undefined
    })
  })

  it('handles a mention with no mention list', () => {
    const tokens = tokenizeMessage('hi @someone')
    expect(tokens.some((t) => t.kind === 'mention')).toBe(true)
  })

  it('handles mixed URLs and mentions in order', () => {
    const tokens = tokenizeMessage('@Ayu see https://example.com ok', mentions)
    expect(tokens.map((t) => t.kind)).toEqual(['mention', 'text', 'url', 'text'])
  })
})
