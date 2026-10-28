import { getProjects } from '@/db';
import ProjectsTableClient from './ProjectsTableClient';

export const metadata = {
  title: 'Projects & Initiatives | AERC Admin',
};

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return <ProjectsTableClient initialProjects={projects} />;
}
