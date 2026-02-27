/**
 * 社会保険料率（2024年時点）
 * 会社員の場合、労使折半後の本人負担分を使用
 */

/** 健康保険料率（協会けんぽ全国平均、本人負担分） */
export const HEALTH_INSURANCE_RATE = 0.05;

/** 厚生年金保険料率（本人負担分） */
export const EMPLOYEE_PENSION_RATE = 0.0915;

/** 雇用保険料率（本人負担分） */
export const EMPLOYMENT_INSURANCE_RATE = 0.006;

/** 介護保険料率（40歳以上65歳未満、本人負担分） */
export const NURSING_CARE_INSURANCE_RATE = 0.009;

/** 介護保険適用開始年齢 */
export const NURSING_CARE_START_AGE = 40;

/** 国民年金保険料（月額、円） */
export const NATIONAL_PENSION_MONTHLY = 16980;

/** 厚生年金標準報酬月額の上限（円） */
export const PENSION_SALARY_CAP = 650000;

/** 厚生年金標準報酬月額の下限（円） */
export const PENSION_SALARY_FLOOR = 88000;

/**
 * 基礎年金
 * 満額（40年加入）の年額 (円)
 */
export const BASIC_PENSION_FULL_ANNUAL = 795000;

/** 基礎年金の満額加入期間 (月) */
export const BASIC_PENSION_FULL_MONTHS = 480;

/**
 * 厚生年金 報酬比例部分の乗率
 * 平均標準報酬月額 × 乗率 × 加入月数
 */
export const EARNINGS_RELATED_PENSION_RATE = 0.005481;
