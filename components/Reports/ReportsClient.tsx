'use client';

import { useState, useMemo } from 'react';
import { Transaction } from '@/lib/types';

interface ReportsClientProps {
    initialTransactions: Transaction[];
}

export default function ReportsClient({ initialTransactions }: ReportsClientProps) {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const filteredTransactions = useMemo(() => {
        return initialTransactions.filter((t) => {
            const date = new Date(t.date);
            return date.getFullYear() === selectedYear && date.getMonth() === selectedMonth;
        });
    }, [initialTransactions, selectedYear, selectedMonth]);

    const totalSales = useMemo(() => {
        return filteredTransactions.reduce((sum, t) => sum + t.total, 0);
    }, [filteredTransactions]);

    const averageSale = filteredTransactions.length > 0 ? totalSales / filteredTransactions.length : 0;

    const topItems = useMemo(() => {
        const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();
        filteredTransactions.forEach((t) => {
            t.items.forEach((cartItem) => {
                const name = cartItem.item.name;
                const price = cartItem.item.price;
                const existing = itemMap.get(name) || { name, quantity: 0, revenue: 0 };
                existing.quantity += cartItem.quantity;
                existing.revenue += price * cartItem.quantity;
                itemMap.set(name, existing);
            });
        });
        return Array.from(itemMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }, [filteredTransactions]);

    const years = useMemo(() => {
        const yearSet = new Set(
            initialTransactions
                .map((t) => new Date(t.date).getFullYear())
                .filter((y) => !isNaN(y))
        );
        yearSet.add(new Date().getFullYear());
        return Array.from(yearSet).sort((a, b) => b - a);
    }, [initialTransactions]);

    return (
        <div className="min-h-screen bg-dark-mesh">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
                {/* Page Header */}
                <div className="mb-10 sm:mb-14 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-dark-200/60 backdrop-blur-sm rounded-2xl shadow-dark border border-dark-50/30 animate-reveal-up">
                        <div className="bg-accent/10 p-2 rounded-xl">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 animate-reveal-up stagger-1">
                        <span className="text-gold-gradient">Sales Reports</span>
                    </h1>
                    <p className="text-lg text-ivory-muted max-w-2xl mx-auto animate-reveal-up stagger-2">
                        Track performance and gain insights into your business
                    </p>
                </div>

                {/* Date Selectors */}
                <div className="flex flex-wrap justify-center gap-3 mb-10 animate-reveal-up stagger-3">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="input-dark px-4 py-2.5 rounded-xl text-sm font-semibold min-w-[120px] cursor-pointer"
                    >
                        {years.map((year) => (
                            <option key={year} value={year} className="bg-dark-300">{year}</option>
                        ))}
                    </select>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="input-dark px-4 py-2.5 rounded-xl text-sm font-semibold min-w-[160px] cursor-pointer"
                    >
                        {months.map((month, index) => (
                            <option key={month} value={index} className="bg-dark-300">{month}</option>
                        ))}
                    </select>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 animate-reveal-up stagger-4">
                    {/* Total Sales */}
                    <div className="dark-card-static rounded-2xl p-6 border-l-4 border-l-accent">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-ivory-dim font-semibold uppercase tracking-wider">Total Sales</p>
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-accent">₹{totalSales.toFixed(2)}</p>
                    </div>

                    {/* Transactions */}
                    <div className="dark-card-static rounded-2xl p-6 border-l-4 border-l-emerald-500">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-ivory-dim font-semibold uppercase tracking-wider">Transactions</p>
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-emerald-400">{filteredTransactions.length}</p>
                    </div>

                    {/* Average Sale */}
                    <div className="dark-card-static rounded-2xl p-6 border-l-4 border-l-violet-500">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-ivory-dim font-semibold uppercase tracking-wider">Avg. Sale</p>
                            <div className="p-2 bg-violet-500/10 rounded-lg">
                                <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-violet-400">₹{averageSale.toFixed(2)}</p>
                    </div>
                </div>

                {/* Top Items Table */}
                <div className="dark-card-static rounded-3xl p-6 sm:p-8 shadow-dark-lg animate-reveal-up stagger-5">
                    <h2 className="text-xl font-bold text-ivory mb-6 flex items-center gap-3">
                        <span className="w-1 h-6 bg-accent rounded-full" />
                        Top Selling Items
                    </h2>

                    {topItems.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-ivory-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <p className="text-ivory-muted font-medium">No data available</p>
                            <p className="text-ivory-dim text-sm mt-1">No sales recorded for {months[selectedMonth]} {selectedYear}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-dark-50/30">
                                        <th className="text-left text-xs font-bold uppercase tracking-wider text-accent pb-4 pr-4">#</th>
                                        <th className="text-left text-xs font-bold uppercase tracking-wider text-accent pb-4 pr-4">Item Name</th>
                                        <th className="text-center text-xs font-bold uppercase tracking-wider text-accent pb-4 pr-4">Qty Sold</th>
                                        <th className="text-right text-xs font-bold uppercase tracking-wider text-accent pb-4">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topItems.map((item, index) => (
                                        <tr key={item.name} className="border-b border-dark-50/10 hover:bg-dark-200/50 transition-colors">
                                            <td className="py-4 pr-4">
                                                <span className={`text-sm font-bold ${index === 0 ? 'text-accent' : 'text-ivory-dim'}`}>
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <span className="text-sm font-semibold text-ivory">{item.name}</span>
                                            </td>
                                            <td className="py-4 pr-4 text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 bg-dark-200 rounded-lg text-sm font-bold text-ivory-muted border border-dark-50/20">
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <span className="text-sm font-bold text-accent">₹{item.revenue.toFixed(2)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
