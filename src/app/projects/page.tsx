import { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/db';

export const metadata: Metadata = {
  title: 'Projects – AERCGH',
  description: 'Explore our impactful initiatives driving community resilience, clean energy transitions, youth mobilization, and ecological justice in Ghana.',
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const allProjects = await getProjects();

  return (
    <>
      {/* BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Projects</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Projects</span></li>
          </ul>
        </div>
      </section>

      {/* PROJECTS GRID SECTION */}
      <section className="projects-section" style={{ padding: '90px 0' }}>
        <div className="container">
          <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="sub-title"><i className="fa-solid fa-handshake-angle"></i> WHAT WE DO</span>
            <h2 className="sec-title">Our Impact Initiatives & Programs</h2>
            <p className="sec-desc">AERC works at the frontline of community climate resilience, clean energy transitions, youth mobilization, and equitable development.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
            {allProjects.map((project) => (
              <div 
                key={project.id} 
                className="project-card" 
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #eef2f0', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  boxShadow: '0 5px 20px rgba(0,0,0,0.04)', 
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease' 
                }}
              >
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={project.coverImage} 
                    alt={project.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                  />
                  <span style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    left: '15px', 
                    background: 'var(--primary-green)', 
                    color: 'white', 
                    padding: '5px 12px', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    fontWeight: 600 
                  }}>
                    {project.tag}
                  </span>
                </div>
                <div style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '12px', lineHeight: 1.4 }}>
                    {project.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {project.summary}
                  </p>
                  <Link 
                    href={`/projects/${project.slug}`} 
                    style={{ color: 'var(--primary-green)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    Learn More <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{ background: 'linear-gradient(rgba(21, 24, 27, 0.88), rgba(21, 24, 27, 0.88)), url("/images/hero-bg.jpg") center/cover no-repeat', padding: '80px 0', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '16px' }}>Want to Support or Partner on a Project?</h2>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#d0d7d3', marginBottom: '30px' }}>
            Join forces with us to expand grassroots adaptation, renewable energy access, and youth climate leadership across communities in Ghana.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/partner" className="btn btn-base" style={{ textDecoration: 'none' }}>
              Become a Partner
            </Link>
            <Link href="/volunteer" className="btn btn-secondary" style={{ background: 'transparent', color: 'white', border: '2px solid white', padding: '12px 28px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none' }}>
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
