'use client';
// 外部環境設定フォーム

import { usePlanStore } from '@/store/plan-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function InputField({ label, unit, value, onChange, step = 0.1, hint }: {
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

export default function EnvironmentForm() {
    const { input, setEnvironment } = usePlanStore();
    const { environment } = input;
    const update = (u: Partial<typeof environment>) => setEnvironment({ ...environment, ...u });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">インフレ率</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        <InputField label="一般" unit="%" value={environment.generalInflation} onChange={v => update({ generalInflation: v })} hint="消費者物価指数ベース" />
                        <InputField label="教育費" unit="%" value={environment.educationInflation} onChange={v => update({ educationInflation: v })} hint="学費の上昇率" />
                        <InputField label="医療費" unit="%" value={environment.medicalInflation} onChange={v => update({ medicalInflation: v })} hint="医療費の上昇率" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">その他の環境パラメータ</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="賃金上昇率" unit="%" value={environment.wageGrowthRate} onChange={v => update({ wageGrowthRate: v })} hint="年間の賃金上昇率" />
                        <InputField label="預金金利" unit="%" value={environment.depositRate} onChange={v => update({ depositRate: v })} step={0.01} hint="普通預金金利" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
