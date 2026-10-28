import { getAllDonations } from '@/db';
import { Heart, Mail, Clock, DollarSign, CheckCircle2, TrendingUp, Smartphone, CreditCard, Building2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Donations & Giving | AERC Admin',
};

export default async function AdminDonationsPage() {
  const donations = await getAllDonations();

  const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.amount || '0'), 0);
  const monthlyCount = donations.filter((d) => d.frequency === 'monthly').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Donations</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Grassroots Donations &amp; Giving</h1>
          <p className="text-sm text-slate-400">
            Contributions, campaign pledges, and community solidarity records ({donations.length} records)
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Recorded Gifts</div>
          <div className="text-3xl font-black text-white mt-2">
            ${totalAmount.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across all grassroots campaigns</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Monthly Champions</div>
          <div className="text-3xl font-black text-white mt-2">
            {monthlyCount}
          </div>
          <div className="text-xs text-rose-400 mt-1 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Recurring sustaining supporters</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Contributions</div>
          <div className="text-3xl font-black text-white mt-2">
            {donations.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Live tracked via PostgreSQL
          </div>
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <Heart className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">No donations recorded yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Contributions from the /donate portal will be logged here in real time.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Donor Name</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Frequency</th>
                  <th className="py-3.5 px-4 font-semibold">Campaign Allocation</th>
                  <th className="py-3.5 px-4 font-semibold">Method</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {donations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{d.donorName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <a href={`mailto:${d.donorEmail}`} className="hover:underline text-emerald-400">
                          {d.donorEmail}
                        </a>
                      </div>
                      {d.message && (
                        <p className="text-[11px] text-slate-400 italic mt-1 max-w-xs">&ldquo;{d.message}&rdquo;</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-white text-sm">
                        {d.currency} {d.amount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          d.frequency === 'monthly'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {d.frequency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {d.campaign}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap uppercase">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        {d.paymentMethod === 'mobile_money' ? (
                          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        ) : d.paymentMethod === 'card' ? (
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{d.paymentMethod.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {d.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(d.createdAt).toLocaleDateString()}
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
