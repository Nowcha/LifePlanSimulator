'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePlanStore } from '@/store/plan-store';
import { runFullSimulation } from '@/lib/engine/simulator';
import Header from '@/components/layout/Header';
import StepWizard from '@/components/forms/StepWizard';
import SummaryCards from '@/components/SummaryCards';
import AssetChart from '@/components/charts/AssetChart';
import CashflowChart from '@/components/charts/CashflowChart';
import ExpenseBreakdownChart from '@/components/charts/ExpenseBreakdownChart';
import MonteCarloChart from '@/components/charts/MonteCarloChart';
import DetailTable from '@/components/DetailTable';
import type { SimulationResult } from '@/types/plan';

export default function Home() {
  // ダークモード
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    const dark = saved !== null ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('darkMode', String(next));
      return next;
    });
  }, []);

  // 入力データ
  const { input, reset } = usePlanStore();

  // 表示モード
  const [view, setView] = useState<'input' | 'result'>('input');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Hydration対策
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSimulate = useCallback(() => {
    setIsSimulating(true);
    // 重い計算をrequestIdleCallbackで遅延実行
    const run = () => {
      const simResult = runFullSimulation(input);
      setResult(simResult);
      setView('result');
      setIsSimulating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(run);
    } else {
      setTimeout(run, 0);
    }
  }, [input]);

  const handleBack = useCallback(() => {
    setView('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('すべての入力をリセットしますか？')) {
      reset();
      setView('input');
      setResult(null);
    }
  }, [reset]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header
        showBack={view === 'result'}
        onBack={handleBack}
        onReset={handleReset}
        isDark={isDark}
        onToggleDark={toggleDark}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {view === 'input' ? (
          <>
            <StepWizard onSimulate={handleSimulate} />
            {isSimulating && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center space-y-3">
                  <div className="animate-spin text-4xl">📊</div>
                  <p className="font-medium">シミュレーション実行中...</p>
                  <p className="text-sm text-muted-foreground">モンテカルロ計算を含むため少々お待ちください</p>
                </div>
              </div>
            )}
          </>
        ) : result ? (
          <div className="space-y-6">
            <SummaryCards result={result} />
            <AssetChart
              base={result.baseResult}
              optimistic={result.optimisticResult}
              pessimistic={result.pessimisticResult}
            />
            <CashflowChart records={result.baseResult.records} />
            <ExpenseBreakdownChart records={result.baseResult.records} />
            <MonteCarloChart monteCarlo={result.monteCarlo} />
            <DetailTable records={result.baseResult.records} />
          </div>
        ) : null}
      </main>

      <footer className="border-t py-6 mt-8">
        <p className="text-center text-xs text-muted-foreground">
          ※ このシミュレーションは概算です。実際の金額は個人の状況により異なります。
        </p>
      </footer>
    </div>
  );
}
