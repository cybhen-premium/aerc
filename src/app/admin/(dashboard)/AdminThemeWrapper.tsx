'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Database } from 'lucide-react';
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
  // Default to 'light' mode as requested
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('aerc_admin_theme');
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved);
    } else {
      // Default to light mode
      setTheme('light');
      localStorage.setItem('aerc_admin_theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('aerc_admin_theme', next);
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`h-screen flex overflow-hidden transition-colors duration-200 ${
        isLight
          ? 'admin-light-mode bg-slate-50 text-slate-900'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Sidebar Navigation - Permanently Static */}
      <AdminNav user={admin} />

      {/* Main Content Area - Independently scrollable */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Sticky Header */}
        <header
          className={`h-16 border-b px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md transition-colors shrink-0 ${
            isLight
              ? 'bg-white/90 border-slate-200 shadow-sm'
              : 'bg-slate-900/40 border-slate-800'
          }`}
        >
          {/* Left: PostgreSQL Connection Indicator */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isLight
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connected to PostgreSQL</span>
            </span>
          </div>

          {/* Right: Theme Toggle & Admin User Email */}
          <div className="flex items-center gap-4 text-xs">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                }`}
                title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
              >
                {isLight ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-300" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            )}

            <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>
              Signed in as{' '}
              <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white'}>
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
