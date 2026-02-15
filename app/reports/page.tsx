import ReportsClient from '@/components/Reports/ReportsClient';
import { getTransactions } from '@/lib/db';

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReportsPage() {
  // Server-side data fetching
  const rawTransactions = await getTransactions();
  const transactions = JSON.parse(JSON.stringify(rawTransactions));

  return <ReportsClient initialTransactions={transactions} />;
}
