import { Marked, Tokens } from 'marked'

// Render isi artikel (markdown) jadi HTML untuk /news dan preview newsroom.
// HTML mentah di markdown di-escape dan href/src cuma boleh http(s), path relatif, mailto, atau anchor
// — admin artikel tidak boleh bisa menyisipkan script ke halaman publik.

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const SAFE_URL = /^(https?:\/\/|\/(?!\/)|#|mailto:)/i
const safeUrl = (url: string) => (SAFE_URL.test(url.trim()) ? url.trim() : '#')

const marked = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    html({ text }: Tokens.HTML | Tokens.Tag) {
      return escapeHtml(text)
    },
    link({ href, title, tokens }: Tokens.Link) {
      const url = safeUrl(href)
      const external = /^https?:\/\//i.test(url)
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
      const rel = external ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeHtml(url)}"${titleAttr}${rel}>${this.parser.parseInline(tokens)}</a>`
    },
    image({ href, title, text }: Tokens.Image) {
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : ''
      return `<img src="${escapeHtml(safeUrl(href))}" alt="${escapeHtml(text)}"${titleAttr} loading="lazy" />`
    },
  },
})

// Konten lama dari toolbar newsroom bisa berisi "**teks\n**" (enter ikut terbungkus) yang tidak dikenali
// markdown — pindahkan penanda penutup ke sebelum enter.
const tidyEmphasis = (md: string) =>
  md.replace(/(\*\*|_)([^\s*_](?:[^*\n]*?[^\s*])?)([ \t]*\n[ \t]*)\1(?=\s|$)/g, '$1$2$1$3')

export const renderMarkdown = (md: string) =>
  marked.parse(tidyEmphasis(md ?? ''), { async: false }) as string

// Teks polos dari markdown — fallback meta description kalau ringkasan kosong
export const markdownToPlain = (md: string, max = 160) => {
  const plain = (md ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > max ? `${plain.slice(0, max - 1).trimEnd()}…` : plain
}
