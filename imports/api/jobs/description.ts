import sanitizeHtml from 'sanitize-html';

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h2', 'h3', 'a', 'div'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    b: 'strong',
    i: 'em',
    a: (_tagName, attribs) => ({
      tagName: 'a',
      attribs: {
        href: attribs.href,
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    }),
  },
};

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

  return sanitizeHtml(trimmed, SANITIZE_OPTIONS).trim();
}
