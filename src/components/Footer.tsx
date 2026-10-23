'use client';

import { useState } from 'react';
import Link from 'next/link';
import { subscribeNewsletter } from '@/app/actions';

export default function Footer() {
  const [newsStatus, setNewsStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
                  src="/images/logo-sidebar.png" 
                  alt="AERCGH Logo" 
                  style={{ height: '48px', width: '48px', borderRadius: '50%', objectFit: 'contain', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                    AERCGH
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--emerald-400)', letterSpacing: '0.04em' }}>
                    Alliance for Empowering Rural Communities
                  </span>
                </div>
              </Link>
            </div>
            <p className="footer-about-bio">
              Alliance for Empowering Rural Communities (AERC) is a legally registered, youth-led nonprofit in Ghana. We work at the intersection of climate, energy justice, and ecosystem restoration, empowering frontline communities to lead sustainable African solutions.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="https://x.com/aercgh" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="X">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/company/alliance-for-empowering-rural-communities" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://www.instagram.com/ghanaaerc/" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com/aercgh" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://www.youtube.com/@aercghana3755" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }} aria-label="YouTube">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/projects">Frontline Projects</Link></li>
              <li><Link href="/blog">Field Journal</Link></li>
              <li><Link href="/resources">Publications & Policy</Link></li>
              <li><Link href="/events">Events &amp; Convenings</Link></li>
            </ul>
          </div>

          {/* Col 3: Get Involved */}
          <div>
            <h4 className="footer-col-title">Get Involved</h4>
            <ul className="footer-links-list">
              <li><Link href="/partner">Become a Partner</Link></li>
              <li><Link href="/volunteer">Volunteer With Us</Link></li>
              <li><Link href="/contact">Media & Press</Link></li>
              <li><Link href="/contact">General Inquiries</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="footer-col-title">Frontline Office</h4>
            <ul className="footer-contact-items">
              <li>
                <i className="fa-solid fa-location-dot"></i>
                <span>Afienya-Mataheko, opposite Grace Bio, Greater Accra Region, Ghana.</span>
              </li>
              <li>
                <i className="fa-solid fa-phone"></i>
                <span>+233246980091 / +233245127304</span>
              </li>
              <li>
                <i className="fa-regular fa-envelope"></i>
                <span>info@aercghana.net</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} Alliance for Empowering Rural Communities (AERC Ghana). All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Youth-Led &amp; Community-Driven</span>
            <span>•</span>
            <span>Accra, Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
