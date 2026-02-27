// 住宅ローン計算エンジン

import type { MortgageDetail } from '@/types/plan';

/**
 * 元利均等返済の月額返済額を計算
 */
function calcEqualPayment(principal: number, annualRate: number, termYears: number): number {
    if (principal <= 0 || termYears <= 0) return 0;
    if (annualRate <= 0) return principal / (termYears * 12);
    const r = annualRate / 100 / 12;
    const n = termYears * 12;
    return principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

/**
 * 元金均等返済の年次返済額を計算
 */
function calcPrincipalPayment(principal: number, annualRate: number, termYears: number, yearIndex: number): number {
    if (principal <= 0 || termYears <= 0) return 0;
    const monthlyPrincipal = principal / (termYears * 12);
    const r = annualRate / 100 / 12;
    let annualPayment = 0;
    for (let m = 0; m < 12; m++) {
        const monthNumber = yearIndex * 12 + m;
        const remaining = principal - monthlyPrincipal * monthNumber;
        annualPayment += monthlyPrincipal + remaining * r;
    }
    return annualPayment;
}

/**
 * 住宅ローンの年間返済額を計算
 * @param mortgage ローン詳細
 * @param yearIndex ローン開始からの経過年数
 * @returns 年間返済額（万円）。ローン期間外の場合は0。
 */
export function calculateAnnualMortgagePayment(
    mortgage: MortgageDetail,
    yearIndex: number
): number {
    if (yearIndex < 0 || yearIndex >= mortgage.termYears) return 0;

    if (mortgage.method === '元利均等') {
        return calcEqualPayment(mortgage.principal, mortgage.interestRate, mortgage.termYears) * 12;
    } else {
        return calcPrincipalPayment(mortgage.principal, mortgage.interestRate, mortgage.termYears, yearIndex);
    }
}

/**
 * ローン残高を計算
 */
export function calculateMortgageBalance(
    mortgage: MortgageDetail,
    yearIndex: number
): number {
    if (yearIndex >= mortgage.termYears) return 0;

    const r = mortgage.interestRate / 100 / 12;
    const totalMonths = mortgage.termYears * 12;
    const elapsedMonths = yearIndex * 12;

    if (mortgage.method === '元利均等') {
        if (r <= 0) return mortgage.principal * (1 - elapsedMonths / totalMonths);
        const monthlyPayment = calcEqualPayment(mortgage.principal, mortgage.interestRate, mortgage.termYears);
        return mortgage.principal * Math.pow(1 + r, elapsedMonths) -
            monthlyPayment * (Math.pow(1 + r, elapsedMonths) - 1) / r;
    } else {
        const monthlyPrincipal = mortgage.principal / totalMonths;
        return mortgage.principal - monthlyPrincipal * elapsedMonths;
    }
}
