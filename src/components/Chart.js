/**
 * チャートコンポーネント
 * Chart.jsを使用して収支・資産推移グラフを描画
 * みんなの銀行風モノトーンカラースキーム
 */
import { Chart, registerables } from 'chart.js';
import { formatMan, formatManShort } from '../utils/format.js';
Chart.register(...registerables);

let chartInstance = null;

export function createChart(container, results, currentScenario = 'mid', onScenarioChange = null) {
    container.innerHTML = `
    <div class="chart-container">
      <h2 class="section-title">📊 収支・資産推移グラフ</h2>
      <div class="chart-tabs">
        <button class="chart-tab active" data-chart="balance">資産残高推移</button>
        <button class="chart-tab" data-chart="cashflow">年間収支</button>
        <button class="chart-tab" data-chart="investment">投資推移</button>
      </div>
      <div class="scenario-selector" id="scenarioSelector" style="display:none;">
        <span class="scenario-label">収支に反映するシナリオ:</span>
        <button class="scenario-btn ${currentScenario === 'low' ? 'active' : ''}" data-scenario="low">📉 悲観</button>
        <button class="scenario-btn ${currentScenario === 'mid' ? 'active' : ''}" data-scenario="mid">⚖️ 標準</button>
        <button class="scenario-btn ${currentScenario === 'high' ? 'active' : ''}" data-scenario="high">📈 楽観</button>
      </div>
      <div class="chart-wrapper">
        <canvas id="mainChart"></canvas>
      </div>
      <div class="chart-legend-custom" id="chartLegend"></div>
    </div>
  `;

    const canvas = container.querySelector('#mainChart');
    const tabs = container.querySelectorAll('.chart-tab');
    const scenarioSelector = container.querySelector('#scenarioSelector');
    const scenarioBtns = container.querySelectorAll('.scenario-btn');

    let currentView = 'balance';

    function renderChart(view) {
        if (chartInstance) {
            chartInstance.destroy();
        }

        const labels = results.map(r => `${r.year}\n(${r.age}歳)`);

        let config;
        if (view === 'balance') {
            config = getBalanceConfig(labels, results);
        } else if (view === 'cashflow') {
            config = getCashflowConfig(labels, results);
        } else {
            config = getInvestmentConfig(labels, results, currentScenario);
        }

        // 投資タブ時のみシナリオ選択を表示
        scenarioSelector.style.display = view === 'investment' ? 'flex' : 'none';

        chartInstance = new Chart(canvas, config);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentView = tab.dataset.chart;
            renderChart(currentView);
        });
    });

    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const scenario = btn.dataset.scenario;
            if (onScenarioChange) {
                onScenarioChange(scenario);
            }
        });
    });

    renderChart(currentView);
}

function getBalanceConfig(labels, results) {
    // 5年ごとのラベルにフィルタリング
    const filteredLabels = labels.map((label, i) => {
        if (i === 0 || i === labels.length - 1 || i % 5 === 0) return label;
        return '';
    });

    const balanceData = results.map(r => r.balance);

    return {
        type: 'line',
        data: {
            labels: filteredLabels,
            datasets: [{
                label: '資産残高（万円）',
                data: balanceData,
                borderColor: '#1A1A1A',
                backgroundColor: (ctx) => {
                    const chart = ctx.chart;
                    const { ctx: canvasCtx, chartArea } = chart;
                    if (!chartArea) return 'rgba(26, 26, 26, 0.05)';
                    const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(26, 26, 26, 0.12)');
                    gradient.addColorStop(1, 'rgba(26, 26, 26, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: (ctx) => {
                    const idx = ctx.dataIndex;
                    return results[idx] && results[idx].events.length > 0 ? 4 : 1;
                },
                pointBackgroundColor: (ctx) => {
                    const idx = ctx.dataIndex;
                    if (results[idx] && results[idx].balance < 0) return '#D32F2F';
                    return '#1A1A1A';
                },
                segment: {
                    borderColor: ctx => {
                        const idx = ctx.p1DataIndex;
                        return results[idx] && results[idx].balance < 0 ? '#D32F2F' : '#1A1A1A';
                    },
                },
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: '#1A1A1A',
                    titleColor: '#FFFFFF',
                    bodyColor: 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title(items) {
                            const idx = items[0].dataIndex;
                            const r = results[idx];
                            return `${r.year}年（夫${r.age}歳 / 妻${r.wifeAge}歳）`;
                        },
                        afterTitle(items) {
                            const idx = items[0].dataIndex;
                            const r = results[idx];
                            if (r.events.length > 0) {
                                return '📌 ' + r.events.map(e => e.label).join('、');
                            }
                            return '';
                        },
                        label(item) {
                            return `資産残高: ${formatMan(item.raw)}`;
                        },
                        afterLabel(item) {
                            const idx = item.dataIndex;
                            const r = results[idx];
                            return `収入: ${formatMan(r.income)} / 支出: ${formatMan(r.expense)}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#9E9E9E',
                        maxRotation: 0,
                        font: { size: 10 },
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.04)',
                    },
                },
                y: {
                    ticks: {
                        color: '#9E9E9E',
                        callback: (v) => formatManShort(v),
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
    };
}

function getCashflowConfig(labels, results) {
    const filteredLabels = labels.map((label, i) => {
        if (i === 0 || i === labels.length - 1 || i % 5 === 0) return label;
        return '';
    });

    return {
        type: 'bar',
        data: {
            labels: filteredLabels,
            datasets: [
                {
                    label: '収入（万円）',
                    data: results.map(r => r.income),
                    backgroundColor: 'rgba(0, 0, 255, 0.65)',
                    borderColor: '#0000FF',
                    borderWidth: 1,
                    borderRadius: 2,
                    stack: 'bar',
                },
                {
                    label: '支出（万円）',
                    data: results.map(r => -r.expense),
                    backgroundColor: 'rgba(255, 0, 0, 0.55)',
                    borderColor: '#FF0000',
                    borderWidth: 1,
                    borderRadius: 2,
                    stack: 'bar',
                },
                {
                    type: 'line',
                    label: '年間収支（万円）',
                    data: results.map(r => Math.round((r.income - r.expense) * 10) / 10),
                    borderColor: '#1A1A1A',
                    backgroundColor: 'rgba(26, 26, 26, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    tension: 0.3,
                    fill: false,
                    order: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#6B6B6B',
                        usePointStyle: true,
                        padding: 20,
                    },
                },
                tooltip: {
                    backgroundColor: '#1A1A1A',
                    titleColor: '#FFFFFF',
                    bodyColor: 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title(items) {
                            const idx = items[0].dataIndex;
                            const r = results[idx];
                            return `${r.year}年（夫${r.age}歳 / 妻${r.wifeAge}歳）`;
                        },
                        label(item) {
                            const v = item.raw;
                            if (item.dataset.label === '年間収支（万円）') {
                                return `${item.dataset.label}: ${formatMan(v, true)}`;
                            }
                            return `${item.dataset.label}: ${formatMan(Math.abs(v))}`;
                        },
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: '#9E9E9E',
                    maxRotation: 0,
                    font: { size: 10 },
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.04)',
                },
            },
            y: {
                stacked: true,
                ticks: {
                    color: '#9E9E9E',
                    callback: (v) => formatManShort(v),
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.04)',
                },
            },
        },
    };
}

function getInvestmentConfig(labels, results, currentScenario) {
    const filteredLabels = labels.map((label, i) => {
        if (i === 0 || i === labels.length - 1 || i % 5 === 0) return label;
        return '';
    });

    const lowData = results.map(r => r.investmentScenarios ? r.investmentScenarios.low.balance : 0);
    const midData = results.map(r => r.investmentScenarios ? r.investmentScenarios.mid.balance : 0);
    const highData = results.map(r => r.investmentScenarios ? r.investmentScenarios.high.balance : 0);

    // 選択中シナリオのスタイルを強調（モノトーン）
    const scenarioStyles = {
        low: {
            borderColor: currentScenario === 'low' ? '#FF0000' : 'rgba(255, 0, 0, 0.35)',
            borderWidth: currentScenario === 'low' ? 3 : 1.5,
            borderDash: currentScenario === 'low' ? [] : [6, 4],
            fill: currentScenario === 'low',
            bgColor: 'rgba(255, 0, 0, 0.08)',
        },
        mid: {
            borderColor: currentScenario === 'mid' ? '#fd7e00' : 'rgba(253, 126, 0, 0.35)',
            borderWidth: currentScenario === 'mid' ? 3 : 1.5,
            borderDash: currentScenario === 'mid' ? [] : [6, 4],
            fill: currentScenario === 'mid',
            bgColor: 'rgba(253, 126, 0, 0.08)',
        },
        high: {
            borderColor: currentScenario === 'high' ? '#0000FF' : 'rgba(0, 0, 255, 0.35)',
            borderWidth: currentScenario === 'high' ? 3 : 1.5,
            borderDash: currentScenario === 'high' ? [] : [6, 4],
            fill: currentScenario === 'high',
            bgColor: 'rgba(0, 0, 255, 0.08)',
        },
    };

    return {
        type: 'line',
        data: {
            labels: filteredLabels,
            datasets: [
                {
                    label: '悲観シナリオ（万円）',
                    data: lowData,
                    borderColor: scenarioStyles.low.borderColor,
                    backgroundColor: scenarioStyles.low.fill ? scenarioStyles.low.bgColor : 'transparent',
                    fill: scenarioStyles.low.fill,
                    borderDash: scenarioStyles.low.borderDash,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: scenarioStyles.low.borderWidth,
                },
                {
                    label: '標準シナリオ（万円）',
                    data: midData,
                    borderColor: scenarioStyles.mid.borderColor,
                    backgroundColor: scenarioStyles.mid.fill ? scenarioStyles.mid.bgColor : 'transparent',
                    fill: scenarioStyles.mid.fill,
                    borderDash: scenarioStyles.mid.borderDash,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: scenarioStyles.mid.borderWidth,
                },
                {
                    label: '楽観シナリオ（万円）',
                    data: highData,
                    borderColor: scenarioStyles.high.borderColor,
                    backgroundColor: scenarioStyles.high.fill ? scenarioStyles.high.bgColor : 'transparent',
                    fill: scenarioStyles.high.fill,
                    borderDash: scenarioStyles.high.borderDash,
                    tension: 0.3,
                    pointRadius: 0,
                    borderWidth: scenarioStyles.high.borderWidth,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#6B6B6B',
                        usePointStyle: true,
                        padding: 20,
                    },
                },
                tooltip: {
                    backgroundColor: '#1A1A1A',
                    titleColor: '#FFFFFF',
                    bodyColor: 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        title(items) {
                            const idx = items[0].dataIndex;
                            const r = results[idx];
                            return `${r.year}年（夫${r.age}歳 / 妻${r.wifeAge}歳）`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#9E9E9E',
                        maxRotation: 0,
                        font: { size: 10 },
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.04)',
                    },
                },
                y: {
                    ticks: {
                        color: '#9E9E9E',
                        callback: (v) => formatManShort(v),
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
    };
}
