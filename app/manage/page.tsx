import ManageClient from '@/components/Menu/ManageClient';
import { getMenuItems } from '@/lib/db';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ManagePage() {
  // Server-side data fetching
  const rawItems = await getMenuItems();
  const initialItems = JSON.parse(JSON.stringify(rawItems));

  return <ManageClient initialItems={initialItems} />;
}
