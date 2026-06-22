import { type ReactNode, useEffect } from 'react';
import { preloadImage } from '../../utils/preloadImage';
import './PageBackground.css';

interface PageBackgroundProps {
  src: string;
  className?: string;
  position?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  children: ReactNode;
}

export function PageBackground({
  src,
  className,
  position = 'center',
  fetchPriority = 'auto',
  children,
}: PageBackgroundProps) {
  useEffect(() => {
    preloadImage(src);
  }, [src]);

  return (
    <section className={className ? `page-background ${className}` : 'page-background'}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="page-background__image"
        style={{ objectPosition: position }}
        fetchPriority={fetchPriority}
        decoding="async"
      />
      {children}
    </section>
  );
}
