import { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us – AERCGH',
  description: 'Get in touch with Alliance for Empowering Rural Communities (AERC) in Greater Accra, Ghana. Submit inquiries, project collaborations, or visit our office.',
};

export default function ContactPage() {
  return (
    <>
      {/* BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Contact Us</span></li>
          </ul>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section style={{ padding: '100px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '40px', alignItems: 'stretch', marginBottom: '70px' }}>
            {/* Left Box: Info Card */}
            <div style={{ background: 'var(--primary-dark)', color: 'white', borderRadius: '12px', padding: '50px 40px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.05, fontSize: '15rem', pointerEvents: 'none' }}>
                <i className="fa-solid fa-paper-plane"></i>
              </div>
              <div>
                <span style={{ color: 'var(--primary-green)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px', display: 'block', marginBottom: '12px' }}>
                  <i className="fa-solid fa-message"></i> GET IN TOUCH
                </span>
                <h2 style={{ fontSize: '2.4rem', lineHeight: 1.25, marginBottom: '25px', color: 'white' }}>
                  Have Something In Mind? <br />
                  <span style={{ color: 'var(--primary-green)' }}>Let's Talk.</span>
                </h2>
                <p style={{ color: '#abb8c3', fontSize: '1rem', lineHeight: 1.7, marginBottom: '35px' }}>
                  We welcome partnerships, inquiries, media requests, and grassroots collaborations from advocates across the globe.
                </p>
              </div>

              <div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <li style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(86, 211, 103, 0.15)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '4px', fontWeight: 600 }}>Location</h4>
                      <p style={{ fontSize: '0.92rem', color: '#abb8c3', margin: 0, lineHeight: 1.5 }}>Afienya-Mataheko, opposite Grace Bio, Greater Accra Region, Ghana.</p>
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(86, 211, 103, 0.15)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '4px', fontWeight: 600 }}>Phone Number</h4>
                      <p style={{ fontSize: '0.92rem', color: '#abb8c3', margin: 0, lineHeight: 1.5 }}>+233246980091 / +233245127304</p>
                    </div>
                  </li>
                  <li style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(86, 211, 103, 0.15)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1rem', color: 'white', marginBottom: '4px', fontWeight: 600 }}>Email Address</h4>
                      <p style={{ fontSize: '0.92rem', color: '#abb8c3', margin: 0, lineHeight: 1.5 }}>Info@aercghana.net</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Box: Form */}
            <ContactForm />
          </div>

          {/* GOOGLE MAP EMBED */}
          <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', height: '420px' }}>
            <iframe 
              title="AERC Ghana Location"
              src="https://maps.google.com/maps?q=Afienya-Mataheko,%20Greater%20Accra,%20Ghana&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
