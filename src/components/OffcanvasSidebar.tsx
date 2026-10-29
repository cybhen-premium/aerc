'use client';

import Link from 'next/link';
import type { SiteSettings } from '@/db/schema';

interface OffcanvasSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings?: SiteSettings;
}

export default function OffcanvasSidebar({ isOpen, onClose, siteSettings }: OffcanvasSidebarProps) {
  const logoUrl = siteSettings?.logoUrl || '/images/logo-sidebar.png';
  const shortName = siteSettings?.organizationShortName || 'AERCGH';
  const orgName = siteSettings?.organizationName || 'Alliance for Empowering Rural Communities';

  return (
    <>
      <div 
        className={`modern-sidebar-backdrop ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`modern-sidebar-drawer ${isOpen ? 'active' : ''}`} aria-label="Mobile Navigation Drawer">
        <button 
          className="sidebar-close-btn" 
          onClick={onClose} 
          aria-label="Close navigation menu"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div style={{ marginBottom: '28px' }}>
          <Link href="/" onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img 
              src={logoUrl} 
              alt={`${shortName} Logo`} 
              style={{ height: '46px', width: '46px', borderRadius: '50%', objectFit: 'contain', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--slate-900)', lineHeight: 1.1 }}>
                {shortName}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--emerald-600)', letterSpacing: '0.04em' }}>
                {orgName}
              </span>
            </div>
          </Link>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
          <Link href="/" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-house" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> Home
          </Link>
          <Link href="/about" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-users" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> About Us
          </Link>
          <div style={{ paddingLeft: '28px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link href="/mission" onClick={onClose} style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--slate-600)' }}>
              &bull; Our Mission
            </Link>
            <Link href="/vision" onClick={onClose} style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--slate-600)' }}>
              &bull; Our Vision
            </Link>
            <Link href="/objectives" onClick={onClose} style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--slate-600)' }}>
              &bull; Objectives
            </Link>
            <Link href="/how-we-work" onClick={onClose} style={{ padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--slate-600)' }}>
              &bull; How We Work
            </Link>
          </div>
          <Link href="/projects" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-seedling" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> Projects
          </Link>
          <Link href="/blog" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-regular fa-newspaper" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> Blog
          </Link>
          <Link href="/resources" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-book-open" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> Publications
          </Link>
          <Link href="/donate" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 700, color: '#059669', background: '#ecfdf5', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-heart" style={{ color: '#f43f5e', width: '20px' }}></i> Donate &amp; Support
          </Link>
          <Link href="/team" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-user-group" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> Our Team
          </Link>
          <Link href="/faq" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-regular fa-circle-question" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> FAQ
          </Link>
          <Link href="/events" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-regular fa-calendar-check" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> Events &amp; Convenings
          </Link>
          <hr style={{ border: 'none', borderTop: '1px solid var(--slate-200)', margin: '10px 0' }} />
          <Link href="/partner" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-handshake" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> Become a Partner
          </Link>
          <Link href="/volunteer" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-people-carry-box" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> Become A Volunteer
          </Link>
          <Link href="/contact" onClick={onClose} style={{ padding: '10px 14px', borderRadius: '8px', fontWeight: 600, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-regular fa-envelope" style={{ color: 'var(--emerald-600)', width: '20px' }}></i> Contact Us
          </Link>
        </nav>

        <div style={{ background: 'var(--slate-50)', padding: '20px', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--slate-900)', marginBottom: '10px' }}>Reach Our Team</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6, margin: 0 }}>
            <i className="fa-solid fa-phone" style={{ color: 'var(--emerald-600)', marginRight: '6px' }}></i> +233246980091
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6, marginTop: '4px' }}>
            <i className="fa-regular fa-envelope" style={{ color: 'var(--emerald-600)', marginRight: '6px' }}></i> info@aercghana.net
          </p>
        </div>
      </aside>
    </>
  );
}
