
export function esc(s){return String(s||"").replace(/[&<>"']/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));}
export function pick(obj, lang){ if(!obj) return ""; if(typeof obj==="string") return obj; return obj[lang]||obj.ro||obj.ru||obj.en||""; }
export async function kvGet(env, key, fallback){ 
  try{ if(!env || !env.CONTENT) return fallback; const raw = await env.CONTENT.get(key); return raw ? JSON.parse(raw) : fallback; }
  catch{ return fallback; }
}
export async function kvPut(env, key, value){ if(!env || !env.CONTENT) throw new Error("KV binding CONTENT lipsește."); await env.CONTENT.put(key, JSON.stringify(value)); }
export function layout({title, lang, site, body, path}){
  const brand = site.brand || "Avocat Viorel Dodan";
  const tagline = site.tagline || "";
  const desc = pick(site.home?.hero?.[lang]?.subtitle || site.home?.hero?.ro?.subtitle || "", lang) || "Servicii juridice Chișinău / Moldova / Diaspora";
  const canonical = (site.contact?.website || "https://avocat.vioreldodan.com").replace(/\/$/,"") + (path||"/");
  const ogImg = "/images/photo-01-wide.webp";
  const nav = {"ro": {"about": "Despre", "services": "Servicii", "fees": "Onorarii", "diaspora": "Diaspora", "gallery": "Galerie", "contact": "Contact"}, "ru": {"about": "Обо мне", "services": "Услуги", "fees": "Гонорары", "diaspora": "Диаспора", "gallery": "Галерея", "contact": "Контакты"}, "en": {"about": "About", "services": "Services", "fees": "Fees", "diaspora": "Diaspora", "gallery": "Gallery", "contact": "Contact"}}[lang];
  const langBtns = `
    <div class="lang">
      <a class="langbtn ${lang==="ro"?"active":""}" href="/ro${path==="/"?"":path}">RO</a>
      <a class="langbtn ${lang==="ru"?"active":""}" href="/ru${path==="/"?"":path}">RU</a>
      <a class="langbtn ${lang==="en"?"active":""}" href="/en${path==="/"?"":path}">EN</a>
    </div>`;
  const phone = site.contact?.phone || "";
  const email = site.contact?.email || "";
  const wa = site.contact?.whatsapp || phone || "";
  const vb = site.contact?.viber || phone || "";
  const waLink = wa ? `https://wa.me/${wa.replace(/[^\d]/g,"")}` : "#";
  const vbLink = vb ? `viber://chat?number=${vb.replace(/[^\d+]/g,"")}` : "#";
  return `<!doctype html><html lang="${lang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — ${esc(brand)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)} — ${esc(brand)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(ogImg)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/assets/styles.css">
</head><body>
<header class="topbar" id="topbar"><div class="container nav">
<a class="brand" href="/${lang}"><div class="logo">VD</div><div class="brandtext"><div class="name">${esc(brand)}</div><div class="tag">${esc(tagline)}</div></div></a>
<nav class="menu">
  <a href="/${lang}/#about">${esc(nav.about)}</a>
  <a href="/${lang}/#services">${esc(nav.services)}</a>
  <a href="/${lang}/#fees">${esc(nav.fees)}</a>
  <a href="/${lang}/#faq">FAQ</a>
  <a href="/${lang}/diaspora">${esc(nav.diaspora)}</a>
  <a href="/${lang}/#gallery">${esc(nav.gallery)}</a>
  <a href="/${lang}/#contact">${esc(nav.contact)}</a>
</nav>
${langBtns}
</div></header>
${body}
<div class="floatbar">
  <a class="fab" href="${esc(waLink)}" target="_blank" rel="noopener"><strong>WhatsApp</strong><span class="small">${esc(phone)}</span></a>
  <a class="fab" href="${esc(vbLink)}"><strong>Viber</strong><span class="small">${esc(phone)}</span></a>
  <a class="fab" href="mailto:${esc(email)}"><strong>Email</strong><span class="small">${esc(email)}</span></a>
</div>
<script>const tb=document.getElementById('topbar');addEventListener('scroll',()=>{if(scrollY>12)tb.classList.add('scrolled');else tb.classList.remove('scrolled');});</script>
</body></html>`;
}
