
// ===== ガチャのアイコン（動くSVG。<img>に入れても動く）=====
const _GI_STYLE='<style>.o{transform-box:fill-box;transform-origin:center}.b{transform-box:fill-box;transform-origin:50% 100%}'
 +'@keyframes spin{to{transform:rotate(360deg)}}@keyframes tw{0%,100%{opacity:.2}50%{opacity:1}}@keyframes fall{from{transform:translate(0,-30px);opacity:0}15%{opacity:1}to{transform:translate(-14px,120px);opacity:.8}}'
 +'@keyframes sway{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}@keyframes squash{0%,100%{transform:scale(1,1)}50%{transform:scale(1.1,.86)}}'
 +'@keyframes blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}@keyframes flick{0%,100%{transform:scale(1,1) skewX(0)}30%{transform:scale(.95,1.07) skewX(3deg)}60%{transform:scale(1.04,.95) skewX(-3deg)}}'
 +'@keyframes rise{from{transform:translateY(0);opacity:1}to{transform:translateY(-46px);opacity:0}}@keyframes pulse{0%,100%{transform:scale(.8);opacity:.6}50%{transform:scale(1.2);opacity:1}}'
 +'@keyframes bob{0%,100%{transform:translateY(2px)}50%{transform:translateY(-3px)}}@keyframes sweep{from{transform:translateX(-60px) skewX(-20deg)}to{transform:translateX(130px) skewX(-20deg)}}'
 +'@keyframes twitch{0%,90%,100%{transform:rotate(0)}94%{transform:rotate(-14deg)}}</style>';
function _giSvg(bg,body){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><clipPath id="c"><circle cx="50" cy="50" r="50"/></clipPath>${bg}</defs>${_GI_STYLE}<g clip-path="url(#c)"><rect width="100" height="100" fill="url(#bg)"/>${body}</g></svg>`;}
const _giLG=(a,b)=>`<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const _giRG=(a,b)=>`<radialGradient id="bg" cx=".5" cy=".5" r=".75"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`;
const GICON_SVG={
  gi_sakura(){let p='';for(let i=0;i<5;i++)p+=`<ellipse cx="50" cy="31" rx="11" ry="18" fill="#fff" fill-opacity=".93" transform="rotate(${i*72} 50 50)"/>`;
    let f='';[[18,0,0],[72,1.3,1],[44,2.4,2],[84,.6,3]].forEach(([x,d,i])=>f+=`<ellipse cx="${x}" cy="0" rx="3.2" ry="1.9" fill="#fff" style="animation:fall ${4+i*.7}s linear ${d}s infinite"/>`);
    return _giSvg(_giLG('#ffd6e6','#ff9ec4'),`<g class="o" style="animation:spin 16s linear infinite">${p}<circle cx="50" cy="50" r="7" fill="#ffcf40"/></g>${f}`);},
  gi_moon(){let s='';[[18,20],[78,16],[70,70],[24,76],[50,10],[88,46]].forEach(([x,y],i)=>s+=`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" style="animation:tw ${1.6+i*.3}s ease-in-out ${i*.25}s infinite"/>`);
    return _giSvg(_giLG('#0a0a30','#3a2070'),`${s}<g class="o" style="animation:sway 4s ease-in-out infinite"><path d="M60 20a31 31 0 1 0 0 60a25 25 0 1 1 0-60z" fill="#ffe9a8"/></g>`);},
  gi_slime(){return _giSvg(_giLG('#d4f4dc','#7ad898'),`<g class="b" style="animation:squash 1.6s ease-in-out infinite"><path d="M18 82Q14 40 50 32Q86 40 82 82Z" fill="#5be08a" stroke="#2a9a58" stroke-width="3"/><ellipse cx="34" cy="48" rx="6" ry="3.5" fill="#fff" fill-opacity=".6"/>
    <g class="o" style="animation:blink 3.4s infinite"><circle cx="38" cy="62" r="5" fill="#123"/><circle cx="62" cy="62" r="5" fill="#123"/></g><path d="M44 72q6 5 12 0" stroke="#123" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>`);},
  gi_cat(){return _giSvg(_giLG('#ffe9a8','#ffb870'),`<g class="o" style="animation:twitch 4.5s infinite"><polygon points="24,44 26,16 46,32" fill="#fff"/><polygon points="29,38 30,23 40,32" fill="#ffb0c0"/></g><polygon points="76,44 74,16 54,32" fill="#fff"/><polygon points="71,38 70,23 60,32" fill="#ffb0c0"/>
    <circle cx="50" cy="58" r="30" fill="#fff"/><g class="o" style="animation:blink 4s infinite"><ellipse cx="38" cy="56" rx="3.6" ry="5.2" fill="#222"/><ellipse cx="62" cy="56" rx="3.6" ry="5.2" fill="#222"/></g>
    <polygon points="46,64 54,64 50,69" fill="#ff8aa0"/><path d="M50 69v3M50 72q-4 4-8 1M50 72q4 4 8 1" stroke="#222" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M18 62l14 2M18 70l14-2M82 62l-14 2M82 70l-14-2" stroke="#999" stroke-width="1.4"/>`);},
  gi_flame(){let sp='';[[38,70,0],[60,72,.7],[50,66,1.4]].forEach(([x,y,d])=>sp+=`<circle cx="${x}" cy="${y}" r="1.8" fill="#ffd060" style="animation:rise 2s ease-out ${d}s infinite"/>`);
    return _giSvg(_giRG('#601a10','#1a0402')+'<linearGradient id="f1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb040"/><stop offset="1" stop-color="#e02810"/></linearGradient>',`<g class="b" style="animation:flick .9s ease-in-out infinite"><path d="M50 12C62 32 78 42 74 66C72 82 58 90 50 90C42 90 28 82 26 66C24 50 40 44 44 30C46 24 48 20 50 12Z" fill="url(#f1)"/><path d="M50 44C58 56 64 62 62 74C60 82 54 86 50 86C46 86 40 82 38 74C36 64 46 58 50 44Z" fill="#ffe070"/></g>${sp}`);},
  gi_rikka(){let a='';for(let i=0;i<6;i++)a+=`<path d="M50 50V15M50 31l-8-8M50 31l8-8M50 40l-5-5M50 40l5-5" stroke="#d8f4ff" stroke-width="3" stroke-linecap="round" fill="none" transform="rotate(${i*60} 50 50)"/>`;
    return _giSvg(_giRG('#12486a','#040e1a'),`<circle cx="50" cy="50" r="22" fill="#7ac8e8" opacity=".25" class="o" style="animation:pulse 2.4s ease-in-out infinite"/><g class="o" style="animation:spin 20s linear infinite">${a}</g><circle cx="50" cy="50" r="5" fill="#fff"/>`);},
  gi_galaxy(){let d='';for(let k=0;k<2;k++)for(let i=0;i<34;i++){const t=i/34*3.6,r=4+t*10.5,an=t*1.5+k*Math.PI;d+=`<circle cx="${(50+Math.cos(an)*r).toFixed(1)}" cy="${(50+Math.sin(an)*r).toFixed(1)}" r="${(.8+(1-i/34)*1.5).toFixed(1)}" fill="${k?'#c8b8ff':'#a8d0ff'}"/>`;}
    let s='';[[14,18],[84,22],[20,84],[80,80],[50,8]].forEach(([x,y],i)=>s+=`<circle cx="${x}" cy="${y}" r="1.3" fill="#fff" style="animation:tw ${1.5+i*.4}s ease-in-out ${i*.3}s infinite"/>`);
    return _giSvg(_giRG('#1a1048','#02020c'),`${s}<g class="o" style="animation:spin 11s linear infinite">${d}</g><circle cx="50" cy="50" r="9" fill="#fff4d0" class="o" style="animation:pulse 2s ease-in-out infinite"/>`);},
  gi_crown(){const star=(x,y,d)=>`<path d="M${x} ${y-7}L${x+1.8} ${y-1.8}L${x+7} ${y}L${x+1.8} ${y+1.8}L${x} ${y+7}L${x-1.8} ${y+1.8}L${x-7} ${y}L${x-1.8} ${y-1.8}Z" fill="#fff" class="o" style="animation:pulse 1.8s ease-in-out ${d}s infinite"/>`;
    return _giSvg(_giRG('#4a3408','#0e0802')+'<linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0a0"/><stop offset="1" stop-color="#d89a18"/></linearGradient><clipPath id="cr"><path d="M20 70L24 38L40 55L50 28L60 55L76 38L80 70Z"/></clipPath>',
    `<g style="animation:bob 2.6s ease-in-out infinite"><path d="M20 70L24 38L40 55L50 28L60 55L76 38L80 70Z" fill="url(#gd)" stroke="#a06a08" stroke-width="2"/><rect x="20" y="68" width="60" height="11" rx="3" fill="#e0a020" stroke="#a06a08" stroke-width="2"/>
    <circle cx="32" cy="73.5" r="3" fill="#e03040"/><circle cx="50" cy="73.5" r="3.4" fill="#3090ff"/><circle cx="68" cy="73.5" r="3" fill="#30c060"/><circle cx="24" cy="36" r="3" fill="#fff"/><circle cx="50" cy="26" r="3.4" fill="#fff"/><circle cx="76" cy="36" r="3" fill="#fff"/>
    <g clip-path="url(#cr)"><rect x="0" y="20" width="14" height="70" fill="#fff" opacity=".6" style="animation:sweep 2.6s linear infinite"/></g></g>${star(18,24,0)}${star(84,30,.6)}${star(80,84,1.2)}${star(16,80,.3)}`);},
};
const _giCache={};
function giconUri(id){
  if(_giCache[id])return _giCache[id];
  const f=GICON_SVG[id];if(!f)return '';
  return _giCache[id]='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(f()).replace(/'/g,'%27').replace(/\(/g,'%28').replace(/\)/g,'%29');
}
GACHA_ITEMS.push(
  {id:'gi_sakura', rarity:'common',   category:'gicon', icon:'🌸', title:'舞う桜',       desc:'アイコン：桜が舞う（動く）', value:'gi_sakura'},
  {id:'gi_moon',   rarity:'common',   category:'gicon', icon:'🌙', title:'月夜',         desc:'アイコン：揺れる三日月（動く）', value:'gi_moon'},
  {id:'gi_slime',  rarity:'uncommon', category:'gicon', icon:'🟢', title:'ぷるぷるスライム', desc:'アイコン：弾むスライム（動く）', value:'gi_slime'},
  {id:'gi_cat',    rarity:'uncommon', category:'gicon', icon:'🐱', title:'まばたき猫',   desc:'アイコン：まばたきする猫（動く）', value:'gi_cat'},
  {id:'gi_flame',  rarity:'rare',     category:'gicon', icon:'🔥', title:'揺れる炎',     desc:'アイコン：燃える炎（動く）', value:'gi_flame'},
  {id:'gi_rikka',  rarity:'rare',     category:'gicon', icon:'❄️', title:'六華の結晶',   desc:'アイコン：回る雪の結晶（動く）', value:'gi_rikka'},
  {id:'gi_galaxy', rarity:'rare',     category:'gicon', icon:'🌌', title:'渦巻く銀河',   desc:'アイコン：回る銀河（動く）', value:'gi_galaxy'},
  {id:'gi_crown',  rarity:'superrare',category:'gicon', icon:'👑', title:'輝く王冠',     desc:'アイコン：きらめく王冠（動く）', value:'gi_crown'},
);

// 期間限定ガチャのアイコン
GICON_SVG.gi_coin=function(){return _giSvg(_giRG('#3a2a10','#0e0a04'),`<style>@keyframes coin{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.08)}}@keyframes glint{0%,60%{opacity:0}80%{opacity:.9}100%{opacity:0}}</style>
  <g class="o" style="animation:coin 2.2s ease-in-out infinite"><circle cx="50" cy="50" r="30" fill="#f5c030" stroke="#a06a08" stroke-width="3"/><circle cx="50" cy="50" r="23" fill="none" stroke="#c88a10" stroke-width="2.5"/>
  <path d="M50 33l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z" fill="#fff0a0" stroke="#c88a10" stroke-width="1.5"/></g>
  <circle cx="38" cy="38" r="3" fill="#fff" style="animation:glint 2.2s ease-in-out infinite"/>`);};
GICON_SVG.gi_lantern=function(){let s='',k='';[[14,16],[84,12],[76,70],[20,64],[50,8]].forEach(([x,y],i)=>s+=`<circle cx="${x}" cy="${y}" r="1.5" fill="#fff" style="animation:tw ${1.6+i*.3}s ease-in-out ${i*.3}s infinite"/>`);
  [[44,80,0],[56,82,.8],[50,78,1.5]].forEach(([x,y,d])=>k+=`<circle cx="${x}" cy="${y}" r="1.6" fill="#ffc060" style="animation:rise 2.4s ease-out ${d}s infinite"/>`);
  return _giSvg(_giLG('#0a0a24','#3a1c40'),`${s}<g style="transform-box:fill-box;transform-origin:50% 0;animation:sway 3.2s ease-in-out infinite"><path d="M50 0V22" stroke="#caa060" stroke-width="2"/><circle cx="50" cy="52" r="34" fill="#ff9a30" opacity=".35" class="o" style="animation:pulse 2s ease-in-out infinite"/>
  <rect x="38" y="20" width="24" height="5" rx="2" fill="#7a3a10"/><rect x="34" y="25" width="32" height="46" rx="12" fill="#ff8a28" stroke="#c85a10" stroke-width="2.5"/><rect x="41" y="31" width="18" height="34" rx="8" fill="#ffe2a0" opacity=".9" class="o" style="animation:pulse 1.4s ease-in-out infinite"/>
  <path d="M34 48H66M34 56H66" stroke="#c85a10" stroke-width="1.2" opacity=".6"/><rect x="40" y="71" width="20" height="5" rx="2" fill="#7a3a10"/><path d="M46 76v8M50 76v10M54 76v8" stroke="#ff9a30" stroke-width="2" stroke-linecap="round"/></g>${k}`);};
GICON_SVG.gi_redmoon=function(){let e='';[[24,86,0],[40,90,.6],[62,88,1.1],[78,84,1.7],[52,92,.3]].forEach(([x,y,d])=>e+=`<circle cx="${x}" cy="${y}" r="1.5" fill="#ff7050" style="animation:rise 3s ease-out ${d}s infinite"/>`);
  return _giSvg(_giLG('#0a0208','#5a1418'),`<style>@keyframes drift{from{transform:translateX(-60px)}to{transform:translateX(160px)}}</style>
  <circle cx="50" cy="42" r="40" fill="#c01820" opacity=".4" class="o" style="animation:pulse 2.6s ease-in-out infinite"/><circle cx="50" cy="42" r="23" fill="#ff5a48"/><circle cx="50" cy="42" r="23" fill="#ffd0b8" opacity=".2"/>
  <ellipse cx="20" cy="44" rx="30" ry="4" fill="#12040a" opacity=".8" style="animation:drift 9s linear infinite"/>
  <path d="M0 100V80l8-22 8 22 7-30 9 34 8-26 8 26 9-36 8 32 8-22 9 22V100Z" fill="#050104"/>${e}`);};
GICON_SVG.gi_skull=function(){
  const rows=['...######...','..########..','.##########.','.##########.','.#...##...#.','.#...##...#.','.#...##...#.','.####..####.','..########..','..#.#..#.#..','...######...'],P=6,X=14,Y=17;
  let ol='',px='',hole='';
  rows.forEach((row,y)=>[...row].forEach((c,x)=>{
    if(c==='#'){ol+=`<rect x="${X+x*P-1.3}" y="${Y+y*P-1.3}" width="${P+2.6}" height="${P+2.6}" fill="#12060e"/>`;
      px+=`<rect x="${X+x*P}" y="${Y+y*P}" width="${P}" height="${P}" fill="${(x>=8&&y>=2)||y>=8?'#d2d2de':'#f2f2f8'}"/>`;}
    else if((y>=4&&y<=6&&((x>=2&&x<=4)||(x>=7&&x<=9)))||(y===7&&(x===5||x===6))||(y===9&&[3,5,6,8].includes(x)))hole+=`<rect x="${X+x*P}" y="${Y+y*P}" width="${P}" height="${P}" fill="#0a0410"/>`;}));
  const bone=r=>`<g transform="rotate(${r} 50 72)"><rect x="8" y="68.5" width="84" height="7" rx="3.5" fill="#c4c4d2" stroke="#12060e" stroke-width="1.4"/>${[[9,66.5],[9,77.5],[91,66.5],[91,77.5]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="#c4c4d2" stroke="#12060e" stroke-width="1.4"/>`).join('')}</g>`;
  let sc='';for(let y=0;y<100;y+=4)sc+=`<rect y="${y}" width="100" height="1.4" fill="#000" opacity=".22"/>`;
  return _giSvg(_giRG('#2a0a20','#06020a'),`<style>@keyframes jit{0%,86%,100%{transform:translate(0,0)}88%{transform:translate(3px,-1px)}91%{transform:translate(-3px,1px)}94%{transform:translate(2px,0)}}@keyframes eye{0%,100%{opacity:.5}50%{opacity:1}}@keyframes scan{from{transform:translateY(-8px)}to{transform:translateY(8px)}}</style>
  ${bone(32)}${bone(-32)}
  <g style="animation:jit 2.8s steps(1) infinite">${ol}${px}${hole}
  <g style="animation:eye 1.2s ease-in-out infinite"><circle cx="${X+3.5*P}" cy="${Y+5.5*P}" r="9" fill="#ff2a40" opacity=".35"/><circle cx="${X+8.5*P}" cy="${Y+5.5*P}" r="9" fill="#ff2a40" opacity=".35"/><rect x="${X+3*P}" y="${Y+5*P}" width="${P}" height="${P}" fill="#ff3a50"/><rect x="${X+8*P}" y="${Y+5*P}" width="${P}" height="${P}" fill="#ff3a50"/></g></g>
  <g style="animation:scan .8s linear infinite">${sc}</g>`);};
GACHA_ITEMS.push(
  {id:'gi_coin',    rarity:'common',   category:'gicon', limited:1, icon:'🪙', title:'ゲームコイン',     desc:'アイコン：回るコイン（動く・期間限定）', value:'gi_coin'},
  {id:'gi_lantern', rarity:'uncommon', category:'gicon', limited:1, icon:'🏮', title:'ゆれる灯籠',       desc:'アイコン：揺れる灯籠（動く・期間限定）', value:'gi_lantern'},
  {id:'gi_redmoon', rarity:'rare',     category:'gicon', limited:1, icon:'🌑', title:'赤い月',           desc:'アイコン：脈打つ赤い月（動く・期間限定）', value:'gi_redmoon'},
  {id:'gi_skull',   rarity:'rare',     category:'gicon', limited:1, icon:'💀', title:'ゲームオーバー',   desc:'アイコン：ドット絵のドクロ（動く・期間限定）', value:'gi_skull'},
);
// ===== イベント限定の景品（ガチャには出ない。イベントの報酬だけ）=====
GICON_SVG.gi_pumpkin=function(){return _giSvg(_giLG('#1a0a28','#0a0414'),`<style>@keyframes fly{from{transform:translate(-24px,6px)}to{transform:translate(124px,-6px)}}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.25)}}@keyframes cand{0%,100%{opacity:.75}40%{opacity:1}60%{opacity:.55}}</style>
  <circle cx="50" cy="58" r="40" fill="#ff8a20" opacity=".3" class="o" style="animation:pulse 2s ease-in-out infinite"/>
  <ellipse cx="34" cy="60" rx="18" ry="24" fill="#e86a10"/><ellipse cx="66" cy="60" rx="18" ry="24" fill="#e86a10"/><ellipse cx="50" cy="60" rx="20" ry="26" fill="#ff9a30"/>
  <path d="M50 36q-3 8 0 16M38 38q-5 10-2 22M62 38q5 10 2 22" stroke="#b84a08" stroke-width="1.6" fill="none" opacity=".6"/>
  <g style="transform-box:fill-box;transform-origin:50% 100%;animation:sway 3s ease-in-out infinite"><rect x="47" y="26" width="6" height="12" rx="2" fill="#4a8a2a"/></g>
  <g style="animation:cand 1.5s ease-in-out infinite"><polygon points="36,52 44,52 40,60" fill="#ffe070"/><polygon points="56,52 64,52 60,60" fill="#ffe070"/><path d="M36 68l5 5 4-5 5 5 4-5 5 5 5-5" stroke="#ffe070" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/></g>
  <g style="animation:fly 6s linear infinite"><g class="o" style="animation:flap .35s ease-in-out infinite"><path d="M0 14q-8-8-14-2q5 0 7 5q-3 0-6 3q6-2 9 2q3-5 4-8z M0 14q8-8 14-2q-5 0-7 5q3 0 6 3q-6-2-9 2q-3-5-4-8z" fill="#050208" transform="translate(0 0)"/></g></g>`);};
GACHA_ITEMS.push(
  {id:'gi_pumpkin', rarity:'rare', category:'gicon', event:'halloween2026', icon:'🎃', title:'ジャックのかぼちゃ', desc:'アイコン：笑うかぼちゃ（動く・ハロウィン限定）', value:'gi_pumpkin'},
  {id:'title_ev_halloween2026', rarity:'rare', category:'title', event:'halloween2026', icon:'🎃', title:'ジャック・オー・ランタン', desc:'名前の横に称号が付きます（ハロウィン限定）', value:'ジャック・オー・ランタン'},
  {id:'bg_pumpkinfield', rarity:'rare', category:'fieldbg', type:'scene', event:'halloween2026', icon:'🎃', title:'かぼちゃ畑の夜', desc:'場の背景：かぼちゃ畑と夕焼けの月（ハロウィン限定）', get value(){return sceneUri('pumpkinfield');}},
  {id:'bg_haunted', rarity:'rare', category:'fieldbg', type:'scene', event:'halloween2026', icon:'🏚️', title:'お化け屋敷の夜', desc:'場の背景：月夜の洋館とさまよう霊（ハロウィン限定）', get value(){return sceneUri('haunted');}},
  {id:'theme_pumpkin', rarity:'rare', category:'theme', event:'halloween2026', icon:'🎃', title:'かぼちゃの裏地', desc:'牌の裏デザイン：かぼちゃ（ハロウィン限定）', value:'pumpkin'},
);
// ===== 季節イベントの限定景品（クリスマス〜お月見。イベントの報酬だけで、ガチャには出ない）=====
function _evGi(a,b,emoji,c){return function(){let sp='';[[24,86,0],[50,90,.8],[76,86,1.5]].forEach(([x,y,d])=>sp+=`<circle cx="${x}" cy="${y}" r="1.6" fill="${c}" style="animation:rise 3s ease-out ${d}s infinite"/>`);
  return _giSvg(_giLG(a,b),`<circle cx="50" cy="56" r="38" fill="${c}" opacity=".16" style="animation:pulse 2.4s ease-in-out infinite"/><text x="50" y="68" font-size="46" text-anchor="middle" style="animation:bob 2.6s ease-in-out infinite">${emoji}</text>${sp}`);};}
GICON_SVG.gi_xmas=_evGi('#0e3a1e','#06180c','🎄','#ffe070');
GICON_SVG.gi_kadomatsu=_evGi('#5a0a10','#240408','🎍','#ffd870');
GICON_SVG.gi_choco=_evGi('#4a0a2a','#1c0410','🍫','#ff9ac0');
GICON_SVG.gi_hanafubuki=_evGi('#3a1a30','#180a14','🌸','#ffc0d8');
GICON_SVG.gi_tanzaku=_evGi('#0a1040','#04061c','🎋','#9ab8ff');
GICON_SVG.gi_hanabi=_evGi('#2a0a0a','#100404','🎆','#ff8a50');
GICON_SVG.gi_tsukimi=_evGi('#1a1a3a','#0a0a1c','🌕','#ffe890');
GACHA_ITEMS.push(
  {id:'gi_xmas', rarity:'rare', category:'gicon', event:'christmas2026', icon:'🎄', title:'聖夜のツリー', desc:'アイコン：きらめくツリー（動く・クリスマス限定）', value:'gi_xmas'},
  {id:'title_ev_christmas2026', rarity:'rare', category:'title', event:'christmas2026', icon:'🎅', title:'聖夜のサンタ', desc:'名前の横に称号が付きます（クリスマス限定）', value:'聖夜のサンタ'},
  {id:'theme_xmas', rarity:'rare', category:'theme', event:'christmas2026', icon:'🎄', title:'聖夜の裏地', desc:'牌の裏デザイン：クリスマス（クリスマス限定）', value:'xmas'},
  {id:'gi_kadomatsu', rarity:'rare', category:'gicon', event:'newyear2027', icon:'🎍', title:'門松', desc:'アイコン：おめでたい門松（動く・お正月限定）', value:'gi_kadomatsu'},
  {id:'title_ev_newyear2027', rarity:'rare', category:'title', event:'newyear2027', icon:'🎍', title:'初春の福者', desc:'名前の横に称号が付きます（お正月限定）', value:'初春の福者'},
  {id:'theme_newyear', rarity:'rare', category:'theme', event:'newyear2027', icon:'🎍', title:'初春の裏地', desc:'牌の裏デザイン：お正月（お正月限定）', value:'newyear'},
  {id:'gi_choco', rarity:'rare', category:'gicon', event:'valentine2027', icon:'🍫', title:'ひみつのチョコ', desc:'アイコン：ときめくチョコ（動く・バレンタイン限定）', value:'gi_choco'},
  {id:'title_ev_valentine2027', rarity:'rare', category:'title', event:'valentine2027', icon:'💝', title:'ハートの勝者', desc:'名前の横に称号が付きます（バレンタイン限定）', value:'ハートの勝者'},
  {id:'theme_valentine', rarity:'rare', category:'theme', event:'valentine2027', icon:'💝', title:'ハートの裏地', desc:'牌の裏デザイン：バレンタイン（バレンタイン限定）', value:'valentine'},
  {id:'gi_hanafubuki', rarity:'rare', category:'gicon', event:'sakura2027', icon:'🌸', title:'花吹雪', desc:'アイコン：舞う桜（動く・お花見限定）', value:'gi_hanafubuki'},
  {id:'title_ev_sakura2027', rarity:'rare', category:'title', event:'sakura2027', icon:'🌸', title:'満開の宴', desc:'名前の横に称号が付きます（お花見限定）', value:'満開の宴'},
  {id:'theme_hanafubuki', rarity:'rare', category:'theme', event:'sakura2027', icon:'🌸', title:'花吹雪の裏地', desc:'牌の裏デザイン：花吹雪（お花見限定）', value:'hanafubuki'},
  {id:'gi_tanzaku', rarity:'rare', category:'gicon', event:'tanabata2027', icon:'🎋', title:'願いの短冊', desc:'アイコン：揺れる笹（動く・七夕限定）', value:'gi_tanzaku'},
  {id:'title_ev_tanabata2027', rarity:'rare', category:'title', event:'tanabata2027', icon:'⭐', title:'天の川の願い人', desc:'名前の横に称号が付きます（七夕限定）', value:'天の川の願い人'},
  {id:'theme_tanabata', rarity:'rare', category:'theme', event:'tanabata2027', icon:'🎋', title:'天の川の裏地', desc:'牌の裏デザイン：七夕（七夕限定）', value:'tanabata'},
  {id:'gi_hanabi', rarity:'rare', category:'gicon', event:'matsuri2027', icon:'🎆', title:'大輪の花火', desc:'アイコン：夜空の花火（動く・夏祭り限定）', value:'gi_hanabi'},
  {id:'title_ev_matsuri2027', rarity:'rare', category:'title', event:'matsuri2027', icon:'🏮', title:'夏祭りの主役', desc:'名前の横に称号が付きます（夏祭り限定）', value:'夏祭りの主役'},
  {id:'theme_matsuri', rarity:'rare', category:'theme', event:'matsuri2027', icon:'🏮', title:'提灯の裏地', desc:'牌の裏デザイン：夏祭り（夏祭り限定）', value:'matsuri'},
  {id:'gi_tsukimi', rarity:'rare', category:'gicon', event:'tsukimi2027', icon:'🌕', title:'満月とうさぎ', desc:'アイコン：輝く満月（動く・お月見限定）', value:'gi_tsukimi'},
  {id:'title_ev_tsukimi2027', rarity:'rare', category:'title', event:'tsukimi2027', icon:'🍡', title:'月見の宴の客', desc:'名前の横に称号が付きます（お月見限定）', value:'月見の宴の客'},
  {id:'theme_tsukimi', rarity:'rare', category:'theme', event:'tsukimi2027', icon:'🌕', title:'満月の裏地', desc:'牌の裏デザイン：お月見（お月見限定）', value:'tsukimi'},
);
// ===== 期間限定イベント（期間を過ぎるとロビーのボタンも遊べる場所も自動で消える）=====
GACHA_ITEMS.push(
  {id:'bg_xmasnight', rarity:'rare', category:'fieldbg', type:'scene', event:'christmas2026', icon:'🎄', title:'雪の聖夜', desc:'場の背景：雪降る聖夜とまたたく灯り（動く・クリスマス限定）', get value(){return sceneUri('xmasnight');}},
  {id:'bg_newyearsun', rarity:'rare', category:'fieldbg', type:'scene', event:'newyear2027', icon:'🌅', title:'初日の出', desc:'場の背景：昇る初日の出と金色の光（動く・お正月限定）', get value(){return sceneUri('newyearsun');}},
  {id:'bg_heartnight', rarity:'rare', category:'fieldbg', type:'scene', event:'valentine2027', icon:'💝', title:'ハートの夜', desc:'場の背景：舞い上がるハートの夜空（動く・バレンタイン限定）', get value(){return sceneUri('heartnight');}},
  {id:'bg_sakurastorm', rarity:'rare', category:'fieldbg', type:'scene', event:'sakura2027', icon:'🌸', title:'桜吹雪の夕暮れ', desc:'場の背景：夕暮れの桜並木と吹き荒れる花びら（動く・お花見限定）', get value(){return sceneUri('sakurastorm');}},
  {id:'bg_milkyway', rarity:'rare', category:'fieldbg', type:'scene', event:'tanabata2027', icon:'🌌', title:'天の川の夜', desc:'場の背景：天の川と流れ星、笹飾り（動く・七夕限定）', get value(){return sceneUri('milkyway');}},
  {id:'bg_festival', rarity:'rare', category:'fieldbg', type:'scene', event:'matsuri2027', icon:'🏮', title:'夏祭りの夜', desc:'場の背景：提灯が並ぶ夜店と打ち上がる花火（動く・夏祭り限定）', get value(){return sceneUri('festival');}},
  {id:'bg_moonviewing', rarity:'rare', category:'fieldbg', type:'scene', event:'tsukimi2027', icon:'🌕', title:'十五夜のすすき野', desc:'場の背景：大きな満月と揺れるすすき（動く・お月見限定）', get value(){return sceneUri('moonviewing');}},
);
// rules に書けるルール：round（ラウンドの得点アップ。chance=確率 / every=Nラウンドごと、mult=倍率 / add=加点）、
//   ron（ロン上がりで加点）、tsumo（自分で上がると加点）、role（特定の役で加点）、first（最初のラウンドで加点）、streak（連勝で加点）
// lobby は、ロビーの季節背景（LOBBY_EVENTS）のid。開発者モードで背景を切り替えると、イベント戦もその季節になります
const _EV_R=(w3,gi,ti,th,bg)=>[{key:'r0',wins:3,petals:100},{key:'r1',wins:8,item:gi},{key:'r2',wins:15,item:ti},{key:'r5',wins:20,item:bg},{key:'r3',wins:25,item:th},{key:'r4',wins:40,petals:500}];
const EVENTS=[{
  id:'halloween2026', lobby:'halloween', title:'ハロウィンナイト', icon:'🎃', start:'2026-10-19', end:'2026-11-01',
  rules:{round:{chance:.34,mult:2,icon:'🍬',name:'お菓子ラウンド'},ron:{pts:2,icon:'👻',name:'ロンの祝福'}},
  ruleText:['🍬 お菓子ラウンド：ときどき（3回に1回ほど）、その回の得点が2倍になります','👻 ロンの祝福：ロンで上がると、役の得点に＋2点されます'],
  rewards:[{key:'r0',wins:3,petals:100},{key:'r1',wins:8,item:'gi_pumpkin'},{key:'r5',wins:12,item:'bg_pumpkinfield'},{key:'r2',wins:15,item:'title_ev_halloween2026'},{key:'r3',wins:25,item:'theme_pumpkin'},{key:'r6',wins:32,item:'bg_haunted'},{key:'r4',wins:40,petals:500}],
},{
  id:'christmas2026', lobby:'christmas', title:'クリスマスナイト', icon:'🎄', start:'2026-12-15', end:'2026-12-25',
  rules:{round:{chance:.3,add:3,icon:'🎁',name:'プレゼントラウンド'},tsumo:{pts:1,icon:'🎅',name:'サンタの贈り物'}},
  ruleText:['🎁 プレゼントラウンド：ときどき、その回に上がると＋3点されます','🎅 サンタの贈り物：自分の手番で上がる（ロンではない）と＋1点されます'],
  rewards:_EV_R(0,'gi_xmas','title_ev_christmas2026','theme_xmas','bg_xmasnight'),
},{
  id:'newyear2027', lobby:'newyear', title:'お正月福引まつり', icon:'🎍', start:'2026-12-29', end:'2027-01-07',
  rules:{round:{chance:.3,mult:2,icon:'🎊',name:'福引ラウンド'},first:{pts:3,icon:'🌅',name:'初日の出'}},
  ruleText:['🎊 福引ラウンド：ときどき、その回の得点が2倍になります','🌅 初日の出：ゲームの最初のラウンドで上がると＋3点されます'],
  rewards:_EV_R(0,'gi_kadomatsu','title_ev_newyear2027','theme_newyear','bg_newyearsun'),
},{
  id:'valentine2027', lobby:'valentine', title:'バレンタインデー', icon:'💝', start:'2027-02-07', end:'2027-02-14',
  rules:{round:{chance:.34,mult:2,icon:'🍫',name:'チョコレートラウンド'},role:{icon:'💞',name:'ペアの絆',map:{'三対':3}}},
  ruleText:['🍫 チョコレートラウンド：ときどき、その回の得点が2倍になります','💞 ペアの絆：役が「三対」で上がると＋3点されます'],
  rewards:_EV_R(0,'gi_choco','title_ev_valentine2027','theme_valentine','bg_heartnight'),
},{
  id:'sakura2027', lobby:'sakura', title:'お花見', icon:'🌸', start:'2027-03-20', end:'2027-04-10',
  rules:{round:{chance:.25,mult:2,icon:'🌷',name:'満開ラウンド'},streak:{max:3,icon:'🌸',name:'花吹雪'}},
  ruleText:['🌷 満開ラウンド：ときどき、その回の得点が2倍になります','🌸 花吹雪：同じ人が連続で上がるたびに＋1点（最大＋3点）されます'],
  rewards:_EV_R(0,'gi_hanafubuki','title_ev_sakura2027','theme_hanafubuki','bg_sakurastorm'),
},{
  id:'tanabata2027', lobby:'tanabata', title:'七夕まつり', icon:'🎋', start:'2027-07-01', end:'2027-07-07',
  rules:{round:{every:3,mult:2,icon:'⭐',name:'願いの星'},role:{icon:'🌌',name:'天の川',map:{'三連':2}}},
  ruleText:['⭐ 願いの星：3ラウンドごとに、その回の得点が2倍になります','🌌 天の川：役が「三連」で上がると＋2点されます'],
  rewards:_EV_R(0,'gi_tanzaku','title_ev_tanabata2027','theme_tanabata','bg_milkyway'),
},{
  id:'matsuri2027', lobby:'fireworks', title:'夏祭り', icon:'🎆', start:'2027-07-20', end:'2027-08-31',
  rules:{round:{chance:.4,mult:2,icon:'🎆',name:'花火ラウンド'},ron:{pts:3,icon:'🎯',name:'射的の大当たり'}},
  ruleText:['🎆 花火ラウンド：よく（2〜3回に1回）、その回の得点が2倍になります','🎯 射的の大当たり：ロンで上がると＋3点されます'],
  rewards:_EV_R(0,'gi_hanabi','title_ev_matsuri2027','theme_matsuri','bg_festival'),
},{
  id:'tsukimi2027', lobby:'tsukimi', title:'お月見', icon:'🌕', start:'2027-09-10', end:'2027-09-30',
  rules:{round:{chance:.3,mult:2,icon:'🌕',name:'満月ラウンド'},role:{icon:'🍡',name:'お月見団子',map:{'一色':2}}},
  ruleText:['🌕 満月ラウンド：ときどき、その回の得点が2倍になります','🍡 お月見団子：役が「一色」で上がると＋2点されます'],
  rewards:_EV_R(0,'gi_tsukimi','title_ev_tsukimi2027','theme_tsukimi','bg_moonviewing'),
}];
function activeEvent(){
  // 開発者モードでタイトル背景を選んでいるときは、その季節のイベント戦を遊べる（確認用。報酬は実際にこの端末へ入る）
  if(typeof isDevUser==='function'&&isDevUser()){const o=localStorage.getItem('rikka_dev_event');if(o!==null&&o!=='auto')return EVENTS.find(e=>e.lobby===o)||null;}
  const t=_loginToday();return EVENTS.find(e=>t>=e.start&&t<=e.end)||null;
}
function loadEventState(id){try{const s=JSON.parse(localStorage.getItem('rikka_event_'+id)||'{}');return{wins:s.wins||0,claimed:s.claimed||[]};}catch(e){return{wins:0,claimed:[]};}}
function saveEventState(id,s){try{localStorage.setItem('rikka_event_'+id,JSON.stringify(s));}catch(e){}}
function eventRewardText(r){return r.petals?`🌸 花びら ${r.petals}枚`:(()=>{const it=GACHA_ITEMS.find(x=>x.id===r.item);return it?`${it.icon} ${it.title}`:'';})();}
function updateEventBtn(){
  const b=document.getElementById('event-lobby-btn');if(!b)return;
  const ev=activeEvent();
  if(!ev){b.style.display='none';return;}
  const left=Math.max(0,Math.round((new Date(ev.end+'T23:59:59')-new Date())/86400000));
  b.style.display='flex';b.innerHTML=`${ev.icon} ${esc(ev.title)}<small style="font-weight:600;opacity:.8">あと${left+1}日</small>`;
}
function openEventPanel(){
  const ev=activeEvent();if(!ev){updateEventBtn();return;}
  const st=loadEventState(ev.id),max=ev.rewards[ev.rewards.length-1].wins;
  const rw=ev.rewards.map(r=>{const got=st.wins>=r.wins;return `<div class="ev-rw${got?' got':''}"><b>${r.wins}勝</b><span style="flex:1">${eventRewardText(r)}</span>${got?'✔':''}</div>`;}).join('');
  showModal(`<div class="ev-box"><div class="mtitle">${ev.icon} ${esc(ev.title)}</div>
    <div style="font-size:.78rem;color:#c9a870;margin-bottom:.5rem">開催期間：${ev.start.slice(5).replace('-','/')} 〜 ${ev.end.slice(5).replace('-','/')}（この期間だけ遊べます）</div>
    <div style="font-size:.8rem;color:#ffa040;margin-top:.4rem">イベントだけのルール</div>${ev.ruleText.map(t=>`<div class="ev-rule">${t}</div>`).join('')}
    <div style="font-size:.8rem;color:#ffa040;margin-top:.6rem">イベント報酬（イベント戦で勝った回数）</div>
    <div style="font-size:.78rem;color:#c9a870">いまの勝利数：${st.wins}勝</div><div class="ev-bar"><i style="width:${Math.min(100,st.wins/max*100)}%"></i></div>${rw}
    <div style="margin:.7rem 0 .4rem;font-size:.82rem;color:#c9a870">相手（CPU）：1体・強さは「普通」固定</div>
    <button class="mbtn" onclick="startEventGame()">${ev.icon} イベント戦をはじめる</button>
    <button class="mbtn" style="background:#2a1e14;color:#c9a84c;border:1px solid #5a4020;margin-top:.4rem" onclick="document.getElementById('modal').classList.remove('open')">閉じる</button></div>`);
}
function startEventGame(){
  const ev=activeEvent();if(!ev)return;
  const diff='normal'; // イベント戦は常に「普通」
  document.getElementById('modal').classList.remove('open');
  const c=document.getElementById('bcnt'),d=document.getElementById('bdiff'),oc=c.value,od=d.value;
  c.value='1';d.value=diff;startGame();c.value=oc;d.value=od;
  G.event={id:ev.id,special:false,round:0,streak:0,lastWinner:-1};eventNewRound();
}
function eventNewRound(){
  if(!G||!G.event)return;
  const ev=EVENTS.find(e=>e.id===G.event.id);if(!ev)return;
  const rd=ev.rules.round;
  G.event.round=(G.event.round||0)+1;
  G.event.special=!!rd&&(rd.every?G.event.round%rd.every===0:Math.random()<rd.chance);
  updateEventBadge();
  if(G.event.special)setTimeout(()=>toast(`${rd.icon} ${rd.name}！${rd.mult?'この回の得点は'+rd.mult+'倍':'この回は＋'+rd.add+'点'}`),2200);
}
function updateEventBadge(){
  const el=document.getElementById('event-badge');if(!el)return;
  const g=document.getElementById('game');
  if(G&&G.event&&g&&g.classList.contains('active')){const ev=EVENTS.find(e=>e.id===G.event.id),rd=ev&&ev.rules.round;el.style.display='block';el.textContent=`${ev?ev.icon:''} ${ev?ev.title:''}${G.event.special&&rd?'　'+rd.icon+' '+(rd.mult?'得点×'+rd.mult:'＋'+rd.add+'点'):''}`;}
  else el.style.display='none';
}
// 上がったときの、イベント独自ルール（得点の補正）
function eventModify(pi,res){
  if(!G||!G.event)return;
  const ev=EVENTS.find(e=>e.id===G.event.id);if(!ev)return;
  const R=ev.rules,notes=[],add=(r,n)=>{if(n>0){res.pts+=n;notes.push(`${r.icon} ${r.name} +${n}点`);}};
  if(res.ron&&R.ron)add(R.ron,R.ron.pts);
  if(!res.ron&&R.tsumo)add(R.tsumo,R.tsumo.pts);
  if(R.role)add(R.role,R.role.map[res.role]||0);
  if(R.first&&G.event.round===1)add(R.first,R.first.pts);
  if(R.streak){G.event.streak=(G.event.lastWinner===pi)?(G.event.streak||1)+1:1;G.event.lastWinner=pi;add(R.streak,Math.min(R.streak.max,G.event.streak-1));}
  const rd=R.round;
  if(rd&&G.event.special){
    if(rd.mult){res.pts*=rd.mult;notes.push(`${rd.icon} ${rd.name} 得点×${rd.mult}`);}
    if(rd.add){res.pts+=rd.add;notes.push(`${rd.icon} ${rd.name} +${rd.add}点`);}
  }
  res.evNotes=notes;
}
// 自分が上がったときの、イベントの勝利数と報酬
function eventOnWin(){
  const ev=activeEvent();if(!ev||!G||!G.event||G.event.id!==ev.id)return [];
  const st=loadEventState(ev.id),out=[];
  st.wins++;
  ev.rewards.forEach((r,i)=>{
    const key=r.key||('r'+i);if(st.wins<r.wins||st.claimed.includes(key))return;
    st.claimed.push(key);
    if(r.petals)addPetals(r.petals);else grantItem(r.item);
    out.push(eventRewardText(r));
  });
  saveEventState(ev.id,st);
  return out;
}
window.addEventListener('load',()=>{updateEventBtn();setInterval(()=>{updateEventBtn();updateEventBadge();},1500);});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateEventBtn();});
// ガチャ・図鑑・結果画面に出す景品アイコン（アイコン景品は動く画像）
function itemIconHtml(it){
  return it.category==='gicon'?`<img src="${giconUri(it.value)}" alt="" style="width:1.2em;height:1.2em;border-radius:50%;vertical-align:middle">`:it.icon;
}

// ===== 期間限定ガチャ（開催期間は start〜end の日付で変更できます）=====

/* ===== 期間限定ガチャ「紅葉から初雪へ」(2026/11/03〜11/16) ===== */
const _MP='M0-9L2.4-3.5 8-6.5 5.5-1 10 .5 4.5 3 6 9 0 5.5-6 9-4.5 3-10 .5-5.5-1-8-6.5-2.4-3.5z';
const _mpl=(x,y,sc,a,c)=>`<path d="${_MP}" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${a.toFixed(0)}) scale(${sc.toFixed(2)})" fill="${c}"/>`;
const _MV='M0 9V-6M0 2l-5-3M0 2l5-3',_GV='M0 0V-12M0 0L-4-11M0 0L4-11',_GP='M0 0L-7-10Q0-14 7-10z';
const _lg=(i,a,b)=>`<linearGradient id="${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const _SDEF=`<filter id="bl1"><feGaussianBlur stdDeviation="1.6"/></filter><filter id="bl3"><feGaussianBlur stdDeviation="4"/></filter><filter id="mist" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".006 .018" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 .93 0 0 0 0 .82 0 0 0 1.3 -.5"/></filter><linearGradient id="mg2" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="#000"/><stop offset=".58" stop-color="#fff"/><stop offset=".78" stop-color="#000"/></linearGradient><mask id="mm"><rect width="400" height="800" fill="url(#mg2)"/></mask><radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a0805" stop-opacity=".55"/></radialGradient><linearGradient id="bk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1c0e08"/><stop offset=".45" stop-color="#5a3a24"/><stop offset=".7" stop-color="#3a2214"/><stop offset="1" stop-color="#120804"/></linearGradient>${_lg('mA','#ff6a3a','#b8240f')}${_lg('mB','#ffb040','#e06a14')}${_lg('mC','#d83a22','#7a1410')}${_lg('mD','#ffd860','#e8901c')}${_lg('gA','#fff08a','#e8a818')}${_lg('gB','#ffd84a','#d89010')}${_lg('gC','#ffe870','#f0b020')}`;
const _dots=(r,n,x0,x1,y0,y1,a,b,cols,op)=>{let o='';for(let i=0;i<n;i++)o+=`<circle cx="${(x0+r()*(x1-x0)).toFixed(0)}" cy="${(y0+r()*(y1-y0)).toFixed(0)}" r="${(a+r()*(b-a)).toFixed(1)}" fill="${cols[(r()*cols.length)|0]}" opacity="${(op*(.6+r()*.4)).toFixed(2)}"/>`;return o;};
const _lvs=(r,n,y0,y1,gs,a,b,op,f,d,v)=>{let o='';for(let i=0;i<n;i++)o+=`<g transform="translate(${(r()*400).toFixed(0)} ${(y0+r()*(y1-y0)).toFixed(0)}) rotate(${(r()*360).toFixed(0)}) scale(${(a+r()*(b-a)).toFixed(2)})" opacity="${op}"${f?` filter="url(#${f})"`:''}><path d="${d}" fill="url(#${gs[(r()*gs.length)|0]})"/><path d="${v}" stroke="rgba(70,15,8,.45)" stroke-width=".5" fill="none"/></g>`;return o;};
const _MC=['#e8452a','#f08a2a','#c8301c','#f5b030'];
LOBBY_SCENES.momijiyama=function(){const r=_rng(301);let rg='';
  [[455,60,'#e8a070','#f0b080',.5],[520,52,'#c8603a','#e07a40',.65],[600,44,'#9a2e22','#c8501e',.85],[690,34,'#5a1618','#8a2a14',1]].forEach(([b,am,c1,c2,op],i)=>{const d=_ridge(r,{base:b,amp:am,rough:.6}).fill;
    rg+=`<clipPath id="rc${i}"><path d="${d}"/></clipPath><path d="${d}" fill="${c1}" opacity="${op}"/><g clip-path="url(#rc${i})" opacity="${op}">${_dots(r,130,0,400,b-am-10,b+90,3,8,[c1,c2,'#f5b030','#7a1a14'],.7)}</g>`;
    if(i===1)rg+='<rect width="400" height="800" filter="url(#mist)" mask="url(#mm)" opacity=".55"/>';});
  return `<defs>${_SDEF}${_vgrad('sk',[[0,'#4a3452'],[.35,'#e0805a'],[.65,'#ffd08a']])}${_glow('sg','#fff0c0','#ffb060')}<linearGradient id="ry" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c0" stop-opacity=".35"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></linearGradient></defs><rect width="400" height="800" fill="url(#sk)"/><circle cx="270" cy="400" r="210" fill="url(#sg)"/><path d="M230 0L300 0L420 700L150 700z" fill="url(#ry)"/>${rg}<path d="M-200 740Q200 715 600 745V900H-200z" fill="#3a0e10"/>${_lvs(r,70,735,800,['mA','mB','mC','mD'],.5,1.3,.95,'',_MP,_MV)}<path d="M-10 800L-6 380Q10 200 30 0L74 0Q54 220 66 400L74 800z" fill="url(#bk)"/><path d="M330 800L336 400Q330 200 350 0L420 0V800z" fill="url(#bk)"/><g filter="url(#bl1)">${_dots(r,90,-30,150,-10,190,6,18,_MC,.95)}${_dots(r,90,260,430,-10,190,6,18,_MC,.95)}</g>${_lvs(r,12,0,800,['mA','mB'],2.2,3.4,.85,'bl3',_MP,_MV)}${_lvs(r,40,0,780,['mA','mB','mC','mD'],.6,1.4,.9,'',_MP,_MV)}<rect width="400" height="800" fill="url(#vg)"/>`;};
LOBBY_SCENES.ginkgo=function(){const r=_rng(311);let tr='';
  for(let i=0;i<6;i++){const t=i/5,by=440+Math.pow(t,1.6)*380,w=3+t*34,dx=26+t*200;
    [-1,1].forEach(sd=>{const x=200+sd*dx;tr+=`<path d="M${(x-w/2).toFixed(0)} ${by.toFixed(0)}L${(x-w*.35).toFixed(0)} -20H${(x+w*.35).toFixed(0)}L${(x+w/2).toFixed(0)} ${by.toFixed(0)}z" fill="url(#bk)" opacity="${(.45+t*.55).toFixed(2)}"/>`
      +_dots(r,26+i*16,x-60-t*70,x+60+t*70,-20,150+(1-t)*230,5+t*8,9+t*16,['#f5c430','#ffd95a','#e8a818','#fff0a0','#ffdc70'],.55+t*.4);});}
  return `<defs>${_SDEF}${_vgrad('sk',[[0,'#fff4c0'],[.55,'#f6d878'],[1,'#e8b840']])}${_glow('vg2','#fff8d0','#ffd870')}${_vgrad('gd',[[0,'#f6d880'],[1,'#c08410']])}<linearGradient id="ry" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe0" stop-opacity=".4"/><stop offset="1" stop-color="#fffbe0" stop-opacity="0"/></linearGradient></defs><rect width="400" height="800" fill="url(#sk)"/><circle cx="200" cy="430" r="200" fill="url(#vg2)"/><rect y="440" width="400" height="360" fill="url(#gd)"/>${tr}<path d="M150 -10L250 -10L330 800L70 800z" fill="url(#ry)"/><path d="M185 -10L215 -10L270 700L130 700z" fill="url(#ry)"/><rect width="400" height="800" filter="url(#mist)" mask="url(#mm)" opacity=".5"/>${_lvs(r,200,445,800,['gA','gB','gC'],.4,1.6,.9,'',_GP,_GV)}${_lvs(r,10,0,800,['gA','gC'],2.4,3.6,.8,'bl3',_GP,_GV)}${_lvs(r,36,0,780,['gA','gB','gC'],.8,1.6,.9,'',_GP,_GV)}<rect width="400" height="800" fill="url(#vg)"/>`;};
const _UA=['#c8301c','#e8452a','#f08a2a','#d8501e','#a82418'],_UB=['#f0a028','#f5b030','#e88a20','#f2c040','#d8781a'],_UW=['#ffffff','#eef5fc','#dde9f5','#f6faff','#e8f0f8'];
const _utsCan=()=>{const r=_rng(321),o=[];[[48,360],[200,330],[340,390]].forEach(([cx,cy])=>{for(let i=0;i<84;i++){const a=r()*6.283,d=Math.sqrt(r());o.push([cx+Math.cos(a)*d*95,cy+Math.sin(a)*d*80-10,7+r()*10,(r()*5)|0]);}});return o;};
const _lc=(a,b,t)=>{const q=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),x=q(a),y=q(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*t).toString(16).padStart(2,'0')).join('');};
LOBBY_SCENES.utsuroi=function(){const r=_rng(322);let cn='';
  _utsCan().forEach(([x,y,rr,pi])=>cn+=`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${rr.toFixed(1)}" fill="${_UA[pi]}" opacity=".92"/>`);
  const tk=[[48,330,20],[200,300,26],[340,350,20]].map(([x,t,w])=>`<path d="M${x-w} 770L${x-w*.45} ${t}H${x+w*.45}L${x+w} 770z" fill="url(#bk)"/><path d="M${x} ${t+30}L${x-60} ${t-40}M${x} ${t+30}L${x+60} ${t-50}M${x} ${t+60}L${x-45} ${t+10}M${x} ${t+60}L${x+50} ${t+5}" stroke="#2a1410" stroke-width="5" stroke-linecap="round" fill="none"/>`).join('');
  return `<defs>${_SDEF}${_vgrad('sk',[[0,'#3a2a4a'],[.4,'#d86a4a'],[.7,'#ffc47a']])}${_glow('sg','#fff0c0','#ffb060')}${_vgrad('gd',[[0,'#6a2a1a'],[1,'#2a0e0a']])}</defs><rect width="400" height="800" fill="url(#sk)"/><circle cx="200" cy="520" r="230" fill="url(#sg)"/><path d="${_ridge(r,{base:560,amp:50,rough:.5}).fill}" fill="#8a4a52" opacity=".6"/><path d="${_ridge(r,{base:620,amp:36,rough:.5}).fill}" fill="#5a2a3a" opacity=".8"/><rect width="400" height="800" filter="url(#mist)" mask="url(#mm)" opacity=".5"/>${tk}${cn}<path d="M-200 735Q200 715 600 735V900H-200z" fill="url(#gd)"/>${_lvs(r,90,732,800,['mA','mB','mC','mD'],.4,1.1,.9,'',_MP,_MV)}<rect width="400" height="800" fill="url(#vg)"/>`;};
// ---- 場の動き（ゲーム中の背景。既存の背景と同じ仕組み） ----
// 端末が重いときは落ち葉の数を自動で減らし、余裕があれば元に戻す
const _AQ={q:1,last:0,ema:16,slow:0,fast:0,hold:0,
  tick(now){const d=now-this.last;this.last=now;if(d<=0||d>200)return this.q;
    this.ema+=(d-this.ema)*.05;if(this.hold>0)this.hold--;
    if(this.ema>26){this.slow++;this.fast=0;}else if(this.ema<19){this.fast++;this.slow=0;}else{this.slow=0;this.fast=0;}
    if(this.slow>45&&this.q>.4){this.q=Math.max(.4,this.q-.15);this.slow=0;this.hold=1800;}
    else if(this.fast>300&&this.hold<=0&&this.q<1){this.q=Math.min(1,this.q+.15);this.fast=0;}
    return this.q;}};
FIELD_ANIMS.momijiyama=function(){
  const mp=new Path2D(_MP),vp=new Path2D(_MV),gl=glowSprite('255,200,120');
  const P=Array.from({length:56},()=>({x:_R(-60,420),y:_R(0,820),vx:_R(.3,1.1),vy:_R(.5,1.3),r:_R(0,6.28),vr:_R(-.05,.05),s:_R(.5,1.3),ph:_R(0,6.28),c:_MC[Math.floor(_R(0,4))]}));
  return (c,dt,now,S)=>{
    const wd=1+.6*Math.sin(now*.0004)+.4*Math.sin(now*.0011+1); // 風のむら
    c.globalCompositeOperation='lighter';c.globalAlpha=.14+.07*Math.sin(now*.0008);c.drawImage(gl,70,160,400,400);c.globalCompositeOperation='source-over';
    const q=_AQ.tick(now),n=Math.ceil(P.length*q);for(let i=0;i<n;i++){const p=P[i];p.x+=(p.vx*wd+Math.sin(now*.0015+p.ph)*.5)*dt;p.y+=p.vy*dt;p.r+=p.vr*dt*wd;
      if(p.y>S.y1+20||p.x>S.x1+30){p.y=_R(S.y0-40,S.y0);p.x=_R(S.x0-60,S.x1);}
      c.save();c.translate(p.x,p.y);c.rotate(p.r);c.scale(p.s,p.s*Math.cos(now*.002+p.ph));c.globalAlpha=.92;c.fillStyle=p.c;c.fill(mp);if(q>.7){c.strokeStyle='rgba(70,15,8,.45)';c.lineWidth=.5;c.stroke(vp);}c.restore();}
    c.globalAlpha=1;};
};
FIELD_ANIMS.ginkgo=function(){
  const fan=new Path2D(_GP),vp=new Path2D(_GV),cs=['#f5c430','#ffd95a','#e8a818','#fff0a0'];
  const P=Array.from({length:64},()=>({x:_R(-20,420),y:_R(0,820),vy:_R(.35,.9),ph:_R(0,6.28),sw:_R(.001,.002),s:_R(1,2),c:cs[Math.floor(_R(0,4))],r:_R(0,6.28)}));
  return (c,dt,now,S)=>{
    c.globalCompositeOperation='lighter';
    for(const bx of [120,250]){c.globalAlpha=.05+.03*Math.sin(now*.0007+bx);c.fillStyle='#fff3b0';c.beginPath();c.moveTo(bx,S.y0);c.lineTo(bx+60,S.y0);c.lineTo(bx+170,S.y1);c.lineTo(bx+40,S.y1);c.closePath();c.fill();}
    c.globalCompositeOperation='source-over';
    const wd=1+.5*Math.sin(now*.0005);
    const q=_AQ.tick(now),n=Math.ceil(P.length*q);for(let i=0;i<n;i++){const p=P[i];p.y+=p.vy*dt;const sw=Math.sin(p.ph+now*p.sw);
      if(p.y>S.y1+20){p.y=_R(S.y0-40,S.y0);p.x=_R(S.x0,S.x1);}
      c.save();c.translate(p.x+sw*22*wd,p.y);c.rotate(p.r+sw*.8);c.scale(p.s,p.s*(.55+.45*Math.abs(Math.cos(p.ph+now*.003))));c.globalAlpha=.95;c.fillStyle=p.c;c.fill(fan);if(q>.7){c.strokeStyle='rgba(120,80,0,.4)';c.lineWidth=.5;c.stroke(vp);}c.restore();}
    c.globalAlpha=1;};
};
FIELD_ANIMS.utsuroi=function(){
  const mp=new Path2D(_MP),vp=new Path2D(_MV),can=_utsCan(),gnd=new Path2D('M-200 735Q200 715 600 735V900H-200z');
  const sm=(a,b,t)=>{const x=Math.min(1,Math.max(0,(t-a)/(b-a)));return x*x*(3-2*x);}; // なめらかに0→1
  const amt=(i0,i1,o0,o1,t)=>sm(i0,i1,t)*(1-sm(o0,o1,t));
  const P=Array.from({length:50},()=>({x:_R(-20,420),y:_R(0,820),vy:_R(.5,1.2),ph:_R(0,6.28),s:_R(.6,1.4),r:_R(0,6.28),vr:_R(-.04,.04),c:_MC[Math.floor(_R(0,4))],th:_R(0,1)}));
  // 木の葉は最初に1回だけ「紅葉・橙・雪」の3枚の絵に描いておき、毎フレームは重ねるだけにする
  const mk=pal=>{const cv=document.createElement('canvas');cv.width=1060;cv.height=530;const g=cv.getContext('2d');g.setTransform(2,0,0,2,140,-430);for(const b of can){g.fillStyle=pal[b[3]];g.beginPath();g.arc(b[0],b[1],b[2],0,6.283);g.fill();}return cv;};
  const LA=mk(_UA),LB=mk(_UB),LW=mk(_UW);
  return (c,dt,now,S)=>{
    // 36秒で「紅葉 → 初雪 → 紅葉」。空・木・地面・落ち葉がそれぞれ少しずつずれて、なめらかに変わる
    const t=(now%36000)/36000,k=sm(0,.3,t)*(1-sm(.8,1,t));
    const ws=amt(.30,.55,.88,1,t),wc=amt(.36,.62,.84,.96,t),wg=amt(.42,.70,.80,.90,t),wd=1+.5*Math.sin(now*.0005);
    if(ws>.001){const g=c.createLinearGradient(0,S.y0,0,S.y1);g.addColorStop(0,'#1a2a48');g.addColorStop(1,'#8aa8c8');c.globalAlpha=.5*ws;c.fillStyle=g;c.fillRect(S.x0,S.y0,S.x1-S.x0,S.y1-S.y0);}
    c.globalAlpha=.95;c.drawImage(LA,-70,215,530,265);
    if(k>.003){c.globalAlpha=.95*k;c.drawImage(LB,-70,215,530,265);}
    if(wc>.003){c.globalAlpha=.95*wc;c.drawImage(LW,-70,215,530,265);}
    if(wg>.001){c.globalAlpha=.9*wg;c.fillStyle='#eef4fa';c.fill(gnd);}
    const q=_AQ.tick(now),n=Math.ceil(P.length*q);for(let i=0;i<n;i++){const p=P[i];p.y+=p.vy*dt;p.r+=p.vr*dt;
      if(p.y>S.y1+20){p.y=_R(S.y0-40,S.y0);p.x=_R(S.x0,S.x1);}
      const x=p.x+Math.sin(p.ph+now*.0015)*20*wd,
        wp=amt(.36+.22*p.th,.46+.22*p.th,.80+.12*(1-p.th),.88+.12*(1-p.th),t); // 落ち葉は1枚ずつ順に雪へ
      if(wp<.98){c.save();c.translate(x,p.y);c.rotate(p.r);c.scale(p.s,p.s);c.globalAlpha=.92*(1-wp);c.fillStyle=p.c;c.fill(mp);if(q>.7){c.strokeStyle='rgba(70,15,8,.45)';c.lineWidth=.5;c.stroke(vp);}c.restore();}
      if(wp>.02){c.globalAlpha=.9*wp;c.fillStyle='#fff';c.beginPath();c.arc(x,p.y,1.4+p.s*1.2,0,6.283);c.fill();}}
    c.globalAlpha=1;};
};
GICON_SVG.gi_leaves=function(){let f='';
  [[16,1.1,3.4,0,'#e8452a'],[38,1.5,4.2,1.2,'#f5a030'],[60,1.2,3.8,2.1,'#c8301c'],[82,1.4,4.6,.6,'#f5c430'],[28,.9,5,2.8,'#f08a2a'],[70,1,3.6,1.7,'#e8452a']].forEach(([x,sc,d,dl,c])=>f+=`<g transform="translate(${x} 0) scale(${sc})"><path class="o" d="${_MP}" fill="${c}" style="animation:lf ${d}s linear ${dl}s infinite"/></g>`);
  return _giSvg(_giLG('#ffe0b0','#d8683a'),`<style>@keyframes lf{0%{transform:translate(0,-10px) rotate(0)}100%{transform:translate(-14px,120px) rotate(300deg)}}</style><path d="M0 86Q50 74 100 86V100H0z" fill="#a8402a"/>${f}`);};
GICON_SVG.gi_bonfire=function(){let sp='';
  [[40,62,0],[58,64,.6],[50,58,1.2],[46,66,1.7]].forEach(([x,y,d])=>sp+=`<circle cx="${x}" cy="${y}" r="1.6" fill="#ffd060" style="animation:rise 2s ease-out ${d}s infinite"/>`);
  return _giSvg(_giRG('#3a1a10','#0a0402'),`<g class="b" style="animation:flick .9s ease-in-out infinite"><path d="M50 26C58 40 68 46 66 62C65 72 56 78 50 78C44 78 35 72 34 62C33 52 42 48 45 38C47 33 49 30 50 26Z" fill="#ff7a1a"/><path d="M50 48C55 56 59 60 58 67C57 72 53 75 50 75C47 75 43 72 42 67C41 61 47 57 50 48Z" fill="#ffe070"/></g>${sp}<rect x="24" y="76" width="52" height="8" rx="4" fill="#5a3418" transform="rotate(-12 50 80)"/><rect x="24" y="76" width="52" height="8" rx="4" fill="#7a4a20" transform="rotate(12 50 80)"/><path d="M0 92h100V100H0z" fill="#1a0a06"/><path d="M20 90l8-4 6 3z" fill="#e8452a"/>`);};
GICON_SVG.gi_firstsnow=function(){let a='',s='';
  for(let i=0;i<6;i++)a+=`<path d="M50 50V18M50 32l-7-7M50 32l7-7M50 41l-5-5M50 41l5-5" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" transform="rotate(${i*60} 50 50)"/>`;
  [[14,3,0],[32,4.4,1],[70,3.6,.5],[88,4,1.8],[52,5,2.4]].forEach(([x,d,dl])=>s+=`<circle cx="${x}" cy="0" r="2" fill="#fff" style="animation:sn ${d}s linear ${dl}s infinite"/>`);
  return _giSvg(_giLG('#3a5a88','#12203a'),`<style>@keyframes sn{from{transform:translateY(-4px)}to{transform:translateY(106px)}}</style><g class="o" style="animation:spin 24s linear infinite">${a}</g><circle cx="50" cy="50" r="5" fill="#cfe8ff"/>${s}<path d="M0 90Q50 80 100 90V100H0z" fill="#e8f2fa"/><path d="M62 88l8-3 3 5z" fill="#e8452a"/>`);};
GICON_SVG.gi_nishiki=function(){let a='';
  ['#e8452a','#f5a030','#f5c430','#c8301c','#f08a2a','#ff6a3a'].forEach((c,i)=>a+=`<path d="${_MP}" fill="${c}" transform="rotate(${i*60} 50 50) translate(50 26) scale(1.35)"/>`);
  return _giSvg(_giRG('#5a1410','#120406'),`<circle cx="50" cy="50" r="30" fill="#ff8a40" opacity=".22" class="o" style="animation:pulse 2.4s ease-in-out infinite"/><g class="o" style="animation:spin 22s linear infinite">${a}</g><circle cx="50" cy="50" r="6" fill="#fff4e0"/><circle cx="18" cy="20" r="1.2" fill="#fff"/><circle cx="84" cy="78" r="1.2" fill="#fff"/>`);};
GACHA_ITEMS.push(
 {id:'theme_momiji',rarity:'common',category:'theme',limited:'autumn2026',icon:'🍁',title:'紅葉の裏地',desc:'牌の裏デザイン：赤く染まったもみじ',value:'momiji'},
 {id:'theme_ginkgo',rarity:'common',category:'theme',limited:'autumn2026',icon:'🍂',title:'銀杏の裏地',desc:'牌の裏デザイン：黄金色の銀杏',value:'ginkgo'},
 {id:'confetti_momiji',rarity:'common',category:'confetti',limited:'autumn2026',icon:'🍁',title:'紅葉の紙吹雪',desc:'紙吹雪が落ち葉の色に',value:['#e8452a','#f08a2a','#f5c430','#a82418','#8a5a2b']},
 {id:'gi_leaves',rarity:'common',category:'gicon',limited:'autumn2026',icon:'🍁',title:'舞い散る落ち葉',desc:'アイコン：舞い落ちるもみじ（動く・期間限定）',value:'gi_leaves'},
 {id:'theme_shigure',rarity:'uncommon',category:'theme',limited:'autumn2026',icon:'💧',title:'時雨の裏地',desc:'牌の裏デザイン：降りしきる時雨',value:'shigure'},
 {id:'gi_bonfire',rarity:'uncommon',category:'gicon',limited:'autumn2026',icon:'🔥',title:'落ち葉焚き',desc:'アイコン：揺れる焚き火（動く・期間限定）',value:'gi_bonfire'},
 {id:'title_momijigari',rarity:'uncommon',category:'title',limited:'autumn2026',icon:'🍁',title:'紅葉狩り',desc:'名前の横に称号が付きます',value:'紅葉狩り'},
 {id:'title_haregi',rarity:'uncommon',category:'title',limited:'autumn2026',icon:'🎉',title:'晴れ着の打ち手',desc:'名前の横に称号が付きます',value:'晴れ着の打ち手'},
 {id:'bg_momijiyama',rarity:'rare',category:'fieldbg',type:'scene',limited:'autumn2026',icon:'🍁',title:'紅葉の山路',desc:'場の背景：赤く染まる山と舞う落ち葉',get value(){return sceneUri('momijiyama');}},
 {id:'bg_ginkgo',rarity:'rare',category:'fieldbg',type:'scene',limited:'autumn2026',icon:'🍂',title:'銀杏並木',desc:'場の背景：黄金の並木道',get value(){return sceneUri('ginkgo');}},
 {id:'theme_hatsuyuki',rarity:'rare',category:'theme',limited:'autumn2026',icon:'❄️',title:'初雪の裏地',desc:'牌の裏デザイン：降り始めの雪',value:'hatsuyuki'},
 {id:'gi_firstsnow',rarity:'rare',category:'gicon',limited:'autumn2026',icon:'❄️',title:'初雪の結晶',desc:'アイコン：回る結晶と最初の雪（動く・期間限定）',value:'gi_firstsnow'},
 {id:'bg_utsuroi',rarity:'superrare',category:'fieldbg',type:'scene',limited:'autumn2026',icon:'🍂',title:'移ろう季節',desc:'場の背景：紅葉が散り、雪に変わっていく（動く）',get value(){return sceneUri('utsuroi');}},
 {id:'gi_nishiki',rarity:'superrare',category:'gicon',limited:'autumn2026',icon:'🍁',title:'錦の六華',desc:'アイコン：もみじの腕を持つ雪の結晶（動く・期間限定）',value:'gi_nishiki'},
 {id:'title_kinshu',rarity:'superrare',category:'title',limited:'autumn2026',icon:'👑',title:'錦秋の覇者',desc:'名前の横に称号が付きます',value:'錦秋の覇者'}
);

// 期間限定ガチャの一覧。日付に合わせて、開催中のものに自動で切り替わります
const LIMITED_LIST=[
  {id:1, name:'ハロウィン', title:'期間限定ガチャ', start:'2026-10-19', end:'2026-11-02', // ハロウィン（景品の limited:1 が対象）
   existing:['theme_ice','theme_ember','theme_obsidian','theme_galaxy','bg_aurora','bg_nebula'],
   top:['bg_gameovera3','bg_gameovera4'], topText:'最高レア：Game Over Ⅲ・Ⅳ（場の背景）'},
  {id:'autumn2026', name:'紅葉から初雪へ', title:'期間限定ガチャ', start:'2026-11-03', end:'2026-11-16', // 紅葉から初雪へ
   existing:['theme_ice','bg_aurora'],
   top:['bg_utsuroi','gi_nishiki'], topText:'最高レア：移ろう季節（場の背景）・錦の六華（アイコン）'},
  {id:1, name:'ハロウィン リブート', title:'期間限定ガチャ', start:'2026-11-17', end:'2026-11-30', // 10/19〜11/2のハロウィンガチャの復刻（景品の limited:1 が対象）
   existing:['theme_ice','theme_ember','theme_obsidian','theme_galaxy','bg_aurora','bg_nebula'],
   top:['bg_gameovera3','bg_gameovera4'], topText:'最高レア：Game Over Ⅲ・Ⅳ（場の背景）'}
];
// 開催中 → なければ次に始まるもの → なければ最後のもの、の順で選ぶ
const _ldDevPick=()=>{try{if(typeof isDevUser==='function'&&isDevUser()){const o=localStorage.getItem('rikka_dev_gacha');return LIMITED_LIST.find(x=>String(x.id)===o)||null;}}catch(e){}return null;};
const LIMITED_GACHA=new Proxy({},{get(_,k){const t=_loginToday();
  const g=_ldDevPick()||LIMITED_LIST.find(x=>t>=x.start&&t<=x.end)||LIMITED_LIST.find(x=>t<x.start)||LIMITED_LIST[LIMITED_LIST.length-1];return g[k];}});
const _GO_BASE='https://carupisu0320.github.io/rikka-game-Smartphone/';
GACHA_ITEMS.push(
  {id:'theme_warning', rarity:'common',   category:'theme', limited:1, icon:'⚠️', title:'警告の裏地',     desc:'牌の裏デザイン：警告', value:'warning'},
  {id:'theme_glitch',  rarity:'uncommon', category:'theme', limited:1, icon:'📺', title:'ノイズの裏地',   desc:'牌の裏デザイン：ノイズ', value:'glitch'},
  {id:'theme_neongrid',rarity:'uncommon', category:'theme', limited:1, icon:'🟣', title:'ネオングリッドの裏地', desc:'牌の裏デザイン：ネオングリッド', value:'neongrid'},
  {id:'theme_crimson', rarity:'rare',     category:'theme', limited:1, icon:'🩸', title:'深紅の裏地',     desc:'牌の裏デザイン：深紅', value:'crimson'},
  {id:'bg_lanterns',   rarity:'rare',     category:'fieldbg', type:'scene', limited:1, icon:'🏮', title:'灯籠の夜', desc:'場の背景：夜空に浮かぶ灯籠', get value(){return sceneUri('lanterns');}},
  {id:'bg_redmoon',    rarity:'rare',     category:'fieldbg', type:'scene', limited:1, icon:'🌑', title:'赤い月の森', desc:'場の背景：赤い月と黒い森', get value(){return sceneUri('redmoon');}},
  {id:'title_gameovera', rarity:'rare',   category:'title', limited:1, icon:'🎮', title:'国富平針店のバイト', desc:'名前の横に称号が付きます', value:'国富平針店のバイト'},
  {id:'bg_gameovera3', rarity:'superrare', category:'fieldbg', type:'image', limited:1, icon:'💀', title:'Game Over III', desc:'場の背景：Game Overシリーズ（期間限定）', value:_GO_BASE+'gameovera3.png'},
  {id:'bg_gameovera4', rarity:'superrare', category:'fieldbg', type:'image', limited:1, icon:'💀', title:'Game Over IV',  desc:'場の背景：Game Overシリーズ（期間限定）', value:_GO_BASE+'gameovera4.png'},
);
// 期間限定ガチャの景品アイコン（動くプレビュー）
function ltdIcon(it,has,big){
  let inner;
  if(it.category==='theme'){
    if(['warning','glitch','neongrid','crimson'].includes(it.value))inner=`<div class="ltd-tile pv-${it.value}"><div class="ltd-fb"></div></div>`;
    else{const sw=GACHA_THEME_SWATCH[it.value]||['#2a1e12','#5a4028'];inner=`<div class="ltd-tile"><div class="ltd-sw" style="--a:${sw[0]};--b:${sw[1]}"></div></div>`;}
  }else if(it.category==='fieldbg'){
    inner=`<div class="ltd-bg ltd-bg-${it.id}" style="background-image:url('${esc(it.value)}')"></div>`;
  }else if(it.category==='gicon'){
    inner=`<img src="${giconUri(it.value)}" alt="" style="width:100%;height:100%;border-radius:50%;display:block">`;
  }else inner=`<div class="ltd-ttl">${it.icon}</div>`;
  return `<div class="ltd-ico${big?' big':''}${has?'':' locked'}">${inner}</div>`;
}
function isLimitedActive(){if(_ldDevPick())return true;const t=_loginToday();return t>=LIMITED_GACHA.start&&t<=LIMITED_GACHA.end;}
// ガチャの景品プール（banner='limited'なら期間限定、それ以外は恒常）
// ===== ガチャ「黄金の精神」：リーチ・ロン・上がりの演出が景品 =====
GACHA_ITEMS.push(
  {id:'fx_thread',rarity:'common',category:'fx',gold:1,fxKind:'riichi',fxId:'thread',icon:'🧵',title:'糸',desc:'リーチの演出：身体がほどけた糸が、縄のように伸びる'},
  {id:'fx_bubble',rarity:'common',category:'fx',gold:1,fxKind:'riichi',fxId:'bubble',icon:'🫧',title:'シャボン玉',desc:'リーチの演出：音・水・摩擦を閉じ込めたシャボン玉が舞う'},
  {id:'fx_aura',rarity:'uncommon',category:'fx',gold:1,fxKind:'riichi',fxId:'aura',icon:'👁️',title:'威圧',desc:'リーチの演出：紫のオーラと「ゴ」の文字が迫る'},
  {id:'fx_sprout',rarity:'uncommon',category:'fx',gold:1,fxKind:'win',fxId:'sprout',icon:'🌱',title:'芽吹き',desc:'上がりの演出：石が花に変わり、つるが伸びて蝶が舞う'},
  {id:'fx_rush',rarity:'rare',category:'fx',gold:1,fxKind:'ron',fxId:'rush',icon:'👊',title:'ラッシュ',desc:'ロンの演出：無数の拳が「オラオラ」と殴りまくり、最後に中央で激突する'},
  {id:'fx_claw',rarity:'rare',category:'fx',gold:1,fxKind:'ron',fxId:'claw',icon:'💅',title:'爪弾',desc:'ロンの演出：爪が弾丸のように撃ち出される'},
  {id:'fx_mend',rarity:'rare',category:'fx',gold:1,fxKind:'win',fxId:'mend',icon:'🔧',title:'修復',desc:'上がりの演出：砕けた破片・瓦礫・破れた紙が巻き戻って元通りになり、傷が癒えて金色に輝く'},
  {id:'fx_heavyrain',rarity:'superrare',category:'fx',gold:1,fxKind:'ron',fxId:'heavyrain',icon:'🌧️',title:'重い雨',desc:'ロンの演出：重い雨粒が降り注ぎ、すべてを押しつぶす'},
  {id:'fx_timestop',rarity:'superrare',category:'fx',gold:1,fxKind:'win',fxId:'timestop',icon:'⏱️',title:'時間停止',desc:'上がりの演出：時計の針が止まり、世界が静止する'}
);
GACHA_ITEMS.push(
  {id:'fx_disc',rarity:'uncommon',category:'fx',gold:1,fxKind:'riichi',fxId:'disc',icon:'💿',title:'ディスク',desc:'リーチの演出：ディスクが飛び交い、光が走る'},
  {id:'fx_gravflip',rarity:'rare',category:'fx',gold:1,fxKind:'riichi',fxId:'gravflip',icon:'🔃',title:'重力反転',desc:'リーチの演出：重力が逆さまになり、すべてが空へ落ちる'},
  {id:'fx_erase',rarity:'superrare',category:'fx',gold:1,fxKind:'riichi',fxId:'erase',icon:'🎞️',title:'過程消去',desc:'リーチの演出：過程が消え、結果だけが残る'},
  {id:'fx_lightblade',rarity:'rare',category:'fx',gold:1,fxKind:'ron',fxId:'lightblade',icon:'🗡️',title:'光刃',desc:'ロンの演出：腕から刃が伸び、光の反射が切り裂く'},
  {id:'fx_tankbomb',rarity:'rare',category:'fx',gold:1,fxKind:'ron',fxId:'tankbomb',icon:'💣',title:'戦車爆弾',desc:'ロンの演出：熱を追う小さな戦車型爆弾が突っ込む'},
  {id:'fx_redray',rarity:'superrare',category:'fx',gold:1,fxKind:'ron',fxId:'redray',icon:'👁️',title:'赤光線',desc:'ロンの演出：気化した体液が、目から赤い光線になる'},
  {id:'fx_chronolock',rarity:'rare',category:'fx',gold:1,fxKind:'win',fxId:'chronolock',icon:'🧊',title:'止まった世界',desc:'上がりの演出：世界にひびが走り、すべてが静止する'},
  {id:'fx_rewind',rarity:'superrare',category:'fx',gold:1,fxKind:'win',fxId:'rewind',icon:'⏪',title:'巻き戻し',desc:'上がりの演出：時間がするすると巻き戻る'},
  {id:'fx_cosmos',rarity:'superrare',category:'fx',gold:1,fxKind:'win',fxId:'cosmos',icon:'🌌',title:'宇宙一巡',desc:'上がりの演出：宇宙が加速して一巡し、新しい世界が始まる'},
  {id:'fx_scoop',rarity:'superrare',category:'fx',gold:1,fxKind:'riichi',fxId:'scoop',icon:'🕳️',title:'削り取る',desc:'リーチの演出：空間が丸く削られ、閉じた先へ一瞬で飛ぶ'},
  {id:'fx_zipper',rarity:'rare',category:'fx',gold:1,fxKind:'riichi',fxId:'zipper',icon:'🤐',title:'ジッパー',desc:'リーチの演出：ジッパーが走り、世界が真ん中から開く'},
  {id:'fx_frostsuit',rarity:'rare',category:'fx',gold:1,fxKind:'riichi',fxId:'frostsuit',icon:'🥶',title:'絶対零度',desc:'リーチの演出：氷の鎧が空気まで凍らせ、弾丸を弾き返す'},
  {id:'fx_virus',rarity:'superrare',category:'fx',gold:1,fxKind:'ron',fxId:'virus',icon:'🦠',title:'殺人ウイルス',desc:'ロンの演出：緑の胞子が広がり、すべてを腐らせる'},
  {id:'fx_magnet',rarity:'rare',category:'fx',gold:1,fxKind:'ron',fxId:'magnet',icon:'🧲',title:'磁力の刃',desc:'ロンの演出：磁力に集まった鉄が、剃刀とハサミになって飛び出す'},
  {id:'fx_weather',rarity:'superrare',category:'fx',gold:1,fxKind:'win',fxId:'weather',icon:'⛈️',title:'天候',desc:'上がりの演出：雨・霧・雷、そして純酸素。最後はカタツムリ'},
  {id:'fx_book',rarity:'rare',category:'fx',gold:1,fxKind:'win',fxId:'book',icon:'📖',title:'命令の本',desc:'上がりの演出：本が開き、書き込まれた命令は絶対になる'},
  {id:'fx_cure',rarity:'uncommon',category:'fx',gold:1,fxKind:'win',fxId:'cure',icon:'🍝',title:'癒しの料理',desc:'上がりの演出：湯気の立つイタリアの一皿（トマトソースのスパゲッティ）が現れ、どんな不調も完治する'},
  {id:'bg_disc',rarity:'uncommon',category:'fieldbg',type:'scene',gold:1,icon:'💿',title:'ディスクの海',desc:'場の背景：虹色に光るディスクが漂う',get value(){return sceneUri('disc');}},
  {id:'bg_gravflip',rarity:'rare',category:'fieldbg',type:'scene',gold:1,icon:'🔃',title:'反転した街',desc:'場の背景：逆さまの街と、空へ向かう矢印',get value(){return sceneUri('gravflip');}},
  {id:'bg_erase',rarity:'rare',category:'fieldbg',type:'scene',gold:1,icon:'🎞️',title:'消えたコマ',desc:'場の背景：途中のコマが消えたフィルム',get value(){return sceneUri('erase');}},
  {id:'bg_lightblade',rarity:'rare',category:'fieldbg',type:'scene',gold:1,icon:'🗡️',title:'光の刃',desc:'場の背景：光の反射が空間を切り裂く',get value(){return sceneUri('lightblade');}},
  {id:'bg_tankbomb',rarity:'rare',category:'fieldbg',type:'scene',gold:1,icon:'💣',title:'爆弾戦車隊',desc:'場の背景：熱を追って進む小さな戦車たち',get value(){return sceneUri('tankbomb');}},
  {id:'bg_redray',rarity:'superrare',category:'fieldbg',type:'scene',gold:1,icon:'👁️',title:'赤い閃光',desc:'場の背景：二筋の赤い光線が一点を焼く',get value(){return sceneUri('redray');}},
  {id:'bg_chrono',rarity:'superrare',category:'fieldbg',type:'scene',gold:1,icon:'🧊',title:'静止した世界',desc:'場の背景：ひび割れた世界と、宙に浮く雫',get value(){return sceneUri('chrono');}},
  {id:'bg_rewind',rarity:'superrare',category:'fieldbg',type:'scene',gold:1,icon:'⏪',title:'巻き戻る時',desc:'場の背景：巻き戻しの矢印と逆回りの時計',get value(){return sceneUri('rewind');}},
  {id:'bg_cosmos',rarity:'superrare',category:'fieldbg',type:'scene',gold:1,icon:'🌌',title:'宇宙の夜明け',desc:'場の背景：渦巻く宇宙と、新しい世界の夜明け',get value(){return sceneUri('cosmos');}}
);
// ===== 黄金の精神 第4弾：プレイヤーアイコン6種（動く）・演出6種・背景4種（すべてオリジナルの絵柄）=====
const _DN={up:'M10 48Q12 36 28 32Q44 18 66 24Q88 30 92 52L88 56H34Q20 56 10 52Z',lo:'M14 58Q40 62 88 58L92 70Q60 86 20 70Z'};
const _G4S='stroke="#0a0e18" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"';
// ---- アイコン1：甲冑の剣士（剣技→甲冑を脱ぎ捨てる→加速して残像）----
GICON_SVG.gi_knight=function(){
  const S=_G4S;
  const head=`<path d="M50 20Q60 6 76 12Q64 16 60 26Z" fill="#e23648" ${S}/><path d="M37 46Q37 24 50 22Q63 24 63 46V56Q63 63 50 65Q37 63 37 56Z" fill="#c4cfde" ${S}/><rect x="40" y="40" width="20" height="5" rx="1.5" fill="#0c1018"/><path d="M50 24V40M44 52H56" stroke="#7d8ca2" stroke-width="1.6" fill="none"/>`;
  const cloth=`<path d="M31 100L34 76Q50 68 66 76L69 100Z" fill="#33437a" ${S}/><path d="M50 72V100" stroke="#8fa4e0" stroke-width="1.6"/>`;
  const ghost=(dx,dl)=>`<g transform="translate(${dx} 0)"><g style="animation:knGh 6s ease-in-out ${dl}s infinite;opacity:0">${cloth}${head}</g></g>`;
  let ln='';for(let i=0;i<7;i++)ln+=`<path d="M${4+i*14} ${8+(i%3)*6}L${14+i*14} ${(i%3)*6+30}" stroke="#fff" stroke-width=".8" opacity=".25"/>`;
  return _giSvg(_giRG('#2c4070','#060814'),`<style>
@keyframes knGh{0%,42%{opacity:0}52%{opacity:.42}90%{opacity:.34}100%{opacity:0}}
@keyframes knPl{0%,40%{opacity:1}46%,96%{opacity:0}100%{opacity:1}}
@keyframes knPaL{0%,40%{transform:translate(0,0) rotate(0);opacity:1}62%{transform:translate(-34px,-16px) rotate(-80deg);opacity:0}96%{opacity:0}100%{transform:none;opacity:1}}
@keyframes knPaR{0%,40%{transform:translate(0,0) rotate(0);opacity:1}62%{transform:translate(34px,-16px) rotate(80deg);opacity:0}96%{opacity:0}100%{transform:none;opacity:1}}
@keyframes knSw{0%,40%{transform:translate(0,0)}6%{transform:translate(-6px,6px)}14%{transform:translate(1px,-1px)}22%{transform:translate(-5px,5px)}30%{transform:translate(0,0)}48%{transform:translate(-7px,7px)}52%{transform:translate(2px,-2px)}56%{transform:translate(-7px,7px)}60%{transform:translate(2px,-2px)}64%{transform:translate(-7px,7px)}68%{transform:translate(0,0)}78%{transform:translate(-7px,7px)}84%{transform:translate(2px,-2px)}90%{transform:translate(-7px,7px)}100%{transform:translate(0,0)}}
@keyframes knFl{0%,100%{opacity:0}8%{opacity:1}24%{opacity:0}}
@keyframes knSh{0%,100%{transform:translateX(0)}50%{transform:translateX(-2px)}}
</style>${ln}${ghost(-22,0)}${ghost(-11,.05)}${ghost(22,.1)}${ghost(11,.15)}
<g style="animation:knSh .5s linear infinite">${cloth}
<g style="animation:knPl 6s ease-in-out infinite"><path d="M31 100L34 74Q50 66 66 74L69 100Z" fill="#8d9db4" ${S}/><path d="M50 70V100M40 82Q50 88 60 82" stroke="#4b5a72" stroke-width="1.8" fill="none"/></g>
<g style="animation:knPaL 6s ease-in-out infinite;transform-origin:29px 75px"><ellipse cx="29" cy="75" rx="12" ry="8" fill="#b4c2d6" ${S}/></g>
<g style="animation:knPaR 6s ease-in-out infinite;transform-origin:71px 75px"><ellipse cx="71" cy="75" rx="12" ry="8" fill="#b4c2d6" ${S}/></g>
${head}</g>
<g style="animation:knSw 6s linear infinite"><path d="M70 92L96 30" stroke="#f4f8ff" stroke-width="3" stroke-linecap="round"/><path d="M70 92L96 30" stroke="#0a0e18" stroke-width=".8"/><path d="M63 86L77 93" stroke="#e0b030" stroke-width="3.4" stroke-linecap="round"/><circle cx="68" cy="95" r="3.2" fill="#e0b030" ${S}/></g>
<path d="M10 34Q46 6 90 26" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" style="animation:knFl 1.5s linear infinite"/><path d="M8 62Q40 40 92 58" stroke="#bfe0ff" stroke-width="2" fill="none" stroke-linecap="round" style="animation:knFl 1.5s linear .5s infinite"/><path d="M16 14Q50 30 88 12" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" style="animation:knFl 1.5s linear 1s infinite"/>`);};
// ---- アイコン2：弾丸を操る6人の小さなスタンド ----
GICON_SVG.gi_bullets=function(){
  const S=_G4S,cols=['#ff5a5a','#ffb030','#ffe84a','#5ad878','#4aa8ff','#c070ff'],pos=[[20,68],[50,80],[80,68],[22,32],[50,22],[80,32]];
  let f='';pos.forEach(([x,y],i)=>f+=`<g style="animation:bHop 1.8s ease-in-out ${(i*.3).toFixed(1)}s infinite"><g transform="translate(${x} ${y})"><ellipse cy="10" rx="5.5" ry="1.8" fill="#000" opacity=".3"/><rect x="-3.4" y="1.5" width="6.8" height="7.5" rx="2.2" fill="${cols[i]}" ${S}/><circle cy="-3" r="5.2" fill="#ffdcb4" ${S}/><path d="M-5.8-4Q0-12.5 5.8-4Z" fill="${cols[i]}" ${S}/><circle cx="-1.9" cy="-2.4" r="1" fill="#000"/><circle cx="1.9" cy="-2.4" r="1" fill="#000"/></g></g>`);
  const P='M22 56L50 70L80 56L26 42L50 36L80 44L50 54Z';let b='';
  [0,.14,.28,.42].forEach((d,i)=>b+=`<g opacity="${(1-i*.25).toFixed(2)}"><ellipse rx="${5.5-i}" ry="${2.8-i*.4}" fill="#ffd34a" stroke="#000" stroke-width="1.4"/><path d="M5 0L10 0" stroke="#fff" stroke-width="1" opacity="0"/><animateMotion dur="3.6s" begin="-${d}s" repeatCount="indefinite" rotate="auto" path="${P}"/></g>`);
  let k='';[[22,56],[50,70],[80,56],[26,42],[50,36],[80,44]].forEach(([x,y],i)=>k+=`<path d="M${x} ${y-6}L${x+1.6} ${y-1.6}L${x+6} ${y}L${x+1.6} ${y+1.6}L${x} ${y+6}L${x-1.6} ${y+1.6}L${x-6} ${y}L${x-1.6} ${y-1.6}Z" fill="#fff" style="animation:tw 1.8s ease-in-out ${(i*.3).toFixed(1)}s infinite"/>`);
  return _giSvg(_giRG('#42205e','#08030f'),`<style>@keyframes bHop{0%,100%{transform:translateY(0)}18%{transform:translateY(-6px)}36%{transform:translateY(0)}}</style><path d="${P}" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="2 3" opacity=".3"/>${k}${f}${b}`);};
// ---- アイコン3：プロペラ機（機銃・爆撃・二酸化炭素レーダー）----
GICON_SVG.gi_plane=function(){
  const S=_G4S;let co='';[[16,92,0],[34,95,.8],[56,93,1.6],[78,96,.4],[90,92,1.2]].forEach(([x,y,d])=>co+=`<circle cx="${x}" cy="${y}" r="1.8" fill="#a8ffc8" style="animation:rise 3s ease-out ${d}s infinite"/>`);
  return _giSvg(_giLG('#2a2a6a','#f2915a'),`<style>@keyframes pf{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.35)}}@keyframes dsh{to{stroke-dashoffset:-9}}@keyframes bomb{0%{transform:translate(0,0) rotate(0);opacity:1}70%{opacity:1}100%{transform:translate(8px,46px) rotate(40deg);opacity:0}}@keyframes pBob{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-3px) rotate(1.5deg)}}</style>
<path d="M0 100V84Q20 74 40 84T80 82T100 80V100Z" fill="#150a22"/>${co}
<circle cx="58" cy="40" r="6" fill="none" stroke="#7affa8" stroke-width="1.6"><animate attributeName="r" from="6" to="52" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" from=".85" to="0" dur="2.4s" repeatCount="indefinite"/></circle>
<circle cx="58" cy="40" r="6" fill="none" stroke="#7affa8" stroke-width="1.6"><animate attributeName="r" from="6" to="52" dur="2.4s" begin="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" from=".85" to="0" dur="2.4s" begin="1.2s" repeatCount="indefinite"/></circle>
<g style="animation:pBob 2.2s ease-in-out infinite;transform-origin:50px 40px">
<g style="animation:bomb 2.4s ease-in infinite"><ellipse cx="50" cy="52" rx="3.2" ry="5" fill="#2a2a36" ${S}/><path d="M47 49L45 46M53 49L55 46" stroke="#000" stroke-width="1.6"/></g>
<path d="M82 46L98 62" stroke="#ffe060" stroke-width="2.4" stroke-dasharray="4 5" style="animation:dsh .45s linear infinite"/>
<path d="M22 44L10 34L16 32L30 40Z" fill="#a8b24a" ${S}/><path d="M24 44Q26 36 42 36H66Q76 36 82 42Q76 50 66 50H40Q28 50 24 44Z" fill="#cdd672" ${S}/><path d="M42 42L52 22H62L56 42Z" fill="#a8b24a" ${S}/><ellipse cx="58" cy="36" rx="6.5" ry="4" fill="#8ae0ff" ${S}/><circle cx="36" cy="44" r="3" fill="#d83a3a"/>
<ellipse class="o" cx="83" cy="42" rx="1.8" ry="11" fill="#fff" opacity=".75" style="animation:pf .12s linear infinite"/><circle cx="82" cy="42" r="2.4" fill="#e0b030" ${S}/></g>`);};
// ---- アイコン4：潜り込む（体の中へ潜り、ダメージを肩代わり）----
GICON_SVG.gi_dive=function(){
  const S=_G4S;let rp='';[0,.8,1.6].forEach(d=>rp+=`<ellipse cx="50" cy="70" rx="12" ry="3.5" fill="none" stroke="#7af0ff" stroke-width="1.6"><animate attributeName="rx" from="12" to="46" dur="2.4s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="ry" from="3.5" to="13" dur="2.4s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" from=".9" to="0" dur="2.4s" begin="${d}s" repeatCount="indefinite"/></ellipse>`);
  return _giSvg(_giLG('#0c3446','#031018'),`<style>@keyframes dvF{0%,100%{transform:translateY(26px)}30%,62%{transform:translateY(-4px)}}@keyframes dvSp{0%{transform:translate(-34px,-26px) scale(1.2);opacity:1}55%{transform:translate(0,0) scale(.6);opacity:1}100%{transform:translate(0,0) scale(.1);opacity:0}}@keyframes dvEy{0%,100%{opacity:.5}50%{opacity:1}}</style>
<defs><clipPath id="dc"><rect x="0" y="0" width="100" height="71"/></clipPath></defs>
<ellipse cx="50" cy="70" rx="38" ry="11" fill="#06212e"/>${rp}
<g clip-path="url(#dc)"><g style="animation:dvF 3.6s ease-in-out infinite"><path d="M22 96Q24 62 50 58Q76 62 78 96Z" fill="#cfe4f2" ${S}/><circle cx="50" cy="42" r="14" fill="#e6f2fa" ${S}/><path d="M36 38Q50 24 64 38" fill="#7fa0b8" ${S}/><circle cx="44" cy="43" r="2.6" fill="#38e8ff" style="animation:dvEy 1.2s infinite"/><circle cx="56" cy="43" r="2.6" fill="#38e8ff" style="animation:dvEy 1.2s infinite"/></g></g>
<path d="M12 71Q50 84 88 71" fill="none" stroke="#7af0ff" stroke-width="2.4" stroke-linecap="round"/>
<g style="animation:dvSp 3.6s ease-in infinite;transform-origin:50px 56px"><path d="M50 50L53 56L59 58L53 60L50 66L47 60L41 58L47 56Z" fill="#ffb347" ${S}/></g>`);};
// ---- アイコン5：恐竜化（野性の牙・鋭い嗅覚・動体視力）----
GICON_SVG.gi_dino=function(){
  const rot=(px,py,d)=>{const a=d*Math.PI/180,dx=px-480,dy=py-236,c=Math.cos(a),s=Math.sin(a);return[480+dx*c-dy*s,236+dx*s+dy*c];};
  const poly=d=>{const a=rot(60,205,d),b=rot(480,240,d);return `60,195 480,238 ${b[0].toFixed(1)},${b[1].toFixed(1)} ${a[0].toFixed(1)},${a[1].toFixed(1)}`;};
  const OP=-28,P0=poly(0),P1=poly(OP),KT='0;.18;.66;.8;1',DUR='3.6s';
  const SK='M30 150C30 120 50 100 90 92C150 60 230 40 310 50C380 56 450 80 500 130C530 160 540 200 520 230L470 240L260 215L120 200L40 190C28 175 26 160 30 150Z';
  const JW='M40 200L260 218L470 244C490 270 470 300 430 300C330 316 150 290 60 250C40 235 34 215 40 200Z';
  const tooth=(x,y,len,wd,d)=>`<path d="M${x-wd/2} ${y}Q${x-wd*.35} ${y+d*len*.6} ${x+wd*.1} ${y+d*len}Q${x+wd*.45} ${y+d*len*.55} ${x+wd/2} ${y}Z" fill="url(#${d>0?'dnTd':'dnTu'})" stroke="#2a1c08" stroke-width="1.4" stroke-linejoin="round"/>`;
  let tu='',tl='';for(let i=0;i<12;i++){const x=70+i*22,y=188+(x-60)*.104;tu+=tooth(x,y,i<3?40:22+(i%3)*6,i<3?15:12,1);}for(let i=0;i<10;i++){const x=80+i*24,y=204+(x-60)*.12;tl+=tooth(x,y,18+(i%3)*5,11,-1);}
  let st='';for(let i=0;i<7;i++){const x=130+i*58;st+=`<path d="M${x} ${52+Math.abs(i-3)*10}Q${x+20} 110 ${x-10} 200" stroke="#0e180a" stroke-width="${7+(i%3)*2}" stroke-linecap="round" fill="none" opacity=".5"/>`;}
  let vn='';for(let i=0;i<14;i++){const a=i/14*6.283;vn+=`<path d="M${(332+Math.cos(a)*6).toFixed(1)} ${(106+Math.sin(a)*6).toFixed(1)}L${(332+Math.cos(a)*20).toFixed(1)} ${(106+Math.sin(a)*18).toFixed(1)}" stroke="#5a1e00" stroke-width="1" opacity=".5"/>`;}
  let br='';[0,1.2,2.4].forEach(d=>br+=`<circle r="8" fill="#fff" opacity="0"><animate attributeName="cx" values="76;-10" dur="3.6s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="cy" values="108;40" dur="3.6s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="r" values="8;38" dur="3.6s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.55;0" dur="3.6s" begin="${d}s" repeatCount="indefinite"/></circle>`);
  let ra='';[0,.08,.16].forEach((d,i)=>ra+=`<path d="M${10-i*12} ${150-i*10}A${70+i*14} ${70+i*14} 0 0 0 ${10-i*12} ${250+i*10}" fill="none" stroke="#ffd890" stroke-width="${6-i}" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;0;.75;0;0" keyTimes="0;.18;.3;.6;1" dur="${DUR}" repeatCount="indefinite" begin="${d}s"/><animateTransform attributeName="transform" type="translate" values="0 0;0 0;-40 0;-110 0;-110 0" keyTimes="0;.18;.3;.6;1" dur="${DUR}" repeatCount="indefinite" begin="${d}s"/></path>`);
  let em='';[[18,92,0],[40,98,1.1],[70,95,2.1],[88,90,.6]].forEach(([x,y,d])=>em+=`<circle cx="${x}" cy="${y}" r="1.2" fill="#ffb050"><animate attributeName="cy" values="${y};${y-46}" dur="3s" begin="${d}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="3s" begin="${d}s" repeatCount="indefinite"/></circle>`);
  const defs=_giRG('#e07a22','#240a04')+`<linearGradient id="dnSk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#35562a"/><stop offset=".5" stop-color="#5d7c34"/><stop offset="1" stop-color="#a89a58"/></linearGradient><linearGradient id="dnJ" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a6a2c"/><stop offset="1" stop-color="#c4b678"/></linearGradient><linearGradient id="dnSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdc8c" stop-opacity=".32"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient><radialGradient id="dnBk" cx=".86" cy=".5" r=".4"><stop offset="0" stop-color="#000" stop-opacity=".62"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><radialGradient id="dnSg" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#ffffd7" stop-opacity=".5"/><stop offset=".55" stop-color="#789a3c" stop-opacity=".12"/><stop offset="1" stop-color="#081606" stop-opacity=".72"/></radialGradient><pattern id="dnSc" width="64" height="56" patternUnits="userSpaceOnUse"><g fill="url(#dnSg)" stroke="#061204" stroke-opacity=".8" stroke-width="1.4"><ellipse cx="16" cy="14" rx="16" ry="14"/><ellipse cx="48" cy="14" rx="16" ry="14"/><ellipse cx="0" cy="42" rx="16" ry="14"/><ellipse cx="32" cy="42" rx="16" ry="14"/><ellipse cx="64" cy="42" rx="16" ry="14"/></g></pattern><radialGradient id="dnIr" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6b0"/><stop offset=".5" stop-color="#ffb818"/><stop offset="1" stop-color="#8a3a00"/></radialGradient><linearGradient id="dnTd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a6a44"/><stop offset=".4" stop-color="#efe6c2"/><stop offset="1" stop-color="#fffbe8"/></linearGradient><linearGradient id="dnTu" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7a6a44"/><stop offset=".4" stop-color="#efe6c2"/><stop offset="1" stop-color="#fffbe8"/></linearGradient><linearGradient id="dnMo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0408"/><stop offset=".5" stop-color="#5a0f18"/><stop offset="1" stop-color="#2a0610"/></linearGradient><linearGradient id="dnTg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c0505a"/><stop offset="1" stop-color="#7a1a24"/></linearGradient><clipPath id="dnC"><path d="${SK}"/></clipPath>`;
  return _giSvg(defs,`<path d="M0 100V80Q14 70 26 82Q40 66 52 80Q66 68 80 80Q92 72 100 82V100Z" fill="#12260c"/>${em}
<g transform="translate(10 19) scale(.15)"><animateTransform attributeName="transform" type="translate" additive="sum" values="0 0;-6 -5;0 0" dur="${DUR}" repeatCount="indefinite"/>
<g>${ra}</g>
<polygon fill="url(#dnMo)"><animate attributeName="points" values="${P0};${P1};${P1};${P0};${P0}" keyTimes="${KT}" dur="${DUR}" repeatCount="indefinite"/></polygon>
<g><animateTransform attributeName="transform" type="rotate" values="0 480 236;${OP} 480 236;${OP} 480 236;0 480 236;0 480 236" keyTimes="${KT}" dur="${DUR}" repeatCount="indefinite"/>
<path d="M90 216Q200 194 330 222Q390 232 430 246L430 254Q250 238 90 228Z" fill="url(#dnTg)" stroke="#280408" stroke-width="2"/>${tl}<path d="${JW}" fill="url(#dnJ)"/><path d="${JW}" fill="url(#dnSc)" opacity=".75"/><path d="${JW}" fill="#000" opacity=".12"/><path d="${JW}" fill="none" stroke="#0c1608" stroke-width="4"/><path d="M60 250C150 290 330 316 430 300" fill="none" stroke="#ffbe6e" stroke-width="2.2" opacity=".6"/></g>
${tu}<path d="${SK}" fill="url(#dnSk)"/><g clip-path="url(#dnC)"><path d="${SK}" fill="url(#dnSc)" opacity=".9"/>${st}<rect width="600" height="360" fill="url(#dnSh)"/><rect width="600" height="360" fill="url(#dnBk)"/></g>
<path d="${SK}" fill="none" stroke="#0c1608" stroke-width="4"/><path d="M90 92C150 60 230 40 310 50C380 56 450 80 500 130" fill="none" stroke="#ffbe6e" stroke-width="2.6" opacity=".75"/>
<path d="M111 94L121 68L131 95ZM151 80L161 50L172 81ZM196 70L206 44L216 71ZM241 64L250 42L259 65Z" fill="#4a6a30" stroke="#0c1608" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M280 100Q325 56 380 90Q340 82 298 110Z" fill="#2e4a24" stroke="#0c1608" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="332" cy="106" rx="31" ry="23" transform="rotate(-8.6 332 106)" fill="#10180a"/><ellipse cx="332" cy="106" rx="22" ry="19" transform="rotate(-8.6 332 106)" fill="url(#dnIr)"/>${vn}
<ellipse cx="332" cy="106" rx="4.4" ry="17" transform="rotate(-8.6 332 106)" fill="#000"><animate attributeName="rx" values="4.4;2.2;4.4" dur="${DUR}" repeatCount="indefinite"/></ellipse><circle cx="324" cy="98" r="4.2" fill="#fff" opacity=".92"/><path d="M301 98A31 23 -8.6 0 1 363 112" fill="none" stroke="#0a1206" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="76" cy="108" rx="9" ry="5.5" transform="rotate(28 76 108)" fill="#0a1006" stroke="#82aa50" stroke-opacity=".6" stroke-width="2"/>${br}
<path d="M40 190L120 200L260 215L470 240" fill="none" stroke="#0c1608" stroke-width="3.4"/></g>`);};
// ---- アイコン6：空中で止まった雨（刃・雨の上を歩く・体が雨に溶ける）----
GICON_SVG.gi_stillrain=function(){
  const S=_G4S;let a=7,rnd=()=>(a=(a*16807)%2147483647)/2147483647,dr='';
  for(let i=0;i<30;i++){const x=rnd()*100,y=rnd()*92,s=.6+rnd()*.9;dr+=`<path d="M${x.toFixed(1)} ${(y-5*s).toFixed(1)}L${(x+1.7*s).toFixed(1)} ${y.toFixed(1)}L${x.toFixed(1)} ${(y+3.2*s).toFixed(1)}L${(x-1.7*s).toFixed(1)} ${y.toFixed(1)}Z" fill="#dcefff" style="animation:tw ${(1.6+rnd()*2.4).toFixed(1)}s ease-in-out ${(rnd()*2).toFixed(1)}s infinite"/>`;}
  let stp='';[[16,90],[32,80],[48,70],[64,60]].forEach(([x,y])=>stp+=`<path d="M${x} ${y-6}L${x+4.4} ${y}L${x} ${y+4}L${x-4.4} ${y}Z" fill="#bfe2ff" ${S}/>`);
  return _giSvg(_giLG('#4f6286','#121a2e'),`<style>@keyframes rnG{0%,100%{opacity:1}50%{opacity:.45}}@keyframes rnB{0%{transform:translateX(-80px);opacity:0}6%{opacity:1}26%{transform:translateX(80px);opacity:0}100%{transform:translateX(80px);opacity:0}}@keyframes rnW{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}</style>${dr}${stp}
<g style="animation:rnW .8s ease-in-out infinite"><g style="animation:rnG 2.4s ease-in-out infinite"><circle cx="64" cy="38" r="6" fill="#26385e" stroke="#cfe8ff" stroke-width="1.6"/><path d="M58 46Q64 42 70 46L71 55H57Z" fill="#26385e" stroke="#cfe8ff" stroke-width="1.6" stroke-linejoin="round"/><path d="M60 55L58 60M68 55L71 59" stroke="#cfe8ff" stroke-width="4.6" stroke-linecap="round"/><path d="M60 55L58 60M68 55L71 59" stroke="#26385e" stroke-width="2.6" stroke-linecap="round"/><path d="M60 30L60 62M64 28L64 62M68 30L68 62" stroke="#bfe2ff" stroke-width=".8" opacity=".7"/></g></g>
<g style="animation:rnB 3.4s linear infinite"><path d="M6 22L56 18" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M52 16L66 18L52 21Z" fill="#fff"/></g><g style="animation:rnB 3.4s linear 1.7s infinite"><path d="M10 46L52 40" stroke="#dff0ff" stroke-width="1.8" stroke-linecap="round"/><path d="M48 38L60 40L48 43Z" fill="#dff0ff"/></g>`);};

// ---- 演出の登録（画面の演出一覧に出る名前・色）----
FX_STYLES.riichi.push(
  {id:'kickshot',name:'蹴り弾',icon:'🔫',c1:'#ffd34a',c2:'#fff4c0',bg:'rgba(30,12,48,.9)',dm:'rgba(36,14,58,.45)',mode:'burst'},
  {id:'dive',name:'潜り込み',icon:'🌀',c1:'#7af0ff',c2:'#e8fbff',bg:'rgba(4,24,34,.9)',dm:'rgba(6,30,42,.45)',mode:'burst'});
FX_STYLES.ron.push(
  {id:'rapier',name:'目にも留まらぬ剣技',icon:'⚔️',c1:'#cfe4ff',c2:'#ffffff',bg:'rgba(8,12,34,.9)',dm:'rgba(10,16,44,.45)',mode:'burst'},
  {id:'strafe',name:'機銃掃射と爆撃',icon:'✈️',c1:'#ffd060',c2:'#fff4d0',bg:'rgba(10,26,16,.9)',dm:'rgba(12,32,20,.45)',mode:'burst'});
FX_STYLES.win.push(
  {id:'dino',name:'恐竜化',icon:'🦖',c1:'#ffb040',c2:'#fff0c0',bg:'rgba(34,14,4,.9)',dm:'rgba(42,18,6,.45)',mode:'burst'},
  {id:'stillrain',name:'静止する雨',icon:'🌧️',c1:'#bfe2ff',c2:'#ffffff',bg:'rgba(12,18,34,.9)',dm:'rgba(16,24,44,.45)',mode:'burst'});
// ---- 景品の登録 ----
GACHA_ITEMS.push(
  {id:'gi_bullets',rarity:'uncommon',category:'gicon',gold:1,icon:'🔫',title:'六人の弾丸小隊',desc:'アイコン：弾丸を蹴って軌道を変える、6人の小さな意思たち（動く）',value:'gi_bullets'},
  {id:'gi_dive',rarity:'uncommon',category:'gicon',gold:1,icon:'🌀',title:'潜り込む影',desc:'アイコン：体の中へ潜り込み、ダメージを肩代わりする（動く）',value:'gi_dive'},
  {id:'gi_plane',rarity:'rare',category:'gicon',gold:1,icon:'✈️',title:'プロペラの爆撃機',desc:'アイコン：機銃と爆撃、そして吐息を探るレーダー（動く）',value:'gi_plane'},
  {id:'gi_stillrain',rarity:'rare',category:'gicon',gold:1,icon:'🌧️',title:'空中に止まる雨',desc:'アイコン：雨粒は刃になり、雨の上を歩き、体は雨に溶ける（動く）',value:'gi_stillrain'},
  {id:'gi_knight',rarity:'superrare',category:'gicon',gold:1,icon:'⚔️',title:'疾風の甲冑剣士',desc:'アイコン：目にも留まらぬ剣技。甲冑を脱ぎ捨てると加速し、残像が生まれる（動く）',value:'gi_knight'},
  {id:'gi_dino',rarity:'superrare',category:'gicon',gold:1,icon:'🦖',title:'恐竜化の咆哮',desc:'アイコン：鋭い嗅覚と動体視力を得た、野性の牙（動く）',value:'gi_dino'},
  {id:'fx_dive',rarity:'uncommon',category:'fx',gold:1,fxKind:'riichi',fxId:'dive',icon:'',title:'潜り込み',desc:'リーチの演出：影のように潜り込み、ダメージを引き受ける'},
  {id:'fx_kickshot',rarity:'rare',category:'fx',gold:1,fxKind:'riichi',fxId:'kickshot',icon:'',title:'蹴り弾',desc:'リーチの演出：弾丸を蹴り、あり得ない角度から撃ち抜く'},
  {id:'fx_strafe',rarity:'rare',category:'fx',gold:1,fxKind:'ron',fxId:'strafe',icon:'',title:'機銃掃射と爆撃',desc:'ロンの演出：プロペラ機が機銃掃射と爆撃を浴びせる'},
  {id:'fx_stillrain',rarity:'rare',category:'fx',gold:1,fxKind:'win',fxId:'stillrain',icon:'',title:'静止する雨',desc:'上がりの演出：降る雨が空中で止まり、刃となって走る'},
  {id:'fx_rapier',rarity:'superrare',category:'fx',gold:1,fxKind:'ron',fxId:'rapier',icon:'',title:'目にも留まらぬ剣技',desc:'ロンの演出：甲冑を脱ぎ捨てて加速し、残像だけが残る'},
  {id:'fx_dino',rarity:'superrare',category:'fx',gold:1,fxKind:'win',fxId:'dino',icon:'',title:'恐竜化',desc:'上がりの演出：野性の咆哮と足音、爪痕が走る'},
  {id:'bg_strafe',rarity:'uncommon',category:'fieldbg',type:'scene',gold:1,icon:'',title:'レーダーの夜空',desc:'場の背景：吐息を探るレーダーと、飛び交うプロペラ機',get value(){return sceneUri('strafe');}},
  {id:'bg_stillrain',rarity:'rare',category:'fieldbg',type:'scene',gold:1,icon:'',title:'止まった雨の街',desc:'場の背景：空中で静止した雨粒が光る街',get value(){return sceneUri('stillrain');}},
  {id:'bg_dino',rarity:'rare',category:'fieldbg',type:'scene',gold:1,icon:'',title:'太古の密林',desc:'場の背景：恐竜が闊歩する原始の夕暮れ',get value(){return sceneUri('dino');}},
  {id:'bg_rapier',rarity:'rare',category:'fieldbg',type:'scene',gold:1,icon:'',title:'甲冑の間',desc:'場の背景：脱ぎ捨てられた甲冑と、剣の残光',get value(){return sceneUri('rapier');}}
);
// ---- 演出の描画（canvas）----
// ---- リアル版の演出：目にも留まらぬ剣技／機銃掃射と爆撃（ロン）----
const _mc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
let _rpC=null;
function _rpMake(){
  if(_rpC)return _rpC;
  const mt=(g,x0,y0,x1,y1)=>{const q=g.createLinearGradient(x0,y0,x1,y1);q.addColorStop(0,'#f4f8ff');q.addColorStop(.22,'#aab6ca');q.addColorStop(.5,'#566276');q.addColorStop(.78,'#8e9bb2');q.addColorStop(1,'#262e3e');return q;};
  const pc=(P,x0,y0,x1,y1,ex)=>{const cv=_mc(420,520),g=cv.getContext('2d'),p=new Path2D(P);g.fillStyle=mt(g,x0,y0,x1,y1);g.fill(p);g.save();g.clip(p);const sp=g.createLinearGradient(x0,y0,x1,y1);sp.addColorStop(.15,'rgba(255,255,255,0)');sp.addColorStop(.3,'rgba(255,255,255,.6)');sp.addColorStop(.38,'rgba(255,255,255,0)');g.fillStyle=sp;g.fillRect(0,0,420,520);const ed=g.createRadialGradient(210,300,60,210,300,260);ed.addColorStop(0,'rgba(0,0,0,0)');ed.addColorStop(1,'rgba(0,0,0,.45)');g.fillStyle=ed;g.fillRect(0,0,420,520);if(ex)ex(g);g.restore();g.strokeStyle='#080c16';g.lineWidth=4;g.stroke(p);return cv;};
  const helm=pc('M150 250Q150 130 210 120Q270 130 270 250L270 285Q270 305 210 312Q150 305 150 285Z',150,120,270,312,g=>{g.fillStyle='#05080e';g.fillRect(162,204,96,16);g.fillStyle='rgba(120,180,255,.55)';g.fillRect(162,204,96,2.5);g.strokeStyle='rgba(20,28,44,.8)';g.lineWidth=3;g.beginPath();g.moveTo(210,124);g.lineTo(210,204);g.moveTo(210,220);g.lineTo(210,310);g.stroke();for(let i=0;i<6;i++){g.beginPath();g.arc(176+i*14,262,2.2,0,7);g.fillStyle='#222c3c';g.fill();}});
  {const g=helm.getContext('2d'),pl=g.createLinearGradient(210,60,330,130);pl.addColorStop(0,'#ff5a5a');pl.addColorStop(1,'#6a0a14');g.fillStyle=pl;g.beginPath();g.moveTo(206,128);g.quadraticCurveTo(250,40,340,72);g.quadraticCurveTo(272,90,252,134);g.closePath();g.fill();g.strokeStyle='#2a0408';g.lineWidth=3;g.stroke();}
  const breast=pc('M128 520L140 318Q210 296 280 318L292 520Z',128,300,292,520,g=>{g.strokeStyle='rgba(10,14,24,.75)';g.lineWidth=3;g.beginPath();g.moveTo(210,308);g.lineTo(210,520);for(let y=380;y<520;y+=44){g.moveTo(132,y);g.quadraticCurveTo(210,y+16,288,y);}g.stroke();for(let i=0;i<5;i++){g.fillStyle='#1c2434';g.beginPath();g.arc(160+i*25,340,2.4,0,7);g.fill();}});
  const pauL=pc('M122 330Q56 318 50 382Q58 428 124 412Q146 380 122 330Z',50,320,146,420,g=>{g.strokeStyle='rgba(10,14,24,.7)';g.lineWidth=3;for(let i=0;i<3;i++){g.beginPath();g.arc(140,372,28+i*14,2.2,4.2);g.stroke();}});
  const pauR=pc('M298 330Q364 318 370 382Q362 428 296 412Q274 380 298 330Z',370,320,274,420,g=>{g.strokeStyle='rgba(10,14,24,.7)';g.lineWidth=3;for(let i=0;i<3;i++){g.beginPath();g.arc(280,372,28+i*14,5.2,7.2);g.stroke();}});
  const cloth=_mc(420,520),g=cloth.getContext('2d'),cg=g.createLinearGradient(0,300,0,520);cg.addColorStop(0,'#26356a');cg.addColorStop(1,'#080c1c');g.fillStyle=cg;g.beginPath();g.moveTo(104,520);g.lineTo(120,330);g.quadraticCurveTo(210,292,300,330);g.lineTo(316,520);g.closePath();g.fill();g.beginPath();g.moveTo(122,330);g.quadraticCurveTo(66,400,76,520);g.lineTo(124,520);g.fill();g.beginPath();g.moveTo(298,330);g.quadraticCurveTo(354,400,344,520);g.lineTo(296,520);g.fill();g.strokeStyle='rgba(120,150,230,.25)';g.lineWidth=2;for(let i=0;i<7;i++){g.beginPath();g.moveTo(150+i*20,330);g.quadraticCurveTo(150+i*20+(i-3)*6,430,140+i*24,520);g.stroke();}
  const hd=g.createRadialGradient(200,205,8,210,215,66);hd.addColorStop(0,'#2a3868');hd.addColorStop(1,'#04060e');g.fillStyle=hd;g.beginPath();g.arc(210,215,64,0,7);g.fill();g.strokeStyle='#9fd0ff';g.shadowColor='#9fd0ff';g.shadowBlur=12;g.lineWidth=4;g.beginPath();g.moveTo(182,214);g.lineTo(202,210);g.moveTo(218,210);g.lineTo(238,214);g.stroke();
  return _rpC={helm,breast,pauL,pauR,cloth};}
FXS.rapier=(W,H,D)=>{const k=Math.min(W,H)/600,f=2.3/D,K=_rpMake(),s=Math.min(W*1.0/420*1.05,H*.66/520),cx=W/2,by=H*.84,
  pv=[['breast',210,420],['pauL',86,375],['pauR',334,375],['helm',210,215]],
  sh=pv.map(([n,px,py])=>({n,px,py,vx:(px-210)*_fRn(2,3.4)*s+_fRn(-100,100)*k,vy:-_fRn(300,620)*k,vr:_fRn(-7,7)})),
  sl=Array.from({length:16},(_,i)=>{const a=_fRn(-.8,.8)+(i%2?0:Math.PI),r=Math.max(W,H)*_fRn(.55,.95),x=cx+_fRn(-.3,.3)*W,y=H*.45+_fRn(-.3,.3)*H;return{t0:.58+i*.035,x1:x-Math.cos(a)*r,y1:y-Math.sin(a)*r,x2:x+Math.cos(a)*r,y2:y+Math.sin(a)*r};}),
  th=Array.from({length:10},(_,i)=>({t0:.1+i*.04,a:_fRn(-1.25,-.25),L:_fRn(.55,.95)})),pr=[],hist=[];let burst=false;
  const dk=(c,x,y,sc,o,a)=>{c.save();c.translate(x,y);c.scale(sc,sc);c.translate(-210,-520);c.globalAlpha=a;for(const n of o)c.drawImage(K[n],0,0);c.restore();};
  const kx=T=>{if(T<.62)return cx;if(T<.82)return cx+W*1.3*Math.pow((T-.62)/.2,2);if(T<.95)return -W;if(T<1.15)return cx-W*1.2*Math.pow(1-(T-.95)/.2,2);return cx;};
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='source-over';c.globalAlpha=fade;
  const bg=c.createRadialGradient(cx,H*.4,0,cx,H*.5,Math.max(W,H)*.8);bg.addColorStop(0,'rgba(34,48,86,.78)');bg.addColorStop(1,'rgba(2,4,12,.94)');c.fillStyle=bg;c.fillRect(0,0,W,H);
  const lc=c.createLinearGradient(0,0,0,H);lc.addColorStop(0,'rgba(190,215,255,.18)');lc.addColorStop(.6,'rgba(190,215,255,0)');c.fillStyle=lc;c.fillRect(0,0,W,H);
  const x=kx(T);if(Math.abs(x-(hist.length?hist[hist.length-1].x:x))>W*.8)hist.length=0;hist.push({x});if(hist.length>12)hist.shift();
  c.globalAlpha=fade*_fSm(0,.12,T);
  if(T<.5){dk(c,cx,by,s,['cloth','breast','pauL','pauR','helm'],fade*_fSm(0,.12,T));}
  else{const dash=T>.62&&T<1.15;if(dash){c.globalCompositeOperation='lighter';hist.forEach((h,i)=>{if(i<hist.length-1)dk(c,h.x,by,s,['cloth'],fade*(i/hist.length)*.42);});if(x>-W*.5&&x<W*1.5){c.strokeStyle='rgba(170,200,255,.5)';c.lineWidth=3*k+1;for(let i=0;i<7;i++){const yy=by-(60+i*60)*s,dx=(T<.9?-1:1)*(80+i*20)*k*3;c.beginPath();c.moveTo(x,yy);c.lineTo(x+dx,yy);c.stroke();}}c.globalCompositeOperation='source-over';}
   dk(c,x,by,s,['cloth'],fade);
   if(!burst){burst=true;for(let i=0;i<46;i++){const a=_fR()*6.283,v=_fRn(300,1100)*k;pr.push({x:cx,y:by-300*s,vx:Math.cos(a)*v,vy:Math.sin(a)*v-200*k,l:0});}}
   const u=t-.5/f;for(const p of sh){const px=cx+(p.px-210)*s+p.vx*u,py=by+(p.py-520)*s+p.vy*u+760*k*u*u,al=Math.max(0,1-u/1.1)*fade;if(al<=0)continue;c.save();c.translate(px,py);c.rotate(p.vr*u);c.scale(s,s);c.translate(-p.px,-p.py);c.globalAlpha=al;c.drawImage(K[p.n],0,0);c.restore();}}
  c.globalCompositeOperation='lighter';
  for(const q of th){const u=(T-q.t0)/.12;if(u<0||u>1||T>.5)continue;const hx=cx+120*s,hy=by-100*s,L=Math.max(W,H)*q.L,ex=hx+Math.cos(q.a)*L*(.3+u*.7),ey=hy+Math.sin(q.a)*L*(.3+u*.7),g=c.createLinearGradient(hx,hy,ex,ey);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(235,245,255,.95)');c.globalAlpha=(1-u)*fade;c.strokeStyle=g;c.lineWidth=4*k+1;c.lineCap='round';c.beginPath();c.moveTo(hx,hy);c.lineTo(ex,ey);c.stroke();fxFlare(c,ex,ey,50*k,'#bfe0ff',(1-u)*fade);}
  if(T<.5){const g=(T*5)%1;c.globalAlpha=.7*fade;fxFlare(c,cx-80*s*(1-g*2),by-380*s,60*k,'#fff',Math.sin(g*3.14)*.8);fxFlare(c,cx+100*s*(g*2-1),by-390*s,50*k,'#cfe4ff',Math.sin(g*3.14)*.7);}
  if(T>.5&&T<.8){const u=(T-.5)/.3;c.globalAlpha=(1-u)*fade;c.strokeStyle='#cfe4ff';c.lineWidth=8*(1-u)+1;c.beginPath();c.arc(cx,by-300*s,u*Math.max(W,H)*.7,0,7);c.stroke();fxGlow(c,cx,by-300*s,260*k*(1-u*.5),'#fff',(1-u)*.8*fade);}
  for(let i=pr.length-1;i>=0;i--){const p=pr[i];p.l+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=900*k*dt;if(p.l>.8){pr.splice(i,1);continue;}c.globalAlpha=(1-p.l/.8)*fade;c.strokeStyle='#ffc070';c.lineWidth=2*k+.6;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*.03,p.y-p.vy*.03);c.stroke();}
  for(const q of sl){const u=(T-q.t0)/.2;if(u<0||u>1)continue;const e=Math.min(1,u*2.2),dx=q.x2-q.x1,dy=q.y2-q.y1,g=c.createLinearGradient(q.x1+dx*Math.max(0,e-.5),q.y1+dy*Math.max(0,e-.5),q.x1+dx*e,q.y1+dy*e);g.addColorStop(0,'rgba(180,215,255,0)');g.addColorStop(.85,'rgba(240,248,255,.95)');g.addColorStop(1,'#fff');c.globalAlpha=(1-u)*fade;c.strokeStyle=g;c.lineWidth=(3+6*(1-u))*k;c.shadowColor='#7ab8ff';c.shadowBlur=16;c.beginPath();c.moveTo(q.x1+dx*Math.max(0,e-.5),q.y1+dy*Math.max(0,e-.5));c.lineTo(q.x1+dx*e,q.y1+dy*e);c.stroke();c.shadowBlur=0;}
  if(T>1.12){const u=Math.min(1,(T-1.12)/.18),g=c.createLinearGradient(0,H,W,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'#fff');g.addColorStop(1,'rgba(255,255,255,0)');c.globalAlpha=(1-_fSm(1.25,1.5,T))*fade;c.strokeStyle=g;c.lineWidth=10*k*(1-u*.5)+2;c.shadowColor='#9ad0ff';c.shadowBlur=26;c.beginPath();c.moveTo(-W*.1,H*1.05);c.lineTo(W*1.1,-H*.05);c.stroke();c.shadowBlur=0;c.globalAlpha=Math.max(0,1-Math.abs(T-1.14)/.08)*.6*fade;c.fillStyle='#e8f2ff';c.fillRect(0,0,W,H);}};};
let _plC=null;
function _plMake(){
  if(_plC)return _plC;const P=_mc(360,150),g=P.getContext('2d'),B=_mc(40,90),b=B.getContext('2d');
  const fu=g.createLinearGradient(0,40,0,110);fu.addColorStop(0,'#9aa860');fu.addColorStop(.45,'#6a7a3c');fu.addColorStop(1,'#2e3a1a');
  g.fillStyle=fu;g.strokeStyle='#0a1006';g.lineWidth=3;g.beginPath();g.moveTo(20,74);g.quadraticCurveTo(24,52,64,48);g.lineTo(230,44);g.quadraticCurveTo(300,48,336,72);g.quadraticCurveTo(300,98,230,98);g.lineTo(70,100);g.quadraticCurveTo(26,98,20,74);g.closePath();g.fill();g.stroke();
  g.fillStyle='#4a5a2a';g.beginPath();g.moveTo(34,66);g.lineTo(6,20);g.lineTo(34,22);g.lineTo(70,52);g.closePath();g.fill();g.stroke();g.beginPath();g.moveTo(40,80);g.lineTo(0,86);g.lineTo(6,98);g.lineTo(66,90);g.closePath();g.fill();g.stroke();
  const wg=g.createLinearGradient(0,70,0,140);wg.addColorStop(0,'#566632');wg.addColorStop(1,'#1e2810');g.fillStyle=wg;g.beginPath();g.moveTo(120,84);g.lineTo(178,140);g.lineTo(226,140);g.lineTo(240,84);g.closePath();g.fill();g.stroke();
  g.strokeStyle='rgba(8,14,4,.5)';g.lineWidth=1.6;for(let x=90;x<300;x+=26){g.beginPath();g.moveTo(x,52);g.lineTo(x+4,96);g.stroke();}g.beginPath();g.moveTo(40,76);g.lineTo(330,76);g.stroke();
  const cg=g.createLinearGradient(0,22,0,52);cg.addColorStop(0,'#cfeeff');cg.addColorStop(1,'#2a4a62');g.fillStyle=cg;g.strokeStyle='#0a1006';g.lineWidth=3;g.beginPath();g.moveTo(130,48);g.quadraticCurveTo(150,20,190,24);g.quadraticCurveTo(222,28,236,46);g.closePath();g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.moveTo(142,42);g.quadraticCurveTo(156,28,178,28);g.lineTo(170,42);g.closePath();g.fill();
  g.fillStyle='#d8d8c8';g.beginPath();g.arc(80,74,9,0,7);g.fill();g.strokeStyle='#8a1a1a';g.lineWidth=3;g.beginPath();g.arc(80,74,9,0,7);g.stroke();g.fillStyle='#8a1a1a';g.fillRect(36,62,24,6);
  g.fillStyle='#2a2a30';g.beginPath();g.arc(336,72,12,0,7);g.fill();g.fillStyle='#c8a050';g.beginPath();g.moveTo(340,60);g.lineTo(356,72);g.lineTo(340,84);g.closePath();g.fill();
  const bg=b.createLinearGradient(0,0,40,0);bg.addColorStop(0,'#2a3a2a');bg.addColorStop(.5,'#8a9a8a');bg.addColorStop(1,'#1a241a');b.fillStyle=bg;b.strokeStyle='#05080a';b.lineWidth=2.4;b.beginPath();b.moveTo(20,2);b.quadraticCurveTo(38,24,34,56);b.quadraticCurveTo(28,76,20,84);b.quadraticCurveTo(12,76,6,56);b.quadraticCurveTo(2,24,20,2);b.closePath();b.fill();b.stroke();b.fillStyle='#3a4a3a';b.fillRect(4,72,32,5);b.fillStyle='rgba(255,255,255,.5)';b.fillRect(12,14,4,36);
  return _plC={P,B};}
FXS.strafe=(W,H,D)=>{const k=Math.min(W,H)/600,f=2.3/D,{P,B}=_plMake(),pw=W*.82,ps=pw/360,gy=H*.9,tr=[],bm=[],ex=[],sm=[],db=[],bt=[.5,.78,1.02];let nt=0,nb=0,shk=0;
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t),u=Math.min(1,T/1.5),px=-pw*.5+(W+pw)*u,py=H*.2+Math.sin(T*4)*5*k;c.globalCompositeOperation='source-over';c.globalAlpha=fade;
  const sx=shk>0?_fRn(-1,1)*shk:0,sy=shk>0?_fRn(-1,1)*shk:0;shk=Math.max(0,shk-dt*60);c.save();c.translate(sx,sy);
  const sk=c.createLinearGradient(0,0,0,H);sk.addColorStop(0,'rgba(8,14,30,.92)');sk.addColorStop(.7,'rgba(56,36,40,.72)');sk.addColorStop(1,'rgba(14,10,8,.95)');c.fillStyle=sk;c.fillRect(-20,-20,W+40,H+40);
  c.fillStyle='rgba(8,6,4,.95)';c.fillRect(-20,gy,W+40,H);c.fillStyle='#050404';c.beginPath();c.moveTo(-20,gy);for(let x=-20;x<=W+20;x+=14)c.lineTo(x,gy-10*k-((x*7)%13)*k);c.lineTo(W+20,gy);c.fill();
  c.globalCompositeOperation='lighter';c.strokeStyle='#6dff9a';c.lineWidth=1.6;for(let i=0;i<3;i++){const q=(T*.9+i/3)%1;c.globalAlpha=(1-q)*.35*fade;c.beginPath();c.arc(px,py,q*W*.55,0,7);c.stroke();}
  nt+=dt;if(T>.3&&T<1.0&&nt>.022){nt=0;const gx=px+ps*40,gyy=py+ps*22;tr.push({x:gx,y:gyy,vx:_fRn(120,260)*k,vy:_fRn(1200,1700)*k});if(Math.random()<.5)tr.push({x:gx+pw*.08,y:gyy,vx:_fRn(100,220)*k,vy:_fRn(1200,1700)*k});}
  if(T>.3&&T<1.0){c.globalAlpha=(.5+Math.random()*.5)*fade;fxFlare(c,px+ps*40,py+ps*22,36*k,'#ffd060',1);}
  for(let i=tr.length-1;i>=0;i--){const q=tr[i];q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.y>gy){for(let j=0;j<4;j++)db.push({x:q.x,y:gy,vx:_fRn(-160,160)*k,vy:-_fRn(100,360)*k,l:0});ex.push({x:q.x,y:gy,l:0,t:0});tr.splice(i,1);continue;}const g=c.createLinearGradient(q.x,q.y,q.x-q.vx*.05,q.y-q.vy*.05);g.addColorStop(0,'rgba(255,240,150,1)');g.addColorStop(1,'rgba(255,140,40,0)');c.globalAlpha=fade;c.strokeStyle=g;c.lineWidth=5*k+1;c.beginPath();c.moveTo(q.x,q.y);c.lineTo(q.x-q.vx*.06,q.y-q.vy*.06);c.stroke();}
  while(nb<bt.length&&T>bt[nb]){bm.push({x:px-ps*10,y:py+ps*30,vx:W*.22,vy:0,r:.2});nb++;}
  c.globalCompositeOperation='source-over';for(let i=bm.length-1;i>=0;i--){const q=bm[i];q.vy+=1500*k*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.r=Math.atan2(q.vy,q.vx)-1.57;if(q.y>gy){ex.push({x:q.x,y:gy,l:0,t:1});shk=18*k;for(let j=0;j<18;j++)db.push({x:q.x,y:gy,vx:_fRn(-420,420)*k,vy:-_fRn(300,900)*k,l:0,b:1});for(let j=0;j<10;j++)sm.push({x:q.x+_fRn(-30,30)*k,y:gy,vx:_fRn(-30,30)*k,vy:-_fRn(60,160)*k,l:0});bm.splice(i,1);continue;}c.save();c.translate(q.x,q.y);c.rotate(q.r);c.globalAlpha=fade;c.drawImage(B,-16*k,-36*k,32*k,72*k);c.restore();}
  for(let i=sm.length-1;i>=0;i--){const q=sm[i];q.l+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.l>1.4){sm.splice(i,1);continue;}fxGlow(c,q.x,q.y,(30+q.l*70)*k,'#3a3028',(1-q.l/1.4)*.55*fade);}
  c.globalCompositeOperation='lighter';for(let i=ex.length-1;i>=0;i--){const e=ex[i];e.l+=dt;const L=e.t?.7:.18,v=e.l/L;if(v>=1){ex.splice(i,1);continue;}if(e.t){fxGlow(c,e.x,e.y-30*k,(70+260*v)*k,'#fff0b0',(1-v)*.9*fade);fxGlow(c,e.x,e.y-20*k,(60+200*v)*k,'#ff7a20',(1-v)*.8*fade);c.strokeStyle='#ffb050';c.globalAlpha=(1-v)*fade;c.lineWidth=5*(1-v)+1;c.beginPath();c.ellipse(e.x,e.y,v*W*.5,v*40*k,0,0,7);c.stroke();}else fxGlow(c,e.x,e.y,24*k*(1+v),'#ffd890',(1-v)*.9*fade);}
  c.globalCompositeOperation='source-over';for(let i=db.length-1;i>=0;i--){const q=db[i];q.l+=dt;q.vy+=1100*k*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.l>1.1||q.y>gy+4){db.splice(i,1);continue;}c.globalAlpha=(1-q.l/1.1)*fade;c.fillStyle=q.b?'#2a1e14':'#6a5038';c.fillRect(q.x,q.y,(q.b?5:3)*k+1,(q.b?5:3)*k+1);}
  c.globalAlpha=fade;c.save();c.translate(px,py);c.scale(ps,ps);c.rotate(Math.sin(T*3)*.02);c.translate(-180,-75);c.drawImage(P,0,0);c.restore();
  c.globalCompositeOperation='lighter';c.globalAlpha=.55*fade;const pg=c.createRadialGradient(px+ps*156,py,0,px+ps*156,py,ps*26);pg.addColorStop(0,'rgba(255,255,255,.55)');pg.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=pg;c.beginPath();c.ellipse(px+ps*156,py,ps*9*Math.abs(Math.cos(T*70))+ps*3,ps*30,0,0,7);c.fill();
  c.restore();c.globalCompositeOperation='source-over';};};

// ---- リアル版の演出：蹴り弾・潜り込み（リーチ）／静止する雨（上がり）----
let _bu=null;
function _buMake(){
  if(_bu)return _bu;const cv=_mc(120,44),g=cv.getContext('2d');
  const br=g.createLinearGradient(0,6,0,38);br.addColorStop(0,'#fff4c0');br.addColorStop(.3,'#e2b84e');br.addColorStop(.7,'#9a6a1a');br.addColorStop(1,'#4a2e08');
  g.fillStyle=br;g.strokeStyle='#1a1004';g.lineWidth=2.4;g.beginPath();g.moveTo(4,10);g.lineTo(68,10);g.quadraticCurveTo(104,12,116,22);g.quadraticCurveTo(104,32,68,34);g.lineTo(4,34);g.closePath();g.fill();g.stroke();
  const cp=g.createLinearGradient(0,6,0,38);cp.addColorStop(0,'#ffe0b0');cp.addColorStop(.4,'#d27a3a');cp.addColorStop(1,'#5a2410');g.fillStyle=cp;g.beginPath();g.moveTo(70,10);g.quadraticCurveTo(104,12,116,22);g.quadraticCurveTo(104,32,70,34);g.closePath();g.fill();g.stroke();
  g.strokeStyle='rgba(60,36,6,.7)';g.lineWidth=2;g.beginPath();g.moveTo(68,10);g.lineTo(68,34);g.moveTo(10,16);g.lineTo(10,28);g.stroke();g.fillStyle='rgba(255,255,255,.75)';g.fillRect(14,13,48,3);
  return _bu=cv;}
FXS.kickshot=(W,H,D)=>{const k=Math.min(W,H)/600,f=2.05/D,N=7,cx=W/2,cy=H*.46,BU=_buMake(),cols=['#e84a4a','#f0a030','#e8d040','#4ab868','#4a98e8','#a860e0'],
  pts=[{x:W*.06,y:H*.2}],sp=[],tr=[];for(let i=1;i<N-1;i++)pts.push({x:W*_fRn(.12,.88),y:H*_fRn(.12,.82)});pts.push({x:cx,y:cy});
  const spirit=(c,x,y,s,col,ph,a)=>{c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha=a;c.lineCap='round';c.lineJoin='round';const kick=Math.sin(Math.min(1,ph)*3.14)*1;c.strokeStyle='#0a0a12';c.lineWidth=8;c.beginPath();c.moveTo(-4,12);c.lineTo(-6,28);c.moveTo(4,12);c.lineTo(14+kick*12,24-kick*14);c.stroke();c.strokeStyle='#3a2a1a';c.lineWidth=4.6;c.beginPath();c.moveTo(-4,12);c.lineTo(-6,28);c.moveTo(4,12);c.lineTo(14+kick*12,24-kick*14);c.stroke();
   const bg=c.createLinearGradient(-9,-4,9,14);bg.addColorStop(0,col);bg.addColorStop(1,'#222');c.fillStyle=bg;c.strokeStyle='#0a0a12';c.lineWidth=2.4;c.beginPath();c.roundRect?c.roundRect(-9,-4,18,18,5):c.rect(-9,-4,18,18);c.fill();c.stroke();c.strokeStyle='#0a0a12';c.lineWidth=7;c.beginPath();c.moveTo(-9,0);c.lineTo(-17,8+kick*-6);c.moveTo(9,0);c.lineTo(17,-4-kick*8);c.stroke();c.strokeStyle=col;c.lineWidth=3.4;c.beginPath();c.moveTo(-9,0);c.lineTo(-17,8+kick*-6);c.moveTo(9,0);c.lineTo(17,-4-kick*8);c.stroke();
   const hg=c.createRadialGradient(-3,-14,2,0,-11,12);hg.addColorStop(0,'#ffe8cc');hg.addColorStop(1,'#c8885a');c.fillStyle=hg;c.beginPath();c.arc(0,-11,10,0,7);c.fill();c.stroke();c.fillStyle=col;c.beginPath();c.moveTo(-11,-12);c.quadraticCurveTo(0,-30,11,-12);c.lineTo(15,-10);c.lineTo(-15,-10);c.closePath();c.fill();c.stroke();c.fillStyle='#000';c.beginPath();c.arc(-3.4,-10,1.3,0,7);c.arc(3.4,-10,1.3,0,7);c.fill();c.restore();};
  let hx=pts[0].x,hy=pts[0].y,ang=0,shk=0,ring=[];
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t),Tm=1.5,p=Math.min(N-1,T/Tm*(N-1)),ip=Math.floor(p);c.globalCompositeOperation='source-over';c.globalAlpha=fade;
  const sx=shk>0?_fRn(-1,1)*shk:0,sy=shk>0?_fRn(-1,1)*shk:0;shk=Math.max(0,shk-dt*50);c.save();c.translate(sx,sy);
  const bg=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.75);bg.addColorStop(0,'rgba(40,20,60,.82)');bg.addColorStop(1,'rgba(4,2,10,.95)');c.fillStyle=bg;c.fillRect(-20,-20,W+40,H+40);
  if(ip<N-1){const a=pts[ip],b=pts[ip+1],q=p-ip;hx=a.x+(b.x-a.x)*q;hy=a.y+(b.y-a.y)*q;ang=Math.atan2(b.y-a.y,b.x-a.x);}else{hx=cx;hy=cy;}
  tr.push({x:hx,y:hy});if(tr.length>46)tr.shift();
  c.globalCompositeOperation='lighter';for(let i=1;i<tr.length;i++){const q=i/tr.length;c.globalAlpha=q*.5*fade;c.strokeStyle='#bcd0ff';c.lineWidth=(14*q+2)*k;c.lineCap='round';c.beginPath();c.moveTo(tr[i-1].x,tr[i-1].y);c.lineTo(tr[i].x,tr[i].y);c.stroke();c.globalAlpha=q*.95*fade;c.strokeStyle='#fff6d0';c.lineWidth=(3*q+.5)*k;c.stroke();}
  for(let i=1;i<N-1;i++){if(p<i)continue;const u=T-i/(N-1)*Tm;if(u<0)continue;if(u<.02&&!pts[i].k){pts[i].k=1;shk=7*k;for(let j=0;j<10;j++){const a=_fR()*6.283,v=_fRn(150,600)*k;sp.push({x:pts[i].x,y:pts[i].y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:0});}ring.push({x:pts[i].x,y:pts[i].y,l:0});}c.globalCompositeOperation='lighter';fxFlare(c,pts[i].x,pts[i].y,90*k,cols[i%6],Math.max(0,1-u*2.2)*fade);}
  c.globalCompositeOperation='source-over';for(let i=1;i<N-1;i++){if(p<i-.35)continue;const u=T-i/(N-1)*Tm+.12;c.save();spirit(c,pts[i].x-40*k,pts[i].y+22*k,2.3*k*Math.min(1,Math.max(0,u*6)),cols[i%6],u*4,Math.min(1,u*8)*Math.max(0,1-Math.max(0,u-.5)*1.6)*fade);c.restore();}
  c.globalCompositeOperation='lighter';c.lineWidth=2;for(let i=ring.length-1;i>=0;i--){const r=ring[i];r.l+=dt;if(r.l>.45){ring.splice(i,1);continue;}c.strokeStyle='#ffe9b0';c.globalAlpha=(1-r.l/.45)*.8*fade;c.beginPath();c.arc(r.x,r.y,r.l*500*k,0,7);c.stroke();}
  for(let i=sp.length-1;i>=0;i--){const q=sp[i];q.l+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.l>.5){sp.splice(i,1);continue;}c.globalAlpha=(1-q.l/.5)*fade;c.strokeStyle='#ffd070';c.lineWidth=1.8*k+.5;c.beginPath();c.moveTo(q.x,q.y);c.lineTo(q.x-q.vx*.03,q.y-q.vy*.03);c.stroke();}
  c.globalCompositeOperation='source-over';if(T<Tm){c.save();c.translate(hx,hy);c.rotate(ang+Math.sin(T*50)*.03);c.globalAlpha=fade;const bs=k*1.05;c.drawImage(BU,-60*bs,-22*bs,120*bs,44*bs);c.restore();c.globalCompositeOperation='lighter';fxGlow(c,hx,hy,30*k,'#ffd890',.5*fade);}
  if(T>=Tm){const u=T-Tm;if(!pts[N-1].k){pts[N-1].k=1;shk=22*k;for(let j=0;j<36;j++){const a=_fR()*6.283,v=_fRn(200,900)*k;sp.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:0});}ring.push({x:cx,y:cy,l:0});}
   c.globalCompositeOperation='lighter';fxGlow(c,cx,cy,300*k*(1-_fSm(0,.5,u)*.5),'#ffd890',(1-_fSm(0,.5,u))*.9*fade);c.globalCompositeOperation='source-over';c.globalAlpha=fade;c.strokeStyle='rgba(20,10,4,.9)';c.lineWidth=2.4*k+1;for(let i=0;i<12;i++){const a=i/12*6.283+i*.4,L=(40+(i%4)*34)*k*Math.min(1,u*8);c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*L*.5+Math.sin(a*3)*4,cy+Math.sin(a)*L*.5);c.lineTo(cx+Math.cos(a+.1)*L,cy+Math.sin(a+.1)*L);c.stroke();}
   const hg=c.createRadialGradient(cx,cy,0,cx,cy,22*k);hg.addColorStop(0,'#000');hg.addColorStop(.7,'#150a04');hg.addColorStop(1,'rgba(40,20,8,0)');c.fillStyle=hg;c.beginPath();c.arc(cx,cy,22*k,0,7);c.fill();}
  c.restore();};};
FXS.dive=(W,H,D)=>{const k=Math.min(W,H)/600,f=2.05/D,cx=W/2,cy=H*.62,PR=W*.42,sp=[],ch=Array.from({length:16},()=>({a:_fRn(0,6.283),r:_fRn(.7,1.1)*Math.max(W,H)*.6,ph:_fRn(0,1)})),dr=[];let sdone=false;
  const fig=(c,x,y,s,a)=>{c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha=a;const bd=c.createLinearGradient(-90,0,90,0);bd.addColorStop(0,'#0a1c2a');bd.addColorStop(.45,'#3a6a86');bd.addColorStop(.6,'#8ac8e0');bd.addColorStop(1,'#08141e');c.fillStyle=bd;c.strokeStyle='#04080e';c.lineWidth=4;c.beginPath();c.moveTo(-110,300);c.quadraticCurveTo(-112,60,-34,38);c.lineTo(34,38);c.quadraticCurveTo(112,60,110,300);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(-76,70);c.quadraticCurveTo(-170,130,-190,250);c.lineTo(-150,262);c.quadraticCurveTo(-130,160,-70,110);c.closePath();c.fill();c.stroke();
   const hg=c.createRadialGradient(-14,-44,6,0,-30,64);hg.addColorStop(0,'#d8f0fa');hg.addColorStop(.5,'#6a9ab4');hg.addColorStop(1,'#0e2230');c.fillStyle=hg;c.beginPath();c.ellipse(0,-26,50,58,0,0,7);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-20,-52,10,22,.5,0,7);c.fill();c.restore();};
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t),A=_fSm(0,.25,T)*fade;c.globalCompositeOperation='source-over';c.globalAlpha=A;
  const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'rgba(2,8,14,.94)');bg.addColorStop(1,'rgba(6,26,36,.92)');c.fillStyle=bg;c.fillRect(0,0,W,H);
  const pr=Math.min(1,T/.4),rx=PR*pr+20*k,ry=rx*.3;c.globalAlpha=A;
  const pg=c.createRadialGradient(cx,cy,0,cx,cy,rx);pg.addColorStop(0,'#010608');pg.addColorStop(.75,'#06303f');pg.addColorStop(1,'#0e5a70');c.fillStyle=pg;c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,7);c.fill();
  c.globalCompositeOperation='lighter';fxGlow(c,cx,cy+8*k,rx*1.2,'#2ae0ff',.2*A);c.strokeStyle='rgba(150,240,255,.5)';c.lineWidth=1.4;for(let i=0;i<5;i++){c.globalAlpha=A*.25;c.beginPath();c.ellipse(cx+(i-2)*rx*.12,cy-ry*.35,rx*(.5-.05*i),ry*.18,0,3.3,6.1);c.stroke();}
  const rise=Math.pow(Math.sin(3.14*Math.min(1,Math.max(0,(T-.3)/1.4))),.75),fs=k*1.6,fy=cy+(330-560*rise)*fs;
  c.globalCompositeOperation='source-over';c.save();c.beginPath();c.rect(0,0,W,cy);c.clip();fig(c,cx,fy,fs,A*.97);c.globalCompositeOperation='lighter';const cg=c.createRadialGradient(cx,fy+150*fs,0,cx,fy+150*fs,90*fs);const gl=.4*Math.max(0,Math.sin((T-.9)*9))*(T>.9&&T<1.35?1:0);cg.addColorStop(0,`rgba(255,170,60,${gl})`);cg.addColorStop(1,'rgba(255,170,60,0)');c.fillStyle=cg;c.fillRect(0,fy,W,300*fs);for(const s of[-1,1])fxGlow(c,cx+s*20*fs,fy-28*fs,16*fs*1.4,'#38e8ff',.95*A);c.restore();
  c.globalCompositeOperation='lighter';c.lineCap='round';c.strokeStyle='#bff4ff';for(let i=0;i<4;i++){const q=(T*.85+i/4)%1;c.globalAlpha=(1-q)*.85*A;c.lineWidth=(5*(1-q)+1)*k;c.beginPath();c.ellipse(cx,cy,rx*(.25+q*1.0),ry*(.25+q*1.0),0,0,7);c.stroke();c.strokeStyle='#04141c';c.globalAlpha=(1-q)*.35*A;c.lineWidth=2*k;c.beginPath();c.ellipse(cx,cy+2,rx*(.25+q*1.0),ry*(.25+q*1.0),0,0,3.14);c.stroke();c.strokeStyle='#bff4ff';}
  c.strokeStyle='#d8fbff';c.lineWidth=2.4*k;c.globalAlpha=.8*A;c.beginPath();c.ellipse(cx,cy,rx*.9*(.8+.2*rise),ry*.9*(.8+.2*rise),0,.15,3.0);c.stroke();
  if((T>.32&&T<.38||T>1.78&&T<1.84)&&!(T>1)==!sdone){sdone=T>1;for(let j=0;j<26;j++){const a=_fRn(-3,-.14),v=_fRn(240,700)*k;dr.push({x:cx+_fRn(-1,1)*rx*.3,y:cy,vx:Math.cos(a)*v*.5,vy:Math.sin(a)*v,l:0});}}
  c.globalCompositeOperation='source-over';for(let i=dr.length-1;i>=0;i--){const q=dr[i];q.l+=dt;q.vy+=1300*k*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.y>cy+8||q.l>1.2){dr.splice(i,1);continue;}c.globalAlpha=A;const rg=c.createRadialGradient(q.x-1,q.y-1,0,q.x,q.y,5*k+1);rg.addColorStop(0,'#fff');rg.addColorStop(.6,'#8ae0f0');rg.addColorStop(1,'rgba(40,140,170,.3)');c.fillStyle=rg;c.beginPath();c.arc(q.x,q.y,(4*k+1.5),0,7);c.fill();}
  if(T>.8&&T<1.5){c.globalCompositeOperation='lighter';for(const q of ch){const e=((T-.8)/.7+q.ph)%1,r=q.r*(1-e),x=cx+Math.cos(q.a)*r,y=fy+120*fs+Math.sin(q.a)*r*.5,x0=cx+Math.cos(q.a)*(r+60*k),y0=fy+120*fs+Math.sin(q.a)*(r+60*k)*.5,g=c.createLinearGradient(x0,y0,x,y);g.addColorStop(0,'rgba(255,150,40,0)');g.addColorStop(1,'rgba(255,210,120,.95)');c.globalAlpha=Math.sin(e*3.14)*.9*A;c.strokeStyle=g;c.lineWidth=3*k+.8;c.beginPath();c.moveTo(x0,y0);c.lineTo(x,y);c.stroke();}}};};
FXS.stillrain=(W,H,D)=>{const k=Math.min(W,H)/600,f=2.4/D,cx=W/2,cy=H*.5,N=170,dr=Array.from({length:N},(_,i)=>{const z=i<90?0:(i<150?1:2);return{x:_fR()*W,y0:_fRn(-.3,.9)*H,z,v:_fRn(900,1500)*k*(1+z*.4),L:_fRn(14,30)*k*(1+z*.5),ph:_fR()*6.28};}),bl=[],rp=[];let nb=0,frz=-1;
  const tear=(c,x,y,s,a)=>{c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha=a;c.beginPath();c.moveTo(0,-9);c.bezierCurveTo(3,-3,6,2,6,5);c.bezierCurveTo(6,10,-6,10,-6,5);c.bezierCurveTo(-6,2,-3,-3,0,-9);c.closePath();const g=c.createRadialGradient(-1.5,3,.5,0,3,7);g.addColorStop(0,'rgba(240,250,255,.2)');g.addColorStop(.7,'rgba(150,200,240,.55)');g.addColorStop(1,'rgba(240,250,255,.95)');c.fillStyle=g;c.fill();c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.7;c.stroke();c.fillStyle='#fff';c.beginPath();c.ellipse(-2.2,2,1.1,2.6,.3,0,7);c.fill();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(2.4,7,.9,0,7);c.fill();c.restore();};
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t),A=_fSm(0,.2,T)*fade,tf=.55,ur=1.78,rr=Math.min(1,Math.max(0,(T-tf)/.25))*Math.hypot(W,H);c.globalCompositeOperation='source-over';c.globalAlpha=A;
  const bg=c.createLinearGradient(0,0,0,H);bg.addColorStop(0,'rgba(14,22,40,.94)');bg.addColorStop(.6,'rgba(40,56,84,.9)');bg.addColorStop(1,'rgba(10,14,26,.95)');c.fillStyle=bg;c.fillRect(0,0,W,H);
  c.globalCompositeOperation='lighter';fxGlow(c,cx,H*.78,W*.8,'#8aa8d0',.16*A);const zoom=T>tf?1+.05*Math.min(1,(T-tf)/1.2):1;
  for(const d of dr){const s=zoom+(d.z*.05)*Math.min(1,Math.max(0,T-tf)),sp=T<tf?0:1,y=T<tf?d.y0+d.v*T:(T<ur?d.y0+d.v*tf:d.y0+d.v*tf+d.v*.8*(T-ur)),x=cx+(d.x-cx)*s,yy=cy+(y-cy)*s,dist=Math.hypot(d.x-cx,y-cy),frozen=T>tf&&dist<rr&&T<ur;
   if(T<tf||(!frozen&&T>=tf&&dist>=rr)||T>=ur){const L=d.L*(T>=ur?1.4:2.2);c.globalAlpha=(.28+d.z*.16)*A;c.strokeStyle='#bcd8f4';c.lineWidth=(1.2+d.z*.7)*k+.3;c.beginPath();c.moveTo(x,yy-L);c.lineTo(x,yy);c.stroke();}
   else{c.globalCompositeOperation='source-over';tear(c,x,yy,(.55+d.z*.5)*k*2.3+.3,(.55+d.z*.25)*A);c.globalCompositeOperation='lighter';const gl=Math.max(0,Math.sin(d.ph+T*4));if(gl>.85)fxFlare(c,x,yy,(10+d.z*8)*k,'#fff',(gl-.85)*5*A);}}
  if(T>tf&&T<tf+.5){c.strokeStyle='#e8f4ff';const u=(T-tf)/.5;for(let i=0;i<3;i++){c.globalAlpha=(1-u)*.8*A/(i+1);c.lineWidth=(10-i*3)*(1-u)*k+1;c.beginPath();c.arc(cx,cy,rr-i*14*k,0,7);c.stroke();}c.globalAlpha=Math.max(0,1-u*2)*.5*A;c.fillStyle='#dfeeff';c.fillRect(0,0,W,H);}
  if(T>.9&&T<ur-.1&&T>nb){nb=T+.2;const q=dr[90+Math.floor(_fR()*60)];bl.push({x:q.x,y:q.y0+q.v*tf,dir:_fR()<.5?-1:1,t0:T});}
  for(let i=bl.length-1;i>=0;i--){const b=bl[i],u=T-b.t0;if(u>.35){bl.splice(i,1);continue;}const e=Math.min(1,u*4),x=b.x+b.dir*e*W*1.5,L=220*k*Math.min(1,u*6),g=c.createLinearGradient(x-b.dir*L,0,x,0);g.addColorStop(0,'rgba(190,225,255,0)');g.addColorStop(1,'rgba(255,255,255,1)');c.globalAlpha=(1-u/.35)*A;c.strokeStyle=g;c.lineWidth=3.4*k+.8;c.lineCap='round';c.shadowColor='#9ad0ff';c.shadowBlur=14;c.beginPath();c.moveTo(x-b.dir*L,b.y);c.lineTo(x,b.y);c.stroke();c.shadowBlur=0;fxFlare(c,x,b.y,30*k,'#cfe8ff',(1-u/.35)*.9*A);}
  if(T>.7&&T<ur){const u=Math.min(1,(T-.7)/(ur-.7)),x=W*(.14+.72*u),y=H*(.8-.4*u),sw=Math.sin(T*9);for(let i=0;i<6;i++){const q=Math.min(1,Math.max(0,u*6-i)),sx=W*(.14+.72*i/6),sy=H*(.8-.4*i/6)+8*k;if(q>0){fxGlow(c,sx,sy,26*k,'#bfe2ff',.6*Math.max(0,1-(u*6-i)/3)*A);c.globalCompositeOperation='source-over';tear(c,sx,sy,1.3*k+.4,.9*A);c.globalCompositeOperation='lighter';}}
   c.globalCompositeOperation='source-over';c.save();c.translate(x,y);c.scale(k*1.25,k*1.25);c.globalAlpha=(.55+.2*Math.sin(T*7))*A;const fg=c.createLinearGradient(-14,-60,14,0);fg.addColorStop(0,'rgba(190,225,255,.9)');fg.addColorStop(1,'rgba(40,70,120,.45)');c.fillStyle=fg;c.strokeStyle='rgba(220,240,255,.9)';c.lineWidth=1.8;c.beginPath();c.arc(0,-58,10,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(-12,-46);c.lineTo(12,-46);c.lineTo(9,-14);c.lineTo(-9,-14);c.closePath();c.fill();c.stroke();c.lineCap='round';c.lineWidth=8;c.strokeStyle='rgba(120,170,220,.7)';c.beginPath();c.moveTo(-3,-14);c.lineTo(-3+sw*8,2);c.moveTo(3,-14);c.lineTo(3-sw*8,2);c.stroke();c.globalCompositeOperation='lighter';c.strokeStyle='#fff';c.lineWidth=1;for(let i=-1;i<=1;i++){const yy=-60+((T*140+i*20)%60);c.globalAlpha=.5*A;c.beginPath();c.moveTo(i*6,yy);c.lineTo(i*6,yy+10);c.stroke();}c.restore();}};};

// ---- リアル版の演出：削り取る／ジッパー／絶対零度（リーチ）----
FXS.scoop=(W,H,D)=>{const k=Math.min(W,H)/600,f=2.05/D,cy=H*.46,ax=W*.27,bx=W*.73,R0=Math.min(W*.24,180*k),
  sh=Array.from({length:46},(_,i)=>({a:i/46*6.283+_fRn(-.07,.07),r:_fRn(1.03,1.32),s:_fRn(10,34)*k,rot:_fR()*6.28,vr:_fRn(-2.5,2.5)})),
  sr=Array.from({length:120},()=>({a:_fR()*6.283,r:_fRn(.7,2.6),ph:_fR(),v:_fRn(.8,1.6),s:_fRn(1.2,3.6)*k})),
  cr=Array.from({length:16},()=>({a:_fR()*6.283,l:_fRn(.25,.8),w:_fRn(.4,1),j:_fR()*9}));
  const hole=(c,x,r,hue,u,fade,T)=>{if(r<3)return;const edge=rr=>{c.beginPath();for(let i=0;i<=72;i++){const a=i/72*6.283,w=1+.035*Math.sin(a*7+T*9)+.02*Math.sin(a*13-T*7),px=x+Math.cos(a)*rr*w,py=cy+Math.sin(a)*rr*w;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();};
   c.globalCompositeOperation='lighter';fxGlow(c,x,cy,r*1.7,hue,.5*fade);c.globalCompositeOperation='source-over';c.globalAlpha=.97*fade;const g=c.createRadialGradient(x,cy,0,x,cy,r);g.addColorStop(0,'#000');g.addColorStop(.62,'#04010c');g.addColorStop(1,'#1c0c40');c.fillStyle=g;edge(r);c.fill();
   c.strokeStyle='rgba(130,90,255,.3)';c.lineWidth=1.4;for(let i=1;i<6;i++){c.globalAlpha=fade*(.9-i*.12);edge(r*(1-i*.15));c.stroke();}
   c.globalCompositeOperation='lighter';for(const[col,off,wd]of[['rgba(255,60,120,.7)',-2.4,2.4],['rgba(60,200,255,.7)',2.4,2.4],['rgba(255,255,255,.95)',0,3.2]]){c.strokeStyle=col;c.lineWidth=wd*k+.6;c.globalAlpha=fade;c.save();c.translate(off*k,0);edge(r);c.stroke();c.restore();}
   c.strokeStyle='rgba(235,225,255,.8)';c.lineWidth=1.4;for(const q of cr){const L=r*q.l*u;if(L<4)continue;c.globalAlpha=fade*q.w*.7;c.beginPath();c.moveTo(x+Math.cos(q.a)*r,cy+Math.sin(q.a)*r);for(let s=1;s<=5;s++){const aa=q.a+Math.sin(q.j+s*1.7)*.18,dd=L*s/5;c.lineTo(x+Math.cos(aa)*(r+dd),cy+Math.sin(aa)*(r+dd));}c.stroke();}
   for(const s of sh){const rr=r*(s.r+.15*u),px=x+Math.cos(s.a)*rr,py=cy+Math.sin(s.a)*rr;c.save();c.translate(px,py);c.rotate(s.rot+s.vr*T);c.globalAlpha=fade*.6*Math.min(1,u*2);const sg=c.createLinearGradient(-s.s,-s.s,s.s,s.s);sg.addColorStop(0,'rgba(255,255,255,.9)');sg.addColorStop(.5,'rgba(150,170,255,.25)');sg.addColorStop(1,'rgba(220,200,255,.7)');c.fillStyle=sg;c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=1;c.beginPath();c.moveTo(-s.s,s.s*.3);c.lineTo(0,-s.s);c.lineTo(s.s*.8,s.s*.5);c.closePath();c.fill();c.stroke();c.restore();}};
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='source-over';c.globalAlpha=fade;
  const dk=c.createRadialGradient(W/2,cy,0,W/2,cy,Math.max(W,H)*.8);dk.addColorStop(0,'rgba(20,10,40,.35)');dk.addColorStop(1,'rgba(4,2,12,.85)');c.fillStyle=dk;c.fillRect(0,0,W,H);
  const rA=R0*_fSm(.05,.5,T)*(1-_fSm(.62,.92,T)),rB=R0*1.15*_fSm(.85,1.2,T)*(1-_fSm(1.5,1.95,T));
  c.globalCompositeOperation='lighter';if(T<.9){const q=_fSm(0,.6,T);for(const p of sr){const ph=(p.ph+T*1.4*p.v)%1,rad=R0*p.r*(1-ph)*q;if(rad<R0*.3*q)continue;const a=p.a+ph*2.2;c.globalAlpha=Math.sin(ph*3.14)*.8*fade;c.strokeStyle=p.s>2.4*k?'#efe2ff':'#a8e0ff';c.lineWidth=p.s*.6;c.beginPath();c.moveTo(ax+Math.cos(a-.12)*(rad+10*k),cy+Math.sin(a-.12)*(rad+10*k)*.9);c.lineTo(ax+Math.cos(a)*rad,cy+Math.sin(a)*rad*.9);c.stroke();}}
  hole(c,ax,rA,'#9a6aff',_fSm(.05,.5,T),fade,T);hole(c,bx,rB,'#4ac8ff',_fSm(.85,1.2,T),fade,T);
  c.globalCompositeOperation='lighter';const s=_fSm(.58,.82,T);if(s>0&&T<1.3){const e=ax+(bx-ax)*s,al=(1-_fSm(.9,1.3,T))*fade,g=c.createLinearGradient(ax,0,e,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.7,'rgba(220,210,255,.9)');g.addColorStop(1,'#fff');c.globalAlpha=al;c.strokeStyle=g;c.lineWidth=5*k+1;c.lineCap='round';c.shadowColor='#b8a0ff';c.shadowBlur=18;c.beginPath();c.moveTo(ax,cy);c.lineTo(e,cy);c.stroke();c.shadowBlur=0;fxFlare(c,e,cy,110*k,'#d8c8ff',al);}
  const w=(T-.9)/.7;if(w>0&&w<1){c.strokeStyle='#fff';for(let i=0;i<3;i++){const ww=w-i*.1;if(ww<0)continue;c.globalAlpha=(1-ww)*fade*.8;c.lineWidth=(7*(1-ww)+1)*k;c.beginPath();c.arc(bx,cy,ww*W*.55,0,7);c.stroke();}}
  if(T>.88){const q=T-.88;if(q<1.1)for(const p of sr){const d=q*p.r*260*k;c.globalAlpha=Math.max(0,1-q/1.1)*fade;c.fillStyle=p.s>2.4*k?'#efe2ff':'#a8e0ff';c.fillRect(bx+Math.cos(p.a)*d,cy+Math.sin(p.a)*d*.85,p.s*1.2,p.s*1.2);}}
  const fl=Math.max(0,1-Math.abs(T-.88)/.1);if(fl>0){c.globalAlpha=fl*.55*fade;c.fillStyle='#e6dcff';c.fillRect(0,0,W,H);}};};
// ---- ジッパー（軽量・リアル版）：歯・スライダー・テープは最初に1回だけ描いて使い回す ----
let _zpC=null;
function _zpMake(){
  if(_zpC)return _zpC;
  const gold=(g,x0,y0,x1,y1)=>{const q=g.createLinearGradient(x0,y0,x1,y1);q.addColorStop(0,'#fff8c8');q.addColorStop(.35,'#e0b440');q.addColorStop(.7,'#a8741a');q.addColorStop(1,'#5a3a08');return q;};
  const A=_mc(44,64),a=A.getContext('2d');a.fillStyle=gold(a,0,0,44,0);a.strokeStyle='#2a1a04';a.lineWidth=2.4;a.lineJoin='round';a.beginPath();a.moveTo(12,0);a.lineTo(32,0);a.lineTo(32,30);a.quadraticCurveTo(44,34,42,46);a.quadraticCurveTo(40,62,22,62);a.quadraticCurveTo(4,62,2,46);a.quadraticCurveTo(0,34,12,30);a.closePath();a.fill();a.stroke();a.fillStyle='rgba(255,255,255,.55)';a.beginPath();a.ellipse(13,44,3.4,11,0,0,7);a.fill();a.strokeStyle='rgba(60,36,6,.7)';a.lineWidth=1.8;a.beginPath();a.moveTo(22,34);a.lineTo(22,56);a.stroke();
  const B=_mc(44,64),b=B.getContext('2d');b.translate(0,64);b.scale(1,-1);b.drawImage(A,0,0);
  const S=_mc(140,120),s=S.getContext('2d');s.lineJoin='round';s.strokeStyle='#1a1004';s.lineWidth=3;s.fillStyle=gold(s,0,10,0,110);s.beginPath();s.moveTo(8,10);s.quadraticCurveTo(0,10,0,22);s.lineTo(0,98);s.quadraticCurveTo(0,110,8,110);s.lineTo(122,84);s.quadraticCurveTo(138,80,138,68);s.lineTo(138,52);s.quadraticCurveTo(138,40,122,36);s.closePath();s.fill();s.stroke();
  s.fillStyle='#120a02';s.beginPath();s.moveTo(2,54);s.lineTo(136,58);s.lineTo(136,62);s.lineTo(2,66);s.closePath();s.fill();s.fillStyle=gold(s,0,30,0,90);s.beginPath();s.roundRect?s.roundRect(40,32,46,56,10):s.rect(40,32,46,56);s.fill();s.stroke();s.fillStyle='#3a2408';s.beginPath();s.arc(63,60,7,0,7);s.fill();s.fillStyle='rgba(255,255,255,.55)';s.fillRect(8,18,100,4);
  const T=_mc(60,130),t=T.getContext('2d');t.lineJoin='round';t.strokeStyle='#1a1004';t.lineWidth=3;t.fillStyle=gold(t,0,0,60,0);t.beginPath();t.roundRect?t.roundRect(8,18,44,108,18):t.rect(8,18,44,108);t.fill();t.stroke();t.fillStyle='#0a0602';t.beginPath();t.ellipse(30,100,11,17,0,0,7);t.fill();t.stroke();t.strokeStyle='#8a5e14';t.lineWidth=5;t.beginPath();t.arc(30,10,9,0,7);t.stroke();t.fillStyle='rgba(255,255,255,.5)';t.fillRect(14,30,5,40);
  const P=_mc(10,10),p=P.getContext('2d');p.fillStyle='#262640';p.fillRect(0,0,10,10);p.strokeStyle='#3a3a5c';p.lineWidth=1.6;p.beginPath();p.moveTo(-2,8);p.lineTo(8,-2);p.moveTo(2,12);p.lineTo(12,2);p.stroke();
  return _zpC={A,B,S,T,P};}
FXS.zipper=(W,H,D)=>{const k=Math.min(W,H)/600,f=2.05/D,y0=H*.46,{A,B,S,T,P}=_zpMake(),tw=44*k,th=64*k,pt=86*k,tape=96*k,maxG=Math.min(H*.5,300*k),NX=Math.ceil((W+80)/10)+1,yT=new Float32Array(NX),yB=new Float32Array(NX);let pat=null,sp=[];
  const gp=(x,jx,mg)=>mg*Math.pow(Math.min(1,Math.max(0,(jx-x)/(260*k))),.9);
  return(c,t,dt)=>{const T_=t*f,fade=1-_fSm(D-.45,D,t),pr=_fSm(.1,.95,T_),jx=-60*k+(W+120*k)*pr,mg=_fSm(.2,1.4,T_)*maxG;if(!pat)pat=c.createPattern(P,'repeat');
  c.globalCompositeOperation='source-over';c.globalAlpha=fade*.72;c.fillStyle='#04040e';c.fillRect(0,0,W,H);c.globalAlpha=fade;
  for(let i=0;i<NX;i++){const x=-40+i*10,g=gp(x,jx,mg);yT[i]=y0-g/2;yB[i]=y0+g/2;}
  if(mg>2){c.beginPath();for(let i=0;i<NX;i++){const x=-40+i*10;i?c.lineTo(x,yT[i]):c.moveTo(x,yT[i]);}for(let i=NX-1;i>=0;i--)c.lineTo(-40+i*10,yB[i]);c.closePath();const lg=c.createLinearGradient(0,y0-maxG/2,0,y0+maxG/2);lg.addColorStop(0,'#4a68b8');lg.addColorStop(.35,'#bfe8ff');lg.addColorStop(.5,'#fffbe8');lg.addColorStop(.65,'#bfe8ff');lg.addColorStop(1,'#4a68b8');c.fillStyle=lg;c.fill();
   c.globalCompositeOperation='lighter';const gx=mg/maxG;fxGlow(c,W*.5,y0,W*.7,'#cfe8ff',.25*gx*fade);c.strokeStyle='#fff';c.lineWidth=2*k+.6;c.globalAlpha=.5*gx*fade;c.beginPath();c.moveTo(0,y0);c.lineTo(W,y0);c.stroke();c.globalCompositeOperation='source-over';c.globalAlpha=fade;}
  for(const sg of[-1,1]){const Y=sg<0?yT:yB;c.beginPath();for(let i=0;i<NX;i++){const x=-40+i*10;i?c.lineTo(x,Y[i]):c.moveTo(x,Y[i]);}for(let i=NX-1;i>=0;i--)c.lineTo(-40+i*10,Y[i]+sg*tape);c.closePath();c.fillStyle=pat;c.fill();c.strokeStyle='rgba(0,0,0,.5)';c.lineWidth=4*k+1;c.beginPath();for(let i=0;i<NX;i++){const x=-40+i*10;i?c.lineTo(x,Y[i]):c.moveTo(x,Y[i]);}c.stroke();c.strokeStyle='rgba(210,210,240,.5)';c.lineWidth=1.4;c.setLineDash([6*k,5*k]);c.beginPath();for(let i=0;i<NX;i++){const x=-40+i*10;i?c.lineTo(x,Y[i]+sg*tape*.8):c.moveTo(x,Y[i]+sg*tape*.8);}c.stroke();c.setLineDash([]);}
  const iy=(x,Y)=>{const i=Math.min(NX-1,Math.max(0,(x+40)/10)),i0=Math.floor(i),i1=Math.min(NX-1,i0+1);return Y[i0]+(Y[i1]-Y[i0])*(i-i0);};
  for(let x=-pt;x<W+pt;x+=pt){c.drawImage(B,x+pt/2-tw/2,iy(x+pt/2,yB)-th*.15,tw,th);}
  for(let x=-pt;x<W+pt;x+=pt){c.drawImage(A,x-tw/2,iy(x,yT)-th*.85,tw,th);}
  const zs=k*1.3;c.save();c.translate(jx,y0);c.drawImage(S,-138*zs,-60*zs,140*zs,120*zs);c.save();c.translate(-72*zs,0);c.rotate(.3+Math.sin(T_*13)*.12);c.drawImage(T,-30*zs*.9,-10*zs,60*zs*.9,130*zs*.9);c.restore();c.restore();
  c.globalCompositeOperation='lighter';fxGlow(c,jx,y0,70*k,'#fff2a0',.7*fade);fxFlare(c,jx,y0,90*k,'#ffe488',.6*fade);
  if(pr<1&&Math.random()<.9)for(let j=0;j<2;j++)sp.push({x:jx,y:y0+_fRn(-8,8)*k,vx:-_fRn(80,260)*k,vy:_fRn(-160,160)*k,l:0});for(let i=sp.length-1;i>=0;i--){const q=sp[i];q.l+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.l>.4){sp.splice(i,1);continue;}c.globalAlpha=(1-q.l/.4)*fade;c.fillStyle='#ffd870';c.fillRect(q.x,q.y,2.4*k+1,2.4*k+1);}
  c.globalCompositeOperation='source-over';};};
FXS.frostsuit=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,f=2.05/D,R=Math.min(W*.3,190*k),FR=_mc(Math.ceil(W),Math.ceil(H)),fg=FR.getContext('2d'),BU=_buMake();
  const br=(x,y,a,len,d)=>{if(len<4||d>4)return;const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;fg.lineWidth=Math.max(.6,len*.07);fg.beginPath();fg.moveTo(x,y);fg.lineTo(x2,y2);fg.stroke();for(let i=1;i<=3;i++){const px=x+(x2-x)*i/3,py=y+(y2-y)*i/3;br(px,py,a+.9+_fRn(-.2,.2),len*.4,d+1);br(px,py,a-.9+_fRn(-.2,.2),len*.4,d+1);}br(x2,y2,a+_fRn(-.15,.15),len*.55,d+1);};
  fg.strokeStyle='rgba(235,250,255,.85)';fg.lineCap='round';for(let i=0;i<46;i++){const e=i%4,q=_fR();let x,y,a;if(e===0){x=q*W;y=0;a=1.57;}else if(e===1){x=q*W;y=H;a=-1.57;}else if(e===2){x=0;y=q*H;a=0;}else{x=W;y=q*H;a=3.14;}br(x,y,a+_fRn(-.5,.5),_fRn(60,170)*k,0);}
  const fv=fg.createRadialGradient(cx,cy,Math.min(W,H)*.3,cx,cy,Math.max(W,H)*.7);fv.addColorStop(0,'rgba(200,240,255,0)');fv.addColorStop(1,'rgba(200,240,255,.5)');fg.fillStyle=fv;fg.fillRect(0,0,W,H);
  const cry=(c,x,y,len,wd,ang,a)=>{c.save();c.translate(x,y);c.rotate(ang);c.globalAlpha=a;const g=c.createLinearGradient(0,0,len,0);g.addColorStop(0,'#2a6aa0');g.addColorStop(.5,'#a8e4ff');g.addColorStop(1,'#ffffff');c.fillStyle=g;c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1.6;c.beginPath();c.moveTo(len,0);c.lineTo(len*.58,wd);c.lineTo(-len*.08,wd*.7);c.lineTo(-len*.08,-wd*.7);c.lineTo(len*.58,-wd);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.moveTo(len,0);c.lineTo(len*.58,-wd);c.lineTo(-len*.08,-wd*.7);c.lineTo(len*.3,0);c.closePath();c.fill();c.strokeStyle='rgba(60,120,180,.55)';c.beginPath();c.moveTo(len,0);c.lineTo(len*.3,0);c.moveTo(len*.58,wd);c.lineTo(len*.3,0);c.moveTo(len*.58,-wd);c.lineTo(len*.3,0);c.stroke();c.restore();};
  const dust=Array.from({length:130},()=>({x:_fR()*W,y:_fR()*H,s:_fRn(1,3.4)*k,ph:_fR()*6.28,v:_fRn(10,40)*k})),bu=Array.from({length:6},(_,i)=>{const a=-2.6+i*.9+_fRn(-.2,.2);return{a,t0:.7+i*.16,da:_fRn(.7,1.2)*(i%2?1:-1)};}),sp=[];
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t),pr=_fSm(.05,.7,T);c.globalCompositeOperation='source-over';c.globalAlpha=fade;
  const bg=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.75);bg.addColorStop(0,'rgba(10,40,70,.55)');bg.addColorStop(1,'rgba(2,10,24,.9)');c.fillStyle=bg;c.fillRect(0,0,W,H);
  c.globalAlpha=fade*pr;c.drawImage(FR,0,0);c.globalCompositeOperation='lighter';fxGlow(c,cx,cy,R*2.2*pr,'#8adfff',.35*fade);
  for(const d of dust){d.y+=d.v*dt;if(d.y>H)d.y=-5;const tw=Math.max(0,Math.sin(d.ph+T*5));c.globalAlpha=(.25+.6*tw)*pr*fade;c.fillStyle='#e8fbff';c.fillRect(d.x,d.y,d.s,d.s);if(tw>.92)fxFlare(c,d.x,d.y,12*k,'#fff',(tw-.92)*10*pr*fade);}
  c.globalCompositeOperation='source-over';const sc=pr*(1+.06*Math.sin(Math.min(1,pr)*3.14));for(let i=0;i<10;i++){const a=i/10*6.283+.3;cry(c,cx+Math.cos(a)*R*.55*sc,cy+Math.sin(a)*R*.55*sc,R*.8*sc,R*.2*sc,a,.95*fade*pr);}for(let i=0;i<6;i++){const a=i/6*6.283;cry(c,cx+Math.cos(a)*R*.18*sc,cy+Math.sin(a)*R*.18*sc,R*.5*sc,R*.18*sc,a+.5,.95*fade*pr);}
  c.globalCompositeOperation='lighter';c.strokeStyle='rgba(220,248,255,.8)';c.lineWidth=2*k+.6;c.globalAlpha=.5*pr*fade;c.beginPath();c.arc(cx,cy,R*1.05*sc,0,7);c.stroke();
  for(const b of bu){const u=(T-b.t0)/.42;if(u<0||u>2.2)continue;const ex=cx+Math.cos(b.a)*R*1.02,ey=cy+Math.sin(b.a)*R*1.02,sx0=cx+Math.cos(b.a)*Math.max(W,H)*.8,sy0=cy+Math.sin(b.a)*Math.max(W,H)*.8;let x,y,an;if(u<1){x=sx0+(ex-sx0)*u;y=sy0+(ey-sy0)*u;an=Math.atan2(ey-sy0,ex-sx0);}else{const v=u-1,ra=b.a+Math.PI+b.da;x=ex+Math.cos(ra)*v*W*.9;y=ey+Math.sin(ra)*v*W*.9;an=ra+v*3;if(!b.h){b.h=1;for(let j=0;j<14;j++){const aa=_fR()*6.283,vv=_fRn(120,520)*k;sp.push({x:ex,y:ey,vx:Math.cos(aa)*vv,vy:Math.sin(aa)*vv,l:0,r:_fR()*6,s:_fRn(4,11)*k});}}c.globalAlpha=Math.max(0,1-v)*fade;fxFlare(c,ex,ey,90*k*(1-v),'#dff6ff',Math.max(0,1-v*2.5)*fade);}
   c.globalCompositeOperation='source-over';c.save();c.translate(x,y);c.rotate(an);c.globalAlpha=Math.max(0,u<1?1:2.2-u)*fade;const bs=k*.8;c.drawImage(BU,-60*bs,-22*bs,120*bs,44*bs);c.restore();c.globalCompositeOperation='lighter';}
  c.globalCompositeOperation='source-over';for(let i=sp.length-1;i>=0;i--){const q=sp[i];q.l+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=300*k*dt;q.r+=dt*6;if(q.l>.9){sp.splice(i,1);continue;}c.save();c.translate(q.x,q.y);c.rotate(q.r);c.globalAlpha=(1-q.l/.9)*fade;c.fillStyle='rgba(210,245,255,.85)';c.strokeStyle='#fff';c.lineWidth=1;c.beginPath();c.moveTo(-q.s,q.s*.4);c.lineTo(0,-q.s);c.lineTo(q.s*.7,q.s*.5);c.closePath();c.fill();c.stroke();c.restore();}
  c.globalCompositeOperation='lighter';for(let i=0;i<5;i++){const m=((T*.35+i*.2)%1),x=W*(.1+.8*((i*.37+m*.3)%1)),y=H*(.7+.25*m);fxGlow(c,x,y,W*.3,'#d8f4ff',.07*Math.sin(m*3.14)*pr*fade);}};};

// ---- リアル版の演出：磁力の刃（ロン）／天候（上がり）----
let _mgC=null;
function _mgMake(){
  if(_mgC)return _mgC;
  const st=(g,x0,y0,x1,y1)=>{const q=g.createLinearGradient(x0,y0,x1,y1);q.addColorStop(0,'#fafcff');q.addColorStop(.3,'#b4bccc');q.addColorStop(.55,'#6a7486');q.addColorStop(.8,'#c8d0de');q.addColorStop(1,'#3a4252');return q;};
  const R=_mc(170,64),r=R.getContext('2d');r.fillStyle=st(r,0,0,0,64);r.strokeStyle='#10141c';r.lineWidth=2.6;r.beginPath();r.moveTo(8,10);r.lineTo(162,10);r.lineTo(162,54);r.lineTo(8,54);r.closePath();r.fill();r.stroke();r.fillStyle='#0a0e16';r.beginPath();r.moveTo(30,24);r.lineTo(46,24);r.lineTo(52,32);r.lineTo(46,40);r.lineTo(30,40);r.lineTo(24,32);r.closePath();r.fill();r.fillStyle='rgba(255,255,255,.9)';r.fillRect(10,12,150,3);r.fillStyle='rgba(70,80,100,.9)';r.fillRect(10,50,150,3);r.strokeStyle='rgba(255,70,90,.8)';r.lineWidth=1.4;r.beginPath();r.moveTo(162,10);r.lineTo(162,54);r.stroke();
  const S=_mc(220,140),s=S.getContext('2d');s.strokeStyle='#10141c';s.lineWidth=2.6;for(const sg of[-1,1]){s.save();s.translate(100,70);s.rotate(sg*.22);s.fillStyle=st(s,0,-20,160,20);s.beginPath();s.moveTo(-10,-6*sg);s.lineTo(110,-3*sg-8*sg+4);s.lineTo(116,0);s.lineTo(-10,10*sg);s.closePath();s.fill();s.stroke();s.fillStyle='rgba(255,255,255,.8)';s.fillRect(10,-5*sg-1,90,2);s.restore();}
  s.fillStyle='#14161c';s.strokeStyle='#05070a';for(const sg of[-1,1]){s.beginPath();s.ellipse(28,70+sg*34,22,14,sg*.5,0,7);s.fill();s.stroke();s.fillStyle='#d02a3a';s.beginPath();s.ellipse(28,70+sg*34,14,8,sg*.5,0,7);s.fill();s.fillStyle='#14161c';}
  const pv=s.createRadialGradient(98,68,1,100,70,8);pv.addColorStop(0,'#fff');pv.addColorStop(1,'#6a7486');s.fillStyle=pv;s.beginPath();s.arc(100,70,7,0,7);s.fill();s.stroke();
  return _mgC={R,S};}
FXS.magnet=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,f=2.3/D,L=Math.min(W*.3,200*k),{R,S}=_mgC||_mgMake(),M=300,
  fi=Array.from({length:M},()=>({i:1+Math.floor(_fR()*7),u:_fR(),sg:_fR()<.5?-1:1,v:_fRn(.06,.16),l:_fRn(5,10)*k})),
  bl=Array.from({length:18},(_,i)=>({a:i/18*6.283+_fRn(-.12,.12),v:_fRn(520,1100)*k,s:_fRn(.55,1.15)*k,sc:i%3===0,t0:.98+_fR()*.25,rs:_fRn(-9,9),side:_fR()<.5?-1:1})),sp=[];let shk=0,fired=false;
  const pos=(q,T)=>{const th=(q.u+T*q.v)%1*Math.PI,h=34*k*q.i*(1+.18*q.i/7);return[cx-L*Math.cos(th),cy+q.sg*h*Math.sin(th)*1.1,Math.atan2(q.sg*h*Math.cos(th)*1.1,L*Math.sin(th))];};
  const mg=(c,x,col1,col2,txt)=>{c.save();c.translate(x,cy);c.scale(1.35,1.35);const g=c.createLinearGradient(0,-64*k,0,64*k);g.addColorStop(0,col1);g.addColorStop(1,col2);c.fillStyle=g;c.strokeStyle='#080a10';c.lineWidth=3.4;c.beginPath();c.rect(-34*k,-62*k,68*k,124*k);c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.35)';c.fillRect(-30*k,-58*k,10*k,116*k);c.fillStyle='rgba(0,0,0,.28)';c.fillRect(22*k,-58*k,8*k,116*k);c.fillStyle='#fff';c.font=`900 ${46*k}px sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillText(txt,0,2*k);c.restore();};
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t),ex=_fSm(0,.35,T),sx=shk>0?_fRn(-1,1)*shk:0,sy=shk>0?_fRn(-1,1)*shk:0;shk=Math.max(0,shk-dt*50);c.save();c.translate(sx,sy);c.globalCompositeOperation='source-over';c.globalAlpha=fade;
  const bg=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.8);bg.addColorStop(0,'rgba(46,14,24,.8)');bg.addColorStop(1,'rgba(6,2,8,.94)');c.fillStyle=bg;c.fillRect(-20,-20,W+40,H+40);
  c.globalCompositeOperation='lighter';fxGlow(c,cx-L,cy,130*k*ex,'#ff3a50',.55*fade);fxGlow(c,cx+L,cy,130*k*ex,'#3a6aff',.55*fade);
  c.lineWidth=1;for(let i=1;i<=7;i++)for(const sg of[-1,1]){c.globalAlpha=.16*fade*ex;c.strokeStyle=sg>0?'#ffb0b8':'#a8c4ff';const h=34*k*i*(1+.18*i/7)*1.1;c.beginPath();c.ellipse(cx,cy,L,h,0,sg>0?3.14:0,sg>0?6.283:3.14);c.stroke();}
  c.globalCompositeOperation='source-over';const dim=1-_fSm(.95,1.3,T);for(const q of fi){const[x,y,an]=pos(q,T);if(x==null)continue;const gather=_fSm(0,.8,T),px=cx-L+(x-(cx-L))*gather+(x<cx?0:0),py=cy+(y-cy)*gather;c.save();c.translate(px,py);c.rotate(an);c.globalAlpha=Math.min(1,T*3)*dim*fade;c.strokeStyle='#8a94a8';c.lineWidth=2.8*k+.9;c.beginPath();c.moveTo(-q.l*.8,0);c.lineTo(q.l*.8,0);c.stroke();c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=.9;c.beginPath();c.moveTo(-q.l/2,-.6);c.lineTo(q.l*.1,-.6);c.stroke();c.restore();}
  mg(c,cx-L,'#ff5a6a','#8a0a1e','N');mg(c,cx+L,'#5a8aff','#0a2a8a','S');
  if(T>.9&&!fired){fired=true;shk=14*k;}
  c.globalCompositeOperation='lighter';if(T>.9&&T<1.2){const u=(T-.9)/.3;c.globalAlpha=(1-u)*fade;c.strokeStyle='#ffd0d6';c.lineWidth=7*(1-u)*k+1;c.beginPath();c.arc(cx-L,cy,u*W*.7,0,7);c.stroke();c.strokeStyle='#d0dcff';c.beginPath();c.arc(cx+L,cy,u*W*.7,0,7);c.stroke();}
  for(const b of bl){const q=T-b.t0;if(q<0)continue;const px=cx+b.side*L,d=q*b.v,x=px+Math.cos(b.a)*d,y=cy+Math.sin(b.a)*d*.85,al=Math.max(0,1-q/1.1)*fade;if(al<=0)continue;if(!b.p&&q<.05){b.p=1;for(let j=0;j<6;j++)sp.push({x:px,y:cy,vx:Math.cos(b.a+_fRn(-.5,.5))*_fRn(200,700)*k,vy:Math.sin(b.a+_fRn(-.5,.5))*_fRn(200,700)*k,l:0});}
   const gr=c.createLinearGradient(x,y,x-Math.cos(b.a)*140*k,y-Math.sin(b.a)*140*k);gr.addColorStop(0,'rgba(255,130,150,.7)');gr.addColorStop(1,'rgba(255,130,150,0)');c.globalAlpha=al*.8;c.strokeStyle=gr;c.lineWidth=3*k+1;c.beginPath();c.moveTo(x,y);c.lineTo(x-Math.cos(b.a)*140*k,y-Math.sin(b.a)*140*k);c.stroke();
   c.globalCompositeOperation='source-over';c.save();c.translate(x,y);c.rotate(b.a+q*b.rs);c.globalAlpha=al;if(b.sc)c.drawImage(S,-110*b.s,-70*b.s,220*b.s,140*b.s);else c.drawImage(R,-85*b.s,-32*b.s,170*b.s,64*b.s);c.restore();c.globalCompositeOperation='lighter';const gl=Math.sin(q*18+b.a*5);if(gl>.8)fxFlare(c,x,y,50*k,'#fff',(gl-.8)*5*al);}
  for(let i=sp.length-1;i>=0;i--){const q=sp[i];q.l+=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.l>.5){sp.splice(i,1);continue;}c.globalAlpha=(1-q.l/.5)*fade;c.strokeStyle='#ffc890';c.lineWidth=1.8*k+.5;c.beginPath();c.moveTo(q.x,q.y);c.lineTo(q.x-q.vx*.03,q.y-q.vy*.03);c.stroke();}
  c.restore();};};
FXS.weather=(W,H,D)=>{const k=Math.min(W,H)/600,f=2.4/D,cx=W/2,gy=H*.9,
  cl=Array.from({length:30},()=>({x:_fRn(-.1,1.1)*W,y:_fRn(0,.38)*H,r:_fRn(80,190)*k,v:_fRn(6,22)*k,d:_fR()})),
  rn=Array.from({length:240},()=>({x:_fRn(-.2,1.1)*W,y:_fR()*H,v:_fRn(1100,1900)*k,l:_fRn(20,52)*k,z:_fR()})),
  ox=Array.from({length:40},()=>({x:_fR()*W,y:H*_fRn(.55,1.2),v:_fRn(40,120)*k,r:_fRn(4,15)*k,ph:_fR()*9})),
  mi=Array.from({length:8},(_,i)=>({x:_fR()*W,y:H*(.62+i*.04),r:_fRn(150,300)*k,v:_fRn(10,40)*k*(i%2?1:-1)})),bo=[],spl=[];let nb=.4,fl=0;
  const bolt=(x,y,ang,len,d,out)=>{if(len<8*k||d>5)return;const a=ang+_fRn(-.5,.5);const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;out.push([x,y,x2,y2,d]);bolt(x2,y2,a+_fRn(-.15,.15),len*_fRn(.7,.95),d,out);if(_fR()<.38)bolt(x2,y2,a+_fRn(-.9,.9),len*.62,d+1,out);};
  const snail=(c,x,y,s,ph,a)=>{c.save();c.translate(x,y);c.scale(s,s);c.globalAlpha=a;c.lineCap='round';c.lineJoin='round';const bb=Math.sin(ph*6)*1.4;
   const bg=c.createLinearGradient(0,-20,0,14);bg.addColorStop(0,'#e6cc98');bg.addColorStop(1,'#a07a48');c.fillStyle=bg;c.strokeStyle='#3a2a14';c.lineWidth=2.4;c.beginPath();c.moveTo(-60,12);c.quadraticCurveTo(-64,-6+bb,-40,-8);c.lineTo(34,-10+bb);c.quadraticCurveTo(58,-30+bb,66,-24+bb);c.quadraticCurveTo(72,-12,56,0);c.quadraticCurveTo(66,12,50,14);c.lineTo(-44,16);c.quadraticCurveTo(-58,16,-60,12);c.closePath();c.fill();c.stroke();
   c.strokeStyle='#3a2a14';c.lineWidth=2;for(const sg of[0,1]){const ex=60+sg*10,ey=-24+bb;c.beginPath();c.moveTo(ex,ey);c.lineTo(ex+8+Math.sin(ph*4+sg)*3,ey-26);c.stroke();c.fillStyle='#2a1c0c';c.beginPath();c.arc(ex+8+Math.sin(ph*4+sg)*3,ey-27,3.2,0,7);c.fill();}
   const sg2=c.createRadialGradient(-8,-26,4,-4,-14,50);sg2.addColorStop(0,'#ffcf7a');sg2.addColorStop(.5,'#d07a2a');sg2.addColorStop(1,'#5a2a0a');c.fillStyle=sg2;c.strokeStyle='#2a1204';c.lineWidth=2.6;c.beginPath();c.arc(-6,-24,38,0,7);c.fill();c.stroke();c.strokeStyle='rgba(60,24,4,.8)';c.lineWidth=2.2;c.beginPath();for(let i=0;i<60;i++){const a=i*.22,r=36-i*.55;i?c.lineTo(-6+Math.cos(a)*r,-24+Math.sin(a)*r):c.moveTo(-6+Math.cos(a)*r,-24+Math.sin(a)*r);}c.stroke();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-18,-40,8,14,.6,0,7);c.fill();c.restore();};
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t),A=_fSm(0,.3,T)*fade,clr=_fSm(1.45,2.05,T);c.globalCompositeOperation='source-over';c.globalAlpha=A;
  const sk=c.createLinearGradient(0,0,0,H);sk.addColorStop(0,`rgb(${20+clr*60},${24+clr*80},${36+clr*100})`);sk.addColorStop(1,`rgb(${10+clr*50},${12+clr*60},${22+clr*70})`);c.fillStyle=sk;c.globalAlpha=.9*A;c.fillRect(0,0,W,H);
  fl=Math.max(0,fl-dt*4);for(const q of cl){q.x+=q.v*dt;if(q.x>W+q.r)q.x=-q.r;fxGlow(c,q.x,q.y,q.r,'#2c3448',A*.6*(1-clr*.85)*(.5+q.d*.5));if(fl>0){c.globalCompositeOperation='lighter';fxGlow(c,q.x,q.y,q.r,'#b8c8ff',fl*.14*A);c.globalCompositeOperation='source-over';}}
  
  c.globalCompositeOperation='lighter';if(clr<1){c.lineCap='round';for(const r of rn){r.y+=r.v*dt;r.x-=r.v*dt*.18;if(r.y>gy+r.z*H*.06){spl.push({x:r.x,y:gy+r.z*H*.06,l:0});r.y=-30;r.x=_fRn(0,1.2)*W;}c.globalAlpha=(.14+r.z*.3)*(1-clr)*A;c.strokeStyle='#b8d0f0';c.lineWidth=(.8+r.z*1.6)*k+.3;c.beginPath();c.moveTo(r.x,r.y);c.lineTo(r.x+r.l*.18,r.y-r.l);c.stroke();}for(let i=spl.length-1;i>=0;i--){const q=spl[i];q.l+=dt;if(q.l>.3){spl.splice(i,1);continue;}c.globalAlpha=(1-q.l/.3)*.5*(1-clr)*A;c.strokeStyle='#cfe0ff';c.lineWidth=1.2;c.beginPath();c.ellipse(q.x,q.y,q.l*40*k,q.l*10*k,0,0,7);c.stroke();}}
  if(T>nb&&T<1.45){nb=T+_fRn(.2,.45);const out=[];bolt(_fRn(W*.2,W*.8),0,1.57,H*.13,0,out);bo.push({s:out,t0:T});fl=1;}
  for(let i=bo.length-1;i>=0;i--){const b=bo[i],u=(T-b.t0)/.22;if(u>1){bo.splice(i,1);continue;}const e=Math.min(1,u*5);for(const[wd,col,al]of[[16,'rgba(120,150,255,.18)',1],[6,'rgba(190,210,255,.5)',1],[2.2,'#ffffff',1]]){c.strokeStyle=col;c.globalAlpha=(1-u)*A*al;c.lineWidth=wd*k*(1-b.s[0][4]*.0)+.4;c.lineCap='round';c.beginPath();for(const sg of b.s){if(sg[4]>2&&wd>6)continue;c.moveTo(sg[0],sg[1]);c.lineTo(sg[0]+(sg[2]-sg[0])*e,sg[1]+(sg[3]-sg[1])*e);}c.stroke();}c.globalAlpha=(1-u)*.16*A;c.fillStyle='#cfdcff';c.fillRect(0,0,W,H);}
  c.globalCompositeOperation='source-over';for(const m of mi){m.x+=m.v*dt;if(m.x>W+m.r)m.x=-m.r;if(m.x<-m.r)m.x=W+m.r;fxGlow(c,m.x,m.y,m.r,'#c4ccd8',.1*A*(1-clr*.7));}
  if(clr>0){c.globalCompositeOperation='lighter';const sx=W*.8,sy=H*.1;fxGlow(c,sx,sy,W*.9,'#ffe8a0',.7*clr*A);fxFlare(c,sx,sy,W*.5,'#fff2b8',.6*clr*A);c.fillStyle='#fff4c8';for(let i=0;i<9;i++){const a=1.7+i*.12;c.globalAlpha=.09*clr*A;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+Math.cos(a)*H*1.3-30*k,sy+Math.sin(a)*H*1.3);c.lineTo(sx+Math.cos(a)*H*1.3+30*k,sy+Math.sin(a)*H*1.3);c.fill();}
   for(const o of ox){o.y-=o.v*dt;if(o.y<-30)o.y=H+20;const bx=o.x+Math.sin(T*2+o.ph)*10*k,g=c.createRadialGradient(bx-o.r*.3,o.y-o.r*.3,o.r*.1,bx,o.y,o.r);g.addColorStop(0,'rgba(255,255,255,.7)');g.addColorStop(.6,'rgba(150,220,255,.12)');g.addColorStop(1,'rgba(180,235,255,.5)');c.globalAlpha=.9*clr*A;c.fillStyle=g;c.beginPath();c.arc(bx,o.y,o.r,0,7);c.fill();c.strokeStyle='rgba(220,248,255,.7)';c.lineWidth=1;c.stroke();}}
  const sn=_fSm(1.55,2.0,T);if(sn>0){c.globalCompositeOperation='source-over';const sxp=W*.12+(T-1.55)*W*.3,sy=H*.82;c.globalAlpha=A*sn*.5;c.strokeStyle='rgba(220,240,255,.55)';c.lineWidth=6*k;c.lineCap='round';c.beginPath();c.moveTo(W*.1,sy+22*k);c.lineTo(sxp,sy+22*k);c.stroke();c.globalCompositeOperation='lighter';c.globalAlpha=A*sn*.6;c.fillStyle='#fff';for(let i=0;i<10;i++)c.fillRect(W*.1+(sxp-W*.1)*i/10+Math.sin(i*3+T*8)*3,sy+20*k,2,2);c.globalCompositeOperation='source-over';snail(c,sxp,sy,1.35*k,T,A*sn);}};};

// ---- リアル版の演出：命令の本／癒しの料理（上がり）----
FXS.book=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,f=2.4/D,bw=Math.min(W*.44,230*k),bh=bw*1.3,
  gl=Array.from({length:48},()=>({x:_fRn(-bw,bw),v:_fRn(70,230)*k,s:_fRn(16,30)*k,dl:_fR()*1.1,g:'命令従記絶対書読契約誓'[Math.floor(_fR()*10)]})),
  ln=Array.from({length:10},(_,i)=>({y:-bh/2+bh*.17+i*bh*.07,len:_fRn(.55,.9),ph:_fR()*9})),st=Array.from({length:6},()=>({x:_fR(),y:_fR(),r:_fRn(20,60)*k}));let shk=0,sd=false;
  const pg=(c,dir,w,T)=>{const t1=-bh/2,t2=bh/2;c.beginPath();c.moveTo(0,t1+6*k);c.lineTo(dir*w,t1-12*k);c.lineTo(dir*w,t2-12*k);c.lineTo(0,t2+6*k);c.closePath();const g=c.createLinearGradient(0,0,dir*w,0);g.addColorStop(0,'#a8884e');g.addColorStop(.12,'#e8d4a0');g.addColorStop(.6,'#f4e6bc');g.addColorStop(1,'#e2cf98');c.fillStyle=g;c.fill();c.strokeStyle='#4a3414';c.lineWidth=2.4;c.stroke();c.save();c.clip();for(const s of st){c.globalAlpha*=1;c.fillStyle='rgba(120,80,30,.1)';c.beginPath();c.arc(dir*w*s.x,t1+bh*s.y,s.r,0,7);c.fill();}const sh=c.createLinearGradient(0,0,dir*w*.35,0);sh.addColorStop(0,'rgba(40,20,4,.5)');sh.addColorStop(1,'rgba(40,20,4,0)');c.fillStyle=sh;c.fillRect(Math.min(0,dir*w),t1-20*k,w,bh+40*k);c.restore();};
  const ink=(c,dir,w,T,fade)=>{ln.forEach((l,i)=>{const pr=Math.min(1,Math.max(0,(T-.45-i*.05)/.35));if(pr<=0)return;const x0=dir*w*.12,x1=x0+dir*w*.76*l.len*pr,y=l.y;c.strokeStyle='rgba(36,16,6,.88)';c.lineWidth=1.8*k+.5;c.lineCap='round';c.beginPath();for(let x=0;x<=1.001;x+=.012){const xx=x0+(x1-x0)*x,yy=y-10*k*(Math.abs(xx)/w)+Math.sin(x*70+l.ph)*2.4*k*Math.sin(x*3.14);x?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();if(pr<1){c.globalCompositeOperation='lighter';fxGlow(c,x1,y-10*k*(Math.abs(x1)/w),16*k,'#ffd070',.8*fade);c.globalCompositeOperation='source-over';}});};
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t),op=_fSm(0,.45,T),sx=shk>0?_fRn(-1,1)*shk:0,sy=shk>0?_fRn(-1,1)*shk:0;shk=Math.max(0,shk-dt*60);c.save();c.translate(sx,sy);c.globalCompositeOperation='source-over';c.globalAlpha=fade;
  const bg=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.8);bg.addColorStop(0,'rgba(60,34,10,.8)');bg.addColorStop(1,'rgba(8,4,2,.95)');c.fillStyle=bg;c.fillRect(-20,-20,W+40,H+40);
  c.globalCompositeOperation='lighter';fxGlow(c,cx,cy,bw*2.4,'#ffc860',.4*op*fade);for(let i=0;i<9;i++){const a=-1.57+(i-4)*.2;c.globalAlpha=.07*op*fade;c.fillStyle='#ffe8a8';c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a-.05)*H,cy+Math.sin(a-.05)*H);c.lineTo(cx+Math.cos(a+.05)*H,cy+Math.sin(a+.05)*H);c.fill();}
  c.globalCompositeOperation='source-over';c.save();c.translate(cx,cy);c.globalAlpha=fade;const w=bw*op;
  const cg=c.createLinearGradient(-w,0,w,0);cg.addColorStop(0,'#3a1c0c');cg.addColorStop(.5,'#5a3018');cg.addColorStop(1,'#3a1c0c');c.fillStyle=cg;c.strokeStyle='#100804';c.lineWidth=3;c.beginPath();c.moveTo(-w-16*k,-bh/2-24*k);c.lineTo(w+16*k,-bh/2-24*k);c.lineTo(w+16*k,bh/2-2*k);c.lineTo(-w-16*k,bh/2-2*k);c.closePath();c.fill();c.stroke();c.strokeStyle='#d8aa40';c.lineWidth=2;c.strokeRect(-w-9*k,-bh/2-17*k,2*w+18*k,bh+8*k);
  for(let i=0;i<4;i++){c.strokeStyle=`rgba(255,240,200,${.7-i*.15})`;c.lineWidth=1.4;c.beginPath();c.moveTo(-w,bh/2+8*k+i*2*k);c.lineTo(0,bh/2+10*k+i*2*k);c.lineTo(w,bh/2+8*k+i*2*k);c.stroke();}
  c.globalAlpha=fade;pg(c,-1,w,T);pg(c,1,w,T);c.globalAlpha=fade;ink(c,-1,w,T,fade);ink(c,1,w,T,fade);
  const fp=(T-.5)/.4;for(let i=0;i<3;i++){const q=fp-i*.3;if(q<0||q>1)continue;const wq=bw*Math.cos(q*3.1416),lift=Math.sin(q*3.1416)*34*k;c.globalAlpha=fade*.95;c.beginPath();c.moveTo(0,-bh/2+6*k);c.quadraticCurveTo(wq*.5,-bh/2-lift-10*k,wq,-bh/2-12*k-lift*.5);c.lineTo(wq,bh/2-12*k-lift*.3);c.lineTo(0,bh/2+6*k);c.closePath();const g=c.createLinearGradient(0,0,wq,0);g.addColorStop(0,'#c8a868');g.addColorStop(1,q<.5?'#f6e8c0':'#d8c490');c.fillStyle=g;c.fill();c.strokeStyle='#4a3414';c.lineWidth=2;c.stroke();}
  c.fillStyle='#a01820';c.beginPath();c.moveTo(-2*k,bh/2+4*k);c.lineTo(10*k,bh/2+4*k);c.lineTo(12*k,bh/2+48*k);c.lineTo(4*k,bh/2+40*k);c.lineTo(-4*k,bh/2+48*k);c.closePath();c.fill();c.strokeStyle='#500a0e';c.stroke();c.restore();
  c.globalCompositeOperation='lighter';c.textAlign='center';for(const h of gl){const q=T-.85-h.dl;if(q<0)continue;const a=Math.max(0,1-q/1.2)*fade;if(a<=0)continue;c.globalAlpha=a;c.fillStyle='#ffe488';c.font=`900 ${h.s}px serif`;c.shadowColor='#ffb830';c.shadowBlur=12;c.fillText(h.g,cx+h.x,cy-q*h.v*2);}c.shadowBlur=0;
  const sp=_fSm(1.2,1.4,T);if(sp>0){const su=Math.min(1,(T-1.2)/.2),sc=2.4-1.4*Math.pow(su,.6),sx2=cx+bw*.45,sy2=cy+bh*.1;if(su>=1&&!sd){sd=true;shk=18*k;}c.globalCompositeOperation='source-over';c.save();c.translate(sx2,sy2);c.scale(sc,sc);c.globalAlpha=fade*sp;const rg=c.createRadialGradient(-10*k,-12*k,4*k,0,0,60*k);rg.addColorStop(0,'#e83a3a');rg.addColorStop(.6,'#a01418');rg.addColorStop(1,'#5a0608');c.fillStyle=rg;c.strokeStyle='#2a0204';c.lineWidth=3;c.beginPath();for(let i=0;i<=48;i++){const a=i/48*6.283,r=58*k*(1+.05*Math.sin(a*9));i?c.lineTo(Math.cos(a)*r,Math.sin(a)*r):c.moveTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fill();c.stroke();c.strokeStyle='rgba(255,200,180,.55)';c.lineWidth=2.4;c.beginPath();c.arc(0,0,46*k,0,7);c.stroke();c.fillStyle='#ffe0c8';c.font=`900 ${50*k}px serif`;c.textAlign='center';c.textBaseline='middle';c.shadowColor='#400';c.shadowBlur=3;c.fillText('絶対',0,3*k);c.restore();c.shadowBlur=0;
   if(su>=1){const u=Math.min(1,(T-1.4)/.5);c.globalCompositeOperation='lighter';c.strokeStyle='#ffd878';for(let i=0;i<3;i++){const ww=u-i*.12;if(ww<0)continue;c.globalAlpha=(1-ww)*fade;c.lineWidth=(8*(1-ww)+1)*k;c.beginPath();c.arc(sx2,sy2,ww*Math.max(W,H)*.6,0,7);c.stroke();}fxGlow(c,sx2,sy2,260*k*(1-u*.6),'#ffd070',(1-u)*.7*fade);}}
  c.restore();};};
let _cuC=null;
function _cuMake(){
  if(_cuC)return _cuC;const cv=_mc(340,260),g=cv.getContext('2d');let sd=11;const r=()=>(sd=(sd*16807)%2147483647)/2147483647;
  const el=(x,y,rx,ry,fill,st,lw,rot)=>{g.beginPath();g.ellipse(x,y,rx,ry,rot||0,0,7);if(fill){g.fillStyle=fill;g.fill();}if(st){g.strokeStyle=st;g.lineWidth=lw||2;g.stroke();}};
  el(170,188,160,58,'#b0a490','#3a2c1c',3);const pg=g.createRadialGradient(150,160,20,170,178,170);pg.addColorStop(0,'#ffffff');pg.addColorStop(.7,'#f2ece0');pg.addColorStop(1,'#cfc4b0');el(170,178,160,58,pg,'#3a2c1c',3);
  g.lineWidth=2.4;g.strokeStyle='#2a8a3a';g.beginPath();g.ellipse(170,178,148,51,0,0,7);g.stroke();g.strokeStyle='#d02a38';g.beginPath();g.ellipse(170,178,142,48.5,0,0,7);g.stroke();
  const wg=g.createRadialGradient(170,176,10,170,182,120);wg.addColorStop(0,'#ece4d4');wg.addColorStop(1,'#cfc2aa');el(170,182,116,38,wg,'rgba(90,70,40,.5)',2);
  g.fillStyle='rgba(200,50,30,.5)';for(const[x,y,a,b]of[[96,194,12,4],[246,200,14,4.4],[210,208,9,3]])el(x,y,a,b,'rgba(200,50,30,.5)');
  el(170,198,102,20,'rgba(60,36,16,.38)');
  const M='M66 190Q68 122 170 100Q272 122 274 190Q170 226 66 190Z',mp=new Path2D(M),mg=g.createLinearGradient(0,100,0,215);mg.addColorStop(0,'#f8e29a');mg.addColorStop(1,'#cf9c44');g.fillStyle=mg;g.fill(mp);
  g.save();g.clip(mp);g.lineCap='round';for(let i=0;i<110;i++){const x=66+r()*208,y=104+r()*100,rx=18+r()*52,ry=6+r()*20,rot=r()*3.14,a0=r()*6,a1=a0+1.2+r()*2.2,c=r();g.strokeStyle=c<.5?'#ecc866':c<.8?'#c8922e':'#fff0b0';g.lineWidth=c<.8?3.4:1.4;g.beginPath();g.ellipse(x,y,rx,ry,rot,a0,a1);g.stroke();}
  const sh=g.createLinearGradient(0,100,0,215);sh.addColorStop(0,'rgba(255,255,255,.12)');sh.addColorStop(.6,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(60,30,6,.45)');g.fillStyle=sh;g.fillRect(0,90,340,140);g.restore();g.strokeStyle='#5a3a10';g.lineWidth=2.4;g.stroke(mp);
  const sc=new Path2D('M108 154Q116 112 170 104Q224 112 234 154Q218 146 208 160Q194 146 182 162Q166 144 150 162Q134 146 108 154Z'),sg=g.createRadialGradient(150,126,6,170,136,80);sg.addColorStop(0,'#f2573a');sg.addColorStop(.6,'#c92f1c');sg.addColorStop(1,'#7a1409');g.fillStyle=sg;g.fill(sc);g.strokeStyle='#4a0c06';g.lineWidth=2;g.stroke(sc);
  g.save();g.clip(sc);for(let i=0;i<16;i++){g.fillStyle=r()<.5?'#8a1a0c':'#e8683a';g.beginPath();g.arc(112+r()*120,108+r()*54,1.4+r()*2.2,0,7);g.fill();}for(const[x,y]of[[140,128],[176,120],[204,134],[158,146],[192,150],[128,146]]){g.fillStyle='#a8200f';g.strokeStyle='#5a0a04';g.lineWidth=1.4;g.beginPath();g.roundRect?g.roundRect(x-7,y-5,14,10,3):g.rect(x-7,y-5,14,10);g.fill();g.stroke();g.fillStyle='rgba(255,170,130,.55)';g.fillRect(x-5,y-3,5,2);}g.restore();
  g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.ellipse(146,118,14,4,-.4,0,7);g.fill();g.beginPath();g.ellipse(208,128,8,2.6,.5,0,7);g.fill();
  const leaf=(x,y,s,rot)=>{g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);const lg=g.createLinearGradient(0,-26,0,26);lg.addColorStop(0,'#78cc5a');lg.addColorStop(1,'#2a7a24');g.fillStyle=lg;g.strokeStyle='#14420f';g.lineWidth=2;g.beginPath();g.moveTo(0,26);g.quadraticCurveTo(-22,6,-8,-18);g.quadraticCurveTo(0,-30,8,-18);g.quadraticCurveTo(22,6,0,26);g.closePath();g.fill();g.stroke();g.strokeStyle='rgba(200,255,170,.7)';g.lineWidth=1.4;g.beginPath();g.moveTo(0,24);g.lineTo(0,-20);for(let i=0;i<4;i++){g.moveTo(0,16-i*9);g.lineTo(-9,8-i*9);g.moveTo(0,16-i*9);g.lineTo(9,8-i*9);}g.stroke();g.restore();};
  leaf(160,106,.82,-.5);leaf(184,102,.9,.35);leaf(172,112,.62,0.05);
  for(let i=0;i<46;i++){const x=112+r()*118,y=108+r()*52;g.fillStyle=r()<.7?'#fff0c4':'#f0d890';g.fillRect(x,y,2.6+r()*2.6,1.6+r()*1.6);}for(let i=0;i<14;i++){g.fillStyle='#1a1008';g.beginPath();g.arc(112+r()*118,108+r()*54,1.1,0,7);g.fill();}
  for(const[x,y,s]of[[72,186,14],[278,190,13],[236,150,9]]){const tg=g.createRadialGradient(x-3,y-3,2,x,y,s);tg.addColorStop(0,'#ff7a5a');tg.addColorStop(1,'#b81e10');g.fillStyle=tg;g.strokeStyle='#4a0804';g.lineWidth=2;g.beginPath();g.arc(x,y,s,0,7);g.fill();g.stroke();g.fillStyle='#ffb090';g.beginPath();g.arc(x,y,s*.62,0,7);g.fill();g.fillStyle='#f6e8a8';for(let i=0;i<5;i++){const a=i/5*6.283;g.beginPath();g.ellipse(x+Math.cos(a)*s*.34,y+Math.sin(a)*s*.34,1.8,1.1,a,0,7);g.fill();}}
  leaf(262,168,.5,1.1);leaf(86,170,.45,-1.2);
  g.fillStyle='rgba(255,230,140,.6)';for(const[x,y,a]of[[90,176,7],[236,168,6],[206,186,8]])el(x,y,a,a*.35,'rgba(255,225,130,.55)');
  return _cuC=cv;}
FXS.cure=(W,H,D)=>{const cx=W/2,cy=H*.5,k=Math.min(W,H)/600,f=2.4/D,BW=Math.min(W*.9,520*k),bs=BW/340,BO=_cuMake(),
  st=[],mo=Array.from({length:60},()=>({a:_fR()*6.283,r:_fRn(.2,1),ph:_fR(),v:_fRn(.4,1),s:_fRn(1.6,4.4)*k,c:_fR()<.5})),gl=[0,1,2,3,4].map(i=>({x:_fRn(-.45,.45),y:_fRn(-.1,.9),t0:.8+i*.18,s:_fRn(14,28)*k}));let ns=0;
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t),A=_fSm(0,.3,T)*fade,by=cy+30*k,top=by-150*bs;c.globalCompositeOperation='source-over';c.globalAlpha=fade;
  const bg=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.8);bg.addColorStop(0,'rgba(70,40,14,.8)');bg.addColorStop(1,'rgba(10,6,2,.95)');c.fillStyle=bg;c.fillRect(0,0,W,H);
  c.globalCompositeOperation='lighter';fxGlow(c,cx,by-60*bs,BW*1.2,'#ffb868',.28*A);c.globalCompositeOperation='source-over';c.globalAlpha=A*.55;c.fillStyle='#000';c.beginPath();c.ellipse(cx,by+106*bs,BW*.47,16*bs,0,0,7);c.fill();
  c.globalAlpha=A;c.drawImage(BO,cx-BW/2,by-150*bs,BW,BW*260/340);
  ns+=dt;while(ns>.02){ns-=.02;const a=_fR()*6.283,r=Math.sqrt(_fR());st.push({x:cx+Math.cos(a)*BW*.24*r,y:by-150*bs+118*bs+Math.sin(a)*14*bs*r,l:0,v:_fRn(70,150)*k,ph:_fR()*9,sz:_fRn(18,34)*k,sw:_fRn(14,34)*k});}
  c.globalCompositeOperation='source-over';for(let i=st.length-1;i>=0;i--){const q=st[i];q.l+=dt;const life=q.l/2.2;if(life>1){st.splice(i,1);continue;}const x=q.x+Math.sin(q.ph+q.l*2.4)*q.sw*life*1.6,y=q.y-q.v*q.l*(1+life*.5);fxGlow(c,x,y,q.sz*(.8+life*1.8),'#fff6e8',Math.sin(life*3.14)*.17*A);}
  c.globalCompositeOperation='lighter';const hu=_fSm(.7,1.4,T);if(hu>0){for(const m of mo){const ph=(m.ph+T*.5*m.v)%1,rad=BW*.4*m.r*(1-ph*.3),a=m.a+ph*5,x=cx+Math.cos(a)*rad,y=by-150*bs+118*bs-ph*BW*.9;c.globalAlpha=Math.sin(ph*3.14)*.9*hu*A;c.fillStyle=m.c?'#9affb8':'#ffe898';c.fillRect(x,y,m.s,m.s);}
   for(const g of gl){const u=(T-g.t0)/.5;if(u<0||u>1)continue;const x=cx+g.x*BW,y=top+g.y*BW*.4;fxFlare(c,x,y,g.s*3*(.5+u*.5),'#c8ffd8',Math.sin(u*3.14)*.9*A);}
   for(let i=0;i<3;i++){const u=(T-.9-i*.18)/.8;if(u<0||u>1)continue;c.globalAlpha=(1-u)*.7*A;c.strokeStyle='#8affb0';c.lineWidth=(6*(1-u)+1)*k;c.beginPath();c.ellipse(cx,by-60*bs,u*W*.6,u*W*.6*.7,0,0,7);c.stroke();}
   const fl=Math.max(0,1-Math.abs(T-1.45)/.35);if(fl>0){c.globalAlpha=fl*.16*A;c.fillStyle='#d8ffe4';c.fillRect(0,0,W,H);fxGlow(c,cx,by-60*bs,BW,'#8affb0',fl*.5*A);}}};};

FXS.virus=(W,H,D)=>{const cx=W/2,cy=H*.46,k=Math.min(W,H)/600,Sp=Array.from({length:60},()=>({a:_fR()*6.283,v:_fRn(80,380)*k,s:_fRn(8,26)*k,ph:_fR()*9})),Vn=Array.from({length:12},(_,i)=>{const a=i/12*6.283,pts=[[0,0]];let ang=a;for(let j=1;j<9;j++){ang+=_fRn(-.45,.45);pts.push([pts[j-1][0]+Math.cos(ang)*_fRn(30,60)*k,pts[j-1][1]+Math.sin(ang)*_fRn(30,60)*k]);}return pts;});
  return(c,t,dt)=>{const fade=1-_fSm(D-.45,D,t),g=_fSm(0,1.5,t);c.globalCompositeOperation='source-over';
  const rad=Math.max(W,H)*.75*g,gr=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(10,rad));gr.addColorStop(0,'rgba(120,255,60,.5)');gr.addColorStop(.6,'rgba(80,40,120,.45)');gr.addColorStop(1,'rgba(40,10,60,0)');c.globalAlpha=fade;c.fillStyle=gr;c.fillRect(0,0,W,H);
  c.globalCompositeOperation='lighter';c.lineCap='round';
  for(const pts of Vn){const n=Math.floor(pts.length*_fSm(.1,1.3,t));c.globalAlpha=.7*fade;c.strokeStyle='#9aff40';c.lineWidth=2.4*k;c.beginPath();c.moveTo(cx,cy);for(let j=1;j<=n&&j<pts.length;j++)c.lineTo(cx+pts[j][0],cy+pts[j][1]);c.stroke();}
  for(const s of Sp){const d=s.v*t,x=cx+Math.cos(s.a)*d,y=cy+Math.sin(s.a)*d*.85+Math.sin(t*3+s.ph)*8*k,r=s.s*(.8+.2*Math.sin(t*6+s.ph));c.globalAlpha=Math.max(0,1-t/D*.7)*fade;c.fillStyle='#b8ff60';c.strokeStyle='#e8ffb0';c.lineWidth=1.4;c.beginPath();c.arc(x,y,r,0,6.283);c.fill();for(let i=0;i<8;i++){const a=i*.785+t;c.beginPath();c.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);c.lineTo(x+Math.cos(a)*r*1.6,y+Math.sin(a)*r*1.6);c.stroke();}}
  c.globalCompositeOperation='source-over';c.globalAlpha=fade*_fSm(0,.3,t)*(1-_fSm(.6,1.2,t));c.strokeStyle='#d8ff80';c.lineWidth=7*k;for(let i=0;i<3;i++){const a=i*2.094-1.57;c.beginPath();c.arc(cx+Math.cos(a)*26*k,cy+Math.sin(a)*26*k,30*k,a-.7,a+.7);c.stroke();}
  c.globalAlpha=fade*(1-g)*.0;c.globalAlpha=1;};};
// ---- 恐竜化（リアル版）：爬虫類の目 → 閃光 → 鱗と牙を持つ巨大な頭が飛び込み咆哮する ----
let _dnC=null;
function _dnMake(){
  if(_dnC)return _dnC;
  const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
  const tl=mk(64,56),g=tl.getContext('2d');
  for(let row=0;row<2;row++)for(let col=-1;col<3;col++){const x=col*32+(row?16:0)+16,y=row*28+14,r=g.createRadialGradient(x-4,y-5,2,x,y,19);r.addColorStop(0,'rgba(255,255,215,.5)');r.addColorStop(.55,'rgba(120,150,60,.12)');r.addColorStop(1,'rgba(8,22,6,.72)');g.fillStyle=r;g.beginPath();g.ellipse(x,y,16,14,0,0,7);g.fill();g.strokeStyle='rgba(6,18,4,.8)';g.lineWidth=1.4;g.stroke();}
  const tooth=(c,x,y,len,wd,up)=>{const d=up?-1:1,gr=c.createLinearGradient(0,y,0,y+d*len);gr.addColorStop(0,'#7a6a44');gr.addColorStop(.4,'#efe6c2');gr.addColorStop(1,'#fffbe8');c.fillStyle=gr;c.strokeStyle='rgba(30,20,8,.6)';c.lineWidth=1.2;c.beginPath();c.moveTo(x-wd/2,y);c.quadraticCurveTo(x-wd*.35,y+d*len*.6,x+wd*.1,y+d*len);c.quadraticCurveTo(x+wd*.45,y+d*len*.55,x+wd/2,y);c.closePath();c.fill();c.stroke();};
  const A=mk(600,360),a=A.getContext('2d'),pat=a.createPattern(tl,'repeat');
  for(let i=0;i<12;i++){const x=70+i*22,y=188+(x-60)*.104;tooth(a,x,y,i<3?40:22+(i%3)*6,i<3?15:12,false);}
  const sk=new Path2D('M30 150C30 120 50 100 90 92C150 60 230 40 310 50C380 56 450 80 500 130C530 160 540 200 520 230L470 240L260 215L120 200L40 190C28 175 26 160 30 150Z');
  let g1=a.createLinearGradient(0,40,0,240);g1.addColorStop(0,'#35562a');g1.addColorStop(.5,'#5d7c34');g1.addColorStop(1,'#a89a58');a.fillStyle=g1;a.fill(sk);
  a.save();a.clip(sk);a.fillStyle=pat;a.fillRect(0,0,600,360);a.strokeStyle='rgba(14,24,10,.55)';a.lineCap='round';for(let i=0;i<7;i++){a.lineWidth=7+(i%3)*2;a.beginPath();a.moveTo(130+i*58,52+Math.abs(i-3)*10);a.quadraticCurveTo(150+i*58,110,120+i*58,200);a.stroke();}
  const sh=a.createLinearGradient(0,40,0,250);sh.addColorStop(0,'rgba(255,220,140,.3)');sh.addColorStop(.3,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.5)');a.fillStyle=sh;a.fillRect(0,0,600,360);const bk=a.createRadialGradient(520,170,10,520,170,200);bk.addColorStop(0,'rgba(0,0,0,.6)');bk.addColorStop(1,'rgba(0,0,0,0)');a.fillStyle=bk;a.fillRect(0,0,600,360);a.restore();
  a.strokeStyle='#0c1608';a.lineWidth=4;a.stroke(sk);a.strokeStyle='rgba(255,190,110,.7)';a.lineWidth=2.4;a.beginPath();a.moveTo(90,92);a.bezierCurveTo(150,60,230,40,310,50);a.bezierCurveTo(380,56,450,80,500,130);a.stroke();
  for(const[x,y,h]of[[120,86,18],[160,72,22],[205,62,18],[250,56,14]]){a.fillStyle='#4a6a30';a.strokeStyle='#0c1608';a.lineWidth=2.4;a.beginPath();a.moveTo(x-9,y+8);a.lineTo(x+1,y-h);a.lineTo(x+10,y+9);a.closePath();a.fill();a.stroke();}
  a.fillStyle='#2e4a24';a.strokeStyle='#0c1608';a.lineWidth=3;a.beginPath();a.moveTo(280,100);a.quadraticCurveTo(325,56,380,90);a.quadraticCurveTo(340,82,298,110);a.closePath();a.fill();a.stroke();
  a.fillStyle='#10180a';a.beginPath();a.ellipse(332,106,31,23,-.15,0,7);a.fill();
  const ir=a.createRadialGradient(332,106,2,332,106,22);ir.addColorStop(0,'#fff6b0');ir.addColorStop(.5,'#ffb818');ir.addColorStop(1,'#8a3a00');a.fillStyle=ir;a.beginPath();a.ellipse(332,106,22,19,-.15,0,7);a.fill();
  a.strokeStyle='rgba(90,30,0,.5)';a.lineWidth=1;for(let i=0;i<22;i++){const an=i/22*6.283;a.beginPath();a.moveTo(332+Math.cos(an)*6,106+Math.sin(an)*6);a.lineTo(332+Math.cos(an)*20,106+Math.sin(an)*18);a.stroke();}
  a.fillStyle='#000';a.beginPath();a.ellipse(332,106,4.4,17,-.15,0,7);a.fill();a.fillStyle='rgba(255,255,255,.92)';a.beginPath();a.arc(324,98,4,0,7);a.fill();a.strokeStyle='#0a1206';a.lineWidth=5;a.beginPath();a.ellipse(332,106,31,23,-.15,3.3,6.1);a.stroke();
  a.fillStyle='#0a1006';a.beginPath();a.ellipse(76,108,9,5.5,.5,0,7);a.fill();a.strokeStyle='rgba(130,170,80,.6)';a.lineWidth=2;a.stroke();
  a.strokeStyle='#0c1608';a.lineWidth=3.4;a.beginPath();a.moveTo(40,190);a.lineTo(120,200);a.lineTo(260,215);a.lineTo(470,240);a.stroke();
  const B=mk(600,360),b=B.getContext('2d');
  b.fillStyle=(()=>{const t=b.createLinearGradient(0,200,0,250);t.addColorStop(0,'#c0505a');t.addColorStop(1,'#7a1a24');return t;})();b.beginPath();b.moveTo(90,216);b.quadraticCurveTo(200,194,330,222);b.quadraticCurveTo(390,232,430,246);b.lineTo(430,254);b.quadraticCurveTo(250,238,90,228);b.closePath();b.fill();b.strokeStyle='rgba(40,4,8,.7)';b.lineWidth=2;b.stroke();
  for(let i=0;i<10;i++){const x=80+i*24,y=204+(x-60)*.12;tooth(b,x,y,18+(i%3)*5,11,true);}
  const jw=new Path2D('M40 200L260 218L470 244C490 270 470 300 430 300C330 316 150 290 60 250C40 235 34 215 40 200Z'),j1=b.createLinearGradient(0,200,0,310);j1.addColorStop(0,'#5a7432');j1.addColorStop(1,'#c4b678');b.fillStyle=j1;b.fill(jw);
  b.save();b.clip(jw);b.fillStyle=b.createPattern(tl,'repeat');b.fillRect(0,0,600,360);const s2=b.createLinearGradient(0,200,0,310);s2.addColorStop(0,'rgba(0,0,0,.35)');s2.addColorStop(1,'rgba(255,230,160,.22)');b.fillStyle=s2;b.fillRect(0,0,600,360);b.restore();b.strokeStyle='#0c1608';b.lineWidth=4;b.stroke(jw);b.strokeStyle='rgba(255,190,110,.6)';b.lineWidth=2.2;b.beginPath();b.moveTo(60,250);b.bezierCurveTo(150,290,330,316,430,300);b.stroke();
  return _dnC={A,B,tl};}
FXS.dino=(W,H,D)=>{const k=Math.min(W,H)/600,cx=W/2,cy=H*.5,{A,B,tl}=_dnMake(),f=2.4/D;let pt=null;
  const lv=Array.from({length:30},()=>({a:_fRn(2.4,4.0),v:_fRn(500,1300)*k,r:_fR()*6,vr:_fRn(-8,8),s:_fRn(8,20)*k,dl:_fRn(0,.5),d:_fR()<.5})),
  ds=Array.from({length:44},()=>({x:_fRn(-.1,1.1)*W,v:_fRn(40,160)*k,s:_fRn(30,90)*k,dl:_fRn(0,.35),vx:_fRn(-80,80)*k})),
  cr=Array.from({length:9},()=>{const a=_fRn(-3.0,-.15),o=[[0,0]];let x=0,y=0,an=a;for(let i=0;i<6;i++){an+=_fRn(-.5,.5);x+=Math.cos(an)*_fRn(30,70)*k;y+=Math.sin(an)*_fRn(30,70)*k;o.push([x,y]);}return o;}),
  sp=[],cl=[0,1,2].map(i=>({x0:W*(.25+i*.18),y0:H*.1+i*H*.03,x1:W*(.5+i*.2),y1:H*(.78+i*.03),t0:1.45+i*.07}));let ns=0,nb=0;
  const skin=(c,T)=>{if(!pt)pt=c.createPattern(tl,'repeat');const g=c.createRadialGradient(cx,cy,W*.1,cx,cy,Math.max(W,H)*.7);g.addColorStop(0,'#3a5a24');g.addColorStop(1,'#0a1406');c.fillStyle=g;c.fillRect(0,0,W,H);c.save();c.scale(2.6*k+.6,2.6*k+.6);c.globalAlpha*=.85;c.fillStyle=pt;c.fillRect(0,0,W,H);c.restore();const v=c.createRadialGradient(cx,cy,W*.2,cx,cy,Math.max(W,H)*.65);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.85)');c.fillStyle=v;c.fillRect(0,0,W,H);};
  const eye=(c,T,t)=>{const ew=W*.92,open=_fSm(.05,.42,T),pw=1-.84*_fSm(.3,.56,T),lk={x:Math.sin(t*9)*ew*.02*(1-_fSm(.4,.55,T)),y:Math.cos(t*7)*ew*.012},eh=ew*.3*open;if(eh<2)return;c.save();c.translate(cx,cy);c.beginPath();c.moveTo(-ew/2,0);c.quadraticCurveTo(0,-eh*1.5,ew/2,0);c.quadraticCurveTo(0,eh*1.5,-ew/2,0);c.save();c.clip();c.fillStyle='#1a1004';c.fillRect(-ew,-ew,ew*2,ew*2);const R=ew*.23,ir=c.createRadialGradient(lk.x,lk.y,R*.1,lk.x,lk.y,R);ir.addColorStop(0,'#fff6b0');ir.addColorStop(.45,'#ffb818');ir.addColorStop(1,'#7a3000');c.fillStyle=ir;c.beginPath();c.arc(lk.x,lk.y,R,0,7);c.fill();c.strokeStyle='rgba(100,36,0,.45)';c.lineWidth=1.4;for(let i=0;i<40;i++){const an=i/40*6.283;c.beginPath();c.moveTo(lk.x+Math.cos(an)*R*.3,lk.y+Math.sin(an)*R*.3);c.lineTo(lk.x+Math.cos(an)*R*.98,lk.y+Math.sin(an)*R*.98);c.stroke();}c.fillStyle='#000';c.beginPath();c.ellipse(lk.x,lk.y,R*pw,R*.98,0,0,7);c.fill();c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(lk.x-R*.34,lk.y-R*.36,R*.14,0,7);c.fill();const sh=c.createLinearGradient(0,-eh,0,eh);sh.addColorStop(0,'rgba(0,0,0,.75)');sh.addColorStop(.35,'rgba(0,0,0,0)');sh.addColorStop(.65,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.6)');c.fillStyle=sh;c.fillRect(-ew,-eh*1.5,ew*2,eh*3);c.restore();c.strokeStyle='#050c04';c.lineWidth=ew*.03;c.stroke();c.restore();};
  return(c,t,dt)=>{const T=t*f,fade=1-_fSm(D-.45,D,t);c.globalCompositeOperation='source-over';c.globalAlpha=fade;
  const dk=c.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*.8);dk.addColorStop(0,'rgba(60,24,6,.7)');dk.addColorStop(1,'rgba(4,6,2,.92)');c.fillStyle=dk;c.fillRect(0,0,W,H);
  if(T<.66){c.globalAlpha=fade*_fSm(0,.12,T);skin(c,T);eye(c,T,t);c.globalCompositeOperation='lighter';fxGlow(c,cx,cy,W*.55,'#ffb020',.3*_fSm(.1,.4,T)*fade);c.globalCompositeOperation='source-over';}
  if(T>=.6){const p=_fSm(.6,.86,T),imp=1-_fSm(.86,1.2,T),roar=_fSm(.9,1.1,T)*(1-_fSm(2.0,2.2,T)),shk=(imp*14+roar*3.5+(T>.6&&T<.7?10:0))*k,w=Math.min(W*1.28,H*.72)*(1.9-.9*p),ang=-.06-.1*roar+(1-p)*.1,hx=cx+w*.07+_fRn(-1,1)*shk,hy=cy+H*.03+(1-p)*H*.05+_fRn(-1,1)*shk,s=w/600,open=.62*_fSm(.85,1.1,T)*(1-_fSm(2.0,2.22,T))+roar*Math.sin(t*38)*.02;
   c.globalAlpha=fade*_fSm(.6,.68,T);c.save();c.translate(hx,hy);c.scale(s,s);c.rotate(ang);c.translate(-300,-180);
   if(open>.02){const q=(px,py)=>{const dx=px-480,dy=py-236,co=Math.cos(-open),si=Math.sin(-open);return[480+dx*co-dy*si,236+dx*si+dy*co];},q1=q(60,205),q2=q(480,240),gr=c.createLinearGradient(0,200,0,340);gr.addColorStop(0,'#1a0408');gr.addColorStop(.5,'#5a0f18');gr.addColorStop(1,'#2a0610');c.fillStyle=gr;c.beginPath();c.moveTo(60,195);c.lineTo(480,238);c.lineTo(q2[0],q2[1]);c.lineTo(q1[0],q1[1]);c.closePath();c.fill();}
   c.save();c.translate(480,236);c.rotate(-open);c.translate(-480,-236);c.drawImage(B,0,0);c.restore();c.drawImage(A,0,0);c.restore();
   const P=(lx,ly)=>{const dx=(lx-300)*s,dy=(ly-180)*s,co=Math.cos(ang),si=Math.sin(ang);return[hx+dx*co-dy*si,hy+dx*si+dy*co];},mo=P(50,220),no=P(76,108);
   c.globalAlpha=fade;
   if(T>.7){c.globalCompositeOperation='lighter';c.strokeStyle='#ffb050';for(let i=0;i<4;i++){const u=(T-.9-i*.16)/1.1;if(u<0||u>1)continue;c.globalAlpha=(1-u)*.6*fade;c.lineWidth=8*(1-u)+1;c.beginPath();c.arc(mo[0],mo[1],u*Math.max(W,H)*.8,0,7);c.stroke();}c.globalAlpha=fade;c.globalCompositeOperation='source-over';}
   if(T>.66){const u=T-.66;for(const d of ds){const e=u-d.dl;if(e<0||e>1.5)continue;fxGlow(c,d.x+d.vx*e,H*.96-d.v*e*1.2,d.s*(.7+e),'#8a7050',(1-e/1.5)*.5*fade);}c.strokeStyle='#ffb050';c.lineWidth=2.4;c.lineJoin='round';c.globalCompositeOperation='lighter';for(const o of cr){const n=Math.min(o.length,Math.floor(u*14)+1);c.globalAlpha=Math.max(0,1-u/1.4)*.7*fade;c.beginPath();c.moveTo(cx+o[0][0],H*.97+o[0][1]);for(let i=1;i<n;i++)c.lineTo(cx+o[i][0],H*.97+o[i][1]);c.stroke();}c.globalCompositeOperation='source-over';}
   if(T>.9){const u=T-.9;for(const l of lv){const e=u-l.dl;if(e<0||e>1.6)continue;c.save();c.translate(mo[0]+Math.cos(l.a)*l.v*e,mo[1]+Math.sin(l.a)*l.v*e+300*k*e*e);c.rotate(l.r+l.vr*e);c.globalAlpha=Math.max(0,1-e/1.6)*fade;fxLeaf(c,l.s,l.d?'#7ab04a':'#a88a3a',l.d?'#2a5a1a':'#5a3a12');c.restore();}}
   if(roar>.3&&t>ns){ns=t+.025;for(let i=0;i<2;i++)sp.push({x:mo[0],y:mo[1]+_fRn(-8,8)*k,vx:-_fRn(160,520)*k,vy:_fRn(-120,120)*k,l:0});}
   if(T>1.2&&t>nb){nb=t+.28;sp.push({x:no[0],y:no[1],vx:-_fRn(20,60)*k,vy:-_fRn(10,40)*k,l:0,m:1});}
   c.globalAlpha=fade;for(let i=sp.length-1;i>=0;i--){const q=sp[i];q.l+=dt;if(q.l>(q.m?1.1:.5)){sp.splice(i,1);continue;}q.x+=q.vx*dt;q.y+=q.vy*dt+(q.m?-20*k*dt:200*k*dt);if(q.m){fxGlow(c,q.x,q.y,(14+q.l*70)*k,'#e8f0e0',.4*(1-q.l/1.1)*fade);}else{c.globalAlpha=(1-q.l/.5)*.9*fade;c.fillStyle='#fff';c.beginPath();c.arc(q.x,q.y,1.6*k+.6,0,7);c.fill();}}
   for(const g of cl){const e=Math.min(1,(T-g.t0)*5);if(e<=0||T>g.t0+.65)continue;const x1=g.x0+(g.x1-g.x0)*e,y1=g.y0+(g.y1-g.y0)*e,mx=(g.x0+x1)/2,my=(g.y0+y1)/2,nx=-(y1-g.y0),ny=x1-g.x0,nl=Math.hypot(nx,ny)||1,wd=30*k*Math.sin(Math.PI*Math.min(1,e)),al=Math.max(0,1-(T-g.t0)/.65)*fade;c.globalAlpha=al;c.fillStyle='#140404';c.beginPath();c.moveTo(g.x0,g.y0);c.quadraticCurveTo(mx+nx/nl*wd,my+ny/nl*wd,x1,y1);c.quadraticCurveTo(mx-nx/nl*wd,my-ny/nl*wd,g.x0,g.y0);c.fill();c.globalCompositeOperation='lighter';c.strokeStyle='#ff8a30';c.lineWidth=2.4;c.shadowColor='#ffb050';c.shadowBlur=14;c.stroke();c.shadowBlur=0;c.globalCompositeOperation='source-over';}
   c.globalAlpha=fade;}
  const fl=Math.max(0,1-Math.abs(T-.64)/.1);if(fl>0){c.globalCompositeOperation='lighter';c.globalAlpha=fl*.9*fade;c.fillStyle='#fff3d0';c.fillRect(0,0,W,H);}};};
// ---- 背景4種（400×800のSVG。見せ場は高さ340〜470の帯）----
const _g4Fin=()=>`<defs><radialGradient id="vgx" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient><filter id="grn" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .9 -.35"/></filter></defs><rect width="400" height="800" filter="url(#grn)" opacity=".16"/><rect width="400" height="800" fill="url(#vgx)"/>`;
const _g4Kn=(x,y,s,o,col)=>`<g opacity="${o}" fill="${col}"><circle cx="${x}" cy="${y-60*s}" r="${18*s}"/><path d="M${x-6*s} ${y-76*s}Q${x+14*s} ${y-104*s} ${x+40*s} ${y-92*s}Q${x+18*s} ${y-88*s} ${x+10*s} ${y-76*s}Z"/><path d="M${x-34*s} ${y+60*s}L${x-26*s} ${y-38*s}L${x+26*s} ${y-38*s}L${x+34*s} ${y+60*s}Z"/><path d="M${x+30*s} ${y+20*s}L${x+92*s} ${y-70*s}" stroke="${col}" stroke-width="${4*s}" fill="none"/></g>`;
// ---- 背景（リアル調）。静止画のSVGに、キャンバスの動き（FIELD_ANIMS）を重ねる ----
const _g4Drop=(x,y,s,o,f)=>{const w=1.9*s,h=6.5*s,q=v=>v.toFixed(1);return `<path d="M${q(x)} ${q(y-h)}C${q(x+w*.3)} ${q(y-h*.4)} ${q(x+w)} ${q(y)} ${q(x)} ${q(y+w*1.1)}C${q(x-w)} ${q(y)} ${q(x-w*.3)} ${q(y-h*.4)} ${q(x)} ${q(y-h)}Z" fill="url(#dg)" opacity="${o}"${f?` filter="url(#${f})"`:''}/>`;};
LOBBY_SCENES.stillrain=function(){const r=_rng(612);let far='',mid='',near='',bok='',refl='';
  for(let i=0;i<150;i++)far+=_g4Drop(r()*400,40+r()*560,.35+r()*.35,(.25+r()*.4).toFixed(2));
  for(let i=0;i<50;i++)mid+=_g4Drop(r()*400,40+r()*600,.8+r()*.5,(.45+r()*.4).toFixed(2));
  for(let i=0;i<12;i++){const x=r()*400,y=60+r()*560,s=1.8+r()*1.4;near+=_g4Drop(x,y,s,.7,'b2')+`<ellipse cx="${(x-.5*s).toFixed(1)}" cy="${(y-2*s).toFixed(1)}" rx="${(.6*s).toFixed(1)}" ry="${(1.8*s).toFixed(1)}" fill="#fff" opacity=".5" filter="url(#b2)"/>`;}
  [[40,392,'#ffcf80',16],[120,404,'#ff9a70',12],[210,388,'#9ad0ff',18],[300,400,'#ffcf80',14],[370,384,'#ff9a70',20]].forEach(([x,y,c,rr])=>{bok+=`<circle cx="${x}" cy="${y}" r="${rr}" fill="${c}" opacity=".5" filter="url(#b6)"/><circle cx="${x}" cy="${y}" r="${rr*.35}" fill="#fff" opacity=".7" filter="url(#b2)"/>`;refl+=`<ellipse cx="${x}" cy="${y+92}" rx="${rr*.7}" ry="72" fill="${c}" opacity=".25" filter="url(#b6)"/>`;});
  return `<defs>${_bf}${_gs('sk',[[0,'#192136'],[.45,'#44567a'],[.62,'#8fa2bc'],[1,'#8fa2bc']])}${_gs('gr',[[0,'#1a2438'],[.4,'#0b101e'],[1,'#05070e']])}${_gs('hz',[[0,'#9db0c8'],[1,'#9db0c8']])}<linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#86bff0"/></linearGradient></defs>
<rect width="400" height="800" fill="url(#sk)"/><rect y="90" width="400" height="360" filter="url(#tb)" opacity=".45"/>
${_bld(r,300,470,'#2a354e','#ffd9a0',4,14,36)}<rect y="300" width="400" height="170" fill="#8fa2bc" opacity=".42"/>${_bld(_rng(8),330,470,'#161d30','#ffd9a0',6,18,44)}<rect y="340" width="400" height="130" fill="#8fa2bc" opacity=".16"/>${_bld(_rng(3),372,470,'#0a0e1a','#cfe8ff',5,22,52)}
${bok}<rect y="470" width="400" height="330" fill="url(#gr)"/><rect y="470" width="400" height="3" fill="#cfe8ff" opacity=".3"/>${refl}<ellipse cx="200" cy="560" rx="170" ry="22" fill="#9ad0ff" opacity=".07" filter="url(#b6)"/>
<rect y="436" width="400" height="60" filter="url(#tb)" opacity=".4"/>${far}${mid}${near}${_g4Fin()}`;};
FIELD_ANIMS.stillrain=function(){
  const gl=glowSprite('150,185,225'),gw=glowSprite('255,214,150'),mist=Array.from({length:7},(_,i)=>({x:_R(-100,500),y:_R(330,520),s:_R(160,300),v:_R(.05,.18)*(i%2?1:-1)})),
  gt=Array.from({length:24},()=>({x:_R(10,390),y:_R(80,620),ph:_R(0,6.28),sp:_R(.0015,.004),s:_R(3,9)})),bl=[],rp=[],fl=[];let nb=1500,nr=0;
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
  for(const m of mist){m.x+=m.v*dt;if(m.x>520)m.x=-120;if(m.x<-120)m.x=520;c.globalAlpha=.08;c.drawImage(gl,m.x-m.s,m.y-m.s*.35,m.s*2,m.s*.7);}
  c.fillStyle='#fff';for(const g of gt){const a=Math.max(0,Math.sin(g.ph+now*g.sp));if(a>.72){c.globalAlpha=(a-.72)*3.5;_spark4(c,g.x,g.y,g.s*(a-.6)*2.4);c.globalAlpha=(a-.72)*1.2;c.drawImage(gw,g.x-12,g.y-12,24,24);}}
  if(now>nb){nb=now+_R(2200,4200);const L=Math.random()<.5;bl.push({x:L?-40:440,y:_R(260,560),vx:(L?1:-1)*_R(16,24),vy:_R(-1.2,1.2)});}
  for(let i=bl.length-1;i>=0;i--){const b=bl[i];b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<-60||b.x>460){bl.splice(i,1);continue;}const g=c.createLinearGradient(b.x-b.vx*10,b.y-b.vy*10,b.x,b.y);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,.95)');c.globalAlpha=1;c.strokeStyle=g;c.lineWidth=2.4;c.beginPath();c.moveTo(b.x-b.vx*10,b.y-b.vy*10);c.lineTo(b.x,b.y);c.stroke();c.globalAlpha=.6;c.drawImage(gl,b.x-14,b.y-14,28,28);}
  if(now>nr){nr=now+_R(500,1100);fl.push({x:_R(20,380),y:_R(520,650),k:0});}
  for(let i=fl.length-1;i>=0;i--){const f=fl[i];f.k+=dt*1.2;const p=Math.min(1,f.k/10);c.globalAlpha=.8;c.strokeStyle='#dff0ff';c.lineWidth=1.4;c.beginPath();c.moveTo(f.x,f.y-260+p*220);c.lineTo(f.x,f.y-220+p*220);c.stroke();if(p>=1){rp.push({x:f.x,y:f.y,r:0});fl.splice(i,1);}}
  c.lineWidth=1;c.strokeStyle='#bfe2ff';for(let i=rp.length-1;i>=0;i--){const q=rp[i];q.r+=.7*dt;if(q.r>28){rp.splice(i,1);continue;}c.globalAlpha=(1-q.r/28)*.7;c.beginPath();c.ellipse(q.x,q.y,q.r*1.8,q.r*.5,0,0,7);c.stroke();}
  const u=(now%14000)/14000,wx=60+u*280,wy=478-u*128,al=Math.sin(Math.PI*u),n=Math.floor(u*6);
  for(let i=0;i<=n;i++){const sx=60+i/6*280,sy=478-i/6*128+10;c.globalAlpha=.9*Math.max(0,1-(u*6-i)/3.2)*al;c.drawImage(gl,sx-18,sy-12,36,24);c.fillStyle='#dff0ff';c.beginPath();c.moveTo(sx,sy-6);c.lineTo(sx+9,sy);c.lineTo(sx,sy+5);c.lineTo(sx-9,sy);c.fill();}
  c.globalCompositeOperation='source-over';const sw=Math.sin(now*.012),bob=Math.abs(Math.sin(now*.012))*1.6;c.globalAlpha=(.55+.3*Math.sin(now*.004))*al;c.fillStyle='#16243f';c.strokeStyle='#bfe2ff';c.lineWidth=1.4;c.beginPath();c.arc(wx,wy-44-bob,7,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(wx-7,wy-35-bob);c.lineTo(wx+7,wy-35-bob);c.lineTo(wx+5,wy-14-bob);c.lineTo(wx-5,wy-14-bob);c.closePath();c.fill();c.stroke();c.lineCap='round';c.lineWidth=4.6;c.strokeStyle='#16243f';c.beginPath();c.moveTo(wx-2,wy-14-bob);c.lineTo(wx-2+sw*7,wy-bob);c.moveTo(wx+2,wy-14-bob);c.lineTo(wx+2-sw*7,wy-bob);c.stroke();
  c.globalCompositeOperation='lighter';c.strokeStyle='#cfe8ff';c.lineWidth=1;c.globalAlpha=.55*al;for(let k=-1;k<=1;k++){const yy=wy-60+((now*.12+k*20)%60);c.beginPath();c.moveTo(wx+k*5,yy);c.lineTo(wx+k*5,yy+10);c.stroke();}};};
LOBBY_SCENES.strafe=function(){const r=_rng(77);let stars='',trees='',hill='',brt='';
  for(let i=0;i<150;i++)stars+=`<circle cx="${(r()*400).toFixed(0)}" cy="${(r()*330).toFixed(0)}" r="${(.4+r()*1.1).toFixed(1)}" fill="#dfffee" opacity="${(.25+r()*.6).toFixed(2)}"${i%7===0?`><animate attributeName="opacity" values=".2;1;.2" dur="${(2+r()*3).toFixed(1)}s" repeatCount="indefinite"/></circle>`:'/>'}`;
  for(let x=-10;x<420;x+=9+r()*10){const h=20+r()*44,w=10+r()*8;trees+=`<path d="M${x.toFixed(0)} 482L${(x+w/2).toFixed(0)} ${(482-h).toFixed(0)}L${(x+w).toFixed(0)} 482Z" fill="#020a06"/>`;}
  [[330,'#0b241a'],[400,'#071a12'],[446,'#04120c']].forEach(([b,c],i)=>hill+=`<path d="${_ridge(_rng(30+i),{base:b,amp:24-i*5,rough:.52}).fill}" fill="${c}"/>`);
  for(let i=0;i<8;i++){const x=20+r()*360,y=476+r()*20;brt+=`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(14+r()*16).toFixed(0)}" ry="7" fill="#5affa0" opacity=".16" filter="url(#b6)"/>`;}
  return `<defs>${_bf}${_gs('sk',[[0,'#010608'],[.5,'#06201a'],[.8,'#12463a'],[1,'#1c5a48']])}<radialGradient id="scp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1a6a46" stop-opacity=".08"/><stop offset=".85" stop-color="#1a6a46" stop-opacity=".22"/><stop offset="1" stop-color="#4affa0" stop-opacity=".5"/></radialGradient><radialGradient id="mn"><stop offset="0" stop-color="#e8fff0"/><stop offset=".3" stop-color="#bfeed0" stop-opacity=".45"/><stop offset="1" stop-color="#bfeed0" stop-opacity="0"/></radialGradient></defs><rect width="400" height="800" fill="url(#sk)"/>${stars}<circle cx="320" cy="120" r="90" fill="url(#mn)"/><circle cx="320" cy="120" r="15" fill="#f4fff6"/>
<rect y="150" width="400" height="260" filter="url(#tb)" opacity=".5"/>${hill}<rect y="380" width="400" height="110" fill="#2aff9a" opacity=".05"/>
<circle cx="200" cy="395" r="180" fill="url(#scp)"/><g fill="none" stroke="#4affa0" stroke-width="1.4" opacity=".42"><circle cx="200" cy="395" r="45"/><circle cx="200" cy="395" r="90"/><circle cx="200" cy="395" r="135"/><circle cx="200" cy="395" r="180" stroke-width="3"/><path d="M200 215V575M20 395H380M72 267L328 523M328 267L72 523" stroke-width=".9"/></g>
<g stroke="#9affc0" stroke-width="1.4" opacity=".6">${Array.from({length:36},(_,i)=>{const a=i*Math.PI/18,l=i%3?5:10;return `<path d="M${(200+Math.cos(a)*180).toFixed(1)} ${(395+Math.sin(a)*180).toFixed(1)}L${(200+Math.cos(a)*(180-l)).toFixed(1)} ${(395+Math.sin(a)*(180-l)).toFixed(1)}"/>`;}).join('')}</g>
<rect y="482" width="400" height="318" fill="#020804"/>${trees}${brt}<rect x="352" y="404" width="5" height="74" fill="#020804"/><circle cx="354" cy="402" r="3" fill="#ff3030"><animate attributeName="opacity" values="1;.1;1" dur="1.6s" repeatCount="indefinite"/></circle>${_g4Fin()}`;};
FIELD_ANIMS.strafe=function(){
  const CX=200,CY=395,R=180,gl=glowSprite('120,255,170'),go=glowSprite('255,170,70'),gs=glowSprite('120,120,110'),
  bl=Array.from({length:9},()=>{const a=_R(0,6.283),d=_R(40,165);return{x:CX+Math.cos(a)*d,y:CY+Math.sin(a)*d,a};}),
  em=Array.from({length:14},()=>{const x=_R(10,390),y=_R(484,520);let a=Math.atan2(y-CY,x-CX);if(a<0)a+=6.283;return{x,y,a};}),
  bub=[],pl=[],tr=[],bm=[],ex=[],sm=[];let np=1200;
  const plane=(c,p)=>{c.save();c.translate(p.x,p.y);c.scale(p.d*1.15,1.15);c.fillStyle='#04120c';c.strokeStyle='#7affa8';c.lineWidth=1.2;c.beginPath();c.moveTo(-30,0);c.quadraticCurveTo(-26,-6,-14,-6);c.lineTo(18,-6);c.quadraticCurveTo(28,-5,32,0);c.quadraticCurveTo(26,6,16,6);c.lineTo(-14,6);c.quadraticCurveTo(-26,5,-30,0);c.fill();c.stroke();c.beginPath();c.moveTo(-26,-3);c.lineTo(-38,-16);c.lineTo(-30,-16);c.lineTo(-16,-4);c.fill();c.stroke();c.beginPath();c.moveTo(-6,-6);c.lineTo(2,-24);c.lineTo(12,-24);c.lineTo(8,-6);c.fill();c.stroke();c.globalCompositeOperation='lighter';c.globalAlpha=.5;c.fillStyle='#bfffd8';c.beginPath();c.ellipse(34,0,2.4,12*Math.abs(Math.cos(performance.now()*.06))+2,0,0,7);c.fill();c.globalAlpha=Math.sin(performance.now()*.01)>0?1:.1;c.drawImage(go,-44,-24,16,16);c.restore();};
  return(c,dt,now,S)=>{const ang=(now*.001)%6.283;c.globalCompositeOperation='lighter';
  for(let i=0;i<16;i++){const a=ang-i*.045;c.globalAlpha=.17*(1-i/16);c.fillStyle='#2aff7a';c.beginPath();c.moveTo(CX,CY);c.arc(CX,CY,R,a-.05,a);c.closePath();c.fill();}
  c.globalAlpha=.95;c.strokeStyle='#b8ffd4';c.lineWidth=2;c.beginPath();c.moveTo(CX,CY);c.lineTo(CX+Math.cos(ang)*R,CY+Math.sin(ang)*R);c.stroke();
  const hit=a=>{let d=(ang-a)%6.283;if(d<0)d+=6.283;return Math.max(0,1-d/3.2);};
  for(const b of bl){c.globalAlpha=hit(b.a);c.drawImage(gl,b.x-10,b.y-10,20,20);c.fillStyle='#eaffee';c.fillRect(b.x-1.5,b.y-1.5,3,3);}
  if(Math.random()<.25*dt){const e=em[Math.floor(Math.random()*em.length)];bub.push({x:e.x,y:e.y,v:_R(.3,.6),a:e.a,ph:_R(0,6)});}
  for(let i=bub.length-1;i>=0;i--){const b=bub[i];b.y-=b.v*dt;b.x+=Math.sin(b.ph+now*.003)*.15*dt;if(b.y<395-0&&b.y<420){bub.splice(i,1);continue;}const k=Math.max(0,Math.min(1,(500-b.y)/80));c.globalAlpha=(1-k)*(.5+1.2*hit(b.a));c.drawImage(gl,b.x-5,b.y-5,10,10);}
  if(now>np&&pl.length<2){np=now+_R(5000,8000);const L=Math.random()<.5;pl.push({x:L?S.x0-50:S.x1+50,y:_R(215,320),d:L?1:-1,v:_R(2.2,3),tf:0,tb:0,tr:0});}
  for(let i=pl.length-1;i>=0;i--){const p=pl[i];p.x+=p.d*p.v*dt;p.y+=Math.sin(now*.003+i)*.12*dt;if(p.x<S.x0-80||p.x>S.x1+80){pl.splice(i,1);continue;}
   p.tr+=dt;if(p.tr>40){p.tr=0;ex.push({x:p.x,y:p.y,r:0,t:1});}
   if(p.x>70&&p.x<330){p.tf-=dt;if(p.tf<=0){p.tf=2;tr.push({x:p.x+p.d*34,y:p.y+6,vx:p.d*1.6,vy:12});}p.tb-=dt;if(p.tb<=0){p.tb=_R(55,90);bm.push({x:p.x,y:p.y+8,vx:p.d*p.v*.9,vy:0});}}}
  c.lineWidth=2;for(let i=tr.length-1;i>=0;i--){const t=tr[i];t.x+=t.vx*dt;t.y+=t.vy*dt;if(t.y>484){ex.push({x:t.x,y:484,r:0,t:0});tr.splice(i,1);continue;}c.globalAlpha=.9;c.strokeStyle='#ffe88a';c.beginPath();c.moveTo(t.x,t.y);c.lineTo(t.x-t.vx*2.6,t.y-t.vy*2.6);c.stroke();}
  for(let i=bm.length-1;i>=0;i--){const b=bm[i];b.vy+=.16*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.y>482){ex.push({x:b.x,y:482,r:0,t:2});bm.splice(i,1);continue;}c.globalAlpha=.6;c.drawImage(go,b.x-6,b.y-6,12,12);}
  for(let i=ex.length-1;i>=0;i--){const e=ex[i];e.r+=dt;const L=e.t===2?34:e.t===1?60:10,u=e.r/L;if(u>=1){ex.splice(i,1);continue;}if(e.t===1){c.globalAlpha=(1-u)*.55;c.strokeStyle='#6dff9a';c.lineWidth=1.4;c.beginPath();c.arc(e.x,e.y,u*150,0,7);c.stroke();continue;}const s=e.t===2?30+u*90:8+u*16;c.globalAlpha=(1-u)*.95;c.drawImage(go,e.x-s,e.y-s,s*2,s*2);if(e.t===2){c.strokeStyle='#ffb050';c.lineWidth=3*(1-u)+.5;c.beginPath();c.ellipse(e.x,e.y,u*110,u*18,0,0,7);c.stroke();if(u<.1)for(let k=0;k<3;k++)sm.push({x:e.x+_R(-12,12),y:e.y,vx:_R(-.2,.2),l:0});}}
  c.globalCompositeOperation='source-over';for(let i=sm.length-1;i>=0;i--){const m=sm[i];m.l+=dt;m.y-=.5*dt;m.x+=m.vx*dt;if(m.l>110){sm.splice(i,1);continue;}const s=14+m.l*.5;c.globalAlpha=.3*(1-m.l/110);c.drawImage(gs,m.x-s,m.y-s,s*2,s*2);}
  c.globalAlpha=1;for(const p of pl)plane(c,p);};};
LOBBY_SCENES.dino=function(){const r=_rng(4242);let fern='',tree='',ray='',sau='';
  [[20,490,1.3,-20],[90,494,1,10],[170,498,.8,-6],[300,492,1.4,15],[375,496,1.1,-10]].forEach(([x,y,s,a])=>{for(let i=-6;i<=6;i++){const an=(i*15+a)*Math.PI/180,ex=x+Math.sin(an)*100*s,ey=y-34*s-Math.abs(i)*3*s;fern+=`<path d="M${x} ${y}Q${x+Math.sin(an)*50*s} ${y-70*s} ${ex.toFixed(0)} ${ey.toFixed(0)}" stroke="#06120a" stroke-width="${(5*s).toFixed(1)}" fill="none" stroke-linecap="round"/><path d="M${x} ${y}Q${x+Math.sin(an)*50*s} ${y-70*s} ${ex.toFixed(0)} ${ey.toFixed(0)}" stroke="#ff9a50" stroke-width="1" fill="none" opacity=".45" transform="translate(1.5 -1.5)"/>`;}});
  [[60,470,118],[345,470,96]].forEach(([x,y,h])=>{tree+=`<path d="M${x-3} ${y}L${x-1.5} ${y-h}L${x+1.5} ${y-h}L${x+3} ${y}Z" fill="#06100a"/>`;for(let i=0;i<9;i++){const a=(i-4)*.42-1.57,l=34+r()*16;tree+=`<path d="M${x} ${y-h}Q${x+Math.cos(a)*l*.6} ${y-h+Math.sin(a)*l*.6-10} ${x+Math.cos(a)*l} ${y-h+Math.sin(a)*l+14}" stroke="#06100a" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;}});
  for(let i=0;i<7;i++){const a=-1.9+i*.2;ray+=`<path d="M290 360L${(290+Math.cos(a)*700).toFixed(0)} ${(360+Math.sin(a)*700).toFixed(0)}L${(290+Math.cos(a+.07)*700).toFixed(0)} ${(360+Math.sin(a+.07)*700).toFixed(0)}Z" fill="#ffe0a0" opacity=".07"/>`;}
  [[150,436,.7],[212,440,.55]].forEach(([x,y,s])=>sau+=`<g fill="#3a1a2a" transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="34" ry="15"/><path d="M-26 -6Q-44 -40 -40 -70L-34 -72Q-34 -42 -16 -12Z"/><ellipse cx="-38" cy="-72" rx="8" ry="4.4"/><path d="M30 -2Q56 4 76 20L70 22Q50 10 28 8Z"/><path d="M-18 8L-20 36L-12 36L-8 10ZM12 8L12 36L20 36L22 8Z"/></g>`);
  return `<defs>${_bf}${_gs('sk',[[0,'#1a0a30'],[.28,'#6a2858'],[.5,'#e0603a'],[.72,'#ffb860'],[1,'#ffe0a0']])}<radialGradient id="sun"><stop offset="0" stop-color="#fff6d8"/><stop offset=".35" stop-color="#ffc070"/><stop offset="1" stop-color="#ffb050" stop-opacity="0"/></radialGradient>${_gs('rv',[[0,'#ffcf88'],[1,'#7a3a40']])}${_gs('lv',[[0,'#ffd040'],[1,'#e02a08']])}</defs><rect width="400" height="800" fill="url(#sk)"/><rect y="120" width="400" height="300" filter="url(#tb)" opacity=".5"/><circle cx="290" cy="365" r="120" fill="url(#sun)"/><circle cx="290" cy="365" r="36" fill="#fff6d8"/>${ray}
<path d="M-10 458L96 322L128 334L226 458Z" fill="#2a0e14"/><path d="M96 322L128 334L140 352L120 362L100 352Z" fill="url(#lv)"><animate attributeName="opacity" values=".7;1;.7" dur="2.2s" repeatCount="indefinite"/></path><path d="M108 352Q104 390 92 440M122 358Q130 400 150 446" stroke="#ff6a20" stroke-width="2.4" fill="none" opacity=".85" filter="url(#b2)"/>
<path d="${_ridge(_rng(9),{base:432,amp:26,rough:.55}).fill}" fill="#6a3050" opacity=".8"/>${sau}<path d="${_ridge(_rng(13),{base:452,amp:16,rough:.5}).fill}" fill="#2a2a24"/><rect y="440" width="400" height="30" fill="#ffb860" opacity=".18"/>
<rect y="462" width="400" height="22" fill="url(#rv)" opacity=".7"/>${tree}
<g transform="translate(252 428) scale(1.05)"><g fill="#08120a"><path d="M-14 -58C-6 -78 30 -80 52 -58C70 -42 90 -20 150 -4C100 4 86 12 72 22L66 62L50 62L48 30C30 34 10 32 0 24L-4 62L-20 62L-22 24C-34 4 -26 -30 -14 -58Z"/><path d="M-18 -22L-38 -10L-34 -4L-14 -12Z"/><path d="M-30 -72L-6 -74L6 -40L-26 -18Z"/><g transform="translate(-70 -96) scale(.62)"><path d="${_DN.up}"/><path d="${_DN.lo}"/><path d="M12 52H90V62H12Z"/></g></g><path d="M-14 -58C-6 -78 30 -80 52 -58C70 -42 90 -20 150 -4C100 4 86 12 72 22L66 62L50 62L48 30C30 34 10 32 0 24L-4 62L-20 62L-22 24C-34 4 -26 -30 -14 -58Z" fill="none" stroke="#ffb860" stroke-width="1.6" opacity=".55"/></g>
<rect y="484" width="400" height="316" fill="#050c06"/>${fern}<rect y="440" width="400" height="60" filter="url(#tb)" opacity=".3"/>${_g4Fin()}`;};
FIELD_ANIMS.dino=function(){
  const gs=glowSprite('90,66,58'),go=glowSprite('255,150,60'),gw=glowSprite('255,236,210'),gy=glowSprite('220,255,120'),sm=[],em=[],pt=Array.from({length:3},(_,i)=>({x:_R(0,400),y:_R(180,320),sp:_R(.35,.6)*(i%2?-1:1),ph:_R(0,6),s:_R(.8,1.4)})),
  ff=Array.from({length:22},()=>({x:_R(0,400),y:_R(440,520),ph:_R(0,6.28)})),gl=Array.from({length:60},()=>({x:_R(150,400),y:_R(464,480),ph:_R(0,6.28),sp:_R(.002,.006),w:_R(3,12)}));let br=0;
  const ptero=(c,p,now)=>{const f=Math.sin(p.ph+now*.009)*.9,d=p.sp>0?1:-1;c.save();c.translate(p.x,p.y+Math.sin(now*.0012+p.ph)*8);c.scale(d*p.s,p.s);c.fillStyle='#12060a';c.strokeStyle='#12060a';c.lineWidth=1.6;c.beginPath();c.ellipse(0,0,9,3,0,0,7);c.fill();c.beginPath();c.moveTo(9,-1);c.lineTo(20,-2);c.lineTo(9,2);c.fill();c.beginPath();c.moveTo(14,-2);c.lineTo(8,-9);c.lineTo(12,-1);c.fill();for(const sg of[-1,1]){c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-8,sg*-4-f*18,-26,-f*26*.8+sg*3);c.quadraticCurveTo(-10,-f*6,-4,3);c.fill();}c.restore();};
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
  c.fillStyle='#ffe0a0';for(let i=0;i<7;i++){const a=-1.9+i*.2+Math.sin(now*.0004+i)*.015;c.globalAlpha=.05+.03*Math.sin(now*.0007+i*1.7);c.beginPath();c.moveTo(290,360);c.lineTo(290+Math.cos(a)*700,360+Math.sin(a)*700);c.lineTo(290+Math.cos(a+.07)*700,360+Math.sin(a+.07)*700);c.fill();}
  c.globalAlpha=.4+.25*Math.sin(now*.004);c.drawImage(go,92,306,50,50);
  if(Math.random()<.5*dt)sm.push({x:112+_R(-6,6),y:330,vx:_R(.2,.45),vy:-_R(.35,.7),l:0});if(Math.random()<.35*dt)em.push({x:112+_R(-8,8),y:332,vx:_R(-.2,.5),vy:-_R(.8,1.6),l:0});
  for(let i=em.length-1;i>=0;i--){const e=em[i];e.l+=dt;e.x+=(e.vx+Math.sin(e.l*.2)*.3)*dt;e.y+=e.vy*dt;if(e.l>90){em.splice(i,1);continue;}c.globalAlpha=1-e.l/90;c.drawImage(go,e.x-4,e.y-4,8,8);}
  for(const f of ff){c.globalAlpha=Math.max(0,Math.sin(f.ph+now*.003))*.8;c.drawImage(gy,f.x+Math.sin(now*.0007+f.ph)*14-5,f.y+Math.cos(now*.0009+f.ph)*8-5,10,10);}
  c.fillStyle='#ffe2a0';for(const g of gl){c.globalAlpha=Math.max(0,Math.sin(g.ph+now*g.sp))*.7;c.fillRect(g.x+Math.sin(now*.001+g.ph)*3-g.w/2,g.y,g.w,1.2);}
  c.globalCompositeOperation='source-over';for(let i=sm.length-1;i>=0;i--){const m=sm[i];m.l+=dt;m.x+=m.vx*dt;m.y+=m.vy*dt;if(m.l>260){sm.splice(i,1);continue;}const s=12+m.l*.36;c.globalAlpha=.34*Math.sin(Math.PI*Math.min(1,m.l/260))**.7;c.drawImage(gs,m.x-s,m.y-s,s*2,s*2);}
  if(now>br){br=now+_R(3000,4500);for(let k=0;k<5;k++)sm.push({x:188,y:355,vx:-_R(.15,.35),vy:-_R(.1,.3),l:200,w:1});}
  c.globalAlpha=1;for(const p of pt){p.x+=p.sp*dt;if(p.x>S.x1+40)p.x=S.x0-40;if(p.x<S.x0-40)p.x=S.x1+40;ptero(c,p,now);}};};
LOBBY_SCENES.rapier=function(){const r=_rng(909);let tile='',sh='',gh='',col='',bn='';
  for(let i=0;i<11;i++)tile+=`<path d="M${200+(i-5)*12} 470L${200+(i-5)*74} 800" stroke="#2a3558" stroke-width="1.6" opacity=".8"/>`;
  for(let y=486,k=0;y<800;k++,y+=10+k*6)tile+=`<path d="M0 ${y}H400" stroke="#2a3558" stroke-width="1.6" opacity=".8"/>`;
  for(let i=0;i<9;i++){const x=40+r()*320,y=494+r()*70,a=r()*180,sc=.8+r()*.7;sh+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${a.toFixed(0)}) scale(${sc.toFixed(2)})"><path d="M-14 -6L14 -9L10 7L-12 6Z" fill="url(#mt)" stroke="#05080f" stroke-width="1.6"/><path d="M-10 -4L10 -6" stroke="#fff" stroke-width="1.2" opacity=".6"/></g>`;}
  [[96,.9,.14],[150,.95,.22],[204,1,.32],[258,1.05,.48],[318,1.1,.8]].forEach(([x,s,o],i)=>gh+=_g4Kn(x,424,s*.55,o,i===4?'#dff0ff':'#6a8cff'));
  [30,370].forEach((x,i)=>{col+=`<rect x="${x-18}" y="150" width="36" height="340" fill="url(#cl)"/><rect x="${x-22}" y="140" width="44" height="14" fill="#2a3660"/><rect x="${x-22}" y="478" width="44" height="12" fill="#1a2240"/>`;bn+=`<path d="M${x-8} 170H${x+8}V250L${x} 238L${x-8} 250Z" fill="#8a1a2a" opacity=".85"/><path d="M${x-2} 300H${x+2}V312H${x-2}Z" fill="#3a2a1a"/>`;});
  return `<defs>${_bf}${_gs('wl',[[0,'#080e20'],[1,'#222c4c']])}<linearGradient id="lt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6e4ff" stop-opacity=".6"/><stop offset="1" stop-color="#d6e4ff" stop-opacity="0"/></linearGradient><linearGradient id="mt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d4dcea"/><stop offset=".5" stop-color="#7d8aa2"/><stop offset="1" stop-color="#3a4458"/></linearGradient><linearGradient id="cl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0c1228"/><stop offset=".6" stop-color="#1e2848"/><stop offset="1" stop-color="#0a0f20"/></linearGradient><radialGradient id="tg"><stop offset="0" stop-color="#ff9a40" stop-opacity=".55"/><stop offset="1" stop-color="#ff9a40" stop-opacity="0"/></radialGradient>${_gs('fl',[[0,'#1c2646'],[1,'#080c1a']])}</defs><rect width="400" height="800" fill="url(#wl)"/>
<g stroke="#101830" stroke-width="1.4" opacity=".7">${Array.from({length:12},(_,i)=>`<path d="M0 ${150+i*28}H400"/>`).join('')}</g>
<path d="M150 252V122Q200 56 250 122V252Z" fill="#0a1430" stroke="#4a5a8a" stroke-width="4"/><path d="M160 246V126Q200 74 240 126V246Z" fill="#b8d0ff" opacity=".6"/><path d="M200 74V246M160 170H240" stroke="#2a3a66" stroke-width="3"/><path d="M160 246L52 480H236L240 246Z" fill="url(#lt)" opacity=".75"/><path d="M164 246L110 480H210L226 246Z" fill="url(#lt)" opacity=".35"/>
<circle cx="27" cy="300" r="80" fill="url(#tg)"/><circle cx="373" cy="300" r="80" fill="url(#tg)"/>${col}${bn}
<path d="M0 484H400V800H0Z" fill="url(#fl)"/>${tile}<path d="M52 484L10 800H260L236 484Z" fill="#cfe0ff" opacity=".09"/><rect y="484" width="400" height="60" fill="#9ab8ff" opacity=".06" filter="url(#b6)"/>${sh}${gh}
<g fill="none" stroke="#fff" stroke-linecap="round" opacity=".7"><path d="M40 330Q200 292 360 340" stroke-width="2"/><path d="M60 400Q220 380 350 420" stroke-width="1.4"/></g>${_g4Fin()}`;};
FIELD_ANIMS.rapier=function(){
  const gl=glowSprite('150,185,255'),go=glowSprite('255,150,60'),mo=Array.from({length:70},()=>({y:_R(246,476),u:_R(0,1),vx:_R(-.05,.05),vy:_R(-.04,.1),ph:_R(0,6.28),s:_R(.6,1.7)})),fi=[],sp=[],sd=[],hist=[];let nd=1500,dash=null;
  const shaft=y=>[160-108*(y-246)/230,240-4*(y-246)/230];
  const knight=(c,x,y,s,col,a)=>{c.globalAlpha=a;c.fillStyle=col;c.beginPath();c.arc(x,y-60*s,18*s,0,7);c.fill();c.beginPath();c.moveTo(x-6*s,y-76*s);c.quadraticCurveTo(x+14*s,y-104*s,x+40*s,y-92*s);c.quadraticCurveTo(x+18*s,y-88*s,x+10*s,y-76*s);c.fill();c.beginPath();c.moveTo(x-34*s,y+60*s);c.lineTo(x-26*s,y-38*s);c.lineTo(x+26*s,y-38*s);c.lineTo(x+34*s,y+60*s);c.fill();c.strokeStyle=col;c.lineWidth=4*s;c.beginPath();c.moveTo(x+30*s,y+20*s);c.lineTo(x+92*s,y-70*s);c.stroke();};
  return(c,dt,now,S)=>{c.globalCompositeOperation='lighter';
  c.fillStyle='#d6e4ff';c.globalAlpha=.035+.02*Math.sin(now*.0008);c.beginPath();c.moveTo(160,246);c.lineTo(52,476);c.lineTo(236,476);c.lineTo(240,246);c.fill();
  for(const m of mo){m.u+=m.vy*.001*dt;m.y+=m.vy*dt;m.ph+=.01*dt;if(m.y>476||m.y<246){m.y=_R(246,300);}const[l,r]=shaft(m.y),x=l+(r-l)*((m.u+Math.sin(m.ph)*.03+10)%1);c.globalAlpha=(.35+.5*Math.sin(m.ph*2))*.8;c.fillStyle='#e8f0ff';c.fillRect(x,m.y,m.s,m.s);}
  for(const x of[27,373]){const fk=.75+.25*Math.sin(now*.03+x)+.1*Math.sin(now*.071);c.globalAlpha=.5*fk;c.drawImage(go,x-44,256,88,88);c.globalAlpha=.95;const g=c.createRadialGradient(x,300,0,x,300,14);g.addColorStop(0,'#fff8d0');g.addColorStop(.4,'#ffb040');g.addColorStop(1,'rgba(255,80,10,0)');c.fillStyle=g;c.beginPath();c.moveTo(x-7,308);c.quadraticCurveTo(x-10+Math.sin(now*.02)*3,292,x+Math.sin(now*.025)*3,278-3*fk);c.quadraticCurveTo(x+10,292,x+7,308);c.fill();if(Math.random()<.08*dt)sp.push({x:x,y:284,vx:_R(-.3,.3),vy:-_R(.5,1.1),l:0});}
  for(let i=sp.length-1;i>=0;i--){const p=sp[i];p.l+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.l>50){sp.splice(i,1);continue;}c.globalAlpha=1-p.l/50;c.fillStyle='#ffc060';c.fillRect(p.x,p.y,1.6,1.6);}
  if(!dash&&now>nd){const L=Math.random()<.5;dash={x:L?S.x0-60:S.x1+60,d:L?1:-1,y:_R(412,440),t:0,sh:false};hist.length=0;}
  if(dash){dash.t+=dt;dash.x+=dash.d*26*dt;hist.push({x:dash.x,y:dash.y});if(hist.length>9)hist.shift();const mid=(S.x0+S.x1)/2;
   if(!dash.sh&&(dash.x-mid)*dash.d>-20){dash.sh=true;for(let k=0;k<10;k++){const a=_R(0,6.28),v=_R(2,7);sd.push({x:mid,y:dash.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-3,r:_R(0,6),vr:_R(-.3,.3),l:0});}}
   c.strokeStyle='#fff';c.lineWidth=3;const h0=hist[0];const g=c.createLinearGradient(h0.x,0,dash.x,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(220,235,255,.95)');c.strokeStyle=g;c.globalAlpha=1;c.beginPath();c.moveTo(h0.x,dash.y-20);c.lineTo(dash.x,dash.y-20);c.stroke();c.drawImage(gl,dash.x-30,dash.y-50,60,60);
   hist.forEach((h,i)=>knight(c,h.x,h.y,.5,i===hist.length-1?'#f2f8ff':'#6a8cff',(i+1)/hist.length*(i===hist.length-1?.9:.4)));
   if((dash.x-mid)*dash.d>S.x1-S.x0){dash=null;nd=now+_R(4500,7000);}}
  c.globalCompositeOperation='source-over';for(let i=sd.length-1;i>=0;i--){const p=sd[i];p.l+=dt;p.vy+=.35*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;if(p.y>520){p.y=520;p.vy*=-.35;p.vx*=.7;}if(p.l>110){sd.splice(i,1);continue;}c.save();c.translate(p.x,p.y);c.rotate(p.r);c.globalAlpha=Math.min(1,(110-p.l)/30);c.fillStyle='#b4c2d6';c.strokeStyle='#05080f';c.lineWidth=1.2;c.beginPath();c.moveTo(-8,-4);c.lineTo(8,-6);c.lineTo(6,4);c.lineTo(-7,4);c.closePath();c.fill();c.stroke();c.restore();}};};
Object.assign(FIELD_SCENE_FOCUS,{stillrain:50,strafe:50,dino:56,rapier:55});

var GOLD_FX={};GACHA_ITEMS.forEach(it=>{if(it.gold&&it.fxId)GOLD_FX[it.fxId]=it.id;});
// ===== 黄金の精神のアイコン：太い輪郭・鮮やかな色・ハイライトのマンガ調（オリジナルの絵柄） =====
const _GS='stroke="#000" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"';
const GOLD_SVG={
  thread:['#7a2cd0',`<circle cx="22" cy="27" r="12" fill="#ff7ac8" ${_GS}/><path d="M12 23Q22 15 32 25M11 29Q22 21 33 31M14 35Q24 29 31 37" fill="none" stroke="#000" stroke-width="1.6"/><path d="M32 22Q43 15 39 8Q35 4 31 10" fill="none" stroke="#000" stroke-width="5.6" stroke-linecap="round"/><path d="M32 22Q43 15 39 8Q35 4 31 10" fill="none" stroke="#ffe03a" stroke-width="3" stroke-linecap="round"/>`],
  bubble:['#18b4d8',`<circle cx="24" cy="26" r="15" fill="#c8f6ff" ${_GS}/><path d="M33 34Q37 28 36 22" fill="none" stroke="#ff8ac8" stroke-width="3" stroke-linecap="round"/><path d="M13 22Q15 14 23 13" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><circle cx="39" cy="11" r="4.5" fill="#e8fbff" ${_GS}/><circle cx="9" cy="12" r="3" fill="#e8fbff" ${_GS}/>`],
  aura:['#8a1ab8',`<path d="M4 26Q24 8 44 26Q24 44 4 26Z" fill="#fff" ${_GS}/><circle cx="24" cy="26" r="8.5" fill="#d048ff" ${_GS}/><circle cx="24" cy="26" r="3.8" fill="#000"/><circle cx="21.5" cy="23.5" r="1.8" fill="#fff"/><path d="M5 15L24 6L43 15" fill="none" stroke="#000" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/><text x="33" y="45" font-size="11" font-weight="900" fill="#ffe03a" stroke="#000" stroke-width="2" paint-order="stroke" font-family="serif">ゴ</text>`],
  sprout:['#30b846',`<path d="M8 41L12 32L22 30L33 33L40 41Z" fill="#a6acb8" ${_GS}/><path d="M24 31Q24 24 24 17" fill="none" stroke="#000" stroke-width="5.4" stroke-linecap="round"/><path d="M24 31Q24 24 24 17" fill="none" stroke="#5ae04a" stroke-width="2.6" stroke-linecap="round"/><path d="M24 22Q11 23 10 10Q23 9 24 22Z" fill="#8af27a" ${_GS}/><path d="M24 18Q36 19 38 7Q25 6 24 18Z" fill="#8af27a" ${_GS}/>`],
  rush:['#f09a10',`<path d="M13 23Q13 15 20 15H33Q40 15 40 23V30Q40 38 32 38H22Q13 38 13 30Z" fill="#ffd2a0" ${_GS}/><path d="M20 15V25M27 15V25M33.5 15V25" fill="none" stroke="#000" stroke-width="2"/><path d="M13 28Q6 28 8 33Q10 37 19 36" fill="#ffd2a0" ${_GS}/><path d="M3 14H10M2 22H8M3 30H9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`],
  claw:['#e0186e',`<path d="M43 24Q30 13 11 16L9 32Q30 35 43 24Z" fill="#ffd4ea" ${_GS}/><path d="M17 20Q27 19 34 22" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M2 18H8M2 24H6M2 30H8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M40 6L42 11L47 12L42 14L40 19L38 14L33 12L38 11Z" fill="#ffee50" ${_GS}/>`],
  mend:['#f0b818',`<circle cx="24" cy="25" r="16" fill="#fff4c4" ${_GS}/><path d="M24 9L20 20L28 26L22 41" fill="none" stroke="#000" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 9L20 20L28 26L22 41" fill="none" stroke="#ff9a00" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M39 6L40.6 10L45 11L40.6 13L39 17L37.4 13L33 11L37.4 10Z" fill="#fff" ${_GS}/>`],
  heavyrain:['#26359a',`<path d="M11 26Q5 26 5 20Q5 14 12 14Q14 7 24 8Q33 8 34 15Q43 15 43 21Q43 26 37 26Z" fill="#8a94d8" ${_GS}/><path d="M13 30Q18 36 13 41Q8 36 13 30Z" fill="#b4d8ff" ${_GS}/><path d="M24 31Q29 37 24 43Q19 37 24 31Z" fill="#b4d8ff" ${_GS}/><path d="M35 30Q40 36 35 41Q30 36 35 30Z" fill="#b4d8ff" ${_GS}/>`],
  timestop:['#1e9a9a',`<circle cx="24" cy="25" r="16" fill="#fff8e0" ${_GS}/><circle cx="24" cy="25" r="19.5" fill="none" stroke="#ffe03a" stroke-width="2" stroke-dasharray="4 3.5"/><path d="M24 11V14M24 36V39M10 25H13M35 25H38" fill="none" stroke="#000" stroke-width="2.4"/><path d="M24 25V14" fill="none" stroke="#000" stroke-width="3.4" stroke-linecap="round"/><path d="M24 25L32 29" fill="none" stroke="#000" stroke-width="3.4" stroke-linecap="round"/><circle cx="24" cy="25" r="2.6" fill="#e0186e" ${_GS}/>`]
};
Object.assign(GOLD_SVG,{
  redray:['#c01830',`<path d="M4 22Q24 6 44 22Q24 38 4 22Z" fill="#fff" ${_GS}/><circle cx="24" cy="22" r="8" fill="#ff2a3a" ${_GS}/><circle cx="24" cy="22" r="3.4" fill="#000"/><circle cx="21.6" cy="19.6" r="1.7" fill="#fff"/><path d="M14 30L8 44M34 30L40 44" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/><path d="M14 30L8 44M34 30L40 44" fill="none" stroke="#ffd0d0" stroke-width="2.4" stroke-linecap="round"/>`],
  lightblade:['#1a78b8',`<path d="M42 5L8 40L12 44L45 9Z" fill="#f0fcff" ${_GS}/><path d="M8 40L4 46L12 44Z" fill="#fff" ${_GS}/><path d="M22 8L25 14M32 18L38 18M14 20L8 18" fill="none" stroke="#ffe03a" stroke-width="2.4" stroke-linecap="round"/>`],
  chronolock:['#3a5a7a',`<circle cx="24" cy="25" r="16" fill="#e8f6ff" ${_GS}/><path d="M24 9L20 19L28 25L21 33L26 41M28 25L38 22M20 19L10 16" fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 12V25L32 29" fill="none" stroke="#3a7ab8" stroke-width="2.6" stroke-linecap="round"/>`],
  tankbomb:['#c05010',`<g ${_GS}><rect x="6" y="14" width="36" height="6" rx="3" fill="#2a2a30"/><rect x="6" y="34" width="36" height="6" rx="3" fill="#2a2a30"/><rect x="9" y="19" width="30" height="16" rx="4" fill="#ffc050"/><circle cx="22" cy="27" r="6.5" fill="#ffe090"/><rect x="26" y="25" width="17" height="4" fill="#e89020"/></g><circle cx="14" cy="27" r="2.6" fill="#ff2a2a"/><path d="M40 8L42 12L46 13L42 15L40 19L38 15L34 13L38 12Z" fill="#ffee50" ${_GS}/>`],
  rewind:['#8a1a9a',`<path d="M26 11L6 25L26 39Z" fill="#ff7ad8" ${_GS}/><path d="M44 11L24 25L44 39Z" fill="#7ae0ff" ${_GS}/>`],
  erase:['#2a2030',`<rect x="3" y="14" width="12" height="16" fill="#ff6a50" ${_GS}/><rect x="18" y="14" width="12" height="16" fill="#fff" stroke="#e0183a" stroke-width="2.2" stroke-dasharray="3 3"/><rect x="33" y="14" width="12" height="16" fill="#ffe03a" ${_GS}/><path d="M6 38Q24 48 42 38" fill="none" stroke="#000" stroke-width="5.4" stroke-linecap="round"/><path d="M6 38Q24 48 42 38" fill="none" stroke="#ffe03a" stroke-width="2.6" stroke-linecap="round"/><path d="M38 34L45 39L36 43Z" fill="#ffe03a" ${_GS}/>`],
  disc:['#2a3aa8',`<path d="M24 6A18 18 0 1 1 24 42A18 18 0 1 1 24 6ZM24 21A4 4 0 1 0 24 29A4 4 0 1 0 24 21Z" fill="#7ae0ff" fill-rule="evenodd" ${_GS}/><path d="M24 24L38 17A16 16 0 0 0 28 8Z" fill="#fff" opacity=".6"/><path d="M12 20A13 13 0 0 1 20 12" fill="none" stroke="#ff7ad8" stroke-width="3" stroke-linecap="round"/><path d="M36 30A13 13 0 0 1 28 38" fill="none" stroke="#ffe03a" stroke-width="3" stroke-linecap="round"/>`],
  gravflip:['#c0307a',`<path d="M16 6L6 18H13V30H19V18H26Z" fill="#ffe03a" ${_GS}/><path d="M32 42L42 30H35V18H29V30H22Z" fill="#7ae0ff" ${_GS}/>`],
  cosmos:['#2a1a6a',`<circle cx="24" cy="25" r="7" fill="#ffe8a0" ${_GS}/><path d="M24 25Q30 10 40 14M24 25Q10 22 8 34M24 25Q34 38 22 44" fill="none" stroke="#000" stroke-width="6.4" stroke-linecap="round"/><path d="M24 25Q30 10 40 14M24 25Q10 22 8 34M24 25Q34 38 22 44" fill="none" stroke="#c0a0ff" stroke-width="3" stroke-linecap="round"/><circle cx="38" cy="38" r="2" fill="#fff"/><circle cx="9" cy="10" r="1.6" fill="#fff"/>`]
});
Object.assign(GOLD_SVG,{
  scoop:['#3a1a78',`<path d="M24 6A18 18 0 1 0 42 24L30 24A6 6 0 0 1 24 18Z" fill="#efe2ff" ${_GS}/><circle cx="36" cy="12" r="7" fill="#05020c" stroke="#c8a8ff" stroke-width="2.4" stroke-dasharray="3 2.6"/><path d="M8 40L16 34M12 44L20 40" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`],
  zipper:['#d89a10',`<path d="M24 4V44" fill="none" stroke="#000" stroke-width="3"/><g fill="#e8ecf4" ${_GS}><rect x="14" y="6" width="9" height="5" rx="1.5"/><rect x="25" y="12" width="9" height="5" rx="1.5"/><rect x="14" y="18" width="9" height="5" rx="1.5"/></g><path d="M16 26H32L29 36H19Z" fill="#ffe03a" ${_GS}/><rect x="21" y="36" width="6" height="9" rx="2" fill="#ffe03a" ${_GS}/>`],
  frostsuit:['#1a78c8',`<g fill="none" stroke="#000" stroke-width="6.4" stroke-linecap="round"><path d="M24 6V42M8.4 15L39.6 33M8.4 33L39.6 15"/></g><g fill="none" stroke="#e8fbff" stroke-width="3" stroke-linecap="round"><path d="M24 6V42M8.4 15L39.6 33M8.4 33L39.6 15M18 10L24 15L30 10M18 38L24 33L30 38"/></g><circle cx="24" cy="24" r="4.4" fill="#9adfff" ${_GS}/>`],
  virus:['#5a1a8a',`<g stroke="#000" stroke-width="2.6" stroke-linecap="round"><path d="M24 4V12M24 36V44M4 24H12M36 24H44M10 10L16 16M32 32L38 38M38 10L32 16M16 32L10 38" fill="none"/></g><circle cx="24" cy="24" r="12" fill="#a8ff48" ${_GS}/><circle cx="20" cy="20" r="3.4" fill="#e8ffb0" stroke="#000" stroke-width="1.6"/><circle cx="29" cy="28" r="2.6" fill="#5a9a10" stroke="#000" stroke-width="1.6"/><circle cx="4" cy="24" r="2.8" fill="#d8ff80" stroke="#000" stroke-width="1.6"/><circle cx="44" cy="24" r="2.8" fill="#d8ff80" stroke="#000" stroke-width="1.6"/>`],
  magnet:['#b01830',`<path d="M10 40V22A14 14 0 0 1 38 22V40H29V22A5 5 0 0 0 19 22V40Z" fill="#e8183a" ${_GS}/><path d="M10 40H19V33H10Z" fill="#e8ecf4" ${_GS}/><path d="M29 40H38V33H29Z" fill="#e8ecf4" ${_GS}/><path d="M40 6L46 12M44 4L36 12" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/><path d="M40 6L46 12M44 4L36 12" fill="none" stroke="#f4f6fc" stroke-width="2.2" stroke-linecap="round"/>`],
  weather:['#26468a',`<path d="M12 28Q5 28 5 21Q5 14 13 14Q15 7 25 8Q34 8 35 15Q44 15 44 22Q44 28 37 28Z" fill="#c8d4f0" ${_GS}/><path d="M26 28L20 36H26L22 44L32 33H26L30 28Z" fill="#ffe03a" ${_GS}/><path d="M12 33Q15 38 12 41Q9 38 12 33Z" fill="#9adfff" ${_GS}/>`],
  book:['#7a3a10',`<path d="M24 12Q14 7 4 10V38Q14 35 24 40Q34 35 44 38V10Q34 7 24 12Z" fill="#fff4d8" ${_GS}/><path d="M24 12V40" fill="none" stroke="#000" stroke-width="2.2"/><path d="M9 17Q15 16 20 18M9 23Q15 22 20 24M28 18Q33 16 39 17M28 24Q33 22 39 23" fill="none" stroke="#b07a30" stroke-width="2" stroke-linecap="round"/><path d="M38 4L40 8L44 9L40 11L38 15L36 11L32 9L36 8Z" fill="#ffee50" ${_GS}/>`],
  cure:['#18903a',`<ellipse cx="24" cy="35" rx="20" ry="8" fill="#fff6e0" ${_GS}/><path d="M8 34Q10 20 24 17Q38 20 40 34Q24 41 8 34Z" fill="#f4d680" ${_GS}/><path d="M13 29Q15 21 24 20Q33 21 35 29Q30 27 27 31Q24 28 21 31Q18 27 13 29Z" fill="#d83a22" stroke="#000" stroke-width="2" stroke-linejoin="round"/><path d="M21 22Q25 15 31 19Q28 24 21 22Z" fill="#3aa84a" ${_GS}/><path d="M16 14Q12 10 16 6M24 14Q20 9 24 4M32 12Q28 8 32 4" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M38 6V14M34 10H42" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/><path d="M38 6V14M34 10H42" fill="none" stroke="#8affb0" stroke-width="2.6" stroke-linecap="round"/>`]
});
// ---- 一覧用の小アイコン（48×48）----
Object.assign(GOLD_SVG,{
  rapier:['#33437a',`<path d="M14 38Q14 16 24 14Q34 16 34 38Z" fill="#c4cfde" ${_GS}/><rect x="17" y="24" width="14" height="4" fill="#0c1018"/><path d="M24 14Q30 2 42 8Q34 8 30 16Z" fill="#e23648" ${_GS}/><path d="M6 44L44 6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M4 30L20 40" stroke="#bfe0ff" stroke-width="1.6" opacity=".7"/>`],
  kickshot:['#4a2078',`<path d="M6 40L18 28L12 14L32 24L26 6" fill="none" stroke="#000" stroke-width="6.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 40L18 28L12 14L32 24L26 6" fill="none" stroke="#ffd34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="36" cy="30" rx="7" ry="3.6" fill="#ffd34a" ${_GS} transform="rotate(-30 36 30)"/><circle cx="12" cy="14" r="4" fill="#ff5a5a" ${_GS}/>`],
  strafe:['#2a4a88',`<path d="M8 28Q10 22 20 22H34Q42 22 44 28Q42 34 34 34H18Q10 34 8 28Z" fill="#cdd672" ${_GS}/><path d="M20 26L26 10H32L28 26Z" fill="#a8b24a" ${_GS}/><path d="M10 26L4 18H8L14 24Z" fill="#a8b24a" ${_GS}/><ellipse cx="45" cy="28" rx="1.6" ry="8" fill="#fff"/><path d="M40 36L46 46" stroke="#ffe060" stroke-width="2.6" stroke-dasharray="3 3"/>`],
  dive:['#0a4a5a',`<ellipse cx="24" cy="36" rx="18" ry="6" fill="#06212e" stroke="#7af0ff" stroke-width="2"/><circle cx="24" cy="20" r="9" fill="#e6f2fa" ${_GS}/><circle cx="20.5" cy="21" r="2" fill="#38e8ff"/><circle cx="27.5" cy="21" r="2" fill="#38e8ff"/><path d="M6 34Q24 44 42 34" fill="none" stroke="#7af0ff" stroke-width="2.4" stroke-linecap="round"/>`],
  dino:['#2a6a1c',`<path d="M4 28Q6 18 16 15Q28 6 38 12Q46 18 44 30L40 32H14Q6 32 4 28Z" fill="#6ac85a" ${_GS}/><circle cx="31" cy="18" r="4" fill="#ffe030" ${_GS}/><rect x="30" y="14.5" width="2" height="7" fill="#000"/><path d="M12 32L14 37L17 32M20 32L22 37L25 32M28 32L30 37L33 32" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/><path d="M4 33Q22 40 42 33L44 38Q22 46 6 38Z" fill="#3a8a3a" ${_GS}/>`],
  stillrain:['#3a4c78',`<path d="M12 8L16 14L12 19L8 14Z M30 14L34 20L30 25L26 20Z M18 28L22 34L18 39L14 34Z M36 32L40 38L36 43L32 38Z" fill="#dcefff" ${_GS}/><path d="M4 22L40 14" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M38 11L46 14L38 17Z" fill="#fff"/>`]
});

// ---- 背景専用の小アイコン（48×48。演出のアイコンとは別の絵）----
Object.assign(GOLD_SVG,{
  bg_disc:['#1a6fa8',`<path d="M2 28Q12 22 24 28T46 28V46H2Z" fill="#0c3c6a" ${_GS}/><path d="M4 36Q14 32 24 36T44 36" fill="none" stroke="#7fd0ff" stroke-width="1.6"/><ellipse cx="14" cy="22" rx="7" ry="3" fill="#eef4ff" ${_GS}/><ellipse cx="14" cy="22" rx="2" ry="1" fill="#1a6fa8"/><ellipse cx="32" cy="14" rx="8" ry="3.4" fill="#ffd36a" ${_GS}/><ellipse cx="32" cy="14" rx="2.2" ry="1.1" fill="#1a6fa8"/><ellipse cx="38" cy="32" rx="5" ry="2" fill="#eef4ff" ${_GS}/>`],
  bg_gravflip:['#5a2a8a',`<path d="M4 3V14H9V9H14V18H20V6H26V22H32V10H38V16H44V3Z" fill="#c9a0ff" ${_GS}/><path d="M4 45V34H9V39H14V30H20V42H26V26H32V38H38V32H44V45Z" fill="#3a1a60" ${_GS}/><path d="M2 24H46" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/><path d="M24 19L28 25H20Z" fill="#fff" ${_GS}/>`],
  bg_erase:['#6a6a78',`<rect x="5" y="5" width="17" height="17" fill="#f4f4f4" ${_GS}/><rect x="26" y="5" width="17" height="17" fill="#f4f4f4" ${_GS}/><rect x="5" y="26" width="17" height="17" fill="#f4f4f4" ${_GS}/><rect x="26" y="26" width="17" height="17" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="3 3"/><path d="M9 18Q13 8 18 18" stroke="#000" stroke-width="2" fill="none"/><circle cx="34" cy="13" r="4" fill="#000"/><path d="M9 38L18 30" stroke="#000" stroke-width="2"/>`],
  bg_lightblade:['#102a6a',`<path d="M12 8L30 40M36 12L14 30" stroke="#7fb4ff" stroke-width="1.6"/><path d="M8 40L40 8" stroke="#000" stroke-width="9" stroke-linecap="round"/><path d="M8 40L40 8" stroke="#fff" stroke-width="4.6" stroke-linecap="round"/><circle cx="24" cy="24" r="4" fill="#fff"/>`],
  bg_tankbomb:['#b8641c',`<circle cx="38" cy="12" r="7" fill="#ffd060" ${_GS}/><circle cx="38" cy="12" r="3" fill="#fff"/><path d="M2 36H46V46H2Z" fill="#7a3a10" ${_GS}/><rect x="9" y="26" width="22" height="8" rx="2" fill="#4a5a3a" ${_GS}/><rect x="14" y="20" width="11" height="7" rx="2" fill="#5a6a4a" ${_GS}/><path d="M25 23H39" stroke="#000" stroke-width="3.4" stroke-linecap="round"/><circle cx="14" cy="36" r="2.4" fill="#222"/><circle cx="22" cy="36" r="2.4" fill="#222"/><circle cx="30" cy="36" r="2.4" fill="#222"/>`],
  bg_redray:['#2a0610',`<path d="M24 24L2 8M24 24L2 24M24 24L8 46M24 24L46 10M24 24L46 28M24 24L38 46" stroke="#ff2a3a" stroke-width="2.4" stroke-linecap="round"/><circle cx="24" cy="24" r="8" fill="#ff5a5a" ${_GS}/><circle cx="24" cy="24" r="3.4" fill="#fff"/>`],
  bg_chronolock:['#2a4a7a',`<circle cx="24" cy="25" r="16" fill="#cfeaff" ${_GS}/><path d="M24 9L20 22L28 28L22 41M12 16L20 22M36 18L28 28" stroke="#000" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M8 6L10 10L8 13L6 10Z M40 6L42 10L40 13L38 10Z M40 38L42 42L40 45L38 42Z" fill="#fff" stroke="#000" stroke-width="1.4"/>`],
  bg_rewind:['#7a2a8a',`<circle cx="24" cy="15" r="9" fill="#ffe8f4" ${_GS}/><path d="M24 9V15L19 18" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M3 38H45V46H3Z" fill="#1a0a2a" ${_GS}/><path d="M6 38V30H11V25H16V38M19 38V27H25V32H30V22H36V38M38 38V31H44V38" fill="#2a0a3a" ${_GS}/><path d="M12 10L5 14L12 18Z M42 14L36 10V18Z" fill="#ff7ad8" ${_GS}/>`],
  bg_cosmos:['#1a1058',`<path d="M24 22Q34 8 42 14M24 22Q10 16 8 26" fill="none" stroke="#c8b0ff" stroke-width="3" stroke-linecap="round"/><circle cx="12" cy="10" r="1.6" fill="#fff"/><circle cx="38" cy="26" r="1.6" fill="#fff"/><circle cx="30" cy="6" r="1.2" fill="#fff"/><circle cx="24" cy="36" r="11" fill="#ffd890" ${_GS}/><path d="M2 38Q24 30 46 38V46H2Z" fill="#14083a" ${_GS}/>`],
  bg_strafe:['#04241a',`<circle cx="24" cy="25" r="17" fill="#0e4a30" stroke="#5affa0" stroke-width="2"/><circle cx="24" cy="25" r="9" fill="none" stroke="#5affa0" stroke-width="1.2"/><path d="M24 25L37 16" stroke="#c8ffe0" stroke-width="2"/><path d="M5 43Q14 37 24 43T43 43V46H5Z" fill="#021008"/><path d="M26 8L38 8L34 12L26 11Z" fill="#cdd672" ${_GS}/><circle cx="9" cy="9" r="3.4" fill="#e8fff0"/>`],
  bg_stillrain:['#3a4c78',`<path d="M4 40V28H10V22H16V40M18 40V26H25V32H30V20H36V40M38 40V30H44V40" fill="#161d30" ${_GS}/><path d="M2 40H46V46H2Z" fill="#0a1020" ${_GS}/><path d="M12 5L15 10L12 13L9 10Z M27 9L30 14L27 17L24 14Z M39 3L42 8L39 11L36 8Z M20 20L22 24L20 27L18 24Z" fill="#dcefff" stroke="#000" stroke-width="1.6" stroke-linejoin="round"/>`],
  bg_dino:['#c8541c',`<circle cx="35" cy="18" r="8" fill="#fff0c0" ${_GS}/><path d="M2 40L14 14L20 18L34 40Z" fill="#4a1a1a" ${_GS}/><path d="M13 15L14 14L19 17L17 21Z" fill="#ff8a20"/><path d="M2 38H46V46H2Z" fill="#0c1a0c" ${_GS}/><path d="M38 38Q40 31 38 25" stroke="#000" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M38 25Q30 19 27 26M38 25Q46 19 49 26M38 25Q33 16 29 17M38 25Q43 16 47 17" stroke="#000" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M38 25Q30 19 27 26M38 25Q46 19 49 26M38 25Q33 16 29 17M38 25Q43 16 47 17" stroke="#3ab84a" stroke-width="2.4" fill="none" stroke-linecap="round"/>`],
  bg_rapier:['#1c2850',`<path d="M16 24V12Q24 2 32 12V24Z" fill="#b8d0ff" ${_GS}/><path d="M16 24L6 44H30L32 24Z" fill="#dfe9ff" opacity=".6"/><rect x="5" y="14" width="5" height="22" fill="#3a4a7a" ${_GS}/><path d="M2 38H46V46H2Z" fill="#101832" ${_GS}/><path d="M28 38L34 33L40 36L34 40Z" fill="#9aa8c0" ${_GS}/><path d="M12 32L42 18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`]
});

function goldIcon(id){const g=GOLD_SVG[id];if(!g)return '';return `<svg viewBox="0 0 48 48" style="width:1em;height:1em;display:inline-block;vertical-align:-.14em"><rect x="1.5" y="1.5" width="45" height="45" rx="7" fill="${g[0]}" stroke="#000" stroke-width="3"/><path d="M4 4H30L4 30Z" fill="#fff" opacity=".2"/><g fill="#fff" opacity=".28"><circle cx="41" cy="6" r="1.1"/><circle cx="37" cy="6" r="1.1"/><circle cx="41" cy="10" r="1.1"/><circle cx="43" cy="14" r="1.1"/><circle cx="6" cy="42" r="1.1"/><circle cx="10" cy="42" r="1.1"/><circle cx="6" cy="38" r="1.1"/></g>${g[1]}</svg>`;}
GACHA_ITEMS.forEach(it=>{if(it.gold){const nm=it.fxId||it.id.replace('bg_','').replace('chrono','chronolock');const key=(it.category==='fieldbg'&&GOLD_SVG['bg_'+nm])?'bg_'+nm:nm;it.icon=goldIcon(key)||it.icon;}});
// 黄金の精神のプレイヤーアイコン：専用の動く絵を、他の景品と同じ枠つきのアイコンにする
function goldGiIcon(id){const u=giconUri(id);if(!u)return '';return `<svg viewBox="0 0 48 48" style="width:1em;height:1em;display:inline-block;vertical-align:-.14em"><defs><clipPath id="gicc"><circle cx="24" cy="24" r="19"/></clipPath></defs><rect x="1.5" y="1.5" width="45" height="45" rx="7" fill="#161a2a" stroke="#000" stroke-width="3"/><path d="M4 4H30L4 30Z" fill="#fff" opacity=".16"/><image href="${u}" x="5" y="5" width="38" height="38" clip-path="url(#gicc)"/><circle cx="24" cy="24" r="19" fill="none" stroke="#000" stroke-width="2.4"/></svg>`;}
GACHA_ITEMS.forEach(it=>{if(it.gold&&it.category==='gicon')it.icon=goldGiIcon(it.value)||it.icon;});

function equipFxItem(id){const it=GACHA_ITEMS.find(x=>x.id===id);if(!it||!it.fxKind)return;if(!loadGachaState().owned.includes(id))return;
  const o=loadMyFx();o[it.fxKind]=(o[it.fxKind]===it.fxId)?'default':it.fxId;try{localStorage.setItem('rikka_fx',JSON.stringify(o));}catch(e){}
  syncMyFx();renderGachaCollection();try{refreshCustomize();}catch(e){}}
function previewFxItem(id){const it=GACHA_ITEMS.find(x=>x.id===id);if(it&&it.fxKind)showCallFx(it.fxKind,myName(),'見本',{[it.fxKind]:it.fxId});}
function gachaPool(rarity,banner){
  if(banner==='gold'){const p=GACHA_ITEMS.filter(it=>it.gold&&it.rarity===rarity);return p.length?p:GACHA_ITEMS.filter(it=>it.gold);}
  if(banner==='limited'){
    const p=GACHA_ITEMS.filter(it=>it.rarity===rarity&&(it.limited===LIMITED_GACHA.id||LIMITED_GACHA.existing.includes(it.id)));
    if(p.length)return p;
  }
  return GACHA_ITEMS.filter(it=>it.rarity===rarity&&!it.achievement&&!it.loginStar&&!it.limited&&!it.event&&!it.gold);
}
backfillAchievementRewards();
// 配付：Game Over Ⅲ・Ⅳ と称号「国富平針店のバイト」を全員に渡す（すでに持っている人には何も起きない）
if(['bg_gameovera3','bg_gameovera4','title_gameovera'].map(id=>grantItem(id)).some(Boolean))setTimeout(()=>{try{toast('🎁 Game Over Ⅲ・Ⅳ と称号「国富平針店のバイト」をプレゼントしました！');}catch(e){}},2500);
const GACHA_RARITY_INFO={
  common:   {label:'コモン',   weight:60, color:'#9098a0'},
  uncommon: {label:'アンコモン', weight:25, color:'#60c870'},
  rare:     {label:'レア',     weight:12, color:'#60a8f0'},
  superrare:{label:'超レア',   weight:3,  color:'#f5d040'},
};

function loadPetals(){ return parseInt(localStorage.getItem('rikka_petals')||'0',10)||0; }
function savePetals(n){ localStorage.setItem('rikka_petals',String(Math.max(0,n))); updatePetalDisplays(); }
function addPetals(n){ savePetals(loadPetals()+n); }
// ボット対戦：自分が上がると強さに応じて花びらがもらえる（負けたラウンドは1枚）
const BOT_WIN_PETALS={easy:3,normal:5,hard:10};
let _lastPetalGain=0;
function botGamePetals(winnerIdx,extra){
  try{botSpecNote(winnerIdx);}catch(e){}
  const bot=G&&G.players.find(p=>p.isBot);
  const n=(winnerIdx===myOnlineIdx)?(BOT_WIN_PETALS[bot&&bot.diff]||5):1;
  const total=n+(extra||0);
  addPetals(total);_lastPetalGain=total;
  return total;
}
function updatePetalDisplays(){
  const n=loadPetals();
  const a=document.getElementById('gacha-lobby-petals'); if(a)a.textContent=n;
  const b=document.getElementById('gacha-petals'); if(b)b.textContent=n;
  const d1=document.getElementById('gacha-draw-btn'),d10=document.getElementById('gacha-draw10'),d100=document.getElementById('gacha-draw100');
  if(d1)d1.disabled=n<GACHA_COST; if(d10)d10.disabled=n<GACHA_COST*10; if(d100)d100.disabled=n<GACHA_COST*100;
}

function loadGachaState(){
  try{
    const st=JSON.parse(localStorage.getItem('rikka_gacha')||'{}');
    st.owned=st.owned||[]; st.equipped=st.equipped||{};
    // 開発者アカウントは、ガチャの景品をすべて持っている扱いにする（景品が増えても自動で含まれる）
    if(isDevUser())st.owned=GACHA_ITEMS.map(i=>i.id);
    return st;
  }catch(e){ return {owned:[],equipped:{}}; }
}
function saveGachaState(st){
  try{
    // 開発者の「全部持っている」状態は端末に保存しない（ログアウト後に残らないように、元の所持だけを保存）
    if(isDevUser()){
      let real=[];try{real=(JSON.parse(localStorage.getItem('rikka_gacha')||'{}').owned)||[];}catch(e){}
      st=Object.assign({},st,{owned:real});
    }
    localStorage.setItem('rikka_gacha',JSON.stringify(st));
  }catch(e){}
}

function pickGachaRarity(){
  const roll=Math.random()*100;
  let acc=0;
  for(const [key,info] of Object.entries(GACHA_RARITY_INFO)){
    acc+=info.weight;
    if(roll<acc) return key;
  }
  return 'common';
}
