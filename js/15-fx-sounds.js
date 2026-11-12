// =====================================================================
//  演出ごとのサウンド（すべて、その場で作る合成音です。音声ファイルは要りません）
//  ・リーチ・ロン・上がりの演出（FX_STYLES）それぞれに、専用の音があります
//  ・効果音がOFFのとき、または音量0のときは鳴りません（既存の設定に従います）
//  ・新しい演出に音を付けるには、addFx({... sound:S=>{ ... }}) と書きます（13-new-items.js）
//  ・音のつくり方は、下の「① 音の部品」を使います（S.t＝音程のある音、S.n＝ノイズ）
// =====================================================================

// ───────── ① 音の部品（触らなくてOK） ─────────
function _fxRun(ctx,dest,recipe,t0,gain){
  const master=ctx.createGain();master.gain.value=(typeof soundVolume==='number'?soundVolume:.5)*.9*(gain||1);
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.knee.value=12;comp.ratio.value=6;comp.attack.value=.003;comp.release.value=.2;
  master.connect(comp);comp.connect(dest);
  if(!ctx.__fxNb){const n=ctx.sampleRate*2,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;ctx.__fxNb=b;}
  const MIN=.0001,R=i=>{const x=Math.sin(i*12.9898+7.13)*43758.5453;return x-Math.floor(x);}; // 毎回おなじ「ばらつき」
  const out=(node,o)=>{if(o&&o.p&&ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.value=Math.max(-1,Math.min(1,o.p));node.connect(p);p.connect(master);}else node.connect(master);};
  const env=(g,s,d,pk,a,sw)=>{const p=g.gain,t=t0+s;p.setValueAtTime(MIN,t);
    if(sw!=null){p.linearRampToValueAtTime(pk,t+Math.max(.005,d*sw));p.exponentialRampToValueAtTime(MIN,t+d);}
    else{p.linearRampToValueAtTime(pk,t+Math.min(a==null?.01:a,d*.9));p.exponentialRampToValueAtTime(MIN,t+d);}};
  const S={R,
    // 音程のある音：周波数f、開始s秒、長さd秒。o={type,g(音量),to(最後の周波数),a(立ち上がり),sw(山の位置0〜1),det,p(左右-1〜1)}
    t(f,s,d,o){o=o||{};const osc=ctx.createOscillator(),g=ctx.createGain();osc.type=o.type||'sine';osc.frequency.setValueAtTime(Math.max(1,f),t0+s);
      if(o.to)osc.frequency.exponentialRampToValueAtTime(Math.max(1,o.to),t0+s+d);if(o.det)osc.detune.value=o.det;
      env(g,s,d,o.g==null?.2:o.g,o.a,o.sw);osc.connect(g);out(g,o);osc.start(t0+s);osc.stop(t0+s+d+.05);},
    // ノイズ（風・爆発・斬撃など）：o={type(lowpass/highpass/bandpass),f(中心),to(最後のf),q,g,a,sw,p}
    n(s,d,o){o=o||{};const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=ctx.__fxNb;src.loop=true;
      f.type=o.type||'lowpass';f.frequency.setValueAtTime(Math.max(20,o.f||1000),t0+s);if(o.to)f.frequency.exponentialRampToValueAtTime(Math.max(20,o.to),t0+s+d);f.Q.value=o.q||.7;
      env(g,s,d,o.g==null?.2:o.g,o.a,o.sw);src.connect(f);f.connect(g);out(g,o);src.start(t0+s,R(s*100+d)*1.5);src.stop(t0+s+d+.05);},
    // FM音（電子的なうなり）
    fm(fc,fmf,idx,s,d,o){o=o||{};const c=ctx.createOscillator(),m=ctx.createOscillator(),mg=ctx.createGain(),g=ctx.createGain();c.frequency.value=fc;m.frequency.value=fmf;mg.gain.value=idx;
      m.connect(mg);mg.connect(c.frequency);env(g,s,d,o.g==null?.15:o.g,o.a,o.sw);c.connect(g);out(g,o);c.start(t0+s);m.start(t0+s);c.stop(t0+s+d+.05);m.stop(t0+s+d+.05);}};
  // ---- 組み合わせの部品 ----
  S.hit=(s,g,f)=>{g=g==null?.4:g;f=f||140;S.t(f,s,.2,{to:40,g,a:.002});S.n(s,.07,{f:3000,to:300,g:g*.7,a:.001});};                 // ドンッ
  S.boom=(s,g,d)=>{g=g==null?.45:g;d=d||1;S.t(90,s,d,{to:28,g,a:.004});S.n(s,d*.9,{f:900,to:60,g:g*.9,a:.004});};                    // ドォォン（爆発）
  S.bell=(f,s,d,g)=>{d=d||1.2;g=g==null?.15:g;[1,2.76,5.4,8.9].forEach((m,i)=>S.t(f*m,s,d/(1+i*.6),{g:g/(1+i*.8),a:.002}));};          // 鐘
  S.sparkle=(s,d,g)=>{for(let i=0;i<10;i++)S.t(2500+R(i)*3200,s+i*d/10+R(i+30)*.04,.14,{g:g==null?.08:g});};                            // キラキラ
  S.whoosh=(s,d,g,f0,f1)=>S.n(s,d,{type:'bandpass',f:f0||400,to:f1||3000,q:1.2,g:g==null?.25:g,sw:.6});                              // ヒュオッ
  S.rumble=(s,d,g)=>{g=g==null?.25:g;S.n(s,d,{f:140,to:60,g,sw:.3});S.t(48,s,d,{g:g*.7,sw:.3});};                                      // ゴゴゴ
  S.tick=(s,g,f)=>S.t(f||1800,s,.035,{type:'square',g:g==null?.12:g,a:.001});                                                          // カチッ
  S.arp=(notes,s,step,d,o)=>notes.forEach((f,i)=>S.t(f,s+i*step,d,o));                                                                  // 音階
  recipe(S);
}
// 演出どうしの音量をそろえるための補正（新しい演出は、ここに無ければ 1 倍）
const FX_GAIN={aura:0.84,book:1.52,bubble:2.94,chronolock:1.07,claw:1.66,confetti:1.59,cosmos:0.52,crimson:1.44,cure:0.99,dino:0.86,disc:3.5,dive:1.65,erase:3.5,fireworks:0.68,flame:1.73,forest:2.65,frostsuit:1.29,gold:0.81,gravflip:1.27,heavyrain:0.72,ice:1.87,jade:1.09,kickshot:1.86,lightblade:1.55,magnet:1.11,mend:1.2,molt3:0.74,ocean:1.1,rainbow:1.56,rapier:2.08,redray:1.48,rewind:1.56,royal:1.5,rush:0.64,sakura:1.93,scoop:2.63,sprout:2.26,star:1.86,stillrain:1.77,strafe:0.64,tankbomb:0.71,thread:2.46,thunder:0.97,timestop:0.81,virus:1.74,void:0.47,weather:1.2,zipper:3.21};
function fxSoundPlay(id){const r=typeof FX_SOUND!=='undefined'&&FX_SOUND[id];if(!r)return false;_gfxAudio(ctx=>_fxRun(ctx,ctx.destination,r,ctx.currentTime+.03,FX_GAIN[id]));return true;}

// ───────── ② 演出ごとの音 ─────────
Object.assign(FX_SOUND,{
 // ===== リーチ =====
 flame:S=>{S.whoosh(0,.55,.3,300,3500);for(let i=0;i<12;i++)S.n(.2+i*.08,.04,{type:'highpass',f:3500,g:.1});S.rumble(.2,1.2,.2);},                      // 炎
 sakura:S=>{S.arp([784,880,1047,1175,1319,1568],.05,.12,.5,{g:.12});S.n(0,1.2,{type:'bandpass',f:5000,q:.6,g:.04,sw:.5});},                            // 桜
 ice:S=>{S.arp([2093,2637,3136,3520],0,.08,.6,{type:'triangle',g:.12});S.n(.3,.12,{type:'highpass',f:5000,g:.18});S.t(120,.3,.6,{to:60,g:.2});},         // 氷
 thunder:S=>{S.n(0,.08,{type:'highpass',f:2000,g:.4,a:.001});S.t(1800,0,.25,{to:200,type:'sawtooth',g:.2,a:.003});S.rumble(.1,1.4,.35);S.n(.12,.5,{f:2000,to:200,g:.2});}, // 雷
 aura:S=>{S.t(55,0,1.5,{type:'sawtooth',g:.2,to:62,sw:.5});S.t(82.4,0,1.5,{type:'sawtooth',g:.12,sw:.5});S.rumble(0,1.5,.25);S.hit(.7,.3,70);},        // 威圧
 thread:S=>{for(let i=0;i<5;i++)S.t(1200+i*260,i*.1,.5,{type:'triangle',g:.1,to:(1200+i*260)*1.02});S.n(0,.5,{type:'bandpass',f:6000,to:9000,q:4,g:.06});S.t(2400,.55,.7,{g:.12,to:2380});}, // 糸
 bubble:S=>{for(let i=0;i<7;i++){const f=500+S.R(i)*700;S.t(f,i*.11,.12,{to:f*2,g:.14,a:.005});S.n(i*.11+.12,.02,{type:'highpass',f:4000,g:.1});}},      // シャボン玉
 erase:S=>{S.n(0,.6,{type:'bandpass',f:200,to:5000,q:3,g:.22,sw:.95});S.t(1500,.6,.03,{type:'square',g:.2,a:.001});S.t(3000,.62,.5,{g:.08});},          // 過程消去（逆再生のように吸い込まれて、プツッと消える）
 disc:S=>{[660,990,1320].forEach((f,i)=>S.t(f,i*.07,.1,{type:'square',g:.1}));S.t(300,.25,.35,{to:1800,type:'triangle',g:.12});S.n(.2,.4,{type:'bandpass',f:2500,q:3,g:.06});}, // ディスク
 gravflip:S=>{S.t(300,0,.5,{to:60,g:.3});S.t(60,.5,.5,{to:400,g:.3,a:.02});S.n(.3,.5,{type:'bandpass',f:400,to:2000,g:.12});S.hit(.5,.3,100);},        // 重力反転
 scoop:S=>{S.n(0,.35,{type:'bandpass',f:800,to:300,q:2,g:.25,sw:.4});S.hit(.35,.35,110);S.n(.38,.2,{type:'highpass',f:2500,g:.12});},                  // 削り取る
 zipper:S=>{for(let i=0;i<14;i++)S.t(1800+i*90,i*.025,.02,{type:'square',g:.08});S.n(0,.4,{type:'bandpass',f:1500,to:4000,q:4,g:.12});S.hit(.45,.2,200);}, // ジッパー
 frostsuit:S=>{S.n(0,1.4,{type:'bandpass',f:500,to:180,q:.9,g:.22,sw:.4});for(let i=0;i<6;i++)S.bell(2500+i*400,.1+i*.12,.8,.06);S.t(90,.4,1,{g:.18,sw:.4});}, // 絶対零度
 forest:S=>{for(let i=0;i<4;i++)S.t(2000+i*300,.05+i*.28,.12,{to:3200,g:.12});S.n(0,1.4,{type:'bandpass',f:1200,to:800,q:.5,g:.05,sw:.5});S.arp([392,494,587],.2,.25,.7,{type:'triangle',g:.1});}, // 翠
 kickshot:S=>{S.hit(0,.4,160);S.t(1800,.02,.3,{to:500,g:.14});S.n(.02,.15,{type:'highpass',f:3000,g:.15});S.hit(.55,.25,120);},                       // 蹴り弾
 dive:S=>{S.n(0,.25,{type:'highpass',f:2500,g:.25});S.t(500,.05,.6,{to:70,g:.3});S.n(.1,.8,{f:1500,to:200,g:.2});for(let i=0;i<4;i++)S.t(900-i*120,.15+i*.1,.1,{to:300,g:.1});}, // 潜り込み
 // ===== ロン =====
 crimson:S=>{S.hit(0,.45,110);S.whoosh(0,.6,.3,400,2600);[110,130.8,164.8].forEach(f=>S.t(f,0,1.2,{type:'sawtooth',g:.1,sw:.2}));for(let i=0;i<8;i++)S.n(.3+i*.1,.04,{type:'highpass',f:3500,g:.08});}, // 紅蓮
 void:S=>{S.t(40,0,1.6,{g:.4,sw:.35});S.t(62,0,1.6,{type:'sawtooth',g:.1,to:48,sw:.35});S.n(0,.9,{type:'bandpass',f:3000,to:200,q:2,g:.2,sw:.9});S.boom(.9,.5);}, // 闇
 gold:S=>{S.bell(880,0,1.6,.2);S.bell(1318,.06,1.4,.14);S.bell(220,0,1.8,.25);S.hit(0,.25,200);for(let i=0;i<10;i++)S.t(3000+i*350,.1+i*.05,.15,{g:.07});}, // 黄金
 ocean:S=>{S.n(0,1.2,{f:300,to:2500,g:.3,sw:.55});S.n(.7,.9,{type:'bandpass',f:1500,to:500,q:.7,g:.28,sw:.1});S.boom(.7,.4,.9);},                       // 大波
 rush:S=>{for(let i=0;i<12;i++){S.hit(i*.075,.25+i*.01,150+i*12);S.n(i*.075,.03,{type:'bandpass',f:2000+i*100,g:.12});}S.boom(.95,.5);},                // ラッシュ
 claw:S=>{for(let i=0;i<3;i++){S.n(i*.12,.18,{type:'highpass',f:2500,to:7000,g:.25,sw:.2});S.t(2200,i*.12,.2,{to:900,type:'sawtooth',g:.07});}S.bell(1800,.4,1.2,.12);S.hit(.05,.3,200);}, // 爪弾
 heavyrain:S=>{S.n(0,1.7,{type:'highpass',f:3000,g:.16,sw:.3});S.n(0,1.7,{type:'bandpass',f:800,q:.4,g:.12,sw:.3});S.rumble(.1,1.6,.3);S.n(.5,.08,{type:'highpass',f:1500,g:.3});S.boom(.52,.4);}, // 重い雨
 redray:S=>{S.t(200,0,.5,{to:1600,type:'sawtooth',g:.14,sw:.95});S.t(1600,.5,.9,{type:'sawtooth',g:.14,sw:.3});S.n(.5,.9,{type:'bandpass',f:3000,q:5,g:.12});S.hit(.5,.4,90);}, // 赤光線
 lightblade:S=>{S.n(0,.3,{type:'highpass',f:1500,to:9000,g:.3,sw:.3});S.bell(2093,.25,1.3,.14);S.t(880,.25,1,{g:.1,to:870});S.hit(.25,.25,170);},        // 光刃
 tankbomb:S=>{S.t(55,0,1,{type:'sawtooth',g:.12,to:48});S.boom(.4,.55,1.3);S.n(.4,.3,{type:'highpass',f:1500,g:.3});for(let i=0;i<8;i++)S.n(.6+i*.08,.03,{type:'bandpass',f:1000+S.R(i)*1500,g:.1});}, // 戦車爆弾
 virus:S=>{S.fm(300,17,200,0,.9,{g:.14});for(let i=0;i<8;i++)S.t(800+S.R(i)*1600,i*.09,.05,{type:'square',g:.07});S.t(440,.9,.25,{type:'square',g:.1});S.t(380,1.15,.25,{type:'square',g:.1});S.rumble(0,1.5,.12);}, // 殺人ウイルス
 magnet:S=>{S.t(100,0,1.4,{type:'sawtooth',g:.14,to:120,sw:.5});S.t(200,0,1.4,{type:'square',g:.05,sw:.5});S.n(0,.8,{type:'bandpass',f:2000,to:600,q:6,g:.1});S.hit(.8,.4,160);S.bell(700,.82,1,.18);}, // 磁力の刃
 jade:S=>{S.bell(1046,0,1.7,.2);S.bell(1568,.12,1.5,.12);S.bell(784,.25,1.5,.12);S.t(2093,.4,.8,{g:.06});S.hit(0,.15,260);},                          // 翡翠
 rapier:S=>{for(let i=0;i<5;i++)S.n(i*.11,.1,{type:'highpass',f:3000,to:8000,g:.2,sw:.2});S.bell(3136,.6,1,.12);S.bell(2349,.62,1,.08);},              // 目にも留まらぬ剣技
 strafe:S=>{for(let i=0;i<20;i++){S.n(i*.045,.025,{type:'bandpass',f:1800,g:.2});S.t(120,i*.045,.03,{g:.15,a:.001});}S.boom(.6,.4,.6);S.boom(.95,.45,.7);S.boom(1.3,.5,.9);}, // 機銃掃射と爆撃
 // ===== 上がり =====
 fireworks:S=>{S.t(600,0,.5,{to:1800,g:.12});S.boom(.5,.5);for(let i=0;i<14;i++)S.n(.55+i*.06,.05,{type:'highpass',f:4000,g:.1});S.sparkle(.6,1,.08);S.boom(1.1,.4);}, // 花火
 confetti:S=>{S.hit(0,.35,200);S.n(0,.1,{type:'highpass',f:3000,g:.25});S.arp([523,659,784,1047],.05,.09,.35,{type:'triangle',g:.18});S.sparkle(.4,1,.08);},   // 紙吹雪
 star:S=>{S.t(3200,0,.9,{to:600,g:.12,sw:.2});for(let i=0;i<6;i++)S.bell(2000+i*300,.2+i*.14,.7,.07);},                                                // 流れ星
 royal:S=>{S.hit(0,.4,100);[262,330,392].forEach(f=>S.t(f,0,.5,{type:'sawtooth',g:.09}));[294,370,440].forEach(f=>S.t(f,.3,.5,{type:'sawtooth',g:.09}));[392,494,587,784].forEach(f=>S.t(f,.7,1.2,{type:'sawtooth',g:.1}));S.n(.7,.8,{type:'highpass',f:5000,g:.1});}, // 王冠
 timestop:S=>{for(let i=0;i<6;i++)S.tick(i*.12,.12,1800);S.n(.5,.35,{type:'bandpass',f:200,to:4000,q:2,g:.2,sw:.95});S.boom(.9,.5,1.2);S.t(2600,.9,.2,{g:.1});}, // 時間停止
 mend:S=>{S.arp([392,494,587,740,880,1175],0,.1,.9,{type:'triangle',g:.14});S.t(196,0,1.8,{g:.1,sw:.4});S.sparkle(.5,1.2,.06);},                             // 修復
 sprout:S=>{S.arp([523,659,784,1047,1319],0,.1,.25,{type:'triangle',g:.15});S.n(0,1,{type:'bandpass',f:2500,q:1,g:.05});S.bell(1568,.6,1,.1);},            // 芽吹き
 chronolock:S=>{[0,.1,.22,.38,.6,.9,1.3].forEach(t=>S.tick(t,.12,1500-t*300));S.t(55,0,2,{type:'sawtooth',g:.1,sw:.5});S.boom(.9,.35);},                // 止まった世界
 rewind:S=>{S.n(0,.7,{type:'bandpass',f:300,to:6000,q:2,g:.2,sw:.9});for(let i=0;i<20;i++)S.tick(i*.03,.06,2000);S.t(200,0,.7,{to:1600,type:'sawtooth',g:.1});S.arp([523,659,784],.75,.1,1.1,{type:'triangle',g:.16});}, // 巻き戻し
 cosmos:S=>{S.t(55,0,2.2,{g:.3,sw:.4});[110,165,220].forEach(f=>S.t(f,0,2.2,{type:'sawtooth',g:.06,sw:.4}));S.n(0,2,{type:'bandpass',f:300,to:4000,q:1,g:.12,sw:.7});S.sparkle(.8,1.4,.07);S.boom(1.2,.4);}, // 宇宙一巡
 weather:S=>{S.n(0,2,{type:'bandpass',f:400,to:900,q:.6,g:.16,sw:.5});S.n(0,2,{type:'highpass',f:4500,g:.07});S.n(.9,.08,{type:'highpass',f:2000,g:.3});S.rumble(.95,1.2,.3);}, // 天候
 book:S=>{for(let i=0;i<4;i++)S.n(i*.09,.1,{type:'bandpass',f:3500,to:1200,q:.8,g:.18});S.hit(.4,.2,260);S.bell(1319,.45,1.4,.15);S.bell(1760,.55,1.2,.1);S.sparkle(.5,1,.07);}, // 命令の本
 cure:S=>{S.bell(880,0,1.5,.15);[523,659,784].forEach(f=>S.t(f,.1,1.4,{g:.12,sw:.3}));S.n(0,1.2,{type:'highpass',f:5000,g:.07,sw:.3});S.t(2500,.5,.3,{g:.1});}, // 癒しの料理
 dino:S=>{S.t(70,0,1,{type:'sawtooth',g:.28,to:45,sw:.2});S.t(140,0,1,{type:'sawtooth',g:.12,to:80});S.n(0,1,{type:'bandpass',f:500,to:1500,q:2,g:.2,sw:.3});S.hit(1,.45,70);S.hit(1.35,.5,60);S.boom(1.35,.3,.8);}, // 恐竜化
 stillrain:S=>{for(let i=0;i<10;i++){const f=1200+S.R(i)*1800;S.t(f,.1+i*.17,.25,{to:f*.9,g:.1});}S.n(0,2,{type:'bandpass',f:6000,q:.5,g:.03});S.t(220,0,2,{g:.06,sw:.4});S.t(330,0,2,{g:.04,sw:.4});}, // 静止する雨
 rainbow:S=>{S.sparkle(0,1.5,.1);S.arp([523,659,784,1047,1319,1568],0,.1,.6,{g:.12});S.n(0,.6,{type:'bandpass',f:2000,to:6000,g:.08});},               // 虹
 // 三段の脱皮（4.4秒）：①卵が脈打ち、文字が響く ②殻が割れて爆発→熱 ③重圧で地面にめり込む
 molt3:S=>{
   S.hit(.2,.22,95);S.hit(.5,.26,100);S.hit(.95,.3,105);[.15,.4,.65,.9,1.15].forEach((t,i)=>S.bell(560+i*60,t,.6,.07));S.t(220,0,1.4,{g:.08,sw:.6});
   for(let i=0;i<4;i++){S.n(1.45+i*.12,.06,{type:'highpass',f:3500,g:.2});S.t(180+i*30,1.45+i*.12,.08,{type:'square',g:.05});}
   S.t(300,1.4,.5,{to:900,type:'sawtooth',g:.08,sw:.95});S.n(1.8,.4,{type:'highpass',f:2500,to:6000,g:.3});for(let i=0;i<5;i++)S.bell(1800+S.R(i)*1500,1.82+i*.05,.35,.06);
   S.boom(2.0,.6,1.1);S.n(2.0,.5,{f:4000,to:300,g:.35});S.n(2.4,.9,{type:'highpass',f:4000,g:.08,sw:.3});S.rumble(2.1,.7,.18);
   S.t(2200,2.7,.3,{to:300,g:.14});S.boom(3.05,.7,1.4);S.hit(3.05,.5,70);S.n(3.05,.3,{type:'highpass',f:1500,g:.3});
   for(let i=0;i<6;i++)S.n(3.1+i*.09,.05,{type:'bandpass',f:300+S.R(i)*300,g:.2});S.rumble(3.05,1.2,.35);S.n(3.2,1,{type:'highpass',f:3000,g:.06,sw:.2});},
});

// ───────── ③ 開発者とマッチしたときの音（GIFが流れるあいだ・約3.7秒） ─────────
function devMatchSound(){
  _gfxAudio(ctx=>_fxRun(ctx,ctx.destination,S=>{
    S.t(46,0,3.7,{g:.35,sw:.5});S.t(69,0,3.7,{type:'sawtooth',g:.06,to:58,sw:.5});S.n(0,2.2,{type:'bandpass',f:200,to:3000,q:2,g:.16,sw:.9});
    [.6,1,1.4,1.8].forEach((t,i)=>S.hit(t,.22+i*.05,60));
    S.t(880,.8,2.4,{g:.04,det:6,sw:.5});S.t(1318,1.2,2,{g:.025,det:-8,sw:.5});
    S.n(2.15,.15,{type:'highpass',f:3000,g:.25});S.boom(2.3,.55,1.4);S.bell(1397,2.3,1.3,.1);S.rumble(2.3,1.3,.2);
  },ctx.currentTime+.03,0.56));
}
