'use client';
// 資産推移チャート（3シナリオ比較）

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ScenarioResult } from '@/types/plan';

interface Props {
    base: ScenarioResult;
    optimistic: ScenarioResult;
    pessimistic: ScenarioResult;
}

export default function AssetChart({ base, optimistic, pessimistic }: Props) {
    const data = base.records.map((r, i) => ({
        age: r.age,
        '基本': r.totalAssets,
        '楽観': optimistic.records[i]?.totalAssets ?? 0,
        '悲観': pessimistic.records[i]?.totalAssets ?? 0,
    }));

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">📈 資産推移（シナリオ比較）</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: '年齢', position: 'insideBottomRight', offset: -5, fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v.toLocaleString()}`}
                            label={{ value: '万円', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                        <Tooltip
                            formatter={(value: unknown) => [`${Number(value).toLocaleString()}万円`]}
                            labelFormatter={age => `${age}歳`}
                        />
                        <Legend />
                        <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="楽観" stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="基本" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                        <Line type="monotone" dataKey="悲観" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
