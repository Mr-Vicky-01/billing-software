'use client';

import { useState, useEffect } from 'react';
import { getAllMonthlyReports, generateMonthlyReport } from '@/lib/sales';
import { getTransactions } from '@/lib/storage';

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [allReports, setAllReports] = useState(getAllMonthlyReports());

  useEffect(() => {
    const updateReports = () => {
      setAllReports(getAllMonthlyReports());
    };
    updateReports();
    
    const interval = setInterval(updateReports, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentReport = generateMonthlyReport(selectedYear, selectedMonth);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8 text-center">Monthly Sales Reports</h1>

      {/* Date Selection */}
      <div className="bg-white rounded-xl shadow-professional-lg border border-gray-200 p-5 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Current Month Report */}
      <div className="bg-white rounded-xl shadow-professional-lg border border-gray-200 p-5 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
          Report for {months[selectedMonth]} {selectedYear}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 border border-blue-200">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Total Sales</p>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              ₹{currentReport.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 sm:p-5 border border-green-200">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Transaction Count</p>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              {currentReport.transactionCount}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-5 border border-purple-200">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">Average Sale</p>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              {currentReport.transactionCount > 0
                ? `₹${(currentReport.totalSales / currentReport.transactionCount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '₹0.00'}
            </p>
          </div>
        </div>

        {currentReport.topItems.length > 0 && (
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Top Selling Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-2 sm:px-4 py-2 text-left">Item Name</th>
                    <th className="px-2 sm:px-4 py-2 text-right">Quantity</th>
                    <th className="px-2 sm:px-4 py-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReport.topItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-2 sm:px-4 py-2">{item.name}</td>
                      <td className="px-2 sm:px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-2 sm:px-4 py-2 text-right">
                        ₹{item.revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentReport.transactionCount === 0 && (
          <p className="text-gray-500 text-center py-8">
            No transactions for this month.
          </p>
        )}
      </div>

      {/* All Months Summary */}
      {allReports.length > 0 && (
        <div className="bg-white rounded-xl shadow-professional-lg border border-gray-200 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">All Months Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm sm:text-base min-w-[500px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 sm:px-4 py-2 text-left">Month</th>
                  <th className="px-2 sm:px-4 py-2 text-right">Total Sales</th>
                  <th className="px-2 sm:px-4 py-2 text-right">Transactions</th>
                  <th className="px-2 sm:px-4 py-2 text-right">Average Sale</th>
                </tr>
              </thead>
              <tbody>
                {allReports.map((report, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2">
                      {months[report.month]} {report.year}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-right">
                      ₹{report.totalSales.toFixed(2)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-right">
                      {report.transactionCount}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-right">
                      {report.transactionCount > 0
                        ? `₹${(report.totalSales / report.transactionCount).toFixed(2)}`
                        : '₹0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {allReports.length === 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-500">No sales data available yet.</p>
          <p className="text-gray-400 mt-2">
            Complete some transactions to see reports here.
          </p>
        </div>
      )}
    </div>
  );
}
