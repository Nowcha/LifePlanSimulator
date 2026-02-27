// 日本の社会保険料の定数（2024年度基準）

/** 健康保険料率（協会けんぽ全国平均、折半後） */
export const HEALTH_INSURANCE_RATE = 0.05;

/** 厚生年金保険料率（折半後） */
export const EMPLOYEES_PENSION_RATE = 0.0915;

/** 雇用保険料率（一般の事業、労働者負担分） */
export const EMPLOYMENT_INSURANCE_RATE = 0.006;

/** 介護保険料率（折半後、40歳以上65歳未満） */
export const NURSING_CARE_INSURANCE_RATE = 0.008;

/** 介護保険 適用開始年齢 */
export const NURSING_CARE_START_AGE = 40;

/** 介護保険 適用終了年齢 */
export const NURSING_CARE_END_AGE = 65;

/** 国民年金保険料（月額、万円） */
export const NATIONAL_PENSION_MONTHLY = 1.698;

/** 厚生年金 標準報酬月額の上限（万円） */
export const PENSION_SALARY_CAP = 65;

/** 健康保険 標準報酬月額の上限（万円） */
export const HEALTH_INSURANCE_SALARY_CAP = 139;

/** 社会保険料の合計料率を計算（年齢による分岐） */
export function getSocialInsuranceRate(age: number): number {
    let rate = HEALTH_INSURANCE_RATE + EMPLOYEES_PENSION_RATE + EMPLOYMENT_INSURANCE_RATE;
    if (age >= NURSING_CARE_START_AGE && age < NURSING_CARE_END_AGE) {
        rate += NURSING_CARE_INSURANCE_RATE;
    }
    return rate;
}
