// STEP 4: 資産・投資入力
import type { PlanInput } from '../../types/plan';

interface Props {
    input: PlanInput;
    onChange: (input: PlanInput) => void;
}

export default function Step4Assets({ input, onChange }: Props) {
    const { assets } = input;

    const update = (updates: Partial<typeof assets>) => {
        onChange({ ...input, assets: { ...assets, ...updates } });
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    現在の金融資産 <span className="text-xs text-gray-400">万円</span>
                </label>
                <input
                    type="number"
                    min={0}
                    value={assets.currentAssets}
                    onChange={(e) => update({ currentAssets: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        毎月の積立投資額 <span className="text-xs text-gray-400">万円</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={assets.monthlyInvestment}
                        onChange={(e) => update({ monthlyInvestment: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        想定年間利回り <span className="text-xs text-gray-400">%</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={20}
                        step={0.1}
                        value={assets.expectedReturn}
                        onChange={(e) => update({ expectedReturn: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* iDeCo */}
            <div className="p-4 rounded-xl bg-accent-500/5 border border-accent-200 dark:border-accent-800 space-y-4">
                <h3 className="font-medium text-accent-700 dark:text-accent-300 text-sm">iDeCo（個人型確定拠出年金）</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            積立額 <span className="text-xs text-gray-400">万円/月</span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={6.8}
                            step={0.1}
                            value={assets.monthlyIdeco}
                            onChange={(e) => update({ monthlyIdeco: Number(e.target.value) })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            想定利回り <span className="text-xs text-gray-400">%</span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.1}
                            value={assets.idecoReturn}
                            onChange={(e) => update({ idecoReturn: Number(e.target.value) })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* 住宅ローン */}
            <div className="p-4 rounded-xl bg-warning-400/5 border border-warning-400/30 space-y-4">
                <h3 className="font-medium text-warning-600 dark:text-warning-400 text-sm">住宅ローン</h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        残高 <span className="text-xs text-gray-400">万円</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={assets.mortgageBalance}
                        onChange={(e) => update({ mortgageBalance: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
                {assets.mortgageBalance > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                金利 <span className="text-xs text-gray-400">%</span>
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={10}
                                step={0.01}
                                value={assets.mortgageRate}
                                onChange={(e) => update({ mortgageRate: Number(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                残年数 <span className="text-xs text-gray-400">年</span>
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={35}
                                value={assets.mortgageYearsLeft}
                                onChange={(e) => update({ mortgageYearsLeft: Number(e.target.value) })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
