// cypress/integration/populationChart.cy.ts
describe('グラフ描画', () => {
  it('チェックした時にグラフが描画されるか', () => {
    cy.visit('http://localhost:3000');

    // 最初のチェックボックスを取得し、クリックする
    cy.get('input[type="checkbox"]').first().click();

    // グラフが描画されるまで待つ
    cy.get('#population-chart').should('be.visible');
  });

  it('チェックを外した時にグラフが消えるか', () => {
    cy.visit('http://localhost:3000');

    // 最初のチェックボックスを取得し、クリックする
    cy.get('input[type="checkbox"]').first().click();

    // グラフが描画されるまで待つ
    cy.get('#population-chart').should('be.visible');

    // 最初のチェックボックスを取得し、クリックしてチェックを外す
    cy.get('input[type="checkbox"]').first().click();

    // グラフが消えるまで待つ
    cy.get('p').contains('データがありません').should('be.visible');
  });

  it('リセットボタンを押した時にグラフが消えるか', () => {
    // アプリケーションのURLにアクセス
    cy.visit('http://localhost:3000');

    // 最初のチェックボックスを取得し、クリックする
    cy.get('input[type="checkbox"]').first().click();

    // グラフが描画されるまで待つ
    cy.get('#population-chart').should('be.visible');

    // リセットボタンを押す
    cy.get('button').contains('リセット').click();

    // グラフが消えるまで待つ
    cy.get('p').contains('データがありません').should('be.visible');
  });
});
