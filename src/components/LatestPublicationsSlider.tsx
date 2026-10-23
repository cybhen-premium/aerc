'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

export interface PublicationItem {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  category?: string | null;
  author?: string | null;
  coverImage?: string | null;
  publishedAt: Date | string;
  commentsCount?: number;
}

interface LatestPublicationsSliderProps {
  publications: PublicationItem[];
}

export default function LatestPublicationsSlider({ publications }: LatestPublicationsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartXRef = useRef<number | null>(null);
  const dragCurrentXRef = useRef<number | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const hasMovedRef = useRef<boolean>(false);

  const posts = publications && publications.length > 0 ? publications : [];
  const total = posts.length;

  const goToSlide = useCallback((index: number) => {
    if (total === 0) return;
    const newIdx = (index + total) % total;
    setCurrentIndex(newIdx);
    setDragOffset(0);
  }, [total]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || isDragging || total <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(interval);
  }, [isPaused, isDragging, total, nextSlide]);

  // Touch Swipe Handlers (Mobile & Tablets)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (total <= 1) return;
    setIsPaused(true);
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.touches[0].clientX;
    dragCurrentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || dragStartXRef.current === null) return;
    dragCurrentXRef.current = e.touches[0].clientX;
    const delta = dragCurrentXRef.current - dragStartXRef.current;
    if (Math.abs(delta) > 5) {
      hasMovedRef.current = true;
    }
    // Dampen drag at boundaries if not looping instantly
    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);

    if (dragStartXRef.current !== null && dragCurrentXRef.current !== null) {
      const delta = dragCurrentXRef.current - dragStartXRef.current;
      if (delta < -60) {
        nextSlide();
      } else if (delta > 60) {
        prevSlide();
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }

    dragStartXRef.current = null;
    dragCurrentXRef.current = null;
  };

  // Mouse Drag Handlers (Desktop Swiping)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (total <= 1) return;
    // Only primary left mouse button
    if (e.button !== 0) return;
    setIsPaused(true);
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragCurrentXRef.current = e.clientX;
  };

  // Global mousemove and mouseup listeners when dragging on desktop
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || dragStartXRef.current === null) return;
      dragCurrentXRef.current = e.clientX;
      const delta = dragCurrentXRef.current - dragStartXRef.current;
      if (Math.abs(delta) > 5) {
        hasMovedRef.current = true;
      }
      setDragOffset(delta);
    };

    const handleGlobalMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      setIsPaused(false);

      if (dragStartXRef.current !== null && dragCurrentXRef.current !== null) {
        const delta = dragCurrentXRef.current - dragStartXRef.current;
        if (delta < -60) {
          nextSlide();
        } else if (delta > 60) {
          prevSlide();
        } else {
          setDragOffset(0);
        }
      } else {
        setDragOffset(0);
      }

      dragStartXRef.current = null;
      dragCurrentXRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, nextSlide, prevSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    // If user dragged more than 10px, prevent navigation to allow swiping
    if (hasMovedRef.current) {
      e.preventDefault();
    }
  };

  if (total === 0) return null;

  return (
    <section 
      className="pub-slider-section" 
      id="journal" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      aria-label="Latest Publications Carousel"
    >
      <div className="container">
        {/* HEADER ROW */}
        <div className="pub-slider-header">
          <div className="pub-slider-header-left">
            <span className="badge-pill">
              <i className="fa-regular fa-newspaper"></i> LATEST NEWS
            </span>
            <h2 className="section-title" style={{ textAlign: 'left', marginTop: '10px', marginBottom: 0 }}>
              Latest Publications
            </h2>
          </div>

          <div className="pub-slider-header-right">
            {/* Arrow Controls */}
            <div className="pub-slider-nav-arrows">
              <button
                type="button"
                className="pub-arrow-btn"
                onClick={prevSlide}
                aria-label="Previous Publication"
                title="Previous"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                className="pub-arrow-btn"
                onClick={nextSlide}
                aria-label="Next Publication"
                title="Next"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* View All Button */}
            <Link href="/blog" className="pub-view-all-btn">
              <span>View All News</span>
              <i className="fa-solid fa-angles-right"></i>
            </Link>
          </div>
        </div>

        {/* SWIPING VIEWPORT */}
        <div
          className={`pub-slider-viewport ${isDragging ? 'is-dragging' : ''}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!isDragging) setIsPaused(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {/* SLIDER TRACK */}
          <div
            ref={trackRef}
            className="pub-slider-track"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)',
            }}
          >
            {posts.map((post, idx) => {
              const dateObj = post.publishedAt ? new Date(post.publishedAt) : new Date();
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={post.id || idx} className="pub-slide-item">
                  <div className="pub-featured-card">
                    {/* LEFT: TEXT CONTENT */}
                    <div className="pub-card-content">
                      {/* Category Tag */}
                      <div className="pub-tag-wrap">
                        <span className="pub-category-tag">
                          {post.category || 'Environment'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="pub-card-title">
                        <Link 
                          href={`/blog/${post.slug}`}
                          onClick={handleLinkClick}
                        >
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="pub-card-excerpt">
                        {post.excerpt}
                      </p>

                      {/* Metadata */}
                      <div className="pub-card-meta">
                        <span className="pub-meta-author">
                          By <strong>{post.author || 'Desmond Foe'}</strong>
                        </span>
                        <span className="pub-meta-divider">·</span>
                        <span className="pub-meta-comments">
                          {post.commentsCount ?? 0} Comment{(post.commentsCount ?? 0) === 1 ? '' : 's'}
                        </span>
                        <span className="pub-meta-divider">·</span>
                        <span className="pub-meta-date">
                          <i className="fa-regular fa-calendar-days"></i> {formattedDate}
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="pub-card-cta-row">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          className="pub-read-more-link"
                          onClick={handleLinkClick}
                        >
                          <span>Read Full Article</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </div>

                      {/* PAGINATION DOTS (BOTTOM LEFT AS IN SCREENSHOT) */}
                      <div className="pub-dots-container">
                        <div className="pub-dots-list">
                          {posts.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              onClick={() => goToSlide(dotIdx)}
                              className={`pub-dot ${dotIdx === currentIndex ? 'active' : ''}`}
                              aria-label={`Go to publication ${dotIdx + 1}`}
                            />
                          ))}
                        </div>
                        <span className="pub-slide-indicator">
                          {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT: FEATURED IMAGE */}
                    <div className="pub-card-visual">
                      <Link 
                        href={`/blog/${post.slug}`} 
                        className="pub-image-link" 
                        tabIndex={-1}
                        onClick={handleLinkClick}
                      >
                        <img
                          src={post.coverImage || '/images/hero-bg.jpg'}
                          alt={post.title}
                          className="pub-card-image"
                          draggable={false}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
