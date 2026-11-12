
// ============================================================
// リーチ・ロンの演出（画面中央に大きく宣言を出す。操作はじゃましない）
// ============================================================
// ===== 演出（リーチ・ロン・上がり）を人ごとに選べる =====
const FX_STYLES={
  riichi:[
    {id:'default',name:'標準（青い閃光）',icon:'🀄'},
    {id:'flame',name:'炎',icon:'🔥',c1:'#ff6a20',c2:'#ffe0a0',bg:'rgba(50,10,0,.88)',dm:'rgba(60,10,0,.4)',g:['🔥'],mode:'burst'},
    {id:'sakura',name:'桜',icon:'🌸',c1:'#ff7aa8',c2:'#ffe4ee',bg:'rgba(50,10,28,.88)',dm:'rgba(60,10,34,.4)',g:['🌸'],mode:'fall'},
    {id:'ice',name:'氷',icon:'❄️',c1:'#5ad0ff',c2:'#e8f8ff',bg:'rgba(4,24,44,.88)',dm:'rgba(4,30,56,.4)',g:['❄️'],mode:'fall'},
    {id:'thunder',name:'雷',icon:'⚡',c1:'#b080ff',c2:'#fff0a0',bg:'rgba(24,8,50,.88)',dm:'rgba(30,8,60,.4)',g:['⚡'],mode:'burst'},
    {id:'aura',name:'威圧',icon:'👁️',c1:'#b060ff',c2:'#f0d8ff',bg:'rgba(24,4,48,.88)',dm:'rgba(30,6,60,.4)',g:['✦'],mode:'burst'},
    {id:'thread',name:'糸',icon:'🧵',c1:'#d6c0ff',c2:'#ffffff',bg:'rgba(20,10,44,.88)',dm:'rgba(26,12,56,.4)',mode:'burst'},
    {id:'bubble',name:'シャボン玉',icon:'🫧',c1:'#8ad8ff',c2:'#f0fbff',bg:'rgba(4,28,48,.86)',dm:'rgba(6,34,58,.4)',mode:'burst'},
    {id:'erase',name:'過程消去',icon:'🎞️',c1:'#ffe03a',c2:'#ffffff',bg:'rgba(10,10,16,.9)',dm:'rgba(14,10,20,.45)',mode:'burst'},
    {id:'disc',name:'ディスク',icon:'💿',c1:'#7ae0ff',c2:'#f0fbff',bg:'rgba(6,16,58,.88)',dm:'rgba(8,20,70,.4)',mode:'burst'},
    {id:'gravflip',name:'重力反転',icon:'🔃',c1:'#ff7ac8',c2:'#ffe8f6',bg:'rgba(30,10,60,.88)',dm:'rgba(36,12,70,.4)',mode:'burst'},
    {id:'scoop',name:'削り取る',icon:'🕳️',c1:'#c8a8ff',c2:'#f0e8ff',bg:'rgba(10,4,24,.9)',dm:'rgba(14,6,32,.45)',mode:'burst'},
    {id:'zipper',name:'ジッパー',icon:'🤐',c1:'#ffd23a',c2:'#fff6c0',bg:'rgba(14,10,40,.9)',dm:'rgba(18,12,50,.45)',mode:'burst'},
    {id:'frostsuit',name:'絶対零度',icon:'🥶',c1:'#9adfff',c2:'#f0fcff',bg:'rgba(4,22,44,.9)',dm:'rgba(4,28,56,.45)',mode:'burst'},
    {id:'forest',name:'翠',icon:'🍃',c1:'#40d890',c2:'#e0ffe8',bg:'rgba(4,36,22,.88)',dm:'rgba(4,44,26,.4)',g:['🍃'],mode:'fall'},
  ],
  ron:[
    {id:'default',name:'標準（赤い斬撃）',icon:'⚔️'},
    {id:'crimson',name:'紅蓮',icon:'💥',c1:'#ff2040',c2:'#ffd0d8',bg:'rgba(50,0,8,.9)',dm:'rgba(60,0,10,.45)',g:['💥'],mode:'burst'},
    {id:'void',name:'闇',icon:'🌙',c1:'#8a40ff',c2:'#e0d0ff',bg:'rgba(20,6,46,.9)',dm:'rgba(24,6,56,.45)',g:['🌙','✦'],mode:'burst'},
    {id:'gold',name:'黄金',icon:'🪙',c1:'#ffc830',c2:'#fff4c0',bg:'rgba(44,28,0,.9)',dm:'rgba(50,32,0,.45)',g:['🪙'],mode:'burst'},
    {id:'ocean',name:'大波',icon:'🌊',c1:'#2090ff',c2:'#d0ecff',bg:'rgba(0,18,48,.9)',dm:'rgba(0,22,56,.45)',g:['🌊','💧'],mode:'burst'},
    {id:'rush',name:'ラッシュ',icon:'👊',c1:'#b070ff',c2:'#fff0a0',bg:'rgba(18,6,40,.9)',dm:'rgba(24,8,52,.45)',g:['✦'],mode:'burst'},
    {id:'claw',name:'爪弾',icon:'💅',c1:'#ffb0d8',c2:'#fff0f8',bg:'rgba(40,6,28,.9)',dm:'rgba(50,8,34,.45)',mode:'burst'},
    {id:'heavyrain',name:'重い雨',icon:'🌧️',c1:'#9ab8f0',c2:'#e8f0ff',bg:'rgba(6,10,36,.92)',dm:'rgba(8,14,46,.5)',mode:'burst'},
    {id:'redray',name:'赤光線',icon:'👁️',c1:'#ff3a40',c2:'#ffe0e0',bg:'rgba(40,4,12,.9)',dm:'rgba(50,4,14,.45)',mode:'burst'},
    {id:'lightblade',name:'光刃',icon:'🗡️',c1:'#7ae0ff',c2:'#f0fcff',bg:'rgba(4,22,46,.9)',dm:'rgba(4,28,56,.45)',mode:'burst'},
    {id:'tankbomb',name:'戦車爆弾',icon:'💣',c1:'#ff8a30',c2:'#fff0c8',bg:'rgba(30,10,2,.9)',dm:'rgba(40,12,2,.45)',mode:'burst'},
    {id:'virus',name:'殺人ウイルス',icon:'🦠',c1:'#9aff40',c2:'#f0ffd0',bg:'rgba(16,6,30,.92)',dm:'rgba(20,8,40,.5)',mode:'burst'},
    {id:'magnet',name:'磁力の刃',icon:'🧲',c1:'#ff6a7a',c2:'#ffe0e4',bg:'rgba(26,6,14,.92)',dm:'rgba(34,8,18,.5)',mode:'burst'},
    {id:'jade',name:'翡翠',icon:'💎',c1:'#20c0a0',c2:'#d8fff4',bg:'rgba(0,36,30,.9)',dm:'rgba(0,44,36,.45)',g:['💎'],mode:'burst'},
  ],
  win:[
    {id:'default',name:'標準（金の花）',icon:'🌼'},
    {id:'fireworks',name:'花火',icon:'🎆',c1:'#ff7ac8',c2:'#fff0ff',bg:'rgba(26,6,40,.88)',dm:'rgba(30,6,48,.4)',g:['🎆','🎇'],mode:'burst'},
    {id:'confetti',name:'紙吹雪',icon:'🎉',c1:'#ffd040',c2:'#fff8d8',bg:'rgba(40,24,8,.86)',dm:'rgba(46,28,8,.35)',g:['🎉','🎊'],mode:'fall'},
    {id:'star',name:'流れ星',icon:'⭐',c1:'#ffe060',c2:'#fffbe0',bg:'rgba(8,10,44,.88)',dm:'rgba(8,12,54,.4)',g:['⭐','✨'],mode:'fall'},
    {id:'royal',name:'王冠',icon:'👑',c1:'#c890ff',c2:'#fff0c0',bg:'rgba(28,10,50,.88)',dm:'rgba(32,10,60,.4)',g:['👑','💜'],mode:'burst'},
    {id:'timestop',name:'時間停止',icon:'⏱️',c1:'#efe2b0',c2:'#fffbe8',bg:'rgba(20,20,28,.9)',dm:'rgba(24,24,34,.45)',g:['✦'],mode:'burst'},
    {id:'mend',name:'修復',icon:'🔧',c1:'#ffd860',c2:'#fff8d8',bg:'rgba(30,24,6,.88)',dm:'rgba(36,28,6,.4)',mode:'burst'},
    {id:'sprout',name:'芽吹き',icon:'🌱',c1:'#7ae890',c2:'#f0ffe8',bg:'rgba(6,30,16,.88)',dm:'rgba(8,38,20,.4)',mode:'burst'},
    {id:'chronolock',name:'止まった世界',icon:'🧊',c1:'#cfeaff',c2:'#ffffff',bg:'rgba(14,24,38,.9)',dm:'rgba(18,30,48,.45)',mode:'burst'},
    {id:'rewind',name:'巻き戻し',icon:'⏪',c1:'#ff7ad8',c2:'#f4e0ff',bg:'rgba(26,6,48,.9)',dm:'rgba(32,8,58,.45)',mode:'burst'},
    {id:'cosmos',name:'宇宙一巡',icon:'🌌',c1:'#b090ff',c2:'#fff2c8',bg:'rgba(10,4,30,.9)',dm:'rgba(14,6,40,.45)',mode:'burst'},
    {id:'weather',name:'天候',icon:'⛈️',c1:'#b8d0ff',c2:'#ffffff',bg:'rgba(14,18,40,.9)',dm:'rgba(18,24,50,.45)',mode:'burst'},
    {id:'book',name:'命令の本',icon:'📖',c1:'#ffd878',c2:'#fff4d0',bg:'rgba(30,18,6,.9)',dm:'rgba(38,22,6,.45)',mode:'burst'},
    {id:'cure',name:'癒しの料理',icon:'🍝',c1:'#8affb0',c2:'#f0ffe8',bg:'rgba(4,30,18,.9)',dm:'rgba(6,38,22,.45)',mode:'burst'},
    {id:'rainbow',name:'虹',icon:'🌈',c1:'#ff9a60',c2:'#f4f0ff',bg:'rgba(10,20,40,.86)',dm:'rgba(12,24,50,.35)',g:['✨','💫'],mode:'fall'},
  ],
};
function loadMyFx(){try{return JSON.parse(localStorage.getItem('rikka_fx')||'{}')||{};}catch(e){return {};}}
function myFxId(kind){const v=loadMyFx()[kind];if(!FX_STYLES[kind].some(s=>s.id===v))return 'default';const g=(typeof GOLD_FX!=='undefined')&&GOLD_FX[v];if(g&&!loadGachaState().owned.includes(g))return 'default';return v;}
function myFxPayload(){return {riichi:myFxId('riichi'),ron:myFxId('ron'),win:myFxId('win')};}
function fxStyleOf(kind,fx){const id=fx&&fx[kind];return FX_STYLES[kind].find(s=>s.id===id)||FX_STYLES[kind][0];}
// その人の演出（自分は自分の設定、相手は届いた設定、CPUは標準）
function fxOfPlayer(p){if(!G||!p)return null;const i=G.players.indexOf(p);if(i===myOnlineIdx)return myFxPayload();return p.isBot?null:(p.fx||null);}
function fxOfName(name){if(!G)return null;const p=G.players.find(q=>q.name===name);return p?fxOfPlayer(p):null;}
function syncMyFx(){if(typeof currentCode!=='undefined'&&currentCode)socket?.emit('set_fx',{code:currentCode,fx:myFxPayload()});}
function selectFx(kind,id){
  if(!FX_STYLES[kind]||!FX_STYLES[kind].some(s=>s.id===id))return;
  const o=loadMyFx();o[kind]=id;try{localStorage.setItem('rikka_fx',JSON.stringify(o));}catch(e){}
  syncMyFx();renderCustomize();
  showCallFx(kind,myName(),'プレビュー',myFxPayload());
}
// ===== 演出のリアル描画（canvas）=====
const _fR=Math.random,_fRn=(a,b)=>a+_fR()*(b-a),_fSm=(a,b,x)=>{x=Math.max(0,Math.min(1,(x-a)/(b-a)));return x*x*(3-2*x);};
const _fSpC={};
function fxHexA(h,a){const n=parseInt(h.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`;}
function fxSpr(col){if(_fSpC[col])return _fSpC[col];const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,.95)');r.addColorStop(.28,fxHexA(col,.8));r.addColorStop(1,fxHexA(col,0));g.fillStyle=r;g.fillRect(0,0,64,64);return _fSpC[col]=c;}
function fxGlow(c,x,y,r,col,a){c.globalAlpha=a;c.drawImage(fxSpr(col),x-r,y-r,r*2,r*2);}
function fxFlare(c,x,y,s,col,a){c.globalAlpha=a;c.strokeStyle=col;c.lineWidth=1.5;c.beginPath();c.moveTo(x-s,y);c.lineTo(x+s,y);c.moveTo(x,y-s);c.lineTo(x,y+s);c.stroke();fxGlow(c,x,y,s*.8,col,a);}
function fxPetal(c,s,c1,c2){const g=c.createLinearGradient(0,-s,0,s);g.addColorStop(0,c1);g.addColorStop(1,c2);c.fillStyle=g;c.beginPath();c.moveTo(0,-s);c.bezierCurveTo(s*.95,-s*.8,s*.85,s*.55,s*.12,s);c.lineTo(0,s*.78);c.lineTo(-s*.12,s);c.bezierCurveTo(-s*.85,s*.55,-s*.95,-s*.8,0,-s);c.fill();}
function fxLeaf(c,s,c1,c2){const g=c.createLinearGradient(-s*.5,0,s*.5,0);g.addColorStop(0,c1);g.addColorStop(1,c2);c.fillStyle=g;c.beginPath();c.moveTo(0,-s);c.bezierCurveTo(s*.9,-s*.5,s*.7,s*.5,0,s);c.bezierCurveTo(-s*.7,s*.5,-s*.9,-s*.5,0,-s);c.fill();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.beginPath();c.moveTo(0,-s);c.lineTo(0,s);c.stroke();}
function fxFlake(c,s){c.beginPath();for(let k=0;k<6;k++){c.rotate(Math.PI/3);c.moveTo(0,0);c.lineTo(0,-s);for(const b of[.42,.72]){c.moveTo(0,-s*b);c.lineTo(s*.26,-s*(b+.2));c.moveTo(0,-s*b);c.lineTo(-s*.26,-s*(b+.2));}}c.stroke();}
function fxBolt(x1,y1,x2,y2,d,out,w){if(d<3){out.push([x1,y1,x2,y2,w]);return;}const mx=(x1+x2)/2+_fRn(-d,d),my=(y1+y2)/2+_fRn(-d*.3,d*.3);fxBolt(x1,y1,mx,my,d/2,out,w);fxBolt(mx,my,x2,y2,d/2,out,w);if(_fR()<.22&&w>1.2)fxBolt(mx,my,mx+_fRn(-1,1)*d*2.6,my+d*2.4+_fRn(0,d),d/2,out,w*.5);}
function fxCrown(c){c.beginPath();c.moveTo(-100,50);c.lineTo(-104,-34);c.lineTo(-52,8);c.lineTo(0,-66);c.lineTo(52,8);c.lineTo(104,-34);c.lineTo(100,50);c.closePath();}
const FXS={};
FXS.flame=(W,H,D)=>{const ps=[],em=[],k=H/700;return(c,t,dt)=>{c.globalCompositeOperation='lighter';const fade=_fSm(0,.3,t)*(1-_fSm(D-.5,D,t));const gr=c.createLinearGradient(0,H,0,H*.4);gr.addColorStop(0,fxHexA('#ff5a10',.6*fade));gr.addColorStop(1,fxHexA('#ff5a10',0));c.fillStyle=gr;c.fillRect(0,H*.4,W,H*.6);
if(t<D-.5){const n=Math.ceil(dt*W/6);for(let i=0;i<n;i++)ps.push({x:_fR()*W,y:H+20,vx:_fRn(-20,20),vy:-_fRn(260,560)*k,l:0,m:_fRn(.7,1.4),s:_fRn(50,100),ph:_fR()*9});if(_fR()<dt*60)em.push({x:_fR()*W,y:H,vx:_fRn(-40,40),vy:-_fRn(200,520)*k,l:0,m:_fRn(1,2)});}
for(let i=ps.length-1;i>=0;i--){const p=ps[i];p.l+=dt;if(p.l>p.m){ps.splice(i,1);continue;}p.x+=(p.vx+Math.sin(p.y*.02+p.ph)*40)*dt;p.y+=p.vy*dt;const f=p.l/p.m;fxGlow(c,p.x,p.y,p.s*(1-f*.55),f<.2?'#ffe9a0':f<.55?'#ff9a20':'#d82000',(1-f)*.5);}
for(let i=em.length-1;i>=0;i--){const p=em[i];p.l+=dt;if(p.l>p.m){em.splice(i,1);continue;}p.x+=(p.vx+Math.sin(p.l*7)*30)*dt;p.y+=p.vy*dt;fxGlow(c,p.x,p.y,6,'#ffd060',(1-p.l/p.m)*(.6+.4*Math.sin(p.l*30)));}};};
FXS.sakura=(W,H,D)=>{const ps=Array.from({length:80},()=>({x:_fRn(-.1,1.1)*W,y:-30,vy:_fRn(70,150),vx:_fRn(20,90),ph:_fR()*9,r:_fR()*6,vr:_fRn(-2,2),f:_fR()*9,s:_fRn(8,17),dl:_fRn(0,1.1),a:_fRn(.65,1)}));return(c,t,dt)=>{const wash=c.createLinearGradient(0,0,W,H);wash.addColorStop(0,fxHexA('#ff9ac0',.18*_fSm(0,.5,t)));wash.addColorStop(1,fxHexA('#ff9ac0',0));c.fillStyle=wash;c.fillRect(0,0,W,H);
for(const p of ps){if(t<p.dl)continue;p.y+=p.vy*dt;p.x+=(p.vx+Math.sin(t*2+p.ph)*50)*dt;p.r+=p.vr*dt;p.f+=dt*3;c.save();c.translate(p.x,p.y);c.rotate(p.r);c.scale(.25+.75*Math.abs(Math.cos(p.f)),1);c.globalAlpha=p.a;fxPetal(c,p.s,'#ffe4ee','#ff8fb6');c.restore();}};};
FXS.ice=(W,H,D)=>{const fl=Array.from({length:46},()=>({x:_fR()*W,y:_fRn(-H*.6,0),vy:_fRn(50,120),s:_fRn(8,22),r:_fR()*6,vr:_fRn(-.8,.8),ph:_fR()*9,tw:_fR()*9})),dots=Array.from({length:90},()=>({x:_fR()*W,y:_fRn(-H,H),vy:_fRn(60,180),s:_fRn(1,3.2)}));return(c,t,dt)=>{const a=_fSm(0,.5,t);const v=c.createRadialGradient(W/2,H*.46,Math.min(W,H)*.3,W/2,H*.46,Math.max(W,H)*.75);v.addColorStop(0,fxHexA('#9fe0ff',0));v.addColorStop(1,fxHexA('#bfeaff',.5*a));c.fillStyle=v;c.fillRect(0,0,W,H);
for(const d of dots){d.y+=d.vy*dt;if(d.y>H)d.y=-5;c.globalAlpha=.8;c.fillStyle='#fff';c.beginPath();c.arc(d.x+Math.sin(t+d.y*.01)*10,d.y,d.s,0,7);c.fill();}
c.lineCap='round';for(const f of fl){f.y+=f.vy*dt;if(f.y>H+30)f.y=-30;f.r+=f.vr*dt;c.save();c.translate(f.x+Math.sin(t*1.3+f.ph)*26,f.y);c.rotate(f.r);c.strokeStyle='#e8f8ff';c.lineWidth=f.s>14?1.8:1.2;c.globalAlpha=.9;c.shadowColor='#5ad0ff';c.shadowBlur=8;fxFlake(c,f.s);c.restore();}
c.globalCompositeOperation='lighter';for(let i=0;i<8;i++){const s=Math.sin(t*3+fl[i].tw);if(s>.6)fxFlare(c,fl[i].x,fl[i].y,10,'#bfeaff',(s-.6)*2);}};};
FXS.thunder=(W,H,D)=>{const times=[.08,.42,.8,1.15].filter(x=>x<D-.35),bolts=times.map((tm,i)=>{const x=W*_fRn(.15+i*.05,.85-i*.05),o=[];fxBolt(x,-10,x+_fRn(-W*.15,W*.15),H*_fRn(.7,.95),H*.16,o,4);return{tm,o};});return(c,t,dt)=>{let fl=0;for(const b of bolts){const u=t-b.tm;if(u<0||u>.4)continue;const a=Math.max(0,1-u/.4)*(u<.12?1:.75+.25*Math.sin(u*90));fl=Math.max(fl,a);c.globalCompositeOperation='lighter';c.lineCap='round';c.shadowColor='#b080ff';c.shadowBlur=28;for(const[w,col,al]of[[6,'#8a5aff',.55],[2.4,'#ffffff',1]]){c.strokeStyle=col;c.globalAlpha=a*al;for(const s of b.o){c.lineWidth=w*s[4]/4+.4;c.beginPath();c.moveTo(s[0],s[1]);c.lineTo(s[2],s[3]);c.stroke();}}c.shadowBlur=0;}
if(fl>0){c.globalCompositeOperation='lighter';c.globalAlpha=1;c.fillStyle=`rgba(190,160,255,${.32*fl})`;c.fillRect(0,0,W,H);}};};
FXS.forest=(W,H,D)=>{const lv=Array.from({length:48},()=>({x:_fR()*W,y:_fRn(-H*.7,0),vy:_fRn(60,140),ph:_fR()*9,r:_fR()*6,vr:_fRn(-1.5,1.5),s:_fRn(8,16),f:_fR()*9,c:_fR()<.5?['#7ae890','#1f9e5a']:['#c8f080','#3aa83a']})),ff=Array.from({length:34},()=>({x:_fR()*W,y:_fR()*H,ph:_fR()*9,s:_fRn(3,6)}));return(c,t,dt)=>{c.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const x0=W*(.15+i*.22),al=(.08+.05*Math.sin(t*1.6+i))*_fSm(0,.5,t);const g=c.createLinearGradient(x0,0,x0-W*.18,H);g.addColorStop(0,fxHexA('#c8ffd0',al*2));g.addColorStop(1,fxHexA('#c8ffd0',0));c.fillStyle=g;c.globalAlpha=1;c.beginPath();c.moveTo(x0-30,0);c.lineTo(x0+50,0);c.lineTo(x0-W*.18+120,H);c.lineTo(x0-W*.18-60,H);c.fill();}
for(const f of ff){fxGlow(c,f.x+Math.sin(t*.9+f.ph)*40,f.y+Math.cos(t*.7+f.ph)*30,f.s*3,'#d8ff70',.35+.65*Math.abs(Math.sin(t*2.2+f.ph)));}
c.globalCompositeOperation='source-over';for(const l of lv){l.y+=l.vy*dt;l.x+=Math.sin(t*1.8+l.ph)*45*dt;l.r+=l.vr*dt;l.f+=dt*2.5;if(l.y>H+20)l.y=-20;c.save();c.translate(l.x,l.y);c.rotate(l.r);c.scale(.3+.7*Math.abs(Math.cos(l.f)),1);c.globalAlpha=.92;fxLeaf(c,l.s,l.c[0],l.c[1]);c.restore();}};};
FXS.crimson=(W,H,D)=>{const cx=W/2,cy=H*.46,ps=[],mx=Math.max(W,H);for(let i=0;i<150;i++){const a=_fR()*6.283,v=_fRn(250,1000)*mx/900;ps.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:0,m:_fRn(.6,1.4),s:_fRn(20,60),sp:_fR()<.4});}return(c,t,dt)=>{c.globalCompositeOperation='lighter';if(t<.25){c.globalAlpha=1;c.fillStyle=`rgba(255,120,100,${.55*(1-t/.25)})`;c.fillRect(0,0,W,H);}
for(const[d,col]of[[0,'#ffd0b0'],[.12,'#ff3040']]){const u=t-d;if(u<0||u>1)continue;c.strokeStyle=col;c.globalAlpha=(1-u)*.8;c.lineWidth=26*(1-u)+2;c.beginPath();c.arc(cx,cy,u*mx*.9,0,7);c.stroke();}
for(const p of ps){p.l+=dt;if(p.l>p.m)continue;p.vx*=1-1.6*dt;p.vy=p.vy*(1-1.6*dt)+(p.sp?500:-30)*dt;const px=p.x,py=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;const f=p.l/p.m;if(p.sp){c.strokeStyle='#ffc060';c.globalAlpha=1-f;c.lineWidth=2;c.beginPath();c.moveTo(px,py);c.lineTo(p.x-p.vx*.03,p.y-p.vy*.03);c.stroke();}else fxGlow(c,p.x,p.y,p.s*(1-f*.5),f<.3?'#ffb060':'#e0182c',(1-f)*.6);}
fxGlow(c,cx,cy,Math.min(260,60+t*500),'#ff4050',.5*(1-_fSm(0,.9,t)));};};
FXS.void=(W,H,D)=>{const cx=W/2,cy=H*.46,R=Math.max(W,H)*.6,ps=Array.from({length:170},()=>({a:_fR()*6.283,ph:_fR(),sp:_fRn(.5,.9),s:_fRn(5,14)})),st=Array.from({length:46},()=>({x:_fR()*W,y:_fR()*H,ph:_fR()*9}));return(c,t,dt)=>{const a=_fSm(0,.4,t);c.globalCompositeOperation='lighter';for(const s of st)fxGlow(c,s.x,s.y,5,'#d8c0ff',a*(.3+.7*Math.abs(Math.sin(t*2+s.ph))));
for(const p of ps){const f=(p.ph+t*p.sp)%1,r=R*Math.pow(1-f,1.6)+50,ang=p.a+f*8;fxGlow(c,cx+Math.cos(ang)*r,cy+Math.sin(ang)*r*.55,p.s*(.6+f),f>.6?'#e8d8ff':'#9a50ff',Math.sin(f*3.14)*.9*a);}
c.globalCompositeOperation='source-over';const hr=70+10*Math.sin(t*5);const g=c.createRadialGradient(cx,cy,hr*.2,cx,cy,hr*2.2);g.addColorStop(0,`rgba(0,0,0,${.95*a})`);g.addColorStop(.45,`rgba(10,0,30,${.8*a})`);g.addColorStop(1,'rgba(10,0,30,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(cx-hr*3,cy-hr*3,hr*6,hr*6);
c.globalCompositeOperation='lighter';c.strokeStyle='#a060ff';c.shadowColor='#b070ff';c.shadowBlur=24;c.lineWidth=3;c.globalAlpha=.85*a;c.beginPath();c.ellipse(cx,cy,hr*1.35,hr*.78,t*.6,0,7);c.stroke();c.shadowBlur=0;const u=t-D*.5;if(u>0&&u<.8){c.strokeStyle='#e0c8ff';c.globalAlpha=1-u/.8;c.lineWidth=14*(1-u/.8)+1;c.beginPath();c.arc(cx,cy,u*R*1.3,0,7);c.stroke();}};};
FXS.gold=(W,H,D)=>{const k=H/700,cs=Array.from({length:70},()=>({x:W*_fRn(.1,.9),y:H+20,vx:_fRn(-120,120),vy:-_fRn(700,1250)*k,r:_fRn(11,19),f:_fR()*9,vf:_fRn(5,11),dl:_fRn(0,.6)}));return(c,t,dt)=>{if(t<.3){c.globalCompositeOperation='lighter';c.globalAlpha=1;c.fillStyle=`rgba(255,200,60,${.3*(1-t/.3)})`;c.fillRect(0,0,W,H);}
for(const p of cs){if(t<p.dl)continue;p.vy+=1300*k*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.f+=p.vf*dt;if(p.y>H+40)continue;const sx=Math.abs(Math.cos(p.f));c.save();c.translate(p.x,p.y);c.scale(Math.max(.12,sx),1);c.globalAlpha=1;const g=c.createLinearGradient(-p.r,-p.r,p.r,p.r);g.addColorStop(0,'#fff2a0');g.addColorStop(.5,'#f0b820');g.addColorStop(1,'#a8700a');c.fillStyle=g;c.strokeStyle='#8a5a06';c.lineWidth=2;c.beginPath();c.arc(0,0,p.r,0,7);c.fill();c.stroke();c.strokeStyle='rgba(255,244,190,.8)';c.lineWidth=1.5;c.beginPath();c.arc(0,0,p.r*.68,0,7);c.stroke();c.fillStyle='rgba(120,70,0,.55)';c.font=`bold ${p.r}px serif`;c.textAlign='center';c.textBaseline='middle';c.fillText('六',0,1);c.restore();if(sx>.93){c.globalCompositeOperation='lighter';fxFlare(c,p.x+p.r*.4,p.y-p.r*.4,12,'#fff4c0',1);c.globalCompositeOperation='source-over';}}};};
FXS.ocean=(W,H,D)=>{const dr=[],bu=[];return(c,t,dt)=>{const rise=_fSm(0,D*.45,t)*(1-_fSm(D*.68,D,t)),L=H*(1-.66*rise);const cols=['#0a3f94','#1668c8','#2f93e8','#7cc8ff'];
if(rise>.02&&rise<.98&&_fR()<dt*70)dr.push({x:_fR()*W,y:L,vx:_fRn(-60,60),vy:-_fRn(250,520),l:0});
if(_fR()<dt*30)bu.push({x:_fR()*W,y:H,vy:-_fRn(60,160),s:_fRn(2,6)});
for(let li=0;li<4;li++){const base=L+li*16;c.globalAlpha=.55+li*.1;c.fillStyle=cols[li];c.beginPath();c.moveTo(0,H+5);for(let x=0;x<=W+8;x+=8)c.lineTo(x,base+Math.sin(x*.011+t*3.2+li*1.3)*(16-li*2)+Math.sin(x*.027-t*2.4+li)*7);c.lineTo(W,H+5);c.fill();if(li===3){c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=3;c.globalAlpha=.8;c.stroke();}}
c.fillStyle='#eaf8ff';for(let i=dr.length-1;i>=0;i--){const p=dr[i];p.l+=dt;p.vy+=900*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y>H||p.l>1.4){dr.splice(i,1);continue;}c.globalAlpha=.85;c.beginPath();c.arc(p.x,p.y,2.4,0,7);c.fill();}
c.strokeStyle='rgba(220,245,255,.7)';c.lineWidth=1.3;for(let i=bu.length-1;i>=0;i--){const p=bu[i];p.y+=p.vy*dt;p.x+=Math.sin(p.y*.05)*20*dt;if(p.y<L+10){bu.splice(i,1);continue;}c.globalAlpha=.7;c.beginPath();c.arc(p.x,p.y,p.s,0,7);c.stroke();}};};
FXS.jade=(W,H,D)=>{const cx=W/2,cy=H*.46,sh=Array.from({length:42},()=>{const a=_fR()*6.283,v=_fRn(220,720)*Math.max(W,H)/900;return{x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:_fR()*6,vr:_fRn(-4,4),s:_fRn(12,34),dl:_fRn(0,.35)};});return(c,t,dt)=>{c.globalCompositeOperation='lighter';c.globalAlpha=1;for(let i=0;i<10;i++){const a=i*.628+t*.35;const g=c.createLinearGradient(cx,cy,cx+Math.cos(a)*W,cy+Math.sin(a)*W);g.addColorStop(0,fxHexA('#40ffd0',.22*_fSm(0,.4,t)));g.addColorStop(1,fxHexA('#40ffd0',0));c.fillStyle=g;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a-.07)*W,cy+Math.sin(a-.07)*W);c.lineTo(cx+Math.cos(a+.07)*W,cy+Math.sin(a+.07)*W);c.fill();}
c.globalCompositeOperation='source-over';for(const p of sh){if(t<p.dl)continue;const u=t-p.dl;p.vx*=1-1.1*dt;p.vy*=1-1.1*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;const a=Math.max(0,1-u/(D-.2));c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=a;const s=p.s;c.fillStyle='#0f8f78';c.beginPath();c.moveTo(0,-s);c.lineTo(-s*.45,0);c.lineTo(0,s*.9);c.fill();c.fillStyle='#3fe0b8';c.beginPath();c.moveTo(0,-s);c.lineTo(s*.45,0);c.lineTo(0,s*.9);c.fill();c.fillStyle='#d8fff4';c.beginPath();c.moveTo(0,-s);c.lineTo(s*.2,-s*.2);c.lineTo(-s*.2,-s*.2);c.fill();c.strokeStyle='rgba(220,255,245,.8)';c.lineWidth=1;c.beginPath();c.moveTo(0,-s);c.lineTo(-s*.45,0);c.lineTo(0,s*.9);c.lineTo(s*.45,0);c.closePath();c.stroke();c.restore();if(_fR()<.02)fxFlare(c,p.x,p.y,14,'#d8fff4',1);}
c.globalCompositeOperation='lighter';fxGlow(c,cx,cy,200,'#30e0b8',.35*(1-_fSm(0,.9,t)));};};
FXS.fireworks=(W,H,D)=>{const pal=['#ff5a9a','#ffd040','#5ac8ff','#a0ff70','#ff8a30','#c080ff'],xs=[.3,.7,.5,.2,.8,.4],rk=xs.map((x,i)=>({t:.05+i*.27,x:W*x,tx:W*(x+_fRn(-.08,.08)),ty:H*_fRn(.14,.4),col:pal[i%6],b:false})).filter(r=>r.t<D-.7),sp=[];return(c,t,dt)=>{c.globalCompositeOperation='lighter';c.lineCap='round';let fl=0;for(const r of rk){const u=(t-r.t)/.5;if(u<0)continue;if(u<1){const e=1-Math.pow(1-u,2),x=r.x+(r.tx-r.x)*e,y=H+(r.ty-H)*e;c.strokeStyle='#ffe8b0';c.globalAlpha=.9;c.lineWidth=2.5;c.beginPath();c.moveTo(r.x+(r.tx-r.x)*(e-.08),H+(r.ty-H)*(e-.08));c.lineTo(x,y);c.stroke();fxGlow(c,x,y,10,'#ffd890',1);}else if(!r.b){r.b=true;const n=_fRn(80,120)|0,v0=_fRn(200,330)*Math.min(W,H)/600;for(let i=0;i<n;i++){const a=_fR()*6.283,v=v0*(.82+.18*_fR());sp.push({x:r.tx,y:r.ty,px:r.tx,py:r.ty,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:0,m:_fRn(1,1.5),col:i%7===0?'#ffffff':r.col});}r.fl=t;}if(r.fl!==undefined)fl=Math.max(fl,1-(t-r.fl)/.25);}
if(fl>0){c.globalAlpha=1;c.fillStyle=`rgba(255,230,220,${.12*fl})`;c.fillRect(0,0,W,H);}
for(let i=sp.length-1;i>=0;i--){const p=sp[i];p.l+=dt;if(p.l>p.m){sp.splice(i,1);continue;}p.px=p.x;p.py=p.y;p.vx*=1-1.9*dt;p.vy=p.vy*(1-1.9*dt)+140*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;const f=p.l/p.m,fl2=(.55+.45*Math.sin(p.l*40+i));c.strokeStyle=p.col;c.globalAlpha=(1-f)*fl2;c.lineWidth=2.2*(1-f*.6);c.beginPath();c.moveTo(p.px-p.vx*.02,p.py-p.vy*.02);c.lineTo(p.x,p.y);c.stroke();fxGlow(c,p.x,p.y,7,p.col,(1-f)*fl2);}};};
FXS.confetti=(W,H,D)=>{const cl=['#ff4d6d','#ffd93d','#4dd8ff','#6dff9a','#ff9a30','#b07aff','#ffffff'],k=Math.max(W,H)/900,ps=[];for(let i=0;i<150;i++){const left=i%2===0,a=(_fRn(52,82))*Math.PI/180,v=_fRn(700,1400)*k;ps.push({x:left?0:W,y:H,vx:(left?1:-1)*Math.cos(a)*v,vy:-Math.sin(a)*v,w:_fRn(8,15),h:_fRn(5,9),r:_fR()*6,vr:_fRn(-9,9),f:_fR()*9,vf:_fRn(6,16),c:cl[i%7],dl:_fRn(0,.25)});}
for(let i=0;i<70;i++)ps.push({x:_fR()*W,y:-20,vx:_fRn(-30,30),vy:_fRn(60,160),w:_fRn(8,14),h:_fRn(5,8),r:_fR()*6,vr:_fRn(-5,5),f:_fR()*9,vf:_fRn(4,9),c:cl[i%7],dl:_fRn(.3,1.2),fall:1});
return(c,t,dt)=>{for(const p of ps){if(t<p.dl)continue;if(!p.fall){p.vx*=1-1.5*dt;p.vy=p.vy*(1-.9*dt)+650*dt;}else p.vx+=Math.sin(t*3+p.f)*30*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;p.f+=p.vf*dt;if(p.y>H+30)continue;c.save();c.translate(p.x,p.y);c.rotate(p.r);c.scale(1,Math.cos(p.f));c.fillStyle=p.c;c.globalAlpha=.95;c.fillRect(-p.w/2,-p.h/2,p.w,p.h);c.restore();}};};
FXS.star=(W,H,D)=>{const ms=Array.from({length:12},(_,i)=>({x:W*_fRn(.3,1.25),y:_fRn(-80,H*.3),sp:_fRn(1000,1700),len:_fRn(220,420),dl:i*.14+_fRn(0,.08)})).filter(m=>m.dl<D-.6),st=Array.from({length:60},()=>({x:_fR()*W,y:_fR()*H,ph:_fR()*9,s:_fRn(4,12)})),ca=Math.PI*.8,dx=Math.cos(ca),dy=Math.sin(ca);return(c,t,dt)=>{c.globalCompositeOperation='lighter';c.lineCap='round';const a=_fSm(0,.4,t);for(const s of st){const b=Math.sin(t*3+s.ph);if(b>0)fxFlare(c,s.x,s.y,s.s*b,'#fff0b0',a*b*.9);}
for(const m of ms){const u=t-m.dl;if(u<0)continue;const hx=m.x+dx*m.sp*u,hy=m.y+dy*m.sp*u;if(hx<-m.len||hy>H+m.len)continue;const g=c.createLinearGradient(hx,hy,hx-dx*m.len,hy-dy*m.len);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,fxHexA('#ffd860',.7));g.addColorStop(1,fxHexA('#ffd860',0));c.strokeStyle=g;c.globalAlpha=1;c.lineWidth=4;c.beginPath();c.moveTo(hx,hy);c.lineTo(hx-dx*m.len,hy-dy*m.len);c.stroke();fxGlow(c,hx,hy,18,'#fff0a0',1);if(_fR()<.5)fxGlow(c,hx-dx*_fRn(0,m.len*.8),hy-dy*_fRn(0,m.len*.8)+_fRn(-6,6),4,'#ffe080',.8);}};};
FXS.royal=(W,H,D)=>{const cx=W/2,cy=H*.2,sz=Math.min(W*.3,190)/100,ps=Array.from({length:70},()=>({x:_fR()*W,y:H+10,vy:-_fRn(60,200),ph:_fR()*9,s:_fRn(3,9),c:_fR()<.5?'#ffd860':'#c890ff'}));return(c,t,dt)=>{c.globalCompositeOperation='lighter';c.globalAlpha=1;for(let i=0;i<18;i++){const a=i*.349+t*.4;const g=c.createLinearGradient(cx,cy,cx+Math.cos(a)*W,cy+Math.sin(a)*W);g.addColorStop(0,fxHexA('#ffd860',.26*_fSm(0,.4,t)));g.addColorStop(1,fxHexA('#ffd860',0));c.fillStyle=g;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a-.045)*W,cy+Math.sin(a-.045)*W);c.lineTo(cx+Math.cos(a+.045)*W,cy+Math.sin(a+.045)*W);c.fill();}
for(const p of ps){p.y+=p.vy*dt;p.x+=Math.sin(t*2+p.ph)*20*dt;if(p.y<-10)p.y=H;fxGlow(c,p.x,p.y,p.s,p.c,.5+.5*Math.sin(t*5+p.ph));}
const e=_fSm(.05,.5,t),bn=1+.12*Math.sin(Math.min(1,Math.max(0,(t-.05)/.5))*3.14);c.globalCompositeOperation='source-over';c.save();c.translate(cx,cy);c.scale(sz*e*bn,sz*e*bn);c.globalAlpha=e;fxCrown(c);const g=c.createLinearGradient(0,-66,0,50);g.addColorStop(0,'#fff3a8');g.addColorStop(.5,'#f2b822');g.addColorStop(1,'#a8680a');c.fillStyle=g;c.fill();c.strokeStyle='#fff4c0';c.lineWidth=3;c.stroke();c.fillStyle='#7a2a9a';c.fillRect(-100,28,200,22);for(const[x,y,col]of[[-104,-34,'#ff4d6d'],[0,-66,'#ff4d6d'],[104,-34,'#ff4d6d']]){c.fillStyle=col;c.beginPath();c.arc(x,y,9,0,7);c.fill();c.strokeStyle='#fff';c.lineWidth=2;c.stroke();}for(const x of[-60,-20,20,60]){c.fillStyle='#8ad8ff';c.beginPath();c.moveTo(x,31);c.lineTo(x+8,39);c.lineTo(x,47);c.lineTo(x-8,39);c.fill();}
c.save();fxCrown(c);c.clip();const sx=-160+((t*220)%420);c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.moveTo(sx,-80);c.lineTo(sx+30,-80);c.lineTo(sx-20,60);c.lineTo(sx-50,60);c.fill();c.restore();c.restore();c.globalCompositeOperation='lighter';if(Math.sin(t*6)>.7)fxFlare(c,cx,cy-66*sz*e,26,'#fff8d0',1);};};
// ===== スタンド風の演出（オリジナルの守護霊イメージ：威圧・ラッシュ・時間停止） =====
FXS.aura=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,ps=[],gs=[];const rows=[[.08,.2],[.06,.5],[.1,.8],[.9,.25],[.94,.55],[.88,.85],[.3,.1],[.7,.92],[.5,.97]];
  rows.forEach(([x,y],i)=>gs.push({x:x*W,y:y*H,s:(46+(i%3)*22)*k,rot:_fRn(-.35,.35),ph:_fR()*9,dl:i*.07}));
  return(c,t,dt)=>{const rise=_fSm(0,.35,t),fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='lighter';
  const v=c.createRadialGradient(cx,cy,Math.min(W,H)*.2,cx,cy,Math.max(W,H)*.75);v.addColorStop(0,'rgba(80,0,160,0)');v.addColorStop(1,`rgba(120,20,200,${.5*rise*fade})`);c.globalAlpha=1;c.fillStyle=v;c.fillRect(0,0,W,H);
  if(t<D-.5){const n=Math.ceil(dt*70);for(let i=0;i<n;i++){const a=_fR()<.5;ps.push({x:cx+_fRn(-W*.5,W*.5),y:H+20,vx:_fRn(-25,25),vy:-_fRn(240,620)*k,l:0,m:_fRn(.8,1.5),s:_fRn(40,95)*k,ph:_fR()*9,c:a?'#a040ff':'#ff3cc0'});}}
  for(let i=ps.length-1;i>=0;i--){const p=ps[i];p.l+=dt;if(p.l>p.m){ps.splice(i,1);continue;}p.x+=(p.vx+Math.sin(p.y*.015+p.ph)*45)*dt;p.y+=p.vy*dt;const f=p.l/p.m;fxGlow(c,p.x,p.y,p.s*(1-f*.5),f<.3?'#f0d0ff':p.c,(1-f)*.42*fade);}
  for(let j=0;j<3;j++){const f=((t*.9+j/3)%1);c.globalAlpha=(1-f)*.7*rise*fade;c.strokeStyle='#d8a8ff';c.lineWidth=4*(1-f)+1;c.beginPath();c.ellipse(cx,cy,60+f*Math.max(W,H)*.5,(60+f*Math.max(W,H)*.5)*.55,0,0,6.3);c.stroke();}
  c.globalAlpha=1;c.globalCompositeOperation='source-over';c.textAlign='center';c.textBaseline='middle';
  for(const g of gs){const a=_fSm(g.dl,g.dl+.25,t)*fade;if(a<=0)continue;const jx=Math.sin(t*70+g.ph)*3*k,jy=Math.cos(t*63+g.ph)*3*k;c.save();c.translate(g.x+jx,g.y+jy);c.rotate(g.rot);c.globalAlpha=a*.9;c.font=`900 ${g.s}px "Noto Serif JP","Hiragino Mincho ProN",serif`;c.lineWidth=g.s*.12;c.strokeStyle='rgba(30,0,60,.9)';c.fillStyle='#d8a8ff';c.shadowColor='#b060ff';c.shadowBlur=18;c.strokeText('ゴ',0,0);c.fillText('ゴ',0,0);c.restore();}
  c.shadowBlur=0;c.globalAlpha=1;};};
const _rushSpr={};
FXS.rush=(W,H,D)=>{
  // オラオラ・ラッシュ：腕ごと殴り込む無数の拳（紫と黄色）＋「オラ」の文字の嵐 → 最後に中央で激突
  const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,tC=Math.max(.95,D-1.0),sm=_fSm,S=k*230;
  const F=[],I=[],Sp=[],Tx=[];let tacc=0;let acc=0,shk=0,hit=-9,T=0,clash=0;
  const PAL=[{a:'#f4e4ff',b:'#a458ff',c:'#4a1a9a',g:'#b070ff',l:'#dcb0ff'},{a:'#fffbd0',b:'#ffd21e',c:'#b87400',g:'#ffd840',l:'#ffe870'}];
  const WORDS=['オラッ','オラァ','ドガッ','ボゴッ'],SPAM=['オラ','オラ','オラ','オラオラ','オラァ','オラッ'];
  // 進行方向へ向けて置く（左向きは鏡像にして、上下が逆さにならないようにする）
  const place=(c,x,y,ang)=>{c.translate(x,y);if(Math.cos(ang)<0){c.rotate(ang-Math.PI);c.scale(-1,1);}else c.rotate(ang);};
  // 拳（+x方向に殴る向きで描く）
  const fist=(c,s,p,arm)=>{c.lineJoin='round';c.lineWidth=Math.max(2,s*.05);c.strokeStyle='#1a0830';
    if(arm){const ag=c.createLinearGradient(0,-s*.34,0,s*.34);ag.addColorStop(0,p.b);ag.addColorStop(1,p.c);c.fillStyle=ag;c.beginPath();c.roundRect(-s*6,-s*.3,s*5.0,s*.6,s*.12);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.3)';c.fillRect(-s*6,-s*.24,s*5.0,s*.07);}
    const cu=c.createLinearGradient(0,-s*.36,0,s*.36);cu.addColorStop(0,'#ffffff');cu.addColorStop(1,'#bdb4d4');
    c.fillStyle=cu;c.beginPath();c.roundRect(-s*1.1,-s*.36,s*.5,s*.72,s*.1);c.fill();c.stroke();          // 袖口
    c.fillStyle=p.c;c.beginPath();c.rect(-s*.7,-s*.36,s*.1,s*.72);c.fill();c.stroke();                      // 色の帯
    const g=c.createLinearGradient(0,-s*.4,0,s*.4);g.addColorStop(0,p.a);g.addColorStop(.45,p.b);g.addColorStop(1,p.c);
    c.fillStyle=g;c.beginPath();c.roundRect(-s*.6,-s*.4,s*.8,s*.8,s*.17);c.fill();c.stroke();               // 手の甲
    c.fillStyle=p.b;for(let j=0;j<4;j++){const y=-s*.4+j*s*.2;c.beginPath();c.roundRect(-s*.02,y,s*.52,s*.2,s*.1);c.fill();c.stroke();}   // 握った指
    c.fillStyle='rgba(255,255,255,.4)';for(let j=0;j<4;j++){c.beginPath();c.roundRect(s*.06,-s*.4+j*s*.2+s*.025,s*.34,s*.04,s*.02);c.fill();}
    c.fillStyle=p.a;c.beginPath();c.roundRect(-s*.18,s*.16,s*.64,s*.2,s*.1);c.fill();c.stroke();             // 親指
    c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.roundRect(-s*.5,-s*.34,s*.4,s*.07,s*.035);c.fill();};
  // 拳は最初に1回だけ絵にしておき、毎フレームは貼るだけにする（軽量化）
  const BS=96,spr=(pi,arm)=>{const key=pi+'_'+arm;if(_rushSpr[key])return _rushSpr[key];const ox=(arm?6.05:1.15)*BS+4,w=Math.ceil(ox+.6*BS+4),h=Math.ceil(BS*.9)+4,cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');g.translate(ox,h/2);fist(g,BS,PAL[pi],arm);return _rushSpr[key]={cv,ox,oy:h/2};};
  const putFist=(c,s,pi,arm)=>{const o=spr(pi,arm),sc=s/BS;c.drawImage(o.cv,-o.ox*sc,-o.oy*sc,o.cv.width*sc,o.cv.height*sc);};
  const star=(c,x,y,r,rot,n)=>{c.beginPath();for(let j=0;j<n*2;j++){const a=rot+j*Math.PI/n,rr=j%2?r*.45:r;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();};
  const burst=(x,y,r,pi,word,txt,ws)=>{I.push({x,y,r,pi,t0:T,rot:_fR()*6,w:word?(txt||WORDS[Math.floor(_fR()*WORDS.length)]):null,ws:ws||_fRn(34,56)*k,wr:_fRn(-.35,.35)});shk=Math.min(11*k,shk+2.4*k);hit=T;
    for(let j=0;j<3;j++){const a=_fR()*6.283,v=_fRn(250,650)*k;Sp.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:0,m:_fRn(.3,.6),s:_fRn(5,11)*k,pi,r:_fR()*6});}};
  return(c,t,dt)=>{T=t;const fade=1-sm(D-.4,D,t),ramp=sm(.1,.35,t);
  shk=Math.max(0,shk-dt*34*k);if(t>.2&&t<tC)shk=Math.max(shk,3*k);c.save();c.translate((_fR()-.5)*2*shk,(_fR()-.5)*2*shk);
  // --- 拳の発生：だんだん速くなる
  if(t>.15&&t<tC-.05&&F.length<45){acc+=dt*(40+50*sm(.15,tC,t));while(acc>=1){acc--;const depth=_fR()<.22,L=_fR()<.5,pi=depth?(_fR()<.5?0:1):(L?(_fR()<.85?0:1):(_fR()<.85?1:0)),tx=cx+_fRn(-W*.2,W*.2),ty=cy+_fRn(-H*.18,H*.18);
    if(depth)F.push({d:1,tx,ty,t0:t,s:_fRn(70,110)*k,fl:_fRn(.16,.24),pi,ang:(pi?Math.PI:0)+_fRn(-.6,.6),h:0});
    else{const sx=L?-120:W+120,sy=cy+_fRn(-H*.38,H*.38);F.push({sx,sy,tx,ty,t0:t,s:_fRn(44,84)*k,fl:_fRn(.09,.14),pi,ang:Math.atan2(ty-sy,tx-sx),h:0,arm:1});}}}
  // --- 背景：左は紫、右は黄色の光。殴るたびに強く脈打つ
  c.globalCompositeOperation='lighter';const hp=Math.max(0,1-(t-hit)*7);
  fxGlow(c,W*.18,cy,Math.max(W,H)*.5,'#a050ff',(.22+.18*hp)*ramp*fade);
  fxGlow(c,W*.82,cy,Math.max(W,H)*.5,'#ffd020',(.22+.18*hp)*ramp*fade);
  if(hp>.05)fxGlow(c,cx,cy,Math.min(W,H)*.45,'#ffffff',.12*hp*fade);
  c.globalAlpha=.5*fade*ramp;c.lineCap='round';c.lineWidth=2;
  for(let h=0;h<2;h++){c.strokeStyle=h?'#d8a8ff':'#ffe870';c.beginPath();for(let i=0;i<14;i++){const a=_fR()*6.283,r0=Math.min(W,H)*_fRn(.26,.5),r1=r0+_fRn(60,280);c.moveTo(cx+Math.cos(a)*r0,cy+Math.sin(a)*r0);c.lineTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);}c.stroke();}
  // --- 拳
  for(let i=F.length-1;i>=0;i--){const f=F[i],u=(t-f.t0)/f.fl;if(u>1.8){F.splice(i,1);continue;}const p=PAL[f.pi],land=u>=1;
    const al=(land?Math.max(0,1-(u-1)/(f.d?.5:.8)):1)*fade;
    const pos=(uu)=>{const e=Math.pow(Math.min(1,uu),2.2);return f.d?{x:f.tx,y:f.ty,m:.25+1.25*Math.pow(Math.min(1,uu),1.8)}:{x:f.sx+(f.tx-f.sx)*e,y:f.sy+(f.ty-f.sy)*e,m:1};};
    const q=pos(u);
    if(!land&&!f.d){c.globalCompositeOperation='lighter';c.globalAlpha=.4*fade;c.strokeStyle=p.l;c.lineWidth=f.s*.5;c.beginPath();c.moveTo(f.sx+(q.x-f.sx)*.35,f.sy+(q.y-f.sy)*.35);c.lineTo(q.x,q.y);c.stroke();}
    if(!land){c.globalCompositeOperation='lighter';fxGlow(c,q.x,q.y,f.s*q.m*1.7,p.g,.55*al);}
    c.globalCompositeOperation='source-over';
    if(!land)for(let g=2;g>=1;g--){const uu=u-g*.07;if(uu<=0)continue;const r=pos(uu);c.save();place(c,r.x,r.y,f.ang);c.globalAlpha=al*.45/g;putFist(c,f.s*r.m,f.pi,f.arm);c.restore();}  // 残像
    c.save();place(c,q.x+(land?(_fR()-.5)*4*k:0),q.y+(land?(_fR()-.5)*4*k:0),f.ang);c.globalAlpha=al;putFist(c,f.s*q.m,f.pi,f.arm);c.restore();
    if(land&&!f.h){f.h=1;burst(f.tx,f.ty,f.s*(f.d?1.6:1.1),f.pi,_fR()<.12);}}
  // --- 最後：紫と黄色の巨大な拳が中央で激突
  const u2=(t-tC)/.3;
  if(u2>0){const e2=Math.pow(Math.min(1,u2),2),gap=(1-e2)*W*.65,vib=u2>=1?(_fR()-.5)*6*k:0,al=fade;
    if(u2>=1&&!clash){clash=1;shk=16*k;hit=t;burst(cx-S*.1,cy,S*1.5,0,false);burst(cx+S*.1,cy,S*1.5,1,true,'オラァーッ！！',88*k);for(let j=0;j<24;j++){const a=_fR()*6.283,v=_fRn(300,1100)*k;Sp.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:0,m:_fRn(.5,1),s:_fRn(7,16)*k,pi:j%2,r:_fR()*6});}}
    c.globalCompositeOperation='lighter';fxGlow(c,cx-S*.9-gap,cy,S*1.6,'#a050ff',.5*al);fxGlow(c,cx+S*.9+gap,cy,S*1.6,'#ffd020',.5*al);
    c.globalCompositeOperation='source-over';
    c.save();place(c,cx-S*.55-gap+vib,cy,0);c.globalAlpha=al;fist(c,S,PAL[0]);c.restore();
    c.save();place(c,cx+S*.55+gap-vib,cy,Math.PI);c.globalAlpha=al;fist(c,S,PAL[1]);c.restore();
    if(u2>=1){const f2=t-tC-.3;c.globalCompositeOperation='lighter';
      fxGlow(c,cx,cy,S*(1.1+.1*Math.sin(t*40)),'#ffffff',.75*al);fxGlow(c,cx-S*.3,cy,S*.9,'#c080ff',.5*al);fxGlow(c,cx+S*.3,cy,S*.9,'#ffe040',.5*al);
      c.lineCap='round';for(let j=0;j<3;j++){const a=_fR()*6.283,o=[];fxBolt(cx+Math.cos(a)*S*.15,cy+Math.sin(a)*S*.15,cx+Math.cos(a)*S*_fRn(1.1,1.6),cy+Math.sin(a)*S*_fRn(1.1,1.6),S*.22,o,3);c.strokeStyle=j%2?'#f4e4ff':'#fff2a0';c.lineWidth=2.4*k;c.globalAlpha=.9*al;c.beginPath();for(const s of o){c.moveTo(s[0],s[1]);c.lineTo(s[2],s[3]);}c.stroke();}
      for(let j=0;j<2;j++){const ff=(f2-j*.12)/.6;if(ff<=0||ff>=1)continue;c.globalAlpha=(1-ff)*al;c.strokeStyle=j?'#ffe870':'#c890ff';c.lineWidth=(14*(1-ff)+1)*k;c.beginPath();c.arc(cx,cy,S*(.7+ff*3),0,6.3);c.stroke();}
      if(f2>0&&f2<.25){c.globalAlpha=(1-f2/.25)*.8*al;c.fillStyle='#fff';c.fillRect(-60,-60,W+120,H+120);}}}
  // --- 「オラ」の文字の嵐：画面中に次々と飛び出す
  if(t>.2&&t<tC+.35&&Tx.length<26){tacc+=dt*(16+20*sm(.2,tC,t));while(tacc>=1){tacc--;const a=_fR()*6.283,rr=Math.sqrt(_fR())*Math.max(W,H)*.5;Tx.push({x:cx+Math.cos(a)*rr*1.1,y:cy+Math.sin(a)*rr*.8,t0:t,m:_fRn(.3,.5),s:_fRn(30,84)*k,rot:_fRn(-.45,.45),pi:_fR()<.5?0:1,w:SPAM[Math.floor(_fR()*SPAM.length)]});}}
  c.globalCompositeOperation='source-over';c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';
  for(let i=Tx.length-1;i>=0;i--){const m=Tx[i],u=(t-m.t0)/m.m;if(u>1){Tx.splice(i,1);continue;}const p=PAL[m.pi],sc=1+.9*Math.pow(1-Math.min(1,u*5),2);
    c.save();c.translate(m.x+(_fR()-.5)*5*k,m.y+(_fR()-.5)*5*k);c.rotate(m.rot);c.scale(sc,sc);c.globalAlpha=(u<.6?1:1-(u-.6)/.4)*fade*.95;
    c.font=`900 ${m.s}px "Noto Serif JP","Hiragino Mincho ProN",serif`;c.lineWidth=m.s*.16;c.strokeStyle='#1a0830';c.fillStyle=p.l;c.strokeText(m.w,0,0);c.fillText(m.w,0,0);c.restore();}
  // --- 衝撃：星・輪・擬音
  for(let i=I.length-1;i>=0;i--){const m=I[i],u=(t-m.t0)/.5;if(u>1){I.splice(i,1);continue;}const p=PAL[m.pi],r=m.r*(.5+u*.9);
    c.globalCompositeOperation='lighter';c.globalAlpha=(1-u)*fade;c.fillStyle=p.l;star(c,m.x,m.y,r,m.rot,6);c.fill();c.fillStyle='#fff';star(c,m.x,m.y,r*.55,m.rot+.26,6);c.fill();
    c.strokeStyle=p.g;c.lineWidth=(6*(1-u)+1)*k;c.beginPath();c.arc(m.x,m.y,m.r*(.5+u*1.6),0,6.3);c.stroke();fxGlow(c,m.x,m.y,r*2.2,p.g,.8*(1-u)*fade);
    if(m.w){c.globalCompositeOperation='source-over';c.save();c.translate(m.x,m.y-m.r*.9-u*22*k);c.rotate(m.wr);const sc=1+.7*Math.pow(1-Math.min(1,u*4),2);c.scale(sc,sc);c.globalAlpha=(1-Math.max(0,u-.5)*2)*fade;c.font=`900 ${m.ws}px "Noto Serif JP","Hiragino Mincho ProN",serif`;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=m.ws*.16;c.strokeStyle='#1a0830';c.fillStyle=p.l;c.strokeText(m.w,0,0);c.fillText(m.w,0,0);c.restore();}}
  // --- 火花（かけら）
  c.globalCompositeOperation='lighter';
  for(let i=Sp.length-1;i>=0;i--){const q=Sp[i];q.l+=dt;if(q.l>q.m){Sp.splice(i,1);continue;}q.vx*=1-1.5*dt;q.vy*=1-1.5*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.r+=dt*8;const u=q.l/q.m;
    c.save();c.translate(q.x,q.y);c.rotate(q.r);c.globalAlpha=(1-u)*fade;c.fillStyle=PAL[q.pi].l;c.beginPath();c.moveTo(0,-q.s*1.6);c.lineTo(q.s*.6,q.s*.6);c.lineTo(-q.s*.6,q.s*.6);c.fill();c.restore();}
  c.restore();c.globalCompositeOperation='source-over';c.globalAlpha=1;};};
FXS.timestop=(W,H,D)=>{const cx=W/2,cy=H*.46,R=Math.min(W,H)*.34,Ts=1.0,ps=Array.from({length:70},()=>{const a=_fR()*6.283,v=_fRn(120,520);return{x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,s:_fRn(3,10),r:_fR()*6,vr:_fRn(-6,6),sh:_fR()<.5};});
  return(c,t,dt)=>{const fade=1-_fSm(D-.5,D,t),fr=t>=Ts;c.globalCompositeOperation='source-over';
  const w=_fSm(.05,.85,t);if(w>0){const g=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*w);g.addColorStop(0,'rgba(210,214,226,.28)');g.addColorStop(.85,'rgba(150,156,176,.34)');g.addColorStop(1,'rgba(200,210,255,0)');c.globalAlpha=fade;c.fillStyle=g;c.fillRect(0,0,W,H);}
  c.globalCompositeOperation='lighter';for(let j=0;j<3;j++){const f=_fSm(.05+j*.1,.9+j*.1,t);if(f<=0||f>=1)continue;c.globalAlpha=(1-f)*.9*fade;c.strokeStyle=['#ffffff','#7affd0','#ff7ad0'][j];c.lineWidth=7*(1-f)+1;c.beginPath();c.arc(cx,cy,Math.max(W,H)*.9*f,0,6.3);c.stroke();}
  if(t<.2){c.globalAlpha=(1-t/.2)*.6;c.fillStyle='#fff';c.fillRect(0,0,W,H);}
  c.globalCompositeOperation='source-over';c.save();c.translate(cx,cy);const ca=_fSm(.05,.35,t)*fade;c.globalAlpha=ca*.8;
  c.strokeStyle='#efe2b0';c.lineWidth=5;c.beginPath();c.arc(0,0,R,0,6.3);c.stroke();c.lineWidth=1.5;c.beginPath();c.arc(0,0,R*.93,0,6.3);c.stroke();
  for(let i=0;i<60;i++){const a=i*Math.PI/30,big=i%5===0;c.lineWidth=big?4:1.5;c.beginPath();c.moveTo(Math.sin(a)*R*(big?.8:.86),-Math.cos(a)*R*(big?.8:.86));c.lineTo(Math.sin(a)*R*.92,-Math.cos(a)*R*.92);c.stroke();}
  const prog=Math.min(1,Math.max(0,(t-.1)/(Ts-.1))),ease=1-Math.pow(1-prog,3),mAng=ease*Math.PI*2*5,shud=fr?Math.sin((t-Ts)*60)*Math.max(0,1-(t-Ts)*6)*.05:0,hAng=ease*Math.PI*2*.42;
  const hand=(a,l,w)=>{c.save();c.rotate(a);c.lineWidth=w;c.lineCap='round';c.beginPath();c.moveTo(0,R*.08);c.lineTo(0,-R*l);c.stroke();c.restore();};
  c.strokeStyle='#fff4c8';hand(mAng+shud,.82,5);hand(hAng,.55,8);c.fillStyle='#fff4c8';c.beginPath();c.arc(0,0,9,0,6.3);c.fill();c.restore();
  c.globalCompositeOperation='lighter';const tt=Math.min(t,Ts);
  for(const p of ps){const sp=Math.pow(.12,tt);const x=p.x+p.vx*(1-sp)/1.6*Math.min(1,tt+.05),y=p.y+p.vy*(1-sp)/1.6*Math.min(1,tt+.05);c.globalAlpha=.9*fade*_fSm(.1,.3,t);
   c.save();c.translate(x,y);c.rotate(p.r+(fr?0:p.vr*t));c.fillStyle=p.sh?'#cfeaff':'#ffe9a8';c.beginPath();c.moveTo(0,-p.s*1.6);c.lineTo(p.s*.7,0);c.lineTo(0,p.s*1.6);c.lineTo(-p.s*.7,0);c.closePath();c.fill();c.restore();}
  if(fr){const q=t-Ts;if(q<.5){c.globalAlpha=(1-q/.5)*.45*fade;c.fillStyle='#fff';c.fillRect(0,0,W,H);}for(let i=0;i<3;i++){const p=ps[Math.floor(_fR()*ps.length)];fxFlare(c,cx+(p.x-cx)*.0+p.vx*.5,cy+p.vy*.5,_fRn(10,24),'#ffffff',.9*fade);}}
  c.globalAlpha=1;};};
// ===== 能力モチーフの演出（オリジナル）：糸・シャボン玉・重い雨・爪弾・修復・芽吹き =====
function fxIco(c,kind,s){c.lineCap='round';c.lineJoin='round';
  if(kind==='sound'){[.3,.7,1,.6,.35].forEach((h,i)=>{c.beginPath();c.roundRect((i-2)*s*.38-s*.1,-h*s/2,s*.2,h*s,s*.1);c.fill();});}
  else if(kind==='water'){c.beginPath();c.moveTo(0,-s);c.bezierCurveTo(s*.2,-s*.4,s*.7,0,s*.7,s*.35);c.bezierCurveTo(s*.7,s*.8,s*.3,s,0,s);c.bezierCurveTo(-s*.3,s,-s*.7,s*.8,-s*.7,s*.35);c.bezierCurveTo(-s*.7,0,-s*.2,-s*.4,0,-s);c.fill();}
  else{c.lineWidth=s*.16;for(let j=-1;j<=1;j+=2){c.beginPath();for(let i=0;i<=8;i++){const x=-s+i*s/4,y=j*s*.32+(i%2?s*.18:-s*.18);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}}}
FXS.thread=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,T=Array.from({length:18},(_,i)=>({a:i/18*6.283+_fRn(-.15,.15),L:_fRn(.35,.75)*Math.max(W,H)*.6,curl:_fRn(-1.6,1.6),ph:_fR()*9,dl:_fRn(0,.35),col:['#ffd6f4','#a8e4ff','#ffffff','#d6c0ff'][i%4],rope:_fR()<.5})),R=[];
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='lighter';fxGlow(c,cx,cy,Math.min(W,H)*.5,'#c8a8ff',.22*_fSm(0,.4,t)*fade);
  for(const th of T){const u=_fSm(th.dl,th.dl+.7,t);if(u<=0)continue;const N=46,pts=[];for(let i=0;i<=N;i++){const s=i/N*u,r=s*th.L,ang=th.a+s*th.curl+Math.sin(t*3+s*7+th.ph)*.22*s;pts.push([cx+Math.cos(ang)*r,cy+Math.sin(ang)*r*.82]);}
   const paint=(off,w,al)=>{c.beginPath();for(let i=0;i<=N;i++){const p=pts[i],q=pts[Math.min(N,i+1)],pr=pts[Math.max(0,i-1)],dx=q[0]-pr[0],dy=q[1]-pr[1],l=Math.hypot(dx,dy)||1,o=off*Math.sin(i*.9+t*9+th.ph)*(i/N);const x=p[0]-dy/l*o,y=p[1]+dx/l*o;i?c.lineTo(x,y):c.moveTo(x,y);}c.globalAlpha=al*fade;c.lineWidth=w;c.strokeStyle=th.col;c.stroke();};
   c.lineCap='round';paint(0,9*k,.12);if(th.rope){paint(5*k,2.2*k,.85);paint(-5*k,2.2*k,.85);}else paint(0,2.6*k,.9);
   const tip=pts[N];fxGlow(c,tip[0],tip[1],16*k,th.col,.8*fade);if(u>.95&&_fR()<dt*3)R.push({x:tip[0],y:tip[1],t0:t,col:th.col});}
  for(let i=R.length-1;i>=0;i--){const r=R[i],f=(t-r.t0)/.6;if(f>1){R.splice(i,1);continue;}c.globalAlpha=(1-f)*.7*fade;c.strokeStyle=r.col;c.lineWidth=2;for(let j=0;j<2;j++){c.beginPath();c.arc(r.x,r.y,(14+f*70+j*18)*k,0,6.3);c.stroke();}}
  c.globalAlpha=1;};};
FXS.bubble=(W,H,D)=>{const B=[],P=[],k=Math.min(W,H)/600,kinds=['sound','water','fric'];let acc=0;
  return(c,t,dt)=>{const fade=1-_fSm(D-.4,D,t);c.globalCompositeOperation='lighter';fxGlow(c,W/2,H*.5,Math.max(W,H)*.45,'#8ad8ff',.12*fade);
  if(t<D-.7){acc+=dt*(t<.3?55:20);while(acc>=1){acc--;const r=_fRn(18,62)*k;B.push({x:_fR()*W,y:H+r,r,vy:-_fRn(70,170)*k,ph:_fR()*9,age:0,life:_fRn(1.0,1.9),kind:_fR()<.6?kinds[Math.floor(_fR()*3)]:null,pop:0});}}
  c.globalCompositeOperation='source-over';
  for(const b of B){b.age+=dt;if(!b.pop&&b.age>b.life){b.pop=1;P.push({x:b.x,y:b.y,r:b.r,t0:t,kind:b.kind});}if(b.pop)continue;b.y+=b.vy*dt;b.x+=Math.sin(b.age*2+b.ph)*22*k*dt;const r=b.r*(1+.03*Math.sin(b.age*9+b.ph));
   const g=c.createRadialGradient(b.x,b.y,r*.1,b.x,b.y,r);g.addColorStop(0,'rgba(255,255,255,.03)');g.addColorStop(.72,'rgba(170,220,255,.14)');g.addColorStop(1,'rgba(255,255,255,.55)');c.globalAlpha=fade;c.fillStyle=g;c.beginPath();c.arc(b.x,b.y,r,0,6.3);c.fill();
   const rg=c.createLinearGradient(b.x-r,b.y-r,b.x+r,b.y+r);rg.addColorStop(0,'rgba(255,120,200,.85)');rg.addColorStop(.35,'rgba(255,240,140,.7)');rg.addColorStop(.65,'rgba(120,255,220,.8)');rg.addColorStop(1,'rgba(130,160,255,.85)');c.strokeStyle=rg;c.lineWidth=Math.max(1.5,r*.07);c.stroke();
   c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.ellipse(b.x-r*.38,b.y-r*.42,r*.2,r*.1,-.7,0,6.3);c.fill();
   if(b.kind){c.save();c.translate(b.x,b.y);c.fillStyle=c.strokeStyle='rgba(255,255,255,.9)';c.globalAlpha=.8*fade;fxIco(c,b.kind,r*.42);c.restore();}}
  for(let i=P.length-1;i>=0;i--){const p=P[i],f=(t-p.t0)/.6;if(f>1){P.splice(i,1);continue;}c.globalAlpha=(1-f)*fade;c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,p.r*(1+f*.9),0,6.3);c.stroke();
   c.fillStyle='rgba(220,245,255,.9)';for(let j=0;j<8;j++){const a=j*.785+p.r,d=p.r*(1+f*1.2);c.beginPath();c.arc(p.x+Math.cos(a)*d,p.y+Math.sin(a)*d,2.4*(1-f),0,6.3);c.fill();}
   if(p.kind){c.save();c.translate(p.x,p.y-f*70);c.globalAlpha=(1-f)*.95*fade;c.fillStyle=c.strokeStyle='#ffe9a8';fxIco(c,p.kind,p.r*.42*(1-f*.4));c.restore();}}
  c.globalAlpha=1;};};
FXS.heavyrain=(W,H,D)=>{const k=Math.min(W,H)/600,Dr=[],Im=[];let acc=0;
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t),press=_fSm(0,.8,t);c.globalCompositeOperation='source-over';
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(8,12,40,${.6*press*fade})`);g.addColorStop(1,`rgba(50,12,80,${.3*press*fade})`);c.fillStyle=g;c.fillRect(0,0,W,H);
  c.globalCompositeOperation='lighter';c.fillStyle='rgba(170,110,255,.22)';for(let i=0;i<9;i++){const x=W*(i+.5)/9,y=((t*220+i*131)%(H+80))-40,s=26*k;c.globalAlpha=press*fade;c.beginPath();c.moveTo(x-s,y-s*.5);c.lineTo(x,y+s*.3);c.lineTo(x+s,y-s*.5);c.lineTo(x+s,y-s*.9);c.lineTo(x,y-s*.1);c.lineTo(x-s,y-s*.9);c.fill();}
  if(t<D-.65){acc+=dt*(t<.25?30:75);while(acc>=1){acc--;Dr.push({x:_fRn(-.05,1.05)*W,y:-60,vy:_fRn(1100,1800)*k,w:_fRn(5,11)*k,ty:_fRn(.52,.97)*H});}}
  for(let i=Dr.length-1;i>=0;i--){const d=Dr[i];d.y+=d.vy*dt;if(d.y>=d.ty){Im.push({x:d.x,y:d.ty,t0:t,w:d.w,cr:Array.from({length:6},()=>({a:_fR()*6.283,l:_fRn(20,60)*k}))});Dr.splice(i,1);continue;}
   const len=d.vy*.05,gr=c.createLinearGradient(d.x,d.y-len,d.x,d.y);gr.addColorStop(0,'rgba(150,180,230,0)');gr.addColorStop(1,'rgba(190,215,255,.85)');c.globalAlpha=fade;c.strokeStyle=gr;c.lineWidth=d.w*.5;c.lineCap='round';c.beginPath();c.moveTo(d.x,d.y-len);c.lineTo(d.x,d.y);c.stroke();
   c.fillStyle='#dbe8ff';c.beginPath();c.ellipse(d.x,d.y,d.w*.6,d.w*1.1,0,0,6.3);c.fill();}
  for(let i=Im.length-1;i>=0;i--){const m=Im[i],f=(t-m.t0)/.8;if(f>1){Im.splice(i,1);continue;}const r=(30+f*110)*k*m.w/8;c.globalAlpha=(1-f)*fade;
   const dk=c.createRadialGradient(m.x,m.y,0,m.x,m.y,r*.9);dk.addColorStop(0,'rgba(150,90,255,.5)');dk.addColorStop(1,'rgba(150,90,255,0)');c.fillStyle=dk;c.beginPath();c.ellipse(m.x,m.y,r*.9,r*.32,0,0,6.3);c.fill();
   c.strokeStyle='rgba(200,220,255,.9)';c.lineWidth=3*(1-f)+1;c.beginPath();c.ellipse(m.x,m.y,r,r*.3,0,0,6.3);c.stroke();
   c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=1.6;for(const q of m.cr){const e=Math.min(1,f*5);c.beginPath();c.moveTo(m.x,m.y);c.lineTo(m.x+Math.cos(q.a)*q.l*e,m.y+Math.sin(q.a)*q.l*e*.45);c.stroke();}}
  c.globalAlpha=1;};};
FXS.claw=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,Bl=[],Cr=[];let acc=0;
  return(c,t,dt)=>{const fade=1-_fSm(D-.4,D,t);
  if(t>.12&&t<D-.65){acc+=dt*34;while(acc>=1){acc--;const side=_fR(),sx=side<.4?-60:side<.8?W+60:_fRn(.1,.9)*W,sy=side<.8?_fRn(.5,1.05)*H:H+60;Bl.push({sx,sy,tx:cx+_fRn(-W*.22,W*.22),ty:cy+_fRn(-H*.22,H*.2),t0:t,fl:_fRn(.11,.17),L:_fRn(48,78)*k});}}
  c.globalCompositeOperation='lighter';
  for(let i=Bl.length-1;i>=0;i--){const b=Bl[i],u=(t-b.t0)/b.fl;if(u<.35){c.globalAlpha=(1-u/.35)*fade;fxFlare(c,b.sx<0?20:b.sx>W?W-20:b.sx,Math.min(b.sy,H-10),46*k,'#ffe0f0',(1-u/.35)*fade);}
   if(u>=1){Cr.push({x:b.tx,y:b.ty,t0:t,ang:Array.from({length:8},()=>({a:_fR()*6.283,l:_fRn(30,90)*k}))});Bl.splice(i,1);continue;}
   const e=u*u*.4+u*.6,x=b.sx+(b.tx-b.sx)*e,y=b.sy+(b.ty-b.sy)*e,a=Math.atan2(b.ty-b.sy,b.tx-b.sx),tl=Math.min(e,.35),tx=x-(b.tx-b.sx)*tl,ty=y-(b.ty-b.sy)*tl;
   const gr=c.createLinearGradient(tx,ty,x,y);gr.addColorStop(0,'rgba(255,170,220,0)');gr.addColorStop(1,'rgba(255,220,240,.8)');c.globalAlpha=.7*fade;c.strokeStyle=gr;c.lineWidth=b.L*.22;c.lineCap='round';c.beginPath();c.moveTo(tx,ty);c.lineTo(x,y);c.stroke();
   c.save();c.translate(x,y);c.rotate(a);c.globalCompositeOperation='source-over';c.globalAlpha=fade;const L=b.L,w=L*.2,nf=c.createLinearGradient(0,-w,0,w);nf.addColorStop(0,'#ffffff');nf.addColorStop(.5,'#ffc8e0');nf.addColorStop(1,'#d88ab4');c.fillStyle=nf;c.strokeStyle='#fff';c.lineWidth=1.8;
   c.beginPath();c.moveTo(L*.55,0);c.quadraticCurveTo(L*.1,-w*1.1,-L*.5,-w);c.lineTo(-L*.5,w);c.quadraticCurveTo(L*.1,w*1.1,L*.55,0);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.7)';c.fillRect(-L*.35,-w*.6,L*.5,w*.35);c.restore();c.globalCompositeOperation='lighter';}
  for(let i=Cr.length-1;i>=0;i--){const m=Cr[i],f=(t-m.t0)/.5;if(f>1){Cr.splice(i,1);continue;}c.globalAlpha=(1-f)*fade;c.strokeStyle='#ffd8ec';c.lineWidth=2.2;for(const q of m.ang){const e=Math.min(1,f*4);c.beginPath();c.moveTo(m.x+Math.cos(q.a)*8*k,m.y+Math.sin(q.a)*8*k);c.lineTo(m.x+Math.cos(q.a)*q.l*e,m.y+Math.sin(q.a)*q.l*e);c.stroke();}
   fxGlow(c,m.x,m.y,(34+f*40)*k,'#ffb0d8',(1-f)*.8*fade);c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(m.x,m.y,(10+f*60)*k,0,6.3);c.stroke();}
  c.globalAlpha=1;};};
FXS.mend=(W,H,D)=>{
  // 修復：衝撃の一瞬 → 砕けた破片・瓦礫・破れた紙が巻き戻って「カチッ」と元通りになり、傷が癒えて金色に輝く
  const k=Math.min(W,H)/600,R=Math.min(W,H)*.27,M=22,TD=1.15,sm=_fSm,FAR=Math.max(W,H)*.65;
  const clamp=x=>Math.max(0,Math.min(1,x)),lp=(a,b,m)=>a+(b-a)*m;
  const back=x=>{const u=x-1;return 1+2.2*u*u*u+1.2*u*u;}; // 軽くオーバーシュートしてはまる
  const path=(c,pts)=>{c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();};
  const pol=(r,a)=>[Math.cos(a)*r,Math.sin(a)*r];
  const P=[],Q=[],Rb=[],Pf=[],Hl=[];
  const cen=pts=>{let x=0,y=0;for(const p of pts){x+=p[0];y+=p[1];}return[x/pts.length,y/pts.length];};
  // --- 円盤（石・壁のかけら／一部は紙）：継ぎ目がゆがんだ放射状の破片
  const rf=[0,.3,.62,1],V=rf.map((f,j)=>Array.from({length:M},(_,i)=>{const a=(i+(j%2?.5:0))/M*6.283+(j&&j<3?_fRn(-.08,.08):0),r=R*f*(j&&j<3?_fRn(.9,1.08):1);return pol(r,a);}));
  const add=(pts,paper)=>{const[gx,gy]=cen(pts),a=Math.atan2(gy,gx)+_fRn(-.9,.9),dist=_fRn(.5,1.5)*R+Math.max(W,H)*.07,dl=.05+_fR()*.4,du=.5+_fR()*.12;
    P.push({pts,gx,gy,ox:Math.cos(a)*dist,oy:Math.sin(a)*dist,rot:_fRn(-2.6,2.6),z:_fRn(1.25,1.9),dl,du,tl:dl+du,ph:_fR()*9,paper,L:_fR(),done:0});};
  for(let j=0;j<3;j++)for(let i=0;i<M;i++){const i1=(i+1)%M;
    if(j===0){add([V[0][i],V[1][i],V[1][i1]],_fR()<.2);continue;}
    const a=V[j][i],b=V[j][i1],c2=V[j+1][i1],d=V[j+1][i],pp=_fR()<.28;
    if(_fR()<.55){add([a,b,c2],pp);add([a,c2,d],pp);}else add([a,b,c2,d],pp);}
  // --- 外側の「破れた紙」の輪：ギザギザの破れ目で分かれた帯が、渦を巻いて戻ってくる
  const Ri=R*1.1,Ro=R*1.3,S=12;
  const seam=Array.from({length:S},(_,i)=>{const a=i/S*6.283,pts=[];for(let s=0;s<=5;s++)pts.push(pol(Ri+(Ro-Ri)*s/5,a+(s&&s<5?_fRn(-.055,.055):0)));return pts;});
  for(let i=0;i<S;i++){const s0=seam[i],s1=seam[(i+1)%S],a0=i/S*6.283,a1=(i+1)/S*6.283,pts=[...s0];
    for(let q=1;q<4;q++)pts.push(pol(Ro,a0+(a1-a0)*q/4));
    for(let q=s1.length-1;q>=0;q--)pts.push(s1[q]);
    for(let q=3;q>=1;q--)pts.push(pol(Ri,a0+(a1-a0)*q/4));
    const[gx,gy]=cen(pts),dl=.15+i*.03+_fR()*.05,du=.6;
    Q.push({pts,gx,gy,am:Math.atan2(gy,gx),sw:(i%2?1:-1)*_fRn(1.1,2.1),spin:_fRn(-3.5,3.5),z:_fRn(1.2,1.6),dl,du,tl:dl+du,L:_fR(),done:0});}
  // --- 逆再生で吸い込まれる瓦礫
  for(let i=0;i<46;i++){const a=_fR()*6.283,d=_fRn(.55,1)*Math.max(W,H)*.6,b=_fR()*6.283,e=_fRn(.2,.95)*R,g=_fRn(.3,.62);
    Rb.push({x0:Math.cos(a)*d,y0:Math.sin(a)*d,x1:Math.cos(b)*e,y1:Math.sin(b)*e,dl:_fR()*.7,du:_fRn(.45,.8),r:_fR()*6,vr:_fRn(-6,6),w:_fRn(6,15)*k,h:_fRn(4,8)*k,c:`hsl(${_fRn(20,40)},${_fRn(6,18)}%,${g*100}%)`});}
  // 傷んだ色 → 修復の金色
  const col=(paper,L,m)=>paper?`hsl(${lp(38,46,m)},${lp(26,92,m)}%,${lp(76+L*12,80+L*12,m)}%)`:`hsl(${lp(218,44,m)},${lp(14,88,m)}%,${lp(32+L*18,60+L*22,m)}%)`;
  return(c,t,dt)=>{const fade=1-sm(D-.45,D,t),appear=sm(0,.12,t),f=t-TD;
  c.save();c.translate(W/2,H*.46);
  c.globalCompositeOperation='lighter';
  fxGlow(c,0,0,R*2.6,'#8fb0e0',.22*(1-sm(.6,TD,t))*appear*fade);   // 傷んだ状態の冷たい光
  fxGlow(c,0,0,R*2.9,'#ffe9a0',.36*sm(.8,TD+.2,t)*fade);           // 修復後の暖かい光
  if(t<.2){const u=t/.2;c.globalAlpha=(1-u)*.9*fade;c.strokeStyle='#fff';c.lineWidth=2.6*k*(1-u)+.6;for(let i=0;i<18;i++){const a=i/18*6.283+.1,r0=R*(.25+u*.5),r1=R*(.9+u*1.4+(i%3)*.25);c.beginPath();c.moveTo(Math.cos(a)*r0,Math.sin(a)*r0);c.lineTo(Math.cos(a)*r1,Math.sin(a)*r1);c.stroke();}} // 殴られた瞬間の衝撃
  // 瓦礫
  c.globalCompositeOperation='source-over';
  for(const b of Rb){const u=clamp((t-b.dl)/b.du);if(u<=0||u>=1)continue;const e=u*u,x=b.x0+(b.x1-b.x0)*e,y=b.y0+(b.y1-b.y0)*e,al=fade*(1-sm(.8,1,u))*sm(0,.1,u);
    c.globalAlpha=al*.35;c.strokeStyle='#fff0c8';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+(b.x0-x)*.1,y+(b.y0-y)*.1);c.stroke();
    c.save();c.translate(x,y);c.rotate(b.r+b.vr*u);c.globalAlpha=al;c.fillStyle=b.c;c.fillRect(-b.w/2,-b.h/2,b.w,b.h);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(-b.w/2,-b.h/2,b.w,b.h*.3);c.restore();}
  // 完成の脈動（円盤と輪をまとめて少し膨らませる）
  const pu=t>TD?1+.07*Math.exp(-f*7)*Math.sin(f*22):1;
  c.save();c.scale(pu,pu);
  const tfP=(p,e,tt)=>{const o=1-e,hv=tt<p.dl?1:0;c.translate(p.gx+p.ox*o+hv*Math.sin(tt*4+p.ph)*3*k,p.gy+p.oy*o+hv*Math.cos(tt*3.3+p.ph)*3*k);c.rotate(p.rot*o);const s=1+(p.z-1)*o;c.scale(s,s);c.translate(-p.gx,-p.gy);};
  const tfQ=(p,e)=>{const o=1-e;c.rotate(p.sw*o);c.translate(Math.cos(p.am)*FAR*o,Math.sin(p.am)*FAR*o);c.translate(p.gx,p.gy);c.rotate(p.spin*o);const s=1+(p.z-1)*o;c.scale(s,s);c.translate(-p.gx,-p.gy);};
  // 飛んでいる最中の残像（光の筋）
  c.globalCompositeOperation='lighter';c.fillStyle='#ffe9a8';
  for(const p of P){const u=clamp((t-p.dl)/p.du);if(u<=0||u>=1)continue;for(let g=1;g<=3;g++){const uu=Math.max(0,u-g*.05);c.save();tfP(p,back(uu),t);path(c,p.pts);c.globalAlpha=(.2-g*.05)*fade;c.fill();c.restore();}}
  for(const p of Q){const u=clamp((t-p.dl)/p.du);if(u<=0||u>=1)continue;for(let g=1;g<=3;g++){const uu=Math.max(0,u-g*.05);c.save();tfQ(p,back(uu));path(c,p.pts);c.globalAlpha=(.2-g*.05)*fade;c.fill();c.restore();}}
  // 本体：紙の輪
  c.globalCompositeOperation='source-over';
  for(const p of Q){const u=clamp((t-p.dl)/p.du),e=back(u),m=sm(p.tl-.12,p.tl+.4,t);c.save();tfQ(p,e);path(c,p.pts);
    c.globalAlpha=fade*appear;c.fillStyle=col(1,p.L,m);c.fill();
    if(u<1){c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=2*k+.5;c.stroke();} // 破れ目の白い繊維
    c.restore();
    if(!p.done&&t>=p.tl){p.done=1;for(let q=0;q<4;q++)Pf.push({x:p.gx,y:p.gy,vx:_fRn(-50,50)*k,vy:_fRn(-60,20)*k,l:0,m:_fRn(.4,.7),s:_fRn(10,20)*k,t:0});}}
  // 本体：円盤の破片
  for(const p of P){const u=clamp((t-p.dl)/p.du),e=back(u),m=sm(p.tl-.12,p.tl+.4,t);c.save();tfP(p,e,t);path(c,p.pts);
    c.globalAlpha=fade*appear;c.fillStyle=col(p.paper,p.L,m);c.fill();
    if(p.paper&&m<.7){c.save();c.clip();c.strokeStyle=`rgba(80,60,40,${.3*(1-m)})`;c.lineWidth=1;for(let q=-3;q<=3;q++){c.beginPath();c.moveTo(p.gx-50*k,p.gy+q*6*k);c.lineTo(p.gx+50*k,p.gy+q*6*k);c.stroke();}c.restore();}
    c.strokeStyle=u<1?'rgba(15,20,36,.65)':'rgba(120,80,10,.28)';c.lineWidth=1.3*k+.4;c.stroke();c.restore();
    if(!p.done&&t>=p.tl){p.done=1;for(let q=0;q<3;q++)Pf.push({x:p.gx,y:p.gy,vx:_fRn(-40,40)*k,vy:_fRn(-60,10)*k,l:0,m:_fRn(.4,.7),s:_fRn(10,20)*k,t:0});if(_fR()<.5)Pf.push({x:p.gx,y:p.gy,vx:0,vy:0,l:0,m:.35,s:_fRn(10,18)*k,t:1});}}
  // はまった瞬間の光と、金継ぎのように光る継ぎ目
  c.globalCompositeOperation='lighter';
  const seamA=sm(TD-.05,TD+.1,t)*(1-sm(TD+.35,TD+.9,t));
  for(const p of P.concat(Q)){if(t<p.tl)continue;const a=1-clamp((t-p.tl)/.3);if(a<=0)continue;path(c,p.pts);c.globalAlpha=a*.45*fade;c.fillStyle='#fff6c8';c.fill();c.globalAlpha=a*fade;c.strokeStyle='#ffd860';c.lineWidth=2.4*k;c.stroke();}
  if(seamA>0){c.globalAlpha=seamA*.95*fade;c.strokeStyle='#ffd860';c.lineWidth=3*k;c.beginPath();for(const p of P.concat(Q)){c.moveTo(p.pts[0][0],p.pts[0][1]);for(let i=1;i<p.pts.length;i++)c.lineTo(p.pts[i][0],p.pts[i][1]);c.closePath();}c.stroke();}
  // 光が一度走る
  const gs=sm(.05,.6,f);
  if(t>TD&&gs<1){c.save();c.beginPath();c.arc(0,0,R*1.3,0,6.3);c.clip();const bx=-R*1.6+gs*R*3.2,g=c.createLinearGradient(bx-R*.35,-R*.35,bx+R*.35,R*.35);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.85)');g.addColorStop(1,'rgba(255,255,255,0)');c.globalAlpha=fade;c.fillStyle=g;c.fillRect(-R*2,-R*2,R*4,R*4);c.restore();}
  c.restore(); // pulse
  // 粉塵と火花
  for(let i=Pf.length-1;i>=0;i--){const q=Pf[i];q.l+=dt;if(q.l>q.m){Pf.splice(i,1);continue;}q.x+=q.vx*dt;q.y+=q.vy*dt;const u=q.l/q.m;
    if(q.t)fxFlare(c,q.x,q.y,q.s*(1-u*.4),'#fff4c0',(1-u)*fade);else fxGlow(c,q.x,q.y,q.s*(1+u*1.6),'#e6d6b0',.38*(1-u)*fade);}
  // 完成後：衝撃波・放射光・癒やしの波・十字と光の粒
  if(t>TD){
    if(f<.25){c.globalAlpha=(1-f/.25)*.55*fade;c.fillStyle='#fff';c.beginPath();c.arc(0,0,R*1.3,0,6.3);c.fill();}
    for(let j=0;j<2;j++){const ff=(f-j*.12)/.7;if(ff<=0||ff>=1)continue;c.globalAlpha=(1-ff)*fade;c.strokeStyle=j?'#9affc0':'#fff6c8';c.lineWidth=(10*(1-ff)+1)*k;c.beginPath();c.arc(0,0,R*(1+ff*(2.2+j*.6)),0,6.3);c.stroke();}
    const ra=sm(0,.15,f)*(1-sm(.3,.9,f));
    if(ra>0){c.save();c.rotate(t*.6);c.globalAlpha=ra*.33*fade;c.fillStyle='#fff0b0';for(let i=0;i<12;i++){c.save();c.rotate(i*.5236);c.beginPath();c.moveTo(R*.9,-7*k);c.lineTo(R*2.9,0);c.lineTo(R*.9,7*k);c.fill();c.restore();}c.restore();}
    for(let j=0;j<3;j++){const ff=(f-.3-j*.4)/.9;if(ff<=0||ff>=1)continue;c.globalAlpha=(1-ff)*.55*fade;c.strokeStyle='#b4ffd0';c.lineWidth=3*k;c.beginPath();c.arc(0,0,R*(1.05+ff*1.2),0,6.3);c.stroke();}
    const ef=sm(0,.3,f)*(1-sm(.5,1.1,f));if(ef>0)fxFlare(c,0,0,R*.6,'#fff8d0',ef*fade);
    if(t<D-.5&&_fR()<dt*34){const a=_fR()*6.283,r=Math.sqrt(_fR())*R*1.15;Hl.push({x:Math.cos(a)*r,y:Math.sin(a)*r*.9,vy:-_fRn(50,130)*k,ph:_fR()*9,l:0,m:_fRn(.9,1.5),s:_fRn(7,14)*k,cr:_fR()<.55});}
    if(_fR()<dt*30){const a=_fR()*6.283,d=_fRn(.2,1.2)*R;fxFlare(c,Math.cos(a)*d,Math.sin(a)*d,_fRn(8,18)*k,'#fff4c0',.9*fade);}
  }
  for(let i=Hl.length-1;i>=0;i--){const h=Hl[i];h.l+=dt;if(h.l>h.m){Hl.splice(i,1);continue;}h.y+=h.vy*dt;const u=h.l/h.m,x=h.x+Math.sin(h.l*4+h.ph)*10*k,al=Math.sin(u*Math.PI)*fade;
    if(h.cr){c.globalAlpha=al*.9;c.fillStyle='#b4ffd0';const s=h.s;c.beginPath();c.roundRect(x-s*.2,h.y-s*.6,s*.4,s*1.2,s*.15);c.roundRect(x-s*.6,h.y-s*.2,s*1.2,s*.4,s*.15);c.fill();}
    else fxGlow(c,x,h.y,h.s*1.3,'#fff0a0',al*.9);}
  c.restore();c.globalCompositeOperation='source-over';c.globalAlpha=1;};};
FXS.sprout=(W,H,D)=>{const k=Math.min(W,H)/600,V=Array.from({length:9},(_,i)=>({x0:W*(i+.5)/9+_fRn(-20,20),h:_fRn(.5,.88)*H,ph:_fR()*9,dl:_fRn(0,.45),fc:[['#ffd0e4','#ff7aa8'],['#fff4a8','#ffc030'],['#ffffff','#c8e8ff'],['#e8d0ff','#a070f0']][i%4]})),
  Ch=Array.from({length:30},()=>({x:_fR()*W,y:H+_fRn(0,40),vy:-_fRn(80,260)*k,r:_fR()*6,vr:_fRn(-3,3),s:_fRn(7,15)*k,tc:_fRn(.5,1.3),c:['#ff9ab8','#ffd860','#ffffff','#c0a0ff'][Math.floor(_fR()*4)]})),Bf=Array.from({length:6},(_,i)=>({ph:_fR()*9,x:W*(.15+i*.14),sp:_fRn(1,2),col:['#ffb0d0','#ffe070','#a8e0ff'][i%3],s:_fRn(14,24)*k}));
  const pos=(v,s)=>({x:v.x0+Math.sin(s*5+v.ph)*28*k,y:H-s*v.h});
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='lighter';const gr=c.createLinearGradient(0,H,0,H*.4);gr.addColorStop(0,`rgba(140,255,150,${.3*fade})`);gr.addColorStop(1,'rgba(140,255,150,0)');c.fillStyle=gr;c.globalAlpha=1;c.fillRect(0,H*.4,W,H*.6);
  c.globalCompositeOperation='source-over';
  for(const v of V){const u=_fSm(v.dl,v.dl+1,t);if(u<=0)continue;c.lineCap='round';
   for(let i=0;i<40;i++){const s0=i/40*u,s1=(i+1)/40*u,a=pos(v,s0),b=pos(v,s1);c.globalAlpha=fade;c.strokeStyle=i%2?'#2f9a4a':'#3fb85c';c.lineWidth=Math.max(1.6,6*k*(1-s0*.7));c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
   for(let s=.14;s<u-.02;s+=.1){const p=pos(v,s),g=_fSm(s,s+.14,u),side=Math.round(s*10)%2?1:-1;c.save();c.translate(p.x,p.y);c.rotate(side*(1.05-g*.15)+Math.sin(t*2+s*9+v.ph)*.08);c.translate(0,-18*k*g);c.globalAlpha=fade;fxLeaf(c,22*k*g,'#7ae890','#1f9e5a');c.restore();}
   if(u>.9){const b=_fSm(.9,1,u),p=pos(v,u);c.save();c.translate(p.x,p.y);c.scale(b,b);c.rotate(Math.sin(t*1.5+v.ph)*.1);c.globalAlpha=fade;for(let j=0;j<6;j++){c.save();c.rotate(j*1.0472);c.translate(0,-20*k);fxPetal(c,22*k,v.fc[0],v.fc[1]);c.restore();}c.fillStyle='#ffe070';c.beginPath();c.arc(0,0,8*k,0,6.3);c.fill();c.restore();}}
  for(const h of Ch){h.y+=h.vy*dt;h.r+=h.vr*dt;if(h.y<-30)continue;c.save();c.translate(h.x,h.y);c.rotate(h.r);c.globalAlpha=fade;if(t<h.tc){c.fillStyle='#8c8f9a';c.strokeStyle='#d0d4de';c.lineWidth=1;c.beginPath();c.moveTo(-h.s,-h.s*.3);c.lineTo(-h.s*.2,-h.s);c.lineTo(h.s,-h.s*.4);c.lineTo(h.s*.5,h.s);c.lineTo(-h.s*.7,h.s*.7);c.closePath();c.fill();c.stroke();}else{const g=_fSm(h.tc,h.tc+.25,t);c.scale(g,g);fxPetal(c,h.s*1.3,'#ffffff',h.c);}c.restore();}
  if(t>.9)for(const b of Bf){const u=t-.9,x=b.x+Math.sin(u*b.sp*2+b.ph)*W*.12,y=H*.78-u*H*.28+Math.sin(u*4+b.ph)*20*k,w=Math.abs(Math.sin(t*16+b.ph));c.save();c.translate(x,y);c.globalAlpha=fade*_fSm(.9,1.3,t);c.fillStyle=b.col;for(const sg of[-1,1]){c.beginPath();c.ellipse(sg*b.s*.5*w,-b.s*.1,b.s*.55*w+1,b.s*.8,sg*.4,0,6.3);c.fill();}c.fillStyle='#4a3a2a';c.fillRect(-1.5,-b.s*.5,3,b.s);c.restore();}
  c.globalAlpha=1;};};
// ===== 能力モチーフの演出その2（オリジナル）：赤光線・光刃・止まった世界・戦車爆弾・巻き戻し・過程消去・ディスク・重力反転・宇宙一巡 =====
FXS.redray=(W,H,D)=>{const k=Math.min(W,H)/600,ey=H*.2,ex=[W*.4,W*.6],V=[],B=[],P=[];let acc=0;
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='lighter';
  const charge=_fSm(0,.75,t);
  if(t<.8){acc+=dt*50;while(acc>=1){acc--;const s=_fR()<.5?0:1;V.push({x:ex[s]+_fRn(-60,60)*k,y:ey+_fRn(20,160)*k,l:0,m:_fRn(.5,.9),s:_fRn(16,34)*k,e:s});}}
  for(let i=V.length-1;i>=0;i--){const v=V[i];v.l+=dt;if(v.l>v.m){V.splice(i,1);continue;}const f=v.l/v.m;v.x+=(ex[v.e]-v.x)*dt*3.5;v.y+=(ey-v.y)*dt*3.5;fxGlow(c,v.x,v.y,v.s*(1-f*.4),'#ffd0d8',.35*(1-f)*fade);}
  for(const x of ex){fxGlow(c,x,ey,(14+70*charge)*k,'#ff2030',.9*fade);fxGlow(c,x,ey,(6+22*charge)*k,'#ffffff',.9*fade);}
  if(t>.8){const u=_fSm(.8,1.9,t),tx=W*(.08+.84*u),ty=H*.82;
   if(B.length<400)B.push([tx,ty]);
   for(let j=0;j<2;j++){const x0=ex[j];c.lineCap='round';
    c.globalAlpha=.3*fade;c.strokeStyle='#ff1830';c.lineWidth=34*k;c.beginPath();c.moveTo(x0,ey);c.lineTo(tx,ty);c.stroke();
    c.globalAlpha=.7*fade;c.strokeStyle='#ff5a60';c.lineWidth=14*k;c.beginPath();c.moveTo(x0,ey);c.lineTo(tx,ty);c.stroke();
    c.globalAlpha=fade;c.strokeStyle='#fff';c.lineWidth=4.5*k;c.beginPath();c.moveTo(x0,ey);c.lineTo(tx,ty);c.stroke();}
   fxGlow(c,tx,ty,110*k,'#ff3a20',.95*fade);fxGlow(c,tx,ty,40*k,'#fff4d0',fade);
   for(let i=0;i<3;i++)P.push({x:tx,y:ty,vx:_fRn(-300,300),vy:-_fRn(120,520),l:0,m:_fRn(.4,.9)});}
  if(B.length>1){c.strokeStyle='#ff4020';c.lineWidth=7*k;c.globalAlpha=.55*fade*(1-_fSm(1.9,D,t)*.6);c.beginPath();B.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();}
  for(let i=P.length-1;i>=0;i--){const p=P[i];p.l+=dt;if(p.l>p.m){P.splice(i,1);continue;}p.vy+=700*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;fxGlow(c,p.x,p.y,7*k,'#ffc060',(1-p.l/p.m)*fade);}
  c.globalAlpha=1;};};
FXS.lightblade=(W,H,D)=>{const k=Math.min(W,H)/600,S=[],Sh=[];const T=[.55,.8,1.05,1.3];let n=0;
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='lighter';
  const u=_fSm(.05,.5,t),ax=W+30,ay=H*.28,bx=W*.22,by=H*.66,tx=ax+(bx-ax)*u,ty=ay+(by-ay)*u;
  if(u>0){const a=Math.atan2(by-ay,bx-ax),nx=-Math.sin(a),ny=Math.cos(a),w=16*k;
   c.globalAlpha=fade;c.fillStyle='#e8fbff';c.beginPath();c.moveTo(ax+nx*w,ay+ny*w);c.lineTo(tx,ty);c.lineTo(ax-nx*w,ay-ny*w);c.closePath();c.fill();
   c.strokeStyle='#7ae0ff';c.lineWidth=2.5;c.stroke();fxGlow(c,tx,ty,60*k,'#aef0ff',.9*fade);
   for(let i=0;i<14;i++){const s=i/14,px=ax+(tx-ax)*s,py=ay+(ty-ay)*s,ra=a+Math.PI/2*(i%2?1:-1)+Math.sin(t*6+i)*.15,L=Math.max(W,H)*(.25+.15*((i*7)%5)/5);c.globalAlpha=.45*fade*_fSm(.2,.5,t);c.strokeStyle=`hsl(${(i*53+t*200)%360},100%,70%)`;c.lineWidth=2;c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(ra)*L,py+Math.sin(ra)*L);c.stroke();}}
  while(n<T.length&&t>=T[n]){const a=_fRn(-.5,.5)+(n%2?.6:-.6),cx=W/2+_fRn(-W*.15,W*.15),cy=H*.46+_fRn(-H*.1,H*.1),L=Math.max(W,H);S.push({x1:cx-Math.cos(a)*L,y1:cy-Math.sin(a)*L,x2:cx+Math.cos(a)*L,y2:cy+Math.sin(a)*L,t0:t,a});n++;}
  for(const s of S){const q=t-s.t0,g=_fSm(0,.1,q),gap=_fSm(.05,.5,q)*26*k,nx=-Math.sin(s.a),ny=Math.cos(s.a),al=(1-_fSm(.5,1,q))*fade;if(al<=0)continue;
   c.lineCap='round';c.globalAlpha=al*.8;c.strokeStyle='#7ae0ff';c.lineWidth=6*k;for(const sg of[-1,1]){c.beginPath();c.moveTo(s.x1+nx*gap*sg,s.y1+ny*gap*sg);c.lineTo(s.x1+(s.x2-s.x1)*g+nx*gap*sg,s.y1+(s.y2-s.y1)*g+ny*gap*sg);c.stroke();}
   c.globalAlpha=al;c.strokeStyle='#fff';c.lineWidth=3*k*(1-q*.8);c.beginPath();c.moveTo(s.x1,s.y1);c.lineTo(s.x1+(s.x2-s.x1)*g,s.y1+(s.y2-s.y1)*g);c.stroke();
   if(q<.05)for(let i=0;i<10;i++)Sh.push({x:(s.x1+s.x2)/2+_fRn(-W*.3,W*.3)*Math.cos(s.a),y:(s.y1+s.y2)/2+_fRn(-W*.3,W*.3)*Math.sin(s.a),vx:nx*_fRn(-500,500),vy:ny*_fRn(-500,500),l:0,m:_fRn(.5,1),r:_fR()*6});}
  for(let i=Sh.length-1;i>=0;i--){const p=Sh[i];p.l+=dt;if(p.l>p.m){Sh.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=dt*6;c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=(1-p.l/p.m)*fade;c.fillStyle='#d8f6ff';c.beginPath();c.moveTo(0,-9*k);c.lineTo(4*k,6*k);c.lineTo(-4*k,6*k);c.fill();c.restore();}
  c.globalAlpha=1;};};
FXS.chronolock=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,L=[],Dr=Array.from({length:64},()=>({x:_fR()*W,y:_fR()*H,vy:_fRn(-80,260),s:_fRn(3,9)*k,tw:_fR()*9}));
  const crack=(x,y,a,len,d)=>{if(d>3)return;const n=5+(d?0:2),pts=[[x,y]];let px=x,py=y,aa=a;for(let i=0;i<n;i++){aa+=_fRn(-.35,.35);px+=Math.cos(aa)*len/n;py+=Math.sin(aa)*len/n;pts.push([px,py]);if(_fR()<.35)crack(px,py,aa+_fRn(-1.1,1.1),len*.5,d+1);}L.push({pts,d});};
  for(let i=0;i<16;i++)crack(cx,cy,i/16*6.283+_fRn(-.15,.15),Math.max(W,H)*.6,0);
  return(c,t,dt)=>{const fade=1-_fSm(D-.5,D,t),u=_fSm(.05,.75,t),fr=_fSm(.7,.9,t);c.globalCompositeOperation='source-over';
  const g=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.8*Math.max(u,.01));g.addColorStop(0,'rgba(140,170,200,.05)');g.addColorStop(1,`rgba(70,95,130,${.42*fade})`);c.fillStyle=g;c.fillRect(0,0,W,H);
  c.globalCompositeOperation='lighter';c.lineCap='round';
  for(const l of L){const n=Math.max(1,Math.floor(l.pts.length*u));c.globalAlpha=(.9-l.d*.15)*fade;c.strokeStyle='#cfeaff';c.lineWidth=Math.max(.8,(3.2-l.d)*k);c.beginPath();for(let i=0;i<n;i++){const p=l.pts[i];i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();}
  for(const d of Dr){d.y+=d.vy*dt*(1-fr);c.save();c.translate(d.x,d.y);c.globalAlpha=.8*fade*_fSm(.2,.5,t);c.fillStyle='#d8f0ff';c.beginPath();c.moveTo(0,-d.s*1.6);c.quadraticCurveTo(d.s,0,0,d.s);c.quadraticCurveTo(-d.s,0,0,-d.s*1.6);c.fill();if(Math.sin(t*4+d.tw)>.85){c.fillStyle='#fff';c.fillRect(-d.s*.2,-d.s*2,d.s*.4,d.s*3);}c.restore();}
  for(const t0 of[.8,1.25]){const f=(t-t0)/.55;if(f>0&&f<1){c.globalAlpha=(1-f)*fade;c.strokeStyle='#fff';c.lineWidth=6*(1-f)+1;c.beginPath();c.arc(cx,cy,30+f*Math.max(W,H)*.6,0,6.3);c.stroke();}}
  if(t>.8&&t<.95){c.globalAlpha=(1-(t-.8)/.15)*.5;c.fillStyle='#fff';c.fillRect(0,0,W,H);}
  c.globalAlpha=1;};};
FXS.tankbomb=(W,H,D)=>{const cx=W/2,cy=H*.5,k=Math.min(W,H)/600,Tk=Array.from({length:9},(_,i)=>{const side=i%3,x0=side===0?-40:side===1?W+40:_fRn(.15,.85)*W,y0=side===2?H+40:_fRn(.55,1)*H;return{x0,y0,tx:cx+_fRn(-W*.12,W*.12),ty:cy+_fRn(-H*.1,H*.1),t0:.08+i*.1,dur:_fRn(.7,.95),ex:0};}),F=[];
  const tank=(c,x,y,a,s)=>{c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);c.fillStyle='#2a2a30';c.strokeStyle='#000';c.lineWidth=2;c.beginPath();c.roundRect(-18,-14,36,6,3);c.roundRect(-18,8,36,6,3);c.fill();c.stroke();
   c.fillStyle='#e8a030';c.beginPath();c.roundRect(-15,-9,30,18,4);c.fill();c.stroke();c.fillStyle='#ffd070';c.beginPath();c.arc(-2,0,6.5,0,6.3);c.fill();c.stroke();c.fillStyle='#d88a20';c.fillRect(4,-2,18,4);c.strokeRect(4,-2,18,4);
   c.fillStyle='#ff2a2a';c.beginPath();c.arc(-9,0,2.6,0,6.3);c.fill();c.restore();};
  return(c,t,dt)=>{const fade=1-_fSm(D-.4,D,t);c.globalCompositeOperation='lighter';
  const heat=_fSm(0,.5,t)*(.6+.4*Math.sin(t*9));fxGlow(c,cx,cy,120*k,'#ff5a20',.5*heat*fade);fxGlow(c,cx,cy,50*k,'#ffe0a0',.7*heat*fade);
  c.globalCompositeOperation='source-over';
  for(const T of Tk){const u=(t-T.t0)/T.dur;if(u<0)continue;if(u>=1){if(!T.ex){T.ex=1;F.push({x:T.tx,y:T.ty,t0:t});}continue;}const e=u*u*.5+u*.5,x=T.x0+(T.tx-T.x0)*e+Math.sin(u*14)*6*k,y=T.y0+(T.ty-T.y0)*e,a=Math.atan2(T.ty-T.y0,T.tx-T.x0);
   c.globalAlpha=fade*Math.min(1,u*8);c.fillStyle='rgba(200,180,150,.35)';for(let i=1;i<4;i++){c.beginPath();c.arc(x-Math.cos(a)*i*14*k,y-Math.sin(a)*i*14*k,(6-i)*k*1.4,0,6.3);c.fill();}
   c.globalAlpha=fade;tank(c,x,y,a,1.15*k);}
  c.globalCompositeOperation='lighter';
  for(let i=F.length-1;i>=0;i--){const f=F[i],q=(t-f.t0)/.7;if(q>1){F.splice(i,1);continue;}c.globalAlpha=1;fxGlow(c,f.x,f.y,(60+q*130)*k,q<.3?'#fff0c0':'#ff7020',(1-q)*.95*fade);
   c.globalAlpha=(1-q)*fade;c.strokeStyle='#ffb050';c.lineWidth=6*(1-q)+1;c.beginPath();c.arc(f.x,f.y,q*170*k,0,6.3);c.stroke();
   c.strokeStyle='#ffe090';c.lineWidth=2;for(let j=0;j<10;j++){const a=j*.628+f.x,r0=q*60*k,r1=q*200*k;c.beginPath();c.moveTo(f.x+Math.cos(a)*r0,f.y+Math.sin(a)*r0);c.lineTo(f.x+Math.cos(a)*r1,f.y+Math.sin(a)*r1);c.stroke();}}
  c.globalAlpha=1;};};
FXS.rewind=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,P=Array.from({length:90},()=>({a:_fR()*6.283,r:_fRn(.3,1)*Math.max(W,H)*.6,s:_fRn(2,6)*k,sp:_fRn(.6,1.3),col:['#ff7ad8','#7ae0ff','#ffe070','#ffffff'][Math.floor(_fR()*4)]}));
  const chev=(c,x,y,s,col,al)=>{c.globalAlpha=al;c.fillStyle=col;for(let j=0;j<2;j++){const o=j*s*.95;c.beginPath();c.moveTo(x-o,y);c.lineTo(x-o+s,y-s*.6);c.lineTo(x-o+s,y+s*.6);c.closePath();c.fill();}};
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='lighter';
  const R=Math.min(W,H)*.34;c.save();c.translate(cx,cy);c.globalAlpha=.55*fade*_fSm(.05,.4,t);c.strokeStyle='#e8c0ff';c.lineWidth=5*k;c.beginPath();c.arc(0,0,R,0,6.3);c.stroke();
  const ang=-t*t*9-t*3;c.lineCap='round';c.lineWidth=6*k;c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(ang)*R*.85,-Math.cos(ang)*R*.85);c.stroke();c.lineWidth=9*k;c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(ang/12)*R*.55,-Math.cos(ang/12)*R*.55);c.stroke();
  c.globalAlpha=.25*fade;c.fillStyle='#ff7ad8';c.beginPath();c.moveTo(0,0);c.arc(0,0,R*.85,-Math.PI/2+ang+Math.PI/2*0,-Math.PI/2+ang+1.6,false);c.closePath();c.fill();c.restore();
  const sp=(t*420*k)%(260*k);for(let i=-2;i<8;i++){const x=W-i*260*k+sp*0-sp;chev(c,x-sp*0+(-sp),cy,120*k,'#ff5ad0',.5*fade);chev(c,x+8*k-sp,cy+6*k,120*k,'#4adcff',.45*fade);}
  for(const p of P){p.r-=p.sp*dt*(180+t*500)*k;if(p.r<10)p.r=Math.max(W,H)*.65;p.a-=dt*(.8+t);fxGlow(c,cx+Math.cos(p.a)*p.r,cy+Math.sin(p.a)*p.r*.8,p.s*3,p.col,.7*fade);}
  c.globalAlpha=.1*fade;c.fillStyle='#fff';for(let y=((t*300)%8)-8;y<H;y+=8)c.fillRect(0,y,W,2);
  for(let i=0;i<3;i++){const y=((t*(260+i*90)+i*190)%(H+60))-30;c.globalAlpha=.25*fade;c.fillStyle='#bfe8ff';c.fillRect(0,y,W,_fRn(4,14)*k);}
  if(t>D-.7&&t<D-.4){c.globalAlpha=(1-Math.abs((t-(D-.55))/.15))*.5;c.fillStyle='#fff';c.fillRect(0,0,W,H);}
  c.globalAlpha=1;};};
FXS.erase=(W,H,D)=>{const k=Math.min(W,H)/600,y=H*.46+110*k,x0=W*.08,x1=W*.92,xa=W*.3,xb=W*.7,N=12,fr=Array.from({length:N},(_,i)=>({hue:i*28,er:i>=4&&i<8,dl:.35+(i-4)*.06}));
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='source-over';
  const fw=(x1-x0)/N,fh=70*k,fy=y-fh-40*k;
  fr.forEach((f,i)=>{const x=x0+i*fw+fw*.08,w=fw*.84;let al=_fSm(i*.03,i*.03+.3,t)*fade;if(f.er){const q=_fSm(f.dl,f.dl+.35,t);if(q>0){c.globalAlpha=al;c.fillStyle='#fff';c.fillRect(x,fy,w,fh);for(let j=0;j<10;j++){c.fillStyle=_fR()<.5?'#000':'#aaa';c.fillRect(x+_fR()*w,fy+_fR()*fh,_fRn(3,w*.5),_fRn(2,6));}}al*=1-_fSm(f.dl+.3,f.dl+.6,t)*1;if(al<=.02){c.globalAlpha=fade*.5;c.strokeStyle='#e0183a';c.setLineDash([5,5]);c.lineWidth=2;c.strokeRect(x,fy,w,fh);c.setLineDash([]);}}
   if(!f.er||al>.02){c.globalAlpha=al;const g=c.createLinearGradient(x,fy,x+w,fy+fh);g.addColorStop(0,`hsl(${f.hue},80%,60%)`);g.addColorStop(1,`hsl(${f.hue+40},80%,35%)`);if(!(f.er&&_fSm(f.dl,f.dl+.35,t)>0)){c.fillStyle=g;c.fillRect(x,fy,w,fh);}c.strokeStyle='#000';c.lineWidth=3;c.strokeRect(x,fy,w,fh);}});
  const er=_fSm(.35,.75,t);c.globalAlpha=fade;c.lineCap='round';c.lineWidth=7*k;c.strokeStyle='#fff';
  const seg=(a,b,col)=>{c.strokeStyle=col;c.beginPath();c.moveTo(a,y);c.lineTo(b,y);c.stroke();};
  seg(x0,Math.min(xa,x0+(x1-x0)*_fSm(0,.4,t)),'#fff');
  if(t<.75){c.globalAlpha=fade*(1-er);for(let i=0;i<24;i++){const x=xa+(xb-xa)*i/24;c.fillStyle=_fR()<.5?'#e0183a':'#fff';c.fillRect(x,y-8*k+_fRn(-10,10)*k,(xb-xa)/24*.8,_fRn(3,12)*k);}}
  c.globalAlpha=fade;if(t>.75){const j=_fSm(.75,.95,t);seg(xb,xb+(x1-xb)*j,'#ffe03a');c.globalCompositeOperation='lighter';for(let i=0;i<8;i++){c.globalAlpha=(1-i/8)*.6*fade*(1-_fSm(.95,1.3,t));c.fillStyle='#fff';c.fillRect(xa+(xb-xa)*(i/8)*.0+(xb-xa)*(1-i/8)*.0+xa+(xb-xa)*(i/8),y-4*k,(xb-xa)/8,8*k);}c.globalCompositeOperation='source-over';}
  const cur=t<.75?xa:t<.95?xb:xb;c.globalAlpha=fade;for(const[mx,col]of[[x0,'#fff'],[x1,'#ffe03a']]){c.fillStyle=col;c.strokeStyle='#000';c.lineWidth=3;c.beginPath();c.moveTo(mx,y-18*k);c.lineTo(mx+10*k,y);c.lineTo(mx,y+18*k);c.lineTo(mx-10*k,y);c.closePath();c.fill();c.stroke();}
  c.globalCompositeOperation='lighter';fxGlow(c,t<.75?Math.min(x0+(x1-x0)*_fSm(0,.4,t),xa):xb+(x1-xb)*_fSm(.75,.95,t),y,36*k,'#ffffff',.95*fade);
  if(t>.95){const q=(t-.95)/.7;if(q<1){c.globalAlpha=(1-q)*fade;c.strokeStyle='#ffe03a';c.lineWidth=6*(1-q)+1;c.beginPath();c.arc(x1,y,20+q*220*k,0,6.3);c.stroke();}}
  c.globalAlpha=1;};};
FXS.disc=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,Ds=Array.from({length:14},(_,i)=>{const a=i/14*6.283+_fRn(-.2,.2),v=_fRn(260,620);return{vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,x:cx,y:cy,r:_fRn(26,50)*k,rot:_fR()*6,fl:_fR()*6,vf:_fRn(3,8),dl:.05+i*.07,s:0};});
  const disc=(c,x,y,r,tilt,rot)=>{c.save();c.translate(x,y);c.rotate(rot);c.scale(1,Math.max(.14,Math.abs(tilt)));
   let g;if(c.createConicGradient){g=c.createConicGradient(0,0,0);['#ff5ad0','#ffe05a','#5affc8','#5ab4ff','#c85aff','#ff5ad0'].forEach((cl,i)=>g.addColorStop(i/5,cl));}else{g='#bfe8ff';}
   c.fillStyle=g;c.strokeStyle='#000';c.lineWidth=2.4;c.beginPath();c.arc(0,0,r,0,6.3);c.arc(0,0,r*.18,0,6.3,true);c.fill('evenodd');c.stroke();
   c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.moveTo(0,0);c.arc(0,0,r*.92,-.5,.1);c.closePath();c.fill();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=1.4;c.beginPath();c.arc(0,0,r*.5,0,6.3);c.stroke();c.restore();};
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='lighter';
  const sw=_fSm(0,.5,t),by=cy-80*k+sw*160*k;c.globalAlpha=.7*fade*(1-_fSm(.5,.7,t));c.fillStyle='#9ae4ff';c.fillRect(0,by,W,3*k);fxGlow(c,W*sw,by,50*k,'#ffffff',.8*fade*(1-_fSm(.5,.7,t)));
  c.globalCompositeOperation='source-over';
  for(const d of Ds){const q=t-d.dl;if(q<0)continue;const e=Math.min(1,q*3);d.x+=d.vx*dt;d.y+=d.vy*dt;d.vy+=60*dt;d.fl+=d.vf*dt;d.rot+=dt*.8;c.globalAlpha=fade*Math.min(1,q*5);disc(c,d.x,d.y,d.r*(.5+.5*e),Math.cos(d.fl),d.rot);}
  c.globalCompositeOperation='lighter';for(const d of Ds){if(t>d.dl&&Math.sin(t*9+d.fl)>.9)fxFlare(c,d.x+d.r*.4,d.y-d.r*.2,22*k,'#ffffff',fade);}
  c.globalAlpha=1;};};
FXS.gravflip=(W,H,D)=>{const k=Math.min(W,H)/600,flipT=.6,P=Array.from({length:110},()=>({x:_fR()*W,y:_fR()*H,vy:_fRn(200,700)*k,sh:_fR()<.35,s:_fRn(4,12)*k,r:_fR()*6,vr:_fRn(-5,5)}));
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t),dir=t<flipT?1:-1;c.globalCompositeOperation='lighter';
  for(const p of P){p.vy+=dir*1900*k*dt;p.vy*=Math.pow(.55,dt);p.y+=p.vy*dt;if(p.y>H+40)p.y=-30;if(p.y<-40)p.y=H+30;p.r+=p.vr*dt;
   const len=Math.min(160*k,Math.abs(p.vy)*.07);c.globalAlpha=.6*fade;c.strokeStyle=dir>0?'#8ab8ff':'#ff9ad8';c.lineWidth=2;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x,p.y-Math.sign(p.vy)*len);c.stroke();
   c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=.9*fade;c.fillStyle=p.sh?'#e8e0ff':(dir>0?'#bcd8ff':'#ffc8ec');if(p.sh){c.beginPath();c.moveTo(0,-p.s);c.lineTo(p.s*.8,p.s*.6);c.lineTo(-p.s*.8,p.s*.6);c.fill();}else{c.beginPath();c.arc(0,0,p.s*.45,0,6.3);c.fill();}c.restore();}
  const q=(t-flipT)/.5;if(q>0&&q<1){c.globalAlpha=(1-q)*fade;c.strokeStyle='#fff';c.lineWidth=8*(1-q)+1;c.beginPath();c.arc(W/2,H*.46,q*Math.max(W,H)*.7,0,6.3);c.stroke();c.fillStyle='#fff';c.globalAlpha=(1-q)*.45*fade;c.fillRect(0,0,W,H);}
  c.globalCompositeOperation='source-over';c.globalAlpha=.7*fade;for(let i=0;i<6;i++){const x=W*(i+.5)/6,off=((t*260*k*dir)+i*140)%(H+80),y=dir>0?off:H-((off+H+80)%(H+80));c.fillStyle=dir>0?'rgba(120,160,255,.5)':'rgba(255,120,200,.5)';const s=22*k,d=dir>0?1:-1;c.beginPath();c.moveTo(x-s,y-d*s*.4);c.lineTo(x,y+d*s*.5);c.lineTo(x+s,y-d*s*.4);c.lineTo(x+s,y-d*s*.9);c.lineTo(x,y);c.lineTo(x-s,y-d*s*.9);c.fill();}
  c.globalAlpha=1;};};
FXS.cosmos=(W,H,D)=>{const cx=W/2,cy=H*.46,R=Math.max(W,H)*.75,k=Math.min(W,H)/600,St=Array.from({length:240},()=>({a:_fR()*6.283,r:Math.sqrt(_fR())*R,s:_fRn(1,3.2)*k,hue:_fRn(190,300)})),Ar=Array.from({length:3},(_,i)=>i*2.094),N2=Array.from({length:120},()=>({x:_fR()*W,y:_fR()*H*.8,tw:_fR()*9,s:_fRn(1,3)*k}));
  let ang=0,last=0;
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t);const w=.4+Math.pow(Math.min(t,1.3),3)*9;ang+=w*dt;c.globalCompositeOperation='lighter';
  if(t<1.55){const out=1-_fSm(1.3,1.55,t);
   c.globalAlpha=.5*out*fade;for(const a0 of Ar){c.strokeStyle='#b090ff';c.lineWidth=5*k;c.beginPath();for(let i=0;i<40;i++){const s=i/39,r=s*R*.8,aa=a0+ang*.6+s*3.2;const x=cx+Math.cos(aa)*r,y=cy+Math.sin(aa)*r*.6;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
   fxGlow(c,cx,cy,170*k,'#ffe0a0',.6*out*fade);
   for(const s of St){const a1=s.a+ang*(.6+.5*(1-s.r/R)),a0=a1-Math.min(.9,w*dt*6),x1=cx+Math.cos(a1)*s.r,y1=cy+Math.sin(a1)*s.r*.62,x0=cx+Math.cos(a0)*s.r,y0=cy+Math.sin(a0)*s.r*.62;c.globalAlpha=(.4+.6*(s.r/R))*out*fade;c.strokeStyle=`hsl(${s.hue+t*30},90%,${70+Math.min(20,w)}%)`;c.lineWidth=s.s;c.lineCap='round';c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();}}
  const bang=_fSm(1.2,1.6,t);if(bang>0){const f=(t-1.2)/.7;if(f<1){c.globalAlpha=Math.min(1,(1-f)*1.6)*fade;c.fillStyle='#fff';c.beginPath();c.arc(cx,cy,f*R*1.3,0,6.3);c.fill();}
   for(let j=0;j<3;j++){const q=(t-1.25-j*.12)/.7;if(q>0&&q<1){c.globalAlpha=(1-q)*fade;c.strokeStyle=['#ffe070','#ff8ad0','#7ae0ff'][j];c.lineWidth=7*(1-q)+1;c.beginPath();c.arc(cx,cy,q*R,0,6.3);c.stroke();}}}
  if(t>1.5){const d=_fSm(1.5,2.1,t);const g=c.createLinearGradient(0,H,0,H*.25);g.addColorStop(0,`rgba(255,200,110,${.7*d*fade})`);g.addColorStop(.5,`rgba(255,110,170,${.4*d*fade})`);g.addColorStop(1,'rgba(90,60,200,0)');c.globalAlpha=1;c.fillStyle=g;c.fillRect(0,H*.25,W,H*.75);fxGlow(c,cx,H*.9-d*H*.12,(120+d*90)*k,'#fff2c0',.9*d*fade);
   for(const s of N2){c.globalAlpha=d*fade*(.3+.7*Math.abs(Math.sin(t*3+s.tw)));c.fillStyle='#fff';c.beginPath();c.arc(s.x,s.y,s.s*.6,0,6.3);c.fill();}}
  c.globalAlpha=1;};};
// ---- 黄金の精神 第3弾：削り取る／ジッパー／氷のスーツ／ウイルス／磁力／天候／本／料理の治療 ----
function _flake(c,s){c.beginPath();for(let a=0;a<6;a++){c.save();c.rotate(a*Math.PI/3);c.moveTo(0,0);c.lineTo(0,-s);c.moveTo(0,-s*.55);c.lineTo(s*.3,-s*.8);c.moveTo(0,-s*.55);c.lineTo(-s*.3,-s*.8);c.restore();}c.stroke();}
function fxStartScene(el,id,D){const mk=FXS[id];if(!mk||(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches))return;const W=innerWidth,H=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5),cv=document.createElement('canvas');cv.width=W*dpr;cv.height=H*dpr;cv.style.cssText='position:absolute;inset:0;width:100%;height:100%';const c=cv.getContext('2d'),draw=mk(W,H,D),dim=el.querySelector('.cf-dim');if(dim)dim.after(cv);else el.prepend(cv);let last=performance.now(),t0=last;(function loop(now){if(!el.isConnected)return;const dt=Math.min(.05,(now-last)/1000);last=now;const t=(now-t0)/1000;c.setTransform(dpr,0,0,dpr,0,0);c.globalCompositeOperation='source-over';c.globalAlpha=1;c.shadowBlur=0;c.clearRect(0,0,W,H);try{draw(c,t,dt);}catch(e){if(!window.__fxe){window.__fxe=e.message;console.log("FXERR",id,e.message);}}requestAnimationFrame(loop);})(last);}
let _callFxTimer=null,_skipSnd='';
const CF_FLOWER='<div class="cf-flower"><svg viewBox="-100 -100 200 200"><defs><radialGradient id="cfp" cx=".5" cy=".2" r=".9"><stop offset="0" stop-color="#fff8d0" stop-opacity=".95"/><stop offset="1" stop-color="#ffc830" stop-opacity=".25"/></radialGradient></defs>'+
  [0,1,2,3,4,5].map(k=>`<ellipse cx="0" cy="-52" rx="19" ry="48" transform="rotate(${k*60})" fill="url(#cfp)" stroke="#fff4c0" stroke-width="1.2"/>`).join('')+'<circle r="10" fill="#fff8d0"/></svg></div>';
// 演出ごとのサウンド（中身は 15-fx-sounds.js）。専用の音がある演出は、標準のリーチ・ロン・上がりの音のかわりに鳴る
const FX_SOUND={};
function fxSoundOr(sty,fallback){
  if(sty&&sty.id!=='default'&&FX_SOUND[sty.id]&&typeof fxSoundPlay==='function'){if(soundEnabled)fxSoundPlay(sty.id);}else fallback();
}
function showCallFx(kind,name,sub,fx){
  const old=document.getElementById('call-fx');if(old)old.remove();clearTimeout(_callFxTimer);
  const ron=kind==='ron',win=kind==='win',isRb=win&&fx&&fx.win==='rainbow';let dur=ron?1.8:(win?(isRb?2.6:1.9):1.55);
  const sty=fxStyleOf(kind,fx),custom=sty.id!=='default',isSc=custom&&!!FXS[sty.id];if(isSc)dur+=.5;if(custom&&sty.dur)dur=sty.dur; // 演出ごとの長さ（addFx の dur）
  const el=document.createElement('div');
  el.id='call-fx';el.className=(ron?'cf-ron shake':(win?'cf-win':'cf-riichi'))+(custom?' fxc':'')+(isRb?' cf-rb':'');el.style.setProperty('--dur',dur+'s');
  if(custom){el.style.setProperty('--c1',sty.c1);el.style.setProperty('--c2',sty.c2);el.style.setProperty('--bg',sty.bg);el.style.setProperty('--dm',sty.dm);}
  let sparks='';
  for(let i=0;i<(ron?30:22);i++){const a=Math.random()*360,d=(ron?160:130)+Math.random()*(ron?260:200),s=(ron?4:3)+Math.random()*5;sparks+=`<i class="cf-spark" style="--a:${a.toFixed(0)}deg;--d:${d.toFixed(0)}px;--s:${s.toFixed(1)}px"></i>`;}
  el.innerHTML=`<div class="cf-dim"></div><div class="cf-rays"></div><div class="cf-band"></div><div class="cf-line"></div><div class="cf-line b"></div>
    ${ron?'<div class="cf-slash s1"></div><div class="cf-slash s2"></div>':''}${win&&!custom?CF_FLOWER:''}
    <div class="cf-text">${ron?'ロン！':(win?'上がり！':'リーチ！')}</div>
    <div class="cf-sub">${esc(name||'')}${sub?'　'+esc(sub):''}</div>
    <div class="cf-ring"></div><div class="cf-ring r2"></div>${sparks}<div class="cf-flash"></div>`;
  if(isRb){ // 本物の虹：7色の弧を左から描き、外側にうっすら副虹、足元に霧
    const cols=['#ff2a3a','#ff8a1a','#ffe21a','#34d84a','#22c8e8','#2a62ff','#9a3aff'];
    const arc=(r,w,c,i,cls)=>`<path class="${cls}" pathLength="1" style="--i:${i}" stroke="${c}" stroke-width="${w}" d="M${500-r},560 A${r},${r} 0 0 1 ${500+r},560"/>`;
    let main='',glow='',sec='';
    cols.forEach((c,i)=>{const r=430-i*17;main+=arc(r,19,c,i,'rb');glow+=arc(r,26,c,i,'rb');});
    [...cols].reverse().forEach((c,i)=>{sec+=arc(520+i*11,10,c,i,'rb rb2');});
    el.insertAdjacentHTML('beforeend',`<div class="cf-rainbow"><svg viewBox="0 0 1000 600" aria-hidden="true">
      <defs><filter id="rbBlur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.4"/></filter>
      <filter id="rbGlow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
      <filter id="rbSoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
      <radialGradient id="rbMist"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
      <g filter="url(#rbGlow)" opacity=".5" style="mix-blend-mode:screen">${glow}</g>
      <g filter="url(#rbSoft)">${sec}</g>
      <g filter="url(#rbBlur)" opacity=".88" style="mix-blend-mode:screen">${main}</g>
      <ellipse class="mist" cx="70" cy="565" rx="150" ry="55" fill="url(#rbMist)"/>
      <ellipse class="mist" cx="930" cy="565" rx="150" ry="55" fill="url(#rbMist)"/>
    </svg></div>`);
  }
  if(custom&&sty.g&&!isSc){ // 選んだ演出の飾り（炎・桜・雷など）
    let gl='';const n=ron?24:20;
    for(let i=0;i<n;i++){
      const g=sty.g[i%sty.g.length],s=(18+Math.random()*20).toFixed(0),r=(Math.random()*540-270).toFixed(0);
      if(sty.mode==='fall')gl+=`<i class="cf-glyph fall" style="--lx:${(Math.random()*100).toFixed(0)}%;--s:${s}px;--t:${(1.1+Math.random()*.9).toFixed(2)}s;--dl:${(.15+Math.random()*.8).toFixed(2)}s;--dx:${(Math.random()*160-80).toFixed(0)}px;--r:${r}deg">${g}</i>`;
      else{const a=Math.random()*Math.PI*2,d=130+Math.random()*(ron?280:220);gl+=`<i class="cf-glyph burst" style="--s:${s}px;--x:${(Math.cos(a)*d).toFixed(0)}px;--y:${(Math.sin(a)*d).toFixed(0)}px;--r:${r}deg">${g}</i>`;}
    }
    el.insertAdjacentHTML('beforeend',gl);
  }
  if(win&&!custom){ // 金の花びらが降る
    let f='';for(let i=0;i<26;i++){f+=`<i class="cf-petal-fall" style="--s:${(7+Math.random()*9).toFixed(0)}px;--x:${(Math.random()*100).toFixed(0)}%;--t:${(1.2+Math.random()*1).toFixed(2)}s;--dl:${(.25+Math.random()*.7).toFixed(2)}s;--dx:${(Math.random()*120-60).toFixed(0)}px;--r:${(Math.random()*540).toFixed(0)}deg"></i>`;}
    el.insertAdjacentHTML('beforeend',f);
  }
  document.body.appendChild(el);
  if(isSc)fxStartScene(el,sty.id,dur);
  if(ron){_skipSnd='ron';fxSoundOr(sty,()=>playSound('ron'));}
  else if(win){_skipSnd='win';fxSoundOr(sty,()=>playSound('win'));}
  else if(custom&&FX_SOUND[sty.id]&&typeof fxSoundPlay==='function'&&soundEnabled)fxSoundPlay(sty.id); // リーチは、呼び出し側の標準音に重ねて鳴らす
  _callFxTimer=setTimeout(()=>{el.remove();},dur*1000+50);
  return dur*1000;
}
function declareRiichi(){
  if(!G||G.phase!=='playing'||!G.useRiichi) return;
  const p=G.players[myOnlineIdx];
  if(p.riichi||G.turn!==myOnlineIdx||G.tphase!=='discard') return;
  const optR=G?.optRoles??null;
  let ok=false;
  p.hand.forEach((_,i)=>{if(isTenpai(p.hand.filter((_,j)=>j!==i),optR))ok=true;});
  if(!ok){toast('テンパイしていません');return;}
  p.riichi=true;
  playSound('riichi');
  showCallFx('riichi',p.name,undefined,myFxPayload());
  if(onlineMode) socket?.emit('riichi',{code:currentCode});
  showRiichiBtn(false);
  const chatLog=document.getElementById(onlineMode?'chat-log':'bot-chat-log');
  if(chatLog){
    const div=document.createElement('div');
    div.className='chat-msg mine';
    div.innerHTML=`<div class="chat-name">${esc(p.name)}</div>🀄 リーチ！`;
    chatLog.appendChild(div);chatLog.scrollTop=chatLog.scrollHeight;
  }
  toast('🀄 リーチ宣言！手牌が固定されます');
  render();
}
// ロンの得点移動: 捨てた人から奪う。持ち点が足りなければ奪えるだけ奪う（0点なら何も奪えない）
function applyRonScoreTransfer(winner, discarder, amount){
  const taken = Math.max(0, Math.min(amount, discarder.score));
  winner.score += taken;
  discarder.score -= taken;
  return taken;
}
// 複数人が同時にロン可能な場合、捨てた人から時計回りで一番近い1人だけが有効
function pickRonWinnerIdx(discardedByIdx, discardedTile, optR){
  const n = G.players.length;
  let bestIdx = -1, bestDist = Infinity;
  G.players.forEach((pl, i) => {
    if (i === discardedByIdx) return;
    if (pl.isBot && G.useRiichi && !pl.riichi) return; // ボットはリーチ中のみ自動ロン
    if (!canRon(pl.hand, discardedTile, optR)) return;
    const dist = (i - discardedByIdx + n) % n;
    if (dist < bestDist) { bestDist = dist; bestIdx = i; }
  });
  return bestIdx;
}
// ロンで終わったラウンドの記録（履歴・実績・花びら）
function finishBotRoundStats(wi,role,bonus,pts,ron,riichi){
  saveHistory(makeHistoryEntry(wi===myOnlineIdx,role,pts+bonus,false,G.players.map(p=>p.name)));
  const newAch=checkAchievements(wi===myOnlineIdx,{role,bonus,ron,riichi:!!riichi,online:false,diff:(G.players.find(p=>p.isBot)||{}).diff,total:pts+bonus});
  botGamePetals(wi,newAch.length*5);
  return newAch;
}
function declareRon(){
  if(!G||G.phase!=='playing'||!_ronPending) return;
  const p=G.players[myOnlineIdx];
  const {tile,discardedByIdx}=_ronPending;
  const optR=G?.optRoles??null;
  if(!canRon(p.hand,tile,optR)){toast('ロンできません');clearRonWindow();return;}
  clearRonWindow();
  if(onlineMode){socket?.emit('ron_declare',{code:currentCode});return;}
  // ボット対戦ロン処理
  const found=findRonWin(p.hand,tile,optR);
  if(!found)return;
  const {res,hand:hand6}=found;
  const bonus=(res.noBonus?0:countZorome(hand6))+(p.riichi?1:0);
  const discarder=G.players[discardedByIdx];
  res.ron=true;res.ronFrom=discarder.name;
  p.hand=hand6;
  const taken=applyRonScoreTransfer(p,discarder,res.pts+bonus);
  // 実際に奪えた額に表示を合わせる（ボーナス分から先に削る）
  res.bonus=Math.max(0,bonus-((res.pts+bonus)-taken));
  res.pts=taken-res.bonus;
  G.phase='roundEnd';
  const _achRon=finishBotRoundStats(myOnlineIdx,res.role,res.bonus,res.pts,true,p.riichi);
  if(_achRon.length)setTimeout(()=>showAchievementPopup(_achRon),900);
  launchConfetti();
  const tsuideList=[];
  G.players.forEach((pl,i)=>{
    if(i===myOnlineIdx||i===discardedByIdx)return;
    const tr=checkTsuide(pl.hand,G.field,optR,pl.riichi);
    if(tr){pl.score+=tr.total;tsuideList.push({name:pl.name,role:tr.role,pts:tr.pts,bonus:tr.bonus,total:tr.total});}
  });
  const _fxMs=showCallFx('ron',p.name,discarder.name+' の牌',fxOfPlayer(p));
  setTimeout(()=>showWinModal(p,res,tsuideList),_fxMs-150);
}
function checkBotRon(discardedByIdx){
  if(!G||onlineMode||(!G.useRiichi&&!G.useRon)) return false;
  if(!G.useRon) return false;
  const optR=G?.optRoles??null;
  const discardedTile=G.field.filter(t=>t.discarded).slice(-1)[0];
  if(!discardedTile) return false;
  const winnerIdx=pickRonWinnerIdx(discardedByIdx,discardedTile,optR);
  if(winnerIdx===-1) return false;
  if(winnerIdx===myOnlineIdx){
    openRonWindow(discardedTile,discardedByIdx,()=>nextTurn());
    return true;
  }
  // ボット自動ロン（時計回りで最優先の1人だけ）
  const pl=G.players[winnerIdx];
  setTimeout(()=>{
    if(!G||G.phase!=='playing') return;
    const found=findRonWin(pl.hand,discardedTile,optR);
    if(!found)return;
    const {res,hand:hand6}=found;
    const bonus=(res.noBonus?0:countZorome(hand6))+(pl.riichi?1:0);
    const discarder=G.players[discardedByIdx];
    res.ron=true;res.ronFrom=discarder.name;
    pl.hand=hand6;
    const taken=applyRonScoreTransfer(pl,discarder,res.pts+bonus);
    res.bonus=Math.max(0,bonus-((res.pts+bonus)-taken));
    res.pts=taken-res.bonus;
    G.phase='roundEnd';
    const _achRonB=finishBotRoundStats(winnerIdx,res.role,res.bonus,res.pts,true,pl.riichi);
    if(_achRonB.length)setTimeout(()=>showAchievementPopup(_achRonB),900);
    const tsuideList=[];
    G.players.forEach((p2,j)=>{
      if(j===winnerIdx||j===discardedByIdx)return;
      const tr=checkTsuide(p2.hand,G.field,optR,p2.riichi);
      if(tr){p2.score+=tr.total;tsuideList.push({name:p2.name,role:tr.role,pts:tr.pts,bonus:tr.bonus,total:tr.total});}
    });
    const _fxMsB=showCallFx('ron',pl.name,discarder.name+' の牌',fxOfPlayer(pl));
    setTimeout(()=>showWinModal(pl,res,tsuideList),_fxMsB-150);
  },800);
  return true;
}
function checkTsuide(hand5,field,optR,riichi){
  if(hand5.length!==5)return null;
  const discards=field.filter(t=>t.discarded);
  let bestRes=null,bestPts=-1;
  discards.forEach(t=>{
    const found=findRonWin(hand5,t,optR,true); // ついでに完成でのみ三色を許可
    if(found&&found.res.pts>bestPts){
      bestPts=found.res.pts;
      const bonus=(found.res.noBonus?0:countZorome(found.hand))+(riichi?1:0);
      bestRes={role:found.res.role,pts:found.res.pts,bonus,total:found.res.pts+bonus};
    }
  });
  return bestRes;
}
function getOptRoles(prefix){
  return['三対','三色','輝光','無双'].filter(r=>{
    const el=document.getElementById(prefix+r);
    return !el||el.checked;
  });
}
// ============================================================

// ボット対戦

// ============================================================

function startGame(opts){

const quick=!!(opts&&opts.quick); // クイックマッチで人が見つからなかったときのCPU戦
const name=document.getElementById('pname').value.trim()||'プレイヤー';

const bcnt=quick?1:parseInt(document.getElementById('bcnt').value),bdiff=quick?'normal':document.getElementById('bdiff').value;

const players=[{name,hand:[],score:0,isBot:false,riichi:false}];

for(let i=0;i<bcnt;i++)players.push({name:(opts&&opts.botName)||BNAMES[i],hand:[],score:0,isBot:true,diff:bdiff,riichi:false,fieldBg:(opts&&opts.botBg)||'',avatar:(opts&&opts.botAvatar)||''});

const useRiichi=quick?false:(document.getElementById('bot-opt-リーチ')?.checked||false);
const useRon=quick?false:(document.getElementById('bot-opt-ロン')?.checked||false);
G = {players, field:[], turn:0, tphase:'pick', selIdx:-1, phase:'playing', optRoles: quick?[]:getOptRoles('bot-opt-'), useRiichi, useRon};
if(quick)G.quickBot=true; // クイックマッチと同じルール（基本役のみ・リーチなし・ロンなし）

myOnlineIdx=0;onlineMode=false;currentCode='';

matchFoundFx(G.players.map((p,i)=>({name:p.name,avatar:i===0?myAvatarUrl():(p.avatar||''),title:i===0?myTitleId():(quick?'':(BOT_TITLE_BY_DIFF[p.diff]||''))})),0,quick?'対戦相手が見つかりました！':'対戦開始！'); // 場が見える前に紹介画面で覆う
warmFieldBgs(); // 紹介画面のあいだに、場の背景を読み込んでおく
dealRound();showScreen('game');render();
document.getElementById('bot-chat-toggle').style.display='flex';
document.getElementById('bot-chat-log').innerHTML='';
botChatUnread=0;botChatOpen=false;
document.getElementById('bot-chat-wrap').style.display='none';
const _startBot=G.players.find(p=>p.isBot);
if(_startBot)setTimeout(()=>addBotChatMsg(_startBot.name,
  ['よろしく！','さあ始めよう！','負けないよ！','楽しもう！'][Math.floor(Math.random()*4)],false),600);
if(G.players[G.turn].isBot)scheduleBot();

}

function dealRound(){G._rk=(G._rk||0)+1;if(!G._gid)G._gid=Date.now()%1e9;const deck=makeDeck();let idx=0;G.players.forEach(p=>{p.hand=deck.slice(idx,idx+5);idx+=5;});G.field=deck.slice(idx);G.players.forEach(p=>{p.lastDiscardId=null;});G.turn=0;G.tphase='pick';G.selIdx=-1;G.phase='playing';setTimeout(animateFieldTiles,50);updateFieldBgForTurn();}
