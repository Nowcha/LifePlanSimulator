'use client';
// モンテカルロ確率分布チャート

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MonteCarloResult } from '@/types/plan';

interface Props {
    monteCarlo: MonteCarloResult;
}

export default function MonteCarloChart({ monteCarlo }: Props) {
    const { percentiles, successRate } = monteCarlo;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                    <span>🎲 モンテカルロ・シミュレーション</span>
                    <Badge variant={successRate >= 80 ? 'default' : successRate >= 50 ? 'secondary' : 'destructive'}>
                        資産維持成功率: {successRate}%
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={percentiles} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="age" tick={{ fontSize: 11 }} label={{ value: '年齢', position: 'insideBottomRight', offset: -5, fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v.toLocaleString()}`}
                            label={{ value: '万円', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                        <Tooltip
                            formatter={(value: unknown) => [`${Number(value).toLocaleString()}万円`]}
                            labelFormatter={age => `${age}歳`}
                        />
                        <Legend />
                        <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeWidth={1.5} strokeDasharray="5 5" />
                        {/* 5%〜95%帯 */}
                        <Area type="monotone" dataKey="p95" stackId="band" fill="#dbeafe" stroke="none" fillOpacity={0.3} name="95%ile" />
                        <Area type="monotone" dataKey="p5" stackId="band" fill="#ffffff" stroke="none" fillOpacity={1} name="5%ile" />
                        {/* 25%〜75%帯 — 重ねて表示 */}
                        <Area type="monotone" dataKey="p75" fill="#93c5fd" stroke="#60a5fa" fillOpacity={0.4} strokeWidth={1} name="75%ile" />
                        <Area type="monotone" dataKey="p25" fill="#ffffff" stroke="#93c5fd" fillOpacity={0.8} strokeWidth={1} name="25%ile" />
                        {/* 中央値 */}
                        <Area type="monotone" dataKey="p50" fill="none" stroke="#2563eb" strokeWidth={2.5} name="中央値" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    色付き帯域は資産推移の確率分布を表します（外側: 5%-95%、内側: 25%-75%、線: 中央値）
                </p>
            </CardContent>
        </Card>
    );
}
