import type { AssetAllocation } from '@/types/plan';

// 各種アセットクラスの標準期待リターン (年率%)
const STANDARD_ASSET_RETURNS = {
    domesticStocks: 5.0,
    foreignStocks: 7.0,
    domesticBonds: 1.0,
    foreignBonds: 3.0,
    reit: 4.0,
    cash: 0.0,
} as const;

/**
 * アセットアロケーションに基づく加重平均期待リターンを計算する (年率%)
 *
 * @param allocation アセットアロケーション (各項目の合計が必ず100%になるとは限らないため正規化する)
 */
export function calculateWeightedReturn(allocation: AssetAllocation): number {
    const totalWeight =
        allocation.domesticStocks +
        allocation.foreignStocks +
        allocation.domesticBonds +
        allocation.foreignBonds +
        allocation.reit +
        allocation.cash;

    if (totalWeight <= 0) return 0;

    const weightedSum =
        allocation.domesticStocks * STANDARD_ASSET_RETURNS.domesticStocks +
        allocation.foreignStocks * STANDARD_ASSET_RETURNS.foreignStocks +
        allocation.domesticBonds * STANDARD_ASSET_RETURNS.domesticBonds +
        allocation.foreignBonds * STANDARD_ASSET_RETURNS.foreignBonds +
        allocation.reit * STANDARD_ASSET_RETURNS.reit +
        allocation.cash * STANDARD_ASSET_RETURNS.cash;

    return weightedSum / totalWeight;
}

/**
 * 一定期間における定額・定率取り崩し額の計算 (万円/年)
 * リタイア後の資産の取り崩し方法に応じた年間取り崩し額を返す
 *
 * @param currentAssets 現在の金融資産総額(万円)
 * @param withdrawalMethod 取り崩し方法
 * @param fixedAmount 定額の場合の年間取り崩し額(万円) - 簡易的に生活費赤字額等を使用することが多い
 * @param fixedRate 定率の場合の取り崩し割合(%) - 例: 4%ルールなら 4.0
 * @param currentAge 現在の年齢
 * @param endAge シミュレーション終了年齢 (寿命)
 */
export function calculateWithdrawalAmount(
    currentAssets: number,
    withdrawalMethod: 'fixed_amount' | 'fixed_rate' | 'auto_optimize',
    fixedAmount: number = 0,
    fixedRate: number = 4.0,
    currentAge: number = 65,
    endAge: number = 90
): number {
    if (currentAssets <= 0) return 0;

    switch (withdrawalMethod) {
        case 'fixed_amount':
            return Math.min(fixedAmount, currentAssets);

        case 'fixed_rate':
            return currentAssets * (fixedRate / 100);

        case 'auto_optimize': {
            // 残り寿命に応じて均等に取り崩す (簡易的)
            const remainingYears = Math.max(1, endAge - currentAge + 1);
            return currentAssets / remainingYears;
        }

        default:
            return 0;
    }
}
