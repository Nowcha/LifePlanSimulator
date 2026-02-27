import {
    NURSERY_COST,
    KINDERGARTEN_COST,
    ELEMENTARY_COST,
    JUNIOR_HIGH_COST,
    HIGH_SCHOOL_COST,
    UNIVERSITY_COST,
    LIVING_ALONE_ADDITIONAL,
} from '@/constants/education';
import type { EducationPlan } from '@/types/plan';

/**
 * 教育費の計算 (子ども1人あたり、特定の年齢における年間の費用 万円)
 * @param childAge その年の子どもの年齢
 * @param plan 教育方針プラン
 */
export function calculateAnnualEducationCost(
    childAge: number,
    plan: EducationPlan
): { cost: number; details: { label: string; amount: number }[] } {
    let totalCost = 0;
    const details: { label: string; amount: number }[] = [];

    // 0歳: 出産費用
    if (childAge === 0 && plan.birthCost > 0) {
        totalCost += plan.birthCost;
        details.push({ label: '出産費用', amount: plan.birthCost });
    }

    // 0〜2歳: 保育園・乳幼児預かり
    if (childAge >= 0 && childAge <= 2 && plan.nursery !== 'none') {
        const cost = NURSERY_COST[plan.nursery];
        totalCost += cost;
        details.push({ label: `保育園/乳幼児預かり (${plan.nursery === 'public' ? '公立' : '私立'})`, amount: cost });
    }

    if (childAge >= 3 && childAge <= 5) {
        const cost = KINDERGARTEN_COST[plan.kindergarten];
        totalCost += cost;
        details.push({ label: `幼稚園 (${plan.kindergarten === 'public' ? '公立' : '私立'})`, amount: cost });
    } else if (childAge >= 6 && childAge <= 11) {
        const cost = ELEMENTARY_COST[plan.elementary];
        totalCost += cost;
        details.push({ label: `小学校 (${plan.elementary === 'public' ? '公立' : '私立'})`, amount: cost });
    } else if (childAge >= 12 && childAge <= 14) {
        const cost = JUNIOR_HIGH_COST[plan.juniorHigh];
        totalCost += cost;
        details.push({ label: `中学校 (${plan.juniorHigh === 'public' ? '公立' : '私立'})`, amount: cost });
    } else if (childAge >= 15 && childAge <= 17) {
        const cost = HIGH_SCHOOL_COST[plan.highSchool];
        totalCost += cost;
        details.push({ label: `高校 (${plan.highSchool === 'public' ? '公立' : '私立'})`, amount: cost });
    }

    const isMedical = plan.university === 'medical';
    const uniYears = isMedical ? 6 : 4;

    if (childAge >= 18 && childAge < 18 + uniYears) {
        const cost = UNIVERSITY_COST[plan.university];
        const uniLabelMap = {
            national: '国公立',
            private_arts: '私立文系',
            private_science: '私立理系',
            medical: '医歯薬系'
        };
        totalCost += cost;
        details.push({ label: `大学 (${uniLabelMap[plan.university]})`, amount: cost });

        if (plan.livingAlone) {
            totalCost += LIVING_ALONE_ADDITIONAL;
            details.push({ label: '大学一人暮らし追加費用', amount: LIVING_ALONE_ADDITIONAL });
        }
    }

    return { cost: totalCost, details };
}

/**
 * 元利均等返済における年間返済額を計算する (万円)
 * @param principal 借入額またはローン残高 (万円)
 * @param annualInterestRate 年利 (%)
 * @param years 返済期間 (年)
 */
export function calculateAnnualMortgagePayment(
    principal: number,
    annualInterestRate: number,
    years: number
): number {
    if (years <= 0 || principal <= 0) return 0;

    if (annualInterestRate === 0) {
        return principal / years;
    }

    const monthlyRate = annualInterestRate / 100 / 12;
    const numPayments = years * 12;

    // 毎月の返済額 (万円) = 借入額 × [ r(1+r)^n / ((1+r)^n - 1) ]
    const monthlyPayment = principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    return monthlyPayment * 12;
}
