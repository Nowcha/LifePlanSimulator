// STEP 5: リスク設定入力
import type { PlanInput } from '../../types/plan';

interface Props {
    input: PlanInput;
    onChange: (input: PlanInput) => void;
}

export default function Step5Risk({ input, onChange }: Props) {
    const { risk } = input;

    const update = (updates: Partial<typeof risk>) => {
        onChange({ ...input, risk: { ...risk, ...updates } });
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    緊急予備資金の目標
                    <span className="text-xs text-gray-400 ml-2">月数分</span>
                </label>
                <input
                    type="number"
                    min={0}
                    max={24}
                    value={risk.emergencyMonths}
                    onChange={(e) => update({ emergencyMonths: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">
                    生活費×{risk.emergencyMonths}ヶ月 = {(input.expense.monthlyLiving * risk.emergencyMonths).toFixed(0)}万円
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    老後の生活費目標
                    <span className="text-xs text-gray-400 ml-2">万円/月</span>
                </label>
                <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={risk.retirementMonthlyExpense}
                    onChange={(e) => update({ retirementMonthlyExpense: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-400 mt-1">
                    年間: {(risk.retirementMonthlyExpense * 12).toFixed(0)}万円
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    シミュレーション終了年齢
                    <span className="text-xs text-gray-400 ml-2">歳</span>
                </label>
                <input
                    type="number"
                    min={70}
                    max={120}
                    value={risk.simulationEndAge}
                    onChange={(e) => update({ simulationEndAge: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
            </div>

            {/* 設定サマリー */}
            <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">📋 設定サマリー</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>• 緊急予備資金: {(input.expense.monthlyLiving * risk.emergencyMonths).toFixed(0)}万円</p>
                    <p>• 老後の年間生活費: {(risk.retirementMonthlyExpense * 12).toFixed(0)}万円</p>
                    <p>• シミュレーション期間: {input.basic.currentAge}歳 → {risk.simulationEndAge}歳（{risk.simulationEndAge - input.basic.currentAge}年間）</p>
                </div>
            </div>
        </div>
    );
}
