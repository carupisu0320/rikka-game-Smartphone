
// ============================================================
// タイトル画面のイベント背景（日付で自動的に切り替わる）
//  from / to は [月, 日]。年をまたぐ期間（from > to）にも対応。上にあるものほど優先。
//  テスト用：URLに ?event=halloween のように付けるとその背景を強制表示、?event=none でイベントなし
// ============================================================

// ── 共通ヘルパー ──
const _R=(a,b)=>a+Math.random()*(b-a);
const _glowCache={};
function glowSprite(rgb){
  if(_glowCache[rgb])return _glowCache[rgb];
  const c=document.createElement('canvas');c.width=c.height=64;
  const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,`rgba(${rgb},1)`);g.addColorStop(.35,`rgba(${rgb},.45)`);g.addColorStop(1,`rgba(${rgb},0)`);
  x.fillStyle=g;x.fillRect(0,0,64,64);return _glowCache[rgb]=c;
}
function heartPath(c,s){c.beginPath();c.moveTo(0,s*.9);c.bezierCurveTo(-s*1.3,s*.1,-s*.8,-s*.8,0,-s*.3);c.bezierCurveTo(s*.8,-s*.8,s*1.3,s*.1,0,s*.9);c.closePath();}
// クレーター付きの月
function lobbyMoon(style,warm,glow){
  const a=warm?'#ffe2a8':'#fffdf0',b=warm?'#f5b25a':'#f3e2b0',c=warm?'#c8742a':'#cdb678';
  return `<svg class="lf-moon2" viewBox="0 0 100 100" style="${style};--mg:${glow}"><defs>
    <radialGradient id="mgrad" cx=".38" cy=".35" r=".8"><stop offset="0" stop-color="${a}"/><stop offset=".65" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient></defs>
    <circle cx="50" cy="50" r="48" fill="url(#mgrad)"/>
    <g fill="rgba(110,85,40,.2)"><circle cx="34" cy="36" r="10"/><circle cx="62" cy="30" r="6"/><circle cx="64" cy="58" r="12"/><circle cx="38" cy="66" r="7"/><circle cx="52" cy="46" r="4"/><circle cx="24" cy="54" r="4"/></g>
    <g fill="rgba(255,255,255,.18)"><circle cx="31" cy="33" r="6"/><circle cx="60" cy="54" r="7"/></g></svg>`;
}
function batSvg(){
  const w='M36 22C28 8 12 6 0 16C8 16 10 22 12 28C16 22 22 22 26 30C30 24 33 24 36 28Z';
  return `<svg viewBox="0 0 80 40" style="width:100%;height:auto;display:block"><g fill="#07020c">
    <g class="wing"><path d="${w}"/></g><g transform="translate(80 0) scale(-1 1)"><g class="wing"><path d="${w}"/></g></g>
    <ellipse cx="40" cy="23" rx="5" ry="8"/><circle cx="40" cy="14" r="4"/><path d="M36 12L37 5L40 10ZM44 12L43 5L40 10Z"/></g></svg>`;
}
function ghostSvg(){
  return `<svg viewBox="0 0 60 80" style="width:100%;height:auto;display:block"><defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#c8c0ff" stop-opacity=".25"/></linearGradient></defs>
    <path d="M30 4C14 4 6 18 6 34V70L14 62L22 72L30 62L38 72L46 62L54 70V34C54 18 46 4 30 4Z" fill="url(#gg)"/>
    <ellipse cx="22" cy="30" rx="4" ry="6" fill="#1c1030"/><ellipse cx="38" cy="30" rx="4" ry="6" fill="#1c1030"/><ellipse cx="30" cy="44" rx="4" ry="6" fill="#1c1030"/></svg>`;
}
function spiderSvg(){
  return `<svg viewBox="0 0 40 40" style="width:30px;height:30px;display:block"><g stroke="#0a040e" stroke-width="1.6" fill="none" stroke-linecap="round">
    <path d="M14 22L4 14L1 22M14 25L3 27L2 36M14 28L6 36L7 40M15 20L8 8L2 8"/><path d="M26 22L36 14L39 22M26 25L37 27L38 36M26 28L34 36L33 40M25 20L32 8L38 8"/></g>
    <ellipse cx="20" cy="26" rx="8" ry="9" fill="#0a040e"/><circle cx="20" cy="15" r="5" fill="#0a040e"/><circle cx="18" cy="14" r="1.1" fill="#ff4030"/><circle cx="22" cy="14" r="1.1" fill="#ff4030"/></svg>`;
}
function pumpkinSvg(cls,w){
  return `<svg class="${cls}" viewBox="0 0 120 100" style="position:absolute;bottom:.4rem;width:${w}px;height:auto">
    <defs><radialGradient id="pg${w}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff9a30" stop-opacity=".6"/><stop offset="1" stop-color="#ff7a10" stop-opacity="0"/></radialGradient>
    <radialGradient id="pb${w}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffb04a"/><stop offset=".6" stop-color="#e8620c"/><stop offset="1" stop-color="#7a2402"/></radialGradient>
    <filter id="pf${w}"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
    <ellipse cx="60" cy="62" rx="62" ry="46" fill="url(#pg${w})" class="hw-face"/>
    <g fill="url(#pb${w})"><ellipse cx="36" cy="60" rx="28" ry="34"/><ellipse cx="84" cy="60" rx="28" ry="34"/><ellipse cx="60" cy="60" rx="30" ry="38"/></g>
    <g stroke="rgba(80,20,0,.45)" stroke-width="1.6" fill="none"><path d="M60 24C50 44 50 78 60 96"/><path d="M40 30C26 46 28 76 42 92"/><path d="M80 30C94 46 92 76 78 92"/></g>
    <path d="M56 24C56 14 60 8 66 6L70 10C66 14 66 20 66 24Z" fill="#3a4a14"/>
    <g class="hw-face"><g fill="#ffd45a" filter="url(#pf${w})" opacity=".9"><path d="M36 50L50 50L43 38Z"/><path d="M70 50L84 50L77 38Z"/><path d="M60 58L55 66L65 66Z"/><path d="M38 70L46 78L54 72L60 80L66 72L74 78L82 70L76 86L44 86Z"/></g>
    <g fill="#fff0a0"><path d="M38 49L48 49L43 41Z"/><path d="M72 49L82 49L77 41Z"/><path d="M60 60L57 65L63 65Z"/><path d="M42 72L47 77L54 73L60 78L66 73L73 77L78 72L74 83L46 83Z"/></g></g></svg>`;
}
function graveyardSvg(){
  const stones=[[30,86,12,22],[62,90,10,18],[300,88,14,24],[336,92,10,16]].map(([x,y,w,h])=>
    `<path d="M${x-w/2} ${y+h}V${y}Q${x} ${y-w*.8} ${x+w/2} ${y}V${y+h}Z" fill="#0a0612"/>`).join('');
  const tree='<g stroke="#07030c" stroke-linecap="round" fill="none"><path d="M352 120C350 96 354 80 350 62" stroke-width="7"/><path d="M351 84C340 74 332 70 322 58" stroke-width="4"/><path d="M351 76C362 68 370 64 380 52" stroke-width="4"/><path d="M350 66C346 54 346 46 340 38" stroke-width="3"/><path d="M322 58L312 54M322 58L318 46M380 52L388 46M340 38L332 34" stroke-width="2"/></g>';
  return `<svg class="lf-bottom" viewBox="0 0 390 120" preserveAspectRatio="xMidYMax slice"><path d="M0 120V92Q60 82 120 90T240 88T390 84V120Z" fill="#06030b"/>${stones}${tree}</svg>`;
}
function xmasSvg(){
  let uid=0;
  const BALL=[['#ff9a9a','#e02a2a','#7a0a0a'],['#fff0a0','#e8b830','#8a6410'],['#a8d0ff','#3a7ad8','#12327a'],['#ffffff','#b8c4d8','#58647a'],['#e6b8ff','#9a4ad8','#4a1a7a']];
  const HALO=['#ff5a5a','#ffd24a','#5aa8ff','#5fe58a','#ff86d4'];
  const defs=`<defs>
    <linearGradient id="nG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f7d4e"/><stop offset=".5" stop-color="#14472b"/><stop offset="1" stop-color="#07230f"/></linearGradient>
    <linearGradient id="shG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000a05" stop-opacity=".5"/><stop offset=".38" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#a0e6b0" stop-opacity=".13"/><stop offset="1" stop-color="#000a05" stop-opacity=".4"/></linearGradient>
    <linearGradient id="snG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c4d4ee"/></linearGradient>
    <linearGradient id="trG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a1608"/><stop offset=".5" stop-color="#5a3216"/><stop offset="1" stop-color="#241206"/></linearGradient>
    <linearGradient id="starG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6b0"/><stop offset="1" stop-color="#f0b020"/></linearGradient>
    <linearGradient id="gndG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef4ff"/><stop offset="1" stop-color="#8a9cc8"/></linearGradient>
    <radialGradient id="warmG"><stop offset="0" stop-color="#ffc060" stop-opacity=".45"/><stop offset="1" stop-color="#ffc060" stop-opacity="0"/></radialGradient>
    ${BALL.map((c,i)=>`<radialGradient id="bb${i}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient>`).join('')}
    ${HALO.map((c,i)=>`<radialGradient id="ha${i}"><stop offset="0" stop-color="${c}" stop-opacity=".85"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}
    <radialGradient id="starH"><stop offset="0" stop-color="#ffe27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient></defs>`;
  const present=(x,y,w,h,c,r)=>`<ellipse cx="${x+w/2}" cy="${y+h+1}" rx="${w*.65}" ry="2.2" fill="rgba(0,0,0,.28)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="${(h*.22).toFixed(1)}" fill="rgba(255,255,255,.2)"/>
    <rect x="${x+w/2-1.6}" y="${y}" width="3.2" height="${h}" fill="${r}"/><rect x="${x}" y="${y+h*.45}" width="${w}" height="3" fill="${r}"/>
    <ellipse cx="${x+w/2-3.5}" cy="${y-2}" rx="4" ry="2.6" fill="${r}"/><ellipse cx="${x+w/2+3.5}" cy="${y-2}" rx="4" ry="2.6" fill="${r}"/>`;
  const tree=(cx,base,h,w,o)=>{
    const id=++uid,n=o.dim?5:6,body=[],top=base-h-4,th=h*.3,step=(h*.7)/(n-1);
    let out='',lights='',balls='',tinsel='',tips=[];
    for(let i=0;i<n;i++){
      const y0=top+i*step,y1=y0+th,hw=w/2*(.2+i*(.8/(n-1))),m=5+i,pts=[];
      for(let j=0;j<=m;j++){pts.push([cx+hw-(2*hw)*j/m,y1-_R(0,th*.09)]);}
      let d=`M${cx} ${y0}Q${cx+hw*.3} ${y0+th*.6} ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for(let j=1;j<=m;j++){const mx=(pts[j-1][0]+pts[j][0])/2;d+=`Q${mx.toFixed(1)} ${(y1+th*.14).toFixed(1)} ${pts[j][0].toFixed(1)} ${pts[j][1].toFixed(1)}`;}
      d+=`Q${cx-hw*.3} ${y0+th*.6} ${cx} ${y0}Z`;
      const cid=`tc${id}_${i}`;
      let nl='',nd='';
      for(let k=0;k<90;k++){
        const x=_R(cx-hw,cx+hw),y=_R(y0,y1);
        if(Math.abs(x-cx)>hw*(y-y0)/th)continue;
        const sg=x>cx?1:-1,seg=`M${x.toFixed(1)} ${y.toFixed(1)}l${(sg*_R(3,7)).toFixed(1)} ${_R(2,6).toFixed(1)}`;
        if(k%2)nl+=seg;else nd+=seg;
      }
      // 雪：枝の上側に積もる
      const t1=.62,rx=cx+hw*.3*(1-t1)*0+ (cx+hw-cx)*t1*.55,lx=cx-(hw*t1*.55),sy=y0+th*.62*t1;
      const snow=`M${cx} ${y0-1}L${(cx+hw*t1*.62).toFixed(1)} ${(y0+th*.5*t1+3).toFixed(1)}Q${(cx+hw*t1*.4).toFixed(1)} ${(y0+th*.34*t1+6).toFixed(1)} ${(cx+hw*t1*.2).toFixed(1)} ${(y0+th*.3*t1+3).toFixed(1)}Q${cx} ${(y0+th*.2*t1+7).toFixed(1)} ${(cx-hw*t1*.2).toFixed(1)} ${(y0+th*.3*t1+3).toFixed(1)}Q${(cx-hw*t1*.4).toFixed(1)} ${(y0+th*.34*t1+6).toFixed(1)} ${(cx-hw*t1*.62).toFixed(1)} ${(y0+th*.5*t1+3).toFixed(1)}Z`;
      out+=`<clipPath id="${cid}"><path d="${d}"/></clipPath><path d="${d}" fill="url(#nG)"/>
        <g clip-path="url(#${cid})"><path d="${nd}" stroke="#031a0c" stroke-opacity=".55" stroke-width=".9" fill="none"/><path d="${nl}" stroke="#7acb88" stroke-opacity=".32" stroke-width=".8" fill="none"/>
        <path d="${d}" fill="url(#shG)"/></g><path d="${snow}" fill="url(#snG)" opacity=".94"/>`;
      pts.slice(1,-1).forEach(p=>{if(Math.random()<.5)out+=`<ellipse cx="${p[0].toFixed(1)}" cy="${(p[1]-1).toFixed(1)}" rx="${_R(3,6).toFixed(1)}" ry="2" fill="#f4f8ff" opacity=".9"/>`;tips.push(p);});
      if(!o.dim&&i>=1){
        // 電飾：左端から右端へ垂れるコード
        const xa=cx-hw*.92,xb=cx+hw*.92,ya=y1-th*.14,yc=y1+th*.3;
        lights+=`<path d="M${xa.toFixed(1)} ${ya.toFixed(1)}Q${cx} ${yc.toFixed(1)} ${xb.toFixed(1)} ${ya.toFixed(1)}" fill="none" stroke="#06150b" stroke-width="1"/>`;
        const cnt=4+i;
        for(let q=1;q<=cnt;q++){
          const t=q/(cnt+1),bx=(1-t)*(1-t)*xa+2*t*(1-t)*cx+t*t*xb,by=(1-t)*(1-t)*ya+2*t*(1-t)*yc+t*t*ya,ci=(i*3+q)%5,dl=(-_R(0,1.6)).toFixed(2);
          lights+=`<circle class="xl" cx="${bx.toFixed(1)}" cy="${(by+2).toFixed(1)}" r="8" fill="url(#ha${ci})" style="animation-delay:${dl}s"/><circle class="xl" cx="${bx.toFixed(1)}" cy="${(by+2).toFixed(1)}" r="2" fill="${HALO[ci]}" style="animation-delay:${dl}s"/><circle cx="${(bx-.5).toFixed(1)}" cy="${(by+1.4).toFixed(1)}" r=".7" fill="#fff"/>`;
        }
        if(i>=2){const yo=ya-th*.2;tinsel+=`<path d="M${xa.toFixed(1)} ${yo.toFixed(1)}Q${cx} ${(yc-th*.25).toFixed(1)} ${xb.toFixed(1)} ${yo.toFixed(1)}" fill="none" stroke="#e8c050" stroke-width="2.2" stroke-dasharray="1.6 2.4" opacity=".9"/>`;}
      }
    }
    if(!o.dim){
      tips.sort(()=>Math.random()-.5).slice(0,9).forEach((p,k)=>{const r=_R(4,5.8),bi=k%5;
        balls+=`<line x1="${p[0].toFixed(1)}" y1="${(p[1]-1).toFixed(1)}" x2="${p[0].toFixed(1)}" y2="${(p[1]+5).toFixed(1)}" stroke="#d8c070" stroke-width=".6"/><rect x="${(p[0]-1.6).toFixed(1)}" y="${(p[1]+4).toFixed(1)}" width="3.2" height="2" fill="#d8b040"/>
          <circle cx="${p[0].toFixed(1)}" cy="${(p[1]+6+r).toFixed(1)}" r="${r.toFixed(1)}" fill="url(#bb${bi})"/><circle cx="${(p[0]-r*.35).toFixed(1)}" cy="${(p[1]+6+r*.6).toFixed(1)}" r="${(r*.22).toFixed(1)}" fill="#fff" opacity=".85"/>`;});
    }
    const ty=top-4;
    const star=o.dim?'':`<circle class="xl" cx="${cx}" cy="${ty+2}" r="24" fill="url(#starH)"/><path d="M${cx} ${ty-14}L${cx+4} ${ty-4}L${cx+14} ${ty-3}L${cx+6} ${ty+4}L${cx+9} ${ty+14}L${cx} ${ty+8}L${cx-9} ${ty+14}L${cx-6} ${ty+4}L${cx-14} ${ty-3}L${cx-4} ${ty-4}Z" fill="url(#starG)" stroke="#fff3b0" stroke-width=".8"/>`;
    const pres=o.dim?'':present(cx-w*.42,base-9,16,11,'#c0283a','#f0d070')+present(cx+w*.2,base-7,20,9,'#2a6ad0','#e8e8f0')+present(cx+w*.05,base-6,12,8,'#2a9a5a','#f0d070');
    const warm=o.dim?'':`<ellipse cx="${cx}" cy="${base+6}" rx="${w*.8}" ry="22" fill="url(#warmG)"/>`;
    return `${warm}<g${o.dim?' opacity=".72"':''}><rect x="${cx-6}" y="${base-14}" width="12" height="20" fill="url(#trG)"/>${out}${tinsel}${lights}${balls}${star}</g>${pres}`;
  };
  return `<svg class="lf-bottom" viewBox="0 0 390 270" preserveAspectRatio="xMidYMax slice">${defs}
    <path d="M0 270V216Q100 198 200 210T390 204V270Z" fill="url(#gndG)"/>
    ${tree(168,226,92,62,{dim:true})}${tree(252,224,108,72,{dim:true})}
    ${tree(72,246,186,122,{})}${tree(322,242,212,138,{})}</svg>`;
}

function santaHtml(){
  const reindeer=(x,nose)=>`<g transform="translate(${x} 0)">
    <g stroke="#2a1408" stroke-width="2" stroke-linecap="round" fill="none"><path d="M6 38L0 46M10 39L8 48"/><path d="M20 39L27 44M23 38L31 42"/></g>
    <ellipse cx="14" cy="34" rx="11" ry="6" fill="#7a4624"/><path d="M22 31Q28 24 30 22" stroke="#7a4624" stroke-width="5" stroke-linecap="round" fill="none"/>
    <ellipse cx="32" cy="22" rx="5.2" ry="3.4" fill="#8a5230" transform="rotate(20 32 22)"/>
    <circle cx="36.5" cy="24" r="${nose?2.1:1.4}" fill="${nose?'#ff3030':'#2a1408'}"/>${nose?'<circle cx="36.5" cy="24" r="6" fill="#ff4040" opacity=".35"/>':''}
    <g stroke="#e8d8b0" stroke-width="1.3" stroke-linecap="round" fill="none"><path d="M30 19L27 12L24 9M27 12L30 8"/><path d="M33 19L33 11L30 6M33 11L37 8"/></g></g>`;
  return `<div class="santa"><div class="santa-trail"><i style="left:6px;animation-delay:-.2s"></i><i style="left:40px;animation-delay:-.6s"></i><i style="left:78px;animation-delay:-.4s"></i><i style="left:120px;animation-delay:-.8s"></i></div>
  <svg viewBox="0 0 230 70">
    <path d="M62 38Q100 30 118 36M104 36Q140 28 156 34M142 34Q172 26 192 30" stroke="#e8c050" stroke-width=".8" fill="none"/>
    ${reindeer(122,false)}${reindeer(160,false)}${reindeer(196-4,true)}
    <path d="M4 58Q14 61 40 61L74 61Q84 61 82 50" stroke="#e8c050" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M14 61V50M44 61V50M72 61V52" stroke="#e8c050" stroke-width="1.6"/>
    <path d="M8 32Q10 52 30 52L66 52Q76 52 80 36L72 36Q68 45 60 45L28 45Q20 45 16 32Z" fill="#c0282a"/>
    <path d="M10 33L18 33" stroke="#e8c050" stroke-width="2"/>
    <ellipse cx="22" cy="34" rx="11" ry="9" fill="#7a4a24"/><path d="M14 28Q22 24 30 28" stroke="#4a2a10" stroke-width="1" fill="none"/>
    <ellipse cx="50" cy="38" rx="9" ry="9" fill="#d02a2a"/><rect x="44" y="40" width="12" height="2.2" fill="#2a1408"/>
    <circle cx="50" cy="27" r="5" fill="#f4c8a0"/><path d="M45 29Q50 38 55 29Q50 33 45 29Z" fill="#fff"/>
    <path d="M45 25Q47 15 56 14L58 19Q52 19 52 25Z" fill="#d02a2a"/><circle cx="58" cy="19" r="2.4" fill="#fff"/><rect x="44.5" y="24" width="11" height="2.4" fill="#fff"/>
  </svg></div>`;
}
function sakuraBranchSvg(){
  const fl=[[250,28],[215,44],[180,38],[150,62],[120,58],[96,84],[62,96],[272,66],[236,84],[200,76],[28,112],[135,32],[170,88]].map(([x,y],i)=>{
    const sc=(.8+((i*37)%7)/10).toFixed(2);
    let p='';for(let k=0;k<5;k++)p+=`<ellipse cx="0" cy="-5" rx="3.8" ry="5.2" transform="rotate(${k*72})" fill="${k%2?'#ffd3e2':'#ffc2d8'}"/>`;
    return `<g transform="translate(${x} ${y}) scale(${sc})">${p}<circle r="1.7" fill="#ff5f95"/></g>`;}).join('');
  return `<svg viewBox="0 0 300 140" style="position:absolute;top:0;right:0;width:min(85vw,440px);height:auto">
    <g stroke="#150a12" stroke-linecap="round" fill="none"><path d="M300 0C250 20 220 40 170 60S80 100 20 122" stroke-width="5"/><path d="M230 26C226 40 232 52 224 66" stroke-width="2.5"/><path d="M150 68C140 80 146 92 134 100" stroke-width="2.5"/><path d="M260 14C272 30 270 44 276 62" stroke-width="2.5"/></g>${fl}</svg>`;
}
function fujiSvg(){
  const BODY='M-60 232C40 226 110 196 146 142C158 122 166 110 174 103Q184 99 196 100Q208 99 216 104C224 112 232 124 244 144C282 198 350 226 450 232Z';
  // 沢（谷筋）と尾根：山頂から裾に向かって筋を引く
  let dark='',light='';
  for(let k=0;k<16;k++){
    const t=(k/15)*2-1,x0=195+t*20,ex=195+t*175,cx=195+t*58;
    const d=`M${x0.toFixed(1)} ${(106+_R(0,6)).toFixed(1)}Q${cx.toFixed(1)} ${(150+_R(-6,10)).toFixed(1)} ${ex.toFixed(1)} 232`;
    if(k%2)dark+=`<path d="${d}" stroke="rgba(60,12,44,.4)" stroke-width="${_R(1,2.6).toFixed(1)}" fill="none"/>`;
    else light+=`<path d="${d}" stroke="rgba(255,176,120,.24)" stroke-width="${_R(1,2.2).toFixed(1)}" fill="none"/>`;
  }
  // 雪冠：下の縁がギザギザで、谷に沿って雪が舌のように伸びる
  let snow='M140 90L250 90L250 136';
  for(let x=248,j=0;x>144;x-=7,j++){
    const tongue=(j%3===1)?_R(12,24):_R(2,9);
    snow+=`L${x.toFixed(1)} ${(138+tongue).toFixed(1)}L${(x-3.5).toFixed(1)} ${(130+_R(0,8)).toFixed(1)}`;
  }
  snow+='L140 138Z';
  const mist=`<g class="lf-drift" style="animation-duration:30s"><g fill="url(#fjCloud)" filter="url(#fjBlur)"><ellipse cx="90" cy="178" rx="110" ry="9"/><ellipse cx="320" cy="170" rx="100" ry="8"/></g></g>
    <g class="lf-drift" style="animation-duration:22s;animation-direction:alternate-reverse"><g fill="url(#fjCloud)" filter="url(#fjBlur)"><ellipse cx="230" cy="196" rx="130" ry="10"/><ellipse cx="40" cy="206" rx="70" ry="7"/></g></g>`;
  // 湖畔の松のシルエット
  const pines=(x0,dir)=>[0,1,2,3].map(i=>{const x=x0+dir*i*13,h=26+((i*7)%4)*7;
    return `<path d="M${x} ${232-h}L${x+7} ${232-h*.45}L${x+3} ${232-h*.45}L${x+9} ${232-h*.12}L${x-9} ${232-h*.12}L${x-3} ${232-h*.45}L${x-7} ${232-h*.45}Z" fill="#10061a"/>`;}).join('');
  const mountain=`<path d="${BODY}" fill="url(#fjBody)"/><g clip-path="url(#fjClip)">${dark}${light}
    <path d="M196 100L450 232L-60 232Z" fill="url(#fjShade)" opacity=".5"/><path d="${snow}" fill="url(#fjSnow)"/><path d="${snow}" fill="url(#fjShade)" opacity=".28"/></g>
    <path d="${BODY}" fill="none" stroke="rgba(255,206,150,.45)" stroke-width="1"/>`;
  return `<svg class="lf-bottom" viewBox="0 0 390 300" preserveAspectRatio="xMidYMax slice"><defs>
    <clipPath id="fjClip"><path d="${BODY}"/></clipPath>
    <radialGradient id="sunglow"><stop offset="0" stop-color="#fff2b0" stop-opacity=".95"/><stop offset=".22" stop-color="#ffb04a" stop-opacity=".55"/><stop offset="1" stop-color="#ff6a30" stop-opacity="0"/></radialGradient>
    <radialGradient id="sundisc" cx=".4" cy=".35"><stop offset="0" stop-color="#fffbe0"/><stop offset="1" stop-color="#ff9a2e"/></radialGradient>
    <linearGradient id="fjBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8704c"/><stop offset=".3" stop-color="#b8443e"/><stop offset=".65" stop-color="#7a2a44"/><stop offset="1" stop-color="#3a1a40"/></linearGradient>
    <linearGradient id="fjSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4ea"/><stop offset="1" stop-color="#ffc4aa"/></linearGradient>
    <linearGradient id="fjShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a0a30" stop-opacity="0"/><stop offset="1" stop-color="#2a0a30" stop-opacity=".7"/></linearGradient>
    <radialGradient id="fjCloud"><stop offset="0" stop-color="#ffd8b8" stop-opacity=".75"/><stop offset="1" stop-color="#ffb890" stop-opacity="0"/></radialGradient>
    <linearGradient id="lakeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d0643e"/><stop offset=".5" stop-color="#5a2a4a"/><stop offset="1" stop-color="#1e1034"/></linearGradient>
    <linearGradient id="fjHaze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb890" stop-opacity="0"/><stop offset="1" stop-color="#ffb890" stop-opacity=".5"/></linearGradient>
    <filter id="fjBlur"><feGaussianBlur stdDeviation="4"/></filter><filter id="fjBlur2"><feGaussianBlur stdDeviation="1.2"/></filter></defs>
    <circle cx="195" cy="102" r="190" fill="url(#sunglow)"/><circle cx="195" cy="98" r="16" fill="url(#sundisc)"/>
    <path d="M0 232V208Q40 196 84 210T160 214L250 214T340 204T390 198V232Z" fill="#46204e" opacity=".85"/>
    ${mountain}${mist}
    <rect y="206" width="390" height="26" fill="url(#fjHaze)"/>
    <rect y="232" width="390" height="68" fill="url(#lakeG)"/>
    <g clip-path="url(#lkClip)" opacity=".42" filter="url(#fjBlur2)"><g transform="translate(0 348) scale(1 -.5)"><path d="${BODY}" fill="url(#fjBody)"/><path d="${snow}" fill="url(#fjSnow)" clip-path="url(#fjClip)"/></g></g>
    <clipPath id="lkClip"><rect y="232" width="390" height="68"/></clipPath>
    <g stroke="rgba(255,220,180,.25)" stroke-width=".8"><path d="M60 246H130M210 252H300M120 262H180M260 270H340M30 280H90"/></g>
    ${pines(14,1)}${pines(376,-1)}
    <rect y="232" width="390" height="2" fill="rgba(255,190,140,.35)"/></svg>`;
}
function bambooSvg(){
  const strips=['#ff9ab8','#8fd0ff','#ffe070','#a0e8a0','#d0a8ff','#ffb070','#ff9ab8'];
  let tz='',lv='';
  const pts=[[316,70],[296,100],[338,112],[360,140],[300,150],[340,176],[372,98]];
  pts.forEach(([x,y],i)=>{tz+=`<g class="tz" style="animation-delay:-${(i*.45).toFixed(2)}s"><line x1="${x}" y1="${y}" x2="${x}" y2="${y+10}" stroke="#d8d8e8" stroke-width=".6"/><rect x="${x-4}" y="${y+10}" width="8" height="30" fill="${strips[i]}" opacity=".92"/></g>`;});
  [[326,40,-50],[340,70,40],[316,96,-40],[350,110,50],[330,140,-35],[360,170,45],[318,190,-45]].forEach(([x,y,r])=>{
    lv+=`<path d="M${x} ${y}q14 -4 30 4q-14 6 -30 -4z" transform="rotate(${r} ${x} ${y})" fill="#1c5a38"/>`;});
  return `<svg class="lf-bottom" viewBox="0 0 390 260" preserveAspectRatio="xMaxYMax slice"><g stroke="#123c26" stroke-width="5" stroke-linecap="round">
    <path d="M330 260V30"/><path d="M356 260V70"/></g><g stroke="#2a7a4c" stroke-width="1.4"><path d="M326 90h8M326 150h8M326 210h8M352 120h8M352 190h8"/></g>${lv}${tz}</svg>`;
}
function susukiSvg(){
  let g='';
  for(let i=0;i<26;i++){
    const x=i*15+_R(-4,4),h=_R(60,115),bend=_R(-18,18),y=140-h;
    g+=`<g class="sus" style="animation-delay:-${_R(0,4.5).toFixed(2)}s;animation-duration:${_R(3.6,5.4).toFixed(2)}s">
      <path d="M${x} 140Q${x+bend*.3} ${140-h*.6} ${x+bend} ${y}" fill="none" stroke="#2a2a14" stroke-width="1.4"/>
      <path d="M${x+bend} ${y}q${bend*.35+3} -14 ${bend*.5+6} -34q-8 14 -${bend*.1+5} 22z" fill="#e6dcb0" opacity=".85"/>
      <path d="M${x+bend} ${y}q${bend*.35-3} -14 ${bend*.4-4} -30q4 14 ${bend*.1+4} 24z" fill="#cfc592" opacity=".7"/></g>`;
  }
  return `<svg class="lf-bottom" viewBox="0 0 390 140" preserveAspectRatio="xMidYMax slice"><rect y="128" width="390" height="12" fill="#0a0c10"/>${g}</svg>`;
}

// ── canvas演出（雪・花びら・ハート・天の川・蛍/火の粉・金粉・落ち葉） ──
const LOBBY_CANVAS={
  snow(S,ctx){
    const spr=glowSprite('255,255,255');
    const mk=init=>{const z=Math.random();return{x:_R(0,S.W),y:init?_R(0,S.H):-10,z,r:1+z*3.4,vy:.35+z*1.5,ph:_R(0,6.28),a:.35+z*.55};};
    const fl=Array.from({length:110},()=>mk(true));
    const cr=Array.from({length:7},()=>({x:_R(0,S.W),y:_R(0,S.H),s:_R(5,9),vy:_R(.25,.6),rot:_R(0,6.28),vr:_R(-.012,.012),ph:_R(0,6.28)}));
    return (dt,now)=>{
      const wind=Math.sin(now*.0004)*.5+Math.sin(now*.0011)*.25;
      for(const f of fl){
        f.y+=f.vy*dt; f.x+=(wind*(.4+f.z)+Math.sin(f.ph+now*.001)*.25)*dt;
        if(f.y>S.H+10||f.x<-20||f.x>S.W+20){Object.assign(f,mk(false));f.x=_R(0,S.W);}
        ctx.globalAlpha=f.a;const d=f.r*3;ctx.drawImage(spr,f.x-d/2,f.y-d/2,d,d);
      }
      ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1;ctx.globalAlpha=.85;
      for(const c of cr){
        c.y+=c.vy*dt;c.x+=(wind+Math.sin(c.ph+now*.001)*.3)*dt;c.rot+=c.vr*dt;
        if(c.y>S.H+12){c.y=-12;c.x=_R(0,S.W);}
        ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.rot);ctx.beginPath();
        for(let k=0;k<6;k++){ctx.rotate(Math.PI/3);ctx.moveTo(0,0);ctx.lineTo(c.s,0);ctx.moveTo(c.s*.55,0);ctx.lineTo(c.s*.8,c.s*.22);ctx.moveTo(c.s*.55,0);ctx.lineTo(c.s*.8,-c.s*.22);}
        ctx.stroke();ctx.restore();
      }
      ctx.globalAlpha=1;
    };
  },
  petals(S,ctx){
    const mk=init=>{const s=_R(5,12);return{x:_R(-40,S.W),y:init?_R(0,S.H):_R(-40,-5),s,vy:_R(.5,1.3)*(.6+s/14),ph:_R(0,6.28),rot:_R(0,6.28),vr:_R(-.03,.03),fl:_R(0,6.28),vf:_R(.03,.07),hue:_R(335,352),l:_R(82,93),a:_R(.6,.95)};};
    const P=Array.from({length:40},()=>mk(true));
    return (dt,now)=>{
      const wind=Math.sin(now*.0003)*.7+.6;
      for(const p of P){
        p.y+=p.vy*dt;p.x+=(wind*1.1+Math.sin(p.ph+now*.0012)*.7)*dt;p.rot+=p.vr*dt;p.fl+=p.vf*dt;
        if(p.y>S.H+20||p.x>S.W+30)Object.assign(p,mk(false));
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(.35+.65*Math.abs(Math.cos(p.fl)),1);ctx.globalAlpha=p.a;
        const g=ctx.createLinearGradient(0,-p.s,0,p.s);
        g.addColorStop(0,`hsl(${p.hue},95%,${p.l}%)`);g.addColorStop(1,`hsl(${p.hue},85%,${p.l-16}%)`);
        ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,-p.s*.8);ctx.quadraticCurveTo(p.s*.15,-p.s,p.s*.35,-p.s*.9);
        ctx.bezierCurveTo(p.s*.95,-p.s*.6,p.s*.85,p.s*.55,0,p.s);ctx.bezierCurveTo(-p.s*.85,p.s*.55,-p.s*.95,-p.s*.6,-p.s*.35,-p.s*.9);
        ctx.quadraticCurveTo(-p.s*.15,-p.s,0,-p.s*.8);ctx.fill();ctx.restore();
      }
      ctx.globalAlpha=1;
    };
  },
  hearts(S,ctx){
    const bk=glowSprite('255,120,170');
    const mk=init=>{const s=_R(6,22);return{x:_R(0,S.W),y:init?_R(0,S.H):S.H+30,s,vy:_R(.4,1.1)*(1.2-s/30),ph:_R(0,6.28),hue:_R(338,356),a:s>16?_R(.2,.38):_R(.45,.8),rot:_R(-.4,.4)};};
    const H=Array.from({length:20},()=>mk(true));
    const B=Array.from({length:12},()=>({x:_R(0,S.W),y:_R(0,S.H),r:_R(25,70),vy:_R(.1,.3),a:_R(.06,.14)}));
    return (dt,now)=>{
      ctx.globalCompositeOperation='lighter';
      for(const b of B){b.y-=b.vy*dt;if(b.y<-b.r)b.y=S.H+b.r;ctx.globalAlpha=b.a;ctx.drawImage(bk,b.x-b.r,b.y-b.r,b.r*2,b.r*2);}
      ctx.globalCompositeOperation='source-over';
      for(const p of H){
        p.y-=p.vy*dt;p.x+=Math.sin(p.ph+now*.0012)*.5*dt;if(p.y<-30)Object.assign(p,mk(false));
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot+Math.sin(p.ph+now*.001)*.15);heartPath(ctx,p.s);ctx.globalAlpha=p.a;
        const g=ctx.createRadialGradient(-p.s*.3,-p.s*.3,0,0,0,p.s*1.2);
        g.addColorStop(0,`hsl(${p.hue},100%,78%)`);g.addColorStop(1,`hsl(${p.hue},85%,47%)`);ctx.fillStyle=g;ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.ellipse(-p.s*.45,-p.s*.3,p.s*.2,p.s*.1,-.6,0,6.283);ctx.fill();ctx.restore();
      }
      ctx.globalAlpha=1;
    };
  },
  milky(S,ctx){
    let bg=null;
    const build=()=>{
      const c=document.createElement('canvas');c.width=S.W;c.height=S.H;const x=c.getContext('2d');
      const diag=Math.hypot(S.W,S.H),bw=S.H*.15;
      x.save();x.translate(S.W/2,S.H/2);x.rotate(-.6);
      let g=x.createLinearGradient(0,-bw*1.6,0,bw*1.6);
      g.addColorStop(0,'rgba(140,160,255,0)');g.addColorStop(.5,'rgba(190,205,255,.2)');g.addColorStop(1,'rgba(140,160,255,0)');
      x.fillStyle=g;x.fillRect(-diag/2,-bw*1.6,diag,bw*3.2);
      g=x.createLinearGradient(0,-bw*.5,0,bw*.5);
      g.addColorStop(0,'rgba(255,230,255,0)');g.addColorStop(.5,'rgba(255,240,255,.13)');g.addColorStop(1,'rgba(255,230,255,0)');
      x.fillStyle=g;x.fillRect(-diag/2,-bw*.5,diag,bw);
      x.fillStyle='rgba(5,8,30,.3)';x.fillRect(-diag/2,bw*.1,diag*.6,bw*.08);
      for(let i=0;i<1100;i++){
        const px=_R(-diag/2,diag/2),py=((Math.random()+Math.random()+Math.random())/3-.5)*bw*2.4,r=_R(.3,1.1);
        x.fillStyle=`rgba(${(220+_R(0,35))|0},${(225+_R(0,30))|0},255,${_R(.15,.8).toFixed(2)})`;x.fillRect(px,py,r,r);
      }
      x.restore();
      for(let i=0;i<140;i++){x.fillStyle=`rgba(255,255,255,${_R(.1,.6).toFixed(2)})`;const r=_R(.3,1.2);x.fillRect(_R(0,S.W),_R(0,S.H),r,r);}
      bg=c;
    };
    build();S.onResize=build;
    const spr=glowSprite('220,230,255'),ff=glowSprite('190,255,110');
    const tw=Array.from({length:45},()=>({x:_R(0,1),y:_R(0,.9),ph:_R(0,6.28),sp:_R(.001,.004),s:_R(3,7)}));
    const fly=Array.from({length:14},()=>({x:_R(0,1),y:_R(.55,.97),vx:_R(-.2,.2),vy:_R(-.2,.2),ph:_R(0,6.28)}));
    let shoots=[],nextShoot=2;
    return (dt,now)=>{
      ctx.drawImage(bg,0,0,S.W,S.H);
      for(const t of tw){ctx.globalAlpha=.25+.6*Math.abs(Math.sin(t.ph+now*t.sp));const d=t.s*2;ctx.drawImage(spr,t.x*S.W-d/2,t.y*S.H-d/2,d,d);}
      // 織姫（ベガ）と彦星（アルタイル）
      [[.2,.17,'255,240,255'],[.8,.7,'255,248,220']].forEach(([fx,fy,rgb],i)=>{
        const x=fx*S.W,y=fy*S.H,k=.75+.25*Math.sin(now*.002+i*2),d=34*k;
        ctx.globalAlpha=.9;ctx.drawImage(glowSprite(rgb),x-d/2,y-d/2,d,d);
        ctx.strokeStyle=`rgba(${rgb},${(.55*k).toFixed(2)})`;ctx.lineWidth=1;ctx.beginPath();
        ctx.moveTo(x-16*k,y);ctx.lineTo(x+16*k,y);ctx.moveTo(x,y-16*k);ctx.lineTo(x,y+16*k);ctx.stroke();
      });
      nextShoot-=dt/60;
      if(nextShoot<=0){shoots.push({x:_R(.1,.8)*S.W,y:_R(0,.25)*S.H,vx:_R(10,14),vy:_R(5,8),life:44});nextShoot=_R(2.5,6);}
      shoots=shoots.filter(s=>{
        s.life-=dt;if(s.life<=0)return false;s.x+=s.vx*dt;s.y+=s.vy*dt;
        const k=s.life/44,tx=s.x-s.vx*7,ty=s.y-s.vy*7,g=ctx.createLinearGradient(s.x,s.y,tx,ty);
        g.addColorStop(0,`rgba(255,255,255,${k})`);g.addColorStop(1,'rgba(255,255,255,0)');
        ctx.globalAlpha=1;ctx.strokeStyle=g;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(tx,ty);ctx.stroke();return true;
      });
      ctx.globalCompositeOperation='lighter';
      for(const f of fly){
        f.x+=f.vx*dt/S.W*3;f.y+=f.vy*dt/S.H*3;f.vx+=_R(-.02,.02);f.vy+=_R(-.02,.02);f.vx=Math.max(-.3,Math.min(.3,f.vx));f.vy=Math.max(-.3,Math.min(.3,f.vy));
        if(f.x<0||f.x>1)f.vx*=-1;if(f.y<.5||f.y>1)f.vy*=-1;
        ctx.globalAlpha=.2+.8*Math.max(0,Math.sin(now*.003+f.ph));ctx.drawImage(ff,f.x*S.W-8,f.y*S.H-8,16,16);
      }
      ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    };
  },
  embers(S,ctx){
    const spr=glowSprite('255,150,40');
    const mk=init=>({x:_R(0,S.W),y:init?_R(0,S.H):S.H+20,vy:_R(.2,.6),ph:_R(0,6.28),r:_R(6,16),sp:_R(.002,.006)});
    const P=Array.from({length:30},()=>mk(true));
    return (dt,now)=>{
      ctx.globalCompositeOperation='lighter';
      for(const p of P){
        p.y-=p.vy*dt;p.x+=Math.sin(p.ph+now*.0007)*.35*dt;if(p.y<-20)Object.assign(p,mk(false));
        ctx.globalAlpha=.25+.6*Math.abs(Math.sin(p.ph+now*p.sp*3));ctx.drawImage(spr,p.x-p.r,p.y-p.r,p.r*2,p.r*2);
      }
      ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    };
  },
  glitter(S,ctx){
    const spr=glowSprite('255,215,110');
    const mk=init=>({x:_R(0,S.W),y:init?_R(0,S.H):S.H+10,vy:_R(.15,.5),ph:_R(0,6.28),s:_R(5,12),sp:_R(.002,.006)});
    const P=Array.from({length:34},()=>mk(true));
    return (dt,now)=>{
      ctx.globalCompositeOperation='lighter';
      for(const p of P){
        p.y-=p.vy*dt;p.x+=Math.sin(p.ph+now*.0008)*.3*dt;if(p.y<-10)Object.assign(p,mk(false));
        const tw=.5+.5*Math.sin(p.ph+now*p.sp*4),d=p.s*2.2;
        ctx.globalAlpha=tw*.9;ctx.drawImage(spr,p.x-d/2,p.y-d/2,d,d);
        ctx.strokeStyle='rgba(255,236,170,.8)';ctx.lineWidth=1;ctx.beginPath();
        const L=p.s*(.6+tw*.6);ctx.moveTo(p.x-L,p.y);ctx.lineTo(p.x+L,p.y);ctx.moveTo(p.x,p.y-L);ctx.lineTo(p.x,p.y+L);ctx.stroke();
      }
      ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    };
  },
  leaves(S,ctx){
    const mk=init=>{const s=_R(7,13);return{x:_R(-20,S.W),y:init?_R(0,S.H):_R(-30,-5),s,vy:_R(.5,1.2),ph:_R(0,6.28),rot:_R(0,6.28),vr:_R(-.03,.03),fl:_R(0,6.28),vf:_R(.02,.06),hue:_R(8,45),l:_R(42,56)};};
    const P=Array.from({length:18},()=>mk(true));
    return (dt,now)=>{
      for(const p of P){
        p.y+=p.vy*dt;p.x+=(Math.sin(p.ph+now*.0011)*.9+.25)*dt;p.rot+=p.vr*dt;p.fl+=p.vf*dt;
        if(p.y>S.H+20||p.x>S.W+30)Object.assign(p,mk(false));
        ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(.3+.7*Math.abs(Math.cos(p.fl)),1);ctx.globalAlpha=.9;
        ctx.fillStyle=`hsl(${p.hue},82%,${p.l}%)`;ctx.beginPath();ctx.moveTo(0,-p.s);
        ctx.quadraticCurveTo(p.s*.8,-p.s*.2,0,p.s);ctx.quadraticCurveTo(-p.s*.8,-p.s*.2,0,-p.s);ctx.fill();
        ctx.strokeStyle='rgba(60,20,0,.4)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-p.s);ctx.lineTo(0,p.s*1.15);ctx.stroke();ctx.restore();
      }
      ctx.globalAlpha=1;
    };
  },
};
function makeLobbyCanvas(fx,setup){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const cv=document.createElement('canvas');fx.appendChild(cv);
  const ctx=cv.getContext('2d'),S={W:0,H:0,dpr:1,onResize:null};
  const resize=()=>{S.dpr=Math.min(window.devicePixelRatio||1,2);S.W=window.innerWidth;S.H=window.innerHeight;
    cv.width=S.W*S.dpr;cv.height=S.H*S.dpr;ctx.setTransform(S.dpr,0,0,S.dpr,0,0);if(S.onResize)S.onResize();};
  resize();window.addEventListener('resize',resize);
  const step=setup(S,ctx);
  let alive=true,raf=0,last=performance.now();
  const frame=now=>{
    if(!alive)return;raf=requestAnimationFrame(frame);
    const lobby=document.getElementById('lobby');
    if(!lobby||!lobby.classList.contains('active')||document.hidden){last=now;return;}
    const dt=Math.min(2.5,(now-last)/16.67);last=now;
    ctx.clearRect(0,0,S.W,S.H);step(dt,now);
  };
  raf=requestAnimationFrame(frame);
  _lobbyCanvasStop=()=>{alive=false;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);cv.remove();};
}
let _lobbyCanvasStop=null;
const LOBBY_EVENTS=[
  {id:'halloween',name:'ハロウィン',banner:'🎃 ハッピーハロウィン！ 🎃',from:[10,1],to:[10,31],
   bg:'linear-gradient(180deg,#06020e 0%,#1c0a2c 48%,#5a1c08 85%,#8a3a10 100%)',logo:'#ffb050',glow:'rgba(255,140,40,.6)',
   stars:26,bats:5,ghosts:3,canvasFx:'embers',particles:[],
   deco:lobbyMoon('top:14%;right:6%;width:96px',true,'rgba(255,150,50,.55)')+'<div class="hw-fog"></div><div class="hw-fog f2"></div>'+graveyardSvg()+
        '<div class="hw-spider"><i></i>'+spiderSvg()+'</div>'+pumpkinSvg('l',104).replace('bottom:.4rem;','left:.4rem;bottom:.5rem;')+pumpkinSvg('r',70).replace('bottom:.4rem;','right:3.2rem;bottom:.5rem;')},
  {id:'christmas',name:'クリスマス',banner:'🎄 メリークリスマス 🎄',from:[12,15],to:[12,25],
   bg:'linear-gradient(180deg,#040f1e 0%,#0b2a3a 50%,#1a1c34 100%)',logo:'#fff0d0',glow:'rgba(90,210,130,.55)',
   stars:34,canvasFx:'snow',particles:[],deco:xmasSvg()+santaHtml()},
  {id:'newyear',name:'お正月',banner:'🎍 あけましておめでとうございます 🎍',from:[12,29],to:[1,7],
   bg:'linear-gradient(180deg,#070b24 0%,#2a1a4a 45%,#a8403a 78%,#f09040 100%)',logo:'#ffe08a',glow:'rgba(255,200,70,.65)',
   stars:14,canvasFx:'glitter',particles:[],deco:fujiSvg()},
  {id:'valentine',name:'バレンタイン',banner:'💝 ハッピーバレンタイン 💝',from:[2,7],to:[2,14],
   bg:'radial-gradient(ellipse at 50% 100%,#6a1e44 0%,#3a0f2a 55%,#1c0716 100%)',logo:'#ffa0c0',glow:'rgba(255,100,160,.55)',
   stars:0,canvasFx:'hearts',particles:[],deco:''},
  {id:'sakura',name:'お花見',banner:'🌸 お花見シーズン 🌸',from:[3,20],to:[4,10],
   bg:'linear-gradient(180deg,#120a1e 0%,#32183a 55%,#6a3048 100%)',logo:'#ffc8dc',glow:'rgba(255,150,190,.55)',
   stars:20,canvasFx:'petals',particles:[],
   deco:lobbyMoon('top:32%;left:5%;width:84px;opacity:.5',false,'rgba(255,200,230,.4)')+sakuraBranchSvg()},
  {id:'tanabata',name:'七夕',banner:'🎋 七夕 ─ 願いを込めて ─ 🎋',from:[7,1],to:[7,7],
   bg:'linear-gradient(180deg,#03061a 0%,#0a143c 60%,#142456 100%)',logo:'#b8d0ff',glow:'rgba(120,170,255,.6)',
   stars:0,canvasFx:'milky',particles:[],deco:bambooSvg()},
  {id:'fireworks',name:'夏祭り',banner:'🎆 夏祭り 🎆',from:[7,20],to:[8,31],
   bg:'linear-gradient(180deg,#02030f 0%,#080a2a 55%,#1c0e34 100%)',logo:'#ffd070',glow:'rgba(255,170,70,.6)',
   stars:46,canvasFx:'fireworks',skyline:true,deco:'',particles:[]},
  {id:'tsukimi',name:'お月見',banner:'🌕 お月見 ─ 秋の夜長 ─ 🌕',from:[9,10],to:[9,30],
   bg:'linear-gradient(180deg,#070d1c 0%,#16223a 60%,#2e2a1c 100%)',logo:'#ffe8a0',glow:'rgba(255,220,130,.55)',
   stars:30,canvasFx:'leaves',particles:[],
   deco:lobbyMoon('top:9%;left:50%;margin-left:-62px;width:124px',false,'rgba(255,235,170,.6)')+
        '<div class="lf-cloud" style="top:12%;animation-delay:-20s"></div><div class="lf-cloud" style="top:20%;width:180px;animation-duration:95s;animation-delay:-55s"></div>'+susukiSvg()},
];

// ── 花火（canvas）：打ち上げ → 開花 → 光の尾を引いて散る ──
function stopLobbyCanvas(){if(_lobbyCanvasStop){_lobbyCanvasStop();_lobbyCanvasStop=null;}}
function lobbySkylineSvg(){
  const houses='M0 90V56H14L24 44L34 56H58V46H84V56H100L112 40L124 56H150V48H176L186 36L196 48H214V56H236L246 42L256 56H280V46H306L316 38L326 46H340L352 44L364 56H390V90Z';
  const wins=[18,40,70,106,134,160,190,222,250,290,320,348].map((x,i)=>`<rect x="${x}" y="${64+(i%3)*4}" width="5" height="6" fill="#ffcc66" opacity="${.55+(i%4)*.12}"/>`).join('');
  let lan='';
  for(let h=0;h<2;h++)for(let k=1;k<=4;k++){
    const t=k/5,x=h*195+195*t,y=(1-t)*(1-t)*26+2*t*(1-t)*58+t*t*26;
    lan+=`<circle cx="${x}" cy="${y+5}" r="11" fill="url(#lg)" opacity=".5"/><ellipse cx="${x}" cy="${y+5}" rx="4" ry="5" fill="#ff7a30"/><ellipse cx="${x}" cy="${y+4}" rx="2" ry="3" fill="#ffd890"/>`;
  }
  return `<svg viewBox="0 0 390 90" preserveAspectRatio="xMidYMax slice" style="position:absolute;bottom:0;left:0;width:100%;height:auto">
    <defs><radialGradient id="lg"><stop offset="0" stop-color="#ff9a40" stop-opacity=".9"/><stop offset="1" stop-color="#ff7a30" stop-opacity="0"/></radialGradient></defs>
    <path d="${houses}" fill="#07040e"/>${wins}
    <path d="M0 26Q97.5 58 195 26T390 26" fill="none" stroke="#3a2a30" stroke-width="1"/>${lan}</svg>`;
}
function startLobbyFireworks(fx){
  const cv=document.createElement('canvas');
  fx.insertBefore(cv,fx.firstChild);
  const ctx=cv.getContext('2d');
  let W=0,H=0,dpr=1;
  const resize=()=>{dpr=Math.min(window.devicePixelRatio||1,2);W=window.innerWidth;H=window.innerHeight;
    cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};
  resize(); window.addEventListener('resize',resize);
  const R=(a,b)=>a+Math.random()*(b-a);
  const HUES=[0,18,42,50,120,170,200,265,310,335];
  let rockets=[],parts=[],glows=[],nextLaunch=0.3,last=performance.now(),raf=0,alive=true;
  function launch(){
    const tx=R(.15,.85)*W,top=R(.12,.42)*H,dist=H-top,g=.1;
    rockets.push({x:tx+R(-30,30),y:H+4,vx:0,vy:-Math.sqrt(2*g*dist),g,hue:HUES[Math.floor(Math.random()*HUES.length)]});
  }
  function burst(x,y,hue){
    glows.push({x,y,r:R(90,150),life:16,max:16,hue});
    const kind=(()=>{const q=Math.random();return q<.34?'peony':q<.58?'chrys':q<.78?'willow':q<.9?'ring':q<.96?'double':'heart';})();
    const add=(n,fn)=>{for(let i=0;i<n;i++)parts.push(fn(i,n));};
    const base=(vx,vy,o)=>Object.assign({x,y,vx,vy,life:0,age:0,hue,sat:100,drag:.982,grav:.04,size:1.5,flick:false},o);
    if(kind==='peony') add(110,()=>{const a=R(0,6.283),v=R(2,5.2);return base(Math.cos(a)*v,Math.sin(a)*v,{max:R(70,95)});});
    else if(kind==='chrys') add(130,()=>{const a=R(0,6.283),v=R(1.5,5.6);return base(Math.cos(a)*v,Math.sin(a)*v,{max:R(85,115),flick:true,hue:hue+R(-8,8)});});
    else if(kind==='willow') add(100,()=>{const a=R(0,6.283),v=R(1.4,4.2);return base(Math.cos(a)*v,Math.sin(a)*v,{max:R(130,170),drag:.972,grav:.05,hue:42,sat:90,flick:true,size:1.3});});
    else if(kind==='ring'){const tilt=R(.35,1),rot=R(0,3.14);
      add(70,(i,n)=>{const a=i/n*6.283,v=4.2,vx0=Math.cos(a)*v,vy0=Math.sin(a)*v*tilt;
        return base(vx0*Math.cos(rot)-vy0*Math.sin(rot),vx0*Math.sin(rot)+vy0*Math.cos(rot),{max:R(70,85),drag:.985});});}
    else if(kind==='double'){
      add(60,(i,n)=>{const a=i/n*6.283;return base(Math.cos(a)*2.2,Math.sin(a)*2.2,{max:80,hue:hue+150});});
      add(100,()=>{const a=R(0,6.283),v=R(4,5.4);return base(Math.cos(a)*v,Math.sin(a)*v,{max:R(75,95)});});
    } else add(90,(i,n)=>{const t=i/n*6.283,hx=16*Math.pow(Math.sin(t),3),hy=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
      return base(hx*.27,hy*.27,{max:90,hue:335,drag:.986});});
    parts.forEach(p=>{p.life=p.max;});
  }
  function frame(now){
    if(!alive)return;
    raf=requestAnimationFrame(frame);
    const lobby=document.getElementById('lobby');
    if(!lobby||!lobby.classList.contains('active')||document.hidden){last=now;return;}
    const dt=Math.min(2.5,(now-last)/16.67);last=now;
    // 前のフレームを少しずつ消して、光の尾を作る
    ctx.globalCompositeOperation='destination-out';
    ctx.fillStyle=`rgba(0,0,0,${Math.min(.5,.2*dt)})`; ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation='lighter';
    nextLaunch-=dt/60;
    if(nextLaunch<=0&&rockets.length<3){launch();nextLaunch=R(.7,2.0);}
    rockets=rockets.filter(r=>{
      r.vy+=r.g*dt; r.x+=r.vx*dt; r.y+=r.vy*dt;
      for(let i=0;i<2;i++)parts.push({x:r.x+R(-1,1),y:r.y,vx:R(-.3,.3),vy:R(.2,1),life:R(10,20),max:20,hue:40,sat:80,drag:.95,grav:.02,size:.9,flick:false,spark:true});
      ctx.fillStyle='hsl(45,100%,85%)'; ctx.beginPath(); ctx.arc(r.x,r.y,2,0,6.283); ctx.fill();
      if(r.vy>=-.6){burst(r.x,r.y,r.hue);return false;}
      return true;
    });
    glows=glows.filter(g=>{
      g.life-=dt; if(g.life<=0)return false;
      const k=g.life/g.max,gr=ctx.createRadialGradient(g.x,g.y,0,g.x,g.y,g.r);
      gr.addColorStop(0,`hsla(${g.hue},100%,70%,${.35*k})`); gr.addColorStop(1,`hsla(${g.hue},100%,50%,0)`);
      ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(g.x,g.y,g.r,0,6.283); ctx.fill(); return true;
    });
    parts=parts.filter(p=>{
      p.life-=dt; if(p.life<=0)return false;
      const dr=Math.pow(p.drag,dt);
      p.vx*=dr; p.vy=p.vy*dr+p.grav*dt; p.x+=p.vx*dt; p.y+=p.vy*dt;
      const k=p.life/p.max;
      if(p.flick&&k<.5&&Math.random()<.35)return true; // 終盤にチカチカ瞬く
      const l=p.spark?70:(55+35*Math.pow(k,3)); // 開いた直後は白く熱く、だんだん色づく
      ctx.fillStyle=`hsla(${p.hue},${p.sat}%,${l}%,${Math.min(1,k*1.6)})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size*(.5+.5*k),0,6.283); ctx.fill();
      return true;
    });
    ctx.globalCompositeOperation='source-over';
  }
  raf=requestAnimationFrame(frame);
  _lobbyCanvasStop=()=>{alive=false;cancelAnimationFrame(raf);window.removeEventListener('resize',resize);cv.remove();};
}
const _lobbyEventParam=(new URLSearchParams(location.search)).get('event');
let _lobbyEventId='__init';
// 開発者モードを使えるアカウント。メールアドレスでの簡易判定（見た目の確認用機能のみなので、ログイン情報は端末側の値を信頼している）
const DEV_EMAILS=['nekohaoki215@gmail.com','6043_2024_06317@g.miyazaki-c.ed.jp'];
function isDevUser(){return !!(gUser&&gUser.email&&DEV_EMAILS.includes(String(gUser.email).toLowerCase()));}
function currentLobbyEvent(){
  if(isDevUser()){
    const st=localStorage.getItem('rikka_dev_event');
    const o=st!==null?st:_lobbyEventParam; // パネルで選んだものを優先
    if(o!==null) return LOBBY_EVENTS.find(e=>e.id===o)||null; // 'none'や不明なIDはイベントなし
  }
  const d=new Date(),v=(d.getMonth()+1)*100+d.getDate();
  return LOBBY_EVENTS.find(e=>{
    const a=e.from[0]*100+e.from[1],b=e.to[0]*100+e.to[1];
    return a<=b?(v>=a&&v<=b):(v>=a||v<=b);
  })||null;
}
// ブラウザのタブのアイコンと、iPhoneの「ホーム画面に追加」で使われるアイコンを、季節に合わせて切り替える
function updateAppIcons(){
  const ev=currentLobbyEvent(),id=ev?ev.id:'';
  const i=document.getElementById('app-icon'),t=document.getElementById('app-touch-icon');
  if(i)i.href=id?`icons/${id}-192.png`:'icon.png';
  if(t)t.href=id?`icons/${id}-180.png`:'icon.png';
}

// ============================================================
// 季節のアイコンへの更新のお知らせ（ホーム画面のアイコンは、アプリからは直接変えられないため、更新の手順を案内する）
// ============================================================
let _deferredInstall=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();_deferredInstall=e;});
const ICON_NAMES={halloween:'ハロウィン',christmas:'クリスマス',newyear:'お正月',valentine:'バレンタイン',sakura:'お花見',tanabata:'七夕',fireworks:'夏祭り',tsukimi:'お月見'};
function isInstalledApp(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true;}
function iconPlatform(){
  const ua=navigator.userAgent||'';
  if(/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1))return 'ios';
  if(/Android/.test(ua))return 'android';
  return 'pc';
}
function currentIconId(){const ev=currentLobbyEvent();return ev?ev.id:'';}
function iconSrc(id,size){return id?`icons/${id}-${size||192}.png`:'icon.png';}
// 今の季節のアイコンに、まだ更新していないか（インストール済みのアプリだけに出す。開発者アカウントは確認用に常に出す）
function updateIconUpdateBtn(){
  let b=document.getElementById('icon-update-btn');
  if(!b){
    b=document.createElement('button');b.id='icon-update-btn';b.onclick=openIconUpdate;
    const bn=document.getElementById('lobby-event-banner');if(bn&&bn.parentNode)bn.parentNode.insertBefore(b,bn.nextSibling);else return;
  }
  const cur=currentIconId(),ack=localStorage.getItem('rikka_icon_ack')||'';
  const need=cur!==ack&&(isInstalledApp()||(typeof isDevUser==='function'&&isDevUser())||/[?&]iconprompt=1/.test(location.search));
  b.classList.toggle('on',need);
  if(need)b.textContent=cur?`🎨 ${ICON_NAMES[cur]||''}のアイコンに更新する`:'🎨 ふだんのアイコンに戻す';
}
function openIconUpdate(){
  closeIconUpdate();
  const cur=currentIconId(),old=localStorage.getItem('rikka_icon_ack')||'',plat=iconPlatform(),name=cur?(ICON_NAMES[cur]||''):'ふだん';
  let steps='',extra='';
  if(plat==='ios'){
    steps=`<ol class="iu-steps"><li>ホーム画面の六華のアイコンを<b>長押し</b>して、「ホーム画面から取り除く」を選ぶ</li><li><b>Safari</b>でこのページを開く（iOS 16.4以降なら、<b>ChromeやEdge</b>でも大丈夫です）</li><li>共有ボタンから<b>「ホーム画面に追加」</b>を選ぶ</li></ol><div class="iu-note">追加し直したときの季節のアイコンになります。ゲームのデータ（花びらや実績など）は、この端末に残ります。</div>`;
  }else if(plat==='android'){
    steps=`<ol class="iu-steps"><li>下の<b>「今すぐ更新を確認」</b>を押す</li><li>アプリを<b>いったん閉じて</b>、開き直す</li></ol><div class="iu-note">Chromeが新しいアイコンを見つけると、自動で更新されます（反映まで1日ほどかかることがあります）。すぐに変わらないときは、ホーム画面のアイコンを長押しして削除し、Chromeのメニューから<b>「ホーム画面に追加」</b>をやり直してください。</div>`;
    extra=`<button class="sub" onclick="nudgeIconUpdate()">🔄 今すぐ更新を確認</button>`+(_deferredInstall?`<button class="sub" onclick="installNewIcon()">➕ 新しいアイコンで追加する</button>`:'');
  }else{
    steps=`<div class="iu-note">パソコンでは、ブラウザのタブのアイコンが、自動で季節のものに変わります。ホーム画面に追加したアプリを使っている場合は、いったん削除して、追加し直すと、新しいアイコンになります。</div>`;
  }
  const el=document.createElement('div');el.id='icon-update-modal';
  el.onclick=e=>{if(e.target===el)closeIconUpdate();};
  el.innerHTML=`<div class="iu-box"><div class="iu-title">🎨 アイコンの更新</div>
    <div class="iu-prev"><div><img src="${iconSrc(old,192)}" alt="" onerror="this.style.visibility='hidden'"><small>今のアイコン</small></div><div class="arrow">▶</div><div><img src="${iconSrc(cur,192)}" alt=""><small>${esc(name)}のアイコン</small></div></div>
    <div class="iu-note">スマホのホーム画面のアイコンは、アプリの中から直接は変えられません。次の手順で、新しいアイコンに更新できます。</div>${steps}
    <div class="iu-btns">${extra}<a class="sub" href="${iconSrc(cur,512)}" download="rikka-icon-${cur||'default'}.png">🖼 アイコン画像を保存する</a>
      <button class="main" onclick="ackIconUpdate()">更新した（このお知らせを消す）</button><button class="ghost" onclick="closeIconUpdate()">あとで</button></div></div>`;
  document.body.appendChild(el);
}
function closeIconUpdate(){const m=document.getElementById('icon-update-modal');if(m)m.remove();}
function ackIconUpdate(){localStorage.setItem('rikka_icon_ack',currentIconId());closeIconUpdate();updateIconUpdateBtn();toast('アイコンの更新を記録しました');}
async function nudgeIconUpdate(){
  try{
    const reg=await navigator.serviceWorker.getRegistration();if(reg)await reg.update();
    await fetch('manifest.json',{cache:'reload'});
    toast('更新を確認しました。アプリをいったん閉じて、開き直してください');
  }catch(e){toast('更新を確認できませんでした');}
}
async function installNewIcon(){
  if(!_deferredInstall)return;
  try{_deferredInstall.prompt();await _deferredInstall.userChoice;}catch(e){}
  _deferredInstall=null;closeIconUpdate();
}
// 通常時のタイトルは、時間帯（明け方・昼・夕方・夜・深夜）に合わせて、ゆっくり景色が移り変わる
const LD_SLOTS={
  dawn:{sky:'linear-gradient(180deg,#0f1430 0%,#2a2a52 35%,#6a4a6e 62%,#c0707a 84%,#e6a37e 100%)',logo:'#f0dcc0',glow:'rgba(255,190,170,.4)',stars:6,mist:'rgba(230,190,200,.14)',cloud:'rgba(240,190,190,.2)',sun:'left:14%;bottom:16%;width:300px;height:300px;background:radial-gradient(circle,rgba(255,190,140,.55) 0%,transparent 68%)',flake:0,mote:12,motec:'255,226,214'},
  day:{sky:'linear-gradient(180deg,#1f4f78 0%,#3b78a2 38%,#5f98b8 72%,#86b4c8 100%)',logo:'#fbf0cc',glow:'rgba(255,244,210,.45)',sub:'#e3edf5',stars:0,mist:'rgba(220,236,244,.16)',cloud:'rgba(240,248,252,.26)',sun:'left:2%;top:2%;width:380px;height:380px;background:radial-gradient(circle,rgba(255,244,205,.62) 0%,transparent 66%)',flake:0,mote:10,motec:'255,246,222'},
  dusk:{sky:'linear-gradient(180deg,#15142c 0%,#3a2550 38%,#7a3d5a 66%,#c0635a 88%,#dc8a5a 100%)',logo:'#f6d8a8',glow:'rgba(255,170,120,.4)',stars:5,mist:'rgba(230,170,150,.12)',cloud:'rgba(220,140,130,.18)',sun:'right:6%;bottom:18%;width:300px;height:300px;background:radial-gradient(circle,rgba(255,140,90,.55) 0%,transparent 68%)',flake:0,mote:10,motec:'255,214,170'},
  night:{sky:'radial-gradient(ellipse at 82% 6%,rgba(120,135,210,.26) 0%,transparent 50%),radial-gradient(ellipse at 50% 108%,rgba(110,90,130,.28) 0%,transparent 58%),linear-gradient(180deg,#05070f 0%,#0b1226 48%,#141a2e 80%,#1c1d33 100%)',logo:'#e8d8b0',glow:'rgba(190,200,245,.35)',stars:14,mist:'rgba(185,196,228,.14)',moon:1,flake:16,mote:0},
  deep:{sky:'radial-gradient(ellipse at 20% 6%,rgba(80,95,170,.18) 0%,transparent 50%),linear-gradient(180deg,#020308 0%,#060a18 55%,#0b1022 85%,#12142a 100%)',logo:'#dccfae',glow:'rgba(150,165,230,.3)',stars:30,mist:'rgba(150,160,200,.1)',moon:2,flake:8,mote:0}
};
const ldSlot=()=>{if(typeof isDevUser==='function'&&isDevUser()){const o=localStorage.getItem('rikka_dev_slot');if(o&&LD_SLOTS[o])return o;}const d=new Date(),h=d.getHours()+d.getMinutes()/60;return h>=5&&h<7?'dawn':h>=7&&h<16?'day':h>=16&&h<18.5?'dusk':h>=18.5&&h<23?'night':'deep';};
let _ldSlot='';
function ldBuild(slot){
  const L=LD_SLOTS[slot],rnd=(a,b)=>a+Math.random()*(b-a),sc=document.createElement('div');sc.className='ld-scene';
  const mg=`background:linear-gradient(90deg,transparent 0%,${L.mist} 40%,${L.mist} 60%,transparent 100%)`;
  let h=`<div class="ld-sky" style="background:${L.sky}"></div>`;
  if(L.sun)h+=`<div class="ld-glow" style="${L.sun}"></div>`;
  if(L.moon)h+=`<div class="ld-moon${L.moon===2?' sm':''}"></div>`;
  if(L.cloud)[[8,60],[34,92],[62,70]].forEach(([t,w],i)=>h+=`<div class="ld-cloud" style="top:${t}%;width:${w}%;background:${L.cloud};animation-duration:${90+i*40}s;animation-direction:${i%2?'alternate-reverse':'alternate'}"></div>`);
  h+=`<div class="ld-mist" style="top:58%;${mg}"></div><div class="ld-mist" style="top:74%;animation-duration:80s;animation-direction:alternate-reverse;${mg}"></div>`;
  sc.innerHTML=h;
  for(let i=0;i<L.stars;i++){const e=document.createElement('i'),z=1+Math.random()*1.3;e.className='lf-star';
    e.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*60}%;width:${z}px;height:${z}px;opacity:.6;animation-duration:${3+Math.random()*5}s;animation-delay:-${Math.random()*6}s`;sc.appendChild(e);}
  const flake=()=>{let a='';for(let i=0;i<6;i++)a+=`<g transform="rotate(${i*60} 50 50)"><path d="M50 50V8M50 30l-9-9M50 30l9-9M50 19l-6-6M50 19l6-6"/></g>`;
    return `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#dfe8ff" stroke-width="2.4" stroke-linecap="round">${a}<circle cx="50" cy="50" r="3" fill="#eef3ff" stroke="none"/></svg>`;};
  for(let i=0;i<(L.flake||0);i++){const e=document.createElement('span'),z=rnd(9,26),d=rnd(24,42);e.className='lf lf-fall';e.innerHTML=flake();
    e.style.cssText=`left:${rnd(0,96)}%;top:0;width:${z}px;height:${z}px;opacity:${z<14?rnd(.25,.45):rnd(.45,.75)};${z<14?'filter:blur(.7px);':''}animation-duration:${d}s;animation-delay:-${rnd(0,d)}s;--sx:${rnd(-30,40)}px`;sc.appendChild(e);}
  for(let i=0;i<(L.mote||0);i++){const e=document.createElement('i'),z=rnd(3,9),d=rnd(10,18);e.className='ld-mote';
    e.style.cssText=`left:${rnd(2,96)}%;top:${rnd(20,90)}%;width:${z}px;height:${z}px;background:radial-gradient(circle,rgba(${L.motec},.9),rgba(${L.motec},0) 70%);animation-duration:${d}s;animation-delay:-${rnd(0,d)}s;--sx:${rnd(-20,30)}px`;sc.appendChild(e);}
  sc.insertAdjacentHTML('beforeend','<div class="ld-vig"></div>');
  return sc;
}
function _ldShow(lobby,fx,fade){
  const slot=window._ldForce||ldSlot(),L=LD_SLOTS[slot];_ldSlot=slot;
  lobby.style.setProperty('--ld-sub',L.sub||'#8d89ad');lobby.style.setProperty('--logo-c',L.logo);lobby.style.setProperty('--logo-glow',L.glow);
  const sc=ldBuild(slot);
  if(!fade){fx.appendChild(sc);return;}
  const olds=[...fx.querySelectorAll('.ld-scene')];
  sc.style.opacity=0;fx.appendChild(sc);sc.getBoundingClientRect();sc.style.opacity=1;       // 新しい景色をゆっくり重ねる
  olds.forEach(o=>{o.style.opacity=0;setTimeout(()=>o.remove(),9000);});
}
function applyLobbyDefault(lobby,fx,st){
  lobby.classList.add('lobby-default');
  st.setProperty('--lobby-bg','#05070f');
  fx.innerHTML='';_ldShow(lobby,fx,false);
}
setInterval(()=>{const l=document.getElementById('lobby'),f=document.getElementById('lobby-fx');
  if(!l||!f||!l.classList.contains('lobby-default'))return;
  if((window._ldForce||ldSlot())!==_ldSlot)_ldShow(l,f,true);},30000);
window.setLobbySlot=n=>{window._ldForce=n||null;const l=document.getElementById('lobby'),f=document.getElementById('lobby-fx');
  if(l&&f&&l.classList.contains('lobby-default'))_ldShow(l,f,true);}; // 確認用：setLobbySlot('dusk') など
function applyLobbyEvent(){
  const ev=currentLobbyEvent(),id=ev?ev.id:'';
  if(id===_lobbyEventId){setTimeout(updateIconUpdateBtn,0);
    if(!id){const l=document.getElementById('lobby'),f=document.getElementById('lobby-fx');if(l&&f&&l.classList.contains('lobby-default')&&(window._ldForce||ldSlot())!==_ldSlot)_ldShow(l,f,true);} // 時間帯が変わっていれば、すぐに切り替える
    return;} // 変わっていなければ、背景はそのまま（お知らせの出し分けだけ更新）
  _lobbyEventId=id;
  updateAppIcons();
  setTimeout(updateIconUpdateBtn,0);
  stopLobbyCanvas();
  const lobby=document.getElementById('lobby'),fx=document.getElementById('lobby-fx'),bn=document.getElementById('lobby-event-banner');
  const st=lobby.style;
  ['--lobby-bg','--logo-c','--logo-glow','--moon-glow','--moon-glow2'].forEach(k=>st.removeProperty(k));
  fx.innerHTML=''; bn.style.display='none'; lobby.removeAttribute('data-event'); lobby.classList.remove('lobby-default');
  if(!ev){applyLobbyDefault(lobby,fx,st);return;}
  lobby.setAttribute('data-event',ev.id);
  st.setProperty('--lobby-bg',ev.bg); st.setProperty('--logo-c',ev.logo); st.setProperty('--logo-glow',ev.glow);
  if(ev.moon){st.setProperty('--moon-glow',ev.moon[0]);st.setProperty('--moon-glow2',ev.moon[1]);}
  fx.innerHTML=ev.deco||'';
  for(let i=0;i<(ev.stars||0);i++){
    const st2=document.createElement('i'),z=1+Math.random()*1.6;
    st2.className='lf-star';
    st2.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*72}%;width:${z}px;height:${z}px;animation-duration:${2+Math.random()*4}s;animation-delay:-${Math.random()*5}s`;
    fx.appendChild(st2);
  }
  for(let i=0;i<(ev.bats||0);i++){
    const el=document.createElement('div'),dur=_R(8,15);
    el.className='lf lf-fly';el.style.cssText=`top:${_R(4,42)}%;width:${_R(34,60)}px;animation-duration:${dur}s;animation-delay:-${_R(0,dur)}s`;
    el.innerHTML=batSvg();fx.appendChild(el);
  }
  for(let i=0;i<(ev.ghosts||0);i++){
    const el=document.createElement('div'),dur=_R(4,7);
    el.className='lf lf-bob';el.style.cssText=`left:${_R(5,85)}%;top:${_R(25,70)}%;width:${_R(38,62)}px;animation-duration:${dur}s;animation-delay:-${_R(0,dur)}s`;
    el.innerHTML=ghostSvg();fx.appendChild(el);
  }
  if(ev.skyline)fx.insertAdjacentHTML('beforeend',lobbySkylineSvg());
  if(ev.canvasFx==='fireworks')startLobbyFireworks(fx);
  else if(LOBBY_CANVAS[ev.canvasFx])makeLobbyCanvas(fx,LOBBY_CANVAS[ev.canvasFx]);
  const rnd=(a,b)=>a+Math.random()*(b-a);
  (ev.particles||[]).forEach(pt=>{
    for(let i=0;i<pt.count;i++){
      const sp=document.createElement('span'),dur=rnd(pt.dur[0],pt.dur[1]);
      sp.className='lf lf-'+pt.mode;
      sp.textContent=pt.chars[Math.floor(Math.random()*pt.chars.length)];
      const top=pt.y?rnd(pt.y[0],pt.y[1])+'%':'0';
      sp.style.cssText=`left:${pt.mode==='fly'?0:rnd(0,96)}%;top:${top};font-size:${rnd(pt.size[0],pt.size[1])}rem;`+
        `animation-duration:${dur}s;animation-delay:-${rnd(0,dur)}s;--sx:${rnd(-40,60)}px`;
      fx.appendChild(sp);
    }
  });
  bn.textContent=ev.banner; bn.style.display='block';
}

// ── 開発者モード（タイトル画面の背景を手動で切り替えて確認する） ──
function renderDevSection(){
  const sec=document.getElementById('sb-dev-section');
  if(!sec)return;
  if(!isDevUser()){sec.style.display='none';return;}
  sec.style.display='';
  const o=localStorage.getItem('rikka_dev_event');
  const cur=o===null?'auto':o;
  const cell=(val,bg,icon,label)=>`<button class="custom-card${cur===val?' sel':''}" onclick="setDevLobbyEvent('${val}')">
    ${cur===val?'<span class="chk">✔</span>':''}<div class="sw-bg" style="background:${bg}">${icon}</div><div class="nm">${label}</div></button>`;
  let h=cell('auto','linear-gradient(135deg,#3a2a14,#141008)','🗓️','自動（日付）')+cell('none','#1a1410','➖','なし');
  h+=LOBBY_EVENTS.map(e=>cell(e.id,e.bg,Array.from(e.banner)[0],esc(e.name))).join('');
  // 時間帯（イベントなしのときのタイトル）
  const cs=localStorage.getItem('rikka_dev_slot')||'auto';
  const cell2=(val,bg,icon,label)=>`<button class="custom-card${cs===val?' sel':''}" onclick="setDevLobbySlot('${val}')">
    ${cs===val?'<span class="chk">✔</span>':''}<div class="sw-bg" style="background:${bg}">${icon}</div><div class="nm">${label}</div></button>`;
  h+='<div style="grid-column:1/-1;font-size:.72rem;color:#8a7a50;margin:.5rem 0 .1rem">時間帯（イベントなしのとき）</div>';
  h+=cell2('auto','linear-gradient(135deg,#3a2a14,#141008)','🕒','自動（時刻）');
  [['dawn','🌅','明け方'],['day','☀️','昼'],['dusk','🌇','夕方'],['night','🌙','夜'],['deep','🌌','深夜']].forEach(([k,ic,nm])=>h+=cell2(k,LD_SLOTS[k].sky,ic,nm));
  // 限定ガチャ（開催期間に関係なく、選んだものを表示）
  const cg=localStorage.getItem('rikka_dev_gacha')||'auto';
  const cell3=(val,bg,icon,label)=>`<button class="custom-card${cg===val?' sel':''}" onclick="setDevGacha('${val}')">
    ${cg===val?'<span class="chk">✔</span>':''}<div class="sw-bg" style="background:${bg}">${icon}</div><div class="nm">${label}</div></button>`;
  h+='<div style="grid-column:1/-1;font-size:.72rem;color:#8a7a50;margin:.5rem 0 .1rem">限定ガチャ（開催期間に関係なく表示）</div>';
  h+=cell3('auto','linear-gradient(135deg,#3a2a14,#141008)','🗓️','自動（日付）');
  LIMITED_LIST.forEach(g=>h+=cell3(String(g.id),'linear-gradient(135deg,#3a1c40,#141008)','🌸',esc(g.name||String(g.id))+'<br><span style="font-size:.62rem;opacity:.7">'+g.start.slice(5).replace('-','/')+'〜'+g.end.slice(5).replace('-','/')+'</span>'));
  // 黄金の精神：確定演出（管理者だけ）
  const ka=kakuAdminAlways();
  const cell4=(on,bg,icon,label,fn)=>`<button class="custom-card${on?' sel':''}" onclick="${fn}">${on?'<span class="chk">✔</span>':''}<div class="sw-bg" style="background:${bg}">${icon}</div><div class="nm">${label}</div></button>`;
  h+='<div style="grid-column:1/-1;font-size:.72rem;color:#8a7a50;margin:.5rem 0 .1rem">黄金の精神：確定演出</div>';
  h+=cell4(false,'linear-gradient(135deg,#f7b35c,#3a1a1c)','▶','演出を見る','devPreviewKakutei()');
  h+=cell4(ka,'linear-gradient(135deg,#ffd24a,#5a2a08)','⭐','毎回流す（'+(ka?'ON':'OFF')+'）','setDevKakuAlways('+(!ka)+')');
  document.getElementById('sb-dev-grid').innerHTML=h;
}
function setDevGacha(v){
  if(!isDevUser())return;
  if(v==='auto')localStorage.removeItem('rikka_dev_gacha'); else localStorage.setItem('rikka_dev_gacha',v);
  renderDevSection();
  closeSidebar();
  const g=LIMITED_LIST.find(x=>String(x.id)===v);
  toast(v==='auto'?'限定ガチャ：自動（日付）':'限定ガチャ：'+(g?g.name:v)+'を表示（開発者プレビュー）');
}
function setDevLobbySlot(v){
  if(!isDevUser())return;
  if(v==='auto')localStorage.removeItem('rikka_dev_slot'); else{localStorage.setItem('rikka_dev_slot',v);localStorage.setItem('rikka_dev_event','none');} // 時間帯を選んだら、イベントなしの画面で見せる
  applyLobbyEvent();
  const l=document.getElementById('lobby'),f=document.getElementById('lobby-fx');
  if(l&&f&&l.classList.contains('lobby-default')&&ldSlot()!==_ldSlot)_ldShow(l,f,true);
  renderDevSection();
  closeSidebar();
  const nm={dawn:'明け方',day:'昼',dusk:'夕方',night:'夜',deep:'深夜'};
  toast(v==='auto'?'タイトルの時間帯：自動（時刻）':'タイトルの時間帯：'+nm[v]);
}
function setDevLobbyEvent(v){
  if(!isDevUser())return;
  if(v==='auto')localStorage.removeItem('rikka_dev_event'); else localStorage.setItem('rikka_dev_event',v);
  applyLobbyEvent();
  renderDevSection();
  closeSidebar();
  const ev=LOBBY_EVENTS.find(e=>e.id===v);
  toast(v==='auto'?'タイトル背景：自動（日付）':v==='none'?'タイトル背景：イベントなし':'タイトル背景：'+(ev?ev.name:v));
}
applyLobbyEvent();
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol)){navigator.serviceWorker.register('sw.js').catch(()=>{});}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)applyLobbyEvent();});
setInterval(applyLobbyEvent,10*60*1000); // 日付をまたいだら自動で切り替わる


let _tt=null;

// ===== ログインボーナス（毎日0時で切り替わり：花びら50＋7日ごとに称号、次の7日で★が増える）=====
const LOGIN_PETALS=50;
function _loginToday(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function showLoginBonus(){
  if(G&&G.phase==='playing')return;
  let st;try{st=JSON.parse(localStorage.getItem('rikka_login')||'{}');}catch(e){st={};}
  const today=_loginToday();
  if(st.last===today)return;
  st.total=(st.total||0)+1;st.last=today;
  try{localStorage.setItem('rikka_login',JSON.stringify(st));}catch(e){}
  addPetals(LOGIN_PETALS);try{missionAdd('login');}catch(e){}
  const pos=((st.total-1)%7)+1,star=st.total%7===0?st.total/7:0,tid='title_login_'+Math.min(star,100);
  if(star)grantItem(tid);
  const it=star&&GACHA_ITEMS.find(x=>x.id===tid);
  const stamps=Array.from({length:7},(_,i)=>`<span style="display:inline-block;width:2rem;height:2rem;line-height:2rem;margin:.15rem;border-radius:50%;font-size:.8rem;${i<pos?'background:#e8a0c0;color:#fff':'background:#2a1e14;color:#6a5030'}">${i===6?'🏅':(i<pos?'🌸':i+1)}</span>`).join('');
  showModal(`<div class="mtitle">🌸 ログインボーナス</div>
<div style="margin:.5rem 0">${stamps}</div>
<div style="font-size:.9rem;color:#8a7860">${st.total}日目（${pos}/7）</div>
<div class="mpts">🌸 花びら +${LOGIN_PETALS}</div>
${it?`<div style="margin:.6rem 0;color:#f5d040">🎉 称号「${esc(it.title)}」を獲得！<div style="font-size:.78rem;color:#8a7048">カスタマイズの称号から付けられます</div></div>`:''}
<button class="mbtn" onclick="document.getElementById('modal').classList.remove('open')">閉じる</button>`);
}
window.addEventListener('load',()=>setTimeout(()=>{try{showLoginBonus();}catch(e){}},900));
document.addEventListener('visibilitychange',()=>{if(!document.hidden){try{showLoginBonus();}catch(e){}}});
// ===== 制作者へのメッセージ（不具合の報告・ご要望）=====
let _reportBusy=false;
function openReportModal(){
  const d=(()=>{try{return JSON.parse(localStorage.getItem('rikka_report_draft')||'{}');}catch(e){return {};}})();
  showModal(`<div class="mtitle">✉️ 制作者へのメッセージ</div>
    <div style="text-align:left">
      <div style="font-size:.78rem;color:#c9a870;margin-bottom:.3rem">種類</div>
      <select id="rp-kind" class="fselect" style="width:100%;margin-bottom:.6rem"><option value="bug">🐞 不具合の報告</option><option value="idea">💡 ご要望・アイデア</option><option value="other">💬 その他</option></select>
      <div style="font-size:.78rem;color:#c9a870;margin-bottom:.3rem">内容（できれば、いつ・何をしたときか、も書いてください）</div>
      <textarea id="rp-msg" maxlength="1000" rows="6" placeholder="例：ガチャ画面を開き直すと、一覧が切り替わらない" style="width:100%;box-sizing:border-box;padding:.5rem;border-radius:8px;border:1px solid #4a3418;background:#120c06;color:#e8dcc4;font-family:inherit;font-size:.9rem;resize:vertical">${esc(d.msg||'')}</textarea>
      <div style="font-size:.78rem;color:#c9a870;margin:.5rem 0 .3rem">連絡先（返信がほしいときだけ。任意）</div>
      <input id="rp-contact" maxlength="100" class="finput" style="width:100%;box-sizing:border-box" placeholder="メールアドレスやSNSのIDなど" value="${esc(d.contact||'')}">
      <div style="font-size:.7rem;color:#8a7048;line-height:1.5;margin:.5rem 0 .7rem">送られる情報：上の内容、いまのプレイヤー名、ブラウザの種類・画面の状態。Googleのメールアドレスなどは、送られません。</div>
    </div>
    <button id="rp-send" class="mbtn" onclick="sendReport()">送信する</button>
    <button class="mbtn" style="background:#2a1e14;color:#c9a84c;border:1px solid #5a4020;margin-top:.4rem" onclick="saveReportDraft();document.getElementById('modal').classList.remove('open')">閉じる</button>`);
}
function saveReportDraft(){
  const m=document.getElementById('rp-msg'),c=document.getElementById('rp-contact');
  try{localStorage.setItem('rikka_report_draft',JSON.stringify({msg:m?m.value:'',contact:c?c.value:''}));}catch(e){}
}
async function sendReport(){
  if(_reportBusy)return;
  const msg=document.getElementById('rp-msg').value.trim(),kind=document.getElementById('rp-kind').value,contact=document.getElementById('rp-contact').value.trim();
  if(msg.length<3){toast('内容を入力してください');return;}
  const btn=document.getElementById('rp-send');
  _reportBusy=true;btn.disabled=true;btn.textContent='送信中…（サーバーが眠っていると少し時間がかかります）';
  const screen=(document.querySelector('.screen.active,.scr.active')||{}).id||'';
  const ctx=`${navigator.userAgent.slice(0,120)} | screen:${screen} | online:${typeof onlineMode!=='undefined'&&onlineMode?1:0} | ${innerWidth}x${innerHeight}`;
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),30000);
  try{
    const r=await fetch(SERVER_URL+'/report',{method:'POST',headers:{'Content-Type':'application/json'},signal:ac.signal,body:JSON.stringify({kind,message:msg,contact,name:myName(),ctx})});
    const j=await r.json().catch(()=>({}));
    if(r.ok&&j.ok){try{localStorage.removeItem('rikka_report_draft');}catch(e){}document.getElementById('modal').classList.remove('open');toast('✉️ 送信しました。ありがとうございます！');}
    else{toast(j.error||'送信できませんでした');btn.disabled=false;btn.textContent='送信する';}
  }catch(e){toast('送信できませんでした。通信状況を確認してください');btn.disabled=false;btn.textContent='送信する';}
  finally{clearTimeout(to);_reportBusy=false;}
}
