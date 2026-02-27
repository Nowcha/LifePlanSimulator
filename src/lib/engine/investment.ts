// 投資・運用計算エンジン

import type { AssetAllocation } from '@/types/plan';

/**
 * 加重平均リターンを計算
 */
export function calculateWeightedReturn(allocation: AssetAllocation): number {
    return (
        allocation.stockRatio * allocation.stockReturn +
        allocation.bondRatio * allocation.bondReturn +
        allocation.cashRatio * allocation.cashReturn
    ) / 100;
}

/**
 * 加重平均標準偏差を計算（簡易版：相関なし仮定）
 */
export function calculateWeightedStdDev(allocation: AssetAllocation): number {
    const stockVar = Math.pow(allocation.stockRatio / 100 * allocation.stockStdDev, 2);
    const bondVar = Math.pow(allocation.bondRatio / 100 * allocation.bondStdDev, 2);
    return Math.sqrt(stockVar + bondVar);
}

/**
 * 年間投資収益を計算（確定的）
 * @param totalAssets 総資産（万円）
 * @param allocation アセットアロケーション
 * @param returnModifier シナリオ別リターン修正値
 */
export function calculateInvestmentReturn(
    totalAssets: number,
    allocation: AssetAllocation,
    returnModifier: number = 1.0
): number {
    if (totalAssets <= 0) return 0;
    const weightedReturn = calculateWeightedReturn(allocation) * returnModifier;
    return Math.round(totalAssets * weightedReturn / 100 * 100) / 100;
}

/**
 * 取り崩し額を計算
 */
export function calculateWithdrawal(
    totalAssets: number,
    method: '定額' | '定率',
    amount: number,
    rate: number
): number {
    if (totalAssets <= 0) return 0;
    if (method === '定額') {
        return Math.min(amount, totalAssets);
    } else {
        return Math.round(totalAssets * rate / 100 * 100) / 100;
    }
}
