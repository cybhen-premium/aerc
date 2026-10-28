import { notFound } from 'next/navigation';
import { getSitePageById, getPageRevisions } from '@/db';
import PageEditorForm from '../../PageEditorForm';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const pageId = Number(id);

  if (!pageId || isNaN(pageId)) {
    notFound();
  }

  const page = await getSitePageById(pageId);
  if (!page) {
    notFound();
  }

  const revisions = await getPageRevisions(pageId);

  return (
    <PageEditorForm
      initialPage={page}
      revisions={revisions}
      isNew={false}
    />
  );
}
