// 支出内訳の推移グラフ（積み上げ面グラフ）
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { YearlyRecord } from '../../types/plan';

interface Props {
    records: YearlyRecord[];
}

export default function ExpenseBreakdownChart({ records }: Props) {
    const data = records.map((r) => ({
        age: r.age,
        '生活費': r.livingExpense,
        '住居費': r.housingExpense,
        '保険料': r.insuranceExpense,
        '教育費': r.educationExpense,
        'イベント': r.eventExpense,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📊 支出内訳の推移</h3>
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="age"
                        tick={{ fontSize: 12 }}
                        label={{ value: '年齢', position: 'insideBottomRight', offset: -5, fontSize: 12 }}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => `${v.toLocaleString()}`}
                        label={{ value: '万円', angle: -90, position: 'insideLeft', fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value: unknown) => [`${Number(value).toLocaleString()}万円`]}
                        labelFormatter={(age) => `${age}歳`}
                        contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="生活費" stackId="1" fill="#60a5fa" stroke="#3b82f6" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="住居費" stackId="1" fill="#f97316" stroke="#ea580c" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="保険料" stackId="1" fill="#a78bfa" stroke="#8b5cf6" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="教育費" stackId="1" fill="#4ade80" stroke="#22c55e" fillOpacity={0.7} />
                    <Area type="monotone" dataKey="イベント" stackId="1" fill="#fbbf24" stroke="#f59e0b" fillOpacity={0.7} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
