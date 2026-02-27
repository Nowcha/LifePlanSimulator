// ステップウィザード（入力フォームのナビゲーション）
import { useState } from 'react';
import type { PlanInput } from '../../types/plan';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Income from './Step2Income';
import Step3Expense from './Step3Expense';
import Step4Assets from './Step4Assets';
import Step5Risk from './Step5Risk';

interface StepWizardProps {
    input: PlanInput;
    onChange: (input: PlanInput) => void;
    onSimulate: () => void;
}

const STEP_TITLES = [
    '基本情報',
    '収入',
    '支出',
    '資産・投資',
    'リスク設定',
];

export default function StepWizard({ input, onChange, onSimulate }: StepWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4));
    const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

    const handleSimulate = () => {
        onSimulate();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <Step1BasicInfo input={input} onChange={onChange} />;
            case 1:
                return <Step2Income input={input} onChange={onChange} />;
            case 2:
                return <Step3Expense input={input} onChange={onChange} />;
            case 3:
                return <Step4Assets input={input} onChange={onChange} />;
            case 4:
                return <Step5Risk input={input} onChange={onChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* ステップインジケーター */}
            <div className="flex items-center justify-center mb-8 gap-1">
                {STEP_TITLES.map((title, i) => (
                    <div key={i} className="flex items-center">
                        <button
                            onClick={() => setCurrentStep(i)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${i === currentStep
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                    : i < currentStep
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                }`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === currentStep
                                    ? 'bg-white/20'
                                    : i < currentStep
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                }`}>
                                {i < currentStep ? '✓' : i + 1}
                            </span>
                            <span className="hidden sm:inline">{title}</span>
                        </button>
                        {i < 4 && (
                            <div className={`w-4 sm:w-8 h-0.5 mx-1 ${i < currentStep ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* ステップタイトル */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                STEP {currentStep + 1}: {STEP_TITLES[currentStep]}
            </h2>

            {/* ステップ内容 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                {renderStep()}
            </div>

            {/* ナビゲーションボタン */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={goPrev}
                    disabled={currentStep === 0}
                    className="px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                >
                    ← 前へ
                </button>

                {currentStep < 4 ? (
                    <button
                        onClick={goNext}
                        className="px-6 py-3 rounded-xl font-medium bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-500/30 transition-all cursor-pointer"
                    >
                        次へ →
                    </button>
                ) : (
                    <button
                        onClick={handleSimulate}
                        className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-lg shadow-primary-500/30 transition-all cursor-pointer text-lg"
                    >
                        📊 シミュレーション実行
                    </button>
                )}
            </div>
        </div>
    );
}
