import { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/layout/Header';
import { StepWizard } from '@/components/wizard/StepWizard';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { usePlanStore } from '@/stores/plan-store';

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lifeplan-dark-mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const { reset, result, isSimulating } = usePlanStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('lifeplan-dark-mode', String(isDark));
  }, [isDark]);

  const handleReset = () => {
    if (window.confirm('すべての入力をリセットしますか？')) {
      reset();
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background">
        <Header
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          onReset={handleReset}
        />
        <main className="container mx-auto px-4 py-8">
          {result || isSimulating ? <Dashboard /> : <StepWizard />}
        </main>
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          <p>LifePlan Simulator — あなたの未来をシミュレーション</p>
          <p className="mt-1 text-xs">
            ※ 本シミュレーションは概算です。正確な税額・年金額等は専門家にご相談ください。
          </p>
        </footer>
      </div>
    </TooltipProvider>
  );
}

export default App;
