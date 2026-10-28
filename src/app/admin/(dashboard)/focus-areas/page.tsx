import { getFocusAreas } from '@/db';
import FocusAreasTableClient from './FocusAreasTableClient';

export const metadata = {
  title: 'Focus Areas & Strategic Pillars | AERC Admin',
};

export default async function AdminFocusAreasPage() {
  const focusAreas = await getFocusAreas();

  return <FocusAreasTableClient initialFocusAreas={focusAreas} />;
}
