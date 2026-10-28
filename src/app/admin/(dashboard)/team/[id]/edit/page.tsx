import { notFound } from 'next/navigation';
import { getTeamMemberById, getTeamMemberRevisions } from '@/db';
import TeamMemberEditorForm from '../../TeamMemberEditorForm';

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Team Profile | AERC Admin',
};

export const dynamic = 'force-dynamic';

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = await params;
  const memberId = parseInt(id, 10);

  if (isNaN(memberId)) {
    notFound();
  }

  const [member, revisions] = await Promise.all([
    getTeamMemberById(memberId),
    getTeamMemberRevisions(memberId),
  ]);

  if (!member) {
    notFound();
  }

  return (
    <TeamMemberEditorForm
      initialMember={member}
      revisions={revisions}
      isNew={false}
    />
  );
}
