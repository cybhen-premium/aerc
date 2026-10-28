import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSitePageBySlug } from '@/db';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePageBySlug('/vision');
  return {
    title: page?.seoTitle || page?.title || 'Our Vision – Alliance for Empowering Rural Communities',
    description:
      page?.seoDescription ||
      page?.description ||
      'Our vision for thriving, climate-resilient African communities with sovereign renewable energy and ecological harmony.',
  };
}

export default async function VisionPage() {
  const page = await getSitePageBySlug('/vision');

  if (!page) {
    notFound();
  }

  return <DynamicPageRenderer page={page} />;
}
