/**
 * ライフイベント データ定義
 * 日本の一般的な統計データに基づくデフォルト値
 */

// カテゴリ定義
export const CATEGORIES = {
  marriage: { label: '結婚', icon: '💍', color: '#e91e90' },
  childbirth: { label: '出産', icon: '👶', color: '#ff6b6b' },
  education: { label: '教育', icon: '🎓', color: '#4ecdc4' },
  housing: { label: '住宅', icon: '🏠', color: '#45b7d1' },
  car: { label: '車', icon: '🚗', color: '#96ceb4' },
  insurance: { label: '保険', icon: '🛡️', color: '#a28dd0' },
  retirement: { label: '老後', icon: '👴', color: '#f7dc6f' },
  living: { label: '生活費', icon: '🏪', color: '#82a0aa' },
  investment: { label: '投資', icon: '📈', color: '#2ecc71' },
};

// デフォルトパラメータ
export const DEFAULT_PARAMS = {
  // === 収入関連 ===
  income: {
    label: '収入設定',
    params: {
      husbandAnnualIncome: { label: '年収（万円）', value: 500, min: 0, max: 3000, step: 10, tab: 'husband' },
      husbandRetirementAge: { label: '退職年齢', value: 65, min: 20, max: 75, step: 1, tab: 'husband' },
      retirementBonus: { label: '退職金（万円）', value: 2000, min: 0, max: 5000, step: 100, tab: 'husband' },
      husbandPensionStartAge: { label: '年金受給開始年齢', value: 65, min: 60, max: 75, step: 1, tab: 'husband' },
      husbandPensionMonthly: { label: '年金月額（万円）', value: 14, min: 0, max: 30, step: 1, tab: 'husband' },
      wifeAnnualIncome: { label: '年収（万円）', value: 300, min: 0, max: 3000, step: 10, tab: 'wife' },
      wifeRetirementAge: { label: '退職年齢', value: 65, min: 20, max: 75, step: 1, tab: 'wife' },
      wifePensionStartAge: { label: '年金受給開始年齢', value: 65, min: 60, max: 75, step: 1, tab: 'wife' },
      wifePensionMonthly: { label: '年金月額（万円）', value: 8, min: 0, max: 30, step: 1, tab: 'wife' },
      raiseRate: { label: '年間昇給率（%）', value: 1.5, min: 0, max: 10, step: 0.1, tab: 'common' },
    }
  },

  // === 結婚 ===
  marriage: {
    label: '結婚費用',
    params: {
      hasWedding: { label: '挙式・披露宴を行う', value: 1, min: 0, max: 1, step: 1, options: [{ value: 0, label: 'いいえ' }, { value: 1, label: 'はい' }] },
      weddingCost: { label: '挙式・披露宴（万円）', value: 327, min: 0, max: 1000, step: 10, showWhen: { key: 'hasWedding', value: 1 } },
      weddingGiftIncome: { label: 'ご祝儀収入（万円）', value: 180, min: 0, max: 500, step: 10, showWhen: { key: 'hasWedding', value: 1 } },
      hasEngagement: { label: '婚約・顔合わせを行う', value: 1, min: 0, max: 1, step: 1, options: [{ value: 0, label: 'いいえ' }, { value: 1, label: 'はい' }] },
      engagementCost: { label: '婚約・顔合わせ（万円）', value: 20, min: 0, max: 100, step: 5, showWhen: { key: 'hasEngagement', value: 1 } },
      hasHoneymoon: { label: '新婚旅行に行く', value: 1, min: 0, max: 1, step: 1, options: [{ value: 0, label: 'いいえ' }, { value: 1, label: 'はい' }] },
      honeymoonCost: { label: '新婚旅行（万円）', value: 43, min: 0, max: 200, step: 5, showWhen: { key: 'hasHoneymoon', value: 1 } },
    }
  },

  // === 子ども関連費用 ===
  childbirth: {
    label: '子ども関連費用',
    params: {
      birthCost: { label: '出産費用（万円）', value: 48, min: 0, max: 200, step: 5 },
      birthAllowance: { label: '出産一時金（万円）', value: 50, min: 0, max: 100, step: 5 },
      maternityGoods: { label: '出産準備費用（万円）', value: 15, min: 0, max: 50, step: 5 },
      childIndependenceAge: { label: '独立する年齢', value: 22, min: 18, max: 30, step: 1 },
      childLivingInfant: { label: '追加生活費: 乳幼児（0-5歳）月額（万円）', value: 2.0, min: 0, max: 10, step: 0.1 },
      childLivingElementary: { label: '追加生活費: 小学生（6-11歳）月額（万円）', value: 2.5, min: 0, max: 10, step: 0.1 },
      childLivingTeen: { label: '追加生活費: 中高生（12-17歳）月額（万円）', value: 3.5, min: 0, max: 15, step: 0.1 },
      childLivingAdult: { label: '追加生活費: 大学生（18歳-）月額（万円）', value: 4.0, min: 0, max: 15, step: 0.1 },
      extracurricularElementary: { label: '習い事: 小学生 年額（万円）', value: 10, min: 0, max: 50, step: 1 },
      cramSchoolMiddle: { label: '塾・部活: 中学生 年額（万円）', value: 20, min: 0, max: 80, step: 1 },
      cramSchoolHigh: { label: '塾・予備校: 高校生 年額（万円）', value: 30, min: 0, max: 100, step: 1 },
    }
  },

  // === 教育 ===
  education: {
    label: '教育費用',
    params: {
      kindergartenType: { label: '幼稚園', value: 1, min: 0, max: 1, step: 1, options: [{ value: 0, label: '公立' }, { value: 1, label: '私立' }] },
      kindergartenPublic: { label: '幼稚園(公立)年額（万円）', value: 16.5, min: 0, max: 50, step: 0.5, showWhen: { key: 'kindergartenType', value: 0 } },
      kindergartenPrivate: { label: '幼稚園(私立)年額（万円）', value: 31, min: 0, max: 80, step: 0.5, showWhen: { key: 'kindergartenType', value: 1 } },
      elementaryType: { label: '小学校', value: 0, min: 0, max: 1, step: 1, options: [{ value: 0, label: '公立' }, { value: 1, label: '私立' }] },
      elementaryPublic: { label: '小学校(公立)年額（万円）', value: 35, min: 0, max: 200, step: 5, showWhen: { key: 'elementaryType', value: 0 } },
      elementaryPrivate: { label: '小学校(私立)年額（万円）', value: 167, min: 0, max: 300, step: 5, showWhen: { key: 'elementaryType', value: 1 } },
      middleSchoolType: { label: '中学校', value: 0, min: 0, max: 1, step: 1, options: [{ value: 0, label: '公立' }, { value: 1, label: '私立' }] },
      middleSchoolPublic: { label: '中学校(公立)年額（万円）', value: 54, min: 0, max: 200, step: 5, showWhen: { key: 'middleSchoolType', value: 0 } },
      middleSchoolPrivate: { label: '中学校(私立)年額（万円）', value: 156, min: 0, max: 300, step: 5, showWhen: { key: 'middleSchoolType', value: 1 } },
      highSchoolType: { label: '高校', value: 0, min: 0, max: 1, step: 1, options: [{ value: 0, label: '公立' }, { value: 1, label: '私立' }] },
      highSchoolPublic: { label: '高校(公立)年額（万円）', value: 51, min: 0, max: 200, step: 5, showWhen: { key: 'highSchoolType', value: 0 } },
      highSchoolPrivate: { label: '高校(私立)年額（万円）', value: 105, min: 0, max: 300, step: 5, showWhen: { key: 'highSchoolType', value: 1 } },
      universityType: { label: '大学', value: 1, min: 0, max: 2, step: 1, options: [{ value: 0, label: '国公立' }, { value: 1, label: '私立文系' }, { value: 2, label: '私立理系' }] },
      universityNational: { label: '大学(国公立)4年総額（万円）', value: 481, min: 0, max: 1000, step: 10, showWhen: { key: 'universityType', value: 0 } },
      universityPrivateArts: { label: '大学(私立文系)4年総額（万円）', value: 690, min: 0, max: 1200, step: 10, showWhen: { key: 'universityType', value: 1 } },
      universityPrivateScience: { label: '大学(私立理系)4年総額（万円）', value: 822, min: 0, max: 1500, step: 10, showWhen: { key: 'universityType', value: 2 } },
    }
  },

  // === 住宅 ===
  housing: {
    label: '住宅費用',
    params: {
      housingType: { label: '住居形態', value: 0, min: 0, max: 1, step: 1, options: [{ value: 0, label: '購入' }, { value: 1, label: '賃貸' }] },
      // 購入用
      purchaseAge: { label: '住宅購入時の夫の年齢', value: 35, min: 25, max: 60, step: 1, showWhen: { key: 'housingType', value: 0 } },
      housePrice: { label: '住宅価格（万円）', value: 4000, min: 0, max: 10000, step: 100, showWhen: { key: 'housingType', value: 0 } },
      downPayment: { label: '頭金（万円）', value: 400, min: 0, max: 5000, step: 50, showWhen: { key: 'housingType', value: 0 } },
      loanInterestRate: { label: '住宅ローン金利（%）', value: 1.5, min: 0, max: 5, step: 0.1, showWhen: { key: 'housingType', value: 0 } },
      loanYears: { label: 'ローン年数', value: 35, min: 10, max: 40, step: 1, showWhen: { key: 'housingType', value: 0 } },
      propertyTax: { label: '固定資産税年額（万円）', value: 15, min: 0, max: 50, step: 1, showWhen: { key: 'housingType', value: 0 } },
      maintenanceCost: { label: '修繕費年額（万円）', value: 12, min: 0, max: 50, step: 1, showWhen: { key: 'housingType', value: 0 } },
      rentBeforePurchase: { label: '購入前家賃月額（万円）', value: 10, min: 0, max: 30, step: 1, showWhen: { key: 'housingType', value: 0 } },
      // 賃貸用
      rentMonthly: { label: '家賃月額（万円）', value: 10, min: 0, max: 40, step: 1, showWhen: { key: 'housingType', value: 1 } },
      rentRenewalCycle: { label: '更新年数（年）', value: 2, min: 1, max: 5, step: 1, showWhen: { key: 'housingType', value: 1 } },
      rentRenewalFee: { label: '更新料（ヶ月分）', value: 1, min: 0, max: 3, step: 0.5, showWhen: { key: 'housingType', value: 1 } },
    }
  },

  // === 車 ===
  car: {
    label: '車関連',
    params: {
      hasCar: { label: '車を所有する', value: 1, min: 0, max: 1, step: 1, options: [{ value: 0, label: 'いいえ' }, { value: 1, label: 'はい' }] },
      carPrice: { label: '車両購入費（万円）', value: 250, min: 0, max: 1000, step: 10, showWhen: { key: 'hasCar', value: 1 } },
      carReplaceCycle: { label: '買い替えサイクル（年）', value: 7, min: 3, max: 15, step: 1, showWhen: { key: 'hasCar', value: 1 } },
      carAnnualCost: { label: '車維持費年額（万円）', value: 40, min: 0, max: 100, step: 5, showWhen: { key: 'hasCar', value: 1 } },
      firstCarAge: { label: '最初の車購入時の夫の年齢', value: 30, min: 20, max: 60, step: 1, showWhen: { key: 'hasCar', value: 1 } },
      lastCarAge: { label: '最後の車所有年齢', value: 75, min: 60, max: 85, step: 1, showWhen: { key: 'hasCar', value: 1 } },
    }
  },

  insurance: {
    label: '保険',
    params: {
      husbandHasLifeInsurance: { label: '生命保険に加入', value: 1, min: 0, max: 1, step: 1, options: [{ value: 0, label: 'いいえ' }, { value: 1, label: 'はい' }], tab: 'husband' },
      husbandLifeInsurance: { label: '生命保険年額（万円）', value: 12, min: 0, max: 100, step: 1, showWhen: { key: 'husbandHasLifeInsurance', value: 1 }, tab: 'husband' },
      lifeInsuranceStartAge: { label: '生命保険 開始年齢', value: 30, min: 20, max: 50, step: 1, showWhen: { key: 'husbandHasLifeInsurance', value: 1 }, tab: 'husband' },
      lifeInsuranceEndAge: { label: '生命保険 終了年齢', value: 65, min: 50, max: 80, step: 1, showWhen: { key: 'husbandHasLifeInsurance', value: 1 }, tab: 'husband' },
      husbandHasMedicalInsurance: { label: '医療保険に加入', value: 1, min: 0, max: 1, step: 1, options: [{ value: 0, label: 'いいえ' }, { value: 1, label: 'はい' }], tab: 'husband' },
      husbandMedicalInsurance: { label: '医療保険年額（万円）', value: 5, min: 0, max: 50, step: 1, showWhen: { key: 'husbandHasMedicalInsurance', value: 1 }, tab: 'husband' },
      medicalInsuranceStartAge: { label: '医療保険 開始年齢', value: 30, min: 20, max: 50, step: 1, showWhen: { key: 'husbandHasMedicalInsurance', value: 1 }, tab: 'husband' },
      medicalInsuranceEndAge: { label: '医療保険 終了年齢', value: 65, min: 50, max: 80, step: 1, showWhen: { key: 'husbandHasMedicalInsurance', value: 1 }, tab: 'husband' },
      wifeHasLifeInsurance: { label: '生命保険に加入', value: 1, min: 0, max: 1, step: 1, options: [{ value: 0, label: 'いいえ' }, { value: 1, label: 'はい' }], tab: 'wife' },
      wifeLifeInsurance: { label: '生命保険年額（万円）', value: 8, min: 0, max: 100, step: 1, showWhen: { key: 'wifeHasLifeInsurance', value: 1 }, tab: 'wife' },
      wifeLifeInsuranceStartAge: { label: '生命保険 開始年齢', value: 28, min: 20, max: 50, step: 1, showWhen: { key: 'wifeHasLifeInsurance', value: 1 }, tab: 'wife' },
      wifeLifeInsuranceEndAge: { label: '生命保険 終了年齢', value: 65, min: 50, max: 80, step: 1, showWhen: { key: 'wifeHasLifeInsurance', value: 1 }, tab: 'wife' },
      wifeHasMedicalInsurance: { label: '医療保険に加入', value: 1, min: 0, max: 1, step: 1, options: [{ value: 0, label: 'いいえ' }, { value: 1, label: 'はい' }], tab: 'wife' },
      wifeMedicalInsurance: { label: '医療保険年額（万円）', value: 5, min: 0, max: 50, step: 1, showWhen: { key: 'wifeHasMedicalInsurance', value: 1 }, tab: 'wife' },
      wifeMedicalInsuranceStartAge: { label: '医療保険 開始年齢', value: 28, min: 20, max: 50, step: 1, showWhen: { key: 'wifeHasMedicalInsurance', value: 1 }, tab: 'wife' },
      wifeMedicalInsuranceEndAge: { label: '医療保険 終了年齢', value: 65, min: 50, max: 80, step: 1, showWhen: { key: 'wifeHasMedicalInsurance', value: 1 }, tab: 'wife' },
    }
  },

  // === 生活費 ===
  living: {
    label: '生活費（月額）',
    params: {
      foodCost: { label: '食費（万円）', value: 7, min: 1, max: 20, step: 0.1 },
      utilityCost: { label: '水道・光熱費（万円）', value: 2, min: 0.5, max: 8, step: 0.1 },
      communicationCost: { label: '通信費（万円）', value: 1.5, min: 0, max: 5, step: 0.1 },
      transportCost: { label: '交通費（万円）', value: 1, min: 0, max: 5, step: 0.1 },
      clothingCost: { label: '被服・履物（万円）', value: 1, min: 0, max: 5, step: 0.1 },
      dailyGoodsCost: { label: '日用品・雑貨（万円）', value: 1, min: 0, max: 5, step: 0.1 },
      medicalCost: { label: '医療費（万円）', value: 1, min: 0, max: 10, step: 0.1 },
      entertainmentCost: { label: '教養・娯楽費（万円）', value: 3, min: 0, max: 10, step: 0.1 },
      socialCost: { label: '交際費（万円）', value: 1.5, min: 0, max: 10, step: 0.1 },
      miscCost: { label: 'その他雑費（万円）', value: 2, min: 0, max: 10, step: 0.1 },
      retiredLivingRatio: { label: '退職後の生活費比率（%）', value: 85, min: 50, max: 100, step: 5 },
      inflationRate: { label: 'インフレ率（%）', value: 1.0, min: 0, max: 5, step: 0.1 },
    }
  },

  // === 投資 ===
  investment: {
    label: '投資',
    params: {
      investmentReturnLow: { label: '悲観シナリオ利回り（%）', value: 3, min: 0, max: 10, step: 0.5, tab: 'common' },
      investmentReturn: { label: '標準シナリオ利回り（%）', value: 5, min: 0, max: 15, step: 0.5, tab: 'common' },
      investmentReturnHigh: { label: '楽観シナリオ利回り（%）', value: 7, min: 0, max: 20, step: 0.5, tab: 'common' },
      investmentCurrentBalance: { label: '現状の投資残高（万円）', value: 0, min: 0, max: 5000, step: 10, tab: 'husband' },
      investmentMonthly: { label: '月額積立額（万円）', value: 3, min: 0, max: 30, step: 0.5, tab: 'husband' },
      investmentStartAge: { label: '投資開始年齢', value: 30, min: 20, max: 60, step: 1, tab: 'husband' },
      investmentEndAge: { label: '投資終了年齢', value: 65, min: 30, max: 80, step: 1, tab: 'husband' },
      investmentWithdrawAge: { label: '取り崩し開始年齢', value: 65, min: 50, max: 85, step: 1, tab: 'husband' },
      investmentWithdrawMonthly: { label: '取り崩し月額（万円）', value: 10, min: 0, max: 50, step: 1, tab: 'husband' },
      wifeInvestmentCurrentBalance: { label: '現状の投資残高（万円）', value: 0, min: 0, max: 5000, step: 10, tab: 'wife' },
      wifeInvestmentMonthly: { label: '月額積立額（万円）', value: 2, min: 0, max: 30, step: 0.5, tab: 'wife' },
      wifeInvestmentStartAge: { label: '投資開始年齢', value: 28, min: 20, max: 60, step: 1, tab: 'wife' },
      wifeInvestmentEndAge: { label: '投資終了年齢', value: 65, min: 30, max: 80, step: 1, tab: 'wife' },
      wifeInvestmentWithdrawAge: { label: '取り崩し開始年齢', value: 65, min: 50, max: 85, step: 1, tab: 'wife' },
      wifeInvestmentWithdrawMonthly: { label: '取り崩し月額（万円）', value: 5, min: 0, max: 50, step: 1, tab: 'wife' },
    }
  },

  // === その他 ===
  other: {
    label: 'その他',
    params: {
      savingsRate: { label: '初期貯蓄額（万円）', value: 300, min: 0, max: 5000, step: 50 },
      simulationEndAge: { label: 'シミュレーション終了年齢（夫）', value: 90, min: 70, max: 100, step: 1 },
    }
  },
};

/**
 * 子どもの年齢に基づく教育イベントを生成
 */
export function getEducationEvents(childAge, childIndex, params) {
  const events = [];
  const childLabel = `第${childIndex + 1}子`;

  // 幼稚園 (3-5歳)
  for (let age = 3; age <= 5; age++) {
    const isPrivate = params.kindergartenType;
    const cost = isPrivate ? params.kindergartenPrivate : params.kindergartenPublic;
    events.push({
      childAge: age,
      category: 'education',
      label: `${childLabel} 幼稚園（${isPrivate ? '私立' : '公立'}）${age === 3 ? '入園' : ''}`,
      cost,
      isAnnual: false,
    });
  }

  // 小学校 (6-11歳)
  for (let age = 6; age <= 11; age++) {
    const isPrivate = params.elementaryType;
    const cost = isPrivate ? params.elementaryPrivate : params.elementaryPublic;
    events.push({
      childAge: age,
      category: 'education',
      label: `${childLabel} 小学校（${isPrivate ? '私立' : '公立'}）${age === 6 ? '入学' : ''}`,
      cost,
      isAnnual: false,
    });
  }

  // 中学校 (12-14歳)
  for (let age = 12; age <= 14; age++) {
    const isPrivate = params.middleSchoolType;
    const cost = isPrivate ? params.middleSchoolPrivate : params.middleSchoolPublic;
    events.push({
      childAge: age,
      category: 'education',
      label: `${childLabel} 中学校（${isPrivate ? '私立' : '公立'}）${age === 12 ? '入学' : ''}`,
      cost,
      isAnnual: false,
    });
  }

  // 高校 (15-17歳)
  for (let age = 15; age <= 17; age++) {
    const isPrivate = params.highSchoolType;
    const cost = isPrivate ? params.highSchoolPrivate : params.highSchoolPublic;
    events.push({
      childAge: age,
      category: 'education',
      label: `${childLabel} 高校（${isPrivate ? '私立' : '公立'}）${age === 15 ? '入学' : ''}`,
      cost,
      isAnnual: false,
    });
  }

  // 大学 (18-21歳)
  const uniType = params.universityType;
  let uniTotal;
  let uniLabel;
  if (uniType === 0) {
    uniTotal = params.universityNational;
    uniLabel = '国公立';
  } else if (uniType === 1) {
    uniTotal = params.universityPrivateArts;
    uniLabel = '私立文系';
  } else {
    uniTotal = params.universityPrivateScience;
    uniLabel = '私立理系';
  }
  const annualUni = uniTotal / 4;
  for (let age = 18; age <= 21; age++) {
    events.push({
      childAge: age,
      category: 'education',
      label: `${childLabel} 大学（${uniLabel}）${age === 18 ? '入学' : ''}`,
      cost: annualUni,
      isAnnual: false,
    });
  }

  return events;
}
