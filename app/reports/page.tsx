import ReportsClient from '@/components/Reports/ReportsClient';
import { getTransactions } from '@/lib/db';

export default async function ReportsPage() {
  // Server-side data fetching
  const transactions = await getTransactions();

  return <ReportsClient initialTransactions={transactions} />;
}
