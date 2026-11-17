// =====================================================================
//  ガチャの充実：提供割合の表示／天井／ガチャ履歴／重複したときの交換（かけら）
//  ・抽選の中身は 07-gacha-ui.js の drawGacha / drawGachaMulti から、ここの gachaRollOne などを呼びます
//  ・割合の表示は、実際の抽選と同じデータ（GACHA_RARITY_INFO と gachaPool）から計算するので、ずれません
//  ・調整したいときは、下の GACHA_PITY / DUP_SHARDS / SHARD_COST の数字だけ変えてください
//  保存：rikka_gacha_pity（天井の数え）／rikka_gacha_shards（かけら）／rikka_gacha_log（履歴）
//  ※ 06・07 より後に読み込みます
// =====================================================================
const GACHA_PITY={n:50,rarity:'superrare'};            // n回目までに超レアが出なければ、n回目が超レア確定（出たらリセット。ガチャごとに数える）
const DUP_SHARDS={common:1,uncommon:3,rare:10,superrare:30};     // 重複したときにもらえる「かけら」
const SHARD_COST={common:10,uncommon:30,rare:100,superrare:300}; // 交換に必要なかけら（恒常ガチャの景品が対象）
const GACHA_LOG_MAX=300;
const GK_PITY='rikka_gacha_pity',GK_SHARDS='rikka_gacha_shards',GK_LOG='rikka_gacha_log';

function _gpJ(k,def){try{const v=JSON.parse(localStorage.getItem(k));return v==null?def:v;}catch(e){return def;}}
function _gpSet(k,v){try{localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));}catch(e){}}

// ───────── ガチャの種類 ─────────
function gachaBannerKey(banner){return banner==='gold'?'gold':banner==='limited'?'L'+String(LIMITED_GACHA.id):'std';}
function gachaBannerLabel(banner){return banner==='gold'?'黄金の精神':banner==='limited'?'期間限定':'恒常';}

// ───────── 天井 ─────────
function gachaPityLoad(){const o=_gpJ(GK_PITY,{});return o&&typeof o==='object'&&!Array.isArray(o)?o:{};}
function gachaPityCount(banner){return Math.max(0,parseInt(gachaPityLoad()[gachaBannerKey(banner)],10)||0);}
function gachaPityLeft(banner){return Math.max(1,GACHA_PITY.n-gachaPityCount(banner));} // あと何回で確定か（1＝次の1回）

// 1回ぶんの抽選。pt を渡すと、保存はしない（まとめて引くときに、呼び出し側が最後に1回だけ保存する）
function gachaRollOne(banner,opt,pt){
  opt=opt||{};const own=!pt;if(own)pt=gachaPityLoad();
  const key=gachaBannerKey(banner),cnt=Math.max(0,parseInt(pt[key],10)||0);
  let rarity,pity=false;
  if(cnt+1>=GACHA_PITY.n){rarity=GACHA_PITY.rarity;pity=true;}
  else{
    rarity=pickGachaRarity();
    if(opt.forceRare){const R=GACHA_RARITY_INFO; // 10回目：レア以上がまだなら、レア（超レアは少しだけ）に差し替え
      rarity=Math.random()*(R.rare.weight+R.superrare.weight)<R.superrare.weight?'superrare':'rare';}
  }
  pt[key]=rarity===GACHA_PITY.rarity?0:cnt+1;
  if(own)_gpSet(GK_PITY,pt);
  const pool=gachaPool(rarity,banner),item=pool[Math.floor(Math.random()*pool.length)];
  return {item,rarity,pity};
}
function gachaPitySave(pt){_gpSet(GK_PITY,pt);}

// ───────── かけら ─────────
function gachaShards(){return Math.max(0,parseInt(localStorage.getItem(GK_SHARDS)||'0',10)||0);}
function gachaShardsAdd(n){const v=Math.min(1e7,Math.max(0,gachaShards()+n));_gpSet(GK_SHARDS,String(v));return v;}

// ───────── 履歴 ─────────
function gachaLogLoad(){const a=_gpJ(GK_LOG,[]);return Array.isArray(a)?a.filter(e=>Array.isArray(e)&&typeof e[1]==='string'):[];}
// entries: [{item,isDup,banner,pity}]。履歴に足し、重複ぶんのかけらを渡す。もらったかけらの数を返す
function gachaRecord(entries){
  let shards=0;const t=Date.now(),log=gachaLogLoad();
  entries.forEach(e=>{
    const b=e.banner==='gold'?'g':e.banner==='limited'?'l':'s';
    log.push([t,e.item.id,b,e.isDup?1:0,e.pity?1:0]);
    if(e.isDup)shards+=DUP_SHARDS[e.item.rarity]||0;
  });
  _gpSet(GK_LOG,log.slice(-GACHA_LOG_MAX));
  if(shards)gachaShardsAdd(shards);
  try{updateGachaPityLabels();}catch(e){}
  return shards;
}

// ───────── 提供割合（実際の抽選と同じデータから計算） ─────────
function gachaRates(banner){
  const info=GACHA_RARITY_INFO,total=Object.values(info).reduce((s,x)=>s+x.weight,0);
  return ['superrare','rare','uncommon','common'].map(k=>{
    const pool=gachaPool(k,banner),rate=info[k].weight/total*100;
    return {key:k,label:info[k].label,color:info[k].color,rate,count:pool.length,per:pool.length?rate/pool.length:0,items:pool};
  });
}
const _pct=x=>(Math.round(x*1000)/1000).toString().replace(/(\.\d*?)0+$/,'$1').replace(/\.$/,'');

// ───────── 各ガチャの画面に出す「天井」の表示 ─────────
function updateGachaPityLabels(){
  try{
    document.querySelectorAll('.gacha-pity[data-banner]').forEach(el=>{
      const b=el.dataset.banner,left=gachaPityLeft(b);
      el.textContent=`🎯 あと${left}回以内に超レア確定（天井 ${GACHA_PITY.n}回）`;
    });
  }catch(e){}
}

// ───────── 見た目 ─────────
(function(){
  try{
    if(document.getElementById('gacha-plus-css'))return;
    const st=document.createElement('style');st.id='gacha-plus-css';
    st.textContent=`
.gacha-info-btn{background:#2a1e14;color:#e8c870;border:1px solid #5a4020;border-radius:999px;padding:.25rem .7rem;font-size:.78rem;font-family:inherit;cursor:pointer;margin-left:.4rem}
.gacha-pity{font-size:.74rem;color:#e8c870;margin-top:.4rem;text-align:center}
#gp-modal{position:fixed;inset:0;z-index:900;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.7)}#gp-modal.open{display:flex}
#gp-box{width:min(94vw,460px);max-height:88vh;display:flex;flex-direction:column;background:#161008;border:1px solid #5a4020;border-radius:14px;color:#f0e0b8;overflow:hidden}
.gp-h{display:flex;justify-content:space-between;align-items:center;padding:.6rem .8rem;border-bottom:1px solid #3a2a18}.gp-h b{color:#e8c870}
.gp-x{background:none;border:0;color:#c9a84c;font-size:1.2rem;cursor:pointer}
.gp-chips,.gp-tabs{display:flex;flex-wrap:wrap;gap:.3rem;padding:.5rem .8rem 0}
.gp-chips button,.gp-tabs button{background:#2a1e14;color:#c9a84c;border:1px solid #5a4020;border-radius:999px;padding:.22rem .65rem;font-size:.78rem;font-family:inherit;cursor:pointer}
.gp-chips button.on,.gp-tabs button.on{background:#c9a84c;color:#1a1008;border-color:#c9a84c}
.gp-body{padding:.6rem .8rem .9rem;overflow:auto;font-size:.82rem;line-height:1.6}
.gp-tbl{width:100%;border-collapse:collapse;margin:.3rem 0 .5rem}.gp-tbl th,.gp-tbl td{padding:.28rem .3rem;border-bottom:1px solid #2a1e14;text-align:right}.gp-tbl th:first-child,.gp-tbl td:first-child{text-align:left}.gp-tbl th{color:#8a7048;font-weight:normal;font-size:.72rem}
.gp-note{font-size:.72rem;color:#8a7048;line-height:1.6;margin:.4rem 0}
.gp-bar{height:8px;background:#2a1e14;border-radius:4px;overflow:hidden;margin:.3rem 0}.gp-bar i{display:block;height:100%;background:linear-gradient(90deg,#c9a84c,#f5d040)}
.gp-det{margin:.25rem 0}.gp-det summary{cursor:pointer;color:#c9a84c}.gp-det div{font-size:.74rem;color:#c9a870;padding:.2rem 0 .2rem .8rem}
.gp-row{display:flex;align-items:center;gap:.5rem;padding:.3rem 0;border-bottom:1px solid #2a1e14}.gp-row .t{flex:1;min-width:0}.gp-row .s{font-size:.7rem;color:#8a7048}
.gp-row .ic{width:30px;height:30px;flex:none;display:flex;align-items:center;justify-content:center;font-size:1.3rem}
.gp-row button{background:linear-gradient(135deg,#c9a84c,#a8832e);color:#1a1008;border:0;border-radius:8px;padding:.3rem .6rem;font-size:.76rem;font-family:inherit;cursor:pointer}.gp-row button:disabled{opacity:.35;cursor:default}
.gp-new{color:#6bd88a;font-size:.68rem;margin-left:.3rem}.gp-dup{color:#8a7048;font-size:.68rem;margin-left:.3rem}.gp-pt{color:#f5d040;font-size:.68rem;margin-left:.3rem}
`;
    document.head.appendChild(st);
  }catch(e){}
})();

// ───────── 情報画面 ─────────
let _gpBanner='std',_gpTab='rate';
function _gpBanners(){const a=['std','gold'];try{if(isLimitedActive())a.splice(1,0,'limited');}catch(e){}return a;}
function openGachaInfo(banner,tab){
  _gpBanner=banner||(typeof _lastBanner!=='undefined'?_lastBanner:'std')||'std';
  if(!_gpBanners().includes(_gpBanner))_gpBanner='std';
  _gpTab=tab||'rate';
  let m=document.getElementById('gp-modal');
  if(!m){m=document.createElement('div');m.id='gp-modal';m.onclick=e=>{if(e.target===m)closeGachaInfo();};document.body.appendChild(m);}
  m.classList.add('open');renderGachaInfo();
}
function closeGachaInfo(){const m=document.getElementById('gp-modal');if(m)m.classList.remove('open');}
function gachaInfoGo(o){if(o.banner)_gpBanner=o.banner;if(o.tab)_gpTab=o.tab;renderGachaInfo();}

function _gpRateHtml(b){
  const R=gachaRates(b);
  return `<table class="gp-tbl"><tr><th>レア度</th><th>提供割合</th><th>景品数</th><th>1個あたり</th></tr>`+
    R.map(r=>`<tr><td style="color:${r.color}">★ ${esc(r.label)}</td><td>${_pct(r.rate)}%</td><td>${r.count}</td><td>${_pct(r.per)}%</td></tr>`).join('')+`</table>`+
    R.map(r=>`<details class="gp-det"><summary style="color:${r.color}">${esc(r.label)}の景品（${r.count}）</summary><div>${r.items.map(i=>esc(i.title)).join('、')}</div></details>`).join('')+
    `<div class="gp-note">・「1個あたり」は、そのレア度の景品の中から、同じ確率で選ばれます<br>・10連・100連は、10回ごとにレア以上が1つ確定です。10回目まででレア以上が出ていないときだけ、10回目をレア（超レアは少しだけ）に差し替えます<br>・天井：超レアが出ないまま引き続けると、${GACHA_PITY.n}回目が超レア確定です（出るとリセット。ガチャごとに数えます）<br>・すでに持っている景品が出たときは、花びらが${Math.ceil(GACHA_COST/2)}枚戻り、かけらがもらえます</div>`;
}
function _gpPityHtml(b){
  const c=gachaPityCount(b),left=gachaPityLeft(b),pct=Math.min(100,Math.round(c/GACHA_PITY.n*100));
  return `<div>「${esc(gachaBannerLabel(b))}」の天井</div><div style="font-size:1.1rem;color:#f5d040;margin:.3rem 0">超レアまで あと <b>${left}</b> 回以内に確定</div>
    <div class="gp-bar"><i style="width:${pct}%"></i></div><div class="gp-note">超レアが出ていない回数：${c} / ${GACHA_PITY.n}</div>
    <div class="gp-note">・超レアが出ないまま${GACHA_PITY.n}回引くと、${GACHA_PITY.n}回目で必ず超レアが出ます<br>・超レアが出ると、この数え方は0に戻ります（天井で出たときも同じです）<br>・数えるのは、ガチャごとです（恒常・黄金の精神・期間限定は、別々に数えます）<br>・天井で出る景品も、通常の超レアと同じ中から選ばれます。すでに持っているものが出たときは、かけらになります</div>`;
}
function _gpLogHtml(){
  const log=gachaLogLoad();
  if(!log.length)return '<div class="gp-note">まだ履歴がありません。ガチャを引くと、ここに残ります</div>';
  const cnt={superrare:0,rare:0,uncommon:0,common:0};
  const rows=log.slice().reverse().map(e=>{
    const it=GACHA_ITEMS.find(x=>x.id===e[1]);if(it&&e[2]!=='x')cnt[it.rarity]++;
    return {e,it};
  });
  const d=t=>{const x=new Date(t),p=n=>String(n).padStart(2,'0');return `${x.getMonth()+1}/${x.getDate()} ${p(x.getHours())}:${p(x.getMinutes())}`;};
  const bl={s:'恒常',g:'黄金',l:'限定',x:'かけらと交換'};
  return `<div class="gp-note">新しい${log.length}回ぶん（最大${GACHA_LOG_MAX}回）。${['superrare','rare','uncommon','common'].map(k=>`<span style="color:${GACHA_RARITY_INFO[k].color}">${GACHA_RARITY_INFO[k].label} ${cnt[k]}</span>`).join('　')}</div>`+
    rows.slice(0,150).map(({e,it})=>{const col=it?GACHA_RARITY_INFO[it.rarity].color:'#888';
      return `<div class="gp-row"><div class="t"><span style="color:${col}">★</span> ${esc(it?it.title:e[1])}${e[2]==='x'?'<span class="gp-new">交換</span>':e[3]?'<span class="gp-dup">かぶり</span>':'<span class="gp-new">NEW</span>'}${e[4]?'<span class="gp-pt">天井</span>':''}<div class="s">${d(e[0])}　${bl[e[2]]||''}</div></div></div>`;}).join('');
}
function _gpExchangeHtml(){
  const have=new Set(loadGachaState().owned),sh=gachaShards();
  let h=`<div>かけら <b style="color:#f5d040">${sh}</b> 個</div><div class="gp-note">すでに持っている景品が出ると、かけらがもらえます（${['common','uncommon','rare','superrare'].map(k=>`${GACHA_RARITY_INFO[k].label} ${DUP_SHARDS[k]}`).join('・')}）。かけらで、恒常ガチャの景品（まだ持っていないもの）と交換できます。期間限定・黄金の精神・イベントの景品は、対象外です</div>`;
  let any=false;
  ['superrare','rare','uncommon','common'].forEach(k=>{
    const list=gachaPool(k,'std').filter(i=>!have.has(i.id));if(!list.length)return;any=true;
    h+=`<div style="color:${GACHA_RARITY_INFO[k].color};margin-top:.5rem">★ ${esc(GACHA_RARITY_INFO[k].label)}（${SHARD_COST[k]}個）</div>`+
      list.map(i=>`<div class="gp-row"><div class="ic">${(typeof itemIconHtml==='function')?itemIconHtml(i):esc(i.icon||'')}</div><div class="t">${esc(i.title)}</div><button ${sh>=SHARD_COST[k]?'':'disabled'} onclick="gachaExchange('${i.id}')">${SHARD_COST[k]}個で交換</button></div>`).join('');
  });
  if(!any)h+='<div class="gp-note">交換できる景品は、すべて持っています</div>';
  return h;
}
function renderGachaInfo(){
  const m=document.getElementById('gp-modal');if(!m)return;
  const tabs=[['rate','提供割合'],['pity','天井'],['log','履歴'],['ex','交換所']];
  const showB=_gpTab==='rate'||_gpTab==='pity';
  m.innerHTML=`<div id="gp-box"><div class="gp-h"><b>📊 ガチャ情報</b><button class="gp-x" onclick="closeGachaInfo()" aria-label="閉じる">✕</button></div>
    <div class="gp-tabs">${tabs.map(([k,n])=>`<button class="${_gpTab===k?'on':''}" onclick="gachaInfoGo({tab:'${k}'})">${n}</button>`).join('')}</div>
    ${showB?`<div class="gp-chips">${_gpBanners().map(b=>`<button class="${_gpBanner===b?'on':''}" onclick="gachaInfoGo({banner:'${b}'})">${esc(gachaBannerLabel(b))}</button>`).join('')}</div>`:''}
    <div class="gp-body">${_gpTab==='rate'?_gpRateHtml(_gpBanner):_gpTab==='pity'?_gpPityHtml(_gpBanner):_gpTab==='log'?_gpLogHtml():_gpExchangeHtml()}</div></div>`;
}

// ───────── 交換 ─────────
function gachaExchange(id){
  const it=GACHA_ITEMS.find(x=>x.id===id);if(!it)return false;
  if(!gachaPool(it.rarity,'std').some(x=>x.id===id))return false;      // 恒常ガチャの景品だけ
  if(loadGachaState().owned.includes(id)){toast('すでに持っています');return false;}
  const cost=SHARD_COST[it.rarity];
  if(gachaShards()<cost){toast('かけらが足りません');return false;}
  if(typeof confirm==='function'&&!confirm(`「${it.title}」を、かけら${cost}個と交換しますか？`))return false;
  gachaShardsAdd(-cost);grantItem(id);
  const log=gachaLogLoad();log.push([Date.now(),id,'x',0,0]);_gpSet(GK_LOG,log.slice(-GACHA_LOG_MAX));
  try{const n=checkAchievements(false,{misc:true});showAchievementPopup(n);}catch(e){}
  try{renderGachaCollection();}catch(e){}
  toast(`🎁「${it.title}」と交換しました`);renderGachaInfo();return true;
}

// ガチャ画面を開くとき、天井の表示を更新（横スクロール用の複製を作る前に入れておく）
(function(){
  const o=window.openGacha;
  if(typeof o==='function')window.openGacha=function(){try{updateGachaPityLabels();}catch(e){}const r=o.apply(this,arguments);try{updateGachaPityLabels();}catch(e){}return r;};
  document.addEventListener('DOMContentLoaded',()=>{try{updateGachaPityLabels();}catch(e){}});
})();
