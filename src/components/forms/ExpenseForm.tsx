'use client';
// 支出入力フォーム

import { usePlanStore } from '@/store/plan-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LifeEvent, LivingExpense, RepaymentMethod } from '@/types/plan';

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

const PRESETS = [
    { name: '住宅購入', cost: 4000 },
    { name: '車購入', cost: 300 },
    { name: '結婚', cost: 350 },
    { name: 'リフォーム', cost: 500 },
    { name: '海外旅行', cost: 50 },
];

export default function ExpenseForm() {
    const { input, setExpense } = usePlanStore();
    const { expense } = input;
    const update = (u: Partial<typeof expense>) => setExpense({ ...expense, ...u });
    const updateLiving = (u: Partial<LivingExpense>) => update({ living: { ...expense.living, ...u } });

    const addEvent = (name: string, cost: number) => {
        const ev: LifeEvent = { id: Date.now().toString(), name, age: input.basic.birthYear ? 2025 - input.basic.birthYear + 5 : 35, cost };
        update({ lifeEvents: [...expense.lifeEvents, ev] });
    };

    const removeEvent = (id: string) => {
        update({ lifeEvents: expense.lifeEvents.filter(e => e.id !== id) });
    };

    const updateEvent = (id: string, u: Partial<LifeEvent>) => {
        update({ lifeEvents: expense.lifeEvents.map(e => e.id === id ? { ...e, ...u } : e) });
    };

    return (
        <div className="space-y-6">
            {/* 基本生活費 */}
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">基本生活費（月額）</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <InputField label="食費" unit="万円" value={expense.living.food} onChange={v => updateLiving({ food: v })} step={0.5} />
                        <InputField label="光熱費" unit="万円" value={expense.living.utilities} onChange={v => updateLiving({ utilities: v })} step={0.1} />
                        <InputField label="通信費" unit="万円" value={expense.living.communication} onChange={v => updateLiving({ communication: v })} step={0.1} />
                        <InputField label="日用品" unit="万円" value={expense.living.dailyGoods} onChange={v => updateLiving({ dailyGoods: v })} step={0.1} />
                        <InputField label="被服費" unit="万円" value={expense.living.clothing} onChange={v => updateLiving({ clothing: v })} step={0.1} />
                        <InputField label="交際費" unit="万円" value={expense.living.social} onChange={v => updateLiving({ social: v })} step={0.1} />
                        <InputField label="交通費" unit="万円" value={expense.living.transportation} onChange={v => updateLiving({ transportation: v })} step={0.1} />
                        <InputField label="雑費" unit="万円" value={expense.living.miscellaneous} onChange={v => updateLiving({ miscellaneous: v })} step={0.1} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        月額合計: {(expense.living.food + expense.living.utilities + expense.living.communication +
                            expense.living.dailyGoods + expense.living.clothing + expense.living.social +
                            expense.living.transportation + expense.living.miscellaneous).toFixed(1)}万円
                    </p>
                </CardContent>
            </Card>

            {/* 住居 */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                        住居
                        <Button size="sm" variant={expense.housing.isOwner ? 'default' : 'outline'}
                            onClick={() => update({ housing: { ...expense.housing, isOwner: !expense.housing.isOwner } })}>
                            {expense.housing.isOwner ? '持家' : '賃貸'}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {expense.housing.isOwner ? (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <InputField label="借入額" unit="万円" value={expense.housing.mortgage.principal}
                                    onChange={v => update({ housing: { ...expense.housing, mortgage: { ...expense.housing.mortgage, principal: v } } })} />
                                <InputField label="金利" unit="%" value={expense.housing.mortgage.interestRate} step={0.01}
                                    onChange={v => update({ housing: { ...expense.housing, mortgage: { ...expense.housing.mortgage, interestRate: v } } })} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <InputField label="期間" unit="年" value={expense.housing.mortgage.termYears}
                                    onChange={v => update({ housing: { ...expense.housing, mortgage: { ...expense.housing.mortgage, termYears: v } } })} />
                                <InputField label="借入開始" unit="歳" value={expense.housing.mortgage.startAge}
                                    onChange={v => update({ housing: { ...expense.housing, mortgage: { ...expense.housing.mortgage, startAge: v } } })} />
                                <div className="space-y-1">
                                    <Label className="text-xs">返済方式</Label>
                                    <Button size="sm" variant="outline" className="w-full h-9"
                                        onClick={() => {
                                            const next: RepaymentMethod = expense.housing.mortgage.method === '元利均等' ? '元金均等' : '元利均等';
                                            update({ housing: { ...expense.housing, mortgage: { ...expense.housing.mortgage, method: next } } });
                                        }}>
                                        {expense.housing.mortgage.method}
                                    </Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <InputField label="管理費" unit="万円/月" value={expense.housing.managementFee} step={0.1}
                                    onChange={v => update({ housing: { ...expense.housing, managementFee: v } })} />
                                <InputField label="固定資産税" unit="万円/年" value={expense.housing.propertyTax}
                                    onChange={v => update({ housing: { ...expense.housing, propertyTax: v } })} />
                            </div>
                        </>
                    ) : (
                        <InputField label="家賃" unit="万円/月" value={expense.housing.monthlyRent}
                            onChange={v => update({ housing: { ...expense.housing, monthlyRent: v } })} step={0.5} />
                    )}
                </CardContent>
            </Card>

            {/* 保険 */}
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">保険料（月額）</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                        <InputField label="生命保険" unit="万円" value={expense.insurance.lifeInsurance} step={0.1}
                            onChange={v => update({ insurance: { ...expense.insurance, lifeInsurance: v } })} />
                        <InputField label="医療保険" unit="万円" value={expense.insurance.medicalInsurance} step={0.1}
                            onChange={v => update({ insurance: { ...expense.insurance, medicalInsurance: v } })} />
                        <InputField label="自動車保険" unit="万円" value={expense.insurance.carInsurance} step={0.1}
                            onChange={v => update({ insurance: { ...expense.insurance, carInsurance: v } })} />
                    </div>
                </CardContent>
            </Card>

            {/* 自動車 */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                        自動車
                        <Button size="sm" variant={expense.car.hasCar ? 'default' : 'outline'}
                            onClick={() => update({ car: { ...expense.car, hasCar: !expense.car.hasCar } })}>
                            {expense.car.hasCar ? '保有' : 'なし'}
                        </Button>
                    </CardTitle>
                </CardHeader>
                {expense.car.hasCar && (
                    <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                            <InputField label="購入サイクル" unit="年" value={expense.car.purchaseCycleYears}
                                onChange={v => update({ car: { ...expense.car, purchaseCycleYears: v } })} />
                            <InputField label="購入費用" unit="万円" value={expense.car.purchaseCost}
                                onChange={v => update({ car: { ...expense.car, purchaseCost: v } })} />
                            <InputField label="年間維持費" unit="万円" value={expense.car.annualMaintenance}
                                onChange={v => update({ car: { ...expense.car, annualMaintenance: v } })} />
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* ライフイベント */}
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">ライフイベント</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {PRESETS.map(p => (
                            <Button key={p.name} size="sm" variant="outline" onClick={() => addEvent(p.name, p.cost)}>＋ {p.name}</Button>
                        ))}
                    </div>
                    {expense.lifeEvents.map(ev => (
                        <div key={ev.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                            <Input value={ev.name} onChange={e => updateEvent(ev.id, { name: e.target.value })} className="h-8 flex-1" />
                            <Input type="number" value={ev.age} onChange={e => updateEvent(ev.id, { age: Number(e.target.value) })} className="h-8 w-16" />
                            <span className="text-xs text-muted-foreground">歳</span>
                            <Input type="number" value={ev.cost} onChange={e => updateEvent(ev.id, { cost: Number(e.target.value) })} className="h-8 w-24" />
                            <span className="text-xs text-muted-foreground">万円</span>
                            <Button variant="ghost" size="sm" className="h-8 text-destructive" onClick={() => removeEvent(ev.id)}>×</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
