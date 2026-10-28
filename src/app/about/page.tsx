import { Metadata } from 'next';
import Link from 'next/link';
import { GreenFocusAccordion, AccordionPillar } from '@/components/AboutFocusAccordions';
import { getTeamMembers, getFocusAreas } from '@/db';

export const metadata: Metadata = {
  title: 'About Us – Alliance for Empowering Rural Communities (AERC)',
  description:
    'Learn about the mission, vision, strategic focus areas, and team behind the Alliance for Empowering Rural Communities in Ghana.',
};

const environmentPillars: AccordionPillar[] = [
  {
    id: 'env-1',
    title: 'Community-Led Adaptation',
    summary:
      'We believe lasting climate solutions must be owned and led by the communities they serve. We strengthen local leadership, build adaptive capacity, and ensure grassroots knowledge informs policy and practice. From training climate champions to supporting community-driven projects, we help people take charge of their resilience journey.',
  },
  {
    id: 'env-2',
    title: 'Nature-Based Solutions',
    summary:
      'Healthy ecosystems are the foundation of climate resilience. We restore degraded lands, preserve biodiversity, and promote adaptation strategies rooted in nature. By protecting forests, wetlands, and mangroves, we strengthen natural defenses against climate impacts while creating livelihood opportunities for local communities.',
  },
  {
    id: 'env-3',
    title: 'Urban & Infrastructure Development',
    summary:
      'We promote inclusive, climate-resilient infrastructure that safeguards lives and livelihoods while supporting sustainable growth. This includes urban planning with green spaces, sustainable transport, and adaptive designs that protect vulnerable communities.',
  },
  {
    id: 'env-4',
    title: 'Plastics & Waste Management',
    summary:
      'Plastic pollution and poor waste management threaten both people and ecosystems. We reduce plastic use, promote sustainable consumption, and advocate for producer responsibility. Through education, clean-ups, waste segregation, and circular economy initiatives, we turn waste into resources, protect ecosystems, and reduce greenhouse gas emissions.',
  },
];

const energyPillars: AccordionPillar[] = [
  {
    id: 'energy-1',
    title: 'Fossil Fuel Finance Accountability',
    summary:
      'We push for public and private investments to move away from fossil fuels toward sustainable and just alternatives. By tracking and challenging harmful energy financing, we accelerate the shift to a low-carbon future.',
  },
  {
    id: 'energy-2',
    title: 'Critical Raw Materials',
    summary:
      'The green transition relies on critical minerals, but extraction must not harm communities or the environment. We promote transparent, fair, and sustainable sourcing practices, ensuring benefits for local people and safeguarding ecosystems through responsible governance.',
  },
  {
    id: 'energy-3',
    title: 'Renewable Energy',
    summary:
      'Clean, affordable, and reliable energy is essential for poverty reduction and equitable development. We champion decentralized renewable energy systems that power homes, schools, and businesses, reducing fossil fuel dependence while creating economic opportunities in rural areas.',
  },
];

const teamMembers = [
  {
    name: 'Desmond Sena Kofi Foe',
    role: 'Executive Director',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/DESMOND.jpg',
  },
  {
    name: 'Carlisle Naa Dodua Dodoo',
    role: 'Communications and Media Officer',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/DODOA-1.jpg',
  },
  {
    name: 'Nicholas Selady Sekpey',
    role: 'Energy Officer',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/1.jpg',
  },
  {
    name: 'Sandra Efua Attah Dickson',
    role: 'Climate Officer',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/WhatsApp-Image-2026-05-25-at-2.38.19-PM-e1779720138791.jpeg',
  },
  {
    name: 'Yvette Ahenkorah',
    role: 'Finance and Admin Manager',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/YVETTE-1.jpg',
  },
  {
    name: 'Siisi Ansah',
    role: 'Volunteer Advocate',
    image: 'https://aercghana.org/wp-content/uploads/2025/07/SIISI-1.jpg',
  },
];

export default async function AboutPage() {
  const [dynamicMembers, allFocusAreas] = await Promise.all([
    getTeamMembers(),
    getFocusAreas(),
  ]);
  const displayTeam = dynamicMembers.length > 0 ? dynamicMembers : teamMembers;

  const activeFocusAreas = allFocusAreas.filter((fa) => (fa.status || 'active') === 'active');
  const envAreas = activeFocusAreas.filter((fa) => fa.parentPillar === 'Environment & Climate');
  const energyAreas = activeFocusAreas.filter((fa) => fa.parentPillar === 'Energy Transition');

  const displayEnvPillars: AccordionPillar[] = envAreas.length > 0
    ? envAreas.map((fa) => ({
        id: fa.slug,
        title: fa.title,
        summary: fa.summary,
        slug: fa.slug,
      }))
    : environmentPillars;

  const displayEnergyPillars: AccordionPillar[] = energyAreas.length > 0
    ? energyAreas.map((fa) => ({
        id: fa.slug,
        title: fa.title,
        summary: fa.summary,
        slug: fa.slug,
      }))
    : energyPillars;

  return (
    <>
      {/* 1. BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">About Us</h1>
          <ul className="breadcrumb-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <span>About Us</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 2. WHO WE ARE & HOW WE WORK */}
      <section className="about-section" style={{ padding: '80px 0 60px' }}>
        <div className="container">
          <div className="about-intro-grid">
            {/* Visual Column */}
            <div className="live-image-frame reveal-from-left">
              <img
                src="/images/about/focus-environment.png"
                alt="AERC Community Action - Training, Workshops and Recognition"
                style={{ width: '100%', display: 'block', maxHeight: '580px', objectFit: 'cover' }}
              />
            </div>

            {/* Content Column */}
            <div className="about-text-content reveal-from-right">
              <span
                style={{
                  display: 'inline-block',
                  color: '#16a34a',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.04em',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                }}
              >
                ABOUT US
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.9rem, 2.8vw, 2.5rem)',
                  fontWeight: 800,
                  color: 'var(--text-heading)',
                  lineHeight: 1.25,
                  marginBottom: '20px',
                  letterSpacing: '-0.02em',
                }}
              >
                Alliance for Empowering Rural Communities (AERC)
              </h2>
              <p
                style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.8,
                  color: 'var(--text-muted)',
                  marginBottom: '26px',
                }}
              >
                Alliance for Empowering Rural Communities (AERC) is a legally registered,
                youth-led, community-driven nonprofit based in Ghana, Africa. We work at the
                intersection of environment, climate, and energy justice, empowering rural and
                marginalized communities to lead in shaping climate and development solutions.
              </p>

              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--text-heading)',
                  marginBottom: '14px',
                }}
              >
                How We Work
              </h3>
              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.8,
                  color: 'var(--text-muted)',
                  marginBottom: '16px',
                }}
              >
                Our work drives climate resilience and a just energy transition by empowering
                communities to act on the frontlines of change. In Environment &amp; Climate, we
                advance community-led adaptation, restore ecosystems through nature-based
                solutions, and promote sustainable urban and rural infrastructure that withstands
                climate shocks. In Energy Transition, we challenge fossil fuel finance, advocate
                for the responsible extraction of critical raw materials, and expand access to
                affordable, renewable energy.
              </p>
              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.8,
                  color: 'var(--text-muted)',
                  margin: 0,
                }}
              >
                Through training, policy advocacy, research, and grassroots partnerships, we not
                only equip communities with the skills and tools to adapt but also amplify their
                voices in decision-making spaces. As a result, rural and marginalized communities
                are building resilience, safeguarding their environment, and shaping a future
                that is just, sustainable, and led by the people most impacted by climate change.
              </p>
            </div>
          </div>

          {/* 3. EARTH DAY FULL-WIDTH BANNER STRIP */}
          <div className="earth-day-strip reveal-zoom" style={{ marginTop: '70px', marginBottom: '80px' }}>
            <img
              src="/images/about/earth-day-banner.jpg"
              alt="AERC Earth Day Youth & Community Action"
            />
          </div>

          {/* 4. FOCUS AREA 1: ENVIRONMENT & CLIMATE */}
          <div className="about-focus-row" style={{ alignItems: 'flex-start', marginBottom: '80px' }}>
            {/* Visual Column */}
            <div className="live-image-frame reveal-from-left">
              <img
                src="/images/about/focus-energy.jpg"
                alt="Our Focus Areas and Strategic Pillars - Wind Turbines and Clean Energy"
                style={{ width: '100%', display: 'block', maxHeight: '580px', objectFit: 'cover' }}
              />
            </div>

            {/* Content & Accordion */}
            <div className="about-focus-content reveal-from-right">
              <span
                style={{
                  display: 'inline-block',
                  color: '#16a34a',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  letterSpacing: '0.04em',
                  marginBottom: '8px',
                }}
              >
                Alliance for Empowering Rural Communities (AERC)
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 2.6vw, 2.4rem)',
                  fontWeight: 800,
                  color: 'var(--text-heading)',
                  lineHeight: 1.25,
                  marginBottom: '16px',
                  letterSpacing: '-0.02em',
                }}
              >
                Our Focus Areas and Strategic Pillars
              </h2>
              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.75,
                  color: 'var(--text-muted)',
                  marginBottom: '28px',
                }}
              >
                At AERC, our work is built around two interconnected focus areas: Environment &amp;
                Climate and Energy Transition, each guided by strategic pillars that shape our
                programs, partnerships, and advocacy. Together, they reflect our commitment to
                climate justice, community empowerment, and sustainable development.
              </p>

              <GreenFocusAccordion pillars={displayEnvPillars} defaultOpenId={displayEnvPillars[0]?.id} />
            </div>
          </div>

          {/* 5. FOCUS AREA 2: ENERGY TRANSITION */}
          <div className="about-focus-row" style={{ alignItems: 'flex-start', marginBottom: '80px' }}>
            {/* Visual Column */}
            <div className="live-image-frame reveal-from-left">
              <img
                src="/images/about/who-we-are.jpg"
                alt="Energy Transition Action - Plastic Reduction and Community Movement"
                style={{ width: '100%', display: 'block', maxHeight: '580px', objectFit: 'cover' }}
              />
            </div>

            {/* Content & Accordion */}
            <div className="about-focus-content reveal-from-right">
              <span
                style={{
                  display: 'inline-block',
                  color: '#16a34a',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  letterSpacing: '0.04em',
                  marginBottom: '8px',
                }}
              >
                Alliance for Empowering Rural Communities (AERC)
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 2.6vw, 2.4rem)',
                  fontWeight: 800,
                  color: 'var(--text-heading)',
                  lineHeight: 1.25,
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                }}
              >
                Energy Transition
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: 'var(--text-muted)',
                  marginBottom: '28px',
                }}
              >
                We advance an equitable shift from fossil fuels to clean, people-centered energy
                systems that work for all.
              </p>

              <GreenFocusAccordion pillars={displayEnergyPillars} defaultOpenId={displayEnergyPillars[0]?.id} />
            </div>
          </div>

          {/* 6. VISION & MISSION */}
          <div className="live-vm-section" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '60px' }}>
            <div className="live-vm-grid">
              {/* Text Left */}
              <div className="live-vm-content reveal-from-left">
                <div className="live-vm-box">
                  <h3>Vision</h3>
                  <p>
                    Empowered communities with enhanced capacities to address challenges and
                    achieve self-reliance.
                  </p>
                </div>

                <div className="live-vm-box mission-box">
                  <h3>Mission</h3>
                  <p>
                    To empower local communities to build resilience to global crises and adapt
                    local actions for sustainable development.
                  </p>
                </div>
              </div>

              {/* Image Right */}
              <div className="live-vm-visual reveal-from-right">
                <img
                  src="/images/about/vision-mission-cert.jpg"
                  alt="AERC Leadership Receiving Certificate of Participation from Ministry of Environment"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OUR TEAM MEMBERS */}
      <section
        className="team-section"
        style={{ background: '#f8fafc', padding: '90px 0', borderTop: '1px solid #e2e8f0' }}
      >
        <div className="container">
          <div
            className="section-head text-center reveal-header"
            style={{ maxWidth: '780px', margin: '0 auto 56px' }}
          >
            <span
              style={{
                display: 'inline-block',
                color: '#16a34a',
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              OUR TEAM MEMBERS
            </span>
            <h2 className="sec-title" style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)' }}>
              OUR TEAM MEMBERS
            </h2>
          </div>

          <div className="live-team-grid">
            {displayTeam.slice(0, 8).map((member, idx) => (
              <div key={idx} className="live-team-card reveal-item">
                <div className="live-team-avatar">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3 className="live-team-name">{member.name}</h3>
                <span className="live-team-role">{member.role}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              href="/team"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 30px' }}
            >
              <span>Explore Full Team &amp; Leadership Roster</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section style={{ padding: '80px 0 96px', background: 'var(--white)' }}>
        <div className="container">
          <div className="about-cta-box reveal-header">
            <div className="about-cta-content">
              <h2>Join Us in Empowering Frontline Communities</h2>
              <p>
                Whether you represent an international partner, grassroots initiative, or are
                passionate about volunteering for climate and energy justice, we welcome your
                collaboration.
              </p>
            </div>
            <div className="about-cta-actions">
              <Link href="/partner" className="btn-primary">
                Partner With Us <i className="fa-solid fa-arrow-right"></i>
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get In Touch <i className="fa-solid fa-envelope"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
