import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSitePageBySlug } from '@/db';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePageBySlug('/objectives');
  return {
    title: page?.seoTitle || page?.title || 'Strategic Objectives – Alliance for Empowering Rural Communities',
    description:
      page?.seoDescription ||
      page?.description ||
      'Core institutional goals, strategic priorities, and measurable objectives of AERC Ghana.',
  };
}

export default async function ObjectivesPage() {
  const page = await getSitePageBySlug('/objectives');

  if (!page) {
    notFound();
  }

  return <DynamicPageRenderer page={page} />;
}
