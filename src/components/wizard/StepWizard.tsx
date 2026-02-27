import { usePlanStore, TOTAL_STEPS } from '@/stores/plan-store';
import { Button } from '@/components/ui/button';
import { BasicInfoForm } from '@/components/wizard/BasicInfoForm';
import { IncomeForm } from '@/components/wizard/IncomeForm';
import { ExpenseForm } from '@/components/wizard/ExpenseForm';
import { InvestmentForm } from '@/components/wizard/InvestmentForm';
import { ScenarioConfigForm } from '@/components/wizard/ScenarioConfigForm';
import { Check } from 'lucide-react';

const STEP_LABELS = [
    { title: '基本情報', description: '年齢・家族構成' },
    { title: '収入', description: '給与・年金・副業' },
    { title: '支出', description: '生活費・住居・教育' },
    { title: '資産・運用', description: '貯蓄・投資・NISA' },
    { title: 'シナリオ', description: 'インフレ率・リターン' },
];

function StepIndicator() {
    const { currentStep, setStep } = usePlanStore();

    return (
        <div className="w-full mb-8">
            {/* Desktop */}
            <div className="hidden md:flex items-center justify-between">
                {STEP_LABELS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isClickable = index <= currentStep;

                    return (
                        <div key={index} className="flex items-center flex-1 last:flex-initial">
                            <button
                                onClick={() => isClickable && setStep(index)}
                                disabled={!isClickable}
                                className={`
                  flex items-center gap-2 group
                  ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                `}
                            >
                                <div
                                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full 
                    text-sm font-semibold transition-all duration-200
                    ${isCompleted
                                            ? 'bg-primary text-primary-foreground shadow-md'
                                            : isCurrent
                                                ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20'
                                                : 'bg-muted text-muted-foreground'
                                        }
                  `}
                                >
                                    {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className={`text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                </div>
                            </button>
                            {index < STEP_LABELS.length - 1 && (
                                <div
                                    className={`
                    flex-1 h-0.5 mx-3 transition-colors duration-200
                    ${isCompleted ? 'bg-primary' : 'bg-muted'}
                  `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile */}
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                        Step {currentStep + 1} / {TOTAL_STEPS}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {STEP_LABELS[currentStep].title}
                    </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function StepContent() {
    const { currentStep } = usePlanStore();

    switch (currentStep) {
        case 0:
            return <BasicInfoForm />;
        case 1:
            return <IncomeForm />;
        case 2:
            return <ExpenseForm />;
        case 3:
            return <InvestmentForm />;
        case 4:
            return <ScenarioConfigForm />;
        default:
            return null;
    }
}

export function StepWizard() {
    const { currentStep, nextStep, prevStep } = usePlanStore();

    return (
        <div className="w-full max-w-3xl mx-auto">
            <StepIndicator />

            <div className="min-h-[400px]">
                <StepContent />
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-6"
                >
                    ← 戻る
                </Button>

                {currentStep < TOTAL_STEPS - 1 ? (
                    <Button onClick={nextStep} className="px-6">
                        次へ →
                    </Button>
                ) : (
                    <Button
                        onClick={usePlanStore.getState().runSimulation}
                        className="px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                        シミュレーション実行
                    </Button>
                )}
            </div>
        </div>
    );
}
