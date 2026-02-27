import {
    INCOME_TAX_BRACKETS,
    RESIDENT_TAX_RATE,
    RESIDENT_TAX_FLAT,
    BASIC_DEDUCTION,
    SALARY_DEDUCTION_BRACKETS,
    SPOUSE_DEDUCTION,
    DEPENDENT_DEDUCTIONS,
} from '@/constants/tax';
import {
    HEALTH_INSURANCE_RATE,
    EMPLOYEE_PENSION_RATE,
    EMPLOYMENT_INSURANCE_RATE,
    NURSING_CARE_INSURANCE_RATE,
    NURSING_CARE_START_AGE,
} from '@/constants/social-insurance';

// 金額単位について: 入出力は「万円」ベースで行うことが多いですが、
// 控除テーブルなどは「円」ベースであるため、内部で「円」に変換して計算します。

// 給与所得控除の計算 (単位: 円)
export function calculateSalaryDeduction(salaryYen: number): number {
    for (const bracket of SALARY_DEDUCTION_BRACKETS) {
        if (salaryYen <= bracket.threshold) {
            if ('fixed' in bracket) return bracket.fixed as number;
            if ('base' in bracket) return salaryYen * bracket.rate + (bracket.base as number);
        }
    }
    return 1950000;
}

// 社会保険料の計算 (単位: 円)
export function calculateSocialInsurance(salaryYen: number, age: number): number {
    if (salaryYen <= 0) return 0;

    let rate = HEALTH_INSURANCE_RATE + EMPLOYEE_PENSION_RATE + EMPLOYMENT_INSURANCE_RATE;
    if (age >= NURSING_CARE_START_AGE && age < 65) {
        rate += NURSING_CARE_INSURANCE_RATE;
    }

    return salaryYen * rate;
}

// 所得税の計算 (単位: 円)
export function calculateIncomeTax(taxableIncomeYen: number): number {
    if (taxableIncomeYen <= 0) return 0;

    for (let i = INCOME_TAX_BRACKETS.length - 1; i >= 0; i--) {
        const bracket = INCOME_TAX_BRACKETS[i];
        if (taxableIncomeYen > (i === 0 ? 0 : INCOME_TAX_BRACKETS[i - 1].threshold)) {
            return taxableIncomeYen * bracket.rate - bracket.deduction;
        }
    }
    return 0;
}

// 住民税の計算 (単位: 円)
export function calculateResidentTax(taxableIncomeYen: number): number {
    if (taxableIncomeYen <= 0) return RESIDENT_TAX_FLAT;
    // 住民税の基礎控除等は所得税と若干異なりますが、今回は簡易的に同額の課税所得を適用
    return taxableIncomeYen * RESIDENT_TAX_RATE + RESIDENT_TAX_FLAT;
}

// 公的年金等控除の計算 (単位: 円)
// 簡易版: 65歳未満か以上かで控除額算出（令和2年分以降ベースの概算）
export function calculatePensionDeduction(pensionYen: number, age: number): number {
    if (pensionYen <= 0) return 0;

    if (age < 65) {
        if (pensionYen <= 1300000) return 600000;
        if (pensionYen <= 4100000) return pensionYen * 0.25 + 275000;
        if (pensionYen <= 7700000) return pensionYen * 0.15 + 685000;
        if (pensionYen <= 10000000) return pensionYen * 0.05 + 1455000;
        return pensionYen * 0.05 + 1455000; // 便宜上最大控除の枠を維持
    } else {
        // 65歳以上
        if (pensionYen <= 3300000) return 1100000;
        if (pensionYen <= 4100000) return pensionYen * 0.25 + 275000;
        if (pensionYen <= 7700000) return pensionYen * 0.15 + 685000;
        if (pensionYen <= 10000000) return pensionYen * 0.05 + 1455000;
        return pensionYen * 0.05 + 1455000;
    }
}

export interface TaxCalculationParams {
    salaryIncomeManYen: number; // 額面給与(万円)
    pensionIncomeManYen?: number; // 公的年金等収入(万円)
    age: number;
    hasSpouse: boolean;
    spouseIncomeManYen: number; // 配偶者の年収(万円)
    dependents: { age: number }[]; // 扶養家族の年齢リスト
}

export interface TaxResultManYen {
    socialInsurance: number;
    incomeTax: number;
    residentTax: number;
    netIncome: number;
    details: {
        salaryDeduction: number;
        pensionDeduction: number;
        totalDeductions: number;
        taxableIncome: number;
    };
}

/**
 * 年収と年齢、家族構成から税金・社会保険料および手取額を計算する
 * 戻り値はすべて万円単位
 */
export function calculateTaxes(params: TaxCalculationParams): TaxResultManYen {
    const { salaryIncomeManYen, pensionIncomeManYen = 0, age, hasSpouse, spouseIncomeManYen, dependents } = params;

    const salaryYen = salaryIncomeManYen * 10000;
    const pensionYen = pensionIncomeManYen * 10000;
    const spouseIncomeYen = spouseIncomeManYen * 10000;

    // 社会保険料 (給与と年金それぞれにかかる簡易計算)
    let socialInsuranceYen = calculateSocialInsurance(salaryYen, age);

    // 年金受給時（主に65歳以上）の国民健康保険料・介護保険料等は、簡易的に年金収入の約10%と仮定
    if (pensionYen > 0) {
        socialInsuranceYen += pensionYen * 0.10;
    }

    // 給与所得控除
    const salaryDeductionYen = calculateSalaryDeduction(salaryYen);
    // 雑所得（公的年金等控除）
    const pensionDeductionYen = calculatePensionDeduction(pensionYen, age);

    // 所得（給与所得 ＋ 雑所得）
    const employmentIncomeYen = Math.max(0, salaryYen - salaryDeductionYen);
    const miscellaneousIncomeYen = Math.max(0, pensionYen - pensionDeductionYen);
    const totalIncomeYen = employmentIncomeYen + miscellaneousIncomeYen;

    // 各種所得控除の合計
    let totalDeductionsYen = BASIC_DEDUCTION + socialInsuranceYen;

    // 配偶者控除 (簡易的に本人の所得制限と配偶者の年金等非考慮なルールを適用)
    if (hasSpouse && totalIncomeYen <= 10000000 && spouseIncomeYen <= 1030000) {
        totalDeductionsYen += SPOUSE_DEDUCTION;
    }

    // 扶養控除
    for (const dep of dependents) {
        if (dep.age >= 16 && dep.age <= 18) totalDeductionsYen += DEPENDENT_DEDUCTIONS.general;
        else if (dep.age >= 19 && dep.age <= 22) totalDeductionsYen += DEPENDENT_DEDUCTIONS.specific;
        else if (dep.age >= 70) totalDeductionsYen += DEPENDENT_DEDUCTIONS.elderly;
    }

    // 課税所得
    const taxableIncomeYen = Math.max(0, totalIncomeYen - Math.floor(totalDeductionsYen));
    // 1000円未満切り捨て
    const roundedTaxableIncomeYen = Math.floor(taxableIncomeYen / 1000) * 1000;

    const incomeTaxYen = calculateIncomeTax(roundedTaxableIncomeYen);
    const residentTaxYen = calculateResidentTax(roundedTaxableIncomeYen);

    // netIncomeの再定義（ここでは税金計算上の「すべての収入から税・社保を引いた額」）
    const netIncomeYen = (salaryYen + pensionYen) - socialInsuranceYen - incomeTaxYen - residentTaxYen;

    return {
        socialInsurance: socialInsuranceYen / 10000,
        incomeTax: incomeTaxYen / 10000,
        residentTax: residentTaxYen / 10000,
        netIncome: netIncomeYen / 10000,
        details: {
            salaryDeduction: salaryDeductionYen / 10000,
            pensionDeduction: pensionDeductionYen / 10000,
            totalDeductions: totalDeductionsYen / 10000,
            taxableIncome: roundedTaxableIncomeYen / 10000,
        }
    };
}
