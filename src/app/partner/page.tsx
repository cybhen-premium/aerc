import { Metadata } from 'next';
import Link from 'next/link';
import PartnerForm from '@/components/PartnerForm';

export const metadata: Metadata = {
  title: 'Become a Partner – AERCGH',
  description: 'Partner with the Alliance for Empowering Rural Communities (AERC) to drive transformational change, climate justice, and community development across Africa.',
};

export default function PartnerPage() {
  return (
    <>
      {/* BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Become a Partner</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Become a Partner</span></li>
          </ul>
        </div>
      </section>

      {/* PARTNER CONTENT & FORM SECTION */}
      <section style={{ padding: '90px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ maxWidth: '850px', margin: '0 auto 50px', textAlign: 'center' }}>
            <span className="sub-title"><i className="fa-solid fa-handshake"></i> COLLABORATE WITH US</span>
            <h2 className="sec-title" style={{ marginBottom: '20px' }}>Joining Forces for Sustainable Development</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '16px' }}>
              Partnering with the Alliance for Empowering Rural Communities is more than collaboration; it’s a shared commitment to transformational change. By joining hands with us, you’re contributing to a worthy social and environmental cause that will positively impact millions of African lives.
            </p>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '20px' }}>
              For us, partnerships are not just alliances, they are avenues for diverse experiences, expertise, and the collective capacity to deliver the impactful and transformational change we seek.
            </p>
            <span style={{ display: 'inline-block', background: '#e8f8ec', color: '#2e7d32', padding: '8px 20px', borderRadius: '20px', fontWeight: 600, fontSize: '0.95rem' }}>
              We Appreciate Your Interest in Joining Forces with Us!
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '50px', alignItems: 'start' }}>
            {/* Left: Form */}
            <PartnerForm />

            {/* Right: Image and Highlights */}
            <div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
                <img src="/images/slide2.jpg" alt="AERC Community Action" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
              </div>
              <div style={{ background: '#f7faf8', borderRadius: '10px', padding: '30px', borderLeft: '4px solid var(--primary-green)' }}>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '12px' }}>Why Partner With AERC?</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  <li><i className="fa-solid fa-check" style={{ color: 'var(--primary-green)', marginRight: '8px' }}></i> Direct grassroots presence in frontline African rural communities</li>
                  <li><i className="fa-solid fa-check" style={{ color: 'var(--primary-green)', marginRight: '8px' }}></i> Youth-driven agility with measurable ecological and social impact</li>
                  <li><i className="fa-solid fa-check" style={{ color: 'var(--primary-green)', marginRight: '8px' }}></i> Transparent governance and active alignment with UN SDGs</li>
                  <li><i className="fa-solid fa-check" style={{ color: 'var(--primary-green)', marginRight: '8px' }}></i> Global network across COP, UNEP, and international climate coalitions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
