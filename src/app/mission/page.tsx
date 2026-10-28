import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSitePageBySlug } from '@/db';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePageBySlug('/mission');
  return {
    title: page?.seoTitle || page?.title || 'Our Mission – Alliance for Empowering Rural Communities',
    description:
      page?.seoDescription ||
      page?.description ||
      'Discover the mission of AERC Ghana: empowering rural communities across Africa with sustainable ecological resilience.',
  };
}

export default async function MissionPage() {
  const page = await getSitePageBySlug('/mission');

  if (!page) {
    notFound();
  }

  return <DynamicPageRenderer page={page} />;
}
