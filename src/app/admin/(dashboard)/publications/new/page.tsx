import { Metadata } from 'next';
import PublicationEditorForm from '../PublicationEditorForm';

export const metadata: Metadata = {
  title: 'Upload Publication | AERC Admin',
  description: 'Upload and publish an official research document, policy brief, or report.',
};

export const dynamic = 'force-dynamic';

export default function NewPublicationPage() {
  return <PublicationEditorForm isNew={true} />;
}
