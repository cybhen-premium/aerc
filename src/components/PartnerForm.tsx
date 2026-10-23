'use client';

import { useState } from 'react';
import { submitPartnerApplication } from '@/app/actions';

export default function PartnerForm() {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await submitPartnerApplication(formData);
    setLoading(false);
    setStatus(res);
    if (res.success) {
      form.reset();
    }
  };

  return (
    <div style={{ background: '#fbfdfc', border: '1px solid #e2eee6', borderRadius: '12px', padding: '45px 40px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
      <h3 style={{ fontSize: '1.45rem', color: 'var(--primary-dark)', marginBottom: '20px' }}>Partnership Inquiry Form</h3>

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
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>
            Name <span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input type="text" name="firstName" placeholder="First Name" required style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
            <input type="text" name="lastName" placeholder="Last Name" required style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>
            Email <span style={{ color: 'red' }}>*</span>
          </label>
          <input type="email" name="email" placeholder="partner@organization.org" required style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>
            Organisation
          </label>
          <input type="text" name="organisation" placeholder="Organization or Agency Name" style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Phone Number</label>
            <input type="tel" name="phone" placeholder="+233..." style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Location</label>
            <input type="text" name="location" placeholder="City, Country" style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>
            How do you wish to partner with us?
          </label>
          <textarea name="proposal" placeholder="Tell us about your organization and how we can collaborate..." rows={5} style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
        </div>

        <button type="submit" disabled={loading} style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '15px 32px', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting...' : 'Submit Application'} <i className="fa-solid fa-arrow-right-long"></i>
        </button>
      </form>
    </div>
  );
}
