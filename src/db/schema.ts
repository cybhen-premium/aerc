import { pgTable, text, serial, timestamp, varchar, integer, boolean } from 'drizzle-orm/pg-core';

// 1. Blog Posts
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  imageCaption: text('image_caption'),
  imageAlt: text('image_alt'),
  category: varchar('category', { length: 100 }).default('Climate Change'),
  tags: text('tags'),
  author: varchar('author', { length: 100 }).default('AERC Editorial Team'),
  status: varchar('status', { length: 50 }).default('published'), // 'published', 'draft', 'pending', 'archived'
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  scheduledFor: timestamp('scheduled_for'),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 1b. Article Revisions History
export const articleRevisions = pgTable('article_revisions', {
  id: serial('id').primaryKey(),
  articleId: serial('article_id').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  author: varchar('author', { length: 100 }),
  status: varchar('status', { length: 50 }).default('draft'),
  revisedBy: varchar('revised_by', { length: 255 }).default('Admin'),
  changeSummary: text('change_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Publications & Reports
export const publications = pgTable('publications', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique(),
  title: text('title').notNull(),
  category: varchar('category', { length: 100 }).default('Research Reports').notNull(),
  author: varchar('author', { length: 255 }).default('AERC Research & Policy Team'),
  summary: text('summary'),
  description: text('description'),
  fileType: varchar('file_type', { length: 20 }).default('PDF'),
  fileSize: varchar('file_size', { length: 50 }).default('2.4 MB'),
  downloadUrl: text('download_url').notNull(),
  coverImage: text('cover_image'),
  externalUrl: text('external_url'),
  isFeatured: varchar('is_featured', { length: 10 }).default('no'),
  downloadCount: integer('download_count').default(0),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  status: varchar('status', { length: 50 }).default('published'),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2b. Publication Revisions History
export const publicationRevisions = pgTable('publication_revisions', {
  id: serial('id').primaryKey(),
  publicationId: integer('publication_id').notNull(),
  title: text('title').notNull(),
  category: varchar('category', { length: 100 }),
  summary: text('summary'),
  description: text('description'),
  downloadUrl: text('download_url'),
  status: varchar('status', { length: 50 }),
  revisedBy: varchar('revised_by', { length: 255 }).default('Admin'),
  changeSummary: text('change_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Projects
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: text('title').notNull(),
  tag: varchar('tag', { length: 100 }).notNull(),
  focusArea: varchar('focus_area', { length: 100 }),
  summary: text('summary').notNull(),
  description: text('description'),
  objectives: text('objectives'),
  location: varchar('location', { length: 255 }),
  startDate: varchar('start_date', { length: 50 }),
  endDate: varchar('end_date', { length: 50 }),
  partners: text('partners'),
  funders: text('funders'),
  activities: text('activities'),
  outcomes: text('outcomes'),
  impactStats: text('impact_stats'), // JSON array: [{"label": "Direct Beneficiaries", "value": "3,500+"}]
  coverImage: text('cover_image').notNull(),
  bannerImage: text('banner_image'),
  galleryImages: text('gallery_images'), // Comma-separated or JSON array of image URLs
  externalLink: text('external_link'),
  isFeatured: varchar('is_featured', { length: 10 }).default('no'), // 'yes', 'no'
  isPublic: varchar('is_public', { length: 10 }).default('yes'), // 'yes', 'no'
  relatedPublications: text('related_publications'),
  relatedNews: text('related_news'),
  status: varchar('status', { length: 50 }).default('Ongoing'), // 'Planned', 'Ongoing', 'Completed', 'Archived'
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3b. Project Revisions History
export const projectRevisions = pgTable('project_revisions', {
  id: serial('id').primaryKey(),
  projectId: serial('project_id').notNull(),
  title: text('title').notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  tag: varchar('tag', { length: 100 }),
  summary: text('summary'),
  description: text('description'),
  status: varchar('status', { length: 50 }),
  revisedBy: varchar('revised_by', { length: 255 }).default('Admin'),
  changeSummary: text('change_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3c. Focus Areas & Strategic Pillars
export const focusAreas = pgTable('focus_areas', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: text('title').notNull(),
  parentPillar: varchar('parent_pillar', { length: 100 }).default('Environment & Climate').notNull(),
  summary: text('summary').notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 100 }).default('fa-leaf'),
  image: text('image'),
  tags: text('tags'), // Comma-separated associated tags/keywords
  displayOrder: serial('display_order'),
  isFeatured: varchar('is_featured', { length: 10 }).default('yes'), // 'yes' | 'no'
  status: varchar('status', { length: 50 }).default('active').notNull(), // 'active' | 'inactive'
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3d. Focus Area Revision History
export const focusAreaRevisions = pgTable('focus_area_revisions', {
  id: serial('id').primaryKey(),
  focusAreaId: serial('focus_area_id').notNull(),
  title: text('title').notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  parentPillar: varchar('parent_pillar', { length: 100 }),
  summary: text('summary'),
  description: text('description'),
  status: varchar('status', { length: 50 }),
  revisedBy: varchar('revised_by', { length: 255 }).default('Admin'),
  changeSummary: text('change_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Contact Form Inquiries
export const contactInquiries = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  category: varchar('category', { length: 100 }).default('General Inquiry'),
  status: varchar('status', { length: 50 }).default('New'), // 'New', 'In Progress', 'Responded', 'Closed', 'Archived'
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  assignedTo: varchar('assigned_to', { length: 255 }),
  assignedStaffEmail: varchar('assigned_staff_email', { length: 255 }),
  priority: varchar('priority', { length: 50 }).default('normal'), // 'low', 'normal', 'high', 'urgent'
  internalNotes: text('internal_notes'),
  responseSummary: text('response_summary'),
  respondedAt: timestamp('responded_at'),
  respondedBy: varchar('responded_by', { length: 255 }),
  isArchived: varchar('is_archived', { length: 10 }).default('no'),
  spamScore: integer('spam_score').default(0),
  retentionExpiryDate: timestamp('retention_expiry_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const enquiryNotificationSettings = pgTable('enquiry_notification_settings', {
  id: serial('id').primaryKey(),
  notificationsEnabled: varchar('notifications_enabled', { length: 10 }).default('yes'),
  notificationRecipientEmail: varchar('notification_recipient_email', { length: 255 }).default('info@aercghana.net'),
  ccEmails: text('cc_emails').default('admin@aercgh.org'),
  autoResponderEnabled: varchar('auto_responder_enabled', { length: 10 }).default('yes'),
  autoResponderSubject: varchar('auto_responder_subject', { length: 255 }).default('Thank you for contacting AERC Ghana'),
  autoResponderMessage: text('auto_responder_message'),
  spamProtectionLevel: varchar('spam_protection_level', { length: 50 }).default('standard'),
  retentionDays: integer('retention_days').default(365),
  anonymizeAfterRetention: varchar('anonymize_after_retention', { length: 10 }).default('yes'),
  updatedAt: timestamp('updated_at').defaultNow(),
  updatedBy: varchar('updated_by', { length: 255 }).default('Admin'),
});

// 5. Partner Applications
export const partnerApplications = pgTable('partner_applications', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  organisation: varchar('organisation', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  location: varchar('location', { length: 255 }),
  proposal: text('proposal'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Volunteer Applications
export const volunteerApplications = pgTable('volunteer_applications', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  interests: text('interests'),
  availability: varchar('availability', { length: 100 }),
  experience: text('experience'),
  referral: varchar('referral', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Newsletter Subscribers
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. Blog Comments
export const blogComments = pgTable('blog_comments', {
  id: serial('id').primaryKey(),
  blogSlug: varchar('blog_slug', { length: 255 }).notNull(),
  author: varchar('author', { length: 150 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 9. Administrator Accounts
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
  status: varchar('status', { length: 50 }).default('active').notNull(), // 'active', 'inactive', 'suspended'
  department: varchar('department', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at'),
});

// 10. Grassroots Donations & Support
export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  donorName: text('donor_name').notNull(),
  donorEmail: varchar('donor_email', { length: 255 }).notNull(),
  amount: text('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD').notNull(),
  frequency: varchar('frequency', { length: 20 }).default('one-time').notNull(),
  campaign: varchar('campaign', { length: 255 }).default('General Grassroots Fund').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).default('mobile_money').notNull(),
  status: varchar('status', { length: 50 }).default('completed').notNull(),
  message: text('message'),
  isAnonymous: varchar('is_anonymous', { length: 10 }).default('no'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. Team Members & Leadership Profiles
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique(),
  name: text('name').notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).default('leadership').notNull(), // 'leadership', 'officers', 'board', 'volunteers'
  bio: text('bio'),
  expertise: text('expertise'),
  qualifications: text('qualifications'),
  image: text('image').notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  linkedin: text('linkedin'),
  twitter: text('twitter'),
  facebook: text('facebook'),
  displayOrder: integer('display_order').default(1),
  isFeatured: varchar('is_featured', { length: 10 }).default('no'), // 'yes', 'no'
  status: varchar('status', { length: 50 }).default('active').notNull(), // 'active', 'inactive'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 11b. Team Member Revisions History
export const teamMemberRevisions = pgTable('team_member_revisions', {
  id: serial('id').primaryKey(),
  teamMemberId: integer('team_member_id').notNull(),
  name: text('name').notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }),
  bio: text('bio'),
  status: varchar('status', { length: 50 }),
  revisedBy: varchar('revised_by', { length: 255 }).default('Admin'),
  changeSummary: text('change_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 12. Website Pages Directory
export const sitePages = pgTable('site_pages', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  heroHeadline: text('hero_headline'),
  heroSubtitle: text('hero_subtitle'),
  heroImage: text('hero_image'),
  heroCtaText: varchar('hero_cta_text', { length: 100 }),
  heroCtaLink: varchar('hero_cta_link', { length: 255 }),
  sectionsJson: text('sections_json'),
  content: text('content'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  scheduledFor: timestamp('scheduled_for'),
  pageType: varchar('page_type', { length: 50 }).default('standard'),
  status: varchar('status', { length: 50 }).default('published').notNull(), // 'published', 'draft', 'pending', 'archived'
  lastUpdatedBy: varchar('last_updated_by', { length: 255 }).default('Admin'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 12b. Page Revision History
export const pageRevisions = pgTable('page_revisions', {
  id: serial('id').primaryKey(),
  pageId: serial('page_id').notNull(),
  title: text('title').notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  heroHeadline: text('hero_headline'),
  heroSubtitle: text('hero_subtitle'),
  content: text('content'),
  sectionsJson: text('sections_json'),
  status: varchar('status', { length: 50 }).default('draft'),
  revisedBy: varchar('revised_by', { length: 255 }).default('Admin'),
  changeSummary: text('change_summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 13. Administrator Activity Logs
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  adminEmail: varchar('admin_email', { length: 255 }).notNull(),
  adminName: varchar('admin_name', { length: 255 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(), // 'create', 'update', 'delete', 'publish', 'login'
  entityType: varchar('entity_type', { length: 100 }).notNull(), // 'article', 'project', 'publication', 'page', 'team_member', 'user', 'settings'
  entityTitle: text('entity_title').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 14. Media Library Items
export const mediaItems = pgTable('media_items', {
  id: serial('id').primaryKey(),
  publicId: varchar('public_id', { length: 255 }),
  title: text('title').notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: varchar('category', { length: 100 }).default('General Website Images').notNull(),
  fileType: varchar('file_type', { length: 50 }).default('image/jpeg').notNull(),
  fileSize: varchar('file_size', { length: 50 }).default('0 KB').notNull(),
  bytes: integer('bytes').default(0),
  width: integer('width'),
  height: integer('height'),
  altText: text('alt_text'),
  caption: text('caption'),
  description: text('description'),
  folder: varchar('folder', { length: 100 }).default('aerc_media'),
  tags: text('tags'),
  uploadedBy: varchar('uploaded_by', { length: 255 }).default('Admin'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 15. Homepage Settings
export const homepageSettings = pgTable('homepage_settings', {
  id: serial('id').primaryKey(),
  // Hero banner
  heroHeadlinePrefix: text('hero_headline_prefix').default('Building Resilience Through ').notNull(),
  heroHighlight: text('hero_highlight').default('Just Energy Transition').notNull(),
  heroIntroduction: text('hero_introduction').default('Advancing a just, inclusive energy transition across rural Ghana—championing community ownership, decentralized solar mini-grids, and clean renewable power.').notNull(),
  heroTag: varchar('hero_tag', { length: 100 }).default('AERC GHANA').notNull(),
  heroBgImage: text('hero_bg_image').default('/images/slider-1.jpg').notNull(),
  heroCtaPrimaryText: varchar('hero_cta_primary_text', { length: 100 }).default('Explore Initiatives').notNull(),
  heroCtaPrimaryLink: varchar('hero_cta_primary_link', { length: 255 }).default('/projects').notNull(),
  heroCtaSecondaryText: varchar('hero_cta_secondary_text', { length: 100 }).default('About Our Mission').notNull(),
  heroCtaSecondaryLink: varchar('hero_cta_secondary_link', { length: 255 }).default('/about').notNull(),

  // Introduction
  introBadge: varchar('intro_badge', { length: 100 }).default('ABOUT AERC GHANA'),
  introHeading: text('intro_heading').default('Grassroots Leadership Driving Climate Justice & Energy Sovereignty'),
  introContent: text('intro_content').default('Alliance for Empowering Rural Communities (AERC Ghana) is a dedicated youth-led and community-centered environmental organisation advancing grassroots solutions to climate change, rural energy poverty, and natural resource governance across Ghana and West Africa.'),
  introImage: text('intro_image').default('/images/about/who-we-are.jpg'),

  // About / How We Work
  aboutBadge: varchar('about_badge', { length: 100 }).default('HOW WE WORK'),
  aboutHeading: text('about_heading').default('We Work Together For Bettering Tomorrow'),
  aboutLead: text('about_lead').default('Through policy advocacy, research, and training, we bridge grassroots realities with national and global decision-making. We amplify community voices, strengthen local leadership, and connect our partners to the knowledge, resources, and networks that drive change. Every project we undertake reflects our belief that rural communities are not just beneficiaries, they are leaders in building a just, resilient, and sustainable future for all.'),
  aboutImage: text('about_image').default('/images/bettering-tomorrow.jpg'),
  aboutObjectivesJson: text('about_objectives_json'),

  // Focus areas
  focusBadge: varchar('focus_badge', { length: 100 }).default('STRATEGIC PILLARS'),
  focusHeading: text('focus_heading').default('Our Focus Areas and Strategic Pillars'),
  focusSubtitle: text('focus_subtitle').default('AERC focuses on Environment & Climate and Energy Transition, driving climate justice, community empowerment, and sustainable development.'),
  focusImage: text('focus_image').default('/images/rrrr.png'),
  featuredFocusAreaIds: text('featured_focus_area_ids'),

  // Featured Projects
  projectsBadge: varchar('projects_badge', { length: 100 }).default('ACTIVE INITIATIVES'),
  projectsHeading: text('projects_heading').default('Our Featured Projects'),
  projectsSubtitle: text('projects_subtitle').default('Community-led agroecology, clean cooking transitions, and renewable solar installations.'),
  featuredProjectIds: text('featured_project_ids'),

  // Impact statistics
  impactStatsJson: text('impact_stats_json'),
  displayImpactStats: varchar('display_impact_stats', { length: 10 }).default('yes'),

  // News and articles
  newsBadge: varchar('news_badge', { length: 100 }).default('LATEST DISPATCHES'),
  newsHeading: text('news_heading').default('Latest News & Advocacy Stories'),
  newsSubtitle: text('news_subtitle').default('Updates, grassroots insights, and policy announcements from AERC Ghana teams.'),
  featuredArticleIds: text('featured_article_ids'),

  // Publications
  pubsBadge: varchar('pubs_badge', { length: 100 }).default('RESEARCH & POLICY'),
  pubsHeading: text('pubs_heading').default('Publications & Downloadable Resources'),
  pubsSubtitle: text('pubs_subtitle').default('Evidence-based policy briefs, investigative reports, and community toolkits.'),
  featuredPublicationIds: text('featured_publication_ids'),

  // Team
  teamBadge: varchar('team_badge', { length: 100 }).default('OUR TEAM MEMBERS'),
  teamHeading: text('team_heading').default('Our Awesome Team'),
  teamSubtitle: text('team_subtitle').default('Meet the passionate practitioners, organizers, and policy advocates leading frontline change across Ghana.'),
  featuredTeamIds: text('featured_team_ids'),

  // Partners
  partnersBadge: varchar('partners_badge', { length: 100 }).default('ALLIANCES & SUPPORTERS'),
  partnersHeading: text('partners_heading').default('Our Coalitions & Strategic Partners'),
  partnersJson: text('partners_json'),

  // Call to action
  ctaHeading: text('cta_heading').default('Join Hands With Us For Climate Justice'),
  ctaSubtitle: text('cta_subtitle').default('Whether as a partner organisation, volunteer, or supporter, your engagement empowers rural communities to lead their own sustainable future.'),
  ctaButtonText: varchar('cta_button_text', { length: 100 }).default('Get Involved Today'),
  ctaButtonLink: varchar('cta_button_link', { length: 255 }).default('/partner'),

  // Sections order and visibility
  sectionsConfig: text('sections_config').notNull(),

  updatedBy: varchar('updated_by', { length: 255 }).default('Admin'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type definitions
export type BlogPost = Omit<
  typeof blogPosts.$inferSelect,
  'updatedAt' | 'status' | 'imageCaption' | 'imageAlt' | 'tags' | 'seoTitle' | 'seoDescription' | 'scheduledFor'
> & {
  updatedAt?: Date | null;
  status?: string | null;
  imageCaption?: string | null;
  imageAlt?: string | null;
  tags?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  scheduledFor?: Date | null;
};
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type ArticleRevision = typeof articleRevisions.$inferSelect;
export type NewArticleRevision = typeof articleRevisions.$inferInsert;

export type Publication = Omit<
  typeof publications.$inferSelect,
  | 'updatedAt'
  | 'createdAt'
  | 'status'
  | 'slug'
  | 'category'
  | 'author'
  | 'summary'
  | 'coverImage'
  | 'externalUrl'
  | 'isFeatured'
  | 'downloadCount'
  | 'seoTitle'
  | 'seoDescription'
> & {
  slug?: string | null;
  category?: string | null;
  author?: string | null;
  summary?: string | null;
  coverImage?: string | null;
  externalUrl?: string | null;
  isFeatured?: string | null;
  downloadCount?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt?: Date | null;
  createdAt?: Date | null;
  status?: string | null;
};
export type NewPublication = typeof publications.$inferInsert;

export type PublicationRevision = typeof publicationRevisions.$inferSelect;
export type NewPublicationRevision = typeof publicationRevisions.$inferInsert;

export type Project = Omit<
  typeof projects.$inferSelect,
  | 'updatedAt'
  | 'createdAt'
  | 'bannerImage'
  | 'galleryImages'
  | 'focusArea'
  | 'objectives'
  | 'location'
  | 'startDate'
  | 'endDate'
  | 'partners'
  | 'funders'
  | 'activities'
  | 'outcomes'
  | 'impactStats'
  | 'externalLink'
  | 'isFeatured'
  | 'isPublic'
  | 'relatedPublications'
  | 'relatedNews'
> & {
  updatedAt?: Date | null;
  createdAt?: Date | null;
  bannerImage?: string | null;
  galleryImages?: string | null;
  focusArea?: string | null;
  objectives?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  partners?: string | null;
  funders?: string | null;
  activities?: string | null;
  outcomes?: string | null;
  impactStats?: string | null;
  externalLink?: string | null;
  isFeatured?: string | null;
  isPublic?: string | null;
  relatedPublications?: string | null;
  relatedNews?: string | null;
};
export type NewProject = typeof projects.$inferInsert;

export type ProjectRevision = typeof projectRevisions.$inferSelect;
export type NewProjectRevision = typeof projectRevisions.$inferInsert;

export type FocusArea = Omit<typeof focusAreas.$inferSelect, 'updatedAt' | 'createdAt'> & {
  updatedAt?: Date | null;
  createdAt?: Date | null;
};
export type NewFocusArea = typeof focusAreas.$inferInsert;

export type FocusAreaRevision = typeof focusAreaRevisions.$inferSelect;
export type NewFocusAreaRevision = typeof focusAreaRevisions.$inferInsert;

export type ContactInquiry = Omit<
  typeof contactInquiries.$inferSelect,
  | 'phone'
  | 'category'
  | 'status'
  | 'isRead'
  | 'readAt'
  | 'assignedTo'
  | 'assignedStaffEmail'
  | 'priority'
  | 'internalNotes'
  | 'responseSummary'
  | 'respondedAt'
  | 'respondedBy'
  | 'isArchived'
  | 'spamScore'
  | 'retentionExpiryDate'
  | 'updatedAt'
> & {
  phone?: string | null;
  category?: string | null;
  status?: string | null;
  isRead?: boolean | null;
  readAt?: Date | null;
  assignedTo?: string | null;
  assignedStaffEmail?: string | null;
  priority?: string | null;
  internalNotes?: string | null;
  responseSummary?: string | null;
  respondedAt?: Date | null;
  respondedBy?: string | null;
  isArchived?: string | null;
  spamScore?: number | null;
  retentionExpiryDate?: Date | null;
  updatedAt?: Date | null;
};
export type NewContactInquiry = typeof contactInquiries.$inferInsert;

export type EnquiryNotificationSettings = typeof enquiryNotificationSettings.$inferSelect;
export type NewEnquiryNotificationSettings = typeof enquiryNotificationSettings.$inferInsert;

export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type NewPartnerApplication = typeof partnerApplications.$inferInsert;

export type VolunteerApplication = typeof volunteerApplications.$inferSelect;
export type NewVolunteerApplication = typeof volunteerApplications.$inferInsert;

export type BlogComment = typeof blogComments.$inferSelect;
export type NewBlogComment = typeof blogComments.$inferInsert;

export type Admin = Omit<
  typeof admins.$inferSelect,
  'status' | 'department' | 'phone' | 'avatar' | 'updatedAt' | 'lastLoginAt'
> & {
  status?: string | null;
  department?: string | null;
  phone?: string | null;
  avatar?: string | null;
  updatedAt?: Date | null;
  lastLoginAt?: Date | null;
};
export type NewAdmin = typeof admins.$inferInsert;

export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;

export type TeamMember = Omit<
  typeof teamMembers.$inferSelect,
  | 'slug'
  | 'category'
  | 'expertise'
  | 'qualifications'
  | 'phone'
  | 'facebook'
  | 'isFeatured'
> & {
  slug?: string | null;
  category?: string | null;
  expertise?: string | null;
  qualifications?: string | null;
  phone?: string | null;
  facebook?: string | null;
  isFeatured?: string | null;
};
export type NewTeamMember = typeof teamMembers.$inferInsert;

export type TeamMemberRevision = typeof teamMemberRevisions.$inferSelect;
export type NewTeamMemberRevision = typeof teamMemberRevisions.$inferInsert;

export type SitePage = Omit<
  typeof sitePages.$inferSelect,
  | 'heroHeadline'
  | 'heroSubtitle'
  | 'heroImage'
  | 'heroCtaText'
  | 'heroCtaLink'
  | 'sectionsJson'
  | 'content'
  | 'seoTitle'
  | 'seoDescription'
  | 'scheduledFor'
  | 'pageType'
  | 'updatedAt'
  | 'createdAt'
> & {
  heroHeadline?: string | null;
  heroSubtitle?: string | null;
  heroImage?: string | null;
  heroCtaText?: string | null;
  heroCtaLink?: string | null;
  sectionsJson?: string | null;
  content?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  scheduledFor?: Date | null;
  pageType?: string | null;
  updatedAt?: Date | null;
  createdAt?: Date | null;
};
export type NewSitePage = typeof sitePages.$inferInsert;

export type PageRevision = typeof pageRevisions.$inferSelect;
export type NewPageRevision = typeof pageRevisions.$inferInsert;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export type MediaItem = Omit<
  typeof mediaItems.$inferSelect,
  | 'publicId'
  | 'thumbnailUrl'
  | 'width'
  | 'height'
  | 'altText'
  | 'caption'
  | 'description'
  | 'tags'
  | 'folder'
  | 'bytes'
  | 'updatedAt'
  | 'createdAt'
> & {
  publicId?: string | null;
  thumbnailUrl?: string | null;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
  caption?: string | null;
  description?: string | null;
  tags?: string | null;
  folder?: string | null;
  bytes?: number | null;
  updatedAt?: Date | null;
  createdAt?: Date | null;
};
export type NewMediaItem = typeof mediaItems.$inferInsert;

export type HomepageSettings = Omit<
  typeof homepageSettings.$inferSelect,
  | 'introBadge'
  | 'introHeading'
  | 'introContent'
  | 'introImage'
  | 'aboutBadge'
  | 'aboutHeading'
  | 'aboutLead'
  | 'aboutImage'
  | 'aboutObjectivesJson'
  | 'focusBadge'
  | 'focusHeading'
  | 'focusSubtitle'
  | 'focusImage'
  | 'featuredFocusAreaIds'
  | 'projectsBadge'
  | 'projectsHeading'
  | 'projectsSubtitle'
  | 'featuredProjectIds'
  | 'impactStatsJson'
  | 'displayImpactStats'
  | 'newsBadge'
  | 'newsHeading'
  | 'newsSubtitle'
  | 'featuredArticleIds'
  | 'pubsBadge'
  | 'pubsHeading'
  | 'pubsSubtitle'
  | 'featuredPublicationIds'
  | 'teamBadge'
  | 'teamHeading'
  | 'teamSubtitle'
  | 'featuredTeamIds'
  | 'partnersBadge'
  | 'partnersHeading'
  | 'partnersJson'
  | 'ctaHeading'
  | 'ctaSubtitle'
  | 'ctaButtonText'
  | 'ctaButtonLink'
  | 'updatedBy'
  | 'updatedAt'
> & {
  introBadge?: string | null;
  introHeading?: string | null;
  introContent?: string | null;
  introImage?: string | null;
  aboutBadge?: string | null;
  aboutHeading?: string | null;
  aboutLead?: string | null;
  aboutImage?: string | null;
  aboutObjectivesJson?: string | null;
  focusBadge?: string | null;
  focusHeading?: string | null;
  focusSubtitle?: string | null;
  focusImage?: string | null;
  featuredFocusAreaIds?: string | null;
  projectsBadge?: string | null;
  projectsHeading?: string | null;
  projectsSubtitle?: string | null;
  featuredProjectIds?: string | null;
  impactStatsJson?: string | null;
  displayImpactStats?: string | null;
  newsBadge?: string | null;
  newsHeading?: string | null;
  newsSubtitle?: string | null;
  featuredArticleIds?: string | null;
  pubsBadge?: string | null;
  pubsHeading?: string | null;
  pubsSubtitle?: string | null;
  featuredPublicationIds?: string | null;
  teamBadge?: string | null;
  teamHeading?: string | null;
  teamSubtitle?: string | null;
  featuredTeamIds?: string | null;
  partnersBadge?: string | null;
  partnersHeading?: string | null;
  partnersJson?: string | null;
  ctaHeading?: string | null;
  ctaSubtitle?: string | null;
  ctaButtonText?: string | null;
  ctaButtonLink?: string | null;
  updatedBy?: string | null;
  updatedAt?: Date | null;
};
export type NewHomepageSettings = typeof homepageSettings.$inferInsert;
