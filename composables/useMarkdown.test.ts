import { describe, it, expect } from 'vitest'
import { useMarkdown } from './useMarkdown'

// pages/chat/index.vue renders AI assistant output with v-html, which bypasses
// Vue's escaping entirely. The only thing making that safe is how markdown-it
// is configured in useMarkdown.ts (html:false, plus markdown-it's default link
// validator). These tests exist so that configuration cannot be loosened
// without a test going red — a code reviewer looking at the v-html line alone
// cannot see what protects it.

const { render } = useMarkdown()

describe('useMarkdown — raw HTML', () => {
  it('escapes a script tag instead of emitting it', () => {
    const out = render('<script>alert(1)</script>')
    expect(out).not.toContain('<script>')
    expect(out).toContain('&lt;script&gt;')
  })

  it('escapes inline event handlers', () => {
    const out = render('<img src=x onerror=alert(1)>')
    expect(out).not.toContain('<img')
    expect(out).toContain('&lt;img')
  })

  it('escapes an iframe', () => {
    const out = render('<iframe src="https://evil.example"></iframe>')
    expect(out).not.toContain('<iframe')
  })

  it('escapes raw HTML even when nested inside markdown', () => {
    const out = render('- item\n- <script>alert(1)</script>')
    expect(out).not.toContain('<script>')
  })
})

describe('useMarkdown — links', () => {
  it('does not emit a javascript: href from markdown link syntax', () => {
    const out = render('[click](javascript:alert(1))')
    expect(out).not.toContain('href="javascript:')
  })

  it('does not emit a vbscript: href', () => {
    const out = render('[click](vbscript:msgbox(1))')
    expect(out).not.toContain('href="vbscript:')
  })

  it('keeps ordinary https links and marks them noopener', () => {
    const out = render('[site](https://example.com)')
    expect(out).toContain('href="https://example.com"')
    expect(out).toContain('rel="noopener noreferrer"')
    expect(out).toContain('target="_blank"')
  })

  it('autolinks bare URLs with the same rel/target treatment', () => {
    const out = render('visit https://example.com today')
    expect(out).toContain('rel="noopener noreferrer"')
    expect(out).toContain('target="_blank"')
  })
})

describe('useMarkdown — ordinary rendering', () => {
  it('renders emphasis and headings', () => {
    expect(render('**bold**')).toContain('<strong>bold</strong>')
    expect(render('# Title')).toContain('<h1>')
  })

  it('renders fenced code with the content escaped', () => {
    const out = render('```\n<script>alert(1)</script>\n```')
    expect(out).toContain('<code>')
    expect(out).not.toContain('<script>')
  })

  it('handles empty and nullish input', () => {
    expect(render('')).toBe('')
    // @ts-expect-error exercising the null guard in useMarkdown
    expect(render(null)).toBe('')
  })
})
