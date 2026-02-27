// 教育費の概算データ（文科省統計ベース）
// 子どもの年齢に応じた年間教育費（万円）

/**
 * 年齢に応じた教育費の概算（万円/年）
 * 文科省「子供の学習費調査」等を参考にした概算値
 *
 * 0-2歳:  保育園（0万 - 家庭保育想定）
 * 3-5歳:  幼稚園（約30万/年）
 * 6-11歳: 小学校（約35万/年）
 * 12-14歳: 中学校（約50万/年）
 * 15-17歳: 高校（約50万/年）
 * 18-21歳: 大学（約120万/年）
 */
export function getAnnualEducationCost(childAge: number): number {
    if (childAge < 3) return 0;
    if (childAge <= 5) return 30;
    if (childAge <= 11) return 35;
    if (childAge <= 14) return 50;
    if (childAge <= 17) return 50;
    if (childAge <= 21) return 120;
    return 0; // 22歳以上は教育費なし
}
