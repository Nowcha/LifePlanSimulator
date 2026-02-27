import type { SimulationInput } from '@/types/plan';

/**
 * デフォルト値 — 日本の平均的な値
 */
export const DEFAULT_INPUT: SimulationInput = {
    basicInfo: {
        currentAge: 30,
        gender: 'male',
        simulationEndAge: 90,
        hasSpouse: false,
        spouseAge: 28,
        childrenCount: 0,
        children: [],
        futureBirth: {
            enabled: false,
            count: 1,
            yearsFromNow: 3,
        },
    },

    income: {
        selfWorkPattern: 'fulltime',
        annualIncome: 450,
        salaryGrowthRate: 1.5,
        salaryGrowthCurve: 'seniority',
        retirementAge: 65,
        reemployment: {
            enabled: true,
            annualIncome: 300,
            endAge: 70,
        },
        selfLeaveReturnAge: 35,
        spouseWorkPattern: 'fulltime',
        spouseAnnualIncome: 0,
        spouseSalaryGrowthRate: 1.5,
        spouseSalaryGrowthCurve: 'seniority',
        spouseRetirementAge: 65,
        spouseReemployment: {
            enabled: true,
            annualIncome: 150,
            endAge: 70,
        },
        spouseLeaveReturnAge: 35,
        sideJobIncome: 0,
        retirementBonus: 1500,
        spouseSideJobIncome: 0,
        spouseRetirementBonus: 0,
        selfPension: {
            startAge: 65,
            annualAmount: 0, // 0 = 自動計算
        },
        spousePension: {
            startAge: 65,
            annualAmount: 0, // 0 = 自動計算
        },
    },

    expense: {
        monthlyLivingCost: {
            food: 6,
            utilities: 2.5,
            communication: 1.5,
            dailyNecessities: 2,
            allowanceAndOther: 8,
        },
        customLivingCosts: [],
        housing: {
            type: 'rent',
            monthlyRent: 8,
            renewalCycleYears: 2,
            renewalCost: 8,
            mortgage: {
                monthlyPayment: 10,
                remainingYears: 30,
                interestRate: 1.0,
                remainingBalance: 3000,
            },
            purchasePlan: {
                enabled: false,
                yearsFromNow: 5,
                propertyPrice: 4000,
                downPayment: 500,
                loanInterestRate: 1.0,
                loanPeriod: 35,
            },
        },
        educationPlan: {
            nursery: 'none',
            kindergarten: 'public',
            elementary: 'public',
            juniorHigh: 'public',
            highSchool: 'public',
            university: 'national',
            livingAlone: false,
            birthCost: 10,
        },
        childRelatedCost: {
            monthlyLivingCostPerChild: 3,
        },
        car: {
            enabled: false,
            count: 1,
            replaceCycleYears: 7,
            purchaseCost: 250,
            annualInsurance: 6,
            annualTax: 4,
            monthlyParking: 1.5,
            annualMaintenance: 5,
            monthlyGasFuel: 1,
        },
        insurance: {
            self: { life: 1, medical: 0.5, cancer: 0.5, other: 0 },
            spouse: { life: 0, medical: 0, cancer: 0, other: 0 },
        },
        annualTravelLeisure: 20,
        lifeEvents: [],
    },

    investment: {
        selfTotalAssets: {
            savings: 300,
            stocksAndFunds: 100,
            other: 0,
        },
        spouseTotalAssets: {
            savings: 0,
            stocksAndFunds: 0,
            other: 0,
        },
        selfMonthlyInvestment: 3,
        spouseMonthlyInvestment: 0,
        assetAllocation: {
            domesticStocks: 25,
            foreignStocks: 35,
            domesticBonds: 10,
            foreignBonds: 10,
            reit: 10,
            cash: 10,
        },
        selfNisaEnabled: true,
        selfNisaAnnualAmount: 36,
        spouseNisaEnabled: false,
        spouseNisaAnnualAmount: 0,
        selfIdecoMonthly: 2.3,
        spouseIdecoMonthly: 0,
        investmentEndAge: 65,
        expectedReturn: 0, // 0 = 自動計算
        withdrawalMethod: 'fixed_rate',
        debts: [],
    },

    scenario: {
        inflationRate: 1.5,
        returnScenario: 'standard',
        customReturn: 4.0,
        pensionReduction: 'current',
        monteCarlo: {
            enabled: false,
            trials: 1000,
        },
    },
};

/**
 * シナリオ別の期待リターン修正値 (年率%)
 */
export const SCENARIO_RETURNS = {
    optimistic: 6.0,
    standard: 4.0,
    pessimistic: 2.0,
} as const;

/**
 * シナリオ別のリターン標準偏差 (年率%)
 * モンテカルロシミュレーションで使用
 */
export const SCENARIO_VOLATILITY = {
    optimistic: 15.0,
    standard: 12.0,
    pessimistic: 10.0,
} as const;

