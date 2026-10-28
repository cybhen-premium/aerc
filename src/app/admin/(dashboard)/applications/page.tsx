import { getAllPartnerApplications } from '@/db';
import { Mail, Phone, MapPin, Building, Clock, Handshake } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Partner Applications | AERC Admin',
};

export default async function AdminPartnerApplicationsPage() {
  const applications = await getAllPartnerApplications();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Partners</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Partner Applications</h1>
          <p className="text-sm text-slate-400">
            Institutional and organizational partnership proposals ({applications.length} total)
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <Handshake className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">No partner applications found</p>
          <p className="text-xs text-slate-500 mt-1">
            Submitted partner proposals from the partner page will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Contact Person</th>
                  <th className="py-3.5 px-4 font-semibold">Organisation</th>
                  <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold">Location</th>
                  <th className="py-3.5 px-4 font-semibold">Proposal Summary</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                      {app.firstName} {app.lastName}
                    </td>
                    <td className="py-3.5 px-4 text-amber-400 font-medium whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        {app.organisation || 'Independent Partner'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 space-y-1 whitespace-nowrap">
                      <a href={`mailto:${app.email}`} className="text-emerald-400 hover:underline flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        {app.email}
                      </a>
                      {app.phone && (
                        <div className="text-slate-400 flex items-center gap-1.5 text-[11px]">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {app.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {app.location || '—'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-sm">
                      <p className="line-clamp-2">{app.proposal || 'No specific proposal provided'}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(app.createdAt).toLocaleDateString()}
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
