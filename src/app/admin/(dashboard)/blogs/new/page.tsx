import ArticleEditorForm from '../ArticleEditorForm';

export const metadata = {
  title: 'Create New Article | AERC Admin',
  description: 'Publish a new climate justice article, press release, or editorial story.',
};

export default function NewArticlePage() {
  return <ArticleEditorForm mode="create" />;
}
