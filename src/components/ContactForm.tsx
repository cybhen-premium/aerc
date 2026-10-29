'use client';

import { useState, useEffect } from 'react';
import { submitContactForm } from '@/app/actions';

export default function ContactForm() {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [renderTimestamp, setRenderTimestamp] = useState<number>(0);

  useEffect(() => {
    setRenderTimestamp(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await submitContactForm(formData);
    setLoading(false);
    setStatus(res);
    if (res.success) {
      form.reset();
      setRenderTimestamp(Date.now());
    }
  };

  return (
    <div style={{ background: '#fdfdfd', border: '1px solid #eef2f0', borderRadius: '12px', padding: '45px 40px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
      <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)', marginBottom: '10px' }}>Send Us a Message</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '30px' }}>Fill out this form and our team will get back to you promptly.</p>

      {status && (
        <div style={{
          padding: '12px 18px',
          borderRadius: '6px',
          marginBottom: '20px',
          backgroundColor: status.success ? '#e8f8ec' : '#fdeeed',
          color: status.success ? '#2e7d32' : '#c0392b',
          fontSize: '0.92rem',
          fontWeight: 500,
        }}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Anti-spam hidden honeypot field */}
        <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
          <label htmlFor="website_url_hp">Leave this field blank</label>
          <input type="text" id="website_url_hp" name="website_url_hp" tabIndex={-1} autoComplete="off" />
          <input type="hidden" name="_submission_ts" value={renderTimestamp} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Your Name *</label>
            <input type="text" name="name" placeholder="John Doe" required style={{ width: '100%', padding: '14px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Your Email *</label>
            <input type="email" name="email" placeholder="john@example.com" required style={{ width: '100%', padding: '14px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Phone Number (Optional)</label>
            <input type="tel" name="phone" placeholder="+233 24 123 4567" style={{ width: '100%', padding: '14px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Inquiry Category *</label>
            <select name="category" required style={{ width: '100%', padding: '14px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', background: 'white' }}>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Partnership & Grants">Partnership &amp; Grants</option>
              <option value="Media & Press">Media &amp; Press</option>
              <option value="Research & Climate Data">Research &amp; Climate Data</option>
              <option value="Community Initiatives">Community Initiatives</option>
              <option value="Donations & Giving">Donations &amp; Giving</option>
              <option value="Careers & Volunteering">Careers &amp; Volunteering</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Subject</label>
          <input type="text" name="subject" placeholder="What is this inquiry regarding?" style={{ width: '100%', padding: '14px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Your Message *</label>
          <textarea name="message" placeholder="Write your message here (min. 10 characters)..." rows={5} minLength={10} required style={{ width: '100%', padding: '14px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}></textarea>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" id="terms" required style={{ width: '18px', height: '18px', accentColor: 'var(--primary-green)' }} />
          <label htmlFor="terms" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>I accept your privacy policy and allow AERC Ghana to contact me.</label>
        </div>

        <button type="submit" disabled={loading} style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'background 0.2s ease', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting...' : 'Submit Now'} <i className="fa-solid fa-arrow-right-long"></i>
        </button>
      </form>
    </div>
  );
}
