import { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts } from '@/db';
import JournalExplorer from '@/components/JournalExplorer';

export const metadata: Metadata = {
  title: 'Field Journal & Insights – AERCGH',
  description: 'Articles, reflections, policy commentary, and frontline climate reports from the Alliance for Empowering Rural Communities in Ghana.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const blogs = await getBlogPosts();

  return (
    <>
      {/* PAGE BANNER & BREADCRUMB */}
      <section className="page-breadcrumb">
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <span className="badge-pill dark" style={{ marginBottom: '14px', display: 'inline-flex' }}>
              <i className="fa-regular fa-newspaper"></i> DISPATCHES &amp; PERSPECTIVES
            </span>
            <h1 className="page-title">Blog Grid &amp; Insights</h1>
            <p className="page-subtitle" style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.1rem', marginTop: '10px', lineHeight: 1.6 }}>
              Frontline environmental action, zero waste initiatives, clean energy dialogues, and community-led climate resilience across Ghana.
            </p>
            <ul className="breadcrumb-links" style={{ marginTop: '20px' }}>
              <li><Link href="/">Home</Link></li>
              <li><span>Blog Grid</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* JOURNAL EXPLORER SECTION */}
      <section className="journal-page-section" style={{ padding: '80px 0 100px', background: 'var(--bg-surface)' }}>
        <div className="container">
          <JournalExplorer articles={blogs} />
        </div>
      </section>
    </>
  );
}
