'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  onOpenSidebar: () => void;
}

export default function Navigation({ onOpenSidebar }: NavigationProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

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
          <Link href="/" className="brand-logo-link" aria-label="AERCGH Home">
            <img src="/images/logo-sidebar.png" alt="AERCGH Logo" className="header-logo-img" />
            <div className="brand-logo-text">
              <span className="brand-logo-title">AERCGH</span>
              <span className="brand-logo-desc">Alliance for Empowering Rural Communities</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="header-nav">
          <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About Us
          </Link>
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
