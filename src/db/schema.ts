import { pgTable, text, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

// 1. Blog Posts
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  category: varchar('category', { length: 100 }).default('Climate Justice'),
  author: varchar('author', { length: 100 }).default('AERC Team'),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
});

// 2. Publications & Reports
export const publications = pgTable('publications', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  fileType: varchar('file_type', { length: 20 }).default('PDF'),
  fileSize: varchar('file_size', { length: 50 }).default('2.4 MB'),
  downloadUrl: text('download_url').notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
});

// 3. Projects
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  title: text('title').notNull(),
  tag: varchar('tag', { length: 100 }).notNull(),
  summary: text('summary').notNull(),
  description: text('description'),
  coverImage: text('cover_image').notNull(),
  status: varchar('status', { length: 50 }).default('Active'),
});

// 4. Contact Form Inquiries
export const contactInquiries = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
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

// Type definitions
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type Publication = typeof publications.$inferSelect;
export type NewPublication = typeof publications.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type NewContactInquiry = typeof contactInquiries.$inferInsert;

export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type NewPartnerApplication = typeof partnerApplications.$inferInsert;

export type VolunteerApplication = typeof volunteerApplications.$inferSelect;
export type NewVolunteerApplication = typeof volunteerApplications.$inferInsert;

export type BlogComment = typeof blogComments.$inferSelect;
export type NewBlogComment = typeof blogComments.$inferInsert;
