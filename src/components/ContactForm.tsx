'use client';

import { useState } from 'react';
import { submitContactForm } from '@/app/actions';

export default function ContactForm() {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

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

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Subject</label>
          <select name="subject" style={{ width: '100%', padding: '14px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', background: 'white' }}>
            <option value="General Inquiry">Select Subject</option>
            <option value="Account">Account</option>
            <option value="Service">Service / Projects</option>
            <option value="Pricing">Donation / Partnership</option>
            <option value="Support">Support & Volunteering</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Your Message *</label>
          <textarea name="message" placeholder="Write your message here..." rows={5} required style={{ width: '100%', padding: '14px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', outline: 'none', resize: 'vertical' }}></textarea>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="checkbox" id="terms" required style={{ width: '18px', height: '18px', accentColor: 'var(--primary-green)' }} />
          <label htmlFor="terms" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>I accept your terms & conditions</label>
        </div>

        <button type="submit" disabled={loading} style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '16px 36px', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'background 0.2s ease', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting...' : 'Submit Now'} <i className="fa-solid fa-arrow-right-long"></i>
        </button>
      </form>
    </div>
  );
}
