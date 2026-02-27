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
import type { ReturnScenario, PensionReduction } from '@/types/plan';
import { SCENARIO_RETURNS } from '@/constants/defaults';

export function ScenarioConfigForm() {
    const { input, updateScenario } = usePlanStore();
    const { scenario } = input;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">基本シナリオ設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* インフレ率 */}
                    <div className="space-y-2">
                        <Label htmlFor="inflationRate">
                            想定インフレ率
                            <FormTooltip text="生活費や教育費などが毎年どれくらい上昇するかを設定します。日銀の目標は2%です。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Slider
                                id="inflationRate"
                                min={-2}
                                max={5}
                                step={0.1}
                                value={[scenario.inflationRate]}
                                onValueChange={([value]) => updateScenario({ inflationRate: value })}
                                className="w-48"
                            />
                            <Input
                                type="number"
                                min={-5}
                                max={10}
                                step={0.1}
                                value={scenario.inflationRate}
                                onChange={(e) => updateScenario({ inflationRate: Number(e.target.value) })}
                                className="w-20"
                            />
                            <span className="text-sm text-muted-foreground">% / 年</span>
                        </div>
                    </div>

                    {/* 運用リターンシナリオ */}
                    <div className="space-y-4 pt-4 border-t">
                        <Label>
                            メインで表示する運用リターンのシナリオ
                            <FormTooltip text="ダッシュボードや詳細表で中心となる運用成績を選択します。" />
                        </Label>
                        <Select
                            value={scenario.returnScenario === 'custom' ? 'standard' : scenario.returnScenario}
                            onValueChange={(value: ReturnScenario) => updateScenario({ returnScenario: value })}
                        >
                            <SelectTrigger className="w-80">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="optimistic">楽観的シナリオ (標準 + 2.0%)</SelectItem>
                                <SelectItem value="standard">標準的シナリオ (基準利回り)</SelectItem>
                                <SelectItem value="pessimistic">悲観的シナリオ (標準 - 2.0%)</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                            ※ 現在の基準利回り（標準シナリオ）は
                            <span className="font-bold text-foreground mx-1">
                                {input.investment.expectedReturn > 0 ? input.investment.expectedReturn.toFixed(1) : SCENARIO_RETURNS.standard.toFixed(1)}%
                            </span>
                            です。（Step 4の「期待リターンの設定」に連動しています）
                        </div>
                    </div>

                    {/* 年金受給額の減額リスク */}
                    <div className="space-y-2 pt-4 border-t">
                        <Label>
                            将来の年金受給額シナリオ
                            <FormTooltip text="少子高齢化に伴うマクロ経済スライド等による、将来の年金受給額の実質的な目減りリスクを設定します。" />
                        </Label>
                        <Select
                            value={scenario.pensionReduction}
                            onValueChange={(value: PensionReduction) => updateScenario({ pensionReduction: value })}
                        >
                            <SelectTrigger className="w-64">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="current">現状維持 (100%支給)</SelectItem>
                                <SelectItem value="reduce_20">2割減額 (80%水準)</SelectItem>
                                <SelectItem value="reduce_30">3割減額 (70%水準)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">モンテカルロ・シミュレーション</CardTitle>
                        <Switch
                            checked={scenario.monteCarlo.enabled}
                            onCheckedChange={(checked) =>
                                updateScenario({
                                    monteCarlo: { ...scenario.monteCarlo, enabled: checked },
                                })
                            }
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            一定のリターンではなく、過去の市場データに基づくランダムな相場変動（ボラティリティ）を加味して、数千回のシミュレーションを行います。<br />
                            資産が底をつく確率（破産確率）や、確率的な上位・下位の資産推移を確認できます。
                        </p>

                        {scenario.monteCarlo.enabled && (
                            <div className="space-y-2 pt-2">
                                <Label>シミュレーション試行回数</Label>
                                <div className="flex items-center gap-3">
                                    <Select
                                        value={scenario.monteCarlo.trials.toString()}
                                        onValueChange={(value) =>
                                            updateScenario({
                                                monteCarlo: { ...scenario.monteCarlo, trials: Number(value) },
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1000">1,000 回</SelectItem>
                                            <SelectItem value="3000">3,000 回</SelectItem>
                                            <SelectItem value="5000">5,000 回</SelectItem>
                                            <SelectItem value="10000">10,000 回</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span className="text-xs text-muted-foreground">
                                        ※回数が多いほど精度は上がりますが、計算に時間がかかります。通常は1,000回で十分です。
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
