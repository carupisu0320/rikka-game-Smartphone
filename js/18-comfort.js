// =====================================================================
//  やさしい表示（光を抑える／軽量モード）
//  ① 光を抑える（rikka_calm）… 強い光・点滅・画面ゆれを減らします（光に敏感な人向け）
//     ・確定演出の絵（雷・氷・花火など）と、開発者マッチのGIFは、流しません（音と文字だけ）
//     ・全画面の白いフラッシュ、放射状の光、画面のゆれ、明るさの点滅は、おだやかにします
//     ・まだ設定していない人は、端末の「視差効果を減らす」設定にしたがいます
//  ② 軽量モード（rikka_lite）… 低スペックの端末向け。動く飾りと重い描画を減らします
//     ・背景・牌の裏・タイトルの動き、絵文字のアニメ、ぼかし、確定演出の絵を切ります
//     ・火花や花びらの数も減らします
//  どちらも、設定画面の「― 動き ―」にあります。既存の関数は上から包むだけなので、元のファイルは触りません
//  ※ 02/05/07/08/10/11/14 より後に読み込みます
// =====================================================================
const COMFORT_CALM_KEY='rikka_calm',COMFORT_LITE_KEY='rikka_lite';

function _cfOsReduce(){try{return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){return false;}}
function comfortCalm(){ // 光を抑えるか。設定していなければ、端末の「視差効果を減らす」にしたがう
  let v=null;try{v=localStorage.getItem(COMFORT_CALM_KEY);}catch(e){}
  return v==='1'?true:(v==='0'?false:_cfOsReduce());
}
function comfortLite(){try{return localStorage.getItem(COMFORT_LITE_KEY)==='1';}catch(e){return false;}}

// ───────── 見た目（CSS） ─────────
const COMFORT_CSS=`
@keyframes comfortSoft{0%{opacity:0}35%{opacity:.16}100%{opacity:0}}
/* 光を抑える */
body.calm-fx .cf-flash,body.calm-fx .cf-rays,body.calm-fx .kp-rays,body.calm-fx .cf-ring{display:none!important}
body.calm-fx #call-fx.shake{animation:cfLife var(--dur) linear forwards!important}
body.calm-fx #gacha-fx.shake{animation:none!important}
body.calm-fx #gacha-fx.st-burst .gfx-flash,body.calm-fx #gacha-fx.st-burst[data-rarity=superrare] .gfx-flash{animation:comfortSoft 1s ease-out!important}
body.calm-fx .gfx-orb.tell{animation:gfxOrbCharge var(--charge-ms) cubic-bezier(.5,0,.9,.6) forwards!important}
body.calm-fx #giftbox-lobby-btn.giftbox-blink{animation:none!important;box-shadow:0 0 12px 3px rgba(255,208,112,.7)}
body.calm-fx .ltd-bg-bg_gameovera3,body.calm-fx .ltd-bg-bg_gameovera4{animation:ltdPan 7s ease-in-out infinite!important}
body.calm-fx .jo-main,body.calm-fx .jo-go,body.calm-fx .jo-title,body.calm-fx .gfx-gogo span{animation:none!important}
body.calm-fx .kk-star-pulse,body.calm-fx [class*="kp-streak"]{animation:none!important}
/* 軽量モード */
body.lite-mode *{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
body.lite-mode .ico svg{animation:none!important}
body.lite-mode .ld-mist,body.lite-mode .ld-cloud,body.lite-mode .ld-mote,body.lite-mode .gfx-ring,body.lite-mode .gfx-gogo span{animation:none!important}
body.lite-mode .cf-rays,body.lite-mode .kp-rays{display:none!important}
body.lite-mode .cf-rainbow g[filter]{filter:none!important}
body.lite-mode .cf-flash{animation-duration:.25s!important}
`;
(function(){
  try{
    if(document.getElementById('comfort-css'))return;
    const st=document.createElement('style');st.id='comfort-css';st.textContent=COMFORT_CSS;document.head.appendChild(st);
  }catch(e){}
})();

function comfortApply(){ // 画面に反映（bodyの目印）
  try{
    document.body.classList.toggle('calm-fx',comfortCalm());
    document.body.classList.toggle('lite-mode',comfortLite());
  }catch(e){}
}

// ───────── 設定ボタン ─────────
function updateComfortUI(){
  [['calm-btn',comfortCalm()],['lite-btn',comfortLite()]].forEach(([id,on])=>{
    const b=document.getElementById(id);if(!b)return;
    b.textContent=on?'ON':'OFF';
    b.style.background=on?'linear-gradient(135deg,#2a9e6e,#1a6e40)':'#2a1e14';
    b.style.color=on?'#e0fff8':'#8a7048';b.style.borderColor=on?'#2a9e6e':'#3e2e1e';
  });
}
function _cfToggle(key,nowOn){try{localStorage.setItem(key,nowOn?'0':'1');}catch(e){}}
function toggleCalm(){_cfToggle(COMFORT_CALM_KEY,comfortCalm());comfortApply();updateComfortUI();}
function toggleLite(){
  _cfToggle(COMFORT_LITE_KEY,comfortLite());comfortApply();updateComfortUI();
  try{_lastFieldBgKey='';if(typeof updateFieldBgForTurn==='function')updateFieldBgForTurn();}catch(e){}
  try{if(typeof refreshTileBackAnim==='function')refreshTileBackAnim();}catch(e){}
}

// ───────── 既存の動きを、設定に合わせて止める（関数を包むだけ） ─────────
(function(){
  const wrap=(name,make)=>{try{const o=window[name];if(typeof o!=='function')return;window[name]=make(o);}catch(e){}};

  // 確定演出の絵（キャンバス）：光を抑える／軽量のときは流さない（文字・音・色の帯は、そのまま）
  wrap('fxStartScene',o=>function(){if(comfortCalm()||comfortLite())return;return o.apply(this,arguments);});
  // 開発者マッチのGIF
  wrap('devMatchFx',o=>function(){if(comfortCalm()||comfortLite())return;return o.apply(this,arguments);});
  // 背景・牌の裏・タイトルの動き：軽量のときは止める
  wrap('fieldAnimEnabled',o=>function(){return comfortLite()?false:o.apply(this,arguments);});
  wrap('tileAnimEnabled',o=>function(){return comfortLite()?false:o.apply(this,arguments);});
  wrap('makeLobbyCanvas',o=>function(){if(comfortLite())return;return o.apply(this,arguments);});
  // 設定画面を開いたとき、ボタンの表示も更新
  wrap('updateAnimUI',o=>function(){const r=o.apply(this,arguments);updateComfortUI();return r;});

  // ガチャ演出：光を抑えるときは、金確定などの派手な演出を使わない「動きを減らす」の流れにする
  // （startGachaFx は最初に matchMedia を1回だけ調べるので、その間だけ答えを変える）
  wrap('startGachaFx',o=>function(){
    if(!comfortCalm())return o.apply(this,arguments);
    const mm=window.matchMedia;
    window.matchMedia=function(q){const r=mm?mm.call(window,q):{matches:false};
      return /prefers-reduced-motion/.test(q||'')?Object.assign({},r,{matches:true}):r;};
    try{return o.apply(this,arguments);}finally{window.matchMedia=mm;}
  });

  // 火花・花びら・飾りの数を減らす（軽量）
  wrap('showCallFx',o=>function(){
    const r=o.apply(this,arguments);
    if(comfortLite()){try{document.querySelectorAll('#call-fx .cf-spark,#call-fx .cf-petal-fall,#call-fx .cf-glyph').forEach((e,i)=>{if(i%3)e.remove();});}catch(e){}}
    return r;
  });
})();

(function(){
  const go=()=>{comfortApply();updateComfortUI();};
  document.body?go():document.addEventListener('DOMContentLoaded',go);
  window.addEventListener('load',go);
  try{ // 端末の「視差効果を減らす」を変えたとき、まだ設定していなければ追いかける
    const m=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)');
    if(m&&m.addEventListener)m.addEventListener('change',go);
  }catch(e){}
})();
