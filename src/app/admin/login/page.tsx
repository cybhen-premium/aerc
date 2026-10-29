import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LoginForm from './LoginForm';
import { Shield, ArrowLeft, Database } from 'lucide-react';

export const metadata = {
  title: 'Admin Sign In | AERC Ghana Management Portal',
  description: 'Administrator portal login for Alliance for Empowering Rural Communities.',
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900">
      {/* LEFT COLUMN: Executive Organization Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white flex-col justify-between p-12 xl:p-16 overflow-hidden">
        {/* Subtle Ambient Light Gradients */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-teal-600/15 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(16,185,129,0.12),_transparent_70%)] pointer-events-none" />

        {/* Top Header Branding with Original Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <img
              src="/images/logo-sidebar.png"
              alt="AERC Ghana Official Logo"
              className="w-14 h-14 object-contain rounded-full shadow-xl bg-black/20 p-0.5 border border-white/20 shrink-0"
            />
            <div>
              <div className="font-extrabold text-base tracking-wide text-white">AERC GHANA</div>
              <div className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
                Alliance for Empowering Rural Communities
              </div>
            </div>
          </div>
        </div>

        {/* Center Mission & Authority Section */}
        <div className="relative z-10 max-w-lg my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Non-Profit Environmental Organization</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Evidence-Based Policy &amp; Grassroots Climate Action
          </h2>

          <p className="text-sm xl:text-base text-slate-300 leading-relaxed mb-8">
            The AERC Management Portal provides executive oversight of environmental research,
            community advocacy campaigns, publications, and stakeholder correspondence across Ghana.
          </p>

          {/* Three Key Pillar Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-white">19+</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Publications &amp; Briefs</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-white">7</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Active Initiatives</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">Encrypted Audit Trail</div>
            </div>
          </div>
        </div>

        {/* Bottom Platform Guarantee */}
        <div className="relative z-10 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Neon PostgreSQL Cloud &bull; 256-Bit Encrypted Sessions</span>
          </div>
          <span className="text-[11px] text-slate-500">ISO 27001 Standards</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Crisp White Executive Login Panel */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16 bg-white">
        {/* Top Navbar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>Return to Public Website</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Portal Operational</span>
          </div>
        </div>

        {/* Center Login Box */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-6">
            {/* Original Official Logo Header on the Login Form */}
            <div className="flex items-center gap-3.5 mb-5">
              <img
                src="/images/logo-sidebar.png"
                alt="AERC Ghana Official Logo"
                className="w-14 h-14 object-contain rounded-full shadow-md shrink-0"
              />
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base block">
                  AERC GHANA
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 tracking-wider uppercase block">
                  Alliance for Empowering Rural Communities
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wider uppercase mb-2.5">
              <Shield className="w-3 h-3 text-emerald-600" />
              <span>Staff Portal Authentication</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Management Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Sign in with your authorized credentials to access administrative modules, research publications, and community inquiries.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl">
            <LoginForm />
          </div>

          {/* Security & Access Assistance */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              Restricted area. All sign-in attempts, content edits, and system actions are recorded in the immutable audit trail.
            </p>
            <div className="mt-3 text-xs text-slate-600">
              Need assistance or password recovery?{' '}
              <a
                href="mailto:admin@aercgh.org?subject=AERC%20Portal%20Access%20Assistance"
                className="text-emerald-700 hover:underline font-semibold"
              >
                Contact Super Admin
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          Alliance for Empowering Rural Communities (AERC Ghana) &copy; {new Date().getFullYear()}.
          Registered Non-Profit NGO in Ghana.
        </div>
      </div>
    </div>
  );
}
