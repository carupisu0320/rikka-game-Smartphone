/* フレンド・メッセージなどの画面が開いたら、メニューを閉じて隠す（カスタマイズ画面と同じ） */
(function(){
  const ids=['modal','chat-wrap','bot-chat-wrap'];
  const isOpen=el=>!!el&&(el.id==='modal'?el.classList.contains('open'):el.style.display==='flex');
  const sync=()=>{const o=ids.some(i=>isOpen(document.getElementById(i)));
    document.body.classList.toggle('no-menu',o);
    if(o&&typeof closeSidebar==='function')closeSidebar(); // サイドバー（メニュー）から開いたときは、メニューを閉じて、画面を一番上に出す
  };
  ids.forEach(i=>{const el=document.getElementById(i);if(el)new MutationObserver(sync).observe(el,{attributes:true,attributeFilter:['class','style']});});
  sync();
})();
