// ---- 設定（差し替え） ----
const SITE_NAME = "業務改善屋さん";
const CONTACT_EMAIL = "y_akagi@improve-biz.com"; // ←実アドレスに変更
const RECRUIT_EMAIL = "y_akagi@improve-biz.com"; // ←実アドレスに変更
const TEL_PLACEHOLDER = "（後ほど入力）";
const ADDRESS_PLACEHOLDER = "（後ほど入力）";

// ---- ヘッダー / フッター挿入（全ページで同一UI） ----
function renderHeader(){
  return `
  <header>
    <nav class="nav" aria-label="グローバル">
      <div class="brand"><a href="index.html">${SITE_NAME}</a></div>
      <div>
        <a href="index.html">ホーム</a>
        <a href="services.html">サービス</a>
        <a href="works.html">実績</a>
        <a href="pricing.html">料金</a>
        <a href="faq.html">FAQ</a>
        <a href="recruit.html">求人</a>
        <a href="company.html">会社情報</a>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfd5kkdbHRSh6pSzi-ccTw8eQaxFCvL4S5npUwi79jR6Eznkw/viewform?usp=header" class="btn">お問い合わせ</a>
      </div>
    </nav>
  </header>`;
}
function renderFooter(){
  const y=new Date().getFullYear();
  return `
  <footer role="contentinfo">
    <div class="wrap">
      <div class="grid cols-2">
        <div>
          <strong>${SITE_NAME}</strong><br/>
          <span class="small muted">© ${y} Gyomu Kaizen LLC (仮)</span>
        </div>
        <div class="small muted" style="text-align:right">
          <a href="privacy.html">プライバシー</a> ／
          <a href="sitemap.xml">サイトマップ</a>
        </div>
      </div>
    </div>
  </footer>`;
}
(function mountChrome(){
  const h=document.getElementById("site-header");
  const f=document.getElementById("site-footer");
  if(h) h.innerHTML = renderHeader();
  if(f) f.innerHTML = renderFooter();
})();

// ---- スムーススクロール ----
document.addEventListener("click", (e)=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a) return;
  const id=a.getAttribute('href');
  if(id.length>1){
    const el=document.querySelector(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
  }
});

// ---- mailto 生成（問い合わせ/応募 共通） ----
function handleMailto(form, subjectPrefix){
  const fd=new FormData(form);
  const name=fd.get('name')||'';
  const email=fd.get('email')||'';
  const body= (fd.get('message')||fd.get('skills')||'').toString();
  const hours=(fd.get('hours')||'').toString();
  const subject = encodeURIComponent(`${subjectPrefix} ${name} 様`);
  const lines = [
    `お名前: ${name}`,
    `メール: ${email}`,
    hours ? `稼働: ${hours}` : null,
    '',
    '--- 本文 ---',
    body
  ].filter(Boolean).join('%0D%0A');
  return {subject, body: lines};
}
window.mountContactForm = function(formId, statusId, toRecruit=false){
  const form=document.getElementById(formId);
  const status=document.getElementById(statusId);
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    try{
      const {subject, body} = handleMailto(form, toRecruit ? '【業務委託 応募】' : '【お問い合わせ】');
      const to = toRecruit ? RECRUIT_EMAIL : CONTACT_EMAIL;
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      if(status){ status.textContent='メール作成画面を開きました。送信を完了してください。'; status.className='small ok'; }
    }catch(err){
      if(status){ status.textContent='送信準備に失敗しました。メールで直接ご連絡ください。'; status.className='small error'; }
    }
  });
}
