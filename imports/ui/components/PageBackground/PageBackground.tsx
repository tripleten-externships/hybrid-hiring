import { type ImgHTMLAttributes, type ReactNode, useEffect } from 'react';
import { preloadImage } from '../../utils/preloadImage';
import './PageBackground.css';

interface PageBackgroundProps {
  src: string;
  className?: string;
  position?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  loading?: 'eager' | 'lazy';
  children: ReactNode;
}

export function PageBackground({
  src,
  className,
  position = 'center',
  fetchPriority = 'auto',
  loading = 'eager',
  children,
}: PageBackgroundProps) {
  useEffect(() => {
    if (loading === 'eager') preloadImage(src);
  }, [src, loading]);

  return (
    <section className={className ? `page-background ${className}` : 'page-background'}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="page-background__image"
        style={{ objectPosition: position }}
        decoding="async"
        loading={loading}
        {...({ fetchpriority: fetchPriority } as ImgHTMLAttributes<HTMLImageElement>)}
      />
      {children}
    </section>
  );
}
