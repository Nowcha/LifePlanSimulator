/**
 * シミュレーションエンジン
 * 家族構成とパラメータから年ごとの収支・資産推移を計算
 */
import { DEFAULT_PARAMS, getEducationEvents } from '../data/lifeEvents.js';

/**
 * パラメータのフラット化（ネストされたparams構造から値のみ取得）
 */
export function flattenParams(paramGroups) {
    const flat = {};
    for (const group of Object.values(paramGroups)) {
        for (const [key, param] of Object.entries(group.params)) {
            flat[key] = param.value;
        }
    }
    return flat;
}

/**
 * 住宅ローンの年間返済額を計算（元利均等返済）
 */
function calcAnnualMortgage(principal, rate, years) {
    if (rate === 0) return principal / years;
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const monthly = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return monthly * 12;
}

/**
 * メインのシミュレーション実行関数
 * @param {Object} family - 家族構成 { husbandAge, wifeAge, children: [{ age, isFuture, futureBirthHusbandAge }] }
 * @param {Object} paramGroups - パラメータグループ（DEFAULT_PARAMS形式）
 * @returns {Array} 年ごとのシミュレーション結果
 */
export function runSimulation(family, paramGroups, selectedScenario = 'mid') {
    const p = flattenParams(paramGroups);
    const results = [];

    const currentYear = new Date().getFullYear();
    const startAge = family.husbandAge;
    const endAge = p.simulationEndAge;

    // 住宅ローン計算（購入の場合のみ）
    const isRental = p.housingType === 1;
    let annualMortgage = 0;
    let loanEndAge = 0;
    if (!isRental) {
        const loanAmount = p.housePrice - p.downPayment;
        annualMortgage = loanAmount > 0 ? calcAnnualMortgage(loanAmount, p.loanInterestRate, p.loanYears) : 0;
        loanEndAge = p.purchaseAge + p.loanYears;
    }

    // 子どもの教育イベントを事前生成
    const allEducationEvents = [];
    family.children.forEach((child, idx) => {
        const eduEvents = getEducationEvents(0, idx, p);
        eduEvents.forEach(ev => {
            let childCurrentAge;
            if (child.isFuture) {
                // 将来の子ども: 夫の年齢から子どもの年齢を計算
                childCurrentAge = -1; // まだ生まれていない
                ev.husbandAgeAtEvent = child.futureBirthHusbandAge + ev.childAge;
            } else {
                childCurrentAge = child.age;
                ev.husbandAgeAtEvent = startAge + (ev.childAge - childCurrentAge);
            }
            allEducationEvents.push(ev);
        });
    });

    let balance = p.savingsRate; // 初期資産
    // 投資残高を3パターンで管理
    const investmentRates = {
        low: p.investmentReturnLow || 3,
        mid: p.investmentReturn || 5,
        high: p.investmentReturnHigh || 7,
    };
    const hInitInv = p.investmentCurrentBalance || 0;
    const wInitInv = p.wifeInvestmentCurrentBalance || 0;
    let hInvBal = { low: hInitInv, mid: hInitInv, high: hInitInv };
    let wInvBal = { low: wInitInv, mid: wInitInv, high: wInitInv };
    let invBal = { low: hInitInv + wInitInv, mid: hInitInv + wInitInv, high: hInitInv + wInitInv };
    let prevHInvBal = { ...hInvBal };
    let prevWInvBal = { ...wInvBal };

    for (let age = startAge; age <= endAge; age++) {
        const year = currentYear + (age - startAge);
        const wifeAge = family.wifeAge + (age - startAge);
        const yearsFromStart = age - startAge;
        const inflationMultiplier = Math.pow(1 + p.inflationRate / 100, yearsFromStart);
        const events = [];
        let yearIncome = 0;
        let yearExpense = 0;

        // === 収入計算 ===
        // 夫の収入
        if (age < p.husbandRetirementAge) {
            const raiseMultiplier = Math.pow(1 + p.raiseRate / 100, yearsFromStart);
            yearIncome += p.husbandAnnualIncome * raiseMultiplier;
        } else if (age === p.husbandRetirementAge) {
            events.push({ category: 'retirement', label: '夫 退職', cost: 0, income: p.retirementBonus });
            yearIncome += p.retirementBonus;
        }

        // 妻の収入
        if (wifeAge < p.wifeRetirementAge) {
            const raiseMultiplier = Math.pow(1 + p.raiseRate / 100, yearsFromStart);
            yearIncome += p.wifeAnnualIncome * raiseMultiplier;
        }

        // 年金（夫）
        if (age >= p.husbandPensionStartAge) {
            const husbandPension = p.husbandPensionMonthly * 12;
            yearIncome += husbandPension;
            if (age === p.husbandPensionStartAge) {
                events.push({ category: 'retirement', label: '夫 年金受給開始', cost: 0, income: husbandPension });
            }
        }

        // 年金（妻）
        if (wifeAge >= p.wifePensionStartAge) {
            const wifePension = p.wifePensionMonthly * 12;
            yearIncome += wifePension;
            if (wifeAge === p.wifePensionStartAge) {
                events.push({ category: 'retirement', label: '妻 年金受給開始', cost: 0, income: wifePension });
            }
        }

        // 生活費（内訳合算）
        const isRetired = age >= p.husbandRetirementAge;
        const monthlyLiving = (p.foodCost || 0) + (p.utilityCost || 0) + (p.communicationCost || 0)
            + (p.transportCost || 0) + (p.clothingCost || 0) + (p.dailyGoodsCost || 0)
            + (p.medicalCost || 0) + (p.entertainmentCost || 0) + (p.socialCost || 0) + (p.miscCost || 0);
        const baseLiving = isRetired ? monthlyLiving * (p.retiredLivingRatio / 100) : monthlyLiving;
        const livingCost = baseLiving * 12 * inflationMultiplier;
        yearExpense += livingCost;

        // 住宅
        if (isRental) {
            // 賃貸：生涯家賃
            const rent = p.rentMonthly * 12 * inflationMultiplier;
            yearExpense += rent;
            // 更新料
            if (p.rentRenewalCycle > 0 && p.rentRenewalFee > 0 && yearsFromStart > 0 && yearsFromStart % p.rentRenewalCycle === 0) {
                const renewalCost = p.rentMonthly * p.rentRenewalFee;
                yearExpense += renewalCost;
                events.push({ category: 'housing', label: '賃貸更新', cost: renewalCost, income: 0 });
            }
        } else {
            // 購入シナリオ
            if (age < p.purchaseAge) {
                const rent = (p.rentBeforePurchase || p.rentMonthly) * 12 * inflationMultiplier;
                yearExpense += rent;
            } else if (age === p.purchaseAge) {
                events.push({ category: 'housing', label: '住宅購入', cost: p.downPayment, income: 0 });
                yearExpense += p.downPayment;
                yearExpense += annualMortgage;
                yearExpense += p.propertyTax;
                yearExpense += p.maintenanceCost;
            } else if (age > p.purchaseAge) {
                if (age <= loanEndAge) {
                    yearExpense += annualMortgage;
                }
                yearExpense += p.propertyTax;
                yearExpense += p.maintenanceCost;
            }
        }

        // 結婚（シミュレーション開始年が結婚前の場合のみ）
        // 結婚は既にしている前提なのでスキップ（必要に応じてカスタム）

        // 出産
        family.children.forEach((child, idx) => {
            if (child.isFuture && child.futureBirthHusbandAge === age) {
                const birthNet = p.birthCost - p.birthAllowance + p.maternityGoods;
                events.push({
                    category: 'childbirth',
                    label: `第${idx + 1}子 誕生`,
                    cost: birthNet > 0 ? birthNet : 0,
                    income: birthNet < 0 ? -birthNet : 0,
                });
                yearExpense += Math.max(0, birthNet);
                if (birthNet < 0) yearIncome += -birthNet;
            }
        });

        // 教育費
        const eduThisYear = allEducationEvents.filter(ev => ev.husbandAgeAtEvent === age);
        eduThisYear.forEach(ev => {
            events.push({ category: 'education', label: ev.label, cost: ev.cost, income: 0 });
            yearExpense += ev.cost;
        });

        // 子どもの追加生活費・習い事・塾費用
        family.children.forEach((child, idx) => {
            let childAge;
            if (child.isFuture) {
                childAge = age - child.futureBirthHusbandAge;
            } else {
                childAge = child.age + (age - startAge);
            }

            // 独立前の子どものみ
            if (childAge >= 0 && childAge < p.childIndependenceAge) {
                // 年齢帯別の追加生活費（月額→年額）
                let monthlyExtra = 0;
                if (childAge <= 5) {
                    monthlyExtra = p.childLivingInfant || 0;
                } else if (childAge <= 11) {
                    monthlyExtra = p.childLivingElementary || 0;
                } else if (childAge <= 17) {
                    monthlyExtra = p.childLivingTeen || 0;
                } else {
                    monthlyExtra = p.childLivingAdult || 0;
                }
                yearExpense += monthlyExtra * 12 * inflationMultiplier;

                // 習い事・塾・部活（年額）
                let extraEdu = 0;
                if (childAge >= 6 && childAge <= 11) {
                    extraEdu = p.extracurricularElementary || 0;
                } else if (childAge >= 12 && childAge <= 14) {
                    extraEdu = p.cramSchoolMiddle || 0;
                } else if (childAge >= 15 && childAge <= 17) {
                    extraEdu = p.cramSchoolHigh || 0;
                }
                if (extraEdu > 0) {
                    yearExpense += extraEdu * inflationMultiplier;
                }
            }
        });

        // 車
        if (p.hasCar && age >= p.firstCarAge && age <= p.lastCarAge) {
            yearExpense += p.carAnnualCost;
            const yearsSinceFirst = age - p.firstCarAge;
            if (yearsSinceFirst % p.carReplaceCycle === 0) {
                events.push({
                    category: 'car',
                    label: yearsSinceFirst === 0 ? '車購入' : '車買い替え',
                    cost: p.carPrice,
                    income: 0,
                });
                yearExpense += p.carPrice;
            }
        }

        // 生命保険（夫）
        if (p.husbandHasLifeInsurance && age >= p.lifeInsuranceStartAge && age <= p.lifeInsuranceEndAge) {
            yearExpense += p.husbandLifeInsurance * inflationMultiplier;
        }
        // 生命保険（妻）
        if (p.wifeHasLifeInsurance && wifeAge >= p.wifeLifeInsuranceStartAge && wifeAge <= p.wifeLifeInsuranceEndAge) {
            yearExpense += p.wifeLifeInsurance * inflationMultiplier;
        }
        // 医療保険（夫）
        if (p.husbandHasMedicalInsurance && age >= p.medicalInsuranceStartAge && age <= p.medicalInsuranceEndAge) {
            yearExpense += p.husbandMedicalInsurance * inflationMultiplier;
        }
        // 医療保険（妻）
        if (p.wifeHasMedicalInsurance && wifeAge >= p.wifeMedicalInsuranceStartAge && wifeAge <= p.wifeMedicalInsuranceEndAge) {
            yearExpense += p.wifeMedicalInsurance * inflationMultiplier;
        }

        // === 投資（夫＋妻 × 3パターン並行計算） ===
        const invGain = { low: 0, mid: 0, high: 0 };

        for (const scenario of ['low', 'mid', 'high']) {
            const rate = investmentRates[scenario] / 100;
            let scenarioGain = 0;

            // --- 夫の投資 ---
            if (p.investmentMonthly > 0 && age >= p.investmentStartAge && age < p.investmentEndAge) {
                const annualContribution = p.investmentMonthly * 12;
                const g = hInvBal[scenario] * rate;
                hInvBal[scenario] = hInvBal[scenario] + g + annualContribution;
                scenarioGain += g;
            } else if (hInvBal[scenario] > 0) {
                const g = hInvBal[scenario] * rate;
                hInvBal[scenario] += g;
                scenarioGain += g;
            }
            if (age >= p.investmentWithdrawAge && hInvBal[scenario] > 0 && p.investmentWithdrawMonthly > 0) {
                const w = Math.min(p.investmentWithdrawMonthly * 12, hInvBal[scenario]);
                hInvBal[scenario] -= w;
            }
            if (hInvBal[scenario] < 0) hInvBal[scenario] = 0;

            // --- 妻の投資 ---
            if (p.wifeInvestmentMonthly > 0 && wifeAge >= p.wifeInvestmentStartAge && wifeAge < p.wifeInvestmentEndAge) {
                const annualContribution = p.wifeInvestmentMonthly * 12;
                const g = wInvBal[scenario] * rate;
                wInvBal[scenario] = wInvBal[scenario] + g + annualContribution;
                scenarioGain += g;
            } else if (wInvBal[scenario] > 0) {
                const g = wInvBal[scenario] * rate;
                wInvBal[scenario] += g;
                scenarioGain += g;
            }
            if (wifeAge >= p.wifeInvestmentWithdrawAge && wInvBal[scenario] > 0 && p.wifeInvestmentWithdrawMonthly > 0) {
                const w = Math.min(p.wifeInvestmentWithdrawMonthly * 12, wInvBal[scenario]);
                wInvBal[scenario] -= w;
            }
            if (wInvBal[scenario] < 0) wInvBal[scenario] = 0;

            invGain[scenario] = scenarioGain;
            invBal[scenario] = hInvBal[scenario] + wInvBal[scenario];
        }

        // 夫の積立支出
        if (p.investmentMonthly > 0 && age >= p.investmentStartAge && age < p.investmentEndAge) {
            yearExpense += p.investmentMonthly * 12;
            if (age === p.investmentStartAge) {
                events.push({ category: 'investment', label: '夫 積立投資開始', cost: p.investmentMonthly * 12, income: 0 });
            }
        }
        // 妻の積立支出
        if (p.wifeInvestmentMonthly > 0 && wifeAge >= p.wifeInvestmentStartAge && wifeAge < p.wifeInvestmentEndAge) {
            yearExpense += p.wifeInvestmentMonthly * 12;
            if (wifeAge === p.wifeInvestmentStartAge) {
                events.push({ category: 'investment', label: '妻 積立投資開始', cost: p.wifeInvestmentMonthly * 12, income: 0 });
            }
        }

        // 夫の取り崩し収入
        if (age >= p.investmentWithdrawAge && p.investmentWithdrawMonthly > 0) {
            const prevHBal = results.length > 0 ? prevHInvBal[selectedScenario] : (p.investmentCurrentBalance || 0);
            const curHBal = hInvBal[selectedScenario];
            const actualW = Math.max(0, prevHBal + (prevHBal * investmentRates[selectedScenario] / 100) - curHBal - (p.investmentMonthly > 0 && age >= p.investmentStartAge && age < p.investmentEndAge ? p.investmentMonthly * 12 : 0));
            if (actualW > 0) {
                yearIncome += actualW;
                if (age === p.investmentWithdrawAge) {
                    events.push({ category: 'investment', label: '夫 投資取り崩し開始', cost: 0, income: actualW });
                }
            }
        }
        // 妻の取り崩し収入
        if (wifeAge >= p.wifeInvestmentWithdrawAge && p.wifeInvestmentWithdrawMonthly > 0) {
            const prevWBal = results.length > 0 ? prevWInvBal[selectedScenario] : (p.wifeInvestmentCurrentBalance || 0);
            const curWBal = wInvBal[selectedScenario];
            const actualW = Math.max(0, prevWBal + (prevWBal * investmentRates[selectedScenario] / 100) - curWBal - (p.wifeInvestmentMonthly > 0 && wifeAge >= p.wifeInvestmentStartAge && wifeAge < p.wifeInvestmentEndAge ? p.wifeInvestmentMonthly * 12 : 0));
            if (actualW > 0) {
                yearIncome += actualW;
                if (wifeAge === p.wifeInvestmentWithdrawAge) {
                    events.push({ category: 'investment', label: '妻 投資取り崩し開始', cost: 0, income: actualW });
                }
            }
        }

        // 次イテレーションのために前回残高を保存
        prevHInvBal = { ...hInvBal };
        prevWInvBal = { ...wInvBal };

        // 資産更新
        balance = balance + yearIncome - yearExpense;

        results.push({
            age,
            wifeAge,
            year,
            events,
            income: Math.round(yearIncome * 10) / 10,
            expense: Math.round(yearExpense * 10) / 10,
            balance: Math.round(balance * 10) / 10,
            investmentBalance: Math.round(invBal[selectedScenario] * 10) / 10,
            investmentGain: Math.round(invGain[selectedScenario] * 10) / 10,
            investmentScenarios: {
                low: { balance: Math.round(invBal.low * 10) / 10, gain: Math.round(invGain.low * 10) / 10 },
                mid: { balance: Math.round(invBal.mid * 10) / 10, gain: Math.round(invGain.mid * 10) / 10 },
                high: { balance: Math.round(invBal.high * 10) / 10, gain: Math.round(invGain.high * 10) / 10 },
            },
            children: family.children.map((child, idx) => {
                if (child.isFuture) {
                    const childAge = age - child.futureBirthHusbandAge;
                    return { index: idx, age: childAge >= 0 ? childAge : null };
                }
                return { index: idx, age: child.age + (age - startAge) };
            }),
        });
    }

    return results;
}
