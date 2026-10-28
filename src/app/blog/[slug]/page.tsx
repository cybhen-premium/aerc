import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts, getBlogComments } from '@/db';
import CommentSection from '@/components/CommentSection';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);
  if (!blog) return { title: 'Post Not Found – AERCGH' };
  return {
    title: blog.seoTitle ? `${blog.seoTitle} | AERC Ghana` : `${blog.title} – AERCGH Field Journal`,
    description: blog.seoDescription || blog.excerpt || blog.title,
  };
}

export async function generateStaticParams() {
  const blogs = await getBlogPosts();
  return blogs.map((b) => ({ slug: b.slug }));
}

function parseInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const rawText = linkMatch[1];
      const isBold = rawText.startsWith('**') && rawText.endsWith('**');
      const displayText = isBold ? rawText.slice(2, -2) : rawText;
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="article-inline-link">
          {isBold ? <strong>{displayText}</strong> : displayText}
        </a>
      );
    }
    return part;
  });
}

function renderArticleContent(content: string) {
  // Normalize markdown so headers have clean block separation
  const normalized = (content || '').replace(/(^|\n)(#{1,4}\s+[^\n]+)\n(?!\n)/g, '$1$2\n\n');
  const blocks = normalized.split(/\n\n+/);

  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="article-heading-2">
          {trimmed.replace(/^##\s+/, '')}
        </h2>
      );
    }

    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="article-heading-3">
          {trimmed.replace(/^###\s+/, '')}
        </h3>
      );
    }

    const pdfMatch = trimmed.match(/^!?@?\[pdf:(.*?)\]\((.*?)\)$/i);
    if (pdfMatch) {
      const title = pdfMatch[1];
      const src = pdfMatch[2];
      return (
        <div key={idx} className="article-pdf-wrapper">
          <div className="article-pdf-frame-container">
            <iframe
              src={`${src}#toolbar=1&navpanes=1`}
              className="article-pdf-frame"
              title={title}
            />
          </div>
          <div className="article-pdf-action-bar">
            <div className="article-pdf-info">
              <i className="fa-solid fa-file-pdf pdf-file-icon"></i>
              <div className="article-pdf-details">
                <span className="pdf-doc-name">{title}</span>
                <span className="pdf-doc-meta">Official Publication • PDF Document</span>
              </div>
            </div>
            <div className="article-pdf-buttons">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary pdf-btn-preview"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Open Fullscreen</span>
              </a>
              <a
                href={src}
                download
                className="btn-primary pdf-btn-download"
              >
                <i className="fa-solid fa-download"></i>
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      return (
        <figure key={idx} className="article-body-figure">
          <img src={src} alt={alt} loading="lazy" />
          {alt && <figcaption>{alt}</figcaption>}
        </figure>
      );
    }

    const lines = trimmed.split('\n');
    if (lines.length >= 1 && lines.every((l) => !l.trim() || l.trim().startsWith('- ') || l.trim().startsWith('* '))) {
      return (
        <ul key={idx} className="article-body-list">
          {lines.map((l, liIdx) => (
            <li key={liIdx}>{parseInlineFormatting(l.trim().replace(/^[-*]\s+/, ''))}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={idx} className="article-body-paragraph">
        {parseInlineFormatting(trimmed)}
      </p>
    );
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogPostBySlug(slug);

  if (!blog) {
    notFound();
  }

  const allBlogs = await getBlogPosts();
  const relatedArticles = allBlogs.filter((b) => b.slug !== slug).slice(0, 3);
  const initialComments = await getBlogComments(slug);

  const pubDate = new Date(blog.publishedAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const words = (blog.content || '').trim().split(/\s+/).length;
  const readTime = `${Math.max(2, Math.ceil(words / 180))} min read`;

  return (
    <>
      {/* BREADCRUMB HEADER */}
      <section className="page-breadcrumb">
        <div className="container">
          <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span className="badge-pill dark" style={{ marginBottom: '14px', display: 'inline-flex' }}>
              <i className="fa-solid fa-tag"></i> {blog.category || 'Climate Justice'}
            </span>
            <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', lineHeight: 1.25 }}>
              {blog.title}
            </h1>
            <ul className="breadcrumb-links" style={{ marginTop: '20px' }}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blog">Blog Grid</Link></li>
              <li><span>{blog.title.slice(0, 36)}...</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ARTICLE BODY SECTION */}
      <section className="article-stage" style={{ padding: '70px 0 100px', background: 'var(--white)' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          
          {/* Article Meta Bar */}
          <div className="article-meta-bar">
            <div className="article-meta-left">
              <div className="article-author-avatar">
                <i className="fa-solid fa-user-pen"></i>
              </div>
              <div>
                <span className="article-author-name">{blog.author}</span>
                <div className="article-author-sub">
                  <span>{pubDate}</span>
                  <span>•</span>
                  <span><i className="fa-regular fa-clock"></i> {readTime}</span>
                </div>
              </div>
            </div>

            {/* Social Share Group */}
            <div className="article-share-group">
              <span className="share-label">Share:</span>
              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="article-share-btn"
                aria-label="Share on X"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/`}
                target="_blank"
                rel="noopener noreferrer"
                className="article-share-btn"
                aria-label="Share on LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php`}
                target="_blank"
                rel="noopener noreferrer"
                className="article-share-btn"
                aria-label="Share on Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
            </div>
          </div>

          {/* Featured Cover Image */}
          <div className="article-cover-wrap">
            <img src={blog.coverImage || '/images/hero-bg.jpg'} alt={blog.imageAlt || blog.title} />
            {blog.imageCaption && (
              <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', marginTop: '8px', textAlign: 'center' }}>
                {blog.imageCaption}
              </p>
            )}
          </div>

          {/* Lead Excerpt Callout */}
          {blog.excerpt && (
            <div className="article-lead-box">
              <p>{blog.excerpt}</p>
            </div>
          )}

          {/* Main Article Content */}
          <div className="article-prose">
            {renderArticleContent(blog.content)}
          </div>

          {/* Article Tags */}
          {blog.tags && (
            <div style={{ margin: '24px 0', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                <i className="fa-solid fa-tags"></i> Tags:
              </span>
              {blog.tags.split(',').map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    background: '#ecfdf5',
                    color: '#059669',
                    borderRadius: '6px',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Author Bio Box */}
          <div className="article-author-box">
            <div className="author-box-avatar">
              <img src="/images/logo-sidebar.png" alt="AERCGH Logo" />
            </div>
            <div className="author-box-info">
              <h4>Written by {blog.author}</h4>
              <p>
                Contributing author at Alliance for Empowering Rural Communities (AERC Ghana). Dedicated to advancing climate justice, agroecological food sovereignty, and community-led clean energy solutions across Africa.
              </p>
            </div>
          </div>

          {/* Back Navigation Button */}
          <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid var(--slate-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/blog" className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to Field Journal</span>
            </Link>
            <Link href="/contact" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              <span>Reach Our Team</span>
              <i className="fa-solid fa-envelope"></i>
            </Link>
          </div>

          {/* Leave A Comment Section */}
          <CommentSection blogSlug={slug} initialComments={initialComments} />
        </div>
      </section>

      {/* RELATED ARTICLES SECTION */}
      {relatedArticles.length > 0 && (
        <section className="related-articles-section" style={{ padding: '80px 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container">
            <div style={{ marginBottom: '36px' }}>
              <span className="badge-pill">
                <i className="fa-regular fa-newspaper"></i> FURTHER READING
              </span>
              <h2 className="section-title" style={{ fontSize: '1.9rem', marginBottom: 0 }}>More from the Field Journal</h2>
            </div>

            <div className="journal-grid">
              {relatedArticles.map((rel) => {
                const relDate = new Date(rel.publishedAt);
                const day = relDate.getUTCDate();
                const month = relDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
                const year = relDate.getUTCFullYear();

                return (
                  <article key={rel.id} className="journal-card">
                    <div className="journal-card-thumb">
                      <Link href={`/blog/${rel.slug}`} className="thumb-link">
                        <img src={rel.coverImage || '/images/hero-bg.jpg'} alt={rel.title} loading="lazy" />
                      </Link>
                      <div className="blog-date-badge">
                        <span className="badge-day">{day}</span>
                        <span className="badge-month">{month}</span>
                        <span className="badge-year">{year}</span>
                      </div>
                      <span className="journal-card-category">{rel.category}</span>
                    </div>
                    <div className="journal-card-content">
                      <div className="journal-card-meta">
                        <span className="meta-author"><i className="fa-solid fa-user-pen"></i> {rel.author}</span>
                      </div>
                      <h3 className="journal-card-title">
                        <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h3>
                      <p className="journal-card-excerpt">{rel.excerpt}</p>
                      <div className="journal-card-footer">
                        <Link href={`/blog/${rel.slug}`} className="journal-read-link">
                          <span>Read More</span>
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
