import { notFound } from 'next/navigation';
import { getPublicationById, getPublicationRevisions } from '@/db';
import PublicationEditorForm from '../../PublicationEditorForm';

interface EditPublicationPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Publication | AERC Admin',
};

export const dynamic = 'force-dynamic';

export default async function EditPublicationPage({ params }: EditPublicationPageProps) {
  const { id } = await params;
  const pubId = parseInt(id, 10);

  if (isNaN(pubId)) {
    notFound();
  }

  const [publication, revisions] = await Promise.all([
    getPublicationById(pubId),
    getPublicationRevisions(pubId),
  ]);

  if (!publication) {
    notFound();
  }

  return (
    <PublicationEditorForm
      initialPublication={publication}
      revisions={revisions}
      isNew={false}
    />
  );
}
