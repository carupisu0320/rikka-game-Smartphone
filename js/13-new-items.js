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
//   mode: 'burst'（放射）か 'fall'（降ってくる）。g: 'fall' のときに降らせる絵文字の配列。dur: 演出の長さ（秒）
function addFx(o){
  const st={id:o.id,name:o.name,icon:o.emoji||'✨',c1:o.c1,c2:o.c2,bg:o.bg,dm:o.dm,mode:o.mode||'burst'};
  if(o.g)st.g=o.g;
  if(o.dur)st.dur=o.dur; // 演出の長さ（秒）。省略すると標準の長さ
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

// ===== 黄金の精神：三段の脱皮（背景と上がり演出のセット。すべてオリジナルの絵柄） =====
//  第1段階：卵に「文字（音）」が貼り付き、頭に響く音が輪になって広がる
//  第2段階：殻を破り、しっぽの文字に触れると効果が出る（ドグォーム＝爆発／ズグゥシ＝熱）
//  第3段階：射程は短いが、殴った相手を重圧で地面にめり込ませる
const _mt={
  ease:u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);},
  rg(c,x,y,r0,r1,stops){const g=c.createRadialGradient(x,y,Math.max(.1,r0),x,y,Math.max(.2,r1));stops.forEach(([o,col])=>g.addColorStop(o,col));return g;},
  tx(c,s,x,y,px,fill,stroke,rot,a){c.save();c.globalAlpha*=Math.max(0,Math.min(1,a));c.translate(x,y);c.rotate(rot||0);
    c.font=`900 ${Math.max(4,px)}px 'Hiragino Mincho ProN','Yu Mincho',serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
    c.lineWidth=px*.16;c.strokeStyle=stroke;c.strokeText(s,0,0);c.fillStyle=fill;c.fillText(s,0,0);c.restore();},
  egg(c,x,y,s){c.beginPath();c.moveTo(x,y-s*1.25);c.bezierCurveTo(x+s*.95,y-s,x+s*1.05,y+s*.9,x,y+s*1.05);c.bezierCurveTo(x-s*1.05,y+s*.9,x-s*.95,y-s,x,y-s*1.25);c.closePath();},
  glow(c,x,y,r,a,b){c.save();c.globalCompositeOperation='lighter';c.fillStyle=_mt.rg(c,x,y,2,r,[[0,a],[1,b]]);c.beginPath();c.arc(x,y,r,0,6.283);c.fill();c.restore();},
  // 第1段階：卵に文字が貼り付く
  st1(c,P,u){
    const {cx,cy,k,t}=P,e=_mt.ease;
    _mt.glow(c,cx,cy,110*k,'rgba(255,230,150,.45)','rgba(255,170,60,0)');
    c.save();c.lineWidth=2.5*k;for(let i=0;i<3;i++){const p=((t/1300)+i/3)%1;c.strokeStyle=`rgba(255,220,120,${(1-p)*.55})`;c.beginPath();c.arc(cx,cy,(38+p*130)*k,0,6.283);c.stroke();}c.restore();
    c.save();c.translate(cx,cy);c.rotate(Math.sin(t*.03)*.05*(.4+u));_mt.egg(c,0,0,34*k);
    const g=c.createLinearGradient(-30*k,-40*k,30*k,40*k);g.addColorStop(0,'#fff6dc');g.addColorStop(1,'#bfa27a');c.fillStyle=g;c.fill();c.lineWidth=2.5*k;c.strokeStyle='#5a3c20';c.stroke();c.restore();
    ['ド','グ','ォ','ー','ム'].forEach((ch,i)=>{const a0=i*.13;if(u<a0)return;const p=e((u-a0)/.12),ang=-2.5+i*.62,rr=(54+(i%2)*10)*k;
      _mt.tx(c,ch,cx+Math.cos(ang)*rr,cy+Math.sin(ang)*rr*.9,(30+(1-p)*26)*k,'#ffd870','#4a2008',(i-2)*.18,p);});
  },
  // 第2段階：殻を破り、しっぽの文字が効果を出す
  st2(c,P,u){
    const {cx,cy,k,t}=P,e=_mt.ease;
    if(u<.38){
      c.save();c.translate(cx+Math.sin(t*.09)*3*k*u/.38,cy);_mt.egg(c,0,0,34*k);c.fillStyle='#e8d8b4';c.fill();c.strokeStyle='#5a3c20';c.lineWidth=2.5*k;c.stroke();
      const n=Math.floor(e(u/.38)*5)+1,zz=[[0,-42,6,-26,-4,-12],[-4,-12,-14,0,-6,14],[-6,14,8,24,2,38],[-4,-12,12,-4,18,10],[18,10,30,16,34,6]];
      c.strokeStyle='#3a2410';c.lineWidth=2*k;c.beginPath();zz.slice(0,n).forEach(([a,b,x1,y1,x2,y2])=>{c.moveTo(a*k,b*k);c.lineTo(x1*k,y1*k);c.lineTo(x2*k,y2*k);});c.stroke();c.restore();
    }else{
      const p=e((u-.38)/.62);
      for(let i=0;i<8;i++){const a=i*.785+.3,d=(30+p*130)*k;c.save();c.translate(cx+Math.cos(a)*d,cy+Math.sin(a)*d*.8+p*p*40*k);c.rotate(a+p*3);c.globalAlpha*=1-p*.85;
        c.fillStyle=i%2?'#f2e4c4':'#cdb48a';c.strokeStyle='#5a3c20';c.lineWidth=2*k;c.beginPath();c.moveTo(0,-16*k);c.lineTo(12*k,10*k);c.lineTo(-11*k,8*k);c.closePath();c.fill();c.stroke();c.restore();}
      _mt.glow(c,cx,cy,(60+p*20)*k,'rgba(255,255,230,.95)','rgba(255,150,40,0)');
      ['ズ','グ','ゥ','シ'].forEach((ch,i)=>{const a0=.42+i*.05;if(u<a0)return;
        _mt.tx(c,ch,cx+(i+1)*24*k,cy+14*k+Math.sin(t*.005+i*.9)*9*k+i*6*k,24*k,'#ff9a68','#4a1408',.3+i*.08,Math.min(1,(u-a0)*8));});
    }
    if(u>=.5&&u<.74){ // ドグォーム：爆発
      const q=(u-.5)/.24,r=(30+e(q)*140)*k,by=cy-10*k;
      _mt.glow(c,cx,by,r,'rgba(255,240,180,.9)','rgba(255,60,0,0)');
      c.save();c.globalCompositeOperation='lighter';c.strokeStyle=`rgba(255,210,120,${(1-q)*.9})`;c.lineWidth=3*k;
      for(let i=0;i<12;i++){const a=i*.5236;c.beginPath();c.moveTo(cx+Math.cos(a)*r*.5,by+Math.sin(a)*r*.5);c.lineTo(cx+Math.cos(a)*r*1.05,by+Math.sin(a)*r*1.05);c.stroke();}c.restore();
      _mt.tx(c,'ドグォーム',cx+Math.sin(t*.07)*3*k,cy-86*k,46*k,'#ffc050','#5a1a00',-.06,Math.min(1,q*6)*(1-Math.max(0,(q-.8)*5)));
    }else if(u>=.74){ // ズグゥシ：熱
      const q=(u-.74)/.26;
      _mt.glow(c,cx,cy,150*k,'rgba(255,120,60,.55)','rgba(255,40,0,0)');
      c.save();c.globalCompositeOperation='lighter';c.strokeStyle='rgba(255,150,90,.55)';c.lineWidth=2.5*k;
      for(let i=0;i<5;i++){const bx=cx+(i-2)*30*k;c.beginPath();for(let y=0;y<=100;y+=8){const yy=cy+20*k-y*k*(.6+((t*.0006+i*.2)%1)*.4),xx=bx+Math.sin(y*.15+t*.012+i)*6*k;if(y)c.lineTo(xx,yy);else c.moveTo(xx,yy);}c.stroke();}c.restore();
      _mt.tx(c,'ズグゥシ',cx,cy-86*k,46*k,'#ff7a48','#4a0a00',.05+Math.sin(t*.02)*.02,Math.min(1,q*6));
    }
  },
  // 第3段階：重圧で地面にめり込ませる
  st3(c,P,u){
    const {cx,cy,k,t,gy,y0}=P,e=_mt.ease,hit=.3;
    if(u<hit){const p=e(u/hit),y=y0+(gy-12*k-y0)*p;
      c.save();c.globalCompositeOperation='lighter';c.strokeStyle='rgba(200,190,255,.7)';c.lineWidth=6*k;c.beginPath();c.moveTo(cx,Math.max(y0,y-160*k));c.lineTo(cx,y);c.stroke();c.restore();
      _mt.glow(c,cx,y,40*k,'rgba(255,255,255,.95)','rgba(160,140,255,0)');return;}
    const p=(u-hit)/(1-hit),pe=e(Math.min(1,p*1.6));
    c.save();const gr=c.createLinearGradient(0,y0,0,gy);gr.addColorStop(0,'rgba(10,0,30,0)');gr.addColorStop(1,`rgba(10,0,30,${.5*pe})`);c.fillStyle=gr;c.fillRect(cx-130*k,y0,260*k,Math.max(1,gy-y0));
    c.strokeStyle='rgba(190,180,255,.4)';c.lineWidth=2*k;
    for(let i=0;i<14;i++){const x=cx-120*k+i*(240/13)*k,ph=((t*.0012*(.8+i%3*.3))+i*.37)%1,yy=y0+(gy-y0)*ph;c.beginPath();c.moveTo(x,yy-50*k);c.lineTo(x,yy);c.stroke();}c.restore();
    c.save();c.fillStyle=`rgba(0,0,0,${.55*pe})`;c.beginPath();c.ellipse(cx,gy,(30+pe*115)*k,(6+pe*14)*k,0,0,6.283);c.fill();
    c.strokeStyle='rgba(20,10,30,.9)';c.lineWidth=2.5*k;
    for(let i=0;i<10;i++){const a=i*.628+.2,r1=14*k,r2=(30+pe*(60+(i%3)*30))*k;c.beginPath();c.moveTo(cx+Math.cos(a)*r1*1.6,gy+Math.sin(a)*r1*.45);c.lineTo(cx+Math.cos(a)*r2*1.6,gy+Math.sin(a)*r2*.45);c.stroke();}c.restore();
    c.save();c.globalCompositeOperation='lighter';
    for(let i=0;i<2;i++){const q=Math.min(1,Math.max(0,p*1.4-i*.25));c.strokeStyle=`rgba(210,200,255,${(1-q)*.7})`;c.lineWidth=3*k;c.beginPath();c.ellipse(cx,gy,(20+q*190)*k,(5+q*40)*k,0,0,6.283);c.stroke();}c.restore();
    c.save();c.fillStyle='#1a1030';c.beginPath();c.ellipse(cx,gy-10*k*(1-pe),22*k,Math.max(.5,10*k*(1-pe*.6)),0,0,6.283);c.fill();c.restore();
    for(let i=0;i<10;i++){const a=i*.9+.4,fx=cx+Math.cos(a)*(30+i*10)*k*pe,fy=gy-Math.abs(Math.sin(p*3.1+i))*50*k*(1-p)-2*k;c.fillStyle='#2a1c3c';c.fillRect(fx,fy,(5+i%3*2)*k,(4+i%2*3)*k);}
    _mt.tx(c,'ズゥゥン…',cx+Math.sin(t*.08)*2*k*(1-p),gy-120*k,44*k,'#e8e0ff','#1a0838',.04,Math.min(1,p*5)*(1-Math.max(0,(p-.85)*6)));
  },
  paint(c,P,s,u){[_mt.st1,_mt.st2,_mt.st3][s](c,P,u);}
};

addScene({name:'molt3', rarity:'superrare', emoji:'🥚', title:'三段の脱皮', focus:55, flags:{gold:1},
  desc:'場の背景：卵が三段階に進化する（文字を貼る→しっぽの文字が効果を放つ→重圧で地面にめり込ませる）',
  draw:function(){const r=_rng(41),F="font-family=\"'Hiragino Mincho ProN','Yu Mincho',serif\" font-weight=\"900\"";
    return `<defs>${_vgrad('sk',[[0,'#07061a'],[.5,'#1c1440'],[.64,'#3a2250'],[1,'#0a0612']])}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,430,110)}
<path d="${_ridge(r,{base:575,amp:20,rough:.6}).fill}" fill="#0e0820"/><rect y="548" width="400" height="252" fill="#0a0614"/><ellipse cx="200" cy="552" rx="150" ry="13" fill="#05030c"/>
<g transform="rotate(-8 80 520)"><path d="M40 548L52 508L108 500L126 548Z" fill="#171028"/><text x="82" y="536" font-size="22" ${F} fill="#ff9a40" opacity=".55" text-anchor="middle">ドグォーム</text></g>
<g transform="rotate(7 320 520)"><path d="M280 548L292 506L350 512L366 548Z" fill="#171028"/><text x="324" y="538" font-size="22" ${F} fill="#ff5a3a" opacity=".55" text-anchor="middle">ズグゥシ</text></g>`;},
  anim:function(){return(c,dt,now,S)=>{const T=4000,s=Math.floor((now%(T*3))/T),u=(now%T)/T;
    c.save();c.globalAlpha=Math.min(1,u/.07)*Math.min(1,(1-u)/.07);_mt.paint(c,{cx:200,cy:490,k:1,gy:548,y0:S.y0,t:now},s,u);c.restore();c.globalAlpha=1;c.globalCompositeOperation='source-over';};}});

addFx({kind:'win', id:'molt3', name:'三段の脱皮', emoji:'🥚', c1:'#ffd060', c2:'#fff0d0', bg:'rgba(12,6,28,.9)', dm:'rgba(16,8,36,.45)', mode:'burst', dur:4.4,
  rarity:'superrare', flags:{gold:1}, desc:'上がりの演出：卵が三段階に進化する（文字を貼る→殻を破って効果を放つ→重圧で地面にめり込ませる）',
  draw:(W,H,D)=>{const k=Math.min(W,H)/420,cx=W/2,cy=H*.44;
    return(c,t,dt)=>{const p=Math.min(.999,t/Math.max(.1,D-.5)),s=Math.min(2,Math.floor(p*3)),u=p*3-s;
      c.save();c.globalAlpha=(1-_fSm(D-.5,D,t))*_fSm(0,.15,t);_mt.paint(c,{cx,cy,k,gy:cy+46*k,y0:0,t:t*1000},s,u);c.restore();};}});
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
