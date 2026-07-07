import type { CSSProperties } from 'react';

const DEFAULT_PLACEHOLDER = '#20242b';

/** Inline background styles for full-bleed section images (avoids <img> decode flash). */
export function sectionBackgroundStyle(
  src: string,
  position = 'center',
  placeholderColor = DEFAULT_PLACEHOLDER
): CSSProperties {
  return {
    backgroundColor: placeholderColor,
    backgroundImage: `url(${src})`,
    backgroundSize: 'cover',
    backgroundPosition: position,
    backgroundRepeat: 'no-repeat',
  };
}
