// STEP 3: 支出入力
import { useState } from 'react';
import type { PlanInput, LifeEvent, LifeEventPreset } from '../../types/plan';
import { PRESET_COSTS } from '../../types/plan';

interface Props {
    input: PlanInput;
    onChange: (input: PlanInput) => void;
}

const PRESETS: LifeEventPreset[] = ['住宅購入', '車購入', '子ども教育費', '結婚', 'リフォーム'];

export default function Step3Expense({ input, onChange }: Props) {
    const { expense, basic } = input;
    const [newEvent, setNewEvent] = useState({ name: '', age: basic.currentAge + 5, cost: 0 });

    const update = (updates: Partial<typeof expense>) => {
        onChange({ ...input, expense: { ...expense, ...updates } });
    };

    const addEvent = () => {
        if (!newEvent.name || newEvent.cost <= 0) return;
        const event: LifeEvent = {
            id: Date.now().toString(),
            ...newEvent,
        };
        update({ lifeEvents: [...expense.lifeEvents, event] });
        setNewEvent({ name: '', age: basic.currentAge + 5, cost: 0 });
    };

    const addPreset = (preset: LifeEventPreset) => {
        const event: LifeEvent = {
            id: Date.now().toString(),
            name: preset,
            age: basic.currentAge + 5,
            cost: PRESET_COSTS[preset],
        };
        update({ lifeEvents: [...expense.lifeEvents, event] });
    };

    const removeEvent = (id: string) => {
        update({ lifeEvents: expense.lifeEvents.filter((e) => e.id !== id) });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        毎月の生活費 <span className="text-xs text-gray-400">万円（住居費除く）</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={expense.monthlyLiving}
                        onChange={(e) => update({ monthlyLiving: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        住居費 <span className="text-xs text-gray-400">万円/月</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        step={0.5}
                        value={expense.monthlyHousing}
                        onChange={(e) => update({ monthlyHousing: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        保険料 <span className="text-xs text-gray-400">万円/月</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={expense.monthlyInsurance}
                        onChange={(e) => update({ monthlyInsurance: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        インフレ率 <span className="text-xs text-gray-400">%</span>
                    </label>
                    <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                        value={expense.inflationRate}
                        onChange={(e) => update({ inflationRate: Number(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* ライフイベント */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">ライフイベント</h3>

                {/* プリセットボタン */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => addPreset(preset)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-accent-500/10 text-accent-600 dark:text-accent-400 hover:bg-accent-500/20 transition-all cursor-pointer"
                        >
                            + {preset}
                        </button>
                    ))}
                </div>

                {/* カスタムイベント追加 */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="イベント名"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="年齢"
                        value={newEvent.age}
                        onChange={(e) => setNewEvent({ ...newEvent, age: Number(e.target.value) })}
                        className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="費用(万円)"
                        value={newEvent.cost || ''}
                        onChange={(e) => setNewEvent({ ...newEvent, cost: Number(e.target.value) })}
                        className="w-28 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                        onClick={addEvent}
                        className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-all cursor-pointer"
                    >
                        追加
                    </button>
                </div>

                {/* 登録済みイベント一覧 */}
                {expense.lifeEvents.length > 0 && (
                    <div className="space-y-2">
                        {expense.lifeEvents.map((event) => (
                            <div
                                key={event.id}
                                className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                            >
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{event.name}</span>
                                    <span className="text-gray-500">{event.age}歳</span>
                                    <span className="text-primary-600 dark:text-primary-400 font-medium">{event.cost}万円</span>
                                </div>
                                <button
                                    onClick={() => removeEvent(event.id)}
                                    className="text-red-400 hover:text-red-600 text-lg cursor-pointer"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
