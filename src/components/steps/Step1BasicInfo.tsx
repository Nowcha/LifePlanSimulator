// STEP 1: 基本情報入力
import type { PlanInput, Child } from '../../types/plan';

interface Props {
    input: PlanInput;
    onChange: (input: PlanInput) => void;
}

export default function Step1BasicInfo({ input, onChange }: Props) {
    const { basic } = input;

    const updateBasic = (updates: Partial<typeof basic>) => {
        onChange({ ...input, basic: { ...basic, ...updates } });
    };

    const updateChild = (index: number, age: number) => {
        const newChildren = [...basic.children];
        newChildren[index] = { age };
        updateBasic({ children: newChildren });
    };

    const setChildCount = (count: number) => {
        const current = basic.children;
        if (count > current.length) {
            const newChildren: Child[] = [...current];
            for (let i = current.length; i < count; i++) {
                newChildren.push({ age: 0 });
            }
            updateBasic({ children: newChildren });
        } else {
            updateBasic({ children: current.slice(0, count) });
        }
    };

    return (
        <div className="space-y-6">
            {/* 現在の年齢 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    現在の年齢
                </label>
                <input
                    type="number"
                    min={18}
                    max={80}
                    value={basic.currentAge}
                    onChange={(e) => updateBasic({ currentAge: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
            </div>

            {/* 性別 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    性別
                </label>
                <div className="flex gap-3">
                    {(['男性', '女性', 'その他'] as const).map((g) => (
                        <button
                            key={g}
                            onClick={() => updateBasic({ gender: g })}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all cursor-pointer ${basic.gender === g
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            {/* 配偶者の有無 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    配偶者の有無
                </label>
                <div className="flex gap-3">
                    {[
                        { label: 'あり', value: true },
                        { label: 'なし', value: false },
                    ].map(({ label, value }) => (
                        <button
                            key={label}
                            onClick={() => updateBasic({ hasSpouse: value })}
                            className={`flex-1 py-3 rounded-xl font-medium transition-all cursor-pointer ${basic.hasSpouse === value
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 配偶者の年齢 */}
            {basic.hasSpouse && (
                <div className="animate-in slide-in-from-top-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        配偶者の年齢
                    </label>
                    <input
                        type="number"
                        min={18}
                        max={80}
                        value={basic.spouseAge}
                        onChange={(e) => updateBasic({ spouseAge: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            )}

            {/* 子どもの人数 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    子どもの人数
                </label>
                <div className="flex gap-2">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            onClick={() => setChildCount(n)}
                            className={`w-12 h-12 rounded-xl font-medium transition-all cursor-pointer ${basic.children.length === n
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            {/* 各子どもの年齢 */}
            {basic.children.length > 0 && (
                <div className="space-y-3">
                    {basic.children.map((child, i) => (
                        <div key={i}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {i + 1}人目の年齢
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={30}
                                value={child.age}
                                onChange={(e) => updateChild(i, Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
