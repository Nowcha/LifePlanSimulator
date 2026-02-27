// 税金計算エンジン

import {
    INCOME_TAX_BRACKETS,
    RESIDENT_TAX_RATE,
    RESIDENT_TAX_FLAT,
    BASIC_DEDUCTION,
    SALARY_DEDUCTION_TABLE,
    SPOUSE_DEDUCTION,
    DEPENDENT_DEDUCTION_TABLE,
    RECONSTRUCTION_TAX_RATE,
} from '@/constants/tax';

/**
 * 給与所得控除を計算
 * @param grossSalary 税込年収（万円）
 */
export function calculateSalaryDeduction(grossSalary: number): number {
    for (const bracket of SALARY_DEDUCTION_TABLE) {
        if (grossSalary <= bracket.upperLimit) {
            return Math.max(55, bracket.calc(grossSalary));
        }
    }
    return 195; // 上限
}

/**
 * 扶養控除を計算
 * @param childrenAges 子どもの年齢配列
 */
export function calculateDependentDeduction(childrenAges: number[]): number {
    let total = 0;
    for (const age of childrenAges) {
        if (age < 16) {
            total += DEPENDENT_DEDUCTION_TABLE.under16;
        } else if (age >= 19 && age < 23) {
            total += DEPENDENT_DEDUCTION_TABLE.specific;
        } else {
            total += DEPENDENT_DEDUCTION_TABLE.general;
        }
    }
    return total;
}

/**
 * 所得税を計算（復興特別所得税込み）
 * @param grossIncome 税込年収（万円）
 * @param hasSpouse 配偶者控除適用有無
 * @param childrenAges 子どもの年齢配列
 * @param socialInsurance 社会保険料控除（万円）
 */
export function calculateIncomeTax(
    grossIncome: number,
    hasSpouse: boolean,
    childrenAges: number[],
    socialInsurance: number
): number {
    if (grossIncome <= 0) return 0;

    // 給与所得の計算
    const salaryDeduction = calculateSalaryDeduction(grossIncome);
    const earned = Math.max(0, grossIncome - salaryDeduction);

    // 所得控除の合計
    let deductions = BASIC_DEDUCTION + socialInsurance;
    if (hasSpouse) deductions += SPOUSE_DEDUCTION;
    deductions += calculateDependentDeduction(childrenAges);

    // 課税所得
    const taxable = Math.max(0, earned - deductions);
    if (taxable <= 0) return 0;

    // 累進課税の計算
    let tax = 0;
    for (const bracket of INCOME_TAX_BRACKETS) {
        if (taxable <= bracket.upperLimit) {
            tax = taxable * bracket.rate - bracket.deduction;
            break;
        }
    }

    // 復興特別所得税
    tax *= (1 + RECONSTRUCTION_TAX_RATE);

    return Math.max(0, Math.round(tax * 100) / 100);
}

/**
 * 住民税を計算
 * @param grossIncome 税込年収（万円）
 * @param hasSpouse 配偶者控除適用有無
 * @param childrenAges 子どもの年齢配列
 * @param socialInsurance 社会保険料控除（万円）
 */
export function calculateResidentTax(
    grossIncome: number,
    hasSpouse: boolean,
    childrenAges: number[],
    socialInsurance: number
): number {
    if (grossIncome <= 0) return 0;

    const salaryDeduction = calculateSalaryDeduction(grossIncome);
    const earned = Math.max(0, grossIncome - salaryDeduction);

    let deductions = 43 + socialInsurance; // 住民税の基礎控除は43万
    if (hasSpouse) deductions += 33; // 住民税の配偶者控除は33万
    deductions += calculateDependentDeduction(childrenAges);

    const taxable = Math.max(0, earned - deductions);

    return Math.max(0, Math.round((taxable * RESIDENT_TAX_RATE + RESIDENT_TAX_FLAT) * 100) / 100);
}
