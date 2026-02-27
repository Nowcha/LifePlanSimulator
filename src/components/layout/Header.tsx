'use client';
// ヘッダーコンポーネント

import { Button } from '@/components/ui/button';

interface Props {
    showBack: boolean;
    onBack: () => void;
    onReset: () => void;
    isDark: boolean;
    onToggleDark: () => void;
}

export default function Header({ showBack, onBack, onReset, isDark, onToggleDark }: Props) {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                        <h1 className="text-lg font-bold">ライフプランシミュレーター</h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">将来の家計を見える化しよう</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {showBack && (
                        <Button variant="outline" size="sm" onClick={onBack}>✏️ 入力に戻る</Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={onReset}>🔄 リセット</Button>
                    <Button variant="ghost" size="icon" onClick={onToggleDark} aria-label="ダークモード切替">
                        {isDark ? '☀️' : '🌙'}
                    </Button>
                </div>
            </div>
        </header>
    );
}
