'use strict';
// やさしい表示（光を抑える／軽量モード）：設定の判定・演出の止め方・保存対象・画面のボタン
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm'), fs = require('fs'), path = require('path');
const { ROOT, makeContext } = require('./_sandbox');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// 既存の関数の「にせもの」を先に置いてから 18-comfort.js を読み込み、呼ばれたかどうかを見る
function setup({ osReduce = false } = {}) {
  const ctx = makeContext();
  ctx.matchMedia = q => ({ matches: /prefers-reduced-motion/.test(q) ? osReduce : false, addEventListener() {} });
  vm.runInContext(`var __log=[];
    function fxStartScene(){__log.push('scene');}
    function devMatchFx(){__log.push('gif');}
    function fieldAnimEnabled(){return true;}
    function tileAnimEnabled(){return true;}
    function makeLobbyCanvas(){__log.push('lobby');}
    function updateAnimUI(){__log.push('ui');}
    function startGachaFx(){__log.push('gacha:'+matchMedia('(prefers-reduced-motion: reduce)').matches);}
    function showCallFx(){__log.push('call');return 1;}`, ctx);
  vm.runInContext(read('js/18-comfort.js'), ctx, { filename: 'js/18-comfort.js' });
  const run = c => vm.runInContext(c, ctx);
  const log = () => JSON.parse(run('JSON.stringify(__log.splice(0))'));
  return { ctx, run, log, LS: ctx.localStorage };
}

test('光を抑える：未設定なら端末の「視差効果を減らす」にしたがい、設定があればそれが優先', () => {
  assert.strictEqual(setup({ osReduce: false }).run('comfortCalm()'), false);
  assert.strictEqual(setup({ osReduce: true }).run('comfortCalm()'), true);
  const a = setup({ osReduce: true }); a.LS.setItem('rikka_calm', '0'); assert.strictEqual(a.run('comfortCalm()'), false);
  const b = setup({ osReduce: false }); b.LS.setItem('rikka_calm', '1'); assert.strictEqual(b.run('comfortCalm()'), true);
});

test('光を抑える：確定演出の絵とGIFを流さない／OFFのときは、いつもどおり流す', () => {
  const t = setup(); t.run('fxStartScene();devMatchFx()');
  assert.deepStrictEqual(t.log(), ['scene', 'gif']);
  t.LS.setItem('rikka_calm', '1'); t.run('fxStartScene();devMatchFx()');
  assert.deepStrictEqual(t.log(), []);
});

test('光を抑える：ガチャ演出は「動きを減らす」の流れになり、終わったら元に戻る', () => {
  const t = setup(); t.LS.setItem('rikka_calm', '1');
  t.run('startGachaFx()');
  assert.deepStrictEqual(t.log(), ['gacha:true']);
  assert.strictEqual(t.run("matchMedia('(prefers-reduced-motion: reduce)').matches"), false, 'matchMedia が元に戻っていない');
  t.LS.setItem('rikka_calm', '0'); t.run('startGachaFx()');
  assert.deepStrictEqual(t.log(), ['gacha:false']);
});

test('軽量モード：背景・牌の裏・タイトルの動きと、確定演出の絵を止める', () => {
  const t = setup();
  assert.strictEqual(t.run('fieldAnimEnabled()&&tileAnimEnabled()'), true);
  t.LS.setItem('rikka_lite', '1');
  assert.strictEqual(t.run('fieldAnimEnabled()'), false);
  assert.strictEqual(t.run('tileAnimEnabled()'), false);
  t.run('makeLobbyCanvas();fxStartScene();devMatchFx()');
  assert.deepStrictEqual(t.log(), []);
});

test('設定画面の表示更新が、既存の updateAnimUI にも連動する', () => {
  const t = setup(); t.run('updateAnimUI()');
  assert.deepStrictEqual(t.log(), ['ui']);
});

test('設定の保存：2つのキーが、端末のバックアップとサーバーの保存対象に入っている', () => {
  for (const [file, re] of [['js/17-save-guard.js', /const SV_EXACT=\[([^\]]*)\]/], ['server.js', /const SAVE_EXACT = \[([^\]]*)\]/]]) {
    const list = read(file).match(re)[1];
    assert.ok(list.includes("'rikka_calm'") && list.includes("'rikka_lite'"), file + ' に入っていません');
  }
});

test('index.html：スクリプトとボタンがある', () => {
  const html = read('index.html');
  assert.ok(/js\/18-comfort\.js/.test(html));
  for (const id of ['calm-btn', 'lite-btn']) assert.ok(html.includes(`id="${id}"`), id);
  assert.ok(html.includes('onclick="toggleCalm()"') && html.includes('onclick="toggleLite()"'));
});

test('光を抑えるCSSが、強い光・ゆれ・点滅の部品をすべて対象にしている', () => {
  const css = read('js/18-comfort.js');
  for (const sel of ['.cf-flash', '.cf-rays', '#call-fx.shake', '#gacha-fx.shake', '.gfx-flash', '.gfx-orb.tell', 'giftbox-blink', 'ltd-bg-bg_gameovera3'])
    assert.ok(css.includes(sel), sel + ' が対象に入っていません');
  const style = read('css/style.css');
  for (const sel of ['cf-flash', 'cfShake', 'gfxFlash', 'gfxPulse', 'giftBlink', 'ltdFlick'])
    assert.ok(style.includes(sel), 'style.css に ' + sel + ' がなくなりました。18-comfort.js の対象を見直してください');
});
