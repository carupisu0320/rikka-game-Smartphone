// ===== フレンド =====
// 友だち関係は、お互いの端末の「フレンド一覧」にお互いのコードがあるときに成立する（申請→承認）。
// コードは公開してよい。合言葉(tok)は端末の中だけに持ち、他人のなりすましを防ぐ。
const FR_ALPHA='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function _frRand(n){const a=new Uint32Array(n);(window.crypto||crypto).getRandomValues(a);return Array.from(a,x=>FR_ALPHA[x%FR_ALPHA.length]).join('');}
let FR=null;
function frState(){
  if(FR)return FR;
  try{FR=JSON.parse(localStorage.getItem('rikka_friends')||'null');}catch(e){FR=null;}
  if(!FR||typeof FR!=='object'||!/^[A-HJ-NP-Z2-9]{8}$/.test(FR.code||'')||!FR.tok){FR={code:_frRand(8),tok:_frRand(24),list:[],declined:[]};}
  FR.list=Array.isArray(FR.list)?FR.list:[];FR.declined=Array.isArray(FR.declined)?FR.declined:[];
  saveFriendState();return FR;
}
function saveFriendState(){try{localStorage.setItem('rikka_friends',JSON.stringify(FR));}catch(e){}}
let fsocket=null,frRequests=[],_frStatus='';
function friendConnect(){
  if(fsocket)return;
  try{fsocket=io(SERVER_URL,{transports:['websocket','polling']});}catch(e){return;}
  fsocket.on('connect',frRegister);
  fsocket.on('friend_view',frApplyView);
  fsocket.on('friend_invite',frShowInvite);
  fsocket.on('friend_message',frShowMsg);
  fsocket.on('friend_message_ok',()=>toast('💬 メッセージを送りました'));
  fsocket.on('friend_message_ng',()=>toast('相手がオンラインではありません'));
  fsocket.on('spec_state',specRender);
  fsocket.on('spec_note',d=>specNote(d&&d.text));
  fsocket.on('spec_end',d=>specNote((d&&d.text)||'対戦が終わりました',true));
  fsocket.on('spec_ng',m=>toast(String(m||'観戦できません')));
  fsocket.on('spec_count',d=>{window.__bs=(d&&d.n|0)||0;if(window.__bs>0)botSpecPush(true);}); // CPU戦を見ている人がいるあいだだけ、公開情報を送る
  fsocket.on('friend_error',m=>toast(m));
  fsocket.on('disconnect',()=>{frRequests=[];frUpdateBadge();if(document.getElementById('fr-box'))frRender();});
}
function frRegister(){
  const s=frState();_frStatus='';
  fsocket.emit('friend_register',{code:s.code,tok:s.tok,name:myName(),avatar:myAvatarUrl(),title:myTitleId(),friends:s.list.map(f=>f.code)});
  frReportStatus();
}
function frSync(){
  if(!fsocket||!fsocket.connected)return;
  fsocket.emit('friend_sync',{friends:frState().list.map(f=>f.code),name:myName(),avatar:myAvatarUrl(),title:myTitleId()});
}
function frReportStatus(){
  if(!fsocket||!fsocket.connected)return;
  const st=currentCode?((onlineMode&&G&&G.phase==='playing')?'playing':'room'):((!onlineMode&&G&&G.players&&document.getElementById('game')&&document.getElementById('game').classList.contains('active'))?'bot':'lobby'),key=st+'|'+(st==='room'?currentCode:'');
  if(key===_frStatus)return;_frStatus=key;
  fsocket.emit('friend_status',{st,room:st==='room'?currentCode:''});
}
function frApplyView(v){
  if(!v||!Array.isArray(v.friends))return;
  const s=frState();
  v.friends.forEach(f=>{
    const e=s.list.find(x=>x.code===f.code);if(!e)return;
    if(f.state==='friend'){Object.assign(e,{name:f.name,avatar:f.avatar,title:f.title,confirmed:true,online:true,status:f.status,room:f.room,pending:false});}
    else{e.online=false;e.status='';e.room='';e.pending=f.state==='pending';}
  });
  const prev=frRequests.length;
  frRequests=(v.requests||[]).filter(r=>!s.declined.includes(r.code)&&!s.list.some(x=>x.code===r.code));
  if(frRequests.length>prev)toast('👥 フレンド申請が届いています');
  saveFriendState();frUpdateBadge();
  if(document.getElementById('fr-box'))frRender();
}
function frUpdateBadge(){const b=document.getElementById('fr-badge');if(b)b.textContent=frRequests.length?'●':'';}
function frShowInvite(d){
  if(!d||!d.from||!/^[A-Z0-9]{3,12}$/.test(d.room||''))return;
  if(onlineMode&&G&&G.phase==='playing')return;
  showModal(`<div class="mtitle">👥 招待が届きました</div><p style="color:#c9a870;margin:.8rem 0">${esc(d.from.name)} さんから、部屋への招待です</p>
    <button class="mbtn" onclick="frJoinRoom('${d.room}')">参加する</button>
    <button class="mbtn" style="background:#2a1e14;color:#c9a84c;border:1px solid #5a4020;margin-top:.4rem" onclick="document.getElementById('modal').classList.remove('open')">あとで</button>`);
}
function frJoinRoom(room){
  if(!/^[A-Z0-9]{3,12}$/.test(room||''))return;
  if(currentCode){toast('いまの部屋を出てから参加してください');return;}
  document.getElementById('modal').classList.remove('open');
  document.getElementById('join-code-input').value=room;joinRoom();
}
// ===== フレンドへのメッセージ（オンラインのフレンドだけ）。届いたら、タイトルでも対戦中でも画面の上に表示する =====
let _frMsgTo='',_frMsgLast=0;
function frMsgOpen(code){
  const f=frState().list.find(x=>x.code===code);if(!f)return;_frMsgTo=code;
  let el=document.getElementById('fr-compose');
  if(!el){el=document.createElement('div');el.id='fr-compose';
    el.innerHTML=`<div class="frc-box"><div class="frc-t" id="frc-t"></div>
      <div class="frc-chips">${['よろしく！','一緒に遊ぼう','ありがとう','またあとで'].map(x=>`<button type="button">${x}</button>`).join('')}</div>
      <textarea id="frc-text" rows="3" maxlength="60" placeholder="メッセージ（60文字まで）"></textarea>
      <div class="frc-b"><button type="button" class="fr-b" id="frc-close">閉じる</button><button type="button" class="fr-b go" id="frc-send">送信</button></div></div>`;
    document.body.appendChild(el);
    el.addEventListener('click',e=>{if(e.target===el)el.classList.remove('open');});
    el.querySelectorAll('.frc-chips button').forEach(b=>b.onclick=()=>{document.getElementById('frc-text').value=b.textContent;});
    document.getElementById('frc-close').onclick=()=>el.classList.remove('open');
    document.getElementById('frc-send').onclick=frMsgSend;}
  document.getElementById('frc-t').textContent=(f.name||'フレンド')+' さんへメッセージ';
  const tx=document.getElementById('frc-text');tx.value='';el.classList.add('open');setTimeout(()=>tx.focus(),50);
}
function frMsgSend(){
  const tx=document.getElementById('frc-text'),m=(tx.value||'').trim();if(!m)return;
  if(!fsocket||!fsocket.connected){toast('接続できていません');return;}
  if(Date.now()-_frMsgLast<1500){toast('少し待ってから送ってください');return;}
  _frMsgLast=Date.now();fsocket.emit('friend_message',{to:_frMsgTo,msg:m});try{missionAdd('msg');}catch(e){}
  document.getElementById('fr-compose').classList.remove('open');
}
function frShowMsg(d){
  if(!d||!d.from||typeof d.msg!=='string'||!d.msg)return;
  let box=document.getElementById('fr-msgs');
  if(!box){box=document.createElement('div');box.id='fr-msgs';document.body.appendChild(box);}
  const el=document.createElement('div');el.className='fr-msg';
  const nm=document.createElement('div');nm.className='nm';nm.textContent='💬 '+String(d.from.name||'フレンド').slice(0,20)+' さんから';
  const tx=document.createElement('div');tx.className='tx';tx.textContent=d.msg.slice(0,60);
  const ac=document.createElement('div');ac.className='ac';
  const rp=document.createElement('button');rp.type='button';rp.className='fr-b';rp.textContent='返信';
  const gone=()=>{el.classList.add('out');setTimeout(()=>el.remove(),320);};
  rp.onclick=e=>{e.stopPropagation();gone();if(/^[A-HJ-NP-Z2-9]{8}$/.test(d.from.code||''))frMsgOpen(d.from.code);};
  ac.appendChild(rp);el.append(nm,tx,ac);el.onclick=gone;box.appendChild(el);
  while(box.children.length>3)box.firstChild.remove();
  setTimeout(gone,7000);try{navigator.vibrate&&navigator.vibrate(60);}catch(e){}
}
// ===== 観戦（フレンドの対戦を見る。見られるのは、場・捨て牌・点数・手番だけ。誰の手牌も見えない）=====
function frSpectate(code){if(!fsocket||!fsocket.connected){toast('接続できていません');return;}fsocket.emit('spectate',{to:code});toast('観戦を始めています…');}
function specView(){
  let el=document.getElementById('spec-view');
  if(!el){el=document.createElement('div');el.id='spec-view';document.body.appendChild(el);}
  return el;
}
function specClose(){const el=document.getElementById('spec-view');if(el){el.classList.remove('open');el.innerHTML='';}fsocket?.emit('stop_spectate');}
function specRender(d){
  if(!d||!Array.isArray(d.scores))return;
  const el=specView(),was=el.querySelector('.sp-note'),note=was?was.textContent:'';
  const turnTxt=(i)=>i===d.turn&&d.phase==='playing'?(d.tphase==='pick'?'場から牌を選んでいます':'捨てる牌を選んでいます'):'';
  el.innerHTML=`<div class="sp-head"><b>👁 観戦中</b><button class="fr-b del" onclick="specClose()">退出</button></div>
    <div class="sp-ps">${d.scores.map((p,i)=>`<div class="sp-p${i===d.turn&&d.phase==='playing'?' turn':''}"><div class="sp-n">${esc(p.name)}${p.riichi?'<span class="sp-r">リーチ</span>':''}</div><div class="sp-s">${p.score} / ${d.goal}点</div><div class="sp-h">${p.tiles&&p.tiles.length?p.tiles.map(t=>tileHTML(t)).join(''):'<i class="fback"></i>'.repeat(Math.min(8,p.hand||0))}</div><div class="sp-t">${turnTxt(i)}</div></div>`).join('')}</div>
    <div class="sp-sec">🀄 場の牌（${d.fieldCount}枚）</div><div class="sp-f">${'<div class="fback"></div>'.repeat(Math.min(60,d.fieldCount||0))}</div>
    <div class="sp-sec">捨て牌（${(d.discards||[]).length}枚）</div><div class="sp-f">${(d.discards||[]).map(t=>tileHTML(t)).join('')||'<span style="color:#6a5030;font-size:.78rem">まだありません</span>'}</div>
    ${d.scores.some(p=>(p.hand||0)>0&&!(p.tiles&&p.tiles.length))?'<div class="sp-note" style="margin-top:.4rem">手牌の情報が届いていません。サーバー、または対戦している人の端末が古いままかもしれません（更新して開き直してください）</div>':''}
    ${d.phase==='playing'?'':'<div class="sp-note">ラウンドが終わりました。次の局を待っています…</div>'}`;
  el.classList.add('open');
}
function specNote(text,end){
  const el=specView();if(!el.classList.contains('open'))return;
  el.querySelectorAll('.sp-note').forEach(n=>n.remove());
  const n=document.createElement('div');n.className='sp-note';n.textContent=String(text||'').slice(0,80);el.appendChild(n);
  if(end){fsocket?.emit('stop_spectate');}
}
// ===== デイリーミッション・ウィークリー目標（達成すると花びらがもらえる）=====
const MS_DAILY=[
  {id:'play3',t:'対戦を3局する',ev:'play',n:3,p:3},{id:'win1',t:'1局勝つ',ev:'win',n:1,p:5},
  {id:'online1',t:'オンライン対戦を1局する',ev:'online',n:1,p:5},{id:'win3',t:'3局勝つ',ev:'win',n:3,p:8},
  {id:'big',t:'5点以上の役で上がる',ev:'big',n:1,p:6},{id:'gacha1',t:'ガチャを1回引く',ev:'gacha',n:1,p:3},
  {id:'msg1',t:'フレンドにメッセージを送る',ev:'msg',n:1,p:3}];
const MS_WEEKLY=[
  {id:'w_win10',t:'10局勝つ',ev:'win',n:10,p:30},{id:'w_online10',t:'オンライン対戦を10局する',ev:'online',n:10,p:30},
  {id:'w_login5',t:'5日ログインする',ev:'login',n:5,p:20},{id:'w_gacha10',t:'ガチャを10回引く',ev:'gacha',n:10,p:20}];
const MS_BONUS=5;
function _msWeek(){const d=new Date(),k=(d.getDay()+6)%7,m=new Date(d.getFullYear(),d.getMonth(),d.getDate()-k);
  return m.getFullYear()+'-'+String(m.getMonth()+1).padStart(2,'0')+'-'+String(m.getDate()).padStart(2,'0');}
function msLoad(){
  let st;try{st=JSON.parse(localStorage.getItem('rikka_missions')||'{}');}catch(e){st={};}
  const day=_loginToday(),wk=_msWeek();
  if(st.day!==day){ // 毎日0時に、今日の3つを選び直す（日付から決めるので、同じ日は同じ内容）
    let h=0;for(const ch of day)h=(h*31+ch.charCodeAt(0))>>>0;const r=_rng(h),pool=MS_DAILY.slice(),ids=[];
    while(ids.length<3&&pool.length){const m=pool.splice(Math.floor(r()*pool.length),1)[0];
      if((m.id==='win1'&&ids.includes('win3'))||(m.id==='win3'&&ids.includes('win1')))continue;ids.push(m.id);}
    st.day=day;st.d={ids,prog:{},claimed:{},bonus:false};}
  if(st.week!==wk){st.week=wk;st.w={prog:{},claimed:{}};}
  return st;
}
function msSave(st){try{localStorage.setItem('rikka_missions',JSON.stringify(st));}catch(e){}msBadge();}
function missionAdd(ev,n=1){
  try{const st=msLoad();
    const bump=(def,box)=>{const was=box.prog[def.id]||0;if(was>=def.n)return;box.prog[def.id]=Math.min(def.n,was+n);if(box.prog[def.id]>=def.n)toast('✅ ミッション達成：'+def.t);};
    st.d.ids.map(i=>MS_DAILY.find(m=>m.id===i)).filter(m=>m&&m.ev===ev).forEach(m=>bump(m,st.d));
    MS_WEEKLY.filter(m=>m.ev===ev).forEach(m=>bump(m,st.w));
    msSave(st);}catch(e){}
}
function missionRound(en){if(!en)return;missionAdd('play');if(en.online)missionAdd('online');if(en.won){missionAdd('win');if((en.pts||0)>=5)missionAdd('big');}}
function msClaimable(st){
  const dl=st.d.ids.map(i=>MS_DAILY.find(m=>m.id===i)).filter(Boolean);
  let c=dl.filter(m=>(st.d.prog[m.id]||0)>=m.n&&!st.d.claimed[m.id]).length+MS_WEEKLY.filter(m=>(st.w.prog[m.id]||0)>=m.n&&!st.w.claimed[m.id]).length;
  if(!st.d.bonus&&dl.length&&dl.every(m=>st.d.claimed[m.id]))c++;return c;
}
function msBadge(){try{const b=document.getElementById('mission-badge');if(b)b.textContent=msClaimable(msLoad())?'●':'';}catch(e){}}
function msClaim(scope,id){
  const st=msLoad();
  if(scope==='b'){const dl=st.d.ids;if(st.d.bonus||!dl.every(i=>st.d.claimed[i]))return;st.d.bonus=true;addPetals(MS_BONUS);toast('🌸 ボーナス +'+MS_BONUS);}
  else{const box=scope==='d'?st.d:st.w,def=(scope==='d'?MS_DAILY:MS_WEEKLY).find(m=>m.id===id);
    if(!def||box.claimed[id]||(box.prog[id]||0)<def.n)return;box.claimed[id]=1;addPetals(def.p);toast('🌸 +'+def.p+' 花びらを受け取りました');}
  msSave(st);openMissions();
}
function openMissions(){
  const st=msLoad(),row=(def,box,sc)=>{const v=box.prog[def.id]||0,done=v>=def.n,cl=!!box.claimed[def.id];
    return `<div class="ms-row"><div class="ms-t">${esc(def.t)}（🌸${def.p}）</div>${cl?'<span class="ms-done ms-go">受取済み</span>':done?`<button class="fr-b go ms-go" onclick="msClaim('${sc}','${def.id}')">受け取る</button>`:`<span class="ms-n ms-go">${v}/${def.n}</span>`}<div class="ms-bar"><i style="width:${Math.round(100*v/def.n)}%"></i></div></div>`;};
  const dl=st.d.ids.map(i=>MS_DAILY.find(m=>m.id===i)).filter(Boolean),all=dl.every(m=>st.d.claimed[m.id]);
  showModal(`<div class="mtitle">📋 ミッション</div>
    <div class="ms-h">今日のミッション（毎日0時に更新）</div>${dl.map(m=>row(m,st.d,'d')).join('')}
    <div class="ms-row"><div class="ms-t">3つとも受け取ると ボーナス（🌸${MS_BONUS}）</div>${st.d.bonus?'<span class="ms-done ms-go">受取済み</span>':all?`<button class="fr-b go ms-go" onclick="msClaim('b')">受け取る</button>`:'<span class="ms-n ms-go">—</span>'}</div>
    <div class="ms-h">今週の目標（毎週月曜に更新）</div>${MS_WEEKLY.map(m=>row(m,st.w,'w')).join('')}
    <button class="mbtn" style="margin-top:.8rem" onclick="document.getElementById('modal').classList.remove('open')">閉じる</button>`);
  msBadge();
}
window.addEventListener('load',()=>setTimeout(msBadge,1500));
// ===== CPU戦を観戦してもらう（見ている人がいるあいだだけ、公開してよい情報を送る）=====
window.__bs=0;let _botSpecT=0,_botSpecTimer=null;
function botSpecState(){
  return {phase:G.phase,turn:G.turn,tphase:G.tphase,goal:G.goal||WIN_SCORE,
    scores:G.players.map(p=>({name:p.name,score:p.score,riichi:!!p.riichi,hand:p.hand.length,tiles:p.hand.map(t=>({id:t.id,top:t.top,bot:t.bot,flip:!!t.flip}))})),
    fieldCount:G.field.filter(t=>!t.discarded).length,
    discards:G.field.filter(t=>t.discarded).map(t=>({id:t.id,top:t.top,bot:t.bot,flip:!!t.flip}))};
}
function botSpecPush(force){
  if(!(window.__bs>0)||onlineMode||!G||!G.players||!fsocket||!fsocket.connected)return;
  clearTimeout(_botSpecTimer);
  _botSpecTimer=setTimeout(()=>{if(!(window.__bs>0)||onlineMode||!G||!G.players)return;_botSpecT=Date.now();fsocket.emit('bot_spec',{state:botSpecState()});},force?0:Math.max(0,300-(Date.now()-_botSpecT)));
}
function botSpecNote(w){
  if(!(window.__bs>0)||onlineMode||!G||!G.players||!G.players[w]||!fsocket||!fsocket.connected)return;
  fsocket.emit('bot_spec_note',{text:G.players[w].name+' が上がりました！'});
}
function frInvite(code){
  if(!currentCode){toast('先に部屋を作ってください');return;}
  fsocket?.emit('friend_invite',{to:code,room:currentCode});toast('📨 招待を送りました');
}
function frAdd(){
  const el=document.getElementById('fr-add-input'),code=(el.value||'').toUpperCase().replace(/[\s-]/g,''),s=frState();
  if(!/^[A-HJ-NP-Z2-9]{8}$/.test(code)){toast('コードは8文字です（例：K7M2QX9P）');return;}
  if(code===s.code){toast('それはあなた自身のコードです');return;}
  if(s.list.some(f=>f.code===code)){toast('すでに登録しています');return;}
  if(s.list.length>=100){toast('フレンドは100人までです');return;}
  s.declined=s.declined.filter(c=>c!==code);
  s.list.push({code,name:'',confirmed:false});saveFriendState();frSync();el.value='';frRender();
  toast('📨 申請しました。相手が承認するとフレンドになります');
}
function frAccept(code){const s=frState();if(!s.list.some(f=>f.code===code))s.list.push({code,name:'',confirmed:false});frRequests=frRequests.filter(r=>r.code!==code);saveFriendState();frSync();frUpdateBadge();frRender();}
function frDecline(code){const s=frState();if(!s.declined.includes(code))s.declined.push(code);frRequests=frRequests.filter(r=>r.code!==code);saveFriendState();frUpdateBadge();frRender();}
function frRemove(code){if(!confirm('このフレンドを削除しますか？'))return;const s=frState();s.list=s.list.filter(f=>f.code!==code);saveFriendState();frSync();frRender();}
function frCopy(){const c=frState().code;(navigator.clipboard?navigator.clipboard.writeText(c):Promise.reject()).then(()=>toast('📋 コードをコピーしました')).catch(()=>toast('コード：'+c));}
function openFriends(){
  friendConnect();frSync();
  showModal(`<div class="mtitle">👥 フレンド</div><div id="fr-box"></div><button class="mbtn" style="background:#2a1e14;color:#c9a84c;border:1px solid #5a4020;margin-top:.6rem" onclick="document.getElementById('modal').classList.remove('open')">閉じる</button>`);
  frRender();
}
function frRender(){
  const box=document.getElementById('fr-box');if(!box)return;
  const s=frState(),conn=fsocket&&fsocket.connected,av=u=>{const src=avatarSrc(u||'');return src?`<img class="fr-av" src="${esc(src)}" alt="" onerror="this.style.display='none'">`:`<div class="fr-av">👤</div>`;};
  const stLabel={lobby:['オンライン','on'],room:['部屋にいます','on'],playing:['対戦中','play'],bot:['CPU戦中','play']};
  let h=`<div class="fr-h" style="margin-top:.2rem">あなたのフレンドコード</div>
    <div class="fr-code"><b>${esc(s.code)}</b><button class="fr-b" onclick="frCopy()">コピー</button></div>
    <div style="font-size:.7rem;color:#8a7048;margin:.3rem 0">このコードを友だちに教えて、友だちのコードを下に入力すると、フレンドになれます。${conn?'':'<br>⏳ サーバーに接続中です（初回は少し時間がかかります）'}</div>
    <div class="fr-h">フレンドを追加</div>
    <div style="display:flex;gap:.4rem"><input id="fr-add-input" class="finput" maxlength="12" placeholder="友だちのコード（8文字）" style="flex:1;text-transform:uppercase" onkeydown="if(event.key==='Enter')frAdd()"><button class="fr-b go" onclick="frAdd()">申請</button></div>`;
  if(frRequests.length){
    h+=`<div class="fr-h">申請が届いています</div>`+frRequests.map(r=>`<div class="fr-row">${av(r.avatar)}<div class="fr-info"><div class="fr-name">${esc(r.name||'名無し')}</div><div class="fr-st">フレンドになりたいそうです</div></div><button class="fr-b go" onclick="frAccept('${r.code}')">承認</button><button class="fr-b del" onclick="frDecline('${r.code}')">拒否</button></div>`).join('');
  }
  h+=`<div class="fr-h">フレンド（${s.list.filter(f=>f.confirmed).length}人）</div>`;
  if(!s.list.length)h+=`<div style="font-size:.78rem;color:#6a5830">まだフレンドがいません</div>`;
  h+=s.list.map(f=>{
    if(!f.confirmed)return `<div class="fr-row">${av('')}<div class="fr-info"><div class="fr-name">${esc(f.code)}</div><div class="fr-st">承認待ち（相手がオンラインのときに届きます）</div></div><button class="fr-b del" onclick="frRemove('${f.code}')">取消</button></div>`;
    const on=f.online&&!f.pending,l=on?(stLabel[f.status]||stLabel.lobby):[f.pending?'承認待ち':'オフライン',''];
    const btns=(on&&(f.status==='playing'||f.status==='bot')?`<button class="fr-b go" onclick="frSpectate('${f.code}')">観戦</button>`:'')+(on?`<button class="fr-b" onclick="frMsgOpen('${f.code}')">メッセージ</button>`:'')+(on&&f.status==='room'&&f.room?`<button class="fr-b go" onclick="frJoinRoom('${f.room}')">参加</button>`:'')+(on&&currentCode?`<button class="fr-b" onclick="frInvite('${f.code}')">招待</button>`:'')+`<button class="fr-b del" onclick="frRemove('${f.code}')">削除</button>`;
    return `<div class="fr-row" style="${on?'':'opacity:.65'}">${av(f.avatar)}<div class="fr-info"><div class="fr-name">${esc(f.name||'名無し')}${f.title?` <span style="font-size:.68rem;color:#f5d040">${esc((GACHA_ITEMS.find(x=>x.id===f.title)||{}).title||'')}</span>`:''}</div><div class="fr-st ${l[1]}">${l[0]}</div></div>${btns}</div>`;
  }).join('');
  const keep=document.getElementById('fr-add-input'),v=keep?keep.value:'';
  box.innerHTML=h;const ni=document.getElementById('fr-add-input');if(ni&&v)ni.value=v;
}
window.addEventListener('load',()=>{setTimeout(friendConnect,2500);setInterval(frReportStatus,3000);setInterval(frSync,45000);});
// ===== クイックマッチで人が見つからないとき：CPUが相手になる =====
// ニックネームは、よくある呼び名の部品を組み合わせて作った架空のもの（実在のアカウントは使っていません）。
const _NK={
  a:['はる','そら','ゆう','れん','りく','みお','あおい','ひなた','かい','ゆい','めい','さく','こう','だい','しょう','まひろ','りん','なな','たく','けん','みく','あや','ゆず','もも','れお','いつき','はな','しん','ともや','かな','あきら','まこと','ひろ','なつ','ゆき','りょう','たけ','こた','えみ','みなと'],
  b:['ねこ','いぬ','うさぎ','もち','だいふく','たぬき','くま','ぱんだ','ぽん','ふわ','まる','ころ','きなこ','みかん','れもん','ぷりん','おにぎり','らーめん','たこ焼き','抹茶','コーヒー','ココア','麻雀','ガチャ','ゲーム','夜更かし','猫','月','星','雪','桜','海','空'],
  s:['','','','ちゃん','くん','さん','ぴ','🌙','☆','♪','_'],
  e:['sora','haru','yuki','ren','kai','mio','hina','riku','aoi','nana','mochi','neko','coco','luna','leo','yu','miyu','tak','shun','rin','kou','mai','sho','ken'],
  t:['好き','党','の民','大好き','マン','です','日和','中毒','ぱんち','研究所'],
  w:['ガチャ中','低浮上','ゲーム垢','のんびり','ひま','趣味垢','修行中','マイペース']
};
function botNickname(){
  const r=a=>a[Math.floor(Math.random()*a.length)],n=m=>Math.floor(Math.random()*m),d=()=>String(n(10000)).padStart(2+n(3),'0').slice(-4);
  const k=n(10);let s;
  if(k<3)s=r(_NK.a)+r(_NK.s);
  else if(k<5)s=r(_NK.b)+r(_NK.t);
  else if(k<7)s=r(_NK.e)+r(['','_','__'])+d();
  else if(k<9)s=r(_NK.a)+'@'+r(_NK.w);
  else s=r(_NK.b)+d();
  return s.slice(0,14);
}
// CPUの背景・アイコンは、ランダムに選ぶ（出やすさは、ガチャのレア度が低いほど高い）
function _wpick(items){
  const W={common:5,uncommon:3,rare:2,superrare:1},ws=items.map(it=>W[it.rarity]||1);
  let r=Math.random()*ws.reduce((a,b)=>a+b,0);
  for(let i=0;i<items.length;i++){r-=ws[i];if(r<=0)return items[i];}
  return items[0];
}
function botRandomBg(prev){ // prev：直前の背景（同じものが続けて出ないようにする）
  if(Math.random()<.1&&prev)return ''; // ときどき、初期の背景
  const pool=GACHA_ITEMS.filter(it=>it.category==='fieldbg'&&!it.event&&!it.loginStar&&!it.achievement&&!it.gold);
  if(!pool.length)return '';
  for(let k=0;k<6;k++){const v='preset:'+_wpick(pool).id;if(v!==prev)return v;}
  return '';
}
function botRandomIcon(){
  if(Math.random()<.3)return ''; // 3人に1人くらいは、アイコンなし（名前の頭文字）
  const pool=GACHA_ITEMS.filter(it=>it.category==='gicon'&&!it.event);
  return pool.length?'gicon:'+_wpick(pool).id:'';
}
let _qbTimer=null;
function quickBotStartTimer(){if(_qbTimer)return;_qbTimer=setTimeout(quickBotFallback,4000+Math.random()*3000);}
function quickBotClearTimer(){if(_qbTimer){clearTimeout(_qbTimer);_qbTimer=null;}}
function quickBotFallback(){
  _qbTimer=null;
  if(onlineMode||currentCode)return; // すでに対戦に入っている
  const go=()=>{
    if(onlineMode||currentCode)return;
    hideMatchFx(true);document.getElementById('btn-quick').disabled=false;
    const cb=document.getElementById('btn-cancel-quick');if(cb)cb.style.display='none';
    setOnlineStatus('','');startGame({quick:true,botName:botNickname(),botBg:botRandomBg(),botAvatar:botRandomIcon()});
  };
  if(socket&&socket.connected){
    let done=false;
    socket.once('queue_cancelled',d=>{if(done)return;done=true;if(!d||d.removed!==false)go();}); // removed:false は、すでにマッチしている（そのまま対戦に入る）
    socket.emit('cancel_queue');
    setTimeout(()=>{if(!done){done=true;go();}},2500);
  }else go(); // サーバーにつながらないときも、CPUが相手になる
}
// 手牌を選んでいるときに、選んだ牌まわりのボタン以外をタップすると、選択を解除する
document.addEventListener('click',e=>{
  if(typeof G==='undefined'||!G||G.selIdx===-1||G.selIdx===undefined||G.phase!=='playing')return;
  const t=e.target;if(!t||!t.closest)return;
  if(t.closest('.htile,#btn-discard,#btn-win,#riichi-btn,.abtn,#modal,#call-fx,#toast'))return; // 手牌・捨てる/上がる/リーチのボタン・ウィンドウは除く
  G.selIdx=-1;render();
});
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(_tt);_tt=setTimeout(()=>el.classList.remove('show'),2400);}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// スペースキー

document.addEventListener('keydown',e=>{if(e.code==='Space'||e.key===' '){e.preventDefault();if(G?.phase==='playing'&&G.turn===myOnlineIdx&&G.tphase==='discard'&&G.selIdx!==-1)doDiscard();}});

// 牌の選択中に他の場所を押したら選択解除
document.addEventListener('pointerdown',e=>{
  if(!G||G.selIdx===-1||G.phase!=='playing')return;
  if(e.target.closest('#hand-tiles,#flip-popup,button,.abtn,select,input,textarea,a,.modal,.overlay'))return;
  G.selIdx=-1;render();
});

// スクロール時にポップアップ再計算

document.getElementById('hand-tiles').addEventListener('scroll',()=>{if(G&&G.selIdx!==-1)requestAnimationFrame(updateFlipPopup);},{passive:true});
// 自動ログイン復元
(function(){
  customAvatarUrl = localStorage.getItem('rikka_avatar') || '';
  let bt = localStorage.getItem('rikka_back_theme');
  if(bt==='girl'||bt==='girlrun'){localStorage.removeItem('rikka_back_theme');bt='';}
  if(bt) document.body.classList.add('back-'+bt);
  updatePetalDisplays();
  const stored = localStorage.getItem('rikka_guser');
  if (!stored) { const gn=localStorage.getItem('rikka_name_guest'); if(gn)document.getElementById('pname').value=gn; return; }
  try {
    const u = JSON.parse(stored);
    gUser = {id:u.id||'', name:u.name||'', avatar:u.avatar||'', email:u.email||''};
    applyLobbyEvent();
    const savedName = localStorage.getItem('rikka_name_' + gUser.id) || gUser.name;
    document.getElementById('pname').value = savedName;
    document.getElementById('google-login-area').style.display = 'none';
    document.getElementById('google-user-info').style.display = 'flex';
    const av = myAvatarDisplaySrc();
    if(av){
      document.getElementById('google-avatar-img').src = av;
      document.getElementById('google-avatar-img').style.display = '';
      document.getElementById('google-avatar-init').style.display = 'none';
    } else {
      document.getElementById('google-avatar-init').textContent = savedName[0] || '?';
      document.getElementById('google-avatar-init').style.display = 'flex';
    }
    document.getElementById('google-display-name').textContent = savedName;
    document.getElementById('google-display-email').textContent = gUser.email;
  } catch(e) { localStorage.removeItem('rikka_guser'); }
})();
