import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LoginForm from './LoginForm';
import { Shield, ArrowLeft, Leaf } from 'lucide-react';

export const metadata = {
  title: 'Admin Login | AERC Ghana Management Portal',
  description: 'Administrator portal login for Alliance for Empowering Rural Communities.',
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />

      {/* Back to public website */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Return to Public Website</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-200 mb-4">
            <Leaf className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-3">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Staff Portal Access</span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            AERC Management Console
          </h1>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
            Sign in with authorized credentials to access administrative modules, publications, and community inquiries.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          <LoginForm />

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Authorized personnel only &bull; Sessions are protected and activity is logged.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-400">
          Alliance for Empowering Rural Communities (AERC Ghana) &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
