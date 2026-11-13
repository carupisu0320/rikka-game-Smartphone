// =====================================================================
//  演出ごとのサウンド。すべて、その場で作る合成音です（音声ファイルは要りません）
//  ・演出ごとに、描かれているもの「そのものの音」で作ってあります
//      例：炎＝着火のボッ＋燃える音＋パチパチ／雷＝稲光のバリッ＋ゴロゴロ／波＝せり上がり＋砕ける泡／時計＝カチ・コチ…止まる
//  ・絵の動きに合わせています（音ハメ）
//      ・0.30秒＝文字が叩きつけられ、閃光が走る（全演出で絵が共通）
//      ・演出ごとの「盛り上がる瞬間」（16-fx-sync.js の測定データ）に、その演出の音が入ります
//  ・効果音がOFF、または音量0のときは鳴りません（既存の設定に従います）
//  ・新しい演出に音を付けるには、addFx({... sound:S=>{ ... }}) と書きます（13-new-items.js）
// =====================================================================

// ───────── ① 音のエンジン（触らなくてOK） ─────────
function _fxRun(ctx,dest,recipe,t0,gain){
  const vol=(typeof soundVolume==='number'?soundVolume:.5)*.9*(gain||1),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const master=ctx.createGain();master.gain.value=vol;
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=14;comp.ratio.value=7;comp.attack.value=.002;comp.release.value=.22;
  const sat=ctx.createWaveShaper(),cv=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/511.5-1;cv[i]=.8*Math.tanh(x*1.25)/Math.tanh(1.25);}sat.curve=cv;sat.oversample='2x'; // 音割れ防止
  const cap=ctx.createWaveShaper();cap.curve=new Float32Array([-1,0,1]);cap.oversample='none'; // 念のための最後の頭打ち（1.0をこえない）
  master.connect(comp);comp.connect(sat);sat.connect(cap);cap.connect(dest);
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
  // 音程のある音：周波数f、開始s秒、長さd秒。o={type,g,to(最後の周波数),a(立ち上がり),sw(山の位置0〜1),det,p/p1(左右),rv(残響),vib:[Hz,深さ],am:[Hz,深さ],lp:[はじめ,おわりのカットオフ]}
  S.t=(f,s,d,o)=>{s=Math.max(0,s);o=o||{};const osc=ctx.createOscillator(),g=ctx.createGain();osc.type=o.type||'sine';osc.frequency.setValueAtTime(Math.max(1,f),t0+s);
    if(o.to)osc.frequency.exponentialRampToValueAtTime(Math.max(1,o.to),t0+s+d);if(o.det)osc.detune.value=o.det;
    if(o.vib){const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=o.vib[0];lg.gain.value=o.vib[1];l.connect(lg);lg.connect(osc.frequency);l.start(t0+s);l.stop(t0+s+d+.05);}
    let node=osc;
    if(o.lp){const f2=ctx.createBiquadFilter();f2.type='lowpass';f2.frequency.setValueAtTime(Math.max(20,o.lp[0]),t0+s);f2.frequency.exponentialRampToValueAtTime(Math.max(20,o.lp[1]),t0+s+d);node.connect(f2);node=f2;}
    if(o.am){const ag=ctx.createGain(),l=ctx.createOscillator(),lg=ctx.createGain();ag.gain.value=1-o.am[1];l.frequency.value=o.am[0];lg.gain.value=o.am[1];l.connect(lg);lg.connect(ag.gain);l.start(t0+s);l.stop(t0+s+d+.05);node.connect(ag);node=ag;}
    env(g,s,d,o.g==null?.2:o.g,o.a,o.sw);node.connect(g);out(g,o,s,d);osc.start(t0+s);osc.stop(t0+s+d+.05);};
  // ノイズ（風・爆発・斬撃など）：o={type(lowpass/highpass/bandpass),f(中心),to(最後のf),q,g,a,sw,p,p1,rv}
  S.n=(s,d,o)=>{s=Math.max(0,s);o=o||{};const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=ctx.__fxNb;src.loop=true;
    f.type=o.type||'lowpass';f.frequency.setValueAtTime(Math.max(20,o.f||1000),t0+s);if(o.to)f.frequency.exponentialRampToValueAtTime(Math.max(20,o.to),t0+s+d);f.Q.value=o.q||.7;
    env(g,s,d,o.g==null?.2:o.g,o.a,o.sw);src.connect(f);f.connect(g);out(g,o,s,d);src.start(t0+s,R(s*100+d)*1.5);src.stop(t0+s+d+.05);};
  // ゆらぐノイズ（炎・風・波・雨・雷鳴・エンジン）：音量と音の高さが、自然にばらつく。o={type,f,to,q,g,depth(ゆらぎの深さ),fm(高さのゆらぎ),step,shape:'sw'山/'dec'減衰/'rise'上昇/'flat'一定,p,p1,rv}
  S.nm=(s,d,o)=>{s=Math.max(0,s);o=o||{};const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=ctx.__fxNb;src.loop=true;
    f.type=o.type||'lowpass';f.Q.value=o.q||.7;const base=o.f||800,step=o.step||.05,depth=o.depth==null?.5:o.depth,pk=o.g==null?.2:o.g,fm=o.fm||0,sh=o.shape||'sw';
    g.gain.setValueAtTime(MIN,t0+s);f.frequency.setValueAtTime(Math.max(20,base),t0+s);
    for(let tt=step;tt<=d;tt+=step){const u=tt/d,x=R(s*91+tt*57+(o.seed||0)),y=R(s*13+tt*71+5);
      const shp=sh==='dec'?Math.pow(1-u,1.6):sh==='rise'?Math.pow(u,1.4):sh==='flat'?Math.min(1,u*12)*Math.min(1,(1-u)*12):Math.pow(Math.sin(Math.PI*Math.pow(u,.7)),.8);
      g.gain.linearRampToValueAtTime(Math.max(MIN,pk*shp*(1-depth+depth*x)),t0+s+tt);
      f.frequency.linearRampToValueAtTime(Math.max(20,(o.to?base+(o.to-base)*u:base)*(1+(y-.5)*fm)),t0+s+tt);}
    g.gain.linearRampToValueAtTime(MIN,t0+s+d+.03);src.connect(f);f.connect(g);out(g,o,s,d);src.start(t0+s,R(s*77+d)*1.5);src.stop(t0+s+d+.1);};
  S.fm=(fc,fmf,idx,s,d,o)=>{s=Math.max(0,s);o=o||{};const c=ctx.createOscillator(),m=ctx.createOscillator(),mg=ctx.createGain(),g=ctx.createGain();c.frequency.value=fc;m.frequency.value=fmf;mg.gain.value=idx;
    m.connect(mg);mg.connect(c.frequency);env(g,s,d,o.g==null?.15:o.g,o.a,o.sw);c.connect(g);out(g,o,s,d);c.start(t0+s);m.start(t0+s);c.stop(t0+s+d+.05);m.stop(t0+s+d+.05);};
  // 絵の明るさ・動きに合わせて音量が動く、背景の音（envArr：1秒に30個の0〜99）
  S.bed=(kind,s,d,envArr,o)=>{s=Math.max(0,s);o=o||{};const g=ctx.createGain(),pk=o.g==null?.15:o.g,e=envArr&&envArr.length?envArr:null;let src;
    if(kind==='noise'){src=ctx.createBufferSource();src.buffer=ctx.__fxNb;src.loop=true;const f=ctx.createBiquadFilter();f.type=o.type||'bandpass';f.frequency.value=o.f||800;f.Q.value=o.q||.7;src.connect(f);f.connect(g);}
    else{src=ctx.createOscillator();src.type=o.type||'sawtooth';src.frequency.value=o.f||80;src.connect(g);}
    g.gain.setValueAtTime(MIN,t0+s);const a=Math.min(.25,d*.2);
    for(let tt=0;tt<=d;tt+=.04){const i=clamp(Math.round((s+tt)*30),0,(e?e.length:1)-1),v=e?e[i]/99:.6,fade=clamp(tt/a,0,1)*clamp((d-tt)/.35,0,1);g.gain.linearRampToValueAtTime(Math.max(MIN,pk*(.2+.8*v)*fade),t0+s+tt);}
    g.gain.linearRampToValueAtTime(MIN,t0+s+d+.05);out(g,o,s,d);src.start(t0+s);src.stop(t0+s+d+.1);};

  // ---- 基本の音 ----
  S.impact=(s,g,sz)=>{g=g==null?.5:g;sz=sz||1;S.n(s,.012,{type:'highpass',f:5000,g:g*.8,a:.0005,rv:.05});S.n(s,.09,{f:1100/sz,to:120,g:g*.9,a:.001,rv:.1});
    S.t(150/sz,s,.22*sz,{to:48,type:'triangle',g:g*.9,a:.002,rv:.1});S.t(72/Math.sqrt(sz),s,.7*sz,{to:28,g,a:.003,rv:.1});S.n(s+.02,.9*sz,{f:700,to:80,g:g*.32,a:.02,rv:.55});};
  S.explosion=(s,g,d)=>{g=g==null?.5:g;d=d||1;S.n(s,.02,{type:'highpass',f:5000,g:g*.8,a:.0005,rv:.05});S.n(s,d*.8,{f:2800,to:90,g,a:.003,rv:.25});
    S.t(78,s,d,{to:24,g:g*1.1,a:.004,rv:.1});S.t(190,s,.3,{to:50,type:'sawtooth',g:g*.28,a:.003});
    for(let i=0;i<10;i++)S.n(s+.08+i*d/12+R(i+s*7)*.05,.05+R(i)*.06,{type:'bandpass',f:700+R(i+3)*2600,q:2,g:g*.17*(1-i/14),p:R(i+9)*2-1,rv:.3});S.n(s+.1,d*1.3,{f:200,to:50,g:g*.4,a:.04,rv:.6});};
  S.tick=(s,g,f)=>{S.t(f||1800,s,.035,{type:'square',g:g==null?.12:g,a:.001,rv:.12});S.n(s,.02,{type:'bandpass',f:4000,g:(g==null?.12:g)*.6,a:.0005,rv:.05});};
  S.bell=(f,s,d,g)=>{d=d||1.2;g=g==null?.15:g;[1,2,2.76,5.4,8.93].forEach((m,i)=>{S.t(f*m,s,d/(1+i*.55),{g:g/(1+i*.9),a:.002,rv:.5});if(i<3)S.t(f*m*1.003,s,d/(1+i*.55),{g:g/(1+i*.9)*.6,a:.002,rv:.5});});};
  S.rev=(s,d,g)=>S.n(s,d,{type:'lowpass',f:200,to:6000,g:g==null?.2:g,sw:.97,rv:.3});
  S.pad=(f,s,d,g)=>{[1,1.5,2].forEach((m,i)=>S.t(f*m,s,d,{type:'triangle',g:(g==null?.1:g)/(1+i*.4),det:(i-1)*6,sw:.45,rv:.5}));};
  S.pluck=(f,s,d,g)=>{S.t(f,s,d||.7,{type:'triangle',g:g==null?.14:g,a:.002,rv:.4});S.t(f*2,s,(d||.7)*.5,{g:(g==null?.14:g)*.3,a:.001});};
  S.drop=(f,s,g)=>S.t(f,s,.28,{to:f*.88,g:g==null?.1:g,a:.002,p:R(f+s)*1.6-.8,rv:.5});
  S.sparkle=(s,d,g)=>{for(let i=0;i<10;i++)S.t(2500+R(i)*3200,s+i*d/10+R(i+30)*.04,.16,{g:g==null?.08:g,p:R(i+5)*1.6-.8,rv:.5});};
  S.rumble=(s,d,g)=>{g=g==null?.25:g;S.nm(s,d,{f:140,to:60,g,depth:.5,shape:'sw',rv:.3});S.t(48,s,d,{g:g*.7,sw:.3});};
  S.glass=(s,g)=>{g=g==null?.2:g;S.n(s,.1,{type:'highpass',f:5000,to:9000,g,a:.001,rv:.4});for(let i=0;i<6;i++)S.t(3500+R(i+s*9)*3000,s+i*.025,.3,{g:g*.4,a:.001,p:R(i+2)*1.6-.8,rv:.5});};
  S.coin=(s,g)=>{g=g==null?.12:g;for(let i=0;i<7;i++){const f=3000+i*320;S.t(f,s+i*.045,.22,{type:'triangle',g,a:.001,rv:.35});S.t(f*1.5,s+i*.045,.18,{g:g*.3,a:.001});}};
  S.growl=(s,d,g,f)=>{f=f||70;g=g==null?.3:g;S.t(f,s,d,{type:'sawtooth',to:f*.62,g,sw:.2,vib:[24,f*.05],rv:.2});S.t(f*2,s,d,{type:'sawtooth',to:f*1.2,g:g*.4,vib:[27,f*.1]});S.n(s,d,{type:'bandpass',f:600,to:1500,q:3,g:g*.7,sw:.3,rv:.2});};
  S.drone=(s,d,g,f)=>{f=f||55;g=g==null?.2:g;S.t(f,s,d,{type:'sawtooth',g,sw:.5,rv:.3,lp:[200,400]});S.t(f*1.5,s,d,{type:'sawtooth',g:g*.5,det:7,sw:.5,lp:[200,400]});S.t(f/2,s,d,{g:g*1.2,sw:.5});};
  S.fm2=S.fm;
  // ---- 本物らしい「そのものの音」 ----
  S.pops=(s,d,rate,g,o)=>{o=o||{};const f0=(o.f||[2500,7000])[0],f1=(o.f||[2500,7000])[1],n=Math.max(1,Math.floor(d*rate));
    for(let i=0;i<n;i++){const u=R(i*7+s*13);S.n(s+u*d,.006+R(i+3)*.02,{type:o.type||'bandpass',f:f0+R(i+9)*(f1-f0),q:o.q||3,g:g*(.25+.75*R(i+5))*(o.decay?(1-u):1),a:.0005,p:R(i+17)*2-1,rv:o.rv==null?.15:o.rv});}}; // パチパチ・ポツポツ
  S.thunder=(s,g,d)=>{d=d||2.6;S.n(s,.04,{type:'highpass',f:1500,g,a:.0005,rv:.1});S.n(s,.35,{type:'bandpass',f:900,q:.6,g:g*.7,a:.001,rv:.3});S.n(s+.14,.1,{type:'highpass',f:2000,g:g*.5,a:.001});
    S.nm(s+.05,d,{f:170,to:55,type:'lowpass',depth:.85,step:.07,g:g*.6,shape:'sw',rv:.5});S.t(40,s,d*.7,{to:28,g:g*.5,a:.02,rv:.4});for(let i=0;i<3;i++)S.nm(s+.5+i*.5,.7,{f:200,to:70,type:'lowpass',depth:.8,g:g*.35*(1-i*.2),shape:'sw',rv:.5});}; // 稲光のバリッ＋ゴロゴロ
  S.rain=(s,d,g,heavy)=>{S.nm(s,d,{type:'highpass',f:2800,g:g*.45,depth:.25,step:.03,shape:'flat',rv:.25});S.pops(s,d,heavy?50:30,g*.8,{f:[2500,6500],q:2,rv:.3});if(heavy)S.pops(s,d,18,g,{type:'lowpass',f:[300,900],q:1});}; // 雨
  S.wave=(s,g,sz)=>{sz=sz||1;S.nm(s-.45*sz,.5*sz,{type:'lowpass',f:200,to:1800,g:g*.5,depth:.3,shape:'rise',rv:.3});S.n(s,.12,{f:6000,to:600,g:g*.9,a:.003,rv:.3});
    S.nm(s,1.1*sz,{type:'highpass',f:2500,to:1200,g:g*.45,depth:.5,step:.04,shape:'dec',rv:.4});S.nm(s+.1,1.5*sz,{type:'lowpass',f:700,to:150,g:g*.5,depth:.4,shape:'dec',rv:.4});S.t(55,s,.6*sz,{to:35,g:g*.5,a:.01});}; // 波：せり上がり→砕け→泡→引き
  S.wind=(s,d,g,howl)=>{S.nm(s,d,{type:'bandpass',f:700,to:1100,q:1.2,fm:.6,depth:.55,step:.06,g,shape:'sw',rv:.35});if(howl)S.t(520,s,d,{to:760,g:g*.12,sw:.5,vib:[.8,40],rv:.5});}; // 風
  S.iceCrack=(s,g)=>{for(let i=0;i<7;i++)S.n(s+i*(.008+R(i)*.01),.012,{type:'bandpass',f:2500+R(i+2)*4500,q:14,g:g*(.4+.6*R(i+4)),a:.0003,p:R(i+8)*1.6-.8,rv:.3});S.t(3800+R(s)*1500,s+.02,.4,{g:g*.18,rv:.5});S.t(5200,s+.03,.3,{g:g*.1,rv:.5});S.n(s,.05,{f:900,g:g*.4,a:.0005});}; // 氷のピシッ
  S.shing=(s,g,p)=>{S.n(s,.22,{type:'bandpass',f:2500,to:9500,q:2,g:g*.7,a:.003,p,rv:.15});[2150,3180,5470,7600].forEach((f,i)=>S.t(f,s+.06,.9/(1+i*.4),{g:g*.14/(1+i*.7),a:.002,p,rv:.45}));}; // 刀のシャリーン
  S.swish=(s,g,p,w)=>S.n(s,.1+(w||0),{type:'bandpass',f:1500,to:6500,q:1.6,g,a:.004,p,rv:.1});
  S.punch=(s,g,p)=>{S.t(135,s,.11,{to:55,g:g*.9,a:.001,p});S.n(s,.05,{type:'bandpass',f:750,q:1.1,g:g*.8,a:.001,p});S.n(s-.04,.06,{type:'bandpass',f:3200,to:1500,q:1.5,g:g*.25,a:.01,p});S.n(s,.02,{type:'highpass',f:2500,g:g*.3,a:.0005,p});}; // 殴る
  S.footstep=(s,g)=>{S.t(60,s,.35,{to:32,g,a:.003});S.n(s,.25,{f:500,to:90,g:g*.7,a:.002,rv:.3});S.nm(s,.8,{f:120,to:50,g:g*.4,depth:.5,shape:'dec',rv:.5});}; // どしん（足音）
  S.gun=(s,g,p)=>{g=g==null?.3:g;S.n(s,.02,{type:'highpass',f:3000,g,a:.0005,p});S.t(140,s,.07,{to:60,g:g*.8,a:.001,p});S.n(s,.09,{type:'bandpass',f:1400,q:1,g:g*.6,a:.001,p,rv:.3});};
  S.whistle=(s,d,g,f0,f1,p0,p1)=>{S.t(f0,s,d,{to:f1,g,a:.03,sw:.7,vib:[6,f0*.012],p:p0,p1,rv:.3});S.n(s,d,{type:'bandpass',f:f0,to:f1,q:14,g:g*.5,sw:.7,p:p0,p1});}; // ヒュ〜（笛・落下）
  S.zip=(s,d,g)=>{const N=Math.floor(d*60);for(let i=0;i<N;i++){const u=i/N;S.t(1500+u*1800,s+u*d,.012,{type:'square',g:g*.5,a:.0005,p:.3*Math.sin(i),rv:.05});}S.nm(s,d,{type:'bandpass',f:2500,to:5500,q:5,g:g*.6,depth:.3,shape:'flat'});}; // ジーッ
  S.ricochet=(s,g,p)=>{S.t(3800,s,.5,{to:900,g:g*.25,p,rv:.4});S.n(s,.02,{type:'highpass',f:4000,g:g*.5,p});S.t(2400,s,.15,{to:1900,type:'triangle',g:g*.12,p});}; // ピュイーン
  S.bird=(s,g,k)=>{const b=2500+(k%5)*500;for(let i=0;i<3+k%3;i++)S.t(b*(1+i*.08),s+i*.09,.07,{to:b*(1.3+(k%2)*.3),g:g*.5,a:.003,vib:[30,60],p:R(k)*1.6-.8,rv:.4});}; // 鳥
  S.paper=(s,d,g)=>{S.pops(s,d,40,g,{f:[1800,5000],q:1.2,rv:.1});S.nm(s,d,{type:'bandpass',f:3500,q:.8,g:g*.4,depth:.8,step:.03,shape:'dec'});}; // 紙・ページ
  S.scrub=(s,d,g)=>{const N=Math.floor(d*14);for(let i=0;i<N;i++)S.n(s+i/14,.05,{type:'bandpass',f:1100+R(i)*800,q:.9,g:g*(.6+.4*R(i+3)),a:.006,p:i%2?-.3:.3,rv:.05});}; // ゴシゴシ（消しゴム）
  S.steam=(s,d,g)=>S.nm(s,d,{type:'highpass',f:4500,g,depth:.4,step:.04,shape:'sw',rv:.25});
  S.squelch=(s,g)=>{const f=90+R(s*3)*160;S.t(f,s,.18,{to:f*2.2,g,a:.01,rv:.2});S.n(s,.12,{type:'bandpass',f:500,to:1200,q:3,g:g*.5});}; // ぬちゃ
  S.plane=(s,d,g)=>{S.t(140,s,d,{to:100,type:'sawtooth',g,am:[42,.5],lp:[900,700],p:-1,p1:1,rv:.2});S.nm(s,d,{type:'lowpass',f:500,g:g*.6,depth:.3,shape:'sw',p:-1,p1:1});}; // プロペラ機の通過
  S.heart=(s,g)=>{S.t(55,s,.16,{to:40,g,a:.003});S.t(50,s+.17,.18,{to:36,g:g*.7,a:.003});};
  S.tapeRewind=(s,d,g)=>{S.t(180,s,d,{to:2400,type:'sawtooth',g:g*.5,lp:[800,5000],vib:[22,40],am:[28,.4],sw:.9});S.nm(s,d,{type:'bandpass',f:1500,to:5000,q:1.2,g:g*.4,depth:.6,step:.02,shape:'rise'});for(let i=0;i<22;i++)S.tick(s+i*d/22,g*.2);};
  S.clockTick=(s,g,alt)=>{S.n(s,.035,{type:'bandpass',f:alt?1000:1500,q:9,g,a:.0005,rv:.2});S.t(alt?620:900,s,.05,{type:'triangle',g:g*.4,a:.0005});}; // カチ・コチ
  S.koto=(f,s,g)=>{S.t(f,s,1.1,{type:'triangle',to:f*.985,g,a:.002,rv:.4});S.t(f*2.01,s,.5,{g:g*.35,a:.001});S.n(s,.02,{type:'bandpass',f:3000,q:2,g:g*.5});}; // 琴
  S.stoneChime=(f,s,g)=>{S.n(s,.02,{type:'bandpass',f:1800,q:4,g:g*.7});[1,2.32,4.1].forEach((m,i)=>S.t(f*m,s,1.6/(1+i),{g:g/(1+i*1.2),a:.002,rv:.5}));}; // 石の鐘
  S.gong=(s,g,f)=>{f=f||110;[1,1.5,2,2.74,3.38,4.7].forEach((m,i)=>S.t(f*m*(1+(i%2?.003:-.002)),s,3.2/(1+i*.5),{g:g/(1+i*.6),a:.003,rv:.6}));S.n(s,.06,{f:1500,to:300,g:g*.8,a:.001});};
  S.timp=(s,g,f)=>{S.t(f||90,s,.5,{to:(f||90)*.8,type:'triangle',g,a:.003,rv:.3});S.n(s,.05,{f:400,g:g*.6,a:.001});};
  S.cymbal=(s,g)=>{S.n(s,1.4,{type:'highpass',f:4500,g,a:.002,rv:.4});S.n(s,.9,{type:'bandpass',f:8000,q:1.2,g:g*.6,a:.002,rv:.4});};
  S.brass=(f,s,d,g)=>{[0,-8,9].forEach(det=>S.t(f,s,d,{type:'sawtooth',det,g:(g==null?.1:g)/1.8,a:.05,sw:.35,lp:[f*2,f*7],vib:[5.5,f*.006],rv:.35}));}; // 金管
  S.whisper=(s,d,g)=>S.nm(s,d,{type:'bandpass',f:1100,to:1800,q:6,fm:.7,depth:.9,step:.05,g,shape:'sw',rv:.5}); // ささやき
  S.snip=(s,g,p)=>{S.n(s,.03,{type:'bandpass',f:5000,q:3,g,a:.0005,p});S.t(4200,s,.08,{to:3000,type:'triangle',g:g*.2,p});}; // ちょきん
  S.clink=(s,g)=>{S.t(3200,s,.25,{g,a:.001,rv:.4});S.t(4800,s,.18,{g:g*.5,a:.001});};
  S.roar=(s,d,g)=>{S.t(82,s,d,{type:'sawtooth',to:50,g,sw:.2,vib:[20,10],lp:[900,300],rv:.3});S.t(164,s,d,{type:'sawtooth',to:90,g:g*.4,vib:[24,16]});[350,900,2200].forEach((f,i)=>S.nm(s,d,{type:'bandpass',f,to:f*.7,q:4,g:g*(.7-i*.2),depth:.5,step:.03,shape:'sw',rv:.2}));S.n(s,d,{type:'highpass',f:2500,g:g*.2,a:.02});}; // 咆哮
  S.laser=(s,d,g)=>{S.t(300,s,d,{to:3200,type:'sawtooth',g:g*.5,lp:[600,6000],sw:.96,rv:.2});S.t(150,s,d,{to:1600,g:g*.4,sw:.96});};
  // ---- ここから「演出ごとの音」の本体 ----
  recipe(S);
}
function fxSoundPlay(id,kind){const r=typeof FX_SOUND!=='undefined'&&FX_SOUND[kind+':'+id];if(!r)return false;_gfxAudio(ctx=>_fxRun(ctx,ctx.destination,r,ctx.currentTime+.03,typeof FX_GAIN!=='undefined'?FX_GAIN[kind+':'+id]:1));return true;}

// ───────── ② 演出ごとの音（それぞれ、題材そのものの音で作ってあります） ─────────
// S：音の部品 ／ sy：測定データ（sy.on＝絵が盛り上がる瞬間） ／ on(f,最小秒)：盛り上がる瞬間ごとに f(秒,強さ) を呼ぶ
// 共通の絵のタイミング：0〜0.28秒＝帯が開く／0.12〜0.30秒＝文字が迫る／0.30秒＝文字が叩きつけられ、閃光
const _fxSpec={
 // ===== リーチ =====
 // 炎：着火のボッ→燃えさかる音→パチパチ
 'riichi:flame':(S,sy,on)=>{S.nm(.2,.12,{f:300,to:2500,g:.3,shape:'rise'});S.nm(.3,.5,{type:'lowpass',f:300,to:2800,g:.4,depth:.3,shape:'dec'});S.t(60,.3,.5,{to:35,g:.3,a:.01});
   S.nm(.3,1.7,{type:'bandpass',f:600,q:.6,fm:.5,depth:.6,g:.24,shape:'sw'});S.nm(.3,1.7,{f:150,g:.2,depth:.5,shape:'sw'});S.pops(.35,1.6,26,.35,{f:[2500,7000]});
   on((t,s)=>{S.nm(t,.3,{type:'bandpass',f:400,to:2000,g:.2*s,shape:'sw'});S.pops(t,.3,18,.3*s);});},
 // 桜：花びらを運ぶ風と、琴の音
 'riichi:sakura':(S,sy,on)=>{S.nm(0,1.9,{type:'bandpass',f:2600,q:.8,fm:.3,depth:.4,g:.025,shape:'sw'});[587,659,784,880,1047].forEach((f,i)=>S.koto(f,.08+i*.06,.1));
   S.koto(1175,.3,.16);S.koto(784,.36,.12);[1319,1175,1047,880,784,659,587].forEach((f,i)=>S.koto(f,.55+i*.05,.07)); // 琴のかき流し
   for(let i=0;i<8;i++)S.t(3800+S.R(i)*2500,.5+S.R(i+3)*1.3,.18,{g:.03,p:S.R(i)*1.6-.8,rv:.6});on((t,s)=>S.koto([784,880,1047,1175][Math.floor(S.R(t*9)*4)],t,.12*s));},
 // 氷：ピキピキと凍りついて、最後に大きく割れる
 'riichi:ice':(S,sy,on)=>{for(let i=0;i<9;i++)S.iceCrack(.02+i*.03,.1+i*.02);S.iceCrack(.3,.5);S.bell(3136,.3,1.4,.06);S.t(4200,.3,1.2,{g:.03,det:12,rv:.6});S.nm(.3,1.5,{type:'highpass',f:6500,g:.05,depth:.4,shape:'sw'});
   on((t,s)=>{S.iceCrack(t,.28*s);S.t(2600+S.R(t)*1500,t+.02,.8,{g:.05,rv:.6});});},
 // 雷：パチパチと帯電→稲光のバリッ→ゴロゴロ
 'riichi:thunder':(S,sy,on)=>{S.pops(0,.3,45,.25,{f:[4000,9000],rv:.1});S.t(2400,.2,.1,{to:3400,type:'sawtooth',g:.07});S.thunder(.3,.7,2.2);on((t,s)=>{S.n(t,.04,{type:'highpass',f:2500,g:.35*s,a:.0005});S.nm(t,.5,{f:200,to:70,g:.2*s,depth:.7,shape:'sw',rv:.4});});},
 // 威圧：ゴゴゴゴ…という重い地鳴りと、低い唸り声
 'riichi:aura':(S,sy,on)=>{S.nm(0,2,{f:90,g:.34,depth:.8,step:.08,shape:'sw'});S.t(41,0,2.05,{type:'sawtooth',g:.18,lp:[100,160],sw:.4});S.t(43.4,0,2.05,{type:'sawtooth',g:.14,lp:[100,160],sw:.4});
   S.nm(.2,1.8,{type:'bandpass',f:420,to:300,q:5,g:.12,fm:.3,depth:.6,shape:'sw',rv:.5});S.heart(.3,.45);S.heart(.9,.4);S.heart(1.5,.35);on((t,s)=>S.heart(t,.4*s));},
 // 糸：ぴんと張る、きしむ糸と弾く音
 'riichi:thread':(S,sy,on)=>{S.t(900,0,.3,{to:1700,type:'triangle',g:.07,vib:[9,18],sw:.9,lp:[2000,5000]});S.n(0,.3,{type:'bandpass',f:4500,q:5,g:.06,sw:.9});
   [0,1,2,3,4].forEach(i=>S.t(260+i*15,.3+i*.05,.9,{type:'triangle',to:250+i*15,g:.12,a:.002,rv:.4}));S.t(520,.3,.5,{type:'triangle',g:.05});for(let i=0;i<6;i++)S.t(1400+i*320,.4+i*.12,.5,{type:'triangle',g:.05,a:.001,p:S.R(i)*1.6-.8,rv:.4});
   on((t,s)=>{S.t(330*(1+S.R(t)),t,.7,{type:'triangle',to:310,g:.1*s,a:.002,rv:.4});S.swish(t-.06,.08*s,S.R(t)*1.6-.8);});},
 // シャボン玉：ぷくぷく、ぱちん
 'riichi:bubble':(S,sy,on)=>{S.nm(0,2,{f:400,g:.07,depth:.6,fm:.4,shape:'sw',rv:.4});for(let i=0;i<12;i++){const f=350+S.R(i)*650,t=.05+i*.14;S.t(f,t,.13,{to:f*2.2,g:.12,a:.005,p:S.R(i+4)*1.6-.8,rv:.4});}
   S.t(300,.3,.3,{to:900,g:.2,a:.01,rv:.4});S.n(.58,.03,{type:'bandpass',f:3500,q:2,g:.3,a:.0005});S.t(1800,.58,.12,{to:600,g:.12});on((t,s)=>{S.n(t,.025,{type:'bandpass',f:3000+S.R(t)*2000,q:2,g:.2*s,a:.0005,p:S.R(t+1)*1.6-.8});S.t(900,t,.1,{to:300,g:.07*s});});},
 // 過程消去：消しゴムでこする→スッと全部が消える
 'riichi:erase':(S,sy,on)=>{S.scrub(0,.3,.3);S.n(.28,.02,{type:'bandpass',f:900,q:2,g:.3,a:.0005});S.rev(.3,.45,.12);S.n(.75,.012,{type:'highpass',f:4000,g:.2,a:.0003});S.t(80,.75,.12,{to:60,g:.12});S.n(1.5,.25,{type:'bandpass',f:6000,q:8,g:.04,sw:.4});on((t,s)=>S.scrub(t,.2,.12*s));},
 // ディスク：回転する円盤が飛び交う
 'riichi:disc':(S,sy,on)=>{[-1,1,-1].forEach((p,i)=>{S.t(900,.05+i*.28,.5,{to:1700,type:'sawtooth',g:.1,am:[55,.5],lp:[1500,3000],p,p1:-p,sw:.5,rv:.2});});
   S.n(.3,.03,{type:'highpass',f:3500,g:.35,a:.0005});S.ricochet(.32,.5,.5);S.t(2600,.3,.4,{type:'triangle',g:.08,vib:[20,40],rv:.4});on((t,s)=>{S.t(1100,t-.15,.4,{to:1900,type:'sawtooth',g:.07*s,am:[50,.5],lp:[1500,3000],p:S.R(t)*2-1,p1:-(S.R(t)*2-1),sw:.5});S.ricochet(t,.3*s,S.R(t+2)*1.6-.8);});},
 // 重力反転：ずん…と沈んでから、ふわっと浮き上がる
 'riichi:gravflip':(S,sy,on)=>{S.t(220,0,.3,{to:50,g:.3,a:.02});S.t(50,.3,.9,{to:700,g:.28,a:.05,sw:.8});S.nm(.3,.9,{type:'bandpass',f:300,to:2500,q:1,g:.18,depth:.4,shape:'rise'});
   for(let i=0;i<10;i++)S.t(900+i*150,.4+i*.1,.1,{type:'triangle',g:.05,p:S.R(i)*1.6-.8,rv:.4});S.fm(130,3,60,.35,.8,{g:.1,sw:.5,rv:.3});S.n(.3,.1,{type:'highpass',f:2000,g:.25});on((t,s)=>{S.t(400,t,.5,{to:900,g:.1*s,sw:.7,rv:.4});});},
 // 削り取る：ざくっと空間をすくい取り、ぽんと消える
 'riichi:scoop':(S,sy,on)=>{S.nm(.05,.25,{type:'bandpass',f:900,to:300,q:1.5,g:.3,depth:.6,shape:'sw'});S.n(.28,.025,{type:'highpass',f:3000,g:.3,a:.0005});S.t(400,.3,.18,{to:110,g:.3,a:.005,rv:.2});S.nm(.4,.5,{type:'lowpass',f:500,to:100,g:.2,depth:.7,step:.03,shape:'dec'});
   S.n(.7,.02,{type:'bandpass',f:1800,q:4,g:.3,a:.0005});S.t(900,.7,.12,{to:2200,g:.1});S.pops(.4,.5,22,.12,{type:'lowpass',f:[300,1200],q:1});on((t,s)=>S.nm(t,.18,{type:'bandpass',f:800,to:250,q:1.5,g:.2*s,shape:'sw'}));},
 // ジッパー：ジーッと開く
 'riichi:zipper':(S,sy,on)=>{S.zip(.02,.28,.3);S.n(.3,.025,{type:'highpass',f:3000,g:.3,a:.0005});S.zip(.32,.5,.22);S.swish(.5,.15,0,.2);S.t(110,.34,.4,{to:70,g:.15});S.zip(.9,.3,.14);on((t,s)=>S.zip(t-.1,.18,.16*s));},
 // 絶対零度：氷が張って、冷たい風が吹く／弾かれる音
 'riichi:frostsuit':(S,sy,on)=>{for(let i=0;i<4;i++)S.iceCrack(.04+i*.07,.07+i*.03);S.iceCrack(.3,.35);S.nm(0,2,{type:'bandpass',f:450,to:260,q:2.5,fm:.4,depth:.5,g:.3,shape:'sw',rv:.4});S.nm(.3,1.7,{type:'lowpass',f:220,g:.2,depth:.6,shape:'sw'});S.t(70,.3,1.2,{g:.14,sw:.4});
   [.55,.85,1.15,1.5].forEach((t,i)=>S.ricochet(t,.25,i%2?.6:-.6));on((t,s)=>S.iceCrack(t,.2*s));},
 // 翠：鳥のさえずりと、木の葉のそよぎ
 'riichi:forest':(S,sy,on)=>{S.nm(0,2,{type:'highpass',f:3200,g:.08,fm:.4,depth:.7,step:.05,shape:'sw',rv:.3});for(let i=0;i<7;i++)S.bird(.12+i*.24,.18,i);S.t(262,.3,.5,{type:'triangle',g:.05,vib:[4,3],sw:.3,rv:.5});
   S.t(392,.35,.5,{type:'triangle',g:.04,vib:[4,3],sw:.3,rv:.5});S.t(65,.3,.4,{to:50,g:.18,a:.01});on((t,s)=>S.bird(t,.2*s,Math.floor(S.R(t)*9)));},
 // 蹴り弾：ボールを蹴るドスッ→飛んでいく風切り音→ピュイン
 'riichi:kickshot':(S,sy,on)=>{S.swish(.14,.15,-.3,.05);S.punch(.3,.7,0);S.t(75,.3,.3,{to:45,g:.3});S.whistle(.35,.5,.07,1500,700,-.7,.7);S.ricochet(.95,.35,.5);on((t,s)=>{S.punch(t,.4*s,S.R(t)*1.4-.7);S.swish(t-.08,.12*s,S.R(t)*1.4-.7);});},
 // 潜り込み：ざぶん→水中のこもった音
 'riichi:dive':(S,sy,on)=>{S.n(.28,.3,{type:'bandpass',f:1800,to:300,q:.7,g:.35,a:.003,rv:.3});S.pops(.3,.4,40,.22,{f:[700,2500],q:3});S.t(500,.32,.5,{to:80,g:.25,a:.02});
   S.nm(.5,1.5,{type:'lowpass',f:380,fm:.8,depth:.6,step:.06,g:.25,shape:'sw',rv:.5});for(let i=0;i<5;i++)S.t(300+S.R(i)*300,.7+i*.22,.2,{to:700+S.R(i+2)*300,g:.08,a:.01,rv:.5});on((t,s)=>{S.t(260,t,.2,{to:760,g:.1*s,a:.01,rv:.4});S.nm(t,.4,{type:'lowpass',f:500,to:200,g:.15*s,shape:'sw'});});},
 // ===== ロン =====
 // 紅蓮：燃えさかる大きな炎＋低い金管＋煮えたぎるマグマ
 'ron:crimson':(S,sy,on)=>{S.nm(.2,.14,{f:300,to:3000,g:.3,shape:'rise'});S.nm(.3,2,{type:'bandpass',f:380,q:.5,fm:.5,depth:.5,g:.3,shape:'sw'});S.nm(.3,2,{f:90,g:.45,depth:.4,shape:'sw'});S.pops(.35,1.8,14,.3,{f:[500,2500],q:2});
   [55,65.4,82.4].forEach((f,i)=>S.t(f,.3,1.6,{type:'sawtooth',g:.1,lp:[200,500],sw:.3,det:i*5,rv:.4}));for(let i=0;i<6;i++)S.t(70+S.R(i)*60,.5+i*.25,.2,{to:200,g:.08,a:.01,rv:.3});on((t,s)=>{S.nm(t,.35,{type:'bandpass',f:300,to:1800,g:.22*s,shape:'sw'});S.pops(t,.4,22,.35*s);});},
 // 闇：低い唸り＋ささやき声＋すべてを吸い込む
 'ron:void':(S,sy,on)=>{S.t(36,0,2.3,{type:'sawtooth',g:.2,lp:[90,70],sw:.5});S.t(36.8,0,2.3,{type:'sawtooth',g:.14,lp:[90,70],sw:.5});S.whisper(.1,.2,.16);S.whisper(.5,1.4,.1);S.nm(.3,1.2,{type:'lowpass',f:3000,to:150,g:.25,depth:.3,shape:'dec',rv:.4});S.t(40,.3,.4,{to:28,g:.35,a:.005});
   S.rev(0,.28,.2);on((t,s)=>{S.whisper(t,.5,.12*s);S.t(45,t,.5,{to:30,g:.25*s,a:.01});});},
 // 黄金：銅鑼がドーンと鳴って、金貨がじゃらじゃら
 'ron:gold':(S,sy,on)=>{S.gong(.3,.34,98);S.n(.3,.05,{type:'bandpass',f:1500,q:2,g:.4,a:.0005});S.coin(.34,.16);S.coin(.52,.12);S.coin(.7,.1);S.bell(1568,.36,1.8,.1);S.brass(392,.3,.35,.1);S.brass(587,.3,.35,.08);S.nm(.4,1.8,{type:'highpass',f:6500,g:.04,depth:.7,shape:'sw'});on((t,s)=>S.coin(t,.14*s));},
 // 大波：せり上がる海→ざばーんと砕ける
 'ron:ocean':(S,sy,on)=>{S.wave(.3,.7,1.1);S.nm(1.0,1.2,{type:'highpass',f:3000,to:1500,g:.15,depth:.6,shape:'sw',rv:.4});S.nm(1.1,1,{f:300,to:100,g:.25,depth:.5,shape:'sw'});on((t,s)=>S.wave(t,.4*s,.6));},
 // ラッシュ：どどどどど…と加速する連打、最後に渾身の一撃
 'ron:rush':(S,sy,on)=>{let t=.3,gap=.115;for(let i=0;i<14;i++){S.punch(t,.4+i*.02,i%2?.6:-.6);S.swish(t-.05,.1,i%2?.5:-.5);t+=gap;gap=Math.max(.06,gap*.93);}S.swish(1.45,.25,0,.15);S.punch(1.6,.95,0);S.impact(1.6,.5,1.3);S.n(1.6,.3,{type:'bandpass',f:2000,q:1,g:.3});},
 // 爪弾：鋭い爪が飛んで、壁に刺さる
 'ron:claw':(S,sy,on)=>{S.n(.1,.1,{type:'bandpass',f:5000,q:6,g:.2});S.t(2900,.1,.3,{to:3800,type:'triangle',g:.06,rv:.4});[.3,.4,.5,.62,.74,.88,1.0,1.18].forEach((t,i)=>{const p=-.8+i*.23;S.nm(t-.12,.12,{type:'bandpass',f:900,to:500,q:1,g:.12,shape:'sw',p:-p,p1:p});S.t(180,t,.1,{to:90,g:.35,a:.001,p});S.n(t,.04,{type:'bandpass',f:600,q:2,g:.3,a:.0005,p});S.t(380+S.R(i)*200,t,.35,{type:'triangle',g:.05,p,rv:.3});});on((t,s)=>{S.t(150,t,.12,{to:70,g:.3*s,a:.001});S.n(t,.05,{type:'bandpass',f:700,q:2,g:.25*s,a:.0005});});},
 // 豪雨：ざあざあ降る雨＋大粒の雨がたたく音＋雷
 'ron:heavyrain':(S,sy,on)=>{S.rain(0,2.3,.3,true);S.t(45,.3,1.4,{g:.14,sw:.3});S.thunder(.3,.6,2);on((t,s)=>{S.pops(t,.35,36,.3*s,{type:'lowpass',f:[300,1000],q:1});S.n(t,.04,{type:'highpass',f:2500,g:.2*s,a:.0005});});},
 // 赤光線：チャージの高まり→光線がジューッ
 'ron:redray':(S,sy,on)=>{S.laser(0,.3,.3);S.n(.3,.025,{type:'highpass',f:4000,g:.35,a:.0003});S.fm(1200,90,500,.3,1.6,{g:.12,sw:.15,rv:.2});S.fm(300,7,150,.3,1.6,{g:.1,sw:.2});S.steam(.35,1.5,.13);S.pops(.4,1.4,30,.12,{f:[3000,8000]});
   on((t,s)=>{S.fm(900+S.R(t)*600,110,400,t,.35,{g:.12*s,sw:.3});S.steam(t,.4,.1*s);});},
 // 光刃：刃が伸びる、澄んだ金属音と光のきらめき
 'ron:lightblade':(S,sy,on)=>{S.shing(.24,.55,0);S.t(120,.3,1.9,{g:.16,am:[7,.35],sw:.3,rv:.3});S.t(480,.3,1.9,{type:'triangle',g:.06,am:[7,.35],sw:.3,vib:[.4,6]});S.t(1900,.3,1.4,{g:.04,det:8,sw:.3,rv:.5});for(let i=0;i<8;i++)S.t(3800+S.R(i)*3000,.4+i*.2,.2,{g:.04,rv:.6,p:S.R(i)*1.6-.8});
   on((t,s)=>{S.shing(t-.06,.28*s,S.R(t)*1.6-.8);S.glass(t,.14*s);});},
 // 戦車爆弾：エンジンの低音＋キャタピラの金属音→爆発
 'ron:tankbomb':(S,sy,on)=>{const hz=15;S.t(48,0,2.2,{type:'sawtooth',g:.16,lp:[220,220],am:[hz,.55],sw:.5});S.nm(0,2.2,{f:200,g:.2,depth:.4,step:.04,shape:'sw'});S.pops(0,1.8,36,.26,{f:[400,1500],q:6,rv:.1});S.t(32,0,2.2,{type:'sawtooth',g:.14,lp:[110,110],am:[hz,.6],sw:.5}); // キャタピラ
   [.45,.8,1.1,1.35].forEach((t,i)=>S.t(1800,t,.06,{type:'sine',g:.08,rv:.4}));const big=sy.on.reduce((a,b)=>b[1]>a[1]?b:a,[1.6,1])[0];S.whistle(big-.35,.35,.1,2400,500,-.2,.2);S.explosion(big,.7,1.4);S.n(big,.3,{f:4500,to:300,g:.3});S.t(30,big,1,{g:.3,a:.01});on((t,s)=>{if(Math.abs(t-big)>.25){S.t(1100,t,.2,{to:400,type:'square',g:.05*s,lp:[2000,800]});S.n(t,.05,{type:'bandpass',f:700,q:4,g:.2*s,a:.001});}});},
 // 殺人ウイルス：ぬちゃっとした音・ガイガー音・不穏な警報
 'ron:virus':(S,sy,on)=>{for(let i=0;i<8;i++)S.squelch(.05+i*.11,.14);S.pops(0,2.2,28,.14,{f:[3000,6000],q:4,decay:false});S.t(466,.3,2,{type:'sawtooth',g:.05,lp:[900,900],sw:.5,det:-8,rv:.4});S.t(659,.3,2,{type:'sawtooth',g:.05,lp:[900,900],sw:.5,det:8,rv:.4}); // 不協和（トライトーン）
   for(let i=0;i<3;i++)S.t(i%2?640:420,.5+i*.5,.45,{to:i%2?420:640,type:'square',g:.05,lp:[900,900],rv:.3});S.squelch(.3,.3);S.heart(.3,.2);on((t,s)=>{S.squelch(t,.2*s);S.pops(t,.3,40,.1*s,{f:[3000,6000],q:4});});},
 // 磁力の刃：電磁石のうなりと、砂鉄が飛ぶ音、ちょきん
 'ron:magnet':(S,sy,on)=>{S.t(100,0,2.2,{type:'sawtooth',g:.1,lp:[400,500],am:[100,.45],sw:.5});S.t(50,0,2.2,{type:'sawtooth',g:.08,sw:.5});S.pops(.2,1.6,70,.16,{f:[5000,9000],q:5,rv:.1});[.3,.55,.8,1.05].forEach((t,i)=>S.snip(t,.3,i%2?.5:-.5));S.gong(.32,.12,520);
   on((t,s)=>{S.snip(t,.28*s,S.R(t)*1.6-.8);S.pops(t,.3,50,.16*s,{f:[5000,9000],q:5});});},
 // 翡翠：石の澄んだ響きと、水の滴り
 'ron:jade':(S,sy,on)=>{S.stoneChime(784,.3,.25);S.stoneChime(1175,.4,.14);S.stoneChime(587,.5,.14);S.t(440,.32,2,{g:.1,am:[.8,.4],rv:.6});S.t(1320,.32,2,{g:.03,det:5,rv:.6});for(let i=0;i<6;i++)S.drop(1500+S.R(i)*1500,.5+i*.25,.06);S.pad(220,.3,1.8,.05);on((t,s)=>S.stoneChime(587*(1+S.R(t)*.7),t,.12*s));},
 // 目にも留まらぬ剣技：鎧が落ちるガシャン→連続する風切り→細い剣の鳴り
 'ron:rapier':(S,sy,on)=>{S.pops(0,.28,60,.3,{f:[300,1800],q:5});S.t(160,.05,.25,{to:80,type:'square',g:.12,lp:[800,300]});S.n(.3,.1,{type:'bandpass',f:1200,q:3,g:.3,a:.0005});for(let i=0;i<9;i++){S.swish(.34+i*.07,.2,i%2?.7:-.7);S.n(.34+i*.07+.04,.012,{type:'highpass',f:5000,g:.15,a:.0003,p:i%2?.7:-.7});}S.shing(1.0,.3,0);S.t(3136,1.0,1.3,{g:.05,rv:.6});S.nm(.4,.8,{type:'bandpass',f:700,g:.06,depth:.7,shape:'sw'});on((t,s)=>{S.swish(t-.05,.2*s,S.R(t)*1.6-.8);S.t(3600,t,.2,{g:.04*s,rv:.5});});},
 // 機銃掃射：プロペラ機が通りすぎ、機銃の連射と爆撃
 'ron:strafe':(S,sy,on)=>{S.plane(0,2.3,.2);const bursts=sy.on.filter(([t])=>t>.4);for(let i=0;i<28;i++)S.gun(.45+i*.045,.28,(i/28)*2-1);S.whistle(1.1,.45,.08,2200,600,.3,.6);S.explosion(1.6,.5,1.0);on((t,s)=>{for(let i=0;i<5;i++)S.gun(t+i*.04,.2*s,S.R(t+i)*1.6-.8);});},
 // ===== 上がり =====
 // 花火：笛を吹きながら打ち上がり→ドン→パチパチ
 'win:fireworks':(S,sy,on)=>{S.whistle(.0,.3,.12,500,1900,-.4,-.4);S.n(.3,.03,{type:'highpass',f:2500,g:.5,a:.0003});S.t(95,.3,.2,{to:50,g:.3,a:.003});S.nm(.3,.4,{type:'bandpass',f:2200,q:.7,g:.2,shape:'dec'});S.pops(.4,.9,40,.18,{f:[3500,9000],q:3,decay:true});
   on((t,s)=>{const p=S.R(t*3)*1.6-.8;S.whistle(t-.28,.26,.1,600+S.R(t)*500,1900,p,p);S.n(t,.03,{type:'highpass',f:2500,g:.4*s,a:.0003,p});S.t(95,t,.18,{to:50,g:.22*s,a:.003});S.nm(t,.35,{type:'bandpass',f:2200,q:.7,g:.15*s,shape:'dec',p});S.pops(t+.03,.7,46,.16*s,{f:[3500,9000],q:3,decay:true});});S.nm(.5,1.8,{type:'highpass',f:5500,g:.03,depth:.7,shape:'sw'});},
 // 紙吹雪：パーン！とクラッカー→紙がひらひら
 'win:confetti':(S,sy,on)=>{S.n(.3,.03,{type:'highpass',f:2500,g:.7,a:.0003});S.n(.3,.15,{type:'bandpass',f:1500,q:.8,g:.4,a:.001,rv:.3});S.t(700,.3,.06,{to:200,g:.3,a:.001});S.paper(.33,1.4,.14);for(let i=0;i<10;i++)S.t(3400+S.R(i)*3000,.4+S.R(i+3)*1.6,.15,{g:.03,p:S.R(i)*1.6-.8,rv:.5});S.nm(.3,.6,{type:'bandpass',f:3000,to:1000,g:.1,shape:'dec'});
   on((t,s)=>{S.n(t,.025,{type:'highpass',f:2500,g:.35*s,a:.0003});S.paper(t,.5,.1*s);});},
 // 流れ星：すーっと流れる高い音と、きらきら
 'win:star':(S,sy,on)=>{S.t(5200,.08,1.1,{to:800,g:.1,sw:.12,rv:.4,vib:[18,60]});S.nm(.1,1,{type:'bandpass',f:6000,to:1200,q:2,g:.08,shape:'dec',rv:.4});for(let i=0;i<14;i++)S.t(2400+S.R(i)*4200,.25+i*.11,.3,{g:.05,a:.001,p:S.R(i)*1.6-.8,rv:.6});S.pad(330,.3,1.8,.08);S.bell(1760,.35,1.8,.08);on((t,s)=>S.bell(1568*(1+S.R(t)*.5),t,1,.07*s));},
 // 王冠：金管のファンファーレ＋ティンパニ＋シンバル
 'win:royal':(S,sy,on)=>{S.cymbal(.3,.26);S.timp(.3,.4,95);for(let i=0;i<6;i++)S.timp(.0+i*.05,.12+i*.03,95); // ティンパニのロール
   [[262,330,392],[294,370,440]].forEach((c,i)=>c.forEach(f=>S.brass(f,.3+i*.35,.4,.1)));[392,494,587,784].forEach(f=>S.brass(f,1.0,1.3,.1));S.pad(131,.3,2,.08);on((t,s)=>{S.brass(392*(1+(S.R(t)>.5?.5:0)),t,.35,.08*s);S.timp(t,.25*s,100);});},
 // 時間停止：カチ、コチ…と時計が止まり、静寂
 'win:timestop':(S,sy,on)=>{const ts=[0,.14,.3,.5,.78,1.12];ts.forEach((t,i)=>S.clockTick(t,.3-.02*i,i%2));S.clockTick(.3,.5,0);const stop=.9;S.t(70,stop,.5,{to:40,g:.4,a:.003});S.n(stop,.05,{type:'bandpass',f:900,q:2,g:.4,a:.0005});S.gong(stop+.02,.2,73);S.bell(2093,stop,2,.06);S.rev(.5,.4,.12);on((t,s)=>{if(t>1.3)S.t(1396,t,1.2,{g:.04*s,rv:.6});});},
 // 修復：割れたかけらがはまる音→ハープの上昇→やさしい和音
 'win:mend':(S,sy,on)=>{[.0,.1,.2,.32,.44].forEach((t,i)=>{S.n(t,.03,{type:'bandpass',f:2400+i*400,q:5,g:.18,a:.0005,p:i%2?.5:-.5});S.t(1600+i*300,t,.08,{type:'triangle',g:.06});});S.rev(.1,.2,.12);
   [392,494,587,740,880,1047,1175,1480].forEach((f,i)=>S.pluck(f,.3+i*.07,1,.12));S.pad(196,.3,2,.1);S.sparkle(.6,1.4,.05);on((t,s)=>S.pluck(880*(1+S.R(t)*.5),t,.8,.12*s));},
 // 芽吹き：土のざわめき→芽が伸びる「きゅっ」→花が開く
 'win:sprout':(S,sy,on)=>{S.nm(0,.5,{type:'lowpass',f:500,g:.1,depth:.7,step:.03,shape:'sw'});S.pops(0,.4,26,.1,{type:'lowpass',f:[300,800],q:1});for(let i=0;i<5;i++)S.t(350+i*60,.3+i*.17,.14,{to:800+i*100,g:.1,a:.01,p:S.R(i)*1.2-.6,rv:.3});
   S.nm(.3,1.5,{type:'bandpass',f:3200,q:.8,g:.06,depth:.7,step:.04,shape:'sw'});[523,659,784,1047].forEach((f,i)=>S.pluck(f,1.1+i*.1,.8,.1));S.bird(1.3,.1,2);S.pad(262,.8,1.4,.05);on((t,s)=>{S.t(500,t,.14,{to:900,g:.1*s,a:.01,rv:.3});S.drop(1500,t+.1,.06*s);});},
 // 止まった世界：時計が止まり、重い錠前がかかる
 'win:chronolock':(S,sy,on)=>{[0,.12,.26,.44,.7,1.05].forEach((t,i)=>S.clockTick(t,.22,i%2));S.clockTick(.3,.4,1);S.pops(.35,.4,40,.14,{f:[1200,3500],q:4});S.n(.78,.03,{type:'bandpass',f:700,q:4,g:.45,a:.0005});S.t(60,.78,.4,{to:38,g:.4,a:.003});S.n(.9,.03,{type:'bandpass',f:1100,q:5,g:.35,a:.0005});S.t(70,.9,.4,{to:40,g:.3});S.gong(.8,.12,260);S.pops(.95,.7,40,.14,{f:[1800,5500],q:6,decay:true});S.pops(.4,.35,30,.12,{f:[1500,4500],q:6});on((t,s)=>S.clockTick(t,.12*s,0));},
 // 巻き戻し：テープがきゅるきゅる巻き戻る→再生
 'win:rewind':(S,sy,on)=>{S.tapeRewind(0,.75,.4);S.n(.76,.02,{type:'bandpass',f:900,q:3,g:.4,a:.0005});S.t(100,.76,.15,{to:55,g:.3});S.rev(.5,.3,.1);S.n(.8,.4,{type:'highpass',f:6000,g:.04,sw:.3});[523,659,784,1047].forEach((f,i)=>S.koto(f,.9+i*.09,.1));S.t(1396,.9,1.4,{g:.04,rv:.6});on((t,s)=>{if(t>1)S.pluck(1047*(1+S.R(t)*.5),t,.7,.1*s);});},
 // 宇宙一巡：宇宙の低い唸りと星のきらめき→新しい世界の和音
 'win:cosmos':(S,sy,on)=>{S.t(34,0,2.3,{g:.3,sw:.4});S.nm(0,2.3,{type:'bandpass',f:300,to:4000,q:1,g:.14,fm:.2,depth:.4,shape:'sw',p:-.8,p1:.8,rv:.5});for(let i=0;i<22;i++)S.t(2000+S.R(i)*5000,.2+S.R(i+9)*2,.35,{g:.04,a:.002,p:S.R(i)*1.8-.9,rv:.6});
   S.t(80,.3,.8,{to:500,type:'sawtooth',g:.08,lp:[300,3000],sw:.9,rv:.4});[262,330,392,523].forEach(f=>S.t(f,1.2,1.2,{type:'triangle',g:.07,sw:.35,rv:.6}));S.t(40,1.2,1,{g:.3,a:.02});on((t,s)=>S.sparkle(t,.4,.06*s));},
 // 天候：風・雨・雷
 'win:weather':(S,sy,on)=>{S.wind(0,2.3,.2,true);S.rain(.3,2,.14,false);S.thunder(.9,.5,1.6);S.nm(.1,.25,{f:300,to:2500,g:.14,shape:'rise'});on((t,s)=>S.wind(t,.5,.14*s,false));},
 // 命令の本：分厚い本を開く→ページをめくる→ペンが走る→封印
 'win:book':(S,sy,on)=>{S.t(70,.0,.18,{to:45,g:.3,a:.002});S.n(.0,.1,{type:'lowpass',f:700,g:.3,a:.002});S.n(.05,.25,{type:'bandpass',f:900,to:500,q:1.2,g:.1,a:.01}); // 革表紙
   [.14,.24,.33,.41,.48].forEach((t,i)=>S.n(t,.12,{type:'bandpass',f:3500,to:1400,q:.8,g:.22,a:.005,p:-.3+i*.15,rv:.15}));S.scrub(.5,.3,.12);S.pops(.55,.25,40,.1,{f:[2500,6000],q:2});S.gong(.3,.12,131);S.pad(196,.3,1.8,.08);S.bell(1319,.32,1.4,.1);S.sparkle(.4,.8,.06);on((t,s)=>S.n(t,.12,{type:'bandpass',f:3500,to:1400,q:.8,g:.2*s,a:.005}));},
 // 癒しの料理：ジュージュー焼く音→皿がカチャン→やさしい鐘
 'win:cure':(S,sy,on)=>{S.nm(0,2,{type:'bandpass',f:2400,q:.6,g:.22,depth:.5,step:.02,shape:'sw'});S.pops(0,1.9,90,.22,{f:[1500,5000],q:1.5});S.steam(.3,1,.06);S.clink(.3,.3);S.clink(.36,.2);S.t(2800,.3,.8,{g:.04,rv:.5});S.bell(880,.34,1.5,.12);S.pad(262,.3,1.8,.09);[523,659,784].forEach((f,i)=>S.pluck(f,.6+i*.12,.9,.09));on((t,s)=>S.clink(t,.14*s));},
 // 恐竜化：咆哮と、どしんどしんという足音
 'win:dino':(S,sy,on)=>{S.roar(.25,.95,.5);S.n(.28,.05,{type:'highpass',f:2000,g:.3});[1.05,1.4,1.75,2.05].forEach((t,i)=>S.footstep(t,.5+i*.05));S.n(.9,.2,{type:'bandpass',f:2500,q:2,g:.1,a:.01});on((t,s)=>S.footstep(t,.4*s));},
 // 静止する雨：しずくが空中で止まる。ガラスのような透明な音
 'win:stillrain':(S,sy,on)=>{for(let i=0;i<14;i++){const f=1300+S.R(i)*2200;S.t(f,.05+i*.16,.5,{to:f*.92,g:.08,a:.002,p:S.R(i+2)*1.8-.9,rv:.7});}S.nm(0,2.3,{type:'highpass',f:7000,g:.025,depth:.5,shape:'sw'});S.t(110,.2,2,{g:.08,sw:.4,rv:.5});S.t(165,.2,2,{g:.05,sw:.4,rv:.5});S.t(2200,.3,1.8,{g:.025,det:12,rv:.7});on((t,s)=>S.shing(t,.1*s,S.R(t)*1.6-.8));},
 // 虹：ハープのグリッサンドと、やさしい光
 'win:rainbow':(S,sy,on)=>{[262,294,330,392,440,523,587,659,784].forEach((f,i)=>S.pluck(f,.05+i*.07,1.2,.13));[131,196,262].forEach((f,i)=>S.t(f,.2,2.1,{type:'triangle',g:.1,sw:.4,rv:.6,vib:[4.5,f*.01],det:(i-1)*5}));S.sparkle(.5,1.3,.035);[523,659,784,1047].forEach((f,i)=>S.pluck(f,.95+i*.12,1,.09));},
 // 標準の赤い斬撃（ロン）：刀が空を切る、ざくっ
 'ron:default':(S,sy,on)=>{S.swish(.22,.3,-.5);S.swish(.3,.34,.5);S.n(.3,.03,{type:'highpass',f:3500,g:.5,a:.0003});S.shing(.3,.5,0);S.t(95,.3,.3,{to:50,g:.4,a:.003});S.n(.3,.15,{type:'bandpass',f:1200,q:1,g:.3,a:.002});S.nm(.35,.5,{f:600,to:100,g:.1,shape:'dec'});},
 // 標準の金の花（上がり）：花が開く、あたたかい音
 'win:default':(S,sy,on)=>{[392,494,587,784,988,1175].forEach((f,i)=>S.koto(f,.1+i*.07,.1));S.pad(262,.28,1.8,.12);S.bell(1318,.3,1.6,.1);S.nm(.3,1.6,{type:'highpass',f:5500,g:.04,shape:'sw'});S.sparkle(.35,1,.06);S.t(98,.3,1.2,{g:.15,sw:.2});},
};
// 音の山を、絵の盛り上がる瞬間に合わせる仕組み
function _fxCompose(kind,id){
  const sp=_fxSpec[kind+':'+id];if(!sp)return null;
  const sy=(typeof FX_SYNC!=='undefined'&&FX_SYNC[kind+':'+id])||{D:2.4,on:[],env:null};
  return S=>{const D=sy.D||2.4;const on=(f,min)=>sy.on.forEach(([t,s])=>{if(t>(min==null?.45:min)&&t<D-.3)f(Math.max(0,t-.04),.35+.65*s);});sp(S,sy,on);};
}
const FX_GAIN={'riichi:aura':0.94,'riichi:bubble':2.94,'riichi:disc':4.47,'riichi:dive':2.38,'riichi:erase':6,'riichi:flame':2.04,'riichi:forest':2.46,'riichi:frostsuit':1.93,'riichi:gravflip':0.95,'riichi:ice':2.74,'riichi:kickshot':2.5,'riichi:sakura':1.67,'riichi:scoop':3.74,'riichi:thread':2.16,'riichi:thunder':1.21,'riichi:zipper':3.27,'ron:claw':2.12,'ron:crimson':1.63,'ron:default':2.43,'ron:gold':0.72,'ron:heavyrain':0.91,'ron:jade':1.16,'ron:lightblade':1.86,'ron:magnet':1.74,'ron:ocean':1.11,'ron:rapier':4.23,'ron:redray':1.36,'ron:rush':0.94,'ron:strafe':0.93,'ron:tankbomb':0.72,'ron:virus':1.66,'ron:void':0.89,'win:book':1.38,'win:chronolock':1.36,'win:confetti':4.37,'win:cosmos':0.67,'win:cure':1.14,'win:default':1.17,'win:dino':0.66,'win:fireworks':1.49,'win:mend':1.34,'win:molt3':0.81,'win:rainbow':1.06,'win:rewind':1.63,'win:royal':1.06,'win:sprout':2.38,'win:star':1.63,'win:stillrain':1.87,'win:timestop':1.05,'win:weather':1.52}; // 演出どうしの音量をそろえる補正（自動で求めた値。ここに無い演出は 1 倍）
(function(){for(const k of Object.keys(_fxSpec)){const [kind,id]=k.split(':');const r=_fxCompose(kind,id);if(r)FX_SOUND[k]=r;}})();

// ───────── ③ 三段の脱皮（絵の時刻に、ぴったり合わせた音。4.4秒） ─────────
//  絵の時刻：①0〜1.3秒＝文字が1文字ずつ貼り付く(0.08/0.25/0.42/0.59/0.76) ②1.3〜2.6秒＝ひび割れ(〜1.8)→殻が弾ける1.82→爆発1.95→熱2.26
//           ③2.6〜3.9秒＝光が落ちる(〜2.99)→岩を殴る2.99→めり込む・割れる・砂ぼこり
FX_SOUND['win:molt3']=S=>{
  S.n(.3,.03,{type:'highpass',f:3000,g:.3,a:.0003});S.t(80,.3,.25,{to:45,g:.35,a:.003}); // 文字「上がり！」が叩きつけられる
  // ①文字が卵に貼り付く：ペタッ（スタンプ）＋コンコンと卵が内側から叩かれる＋音が頭に響くこだま
  [.08,.25,.42,.59,.76].forEach((t,i)=>{S.n(t,.05,{type:'bandpass',f:1300,q:2,g:.22,a:.001,p:i%2?.4:-.4});S.t(95+i*6,t,.2,{to:48,g:.34,a:.002});
    S.bell(440*Math.pow(1.26,i),t,.8,.1);S.bell(440*Math.pow(1.26,i),t+.22,.7,.05);S.bell(440*Math.pow(1.26,i),t+.44,.7,.03);});
  S.t(220,0,1.4,{g:.06,sw:.6,vib:[5,3],rv:.4});for(let i=0;i<3;i++){S.n(.9+i*.12,.03,{type:'bandpass',f:1800,q:6,g:.14,a:.0005});S.t(300,.9+i*.12,.06,{type:'triangle',g:.05});} // コンコン
  // ②ひび割れ（1.3〜1.8）：パキッ…パキパキ…と数が増え、内側から光が漏れてくる
  [1.36,1.48,1.58,1.66,1.73,1.78].forEach((t,i)=>{S.iceCrack(t,.14+i*.03);});S.t(300,1.3,.55,{to:1100,type:'sawtooth',g:.06,sw:.95,rv:.3,lp:[500,4000]});
  // 殻が弾ける（1.82）→殻のかけらが地面に落ちてカツンと鳴る
  S.n(1.82,.02,{type:'highpass',f:4000,g:.5,a:.0005});S.glass(1.82,.4);S.n(1.82,.45,{type:'highpass',f:2500,to:6500,g:.3,rv:.4});
  for(let i=0;i<8;i++){const t=2.0+S.R(i)*.55;S.t(1100+S.R(i+3)*1600,t,.1,{type:'triangle',g:.1,a:.001,p:S.R(i+5)*1.6-.8,rv:.4});S.n(t,.03,{type:'bandpass',f:2500,q:3,g:.08,p:S.R(i+5)*1.6-.8});}
  [1.85,1.92,1.98,2.05].forEach((t,i)=>S.pluck(660-i*70,t,.6,.09)); // しっぽの文字
  // 爆発（1.95〜2.26）：ドグォーム！
  S.explosion(1.95,.65,1.2);S.nm(1.95,.6,{type:'bandpass',f:500,to:2500,g:.18,shape:'sw'});S.pops(2.0,.7,34,.3);S.impact(1.97,.3,1.2);
  // 熱（2.26〜）：ズグゥシ…ジュウウ
  S.nm(2.26,.9,{type:'highpass',f:4500,g:.1,depth:.4,shape:'sw'});S.pops(2.26,.9,45,.2,{f:[3000,8000]});S.rumble(2.2,.6,.12);
  // ③光が落ちてくる（2.6〜2.99）：近づく風切り音
  S.whistle(2.6,.39,.12,400,2600,0,0);S.nm(2.6,.4,{type:'bandpass',f:500,to:5500,q:2,g:.2,shape:'rise'});
  // 岩を殴る（2.99）：ドォン！＋岩が割れる音
  S.impact(2.99,.8,1.5);S.explosion(2.99,.42,1.3);S.n(2.99,.02,{type:'highpass',f:2500,g:.6,a:.0005});
  // めり込む：ゴリゴリと岩が地面に沈む／地面の割れ目が走る／砂ぼこり・破片
  S.nm(3.0,.7,{f:300,to:70,g:.28,depth:.7,step:.04,shape:'sw',rv:.3});S.t(70,3.0,.8,{to:40,type:'sawtooth',g:.12,lp:[160,80],sw:.2});
  for(let i=0;i<9;i++)S.n(3.03+i*.055,.05,{type:'bandpass',f:260+S.R(i)*500,q:3,g:.22*(1-i*.06),p:S.R(i+6)*1.4-.7});
  S.nm(3.1,.9,{type:'highpass',f:3000,g:.06,shape:'dec'});S.pops(3.2,.7,26,.12,{type:'lowpass',f:[400,1400],q:1});for(let i=0;i<10;i++)S.t(900+S.R(i)*900,3.25+S.R(i+8)*.55,.06,{type:'triangle',g:.06,a:.001,p:S.R(i)*1.6-.8,rv:.3});
  S.t(55,3.0,1.4,{type:'sawtooth',to:40,g:.14,lp:[140,70],sw:.1,rv:.5});S.rumble(3.0,1.35,.3);
};

// ───────── ④ 開発者とマッチしたときの音（GIFにぴったり合わせる・約3.7秒） ─────────
//  GIFを測ったデータ（16-fx-sync.js）から：0.25秒＝最初のカット／1.3秒＝暗転／1.95秒＝まぶしく光る／3.05〜3.1秒＝カット／3.6秒＝暗転して終わる
function devMatchSound(){
  _gfxAudio(ctx=>_fxRun(ctx,ctx.destination,S=>{
    const bright=typeof DEV_GIF_SYNC!=='undefined'?DEV_GIF_SYNC.bright:null;
    S.t(46,0,3.7,{g:.18,sw:.5,rv:.3});S.t(69,0,3.7,{type:'sawtooth',g:.04,to:58,sw:.5,lp:[150,150]});
    if(bright)S.bed('noise',0,3.6,bright,{type:'bandpass',f:260,q:1.2,g:.2,rv:.4}); // 絵の明るさに合わせて、気配が膨らむ
    S.whisper(.4,.9,.06);S.whisper(1.6,.3,.05);
    S.impact(.25,.45,1.1);S.n(.2,.08,{type:'highpass',f:3000,g:.3});                                    // 最初のカット
    S.n(.9,.4,{type:'lowpass',f:6000,to:200,g:.25,a:.01});S.t(880,1.0,.3,{to:110,g:.1,rv:.5});               // 暗転へ吸い込まれる
    S.impact(1.3,.35,1.6);                                                                               // 暗転の一撃…そのあと静寂
    S.rev(1.5,.45,.28);S.t(1760,1.6,.4,{to:2400,g:.05,sw:.9,rv:.5});                                    // 光へ向かう逆再生のうなり
    S.explosion(1.95,.55,1.5);S.bell(1397,1.95,1.6,.12);S.pad(110,1.95,1.6,.18);S.n(1.95,.02,{type:'highpass',f:3500,g:.5,a:.0005}); // まぶしく光る
    S.impact(3.05,.45,1.3);S.impact(3.1,.3,1.8);S.n(3.2,.3,{type:'highpass',f:2500,g:.14,sw:.2});            // 続くカット
    S.n(3.55,.12,{type:'highpass',f:4000,g:.22,a:.001});S.t(120,3.6,.3,{to:45,g:.3,a:.002});                // 暗転して終わる
    [.6,1,1.5,2.4,2.8].forEach(t=>S.heart(t,.14)); // 遠くの鼓動
  },ctx.currentTime+.03,.65));
}
