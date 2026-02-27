// メインアプリケーション
import { useState, useEffect } from 'react';
import type { PlanInput } from './types/plan';
import { DEFAULT_INPUT } from './types/plan';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSimulation } from './hooks/useSimulation';
import StepWizard from './components/steps/StepWizard';
import SummaryCards from './components/summary/SummaryCards';
import AssetChart from './components/charts/AssetChart';
import CashflowChart from './components/charts/CashflowChart';
import ExpenseBreakdownChart from './components/charts/ExpenseBreakdownChart';
import DetailTable from './components/DetailTable';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
    // ダークモード
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('darkMode');
            if (saved !== null) return saved === 'true';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('darkMode', String(isDark));
    }, [isDark]);

    // 入力データ（localStorageに自動保存）
    const [input, setInput, resetInput] = useLocalStorage<PlanInput>('lifePlanInput', DEFAULT_INPUT);

    // 表示モード: 'input' | 'result'
    const [view, setView] = useState<'input' | 'result'>('input');

    // シミュレーション結果
    const result = useSimulation(input);

    const handleSimulate = () => {
        setView('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToInput = () => {
        setView('input');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        if (window.confirm('すべての入力をリセットしますか？')) {
            resetInput();
            setView('input');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
            {/* ヘッダー */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 dark:text-white">ライフプランシミュレーター</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">将来の家計を見える化しよう</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {view === 'result' && (
                            <button
                                onClick={handleBackToInput}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all cursor-pointer"
                            >
                                ✏️ 入力に戻る
                            </button>
                        )}
                        <button
                            onClick={handleReset}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                        >
                            🔄 リセット
                        </button>
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                            aria-label="ダークモード切替"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <ErrorBoundary>
                    {view === 'input' ? (
                        <StepWizard input={input} onChange={setInput} onSimulate={handleSimulate} />
                    ) : (
                        <div className="space-y-6">
                            {/* サマリーカード */}
                            <SummaryCards result={result} />

                            {/* グラフ */}
                            <AssetChart records={result.records} />
                            <CashflowChart records={result.records} />
                            <ExpenseBreakdownChart records={result.records} />

                            {/* 詳細テーブル */}
                            <DetailTable records={result.records} />
                        </div>
                    )}
                </ErrorBoundary>
            </main>

            {/* フッター */}
            <footer className="border-t border-gray-200/50 dark:border-gray-700/50 py-6 mt-8">
                <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                    ※ このシミュレーションは概算です。実際の金額は個人の状況により異なります。
                </p>
            </footer>
        </div>
    );
}
