import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="section not-found-section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px' }}>
      <div className="container" style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: 'var(--emerald-50)',
            color: 'var(--emerald-800)',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: '20px',
            border: '1px solid var(--emerald-200)',
          }}
        >
          <i className="fa-solid fa-compass" style={{ color: 'var(--emerald-600)' }}></i>
          <span>404 • Resource Not Found</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1.15, marginBottom: '16px' }}>
          Looks like this path hasn&apos;t been cleared yet.
        </h1>

        <p style={{ fontSize: '1.08rem', color: 'var(--slate-600)', lineHeight: 1.6, marginBottom: '36px' }}>
          The page or report you requested might have been relocated, archived, or is temporarily unavailable. Let&apos;s get you back on track to exploring frontline climate action and grassroots empowerment.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '40px' }}>
          <Link href="/" className="btn-primary" style={{ padding: '12px 26px', fontSize: '0.95rem' }}>
            <i className="fa-solid fa-house"></i>
            <span>Return to Homepage</span>
          </Link>

          <Link href="/blog" className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <i className="fa-solid fa-newspaper"></i>
            <span>Read Field Journal</span>
          </Link>

          <Link href="/projects" className="btn-outline" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <i className="fa-solid fa-leaf"></i>
            <span>Explore Projects</span>
          </Link>
        </div>

        <div style={{ paddingTop: '28px', borderTop: '1px solid var(--slate-200)', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
          <span>Need direct help?</span>
          <Link href="/contact" style={{ color: 'var(--emerald-700)', fontWeight: 600, textDecoration: 'underline' }}>
            Contact Support & Inquiries
          </Link>
          <span>•</span>
          <Link href="/resources" style={{ color: 'var(--emerald-700)', fontWeight: 600, textDecoration: 'underline' }}>
            Publications & Downloads
          </Link>
        </div>
      </div>
    </div>
  );
}
