const preloaded = new Set<string>();

/** Warm the browser cache for an image URL (safe to call repeatedly). */
export function preloadImage(src: string): void {
  if (!src || preloaded.has(src)) return;
  preloaded.add(src);

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);

  const img = new Image();
  img.src = src;
}

export function preloadImages(sources: readonly string[]): void {
  sources.forEach(preloadImage);
}
