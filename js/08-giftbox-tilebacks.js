
// ============================================================
// お届けBOX
// ============================================================
const GIFTBOX_ITEMS=[
  {id:'info_gold_gacha_all', info:true, title:'🌟 新ガチャ「黄金の精神」', desc:'ガチャ画面を横にスワイプすると「黄金の精神」が出ます。\n引いた景品は、カスタマイズで選べます。\n\n【動くプレイヤーアイコン 6種】\n疾風の甲冑剣士・恐竜化の咆哮・プロペラの爆撃機・空中に止まる雨・六人の弾丸小隊・潜り込む影\n\n【演出 32種】\nリーチ：糸・シャボン玉・威圧・ディスク・重力反転・過程消去・削り取る・ジッパー・絶対零度・潜り込み・蹴り弾\nロン：ラッシュ・爪弾・重い雨・光刃・戦車爆弾・赤光線・殺人ウイルス・磁力の刃・機銃掃射と爆撃・目にも留まらぬ剣技\n上がり：芽吹き・修復・時間停止・止まった世界・巻き戻し・宇宙一巡・天候・命令の本・癒しの料理・静止する雨・恐竜化\n\n【場の背景 13種】\nディスクの海・反転した街・消えたコマ・光の刃・爆弾戦車隊・赤い閃光・静止した世界・巻き戻る時・宇宙の夜明け・レーダーの夜空・止まった雨の街・太古の密林・甲冑の間'},
  {id:'apology_ltd_items_1000', title:'🙇 お詫びと補填：花びら1000枚', desc:'期間限定ガチャで入手したアイテムが、期間終了後に表示されず、消えたように見える不具合がありました。ご迷惑とご心配をおかけし、誠に申し訳ございません。\n入手済みの景品は消えておらず、ガチャ画面の「期間限定景品（入手済み）」からいつでも装備できるように修正しました。\nお詫びとして、花びら1000枚をお届けします（お一人様1回限り）。', petals:1000},
  {id:'google_welcome_1000', title:'🎉 今だけ！花びら1000枚プレゼント', desc:'Googleでログインしている方への特典です（お一人様1回限り）', petals:1000, condition:'google'},
  {id:'login_catchup_500', title:'🌸 ログインボーナス追加記念 花びら500枚', desc:'これまでログインしてくれた分のお礼です（お一人様1回限り）', petals:500},
  {id:'info_missions', info:true, title:'📋 ミッションを追加', desc:'メニュー（≡）の「ミッション」から開けます。達成すると、花びらがもらえます。\n【今日のミッション】毎日0時に3つが選ばれます（対戦する・勝つ・オンライン対戦をする・ガチャを引く など）。1つあたり花びら3〜8枚です。3つとも受け取ると、ボーナスで花びら5枚がもらえます\n【今週の目標】毎週月曜に更新されます。「10局勝つ」「オンライン対戦を10局する」「5日ログインする」「ガチャを10回引く」の4つで、1つあたり花びら20〜30枚です\n※達成したら「受け取る」を押すと、花びらが入ります。進み具合は、この端末に保存されます'},
  {id:'info_spectate', info:true, title:'👁 フレンドの対戦を観戦できるように', desc:'フレンドが対戦中のとき、フレンド画面に「観戦」ボタンが出ます。\n・見られるのは、場の牌の数、捨て牌、各プレイヤーの点数・リーチ・手番と、両方のプレイヤーの手牌です。場に伏せられている牌は見えません\n・上がり、ロン、流局、対戦終了も、画面の下に表示されます\n・観戦は、見るだけです。いつでも「退出」できます\n※お互いがフレンドで、相手が対戦中のときだけ観戦できます（1つの対戦につき、観戦は8人までです）'},
  {id:'info_quick_cpu', info:true, title:'🤖 クイックマッチについて', desc:'クイックマッチで5秒ほど待っても対戦相手が見つからないときは、CPUが相手になります。マッチング画面に注意書きを出し、CPU戦のときは、各ラウンドの結果画面で「今回の対戦相手は、CPUでした」とお知らせします。ルールは、基本役のみ・リーチなし・ロンなしで、通常のクイックマッチと同じです。'},
  {id:'info_friend', info:true, title:'👥 フレンド機能を追加', desc:'メニュー（≡）のカスタマイズの下に「フレンド」が加わりました。\n・自分のフレンドコード（8文字）を友だちに教えると、友だちが申請できます。承認するとフレンドになります\n・フレンドが、オンライン／部屋にいる／対戦中のどれかを見られます\n・部屋にいる友だちの部屋へ、ワンタッチで参加できます。自分の部屋には、友だちを招待できます\n※お互いが承認するまで、相手の名前や状態は見えません。フレンドコードは、友だちにだけ教えてください'},
  {id:'info_fix_security', info:true, title:'🛠 不具合の修正と安全対策', desc:'【修正】\n・ガチャ画面を開き直したとき、引く場所と中身の一覧が食い違うことがあった不具合を直しました\n・5人で遊ぶ部屋の待機画面が、4人分しか表示されていなかった不具合を直しました\n・動く牌の裏を設定していると、期間限定ガチャの一覧の牌の裏が別の柄に見えていた不具合を直しました\n【安全対策】\n・対戦相手にも見えるアイコン・場の背景の画像は、Google・GitHub・Imgur・Discord・ibb.co のものだけ表示されます（それ以外のサイトの画像は、相手には表示されません。自分の画面には出ます）\n・プレイヤー名は20文字までになりました\n・連打や、形のおかしい通信を受けても、サーバーが止まらないようにしました\n【確認】\n・六華はPHPを使っていないため、PHPの脆弱性の影響は受けません（確認済み）'},
  {id:'info_room5', info:true, title:'👥 プライベートマッチが最大5人に', desc:'プライベートマッチ（部屋コードで遊ぶ対戦）に、最大5人まで参加できるようになりました。2人以上そろえば、ホストが開始できます。'},
  {id:'info_assist_pause', info:true, title:'🛠 アシスト機能について', desc:'アシスト機能は、全容が完成するまで、いったんお休みします（サイドバーの「アシスト」を非表示にしました）。完成して公開するときに、あらためてお知らせします。'},
  {id:'info_fix_ltd_preview', info:true, title:'🛠 不具合の修正', desc:'動く牌の裏の柄をカスタマイズで設定していると、期間限定ガチャの景品一覧に並ぶ牌の裏の柄が、設定中の柄に置き換わって表示されてしまう不具合を修正しました。一覧では、それぞれの景品本来の柄が表示されます。'},
  {id:'info_event_halloween2026', info:true, title:'🎃 ハロウィンナイト開催！', desc:'ロビーの「🎃 ハロウィンナイト」から遊べるイベント戦です（10/19 〜 11/1）。\nイベントだけのルール（お菓子ラウンド・ロンの祝福）と、勝利数に応じた限定報酬があります。期間が終わるとイベントは消えます。'},
  {id:'info_limited_gacha1', info:true, title:'✨ 期間限定ガチャ開催！', desc:'ガチャ画面を横にスワイプすると「期間限定ガチャ」が出ます。\n開催期間：10/19 〜 11/2\n最高レアは場の背景「Game Over Ⅲ・Ⅳ」。ほかに新しい牌の裏・場の背景・動くアイコン、称号「国富平針店のバイト」が出ます。'},
  {id:'info_update_login_draw', info:true, title:'🛠 アップデート内容', desc:'・毎日ログインボーナスを追加（花びら50枚／7日ごとに称号「日々の花」、次の7日ごとに★が増えます）\n・全員リーチで誰も上がれなくなった場合、引き分けになって次のラウンドへ進むようにしました（CPU戦・オンライン対戦とも）'},
];
function loadGiftboxClaimed(){
  try{ return JSON.parse(localStorage.getItem('rikka_giftbox_claimed')||'[]'); }catch(e){ return []; }
}
function saveGiftboxClaimed(arr){ try{ localStorage.setItem('rikka_giftbox_claimed',JSON.stringify(arr)); }catch(e){} }
function isGiftEligible(gift){
  if(gift.condition==='google') return !!(gUser&&gUser.id);
  return true;
}
function hasUnclaimedGift(){
  const claimed=new Set(loadGiftboxClaimed());
  return GIFTBOX_ITEMS.some(g=>!g.info&&isGiftEligible(g)&&!claimed.has(g.id));
}
// 最後に開いたあとに追加・更新されたお届けがあるか
function loadGiftboxSeen(){try{return JSON.parse(localStorage.getItem('rikka_giftbox_seen')||'[]');}catch(e){return [];}}
function hasUnseenGift(){const seen=new Set(loadGiftboxSeen());return GIFTBOX_ITEMS.some(g=>!seen.has(g.id));}
function updateGiftboxDot(){
  const el=document.getElementById('giftbox-dot-wrap');
  if(!el)return;
  el.innerHTML=hasUnclaimedGift()?'<span class="giftbox-dot"></span>':'';
  const btn=document.getElementById('giftbox-lobby-btn');
  if(btn)btn.classList.toggle('giftbox-blink',hasUnseenGift());
}
window.addEventListener('load',()=>updateGiftboxDot());
// 一括受け取り：受け取れるものをまとめて受け取る
function claimAllGifts(){
  const claimed=loadGiftboxClaimed();let total=0;
  GIFTBOX_ITEMS.forEach(g=>{
    if(g.info||claimed.includes(g.id)||!isGiftEligible(g))return;
    claimed.push(g.id);total+=g.petals||0;
  });
  if(!total)return;
  saveGiftboxClaimed(claimed);
  addPetals(total);
  toast(`🌸 花びら${total}枚をまとめて受け取りました！`);
  playSound('win');
  launchConfetti();
  renderGiftbox();
  updateGiftboxDot();
}
function claimGift(id){
  const claimed=loadGiftboxClaimed();
  if(claimed.includes(id))return;
  const gift=GIFTBOX_ITEMS.find(g=>g.id===id);
  if(!gift||gift.info||!isGiftEligible(gift))return;
  claimed.push(id);
  saveGiftboxClaimed(claimed);
  if(gift.petals)addPetals(gift.petals);
  toast(`🌸 花びら${gift.petals}枚を受け取りました！`);
  playSound('win');
  launchConfetti();
  renderGiftbox();
  updateGiftboxDot();
}
function renderGiftbox(){
  const el=document.getElementById('giftbox-list');
  if(!el)return;
  const claimed=new Set(loadGiftboxClaimed());
  if(!GIFTBOX_ITEMS.length){
    el.innerHTML='<div class="giftbox-empty">現在お届け中のアイテムはありません</div>';
    return;
  }
  const pending=GIFTBOX_ITEMS.filter(g=>!g.info&&isGiftEligible(g)&&!claimed.has(g.id));
  const allBtn=pending.length>1?`<button class="giftbox-claim-btn" style="margin-bottom:.8rem" onclick="claimAllGifts()">🌸 一括受け取り（花びら${pending.reduce((s,g)=>s+(g.petals||0),0)}枚）</button>`:'';
  el.innerHTML=allBtn+GIFTBOX_ITEMS.map(g=>{
    const isClaimed=claimed.has(g.id);
    const eligible=isGiftEligible(g);
    let btnHtml;
    if(g.info) btnHtml='';
    else if(isClaimed) btnHtml=`<button class="giftbox-claim-btn" disabled>受け取り済み</button>`;
    else if(!eligible) btnHtml=`<button class="giftbox-claim-btn" disabled>🔒 Googleでログインすると受け取れます</button>`;
    else btnHtml=`<button class="giftbox-claim-btn" onclick="claimGift('${g.id}')">受け取る</button>`;
    return `<div class="giftbox-item">
      <div class="giftbox-item-title">${esc(g.title)}</div>
      <div class="giftbox-item-desc" style="white-space:pre-line">${esc(g.desc)}</div>
      ${btnHtml}
    </div>`;
  }).join('');
}
function openGiftbox(){
  try{localStorage.setItem('rikka_giftbox_seen',JSON.stringify(GIFTBOX_ITEMS.map(g=>g.id)));}catch(e){}
  updateGiftboxDot();
  renderGiftbox();
  showScreen('giftbox');
}
function closeGiftbox(){ showScreen('lobby'); }

function switchStatsTab(tab){
  currentStatsTab=tab;
  const GOLD='linear-gradient(135deg,#c9a84c,#a07020)',TEAL='linear-gradient(135deg,#2a9e8e,#1a6e60)',BASE='#1a1410';
  document.getElementById('stats-tab-bot').style.background=tab==='bot'?GOLD:BASE;
  document.getElementById('stats-tab-bot').style.color=tab==='bot'?'#160e00':'#6a5830';
  document.getElementById('stats-tab-online').style.background=tab==='online'?TEAL:BASE;
  document.getElementById('stats-tab-online').style.color=tab==='online'?'#e0fff8':'#6a5830';
  renderSidebarStats();
}
let historyOpen = false;
function toggleHistory(){
  historyOpen = !historyOpen;
  const el = document.getElementById('history-list-sb');
  const icon = document.getElementById('history-toggle-icon');
  el.style.display = historyOpen ? '' : 'none';
  icon.textContent = historyOpen ? '▼' : '▶';
}
function renderSidebarStats(){
  const h=JSON.parse(localStorage.getItem('rikka_history')||'[]');
  const isOnline=currentStatsTab==='online';
  const filtered=h.filter(r=>r.online===isOnline);
  const wins=filtered.filter(r=>r.won).length;
  const total=filtered.length;
  const rate=total>0?Math.round(wins/total*100):0;
  const roles={'無双':0,'六華':0,'輝光':0,'三連':0,'三色':0,'三対':0,'一色':0};  filtered.filter(r=>r.won&&r.role).forEach(r=>{if(roles[r.role]!==undefined)roles[r.role]++;});
  document.getElementById('stats-content').innerHTML=`
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-title">対戦数</div><div class="stat-card-val">${total}</div></div>
      <div class="stat-card"><div class="stat-card-title">勝利数</div><div class="stat-card-val">${wins}</div></div>
      <div class="stat-card"><div class="stat-card-title">勝率</div><div class="stat-card-val">${rate}%</div></div>
      <div class="stat-card"><div class="stat-card-title">役内訳(勝)</div>
        <div style="font-size:.66rem;color:#8a7048;margin-top:.2rem">無双${roles['無双']} / 六華${roles['六華']} / 輝光${roles['輝光']} / 三連${roles['三連']} / 三色${roles['三色']} / 三対${roles['三対']} / 一色${roles['一色']}</div>
      </div>
    </div>`;
  const el=document.getElementById('history-list-sb');
  const recent=filtered.slice(0,10);
  if(!recent.length){el.innerHTML='<div style="color:#5a4820;font-size:.74rem;text-align:center;padding:.4rem">まだ対戦履歴がありません</div>';return;}
  el.style.display = historyOpen ? '' : 'none';
  document.getElementById('history-toggle-icon').textContent = historyOpen ? '▼' : '▶';
  el.innerHTML=recent.map(r=>`
    <div class="history-item">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="color:#8a7048;font-size:.7rem">${r.date}</span>
        <span style="color:${r.won?'#60c870':'#e05050'};font-weight:700;font-size:.76rem">${r.won?'勝利':'敗北'}</span>
      </div>
      ${r.won&&r.role?`<div style="color:#e8c97a;font-size:.7rem">${r.role} +${r.pts}点</div>`:''}
      <div style="color:#6a5830;font-size:.68rem">${(r.players||[]).map(esc).join(' vs ')}</div>
    </div>`).join('');
}
function updateAvatarDisplay(){
  const wrap=document.getElementById('sb-avatar-wrap');
  const av=myAvatarDisplaySrc();
  if(av)wrap.innerHTML=`<img src="${av}" style="width:52px;height:52px;border-radius:50%;object-fit:cover" alt="">`;
  else{const name=document.getElementById('pname').value||'プレイヤー';wrap.innerHTML=name[0]||'👤';}
}
function updateLobbyAvatar(){
  const av=myAvatarDisplaySrc();
  const img=document.getElementById('google-avatar-img');
  if(img)img.src=av;
}
function openIconModal(){
  document.getElementById('icon-modal').classList.add('open');
  document.getElementById('icon-url-input').value=customAvatarUrl;
  previewIcon();
}
function closeIconModal(){document.getElementById('icon-modal').classList.remove('open');}
function previewIcon(){
  const url=document.getElementById('icon-url-input').value.trim();
  const wrap=document.getElementById('icon-preview-wrap');
  if(url)wrap.innerHTML=`<img src="${url}" style="width:72px;height:72px;object-fit:cover" alt="" onerror="this.parentNode.innerHTML='👤'">`;
  else wrap.innerHTML='👤';
}
function saveIcon(){
  customAvatarUrl=document.getElementById('icon-url-input').value.trim();
  if(customAvatarUrl)localStorage.setItem('rikka_avatar',customAvatarUrl);
  else localStorage.removeItem('rikka_avatar');
  updateAvatarDisplay();
  updateLobbyAvatar();
  syncMyAvatar();
  closeIconModal();
  toast('アイコンを更新しました！');
  refreshCustomize();
}
function resetIcon(){
  customAvatarUrl='';
  localStorage.removeItem('rikka_avatar');
  document.getElementById('icon-url-input').value='';
  previewIcon();
  updateAvatarDisplay();
  updateLobbyAvatar();
  syncMyAvatar();
  refreshCustomize();
}

// ============================================================

// サイドバー

// ============================================================
// ============================================================
// 牌の裏柄のアニメーション（場に伏せてある牌の上に、柄ごとの動きを重ねる）
//  龍の裏地では、金色の龍が牌の中を泳ぎます
// ============================================================
const _fr=x=>x-Math.floor(x);
function _star4t(c,x,y,r){c.beginPath();for(let k=0;k<8;k++){const rr=k%2?r*.28:r,a=k*Math.PI/4;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();}
function _sweep(c,w,h,s,rgb,al,wd){ // 斜めの光の帯（s: 0→1 で左上から右下へ）
  const p=(s*(w+h*.6)-h*.3);c.save();c.translate(p,0);c.transform(1,0,-.45,1,0,0);
  const g=c.createLinearGradient(-wd,0,wd,0);g.addColorStop(0,`rgba(${rgb},0)`);g.addColorStop(.5,`rgba(${rgb},${al})`);g.addColorStop(1,`rgba(${rgb},0)`);
  c.fillStyle=g;c.fillRect(-wd,-4,wd*2,h+8);c.restore();
}
const TILE_BACK_ANIMS={
  ember(c,w,h,t,ph){
    const gl=c.createRadialGradient(w/2,h*1.05,0,w/2,h*1.05,h*.7);gl.addColorStop(0,`rgba(255,120,30,${.25+.1*Math.sin(t*5+ph*9)})`);gl.addColorStop(1,'rgba(255,120,30,0)');c.fillStyle=gl;c.fillRect(0,0,w,h);
    c.globalCompositeOperation='lighter';
    for(let k=0;k<7;k++){const s=_fr(t*.35+ph+k/7),x=w*(.15+.7*_fr(k*.37+ph))+Math.sin(t*2+k*2)*w*.06,y=h*(1.05-1.15*s);
      c.fillStyle=`rgba(255,${(150+90*(1-s))|0},40,${Math.sin(Math.PI*s)*.95})`;c.beginPath();c.arc(x,y,1.1+(1-s)*.9,0,6.283);c.fill();}
    c.globalCompositeOperation='source-over';
  },
  ice(c,w,h,t,ph){
    c.fillStyle='#fff';c.globalCompositeOperation='lighter';
    [[.25,.3],[.7,.68]].forEach(([x,y],i)=>{c.globalAlpha=Math.max(0,Math.sin(t*2+ph*8+i*2.4));_star4t(c,w*x,h*y,w*.09);});
    c.globalAlpha=1;c.globalCompositeOperation='source-over';
  },
  sakura(c,w,h,t,ph){
    c.fillStyle='#ffc0d4';
    for(let k=0;k<3;k++){const s=_fr(t*.18+ph+k/3),x=w*(.2+.6*_fr(k*.41+ph))+Math.sin(t*1.4+k*2)*w*.12,y=h*(-.1+1.2*s);
      c.globalAlpha=Math.sin(Math.PI*s)*.85;c.save();c.translate(x,y);c.rotate(t*.8+k);c.scale(1,.45+.55*Math.abs(Math.cos(t*1.2+k)));c.beginPath();c.ellipse(0,0,w*.09,w*.05,0,0,6.283);c.fill();c.restore();}
    c.globalAlpha=1;
  },
  jade(c,w,h,t,ph){
    c.globalCompositeOperation='lighter';const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,h*.55);g.addColorStop(0,`rgba(80,230,180,${.1+.08*Math.sin(t*1.5+ph*8)})`);g.addColorStop(1,'rgba(80,230,180,0)');c.fillStyle=g;c.fillRect(0,0,w,h);c.globalCompositeOperation='source-over';
  },
  gold(c,w,h,t,ph){
    c.fillStyle='#fff6c0';c.globalCompositeOperation='lighter';c.globalAlpha=Math.max(0,Math.sin(t*2.2+ph*7))*.9;_star4t(c,w*.72,h*.25,w*.08);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  },
  indigo(c,w,h,t,ph){
    const s=_fr(t/3.8+ph);
    if(s<.3){const k=s/.3,x=w*(-.1+1.2*k),y=h*(-.05+.7*k),g=c.createLinearGradient(x,y,x-w*.5,y-h*.35);g.addColorStop(0,'rgba(220,230,255,.95)');g.addColorStop(1,'rgba(220,230,255,0)');
      c.strokeStyle=g;c.lineWidth=1.2;c.beginPath();c.moveTo(x,y);c.lineTo(x-w*.5,y-h*.35);c.stroke();}
    c.fillStyle='#cfe0ff';[[.2,.3],[.75,.55],[.4,.8]].forEach(([x,y],i)=>{c.globalAlpha=.2+.7*Math.abs(Math.sin(t*1.6+ph*6+i*2));c.beginPath();c.arc(w*x,h*y,.9,0,6.283);c.fill();});c.globalAlpha=1;
  },
  galaxy(c,w,h,t,ph){
    c.fillStyle='#fff';
    for(let k=0;k<7;k++){c.globalAlpha=.15+.8*Math.abs(Math.sin(t*(.9+k*.13)+ph*9+k*2));c.beginPath();c.arc(w*_fr(k*.6180+ph),h*_fr(k*.3819+ph*.7),.7+(k%3)*.3,0,6.283);c.fill();}
    c.globalAlpha=1;const s=_fr(t/4+ph);
    if(s<.28){const k=s/.28,x=w*(1.1-1.2*k),y=h*(.05+.5*k),g=c.createLinearGradient(x,y,x+w*.5,y-h*.3);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba(255,255,255,0)');c.strokeStyle=g;c.lineWidth=1.1;c.beginPath();c.moveTo(x,y);c.lineTo(x+w*.5,y-h*.3);c.stroke();}
  },
};

// 場全体を横切る動き。牌の表面にだけ映る（牌のすきまでは見えなくなるので、牌から牌へ伝っていくように見える）
// ── リアルな龍の描画 ──
function _catmull(nodes,per){
  const n=nodes.length,out=[];
  for(let i=0;i<n-1;i++){
    const p0=nodes[Math.max(i-1,0)],p1=nodes[i],p2=nodes[i+1],p3=nodes[Math.min(i+2,n-1)];
    for(let k=0;k<per;k++){const u=k/per,u2=u*u,u3=u2*u;
      out.push({x:.5*((2*p1.x)+(-p0.x+p2.x)*u+(2*p0.x-5*p1.x+4*p2.x-p3.x)*u2+(-p0.x+3*p1.x-3*p2.x+p3.x)*u3),
                y:.5*((2*p1.y)+(-p0.y+p2.y)*u+(2*p0.y-5*p1.y+4*p2.y-p3.y)*u2+(-p0.y+3*p1.y-3*p2.y+p3.y)*u3)});}
  }
  out.push({x:nodes[n-1].x,y:nodes[n-1].y});return out;
}
function _ribbon(c,P,shift,wf,fill,alpha,from,to){
  const a=from||0,b=to||P.length-1;c.globalAlpha=alpha===undefined?1:alpha;c.fillStyle=fill;c.beginPath();
  for(let i=a;i<=b;i++){const p=P[i];c.lineTo(p.x+p.nx*p.r*(shift+wf),p.y+p.ny*p.r*(shift+wf));}
  for(let i=b;i>=a;i--){const p=P[i];c.lineTo(p.x+p.nx*p.r*(shift-wf),p.y+p.ny*p.r*(shift-wf));}
  c.closePath();c.fill();c.globalAlpha=1;
}
function _drawDragon(c,nodes,ts,t,dir){
  const S=_catmull(nodes,4),L=S.length,R0=ts*.27;
  const P=S.map((p,i)=>{
    const a=S[Math.max(0,i-1)],b=S[Math.min(L-1,i+1)];let tx=b.x-a.x,ty=b.y-a.y;const m=Math.hypot(tx,ty)||1;tx/=m;ty/=m;
    const nx=-ty*dir,ny=tx*dir; // (nx,ny) は常に「背中側」（左へ進むときも右へ進むときも、背中が上）
    const f=i/(L-1);
    return {x:p.x,y:p.y,tx,ty,nx,ny,f,r:R0*(.2+.8*Math.pow(1-f,.75))*(i<6?.82+.03*i:1)};
  });
  const gold=ts*.025;c.lineCap='round';c.lineJoin='round';
  // ---- 脚（体の後ろ側に描く） ----
  [[.30,0],[.62,1]].forEach(([f,ph])=>{
    const p=P[Math.floor(f*(L-1))];if(!p)return;
    [-1,1].forEach(side=>{
      const sw=Math.sin(t*3.4+ph*2+side)*.4,bx=p.x-p.nx*p.r*.6,by=p.y-p.ny*p.r*.6;
      const a1=Math.atan2(-p.ny,-p.nx)+side*.9+sw,l1=ts*.42,k1x=bx+Math.cos(a1)*l1,k1y=by+Math.sin(a1)*l1;
      const a2=a1-side*.9+sw*.6,l2=ts*.36,fx=k1x+Math.cos(a2)*l2,fy=k1y+Math.sin(a2)*l2;
      c.strokeStyle='#6a4208';c.lineWidth=p.r*.55;c.beginPath();c.moveTo(bx,by);c.lineTo(k1x,k1y);c.lineTo(fx,fy);c.stroke();
      c.strokeStyle='#d8a82a';c.lineWidth=p.r*.34;c.beginPath();c.moveTo(bx,by);c.lineTo(k1x,k1y);c.lineTo(fx,fy);c.stroke();
      c.strokeStyle='#fff0c0';c.lineWidth=Math.max(.6,ts*.02);
      for(let k=-1;k<=1;k++){const ca=a2+k*.55;c.beginPath();c.moveTo(fx,fy);c.quadraticCurveTo(fx+Math.cos(ca)*ts*.1,fy+Math.sin(ca)*ts*.1,fx+Math.cos(ca+.4)*ts*.16,fy+Math.sin(ca+.4)*ts*.16);c.stroke();}
    });
  });
  // ---- 背びれ・たてがみ（背中側） ----
  for(let i=2;i<L-2;i+=3){
    const p=P[i],s=p.r*(1.1-.5*p.f)*(p.f<.22?1.7:1),tipx=p.x+p.nx*(p.r+s)+p.tx*s*.9,tipy=p.y+p.ny*(p.r+s)+p.ty*s*.9;
    const g=c.createLinearGradient(p.x+p.nx*p.r,p.y+p.ny*p.r,tipx,tipy);g.addColorStop(0,'#e8a020');g.addColorStop(1,'#d83a14');
    c.fillStyle=g;c.beginPath();c.moveTo(p.x+p.nx*p.r*.9-p.tx*p.r*.5,p.y+p.ny*p.r*.9-p.ty*p.r*.5);c.quadraticCurveTo(p.x+p.nx*(p.r+s*.7),p.y+p.ny*(p.r+s*.7),tipx,tipy);
    c.lineTo(p.x+p.nx*p.r*.9+p.tx*p.r*.6,p.y+p.ny*p.r*.9+p.ty*p.r*.6);c.closePath();c.fill();
  }
  // ---- 胴体（円筒に見えるよう、明るさの違う帯を重ねる） ----
  _ribbon(c,P,0,1.0,'#3a2204');                    // 輪郭
  _ribbon(c,P,0,.93,'#a86a14');                    // 影
  _ribbon(c,P,.12,.78,'#d8a42a');             // 本体
  _ribbon(c,P,.4,.26,'#fff0a8',.55,0,L-1);            // ハイライト（背中側にずらす）
  // 腹の板（淡い色）
  for(let i=4;i<L-4;i+=2){const p=P[i];
    c.fillStyle='rgba(246,226,160,.85)';c.beginPath();
    const a=P[i],b=P[Math.min(L-1,i+2)];
    c.moveTo(a.x-a.nx*a.r*.5,a.y-a.ny*a.r*.5);c.lineTo(a.x-a.nx*a.r*.95,a.y-a.ny*a.r*.95);c.lineTo(b.x-b.nx*b.r*.95,b.y-b.ny*b.r*.95);c.lineTo(b.x-b.nx*b.r*.5,b.y-b.ny*b.r*.5);c.closePath();c.fill();
    c.strokeStyle='rgba(150,100,20,.7)';c.lineWidth=Math.max(.4,ts*.012);c.beginPath();c.moveTo(a.x-a.nx*a.r*.5,a.y-a.ny*a.r*.5);c.lineTo(a.x-a.nx*a.r*.95,a.y-a.ny*a.r*.95);c.stroke();}
  // うろこ（重なる小さな弧）
  c.strokeStyle='rgba(70,40,4,.5)';c.lineWidth=Math.max(.4,ts*.014);
  for(let i=6;i<L-2;i+=2){const p=P[i];
    for(let row=-1;row<=1;row++){const off=row*p.r*.5+((i/2)%2?p.r*.25:0),cx=p.x+p.nx*off,cy=p.y+p.ny*off,ang=Math.atan2(p.ty,p.tx);
      c.beginPath();c.arc(cx,cy,Math.max(.8,p.r*.42),ang-1.3,ang+1.3);c.stroke();}}
  // しっぽの先の飾り毛
  const e=P[L-1];c.strokeStyle='#d83a14';c.lineWidth=Math.max(.8,ts*.03);
  for(let k=-2;k<=2;k++){const a=Math.atan2(e.ty,e.tx)+k*.4+Math.sin(t*5+k)*.12;c.beginPath();c.moveTo(e.x,e.y);c.quadraticCurveTo(e.x+Math.cos(a)*ts*.3,e.y+Math.sin(a)*ts*.3,e.x+Math.cos(a+.5)*ts*.55,e.y+Math.sin(a+.5)*ts*.55);c.stroke();}
  // ---- 頭 ----
  const h=P[0],fx=-h.tx,fy=-h.ty,ux=h.nx,uy=h.ny,hr=R0*1.25,open=.1+.06*Math.sin(t*2.4);
  const H=(a,b)=>({x:h.x+fx*hr*a+ux*hr*b,y:h.y+fy*hr*a+uy*hr*b});
  // 角（枝分かれ）
  c.strokeStyle='#f2e2a0';c.lineWidth=Math.max(.9,ts*.04);
  [[.3,.9,-.9],[.5,.7,-.5]].forEach(([a,b,dx],i)=>{const s0=H(a,b),s1=H(a-1.3,b+.9+i*.1),s2=H(a-2,b+.5);
    c.beginPath();c.moveTo(s0.x,s0.y);c.quadraticCurveTo(s1.x,s1.y,s2.x,s2.y);c.stroke();
    const br=H(a-1.4,b+.95);c.beginPath();c.moveTo(br.x,br.y);const bt=H(a-1.1,b+1.8);c.lineTo(bt.x,bt.y);c.stroke();});
  // 下あご
  const j0=H(-.2,-.5),j1=H(1.5,-.5-open*5),j2=H(2.5,-.2-open*4),j3=H(.2,-1.0);
  c.fillStyle='#b27a1a';c.strokeStyle='#3a2204';c.lineWidth=gold;c.beginPath();c.moveTo(j0.x,j0.y);c.quadraticCurveTo(j1.x,j1.y,j2.x,j2.y);c.quadraticCurveTo(H(1.4,-1.0-open*4).x,H(1.4,-1.0-open*4).y,j3.x,j3.y);c.closePath();c.fill();c.stroke();
  c.fillStyle='#d83a2a';c.beginPath();c.moveTo(H(.6,-.55).x,H(.6,-.55).y);c.lineTo(H(2,-.5-open*3).x,H(2,-.5-open*3).y);c.lineTo(H(1.2,-.8-open*3).x,H(1.2,-.8-open*3).y);c.fill(); // 舌
  // 頭本体（鼻づらがせり出し、額が盛り上がる）
  const t0=H(-.8,.5),t1=H(.3,1.5),t2=H(1.6,1.0),t3=H(2.9,.35),t4=H(2.8,-.1),t5=H(1.4,-.05),t6=H(-.6,-.4);
  const hg=c.createLinearGradient(t1.x,t1.y,t6.x,t6.y);hg.addColorStop(0,'#f6d058');hg.addColorStop(1,'#a8701a');
  c.fillStyle=hg;c.strokeStyle='#3a2204';c.lineWidth=gold;c.beginPath();c.moveTo(t0.x,t0.y);c.quadraticCurveTo(t1.x,t1.y,t2.x,t2.y);c.quadraticCurveTo(H(2.5,.9).x,H(2.5,.9).y,t3.x,t3.y);
  c.quadraticCurveTo(H(3.1,.1).x,H(3.1,.1).y,t4.x,t4.y);c.quadraticCurveTo(t5.x,t5.y,H(.6,-.2).x,H(.6,-.2).y);c.lineTo(t6.x,t6.y);c.closePath();c.fill();c.stroke();
  // 牙
  c.fillStyle='#fffbe8';[1.0,1.7,2.4].forEach(a=>{const b0=H(a,-.12-open*1.5),b1=H(a+.18,-.12-open*1.5),tp=H(a+.08,-.5-open*3);c.beginPath();c.moveTo(b0.x,b0.y);c.lineTo(b1.x,b1.y);c.lineTo(tp.x,tp.y);c.fill();});
  // 鼻・まゆ・目
  c.fillStyle='#4a2a06';const ns=H(2.7,.45);c.beginPath();c.arc(ns.x,ns.y,Math.max(.7,hr*.1),0,6.283);c.fill();
  c.strokeStyle='#7a4a0a';c.lineWidth=Math.max(.7,ts*.03);c.beginPath();const b0=H(.5,1.0),b1=H(1.5,1.0);c.moveTo(b0.x,b0.y);c.lineTo(b1.x,b1.y);c.stroke();
  const ey=H(.95,.62);c.fillStyle='#fff4c0';c.beginPath();c.arc(ey.x,ey.y,Math.max(1,hr*.2),0,6.283);c.fill();
  c.fillStyle='#e02010';c.beginPath();c.arc(ey.x+fx*hr*.04,ey.y+fy*hr*.04,Math.max(.8,hr*.13),0,6.283);c.fill();
  c.globalCompositeOperation='lighter';const eg=c.createRadialGradient(ey.x,ey.y,0,ey.x,ey.y,hr*.7);eg.addColorStop(0,'rgba(255,90,40,.55)');eg.addColorStop(1,'rgba(255,90,40,0)');c.fillStyle=eg;c.fillRect(ey.x-hr,ey.y-hr,hr*2,hr*2);c.globalCompositeOperation='source-over';
  // ひげ（ゆらゆら流れる）
  c.strokeStyle='#f6ecb0';c.lineWidth=Math.max(.7,ts*.028);
  [[2.2,.5,1],[2.3,.1,-1]].forEach(([a,b,sd],i)=>{const s0=H(a,b),w=Math.sin(t*3+i*2)*.5;
    const c1=H(a+1.5,b+sd*1.6+w),c2=H(a+3.2,b+sd*.6-w*1.4),en=H(a+5,b+sd*2.2+w*2);
    c.beginPath();c.moveTo(s0.x,s0.y);c.bezierCurveTo(c1.x,c1.y,c2.x,c2.y,en.x,en.y);c.stroke();});
  // あごひげ
  c.strokeStyle='#e8d890';c.lineWidth=Math.max(.6,ts*.02);
  for(let k=0;k<3;k++){const s0=H(.9+k*.3,-.9),w=Math.sin(t*3.5+k)*.3,e1=H(.2+k*.2,-2.2+w);c.beginPath();c.moveTo(s0.x,s0.y);c.quadraticCurveTo(H(.8,-1.7).x,H(.8,-1.7).y,e1.x,e1.y);c.stroke();}
  // 宝珠（龍が追いかける、光る玉）
  const pb=H(6.4+Math.sin(t*2)*.3,1.2+Math.cos(t*1.7)*.3);
  c.globalCompositeOperation='lighter';const pg=c.createRadialGradient(pb.x,pb.y,0,pb.x,pb.y,hr*1.6);pg.addColorStop(0,'rgba(255,250,210,.95)');pg.addColorStop(.35,'rgba(255,220,100,.5)');pg.addColorStop(1,'rgba(255,200,60,0)');c.fillStyle=pg;c.beginPath();c.arc(pb.x,pb.y,hr*1.6,0,6.283);c.fill();
  c.globalCompositeOperation='source-over';c.fillStyle='#fff8d8';c.beginPath();c.arc(pb.x,pb.y,Math.max(1.2,hr*.34),0,6.283);c.fill();
}

const TILE_BACK_GLOBAL={
  // 龍：場の端から端まで、牌のうえを泳いで渡る（2匹が別のタイミングで）
  dragon(c,box,ts,t,st,dt){
    if(!st.d){st.d=[{dir:-1,ph:.0,sp:1/21,nodes:null,last:1},{dir:1,ph:.5,sp:1/25,nodes:null,last:1}];}
    const sp=ts*.27,NN=34;
    for(const d of st.d){
      const u=_fr(t*d.sp+d.ph);
      const prog=d.dir<0?(1.3-1.6*u):(-.3+1.6*u);
      const hx=box.w*prog,hy=box.h*(.5+.28*Math.sin(u*Math.PI*2*1.9+d.ph*9));
      if(!d.nodes||u<d.last-.5){d.nodes=Array.from({length:NN},(_,i)=>({x:hx-d.dir*i*sp,y:hy}));} // 端に戻ったら、画面の外から出直す
      d.last=u;
      d.nodes[0].x=hx;d.nodes[0].y=hy;
      for(let i=1;i<d.nodes.length;i++){const a=d.nodes[i-1],b=d.nodes[i],dx=a.x-b.x,dy=a.y-b.y,L=Math.hypot(dx,dy)||1;b.x=a.x-dx/L*sp;b.y=a.y-dy/L*sp;}
      _drawDragon(c,d.nodes,ts,t,d.dir);
      c.globalCompositeOperation='lighter';const gl=c.createRadialGradient(hx,hy,0,hx,hy,ts*1.8);gl.addColorStop(0,'rgba(255,200,60,.16)');gl.addColorStop(1,'rgba(255,200,60,0)');c.fillStyle=gl;c.fillRect(hx-ts*2,hy-ts*2,ts*4,ts*4);c.globalCompositeOperation='source-over';
    }
  },
  // 光の帯が、場全体をななめに横切る
  gold(c,box,ts,t){const s=_fr(t/6);if(s<.6)_gSweep(c,box,s/.6,'255,236,160',.4,ts*1.1);},
  ice(c,box,ts,t){_gSweep(c,box,_fr(t/5),'200,240,255',.3,ts*1.2);},
  jade(c,box,ts,t){_gSweep(c,box,_fr(t/7),'120,255,200',.24,ts*1.5);},
  obsidian(c,box,ts,t){const s=_fr(t/7);if(s<.5)_gSweep(c,box,s/.5,'210,210,255',.26,ts*.7);},
};
function _gSweep(c,box,s,rgb,al,wd){
  const p=s*(box.w+box.h*.5+wd*3)-wd*1.5-box.h*.25;c.save();c.translate(p,0);c.transform(1,0,-.45,1,0,0);
  const g=c.createLinearGradient(-wd,0,wd,0);g.addColorStop(0,`rgba(${rgb},0)`);g.addColorStop(.5,`rgba(${rgb},${al})`);g.addColorStop(1,`rgba(${rgb},0)`);
  c.fillStyle=g;c.fillRect(-wd,-box.h*.5,wd*2,box.h*2);c.restore();
}
let _tileAnim=null;
function tileAnimEnabled(){
  if(localStorage.getItem('rikka_tile_anim')==='0')return false;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
  return true;
}
function stopTileBackAnim(){
  if(!_tileAnim)return;_tileAnim.alive=false;cancelAnimationFrame(_tileAnim.raf);_tileAnim.ro&&_tileAnim.ro.disconnect();
  const cv=document.getElementById('tile-fx');if(cv)cv.remove();_tileAnim=null;
}
function refreshTileBackAnim(){
  stopTileBackAnim();
  const theme=localStorage.getItem('rikka_back_theme')||'';
  const draw=TILE_BACK_ANIMS[theme],glob=TILE_BACK_GLOBAL[theme],wrap=document.getElementById('field-wrap');
  if((!draw&&!glob)||!wrap||!tileAnimEnabled())return;
  const cv=document.createElement('canvas');cv.id='tile-fx';wrap.appendChild(cv);
  const ctx=cv.getContext('2d'),S={dpr:1,W:0,H:0},A={alive:true,raf:0,ro:null},state={};_tileAnim=A;
  const fit=()=>{const r=wrap.getBoundingClientRect();if(r.width<2)return;S.dpr=Math.min(window.devicePixelRatio||1,1.5);S.W=r.width;S.H=r.height;cv.width=Math.round(r.width*S.dpr);cv.height=Math.round(r.height*S.dpr);};
  fit();if(window.ResizeObserver){A.ro=new ResizeObserver(fit);A.ro.observe(wrap);}
  const rr=(c,x,y,w,h,r)=>{c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();};
  let last=performance.now();
  const frame=now=>{
    if(!A.alive)return;A.raf=requestAnimationFrame(frame);
    const g=document.getElementById('game');if(!g||!g.classList.contains('active')||document.hidden||S.W<2){last=now;return;}
    const dt=Math.min(2.5,(now-last)/16.67);last=now;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.setTransform(S.dpr,0,0,S.dpr,0,0);
    const wr=wrap.getBoundingClientRect(),tiles=[...wrap.querySelectorAll('.fback')],t=now/1000;
    if(!tiles.length)return;
    const pr=tiles[0].parentElement.getBoundingClientRect();
    const box={x:pr.left-wr.left,y:pr.top-wr.top,w:pr.width,h:pr.height};
    const vis=[];
    tiles.forEach((el,i)=>{const r=el.getBoundingClientRect();if(r.width<4||r.bottom<pr.top||r.top>pr.bottom)return;vis.push({x:r.left-wr.left,y:r.top-wr.top,w:r.width,h:r.height,i:i+1});});
    if(!vis.length)return;
    const ts=vis[0].w,rad=5*(ts/34);
    // 牌の表面だけに描く（すきまには出さない）
    ctx.save();ctx.beginPath();ctx.rect(box.x,box.y,box.w,box.h);ctx.clip();
    if(glob){
      // 牌が並んでいる範囲（すべての牌を囲む四角）を基準に動かす
      const x0=Math.min(...vis.map(v=>v.x)),y0=Math.min(...vis.map(v=>v.y)),x1=Math.max(...vis.map(v=>v.x+v.w)),y1=Math.max(...vis.map(v=>v.y+v.h));
      const gb={x:x0,y:y0,w:x1-x0,h:y1-y0};
      ctx.save();ctx.beginPath();vis.forEach(v=>rr(ctx,v.x,v.y,v.w,v.h,rad));ctx.clip();
      ctx.translate(gb.x,gb.y);glob(ctx,gb,ts,t,state,dt);ctx.restore();
    }
    if(draw){
      vis.forEach(v=>{ctx.save();ctx.beginPath();rr(ctx,v.x,v.y,v.w,v.h,rad);ctx.clip();ctx.translate(v.x,v.y);try{draw(ctx,v.w,v.h,t,((v.i*0.6180339)%1));}catch(e){}ctx.restore();});
    }
    ctx.restore();
  };
  A.raf=requestAnimationFrame(frame);
}

function setBackTheme(theme){
  document.body.className=document.body.className
    .replace(/\bback-\w+/g,'').trim();
  if(theme) document.body.classList.add('back-'+theme);
  localStorage.setItem('rikka_back_theme', theme);
  try{refreshTileBackAnim();warmTileBacks();}catch(e){}
}

// ============================================================
// 場の背景画像（カスタム画像。オンラインでは自分の番になると表示される）
// ============================================================
let customFieldBgUrl = localStorage.getItem('rikka_field_bg') || '';
function sanitizeFieldBgUrl(url){
  if(typeof url!=='string')return '';
  url=url.trim();
  if(!url)return '';
  if(!/^https:\/\//i.test(url))return ''; // httpsの画像URLのみ許可
  if(/["'\\()<>]/.test(url))return ''; // CSS/HTML属性から抜け出せる文字を含むものは拒否
  return url;
}
// 景品の背景を、小さなプレビュー用のCSS backgroundに直す
function fieldBgPreviewCss(it){
  if(it.type==='scene'){const fo=FIELD_SCENE_FOCUS[it.id.replace('bg_','')]||50;return `url('${it.value}') 50% ${Array.isArray(fo)?fo[0]:fo}%/cover`;}
  if(it.type==='image')return `url('${it.value}') center/cover`;
  return it.value;
}
// リアルな風景（SVG）を場の背景にする。牌が透けて背景が見えるようにする点は画像と同じ
// ── 場の背景の先読み：風景は一度だけ画像に焼いておく（SVGを毎回描き直さないので、重くならない） ──
const _bakedScenes={},_preloadedImgs=[];let _bakeQueue=Promise.resolve(),_wantScene=null,_sceneApplied=null;
function bakeScene(k){
  if(_bakedScenes[k])return Promise.resolve();
  _bakeQueue=_bakeQueue.then(async()=>{ // 1つずつ順番に（同時に重い処理をしない）
    if(_bakedScenes[k])return;
    try{
      const img=new Image();img.src=sceneUri(k);await img.decode();
      const cv=document.createElement('canvas');cv.width=800;cv.height=1600;cv.getContext('2d').drawImage(img,0,0,800,1600);
      const blob=await new Promise(res=>cv.toBlob(res,'image/png'));
      if(blob)_bakedScenes[k]=URL.createObjectURL(blob);
    }catch(e){}
  });
  return _bakeQueue;
}
function preloadImage(url){const safe=sanitizeFieldBgUrl(url);if(!safe)return;const im=new Image();im.decoding='async';im.src=safe;_preloadedImgs.push(im);if(_preloadedImgs.length>12)_preloadedImgs.shift();}
// 自分と対戦相手の背景を、対戦前の紹介画面のあいだに読み込んでおく
let _warmKey='';
function warmFieldBgs(){
  warmTileBacks();
  if(!G||!G.players)return;
  const vals=[myFieldBgValue(),...G.players.map(p=>p&&p.fieldBg)].filter(Boolean);
  const key=vals.join('|');if(key===_warmKey)return;_warmKey=key;
  setTimeout(()=>{vals.forEach(v=>{const bg=resolveFieldBg(v);if(!bg)return;
    if(bg.kind==='scene'){const k=String(bg.id).replace('bg_',''),fk=(k==='galaxy'&&fieldAnimEnabled())?'galaxybase':k;bakeScene(fk);}
    else if(bg.kind==='img')preloadImage(bg.value);});},document.getElementById('match-fx')?900:0);
}
// ── 牌の裏柄の先読み：描画の処理を数回ぶん空回しして、最初のコマが重くならないようにする ──
let _tileWarmed='';
function warmTileBacks(){
  const theme=localStorage.getItem('rikka_back_theme')||'';
  const draw=TILE_BACK_ANIMS[theme],glob=TILE_BACK_GLOBAL[theme];
  if((!draw&&!glob)||_tileWarmed===theme)return;_tileWarmed=theme;
  setTimeout(()=>{
    try{
      const cv=document.createElement('canvas');cv.width=cv.height=300;const c=cv.getContext('2d');
      const st={};
      for(let k=0;k<8;k++){
        if(draw){c.save();c.clearRect(0,0,300,300);draw(c,34,54,k*.13,.3+k*.07);c.restore();}
        if(glob){c.save();c.clearRect(0,0,300,300);glob(c,{w:290,h:230},34,k*.13+.2,st,1);c.restore();}
      }
    }catch(e){}
  },document.getElementById('match-fx')?1100:0);
}
function applySceneBg(uri,id,swapOnly){
  const key=String(id||'').replace('bg_','');
  const animOn=fieldAnimEnabled()&&!!FIELD_ANIMS[key];
  const sk=(key==='galaxy'&&animOn)?'galaxybase':key; // 銀河は腕を動かすので、腕なしの下地を使う
  _wantScene={uri,id};
  if(_bakedScenes[sk])uri=_bakedScenes[sk];
  else{
    uri=sceneUri(sk);
    const intro=!!document.getElementById('match-fx');
    setTimeout(()=>bakeScene(sk).then(()=>{if(_wantScene&&_wantScene.id===id)applySceneBg(_wantScene.uri,id,_sceneApplied===id);}),intro?700:0);
    if(intro)return; // 紹介画面のあいだに焼いてから適用する（紹介画面の動きを止めない）
  }
  let styleEl=document.getElementById('field-bg-style');
  if(!styleEl){styleEl=document.createElement('style');styleEl.id='field-bg-style';document.head.appendChild(styleEl);}
  const fo=FIELD_SCENE_FOCUS[key]||50,fy=Array.isArray(fo)?fo[0]:fo,fyL=Array.isArray(fo)?fo[1]:fo;
  styleEl.textContent=`#field-wrap::before{background-image:linear-gradient(rgba(8,5,3,.28),rgba(8,5,3,.28)),url('${uri}')!important;background-size:cover!important;background-position:50% ${fy}%!important}
@media (orientation:landscape){#field-wrap::before{background-position:50% ${fyL}%!important}}
#field-wrap .fback{background:rgba(20,14,8,.72)!important}
#field-wrap .fback::before{opacity:.7}`;
  _sceneApplied=id;
  if(swapOnly)return; // 画像の差し替えだけ（動きは、そのまま続ける）
  if(animOn)startFieldAnim(key,fy,fyL);else stopFieldAnim();
}
function applyFieldBg(url){
  stopFieldAnim();_wantScene=null;_sceneApplied=null;
  if(url)preloadImage(url);
  let styleEl=document.getElementById('field-bg-style');
  if(!styleEl){styleEl=document.createElement('style');styleEl.id='field-bg-style';document.head.appendChild(styleEl);}
  const safe=sanitizeFieldBgUrl(url);
  // 牌自体は不透明な背景を持っているので、場の背景画像が牌の下に隠れて見えなくなってしまう。
  // 画像を設定している間は牌の背景を半透明にして、画像がちゃんと透けて見えるようにする。
  styleEl.textContent=safe
    ?`#field-wrap::before{background-image:linear-gradient(rgba(8,5,3,.4),rgba(8,5,3,.4)),url("${safe}")!important;background-size:cover!important;background-position:center!important}
#field-wrap .fback{background:rgba(20,14,8,.78)!important}
#field-wrap .fback::before{opacity:.7}`
    :'';
}
// 現在の手番の人が設定している背景に切り替える（自分ならcustomFieldBgUrl、他人なら同期されたfieldBg）。
// ボットは背景を持たないので、ボットの番のときは自動的にデフォルトへ戻る。
// 実際に背景が変わった時だけ、右上を起点に「今の背景が消える→続けて次の背景が現れる」アニメーションを再生する。
let _lastFieldBgKey=null;
function triggerFieldWipeOut(onDone){
  const el=document.getElementById('field-wrap');
  if(!el){onDone();return;}
  el.classList.remove('field-wipe-in');
  void el.offsetWidth; // reflowを強制してアニメーションを再生させる
  el.classList.add('field-wipe-out');
  setTimeout(()=>{ el.classList.remove('field-wipe-out'); onDone(); },400);
}
function triggerFieldWipeIn(){
  const el=document.getElementById('field-wrap');
  if(!el)return;
  void el.offsetWidth;
  el.classList.add('field-wipe-in');
}
function updateFieldBgForTurn(){
  if(!G||!G.players||!G.players[G.turn]){
    if(_lastFieldBgKey!==null){
      _lastFieldBgKey=null;
      triggerFieldWipeOut(()=>{ applyFieldBg(''); triggerFieldWipeIn(); });
    }
    return;
  }
  const cur=G.players[G.turn];
  const isMe=(G.turn===myOnlineIdx);
  const val=isMe?myFieldBgValue():(cur.fieldBg||'');
  const bg=resolveFieldBg(val);
  const key=bg?(bg.kind+':'+(bg.kind==='scene'?bg.id:bg.value)):'none';
  if(key===_lastFieldBgKey)return; // 前回と同じ背景なら何もしない（アニメーションもしない）
  _lastFieldBgKey=key;
  triggerFieldWipeOut(()=>{
    if(bg&&bg.kind==='img') applyFieldBg(bg.value);
    else if(bg&&bg.kind==='scene') applySceneBg(bg.value,bg.id);
    else if(bg) applyFieldBgGradient(bg.value);
    else applyFieldBg('');
    triggerFieldWipeIn();
  });
}
// 自分の背景設定（サーバーに送る値）。画像URLが優先、無ければガチャ背景を 'preset:<id>' で表す
function myFieldBgValue(){
  if(customFieldBgUrl)return customFieldBgUrl;
  const it=getEquippedFieldBgItem();
  return it?('preset:'+it.id):'';
}
// 'preset:<id>' またはhttps画像URLを、描画に使う形に変換する
function resolveFieldBg(val){
  if(typeof val!=='string'||!val)return null;
  if(val.startsWith('preset:')){
    const it=GACHA_ITEMS.find(x=>x.category==='fieldbg'&&x.id===val.slice(7));
    return it?{kind:it.type==='image'?'img':it.type==='scene'?'scene':'grad',value:it.value,id:it.id}:null;
  }
  const safe=sanitizeFieldBgUrl(val);
  return safe?{kind:'img',value:safe}:null;
}
function openFieldBgModal(){
  document.getElementById('fieldbg-modal').classList.add('open');
  document.getElementById('fieldbg-url-input').value=customFieldBgUrl;
  previewFieldBg();
}
function closeFieldBgModal(){document.getElementById('fieldbg-modal').classList.remove('open');}
function previewFieldBg(){
  const raw=document.getElementById('fieldbg-url-input').value.trim();
  const wrap=document.getElementById('fieldbg-preview-wrap');
  const safe=sanitizeFieldBgUrl(raw);
  if(safe)wrap.innerHTML=`<img src="${esc(safe)}" style="width:100%;height:100%;object-fit:cover" alt="" onerror="this.parentNode.textContent='⚠️ 読み込み失敗'">`;
  else if(raw)wrap.textContent='⚠️ httpsの画像URLのみ使えます';
  else wrap.textContent='🖼️';
}
function saveFieldBg(){
  const raw=document.getElementById('fieldbg-url-input').value.trim();
  const safe=sanitizeFieldBgUrl(raw);
  if(raw&&!safe){toast('httpsの画像URLのみ使えます');return;}
  customFieldBgUrl=safe;
  if(customFieldBgUrl)localStorage.setItem('rikka_field_bg',customFieldBgUrl);
  else localStorage.removeItem('rikka_field_bg');
  if(currentCode)socket?.emit('set_field_bg',{code:currentCode,url:myFieldBgValue()});
  updateFieldBgForTurn();
  closeFieldBgModal();
  toast('場の背景を更新しました！');
  refreshCustomize();
}
function resetFieldBg(){
  customFieldBgUrl='';
  localStorage.removeItem('rikka_field_bg');
  document.getElementById('fieldbg-url-input').value='';
  previewFieldBg();
  if(currentCode)socket?.emit('set_field_bg',{code:currentCode,url:myFieldBgValue()});
  updateFieldBgForTurn();
  refreshCustomize();
}
