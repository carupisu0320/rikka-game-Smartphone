// =====================================================================
//  新しい景品の追加（景品を増やすときは、このファイルだけ編集します）
//  ・index.html では一番最後に読み込まれます（他のファイルの部品がすべて使えます）
//  ・①の関数は触らなくてOK。②の「ここに追加」に addXxx({...}) を足していきます
//  ・サーバー（server.js）は、景品のIDが英小文字・数字・_ の形なら自動で通します
// =====================================================================

// ───────── ① 登録用の関数（触らなくてOK） ─────────
// flags には、景品の種類を決める印を書きます。
//   何も書かない        → 通常ガチャに出る
//   {limited:'ID'}      → 期間限定ガチャ（LIMITED_LIST の id と同じ値）に出る。終わっても所持していれば使える
//   {gold:1}            → 「黄金の精神」ガチャに出る
//   {event:'ID'}        → イベントの報酬（ガチャには出ない）
function _newItem(o){
  if(GACHA_ITEMS.some(x=>x.id===o.id)){console.warn('景品IDが重複しています:',o.id);return null;}
  GACHA_ITEMS.push(o);return o;
}

// アイコン（動くSVG）。svg は「SVG文字列を返す関数」。_giSvg / _giRG / _giLG が使えます
function addIcon(o){
  GICON_SVG[o.id]=o.svg;
  return _newItem(Object.assign({id:o.id,rarity:o.rarity||'common',category:'gicon',icon:o.emoji||'✨',title:o.title,desc:o.desc||'',value:o.id},o.flags||{}));
}

// 場の背景（風景SVG・400x800）。name は英小文字（景品IDは bg_<name> になります）
//   draw  : SVG文字列を返す関数  / focus : 見せたい高さ（%）  / anim : 動き（省略可）
function addScene(o){
  const n=o.name;
  LOBBY_SCENES[n]=o.draw;
  if(o.focus!=null)FIELD_SCENE_FOCUS[n]=o.focus;
  if(o.anim)FIELD_ANIMS[n]=o.anim;
  const it={id:'bg_'+n,rarity:o.rarity||'rare',category:'fieldbg',type:'scene',icon:o.emoji||'🌄',title:o.title,desc:o.desc||'',get value(){return sceneUri(n);}};
  return _newItem(Object.assign(it,o.flags||{})); // getter を残すため、あとから印を足す
}

// 場の背景（用意した画像）。id は 'bg_xxx'、url は画像のURL（github.io など許可済みのドメイン）
function addImageBg(o){
  return _newItem(Object.assign({id:o.id,rarity:o.rarity||'rare',category:'fieldbg',type:'image',icon:o.emoji||'🖼️',title:o.title,desc:o.desc||'',value:o.url},o.flags||{}));
}

// リーチ・ロン・上がりの演出。kind は 'riichi' / 'ron' / 'win'
//   id は英小文字と数字だけ。draw は canvas の動き（省略すると色つきの標準の演出になります）
//   mode: 'burst'（放射）か 'fall'（降ってくる）。g: 'fall' のときに降らせる絵文字の配列
function addFx(o){
  const st={id:o.id,name:o.name,icon:o.emoji||'✨',c1:o.c1,c2:o.c2,bg:o.bg,dm:o.dm,mode:o.mode||'burst'};
  if(o.g)st.g=o.g;
  FX_STYLES[o.kind].push(st);
  if(o.draw)FXS[o.id]=o.draw;
  const itemId='fx_'+o.id;
  GOLD_FX[o.id]=itemId; // 持っている人だけが演出を選べる
  return _newItem(Object.assign({id:itemId,rarity:o.rarity||'rare',category:'fx',fxKind:o.kind,fxId:o.id,icon:o.emoji||'✨',title:o.name,desc:o.desc||''},o.flags||{}));
}

// 称号（名前の横に付く文字）
function addTitle(o){
  return _newItem(Object.assign({id:o.id,rarity:o.rarity||'rare',category:'title',icon:o.emoji||'🏅',title:o.title,desc:o.desc||'名前の横に称号が付きます',value:o.title},o.flags||{}));
}

// 紙吹雪（上がったときに舞う色）。id は 'confetti_xxx'、colors は色の配列（5色ほど）
function addConfetti(o){
  return _newItem(Object.assign({id:o.id,rarity:o.rarity||'common',category:'confetti',icon:o.emoji||'🎉',title:o.title,desc:o.desc||'上がったときの紙吹雪の色が変わります',value:o.colors},o.flags||{}));
}

// 牌の裏柄。value は英小文字。css は裏柄のCSS（body.back-<value> .fback { ... } の形）
//   swatch は一覧に出す見本の色 [濃い色, 明るい色]
function addTheme(o){
  if(o.css){const s=document.createElement('style');s.textContent=o.css;document.head.appendChild(s);}
  GACHA_THEME_SWATCH[o.value]=o.swatch||['#2a1e12','#5a4028'];
  return _newItem(Object.assign({id:'theme_'+o.value,rarity:o.rarity||'common',category:'theme',icon:o.emoji||'🎴',title:o.title,desc:o.desc||'',value:o.value},o.flags||{}));
}

// 期間限定ガチャの開催を追加する（日付で自動的に切り替わります）
//   id が景品の flags.limited と同じになります。existing は、再登場させる既存の景品ID
function addLimitedGacha(o){LIMITED_LIST.push(o);}

// ───────── ② ここに追加 ─────────
// 例（書き方の見本は、下の _samples() の中にあります）
// addIcon({id:'gi_xxx', rarity:'rare', emoji:'🔥', title:'名前', desc:'説明', svg:()=>_giSvg(...)});

// ───────── 見本（ふだんは呼ばれません。コピーして上の「ここに追加」に貼り付けて使います） ─────────
function _samples(){
  addIcon({id:'gi_sample', rarity:'common', emoji:'⭐', title:'見本のアイコン', desc:'アイコン：回る星（動く）',
    svg:()=>_giSvg(_giRG('#2a1e50','#0a0618'),`<g style="transform-origin:50px 50px;animation:spin 6s linear infinite"><path d="M50 14L58 40L86 42L64 58L72 86L50 70L28 86L36 58L14 42L42 40Z" fill="#ffe060"/></g>`)});
  addScene({name:'samplenight', rarity:'rare', emoji:'🌃', title:'見本の夜空', desc:'場の背景：星空', focus:55,
    draw:function(){const r=_rng(5);return `<defs>${_vgrad('sk',[[0,'#05061a'],[1,'#3a1c40']])}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,500,120)}`;}});
  addImageBg({id:'bg_sampleimage', rarity:'rare', title:'見本の画像背景', desc:'場の背景：画像', url:'https://carupisu0320.github.io/rikka-game-Smartphone/gameover1.png'});
  addFx({kind:'win', id:'samplebloom', name:'見本の花火', emoji:'🎆', c1:'#ffd060', c2:'#fff4d0', bg:'rgba(10,6,30,.88)', dm:'rgba(12,8,36,.4)', mode:'burst', rarity:'rare', desc:'上がりの演出：見本',
    draw:(W,H,D)=>{const cx=W/2,cy=H*.46;return(c,t,dt)=>{c.fillStyle='#ffd060';c.beginPath();c.arc(cx,cy,Math.min(W,H)*.1*t,0,6.283);c.fill();};}});
  addConfetti({id:'confetti_sample', rarity:'common', emoji:'🎊', title:'見本の紙吹雪', colors:['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff']});
  addTitle({id:'title_sample', rarity:'uncommon', emoji:'🏅', title:'見本の称号'});
  addTheme({value:'samplecheck', rarity:'common', emoji:'🎴', title:'見本の裏地', swatch:['#1a2a3a','#5a8ab0'],
    css:'body.back-samplecheck .fback{background:linear-gradient(165deg,#1a2a3a,#06101a);border-color:#5a8ab0}'});
}
