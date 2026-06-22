const preloaded = new Set<string>();

/**
 * Warm the browser HTTP cache for an image URL (safe to call repeatedly).
 *
 * Uses an in-memory `Image()` request rather than a `<link rel="preload">` tag:
 * the fetch is cached by the browser and reused when the real <img> renders,
 * without risking "preloaded but not used" console warnings.
 */
export function preloadImage(src: string): void {
  if (!src || preloaded.has(src)) return;
  preloaded.add(src);

  const img = new Image();
  img.decoding = 'async';
  img.src = src;
}

export function preloadImages(sources: readonly string[]): void {
  sources.forEach(preloadImage);
}
