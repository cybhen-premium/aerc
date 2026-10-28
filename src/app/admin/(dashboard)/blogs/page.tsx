import { getBlogPosts } from '@/db';
import BlogsTableClient from './BlogsTableClient';

export const metadata = {
  title: 'Articles & News Management | AERC Portal',
  description: 'Manage, publish, schedule, and review climate justice news and editorial stories.',
};

export default async function AdminBlogsPage() {
  const blogs = await getBlogPosts();

  return <BlogsTableClient initialBlogs={blogs} />;
}
