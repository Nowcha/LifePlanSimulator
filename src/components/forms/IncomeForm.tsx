'use client';
// 収入入力フォーム

import { usePlanStore } from '@/store/plan-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { EmploymentIncome, PensionSystem } from '@/types/plan';

function InputField({ label, unit, value, onChange, step = 1, hint }: {
    label: string; unit: string; value: number; onChange: (v: number) => void; step?: number; hint?: string;
}) {
    return (
        <div className="space-y-1">
            <Label className="text-xs">{label} <span className="text-muted-foreground">({unit})</span></Label>
            <Input type="number" step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="h-9" />
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

function EmploymentSection({ title, data, onChange }: {
    title: string; data: EmploymentIncome; onChange: (d: EmploymentIncome) => void;
}) {
    const upd = (u: Partial<EmploymentIncome>) => onChange({ ...data, ...u });
    return (
        <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <InputField label="年収（税込）" unit="万円" value={data.annualIncome} onChange={v => upd({ annualIncome: v })} />
                    <InputField label="昇給率" unit="%" value={data.raiseRate} onChange={v => upd({ raiseRate: v })} step={0.1} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <InputField label="賞与月数" unit="ヶ月" value={data.bonusMonths} onChange={v => upd({ bonusMonths: v })} step={0.5} />
                    <InputField label="退職金" unit="万円" value={data.severancePay} onChange={v => upd({ severancePay: v })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    <InputField label="定年" unit="歳" value={data.retirementAge} onChange={v => upd({ retirementAge: v })} />
                    <InputField label="再雇用収入" unit="万円" value={data.reemploymentIncome} onChange={v => upd({ reemploymentIncome: v })} />
                    <InputField label="再雇用終了" unit="歳" value={data.reemploymentEndAge} onChange={v => upd({ reemploymentEndAge: v })} />
                </div>
            </CardContent>
        </Card>
    );
}

const PENSION_SYSTEMS: PensionSystem[] = ['厚生年金', '国民年金', '共済年金'];

export default function IncomeForm() {
    const { input, setIncome } = usePlanStore();
    const { income } = input;
    const update = (u: Partial<typeof income>) => setIncome({ ...income, ...u });

    return (
        <div className="space-y-6">
            <EmploymentSection title="本人の勤労収入" data={income.employment}
                onChange={e => update({ employment: e })} />

            {input.basic.hasSpouse && (
                <EmploymentSection title="配偶者の勤労収入" data={income.spouseEmployment}
                    onChange={e => update({ spouseEmployment: e })} />
            )}

            {/* 年金 */}
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">年金</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <Label className="text-xs font-medium">本人</Label>
                        <div className="flex gap-2 mb-2">
                            {PENSION_SYSTEMS.map(s => (
                                <Button key={s} size="sm" variant={income.pension.system === s ? 'default' : 'outline'}
                                    onClick={() => update({ pension: { ...income.pension, system: s } })}>{s}</Button>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField label="受給開始" unit="歳" value={income.pension.startAge}
                                onChange={v => update({ pension: { ...income.pension, startAge: v } })} />
                            <InputField label="月額見込" unit="万円" value={income.pension.monthlyAmount}
                                onChange={v => update({ pension: { ...income.pension, monthlyAmount: v } })} step={0.1} />
                        </div>
                    </div>
                    {input.basic.hasSpouse && (
                        <div className="space-y-3 pt-3 border-t">
                            <Label className="text-xs font-medium">配偶者</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <InputField label="受給開始" unit="歳" value={income.spousePension.startAge}
                                    onChange={v => update({ spousePension: { ...income.spousePension, startAge: v } })} />
                                <InputField label="月額見込" unit="万円" value={income.spousePension.monthlyAmount}
                                    onChange={v => update({ spousePension: { ...income.spousePension, monthlyAmount: v } })} step={0.1} />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 企業年金/iDeCo */}
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">企業年金 / iDeCo</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                        <InputField label="残高" unit="万円" value={income.corporatePension.balance}
                            onChange={v => update({ corporatePension: { ...income.corporatePension, balance: v } })} />
                        <InputField label="月額拠出" unit="万円" value={income.corporatePension.monthlyContribution}
                            onChange={v => update({ corporatePension: { ...income.corporatePension, monthlyContribution: v } })} step={0.1} />
                        <InputField label="想定利回り" unit="%" value={income.corporatePension.expectedReturn}
                            onChange={v => update({ corporatePension: { ...income.corporatePension, expectedReturn: v } })} step={0.1} />
                    </div>
                </CardContent>
            </Card>

            {/* その他の収入 */}
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">その他の収入</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="不動産収入" unit="万円/年" value={income.otherIncome.realEstateIncome}
                            onChange={v => update({ otherIncome: { ...income.otherIncome, realEstateIncome: v } })} />
                        <InputField label="配当収入" unit="万円/年" value={income.otherIncome.dividendIncome}
                            onChange={v => update({ otherIncome: { ...income.otherIncome, dividendIncome: v } })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <InputField label="相続見込年齢" unit="歳" value={income.otherIncome.inheritance.expectedAge}
                            onChange={v => update({ otherIncome: { ...income.otherIncome, inheritance: { ...income.otherIncome.inheritance, expectedAge: v } } })} />
                        <InputField label="相続見込額" unit="万円" value={income.otherIncome.inheritance.amount}
                            onChange={v => update({ otherIncome: { ...income.otherIncome, inheritance: { ...income.otherIncome.inheritance, amount: v } } })} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
