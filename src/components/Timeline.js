/**
 * タイムラインコンポーネント
 * ライフイベントを年表形式で表示
 */
import { CATEGORIES } from '../data/lifeEvents.js';
import { formatMan } from '../utils/format.js';

export function createTimeline(container, results) {
  // イベントがある年のみフィルタ
  const eventYears = results.filter(r => r.events.length > 0);

  if (eventYears.length === 0) {
    container.innerHTML = '<p class="no-events">ライフイベントが見つかりませんでした</p>';
    return;
  }

  const timelineHTML = eventYears.map(yearData => {
    const eventsHTML = yearData.events.map(ev => {
      const cat = CATEGORIES[ev.category] || { icon: '📌', label: 'その他', color: '#888' };
      const costText = ev.cost > 0 ? `<span class="event-cost expense">-${formatMan(ev.cost)}</span>` : '';
      const incomeText = ev.income > 0 ? `<span class="event-cost income">+${formatMan(ev.income)}</span>` : '';
      return `
        <div class="timeline-event" style="--event-color: ${cat.color}">
          <span class="event-icon">${cat.icon}</span>
          <span class="event-label">${ev.label}</span>
          ${costText}${incomeText}
        </div>
      `;
    }).join('');

    const childrenAges = yearData.children
      .filter(c => c.age !== null && c.age >= 0)
      .map(c => `第${c.index + 1}子: ${c.age}歳`)
      .join('  ');

    return `
      <div class="timeline-year ${yearData.balance < 0 ? 'negative-balance' : ''}">
        <div class="timeline-year-marker">
          <div class="year-badge">${yearData.year}年</div>
          <div class="age-info">
            <span>夫 ${yearData.age}歳</span>
            <span>妻 ${yearData.wifeAge}歳</span>
          </div>
          ${childrenAges ? `<div class="children-ages">${childrenAges}</div>` : ''}
        </div>
        <div class="timeline-events">
          ${eventsHTML}
        </div>
        <div class="timeline-balance">
          <span class="balance-label">資産残高</span>
          <span class="balance-value ${yearData.balance < 0 ? 'negative' : ''}">${formatMan(yearData.balance)}</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="timeline-container">
      <h2 class="section-title">📅 ライフイベント タイムライン</h2>
      <div class="timeline">
        ${timelineHTML}
      </div>
    </div>
  `;
}
