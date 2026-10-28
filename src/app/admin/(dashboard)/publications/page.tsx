import { Metadata } from 'next';
import { getPublications } from '@/db';
import PublicationsTableClient from './PublicationsTableClient';

export const metadata: Metadata = {
  title: 'Publications & Reports Management | AERC Admin',
  description: 'Manage AERC Ghana research documents, policy briefs, newsletters, and downloadable resources.',
};

export const dynamic = 'force-dynamic';

export default async function AdminPublicationsPage() {
  const publications = await getPublications();

  return <PublicationsTableClient initialPublications={publications} />;
}
