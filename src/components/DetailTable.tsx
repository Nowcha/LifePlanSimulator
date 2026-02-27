'use client';
// 年次詳細テーブル + CSV出力

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { YearlyRecord } from '@/types/plan';

interface Props {
    records: YearlyRecord[];
}

export default function DetailTable({ records }: Props) {
    const downloadCSV = useCallback(() => {
        const headers = ['年齢', '年', '税引前収入', '給与', '配偶者給与', '年金', '投資収益', 'その他',
            '所得税', '住民税', '社保', '手取り', '支出合計', '生活費', '住居費', '教育費', '保険', '自動車', 'イベント',
            '収支', '資産残高', 'イベント'];
        const rows = records.map(r => [
            r.age, r.year, r.grossIncome, r.salary, r.spouseSalary, r.pensionIncome,
            r.investmentIncome, r.otherIncome, r.incomeTax, r.residentTax, r.socialInsurance,
            r.netIncome, r.totalExpense, r.livingExpense, r.housingExpense, r.educationExpense,
            r.insuranceExpense, r.carExpense, r.eventExpense, r.netCashflow, r.totalAssets,
            r.events.join(' / '),
        ]);
        const bom = '\uFEFF';
        const csv = bom + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'life_plan_simulation.csv';
        a.click();
        URL.revokeObjectURL(url);
    }, [records]);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                    <span>📋 年次詳細テーブル</span>
                    <Button size="sm" onClick={downloadCSV}>📥 CSVダウンロード</Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-background z-10">
                            <tr className="border-b">
                                <th className="text-left py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">年齢</th>
                                <th className="text-right py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">税引前</th>
                                <th className="text-right py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">手取り</th>
                                <th className="text-right py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">所得税</th>
                                <th className="text-right py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">住民税</th>
                                <th className="text-right py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">社保</th>
                                <th className="text-right py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">支出</th>
                                <th className="text-right py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">収支</th>
                                <th className="text-right py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">資産</th>
                                <th className="text-left py-2 px-1.5 font-semibold text-muted-foreground whitespace-nowrap">イベント</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(r => (
                                <tr key={r.age} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${r.totalAssets < 0 ? 'bg-destructive/5' : ''}`}>
                                    <td className="py-1.5 px-1.5 font-medium">{r.age}歳</td>
                                    <td className="py-1.5 px-1.5 text-right">{r.grossIncome.toLocaleString()}</td>
                                    <td className="py-1.5 px-1.5 text-right text-blue-600 dark:text-blue-400">{r.netIncome.toLocaleString()}</td>
                                    <td className="py-1.5 px-1.5 text-right text-muted-foreground">{r.incomeTax.toLocaleString()}</td>
                                    <td className="py-1.5 px-1.5 text-right text-muted-foreground">{r.residentTax.toLocaleString()}</td>
                                    <td className="py-1.5 px-1.5 text-right text-muted-foreground">{r.socialInsurance.toLocaleString()}</td>
                                    <td className="py-1.5 px-1.5 text-right text-red-500">{r.totalExpense.toLocaleString()}</td>
                                    <td className={`py-1.5 px-1.5 text-right font-medium ${r.netCashflow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {r.netCashflow >= 0 ? '+' : ''}{r.netCashflow.toLocaleString()}
                                    </td>
                                    <td className={`py-1.5 px-1.5 text-right font-bold ${r.totalAssets >= 0 ? '' : 'text-red-600 dark:text-red-400'}`}>
                                        {r.totalAssets.toLocaleString()}
                                    </td>
                                    <td className="py-1.5 px-1.5">
                                        {r.events.length > 0 && (
                                            <div className="flex flex-wrap gap-0.5">
                                                {r.events.map((e, i) => (
                                                    <span key={i} className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">{e}</span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
