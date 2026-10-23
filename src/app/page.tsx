import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import FocusAccordion from '@/components/FocusAccordion';
import LatestPublicationsSlider from '@/components/LatestPublicationsSlider';
import { getProjects, getBlogPosts } from '@/db';

export const dynamic = 'force-dynamic';

const teamMembers = [
  {
    name: 'Desmond Sena Kofi Foe',
    role: 'Executive Director',
    image: '/images/team/desmond.jpg',
    facebook: 'https://facebook.com/aercgh',
    twitter: 'https://twitter.com/aercgh',
    linkedin: 'https://linkedin.com/company/alliance-for-empowering-rural-communities',
  },
  {
    name: 'Carlisle Naa Dodua Dodoo',
    role: 'Community-Led Adaptation Lead',
    image: '/images/team/carlisle.jpg',
    facebook: 'https://facebook.com/aercgh',
    twitter: 'https://twitter.com/aercgh',
    linkedin: 'https://linkedin.com/company/alliance-for-empowering-rural-communities',
  },
  {
    name: 'Nicholas Selady Sekpey',
    role: 'Renewable Energy Lead',
    image: '/images/team/nicholas.jpg',
    facebook: 'https://facebook.com/aercgh',
    twitter: 'https://twitter.com/aercgh',
    linkedin: 'https://linkedin.com/company/alliance-for-empowering-rural-communities',
  },
  {
    name: 'Sandra Efua Attah Dickson',
    role: 'Nature-Based Solutions Lead',
    image: '/images/team/sandra.jpeg',
    facebook: 'https://facebook.com/aercgh',
    twitter: 'https://twitter.com/aercgh',
    linkedin: 'https://linkedin.com/company/alliance-for-empowering-rural-communities',
  },
  {
    name: 'Yvette Ahenkorah',
    role: 'Urban and Infrastructure Lead',
    image: '/images/team/yvette.jpg',
    facebook: 'https://facebook.com/aercgh',
    twitter: 'https://twitter.com/aercgh',
    linkedin: 'https://linkedin.com/company/alliance-for-empowering-rural-communities',
  },
  {
    name: 'Siisi Ansah',
    role: 'Volunteer',
    image: '/images/team/siisi.jpg',
    facebook: 'https://facebook.com/aercgh',
    twitter: 'https://twitter.com/aercgh',
    linkedin: 'https://linkedin.com/company/alliance-for-empowering-rural-communities',
  },
];

export default async function HomePage() {
  const [allProjects, allBlogs] = await Promise.all([
    getProjects(),
    getBlogPosts(),
  ]);

  const featuredProjects = allProjects.slice(0, 6);
  const recentArticles = allBlogs.slice(0, 3);

  return (
    <>
      {/* 1. CINEMATIC HERO SLIDER */}
      <HeroSlider />

      {/* 2. STRATEGIC FOCUS AREAS & PILLARS */}
      <section className="focus-stage" id="focus">
        <div className="container">
          <div className="focus-stage-layout">
            {/* Left Column: Authentic Community Imagery with Premium Framing */}
            <div className="focus-visual-col reveal-from-left">
              <div className="focus-image-frame">
                <div className="focus-glow-backdrop"></div>
                <img
                  src="/images/rrrr.png"
                  alt="Alliance for Empowering Rural Communities (AERC) Community Action"
                  className="focus-main-img"
                />
                
                {/* Floating Glassmorphic Top Badge */}
                <div className="focus-floating-top-pill">
                  <span className="pulse-dot"></span>
                  <span>Grassroots Action Across Ghana</span>
                </div>

                {/* Floating Bottom Card */}
                <div className="focus-floating-bottom-card">
                  <div className="focus-floating-icon">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <div>
                    <strong>Youth &amp; Community-Led</strong>
                    <span>Frontline advocacy for climate justice &amp; energy equity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Heading, Subtitle & Interactive Accordion */}
            <div className="focus-content-col">
              <div className="focus-header reveal-from-right">
                <span className="badge-pill">
                  <i className="fa-solid fa-shapes"></i> Alliance for Empowering Rural Communities (AERC)
                </span>
                <h2 className="section-title" style={{ textAlign: 'left', marginTop: '14px', marginBottom: '14px' }}>
                  Our Focus Areas and Strategic Pillars
                </h2>
                <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 28px 0', maxWidth: '100%' }}>
                  AERC focuses on <strong>Environment &amp; Climate</strong> and <strong>Energy Transition</strong>, driving climate justice, community empowerment, and sustainable development.
                </p>
              </div>

              <FocusAccordion />
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW WE WORK / OBJECTIVES */}
      <section className="methodology-stage">
        <div className="container">
          <div className="section-head reveal-header">
            <span className="badge-pill">
              <i className="fa-solid fa-route"></i> HOW WE WORK
            </span>
            <h2 className="section-title">We Work Together For Bettering Tomorrow</h2>
          </div>

          <div className="methodology-two-col">
            <div className="methodology-visual reveal-from-left">
              <img 
                src="/images/bettering-tomorrow.jpg" 
                alt="AERC Community Action and Leadership" 
              />
              <div className="methodology-visual-badge">
                <i className="fa-solid fa-seedling"></i>
                <div className="methodology-visual-badge-text">
                  <strong>Frontline African Leadership</strong>
                  <span>Bridging grassroots realities with national and global decision-making</span>
                </div>
              </div>
            </div>

            <div className="methodology-content reveal-from-right">
              <p className="methodology-lead-text">
                Through policy advocacy, research, and training, we bridge grassroots realities with national and global decision-making. We amplify community voices, strengthen local leadership, and connect our partners to the knowledge, resources, and networks that drive change. Every project we undertake reflects our belief that rural communities are not just beneficiaries, they are leaders in building a just, resilient, and sustainable future for all.
              </p>

              <div className="objectives-grid">
                <div className="objective-item">
                  <div className="objective-num-box">01</div>
                  <div>
                    <span className="objective-label">Objective</span>
                    <h4 className="objective-title">
                      Advance a Just and Inclusive Energy Transition
                    </h4>
                  </div>
                </div>

                <div className="objective-item">
                  <div className="objective-num-box">02</div>
                  <div>
                    <span className="objective-label">Objective</span>
                    <h4 className="objective-title">
                      Strengthen Community-Led Climate and Environmental Resilience
                    </h4>
                  </div>
                </div>

                <div className="objective-item">
                  <div className="objective-num-box">03</div>
                  <div>
                    <span className="objective-label">Objective</span>
                    <h4 className="objective-title">
                      Empower and Engage Communities in Decision-Making
                    </h4>
                  </div>
                </div>

                <div className="objective-item">
                  <div className="objective-num-box">04</div>
                  <div>
                    <span className="objective-label">Objective</span>
                    <h4 className="objective-title">
                      Foster Local Ownership for Sustainable Development
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR RECENT PROJECTS */}
      <section className="projects-stage" id="projects">
        <div className="container">
          <div className="reveal-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="badge-pill">
                <i className="fa-solid fa-hands-holding-circle"></i> COMPLETED PROJECT
              </span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>OUR RECENT PROJECTS</h2>
            </div>
            <Link href="/projects" className="btn-secondary">
              <span>View All Projects</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="projects-card-grid">
            {featuredProjects.map((project) => (
              <article key={project.id} className="project-modern-card">
                <div className="project-card-cover">
                  <img src={project.coverImage} alt={project.title} />
                  <span className="project-tag-pill">{project.tag}</span>
                </div>
                <div className="project-card-body">
                  <h3 className="project-card-title">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="project-card-text">
                    {project.summary}
                  </p>
                  <Link href={`/projects/${project.slug}`} className="project-card-btn">
                    <span>Read More</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR AWESOME TEAM */}
      <section className="team-stage" id="team">
        <div className="container">
          <div className="section-head text-center reveal-header">
            <span className="badge-pill">
              <i className="fa-solid fa-user-group"></i> OUR TEAM MEMBERS
            </span>
            <h2 className="section-title">Our Awesome Team</h2>
            <p className="section-subtitle">
              Meet the passionate practitioners, organizers, and policy advocates leading frontline change across Ghana.
            </p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-card-image-wrap">
                  <img src={member.image} alt={member.name} />
                  <div className="team-social-overlay">
                    <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="team-social-icon" aria-label="Facebook">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="team-social-icon" aria-label="Twitter">
                      <i className="fa-brands fa-x-twitter"></i>
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="team-social-icon" aria-label="LinkedIn">
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                <div className="team-card-body">
                  <h3 className="team-card-name">{member.name}</h3>
                  <span className="team-card-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LATEST PUBLICATIONS (MODIFIED SWIPING SLIDER) */}
      <LatestPublicationsSlider publications={allBlogs} />
    </>
  );
}
