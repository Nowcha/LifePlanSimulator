// 日本の所得税・住民税の定数

/** 所得税 累進課税テーブル（2024年度） */
export const INCOME_TAX_BRACKETS = [
    { upperLimit: 195, rate: 0.05, deduction: 0 },
    { upperLimit: 330, rate: 0.10, deduction: 9.75 },
    { upperLimit: 695, rate: 0.20, deduction: 42.75 },
    { upperLimit: 900, rate: 0.23, deduction: 63.6 },
    { upperLimit: 1800, rate: 0.33, deduction: 153.6 },
    { upperLimit: 4000, rate: 0.40, deduction: 279.6 },
    { upperLimit: Infinity, rate: 0.45, deduction: 479.6 },
] as const;

/** 住民税率 */
export const RESIDENT_TAX_RATE = 0.10;

/** 住民税均等割（万円） */
export const RESIDENT_TAX_FLAT = 0.5;

/** 基礎控除（万円） */
export const BASIC_DEDUCTION = 48;

/** 給与所得控除の計算テーブル */
export const SALARY_DEDUCTION_TABLE = [
    { upperLimit: 162.5, calc: (income: number) => 55 + 0 * income },
    { upperLimit: 180, calc: (income: number) => income * 0.40 - 10 },
    { upperLimit: 360, calc: (income: number) => income * 0.30 + 8 },
    { upperLimit: 660, calc: (income: number) => income * 0.20 + 44 },
    { upperLimit: 850, calc: (income: number) => income * 0.10 + 110 },
    { upperLimit: Infinity, calc: (_income: number) => 195 },
] as const;

/** 配偶者控除（万円）— 簡易版 */
export const SPOUSE_DEDUCTION = 38;

/** 扶養控除（万円/人）— 簡易版 */
export const DEPENDENT_DEDUCTION_TABLE = {
    under16: 0,       // 16歳未満（控除なし）
    general: 38,      // 16歳以上19歳未満, 23歳以上
    specific: 63,     // 19歳以上23歳未満（特定扶養）
} as const;

/** 復興特別所得税率 */
export const RECONSTRUCTION_TAX_RATE = 0.021;
