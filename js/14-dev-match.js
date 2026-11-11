// =====================================================================
//  開発者とマッチしたときに流す演出（GIF）
//  ・相手が開発者だとサーバーが教えてくれたとき（players[].dev）だけ流れます
//  ・対戦前の紹介画面（相手のアイコンや名前が出ている画面）の背景として流れます
//  ・開発者は、サイドメニューの「開発者」欄の「流れ方を見る」か、コンソールの devPreviewMatch() で確認できます
//  ・GIFは img/dev-match.gif。差し替えるときは、同じ名前で上書きするか、下の DEV_MATCH_GIF を変えます
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
    const mf=document.getElementById('match-fx');if(!mf||mf.querySelector('.dm-layer'))return;
    if(!document.getElementById('dev-match-css')){const st=document.createElement('style');st.id='dev-match-css';
      st.textContent=`#match-fx .dm-layer{position:absolute;inset:0;z-index:-1;background:#07020f;overflow:hidden;opacity:0;animation:dmIn .5s ease-out forwards}
@keyframes dmIn{to{opacity:1}}
#match-fx .dm-layer .dm-bg{position:absolute;inset:-6%;width:112%;height:112%;object-fit:cover;filter:blur(18px) brightness(.5) saturate(1.3)}
#match-fx .dm-layer .dm-fg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(100vw,calc(100vh*374/211));height:auto}
#match-fx .dm-layer::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(7,2,15,.55) 0%,rgba(7,2,15,0) 28%,rgba(7,2,15,0) 55%,rgba(7,2,15,.7) 100%)}
#match-fx.devm .mf-stars,#match-fx.devm .mf-center{visibility:hidden}`;
      document.head.appendChild(st);}
    const layer=document.createElement('div');layer.className='dm-layer';
    let url='';try{if(_dmBlob)url=URL.createObjectURL(_dmBlob);}catch(e){}
    if(!url)url=DEV_MATCH_GIF+'?t='+Date.now(); // 先読みが間に合わなかったときは、そのまま読み込む
    layer.innerHTML='<img class="dm-bg" alt=""><img class="dm-fg" alt="">';
    layer.querySelectorAll('img').forEach(im=>{im.onerror=()=>{layer.remove();mf.classList.remove('devm');};im.src=url;}); // 毎回あたらしく読み込むので、先頭から再生される
    mf.insertBefore(layer,mf.firstChild);mf.classList.add('devm');
    setTimeout(()=>{try{if(url.startsWith('blob:'))URL.revokeObjectURL(url);}catch(e){}},6000);
  }catch(e){}
}

// 開発者用：どんなふうに流れるかを見る（相手が開発者だった場合の、対戦前の紹介画面）
function devPreviewMatch(){
  try{closeSidebar();}catch(e){}
  setTimeout(()=>{matchFoundFx([{name:myName(),avatar:myAvatarUrl(),title:myTitleId()},{name:'開発者',dev:true}],0,'対戦相手が見つかりました！');},250);
}
