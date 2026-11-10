
// ============================================================
// 実績（バッジ）システム
// ============================================================
const ACHIEVEMENTS=[
  // reward: 景品ID（場の背景・裏柄・紙吹雪）／ rt: 報酬の称号名（景品は自動で作られる）／ prog: 進み具合 [現在, 目標]
  {id:'first_win',        icon:'🏅', title:'初勝利',             desc:'はじめて役を完成させて勝利する', rt:'初陣の勝者'},
  {id:'win_5',            icon:'🥉', title:'5勝',                desc:'通算5回勝利する', rt:'五勝の打ち手', prog:s=>[s.totalWins,5]},
  {id:'win_10',           icon:'🥈', title:'10勝',               desc:'通算10回勝利する', reward:'bg_koi', prog:s=>[s.totalWins,10]},
  {id:'win_30',           icon:'🥇', title:'30勝',               desc:'通算30回勝利する', rt:'六華の達人', prog:s=>[s.totalWins,30]},
  {id:'win_50',           icon:'💫', title:'50勝',               desc:'通算50回勝利する', reward:'bg_cityrain', prog:s=>[s.totalWins,50]},
  {id:'win_100',          icon:'👑', title:'100勝',              desc:'通算100回勝利する', rt:'百戦錬磨', prog:s=>[s.totalWins,100]},
  {id:'role_musou',       icon:'🐉', title:'無双の証',           desc:'「無双」で勝利する', reward:'theme_dragon'},
  {id:'role_kikou',       icon:'✨', title:'輝光の輝き',         desc:'「輝光」で勝利する', rt:'光を纏う者'},
  {id:'role_sanren',      icon:'🔗', title:'三連の道',           desc:'「三連」で勝利する', rt:'連なる道'},
  {id:'role_sanshiki',    icon:'🎨', title:'三色の彩',           desc:'「三色」で勝利する（ついで完成でもOK）', rt:'三色の使い手'},
  {id:'role_santui',      icon:'👯', title:'三対の絆',           desc:'「三対」で勝利する', rt:'対を成す者'},
  {id:'role_isshoku',     icon:'🀄', title:'一色の道',           desc:'「一色」で勝利する', rt:'一色の求道者'},
  {id:'role_rikka',       icon:'🌸', title:'六華の頂',           desc:'「六華」で勝利する（最高難度の役）', reward:'bg_fuji'},
  {id:'role_all',         icon:'📖', title:'役図鑑コンプリート', desc:'7つの役すべてで勝利経験を積む', rt:'役の博士'},
  {id:'riichi_ron',       icon:'⚡', title:'リーチロン',         desc:'リーチ中にロンで勝利する', rt:'雷鳴のロン'},
  {id:'riichi_win',       icon:'🎯', title:'リーチの達人',       desc:'リーチをかけて上がる', rt:'リーチの申し子'},
  {id:'ron_5',            icon:'🗡️', title:'ロン使い',           desc:'ロンで通算5回勝利する', rt:'ロン使い', prog:s=>[s.ronWins,5]},
  {id:'win_streak_3',     icon:'🔥', title:'3連勝',              desc:'3回連続で勝利する', rt:'連勝の勢い'},
  {id:'win_streak_5',     icon:'🌋', title:'5連勝',              desc:'5回連続で勝利する', rt:'破竹の勢い'},
  {id:'win_streak_10',    icon:'☄️', title:'10連勝',             desc:'10回連続で勝利する', rt:'不敗の打ち手'},
  {id:'bonus_master',     icon:'💎', title:'ぞろ目コレクター',   desc:'ぞろ目ボーナス2以上で勝利する', reward:'confetti_gems'},
  {id:'big_win',          icon:'💥', title:'大物手',             desc:'1回の上がりで8点以上獲得する', rt:'大物手の持ち主'},
  {id:'hard_win',         icon:'🤖', title:'強敵撃破',           desc:'「強い」ボットに勝利する', rt:'強者殺し'},
  {id:'hard_win_10',      icon:'🦾', title:'強敵キラー',         desc:'「強い」ボットに通算10回勝利する', rt:'AI超え', prog:s=>[s.hardWins,10]},
  {id:'online_first_win', icon:'🌐', title:'オンライン初勝利',   desc:'オンライン対戦ではじめて勝利する', rt:'ネットの勇者'},
  {id:'online_win_10',    icon:'🌍', title:'オンライン10勝',     desc:'オンライン対戦で通算10回勝利する', rt:'オンラインの猛者', prog:s=>[s.onlineWins,10]},
  {id:'games_10',         icon:'🎮', title:'常連さん',           desc:'通算10戦プレイする', rt:'常連の風格', prog:s=>[s.totalGames,10]},
  {id:'games_100',        icon:'🏆', title:'ベテラン',           desc:'通算100戦プレイする', reward:'bg_fireworks', prog:s=>[s.totalGames,100]},
  {id:'gacha_10',         icon:'🎰', title:'ガチャ好き',         desc:'ガチャを通算10回引く', rt:'ガチャの申し子', prog:s=>[s.gachaDraws,10]},
  {id:'collector_20',     icon:'📦', title:'コレクター',         desc:'ガチャの景品を20種類集める', rt:'蒐集家', prog:s=>[realOwnedGachaCount(),20]},
];
const ROLE_ACHIEVEMENT_ID={'無双':'role_musou','輝光':'role_kikou','三連':'role_sanren','三色':'role_sanshiki','三対':'role_santui','一色':'role_isshoku','六華':'role_rikka'};
const ALL_ROLE_ACH_IDS=Object.values(ROLE_ACHIEVEMENT_ID);

function loadAchievementState(){
  try{
    const st=JSON.parse(localStorage.getItem('rikka_achievements')||'{}');
    st.unlocked=st.unlocked||[]; st.totalGames=st.totalGames||0; st.winStreak=st.winStreak||0;
    ['totalWins','onlineWins','hardWins','ronWins','gachaDraws'].forEach(k=>{st[k]=st[k]||0;});
    if(st.unlocked.includes('first_win')&&st.totalWins<1)st.totalWins=1;
    return st;
  }catch(e){ return {unlocked:[],totalGames:0,winStreak:0,totalWins:0,onlineWins:0,hardWins:0,ronWins:0,gachaDraws:0}; }
}
function saveAchievementState(st){
  try{ localStorage.setItem('rikka_achievements',JSON.stringify(st)); }catch(e){}
}

// このラウンドの結果から実績を判定し、新しく解除されたものの配列を返す。
// won: このラウンドで自分（ローカルプレイヤー）が勝利したか
// opts: {role, bonus, ron, riichi, online}
function checkAchievements(won,opts){
  opts=opts||{};
  const st=loadAchievementState();
  if(!opts.misc){
    st.totalGames++;
    st.winStreak=won?st.winStreak+1:0;
    if(won){st.totalWins++;if(opts.online)st.onlineWins++;if(opts.diff==='hard'&&!opts.online)st.hardWins++;if(opts.ron)st.ronWins++;}
  }
  if(opts.gacha)st.gachaDraws+=(typeof opts.gacha==='number'?opts.gacha:1);

  const have=new Set(st.unlocked);
  const newly=[];
  const unlock=(id)=>{
    if(have.has(id))return;
    have.add(id);
    const a=ACHIEVEMENTS.find(x=>x.id===id);
    if(a)newly.push(a);
  };

  if(won&&!opts.misc){
    unlock('first_win');
    if(opts.online)unlock('online_first_win');
    const roleId=ROLE_ACHIEVEMENT_ID[opts.role];
    if(roleId)unlock(roleId);
    if(ALL_ROLE_ACH_IDS.every(id=>have.has(id)))unlock('role_all');
    if(opts.ron&&opts.riichi)unlock('riichi_ron');
    if(opts.riichi)unlock('riichi_win');
    if((opts.bonus||0)>=2)unlock('bonus_master');
    if((opts.total||0)>=8)unlock('big_win');
    if(!opts.online&&opts.diff==='hard')unlock('hard_win');
    if(st.winStreak>=3)unlock('win_streak_3');
    if(st.winStreak>=5)unlock('win_streak_5');
    if(st.winStreak>=10)unlock('win_streak_10');
  }
  [['win_5','totalWins',5],['win_10','totalWins',10],['win_30','totalWins',30],['win_50','totalWins',50],['win_100','totalWins',100],
   ['ron_5','ronWins',5],['hard_win_10','hardWins',10],['online_win_10','onlineWins',10],
   ['games_10','totalGames',10],['games_100','totalGames',100],['gacha_10','gachaDraws',10]].forEach(([id,k,n])=>{if(st[k]>=n)unlock(id);});
  if(realOwnedGachaCount()>=20)unlock('collector_20');

  st.unlocked=[...have];
  saveAchievementState(st);
  newly.forEach(a=>{if(a.reward)grantItem(a.reward);}); // 報酬を受け取る
  renderAchievementsList();
  return newly;
}
// 端末に保存された「実際の」所持品に景品を足す（開発者アカウントの全所持表示には影響されない）
function grantItem(id){
  try{
    const raw=JSON.parse(localStorage.getItem('rikka_gacha')||'{}');
    raw.owned=raw.owned||[];raw.equipped=raw.equipped||{};
    if(raw.owned.includes(id))return false;
    raw.owned.push(id);localStorage.setItem('rikka_gacha',JSON.stringify(raw));return true;
  }catch(e){return false;}
}
function realOwnedGachaCount(){
  try{const raw=JSON.parse(localStorage.getItem('rikka_gacha')||'{}');return (raw.owned||[]).filter(id=>{const it=GACHA_ITEMS.find(x=>x.id===id);return it&&!it.achievement&&!it.loginStar&&!it.limited&&!it.event;}).length;}catch(e){return 0;}
}
// すでに解除済みの実績の報酬を受け取れていなければ渡す（この機能の追加前に解除した人向け）
function backfillAchievementRewards(){
  const st=loadAchievementState();
  ACHIEVEMENTS.forEach(a=>{if(a.reward&&st.unlocked.includes(a.id))grantItem(a.reward);});
}
// 報酬の説明（ポップアップや実績一覧用）
function achRewardInfo(a){
  const it=a.reward&&GACHA_ITEMS.find(x=>x.id===a.reward);
  if(!it)return null;
  const kind={title:'称号',fieldbg:'場の背景',theme:'牌の裏柄',confetti:'紙吹雪'}[it.category]||'景品';
  return {kind,item:it};
}

let _achPopupQueue=[];
let _achPopupShowing=false;
function showAchievementPopup(list){
  if(!list||!list.length)return;
  _achPopupQueue.push(...list);
  if(!_achPopupShowing)_drainAchievementPopup();
}
function _drainAchievementPopup(){
  const next=_achPopupQueue.shift();
  if(!next){_achPopupShowing=false;return;}
  _achPopupShowing=true;
  const el=document.getElementById('achievement-popup');
  document.getElementById('ap-icon').textContent=next.icon;
  document.getElementById('ap-title').textContent=next.title;
  document.getElementById('ap-desc').textContent=next.desc;
  const _ri=achRewardInfo(next),_re=document.getElementById('ap-reward');
  if(_re){_re.textContent=_ri?`🎁 ${_ri.kind}「${_ri.item.title}」を獲得！`:'';_re.style.display=_ri?'':'none';}
  playSound('win');
  el.classList.add('show');
  setTimeout(()=>{
    el.classList.remove('show');
    setTimeout(_drainAchievementPopup,350);
  },3200);
}

let achievementsOpen=false;
function toggleAchievements(){ achievementsOpen=!achievementsOpen; renderAchievementsList(); }
function renderAchievementsList(){
  const el=document.getElementById('achievements-list-sb');
  if(!el)return;
  const st=loadAchievementState(),st2=st;
  const have=new Set(st.unlocked);
  const doneCount=ACHIEVEMENTS.filter(a=>have.has(a.id)).length;
  const countEl=document.getElementById('achievements-count');
  if(countEl)countEl.textContent=`${doneCount}/${ACHIEVEMENTS.length}`;
  el.style.display=achievementsOpen?'':'none';
  const iconEl=document.getElementById('achievements-toggle-icon');
  if(iconEl)iconEl.textContent=achievementsOpen?'▼':'▶';
  el.innerHTML=ACHIEVEMENTS.map(a=>{
    const done=have.has(a.id);
    const pr=(!done&&a.prog)?a.prog(st2):null,ri=achRewardInfo(a);
    const prog=pr?`<div class="ach-prog">${Math.min(pr[0],pr[1])} / ${pr[1]}</div>`:'';
    const rw=ri?`<div class="ach-reward${done?' got':''}">🎁 ${ri.kind}「${esc(ri.item.title)}」${done?'（獲得済み）':''}</div>`:'';
    return `<div class="ach-item${done?' ach-done':''}">
      <div class="ach-icon">${done?a.icon:'🔒'}</div>
      <div class="ach-body">
        <div class="ach-title">${esc(a.title)}</div>
        <div class="ach-desc">${esc(a.desc)}</div>
        ${prog}${rw}
      </div>
    </div>`;
  }).join('');
}

// ============================================================
// ガチャ
// ============================================================
const GACHA_COST=10;
