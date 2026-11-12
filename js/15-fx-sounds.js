// =====================================================================
//  演出ごとのサウンド（音ハメ版）。すべて、その場で作る合成音です。音声ファイルは要りません
//  ・リーチ・ロン・上がりの演出それぞれに、専用の音があります
//  ・絵の動きに合わせています：
//      ① 全演出に共通の「絵のタイミング」（0秒＝帯が開く／0.12秒＝文字が迫る／0.30秒＝閃光・輪・火花）
//      ② 演出ごとの「盛り上がる瞬間」（16-fx-sync.js の測定データ）。絵が盛り上がるたびに音が入ります
//      ③ 絵の明るさ・動きの大きさに合わせて、背景の音が大きくなったり小さくなったりします
//  ・効果音がOFF、または音量0のときは鳴りません（既存の設定に従います）
//  ・新しい演出に音を付けるには、addFx({... sound:S=>{ ... }}) と書きます（13-new-items.js）
// =====================================================================

// ───────── ① 音のエンジン（触らなくてOK） ─────────
function _fxRun(ctx,dest,recipe,t0,gain){
  const vol=(typeof soundVolume==='number'?soundVolume:.5)*.9*(gain||1),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const master=ctx.createGain();master.gain.value=vol;
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=14;comp.ratio.value=7;comp.attack.value=.002;comp.release.value=.22;
  // 音が割れないように、最後に丸める（重なって大きくなりすぎた音を、やさしく抑える）
  const sat=ctx.createWaveShaper(),cv=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/511.5-1;cv[i]=.92*Math.tanh(x*1.25)/Math.tanh(1.25);}sat.curve=cv;sat.oversample='2x';
  master.connect(comp);comp.connect(sat);sat.connect(dest);
  // 残響（空間の広がり）：減衰するノイズを、たたみ込む
  if(!ctx.__fxIR){const n=Math.floor(ctx.sampleRate*1.8),b=ctx.createBuffer(2,n,ctx.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<n;i++){const x=i/n;d[i]=(Math.random()*2-1)*Math.pow(1-x,3)*Math.min(1,i/(ctx.sampleRate*.01));}}ctx.__fxIR=b;}
  const send=ctx.createGain(),conv=ctx.createConvolver(),wet=ctx.createGain();conv.buffer=ctx.__fxIR;wet.gain.value=.55;send.connect(conv);conv.connect(wet);wet.connect(master);
  if(!ctx.__fxNb){const n=ctx.sampleRate*2,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;ctx.__fxNb=b;}
  const MIN=.0001,R=i=>{const x=Math.sin(i*12.9898+7.13)*43758.5453;return x-Math.floor(x);}; // 毎回おなじ「ばらつき」
  const out=(node,o,s,d)=>{let n=node;
    if(o.p!=null&&ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.setValueAtTime(clamp(o.p,-1,1),t0+s);if(o.p1!=null)p.pan.linearRampToValueAtTime(clamp(o.p1,-1,1),t0+s+d);n.connect(p);n=p;}
    n.connect(master);const rv=o.rv==null?.18:o.rv;if(rv>0){const g=ctx.createGain();g.gain.value=rv;n.connect(g);g.connect(send);}};
  const env=(g,s,d,pk,a,sw)=>{const p=g.gain,t=t0+s;p.setValueAtTime(MIN,t);
    if(sw!=null){p.linearRampToValueAtTime(pk,t+Math.max(.005,d*sw));p.exponentialRampToValueAtTime(MIN,t+d);}
    else{p.linearRampToValueAtTime(pk,t+Math.min(a==null?.01:a,d*.9));p.exponentialRampToValueAtTime(MIN,t+d);}};
  const S={R};
  // 音程のある音：周波数f、開始s秒、長さd秒。o={type,g(音量),to(最後の周波数),a(立ち上がり),sw(山の位置0〜1),det,p/p1(左右),rv(残響),vib:[Hz,深さ]}
  S.t=(f,s,d,o)=>{s=Math.max(0,s);o=o||{};const osc=ctx.createOscillator(),g=ctx.createGain();osc.type=o.type||'sine';osc.frequency.setValueAtTime(Math.max(1,f),t0+s);
    if(o.to)osc.frequency.exponentialRampToValueAtTime(Math.max(1,o.to),t0+s+d);if(o.det)osc.detune.value=o.det;
    if(o.vib){const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=o.vib[0];lg.gain.value=o.vib[1];l.connect(lg);lg.connect(osc.frequency);l.start(t0+s);l.stop(t0+s+d+.05);}
    env(g,s,d,o.g==null?.2:o.g,o.a,o.sw);osc.connect(g);out(g,o,s,d);osc.start(t0+s);osc.stop(t0+s+d+.05);};
  // ノイズ（風・爆発・斬撃など）：o={type(lowpass/highpass/bandpass),f(中心),to(最後のf),q,g,a,sw,p,p1,rv}
  S.n=(s,d,o)=>{s=Math.max(0,s);o=o||{};const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=ctx.__fxNb;src.loop=true;
    f.type=o.type||'lowpass';f.frequency.setValueAtTime(Math.max(20,o.f||1000),t0+s);if(o.to)f.frequency.exponentialRampToValueAtTime(Math.max(20,o.to),t0+s+d);f.Q.value=o.q||.7;
    env(g,s,d,o.g==null?.2:o.g,o.a,o.sw);src.connect(f);f.connect(g);out(g,o,s,d);src.start(t0+s,R(s*100+d)*1.5);src.stop(t0+s+d+.05);};
  S.fm=(fc,fmf,idx,s,d,o)=>{s=Math.max(0,s);o=o||{};const c=ctx.createOscillator(),m=ctx.createOscillator(),mg=ctx.createGain(),g=ctx.createGain();c.frequency.value=fc;m.frequency.value=fmf;mg.gain.value=idx;
    m.connect(mg);mg.connect(c.frequency);env(g,s,d,o.g==null?.15:o.g,o.a,o.sw);c.connect(g);out(g,o,s,d);c.start(t0+s);m.start(t0+s);c.stop(t0+s+d+.05);m.stop(t0+s+d+.05);};
  // 絵の明るさ・動きに合わせて音量が動く、背景の音（envArr：1秒に30個の0〜99）
  S.bed=(kind,s,d,envArr,o)=>{s=Math.max(0,s);o=o||{};const g=ctx.createGain(),pk=o.g==null?.15:o.g,e=envArr&&envArr.length?envArr:null;let src;
    if(kind==='noise'){src=ctx.createBufferSource();src.buffer=ctx.__fxNb;src.loop=true;const f=ctx.createBiquadFilter();f.type=o.type||'bandpass';f.frequency.value=o.f||800;f.Q.value=o.q||.7;src.connect(f);f.connect(g);}
    else{src=ctx.createOscillator();src.type=o.type||'sawtooth';src.frequency.value=o.f||80;src.connect(g);}
    g.gain.setValueAtTime(MIN,t0+s);const a=Math.min(.25,d*.2);
    for(let tt=0;tt<=d;tt+=.04){const i=clamp(Math.round((s+tt)*30),0,(e?e.length:1)-1),v=e?e[i]/99:.6,fade=clamp(tt/a,0,1)*clamp((d-tt)/.35,0,1);g.gain.linearRampToValueAtTime(Math.max(MIN,pk*(.2+.8*v)*fade),t0+s+tt);}
    g.gain.linearRampToValueAtTime(MIN,t0+s+d+.05);out(g,o,s,d);src.start(t0+s);src.stop(t0+s+d+.1);};
  // ---- 本物らしい部品 ----
  // 衝撃：パシッという打撃音＋ドンという胴鳴り＋腹に響く低音＋余韻
  S.impact=(s,g,sz)=>{g=g==null?.5:g;sz=sz||1;S.n(s,.012,{type:'highpass',f:5000,g:g*.8,a:.0005,rv:.05});S.n(s,.09,{f:1100/sz,to:120,g:g*.9,a:.001,rv:.1});
    S.t(150/sz,s,.22*sz,{to:48,type:'triangle',g:g*.9,a:.002,rv:.1});S.t(72/Math.sqrt(sz),s,.7*sz,{to:28,g,a:.003,rv:.1});S.n(s+.02,.9*sz,{f:700,to:80,g:g*.32,a:.02,rv:.55});};
  // 爆発：破裂音＋爆風＋低音＋飛び散る破片＋遠くへ響く余韻
  S.explosion=(s,g,d)=>{g=g==null?.5:g;d=d||1;S.n(s,.02,{type:'highpass',f:5000,g:g*.8,a:.0005,rv:.05});S.n(s,d*.8,{f:2800,to:90,g,a:.003,rv:.25});
    S.t(78,s,d,{to:24,g:g*1.1,a:.004,rv:.1});S.t(190,s,.3,{to:50,type:'sawtooth',g:g*.28,a:.003});
    for(let i=0;i<10;i++)S.n(s+.08+i*d/12+R(i+s*7)*.05,.05+R(i)*.06,{type:'bandpass',f:700+R(i+3)*2600,q:2,g:g*.17*(1-i/14),p:R(i+9)*2-1,rv:.3});S.n(s+.1,d*1.3,{f:200,to:50,g:g*.4,a:.04,rv:.6});};
  // 斬撃：風を切る音＋金属が鳴る余韻
  S.slash=(s,g,p)=>{g=g==null?.3:g;S.n(s,.14,{type:'bandpass',f:1800,to:7500,q:1.5,g,a:.004,p:p,rv:.1});
    S.n(s+.05,.7,{type:'bandpass',f:3400,q:28,g:g*.5,a:.002,p:p,rv:.4});S.n(s+.05,.5,{type:'bandpass',f:5200,q:30,g:g*.3,a:.002,p:p,rv:.4});S.t(3400,s+.05,.5,{g:g*.08,rv:.4});};
  S.whoosh=(s,d,g,f0,f1,p0,p1)=>S.n(s,d,{type:'bandpass',f:f0||400,to:f1||3000,q:1.1,g:g==null?.25:g,sw:.6,p:p0,p1:p1,rv:.2});
  S.riser=(s,d,g,f1)=>{g=g==null?.2:g;S.n(s,d,{type:'bandpass',f:300,to:f1||5000,q:1.6,g,sw:.96,rv:.15});S.t(180,s,d,{to:900,type:'triangle',g:g*.6,sw:.96});};
  S.rev=(s,d,g)=>S.n(s,d,{type:'lowpass',f:200,to:6000,g:g==null?.2:g,sw:.97,rv:.3}); // 逆再生のような吸い込み
  S.bell=(f,s,d,g)=>{d=d||1.2;g=g==null?.15:g;[1,2,2.76,5.4,8.93].forEach((m,i)=>{S.t(f*m,s,d/(1+i*.55),{g:g/(1+i*.9),a:.002,rv:.5});if(i<3)S.t(f*m*1.003,s,d/(1+i*.55),{g:g/(1+i*.9)*.6,a:.002,rv:.5});});};
  S.sparkle=(s,d,g)=>{for(let i=0;i<10;i++)S.t(2500+R(i)*3200,s+i*d/10+R(i+30)*.04,.16,{g:g==null?.08:g,p:R(i+5)*1.6-.8,rv:.5});};
  S.rumble=(s,d,g)=>{g=g==null?.25:g;S.n(s,d,{f:140,to:60,g,sw:.3,rv:.3});S.t(48,s,d,{g:g*.7,sw:.3});};
  S.tick=(s,g,f)=>{S.t(f||1800,s,.035,{type:'square',g:g==null?.12:g,a:.001,rv:.12});S.n(s,.02,{type:'bandpass',f:4000,g:(g==null?.12:g)*.6,a:.0005,rv:.05});};
  S.zap=(s,g)=>{g=g==null?.3:g;S.n(s,.05,{type:'highpass',f:3000,g,a:.0005});S.t(2200,s,.22,{to:180,type:'sawtooth',g:g*.7,a:.002,rv:.2});S.t(120,s,.3,{type:'square',g:g*.35,a:.002});};
  S.fire=(s,d,g)=>{g=g==null?.25:g;S.n(s,d,{type:'bandpass',f:500,to:900,q:.8,g,sw:.35,rv:.3});for(let i=0;i<Math.floor(d*16);i++)S.n(s+R(i+s*5)*d,.02+R(i)*.03,{type:'highpass',f:2500+R(i+2)*3000,g:g*.5*R(i+6),p:R(i+11)*2-1,rv:.2});};
  S.sizzle=(s,d,g)=>{for(let i=0;i<Math.floor(d*40);i++)S.n(s+R(i+s*3)*d,.012,{type:'highpass',f:6000+R(i)*3000,g:(g==null?.1:g)*(.4+R(i+4)*.6)*(1-i/(d*45)),p:R(i+8)*2-1,rv:.2});};
  S.gun=(s,g,p)=>{g=g==null?.3:g;S.n(s,.02,{type:'highpass',f:3000,g,a:.0005,p:p});S.t(140,s,.07,{to:60,g:g*.8,a:.001,p:p});S.n(s,.09,{type:'bandpass',f:1400,q:1,g:g*.6,a:.001,p:p,rv:.3});};
  S.glass=(s,g)=>{g=g==null?.2:g;S.n(s,.1,{type:'highpass',f:5000,to:9000,g,a:.001,rv:.4});for(let i=0;i<6;i++)S.t(3500+R(i+s*9)*3000,s+i*.025,.3,{g:g*.4,a:.001,p:R(i+2)*1.6-.8,rv:.5});};
  S.coin=(s,g)=>{g=g==null?.12:g;for(let i=0;i<7;i++){const f=3000+i*320;S.t(f,s+i*.045,.22,{type:'triangle',g,a:.001,rv:.35});S.t(f*1.5,s+i*.045,.18,{g:g*.3,a:.001});}};
  S.growl=(s,d,g,f)=>{f=f||70;g=g==null?.3:g;S.t(f,s,d,{type:'sawtooth',to:f*.62,g,sw:.2,vib:[24,f*.05],rv:.2});S.t(f*2,s,d,{type:'sawtooth',to:f*1.2,g:g*.4,vib:[27,f*.1]});S.n(s,d,{type:'bandpass',f:600,to:1500,q:3,g:g*.7,sw:.3,rv:.2});};
  S.drone=(s,d,g,f)=>{f=f||55;g=g==null?.2:g;S.t(f,s,d,{type:'sawtooth',g,sw:.5,rv:.3});S.t(f*1.5,s,d,{type:'sawtooth',g:g*.5,det:7,sw:.5});S.t(f/2,s,d,{g:g*1.2,sw:.5});};
  S.pad=(f,s,d,g)=>{[1,1.5,2].forEach((m,i)=>S.t(f*m,s,d,{type:'triangle',g:(g==null?.1:g)/(1+i*.4),det:(i-1)*6,sw:.45,rv:.5}));};
  S.pluck=(f,s,d,g)=>{S.t(f,s,d||.7,{type:'triangle',g:g==null?.14:g,a:.002,rv:.4});S.t(f*2,s,(d||.7)*.5,{g:(g==null?.14:g)*.3,a:.001});};
  S.drop=(f,s,g)=>S.t(f,s,.28,{to:f*.88,g:g==null?.1:g,a:.002,p:R(f+s)*1.6-.8,rv:.5});
  // ---- ここから「演出ごとの音」の本体 ----
  recipe(S);
}
function fxSoundPlay(id,kind){const r=typeof FX_SOUND!=='undefined'&&FX_SOUND[kind+':'+id];if(!r)return false;_gfxAudio(ctx=>_fxRun(ctx,ctx.destination,r,ctx.currentTime+.03,typeof FX_GAIN!=='undefined'?FX_GAIN[kind+':'+id]:1));return true;}

// ───────── ② 音の性格（演出がどんな音か） ─────────
// imp：0.30秒の「閃光・文字が叩きつけられる」瞬間の音 ／ acc：絵が盛り上がるたびに入る音 ／ bed：背景の音
const _fxCH={
 fire:{imp:(S,t,g)=>{S.explosion(t,g*.7,.9);S.fire(t,.9,g*.45);},acc:(S,t,g)=>{S.n(t,.25,{type:'bandpass',f:500,to:2500,g:g*.3,sw:.3});S.fire(t,.35,g*.35);S.impact(t,g*.3,.7);},bed:{k:'noise',f:700,q:.8,g:.1}},
 ice:{imp:(S,t,g)=>{S.glass(t,g*.9);S.impact(t,g*.35,.8);S.bell(2637,t,1.2,g*.12);},acc:(S,t,g)=>{S.glass(t,g*.5);},bed:{k:'noise',type:'highpass',f:5500,q:.5,g:.04}},
 thunder:{imp:(S,t,g)=>{S.zap(t,g*.8);S.n(t,.1,{type:'highpass',f:2500,g:g*.7,a:.001});S.explosion(t+.03,g*.45,1.3);},acc:(S,t,g)=>{S.zap(t,g*.55);S.impact(t+.02,g*.35,1.2);},bed:{k:'noise',f:120,q:.5,type:'lowpass',g:.12}},
 aura:{imp:(S,t,g)=>{S.impact(t,g*.8,1.5);S.drone(t,1.8,g*.3,55);},acc:(S,t,g)=>{S.impact(t,g*.45,1.3);},bed:{k:'osc',f:55,g:.1}},
 water:{imp:(S,t,g)=>{S.n(t-.05,.9,{f:400,to:3000,g:g*.5,sw:.3,rv:.4});S.impact(t,g*.6,1.2);},acc:(S,t,g)=>{S.n(t,.5,{type:'bandpass',f:1400,to:400,q:.8,g:g*.35,sw:.15,rv:.3});S.drop(900,t+.1,g*.15);},bed:{k:'noise',f:500,q:.5,g:.1}},
 wind:{imp:(S,t,g)=>{S.whoosh(t-.1,.6,g*.5,500,3500,-.7,.7);S.impact(t,g*.45,1);},acc:(S,t,g)=>{S.whoosh(t,.45,g*.35,400,2500,.6,-.6);},bed:{k:'noise',f:600,q:.6,g:.09}},
 blade:{imp:(S,t,g)=>{S.slash(t-.02,g*.7,-.4);S.slash(t+.05,g*.6,.4);S.impact(t,g*.4,.8);},acc:(S,t,g)=>{S.slash(t,g*.5,S.R(t*50)*1.6-.8);},bed:{k:'noise',type:'bandpass',f:4200,q:20,g:.035}},
 magic:{imp:(S,t,g)=>{S.bell(1319,t,1.6,g*.2);S.bell(1760,t+.03,1.4,g*.14);S.sparkle(t,.7,g*.1);S.impact(t,g*.3,.7);},acc:(S,t,g)=>{S.pluck(880*(1+S.R(t*20)*1.2),t,.7,g*.2);S.sparkle(t,.3,g*.07);},bed:{k:'osc',type:'triangle',f:392,g:.04}},
 boom:{imp:(S,t,g)=>{S.explosion(t,g,1.2);},acc:(S,t,g)=>{S.explosion(t,g*.55,.7);},bed:{k:'noise',type:'lowpass',f:160,g:.12}},
 mech:{imp:(S,t,g)=>{S.fm(300,17,220,t,.5,{g:g*.25});S.impact(t,g*.5,.8);S.bell(700,t,.8,g*.12);},acc:(S,t,g)=>{S.tick(t,g*.25,1200);S.t(900,t+.03,.12,{type:'square',g:g*.12});},bed:{k:'osc',type:'sawtooth',f:100,g:.06}},
 nature:{imp:(S,t,g)=>{S.impact(t,g*.4,.9);S.pluck(523,t,.9,g*.18);S.pluck(784,t+.07,.9,g*.14);S.n(t,.6,{type:'bandpass',f:2500,q:1,g:g*.1,sw:.3});},acc:(S,t,g)=>{S.t(2200,t,.12,{to:3300,g:g*.15,rv:.4});S.t(2000,t+.14,.12,{to:3000,g:g*.12,rv:.4});},bed:{k:'noise',f:1000,q:.5,g:.05}},
 time:{imp:(S,t,g)=>{S.impact(t,g*.6,1.3);S.tick(t-.04,g*.3);S.tick(t+.08,g*.2);},acc:(S,t,g)=>{S.tick(t,g*.3);S.impact(t,g*.3,1);},bed:{k:'osc',f:55,g:.07}},
 space:{imp:(S,t,g)=>{S.impact(t,g*.7,1.6);S.pad(110,t,2,g*.25);S.sparkle(t,.8,g*.09);},acc:(S,t,g)=>{S.sparkle(t,.4,g*.08);S.impact(t,g*.3,1.4);},bed:{k:'noise',f:900,q:1,g:.08}},
 holy:{imp:(S,t,g)=>{S.impact(t,g*.45,1);S.pad(262,t,1.8,g*.28);S.bell(1046,t,1.6,g*.16);},acc:(S,t,g)=>{S.bell(1046*(1+S.R(t*13)*.5),t,1.2,g*.14);},bed:{k:'osc',type:'triangle',f:262,g:.04}},
 gold:{imp:(S,t,g)=>{S.bell(220,t,2,g*.3);S.bell(880,t,1.6,g*.18);S.coin(t,g*.14);S.impact(t,g*.4,.9);},acc:(S,t,g)=>{S.coin(t,g*.12);},bed:{k:'noise',type:'highpass',f:6000,g:.03}},
 beast:{imp:(S,t,g)=>{S.growl(t-.05,1,g*.6,70);S.impact(t,g*.7,1.4);},acc:(S,t,g)=>{S.impact(t,g*.6,1.5);S.n(t,.25,{f:300,to:60,g:g*.3});},bed:{k:'noise',type:'lowpass',f:200,g:.1}},
 gun:{imp:(S,t,g)=>{for(let i=0;i<6;i++)S.gun(t-.1+i*.045,g*.5,S.R(i)*1.4-.7);S.explosion(t+.1,g*.5,.8);},acc:(S,t,g)=>{for(let i=0;i<4;i++)S.gun(t+i*.045,g*.4,S.R(i+t*9)*1.4-.7);S.explosion(t+.1,g*.35,.6);},bed:null},
 fist:{imp:(S,t,g)=>{S.impact(t,g*.75,1);S.n(t,.15,{type:'bandpass',f:2400,q:1.5,g:g*.3});},acc:(S,t,g)=>{S.impact(t,g*.55,.8);S.n(t,.08,{type:'bandpass',f:2800,q:1.5,g:g*.25});},bed:null},
 pop:{imp:(S,t,g)=>{S.impact(t,g*.5,.7);S.n(t,.12,{type:'highpass',f:3500,g:g*.4,rv:.3});S.pluck(523,t+.04,.5,g*.2);S.pluck(659,t+.1,.5,g*.2);S.pluck(784,t+.16,.6,g*.2);S.pluck(1047,t+.22,.9,g*.22);},acc:(S,t,g)=>{S.n(t,.08,{type:'highpass',f:3500,g:g*.3,rv:.3});S.sparkle(t,.4,g*.07);},bed:{k:'noise',type:'highpass',f:6000,g:.03}},
 fireworks:{imp:(S,t,g)=>{S.t(500,t-.35,.35,{to:2000,g:g*.15});S.explosion(t,g*.8,1.1);S.sizzle(t+.1,.8,g*.15);},acc:(S,t,g)=>{S.t(700,t-.25,.25,{to:2200,g:g*.1});S.explosion(t,g*.5,.8);S.sizzle(t+.05,.5,g*.12);},bed:{k:'noise',type:'highpass',f:5000,g:.04}},
};
// ───────── ③ 全演出の一覧（音の性格＋こまかい調整）。キー：「種類:ID」 ─────────
// c：性格 ／ g：音量 ／ x：その演出だけの特別な音（任意）
const _fxSpec={
 'riichi:flame':{c:'fire'},'riichi:sakura':{c:'magic',x:(S,t,G)=>{[784,880,1047,1175,1319,1568].forEach((f,i)=>S.pluck(f,.45+i*.1,.6,.1*G));}},
 'riichi:ice':{c:'ice'},'riichi:thunder':{c:'thunder'},'riichi:aura':{c:'aura'},
 'riichi:thread':{c:'magic',x:(S,t,G)=>{for(let i=0;i<5;i++)S.t(1200+i*260,.4+i*.09,.5,{type:'triangle',g:.08*G,rv:.4});S.n(.4,.6,{type:'bandpass',f:6000,to:9000,q:4,g:.05*G});}},
 'riichi:bubble':{c:'water',x:(S,t,G)=>{for(let i=0;i<7;i++){const f=500+S.R(i)*700;S.t(f,.4+i*.1,.12,{to:f*2,g:.12*G,a:.005,p:S.R(i+4)*1.6-.8,rv:.4});}}},
 'riichi:erase':{c:'time',x:(S,t,G)=>{S.rev(.3,.55,.2*G);S.t(1500,.85,.03,{type:'square',g:.2*G,a:.001});}},
 'riichi:disc':{c:'mech'},'riichi:gravflip':{c:'aura',x:(S,t,G)=>{S.t(300,.4,.5,{to:60,g:.25*G});S.t(60,.9,.5,{to:400,g:.25*G,a:.02});}},
 'riichi:scoop':{c:'mech',x:(S,t,G)=>{S.n(.2,.3,{type:'bandpass',f:800,to:300,q:2,g:.22*G,sw:.4});}},
 'riichi:zipper':{c:'mech',x:(S,t,G)=>{for(let i=0;i<16;i++)S.tick(.3+i*.025,.07*G,1800+i*90);}},
 'riichi:frostsuit':{c:'ice',x:(S,t,G)=>{S.n(.3,1.2,{type:'bandpass',f:500,to:180,q:.9,g:.18*G,sw:.4,rv:.4});}},
 'riichi:forest':{c:'nature'},'riichi:kickshot':{c:'fist',x:(S,t,G)=>{S.t(1800,.32,.3,{to:500,g:.12*G});}},'riichi:dive':{c:'water',x:(S,t,G)=>{S.t(500,.35,.6,{to:70,g:.25*G});}},
 'ron:crimson':{c:'fire'},'ron:void':{c:'aura',x:(S,t,G)=>{S.rev(.1,.5,.2*G);}},'ron:gold':{c:'gold'},'ron:ocean':{c:'water'},
 'ron:rush':{c:'fist',x:(S,t,G)=>{for(let i=0;i<10;i++)S.impact(.4+i*.085,(.3+i*.025)*G,.8);}},
 'ron:claw':{c:'blade'},'ron:heavyrain':{c:'thunder',x:(S,t,G)=>{S.n(0,1.9,{type:'highpass',f:3000,g:.1*G,sw:.3});}},
 'ron:redray':{c:'mech',x:(S,t,G)=>{S.t(200,.2,.5,{to:1600,type:'sawtooth',g:.14*G,sw:.95});S.t(1600,.7,.9,{type:'sawtooth',g:.1*G,sw:.3});}},
 'ron:lightblade':{c:'blade'},'ron:tankbomb':{c:'boom',x:(S,t,G)=>{S.t(55,0,1,{type:'sawtooth',g:.12*G,to:48});}},
 'ron:virus':{c:'mech',x:(S,t,G)=>{S.fm(300,17,200,.4,.9,{g:.1*G});S.t(440,1,.25,{type:'square',g:.08*G});S.t(380,1.25,.25,{type:'square',g:.08*G});}},
 'ron:magnet':{c:'mech'},'ron:jade':{c:'gold',g:.8},'ron:rapier':{c:'blade'},'ron:strafe':{c:'gun'},
 'win:fireworks':{c:'fireworks'},'win:confetti':{c:'pop'},'win:star':{c:'magic',x:(S,t,G)=>{S.t(3200,.3,.9,{to:600,g:.1*G,sw:.2,rv:.4});}},
 'win:royal':{c:'holy',x:(S,t,G)=>{[[262,330,392],[294,370,440],[392,494,587,784]].forEach((ch,i)=>ch.forEach(f=>S.t(f,.35+i*.4,i===2?1.1:.5,{type:'sawtooth',g:.07*G,rv:.4})));S.n(.8,.8,{type:'highpass',f:5000,g:.08*G,rv:.4});}},
 'win:timestop':{c:'time',x:(S,t,G)=>{for(let i=0;i<5;i++)S.tick(.45+i*.12,.1*G);S.rev(.7,.3,.2*G);}},
 'win:mend':{c:'magic',x:(S,t,G)=>{[392,494,587,740,880,1175].forEach((f,i)=>S.pluck(f,.45+i*.1,.8,.12*G));S.pad(196,.3,1.8,.1*G);}},
 'win:sprout':{c:'nature',x:(S,t,G)=>{[523,659,784,1047,1319].forEach((f,i)=>S.pluck(f,.45+i*.1,.5,.13*G));}},
 'win:chronolock':{c:'time',x:(S,t,G)=>{[.45,.55,.67,.83,1.05,1.35,1.75].forEach((t2,i)=>S.tick(t2,.1*G,1500-i*130));}},
 'win:rewind':{c:'time',x:(S,t,G)=>{S.rev(0,.7,.18*G);for(let i=0;i<20;i++)S.tick(.35+i*.03,.05*G,2000);[523,659,784].forEach((f,i)=>S.pluck(f,1.7+i*.1,1,.14*G));}},
 'win:cosmos':{c:'space'},'win:weather':{c:'thunder',x:(S,t,G)=>{S.n(0,2.2,{type:'bandpass',f:400,to:900,q:.6,g:.14*G,sw:.5});S.n(0,2.2,{type:'highpass',f:4500,g:.06*G});}},
 'win:book':{c:'magic',x:(S,t,G)=>{for(let i=0;i<4;i++)S.n(.4+i*.09,.1,{type:'bandpass',f:3500,to:1200,q:.8,g:.16*G});}},
 'win:cure':{c:'holy',x:(S,t,G)=>{S.n(.3,1.4,{type:'highpass',f:5000,g:.06*G,sw:.3});}},
 'win:dino':{c:'beast'},'win:stillrain':{c:'water',g:.8,x:(S,t,G)=>{for(let i=0;i<10;i++)S.drop(1200+S.R(i)*1800,.4+i*.17,.1*G);}},
 'win:rainbow':{c:'magic',x:(S,t,G)=>{S.sparkle(.3,1.6,.1*G);[523,659,784,1047,1319,1568].forEach((f,i)=>S.pluck(f,.4+i*.12,.7,.12*G));S.n(.3,.6,{type:'bandpass',f:2000,to:6000,g:.08*G});}},
 'ron:default':{c:'blade',g:.9},'win:default':{c:'magic',g:.9,x:(S,t,G)=>{S.pad(262,.3,1.6,.12*G);}},
};
// 共通の「絵のタイミング」＋測定データ＋その演出だけの音 を組み合わせて、1つの音にする
function _fxCompose(kind,id){
  const sp=_fxSpec[kind+':'+id],ch=sp&&_fxCH[sp.c];if(!ch)return null;
  const sy=(typeof FX_SYNC!=='undefined'&&FX_SYNC[kind+':'+id])||{D:2.4,on:[],env:null};
  return S=>{const G=sp.g||1,D=sy.D||2.4;
    // 絵の共通タイミング：0秒＝帯が開く／.12＝文字が迫る／.22・.30＝斬撃(ロン)／.30＝閃光・輪・火花・文字の叩きつけ／.38＝2つ目の輪
    S.whoosh(0,.28,.16*G,300,2600,-.6,.3);
    if(kind==='ron'){S.slash(.22,.3*G,-.5);S.slash(.30,.34*G,.5);}
    S.riser(.1,.2,.16*G,4500);
    ch.imp(S,.30,.95*G);
    S.n(.30,.5,{type:'bandpass',f:5000,q:8,g:.05*G,rv:.5});S.tick(.38,.12*G,2600);S.sizzle(.32,.7,.08*G);
    if(kind==='ron')S.rumble(.28,.5,.2*G);
    // 絵が盛り上がる瞬間（測定）に、音を入れる
    sy.on.forEach(([t,s])=>{if(t>.45&&t<D-.3)ch.acc(S,t-.04,G*(.35+.65*s));});
    // 絵の明るさ・動きに合わせて、背景の音が動く
    if(ch.bed&&sy.env)S.bed(ch.bed.k,.3,Math.max(.6,D-.9),sy.env,{type:ch.bed.type,f:ch.bed.f,q:ch.bed.q,g:ch.bed.g*G,rv:.25});
    if(sp.x)sp.x(S,sy,G);};
}
const FX_GAIN={'riichi:aura':0.41,'riichi:bubble':0.95,'riichi:disc':1.13,'riichi:dive':0.94,'riichi:erase':0.78,'riichi:flame':0.79,'riichi:forest':1.37,'riichi:frostsuit':1.02,'riichi:gravflip':0.4,'riichi:ice':0.88,'riichi:kickshot':0.78,'riichi:sakura':1,'riichi:scoop':1.16,'riichi:thread':0.94,'riichi:thunder':0.67,'riichi:zipper':1.12,'ron:claw':1.36,'ron:crimson':0.75,'ron:default':1.52,'ron:gold':0.67,'ron:heavyrain':0.83,'ron:jade':0.79,'ron:lightblade':1.35,'ron:magnet':1.06,'ron:ocean':0.95,'ron:rapier':1.38,'ron:redray':1,'ron:rush':0.42,'ron:strafe':0.78,'ron:tankbomb':0.46,'ron:virus':1.02,'ron:void':0.4,'win:book':0.98,'win:chronolock':0.85,'win:confetti':1.13,'win:cosmos':0.51,'win:cure':0.57,'win:default':0.99,'win:dino':0.51,'win:fireworks':0.4,'win:mend':0.84,'win:molt3':0.67,'win:rainbow':0.95,'win:rewind':0.79,'win:royal':0.64,'win:sprout':1.17,'win:star':0.92,'win:stillrain':1.11,'win:timestop':0.83,'win:weather':0.66}; // 演出どうしの音量をそろえる補正（自動で求めた値。ここに無い演出は 1 倍）
(function(){for(const k of Object.keys(_fxSpec)){const [kind,id]=k.split(':');const r=_fxCompose(kind,id);if(r)FX_SOUND[k]=r;}})();

// ───────── ④ 三段の脱皮（絵の時刻に、ぴったり合わせた音。4.4秒） ─────────
//  絵の時刻：①0〜1.3秒＝文字が1文字ずつ貼り付く(0.08/0.25/0.42/0.59/0.76) ②1.3〜2.6秒＝ひび割れ(〜1.8)→殻が弾ける1.82→爆発1.95→熱2.26
//           ③2.6〜3.9秒＝光が落ちる(〜2.99)→岩を殴る2.99→めり込む・割れる・砂ぼこり
FX_SOUND['win:molt3']=S=>{
  S.whoosh(0,.28,.14,300,2600,-.6,.3);S.riser(.1,.2,.12,3500);S.impact(.30,.4,1.1);S.tick(.38,.1,2600); // 共通の絵のタイミング（文字「上がり！」の叩きつけ）
  // ①文字が卵に貼り付く：ペタッという貼り付き音＋ドクンという鼓動＋音が頭に響くこだま
  [.08,.25,.42,.59,.76].forEach((t,i)=>{S.n(t,.05,{type:'bandpass',f:1300,q:2,g:.22,a:.001,p:i%2?.4:-.4});S.t(95+i*6,t,.2,{to:48,g:.34,a:.002});
    S.bell(440*Math.pow(1.26,i),t,.8,.11);S.bell(440*Math.pow(1.26,i),t+.22,.7,.05);S.bell(440*Math.pow(1.26,i),t+.44,.7,.03);});
  S.t(220,0,1.4,{g:.07,sw:.6,vib:[5,3],rv:.4});S.t(330,.2,1.1,{g:.04,sw:.6,rv:.4});
  // ②ひび割れ（1.3〜1.8）：パキッ…パキパキ…と数が増え、内側から光が漏れてくる
  [1.36,1.48,1.58,1.66,1.73,1.78].forEach((t,i)=>{S.n(t,.05,{type:'highpass',f:3200+i*300,g:.2,a:.0005,p:S.R(i)*1.2-.6});S.t(170+i*35,t,.07,{type:'square',g:.05});});
  S.t(300,1.3,.55,{to:1100,type:'sawtooth',g:.07,sw:.95,rv:.3});S.n(1.3,.55,{type:'bandpass',f:1500,to:5000,q:3,g:.07,sw:.95});
  // 殻が弾ける（1.82）→殻のかけらが地面に落ちてコツンと鳴る
  S.n(1.82,.02,{type:'highpass',f:4000,g:.5,a:.0005});S.glass(1.82,.4);S.n(1.82,.45,{type:'highpass',f:2500,to:6500,g:.3,rv:.4});
  for(let i=0;i<8;i++){const t=2.0+S.R(i)*.55;S.t(1100+S.R(i+3)*1600,t,.1,{type:'triangle',g:.1,a:.001,p:S.R(i+5)*1.6-.8,rv:.4});S.n(t,.03,{type:'bandpass',f:2500,q:3,g:.08,p:S.R(i+5)*1.6-.8});}
  // しっぽの文字（ズ・グ・ゥ・シ）がふわっと灯る
  [1.85,1.92,1.98,2.05].forEach((t,i)=>S.pluck(660-i*70,t,.6,.1));
  // 爆発（1.95〜2.26）：ドグォーム！
  S.explosion(1.95,.65,1.2);S.n(1.95,.3,{f:4500,to:300,g:.3});
  S.impact(1.97,.3,1.2);
  // 熱（2.26〜）：ズグゥシ…ジュウウ
  S.n(2.26,.9,{type:'bandpass',f:2500,to:1200,q:.8,g:.14,sw:.3,rv:.3});S.sizzle(2.26,.9,.12);S.rumble(2.2,.6,.14);S.t(80,2.26,.7,{to:60,g:.14,sw:.3});
  // ③光が落ちてくる（2.6〜2.99）：近づく風切り音
  S.n(2.6,.4,{type:'bandpass',f:500,to:5500,q:2,g:.22,sw:.97,rv:.2});S.t(300,2.6,.4,{to:2600,type:'sine',g:.12,sw:.97});
  // 岩を殴る（2.99）：ドォン！＋岩が割れる音
  S.impact(2.99,.8,1.5);S.explosion(2.99,.42,1.3);S.n(2.99,.02,{type:'highpass',f:2500,g:.6,a:.0005});
  // めり込む：ゴリゴリと岩が地面に沈む音／地面の割れ目が走る
  S.n(3.0,.7,{f:300,to:70,g:.28,sw:.2,rv:.3});S.t(70,3.0,.8,{to:40,type:'sawtooth',g:.14,sw:.2});
  for(let i=0;i<9;i++)S.n(3.03+i*.055,.05,{type:'bandpass',f:260+S.R(i)*500,q:3,g:.22*(1-i*.06),p:S.R(i+6)*1.4-.7});
  // 砂ぼこり／破片がパラパラと落ちる
  S.n(3.1,.9,{type:'highpass',f:3000,g:.06,sw:.2});for(let i=0;i<10;i++)S.t(900+S.R(i)*900,3.25+S.R(i+8)*.55,.06,{type:'triangle',g:.07,a:.001,p:S.R(i)*1.6-.8,rv:.3});
  // 「ズゥゥン…」：低くのびる余韻
  S.t(55,3.0,1.4,{type:'sawtooth',to:40,g:.16,sw:.1,rv:.5});S.rumble(3.0,1.35,.3);
};

// ───────── ⑤ 開発者とマッチしたときの音（GIFにぴったり合わせる・約3.7秒） ─────────
//  GIFを測ったデータ（16-fx-sync.js）から：0.25秒＝最初のカット／1.3秒＝暗転／1.95秒＝まぶしく光る／3.05〜3.1秒＝カット／3.6秒＝暗転して終わる
function devMatchSound(){
  _gfxAudio(ctx=>_fxRun(ctx,ctx.destination,S=>{
    const bright=typeof DEV_GIF_SYNC!=='undefined'?DEV_GIF_SYNC.bright:null;
    S.t(46,0,3.7,{g:.18,sw:.5,rv:.3});S.t(69,0,3.7,{type:'sawtooth',g:.04,to:58,sw:.5});
    if(bright)S.bed('noise',0,3.6,bright,{type:'bandpass',f:260,q:1.2,g:.2,rv:.4}); // 絵の明るさに合わせて、気配が膨らむ
    S.impact(.25,.45,1.1);S.n(.2,.08,{type:'highpass',f:3000,g:.3});                                    // 最初のカット
    S.n(.9,.4,{type:'lowpass',f:6000,to:200,g:.25,a:.01});S.t(880,1.0,.3,{to:110,g:.1,rv:.5});               // 暗転へ吸い込まれる
    S.impact(1.3,.35,1.6);                                                                               // 暗転の一撃…そのあと静寂
    S.rev(1.5,.45,.28);S.t(1760,1.6,.4,{to:2400,g:.05,sw:.9,rv:.5});                                    // 光へ向かう逆再生のうなり
    S.explosion(1.95,.55,1.5);S.bell(1397,1.95,1.6,.12);S.pad(110,1.95,1.6,.18);S.n(1.95,.02,{type:'highpass',f:3500,g:.5,a:.0005}); // まぶしく光る
    S.impact(3.05,.45,1.3);S.impact(3.1,.3,1.8);S.n(3.2,.3,{type:'highpass',f:2500,g:.14,sw:.2});            // 続くカット
    S.n(3.55,.12,{type:'highpass',f:4000,g:.22,a:.001});S.t(120,3.6,.3,{to:45,g:.3,a:.002});                // 暗転して終わる
    [.6,1,1.5,2.4,2.8].forEach((t,i)=>S.impact(t,.14,.6)); // 遠くの鼓動
  },ctx.currentTime+.03,.65));
}
