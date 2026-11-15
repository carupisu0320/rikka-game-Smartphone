// =====================================================================
//  セーブデータの保護
//  ① 書き出し／読み込み：持ち物・花びら・実績・設定などを、ファイルに保存／ファイルから復元できます
//     （サイドメニューの「データの保護」から）。端末を変えるときや、ブラウザのデータを消す前に使います
//  ② 自動保護：ガチャの景品は「増えるだけ」なので、消えていたら自動で元に戻します
//     ・景品をひとつでも持ったことがあれば、その記録を、端末の中の2か所（localStorage と IndexedDB）に残します
//     ・端末のデータが丸ごと消えていたら、最新の控え（スナップショット）から自動で復元します
//  ※ 書き出したファイルには、フレンドの合言葉も入っています。他の人には渡さないでください
// =====================================================================

// ───────── 保存する対象 ─────────
const SV_EXACT=['rikka_gacha','rikka_petals','rikka_achievements','rikka_login','rikka_missions','rikka_history','rikka_giftbox_claimed','rikka_giftbox_seen','rikka_friends','rikka_avatar','rikka_back_theme','rikka_field_bg','rikka_fx','rikka_bg_anim','rikka_tile_anim','rikka_tile_scale','rikka_sound_enabled','rikka_sound_volume','rikka_icon_ack'];
const SV_PREFIX=['rikka_name_','rikka_event_']; // 名前（Googleのアカウントごと）／イベントの進み具合
const SV_MERGE=new Set(['rikka_achievements','rikka_giftbox_claimed','rikka_giftbox_seen','rikka_icon_ack']); // 「足し合わせ」て復元するもの（減らない）
const SV_LIMIT=300*1024;
function _svOk(k){return typeof k==='string'&&(SV_EXACT.includes(k)||SV_PREFIX.some(p=>k.startsWith(p)&&k.length<=80&&/^[A-Za-z0-9_\-]+$/.test(k)));}
function _svJ(s,def){try{const v=JSON.parse(s);return v==null?def:v;}catch(e){return def;}}
function _svCollect(){const o={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(_svOk(k)){const v=localStorage.getItem(k);if(v!=null&&v.length<=SV_LIMIT)o[k]=v;}}}catch(e){}return o;}
const _svId=x=>typeof x==='string'&&/^[A-Za-z0-9_:\-]{1,60}$/.test(x)&&x!=='__proto__'&&x!=='constructor'&&x!=='prototype';

// 「減らない」まとめかた（配列は足す／数は大きいほう／真偽は or）。 a＝いまの端末、b＝読み込むほう
function _svMerge(a,b){
  if(a===undefined)return b;if(b===undefined)return a;
  if(Array.isArray(a)&&Array.isArray(b)){const s=new Set(a.map(x=>JSON.stringify(x))),r=a.slice();b.forEach(x=>{const k=JSON.stringify(x);if(!s.has(k)){s.add(k);r.push(x);}});return r.slice(0,3000);}
  if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){const r=Object.assign({},a);Object.keys(b).forEach(k=>{if(k==='__proto__'||k==='constructor'||k==='prototype')return;r[k]=_svMerge(a[k],b[k]);});return r;}
  if(typeof a==='number'&&typeof b==='number')return Math.max(a,b);
  if(typeof a==='boolean'&&typeof b==='boolean')return a||b;
  return a;
}
function _svSet(k,v){try{localStorage.setItem(k,v);return true;}catch(e){return false;}}

// ───────── ① 読み込み（復元）：いまの端末のデータは、減らさない ─────────
function svApplyImport(obj,opt){
  const rep={added:0,petals:null,friends:false,kept:0,skipped:[]};
  if(!obj||obj.app!=='rikka'||!obj.data||typeof obj.data!=='object')throw new Error('六華のバックアップファイルではありません');
  for(const [k,v] of Object.entries(obj.data)){
    if(!_svOk(k)||typeof v!=='string'||v.length>SV_LIMIT){rep.skipped.push(String(k).slice(0,30));continue;}
    const cur=localStorage.getItem(k);
    if(k==='rikka_gacha'){ // 持ち物：足し合わせ（装備は、いまの端末のものを優先）
      const im=_svJ(v,{}),c=_svJ(cur,{}),io=(Array.isArray(im.owned)?im.owned:[]).filter(_svId).slice(0,3000),co=(Array.isArray(c.owned)?c.owned:[]).filter(_svId);
      const set=new Set(co),add=io.filter(x=>!set.has(x));
      const eq={};const src=Object.assign({},im.equipped&&typeof im.equipped==='object'?im.equipped:{},c.equipped&&typeof c.equipped==='object'?c.equipped:{});
      for(const [ek,ev] of Object.entries(src)){if(/^[a-z_]{1,24}$/.test(ek)&&(ev==null||(typeof ev==='string'&&ev.length<=80)))eq[ek]=ev;}
      _svSet(k,JSON.stringify({owned:co.concat(add),equipped:eq}));rep.added+=add.length;
    }else if(k==='rikka_petals'){ // 花びら：多いほう
      const n=Math.min(1e7,Math.max(0,parseInt(v,10)||0)),c=parseInt(cur||'0',10)||0;if(n>c){_svSet(k,String(n));rep.petals=n-c;}
    }else if(k==='rikka_history'){ // 対戦の履歴：足し合わせ
      const a=_svJ(cur,[]),b=_svJ(v,[]);if(Array.isArray(a)&&Array.isArray(b))_svSet(k,JSON.stringify(_svMerge(a,b).slice(0,100)));
    }else if(k==='rikka_friends'){ // フレンド：いまの端末にフレンドがいなければ、コードごと元に戻す。いれば、フレンドだけ足す
      const im=_svJ(v,null),c=_svJ(cur,null);
      if(im&&/^[A-HJ-NP-Z2-9]{8}$/.test(im.code||'')&&typeof im.tok==='string'&&im.tok.length>=16&&im.tok.length<=64){
        const list=(l)=>(Array.isArray(l)?l:[]).filter(f=>f&&/^[A-HJ-NP-Z2-9]{8}$/.test(f.code||'')).map(f=>({code:f.code,name:String(f.name||'').slice(0,40)})).slice(0,200);
        if(!c||!Array.isArray(c.list)||c.list.length===0){_svSet(k,JSON.stringify({code:im.code,tok:im.tok,list:list(im.list),declined:(Array.isArray(im.declined)?im.declined:[]).filter(x=>typeof x==='string').slice(0,200)}));rep.friends=true;}
        else{const m=_svMerge(list(c.list),list(im.list)),seen=new Set(),u=m.filter(f=>!seen.has(f.code)&&seen.add(f.code));c.list=u;_svSet(k,JSON.stringify(c));}
      }
    }else if(SV_MERGE.has(k)||k.startsWith('rikka_event_')){ // 実績・受け取り済み・イベント：足し合わせ
      const a=_svJ(cur,undefined),b=_svJ(v,undefined);if(b!==undefined)_svSet(k,JSON.stringify(a===undefined?b:_svMerge(a,b)));
    }else{ // 設定など：いまの端末にあれば、そのまま。なければ復元
      if(cur==null)_svSet(k,v);else rep.kept++;
    }
  }
  return rep;
}

// ───────── 書き出し ─────────
function svExportText(){return JSON.stringify({app:'rikka',v:1,t:Date.now(),data:_svCollect()});}
function svExportFile(){
  const d=new Date(),p=n=>String(n).padStart(2,'0'),name=`rikka-backup-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.json`;
  const blob=new Blob([svExportText()],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);return name;
}

// ───────── ② 自動保護 ─────────
const SV_DB='rikka-guard',SV_ST='kv';let _svDbP=null,_svBusy=false,_svLastSnap=0,_svInfo={n:0,t:0};
function _svDb(){return _svDbP||(_svDbP=new Promise((res,rej)=>{try{const q=indexedDB.open(SV_DB,1);q.onupgradeneeded=()=>q.result.createObjectStore(SV_ST);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error);}catch(e){rej(e);}}));}
function _svGet(k){return _svDb().then(db=>new Promise((res,rej)=>{const r=db.transaction(SV_ST).objectStore(SV_ST).get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);})).catch(()=>undefined);}
function _svPut(k,v){return _svDb().then(db=>new Promise((res,rej)=>{const t=db.transaction(SV_ST,'readwrite');t.objectStore(SV_ST).put(v,k);t.oncomplete=()=>res(true);t.onerror=()=>rej(t.error);})).catch(()=>false);}
function _svRaw(){let raw,bad=false;try{raw=JSON.parse(localStorage.getItem('rikka_gacha')||'{}');}catch(e){raw={};bad=true;}if(!raw||typeof raw!=='object'||Array.isArray(raw))raw={};return{raw,bad,owned:(Array.isArray(raw.owned)?raw.owned:[]).filter(x=>typeof x==='string')};}
// 持ったことのある景品の記録を、端末に残す（同期処理。ページを閉じるときにも使える）
function _svSyncEver(){const {owned}=_svRaw();const ever=new Set([..._svJ(localStorage.getItem('rikka_owned_ever'),[]).filter(_svId),...owned.filter(_svId)]);_svSet('rikka_owned_ever',JSON.stringify([...ever].slice(0,3000)));return ever;}
async function svGuard(opt){
  if(_svBusy)return;_svBusy=true;
  try{
    const cur=_svCollect(),snap=await _svGet('snap'),wiped=!cur.rikka_gacha&&!cur.rikka_petals&&!cur.rikka_friends;
    // 1) 端末のデータが丸ごと消えていたら、最新の控えから復元
    if(wiped&&snap&&snap.data&&Object.keys(snap.data).length){try{svApplyImport({app:'rikka',data:snap.data});toast('🛡️ 端末のデータが消えていたので、自動で元に戻しました');}catch(e){}}
    // 2) 持ち物が減っていたら、元に戻す（景品は増えるだけで、減ることはないため）
    const st=_svRaw(),everLS=_svJ(localStorage.getItem('rikka_owned_ever'),[]).filter(_svId),everDB=((await _svGet('ever'))||[]).filter(_svId);
    const ever=new Set([...everLS,...everDB,...st.owned.filter(_svId)]),miss=[...ever].filter(id=>!st.owned.includes(id));
    if(miss.length){st.raw.owned=st.owned.concat(miss);if(!st.raw.equipped||typeof st.raw.equipped!=='object'){const sg=snap&&snap.data&&_svJ(snap.data.rikka_gacha,{});st.raw.equipped=(sg&&sg.equipped)||{};}
      _svSet('rikka_gacha',JSON.stringify(st.raw));toast(`🛡️ 持ち物が${miss.length}個、消えていたので、自動で元に戻しました`);}
    const arr=[...ever].slice(0,3000);_svSet('rikka_owned_ever',JSON.stringify(arr));await _svPut('ever',arr);
    // 3) 控え（スナップショット）：変化があったときだけ、20秒に1回まで
    const now=Date.now(),data=_svCollect(),json=JSON.stringify(data);
    if((opt&&opt.force||now-_svLastSnap>20000)&&(!snap||snap.json!==json)){await _svPut('snap',{t:now,json,data});_svLastSnap=now;_svInfo.t=now;}else if(snap&&!_svInfo.t)_svInfo.t=snap.t||0;
    _svInfo.n=ever.size;_svStatus();
  }catch(e){}finally{_svBusy=false;}
}
let _svTimer=null;function _svSoon(){clearTimeout(_svTimer);_svTimer=setTimeout(()=>svGuard(),2500);}
// 景品や花びらを保存するたびに、あとで確認する
(function(){for(const n of ['saveGachaState','grantItem','savePetals']){const f=window[n];if(typeof f==='function'){window[n]=function(){const r=f.apply(this,arguments);try{_svSoon();}catch(e){}return r;};}}})();
setTimeout(()=>svGuard(),1500);setInterval(()=>svGuard(),45000);
document.addEventListener('visibilitychange',()=>{if(document.hidden){try{_svSyncEver();}catch(e){}svGuard({force:true});}});
window.addEventListener('pagehide',()=>{try{_svSyncEver();}catch(e){}svGuard({force:true});});

// ───────── 画面（サイドメニューの「データの保護」） ─────────
function _svStatus(){const el=document.getElementById('sv-status');if(!el)return;const t=_svInfo.t?new Date(_svInfo.t):null,hm=t?`${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`:'—';el.textContent=`🛡️ 自動保護：持ち物の記録 ${_svInfo.n}個／最終の控え ${hm}`;}
function _svCss(){if(document.getElementById('sv-css'))return;const st=document.createElement('style');st.id='sv-css';
  st.textContent=`#sv-modal{position:fixed;inset:0;z-index:975;background:rgba(5,3,10,.82);display:flex;align-items:center;justify-content:center;padding:1rem}
#sv-box{width:min(440px,100%);max-height:88vh;overflow:auto;background:#17110b;border:1px solid #5a4020;border-radius:12px;padding:1rem;color:#d8c8a0;font-size:.85rem;line-height:1.6}
#sv-box h3{margin:0 0 .5rem;color:#e8c97a;font-size:1rem}#sv-box .sv-note{font-size:.74rem;color:#9a8660;margin:.3rem 0 .6rem}
#sv-box textarea{width:100%;height:7.5rem;background:#0d0a06;color:#d8c8a0;border:1px solid #3a2a14;border-radius:8px;padding:.4rem;font-size:.7rem;box-sizing:border-box}
#sv-box .sv-b{display:inline-block;margin:.25rem .3rem .25rem 0;padding:.5rem .8rem;border-radius:8px;border:1px solid #5a4020;background:#241a0e;color:#e8c97a;font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer}
#sv-box .sv-ok{color:#7be08a}#sv-box .sv-ng{color:#ff8a7a}`;document.head.appendChild(st);}
function svOpen(mode){
  _svCss();const old=document.getElementById('sv-modal');if(old)old.remove();
  const m=document.createElement('div');m.id='sv-modal';
  const exp=mode==='export';
  m.innerHTML=`<div id="sv-box"><h3>${exp?'💾 データを書き出す':'📂 データを読み込む'}</h3>`+(exp?
    `<div class="sv-note">持ち物・花びら・実績・設定などを、ファイルにして保存します。端末を変えるときや、ブラウザのデータを消す前に使ってください。<br>※ ファイルには、フレンドの合言葉も入っています。他の人には渡さないでください。</div>
     <button class="sv-b" id="sv-dl">ファイルとして保存</button><button class="sv-b" id="sv-cp">テキストをコピー</button>
     <textarea id="sv-ta" readonly></textarea>`:
    `<div class="sv-note">書き出したファイルを選ぶか、テキストを貼り付けてください。いまの端末のデータは、<b>減らさずに</b>足し合わせます（持ち物は足され、花びらは多いほうになります）。</div>
     <input type="file" id="sv-file" accept=".json,application/json" style="display:none"><button class="sv-b" id="sv-pick">ファイルを選ぶ</button>
     <textarea id="sv-ta" placeholder="ここに、書き出したテキストを貼り付け"></textarea><button class="sv-b" id="sv-go">この内容で復元</button>`)+
    `<div id="sv-msg" style="min-height:1.4em;margin-top:.4rem"></div><button class="sv-b" id="sv-x">閉じる</button></div>`;
  document.body.appendChild(m);
  const $=id=>m.querySelector('#'+id),msg=(t,ok)=>{$('sv-msg').className=ok?'sv-ok':'sv-ng';$('sv-msg').textContent=t;};
  $('sv-x').onclick=()=>m.remove();m.addEventListener('click',e=>{if(e.target===m)m.remove();});
  if(exp){
    $('sv-ta').value=svExportText();
    $('sv-dl').onclick=()=>{try{msg('保存しました：'+svExportFile(),true);}catch(e){msg('保存できませんでした。「テキストをコピー」を使ってください',false);}};
    $('sv-cp').onclick=()=>{const ta=$('sv-ta');ta.select();let ok=false;try{ok=document.execCommand('copy');}catch(e){}if(navigator.clipboard)navigator.clipboard.writeText(ta.value).then(()=>msg('コピーしました',true),()=>msg(ok?'コピーしました':'コピーできませんでした。テキストを選んでコピーしてください',ok));else msg(ok?'コピーしました':'コピーできませんでした。テキストを選んでコピーしてください',ok);};
  }else{
    $('sv-pick').onclick=()=>$('sv-file').click();
    $('sv-file').onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;if(f.size>1.5*1024*1024){msg('ファイルが大きすぎます',false);return;}const r=new FileReader();r.onload=()=>{$('sv-ta').value=String(r.result||'');msg('ファイルを読み込みました。「この内容で復元」を押してください',true);};r.readAsText(f);};
    $('sv-go').onclick=()=>{try{const t=$('sv-ta').value.trim();if(!t){msg('テキストが空です',false);return;}if(t.length>1.5*1024*1024)throw new Error('データが大きすぎます');
      const rep=svApplyImport(JSON.parse(t));try{_svSyncEver();}catch(e){}
      msg(`復元しました：持ち物 +${rep.added}${rep.petals?`、花びら +${rep.petals}`:''}${rep.friends?'、フレンドコードも元に戻しました':''}。画面を読み込み直します…`,true);setTimeout(()=>location.reload(),1600);}
      catch(e){msg('復元できませんでした：'+(e&&e.message?e.message:'形式が違います'),false);}};
  }
}
(function(){
  function build(){const sb=document.getElementById('sidebar');if(!sb||document.getElementById('sv-section'))return;
    const sec=document.createElement('div');sec.className='sb-section';sec.id='sv-section';
    sec.innerHTML=`<div class="sb-section-title" style="margin-top:.8rem;border-top:1px solid #2a1e10;padding-top:.5rem">― データの保護 ―</div>
      <div style="font-size:.7rem;color:#8a7048;line-height:1.55;margin:.2rem 0 .5rem">持ち物・花びら・実績・設定を、ファイルに保存できます。端末を変えるときや、ブラウザのデータを消す前に使ってください。</div>
      <button class="sb-custom-btn" onclick="svOpen('export')">💾 データを書き出す</button>
      <button class="sb-custom-btn" style="margin-top:.35rem" onclick="svOpen('import')">📂 データを読み込む</button>
      <div id="sv-status" style="font-size:.68rem;color:#6a5830;margin-top:.4rem"></div>`;
    sb.appendChild(sec);_svStatus();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
