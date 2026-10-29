import { requireAdmin } from '@/lib/auth';
import { getSiteSettings, getMediaItems } from '@/db';
import SettingsManagerClient from './SettingsManagerClient';

export const metadata = {
  title: 'General Settings | AERC Ghana Management Portal',
  description: 'Manage website-wide organization profile, branding, contact details, social links, SEO defaults, and operational preferences.',
};

export default async function AdminSettingsPage() {
  const currentSession = await requireAdmin();

  const [settings, mediaItems] = await Promise.all([
    getSiteSettings(),
    getMediaItems(),
  ]);

  // System diagnostic metadata (safe non-sensitive indicators)
  const systemDiagnostics = {
    databaseStatus: 'Connected (Neon Serverless PostgreSQL)',
    cloudinaryConfigured: !!process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ? `${process.env.CLOUDINARY_CLOUD_NAME.slice(0, 4)}••••` : 'Not Configured',
    authEngine: 'JWT HS256 with HttpOnly Cookies',
    nodeEnv: process.env.NODE_ENV || 'development',
    nextVersion: '15.5.28',
    serverTime: new Date().toUTCString(),
  };

  return (
    <SettingsManagerClient
      settings={settings}
      mediaItems={mediaItems}
      currentSession={currentSession}
      diagnostics={systemDiagnostics}
    />
  );
}
