import { notFound } from 'next/navigation';
import { getProjectById, getProjectRevisions } from '@/db';
import ProjectEditorForm from '../../ProjectEditorForm';

interface EditProjectProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Project | AERC Admin',
};

export default async function AdminEditProjectPage({ params }: EditProjectProps) {
  const { id } = await params;
  const projectId = Number(id);

  if (!projectId || isNaN(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId);
  if (!project) {
    notFound();
  }

  const revisions = await getProjectRevisions(projectId);

  return (
    <ProjectEditorForm
      initialProject={project}
      revisions={revisions}
      isNew={false}
    />
  );
}
