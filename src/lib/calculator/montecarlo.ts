/**
 * 正規分布に従う乱数を生成する (Box-Muller変換)
 * 平均0、標準偏差1の標準正規分布
 */
export function randomNormal(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * 幾何ブラウン運動(GBM)によるリターンシミュレーション
 * @param mean 年間期待リターン (年率%, 例: 5.0)
 * @param volatility 年間ボラティリティ (年率%, 例: 12.0)
 * @returns その年のランダムなリターン (期待値を中心に正規分布する係数)
 */
export function simulateYearlyReturn(mean: number, volatility: number): number {
    const mu = mean / 100;
    const sigma = volatility / 100;

    // 連続複利ベースのドリフト
    const drift = mu - (sigma * sigma) / 2;
    const shock = sigma * randomNormal();

    // 1年後のリターン (倍率 - 1)
    return Math.exp(drift + shock) - 1;
}

export interface MonteCarloSimulationParams {
    initialAssets: number;        // 初期資産(万円)
    annualCashflowMap: number[];  // 各年齢における資産運用を除いた収支額(万円)の配列
    startAge: number;
    endAge: number;
    meanReturn: number;           // 期待リターン(%)
    volatility: number;           // ボラティリティ(%, リスク)
    trials: number;               // 試行回数 (例: 1000)
}

/**
 * モンテカルロシミュレーションを実行する
 * メインスレッドをブロックしないよう、実際にはWeb Workerから呼び出されることを想定
 */
export function runMonteCarloSimulation(params: MonteCarloSimulationParams) {
    const { initialAssets, annualCashflowMap, startAge, endAge, meanReturn, volatility, trials } = params;
    const years = endAge - startAge + 1;

    // 全トライアルの各年の資産残高を保存する二次元配列
    // paths[yearIndex][trialIndex]
    const paths: Float64Array[] = Array.from({ length: years }, () => new Float64Array(trials));

    let successCount = 0; // 資産が最終年まで枯渇しなかった回数

    for (let trial = 0; trial < trials; trial++) {
        let currentAssets = initialAssets;
        let isBankrupt = false;

        for (let i = 0; i < years; i++) {
            if (currentAssets > 0) {
                // リターンによる増減
                const randomReturn = simulateYearlyReturn(meanReturn, volatility);
                currentAssets = currentAssets * (1 + randomReturn);
            }

            // その年の収支を加算/減算
            currentAssets += annualCashflowMap[i];

            if (currentAssets < 0) {
                currentAssets = 0;
                isBankrupt = true;
            }

            paths[i][trial] = currentAssets;
        }

        if (!isBankrupt) {
            successCount++;
        }
    }

    // パーセンタイルを計算するために各年のデータをソート
    const p5: number[] = new Array(years);
    const p25: number[] = new Array(years);
    const p50: number[] = new Array(years);
    const p75: number[] = new Array(years);
    const p95: number[] = new Array(years);

    for (let i = 0; i < years; i++) {
        paths[i].sort(); // 昇順ソート

        p5[i] = paths[i][Math.floor(trials * 0.05)];
        p25[i] = paths[i][Math.floor(trials * 0.25)];
        p50[i] = paths[i][Math.floor(trials * 0.50)];
        p75[i] = paths[i][Math.floor(trials * 0.75)];
        p95[i] = paths[i][Math.floor(trials * 0.95)];
    }

    const successRate = (successCount / trials) * 100;
    const ages = Array.from({ length: years }, (_, i) => startAge + i);

    return {
        percentiles: { p5, p25, p50, p75, p95 },
        successRate,
        ages,
    };
}
