/**
 * 入力フォームコンポーネント
 * 家族構成（夫婦の年齢・子どもの人数と年齢）を入力
 */

export function createInputForm(container, onSubmit, savedFamily = null) {
  container.innerHTML = `
    <div class="input-form">
      <div class="form-header">
        <h2>👨‍👩‍👧‍👦 家族構成を入力</h2>
        <p class="form-subtitle">ご家族の情報を入力して、将来のライフプランをシミュレーションしましょう</p>
      </div>

      <div class="form-grid">
        <div class="form-card">
          <div class="card-icon">🧑</div>
          <h3>夫</h3>
          <div class="form-field">
            <label for="husbandAge">年齢</label>
            <input type="number" id="husbandAge" value="${savedFamily ? savedFamily.husbandAge : 30}" min="18" max="80" />
            <span class="field-unit">歳</span>
          </div>
        </div>

        <div class="form-card">
          <div class="card-icon">👩</div>
          <h3>妻</h3>
          <div class="form-field">
            <label for="wifeAge">年齢</label>
            <input type="number" id="wifeAge" value="${savedFamily ? savedFamily.wifeAge : 28}" min="18" max="80" />
            <span class="field-unit">歳</span>
          </div>
        </div>
      </div>

      <div class="children-section">
        <div class="children-header">
          <h3>👶 お子さま</h3>
          <button type="button" class="btn-add-child" id="addChildBtn">
            <span class="btn-icon">＋</span> 子どもを追加
          </button>
        </div>
        <div id="childrenList" class="children-list"></div>
        <p class="children-hint">「将来の予定」にチェックを入れると、出産予定のシミュレーションが可能です</p>
      </div>

      <button type="button" class="btn-simulate" id="simulateBtn">
        <span class="btn-simulate-icon">▶</span>
        シミュレーション開始
      </button>
    </div>
  `;

  let children = [];
  let childIdCounter = 0;

  // 保存データから子ども情報を復元
  if (savedFamily && savedFamily.children && savedFamily.children.length > 0) {
    savedFamily.children.forEach(c => {
      children.push({ id: childIdCounter++, age: c.age || 0, isFuture: c.isFuture || false, futureBirthHusbandAge: c.futureBirthHusbandAge || 30 });
    });
  }

  const childrenList = container.querySelector('#childrenList');
  const addChildBtn = container.querySelector('#addChildBtn');
  const simulateBtn = container.querySelector('#simulateBtn');

  function getHusbandAge() {
    return parseInt(container.querySelector('#husbandAge').value) || 30;
  }

  function addChild() {
    const id = childIdCounter++;
    const child = { id, age: 0, isFuture: false, futureBirthHusbandAge: getHusbandAge() };
    children.push(child);
    renderChildren();
  }

  function removeChild(id) {
    children = children.filter(c => c.id !== id);
    renderChildren();
  }

  function renderChildren() {
    if (children.length === 0) {
      childrenList.innerHTML = '<p class="no-children">お子さまの情報がまだ登録されていません</p>';
      return;
    }

    childrenList.innerHTML = children.map((child, index) => `
      <div class="child-card" data-id="${child.id}">
        <div class="child-card-header">
          <span class="child-label">第${index + 1}子</span>
          <button type="button" class="btn-remove-child" data-remove="${child.id}">✕</button>
        </div>
        <div class="child-card-body">
          <label class="toggle-future">
            <input type="checkbox" class="future-check" data-id="${child.id}" ${child.isFuture ? 'checked' : ''} />
            <span class="toggle-label">将来の予定</span>
          </label>
          ${child.isFuture ? `
            <div class="form-field">
              <label>夫が<input type="number" class="future-age-input" data-id="${child.id}" value="${child.futureBirthHusbandAge}" min="20" max="60" />歳の時に誕生予定</label>
            </div>
          ` : `
            <div class="form-field">
              <label>現在の年齢</label>
              <input type="number" class="child-age-input" data-id="${child.id}" value="${child.age}" min="0" max="30" />
              <span class="field-unit">歳</span>
            </div>
          `}
        </div>
      </div>
    `).join('');

    // イベントリスナー再設定
    childrenList.querySelectorAll('.btn-remove-child').forEach(btn => {
      btn.addEventListener('click', () => removeChild(parseInt(btn.dataset.remove)));
    });

    childrenList.querySelectorAll('.future-check').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        const child = children.find(c => c.id === id);
        if (child) {
          child.isFuture = e.target.checked;
          if (child.isFuture) {
            child.futureBirthHusbandAge = getHusbandAge();
          }
          renderChildren();
        }
      });
    });

    childrenList.querySelectorAll('.child-age-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        const child = children.find(c => c.id === id);
        if (child) child.age = parseInt(e.target.value) || 0;
      });
    });

    childrenList.querySelectorAll('.future-age-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = parseInt(e.target.dataset.id);
        const child = children.find(c => c.id === id);
        if (child) child.futureBirthHusbandAge = parseInt(e.target.value) || 35;
      });
    });
  }

  addChildBtn.addEventListener('click', addChild);

  simulateBtn.addEventListener('click', () => {
    const family = {
      husbandAge: parseInt(container.querySelector('#husbandAge').value) || 30,
      wifeAge: parseInt(container.querySelector('#wifeAge').value) || 28,
      children: children.map(c => ({
        age: c.age,
        isFuture: c.isFuture,
        futureBirthHusbandAge: c.futureBirthHusbandAge,
      })),
    };
    onSubmit(family);
  });

  renderChildren();
}
