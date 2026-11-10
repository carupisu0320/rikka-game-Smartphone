// ============================================================
// リアルな場の背景（SVGで描いた風景。外部画像なしで動く）
// ============================================================
function _rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
function _sceneUri(inner){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="800" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg).replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29');
}
// 山並み・稜線（中点変位法）
function _ridge(r,o){
  const levels=o.levels||7,n=(1<<levels)+1,h=new Array(n).fill(0),rough=o.rough||.55;
  h[0]=(r()-.5)*o.amp;h[n-1]=(r()-.5)*o.amp;
  let step=n-1,disp=o.amp;
  while(step>1){const half=step/2;for(let i=half;i<n;i+=step)h[i]=(h[i-half]+h[i+half])/2+(r()-.5)*2*disp;disp*=rough;step=half;}
  let top='';for(let i=0;i<n;i++)top+=`${i?'L':'M'}${(400*i/(n-1)).toFixed(1)} ${(o.base+h[i]).toFixed(1)}`;
  return {fill:`${top}L400 ${o.bottom||800}L0 ${o.bottom||800}Z`,line:top};
}
// 滑らかな砂丘・雪丘
function _dune(y,amp,ph){
  let top='';for(let x=0;x<=400;x+=8){const yy=y+amp*Math.sin(x/70+ph)+amp*.5*Math.sin(x/33+ph*2)+amp*.25*Math.sin(x/17+ph*3);top+=`${x?'L':'M'}${x} ${yy.toFixed(1)}`;}
  return {fill:`${top}L400 800L0 800Z`,line:top};
}
// 木のシルエット（針葉樹の連なり）
function _pines(r,y,hMin,hMax,gap){
  let d=`M-20 800V${y}H420V800Z`,x=-10;
  while(x<410){const h=hMin+r()*(hMax-hMin),w=gap*(.9+r()*.7),c=x+w/2;
    for(let i=0;i<3;i++){const ay=y-h+i*h*.26,by=ay+h*.44,hw=w/2*(.42+.27*i);
      d+=`M${c.toFixed(1)} ${ay.toFixed(1)}L${(c+hw).toFixed(1)} ${by.toFixed(1)}L${(c-hw).toFixed(1)} ${by.toFixed(1)}Z`;}
    x+=w*(.55+r()*.3);}
  return d;
}
// 星（3段階の大きさ）
function _stars(r,y0,y1,n){
  const p=(k,sw,col,op)=>{let d='';for(let i=0;i<k;i++)d+=`M${(r()*400).toFixed(1)} ${(y0+r()*(y1-y0)).toFixed(1)}h.1`;return `<path d="${d}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}" fill="none"/>`;};
  return p(n,.9,'#fff',.55)+p(Math.round(n/5),1.5,'#dbe6ff',.8)+p(Math.max(2,Math.round(n/30)),2.5,'#fff',.95);
}
// 雲（ノイズで描く）。色rgbは0〜1、gain/biasで濃さと量を決める
function _cloudDef(id,freq,oct,seed,rgb,gain,bias){
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}"/><feColorMatrix values="0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} ${gain} 0 0 0 ${bias}"/></filter>`;
}
function _band(id,y0,y1,fa,fb){
  return `<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="${fa}" stop-color="#fff"/><stop offset="${fb}" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="800"><rect y="${y0}" width="400" height="${y1-y0}" fill="url(#${id}g)"/></mask>`;
}
const _glow=(id,c1,c2)=>`<radialGradient id="${id}"><stop offset="0" stop-color="${c1}" stop-opacity=".95"/><stop offset=".25" stop-color="${c2}" stop-opacity=".5"/><stop offset="1" stop-color="${c2}" stop-opacity="0"/></radialGradient>`;
const _vgrad=(id,stops)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a!==undefined?` stop-opacity="${a}"`:''}/>`).join('')}</linearGradient>`;

const LOBBY_SCENES={
  // 夕焼けの海
  sunset(){const r=_rng(11),hy=500;
    let bars='';for(let i=0;i<44;i++){const w=(8+i*1.7)*(.6+r()*.8);bars+=`<rect x="${(250-w/2+(r()-.5)*12).toFixed(1)}" y="${(hy+4+i*5.4).toFixed(1)}" width="${w.toFixed(1)}" height="1.7" fill="#ffd890" opacity="${(.85-i*.017).toFixed(2)}"/>`;}
    return `<defs>${_vgrad('sk',[[0,'#1a1038'],[.26,'#5a2a5a'],[.46,'#d8604a'],[.58,'#ffb060'],[.64,'#ffe2a8']])}${_vgrad('sea',[[0,'#f0a050'],[.12,'#9a4050'],[1,'#180e2e']])}${_glow('sg','#fff6d0','#ff9040')}
      ${_cloudDef('c1','0.004 0.02',4,3,[1,.55,.42],2.8,-1.12)}${_cloudDef('c2','0.006 0.028',4,8,[.4,.16,.36],2.5,-1.0)}${_band('m1',100,520,.3,.75)}${_cloudDef('rp','0.012 0.24',3,5,[0,0,.1],1.5,-.45)}${_band('m2',500,800,.05,.5)}</defs>
      <rect width="400" height="800" fill="url(#sk)"/><circle cx="250" cy="${hy-10}" r="270" fill="url(#sg)"/>
      <rect width="400" height="800" filter="url(#c2)" mask="url(#m1)" opacity=".9"/><rect width="400" height="800" filter="url(#c1)" mask="url(#m1)" opacity=".9"/>
      <circle cx="250" cy="${hy-20}" r="30" fill="#fff4c8"/><rect y="${hy}" width="400" height="300" fill="url(#sea)"/>${bars}
      <rect width="400" height="800" filter="url(#rp)" mask="url(#m2)" opacity=".7"/><path d="${_ridge(r,{base:hy-4,amp:7,levels:6,bottom:hy}).fill}" fill="#26103a" transform="translate(-80 0) scale(.5 1)"/>`;},
  // 深海
  ocean(){const r=_rng(12);
    let rays='';for(let i=0;i<6;i++){const x=40+i*62+r()*30,w=18+r()*30;rays+=`<polygon points="${x},-20 ${x+w},-20 ${x+w*3.2-60},620 ${x-w*1.6-60},620" fill="url(#ray)" opacity="${(.35+r()*.4).toFixed(2)}"/>`;}
    let snow='';for(let i=0;i<150;i++)snow+=`<circle cx="${(r()*400).toFixed(1)}" cy="${(r()*800).toFixed(1)}" r="${(.4+r()*1.5).toFixed(2)}" fill="#bfeaff" opacity="${(.15+r()*.45).toFixed(2)}"/>`;
    let fish='';for(let i=0;i<9;i++){const x=40+r()*320,y=380+r()*260,s=.6+r()*.9;fish+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})" fill="#031420" opacity="${(.45+r()*.4).toFixed(2)}"><ellipse rx="9" ry="3.2"/><path d="M8 0L15 -4V4Z"/></g>`;}
    return `<defs>${_vgrad('w',[[0,'#0a5a78'],[.25,'#06405e'],[.6,'#032a42'],[1,'#010a14']])}<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bff4ff" stop-opacity=".75"/><stop offset="1" stop-color="#5ac8e8" stop-opacity="0"/></linearGradient>
      <filter id="bl"><feGaussianBlur stdDeviation="7"/></filter>${_cloudDef('ca','0.018 0.03',3,4,[.7,.95,1],3.2,-1.3)}${_band('mc',0,420,.0,.4)}</defs>
      <rect width="400" height="800" fill="url(#w)"/><rect width="400" height="800" filter="url(#ca)" mask="url(#mc)" opacity=".3"/><g filter="url(#bl)">${rays}</g>${snow}${fish}
      <path d="${_ridge(r,{base:735,amp:38,rough:.62}).fill}" fill="#010d16"/><path d="${_ridge(r,{base:770,amp:20,rough:.6}).fill}" fill="#00060c"/>`;},
  // オーロラ
  aurora(){const r=_rng(13),hy=520;
    const cur=(y,amp,ph,w)=>{let top='',bot='';for(let x=0;x<=400;x+=10){top+=`${x?'L':'M'}${x} ${(y+amp*Math.sin(x/55+ph)+amp*.4*Math.sin(x/21+ph*2)).toFixed(1)}`;}
      for(let x=400;x>=0;x-=10)bot+=`L${x} ${(y+w+amp*.6*Math.sin(x/70+ph*1.3)).toFixed(1)}`;return top+bot+'Z';};
    const c1=cur(150,34,0,230),c2=cur(210,28,2,200),c3=cur(110,40,4,170);
    return `<defs>${_vgrad('sk',[[0,'#02040e'],[.5,'#06122a'],[1,'#0c2a3c']])}${_vgrad('au',[[0,'#7dffb4',0],[.18,'#58ffa0',.85],[.55,'#2ad8b0',.45],[1,'#7a50ff',0]])}${_vgrad('au2',[[0,'#d070ff',0],[.2,'#b060ff',.6],[.6,'#40c0ff',.35],[1,'#40c0ff',0]])}
      <filter id="b1"><feGaussianBlur stdDeviation="5"/></filter><filter id="b2"><feGaussianBlur stdDeviation="1.5"/></filter>
      <filter id="ry" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.09 0.004" numOctaves="3" seed="6"/><feColorMatrix values="0 0 0 0 .6 0 0 0 0 1 0 0 0 0 .8 2.4 0 0 0 -.9"/></filter>
      <mask id="mcur" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="800"><g filter="url(#b2)"><path d="${c1}" fill="#fff"/><path d="${c2}" fill="#fff" opacity=".8"/><path d="${c3}" fill="#fff" opacity=".7"/></g></mask>
      <clipPath id="lake"><rect y="${hy}" width="400" height="300"/></clipPath>
      <g id="sky"><rect width="400" height="${hy}" fill="url(#sk)"/>${_stars(r,0,hy,260)}
        <g filter="url(#b1)"><path d="${c1}" fill="url(#au)"/><path d="${c2}" fill="url(#au2)"/><path d="${c3}" fill="url(#au)" opacity=".8"/></g>
        <rect width="400" height="${hy}" filter="url(#ry)" mask="url(#mcur)" opacity=".85"/></g></defs>
      <use href="#sky"/><rect y="${hy}" width="400" height="300" fill="#04101c"/>
      <g clip-path="url(#lake)" opacity=".42"><use href="#sky" transform="translate(0 ${hy*2}) scale(1 -1)"/></g>
      <path d="${_ridge(r,{base:hy-18,amp:46,rough:.6,bottom:hy}).fill}" fill="#05101a"/><path d="${_ridge(r,{base:hy-6,amp:20,rough:.55,bottom:hy+2}).fill}" fill="#030a12"/>
      <rect y="${hy}" width="400" height="2" fill="#7affc0" opacity=".25"/>`;},
  // 朝霧の森
  forest(){const r=_rng(21);
    return `<defs>${_vgrad('sk',[[0,'#bcd2cc'],[.5,'#f2ecc8'],[.7,'#fff6d8']])}${_glow('sun','#fffbe0','#ffe9a0')}${_vgrad('fg',[[0,'#fff',0],[.5,'#f4f8f0',.55],[1,'#fff',0]])}
      <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c8" stop-opacity=".7"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></linearGradient><filter id="bl"><feGaussianBlur stdDeviation="6"/></filter></defs>
      <rect width="400" height="800" fill="url(#sk)"/><circle cx="60" cy="40" r="260" fill="url(#sun)"/>
      <path d="${_pines(r,470,40,90,13)}" fill="#a2b8ae" opacity=".7"/><rect y="400" width="400" height="140" fill="url(#fg)"/>
      <path d="${_pines(r,540,60,130,20)}" fill="#7a968a"/><rect y="460" width="400" height="150" fill="url(#fg)"/>
      <path d="${_pines(r,620,90,190,28)}" fill="#3e5e52"/><rect y="540" width="400" height="160" fill="url(#fg)" opacity=".8"/>
      <path d="${_pines(r,720,130,260,40)}" fill="#16342c"/><rect y="640" width="400" height="160" fill="url(#fg)" opacity=".6"/>
      <g filter="url(#bl)"><polygon points="40,-20 120,-20 360,820 220,820" fill="url(#ray)" opacity=".7"/><polygon points="130,-20 170,-20 400,700 330,760" fill="url(#ray)" opacity=".5"/><polygon points="-20,-20 30,-20 150,820 40,820" fill="url(#ray)" opacity=".55"/></g>
      <path d="M-10 800L-10 160L22 150L36 800Z" fill="#0a1c16"/><path d="M372 800L384 120L412 128L412 800Z" fill="#0a1c16"/>
      ${(()=>{let s='';for(let i=0;i<80;i++)s+=`<circle cx="${(r()*400).toFixed(0)}" cy="${(r()*700).toFixed(0)}" r="${(.5+r()*1.2).toFixed(1)}" fill="#fff8d0" opacity="${(.2+r()*.5).toFixed(2)}"/>`;return s;})()}`;},
  // 砂丘の夕景
  dunes(){const r=_rng(31),d1=_dune(470,12,.4),d2=_dune(545,24,1.6),d3=_dune(640,34,3),d4=_dune(735,42,4.4);
    return `<defs>${_vgrad('sk',[[0,'#2c2250'],[.3,'#b45a58'],[.5,'#ffa860'],[.58,'#ffdca0']])}${_glow('sg','#fff2c0','#ffa050')}
      ${[['a','#f0a868','#8a4a48'],['b','#e0905a','#6a3a42'],['c','#c47450','#4a2a3a'],['d','#9a5a44','#2a1a2c']].map(([i,a,b])=>`<linearGradient id="${i}" x1="0" y1="0" x2="1" y2=".2"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/></linearGradient>`).join('')}
      ${_cloudDef('rp','0.02 0.3',3,9,[0,0,0],1.4,-.5)}<mask id="mr" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="800"><path d="${d2.fill}" fill="#fff"/></mask>${_cloudDef('c1','0.005 0.03',3,2,[1,.7,.5],2.4,-1.05)}${_band('m1',120,480,.3,.7)}</defs>
      <rect width="400" height="800" fill="url(#sk)"/><circle cx="130" cy="440" r="250" fill="url(#sg)"/><rect width="400" height="800" filter="url(#c1)" mask="url(#m1)" opacity=".7"/><circle cx="130" cy="452" r="26" fill="#fff6d0"/>
      <path d="${d1.fill}" fill="url(#a)"/><path d="${d2.fill}" fill="url(#b)"/><path d="${d3.fill}" fill="url(#c)"/><path d="${d4.fill}" fill="url(#d)"/>
      <rect width="400" height="800" filter="url(#rp)" mask="url(#mr)" opacity=".5"/>
      ${[[d1,.55],[d2,.5],[d3,.45],[d4,.35]].map(([d,o])=>`<path d="${d.line}" fill="none" stroke="#ffd8a0" stroke-width="1.4" opacity="${o}"/>`).join('')}
      <rect y="440" width="400" height="60" fill="#ffc890" opacity=".14"/>`;},
  // 雪原の夜
  snowfield(){const r=_rng(41),d1=_dune(560,16,.8),d2=_dune(640,26,2.2),d3=_dune(735,34,3.6);
    let sp='';for(let i=0;i<160;i++)sp+=`<circle cx="${(r()*400).toFixed(0)}" cy="${(540+r()*260).toFixed(0)}" r="${(.4+r()*.9).toFixed(1)}" fill="#fff" opacity="${(.25+r()*.6).toFixed(2)}"/>`;
    return `<defs>${_vgrad('sk',[[0,'#03061a'],[.4,'#0c1a44'],[.7,'#26427e']])}${_glow('mg','#eaf2ff','#7aa0e8')}
      ${[['a','#cfdcf8','#5a74b0'],['b','#dfe9ff','#4a64a0'],['c','#eef4ff','#3a5290']].map(([i,a,b])=>`<linearGradient id="${i}" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`).join('')}
      ${_cloudDef('c1','0.005 0.03',4,5,[.6,.7,.95],2.2,-1.0)}${_band('m1',60,420,.3,.7)}${_cloudDef('dr','0.01 0.05',3,2,[.9,.95,1],2.4,-1.1)}${_band('m2',560,800,.1,.6)}</defs>
      <rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,520,240)}<circle cx="300" cy="170" r="150" fill="url(#mg)" opacity=".7"/><circle cx="300" cy="170" r="25" fill="#f4f8ff"/>
      <rect width="400" height="800" filter="url(#c1)" mask="url(#m1)" opacity=".6"/>
      <path d="${_pines(r,575,25,60,10)}" fill="#0a1634"/><path d="${d1.fill}" fill="url(#a)"/><path d="${_pines(r,640,40,80,16)}" fill="#08122a" opacity=".85"/><path d="${d2.fill}" fill="url(#b)"/><path d="${d3.fill}" fill="url(#c)"/>${sp}
      <rect width="400" height="800" filter="url(#dr)" mask="url(#m2)" opacity=".5"/>
      ${[d1,d2,d3].map(d=>`<path d="${d.line}" fill="none" stroke="#fff" stroke-width="1.2" opacity=".5"/>`).join('')}`;},
  // 蛍の夜
  fireflies(){const r=_rng(51),hy=520;
    let blades='';for(let i=0;i<90;i++){const x=r()*400,h=50+r()*190,b=(r()-.5)*70;blades+=`<path d="M${x.toFixed(0)} 810Q${(x+b*.4).toFixed(0)} ${(800-h*.6).toFixed(0)} ${(x+b).toFixed(0)} ${(800-h).toFixed(0)}" fill="none" stroke="#020a0a" stroke-width="${(1.3+r()*2.2).toFixed(1)}" stroke-linecap="round"/>`;}
    let ff='',rf='';for(let i=0;i<46;i++){const x=r()*400,y=300+r()*480,o=(.5+r()*.5).toFixed(2);ff+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(6+r()*7).toFixed(1)}" fill="url(#fg)" opacity="${o}"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.5" fill="#f6ffb8"/>`;
      if(y<hy-10)rf+=`<circle cx="${x.toFixed(0)}" cy="${(hy*2-y).toFixed(0)}" r="${(4+r()*5).toFixed(1)}" fill="url(#fg)" opacity=".28"/>`;}
    return `<defs>${_vgrad('sk',[[0,'#01070a'],[.55,'#05222a'],[.8,'#0a3a40']])}${_vgrad('rv',[[0,'#0a3a40'],[.4,'#04181e'],[1,'#010608']])}${_glow('mg','#bfe8ff','#4a90a8')}<radialGradient id="fg"><stop offset="0" stop-color="#e8ff90" stop-opacity=".95"/><stop offset=".3" stop-color="#b8f040" stop-opacity=".45"/><stop offset="1" stop-color="#b8f040" stop-opacity="0"/></radialGradient>
      ${_cloudDef('rp','0.01 0.18',3,7,[.5,.8,.9],1.6,-.55)}${_band('m2',520,800,.02,.6)}</defs>
      <rect width="400" height="${hy}" fill="url(#sk)"/>${_stars(r,0,380,120)}<circle cx="280" cy="200" r="120" fill="url(#mg)" opacity=".5"/><circle cx="280" cy="200" r="16" fill="#e8f6ff" opacity=".9"/>
      <path d="${_pines(r,hy,30,90,18)}" fill="#031418"/><path d="${_pines(r,hy+2,20,50,14)}" fill="#020c10"/>
      <rect y="${hy}" width="400" height="300" fill="url(#rv)"/><rect width="400" height="800" filter="url(#rp)" mask="url(#m2)" opacity=".65"/>
      <rect x="276" y="${hy+6}" width="8" height="150" fill="#cfeaff" opacity=".12"/>${rf}${blades}${ff}`;},
  // 山稜の朝焼け
  mountain(){const r=_rng(61),a=_ridge(r,{base:470,amp:46,rough:.6}),b=_ridge(r,{base:540,amp:60,rough:.58}),c=_ridge(r,{base:630,amp:70,rough:.58}),d=_ridge(r,{base:735,amp:56,rough:.6});
    return `<defs>${_vgrad('sk',[[0,'#26245a'],[.3,'#7a4a80'],[.5,'#f08a68'],[.6,'#ffcc90']])}${_glow('sg','#fff0c0','#ff9a60')}
      ${_cloudDef('c1','0.005 0.035',4,3,[1,.7,.62],2.5,-1.0)}${_band('m1',160,470,.3,.7)}${_cloudDef('c2','0.008 0.03',4,6,[1,.82,.8],2.6,-1.1)}${_band('mb',470,700,.2,.8)}</defs>
      <rect width="400" height="800" fill="url(#sk)"/><circle cx="210" cy="470" r="280" fill="url(#sg)"/><rect width="400" height="800" filter="url(#c1)" mask="url(#m1)" opacity=".75"/>
      <path d="${a.fill}" fill="#a2668e"/><path d="${a.line}" fill="none" stroke="#ffc8a0" stroke-width="1.3" opacity=".6"/>
      <path d="${b.fill}" fill="#74508a"/><rect width="400" height="800" filter="url(#c2)" mask="url(#mb)" opacity=".7"/><path d="${b.line}" fill="none" stroke="#ffb090" stroke-width="1.2" opacity=".45"/>
      <path d="${c.fill}" fill="#443468"/><rect width="400" height="800" filter="url(#c2)" mask="url(#mb)" opacity=".4" transform="translate(0 90)"/>
      <path d="${d.fill}" fill="#1c1236"/>
      ${[[90,300],[130,280],[160,310]].map(([x,y])=>`<path d="M${x} ${y}q4 -5 8 0q4 -5 8 0" fill="none" stroke="#2a1a3a" stroke-width="1.4"/>`).join('')}`;},
  // 月夜の海
  waves(){const r=_rng(71),hy=450;
    let bars='';for(let i=0;i<46;i++){const w=(6+i*1.8)*(.5+r()*.9);bars+=`<rect x="${(250-w/2+(r()-.5)*10).toFixed(1)}" y="${(hy+3+i*5.6).toFixed(1)}" width="${w.toFixed(1)}" height="1.6" fill="#d4e6ff" opacity="${(.8-i*.016).toFixed(2)}"/>`;}
    let foam='';for(let i=0;i<22;i++){const y=hy+40+r()*300,x=r()*380,w=10+r()*40;foam+=`<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="1.2" fill="#cfe0ff" opacity="${(.12+r()*.2).toFixed(2)}"/>`;}
    return `<defs>${_vgrad('sk',[[0,'#03050e'],[.4,'#0c1a3c'],[.57,'#24427a']])}${_vgrad('sea',[[0,'#1a3a6a'],[.25,'#0a1e44'],[1,'#02060e']])}${_glow('mg','#eef4ff','#7098e0')}
      ${_cloudDef('c1','0.006 0.03',4,4,[.18,.24,.42],2.6,-1.05)}${_band('m1',60,440,.2,.8)}${_cloudDef('c2','0.012 0.035',4,9,[.8,.88,1],2.2,-1.15)}${_band('m3',90,330,.25,.75)}${_cloudDef('wv','0.004 0.075',3,2,[.6,.75,1],2.0,-.85)}${_band('m2',450,800,.0,.5)}</defs>
      <rect width="400" height="${hy}" fill="url(#sk)"/>${_stars(r,0,380,200)}<circle cx="250" cy="230" r="190" fill="url(#mg)" opacity=".8"/>
      <rect width="400" height="800" filter="url(#c1)" mask="url(#m1)" opacity=".9"/><circle cx="250" cy="230" r="30" fill="#f4f8ff"/><rect width="400" height="800" filter="url(#c2)" mask="url(#m3)" opacity=".35"/>
      <rect y="${hy}" width="400" height="360" fill="url(#sea)"/><rect width="400" height="800" filter="url(#wv)" mask="url(#m2)" opacity=".55"/>${bars}${foam}
      <rect y="${hy}" width="400" height="1.5" fill="#6a90d0" opacity=".5"/>`;},
  // 夜桜
  sakuranight(){const r=_rng(81);
    const blossoms=(x0,y0,x1,y1,n,spread)=>{let s='';for(let i=0;i<n;i++){const t=r(),x=x0+(x1-x0)*t+(r()-.5)*spread,y=y0+(y1-y0)*t+(r()-.5)*spread;const c=['#ffd6e6','#ffc0d8','#ffe8f0','#ff9ec4'][Math.floor(r()*4)];
      s+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(3+r()*5).toFixed(1)}" fill="${c}" opacity="${(.6+r()*.4).toFixed(2)}"/>`;}return s;};
    let pet='';for(let i=0;i<46;i++)pet+=`<ellipse cx="${(r()*400).toFixed(0)}" cy="${(r()*800).toFixed(0)}" rx="${(2+r()*2.4).toFixed(1)}" ry="${(1.2+r()*1.2).toFixed(1)}" fill="#ffd0e2" opacity="${(.4+r()*.5).toFixed(2)}" transform="rotate(${(r()*180).toFixed(0)} ${(r()*400).toFixed(0)} ${(r()*800).toFixed(0)})"/>`;
    return `<defs>${_vgrad('sk',[[0,'#080614'],[.45,'#241638'],[.8,'#4a2a50']])}${_glow('mg','#fff0f4','#e8a0c8')}<filter id="bl"><feGaussianBlur stdDeviation="9"/></filter><filter id="b2"><feGaussianBlur stdDeviation="2"/></filter>
      <radialGradient id="ln"><stop offset="0" stop-color="#ffc070" stop-opacity=".9"/><stop offset="1" stop-color="#ff8a30" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,420,150)}<circle cx="110" cy="210" r="170" fill="url(#mg)" opacity=".6"/><circle cx="110" cy="210" r="34" fill="#fff6f2"/>
      <g stroke="#0c0610" stroke-linecap="round" fill="none"><path d="M420 40C330 60 270 90 210 150S110 260 60 300" stroke-width="12"/><path d="M300 78C290 130 310 170 290 230" stroke-width="6"/><path d="M200 156C180 200 190 250 160 290" stroke-width="5"/><path d="M420 330C360 340 320 380 270 440" stroke-width="10"/><path d="M340 352C350 400 330 440 340 500" stroke-width="5"/><path d="M-20 520C40 500 90 540 130 600" stroke-width="10"/></g>
      <g filter="url(#bl)" opacity=".7">${blossoms(380,50,70,300,26,40)}${blossoms(400,340,270,440,14,34)}</g>
      <g>${blossoms(380,50,70,300,70,46)}${blossoms(400,330,270,440,40,40)}${blossoms(-10,520,130,600,28,36)}</g>${pet}
      <path d="${_ridge(r,{base:735,amp:24,rough:.6}).fill}" fill="#0a0610"/><circle cx="80" cy="720" r="40" fill="url(#ln)"/><circle cx="318" cy="740" r="46" fill="url(#ln)"/><rect x="72" y="706" width="16" height="22" rx="4" fill="#ffb060"/><rect x="310" y="722" width="16" height="22" rx="4" fill="#ffb060"/>`;},
  // 星雲
  nebula(){const r=_rng(91);
    const nb=(id,f,seed,rgb,g,b)=>_cloudDef(id,f,5,seed,rgb,g,b);
    return `<defs><radialGradient id="bgc" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#1a0c30"/><stop offset="1" stop-color="#02010a"/></radialGradient>
      ${nb('n1','0.006 0.005',2,[.95,.2,.7],2.6,-1.05)}${nb('n2','0.009 0.006',7,[.2,.45,1],2.6,-1.05)}${nb('n3','0.012 0.01',4,[1,.55,.2],2.4,-1.1)}${nb('n4','0.008 0.008',9,[.1,.9,.8],2.2,-1.1)}
      <radialGradient id="mk1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="m1" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="800"><ellipse cx="190" cy="340" rx="230" ry="300" fill="url(#mk1)"/></mask>
      <mask id="m2" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="800"><ellipse cx="240" cy="520" rx="230" ry="260" fill="url(#mk1)"/></mask>${_glow('cg','#ffffff','#ffd0ff')}</defs>
      <rect width="400" height="800" fill="url(#bgc)"/><rect width="400" height="800" filter="url(#n1)" mask="url(#m1)" opacity=".85"/><rect width="400" height="800" filter="url(#n2)" mask="url(#m2)" opacity=".8"/>
      <rect width="400" height="800" filter="url(#n3)" mask="url(#m1)" opacity=".55"/><rect width="400" height="800" filter="url(#n4)" mask="url(#m2)" opacity=".45"/>
      ${_stars(r,0,800,520)}<circle cx="200" cy="360" r="46" fill="url(#cg)"/><path d="M200 300V420M140 360H260" stroke="#fff" stroke-width=".8" opacity=".7"/>`;},
  // 銀河
  galaxy(noArms){const r=_rng(101),cx=200,cy=400;
    const arm=(off,k,col,sw,op)=>{let d='';for(let i=0;i<k;i++){const t=r()*4.2,rad=26*Math.exp(.36*t)*(.8+r()*.4),a=t*1.35+off,sc=(r()+r()+r()-1.5)*rad*.22;
      const x=Math.cos(a)*rad+Math.cos(a+1.57)*sc,y=(Math.sin(a)*rad+Math.sin(a+1.57)*sc)*.52;const X=cx+x*Math.cos(-.5)-y*Math.sin(-.5),Y=cy+x*Math.sin(-.5)+y*Math.cos(-.5);d+=`M${X.toFixed(1)} ${Y.toFixed(1)}h.1`;}
      return `<path d="${d}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}" fill="none"/>`;};
    return `<defs><radialGradient id="bgc" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#0c0a22"/><stop offset="1" stop-color="#010108"/></radialGradient>${_glow('core','#fff6dc','#ffc880')}${_glow('halo','#9ab0ff','#4a50d0')}
      <filter id="bl"><feGaussianBlur stdDeviation="7"/></filter>${_cloudDef('ds','0.015 0.03',4,5,[0,0,0],3.2,-1.5)}<mask id="mk" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="800"><ellipse cx="${cx}" cy="${cy}" rx="190" ry="110" transform="rotate(-29 ${cx} ${cy})" fill="#fff"/></mask></defs>
      <rect width="400" height="800" fill="url(#bgc)"/>${_stars(r,0,800,440)}
      <g transform="rotate(-29 ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="200" ry="104" fill="url(#halo)" opacity=".55"/></g>
      ${noArms?'':`<g filter="url(#bl)" opacity=".8">${arm(0,160,'#8a9cff',9,.5)}${arm(Math.PI,160,'#a890ff',9,.5)}</g>
      ${arm(0,900,'#bcd0ff',1.3,.85)}${arm(Math.PI,900,'#d0c0ff',1.3,.85)}${arm(0,500,'#fff',.8,.9)}${arm(Math.PI,500,'#fff',.8,.9)}`}
      <rect width="400" height="800" filter="url(#ds)" mask="url(#mk)" opacity=".5"/>
      <g transform="rotate(-29 ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="110" ry="54" fill="url(#core)"/></g><circle cx="${cx}" cy="${cy}" r="10" fill="#fffbe8"/>`;},
};
// 期間限定ガチャの新背景
LOBBY_SCENES.lanterns=function(){const r=_rng(121);
  let ln='';for(let i=0;i<34;i++){const x=r()*400,y=60+r()*620,s=.5+r()*1.1;ln+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})" opacity="${(.55+r()*.45).toFixed(2)}"><circle r="26" fill="url(#lg)"/><rect x="-7" y="-9" width="14" height="18" rx="4" fill="#ffb050"/><rect x="-5" y="-7" width="10" height="14" rx="3" fill="#ffe2a0"/></g>`;}
  return `<defs>${_vgrad('sk',[[0,'#05061a'],[.55,'#1a1238'],[1,'#3a1c40']])}${_glow('lg','#ffd890','#ff8a30')}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,500,160)}${ln}<path d="${_ridge(r,{base:735,amp:28,rough:.6}).fill}" fill="#07040e"/>`;};
LOBBY_SCENES.redmoon=function(){const r=_rng(131);
  let cl='';for(let i=0;i<7;i++)cl+=`<ellipse cx="${(r()*400).toFixed(0)}" cy="${(180+r()*300).toFixed(0)}" rx="${(90+r()*120).toFixed(0)}" ry="${(10+r()*16).toFixed(0)}" fill="#12040a"/>`;
  return `<defs>${_vgrad('sk',[[0,'#0a0208'],[.5,'#2a0a14'],[.85,'#5a1418']])}${_glow('mg','#ff6a50','#c01820')}<filter id="bl"><feGaussianBlur stdDeviation="6"/></filter></defs>
    <rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,420,70)}<circle cx="260" cy="250" r="190" fill="url(#mg)" opacity=".8"/><circle cx="260" cy="250" r="62" fill="#ff5a48"/><circle cx="260" cy="250" r="62" fill="#ffd0b8" opacity=".22"/>
    <g filter="url(#bl)" opacity=".7">${cl}</g><path d="${_pines(r,770,70,130,34)}" fill="#050104"/>`;};
// ハロウィンイベントの背景
const _HAUNT_WIN=[[96,560],[128,560],[160,560],[250,540],[282,540],[190,470],[222,470],[88,640],[300,630]];
LOBBY_SCENES.pumpkinfield=function(){const r=_rng(141);
  let pk='';[[60,730,1.3],[330,720,1.2],[190,760,1.6],[110,690,.8],[280,690,.85],[24,770,1.0],[370,775,1.05],[235,720,.7]].forEach(([x,y,s])=>{
    pk+=`<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="24" ry="19" fill="#d65a08"/><ellipse rx="12" ry="19" fill="#ff8a20"/><rect x="-3" y="-27" width="6" height="10" rx="2" fill="#3a5a20"/><polygon points="-12,-4 -5,-4 -8.5,3" fill="#ffe070"/><polygon points="5,-4 12,-4 8.5,3" fill="#ffe070"/><path d="M-11 8l4 4 3-4 4 4 3-4 4 4 3-4" stroke="#ffe070" stroke-width="2.4" fill="none"/></g>`;});
  return `<defs>${_vgrad('sk',[[0,'#12062a'],[.55,'#3a1420'],[1,'#8a3a10']])}${_glow('mg','#ffb050','#ff6a10')}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,380,90)}
    <circle cx="270" cy="210" r="170" fill="url(#mg)" opacity=".55"/><circle cx="270" cy="210" r="56" fill="#ffb84a"/><circle cx="270" cy="210" r="56" fill="#fff0c0" opacity=".25"/>
    <path d="${_ridge(r,{base:650,amp:34,rough:.55}).fill}" fill="#14060a"/><path d="${_pines(r,660,60,120,36)}" fill="#0a0306"/><rect y="680" width="400" height="120" fill="#0e0508"/>${pk}`;};
LOBBY_SCENES.haunted=function(){const r=_rng(151);
  let win='';_HAUNT_WIN.forEach(([x,y])=>win+=`<rect x="${x}" y="${y}" width="16" height="22" rx="2" fill="#ffd060" opacity=".8"/>`);
  return `<defs>${_vgrad('sk',[[0,'#0a0620'],[.6,'#2a1450'],[1,'#4a2468']])}${_glow('mg','#e8e0ff','#8a78d0')}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,420,100)}
    <circle cx="90" cy="150" r="110" fill="url(#mg)" opacity=".45"/><circle cx="90" cy="150" r="42" fill="#f4f0ff"/>
    <g fill="#08040e"><rect x="70" y="500" width="260" height="240"/><polygon points="60,500 200,400 340,500"/><rect x="56" y="440" width="46" height="100"/><polygon points="50,440 79,392 108,440"/><rect x="300" y="450" width="40" height="90"/><polygon points="294,450 320,410 346,450"/><rect x="180" y="440" width="50" height="60"/><polygon points="176,440 205,400 234,440"/></g>${win}
    <path d="M360 800V620M360 680l-30-30M360 650l24-34M360 720l-34-22" stroke="#06020a" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="${_ridge(r,{base:748,amp:20,rough:.5}).fill}" fill="#06020a"/>`;};
// 季節イベント（クリスマス〜お月見）の動く背景
const _XMAS_TREES=[[70,600,1.5],[330,585,1.7],[200,660,1.1],[18,700,1.0],[388,695,1.0]];
const _XMAS_LIGHTS=(()=>{const o=[],off=[[-18,-30],[16,-22],[-28,0],[22,6],[-10,26],[30,34],[-34,40],[0,-60]];_XMAS_TREES.forEach(([x,y,s])=>off.forEach(([dx,dy])=>o.push([x+dx*s,y+dy*s])));return o;})();
const _FEST_LAMPS=[...Array(9)].map((_,i)=>[22+i*44,96+Math.sin(i/8*Math.PI)*40]).concat([...Array(8)].map((_,i)=>[44+i*44,205+Math.sin(i/7*Math.PI)*28]));
const _heartD=s=>`M0 ${.9*s}C${-1.3*s} ${.1*s} ${-.8*s} ${-.8*s} 0 ${-.3*s}C${.8*s} ${-.8*s} ${1.3*s} ${.1*s} 0 ${.9*s}Z`;
LOBBY_SCENES.xmasnight=function(){const r=_rng(161);let t='',l='';
  _XMAS_TREES.forEach(([x,y,s])=>{t+=`<g transform="translate(${x} ${y}) scale(${s})"><polygon points="0,-90 -34,-30 -22,-30 -44,10 -28,10 -52,52 52,52 28,10 44,10 22,-30 34,-30" fill="#0a2e1c"/><rect x="-6" y="52" width="12" height="14" fill="#2a1408"/><polygon points="0,-104 4,-93 15,-93 6,-86 9,-75 0,-82 -9,-75 -6,-86 -15,-93 -4,-93" fill="#ffd860"/></g>`;});
  _XMAS_LIGHTS.forEach(([x,y],i)=>l+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="2.6" fill="${['#ff5050','#ffd060','#60b0ff','#70e080'][i%4]}"/>`);
  return `<defs>${_vgrad('sk',[[0,'#050a24'],[.6,'#12285a'],[1,'#3a5088']])}${_glow('mg','#e8f0ff','#8aa8e8')}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,420,120)}
    <circle cx="300" cy="170" r="95" fill="url(#mg)" opacity=".45"/><circle cx="300" cy="170" r="32" fill="#f4f8ff"/>
    <path d="${_ridge(r,{base:640,amp:40,rough:.55}).fill}" fill="#c8d6f0"/><path d="${_ridge(r,{base:700,amp:24,rough:.5}).fill}" fill="#e8f0ff"/><rect y="760" width="400" height="40" fill="#e8f0ff"/>${t}${l}`;};
LOBBY_SCENES.newyearsun=function(){const r=_rng(171);let c='';for(let i=0;i<6;i++)c+=`<ellipse cx="${(r()*400).toFixed(0)}" cy="${(380+r()*160).toFixed(0)}" rx="${(70+r()*90).toFixed(0)}" ry="${(8+r()*10).toFixed(0)}" fill="#ffb060" opacity=".45"/>`;
  return `<defs>${_vgrad('sk',[[0,'#1a0a30'],[.4,'#8a2a40'],[.7,'#ff9a40'],[1,'#ffd870']])}${_glow('sg','#fff4c0','#ffb040')}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,260,60)}
    <circle cx="200" cy="560" r="230" fill="url(#sg)" opacity=".6"/><circle cx="200" cy="560" r="86" fill="#fff0b0"/>${c}
    <path d="${_ridge(r,{base:620,amp:46,rough:.5}).fill}" fill="#2a0e20"/><path d="${_pines(r,640,60,110,32)}" fill="#12060e"/><rect y="640" width="400" height="160" fill="#12060e"/>`;};
LOBBY_SCENES.heartnight=function(){const r=_rng(181);let b='',hs='';
  for(let i=0;i<30;i++)b+=`<circle cx="${(r()*400).toFixed(0)}" cy="${(r()*800).toFixed(0)}" r="${(6+r()*26).toFixed(0)}" fill="#ff7ab8" opacity="${(.05+r()*.12).toFixed(2)}"/>`;
  [[90,180,90],[320,300,70],[200,520,120],[60,640,60],[340,700,80]].forEach(([x,y,s])=>hs+=`<path transform="translate(${x} ${y})" d="${_heartD(s)}" fill="#ff80b8" opacity=".12"/>`);
  return `<defs>${_vgrad('sk',[[0,'#1c0838'],[.55,'#6a1a60'],[1,'#c0407a']])}${_glow('hg','#ff9ac8','#ff4090')}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,500,70)}${b}${hs}<circle cx="200" cy="720" r="260" fill="url(#hg)" opacity=".35"/>`;};
LOBBY_SCENES.sakurastorm=function(){const r=_rng(191);let bl='';
  for(let i=0;i<110;i++){const u=r(),x=-10+u*330,y=260-u*130+(r()-.5)*100;bl+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(8+r()*14).toFixed(0)}" fill="${['#ffb0d0','#ff90b8','#ffd0e0'][i%3]}" opacity="${(.55+r()*.35).toFixed(2)}"/>`;}
  return `<defs>${_vgrad('sk',[[0,'#3a1a50'],[.5,'#c0608a'],[1,'#ffc0a0']])}${_glow('sg','#ffe0d0','#ff90a0')}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,260,50)}
    <circle cx="300" cy="470" r="150" fill="url(#sg)" opacity=".5"/><circle cx="300" cy="470" r="46" fill="#fff0e8"/>
    <path d="M-10 270Q90 230 170 180T330 120M90 232Q120 300 110 360M200 168Q230 230 260 270" stroke="#2a0a18" stroke-width="11" stroke-linecap="round" fill="none"/>${bl}
    <path d="${_ridge(r,{base:690,amp:30,rough:.5}).fill}" fill="#3a1228"/><rect y="730" width="400" height="70" fill="#2a0a1c"/><ellipse cx="120" cy="750" rx="150" ry="9" fill="#ffb0d0" opacity=".5"/><ellipse cx="300" cy="768" rx="130" ry="8" fill="#ff90b8" opacity=".45"/>`;};
LOBBY_SCENES.milkyway=function(){const r=_rng(201);let bam='';
  [[40,0],[78,1],[112,2]].forEach(([x,k])=>{bam+=`<path d="M${x} 800Q${x+8} 600 ${x-6} ${380+k*30}" stroke="#14301e" stroke-width="7" fill="none"/>`;
    for(let j=0;j<5;j++){const y=450+j*60+k*20;bam+=`<path d="M${x-2} ${y}l32 -16M${x-2} ${y+8}l-28 -14" stroke="#1a4a2a" stroke-width="3" stroke-linecap="round"/><path d="M${x+26} ${y-12}v30" stroke="#caa" stroke-width=".8"/><rect x="${x+22}" y="${y+14}" width="9" height="30" fill="${['#ff7ab0','#ffd060','#70c8ff','#a0e080'][(j+k)%4]}"/>`;}});
  return `<defs>${_vgrad('sk',[[0,'#02030f'],[.5,'#0a1040'],[1,'#1a2a6a']])}<linearGradient id="mw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c8b8ff" stop-opacity="0"/><stop offset=".5" stop-color="#e0d8ff" stop-opacity=".6"/><stop offset="1" stop-color="#c8b8ff" stop-opacity="0"/></linearGradient><filter id="bl"><feGaussianBlur stdDeviation="14"/></filter></defs>
    <rect width="400" height="800" fill="url(#sk)"/><g transform="rotate(-30 200 300)" filter="url(#bl)"><ellipse cx="200" cy="300" rx="380" ry="60" fill="url(#mw)"/></g>${_stars(r,0,640,260)}${bam}<path d="${_ridge(r,{base:760,amp:22,rough:.5}).fill}" fill="#05060f"/>`;};
LOBBY_SCENES.festival=function(){const r=_rng(211);let lp='',st='';
  const row=(a)=>a.map(p=>p.map(v=>v.toFixed(0)).join(' ')).join('L');
  _FEST_LAMPS.forEach(([x,y])=>lp+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="10" ry="13" fill="#e8382a"/><rect x="${(x-6).toFixed(0)}" y="${(y-14).toFixed(0)}" width="12" height="3" fill="#2a0808"/>`);
  [[30,640,120],[200,630,150],[350,645,110]].forEach(([x,y,w])=>st+=`<rect x="${x-w/2}" y="${y}" width="${w}" height="130" fill="#12060a"/><polygon points="${x-w/2-8},${y} ${x+w/2+8},${y} ${x+w/2-6},${y-34} ${x-w/2+6},${y-34}" fill="#c02828"/><rect x="${x-w/2+10}" y="${y+16}" width="${w-20}" height="34" fill="#ffb050" opacity=".75"/>`);
  return `<defs>${_vgrad('sk',[[0,'#0a0620'],[.6,'#201040'],[1,'#4a1a50']])}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,420,90)}
    <path d="M${row(_FEST_LAMPS.slice(0,9))}" stroke="#1a0a0a" stroke-width="1.5" fill="none"/><path d="M${row(_FEST_LAMPS.slice(9))}" stroke="#1a0a0a" stroke-width="1.5" fill="none"/>${lp}<rect y="770" width="400" height="30" fill="#0a0408"/>${st}`;};
LOBBY_SCENES.moonviewing=function(){const r=_rng(221);
  return `<defs>${_vgrad('sk',[[0,'#0a1030'],[.6,'#1e2a5a'],[1,'#3a4a78']])}${_glow('mg','#fff4c8','#c8b878')}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,520,110)}
    <circle cx="200" cy="280" r="190" fill="url(#mg)" opacity=".5"/><circle cx="200" cy="280" r="120" fill="#fff4c8"/><circle cx="170" cy="250" r="22" fill="#e8dca8" opacity=".5"/><circle cx="235" cy="300" r="30" fill="#e8dca8" opacity=".45"/><circle cx="210" cy="226" r="12" fill="#e8dca8" opacity=".5"/><circle cx="160" cy="320" r="14" fill="#e8dca8" opacity=".45"/>
    <path d="${_ridge(r,{base:640,amp:46,rough:.5}).fill}" fill="#0e1430"/><path d="${_ridge(r,{base:710,amp:24,rough:.5}).fill}" fill="#070a1a"/><rect y="740" width="400" height="60" fill="#070a1a"/>`;};
LOBBY_SCENES.galaxybase=()=>LOBBY_SCENES.galaxy(true);
const _sceneCache={};
function sceneUri(name){return _sceneCache[name]||(_sceneCache[name]=_sceneUri(LOBBY_SCENES[name]()));}

// 画面の形（縦長・横長）で見える範囲が変わるので、各風景の「見せたい高さ」を決めておく（%）
// ===== 黄金の精神の背景（リアル調・動く）。横長の画面でも見えるよう、見せ場を高さ340〜470の帯に集めている =====
const _bf=`<filter id="b2"><feGaussianBlur stdDeviation="2"/></filter><filter id="b6"><feGaussianBlur stdDeviation="6"/></filter><filter id="b14" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter><filter id="tb" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".011 .028" numOctaves="4" seed="5"/><feColorMatrix values="0 0 0 0 .8 0 0 0 0 .7 0 0 0 0 1 0 0 0 1.6 -.55"/></filter>`;
const _bld=(r,y0,y1,col,win,n,wmin,wmax)=>{let o='';let x=-10;while(x<410){const w=wmin+r()*(wmax-wmin),h=(y1-y0)*(.35+r()*.65);o+=`<rect x="${x.toFixed(0)}" y="${(y1-h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${col}"/>`;if(win)for(let k=0;k<n;k++){if(r()<.5)o+=`<rect x="${(x+3+r()*(w-8)).toFixed(0)}" y="${(y1-h+4+r()*(h-10)).toFixed(0)}" width="3" height="4" fill="${win}" opacity="${(.4+r()*.6).toFixed(2)}"/>`;}x+=w+r()*3;}return o;};
const _gs=(id,stops)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
LOBBY_SCENES.redray=function(){const r=_rng(301);let cr='';for(let s=-1;s<=1;s+=2)for(let i=0;i<5;i++){let x=200,y=444,d='M200 444';for(let j=0;j<7;j++){x+=s*(14+r()*26);y=444+r()*14;d+=`L${x.toFixed(0)} ${y.toFixed(0)}`;}cr+=`<path d="${d}" stroke="#ff7a30" stroke-width="2" fill="none" opacity=".85"/>`;}
  return `<defs>${_bf}${_gs('sk',[[0,'#04050c'],[.4,'#0c0810'],[.52,'#3a1010'],[.553,'#8a2a14'],[.554,'#0c0608'],[1,'#050203']])}${_glow('gi','#fff4d0','#ff4a1a')}</defs><rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,330,90)}
<path d="M0 442V418L26 404L58 420L96 398L140 424L180 436L220 436L262 420L304 400L346 422L386 408L400 416V442Z" fill="#0a0507"/>
<g filter="url(#b14)" opacity=".9"><path d="M110 296L200 440" stroke="#ff2020" stroke-width="18"/><path d="M290 296L200 440" stroke="#ff2020" stroke-width="18"/></g><path d="M110 296L200 440M290 296L200 440" stroke="#ff5a50" stroke-width="6"/><path d="M110 296L200 440M290 296L200 440" stroke="#fff" stroke-width="2"/>
<ellipse cx="200" cy="444" rx="210" ry="22" fill="url(#gi)"/><circle cx="200" cy="440" r="95" fill="url(#gi)"/><g filter="url(#b2)">${cr}</g><ellipse cx="200" cy="400" rx="46" ry="60" fill="#30140e" opacity=".5" filter="url(#b14)"/><rect y="446" width="400" height="354" fill="#070304"/>`;};
LOBBY_SCENES.lightblade=function(){const r=_rng(311);let rb='',fc='';for(let i=0;i<30;i++){const x=i*13.5;rb+=`<path d="M392 338L${x.toFixed(0)} 472" stroke="hsl(${(i*12)%360},100%,66%)" stroke-width="${(1+r()*4).toFixed(1)}" opacity="${(.14+r()*.3).toFixed(2)}"/>`;}
  for(let i=0;i<12;i++){const x=r()*350,w=24+r()*50,h=26+r()*46,y=470-h;fc+=`<path d="M${x.toFixed(0)} 470L${(x+w*.3).toFixed(0)} ${y.toFixed(0)}L${(x+w).toFixed(0)} ${(y+h*.3).toFixed(0)}L${(x+w*.85).toFixed(0)} 470Z" fill="url(#cf)" opacity="${(.3+r()*.5).toFixed(2)}" stroke="#d8f6ff" stroke-width="1.2"/>`;}
  return `<defs>${_bf}${_gs('sk',[[0,'#020a16'],[.5,'#06324e'],[1,'#021622']])}<linearGradient id="cf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#7ae0ff" stop-opacity=".35"/><stop offset="1" stop-color="#2a6aa8" stop-opacity=".6"/></linearGradient>${_glow('gw','#fff','#9aeaff')}</defs><rect width="400" height="800" fill="url(#sk)"/><g filter="url(#b2)">${rb}</g>${fc}
<path d="M0 466L392 330L398 344L10 476Z" fill="#f4fdff"/><g filter="url(#b6)" opacity=".85"><path d="M0 470L396 336" stroke="#9aeaff" stroke-width="14"/></g><circle cx="392" cy="338" r="90" fill="url(#gw)"/><rect y="472" width="400" height="328" fill="#031a2a" opacity=".85"/>`;};
LOBBY_SCENES.chrono=function(){const r=_rng(321);let cr='',dr='';for(let i=0;i<20;i++){let a=i/20*6.283+r()*.2,x=200,y=405,d='M200 405';for(let j=0;j<8;j++){a+=(r()-.5)*.6;x+=Math.cos(a)*50;y+=Math.sin(a)*30;d+=`L${x.toFixed(0)} ${y.toFixed(0)}`;}cr+=`<path d="${d}" stroke="#e8f6ff" stroke-width="${(.8+r()*2).toFixed(1)}" fill="none" opacity=".8"/>`;}
  for(let i=0;i<120;i++){const x=r()*400,y=300+r()*170,l=6+r()*12;dr+=`<path d="M${x.toFixed(0)} ${y.toFixed(0)}v${l.toFixed(0)}" stroke="#d0e8ff" stroke-width="${(.8+r()*1.2).toFixed(1)}" opacity="${(.3+r()*.5).toFixed(2)}" stroke-linecap="round"/><circle cx="${x.toFixed(0)}" cy="${(y+l).toFixed(0)}" r="${(1+r()*1.4).toFixed(1)}" fill="#f4faff" opacity=".8"/>`;}
  return `<defs>${_bf}${_gs('sk',[[0,'#0c1622'],[.5,'#3a5470'],[.59,'#8aa4bc'],[.6,'#40607a'],[1,'#0a1420']])}${_glow('gc','#fff','#bfe0ff')}</defs><rect width="400" height="800" fill="url(#sk)"/><circle cx="200" cy="405" r="120" fill="url(#gc)" opacity=".55"/><circle cx="200" cy="395" r="58" fill="none" stroke="#e8f4ff" stroke-width="2" opacity=".5"/><path d="M200 395V362M200 395L222 408" stroke="#e8f4ff" stroke-width="3" opacity=".6"/>
${_bld(r,350,470,'#142230','#bfe0ff',3,24,46)}${_bld(r,390,470,'#0c1722','#8ac8ff',2,28,50)}<g opacity=".35" transform="translate(0 940) scale(1 -1)">${_bld(_rng(2),390,470,'#8ab4d8','#e8f6ff',2,28,50)}</g>${dr}<g filter="url(#b2)">${cr}</g>`;};
LOBBY_SCENES.tankbomb=function(){const r=_rng(331);const tk=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="#4a3a26" stroke="#ffc070" stroke-width="1.3"><rect x="-20" y="2" width="40" height="9" rx="4.5" fill="#2a2018"/><rect x="-16" y="-7" width="32" height="11"/><rect x="-9" y="-15" width="19" height="9" rx="3"/><rect x="8" y="-13" width="24" height="3.4"/><circle cx="-12" cy="6.5" r="2.4" fill="#6a5238" stroke="none"/><circle cx="0" cy="6.5" r="2.4" fill="#6a5238" stroke="none"/><circle cx="12" cy="6.5" r="2.4" fill="#6a5238" stroke="none"/></g>`;
  let sm='';[[50,150],[150,380],[300,370],[370,150]].forEach(([x,y],i)=>{sm+=`<ellipse cx="${x}" cy="${y}" rx="${22+i%2*8}" ry="${40+i*6}" fill="#1a0e08" opacity=".7" filter="url(#b14)"/>`;});
  return `<defs>${_bf}${_gs('sk',[[0,'#0a0608'],[.3,'#3a1608'],[.48,'#c06a20'],[.55,'#ffb860'],[.556,'#2a1408'],[1,'#0a0503']])}${_glow('gx','#fff0c0','#ff6a20')}</defs><rect width="400" height="800" fill="url(#sk)"/>${sm}<ellipse cx="60" cy="440" rx="80" ry="40" fill="url(#gx)"/><ellipse cx="335" cy="438" rx="70" ry="36" fill="url(#gx)"/><path d="M0 446V438Q40 428 90 436T200 434T310 438T400 430V446Z" fill="#24120a"/><rect y="446" width="400" height="354" fill="#3a1c0c"/>${tk(86,450,1.7)}${tk(236,464,2.3)}${tk(338,452,1.4)}<rect y="480" width="400" height="320" fill="#1a0c05"/>`;};
LOBBY_SCENES.rewind=function(){let sl='';for(let y=0;y<800;y+=6)sl+=`<rect y="${y}" width="400" height="2" fill="#000" opacity=".16"/>`;
  return `<defs>${_bf}${_gs('sk',[[0,'#14062a'],[.45,'#7a1a8a'],[.55,'#ff5aa0'],[.59,'#ffc070'],[.6,'#10061c'],[1,'#07030e']])}${_glow('sn','#fff4d8','#ff7ab0')}</defs><rect width="400" height="800" fill="url(#sk)"/><circle cx="200" cy="425" r="100" fill="url(#sn)"/><circle cx="200" cy="425" r="48" fill="#ffe8c0" opacity=".92"/>
<g transform="translate(-5 0)" opacity=".5">${_bld(_rng(5),385,472,'#4adcff',null,0,22,44)}</g><g transform="translate(5 0)" opacity=".5">${_bld(_rng(5),385,472,'#ff5ad0',null,0,22,44)}</g>${_bld(_rng(5),385,472,'#10061c','#ffd890',3,22,44)}${sl}<g opacity=".16" fill="#fff"><rect y="352" width="400" height="9"/><rect y="440" width="400" height="5"/></g>`;};
LOBBY_SCENES.erase=function(){let fr='',sp='';for(let i=0;i<9;i++){const x=6+i*43,er=i>=3&&i<6;fr+=`<rect x="${x}" y="340" width="38" height="56" rx="3" fill="${er?'#e8e8ec':`hsl(${i*40},70%,${42+i%3*8}%)`}" stroke="#000" stroke-width="3"/>`;if(!er)fr+=`<path d="M${x} 396L${x+38} 340" stroke="#fff" stroke-width="6" opacity=".12"/>`;}
  for(let i=0;i<22;i++)sp+=`<rect x="${4+i*18}" y="326" width="9" height="8" rx="2" fill="#050508" stroke="#444"/><rect x="${4+i*18}" y="402" width="9" height="8" rx="2" fill="#050508" stroke="#444"/>`;
  return `<defs>${_bf}${_gs('sk',[[0,'#05050a'],[1,'#1a1428']])}${_glow('gt','#ffe03a','#ff9a20')}</defs><rect width="400" height="800" fill="url(#sk)"/><rect y="322" width="400" height="92" fill="#0c0c12" stroke="#333" stroke-width="2"/>${sp}${fr}
<g filter="url(#b6)" opacity=".8"><rect x="30" y="440" width="340" height="9" fill="#ffe03a"/></g><rect x="30" y="441" width="340" height="6" rx="3" fill="#fff6c0"/><circle cx="30" cy="444" r="9" fill="#fff"/><circle cx="370" cy="444" r="9" fill="#ffe03a"/><rect x="125" y="436" width="130" height="16" fill="#05050a"/><path d="M125 444H255" stroke="#e0183a" stroke-width="3" stroke-dasharray="6 6"/><circle cx="250" cy="444" r="70" fill="url(#gt)" opacity=".3"/><path d="M-20 470L420 430" stroke="#e0183a" stroke-width="14" opacity=".25"/>`;};
LOBBY_SCENES.disc=function(){const r=_rng(361);let d='';const rb=['#ff5ad0','#ffe05a','#5affc8','#5ab4ff','#c85aff','#ff5ad0'];for(let i=0;i<13;i++){const x=10+i*30+r()*14,y=350+r()*100,s=14+r()*26,a=r()*180,sy=.3+r()*.7;d+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${a.toFixed(0)}) scale(1 ${sy.toFixed(2)})"><path d="M${s.toFixed(1)} 0A${s.toFixed(1)} ${s.toFixed(1)} 0 1 1 ${(-s).toFixed(1)} 0A${s.toFixed(1)} ${s.toFixed(1)} 0 1 1 ${s.toFixed(1)} 0ZM${(s*.16).toFixed(1)} 0A${(s*.16).toFixed(1)} ${(s*.16).toFixed(1)} 0 1 0 ${(-s*.16).toFixed(1)} 0A${(s*.16).toFixed(1)} ${(s*.16).toFixed(1)} 0 1 0 ${(s*.16).toFixed(1)} 0Z" fill="url(#rb)" fill-rule="evenodd"/><path d="M0 0L${(s*.9).toFixed(0)} ${(-s*.3).toFixed(0)}A${(s*.9).toFixed(0)} ${(s*.9).toFixed(0)} 0 0 0 ${(s*.5).toFixed(0)} ${(-s*.75).toFixed(0)}Z" fill="#fff" opacity=".35"/></g>`;}
  return `<defs>${_bf}${_gs('sk',[[0,'#02061a'],[.5,'#0c1c5a'],[.6,'#1a3aa0'],[.61,'#04081c'],[1,'#02040e']])}<linearGradient id="rb" x1="0" y1="0" x2="1" y2="1">${rb.map((c,i)=>`<stop offset="${i/5}" stop-color="${c}"/>`).join('')}</linearGradient>${_glow('gd','#9ae4ff','#2a5ad0')}</defs><rect width="400" height="800" fill="url(#sk)"/><ellipse cx="200" cy="410" rx="260" ry="90" fill="url(#gd)" opacity=".5"/>${d}<g transform="translate(0 940) scale(1 -1)" opacity=".18">${d}</g>`;};
LOBBY_SCENES.gravflip=function(){const r=_rng(371);
  return `<defs>${_bf}${_gs('sk',[[0,'#0c0820'],[.4,'#3a1050'],[.5,'#ff7a9a'],[.6,'#3a1050'],[1,'#0c0820']])}${_glow('gs','#fff4d8','#ffb080')}</defs><rect width="400" height="800" fill="url(#sk)"/><ellipse cx="200" cy="402" rx="200" ry="40" fill="url(#gs)" opacity=".9"/>
<g transform="translate(0 670) scale(1 -1)">${_bld(r,285,335,'#0c0820','#ffd890',2,20,42)}</g>${_bld(_rng(9),418,468,'#0c0820','#ffd890',2,20,42)}<rect y="335" width="400" height="0"/><rect width="400" height="285" y="0" fill="#0c0820" opacity=".7"/><rect y="468" width="400" height="332" fill="#0c0820" opacity=".8"/>
<g opacity=".85">${[0,1,2,3,4].map(i=>`<rect x="${40+i*75}" y="${392+(i*13)%20}" width="22" height="8" rx="3" fill="#202040" stroke="#ffd0e0" stroke-width="1"/>`).join('')}</g><path d="M0 386H400M0 418H400" stroke="#ffd0e0" stroke-width="1.5" opacity=".4"/>`;};
LOBBY_SCENES.cosmos=function(){const r=_rng(381);let st='',nb='';for(let i=0;i<220;i++){const x=r()*400,y=r()*455,s=.4+r()*1.6;st+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${s.toFixed(1)}" fill="#fff" opacity="${(.3+r()*.7).toFixed(2)}"/>`;}
  [[60,380,80,'#d04aff'],[190,350,90,'#3ab0ff'],[300,400,80,'#ff6aa0'],[380,360,60,'#7a5aff']].forEach(([x,y,s,c])=>nb+=`<ellipse cx="${x}" cy="${y}" rx="${s*1.4}" ry="${s*.5}" fill="${c}" opacity=".28" filter="url(#b14)"/>`);
  return `<defs>${_bf}<radialGradient id="a" cx=".5" cy=".5" r=".9"><stop offset="0" stop-color="#1a1050"/><stop offset=".6" stop-color="#080620"/><stop offset="1" stop-color="#02010a"/></radialGradient>${_gs('dn',[[0,'#ff5a8a'],[1,'#ffd890']])}<linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5a8a" stop-opacity="0"/><stop offset=".6" stop-color="#ff8a50" stop-opacity=".7"/><stop offset="1" stop-color="#ffd890"/></linearGradient></defs><rect width="400" height="800" fill="url(#a)"/>${nb}
<g transform="rotate(-6 200 390)"><rect x="-60" y="350" width="520" height="90" fill="#e8dcff" opacity=".3" filter="url(#b14)"/><rect x="-60" y="375" width="520" height="40" fill="#fff" opacity=".3" filter="url(#b14)"/></g><rect y="300" width="400" height="170" filter="url(#tb)" opacity=".4"/>${st}
<circle cx="316" cy="356" r="15" fill="#a090e0"/><ellipse cx="316" cy="356" rx="30" ry="6" fill="none" stroke="#e8d8ff" stroke-width="2.4" opacity=".85" transform="rotate(-16 316 356)"/>
<rect y="395" width="400" height="75" fill="url(#dg)"/><path d="${_ridge(_rng(7),{base:458,amp:14,rough:.55}).fill}" fill="#0a0612"/><rect y="466" width="400" height="334" fill="#05030a"/>`;};
const FIELD_SCENE_FOCUS={sunset:62,ocean:45,aurora:38,forest:64,dunes:60,snowfield:62,fireflies:62,mountain:64,waves:58,sakuranight:40,nebula:45,galaxy:50,lanterns:55,redmoon:40,pumpkinfield:60,redray:55,lightblade:55,chrono:50,tankbomb:50,rewind:50,erase:50,disc:50,gravflip:50,cosmos:50,haunted:55,xmasnight:60,newyearsun:55,heartnight:50,sakurastorm:45,milkyway:55,festival:55,moonviewing:50};

// ============================================================
// 場の背景のアニメーション（風景の上に動きを重ねる）。座標は風景画と同じ 400x800 の世界で描く
// ============================================================
function _bird(c,x,y,s,t){const f=Math.sin(t);c.beginPath();c.moveTo(x-s,y-f*s*.55);c.quadraticCurveTo(x-s*.45,y-s*.45-f*s*.25,x,y);c.quadraticCurveTo(x+s*.45,y-s*.45-f*s*.25,x+s,y-f*s*.55);c.stroke();}
function _star4(c,x,y,r){c.beginPath();for(let k=0;k<8;k++){const rr=k%2?r*.28:r,a=k*Math.PI/4;c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();}
const _rv=(S,k)=>k==='x'?_R(S.x0,S.x1):_R(S.y0,S.y1);
// またたく星（画面に見えている範囲に散らす）
function _twinkles(n,yMax){
  const T=Array.from({length:n},()=>({u:Math.random(),v:Math.random(),ph:_R(0,6.28),sp:_R(.001,.004),s:_R(3,7)}));
  const spr=glowSprite('230,238,255');
  return (c,S,now)=>{for(const t of T){const x=S.x0+t.u*(S.x1-S.x0),y=S.y0+t.v*(Math.min(S.y1,yMax||800)-S.y0);if(y<S.y0)continue;
    c.globalAlpha=.15+.7*Math.abs(Math.sin(t.ph+now*t.sp));const d=t.s*2;c.drawImage(spr,x-d/2,y-d/2,d,d);}};
}
function _shooter(){
  let st=null,next=3;
  return (c,S,dt,now)=>{
    next-=dt/60;
    if(!st&&next<=0){st={x:_R(S.x0,S.x1*.8),y:_R(S.y0,S.y0+(S.y1-S.y0)*.4),vx:_R(7,10),vy:_R(3,5),life:50};next=_R(5,11);}
    if(st){st.life-=dt;st.x+=st.vx*dt;st.y+=st.vy*dt;if(st.life<=0){st=null;return;}
      const k=st.life/50,tx=st.x-st.vx*6,ty=st.y-st.vy*6,g=c.createLinearGradient(st.x,st.y,tx,ty);
      g.addColorStop(0,`rgba(255,255,255,${k})`);g.addColorStop(1,'rgba(255,255,255,0)');
      c.globalAlpha=1;c.strokeStyle=g;c.lineWidth=1.4;c.beginPath();c.moveTo(st.x,st.y);c.lineTo(tx,ty);c.stroke();}
  };
}
function _snowfall(n,rgb,vyMin,vyMax){
  const spr=glowSprite(rgb||'255,255,255'),F=[];let ready=false;
  return (c,S,dt,now)=>{
    if(!ready){for(let i=0;i<n;i++)F.push({x:_rv(S,'x'),y:_rv(S,'y'),z:Math.random(),ph:_R(0,6.28)});ready=true;}
    const wind=Math.sin(now*.0004)*.35+.15;
    for(const f of F){f.y+=(vyMin+f.z*(vyMax-vyMin))*dt;f.x+=(wind*(.4+f.z)+Math.sin(f.ph+now*.001)*.12)*dt;
      if(f.y>S.y1+6){f.y=S.y0-6;f.x=_rv(S,'x');}if(f.x>S.x1+6)f.x=S.x0-6;if(f.x<S.x0-6)f.x=S.x1+6;
      c.globalAlpha=.3+f.z*.55;const d=1.6+f.z*4.2;c.drawImage(spr,f.x-d/2,f.y-d/2,d,d);}
  };
}

const FIELD_ANIMS={
  sunset(){
    const gl=glowSprite('255,210,130'),glints=Array.from({length:80},()=>{const i=Math.random();return{x:250+(Math.random()-.5)*(10+i*160),y:505+i*190,ph:_R(0,6.28),sp:_R(.002,.006),w:_R(3,13)};});
    const gulls=Array.from({length:4},(_,i)=>({x:_R(0,400),y:_R(300,430),s:_R(5,9),sp:_R(.25,.5),ph:_R(0,6)}));
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';c.globalAlpha=.16+.08*Math.sin(now*.0008);c.drawImage(gl,110,340,280,280);
      c.fillStyle='#ffe2a0';for(const g of glints){c.globalAlpha=Math.max(0,Math.sin(g.ph+now*g.sp))*.85;c.fillRect(g.x+Math.sin(now*.001+g.ph)*3-g.w/2,g.y,g.w,1.3);}
      c.globalCompositeOperation='source-over';c.globalAlpha=.75;c.strokeStyle='#2a1030';c.lineWidth=1.3;c.lineCap='round';
      for(const b of gulls){b.x+=b.sp*dt;if(b.x>S.x1+20)b.x=S.x0-20;b.ph+=.09*dt;_bird(c,b.x,b.y+Math.sin(now*.0007+b.ph)*5,b.s,b.ph);}
    };
  },
  ocean(){
    const B=[],M=[],fish=Array.from({length:6},()=>({x:_R(0,400),y:_R(380,650),dir:Math.random()<.5?-1:1,sp:_R(.25,.7),s:_R(.7,1.5),ph:_R(0,6)}));let ready=false;
    return (c,dt,now,S)=>{
      if(!ready){for(let i=0;i<28;i++)B.push({x:_rv(S,'x'),y:_rv(S,'y'),r:_R(1.5,5),vy:_R(.25,.8),ph:_R(0,6)});for(let i=0;i<90;i++)M.push({x:_rv(S,'x'),y:_rv(S,'y'),vy:_R(.05,.25),r:_R(.5,1.7),a:_R(.15,.5)});ready=true;}
      c.globalCompositeOperation='lighter';
      for(let k=0;k<4;k++){const x0=60+k*90,sw=Math.sin(now*.0003+k)*25,g=c.createLinearGradient(0,-20,0,620);g.addColorStop(0,'rgba(190,245,255,.16)');g.addColorStop(1,'rgba(90,200,232,0)');
        c.globalAlpha=.55+.4*Math.sin(now*.0006+k*1.7);c.fillStyle=g;c.beginPath();c.moveTo(x0+sw,-20);c.lineTo(x0+sw+40,-20);c.lineTo(x0+sw+120-60,620);c.lineTo(x0+sw-70-60,620);c.fill();}
      c.globalCompositeOperation='source-over';
      for(const m of M){m.y+=m.vy*dt;if(m.y>S.y1+4){m.y=S.y0-4;m.x=_rv(S,'x');}c.globalAlpha=m.a;c.fillStyle='#cfeeff';c.beginPath();c.arc(m.x,m.y,m.r,0,6.283);c.fill();}
      c.strokeStyle='rgba(200,240,255,.7)';c.lineWidth=.8;
      for(const b of B){b.y-=b.vy*dt;b.x+=Math.sin(b.ph+now*.002)*.25;if(b.y<S.y0-8){b.y=S.y1+8;b.x=_rv(S,'x');}c.globalAlpha=.55;c.beginPath();c.arc(b.x,b.y,b.r,0,6.283);c.stroke();c.fillStyle='#fff';c.globalAlpha=.6;c.fillRect(b.x-b.r*.4,b.y-b.r*.5,1,1);}
      c.fillStyle='#021420';
      for(const f of fish){f.x+=f.dir*f.sp*dt;if(f.x>440)f.x=-40;if(f.x<-40)f.x=440;f.ph+=.15*dt;c.globalAlpha=.55;c.save();c.translate(f.x,f.y+Math.sin(now*.001+f.ph)*3);c.scale(f.dir*f.s,f.s);
        c.beginPath();c.ellipse(0,0,9,3.2,0,0,6.283);c.fill();c.beginPath();c.moveTo(-8,0);c.lineTo(-15,-4+Math.sin(f.ph*2)*2.5);c.lineTo(-15,4+Math.sin(f.ph*2)*2.5);c.fill();c.restore();}
    };
  },
  forest(){
    const mist=Array.from({length:5},(_,i)=>({x:_R(-100,400),y:_R(470,700),w:_R(220,360),h:_R(70,120),vx:_R(.06,.16)*(Math.random()<.5?1:-1)}));
    const spr=glowSprite('238,246,240'),gold=glowSprite('255,244,176'),mote=Array.from({length:70},()=>({x:_R(0,400),y:_R(0,600),ph:_R(0,6),vx:_R(-.05,.08),vy:_R(-.05,.07),s:_R(4,9)}));
    const leaves=Array.from({length:7},()=>({x:_R(0,400),y:_R(0,800),vy:_R(.25,.55),ph:_R(0,6),rot:_R(0,6)}));
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';
      for(let k=0;k<3;k++){const g=c.createLinearGradient(40+k*120,-20,200+k*100,700);g.addColorStop(0,'rgba(255,246,200,.5)');g.addColorStop(1,'rgba(255,246,200,0)');
        c.globalAlpha=.1+.08*Math.sin(now*.0007+k*2);c.fillStyle=g;c.beginPath();c.moveTo(20+k*110,-20);c.lineTo(110+k*110,-20);c.lineTo(300+k*70,700);c.lineTo(100+k*70,700);c.fill();}
      for(const m of mote){m.x+=m.vx*dt+Math.sin(now*.0007+m.ph)*.05;m.y+=m.vy*dt;if(m.x<-10)m.x=410;if(m.x>410)m.x=-10;if(m.y<-10)m.y=700;if(m.y>700)m.y=-10;
        c.globalAlpha=.15+.6*Math.abs(Math.sin(m.ph+now*.0012));c.drawImage(gold,m.x-m.s,m.y-m.s,m.s*2,m.s*2);}
      c.globalCompositeOperation='source-over';
      for(const m of mist){m.x+=m.vx*dt;if(m.x>420)m.x=-m.w;if(m.x<-m.w-20)m.x=420;c.globalAlpha=.16;c.drawImage(spr,m.x,m.y,m.w,m.h);}
      c.fillStyle='#b88a38';
      for(const l of leaves){l.y+=l.vy*dt;l.x+=Math.sin(l.ph+now*.0014)*.6;l.rot+=.03*dt;if(l.y>S.y1+10){l.y=S.y0-10;l.x=_rv(S,'x');}
        c.globalAlpha=.8;c.save();c.translate(l.x,l.y);c.rotate(l.rot);c.scale(1,.45+.55*Math.abs(Math.sin(l.rot*1.3)));c.beginPath();c.ellipse(0,0,4,2.2,0,0,6.283);c.fill();c.restore();}
    };
  },
  dunes(){
    const gl=glowSprite('255,220,150'),sand=Array.from({length:130},()=>({x:_R(0,400),y:_R(470,790),len:_R(6,16),vx:_R(1.4,4.4),ph:_R(0,6),a:_R(.2,.5)}));
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';c.globalAlpha=.16+.07*Math.sin(now*.0007);c.drawImage(gl,-10,310,280,280);
      c.globalCompositeOperation='source-over';c.strokeStyle='#ffe0b0';c.lineWidth=.9;
      for(const s of sand){s.x+=s.vx*dt;if(s.x>S.x1+20){s.x=S.x0-20;s.y=_R(Math.max(470,S.y0),Math.min(790,Math.max(S.y1,520)));}
        const y=s.y+Math.sin(s.x/38+s.ph)*3;c.globalAlpha=s.a*(.7+.3*Math.sin(now*.003+s.ph));c.beginPath();c.moveTo(s.x,y);c.lineTo(s.x-s.len,y+Math.sin(s.x/20)*.8);c.stroke();}
    };
  },
  snowfield(){
    const tw=_twinkles(40,520),snow=_snowfall(150,'255,255,255',.18,.7),sh=_shooter(),gl=glowSprite('230,240,255');
    return (c,dt,now,S)=>{c.globalCompositeOperation='lighter';c.globalAlpha=.14+.06*Math.sin(now*.0009);c.drawImage(gl,150,20,300,300);tw(c,S,now);sh(c,S,dt,now);
      c.globalCompositeOperation='source-over';snow(c,S,dt,now);};
  },
  fireflies(){
    const spr=glowSprite('220,255,120'),F=Array.from({length:48},()=>({x:_R(0,400),y:_R(300,780),vx:_R(-.3,.3),vy:_R(-.3,.3),ph:_R(0,6.28),sp:_R(.0015,.004),s:_R(10,18)}));
    const rings=[];let nr=1;
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';
      for(const f of F){f.vx+=_R(-.02,.02)*dt;f.vy+=_R(-.02,.02)*dt;f.vx=Math.max(-.35,Math.min(.35,f.vx));f.vy=Math.max(-.3,Math.min(.3,f.vy));f.x+=f.vx*dt;f.y+=f.vy*dt;
        if(f.x<-10||f.x>410)f.vx*=-1;if(f.y<300||f.y>790)f.vy*=-1;
        const a=Math.pow(Math.max(0,Math.sin(f.ph+now*f.sp)),2);c.globalAlpha=a*.9;c.drawImage(spr,f.x-f.s/2,f.y-f.s/2,f.s,f.s);
        if(f.y<515){c.globalAlpha=a*.28;c.drawImage(spr,f.x-f.s/2,1040-f.y-f.s/2,f.s,f.s);}}
      c.globalCompositeOperation='source-over';nr-=dt/60;
      if(nr<=0){rings.push({x:_R(40,360),y:_R(560,760),r:2,life:1});nr=_R(.8,2);}
      c.strokeStyle='#bfe8ff';c.lineWidth=.8;
      for(let i=rings.length-1;i>=0;i--){const g=rings[i];g.r+=.35*dt;g.life-=.006*dt;if(g.life<=0){rings.splice(i,1);continue;}c.globalAlpha=g.life*.35;c.beginPath();c.ellipse(g.x,g.y,g.r*2.4,g.r*.6,0,0,6.283);c.stroke();}
    };
  },
  aurora(){
    const tw=_twinkles(50,500),sh=_shooter();
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';
      const cols=[['120,255,180','60,220,200'],['190,120,255','80,190,255'],['110,255,170','50,200,210']];
      for(let k=0;k<3;k++){const g=c.createLinearGradient(0,90,0,470);g.addColorStop(0,`rgba(${cols[k][0]},0)`);g.addColorStop(.3,`rgba(${cols[k][0]},.9)`);g.addColorStop(1,`rgba(${cols[k][1]},0)`);c.fillStyle=g;
        for(let x=0;x<=400;x+=5){const top=110+k*45+36*Math.sin(x/55+now*.0004*(k+1)+k*2)+14*Math.sin(x/19+now*.0011),h=130+55*Math.sin(x/38+now*.0007+k);
          c.globalAlpha=Math.max(0,.07+.075*Math.sin(x/26+now*.0009+k*1.3));c.fillRect(x,top,5.2,h);}}
      tw(c,S,now);sh(c,S,dt,now);c.globalCompositeOperation='source-over';
    };
  },
  mountain(){
    const spr=glowSprite('255,214,228'),gl=glowSprite('255,224,170'),w=Array.from({length:8},()=>({x:_R(-100,400),y:_R(480,650),w:_R(140,260),h:_R(26,56),vx:_R(.05,.18)}));
    const birds=Array.from({length:5},()=>({x:_R(0,400),y:_R(250,430),s:_R(4,7),sp:_R(.25,.5),ph:_R(0,6)}));
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';c.globalAlpha=.16+.08*Math.sin(now*.0008);c.drawImage(gl,60,320,300,300);
      c.globalAlpha=.36;for(const m of w){m.x+=m.vx*dt*1.6;if(m.x>420)m.x=-m.w;c.drawImage(spr,m.x,m.y,m.w,m.h);}
      c.globalCompositeOperation='source-over';c.strokeStyle='#2a1a3a';c.lineWidth=1.2;c.globalAlpha=.8;c.lineCap='round';
      for(const b of birds){b.x+=b.sp*dt;if(b.x>S.x1+20)b.x=S.x0-20;b.ph+=.08*dt;_bird(c,b.x,b.y+Math.sin(now*.0006+b.ph)*6,b.s,b.ph);}
    };
  },
  waves(){
    const tw=_twinkles(46,430),gl=glowSprite('235,244,255'),spr=glowSprite('28,40,80');
    const gl2=Array.from({length:170},()=>{const i=Math.random();return{x:250+(Math.random()-.5)*(14+i*220),y:458+i*300,ph:_R(0,6.28),sp:_R(.002,.007),w:_R(3,15)};});
    const cl=Array.from({length:4},()=>({x:_R(-100,400),y:_R(150,300),w:_R(180,300),h:_R(34,60),vx:_R(.05,.12)}));
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';c.globalAlpha=.16+.08*Math.sin(now*.0008);c.drawImage(gl,60,40,380,380);tw(c,S,now);
      c.fillStyle='#dcecff';for(const g of gl2){c.globalAlpha=Math.max(0,Math.sin(g.ph+now*g.sp))*.7;c.fillRect(g.x+Math.sin(now*.0009+g.ph)*4-g.w/2,g.y,g.w,1.2);}
      c.globalCompositeOperation='source-over';c.globalAlpha=.3;
      for(const m of cl){m.x+=m.vx*dt;if(m.x>430)m.x=-m.w;c.drawImage(spr,m.x,m.y,m.w,m.h);}
    };
  },
  sakuranight(){
    const P=Array.from({length:38},()=>({x:_R(0,400),y:_R(0,800),vy:_R(.4,1.1),ph:_R(0,6.28),rot:_R(0,6),vr:_R(-.04,.04),s:_R(2.5,5)}));
    const tw=_twinkles(40,420),ln=glowSprite('255,176,80');
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';tw(c,S,now);
      [[80,722,0],[318,742,2]].forEach(([x,y,ph])=>{c.globalAlpha=.45+.2*Math.sin(now*.006+ph)+_R(-.04,.04);c.drawImage(ln,x-52,y-52,104,104);});
      c.globalCompositeOperation='source-over';c.fillStyle='#ffc8dc';
      for(const p of P){p.y+=p.vy*dt;p.x+=Math.sin(p.ph+now*.0012)*.5+.2;p.rot+=p.vr*dt;if(p.y>S.y1+8||p.x>S.x1+10){p.y=S.y0-8;p.x=_rv(S,'x')-20;}
        c.globalAlpha=.85;c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.scale(1,.4+.6*Math.abs(Math.cos(p.rot*1.7)));c.beginPath();c.ellipse(0,0,p.s,p.s*.55,0,0,6.283);c.fill();c.restore();}
    };
  },
  nebula(){
    const tw=_twinkles(120,800),sh=_shooter(),core=glowSprite('255,230,255');
    const blobs=[['255,80,200',200,330],['70,120,255',240,520],['255,150,60',150,430],['60,230,210',260,400],['200,90,255',130,560]].map(([rgb,x,y],i)=>({spr:glowSprite(rgb),x,y,r:_R(110,170),ph:i*1.7,sp:_R(.0002,.0005)}));
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';
      for(const b of blobs){const x=b.x+Math.cos(now*b.sp+b.ph)*34,y=b.y+Math.sin(now*b.sp*1.3+b.ph)*30;c.globalAlpha=.08+.04*Math.sin(now*.0006+b.ph);c.drawImage(b.spr,x-b.r,y-b.r,b.r*2,b.r*2);}
      c.globalAlpha=.4+.25*Math.sin(now*.0012);c.drawImage(core,200-52,360-52,104,104);tw(c,S,now);sh(c,S,dt,now);
      c.globalCompositeOperation='source-over';
    };
  },
  galaxy(){
    const stars=[];for(const off of [0,Math.PI])for(let i=0;i<760;i++){const t=Math.random()*4.2,rad=26*Math.exp(.36*t)*(.8+Math.random()*.4),a=t*1.35+off,sc=(Math.random()+Math.random()+Math.random()-1.5)*rad*.22;
      stars.push({r:Math.hypot(rad,sc),a:a+Math.atan2(sc,rad),s:_R(.5,1.5),col:i%3?'#cfdcff':'#fff3d8',al:_R(.45,.95)});}
    const tw=_twinkles(90,800),sh=_shooter(),core=glowSprite('255,244,210');
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';
      c.save();c.translate(200,400);c.rotate(-.5);c.scale(1,.52);const w=now*.00005;
      for(const s of stars){const a=s.a+w;c.globalAlpha=s.al;c.fillStyle=s.col;c.fillRect(Math.cos(a)*s.r-s.s/2,Math.sin(a)*s.r-s.s/2,s.s,s.s);}
      c.restore();
      c.globalAlpha=.5+.2*Math.sin(now*.001);c.drawImage(core,200-80,400-50,160,100);tw(c,S,now);sh(c,S,dt,now);c.globalCompositeOperation='source-over';
    };
  },
};

// ── 実行エンジン ──
let _fieldAnim=null;
function stopFieldAnim(){
  if(!_fieldAnim)return;
  _fieldAnim.alive=false;cancelAnimationFrame(_fieldAnim.raf);_fieldAnim.ro&&_fieldAnim.ro.disconnect();
  const cv=document.getElementById('field-fx');if(cv)cv.remove();
  _fieldAnim=null;
}
function fieldAnimEnabled(){
  if(localStorage.getItem('rikka_bg_anim')==='0')return false;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return false;
  return true;
}
// 期間限定の背景の動き
FIELD_ANIMS.lanterns=function(){
  const spr=glowSprite('255,190,100'),L=Array.from({length:26},()=>({x:_R(0,400),y:_R(0,820),vy:_R(.12,.4),ph:_R(0,6.28),sw:_R(.0006,.0018),s:_R(.5,1.2),fl:_R(.003,.008)}));
  return (c,dt,now,S)=>{
    for(const l of L){l.y-=l.vy*dt;if(l.y<S.y0-40){l.y=S.y1+40;l.x=_R(0,400);}
      const x=l.x+Math.sin(l.ph+now*l.sw)*14,k=.75+.25*Math.sin(l.ph+now*l.fl);
      c.globalCompositeOperation='lighter';c.globalAlpha=.55*k;c.drawImage(spr,x-30*l.s,l.y-30*l.s,60*l.s,60*l.s);
      c.globalCompositeOperation='source-over';c.globalAlpha=.9;c.fillStyle='#ffb050';c.fillRect(x-6*l.s,l.y-8*l.s,12*l.s,16*l.s);
      c.globalAlpha=.9*k;c.fillStyle='#ffe2a0';c.fillRect(x-4*l.s,l.y-6*l.s,8*l.s,12*l.s);}
    c.globalAlpha=1;
  };
};
FIELD_ANIMS.redmoon=function(){
  const glow=glowSprite('255,90,70'),E=Array.from({length:40},()=>({x:_R(0,400),y:_R(300,820),vy:_R(.15,.5),ph:_R(0,6.28),s:_R(5,12)})),
    C=Array.from({length:4},()=>({x:_R(-100,500),y:_R(150,480),w:_R(90,170),v:_R(.05,.16)}));
  return (c,dt,now,S)=>{
    c.globalCompositeOperation='lighter';
    const p=.7+.3*Math.sin(now*.0015);c.globalAlpha=.5*p;c.drawImage(glow,260-150,250-150,300,300);
    for(const e of E){e.y-=e.vy*dt;e.x+=Math.sin(e.ph+now*.002)*.2*dt;if(e.y<S.y0-10){e.y=S.y1+10;e.x=_R(0,400);}
      c.globalAlpha=.4+.4*Math.sin(e.ph+now*.004);c.drawImage(glow,e.x-e.s/2,e.y-e.s/2,e.s,e.s);}
    c.globalCompositeOperation='source-over';c.fillStyle='#12040a';
    for(const k of C){k.x+=k.v*dt;if(k.x-k.w>420)k.x=-k.w-20;c.globalAlpha=.55;c.beginPath();c.ellipse(k.x,k.y,k.w,k.w*.11,0,0,6.283);c.fill();}
    c.globalAlpha=1;
  };
};
FIELD_ANIMS.pumpkinfield=function(){
  const glow=glowSprite('255,150,40'),B=Array.from({length:6},()=>({x:_R(-40,440),y:_R(80,520),v:_R(.25,.55),ph:_R(0,6.28),s:_R(.8,1.3)})),
    F=Array.from({length:34},()=>({x:_R(0,400),y:_R(380,820),vy:_R(.08,.3),ph:_R(0,6.28),s:_R(5,12)}));
  return (c,dt,now,S)=>{
    c.globalCompositeOperation='lighter';
    for(const f of F){f.y-=f.vy*dt;if(f.y<S.y0-10){f.y=S.y1+10;f.x=_R(0,400);}
      c.globalAlpha=.35+.4*Math.sin(f.ph+now*.003);c.drawImage(glow,f.x+Math.sin(f.ph+now*.001)*8-f.s/2,f.y-f.s/2,f.s,f.s);}
    c.globalCompositeOperation='source-over';c.fillStyle='#050208';c.globalAlpha=.95;
    for(const b of B){b.x+=b.v*dt;if(b.x>440){b.x=-40;b.y=_R(80,520);}
      const y=b.y+Math.sin(b.ph+now*.003)*14,f=Math.sin(now*.02+b.ph),w=16*b.s;
      c.beginPath();c.moveTo(b.x,y);c.quadraticCurveTo(b.x-w*.5,y-9*f*b.s,b.x-w,y+2);c.quadraticCurveTo(b.x-w*.5,y+4,b.x,y+5);
      c.quadraticCurveTo(b.x+w*.5,y+4,b.x+w,y+2);c.quadraticCurveTo(b.x+w*.5,y-9*f*b.s,b.x,y);c.fill();}
    c.globalAlpha=1;
  };
};
FIELD_ANIMS.haunted=function(){
  const glow=glowSprite('220,210,255'),W=Array.from({length:7},()=>({x:_R(0,400),y:_R(380,760),vx:_R(.05,.18)*(Math.random()<.5?-1:1),ph:_R(0,6.28),s:_R(36,70)})),
    L=_HAUNT_WIN.map(()=>({ph:_R(0,6.28),sp:_R(.002,.007)}));
  return (c,dt,now,S)=>{
    c.globalCompositeOperation='lighter';
    _HAUNT_WIN.forEach(([x,y],i)=>{const k=.55+.45*Math.sin(L[i].ph+now*L[i].sp);if(k<.42)return;c.globalAlpha=.5*k;c.drawImage(glow,x-12,y-8,40,40);});
    for(const w of W){w.x+=w.vx*dt;if(w.x<-80)w.x=480;if(w.x>480)w.x=-80;
      const y=w.y+Math.sin(w.ph+now*.0014)*18;c.globalAlpha=.2+.15*Math.sin(w.ph+now*.002);c.drawImage(glow,w.x-w.s/2,y-w.s/2,w.s,w.s*1.3);}
    c.globalCompositeOperation='source-over';c.globalAlpha=1;
  };
};
FIELD_ANIMS.xmasnight=function(){
  const cols=['255,80,80','255,210,90','100,170,255','110,230,130'].map(glowSprite),Sn=Array.from({length:80},()=>({x:_R(0,400),y:_R(0,820),vy:_R(.3,.9),ph:_R(0,6.28),r:_R(1,2.8)}));
  return (c,dt,now,S)=>{
    c.globalCompositeOperation='lighter';
    _XMAS_LIGHTS.forEach(([x,y],i)=>{c.globalAlpha=.45+.45*Math.sin(now*.004+i*1.7);c.drawImage(cols[i%4],x-9,y-9,18,18);});
    c.globalCompositeOperation='source-over';c.fillStyle='#fff';c.globalAlpha=.85;
    for(const s of Sn){s.y+=s.vy*dt;s.x+=Math.sin(s.ph+now*.0012)*.25*dt;if(s.y>S.y1+6){s.y=S.y0-6;s.x=_R(S.x0,S.x1);}c.beginPath();c.arc(s.x,s.y,s.r,0,6.283);c.fill();}
    c.globalAlpha=1;};
};
FIELD_ANIMS.newyearsun=function(){
  const gl=glowSprite('255,220,120'),P=Array.from({length:36},()=>({x:_R(0,400),y:_R(300,820),vy:_R(.15,.5),ph:_R(0,6.28),s:_R(5,13)}));
  return (c,dt,now,S)=>{
    c.globalCompositeOperation='lighter';
    c.save();c.translate(200,560);c.rotate(now*.00006);c.fillStyle='rgba(255,230,150,.1)';
    for(let i=0;i<16;i++){c.rotate(Math.PI/8);c.beginPath();c.moveTo(0,0);c.lineTo(-18,-900);c.lineTo(18,-900);c.closePath();c.fill();}
    c.restore();
    for(const p of P){p.y-=p.vy*dt;if(p.y<S.y0-10){p.y=S.y1+10;p.x=_R(0,400);}c.globalAlpha=.3+.5*Math.max(0,Math.sin(p.ph+now*.004));c.drawImage(gl,p.x+Math.sin(p.ph+now*.001)*8-p.s/2,p.y-p.s/2,p.s,p.s);}
    c.globalCompositeOperation='source-over';c.globalAlpha=1;};
};
FIELD_ANIMS.heartnight=function(){
  const mk=col=>{const k=document.createElement('canvas');k.width=k.height=64;const x=k.getContext('2d');x.translate(32,34);x.fillStyle=col;heartPath(x,22);x.fill();return k;};
  const sp=['#ff7ab8','#ff4a90','#ffb0d0'].map(mk),H=Array.from({length:26},()=>({x:_R(0,400),y:_R(0,840),vy:_R(.25,.8),ph:_R(0,6.28),s:_R(14,40),k:Math.floor(_R(0,3))}));
  return (c,dt,now,S)=>{
    for(const h of H){h.y-=h.vy*dt;if(h.y<S.y0-40){h.y=S.y1+40;h.x=_R(0,400);}
      c.globalAlpha=.55;c.drawImage(sp[h.k],h.x+Math.sin(h.ph+now*.0015)*12-h.s/2,h.y-h.s/2,h.s,h.s);}
    c.globalAlpha=1;};
};
FIELD_ANIMS.sakurastorm=function(){
  const P=Array.from({length:70},()=>({x:_R(-100,400),y:_R(0,820),vx:_R(.8,2.2),vy:_R(.4,1.1),r:_R(0,6.28),vr:_R(-.06,.06),s:_R(4,9),c:['#ffc0d8','#ffa0c4','#fff0f4'][Math.floor(_R(0,3))]}));
  return (c,dt,now,S)=>{
    for(const p of P){p.x+=(p.vx+Math.sin(now*.002+p.y*.01)*.6)*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;
      if(p.x>S.x1+20||p.y>S.y1+20){p.x=_R(S.x0-120,S.x0);p.y=_R(S.y0-20,S.y1*.7);}
      c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=.9;c.fillStyle=p.c;c.beginPath();c.ellipse(0,0,p.s,p.s*.55,0,0,6.283);c.fill();c.restore();}
    c.globalAlpha=1;};
};
FIELD_ANIMS.milkyway=function(){
  const gl=glowSprite('200,220,255'),T=Array.from({length:60},()=>({x:_R(0,400),y:_R(0,600),ph:_R(0,6.28),sp:_R(.002,.006),s:_R(5,13)})),M=[];let nxt=0;
  return (c,dt,now,S)=>{
    c.globalCompositeOperation='lighter';
    for(const t of T){c.globalAlpha=.2+.5*Math.max(0,Math.sin(t.ph+now*t.sp));c.drawImage(gl,t.x-t.s/2,t.y-t.s/2,t.s,t.s);}
    if(now>nxt){nxt=now+_R(1800,4200);M.push({x:_R(80,400),y:_R(20,260),l:0});}
    for(let i=M.length-1;i>=0;i--){const m=M[i];m.l+=dt*.035;m.x-=dt*7;m.y+=dt*3.4;if(m.l>1){M.splice(i,1);continue;}
      const g=c.createLinearGradient(m.x,m.y,m.x+70,m.y-34);g.addColorStop(0,`rgba(255,255,255,${Math.sin(m.l*Math.PI)})`);g.addColorStop(1,'rgba(255,255,255,0)');
      c.globalAlpha=1;c.strokeStyle=g;c.lineWidth=2;c.beginPath();c.moveTo(m.x,m.y);c.lineTo(m.x+70,m.y-34);c.stroke();}
    c.globalCompositeOperation='source-over';c.globalAlpha=1;};
};
FIELD_ANIMS.festival=function(){
  const gl=glowSprite('255,120,60'),cs=['255,90,90','255,220,120','120,200,255','180,255,150','255,150,255'].map(glowSprite),B=[];let nxt=0;
  return (c,dt,now,S)=>{
    c.globalCompositeOperation='lighter';
    _FEST_LAMPS.forEach(([x,y],i)=>{c.globalAlpha=.55+.3*Math.sin(now*.003+i*2.1);c.drawImage(gl,x-22,y-22,44,44);});
    if(now>nxt){nxt=now+_R(900,2200);const n=36,ps=[];for(let i=0;i<n;i++){const a=i/n*6.283,v=_R(1.2,2.6);ps.push({vx:Math.cos(a)*v,vy:Math.sin(a)*v});}B.push({x:_R(60,340),y:_R(280,500),t:0,ps,k:Math.floor(_R(0,5))});}
    for(let i=B.length-1;i>=0;i--){const b=B[i];b.t+=dt;if(b.t>90){B.splice(i,1);continue;}
      const a=1-b.t/90,e=b.t*.9*(1-b.t/220);
      for(const p of b.ps){c.globalAlpha=a;c.drawImage(cs[b.k],b.x+p.vx*e-7,b.y+p.vy*e+b.t*b.t*.004-7,14,14);}}
    c.globalCompositeOperation='source-over';c.globalAlpha=1;};
};
FIELD_ANIMS.moonviewing=function(){
  const gl=glowSprite('255,244,180'),F=Array.from({length:22},()=>({x:_R(0,400),y:_R(400,800),vx:_R(-.2,.2),ph:_R(0,6.28)})),
    G=Array.from({length:30},(_,i)=>({x:i*14-6+_R(-4,4),h:_R(90,190),ph:_R(0,6.28)})),C=[{x:-80,y:250,w:150,v:.08},{x:250,y:330,w:120,v:.05}];
  return (c,dt,now,S)=>{
    c.globalCompositeOperation='lighter';
    for(const f of F){f.x+=f.vx*dt+Math.sin(f.ph+now*.001)*.15;f.y+=Math.cos(f.ph+now*.0012)*.2;c.globalAlpha=.3+.5*Math.max(0,Math.sin(f.ph+now*.004));c.drawImage(gl,f.x-5,f.y-5,10,10);}
    c.globalCompositeOperation='source-over';c.fillStyle='#20284e';
    for(const k of C){k.x+=k.v*dt;if(k.x-k.w>440)k.x=-k.w-20;c.globalAlpha=.35;c.beginPath();c.ellipse(k.x,k.y,k.w,k.w*.09,0,0,6.283);c.fill();}
    const yb=S.y1+4;c.lineCap='round';
    for(const g of G){const sw=Math.sin(g.ph+now*.0014)*14;
      c.globalAlpha=1;c.strokeStyle='#0a0c1c';c.lineWidth=2;c.beginPath();c.moveTo(g.x,yb);c.quadraticCurveTo(g.x+sw*.3,yb-g.h*.55,g.x+sw,yb-g.h);c.stroke();
      c.strokeStyle='#7a7a90';c.lineWidth=5;c.globalAlpha=.8;c.beginPath();c.moveTo(g.x+sw*.92,yb-g.h*.9);c.lineTo(g.x+sw,yb-g.h);c.stroke();}
    c.globalAlpha=1;};
};
// ---- 動き（見せ場は高さ340〜470の帯） ----
FIELD_ANIMS.redray=function(){const gl=glowSprite('255,80,40'),gw=glowSprite('255,244,210'),smk=glowSprite('70,40,36'),sp=[],sm=Array.from({length:10},()=>({x:_R(160,240),y:_R(330,440),vy:_R(.12,.3),s:_R(40,80),a:_R(.1,.22),ph:_R(0,6)}));
  return(c,dt,now,S)=>{const fl=.78+.22*Math.sin(now*.031)*Math.sin(now*.013);c.globalCompositeOperation='source-over';
   for(const m of sm){m.y-=m.vy*dt;m.x+=Math.sin(now*.0008+m.ph)*.2;if(m.y<290){m.y=440;m.x=_R(170,230);}c.globalAlpha=m.a*Math.min(1,(440-m.y)/40);c.drawImage(smk,m.x-m.s/2,m.y-m.s/2,m.s,m.s);}
   c.globalCompositeOperation='lighter';c.lineCap='round';
   for(const x0 of[110,290]){c.globalAlpha=.35*fl;c.strokeStyle='#ff2a2a';c.lineWidth=16;c.beginPath();c.moveTo(x0-60*(x0<200?1:-1)*0,296-100);c.lineTo(200,440);c.stroke();c.globalAlpha=.9*fl;c.strokeStyle='#ffe8e0';c.lineWidth=3;c.beginPath();c.moveTo(x0,296);c.lineTo(200,440);c.stroke();}
   c.globalAlpha=.8*fl;c.drawImage(gl,60,300,280,280);c.globalAlpha=fl;c.drawImage(gw,160,400,80,80);
   if(Math.random()<.9*dt)sp.push({x:200+_R(-8,8),y:440,vx:_R(-2.6,2.6),vy:-_R(1,3.6),l:0,m:_R(24,56)});
   for(let i=sp.length-1;i>=0;i--){const p=sp[i];p.l+=dt;if(p.l>p.m){sp.splice(i,1);continue;}p.vy+=.12*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;c.globalAlpha=1-p.l/p.m;c.drawImage(gw,p.x-3.5,p.y-3.5,7,7);}
   c.globalAlpha=1;};};
FIELD_ANIMS.lightblade=function(){const gw=glowSprite('220,248,255'),mo=Array.from({length:60},()=>({x:_R(0,400),y:_R(330,470),vx:_R(-.1,.1),ph:_R(0,6),s:_R(1.5,4)}));
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
   for(let i=0;i<18;i++){const x=i*22+Math.sin(now*.0004+i)*8;c.globalAlpha=.1+.1*Math.sin(now*.0011+i*1.3);c.strokeStyle=`hsl(${(i*20+now*.03)%360},100%,68%)`;c.lineWidth=2+(i%4);c.beginPath();c.moveTo(392,338);c.lineTo(x,472);c.stroke();}
   for(const m of mo){m.x+=m.vx*dt;if(m.x<S.x0)m.x=S.x1;if(m.x>S.x1)m.x=S.x0;c.globalAlpha=.25+.5*Math.max(0,Math.sin(now*.003+m.ph));c.drawImage(gw,m.x-m.s,m.y-m.s,m.s*2,m.s*2);}
   const ph=(now*.00035)%1,gx=ph*392,gy=470-ph*134;c.globalAlpha=.9*Math.sin(ph*3.14);c.drawImage(gw,gx-30,gy-30,60,60);
   const fl=(now%5200)/5200;if(fl<.08){c.globalAlpha=(1-fl/.08)*.85;c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.moveTo(-20,350+fl*300);c.lineTo(420,460-fl*300);c.stroke();}
   c.globalAlpha=1;};};
FIELD_ANIMS.chrono=function(){const gw=glowSprite('230,244,255'),F=Array.from({length:70},()=>({x:_R(0,400),y:_R(320,470),ph:_R(0,6),s:_R(2,5)}));
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
   for(const f of F){c.globalAlpha=Math.max(0,Math.sin(now*.0016+f.ph))*.85;c.drawImage(gw,f.x-f.s*2,f.y-f.s*2,f.s*4,f.s*4);}
   const q=(now%4200)/4200;c.globalAlpha=(1-q)*.55;c.strokeStyle='#e8f6ff';c.lineWidth=3;c.beginPath();c.ellipse(200,405,q*520,q*130,0,0,6.3);c.stroke();
   c.globalAlpha=.1+.06*Math.sin(now*.0007);c.fillStyle='#dff0ff';c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);
   c.globalAlpha=1;};};
FIELD_ANIMS.tankbomb=function(){const gx=glowSprite('255,150,60'),gw=glowSprite('255,240,200'),smk=glowSprite('40,26,18'),T=Array.from({length:3},(_,i)=>({x:_R(0,400),y:452+i*10,sp:_R(.2,.45)*(i%2?-1:1),s:1.5+i*.5})),E=[];let nx=800;
  const tank=(c,x,y,s,d)=>{c.save();c.translate(x,y);c.scale(d*s,s);c.lineWidth=1.2;c.strokeStyle='#ffc070';c.fillStyle='#2a2018';c.beginPath();c.roundRect(-20,2,40,9,4.5);c.fill();c.fillStyle='#4a3a26';c.fillRect(-16,-7,32,11);c.strokeRect(-16,-7,32,11);c.fillRect(-9,-15,19,9);c.strokeRect(-9,-15,19,9);c.fillRect(8,-13,24,3.4);c.strokeRect(8,-13,24,3.4);c.fillStyle='#6a5238';for(const x0 of[-12,0,12]){c.beginPath();c.arc(x0,6.5,2.4,0,6.3);c.fill();}c.fillStyle='#ff4a2a';c.beginPath();c.arc(-13,-2,1.8,0,6.3);c.fill();c.restore();};
  return(c,dt,now,S)=>{c.globalCompositeOperation='source-over';
   for(const t of T){t.x+=t.sp*dt;if(t.x>S.x1+40)t.x=S.x0-40;if(t.x<S.x0-40)t.x=S.x1+40;for(let i=1;i<5;i++){c.globalAlpha=.2/i*2;c.fillStyle='#6a4a30';c.beginPath();c.arc(t.x-Math.sign(t.sp)*i*12,t.y+8,4+i*2,0,6.3);c.fill();}c.globalAlpha=1;tank(c,t.x,t.y,t.s,Math.sign(t.sp)||1);}
   if(now>nx){nx=now+_R(900,2200);E.push({x:_R(S.x0+30,S.x1-30),y:_R(436,452),t0:now});}
   for(let i=E.length-1;i>=0;i--){const e=E[i],q=(now-e.t0)/1400;if(q>1){E.splice(i,1);continue;}
    c.globalCompositeOperation='source-over';c.globalAlpha=.45*(1-q);c.drawImage(smk,e.x-45,e.y-q*90-70,90,110+q*40);
    c.globalCompositeOperation='lighter';c.globalAlpha=Math.max(0,1-q*2.2);const R=110*(.4+q);c.drawImage(gx,e.x-R,e.y-R,R*2,R*2);c.globalAlpha=Math.max(0,1-q*4);c.drawImage(gw,e.x-45,e.y-45,90,90);
    c.globalAlpha=(1-q)*.8;c.strokeStyle='#ffc070';c.lineWidth=3*(1-q)+.5;c.beginPath();c.ellipse(e.x,e.y+6,q*140,q*20,0,0,6.3);c.stroke();}
   c.globalAlpha=1;};};
FIELD_ANIMS.rewind=function(){const P=Array.from({length:60},()=>({x:_R(0,400),y:_R(0,800),v:_R(1.5,5),l:_R(10,30)}));
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
   c.strokeStyle='rgba(255,200,255,.5)';c.lineWidth=1.2;for(const p of P){p.y-=p.v*dt*2;if(p.y<S.y0-30){p.y=S.y1+10;p.x=_R(S.x0,S.x1);}c.globalAlpha=.55;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x,p.y+p.l);c.stroke();}
   const by=S.y0+((now*.12)%(S.y1-S.y0+40))-20;c.globalAlpha=.22;c.fillStyle='#fff';c.fillRect(S.x0,by,S.x1-S.x0,8);c.globalAlpha=.12;c.fillRect(S.x0,S.y0+((now*.2)%(S.y1-S.y0)),S.x1-S.x0,4);
   if(Math.random()<.07*dt){const y=_R(S.y0,S.y1);c.globalAlpha=.4;for(let i=0;i<24;i++){c.fillStyle=Math.random()<.5?'#fff':'#4adcff';c.fillRect(_R(S.x0,S.x1),y+_R(-5,5),_R(8,60),2);}}
   const a=.35+.35*Math.abs(Math.sin(now*.004));c.globalAlpha=a;c.fillStyle='#ffe8ff';for(let j=0;j<2;j++){const x=70+j*50;c.beginPath();c.moveTo(x+46,352);c.lineTo(x,372);c.lineTo(x+46,392);c.fill();}
   c.globalAlpha=1;};};
FIELD_ANIMS.erase=function(){const gt=glowSprite('255,224,80');
  return(c,dt,now,S)=>{c.globalCompositeOperation='source-over';const off=(now*.04)%43;
   for(let i=-1;i<10;i++){const x=6+i*43-off,idx=((i+Math.floor(now*.04/43))%9+9)%9,er=idx>=3&&idx<6;if(er){c.globalAlpha=.9;c.fillStyle='#d8d8de';c.fillRect(x,340,38,56);for(let k=0;k<18;k++){c.fillStyle=Math.random()<.5?'#000':'#999';c.fillRect(x+Math.random()*34,340+Math.random()*52,_R(2,10),_R(1,3));}c.strokeStyle='#000';c.lineWidth=3;c.strokeRect(x,340,38,56);}}
   c.globalCompositeOperation='lighter';const cyc=(now%4000)/4000,cx=cyc<.5?30+cyc/.5*95:cyc<.6?255:255+(cyc-.6)/.4*115;c.globalAlpha=.9;c.drawImage(gt,cx-30,444-30,60,60);
   if(cyc>=.5&&cyc<.58){c.globalAlpha=(1-(cyc-.5)/.08)*.8;c.fillStyle='#fff';c.fillRect(125,436,130,16);}
   if(Math.random()<.08*dt){c.globalAlpha=.6;c.fillStyle='#e0183a';c.fillRect(S.x0,_R(S.y0,S.y1),S.x1-S.x0,_R(2,6));}
   c.globalAlpha=1;};};
FIELD_ANIMS.disc=function(){const gw=glowSprite('180,230,255'),Ds=Array.from({length:8},()=>({x:_R(0,400),y:_R(355,455),r:_R(14,30),ph:_R(0,6),sp:_R(.0006,.0016),vx:_R(.05,.18)*(Math.random()<.5?-1:1)}));
  return(c,dt,now,S)=>{c.globalCompositeOperation='source-over';
   for(const d of Ds){d.x+=d.vx*dt;if(d.x>S.x1+40)d.x=S.x0-40;if(d.x<S.x0-40)d.x=S.x1+40;const t=Math.cos(now*d.sp*3+d.ph),y=d.y+Math.sin(now*.001+d.ph)*6;c.save();c.translate(d.x,y);c.rotate(now*d.sp);c.scale(1,Math.max(.16,Math.abs(t)));
    let g='#bfe8ff';if(c.createConicGradient){g=c.createConicGradient(now*.0009,0,0);['#ff5ad0','#ffe05a','#5affc8','#5ab4ff','#c85aff','#ff5ad0'].forEach((cl,i)=>g.addColorStop(i/5,cl));}
    c.globalAlpha=.95;c.fillStyle=g;c.beginPath();c.arc(0,0,d.r,0,6.3);c.arc(0,0,d.r*.16,0,6.3,true);c.fill('evenodd');c.globalAlpha=.45;c.fillStyle='#fff';c.beginPath();c.moveTo(0,0);c.arc(0,0,d.r*.9,-.5,.15);c.fill();c.restore();}
   c.globalCompositeOperation='lighter';const sw=((now*.0003)%1.4)*520-60;c.globalAlpha=.25;c.fillStyle='#bfe8ff';c.beginPath();c.moveTo(sw,300);c.lineTo(sw+30,300);c.lineTo(sw-30,480);c.lineTo(sw-60,480);c.fill();
   for(const d of Ds){if(Math.sin(now*.004+d.ph)>.93){c.globalAlpha=.9;c.drawImage(gw,d.x-20,d.y-20,40,40);}}
   c.globalAlpha=1;};};
FIELD_ANIMS.gravflip=function(){const gw=glowSprite('255,210,230'),P=Array.from({length:70},()=>({x:_R(0,400),y:_R(0,800),v:_R(.5,2),l:_R(6,16),sh:Math.random()<.3,r:_R(0,6)})),C=Array.from({length:4},()=>({x:_R(0,400),y:_R(390,404),vx:_R(.15,.4),ph:_R(0,6)}));
  return(c,dt,now,S)=>{const cyc=(now%8000)/8000,dir=cyc<.5?1:-1,flip=(cyc%.5)<.04;c.globalCompositeOperation='lighter';
   for(const p of P){p.y+=dir*p.v*dt*2.2;if(p.y>S.y1+20)p.y=S.y0-20;if(p.y<S.y0-20)p.y=S.y1+20;p.r+=.03*dt;c.globalAlpha=.6;c.strokeStyle=dir>0?'#9ac0ff':'#ffa0d8';c.lineWidth=1.2;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x,p.y-dir*p.l);c.stroke();if(p.sh){c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=.85;c.fillStyle='#fff0f8';c.fillRect(-2.5,-2.5,5,5);c.restore();}}
   c.globalCompositeOperation='source-over';for(const k of C){k.x+=k.vx*dt;if(k.x>S.x1+30)k.x=S.x0-30;const y=k.y+Math.sin(now*.001+k.ph)*5;c.globalAlpha=.9;c.fillStyle='#202040';c.fillRect(k.x,y,22,8);c.globalAlpha=.8;c.fillStyle='#ffd0e0';c.fillRect(k.x+18,y+3,3,3);}
   if(flip){c.globalCompositeOperation='lighter';const q=(cyc%.5)/.04;c.globalAlpha=(1-q)*.7;c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.ellipse(200,402,q*500,q*120,0,0,6.3);c.stroke();}
   c.globalAlpha=1;};};
FIELD_ANIMS.cosmos=function(){const St=Array.from({length:220},()=>({a:_R(0,6.283),r:Math.sqrt(Math.random())*520,s:_R(.5,1.8),h:_R(190,300)})),sh=[];let ang=0,nxt=1500;
  return(c,dt,now,S)=>{const cyc=(now%18000)/18000,fast=cyc>.7&&cyc<.88,w=fast?.0035*(1+(cyc-.7)/.18*18):.00007;ang+=w*dt*16.67;c.globalCompositeOperation='lighter';
   const px=250,py=300;c.lineCap='round';
   for(const s of St){const a=s.a+ang,x=px+Math.cos(a)*s.r,y=py+Math.sin(a)*s.r,tl=fast?Math.min(.5,w*30):w*40,x0=px+Math.cos(a-tl)*s.r,y0=py+Math.sin(a-tl)*s.r;if(y>452||y<S.y0-20||x<S.x0-20||x>S.x1+20)continue;c.globalAlpha=.55+.4*Math.sin(now*.002+s.a*9);c.strokeStyle=`hsl(${s.h},80%,${fast?88:78}%)`;c.lineWidth=s.s;c.beginPath();c.moveTo(x0,y0);c.lineTo(x,y);c.stroke();}
   if(now>nxt&&!fast){nxt=now+_R(1800,4500);sh.push({x:_R(200,420),y:_R(330,380),t0:now});}
   for(let i=sh.length-1;i>=0;i--){const s=sh[i],q=(now-s.t0)/700;if(q>1){sh.splice(i,1);continue;}const x=s.x-q*240,y=s.y+q*60;c.globalAlpha=1-q;const g=c.createLinearGradient(x+70,y-18,x,y);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'#fff');c.strokeStyle=g;c.lineWidth=2.2;c.beginPath();c.moveTo(x+70,y-18);c.lineTo(x,y);c.stroke();}
   if(cyc>.86&&cyc<.9){c.globalAlpha=Math.sin((cyc-.86)/.04*3.14)*.9;c.fillStyle='#fff';c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);}
   const dawn=.4+.35*Math.sin(cyc*6.283-1.2);c.globalAlpha=Math.max(0,dawn)*.5;const g2=c.createLinearGradient(0,470,0,395);g2.addColorStop(0,'#ffc070');g2.addColorStop(1,'rgba(255,100,140,0)');c.fillStyle=g2;c.fillRect(S.x0,395,S.x1-S.x0,75);
   c.globalAlpha=1;};};
// ---- もっとリアルで派手に：仕上げ（ビネット・粒子）と、各背景の追加演出 ----
['redray','lightblade','chrono','tankbomb','rewind','erase','disc','gravflip','cosmos'].forEach(k=>{const o=LOBBY_SCENES[k];LOBBY_SCENES[k]=function(){return o()+`<defs><radialGradient id="vgx" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient><filter id="grn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .9 -.35"/></filter></defs><rect width="400" height="800" filter="url(#grn)" opacity=".16"/><rect width="400" height="800" fill="url(#vgx)"/>`;};});
const _fxAdd=(k,mk)=>{const o=FIELD_ANIMS[k];FIELD_ANIMS[k]=function(){const a=o(),b=mk();return(c,dt,now,S)=>{a(c,dt,now,S);c.save();b(c,dt,now,S);c.restore();c.globalAlpha=1;c.globalCompositeOperation='source-over';};};};
const _spark4=(c,x,y,r)=>{if(r<=0)return;c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x,y,x+r,y);c.quadraticCurveTo(x,y,x,y+r);c.quadraticCurveTo(x,y,x-r,y);c.quadraticCurveTo(x,y,x,y-r);c.fill();};
const _flareH=(c,x,y,w,h,col,a)=>{const g=c.createLinearGradient(x-w,0,x+w,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,col);g.addColorStop(1,'rgba(255,255,255,0)');c.globalAlpha=a;c.fillStyle=g;c.fillRect(x-w,y-h/2,w*2,h);};
_fxAdd('redray',()=>{const R=[],em=[],gw=glowSprite('255,200,150');let nx=0;
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
   _flareH(c,200,440,260,5,'#ffd0b0',.55+.3*Math.sin(now*.02));_flareH(c,200,440,160,14,'#ff4a20',.35);
   if(now>nx){nx=now+_R(260,520);R.push(now);}
   for(let i=R.length-1;i>=0;i--){const q=(now-R[i])/900;if(q>1){R.splice(i,1);continue;}c.globalAlpha=(1-q)*.7;c.strokeStyle='#ff9a60';c.lineWidth=3*(1-q)+.6;c.beginPath();c.ellipse(200,446,q*230,q*26,0,0,6.3);c.stroke();}
   for(let i=0;i<3;i++)if(Math.random()<.5*dt)em.push({x:_R(60,340),y:_R(446,470),vx:_R(-.3,.3),vy:-_R(.3,1.2),l:0,m:_R(60,140)});
   for(let i=em.length-1;i>=0;i--){const p=em[i];p.l+=dt;if(p.l>p.m){em.splice(i,1);continue;}p.x+=p.vx*dt+Math.sin(now*.003+p.m)*.2;p.y+=p.vy*dt;c.globalAlpha=(1-p.l/p.m)*.9;c.drawImage(gw,p.x-3,p.y-3,6,6);}
   for(let i=0;i<5;i++){const y=446+i*5+Math.sin(now*.006+i)*2;c.globalAlpha=.12;c.fillStyle='#ffa060';c.fillRect(S.x0,y,S.x1-S.x0,1.2);}
   c.globalAlpha=.06*(1+Math.sin(now*.05));c.fillStyle='#ff3a1a';c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);};});
_fxAdd('lightblade',()=>{const gw=glowSprite('230,250,255'),gl=[];
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
   const fx=392,fy=338;_flareH(c,fx,fy,300,6,'#ffffff',.7+.3*Math.sin(now*.01));_flareH(c,fx,fy,180,18,'#7ae0ff',.4);c.globalAlpha=.6;c.save();c.translate(fx,fy);c.rotate(now*.0004);for(let i=0;i<8;i++){c.rotate(.785);c.fillStyle='rgba(180,240,255,.5)';c.fillRect(0,-1.2,140,2.4);}c.restore();
   if(Math.random()<.25*dt)gl.push({x:_R(10,380),y:_R(400,470),t0:now,r:_R(8,18)});
   for(let i=gl.length-1;i>=0;i--){const g=gl[i],q=(now-g.t0)/600;if(q>1){gl.splice(i,1);continue;}c.globalAlpha=Math.sin(q*3.14);c.fillStyle='#fff';_spark4(c,g.x,g.y,g.r*Math.sin(q*3.14));c.globalAlpha=.5*Math.sin(q*3.14);c.drawImage(gw,g.x-g.r*2,g.y-g.r*2,g.r*4,g.r*4);}
   const sw=((now*.0007)%1.6)*500-100;c.globalAlpha=.18;const g=c.createLinearGradient(sw-60,0,sw+60,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'#cfeeff');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(sw-60,S.y0,120,S.y1-S.y0);};});
_fxAdd('chrono',()=>{const sh=[];let nx=2500;
  return(c,dt,now,S)=>{const cyc=(now%7000)/7000;c.globalCompositeOperation='source-over';
   c.save();c.translate(200,405);c.globalAlpha=.45;c.strokeStyle='#e8f4ff';c.lineWidth=2.5;c.lineCap='round';const t=cyc<.6?cyc*40:24;c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(t)*46,-Math.cos(t)*46);c.stroke();c.lineWidth=3.5;c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(t/12)*30,-Math.cos(t/12)*30);c.stroke();c.restore();
   if(now>nx){nx=now+_R(3500,6000);for(let i=0;i<26;i++)sh.push({x:200,y:405,vx:_R(-6,6),vy:_R(-3,3),r:_R(0,6),s:_R(3,9),l:0,m:_R(40,90)});c.globalCompositeOperation='lighter';c.globalAlpha=.7;c.fillStyle='#fff';c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);}
   c.globalCompositeOperation='lighter';for(let i=sh.length-1;i>=0;i--){const p=sh[i];p.l+=dt;if(p.l>p.m){sh.splice(i,1);continue;}p.vx*=.97;p.vy*=.97;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=.1*dt;c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=1-p.l/p.m;c.fillStyle='#e8f6ff';c.beginPath();c.moveTo(0,-p.s);c.lineTo(p.s*.6,p.s*.7);c.lineTo(-p.s*.6,p.s*.7);c.fill();c.restore();}
   c.globalAlpha=.08;c.fillStyle='#4aa8ff';c.fillRect(S.x0+Math.sin(now*.003)*2,S.y0,S.x1-S.x0,S.y1-S.y0);};});
_fxAdd('tankbomb',()=>{const tr=[],fl=[];let nx=600;
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
   if(now>nx){nx=now+_R(300,900);const x=_R(S.x0,S.x1);tr.push({x0:x,y0:_R(448,458),x1:x+_R(-120,120),y1:_R(330,400),t0:now});}
   for(let i=tr.length-1;i>=0;i--){const t=tr[i],q=(now-t.t0)/420;if(q>1){tr.splice(i,1);fl.push({x:t.x1,y:t.y1,t0:now});continue;}const x=t.x0+(t.x1-t.x0)*q,y=t.y0+(t.y1-t.y0)*q;c.globalAlpha=.9;c.strokeStyle='#ffe0a0';c.lineWidth=2;c.beginPath();c.moveTo(x-(t.x1-t.x0)*.08,y-(t.y1-t.y0)*.08);c.lineTo(x,y);c.stroke();}
   for(let i=fl.length-1;i>=0;i--){const f=fl[i],q=(now-f.t0)/500;if(q>1){fl.splice(i,1);continue;}c.globalAlpha=1-q;c.fillStyle='#ffd080';c.beginPath();c.arc(f.x,f.y,6+q*30,0,6.3);c.fill();c.globalAlpha=(1-q)*.8;c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(f.x,f.y,q*50,0,6.3);c.stroke();}
   const f2=.5+.5*Math.sin(now*.013)*Math.sin(now*.007);c.globalAlpha=.06*Math.max(0,f2);c.fillStyle='#ffb050';c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);
   for(let i=0;i<3;i++){c.globalAlpha=.5;c.fillStyle='#ffc060';c.fillRect(((now*.2+i*140)%(S.x1-S.x0+20))+S.x0,_R(330,445),2,2);}};});
_fxAdd('rewind',()=>{
  return(c,dt,now,S)=>{c.globalCompositeOperation='source-over';
   const tc=Math.max(0,3599-Math.floor(now/16.7)%3600),mm=String(Math.floor(tc/60)).padStart(2,'0'),ss=String(tc%60).padStart(2,'0');
   c.font='900 22px monospace';c.textAlign='right';c.globalAlpha=.9;c.fillStyle='#ffe8ff';c.strokeStyle='#000';c.lineWidth=3;c.strokeText(`◀◀ REW  ${mm}:${ss}`,372,370);c.fillText(`◀◀ REW  ${mm}:${ss}`,372,370);
   if(Math.sin(now*.006)>0){c.fillStyle='#ff2a5a';c.beginPath();c.arc(28,362,6,0,6.3);c.fill();}
   if(Math.random()<.1*dt){c.globalCompositeOperation='lighter';const y=_R(330,470),h=_R(6,22);c.globalAlpha=.4;c.fillStyle='#ff4ad0';c.fillRect(S.x0,y,S.x1-S.x0,h);c.fillStyle='#4adcff';c.fillRect(S.x0+8,y+2,S.x1-S.x0,h);}
   c.globalCompositeOperation='lighter';c.globalAlpha=.07;for(let i=0;i<40;i++){c.fillStyle='#fff';c.fillRect(_R(S.x0,S.x1),_R(S.y0,S.y1),_R(2,24),1);}};});
_fxAdd('erase',()=>{const dust=[];
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
   if(Math.random()<.6*dt)dust.push({x:_R(125,255),y:_R(340,396),vy:-_R(.2,.8),l:0,m:_R(40,90),w:_R(2,6)});
   for(let i=dust.length-1;i>=0;i--){const p=dust[i];p.l+=dt;if(p.l>p.m){dust.splice(i,1);continue;}p.y+=p.vy*dt;c.globalAlpha=(1-p.l/p.m)*.7;c.fillStyle='#fff';c.fillRect(p.x,p.y,p.w,1.6);}
   const cyc=(now%4000)/4000;if(cyc>.5&&cyc<.56){const q=(cyc-.5)/.06;c.globalAlpha=(1-q)*.8;c.strokeStyle='#ffe03a';c.lineWidth=5*(1-q)+1;c.beginPath();c.arc(255,444,q*260,0,6.3);c.stroke();}
   if(Math.random()<.12*dt){const y=_R(335,400);c.globalAlpha=.5;c.fillStyle=Math.random()<.5?'#e0183a':'#4adcff';const dx=_R(-14,14);c.fillRect(S.x0+dx,y,S.x1-S.x0,_R(2,7));}
   c.globalCompositeOperation='source-over';c.font='900 16px monospace';c.textAlign='left';c.fillStyle='#ffe03a';c.globalAlpha=.9;const fnum=cyc<.5?Math.floor(cyc*2*120):cyc<.56?120:120+Math.floor((cyc-.56)*40);c.fillText('FRAME '+String(fnum).padStart(4,'0'),10,430);};});
_fxAdd('disc',()=>{const sp=[];
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
   for(let k=0;k<2;k++){const x=((now*.0004+k*.5)%1)*(S.x1-S.x0+200)+S.x0-100;c.globalAlpha=.2;const g=c.createLinearGradient(x,0,x+80,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'#b0e8ff');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.moveTo(x+20,300);c.lineTo(x+60,300);c.lineTo(x+20,480);c.lineTo(x-40,480);c.fill();}
   if(Math.random()<.4*dt)sp.push({x:_R(S.x0,S.x1),y:_R(335,465),t0:now,r:_R(5,14),h:_R(0,360)});
   for(let i=sp.length-1;i>=0;i--){const s=sp[i],q=(now-s.t0)/700;if(q>1){sp.splice(i,1);continue;}c.globalAlpha=Math.sin(q*3.14);c.fillStyle=`hsl(${s.h},100%,80%)`;_spark4(c,s.x,s.y,s.r*Math.sin(q*3.14)*1.6);}
   _flareH(c,200+Math.sin(now*.0008)*160,402,200,3,'#ffffff',.35);};});
_fxAdd('gravflip',()=>{const sh=[];
  return(c,dt,now,S)=>{const cyc=(now%8000)/8000,dir=cyc<.5?1:-1;c.globalCompositeOperation='lighter';
   _flareH(c,200,402,S.x1/2,3,'#ffffff',.4+.2*Math.sin(now*.01));
   if(Math.random()<.5*dt)sh.push({x:_R(S.x0,S.x1),y:dir>0?S.y0:S.y1,v:_R(3,9),r:_R(0,6),s:_R(3,8)});
   for(let i=sh.length-1;i>=0;i--){const p=sh[i];p.y+=dir*p.v*dt;p.r+=.12*dt;if(p.y<S.y0-20||p.y>S.y1+20){sh.splice(i,1);continue;}c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=.9;c.fillStyle=dir>0?'#b0d0ff':'#ffb0e0';c.beginPath();c.moveTo(0,-p.s);c.lineTo(p.s*.7,p.s*.6);c.lineTo(-p.s*.7,p.s*.6);c.fill();c.restore();c.globalAlpha=.3;c.strokeStyle=c.fillStyle;c.lineWidth=1;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x,p.y-dir*p.v*5);c.stroke();}
   c.globalCompositeOperation='source-over';c.fillStyle=dir>0?'rgba(120,170,255,.55)':'rgba(255,120,200,.55)';for(let i=0;i<5;i++){const x=S.x0+(S.x1-S.x0)*(i+.5)/5,y=402+Math.sin(now*.004+i)*4,d=dir;c.beginPath();c.moveTo(x-12,y+d*6);c.lineTo(x,y-d*8);c.lineTo(x+12,y+d*6);c.lineTo(x,y+d*1);c.fill();}};});
_fxAdd('cosmos',()=>{const sh=[];let nx=800;
  return(c,dt,now,S)=>{const cyc=(now%18000)/18000;c.globalCompositeOperation='lighter';
   for(let k=0;k<3;k++){c.globalAlpha=.18+.1*Math.sin(now*.0007+k);const g=c.createLinearGradient(0,300,0,440);g.addColorStop(0,'rgba(80,255,200,0)');g.addColorStop(.5,['#50ffc8','#7a8aff','#ff7ad8'][k]);g.addColorStop(1,'rgba(80,255,200,0)');c.fillStyle=g;c.beginPath();c.moveTo(S.x0,360+k*10);for(let x=S.x0;x<=S.x1;x+=16)c.lineTo(x,350+k*12+Math.sin(x*.02+now*.0009+k*2)*22);c.lineTo(S.x1,440);c.lineTo(S.x0,440);c.fill();}
   if(now>nx&&!(cyc>.7&&cyc<.88)){nx=now+_R(500,1800);sh.push({x:_R(200,S.x1),y:_R(330,390),t0:now,v:_R(240,420)});}
   for(let i=sh.length-1;i>=0;i--){const s=sh[i],q=(now-s.t0)/600;if(q>1){sh.splice(i,1);continue;}const x=s.x-q*s.v,y=s.y+q*s.v*.22;c.globalAlpha=1-q;const g=c.createLinearGradient(x+90,y-20,x,y);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'#fff');c.strokeStyle=g;c.lineWidth=2.4;c.beginPath();c.moveTo(x+90,y-20);c.lineTo(x,y);c.stroke();}
   if(cyc>.87&&cyc<.93){const q=(cyc-.87)/.06;c.globalAlpha=Math.sin(q*3.14);c.fillStyle='#fff';_spark4(c,260,330,300*Math.sin(q*3.14));_flareH(c,260,330,S.x1,10,'#ffe8c0',Math.sin(q*3.14));}};});
function startFieldAnim(key,fy,fyL){
  if(fyL===undefined)fyL=fy;
  stopFieldAnim();
  const make=FIELD_ANIMS[key];const wrap=document.getElementById('field-wrap');
  if(!make||!wrap||!fieldAnimEnabled())return;
  const cv=document.createElement('canvas');cv.id='field-fx';wrap.appendChild(cv);
  const ctx=cv.getContext('2d'),S={W:0,H:0,scale:1,ox:0,oy:0,dpr:1,x0:0,x1:400,y0:0,y1:800};
  const fit=()=>{
    const r=wrap.getBoundingClientRect();if(r.width<2||r.height<2)return;
    S.dpr=Math.min(window.devicePixelRatio||1,1.5);S.W=r.width;S.H=r.height;cv.width=Math.round(r.width*S.dpr);cv.height=Math.round(r.height*S.dpr);
    S.scale=Math.max(S.W/400,S.H/800);S.ox=(S.W-400*S.scale)*.5;S.oy=(S.H-800*S.scale)*((S.W>S.H?fyL:fy)/100);
    S.x0=-S.ox/S.scale;S.x1=(S.W-S.ox)/S.scale;S.y0=-S.oy/S.scale;S.y1=(S.H-S.oy)/S.scale;
  };
  fit();
  const A={alive:true,raf:0,ro:null};_fieldAnim=A;
  if(window.ResizeObserver){A.ro=new ResizeObserver(fit);A.ro.observe(wrap);}
  const step=make();let last=performance.now();
  const frame=now=>{
    if(!A.alive)return;A.raf=requestAnimationFrame(frame);
    const g=document.getElementById('game');
    if(!g||!g.classList.contains('active')||document.hidden||S.W<2){last=now;return;}
    const dt=Math.min(2.5,(now-last)/16.67);last=now;
    if(!step.trail){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);}
    ctx.setTransform(S.dpr*S.scale,0,0,S.dpr*S.scale,S.dpr*S.ox,S.dpr*S.oy);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    step(ctx,dt,now,S);
  };
  A.raf=requestAnimationFrame(frame);
}

// ── 実績報酬の風景 ──
Object.assign(LOBBY_SCENES,{
  // 赤富士
  fuji(){const r=_rng(111),hy=560;
    const BODY='M-160 560C-70 548 10 510 60 455C100 410 160 350 188 326Q200 318 212 326C240 350 300 410 340 455C390 510 470 548 560 560Z';
    let dark='',light='';
    for(let k=0;k<18;k++){const t=(k/17)*2-1,d=`M${(200+t*18).toFixed(1)} ${(330+r()*6).toFixed(1)}Q${(200+t*100).toFixed(1)} ${(440+r()*16-8).toFixed(1)} ${(200+t*340).toFixed(1)} ${hy}`;
      if(k%2)dark+=`<path d="${d}" stroke="rgba(60,12,44,.42)" stroke-width="${(1+r()*2.6).toFixed(1)}" fill="none"/>`;else light+=`<path d="${d}" stroke="rgba(255,176,120,.26)" stroke-width="${(1+r()*2.2).toFixed(1)}" fill="none"/>`;}
    let snow='M90 300L310 300L312 392';for(let x=310,j=0;x>88;x-=9,j++){const tg=(j%3===1)?26+r()*40:4+r()*16;snow+=`L${x} ${(396+tg).toFixed(1)}L${x-4.5} ${(388+r()*8).toFixed(1)}`;}snow+='L88 392Z';
    return `<defs><clipPath id="fc"><path d="${BODY}"/></clipPath>${_vgrad('sk',[[0,'#171046'],[.3,'#6a3470'],[.55,'#f08a58'],[.7,'#ffd090']])}${_glow('sg','#fff2b8','#ff9a5a')}
      ${_vgrad('fb',[[0,'#e8704c'],[.3,'#b8443e'],[.7,'#7a2a44'],[1,'#3a1a40']])}${_vgrad('fs',[[0,'#fff4ea'],[1,'#ffc4aa']])}
      <linearGradient id="sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a0a30" stop-opacity="0"/><stop offset="1" stop-color="#2a0a30" stop-opacity=".7"/></linearGradient>
      ${_vgrad('lk',[[0,'#d0643e'],[.35,'#5a2a4a'],[1,'#1a1030']])}${_vgrad('hz',[[0,'#ffb890',0],[1,'#ffb890',.5]])}
      ${_cloudDef('c1','0.006 0.04',4,5,[1,.78,.7],2.6,-1.05)}${_band('m1',380,560,.2,.8)}${_cloudDef('rp','0.012 0.2',3,6,[1,.7,.5],1.4,-.45)}${_band('m2',560,800,.0,.5)}<filter id="bb"><feGaussianBlur stdDeviation="1.6"/></filter></defs>
      <rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,330,120)}<circle cx="200" cy="318" r="340" fill="url(#sg)"/><circle cx="200" cy="312" r="17" fill="#fff6d0"/>
      <path d="M0 560V520Q60 500 120 524T220 530T330 514T400 508V560Z" fill="#4a2450" opacity=".85"/>
      <path d="${BODY}" fill="url(#fb)"/><g clip-path="url(#fc)">${dark}${light}<path d="M200 318L560 560L-160 560Z" fill="url(#sh)" opacity=".5"/><path d="${snow}" fill="url(#fs)"/><path d="${snow}" fill="url(#sh)" opacity=".28"/></g>
      <path d="${BODY}" fill="none" stroke="rgba(255,206,150,.45)" stroke-width="1"/>
      <rect width="400" height="800" filter="url(#c1)" mask="url(#m1)" opacity=".38"/><rect y="500" width="400" height="62" fill="url(#hz)"/>
      <rect y="${hy}" width="400" height="240" fill="url(#lk)"/>
      <g opacity=".42" filter="url(#bb)"><g transform="translate(0 ${hy*1.7}) scale(1 -.7)"><path d="${BODY}" fill="url(#fb)"/><path d="${snow}" fill="url(#fs)" clip-path="url(#fc)"/></g></g>
      <rect width="400" height="800" filter="url(#rp)" mask="url(#m2)" opacity=".55"/><rect y="${hy}" width="400" height="2" fill="rgba(255,190,140,.4)"/>
      <clipPath id="edge"><rect x="0" y="380" width="70" height="190"/><rect x="330" y="380" width="70" height="190"/></clipPath><path d="${_pines(r,hy,60,130,24)}" fill="#10061a" clip-path="url(#edge)"/>`;},
  // 雨の街
  cityrain(){const r=_rng(121),NE=[[70,640,'#ff3aa0'],[170,610,'#3ad8ff'],[262,650,'#ffd23a'],[340,620,'#ff3aa0'],[120,690,'#a060ff']];
    const bld=(base,hMin,hMax,wMin,wMax,fill,win)=>{let s='',x=-5;while(x<405){const w=wMin+r()*(wMax-wMin),h=hMin+r()*(hMax-hMin);s+=`<rect x="${x.toFixed(1)}" y="${(base-h).toFixed(1)}" width="${(w+1).toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}"/>`;
      if(r()<.25)s+=`<rect x="${(x+w/2-1).toFixed(1)}" y="${(base-h-12).toFixed(1)}" width="2" height="12" fill="${fill}"/>`;
      if(win){for(let wy=base-h+6;wy<base-6;wy+=7)for(let wx=x+3;wx<x+w-3;wx+=6){if(r()<win)s+=`<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="3" height="4" fill="${['#ffd88a','#ffe8b0','#8ae8ff','#ff9ad0'][Math.floor(r()*4)]}" opacity="${(.5+r()*.5).toFixed(2)}"/>`;}}x+=w+r()*3;}return s;};
    const neon=NE.map(([x,y,c])=>`<g><rect x="${x-14}" y="${y-5}" width="28" height="10" rx="3" fill="${c}" filter="url(#nb)" opacity=".85"/><rect x="${x-12}" y="${y-3}" width="24" height="6" rx="2" fill="${c}"/><rect x="${x-9}" y="${y-1}" width="18" height="2" fill="#fff" opacity=".7"/></g>`).join('');
    const refl=NE.map(([x,y,c])=>`<rect x="${x-10}" y="702" width="20" height="${70+r()*50}" fill="${c}" opacity=".22" filter="url(#nb2)"/>`).join('');
    return `<defs>${_vgrad('sk',[[0,'#080414'],[.35,'#1c0c3a'],[.62,'#5a2060'],[.8,'#a03a70']])}${_vgrad('rd',[[0,'#1a0c2c'],[.4,'#0a0618'],[1,'#030208']])}
      <filter id="nb"><feGaussianBlur stdDeviation="5"/></filter><filter id="nb2"><feGaussianBlur stdDeviation="4"/></filter>
      ${_cloudDef('c1','0.005 0.03',4,4,[.7,.25,.55],2.6,-1.05)}${_band('m1',200,640,.2,.8)}${_cloudDef('wt','0.01 0.12',3,3,[.7,.5,.9],1.6,-.7)}${_band('m2',700,800,.05,.7)}</defs>
      <rect width="400" height="800" fill="url(#sk)"/><rect width="400" height="800" filter="url(#c1)" mask="url(#m1)" opacity=".8"/>
      ${bld(610,40,130,10,26,'#1a0c32',.18)}${bld(650,60,190,14,34,'#10081f',.24)}${bld(704,100,260,20,44,'#08040f',.28)}${neon}
      <rect y="700" width="400" height="100" fill="url(#rd)"/>${refl}<rect width="400" height="800" filter="url(#wt)" mask="url(#m2)" opacity=".5"/>
      <path d="M0 770H400" stroke="#ffd88a" stroke-width="1.4" stroke-dasharray="26 20" opacity=".25"/><rect y="700" width="400" height="2" fill="#ff8ac8" opacity=".35"/>`;},
  // 鯉の池
  koi(){const r=_rng(131);
    let pads='';for(let i=0;i<13;i++){const x=40+r()*320,y=120+r()*600,rad=14+r()*20,a=r()*6;
      pads+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(a*57).toFixed(0)})"><path d="M0 0L${(rad*.966).toFixed(1)} ${(-rad*.259).toFixed(1)}A${rad} ${rad} 0 1 0 ${(rad*.966).toFixed(1)} ${(rad*.259).toFixed(1)}Z" fill="url(#pad)"/><path d="M0 0L${rad*.9} ${(rad*.3).toFixed(1)}M0 0L${(-rad*.5).toFixed(1)} ${(rad*.8).toFixed(1)}M0 0L${(-rad*.5).toFixed(1)} ${(-rad*.8).toFixed(1)}" stroke="rgba(10,50,20,.5)" stroke-width=".8" fill="none"/></g>`;}
    let lot='';for(let i=0;i<5;i++){const x=60+r()*280,y=160+r()*540;let p='';for(let k=0;k<8;k++)p+=`<ellipse cx="0" cy="-7" rx="3.4" ry="8" transform="rotate(${k*45})" fill="${k%2?'#ffd0e2':'#ffb0cc'}"/>`;lot+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${p}<circle r="3" fill="#ffe27a"/></g>`;}
    let rocks='';for(let i=0;i<14;i++){const left=i<7,y=40+i%7*110+r()*30,x=left?r()*26:400-r()*26,rx=22+r()*22,ry=18+r()*18;rocks+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="url(#rk)"/><ellipse cx="${(x-rx*.25).toFixed(0)}" cy="${(y-ry*.3).toFixed(0)}" rx="${(rx*.5).toFixed(0)}" ry="${(ry*.3).toFixed(0)}" fill="rgba(255,255,255,.12)"/>`;}
    return `<defs><radialGradient id="wt" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="#1a7078"/><stop offset=".6" stop-color="#0c4650"/><stop offset="1" stop-color="#05262e"/></radialGradient>
      <radialGradient id="pad" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#6ac060"/><stop offset="1" stop-color="#1e6a34"/></radialGradient><radialGradient id="rk" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#6a7078"/><stop offset="1" stop-color="#1c2026"/></radialGradient>
      ${_cloudDef('cs','0.012 0.012',4,6,[.7,1,1],2.8,-1.2)}${_cloudDef('dk','0.006 0.006',3,2,[0,.06,.08],1.6,-.5)}<filter id="sd"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <rect width="400" height="800" fill="url(#wt)"/><rect width="400" height="800" filter="url(#dk)" opacity=".6"/><rect width="400" height="800" filter="url(#cs)" opacity=".22"/>
      <g filter="url(#sd)" opacity=".4" transform="translate(5 6)">${pads}</g>${pads}${lot}${rocks}`;},
  // 花火大会
  fireworks(){const r=_rng(141),hy=560;
    const city=(base,hMin,hMax,fill)=>{let s='',x=-5;while(x<405){const w=8+r()*22,h=hMin+r()*(hMax-hMin);s+=`<rect x="${x.toFixed(1)}" y="${(base-h).toFixed(1)}" width="${(w+1).toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}"/>`;for(let wy=base-h+5;wy<base-4;wy+=6)for(let wx=x+2;wx<x+w-2;wx+=5)if(r()<.28)s+=`<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="2.4" height="3" fill="#ffd890" opacity="${(.4+r()*.6).toFixed(2)}"/>`;x+=w+r()*2;}return s;};
    let lights='';for(let i=0;i<46;i++){const x=r()*400;lights+=`<rect x="${x.toFixed(1)}" y="${hy+2}" width="2.6" height="${(20+r()*70).toFixed(0)}" fill="${['#ffd890','#ff9ad0','#8ae8ff'][Math.floor(r()*3)]}" opacity="${(.12+r()*.2).toFixed(2)}"/>`;}
    return `<defs>${_vgrad('sk',[[0,'#02030c'],[.45,'#0a0c30'],[.7,'#241040']])}${_vgrad('wt',[[0,'#1c1040'],[.3,'#0a0a28'],[1,'#02020a']])}<filter id="bl"><feGaussianBlur stdDeviation="2.5"/></filter>
      ${_cloudDef('wv','0.008 0.1',3,3,[.7,.6,1],1.5,-.6)}${_band('m2',560,800,.02,.6)}</defs>
      <rect width="400" height="800" fill="url(#sk)"/>${_stars(r,0,520,260)}
      <path d="${_ridge(r,{base:540,amp:24,rough:.6,bottom:hy}).fill}" fill="#0a0820"/>${city(hy,14,60,'#0c0a22')}
      <rect y="${hy}" width="400" height="240" fill="url(#wt)"/><g filter="url(#bl)">${lights}</g><rect width="400" height="800" filter="url(#wv)" mask="url(#m2)" opacity=".5"/>
      ${[[90,640],[300,700]].map(([x,y])=>`<g transform="translate(${x} ${y})"><path d="M-16 0Q0 8 16 0L12 6H-12Z" fill="#05040e"/><circle cx="0" cy="-4" r="2.2" fill="#ffb060"/><circle cx="0" cy="-4" r="9" fill="#ffb060" opacity=".25"/></g>`).join('')}
      <rect y="${hy}" width="400" height="1.6" fill="#8a70d0" opacity=".4"/>`;},
});
Object.assign(FIELD_SCENE_FOCUS,{fuji:44,cityrain:70,koi:50,fireworks:[72,62]});

// ── 実績報酬の風景のアニメーション ──
Object.assign(FIELD_ANIMS,{
  fuji(){
    const spr=glowSprite('255,214,226'),gl=glowSprite('255,226,170'),w=Array.from({length:8},()=>({x:_R(-100,400),y:_R(400,540),w:_R(150,270),h:_R(24,50),vx:_R(.05,.16)}));
    const birds=Array.from({length:4},()=>({x:_R(0,400),y:_R(200,330),s:_R(4,7),sp:_R(.2,.45),ph:_R(0,6)}));
    const gl2=Array.from({length:70},()=>{const i=Math.random();return{x:200+(Math.random()-.5)*(30+i*300),y:565+i*170,ph:_R(0,6.28),sp:_R(.002,.006),w:_R(3,12)};});
    return (c,dt,now,S)=>{
      c.globalCompositeOperation='lighter';c.globalAlpha=.16+.08*Math.sin(now*.0008);c.drawImage(gl,50,150,300,300);
      c.globalAlpha=.3;for(const m of w){m.x+=m.vx*dt;if(m.x>420)m.x=-m.w;c.drawImage(spr,m.x,m.y,m.w,m.h);}
      c.fillStyle='#ffd0a0';for(const g of gl2){c.globalAlpha=Math.max(0,Math.sin(g.ph+now*g.sp))*.55;c.fillRect(g.x+Math.sin(now*.001+g.ph)*3-g.w/2,g.y,g.w,1.2);}
      c.globalCompositeOperation='source-over';c.strokeStyle='#2a1a3a';c.lineWidth=1.2;c.globalAlpha=.8;c.lineCap='round';
      for(const b of birds){b.x+=b.sp*dt;if(b.x>S.x1+20)b.x=S.x0-20;b.ph+=.08*dt;_bird(c,b.x,b.y+Math.sin(now*.0006+b.ph)*6,b.s,b.ph);}
    };
  },
  cityrain(){
    const NE=[[70,640,'255,58,160'],[170,610,'58,216,255'],[262,650,'255,210,58'],[340,620,'255,58,160'],[120,690,'160,96,255']];
    const sp=NE.map(n=>glowSprite(n[2])),rain=[],rip=[],cars=[{x:-40,y:740,dir:1,sp:2.4,c:'255,240,200'},{x:440,y:770,dir:-1,sp:1.8,c:'255,70,70'}];let ready=false,nr=0;
    const hl=glowSprite('255,240,200'),tl=glowSprite('255,70,70');
    return (c,dt,now,S)=>{
      if(!ready){for(let i=0;i<190;i++)rain.push({x:_rv(S,'x'),y:_rv(S,'y'),len:_R(9,24),v:_R(9,15),a:_R(.18,.5)});ready=true;}
      c.globalCompositeOperation='lighter';
      NE.forEach((n,i)=>{const f=.5+.35*Math.sin(now*.003+i*2)+(Math.random()<.01?-.3:0);c.globalAlpha=Math.max(.1,f);c.drawImage(sp[i],n[0]-34,n[1]-34,68,68);});
      for(const car of cars){car.x+=car.dir*car.sp*dt;if(car.x>460||car.x<-60){car.x=car.dir>0?-40:440;}
        c.globalAlpha=.9;c.drawImage(car.dir>0?hl:tl,car.x-16,car.y-12,32,24);c.globalAlpha=.5;c.drawImage(car.dir>0?tl:hl,car.x-car.dir*22-8,car.y-6,16,12);c.globalAlpha=.18;c.drawImage(car.dir>0?hl:tl,car.x-26,car.y+22,52,40);}
      c.globalCompositeOperation='source-over';
      c.strokeStyle='#cfe0ff';c.lineWidth=.8;
      for(const d of rain){d.y+=d.v*dt;d.x-=d.v*.22*dt;if(d.y>S.y1+10||d.x<S.x0-10){d.y=S.y0-_R(0,40);d.x=_R(S.x0,S.x1+60);}
        c.globalAlpha=d.a;c.beginPath();c.moveTo(d.x,d.y);c.lineTo(d.x+d.len*.22,d.y-d.len);c.stroke();}
      nr-=dt;if(nr<=0){rip.push({x:_R(10,390),y:_R(712,792),r:1,l:1});nr=_R(1,3);}
      c.strokeStyle='#d8e8ff';
      for(let i=rip.length-1;i>=0;i--){const g=rip[i];g.r+=.35*dt;g.l-=.03*dt;if(g.l<=0){rip.splice(i,1);continue;}c.globalAlpha=g.l*.5;c.beginPath();c.ellipse(g.x,g.y,g.r*2.2,g.r*.6,0,0,6.283);c.stroke();}
    };
  },
  koi(){
    const mk=(i)=>{const n=[];const x=_R(80,320),y=_R(220,640),a=_R(0,6.28);for(let k=0;k<13;k++)n.push({x:x-Math.cos(a)*k*5,y:y-Math.sin(a)*k*5});
      return {n,a,t:_R(0,6),sp:_R(.5,.9),sz:_R(.8,1.25),kind:i%4,tx:_R(80,320),ty:_R(200,660),ph:_R(0,6)};};
    const K=Array.from({length:6},(_,i)=>mk(i)),rip=[],petals=Array.from({length:12},()=>({x:_R(0,400),y:_R(0,800),vx:_R(-.1,.1),vy:_R(-.08,.08),rot:_R(0,6),s:_R(3,5)}));let nr=1;
    const cols=[['#ff7a28','#fff1e0','#222'],['#fff1e0','#ff6a20','#222'],['#ff9a40','#ffe8c8','#ff4a10'],['#f4f0e8','#222','#ff7a28']];
    return (c,dt,now,S)=>{
      for(const k of K){
        const h=k.n[0];k.t-=dt;if(k.t<=0||Math.hypot(k.tx-h.x,k.ty-h.y)<30){k.tx=_R(70,330);k.ty=_R(Math.max(160,S.y0+30),Math.min(700,S.y1-30));k.t=_R(120,360);}
        let d=Math.atan2(k.ty-h.y,k.tx-h.x)-k.a;while(d>Math.PI)d-=6.283;while(d<-Math.PI)d+=6.283;k.a+=Math.max(-.035,Math.min(.035,d))*dt;
        const sp=k.sp*(.8+.2*Math.sin(now*.002+k.ph));h.x+=Math.cos(k.a)*sp*dt;h.y+=Math.sin(k.a)*sp*dt;
        for(let i=1;i<k.n.length;i++){const p=k.n[i-1],q=k.n[i],dx=p.x-q.x,dy=p.y-q.y,L=Math.hypot(dx,dy)||1,gap=5*k.sz;q.x=p.x-dx/L*gap;q.y=p.y-dy/L*gap;}
        const col=cols[k.kind];c.globalAlpha=.16;c.fillStyle='#000';
        for(let i=0;i<k.n.length;i++){const q=k.n[i],r=(i<3?3.2+i*.9:(5.4-(i-3)*.42))*k.sz;c.beginPath();c.arc(q.x+5,q.y+7,Math.max(1,r),0,6.283);c.fill();}
        c.globalAlpha=.95;
        // 尾びれ
        const tl=k.n[k.n.length-1],tp=k.n[k.n.length-3],ta=Math.atan2(tl.y-tp.y,tl.x-tp.x),wag=Math.sin(now*.008*k.sp+k.ph)*.5;
        c.fillStyle=col[0];c.beginPath();c.moveTo(tl.x,tl.y);c.lineTo(tl.x+Math.cos(ta+wag+.5)*13*k.sz,tl.y+Math.sin(ta+wag+.5)*13*k.sz);c.lineTo(tl.x+Math.cos(ta+wag-.5)*13*k.sz,tl.y+Math.sin(ta+wag-.5)*13*k.sz);c.closePath();c.globalAlpha=.7;c.fill();c.globalAlpha=.95;
        for(let i=k.n.length-1;i>=0;i--){const q=k.n[i],r=(i<3?3.2+i*.9:(5.4-(i-3)*.42))*k.sz;c.fillStyle=(i%5===2)?col[1]:(i%5===4?col[2]:col[0]);if(i===0||i===1)c.fillStyle=col[0];c.beginPath();c.arc(q.x,q.y,Math.max(1.2,r),0,6.283);c.fill();}
        // 胸びれ
        const f=k.n[2],fa=k.a;c.fillStyle=col[0];c.globalAlpha=.6;[-1,1].forEach(sd=>{c.beginPath();c.ellipse(f.x-Math.cos(fa)*2+Math.cos(fa+sd*1.6)*5,f.y-Math.sin(fa)*2+Math.sin(fa+sd*1.6)*5,4,1.6,fa+sd*.9+Math.sin(now*.006+k.ph)*.3,0,6.283);c.fill();});
        c.globalAlpha=1;c.fillStyle='#111';[-1,1].forEach(sd=>{c.beginPath();c.arc(h.x+Math.cos(k.a+sd*.9)*3,h.y+Math.sin(k.a+sd*.9)*3,.8,0,6.283);c.fill();});
        if(Math.random()<.004)rip.push({x:h.x+Math.cos(k.a)*8,y:h.y+Math.sin(k.a)*8,r:2,l:1});
      }
      nr-=dt/60;if(nr<=0){rip.push({x:_R(40,360),y:_R(Math.max(100,S.y0),Math.min(720,S.y1)),r:2,l:1});nr=_R(1.2,3);}
      c.strokeStyle='#bfeeee';c.lineWidth=.9;
      for(let i=rip.length-1;i>=0;i--){const g=rip[i];g.r+=.32*dt;g.l-=.007*dt;if(g.l<=0){rip.splice(i,1);continue;}c.globalAlpha=g.l*.5;c.beginPath();c.arc(g.x,g.y,g.r,0,6.283);c.stroke();}
      c.fillStyle='#ffc8dc';for(const p of petals){p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=.004*dt;if(p.x<-10)p.x=410;if(p.x>410)p.x=-10;if(p.y<-10)p.y=810;if(p.y>810)p.y=-10;c.globalAlpha=.8;c.save();c.translate(p.x,p.y);c.rotate(p.rot);c.beginPath();c.ellipse(0,0,p.s,p.s*.55,0,0,6.283);c.fill();c.restore();}
    };
  },
  fireworks(){
    const HUES=[0,18,42,50,120,170,200,265,310,335],hy=560;let rockets=[],parts=[],glows=[],next=.3;
    const spr=glowSprite('255,230,200');let SV={y0:0,y1:800};
    const burst=(x,y,hue)=>{
      const K=Math.max(.2,Math.min(1,(SV.y1-SV.y0)/460)); // 画面が低いときは花火を小さく
      glows.push({x,y,r:_R(70,120)*K,l:16,m:16,hue});
      const q=Math.random(),kind=q<.4?'peony':q<.65?'chrys':q<.82?'willow':q<.94?'ring':'heart',add=(n,f)=>{for(let i=0;i<n;i++)parts.push(f(i,n));};
      const base=(vx,vy,o)=>Object.assign({x,y,vx:vx*K,vy:vy*K,hue,drag:.982,grav:.04*K,size:Math.max(.8,1.4*K+.3),flick:false,life:80,max:80},o);
      if(kind==='peony')add(90,()=>{const a=_R(0,6.28),v=_R(1.6,4.2);return base(Math.cos(a)*v,Math.sin(a)*v,{max:_R(60,85),life:0});});
      else if(kind==='chrys')add(110,()=>{const a=_R(0,6.28),v=_R(1.2,4.6);return base(Math.cos(a)*v,Math.sin(a)*v,{max:_R(75,100),flick:true,life:0});});
      else if(kind==='willow')add(80,()=>{const a=_R(0,6.28),v=_R(1.1,3.4);return base(Math.cos(a)*v,Math.sin(a)*v,{max:_R(110,150),drag:.972,grav:.05,hue:42,flick:true,life:0});});
      else if(kind==='ring'){const tilt=_R(.35,1),rot=_R(0,3.14);add(60,(i,n)=>{const a=i/n*6.28,v=3.4,vx0=Math.cos(a)*v,vy0=Math.sin(a)*v*tilt;return base(vx0*Math.cos(rot)-vy0*Math.sin(rot),vx0*Math.sin(rot)+vy0*Math.cos(rot),{max:_R(60,75),life:0});});}
      else add(80,(i,n)=>{const t=i/n*6.28,hx=16*Math.pow(Math.sin(t),3),hy2=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));return base(hx*.2,hy2*.2,{max:80,hue:335,drag:.986,life:0});});
      parts.forEach(p=>{if(p.life===0)p.life=p.max;});
    };
    const f=(c,dt,now,S)=>{
      SV=S;
      c.globalCompositeOperation='destination-out';c.fillStyle=`rgba(0,0,0,${Math.min(.5,.2*dt)})`;c.fillRect(S.x0-5,S.y0-5,S.x1-S.x0+10,S.y1-S.y0+10);
      c.globalCompositeOperation='lighter';
      next-=dt/60;
      if(next<=0&&rockets.length<3){
        const vh=S.y1-S.y0;let lo=Math.max(S.y0+vh*.38,300),hi=Math.min(hy-70,S.y1-vh*.15);
        if(hi<lo){lo=S.y0+vh*.2;hi=S.y0+vh*.6;}
        const tx=_R(Math.max(40,S.x0+30),Math.min(360,S.x1-30)),top=_R(lo,hi),startY=Math.min(hy-4,S.y1+12),dist=Math.max(30,startY-top),g=.1;
        rockets.push({x:tx,y:startY,vy:-Math.sqrt(2*g*dist),g,hue:HUES[Math.floor(Math.random()*HUES.length)]});next=_R(.8,2.2);}
      rockets=rockets.filter(r=>{r.vy+=r.g*dt;r.y+=r.vy*dt;
        for(let i=0;i<2;i++)parts.push({x:r.x+_R(-.8,.8),y:r.y,vx:_R(-.2,.2),vy:_R(.2,.8),life:_R(10,18),max:18,hue:40,drag:.95,grav:.02,size:.8,spark:true});
        c.globalAlpha=1;c.fillStyle='hsl(45,100%,85%)';c.beginPath();c.arc(r.x,r.y,1.6,0,6.283);c.fill();
        if(r.vy>=-.6){burst(r.x,r.y,r.hue);return false;}return true;});
      glows=glows.filter(g=>{g.l-=dt;if(g.l<=0)return false;const k=g.l/g.m,gr=c.createRadialGradient(g.x,g.y,0,g.x,g.y,g.r);gr.addColorStop(0,`hsla(${g.hue},100%,70%,${.32*k})`);gr.addColorStop(1,`hsla(${g.hue},100%,50%,0)`);c.globalAlpha=1;c.fillStyle=gr;c.beginPath();c.arc(g.x,g.y,g.r,0,6.283);c.fill();return true;});
      parts=parts.filter(p=>{p.life-=dt;if(p.life<=0)return false;const dr=Math.pow(p.drag,dt);p.vx*=dr;p.vy=p.vy*dr+p.grav*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;const k=p.life/p.max;
        if(p.flick&&k<.5&&Math.random()<.35)return true;const l=p.spark?70:(55+35*Math.pow(k,3));c.fillStyle=`hsla(${p.hue},100%,${l}%,${Math.min(1,k*1.6)})`;c.globalAlpha=1;
        c.beginPath();c.arc(p.x,p.y,p.size*(.5+.5*k),0,6.283);c.fill();
        if(p.y<hy&&!p.spark){c.globalAlpha=.22;c.beginPath();c.arc(p.x,hy*2-p.y,p.size*(.5+.5*k),0,6.283);c.fill();} // 水面に映る
        return true;});
      c.globalCompositeOperation='source-over';c.globalAlpha=1;
    };
    f.trail=true;return f;
  },
});

const GACHA_ITEMS=[
  {id:'theme_gold', rarity:'common', category:'theme', icon:'🟡', title:'金の裏地', desc:'牌の裏デザイン：金', value:'gold'},
  {id:'theme_sakura', rarity:'common', category:'theme', icon:'🌸', title:'桜の裏地', desc:'牌の裏デザイン：桜', value:'sakura'},
  {id:'theme_indigo', rarity:'common', category:'theme', icon:'🔷', title:'藍の裏地', desc:'牌の裏デザイン：藍', value:'indigo'},
  {id:'theme_jade', rarity:'common', category:'theme', icon:'🟢', title:'翡翠の裏地', desc:'牌の裏デザイン：翡翠', value:'jade'},
  {id:'theme_ice', rarity:'common', category:'theme', icon:'🧊', title:'氷の裏地', desc:'牌の裏デザイン：氷', value:'ice'},
  {id:'theme_ember', rarity:'uncommon', category:'theme', icon:'🔥', title:'炎の裏地', desc:'牌の裏デザイン：炎', value:'ember'},
  {id:'theme_obsidian', rarity:'uncommon', category:'theme', icon:'⚫', title:'黒曜の裏地', desc:'牌の裏デザイン：黒曜', value:'obsidian'},
  {id:'theme_galaxy', rarity:'rare', category:'theme', icon:'🌌', title:'銀河の裏地', desc:'牌の裏デザイン：銀河', value:'galaxy'},
  {id:'theme_rainbow', rarity:'superrare', category:'theme', icon:'🌈', title:'虹の裏地', desc:'牌の裏デザイン：虹', value:'rainbow'},
  {id:'bg_sunset', rarity:'uncommon', category:'fieldbg', type:'scene', icon:'🌅', title:'夕焼けの海', desc:'場の背景：夕焼けの海', get value(){return sceneUri('sunset');}},
  {id:'bg_ocean', rarity:'uncommon', category:'fieldbg', type:'scene', icon:'🌊', title:'深海', desc:'場の背景：光が差す深海', get value(){return sceneUri('ocean');}},
  {id:'bg_forest', rarity:'uncommon', category:'fieldbg', type:'scene', icon:'🌲', title:'朝霧の森', desc:'場の背景：朝霧の森', get value(){return sceneUri('forest');}},
  {id:'bg_dunes', rarity:'uncommon', category:'fieldbg', type:'scene', icon:'🏜️', title:'砂丘の夕景', desc:'場の背景：砂丘の夕景', get value(){return sceneUri('dunes');}},
  {id:'bg_snowfield', rarity:'uncommon', category:'fieldbg', type:'scene', icon:'⛄', title:'雪原の夜', desc:'場の背景：月明かりの雪原', get value(){return sceneUri('snowfield');}},
  {id:'bg_fireflies', rarity:'uncommon', category:'fieldbg', type:'scene', icon:'🪲', title:'蛍の夜', desc:'場の背景：蛍が舞う水辺', get value(){return sceneUri('fireflies');}},
  {id:'bg_aurora', rarity:'rare', category:'fieldbg', type:'scene', icon:'🌌', title:'オーロラ', desc:'場の背景：湖面に映るオーロラ', get value(){return sceneUri('aurora');}},
  {id:'bg_mountain', rarity:'rare', category:'fieldbg', type:'scene', icon:'🏔️', title:'山稜の朝焼け', desc:'場の背景：雲海と山並みの朝焼け', get value(){return sceneUri('mountain');}},
  {id:'bg_waves', rarity:'rare', category:'fieldbg', type:'scene', icon:'🌙', title:'月夜の海', desc:'場の背景：月明かりの海', get value(){return sceneUri('waves');}},
  {id:'bg_sakuranight', rarity:'rare', category:'fieldbg', type:'scene', icon:'🌸', title:'夜桜', desc:'場の背景：月夜の夜桜', get value(){return sceneUri('sakuranight');}},
  {id:'bg_nebula', rarity:'rare', category:'fieldbg', type:'scene', icon:'🔭', title:'星雲', desc:'場の背景：宇宙の星雲', get value(){return sceneUri('nebula');}},
  // Game Overシリーズ（GitHubにアップロードした画像を場の背景にする）。
  {id:'bg_gameover1',  rarity:'rare', category:'fieldbg', type:'image', icon:'💀', title:'Game Over I',  desc:'場の背景：Game Overシリーズ', value:'https://carupisu0320.github.io/rikka-game-Smartphone/gameover1.png'},
  {id:'bg_gameover2',  rarity:'rare', category:'fieldbg', type:'image', icon:'💀', title:'Game Over II', desc:'場の背景：Game Overシリーズ', value:'https://carupisu0320.github.io/rikka-game-Smartphone/gameover2.png'},
  {id:'bg_galaxy', rarity:'superrare', category:'fieldbg', type:'scene', icon:'🌠', title:'銀河', desc:'場の背景：渦を巻く銀河', get value(){return sceneUri('galaxy');}},
  {id:'confetti_pop', rarity:'common', category:'confetti', icon:'🎉', title:'ポップな紙吹雪', desc:'カラフルな基本の紙吹雪', value:['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#c77dff']},
  {id:'confetti_snow', rarity:'common', category:'confetti', icon:'❄️', title:'雪の結晶', desc:'紙吹雪が雪のように白く', value:['#ffffff','#e8f4ff','#c8e4ff','#a8d0ff','#f4faff']},
  {id:'confetti_fire', rarity:'uncommon', category:'confetti', icon:'🔥', title:'炎の紙吹雪', desc:'紙吹雪が燃える色に', value:['#ff3a10','#ff7a20','#ffb030','#ffe070','#c81a08']},
  {id:'confetti_gold', rarity:'rare', category:'confetti', icon:'✨', title:'黄金の紙吹雪', desc:'上がった時の紙吹雪が金色に', value:['#f5e060','#ffd700','#e0a020','#fff4c0','#c9a84c']},
  {id:'confetti_sakura', rarity:'rare', category:'confetti', icon:'🌸', title:'桜吹雪', desc:'上がった時の紙吹雪が桜色に', value:['#ffb0c8','#ff8aa8','#ffd0dc','#e878b0','#fff0f4']},
  {id:'confetti_neon', rarity:'rare', category:'confetti', icon:'💠', title:'ネオン', desc:'紙吹雪がネオンカラーに', value:['#00ffd0','#ff30c0','#40a0ff','#ffee40','#a040ff']},
  {id:'confetti_rainbow', rarity:'superrare', category:'confetti', icon:'🌈', title:'虹の紙吹雪', desc:'あらゆる色が舞う紙吹雪', value:['#ff4040','#ff9a30','#ffe030','#40d870','#30a8ff','#a050ff','#ff60c0']},
  {id:'title_first', rarity:'common', category:'title', icon:'🔰', title:'駆け出しの打ち手', desc:'名前の横に称号が付きます', value:'駆け出しの打ち手'},
  {id:'title_zoro', rarity:'uncommon', category:'title', icon:'🎲', title:'ゾロ目好き', desc:'名前の横に称号が付きます', value:'ゾロ目好き'},
  {id:'title_apprentice', rarity:'uncommon', category:'title', icon:'📜', title:'牌の見習い', desc:'名前の横に称号が付きます', value:'牌の見習い'},
  {id:'title_fate', rarity:'rare', category:'title', icon:'🎴', title:'運命の引き手', desc:'名前の横に称号が付きます', value:'運命の引き手'},
  {id:'title_sight', rarity:'rare', category:'title', icon:'👁️', title:'千里眼', desc:'名前の横に称号が付きます', value:'千里眼'},
  {id:'title_mountain', rarity:'rare', category:'title', icon:'⛰️', title:'山を張る者', desc:'名前の横に称号が付きます', value:'山を張る者'},
  {id:'title_rikka', rarity:'superrare', category:'title', icon:'🏆', title:'六華の使い手', desc:'名前の横に称号が付きます', value:'六華の使い手'},
  {id:'title_legend', rarity:'superrare', category:'title', icon:'👑', title:'伝説のプレイヤー', desc:'名前の横に称号が付きます', value:'伝説のプレイヤー'},
  {id:'title_king', rarity:'superrare', category:'title', icon:'🔱', title:'六華の覇王', desc:'名前の横に称号が付きます', value:'六華の覇王'},
];
// 実績の報酬（ガチャには出ない景品）。achievement に、もらえる実績のIDを入れる
GACHA_ITEMS.push(
  {id:'bg_koi',        rarity:'rare', category:'fieldbg', type:'scene', icon:'🐟', title:'鯉の池',     desc:'場の背景：蓮の池を泳ぐ鯉', achievement:'win_10',     get value(){return sceneUri('koi');}},
  {id:'bg_cityrain',   rarity:'rare', category:'fieldbg', type:'scene', icon:'🌃', title:'雨の街',     desc:'場の背景：ネオンが滲む雨の夜', achievement:'win_50',  get value(){return sceneUri('cityrain');}},
  {id:'bg_fuji',       rarity:'rare', category:'fieldbg', type:'scene', icon:'🗻', title:'赤富士',     desc:'場の背景：朝日に染まる赤富士', achievement:'role_rikka', get value(){return sceneUri('fuji');}},
  {id:'bg_fireworks',  rarity:'rare', category:'fieldbg', type:'scene', icon:'🎆', title:'花火大会',   desc:'場の背景：水面に映る花火', achievement:'games_100',    get value(){return sceneUri('fireworks');}},
  {id:'theme_dragon',  rarity:'rare', category:'theme', icon:'🐉', title:'龍の裏地', desc:'牌の裏デザイン：龍', value:'dragon', achievement:'role_musou'},
  {id:'confetti_gems', rarity:'rare', category:'confetti', icon:'💎', title:'宝石の紙吹雪', desc:'上がった時の紙吹雪が宝石の色に', value:['#ff4d6d','#4dd8ff','#6dff9a','#ffe14d','#c77dff'], achievement:'bonus_master'},
);
// 称号の報酬は実績の定義から自動で作る
ACHIEVEMENTS.forEach(a=>{
  if(!a.rt)return;
  const id='title_a_'+a.id;
  GACHA_ITEMS.push({id,rarity:'rare',category:'title',icon:a.icon,title:a.rt,desc:'実績「'+a.title+'」の報酬',value:a.rt,achievement:a.id});
  a.reward=id;
});
// ログインボーナスの称号（7日ログインごとに★が1つ増える。ガチャには出さず、持っている分だけ称号一覧に出す）
for(let n=1;n<=100;n++)GACHA_ITEMS.push({id:'title_login_'+n,rarity:'rare',category:'title',icon:'🌸',loginStar:n,title:'日々の花 '+(n<=5?'★'.repeat(n):'★×'+n),desc:'ログイン'+(n*7)+'日の記念称号',value:'日々の花 '+(n<=5?'★'.repeat(n):'★×'+n)});
