import { type ReactNode, useEffect } from 'react';
import { preloadImage } from '../../utils/preloadImage';
import './PageBackground.css';

interface PageBackgroundProps {
  src: string;
  className?: string;
  position?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'eager' | 'lazy';
  /** Placeholder tone shown behind the image so there's no flash while it paints. */
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
    if (loading !== 'eager') return;
    preloadImage(src);

    if (fetchPriority === 'high') {
      const existing = document.querySelector(`link[data-preload-hero="${src}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.setAttribute('data-preload-hero', src);
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
      }
    }
  }, [src, loading, fetchPriority]);

  const placeholder = placeholderColor ?? '#20242b';

  return (
    <section
      className={className ? `page-background ${className}` : 'page-background'}
      style={{
        backgroundColor: placeholder,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: position,
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </section>
  );
}
