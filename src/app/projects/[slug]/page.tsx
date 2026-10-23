import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/db';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found – AERCGH' };
  return {
    title: `${project.title} – AERCGH`,
    description: project.summary,
  };
}


export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">{project.title}</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><span>{project.tag}</span></li>
          </ul>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', maxHeight: '450px' }}>
            <img src={project.coverImage} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ background: 'var(--primary-green)', color: 'white', padding: '6px 14px', borderRadius: '4px', fontWeight: 600, fontSize: '0.85rem' }}>
              {project.tag}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Status: <strong>{project.status}</strong></span>
          </div>

          <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', marginBottom: '25px', lineHeight: 1.3 }}>
            {project.title}
          </h2>

          <div style={{ fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--text-dark)', marginBottom: '40px' }}>
            <p style={{ marginBottom: '24px', fontWeight: 500, color: '#2d3748', fontSize: '1.15rem', background: '#f8faf9', padding: '20px', borderRadius: '8px', borderLeft: '4px solid var(--primary-green)' }}>
              {project.summary}
            </p>
            {project.description && project.description !== project.summary && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {project.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} style={{ margin: 0, whiteSpace: 'pre-line' }}>
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#f7faf8', borderLeft: '4px solid var(--primary-green)', padding: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '6px' }}>Interested in supporting this program?</h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Partner with us or sponsor grassroots equipment and training.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/partner" className="btn btn-base" style={{ textDecoration: 'none' }}>Partner With Us</Link>
              <Link href="/contact" className="btn btn-secondary" style={{ background: 'var(--primary-dark)', color: 'white', padding: '12px 22px', borderRadius: '6px', textDecoration: 'none' }}>Inquire</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
