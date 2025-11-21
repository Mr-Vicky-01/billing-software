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
    <div className="min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10 pb-10">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-blue-300"></div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Monthly Sales Reports
              </span>
            </h1>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-blue-300"></div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-2xl shadow-modern-lg border border-gray-100 p-5 sm:p-6 mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-end">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm font-medium"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm font-medium"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Current Month Report */}
        <div className="bg-white rounded-2xl shadow-modern-lg border border-gray-100 p-6 sm:p-8 mb-6 sm:mb-8 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Report for <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{months[selectedMonth]} {selectedYear}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 sm:p-6 border border-blue-200 hover:shadow-modern-lg transition-all duration-300">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-3 uppercase tracking-wide">Total Sales</p>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                ₹{currentReport.totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 sm:p-6 border border-green-200 hover:shadow-modern-lg transition-all duration-300">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-3 uppercase tracking-wide">Transaction Count</p>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                {currentReport.transactionCount}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 sm:p-6 border border-purple-200 hover:shadow-modern-lg transition-all duration-300">
              <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-3 uppercase tracking-wide">Average Sale</p>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {currentReport.transactionCount > 0
                  ? `₹${(currentReport.totalSales / currentReport.transactionCount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '₹0.00'}
              </p>
            </div>
          </div>

          {currentReport.topItems.length > 0 && (
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5">🏆 Top Selling Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Item Name</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900">Quantity</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentReport.topItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-700">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
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
            <div className="mt-8 text-center py-8">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                No transactions for this month.
              </p>
            </div>
          )}
        </div>

        {/* All Months Summary */}
        {allReports.length > 0 && (
          <div className="bg-white rounded-2xl shadow-modern-lg border border-gray-100 p-6 sm:p-8 mt-6 sm:mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">📊 All Months Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Month</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Total Sales</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Transactions</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Average Sale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allReports.map((report, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {months[report.month]} {report.year}
                      </td>
                      <td className="px-4 py-3 text-right font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        ₹{report.totalSales.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-700">
                        {report.transactionCount}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
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
          <div className="bg-white rounded-2xl shadow-modern-lg border border-gray-100 p-8 sm:p-12 text-center mt-6 sm:mt-8">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No sales data available yet.</p>
            <p className="text-gray-400 mt-2">
              Complete some transactions to see reports here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
