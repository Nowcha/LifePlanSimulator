/**
 * データ保存・復元ユーティリティ
 * - LocalStorage自動保存/復元
 * - JSONエクスポート/インポート
 */

const STORAGE_KEY_PARAMS = 'lifePlanSim_params';
const STORAGE_KEY_FAMILY = 'lifePlanSim_family';

/**
 * パラメータをLocalStorageに保存
 */
export function saveParamsToLocal(paramGroups) {
    try {
        // 値のみを保存（定義情報は不要）
        const flat = {};
        for (const [groupKey, group] of Object.entries(paramGroups)) {
            flat[groupKey] = {};
            for (const [key, param] of Object.entries(group.params)) {
                flat[groupKey][key] = param.value;
            }
        }
        localStorage.setItem(STORAGE_KEY_PARAMS, JSON.stringify(flat));
    } catch (e) {
        console.warn('パラメータの保存に失敗:', e);
    }
}

/**
 * 家族情報をLocalStorageに保存
 */
export function saveFamilyToLocal(family) {
    try {
        localStorage.setItem(STORAGE_KEY_FAMILY, JSON.stringify(family));
    } catch (e) {
        console.warn('家族情報の保存に失敗:', e);
    }
}

/**
 * LocalStorageからパラメータ値を復元してparamGroupsに適用
 */
export function loadParamsFromLocal(paramGroups) {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_PARAMS);
        if (!raw) return false;
        const saved = JSON.parse(raw);
        applyValues(paramGroups, saved);
        return true;
    } catch (e) {
        console.warn('パラメータの復元に失敗:', e);
        return false;
    }
}

/**
 * LocalStorageから家族情報を復元
 */
export function loadFamilyFromLocal() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY_FAMILY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn('家族情報の復元に失敗:', e);
        return null;
    }
}

/**
 * 保存データの値をparamGroupsに適用
 */
function applyValues(paramGroups, saved) {
    for (const [groupKey, groupValues] of Object.entries(saved)) {
        if (!paramGroups[groupKey]) continue;
        for (const [key, value] of Object.entries(groupValues)) {
            if (paramGroups[groupKey].params[key] !== undefined) {
                paramGroups[groupKey].params[key].value = value;
            }
        }
    }
}

/**
 * パラメータ＋家族情報をJSONファイルとしてエクスポート
 */
export function exportToJSON(paramGroups, family) {
    const flat = {};
    for (const [groupKey, group] of Object.entries(paramGroups)) {
        flat[groupKey] = {};
        for (const [key, param] of Object.entries(group.params)) {
            flat[groupKey][key] = param.value;
        }
    }

    const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        family: family || null,
        params: flat,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `lifeplan_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * JSONファイルからインポート
 * @returns {Promise<{family, params}>} 復元した家族情報とパラメータ値
 */
export function importFromJSON(paramGroups) {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) {
                reject(new Error('ファイルが選択されませんでした'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    if (!data.params) {
                        reject(new Error('無効なファイル形式です'));
                        return;
                    }
                    applyValues(paramGroups, data.params);
                    resolve({ family: data.family || null, params: paramGroups });
                } catch (err) {
                    reject(new Error('ファイルの読み込みに失敗しました: ' + err.message));
                }
            };
            reader.readAsText(file);
        });

        input.click();
    });
}

/**
 * LocalStorageの保存データをクリア
 */
export function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY_PARAMS);
    localStorage.removeItem(STORAGE_KEY_FAMILY);
}
