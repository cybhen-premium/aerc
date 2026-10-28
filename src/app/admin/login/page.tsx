import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LoginForm from './LoginForm';
import { Shield, Sparkles, ArrowLeft, Leaf } from 'lucide-react';

export const metadata = {
  title: 'Admin Login | AERC Africa Portal',
  description: 'Administrator portal login for Africa Environmental Resource Center.',
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to public website */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-xl shadow-emerald-950 mb-4">
            <Leaf className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs font-semibold tracking-wide uppercase mb-3">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Staff Portal Access</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AERC Management Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Sign in with authorized staff credentials to manage climate initiatives, publications, and community inquiries.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <LoginForm />

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-500">
              Authorized personnel only. Sessions are encrypted and activity is logged.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-600">
          Africa Environmental Resource Center &copy; {new Date().getFullYear()} &middot; Built with Next.js & Drizzle ORM
        </div>
      </div>
    </div>
  );
}
