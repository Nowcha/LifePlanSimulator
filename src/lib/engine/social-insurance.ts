// 社会保険料計算エンジン

import { getSocialInsuranceRate, PENSION_SALARY_CAP } from '@/constants/social-insurance';

/**
 * 社会保険料を計算（年間、万円）
 * @param annualIncome 税込年収（万円）
 * @param age 年齢
 */
export function calculateSocialInsurance(annualIncome: number, age: number): number {
    if (annualIncome <= 0) return 0;

    // 標準報酬月額（年収÷12、上限あり）
    const monthlyIncome = Math.min(annualIncome / 12, PENSION_SALARY_CAP);

    // 年齢に応じた料率
    const rate = getSocialInsuranceRate(age);

    // 年間社会保険料
    return Math.round(monthlyIncome * rate * 12 * 100) / 100;
}
