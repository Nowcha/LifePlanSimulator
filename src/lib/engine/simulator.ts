import type { SimulationInput, SimulationResult, ScenarioResult, YearlyRecord } from '@/types/plan';
import { calculateAgeBasedSalary } from '../calculator/income';
import { calculateTaxes } from '../calculator/tax';
import { calculateAnnualEducationCost, calculateAnnualMortgagePayment } from '../calculator/expense';
import { estimateAnnualPension } from '../calculator/pension';
// import { calculateWeightedReturn, calculateWithdrawalAmount } from '../calculator/investment';
import { runMonteCarloSimulation } from '../calculator/montecarlo';
import { SCENARIO_RETURNS, SCENARIO_VOLATILITY } from '@/constants/defaults';

/**
 * 年間収支と資産推移のシミュレーションを実行する
 */
export function runSimulation(input: SimulationInput): SimulationResult {
    const optimistic = runScenario(input, 'optimistic');
    const standard = runScenario(input, 'standard');
    const pessimistic = runScenario(input, 'pessimistic');

    let monteCarlo = null;
    if (input.scenario.monteCarlo.enabled) {
        // 投資を除いた毎年の純キャッシュフローの配列（標準シナリオベース）
        const cashflowMap = standard.records.map(r => r.totalIncome - r.totalExpense - r.incomeTax - r.residentTax - r.socialInsurance);

        // 期待リターン: アロケーションによる標準リターンが0以外ならそれを優先か、カスタム
        let meanReturn: number;        // 期待リターンが明示的に設定されている場合はそれを採用（案B）
        if (input.investment.expectedReturn > 0) {
            meanReturn = input.investment.expectedReturn;
        } else if (input.scenario.returnScenario === 'custom') {
            meanReturn = input.scenario.customReturn;
        } else {
            meanReturn = SCENARIO_RETURNS[input.scenario.returnScenario as keyof typeof SCENARIO_RETURNS] ?? SCENARIO_RETURNS.standard;
        }

        // 初期資産
        const initialAssets = input.investment.selfTotalAssets.savings + input.investment.selfTotalAssets.stocksAndFunds + input.investment.selfTotalAssets.other +
            (input.basicInfo.hasSpouse ? (input.investment.spouseTotalAssets.savings + input.investment.spouseTotalAssets.stocksAndFunds + input.investment.spouseTotalAssets.other) : 0);

        monteCarlo = runMonteCarloSimulation({
            initialAssets,
            annualCashflowMap: cashflowMap,
            startAge: input.basicInfo.currentAge,
            endAge: input.basicInfo.simulationEndAge,
            meanReturn,
            volatility: SCENARIO_VOLATILITY.standard,
            trials: input.scenario.monteCarlo.trials,
        });
    }

    return { optimistic, standard, pessimistic, monteCarlo };
}

function runScenario(input: SimulationInput, scenarioType: keyof typeof SCENARIO_RETURNS): ScenarioResult {
    const records: YearlyRecord[] = [];
    const startAge = input.basicInfo.currentAge;
    const endAge = input.basicInfo.simulationEndAge;
    const currentYear = new Date().getFullYear();

    // シナリオに応じた運用リターン    // 基本ルールの適用
    let returnRate: number = SCENARIO_RETURNS[scenarioType];

    // 期待リターン（手動入力）がある場合は、それを「標準シナリオ」のベースとする（案Bの実装）
    if (input.investment.expectedReturn > 0) {
        const baseReturn = input.investment.expectedReturn;
        if (scenarioType === 'optimistic') returnRate = baseReturn + 2.0;
        else if (scenarioType === 'pessimistic') returnRate = baseReturn - 2.0;
        else returnRate = baseReturn; // standard
    } else {
        // 自動計算の場合も「標準シナリオ」のベースにする
        // runSimulationで計算されたmeanReturnをrunScenarioに渡す必要があるが、現状渡されていないため、
        // ここではinput.scenario.returnScenarioとSCENARIO_RETURNSを基に計算する
        const baseReturn = input.scenario.returnScenario === 'custom' ? input.scenario.customReturn : SCENARIO_RETURNS[input.scenario.returnScenario as keyof typeof SCENARIO_RETURNS] ?? SCENARIO_RETURNS.standard;
        if (scenarioType === 'optimistic') returnRate = baseReturn + 2.0;
        else if (scenarioType === 'pessimistic') returnRate = baseReturn - 2.0;
        else returnRate = baseReturn; // standard
    }

    // 最終的に0未満や過度なリターンを防ぐ処理があればここで行う（任意）
    // const returnMultiplier = 1 + (returnRate / 100);

    // 初期資産（本人と配偶者の合算をまずは世帯の共有資産として扱うか、個別に管理するか。ここでは世帯合算としてシミュレーション）
    // ※今回は「各入力項目を本人/配偶者で分ける」要件に基づき入力は分けたが、
    // シミュレーション上の財布（キャッシュフロー・残高）は従来通り世帯合算で処理します
    let currentSavingsBalance = input.investment.selfTotalAssets.savings + (input.basicInfo.hasSpouse ? input.investment.spouseTotalAssets.savings : 0);
    let currentInvestmentBalance = input.investment.selfTotalAssets.stocksAndFunds + input.investment.selfTotalAssets.other + (input.basicInfo.hasSpouse ? (input.investment.spouseTotalAssets.stocksAndFunds + input.investment.spouseTotalAssets.other) : 0);

    // 住宅ローン初期残高
    let remainingMortgageBalance = 0;
    if (input.expense.housing.type === 'own_with_loan') {
        remainingMortgageBalance = input.expense.housing.mortgage.remainingBalance;
    } else if (input.expense.housing.purchasePlan.enabled) {
        remainingMortgageBalance = input.expense.housing.purchasePlan.propertyPrice - input.expense.housing.purchasePlan.downPayment;
    }

    // 子どもの出産予定を統合した情報
    const childrenAges = input.basicInfo.children.map(c => c.age);
    if (input.basicInfo.futureBirth.enabled && input.basicInfo.futureBirth.count > 0) {
        for (let i = 0; i < input.basicInfo.futureBirth.count; i++) {
            childrenAges.push(-input.basicInfo.futureBirth.yearsFromNow - i); // i年ごとに生まれると仮定
        }
    }

    let bankruptAge: number | null = null;
    let lifetimeIncome = 0;
    let lifetimeExpense = 0;
    let peakAssets = currentSavingsBalance + currentInvestmentBalance;
    let peakAssetsAge = startAge;

    for (let age = startAge; age <= endAge; age++) {
        const yearIndex = age - startAge;
        const year = currentYear + yearIndex;

        // 当年の計算を始める前の残高を「前年残高」として記録
        const prevSavingsBalance = currentSavingsBalance;
        const prevInvestmentBalance = currentInvestmentBalance;

        // --- 収入計算 ---
        let salary = 0;
        if (input.income.selfWorkPattern !== 'homemaker') {
            salary = calculateAgeBasedSalary(
                input.income.annualIncome,
                startAge,
                age,
                input.income.salaryGrowthRate,
                input.income.salaryGrowthCurve,
                input.income.retirementAge,
                input.income.reemployment.enabled ? input.income.reemployment.annualIncome : 0,
                input.income.reemployment.endAge,
                input.income.selfWorkPattern === 'leave_return' ? input.income.selfLeaveReturnAge : 0
            );
        }

        let spouseSalary = 0;
        if (input.basicInfo.hasSpouse) {
            let spouseCurrentAge = input.basicInfo.spouseAge + yearIndex;
            // 配偶者の収入推移 (個別に昇給カーブ計算)
            if (input.income.spouseWorkPattern !== 'homemaker') {
                spouseSalary = calculateAgeBasedSalary(
                    input.income.spouseAnnualIncome,
                    input.basicInfo.spouseAge,
                    spouseCurrentAge,
                    input.income.spouseSalaryGrowthRate,
                    input.income.spouseSalaryGrowthCurve,
                    input.income.spouseRetirementAge,
                    input.income.spouseReemployment.enabled ? input.income.spouseReemployment.annualIncome : 0,
                    input.income.spouseReemployment.endAge,
                    input.income.spouseWorkPattern === 'leave_return' ? input.income.spouseLeaveReturnAge : 0
                );
            }
        }

        let selfPension = 0;
        if (age >= input.income.selfPension.startAge) {
            if (input.income.selfPension.annualAmount > 0) {
                selfPension = input.income.selfPension.annualAmount;
            } else {
                // 自動計算
                selfPension = estimateAnnualPension(input.income.annualIncome, 480, true);
                if (input.scenario.pensionReduction === 'reduce_20') selfPension *= 0.8;
                if (input.scenario.pensionReduction === 'reduce_30') selfPension *= 0.7;
            }
        }

        let spousePension = 0;
        if (input.basicInfo.hasSpouse) {
            let spouseCurrentAge = input.basicInfo.spouseAge + yearIndex;
            if (spouseCurrentAge >= input.income.spousePension.startAge) {
                if (input.income.spousePension.annualAmount > 0) {
                    spousePension = input.income.spousePension.annualAmount;
                } else {
                    spousePension = estimateAnnualPension(input.income.spouseAnnualIncome || 0, 480, input.income.spouseWorkPattern === 'fulltime');
                    if (input.scenario.pensionReduction === 'reduce_20') spousePension *= 0.8;
                    if (input.scenario.pensionReduction === 'reduce_30') spousePension *= 0.7;
                }
            }
        }

        // 副業（本人）
        let sideJob = (age <= input.income.retirementAge || input.income.reemployment.enabled) ? input.income.sideJobIncome : 0;
        // 副業（配偶者）
        if (input.basicInfo.hasSpouse) {
            const spouseCurrentAge = input.basicInfo.spouseAge + yearIndex;
            if (spouseCurrentAge <= input.income.spouseRetirementAge || input.income.spouseReemployment.enabled) {
                sideJob += input.income.spouseSideJobIncome || 0;
            }
        }

        // 退職金加算
        let otherIncome = 0;
        if (age === input.income.retirementAge) {
            otherIncome += input.income.retirementBonus;
        }
        // 配偶者の退職金
        if (input.basicInfo.hasSpouse) {
            const spouseCurrentAge = input.basicInfo.spouseAge + yearIndex;
            if (spouseCurrentAge === input.income.spouseRetirementAge) {
                otherIncome += input.income.spouseRetirementBonus || 0;
            }
        }

        // 投資・運用枠への毎年の拠出額 (NISA/iDeCo等 月額合計×12)
        // 世帯合算で積立額を導出（本人の積立終了年齢を基準に、または配偶者年齢も加味する運用とする）
        let annualInvestmentAmount = 0;
        if (age <= input.investment.investmentEndAge) {
            annualInvestmentAmount += (input.investment.selfMonthlyInvestment * 12) + (input.investment.selfIdecoMonthly * 12);
        }
        if (input.basicInfo.hasSpouse) {
            let spouseCurrentAge = input.basicInfo.spouseAge + yearIndex;
            if (spouseCurrentAge <= input.investment.investmentEndAge) {
                annualInvestmentAmount += (input.investment.spouseMonthlyInvestment * 12) + (input.investment.spouseIdecoMonthly * 12);
            }
        }

        // 投資リターンの計算 (前年末の投資資産残高にかかる)
        let investmentReturn = currentInvestmentBalance > 0 ? currentInvestmentBalance * (returnRate / 100) : 0;

        // 当年の運用益を投資残高に加算
        currentInvestmentBalance += investmentReturn;

        // インフレ率の考慮 (生活費などを名目で増やす)
        const inflationMultiplier = Math.pow(1 + (input.scenario.inflationRate / 100), yearIndex);

        // 運用益（investmentReturn）は再投資として残高にのみ足すため、総収入（キャッシュフロー上）には含めない
        let totalIncome = salary + spouseSalary + selfPension + spousePension + sideJob + otherIncome;

        // --- 支出計算 ---

        // 教育費・子ども生活費
        let educationCost = 0;
        let childAdditionalLivingCost = 0;
        const educationDetailsObj: { label: string; amount: number }[] = [];

        for (let i = 0; i < childrenAges.length; i++) {
            const childStartAge = childrenAges[i];
            const currentChildAge = childStartAge + yearIndex;

            if (currentChildAge >= 0) {
                // 教育費
                const eduResult = calculateAnnualEducationCost(currentChildAge, input.expense.educationPlan);
                const inflatedEduCost = eduResult.cost * inflationMultiplier;
                educationCost += inflatedEduCost;

                eduResult.details.forEach(detail => {
                    educationDetailsObj.push({
                        label: `${detail.label} (第${i + 1}子)`,
                        amount: detail.amount * inflationMultiplier
                    });
                });

                // 子ども追加生活費 (大学卒業の22歳まで加算)
                if (currentChildAge <= 22) {
                    childAdditionalLivingCost += input.expense.childRelatedCost.monthlyLivingCostPerChild * 12 * inflationMultiplier;
                }
            }
        }

        // 基本生活費
        const livingCostMonthly = Object.values(input.expense.monthlyLivingCost).reduce((a, b) => a + b, 0);
        // カスタム生活費の合計を加算
        const customLivingCostMonthly = (input.expense.customLivingCosts || []).reduce((a, item) => a + item.amount, 0);
        const livingCost = ((livingCostMonthly + customLivingCostMonthly) * 12 * inflationMultiplier) + childAdditionalLivingCost;
        const basicLivingDetails = {
            food: (input.expense.monthlyLivingCost.food * 12) * inflationMultiplier,
            utilities: (input.expense.monthlyLivingCost.utilities * 12) * inflationMultiplier,
            communication: (input.expense.monthlyLivingCost.communication * 12) * inflationMultiplier,
            dailyNecessities: (input.expense.monthlyLivingCost.dailyNecessities * 12) * inflationMultiplier,
            allowanceAndOther: (input.expense.monthlyLivingCost.allowanceAndOther * 12) * inflationMultiplier,
            childAdditional: childAdditionalLivingCost > 0 ? childAdditionalLivingCost : undefined,
        };

        // 保険料
        const selfInsuranceMonthly = Object.values(input.expense.insurance.self).reduce((a, b) => a + b, 0);
        const spouseInsuranceMonthly = input.basicInfo.hasSpouse ? Object.values(input.expense.insurance.spouse).reduce((a, b) => a + b, 0) : 0;
        const insuranceCost = (selfInsuranceMonthly + spouseInsuranceMonthly) * 12;
        const insuranceDetails = {
            selfTotal: selfInsuranceMonthly * 12,
            spouseTotal: spouseInsuranceMonthly * 12,
        };

        const travelCost = input.expense.annualTravelLeisure * inflationMultiplier;

        // 住宅費
        let housingCost = 0;
        let housingDetails = { rent: 0, mortgage: 0, downPayment: 0 };

        if (input.expense.housing.type === 'rent') {
            const rentCost = (input.expense.housing.monthlyRent * 12) * inflationMultiplier;
            housingCost += rentCost;
            housingDetails.rent += rentCost;
            // 賃貸更新費用
            const renewalCycle = input.expense.housing.renewalCycleYears || 2;
            if (renewalCycle > 0 && yearIndex > 0 && yearIndex % renewalCycle === 0) {
                const renewalCost = (input.expense.housing.renewalCost || 0) * inflationMultiplier;
                housingCost += renewalCost;
                housingDetails.rent += renewalCost;
            }
        } else if (input.expense.housing.type === 'own_with_loan') {
            if (remainingMortgageBalance > 0) {
                const annualPmt = input.expense.housing.mortgage.monthlyPayment * 12;
                housingCost += annualPmt;
                housingDetails.mortgage += annualPmt;
                remainingMortgageBalance -= annualPmt; // 超簡易的な残高減算
                if (remainingMortgageBalance < 0) remainingMortgageBalance = 0;
            }
        }
        // 購入予定のイベント
        if (input.expense.housing.purchasePlan.enabled && yearIndex === input.expense.housing.purchasePlan.yearsFromNow) {
            housingCost += input.expense.housing.purchasePlan.downPayment;
            housingDetails.downPayment += input.expense.housing.purchasePlan.downPayment;
            remainingMortgageBalance = input.expense.housing.purchasePlan.propertyPrice - input.expense.housing.purchasePlan.downPayment;
        } else if (input.expense.housing.purchasePlan.enabled && yearIndex > input.expense.housing.purchasePlan.yearsFromNow) {
            if (remainingMortgageBalance > 0) {
                const annualPmt = calculateAnnualMortgagePayment(
                    input.expense.housing.purchasePlan.propertyPrice - input.expense.housing.purchasePlan.downPayment,
                    input.expense.housing.purchasePlan.loanInterestRate,
                    input.expense.housing.purchasePlan.loanPeriod
                );
                housingCost += annualPmt;
                housingDetails.mortgage += annualPmt;
                remainingMortgageBalance -= annualPmt;
            }
        }

        // （※教育費は上に移動済み）

        // 車両費
        let carCost = 0;
        if (input.expense.car.enabled) {
            // 購入費（買替サイクルごと）
            if (yearIndex % input.expense.car.replaceCycleYears === 0 && yearIndex > 0) {
                carCost += (input.expense.car.purchaseCost * input.expense.car.count) * inflationMultiplier;
            }
            // 毎年の維持費
            const annualMaintenanceCost = (
                (input.expense.car.annualInsurance || 0) +
                (input.expense.car.annualTax || 0) +
                ((input.expense.car.monthlyParking || 0) * 12) +
                (input.expense.car.annualMaintenance || 0) +
                ((input.expense.car.monthlyGasFuel || 0) * 12)
            ) * input.expense.car.count * inflationMultiplier;
            carCost += annualMaintenanceCost;
        }

        let lifeEventCost = 0;

        const totalExpense = livingCost + housingCost + educationCost + carCost + insuranceCost + travelCost + lifeEventCost;

        const expenseDetailsObj = {
            basicLiving: basicLivingDetails,
            housing: housingDetails,
            insurance: insuranceDetails,
            education: educationDetailsObj.length > 0 ? educationDetailsObj : undefined,
        };

        // --- 税金・社保 ---
        const taxDependents = childrenAges.map(a => ({ age: a + yearIndex })).filter(d => d.age >= 16);

        // 本人分の税金
        const selfTaxResult = calculateTaxes({
            salaryIncomeManYen: salary + sideJob,
            pensionIncomeManYen: selfPension,
            age: age,
            hasSpouse: input.basicInfo.hasSpouse, // 本人から見て配偶者あり
            spouseIncomeManYen: spouseSalary, // 配偶者控除判定用
            dependents: taxDependents
        });

        // 配偶者分の税金
        let spouseTaxResult = null;
        if (input.basicInfo.hasSpouse) {
            let spouseCurrentAge = input.basicInfo.spouseAge + yearIndex;
            spouseTaxResult = calculateTaxes({
                salaryIncomeManYen: spouseSalary,
                pensionIncomeManYen: spousePension,
                age: spouseCurrentAge,
                hasSpouse: true,
                spouseIncomeManYen: salary + sideJob, // 配偶者から見て本人の年収
                dependents: [] // 簡易的に扶養は本人のみにつけると仮定
            });
        }

        const incomeTax = selfTaxResult.incomeTax + (spouseTaxResult ? spouseTaxResult.incomeTax : 0);
        const residentTax = selfTaxResult.residentTax + (spouseTaxResult ? spouseTaxResult.residentTax : 0);
        const socialInsurance = selfTaxResult.socialInsurance + (spouseTaxResult ? spouseTaxResult.socialInsurance : 0);

        const taxDetails = {
            self: {
                salaryDeduction: selfTaxResult.details.salaryDeduction,
                pensionDeduction: selfTaxResult.details.pensionDeduction,
                totalDeductions: selfTaxResult.details.totalDeductions,
                taxableIncome: selfTaxResult.details.taxableIncome,
                incomeTax: selfTaxResult.incomeTax,
                residentTax: selfTaxResult.residentTax,
                socialInsurance: selfTaxResult.socialInsurance,
            },
            spouse: spouseTaxResult ? {
                salaryDeduction: spouseTaxResult.details.salaryDeduction,
                pensionDeduction: spouseTaxResult.details.pensionDeduction,
                totalDeductions: spouseTaxResult.details.totalDeductions,
                taxableIncome: spouseTaxResult.details.taxableIncome,
                incomeTax: spouseTaxResult.incomeTax,
                residentTax: spouseTaxResult.residentTax,
                socialInsurance: spouseTaxResult.socialInsurance,
            } : {
                salaryDeduction: 0, pensionDeduction: 0, totalDeductions: 0, taxableIncome: 0,
                incomeTax: 0, residentTax: 0, socialInsurance: 0
            }
        };

        // --- 収支・残高計算 ---
        let netIncome = totalIncome - socialInsurance - incomeTax - residentTax;

        // 当年の基本計算での収支
        let balance = netIncome - totalExpense;

        // 1. 預貯金に収支を反映
        currentSavingsBalance += balance;

        // 2. 毎年の積立投資額を預貯金から投資資産へ移管（収支に関わらず予定通り拠出すると仮定）
        currentSavingsBalance -= annualInvestmentAmount;
        currentInvestmentBalance += annualInvestmentAmount;

        let investmentWithdrawal = 0;

        // 3. 預貯金がショート（マイナス）した場合の処理
        if (currentSavingsBalance < 0) {
            const shortage = Math.abs(currentSavingsBalance);
            if (currentInvestmentBalance >= shortage) {
                // 投資資産を取り崩して補填する
                investmentWithdrawal = shortage;
                currentInvestmentBalance -= shortage;
                currentSavingsBalance = 0;
            } else {
                // 投資資産でも賄いきれない場合は全額取り崩し（破産判定へ）
                investmentWithdrawal = currentInvestmentBalance;
                currentSavingsBalance = -(shortage - currentInvestmentBalance);
                currentInvestmentBalance = 0;
            }

            // 取り崩した分を「今年の収入」として扱う
            totalIncome += investmentWithdrawal;
            netIncome += investmentWithdrawal;
            // 収支(balance)上も、取り崩し分が流入したことで改善される（実質0等に）
            balance += investmentWithdrawal;
        }

        let totalAssets = currentSavingsBalance + currentInvestmentBalance;

        if (totalAssets < 0) {
            if (bankruptAge === null) bankruptAge = age;
            totalAssets = 0; // 借金にはしない
            currentSavingsBalance = 0;
        }

        if (totalAssets > peakAssets) {
            peakAssets = totalAssets;
            peakAssetsAge = age;
        }

        lifetimeIncome += netIncome;
        lifetimeExpense += totalExpense;

        records.push({
            age, year, salary, spouseSalary, selfPension, spousePension, investmentReturn, sideJob, otherIncome, totalIncome,
            livingCost, housingCost, educationCost, carCost, insuranceCost, travelCost, lifeEventCost, totalExpense,
            incomeTax, residentTax, socialInsurance, netIncome, balance,
            savingsBalance: currentSavingsBalance, investmentBalance: currentInvestmentBalance, totalAssets,
            investmentWithdrawal, // 取り崩し額も記録
            prevSavingsBalance, prevInvestmentBalance, annualInvestmentAmount, taxDetails,
            expenseDetails: expenseDetailsObj
        });
    }

    return {
        scenario: scenarioType,
        records,
        bankruptAge,
        lifetimeIncome,
        lifetimeExpense,
        peakAssets,
        peakAssetsAge,
    };
}
