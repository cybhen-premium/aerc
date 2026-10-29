import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { desc, eq, count, lt, sql as dSql } from 'drizzle-orm';
import * as schema from './schema';
import {
  initialBlogs,
  initialProjects,
  initialPublications,
  initialTeamMembers,
  initialSitePages,
  initialActivityLogs,
  initialFocusAreas,
  initialMediaItems,
  initialHomepageSettings,
} from './seed-data';

const connectionString = process.env.DATABASE_URL?.trim();

// Check if valid connection string exists
const isDbConfigured = Boolean(
  connectionString && 
  connectionString.startsWith('postgres') && 
  !connectionString.includes('password@ep-example')
);

const sql = isDbConfigured ? neon(connectionString!) : null;
export const db = sql ? drizzle(sql, { schema }) : null;

/**
 * Safe query wrappers that fallback to authentic seed data if DB is not configured or fails
 */
export async function getProjects(): Promise<schema.Project[]> {
  if (!db) return initialProjects;
  try {
    const res = await db.select().from(schema.projects);
    return res.length > 0 ? res : initialProjects;
  } catch (error) {
    console.warn('Database query failed, using fallback projects data:', error);
    return initialProjects;
  }
}

const projectSlugAliases: Record<string, string> = {
  'kuvuna-one-world-garden': 'kuvuna-project',
  'climate-friendly-cooking': 'clean-cooking-solutions',
  'fossil-finance-campaign': 'fossil-fuel-finance-accountability',
  'fossil-free-eca': 'fossil-fuel-finance-accountability',
  'how-to-save-plains-and-forests-capitalize-on-low-hanging': 'kuvuna-project',
  'project-planting-300-trees-in-the-city-bring-to-the-table-win-win-survival': 'just-energy-transition',
  'efficiently-unleash-cross-media-information-without-cross-media-value': 'clean-cooking-solutions',
};

export async function getProjectBySlug(slug: string): Promise<schema.Project | null> {
  const normalizedSlug = projectSlugAliases[slug] || slug;
  if (!db) {
    return initialProjects.find((p) => p.slug === normalizedSlug) || null;
  }
  try {
    const res = await db.select().from(schema.projects);
    const found = res.find((p) => p.slug === normalizedSlug);
    return found || initialProjects.find((p) => p.slug === normalizedSlug) || null;
  } catch (error) {
    console.warn('Database query failed, using fallback project data:', error);
    return initialProjects.find((p) => p.slug === normalizedSlug) || null;
  }
}

export async function getProjectById(id: number): Promise<schema.Project | null> {
  if (!db) {
    return initialProjects.find((p) => p.id === id) || null;
  }
  try {
    const res = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
    return res[0] || initialProjects.find((p) => p.id === id) || null;
  } catch (error) {
    console.warn('Failed to fetch project by id:', error);
    return initialProjects.find((p) => p.id === id) || null;
  }
}

export async function createProject(data: schema.NewProject): Promise<schema.Project | null> {
  if (!db) return null;
  try {
    const res = await db.insert(schema.projects).values(data).returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
}

export async function updateProject(id: number, data: Partial<schema.NewProject>): Promise<schema.Project | null> {
  if (!db) return null;
  try {
    const res = await db
      .update(schema.projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.projects.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update project:', error);
    throw error;
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  if (!db) return false;
  try {
    await db.delete(schema.projects).where(eq(schema.projects.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    return false;
  }
}

export async function getProjectRevisions(projectId: number): Promise<schema.ProjectRevision[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.projectRevisions)
      .where(eq(schema.projectRevisions.projectId, projectId))
      .orderBy(desc(schema.projectRevisions.createdAt));
  } catch (error) {
    console.warn('Failed to fetch project revisions:', error);
    return [];
  }
}

export async function createProjectRevision(data: schema.NewProjectRevision): Promise<void> {
  if (!db) return;
  try {
    await db.insert(schema.projectRevisions).values(data);
  } catch (error) {
    console.error('Failed to log project revision:', error);
  }
}

/**
 * Focus Areas & Strategic Pillars Queries
 */
export async function getFocusAreas(): Promise<schema.FocusArea[]> {
  if (!db) return initialFocusAreas;
  try {
    const res = await db.select().from(schema.focusAreas).orderBy(schema.focusAreas.displayOrder);
    return res.length > 0 ? res : initialFocusAreas;
  } catch (error) {
    console.warn('Database query failed, using fallback focus areas data:', error);
    return initialFocusAreas;
  }
}

export async function getFocusAreaBySlug(slug: string): Promise<schema.FocusArea | null> {
  if (!db) {
    return initialFocusAreas.find((fa) => fa.slug === slug) || null;
  }
  try {
    const res = await db.select().from(schema.focusAreas).where(eq(schema.focusAreas.slug, slug)).limit(1);
    return res[0] || initialFocusAreas.find((fa) => fa.slug === slug) || null;
  } catch (error) {
    console.warn('Failed to fetch focus area by slug:', error);
    return initialFocusAreas.find((fa) => fa.slug === slug) || null;
  }
}

export async function getFocusAreaById(id: number): Promise<schema.FocusArea | null> {
  if (!db) {
    return initialFocusAreas.find((fa) => fa.id === id) || null;
  }
  try {
    const res = await db.select().from(schema.focusAreas).where(eq(schema.focusAreas.id, id)).limit(1);
    return res[0] || initialFocusAreas.find((fa) => fa.id === id) || null;
  } catch (error) {
    console.warn('Failed to fetch focus area by id:', error);
    return initialFocusAreas.find((fa) => fa.id === id) || null;
  }
}

export async function createFocusArea(data: schema.NewFocusArea): Promise<schema.FocusArea | null> {
  if (!db) return null;
  try {
    const res = await db.insert(schema.focusAreas).values(data).returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to create focus area:', error);
    throw error;
  }
}

export async function updateFocusArea(id: number, data: Partial<schema.NewFocusArea>): Promise<schema.FocusArea | null> {
  if (!db) return null;
  try {
    const res = await db
      .update(schema.focusAreas)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.focusAreas.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update focus area:', error);
    throw error;
  }
}

export async function deleteFocusArea(id: number): Promise<boolean> {
  if (!db) return false;
  try {
    await db.delete(schema.focusAreas).where(eq(schema.focusAreas.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete focus area:', error);
    return false;
  }
}

export async function getFocusAreaRevisions(focusAreaId: number): Promise<schema.FocusAreaRevision[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.focusAreaRevisions)
      .where(eq(schema.focusAreaRevisions.focusAreaId, focusAreaId))
      .orderBy(desc(schema.focusAreaRevisions.createdAt));
  } catch (error) {
    console.warn('Failed to fetch focus area revisions:', error);
    return [];
  }
}

export async function createFocusAreaRevision(data: schema.NewFocusAreaRevision): Promise<void> {
  if (!db) return;
  try {
    await db.insert(schema.focusAreaRevisions).values(data);
  } catch (error) {
    console.error('Failed to log focus area revision:', error);
  }
}

export async function getPublications(): Promise<schema.Publication[]> {
  const sortedInitial = [...initialPublications].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  if (!db) return sortedInitial;
  try {
    const res = await db.select().from(schema.publications).orderBy(desc(schema.publications.publishedAt));
    return res.length > 0 ? res : sortedInitial;
  } catch (error) {
    console.warn('Database query failed, using fallback publications data:', error);
    return sortedInitial;
  }
}

export async function getPublicationById(id: number): Promise<schema.Publication | null> {
  if (!db) {
    return initialPublications.find((p) => p.id === id) || null;
  }
  try {
    const res = await db.select().from(schema.publications).where(eq(schema.publications.id, id)).limit(1);
    return res[0] || initialPublications.find((p) => p.id === id) || null;
  } catch (error) {
    console.warn('Failed to fetch publication by id:', error);
    return initialPublications.find((p) => p.id === id) || null;
  }
}

export async function getPublicationBySlug(slug: string): Promise<schema.Publication | null> {
  if (!db) {
    return initialPublications.find((p) => p.slug === slug) || null;
  }
  try {
    const res = await db.select().from(schema.publications).where(eq(schema.publications.slug, slug)).limit(1);
    return res[0] || initialPublications.find((p) => p.slug === slug) || null;
  } catch (error) {
    console.warn('Failed to fetch publication by slug:', error);
    return initialPublications.find((p) => p.slug === slug) || null;
  }
}

export async function createPublication(data: schema.NewPublication): Promise<schema.Publication | null> {
  if (!db) return null;
  try {
    const res = await db.insert(schema.publications).values(data).returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to create publication:', error);
    throw error;
  }
}

export async function updatePublication(id: number, data: Partial<schema.NewPublication>): Promise<schema.Publication | null> {
  if (!db) return null;
  try {
    const res = await db
      .update(schema.publications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.publications.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update publication:', error);
    throw error;
  }
}

export async function deletePublication(id: number): Promise<boolean> {
  if (!db) return false;
  try {
    await db.delete(schema.publications).where(eq(schema.publications.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete publication:', error);
    return false;
  }
}

export async function incrementPublicationDownloadCount(id: number): Promise<void> {
  if (!db) return;
  try {
    await db
      .update(schema.publications)
      .set({
        downloadCount: dSql`COALESCE(${schema.publications.downloadCount}, 0) + 1`
      })
      .where(eq(schema.publications.id, id));
  } catch (error) {
    console.error('Failed to increment download count:', error);
  }
}

export async function getPublicationRevisions(publicationId: number): Promise<schema.PublicationRevision[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.publicationRevisions)
      .where(eq(schema.publicationRevisions.publicationId, publicationId))
      .orderBy(desc(schema.publicationRevisions.createdAt));
  } catch (error) {
    console.warn('Failed to fetch publication revisions:', error);
    return [];
  }
}

export async function createPublicationRevision(data: schema.NewPublicationRevision): Promise<void> {
  if (!db) return;
  try {
    await db.insert(schema.publicationRevisions).values(data);
  } catch (error) {
    console.error('Failed to log publication revision:', error);
  }
}

export async function getBlogPosts(): Promise<schema.BlogPost[]> {
  const sortedInitial = [...initialBlogs].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  if (!db) return sortedInitial;
  try {
    const res = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.publishedAt));
    return res.length > 0 ? res : sortedInitial;
  } catch (error) {
    console.warn('Database query failed, using fallback blogs data:', error);
    return sortedInitial;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<schema.BlogPost | null> {
  if (!db) {
    return initialBlogs.find((b) => b.slug === slug) || null;
  }
  try {
    const res = await db.select().from(schema.blogPosts);
    const found = res.find((b) => b.slug === slug);
    return found || initialBlogs.find((b) => b.slug === slug) || null;
  } catch (error) {
    console.warn('Database query failed, using fallback blog data:', error);
    return initialBlogs.find((b) => b.slug === slug) || null;
  }
}

export async function getBlogPostById(id: number): Promise<schema.BlogPost | null> {
  if (!db) {
    return initialBlogs.find((b) => b.id === id) || null;
  }
  try {
    const res = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, id)).limit(1);
    return res[0] || initialBlogs.find((b) => b.id === id) || null;
  } catch (error) {
    console.warn('Failed to fetch blog post by id:', error);
    return initialBlogs.find((b) => b.id === id) || null;
  }
}

export async function createBlogPost(data: schema.NewBlogPost): Promise<schema.BlogPost | null> {
  if (!db) return null;
  try {
    const res = await db.insert(schema.blogPosts).values(data).returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to create blog post:', error);
    throw error;
  }
}

export async function updateBlogPost(id: number, data: Partial<schema.NewBlogPost>): Promise<schema.BlogPost | null> {
  if (!db) return null;
  try {
    const res = await db
      .update(schema.blogPosts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.blogPosts.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update blog post:', error);
    throw error;
  }
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  if (!db) return false;
  try {
    await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete blog post:', error);
    return false;
  }
}

export async function getArticleRevisions(articleId: number): Promise<schema.ArticleRevision[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.articleRevisions)
      .where(eq(schema.articleRevisions.articleId, articleId))
      .orderBy(desc(schema.articleRevisions.createdAt));
  } catch (error) {
    console.warn('Failed to fetch article revisions:', error);
    return [];
  }
}

export async function createArticleRevision(data: schema.NewArticleRevision): Promise<void> {
  if (!db) return;
  try {
    await db.insert(schema.articleRevisions).values(data);
  } catch (error) {
    console.error('Failed to log article revision:', error);
  }
}

export async function getBlogComments(slug: string): Promise<schema.BlogComment[]> {
  if (!db) return [];
  try {
    const res = await db
      .select()
      .from(schema.blogComments)
      .where(eq(schema.blogComments.blogSlug, slug))
      .orderBy(desc(schema.blogComments.createdAt));
    return res;
  } catch (error) {
    return [];
  }
}

/**
 * Team Members Queries
 */
export async function getTeamMembers(): Promise<schema.TeamMember[]> {
  const fallback: schema.TeamMember[] = initialTeamMembers.map((tm, idx) => ({
    id: tm.id || idx + 1,
    slug: tm.slug || `member-${idx + 1}`,
    name: tm.name,
    role: tm.role,
    category: tm.category || 'leadership',
    bio: tm.bio,
    expertise: tm.expertise || null,
    qualifications: tm.qualifications || null,
    image: tm.image,
    email: tm.email || null,
    phone: tm.phone || null,
    linkedin: tm.linkedin || null,
    twitter: tm.twitter || null,
    facebook: tm.facebook || null,
    displayOrder: tm.displayOrder || idx + 1,
    isFeatured: tm.isFeatured || 'no',
    status: tm.status || 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  if (!db) return fallback;
  try {
    const res = await db.select().from(schema.teamMembers).orderBy(schema.teamMembers.displayOrder);
    return res.length > 0 ? res : fallback;
  } catch (error) {
    console.warn('Database query failed, using fallback team data:', error);
    return fallback;
  }
}

export async function getTeamMemberById(id: number): Promise<schema.TeamMember | null> {
  const members = await getTeamMembers();
  if (!db) {
    return members.find((m) => m.id === id) || null;
  }
  try {
    const res = await db.select().from(schema.teamMembers).where(eq(schema.teamMembers.id, id)).limit(1);
    return res[0] || members.find((m) => m.id === id) || null;
  } catch (error) {
    console.warn('Failed to fetch team member by id:', error);
    return members.find((m) => m.id === id) || null;
  }
}

export async function getTeamMemberBySlug(slug: string): Promise<schema.TeamMember | null> {
  const members = await getTeamMembers();
  if (!db) {
    return members.find((m) => m.slug === slug) || null;
  }
  try {
    const res = await db.select().from(schema.teamMembers).where(eq(schema.teamMembers.slug, slug)).limit(1);
    return res[0] || members.find((m) => m.slug === slug) || null;
  } catch (error) {
    console.warn('Failed to fetch team member by slug:', error);
    return members.find((m) => m.slug === slug) || null;
  }
}

export async function createTeamMember(data: schema.NewTeamMember): Promise<schema.TeamMember | null> {
  if (!db) return null;
  try {
    const res = await db.insert(schema.teamMembers).values(data).returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to create team member:', error);
    throw error;
  }
}

export async function updateTeamMember(id: number, data: Partial<schema.NewTeamMember>): Promise<schema.TeamMember | null> {
  if (!db) return null;
  try {
    const res = await db
      .update(schema.teamMembers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.teamMembers.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update team member:', error);
    throw error;
  }
}

export async function deleteTeamMember(id: number): Promise<boolean> {
  if (!db) return false;
  try {
    await db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete team member:', error);
    return false;
  }
}

export async function getTeamMemberRevisions(teamMemberId: number): Promise<schema.TeamMemberRevision[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.teamMemberRevisions)
      .where(eq(schema.teamMemberRevisions.teamMemberId, teamMemberId))
      .orderBy(desc(schema.teamMemberRevisions.createdAt));
  } catch (error) {
    console.warn('Failed to fetch team member revisions:', error);
    return [];
  }
}

export async function createTeamMemberRevision(data: schema.NewTeamMemberRevision): Promise<void> {
  if (!db) return;
  try {
    await db.insert(schema.teamMemberRevisions).values(data);
  } catch (error) {
    console.error('Failed to log team member revision:', error);
  }
}

/**
 * Website Pages Directory Queries
 */
export async function getSitePages(): Promise<schema.SitePage[]> {
  if (!db) {
    return initialSitePages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      status: p.status,
      lastUpdatedBy: p.lastUpdatedBy,
      updatedAt: new Date(),
      createdAt: new Date(),
    }));
  }
  try {
    const res = await db.select().from(schema.sitePages).orderBy(schema.sitePages.id);
    if (res.length > 0) return res;
    return initialSitePages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      status: p.status,
      lastUpdatedBy: p.lastUpdatedBy,
      updatedAt: new Date(),
      createdAt: new Date(),
    }));
  } catch (error) {
    console.warn('Failed to fetch site pages:', error);
    return initialSitePages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      status: p.status,
      lastUpdatedBy: p.lastUpdatedBy,
      updatedAt: new Date(),
      createdAt: new Date(),
    }));
  }
}

function mapInitialPage(p: any): schema.SitePage {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    status: p.status,
    lastUpdatedBy: p.lastUpdatedBy,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
}

export async function getSitePageBySlug(slug: string): Promise<schema.SitePage | null> {
  const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const fallback = initialSitePages.find((p) => p.slug === normalizedSlug || p.slug === slug);
  if (!db) {
    return fallback ? mapInitialPage(fallback) : null;
  }
  try {
    const res = await db
      .select()
      .from(schema.sitePages)
      .where(eq(schema.sitePages.slug, normalizedSlug))
      .limit(1);
    if (res.length > 0) return res[0];
    
    // Also try without leading slash
    const resWithoutSlash = await db
      .select()
      .from(schema.sitePages)
      .where(eq(schema.sitePages.slug, slug))
      .limit(1);
    if (resWithoutSlash.length > 0) return resWithoutSlash[0];

    return fallback ? mapInitialPage(fallback) : null;
  } catch (error) {
    console.warn('Failed to fetch site page by slug:', error);
    return fallback ? mapInitialPage(fallback) : null;
  }
}

export async function getSitePageById(id: number): Promise<schema.SitePage | null> {
  const fallback = initialSitePages.find((p) => p.id === id);
  if (!db) {
    return fallback ? mapInitialPage(fallback) : null;
  }
  try {
    const res = await db.select().from(schema.sitePages).where(eq(schema.sitePages.id, id)).limit(1);
    return res[0] || (fallback ? mapInitialPage(fallback) : null);
  } catch (error) {
    console.warn('Failed to fetch site page by id:', error);
    return fallback ? mapInitialPage(fallback) : null;
  }
}

export async function createSitePage(data: schema.NewSitePage): Promise<schema.SitePage | null> {
  if (!db) return null;
  try {
    const res = await db.insert(schema.sitePages).values(data).returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to create site page:', error);
    throw error;
  }
}

export async function updateSitePage(id: number, data: Partial<schema.NewSitePage>): Promise<schema.SitePage | null> {
  if (!db) return null;
  try {
    const res = await db
      .update(schema.sitePages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.sitePages.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update site page:', error);
    throw error;
  }
}

export async function deleteSitePage(id: number): Promise<boolean> {
  if (!db) return false;
  try {
    await db.delete(schema.sitePages).where(eq(schema.sitePages.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete site page:', error);
    return false;
  }
}

export async function getPageRevisions(pageId: number): Promise<schema.PageRevision[]> {
  if (!db) return [];
  try {
    return await db
      .select()
      .from(schema.pageRevisions)
      .where(eq(schema.pageRevisions.pageId, pageId))
      .orderBy(desc(schema.pageRevisions.createdAt));
  } catch (error) {
    console.warn('Failed to fetch page revisions:', error);
    return [];
  }
}

export async function createPageRevision(data: schema.NewPageRevision): Promise<void> {
  if (!db) return;
  try {
    await db.insert(schema.pageRevisions).values(data);
  } catch (error) {
    console.error('Failed to log page revision:', error);
  }
}

/**
 * Activity Logs Queries
 */
export async function getActivityLogs(limitCount = 10): Promise<schema.ActivityLog[]> {
  if (!db) {
    return initialActivityLogs.map((l) => ({
      id: l.id,
      adminEmail: l.adminEmail,
      adminName: l.adminName,
      action: l.action,
      entityType: l.entityType,
      entityTitle: l.entityTitle,
      details: l.details || null,
      createdAt: new Date(),
    }));
  }
  try {
    const res = await db.select().from(schema.activityLogs).orderBy(desc(schema.activityLogs.createdAt)).limit(limitCount);
    if (res.length > 0) return res;
    return initialActivityLogs.map((l) => ({
      id: l.id,
      adminEmail: l.adminEmail,
      adminName: l.adminName,
      action: l.action,
      entityType: l.entityType,
      entityTitle: l.entityTitle,
      details: l.details || null,
      createdAt: new Date(),
    }));
  } catch (error) {
    console.warn('Failed to fetch activity logs:', error);
    return [];
  }
}

export async function logAdminActivity(
  adminEmail: string,
  adminName: string,
  action: string,
  entityType: string,
  entityTitle: string,
  details?: string
): Promise<void> {
  if (!db) return;
  try {
    await db.insert(schema.activityLogs).values({
      adminEmail,
      adminName,
      action,
      entityType,
      entityTitle,
      details: details || null,
    });
  } catch (error) {
    console.error('Failed to log admin activity:', error);
  }
}

/**
 * Admin Authentication & Dashboard Queries
 */

export async function findAdminByEmail(email: string): Promise<schema.Admin | null> {
  if (!db) return null;
  try {
    const results = await db
      .select()
      .from(schema.admins)
      .where(eq(schema.admins.email, email.toLowerCase().trim()))
      .limit(1);
    return results[0] || null;
  } catch (error) {
    console.error('Failed to lookup admin by email:', error);
    return null;
  }
}

export async function getAllAdmins(): Promise<schema.Admin[]> {
  if (!db) return [];
  try {
    return await db.select().from(schema.admins).orderBy(schema.admins.id);
  } catch (error) {
    console.error('Failed to fetch admins:', error);
    return [];
  }
}

export async function getAdminById(id: number): Promise<schema.Admin | null> {
  if (!db) return null;
  try {
    const res = await db.select().from(schema.admins).where(eq(schema.admins.id, id)).limit(1);
    return res[0] || null;
  } catch (error) {
    console.error('Failed to get admin by id:', error);
    return null;
  }
}

export async function createAdmin(data: schema.NewAdmin): Promise<schema.Admin | null> {
  if (!db) return null;
  try {
    const res = await db.insert(schema.admins).values({
      ...data,
      email: data.email.toLowerCase().trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to create admin:', error);
    throw error;
  }
}

export async function updateAdmin(
  id: number,
  data: Partial<schema.NewAdmin>
): Promise<schema.Admin | null> {
  if (!db) return null;
  try {
    const updateData: any = { ...data, updatedAt: new Date() };
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase().trim();
    }
    const res = await db
      .update(schema.admins)
      .set(updateData)
      .where(eq(schema.admins.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update admin:', error);
    throw error;
  }
}

export async function deleteAdmin(id: number): Promise<boolean> {
  if (!db) return false;
  try {
    await db.delete(schema.admins).where(eq(schema.admins.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete admin:', error);
    return false;
  }
}

export async function updateAdminLastLogin(adminId: number): Promise<void> {
  if (!db) return;
  try {
    await db
      .update(schema.admins)
      .set({ lastLoginAt: new Date() })
      .where(eq(schema.admins.id, adminId));
  } catch (error) {
    console.error('Failed to update admin last login:', error);
  }
}

export interface UnifiedRevisionItem {
  id: number;
  entityType: 'Article' | 'Project' | 'Page' | 'Publication' | 'Focus Area' | 'Team Member';
  entityId: number;
  title: string;
  revisedBy: string;
  changeSummary: string | null;
  status: string | null;
  createdAt: Date;
}

export async function getAllRevisionsSummary(limitCount = 50): Promise<UnifiedRevisionItem[]> {
  const unified: UnifiedRevisionItem[] = [];
  if (!db) return unified;

  try {
    const [artRevs, projRevs, pageRevs, pubRevs, faRevs, tmRevs] = await Promise.all([
      db.select().from(schema.articleRevisions).orderBy(desc(schema.articleRevisions.createdAt)).limit(limitCount),
      db.select().from(schema.projectRevisions).orderBy(desc(schema.projectRevisions.createdAt)).limit(limitCount),
      db.select().from(schema.pageRevisions).orderBy(desc(schema.pageRevisions.createdAt)).limit(limitCount),
      db.select().from(schema.publicationRevisions).orderBy(desc(schema.publicationRevisions.createdAt)).limit(limitCount),
      db.select().from(schema.focusAreaRevisions).orderBy(desc(schema.focusAreaRevisions.createdAt)).limit(limitCount),
      db.select().from(schema.teamMemberRevisions).orderBy(desc(schema.teamMemberRevisions.createdAt)).limit(limitCount),
    ]);

    artRevs.forEach((r) => {
      unified.push({
        id: r.id,
        entityType: 'Article',
        entityId: r.articleId,
        title: r.title,
        revisedBy: r.revisedBy || 'Admin',
        changeSummary: r.changeSummary,
        status: r.status,
        createdAt: r.createdAt,
      });
    });

    projRevs.forEach((r) => {
      unified.push({
        id: r.id,
        entityType: 'Project',
        entityId: r.projectId,
        title: r.title,
        revisedBy: r.revisedBy || 'Admin',
        changeSummary: r.changeSummary,
        status: r.status,
        createdAt: r.createdAt,
      });
    });

    pageRevs.forEach((r) => {
      unified.push({
        id: r.id,
        entityType: 'Page',
        entityId: r.pageId,
        title: r.title,
        revisedBy: r.revisedBy || 'Admin',
        changeSummary: r.changeSummary,
        status: r.status,
        createdAt: r.createdAt,
      });
    });

    pubRevs.forEach((r) => {
      unified.push({
        id: r.id,
        entityType: 'Publication',
        entityId: r.publicationId,
        title: r.title,
        revisedBy: r.revisedBy || 'Admin',
        changeSummary: r.changeSummary,
        status: r.status,
        createdAt: r.createdAt,
      });
    });

    faRevs.forEach((r) => {
      unified.push({
        id: r.id,
        entityType: 'Focus Area',
        entityId: r.focusAreaId,
        title: r.title,
        revisedBy: r.revisedBy || 'Admin',
        changeSummary: r.changeSummary,
        status: r.status,
        createdAt: r.createdAt,
      });
    });

    tmRevs.forEach((r) => {
      unified.push({
        id: r.id,
        entityType: 'Team Member',
        entityId: r.teamMemberId,
        title: r.name,
        revisedBy: r.revisedBy || 'Admin',
        changeSummary: r.changeSummary,
        status: r.status,
        createdAt: r.createdAt,
      });
    });

    unified.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return unified.slice(0, limitCount);
  } catch (err) {
    console.error('Error fetching revisions summary:', err);
    return [];
  }
}

export interface DashboardMetricSummary {
  // Required feature stats
  totalArticles: number;
  totalProjects: number;
  totalPublications: number;
  totalTeamMembers: number;
  unreadInquiries: number;
  pendingContent: number;
  totalPages: number;
  totalAdmins: number;
  totalMedia: number;
  // Additional engagement metrics
  donationsCount: number;
  subscribersCount: number;
  partnerAppsCount: number;
  volunteerAppsCount: number;
  // Recent records
  recentContent: Array<{
    id: number | string;
    title: string;
    type: 'Article' | 'Project' | 'Publication' | 'Page';
    slug: string;
    updatedAt: Date | string;
    status: string;
    authorOrCategory?: string;
  }>;
  recentActivities: schema.ActivityLog[];
  recentInquiries: schema.ContactInquiry[];
}

export async function getDashboardStats(): Promise<DashboardMetricSummary> {
  const fallbackRecentContent = [
    {
      id: 'b1',
      title: 'AERC Calls for Immediate Government Action to Repeal EIs',
      type: 'Article' as const,
      slug: '/blog/aerc-marks-world-environment-day-with-community-dialogue-on-environmental-action-in-gbetsile',
      updatedAt: new Date().toISOString(),
      status: 'published',
      authorOrCategory: 'Climate Justice',
    },
    {
      id: 'p1',
      title: 'Green-Life Clubs',
      type: 'Project' as const,
      slug: '/projects/green-life-clubs',
      updatedAt: new Date().toISOString(),
      status: 'Active',
      authorOrCategory: 'Youth & Schools',
    },
    {
      id: 'pub1',
      title: 'Youth In Climate Action Report 2024',
      type: 'Publication' as const,
      slug: '/resources',
      updatedAt: new Date().toISOString(),
      status: 'published',
      authorOrCategory: 'Policy Brief',
    },
    {
      id: 'pg1',
      title: 'Support & Donate Page',
      type: 'Page' as const,
      slug: '/donate',
      updatedAt: new Date().toISOString(),
      status: 'published',
      authorOrCategory: 'Portal Page',
    },
  ];

  if (!db) {
    return {
      totalArticles: initialBlogs.length,
      totalProjects: initialProjects.length,
      totalPublications: initialPublications.length,
      totalTeamMembers: initialTeamMembers.length,
      unreadInquiries: 0,
      pendingContent: 0,
      totalPages: initialSitePages.length,
      totalAdmins: 1,
      totalMedia: initialMediaItems.length,
      donationsCount: 1,
      subscribersCount: 0,
      partnerAppsCount: 0,
      volunteerAppsCount: 0,
      recentContent: fallbackRecentContent,
      recentActivities: initialActivityLogs.map((l) => ({
        id: l.id,
        adminEmail: l.adminEmail,
        adminName: l.adminName,
        action: l.action,
        entityType: l.entityType,
        entityTitle: l.entityTitle,
        details: l.details || null,
        createdAt: new Date(),
      })),
      recentInquiries: [],
    };
  }

  try {
    const [
      blogsRes,
      pubsRes,
      projsRes,
      teamRes,
      pagesRes,
      adminsRes,
      inquiriesRes,
      partnerAppsRes,
      volunteersRes,
      subscribersRes,
      donationsRes,
      recentBlogs,
      recentProjects,
      activityLogsRes,
      allInquiries,
      mediaRes,
    ] = await Promise.all([
      db.select({ value: count() }).from(schema.blogPosts),
      db.select({ value: count() }).from(schema.publications),
      db.select({ value: count() }).from(schema.projects),
      db.select({ value: count() }).from(schema.teamMembers),
      db.select({ value: count() }).from(schema.sitePages),
      db.select({ value: count() }).from(schema.admins),
      db.select().from(schema.contactInquiries).orderBy(desc(schema.contactInquiries.createdAt)).limit(10),
      db.select({ value: count() }).from(schema.partnerApplications),
      db.select({ value: count() }).from(schema.volunteerApplications),
      db.select({ value: count() }).from(schema.newsletterSubscribers),
      db.select({ value: count() }).from(schema.donations),
      db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.publishedAt)).limit(4),
      db.select().from(schema.projects).limit(3),
      db.select().from(schema.activityLogs).orderBy(desc(schema.activityLogs.createdAt)).limit(8),
      db.select().from(schema.contactInquiries),
      db.select({ value: count() }).from(schema.mediaItems),
    ]);

    const totalArticles = Number(blogsRes[0]?.value ?? initialBlogs.length);
    const totalProjects = Number(projsRes[0]?.value ?? initialProjects.length);
    const totalPublications = Number(pubsRes[0]?.value ?? initialPublications.length);
    const totalTeamMembers = Number(teamRes[0]?.value ?? initialTeamMembers.length);
    const totalPages = Number(pagesRes[0]?.value ?? initialSitePages.length);
    const totalAdmins = Math.max(1, Number(adminsRes[0]?.value ?? 1));
    const totalMedia = Number(mediaRes[0]?.value ?? initialMediaItems.length);

    const unreadInquiries = allInquiries.filter((inq) => inq.status === 'unread').length;

    // Build unified recent content
    const unifiedContent = [
      ...recentBlogs.map((b) => ({
        id: b.id,
        title: b.title,
        type: 'Article' as const,
        slug: `/blog/${b.slug}`,
        updatedAt: b.updatedAt || b.publishedAt,
        status: b.status || 'published',
        authorOrCategory: b.category || b.author || 'News',
      })),
      ...recentProjects.map((p) => ({
        id: p.id,
        title: p.title,
        type: 'Project' as const,
        slug: `/projects/${p.slug}`,
        updatedAt: p.updatedAt || new Date(),
        status: p.status || 'Active',
        authorOrCategory: p.tag,
      })),
    ].slice(0, 6);

    return {
      totalArticles,
      totalProjects,
      totalPublications,
      totalTeamMembers,
      unreadInquiries,
      pendingContent: 0, // Currently all seeded items are active/published
      totalPages,
      totalAdmins,
      totalMedia,
      donationsCount: Number(donationsRes[0]?.value ?? 0),
      subscribersCount: Number(subscribersRes[0]?.value ?? 0),
      partnerAppsCount: Number(partnerAppsRes[0]?.value ?? 0),
      volunteerAppsCount: Number(volunteersRes[0]?.value ?? 0),
      recentContent: unifiedContent.length > 0 ? unifiedContent : fallbackRecentContent,
      recentActivities: activityLogsRes.length > 0 ? activityLogsRes : initialActivityLogs.map((l) => ({
        id: l.id,
        adminEmail: l.adminEmail,
        adminName: l.adminName,
        action: l.action,
        entityType: l.entityType,
        entityTitle: l.entityTitle,
        details: l.details || null,
        createdAt: new Date(),
      })),
      recentInquiries: inquiriesRes,
    };
  } catch (error) {
    console.error('Failed to retrieve full dashboard stats:', error);
    return {
      totalArticles: initialBlogs.length,
      totalProjects: initialProjects.length,
      totalPublications: initialPublications.length,
      totalTeamMembers: initialTeamMembers.length,
      unreadInquiries: 0,
      pendingContent: 0,
      totalPages: initialSitePages.length,
      totalAdmins: 1,
      totalMedia: initialMediaItems.length,
      donationsCount: 1,
      subscribersCount: 0,
      partnerAppsCount: 0,
      volunteerAppsCount: 0,
      recentContent: fallbackRecentContent,
      recentActivities: initialActivityLogs.map((l) => ({
        id: l.id,
        adminEmail: l.adminEmail,
        adminName: l.adminName,
        action: l.action,
        entityType: l.entityType,
        entityTitle: l.entityTitle,
        details: l.details || null,
        createdAt: new Date(),
      })),
      recentInquiries: [],
    };
  }
}

export async function getAllContactInquiries(): Promise<schema.ContactInquiry[]> {
  if (!db) return [];
  try {
    return await db.select().from(schema.contactInquiries).orderBy(desc(schema.contactInquiries.createdAt));
  } catch (error) {
    console.error('Failed to fetch contact inquiries:', error);
    return [];
  }
}

export async function getContactInquiryById(id: number): Promise<schema.ContactInquiry | null> {
  if (!db) return null;
  try {
    const res = await db.select().from(schema.contactInquiries).where(eq(schema.contactInquiries.id, id)).limit(1);
    return res[0] || null;
  } catch (error) {
    console.error('Failed to get contact inquiry by id:', error);
    return null;
  }
}

export async function createContactInquiry(data: schema.NewContactInquiry): Promise<schema.ContactInquiry | null> {
  if (!db) return null;
  try {
    const res = await db.insert(schema.contactInquiries).values({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to create contact inquiry:', error);
    throw error;
  }
}

export async function updateContactInquiry(
  id: number,
  data: Partial<schema.NewContactInquiry>
): Promise<schema.ContactInquiry | null> {
  if (!db) return null;
  try {
    const res = await db
      .update(schema.contactInquiries)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.contactInquiries.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update contact inquiry:', error);
    throw error;
  }
}

export async function deleteContactInquiry(id: number): Promise<boolean> {
  if (!db) return false;
  try {
    await db.delete(schema.contactInquiries).where(eq(schema.contactInquiries.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete contact inquiry:', error);
    return false;
  }
}

export async function getEnquiryNotificationSettings(): Promise<schema.EnquiryNotificationSettings | null> {
  if (!db) return null;
  try {
    const res = await db.select().from(schema.enquiryNotificationSettings).limit(1);
    if (res.length > 0) return res[0];

    const inserted = await db.insert(schema.enquiryNotificationSettings).values({
      id: 1,
      notificationRecipientEmail: 'info@aercghana.net',
      notificationsEnabled: 'yes',
      autoResponderEnabled: 'yes',
      autoResponderSubject: 'Thank you for contacting AERC Ghana',
      autoResponderMessage: 'Dear Sender,\n\nThank you for reaching out to the Alliance for Empowering Rural Communities (AERC Ghana). We have received your inquiry and our team is reviewing your message.\n\nWe will get back to you shortly.\n\nWarm regards,\nAERC Ghana Communications & Secretariat',
      spamProtectionLevel: 'standard',
      retentionDays: 365,
      anonymizeAfterRetention: 'yes',
    }).returning();
    return inserted[0] || null;
  } catch (error) {
    console.error('Failed to fetch enquiry notification settings:', error);
    return null;
  }
}

export async function updateEnquiryNotificationSettings(
  data: Partial<schema.NewEnquiryNotificationSettings>
): Promise<schema.EnquiryNotificationSettings | null> {
  if (!db) return null;
  try {
    const res = await db
      .update(schema.enquiryNotificationSettings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.enquiryNotificationSettings.id, 1))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update enquiry notification settings:', error);
    throw error;
  }
}

export async function cleanupExpiredInquiries(retentionDays = 365): Promise<number> {
  if (!db) return 0;
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const deleted = await db
      .delete(schema.contactInquiries)
      .where(lt(schema.contactInquiries.createdAt, cutoffDate))
      .returning();
    return deleted.length;
  } catch (error) {
    console.error('Failed to cleanup expired inquiries:', error);
    return 0;
  }
}

export async function getAllPartnerApplications(): Promise<schema.PartnerApplication[]> {
  if (!db) return [];
  try {
    return await db.select().from(schema.partnerApplications).orderBy(desc(schema.partnerApplications.createdAt));
  } catch (error) {
    console.error('Failed to fetch partner applications:', error);
    return [];
  }
}

export async function getAllVolunteerApplications(): Promise<schema.VolunteerApplication[]> {
  if (!db) return [];
  try {
    return await db.select().from(schema.volunteerApplications).orderBy(desc(schema.volunteerApplications.createdAt));
  } catch (error) {
    console.error('Failed to fetch volunteer applications:', error);
    return [];
  }
}

export async function getAllNewsletterSubscribers() {
  if (!db) return [];
  try {
    return await db.select().from(schema.newsletterSubscribers).orderBy(desc(schema.newsletterSubscribers.createdAt));
  } catch (error) {
    console.error('Failed to fetch newsletter subscribers:', error);
    return [];
  }
}

export async function getAllDonations(): Promise<schema.Donation[]> {
  if (!db) return [];
  try {
    return await db.select().from(schema.donations).orderBy(desc(schema.donations.createdAt));
  } catch (error) {
    console.error('Failed to fetch donations:', error);
    return [];
  }
}

// -------------------------------------------------------------
// Media Library & Usage Audit Operations
// -------------------------------------------------------------

export interface MediaUsage {
  entityType: 'Article' | 'Project' | 'Publication' | 'Team Member' | 'Focus Area' | 'Page' | 'Homepage Settings';
  title: string;
  field: string;
  link?: string;
}

export interface MediaUsageReport {
  isUsed: boolean;
  totalUsages: number;
  usages: MediaUsage[];
}

export async function getMediaItems(options?: {
  category?: string;
  search?: string;
  fileType?: string;
}): Promise<schema.MediaItem[]> {
  if (!db) {
    let items = [...initialMediaItems];
    if (options?.category && options.category !== 'All') {
      items = items.filter((m) => m.category === options.category);
    }
    if (options?.fileType) {
      if (options.fileType === 'image') {
        items = items.filter((m) => m.fileType.startsWith('image/'));
      } else if (options.fileType === 'document') {
        items = items.filter((m) => !m.fileType.startsWith('image/'));
      }
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      items = items.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.filename.toLowerCase().includes(q) ||
          (m.altText && m.altText.toLowerCase().includes(q)) ||
          (m.tags && m.tags.toLowerCase().includes(q))
      );
    }
    return items;
  }

  try {
    const res = await db.select().from(schema.mediaItems).orderBy(desc(schema.mediaItems.createdAt));
    let items = res.length > 0 ? res : initialMediaItems;
    if (options?.category && options.category !== 'All') {
      items = items.filter((m) => m.category === options.category);
    }
    if (options?.fileType) {
      if (options.fileType === 'image') {
        items = items.filter((m) => m.fileType.startsWith('image/'));
      } else if (options.fileType === 'document') {
        items = items.filter((m) => !m.fileType.startsWith('image/'));
      }
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      items = items.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.filename.toLowerCase().includes(q) ||
          (m.altText && m.altText.toLowerCase().includes(q)) ||
          (m.tags && m.tags.toLowerCase().includes(q))
      );
    }
    return items;
  } catch (error) {
    console.warn('Database query failed for media_items, falling back:', error);
    return initialMediaItems;
  }
}

export async function getMediaItemById(id: number): Promise<schema.MediaItem | null> {
  if (!db) {
    return initialMediaItems.find((m) => m.id === id) || null;
  }
  try {
    const res = await db.select().from(schema.mediaItems).where(eq(schema.mediaItems.id, id)).limit(1);
    return res[0] || initialMediaItems.find((m) => m.id === id) || null;
  } catch (error) {
    console.warn('Failed to fetch media item by id:', error);
    return initialMediaItems.find((m) => m.id === id) || null;
  }
}

export async function getMediaItemByUrl(url: string): Promise<schema.MediaItem | null> {
  if (!db) {
    return initialMediaItems.find((m) => m.url === url) || null;
  }
  try {
    const res = await db.select().from(schema.mediaItems).where(eq(schema.mediaItems.url, url)).limit(1);
    return res[0] || initialMediaItems.find((m) => m.url === url) || null;
  } catch (error) {
    console.warn('Failed to fetch media item by url:', error);
    return initialMediaItems.find((m) => m.url === url) || null;
  }
}

export async function createMediaItem(data: schema.NewMediaItem): Promise<schema.MediaItem | null> {
  if (!db) return null;
  try {
    const res = await db.insert(schema.mediaItems).values(data).returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to create media item:', error);
    throw error;
  }
}

export async function updateMediaItem(id: number, data: Partial<schema.NewMediaItem>): Promise<schema.MediaItem | null> {
  if (!db) return null;
  try {
    const res = await db
      .update(schema.mediaItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.mediaItems.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error('Failed to update media item:', error);
    throw error;
  }
}

export async function deleteMediaItem(id: number): Promise<boolean> {
  if (!db) return false;
  try {
    await db.delete(schema.mediaItems).where(eq(schema.mediaItems.id, id));
    return true;
  } catch (error) {
    console.error('Failed to delete media item:', error);
    return false;
  }
}

/**
 * Identify where media is used across pages, articles, projects, publications, team, and focus areas.
 * Guardrail required before deleting media.
 */
export async function checkMediaUsage(url: string, filename?: string): Promise<MediaUsageReport> {
  const usages: MediaUsage[] = [];
  if (!url) return { isUsed: false, totalUsages: 0, usages: [] };

  const urlLower = url.toLowerCase();
  const fileLower = filename ? filename.toLowerCase() : '';
  const urlBaseName = url.split('/').pop()?.toLowerCase() || '';

  const matchesStr = (targetStr?: string | null) => {
    if (!targetStr) return false;
    const t = targetStr.toLowerCase();
    if (t.includes(urlLower)) return true;
    if (fileLower && t.includes(fileLower)) return true;
    if (urlBaseName && urlBaseName.length > 4 && t.includes(urlBaseName)) return true;
    return false;
  };

  try {
    // 1. Articles & News
    const blogs = await getBlogPosts();
    for (const b of blogs) {
      if (matchesStr(b.coverImage)) {
        usages.push({
          entityType: 'Article',
          title: b.title,
          field: 'Cover Image',
          link: `/news/${b.slug}`,
        });
      } else if (matchesStr(b.content)) {
        usages.push({
          entityType: 'Article',
          title: b.title,
          field: 'Body Content',
          link: `/news/${b.slug}`,
        });
      }
    }

    // 2. Projects
    const projects = await getProjects();
    for (const p of projects) {
      if (matchesStr(p.coverImage)) {
        usages.push({
          entityType: 'Project',
          title: p.title,
          field: 'Cover Image',
          link: `/projects/${p.slug}`,
        });
      } else if (matchesStr(p.bannerImage)) {
        usages.push({
          entityType: 'Project',
          title: p.title,
          field: 'Banner Image',
          link: `/projects/${p.slug}`,
        });
      } else if (matchesStr(p.galleryImages)) {
        usages.push({
          entityType: 'Project',
          title: p.title,
          field: 'Gallery',
          link: `/projects/${p.slug}`,
        });
      } else if (matchesStr(p.description)) {
        usages.push({
          entityType: 'Project',
          title: p.title,
          field: 'Description',
          link: `/projects/${p.slug}`,
        });
      }
    }

    // 3. Publications & Reports
    const publications = await getPublications();
    for (const pub of publications) {
      if (matchesStr(pub.coverImage)) {
        usages.push({
          entityType: 'Publication',
          title: pub.title,
          field: 'Cover Image',
          link: `/resources`,
        });
      } else if (matchesStr(pub.downloadUrl)) {
        usages.push({
          entityType: 'Publication',
          title: pub.title,
          field: 'Downloadable File URL',
          link: `/resources`,
        });
      }
    }

    // 4. Team Members
    const team = await getTeamMembers();
    for (const tm of team) {
      if (matchesStr(tm.image)) {
        usages.push({
          entityType: 'Team Member',
          title: tm.name,
          field: 'Profile Photo',
          link: `/team`,
        });
      }
    }

    // 5. Focus Areas
    const focus = await getFocusAreas();
    for (const fa of focus) {
      if (matchesStr(fa.image)) {
        usages.push({
          entityType: 'Focus Area',
          title: fa.title,
          field: 'Strategic Graphic',
          link: `/focus/${fa.slug}`,
        });
      }
    }

    // 6. Site Pages
    const pages = await getSitePages();
    for (const page of pages) {
      if (matchesStr(page.heroImage)) {
        usages.push({
          entityType: 'Page',
          title: page.title,
          field: 'Hero Banner',
          link: `/${page.slug === 'home' ? '' : page.slug}`,
        });
      } else if (matchesStr(page.sectionsJson) || matchesStr(page.content)) {
        usages.push({
          entityType: 'Page',
          title: page.title,
          field: 'Page Content/Section',
          link: `/${page.slug === 'home' ? '' : page.slug}`,
        });
      }
    }

    // 7. Homepage Settings
    const home = await getHomepageSettings();
    if (matchesStr(home.heroBgImage)) {
      usages.push({
        entityType: 'Homepage Settings',
        title: 'Homepage',
        field: 'Hero Background Banner',
        link: '/admin/homepage',
      });
    }
    if (matchesStr(home.introImage)) {
      usages.push({
        entityType: 'Homepage Settings',
        title: 'Homepage',
        field: 'Introduction Image',
        link: '/admin/homepage',
      });
    }
    if (matchesStr(home.aboutImage)) {
      usages.push({
        entityType: 'Homepage Settings',
        title: 'Homepage',
        field: 'About / How We Work Image',
        link: '/admin/homepage',
      });
    }
    if (matchesStr(home.focusImage)) {
      usages.push({
        entityType: 'Homepage Settings',
        title: 'Homepage',
        field: 'Focus Areas Graphic',
        link: '/admin/homepage',
      });
    }
  } catch (err) {
    console.error('Error during checkMediaUsage:', err);
  }

  return {
    isUsed: usages.length > 0,
    totalUsages: usages.length,
    usages,
  };
}

/**
 * Homepage Settings Query & Mutation Handlers
 */
export async function getHomepageSettings(): Promise<schema.HomepageSettings> {
  if (!db) return initialHomepageSettings;
  try {
    const res = await db.select().from(schema.homepageSettings).where(eq(schema.homepageSettings.id, 1)).limit(1);
    if (res.length > 0 && res[0]) {
      return res[0];
    }
    return initialHomepageSettings;
  } catch (error) {
    console.warn('Database query failed for homepageSettings, using fallback:', error);
    return initialHomepageSettings;
  }
}

export async function updateHomepageSettings(
  data: Partial<schema.NewHomepageSettings>
): Promise<schema.HomepageSettings | null> {
  if (!db) return null;
  try {
    const existing = await db.select().from(schema.homepageSettings).where(eq(schema.homepageSettings.id, 1)).limit(1);
    if (existing.length === 0) {
      const inserted = await db.insert(schema.homepageSettings).values({
        ...initialHomepageSettings,
        ...data,
        id: 1,
        updatedAt: new Date(),
      }).returning();
      return inserted[0] || null;
    }

    const updated = await db
      .update(schema.homepageSettings)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.homepageSettings.id, 1))
      .returning();

    return updated[0] || null;
  } catch (error) {
    console.error('Failed to update homepage settings:', error);
    throw error;
  }
}



