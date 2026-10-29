import { requireAdmin } from '@/lib/auth';
import AdminThemeWrapper from './AdminThemeWrapper';
import '../admin-theme.css';

export const metadata = {
  title: 'Admin Dashboard | AERC Ghana Management Portal',
  description: 'AERC management portal for staff and administrators.',
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <AdminThemeWrapper admin={admin}>
      {children}
    </AdminThemeWrapper>
  );
}
