import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormTooltip } from '@/components/ui/form-tooltip';
import { usePlanStore } from '@/stores/plan-store';
import type { SalaryGrowthCurve, WorkPattern, IncomeInfo } from '@/types/plan';

export function IncomeForm() {
    const { input, updateIncome } = usePlanStore();
    const { income } = input;
    const { hasSpouse } = input.basicInfo;

    return (
        <div className="space-y-6">
            {/* 給与収入 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">給与収入</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasSpouse ? (
                        <Tabs defaultValue="self" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="self">本人</TabsTrigger>
                                <TabsTrigger value="spouse">配偶者</TabsTrigger>
                            </TabsList>
                            <TabsContent value="self" className="animate-in fade-in">
                                <IncomeFields person="self" income={income} updateIncome={updateIncome} />
                            </TabsContent>
                            <TabsContent value="spouse" className="animate-in fade-in">
                                <IncomeFields person="spouse" income={income} updateIncome={updateIncome} />
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <div className="mt-2">
                            <IncomeFields person="self" income={income} updateIncome={updateIncome} />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 副業・その他 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">副業・その他の収入</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasSpouse ? (
                        <Tabs defaultValue="self" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="self">本人</TabsTrigger>
                                <TabsTrigger value="spouse">配偶者</TabsTrigger>
                            </TabsList>
                            <TabsContent value="self" className="animate-in fade-in">
                                <div className="space-y-2">
                                    <Label>副業収入 <FormTooltip text="副業やフリーランス活動による年間収入です。" /></Label>
                                    <div className="flex items-center gap-3">
                                        <Input type="number" min={0} max={5000} value={income.sideJobIncome} onChange={(e) => updateIncome({ sideJobIncome: Number(e.target.value) })} className="w-28" />
                                        <span className="text-sm text-muted-foreground">万円/年</span>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="spouse" className="animate-in fade-in">
                                <div className="space-y-2">
                                    <Label>副業収入 <FormTooltip text="配偶者の副業やフリーランス活動による年間収入です。" /></Label>
                                    <div className="flex items-center gap-3">
                                        <Input type="number" min={0} max={5000} value={income.spouseSideJobIncome} onChange={(e) => updateIncome({ spouseSideJobIncome: Number(e.target.value) })} className="w-28" />
                                        <span className="text-sm text-muted-foreground">万円/年</span>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <div className="space-y-2">
                            <Label>副業収入 <FormTooltip text="副業やフリーランス活動による年間収入です。" /></Label>
                            <div className="flex items-center gap-3">
                                <Input type="number" min={0} max={5000} value={income.sideJobIncome} onChange={(e) => updateIncome({ sideJobIncome: Number(e.target.value) })} className="w-28" />
                                <span className="text-sm text-muted-foreground">万円/年</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 退職金 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">退職金</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasSpouse ? (
                        <Tabs defaultValue="self" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="self">本人</TabsTrigger>
                                <TabsTrigger value="spouse">配偶者</TabsTrigger>
                            </TabsList>
                            <TabsContent value="self" className="animate-in fade-in">
                                <div className="space-y-2">
                                    <Label>退職金の見込み額 <FormTooltip text="会社から支給される退職金の見込み額です。大企業の平均は約2,000万円、中小企業は約1,000万円です。" /></Label>
                                    <div className="flex items-center gap-3">
                                        <Input type="number" min={0} max={10000} value={income.retirementBonus} onChange={(e) => updateIncome({ retirementBonus: Number(e.target.value) })} className="w-32" />
                                        <span className="text-sm text-muted-foreground">万円</span>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="spouse" className="animate-in fade-in">
                                <div className="space-y-2">
                                    <Label>退職金の見込み額 <FormTooltip text="配偶者の退職金の見込み額です。" /></Label>
                                    <div className="flex items-center gap-3">
                                        <Input type="number" min={0} max={10000} value={income.spouseRetirementBonus} onChange={(e) => updateIncome({ spouseRetirementBonus: Number(e.target.value) })} className="w-32" />
                                        <span className="text-sm text-muted-foreground">万円</span>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <div className="space-y-2">
                            <Label>退職金の見込み額 <FormTooltip text="会社から支給される退職金の見込み額です。大企業の平均は約2,000万円、中小企業は約1,000万円です。" /></Label>
                            <div className="flex items-center gap-3">
                                <Input type="number" min={0} max={10000} value={income.retirementBonus} onChange={(e) => updateIncome({ retirementBonus: Number(e.target.value) })} className="w-32" />
                                <span className="text-sm text-muted-foreground">万円</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 年金 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">公的年金</CardTitle>
                </CardHeader>
                <CardContent>
                    {hasSpouse ? (
                        <Tabs defaultValue="self" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="self">本人</TabsTrigger>
                                <TabsTrigger value="spouse">配偶者</TabsTrigger>
                            </TabsList>
                            <TabsContent value="self" className="animate-in fade-in">
                                <PensionFields person="self" income={income} updateIncome={updateIncome} />
                            </TabsContent>
                            <TabsContent value="spouse" className="animate-in fade-in">
                                <PensionFields person="spouse" income={income} updateIncome={updateIncome} />
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <div className="mt-2">
                            <PensionFields person="self" income={income} updateIncome={updateIncome} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function IncomeFields({ person, income, updateIncome }: { person: 'self' | 'spouse', income: IncomeInfo, updateIncome: (data: Partial<IncomeInfo>) => void }) {
    const isSelf = person === 'self';
    const labelPrefix = isSelf ? 'ご本人' : '配偶者';

    const workPatternKey = isSelf ? 'selfWorkPattern' : 'spouseWorkPattern';
    const annualIncomeKey = isSelf ? 'annualIncome' : 'spouseAnnualIncome';
    const growthRateKey = isSelf ? 'salaryGrowthRate' : 'spouseSalaryGrowthRate';
    const growthCurveKey = isSelf ? 'salaryGrowthCurve' : 'spouseSalaryGrowthCurve';
    const retirementAgeKey = isSelf ? 'retirementAge' : 'spouseRetirementAge';
    const reemploymentKey = isSelf ? 'reemployment' : 'spouseReemployment';
    const leaveReturnAgeKey = isSelf ? 'selfLeaveReturnAge' : 'spouseLeaveReturnAge';

    const workPattern = income[workPatternKey] as WorkPattern;
    const annualIncomeVal = income[annualIncomeKey] as number;
    const growthRateVal = income[growthRateKey] as number;
    const growthCurveVal = income[growthCurveKey] as SalaryGrowthCurve;
    const retirementAgeVal = income[retirementAgeKey] as number;
    const reemploymentVal = income[reemploymentKey];
    const leaveReturnAgeVal = income[leaveReturnAgeKey] as number;

    return (
        <div className="space-y-8">
            <div className="space-y-6 border-b pb-6">
                <div className="space-y-2">
                    <Label>
                        就労パターン
                        <FormTooltip text={`${labelPrefix}の現在の就労形態を選択してください。`} />
                    </Label>
                    <Select
                        value={workPattern}
                        onValueChange={(value: WorkPattern) => updateIncome({ [workPatternKey]: value })}
                    >
                        <SelectTrigger className="w-52">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fulltime">フルタイム</SelectItem>
                            <SelectItem value="parttime">パート</SelectItem>
                            <SelectItem value="homemaker">専業主夫(婦)</SelectItem>
                            <SelectItem value="leave_return">一時休職→復職</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {workPattern === 'leave_return' && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                        <Label>
                            復職開始年齢
                            <FormTooltip text="休職期間を経て復職する年齢を入力してください。この年齢から給与収入が発生します。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                min={20}
                                max={65}
                                value={leaveReturnAgeVal}
                                onChange={(e) => updateIncome({ [leaveReturnAgeKey]: Number(e.target.value) })}
                                className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">歳</span>
                        </div>
                    </div>
                )}

                {workPattern !== 'homemaker' && (
                    <>
                        <div className="space-y-2">
                            <Label>
                                現在の額面年収: {annualIncomeVal}万円
                                <FormTooltip text="税引き前の年間総支給額（ボーナス含む）を入力してください。手取りではなく額面です。" />
                            </Label>
                            <Slider
                                min={0}
                                max={3000}
                                step={10}
                                value={[annualIncomeVal]}
                                onValueChange={([value]) => updateIncome({ [annualIncomeKey]: value })}
                            />
                            <div className="flex items-center gap-3 mt-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={10000}
                                    value={annualIncomeVal}
                                    onChange={(e) => updateIncome({ [annualIncomeKey]: Number(e.target.value) })}
                                    className="w-28"
                                />
                                <span className="text-sm text-muted-foreground">万円</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>
                                昇給率: {growthRateVal}%
                                <FormTooltip text="毎年の昇給率（年率）です。日本企業の平均は約1.5%〜2%です。" />
                            </Label>
                            <Slider
                                min={0}
                                max={5}
                                step={0.1}
                                value={[growthRateVal]}
                                onValueChange={([value]) => updateIncome({ [growthRateKey]: value })}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0%</span>
                                <span>5%</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>
                                昇給カーブ
                                <FormTooltip text="年功型: 勤続年数に応じて安定的に上昇。成果型: 若い頃に早く上がり後半は緩やか。フラット: 一定の昇給率。" />
                            </Label>
                            <Select
                                value={growthCurveVal}
                                onValueChange={(value: SalaryGrowthCurve) =>
                                    updateIncome({ [growthCurveKey]: value })
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="seniority">年功型</SelectItem>
                                    <SelectItem value="performance">成果型</SelectItem>
                                    <SelectItem value="flat">フラット</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>
                                退職予定年齢
                                <FormTooltip text="定年退職する予定の年齢です。通常は60歳または65歳です。" />
                            </Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    min={50}
                                    max={75}
                                    value={retirementAgeVal}
                                    onChange={(e) => updateIncome({ [retirementAgeKey]: Number(e.target.value) })}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">歳</span>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {workPattern !== 'homemaker' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-base">再雇用・継続雇用</Label>
                            <p className="text-xs text-muted-foreground mt-1">定年後の再雇用制度の利用</p>
                        </div>
                        <Switch
                            checked={reemploymentVal.enabled}
                            onCheckedChange={(checked) =>
                                updateIncome({
                                    [reemploymentKey]: { ...reemploymentVal, enabled: checked },
                                })
                            }
                        />
                    </div>

                    {reemploymentVal.enabled && (
                        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                            <div className="space-y-2">
                                <Label>再雇用時の年収</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        min={0}
                                        max={2000}
                                        value={reemploymentVal.annualIncome}
                                        onChange={(e) =>
                                            updateIncome({
                                                [reemploymentKey]: { ...reemploymentVal, annualIncome: Number(e.target.value) },
                                            })
                                        }
                                        className="w-28"
                                    />
                                    <span className="text-sm text-muted-foreground">万円</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>再雇用の終了年齢 (何歳まで働くか)</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        min={retirementAgeVal}
                                        max={85}
                                        value={reemploymentVal.endAge}
                                        onChange={(e) =>
                                            updateIncome({
                                                [reemploymentKey]: { ...reemploymentVal, endAge: Number(e.target.value) },
                                            })
                                        }
                                        className="w-24"
                                    />
                                    <span className="text-sm text-muted-foreground">歳</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function PensionFields({ person, income, updateIncome }: { person: 'self' | 'spouse', income: IncomeInfo, updateIncome: (data: Partial<IncomeInfo>) => void }) {
    const isSelf = person === 'self';
    const pensionKey = isSelf ? 'selfPension' : 'spousePension';
    const pensionVal = income[pensionKey];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>
                    受給開始年齢: {pensionVal.startAge}歳
                    {isSelf && <FormTooltip text="通常は65歳ですが、60歳〜75歳の間で選択できます。" />}
                </Label>
                <Slider
                    min={60}
                    max={75}
                    step={1}
                    value={[pensionVal.startAge]}
                    onValueChange={([value]) =>
                        updateIncome({
                            [pensionKey]: { ...pensionVal, startAge: value },
                        })
                    }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>60歳</span>
                    <span>65歳</span>
                    <span>75歳</span>
                </div>
            </div>

            <div className="space-y-2">
                <Label>
                    年金見込み額
                    {isSelf && <FormTooltip text="「ねんきんネット」で確認できる見込み額を入力してください。0の場合は自動概算します。" />}
                </Label>
                <div className="flex items-center gap-3">
                    <Input
                        type="number"
                        min={0}
                        max={500}
                        value={pensionVal.annualAmount}
                        onChange={(e) =>
                            updateIncome({
                                [pensionKey]: { ...pensionVal, annualAmount: Number(e.target.value) },
                            })
                        }
                        className="w-28"
                    />
                    <span className="text-sm text-muted-foreground">万円/年</span>
                </div>
                <p className="text-xs text-muted-foreground">
                    ※ 0の場合は加入期間と平均年収から自動概算します
                </p>
            </div>
        </div>
    );
}
