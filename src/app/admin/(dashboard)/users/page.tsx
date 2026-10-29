import { requireAdmin } from '@/lib/auth';
import { getAllAdmins, getActivityLogs, getAllRevisionsSummary } from '@/db';
import UsersManagementClient from './UsersManagementClient';

export const metadata = {
  title: 'Users & Permissions | AERC Ghana Management Portal',
  description: 'Manage staff accounts, assign RBAC permissions, and monitor activity and revision audit logs.',
};

export default async function AdminUsersPage() {
  const currentSession = await requireAdmin();

  const [adminUsers, activityLogs, revisions] = await Promise.all([
    getAllAdmins(),
    getActivityLogs(100),
    getAllRevisionsSummary(100),
  ]);

  return (
    <UsersManagementClient
      currentSession={currentSession}
      adminUsers={adminUsers}
      activityLogs={activityLogs}
      revisions={revisions}
    />
  );
}
