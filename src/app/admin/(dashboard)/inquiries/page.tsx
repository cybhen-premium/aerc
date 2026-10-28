import { getAllContactInquiries } from '@/db';
import { Mail, Clock, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Inquiries | AERC Admin',
};

export default async function AdminInquiriesPage() {
  const inquiries = await getAllContactInquiries();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-200">Inquiries</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Contact Form Inquiries</h1>
          <p className="text-sm text-slate-400">
            Messages sent from the public website contact form ({inquiries.length} total)
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
          <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-medium">No contact inquiries found</p>
          <p className="text-xs text-slate-500 mt-1">
            When users submit the contact form, inquiries will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Sender Name</th>
                  <th className="py-3.5 px-4 font-semibold">Email</th>
                  <th className="py-3.5 px-4 font-semibold">Subject</th>
                  <th className="py-3.5 px-4 font-semibold">Message</th>
                  <th className="py-3.5 px-4 font-semibold">Date Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                      {inq.name}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 whitespace-nowrap">
                      <a href={`mailto:${inq.email}`} className="hover:underline flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        {inq.email}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium whitespace-nowrap">
                      {inq.subject || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-md">
                      <p className="line-clamp-2">{inq.message}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(inq.createdAt).toLocaleString()}
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
