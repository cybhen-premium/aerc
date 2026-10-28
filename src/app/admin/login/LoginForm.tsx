'use client';

import { useActionState } from 'react';
import { loginAdminAction, ActionResult } from '../actions';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    loginAdminAction,
    null
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
        >
          Administrator Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@aercgh.org"
            className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
        >
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-5 h-5" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Verifying credentials...
          </span>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </form>
  );
}
