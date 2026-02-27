'use client';
// キャッシュフローチャート（棒グラフ）

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { YearlyRecord } from '@/types/plan';

interface Props {
    records: YearlyRecord[];
}

export default function CashflowChart({ records }: Props) {
    const data = records.map(r => ({
        age: r.age,
        '手取り収入': r.netIncome,
        '支出': -r.totalExpense,
        '収支': r.netCashflow,
        events: r.events,
    }));

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">💹 年間キャッシュフロー</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }} stackOffset="sign">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: '年齢', position: 'insideBottomRight', offset: -5, fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v.toLocaleString()}`}
                            label={{ value: '万円', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                        <Tooltip
                            formatter={(value: unknown, name?: string) => [
                                `${Math.abs(Number(value)).toLocaleString()}万円`,
                                name === '支出' ? '支出' : (name ?? ''),
                            ]}
                            labelFormatter={age => {
                                const record = data.find(d => d.age === age);
                                const eventStr = record?.events.length ? `\n📌 ${record.events.join(', ')}` : '';
                                return `${age}歳${eventStr}`;
                            }}
                            contentStyle={{ whiteSpace: 'pre-line' } as React.CSSProperties}
                        />
                        <Legend />
                        <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" />
                        <Bar dataKey="手取り収入" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="支出" fill="#f87171" radius={[0, 0, 2, 2]} />
                        <Bar dataKey="収支">
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry['収支'] >= 0 ? '#22c55e' : '#ef4444'} fillOpacity={0.6} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
