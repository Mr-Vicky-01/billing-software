import { Transaction } from './types';

export interface MonthlyReport {
  year: number;
  month: number;
  totalSales: number;
  transactionCount: number;
  topItems: { name: string; quantity: number; revenue: number }[];
}

// Server-side async version
export const generateMonthlyReportAsync = async (transactions: Transaction[], year: number, month: number): Promise<MonthlyReport> => {
  const filtered = transactions.filter(t => {
    const date = new Date(t.timestamp);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const totalSales = filtered.reduce((sum: number, t: Transaction) => sum + t.total, 0);
  const transactionCount = filtered.length;

  // Calculate top items
  const itemMap = new Map<string, { quantity: number; revenue: number }>();

  filtered.forEach((transaction: Transaction) => {
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

export const getAllMonthlyReportsAsync = async (transactions: Transaction[]): Promise<MonthlyReport[]> => {
  const monthMap = new Map<string, Transaction[]>();

  transactions.forEach((t: Transaction) => {
    const date = new Date(t.timestamp);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const existing = monthMap.get(key) || [];
    existing.push(t);
    monthMap.set(key, existing);
  });

  const reports = await Promise.all(
    Array.from(monthMap.keys()).map(async (key) => {
      const [year, month] = key.split('-').map(Number);
      return generateMonthlyReportAsync(transactions, year, month);
    })
  );

  return reports.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};

// Client-side synchronous functions for use in components
// These work with pre-loaded data passed as props
export const generateMonthlyReport = (transactions: Transaction[], year: number, month: number): MonthlyReport => {
  const filtered = transactions.filter(t => {
    const date = new Date(t.timestamp);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const totalSales = filtered.reduce((sum: number, t: Transaction) => sum + t.total, 0);
  const transactionCount = filtered.length;

  const itemMap = new Map<string, { quantity: number; revenue: number }>();

  filtered.forEach((transaction: Transaction) => {
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

export const getAllMonthlyReports = (transactions: Transaction[]): MonthlyReport[] => {
  const monthMap = new Map<string, Transaction[]>();

  transactions.forEach((t: Transaction) => {
    const date = new Date(t.timestamp);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const existing = monthMap.get(key) || [];
    existing.push(t);
    monthMap.set(key, existing);
  });

  return Array.from(monthMap.entries()).map(([key, trans]) => {
    const [year, month] = key.split('-').map(Number);
    return generateMonthlyReport(transactions, year, month);
  }).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};
