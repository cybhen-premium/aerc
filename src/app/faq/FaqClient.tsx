'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, HelpCircle, Sparkles, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: '1',
    category: 'General & Mission',
    question: 'What is the primary mission of AERC Ghana?',
    answer:
      'The Alliance for Empowering Rural Communities (AERC) is a youth-led, frontline environmental NGO dedicated to environmental conservation, decentralized renewable energy access, agroecological food sovereignty, and climate justice advocacy across rural and peri-urban Ghanaian communities.',
  },
  {
    id: '2',
    category: 'General & Mission',
    question: 'Where is AERC Ghana based and where do you operate?',
    answer:
      'AERC is headquartered in the Greater Accra Region of Ghana, with active field operations, school Green-Life clubs, and community initiatives in the Greater Accra, Eastern, Central, and Northern regions.',
  },
  {
    id: '3',
    category: 'Climate Action & Initiatives',
    question: 'What are the Green-Life Clubs and how can schools join?',
    answer:
      'Green-Life Clubs are structured environmental stewardship chapters operating in Primary, Junior High, Senior High, and Tertiary institutions across Ghana. Students participate in tree planting, plastic recycling drives, climate debates, and renewable energy workshops. School administrators or teachers can register their institution by submitting our Partner Application form.',
  },
  {
    id: '4',
    category: 'Climate Action & Initiatives',
    question: 'What is the Kuvuna One World Garden project?',
    answer:
      'Kuvuna restores agroecological knowledge and community-led seed sovereignty. By countering the dependence on synthetic chemical inputs and industrial monoculture, Kuvuna teaches rural families how to grow nutritious organic crops and protect local soil health.',
  },
  {
    id: '5',
    category: 'Climate Action & Initiatives',
    question: 'What is the Youth Climate Joy and Healing Festival 2026?',
    answer:
      'The Youth Climate Joy and Healing Festival is a landmark initiative designed to address climate anxiety and emotional burnout among frontline youth activists. It creates a restorative space for young environmental leaders to connect, heal through art, celebrate collective resilience, and reimagine community climate action.',
  },
  {
    id: '6',
    category: 'Climate Action & Initiatives',
    question: 'How does AERC address illegal mining (galamsey) and forest destruction?',
    answer:
      'Through our #SaveOurForestReserves campaign, AERC conducts community monitoring, publishes investigative policy briefs, and petitions government and Parliament to repeal Executive Instruments that compromise protected forest reserves like the Achimota Forest and polluted water basins.',
  },
  {
    id: '7',
    category: 'Grassroots Donations & Funds',
    question: 'How are donor funds and contributions allocated?',
    answer:
      '100% of grassroots donations directly finance community work: purchasing seedlings for tree planting, providing clean cookstoves to rural women, funding Green-Life school club toolkits, and producing educational materials. AERC publishes open-access audited financial reports annually.',
  },
  {
    id: '8',
    category: 'Grassroots Donations & Funds',
    question: 'Can I donate using Mobile Money (MoMo) or international wire?',
    answer:
      'Yes. Our donation portal supports Ghanaian Mobile Money (MTN MoMo, Telecel Cash, AirtelTigo Money), international credit and debit cards, and direct bank wire transfers to our Ecobank Ghana account.',
  },
  {
    id: '9',
    category: 'Volunteering & Partnerships',
    question: 'How can I volunteer with AERC?',
    answer:
      'Anyone passionate about climate justice, environmental conservation, photography, journalism, or youth mentoring can sign up on our Volunteer page. We welcome both local volunteers in Ghana and international remote advocates.',
  },
  {
    id: '10',
    category: 'Volunteering & Partnerships',
    question: 'How can civil society organizations or corporations partner with AERC?',
    answer:
      'We collaborate with research institutions, NGOs, philanthropic foundations, and ethical businesses on renewable energy deployment, research publications, and community interventions. Please fill out our Partner Application or email us directly at info@aercghana.net.',
  },
];

export default function FaqClient() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(['1', '3']));

  const categories = ['All', 'General & Mission', 'Climate Action & Initiatives', 'Grassroots Donations & Funds', 'Volunteering & Partnerships'];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      const matchesQuery =
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by keywords (e.g. Green-Life, donate, volunteer, solar)..."
          className="w-full pl-11 pr-4 py-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xl backdrop-blur-md"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
            <MessageCircleQuestion className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">No questions match your query</p>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with different terms or reach out to us directly.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.has(faq.id);
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden transition-all hover:border-slate-700 backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleOpen(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-white text-sm sm:text-base pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400 bg-emerald-500/10' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    <div className="mt-3 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      Category: {faq.category}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still have questions */}
      <div className="text-center pt-8 border-t border-slate-800 max-w-2xl mx-auto">
        <h3 className="text-base font-bold text-white mb-2">Have a question that isn&apos;t answered here?</h3>
        <p className="text-xs text-slate-400 mb-4">
          Our team is always ready to connect with community members, youth researchers, and global partners.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-950 transition-colors"
        >
          <span>Contact Our Team</span>
        </Link>
      </div>
    </div>
  );
}
