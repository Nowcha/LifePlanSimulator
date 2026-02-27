// デフォルト入力値・シナリオパラメータ

import type { PlanInput, ScenarioType, ExternalEnv } from '@/types/plan';

/** 現在の年（シミュレーション基準年） */
export const CURRENT_YEAR = 2025;

/** デフォルト入力値 */
export const DEFAULT_INPUT: PlanInput = {
    basic: {
        name: '',
        birthYear: 1995,
        birthMonth: 1,
        gender: '男性',
        hasSpouse: false,
        spouseBirthYear: 1997,
        spouseBirthMonth: 1,
        children: [],
        region: '関東',
        lifeExpectancy: 87,
        spouseLifeExpectancy: 93,
    },
    income: {
        employment: {
            annualIncome: 500,
            raiseRate: 1.5,
            bonusMonths: 4,
            severancePay: 1500,
            retirementAge: 65,
            reemploymentIncome: 300,
            reemploymentEndAge: 70,
        },
        spouseEmployment: {
            annualIncome: 0,
            raiseRate: 1.0,
            bonusMonths: 2,
            severancePay: 500,
            retirementAge: 65,
            reemploymentIncome: 200,
            reemploymentEndAge: 70,
        },
        pension: {
            system: '厚生年金',
            startAge: 65,
            monthlyAmount: 15,
        },
        spousePension: {
            system: '国民年金',
            startAge: 65,
            monthlyAmount: 6.5,
        },
        corporatePension: {
            balance: 0,
            monthlyContribution: 2.3,
            expectedReturn: 3.0,
        },
        otherIncome: {
            realEstateIncome: 0,
            dividendIncome: 0,
            inheritance: {
                expectedAge: 60,
                amount: 0,
            },
        },
    },
    expense: {
        living: {
            food: 5,
            utilities: 1.5,
            communication: 1,
            dailyGoods: 0.5,
            clothing: 1,
            social: 1.5,
            transportation: 1,
            miscellaneous: 1.5,
        },
        housing: {
            isOwner: false,
            monthlyRent: 8,
            mortgage: {
                principal: 3500,
                interestRate: 1.0,
                termYears: 35,
                method: '元利均等',
                startAge: 35,
            },
            managementFee: 1.5,
            propertyTax: 12,
            renovations: [],
        },
        insurance: {
            lifeInsurance: 1.5,
            medicalInsurance: 0.5,
            carInsurance: 0.5,
        },
        car: {
            hasCar: false,
            purchaseCycleYears: 7,
            purchaseCost: 250,
            annualMaintenance: 30,
        },
        lifeEvents: [],
    },
    investment: {
        assets: [
            { type: '預金', balance: 300 },
        ],
        allocation: {
            stockRatio: 50,
            bondRatio: 30,
            cashRatio: 20,
            stockReturn: 5.0,
            bondReturn: 2.0,
            cashReturn: 0.1,
            stockStdDev: 15,
            bondStdDev: 5,
        },
        monthlyInvestment: 3,
        nisaAnnual: 120,
        withdrawalStartAge: 65,
        withdrawalMethod: '定率',
        withdrawalAmount: 200,
        withdrawalRate: 4,
    },
    environment: {
        generalInflation: 2.0,
        educationInflation: 2.5,
        medicalInflation: 3.0,
        wageGrowthRate: 1.5,
        depositRate: 0.02,
    },
    config: {
        endAge: 100,
        scenario: '基本',
        monteCarloTrials: 1000,
    },
};

/** シナリオ別の環境パラメータ修正値 */
export const SCENARIO_MODIFIERS: Record<ScenarioType, Partial<ExternalEnv> & { returnModifier: number }> = {
    '楽観': {
        generalInflation: 1.0,
        wageGrowthRate: 2.5,
        returnModifier: 1.5,  // リターンを1.5倍に
    },
    '基本': {
        returnModifier: 1.0,
    },
    '悲観': {
        generalInflation: 3.0,
        wageGrowthRate: 0.5,
        returnModifier: 0.5,  // リターンを0.5倍に
    },
};
