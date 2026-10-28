import { getAllVolunteerApplications } from '@/db';
import { Mail, Phone, Clock, Users, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Volunteer Roster | AERC Admin',
};

export default async function AdminVolunteersPage() {
  const volunteers = await getAllVolunteerApplications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Volunteers</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Volunteer Roster</h1>
          <p className="text-sm text-slate-400">
            Active volunteer sign-ups and environmental advocates ({volunteers.length} total)
          </p>
        </div>
      </div>

      {volunteers.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">No volunteers registered yet</p>
          <p className="text-xs text-slate-500 mt-1">
            Registrations from the /volunteer page will be displayed here.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Volunteer Name</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold">Areas of Interest</th>
                  <th className="py-3.5 px-4 font-semibold">Availability</th>
                  <th className="py-3.5 px-4 font-semibold">Experience & Background</th>
                  <th className="py-3.5 px-4 font-semibold">Referral</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                      {vol.firstName} {vol.lastName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 space-y-1 whitespace-nowrap">
                      <a href={`mailto:${vol.email}`} className="text-emerald-400 hover:underline flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        {vol.email}
                      </a>
                      {vol.phone && (
                        <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {vol.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                        {vol.interests || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {vol.availability || 'Flexible'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-xs">
                      <p className="line-clamp-2">{vol.experience || '—'}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {vol.referral || 'Direct'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(vol.createdAt).toLocaleDateString()}
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
