'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/app/actions';

export default function NewsletterForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await subscribeNewsletter(formData);
    setLoading(false);
    setStatus(res.message);
    if (res.success) {
      form.reset();
    }
  };

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <input 
        type="email" 
        name="email" 
        placeholder="Your email Address" 
        required 
      />
      <button type="submit" aria-label="Subscribe" disabled={loading}>
        <i className="fa-solid fa-paper-plane"></i>
      </button>
      {status && (
        <span style={{ position: 'absolute', bottom: '-28px', left: 0, fontSize: '0.85rem', color: '#56d367' }}>
          {status}
        </span>
      )}
    </form>
  );
}
