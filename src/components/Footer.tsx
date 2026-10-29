'use client';

import { useState } from 'react';
import Link from 'next/link';
import { subscribeNewsletter } from '@/app/actions';
import type { SiteSettings } from '@/db/schema';

interface FooterProps {
  siteSettings?: SiteSettings;
}

export default function Footer({ siteSettings }: FooterProps) {
  const [newsStatus, setNewsStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shortName = siteSettings?.organizationShortName || 'AERCGH';
  const orgName = siteSettings?.organizationName || 'Alliance for Empowering Rural Communities';
  const logo = siteSettings?.logoDarkUrl || siteSettings?.logoUrl || '/images/logo-sidebar.png';
  const bio = siteSettings?.footerBio || 'Alliance for Empowering Rural Communities (AERC) is a legally registered, youth-led nonprofit in Ghana. We work at the intersection of climate, energy justice, and ecosystem restoration, empowering frontline communities to lead sustainable African solutions.';
  
  const twitter = siteSettings?.socialTwitter || 'https://x.com/aercgh';
  const linkedin = siteSettings?.socialLinkedin || 'https://www.linkedin.com/company/alliance-for-empowering-rural-communities';
  const instagram = siteSettings?.socialInstagram || 'https://www.instagram.com/ghanaaerc/';
  const facebook = siteSettings?.socialFacebook || 'https://www.facebook.com/aercgh';
  const youtube = siteSettings?.socialYoutube || 'https://www.youtube.com/@aercghana3755';
  const whatsappChannel = siteSettings?.socialWhatsappChannel;

  const address = siteSettings?.addressStreet
    ? `${siteSettings.addressStreet}, ${siteSettings.addressCity}, ${siteSettings.addressCountry}.`
    : 'Afienya-Mataheko, opposite Grace Bio, Greater Accra Region, Ghana.';
  const phones = siteSettings?.phonePrimary
    ? `${siteSettings.phonePrimary}${siteSettings.phoneSecondary ? ` / ${siteSettings.phoneSecondary}` : ''}`
    : '+233246980091 / +233245127304';
  const email = siteSettings?.contactEmail || 'info@aercghana.net';
  const copyright = siteSettings?.footerCopyrightText || 'Alliance for Empowering Rural Communities (AERC Ghana). All rights reserved.';
  const badgeText = siteSettings?.footerBadgeText || 'Youth-Led & Community-Driven • Accra, Ghana';

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await subscribeNewsletter(formData);
    setLoading(false);
    setNewsStatus(res.message);
    if (res.success) {
      form.reset();
    }
  };

  return (
    <footer className="modern-footer">
      <div className="container">
        {/* Newsletter Banner */}
        <div className="footer-newsletter-banner">
          <div className="footer-newsletter-info">
            <span className="badge-pill dark" style={{ marginBottom: '8px' }}>
              <i className="fa-solid fa-paper-plane"></i> STAY INFORMED
            </span>
            <h3>Join Our Grassroots Movement</h3>
            <p>Receive frontline climate stories, policy briefings, and community reports directly to your inbox.</p>
          </div>

          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email address..." 
              required 
              className="footer-newsletter-input" 
            />
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px 26px', flexShrink: 0 }}>
              {loading ? 'Subscribing...' : 'Subscribe'} <i className="fa-solid fa-arrow-right"></i>
            </button>
          </form>
          {newsStatus && (
            <span style={{ width: '100%', fontSize: '0.85rem', color: '#34d399', textAlign: 'right' }}>
              {newsStatus}
            </span>
          )}
        </div>

        {/* Footer 4-Column Grid */}
        <div className="footer-cols-grid">
          {/* Col 1: About */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                <img 
                  src={logo} 
                  alt={`${shortName} Logo`} 
                  style={{ height: '48px', width: '48px', borderRadius: '50%', objectFit: 'contain', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                    {shortName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--emerald-400)', letterSpacing: '0.04em' }}>
                    {orgName}
                  </span>
                </div>
              </Link>
            </div>
            <p className="footer-about-bio">
              {bio}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {twitter && (
                <a href={twitter} target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="X">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="Instagram">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="Facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              )}
              {youtube && (
                <a href={youtube} target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="YouTube">
                  <i className="fa-brands fa-youtube"></i>
                </a>
              )}
              {whatsappChannel && (
                <a href={whatsappChannel} target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="WhatsApp">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/mission">Our Mission</Link></li>
              <li><Link href="/vision">Our Vision</Link></li>
              <li><Link href="/objectives">Objectives</Link></li>
              <li><Link href="/how-we-work">How We Work</Link></li>
              <li><Link href="/team">Our Team</Link></li>
              <li><Link href="/projects">Frontline Projects</Link></li>
              <li><Link href="/blog">Field Journal</Link></li>
              <li><Link href="/resources">Publications &amp; Policy</Link></li>
              <li><Link href="/events">Events &amp; Convenings</Link></li>
            </ul>
          </div>

          {/* Col 3: Get Involved & Legal */}
          <div>
            <h4 className="footer-col-title">Get Involved &amp; Legal</h4>
            <ul className="footer-links-list">
              <li><Link href="/donate" style={{ color: '#34d399', fontWeight: 700 }}><i className="fa-solid fa-heart" style={{ color: '#f43f5e', marginRight: '6px' }}></i>Donate &amp; Support</Link></li>
              <li><Link href="/partner">Become a Partner</Link></li>
              <li><Link href="/volunteer">Volunteer With Us</Link></li>
              <li><Link href="/faq">FAQ &amp; Knowledge Base</Link></li>
              <li><Link href="/contact">Media &amp; Press</Link></li>
              <li><Link href="/contact">General Inquiries</Link></li>
              <li><Link href="/privacy-policy" style={{ color: '#94a3b8' }}>Privacy Policy (Act 843)</Link></li>
              <li><Link href="/terms" style={{ color: '#94a3b8' }}>Terms of Service</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="footer-col-title">Frontline Office</h4>
            <ul className="footer-contact-items">
              <li>
                <i className="fa-solid fa-location-dot"></i>
                <span>{address}</span>
              </li>
              <li>
                <i className="fa-solid fa-phone"></i>
                <span>{phones}</span>
              </li>
              <li>
                <i className="fa-regular fa-envelope"></i>
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} {copyright}</p>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span>{badgeText}</span>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-emerald-400 transition-colors opacity-75 hover:opacity-100">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
