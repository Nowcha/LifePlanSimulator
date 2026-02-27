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
import type { WithdrawalMethod } from '@/types/plan';

export function InvestmentForm() {
    const { input, updateInvestment } = usePlanStore();
    const { investment } = input;

    return (
        <div className="space-y-6">
            {/* 資産内訳 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">現在の金融資産</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>預貯金</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={100000}
                                    value={investment.totalAssets.savings}
                                    onChange={(e) =>
                                        updateInvestment({
                                            totalAssets: { ...investment.totalAssets, savings: Number(e.target.value) },
                                        })
                                    }
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>株式・投資信託</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={100000}
                                    value={investment.totalAssets.stocksAndFunds}
                                    onChange={(e) =>
                                        updateInvestment({
                                            totalAssets: { ...investment.totalAssets, stocksAndFunds: Number(e.target.value) },
                                        })
                                    }
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>その他有価証券</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={100000}
                                    value={investment.totalAssets.other}
                                    onChange={(e) =>
                                        updateInvestment({
                                            totalAssets: { ...investment.totalAssets, other: Number(e.target.value) },
                                        })
                                    }
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t text-right font-medium">
                        総資産額: {(investment.totalAssets.savings + investment.totalAssets.stocksAndFunds + investment.totalAssets.other).toLocaleString()} 万円
                    </div>
                </CardContent>
            </Card>

            {/* 積立・拠出 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">毎月の積立・運用設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="monthlyInvestment">
                            毎月の積立投資額
                            <FormTooltip text="新NISAや特定口座などの毎月の積立額合計を入力してください。シミュレーションで資産運用に回されます。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="monthlyInvestment"
                                type="number"
                                min={0}
                                max={100}
                                value={investment.monthlyInvestment}
                                onChange={(e) => updateInvestment({ monthlyInvestment: Number(e.target.value) })}
                                className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">万円/月</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <Label htmlFor="nisaEnabled">
                            NISA制度を利用している
                        </Label>
                        <Switch
                            id="nisaEnabled"
                            checked={investment.nisaEnabled}
                            onCheckedChange={(checked) => updateInvestment({ nisaEnabled: checked })}
                        />
                    </div>

                    {investment.nisaEnabled && (
                        <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                            <Label>年間の想定NISA投資額</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    min={0}
                                    max={360}
                                    value={investment.nisaAnnualAmount}
                                    onChange={(e) => updateInvestment({ nisaAnnualAmount: Number(e.target.value) })}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">万円/年</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2 pt-2 border-t">
                        <Label>
                            iDeCo（個人型確定拠出年金）の掛金
                            <FormTooltip text="所得控除に反映され、60歳まで引き出しできません。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                min={0}
                                max={6.8}
                                step={0.1}
                                value={investment.idecoMonthly}
                                onChange={(e) => updateInvestment({ idecoMonthly: Number(e.target.value) })}
                                className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">万円/月</span>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                        <Label htmlFor="investmentEndAge">
                            積立終了年齢（いつまで積み立てるか）
                            <FormTooltip text="指定した年齢以降は新たな積立を行わず、運用のみを継続します。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="investmentEndAge"
                                type="number"
                                min={18}
                                max={100}
                                value={investment.investmentEndAge}
                                onChange={(e) => updateInvestment({ investmentEndAge: Number(e.target.value) })}
                                className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">歳まで</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ポートフォリオとリターン */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">期待リターン・資産配分</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Label>
                            期待リターン（年率）の設定
                            <FormTooltip text="今後の資産運用全体の期待年利回りです。自身で設定した利回りを基準に、楽観的(+2%)・悲観的(-2%)のシナリオも同時に計算されます。" />
                        </Label>

                        <div className="flex gap-6 mb-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="return-auto"
                                    name="return-type"
                                    className="accent-primary w-4 h-4 cursor-pointer"
                                    checked={investment.expectedReturn === 0}
                                    onChange={() => updateInvestment({ expectedReturn: 0 })}
                                />
                                <Label htmlFor="return-auto" className="cursor-pointer">標準シナリオに従う</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    id="return-manual"
                                    name="return-type"
                                    className="accent-primary w-4 h-4 cursor-pointer"
                                    checked={investment.expectedReturn > 0}
                                    onChange={() => updateInvestment({ expectedReturn: 5.0 })}
                                />
                                <Label htmlFor="return-manual" className="cursor-pointer">自分で利回りを設定する</Label>
                            </div>
                        </div>

                        {investment.expectedReturn > 0 && (
                            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                                <Label>基準とする期待リターン</Label>
                                <div className="flex items-center gap-3">
                                    <Slider
                                        min={0.1}
                                        max={20}
                                        step={0.1}
                                        value={[investment.expectedReturn]}
                                        onValueChange={([value]) => updateInvestment({ expectedReturn: value })}
                                        className="w-48"
                                    />
                                    <Input
                                        type="number"
                                        min={0.1}
                                        max={30}
                                        step={0.1}
                                        value={investment.expectedReturn}
                                        onChange={(e) => updateInvestment({ expectedReturn: Math.max(0.1, Number(e.target.value)) })}
                                        className="w-20"
                                    />
                                    <span className="text-sm text-muted-foreground">%</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <Label>
                            リタイア後の資産取り崩し方法
                            <FormTooltip text="定額：毎月一定額を取り崩す。 定率：資産残高の一定割合を取り崩す。自動最適化：寿命と残高から自動計算します。" />
                        </Label>
                        <Select
                            value={investment.withdrawalMethod}
                            onValueChange={(value: WithdrawalMethod) => updateInvestment({ withdrawalMethod: value })}
                        >
                            <SelectTrigger className="w-52">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fixed_amount">定額取り崩し</SelectItem>
                                <SelectItem value="fixed_rate">定率取り崩し</SelectItem>
                                <SelectItem value="auto_optimize">自動最適化(寿命ベース)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
