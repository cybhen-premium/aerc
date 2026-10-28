import { Metadata } from 'next';
import { getMediaItems } from '@/db';
import MediaLibraryClient from './MediaLibraryClient';

export const metadata: Metadata = {
  title: 'Media Library | AERC Management Portal',
  description: 'Manage website images, logos, project photos, publication covers, and documents with Cloudinary delivery.',
};

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const mediaItems = await getMediaItems();

  return <MediaLibraryClient initialItems={mediaItems} />;
}
