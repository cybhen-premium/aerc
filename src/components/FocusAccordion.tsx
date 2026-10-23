'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FocusPillar {
  id: string;
  number: string;
  title: string;
  summary: string;
  icon: string;
  tags: string[];
}

const focusPillars: FocusPillar[] = [
  {
    id: 'environment-climate',
    number: '01',
    title: 'Environment & Climate',
    summary:
      'We empower communities to build resilience, protect ecosystems, and create sustainable infrastructure that supports both people and the planet.',
    icon: 'fa-earth-africa',
    tags: ['Ecosystem Protection', 'Climate Resilience', 'Sustainable Infrastructure'],
  },
  {
    id: 'community-adaptation',
    number: '02',
    title: 'Community-Led Adaptation',
    summary:
      'We believe lasting climate solutions must be owned and led by the communities they serve. We strengthen local leadership, build adaptive capacity, and ensure grassroots knowledge informs policy and practice. From training climate champions to supporting community-driven projects, we help people take charge of their resilience journey.',
    icon: 'fa-users-line',
    tags: ['Local Leadership', 'Adaptive Capacity', 'Grassroots Policy'],
  },
  {
    id: 'nature-solutions',
    number: '03',
    title: 'Nature-Based Solutions',
    summary:
      'Healthy ecosystems are the foundation of climate resilience. We restore degraded lands, preserve biodiversity, and promote adaptation strategies rooted in nature. By protecting forests, wetlands, and mangroves, we strengthen natural defenses against climate impacts while creating livelihood opportunities for local communities.',
    icon: 'fa-seedling',
    tags: ['Reforestation', 'Wetland Conservation', 'Biodiversity'],
  },
  {
    id: 'urban-infrastructure',
    number: '04',
    title: 'Urban & Infrastructure Development',
    summary:
      'We promote inclusive, climate-resilient infrastructure that safeguards lives and livelihoods while supporting sustainable growth. This includes urban planning with green spaces, sustainable transport, and adaptive designs that protect vulnerable communities.',
    icon: 'fa-city',
    tags: ['Green Urban Spaces', 'Resilient Transport', 'Climate Planning'],
  },
  {
    id: 'plastics-waste',
    number: '05',
    title: 'Plastics & Waste Management',
    summary:
      'Plastic pollution and poor waste management threaten both people and ecosystems. We reduce plastic use, promote sustainable consumption, and advocate for producer responsibility. Through education, clean-ups, waste segregation, and circular economy initiatives, we turn waste into resources, protect ecosystems, and reduce greenhouse gas emissions.',
    icon: 'fa-recycle',
    tags: ['Circular Economy', 'Zero Waste Action', 'Producer Responsibility'],
  },
];

export default function FocusAccordion() {
  const [openId, setOpenId] = useState<string | null>('environment-climate');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="modern-focus-container">
      {/* 5 PILLAR ACCORDION CARDS */}
      <div className="modern-pillar-list">
        {focusPillars.map((pillar) => {
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
