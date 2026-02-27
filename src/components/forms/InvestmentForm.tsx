'use client';
// 投資・運用入力フォーム

import { usePlanStore } from '@/store/plan-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AssetItem, AssetType, WithdrawalMethod } from '@/types/plan';

function InputField({ label, unit, value, onChange, step = 1 }: {
    label: string; unit: string; value: number; onChange: (v: number) => void; step?: number;
}) {
    return (
        <div className="space-y-1">
            <Label className="text-xs">{label} <span className="text-muted-foreground">({unit})</span></Label>
            <Input type="number" step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="h-9" />
        </div>
    );
}

const ASSET_TYPES: AssetType[] = ['預金', '株式', '投資信託', '債券', 'NISA', 'iDeCo', 'その他'];

export default function InvestmentForm() {
    const { input, setInvestment } = usePlanStore();
    const { investment } = input;
    const update = (u: Partial<typeof investment>) => setInvestment({ ...investment, ...u });

    const addAsset = (type: AssetType) => {
        const item: AssetItem = { type, balance: 0 };
        update({ assets: [...investment.assets, item] });
    };

    const removeAsset = (index: number) => {
        update({ assets: investment.assets.filter((_, i) => i !== index) });
    };

    const updateAsset = (index: number, u: Partial<AssetItem>) => {
        update({ assets: investment.assets.map((a, i) => i === index ? { ...a, ...u } : a) });
    };

    const alloc = investment.allocation;
    const updateAlloc = (u: Partial<typeof alloc>) => update({ allocation: { ...alloc, ...u } });

    return (
        <div className="space-y-6">
            {/* 金融資産内訳 */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                        金融資産内訳
                        <div className="flex gap-1">
                            {ASSET_TYPES.filter(t => !investment.assets.find(a => a.type === t)).map(t => (
                                <Button key={t} size="sm" variant="outline" className="text-xs h-7" onClick={() => addAsset(t)}>＋{t}</Button>
                            ))}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {investment.assets.map((asset, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-sm font-medium min-w-[5rem]">{asset.type}</span>
                            <Input type="number" value={asset.balance} onChange={e => updateAsset(i, { balance: Number(e.target.value) })} className="h-8" />
                            <span className="text-xs text-muted-foreground">万円</span>
                            <Button variant="ghost" size="sm" className="h-8 text-destructive" onClick={() => removeAsset(i)}>×</Button>
                        </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-1">
                        合計: {investment.assets.reduce((s, a) => s + a.balance, 0).toLocaleString()}万円
                    </p>
                </CardContent>
            </Card>

            {/* アセットアロケーション */}
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">アセットアロケーション</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Label className="text-xs font-medium">配分比率（合計100%）</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <InputField label="株式" unit="%" value={alloc.stockRatio} onChange={v => updateAlloc({ stockRatio: v })} />
                            <InputField label="債券" unit="%" value={alloc.bondRatio} onChange={v => updateAlloc({ bondRatio: v })} />
                            <InputField label="現金" unit="%" value={alloc.cashRatio} onChange={v => updateAlloc({ cashRatio: v })} />
                        </div>
                        {(alloc.stockRatio + alloc.bondRatio + alloc.cashRatio) !== 100 && (
                            <p className="text-xs text-destructive">⚠ 合計が{alloc.stockRatio + alloc.bondRatio + alloc.cashRatio}%です（100%にしてください）</p>
                        )}
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-medium">想定リターン・リスク</Label>
                        <div className="grid grid-cols-3 gap-3">
                            <InputField label="株式リターン" unit="%" value={alloc.stockReturn} onChange={v => updateAlloc({ stockReturn: v })} step={0.1} />
                            <InputField label="債券リターン" unit="%" value={alloc.bondReturn} onChange={v => updateAlloc({ bondReturn: v })} step={0.1} />
                            <InputField label="現金リターン" unit="%" value={alloc.cashReturn} onChange={v => updateAlloc({ cashReturn: v })} step={0.01} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField label="株式 標準偏差" unit="%" value={alloc.stockStdDev} onChange={v => updateAlloc({ stockStdDev: v })} step={0.1} />
                            <InputField label="債券 標準偏差" unit="%" value={alloc.bondStdDev} onChange={v => updateAlloc({ bondStdDev: v })} step={0.1} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 積立・取り崩し */}
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">積立・取り崩し設定</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="毎月の積立額" unit="万円" value={investment.monthlyInvestment} onChange={v => update({ monthlyInvestment: v })} step={0.1} />
                        <InputField label="NISA年間活用額" unit="万円" value={investment.nisaAnnual} onChange={v => update({ nisaAnnual: v })} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <InputField label="取り崩し開始" unit="歳" value={investment.withdrawalStartAge} onChange={v => update({ withdrawalStartAge: v })} />
                        <div className="space-y-1">
                            <Label className="text-xs">取り崩し方法</Label>
                            <Button size="sm" variant="outline" className="w-full h-9"
                                onClick={() => {
                                    const next: WithdrawalMethod = investment.withdrawalMethod === '定額' ? '定率' : '定額';
                                    update({ withdrawalMethod: next });
                                }}>
                                {investment.withdrawalMethod}
                            </Button>
                        </div>
                        {investment.withdrawalMethod === '定額' ? (
                            <InputField label="年額" unit="万円" value={investment.withdrawalAmount} onChange={v => update({ withdrawalAmount: v })} />
                        ) : (
                            <InputField label="取り崩し率" unit="%" value={investment.withdrawalRate} onChange={v => update({ withdrawalRate: v })} step={0.1} />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
