// エラーバウンダリ — 計算エラー時のフォールバックUI
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error('ErrorBoundary caught:', error, info);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="p-8 text-center">
                    <div className="text-6xl mb-4">😵</div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        エラーが発生しました
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        シミュレーション中にエラーが発生しました。入力値を確認してください。
                    </p>
                    <p className="text-sm text-red-500 dark:text-red-400 mb-4 font-mono">
                        {this.state.error?.message}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-6 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-all cursor-pointer"
                    >
                        リトライ
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
