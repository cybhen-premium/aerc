import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Youth Climate Joy and Healing Festival 2026 (Event Recap) – AERCGH',
  description: 'Event Recap & Highlights: Youth Climate Joy and Healing Festival 2026. Held on 14–15 August 2026 at the University of Environment and Sustainable Development, Somanya.',
};

export default function FestivalPage() {
  return (
    <>
      {/* BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Youth Climate Joy and Healing Festival 2026</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Festival 2026 (Recap)</span></li>
          </ul>
        </div>
      </section>

      {/* FESTIVAL CONTENT SECTION */}
      <section style={{ padding: '90px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '50px', alignItems: 'start' }}>
            {/* Left: Main Festival Narrative */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className="sub-title" style={{ color: '#d97706', fontWeight: 700, letterSpacing: '1px', margin: 0 }}>
                  <i className="fa-solid fa-flag-checkered"></i> PAST FLAGSHIP EVENT
                </span>
                <span style={{ background: '#ecfdf5', color: '#16a34a', border: '1px solid #bbf7d0', padding: '3px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700 }}>
                  CONCLUDED
                </span>
              </div>

              <h2 style={{ fontSize: '2.3rem', lineHeight: 1.3, color: 'var(--primary-dark)', marginBottom: '8px' }}>
                Youth Climate Joy and Healing Festival 2026
              </h2>
              <h3 style={{ fontSize: '1.35rem', color: '#2e7d32', fontWeight: 500, marginBottom: '25px' }}>
                Reimagining Climate Action Through Joy, Healing and Collective Hope
              </h3>

              {/* Banner Image */}
              <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', marginBottom: '35px' }}>
                <img src="/images/festival-banner.jpg" alt="Youth Climate Joy and Healing Festival 2026 Banner" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
              </div>

              {/* Highlight Event Pill Box - Concluded State */}
              <div style={{ background: '#f8fafc', borderLeft: '4px solid #16a34a', borderRadius: '8px', padding: '22px 25px', marginBottom: '35px', display: 'flex', flexWrap: 'wrap', gap: '25px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className="fa-solid fa-calendar-check" style={{ color: '#16a34a', fontSize: '1.5rem' }}></i>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Event Dates</span>
                    <strong style={{ color: 'var(--primary-dark)', fontSize: '1.05rem' }}>14–15 August 2026 (Concluded)</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: '#16a34a', fontSize: '1.5rem' }}></i>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Venue</span>
                    <strong style={{ color: 'var(--primary-dark)', fontSize: '1.05rem' }}>Univ. of Environment &amp; Sustainable Dev., Somanya</strong>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', padding: '10px 18px', borderRadius: '6px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-lock"></i> REGISTRATION CLOSED
                  </span>
                </div>
              </div>

              {/* Retrospective Text */}
              <div style={{ color: 'var(--text-dark)', lineHeight: 1.85, fontSize: '1.02rem' }}>
                <p style={{ marginBottom: '20px' }}>
                  Climate change is not only transforming ecosystems, livelihoods, and frontline communities; it deeply affects how young people feel about themselves, their mental wellbeing, and the future world they are inheriting.
                </p>
                <p style={{ marginBottom: '20px' }}>
                  Across Ghana, youth leaders have continually responded to the climate crisis with courage, creativity, and steadfast determination. They organize communities, spearhead grassroots initiatives, and demand institutional accountability. Yet behind this visible commitment is an emotional reality that is too often overlooked: carrying the disproportionate burden of global climate uncertainty without adequate spaces for collective care.
                </p>
                <p style={{ marginBottom: '25px' }}>
                  The <strong>Youth Climate Joy and Healing Festival 2026</strong> was organized by the <strong>Alliance for Empowering Rural Communities (AERC Ghana)</strong> on 14–15 August 2026 to change this reality. The flagship gathering convened youth leaders, frontline organizers, artists, and wellness practitioners at the University of Environment and Sustainable Development for two days of authentic connection, reflective dialogue, and creative rejuvenation.
                </p>

                <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', margin: '35px 0 16px' }}>Why Climate Joy and Healing Matter</h3>
                <p style={{ marginBottom: '20px' }}>
                  Joy does not mean ignoring the severity of the climate emergency. Healing does not mean withdrawing from frontline struggles. Instead, both cultivate the emotional endurance, social solidarity, and renewed purpose essential for sustained advocacy over time.
                </p>
                <p style={{ marginBottom: '25px' }}>
                  A movement that constantly demands personal sacrifice without offering community restoration risks burning out its most passionate voices. True climate resilience requires emotional safety nets alongside technical expertise and policy campaigning.
                </p>

                <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', margin: '35px 0 20px' }}>Major Thematic Pillars Explored</h3>
                
                <div style={{ background: '#fafcfb', border: '1px solid #eef2f0', borderRadius: '8px', padding: '25px', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                    <i className="fa-solid fa-heart-pulse" style={{ color: '#16a34a', marginRight: '8px' }}></i> 1. Wellbeing &amp; Navigating Eco-Anxiety
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    Participants addressed the lived emotional impacts of the climate crisis, examining activist fatigue, grief, and burnout. Facilitated wellbeing sessions guided youth advocates through establishing healthy personal boundaries and building collective resilience frameworks.
                  </p>
                </div>

                <div style={{ background: '#fafcfb', border: '1px solid #eef2f0', borderRadius: '8px', padding: '25px', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                    <i className="fa-solid fa-palette" style={{ color: '#16a34a', marginRight: '8px' }}></i> 2. Creative Expression &amp; Storytelling
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    Beyond data points and treaties, art, music, spoken word, and photography conveyed the human essence of climate change. Attendees engaged in workshops showing how cultural expression dismantles despair and mobilizes grassroots solidarity.
                  </p>
                </div>

                <div style={{ background: '#fafcfb', border: '1px solid #eef2f0', borderRadius: '8px', padding: '25px', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                    <i className="fa-solid fa-people-arrows" style={{ color: '#16a34a', marginRight: '8px' }}></i> 3. Peer Solidarity &amp; Cross-Movement Networks
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    Young organizers connected across regional and institutional boundaries, forging genuine friendships, sharing grassroots tactics, and laying foundations for cross-sector collaborations.
                  </p>
                </div>

                <div style={{ background: '#fafcfb', border: '1px solid #eef2f0', borderRadius: '8px', padding: '25px', marginBottom: '30px' }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                    <i className="fa-solid fa-seedling" style={{ color: '#16a34a', marginRight: '8px' }}></i> 4. Community-Led Action Pathways
                  </h4>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    Rest and rejuvenation were translated into pragmatic action plans: decentralized composting, clean cooking advocacy, local waste-picker inclusion, and district-level policy mobilization.
                  </p>
                </div>

                <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', margin: '35px 0 16px' }}>What the Festival Achieved</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <li>Raised institutional awareness regarding the critical links between climate justice and youth mental health.</li>
                  <li>Created an open, restorative space where participants candidly discussed climate grief and emotional fatigue.</li>
                  <li>Equipped over a hundred young practitioners with actionable tools for holistic wellbeing.</li>
                  <li>Amplified grassroots storytelling and art as powerful vehicles for climate communication.</li>
                  <li>Strengthened peer networks across universities, rural community groups, and national NGOs.</li>
                  <li>Reinforced AERC’s vision of a caring, resilient, and inclusive youth climate movement across Ghana.</li>
                </ul>

                {/* Retrospective Forward-Looking Banner */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '38px', textAlign: 'center', margin: '40px 0' }}>
                  <h4 style={{ fontSize: '1.35rem', color: 'var(--slate-900)', marginBottom: '12px' }}>
                    Stay Connected With Ongoing Frontline Initiatives
                  </h4>
                  <p style={{ color: 'var(--slate-600)', maxWidth: '620px', margin: '0 auto 24px', fontSize: '0.98rem', lineHeight: 1.7 }}>
                    While the 2026 Festival has concluded, our community climate resilience, zero-waste programs, and clean energy projects are actively running across Ghana.
                  </p>
                  <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/projects" className="btn-primary">
                      <span>Explore Active Projects</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                    <Link href="/partner" className="btn-secondary">
                      <span>Partner With Us</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <aside className="sidebar-col">
              {/* Event Summary Box */}
              <div className="sidebar-widget" style={{ background: '#fbfdfc', border: '1px solid #e2eee6', borderRadius: '8px', padding: '30px', marginBottom: '30px' }}>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '20px', borderBottom: '2px solid #16a34a', paddingBottom: '10px' }}>
                  Event Record
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
                  <li><strong>Status:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>Successfully Concluded</span></li>
                  <li><strong>Dates Held:</strong> 14–15 August 2026</li>
                  <li><strong>Organizer:</strong> AERC Ghana</li>
                  <li><strong>Host Campus:</strong> UESD, Somanya</li>
                  <li><strong>Participants:</strong> Youth leaders, organizers, creatives &amp; practitioners</li>
                  <li><strong>Registration:</strong> Closed</li>
                </ul>
                <div style={{ marginTop: '25px' }}>
                  <Link href="/contact" style={{ display: 'block', textAlign: 'center', background: 'var(--primary-dark)', color: 'white', padding: '12px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none' }}>
                    Inquire About Future Editions
                  </Link>
                </div>
              </div>

              {/* Share Widget */}
              <div className="sidebar-widget" style={{ background: '#ffffff', border: '1px solid #eef2f0', borderRadius: '8px', padding: '30px', marginBottom: '30px' }}>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '15px' }}>Share Highlights</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a href="https://www.facebook.com/sharer/sharer.php?u=https://aercghana.org" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#3b5998', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="https://twitter.com/intent/tweet?url=https://aercghana.org" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#1da1f2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><i className="fa-brands fa-twitter"></i></a>
                  <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://aercghana.org" target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0077b5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}><i className="fa-brands fa-linkedin-in"></i></a>
                </div>
              </div>

              {/* Quick Contact Box */}
              <div className="sidebar-widget" style={{ background: '#ffffff', border: '1px solid #eef2f0', borderRadius: '8px', padding: '30px' }}>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '12px' }}>Questions?</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '15px' }}>
                  Reach out to our event coordination team at <a href="mailto:info@aercghana.net" style={{ color: '#16a34a', fontWeight: 600 }}>info@aercghana.net</a>.
                </p>
                <Link href="/contact" style={{ color: 'var(--primary-dark)', fontWeight: 600, textDecoration: 'none', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Contact Us <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
