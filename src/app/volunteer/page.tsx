import { Metadata } from 'next';
import Link from 'next/link';
import VolunteerForm from '@/components/VolunteerForm';

export const metadata: Metadata = {
  title: 'Become A Volunteer – AERCGH',
  description: 'Volunteer with the Alliance for Empowering Rural Communities (AERC) to champion climate justice, ecosystem restoration, and rural community empowerment.',
};

export default function VolunteerPage() {
  return (
    <>
      {/* BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Become A Volunteer</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Become A Volunteer</span></li>
          </ul>
        </div>
      </section>

      {/* VOLUNTEER SECTION */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Hero Banner Image */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '40px', height: '350px' }}>
            <img src="/images/focus-areas-real.png" alt="AERC Volunteers in Field" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Intro Text */}
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '16px' }}>Ignite Positive Transformation With Us</h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '14px' }}>
              We believe in the power of young people coming together to drive positive impact, and we invite you to be a part of this impactful journey. By volunteering with us, you become an essential catalyst for sustainable development, environmental conservation, and community development across Africa.
            </p>
            <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
              Fill out the form and embark on a journey of purposeful volunteering with the Alliance for Empowering Rural Communities. Your dedication can be the spark that ignites positive transformation and build a resilient community.
            </p>
          </div>

          {/* Volunteer Form Card */}
          <VolunteerForm />
        </div>
      </section>
    </>
  );
}
