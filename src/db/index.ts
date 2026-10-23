import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { desc, eq } from 'drizzle-orm';
import * as schema from './schema';
import { initialBlogs, initialProjects, initialPublications } from './seed-data';

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

