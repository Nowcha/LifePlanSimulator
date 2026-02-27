'use client';
// 支出内訳の推移グラフ（積み上げ面グラフ）

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { YearlyRecord } from '@/types/plan';

interface Props {
    records: YearlyRecord[];
}

export default function ExpenseBreakdownChart({ records }: Props) {
    const data = records.map(r => ({
        age: r.age,
        '生活費': r.livingExpense,
        '住居費': r.housingExpense,
        '教育費': r.educationExpense,
        '保険料': r.insuranceExpense,
        '自動車': r.carExpense,
        'イベント': r.eventExpense,
    }));

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">📊 支出内訳の推移</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: '年齢', position: 'insideBottomRight', offset: -5, fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v.toLocaleString()}`}
                            label={{ value: '万円', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                        <Tooltip formatter={(value: unknown) => [`${Number(value).toLocaleString()}万円`]} labelFormatter={age => `${age}歳`} />
                        <Legend />
                        <Area type="monotone" dataKey="生活費" stackId="1" fill="#60a5fa" stroke="#3b82f6" fillOpacity={0.7} />
                        <Area type="monotone" dataKey="住居費" stackId="1" fill="#f97316" stroke="#ea580c" fillOpacity={0.7} />
                        <Area type="monotone" dataKey="教育費" stackId="1" fill="#4ade80" stroke="#22c55e" fillOpacity={0.7} />
                        <Area type="monotone" dataKey="保険料" stackId="1" fill="#a78bfa" stroke="#8b5cf6" fillOpacity={0.7} />
                        <Area type="monotone" dataKey="自動車" stackId="1" fill="#f472b6" stroke="#ec4899" fillOpacity={0.7} />
                        <Area type="monotone" dataKey="イベント" stackId="1" fill="#fbbf24" stroke="#f59e0b" fillOpacity={0.7} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
