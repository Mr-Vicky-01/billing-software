import ManageClient from '@/components/Menu/ManageClient';
import { getMenuItems } from '@/lib/db';

export default async function ManagePage() {
  // Server-side data fetching
  const initialItems = await getMenuItems();

  return <ManageClient initialItems={initialItems} />;
}
