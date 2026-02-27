import {
    BASIC_PENSION_FULL_ANNUAL,
    EARNINGS_RELATED_PENSION_RATE,
} from '@/constants/social-insurance';

/**
 * 簡易的に年金見込み額を計算する (万円/年)
 * @param averageAnnualSalaryManYen 平均年収(万円)
 * @param monthsOfContribution 厚生年金加入月数(概算用)
 * @param isEmployee 会社員かどうか(厚生年金があるか)
 */
export function estimateAnnualPension(
    averageAnnualSalaryManYen: number,
    monthsOfContribution: number,
    isEmployee: boolean
): number {
    // 基礎年金 (円換算)
    // 簡略化のため、加入期間480ヶ月(40年)に対する割合のみで計算
    const basicPensionYen = BASIC_PENSION_FULL_ANNUAL * Math.min(1, monthsOfContribution / 480);

    if (!isEmployee || averageAnnualSalaryManYen === 0) {
        return basicPensionYen / 10000;
    }

    // 厚生年金 報酬比例部分 (円換算)
    const averageMonthlySalaryYen = (averageAnnualSalaryManYen * 10000) / 12;
    const earningsRelatedYen = averageMonthlySalaryYen * EARNINGS_RELATED_PENSION_RATE * monthsOfContribution;

    const totalAnnualPensionYen = basicPensionYen + earningsRelatedYen;

    return totalAnnualPensionYen / 10000;
}
