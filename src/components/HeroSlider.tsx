'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

const heroSlides = [
  {
    tag: 'AERC GHANA',
    titlePrefix: 'Building Resilience Through ',
    highlight: 'Just Energy Transition',
    description: 'Advancing a just, inclusive energy transition across rural Ghana—championing community ownership, decentralized solar mini-grids, and clean renewable power.',
    bg: '/images/slider-1.jpg',
  },
  {
    tag: 'AERC GHANA',
    titlePrefix: 'Empowering Frontline ',
    highlight: 'Rural Voices for Climate Justice',
    description: 'Ensuring grassroots realities, women smallholder farmers, and youth climate champions directly lead national policy and international climate conventions.',
    bg: '/images/slider-2.jpg',
  },
  {
    tag: 'AERC GHANA',
    titlePrefix: 'Communities Leading a ',
    highlight: 'Low-Carbon Future',
    description: 'Fostering ecological sovereignty, biodiversity conservation, nature-based adaptation, and youth-driven sustainability across Ghana.',
    bg: '/images/slider-3.jpg',
  },
];

function MetricCounter({ target, suffix = '+' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1800;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [target]);

  return (
    <span className="metric-num">
      {val}<span>{suffix}</span>
    </span>
  );
}

interface HeroSliderProps {
  customSlide?: {
    tag?: string;
    titlePrefix?: string;
    highlight?: string;
    description?: string;
    bg?: string;
    ctaPrimaryText?: string;
    ctaPrimaryLink?: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
}

export default function HeroSlider({ customSlide, metrics }: HeroSliderProps = {}) {
  const activeSlides = useMemo(() => {
    if (!customSlide) return heroSlides;
    return [
      {
        tag: customSlide.tag || heroSlides[0].tag,
        titlePrefix: customSlide.titlePrefix || heroSlides[0].titlePrefix,
        highlight: customSlide.highlight || heroSlides[0].highlight,
        description: customSlide.description || heroSlides[0].description,
        bg: customSlide.bg || heroSlides[0].bg,
      },
      ...heroSlides.slice(1),
    ];
  }, [customSlide]);
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = activeSlides[current] || activeSlides[0];

  return (
    <section className="hero-stage" id="home">
      {/* Background slide with smooth crossfade and subtle zoom */}
      {activeSlides.map((s, idx) => (
        <div
          key={idx}
          className={`hero-bg-backdrop ${idx === current ? 'hero-bg-active' : ''}`}
          style={{
            backgroundImage: `url(${s.bg})`,
            opacity: idx === current ? 1 : 0,
            zIndex: idx === current ? 1 : 0,
          }}
        />
      ))}

      <div className="hero-gradient-overlay" />

      {/* Floating Ambient Glow Orbs */}
      <div className="hero-glow-orb hero-glow-1" />
      <div className="hero-glow-orb hero-glow-2" />

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <div className="hero-inner">
          <div key={current} className="hero-content-animated">
            <div className="badge-pill dark hero-badge-anim">
              <i className="fa-solid fa-leaf"></i>
              <span>{slide.tag}</span>
            </div>

            <h1 className="hero-headline">
              {slide.titlePrefix}
              <span className="hero-highlight-glow">{slide.highlight}</span>
            </h1>

            <p className="hero-lead">
              {slide.description}
            </p>
          </div>

          <div className="hero-actions">
            <Link
              href={customSlide?.ctaPrimaryLink || '/projects'}
              className="btn-primary hero-btn-main"
            >
              <span>{customSlide?.ctaPrimaryText || 'Explore Initiatives'}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
            <Link
              href={customSlide?.ctaSecondaryLink || '/about'}
              className="btn-ghost-white"
            >
              <span>{customSlide?.ctaSecondaryText || 'About Our Mission'}</span>
              <i className="fa-solid fa-angles-right"></i>
            </Link>
          </div>

          {/* Impact Metrics Bento Bar with live count-up animation */}
          <div className="hero-metrics-bar">
            {metrics && metrics.length > 0 ? (
              metrics.slice(0, 4).map((m, idx) => {
                const numVal = parseInt(m.value.replace(/[^0-9]/g, ''), 10) || 10;
                const suffix = m.value.replace(/[0-9]/g, '') || '+';
                return (
                  <div key={idx} className="metric-stat-item">
                    <MetricCounter target={numVal} suffix={suffix} />
                    <span className="metric-lbl">{m.label}</span>
                  </div>
                );
              })
            ) : (
              <>
                <div className="metric-stat-item">
                  <MetricCounter target={10} suffix="+" />
                  <span className="metric-lbl">Years Grassroots Impact</span>
                </div>
                <div className="metric-stat-item">
                  <MetricCounter target={150} suffix="+" />
                  <span className="metric-lbl">Women Farmers Supported</span>
                </div>
                <div className="metric-stat-item">
                  <MetricCounter target={12} suffix="+" />
                  <span className="metric-lbl">Schools in Green Network</span>
                </div>
                <div className="metric-stat-item">
                  <MetricCounter target={7} suffix="+" />
                  <span className="metric-lbl">Frontline Campaigns</span>
                </div>
              </>
            )}
          </div>

          {/* Slide Indicator Dots */}
          <div className="hero-dots-indicator">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                className={`hero-dot-btn ${idx === current ? 'active' : ''}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
