// Zustand ストア — 全入力データの状態管理（localStorage永続化）

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlanInput, BasicInfo, IncomeInfo, ExpenseInfo, InvestmentInfo, ExternalEnv, SimulationConfig } from '@/types/plan';
import { DEFAULT_INPUT } from '@/constants/defaults';

interface PlanStore {
    input: PlanInput;
    setBasic: (basic: BasicInfo) => void;
    setIncome: (income: IncomeInfo) => void;
    setExpense: (expense: ExpenseInfo) => void;
    setInvestment: (investment: InvestmentInfo) => void;
    setEnvironment: (env: ExternalEnv) => void;
    setConfig: (config: SimulationConfig) => void;
    updateInput: (partial: Partial<PlanInput>) => void;
    reset: () => void;
}

export const usePlanStore = create<PlanStore>()(
    persist(
        (set) => ({
            input: DEFAULT_INPUT,
            setBasic: (basic) => set((s) => ({ input: { ...s.input, basic } })),
            setIncome: (income) => set((s) => ({ input: { ...s.input, income } })),
            setExpense: (expense) => set((s) => ({ input: { ...s.input, expense } })),
            setInvestment: (investment) => set((s) => ({ input: { ...s.input, investment } })),
            setEnvironment: (environment) => set((s) => ({ input: { ...s.input, environment } })),
            setConfig: (config) => set((s) => ({ input: { ...s.input, config } })),
            updateInput: (partial) => set((s) => ({ input: { ...s.input, ...partial } })),
            reset: () => set({ input: DEFAULT_INPUT }),
        }),
        { name: 'life-plan-input' }
    )
);
