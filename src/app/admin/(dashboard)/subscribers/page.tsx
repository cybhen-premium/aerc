import { getAllNewsletterSubscribers } from '@/db';
import { Mail, Clock, Download, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Newsletter Subscribers | AERC Admin',
};

export default async function AdminSubscribersPage() {
  const subscribers = await getAllNewsletterSubscribers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Subscribers</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Newsletter Subscribers</h1>
          <p className="text-sm text-slate-400">
            Community members subscribed to environmental updates & announcements ({subscribers.length} total)
          </p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <Mail className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">No newsletter subscribers yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Subscribers from the footer and home page newsletter forms will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl max-w-4xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">#</th>
                  <th className="py-3.5 px-4 font-semibold">Subscriber Email</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {subscribers.map((sub, index) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-mono w-12">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">
                      <a href={`mailto:${sub.email}`} className="text-emerald-400 hover:underline flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        {sub.email}
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
