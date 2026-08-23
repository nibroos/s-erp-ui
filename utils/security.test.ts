import { describe, it, expect } from 'vitest'
import { isSafeHttpUrl, safeHref } from './security'

describe('isSafeHttpUrl', () => {
  it('accepts absolute http and https URLs', () => {
    expect(isSafeHttpUrl('http://example.com')).toBe(true)
    expect(isSafeHttpUrl('https://example.com/a/b?c=1#d')).toBe(true)
    expect(isSafeHttpUrl('https://sub.example.co.id:8443/path')).toBe(true)
  })

  it('accepts mailto', () => {
    expect(isSafeHttpUrl('mailto:someone@example.com')).toBe(true)
  })

  it('rejects javascript: in every casing', () => {
    expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isSafeHttpUrl('JavaScript:alert(1)')).toBe(false)
    expect(isSafeHttpUrl('JAVASCRIPT:alert(1)')).toBe(false)
  })

  it('rejects javascript: hidden behind leading whitespace or control chars', () => {
    // Browsers strip these before resolving the URL, so each of these would
    // execute if the value reached an href unchecked.
    expect(isSafeHttpUrl('  javascript:alert(1)')).toBe(false)
    expect(isSafeHttpUrl('\tjavascript:alert(1)')).toBe(false)
    expect(isSafeHttpUrl('\njavascript:alert(1)')).toBe(false)
    expect(isSafeHttpUrl('java\tscript:alert(1)')).toBe(false)
    expect(isSafeHttpUrl('java\nscript:alert(1)')).toBe(false)
    expect(isSafeHttpUrl('\u0000javascript:alert(1)')).toBe(false)
  })

  it('rejects other executable or exfiltrating schemes', () => {
    expect(isSafeHttpUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    expect(isSafeHttpUrl('vbscript:msgbox(1)')).toBe(false)
    expect(isSafeHttpUrl('file:///etc/passwd')).toBe(false)
    expect(isSafeHttpUrl('blob:https://example.com/uuid')).toBe(false)
  })

  it('rejects relative and scheme-relative values', () => {
    expect(isSafeHttpUrl('/dashboard')).toBe(false)
    expect(isSafeHttpUrl('example.com')).toBe(false)
    // Protocol-relative: inherits the page scheme, and URL() cannot parse it
    // without a base, so it is rejected rather than silently trusted.
    expect(isSafeHttpUrl('//evil.example.com')).toBe(false)
  })

  it('rejects empty, whitespace-only and non-string input', () => {
    expect(isSafeHttpUrl('')).toBe(false)
    expect(isSafeHttpUrl('   ')).toBe(false)
    expect(isSafeHttpUrl(null)).toBe(false)
    expect(isSafeHttpUrl(undefined)).toBe(false)
    expect(isSafeHttpUrl(42)).toBe(false)
    expect(isSafeHttpUrl({ toString: () => 'https://example.com' })).toBe(false)
  })
})

describe('safeHref', () => {
  it('returns the trimmed URL when safe', () => {
    expect(safeHref('https://example.com')).toBe('https://example.com')
    expect(safeHref('  https://example.com  ')).toBe('https://example.com')
  })

  it('returns null when unsafe, so callers can drop the anchor entirely', () => {
    expect(safeHref('javascript:alert(1)')).toBeNull()
    expect(safeHref('data:text/html,x')).toBeNull()
    expect(safeHref('')).toBeNull()
    expect(safeHref(null)).toBeNull()
  })
})
