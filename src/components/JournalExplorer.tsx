'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/db/schema';

interface JournalExplorerProps {
  articles: BlogPost[];
}

export default function JournalExplorer({ articles }: JournalExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'magazine'>('grid');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map((a) => a.category || 'General')));
    return ['all', ...cats];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (article.category || 'General').toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (article.author && article.author.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const showMagazineHero = viewMode === 'magazine' && selectedCategory === 'all' && searchQuery.trim() === '';
  const featuredArticle = showMagazineHero ? articles[0] : null;
  const gridArticles = showMagazineHero ? articles.slice(1) : filteredArticles;

  const getReadTime = (content?: string) => {
    if (!content) return '3 min read';
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(2, Math.ceil(words / 180));
    return `${minutes} min read`;
  };

  const parseDateParts = (dateInput: Date | string) => {
    const date = new Date(dateInput);
    return {
      day: date.getUTCDate(),
      month: date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
      year: date.getUTCFullYear(),
      fullDateStr: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }),
    };
  };

  return (
    <div>
      {/* Category Pills & Search Controls Bar */}
      <div className="journal-controls-bar">
        <div className="journal-category-chips">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'all'
                ? articles.length
                : articles.filter((a) => (a.category || 'General').toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`journal-filter-chip ${isSelected ? 'active' : ''}`}
                aria-pressed={isSelected}
              >
                <span>{cat === 'all' ? 'All Articles' : cat}</span>
                <span className="chip-counter">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input Box & View Toggle */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="journal-search-wrap">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="journal-search-input"
              aria-label="Search articles"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <div className="journal-view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              title="Blog Grid View (matching aercghana.org)"
              aria-label="Grid View"
            >
              <i className="fa-solid fa-grip"></i>
              <span className="d-none d-sm-inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('magazine')}
              className={`view-toggle-btn ${viewMode === 'magazine' ? 'active' : ''}`}
              title="Featured Lead View"
              aria-label="Featured Lead View"
            >
              <i className="fa-solid fa-newspaper"></i>
              <span className="d-none d-sm-inline">Lead Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Lead Magazine Story (when Magazine mode is chosen) */}
      {featuredArticle && (
        <div className="journal-featured-banner">
          <div className="journal-featured-grid">
            <div className="journal-featured-thumb">
              <Link href={`/blog/${featuredArticle.slug}`}>
                <img
                  src={featuredArticle.coverImage || '/images/hero-bg.jpg'}
                  alt={featuredArticle.title}
                />
              </Link>
              <span className="featured-badge">
                <i className="fa-solid fa-star"></i> Featured Dispatches
              </span>
            </div>

            <div className="journal-featured-content">
              <div className="journal-meta-row">
                <span className="category-pill">{featuredArticle.category}</span>
                <span className="meta-bullet">•</span>
                <span className="meta-item">
                  <i className="fa-solid fa-user-pen"></i> {featuredArticle.author}
                </span>
                <span className="meta-bullet">•</span>
                <span className="meta-item">
                  <i className="fa-regular fa-calendar-days"></i>{' '}
                  {parseDateParts(featuredArticle.publishedAt).fullDateStr}
                </span>
                <span className="meta-bullet">•</span>
                <span className="meta-item">
                  <i className="fa-regular fa-clock"></i> {getReadTime(featuredArticle.content)}
                </span>
              </div>

              <h2 className="journal-featured-title">
                <Link href={`/blog/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
              </h2>

              <p className="journal-featured-excerpt">{featuredArticle.excerpt}</p>

              <Link href={`/blog/${featuredArticle.slug}`} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                <span>Read Full Story</span>
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="journal-empty-state">
          <div className="empty-icon-wrap">
            <i className="fa-regular fa-folder-open"></i>
          </div>
          <h3>No matching articles found</h3>
          <p>We couldn&apos;t find any stories matching your filter &quot;{searchQuery || selectedCategory}&quot;.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="btn-secondary"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Articles Grid (Standard 3-column Blog Grid matching live site) */}
      {gridArticles.length > 0 && (
        <div className="journal-grid">
          {gridArticles.map((article) => {
            const { day, month, year } = parseDateParts(article.publishedAt);

            return (
              <article key={article.id} className="journal-card">
                <div className="journal-card-thumb">
                  <Link href={`/blog/${article.slug}`} className="thumb-link">
                    <img
                      src={article.coverImage || '/images/hero-bg.jpg'}
                      alt={article.title}
                      loading="lazy"
                    />
                  </Link>

                  {/* Authentic Inset Date Badge matching aercghana.org/blog-grid-2 */}
                  <div className="blog-date-badge" aria-label={`Published on ${month} ${day}, ${year}`}>
                    <span className="badge-day">{day}</span>
                    <span className="badge-month">{month}</span>
                    <span className="badge-year">{year}</span>
                  </div>

                  <span className="journal-card-category">{article.category}</span>
                </div>

                <div className="journal-card-content">
                  <div className="journal-card-meta">
                    <span className="meta-author">
                      <i className="fa-solid fa-user-pen"></i> {article.author}
                    </span>
                    <span className="meta-bullet">•</span>
                    <span className="meta-readtime">
                      <i className="fa-regular fa-clock"></i> {getReadTime(article.content)}
                    </span>
                  </div>

                  <h3 className="journal-card-title">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="journal-card-excerpt">{article.excerpt}</p>

                  <div className="journal-card-footer">
                    <Link href={`/blog/${article.slug}`} className="journal-read-link">
                      <span>Read More</span>
                      <i className="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
