import { Metadata } from 'next';
import TeamMemberEditorForm from '../TeamMemberEditorForm';

export const metadata: Metadata = {
  title: 'Add Team Member | AERC Admin',
  description: 'Add a new executive, officer, advisory board member, or volunteer profile.',
};

export const dynamic = 'force-dynamic';

export default function NewTeamMemberPage() {
  return <TeamMemberEditorForm isNew={true} />;
}
