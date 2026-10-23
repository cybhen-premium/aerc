import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { initialProjects, initialBlogs, initialPublications } from './seed-data';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

async function seed() {
  if (!connectionString) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sql = neon(connectionString);
  const db = drizzle(sql, { schema });

  console.log('Seeding projects...');
  for (const proj of initialProjects) {
    await db.insert(schema.projects).values({
      slug: proj.slug,
      title: proj.title,
      tag: proj.tag,
      summary: proj.summary,
      description: proj.description,
      coverImage: proj.coverImage,
      status: proj.status,
    }).onConflictDoUpdate({
      target: schema.projects.slug,
      set: {
        title: proj.title,
        tag: proj.tag,
        summary: proj.summary,
        description: proj.description,
        coverImage: proj.coverImage,
        status: proj.status,
      },
    });
  }

  console.log('Seeding publications...');
  for (const pub of initialPublications) {
    await db.insert(schema.publications).values({
      title: pub.title,
      description: pub.description,
      fileType: pub.fileType,
      fileSize: pub.fileSize,
      downloadUrl: pub.downloadUrl,
      publishedAt: pub.publishedAt,
    }).onConflictDoNothing();
  }

  console.log('Seeding blog posts...');
  for (const blog of initialBlogs) {
    await db.insert(schema.blogPosts).values({
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      category: blog.category,
      author: blog.author,
      publishedAt: blog.publishedAt,
    }).onConflictDoNothing();
  }

  console.log('✅ Neon Database seeded successfully!');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
