// 資産推移グラフ（折れ線グラフ）
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import type { YearlyRecord } from '../../types/plan';

interface Props {
    records: YearlyRecord[];
}

export default function AssetChart({ records }: Props) {
    // 年金累計を計算
    let pensionAccum = 0;
    const data = records.map((r) => {
        pensionAccum += r.pension;
        return {
            age: r.age,
            '金融資産': r.assets,
            '年金累計': pensionAccum,
            '合計': r.assets + pensionAccum,
        };
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">📈 資産推移</h3>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
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
                        formatter={(value: unknown) => [`${Number(value).toLocaleString()}万円`]}
                        labelFormatter={(age) => `${age}歳`}
                        contentStyle={{
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        }}
                    />
                    <Legend />
                    <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="金融資産" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="年金累計" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="合計" stroke="#22c55e" strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
