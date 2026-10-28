import { requireAdmin } from '@/lib/auth';
import AdminNav from './AdminNav';

export const metadata = {
  title: 'Admin Dashboard | AERC Africa',
  description: 'AERC management portal for staff and administrators.',
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <AdminNav user={admin} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        {/* Top bar inside main */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to PostgreSQL
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Signed in as <strong className="text-white">{admin.email}</strong></span>
          </div>
        </header>

        {/* Child Pages */}
        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
