'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { SiteSettings } from '@/db/schema';

interface NavigationProps {
  onOpenSidebar: () => void;
  siteSettings?: SiteSettings;
}

export default function Navigation({ onOpenSidebar, siteSettings }: NavigationProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const logoUrl = siteSettings?.logoUrl || '/images/logo-sidebar.png';
  const shortName = siteSettings?.organizationShortName || 'AERCGH';
  const orgName = siteSettings?.organizationName || 'Alliance for Empowering Rural Communities';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className={`site-header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Brand Logo & Title */}
        <div className="header-brand">
          <Link href="/" className="brand-logo-link" aria-label={`${shortName} Home`}>
            <img src={logoUrl} alt={`${shortName} Logo`} className="header-logo-img" />
            <div className="brand-logo-text">
              <span className="brand-logo-title">{shortName}</span>
              <span className="brand-logo-desc">{orgName}</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="header-nav">
          <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          {/* About Us Dropdown */}
          <div className="nav-dropdown-wrap">
            <Link 
              href="/about" 
              className={`nav-link nav-dropdown-trigger ${isActive('/about') || ['/mission', '/vision', '/objectives', '/how-we-work'].includes(pathname) ? 'active' : ''}`}
            >
              <span>About Us</span>
              <i className="fa-solid fa-chevron-down dropdown-caret"></i>
            </Link>
            <div className="nav-dropdown-menu" role="menu">
              <Link href="/about" className={`nav-dropdown-item ${pathname === '/about' ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-circle-info"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Overview</span>
                  <span className="dropdown-item-desc">Who we are &amp; strategic focus</span>
                </div>
              </Link>
              <Link href="/mission" className={`nav-dropdown-item ${pathname === '/mission' ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-bullseye"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Our Mission</span>
                  <span className="dropdown-item-desc">Grassroots resilience &amp; justice</span>
                </div>
              </Link>
              <Link href="/vision" className={`nav-dropdown-item ${pathname === '/vision' ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-eye"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Our Vision</span>
                  <span className="dropdown-item-desc">Thriving, sovereign communities</span>
                </div>
              </Link>
              <Link href="/objectives" className={`nav-dropdown-item ${pathname === '/objectives' ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-list-check"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Strategic Objectives</span>
                  <span className="dropdown-item-desc">Key institutional goals</span>
                </div>
              </Link>
              <Link href="/how-we-work" className={`nav-dropdown-item ${pathname === '/how-we-work' ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-gears"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">How We Work</span>
                  <span className="dropdown-item-desc">Community co-design &amp; action</span>
                </div>
              </Link>
              <Link href="/focus" className={`nav-dropdown-item ${pathname.startsWith('/focus') ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-shapes"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Focus Areas &amp; Pillars</span>
                  <span className="dropdown-item-desc">Climate &amp; Energy Transition</span>
                </div>
              </Link>
            </div>
          </div>
          <Link href="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
            Projects
          </Link>
          <Link href="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`}>
            Blog
          </Link>
          <Link href="/resources" className={`nav-link ${isActive('/resources') ? 'active' : ''}`}>
            Publications
          </Link>

          {/* Dropdown Menu */}
          <div className="nav-dropdown-wrap">
            <button 
              type="button"
              className={`nav-link nav-dropdown-trigger ${['/contact', '/partner', '/volunteer', '/events'].includes(pathname) ? 'active' : ''}`} 
              aria-haspopup="true"
              aria-label="Get Involved menu"
            >
              <span>Get Involved</span>
              <i className="fa-solid fa-chevron-down dropdown-caret"></i>
            </button>
            <div className="nav-dropdown-menu" role="menu">
              <Link href="/donate" className={`nav-dropdown-item ${pathname === '/donate' ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-heart" style={{ color: '#f43f5e' }}></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Donate &amp; Support</span>
                  <span className="dropdown-item-desc">Fund grassroots climate action</span>
                </div>
              </Link>
              <Link href="/team" className={`nav-dropdown-item ${pathname === '/team' ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-user-group"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Meet Our Team</span>
                  <span className="dropdown-item-desc">Leadership &amp; frontline officers</span>
                </div>
              </Link>
              <Link href="/faq" className={`nav-dropdown-item ${pathname === '/faq' ? 'active' : ''}`} role="menuitem">
                <i className="fa-regular fa-circle-question"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">FAQ</span>
                  <span className="dropdown-item-desc">Answers to common questions</span>
                </div>
              </Link>
              <Link href="/events" className={`nav-dropdown-item ${pathname === '/events' ? 'active' : ''}`} role="menuitem">
                <i className="fa-regular fa-calendar-check"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Events &amp; Convenings</span>
                  <span className="dropdown-item-desc">Past summits, dialogues &amp; recaps</span>
                </div>
              </Link>
              <Link href="/contact" className={`nav-dropdown-item ${pathname === '/contact' ? 'active' : ''}`} role="menuitem">
                <i className="fa-regular fa-envelope"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Contact Us</span>
                  <span className="dropdown-item-desc">General inquiries &amp; press</span>
                </div>
              </Link>
              <Link href="/partner" className={`nav-dropdown-item ${pathname === '/partner' ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-handshake"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Become a Partner</span>
                  <span className="dropdown-item-desc">Institutions &amp; coalitions</span>
                </div>
              </Link>
              <Link href="/volunteer" className={`nav-dropdown-item ${pathname === '/volunteer' ? 'active' : ''}`} role="menuitem">
                <i className="fa-solid fa-people-carry-box"></i>
                <div className="dropdown-item-text">
                  <span className="dropdown-item-title">Volunteer With Us</span>
                  <span className="dropdown-item-desc">Join frontline grassroots action</span>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        {/* Header Right Action Group */}
        <div className="header-cta-group">
          <Link href="/donate" className="btn-primary" style={{ backgroundColor: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.85rem' }}>
            <i className="fa-solid fa-heart" style={{ color: '#fda4af' }}></i>
            <span>Donate</span>
          </Link>
          <Link href="/partner" className="btn-primary header-partner-btn">
            <span className="partner-btn-full">Partner With Us</span>
            <span className="partner-btn-short">Partner</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>

          {/* Mobile hamburger button */}
          <button 
            className="header-mobile-toggle" 
            onClick={onOpenSidebar} 
            aria-label="Open mobile navigation menu"
          >
            <i className="fa-solid fa-bars-staggered"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
