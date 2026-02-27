// シミュレーション計算エンジン
import type { PlanInput, YearlyRecord, SimulationResult } from '../types/plan';
import { getAnnualEducationCost } from './education';

/**
 * メインのシミュレーション実行関数
 * 現在年齢からシミュレーション終了年齢まで年次ループで計算
 */
export function runSimulation(input: PlanInput): SimulationResult {
    const { basic, income, expense, assets, risk } = input;
    const records: YearlyRecord[] = [];

    let currentAssets = assets.currentAssets;
    let idecoBalance = 0;
    let mortgageRemaining = assets.mortgageBalance;
    let mortgageYearsLeft = assets.mortgageYearsLeft;

    let totalIncome = 0;
    let totalExpense = 0;
    let peakAssets = currentAssets;
    let depletionAge: number | null = null;

    // 住宅ローンの年間返済額を計算（元利均等返済）
    const annualMortgagePayment = calculateAnnualMortgagePayment(
        assets.mortgageBalance,
        assets.mortgageRate,
        assets.mortgageYearsLeft
    );

    for (let age = basic.currentAge; age <= risk.simulationEndAge; age++) {
        const yearIndex = age - basic.currentAge;
        const events: string[] = [];

        // === 収入計算 ===
        // 本人の給与（退職年齢まで）
        let salary = 0;
        if (age < income.retirementAge) {
            salary = income.annualIncome * Math.pow(1 + income.raiseRate / 100, yearIndex);
            salary += income.bonus; // ボーナス追加
        }

        // 退職金（退職年齢の年に一括）
        if (age === income.retirementAge) {
            salary += income.severancePay;
            events.push('退職');
        }

        // 配偶者の給与
        let spouseSalary = 0;
        if (basic.hasSpouse && age < income.retirementAge) {
            spouseSalary = income.spouseIncome * Math.pow(1 + income.spouseRaiseRate / 100, yearIndex);
        }

        // 副業収入（退職年齢まで）
        const sideInc = age < income.retirementAge ? income.sideIncome : 0;

        // 年金（受給開始年齢以降）
        let pension = 0;
        if (age >= income.pensionStartAge) {
            pension = income.monthlyPension * 12;
            if (age === income.pensionStartAge) {
                events.push('年金受給開始');
            }
        }

        const yearlyIncome = salary + spouseSalary + sideInc + pension;

        // === 支出計算 ===
        // インフレ適用
        const inflationFactor = Math.pow(1 + expense.inflationRate / 100, yearIndex);

        // 生活費（退職後は設定した老後生活費を使用するが、住居費と保険は別途計算）
        let livingExp: number;
        if (age >= income.retirementAge) {
            livingExp = risk.retirementMonthlyExpense * 12 * inflationFactor;
        } else {
            livingExp = expense.monthlyLiving * 12 * inflationFactor;
        }

        // 住居費
        let housingExp = 0;
        if (mortgageYearsLeft > 0 && mortgageRemaining > 0) {
            housingExp = annualMortgagePayment;
            mortgageRemaining -= (annualMortgagePayment - mortgageRemaining * (assets.mortgageRate / 100));
            mortgageYearsLeft--;
            if (mortgageYearsLeft <= 0) {
                mortgageRemaining = 0;
                events.push('住宅ローン完済');
            }
        } else {
            // ローンがない場合は家賃として
            housingExp = expense.monthlyHousing * 12 * inflationFactor;
        }

        // 保険料
        const insuranceExp = expense.monthlyInsurance * 12 * inflationFactor;

        // 教育費（子どもの年齢に応じて自動計算）
        let educationExp = 0;
        for (const child of basic.children) {
            const childAge = child.age + yearIndex;
            educationExp += getAnnualEducationCost(childAge);
        }

        // ライフイベント費用
        let eventExp = 0;
        for (const event of expense.lifeEvents) {
            if (event.age === age) {
                eventExp += event.cost;
                events.push(event.name);
            }
        }

        const yearlyExpense = livingExp + housingExp + insuranceExp + educationExp + eventExp;

        // === 収支差分 ===
        const netCashflow = yearlyIncome - yearlyExpense;

        // === 投資収益 ===
        // 積立投資額（毎月）
        const yearlyInvestment = age < income.retirementAge
            ? assets.monthlyInvestment * 12
            : 0;

        // 資産に対する運用益
        const investmentGain = currentAssets * (assets.expectedReturn / 100);

        // iDeCo計算（60歳まで積立、以降は運用のみ）
        if (age < 60) {
            idecoBalance += assets.monthlyIdeco * 12;
        }
        idecoBalance *= (1 + assets.idecoReturn / 100);

        // 資産更新
        currentAssets = currentAssets + netCashflow + investmentGain + yearlyInvestment;

        // 60歳でiDeCo受取（資産に編入）
        if (age === 60 && idecoBalance > 0) {
            currentAssets += idecoBalance;
            events.push('iDeCo受取');
            idecoBalance = 0;
        }

        // 統計更新
        totalIncome += yearlyIncome;
        totalExpense += yearlyExpense;

        if (currentAssets > peakAssets) {
            peakAssets = currentAssets;
        }

        if (currentAssets < 0 && depletionAge === null) {
            depletionAge = age;
        }

        records.push({
            age,
            income: Math.round(yearlyIncome),
            salary: Math.round(salary),
            spouseSalary: Math.round(spouseSalary),
            pension: Math.round(pension),
            sideIncome: Math.round(sideInc),
            expense: Math.round(yearlyExpense),
            livingExpense: Math.round(livingExp),
            housingExpense: Math.round(housingExp),
            insuranceExpense: Math.round(insuranceExp),
            educationExpense: Math.round(educationExp),
            eventExpense: Math.round(eventExp),
            netCashflow: Math.round(netCashflow),
            investmentGain: Math.round(investmentGain + yearlyInvestment),
            idecoBalance: Math.round(idecoBalance),
            assets: Math.round(currentAssets),
            events,
        });
    }

    return {
        records,
        totalIncome: Math.round(totalIncome),
        totalExpense: Math.round(totalExpense),
        peakAssets: Math.round(peakAssets),
        depletionAge,
        finalAssets: Math.round(currentAssets),
    };
}

/**
 * 元利均等返済の年間返済額を計算
 */
function calculateAnnualMortgagePayment(
    balance: number,
    annualRate: number,
    years: number
): number {
    if (balance <= 0 || years <= 0) return 0;
    if (annualRate <= 0) return balance / years;

    const r = annualRate / 100;
    const payment = balance * r * Math.pow(1 + r, years) / (Math.pow(1 + r, years) - 1);
    return Math.round(payment);
}
