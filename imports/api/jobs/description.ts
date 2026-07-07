const ALLOWED_TAG_RE = /^(p|br|strong|b|em|i|u|ul|ol|li|h2|h3|a|div)$/i;

const INLINE_STYLE_NORMALIZERS: Array<{ pattern: RegExp; tag: string }> = [
  {
    pattern:
      /<span\b[^>]*\bstyle\s*=\s*["'][^"']*font-weight\s*:\s*(?:bold|700|bolder)\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi,
    tag: 'strong',
  },
  {
    pattern:
      /<span\b[^>]*\bstyle\s*=\s*["'][^"']*font-style\s*:\s*italic\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi,
    tag: 'em',
  },
  {
    pattern:
      /<span\b[^>]*\bstyle\s*=\s*["'][^"']*(?:text-decoration(?:-line)?\s*:\s*underline|text-decoration\s*:\s*[^;"']*underline)[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi,
    tag: 'u',
  },
];

/** Convert browser inline-style spans to semantic tags before sanitization. */
function normalizeInlineFormatting(html: string): string {
  let result = html;

  for (let pass = 0; pass < 8; pass += 1) {
    let changed = false;
    for (const { pattern, tag } of INLINE_STYLE_NORMALIZERS) {
      const next = result.replace(pattern, `<${tag}>$1</${tag}>`);
      if (next !== result) {
        changed = true;
        result = next;
      }
    }
    if (!changed) break;
  }

  return result;
}

/** True when the string contains HTML markup (vs legacy plain text). */
export function isHtmlDescription(value: string): boolean {
  return /<[a-z][^>]*>/i.test(value);
}

/** Strip tags to test whether a description has visible content. */
export function getDescriptionText(value: string): string {
  if (!value) return '';
  if (!isHtmlDescription(value)) return value.trim();
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .trim();
}

/**
 * Sanitize admin-authored job descriptions. Plain-text entries are stored as-is
 * for backward compatibility with existing listings.
 */
export function sanitizeJobDescription(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  if (!isHtmlDescription(trimmed)) {
    return trimmed;
  }

  let html = trimmed
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/javascript:/gi, '');

  html = normalizeInlineFormatting(html);

  html = html.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  html = html.replace(/\s+style\s*=\s*("[^"]*"|'[^']*')/gi, '');

  html = html.replace(/<a\b([^>]*)>/gi, (_match, attrs: string) => {
    const hrefMatch = attrs.match(/href\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = (hrefMatch?.[2] || hrefMatch?.[3] || hrefMatch?.[4] || '').trim();
    if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) {
      return '<a>';
    }
    const safeHref = href.replace(/"/g, '&quot;');
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">`;
  });

  html = html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag) => {
    const nameMatch = tag.match(/^<\/?([a-z][a-z0-9]*)/i);
    const tagName = nameMatch?.[1] ?? '';
    if (!ALLOWED_TAG_RE.test(tagName)) return '';
    if (tagName.toLowerCase() === 'a' && tag.startsWith('<a')) {
      return tag
        .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .replace(/\s+style\s*=\s*("[^"]*"|'[^']*')/gi, '');
    }
    return tag.replace(/\s+[a-z-]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  });

  return html.trim();
}
