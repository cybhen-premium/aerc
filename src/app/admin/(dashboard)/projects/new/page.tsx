import ProjectEditorForm from '../ProjectEditorForm';

export const metadata = {
  title: 'Add New Project | AERC Admin',
};

export default function AdminNewProjectPage() {
  return <ProjectEditorForm isNew={true} />;
}
