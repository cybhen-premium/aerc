import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import FocusAccordion from '@/components/FocusAccordion';
import LatestPublicationsSlider from '@/components/LatestPublicationsSlider';
import {
  getHomepageSettings,
  getProjects,
  getBlogPosts,
  getFocusAreas,
  getTeamMembers,
  getPublications,
} from '@/db';
import {
  HomepageSectionConfig,
  ImpactStatItem,
  ObjectiveItem,
  PartnerItem,
  defaultHomepageSections,
  defaultImpactStats,
  defaultAboutObjectives,
  defaultPartners,
} from '@/db/seed-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [homepageSettings, allProjects, allBlogs, allFocusAreas, allTeam, allPublications] =
    await Promise.all([
      getHomepageSettings(),
      getProjects(),
      getBlogPosts(),
      getFocusAreas(),
      getTeamMembers(),
      getPublications(),
    ]);

  // 1. Sections sequencing and active filtering
  const sections: HomepageSectionConfig[] = (() => {
    try {
      if (homepageSettings.sectionsConfig) {
        const parsed = JSON.parse(homepageSettings.sectionsConfig);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error parsing sectionsConfig:', e);
    }
    return defaultHomepageSections;
  })();

  const activeSections = [...sections]
    .filter((s) => s.isEnabled)
    .sort((a, b) => a.order - b.order);

  // 2. Parse Impact Statistics (strictly verified only)
  const impactStats: ImpactStatItem[] = (() => {
    try {
      if (homepageSettings.impactStatsJson) {
        const parsed = JSON.parse(homepageSettings.impactStatsJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error parsing impactStatsJson:', e);
    }
    return defaultImpactStats;
  })();

  const verifiedStats = impactStats.filter((st) => st.verified && st.show);
  const showImpactSection =
    homepageSettings.displayImpactStats === 'yes' && verifiedStats.length > 0;

  // 3. Parse Strategic Objectives
  const aboutObjectives: ObjectiveItem[] = (() => {
    try {
      if (homepageSettings.aboutObjectivesJson) {
        const parsed = JSON.parse(homepageSettings.aboutObjectivesJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error parsing aboutObjectivesJson:', e);
    }
    return defaultAboutObjectives;
  })();

  // 4. Parse Strategic Partners
  const partnersList: PartnerItem[] = (() => {
    try {
      if (homepageSettings.partnersJson) {
        const parsed = JSON.parse(homepageSettings.partnersJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error parsing partnersJson:', e);
    }
    return defaultPartners;
  })();

  // 5. Featured Projects Filter
  const publicProjects = allProjects.filter(
    (p) => p.isPublic !== 'no' && p.status !== 'Archived'
  );
  let featuredProjectIds: number[] = [];
  try {
    if (homepageSettings.featuredProjectIds) {
      featuredProjectIds = JSON.parse(homepageSettings.featuredProjectIds);
    }
  } catch (e) {
    console.error('Error parsing featuredProjectIds:', e);
  }

  const featuredProjects =
    featuredProjectIds.length > 0
      ? publicProjects.filter((p) => featuredProjectIds.includes(p.id))
      : publicProjects.slice(0, 4);

  // 6. Featured Focus Areas Filter
  let featuredFocusAreaIds: number[] = [];
  try {
    if (homepageSettings.featuredFocusAreaIds) {
      featuredFocusAreaIds = JSON.parse(homepageSettings.featuredFocusAreaIds);
    }
  } catch (e) {
    console.error('Error parsing featuredFocusAreaIds:', e);
  }

  const activeFocusAreas =
    featuredFocusAreaIds.length > 0
      ? allFocusAreas.filter((fa) => featuredFocusAreaIds.includes(fa.id))
      : allFocusAreas;

  // 7. Featured News Articles Filter
  let featuredArticleIds: number[] = [];
  try {
    if (homepageSettings.featuredArticleIds) {
      featuredArticleIds = JSON.parse(homepageSettings.featuredArticleIds);
    }
  } catch (e) {
    console.error('Error parsing featuredArticleIds:', e);
  }

  const featuredArticles =
    featuredArticleIds.length > 0
      ? allBlogs.filter((b) => featuredArticleIds.includes(b.id))
      : allBlogs.slice(0, 3);

  // 8. Featured Publications Filter
  let featuredPublicationIds: number[] = [];
  try {
    if (homepageSettings.featuredPublicationIds) {
      featuredPublicationIds = JSON.parse(homepageSettings.featuredPublicationIds);
    }
  } catch (e) {
    console.error('Error parsing featuredPublicationIds:', e);
  }

  const featuredPublications =
    featuredPublicationIds.length > 0
      ? allPublications.filter((pub) => featuredPublicationIds.includes(pub.id))
      : allPublications.slice(0, 4);

  // 9. Featured Team Members Filter
  let featuredTeamIds: number[] = [];
  try {
    if (homepageSettings.featuredTeamIds) {
      featuredTeamIds = JSON.parse(homepageSettings.featuredTeamIds);
    }
  } catch (e) {
    console.error('Error parsing featuredTeamIds:', e);
  }

  const activeTeam = allTeam.filter((t) => t.status === 'active');
  const featuredTeam =
    featuredTeamIds.length > 0
      ? activeTeam.filter((t) => featuredTeamIds.includes(t.id))
      : activeTeam.slice(0, 6);

  // Render Section Helper
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      // -----------------------------------------------------------------------
      // 1. HERO BANNER
      // -----------------------------------------------------------------------
      case 'hero':
        return (
          <HeroSlider
            key="hero"
            customSlide={{
              tag: homepageSettings.heroTag,
              titlePrefix: homepageSettings.heroHeadlinePrefix,
              highlight: homepageSettings.heroHighlight,
              description: homepageSettings.heroIntroduction,
              bg: homepageSettings.heroBgImage,
              ctaPrimaryText: homepageSettings.heroCtaPrimaryText,
              ctaPrimaryLink: homepageSettings.heroCtaPrimaryLink,
              ctaSecondaryText: homepageSettings.heroCtaSecondaryText,
              ctaSecondaryLink: homepageSettings.heroCtaSecondaryLink,
            }}
            metrics={
              verifiedStats.length > 0
                ? verifiedStats.slice(0, 4).map((s) => ({ label: s.label, value: s.value }))
                : undefined
            }
          />
        );

      // -----------------------------------------------------------------------
      // 2. INTRODUCTION TO AERC GHANA
      // -----------------------------------------------------------------------
      case 'intro':
        return (
          <section key="intro" className="intro-stage" id="intro">
            <div className="container">
              <div className="intro-two-col">
                <div className="intro-visual reveal-from-left">
                  <img
                    src={homepageSettings.introImage || '/images/about/who-we-are.jpg'}
                    alt="Who We Are - AERC Ghana"
                  />
                  <div className="intro-floating-badge">
                    <div className="intro-floating-icon">
                      <i className="fa-solid fa-leaf"></i>
                    </div>
                    <div>
                      <strong className="block text-sm">Grassroots Climate Justice</strong>
                      <span className="text-xs text-slate-300">
                        Frontline empowerment across Ghanaian rural communities
                      </span>
                    </div>
                  </div>
                </div>

                <div className="intro-content reveal-from-right">
                  <span className="badge-pill">
                    <i className="fa-solid fa-seedling"></i>{' '}
                    {homepageSettings.introBadge || 'ABOUT AERC GHANA'}
                  </span>
                  <h2
                    className="section-title"
                    style={{ textAlign: 'left', marginTop: '16px', marginBottom: '16px' }}
                  >
                    {homepageSettings.introHeading}
                  </h2>
                  <p className="intro-content-lead">{homepageSettings.introContent}</p>

                  <div style={{ marginTop: '28px' }}>
                    <Link href="/about" className="btn-secondary">
                      <span>Learn More About Us</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      // -----------------------------------------------------------------------
      // 3. STRATEGIC FOCUS AREAS & PILLARS
      // -----------------------------------------------------------------------
      case 'focus':
        return (
          <section key="focus" className="focus-stage" id="focus">
            <div className="container">
              <div className="focus-stage-layout">
                {/* Left Visual Column */}
                <div className="focus-visual-col reveal-from-left">
                  <div className="focus-image-frame">
                    <div className="focus-glow-backdrop"></div>
                    <img
                      src={homepageSettings.focusImage || '/images/rrrr.png'}
                      alt="AERC Strategic Focus Areas"
                      className="focus-main-img"
                    />

                    <div className="focus-floating-top-pill">
                      <span className="pulse-dot"></span>
                      <span>Grassroots Action Across Ghana</span>
                    </div>

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

                {/* Right Content Column */}
                <div className="focus-content-col">
                  <div className="focus-header reveal-from-right">
                    <span className="badge-pill">
                      <i className="fa-solid fa-shapes"></i>{' '}
                      {homepageSettings.focusBadge || 'STRATEGIC PILLARS'}
                    </span>
                    <h2
                      className="section-title"
                      style={{ textAlign: 'left', marginTop: '14px', marginBottom: '14px' }}
                    >
                      {homepageSettings.focusHeading}
                    </h2>
                    <p
                      className="section-subtitle"
                      style={{ textAlign: 'left', margin: '0 0 28px 0', maxWidth: '100%' }}
                    >
                      {homepageSettings.focusSubtitle}
                    </p>
                  </div>

                  <FocusAccordion focusAreas={activeFocusAreas} />
                </div>
              </div>
            </div>
          </section>
        );

      // -----------------------------------------------------------------------
      // 4. ABOUT / HOW WE WORK & OBJECTIVES
      // -----------------------------------------------------------------------
      case 'about':
        return (
          <section key="about" className="methodology-stage" id="about">
            <div className="container">
              <div className="section-head reveal-header">
                <span className="badge-pill">
                  <i className="fa-solid fa-route"></i>{' '}
                  {homepageSettings.aboutBadge || 'HOW WE WORK'}
                </span>
                <h2 className="section-title">{homepageSettings.aboutHeading}</h2>
              </div>

              <div className="methodology-two-col">
                <div className="methodology-visual reveal-from-left">
                  <img
                    src={homepageSettings.aboutImage || '/images/bettering-tomorrow.jpg'}
                    alt="AERC Community Action and Leadership"
                  />
                  <div className="methodology-visual-badge">
                    <i className="fa-solid fa-seedling"></i>
                    <div className="methodology-visual-badge-text">
                      <strong>Frontline African Leadership</strong>
                      <span>Bridging grassroots realities with national decision-making</span>
                    </div>
                  </div>
                </div>

                <div className="methodology-content reveal-from-right">
                  <p className="methodology-lead-text">{homepageSettings.aboutLead}</p>

                  <div className="objectives-grid">
                    {aboutObjectives.map((obj, idx) => (
                      <div key={idx} className="objective-item">
                        <div className="objective-num-box">{obj.num}</div>
                        <div>
                          <span className="objective-label">Objective</span>
                          <h4 className="objective-title">{obj.title}</h4>
                          {obj.description && (
                            <p
                              style={{
                                fontSize: '0.85rem',
                                color: '#64748b',
                                marginTop: '4px',
                                lineHeight: '1.4',
                              }}
                            >
                              {obj.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      // -----------------------------------------------------------------------
      // 5. FEATURED PROJECTS
      // -----------------------------------------------------------------------
      case 'projects':
        return (
          <section key="projects" className="projects-stage" id="projects">
            <div className="container">
              <div
                className="reveal-header"
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  marginBottom: '48px',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                <div>
                  <span className="badge-pill">
                    <i className="fa-solid fa-hands-holding-circle"></i>{' '}
                    {homepageSettings.projectsBadge || 'ACTIVE INITIATIVES'}
                  </span>
                  <h2 className="section-title" style={{ marginBottom: 0 }}>
                    {homepageSettings.projectsHeading}
                  </h2>
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
                      <p className="project-card-text">{project.summary}</p>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="project-card-btn"
                      >
                        <span>Read More</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      // -----------------------------------------------------------------------
      // 6. VERIFIED IMPACT STATISTICS
      // -----------------------------------------------------------------------
      case 'impact':
        if (!showImpactSection) return null;
        return (
          <section key="impact" className="impact-stage" id="impact">
            <div className="impact-stage-glow"></div>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
              <div className="section-head text-center reveal-header">
                <span className="badge-pill dark">
                  <i className="fa-solid fa-shield-halved"></i> VERIFIED IMPACT DATA
                </span>
                <h2 className="section-title text-white">Our Measurable Grassroots Reach</h2>
                <p className="section-subtitle" style={{ color: '#94a3b8' }}>
                  Audited program statistics reflecting communities engaged, clean power initiatives
                  delivered, and policy resources published.
                </p>
              </div>

              <div className="impact-grid">
                {verifiedStats.map((stat) => (
                  <div key={stat.id} className="impact-card">
                    <div className="impact-card-val">{stat.value}</div>
                    <div className="impact-card-lbl">{stat.label}</div>
                    <div className="impact-card-desc">{stat.description}</div>
                    <div className="impact-card-badge">
                      <i className="fa-solid fa-check"></i>
                      <span>Verified Field Data</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      // -----------------------------------------------------------------------
      // 7. LATEST NEWS AND ARTICLES
      // -----------------------------------------------------------------------
      case 'news':
        return (
          <section key="news" className="news-stage" id="news">
            <div className="container">
              <div
                className="reveal-header"
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  marginBottom: '40px',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                <div>
                  <span className="badge-pill">
                    <i className="fa-solid fa-newspaper"></i>{' '}
                    {homepageSettings.newsBadge || 'LATEST DISPATCHES'}
                  </span>
                  <h2 className="section-title" style={{ marginBottom: 0 }}>
                    {homepageSettings.newsHeading}
                  </h2>
                </div>
                <Link href="/news" className="btn-secondary">
                  <span>View All Articles</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>

              <div className="news-card-grid">
                {featuredArticles.map((article) => (
                  <article key={article.id} className="news-modern-card">
                    <div className="news-card-cover">
                      <img src={article.coverImage || '/images/slider-1.jpg'} alt={article.title} />
                    </div>
                    <div className="news-card-body">
                      <div className="news-card-meta">
                        <span>
                          <i className="fa-regular fa-calendar"></i>{' '}
                          {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span>{article.category}</span>
                      </div>
                      <h3 className="news-card-title">
                        <Link href={`/news/${article.slug}`}>{article.title}</Link>
                      </h3>
                      <p className="news-card-excerpt">{article.excerpt}</p>
                      <Link
                        href={`/news/${article.slug}`}
                        className="project-card-btn"
                        style={{ marginTop: 'auto' }}
                      >
                        <span>Read Full Story</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      // -----------------------------------------------------------------------
      // 8. PUBLICATIONS & RESOURCES
      // -----------------------------------------------------------------------
      case 'publications':
        return (
          <section key="publications" id="publications">
            <LatestPublicationsSlider publications={allBlogs} />
          </section>
        );

      // -----------------------------------------------------------------------
      // 9. TEAM HIGHLIGHTS
      // -----------------------------------------------------------------------
      case 'team':
        return (
          <section key="team" className="team-stage" id="team">
            <div className="container">
              <div className="section-head text-center reveal-header">
                <span className="badge-pill">
                  <i className="fa-solid fa-user-group"></i>{' '}
                  {homepageSettings.teamBadge || 'OUR TEAM MEMBERS'}
                </span>
                <h2 className="section-title">{homepageSettings.teamHeading}</h2>
                <p className="section-subtitle">{homepageSettings.teamSubtitle}</p>
              </div>

              <div className="team-grid">
                {featuredTeam.map((member) => (
                  <div key={member.id} className="team-card">
                    <div className="team-card-image-wrap">
                      <img src={member.image} alt={member.name} />
                      <div className="team-social-overlay">
                        {member.facebook && (
                          <a
                            href={member.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-social-icon"
                            aria-label="Facebook"
                          >
                            <i className="fa-brands fa-facebook-f"></i>
                          </a>
                        )}
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-social-icon"
                            aria-label="Twitter"
                          >
                            <i className="fa-brands fa-x-twitter"></i>
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="team-social-icon"
                            aria-label="LinkedIn"
                          >
                            <i className="fa-brands fa-linkedin-in"></i>
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="team-social-icon"
                            aria-label="Email"
                          >
                            <i className="fa-solid fa-envelope"></i>
                          </a>
                        )}
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
        );

      // -----------------------------------------------------------------------
      // 10. PARTNERS AND SUPPORTERS
      // -----------------------------------------------------------------------
      case 'partners':
        return (
          <section key="partners" className="partners-stage" id="partners">
            <div className="container">
              <div className="section-head text-center reveal-header">
                <span className="badge-pill">
                  <i className="fa-solid fa-handshake"></i>{' '}
                  {homepageSettings.partnersBadge || 'ALLIANCES & SUPPORTERS'}
                </span>
                <h2 className="section-title">{homepageSettings.partnersHeading}</h2>
              </div>

              <div className="partners-grid">
                {partnersList.map((partner) => (
                  <div key={partner.id} className="partner-card">
                    <div className="partner-card-name">{partner.name}</div>
                    <div className="partner-card-tag">{partner.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      // -----------------------------------------------------------------------
      // 11. CALL TO ACTION
      // -----------------------------------------------------------------------
      case 'cta':
        return (
          <section key="cta" className="cta-stage" id="cta">
            <div className="container">
              <div className="cta-box reveal-header">
                <h2>{homepageSettings.ctaHeading}</h2>
                <p>{homepageSettings.ctaSubtitle}</p>
                <Link
                  href={homepageSettings.ctaButtonLink || '/partner'}
                  className="btn-primary hero-btn-main"
                  style={{ display: 'inline-flex' }}
                >
                  <span>{homepageSettings.ctaButtonText || 'Get Involved Today'}</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return <>{activeSections.map((sec) => renderSection(sec.id))}</>;
}
