// =====================================================================
//  開発者用：Googleでログインした人数を、メニュー（3本線）の「開発者モード」で見る
//  ・サーバーに、フレンドコードと合言葉を送り、開発者だとサーバーが確かめたときだけ、数が返ってきます
//    （画面にボタンが出るかどうかは、isDevUser()。実際に見られるかどうかは、サーバー側の DEV_FRIEND_CODES で決まります）
//  ・返ってくるのは数だけです（名前・メールなどは、サーバーも返しません）
//  ※ 14・17 より後に読み込みます
// =====================================================================
let _devStatsTimer=null;
function _devStatsOut(t){const el=document.getElementById('dev-stats-out');if(el)el.textContent=t;}
function devStatsRender(r){
  clearTimeout(_devStatsTimer);
  if(!r||!r.ok){
    _devStatsOut(r&&r.err==='forbidden'
      ?'開発者として確認できませんでした。\nこの端末のフレンドコードが、サーバーの開発者リスト（DEV_FRIEND_CODES）にありません。'
      :'人数を取れませんでした。少し待って、もう一度押してください。');
    return;
  }
  const n=x=>Math.max(0,Number(x)||0).toLocaleString('ja-JP');
  let t=`Googleでログインした人：${n(r.googleAccounts)}人\nセーブデータ：${n(r.accounts)}件／端末：${n(r.devices)}台`;
  try{t+=`\n（${new Date(r.takenAt).toLocaleString('ja-JP')} 時点・保存先：${r.mode==='file'?'ファイル':r.mode}）`;}catch(e){}
  if(r.note)t+=`\n⚠ ${String(r.note)}`;
  _devStatsOut(t);
}
function devStatsOpen(){
  const sock=(typeof _svSock==='function')?_svSock():null,a=(typeof devAuth==='function')?devAuth():{};
  if(!sock){_devStatsOut('サーバーにつながっていません。少し待ってから、もう一度押してください。');return;}
  if(!a.fc||!a.ft){_devStatsOut('この端末は、まだフレンド登録されていません（フレンドコードがありません）。フレンドの画面を一度開いてください。');return;}
  if(!sock._devStatsBound){sock._devStatsBound=true;sock.on('dev_stats_result',devStatsRender);}
  _devStatsOut('数えています…');
  clearTimeout(_devStatsTimer);_devStatsTimer=setTimeout(()=>_devStatsOut('応答がありません。サーバーが古い可能性があります（人数の機能が入っていないサーバーです）。'),9000);
  sock.emit('dev_stats',{fc:a.fc,ft:a.ft});
}
