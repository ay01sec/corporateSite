const SITE_NAME = "業務改善屋さん";
const CONTACT_EMAIL = "y_akagi@improve-biz.com"; // ←実アドレスに変更
const RECRUIT_EMAIL = "y_akagi@improve-biz.com"; // ←実アドレスに変更

// ---- ヘッダーHTML（レスポンシブ） ----
function renderHeader(){
  return `
  <header>
    <nav class="nav" aria-label="グローバル">
      <div class="brand">
        <a href="/index.html" aria-label="${SITE_NAME} トップへ">
          <img class="brand-logo" src="assets/logo_source.png" alt="" aria-hidden="true" />
          <span class="brand-text">${SITE_NAME}</span>
        </a>
      </div>

      <button class="nav-toggle" aria-label="メニューを開く" aria-expanded="false" aria-controls="global-nav">
        <span class="nav-toggle-bar" aria-hidden="true"></span>
        <span class="nav-toggle-bar" aria-hidden="true"></span>
        <span class="nav-toggle-bar" aria-hidden="true"></span>
      </button>

      <div id="global-nav" class="nav-links">
        <a href="/index.html">ホーム</a>
        <a href="/services.html">サービス</a>
        <a href="/works.html">実績</a>
        <a href="/pricing.html">料金/FAQ</a>
        <a href="/company.html">会社情報</a>
        <a href="/recruit.html">求人</a>
        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfd5kkdbHRSh6pSzi-ccTw8eQaxFCvL4S5npUwi79jR6Eznkw/viewform?usp=header" class="btn">無料ヒアリングを依頼</a>
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
          <a href="/privacy.html">プライバシー</a> ／
          <a href="/sitemap.xml">サイトマップ</a>
        </div>
      </div>
    </div>
  </footer>`;
}

// マウント
(function mountChrome(){
  const h=document.getElementById("site-header");
  const f=document.getElementById("site-footer");
  if(h) h.innerHTML = renderHeader();
  if(f) f.innerHTML = renderFooter();
  setupNavToggle();
  setActiveNav();
})();

// スムーススクロール（#アンカー）
document.addEventListener("click", (e)=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a) return;
  const id=a.getAttribute('href');
  if(id.length>1){
    const el=document.querySelector(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
  }
});

// mailto 生成（問い合わせ/応募 共通）
function handleMailto(form, subjectPrefix){
  const fd=new FormData(form);
  const name=fd.get('name')||'';
  const email=fd.get('email')||'';
  const body=(fd.get('message')||fd.get('skills')||'').toString();
  const hours=(fd.get('hours')||'').toString();
  const subject = encodeURIComponent(`${subjectPrefix} ${name} 様`);
  const lines=[
    `お名前: ${name}`,
    `メール: ${email}`,
    hours ? `稼働: ${hours}` : null,
    '',
    '--- 本文 ---',
    body
  ].filter(Boolean).join('%0D%0A');
  return {subject, body: lines};
}
window.mountContactForm=function(formId,statusId,toRecruit=false){
  const form=document.getElementById(formId);
  const status=document.getElementById(statusId);
  if(!form) return;
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    try{
      const {subject, body}=handleMailto(form, toRecruit ? '【業務委託 応募】':'【お問い合わせ】');
      const to = toRecruit ? RECRUIT_EMAIL : CONTACT_EMAIL;
      window.location.href=`mailto:${to}?subject=${subject}&body=${body}`;
      if(status){ status.textContent='メール作成画面を開きました。送信を完了してください。'; status.className='small ok';}
    }catch(err){
      if(status){ status.textContent='送信準備に失敗しました。メールで直接ご連絡ください。'; status.className='small error';}
    }
  });
}

// 現在ページのナビを強調
function setActiveNav(){
  const path = location.pathname.replace(/\/+$/,'') || '/index.html';
  document.querySelectorAll('header nav a[href]').forEach(a=>{
    const href=a.getAttribute('href'); if(!href) return;
    const normalized = href==='/'?'/index.html':href;
    if (normalized === path) {
      a.setAttribute('aria-current','page');
      a.style.fontWeight='700';
      a.style.textDecoration='underline';
    }
  });
}

// ハンバーガー開閉
function setupNavToggle(){
  const toggle=document.querySelector('.nav-toggle');
  const menu=document.getElementById('global-nav');
  if(!toggle || !menu) return;

  const closeMenu=()=>{ toggle.setAttribute('aria-expanded','false'); menu.classList.remove('open');}
  const openMenu =()=>{ toggle.setAttribute('aria-expanded','true'); menu.classList.add('open');}

  toggle.addEventListener('click',()=>{
    const expanded = toggle.getAttribute('aria-expanded')==='true';
    expanded ? closeMenu() : openMenu();
  });

  // 外側クリックで閉じる
  document.addEventListener('click',(e)=>{
    const isInside = e.target.closest('.nav') || e.target.closest('.nav-toggle');
    if(!isInside && menu.classList.contains('open')) closeMenu();
  });

  // Escで閉じる
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape' && menu.classList.contains('open')) closeMenu();
  });

  // メニュー内リンククリックで閉じる
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMenu));
}
