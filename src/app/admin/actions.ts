'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  findAdminByEmail,
  updateAdminLastLogin,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostById,
  createArticleRevision,
  getSitePageById,
  createSitePage,
  updateSitePage,
  deleteSitePage,
  createPageRevision,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createProjectRevision,
  getFocusAreaById,
  createFocusArea,
  updateFocusArea,
  deleteFocusArea,
  createFocusAreaRevision,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  createPublicationRevision,
  incrementPublicationDownloadCount,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  createTeamMemberRevision,
  logAdminActivity,
  getMediaItems,
  getMediaItemById,
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
  checkMediaUsage,
  getHomepageSettings,
  updateHomepageSettings,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '@/db';
import {
  verifyPassword,
  hashPassword,
  signSessionToken,
  setSessionCookie,
  clearSessionCookie,
  requireAdmin,
} from '@/lib/auth';
import { uploadFileToStorage, deleteMediaFile } from '@/lib/cloudinary';

export interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Administrator login server action
 */
export async function loginAdminAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Please provide both email and password.' };
  }

  try {
    const admin = await findAdminByEmail(email);
    if (!admin) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (admin.status === 'inactive' || admin.status === 'suspended') {
      return { success: false, error: 'This administrator account is deactivated. Please contact Super Admin.' };
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Update last login timestamp in background
    await updateAdminLastLogin(admin.id);

    // Record login activity
    await logAdminActivity(
      admin.email,
      admin.name,
      'login',
      'user',
      'Administrator Sign In',
      `Successful sign in to AERC portal (${admin.role})`
    );

    // Create session token & HTTP-only cookie
    const token = await signSessionToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    await setSessionCookie(token);
  } catch (error) {
    console.error('Login action error:', error);
    return { success: false, error: 'An unexpected authentication error occurred.' };
  }

  revalidatePath('/admin');
  redirect('/admin');
}

/**
 * Administrator logout server action
 */
export async function logoutAdminAction(): Promise<void> {
  await clearSessionCookie();
  revalidatePath('/admin');
  redirect('/admin/login');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createArticleAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  const rawSlug = (formData.get('slug') as string)?.trim();
  const excerpt = (formData.get('excerpt') as string)?.trim() || null;
  const content = (formData.get('content') as string)?.trim();
  const coverImage = (formData.get('coverImage') as string)?.trim() || '/images/hero-community.jpg';
  const imageCaption = (formData.get('imageCaption') as string)?.trim() || null;
  const imageAlt = (formData.get('imageAlt') as string)?.trim() || null;
  const category = (formData.get('category') as string)?.trim() || 'Climate Change';
  const tags = (formData.get('tags') as string)?.trim() || null;
  const author = (formData.get('author') as string)?.trim() || session.name || 'AERC Editorial Team';
  const status = (formData.get('status') as string)?.trim() || 'published';
  const seoTitle = (formData.get('seoTitle') as string)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string)?.trim() || null;
  const scheduledForRaw = formData.get('scheduledFor') as string;
  const publishedAtRaw = formData.get('publishedAt') as string;

  if (!title || !content) {
    throw new Error('Please provide both an article title and content body.');
  }

  const slug = rawSlug ? slugify(rawSlug) : slugify(title);
  const scheduledFor = scheduledForRaw ? new Date(scheduledForRaw) : null;
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();

  try {
    const created = await createBlogPost({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      imageCaption,
      imageAlt,
      category,
      tags,
      author,
      status,
      seoTitle,
      seoDescription,
      scheduledFor,
      publishedAt,
    });

    if (!created) {
      throw new Error('Failed to create article in database.');
    }

    await logAdminActivity(
      session.email,
      session.name,
      'create',
      'article',
      title,
      `Created article with status [${status}] in category [${category}]`
    );
  } catch (error: any) {
    console.error('Failed to create article:', error);
    if (error?.message?.includes('unique') || error?.code === '23505') {
      throw new Error('An article with this URL slug already exists. Please customize the slug.');
    }
    throw error;
  }

  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/blogs');
  redirect('/admin/blogs');
}

export async function updateArticleAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const idRaw = formData.get('id') as string;
  const id = Number(idRaw);
  if (!id) {
    throw new Error('Invalid article ID.');
  }

  const title = (formData.get('title') as string)?.trim();
  const rawSlug = (formData.get('slug') as string)?.trim();
  const excerpt = (formData.get('excerpt') as string)?.trim() || null;
  const content = (formData.get('content') as string)?.trim();
  const coverImage = (formData.get('coverImage') as string)?.trim() || '/images/hero-community.jpg';
  const imageCaption = (formData.get('imageCaption') as string)?.trim() || null;
  const imageAlt = (formData.get('imageAlt') as string)?.trim() || null;
  const category = (formData.get('category') as string)?.trim() || 'Climate Change';
  const tags = (formData.get('tags') as string)?.trim() || null;
  const author = (formData.get('author') as string)?.trim() || session.name;
  const status = (formData.get('status') as string)?.trim() || 'published';
  const seoTitle = (formData.get('seoTitle') as string)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string)?.trim() || null;
  const changeSummary = (formData.get('changeSummary') as string)?.trim() || 'Updated content';
  const scheduledForRaw = formData.get('scheduledFor') as string;

  if (!title || !content) {
    throw new Error('Title and content cannot be empty.');
  }

  const slug = rawSlug ? slugify(rawSlug) : slugify(title);
  const scheduledFor = scheduledForRaw ? new Date(scheduledForRaw) : null;

  try {
    // 1. Fetch current version to archive in revision history
    const current = await getBlogPostById(id);
    if (current) {
      await createArticleRevision({
        articleId: id,
        title: current.title,
        excerpt: current.excerpt,
        content: current.content,
        author: current.author,
        status: current.status || 'published',
        revisedBy: session.name || session.email,
        changeSummary,
      });
    }

    // 2. Perform article update
    const updated = await updateBlogPost(id, {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      imageCaption,
      imageAlt,
      category,
      tags,
      author,
      status,
      seoTitle,
      seoDescription,
      scheduledFor,
    });

    if (!updated) {
      throw new Error('Article update failed.');
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'article',
      title,
      `Updated article. Summary: ${changeSummary}`
    );
  } catch (error: any) {
    console.error('Failed to update article:', error);
    throw error;
  }

  revalidatePath('/blog');
  revalidatePath(`/blog/${slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/blogs');
  redirect('/admin/blogs');
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const idRaw = formData.get('id') as string;
  const id = Number(idRaw);

  if (!id) {
    throw new Error('Invalid article ID.');
  }

  try {
    const existing = await getBlogPostById(id);
    await deleteBlogPost(id);

    await logAdminActivity(
      session.email,
      session.name,
      'delete',
      'article',
      existing?.title || `Article #${id}`,
      `Deleted article ID ${id}`
    );
  } catch (error: any) {
    console.error('Failed to delete article:', error);
    throw error;
  }

  revalidatePath('/blog');
  revalidatePath('/admin');
  revalidatePath('/admin/blogs');
  redirect('/admin/blogs');
}

export async function updateArticleStatusAction(articleId: number, status: string): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updateBlogPost(articleId, { status });
    if (!updated) {
      return { success: false, error: 'Failed to update status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'article',
      updated.title,
      `Changed publication status to [${status}]`
    );

    revalidatePath('/blog');
    revalidatePath('/admin');
    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (error) {
    console.error('Failed to update article status:', error);
    return { success: false, error: 'Failed to update status.' };
  }
}

/**
 * Pages Management Server Actions
 */

export async function createPageAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  let rawSlug = (formData.get('slug') as string)?.trim();
  if (rawSlug && !rawSlug.startsWith('/')) {
    rawSlug = '/' + slugify(rawSlug);
  }
  const slug = rawSlug;

  const description = (formData.get('description') as string)?.trim() || null;
  const pageType = (formData.get('pageType') as string)?.trim() || 'standard';
  const heroHeadline = (formData.get('heroHeadline') as string)?.trim() || null;
  const heroSubtitle = (formData.get('heroSubtitle') as string)?.trim() || null;
  const heroImage = (formData.get('heroImage') as string)?.trim() || null;
  const heroCtaText = (formData.get('heroCtaText') as string)?.trim() || null;
  const heroCtaLink = (formData.get('heroCtaLink') as string)?.trim() || null;
  const content = (formData.get('content') as string)?.trim() || null;
  const sectionsJson = (formData.get('sectionsJson') as string)?.trim() || null;
  const seoTitle = (formData.get('seoTitle') as string)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string)?.trim() || null;
  const status = (formData.get('status') as string)?.trim() || 'draft';
  const scheduledForRaw = (formData.get('scheduledFor') as string)?.trim();
  const scheduledFor = scheduledForRaw ? new Date(scheduledForRaw) : null;
  const changeSummary = (formData.get('changeSummary') as string)?.trim() || 'Initial page draft created';

  if (!title || !slug) {
    throw new Error('Page title and slug are required.');
  }

  try {
    const created = await createSitePage({
      slug,
      title,
      description,
      pageType,
      heroHeadline,
      heroSubtitle,
      heroImage,
      heroCtaText,
      heroCtaLink,
      content,
      sectionsJson,
      seoTitle,
      seoDescription,
      status,
      scheduledFor,
      lastUpdatedBy: session.name,
    });

    if (created) {
      await createPageRevision({
        pageId: created.id,
        title: created.title,
        slug: created.slug,
        heroHeadline: created.heroHeadline,
        heroSubtitle: created.heroSubtitle,
        content: created.content,
        sectionsJson: created.sectionsJson,
        status: created.status,
        revisedBy: session.name,
        changeSummary,
      });

      await logAdminActivity(
        session.email,
        session.name,
        'create',
        'page',
        created.title,
        `Created page "${created.title}" (${created.slug}) with status [${created.status}]`
      );
    }
  } catch (error: any) {
    console.error('Failed to create page:', error);
    throw error;
  }

  revalidatePath(slug);
  revalidatePath('/admin');
  revalidatePath('/admin/pages');
  redirect('/admin/pages');
}

export async function updatePageAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const idRaw = formData.get('id') as string;
  const id = Number(idRaw);

  if (!id) {
    throw new Error('Invalid page ID.');
  }

  const title = (formData.get('title') as string)?.trim();
  let rawSlug = (formData.get('slug') as string)?.trim();
  if (rawSlug && !rawSlug.startsWith('/')) {
    rawSlug = '/' + slugify(rawSlug);
  }
  const slug = rawSlug;

  const description = (formData.get('description') as string)?.trim() || null;
  const pageType = (formData.get('pageType') as string)?.trim() || 'standard';
  const heroHeadline = (formData.get('heroHeadline') as string)?.trim() || null;
  const heroSubtitle = (formData.get('heroSubtitle') as string)?.trim() || null;
  const heroImage = (formData.get('heroImage') as string)?.trim() || null;
  const heroCtaText = (formData.get('heroCtaText') as string)?.trim() || null;
  const heroCtaLink = (formData.get('heroCtaLink') as string)?.trim() || null;
  const content = (formData.get('content') as string)?.trim() || null;
  const sectionsJson = (formData.get('sectionsJson') as string)?.trim() || null;
  const seoTitle = (formData.get('seoTitle') as string)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string)?.trim() || null;
  const status = (formData.get('status') as string)?.trim() || 'published';
  const scheduledForRaw = (formData.get('scheduledFor') as string)?.trim();
  const scheduledFor = scheduledForRaw ? new Date(scheduledForRaw) : null;
  const changeSummary = (formData.get('changeSummary') as string)?.trim() || 'Page content updated';

  if (!title || !slug) {
    throw new Error('Page title and slug are required.');
  }

  try {
    const updated = await updateSitePage(id, {
      slug,
      title,
      description,
      pageType,
      heroHeadline,
      heroSubtitle,
      heroImage,
      heroCtaText,
      heroCtaLink,
      content,
      sectionsJson,
      seoTitle,
      seoDescription,
      status,
      scheduledFor,
      lastUpdatedBy: session.name,
    });

    if (updated) {
      await createPageRevision({
        pageId: updated.id,
        title: updated.title,
        slug: updated.slug,
        heroHeadline: updated.heroHeadline,
        heroSubtitle: updated.heroSubtitle,
        content: updated.content,
        sectionsJson: updated.sectionsJson,
        status: updated.status,
        revisedBy: session.name,
        changeSummary,
      });

      await logAdminActivity(
        session.email,
        session.name,
        'update',
        'page',
        updated.title,
        `Updated page "${updated.title}" (${updated.slug}). Summary: ${changeSummary}`
      );
    }
  } catch (error: any) {
    console.error('Failed to update page:', error);
    throw error;
  }

  revalidatePath(slug);
  revalidatePath('/admin');
  revalidatePath('/admin/pages');
  redirect('/admin/pages');
}

export async function deletePageAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const idRaw = formData.get('id') as string;
  const id = Number(idRaw);

  if (!id) {
    throw new Error('Invalid page ID.');
  }

  try {
    const existing = await getSitePageById(id);
    await deleteSitePage(id);

    await logAdminActivity(
      session.email,
      session.name,
      'delete',
      'page',
      existing?.title || `Page #${id}`,
      `Deleted page "${existing?.title}" (${existing?.slug})`
    );
  } catch (error: any) {
    console.error('Failed to delete page:', error);
    throw error;
  }

  revalidatePath('/admin');
  revalidatePath('/admin/pages');
  redirect('/admin/pages');
}

export async function updatePageStatusAction(pageId: number, status: string): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updateSitePage(pageId, { status, lastUpdatedBy: session.name });
    if (!updated) {
      return { success: false, error: 'Failed to update page status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'page',
      updated.title,
      `Changed page visibility status to [${status}]`
    );

    revalidatePath(updated.slug);
    revalidatePath('/admin');
    revalidatePath('/admin/pages');
    return { success: true };
  } catch (error) {
    console.error('Failed to update page status:', error);
    return { success: false, error: 'Failed to update page status.' };
  }
}

/**
 * Projects Management Server Actions
 */

export async function createProjectAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  const rawSlug = (formData.get('slug') as string)?.trim();
  const slug = rawSlug ? slugify(rawSlug) : slugify(title);

  const tag = (formData.get('tag') as string)?.trim() || 'Climate Action';
  const focusArea = (formData.get('focusArea') as string)?.trim() || tag;
  const summary = (formData.get('summary') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || summary;
  const objectives = (formData.get('objectives') as string)?.trim() || null;
  const location = (formData.get('location') as string)?.trim() || 'Ghana';
  const startDate = (formData.get('startDate') as string)?.trim() || null;
  const endDate = (formData.get('endDate') as string)?.trim() || null;
  const partners = (formData.get('partners') as string)?.trim() || null;
  const funders = (formData.get('funders') as string)?.trim() || null;
  const activities = (formData.get('activities') as string)?.trim() || null;
  const outcomes = (formData.get('outcomes') as string)?.trim() || null;
  const impactStats = (formData.get('impactStats') as string)?.trim() || null;
  const coverImage = (formData.get('coverImage') as string)?.trim() || '/images/hero-community.jpg';
  const bannerImage = (formData.get('bannerImage') as string)?.trim() || null;
  const galleryImages = (formData.get('galleryImages') as string)?.trim() || null;
  const externalLink = (formData.get('externalLink') as string)?.trim() || null;
  const isFeatured = (formData.get('isFeatured') as string)?.trim() || 'no';
  const isPublic = (formData.get('isPublic') as string)?.trim() || 'yes';
  const relatedPublications = (formData.get('relatedPublications') as string)?.trim() || null;
  const relatedNews = (formData.get('relatedNews') as string)?.trim() || null;
  const status = (formData.get('status') as string)?.trim() || 'Ongoing';
  const changeSummary = (formData.get('changeSummary') as string)?.trim() || 'Initial project draft created';

  if (!title || !slug || !summary) {
    throw new Error('Project title, slug, and summary are required.');
  }

  try {
    const created = await createProject({
      title,
      slug,
      tag,
      focusArea,
      summary,
      description,
      objectives,
      location,
      startDate,
      endDate,
      partners,
      funders,
      activities,
      outcomes,
      impactStats,
      coverImage,
      bannerImage,
      galleryImages,
      externalLink,
      isFeatured,
      isPublic,
      relatedPublications,
      relatedNews,
      status,
    });

    if (created) {
      await createProjectRevision({
        projectId: created.id,
        title: created.title,
        slug: created.slug,
        tag: created.tag,
        summary: created.summary,
        description: created.description,
        status: created.status,
        revisedBy: session.name,
        changeSummary,
      });

      await logAdminActivity(
        session.email,
        session.name,
        'create',
        'project',
        created.title,
        `Created new project "${created.title}" with status [${created.status}]`
      );
    }
  } catch (error: any) {
    console.error('Failed to create project:', error);
    throw error;
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${slug}`);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

export async function updateProjectAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const idRaw = formData.get('id') as string;
  const id = Number(idRaw);

  if (!id) {
    throw new Error('Invalid project ID.');
  }

  const title = (formData.get('title') as string)?.trim();
  const rawSlug = (formData.get('slug') as string)?.trim();
  const slug = rawSlug ? slugify(rawSlug) : slugify(title);

  const tag = (formData.get('tag') as string)?.trim() || 'Climate Action';
  const focusArea = (formData.get('focusArea') as string)?.trim() || tag;
  const summary = (formData.get('summary') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || summary;
  const objectives = (formData.get('objectives') as string)?.trim() || null;
  const location = (formData.get('location') as string)?.trim() || 'Ghana';
  const startDate = (formData.get('startDate') as string)?.trim() || null;
  const endDate = (formData.get('endDate') as string)?.trim() || null;
  const partners = (formData.get('partners') as string)?.trim() || null;
  const funders = (formData.get('funders') as string)?.trim() || null;
  const activities = (formData.get('activities') as string)?.trim() || null;
  const outcomes = (formData.get('outcomes') as string)?.trim() || null;
  const impactStats = (formData.get('impactStats') as string)?.trim() || null;
  const coverImage = (formData.get('coverImage') as string)?.trim() || '/images/hero-community.jpg';
  const bannerImage = (formData.get('bannerImage') as string)?.trim() || null;
  const galleryImages = (formData.get('galleryImages') as string)?.trim() || null;
  const externalLink = (formData.get('externalLink') as string)?.trim() || null;
  const isFeatured = (formData.get('isFeatured') as string)?.trim() || 'no';
  const isPublic = (formData.get('isPublic') as string)?.trim() || 'yes';
  const relatedPublications = (formData.get('relatedPublications') as string)?.trim() || null;
  const relatedNews = (formData.get('relatedNews') as string)?.trim() || null;
  const status = (formData.get('status') as string)?.trim() || 'Ongoing';
  const changeSummary = (formData.get('changeSummary') as string)?.trim() || 'Project updated';

  if (!title || !slug || !summary) {
    throw new Error('Project title, slug, and summary are required.');
  }

  try {
    const updated = await updateProject(id, {
      title,
      slug,
      tag,
      focusArea,
      summary,
      description,
      objectives,
      location,
      startDate,
      endDate,
      partners,
      funders,
      activities,
      outcomes,
      impactStats,
      coverImage,
      bannerImage,
      galleryImages,
      externalLink,
      isFeatured,
      isPublic,
      relatedPublications,
      relatedNews,
      status,
    });

    if (updated) {
      await createProjectRevision({
        projectId: updated.id,
        title: updated.title,
        slug: updated.slug,
        tag: updated.tag,
        summary: updated.summary,
        description: updated.description,
        status: updated.status,
        revisedBy: session.name,
        changeSummary,
      });

      await logAdminActivity(
        session.email,
        session.name,
        'update',
        'project',
        updated.title,
        `Updated project "${updated.title}". Summary: ${changeSummary}`
      );
    }
  } catch (error: any) {
    console.error('Failed to update project:', error);
    throw error;
  }

  revalidatePath('/projects');
  revalidatePath(`/projects/${slug}`);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const idRaw = formData.get('id') as string;
  const id = Number(idRaw);

  if (!id) {
    throw new Error('Invalid project ID.');
  }

  try {
    const existing = await getProjectById(id);
    await deleteProject(id);

    await logAdminActivity(
      session.email,
      session.name,
      'delete',
      'project',
      existing?.title || `Project #${id}`,
      `Deleted project ID ${id}`
    );
  } catch (error: any) {
    console.error('Failed to delete project:', error);
    throw error;
  }

  revalidatePath('/projects');
  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

export async function updateProjectStatusAction(projectId: number, status: string): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updateProject(projectId, { status });
    if (!updated) {
      return { success: false, error: 'Failed to update project status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'project',
      updated.title,
      `Changed project status to [${status}]`
    );

    revalidatePath('/projects');
    revalidatePath(`/projects/${updated.slug}`);
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error) {
    console.error('Failed to update project status:', error);
    return { success: false, error: 'Failed to update project status.' };
  }
}

export async function toggleProjectFeaturedAction(projectId: number, isFeatured: boolean): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updateProject(projectId, { isFeatured: isFeatured ? 'yes' : 'no' });
    if (!updated) {
      return { success: false, error: 'Failed to toggle featured status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'project',
      updated.title,
      `${isFeatured ? 'Featured' : 'Unfeatured'} project on homepage`
    );

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle featured status:', error);
    return { success: false, error: 'Failed to toggle featured status.' };
  }
}

/**
 * Focus Areas & Strategic Pillars Server Actions
 */

export async function createFocusAreaAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const parentPillar = (formData.get('parentPillar') as string)?.trim() || 'Environment & Climate';
  const summary = (formData.get('summary') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || '';
  const icon = (formData.get('icon') as string)?.trim() || 'fa-leaf';
  const image = (formData.get('image') as string)?.trim() || null;
  const tags = (formData.get('tags') as string)?.trim() || null;
  const displayOrderRaw = formData.get('displayOrder') as string;
  const displayOrder = displayOrderRaw ? parseInt(displayOrderRaw, 10) : 1;
  const isFeatured = (formData.get('isFeatured') as string) === 'yes' ? 'yes' : 'no';
  const status = (formData.get('status') as string) || 'active';

  if (!title) {
    throw new Error('Focus area title is required.');
  }

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  try {
    const created = await createFocusArea({
      title,
      slug,
      parentPillar,
      summary,
      description,
      icon,
      image,
      tags,
      displayOrder,
      isFeatured,
      status,
    });

    if (created) {
      await createFocusAreaRevision({
        focusAreaId: created.id,
        title: created.title,
        slug: created.slug,
        parentPillar: created.parentPillar,
        summary: created.summary,
        description: created.description,
        status: created.status,
        revisedBy: session.name,
        changeSummary: 'Initial focus area creation',
      });
    }

    await logAdminActivity(
      session.email,
      session.name,
      'create',
      'focus_area',
      title,
      `Created focus area under ${parentPillar}`
    );
  } catch (error: any) {
    console.error('Failed to create focus area:', error);
    throw error;
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/focus');
  revalidatePath(`/focus/${slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/focus-areas');
  redirect('/admin/focus-areas');
}

export async function updateFocusAreaAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const idRaw = formData.get('id') as string;
  const id = parseInt(idRaw, 10);
  if (!id) {
    throw new Error('Focus area ID is required for update.');
  }

  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const parentPillar = (formData.get('parentPillar') as string)?.trim() || 'Environment & Climate';
  const summary = (formData.get('summary') as string)?.trim() || '';
  const description = (formData.get('description') as string)?.trim() || '';
  const icon = (formData.get('icon') as string)?.trim() || 'fa-leaf';
  const image = (formData.get('image') as string)?.trim() || null;
  const tags = (formData.get('tags') as string)?.trim() || null;
  const displayOrderRaw = formData.get('displayOrder') as string;
  const displayOrder = displayOrderRaw ? parseInt(displayOrderRaw, 10) : 1;
  const isFeatured = (formData.get('isFeatured') as string) === 'yes' ? 'yes' : 'no';
  const status = (formData.get('status') as string) || 'active';
  const changeSummary = (formData.get('changeSummary') as string)?.trim() || 'Updated focus area details';

  if (!title) {
    throw new Error('Focus area title is required.');
  }

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  try {
    const updated = await updateFocusArea(id, {
      title,
      slug,
      parentPillar,
      summary,
      description,
      icon,
      image,
      tags,
      displayOrder,
      isFeatured,
      status,
    });

    if (updated) {
      await createFocusAreaRevision({
        focusAreaId: updated.id,
        title: updated.title,
        slug: updated.slug,
        parentPillar: updated.parentPillar,
        summary: updated.summary,
        description: updated.description,
        status: updated.status,
        revisedBy: session.name,
        changeSummary,
      });
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'focus_area',
      title,
      `Updated focus area: ${changeSummary}`
    );
  } catch (error: any) {
    console.error('Failed to update focus area:', error);
    throw error;
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/focus');
  revalidatePath(`/focus/${slug}`);
  revalidatePath('/admin');
  revalidatePath('/admin/focus-areas');
  redirect('/admin/focus-areas');
}

export async function deleteFocusAreaAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const idRaw = formData.get('id') as string;
  const id = parseInt(idRaw, 10);
  if (!id) {
    throw new Error('Focus area ID is required for deletion.');
  }

  try {
    const existing = await getFocusAreaById(id);
    await deleteFocusArea(id);

    await logAdminActivity(
      session.email,
      session.name,
      'delete',
      'focus_area',
      existing?.title || `Focus Area #${id}`,
      `Deleted focus area ID ${id}`
    );
  } catch (error: any) {
    console.error('Failed to delete focus area:', error);
    throw error;
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/focus');
  revalidatePath('/admin');
  revalidatePath('/admin/focus-areas');
  redirect('/admin/focus-areas');
}

export async function updateFocusAreaStatusAction(id: number, status: string): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updateFocusArea(id, { status });
    if (!updated) {
      return { success: false, error: 'Failed to update focus area status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'focus_area',
      updated.title,
      `Changed focus area status to [${status}]`
    );

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/focus');
    revalidatePath(`/focus/${updated.slug}`);
    revalidatePath('/admin');
    revalidatePath('/admin/focus-areas');
    return { success: true };
  } catch (error) {
    console.error('Failed to update focus area status:', error);
    return { success: false, error: 'Failed to update focus area status.' };
  }
}

export async function toggleFocusAreaFeaturedAction(id: number, isFeatured: boolean): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updateFocusArea(id, { isFeatured: isFeatured ? 'yes' : 'no' });
    if (!updated) {
      return { success: false, error: 'Failed to toggle featured status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'focus_area',
      updated.title,
      `${isFeatured ? 'Featured' : 'Unfeatured'} focus area on homepage`
    );

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/focus');
    revalidatePath(`/focus/${updated.slug}`);
    revalidatePath('/admin');
    revalidatePath('/admin/focus-areas');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle focus area featured status:', error);
    return { success: false, error: 'Failed to toggle featured status.' };
  }
}

/**
 * Publications & Reports Management Server Actions
 */

export async function createPublicationAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  const rawSlug = (formData.get('slug') as string)?.trim();
  const category = (formData.get('category') as string)?.trim() || 'Research Reports';
  const author = (formData.get('author') as string)?.trim() || 'AERC Research & Policy Team';
  const summary = (formData.get('summary') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || null;
  const fileType = (formData.get('fileType') as string)?.trim() || 'PDF';
  const fileSize = (formData.get('fileSize') as string)?.trim() || '2.4 MB';
  const downloadUrl = (formData.get('downloadUrl') as string)?.trim() || '/documents/AERC-2025-ANNUAL-REPORT-.pdf';
  const coverImage = (formData.get('coverImage') as string)?.trim() || '/images/bettering-tomorrow.jpg';
  const externalUrl = (formData.get('externalUrl') as string)?.trim() || null;
  const isFeatured = (formData.get('isFeatured') as string) === 'yes' ? 'yes' : 'no';
  const status = (formData.get('status') as string)?.trim() || 'published';
  const seoTitle = (formData.get('seoTitle') as string)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string)?.trim() || null;
  const rawDate = (formData.get('publishedAt') as string)?.trim();
  const publishedAt = rawDate ? new Date(rawDate) : new Date();

  if (!title) {
    throw new Error('Publication title is required.');
  }

  const baseSlug = rawSlug ? slugify(rawSlug) : slugify(title);
  const slug = baseSlug || `publication-${Date.now()}`;

  const created = await createPublication({
    slug,
    title,
    category,
    author,
    summary,
    description,
    fileType,
    fileSize,
    downloadUrl,
    coverImage,
    externalUrl,
    isFeatured,
    downloadCount: 0,
    status,
    seoTitle,
    seoDescription,
    publishedAt,
  });

  if (created) {
    await createPublicationRevision({
      publicationId: created.id,
      title: created.title,
      category: created.category,
      summary: created.summary,
      description: created.description,
      downloadUrl: created.downloadUrl,
      status: created.status,
      revisedBy: session.name || session.email,
      changeSummary: 'Initial publication upload and release',
    });

    await logAdminActivity(
      session.email,
      session.name,
      'create',
      'publication',
      created.title,
      `Published [${created.category}] document: ${created.title}`
    );
  }

  revalidatePath('/');
  revalidatePath('/resources');
  revalidatePath('/focus');
  revalidatePath('/admin');
  revalidatePath('/admin/publications');

  redirect('/admin/publications');
}

export async function updatePublicationAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const id = parseInt(formData.get('id') as string, 10);
  if (isNaN(id)) {
    throw new Error('Valid Publication ID is required.');
  }

  const existing = await getPublicationById(id);
  if (!existing) {
    throw new Error('Publication not found.');
  }

  const title = (formData.get('title') as string)?.trim() || existing.title;
  const rawSlug = (formData.get('slug') as string)?.trim();
  const slug = rawSlug ? slugify(rawSlug) : existing.slug || slugify(title);
  const category = (formData.get('category') as string)?.trim() || existing.category || 'Research Reports';
  const author = (formData.get('author') as string)?.trim() || existing.author || 'AERC Research & Policy Team';
  const summary = (formData.get('summary') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || null;
  const fileType = (formData.get('fileType') as string)?.trim() || existing.fileType || 'PDF';
  const fileSize = (formData.get('fileSize') as string)?.trim() || existing.fileSize || '2.4 MB';
  const downloadUrl = (formData.get('downloadUrl') as string)?.trim() || existing.downloadUrl;
  const coverImage = (formData.get('coverImage') as string)?.trim() || existing.coverImage;
  const externalUrl = (formData.get('externalUrl') as string)?.trim() || null;
  const isFeatured = (formData.get('isFeatured') as string) === 'yes' ? 'yes' : 'no';
  const status = (formData.get('status') as string)?.trim() || existing.status || 'published';
  const seoTitle = (formData.get('seoTitle') as string)?.trim() || null;
  const seoDescription = (formData.get('seoDescription') as string)?.trim() || null;
  const changeSummary = (formData.get('changeSummary') as string)?.trim() || 'Updated publication details and metadata';
  const rawDate = (formData.get('publishedAt') as string)?.trim();
  const publishedAt = rawDate ? new Date(rawDate) : existing.publishedAt;

  const updated = await updatePublication(id, {
    title,
    slug,
    category,
    author,
    summary,
    description,
    fileType,
    fileSize,
    downloadUrl,
    coverImage,
    externalUrl,
    isFeatured,
    status,
    seoTitle,
    seoDescription,
    publishedAt,
  });

  if (updated) {
    await createPublicationRevision({
      publicationId: updated.id,
      title: updated.title,
      category: updated.category,
      summary: updated.summary,
      description: updated.description,
      downloadUrl: updated.downloadUrl,
      status: updated.status,
      revisedBy: session.name || session.email,
      changeSummary,
    });

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'publication',
      updated.title,
      `Updated publication [${updated.title}]: ${changeSummary}`
    );
  }

  revalidatePath('/');
  revalidatePath('/resources');
  revalidatePath('/focus');
  revalidatePath('/admin');
  revalidatePath('/admin/publications');
  revalidatePath(`/admin/publications/${id}/edit`);

  redirect('/admin/publications');
}

export async function deletePublicationAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const id = parseInt(formData.get('id') as string, 10);
  if (isNaN(id)) {
    throw new Error('Valid Publication ID is required.');
  }

  const existing = await getPublicationById(id);
  const success = await deletePublication(id);

  if (success && existing) {
    await logAdminActivity(
      session.email,
      session.name,
      'delete',
      'publication',
      existing.title,
      `Deleted publication record [${existing.title}]`
    );
  }

  revalidatePath('/');
  revalidatePath('/resources');
  revalidatePath('/focus');
  revalidatePath('/admin');
  revalidatePath('/admin/publications');

  redirect('/admin/publications');
}

export async function updatePublicationStatusAction(id: number, status: string): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updatePublication(id, { status });
    if (!updated) {
      return { success: false, error: 'Failed to update publication status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'publication',
      updated.title,
      `Changed publication status to [${status}]`
    );

    revalidatePath('/');
    revalidatePath('/resources');
    revalidatePath('/focus');
    revalidatePath('/admin');
    revalidatePath('/admin/publications');
    return { success: true };
  } catch (error) {
    console.error('Failed to update publication status:', error);
    return { success: false, error: 'Failed to update publication status.' };
  }
}

export async function togglePublicationFeaturedAction(id: number, isFeatured: boolean): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updatePublication(id, { isFeatured: isFeatured ? 'yes' : 'no' });
    if (!updated) {
      return { success: false, error: 'Failed to toggle publication featured status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'publication',
      updated.title,
      `${isFeatured ? 'Featured' : 'Unfeatured'} publication on resources page`
    );

    revalidatePath('/');
    revalidatePath('/resources');
    revalidatePath('/focus');
    revalidatePath('/admin');
    revalidatePath('/admin/publications');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle publication featured status:', error);
    return { success: false, error: 'Failed to toggle featured status.' };
  }
}

/**
 * Public action: Track document download count atomically
 */
export async function trackPublicationDownloadAction(id: number): Promise<{ success: boolean }> {
  try {
    await incrementPublicationDownloadCount(id);
    return { success: true };
  } catch (error) {
    console.error('Failed to record download count:', error);
    return { success: false };
  }
}

/**
 * Team Members & Leadership Management Server Actions
 */

export async function createTeamMemberAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const name = (formData.get('name') as string)?.trim();
  const rawSlug = (formData.get('slug') as string)?.trim();
  const role = (formData.get('role') as string)?.trim();
  const category = (formData.get('category') as string)?.trim() || 'leadership';
  const bio = (formData.get('bio') as string)?.trim() || null;
  const expertise = (formData.get('expertise') as string)?.trim() || null;
  const qualifications = (formData.get('qualifications') as string)?.trim() || null;
  const image = (formData.get('image') as string)?.trim() || '/images/hero-community.jpg';
  const email = (formData.get('email') as string)?.trim() || null;
  const phone = (formData.get('phone') as string)?.trim() || null;
  const linkedin = (formData.get('linkedin') as string)?.trim() || null;
  const twitter = (formData.get('twitter') as string)?.trim() || null;
  const facebook = (formData.get('facebook') as string)?.trim() || null;
  const rawOrder = parseInt(formData.get('displayOrder') as string, 10);
  const displayOrder = isNaN(rawOrder) ? 1 : rawOrder;
  const isFeatured = (formData.get('isFeatured') as string) === 'yes' ? 'yes' : 'no';
  const status = (formData.get('status') as string)?.trim() || 'active';

  if (!name || !role) {
    throw new Error('Name and role are required.');
  }

  const baseSlug = rawSlug ? slugify(rawSlug) : slugify(name);
  const slug = baseSlug || `team-${Date.now()}`;

  const created = await createTeamMember({
    slug,
    name,
    role,
    category,
    bio,
    expertise,
    qualifications,
    image,
    email,
    phone,
    linkedin,
    twitter,
    facebook,
    displayOrder,
    isFeatured,
    status,
  });

  if (created) {
    await createTeamMemberRevision({
      teamMemberId: created.id,
      name: created.name,
      role: created.role,
      category: created.category,
      bio: created.bio,
      status: created.status,
      revisedBy: session.name || session.email,
      changeSummary: 'Initial profile creation',
    });

    await logAdminActivity(
      session.email,
      session.name,
      'create',
      'team_member',
      created.name,
      `Added new team member profile [${created.role}]: ${created.name}`
    );
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/team');
  revalidatePath('/admin');
  revalidatePath('/admin/team');

  redirect('/admin/team');
}

export async function updateTeamMemberAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const id = parseInt(formData.get('id') as string, 10);
  if (isNaN(id)) {
    throw new Error('Valid Team Member ID is required.');
  }

  const existing = await getTeamMemberById(id);
  if (!existing) {
    throw new Error('Team member not found.');
  }

  const name = (formData.get('name') as string)?.trim() || existing.name;
  const rawSlug = (formData.get('slug') as string)?.trim();
  const slug = rawSlug ? slugify(rawSlug) : existing.slug || slugify(name);
  const role = (formData.get('role') as string)?.trim() || existing.role;
  const category = (formData.get('category') as string)?.trim() || existing.category || 'leadership';
  const bio = (formData.get('bio') as string)?.trim() || null;
  const expertise = (formData.get('expertise') as string)?.trim() || null;
  const qualifications = (formData.get('qualifications') as string)?.trim() || null;
  const image = (formData.get('image') as string)?.trim() || existing.image;
  const email = (formData.get('email') as string)?.trim() || null;
  const phone = (formData.get('phone') as string)?.trim() || null;
  const linkedin = (formData.get('linkedin') as string)?.trim() || null;
  const twitter = (formData.get('twitter') as string)?.trim() || null;
  const facebook = (formData.get('facebook') as string)?.trim() || null;
  const rawOrder = parseInt(formData.get('displayOrder') as string, 10);
  const displayOrder = isNaN(rawOrder) ? existing.displayOrder || 1 : rawOrder;
  const isFeatured = (formData.get('isFeatured') as string) === 'yes' ? 'yes' : 'no';
  const status = (formData.get('status') as string)?.trim() || existing.status || 'active';
  const changeSummary = (formData.get('changeSummary') as string)?.trim() || 'Updated team profile details';

  const updated = await updateTeamMember(id, {
    slug,
    name,
    role,
    category,
    bio,
    expertise,
    qualifications,
    image,
    email,
    phone,
    linkedin,
    twitter,
    facebook,
    displayOrder,
    isFeatured,
    status,
  });

  if (updated) {
    await createTeamMemberRevision({
      teamMemberId: updated.id,
      name: updated.name,
      role: updated.role,
      category: updated.category,
      bio: updated.bio,
      status: updated.status,
      revisedBy: session.name || session.email,
      changeSummary,
    });

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'team_member',
      updated.name,
      `Updated team profile [${updated.name}]: ${changeSummary}`
    );
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/team');
  revalidatePath('/admin');
  revalidatePath('/admin/team');
  revalidatePath(`/admin/team/${id}/edit`);

  redirect('/admin/team');
}

export async function deleteTeamMemberAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const id = parseInt(formData.get('id') as string, 10);
  if (isNaN(id)) {
    throw new Error('Valid Team Member ID is required.');
  }

  const existing = await getTeamMemberById(id);
  const success = await deleteTeamMember(id);

  if (success && existing) {
    await logAdminActivity(
      session.email,
      session.name,
      'delete',
      'team_member',
      existing.name,
      `Removed team member profile [${existing.name}]`
    );
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/team');
  revalidatePath('/admin');
  revalidatePath('/admin/team');

  redirect('/admin/team');
}

export async function updateTeamMemberStatusAction(id: number, status: string): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updateTeamMember(id, { status });
    if (!updated) {
      return { success: false, error: 'Failed to update team member status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'team_member',
      updated.name,
      `Changed team profile status to [${status}]`
    );

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/team');
    revalidatePath('/admin');
    revalidatePath('/admin/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to update team member status:', error);
    return { success: false, error: 'Failed to update team member status.' };
  }
}

export async function toggleTeamMemberFeaturedAction(id: number, isFeatured: boolean): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updateTeamMember(id, { isFeatured: isFeatured ? 'yes' : 'no' });
    if (!updated) {
      return { success: false, error: 'Failed to toggle featured status.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'team_member',
      updated.name,
      `${isFeatured ? 'Featured' : 'Unfeatured'} team profile on about/team highlights`
    );

    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/team');
    revalidatePath('/admin');
    revalidatePath('/admin/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle team member featured status:', error);
    return { success: false, error: 'Failed to toggle featured status.' };
  }
}

export async function updateTeamMemberOrderAction(id: number, displayOrder: number): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const updated = await updateTeamMember(id, { displayOrder });
    if (!updated) {
      return { success: false, error: 'Failed to update display order.' };
    }

    revalidatePath('/team');
    revalidatePath('/admin/team');
    return { success: true };
  } catch (error) {
    console.error('Failed to update display order:', error);
    return { success: false, error: 'Failed to update display order.' };
  }
}

// -------------------------------------------------------------
// Module 8: Media Library Server Actions
// -------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export async function uploadMediaAction(formData: FormData): Promise<{ success: boolean; error?: string; mediaId?: number }> {
  const session = await requireAdmin();

  try {
    const file = formData.get('file') as File;
    if (!file || typeof file === 'string' || file.size === 0) {
      return { success: false, error: 'Please choose a valid file to upload.' };
    }

    // Supported categories
    const category = (formData.get('category') as string)?.trim() || 'General Website Images';
    const altText = (formData.get('altText') as string)?.trim() || null;
    const caption = (formData.get('caption') as string)?.trim() || null;
    const description = (formData.get('description') as string)?.trim() || null;
    const tags = (formData.get('tags') as string)?.trim() || null;
    const title = (formData.get('title') as string)?.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    // Upload to Cloudinary or local storage fallback
    const result = await uploadFileToStorage(file, 'aerc_media');

    const newMedia = await createMediaItem({
      title,
      filename: file.name,
      url: result.url,
      thumbnailUrl: result.url,
      publicId: result.publicId || null,
      category,
      fileType: file.type || 'application/octet-stream',
      fileSize: formatBytes(file.size),
      bytes: file.size,
      width: result.width || null,
      height: result.height || null,
      altText,
      caption,
      description,
      tags,
      folder: 'aerc_media',
      uploadedBy: session.name || 'Admin',
    });

    await logAdminActivity(
      session.email,
      session.name,
      'create',
      'media',
      title,
      `Uploaded asset [${file.name}] (${formatBytes(file.size)}) into category [${category}]`
    );

    revalidatePath('/admin');
    revalidatePath('/admin/media');
    return { success: true, mediaId: newMedia?.id };
  } catch (error) {
    console.error('Failed to upload media:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Upload failed.' };
  }
}

export async function updateMediaDetailsAction(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();

  const id = Number(formData.get('id'));
  if (!id) return { success: false, error: 'Invalid media ID.' };

  const title = (formData.get('title') as string)?.trim();
  const category = (formData.get('category') as string)?.trim() || 'General Website Images';
  const altText = (formData.get('altText') as string)?.trim() || null;
  const caption = (formData.get('caption') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || null;
  const tags = (formData.get('tags') as string)?.trim() || null;

  if (!title) {
    return { success: false, error: 'Media title is required.' };
  }

  try {
    const updated = await updateMediaItem(id, {
      title,
      category,
      altText,
      caption,
      description,
      tags,
    });

    if (!updated) {
      return { success: false, error: 'Media asset not found.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'media',
      title,
      `Updated metadata (alt text, caption, description) for [${updated.filename}]`
    );

    revalidatePath('/admin');
    revalidatePath('/admin/media');
    return { success: true };
  } catch (error) {
    console.error('Failed to update media details:', error);
    return { success: false, error: 'Failed to save media metadata.' };
  }
}

export async function replaceMediaFileAction(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();

  const id = Number(formData.get('id'));
  const file = formData.get('file') as File;

  if (!id || !file || typeof file === 'string' || file.size === 0) {
    return { success: false, error: 'Please select a replacement file.' };
  }

  try {
    const existing = await getMediaItemById(id);
    if (!existing) {
      return { success: false, error: 'Original media item not found.' };
    }

    // Upload new file
    const uploadResult = await uploadFileToStorage(file, 'aerc_media');

    // Optionally cleanup old file if it was a different Cloudinary/local file
    if (existing.url !== uploadResult.url) {
      await deleteMediaFile(existing.url, existing.publicId);
    }

    const updated = await updateMediaItem(id, {
      url: uploadResult.url,
      thumbnailUrl: uploadResult.url,
      publicId: uploadResult.publicId || null,
      filename: file.name,
      fileType: file.type || 'application/octet-stream',
      fileSize: formatBytes(file.size),
      bytes: file.size,
      width: uploadResult.width || null,
      height: uploadResult.height || null,
    });

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'media',
      existing.title,
      `Replaced file contents with [${file.name}] (${formatBytes(file.size)})`
    );

    revalidatePath('/admin');
    revalidatePath('/admin/media');
    return { success: true };
  } catch (error) {
    console.error('Failed to replace media file:', error);
    return { success: false, error: 'Failed to replace media file.' };
  }
}

export async function deleteMediaAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  isUsed?: boolean;
  usages?: { entityType: string; title: string; field: string; link?: string }[];
}> {
  const session = await requireAdmin();

  const id = Number(formData.get('id'));
  const force = formData.get('force') === 'true';

  if (!id) return { success: false, error: 'Invalid media ID.' };

  try {
    const existing = await getMediaItemById(id);
    if (!existing) {
      return { success: false, error: 'Media asset not found.' };
    }

    // Audit usage across website
    const usageReport = await checkMediaUsage(existing.url, existing.filename);

    if (usageReport.isUsed && !force) {
      return {
        success: false,
        isUsed: true,
        error: `This media item is actively in use in ${usageReport.totalUsages} location(s) across the website. Please review usages before deleting.`,
        usages: usageReport.usages,
      };
    }

    // Proceed with deletion
    await deleteMediaFile(existing.url, existing.publicId);
    await deleteMediaItem(id);

    await logAdminActivity(
      session.email,
      session.name,
      'delete',
      'media',
      existing.title,
      `Deleted media asset [${existing.filename}] (Category: ${existing.category})`
    );

    revalidatePath('/admin');
    revalidatePath('/admin/media');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete media:', error);
    return { success: false, error: 'Failed to delete media asset.' };
  }
}

export async function checkMediaUsageAction(id: number) {
  await requireAdmin();
  const existing = await getMediaItemById(id);
  if (!existing) {
    return { isUsed: false, totalUsages: 0, usages: [] };
  }
  return await checkMediaUsage(existing.url, existing.filename);
}

/**
 * -----------------------------------------------------------------------------
 * 9. Homepage Manager Server Actions
 * -----------------------------------------------------------------------------
 */

export async function updateHomepageSectionsAction(
  sectionsConfigJson: string
): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    // Validate JSON
    const parsed = JSON.parse(sectionsConfigJson);
    if (!Array.isArray(parsed)) {
      return { success: false, error: 'Invalid section configuration format.' };
    }

    await updateHomepageSettings({
      sectionsConfig: JSON.stringify(parsed),
      updatedBy: session.name,
    });

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'settings',
      'Homepage Sections Order & Visibility',
      `Updated homepage layout configuration (${parsed.length} sections)`
    );

    revalidatePath('/');
    revalidatePath('/admin/homepage');
    return { success: true };
  } catch (error) {
    console.error('Failed to update homepage sections:', error);
    return { success: false, error: 'Failed to update section arrangement.' };
  }
}

export async function updateHomepageImpactStatsAction(
  impactStatsJson: string,
  displayImpactStats: string
): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    const parsed = JSON.parse(impactStatsJson);
    if (!Array.isArray(parsed)) {
      return { success: false, error: 'Invalid impact statistics format.' };
    }

    await updateHomepageSettings({
      impactStatsJson: JSON.stringify(parsed),
      displayImpactStats: displayImpactStats === 'yes' ? 'yes' : 'no',
      updatedBy: session.name,
    });

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'settings',
      'Homepage Verified Impact Statistics',
      `Updated verified metrics (Display: ${displayImpactStats})`
    );

    revalidatePath('/');
    revalidatePath('/admin/homepage');
    return { success: true };
  } catch (error) {
    console.error('Failed to update impact statistics:', error);
    return { success: false, error: 'Failed to update impact statistics.' };
  }
}

export async function updateHomepageContentAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await requireAdmin();

  try {
    // Collect fields
    const heroHeadlinePrefix = (formData.get('heroHeadlinePrefix') as string)?.trim();
    const heroHighlight = (formData.get('heroHighlight') as string)?.trim();
    const heroIntroduction = (formData.get('heroIntroduction') as string)?.trim();
    const heroTag = (formData.get('heroTag') as string)?.trim();
    const heroBgImage = (formData.get('heroBgImage') as string)?.trim();
    const heroCtaPrimaryText = (formData.get('heroCtaPrimaryText') as string)?.trim();
    const heroCtaPrimaryLink = (formData.get('heroCtaPrimaryLink') as string)?.trim();
    const heroCtaSecondaryText = (formData.get('heroCtaSecondaryText') as string)?.trim();
    const heroCtaSecondaryLink = (formData.get('heroCtaSecondaryLink') as string)?.trim();

    const introBadge = (formData.get('introBadge') as string)?.trim();
    const introHeading = (formData.get('introHeading') as string)?.trim();
    const introContent = (formData.get('introContent') as string)?.trim();
    const introImage = (formData.get('introImage') as string)?.trim();

    const aboutBadge = (formData.get('aboutBadge') as string)?.trim();
    const aboutHeading = (formData.get('aboutHeading') as string)?.trim();
    const aboutLead = (formData.get('aboutLead') as string)?.trim();
    const aboutImage = (formData.get('aboutImage') as string)?.trim();
    const aboutObjectivesJson = (formData.get('aboutObjectivesJson') as string)?.trim();

    const focusBadge = (formData.get('focusBadge') as string)?.trim();
    const focusHeading = (formData.get('focusHeading') as string)?.trim();
    const focusSubtitle = (formData.get('focusSubtitle') as string)?.trim();
    const focusImage = (formData.get('focusImage') as string)?.trim();
    const featuredFocusAreaIds = (formData.get('featuredFocusAreaIds') as string)?.trim();

    const projectsBadge = (formData.get('projectsBadge') as string)?.trim();
    const projectsHeading = (formData.get('projectsHeading') as string)?.trim();
    const projectsSubtitle = (formData.get('projectsSubtitle') as string)?.trim();
    const featuredProjectIds = (formData.get('featuredProjectIds') as string)?.trim();

    const newsBadge = (formData.get('newsBadge') as string)?.trim();
    const newsHeading = (formData.get('newsHeading') as string)?.trim();
    const newsSubtitle = (formData.get('newsSubtitle') as string)?.trim();
    const featuredArticleIds = (formData.get('featuredArticleIds') as string)?.trim();

    const pubsBadge = (formData.get('pubsBadge') as string)?.trim();
    const pubsHeading = (formData.get('pubsHeading') as string)?.trim();
    const pubsSubtitle = (formData.get('pubsSubtitle') as string)?.trim();
    const featuredPublicationIds = (formData.get('featuredPublicationIds') as string)?.trim();

    const teamBadge = (formData.get('teamBadge') as string)?.trim();
    const teamHeading = (formData.get('teamHeading') as string)?.trim();
    const teamSubtitle = (formData.get('teamSubtitle') as string)?.trim();
    const featuredTeamIds = (formData.get('featuredTeamIds') as string)?.trim();

    const partnersBadge = (formData.get('partnersBadge') as string)?.trim();
    const partnersHeading = (formData.get('partnersHeading') as string)?.trim();
    const partnersJson = (formData.get('partnersJson') as string)?.trim();

    const ctaHeading = (formData.get('ctaHeading') as string)?.trim();
    const ctaSubtitle = (formData.get('ctaSubtitle') as string)?.trim();
    const ctaButtonText = (formData.get('ctaButtonText') as string)?.trim();
    const ctaButtonLink = (formData.get('ctaButtonLink') as string)?.trim();

    await updateHomepageSettings({
      ...(heroHeadlinePrefix !== undefined && { heroHeadlinePrefix }),
      ...(heroHighlight !== undefined && { heroHighlight }),
      ...(heroIntroduction !== undefined && { heroIntroduction }),
      ...(heroTag !== undefined && { heroTag }),
      ...(heroBgImage !== undefined && { heroBgImage }),
      ...(heroCtaPrimaryText !== undefined && { heroCtaPrimaryText }),
      ...(heroCtaPrimaryLink !== undefined && { heroCtaPrimaryLink }),
      ...(heroCtaSecondaryText !== undefined && { heroCtaSecondaryText }),
      ...(heroCtaSecondaryLink !== undefined && { heroCtaSecondaryLink }),

      ...(introBadge !== undefined && { introBadge }),
      ...(introHeading !== undefined && { introHeading }),
      ...(introContent !== undefined && { introContent }),
      ...(introImage !== undefined && { introImage }),

      ...(aboutBadge !== undefined && { aboutBadge }),
      ...(aboutHeading !== undefined && { aboutHeading }),
      ...(aboutLead !== undefined && { aboutLead }),
      ...(aboutImage !== undefined && { aboutImage }),
      ...(aboutObjectivesJson !== undefined && { aboutObjectivesJson }),

      ...(focusBadge !== undefined && { focusBadge }),
      ...(focusHeading !== undefined && { focusHeading }),
      ...(focusSubtitle !== undefined && { focusSubtitle }),
      ...(focusImage !== undefined && { focusImage }),
      ...(featuredFocusAreaIds !== undefined && { featuredFocusAreaIds }),

      ...(projectsBadge !== undefined && { projectsBadge }),
      ...(projectsHeading !== undefined && { projectsHeading }),
      ...(projectsSubtitle !== undefined && { projectsSubtitle }),
      ...(featuredProjectIds !== undefined && { featuredProjectIds }),

      ...(newsBadge !== undefined && { newsBadge }),
      ...(newsHeading !== undefined && { newsHeading }),
      ...(newsSubtitle !== undefined && { newsSubtitle }),
      ...(featuredArticleIds !== undefined && { featuredArticleIds }),

      ...(pubsBadge !== undefined && { pubsBadge }),
      ...(pubsHeading !== undefined && { pubsHeading }),
      ...(pubsSubtitle !== undefined && { pubsSubtitle }),
      ...(featuredPublicationIds !== undefined && { featuredPublicationIds }),

      ...(teamBadge !== undefined && { teamBadge }),
      ...(teamHeading !== undefined && { teamHeading }),
      ...(teamSubtitle !== undefined && { teamSubtitle }),
      ...(featuredTeamIds !== undefined && { featuredTeamIds }),

      ...(partnersBadge !== undefined && { partnersBadge }),
      ...(partnersHeading !== undefined && { partnersHeading }),
      ...(partnersJson !== undefined && { partnersJson }),

      ...(ctaHeading !== undefined && { ctaHeading }),
      ...(ctaSubtitle !== undefined && { ctaSubtitle }),
      ...(ctaButtonText !== undefined && { ctaButtonText }),
      ...(ctaButtonLink !== undefined && { ctaButtonLink }),

      updatedBy: session.name,
    });

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'settings',
      'Homepage Content Configuration',
      'Updated homepage headlines, copy, imagery, and featured selections'
    );

    revalidatePath('/');
    revalidatePath('/admin/homepage');
    return { success: true };
  } catch (error) {
    console.error('Failed to update homepage content:', error);
    return { success: false, error: 'Failed to save homepage modifications.' };
  }
}

/**
 * -----------------------------------------------------------------------------
 * 10. Users & Permissions Server Actions
 * -----------------------------------------------------------------------------
 */

export async function createAdminUserAction(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();

  // Role restriction check
  const normalizedRole = session.role?.toLowerCase();
  if (normalizedRole !== 'superadmin' && normalizedRole !== 'admin') {
    return { success: false, error: 'Permission denied. Only administrators can create staff accounts.' };
  }

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const role = ((formData.get('role') as string)?.trim().toLowerCase() || 'editor') as any;
  const department = (formData.get('department') as string)?.trim() || null;
  const phone = (formData.get('phone') as string)?.trim() || null;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { success: false, error: 'Name, email, and initial password are required.' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }

  // Non-superadmins cannot assign superadmin role
  if (role === 'superadmin' && normalizedRole !== 'superadmin') {
    return { success: false, error: 'Only Super Admins can assign the Super Admin role.' };
  }

  try {
    const existing = await findAdminByEmail(email);
    if (existing) {
      return { success: false, error: 'An administrator account with this email already exists.' };
    }

    const passwordHash = await hashPassword(password);

    const newAdmin = await createAdmin({
      name,
      email,
      passwordHash,
      role,
      status: 'active',
      department,
      phone,
    });

    if (!newAdmin) {
      return { success: false, error: 'Failed to create user account in database.' };
    }

    await logAdminActivity(
      session.email,
      session.name,
      'create',
      'user',
      name,
      `Created new administrator account [${email}] with role: ${role}`
    );

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Failed to create admin user:', error);
    return { success: false, error: 'Failed to register administrator account.' };
  }
}

export async function updateAdminUserAction(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();

  const normalizedRole = session.role?.toLowerCase();
  if (normalizedRole !== 'superadmin' && normalizedRole !== 'admin') {
    return { success: false, error: 'Permission denied. Only administrators can edit accounts.' };
  }

  const id = Number(formData.get('id'));
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const role = ((formData.get('role') as string)?.trim().toLowerCase() || 'editor') as any;
  const department = (formData.get('department') as string)?.trim() || null;
  const phone = (formData.get('phone') as string)?.trim() || null;
  const status = ((formData.get('status') as string)?.trim().toLowerCase() || 'active') as any;

  if (!id || !name || !email) {
    return { success: false, error: 'Account ID, name, and email are required.' };
  }

  // Non-superadmins cannot grant or revoke superadmin
  if (role === 'superadmin' && normalizedRole !== 'superadmin') {
    return { success: false, error: 'Only Super Admins can assign the Super Admin role.' };
  }

  try {
    const target = await getAdminById(id);
    if (!target) {
      return { success: false, error: 'Target administrator account not found.' };
    }

    // Protect against self-deactivation or self-demotion
    if (session.id === id && status === 'inactive') {
      return { success: false, error: 'You cannot deactivate your own active session account.' };
    }
    if (session.id === id && target.role === 'superadmin' && role !== 'superadmin') {
      return { success: false, error: 'You cannot demote your own Super Admin privileges.' };
    }

    await updateAdmin(id, {
      name,
      email,
      role,
      department,
      phone,
      status,
    });

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'user',
      name,
      `Updated user profile [${email}] (Role: ${role}, Status: ${status})`
    );

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Failed to update admin user:', error);
    return { success: false, error: 'Failed to update administrator details.' };
  }
}

export async function toggleAdminUserStatusAction(
  id: number,
  currentStatus: string
): Promise<ActionResult> {
  const session = await requireAdmin();

  const normalizedRole = session.role?.toLowerCase();
  if (normalizedRole !== 'superadmin') {
    return { success: false, error: 'Only Super Admins can activate or deactivate accounts.' };
  }

  if (session.id === id) {
    return { success: false, error: 'You cannot deactivate your own account.' };
  }

  try {
    const target = await getAdminById(id);
    if (!target) {
      return { success: false, error: 'User not found.' };
    }

    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updateAdmin(id, { status: nextStatus });

    await logAdminActivity(
      session.email,
      session.name,
      'update',
      'user',
      target.name,
      `Changed account status from ${currentStatus} to ${nextStatus}`
    );

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle user status:', error);
    return { success: false, error: 'Failed to change account status.' };
  }
}

export async function resetAdminUserPasswordAction(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();

  const normalizedRole = session.role?.toLowerCase();
  if (normalizedRole !== 'superadmin' && normalizedRole !== 'admin') {
    return { success: false, error: 'Permission denied. Only authorized administrators can reset passwords.' };
  }

  const id = Number(formData.get('id'));
  const newPassword = formData.get('newPassword') as string;

  if (!id || !newPassword) {
    return { success: false, error: 'Account ID and new password are required.' };
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  try {
    const target = await getAdminById(id);
    if (!target) {
      return { success: false, error: 'Target account not found.' };
    }

    const passwordHash = await hashPassword(newPassword);
    await updateAdmin(id, { passwordHash });

    await logAdminActivity(
      session.email,
      session.name,
      'reset_password',
      'user',
      target.name,
      `Securely reset password credentials for [${target.email}]`
    );

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Failed to reset user password:', error);
    return { success: false, error: 'Failed to reset credentials.' };
  }
}

export async function deleteAdminUserAction(id: number): Promise<ActionResult> {
  const session = await requireAdmin();

  const normalizedRole = session.role?.toLowerCase();
  if (normalizedRole !== 'superadmin') {
    return { success: false, error: 'Only Super Admins have permission to delete administrator accounts.' };
  }

  if (session.id === id) {
    return { success: false, error: 'You cannot delete your own currently active account.' };
  }

  try {
    const target = await getAdminById(id);
    if (!target) {
      return { success: false, error: 'User account not found.' };
    }

    await deleteAdmin(id);

    await logAdminActivity(
      session.email,
      session.name,
      'delete',
      'user',
      target.name,
      `Deleted administrator account [${target.email}] (${target.role})`
    );

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete admin user:', error);
    return { success: false, error: 'Failed to delete administrator account.' };
  }
}



