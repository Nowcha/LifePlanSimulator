// ライフプランシミュレーター 型定義

/** 子どもの情報 */
export interface Child {
    age: number;
}

/** ライフイベント */
export interface LifeEvent {
    id: string;
    name: string;
    age: number;
    cost: number; // 万円
}

/** ライフイベントプリセット */
export type LifeEventPreset = '住宅購入' | '車購入' | '子ども教育費' | '結婚' | 'リフォーム';

/** プリセットのデフォルト費用（万円） */
export const PRESET_COSTS: Record<LifeEventPreset, number> = {
    '住宅購入': 4000,
    '車購入': 300,
    '子ども教育費': 1000,
    '結婚': 350,
    'リフォーム': 500,
};

/** STEP1: 基本情報 */
export interface BasicInfo {
    currentAge: number;
    gender: '男性' | '女性' | 'その他';
    hasSpouse: boolean;
    spouseAge: number;
    children: Child[];
}

/** STEP2: 収入 */
export interface Income {
    annualIncome: number;       // 手取り年収（万円）
    raiseRate: number;          // 年間昇給率（%）
    bonus: number;              // ボーナス年間（万円）
    spouseIncome: number;       // 配偶者の手取り年収（万円）
    spouseRaiseRate: number;    // 配偶者の昇給率（%）
    sideIncome: number;         // 副業収入年間（万円）
    retirementAge: number;      // 退職年齢
    severancePay: number;       // 退職金見込み額（万円）
    pensionStartAge: number;    // 年金受給開始年齢
    monthlyPension: number;     // 月額年金見込み（万円）
}

/** STEP3: 支出 */
export interface Expense {
    monthlyLiving: number;      // 毎月の生活費（万円）（住居費除く）
    monthlyHousing: number;     // 住居費（万円/月）
    monthlyInsurance: number;   // 保険料（万円/月）
    inflationRate: number;      // インフレ率（%）
    lifeEvents: LifeEvent[];    // ライフイベント
}

/** STEP4: 資産・投資 */
export interface Assets {
    currentAssets: number;          // 現在の金融資産（万円）
    monthlyInvestment: number;      // 毎月の積立投資額（万円）
    expectedReturn: number;         // 想定年間利回り（%）
    monthlyIdeco: number;           // iDeCo積立額（万円/月）
    idecoReturn: number;            // iDeCo想定利回り（%）
    mortgageBalance: number;        // 住宅ローン残高（万円）
    mortgageRate: number;           // 住宅ローン金利（%）
    mortgageYearsLeft: number;      // ローン残年数
}

/** STEP5: リスク設定 */
export interface RiskSettings {
    emergencyMonths: number;        // 緊急予備資金の目標（月数）
    retirementMonthlyExpense: number; // 老後の生活費目標（万円/月）
    simulationEndAge: number;       // シミュレーション終了年齢
}

/** 全入力データ */
export interface PlanInput {
    basic: BasicInfo;
    income: Income;
    expense: Expense;
    assets: Assets;
    risk: RiskSettings;
}

/** 年次計算結果 */
export interface YearlyRecord {
    age: number;
    income: number;            // 給与 + ボーナス + 副業 + 年金
    salary: number;            // 給与（本人）
    spouseSalary: number;      // 給与（配偶者）
    pension: number;           // 年金
    sideIncome: number;        // 副業
    expense: number;           // 生活費 + 住居費 + 保険 + イベント費
    livingExpense: number;     // 生活費
    housingExpense: number;    // 住居費
    insuranceExpense: number;  // 保険料
    educationExpense: number;  // 教育費
    eventExpense: number;      // ライフイベント費
    netCashflow: number;       // income - expense
    investmentGain: number;    // 投資収益
    idecoBalance: number;      // iDeCo残高
    assets: number;            // 資産残高
    events: string[];          // 発生したイベント名リスト
}

/** シミュレーション結果 */
export interface SimulationResult {
    records: YearlyRecord[];
    totalIncome: number;       // 生涯収入合計
    totalExpense: number;      // 生涯支出合計
    peakAssets: number;        // 老後資金ピーク額
    depletionAge: number | null; // 資産が尽きる年齢（null=尽きない）
    finalAssets: number;       // 最終年の資産残高
}

/** デフォルト入力値 */
export const DEFAULT_INPUT: PlanInput = {
    basic: {
        currentAge: 30,
        gender: '男性',
        hasSpouse: false,
        spouseAge: 28,
        children: [],
    },
    income: {
        annualIncome: 400,
        raiseRate: 1.5,
        bonus: 80,
        spouseIncome: 0,
        spouseRaiseRate: 1.0,
        sideIncome: 0,
        retirementAge: 65,
        severancePay: 1000,
        pensionStartAge: 65,
        monthlyPension: 15,
    },
    expense: {
        monthlyLiving: 15,
        monthlyHousing: 8,
        monthlyInsurance: 2,
        inflationRate: 2.0,
        lifeEvents: [],
    },
    assets: {
        currentAssets: 300,
        monthlyInvestment: 3,
        expectedReturn: 4.0,
        monthlyIdeco: 2.3,
        idecoReturn: 3.0,
        mortgageBalance: 0,
        mortgageRate: 1.0,
        mortgageYearsLeft: 0,
    },
    risk: {
        emergencyMonths: 6,
        retirementMonthlyExpense: 20,
        simulationEndAge: 100,
    },
};
