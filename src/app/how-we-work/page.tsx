import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSitePageBySlug } from '@/db';
import DynamicPageRenderer from '@/components/DynamicPageRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePageBySlug('/how-we-work');
  return {
    title: page?.seoTitle || page?.title || 'How We Work – Alliance for Empowering Rural Communities',
    description:
      page?.seoDescription ||
      page?.description ||
      'Our participatory methodologies, community co-design principles, and accountable implementation frameworks.',
  };
}

export default async function HowWeWorkPage() {
  const page = await getSitePageBySlug('/how-we-work');

  if (!page) {
    notFound();
  }

  return <DynamicPageRenderer page={page} />;
}
