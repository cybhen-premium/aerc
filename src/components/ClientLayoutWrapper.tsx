'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import Navigation from './Navigation';
import OffcanvasSidebar from './OffcanvasSidebar';
import Footer from './Footer';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Select elements that will participate in reveal animations
    const targets = document.querySelectorAll<HTMLElement>(
      '.reveal-header, .reveal-from-left, .reveal-from-right, .reveal-zoom, .project-modern-card, .team-card, .live-team-card, .event-card-item, .objective-item, .modern-pillar-card, .pub-featured-card, .metric-stat-item, .reveal-on-scroll'
    );

    // IntersectionObserver configured with negative bottom margin so animations trigger VISIBLY on-screen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    targets.forEach((target) => {
      if (
        !target.classList.contains('reveal-item') &&
        !target.classList.contains('reveal-header') &&
        !target.classList.contains('reveal-from-left') &&
        !target.classList.contains('reveal-from-right') &&
        !target.classList.contains('reveal-zoom')
      ) {
        target.classList.add('reveal-item');
      }

      const rect = target.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0) {
        // Trigger with slight delay so the browser paints the initial state and plays the entrance animation
        setTimeout(() => {
          target.classList.add('is-visible');
        }, 120);
      } else {
        observer.observe(target);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <OffcanvasSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar />
      <Navigation onOpenSidebar={() => setSidebarOpen(true)} />
      <main>{children}</main>
      <Footer />

      {/* Modern Floating Back to Top Button */}
      <button
        type="button"
        className={`floating-back-to-top ${showBackToTop ? 'is-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top of page"
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </>
  );
}
