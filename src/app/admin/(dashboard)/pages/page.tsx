import { getSitePages } from '@/db';
import PagesTableClient from './PagesTableClient';

export default async function AdminPagesManagementPage() {
  const pages = await getSitePages();

  return <PagesTableClient initialPages={pages} />;
}
