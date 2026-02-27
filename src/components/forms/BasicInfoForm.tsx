'use client';
// 基本情報入力フォーム

import { usePlanStore } from '@/store/plan-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Child, Gender, Region } from '@/types/plan';

const GENDERS: Gender[] = ['男性', '女性', 'その他'];
const REGIONS: Region[] = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄'];

export default function BasicInfoForm() {
    const { input, setBasic } = usePlanStore();
    const { basic } = input;

    const update = (updates: Partial<typeof basic>) => setBasic({ ...basic, ...updates });

    const addChild = () => {
        const child: Child = { id: Date.now().toString(), birthYear: 2020, birthMonth: 1, educationPolicy: '公立' };
        update({ children: [...basic.children, child] });
    };

    const removeChild = (id: string) => {
        update({ children: basic.children.filter(c => c.id !== id) });
    };

    const updateChild = (id: string, updates: Partial<Child>) => {
        update({ children: basic.children.map(c => c.id === id ? { ...c, ...updates } : c) });
    };

    return (
        <div className="space-y-6">
            {/* 名前 */}
            <div className="space-y-2">
                <Label>お名前（任意）</Label>
                <Input value={basic.name} onChange={e => update({ name: e.target.value })} placeholder="山田太郎" />
            </div>

            {/* 生年月 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>生年（西暦）</Label>
                    <Input type="number" value={basic.birthYear} onChange={e => update({ birthYear: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                    <Label>生月</Label>
                    <Input type="number" min={1} max={12} value={basic.birthMonth} onChange={e => update({ birthMonth: Number(e.target.value) })} />
                </div>
            </div>

            {/* 性別 */}
            <div className="space-y-2">
                <Label>性別</Label>
                <div className="flex gap-2">
                    {GENDERS.map(g => (
                        <Button key={g} variant={basic.gender === g ? 'default' : 'outline'} size="sm" onClick={() => update({ gender: g })}>{g}</Button>
                    ))}
                </div>
            </div>

            {/* 居住地域 */}
            <div className="space-y-2">
                <Label>居住地域</Label>
                <div className="flex flex-wrap gap-2">
                    {REGIONS.map(r => (
                        <Button key={r} variant={basic.region === r ? 'default' : 'outline'} size="sm" onClick={() => update({ region: r })}>{r}</Button>
                    ))}
                </div>
            </div>

            {/* 想定寿命 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>想定寿命（自身）</Label>
                    <Input type="number" min={60} max={120} value={basic.lifeExpectancy} onChange={e => update({ lifeExpectancy: Number(e.target.value) })} />
                </div>
            </div>

            {/* 配偶者 */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                        配偶者
                        <Button variant={basic.hasSpouse ? 'default' : 'outline'} size="sm" onClick={() => update({ hasSpouse: !basic.hasSpouse })}>
                            {basic.hasSpouse ? 'あり' : 'なし'}
                        </Button>
                    </CardTitle>
                </CardHeader>
                {basic.hasSpouse && (
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>生年（西暦）</Label>
                                <Input type="number" value={basic.spouseBirthYear} onChange={e => update({ spouseBirthYear: Number(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>生月</Label>
                                <Input type="number" min={1} max={12} value={basic.spouseBirthMonth} onChange={e => update({ spouseBirthMonth: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>配偶者の想定寿命</Label>
                            <Input type="number" min={60} max={120} value={basic.spouseLifeExpectancy} onChange={e => update({ spouseLifeExpectancy: Number(e.target.value) })} />
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* 子ども */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                        子ども（{basic.children.length}人）
                        <Button size="sm" variant="outline" onClick={addChild} disabled={basic.children.length >= 5}>＋ 追加</Button>
                    </CardTitle>
                </CardHeader>
                {basic.children.length > 0 && (
                    <CardContent className="space-y-3">
                        {basic.children.map((child, i) => (
                            <div key={child.id} className="flex items-end gap-2 p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium min-w-[3rem]">{i + 1}人目</span>
                                <div className="space-y-1 flex-1">
                                    <Label className="text-xs">生年</Label>
                                    <Input type="number" value={child.birthYear} onChange={e => updateChild(child.id, { birthYear: Number(e.target.value) })} className="h-8" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">教育方針</Label>
                                    <Button variant={child.educationPolicy === '公立' ? 'default' : 'outline'} size="sm" className="h-8"
                                        onClick={() => updateChild(child.id, { educationPolicy: child.educationPolicy === '公立' ? '私立' : '公立' })}>
                                        {child.educationPolicy}
                                    </Button>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 text-destructive" onClick={() => removeChild(child.id)}>×</Button>
                            </div>
                        ))}
                    </CardContent>
                )}
            </Card>
        </div>
    );
}
