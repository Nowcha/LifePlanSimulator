/**
 * メインエントリーポイント
 * 各コンポーネントの初期化とイベント連携
 */
import './style.css';
import { DEFAULT_PARAMS } from './data/lifeEvents.js';
import { runSimulation } from './engine/simulator.js';
import { createInputForm } from './components/InputForm.js';
import { createTimeline } from './components/Timeline.js';
import { createChart } from './components/Chart.js';
import { createParamEditor } from './components/ParamEditor.js';
import { createSummary } from './components/Summary.js';
import {
  saveParamsToLocal,
  saveFamilyToLocal,
  loadParamsFromLocal,
  loadFamilyFromLocal,
  exportToJSON,
  importFromJSON,
} from './utils/storage.js';

// パラメータのディープコピー
function cloneParams(params) {
  return JSON.parse(JSON.stringify(params));
}

// アプリケーション状態
let currentFamily = null;
let currentParams = cloneParams(DEFAULT_PARAMS);
let currentResults = null;
let currentScenario = 'mid';
let debounceTimer = null;

// LocalStorageから復元
const savedFamily = loadFamilyFromLocal();
loadParamsFromLocal(currentParams);

// DOM要素
const inputSection = document.getElementById('inputSection');
const resultsSection = document.getElementById('resultsSection');
const summarySection = document.getElementById('summarySection');
const chartSection = document.getElementById('chartSection');
const timelineSection = document.getElementById('timelineSection');
const paramSection = document.getElementById('paramSection');

/**
 * シミュレーション実行＆結果描画
 */
function executeSimulation() {
  if (!currentFamily) return;

  currentResults = runSimulation(currentFamily, currentParams, currentScenario);

  // 結果セクション表示
  resultsSection.style.display = 'block';

  // 各コンポーネント描画
  createSummary(summarySection, currentResults);
  createChart(chartSection, currentResults, currentScenario, onScenarioChange);
  createTimeline(timelineSection, currentResults);

  // スムーズスクロール
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * シナリオ変更時のハンドラ
 */
function onScenarioChange(scenario) {
  currentScenario = scenario;
  executeSimulation();
}

/**
 * パラメータ変更時のデバウンス付き再計算
 */
function onParamChange(newParams) {
  currentParams = newParams;
  saveParamsToLocal(currentParams); // 自動保存
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    executeSimulation();
  }, 300);
}

/**
 * JSONエクスポートハンドラ
 */
function onExport() {
  exportToJSON(currentParams, currentFamily);
}

/**
 * JSONインポートハンドラ
 */
function onImport() {
  importFromJSON(currentParams)
    .then(({ family, params }) => {
      currentParams = params;
      if (family) {
        currentFamily = family;
        saveFamilyToLocal(currentFamily);
      }
      saveParamsToLocal(currentParams);
      // パラメータエディタを再描画
      createParamEditor(paramSection, currentParams, onParamChange, { onExport, onImport });
      executeSimulation();
    })
    .catch(err => {
      alert(err.message);
    });
}

/**
 * フォーム送信時のハンドラ
 */
function onFormSubmit(family) {
  currentFamily = family;
  saveFamilyToLocal(currentFamily); // 自動保存

  // パラメータエディタの初期化
  createParamEditor(paramSection, currentParams, onParamChange, { onExport, onImport });

  executeSimulation();
}

// 入力フォームを初期化（保存データがあれば渡す）
createInputForm(inputSection, onFormSubmit, savedFamily);
