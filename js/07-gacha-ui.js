// ============================================================
// 10連・100連ガチャ。10回ごとに、レア以上が1つ確定
// ============================================================
let _gachaBatch=null;
const RARITY_ORDER={common:0,uncommon:1,rare:2,superrare:3};
function drawGachaMulti(n,banner='std'){
  _lastBanner=banner;
  if(banner==='limited'&&!isLimitedActive()){toast('期間限定ガチャは終了しました');return;}
  const cost=GACHA_COST*n;
  if(loadPetals()<cost){toast('花びらが足りません');return;}
  addPetals(-cost);try{missionAdd('gacha',n);}catch(e){}
  const owned=new Set(loadGachaState().owned);
  const results=[];let refund=0;
  for(let g=0;g<n/10;g++){
    let haveRare=false;
    for(let k=0;k<10;k++){
      let rarity=pickGachaRarity();
      if(k===9&&!haveRare){ // 10回目：レア以上がまだ出ていなければ、レア（超レアは少しだけ）に差し替える
        rarity=Math.random()*(GACHA_RARITY_INFO.rare.weight+GACHA_RARITY_INFO.superrare.weight)<GACHA_RARITY_INFO.superrare.weight?'superrare':'rare';
      }
      if(RARITY_ORDER[rarity]>=2)haveRare=true;
      const pool=gachaPool(rarity,banner);
      const item=pool[Math.floor(Math.random()*pool.length)];
      const isDup=owned.has(item.id);
      if(!isDup){owned.add(item.id);grantItem(item.id);}else refund+=Math.ceil(GACHA_COST/2);
      results.push({item,isDup});
    }
  }
  if(refund)addPetals(refund);
  const best=results.reduce((a,b)=>{
    const ra=RARITY_ORDER[a.item.rarity],rb=RARITY_ORDER[b.item.rarity];
    return rb>ra||(rb===ra&&a.isDup&&!b.isDup)?b:a;},results[0]);
  _gachaBatch={n,cost,refund,results,banner};
  _gfxPendingAch=checkAchievements(false,{misc:true,gacha:n});
  startGachaFx(best.item,best.isDup);
}
function showGachaSummary(b){
  const old=document.getElementById('gacha-summary');if(old)old.remove();
  // 同じ景品はまとめる（回数つき）。レアが上に来るよう並べる
  const map=new Map();
  b.results.forEach(r=>{const e=map.get(r.item.id)||{item:r.item,count:0,isNew:false};e.count++;if(!r.isDup)e.isNew=true;map.set(r.item.id,e);});
  const list=[...map.values()].sort((a,b2)=>RARITY_ORDER[b2.item.rarity]-RARITY_ORDER[a.item.rarity]||(b2.isNew-a.isNew)||b2.count-a.count);
  const cnt={common:0,uncommon:0,rare:0,superrare:0};b.results.forEach(r=>cnt[r.item.rarity]++);
  const newN=list.filter(e=>e.isNew).length;
  const cards=list.map((e,i)=>{const info=GACHA_RARITY_INFO[e.item.rarity];
    return `<div class="gs-card ${e.item.rarity==='superrare'?'sr':e.item.rarity==='rare'?'r':''}" style="--rc:${info.color};--d:${Math.min(i*.04,1.2).toFixed(2)}s">
      ${e.count>1?`<span class="cnt">×${e.count}</span>`:''}${e.isNew?'<span class="new">NEW</span>':''}<div class="ic">${itemIconHtml(e.item)}</div><div class="nm">${esc(e.item.title)}</div></div>`;}).join('');
  const canAgain=loadPetals()>=GACHA_COST*b.n;
  const el=document.createElement('div');el.id='gacha-summary';
  el.innerHTML=`<div class="gs-box"><div class="gs-title">${b.n}連ガチャ 結果</div>
    <div class="gs-stats"><span>使った花びら <b>🌸${b.cost}</b></span><span>戻った花びら <b>🌸${b.refund}</b></span><span>新しい景品 <b>${newN}個</b></span></div>
    <div class="gs-rar">${['superrare','rare','uncommon','common'].map(k=>`<span style="color:${GACHA_RARITY_INFO[k].color}">${GACHA_RARITY_INFO[k].label} ${cnt[k]}</span>`).join('')}</div>
    <div class="gs-list">${cards}</div>
    <div class="gs-btns"><button class="sub" ${canAgain?'':'disabled'} onclick="document.getElementById('gacha-summary').remove();drawGachaMulti(${b.n},'${b.banner||'std'}')">もう一度（${b.n}連）</button><button class="main" onclick="document.getElementById('gacha-summary').remove()">閉じる</button></div></div>`;
  document.body.appendChild(el);
  try{if(typeof soundEnabled!=='undefined')gfxRevealSound(cnt.superrare?'superrare':cnt.rare?'rare':'uncommon');}catch(e){}
}
var _lastBanner='std';
function drawGacha(banner='std'){
  _lastBanner=banner;
  if(banner==='limited'&&!isLimitedActive()){toast('期間限定ガチャは終了しました');return;}
  const petals=loadPetals();
  if(petals<GACHA_COST){ toast('花びらが足りません'); return; }
  addPetals(-GACHA_COST);try{missionAdd('gacha');}catch(e){}
  const rarity=pickGachaRarity();
  const pool=gachaPool(rarity,banner);
  const item=pool[Math.floor(Math.random()*pool.length)];
  const st=loadGachaState();
  const isDup=st.owned.includes(item.id);
  if(!isDup){
    st.owned.push(item.id);
    saveGachaState(st);
  } else {
    addPetals(Math.ceil(GACHA_COST/2)); // 重複は花びらを一部還元
  }
  _gfxPendingAch=checkAchievements(false,{misc:true,gacha:true});
  startGachaFx(item,isDup);
}
let _gfxPendingAch=[];

// ============================================================
// ガチャ演出（光の玉が力をためる → 閃光 → カードが登場）。レア度が高いほど長く豪華になる
// ============================================================
const GFX_CFG={
  common:   {stars:1,color:'#b8c0c8',color2:'#ffffff',charge:1100,sparks:45, banner:''},
  uncommon: {stars:2,color:'#60c870',color2:'#c8ffd0',charge:1500,sparks:80, banner:''},
  rare:     {stars:3,color:'#60a8f0',color2:'#d0e8ff',charge:2000,sparks:140,banner:'RARE!'},
  superrare:{stars:5,color:'#f5d040',color2:'#fff4c0',charge:2900,sparks:240,banner:'SUPER RARE!!'},
};
const GFX_RAINBOW=['#f5d040','#ff8ad0','#60a8f0','#60e0a0','#ffffff','#ff9a50'];
let _gfx={timers:[],raf:0,stage:'idle',item:null,isDup:false,parts:[],rarity:'common',tell:false};
let _gfxSnd=null;

// ── 効果音（専用の合成音。効果音OFFなら鳴らさない） ──
function _gfxAudio(fn){
  if(!soundEnabled)return;
  try{
    const ctx=_getAudioCtx();
    const run=()=>{try{fn(ctx);}catch(e){}};
    if(ctx.state==='suspended')ctx.resume().then(run).catch(()=>{}); else run();
  }catch(e){}
}
function gfxChargeSound(ms,big){
  _gfxAudio(ctx=>{
    const now=ctx.currentTime,dur=ms/1000;
    const master=ctx.createGain(); master.gain.value=soundVolume*0.45; master.connect(ctx.destination);
    const lp=ctx.createBiquadFilter(); lp.type='lowpass';
    lp.frequency.setValueAtTime(300,now); lp.frequency.exponentialRampToValueAtTime(5000,now+dur);
    lp.connect(master);
    const o1=ctx.createOscillator(),g1=ctx.createGain();
    o1.type='sawtooth'; o1.frequency.setValueAtTime(110,now); o1.frequency.exponentialRampToValueAtTime(big?1500:900,now+dur);
    g1.gain.setValueAtTime(0.0001,now); g1.gain.exponentialRampToValueAtTime(0.5,now+dur*0.92);
    o1.connect(g1); g1.connect(lp); o1.start(now); o1.stop(now+dur+0.05);
    const o2=ctx.createOscillator(),g2=ctx.createGain();
    o2.type='sine'; o2.frequency.setValueAtTime(330,now); o2.frequency.exponentialRampToValueAtTime(big?3000:1800,now+dur);
    g2.gain.setValueAtTime(0.0001,now); g2.gain.exponentialRampToValueAtTime(0.25,now+dur*0.95);
    o2.connect(g2); g2.connect(master); o2.start(now); o2.stop(now+dur+0.05);
    // 鼓動のように、だんだん間隔が短くなる低い音
    let t=0,gap=0.42;
    while(t<dur-0.1){
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type='sine'; o.frequency.value=70;
      g.gain.setValueAtTime(0.0001,now+t); g.gain.exponentialRampToValueAtTime(0.7,now+t+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,now+t+0.16);
      o.connect(g); g.connect(master); o.start(now+t); o.stop(now+t+0.2);
      t+=gap; gap=Math.max(0.1,gap*0.86);
    }
    _gfxSnd={master,ctx};
  });
}
function gfxStopChargeSound(){
  if(!_gfxSnd)return;
  try{const {master,ctx}=_gfxSnd; master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setTargetAtTime(0,ctx.currentTime,0.03);}catch(e){}
  _gfxSnd=null;
}
function gfxBurstSound(rarity){
  _gfxAudio(ctx=>{
    const now=ctx.currentTime;
    const master=ctx.createGain(); master.gain.value=soundVolume*0.7; master.connect(ctx.destination);
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type='sine'; o.frequency.setValueAtTime(190,now); o.frequency.exponentialRampToValueAtTime(38,now+0.55);
    g.gain.setValueAtTime(0.9,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.6);
    o.connect(g); g.connect(master); o.start(now); o.stop(now+0.65);
    // ノイズの「ザッ」
    const len=Math.floor(ctx.sampleRate*0.35),buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
    const ns=ctx.createBufferSource(),ng=ctx.createGain(); ns.buffer=buf; ng.gain.value=rarity==='common'?0.25:0.5;
    ns.connect(ng); ng.connect(master); ns.start(now);
  });
}
function gfxRevealSound(rarity){
  _gfxAudio(ctx=>{
    const now=ctx.currentTime;
    const master=ctx.createGain(); master.gain.value=soundVolume*0.6; master.connect(ctx.destination);
    const tone=(f,st,dur,type,gain)=>{
      const o=ctx.createOscillator(),g=ctx.createGain(); o.type=type; o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,now+st); g.gain.linearRampToValueAtTime(gain,now+st+0.015);
      g.gain.exponentialRampToValueAtTime(0.001,now+st+dur);
      o.connect(g); g.connect(master); o.start(now+st); o.stop(now+st+dur+0.03);
    };
    const C=[523.25,659.25,783.99,1046.5,1318.5,1568,2093];
    if(rarity==='common'){ tone(C[0],0,.25,'sine',.35); tone(C[2],.12,.35,'sine',.35); }
    else if(rarity==='uncommon'){ [0,1,2,3].forEach((k,i)=>tone(C[k],i*.1,.4,'sine',.35)); }
    else if(rarity==='rare'){
      [0,1,2,3,4,5].forEach((k,i)=>tone(C[k],i*.09,.5,'triangle',.3));
      tone(C[3],.6,1.1,'sine',.35); tone(C[5],.6,1.1,'sine',.25);
    } else {
      [0,1,2,3,4,5,6].forEach((k,i)=>tone(C[k],i*.08,.7,'triangle',.3));
      [523.25,659.25,783.99,1046.5].forEach(f=>tone(f,.65,1.8,'sine',.3));
      for(let i=0;i<10;i++)tone(2000+Math.random()*2200,.7+i*.12,.25,'sine',.12);
    }
  });
}

// ── パーティクル ──
function gfxPalette(){return _gfx.rarity==='superrare'?GFX_RAINBOW:[GFX_CFG[_gfx.rarity].color,GFX_CFG[_gfx.rarity].color2,'#ffffff'];}
function gfxCenter(cv){return {cx:cv.width/2,cy:cv.height*0.42};}
function gfxBurstParticles(n){
  const cv=document.getElementById('gfx-canvas'),{cx,cy}=gfxCenter(cv),pal=gfxPalette();
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2,sp=3+Math.random()*13,type=['star','dot','petal'][Math.floor(Math.random()*3)];
    _gfx.parts.push({type,x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,g:.07,drag:.965,
      size:type==='dot'?2+Math.random()*3:5+Math.random()*9,rot:Math.random()*6,vr:(Math.random()-.5)*.3,
      life:70+Math.random()*60,max:130,color:pal[Math.floor(Math.random()*pal.length)]});
  }
}
function gfxSpawnConverge(cv){
  const {cx,cy}=gfxCenter(cv),pal=gfxPalette();
  _gfx.parts.push({type:Math.random()<.5?'star':'dot',conv:true,cx,cy,ang:Math.random()*Math.PI*2,
    r:Math.min(cv.width,cv.height)*(.3+Math.random()*.35),size:3+Math.random()*5,rot:0,vr:.1,life:200,max:200,
    color:pal[Math.floor(Math.random()*pal.length)]});
}
function gfxSpawnAmbient(cv){
  const pal=gfxPalette(),type=Math.random()<.5?'petal':'star';
  _gfx.parts.push({type,x:Math.random()*cv.width,y:-12,vx:(Math.random()-.5)*1.2,vy:1+Math.random()*2.2,g:0,drag:1,
    size:type==='petal'?5+Math.random()*6:3+Math.random()*5,rot:Math.random()*6,vr:(Math.random()-.5)*.12,
    life:400,max:400,sway:Math.random()*6,color:pal[Math.floor(Math.random()*pal.length)]});
}
function gfxDrawPart(ctx,p,alpha){
  ctx.globalAlpha=alpha; ctx.fillStyle=p.color;
  ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.beginPath();
  if(p.type==='star'){
    for(let k=0;k<8;k++){const r=k%2?p.size*.3:p.size,a=k*Math.PI/4;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}
    ctx.closePath();
  } else if(p.type==='petal') ctx.ellipse(0,0,p.size,p.size*.5,0,0,Math.PI*2);
  else ctx.arc(0,0,p.size,0,Math.PI*2);
  ctx.fill(); ctx.restore();
}
function gfxLoop(){
  const cv=document.getElementById('gfx-canvas'); if(!cv)return;
  const ctx=cv.getContext('2d');
  ctx.clearRect(0,0,cv.width,cv.height);
  ctx.globalCompositeOperation='lighter';
  if(_gfx.stage==='charge'&&_gfx.kaku){
    if(_gfx.kakuPos&&Math.random()<.45)gfxSpawnKakuDust(cv);
  } else if(_gfx.stage==='charge'){
    const n=_gfx.tell?3:1; for(let i=0;i<n;i++)if(Math.random()<.8)gfxSpawnConverge(cv);
  } else if(_gfx.stage==='reveal'){
    const rate={common:.05,uncommon:.15,rare:.35,superrare:.8}[_gfx.rarity];
    if(Math.random()<rate)gfxSpawnAmbient(cv);
    if(_gfx.rarity==='superrare'&&Math.random()<.2)gfxSpawnAmbient(cv);
  }
  _gfx.parts=_gfx.parts.filter(p=>{
    p.life--; if(p.life<=0)return false;
    if(p.conv){
      p.r*=.965; p.ang+=.06; p.x=p.cx+Math.cos(p.ang)*p.r; p.y=p.cy+Math.sin(p.ang)*p.r; p.rot+=p.vr;
      if(p.r<10)return false;
      gfxDrawPart(ctx,p,Math.min(1,p.r/80)); return true;
    }
    p.vx*=p.drag; p.vy=p.vy*p.drag+p.g; p.x+=p.vx+(p.sway?Math.sin((p.life+p.sway*50)/18)*.8:0); p.y+=p.vy; p.rot+=p.vr;
    if(p.y>cv.height+20)return false;
    gfxDrawPart(ctx,p,Math.min(1,p.life/p.max*2.2)); return true;
  });
  ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';
  _gfx.raf=requestAnimationFrame(gfxLoop);
}

// ===== ガチャ「黄金の精神」確定演出（夕焼けの雲海・逆光のシルエット・肩の星が光る。すべてオリジナルの絵柄） =====
const GOLD_KAKU_RARITY=['superrare']; // この rarity が当たったとき（10連・100連は一番良い景品）に確定演出を流す
const GOLD_KAKU_MS=5200;
function kkHair(){ // 逆立った髪：右上へなびくトゲ
  const cx=200,cy=210,R=37,sp=[[168,40,9],[182,54,10],[196,44,9],[210,66,10],[224,54,10],[238,70,11],[252,56,10],[266,64,11],[280,48,10],[294,54,10],[308,38,9],[158,34,9],[146,28,8],[226,40,12],[250,36,12]];
  return sp.map(([a,len,w])=>{
    const rad=d=>d*Math.PI/180,P=(ang,r)=>[(cx+Math.cos(rad(ang))*r).toFixed(1),(cy+Math.sin(rad(ang))*r).toFixed(1)];
    const b1=P(a-w,R-4),b2=P(a+w,R-4),tip=P(a+16,R+len); // 先端を右へ傾ける
    return `<path d="M${b1} L${tip} L${b2} Z"/>`;
  }).join('');
}
function kkCloud(x,y,s,fill){
  const e=[[0,0,95,24],[-72,9,62,19],[78,11,72,21],[-24,-13,64,19],[34,-10,54,16],[0,16,110,14]];
  return e.map(([dx,dy,rx,ry])=>`<ellipse cx="${(x+dx*s).toFixed(0)}" cy="${(y+dy*s).toFixed(0)}" rx="${(rx*s).toFixed(0)}" ry="${(ry*s).toFixed(0)}" fill="url(#${fill})"/>`).join('');
}
function goldKakuHtml(){
  const rays=Array.from({length:10},(_,i)=>{const a=i*36*Math.PI/180,b=(i*36+7)*Math.PI/180;return `<path d="M130 515 L${(130+Math.cos(a)*1100).toFixed(0)} ${(515+Math.sin(a)*1100).toFixed(0)} L${(130+Math.cos(b)*1100).toFixed(0)} ${(515+Math.sin(b)*1100).toFixed(0)} Z"/>`;}).join('');
  const far=kkCloud(-120,452,1.3,'kk-cl-pink')+kkCloud(230,430,1.1,'kk-cl-gold')+kkCloud(520,462,1.4,'kk-cl-pink')+kkCloud(60,370,.9,'kk-cl-gray')+kkCloud(480,330,1.0,'kk-cl-gray')+kkCloud(-200,330,1.1,'kk-cl-gray');
  const mid=kkCloud(-40,575,1.5,'kk-cl-orange')+kkCloud(330,560,1.3,'kk-cl-orange')+kkCloud(620,590,1.5,'kk-cl-orange')+kkCloud(-260,600,1.4,'kk-cl-orange');
  const near=kkCloud(0,690,1.9,'kk-cl-dark')+kkCloud(340,700,1.8,'kk-cl-dark')+kkCloud(-300,705,1.7,'kk-cl-dark')+kkCloud(640,700,1.7,'kk-cl-dark');
  return `<div class="kk-cam"><svg class="kk-svg" viewBox="-300 0 1000 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="kk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a3c"/><stop offset=".24" stop-color="#85505c"/><stop offset=".44" stop-color="#d98860"/><stop offset=".64" stop-color="#f7b35c"/><stop offset=".84" stop-color="#ffd98a"/><stop offset="1" stop-color="#ffeab0"/></linearGradient>
<radialGradient id="kk-sunc"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".12" stop-color="#fff2c0" stop-opacity=".95"/><stop offset=".4" stop-color="#ffc050" stop-opacity=".5"/><stop offset="1" stop-color="#ff9030" stop-opacity="0"/></radialGradient>
<radialGradient id="kk-cl-pink"><stop offset="0" stop-color="#ffc8b0" stop-opacity=".8"/><stop offset="1" stop-color="#e88a78" stop-opacity="0"/></radialGradient>
<radialGradient id="kk-cl-gold"><stop offset="0" stop-color="#fff0b8" stop-opacity=".9"/><stop offset="1" stop-color="#ffc060" stop-opacity="0"/></radialGradient>
<radialGradient id="kk-cl-gray"><stop offset="0" stop-color="#b89aa8" stop-opacity=".55"/><stop offset="1" stop-color="#7a5a6a" stop-opacity="0"/></radialGradient>
<radialGradient id="kk-cl-orange"><stop offset="0" stop-color="#e8803c" stop-opacity=".92"/><stop offset=".6" stop-color="#b8503a" stop-opacity=".55"/><stop offset="1" stop-color="#8a3030" stop-opacity="0"/></radialGradient>
<radialGradient id="kk-cl-dark"><stop offset="0" stop-color="#5a2428" stop-opacity=".96"/><stop offset=".6" stop-color="#3c1a22" stop-opacity=".7"/><stop offset="1" stop-color="#2a1018" stop-opacity="0"/></radialGradient>
<linearGradient id="kk-body" gradientUnits="userSpaceOnUse" x1="70" y1="650" x2="300" y2="190"><stop offset="0" stop-color="#7a3a28"/><stop offset=".3" stop-color="#3a1a1c"/><stop offset="1" stop-color="#150a10"/></linearGradient>
<linearGradient id="kk-rim" gradientUnits="userSpaceOnUse" x1="60" y1="600" x2="240" y2="240"><stop offset="0" stop-color="#ffc070" stop-opacity=".95"/><stop offset=".55" stop-color="#ff9a50" stop-opacity=".3"/><stop offset="1" stop-color="#ff9a50" stop-opacity="0"/></linearGradient>
<radialGradient id="kk-flood"><stop offset="0" stop-color="#fffbe0"/><stop offset=".35" stop-color="#ffe080"/><stop offset=".75" stop-color="#ffb030"/><stop offset="1" stop-color="#ff9a20"/></radialGradient>
<radialGradient id="kk-starglow"><stop offset="0" stop-color="#fff8d0" stop-opacity="1"/><stop offset=".25" stop-color="#ffd860" stop-opacity=".8"/><stop offset="1" stop-color="#ffa020" stop-opacity="0"/></radialGradient>
<radialGradient id="kk-vig" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#1a0810" stop-opacity="0"/><stop offset="1" stop-color="#1a0810" stop-opacity=".72"/></radialGradient>
<linearGradient id="kk-streak" x1="0" x2="1"><stop offset="0" stop-color="#ffd890" stop-opacity="0"/><stop offset=".5" stop-color="#fff6d0" stop-opacity="1"/><stop offset="1" stop-color="#ffd890" stop-opacity="0"/></linearGradient>
<g id="kk-fig">
<path d="M166 226C164 196 178 172 200 172C224 172 238 196 236 226C236 240 230 250 222 256L222 280L184 280L184 256C174 250 168 240 166 226Z"/>
<g>${kkHair()}</g>
<path d="M184 262C158 270 134 282 118 300C106 312 106 330 118 340C124 380 144 440 158 520C156 548 146 572 136 598L110 700L346 700L326 606C316 574 302 548 294 520C306 450 314 386 316 330C318 308 314 296 304 292C284 278 254 268 224 262Z"/>
<ellipse cx="116" cy="310" rx="27" ry="23"/>
<path d="M124 296C102 302 78 290 68 266C60 246 62 222 70 196L70 172L64 160L72 152L70 140L80 148L84 132L91 145L98 137L98 154C104 170 100 194 98 224L102 248C108 268 118 282 132 292Z"/>
<path d="M306 290C334 298 350 338 346 390C344 428 340 454 332 480C328 500 326 520 320 538C312 556 294 552 294 536C296 510 304 490 306 466C310 430 314 390 304 350C300 330 300 306 306 290Z"/>
<g class="kk-sash"><path d="M280 536C318 541 340 558 384 548L382 564C342 574 314 566 284 560Z"/><path d="M282 548C312 572 332 598 366 628L352 638C318 618 296 596 276 564Z"/></g>
</g>
</defs>
<rect x="-300" y="0" width="1000" height="700" fill="url(#kk-sky)"/>
<g class="kk-sunrays" fill="#fff0b0" opacity=".1">${rays}</g>
<g class="kk-sun"><circle cx="130" cy="515" r="150" fill="url(#kk-sunc)"/></g>
<g class="kk-drift1">${far}</g>
<g class="kk-drift2">${mid}</g>
<circle class="kk-flood" cx="268" cy="278" r="60" fill="url(#kk-flood)"/>
<g class="kk-figwrap">
<use class="kk-goldrim" href="#kk-fig" fill="none" stroke="#ffd860" stroke-width="7" stroke-linejoin="round"/>
<use href="#kk-fig" fill="none" stroke="url(#kk-rim)" stroke-width="5" stroke-linejoin="round"/>
<use href="#kk-fig" fill="url(#kk-body)"/>
</g>
<g class="kk-glow"><circle cx="268" cy="278" r="95" fill="url(#kk-starglow)"/></g>
<g class="kk-cross" fill="#fff6c8"><path d="M268 190L273 278L268 366L263 278Z"/><path d="M176 278L268 273L360 278L268 283Z"/></g>
<g class="kk-starwrap"><g class="kk-star-pulse kk-star">
<path d="M268 262L272.4 272.4L283.6 273.6L275.2 281.2L277.6 292.4L268 286.6L258.4 292.4L260.8 281.2L252.4 273.6L263.6 272.4Z" fill="#fffbe0" stroke="#ffd24a" stroke-width="2.2" stroke-linejoin="round"/>
</g></g>
<path class="kk-arc" d="M241 262A30 30 0 0 1 292 256" fill="none" stroke="#fff0b0" stroke-width="2.6" stroke-linecap="round"/>
<path class="kk-arc kk-arc2" d="M233 250A42 42 0 0 1 304 243" fill="none" stroke="#ffe080" stroke-width="1.8" stroke-linecap="round" opacity=".8"/>
<g class="kk-streak"><ellipse cx="130" cy="515" rx="420" ry="3.5" fill="url(#kk-streak)"/><ellipse cx="130" cy="515" rx="180" ry="9" fill="url(#kk-streak)" opacity=".55"/></g>
<g class="kk-drift1" opacity=".95">${near}</g>
<rect class="kk-vig" x="-300" y="0" width="1000" height="700" fill="url(#kk-vig)"/>
</svg></div>
<div class="kk-gogo l"><span>ゴ</span><span>ゴ</span><span>ゴ</span><span>ゴ</span></div>
<div class="kk-gogo r"><span>ゴ</span><span>ゴ</span><span>ゴ</span><span>ゴ</span></div>
<div class="kk-bar t"></div><div class="kk-bar b"></div>
<div class="kk-quote"><span class="q1">きさまッ！</span><span class="q2">見ているなッ！</span></div><div class="kk-title">黄金の精神</div><div class="kk-sub">超 レ ア 確 定</div>
<div class="kk-white"></div><div class="kk-black"></div>`;
}
// 確定演出の音：低いうなり→鼓動→星が光る鐘の音→和音のふくらみ
function gfxKakuSound(ms){
  _gfxAudio(ctx=>{
    const now=ctx.currentTime,dur=ms/1000;
    const master=ctx.createGain();master.gain.value=soundVolume*0.5;master.connect(ctx.destination);
    const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(180,now);lp.frequency.exponentialRampToValueAtTime(2400,now+dur*.85);lp.connect(master);
    [55,82.4,110.6].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=i?'sawtooth':'sine';o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,now);g.gain.linearRampToValueAtTime(i?0.12:0.4,now+dur*.7);g.gain.linearRampToValueAtTime(0.0001,now+dur);o.connect(g);g.connect(lp);o.start(now);o.stop(now+dur+.05);});
    // 風（ノイズ）
    const len=Math.floor(ctx.sampleRate*dur),buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    const ns=ctx.createBufferSource(),bp=ctx.createBiquadFilter(),ng=ctx.createGain();ns.buffer=buf;bp.type='bandpass';bp.frequency.value=700;bp.Q.value=.6;
    ng.gain.setValueAtTime(0.0001,now);ng.gain.linearRampToValueAtTime(.16,now+1.6);ng.gain.linearRampToValueAtTime(.05,now+3.2);ng.gain.linearRampToValueAtTime(.0001,now+dur);
    ns.connect(bp);bp.connect(ng);ng.connect(master);ns.start(now);
    // 鼓動
    for(let t=.7;t<1.95;t+=.62){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=62;
      g.gain.setValueAtTime(0.0001,now+t);g.gain.exponentialRampToValueAtTime(.8,now+t+.02);g.gain.exponentialRampToValueAtTime(.001,now+t+.22);o.connect(g);g.connect(master);o.start(now+t);o.stop(now+t+.25);}
    // 星が光る（1.9秒）：鐘の音
    [1318.5,1760,2637,3520].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;const st=1.9+i*.05;
      g.gain.setValueAtTime(0.0001,now+st);g.gain.linearRampToValueAtTime(.3/(i+1)+.05,now+st+.01);g.gain.exponentialRampToValueAtTime(.001,now+st+2.2);o.connect(g);g.connect(master);o.start(now+st);o.stop(now+st+2.3);});
    // 3.4秒：タイトルに合わせた和音
    [392,523.25,659.25,783.99].forEach(f=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,now+3.35);g.gain.linearRampToValueAtTime(.22,now+3.45);g.gain.linearRampToValueAtTime(.0001,now+dur);o.connect(g);g.connect(master);o.start(now+3.35);o.stop(now+dur+.05);});
    _gfxSnd={master,ctx};
  });
}
function gfxSpawnKakuDust(cv){
  const p=_gfx.kakuPos;if(!p)return;
  _gfx.parts.push({type:Math.random()<.5?'star':'dot',x:p.x+(Math.random()-.5)*50,y:p.y+(Math.random()-.5)*30,vx:(Math.random()-.3)*1.4,vy:-.6-Math.random()*1.8,g:-.012,drag:.99,
    size:2+Math.random()*4.5,rot:Math.random()*6,vr:(Math.random()-.5)*.2,life:90+Math.random()*70,max:160,color:['#fff4c0','#ffd24a','#ffb830','#fff'][Math.floor(Math.random()*4)]});
}
function removeGoldKaku(){const el=document.getElementById('gacha-fx');if(!el)return;const k=el.querySelector('.gfx-kk');if(k)k.remove();el.classList.remove('kaku');_gfx.kaku=false;_gfx.kakuPos=null;}
// 開発用：コンソールで previewGoldKakutei() と打つと、確定演出だけを見られる
// 管理者（開発者アカウント）だけが使える：確定演出を、ガチャのたびに必ず流す設定
function kakuAdminAlways(){try{return isDevUser()&&localStorage.getItem('rikka_dev_kaku')==='1';}catch(e){return false;}}
function setDevKakuAlways(v){
  if(!isDevUser())return;
  if(v)localStorage.setItem('rikka_dev_kaku','1');else localStorage.removeItem('rikka_dev_kaku');
  renderDevSection();closeSidebar();
  toast(v?'黄金の精神：毎回、確定演出を流します（管理者）':'黄金の精神：確定演出は超レアのときだけ');
}
function devPreviewKakutei(){if(!isDevUser())return;closeSidebar();previewGoldKakutei();}
function previewGoldKakutei(){
  if(!isDevUser())return;
  _lastBanner='gold';_gachaBatch=null;
  const it=GACHA_ITEMS.find(i=>i.gold&&i.rarity==='superrare')||GACHA_ITEMS.find(i=>i.rarity==='superrare')||GACHA_ITEMS[0];
  startGachaFx(it,false);
}

// ===== 確定演出（写真版）：用意した一枚絵を背景に使う（画像は index.html に埋め込み済み） =====
const KK_FILL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAfACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD17UNIQ5Ypj6CvAfib8QjDFb2/hXaWuM77hl+aJlP3NhHUjB57H8vqrV7eRLKWaKze4kUfJGhClz6ZYgCvib4j6nav8Q9aNnZx2cDzqZIIn3IZlXDEkcE7y/I45NfPYLEurJpHt04pq7N/4ZeI9f1PXrm11CRZ3EYcsW2bFzg/KBzyfau91FtyPuUYx2rwrwv4pk8OeJBqBhW5hf5J0wNxU91PY9/Q17zqU2lxafHeTX0cUc8QkQOcEgjI4/GuudZU5Lm6mkqMpfCdt4lHju/0u7jtdW8mVoXEXlyLHh9pA54746mvm34l+DbjwlLbWl1e2s91LH5kwSdWZWPY89a+ivFF7qWiadf31q+oW7xQvIAzwyJwM8jGe3rXxxqeqT3UrzXMjyOxJLMckmvBydVpNtNcvoelXjBJafcdV4R8FXuqhb6Zokt85RS43SYOOB6Z4zXW3Ohtcjzb3VYpI4x93zw424P92uf+H9tPrHhxnbnyZSiSELleB8vTLLyflJK8nipdUs9RWN5GKRXB+WQoqhWPqAO1exF1JVHFySKUYKnflP/Z';
const KK_PHOTO='data:image/jpeg;base64,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';
let _kkPhotoOK=false;
(function(){const im=new Image();im.onload=()=>{_kkPhotoOK=true;};im.src=KK_PHOTO;})();
function goldKakuPhotoHtml(){
  return `<img class="kp-fill" src="${KK_FILL}" alt="">
<div class="kp-cam"><div class="kp-wrap">
<img class="kp-img" src="${KK_PHOTO}" alt="">
<div class="kp-sunpt"><div class="kp-flare"></div><div class="kp-streak"></div></div>
<div class="kp-mist"><i class="a"></i><i class="b"></i></div>
<div class="kp-flood"></div>
<svg class="kp-ov" viewBox="0 0 669 641" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
<defs><filter id="kpb1" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter><filter id="kpb2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
<radialGradient id="kpg"><stop offset="0" stop-color="#fff8d0" stop-opacity="1"/><stop offset=".3" stop-color="#ffd860" stop-opacity=".75"/><stop offset="1" stop-color="#ff9a20" stop-opacity="0"/></radialGradient></defs>
<g class="kp-glow"><circle cx="335" cy="210" r="95" fill="url(#kpg)"/></g>
<g class="kp-cross" fill="#fff6c8"><path d="M335 120L338.5 210L335 300L331.5 210Z"/><path d="M245 210L335 206.5L425 210L335 213.5Z"/></g>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path class="kp-arc" pathLength="1" d="M318 184 L324 174 L333 167 L344 162 L355 158 L364 155" stroke="#ff9a20" stroke-width="7" filter="url(#kpb2)" opacity=".9"/>
<path class="kp-arc" pathLength="1" d="M318 184 L324 174 L333 167 L344 162 L355 158 L364 155" stroke="#fff3c0" stroke-width="2.6"/>
<g class="kp-thorn" stroke="#fff3c0" stroke-width="1.6"><path d="M324 174 L320.3 170.7"/><path d="M333 167 L335.6 171.3"/><path d="M344 162 L342.1 157.4"/><path d="M355 158 L356.7 162.7"/></g></g>
<g class="kp-starwrap"><g transform="translate(335 210)"><g class="kp-starpulse kk-star">
<polygon points="3.5,-19.7 5.8,-5.6 19.8,-2.8 7.1,3.8 8.8,18.0 -1.4,7.9 -14.4,13.9 -7.9,1.1 -17.7,-9.4 -3.5,-7.2" fill="#ff9a20" filter="url(#kpb1)" transform="scale(1.25)"/>
<polygon points="3.5,-19.7 5.8,-5.6 19.8,-2.8 7.1,3.8 8.8,18.0 -1.4,7.9 -14.4,13.9 -7.9,1.1 -17.7,-9.4 -3.5,-7.2" fill="#fff6c8" stroke="#ffd860" stroke-width="2" stroke-linejoin="round"/></g></g></g>
</svg>
<div class="kp-dim"></div><div class="kp-grain"></div><div class="kp-vig"></div>
</div></div>
<div class="kk-gogo l"><span>ゴ</span><span>ゴ</span><span>ゴ</span><span>ゴ</span></div>
<div class="kk-gogo r"><span>ゴ</span><span>ゴ</span><span>ゴ</span><span>ゴ</span></div>
<div class="kk-bar t"></div><div class="kk-bar b"></div>
<div class="kk-quote"><span class="q1">きさまッ！</span><span class="q2">見ているなッ！</span></div><div class="kk-title">黄金の精神</div><div class="kk-sub">超 レ ア 確 定</div>
<div class="kk-white"></div><div class="kk-black"></div>`;
}

// ── 進行 ──
function gfxAfter(ms,fn){_gfx.timers.push(setTimeout(fn,ms));}
function startGachaFx(item,isDup){
  const el=document.getElementById('gacha-fx'),cv=document.getElementById('gfx-canvas');
  const cfg=GFX_CFG[item.rarity]||GFX_CFG.common;
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const kaku=!reduce&&_lastBanner==='gold'&&(GOLD_KAKU_RARITY.includes(item.rarity)||kakuAdminAlways());
  const chargeMs=reduce?500:(kaku?GOLD_KAKU_MS:cfg.charge);
  _gfx.timers.forEach(clearTimeout); cancelAnimationFrame(_gfx.raf);removeGoldKaku();
  Object.assign(_gfx,{timers:[],stage:'charge',item,isDup,parts:[],rarity:item.rarity,tell:false,kaku:kaku,kakuPos:null});
  cv.width=window.innerWidth; cv.height=window.innerHeight;
  el.className=''; el.dataset.rarity=item.rarity;
  {const old=el.querySelector('.gfx-gogo');if(old)old.remove();
   if(_lastBanner==='gold'){el.classList.add('gold-fx');const go=document.createElement('div');go.className='gfx-gogo';
    go.innerHTML=Array.from({length:14},(_,i)=>`<span style="left:${(i*37+6)%90}%;top:${(i*53+4)%86}%;font-size:${2.2+(i%4)*1.1}rem;--r:${(i%5-2)*6}deg">ゴ</span>`).join('');el.prepend(go);}}
  el.style.setProperty('--gc',cfg.color); el.style.setProperty('--gc2',cfg.color2);
  el.style.setProperty('--charge-ms',chargeMs+'ms');
  const orb=document.getElementById('gfx-orb');
  orb.className='gfx-orb'; void orb.offsetWidth;
  document.getElementById('gfx-cardwrap').innerHTML='';
  el.style.display='block'; el.classList.add('st-charge');
  if(kaku){
    el.classList.add('kaku');const kk=document.createElement('div');kk.className='gfx-kk'+(_kkPhotoOK?' photo':'');kk.innerHTML=_kkPhotoOK?goldKakuPhotoHtml():goldKakuHtml();el.insertBefore(kk,cv);
    gfxKakuSound(chargeMs);
    gfxAfter(1900,()=>{const s=el.querySelector('.kk-star');if(s){const r=s.getBoundingClientRect();_gfx.kakuPos={x:r.left+r.width/2,y:r.top+r.height/2};}});
    gfxAfter(2300,()=>{el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');});
  }else{
  gfxChargeSound(chargeMs,item.rarity==='rare'||item.rarity==='superrare');
  gfxAfter(chargeMs*0.62,()=>{ _gfx.tell=true; orb.classList.add('tell'); }); // 玉の色が変わって中身を予感させる
  }
  gfxAfter(chargeMs,()=>gfxBurst());
  _gfx.raf=requestAnimationFrame(gfxLoop);
}
function gfxBurst(){
  if(_gfx.stage!=='charge')return;
  const el=document.getElementById('gacha-fx'),cfg=GFX_CFG[_gfx.rarity];
  _gfx.stage='burst'; gfxStopChargeSound(); gfxBurstSound(_gfx.rarity);
  _gfx.parts=[];
  el.classList.remove('st-charge'); el.classList.add('st-burst');
  gfxBurstParticles(cfg.sparks);
  if(_gfx.rarity==='rare'||_gfx.rarity==='superrare'){
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
  }
  if(_gfx.rarity==='superrare') gfxAfter(380,()=>gfxBurstParticles(cfg.sparks*0.6));
  gfxAfter({common:450,uncommon:550,rare:750,superrare:1100}[_gfx.rarity],()=>gfxReveal());
}
function gfxPreviewHtml(it){
  if(it.category==='fx')return `<div class="gfx-prev-title">${{riichi:'リーチ',ron:'ロン',win:'上がり'}[it.fxKind]}の演出</div>`;
  if(it.category==='fieldbg'){
    const bg=fieldBgPreviewCss(it);
    return `<div class="gfx-prev" style="width:150px;height:76px;background:${bg}"></div>`;
  }
  if(it.category==='theme'){
    const sw=GACHA_THEME_SWATCH[it.value]||['#2a1e12','#5a4028'];
    return `<div class="gfx-prev" style="width:42px;height:66px;background:${sw[0]};border-color:${sw[1]}"></div>`;
  }
  if(it.category==='confetti') return `<div class="gfx-prev-dots">${it.value.map(c=>`<i style="background:${c}"></i>`).join('')}</div>`;
  if(it.category==='title') return `<div class="gfx-prev-title">「${esc(it.value)}」</div>`;
  return '';
}
function gfxReveal(){
  if(_gfx.stage==='reveal')return;
  _gfx.timers.forEach(clearTimeout); _gfx.timers=[];
  gfxStopChargeSound();
  const el=document.getElementById('gacha-fx'),cfg=GFX_CFG[_gfx.rarity],item=_gfx.item,info=GACHA_RARITY_INFO[item.rarity];
  _gfx.stage='reveal'; el.classList.remove('st-charge','st-burst'); el.classList.add('st-reveal');removeGoldKaku();
  const st=loadGachaState(),canUse=st.owned.includes(item.id)&&(item.category==='fx'?myFxId(item.fxKind)!==item.fxId:st.equipped[item.category]!==item.id);
  const canAgain=loadPetals()>=GACHA_COST;
  const stars=Array.from({length:cfg.stars},(_,i)=>`<span style="animation-delay:${.5+i*.12}s">★</span>`).join('');
  document.getElementById('gfx-cardwrap').innerHTML=`
    ${cfg.banner?`<div class="gfx-banner">${cfg.banner}</div>`:''}
    <div class="gfx-card">
      ${_gfx.isDup?'':'<div class="gfx-new">NEW!</div>'}
      <div class="gfx-stars">${stars}</div>
      <div class="gfx-rlabel">${_gachaBatch?_gachaBatch.n+'連の最高レア　':''}${esc(info.label)}</div>
      <div class="gfx-icon">${itemIconHtml(item)}</div>
      <div class="gfx-title">${esc(item.title)}</div>
      ${gfxPreviewHtml(item)}
      <div class="gfx-desc">${esc(item.desc)}</div>
      ${_gfx.isDup?'<div class="gfx-dup">すでに持っています（花びら一部還元）</div>':''}
      <div class="gfx-btns">
        ${canUse?'<button class="gfx-btn main" id="gfx-equip-btn" onclick="event.stopPropagation();gfxEquipNow()">✨ 今すぐ使う</button>':''}
        ${_gachaBatch?`<button class="gfx-btn main" onclick="event.stopPropagation();closeGachaFx()">📋 ${_gachaBatch.n}連の結果を見る</button>`:`<button class="gfx-btn sub" ${canAgain?'':'disabled'} onclick="event.stopPropagation();gfxAgain()">🌸 もう一度引く（${GACHA_COST}）</button>
        <button class="gfx-btn ghost" onclick="event.stopPropagation();closeGachaFx()">閉じる</button>`}
      </div>
    </div>`;
  gfxRevealSound(_gfx.rarity);
  if(_gfx.rarity==='rare'||_gfx.rarity==='superrare')launchConfetti();
  if(_gfx.rarity==='superrare') gfxBurstParticles(60);
}
function skipGachaFx(){
  if(_gfx.stage==='charge'){ _gfx.timers.forEach(clearTimeout); _gfx.timers=[]; gfxBurst(); }
  else if(_gfx.stage==='burst') gfxReveal();
}
function gfxEquipNow(){
  const it=_gfx.item; if(!it)return;
  if(it.category==='fx'){const o=loadMyFx();o[it.fxKind]=it.fxId;try{localStorage.setItem('rikka_fx',JSON.stringify(o));}catch(e){}syncMyFx();renderGachaCollection();try{refreshCustomize();}catch(e){}}else equipGachaItem(it.category,it.id);
  const b=document.getElementById('gfx-equip-btn');
  if(b){b.textContent='✔ 使用中';b.disabled=true;}
}
function closeGachaFx(){
  _gfx.timers.forEach(clearTimeout); _gfx.timers=[]; cancelAnimationFrame(_gfx.raf);
  gfxStopChargeSound();
  const wasActive=_gfx.stage!=='idle'; _gfx.stage='idle';
  document.getElementById('gacha-fx').style.display='none';removeGoldKaku();
  if(wasActive&&_gfx.item){
    if(_gachaBatch){const b=_gachaBatch;_gachaBatch=null;renderGachaCollection();showGachaSummary(b);}
    else{ showGachaResult(_gfx.item,_gfx.isDup); renderGachaCollection(); }
  }
  if(_gfxPendingAch.length){const l=_gfxPendingAch;_gfxPendingAch=[];setTimeout(()=>showAchievementPopup(l),400);}
}
function gfxAgain(){ closeGachaFx(); drawGacha(_lastBanner); }

function showGachaResult(item,isDup){
  const info=GACHA_RARITY_INFO[item.rarity];
  const el=document.getElementById('gacha-result');
  el.innerHTML=`<div class="gacha-result-card">
    <div class="gacha-result-rarity" style="color:${info.color}">★ ${esc(info.label)}</div>
    <div class="gacha-result-icon">${itemIconHtml(item)}</div>
    <div class="gacha-result-title">${esc(item.title)}</div>
    ${isDup?'<div class="gacha-result-dup">すでに持っています（花びら一部還元）</div>':''}
  </div>`;
}
function renderGachaCollection(){
  const el=document.getElementById('gacha-collection');
  if(!el)return;
  const st=loadGachaState();
  const owned=new Set(st.owned);
  const groups={};
  const _lim=_gachaView==='limited',_gold=_gachaView==='gold';
  try{document.getElementById('gacha').classList.toggle('gold-mode',_gold);}catch(e){}
  GACHA_ITEMS.filter(it=>_lim?(it.limited===LIMITED_GACHA.id||LIMITED_GACHA.existing.includes(it.id)):_gold?!!it.gold:(!it.achievement&&!it.loginStar&&!it.limited&&!it.event&&!it.gold)).forEach(it=>{ (groups[it.rarity]=groups[it.rarity]||[]).push(it); });
  let html='';
  for(const [rarity,info] of Object.entries(GACHA_RARITY_INFO)){
    const items=groups[rarity]||[];
    if(!items.length)continue;
    html+=`<div class="gacha-rarity-title" style="color:${info.color}">${esc(info.label)}</div>`;
    html+=items.map(it=>{
      const has=owned.has(it.id);
      const isFx=it.category==='fx';
      const isEquipped=isFx?myFxId(it.fxKind)===it.fxId:st.equipped[it.category]===it.id;
      const onc=isFx?`equipFxItem('${it.id}')`:`equipGachaItem('${it.category}','${it.id}')`;
      let btn=has?`<button class="gacha-equip-btn${isEquipped?' gacha-equipped':''}" onclick="${onc}">${isEquipped?'使用中':'使う'}</button>`:'';
      if(isFx)btn=`<div style="display:flex;flex-direction:column;gap:.3rem">${btn}<button class="gacha-equip-btn" onclick="previewFxItem('${it.id}')">見る</button></div>`;
      return `<div class="gacha-item${has?' gacha-owned':''}">
        <div class="gacha-item-icon${(_lim||_gold)?' ltd':''}">${(_lim||_gold)?ltdIcon(it,has):(has?itemIconHtml(it):'🔒')}</div>
        <div class="gacha-item-body">
          <div class="gacha-item-title">${esc(it.title)}</div>
          <div class="gacha-item-desc">${esc(it.desc)}</div>
        </div>
        ${btn}
      </div>`;
    }).join('');
  }
  // 実績の報酬（ガチャには出ない）
  const rw=(_lim||_gold)?[]:GACHA_ITEMS.filter(it=>it.achievement);
  if(rw.length){
    html+=`<div class="gacha-rarity-title" style="color:#ffd978">🏅 実績の報酬</div>`;
    html+=rw.map(it=>{
      const has=owned.has(it.id),isEquipped=st.equipped[it.category]===it.id,a=ACHIEVEMENTS.find(x=>x.id===it.achievement);
      const btn=has?`<button class="gacha-equip-btn${isEquipped?' gacha-equipped':''}" onclick="equipGachaItem('${it.category}','${it.id}')">${isEquipped?'使用中':'使う'}</button>`:'';
      return `<div class="gacha-item${has?' gacha-owned':''}">
        <div class="gacha-item-icon">${has?it.icon:'🔒'}</div>
        <div class="gacha-item-body">
          <div class="gacha-item-title">${esc(it.title)}</div>
          <div class="gacha-item-desc">${has?esc(it.desc):'実績「'+esc(a?a.title:'')+'」で入手'}</div>
        </div>${btn}</div>`;
    }).join('');
  }
  // 期間限定景品（入手済み）：開催ごとにまとめて表示。ガチャが終わっても、入手済みの景品はずっと残り、いつでも使える
  const _past=(_lim||_gold)?[]:GACHA_ITEMS.filter(it=>it.limited&&owned.has(it.id));
  if(_past.length){
    html+=`<div class="gacha-rarity-title" style="color:#ffd978">✨ 期間限定景品（入手済み）</div><div style="font-size:.7rem;color:#8a7048;margin:-.1rem 0 .4rem">期間限定ガチャで手に入れた景品は、開催が終わってもずっと使えます</div>`;
    const _gids=LIMITED_LIST.map(x=>String(x.id));
    const _gname=g=>{const x=LIMITED_LIST.find(y=>String(y.id)===String(g));return x?x.name:'その他';};
    const _order=g=>{const i=_gids.indexOf(String(g));return i<0?999:i;};
    const _gs=[...new Set(_past.map(it=>String(it.limited)))].sort((p,q)=>_order(p)-_order(q));
    _gs.forEach(g=>{
      const _live=isLimitedActive()&&String(LIMITED_GACHA.id)===g;
      html+=`<div style="font-size:.78rem;color:#c9a84c;margin:.5rem 0 .25rem">${esc(_gname(g))}${_live?'（開催中）':''}</div>`;
      html+=_past.filter(it=>String(it.limited)===g).map(it=>{
        const isEquipped=st.equipped[it.category]===it.id;
        const btn=`<button class="gacha-equip-btn${isEquipped?' gacha-equipped':''}" onclick="equipGachaItem('${it.category}','${it.id}')">${isEquipped?'使用中':'使う'}</button>`;
        return `<div class="gacha-item gacha-owned">
          <div class="gacha-item-icon ltd">${ltdIcon(it,true)}</div>
          <div class="gacha-item-body">
            <div class="gacha-item-title">${esc(it.title)}</div>
            <div class="gacha-item-desc">${esc(it.desc)}</div>
          </div>${btn}</div>`;
      }).join('');
    });
  }
  el.innerHTML=html;
}
function refreshMyIcon(){updateAvatarDisplay();updateLobbyAvatar();syncMyAvatar();}
function equipGachaItem(category,id){
  const st=loadGachaState();
  if(!st.owned.includes(id))return;
  if(st.equipped[category]===id) delete st.equipped[category];
  else st.equipped[category]=id;
  saveGachaState(st);
  applyEquippedGachaItems();
  if(category==='fieldbg'&&currentCode)socket?.emit('set_field_bg',{code:currentCode,url:myFieldBgValue()});
  if(category==='title')syncMyTitle();
  if(category==='gicon')refreshMyIcon();
  renderGachaCollection();
  updateSbTitle();
  refreshCustomize();
}
// 装備中のテーマ・場の背景（ボット対戦時）を反映する
function applyEquippedGachaItems(){
  const st=loadGachaState();
  const themeItem=GACHA_ITEMS.find(it=>it.id===st.equipped.theme);
  if(themeItem) setBackTheme(themeItem.value);
  updateFieldBgForTurn();
}
// 紙吹雪の色。装備中のガチャアイテムがあればそれを、無ければ通常配色を返す
function getConfettiPalette(){
  const st=loadGachaState();
  const item=GACHA_ITEMS.find(it=>it.id===st.equipped.confetti);
  return item?item.value:['#f5e060','#e05050','#60c870','#60a8f0','#e07050','#c9a84c','#a070e8'];
}
// ボット対戦時、装備中の場の背景プリセット（グラデーション or 画像）のアイテム本体を返す
function getEquippedFieldBgItem(){
  const st=loadGachaState();
  return GACHA_ITEMS.find(it=>it.id===st.equipped.fieldbg)||null;
}
function applyFieldBgGradient(gradientCss){
  stopFieldAnim();_wantScene=null;_sceneApplied=null;
  let styleEl=document.getElementById('field-bg-style');
  if(!styleEl){styleEl=document.createElement('style');styleEl.id='field-bg-style';document.head.appendChild(styleEl);}
  styleEl.textContent=gradientCss?`#field-wrap::before{background:${gradientCss}!important}`:'';
}
// 名前の横に表示する称号（サイドバーのプロフィール欄）
function updateSbTitle(){
  const el=document.getElementById('sb-title');
  if(!el)return;
  const st=loadGachaState();
  const item=GACHA_ITEMS.find(it=>it.id===st.equipped.title);
  el.textContent=item?item.value:'';
}
let _gachaView='std';
function cycleJoCover(){const c=['blue','red','green'],r=document.documentElement;r.dataset.jc=c[(c.indexOf(r.dataset.jc)+1)%c.length];}
function openGacha(){
  document.documentElement.dataset.jc=['blue','red','green'][Math.floor(Math.random()*3)];
  _gachaView='std';
  document.getElementById('gacha-cost-label').textContent=GACHA_COST;
  updatePetalDisplays();
  document.getElementById('gacha-result').innerHTML='';
  renderGachaCollection();
  const lim=document.getElementById('gacha-banner-limited'),act=isLimitedActive();
  if(lim)lim.style.display=act?'':'none';
  document.getElementById('gacha-ltd-period').textContent=`開催期間：${LIMITED_GACHA.start.slice(5).replace('-','/')} 〜 ${LIMITED_GACHA.end.slice(5).replace('-','/')}${_ldDevPick()?'（開発者プレビュー）':''}`;
  const tt=document.getElementById('gacha-ltd-top');if(tt)tt.textContent=LIMITED_GACHA.topText;
  const ti=document.getElementById('ltd-top-icons');if(ti)ti.innerHTML=LIMITED_GACHA.top.map(id=>ltdIcon(GACHA_ITEMS.find(x=>x.id===id),true,true)).join('');
  showScreen('gacha');
  // 画面を表示してから、恒常ガチャの位置に戻す（非表示のうちは位置を変えられず、前回のスワイプ位置が残ってしまうため）
  const toStd=()=>{buildGachaLoop();const b=document.getElementById('gacha-banners');_gbInit(b);if(b){b.style.scrollSnapType='none';b.scrollLeft=b.querySelector('[data-clone]')?_gbStep(b):0;requestAnimationFrame(()=>{b.style.scrollSnapType='';});}updateGachaDots();};
  toStd();requestAnimationFrame(toStd);
}
function fillJoBanner(){const e=document.getElementById('jo-banner-icons');if(e&&!e.innerHTML){e.innerHTML=['aura','rush','timestop'].map(goldIcon).join(' ');return true;}return false;}
// ---- ガチャのバナー：左右に隣のバナーをのぞかせ、端でつながるループにする ----
function _gbVis(bn){return[...bn.children].filter(e=>e.style.display!=='none');}
function _gbList(){const bn=document.getElementById('gacha-banners');return bn?[...bn.children].filter(e=>!e.dataset.clone&&e.style.display!=='none'):[];}
function _gbStep(bn){const k=_gbVis(bn);return k.length>1?k[1].offsetLeft-k[0].offsetLeft:bn.clientWidth;}
function buildGachaLoop(){
  const bn=document.getElementById('gacha-banners');if(!bn)return;
  const keep=bn.scrollLeft;bn.querySelectorAll('[data-clone]').forEach(e=>e.remove());
  const r=_gbList();if(r.length<2)return;
  const mk=el=>{const c=el.cloneNode(true);c.dataset.clone='1';c.removeAttribute('id');c.setAttribute('aria-hidden','true');c.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));return c;};
  bn.insertBefore(mk(r[r.length-1]),bn.firstChild);bn.appendChild(mk(r[0]));
  bn.style.scrollSnapType='none';bn.scrollLeft=keep+(keep?0:0);requestAnimationFrame(()=>{bn.style.scrollSnapType='';});
}
let _gbT=0,_gbTouch=0;
// 端の複製バナーに入ったら、見た目がまったく同じ「本物の位置」へ即座に入れ替える（位置の端数も保つので、ずれ・飛びが出ない）
function _gbWrap(){
  const bn=document.getElementById('gacha-banners');if(!bn||!bn.clientWidth)return false;
  const n=_gbList().length;if(n<2||!bn.querySelector('[data-clone]'))return false;
  const st=_gbStep(bn),p=bn.scrollLeft;let q=p;
  if(p<st*.5)q=p+n*st;else if(p>(n+.5)*st)q=p-n*st;
  if(q===p)return false;
  bn.style.scrollSnapType='none';bn.scrollLeft=q;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{bn.style.scrollSnapType='';updateGachaDots();}));return true;
}
function gachaScrolled(){updateGachaDots();clearTimeout(_gbT);if(!_gbTouch)_gbT=setTimeout(_gbWrap,50);}
function _gbInit(bn){
  if(!bn||bn._gbInit)return;bn._gbInit=1;
  bn.addEventListener('touchstart',()=>{_gbTouch=1;clearTimeout(_gbT);_gbWrap();},{passive:true});
  const end=()=>{_gbTouch=0;clearTimeout(_gbT);_gbT=setTimeout(_gbWrap,60);};
  bn.addEventListener('touchend',end,{passive:true});bn.addEventListener('touchcancel',end,{passive:true});
  bn.addEventListener('scrollend',()=>{if(!_gbTouch)_gbWrap();});
}
function gachaNav(d){const bn=document.getElementById('gacha-banners');if(!bn)return;const st=_gbStep(bn),n=_gbVis(bn).length,di=Math.round(bn.scrollLeft/st),t=Math.max(0,Math.min(n-1,di+d));bn.scrollTo({left:t*st,behavior:'smooth'});}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#gacha-banners .gacha-banner.gb-side');if(!b)return;e.stopPropagation();e.preventDefault();const bn=b.parentNode;bn.scrollTo({left:_gbVis(bn).indexOf(b)*_gbStep(bn),behavior:'smooth'});},true);
function updateGachaDots(){
  const filled=fillJoBanner();if(filled)buildGachaLoop();
  const el=document.getElementById('gacha-dots'),bn=document.getElementById('gacha-banners');
  if(!el||!bn)return;
  const vs=['std'].concat(isLimitedActive()?['limited']:[]).concat(['gold']);
  if(!bn.clientWidth)return; // 画面が非表示のあいだは判定しない
  const kids=_gbVis(bn),loop=!!bn.querySelector('[data-clone]'),st=_gbStep(bn)||bn.clientWidth,di=Math.max(0,Math.min(kids.length-1,Math.round(bn.scrollLeft/st)));
  kids.forEach((k,j)=>k.classList.toggle('gb-side',j!==di));
  const idx=loop?((di-1)%vs.length+vs.length)%vs.length:Math.min(vs.length-1,di);
  const v=vs[idx];
  if(v!==_gachaView){_gachaView=v;renderGachaCollection();}
  el.style.display='block';
  const hint=(idx===0&&isLimitedActive()?'期間限定ガチャ開催中！ ':'')+'← 左右にスワイプで他のガチャへ →';
  el.innerHTML=vs.map((_,k)=>`<i class="${k===idx?'on':''}"></i>`).join('')+'<br>'+hint;
}
function closeGacha(){ showScreen('lobby'); }
