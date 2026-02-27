// キャッシュフローグラフ（棒グラフ）
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
} from 'recharts';
import type { YearlyRecord } from '../../types/plan';

interface Props {
    records: YearlyRecord[];
}

export default function CashflowChart({ records }: Props) {
    const data = records.map((r) => ({
        age: r.age,
        '収入': r.income,
        '支出': -r.expense,
        '収支': r.netCashflow,
        events: r.events,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">💹 年間キャッシュフロー</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }} stackOffset="sign">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="age"
                        tick={{ fontSize: 12 }}
                        label={{ value: '年齢', position: 'insideBottomRight', offset: -5, fontSize: 12 }}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => `${v.toLocaleString()}`}
                        label={{ value: '万円', angle: -90, position: 'insideLeft', fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value: unknown, name?: string) => [
                            `${Math.abs(Number(value)).toLocaleString()}万円`,
                            name === '支出' ? '支出' : (name ?? ''),
                        ]}
                        labelFormatter={(age) => {
                            const record = data.find((d) => d.age === age);
                            const eventStr = record?.events.length ? `\n📌 ${record.events.join(', ')}` : '';
                            return `${age}歳${eventStr}`;
                        }}
                        contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            whiteSpace: 'pre-line',
                        }}
                    />
                    <Legend />
                    <ReferenceLine y={0} stroke="#6b7280" />
                    <Bar dataKey="収入" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="支出" fill="#f87171" radius={[0, 0, 2, 2]} />
                    <Bar dataKey="収支">
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={entry['収支'] >= 0 ? '#22c55e' : '#ef4444'}
                                fillOpacity={0.6}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
