import { useMemo, useState } from 'react';
import { usePlanStore } from '@/stores/plan-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    Bar, ComposedChart, Area
} from 'recharts';
import { RefreshCw, Download, Table as TableIcon, BarChart2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { YearlyRecord } from '@/types/plan';

export function Dashboard() {
    const { result, reset, isSimulating } = usePlanStore();
    const [breakdownScenario, setBreakdownScenario] = useState<'standard' | 'optimistic' | 'pessimistic'>('standard');
    const [assetScenario, setAssetScenario] = useState<'standard' | 'optimistic' | 'pessimistic'>('standard');
    const [selectedRecord, setSelectedRecord] = useState<YearlyRecord | null>(null);

    const handleEdit = () => {
        // 編集に戻る（Step 1 からやり直すがデータは保持）
        usePlanStore.setState({ result: null, currentStep: 0 });
    };

    const downloadCSV = () => {
        if (!result) return;
        const headers = ['年齢', '年', '手取り収入(万円)', '支出合計(万円)', '年間収支(万円)', '預貯金(万円)', '投資資産(万円)', '総資産(万円)', '所得税(万円)', '住民税(万円)', '社会保険料(万円)'];
        const rows = result.standard.records.map(r => [
            r.age,
            r.year,
            Math.floor(r.netIncome),
            Math.floor(r.totalExpense),
            Math.floor(r.balance),
            Math.floor(r.savingsBalance),
            Math.floor(r.investmentBalance),
            Math.floor(r.totalAssets),
            Math.floor(r.incomeTax),
            Math.floor(r.residentTax),
            Math.floor(r.socialInsurance),
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        // BOM付きで文字化け防止
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `lifeplan_simulation_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const dashboardData = useMemo(() => {
        if (!result) return { assetData: [], cashflowData: [] };

        const { standard, optimistic, pessimistic, monteCarlo } = result;

        // 資産推移データ
        const assetData = standard.records.map((record, i) => {
            const dataPoint: any = {
                age: record.age,
                standard: record.totalAssets,
                optimistic: optimistic.records[i]?.totalAssets || 0,
                pessimistic: pessimistic.records[i]?.totalAssets || 0,
                standardSavings: record.savingsBalance,
                standardInvestment: record.investmentBalance,
                optimisticSavings: optimistic.records[i]?.savingsBalance || 0,
                optimisticInvestment: optimistic.records[i]?.investmentBalance || 0,
                pessimisticSavings: pessimistic.records[i]?.savingsBalance || 0,
                pessimisticInvestment: pessimistic.records[i]?.investmentBalance || 0,
            };

            if (monteCarlo) {
                dataPoint.mcP50 = monteCarlo.percentiles.p50[i];
                dataPoint.mcP25 = monteCarlo.percentiles.p25[i];
                dataPoint.mcP75 = monteCarlo.percentiles.p75[i];
                dataPoint.mcP5 = monteCarlo.percentiles.p5[i];
            }
            return dataPoint;
        });

        // キャッシュフローデータ (標準シナリオベース)
        const cashflowData = standard.records.map(record => ({
            age: record.age,
            income: record.totalIncome - record.socialInsurance - record.incomeTax - record.residentTax, // 手取り
            expense: record.totalExpense,
            balance: record.balance,
        }));

        return { assetData, cashflowData };
    }, [result]);

    if (isSimulating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
                <RefreshCw className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-muted-foreground">シミュレーションを実行中...</p>
            </div>
        );
    }

    if (!result) return null;

    const std = result.standard;
    const opt = result.optimistic;
    const pes = result.pessimistic;
    const isBankrupt = std.bankruptAge !== null;

    const scenarioLabel = (s: typeof std) => {
        if (s.bankruptAge !== null) return `${s.bankruptAge} 歳で資金不足`;
        return '100歳まで安泰';
    };

    return (
        <div className="space-y-8 w-full animate-in fade-in duration-500">
            <div className="flex items-center justify-between pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">シミュレーション結果</h2>
                    <p className="text-muted-foreground">入力された条件に基づく生涯の収支と資産推移です。</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={downloadCSV} variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> CSV出力
                    </Button>
                    <Button onClick={handleEdit} variant="outline">
                        条件を再編集
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className={isBankrupt ? 'border-destructive/50' : 'border-emerald-500/50'}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">シミュレーション結果</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-muted-foreground w-8">楽観</span>
                            <span className={`text-sm font-semibold ${opt.bankruptAge !== null ? 'text-destructive' : 'text-emerald-500'}`}>{scenarioLabel(opt)}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-muted-foreground w-8">標準</span>
                            <span className={`text-lg font-bold ${isBankrupt ? 'text-destructive' : 'text-emerald-500'}`}>{scenarioLabel(std)}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-muted-foreground w-8">悲観</span>
                            <span className={`text-sm font-semibold ${pes.bankruptAge !== null ? 'text-destructive' : 'text-emerald-500'}`}>{scenarioLabel(pes)}</span>
                        </div>
                        {result.monteCarlo && (
                            <p className="text-xs text-muted-foreground mt-1">
                                達成確率: {result.monteCarlo.successRate.toFixed(1)}% (MCシミ)
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">最高資産残高</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-muted-foreground w-8">楽観</span>
                            <span className="text-sm font-semibold">{Math.floor(opt.peakAssets).toLocaleString()} 万円</span>
                            <span className="text-xs text-muted-foreground">({opt.peakAssetsAge}歳)</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-muted-foreground w-8">標準</span>
                            <span className="text-lg font-bold">{Math.floor(std.peakAssets).toLocaleString()} 万円</span>
                            <span className="text-xs text-muted-foreground">({std.peakAssetsAge}歳)</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-muted-foreground w-8">悲観</span>
                            <span className="text-sm font-semibold">{Math.floor(pes.peakAssets).toLocaleString()} 万円</span>
                            <span className="text-xs text-muted-foreground">({pes.peakAssetsAge}歳)</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">シミュレーション終了時資産残高</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-muted-foreground w-8">楽観</span>
                            <span className="text-sm font-semibold">{Math.floor(opt.records[opt.records.length - 1].totalAssets).toLocaleString()} 万円</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-muted-foreground w-8">標準</span>
                            <span className="text-lg font-bold">{Math.floor(std.records[std.records.length - 1].totalAssets).toLocaleString()} 万円</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xs text-muted-foreground w-8">悲観</span>
                            <span className="text-sm font-semibold">{Math.floor(pes.records[pes.records.length - 1].totalAssets).toLocaleString()} 万円</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="charts" className="w-full">
                <div className="flex justify-end mb-4">
                    <TabsList>
                        <TabsTrigger value="charts" className="flex items-center gap-2"><BarChart2 className="w-4 h-4" /> グラフ表示</TabsTrigger>
                        <TabsTrigger value="asset-breakdown" className="flex items-center gap-2"><BarChart2 className="w-4 h-4" /> 資産内訳推移</TabsTrigger>
                        <TabsTrigger value="table" className="flex items-center gap-2"><TableIcon className="w-4 h-4" /> 詳細データ表</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="charts" className="space-y-8 animate-in fade-in">
                    {/* 資産推移グラフ */}
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div>
                                <CardTitle>資産残高推移 ({assetScenario === 'standard' ? '標準' : assetScenario === 'optimistic' ? '楽観' : '悲観'}シナリオ)</CardTitle>
                                <CardDescription>年齢ごとの保有資産額の推移</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant={assetScenario === 'optimistic' ? 'default' : 'outline'} onClick={() => setAssetScenario('optimistic')}>楽観</Button>
                                <Button size="sm" variant={assetScenario === 'standard' ? 'default' : 'outline'} onClick={() => setAssetScenario('standard')}>標準</Button>
                                <Button size="sm" variant={assetScenario === 'pessimistic' ? 'default' : 'outline'} onClick={() => setAssetScenario('pessimistic')}>悲観</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    {result.monteCarlo ? (
                                        <ComposedChart data={dashboardData.assetData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                            <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                                            <YAxis tickFormatter={(val) => `${val / 10000}億`} tick={{ fontSize: 12 }} />
                                            <RechartsTooltip
                                                formatter={(value: any) => [`${Math.floor(Number(value) || 0).toLocaleString()} 万円`, '']}
                                                labelFormatter={(label) => `${label} 歳`}
                                            />
                                            <Legend />
                                            <Area type="monotone" dataKey="mcP75" stroke="none" fill="#10b981" fillOpacity={0.1} name="上位25%" />
                                            <Area type="monotone" dataKey="mcP25" stroke="none" fill="#ef4444" fillOpacity={0.1} name="下位25%" />
                                            <Line type="monotone" dataKey="mcP50" stroke="#3b82f6" strokeWidth={3} dot={false} name="中央値 (P50)" />
                                            <Line type="monotone" dataKey="mcP5" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="下位5% (悲観)" />
                                        </ComposedChart>
                                    ) : (
                                        <LineChart data={dashboardData.assetData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                            <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                                            <YAxis tickFormatter={(val) => `${val / 10000}億`} tick={{ fontSize: 12 }} />
                                            <RechartsTooltip
                                                formatter={(value: any) => [`${Math.floor(Number(value) || 0).toLocaleString()} 万円`, '']}
                                                labelFormatter={(label) => `${label} 歳`}
                                            />
                                            <Legend />
                                            <Line type="monotone" dataKey={assetScenario} stroke="#3b82f6" strokeWidth={3} dot={false} name={`${assetScenario === 'standard' ? '標準' : assetScenario === 'optimistic' ? '楽観' : '悲観'}シナリオ`} />
                                        </LineChart>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 年間キャッシュフロー */}
                    <Card>
                        <CardHeader>
                            <CardTitle>年間キャッシュフロー (標準シナリオ)</CardTitle>
                            <CardDescription>年齢ごとの手取り収入と支出のバランス</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={dashboardData.cashflowData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                                        <YAxis tickFormatter={(val) => `${val / 100}k`} tick={{ fontSize: 12 }} />
                                        <RechartsTooltip
                                            formatter={(value: any) => [`${Math.floor(Number(value) || 0).toLocaleString()} 万円`, '']}
                                            labelFormatter={(label) => `${label} 歳`}
                                        />
                                        <Legend />
                                        <Bar dataKey="income" fill="#3b82f6" name="手取り収入" opacity={0.8} />
                                        <Bar dataKey="expense" fill="#f97316" name="支出合計" opacity={0.8} />
                                        <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} dot={false} name="単年収支" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="asset-breakdown" className="animate-in fade-in">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div>
                                <CardTitle>資産内訳推移 ({breakdownScenario === 'standard' ? '標準' : breakdownScenario === 'optimistic' ? '楽観' : '悲観'}シナリオ)</CardTitle>
                                <CardDescription>年齢ごとの預貯金と投資・運用資産の割合・残高推移</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant={breakdownScenario === 'optimistic' ? 'default' : 'outline'} onClick={() => setBreakdownScenario('optimistic')}>楽観</Button>
                                <Button size="sm" variant={breakdownScenario === 'standard' ? 'default' : 'outline'} onClick={() => setBreakdownScenario('standard')}>標準</Button>
                                <Button size="sm" variant={breakdownScenario === 'pessimistic' ? 'default' : 'outline'} onClick={() => setBreakdownScenario('pessimistic')}>悲観</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[450px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={dashboardData.assetData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                                        <YAxis tickFormatter={(val) => `${val / 10000}億`} tick={{ fontSize: 12 }} />
                                        <RechartsTooltip
                                            formatter={(value: any, name: any) => [
                                                `${Math.floor(Number(value) || 0).toLocaleString()} 万円`,
                                                name === `${breakdownScenario}Savings` ? '預貯金' : name === `${breakdownScenario}Investment` ? '投資・運用資産' : name === breakdownScenario ? '総資産額' : name
                                            ]}
                                            labelFormatter={(label) => `${label} 歳`}
                                        />
                                        <Legend />
                                        <Area type="monotone" dataKey={`${breakdownScenario}Investment`} stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="投資・運用資産" />
                                        <Area type="monotone" dataKey={`${breakdownScenario}Savings`} stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="預貯金" />
                                        <Line type="monotone" dataKey={breakdownScenario} stroke="#f59e0b" strokeWidth={2} dot={false} name="総資産額" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="table" className="animate-in fade-in">
                    <Card>
                        <CardHeader>
                            <CardTitle>キャッシュフロー詳細表</CardTitle>
                            <CardDescription>各年齢ごとの詳細な収入・支出・資産残高（標準シナリオ）</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table containerClassName="h-[600px]">
                                    <TableHeader className="sticky top-0 z-20 bg-background/95 backdrop-blur shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_1px_3px_rgba(255,255,255,0.1)]">
                                        <TableRow>
                                            <TableHead className="w-[60px] text-center">年齢</TableHead>
                                            <TableHead className="w-[80px] text-center">西暦</TableHead>
                                            <TableHead className="text-right">手取り額</TableHead>
                                            <TableHead className="text-right">総支出</TableHead>
                                            <TableHead className="text-right">年間収支</TableHead>
                                            <TableHead className="text-right border-l pl-4">預貯金</TableHead>
                                            <TableHead className="text-right">投資資産</TableHead>
                                            <TableHead className="text-right border-x font-bold">総資産額</TableHead>
                                            <TableHead className="text-right text-muted-foreground text-xs">税・社保</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {std.records.map((r, idx) => (
                                            <TableRow
                                                key={idx}
                                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => setSelectedRecord(r)}
                                                title="クリックして計算明細を見る"
                                            >
                                                <TableCell className="text-center font-medium">{r.age}</TableCell>
                                                <TableCell className="text-center text-muted-foreground">{r.year}</TableCell>
                                                <TableCell className="text-right text-blue-500">{Math.floor(r.netIncome).toLocaleString()} 万</TableCell>
                                                <TableCell className="text-right text-orange-500">{Math.floor(r.totalExpense).toLocaleString()} 万</TableCell>
                                                <TableCell className={`text-right font-medium ${r.balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {r.balance > 0 ? '+' : ''}{Math.floor(r.balance).toLocaleString()} 万
                                                </TableCell>
                                                <TableCell className="text-right border-l pl-4">{Math.floor(r.savingsBalance).toLocaleString()} 万</TableCell>
                                                <TableCell className="text-right">{Math.floor(r.investmentBalance).toLocaleString()} 万</TableCell>
                                                <TableCell className={`text-right font-bold border-x ${r.totalAssets === 0 ? 'text-red-500' : ''}`}>
                                                    {Math.floor(r.totalAssets).toLocaleString()} 万
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground text-xs">
                                                    {Math.floor(r.incomeTax + r.residentTax + r.socialInsurance).toLocaleString()} 万
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* 詳細明細ポップアップ */}
            <Dialog open={selectedRecord !== null} onOpenChange={(open: boolean) => !open && setSelectedRecord(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedRecord?.age}歳 ({selectedRecord?.year}年) の計算明細</DialogTitle>
                        <DialogDescription>
                            標準シナリオにおける各項目の詳細な内訳です。
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRecord && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            {/* 収入内訳 */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-blue-600 flex items-center border-b pb-1">収入内訳</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span>基本給与 (本人)</span><span>{Math.floor(selectedRecord.salary).toLocaleString()} 万円</span></div>
                                    <div className="flex justify-between"><span>給与 (配偶者)</span><span>{Math.floor(selectedRecord.spouseSalary).toLocaleString()} 万円</span></div>
                                    {selectedRecord.sideJob > 0 && <div className="flex justify-between"><span>副業収入</span><span>{Math.floor(selectedRecord.sideJob).toLocaleString()} 万円</span></div>}
                                    {selectedRecord.selfPension > 0 && <div className="flex justify-between"><span>公的年金 (本人)</span><span>{Math.floor(selectedRecord.selfPension).toLocaleString()} 万円</span></div>}
                                    {selectedRecord.spousePension > 0 && <div className="flex justify-between"><span>公的年金 (配偶者)</span><span>{Math.floor(selectedRecord.spousePension).toLocaleString()} 万円</span></div>}
                                    {selectedRecord.otherIncome > 0 && <div className="flex justify-between text-emerald-600 font-medium"><span>一時所得・退職金等</span><span>{Math.floor(selectedRecord.otherIncome).toLocaleString()} 万円</span></div>}
                                    {selectedRecord.investmentWithdrawal > 0 && <div className="flex justify-between text-red-500 font-medium"><span>投資取り崩し資金</span><span>{Math.floor(selectedRecord.investmentWithdrawal).toLocaleString()} 万円</span></div>}
                                    <div className="flex justify-between font-bold pt-2 border-t mt-1"><span>総収入</span><span>{Math.floor(selectedRecord.totalIncome).toLocaleString()} 万円</span></div>
                                    <div className="flex justify-between text-muted-foreground border-b pb-1 mb-1"><span>税・社会保険料</span><span className="text-red-500">-{Math.floor(selectedRecord.incomeTax + selectedRecord.residentTax + selectedRecord.socialInsurance).toLocaleString()} 万円</span></div>
                                    <div className="flex justify-between font-bold text-blue-600 pt-1"><span>手取り額</span><span>{Math.floor(selectedRecord.netIncome).toLocaleString()} 万円</span></div>
                                </div>
                            </div>

                            {/* 支出内訳 */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-orange-600 flex items-center border-b pb-1">支出内訳</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span>基本生活費</span><span>{Math.floor(selectedRecord.livingCost).toLocaleString()} 万円</span></div>
                                    {selectedRecord.expenseDetails?.basicLiving && (
                                        <div className="pr-2 pl-4 py-1 bg-muted/30 rounded-md mb-2 space-y-1 text-xs text-muted-foreground">
                                            <div className="flex justify-between"><span>食費</span><span>{Math.floor(selectedRecord.expenseDetails.basicLiving.food).toLocaleString()} 万円</span></div>
                                            <div className="flex justify-between"><span>水道光熱費</span><span>{Math.floor(selectedRecord.expenseDetails.basicLiving.utilities).toLocaleString()} 万円</span></div>
                                            <div className="flex justify-between"><span>通信費</span><span>{Math.floor(selectedRecord.expenseDetails.basicLiving.communication).toLocaleString()} 万円</span></div>
                                            <div className="flex justify-between"><span>日用品</span><span>{Math.floor(selectedRecord.expenseDetails.basicLiving.dailyNecessities).toLocaleString()} 万円</span></div>
                                            <div className="flex justify-between"><span>お小遣い・その他</span><span>{Math.floor(selectedRecord.expenseDetails.basicLiving.allowanceAndOther).toLocaleString()} 万円</span></div>
                                            {selectedRecord.expenseDetails.basicLiving.childAdditional && (
                                                <div className="flex justify-between text-orange-600/80"><span>子ども追加生活費</span><span>{Math.floor(selectedRecord.expenseDetails.basicLiving.childAdditional).toLocaleString()} 万円</span></div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-between"><span>住居関連費</span><span>{Math.floor(selectedRecord.housingCost).toLocaleString()} 万円</span></div>
                                    {selectedRecord.expenseDetails?.housing && (
                                        <div className="pr-2 pl-4 py-1 bg-muted/30 rounded-md mb-2 space-y-1 text-xs text-muted-foreground">
                                            {selectedRecord.expenseDetails.housing.rent > 0 && <div className="flex justify-between"><span>家賃</span><span>{Math.floor(selectedRecord.expenseDetails.housing.rent).toLocaleString()} 万円</span></div>}
                                            {selectedRecord.expenseDetails.housing.mortgage > 0 && <div className="flex justify-between"><span>住宅ローン済額</span><span>{Math.floor(selectedRecord.expenseDetails.housing.mortgage).toLocaleString()} 万円</span></div>}
                                            {selectedRecord.expenseDetails.housing.downPayment > 0 && <div className="flex justify-between"><span>住宅購入頭金</span><span>{Math.floor(selectedRecord.expenseDetails.housing.downPayment).toLocaleString()} 万円</span></div>}
                                        </div>
                                    )}

                                    {selectedRecord.educationCost > 0 && (
                                        <>
                                            <div className="flex justify-between"><span>教育・育児関連費</span><span>{Math.floor(selectedRecord.educationCost).toLocaleString()} 万円</span></div>
                                            {selectedRecord.expenseDetails?.education && selectedRecord.expenseDetails.education.length > 0 && (
                                                <div className="pr-2 pl-4 py-1 bg-muted/30 rounded-md mb-2 space-y-1 text-xs text-muted-foreground">
                                                    {selectedRecord.expenseDetails.education.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between">
                                                            <span>{item.label}</span>
                                                            <span>{Math.floor(item.amount).toLocaleString()} 万円</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="flex justify-between"><span>保険料等</span><span>{Math.floor(selectedRecord.insuranceCost).toLocaleString()} 万円</span></div>
                                    {selectedRecord.expenseDetails?.insurance && (
                                        <div className="pr-2 pl-4 py-1 bg-muted/30 rounded-md mb-2 space-y-1 text-xs text-muted-foreground">
                                            {selectedRecord.expenseDetails.insurance.selfTotal > 0 && <div className="flex justify-between"><span>本人 保険料</span><span>{Math.floor(selectedRecord.expenseDetails.insurance.selfTotal).toLocaleString()} 万円</span></div>}
                                            {selectedRecord.expenseDetails.insurance.spouseTotal > 0 && <div className="flex justify-between"><span>配偶者 保険料</span><span>{Math.floor(selectedRecord.expenseDetails.insurance.spouseTotal).toLocaleString()} 万円</span></div>}
                                        </div>
                                    )}

                                    {selectedRecord.carCost > 0 && <div className="flex justify-between"><span>車両関連費</span><span>{Math.floor(selectedRecord.carCost).toLocaleString()} 万円</span></div>}
                                    {selectedRecord.travelCost > 0 && <div className="flex justify-between"><span>レジャー・旅行</span><span>{Math.floor(selectedRecord.travelCost).toLocaleString()} 万円</span></div>}
                                    {selectedRecord.lifeEventCost > 0 && <div className="flex justify-between text-orange-600 font-medium"><span>ライフイベント費</span><span>{Math.floor(selectedRecord.lifeEventCost).toLocaleString()} 万円</span></div>}
                                    <div className="flex justify-between font-bold text-orange-600 pt-2 border-t mt-1"><span>総支出</span><span>{Math.floor(selectedRecord.totalExpense).toLocaleString()} 万円</span></div>
                                </div>
                            </div>

                            {/* 税・社会保険料内訳 */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-muted-foreground flex items-center border-b pb-1">税・社会保険料 内訳</h4>
                                <div className="space-y-1 text-sm">
                                    {selectedRecord.taxDetails && (
                                        <>
                                            <div className="text-xs font-semibold text-muted-foreground/80 mb-1">本人分</div>
                                            <div className="flex justify-between text-muted-foreground text-xs"><span>給与等所得控除</span><span>{Math.floor(selectedRecord.taxDetails.self.salaryDeduction + selectedRecord.taxDetails.self.pensionDeduction).toLocaleString()} 万円</span></div>
                                            <div className="flex justify-between text-muted-foreground text-xs pb-1 border-b mb-1"><span>基礎・各種控除合計</span><span>{Math.floor(selectedRecord.taxDetails.self.totalDeductions).toLocaleString()} 万円</span></div>
                                            <div className="flex justify-between text-muted-foreground text-xs mb-1"><span>(参考) 課税所得額</span><span>{Math.floor(selectedRecord.taxDetails.self.taxableIncome).toLocaleString()} 万円</span></div>

                                            <div className="flex justify-between"><span>所得税</span><span>{Math.floor(selectedRecord.taxDetails.self.incomeTax).toLocaleString()} 万円</span></div>
                                            <div className="flex justify-between"><span>住民税</span><span>{Math.floor(selectedRecord.taxDetails.self.residentTax).toLocaleString()} 万円</span></div>
                                            <div className="flex justify-between mb-2"><span>社会保険料</span><span>{Math.floor(selectedRecord.taxDetails.self.socialInsurance).toLocaleString()} 万円</span></div>

                                            {selectedRecord.taxDetails.spouse && (selectedRecord.taxDetails.spouse.incomeTax > 0 || selectedRecord.taxDetails.spouse.residentTax > 0 || selectedRecord.taxDetails.spouse.socialInsurance > 0 || selectedRecord.taxDetails.spouse.salaryDeduction > 0) && (
                                                <>
                                                    <div className="text-xs font-semibold text-muted-foreground/80 mb-1 mt-3 pt-2 border-t">配偶者分</div>
                                                    <div className="flex justify-between text-muted-foreground text-xs"><span>給与等所得控除</span><span>{Math.floor(selectedRecord.taxDetails.spouse.salaryDeduction + selectedRecord.taxDetails.spouse.pensionDeduction).toLocaleString()} 万円</span></div>
                                                    <div className="flex justify-between text-muted-foreground text-xs pb-1 border-b mb-1"><span>基礎・各種控除合計</span><span>{Math.floor(selectedRecord.taxDetails.spouse.totalDeductions).toLocaleString()} 万円</span></div>
                                                    <div className="flex justify-between text-muted-foreground text-xs mb-1"><span>(参考) 課税所得額</span><span>{Math.floor(selectedRecord.taxDetails.spouse.taxableIncome).toLocaleString()} 万円</span></div>

                                                    <div className="flex justify-between"><span>所得税</span><span>{Math.floor(selectedRecord.taxDetails.spouse.incomeTax).toLocaleString()} 万円</span></div>
                                                    <div className="flex justify-between"><span>住民税</span><span>{Math.floor(selectedRecord.taxDetails.spouse.residentTax).toLocaleString()} 万円</span></div>
                                                    <div className="flex justify-between"><span>社会保険料</span><span>{Math.floor(selectedRecord.taxDetails.spouse.socialInsurance).toLocaleString()} 万円</span></div>
                                                </>
                                            )}

                                            <div className="flex justify-between font-bold pt-2 border-t mt-2">
                                                <span>合算計</span>
                                                <span className="text-red-500">-{Math.floor(selectedRecord.incomeTax + selectedRecord.residentTax + selectedRecord.socialInsurance).toLocaleString()} 万円</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* 資産推移 */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-emerald-600 flex items-center border-b pb-1">資産運用・残高</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>当年の年間収支 (投資積立前)</span>
                                        <span className={selectedRecord.balance >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                            {selectedRecord.balance >= 0 ? '+' : ''}{Math.floor(selectedRecord.balance).toLocaleString()} 万円
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground pb-1">
                                        <span>当年積立投資額</span>
                                        <span>-{Math.floor(selectedRecord.annualInvestmentAmount).toLocaleString()} 万円</span>
                                    </div>
                                    <div className="flex justify-between border-t border-dashed pt-1 mb-2">
                                        <span>積立後 収支 (余力)</span>
                                        <span className={(selectedRecord.balance - selectedRecord.annualInvestmentAmount) >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                            {(selectedRecord.balance - selectedRecord.annualInvestmentAmount) >= 0 ? '+' : ''}{Math.floor(selectedRecord.balance - selectedRecord.annualInvestmentAmount).toLocaleString()} 万円
                                        </span>
                                    </div>

                                    <div className="flex justify-between pt-2 mt-1 border-t items-end">
                                        <span>預貯金 残高</span>
                                        <div className="text-right">
                                            <div>{Math.floor(selectedRecord.savingsBalance).toLocaleString()} 万円</div>
                                            <div className="text-xs text-muted-foreground">
                                                (前年比 {(selectedRecord.savingsBalance - selectedRecord.prevSavingsBalance) >= 0 ? '+' : ''}{Math.floor(selectedRecord.savingsBalance - selectedRecord.prevSavingsBalance).toLocaleString()} 万円)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-2 mt-1 border-t items-end">
                                        <span>投資・運用資産 残高</span>
                                        <div className="text-right">
                                            <div>{Math.floor(selectedRecord.investmentBalance).toLocaleString()} 万円</div>
                                            <div className="text-xs text-muted-foreground">
                                                (前年比 {(selectedRecord.investmentBalance - selectedRecord.prevInvestmentBalance) >= 0 ? '+' : ''}{Math.floor(selectedRecord.investmentBalance - selectedRecord.prevInvestmentBalance).toLocaleString()} 万円)
                                            </div>
                                        </div>
                                    </div>
                                    {/* 投資残高増減の内訳 */}
                                    <div className="pr-2 pl-4 py-1 bg-muted/30 rounded-md mt-1 space-y-1 text-xs text-muted-foreground">
                                        <div className="flex justify-between">
                                            <span>当年積立分</span>
                                            <span>+{Math.floor(selectedRecord.annualInvestmentAmount).toLocaleString()} 万円</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>当年運用リターン益</span>
                                            <span className="text-emerald-500">+{Math.floor(selectedRecord.investmentReturn).toLocaleString()} 万円</span>
                                        </div>
                                        {selectedRecord.investmentWithdrawal > 0 && (
                                            <div className="flex justify-between">
                                                <span>当年取り崩し分</span>
                                                <span className="text-red-500">-{Math.floor(selectedRecord.investmentWithdrawal).toLocaleString()} 万円</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between font-bold pt-2 border-t mt-2"><span>総資産額</span><span>{Math.floor(selectedRecord.totalAssets).toLocaleString()} 万円</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <div className="flex justify-center pt-8 border-t">
                <Button onClick={reset} variant="ghost" className="text-muted-foreground hover:text-destructive">
                    すべてのデータをリセットして最初から始める
                </Button>
            </div>
        </div >
    );
}
