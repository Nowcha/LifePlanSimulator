import { Button } from '@/components/ui/button';
import { Moon, Sun, RotateCcw } from 'lucide-react';
interface HeaderProps {
    isDark: boolean;
    onToggleDark: () => void;
    onReset: () => void;
}

export function Header({ isDark, onToggleDark, onReset }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">LP</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">
                            ライフプランシミュレーター
                        </h1>
                        <p className="text-xs text-muted-foreground hidden sm:block">
                            あなたの人生設計をシミュレーション
                        </p>
                    </div>
                </div>

                <nav className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onReset}
                        title="入力をリセット"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleDark}
                        title={isDark ? 'ライトモード' : 'ダークモード'}
                    >
                        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                </nav>
            </div>
        </header>
    );
}
