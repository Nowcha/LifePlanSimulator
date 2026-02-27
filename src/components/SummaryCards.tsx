'use client';
// サマリーKPIカード + シナリオ比較

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SimulationResult } from '@/types/plan';

interface Props {
    result: SimulationResult;
}

function formatOku(value: number): string {
    if (Math.abs(value) >= 10000) return `${(value / 10000).toFixed(1)}億`;
    return `${value.toLocaleString()}万`;
}

export default function SummaryCards({ result }: Props) {
    const { baseResult: base, monteCarlo } = result;

    const cards = [
        { label: '生涯収入', value: formatOku(base.totalIncome), icon: '💰', color: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' },
        { label: '生涯支出', value: formatOku(base.totalExpense), icon: '💸', color: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' },
        { label: '資産ピーク', value: formatOku(base.peakAssets), icon: '📈', color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' },
        { label: base.depletionAge ? '資産枯渇年齢' : '最終資産', value: base.depletionAge ? `${base.depletionAge}歳` : formatOku(base.finalAssets), icon: base.depletionAge ? '⚠️' : '🏦', color: base.depletionAge ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' : 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800' },
    ];

    return (
        <div className="space-y-4">
            {/* KPIカード */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {cards.map(c => (
                    <Card key={c.label} className={`border ${c.color}`}>
                        <CardContent className="pt-4 pb-3 px-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{c.icon}</span>
                                <span className="text-xs text-muted-foreground">{c.label}</span>
                            </div>
                            <p className="text-xl font-bold">{c.value}<span className="text-sm font-normal ml-0.5">円</span></p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* モンテカルロ成功率 + アラート */}
            <Card className={monteCarlo.successRate >= 80
                ? 'border-green-300 bg-green-50 dark:bg-green-950/20 dark:border-green-800'
                : monteCarlo.successRate >= 50
                    ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800'
                    : 'border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-800'}>
                <CardContent className="pt-4 pb-3 px-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">モンテカルロ・シミュレーション結果</p>
                        <p className="text-xs text-muted-foreground">{result.baseResult.records.length}年間のシミュレーション</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{monteCarlo.successRate}%</p>
                        <Badge variant={monteCarlo.successRate >= 80 ? 'default' : monteCarlo.successRate >= 50 ? 'secondary' : 'destructive'}>
                            {monteCarlo.successRate >= 80 ? '安全' : monteCarlo.successRate >= 50 ? '注意' : '危険'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
