import type { Metadata } from 'next';
import './globals.css';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';
import { getSiteSettings } from '@/db';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.defaultMetaTitle || 'AERCGH – Alliance for Empowering Rural Communities',
    description:
      settings.defaultMetaDescription ||
      'Alliance for Empowering Rural Communities (AERC) is a youth-led, frontline climate & energy justice organization empowering rural and marginalized African communities to shape resilient, sustainable futures.',
    icons: {
      icon: settings.faviconUrl || '/images/logo-sidebar.png',
      shortcut: settings.faviconUrl || '/images/logo-sidebar.png',
      apple: settings.faviconUrl || '/images/logo-sidebar.png',
    },
    openGraph: {
      title: settings.defaultMetaTitle || 'AERCGH – Alliance for Empowering Rural Communities',
      description: settings.defaultMetaDescription || 'Frontline climate and energy justice across rural Africa.',
      images: [settings.defaultOgImage || '/images/slider-1.jpg'],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body suppressHydrationWarning>
        <ClientLayoutWrapper siteSettings={settings}>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
