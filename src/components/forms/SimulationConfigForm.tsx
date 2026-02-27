'use client';
// シミュレーション設定フォーム

import { usePlanStore } from '@/store/plan-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ScenarioType } from '@/types/plan';

const SCENARIOS: ScenarioType[] = ['楽観', '基本', '悲観'];

export default function SimulationConfigForm() {
    const { input, setConfig } = usePlanStore();
    const { config } = input;
    const update = (u: Partial<typeof config>) => setConfig({ ...config, ...u });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-sm">シミュレーション設定</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>シミュレーション終了年齢</Label>
                        <Input type="number" min={70} max={120} value={config.endAge} onChange={e => update({ endAge: Number(e.target.value) })} />
                    </div>

                    <div className="space-y-2">
                        <Label>ベースシナリオ</Label>
                        <div className="flex gap-2">
                            {SCENARIOS.map(s => (
                                <Button key={s} variant={config.scenario === s ? 'default' : 'outline'} onClick={() => update({ scenario: s })}>
                                    {s === '楽観' ? '🌞 楽観' : s === '基本' ? '📊 基本' : '🌧️ 悲観'}
                                </Button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            ※ 結果画面では3シナリオすべてが比較表示されます
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>モンテカルロ試行回数</Label>
                        <Input type="number" min={100} max={10000} step={100} value={config.monteCarloTrials}
                            onChange={e => update({ monteCarloTrials: Number(e.target.value) })} />
                        <p className="text-xs text-muted-foreground">
                            数が多いほど精度が上がりますが、計算に時間がかかります（推奨: 1,000回）
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 設定サマリー */}
            <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <h4 className="text-sm font-semibold mb-2">📋 シミュレーション概要</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p>• 期間: 現在 → {config.endAge}歳</p>
                        <p>• ベースシナリオ: {config.scenario}</p>
                        <p>• モンテカルロ: {config.monteCarloTrials.toLocaleString()}回試行</p>
                        <p>• 出力: 3シナリオ比較 + 確率分布</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
