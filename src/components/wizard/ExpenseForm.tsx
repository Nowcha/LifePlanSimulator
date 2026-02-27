import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
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
import type { HousingType, EducationLevel, UniversityType, CustomLivingCostItem } from '@/types/plan';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ExpenseForm() {
    const { input, updateExpense } = usePlanStore();
    const { expense } = input;
    const { childrenCount, futureBirth } = input.basicInfo;

    const hasChildren = childrenCount > 0 || futureBirth.enabled;

    return (
        <div className="space-y-6">
            {/* 基本生活費 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">基本生活費 (月額)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                        <span className="font-bold text-lg">合計</span>
                        <span className="font-bold text-2xl text-primary">
                            {(Object.values(expense.monthlyLivingCost).reduce((a, b) => a + b, 0) + (expense.customLivingCosts || []).reduce((a, item) => a + item.amount, 0)).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">万円/月</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                            <Label>食費</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number" min={0} max={50} step={0.1}
                                    value={expense.monthlyLivingCost.food}
                                    onChange={(e) => updateExpense({ monthlyLivingCost: { ...expense.monthlyLivingCost, food: Number(e.target.value) } })}
                                />
                                <span className="text-sm text-muted-foreground">万円</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>水道光熱費</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number" min={0} max={20} step={0.1}
                                    value={expense.monthlyLivingCost.utilities}
                                    onChange={(e) => updateExpense({ monthlyLivingCost: { ...expense.monthlyLivingCost, utilities: Number(e.target.value) } })}
                                />
                                <span className="text-sm text-muted-foreground">万円</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>通信費</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number" min={0} max={20} step={0.1}
                                    value={expense.monthlyLivingCost.communication}
                                    onChange={(e) => updateExpense({ monthlyLivingCost: { ...expense.monthlyLivingCost, communication: Number(e.target.value) } })}
                                />
                                <span className="text-sm text-muted-foreground">万円</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>日用品費</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number" min={0} max={30} step={0.1}
                                    value={expense.monthlyLivingCost.dailyNecessities}
                                    onChange={(e) => updateExpense({ monthlyLivingCost: { ...expense.monthlyLivingCost, dailyNecessities: Number(e.target.value) } })}
                                />
                                <span className="text-sm text-muted-foreground">万円</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>お小遣い・その他</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number" min={0} max={100} step={0.1}
                                    value={expense.monthlyLivingCost.allowanceAndOther}
                                    onChange={(e) => updateExpense({ monthlyLivingCost: { ...expense.monthlyLivingCost, allowanceAndOther: Number(e.target.value) } })}
                                />
                                <span className="text-sm text-muted-foreground">万円</span>
                            </div>
                        </div>
                    </div>

                    {/* カスタム生活費項目 */}
                    <div className="pt-4 mt-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">カスタム項目</h4>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const newItem: CustomLivingCostItem = {
                                        id: crypto.randomUUID(),
                                        name: '',
                                        amount: 0,
                                    };
                                    updateExpense({
                                        customLivingCosts: [...(expense.customLivingCosts || []), newItem],
                                    });
                                }}
                            >
                                ＋ 項目を追加
                            </Button>
                        </div>
                        {(expense.customLivingCosts || []).map((item, index) => (
                            <div key={item.id} className="flex items-end gap-2">
                                <div className="flex-1 space-y-1">
                                    {index === 0 && <Label className="text-xs">項目名</Label>}
                                    <Input
                                        placeholder="例: 習い事"
                                        value={item.name}
                                        onChange={(e) => {
                                            const updated = [...(expense.customLivingCosts || [])];
                                            updated[index] = { ...item, name: e.target.value };
                                            updateExpense({ customLivingCosts: updated });
                                        }}
                                    />
                                </div>
                                <div className="w-24 space-y-1">
                                    {index === 0 && <Label className="text-xs">月額(万円)</Label>}
                                    <Input
                                        type="number" min={0} max={50} step={0.1}
                                        value={item.amount}
                                        onChange={(e) => {
                                            const updated = [...(expense.customLivingCosts || [])];
                                            updated[index] = { ...item, amount: Number(e.target.value) };
                                            updateExpense({ customLivingCosts: updated });
                                        }}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => {
                                        const updated = (expense.customLivingCosts || []).filter((_, i) => i !== index);
                                        updateExpense({ customLivingCosts: updated });
                                    }}
                                >
                                    ✕
                                </Button>
                            </div>
                        ))}
                    </div>

                    {hasChildren && (
                        <div className="pt-4 mt-4 border-t space-y-4">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                子ども関連の追加生活費
                                <FormTooltip text="お子様が独立するまで（22歳想定）、基本生活費とは別に毎月自動加算される金額です。" />
                            </h4>
                            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                                <Label>子ども1人あたりの追加額</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number" min={0} max={20} step={0.1}
                                        value={expense.childRelatedCost?.monthlyLivingCostPerChild ?? 3}
                                        onChange={(e) => updateExpense({ childRelatedCost: { monthlyLivingCostPerChild: Number(e.target.value) } })}
                                    />
                                    <span className="text-sm text-muted-foreground">万円/月</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 住居費 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">住居・住宅ローン</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="housingType">
                            居住形態
                            <FormTooltip text="現在の居住形態を選択してください。" />
                        </Label>
                        <Select
                            value={expense.housing.type}
                            onValueChange={(value: HousingType) =>
                                updateExpense({ housing: { ...expense.housing, type: value } })
                            }
                        >
                            <SelectTrigger className="w-52" id="housingType">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rent">賃貸</SelectItem>
                                <SelectItem value="own_with_loan">持家 (ローンあり)</SelectItem>
                                <SelectItem value="own_no_loan">持家 (ローンなし)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* 賃貸の場合 */}
                    {expense.housing.type === 'rent' && (
                        <>
                            <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                                <div className="space-y-2">
                                    <Label htmlFor="monthlyRent">月額家賃（管理費込み）</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="monthlyRent"
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={expense.housing.monthlyRent}
                                            onChange={(e) =>
                                                updateExpense({
                                                    housing: { ...expense.housing, monthlyRent: Number(e.target.value) },
                                                })
                                            }
                                            className="w-24"
                                        />
                                        <span className="text-sm text-muted-foreground">万円/月</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>更新頻度</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min={1}
                                                max={10}
                                                value={expense.housing.renewalCycleYears ?? 2}
                                                onChange={(e) =>
                                                    updateExpense({
                                                        housing: { ...expense.housing, renewalCycleYears: Number(e.target.value) },
                                                    })
                                                }
                                                className="w-20"
                                            />
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">年ごと</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>更新費用</Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={expense.housing.renewalCost ?? 8}
                                                onChange={(e) =>
                                                    updateExpense({
                                                        housing: { ...expense.housing, renewalCost: Number(e.target.value) },
                                                    })
                                                }
                                                className="w-20"
                                            />
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="purchasePlan">
                                        将来の住宅購入予定
                                        <FormTooltip text="将来、住宅を購入する予定がある場合に設定します。" />
                                    </Label>
                                    <Switch
                                        id="purchasePlan"
                                        checked={expense.housing.purchasePlan.enabled}
                                        onCheckedChange={(checked) =>
                                            updateExpense({
                                                housing: {
                                                    ...expense.housing,
                                                    purchasePlan: { ...expense.housing.purchasePlan, enabled: checked },
                                                },
                                            })
                                        }
                                    />
                                </div>

                                {expense.housing.purchasePlan.enabled && (
                                    <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>購入時期</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={50}
                                                        value={expense.housing.purchasePlan.yearsFromNow}
                                                        onChange={(e) =>
                                                            updateExpense({
                                                                housing: {
                                                                    ...expense.housing,
                                                                    purchasePlan: { ...expense.housing.purchasePlan, yearsFromNow: Number(e.target.value) },
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <span className="text-sm text-muted-foreground whitespace-nowrap">年後</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>物件価格</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={20000}
                                                        value={expense.housing.purchasePlan.propertyPrice}
                                                        onChange={(e) =>
                                                            updateExpense({
                                                                housing: {
                                                                    ...expense.housing,
                                                                    purchasePlan: { ...expense.housing.purchasePlan, propertyPrice: Number(e.target.value) },
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>頭金</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={10000}
                                                        value={expense.housing.purchasePlan.downPayment}
                                                        onChange={(e) =>
                                                            updateExpense({
                                                                housing: {
                                                                    ...expense.housing,
                                                                    purchasePlan: { ...expense.housing.purchasePlan, downPayment: Number(e.target.value) },
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>ローン金利</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={10}
                                                        step={0.1}
                                                        value={expense.housing.purchasePlan.loanInterestRate}
                                                        onChange={(e) =>
                                                            updateExpense({
                                                                housing: {
                                                                    ...expense.housing,
                                                                    purchasePlan: { ...expense.housing.purchasePlan, loanInterestRate: Number(e.target.value) },
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <span className="text-sm text-muted-foreground whitespace-nowrap">%</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>返済期間</Label>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={50}
                                                        value={expense.housing.purchasePlan.loanPeriod}
                                                        onChange={(e) =>
                                                            updateExpense({
                                                                housing: {
                                                                    ...expense.housing,
                                                                    purchasePlan: { ...expense.housing.purchasePlan, loanPeriod: Number(e.target.value) },
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <span className="text-sm text-muted-foreground whitespace-nowrap">年</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* 持家（ローンあり）の場合 */}
                    {expense.housing.type === 'own_with_loan' && (
                        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>月額返済額</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={expense.housing.mortgage.monthlyPayment}
                                            onChange={(e) =>
                                                updateExpense({
                                                    housing: {
                                                        ...expense.housing,
                                                        mortgage: { ...expense.housing.mortgage, monthlyPayment: Number(e.target.value) },
                                                    },
                                                })
                                            }
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>残存期間</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={50}
                                            value={expense.housing.mortgage.remainingYears}
                                            onChange={(e) =>
                                                updateExpense({
                                                    housing: {
                                                        ...expense.housing,
                                                        mortgage: { ...expense.housing.mortgage, remainingYears: Number(e.target.value) },
                                                    },
                                                })
                                            }
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">年</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>ローン金利</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={10}
                                            step={0.1}
                                            value={expense.housing.mortgage.interestRate}
                                            onChange={(e) =>
                                                updateExpense({
                                                    housing: {
                                                        ...expense.housing,
                                                        mortgage: { ...expense.housing.mortgage, interestRate: Number(e.target.value) },
                                                    },
                                                })
                                            }
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">%</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>ローン残高</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={20000}
                                            value={expense.housing.mortgage.remainingBalance}
                                            onChange={(e) =>
                                                updateExpense({
                                                    housing: {
                                                        ...expense.housing,
                                                        mortgage: { ...expense.housing.mortgage, remainingBalance: Number(e.target.value) },
                                                    },
                                                })
                                            }
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 教育費（子どもがいる場合のみ表示） */}
            {hasChildren && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">教育費方針</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-sm text-muted-foreground mb-4">
                            文部科学省の調査データに基づき、選択した方針に応じて各進学ステージでの年間費用が自動計算されます。
                        </p>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label>
                                    出産費用 (0歳時)
                                    <FormTooltip text="出産一時金などを差し引いた、実質的な自己負担額を入力してください。" />
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        className="w-full"
                                        type="number" min={0} max={200} step={1}
                                        value={expense.educationPlan.birthCost ?? 10}
                                        onChange={(e) => updateExpense({ educationPlan: { ...expense.educationPlan, birthCost: Number(e.target.value) } })}
                                    />
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>保育園・乳幼児 (0〜2歳)</Label>
                                <Select
                                    value={expense.educationPlan.nursery ?? 'none'}
                                    onValueChange={(value: EducationLevel | 'none') => updateExpense({ educationPlan: { ...expense.educationPlan, nursery: value } })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">預けない (0円)</SelectItem>
                                        <SelectItem value="public">公立</SelectItem>
                                        <SelectItem value="private">私立</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>幼稚園 (3〜5歳)</Label>
                                <Select
                                    value={expense.educationPlan.kindergarten}
                                    onValueChange={(value: EducationLevel) => updateExpense({ educationPlan: { ...expense.educationPlan, kindergarten: value } })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">公立</SelectItem>
                                        <SelectItem value="private">私立</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>小学校</Label>
                                <Select
                                    value={expense.educationPlan.elementary}
                                    onValueChange={(value: EducationLevel) => updateExpense({ educationPlan: { ...expense.educationPlan, elementary: value } })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">公立</SelectItem>
                                        <SelectItem value="private">私立</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>中学校</Label>
                                <Select
                                    value={expense.educationPlan.juniorHigh}
                                    onValueChange={(value: EducationLevel) => updateExpense({ educationPlan: { ...expense.educationPlan, juniorHigh: value } })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">公立</SelectItem>
                                        <SelectItem value="private">私立</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>高校</Label>
                                <Select
                                    value={expense.educationPlan.highSchool}
                                    onValueChange={(value: EducationLevel) => updateExpense({ educationPlan: { ...expense.educationPlan, highSchool: value } })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">公立</SelectItem>
                                        <SelectItem value="private">私立</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2 border-t mt-4">
                            <div className="space-y-2">
                                <Label>大学の種類</Label>
                                <Select
                                    value={expense.educationPlan.university}
                                    onValueChange={(value: UniversityType) => updateExpense({ educationPlan: { ...expense.educationPlan, university: value } })}
                                >
                                    <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="national">国公立</SelectItem>
                                        <SelectItem value="private_arts">私立文系</SelectItem>
                                        <SelectItem value="private_science">私立理系</SelectItem>
                                        <SelectItem value="medical">医歯薬系 (6年)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="livingAlone"
                                    checked={expense.educationPlan.livingAlone}
                                    onCheckedChange={(checked) => updateExpense({ educationPlan: { ...expense.educationPlan, livingAlone: checked } })}
                                />
                                <Label htmlFor="livingAlone">大学時に一人暮らしをする（仕送りを追加）</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 車両費・保険・その他 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">その他（車両・保険・レジャー）</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="hasCar">
                            自家用車の保有
                        </Label>
                        <Switch
                            id="hasCar"
                            checked={expense.car.enabled}
                            onCheckedChange={(checked) =>
                                updateExpense({ car: { ...expense.car, enabled: checked } })
                            }
                        />
                    </div>

                    {expense.car.enabled && (
                        <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>買替サイクル</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            max={20}
                                            value={expense.car.replaceCycleYears}
                                            onChange={(e) => updateExpense({ car: { ...expense.car, replaceCycleYears: Number(e.target.value) } })}
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">年</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>1台あたり購入費</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={0}
                                            max={2000}
                                            value={expense.car.purchaseCost}
                                            onChange={(e) => updateExpense({ car: { ...expense.car, purchaseCost: Number(e.target.value) } })}
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">万円</span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-sm font-semibold pt-2 border-t">維持・管理費</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>自動車保険</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number" min={0} max={50} step={0.1}
                                            value={expense.car.annualInsurance ?? 6}
                                            onChange={(e) => updateExpense({ car: { ...expense.car, annualInsurance: Number(e.target.value) } })}
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">万円/年</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>自動車税</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number" min={0} max={20} step={0.1}
                                            value={expense.car.annualTax ?? 4}
                                            onChange={(e) => updateExpense({ car: { ...expense.car, annualTax: Number(e.target.value) } })}
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">万円/年</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>駐車場代</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number" min={0} max={10} step={0.1}
                                            value={expense.car.monthlyParking ?? 1.5}
                                            onChange={(e) => updateExpense({ car: { ...expense.car, monthlyParking: Number(e.target.value) } })}
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">万円/月</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>車検・整備費 (年按分)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number" min={0} max={30} step={0.1}
                                            value={expense.car.annualMaintenance ?? 5}
                                            onChange={(e) => updateExpense({ car: { ...expense.car, annualMaintenance: Number(e.target.value) } })}
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">万円/年</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>ガソリン・燃料費</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number" min={0} max={10} step={0.1}
                                            value={expense.car.monthlyGasFuel ?? 1}
                                            onChange={(e) => updateExpense({ car: { ...expense.car, monthlyGasFuel: Number(e.target.value) } })}
                                        />
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">万円/月</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 pt-2">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>生命・医療などの保険料 (月額)</Label>
                                <span className="font-bold text-lg text-primary">
                                    合計 {
                                        Object.values(expense.insurance.self).reduce((a, b) => a + b, 0) +
                                        (input.basicInfo.hasSpouse ? Object.values(expense.insurance.spouse).reduce((a, b) => a + b, 0) : 0)
                                    } <span className="text-sm font-normal text-muted-foreground">万円/月</span>
                                </span>
                            </div>

                            <Tabs defaultValue="self" className="w-full">
                                {input.basicInfo.hasSpouse && (
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="self">あなた</TabsTrigger>
                                        <TabsTrigger value="spouse">配偶者</TabsTrigger>
                                    </TabsList>
                                )}

                                <TabsContent value="self" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>生命保険</Label>
                                            <div className="flex gap-2">
                                                <Input type="number" min={0} step={0.1} value={expense.insurance.self.life} onChange={(e) => updateExpense({ insurance: { ...expense.insurance, self: { ...expense.insurance.self, life: Number(e.target.value) } } })} />
                                                <span className="text-sm self-center text-muted-foreground">万円</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>医療保険</Label>
                                            <div className="flex gap-2">
                                                <Input type="number" min={0} step={0.1} value={expense.insurance.self.medical} onChange={(e) => updateExpense({ insurance: { ...expense.insurance, self: { ...expense.insurance.self, medical: Number(e.target.value) } } })} />
                                                <span className="text-sm self-center text-muted-foreground">万円</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>がん保険</Label>
                                            <div className="flex gap-2">
                                                <Input type="number" min={0} step={0.1} value={expense.insurance.self.cancer} onChange={(e) => updateExpense({ insurance: { ...expense.insurance, self: { ...expense.insurance.self, cancer: Number(e.target.value) } } })} />
                                                <span className="text-sm self-center text-muted-foreground">万円</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>その他保険</Label>
                                            <div className="flex gap-2">
                                                <Input type="number" min={0} step={0.1} value={expense.insurance.self.other} onChange={(e) => updateExpense({ insurance: { ...expense.insurance, self: { ...expense.insurance.self, other: Number(e.target.value) } } })} />
                                                <span className="text-sm self-center text-muted-foreground">万円</span>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {input.basicInfo.hasSpouse && (
                                    <TabsContent value="spouse" className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>生命保険</Label>
                                                <div className="flex gap-2">
                                                    <Input type="number" min={0} step={0.1} value={expense.insurance.spouse.life} onChange={(e) => updateExpense({ insurance: { ...expense.insurance, spouse: { ...expense.insurance.spouse, life: Number(e.target.value) } } })} />
                                                    <span className="text-sm self-center text-muted-foreground">万円</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>医療保険</Label>
                                                <div className="flex gap-2">
                                                    <Input type="number" min={0} step={0.1} value={expense.insurance.spouse.medical} onChange={(e) => updateExpense({ insurance: { ...expense.insurance, spouse: { ...expense.insurance.spouse, medical: Number(e.target.value) } } })} />
                                                    <span className="text-sm self-center text-muted-foreground">万円</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>がん保険</Label>
                                                <div className="flex gap-2">
                                                    <Input type="number" min={0} step={0.1} value={expense.insurance.spouse.cancer} onChange={(e) => updateExpense({ insurance: { ...expense.insurance, spouse: { ...expense.insurance.spouse, cancer: Number(e.target.value) } } })} />
                                                    <span className="text-sm self-center text-muted-foreground">万円</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>その他保険</Label>
                                                <div className="flex gap-2">
                                                    <Input type="number" min={0} step={0.1} value={expense.insurance.spouse.other} onChange={(e) => updateExpense({ insurance: { ...expense.insurance, spouse: { ...expense.insurance.spouse, other: Number(e.target.value) } } })} />
                                                    <span className="text-sm self-center text-muted-foreground">万円</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                )}
                            </Tabs>
                        </div>

                        <div className="space-y-2 pt-4 border-t">
                            <Label>旅行・レジャー費</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min={0}
                                    max={500}
                                    value={expense.annualTravelLeisure}
                                    onChange={(e) => updateExpense({ annualTravelLeisure: Number(e.target.value) })}
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">万円/年</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
