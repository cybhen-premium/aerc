import { notFound } from 'next/navigation';
import { getFocusAreaById, getFocusAreaRevisions } from '@/db';
import FocusAreaEditorForm from '../../FocusAreaEditorForm';

interface EditFocusAreaProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Focus Area | AERC Admin',
};

export default async function AdminEditFocusAreaPage({ params }: EditFocusAreaProps) {
  const { id } = await params;
  const focusAreaId = Number(id);

  if (!focusAreaId || isNaN(focusAreaId)) {
    notFound();
  }

  const focusArea = await getFocusAreaById(focusAreaId);
  if (!focusArea) {
    notFound();
  }

  const revisions = await getFocusAreaRevisions(focusAreaId);

  return (
    <FocusAreaEditorForm
      initialData={focusArea}
      revisions={revisions}
    />
  );
}
