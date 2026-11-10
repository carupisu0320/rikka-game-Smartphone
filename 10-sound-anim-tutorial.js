
// ============================================================
//  サウンド
// ============================================================
let soundEnabled = localStorage.getItem('rikka_sound_enabled') === 'true';
let soundVolume  = localStorage.getItem('rikka_sound_volume') !== null
  ? parseFloat(localStorage.getItem('rikka_sound_volume')) : 0.5;
let _audioCtx = null;
function _getAudioCtx(){
  if(!_audioCtx) _audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return _audioCtx;
}
// 牌の操作音（捨てる/拾う/入れ替える/反転）は、ここにファイルを指定すると
// 合成音の代わりにそのファイルが再生される。ファイルはリポジトリの
// sounds/ フォルダに置き、ここに書いたパスと合わせること。
// ファイルがまだ無い/読み込めない場合は、自動的に下の合成音にフォールバックする。
const SOUND_FILES = {
  discard: 'sounds/discard.mp3',
  pick:    'sounds/pick.mp3',
  swap:    'sounds/swap.mp3',
  flip:    'sounds/flip.mp3',
};
function _playSoundFile(path, fallback){
  try{
    const audio = new Audio(path);
    let didFallback = false;
    const useFallback = () => { if(didFallback) return; didFallback = true; fallback(); };
    audio.addEventListener('error', useFallback);
    audio.volume = soundVolume;
    const p = audio.play();
    if(p && typeof p.catch === 'function') p.catch(useFallback);
  }catch(e){ fallback(); }
}
function playSound(kind){
  if(!soundEnabled) return;
  const file = SOUND_FILES[kind];
  if(file){ _playSoundFile(file, () => _playSynthSound(kind)); return; }
  _playSynthSound(kind);
}
function _playSynthSound(kind){
  try{
    const ctx = _getAudioCtx();
    const fire = () => {
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.value = soundVolume;
      master.connect(ctx.destination);
      const tone=(freq,start,dur,type,gain)=>{
        const osc=ctx.createOscillator(), g=ctx.createGain();
        osc.type=type; osc.frequency.value=freq;
        g.gain.setValueAtTime(0,now+start);
        g.gain.linearRampToValueAtTime(gain,now+start+0.012);
        g.gain.exponentialRampToValueAtTime(0.001,now+start+dur);
        osc.connect(g); g.connect(master);
        osc.start(now+start); osc.stop(now+start+dur+0.03);
      };
      // カンッ、と硬いものがぶつかるような打撃音（アタックが一瞬・ピッチが少し下がる）
      const click=(freq,start,dur,gain)=>{
        const osc=ctx.createOscillator(), g=ctx.createGain();
        osc.type='square';
        osc.frequency.setValueAtTime(freq,now+start);
        osc.frequency.exponentialRampToValueAtTime(freq*0.55,now+start+dur);
        g.gain.setValueAtTime(gain,now+start);
        g.gain.exponentialRampToValueAtTime(0.001,now+start+dur);
        osc.connect(g); g.connect(master);
        osc.start(now+start); osc.stop(now+start+dur+0.02);
      };
      if(kind==='riichi'){
        tone(440,0,.16,'triangle',.32);
        tone(660,.09,.22,'triangle',.32);
      } else if(kind==='ron'){
        tone(880,0,.09,'square',.28);
        tone(660,.06,.12,'square',.28);
        tone(440,.12,.2,'square',.24);
      } else if(kind==='win'){
        tone(523.25,0,.16,'sine',.3);
        tone(659.25,.1,.16,'sine',.3);
        tone(783.99,.2,.16,'sine',.3);
        tone(1046.5,.3,.32,'sine',.34);
      } else if(kind==='pick'){
        click(1400,0,.045,.22);
        click(750,0,.035,.12);
      } else if(kind==='discard'){
        click(950,0,.05,.24);
        click(500,0,.045,.14);
      } else if(kind==='swap'){
        // 入れ替え：軽い二連クリック（暫定の合成音。sounds/swap.mp3 を置けば置き換わる）
        click(1100,0,.035,.16);
        click(1500,.045,.03,.13);
      } else if(kind==='flip'){
        // 反転：短いクリック1回（暫定の合成音。sounds/flip.mp3 を置けば置き換わる）
        click(1200,0,.05,.18);
      }
    };
    if(ctx.state==='suspended'){
      ctx.resume().then(fire).catch(()=>{});
    } else {
      fire();
    }
  }catch(e){}
}
function toggleSound(){
  soundEnabled = !soundEnabled;
  localStorage.setItem('rikka_sound_enabled', soundEnabled);
  updateSoundUI();
  if(soundEnabled) playSound('win');
}
function setSoundVolume(v){
  soundVolume = Math.max(0,Math.min(100,Number(v)))/100;
  localStorage.setItem('rikka_sound_volume', soundVolume);
}
function updateSoundUI(){
  const btn = document.getElementById('sound-toggle-btn');
  if(btn){
    btn.textContent = soundEnabled ? 'ON' : 'OFF';
    btn.style.background = soundEnabled ? 'linear-gradient(135deg,#2a9e6e,#1a6e40)' : '#2a1e14';
    btn.style.color = soundEnabled ? '#e0fff8' : '#8a7048';
    btn.style.borderColor = soundEnabled ? '#2a9e6e' : '#3e2e1e';
  }
  const slider = document.getElementById('sound-volume-slider');
  if(slider) slider.value = Math.round(soundVolume*100);
}

// ── 牌の大きさ ──
// 機種の画面幅から自動計算した基準サイズ(clamp)に、この倍率をかけて
// 押しやすさに合わせて手動調整できるようにする。80%〜160%、既定100%。
// 手牌エリアの高さをCSS変数に反映し、チャットボタン等が手牌のボタンと重ならないようにする
(function(){
  const ha=document.getElementById('hand-area');if(!ha)return;
  const set=()=>document.documentElement.style.setProperty('--hand-h',ha.getBoundingClientRect().height+'px');
  if(window.ResizeObserver)new ResizeObserver(set).observe(ha);
  window.addEventListener('resize',set);set();
})();

let tileScale = localStorage.getItem('rikka_tile_scale') !== null
  ? parseFloat(localStorage.getItem('rikka_tile_scale')) : 1;
document.documentElement.style.setProperty('--tile-scale', tileScale);
function setTileScale(v){
  tileScale = Math.max(80,Math.min(160,Number(v)))/100;
  document.documentElement.style.setProperty('--tile-scale', tileScale);
  localStorage.setItem('rikka_tile_scale', tileScale);
}
function updateTileScaleUI(){
  const slider = document.getElementById('tile-scale-slider');
  if(slider) slider.value = Math.round(tileScale*100);
}

function toggleChat(){
  chatOpen = !chatOpen;
  document.getElementById('chat-wrap').style.display = chatOpen ? 'flex' : 'none';
  if(chatOpen){
    chatUnread = 0;
    const badge = document.getElementById('chat-badge');
    badge.style.display = 'none';
    badge.textContent = '';
    const log = document.getElementById('chat-log');
    log.scrollTop = log.scrollHeight;
  }
}
document.addEventListener('click', e => {
  if(!chatOpen) return;
  const wrap = document.getElementById('chat-wrap');
  const btn  = document.getElementById('chat-toggle');
  if(wrap && !wrap.contains(e.target) && btn && !btn.contains(e.target)){
    chatOpen = false;
    wrap.style.display = 'none';
    document.getElementById('chat-toggle').textContent = '💬';
  }
});
function sendChat(){
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if(!msg || !socket || !onlineMode) return;
  socket.emit('chat', {code: currentCode, msg});
  input.value = '';
}

function receiveChat(name, msg, isMine){
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + (isMine ? 'mine' : 'theirs');
  div.innerHTML = `<div class="chat-name">${esc(name)}</div>${esc(msg)}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
  if(!chatOpen && !isMine){
    chatUnread++;
    const badge = document.getElementById('chat-badge');
    badge.textContent = chatUnread > 9 ? '9+' : chatUnread;
    badge.style.display = 'flex';
  }
}
// ============================================================
//  アニメーション
// ============================================================

// 花火・紙吹雪
let _confettiRun=0;
function launchConfetti(){
  const canvas = document.getElementById('confetti-canvas');
  if(!canvas) return;
  const _run=++_confettiRun;  // 連続で呼ばれたら前のアニメは止める
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const palette = getConfettiPalette();
  const pieces = Array.from({length:120}, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.random() * 8 + 4,
    color: palette[Math.floor(Math.random()*palette.length)],
    vx: (Math.random()-0.5)*6,
    vy: Math.random()*4+3,
    rot: Math.random()*360,
    vr: (Math.random()-0.5)*10,
    shape: Math.random() > 0.5 ? 'rect' : 'circle'
  }));
  let frame = 0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame/120);
      if(p.shape === 'rect'){
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*1.6);
      } else {
        ctx.beginPath();
        ctx.arc(0,0,p.r/2,0,Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.12;
    });
    frame++;
    if(_run!==_confettiRun) return;
    if(frame < 150) requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
}

// スコア加算アニメーション
function animateScore(el){
  if(!el) return;
  el.classList.remove('score-bump');
  void el.offsetWidth;
  el.classList.add('score-bump');
  setTimeout(()=>el.classList.remove('score-bump'), 400);
}

// ターン切り替えグロー
function updateTurnGlow(){
  const game = document.getElementById('game');
  if(!game) return;
  if(G && G.phase==='playing' && G.turn===myOnlineIdx && G.tphase==='pick'){
    game.classList.add('my-turn-glow');
  } else {
    game.classList.remove('my-turn-glow');
  }
}

// 牌スライドイン
function animateFieldTiles(){
  document.querySelectorAll('.fback, .tile.discarded').forEach((el,i)=>{
    el.classList.remove('tile-anim-in');
    void el.offsetWidth;
    el.style.animationDelay = `${i*0.012}s`;
    el.classList.add('tile-anim-in');
  });
}

// 手牌キラキラ
function updateWinSparkle(winRes){
  document.querySelectorAll('.htile').forEach(el=>{
    el.classList.remove('can-win-sparkle');
  });
  if(winRes){
    document.querySelectorAll('.htile').forEach(el=>{
      el.classList.add('can-win-sparkle');
    });
  }
}
let botChatOpen=false,botChatUnread=0;
const BOT_COMMENTS={
  pick:['ふむ…','これにしよう','いいね','おっ','うーん…'],
  discard:['いらないな','これを捨てよう','えいっ','うーむ'],
  winning:['あと少し！','もう少しだ…','そろそろ…','いい感じ'],
  win:['やった！上がり！','勝ったぞ！','ふふ、もらった','やりました！'],
  tsuide:['ついでに完成！','ラッキー！','もらえた！'],
  lose:['くっ…','次は負けないぞ','惜しかった…','まだまだ！'],
  gamewin:['ゲーム勝利！やった！','完勝だ！'],
  gamelose:['次は勝つぞ！','また勝負しよう'],
};
function rndComment(key){return BOT_COMMENTS[key][Math.floor(Math.random()*BOT_COMMENTS[key].length)];}
function addBotChatMsg(name,msg,isMine){
  const log=document.getElementById('bot-chat-log');if(!log)return;
  const div=document.createElement('div');
  div.className='chat-msg '+(isMine?'mine':'theirs');
  div.innerHTML=`<div class="chat-name">${esc(name)}</div>${esc(msg)}`;
  log.appendChild(div);log.scrollTop=log.scrollHeight;
  if(!botChatOpen&&!isMine){
    botChatUnread++;
    const badge=document.getElementById('bot-chat-badge');
    badge.textContent=botChatUnread>9?'9+':botChatUnread;
    badge.style.display='flex';
  }
}
function sendBotChat(){
  const input=document.getElementById('bot-chat-input');
  const msg=input.value.trim();
  if(!msg||!G||G.phase!=='playing')return;
  addBotChatMsg(G.players[myOnlineIdx].name,msg,true);
  input.value='';
  const bot=G.players.find(p=>p.isBot);
  if(!bot)return;
  if(/^うお[wｗ]+$/.test(msg)){
    setTimeout(()=>addBotChatMsg(bot.name,'おっｗ',false),800+Math.random()*1000);
  } else if(Math.random()<0.5){
    const replies=['そうだね','うん！','ふむ','なるほど','そうか…','…','へえ'];
    setTimeout(()=>addBotChatMsg(bot.name,replies[Math.floor(Math.random()*replies.length)],false),800+Math.random()*1000);
  }
}
function botComment(key){
  if(!G)return;const bot=G.players.find(p=>p.isBot);if(!bot)return;
  setTimeout(()=>addBotChatMsg(bot.name,rndComment(key),false),300+Math.random()*500);
}
function toggleBotChat(){
  botChatOpen=!botChatOpen;
  document.getElementById('bot-chat-wrap').style.display=botChatOpen?'flex':'none';
  if(botChatOpen){
    botChatUnread=0;
    const badge=document.getElementById('bot-chat-badge');
    badge.style.display='none';badge.textContent='';
    document.getElementById('bot-chat-log').scrollTop=999999;
  }
}
document.addEventListener('click',e=>{
  if(!botChatOpen)return;
  const wrap=document.getElementById('bot-chat-wrap');
  const btn=document.getElementById('bot-chat-toggle');
  if(wrap&&!wrap.contains(e.target)&&btn&&!btn.contains(e.target)){
    botChatOpen=false;wrap.style.display='none';
  }
});
function openSidebar(){
  document.getElementById('sidebar').style.display='block';
  document.getElementById('sidebar-overlay').style.display='block';
  const name=document.getElementById('pname').value||'プレイヤー';
  document.getElementById('sb-name').textContent=name;
  document.getElementById('sb-email').textContent=gUser.email||'';
  updateAvatarDisplay();
  renderSidebarStats();
  renderAchievementsList();
  updateSbTitle();
  updateSoundUI();
  updateTileScaleUI();
  updateAnimUI();
  renderDevSection();
}

function closeSidebar(){document.getElementById('sidebar').style.display='none';document.getElementById('sidebar-overlay').style.display='none';}

// ============================================================

// ルールブック・モーダル・ユーティリティ

// ============================================================

function openRuleBook(){document.getElementById('rule-modal').classList.add('open');renderRulebookExamples();renderOptionalRoles();renderRiichiRonInfo();}
function renderRiichiRonInfo() {
  const useRiichi = !!(G && G.useRiichi);
  const useRon    = !!(G && G.useRon);
  let html = '';
  if(useRiichi){
    html += `
    <div class="rb-role" style="background:rgba(200,74,74,.06);border-radius:6px;padding:.6rem .4rem;margin-top:.4rem">
      <div>
        <div class="rb-role-name" style="color:#e07070">🀄 リーチ</div>
      </div>
      <div class="rb-role-desc">
        手牌6枚のとき、<b style="color:#e07070">ある牌を捨てればテンパイ（あと1枚で上がれる状態）になる</b>なら「リーチ宣言」ボタンが押せる。<br>
        宣言すると、以降は引いた牌が役の完成牌でない限り<b style="color:#e07070">自動で捨てられる</b>（手牌を動かせなくなる）。<br>
        リーチ中に上がると<b style="color:#f5d040">+1点</b>のボーナスが付く。
      </div>
    </div>`;
  }
  if(useRon){
    html += `
    <div class="rb-role" style="background:rgba(224,160,32,.06);border-radius:6px;padding:.6rem .4rem;margin-top:.4rem">
      <div>
        <div class="rb-role-name" style="color:#e0a020">ロン</div>
      </div>
      <div class="rb-role-desc">
        他のプレイヤーが捨てた牌を使うと自分の役が完成するとき、「ロン！」ボタンが数秒間だけ表示される。<br>
        押すとその牌をもらってその場で上がれる。<br>
        ロンで得た点数（役点＋ボーナス）は、<b style="color:#e0a020">牌を捨てた相手から差し引かれる</b>（相手の持ち点が足りなければ奪えるだけ）。<br>
        複数人が同時にロンできる場合は、<b style="color:#e0a020">捨てた人から時計回りで一番近い1人だけ</b>が有効。
      </div>
    </div>`;
  }
  const el = document.getElementById('rb-riichi-ron');
  if(el) el.innerHTML = html;
}
function renderOptionalRoles() {
  const activeRoles = G?.optRoles ?? null;
  const use = r => activeRoles === null || (Array.isArray(activeRoles) && activeRoles.includes(r));
  function rbT(top, bot) {
    const star = (top === bot) ? '<div class="rbtile-star">★</div>' : '';
    return `<div class="rbtile"><div class="th">${SYM_SVG[top]}</div>${star}<div class="tb">${SYM_SVG[bot]}</div></div>`;
  }
  const roleData = [
    { role:'三対', yomi:'サンツイ', pts:'2点',
      desc:'6枚を<b style="color:#f0a050">同じ牌のペア×3組</b>にする。',
      tiles:[[2,1],[2,1],[4,3],[4,3],[6,5],[6,5]] },
    { role:'三色', yomi:'サンシキ', pts:'3点（ボーナスなし）',
      desc:'手牌6枚の上下すべての数が<b style="color:#f0a050">合わせて3種類のみ</b>になる。<b style="color:#60c870">「ついでに完成」でのみ</b>成立し、通常の上がり・ロンでは成立しない。',
      tiles:[[1,3],[3,1],[5,3],[3,5],[1,5],[5,1]] },
    { role:'輝光', yomi:'キコウ', pts:'5点（ボーナスなし）',
      desc:'6枚すべてを<b style="color:#f5d040">★ゾロ目牌</b>にする。輝きボーナスはなし。',
      tiles:[[1,1],[1,1],[3,3],[3,3],[5,5],[5,5]] },
    { role:'無双', yomi:'ムソウ', pts:'3点＋★ボーナス',
      desc:'<b style="color:#f5d040">★ゾロ目牌</b>を<b style="color:#f0a050">6種類すべて（1-1〜6-6）</b>集める。輝きボーナスあり（+6点）。',
      tiles:[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]] },
  ];
  const html = roleData.filter(r => use(r.role)).map(r => `
    <div class="rb-role" style="flex-direction:column">
      <div style="display:flex;gap:.65rem;align-items:flex-start">
        <div>
          <div class="rb-role-name">${r.role}<span style="font-size:.65rem;color:#8a7048;margin-left:.3rem">${r.yomi}</span></div>
          <div style="font-size:.7rem;color:#6a5830">${r.pts}</div>
        </div>
        <div class="rb-role-desc">${r.desc}</div>
      </div>
      <div class="rb-ex">${r.tiles.map(([t,b])=>rbT(t,b)).join('')}</div>
    </div>`).join('');
  const el = document.getElementById('rb-optional-roles');
  if(el) el.innerHTML = html;
}
function renderRulebookExamples(){

function rbTile(top,bot){

const star=(top===bot)?'<div class="rbtile-star">★</div>':'';

return`<div class="rbtile"><div class="th">${SYM_SVG[top]}</div>${star}<div class="tb">${SYM_SVG[bot]}</div></div>`;

}

// 一色: 下がすべて3（緑）、上はバラバラ

const isshiki = [[1,3],[1,3],[2,3],[5,3],[4,3],[6,3]];
  
document.getElementById('rb-ex-isshiki').innerHTML=

`<div class="rb-ex">${isshiki.map(([t,b])=>rbTile(t,b)).join('')}</div>`;

// 三連: セット1＝上2,3,4/下1（赤）　セット2＝上3,4,5/下5（青）

const san1=[[2,1],[3,1],[4,1]],san2=[[3,5],[4,5],[5,5]];

document.getElementById('rb-ex-sanren').innerHTML=

`<div class="rb-ex">${san1.map(([t,b])=>rbTile(t,b)).join('')}<div class="rb-ex-sep">＋</div>${san2.map(([t,b])=>rbTile(t,b)).join('')}</div>`;

// 六華: 下がすべて4（青緑）、上が1〜6

const rikka=[[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]];

document.getElementById('rb-ex-rikka').innerHTML=

`<div class="rb-ex">${rikka.map(([t,b])=>rbTile(t,b)).join('')}</div>`;

// 輝きボーナス: ゾロ目牌の例2枚

const stars=[[2,2],[5,5]];

document.getElementById('rb-ex-star').innerHTML=

`<div class="rb-ex">${stars.map(([t,b])=>rbTile(t,b)).join('')}<span style="font-size:.78rem;color:#9a8838;align-self:center;margin-left:.4rem">← ★ゾロ目牌 ＝ +2点ボーナス</span></div>`;

}

function closeRuleBook(){document.getElementById('rule-modal').classList.remove('open');}

document.getElementById('rule-modal').addEventListener('click',function(e){if(e.target===this)closeRuleBook();});

// ============================================================
// チュートリアル
// ============================================================
const TUTORIAL_LESSONS=[
  { id:'basics', title:'基本の流れ', yomi:'', pts:'',
    desc:`最初に手牌<b style="color:#f0a050">5枚</b>が配られます。自分の番になったら、場に並んだ牌から1枚<b style="color:#f0a050">拾って</b>手牌を6枚にします。<br><br>
      6枚で役が完成していなければ、1枚<b style="color:#f0a050">捨てて</b>5枚に戻し、次の人の番になります。6枚で役が完成したら「上がる！」を押して勝利です。<br><br>
      牌には上下2つの数字があり、<b style="color:#f06868">タップすると裏返せます</b>（上下が入れ替わる）。役が成立するように向きを調整しましょう。<br><br>
      役の点数と★ゾロ目ボーナスの合計を獲得し、先に目標点に到達したプレイヤーが優勝です。`,
    examples:null },
  { id:'isshiki', title:'一色', yomi:'イッシキ', pts:'1点',
    desc:'手牌6枚の<b style="color:#f0a050">下の数</b>を1種類にそろえる。上は何でもOK。一番シンプルな役です。',
    examples:[
      { tiles:[[1,3],[1,3],[2,3],[5,3],[4,3],[6,3]] },
      { tiles:[[2,5],[2,5],[3,5],[6,5],[1,5],[4,5]] },
    ],
    practice:{ hand:[[1,3],[1,3],[2,3],[5,3],[4,3]], win:[6,3], decoys:[[2,4],[5,6]] } },
  { id:'sanren', title:'三連', yomi:'サンレン', pts:'3点',
    desc:'「3枚セット」を2つ作る。セット＝<b style="color:#f0a050">下が同じ3枚</b>で<b style="color:#f06868">上が連番</b>。6と1はつながりません。',
    examples:[
      { tiles:[[2,1],[3,1],[4,1]], tiles2:[[3,5],[4,5],[5,5]] },
      { tiles:[[1,2],[2,2],[3,2]], tiles2:[[4,6],[5,6],[6,6]] },
    ],
    practice:{ hand:[[2,1],[3,1],[3,5],[4,5],[5,5]], win:[4,1], decoys:[[1,6],[3,2]] } },
  { id:'rikka', title:'六華', yomi:'リッカ', pts:'6点',
    desc:'下が全部同じ＋上が1〜6の連番（順不同OK）。ゲーム名にもなっている<b style="color:#f5d040">最高難度の役</b>です。',
    examples:[
      { tiles:[[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]] },
      { tiles:[[1,2],[2,2],[3,2],[4,2],[5,2],[6,2]] },
    ],
    practice:{ hand:[[1,4],[2,4],[3,4],[4,4],[5,4]], win:[6,4], decoys:[[6,1],[6,2]] } },
  { id:'santui', title:'三対', yomi:'サンツイ', pts:'2点',
    desc:'6枚を<b style="color:#f0a050">同じ牌のペア×3組</b>にする。ルームの設定次第で使える追加役です。',
    examples:[
      { tiles:[[2,1],[2,1],[4,3],[4,3],[6,5],[6,5]] },
      { tiles:[[1,6],[1,6],[3,2],[3,2],[5,4],[5,4]] },
    ],
    practice:{ hand:[[2,1],[2,1],[4,3],[4,3],[6,5]], win:[6,5], decoys:[[1,4],[3,6]] } },
  { id:'sanshiki', title:'三色', yomi:'サンシキ', pts:'3点（ボーナスなし）',
    desc:'手牌6枚の上下すべての数が<b style="color:#f0a050">合わせて3種類のみ</b>になる。<b style="color:#60c870">「ついでに完成」でのみ</b>成立し、通常の上がり・ロンでは成立しません。',
    examples:[
      { tiles:[[1,3],[3,1],[5,3],[3,5],[1,5],[5,1]] },
      { tiles:[[2,4],[4,2],[6,4],[4,6],[2,6],[6,2]] },
    ],
    practice:{ hand:[[1,3],[3,1],[5,3],[3,5],[1,5]], win:[5,1], decoys:[[2,2],[4,6]] } },
  { id:'kikou', title:'輝光', yomi:'キコウ', pts:'5点（ボーナスなし）',
    desc:'6枚すべてを<b style="color:#f5d040">★ゾロ目牌</b>（上下同じ数の牌）にする。輝きボーナスは付きません。',
    examples:[
      { tiles:[[1,1],[1,1],[3,3],[3,3],[5,5],[5,5]] },
      { tiles:[[2,2],[2,2],[4,4],[4,4],[6,6],[6,6]] },
    ],
    practice:{ hand:[[1,1],[1,1],[3,3],[3,3],[5,5]], win:[5,5], decoys:[[2,3],[4,1]] } },
  { id:'musou', title:'無双', yomi:'ムソウ', pts:'3点＋★ボーナス',
    desc:'<b style="color:#f5d040">★ゾロ目牌</b>を<b style="color:#f0a050">6種類すべて（1-1〜6-6）</b>集める。組み合わせはこの1通りしかありません。輝きボーナスも付くので実質かなり高得点です。',
    examples:[
      { tiles:[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]] },
    ],
    practice:{ hand:[[1,1],[2,2],[3,3],[4,4],[5,5]], win:[6,6], decoys:[[2,3],[4,1]] } },
  { id:'riichi', title:'リーチ', yomi:'', pts:'',
    desc:`手牌6枚のとき、<b style="color:#e07070">ある牌を捨てればテンパイ（あと1枚で上がれる状態）になる</b>なら「リーチ宣言」ボタンが押せます。<br><br>
      宣言すると、以降は引いた牌が役の完成牌でない限り<b style="color:#e07070">自動で捨てられます</b>（手牌を動かせなくなる）。<br><br>
      リーチ中に上がると<b style="color:#f5d040">+1点</b>のボーナスが付きます。ルームの設定でオン/オフを選べます。`,
    examples:null },
  { id:'ron', title:'ロン', yomi:'', pts:'',
    desc:`他のプレイヤーが捨てた牌を使うと自分の役が完成するとき、「ロン！」ボタンが数秒間だけ表示されます。<br><br>
      押すとその牌をもらってその場で上がれます。ロンで得た点数（役点＋ボーナス）は<b style="color:#e0a020">牌を捨てた相手から差し引かれます</b>。<br><br>
      複数人が同時にロンできる場合は、<b style="color:#e0a020">捨てた人から時計回りで一番近い1人だけ</b>が有効です。ルームの設定でオン/オフを選べます。`,
    examples:null },
];
let tutorialIdx=0;
function tutTile(top,bot){
  const star=(top===bot)?'<div class="rbtile-star">★</div>':'';
  return `<div class="rbtile"><div class="th">${SYM_SVG[top]}</div>${star}<div class="tb">${SYM_SVG[bot]}</div></div>`;
}
function openTutorial(){
  tutorialIdx=0;
  showScreen('tutorial');
  renderTutorialChips();
  renderTutorialLesson();
}
function closeTutorial(){showScreen('lobby');}
function renderTutorialChips(){
  const el=document.getElementById('tut-chips');
  el.innerHTML=TUTORIAL_LESSONS.map((l,i)=>
    `<button class="tut-chip${i===tutorialIdx?' active':''}" onclick="selectTutorialLesson(${i})">${esc(l.title)}</button>`
  ).join('');
}
function selectTutorialLesson(i){
  tutorialIdx=Math.max(0,Math.min(TUTORIAL_LESSONS.length-1,i));
  renderTutorialChips();
  renderTutorialLesson();
}
function tutorialPrev(){ if(tutorialIdx>0) selectTutorialLesson(tutorialIdx-1); }
function tutorialNext(){ if(tutorialIdx<TUTORIAL_LESSONS.length-1) selectTutorialLesson(tutorialIdx+1); }
function renderTutorialLesson(){
  const l=TUTORIAL_LESSONS[tutorialIdx];
  const ptsHtml=l.pts?`<div class="tut-content-pts">${esc(l.pts)}</div>`:'';
  const yomiHtml=l.yomi?`<span style="font-size:.7rem;color:#8a7048;margin-left:.4rem">${esc(l.yomi)}</span>`:'';
  let exHtml='';
  if(l.examples&&l.examples.length){
    exHtml=l.examples.map((ex,i)=>{
      const label=l.examples.length>1?`<div class="tut-ex-label">例${i+1}</div>`:'';
      const body=`<div class="rb-ex" style="margin-top:.3rem">${ex.tiles.map(([t,b])=>tutTile(t,b)).join('')}`
        +(ex.tiles2?`<div class="rb-ex-sep">＋</div>${ex.tiles2.map(([t,b])=>tutTile(t,b)).join('')}`:'')
        +`</div>`;
      return `<div style="margin-top:.7rem">${label}${body}</div>`;
    }).join('');
  }
  document.getElementById('tut-content').innerHTML=
    `<div class="tut-content-title">${esc(l.title)}${yomiHtml}</div>${ptsHtml}<div class="tut-content-desc">${l.desc}</div>${exHtml}<div class="tut-practice" id="tut-practice-container"></div>`;
  renderTutorialPractice();
  document.getElementById('tut-pos').textContent=`${tutorialIdx+1} / ${TUTORIAL_LESSONS.length}`;
  document.getElementById('tut-prev-btn').disabled=(tutorialIdx===0);
  document.getElementById('tut-next-btn').disabled=(tutorialIdx===TUTORIAL_LESSONS.length-1);
  document.getElementById('tut-content').scrollTop=0;
}

function shuffleArr(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
let _tutPracticeTiles=null;
let _tutPracticeResetTimer=null;
function renderTutorialPractice(){
  clearTimeout(_tutPracticeResetTimer);
  const l=TUTORIAL_LESSONS[tutorialIdx];
  const container=document.getElementById('tut-practice-container');
  if(!container)return;
  if(!l.practice){ container.style.display='none'; container.innerHTML=''; return; }
  container.style.display='';
  const items=[{top:l.practice.win[0],bot:l.practice.win[1],isWin:true},
    ...l.practice.decoys.map(([t,b])=>({top:t,bot:b,isWin:false}))];
  _tutPracticeTiles=shuffleArr(items);
  const handHtml=l.practice.hand.map(([t,b])=>tutTile(t,b)).join('');
  const fieldHtml=_tutPracticeTiles.map((t,i)=>
    `<div class="tut-field-tile" onclick="tutPracticeTap(${i})">${tutTile(t.top,t.bot)}</div>`).join('');
  container.innerHTML=
    `<div class="tut-practice-label">✋ 練習してみよう</div>
     <div class="tut-practice-hint">場から好きな牌を1枚選んでください</div>
     <div class="tut-practice-field" id="tut-practice-field">${fieldHtml}</div>
     <div class="tut-practice-hand-label">— 手牌 —</div>
     <div class="tut-practice-hand" id="tut-practice-hand">${handHtml}</div>
     <div class="tut-practice-status" id="tut-practice-status">手牌5枚 — 場から選んでください</div>`;
}
function tutPracticeTap(i){
  if(!_tutPracticeTiles||!_tutPracticeTiles[i])return;
  const t=_tutPracticeTiles[i];
  const statusEl=document.getElementById('tut-practice-status');
  const fieldEl=document.getElementById('tut-practice-field');
  const fieldTileEls=fieldEl.querySelectorAll('.tut-field-tile');
  if(t.isWin){
    _tutPracticeTiles=null; // 連打で二重に反応しないようにロック
    if(fieldTileEls[i])fieldTileEls[i].style.visibility='hidden';
    const handEl=document.getElementById('tut-practice-hand');
    const wrap=document.createElement('div');
    wrap.innerHTML=tutTile(t.top,t.bot);
    const tileEl=wrap.firstElementChild;
    tileEl.classList.add('tut-new');
    handEl.appendChild(tileEl);
    statusEl.textContent='🎉 上がり！';
    statusEl.classList.add('tut-win');
    playSound('win');
    launchConfetti();
    _tutPracticeResetTimer=setTimeout(renderTutorialPractice,1700);
  } else {
    const el=fieldTileEls[i]?.querySelector('.rbtile');
    if(el){ el.classList.remove('tut-miss'); void el.offsetWidth; el.classList.add('tut-miss'); }
    statusEl.textContent='それじゃない…もう一度！';
  }
}

function showModal(html){document.getElementById('mbox').innerHTML=html;document.getElementById('modal').classList.add('open');}

function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');if(id==='lobby')applyLobbyEvent();try{frReportStatus();}catch(e){}}
