// 教育費テンプレート（文科省「子供の学習費調査」ベース）
// 年間費用（万円）

import type { EducationPolicy } from '@/types/plan';

/** 教育段階 */
export type EducationStage = '幼稚園' | '小学校' | '中学校' | '高校' | '大学';

/** 教育段階別の年齢範囲 */
export const EDUCATION_STAGES: { stage: EducationStage; startAge: number; endAge: number }[] = [
    { stage: '幼稚園', startAge: 3, endAge: 5 },
    { stage: '小学校', startAge: 6, endAge: 11 },
    { stage: '中学校', startAge: 12, endAge: 14 },
    { stage: '高校', startAge: 15, endAge: 17 },
    { stage: '大学', startAge: 18, endAge: 21 },
];

/** 年間教育費テンプレート（万円/年） */
export const EDUCATION_COST_TABLE: Record<EducationStage, Record<EducationPolicy, number>> = {
    '幼稚園': { '公立': 17, '私立': 31 },
    '小学校': { '公立': 35, '私立': 167 },
    '中学校': { '公立': 54, '私立': 144 },
    '高校': { '公立': 51, '私立': 105 },
    '大学': { '公立': 108, '私立': 152 },
};

/** 大学入学金（万円） */
export const UNIVERSITY_ENTRANCE_FEE: Record<EducationPolicy, number> = {
    '公立': 28,
    '私立': 25,
};

/**
 * 子どもの年齢と教育方針から年間教育費を算出
 */
export function getAnnualEducationCost(childAge: number, policy: EducationPolicy): number {
    for (const { stage, startAge, endAge } of EDUCATION_STAGES) {
        if (childAge >= startAge && childAge <= endAge) {
            let cost = EDUCATION_COST_TABLE[stage][policy];
            // 大学1年目は入学金を加算
            if (stage === '大学' && childAge === 18) {
                cost += UNIVERSITY_ENTRANCE_FEE[policy];
            }
            return cost;
        }
    }
    return 0; // 対象外の年齢
}
