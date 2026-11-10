// ============================================================

// 描画

// ============================================================


// ============================================================
// 自分の番になったときの演出（「あなたの番です」）
// ============================================================
let _prevTurnMine=false,_turnCuePending=false,_turnCueTimer=null;
function checkTurnCue(){
  if(!G||G.phase!=='playing'||typeof myOnlineIdx==='undefined'||!G.players||!G.players[myOnlineIdx])return;
  const isMine=G.turn===myOnlineIdx;
  if(isMine&&!_prevTurnMine)_turnCuePending=true;
  if(!isMine||G.players[myOnlineIdx].riichi)_turnCuePending=false; // リーチ中は自動で進むので出さない
  _prevTurnMine=isMine;
  if(_turnCuePending)tryTurnCue();
}
function tryTurnCue(){
  const blocked=document.getElementById('match-fx')||document.getElementById('call-fx')||(document.getElementById('gacha-fx')&&document.getElementById('gacha-fx').style.display==='block')||document.getElementById('icon-update-modal')||(document.getElementById('sidebar')&&document.getElementById('sidebar').style.display==='block')||(document.getElementById('modal')&&document.getElementById('modal').classList.contains('open'));
  if(blocked)return; // ほかの演出や画面が出ているあいだは待つ
  _turnCuePending=false;
  const old=document.getElementById('turn-fx');if(old)old.remove();
  const hint=G.tphase==='pick'?'場から牌を1枚引こう':'捨てる牌を選ぼう';
  const el=document.createElement('div');el.id='turn-fx';
  el.innerHTML=`<div class="tf-band"></div><div class="tf-line"></div><div class="tf-line b"></div><div class="tf-text">あなたの番です</div><div class="tf-hint">${hint}</div>`;
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),1450);
  _gfxAudio(ctx=>{const now=ctx.currentTime,m=ctx.createGain();m.gain.value=soundVolume*.35;m.connect(ctx.destination);
    [[784,0],[1174.7,.1]].forEach(([f,t])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,now+t);g.gain.linearRampToValueAtTime(.7,now+t+.015);g.gain.exponentialRampToValueAtTime(.001,now+t+.45);o.connect(g);g.connect(m);o.start(now+t);o.stop(now+t+.5);});});
}
setInterval(()=>{if(_turnCuePending)checkTurnCue();},350); // 紹介画面などが終わるのを待って出す
function render(){renderHeader();renderOpponents();renderField();renderHand();renderStatus();requestAnimationFrame(updateFlipPopup);updateTurnGlow();checkTurnCue();if(window.__bs>0&&!onlineMode)botSpecPush();}
function renderHeader(){
  const gl=document.getElementById('goal-label');
  if(gl)gl.textContent=`${G?.goal||WIN_SCORE}点先取`;
document.getElementById('scoreboard').innerHTML=G.players.map((p,i)=>{

const act=i===G.turn,cls=act?(p.isBot?'active-bot':'active-human'):'';

const avatarHtml=avatarImgHtml(i===myOnlineIdx?myAvatarUrl():p.avatar,'spill-avatar');
return`<div class="spill ${cls}">${avatarHtml}<span class="sn">${esc(p.name)}</span><span class="sv">${p.score}</span></div>`;
}).join('');

}

function renderOpponents(){

const el=document.getElementById('opp-area');
if(el){el.innerHTML='';return;}

const opps=G.players.filter((_,i)=>i!==myOnlineIdx);

if(!opps.length){el.innerHTML='';return;}

el.innerHTML=opps.map(p=>{

const pi=G.players.indexOf(p),act=pi===G.turn;

const backs=p.hand.map(()=>'<div class="tback"></div>').join('');

const dots=act&&p.isBot?`<div class="tdots"><div class="tdot"></div><div class="tdot"></div><div class="tdot"></div></div>`:'';

return`<div class="ocard${act?' oactive':''}"><span class="oname">${avatarImgHtml(p.avatar,'spill-avatar')}${esc(p.name)}</span><div class="ohand">${backs}</div>${dots}<span class="oscore">${p.score}点</span></div>`;

}).join('');

}

function renderField(){
const myIdx=Number(myOnlineIdx),turn=Number(G.turn),isMyTurn=turn===myIdx,canPick=isMyTurn&&G.tphase==='pick';
const normalTiles=G.field.filter(t=>!t.discarded),discardTiles=G.field.filter(t=>t.discarded);
document.getElementById('field-cnt').textContent=`場 ${normalTiles.length}枚 ／ 捨て牌 ${discardTiles.length}枚`;
const grid=document.getElementById('field-grid');grid.innerHTML='';

// アシスト計算
let bestNormalTile=null,bestNormalScore=-Infinity,bestDiscardTile=null,bestDiscardScore=-Infinity;
if(assistMode&&canPick){
  try{
    const p=G.players[myOnlineIdx];
    const optR=onlineMode?(G?.optRoles??null):getOptRoles('bot-opt-');
    const r=calcAssist(p.hand,G.field,optR);
    bestNormalTile=r.bestNormalTile;bestNormalScore=r.bestNormalScore;
    bestDiscardTile=r.bestDiscardTile;bestDiscardScore=r.bestDiscardScore;
  }catch(e){bestNormalTile=null;bestDiscardTile=null;}
}
let normalIsBetter=bestNormalScore>=bestDiscardScore;
let _winSet=new Set(),_waitSet=new Set();
if(assistMode){
  try{
    const p2=G.players[myOnlineIdx];
    if(p2&&p2.hand.length===5){
      const optR2=onlineMode?(G?.optRoles??null):getOptRoles('bot-opt-');
      const v=calcAssistV2(p2,G,optR2,myOnlineIdx);
      if(v.waits.length){
        if(canPick){_winSet=new Set(v.winDiscards);normalIsBetter=_winSet.size===0;} // 上がれる捨て牌があればそれを、なければ山から引いて待ち牌を狙う
        else _waitSet=new Set(v.winDiscards);
      }
    }
  }catch(e){}
}

if(normalTiles.length>0){
  const label=document.createElement('div');label.className='fsec';label.textContent='🀄 場の牌（好きな1枚を選ぼう）';grid.appendChild(label);
  const normalWrap=document.createElement('div');normalWrap.style.cssText='display:flex;flex-wrap:wrap;gap:5px;padding:3px';
  if(assistMode&&canPick&&normalIsBetter)normalWrap.classList.add('normal-area-best');
  grid.appendChild(normalWrap);
  normalTiles.forEach(t=>{
    const fi=G.field.indexOf(t),div=document.createElement('div');
    div.className=canPick?'fback fback-pickable':'fback';
    div.style.cursor=canPick?'pointer':'default';
    if(!canPick)div.style.opacity='0.8';
    if(canPick)div.addEventListener('click',()=>pickField(fi));
    normalWrap.appendChild(div);
  });
}

if(discardTiles.length>0){
  const label2=document.createElement('div');label2.className='fsec';label2.style.marginTop=normalTiles.length>0?'7px':'0';label2.textContent='♻ 捨て牌（引いてもOK）';grid.appendChild(label2);
  discardTiles.forEach(t=>{
    const fi=G.field.indexOf(t),div=document.createElement('div');
    div.className=canPick?'tile discarded pickable':'tile discarded nopick';
    div.innerHTML=tileInner(t);
    if(assistMode&&canPick&&!normalIsBetter&&t===bestDiscardTile&&_winSet.size===0)div.classList.add('assist-best');
    if(_winSet.has(t))div.classList.add('assist-win');
    if(_waitSet.has(t))div.classList.add('assist-wait');
    if(canPick)div.addEventListener('click',()=>pickField(fi));
    grid.appendChild(div);
  });
}

if(G.field.length===0)grid.innerHTML='<div style="color:#5a4820;font-size:.9rem;padding:.5rem">場に牌がありません</div>';
}

function renderHand(){

const p=G.players[myOnlineIdx];

document.getElementById('hand-tiles').innerHTML =
    p.hand.map((t,i) => {
      if (t.hidden) return '';
      const sel = i === G.selIdx ? ' selected' : '';
      return tileHTML(t, `onclick="clickHand(${i})" oncontextmenu="flipHand(event,${i})"`, `tile htile${sel}`);
    }).join('');
const isMyTurn=G.turn===myOnlineIdx,isDiscard=isMyTurn&&G.tphase==='discard',hasSel=G.selIdx!==-1,has6=p.hand.length===6;
const optR = onlineMode ? (G?.optRoles ?? null) : getOptRoles('bot-opt-');
const winRes = (isDiscard && has6) ? checkWin(p.hand, optR) : null;

const db=document.getElementById('btn-discard');db.style.display=(isDiscard&&hasSel)?'block':'none';db.disabled=false;

document.getElementById('btn-win').disabled=!winRes;

const hh=document.getElementById('hand-hint');

if (winRes) {
    const bonus = winRes.noBonus ? 0 : countZorome(p.hand);
    const bonusTxt = bonus > 0 ? ` ＋★×${bonus}` : '';
hh.textContent=`★ ${winRes.role}（${winRes.pts}点${bonusTxt}）上がれます！`;hh.className='can-win';updateWinSparkle(winRes);}
else if(p.hand.length<6){hh.textContent=`手牌 ${p.hand.length}枚 — 場から引いてください`;hh.className='';}

else{hh.textContent=`手牌 ${p.hand.length}枚 — 捨てるか役を揃えて上がろう`;hh.className='';}

// テンパイになる牌を判定（リーチボタン表示と、下の捨て牌ハイライトの両方で使い回す）。リーチありの対局でのみ判定する。
const tenpaiFlags=(!!(G?.useRiichi)&&isDiscard&&has6&&!winRes&&!p.riichi)
  ? p.hand.map((_,i)=>isTenpai(p.hand.filter((_,j)=>j!==i),optR))
  : [];

// アシスト: 捨てるべき牌を赤く光らせる（待ち牌・残り枚数・期待点・相手のリーチまで見て選ぶ）
// 計算に少し時間がかかるので、画面を先に描いてから行う
const _tok=++_assistTok;
if(assistMode){
  setTimeout(()=>{
    if(_tok!==_assistTok||!G||!G.players[myOnlineIdx])return;
    let html='';
    try{
      const p2=G.players[myOnlineIdx],has6b=p2.hand.length===6,isDisc=G.turn===myOnlineIdx&&G.tphase==='discard';
      const win2=(isDisc&&has6b)?checkWin(p2.hand,optR):null;
      if(isDisc&&has6b&&!win2){
        const v=assistApplyStyle(calcAssistV2(p2,G,optR,myOnlineIdx),p2.hand,optR);
        const tiles=document.getElementById('hand-tiles').querySelectorAll('.htile');
        if(v.bestIdx!==-1&&tiles[v.bestIdx])tiles[v.bestIdx].classList.add('assist-discard');
        v.danger.forEach((d,i)=>{if(d>0&&tiles[i])tiles[i].classList.add('assist-danger');});
        html=(assistMineActive()?'<div style="font-size:.7rem;color:#c9a84c;margin-bottom:.2rem">🎭 自分流で判断中</div>':(assistTunedActive()?'<div style="font-size:.7rem;color:#8ac8b0;margin-bottom:.2rem">🧠 結果から調整した最適で判断中</div>':''))+assistInfoHtml(v,p2,G);
      }else if(p2.hand.length===5){
        html=assistInfoHtml(calcAssistV2(p2,G,optR,myOnlineIdx),p2,G);
      }
    }catch(e){}
    updateAssistInfo(html);
  },0);
}else updateAssistInfo('');
// リーチ判定: 捨てればテンパイになる牌を赤く点滅させる（assistModeのON/OFFに関係なく常に表示）
if(tenpaiFlags.some(Boolean)){
  const tiles=document.getElementById('hand-tiles').querySelectorAll('.htile');
  tenpaiFlags.forEach((ok,i)=>{ if(ok && tiles[i]) tiles[i].classList.add('tenpai-hint'); });
}
// リーチボタン表示
const canRiichi=!!(G?.useRiichi) && tenpaiFlags.some(Boolean);
showRiichiBtn(canRiichi);
}

function renderStatus(){

const el=document.getElementById('status'),isMyTurn=G.turn===myOnlineIdx;

el.className=isMyTurn?'myturn':'boturn';

if(isMyTurn){el.textContent=G.tphase==='pick'?'📥 場から好きな牌を1枚選んでください':'📤 捨てる牌を選んで「捨てる」 ／ 役が揃ったら「上がる！」';}

else{el.textContent=`${G.players[G.turn]?.name??'...'} が考え中...`;}

}

function tileHTML(t,events='',cls='tile'){return`<div class="${cls}" ${events}>${tileInner(t)}</div>`;}

function tileInner(t){const tv=eTop(t),bv=eBot(t),star=(t.top===t.bot&&!t.hidden)?`<div class="tile-star">★</div>`:'';return`<div class="th">${SYM_SVG[tv]}</div>${star}<div class="tb">${SYM_SVG[bv]}</div>`;}

// ============================================================

// 上下反転ポップアップ

// ============================================================

function doFlipSelected(){

if(!G||G.selIdx===-1)return;

const tile=G.players[myOnlineIdx].hand[G.selIdx];

if(!tile)return;

tile.flip=!tile.flip;

playSound('flip');

render();

if(onlineMode)socket?.emit('flip',{code:currentCode,tileId:tile.id});

}

function updateFlipPopup(){

const popup=document.getElementById('flip-popup');

if(!G||G.selIdx===-1){popup.style.display='none';return;}

const tiles=document.querySelectorAll('#hand-tiles .htile');

const tile=tiles[G.selIdx];

if(!tile){popup.style.display='none';return;}

const rect=tile.getBoundingClientRect();

const popupW=108;

let left=rect.left+rect.width/2;

// 画面端クランプ

left=Math.max(popupW/2+6,Math.min(window.innerWidth-popupW/2-6,left));

const top=rect.top-50;

popup.style.display='block';

popup.style.left=left+'px';

popup.style.top=Math.max(4,top)+'px';

}

// ============================================================

// 操作

// ============================================================

function pickField(fi){if(!G||G.phase!=='playing')return;if(Number(G.turn)!==Number(myOnlineIdx))return;if(G.tphase!=='pick')return;const p=G.players[myOnlineIdx];if(p.hand.length>=6){toast('もう持てないよ！');return;}if(onlineMode){socket?.emit('pick',{code:currentCode,fieldIdx:Number(fi)});playSound('pick');return;}const picked=G.field.splice(fi,1)[0];p.hand.push(picked);playSound('pick');G.tphase='discard';G.selIdx=-1;render();
  // リーチ中: 上がり牌でなければ自動捨て
  if(p.riichi){
    const optR=G?.optRoles??null;
    // 全フリップ組み合わせで上がりチェック（上下反転すれば揃うケースも見逃さない）
    let winRes=null, winHand=null;
    const lim=Math.min(1<<p.hand.length,64);
    for(let m=0;m<lim;m++){
      const h=p.hand.map((t,i)=>({...t,flip:!!(m&(1<<i))}));
      const w=checkWin(h,optR);
      if(w){winRes=w;winHand=h;break;}
    }
    if(winRes){
      p.hand.forEach((t,i)=>{t.flip=winHand[i].flip;});
      render();
    } else {
      setTimeout(()=>{
        const idx=p.hand.indexOf(picked);
        if(idx!==-1){
          const tile=p.hand.splice(idx,1)[0];
          tile.discarded=true;
          G.field.push(tile);
          playSound('discard');
          G.selIdx=-1;
          if(checkBotRon(myOnlineIdx)) return;
          nextTurn();
        }
      },600);
    }
  }
}

function clickHand(i){if(G.phase!=='playing')return;const prev=G.selIdx;if(prev===-1){G.selIdx=i;}else if(prev===i){G.selIdx=-1;}else{const h=G.players[myOnlineIdx].hand;[h[prev],h[i]]=[h[i],h[prev]];G.selIdx=-1;playSound('swap');}render();}

function flipHand(e,i){e.preventDefault();if(G.phase!=='playing')return;const tile=G.players[myOnlineIdx].hand[i];if(!tile)return false;tile.flip=!tile.flip;playSound('flip');render();if(onlineMode)socket?.emit('flip',{code:currentCode,tileId:tile.id});return false;}

function doDiscard(){if(G.tphase!=='discard'||G.turn!==myOnlineIdx)return;const p=G.players[myOnlineIdx];if(G.selIdx===-1){toast('捨てる牌を選んでください');return;}if(p.hand.length<=5){toast('これ以上捨てれないよ！');return;}if(onlineMode){socket?.emit('discard',{code:currentCode,tileId:p.hand[G.selIdx].id});playSound('discard');G.selIdx=-1;render();return;}try{assistRecord(p,G.selIdx);}catch(e){}const tile=p.hand.splice(G.selIdx,1)[0];tile.discarded=true;tile.by=myOnlineIdx;tile.afterRiichi=!!p.riichi;G.field.push(tile);playSound('discard');G.selIdx=-1;if(checkBotRon(myOnlineIdx))return;nextTurn();}

function doWin(){if(G.tphase!=='discard'||G.turn!==myOnlineIdx)return;const p=G.players[myOnlineIdx];if(p.hand.length!==6){toast('手牌が6枚のときだけ上がれます');return;}
                 const optR = onlineMode ? (G?.optRoles ?? null) : getOptRoles('bot-opt-');
const res = checkWin(p.hand, optR);
if (!res) { toast('まだ役が揃っていません'); return; }
if(onlineMode){socket?.emit('win',{code:currentCode});return;}
processWin(myOnlineIdx,res);}
// ターン・ボット

// ============================================================

// CPU戦：全員リーチで誰も場のどの牌でも上がれない（詰み）なら引き分け
function checkRiichiDeadlock(){
  if(onlineMode||!G||!G.useRiichi||G.phase!=='playing'||!G.players.every(p=>p.riichi))return false;
  const optR=G.optRoles??null;
  if(!G.players.every(p=>G.field.every(t=>!canRon(p.hand,t,optR))))return false;
  G.phase='roundEnd';clearRonWindow();render();
  showModal(`<div class="mtitle">🤝 引き分け</div><p style="color:#8a7860;font-size:.9rem">全員リーチで、誰も上がれる牌がありません</p><table class="mscores">${G.players.map(pl=>`<tr><td>${esc(pl.name)}</td><td>${pl.score}点</td></tr>`).join('')}</table><button class="mbtn" onclick="doNextRound()">次のラウンドへ →</button>`);
  return true;
}
function nextTurn(){if(checkRiichiDeadlock())return;G.turn=(G.turn+1)%G.players.length;G.tphase='pick';G.selIdx=-1;updateFieldBgForTurn();render();if(G.players[G.turn].isBot)scheduleBot();}

function scheduleBot(){if(G.phase!=='playing')return;const bot=G.players[G.turn];if(!bot?.isBot)return;const d={easy:1500,normal:1000,hard:600}[bot.diff]||1000;setTimeout(runBot,d);}

function runBot(){

if(G.phase!=='playing')return;const bot=G.players[G.turn];if(!bot?.isBot)return;const d={easy:1100,normal:750,hard:400}[bot.diff]||750;

if(G.tphase==='pick'){if(G.field.length===0){nextTurn();return;}

let fi=-1;
const _optP=G?.optRoles??null;
// リーチ中：上がれる牌が場にあれば最優先で取る
if(bot.riichi){
  for(let i=0;i<G.field.length&&fi===-1;i++){
    const base=[...bot.hand,G.field[i]],lim2=Math.min(1<<base.length,64);
    for(let m=0;m<lim2;m++){
      const h=base.map((t,k)=>({...t,flip:!!(m&(1<<k))}));
      if(checkWin(h,_optP)){fi=i;break;}
    }
  }
}
if(fi===-1){
  // 自分が直前に捨てた牌は取らない（同じ牌を捨てては拾う無限ループの防止）
  let cand=G.field.map((_,i)=>i).filter(i=>G.field[i].id!==bot.lastDiscardId);
  if(cand.length===0)cand=G.field.map((_,i)=>i);
  const pool=cand.map(i=>G.field[i]);
  let pi=0;
  if(bot.riichi||bot.diff==='easy'){pi=Math.floor(Math.random()*pool.length);}
  else if(bot.diff==='normal'){let best=-Infinity;pool.forEach((t,i)=>{const s=evalHandNormal([...bot.hand,t]);if(s>best){best=s;pi=i;}});}
  else{pi=botHardPickRikka(bot.hand,pool);}
  fi=cand[Math.max(0,Math.min(pool.length-1,pi))];
}

bot.hand.push(G.field.splice(fi,1)[0]);playSound('pick');G.tphase='discard';if(bot.diff==='hard')botHardFlipOptimize(bot.hand);render();
const optR=G?.optRoles??null;
const _wr2=checkWin(bot.hand,optR);
if(_wr2)botComment('winning');else if(Math.random()<0.2)botComment('pick');
// ボットリーチ判定
if(G?.useRiichi&&!bot.riichi&&!_wr2){
  const afterDiscard=bot.diff==='easy'?null:(()=>{
    let bestIdx=0,bestS=-Infinity;
    bot.hand.forEach((_,i)=>{const s=evalHand(bot.hand.filter((_,j)=>j!==i),optR);if(s>bestS){bestS=s;bestIdx=i;}});
    return bot.hand.filter((_,i)=>i!==bestIdx);
  })();
  if(afterDiscard&&isTenpai(afterDiscard,optR)&&Math.random()<0.7){
    bot.riichi=true;
    playSound('riichi');
    showCallFx('riichi',bot.name);
    const chatLog=document.getElementById('bot-chat-log');
    if(chatLog){
      const div=document.createElement('div');
      div.className='chat-msg theirs';
      div.innerHTML=`<div class="chat-name">${esc(bot.name)}</div>🀄 リーチ！`;
      chatLog.appendChild(div);chatLog.scrollTop=chatLog.scrollHeight;
    }
    toast(`${bot.name} がリーチ宣言！`);
  }
}
// 全フリップ組み合わせで上がりチェック
let wr=null, wrHand=null;
const lim=Math.min(1<<bot.hand.length,64);
for(let m=0;m<lim;m++){
  const h=bot.hand.map((t,i)=>({...t,flip:!!(m&(1<<i))}));
  const w=checkWin(h,optR);
  if(w){wr=w;wrHand=h;break;}
}
if(wr){
  bot.hand.forEach((t,i)=>{t.flip=wrHand[i].flip;});
  const winTurn=G.turn;
  setTimeout(()=>{if(!G||G.phase!=='playing')return;if(G.players[winTurn]?.isBot)processWin(winTurn,wr);},d);
  return;
}
setTimeout(()=>{if(G.phase!=='playing')return;
let di;
if(bot.riichi){di=bot.hand.length-1;}
else if(bot.diff==='easy'){di=Math.floor(Math.random()*bot.hand.length);}
else if(bot.diff==='normal'){di=botNormalDiscard(bot.hand);}
else{di=botHardDiscardRikka(bot.hand);}
const tile=bot.hand.splice(di,1)[0];tile.discarded=true;tile.by=G.turn;tile.afterRiichi=!!bot.riichi;bot.lastDiscardId=tile.id;bot.hand.sort((a,b)=>eTop(a)-eTop(b));G.field.push(tile);render();
playSound('discard');
if(Math.random()<0.15)botComment('discard');
if(checkBotRon(G.turn))return;
setTimeout(nextTurn,200);},d);}

}

function botBestDiscard(hand){let best=-Infinity,bi=0;hand.forEach((_,i)=>{const s = evalHand(hand.filter((_,j)=>j!==i), G?.optRoles ?? null);if(s>best){best=s;bi=i;}});return bi;}
function evalHandNormal(hand){
  // 一色に向かう評価（下の数が最も多い値に揃える）
  const freq={};
  hand.forEach(t=>{const b=eBot(t);freq[b]=(freq[b]||0)+1;});
  return Math.max(...Object.values(freq));
}
function botNormalDiscard(hand){
  let best=-Infinity,bi=0;
  hand.forEach((_,i)=>{
    const s=evalHandNormal(hand.filter((_,j)=>j!==i));
    if(s>best){best=s;bi=i;}
  });
  return bi;
}
// 強いボット: 六華特化AI（全牌の値が見える）
function botHardFlipOptimize(hand){
  // 最も六華に近い底値を選ぶ
  let bestTarget=1, bestScore=-1;
  for(let b=1;b<=6;b++){
    const tops=new Set();
    hand.forEach(t=>{
      if(t.bot===b)tops.add(t.top);
      else if(t.top===b)tops.add(t.bot);
    });
    if(tops.size>bestScore){bestScore=tops.size;bestTarget=b;}
  }
  // 実際にフリップして底値を揃える
  hand.forEach(t=>{
    if(t.bot===bestTarget) t.flip=false;
    else if(t.top===bestTarget) t.flip=true;
    else t.flip=false;
  });
  return bestTarget;
}
function botHardPickRikka(hand, field){
  // 現在のフリップ状態で目標底値を決定
  let bestTarget=1, bestScore=-1;
  for(let b=1;b<=6;b++){
    const tops=new Set();
    hand.forEach(t=>{
      if(t.bot===b)tops.add(t.top);
      else if(t.top===b)tops.add(t.bot);
    });
    if(tops.size>bestScore){bestScore=tops.size;bestTarget=b;}
  }
  const existing=new Set();
  hand.forEach(t=>{
    if(t.bot===bestTarget)existing.add(t.top);
    else if(t.top===bestTarget)existing.add(t.bot);
  });
  let bestFi=0, best=-Infinity;
  field.forEach((t,i)=>{
    let topVal=null;
    if(t.bot===bestTarget)topVal=t.top;
    else if(t.top===bestTarget)topVal=t.bot;
    const score=topVal!==null&&!existing.has(topVal)?100
               :topVal!==null?10:0;
    if(score>best){best=score;bestFi=i;}
  });
  return bestFi;
}
function botHardDiscardRikka(hand){
  // フリップ済みの手牌から捨てる牌を選ぶ
  // 目標底値を取得（eBot使用）
  const freq={};
  hand.forEach(t=>{const b=eBot(t);freq[b]=(freq[b]||0)+1;});
  const target=parseInt(Object.entries(freq).sort((a,b2)=>b2[1]-a[1])[0][0]);
  const usedTops=new Set();
  let worstIdx=0, worstScore=-Infinity;
  hand.forEach((t,i)=>{
    const ab=eBot(t), at=eTop(t);
    let score;
    if(ab!==target) score=100;                    // 底値が違う→最優先で捨てる
    else if(usedTops.has(at)) score=50;            // 上値が重複→次点で捨てる
    else{score=0;usedTops.add(at);}               // 有用なタイル→残す
    if(score>worstScore){worstScore=score;worstIdx=i;}
  });
  return worstIdx;
}
// アシスト評価（シンプル・高速版）
let _assistCache=null, _assistCacheKey='';
function _assistKey(hand, field, optR){
  return hand.map(t=>`${t.top}${t.bot}${t.flip?1:0}`).join(',')
    +'|'+field.map(t=>`${t.top}${t.bot}${t.discarded?1:0}`).join(',')
    +'|'+(optR?optR.join(','):'null');
}
function evalHandFull(hand, optR){
  if(hand.length===6){
    const w=checkWin(hand,optR);
    if(w) return (w.pts+(w.noBonus?0:countZorome(hand)))*10000;
  }
  let best=0;
  const lim=Math.min(1<<hand.length,64);
  for(let m=0;m<lim;m++){
    const h=hand.map((t,i)=>({...t,flip:!!(m&(1<<i))}));
    best=Math.max(best,scoreProgress(h,optR));
  }
  return best;
}
function calcAssist(hand, field, optR){
  const key=_assistKey(hand,field,optR);
  if(_assistCache&&_assistCacheKey===key) return _assistCache;
  const normals=field.filter(t=>!t.discarded);
  const discards=field.filter(t=> t.discarded);
  let bestNormalTile=null, bestNormalScore=-Infinity;
  normals.forEach(t=>{
    const s=evalHandFull([...hand,t],optR);
    if(s>bestNormalScore){bestNormalScore=s;bestNormalTile=t;}
  });
  let bestDiscardTile=null, bestDiscardScore=-Infinity;
  discards.forEach(t=>{
    const s=evalHandFull([...hand,t],optR);
    if(s>bestDiscardScore){bestDiscardScore=s;bestDiscardTile=t;}
  });
  let discardIdx=-1;
  if(hand.length===6){
    let bestKeep=-Infinity;
    hand.forEach((_,i)=>{
      const s=evalHandFull(hand.filter((_,j)=>j!==i),optR);
      if(s>bestKeep){bestKeep=s;discardIdx=i;}
    });
  }
  const result={bestNormalTile,bestNormalScore,bestDiscardTile,bestDiscardScore,discardIdx};
  _assistCache=result;_assistCacheKey=key;
  return result;
}

// ============================================================
// アシストv2：待ち牌（上がれる牌）・残り枚数・期待点・リーチ・放銃の危険度まで見て判断する
// ============================================================
function tKey(t){return Math.min(t.top,t.bot)+'-'+Math.max(t.top,t.bot);}
// 自分の手牌と、表向きの捨て牌から、見えている牌の枚数を数える（同じ種類の牌は2枚ずつ）
function knownCounts(hand,field){const m={};[...hand,...field.filter(t=>t.discarded)].forEach(t=>{const k=tKey(t);m[k]=(m[k]||0)+1;});return m;}
// 5枚の手牌が上がれる牌の一覧。total は役点＋ぞろ目ボーナス（向きを変えて最も高くなる形）
function waitsOf(hand5,optR,known){
  const out=[];
  for(let a=1;a<=6;a++)for(let b=a;b<=6;b++){
    const h=[...hand5,{top:a,bot:b}].map(t=>({top:t.top,bot:t.bot,flip:false}));let best=null; // 牌のオブジェクトを使い回して速くする
    const fl=[];h.forEach((t,i)=>{if(t.top!==t.bot)fl.push(i);}); // ぞろ目は向きを変えても同じなので、向きを試すのは1枚ずつ違う牌だけ
    for(let m=0;m<(1<<fl.length);m++){
      for(let k=0;k<fl.length;k++)h[fl[k]].flip=!!(m&(1<<k));
      const w=checkWin(h,optR);
      if(w){const total=w.pts+(w.noBonus?0:countZorome(h));if(!best||total>best.total)best={role:w.role,total};}
    }
    if(best)out.push({a,b,role:best.role,total:best.total,left:Math.max(0,2-(known[a+'-'+b]||0))});
  }
  return out;
}
const waitScore=ws=>ws.reduce((x,w)=>x+w.left*(w.total+.5),0);
// 相手のリーチに対する危険度（0〜1）。リーチ後に相手が捨てた牌と同じ種類は安全。ボット対戦のみ（捨てた人の記録があるとき）
function dangerOf(t,G,myIdx){
  const opp=G.players.map((q,i)=>({q,i})).filter(o=>o.i!==myIdx&&o.q.riichi);
  if(!opp.length||G.field.every(x=>x.by===undefined))return 0;
  const k=tKey(t);let unsafe=0;
  opp.forEach(o=>{if(!G.field.some(x=>x.discarded&&x.by===o.i&&x.afterRiichi&&tKey(x)===k))unsafe++;});
  return unsafe/opp.length;
}
let _a2Cache=null,_a2Key='',_assistTok=0;
function calcAssistV2(p,G,optR,myIdx){
  const hand=p.hand,field=G.field;
  const key=hand.map(t=>`${t.top}${t.bot}${t.flip?1:0}`).join(',')+'|'+field.map(t=>`${t.top}${t.bot}${t.discarded?1:0}${t.by===undefined?'':t.by}${t.afterRiichi?'r':''}`).join(',')+'|'+(optR?optR.join(','):'N')+'|'+(p.riichi?1:0)+'|'+G.players.map(q=>q.riichi?1:0).join('');
  if(_a2Cache&&_a2Key===key)return _a2Cache;
  const known=knownCounts(hand,field),res={waits:[],winDiscards:[],options:[],bestIdx:-1,danger:[]};
  if(hand.length===5){
    res.waits=waitsOf(hand,optR,known);
    const wk=new Set(res.waits.map(w=>w.a+'-'+w.b));
    res.winDiscards=field.filter(t=>t.discarded&&wk.has(tKey(t)));
  }else if(hand.length===6){
    hand.forEach((_,i)=>{
      const waits=waitsOf(hand.filter((_,j)=>j!==i),optR,known);
      const dg=dangerOf(hand[i],G,myIdx),sc=waitScore(waits)*(1-.4*dg);
      res.options.push({idx:i,waits,score:sc,danger:dg});
      res.danger[i]=dg;
    });
    const tp=res.options.filter(o=>o.waits.length>0&&o.waits.some(w=>w.left>0));
    if(tp.length){tp.sort((x,y)=>y.score-x.score);res.bestIdx=tp[0].idx;res.best=tp[0];}
    else{ // テンパイできないときは、従来の評価で最もよい牌。放銃が心配なときは、同じくらいの牌から安全な牌を選ぶ
      const base=calcAssist(hand,field,optR).discardIdx;res.bestIdx=base;res.best=null;
      if(res.danger.some(d=>d>0)&&base>=0&&res.danger[base]>0){
        const safe=hand.map((_,i)=>i).filter(i=>res.danger[i]===0);
        if(safe.length){let bi=safe[0],bs=-Infinity;safe.forEach(i=>{const sc=evalHandFull(hand.filter((_,j)=>j!==i),optR);if(sc>bs){bs=sc;bi=i;}});
          const baseSc=evalHandFull(hand.filter((_,j)=>j!==base),optR);if(bs>=baseSc*.85)res.bestIdx=bi;}
      }
    }
  }
  _a2Cache=res;_a2Key=key;return res;
}
const amTile=(a,b,n)=>`<span class="am-tile"><span>${SYM_SVG[a]}</span><span>${SYM_SVG[b]}</span>${n!==undefined?`<i>${n}</i>`:''}</span>`;
function assistInfoHtml(v,p,G){
  const riichiOK=!!G.useRiichi&&!p.riichi;
  const waitsHtml=ws=>ws.filter(w=>w.left>0).sort((x,y)=>y.total-x.total).map(w=>amTile(w.a,w.b,w.left)).join('')||'<b>残り0枚</b>';
  const maxPts=ws=>ws.reduce((m,w)=>Math.max(m,w.total),0);
  if(p.hand.length===6){
    if(v.best){
      const ws=v.best.waits,add=riichiOK?`（リーチなら＋1点）`:'';
      let h=`🎯 赤く光る牌を捨てるとテンパイ！ 待ち：${waitsHtml(ws)} 最大<b>${maxPts(ws)+(p.riichi?1:0)}点</b>${add}`;
      if(riichiOK)h+=`<br>🀄 リーチをすると、上がったとき＋1点です`;
      if(v.danger.some(d=>d>0))h+=`<br>⚠ リーチ中の相手がいます。⚠の牌は、放銃（ロンされる）の危険があります`;
      return h;
    }
    let h=`🎯 赤く光る牌を捨てましょう（まだテンパイではありません）`;
    if(v.danger.some(d=>d>0))h+=`<br>⚠ リーチ中の相手がいます。⚠の牌は危険です`;
    return h;
  }
  if(p.hand.length===5&&v.waits.length){
    const live=v.waits.filter(w=>w.left>0);
    let h=`👀 テンパイ中！ 待ち：${waitsHtml(v.waits)} ${live.length?`最大<b>${maxPts(v.waits)+(p.riichi?1:0)}点</b>`:'（待ち牌が残っていません）'}`;
    const myTurnPick=G.turn===G.players.indexOf(p)&&G.tphase==='pick';
    if(v.winDiscards.length)h+=myTurnPick?`<br>✨ 金色に光る捨て牌を取ると、上がれます！`:`<br>👀 捨て牌に待ち牌があります（青く光る牌）。自分の番で取ると上がれます`;
    else if(myTurnPick)h+=`<br>🀄 場から1枚引いて、待ち牌を狙いましょう`;
    return h;
  }
  return '';
}
function updateAssistInfo(html){
  let el=document.getElementById('assist-info');
  if(!el){el=document.createElement('div');el.id='assist-info';const st=document.getElementById('status');st.parentNode.insertBefore(el,st.nextSibling);}
  el.innerHTML=html||'';el.classList.toggle('on',!!html);
}

  function evalHand(hand, optR) {
  if(hand.length === 6){
    const w = checkWin(hand, optR);
    if(w) return (w.pts + (w.noBonus ? 0 : countZorome(hand))) * 100;
  }
  let best = 0;
  const n = hand.length;
  const lim = Math.min(1 << n, 64);
  for(let m = 0; m < lim; m++){
    const h = hand.map((t,i) => ({...t, flip:!!(m&(1<<i))}));
    best = Math.max(best, scoreProgress(h, optR));
  }
  return best;
}

function scoreProgress(hand, optR){
  const use = r => !optR || optR.includes(r);
  const n = hand.length;
  function rs(moves, pts){ return Math.pow(pts,0.3)/(Math.max(0,moves)*1.5+0.3)*100; }
  let best=0;
  function alignedTo(b){ return hand.filter(t=>eBot(t)===b||eTop(t)===b); }
  function topSet(tiles,b){ return new Set(tiles.map(t=>t.bot===b?t.top:t.bot)); }
  for(let b=1;b<=6;b++){
    const m=alignedTo(b).length;
    best=Math.max(best,rs(n-m,1));
  }
  for(let b=1;b<=6;b++){
    const al=alignedTo(b);
    const tops=topSet(al,b);
    const dups=al.length-tops.size;
    best=Math.max(best,rs(n-al.length+dups,6));
  }
  function maxRun(arr){
    if(!arr.length)return 0;
    let m=1,c=1;
    for(let i=1;i<arr.length;i++){if(arr[i]===arr[i-1]+1){c++;m=Math.max(m,c);}else c=1;}
    return m;
  }
  for(let b1=1;b1<=6;b1++){
    const al1=alignedTo(b1);
    const t1=[...topSet(al1,b1)].sort((a,c)=>a-c);
    const run1=maxRun(t1);
    const need1=Math.max(0,3-run1);
    for(let b2=b1+1;b2<=6;b2++){
      const al2=alignedTo(b2);
      const t2=[...topSet(al2,b2)].sort((a,c)=>a-c);
      const run2=maxRun(t2);
      const need2=Math.max(0,3-run2);
      const both=hand.filter(t=>(eBot(t)===b1||eTop(t)===b1)||(eBot(t)===b2||eTop(t)===b2)).length;
      best=Math.max(best,rs(need1+need2+Math.max(0,n-both),3));
    }
  }
  if(use('三対')){
    const pf={};
    hand.forEach(t=>{const k=`${Math.min(eTop(t),eBot(t))},${Math.max(eTop(t),eBot(t))}`;pf[k]=(pf[k]||0)+1;});
    const pairs=Object.values(pf).filter(v=>v>=2).length;
    best=Math.max(best,rs(Math.max(0,3-pairs),2));
  }
  if(use('三色')){
    let bestM=0;
    for(let a=1;a<=4;a++)for(let b=a+1;b<=5;b++)for(let c=b+1;c<=6;c++){
      const m=hand.filter(t=>[a,b,c].includes(eTop(t))&&[a,b,c].includes(eBot(t))).length;
      bestM=Math.max(bestM,m);
    }
    best=Math.max(best,rs(n-bestM,3));
  }
  if(use('無双')){
    const zt=new Set(hand.filter(t=>eTop(t)===eBot(t)).map(eTop));
    best=Math.max(best,rs(6-zt.size,9));
  }
  if(use('輝光')){
    const zc=hand.filter(t=>eTop(t)===eBot(t)).length;
    best=Math.max(best,rs(n-zc,5));
  }
  return best;
}

// ============================================================

// 勝利

// ============================================================

function isGameOver(players, goal){
  return players.some(p => p.score >= (goal || WIN_SCORE));
}
function processWin(pi,res){
  G.phase='roundEnd';try{assistMarkRound(pi,res);}catch(e){}eventModify(pi,res);const bonus=(res.noBonus?0:countZorome(G.players[pi].hand))+(G.players[pi].riichi?1:0);res.bonus=bonus;G.players[pi].score+=res.pts+bonus;
  saveHistory(makeHistoryEntry(pi===myOnlineIdx,res.role,res.pts+bonus,onlineMode,G.players.map(p=>p.name)));
  if(G.event&&pi===myOnlineIdx)res.evRewards=eventOnWin();
  const _newAch=checkAchievements(pi===myOnlineIdx,{role:res.role,bonus,ron:!!res.ron,riichi:!!G.players[pi].riichi,online:false,diff:(G.players.find(p=>p.isBot)||{}).diff,total:res.pts+bonus});
  if(onlineMode)addPetals(1+(pi===myOnlineIdx?2:0)+_newAch.length*5); else botGamePetals(pi,_newAch.length*5);
  const optR=G?.optRoles??null;
  const tsuideList=[];
  G.players.forEach((p,i)=>{
    if(i===pi)return;
    const tr=checkTsuide(p.hand,G.field,optR,p.riichi);
    if(tr){p.score+=tr.total;tsuideList.push({name:p.name,role:tr.role,pts:tr.pts,bonus:tr.bonus,total:tr.total});}
  });
const _isMyWin=pi===myOnlineIdx;
  const _isGameOver=isGameOver(G.players,G?.goal);
  if(_isMyWin){
    G.players.filter(p=>p.isBot).forEach(b=>{
      setTimeout(()=>addBotChatMsg(b.name,rndComment(_isGameOver?'gamelose':'lose'),false),500);
    });
  } else if(G.players[pi].isBot){
    botComment(_isGameOver?'gamewin':'win');
  }
  tsuideList.forEach(t=>{
    if(!G.players.find(p=>p.name===t.name&&!p.isBot))
      setTimeout(()=>addBotChatMsg(t.name,rndComment('tsuide'),false),700);
  });
  const _fxMsW=showCallFx('win',G.players[pi].name,res.role,fxOfPlayer(G.players[pi]));
  setTimeout(()=>showWinModal(G.players[pi],res,tsuideList),_fxMsW-200);
  if(_newAch.length)setTimeout(()=>showAchievementPopup(_newAch),900);
}

let _pendingBotGameOverTsuide = [];
function showWinModal(p,res,tsuideList=[]){
if(_skipSnd!==(res.ron?'ron':'win'))playSound(res.ron ? 'ron' : 'win');
_skipSnd='';
if(p===G.players[myOnlineIdx])launchConfetti();
_pendingBotGameOverTsuide = tsuideList;
const over=isGameOver(G.players,G?.goal),rows=G.players.map(pl=>`<tr><td>${esc(pl.name)}</td><td>${pl.score}点</td></tr>`).join('');
const tiles=p.hand.map(t=>tileHTML(t,'','tile htile')).join(''),bonus=res.bonus||0,total=res.pts+bonus;

const bLine=bonus>0?`<div style="font-size:.85rem;color:#f5d040;margin-bottom:.6rem">★ 輝きボーナス ×${bonus} = +${bonus}点</div>`:'';
const petalLine=(!onlineMode&&_lastPetalGain>0)?`<div style="font-size:.85rem;color:#ff9ec8;margin:.3rem 0">🌸 花びら +${_lastPetalGain}</div>`:'';_lastPetalGain=0;
const quickLine=G.quickBot?'<div style="font-size:.78rem;color:#8a7048;margin:.4rem 0">🤖 今回の対戦相手は、CPUでした</div>':'';
const evLine=(res.evNotes||[]).map(n=>`<div style="font-size:.85rem;color:#ffa040;margin:.2rem 0">${n}</div>`).join('')+((res.evRewards||[]).length?`<div style="font-size:.88rem;color:#ffd060;margin:.3rem 0">${(EVENTS.find(e=>G.event&&e.id===G.event.id)||{}).icon||'🎁'} イベント報酬：${res.evRewards.map(esc).join('、')}</div>`:'');
const ronLine=res.ron?`<div style="font-size:.85rem;color:#e0a020;margin:.3rem 0">⚡ ロン！（${esc(res.ronFrom||'')} の捨て牌）</div>`:'';
const riichiLine=(res.bonus>0&&p.riichi)?`<div style="font-size:.82rem;color:#f5d040">🀄 リーチボーナス +1点含む</div>`:'';

const _wTitle=p.isBot?(BOT_TITLE_BY_DIFF[p.diff]||''):myTitleId();
document.getElementById('mbox').innerHTML=`<div class="mtitle">${p.isBot?'🤖':'🎆'} 上がり！</div>${titleBadgeHtml(_wTitle)}<p style="color:#8a7860;font-size:.92rem;margin-bottom:.2rem">${esc(p.name)} が役を完成</p><div class="mrole">${res.role}</div><div class="mpts">役: +${res.pts}点</div>${bLine}${ronLine}${petalLine}${evLine}${quickLine}${riichiLine}<div class="mhand">${tiles}</div><table class="mscores">${rows}</table>${over?`<button class="mbtn" onclick="showGameOver()">ゲーム終了を確認 →</button>`:`<button class="mbtn" onclick="doNextRound()">次のラウンドへ →</button>`}`;

document.getElementById('modal').classList.add('open');

}

function showGameOver(){const tsuideList=_pendingBotGameOverTsuide||[];const winner=G.players.reduce((a,b)=>a.score>b.score?a:b),rows=G.players.map(p=>`<tr><td>${esc(p.name)}</td><td>${p.score}点</td></tr>`).join('');document.getElementById('mbox').innerHTML=`<div class="mtitle">🏆 ゲーム終了！</div><div style="font-size:1.5rem;color:#f5e0a0;margin:.5rem 0;font-family:'Hiragino Mincho ProN','Yu Mincho',serif">${esc(winner.name)} の勝利！</div><table class="mscores">${rows}</table>
${tsuideList.length>0?`
<div style="margin:.6rem 0 .3rem;font-size:.78rem;color:#8a7048;border-top:1px solid #2a1e10;padding-top:.5rem">✨ ついでに完成</div>
${tsuideList.map(t=>`<div style="font-size:.82rem;color:#e8c97a;margin:.2rem 0">${esc(t.name)}：${t.role}（${t.pts}点${t.bonus>0?'＋★×'+t.bonus:''}）→ +${t.total}点</div>`).join('')}`:''}
<button class="mbtn" onclick="doRematchBot()"
style="background:linear-gradient(135deg,#2a9e8e,#1a6e60);color:#e0fff8;margin-bottom:.5rem">🔄 リマッチ</button><button class="mbtn" onclick="goLobby()" style="background:#2a1e14;color:#c9a84c;border:1px solid #5a4020">🏠 タイトルへ戻る</button>`;}
function doNextRound(){document.getElementById('modal').classList.remove('open');clearRonWindow();showRiichiBtn(false);dealRound();eventNewRound();G.players.forEach(p=>p.riichi=false);render();if(G.players[G.turn].isBot)scheduleBot();}
function doRematchBot(){
  document.getElementById('modal').classList.remove('open');
  clearRonWindow();showRiichiBtn(false);
  G.players.forEach(p=>{p.score=0;p.riichi=false;});
  dealRound();eventNewRound();
  render();
  if(G.players[G.turn].isBot)scheduleBot();
}
function requestRematch(){
  const btn=document.getElementById('btn-rematch-online');
  const st=document.getElementById('rematch-status');
  if(btn)btn.disabled=true;
  if(st)st.textContent='⏳ 相手の返答を待っています...';
  socket?.emit('rematch_request',{code:currentCode});
}
function goLobby(){
  document.getElementById('modal').classList.remove('open');
  document.getElementById('chat-toggle').style.display='none';
  clearRonWindow();showRiichiBtn(false);showRonBtn(false);
  document.getElementById('bot-chat-toggle').style.display='none';
  document.getElementById('bot-chat-wrap').style.display='none';
  botChatOpen=false;
  document.getElementById('chat-wrap').style.display='none';
  chatOpen=false;
  onlineMode=false;
  socket?.disconnect();
  socket=null;
  G=null;
  showScreen('lobby');
  updatePetalDisplays();
}

// ============================================================

// 対戦履歴

// ============================================================

let customAvatarUrl = localStorage.getItem('rikka_avatar') || '';
function myGiconId(){try{const st=loadGachaState(),id=st.equipped.gicon;return(id&&st.owned.includes(id))?id:'';}catch(e){return '';}}
function myAvatarUrl(){const g=myGiconId();return g?'gicon:'+g:(customAvatarUrl||(gUser&&gUser.avatar)||'');}
// 画面に出す用：ガチャのアイコン（gicon:ID）は、その場で動く画像にする
function avatarSrc(url){
  const m=typeof url==='string'&&/^gicon:([a-z0-9_]{1,30})$/.exec(url);
  if(m)return GACHA_ITEMS.some(x=>x.category==='gicon'&&x.id===m[1])?giconUri(m[1]):'';
  return sanitizeFieldBgUrl(url||'');
}
function myAvatarDisplaySrc(){const g=myGiconId();return g?giconUri(g):(customAvatarUrl||(gUser&&gUser.avatar)||'');}
// 対戦画面に出すアイコン<img>。httpsのURLだけ通し、読み込めなければ非表示にする
function avatarImgHtml(url,cls){
  const safe=avatarSrc(url);
  return safe?`<img class="${cls}" src="${esc(safe)}" alt="" onerror="this.style.display='none'">`:'';
}
function myTitleId(){
  try{const st=loadGachaState(),id=st.equipped.title;return(id&&st.owned.includes(id))?id:'';}catch(e){return '';}
}
function syncMyTitle(){if(currentCode)socket?.emit('set_title',{code:currentCode,id:myTitleId()});}
// 称号のバッジ（上がったときの画面などで名前の上に出す）
function titleBadgeHtml(id){
  const it=id&&GACHA_ITEMS.find(x=>x.category==='title'&&x.id===id);
  return it?`<div class="win-title">${it.icon} ${esc(it.title)}</div>`:'';
}
// ボットにも強さに応じた称号を付ける
const BOT_TITLE_BY_DIFF={easy:'title_first',normal:'title_apprentice',hard:'title_rikka'};
function syncMyAvatar(){if(currentCode)socket?.emit('set_avatar',{code:currentCode,url:myAvatarUrl()});}
let currentStatsTab = 'bot';

function makeHistoryEntry(won,role,pts,online,players){
  return{date:new Date().toLocaleDateString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}),won,role:won?role:null,pts:won?pts:null,online,players};
}
function saveHistory(entry){
  try{missionRound(entry);}catch(e){}
  const h=JSON.parse(localStorage.getItem('rikka_history')||'[]');
  h.unshift(entry);if(h.length>30)h.length=30;
  localStorage.setItem('rikka_history',JSON.stringify(h));
}
