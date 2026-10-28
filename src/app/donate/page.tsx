import DonateForm from './DonateForm';
import { Heart, ShieldCheck, TreePine, Flame, Sun, Users2, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Donate & Support | Alliance for Empowering Rural Communities (AERC Ghana)',
  description: 'Fuel grassroots climate justice, school green clubs, clean cooking, and renewable energy across rural Ghanaian communities.',
};

export default function DonatePage() {
  const impactStats = [
    {
      icon: TreePine,
      title: '5,000+ Native Trees',
      desc: 'Planted across Shai Hills, forest reserves, and community green belts.',
    },
    {
      icon: Users2,
      title: '24 Green-Life Clubs',
      desc: 'Active in Primary, Junior High, Senior High, and Tertiary schools.',
    },
    {
      icon: Flame,
      title: 'Clean Cooking Stoves',
      desc: 'Distributed to rural women to eliminate toxic smoke and reduce biomass use.',
    },
    {
      icon: Sun,
      title: 'Just Energy Advocacy',
      desc: 'Advancing community-owned decentralized solar and halting fossil fuel finance.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-24 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-4 shadow-lg">
            <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
            <span>Grassroots Climate Action &bull; Direct Impact</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Invest in Frontline Climate Resilience
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Every contribution directly empowers Ghanaian youth, rural farmers, and women leaders defending ecosystems, advancing renewable power, and restoring soil sovereignty.
          </p>
        </div>

        {/* Content Layout: Impact Story on Left, Donation Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Why Support Us */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white mb-3">Where 100% of Your Gift Goes</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                Unlike bureaucratic aid channels, AERC is a registered grassroots organization in Ghana. Our staff and volunteers live and work directly in the communities we serve.
              </p>

              <div className="space-y-4">
                {impactStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.title} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{stat.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{stat.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transparency Note */}
            <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Financial Integrity &amp; Transparency</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                AERC publishes open-access audited financial reports every calendar year. Read our latest verified report in our <a href="/resources" className="text-emerald-400 underline hover:text-emerald-300">Publications &amp; Reports section</a>.
              </p>
              <div className="pt-2 text-[11px] text-slate-500">
                Registered Non-Governmental Organization &bull; Greater Accra Region, Ghana.
              </div>
            </div>
          </div>

          {/* Right Column: Donation Form */}
          <div className="lg:col-span-7">
            <DonateForm />
          </div>
        </div>
      </div>
    </div>
  );
}
