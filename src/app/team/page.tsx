import { Metadata } from 'next';
import { getTeamMembers } from '@/db';
import {
  Users,
  Mail,
  Award,
  Sparkles,
  HeartHandshake,
  GraduationCap,
  Linkedin,
  Twitter,
  Star,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Team & Leadership | Alliance for Empowering Rural Communities (AERC)',
  description: 'Meet the passionate youth leaders, environmental advocates, and officers driving grassroots climate resilience and just energy transition across Ghana.',
};

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const allMembers = await getTeamMembers();

  // Filter active profiles only and sort by display order
  const activeMembers = allMembers
    .filter((m) => (m.status || 'active').toLowerCase() === 'active')
    .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));

  const leadership = activeMembers.filter((m) => m.category === 'leadership');
  const officers = activeMembers.filter((m) => m.category === 'officers');
  const board = activeMembers.filter((m) => m.category === 'board');
  const volunteers = activeMembers.filter((m) => m.category === 'volunteers');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold tracking-wider uppercase shadow-lg">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Dedicated Grassroots Leadership</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Meet the Change-Makers
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            The dedicated team of youth organizers, renewable energy specialists, environmental advocates, and community conveners turning climate justice into frontline action across Ghana.
          </p>
        </div>

        {/* Section 1: Executive Leadership & Governance */}
        {leadership.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Award className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Executive Leadership &amp; Governance
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Steering institutional vision, policy advocacy, and partner accountability.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {leadership.map((member) => (
                <div
                  key={member.id}
                  className="rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 p-6 sm:p-7 flex flex-col justify-between transition-all hover:translate-y-[-2px] backdrop-blur-md shadow-xl group relative overflow-hidden"
                >
                  {member.isFeatured === 'yes' && (
                    <div className="absolute top-4 right-4 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Featured
                    </div>
                  )}

                  <div>
                    {/* Photograph */}
                    <div className="w-28 h-28 rounded-2xl overflow-hidden mb-5 border-2 border-emerald-500/30 group-hover:border-emerald-500 transition-colors relative shadow-2xl bg-slate-950">
                      <img
                        src={member.image || '/images/hero-community.jpg'}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                      {member.role}
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {member.name}
                    </h3>

                    {member.qualifications && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{member.qualifications}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed mt-3">
                      {member.bio}
                    </p>

                    {member.expertise && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                          Focus &amp; Expertise:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {member.expertise.split(',').map((exp, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[10px] font-medium"
                            >
                              {exp.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Social and Contact Links */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                          title={member.email}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-sky-400 hover:bg-slate-700 transition-colors"
                          title="Twitter / X Profile"
                        >
                          <Twitter className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      #{member.displayOrder || 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Officers & Programmatic Leads */}
        {officers.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Officers &amp; Programmatic Leads
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Heading project delivery, field mobilization, research briefs, and community dialogues.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {officers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-5 sm:p-6 flex flex-col justify-between transition-all backdrop-blur-md shadow-lg group"
                >
                  <div>
                    <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 border border-slate-700 group-hover:border-emerald-500/50 transition-colors relative shadow-xl bg-slate-950">
                      <img
                        src={member.image || '/images/hero-community.jpg'}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                      {member.role}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {member.name}
                    </h3>

                    {member.qualifications && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-1">
                        <GraduationCap className="w-3 h-3 text-amber-400 shrink-0" />
                        <span className="line-clamp-1">{member.qualifications}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-400 leading-relaxed mt-2.5 line-clamp-4">
                      {member.bio}
                    </p>

                    {member.expertise && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                          Specialization:
                        </span>
                        <p className="text-[10px] text-emerald-300 line-clamp-2">
                          {member.expertise}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                          title={member.email}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-blue-400 transition-colors"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Advisory Board & Trustees (if any) */}
        {board.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Advisory Board &amp; Strategic Trustees
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Senior institutional counsel, scientific guidance, and governance oversight.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {board.map((member) => (
                <div
                  key={member.id}
                  className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shrink-0">
                      <img
                        src={member.image || '/images/hero-community.jpg'}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-0.5 block">
                        {member.role}
                      </span>
                      <h3 className="text-base font-bold text-white">{member.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-3">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Grassroots Advocates & Volunteers */}
        {volunteers.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <HeartHandshake className="w-6 h-6 text-rose-400" />
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Grassroots Advocates &amp; Volunteers
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Frontline youth champions, community organizers, and field campaign ambassadors.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 flex items-start gap-4 shadow-md"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                    <img
                      src={member.image || '/images/hero-community.jpg'}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5">
                      {member.role}
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">{member.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{member.bio}</p>
                    {member.expertise && (
                      <span className="text-[10px] text-slate-500 mt-1 block truncate">
                        {member.expertise}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join the Movement CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-800/40 text-center max-w-4xl mx-auto space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Want to Join Our Grassroots Movement?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            We are always looking for passionate youth volunteers, environmental researchers, community educators, and clean energy advocates to expand our impact across Ghana.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <Link
              href="/volunteer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition-all"
            >
              Apply to Volunteer
            </Link>
            <Link
              href="/partner"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
