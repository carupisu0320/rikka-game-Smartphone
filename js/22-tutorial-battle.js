// =====================================================================
//  実戦チュートリアル（はじめての対局）
//  ・本物の対局画面で、案内役「リッカ」が話しながら、光った場所をタップして進めます（台本どおりの配牌・相手の動き）
//  ・1局目：牌を引く → 上下反転 → 上がる（一色）／2局目：捨てる → 相手の捨て牌でロン
//  ・最後に、カスタマイズ画面（牌の裏柄・場の背景・演出・プロフィール）の使い方を、実際の画面で案内します
//  ・この対局は、戦績・実績・花びらに数えません（クリアしたときの、ごほうび花びらだけ、1回だけ）
//  ・既存の関数（pickField など）を外から包み、チュートリアル中だけ、決まった操作だけを通します。※ 22 は、03・09・10 より後に読み込みます
//  ★ 台本（配牌・場）を変えたら、tests/tutorial-battle.test.js が、役が正しく成立するかを確かめます
// =====================================================================
const TB_REWARD_PETALS=20;               // クリアしたときの、ごほうび（花びら）。0 にすると、ごほうびなし
const TB_DONE_KEY='rikka_tut_battle_done';
const TB_GUIDE_NAME='リッカ';
const TB_OPP_NAME='練習相手';

// 台本：hand＝あなたの手牌／field＝場の伏せ牌（上から順）／pickIdx＝引かせる牌の場所／bot＝相手の手牌
// [上,下]。1局目は、[3,6] を引いて上下反転すると [6,3] になり、下がすべて3＝一色。2局目は、[4,6] は使えず、相手が捨てる [5,5] でロン（一色＋★2）
const TB_STAGES=[
  {hand:[[1,3],[2,3],[4,3],[5,3],[6,3]],
   field:[[5,2],[1,6],[4,4],[2,1],[3,6],[6,2],[1,4],[3,5],[2,6],[4,1]], pickIdx:4,
   bot:[[1,1],[2,2],[3,3],[4,4],[6,6]]},
  {hand:[[1,5],[2,5],[3,5],[5,5],[6,5]],
   field:[[3,1],[1,3],[6,4],[4,6],[2,3],[1,2],[3,6],[6,1],[4,2],[2,6]], pickIdx:3,
   bot:[[5,5],[1,1],[3,4],[2,2],[6,3]], botPickIdx:8, botDiscard:[5,5]}
];

const TB={active:false,i:-1,steps:[],step:null,typing:null,raf:0,hidden:false,timer:0,result:null,wrapped:false,typed:true};

// ───────── 見た目 ─────────
(function(){
  try{
    if(document.getElementById('tb-css'))return;
    const st=document.createElement('style');st.id='tb-css';
    st.textContent=`
#tb-layer{position:fixed;inset:0;z-index:3000;pointer-events:none}
#tb-layer .tb-blk{position:fixed;background:rgba(6,4,2,.74);pointer-events:auto}
#tb-layer .tb-cover{position:fixed;background:transparent;pointer-events:auto}
#tb-ring{position:fixed;border:2px solid #f5d040;border-radius:12px;box-shadow:0 0 0 2px rgba(245,208,64,.22),0 0 18px 4px rgba(245,208,64,.5);pointer-events:none;animation:tbPulse 1.3s ease-in-out infinite}
@keyframes tbPulse{0%,100%{opacity:.72}50%{opacity:1}}
#tb-hand{position:fixed;font-size:2rem;line-height:1;pointer-events:none;animation:tbPoint .9s ease-in-out infinite;filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))}
@keyframes tbPoint{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
body.calm-fx #tb-ring,body.calm-fx #tb-hand{animation:none}
#tb-dialog{position:fixed;left:10px;right:10px;max-width:520px;margin:0 auto;pointer-events:auto;background:linear-gradient(180deg,#2a1e12,#150e08);border:1.5px solid #c9a84c;border-radius:14px;padding:.65rem .85rem .75rem;color:#f0e0b8;box-shadow:0 8px 28px rgba(0,0,0,.65)}
#tb-dialog.top{top:calc(env(safe-area-inset-top,0px) + 10px)}
#tb-dialog.bot{bottom:calc(env(safe-area-inset-bottom,0px) + 12px)}
#tb-dialog.shake{animation:tbShake .35s}
@keyframes tbShake{0%,100%{transform:none}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.tb-head{display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem}
.tb-av{width:34px;height:34px;border-radius:50%;background:#3a2a18;border:1.5px solid #c9a84c;padding:4px;flex:none;box-sizing:border-box}.tb-av svg{width:100%;height:100%;display:block}
.tb-name{font-size:.82rem;color:#e8c870;font-weight:700;letter-spacing:.08em}
.tb-step{margin-left:auto;font-size:.66rem;color:#8a7048}
.tb-skip{background:none;border:0;color:#8a7048;font-size:.72rem;cursor:pointer;margin-left:.4rem;padding:.25rem;font-family:inherit}
#tb-text{font-size:.92rem;line-height:1.75;min-height:2.6em;white-space:normal}
#tb-text b{color:#f5d040}
.tb-foot{display:flex;align-items:center;justify-content:flex-end;margin-top:.4rem;min-height:1.8rem}
.tb-hint{font-size:.74rem;color:#c9a870;margin-right:auto}
#tb-next{background:linear-gradient(135deg,#c9a84c,#a8832e);color:#1a1008;border:0;border-radius:8px;padding:.4rem 1.1rem;font-weight:700;font-family:inherit;font-size:.86rem;cursor:pointer}
.tut-battle-btn{display:block;width:100%;box-sizing:border-box;margin:.2rem 0 .7rem;padding:.7rem;border-radius:12px;border:1.5px solid #c9a84c;background:linear-gradient(135deg,#4a3410,#2a1c08);color:#f5d870;font-weight:700;font-family:inherit;font-size:.95rem;cursor:pointer}
.tut-battle-btn small{display:block;font-weight:400;font-size:.7rem;color:#c9a870;margin-top:.15rem}
`;
    document.head.appendChild(st);
  }catch(e){}
})();

// ───────── 台本（ステップ） ─────────
// say：話す内容（**太字**／\n で改行。関数でもよい）／target：光らせる場所（セレクタか関数）／wait：待つ操作（省略＝「次へ」）／free：光った場所を自由に触らせる
function tbSteps(){
  const S1=TB_STAGES[0],S2=TB_STAGES[1];
  const tile=i=>()=>document.querySelectorAll('#hand-tiles .htile')[i]||null;
  const field=k=>()=>document.querySelectorAll('#field-grid .fback')[k]||null;
  const result=()=>{const r=TB.result;if(!r)return '';
    return `**${r.kind==='ron'?'ロン！':'上がり！'}** 役は**「${r.role}」${r.pts}点**`+(r.bonus?`＋**★ボーナス${r.bonus}点**`:'')+` ＝ **${r.total}点**！\n`+
      (r.kind==='ron'?'ふだんの対局では、ロンで得た点は、牌を捨てた相手から奪えるよ。':'★は、上下が同じ数の牌。持っているほど、ボーナスが付くよ。');};
  return [
    // ── 1局目：引く・上下反転・上がる ──
    {say:'ようこそ！わたしは案内役の**リッカ**。\nさっそく、本物の対局画面で、1局いっしょに遊んでみよう。',enter:()=>tbBeginStage(0)},
    {say:'ここが**対戦相手**。手牌の枚数が見えるよ。',target:'#opp-area'},
    {say:'真ん中が**場**。伏せてある牌から1枚引けるよ。\n相手が捨てた牌（表向き）も、引いていいんだ。',target:'#field-wrap'},
    {say:'下があなたの**手牌**。いまは5枚。\n牌には、**上と下**、2つの数字があるよ。',target:'#hand-area'},
    {say:'目標は「役」を作ること。いまの手牌は、**下の数字が全部「3」**。\nあと1枚、下が3の牌を集めれば、役**「一色」**の完成だよ！',target:'#hand-tiles'},
    {say:'まずは、場から**1枚引いてみよう**。\n光っている牌を、タップ！',target:field(S1.pickIdx),wait:'pick',fi:S1.pickIdx},
    {say:'引いた牌は「上3・下6」。下が3じゃないから、このままだと役にならない…。',target:tile(5)},
    {say:'そんなときは、牌を**上下反転**できる！\nまず、引いた牌を**タップして選ぼう**。',target:tile(5),wait:'select',idx:5},
    {say:'**「↕ 上下反転」**を押そう！',target:'.flip-popup-btn',wait:'flip'},
    {say:'下が3になった！6枚とも、下が「3」。\n役**「一色」**の完成だよ。',target:'#hand-tiles'},
    {say:'役が揃ったら、**「上がる！」**を押して、勝負を決めよう！',target:'#btn-win',wait:'win'},
    {say:result},
    // ── 2局目：捨てる・ロン ──
    {say:'つぎは**「捨てる」と「ロン」**。もう1局、いってみよう！',enter:()=>tbBeginStage(1)},
    {say:'今回の手牌は、**下が全部「5」**。あと1枚で、一色になるよ。',target:'#hand-tiles'},
    {say:'場から、1枚引こう。',target:field(S2.pickIdx),wait:'pick',fi:S2.pickIdx},
    {say:'引いたのは「上4・下6」。これは使えない…。\n役が揃わないときは、いらない牌を**1枚捨てて、5枚に戻す**んだ。',target:tile(5)},
    {say:'捨てる牌を、**タップして選ぼう**。',target:tile(5),wait:'select',idx:5},
    {say:'**「捨てる」**を押そう！',target:'#btn-discard',wait:'discard'},
    {say:'相手の番だよ。どうするかな…',target:'#opp-area',wait:'bot',enter:()=>tbBotScript()},
    {say:'あっ、相手が**「5・5」**を捨てた！この牌を使うと、あなたの手牌が完成する！\n他の人が捨てた牌で上がるのが**「ロン」**。**「ロン！」**を押そう！',target:'#ron-btn',wait:'ron'},
    {say:result},
    {say:'これで基本はバッチリ！役は、ほかにも**三連・三対・輝光・無双・六華**などがあるよ。\nくわしくは、いつでも**ルールブック**で見られるから、確認してね。',target:'.rule-tile'},
    // ── カスタマイズの使い方 ──
    {say:'最後に、あなた好みに変えられる**「カスタマイズ」**を紹介するよ！',enter:()=>tbToLobby()},
    {say:'まず、左上の**メニュー（☰）**をタップ！',target:'#menu-btn',wait:'sidebar'},
    {say:'**「🎨 カスタマイズ」**をタップしよう。',target:'#sidebar .sb-custom-btn',wait:'custom'},
    {say:'ここがカスタマイズ画面。上の**タブ**で、変えるものを選ぶよ。\n牌の裏柄・場の背景・紙吹雪・称号・アイコン・演出・プロフィール。',target:'.custom-tabs'},
    {say:'いまは**「牌の裏柄」**。気に入ったものを**タップ**すると、すぐ変わるよ！\n**✔**がついているのが、いま使っているもの。**🔒**のものは、ガチャで手に入るんだ。\nためしに、好きなものを、タップしてみよう！',target:'#custom-body',free:true},
    {say:'つぎは**「場の背景」**のタブを、タップ！',target:'#custom-tab-bg',wait:'tab:bg'},
    {say:'場の背景も、タップで選べるよ。\nあなたの番になると、場に、選んだ背景が出る。動く背景もあるんだ。',target:'#custom-body',free:true},
    {say:'**「演出」**のタブも、タップしてみよう！',target:'#custom-tab-fx',wait:'tab:fx'},
    {say:'リーチ・ロン・上がりの演出を選べるよ。タップすると、見本が流れる。\n**相手の画面にも、あなたの選んだ演出が出る**んだ！',target:'#custom-body',free:true},
    {say:'**「プロフィール」**では、名前とアイコンを変えられるよ。タップしてみよう！',target:'#custom-tab-icon',wait:'tab:icon'},
    {say:'景品は、ロビーの**ガチャ**で、**花びら🌸**を使って引けるよ。\n花びらは、対局に遊ぶと貯まる。気に入った景品を集めて、あなたの六華を飾ってね！'},
    {say:'それじゃ、カスタマイズを閉じよう。**「✕」**をタップ！',target:'.custom-close',wait:'custom-close'},
    {say:()=>TB.reward?`おつかれさま！チュートリアルは**完了**だよ。\n🎁 ごほうびに、**花びら🌸${TB.reward}枚**をプレゼント！`:'おつかれさま！チュートリアルは**完了**だよ。\nわからないことは、いつでも「📖 チュートリアル」から見返してね。',enter:()=>tbGrantReward(),last:true}
  ];
}

// ───────── 対局の準備（台本どおりの配牌） ─────────
function tbMakeG(n){
  const s=TB_STAGES[n];let id=100*(n+1);
  const mk=([t,b])=>({id:id++,top:t,bot:b,flip:false,discarded:false});
  const nm=(document.getElementById('pname')&&document.getElementById('pname').value.trim())||'プレイヤー';
  const me={name:nm,hand:s.hand.map(mk),score:0,isBot:false,riichi:false};
  const bot={name:TB_OPP_NAME,hand:s.bot.map(mk),score:0,isBot:true,diff:'easy',riichi:false,fieldBg:'',avatar:''};
  return {players:[me,bot],field:s.field.map(mk),turn:0,tphase:'pick',selIdx:-1,phase:'playing',optRoles:[],useRiichi:false,useRon:false,goal:3,tutorial:true,_rk:1,_gid:1};
}
function tbBeginStage(n){
  try{clearRonWindow();showRonBtn(false);showRiichiBtn(false);}catch(e){}
  G=tbMakeG(n);myOnlineIdx=0;onlineMode=false;currentCode='';
  try{_prevTurnMine=true;_turnCuePending=false;}catch(e){}  // 「あなたの番です」の演出は、出さない
  try{document.getElementById('bot-chat-toggle').style.display='none';document.getElementById('bot-chat-wrap').style.display='none';}catch(e){}
  showScreen('game');try{updateFieldBgForTurn();}catch(e){}render();
  try{setTimeout(animateFieldTiles,50);}catch(e){}
}
// 相手の番（台本どおり：1枚引いて、決まった牌を捨てる）。そのあと、ロンのボタンを出す
function tbBotScript(){
  const s=TB_STAGES[1];
  TB.timer=setTimeout(()=>{ if(!TB.active||!G)return;
    const bot=G.players[1];bot.hand.push(G.field.splice(s.botPickIdx,1)[0]);playSound('pick');G.tphase='discard';render();
    TB.timer=setTimeout(()=>{ if(!TB.active||!G)return;
      const di=bot.hand.findIndex(t=>t.top===s.botDiscard[0]&&t.bot===s.botDiscard[1]);
      const t=bot.hand.splice(di,1)[0];t.discarded=true;t.by=1;bot.lastDiscardId=t.id;G.field.push(t);playSound('discard');render();
      _ronPending={tile:t,discardedByIdx:1};showRonBtn(true);   // 台本では、時間切れにしない
      TB.timer=setTimeout(()=>tbAdvance(),700);
    },1100);
  },1100);
}
function tbToLobby(){try{goLobby();}catch(e){G=null;showScreen('lobby');}}

// 上がり・ロン（戦績には数えない）
function tbOnWin(kind){
  if(!G||G.phase!=='playing')return;
  const p=G.players[0],optR=G.optRoles||[];let res=null;
  if(kind==='ron'){const rp=_ronPending;if(!rp)return;const f=findRonWin(p.hand,rp.tile,optR);if(!f)return;res=f.res;p.hand=f.hand;}
  else{if(p.hand.length!==6)return;res=checkWin(p.hand,optR);}
  if(!res)return;
  try{clearRonWindow();}catch(e){}
  G.phase='roundEnd';render();
  const bonus=res.noBonus?0:countZorome(p.hand);
  TB.result={kind,role:res.role,pts:res.pts,bonus,total:res.pts+bonus};
  playSound('win');try{launchConfetti();}catch(e){}
  let ms=2000;try{const m=showCallFx(kind,p.name,kind==='ron'?'相手の牌':'',(typeof fxOfPlayer==='function')?fxOfPlayer(p):undefined);if(m>0)ms=m;}catch(e){}
  tbHide(true);TB.timer=setTimeout(()=>{tbHide(false);tbAdvance();},Math.max(1200,ms-150));
}
function tbGrantReward(){
  TB.reward=0;
  try{if(!localStorage.getItem(TB_DONE_KEY)&&TB_REWARD_PETALS>0){addPetals(TB_REWARD_PETALS);TB.reward=TB_REWARD_PETALS;}localStorage.setItem(TB_DONE_KEY,'1');}catch(e){}
  try{updatePetalDisplays();}catch(e){}
}

// ───────── ステップを進める ─────────
function tbGo(i){
  TB.i=i;const st=TB.steps[i];
  if(!st){tbExit(true);return;}
  TB.step=st;TB.hidden=false;
  if(st.enter){try{st.enter();}catch(e){}}
  if(!TB.active)return;
  tbShow(st);
}
function tbAdvance(){if(TB.active)tbGo(TB.i+1);}
function tbEvent(name){const st=TB.step;if(!TB.active||!st||(st.wait||'next')!==name)return;tbAdvance();}
function tbNudge(){const d=document.getElementById('tb-dialog');if(!d)return;d.classList.remove('shake');void d.offsetWidth;d.classList.add('shake');
  const h=document.getElementById('tb-hint');if(h)h.textContent='👆 光っているところを、タップしてね';}

// ───────── 画面（暗くして、1か所だけ光らせる） ─────────
function tbMakeLayer(){
  tbRemoveLayer();
  const L=document.createElement('div');L.id='tb-layer';
  L.innerHTML=`<div class="tb-blk" id="tb-b1"></div><div class="tb-blk" id="tb-b2"></div><div class="tb-blk" id="tb-b3"></div><div class="tb-blk" id="tb-b4"></div><div class="tb-cover" id="tb-b5"></div>`+
    `<div id="tb-ring"></div><div id="tb-hand">👆</div>`+
    `<div id="tb-dialog" class="bot" role="dialog"><div class="tb-head"><div class="tb-av">${(typeof SYM_SVG!=='undefined'&&SYM_SVG[6])||''}</div><div class="tb-name">${esc(TB_GUIDE_NAME)}</div><div class="tb-step" id="tb-stepno"></div><button class="tb-skip" onclick="tbSkip()">スキップ ✕</button></div>`+
    `<div id="tb-text" onclick="tbFinishTyping()"></div><div class="tb-foot"><span class="tb-hint" id="tb-hint"></span><button id="tb-next" onclick="tbNextClick()">次へ ▶</button></div></div>`;
  // この枠の中の操作は、ゲーム本体に伝えない（本体は、牌以外をタップすると、選んだ牌の選択を外すため）
  ['click','mousedown','mouseup','pointerdown','pointerup','touchstart','touchend'].forEach(t=>L.addEventListener(t,e=>e.stopPropagation()));
  document.body.appendChild(L);
}
function tbRemoveLayer(){const L=document.getElementById('tb-layer');if(L)L.remove();}
function tbHide(h){TB.hidden=h;const L=document.getElementById('tb-layer');if(L)L.style.display=h?'none':'';}

function tbParse(t){const out=[];let b=false;String(t).split('**').forEach((seg,i)=>{if(i)b=!b;for(const c of seg)out.push({c,b});});return out;}
function tbHtml(chars,n){let h='',cur=false;chars.slice(0,n).forEach(({c,b})=>{if(b!==cur){h+=b?'<b>':'</b>';cur=b;}h+=c==='\n'?'<br>':esc(c);});if(cur)h+='</b>';return h;}
function tbReduce(){try{return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){return false;}}
function tbShow(st){
  const txt=typeof st.say==='function'?st.say():st.say,chars=tbParse(txt),el=document.getElementById('tb-text');if(!el)return;
  clearInterval(TB.typing);TB.chars=chars;TB.typed=false;
  const done=()=>{clearInterval(TB.typing);TB.typed=true;el.innerHTML=tbHtml(chars,chars.length);};
  TB.finishTyping=done;
  if(tbReduce()||chars.length<2)done();else{let n=0;TB.typing=setInterval(()=>{n+=1;if(n>=chars.length)done();else el.innerHTML=tbHtml(chars,n);},26);}
  const w=st.wait||'next',needNext=(w==='next'||st.free);
  document.getElementById('tb-next').style.display=needNext?'':'none';
  const hint=document.getElementById('tb-hint');if(hint)hint.textContent=st.free?'ためしに、触ってみよう':(needNext?'':(w==='bot'?'':'👆 光っているところを、タップ'));
  document.getElementById('tb-stepno').textContent=`${Math.min(TB.i+1,TB.steps.length)} / ${TB.steps.length}`;
  tbLayout();
}
function tbFinishTyping(){if(!TB.typed&&TB.finishTyping)TB.finishTyping();}
function tbNextClick(){if(!TB.typed){tbFinishTyping();return;}const st=TB.step;if(st&&((st.wait||'next')==='next'||st.free)){if(st.last){tbExit(true);}else tbAdvance();}}
function tbSkip(){if(typeof confirm==='function'&&!confirm('チュートリアルをやめますか？'))return;tbExit(false);}

// 光らせる要素を探す
function tbEl(t){try{const el=typeof t==='function'?t():(t?document.querySelector(t):null);return el&&el.isConnected?el:null;}catch(e){return null;}}
// 画面に見えている部分の四角（スクロールする枠・はみ出しを隠す枠の外は、含めない）
function tbClip(el,r){
  let L=r.left,T=r.top,R=r.right,B=r.bottom,abs=false;
  // 固定表示（position:fixed）の部品は、まわりの枠で切り取られない。絶対位置（absolute）の部品は、位置を決める親より内側の枠でだけ切り取られる
  const cs0=getComputedStyle(el);if(cs0.position==='fixed')return {left:L,top:T,right:R,bottom:B,width:R-L,height:B-T};
  abs=cs0.position==='absolute';
  for(let a=el.parentElement,n=0;a&&a!==document.body&&n<12;a=a.parentElement,n++){
    const cs=getComputedStyle(a);
    const clips=/(auto|scroll|hidden|clip)/.test(cs.overflowX+' '+cs.overflowY);
    if(clips&&!(abs&&cs.position==='static')){const q=a.getBoundingClientRect();L=Math.max(L,q.left);T=Math.max(T,q.top);R=Math.min(R,q.right);B=Math.min(B,q.bottom);}
    if(abs&&cs.position!=='static')abs=false;   // 位置を決める親に着いた
    if(cs.position==='fixed')break;
  }
  return {left:L,top:T,right:R,bottom:B,width:R-L,height:B-T};
}
function tbRect(t){
  try{const el=tbEl(t);if(!el)return null;
    const r0=el.getBoundingClientRect();if(r0.width<2||r0.height<2)return null;const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return null;
    const r=tbClip(el,r0);
    // 枠からはみ出して一部が隠れているときは、見える位置までスクロールする（幅の狭い端末で、6枚目の牌が隠れるため）
    if((r0.width-r.width>4||r0.height-r.height>4)&&Date.now()-(TB.scrolledAt||0)>350){TB.scrolledAt=Date.now();try{el.scrollIntoView({block:'nearest',inline:'center'});}catch(e){}}
    if(r.width<2||r.height<2)return null;return r;}catch(e){return null;}
}
function tbLayout(){
  const st=TB.step;if(!TB.active||!st||TB.hidden)return;
  const W=innerWidth,H=innerHeight,r=st.target?tbRect(st.target):null,w=st.wait||'next';
  const S=(id,x,y,ww,hh,show=true)=>{const e=document.getElementById(id);if(!e)return;e.style.display=show?'block':'none';e.style.left=x+'px';e.style.top=y+'px';e.style.width=Math.max(0,ww)+'px';e.style.height=Math.max(0,hh)+'px';};
  const ring=document.getElementById('tb-ring'),hand=document.getElementById('tb-hand'),dlg=document.getElementById('tb-dialog');
  if(!r){S('tb-b1',0,0,W,H);['tb-b2','tb-b3','tb-b4','tb-b5'].forEach(id=>S(id,0,0,0,0,false));ring.style.display='none';hand.style.display='none';dlg.className='bot';return;}
  const pad=st.pad!=null?st.pad:6,x=Math.max(0,r.left-pad),y=Math.max(0,r.top-pad),x2=Math.min(W,r.right+pad),y2=Math.min(H,r.bottom+pad);
  S('tb-b1',0,0,W,y);S('tb-b2',0,y2,W,H-y2);S('tb-b3',0,y,x,y2-y);S('tb-b4',x2,y,W-x2,y2-y);
  const pass=(w!=='next'&&w!=='bot')||!!st.free;
  S('tb-b5',x,y,x2-x,y2-y,!pass);
  ring.style.display='block';ring.style.left=x+'px';ring.style.top=y+'px';ring.style.width=(x2-x)+'px';ring.style.height=(y2-y)+'px';
  const low=(y+y2)/2>H*.5;dlg.className=low?'top':'bot';
  const showHand=pass&&!st.free;hand.style.display=showHand?'block':'none';
  if(showHand){hand.textContent=low?'👇':'👆';hand.style.left=((x+x2)/2-16)+'px';hand.style.top=(low?Math.max(4,y-40):Math.min(H-40,y2+4))+'px';}
}
function tbFrame(){if(!TB.active)return;TB.raf=requestAnimationFrame(tbFrame);tbLayout();}

// ───────── 開始・終了 ─────────
function tbUpdateEntry(){
  const done=(()=>{try{return !!localStorage.getItem(TB_DONE_KEY);}catch(e){return false;}})();
  const sub=done?'クリア済み（もう一度、練習できます）':(TB_REWARD_PETALS>0?`🎁 クリアで花びら🌸${TB_REWARD_PETALS}枚`:'本物の対局画面で、遊びながら覚えよう');
  document.querySelectorAll('.tut-battle-btn').forEach(b=>{b.innerHTML=`⚔ はじめての対局（実戦チュートリアル）<small>${sub}</small>`;});
}
function startTutorialBattle(){
  if(TB.active)return;
  if(G||onlineMode){try{toast('対局中は、始められません');}catch(e){}return;}
  try{closeSidebar();closeCustomize();}catch(e){}
  tbWrap();
  TB.active=true;TB.steps=tbSteps();TB.result=null;TB.reward=0;TB.hidden=false;
  tbMakeLayer();tbGo(0);
  cancelAnimationFrame(TB.raf);TB.raf=requestAnimationFrame(tbFrame);
}
function tbExit(finished){
  if(!TB.active)return;
  TB.active=false;cancelAnimationFrame(TB.raf);clearInterval(TB.typing);clearTimeout(TB.timer);tbRemoveLayer();
  if(G&&G.tutorial){tbToLobby();}else{try{closeCustomize();closeSidebar();}catch(e){}}
  tbUpdateEntry();
}

// ───────── 既存の操作を、チュートリアル中だけ、台本どおりに通す ─────────
function tbWrap(){
  if(TB.wrapped)return;TB.wrapped=true;
  const W=(name,make)=>{const o=window[name];if(typeof o!=='function')return;window[name]=make(o);};
  const need=(w,extra)=>{const st=TB.step;return !!(st&&(st.wait||'next')===w&&(!extra||extra(st)));};
  W('pickField',o=>function(fi){if(!TB.active||!G||!G.tutorial)return o.apply(this,arguments);if(!need('pick',st=>Number(fi)===st.fi)){tbNudge();return;}const r=o.apply(this,arguments);tbEvent('pick');return r;});
  W('clickHand',o=>function(i){if(!TB.active||!G||!G.tutorial)return o.apply(this,arguments);if(!need('select',st=>Number(i)===st.idx)){tbNudge();return;}const r=o.apply(this,arguments);tbEvent('select');return r;});
  W('doFlipSelected',o=>function(){if(!TB.active||!G||!G.tutorial)return o.apply(this,arguments);if(!need('flip')||G.selIdx<0){tbNudge();return;}const r=o.apply(this,arguments);tbEvent('flip');return r;});
  W('doDiscard',o=>function(){if(!TB.active||!G||!G.tutorial)return o.apply(this,arguments);if(!need('discard')){tbNudge();return;}const r=o.apply(this,arguments);tbEvent('discard');return r;});
  W('doWin',o=>function(){if(!TB.active||!G||!G.tutorial)return o.apply(this,arguments);if(!need('win')){tbNudge();return;}tbOnWin('win');});
  W('declareRon',o=>function(){if(!TB.active||!G||!G.tutorial)return o.apply(this,arguments);if(!need('ron')){tbNudge();return;}tbOnWin('ron');});
  W('scheduleBot',o=>function(){if(G&&G.tutorial)return;return o.apply(this,arguments);});   // 相手は、台本で動かす
  W('runBot',o=>function(){if(G&&G.tutorial)return;return o.apply(this,arguments);});
  W('openSidebar',o=>function(){const r=o.apply(this,arguments);tbEvent('sidebar');return r;});
  W('openCustomize',o=>function(){const r=o.apply(this,arguments);tbEvent('custom');return r;});
  W('switchCustomizeTab',o=>function(t){const r=o.apply(this,arguments);tbEvent('tab:'+t);return r;});
  W('closeCustomize',o=>function(){const r=o.apply(this,arguments);tbEvent('custom-close');return r;});
}

document.addEventListener('DOMContentLoaded',()=>{try{tbUpdateEntry();}catch(e){}});
window.addEventListener('load',()=>{try{tbUpdateEntry();}catch(e){}});
