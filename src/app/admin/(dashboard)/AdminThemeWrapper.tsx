'use client';

import AdminNav from './AdminNav';

interface AdminThemeWrapperProps {
  admin: {
    name: string;
    email: string;
    role: string;
  };
  children: React.ReactNode;
}

export default function AdminThemeWrapper({
  admin,
  children,
}: AdminThemeWrapperProps) {
  return (
    <div className="h-screen flex overflow-hidden admin-light-mode bg-slate-50 text-slate-900">
      {/* Sidebar Navigation - Permanently Static */}
      <AdminNav user={admin} />

      {/* Main Content Area - Independently scrollable */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Sticky Header */}
        <header className="h-16 border-b px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/90 border-slate-200 shadow-sm shrink-0">
          {/* Left: PostgreSQL Connection Indicator */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connected to PostgreSQL</span>
            </span>
          </div>

          {/* Right: Admin User Email */}
          <div className="flex items-center gap-4 text-xs">
            <div className="text-slate-500">
              Signed in as{' '}
              <strong className="text-slate-900 font-bold">
                {admin.email}
              </strong>
            </div>
          </div>
        </header>

        {/* Dashboard Pages */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
