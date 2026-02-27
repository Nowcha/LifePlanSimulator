// モンテカルロシミュレーションエンジン

import type { PlanInput, MonteCarloResult } from '@/types/plan';
import { calculateWeightedReturn, calculateWeightedStdDev } from './investment';
import { runSingleSimulation } from './simulator';

/**
 * Box-Muller法で正規分布の乱数を生成
 */
function normalRandom(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z;
}

/**
 * モンテカルロシミュレーションを実行
 * @param input 入力データ
 * @param trials 試行回数
 */
export function runMonteCarlo(input: PlanInput, trials: number): MonteCarloResult {
    const startAge = getCurrentAge(input.basic.birthYear, input.basic.birthMonth);
    const endAge = input.config.endAge;
    const yearsCount = endAge - startAge + 1;

    // 全試行の年齢別資産残高を記録
    const allTrials: number[][] = [];

    const meanReturn = calculateWeightedReturn(input.investment.allocation);
    const stdDev = calculateWeightedStdDev(input.investment.allocation);

    let successCount = 0;

    for (let t = 0; t < trials; t++) {
        // 試行ごとに毎年のリターンをランダム生成
        const yearlyReturns: number[] = [];
        for (let y = 0; y < yearsCount; y++) {
            yearlyReturns.push(normalRandom(meanReturn, stdDev));
        }

        // シミュレーション実行（ランダムリターン使用）
        const result = runSingleSimulation(input, yearlyReturns);
        const assetsByAge = result.records.map(r => r.totalAssets);
        allTrials.push(assetsByAge);

        // 資産が枯渇しなければ成功
        if (assetsByAge.every(a => a >= 0)) {
            successCount++;
        }
    }

    // パーセンタイル計算
    const percentiles = [];
    for (let y = 0; y < yearsCount; y++) {
        const values = allTrials.map(trial => trial[y] ?? 0).sort((a, b) => a - b);
        percentiles.push({
            age: startAge + y,
            p5: getPercentile(values, 5),
            p25: getPercentile(values, 25),
            p50: getPercentile(values, 50),
            p75: getPercentile(values, 75),
            p95: getPercentile(values, 95),
        });
    }

    return {
        percentiles,
        successRate: Math.round(successCount / trials * 100 * 10) / 10,
    };
}

/** パーセンタイル値を取得 */
function getPercentile(sortedValues: number[], percentile: number): number {
    const index = Math.ceil(sortedValues.length * percentile / 100) - 1;
    return Math.round(sortedValues[Math.max(0, index)]);
}

/** 現在の年齢を計算 */
function getCurrentAge(birthYear: number, birthMonth: number): number {
    const now = new Date();
    let age = now.getFullYear() - birthYear;
    if (now.getMonth() + 1 < birthMonth) age--;
    return age;
}
