import { Transaction } from './types';
import { getTransactions, getTransactionsByMonth } from './storage';

export interface MonthlyReport {
  year: number;
  month: number;
  totalSales: number;
  transactionCount: number;
  topItems: { name: string; quantity: number; revenue: number }[];
}

export const generateMonthlyReport = (year: number, month: number): MonthlyReport => {
  const transactions = getTransactionsByMonth(year, month);
  
  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const transactionCount = transactions.length;

  // Calculate top items
  const itemMap = new Map<string, { quantity: number; revenue: number }>();
  
  transactions.forEach(transaction => {
    transaction.items.forEach(cartItem => {
      const itemName = cartItem.item.name;
      const existing = itemMap.get(itemName) || { quantity: 0, revenue: 0 };
      itemMap.set(itemName, {
        quantity: existing.quantity + cartItem.quantity,
        revenue: existing.revenue + (cartItem.item.price * cartItem.quantity),
      });
    });
  });

  const topItems = Array.from(itemMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return {
    year,
    month,
    totalSales,
    transactionCount,
    topItems,
  };
};

export const getAllMonthlyReports = (): MonthlyReport[] => {
  const transactions = getTransactions();
  const monthMap = new Map<string, Transaction[]>();

  transactions.forEach(t => {
    const date = new Date(t.timestamp);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const existing = monthMap.get(key) || [];
    existing.push(t);
    monthMap.set(key, existing);
  });

  return Array.from(monthMap.entries()).map(([key, trans]) => {
    const [year, month] = key.split('-').map(Number);
    return generateMonthlyReport(year, month);
  }).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};
