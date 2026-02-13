/**
 * 金額フォーマットユーティリティ
 * 万円単位の数値を「億」「万円」表記に変換
 */

/**
 * 万円単位の数値を「X億Y万円」形式にフォーマット
 * @param {number} value - 万円単位の数値
 * @param {boolean} showSign - 符号を表示するか
 * @returns {string} フォーマットされた文字列
 */
export function formatMan(value, showSign = false) {
    const abs = Math.abs(Math.round(value));
    const sign = value < 0 ? '-' : (showSign && value > 0 ? '+' : '');
    const oku = Math.floor(abs / 10000);
    const man = abs % 10000;

    if (oku > 0 && man > 0) {
        return `${sign}${oku.toLocaleString()}億${man.toLocaleString()}万円`;
    } else if (oku > 0) {
        return `${sign}${oku.toLocaleString()}億円`;
    } else {
        return `${sign}${man.toLocaleString()}万円`;
    }
}

/**
 * 軸ラベル用の短縮フォーマット（「円」なし）
 * @param {number} value - 万円単位の数値
 * @returns {string}
 */
export function formatManShort(value) {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    const oku = Math.floor(abs / 10000);
    const man = abs % 10000;

    if (oku > 0 && man > 0) {
        return `${sign}${oku}億${man.toLocaleString()}万`;
    } else if (oku > 0) {
        return `${sign}${oku}億`;
    } else {
        return `${sign}${man.toLocaleString()}万`;
    }
}
