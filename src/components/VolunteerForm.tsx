'use client';

import { useState } from 'react';
import { submitVolunteerApplication } from '@/app/actions';

export default function VolunteerForm() {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await submitVolunteerApplication(formData);
    setLoading(false);
    setStatus(res);
    if (res.success) {
      form.reset();
    }
  };

  return (
    <div style={{ background: '#fbfdfc', border: '1px solid #e2eee6', borderRadius: '12px', padding: '45px 40px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
      <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '25px', borderBottom: '1px solid #eef2f0', paddingBottom: '15px' }}>Volunteer Registration Form</h3>

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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Full Name</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input type="text" name="firstName" placeholder="First Name" required style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
            <input type="text" name="lastName" placeholder="Last Name" required style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Email Address <span style={{ color: 'red' }}>*</span></label>
            <input type="email" name="email" placeholder="volunteer@example.com" required style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Phone Number</label>
            <input type="tel" name="phone" placeholder="+233..." style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '12px' }}>Areas of Interest</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--primary-dark)', cursor: 'pointer' }}>
              <input type="checkbox" name="interests" value="Event Support" style={{ accentColor: 'var(--primary-green)' }} /> Event Support
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--primary-dark)', cursor: 'pointer' }}>
              <input type="checkbox" name="interests" value="Fundraising" style={{ accentColor: 'var(--primary-green)' }} /> Fundraising
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--primary-dark)', cursor: 'pointer' }}>
              <input type="checkbox" name="interests" value="Community Outreach" style={{ accentColor: 'var(--primary-green)' }} /> Community Outreach
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--primary-dark)', cursor: 'pointer' }}>
              <input type="checkbox" name="interests" value="Administrative Tasks" style={{ accentColor: 'var(--primary-green)' }} /> Administrative Tasks
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', color: 'var(--primary-dark)', cursor: 'pointer' }}>
              <input type="checkbox" name="interests" value="Other" style={{ accentColor: 'var(--primary-green)' }} /> Other
            </label>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Availability</label>
          <select name="availability" style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', background: 'white' }}>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="Evenings">Evenings</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>Tell us about your volunteer experience</label>
          <textarea name="experience" placeholder="Share your past volunteering, skills, or passions..." rows={4} style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical' }}></textarea>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>How did you hear about us?</label>
          <input type="text" name="referral" placeholder="Social Media, Friend, Event, etc." style={{ width: '100%', padding: '13px 16px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.95rem', fontFamily: 'inherit' }} />
        </div>

        <button type="submit" disabled={loading} style={{ background: 'var(--primary-green)', color: 'white', border: 'none', padding: '15px 32px', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '10px', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting...' : 'Submit Volunteer Form'} <i className="fa-solid fa-arrow-right-long"></i>
        </button>
      </form>
    </div>
  );
}
