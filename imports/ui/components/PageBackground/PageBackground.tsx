import { type ImgHTMLAttributes, type ReactNode, useEffect } from 'react';
import { preloadImage } from '../../utils/preloadImage';
import './PageBackground.css';

interface PageBackgroundProps {
  src: string;
  className?: string;
  position?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'eager' | 'lazy';
  /** Placeholder tone shown behind the image so there's no white flash while it paints. */
  placeholderColor?: string;
  children: ReactNode;
}

export function PageBackground({
  src,
  className,
  position = 'center',
  fetchPriority = 'auto',
  loading = 'eager',
  placeholderColor,
  children,
}: PageBackgroundProps) {
  useEffect(() => {
    if (loading === 'eager') preloadImage(src);
  }, [src, loading]);

  return (
    <section
      className={className ? `page-background ${className}` : 'page-background'}
      style={placeholderColor ? { backgroundColor: placeholderColor } : undefined}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="page-background__image"
        style={{ objectPosition: position, backgroundColor: placeholderColor }}
        // Eager heroes decode synchronously so a cached image paints in the same
        // frame it mounts (no flash on client-side navigation); lazy images stay async.
        decoding={loading === 'eager' ? 'sync' : 'async'}
        loading={loading}
        {...({ fetchpriority: fetchPriority } as ImgHTMLAttributes<HTMLImageElement>)}
      />
      {children}
    </section>
  );
}
