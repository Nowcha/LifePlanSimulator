import type { SalaryGrowthCurve } from '@/types/plan';

/**
 * 年齢・昇給カーブに基づいて特定の年齢における年収(万円)を計算する
 * 
 * @param baseSalaryManYen 現在の年収(万円)
 * @param currentAge 現在の年齢
 * @param targetAge 対象年齢
 * @param growthRatePercent 昇給率(%, 例: 1.5)
 * @param curve 昇給カーブ(年功型/成果型/フラット)
 * @param retirementAge 退職年齢(通常65)
 * @param reemploymentAnnualIncome 再雇用後の年収(万円), 再雇用しない場合は0
 */
export function calculateAgeBasedSalary(
    baseSalaryManYen: number,
    currentAge: number,
    targetAge: number,
    growthRatePercent: number,
    curve: SalaryGrowthCurve,
    retirementAge: number,
    reemploymentAnnualIncome: number,
    reemploymentEndAge: number,
    leaveReturnAge: number = 0
): number {
    // 一時休職中（復職年齢に達していない場合）は給与0
    if (leaveReturnAge > 0 && targetAge < leaveReturnAge) {
        return 0;
    }
    if (targetAge < currentAge) return baseSalaryManYen;
    if (targetAge >= retirementAge) {
        // 退職後〜指定の年齢までは再雇用期間として想定
        if (targetAge >= retirementAge && targetAge < reemploymentEndAge && reemploymentAnnualIncome > 0) {
            return reemploymentAnnualIncome;
        }
        return 0; // 完全退職
    }

    const yearsDiff = targetAge - currentAge;
    const growthRate = growthRatePercent / 100;

    let multiplier = 1.0;

    switch (curve) {
        case 'flat':
            multiplier = Math.pow(1 + growthRate, yearsDiff);
            break;
        case 'seniority':
            // 年功型: 50歳までは安定成長、以降は鈍化 (半分)
            if (targetAge <= 50) {
                multiplier = Math.pow(1 + growthRate, yearsDiff);
            } else {
                const yearsTo50 = Math.max(0, 50 - currentAge);
                const yearsOver50 = targetAge - Math.max(50, currentAge);
                multiplier = Math.pow(1 + growthRate, yearsTo50) * Math.pow(1 + growthRate * 0.5, yearsOver50);
            }
            break;
        case 'performance':
            // 成果型: 40歳までは急成長(1.5倍)、以降はフラット(0.2倍)
            if (targetAge <= 40) {
                multiplier = Math.pow(1 + growthRate * 1.5, yearsDiff);
            } else {
                const yearsTo40 = Math.max(0, 40 - currentAge);
                const yearsOver40 = targetAge - Math.max(40, currentAge);
                multiplier = Math.pow(1 + growthRate * 1.5, yearsTo40) * Math.pow(1 + growthRate * 0.2, yearsOver40);
            }
            break;
    }

    return baseSalaryManYen * multiplier;
}
