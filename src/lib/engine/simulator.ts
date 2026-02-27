// メインシミュレーションエンジン

import type {
    PlanInput, YearlyRecord, ScenarioResult, SimulationResult, ScenarioType,
} from '@/types/plan';
import { CURRENT_YEAR, SCENARIO_MODIFIERS } from '@/constants/defaults';
import { getAnnualEducationCost } from '@/constants/education';
import { calculateIncomeTax, calculateResidentTax } from './tax';
import { calculateSocialInsurance } from './social-insurance';
import { calculateAnnualMortgagePayment } from './mortgage';
import { calculateInvestmentReturn } from './investment';
import { runMonteCarlo } from './monte-carlo';

/**
 * 現在の年齢を計算
 */
function getAge(birthYear: number, birthMonth: number, targetYear: number): number {
    // 簡易計算（月は考慮しない）
    void birthMonth;
    return targetYear - birthYear;
}

/**
 * 単一シミュレーション実行（年次リターンを外部から指定可能）
 */
export function runSingleSimulation(
    input: PlanInput,
    yearlyReturns?: number[]
): ScenarioResult {
    const { basic, income, expense, investment, environment, config } = input;
    const startAge = getAge(basic.birthYear, basic.birthMonth, CURRENT_YEAR);
    const endAge = config.endAge;
    const records: YearlyRecord[] = [];

    // 総資産の初期値
    let totalAssets = investment.assets.reduce((sum, a) => sum + a.balance, 0);
    let corpPensionBalance = income.corporatePension.balance;

    const scenarioMod = SCENARIO_MODIFIERS[config.scenario];
    const inflationRate = (scenarioMod.generalInflation ?? environment.generalInflation) / 100;
    const wageGrowth = (scenarioMod.wageGrowthRate ?? environment.wageGrowthRate) / 100;
    const returnModifier = scenarioMod.returnModifier;

    let totalIncome = 0;
    let totalExpense = 0;
    let peakAssets = totalAssets;
    let depletionAge: number | null = null;

    for (let age = startAge; age <= endAge; age++) {
        const yearIndex = age - startAge;
        const year = CURRENT_YEAR + yearIndex;
        const events: string[] = [];

        // === 収入計算（税込） ===
        let salary = 0;
        if (age < income.employment.retirementAge) {
            salary = income.employment.annualIncome * Math.pow(1 + wageGrowth, yearIndex);
        } else if (age < income.employment.reemploymentEndAge) {
            salary = income.employment.reemploymentIncome;
            if (age === income.employment.retirementAge) events.push('定年退職');
        }

        // 退職金
        if (age === income.employment.retirementAge) {
            salary += income.employment.severancePay;
        }

        // 配偶者給与
        let spouseSalary = 0;
        if (basic.hasSpouse) {
            const spouseAge = getAge(basic.spouseBirthYear, basic.spouseBirthMonth, year);
            if (spouseAge < income.spouseEmployment.retirementAge) {
                spouseSalary = income.spouseEmployment.annualIncome * Math.pow(1 + wageGrowth, yearIndex);
            } else if (spouseAge < income.spouseEmployment.reemploymentEndAge) {
                spouseSalary = income.spouseEmployment.reemploymentIncome;
            }
        }

        // 年金
        let pensionIncome = 0;
        if (age >= income.pension.startAge) {
            pensionIncome += income.pension.monthlyAmount * 12;
            if (age === income.pension.startAge) events.push('年金受給開始');
        }
        if (basic.hasSpouse) {
            const spouseAge = getAge(basic.spouseBirthYear, basic.spouseBirthMonth, year);
            if (spouseAge >= income.spousePension.startAge) {
                pensionIncome += income.spousePension.monthlyAmount * 12;
            }
        }

        // 企業年金/iDeCo
        if (age < 60) {
            corpPensionBalance += income.corporatePension.monthlyContribution * 12;
            corpPensionBalance *= (1 + income.corporatePension.expectedReturn / 100);
        }
        if (age === 60 && corpPensionBalance > 0) {
            totalAssets += corpPensionBalance;
            events.push('企業年金/iDeCo受取');
            corpPensionBalance = 0;
        }

        // その他
        let otherInc = income.otherIncome.realEstateIncome + income.otherIncome.dividendIncome;
        if (age === income.otherIncome.inheritance.expectedAge && income.otherIncome.inheritance.amount > 0) {
            otherInc += income.otherIncome.inheritance.amount;
            events.push('相続');
        }

        const grossIncome = salary + spouseSalary + pensionIncome + otherInc;

        // === 税・社保計算 ===
        const childrenAges = basic.children.map(c => getAge(c.birthYear, c.birthMonth, year));
        const si = calculateSocialInsurance(salary, age);
        const spouseSi = basic.hasSpouse ? calculateSocialInsurance(spouseSalary,
            getAge(basic.spouseBirthYear, basic.spouseBirthMonth, year)) : 0;
        const totalSI = si + spouseSi;

        const incomeTax = calculateIncomeTax(salary, basic.hasSpouse, childrenAges, si) +
            (basic.hasSpouse ? calculateIncomeTax(spouseSalary, false, [], spouseSi) : 0);
        const residentTax = calculateResidentTax(salary, basic.hasSpouse, childrenAges, si) +
            (basic.hasSpouse ? calculateResidentTax(spouseSalary, false, [], spouseSi) : 0);

        const netIncome = grossIncome - incomeTax - residentTax - totalSI;

        // === 支出計算 ===
        const inflFactor = Math.pow(1 + inflationRate, yearIndex);

        // 生活費
        const living = expense.living;
        const monthlyLiving = living.food + living.utilities + living.communication +
            living.dailyGoods + living.clothing + living.social +
            living.transportation + living.miscellaneous;
        const livingExp = monthlyLiving * 12 * inflFactor;

        // 住居費
        let housingExp = 0;
        if (expense.housing.isOwner) {
            const mortgageYearIndex = age - expense.housing.mortgage.startAge;
            housingExp = calculateAnnualMortgagePayment(expense.housing.mortgage, mortgageYearIndex);
            housingExp += expense.housing.managementFee * 12;
            housingExp += expense.housing.propertyTax;
            // リフォーム
            for (const r of expense.housing.renovations) {
                if (r.age === age) {
                    housingExp += r.cost;
                    events.push('リフォーム');
                }
            }
            if (mortgageYearIndex === expense.housing.mortgage.termYears) {
                events.push('住宅ローン完済');
            }
        } else {
            housingExp = expense.housing.monthlyRent * 12 * inflFactor;
        }

        // 教育費
        let educationExp = 0;
        for (const child of basic.children) {
            const childAge = getAge(child.birthYear, child.birthMonth, year);
            const edInflFactor = Math.pow(1 + environment.educationInflation / 100, yearIndex);
            educationExp += getAnnualEducationCost(childAge, child.educationPolicy) * edInflFactor;
        }

        // 保険
        const insuranceExp = (expense.insurance.lifeInsurance + expense.insurance.medicalInsurance +
            expense.insurance.carInsurance) * 12;

        // 自動車
        let carExp = 0;
        if (expense.car.hasCar) {
            carExp = expense.car.annualMaintenance;
            const yearsOwned = yearIndex;
            if (expense.car.purchaseCycleYears > 0 && yearsOwned % expense.car.purchaseCycleYears === 0 && yearIndex > 0) {
                carExp += expense.car.purchaseCost;
                events.push('車購入');
            }
        }

        // ライフイベント
        let eventExp = 0;
        for (const ev of expense.lifeEvents) {
            if (ev.age === age) {
                eventExp += ev.cost;
                events.push(ev.name);
            }
        }

        const totalExp = livingExp + housingExp + educationExp + insuranceExp + carExp + eventExp;

        // === 投資収益 ===
        const returnRate = yearlyReturns ? yearlyReturns[yearIndex] ?? 0 : undefined;
        let investGain: number;
        if (returnRate !== undefined) {
            investGain = Math.round(totalAssets * returnRate / 100 * 100) / 100;
        } else {
            investGain = calculateInvestmentReturn(totalAssets, investment.allocation, returnModifier);
        }

        // 積立
        const monthlyInv = age < income.employment.retirementAge ? investment.monthlyInvestment * 12 : 0;

        // 収支・資産更新
        const netCashflow = netIncome - totalExp;
        totalAssets = totalAssets + netCashflow + investGain + monthlyInv;

        totalIncome += grossIncome;
        totalExpense += totalExp;
        if (totalAssets > peakAssets) peakAssets = totalAssets;
        if (totalAssets < 0 && depletionAge === null) depletionAge = age;

        records.push({
            age,
            year,
            grossIncome: Math.round(grossIncome),
            salary: Math.round(salary),
            spouseSalary: Math.round(spouseSalary),
            pensionIncome: Math.round(pensionIncome),
            investmentIncome: Math.round(investGain + monthlyInv),
            otherIncome: Math.round(otherInc),
            incomeTax: Math.round(incomeTax),
            residentTax: Math.round(residentTax),
            socialInsurance: Math.round(totalSI),
            netIncome: Math.round(netIncome),
            totalExpense: Math.round(totalExp),
            livingExpense: Math.round(livingExp),
            housingExpense: Math.round(housingExp),
            educationExpense: Math.round(educationExp),
            insuranceExpense: Math.round(insuranceExp),
            carExpense: Math.round(carExp),
            eventExpense: Math.round(eventExp),
            netCashflow: Math.round(netCashflow),
            totalAssets: Math.round(totalAssets),
            events,
        });
    }

    return {
        scenario: config.scenario,
        records,
        totalIncome: Math.round(totalIncome),
        totalExpense: Math.round(totalExpense),
        peakAssets: Math.round(peakAssets),
        depletionAge,
        finalAssets: Math.round(totalAssets),
    };
}

/**
 * 3シナリオ + モンテカルロの全結果を返す
 */
export function runFullSimulation(input: PlanInput): SimulationResult {
    // 基本シナリオ
    const baseResult = runSingleSimulation({ ...input, config: { ...input.config, scenario: '基本' } });
    const optimisticResult = runSingleSimulation({ ...input, config: { ...input.config, scenario: '楽観' } });
    const pessimisticResult = runSingleSimulation({ ...input, config: { ...input.config, scenario: '悲観' } });

    // モンテカルロ
    const monteCarlo = runMonteCarlo(input, input.config.monteCarloTrials);

    return { baseResult, optimisticResult, pessimisticResult, monteCarlo };
}
