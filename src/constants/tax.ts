/**
 * 所得税 — 累進課税テーブル（2024年）
 * 課税所得金額に応じて税率と控除額が決まる
 */
export const INCOME_TAX_BRACKETS = [
    { threshold: 1950000, rate: 0.05, deduction: 0 },
    { threshold: 3300000, rate: 0.10, deduction: 97500 },
    { threshold: 6950000, rate: 0.20, deduction: 427500 },
    { threshold: 9000000, rate: 0.23, deduction: 636000 },
    { threshold: 18000000, rate: 0.33, deduction: 1536000 },
    { threshold: 40000000, rate: 0.40, deduction: 2796000 },
    { threshold: Infinity, rate: 0.45, deduction: 4796000 },
] as const;

/** 住民税率 */
export const RESIDENT_TAX_RATE = 0.10;

/** 住民税均等割 (円) */
export const RESIDENT_TAX_FLAT = 5000;

/** 基礎控除 (円) — 所得2400万円以下 */
export const BASIC_DEDUCTION = 480000;

/** 給与所得控除テーブル (円) */
export const SALARY_DEDUCTION_BRACKETS = [
    { threshold: 1625000, rate: 0, fixed: 550000 },
    { threshold: 1800000, rate: 0.40, base: -100000 },
    { threshold: 3600000, rate: 0.30, base: 80000 },
    { threshold: 6600000, rate: 0.20, base: 440000 },
    { threshold: 8500000, rate: 0.10, base: 1100000 },
    { threshold: Infinity, rate: 0, fixed: 1950000 },
] as const;

/** 配偶者控除 (円) — 所得900万円以下の場合 */
export const SPOUSE_DEDUCTION = 380000;

/** 扶養控除 (円) */
export const DEPENDENT_DEDUCTIONS = {
    general: 380000,        // 一般扶養 (16歳以上)
    specific: 630000,       // 特定扶養 (19〜22歳)
    elderly: 480000,        // 老人扶養 (70歳以上、同居以外)
    elderlyCohabiting: 580000, // 老人扶養 (同居)
} as const;

/** 退職所得控除 */
export const RETIREMENT_DEDUCTION = {
    perYearUnder20: 400000,   // 勤続20年以下: 40万円/年
    perYearOver20: 700000,    // 勤続20年超: 70万円/年
    minimum: 800000,          // 最低80万円
} as const;
