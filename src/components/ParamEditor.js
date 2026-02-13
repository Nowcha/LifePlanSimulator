/**
 * パラメータエディタコンポーネント
 * タブ（共通・夫・妻）＋アコーディオン形式で全パラメータを編集可能にする
 */
import { DEFAULT_PARAMS } from '../data/lifeEvents.js';

const TABS = [
  { key: 'common', label: '共通' },
  { key: 'husband', label: '夫' },
  { key: 'wife', label: '妻' },
];

export function createParamEditor(container, paramGroups, onChange, actions = {}) {
  const openSections = new Set();
  let activeTab = 'common';

  function isParamVisible(param, groupParams) {
    if (!param.showWhen) return true;
    const controller = groupParams[param.showWhen.key];
    if (!controller) return true;
    return controller.value === param.showWhen.value;
  }

  function getParamTab(param) {
    return param.tab || 'common';
  }

  function hasParamsForTab(group, tab) {
    return Object.values(group.params).some(param => getParamTab(param) === tab);
  }

  function buildParamHTML(key, param, groupKey, groupParams) {
    if (!isParamVisible(param, groupParams)) return '';

    if (param.options) {
      const radiosHTML = param.options.map(opt => `
        <label class="param-radio-label">
          <input type="radio" 
            name="radio-${key}" 
            class="param-radio" 
            data-group="${groupKey}" 
            data-key="${key}" 
            value="${opt.value}" 
            ${param.value === opt.value ? 'checked' : ''} />
          <span class="param-radio-text">${opt.label}</span>
        </label>
      `).join('');
      return `
        <div class="param-row" data-param-key="${key}">
          <label class="param-label">${param.label}</label>
          <div class="param-radio-group">
            ${radiosHTML}
          </div>
        </div>
      `;
    }
    return `
      <div class="param-row" data-param-key="${key}">
        <label class="param-label" for="param-${key}">${param.label}</label>
        <div class="param-controls">
          <input type="range" 
            id="slider-${key}" 
            class="param-slider" 
            data-group="${groupKey}" 
            data-key="${key}" 
            min="${param.min}" 
            max="${param.max}" 
            step="${param.step}" 
            value="${param.value}" />
          <input type="number" 
            id="param-${key}" 
            class="param-input" 
            data-group="${groupKey}" 
            data-key="${key}" 
            min="${param.min}" 
            max="${param.max}" 
            step="${param.step}" 
            value="${param.value}" />
        </div>
      </div>
    `;
  }

  function buildSectionBodyHTML(groupKey, group, tab) {
    return Object.entries(group.params)
      .filter(([, param]) => getParamTab(param) === tab)
      .map(([key, param]) => buildParamHTML(key, param, groupKey, group.params))
      .join('');
  }

  function attachInputListeners() {
    container.querySelectorAll('.param-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const { group, key } = e.target.dataset;
        const val = parseFloat(e.target.value);
        paramGroups[group].params[key].value = val;
        container.querySelector(`#param-${key}`).value = val;
        onChange(paramGroups);
      });
    });

    container.querySelectorAll('.param-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const { group, key } = e.target.dataset;
        const val = parseFloat(e.target.value);
        paramGroups[group].params[key].value = val;
        container.querySelector(`#slider-${key}`).value = val;
        onChange(paramGroups);
      });
    });

    container.querySelectorAll('.param-radio').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const { group, key } = e.target.dataset;
        const val = parseInt(e.target.value, 10);
        paramGroups[group].params[key].value = val;
        // セクション内を再描画して条件付き表示を更新
        const body = container.querySelector(`#param-body-${group}-${activeTab}`);
        if (body) {
          body.innerHTML = buildSectionBodyHTML(group, paramGroups[group], activeTab);
          attachInputListeners();
        }
        onChange(paramGroups);
      });
    });
  }

  function render() {
    const tabsHTML = TABS.map(tab => `
      <button type="button" class="param-tab ${tab.key === activeTab ? 'active' : ''}" data-tab="${tab.key}">
        ${tab.label}
      </button>
    `).join('');

    const sections = Object.entries(paramGroups)
      .filter(([, group]) => hasParamsForTab(group, activeTab))
      .map(([groupKey, group]) => {
        const paramsHTML = buildSectionBodyHTML(groupKey, group, activeTab);
        if (!paramsHTML.trim()) return '';
        const sectionKey = `${groupKey}-${activeTab}`;
        const isOpen = openSections.has(sectionKey);
        return `
          <div class="param-section">
            <button type="button" class="param-section-header${isOpen ? ' open' : ''}" data-group="${groupKey}" data-section-key="${sectionKey}">
              <span class="param-section-title">${group.label}</span>
              <span class="param-section-toggle">${isOpen ? '▲' : '▼'}</span>
            </button>
            <div class="param-section-body" id="param-body-${sectionKey}" style="display: ${isOpen ? 'block' : 'none'};">
              ${paramsHTML}
            </div>
          </div>
        `;
      })
      .filter(s => s)
      .join('');

    container.innerHTML = `
      <div class="param-editor">
        <div class="param-editor-header">
          <h2 class="section-title">⚙️ パラメータ設定</h2>
          <div class="param-editor-actions">
            <button type="button" class="btn-io-params" id="exportParams" title="JSONファイルに保存">
              📥 エクスポート
            </button>
            <button type="button" class="btn-io-params" id="importParams" title="JSONファイルから読込">
              📤 インポート
            </button>
            <button type="button" class="btn-reset-params" id="resetParams">
              デフォルトに戻す
            </button>
          </div>
        </div>
        <div class="param-tabs">
          ${tabsHTML}
        </div>
        <div class="param-tab-content">
          ${sections}
        </div>
      </div>
    `;

    // タブ切り替え
    container.querySelectorAll('.param-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        render();
      });
    });

    // アコーディオン
    container.querySelectorAll('.param-section-header').forEach(header => {
      header.addEventListener('click', () => {
        const sectionKey = header.dataset.sectionKey;
        const body = container.querySelector(`#param-body-${sectionKey}`);
        const toggle = header.querySelector('.param-section-toggle');
        if (body.style.display === 'none') {
          body.style.display = 'block';
          toggle.textContent = '▲';
          header.classList.add('open');
          openSections.add(sectionKey);
        } else {
          body.style.display = 'none';
          toggle.textContent = '▼';
          header.classList.remove('open');
          openSections.delete(sectionKey);
        }
      });
    });

    attachInputListeners();

    container.querySelector('#resetParams').addEventListener('click', () => {
      for (const [groupKey, group] of Object.entries(DEFAULT_PARAMS)) {
        for (const [key, param] of Object.entries(group.params)) {
          paramGroups[groupKey].params[key].value = param.value;
        }
      }
      render();
      onChange(paramGroups);
    });

    // エクスポート/インポートボタン
    if (actions.onExport) {
      container.querySelector('#exportParams').addEventListener('click', actions.onExport);
    }
    if (actions.onImport) {
      container.querySelector('#importParams').addEventListener('click', actions.onImport);
    }
  }

  render();
}
