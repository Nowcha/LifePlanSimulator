// STEP 2: 収入入力
import type { PlanInput } from '../../types/plan';

interface Props {
    input: PlanInput;
    onChange: (input: PlanInput) => void;
}

function InputField({
    label,
    unit,
    value,
    onChange,
    min = 0,
    max,
    step = 1,
    hint,
}: {
    label: string;
    unit: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    step?: number;
    hint?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {label}
                <span className="text-xs text-gray-400 ml-2">{unit}</span>
            </label>
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
    );
}

export default function Step2Income({ input, onChange }: Props) {
    const { income, basic } = input;

    const update = (updates: Partial<typeof income>) => {
        onChange({ ...input, income: { ...income, ...updates } });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                    label="手取り年収"
                    unit="万円"
                    value={income.annualIncome}
                    onChange={(v) => update({ annualIncome: v })}
                />
                <InputField
                    label="年間昇給率"
                    unit="%"
                    value={income.raiseRate}
                    onChange={(v) => update({ raiseRate: v })}
                    step={0.1}
                />
            </div>

            <InputField
                label="ボーナス（年間）"
                unit="万円"
                value={income.bonus}
                onChange={(v) => update({ bonus: v })}
            />

            {/* 配偶者の収入 */}
            {basic.hasSpouse && (
                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 space-y-4">
                    <h3 className="font-medium text-primary-700 dark:text-primary-300 text-sm">配偶者の収入</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InputField
                            label="手取り年収"
                            unit="万円"
                            value={income.spouseIncome}
                            onChange={(v) => update({ spouseIncome: v })}
                        />
                        <InputField
                            label="昇給率"
                            unit="%"
                            value={income.spouseRaiseRate}
                            onChange={(v) => update({ spouseRaiseRate: v })}
                            step={0.1}
                        />
                    </div>
                </div>
            )}

            <InputField
                label="副業収入（年間）"
                unit="万円"
                value={income.sideIncome}
                onChange={(v) => update({ sideIncome: v })}
            />

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">退職・年金</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        label="退職年齢"
                        unit="歳"
                        value={income.retirementAge}
                        onChange={(v) => update({ retirementAge: v })}
                        min={50}
                        max={75}
                    />
                    <InputField
                        label="退職金見込み額"
                        unit="万円"
                        value={income.severancePay}
                        onChange={(v) => update({ severancePay: v })}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        label="年金受給開始年齢"
                        unit="歳"
                        value={income.pensionStartAge}
                        onChange={(v) => update({ pensionStartAge: v })}
                        min={60}
                        max={75}
                    />
                    <InputField
                        label="月額年金見込み"
                        unit="万円"
                        value={income.monthlyPension}
                        onChange={(v) => update({ monthlyPension: v })}
                        step={0.1}
                        hint="ねんきんネット参照値"
                    />
                </div>
            </div>
        </div>
    );
}
