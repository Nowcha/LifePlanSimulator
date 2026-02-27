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
import { FormTooltip } from '@/components/ui/form-tooltip';
import { usePlanStore } from '@/stores/plan-store';
import type { SalaryGrowthCurve, SpouseWorkPattern } from '@/types/plan';

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
                <CardContent className="space-y-6">
                    {/* 額面年収 */}
                    <div className="space-y-2">
                        <Label htmlFor="annualIncome">
                            現在の額面年収: {income.annualIncome}万円
                            <FormTooltip text="税引き前の年間総支給額（ボーナス含む）を入力してください。手取りではなく額面です。" />
                        </Label>
                        <Slider
                            id="annualIncome"
                            min={100}
                            max={3000}
                            step={10}
                            value={[income.annualIncome]}
                            onValueChange={([value]) => updateIncome({ annualIncome: value })}
                        />
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                min={100}
                                max={10000}
                                value={income.annualIncome}
                                onChange={(e) => updateIncome({ annualIncome: Number(e.target.value) })}
                                className="w-28"
                            />
                            <span className="text-sm text-muted-foreground">万円</span>
                        </div>
                    </div>

                    {/* 昇給率 */}
                    <div className="space-y-2">
                        <Label htmlFor="salaryGrowthRate">
                            昇給率: {income.salaryGrowthRate}%
                            <FormTooltip text="毎年の昇給率（年率）です。日本企業の平均は約1.5%〜2%です。" />
                        </Label>
                        <Slider
                            id="salaryGrowthRate"
                            min={0}
                            max={5}
                            step={0.1}
                            value={[income.salaryGrowthRate]}
                            onValueChange={([value]) => updateIncome({ salaryGrowthRate: value })}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>5%</span>
                        </div>
                    </div>

                    {/* 昇給カーブ */}
                    <div className="space-y-2">
                        <Label htmlFor="salaryGrowthCurve">
                            昇給カーブ
                            <FormTooltip text="年功型: 勤続年数に応じて安定的に上昇。成果型: 若い頃に早く上がり後半は緩やか。フラット: 一定の昇給率。" />
                        </Label>
                        <Select
                            value={income.salaryGrowthCurve}
                            onValueChange={(value: SalaryGrowthCurve) =>
                                updateIncome({ salaryGrowthCurve: value })
                            }
                        >
                            <SelectTrigger className="w-40" id="salaryGrowthCurve">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="seniority">年功型</SelectItem>
                                <SelectItem value="performance">成果型</SelectItem>
                                <SelectItem value="flat">フラット</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 退職予定年齢 */}
                    <div className="space-y-2">
                        <Label htmlFor="retirementAge">
                            退職予定年齢
                            <FormTooltip text="定年退職する予定の年齢です。通常は60歳または65歳です。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="retirementAge"
                                type="number"
                                min={50}
                                max={75}
                                value={income.retirementAge}
                                onChange={(e) => updateIncome({ retirementAge: Number(e.target.value) })}
                                className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">歳</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 再雇用 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">再雇用・継続雇用</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="reemployment">
                            再雇用制度の利用
                            <FormTooltip text="60〜65歳の間に再雇用として働く場合に設定します。通常、定年前の50〜70%程度の年収になります。" />
                        </Label>
                        <Switch
                            id="reemployment"
                            checked={income.reemployment.enabled}
                            onCheckedChange={(checked) =>
                                updateIncome({
                                    reemployment: { ...income.reemployment, enabled: checked },
                                })
                            }
                        />
                    </div>

                    {income.reemployment.enabled && (
                        <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                            <Label htmlFor="reemploymentIncome">再雇用時の年収</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    id="reemploymentIncome"
                                    type="number"
                                    min={0}
                                    max={2000}
                                    value={income.reemployment.annualIncome}
                                    onChange={(e) =>
                                        updateIncome({
                                            reemployment: {
                                                ...income.reemployment,
                                                annualIncome: Number(e.target.value),
                                            },
                                        })
                                    }
                                    className="w-28"
                                />
                                <span className="text-sm text-muted-foreground">万円</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 配偶者の収入 */}
            {hasSpouse && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">配偶者の収入</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="spouseWorkPattern">
                                就労パターン
                                <FormTooltip text="配偶者の現在の就労形態を選択してください。" />
                            </Label>
                            <Select
                                value={income.spouseWorkPattern}
                                onValueChange={(value: SpouseWorkPattern) =>
                                    updateIncome({ spouseWorkPattern: value })
                                }
                            >
                                <SelectTrigger className="w-52" id="spouseWorkPattern">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fulltime">フルタイム</SelectItem>
                                    <SelectItem value="parttime">パート</SelectItem>
                                    <SelectItem value="homemaker">専業主婦(夫)</SelectItem>
                                    <SelectItem value="leave_return">一時休職→復職</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {income.spouseWorkPattern !== 'homemaker' && (
                            <div className="space-y-2">
                                <Label htmlFor="spouseIncome">
                                    配偶者の年収
                                    <FormTooltip text="配偶者の額面年収です。パートの場合も年間合計を入力してください。" />
                                </Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="spouseIncome"
                                        type="number"
                                        min={0}
                                        max={5000}
                                        value={income.spouseAnnualIncome}
                                        onChange={(e) =>
                                            updateIncome({ spouseAnnualIncome: Number(e.target.value) })
                                        }
                                        className="w-28"
                                    />
                                    <span className="text-sm text-muted-foreground">万円</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* 副業・その他 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">副業・その他の収入</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="sideJobIncome">
                            副業収入
                            <FormTooltip text="副業やフリーランス活動による年間収入です。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="sideJobIncome"
                                type="number"
                                min={0}
                                max={5000}
                                value={income.sideJobIncome}
                                onChange={(e) => updateIncome({ sideJobIncome: Number(e.target.value) })}
                                className="w-28"
                            />
                            <span className="text-sm text-muted-foreground">万円/年</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 退職金 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">退職金</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="retirementBonus">
                            退職金の見込み額
                            <FormTooltip text="会社から支給される退職金の見込み額です。大企業の平均は約2,000万円、中小企業は約1,000万円です。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="retirementBonus"
                                type="number"
                                min={0}
                                max={10000}
                                value={income.retirementBonus}
                                onChange={(e) => updateIncome({ retirementBonus: Number(e.target.value) })}
                                className="w-32"
                            />
                            <span className="text-sm text-muted-foreground">万円</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 年金 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">年金</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="pensionStartAge">
                            年金受給開始年齢: {income.pension.startAge}歳
                            <FormTooltip text="年金の受給開始年齢です。65歳が標準ですが、60歳から繰上げ受給（減額）、75歳まで繰下げ受給（増額）が可能です。" />
                        </Label>
                        <Slider
                            id="pensionStartAge"
                            min={60}
                            max={75}
                            step={1}
                            value={[income.pension.startAge]}
                            onValueChange={([value]) =>
                                updateIncome({
                                    pension: { ...income.pension, startAge: value },
                                })
                            }
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>60歳（繰上げ）</span>
                            <span>65歳</span>
                            <span>75歳（繰下げ）</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pensionAmount">
                            年金見込み額
                            <FormTooltip text="「ねんきんネット」で確認できる見込み額を入力してください。0の場合は加入期間と年収から概算します。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="pensionAmount"
                                type="number"
                                min={0}
                                max={500}
                                value={income.pension.annualAmount}
                                onChange={(e) =>
                                    updateIncome({
                                        pension: { ...income.pension, annualAmount: Number(e.target.value) },
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
                </CardContent>
            </Card>
        </div>
    );
}
