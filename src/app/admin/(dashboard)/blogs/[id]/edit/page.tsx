import { notFound } from 'next/navigation';
import { getBlogPostById, getArticleRevisions } from '@/db';
import ArticleEditorForm from '../../ArticleEditorForm';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Article | AERC Admin',
  description: 'Edit editorial content, revise metadata, and manage revisions.',
};

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const articleId = Number(id);

  if (!articleId) {
    notFound();
  }

  const [article, revisions] = await Promise.all([
    getBlogPostById(articleId),
    getArticleRevisions(articleId),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <ArticleEditorForm
      initialArticle={article}
      revisions={revisions}
      mode="edit"
    />
  );
}
