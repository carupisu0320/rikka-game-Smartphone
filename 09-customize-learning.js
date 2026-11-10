
// ============================================================
// カスタマイズ画面（牌の裏柄・場の背景）
// ============================================================
const BASE_BACK_THEMES=[
  {v:'',      label:'金茶', c1:'#3a2a18', bd:'#5a4028'},
  {v:'blue',  label:'瑠璃', c1:'#0a1830', bd:'#2a4a7a'},
  {v:'red',   label:'紅',   c1:'#2e0a0a', bd:'#7a2a2a'},
  {v:'green', label:'翠',   c1:'#0a2010', bd:'#2a6a3a'},
  {v:'purple',label:'紫',   c1:'#1a0a2e', bd:'#5a2a8a'},
];
const GACHA_THEME_SWATCH={gold:['#3a2a08','#a07a2a'],sakura:['#3a1424','#a04a70'],indigo:['#0a1030','#3a3a8a'],jade:['#0a2e26','#2aa88a'],ice:['#0e2a3e','#7ac8e8'],ember:['#4a1408','#e0682a'],obsidian:['#1a1a22','#6a6a7a'],galaxy:['#1a1048','#6a5ad8'],rainbow:['#3a2a6a','#d8a8ff'],dragon:['#0a3a24','#d8b04a'],warning:['#3a1010','#e04040'],glitch:['#10141c','#40d8c8'],neongrid:['#1a0a30','#d040ff'],crimson:['#3a0610','#ff5060'],pumpkin:['#4a2008','#ff8a20']};
Object.assign(GACHA_THEME_SWATCH,{xmas:['#0e3a1e','#c03030'],newyear:['#5a0a10','#e8c060'],valentine:['#4a0a2a','#ff7aa8'],hanafubuki:['#3a1a30','#ffc0d8'],tanabata:['#0a1040','#8ab0ff'],matsuri:['#2a0a0a','#ff6a40'],tsukimi:['#1a1a3a','#ffe080']});
Object.assign(GACHA_THEME_SWATCH,{momiji:['#4a0e0a','#e0602a'],ginkgo:['#4a3408','#f0c430'],shigure:['#141c28','#7a90a8'],hatsuyuki:['#1a2c3e','#f0f8ff']});
let customizeTab='theme';
function openCustomize(tab){
  closeSidebar();
  customizeTab=tab||'theme';
  document.getElementById('custom-modal').classList.add('open');
  renderCustomize();
}
function closeCustomize(){document.getElementById('custom-modal').classList.remove('open');}
function switchCustomizeTab(t){customizeTab=t;renderCustomize();}
function refreshCustomize(){
  if(document.getElementById('custom-modal').classList.contains('open'))renderCustomize();
}
function renderCustomize(){
  document.getElementById('custom-tab-theme').classList.toggle('active',customizeTab==='theme');
  document.getElementById('custom-tab-bg').classList.toggle('active',customizeTab==='bg');
  ['confetti','title','gicon','fx','icon'].forEach(t=>document.getElementById('custom-tab-'+t).classList.toggle('active',customizeTab===t));
  const st=loadGachaState();
  const owned=new Set(st.owned);
  const body=document.getElementById('custom-body');
  if(customizeTab==='confetti'||customizeTab==='title'){
    const isC=customizeTab==='confetti';
    const cat=customizeTab;
    const eq=st.equipped[cat]||'';
    let h=`<div class="custom-sub">${isC?'上がった時の紙吹雪（選ぶとプレビューが流れます）':'名前の横に表示される称号'}</div><div class="custom-list">`;
    h+=`<button class="custom-row${eq?'':' sel'}" onclick="selectGachaEquip('${cat}','')">
      <div class="ic">${isC?'🎉':'➖'}</div><div class="tx">${isC?'通常':'なし'}</div>${eq?'':'<span class="chk">✔</span>'}</button>`;
    h+=GACHA_ITEMS.filter(it=>it.category===cat&&((!it.loginStar&&!it.limited&&!it.event)||owned.has(it.id))).map(it=>{
      const has=owned.has(it.id);
      const sel=has&&eq===it.id;
      const dots=(isC&&has)?`<div class="dots">${it.value.map(c=>`<i style="background:${c}"></i>`).join('')}</div>`:'';
      return `<button class="custom-row${sel?' sel':''}${has?'':' locked'}" ${has?`onclick="selectGachaEquip('${cat}','${it.id}')"`:''}>
        <div class="ic">${has?it.icon:'🔒'}</div>
        <div class="tx">${has?esc(it.title):(it.achievement?'実績で入手':'ガチャで入手')}<div class="ds">${has?esc(it.desc):''}</div>${dots}</div>
        ${sel?'<span class="chk">✔</span>':''}</button>`;
    }).join('');
    h+='</div>';
    h+='<div class="custom-sub">龍・炎・氷・桜・翡翠・金・藍・黒曜・銀河の裏地は、牌の中で動きます。ON/OFFは、メニューの「動き」で切り替えられます。</div>';
    body.innerHTML=h;
  } else if(customizeTab==='fx'){
    let h=`<div class="custom-sub">リーチ・ロン・上がりの演出を選べます。選ぶとプレビューが流れます（対戦相手の画面にも、あなたが選んだ演出で出ます）</div>`;
    [['riichi','リーチ'],['ron','ロン'],['win','上がり']].forEach(([k,lab])=>{
      h+=`<div class="custom-sub" style="margin-top:.8rem;color:#c9a84c;font-weight:700">${lab}の演出</div><div class="custom-list">`;
      h+=FX_STYLES[k].map(s=>{const gid=GOLD_FX[s.id];if(gid&&!owned.has(gid))return `<button class="custom-row locked" onclick="showCallFx('${k}',myName(),'見本',{${k}:'${s.id}'})"><div class="ic">🔒</div><div class="tx">${esc(s.name)}<div class="ds">「黄金の精神」ガチャで入手（タップで見本）</div></div></button>`;const sel=myFxId(k)===s.id;return `<button class="custom-row${sel?' sel':''}" onclick="selectFx('${k}','${s.id}')"><div class="ic">${GOLD_SVG[s.id]?goldIcon(s.id):s.icon}</div><div class="tx">${esc(s.name)}</div>${sel?'<span class="chk">✔</span>':''}</button>`;}).join('');
      h+='</div>';
    });
    body.innerHTML=h;
  } else if(customizeTab==='gicon'){
    const eq=st.equipped.gicon||'';
    let h=`<div class="custom-sub">ガチャで出たアイコンを、プロフィールのアイコンにできます（対戦相手にも動いて見えます）</div><div class="custom-list">`;
    h+=`<button class="custom-row${eq?'':' sel'}" onclick="selectGachaEquip('gicon','')"><div class="ic">👤</div><div class="tx">ふだんのアイコン<div class="ds">プロフィールで設定した画像（なければGoogleのアイコン）</div></div>${eq?'':'<span class="chk">✔</span>'}</button>`;
    h+=GACHA_ITEMS.filter(it=>it.category==='gicon'&&((!it.limited&&!it.event)||owned.has(it.id))).map(it=>{
      const has=owned.has(it.id),sel=has&&eq===it.id;
      return `<button class="custom-row${sel?' sel':''}${has?'':' locked'}" ${has?`onclick="selectGachaEquip('gicon','${it.id}')"`:''}>
        <div class="ic">${has?itemIconHtml(it):'🔒'}</div>
        <div class="tx">${has?esc(it.title):'ガチャで入手'}<div class="ds">${has?esc(it.desc):''}</div></div>${sel?'<span class="chk">✔</span>':''}</button>`;
    }).join('');
    body.innerHTML=h+'</div>';
  } else if(customizeTab==='icon'){
    const av=myAvatarDisplaySrc();
    const nm=(document.getElementById('pname').value||'プレイヤー');
    const face=av?`<img src="${esc(av)}" style="width:96px;height:96px;border-radius:50%;object-fit:cover" alt="">`:`<span id="custom-face-initial">${esc(nm[0]||'👤')}</span>`;
    body.innerHTML=`<div style="text-align:center;padding:.3rem 0 .6rem">
      <div style="width:96px;height:96px;border-radius:50%;background:#2a1e12;border:2px solid #c9a84c;margin:0 auto .8rem;
        display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden">${face}</div>
      <button class="custom-img-btn" onclick="openIconModal()">🖼️ アイコンを変更する</button></div>
      <div class="custom-sub" style="margin-top:.4rem">名前（10文字まで）</div>
      <input id="custom-name-input" class="finput" type="text" maxlength="10" value="${esc(nm)}"
        oninput="onCustomNameInput(this.value)" onblur="onCustomNameBlur(this)" style="width:100%;margin-bottom:.4rem">
      <div class="custom-sub">変更はすぐ保存されます。対戦中のルームでは、次の対戦から反映されます。</div>`;
  } else if(customizeTab==='theme'){
    const cur=localStorage.getItem('rikka_back_theme')||'';
    let h='<div class="custom-sub">基本の裏柄</div><div class="custom-grid">';
    h+=BASE_BACK_THEMES.map(t=>`<button class="custom-card${cur===t.v?' sel':''}" onclick="selectBackTheme('${t.v}','')">
      ${cur===t.v?'<span class="chk">✔</span>':''}<div class="sw" style="background:${t.c1};border-color:${t.bd}"></div><div class="nm">${t.label}</div></button>`).join('');
    h+='</div><div class="custom-sub">ガチャで手に入れた裏柄</div><div class="custom-grid">';
    h+=GACHA_ITEMS.filter(it=>it.category==='theme'&&((!it.limited&&!it.event)||owned.has(it.id))).map(it=>{
      const has=owned.has(it.id);
      const sw=GACHA_THEME_SWATCH[it.value]||['#2a1e12','#5a4028'];
      const sel=has&&cur===it.value;
      return `<button class="custom-card${sel?' sel':''}${has?'':' locked'}" ${has?`onclick="selectBackTheme('${it.value}','${it.id}')"`:''}>
        ${sel?'<span class="chk">✔</span>':''}<div class="sw" style="background:${has?sw[0]:'#1a1410'};border-color:${has?sw[1]:'#3e2e1e'}"></div>
        <div class="nm">${has?esc(it.title):(it.achievement?'🔒 実績で入手':'🔒 ガチャで入手')}</div></button>`;
    }).join('');
    h+='</div>';
    body.innerHTML=h;
  } else {
    const hasCustom=!!customFieldBgUrl;
    const eq=st.equipped.fieldbg||'';
    const noneSel=!hasCustom&&!eq;
    let h='<div class="custom-sub">場の背景（自分の番のとき）</div><div class="custom-grid">';
    h+=`<button class="custom-card${noneSel?' sel':''}" onclick="selectFieldBgPreset('')">
      ${noneSel?'<span class="chk">✔</span>':''}<div class="sw-bg" style="background:#1a1410">🟫</div><div class="nm">デフォルト</div></button>`;
    h+=GACHA_ITEMS.filter(it=>it.category==='fieldbg'&&((!it.limited&&!it.event&&!it.gold)||owned.has(it.id))).map(it=>{
      const has=owned.has(it.id);
      const sel=has&&!hasCustom&&eq===it.id;
      const bg=!has?'#1a1410':fieldBgPreviewCss(it);
      return `<button class="custom-card${sel?' sel':''}${has?'':' locked'}" ${has?`onclick="selectFieldBgPreset('${it.id}')"`:''}>
        ${sel?'<span class="chk">✔</span>':''}<div class="sw-bg" style="background:${bg}">${has?'':'🔒'}</div>
        <div class="nm">${has?esc(it.title):(it.achievement?'実績で入手':'ガチャで入手')}</div></button>`;
    }).join('');
    h+='</div>';
    h+='<div class="custom-sub">オンライン対戦では、自分の番のときに相手の画面でもこの背景になります。</div>';
    h+='<div class="custom-sub">背景の動きのON/OFFは、メニューの「動き」で切り替えられます。</div>';
    h+=`<button class="custom-img-btn" onclick="openFieldBgModal()">🖼️ 自分の画像URLで設定${hasCustom?'（設定中）':''}</button>`;
    body.innerHTML=h;
  }
}
function onCustomNameInput(v){
  const name=v.trim();
  if(!name)return; // 空の間は保存しない
  document.getElementById('pname').value=name;
  saveCustomName();
  const sb=document.getElementById('sb-name');if(sb)sb.textContent=name;
  const ini=document.getElementById('custom-face-initial');if(ini)ini.textContent=name[0]||'👤';
  if(typeof updateAvatarDisplay==='function')updateAvatarDisplay();
}
function onCustomNameBlur(el){
  if(!el.value.trim())el.value=document.getElementById('pname').value||'プレイヤー'; // 空のまま閉じたら元の名前に戻す
}
function selectBackTheme(value,gachaId){
  const st=loadGachaState();
  if(gachaId)st.equipped.theme=gachaId; else delete st.equipped.theme;
  saveGachaState(st);
  setBackTheme(value);
  renderCustomize();
  renderGachaCollection();
}
function selectGachaEquip(category,id){
  const st=loadGachaState();
  if(id&&!st.owned.includes(id))return;
  if(id)st.equipped[category]=id; else delete st.equipped[category];
  saveGachaState(st);
  if(category==='title')syncMyTitle();
  if(category==='gicon')refreshMyIcon();
  updateSbTitle();
  renderCustomize();
  renderGachaCollection();
  if(category==='confetti'){try{launchConfetti();}catch(e){}}  // 選ぶとプレビューが流れる
}
window.addEventListener('load',()=>{try{refreshTileBackAnim();}catch(e){}});
function updateAnimUI(){
  [['bg-anim-btn','rikka_bg_anim'],['tile-anim-btn','rikka_tile_anim']].forEach(([id,key])=>{
    const b=document.getElementById(id);if(!b)return;const on=localStorage.getItem(key)!=='0';
    b.textContent=on?'ON':'OFF';b.style.background=on?'linear-gradient(135deg,#2a9e6e,#1a6e40)':'#2a1e14';
    b.style.color=on?'#e0fff8':'#8a7048';b.style.borderColor=on?'#2a9e6e':'#3e2e1e';
  });
}
function toggleTileAnim(){
  const off=localStorage.getItem('rikka_tile_anim')==='0';
  if(off)localStorage.removeItem('rikka_tile_anim'); else localStorage.setItem('rikka_tile_anim','0');
  refreshTileBackAnim();updateAnimUI();
}
function toggleBgAnim(){
  const off=localStorage.getItem('rikka_bg_anim')==='0';
  if(off)localStorage.removeItem('rikka_bg_anim'); else localStorage.setItem('rikka_bg_anim','0');
  _lastFieldBgKey=''; // 背景を作り直して、動き（のON/OFF）をすぐ反映する
  if(typeof updateFieldBgForTurn==='function')updateFieldBgForTurn();
  updateAnimUI();
}
function selectFieldBgPreset(id){
  // 画像URLの設定が優先されてしまうので、プリセットを選んだらURL設定は外す
  if(customFieldBgUrl){
    customFieldBgUrl='';
    localStorage.removeItem('rikka_field_bg');
    if(currentCode)socket?.emit('set_field_bg',{code:currentCode,url:''});
  }
  const st=loadGachaState();
  if(id)st.equipped.fieldbg=id; else delete st.equipped.fieldbg;
  saveGachaState(st);
  if(currentCode)socket?.emit('set_field_bg',{code:currentCode,url:myFieldBgValue()});
  updateFieldBgForTurn();
  renderCustomize();
  renderGachaCollection();
}

// ===== アシストの学習：記録と「自分流／最適」の切り替え =====
// CPU戦で牌を捨てるたびに、候補ごとの特徴と、実際に選んだ牌を端末に記録する。
// 「自分流」は、その記録から選び方の癖（待ちの枚数・期待点・危険度などをどれだけ重視するか）を学んで牌を選ぶ。
// アシスト機能の公開スイッチ。false のあいだは、サイドバーの項目・光る牌・学習用の記録がすべて止まる（コードは残してある）。
// 全容が完成して公開するときは true にする。
const ASSIST_ENABLED=false;
const ASSIST_LOG_KEY='rikka_assist_log',ASSIST_STYLE_KEY='rikka_assist_style',ASSIST_LOG_MAX=1500,ASSIST_MIN=30;
const ASSIST_PRIOR=[2.0,.6,3.0,-1.6,1.2,1.2]; // 「最適」に近い初期値：[テンパイ,待ち枚数,期待点,危険度,伸びしろ,最適との一致]
let assistStyle=(()=>{try{return localStorage.getItem(ASSIST_STYLE_KEY)==='mine'?'mine':'best';}catch(e){return 'best';}})();
let _alog=null,_assistW=null,_assistWn=-1;
function getAssistLog(){if(_alog)return _alog;try{_alog=JSON.parse(localStorage.getItem(ASSIST_LOG_KEY)||'[]');if(!Array.isArray(_alog))_alog=[];}catch(e){_alog=[];}return _alog;}
function saveAssistLog(){
  const a=getAssistLog();while(a.length>ASSIST_LOG_MAX)a.shift();
  try{localStorage.setItem(ASSIST_LOG_KEY,JSON.stringify(a));}catch(e){a.splice(0,Math.ceil(a.length/3));try{localStorage.setItem(ASSIST_LOG_KEY,JSON.stringify(a));}catch(e2){}}
}
const _r2=x=>Math.round(x*100)/100;
// 捨て牌の候補ごとの特徴（その場の候補どうしで比べやすいよう、最大値で割っておく）
function assistFeatures(v,hand,optR){
  if(v._f)return v._f;
  const ops=v.options,pots=ops.map(o=>evalHandFull(hand.filter((_,j)=>j!==o.idx),optR));
  let maxS=1e-9,maxP=1e-9;ops.forEach((o,i)=>{maxS=Math.max(maxS,o.score);maxP=Math.max(maxP,pots[i]);});
  return v._f=ops.map((o,i)=>[(o.waits.length&&o.waits.some(w=>w.left>0))?1:0,_r2(Math.min(1.5,o.waits.reduce((s,w)=>s+w.left,0)/10)),_r2(o.score/maxS),_r2(o.danger),_r2(pots[i]/maxP),o.idx===v.bestIdx?1:0]);
}
function assistRecord(p,idx){
  if(!ASSIST_ENABLED||onlineMode||!G||p.hand.length!==6)return;
  const optR=getOptRoles('bot-opt-');
  if(checkWin(p.hand,optR))return; // 上がれる手は「捨てる判断」ではないので記録しない
  const v=calcAssistV2(p,G,optR,myOnlineIdx);
  if(!v.options||v.options.length<2)return;
  const f=assistFeatures(v,p.hand,optR);
  getAssistLog().push({o:f,c:idx,b:v.bestIdx,k:(G._gid||0)+'.'+(G._rk||0),w:1});
  saveAssistLog();updateAssistStyleUI();
}
// ラウンドの結果で、そのラウンドの記録の重みを変える（勝った手は重く、放銃した手は軽く）
function assistMarkRound(pi,res){
  if(!ASSIST_ENABLED||onlineMode||!G)return;
  const w=pi===myOnlineIdx?1.6:(res&&res.ron?.35:.6),k=(G._gid||0)+'.'+(G._rk||0),a=getAssistLog();
  const rv=pi===myOnlineIdx?1:(res&&res.ron?-1:-.5);
  for(let i=a.length-1;i>=0&&a[i].k===k;i--){a[i].w=w;a[i].r=rv;}
  saveAssistLog();
}
// 記録から、選び方の重みを学ぶ（選んだ牌が選ばれる確率を上げる。初期値からあまり離れないよう少し引き戻す）
function assistTrain(log){
  const w=ASSIST_PRIOR.slice(),lr=.08;
  for(let ep=0;ep<8;ep++)for(const r of log){
    const lg=r.o.map(f=>f.reduce((s,x,j)=>s+x*w[j],0)),mx=Math.max(...lg),ex=lg.map(x=>Math.exp(x-mx)),sm=ex.reduce((a,b)=>a+b,0);
    for(let j=0;j<w.length;j++){let g=0;r.o.forEach((f,i)=>{g+=((i===r.c?1:0)-ex[i]/sm)*f[j];});w[j]+=lr*g*(r.w||1)-lr*.02*(w[j]-ASSIST_PRIOR[j]);}
  }
  return w;
}
// 「最適」の自己調整：結果（勝ち・負け）つきの記録から、勝ちにつながった選び方を強め、負けにつながった選び方を弱める
const ASSIST_TUNE_MIN=60; // 結果つきの記録がこの数たまると、調整した最適を使う
let _tuned=undefined,_tunedKey='';
function assistTuneBest(log){
  const rs=log.filter(r=>typeof r.r==='number');
  if(rs.length<ASSIST_TUNE_MIN)return null;
  const mean=rs.reduce((s,r)=>s+r.r,0)/rs.length,w=ASSIST_PRIOR.slice(),lr=.03;
  for(let ep=0;ep<12;ep++)for(const r of rs){
    const adv=r.r-mean;if(Math.abs(adv)<.05)continue;
    const lg=r.o.map(f=>f.reduce((s,x,j)=>s+x*w[j],0)),mx=Math.max(...lg),ex=lg.map(x=>Math.exp(x-mx)),sm=ex.reduce((a,b)=>a+b,0);
    for(let j=0;j<w.length;j++){let e=0;r.o.forEach((f,i)=>{e+=ex[i]/sm*f[j];});
      w[j]+=lr*adv*(r.o[r.c][j]-e)-lr*.1*(w[j]-ASSIST_PRIOR[j]);
      const lim=Math.max(1,Math.abs(ASSIST_PRIOR[j])*.8);w[j]=Math.min(ASSIST_PRIOR[j]+lim,Math.max(ASSIST_PRIOR[j]-lim,w[j]));}
  }
  // 元の最適から離れすぎていたら使わない（運による偏りで、おかしな推奨にならないように）
  let agree=0;rs.forEach(r=>{let bi=0,bs=-1e9;r.o.forEach((f,i)=>{const s=f.reduce((a,x,j)=>a+x*w[j],0);if(s>bs){bs=s;bi=i;}});if(bi===r.b)agree++;});
  return agree/rs.length>=.6?{w,agree:agree/rs.length,n:rs.length}:null;
}
function getTunedBest(){
  const log=getAssistLog(),key=log.length+':'+log.reduce((s,r)=>s+(typeof r.r==='number'?1:0),0);
  if(_tuned!==undefined&&_tunedKey===key)return _tuned;
  _tunedKey=key;return _tuned=assistTuneBest(log);
}
function assistTunedActive(){return assistStyle==='best'&&!!getTunedBest();}
// 推奨に従った回の勝率と、そうでない回の勝率
function assistFollowStats(log){
  const m={};log.forEach(r=>{if(typeof r.r!=='number')return;const o=m[r.k]||(m[r.k]={f:0,n:0,r:r.r});o.n++;if(r.c===r.b)o.f++;});
  const A=[],B=[];Object.values(m).forEach(o=>(o.f/o.n>=.7?A:B).push(o.r===1?1:0));
  const rate=a=>a.length?Math.round(a.reduce((s,x)=>s+x,0)/a.length*100):0;
  return {an:A.length,ar:rate(A),bn:B.length,br:rate(B)};
}
function assistMineActive(){return assistStyle==='mine'&&getAssistLog().length>=ASSIST_MIN;}
// 「自分流」のときは、推奨する捨て牌を学習した重みで選び直す（元の計算結果は変えずに写しを返す）
function assistApplyStyle(v,hand,optR){
  if(hand.length!==6||!v.options||v.options.length<2)return v;
  let W=null;
  if(assistStyle==='mine'){
    if(getAssistLog().length>=ASSIST_MIN){const log=getAssistLog();if(_assistWn!==log.length){_assistW=assistTrain(log);_assistWn=log.length;}W=_assistW;}
  }else{const t=getTunedBest();if(t)W=t.w;}
  if(!W)return v;
  const f=assistFeatures(v,hand,optR);let bi=0,bs=-Infinity;
  f.forEach((x,i)=>{const s=x.reduce((a,b,j)=>a+b*W[j],0);if(s>bs){bs=s;bi=i;}});
  const o=v.options[bi];
  return Object.assign({},v,{bestIdx:bi,best:(o&&o.waits.some(w=>w.left>0))?o:null});
}
function setAssistStyle(s){
  assistStyle=s==='mine'?'mine':'best';
  try{localStorage.setItem(ASSIST_STYLE_KEY,assistStyle);}catch(e){}
  updateAssistStyleUI();
  if(G&&G.phase==='playing')render();
  const n=getAssistLog().length;
  toast(assistStyle==='mine'?(n>=ASSIST_MIN?'🎭 自分流にしました':`🎭 自分流：あと${ASSIST_MIN-n}回の記録でききはじめます`):'✨ 最適にしました');
}
// 記録をファイルに書き出す（Claudeに渡して、初期値を学習し直してもらうため）
function exportAssistLog(){
  const a=getAssistLog();
  if(!a.length){toast('記録がまだありません');return;}
  const data=JSON.stringify({app:'rikka-assist-log',v:1,prior:ASSIST_PRIOR,n:a.length,log:a});
  try{
    const url=URL.createObjectURL(new Blob([data],{type:'application/json'})),el=document.createElement('a');
    el.href=url;el.download='rikka-assist-log.json';document.body.appendChild(el);el.click();el.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`📤 ${a.length}回ぶんの記録を書き出しました`);
  }catch(e){
    if(navigator.clipboard)navigator.clipboard.writeText(data).then(()=>toast('📋 記録をコピーしました')).catch(()=>toast('書き出せませんでした'));else toast('書き出せませんでした');
  }
}
function clearAssistLog(){
  if(!confirm('アシストの学習用の記録をすべて消します。よろしいですか？'))return;
  _alog=[];_assistW=null;_assistWn=-1;try{localStorage.removeItem(ASSIST_LOG_KEY);}catch(e){}
  updateAssistStyleUI();if(G&&G.phase==='playing')render();toast('記録を消しました');
}
function updateAssistStyleUI(){
  const b=document.getElementById('as-best'),m=document.getElementById('as-mine'),info=document.getElementById('as-info');
  if(!b||!m||!info)return;
  b.classList.toggle('on',assistStyle==='best');m.classList.toggle('on',assistStyle==='mine');
  const a=getAssistLog(),n=a.length,same=n?Math.round(a.filter(r=>r.c===r.b).length/n*100):0;
  const rd=a.filter(r=>typeof r.r==='number').length,t=getTunedBest(),fs=assistFollowStats(a);
  let s=(assistStyle==='mine'?'🎭 あなたの選び方を学んで、捨てる牌を示します':'✨ 待ち牌・期待点・危険度から最も良い牌を示します（勝敗の結果から自分で調整します）')
    +`<br>記録 ${n}回`+(n?`（最適と同じ選択 ${same}%）`:'');
  if(assistStyle==='mine'&&n<ASSIST_MIN)s+=`<br>あと${ASSIST_MIN-n}回で自分流がききます（それまでは最適）`;
  if(assistStyle==='best')s+=t?`<br>🧠 結果から調整した最適を使用中（結果つき ${rd}手）`:`<br>🧠 最適の調整：結果つきの記録 ${rd}/${ASSIST_TUNE_MIN}手`;
  if(fs.an>=3&&fs.bn>=3)s+=`<br>推奨に従った回の勝率 ${fs.ar}%（${fs.an}回）／それ以外 ${fs.br}%（${fs.bn}回）`;
  info.innerHTML=s;
}
window.addEventListener('load',()=>{const s=document.getElementById('assist-section');if(s)s.style.display=ASSIST_ENABLED?'':'none';updateAssistStyleUI();});
let assistMode = false;
function toggleAssist(){
  if(!ASSIST_ENABLED){assistMode=false;return;}
  assistMode = !assistMode;
  const btn = document.getElementById('assist-toggle-btn');
  if(btn){
    btn.textContent = assistMode ? 'ON' : 'OFF';
    btn.style.background = assistMode ? 'linear-gradient(135deg,#2a9e6e,#1a6e40)' : '#2a1e14';
    btn.style.color = assistMode ? '#e0fff8' : '#8a7048';
    btn.style.borderColor = assistMode ? '#2a9e6e' : '#3e2e1e';
  }
  if(G && G.phase==='playing') render();
  closeSidebar();
  toast(assistMode ? '✅ アシストON' : 'アシストOFF');
}
let chatOpen = false;
let chatUnread = 0;
