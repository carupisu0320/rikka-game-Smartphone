
// ============================================================

// 定数

// ============================================================

const BNAMES=['AIさくら','AIあおい','AIひなた','AIつばき'];

const WIN_SCORE=10;

const SERVER_URL = 'https://rikka-game.onrender.com';
fetch(SERVER_URL).catch(()=>{});
  // ページ読み込み時にサーバーをウォームアップ
// ============================================================

// Google認証

// ============================================================

let gUser={id:'',name:'',avatar:'',email:''};

function onGoogleLogin(response){

const base64=response.credential.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');

const payload=JSON.parse(decodeURIComponent(atob(base64).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join('')));

gUser={id:payload.sub,name:payload.name||payload.given_name||'プレイヤー',avatar:payload.picture||'',email:payload.email||''};
applyLobbyEvent();

const savedName=localStorage.getItem('rikka_name_'+gUser.id);

const displayName=savedName||gUser.name;

document.getElementById('pname').value=displayName;

document.getElementById('google-login-area').style.display='none';

const ui=document.getElementById('google-user-info');

ui.style.display='flex';

// アバター

if(gUser.avatar){

document.getElementById('google-avatar-img').src=gUser.avatar;

document.getElementById('google-avatar-img').style.display='';

document.getElementById('google-avatar-init').style.display='none';

} else {

document.getElementById('google-avatar-init').textContent=displayName[0]||'?';

document.getElementById('google-avatar-init').style.display='flex';

document.getElementById('google-avatar-img').style.display='none';

}

document.getElementById('google-display-name').textContent=displayName;

document.getElementById('google-display-email').textContent=gUser.email;
localStorage.setItem('rikka_guser', JSON.stringify({id:gUser.id,name:gUser.name,avatar:gUser.avatar,email:gUser.email}));
}

function googleLogout(){
localStorage.removeItem('rikka_guser');
gUser={id:'',name:'',avatar:'',email:''};
applyLobbyEvent();

document.getElementById('google-login-area').style.display='';

document.getElementById('google-user-info').style.display='none';

document.getElementById('pname').value=localStorage.getItem('rikka_name_guest')||'プレイヤー';

google.accounts.id.disableAutoSelect();

}

function saveCustomName(){

if(!gUser.id){const gn=document.getElementById('pname').value.trim();if(gn)localStorage.setItem('rikka_name_guest',gn);return;}

const name=document.getElementById('pname').value.trim();

if(name){

localStorage.setItem('rikka_name_'+gUser.id,name);

document.getElementById('google-display-name').textContent=name;

}

}

// ============================================================

// オンライン

// ============================================================

let socket=null,onlineMode=false,myOnlineIdx=0,currentCode='';

function myName(){return document.getElementById('pname').value.trim()||'プレイヤー';}

function switchTab(tab){

const bot=document.getElementById('panel-bot'),onl=document.getElementById('panel-online');

const tb=document.getElementById('tab-bot'),to=document.getElementById('tab-online');

const GOLD='linear-gradient(135deg,#c9a84c,#a07020)',TEAL='linear-gradient(135deg,#2a9e8e,#1a6e60)',BASE='#1a1410';

if(tab==='bot'){bot.style.display='';onl.style.display='none';tb.style.background=GOLD;tb.style.color='#160e00';to.style.background=BASE;to.style.color='#6a5830';}

else{bot.style.display='none';onl.style.display='';to.style.background=TEAL;to.style.color='#e0fff8';tb.style.background=BASE;tb.style.color='#6a5830';const el=document.getElementById('server-url-display');if(el)el.textContent=SERVER_URL.replace('https://','');initSocket();}

}

function initSocket(){

if(socket&&socket.connected)return;

if(socket){socket.disconnect();socket=null;}

setOnlineStatus('サーバーに接続中...','#8a7048');
const _wakeTimer = setTimeout(()=>{
  setOnlineStatus('⏳ サーバー起動中です。初回は30〜60秒かかる場合があります...','#c9a84c');
}, 5000);

try{socket=io(SERVER_URL,{transports:['websocket','polling']});}

catch(e){setOnlineStatus('Socket.IOの読み込みに失敗しました','#f07050');return;}

socket.on('connect',()=>{ clearTimeout(_wakeTimer); setOnlineStatus('',''); });

socket.on('room_closed',({name})=>{hideRoomWait();currentCode='';const hb=document.getElementById('room-host-box');if(hb)hb.style.display='none';const cb=document.getElementById('btn-create-room');if(cb)cb.disabled=false;const js=document.getElementById('join-status');if(js)js.textContent='';toast(`${name} がルームを閉じました`);});
socket.on('connect_error',()=>{hideRoomWait();hideMatchFx(true);setOnlineStatus('サーバーに接続できません','#f07050');});

socket.on('queued',({pos})=>{if(!document.getElementById('match-fx'))showMatchFx();setOnlineStatus(`⟳ マッチング中... (待機${pos}人)`,'#6fc4ae');document.getElementById('btn-cancel-quick').style.display='';});

socket.on('matched',({code,names,players,you})=>{quickBotClearTimer();currentCode=code;matchFoundFx(players||(names||[]).map(n=>({name:n})),you,'対戦相手が見つかりました！');setOnlineStatus(`✓ マッチング成立！(${names.join(' vs ')})`,'#60e888');document.getElementById('btn-cancel-quick').style.display='none';});

socket.on('queue_cancelled',()=>{hideMatchFx(true);setOnlineStatus('','');document.getElementById('btn-quick').disabled=false;document.getElementById('btn-cancel-quick').style.display='none';});

socket.on('room_created',({code})=>{currentCode=code;document.getElementById('room-code-display').textContent=code;document.getElementById('room-host-box').style.display='';document.getElementById('btn-create-room').disabled=false;});

// （ルームの待機画面は showRoomWait で表示）
socket.on('room_update',(d)=>{
const {players,code}=d;showRoomWait(d);

currentCode=code;

document.getElementById('room-players-list').innerHTML=players.map(n=>`<div style="padding:.25rem .45rem;font-size:.84rem;display:flex;align-items:center;gap:.4rem"><div style="width:6px;height:6px;border-radius:50%;background:#4a9e8a;flex-shrink:0"></div>${esc(n)}</div>`).join('');

const sb=document.getElementById('btn-host-start');if(sb)sb.style.display=players.length>=2?'':'none';

const st=document.getElementById('room-status-text');if(st)st.textContent=`${players.length}/5人参加中${players.length<2?' — 待機中':(players.length>=5?' — 満員です。開始できます':' — 開始できます')}`;

const js=document.getElementById('join-status');if(js&&!js.textContent.includes('⟳'))js.textContent='✓ 参加しました！ホストの開始を待っています...';

});

socket.on('game_start',(d)=>{
  hideRoomWait();
  if(d&&d.players)matchFoundFx(d.players,d.you,'対戦開始！');
  onlineMode=true;
  showScreen('game');
  document.getElementById('chat-toggle').style.display='flex';
  document.getElementById('chat-log').innerHTML='';
  chatUnread=0;
  chatOpen=false;
  document.getElementById('chat-wrap').style.display='none';
  });
socket.on('state',st=>{onlineMode=true;applyOnlineState(st);});

socket.on('round_win',wd=>{
  if(wd&&wd.ron){const ms=showCallFx('ron',wd.winnerName,undefined,fxOfName(wd.winnerName));setTimeout(()=>showOnlineWinMsg(wd),ms-150);}
  else if(wd){const ms=showCallFx('win',wd.winnerName,wd.role,fxOfName(wd.winnerName));setTimeout(()=>showOnlineWinMsg(wd),ms-200);}
});
socket.on('round_draw',({scores})=>{
  clearRonWindow();
  if(G)G.phase='roundEnd';
  const rows=scores.map(s=>`<tr><td>${esc(s.name)}</td><td>${s.score}点</td></tr>`).join('');
  document.getElementById('mbox').innerHTML=`
<div class="mtitle">🤝 引き分け</div>
<p style="color:#8a7860;font-size:.9rem">全員リーチで、誰も上がれる牌がありません</p>
<table class="mscores">${rows}</table>
<button class="mbtn" onclick="doNextOnlineRound()">次のラウンドへ →</button>`;
  document.getElementById('modal').classList.add('open');
});
socket.on('player_riichi',({name,idx})=>{
  if(G&&G.players[idx]) G.players[idx].riichi=true;
  if(Number(idx)!==Number(myOnlineIdx)){ playSound('riichi'); showCallFx('riichi',name,undefined,(G&&G.players[idx])?G.players[idx].fx:null); }
  toast(`🀄 ${esc(name)} がリーチ！`);
  render();
});
socket.on('ron_available',({tile,discardedByIdx})=>{
  const optR=G?.optRoles??null;
  const p=G?.players[myOnlineIdx];
  if(p&&canRon(p.hand,tile,optR)) openRonWindow(tile,discardedByIdx);
});
socket.on('ron_timeout',()=>{ clearRonWindow(); });
  socket.on('rematch_waiting',({waiting,total})=>{
  const st=document.getElementById('rematch-status');
  if(st)st.textContent=`⏳ リマッチ待機中... (${waiting}/${total}人が同意)`;
});
socket.on('rematch_start',()=>{
  document.getElementById('modal').classList.remove('open');
  document.getElementById('chat-log').innerHTML='';
  toast('🔄 リマッチ開始！');
});
  socket.on('chat',({name, msg})=>{
  const isMine = name === (document.getElementById('pname').value.trim() || 'プレイヤー');
  receiveChat(name, msg, isMine);
});

socket.on('err',msg=>{toast(msg);});

socket.on('player_left',({name})=>showModal(`<div class="mtitle">⚠ 退出</div><p style="color:#a89868;margin:.8rem 0">${esc(name)} が退出しました</p><button class="mbtn" onclick="location.reload()">最初からやり直す</button>`));

socket.on('disconnect',()=>{hideRoomWait();hideMatchFx(true);if(onlineMode)showModal(`<div class="mtitle">⚠ 切断</div><p style="color:#a89868;margin:.8rem 0">接続が切れました</p><button class="mbtn" onclick="location.reload()">最初からやり直す</button>`);});

}


// ============================================================
// クイックマッチの待機演出（相手が見つかるまで／見つかった瞬間）
// ============================================================
let _matchFxTimer=null,_matchTipTimer=null,_matchStart=0,_matchFoundAt=0;
const MATCH_TIPS=['ロンは、相手が捨てた牌で自分の役が完成するときに宣言できます','リーチをして上がると、+1点になります','上下の数字が同じ★ゾロ目牌は、ボーナス点の対象です','「六華」は最高難度の役。6点が入ります','牌は反転させると、上下が入れ替わります','称号やアイコンは、メニューのカスタマイズから変えられます','ガチャの景品は、花びらを貯めて引けます'];
function showMatchFx(instant){
  hideMatchFx(true);
  const flower='<svg viewBox="-100 -100 200 200">'+[0,1,2,3,4,5].map(k=>`<ellipse cx="0" cy="-50" rx="17" ry="46" transform="rotate(${k*60})" fill="#ffd45a" fill-opacity=".55" stroke="#fff0a0" stroke-width="2"/>`).join('')+'<circle r="9" fill="#fff6c0"/></svg>';
  let stars='';for(let i=0;i<40;i++)stars+=`<i style="left:${(Math.random()*100).toFixed(1)}%;top:${(Math.random()*100).toFixed(1)}%;animation-delay:-${(Math.random()*3).toFixed(1)}s"></i>`;
  const el=document.createElement('div');el.id='match-fx';
  if(instant)el.style.animation='none'; // 後ろの画面が透けて見えないよう、最初から不透明にする
  el.innerHTML=`<div class="mf-stars">${stars}</div>
    <div class="mf-center"><div class="mf-ring"></div><div class="mf-ring"></div><div class="mf-ring"></div><div class="mf-grid"></div><div class="mf-radar"></div>
      <div class="mf-orbit">${[0,1,2,3,4,5].map(i=>`<i class="mf-tile" style="--i:${i}"></i>`).join('')}</div><div class="mf-flower">${flower}</div></div>
    <div class="mf-title" id="mf-title">対戦相手を探しています<span class="mf-dots"><i>.</i><i>.</i><i>.</i></span></div>
    <div class="mf-vs" id="mf-vs"></div>
    <div class="mf-meta" id="mf-meta">経過 0:00</div>
    <div class="mf-tip" id="mf-tip"></div>
    <div style="position:absolute;left:0;right:0;bottom:4.6rem;text-align:center;font-size:.72rem;color:rgba(200,180,140,.75);padding:0 1rem">人が集まらないときは、CPUが相手になります</div>
    <button class="mf-cancel" onclick="cancelQueue()">キャンセル</button>`;
  document.body.appendChild(el);
  _matchStart=Date.now();_matchFoundAt=0;
  const tick=()=>{const m=document.getElementById('mf-meta');if(!m)return;const sec=Math.floor((Date.now()-_matchStart)/1000);m.textContent=`経過 ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;};
  _matchFxTimer=setInterval(tick,1000);
  let ti=Math.floor(Math.random()*MATCH_TIPS.length);
  const tip=()=>{const t=document.getElementById('mf-tip');if(!t)return;t.style.opacity=0;setTimeout(()=>{t.textContent='💡 '+MATCH_TIPS[ti%MATCH_TIPS.length];ti++;t.style.opacity=1;},350);};
  tip();_matchTipTimer=setInterval(tip,4500);
}
// 対戦前の紹介画面：アイコン・称号・名前を並べて見せてから、対局に入る
let _matchHideTimer=null;
function matchCardHtml(p,isMe,cls){
  const av=avatarSrc(p.avatar||'');
  const ini=esc((p.name||'?')[0]);
  const face=av?`<img src="${esc(av)}" alt="" data-i="${ini}" onerror="this.parentNode.textContent=this.dataset.i">`:`<span>${ini}</span>`;
  return `<div class="mf-card ${cls}${isMe?' me':''}"><div class="mf-av">${face}</div>${titleBadgeHtml(p.title)||'<div class="win-title" style="visibility:hidden">　</div>'}<div class="mf-name">${esc(p.name||'')}</div>${isMe?'<div class="mf-you">あなた</div>':''}</div>`;
}
function matchFoundFx(players,you,label){
  if(!document.getElementById('match-fx'))showMatchFx(true);
  const el=document.getElementById('match-fx');if(!el)return;
  clearInterval(_matchFxTimer);clearInterval(_matchTipTimer);clearTimeout(_matchHideTimer);
  if(!Array.isArray(players)||!players.length)players=[];
  const me=Number.isInteger(you)?you:0;
  document.getElementById('mf-title').textContent=label||'対戦相手が見つかりました！';
  const others=players.filter((_,i)=>i!==me);
  let html;
  if(players.length===2){
    html=matchCardHtml(players[me],true,'l')+`<span class="mf-vsmark">VS</span>`+matchCardHtml(others[0],false,'r');
  }else{
    html=`<div class="mf-multi">${[players[me],...others].map((p,i)=>matchCardHtml(p,i===0,i%2?'r':'l')).join('')}</div>`;
  }
  const vs=document.getElementById('mf-vs');vs.innerHTML=html;vs.classList.toggle('multi',players.length!==2);
  el.classList.add('found');
  el.onclick=()=>hideMatchFx(false);
  _gfxAudio(ctx=>{const now=ctx.currentTime,m=ctx.createGain();m.gain.value=soundVolume*.5;m.connect(ctx.destination);
    [[659.25,0],[880,.12],[1318.5,.26]].forEach(([f,t])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,now+t);g.gain.linearRampToValueAtTime(.6,now+t+.02);g.gain.exponentialRampToValueAtTime(.001,now+t+.5);o.connect(g);g.connect(m);o.start(now+t);o.stop(now+t+.55);});});
  _matchHideTimer=setTimeout(()=>hideMatchFx(false),3600); // しばらく見せてから対局へ
}
// immediate=true なら即座に消す。そうでなければ、ふわっと消す
function hideMatchFx(immediate){
  clearInterval(_matchFxTimer);clearInterval(_matchTipTimer);clearTimeout(_matchHideTimer);
  const el=document.getElementById('match-fx');if(!el)return;
  if(immediate){el.remove();return;}
  el.onclick=null;el.classList.add('out');setTimeout(()=>el.remove(),420);
}
function doQuickMatch(){quickBotStartTimer();if(!socket||!socket.connected){initSocket();setTimeout(doQuickMatch,1000);return;}document.getElementById('btn-quick').disabled=true;setOnlineStatus('⟳ 対戦相手を探しています...','#6fc4ae');socket.emit('quickmatch',{name:myName(),fieldBg:myFieldBgValue(),avatar:myAvatarUrl(),title:myTitleId(),fx:myFxPayload()});showMatchFx();}

function cancelQueue(){quickBotClearTimer();hideMatchFx(true);socket?.emit('cancel_queue');document.getElementById('btn-quick').disabled=false;setOnlineStatus('','');}

function createRoom(){
  if(!socket||!socket.connected){initSocket();setTimeout(createRoom,1000);return;}
  document.getElementById('btn-create-room').disabled=true;
const goalEl=document.querySelector('input[name="room-goal"]:checked');
  const goal=goalEl?parseInt(goalEl.value):10;
  const useRiichi2=document.getElementById('room-opt-リーチ')?.checked||false;
  const useRon2=document.getElementById('room-opt-ロン')?.checked||false;
  socket.emit('create_room',{name:myName(),roles:getOptRoles('room-opt-'),goal,useRiichi:useRiichi2,useRon:useRon2,fieldBg:myFieldBgValue(),avatar:myAvatarUrl(),title:myTitleId(),fx:myFxPayload()});}
function copyRoomCode(){const code=document.getElementById('room-code-display').textContent;navigator.clipboard?.writeText(code).then(()=>toast('コードをコピーしました！'));}


// ============================================================
// プライベートルームの待機画面（参加できたことが一目で分かるようにする）
// ============================================================
let _roomPrevNames=null,_roomFirst=true;
function roomCardHtml(p,i,isMe,isNew,isHost){
  const av=avatarSrc(p.avatar||''),ini=esc((p.name||'?')[0]);
  const face=av?`<img src="${esc(av)}" alt="" data-i="${ini}" onerror="this.parentNode.textContent=this.dataset.i">`:`<span>${ini}</span>`;
  return `<div class="rw-card${isMe?' me':''}${isNew?' new':''}">${isHost?'<span class="rw-tag">👑 ホスト</span>':''}<div class="rw-av">${face}</div>${titleBadgeHtml(p.title)||'<div class="win-title" style="visibility:hidden">　</div>'}<div class="rw-name">${esc(p.name||'')}</div>${isMe?'<div class="rw-you">あなた</div>':''}</div>`;
}
function showRoomWait(d){
  const names=d.players||[],infos=(d.infos&&d.infos.length===names.length)?d.infos:names.map(n=>({name:n}));
  const you=Number.isInteger(d.you)?d.you:0,max=d.max||5,isHost=you===0;
  let el=document.getElementById('room-wait');
  const created=!el;
  if(created){
    hideMatchFx(true);
    el=document.createElement('div');el.id='room-wait';document.body.appendChild(el);
    _roomPrevNames=null;_roomFirst=true;
  }
  const prev=_roomPrevNames||[];
  const slots=[];
  for(let i=0;i<max;i++){
    if(infos[i])slots.push(roomCardHtml(infos[i],i,i===you,_roomPrevNames!==null?!prev.includes(infos[i].name):(i===you),i===0));
    else slots.push(`<div class="rw-card rw-empty"><span>待機中<i>.</i><i>.</i><i>.</i></span></div>`);
  }
  const canStart=isHost&&names.length>=2;
  const status=isHost?(names.length<2?'友達の参加を待っています…（コードを伝えてください）':`${names.length}人が揃いました。ゲームを開始できます`):'ホストが開始するのを待っています…';
  el.innerHTML=`<div class="rw-box">
    <div class="rw-check">✓</div>
    <div class="rw-head">${isHost?'ルームを作成しました！':'ルームに参加しました！'}</div>
    <div class="rw-codebox"><div class="rw-codelabel">ルームコード</div><div class="rw-code">${esc(d.code||'')}</div><button class="rw-copy" onclick="copyRoomCode('${esc(d.code||'')}')">📋 コードをコピー</button></div>
    <div class="rw-status">参加者 ${names.length} / ${max}人</div>
    <div class="rw-slots">${slots.join('')}</div>
    <div class="rw-status" id="rw-status">${status}</div>
    <div class="rw-btns">${canStart?'<button class="main" onclick="hostStartGame()">▶ ゲーム開始！</button>':''}<button class="ghost" onclick="leaveRoomWait()">ルームから出る</button></div></div>`;
  // 新しく参加した人を知らせる（本人以外に向けて：バナー＋効果音）
  if(d.joined&&d.joined!==(infos[you]&&infos[you].name)){roomJoinBanner(`🎉 ${d.joined} が参加しました！`);}
  else if(d.left){roomJoinBanner(`👋 ${d.left} が退出しました`,true);}
  else if(created&&!isHost){_gfxAudio(ctx=>{const now=ctx.currentTime,m=ctx.createGain();m.gain.value=soundVolume*.5;m.connect(ctx.destination);
    [[523.25,0],[659.25,.1],[783.99,.2],[1046.5,.32]].forEach(([f,t])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,now+t);g.gain.linearRampToValueAtTime(.6,now+t+.02);g.gain.exponentialRampToValueAtTime(.001,now+t+.5);o.connect(g);g.connect(m);o.start(now+t);o.stop(now+t+.55);});});}
  _roomPrevNames=names.slice();
}
function roomJoinBanner(text,quiet){
  const old=document.querySelector('.rw-join-banner');if(old)old.remove();
  const b=document.createElement('div');b.className='rw-join-banner';b.textContent=text;document.body.appendChild(b);setTimeout(()=>b.remove(),2500);
  if(!quiet)_gfxAudio(ctx=>{const now=ctx.currentTime,m=ctx.createGain();m.gain.value=soundVolume*.5;m.connect(ctx.destination);
    [[880,0],[1318.5,.12]].forEach(([f,t])=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,now+t);g.gain.linearRampToValueAtTime(.6,now+t+.015);g.gain.exponentialRampToValueAtTime(.001,now+t+.4);o.connect(g);g.connect(m);o.start(now+t);o.stop(now+t+.45);});});
}
function hideRoomWait(){const el=document.getElementById('room-wait');if(el)el.remove();_roomPrevNames=null;}
function leaveRoomWait(){
  socket?.emit('leave_room',{code:currentCode});hideRoomWait();currentCode='';
  const hb=document.getElementById('room-host-box');if(hb)hb.style.display='none';
  const cb=document.getElementById('btn-create-room');if(cb)cb.disabled=false;
  const js=document.getElementById('join-status');if(js)js.textContent='';
}
function copyRoomCode(code){
  try{navigator.clipboard.writeText(code).then(()=>toast('コードをコピーしました'));}catch(e){toast('コード：'+code);}
}
function cancelRoom(){document.getElementById('room-host-box').style.display='none';document.getElementById('btn-create-room').disabled=false;}

function hostStartGame(){socket?.emit('start_game',{code:currentCode});}

function joinRoom(){const code=document.getElementById('join-code-input').value.toUpperCase().trim();if(!code){document.getElementById('join-status').textContent='コードを入力してください';return;}if(!socket||!socket.connected){initSocket();setTimeout(joinRoom,1000);return;}document.getElementById('join-status').textContent='⟳ 参加中...';socket.emit('join_room',{name:myName(),code,fieldBg:myFieldBgValue(),avatar:myAvatarUrl(),title:myTitleId(),fx:myFxPayload()});}

function setOnlineStatus(msg,color){const el=document.getElementById('online-status');if(el){el.textContent=msg;el.style.color=color||'#6a5030';}const cb=document.getElementById('btn-cancel-quick');if(cb)cb.style.display=msg?'':'none';}

function applyOnlineState(st){

if(st.code)currentCode=st.code;

myOnlineIdx=st.myIdx;

if(!G||G.players.length!==st.scores.length){

G={players:st.scores.map(s=>({name:s.name,hand:[],score:s.score,isBot:false,fieldBg:s.fieldBg||'',avatar:s.avatar||'',title:s.title||''})),field:[],turn:0,tphase:'pick',selIdx:-1,phase:'playing'};

}

const serverHand=st.myHand,localHand=G.players[st.myIdx].hand;

const serverIds=new Set(serverHand.map(t=>t.id)),localIds=new Set(localHand.map(t=>t.id));

const sameSet=serverHand.length===localHand.length&&serverHand.every(t=>localIds.has(t.id));

if(sameSet){

localHand.forEach(lt=>{const s=serverHand.find(s=>s.id===lt.id);if(s)lt.flip=s.flip;});

} else {

const kept=localHand.filter(t=>serverIds.has(t.id));

kept.forEach(lt=>{const s=serverHand.find(s=>s.id===lt.id);if(s)lt.flip=s.flip;});

const added=serverHand.filter(t=>!localIds.has(t.id));

G.players[st.myIdx].hand=[...kept,...added];

if(serverHand.length<localHand.length)G.selIdx=-1;

}

G.field=st.field;G.turn=st.turn;G.tphase=st.tphase;G.phase=st.phase;
G.optRoles = st.optRoles !== undefined ? st.optRoles : null;
G.useRiichi = st.useRiichi || false;
G.useRon    = st.useRon    || false;
G.goal = st.goal || 10;

st.scores.forEach((s,i)=>{G.players[i].score=s.score;G.players[i].name=s.name;G.players[i].isBot=false;G.players[i].fieldBg=s.fieldBg||'';G.players[i].avatar=s.avatar||'';G.players[i].title=s.title||'';G.players[i].fx=s.fx||null;G.players[i].riichi=s.riichi||false;});

st.oppCounts.forEach((cnt,i)=>{if(i===st.myIdx)return;G.players[i].hand=Array.from({length:Math.max(0,cnt)},(_,j)=>({id:`ph${i}_${j}`,top:1,bot:1,flip:false,discarded:false,hidden:true}));});

warmFieldBgs(); // 自分と相手の背景を先に読み込む
updateFieldBgForTurn();
showScreen('game');render();

}

// 「ゲーム終了を確認」ボタンに渡すデータ。onclick属性へ直接埋め込むとプレイヤー名経由でXSSされるため、
// JSONを文字列化して属性値に埋め込むのではなく、変数経由で受け渡す。
let _pendingOnlineGameOver = { scores: [], tsuideList: [] };
function showOnlineWinMsg(wd){

const{winnerIdx,winnerName,hand=[],role,pts,bonus=0,scores=[],isGameOver,ron,riichi}=wd;
if(_skipSnd!==(ron?'ron':'win'))playSound(ron ? 'ron' : 'win');
_skipSnd='';

saveHistory(makeHistoryEntry(Number(winnerIdx)===Number(myOnlineIdx),role,pts+bonus,true,scores.map(s=>s.name)));
const _newAch=checkAchievements(Number(winnerIdx)===Number(myOnlineIdx),{role,bonus,ron:!!ron,riichi:!!riichi,online:true,total:(Number(pts)||0)+(Number(bonus)||0)});
addPetals(1+(Number(winnerIdx)===Number(myOnlineIdx)?2:0)+_newAch.length*5);
  const tsuideList=wd.tsuideList||[];
  _pendingOnlineGameOver = { scores, tsuideList };

const rows=scores.map(s=>`<tr><td>${esc(s.name)}</td><td>${s.score}点</td></tr>`).join('');

const tiles=hand.map(t=>tileHTML(t,'','tile htile')).join('');

const b=bonus>0?`<div style="font-size:.85rem;color:#f5d040;margin-bottom:.6rem">★ 輝きボーナス×${bonus}=+${bonus}点</div>`:'';

const iAm=Number(winnerIdx)===Number(myOnlineIdx);
const _wTitle=iAm?myTitleId():((G&&G.players&&G.players[winnerIdx]&&G.players[winnerIdx].title)||'');

document.getElementById('mbox').innerHTML=`

<div class="mtitle">${iAm?'🎆 上がり！':'😔 相手の上がり'}</div>

${titleBadgeHtml(_wTitle)}<p style="color:#8a7860;font-size:.9rem">${esc(winnerName)} が役を完成</p>

<div class="mrole">${esc(role)}</div>

<div class="mpts">役: +${pts}点</div>${b}

<div class="mhand">${tiles}</div>

<table class="mscores">${rows}</table>

${isGameOver

?`<button class="mbtn" onclick="showOnlineGameOver()">ゲーム終了を確認 →</button>`

:`<button class="mbtn" onclick="doNextOnlineRound()">次のラウンドへ →</button>`}`;

document.getElementById('modal').classList.add('open');

if(_newAch.length)setTimeout(()=>showAchievementPopup(_newAch),900);

}

function showOnlineGameOver(){
const { scores, tsuideList } = _pendingOnlineGameOver || { scores: [], tsuideList: [] };
const winner=scores.reduce((a,b)=>a.score>b.score?a:b);
const rows=scores.map(s=>`<tr><td>${esc(s.name)}</td><td>${s.score}点</td></tr>`).join('');
document.getElementById('mbox').innerHTML=`
<div class="mtitle">🏆 ゲーム終了！</div>
<div style="font-size:1.5rem;color:#f5e0a0;margin:.5rem 0;font-family:'Hiragino Mincho ProN','Yu Mincho',serif">${esc(winner.name)} の勝利！</div>
<table class="mscores">${rows}</table>
${tsuideList.length>0?`
<div style="margin:.6rem 0 .3rem;font-size:.78rem;color:#8a7048;border-top:1px solid #2a1e10;padding-top:.5rem">✨ ついでに完成</div>
${tsuideList.map(t=>`<div style="font-size:.82rem;color:#e8c97a;margin:.2rem 0">${esc(t.name)}：${t.role}（${t.pts}点${t.bonus>0?'＋★×'+t.bonus:''}）→ +${t.total}点</div>`).join('')}`:''}
<button class="mbtn" id="btn-rematch-online"
onclick="requestRematch()" style="background:linear-gradient(135deg,#2a9e8e,#1a6e60);color:#e0fff8;margin-bottom:.5rem">🔄 リマッチ申請</button>
<div id="rematch-status" style="font-size:.78rem;color:#8a7048;text-align:center;margin-bottom:.5rem;min-height:1em"></div>
<button class="mbtn" onclick="goLobby()" style="background:#2a1e14;color:#c9a84c;border:1px solid #5a4020">🏠 タイトルへ戻る</button>`;
document.getElementById('modal').classList.add('open');
}

function doNextOnlineRound(){document.getElementById('modal').classList.remove('open');socket?.emit('next_round',{code:currentCode});}

// ============================================================

// 牌描画

// ============================================================

function makeSym(n){

const C=['','#E02828','#E87818','#80BC18','#20B840','#1878D8','#CC18B0'];

const c=C[n],O=`<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">`,X=`</svg>`,cx=14,cy=14;

if(n===1)return`${O}<circle cx="14" cy="14" r="10.5" fill="${c}"/>${X}`;

if(n===2){const top=`M 14 14 C 9 12 8.5 5 14 1 C 19.5 5 19 12 14 14 Z`,bot=`M 14 14 C 9 16 8.5 23 14 27 C 19.5 23 19 16 14 14 Z`;return`${O}<path d="${top}" fill="${c}"/><path d="${bot}" fill="${c}"/>${X}`;}

const pCfg={3:{tip:1.0,cpx:5.5,cpy1:10.5,cpy2:4.0},4:{tip:2.0,cpx:5.0,cpy1:11.0,cpy2:5.0},5:{tip:3.0,cpx:4.5,cpy1:11.5,cpy2:6.0},6:{tip:4.5,cpx:4.0,cpy1:12.0,cpy2:7.5}};

const{tip,cpx,cpy1,cpy2}=pCfg[n];

const pp=`M ${cx} ${cy} C ${cx-cpx} ${cpy1} ${cx-cpx*.6} ${cpy2} ${cx} ${tip} C ${cx+cpx*.6} ${cpy2} ${cx+cpx} ${cpy1} ${cx} ${cy} Z`;

const step=360/n,petals=Array.from({length:n},(_,i)=>`<path d="${pp}" fill="${c}" transform="rotate(${step*i},${cx},${cy})"/>`).join('');

return`${O}${petals}<circle cx="${cx}" cy="${cy}" r="2.2" fill="rgba(255,255,255,0.55)"/>${X}`;

}

const SYM_SVG=['',...Array.from({length:6},(_,i)=>makeSym(i+1))];

// ============================================================

// ゲーム状態

// ============================================================

let G=null;

function makeDeck(){const d=[];let id=0;for(let t=1;t<=6;t++)for(let b=1;b<=6;b++){d.push({id:id++,top:t,bot:b,flip:false,discarded:false});if(t===b)d.push({id:id++,top:t,bot:b,flip:false,discarded:false});}return shuffle(d);}

function shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}

function eTop(t){return t.flip?t.bot:t.top;}

function eBot(t){return t.flip?t.top:t.bot;}

function checkWin(hand, optRoles, forTsuide){
  // optRoles: null=全役有効 / []=基本役のみ / ['三対',...]= 選択役のみ
  // forTsuide: true のときだけ三色の直接完成を許可（ついでに完成でのみ成立する役のため）
  if(hand.length!==6)return null;
  const tops=hand.map(eTop),bots=hand.map(eBot),allBotSame=bots.every(v=>v===bots[0]);
  const use=r=>optRoles===null||optRoles.includes(r);
  if(use('無双')&&isMusou(hand))return{role:'無双',pts:3};
  if(allBotSame){const st=[...tops].sort((a,b)=>a-b);if(st.join(',') === '1,2,3,4,5,6')return{role:'六華',pts:6};}
  if(use('輝光')&&isKikou(hand))return{role:'輝光',pts:5,noBonus:true};
  if(isSanren(hand))return{role:'三連',pts:3};
  if(use('三色')&&forTsuide&&isSanshiki(hand))return{role:'三色',pts:3,noBonus:true};
  if(use('三対')&&isSantui(hand))return{role:'三対',pts:2};
  if(allBotSame)return{role:'一色',pts:1};
  return null;
}

function isSanren(hand){for(let mask=0;mask<(1<<6);mask++){if(popcount(mask)!==3)continue;const g1=[],g2=[];for(let i=0;i<6;i++)(mask&(1<<i)?g1:g2).push(hand[i]);if(isSet3(g1)&&isSet3(g2))return true;}return false;}

function isSet3(g){if(g.length!==3)return false;const b=g.map(eBot);if(!b.every(v=>v===b[0]))return false;const t=g.map(eTop).sort((a,b)=>a-b);return t[1]===t[0]+1&&t[2]===t[1]+1;}

function popcount(n){let c=0;while(n){c+=n&1;n>>=1;}return c;}
function isMusou(hand){
  if(!hand.every(t=>eTop(t)===eBot(t)))return false;
  return new Set(hand.map(t=>eTop(t))).size===6;
}
function isKikou(hand){return hand.every(t=>eTop(t)===eBot(t));}
function isSanshiki(hand){
  const v=new Set();
  hand.forEach(t=>{v.add(eTop(t));v.add(eBot(t));});
  return v.size===3;
}
function isSantui(hand){
  const f={};
  hand.forEach(t=>{const k=`${eTop(t)},${eBot(t)}`;f[k]=(f[k]||0)+1;});
  return Object.values(f).every(v=>v%2===0);
}
function countZorome(hand){return hand.filter(t=>t.top===t.bot).length;}
// ── リーチ・ロン ──
function isTenpai(hand5, optR){
  if(hand5.length!==5) return false;
  for(let top=1;top<=6;top++)
    for(let bot=1;bot<=6;bot++){
      const t={id:8888,top,bot,flip:false,discarded:false};
      if(canRon(hand5,t,optR)) return true;
    }
  return false;
}
function canRon(hand5, tile, optR){
  const hand6=[...hand5,tile];
  const lim=Math.min(1<<6,64);
  for(let m=0;m<lim;m++){
    const h=hand6.map((t,i)=>({...t,flip:!!(m&(1<<i))}));
    if(checkWin(h,optR)) return true;
  }
  return false;
}
// canRonと違い、実際に上がれるフリップの組み合わせ(res・hand)を返す
// forTsuide: true のときだけ三色の完成を許可（ついでに完成専用の呼び出しで使う）
function findRonWin(hand5, tile, optR, forTsuide){
  const hand6=[...hand5,tile];
  const lim=Math.min(1<<6,64);
  for(let m=0;m<lim;m++){
    const h=hand6.map((t,i)=>({...t,flip:!!(m&(1<<i))}));
    const w=checkWin(h,optR,forTsuide);
    if(w) return {res:w, hand:h};
  }
  return null;
}
let _ronPending=null, _ronTimer=null, _ronContinue=null;
function openRonWindow(tile, discardedByIdx, onExpire){
  _ronPending={tile,discardedByIdx};
  _ronContinue=onExpire||null;
  showRonBtn(true);
  clearTimeout(_ronTimer);
  _ronTimer=setTimeout(()=>{
    const cb=_ronContinue;
    clearRonWindow();
    if(cb) cb();
  },5000);
}
function clearRonWindow(){
  clearTimeout(_ronTimer);_ronTimer=null;_ronPending=null;_ronContinue=null;
  showRonBtn(false);
}
function showRonBtn(show){
  const el=document.getElementById('ron-btn');
  if(el) el.style.display=show?'block':'none';
}
function showRiichiBtn(show){
  const el=document.getElementById('riichi-btn');
  if(el) el.style.display=show?'block':'none';
}
