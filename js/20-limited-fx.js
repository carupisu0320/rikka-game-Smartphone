// =====================================================================
//  期間限定ガチャの特別な演出（「黄金の精神」のような、専用の演出）
//  ・引いているあいだ、そのガチャのテーマ色の背景と、ゆらゆら昇る飾り（ハロウィンならカボチャやコウモリ）が出ます
//  ・最高レア（superrare）が出るときは、溜めが少し長くなり、「最高レア」の確定演出が先に流れます（光る点滅はなく、ゆっくり回る光だけ）
//  ・既存の startGachaFx（07）を、外から包みます。07 は触りません。※ 07・18 より後に読み込みます
//  ★ 期間限定ガチャを足したら、下の LIMITED_FX に、同じ id のテーマを足してください（足し忘れは、CIのテストが見つけます）
// =====================================================================
const LIMITED_KAKU_RARITY=['superrare'];   // この rarity が当たるとき、確定演出を流す
const LIMITED_KAKU_EXTRA_MS=1600;          // そのとき、溜めを長くする時間
// c1〜c3：背景の色（明るい→暗い）／glyphs：昇る飾り／star：確定演出の中央の絵／cc：文字の色
const LIMITED_FX={
  '1':        {c1:'#e8811a',c2:'#4a1a6e',c3:'#160a24',cc:'#ffe2b0',glyphs:['🎃','🦇','👻','🕸️'],star:'🎃'},  // ハロウィン（リブートも同じ id）
  autumn2026: {c1:'#d9552b',c2:'#6a2a2a',c3:'#211014',cc:'#ffe6d2',glyphs:['🍁','🍂','❄️','🍁'],star:'🍁'},      // 紅葉から初雪へ
  uk2026:     {c1:'#2a52b8',c2:'#8a1428',c3:'#0a1230',cc:'#ffffff',glyphs:['🫖','🚌','☂️','🎩','👑'],star:'👑'}  // イギリス
};
const LIMITED_FX_DEFAULT={c1:'#c9a84c',c2:'#5a3a18',c3:'#1a1008',cc:'#fff4c8',glyphs:['✨','⭐','🌸'],star:'⭐'};
function limitedFxTheme(id){return LIMITED_FX[String(id)]||LIMITED_FX_DEFAULT;}

(function(){
  try{
    if(document.getElementById('limited-fx-css'))return;
    const st=document.createElement('style');st.id='limited-fx-css';
    st.textContent=`
#gacha-fx.ltd-fx{background:radial-gradient(circle at 50% 42%,var(--lc) 0%,var(--lc2) 58%,var(--lc3) 100%)}
.gfx-ltd{position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden}
.gfx-ltd span{position:absolute;bottom:-14%;opacity:0;line-height:1;filter:drop-shadow(0 0 6px rgba(0,0,0,.35));animation:ltdRise var(--d,7s) linear var(--dl,0s) infinite}
@keyframes ltdRise{0%{transform:translate(0,0) rotate(var(--r0,-8deg));opacity:0}12%{opacity:.85}88%{opacity:.85}100%{transform:translate(var(--dx,24px),-125vh) rotate(var(--r1,8deg));opacity:0}}
.gfx-ltdname{position:absolute;left:0;right:0;top:calc(env(safe-area-inset-top,0px) + 9%);z-index:2;text-align:center;pointer-events:none;color:var(--lcc,#fff);font-family:'Hiragino Mincho ProN','Yu Mincho',serif;animation:ltdNameIn .9s ease-out both}
.gfx-ltdname b{display:block;font-size:1.45rem;font-weight:900;letter-spacing:.22em;text-shadow:0 2px 0 rgba(0,0,0,.45),0 0 18px var(--lc)}
.gfx-ltdname i{display:block;font-style:normal;font-size:.72rem;letter-spacing:.4em;opacity:.8;margin-top:.15rem}
@keyframes ltdNameIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
.gfx-ltdkk{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;background:radial-gradient(circle at 50% 44%,rgba(0,0,0,0) 0%,rgba(0,0,0,.7) 100%);animation:ltdkkIn 1.2s ease-out both}
.gfx-ltdkk::before{content:"";position:absolute;left:50%;top:44%;width:190vmax;height:190vmax;margin:-95vmax 0 0 -95vmax;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.17) 0 5deg,transparent 5deg 15deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 52%);mask:radial-gradient(circle,#000 0,transparent 52%);animation:ltdkkSpin 22s linear infinite}
.gfx-ltdkk .k-star{position:absolute;left:50%;top:22%;font-size:4.6rem;line-height:1;transform:translateX(-50%);filter:drop-shadow(0 0 16px var(--lc));animation:ltdkkPulse 1.8s ease-in-out infinite}
.gfx-ltdkk .k-title{position:absolute;left:0;right:0;top:70%;text-align:center;font-family:'Hiragino Mincho ProN','Yu Mincho',serif;font-weight:900;font-size:1.9rem;letter-spacing:.3em;padding-left:.3em;color:var(--lcc,#fff);text-shadow:0 2px 0 rgba(0,0,0,.5),0 0 22px var(--lc);animation:ltdkkText 1.1s ease-out .7s both}
.gfx-ltdkk .k-sub{position:absolute;left:0;right:0;top:calc(70% + 2.7rem);text-align:center;font-size:.8rem;letter-spacing:.12em;color:var(--lcc,#fff);opacity:.85;padding:0 1rem;animation:ltdkkText 1.1s ease-out 1.1s both}
@keyframes ltdkkIn{from{opacity:0}to{opacity:1}}
@keyframes ltdkkSpin{to{transform:rotate(360deg)}}
@keyframes ltdkkPulse{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.1)}}
@keyframes ltdkkText{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes ltdkkOut{to{opacity:0}}
#gacha-fx.st-burst .gfx-ltdkk{animation:ltdkkOut .6s ease-in .1s forwards}
@media (prefers-reduced-motion:reduce){.gfx-ltd span,.gfx-ltdkk::before,.gfx-ltdkk .k-star{animation:none}.gfx-ltd span{opacity:.6;bottom:auto}}
body.calm-fx .gfx-ltdkk::before{animation:none}
`;
    document.head.appendChild(st);
  }catch(e){}
})();

function _lfxCalm(){try{return typeof comfortCalm==='function'&&comfortCalm();}catch(e){return false;}}
function _lfxLite(){try{return typeof comfortLite==='function'&&comfortLite();}catch(e){return false;}}
function _lfxReduce(){try{return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){return false;}}

// 前に付けた飾りを、取り除く（ほかのガチャ・次の1回に残らないように）
function limitedFxClear(el){
  try{
    el.querySelectorAll('.gfx-ltd,.gfx-ltdname,.gfx-ltdkk').forEach(n=>n.remove());
    el.classList.remove('ltd-fx');
    ['--lc','--lc2','--lc3','--lcc'].forEach(k=>el.style.removeProperty(k));
  }catch(e){}
}
// 飾り（背景の色・昇る絵・ガチャの名前）。kk が true のときは、最高レアの確定演出も出す
function limitedFxDecorate(el,item,kk){
  const th=limitedFxTheme(LIMITED_GACHA.id),lite=_lfxLite(),n=lite?6:14;
  el.classList.add('ltd-fx');
  el.style.setProperty('--lc',th.c1);el.style.setProperty('--lc2',th.c2);el.style.setProperty('--lc3',th.c3);el.style.setProperty('--lcc',th.cc);
  const g=document.createElement('div');g.className='gfx-ltd';
  g.innerHTML=Array.from({length:n},(_,i)=>`<span style="left:${(i*37+5)%92}%;font-size:${1.6+(i%4)*.7}rem;--d:${(6+(i%5)*1.1).toFixed(1)}s;--dl:${(-(i*0.9)%7).toFixed(1)}s;--dx:${((i%3)-1)*34}px;--r0:${(i%5-2)*5}deg;--r1:${((i+2)%5-2)*9}deg">${th.glyphs[i%th.glyphs.length]}</span>`).join('');
  el.prepend(g);
  const nm=document.createElement('div');nm.className='gfx-ltdname';nm.innerHTML=`<b>${esc(LIMITED_GACHA.name)}</b><i>期間限定ガチャ</i>`;el.appendChild(nm);
  if(kk){
    const k=document.createElement('div');k.className='gfx-ltdkk';
    k.innerHTML=`<div class="k-star">${th.star}</div><div class="k-title">最高レア</div><div class="k-sub">${esc(String(LIMITED_GACHA.topText||'').replace(/^最高レア[：:]/,''))}</div>`;
    const cv=document.getElementById('gfx-canvas');el.insertBefore(k,cv&&cv.parentNode===el?cv:el.firstChild);
  }
}

// startGachaFx を包む。期間限定ガチャのときだけ、飾りと確定演出を足す
(function(){
  const o=window.startGachaFx;if(typeof o!=='function')return;
  window.startGachaFx=function(item){
    const el=document.getElementById('gacha-fx');
    if(el)limitedFxClear(el);
    const lim=(typeof _lastBanner!=='undefined'&&_lastBanner==='limited');
    if(!lim||!el||!item)return o.apply(this,arguments);
    const kk=!_lfxReduce()&&!_lfxCalm()&&LIMITED_KAKU_RARITY.includes(item.rarity),cfg=GFX_CFG[item.rarity];
    let saved=null;
    if(kk&&cfg){saved=cfg.charge;cfg.charge=saved+LIMITED_KAKU_EXTRA_MS;} // 溜めを長くする（07 は、この値を呼び出しの最初に読む）
    let r;
    try{r=o.apply(this,arguments);}finally{if(saved!=null)cfg.charge=saved;}
    try{limitedFxDecorate(el,item,kk);}catch(e){}
    return r;
  };
})();
