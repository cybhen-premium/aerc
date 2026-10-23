import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Events & Convenings – Alliance for Empowering Rural Communities (AERCGH)',
  description: 'Explore past flagship events, youth climate summits, grassroots dialogues, and national policy convenings organized by AERC Ghana.',
};

interface EventItem {
  id: string;
  title: string;
  dates: string;
  venue: string;
  category: string;
  statusBadge: string;
  isPast: boolean;
  coverImage: string;
  summary: string;
  highlights: string[];
  link: string;
  linkText: string;
}

const pastEvents: EventItem[] = [
  {
    id: 'festival-2026',
    title: 'Youth Climate Joy and Healing Festival 2026',
    dates: '14–15 August 2026',
    venue: 'Univ. of Environment & Sustainable Development, Somanya',
    category: 'Flagship Youth Gathering',
    statusBadge: 'Concluded · Full Recap Available',
    isPast: true,
    coverImage: '/images/festival-banner.jpg',
    summary: 'A landmark two-day convening uniting over 150 youth climate organizers, creatives, community leaders, and wellbeing practitioners across Ghana to celebrate collective care, peer solidarity, and emotional resilience in frontline climate advocacy.',
    highlights: ['150+ Youth Leaders', '4 Core Thematic Tracks', 'Arts & Storytelling', 'Self-Care Frameworks'],
    link: '/festival',
    linkText: 'View Festival Recap & Outcomes',
  },
  {
    id: 'gbetsile-wed-2026',
    title: 'World Environment Day Community Dialogue on Zero Waste & Composting',
    dates: '5 June 2026',
    venue: 'Goshen/Gbetsile, Kpone Katamanso Municipality',
    category: 'Community Dialogue & Zero Waste',
    statusBadge: 'Concluded · Field Report Available',
    isPast: true,
    coverImage: '/images/blog-gbetsile.jpg',
    summary: 'Community-wide dialogue in Gbetsile bringing together local residents, women food vendors, youth leaders, informal waste workers, and municipal assembly representatives to devise practical grassroots composting and safe waste management.',
    highlights: ['Community-Led Composting', 'Informal Waste Workers', 'Kpone Katamanso Municipal Assembly', 'Direct Citizen Action'],
    link: '/blog/aerc-marks-world-environment-day-with-community-dialogue-on-environmental-action-in-gbetsile',
    linkText: 'Read Community Dialogue Report',
  },
  {
    id: 'nrefd-2026',
    title: 'National Renewable Energy Finance Dialogue (NREFD)',
    dates: '10 April 2026',
    venue: 'Accra, Greater Accra Region',
    category: 'Policy & Energy Transition',
    statusBadge: 'Concluded · Policy Brief Published',
    isPast: true,
    coverImage: '/images/project-solar-real.jpg',
    summary: 'High-level policy dialogue convening renewable energy practitioners, rural development leads, and financial institutions to bridge the gap between national electricity access statistics and real productive clean energy utilization in rural Ghana.',
    highlights: ['Energy Utilization vs. Access', 'Decentralized Mini-Grids', 'Published Policy Brief', 'CSO & Gov Collaboration'],
    link: '/blog/an-insight-brief-from-the-national-renewable-energy-finance-dialogue',
    linkText: 'Read Policy Insight Brief',
  },
  {
    id: 'fossil-free-eca',
    title: 'Fossil Free ECA & African Climate Finance Mobilization',
    dates: '2025 – 2026 Campaign Cycle',
    venue: 'Multi-Region Grassroots Actions, Ghana',
    category: 'Climate Finance Advocacy',
    statusBadge: 'Completed Campaign Cycle',
    isPast: true,
    coverImage: '/images/projects/fossil.jpg',
    summary: 'Pan-African grassroots campaign led by youth activists demanding international export credit agencies (ECAs) halt public financing for fossil fuel exploration and redirect vital finance toward community-owned solar and renewable projects.',
    highlights: ['Pan-African CSO Network', 'Redirecting Export Credits', 'Community Solar Transition', 'Youth-Led Rallies'],
    link: '/projects/fossil-fuel-finance-accountability',
    linkText: 'Explore Campaign Details',
  },
];

export default function EventsPage() {
  return (
    <>
      {/* BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Events &amp; Convenings</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Events &amp; Convenings</span></li>
          </ul>
        </div>
      </section>

      {/* MAIN EVENTS SECTION */}
      <section style={{ padding: '90px 0', background: '#f8fafc' }}>
        <div className="container">
          {/* Section Headline */}
          <div style={{ maxWidth: '800px', margin: '0 auto 60px', textAlign: 'center' }}>
            <span className="badge-pill">
              <i className="fa-regular fa-calendar-check"></i> GRASSROOTS CONVENINGS &amp; SUMMITS
            </span>
            <h2 className="section-title" style={{ marginTop: '12px', marginBottom: '16px' }}>
              Past Events &amp; Flagship Milestones
            </h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              From landmark youth climate festivals to community-level zero-waste dialogues and national energy finance roundtables, explore our proven record of bringing people together for tangible change across Ghana.
            </p>
          </div>

          {/* Events Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {pastEvents.map((evt) => (
              <article 
                key={evt.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 30px -10px rgba(15, 23, 42, 0.05)',
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1.6fr',
                  transition: 'all 0.3s ease',
                }}
                className="event-card-item"
              >
                {/* Visual Box */}
                <div style={{ position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      top: '16px', 
                      left: '16px', 
                      background: 'rgba(15, 23, 42, 0.85)', 
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fa-solid fa-tag" style={{ color: '#10b981' }}></i>
                    <span>{evt.category}</span>
                  </div>
                </div>

                {/* Content Box */}
                <div style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  {/* Status & Date Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <span 
                      style={{ 
                        background: '#ecfdf5', 
                        color: '#065f46', 
                        border: '1px solid #a7f3d0', 
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.78rem', 
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="fa-solid fa-check-circle" style={{ color: '#10b981' }}></i>
                      <span>{evt.statusBadge}</span>
                    </span>

                    <span style={{ fontSize: '0.88rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-regular fa-calendar-days" style={{ color: '#10b981' }}></i>
                      <span>{evt.dates}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.35, marginBottom: '12px' }}>
                    <Link href={evt.link} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {evt.title}
                    </Link>
                  </h3>

                  {/* Venue */}
                  <div style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#10b981' }}></i>
                    <span>{evt.venue}</span>
                  </div>

                  {/* Summary */}
                  <p style={{ fontSize: '0.96rem', color: '#475569', lineHeight: 1.65, marginBottom: '20px' }}>
                    {evt.summary}
                  </p>

                  {/* Chips */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {evt.highlights.map((h, i) => (
                      <span 
                        key={i} 
                        style={{ 
                          background: '#f1f5f9', 
                          color: '#334155', 
                          padding: '3px 10px', 
                          borderRadius: '6px', 
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div>
                    <Link 
                      href={evt.link} 
                      className="btn-secondary"
                      style={{ padding: '10px 22px', fontSize: '0.92rem' }}
                    >
                      <span>{evt.linkText}</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Forward-Looking Partner Banner */}
          <div 
            style={{ 
              marginTop: '70px', 
              background: 'linear-gradient(135deg, #093322 0%, #0d4630 100%)', 
              borderRadius: '24px', 
              padding: '50px 40px', 
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(9, 51, 34, 0.2)'
            }}
          >
            <span 
              className="badge-pill dark" 
              style={{ color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.3)', marginBottom: '14px' }}
            >
              <i className="fa-solid fa-handshake"></i> COLLABORATIVE GATHERINGS
            </span>
            <h3 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '10px 0 14px', color: '#ffffff' }}>
              Interested in Co-Convening or Partnering on an Event?
            </h3>
            <p style={{ maxWidth: '680px', margin: '0 auto 28px', color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.7 }}>
              AERC frequently collaborates with universities, community leaders, youth coalitions, and international development organizations to organize high-impact climate justice summits, rural farmer roundtables, and policy dialogues.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/partner" className="btn-primary" style={{ background: '#10b981', color: '#ffffff' }}>
                <span>Partner With Us</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <Link href="/contact" className="btn-ghost-white">
                <span>Contact Events Desk</span>
                <i className="fa-solid fa-envelope"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
