import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import type { Gender, Child } from '@/types/plan';

export function BasicInfoForm() {
    const { input, updateBasicInfo } = usePlanStore();
    const { basicInfo } = input;

    const handleChildrenCountChange = (count: number) => {
        const currentChildren = basicInfo.children;
        let newChildren: Child[];
        if (count > currentChildren.length) {
            newChildren = [
                ...currentChildren,
                ...Array.from({ length: count - currentChildren.length }, () => ({ age: 0 })),
            ];
        } else {
            newChildren = currentChildren.slice(0, count);
        }
        updateBasicInfo({ childrenCount: count, children: newChildren });
    };

    const handleChildAgeChange = (index: number, age: number) => {
        const newChildren = [...basicInfo.children];
        newChildren[index] = { age };
        updateBasicInfo({ children: newChildren });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">基本情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* 現在の年齢 */}
                    <div className="space-y-2">
                        <Label htmlFor="currentAge">
                            現在の年齢
                            <FormTooltip text="あなたの現在の年齢を入力してください。シミュレーションの起点になります。" />
                        </Label>
                        <div className="flex items-center gap-3">
                            <Input
                                id="currentAge"
                                type="number"
                                min={18}
                                max={80}
                                value={basicInfo.currentAge}
                                onChange={(e) => updateBasicInfo({ currentAge: Number(e.target.value) })}
                                className="w-24"
                            />
                            <span className="text-sm text-muted-foreground">歳</span>
                        </div>
                    </div>

                    {/* 性別 */}
                    <div className="space-y-2">
                        <Label>
                            性別
                            <FormTooltip text="年金額の概算計算に使用されます。" />
                        </Label>
                        <RadioGroup
                            value={basicInfo.gender}
                            onValueChange={(value: Gender) => updateBasicInfo({ gender: value })}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male" className="cursor-pointer">男性</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female" className="cursor-pointer">女性</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" />
                                <Label htmlFor="other" className="cursor-pointer">その他</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* シミュレーション終了年齢 */}
                    <div className="space-y-2">
                        <Label htmlFor="simulationEndAge">
                            シミュレーション終了年齢: {basicInfo.simulationEndAge}歳
                            <FormTooltip text="何歳までのシミュレーションを行うか設定します。日本人の平均寿命は男性81歳、女性87歳です。" />
                        </Label>
                        <Slider
                            id="simulationEndAge"
                            min={80}
                            max={100}
                            step={1}
                            value={[basicInfo.simulationEndAge]}
                            onValueChange={([value]) => updateBasicInfo({ simulationEndAge: value })}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>80歳</span>
                            <span>100歳</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 配偶者 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">配偶者</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="hasSpouse">
                            配偶者の有無
                            <FormTooltip text="配偶者がいる場合、世帯収入や年金の計算に反映されます。" />
                        </Label>
                        <Switch
                            id="hasSpouse"
                            checked={basicInfo.hasSpouse}
                            onCheckedChange={(checked) => updateBasicInfo({ hasSpouse: checked })}
                        />
                    </div>

                    {basicInfo.hasSpouse && (
                        <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                            <Label htmlFor="spouseAge">配偶者の年齢</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    id="spouseAge"
                                    type="number"
                                    min={18}
                                    max={80}
                                    value={basicInfo.spouseAge}
                                    onChange={(e) => updateBasicInfo({ spouseAge: Number(e.target.value) })}
                                    className="w-24"
                                />
                                <span className="text-sm text-muted-foreground">歳</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 子ども */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">子ども</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="childrenCount">
                            子どもの人数
                            <FormTooltip text="教育費の計算に使用されます。各子どもの年齢に応じて、幼稚園から大学までの費用が自動計算されます。" />
                        </Label>
                        <Select
                            value={String(basicInfo.childrenCount)}
                            onValueChange={(value) => handleChildrenCountChange(Number(value))}
                        >
                            <SelectTrigger className="w-24" id="childrenCount">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[0, 1, 2, 3, 4, 5].map((n) => (
                                    <SelectItem key={n} value={String(n)}>
                                        {n}人
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {basicInfo.childrenCount > 0 && (
                        <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                            {basicInfo.children.map((child, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <Label className="whitespace-nowrap">
                                        第{index + 1}子の年齢
                                    </Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={30}
                                        value={child.age}
                                        onChange={(e) => handleChildAgeChange(index, Number(e.target.value))}
                                        className="w-20"
                                    />
                                    <span className="text-sm text-muted-foreground">歳</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 将来の出産予定 */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="futureBirth">
                                将来の出産予定
                                <FormTooltip text="将来の出産予定がある場合、その時期から教育費が発生します。" />
                            </Label>
                            <Switch
                                id="futureBirth"
                                checked={basicInfo.futureBirth.enabled}
                                onCheckedChange={(checked) =>
                                    updateBasicInfo({
                                        futureBirth: { ...basicInfo.futureBirth, enabled: checked },
                                    })
                                }
                            />
                        </div>

                        {basicInfo.futureBirth.enabled && (
                            <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                                <div className="flex items-center gap-3">
                                    <Label className="whitespace-nowrap">予定人数</Label>
                                    <Select
                                        value={String(basicInfo.futureBirth.count)}
                                        onValueChange={(value) =>
                                            updateBasicInfo({
                                                futureBirth: { ...basicInfo.futureBirth, count: Number(value) },
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3].map((n) => (
                                                <SelectItem key={n} value={String(n)}>
                                                    {n}人
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Label className="whitespace-nowrap">時期</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={20}
                                        value={basicInfo.futureBirth.yearsFromNow}
                                        onChange={(e) =>
                                            updateBasicInfo({
                                                futureBirth: {
                                                    ...basicInfo.futureBirth,
                                                    yearsFromNow: Number(e.target.value),
                                                },
                                            })
                                        }
                                        className="w-20"
                                    />
                                    <span className="text-sm text-muted-foreground">年後</span>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
