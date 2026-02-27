// localStorage を使ったデータ永続化フック
import { useState, useEffect, useCallback } from 'react';

/**
 * localStorageに自動保存・復元するカスタムフック
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // 初期値の読み込み
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    // localStorageへの保存
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(storedValue));
        } catch {
            // ストレージが一杯の場合は無視
        }
    }, [key, storedValue]);

    // リセット関数
    const reset = useCallback(() => {
        setStoredValue(initialValue);
        localStorage.removeItem(key);
    }, [key, initialValue]);

    return [storedValue, setStoredValue, reset];
}
