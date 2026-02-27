// サマリーカード（4枚のKPIカード）
import type { SimulationResult } from '../../types/plan';

interface Props {
    result: SimulationResult;
}

function formatMoney(value: number): string {
    if (Math.abs(value) >= 10000) {
        return `${(value / 10000).toFixed(1)}億`;
    }
    return `${value.toLocaleString()}万`;
}

export default function SummaryCards({ result }: Props) {
    const { totalIncome, totalExpense, peakAssets, depletionAge, finalAssets } = result;
    const hasRisk = depletionAge !== null;

    const cards = [
        {
            title: '生涯収入合計',
            value: formatMoney(totalIncome),
            unit: '円',
            icon: '💰',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            title: '生涯支出合計',
            value: formatMoney(totalExpense),
            unit: '円',
            icon: '💸',
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        },
        {
            title: '資産ピーク額',
            value: formatMoney(peakAssets),
            unit: '円',
            icon: '📈',
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            title: depletionAge ? '資産枯渇年齢' : '最終資産残高',
            value: depletionAge ? `${depletionAge}` : formatMoney(finalAssets),
            unit: depletionAge ? '歳' : '円',
            icon: depletionAge ? '⚠️' : '🏦',
            color: depletionAge ? 'from-red-500 to-pink-500' : 'from-violet-500 to-purple-500',
            bgColor: depletionAge ? 'bg-red-50 dark:bg-red-900/20' : 'bg-violet-50 dark:bg-violet-900/20',
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className={`${card.bgColor} rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:scale-[1.02] transition-transform`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{card.icon}</span>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.title}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                                {card.value}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{card.unit}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 資産枯渇リスクアラート */}
            {hasRisk && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                        <p className="font-bold text-red-700 dark:text-red-300">資産枯渇リスクあり</p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {depletionAge}歳で資産がマイナスになる見込みです。
                            支出の見直しや収入の増加、投資の検討をおすすめします。
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
