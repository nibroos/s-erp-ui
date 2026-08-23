// Markdown renderer for AI assistant messages.
// html:false escapes any raw HTML in the source, so AI output cannot inject
// markup — only markdown-it's own safe output is produced. markdown-it also
// validates link protocols (blocks javascript:/vbscript:) by default.
// @ts-ignore - markdown-it ships without bundled TS types in this project
import MarkdownIt from 'markdown-it'

let md: any = null

const get = () => {
  if (!md) {
    md = new MarkdownIt({
      html: false,
      linkify: true,
      breaks: true,
      typographer: true
    })
    // Open links in a new tab.
    const defaultRender =
      md.renderer.rules.link_open ||
      ((tokens: any, idx: any, options: any, _env: any, self: any) =>
        self.renderToken(tokens, idx, options))
    md.renderer.rules.link_open = (
      tokens: any,
      idx: any,
      options: any,
      env: any,
      self: any
    ) => {
      tokens[idx].attrSet('target', '_blank')
      tokens[idx].attrSet('rel', 'noopener noreferrer')
      return defaultRender(tokens, idx, options, env, self)
    }
  }
  return md
}

export const useMarkdown = () => ({
  render: (src: string): string => get().render(src || '')
})
