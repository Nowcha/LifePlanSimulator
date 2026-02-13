/**
 * サマリーコンポーネント
 * 生涯収支のサマリーカードを表示
 */
import { formatMan } from '../utils/format.js';

export function createSummary(container, results) {
  const totalIncome = results.reduce((sum, r) => sum + r.income, 0);
  const totalExpense = results.reduce((sum, r) => sum + r.expense, 0);
  const finalBalance = results[results.length - 1].balance;
  const minBalance = Math.min(...results.map(r => r.balance));
  const minBalanceYear = results.find(r => r.balance === minBalance);
  const negativeYear = results.find(r => r.balance < 0);

  const lastResult = results[results.length - 1];
  const invScenarios = lastResult.investmentScenarios || { low: { balance: 0 }, mid: { balance: 0 }, high: { balance: 0 } };

  container.innerHTML = `
    <div class="summary-container">
      <h2 class="section-title">📋 生涯収支サマリー</h2>
      <div class="summary-cards">
        <div class="summary-card income-card">
          <div class="summary-card-icon">💰</div>
          <div class="summary-card-content">
            <span class="summary-label">生涯総収入</span>
            <span class="summary-value positive">${formatMan(totalIncome)}</span>
          </div>
        </div>
        <div class="summary-card expense-card">
          <div class="summary-card-icon">💸</div>
          <div class="summary-card-content">
            <span class="summary-label">生涯総支出</span>
            <span class="summary-value negative">${formatMan(totalExpense)}</span>
          </div>
        </div>
        <div class="summary-card balance-card ${finalBalance < 0 ? 'danger' : ''}">
          <div class="summary-card-icon">${finalBalance >= 0 ? '✅' : '⚠️'}</div>
          <div class="summary-card-content">
            <span class="summary-label">最終資産残高</span>
            <span class="summary-value ${finalBalance >= 0 ? 'positive' : 'negative'}">${formatMan(finalBalance)}</span>
          </div>
        </div>
        <div class="summary-card min-card ${minBalance < 0 ? 'danger' : ''}">
          <div class="summary-card-icon">📉</div>
          <div class="summary-card-content">
            <span class="summary-label">資産最低額</span>
            <span class="summary-value ${minBalance >= 0 ? '' : 'negative'}">${formatMan(minBalance)}</span>
            <span class="summary-detail">${minBalanceYear.year}年（${minBalanceYear.age}歳時）</span>
          </div>
        </div>
        <div class="summary-card investment-card investment-scenarios-card">
          <div class="summary-card-icon">📈</div>
          <div class="summary-card-content">
            <span class="summary-label">投資残高（最終）</span>
            <div class="investment-scenarios">
              <div class="scenario-item scenario-low">
                <span class="scenario-tag">悲観</span>
                <span class="scenario-value">${formatMan(invScenarios.low.balance)}</span>
              </div>
              <div class="scenario-item scenario-mid">
                <span class="scenario-tag">標準</span>
                <span class="scenario-value">${formatMan(invScenarios.mid.balance)}</span>
              </div>
              <div class="scenario-item scenario-high">
                <span class="scenario-tag">楽観</span>
                <span class="scenario-value">${formatMan(invScenarios.high.balance)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${negativeYear ? `
        <div class="summary-alert">
          <span class="alert-icon">⚠️</span>
          <span class="alert-text">
            <strong>${negativeYear.year}年（${negativeYear.age}歳時）に資産がマイナスになります。</strong><br />
            収入増加・支出削減・資産運用などの対策を検討しましょう。
          </span>
        </div>
      ` : `
        <div class="summary-ok">
          <span class="alert-icon">✅</span>
          <span class="alert-text">シミュレーション期間中、資産はプラスを維持できる見込みです。</span>
        </div>
      `}
    </div>
  `;
}
