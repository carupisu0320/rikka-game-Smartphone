// =====================================================================
//  開発者とマッチしたときに流す演出（GIF）
//  ・相手が開発者だとサーバーが教えてくれたとき（players[].dev）だけ流れます
//  ・GIFは img/dev-match.gif。差し替えるときは、同じ名前で上書きするか、下の DEV_MATCH_GIF を変えます
//  ・画面をタップすると、すぐ閉じます
// =====================================================================
const DEV_MATCH_GIF='img/dev-match.gif';
const DEV_MATCH_MS=3660; // GIFの長さ（ミリ秒）。GIFを変えたら、その長さに合わせます

// 自分が開発者のとき、サーバーに「自分のフレンドコードと合言葉」を送って、開発者だと確かめてもらう
function devAuth(){try{const s=frState();return s&&s.code&&s.tok?{fc:s.code,ft:s.tok}:{};}catch(e){return{};}}

let _dmBlob=null,_dmLoading=false;
function devMatchPreload(){ // GIFを先に読み込んでおく（流すときに待たないように）
  if(_dmBlob||_dmLoading)return;_dmLoading=true;
  fetch(DEV_MATCH_GIF).then(r=>r.ok?r.blob():null).then(b=>{_dmBlob=b;}).catch(()=>{}).finally(()=>{_dmLoading=false;});
}
setTimeout(devMatchPreload,2500);

function devMatchFx(players,you){
  try{
    if(!Array.isArray(players))return;
    if(!players.some((p,i)=>i!==you&&p&&p.dev))return; // 相手に開発者がいないときは何もしない
    if(document.getElementById('dev-match'))return;
    if(!document.getElementById('dev-match-css')){const st=document.createElement('style');st.id='dev-match-css';
      st.textContent=`#dev-match{position:fixed;inset:0;z-index:960;background:#07020f;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .35s;overflow:hidden}
#dev-match.on{opacity:1}#dev-match.off{opacity:0;transition:opacity .5s}
#dev-match .dm-bg{position:absolute;inset:-6%;width:112%;height:112%;object-fit:cover;filter:blur(18px) brightness(.5) saturate(1.3)}
#dev-match .dm-fg{position:relative;width:min(100vw,calc(100vh*374/211));height:auto;box-shadow:0 0 60px rgba(150,60,255,.55)}
#dev-match::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(7,2,15,.75) 100%)}`;
      document.head.appendChild(st);}
    const el=document.createElement('div');el.id='dev-match';
    let url='';try{if(_dmBlob)url=URL.createObjectURL(_dmBlob);}catch(e){}
    if(!url)url=DEV_MATCH_GIF+'?t='+Date.now(); // 先読みが間に合わなかったときは、そのまま読み込む
    el.innerHTML=`<img class="dm-bg" alt=""><img class="dm-fg" alt="">`;
    const imgs=el.querySelectorAll('img');imgs.forEach(im=>{im.onerror=()=>close(true);im.src=url;}); // 毎回あたらしく読み込むので、先頭から再生される
    document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));
    let done=false,tm=null;
    function close(now){if(done)return;done=true;clearTimeout(tm);if(now){el.remove();}else{el.classList.remove('on');el.classList.add('off');setTimeout(()=>el.remove(),520);}try{if(url.startsWith('blob:'))URL.revokeObjectURL(url);}catch(e){}}
    el.onclick=()=>close(false);
    tm=setTimeout(()=>close(false),DEV_MATCH_MS+250);
    // 対戦相手の紹介画面は、GIFが終わったあとにしばらく見えるようにする
    if(typeof _matchHideTimer!=='undefined'){clearTimeout(_matchHideTimer);_matchHideTimer=setTimeout(()=>hideMatchFx(false),DEV_MATCH_MS+2200);}
  }catch(e){}
}
