/**
 * 教育費テンプレート — 文部科学省「子供の学習費調査」ベース
 * 単位: 万円/年
 */

/** 保育園/乳幼児預かり (0〜2歳): 年間費用 */
export const NURSERY_COST = {
    public: 24,    // 公立: 約24万円/年
    private: 60,   // 私立: 約60万円/年
    none: 0,       // 預けない: 0円
} as const;

/** 幼稚園 (3年間) */
export const KINDERGARTEN_COST = {
    public: 17,    // 公立: 約17万円/年
    private: 31,   // 私立: 約31万円/年
} as const;

/** 小学校 (6年間) */
export const ELEMENTARY_COST = {
    public: 35,    // 公立: 約35万円/年
    private: 167,  // 私立: 約167万円/年
} as const;

/** 中学校 (3年間) */
export const JUNIOR_HIGH_COST = {
    public: 54,    // 公立: 約54万円/年
    private: 144,  // 私立: 約144万円/年
} as const;

/** 高校 (3年間) */
export const HIGH_SCHOOL_COST = {
    public: 51,    // 公立: 約51万円/年
    private: 105,  // 私立: 約105万円/年
} as const;

/**
 * 大学 (4年間、医歯薬系は6年間)
 * 授業料＋生活費込み
 */
export const UNIVERSITY_COST = {
    national: 70,          // 国公立: 約70万円/年
    private_arts: 120,     // 私立文系: 約120万円/年
    private_science: 155,  // 私立理系: 約155万円/年
    medical: 350,          // 医歯薬系: 約350万円/年
} as const;

/** 一人暮らし追加費用 (万円/年) */
export const LIVING_ALONE_ADDITIONAL = 100;

/**
 * 子どもの年齢に応じた教育段階
 * (0歳 = 生まれた年)
 */
export const EDUCATION_STAGES = [
    { ageStart: 3, ageEnd: 5, stage: 'kindergarten' as const, years: 3 },
    { ageStart: 6, ageEnd: 11, stage: 'elementary' as const, years: 6 },
    { ageStart: 12, ageEnd: 14, stage: 'juniorHigh' as const, years: 3 },
    { ageStart: 15, ageEnd: 17, stage: 'highSchool' as const, years: 3 },
    { ageStart: 18, ageEnd: 21, stage: 'university' as const, years: 4 },
] as const;

/** 医歯薬系の大学年数 */
export const MEDICAL_UNIVERSITY_YEARS = 6;
