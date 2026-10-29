import { requireAdmin } from '@/lib/auth';
import {
  getHomepageSettings,
  getProjects,
  getBlogPosts,
  getPublications,
  getFocusAreas,
  getTeamMembers,
  getMediaItems,
} from '@/db';
import HomepageManagerClient from './HomepageManagerClient';

export const dynamic = 'force-dynamic';

export default async function HomepageManagerPage() {
  await requireAdmin();

  const [
    homepageSettings,
    allProjects,
    allBlogs,
    allPublications,
    allFocusAreas,
    allTeamMembers,
    allMediaItems,
  ] = await Promise.all([
    getHomepageSettings(),
    getProjects(),
    getBlogPosts(),
    getPublications(),
    getFocusAreas(),
    getTeamMembers(),
    getMediaItems(),
  ]);

  return (
    <HomepageManagerClient
      initialSettings={homepageSettings}
      projects={allProjects}
      blogs={allBlogs}
      publications={allPublications}
      focusAreas={allFocusAreas}
      teamMembers={allTeamMembers}
      mediaItems={allMediaItems}
    />
  );
}
