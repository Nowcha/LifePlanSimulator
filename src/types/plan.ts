// ========== 基本情報 ==========

export type Gender = 'male' | 'female' | 'other';

export interface Child {
    age: number;
}

export interface FutureBirth {
    enabled: boolean;
    count: number;
    yearsFromNow: number; // 何年後に出産予定
}

export interface BasicInfo {
    currentAge: number;
    gender: Gender;
    simulationEndAge: number;
    hasSpouse: boolean;
    spouseAge: number;
    childrenCount: number;
    children: Child[];
    futureBirth: FutureBirth;
}

// ========== 収入 ==========

export type SalaryGrowthCurve = 'seniority' | 'performance' | 'flat';
// 年功型 / 成果型 / フラット

export type SpouseWorkPattern =
    | 'fulltime'     // フルタイム
    | 'parttime'     // パート
    | 'homemaker'    // 専業主婦(夫)
    | 'leave_return'; // 一時休職→復職

export interface ReemploymentInfo {
    enabled: boolean;
    annualIncome: number; // 万円
}

export interface PensionInfo {
    startAge: number;        // 受給開始年齢 (60〜75)
    annualAmount: number;    // 万円/年 (0 = 自動計算)
}

export interface IncomeInfo {
    annualIncome: number;        // 額面年収 (万円)
    salaryGrowthRate: number;    // 昇給率 (%, e.g. 1.5)
    salaryGrowthCurve: SalaryGrowthCurve;
    retirementAge: number;       // 退職予定年齢
    reemployment: ReemploymentInfo;
    spouseAnnualIncome: number;  // 配偶者の年収 (万円)
    spouseWorkPattern: SpouseWorkPattern;
    sideJobIncome: number;       // 副業収入 (万円/年)
    retirementBonus: number;     // 退職金見込み額 (万円)
    pension: PensionInfo;
}

// ========== 支出 ==========

export type HousingType = 'own_with_loan' | 'own_no_loan' | 'rent';
// 持家ローン有 / 持家ローン無 / 賃貸

export type EducationLevel = 'public' | 'private';

export type UniversityType = 'national' | 'private_arts' | 'private_science' | 'medical';
// 国公立 / 私立文系 / 私立理系 / 医歯薬系

export interface MortgageDetail {
    monthlyPayment: number;    // 月額返済額 (万円)
    remainingYears: number;    // 残期間 (年)
    interestRate: number;      // 金利 (%)
    remainingBalance: number;  // ローン残高 (万円)
}

export interface HomePurchasePlan {
    enabled: boolean;
    yearsFromNow: number;     // 何年後
    propertyPrice: number;    // 物件価格 (万円)
    downPayment: number;      // 頭金 (万円)
    loanInterestRate: number; // ローン金利 (%)
    loanPeriod: number;       // 返済期間 (年)
}

export interface EducationPlan {
    nursery: EducationLevel | 'none';
    kindergarten: EducationLevel;
    elementary: EducationLevel;
    juniorHigh: EducationLevel;
    highSchool: EducationLevel;
    university: UniversityType;
    livingAlone: boolean;      // 一人暮らし
    birthCost: number;         // 出産費用 (万円) - 0歳時に加算
}

export interface CarInfo {
    enabled: boolean;
    count: number;
    replaceCycleYears: number;  // 買替サイクル (年)
    purchaseCost: number;       // 1台あたり購入費 (万円)
}

export interface LifeEvent {
    id: string;
    age: number;         // 発生年齢
    amount: number;      // 金額 (万円)
    name: string;        // 名目
}

export interface HousingInfo {
    type: HousingType;
    monthlyRent: number;            // 賃貸: 月額家賃 (万円)
    mortgage: MortgageDetail;
    purchasePlan: HomePurchasePlan;
}

export interface MonthlyLivingCost {
    food: number;             // 食費
    utilities: number;        // 水道光熱費
    communication: number;    // 通信費
    dailyNecessities: number; // 日用品
    allowanceAndOther: number;// お小遣い・その他
}

export interface InsurancePremium {
    life: number;     // 生命保険
    medical: number;  // 医療保険
    cancer: number;   // がん保険
    other: number;    // その他
}

export interface InsuranceConfig {
    self: InsurancePremium;
    spouse: InsurancePremium; // 配偶者ありの場合のみ加算
}

export interface ExpenseInfo {
    monthlyLivingCost: MonthlyLivingCost;
    housing: HousingInfo;
    educationPlan: EducationPlan;
    childRelatedCost: {
        monthlyLivingCostPerChild: number; // 子ども1人あたりの追加生活費 (万円/月)
    };
    car: CarInfo;
    insurance: InsuranceConfig;
    annualTravelLeisure: number;    // 旅行・レジャー費 (万円/年)
    lifeEvents: LifeEvent[];
}

// ========== 資産・運用 ==========

export interface AssetBreakdown {
    savings: number;         // 預貯金 (万円)
    stocksAndFunds: number;  // 株式・投資信託 (万円)
    other: number;           // その他 (万円)
}

export interface AssetAllocation {
    domesticStocks: number;   // 国内株式 (%)
    foreignStocks: number;    // 海外株式 (%)
    domesticBonds: number;    // 国内債券 (%)
    foreignBonds: number;     // 海外債券 (%)
    reit: number;             // REIT (%)
    cash: number;             // 現金 (%)
}

export type WithdrawalMethod = 'fixed_amount' | 'fixed_rate' | 'auto_optimize';
// 定額 / 定率 / 自動最適化

export interface DebtItem {
    id: string;
    name: string;
    balance: number;        // 残高 (万円)
    interestRate: number;   // 金利 (%)
    remainingYears: number; // 残期間 (年)
}

export interface InvestmentInfo {
    totalAssets: AssetBreakdown;
    monthlyInvestment: number;       // 毎月の積立投資額 (万円)
    assetAllocation: AssetAllocation;
    nisaEnabled: boolean;
    nisaAnnualAmount: number;        // NISA年間投資額 (万円)
    idecoMonthly: number;            // iDeCo拠出額 (月額万円)
    investmentEndAge: number;        // 積立終了年齢
    expectedReturn: number;          // 期待リターン (年率%)、0 = 自動計算
    withdrawalMethod: WithdrawalMethod;
    debts: DebtItem[];
}

// ========== シナリオ設定 ==========

export type ReturnScenario = 'optimistic' | 'standard' | 'pessimistic' | 'custom';
export type PensionReduction = 'current' | 'reduce_20' | 'reduce_30';

export interface MonteCarloConfig {
    enabled: boolean;
    trials: number; // 1000〜10000
}

export interface ScenarioConfig {
    inflationRate: number;            // インフレ率 (年率%)
    returnScenario: ReturnScenario;
    customReturn: number;             // カスタムリターン (年率%)
    pensionReduction: PensionReduction;
    monteCarlo: MonteCarloConfig;
}

// ========== 統合入力 ==========

export interface SimulationInput {
    basicInfo: BasicInfo;
    income: IncomeInfo;
    expense: ExpenseInfo;
    investment: InvestmentInfo;
    scenario: ScenarioConfig;
}

// ========== シミュレーション結果 ==========

export interface YearlyRecord {
    age: number;
    year: number;

    // 収入内訳
    salary: number;
    spouseSalary: number;
    pension: number;
    investmentReturn: number;
    sideJob: number;
    otherIncome: number;
    totalIncome: number;

    // 支出内訳
    livingCost: number;
    housingCost: number;
    educationCost: number;
    carCost: number;
    insuranceCost: number;
    travelCost: number;
    lifeEventCost: number;
    totalExpense: number;

    // 税金・社保
    incomeTax: number;
    residentTax: number;
    socialInsurance: number;

    // 収支・残高
    netIncome: number;     // 手取り
    balance: number;       // 年間収支
    savingsBalance: number; // 預貯金残高（運用されない）
    investmentBalance: number; // 投資資産残高（運用される）
    totalAssets: number;   // 資産残高（合計）
    investmentWithdrawal: number; // 当年の投資取り崩し補填額

    // 追加情報（前年比・詳細表示用）
    prevSavingsBalance: number;
    prevInvestmentBalance: number;
    annualInvestmentAmount: number;
    taxDetails?: {
        salaryDeduction: number;
        pensionDeduction: number;
        totalDeductions: number;
        taxableIncome: number;
    };
    expenseDetails?: {
        basicLiving?: {
            food: number;
            utilities: number;
            communication: number;
            dailyNecessities: number;
            allowanceAndOther: number;
            childAdditional?: number; // 子ども1人あたりの追加生活費(合計)
        };
        housing?: {
            rent: number;
            mortgage: number;
            downPayment: number;
        };
        insurance?: {
            selfTotal: number;
            spouseTotal: number;
        };
        education?: {
            label: string;
            amount: number;
        }[];
    };
}

export interface ScenarioResult {
    scenario: ReturnScenario;
    records: YearlyRecord[];
    bankruptAge: number | null;  // 資産枯渇年齢 (null = 枯渇しない)
    lifetimeIncome: number;
    lifetimeExpense: number;
    peakAssets: number;
    peakAssetsAge: number;
}

export interface MonteCarloResult {
    percentiles: {
        p5: number[];
        p25: number[];
        p50: number[];
        p75: number[];
        p95: number[];
    };
    successRate: number;          // 資産が枯渇しない確率 (%)
    ages: number[];
}

export interface SimulationResult {
    optimistic: ScenarioResult;
    standard: ScenarioResult;
    pessimistic: ScenarioResult;
    monteCarlo: MonteCarloResult | null;
}
