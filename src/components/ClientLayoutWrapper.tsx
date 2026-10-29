'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import Navigation from './Navigation';
import OffcanvasSidebar from './OffcanvasSidebar';
import Footer from './Footer';
import type { SiteSettings } from '@/db/schema';

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  siteSettings?: SiteSettings;
}

export default function ClientLayoutWrapper({
  children,
  siteSettings,
}: ClientLayoutWrapperProps) {
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

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  // Maintenance Mode Guard for public visitors
  if (siteSettings?.maintenanceMode && !pathname?.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-950">
          <i className="fa-solid fa-leaf text-3xl"></i>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
          Under Scheduled Maintenance
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">
          {siteSettings.organizationShortName || 'AERC Ghana'}
        </h1>
        <p className="text-slate-400 max-w-lg mb-8 leading-relaxed text-sm">
          {siteSettings.maintenanceNotice ||
            'We are performing scheduled maintenance to enhance our community services. Please check back shortly.'}
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} {siteSettings.organizationName}</span>
          <span>&bull;</span>
          <Link href="/admin" className="text-emerald-400 hover:underline">Staff Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <OffcanvasSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        siteSettings={siteSettings}
      />
      <TopBar siteSettings={siteSettings} />
      <Navigation
        onOpenSidebar={() => setSidebarOpen(true)}
        siteSettings={siteSettings}
      />
      <main>{children}</main>
      <Footer siteSettings={siteSettings} />

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
