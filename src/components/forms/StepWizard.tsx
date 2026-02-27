'use client';
// 6ステップ入力ウィザード

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import BasicInfoForm from './BasicInfoForm';
import IncomeForm from './IncomeForm';
import ExpenseForm from './ExpenseForm';
import InvestmentForm from './InvestmentForm';
import EnvironmentForm from './EnvironmentForm';
import SimulationConfigForm from './SimulationConfigForm';

const STEPS = [
    { title: '基本情報', icon: '👤', component: BasicInfoForm },
    { title: '収入', icon: '💰', component: IncomeForm },
    { title: '支出', icon: '🏠', component: ExpenseForm },
    { title: '投資・運用', icon: '📈', component: InvestmentForm },
    { title: '外部環境', icon: '🌍', component: EnvironmentForm },
    { title: 'シミュレーション設定', icon: '⚙️', component: SimulationConfigForm },
];

interface Props {
    onSimulate: () => void;
}

export default function StepWizard({ onSimulate }: Props) {
    const [step, setStep] = useState(0);
    const StepComponent = STEPS[step].component;

    return (
        <div className="max-w-3xl mx-auto">
            {/* ステップインジケーター */}
            <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto pb-2">
                {STEPS.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setStep(i)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${i === step
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : i < step
                                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                    >
                        <span>{s.icon}</span>
                        <span className="hidden sm:inline">{s.title}</span>
                        <span className="sm:hidden">{i + 1}</span>
                    </button>
                ))}
            </div>

            {/* ステップタイトル */}
            <div className="mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>{STEPS[step].icon}</span>
                    STEP {step + 1}: {STEPS[step].title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {step + 1} / {STEPS.length}
                </p>
            </div>

            {/* フォーム */}
            <div className="mb-8">
                <StepComponent />
            </div>

            {/* ナビゲーション */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                >
                    ← 戻る
                </Button>

                {step < STEPS.length - 1 ? (
                    <Button onClick={() => setStep(step + 1)}>
                        次へ →
                    </Button>
                ) : (
                    <Button onClick={onSimulate} className="bg-green-600 hover:bg-green-700 text-white">
                        📊 シミュレーション実行
                    </Button>
                )}
            </div>
        </div>
    );
}
