// シミュレーション実行フック
import { useMemo } from 'react';
import type { PlanInput, SimulationResult } from '../types/plan';
import { runSimulation } from '../utils/calculator';

/**
 * 入力値からシミュレーション結果を計算するフック
 * 入力が変わるたびに自動再計算
 */
export function useSimulation(input: PlanInput): SimulationResult {
    return useMemo(() => runSimulation(input), [input]);
}
