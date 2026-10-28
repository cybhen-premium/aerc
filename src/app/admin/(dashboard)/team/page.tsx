import { Metadata } from 'next';
import { getTeamMembers } from '@/db';
import TeamTableClient from './TeamTableClient';

export const metadata: Metadata = {
  title: 'Team & Leadership Management | AERC Admin',
  description: 'Manage executive leadership, program officers, advisory board, and community volunteer advocates.',
};

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage() {
  const members = await getTeamMembers();

  return <TeamTableClient initialMembers={members} />;
}
