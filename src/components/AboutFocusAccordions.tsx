'use client';

import { useState } from 'react';

import Link from 'next/link';

export interface AccordionPillar {
  id: string;
  title: string;
  summary: string;
  slug?: string;
}

export function GreenFocusAccordion({
  pillars,
  defaultOpenId,
}: {
  pillars: AccordionPillar[];
  defaultOpenId?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId || pillars[0]?.id || null
  );

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="green-accordion-container">
      {pillars.map((pillar) => {
        const isOpen = openId === pillar.id;
        return (
          <div key={pillar.id} className="green-accordion-item">
            <button
              type="button"
              className="green-accordion-btn"
              onClick={() => toggle(pillar.id)}
              aria-expanded={isOpen}
            >
              <span>{pillar.title}</span>
              <span className="toggle-icon">
                <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`}></i>
              </span>
            </button>

            <div className={`green-accordion-drawer ${isOpen ? 'open' : ''}`}>
              <div className="green-accordion-body">
                <p>{pillar.summary}</p>
                {pillar.slug && (
                  <div className="mt-2.5">
                    <Link
                      href={`/focus/${pillar.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
                    >
                      <span>Explore this Focus Area</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
