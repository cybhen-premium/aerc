'use client';

import { useState } from 'react';
import Link from 'next/link';

import { FocusArea } from '@/db/schema';

interface FocusPillar {
  id: string;
  number: string;
  title: string;
  summary: string;
  icon: string;
  tags: string[];
  slug?: string;
}

const defaultFocusPillars: FocusPillar[] = [
  {
    id: 'community-led-adaptation',
    number: '01',
    title: 'Community-Led Adaptation',
    summary:
      'We believe lasting climate solutions must be owned and led by the communities they serve. We strengthen local leadership, build adaptive capacity, and ensure grassroots knowledge informs policy and practice.',
    icon: 'fa-users-line',
    tags: ['Local Leadership', 'Adaptive Capacity', 'Grassroots Policy'],
    slug: 'community-led-adaptation',
  },
  {
    id: 'nature-based-solutions',
    number: '02',
    title: 'Nature-Based Solutions',
    summary:
      'Healthy ecosystems are the foundation of climate resilience. We restore degraded lands, preserve biodiversity, and promote adaptation strategies rooted in nature. By protecting forests, wetlands, and mangroves, we strengthen natural defenses.',
    icon: 'fa-seedling',
    tags: ['Reforestation', 'Wetland Conservation', 'Biodiversity'],
    slug: 'nature-based-solutions',
  },
  {
    id: 'renewable-energy',
    number: '03',
    title: 'Renewable Energy',
    summary:
      'Clean, affordable, and reliable energy is essential for poverty reduction and equitable development. We champion decentralized renewable energy systems that power homes, schools, and businesses while reducing fossil fuel dependence.',
    icon: 'fa-solar-panel',
    tags: ['Decentralized Power', 'Solar Mini-Grids', 'Clean Cooking'],
    slug: 'renewable-energy',
  },
  {
    id: 'fossil-fuel-finance-accountability',
    number: '04',
    title: 'Fossil Fuel Finance Accountability',
    summary:
      'We push for public and private investments to move away from fossil fuels toward sustainable and just alternatives. By tracking and challenging harmful energy financing, particularly through Export Credit Agencies (ECAs), we accelerate low-carbon transition.',
    icon: 'fa-file-invoice-dollar',
    tags: ['Divestment', 'Public Finance', 'ECA Tracking'],
    slug: 'fossil-fuel-finance-accountability',
  },
  {
    id: 'plastics-waste-management',
    number: '05',
    title: 'Plastics & Waste Management',
    summary:
      'Plastic pollution and poor waste management threaten both people and ecosystems. Through education, clean-ups, waste segregation, and circular economy initiatives, we turn waste into resources and protect frontline environments.',
    icon: 'fa-recycle',
    tags: ['Circular Economy', 'Zero Waste Action', 'Producer Responsibility'],
    slug: 'plastics-waste-management',
  },
];

interface FocusAccordionProps {
  focusAreas?: FocusArea[];
}

export default function FocusAccordion({ focusAreas }: FocusAccordionProps) {
  const displayPillars: FocusPillar[] = focusAreas && focusAreas.length > 0
    ? focusAreas
        .filter((fa) => (fa.status || 'active') === 'active' && fa.isFeatured === 'yes')
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map((fa, idx) => ({
          id: fa.slug,
          number: String(idx + 1).padStart(2, '0'),
          title: fa.title,
          summary: fa.summary,
          icon: fa.icon || 'fa-leaf',
          tags: fa.tags ? fa.tags.split(',').map((t) => t.trim()).slice(0, 3) : [fa.parentPillar],
          slug: fa.slug,
        }))
    : defaultFocusPillars;

  const [openId, setOpenId] = useState<string | null>(displayPillars[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="modern-focus-container">
      {/* PILLAR ACCORDION CARDS */}
      <div className="modern-pillar-list">
        {displayPillars.map((pillar) => {
          const isOpen = openId === pillar.id;
          return (
            <div
              key={pillar.id}
              className={`modern-pillar-card ${isOpen ? 'active' : ''}`}
            >
              <button
                type="button"
                className="modern-pillar-header"
                onClick={() => toggle(pillar.id)}
                aria-expanded={isOpen}
              >
                <div className="modern-pillar-title-group">
                  <div className="modern-pillar-badge">{pillar.number}</div>
                  <div className="modern-pillar-icon">
                    <i className={`fa-solid ${pillar.icon}`}></i>
                  </div>
                  <h3 className="modern-pillar-name">{pillar.title}</h3>
                </div>

                <div className="modern-pillar-toggle-btn">
                  <i
                    className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`}
                  ></i>
                </div>
              </button>

              <div
                className={`modern-pillar-drawer ${isOpen ? 'expanded' : ''}`}
              >
                <div className="modern-pillar-content">
                  <p className="modern-pillar-text">{pillar.summary}</p>

                  <div className="modern-pillar-footer">
                    <div className="modern-pillar-tags">
                      {pillar.tags.map((tag, idx) => (
                        <span key={idx} className="modern-tag-chip">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    {pillar.slug && (
                      <div className="pt-2">
                        <Link
                          href={`/focus/${pillar.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition group/link"
                        >
                          <span>Explore Focus Area Hub</span>
                          <span className="transition-transform group-hover/link:translate-x-1">&rarr;</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION CTA ACTION: MORE ABOUT US */}
      <div className="modern-focus-actions">
        <Link href="/about" className="modern-more-about-btn">
          <span>More About Us</span>
          <i className="fa-solid fa-angles-right"></i>
        </Link>
      </div>
    </div>
  );
}
