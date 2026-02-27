import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    SimulationInput,
    BasicInfo,
    IncomeInfo,
    ExpenseInfo,
    InvestmentInfo,
    ScenarioConfig,
    SimulationResult
} from '@/types/plan';
import { DEFAULT_INPUT } from '@/constants/defaults';
import { runSimulation as calculateSimulation } from '@/lib/engine/simulator';

interface PlanStore {
    // 入力データ
    input: SimulationInput;

    // 現在のステップ (0-indexed)
    currentStep: number;

    // シミュレーション結果
    result: SimulationResult | null;
    isSimulating: boolean;

    // セクション別更新
    updateBasicInfo: (data: Partial<BasicInfo>) => void;
    updateIncome: (data: Partial<IncomeInfo>) => void;
    updateExpense: (data: Partial<ExpenseInfo>) => void;
    updateInvestment: (data: Partial<InvestmentInfo>) => void;
    updateScenario: (data: Partial<ScenarioConfig>) => void;

    // 全体更新
    setInput: (data: Partial<SimulationInput>) => void;

    // ナビゲーション
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    // シミュレーション実行
    runSimulation: () => Promise<void>;

    // リセット
    reset: () => void;
}

export const TOTAL_STEPS = 5;

export const usePlanStore = create<PlanStore>()(
    persist(
        (set) => ({
            input: DEFAULT_INPUT,
            currentStep: 0,
            result: null,
            isSimulating: false,

            updateBasicInfo: (data) =>
                set((state) => ({
                    input: {
                        ...state.input,
                        basicInfo: { ...state.input.basicInfo, ...data },
                    },
                })),

            updateIncome: (data) =>
                set((state) => ({
                    input: {
                        ...state.input,
                        income: { ...state.input.income, ...data },
                    },
                })),

            updateExpense: (data) =>
                set((state) => ({
                    input: {
                        ...state.input,
                        expense: { ...state.input.expense, ...data },
                    },
                })),

            updateInvestment: (data) =>
                set((state) => ({
                    input: {
                        ...state.input,
                        investment: { ...state.input.investment, ...data },
                    },
                })),

            updateScenario: (data) =>
                set((state) => ({
                    input: {
                        ...state.input,
                        scenario: { ...state.input.scenario, ...data },
                    },
                })),

            setInput: (data) =>
                set((state) => ({
                    input: { ...state.input, ...data },
                })),

            setStep: (step) => set({ currentStep: step }),

            nextStep: () =>
                set((state) => ({
                    currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1),
                })),

            prevStep: () =>
                set((state) => ({
                    currentStep: Math.max(state.currentStep - 1, 0),
                })),

            runSimulation: async () => {
                set({ isSimulating: true });
                // メインスレッドのブロックを避けるための遅延
                await new Promise((resolve) => setTimeout(resolve, 100));

                set((state) => {
                    const result = calculateSimulation(state.input);
                    return { result, isSimulating: false };
                });
            },

            reset: () => set({ input: DEFAULT_INPUT, currentStep: 0, result: null }),
        }),
        {
            name: 'lifeplan-storage',
        }
    )
);
