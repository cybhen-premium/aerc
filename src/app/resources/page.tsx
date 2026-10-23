import { Metadata } from 'next';
import Link from 'next/link';
import { getPublications, getBlogPosts, getBlogComments } from '@/db';
import CommentSection from '@/components/CommentSection';

export const metadata: Metadata = {
  title: 'Publications & Resources – AERCGH',
  description: 'Download policy briefs, research reports, shadow audits, and community frameworks published by the Alliance for Empowering Rural Communities in Ghana.',
};

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  const [pubs, recentBlogs, comments] = await Promise.all([
    getPublications(),
    getBlogPosts(),
    getBlogComments('resources'),
  ]);

  return (
    <>
      {/* BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <h1 className="page-title">Publications</h1>
          <ul className="breadcrumb-links">
            <li><Link href="/">Home</Link></li>
            <li><span>Publications</span></li>
          </ul>
        </div>
      </section>

      {/* PUBLICATIONS MAIN CONTENT */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '50px', alignItems: 'start' }}>
            {/* Left: Publications Download Cards */}
            <div>
              <div style={{ marginBottom: '35px' }}>
                <span className="sub-title"><i className="fa-solid fa-book-open"></i> KNOWLEDGE BANK</span>
                <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', marginBottom: '12px' }}>Official Reports, Newsletters & Policy Briefs</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1rem' }}>
                  Explore and download our official research reports, impact newsletters, policy memos, and statements published by the Alliance for Empowering Rural Communities in Ghana.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {pubs.map((item) => (
                  <div
                    key={item.id}
                    className="download-item-card"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      background: '#ffffff',
                      border: '1px solid #eef2f0',
                      borderRadius: '10px',
                      padding: '24px 28px',
                      gap: '24px',
                      flexWrap: 'wrap',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', flex: 1, minWidth: '280px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(235, 87, 87, 0.12)', color: '#eb5757', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, marginTop: '2px' }}>
                        <i className="fa-regular fa-file-pdf"></i>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '6px', lineHeight: 1.4, fontWeight: 700 }}>
                          {item.title}
                        </h4>
                        {item.description && (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem', lineHeight: 1.6, marginBottom: '10px' }}>
                            {item.description}
                          </p>
                        )}
                        <span style={{ fontSize: '0.84rem', color: 'var(--primary-green)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-circle-check" style={{ fontSize: '0.75rem' }}></i> {item.fileType} • {item.fileSize} • {new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#f8fafc',
                          color: '#1e293b',
                          padding: '9px 16px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          border: '1px solid #cbd5e1',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ color: '#64748b', fontSize: '0.85rem' }}></i>
                        <span>View</span>
                      </a>
                      <a
                        href={item.downloadUrl}
                        download
                        style={{
                          background: '#16a34a',
                          color: '#ffffff',
                          padding: '9px 18px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          border: '1px solid #15803d',
                          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <i className="fa-solid fa-download" style={{ color: '#ffffff', fontSize: '0.85rem' }}></i>
                        <span style={{ color: '#ffffff' }}>Download</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leave A Comment / Feedback Section */}
              <CommentSection blogSlug="resources" initialComments={comments} />
            </div>

            {/* Right: Sidebar */}
            <aside>
              {/* Search Widget */}
              <div style={{ background: '#fbfdfc', border: '1px solid #e2eee6', borderRadius: '8px', padding: '30px', marginBottom: '30px' }}>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '18px', borderBottom: '2px solid var(--primary-green)', paddingBottom: '8px' }}>Search Resources</h4>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search publications..."
                    style={{ width: '100%', padding: '12px 40px 12px 14px', border: '1px solid #dbe2dd', borderRadius: '6px', fontSize: '0.92rem' }}
                  />
                  <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', right: '14px', top: '15px', color: '#999' }}></i>
                </div>
              </div>

              {/* Recent Articles */}
              <div style={{ background: '#ffffff', border: '1px solid #eef2f0', borderRadius: '8px', padding: '30px' }}>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '18px', borderBottom: '2px solid var(--primary-green)', paddingBottom: '8px' }}>Recent Articles</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {recentBlogs.slice(0, 4).map((post) => (
                    <li key={post.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={post.coverImage || '/images/hero-bg.jpg'} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <h5 style={{ fontSize: '0.9rem', lineHeight: 1.3, marginBottom: '4px' }}>
                          <Link href={`/blog/${post.slug}`} style={{ color: 'var(--primary-dark)', textDecoration: 'none' }}>
                            {post.title}
                          </Link>
                        </h5>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
