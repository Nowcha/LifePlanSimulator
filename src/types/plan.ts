// ライフプランシミュレーター v2 — 全データモデル型定義

// === 基本情報 ===
export type Gender = '男性' | '女性' | 'その他';
export type Region = '北海道' | '東北' | '関東' | '中部' | '近畿' | '中国' | '四国' | '九州・沖縄';
export type EducationPolicy = '公立' | '私立';
export type RepaymentMethod = '元利均等' | '元金均等';
export type WithdrawalMethod = '定額' | '定率';
export type ScenarioType = '楽観' | '基本' | '悲観';
export type PensionSystem = '厚生年金' | '国民年金' | '共済年金';
export type AssetType = '預金' | '株式' | '投資信託' | '債券' | 'NISA' | 'iDeCo' | 'その他';

/** 子どもの情報 */
export interface Child {
    id: string;
    birthYear: number;
    birthMonth: number;
    educationPolicy: EducationPolicy;
}

/** 基本情報 */
export interface BasicInfo {
    name: string;
    birthYear: number;
    birthMonth: number;
    gender: Gender;
    hasSpouse: boolean;
    spouseBirthYear: number;
    spouseBirthMonth: number;
    children: Child[];
    region: Region;
    lifeExpectancy: number;       // 想定寿命（自身）
    spouseLifeExpectancy: number; // 想定寿命（配偶者）
}

// === 収入 ===

/** 勤労収入 */
export interface EmploymentIncome {
    annualIncome: number;         // 年収（税込、万円）
    raiseRate: number;            // 昇給率（%）
    bonusMonths: number;          // 賞与月数
    severancePay: number;         // 退職金見込み（万円）
    retirementAge: number;        // 定年年齢
    reemploymentIncome: number;   // 再雇用収入（万円）
    reemploymentEndAge: number;   // 再雇用終了年齢
}

/** 年金情報 */
export interface PensionInfo {
    system: PensionSystem;
    startAge: number;             // 受給開始年齢
    monthlyAmount: number;        // 月額見込み（万円）
}

/** 企業年金/iDeCo */
export interface CorporatePension {
    balance: number;              // 残高（万円）
    monthlyContribution: number;  // 月額拠出（万円）
    expectedReturn: number;       // 想定利回り（%）
}

/** 相続見込み */
export interface InheritanceInfo {
    expectedAge: number;          // 発生予想年齢
    amount: number;               // 金額（万円）
}

/** その他の定期収入 */
export interface OtherIncome {
    realEstateIncome: number;     // 不動産収入（年間、万円）
    dividendIncome: number;       // 配当収入（年間、万円）
    inheritance: InheritanceInfo;
}

/** 収入情報まとめ */
export interface IncomeInfo {
    employment: EmploymentIncome;
    spouseEmployment: EmploymentIncome;
    pension: PensionInfo;
    spousePension: PensionInfo;
    corporatePension: CorporatePension;
    otherIncome: OtherIncome;
}

// === 支出 ===

/** 基本生活費（月額、万円） */
export interface LivingExpense {
    food: number;           // 食費
    utilities: number;      // 光熱費
    communication: number;  // 通信費
    dailyGoods: number;     // 日用品
    clothing: number;       // 被服費
    social: number;         // 交際費
    transportation: number; // 交通費
    miscellaneous: number;  // 雑費
}

/** 住宅ローン詳細 */
export interface MortgageDetail {
    principal: number;       // 借入額（万円）
    interestRate: number;    // 金利（%）
    termYears: number;       // 期間（年）
    method: RepaymentMethod; // 返済方式
    startAge: number;        // 借入開始年齢
}

/** リフォーム計画 */
export interface RenovationPlan {
    id: string;
    age: number;
    cost: number; // 万円
}

/** 住居情報 */
export interface HousingInfo {
    isOwner: boolean;             // 持家フラグ
    monthlyRent: number;          // 家賃（月額、万円）※賃貸の場合
    mortgage: MortgageDetail;     // ローン詳細 ※持家の場合
    managementFee: number;        // 管理費（月額、万円）
    propertyTax: number;          // 固定資産税（年額、万円）
    renovations: RenovationPlan[];
}

/** 保険情報（月額、万円） */
export interface InsuranceInfo {
    lifeInsurance: number;    // 生命保険
    medicalInsurance: number; // 医療保険
    carInsurance: number;     // 自動車保険
}

/** 自動車情報 */
export interface CarInfo {
    hasCar: boolean;
    purchaseCycleYears: number;  // 購入サイクル（年）
    purchaseCost: number;        // 購入費用（万円）
    annualMaintenance: number;   // 年間維持費（万円）
}

/** ライフイベント */
export interface LifeEvent {
    id: string;
    name: string;
    age: number;
    cost: number; // 万円
}

/** 支出情報まとめ */
export interface ExpenseInfo {
    living: LivingExpense;
    housing: HousingInfo;
    insurance: InsuranceInfo;
    car: CarInfo;
    lifeEvents: LifeEvent[];
}

// === 投資・運用 ===

/** 資産内訳アイテム */
export interface AssetItem {
    type: AssetType;
    balance: number; // 万円
}

/** アセットアロケーション */
export interface AssetAllocation {
    stockRatio: number;   // 株式比率（%）
    bondRatio: number;    // 債券比率（%）
    cashRatio: number;    // 現金比率（%）
    stockReturn: number;  // 株式想定リターン（%）
    bondReturn: number;   // 債券想定リターン（%）
    cashReturn: number;   // 現金想定リターン（%）
    stockStdDev: number;  // 株式標準偏差（%）
    bondStdDev: number;   // 債券標準偏差（%）
}

/** 投資情報まとめ */
export interface InvestmentInfo {
    assets: AssetItem[];
    allocation: AssetAllocation;
    monthlyInvestment: number;    // 毎月の積立額（万円）
    nisaAnnual: number;           // NISA年間活用額（万円）
    withdrawalStartAge: number;   // 取り崩し開始年齢
    withdrawalMethod: WithdrawalMethod;
    withdrawalAmount: number;     // 定額の場合の年額（万円）
    withdrawalRate: number;       // 定率の場合（%）
}

// === 外部環境 ===

/** 外部環境パラメータ */
export interface ExternalEnv {
    generalInflation: number;    // 一般インフレ率（%）
    educationInflation: number;  // 教育費インフレ率（%）
    medicalInflation: number;    // 医療費インフレ率（%）
    wageGrowthRate: number;      // 賃金上昇率（%）
    depositRate: number;         // 預金金利（%）
}

// === シミュレーション設定 ===

/** シミュレーション設定 */
export interface SimulationConfig {
    endAge: number;               // シミュレーション終了年齢
    scenario: ScenarioType;       // シナリオ種別
    monteCarloTrials: number;     // モンテカルロ試行回数
}

// === 全入力データ ===

export interface PlanInput {
    basic: BasicInfo;
    income: IncomeInfo;
    expense: ExpenseInfo;
    investment: InvestmentInfo;
    environment: ExternalEnv;
    config: SimulationConfig;
}

// === 出力 ===

/** 年次計算結果 */
export interface YearlyRecord {
    age: number;
    year: number;
    // 収入内訳
    grossIncome: number;         // 税引前収入合計
    salary: number;              // 給与（本人）
    spouseSalary: number;        // 給与（配偶者）
    pensionIncome: number;       // 年金
    investmentIncome: number;    // 運用益
    otherIncome: number;         // その他
    // 税・社保
    incomeTax: number;           // 所得税
    residentTax: number;         // 住民税
    socialInsurance: number;     // 社会保険料
    netIncome: number;           // 手取り収入
    // 支出内訳
    totalExpense: number;        // 支出合計
    livingExpense: number;       // 生活費
    housingExpense: number;      // 住居費
    educationExpense: number;    // 教育費
    insuranceExpense: number;    // 保険料
    carExpense: number;          // 自動車費
    eventExpense: number;        // ライフイベント費
    // 収支・資産
    netCashflow: number;         // 手取り - 支出
    totalAssets: number;         // 資産残高
    // イベント
    events: string[];
}

/** シナリオ別結果 */
export interface ScenarioResult {
    scenario: ScenarioType;
    records: YearlyRecord[];
    totalIncome: number;
    totalExpense: number;
    peakAssets: number;
    depletionAge: number | null;
    finalAssets: number;
}

/** モンテカルロ結果 */
export interface MonteCarloResult {
    percentiles: {
        age: number;
        p5: number;
        p25: number;
        p50: number;
        p75: number;
        p95: number;
    }[];
    successRate: number;  // 資産が枯渇しない確率（%）
}

/** シミュレーション全体の結果 */
export interface SimulationResult {
    baseResult: ScenarioResult;
    optimisticResult: ScenarioResult;
    pessimisticResult: ScenarioResult;
    monteCarlo: MonteCarloResult;
}
