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
//   mode: 'burst'（放射）か 'fall'（降ってくる）。g: 'fall' のときに降らせる絵文字の配列。dur: 演出の長さ（秒）、sound: 演出の音（省略すると標準の音）
function addFx(o){
  const st={id:o.id,name:o.name,icon:o.emoji||'✨',c1:o.c1,c2:o.c2,bg:o.bg,dm:o.dm,mode:o.mode||'burst'};
  if(o.g)st.g=o.g;
  if(o.dur)st.dur=o.dur; // 演出の長さ（秒）。省略すると標準の長さ
  FX_STYLES[o.kind].push(st);
  if(o.draw)FXS[o.id]=o.draw;
  if(o.sound)FX_SOUND[o.id]=o.sound; // 演出の音（S.t / S.n などで作る。書き方は 15-fx-sounds.js）
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
const _mt=(()=>{
  const E=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);},CL=(v,a,b)=>Math.max(a,Math.min(b,v));
  const mkc=(w,h)=>{const cv=document.createElement('canvas');cv.width=w;cv.height=h;return cv;};
  const RN=seed=>{let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};};
  const FONT="'Hiragino Mincho ProN','Yu Mincho','Noto Serif CJK JP',serif";
  const SP={};
  const soft=(key,stops)=>SP[key]||(SP[key]=(()=>{const n=128,cv=mkc(n,n),x=cv.getContext('2d'),g=x.createRadialGradient(n/2,n/2,0,n/2,n/2,n/2);stops.forEach(([o,col])=>g.addColorStop(o,col));x.fillStyle=g;x.fillRect(0,0,n,n);return cv;})());
  const FIRE=()=>soft('fire',[[0,'rgba(255,250,215,1)'],[.22,'rgba(255,205,90,.92)'],[.5,'rgba(255,105,25,.6)'],[1,'rgba(110,20,0,0)']]);
  const SMOKE=()=>soft('smoke',[[0,'rgba(62,50,52,.62)'],[.6,'rgba(44,36,38,.3)'],[1,'rgba(30,26,28,0)']]);
  const DUST=()=>soft('dust',[[0,'rgba(172,152,150,.5)'],[.6,'rgba(138,120,124,.26)'],[1,'rgba(110,96,104,0)']]);
  const GLOW=()=>soft('glow',[[0,'rgba(255,255,240,1)'],[.18,'rgba(255,232,160,.75)'],[.5,'rgba(255,150,50,.24)'],[1,'rgba(255,100,20,0)']]);
  const SHAD=()=>soft('shad',[[0,'rgba(0,0,0,.75)'],[.6,'rgba(0,0,0,.35)'],[1,'rgba(0,0,0,0)']]);
  const blob=(c,sp,x,y,r,a)=>{if(r<=0||a<=0)return;const ga=c.globalAlpha;c.globalAlpha=ga*Math.min(1,a);c.drawImage(sp,x-r,y-r,r*2,r*2);c.globalAlpha=ga;};
  const add=(c,fn)=>{c.save();c.globalCompositeOperation='lighter';fn();c.restore();};
  const flat=(c,x,y,rx,ry,fn)=>{c.save();c.translate(x,y);c.scale(1,ry/rx);fn(rx);c.restore();}; // 地面に平らに描く
  // ---- 卵の形（単位：半径1）----
  const EP=[[0,-1.25],[.95,-1],[1.05,.9],[0,1.05]],EQ=[[0,1.05],[-1.05,.9],[-.95,-1],[0,-1.25]];
  const bz=(p,t)=>{const m=1-t;return[m*m*m*p[0][0]+3*m*m*t*p[1][0]+3*m*t*t*p[2][0]+t*t*t*p[3][0],m*m*m*p[0][1]+3*m*m*t*p[1][1]+3*m*t*t*p[2][1]+t*t*t*p[3][1]];};
  const OUT=[];for(let i=0;i<18;i++)OUT.push(bz(EP,i/18));for(let i=0;i<18;i++)OUT.push(bz(EQ,i/18));
  const ePath=(c,s)=>{c.beginPath();c.moveTo(0,-1.25*s);c.bezierCurveTo(.95*s,-s,1.05*s,.9*s,0,1.05*s);c.bezierCurveTo(-1.05*s,.9*s,-.95*s,-s,0,-1.25*s);c.closePath();};
  const speck=()=>SP.speck||(SP.speck=(()=>{const cv=mkc(140,170),x=cv.getContext('2d'),r=RN(7);for(let i=0;i<340;i++){const s=.5+r()*2.4;x.fillStyle=`rgba(${70+r()*50|0},${40+r()*30|0},${20+r()*20|0},${.14+r()*.42})`;x.beginPath();x.ellipse(r()*140,r()*170,s,s*(.6+r()*.6),r()*3,0,6.283);x.fill();}return cv;})());
  // 殻の破片（卵の輪郭をギザギザに分けたもの）
  const SH=(()=>{const r=RN(19),K=9,N=36,B=[];for(let j=0;j<K;j++)B.push(Math.round(j*N/K+(r()-.5)*2.2));
    const INN=B.map(i=>{const p=OUT[((i%N)+N)%N],f=.14+r()*.26;return[p[0]*f,p[1]*f];}),MID=B.map((i,j)=>{const p=OUT[((i%N)+N)%N],q=INN[j];return[(p[0]+q[0])/2+(r()-.5)*.12,(p[1]+q[1])/2+(r()-.5)*.12];});
    const out=[];for(let j=0;j<K;j++){const a=B[j],b=j+1<K?B[j+1]:B[0]+N,poly=[];for(let i=a;i<=b;i++)poly.push(OUT[((i%N)+N)%N]);const j2=(j+1)%K;poly.push(MID[j2],INN[j2],INN[j],MID[j]);out.push(poly);}
    out.push(INN.slice());
    return out.map((poly,i)=>{const cx=poly.reduce((a,p)=>a+p[0],0)/poly.length,cy=poly.reduce((a,p)=>a+p[1],0)/poly.length,an=Math.atan2(cy,cx);
      return {poly,cx,cy,an,v:.8+r()*.9,up:.7+r()*.9,w:(r()-.5)*9,c:i===K};});})();
  // ひび割れ（枝分かれ）
  const CR=(()=>{const r=RN(23),lines=[];const walk=(x,y,ang,len,w,d)=>{const pts=[[x,y]];let L=0;while(L<len){const st=.07+r()*.08;ang+=(r()-.5)*.9;x+=Math.cos(ang)*st;y+=Math.sin(ang)*st;pts.push([x,y]);L+=st;if(d<2&&r()<.16)walk(x,y,ang+(r()<.5?-1:1)*(.6+r()*.7),len*.45,w*.7,d+1);}lines.push({pts,w});};
    walk(.1,-1.2,1.75,1.6,1,0);walk(-.05,-1.1,1.2,1.2,.9,0);walk(.45,-.3,2.3,1,.8,0);walk(-.5,.1,.5,.9,.7,0);return lines;})();
  const crackDraw=(c,s,pr,glow)=>{c.save();ePath(c,s);c.clip();c.lineJoin='round';c.lineCap='round';
    const pass=(col,w,comp)=>{c.globalCompositeOperation=comp;c.strokeStyle=col;CR.forEach(l=>{const n=Math.max(2,Math.ceil(l.pts.length*pr));if(pr<=0)return;c.lineWidth=w*s*l.w;c.beginPath();l.pts.slice(0,n).forEach((p,i)=>i?c.lineTo(p[0]*s,p[1]*s):c.moveTo(p[0]*s,p[1]*s));c.stroke();});};
    pass('rgba(30,14,6,.7)',.062,'source-over');pass(`rgba(255,150,50,${.9*glow})`,.04,'lighter');pass('rgba(255,244,200,'+(.95*glow)+')',.014,'lighter');c.restore();};
  // 卵の本体：陰影・斑点・内側の光・ハイライト
  const eggBody=(c,s,glow)=>{
    c.save();ePath(c,s);c.clip();
    let g=c.createRadialGradient(-.4*s,-.55*s,.05*s,-.1*s,-.1*s,1.7*s);g.addColorStop(0,'#fff9ea');g.addColorStop(.28,'#e9d8b2');g.addColorStop(.62,'#a88a5e');g.addColorStop(.9,'#4a3624');g.addColorStop(1,'#2e2014');
    c.fillStyle=g;c.fillRect(-1.3*s,-1.5*s,2.6*s,2.8*s);
    c.save();c.globalAlpha=.55;c.drawImage(speck(),-1.1*s,-1.3*s,2.2*s,2.4*s);c.restore();
    g=c.createLinearGradient(0,.1*s,0,1.1*s);g.addColorStop(0,'rgba(255,150,60,0)');g.addColorStop(1,'rgba(255,150,60,.32)');c.fillStyle=g;c.fillRect(-1.3*s,-1.5*s,2.6*s,2.8*s);
    if(glow>0){c.save();c.globalCompositeOperation='lighter';g=c.createRadialGradient(0,.05*s,0,0,.05*s,1.25*s);g.addColorStop(0,`rgba(255,226,150,${.75*glow})`);g.addColorStop(.6,`rgba(255,140,50,${.32*glow})`);g.addColorStop(1,'rgba(255,100,20,0)');c.fillStyle=g;c.fillRect(-1.3*s,-1.5*s,2.6*s,2.8*s);c.restore();}
    c.save();c.rotate(-.45);g=c.createRadialGradient(-.34*s,-.62*s,0,-.34*s,-.62*s,.55*s);g.addColorStop(0,'rgba(255,255,248,.85)');g.addColorStop(.5,'rgba(255,255,240,.22)');g.addColorStop(1,'rgba(255,255,240,0)');c.fillStyle=g;c.beginPath();c.ellipse(-.34*s,-.62*s,.26*s,.5*s,0,0,6.283);c.fill();c.restore();
    c.restore();
    c.save();ePath(c,s);c.lineWidth=Math.max(1,s*.03);c.strokeStyle='rgba(54,36,20,.55)';c.stroke();c.restore();};
  const contact=(c,x,gy,rx,a)=>flat(c,x,gy,rx,rx*.26,r=>blob(c,SHAD(),0,0,r,a));
  // 文字：塗り（単色か縦グラデ）・縁・傾き
  const tx=(c,s,x,y,px,fill,stroke,rot,a,sk)=>{a=CL(a,0,1);if(a<.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(rot||0);if(sk)c.transform(1,0,sk,1,0,0);
    c.font=`900 ${Math.max(4,px)}px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
    let f=fill;if(Array.isArray(fill)){f=c.createLinearGradient(0,-px*.5,0,px*.5);f.addColorStop(0,fill[0]);f.addColorStop(1,fill[1]);}
    c.lineWidth=px*.17;c.strokeStyle=stroke;c.strokeText(s,0,0);c.fillStyle=f;c.fillText(s,0,0);c.restore();};
  const gtx=(c,s,x,y,px,col,gl,rot,a)=>{a=CL(a,0,1);if(a<.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(rot||0);c.font=`900 ${Math.max(4,px)}px ${FONT}`;c.textAlign='center';c.textBaseline='middle';
    c.shadowColor=gl;c.shadowBlur=px*.7;c.fillStyle=col;c.fillText(s,0,0);c.shadowBlur=0;c.lineWidth=px*.05;c.strokeStyle='rgba(60,20,4,.7)';c.strokeText(s,0,0);c.restore();};
  const ground=(c,P)=>{if(!P.disc)return;const{cx,gy,k}=P;flat(c,cx,gy+4*k,300*k,300*k*.2,r=>{blob(c,soft('disc',[[0,'rgba(54,40,80,.8)'],[.7,'rgba(32,22,52,.5)'],[1,'rgba(20,14,34,0)']]),0,0,r,1);});};
  const rays=(c,x,y,len,a,t)=>add(c,()=>{for(let i=0;i<14;i++){const an=i*.4488+t*.00022,w=.05+.03*Math.sin(i*2.3+t*.003),g=c.createLinearGradient(x,y,x+Math.cos(an)*len,y+Math.sin(an)*len);g.addColorStop(0,`rgba(255,236,170,${.3*a})`);g.addColorStop(1,'rgba(255,200,100,0)');c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(an-w)*len,y+Math.sin(an-w)*len);c.lineTo(x+Math.cos(an+w)*len,y+Math.sin(an+w)*len);c.closePath();c.fill();}});
  const motes=(c,P,a)=>add(c,()=>{for(let i=0;i<16;i++){const ph=(P.t*.00012*(.6+i%4*.25)+i*.137)%1,x=P.cx+Math.sin(i*5.3+P.t*.0004)*(40+i*7)*P.k,y=P.gy-ph*150*P.k;blob(c,GLOW(),x,y,(1.6+i%3)*P.k,a*Math.sin(ph*3.14)*.8);}});
  // ---- 第1段階：卵に文字が貼り付く ----
  const st1=(c,P,u)=>{const{cx,gy,k,t}=P,s=36*k,ey=gy-1.05*s+2*k;
    ground(c,P);contact(c,cx,gy,s*1.45,.95);
    add(c,()=>{for(let i=0;i<3;i++){const p=((t/1500)+i/3)%1;flat(c,cx,gy-6*k,s*1.1+p*150*k,(s*1.1+p*150*k)*.28,r=>{c.strokeStyle=`rgba(255,215,130,${(1-p)*.5})`;c.lineWidth=(2.4-p*1.5)*k*(r/(r||1));c.beginPath();c.arc(0,0,r,0,6.283);c.stroke();});}});
    add(c,()=>blob(c,GLOW(),cx,ey,s*(2.2+.4*u),.28+.22*u));
    c.save();c.translate(cx,gy-2*k);c.rotate(Math.sin(t*.032)*.04*(.3+u));c.translate(0,-(1.05*s-2*k));
    eggBody(c,s,.12+.4*u);
    c.save();ePath(c,s);c.clip();
    [['ド',-.42,-.6,-.28],['グ',.36,-.34,.22],['ォ',-.3,.14,-.12],['ー',.32,.52,.26],['ム',-.04,-.14,.05]].forEach(([ch,x,y,rt],i)=>{const a0=i*.13;if(u<a0)return;const p=E((u-a0)/.1),sc=1+(1-p)*.7;
      c.save();c.translate(x*s,y*s);c.rotate(rt);c.scale(sc,sc);c.font=`900 ${s*.62}px ${FONT}`;c.textAlign='center';c.textBaseline='middle';c.globalAlpha*=p;
      c.fillStyle='rgba(255,170,60,.35)';c.fillText(ch,0,0);c.lineWidth=s*.05;c.strokeStyle='rgba(255,200,110,.55)';c.strokeText(ch,0,0);c.fillStyle='rgba(78,22,8,.92)';c.fillText(ch,0,0);c.restore();});
    c.restore();c.restore();
    ['ド','グ','ォ','ー','ム'].forEach((ch,i)=>{const a0=i*.13+.06;if(u<a0)return;const an=-2.55+i*.66;for(let j=1;j<=2;j++){const pu=((t/1100)+j*.4+i*.17)%1;
      gtx(c,ch,cx+Math.cos(an)*s*(1.35+.3*j+pu*.35),ey+Math.sin(an)*s*(1.1+.25*j+pu*.3),s*(.46+.12*j),'rgba(255,214,120,1)','#ff9a30',(i-2)*.2,(.34/j)*(1-pu)*E((u-a0)/.1));}});
    motes(c,P,.55);};
  // ---- 第2段階：殻を破り、しっぽの文字が効果を出す ----
  const shards=(c,P,x,y,s,q)=>{const{gy,k}=P,T=q*2.1;SH.forEach((h,i)=>{const sp=h.c?.25:h.v,vx=Math.cos(h.an)*sp*1.5,vy=Math.sin(h.an)*sp*.8-h.up*(h.c?.3:1.1);
      let X=h.cx+vx*T,Y=h.cy+vy*T+.5*3.1*T*T;const lim=(gy-y)/s-.18;let landed=0;if(Y>lim){Y=lim;landed=1;}
      const rot=h.w*T*(landed?.35:1)*(landed?.4:1)*.4,al=CL(1-(q-.72)*3.6,0,1);if(al<=0)return;
      if(landed)flat(c,x+X*s,gy,s*.55,s*.14,r=>blob(c,SHAD(),0,0,r,.5*al));
      c.save();c.globalAlpha*=al;c.translate(x+X*s,y+Y*s);c.rotate(rot);c.beginPath();h.poly.forEach((p,j)=>{const px=(p[0]-h.cx)*s,py=(p[1]-h.cy)*s;j?c.lineTo(px,py):c.moveTo(px,py);});c.closePath();
      let g=c.createLinearGradient(-.5*s,-.5*s,.5*s,.5*s);g.addColorStop(0,'#f6e8c8');g.addColorStop(.6,'#c7aa7c');g.addColorStop(1,'#7a5e3c');c.fillStyle=g;c.fill();
      c.save();c.clip();c.globalAlpha*=.5;c.drawImage(speck(),-.6*s,-.7*s,1.2*s,1.4*s);c.restore();
      c.lineJoin='round';c.lineWidth=Math.max(1,s*.04);c.strokeStyle='rgba(54,34,16,.85)';c.stroke();c.lineWidth=Math.max(.6,s*.014);c.strokeStyle='rgba(255,246,222,.75)';c.stroke();c.restore();});};
  const core=(c,P,x,y,s,q,t,cm)=>{add(c,()=>{blob(c,GLOW(),x,y,s*(1.5+.4*Math.sin(t*.01)),cm);blob(c,GLOW(),x,y,s*.7,cm);});
    ['ズ','グ','ゥ','シ'].forEach((ch,i)=>{const a0=.1+i*.08;if(q<a0)return;const f=E((q-a0)/.12),ph=t*.005+i*.9,px=x+s*(.95+i*.62),py=y+s*(.15+i*.05)+Math.sin(ph)*s*.2;
      add(c,()=>{for(let d=0;d<3;d++)blob(c,GLOW(),px-(d+1)*s*.16,py-Math.sin(ph-.5)*s*.04*(d+1),s*.11,.5*f);});gtx(c,ch,px,py,s*.74,'#ffe6b4','#ff9040',.28+i*.07+Math.sin(ph)*.05,f);});};
  const burst=(c,P,x,y,s,q,t)=>{const{k}=P,r=(40+E(q)*150)*k;
    {const R3=RN(13);for(let i=0;i<8;i++){const a=R3()*6.283,d=E(q)*r*(.55+R3()*.6);blob(c,SMOKE(),x+Math.cos(a)*d,y+Math.sin(a)*d*.8-q*60*k,r*(.3+R3()*.3),CL((q-.2)*1.6,0,.5)*(1-q*.5));}}
    add(c,()=>{blob(c,GLOW(),x,y,r*1.3*CL(1.3-q*1.2,0,1.3),CL(.8-q*1.3,0,.8));const R=RN(5);for(let i=0;i<14;i++){const a=R()*6.283,d=E(q)*r*(.35+R()*.7),sz=r*(.28+R()*.26)*(1-q*.4);blob(c,FIRE(),x+Math.cos(a)*d,y+Math.sin(a)*d*.85-q*30*k,sz,CL(1.15-q*1.15,0,1));}
      const R2=RN(9);c.lineCap='round';for(let i=0;i<34;i++){const a=R2()*6.283,v=(.5+R2()*.9),d0=E(q)*r*1.05*v,d1=d0+r*.18*(1-q)*v,gy2=q*q*60*k*v;c.strokeStyle=`rgba(255,${180+R2()*60|0},90,${(1-q)*.9})`;c.lineWidth=(1+R2()*1.6)*k;c.beginPath();c.moveTo(x+Math.cos(a)*d0,y+Math.sin(a)*d0*.85+gy2);c.lineTo(x+Math.cos(a)*d1,y+Math.sin(a)*d1*.85+gy2);c.stroke();}
      c.strokeStyle=`rgba(255,240,210,${CL(q*5,0,1)*(1-q)*.7})`;c.lineWidth=(3-2*q)*k;c.beginPath();c.arc(x,y,r*1.15,0,6.283);c.stroke();});
    tx(c,'ドグォーム',x+Math.sin(t*.09)*3*k*(1-q),y-100*k,42*k,['#fff2a0','#ff6a18'],'#3e0c00',-.07,CL(q*8,0,1)*(1-CL((q-.78)*5,0,1)),-.16);};
  const heat=(c,P,x,y,s,q,t)=>{const{k,gy}=P;
    add(c,()=>{blob(c,GLOW(),x,y,150*k,.5*CL(q*4,0,1));flat(c,x,gy,170*k,170*k*.26,r=>blob(c,soft('hot',[[0,'rgba(255,90,40,.6)'],[1,'rgba(255,40,0,0)']]),0,0,r,CL(q*3,0,1)));
      c.lineCap='round';for(let i=0;i<7;i++){const bx=x+(i-3)*24*k;c.beginPath();for(let yy=0;yy<=120;yy+=8){const h=((t*.00055+i*.17)%1),py=y+34*k-yy*k*(.7+h*.35),px=bx+Math.sin(yy*.14+t*.011+i*1.7)*(3+yy*.03)*k;if(yy)c.lineTo(px,py);else c.moveTo(px,py);}c.strokeStyle=`rgba(255,${120+i*8},70,${.11*CL(q*4,0,1)})`;c.lineWidth=16*k;c.stroke();c.strokeStyle=`rgba(255,190,130,${.1*CL(q*4,0,1)})`;c.lineWidth=5*k;c.stroke();}
      for(let i=0;i<26;i++){const h=((t*.0004*(.7+i%5*.2)+i*.173)%1);blob(c,FIRE(),x+Math.sin(i*4.1+t*.002)*(40+i*3)*k,y+30*k-h*170*k,(2+i%3*1.2)*k,(1-h)*CL(q*4,0,1)*(.6+.4*Math.sin(t*.03+i)));}});
    tx(c,'ズグゥシ',x,y-100*k,42*k,['#ffd9a0','#ff3a18'],'#3a0600',.05+Math.sin(t*.02)*.02,CL(q*7,0,1),-.1);};
  const st2=(c,P,u)=>{const{cx,gy,k,t}=P,s=36*k,ey=gy-1.05*s+2*k,brk=.4;ground(c,P);contact(c,cx,gy,s*1.45,.95);
    if(u<brk){const pr=E(u/brk);add(c,()=>blob(c,GLOW(),cx,ey,s*(2+pr),.25+.3*pr));
      c.save();c.translate(cx+Math.sin(t*.1)*2.4*k*pr,gy-2*k);c.rotate(Math.sin(t*.09)*.05*pr);c.translate(0,-(1.05*s-2*k));eggBody(c,s,.3+.6*pr);crackDraw(c,s,pr,pr);c.restore();
    }else{const q=(u-brk)/(1-brk);rays(c,cx,ey-s*.1,s*(5+q*2),(1-q*.3)*.75*(1-.5*CL((u-.62)*4,0,1)),t);add(c,()=>blob(c,GLOW(),cx,ey,s*(3.4+q*1.2),.85*(1-q*.35)));shards(c,P,cx,ey,s,q);core(c,P,cx,ey,s,q,t,1-.5*CL((u-.62)*4,0,1));}
    if(u>=.5&&u<.74)burst(c,P,cx,ey,s,(u-.5)/.24,t);else if(u>=.74)heat(c,P,cx,ey,s,(u-.74)/.26,t);
    motes(c,P,.5);};
  // ---- 第3段階：重圧で地面にめり込ませる ----
  const rockSp=()=>SP.rock||(SP.rock=(()=>{const W=200,H=170,cv=mkc(W,H),x=cv.getContext('2d'),r=RN(31),pts=[[W*.04,H-8]];for(let i=0;i<14;i++){const a=Math.PI*(1+i/13),rr=1+(r()-.5)*.14;pts.push([W/2+Math.cos(a)*W*.46*rr,H-8+Math.sin(a)*(H-18)*rr]);}pts.push([W*.96,H-8]);
    x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.save();x.clip();
    let g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#9a90ae');g.addColorStop(.45,'#4e4666');g.addColorStop(1,'#14101e');x.fillStyle=g;x.fillRect(0,0,W,H);
    for(let i=0;i<280;i++){x.fillStyle=`rgba(${r()<.5?'255,255,255':'0,0,0'},${.04+r()*.12})`;x.beginPath();x.arc(r()*W,r()*H,.6+r()*3,0,6.283);x.fill();}
    x.strokeStyle='rgba(10,6,18,.5)';x.lineWidth=1.3;for(let i=0;i<7;i++){x.beginPath();let px=r()*W,py=r()*H*.7;x.moveTo(px,py);for(let j=0;j<4;j++){px+=(r()-.5)*40;py+=r()*22;x.lineTo(px,py);}x.stroke();}
    g=x.createRadialGradient(W*.38,H*.25,2,W*.38,H*.25,W*.5);g.addColorStop(0,'rgba(225,220,255,.5)');g.addColorStop(1,'rgba(225,220,255,0)');x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();x.strokeStyle='rgba(20,12,34,.8)';x.lineWidth=2;x.stroke();return cv;})());
  const st3=(c,P,u)=>{const{cx,gy,k,t,y0}=P,hit=.3,RW=84*k,RH=RW*.85;ground(c,P);
    const p=u<hit?0:(u-hit)/(1-hit),pe=E(Math.min(1,p*1.5)),sink=pe*RH*.66,topY=gy-RH;
    contact(c,cx,gy,RW*.62,.7);
    // 殴られる岩（めり込む）
    c.save();c.beginPath();{const rx=RW*.56,ry=rx*.26;c.moveTo(cx-400*k,y0-50);c.lineTo(cx+400*k,y0-50);c.lineTo(cx+400*k,gy);c.lineTo(cx+rx,gy);c.ellipse(cx,gy,rx,ry,0,0,Math.PI,false);c.lineTo(cx-400*k,gy);c.closePath();}c.clip();c.translate(cx,gy+sink);c.scale(1+pe*.06,1-pe*.07);c.rotate(Math.sin(t*.05)*.012*(1-p)*(p?1:0));c.drawImage(rockSp(),-RW/2,-RH-8*k*(RH/170),RW,RH*(170/(170-8))*1);c.restore();
    flat(c,cx,gy+1*k,RW*.6,RW*.6*.26,r=>blob(c,SHAD(),0,0,r,.45*(1-pe*.5)));
    if(u<hit){const f=E(u/hit),y=y0+(topY-y0)*f;add(c,()=>{const g=c.createLinearGradient(cx,y-220*k,cx,y);g.addColorStop(0,'rgba(210,200,255,0)');g.addColorStop(1,'rgba(235,228,255,.85)');c.fillStyle=g;c.fillRect(cx-5*k,Math.max(y0,y-220*k),10*k,Math.min(220*k,y-y0));blob(c,GLOW(),cx,y,46*k,1);});return;}
    // 重圧：上から押さえつける空気
    const ga=CL(1-p*.7,0,1);c.save();const gr=c.createLinearGradient(0,y0,0,gy);gr.addColorStop(0,'rgba(24,8,52,0)');gr.addColorStop(1,`rgba(24,8,52,${.55*pe*ga})`);c.fillStyle=gr;c.fillRect(cx-150*k,y0,300*k,Math.max(1,gy-y0));c.restore();
    add(c,()=>{c.lineCap='round';for(let i=0;i<16;i++){const x=cx-130*k+i*(260/15)*k,ph=((t*.0013*(.8+i%3*.3))+i*.37)%1,yy=y0+(gy-y0)*ph;const g=c.createLinearGradient(x,yy-70*k,x,yy);g.addColorStop(0,'rgba(190,180,255,0)');g.addColorStop(1,`rgba(200,190,255,${.34*ga})`);c.strokeStyle=g;c.lineWidth=2*k;c.beginPath();c.moveTo(x,yy-70*k);c.lineTo(x,yy);c.stroke();}});
    // 地面：へこみ・割れ目
    flat(c,cx,gy,(40+pe*135)*k,(40+pe*135)*k*.27,r=>{blob(c,soft('crater',[[0,'rgba(4,2,10,.95)'],[.55,'rgba(10,6,20,.75)'],[1,'rgba(10,6,20,0)']]),0,0,r,pe);});
    c.save();c.lineCap='round';c.lineJoin='round';const R=RN(77);for(let i=0;i<12;i++){const a=i*.5236+R()*.3,L=(26+pe*(36+R()*54))*k;c.beginPath();let x=cx+Math.cos(a)*30*k,y=gy+Math.sin(a)*30*k*.27;c.moveTo(x,y);const n=6;for(let j=1;j<=n;j++){const f=j/n,aa=a+(R()-.5)*.5;x=cx+Math.cos(aa)*(30*k+L*f);y=gy+Math.sin(aa)*(30*k+L*f)*.27;c.lineTo(x,y);}c.strokeStyle='rgba(8,4,16,.9)';c.lineWidth=(3.4-.8*R())*k;c.stroke();c.strokeStyle=`rgba(190,180,230,${.16*pe})`;c.lineWidth=.7*k;c.stroke();}c.restore();
    // 衝撃の輪・砂ぼこり
    add(c,()=>{for(let i=0;i<2;i++){const q=CL(p*1.4-i*.25,0,1);flat(c,cx,gy,(24+q*220)*k,(24+q*220)*k*.25,r=>{c.strokeStyle=`rgba(215,205,255,${(1-q)*.7})`;c.lineWidth=(3.4-2*q)*k*(r?1:1);c.beginPath();c.arc(0,0,r,0,6.283);c.stroke();});}});
    const Rd=RN(55);for(let i=0;i<28;i++){const dir=i%2?1:-1,sp=.4+Rd()*.9,x=cx+dir*(30+E(p)*220*sp)*k*(.5+Rd()*.5),y=gy-6*k-E(p)*(20+Rd()*50)*k+Rd()*12*k;blob(c,DUST(),x,y,(18+E(p)*(40+Rd()*40))*k,CL(1.15-p,0,1)*.8);}
    // 破片
    const Rb=RN(91);for(let i=0;i<11;i++){const vx=(Rb()-.5)*2.4,vy=-(1+Rb()*1.8),T=p*2.2,X=vx*T*90*k,Y=vy*T*110*k+.5*3.4*T*T*110*k;if(Y>0)continue;
      c.save();c.globalAlpha*=CL(1.3-p,0,1);c.translate(cx+X*(1+i%3*.3),gy+Y);c.rotate(T*(i%2?3:-3)+i);c.fillStyle='#3c3452';c.strokeStyle='rgba(20,12,34,.9)';c.lineWidth=.8*k;const sz=(1.8+Rb()*3.2)*k;c.beginPath();c.moveTo(-sz,sz*.5);c.lineTo(0,-sz);c.lineTo(sz,sz*.6);c.closePath();c.fill();c.stroke();c.restore();}
    // 岩の手前の縁（地面に飲み込まれて見える）
    flat(c,cx,gy+sink*.0,RW*.62*(1+pe*.15),RW*.62*.26,r=>{c.strokeStyle=`rgba(190,180,225,${.18*pe})`;c.lineWidth=2*k;c.beginPath();c.arc(0,0,r,0,3.1416);c.stroke();});
    tx(c,'ズゥゥン…',cx+Math.sin(t*.09)*3*k*(1-p),gy-RH-60*k,46*k,['#f4eeff','#8a78d8'],'#120628',.04,CL(p*6,0,1)*(1-CL((p-.82)*6,0,1)),-.08);};
  const paint=(c,P,s,u)=>{c.save();if(s===2&&u>.3){const p=(u-.3)/.7,sh=(1-p)*(1-p)*7*P.k;c.translate(Math.sin(P.t*.11)*sh,Math.cos(P.t*.13)*sh*.7);}[st1,st2,st3][s](c,P,u);c.restore();};
  return{paint};
})();

addScene({name:'molt3', rarity:'superrare', emoji:'🥚', title:'三段の脱皮', focus:55, flags:{gold:1},
  desc:'場の背景：卵が三段階に進化する（文字を貼る→しっぽの文字が効果を放つ→重圧で地面にめり込ませる）',
  draw:function(){const r=_rng(41),F="font-family=\"'Hiragino Mincho ProN','Yu Mincho','Noto Serif CJK JP',serif\" font-weight=\"900\"";
    let pb='';for(let i=0;i<170;i++){const y=486+Math.pow(r(),1.5)*300,x=r()*400,s=(.5+(y-470)/150*1.6)*(.5+r());pb+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(s*1.5).toFixed(1)}" ry="${(s*.7).toFixed(1)}" fill="${r()<.5?'#34294a':'#0e0918'}" opacity="${(.25+r()*.4).toFixed(2)}"/>`;}
    const rock=(x,y,w,h,seed,txt,col,rot)=>{const q=_rng(seed),n=16;let d=`M${x} ${y}`;for(let i=1;i<n;i++)d+=`L${(x+w*i/n+(q()-.5)*w*.05).toFixed(1)} ${(y-h*Math.pow(Math.sin(Math.PI*i/n),.55)*(.82+q()*.22)).toFixed(1)}`;d+=`L${x+w} ${y}Z`;const cx=x+w/2,cy=y-h*.42;
      return `<ellipse cx="${cx}" cy="${y+3}" rx="${w*.68}" ry="6" fill="#000" opacity=".6" filter="url(#bl)"/><path d="${d}" fill="url(#rk)"/><path d="${d}" fill="none" stroke="#8a7cc0" stroke-width="1.2" opacity=".35"/>
<g transform="rotate(${rot} ${cx} ${cy})"><text x="${cx}" y="${cy}" font-size="21" ${F} fill="${col}" opacity=".7" text-anchor="middle" filter="url(#bl)">${txt}</text><text x="${cx}" y="${cy}" font-size="21" ${F} fill="${col}" opacity=".9" stroke="#2a0a04" stroke-width=".6" text-anchor="middle">${txt}</text></g>`;};
    return `<defs>${_vgrad('sk',[[0,'#04040f'],[.3,'#0e0c2a'],[.52,'#2a2048'],[.6,'#5a3a64']])}${_vgrad('gd',[[0,'#2c2244'],[.1,'#1a1430'],[1,'#05030a']])}${_vgrad('rk',[[0,'#5a5078'],[1,'#120c20']])}${_glow('mn','#f4f0ff','#8a88d0')}${_glow('pool','#c8c0ff','#4a3c80')}
${_cloudDef('c1','0.006 0.03',4,9,[.55,.5,.75],2.6,-1.05)}${_band('m1',120,470,.25,.7)}${_cloudDef('fg','0.01 0.06',3,4,[.35,.3,.5],2,-.8)}${_band('m2',440,570,.3,.65)}<filter id="bl"><feGaussianBlur stdDeviation="3"/></filter></defs>
<rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,380,120)}<circle cx="290" cy="170" r="150" fill="url(#mn)" opacity=".5"/><circle cx="290" cy="170" r="26" fill="#f4f0ff"/><circle cx="283" cy="164" r="26" fill="#cfcaf0" opacity=".25"/>
<rect width="400" height="800" filter="url(#c1)" mask="url(#m1)" opacity=".7"/>
<path d="${_ridge(r,{base:455,amp:46,rough:.62,bottom:500}).fill}" fill="#1a1432"/><path d="${_ridge(r,{base:474,amp:24,rough:.6,bottom:510}).fill}" fill="#0f0b20"/>
<rect y="472" width="400" height="328" fill="url(#gd)"/><ellipse cx="200" cy="552" rx="200" ry="58" fill="url(#pool)" opacity=".5"/><g>${pb}</g>
<rect width="400" height="800" filter="url(#fg)" mask="url(#m2)" opacity=".5"/>${rock(8,560,100,52,5,'ドグォーム','#ff9a40',-9)}${rock(294,564,98,48,8,'ズグゥシ','#ff5a3a',7)}`;},
  anim:function(){return(c,dt,now,S)=>{const T=4000,s=Math.floor((now%(T*3))/T),u=(now%T)/T;
    c.save();c.globalAlpha=Math.min(1,u/.06)*Math.min(1,(1-u)/.06);_mt.paint(c,{cx:200,gy:548,k:1.5,y0:S.y0,t:now},s,u);c.restore();c.globalAlpha=1;c.globalCompositeOperation='source-over';};}});

addFx({kind:'win', id:'molt3', name:'三段の脱皮', emoji:'🥚', c1:'#ffd060', c2:'#fff0d0', bg:'rgba(10,6,24,.9)', dm:'rgba(14,8,32,.45)', mode:'burst', dur:4.4,
  rarity:'superrare', flags:{gold:1}, desc:'上がりの演出：卵が三段階に進化する（文字を貼る→殻を破って効果を放つ→重圧で地面にめり込ませる）',
  draw:(W,H,D)=>{const k=Math.min(W,H)/250,cx=W/2,gy=H*.56;
    return(c,t,dt)=>{const p=Math.min(.999,t/Math.max(.1,D-.5)),s=Math.min(2,Math.floor(p*3)),u=p*3-s;
      c.save();c.globalAlpha=(1-_fSm(D-.5,D,t))*_fSm(0,.15,t);_mt.paint(c,{cx,gy,k,y0:0,t:t*1000,disc:true},s,u);c.restore();};}});

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
