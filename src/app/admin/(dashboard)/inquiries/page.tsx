import { requireAdmin } from '@/lib/auth';
import { getAllContactInquiries, getAllAdmins, getEnquiryNotificationSettings } from '@/db';
import InquiriesManagerClient from './InquiriesManagerClient';

export const metadata = {
  title: 'Contact Enquiries | AERC Ghana Management Portal',
  description: 'Manage incoming public messages, assign inquiries to staff, track follow-up, and configure notification preferences.',
};

export default async function AdminInquiriesPage() {
  const currentSession = await requireAdmin();

  const [inquiries, staffUsers, notificationSettings] = await Promise.all([
    getAllContactInquiries(),
    getAllAdmins(),
    getEnquiryNotificationSettings(),
  ]);

  return (
    <InquiriesManagerClient
      inquiries={inquiries}
      staffUsers={staffUsers}
      notificationSettings={notificationSettings}
      currentSession={currentSession}
    />
  );
}
