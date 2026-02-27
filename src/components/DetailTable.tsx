// 年齢ごとの詳細テーブル（CSV出力付き）
import { useCallback } from 'react';
import type { YearlyRecord } from '../types/plan';

interface Props {
    records: YearlyRecord[];
}

export default function DetailTable({ records }: Props) {
    // CSVダウンロード
    const downloadCSV = useCallback(() => {
        const headers = ['年齢', '収入', '支出', '収支', '投資収益', '資産残高', 'イベント'];
        const rows = records.map((r) => [
            r.age,
            r.income,
            r.expense,
            r.netCashflow,
            r.investmentGain,
            r.assets,
            r.events.join(' / '),
        ]);
        const bom = '\uFEFF'; // BOMを付与してExcelでの文字化けを防ぐ
        const csv = bom + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'life_plan_simulation.csv';
        a.click();
        URL.revokeObjectURL(url);
    }, [records]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">📋 詳細テーブル</h3>
                <button
                    onClick={downloadCSV}
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-all cursor-pointer"
                >
                    📥 CSVダウンロード
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">年齢</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">収入</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">支出</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">収支</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">投資収益</th>
                            <th className="text-right py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">資産残高</th>
                            <th className="text-left py-3 px-2 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">イベント</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((r) => (
                            <tr
                                key={r.age}
                                className={`border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${r.assets < 0 ? 'bg-red-50 dark:bg-red-900/10' : ''
                                    }`}
                            >
                                <td className="py-2 px-2 font-medium text-gray-800 dark:text-gray-200">{r.age}歳</td>
                                <td className="py-2 px-2 text-right text-blue-600 dark:text-blue-400">{r.income.toLocaleString()}</td>
                                <td className="py-2 px-2 text-right text-red-500 dark:text-red-400">{r.expense.toLocaleString()}</td>
                                <td className={`py-2 px-2 text-right font-medium ${r.netCashflow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {r.netCashflow >= 0 ? '+' : ''}{r.netCashflow.toLocaleString()}
                                </td>
                                <td className="py-2 px-2 text-right text-purple-600 dark:text-purple-400">{r.investmentGain.toLocaleString()}</td>
                                <td className={`py-2 px-2 text-right font-bold ${r.assets >= 0 ? 'text-gray-800 dark:text-gray-200' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {r.assets.toLocaleString()}
                                </td>
                                <td className="py-2 px-2">
                                    {r.events.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {r.events.map((e, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
                                                    {e}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
