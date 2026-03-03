
const { layout, pick, esc } = require("./_shared");

async function getSite(env){ const raw=await env.CONTENT.get("site"); return raw?JSON.parse(raw):null; }
async function getCountries(env){ const raw=await env.CONTENT.get("countries"); return raw?JSON.parse(raw):[]; }

function section(id, inner){ return `<section class="section" id="${id}"><div class="container">${inner}</div></section>`; }

function homeBody({lang, site, countries}){
  const hero = site.home?.hero?.[lang] || site.home?.hero?.ro || {};
  const cta = site.cta?.[lang] || site.cta?.ro || {};
  const wa = site.contact?.whatsapp || site.contact?.phone || "";
  const phone = site.contact?.phone || "";
  const email = site.contact?.email || "";
  const waLink = wa ? `https://wa.me/${wa.replace(/[^\d]/g,"")}` : "#";
  const vb = site.contact?.viber || phone || "";
  const vbLink = vb ? `viber://chat?number=${vb.replace(/[^\d+]/g,"")}` : "#";

  const heroHtml = `
  <section class="hero">
    <div class="container hero-inner">
      <div class="kicker"><span class="dot"></span><span>${esc(hero.kicker||"")}</span><span class="pill">${esc(hero.badge||"")}</span></div>
      <h1 class="h1">${esc(hero.title||"")}</h1>
      <p class="sub">${esc(hero.subtitle||"")}</p>
      <div class="cta">
        <a class="btn primary" href="${esc(waLink)}" target="_blank" rel="noopener">${esc(cta.primary||"Contact")}</a>
        <a class="btn" href="#services">${esc(cta.secondary||"Servicii")}</a>
        <a class="btn ghost" href="#contact">${esc(cta.booking||"Programare")}</a>
      </div>
    </div>
  </section>`;

  const about = section("about", `
    <div class="card grid2">
      <div class="pad">
        <div class="head"><h2>${esc(pick({ro:"Despre",ru:"Обо мне",en:"About"}, lang))}</h2></div>
        <p class="muted">${esc(pick(site.home?.about?.text || {ro:"",ru:"",en:""}, lang))}</p>
        <ul class="list">${(site.home?.about?.bullets?.[lang]||site.home?.about?.bullets?.ro||[]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      </div>
      <div class="media"><img src="/images/photo-01-portrait.webp" alt=""><div class="media-overlay"><div class="media-title">${esc(site.brand||"")}</div><div class="media-sub">${esc(site.tagline||"")}</div></div></div>
    </div>
  `);

  const services = site.home?.services || {};
  const servicesHtml = section("services", `
    <div class="head"><h2>${esc(pick(services.title||{ro:"Servicii",ru:"Услуги",en:"Services"}, lang))}</h2>
    <p class="muted">${esc(pick(services.subtitle||{ro:"",ru:"",en:""}, lang))}</p></div>
    <div class="cardgrid">
      ${(services.items||[]).map(it=>`
      <div class="card">
        <div class="thumb"><img src="${esc(it.image||"")}" alt=""></div>
        <div class="pad">
          <h3>${esc(pick(it.title, lang))}</h3>
          <p class="muted">${esc(pick(it.text, lang))}</p>
          <div class="btnbar" style="margin-top:10px">
            <a class="btn small" href="${esc(waLink)}" target="_blank" rel="noopener">WhatsApp</a>
            <a class="btn small" href="${esc(vbLink)}">Viber</a>
          </div>
        </div>
      </div>`).join("")}
    </div>
  `);

  const fees = site.home?.fees || {};
  const feesHtml = section("fees", `
    <div class="card pad">
      <div class="head"><h2>${esc(pick(fees.title||{ro:"Onorarii",ru:"Гонорары",en:"Fees"}, lang))}</h2>
      <p class="muted">${esc(pick(fees.text||{ro:"",ru:"",en:""}, lang))}</p></div>
      <div class="pricing">${(fees.cards||[]).map(c=>`
        <div class="price">
          <div class="price-title">${esc(pick(c.title, lang))}</div>
          <div class="price-val">${esc(pick(c.value, lang))}</div>
          <div class="price-sub">${esc(pick(c.sub, lang))}</div>
        </div>`).join("")}</div>
    </div>
  `);

  const faq = site.home?.faq || {};
  const faqHtml = section("faq", `
    <div class="head"><h2>${esc(pick(faq.title||{ro:"FAQ",ru:"FAQ",en:"FAQ"}, lang))}</h2>
    <p class="muted">${esc(pick(faq.subtitle||{ro:"",ru:"",en:""}, lang))}</p></div>
    <div class="faq">${(faq.items||[]).map(it=>`
      <details class="faq-item"><summary>${esc(pick(it.q, lang))}</summary><div class="faq-body">${esc(pick(it.a, lang))}</div></details>`).join("")}</div>
  `);

  const diasporaHtml = section("diaspora", `
    <div class="head"><h2>${esc(pick({ro:"Diaspora",ru:"Диаспора",en:"Diaspora"}, lang))}</h2>
    <p class="muted">${esc(pick({ro:"Alege țara pentru ghid dedicat.",ru:"Выберите страну.",en:"Choose a country."}, lang))}</p></div>
    <div class="cardgrid">
      ${countries.map(c=>`
        <a class="card" href="/${lang}/diaspora/${esc(c.slug)}">
          <div class="thumb"><img src="${esc(c.image||"")}" alt=""></div>
          <div class="pad"><h3>${esc(pick(c.title, lang)).toUpperCase()}</h3><p class="muted">${esc(pick(c.card, lang))}</p></div>
        </a>`).join("")}
    </div>
    <div style="margin-top:12px"><a class="btn" href="/${lang}/diaspora">${esc(pick({ro:"Vezi toate țările",ru:"Все страны",en:"All countries"}, lang))}</a></div>
  `);

  const gal = site.home?.gallery || {};
  const galleryHtml = section("gallery", `
    <div class="head"><h2>${esc(pick(gal.title||{ro:"Galerie",ru:"Галерея",en:"Gallery"}, lang))}</h2>
    <p class="muted">${esc(pick(gal.subtitle||{ro:"",ru:"",en:""}, lang))}</p></div>
    <div class="gallery" id="galleryGrid">${(gal.items||[]).map(src=>`<a href="${esc(src)}"><img src="${esc(src)}" alt=""></a>`).join("")}</div>
    <div class="lightbox" id="lightbox"><button class="lb-close" id="lbClose">×</button><img id="lbImg" src=""></div>
    <script>
      const grid=document.getElementById('galleryGrid');const lb=document.getElementById('lightbox');const lbImg=document.getElementById('lbImg');const close=document.getElementById('lbClose');
      grid?.querySelectorAll('a').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();lbImg.src=a.getAttribute('href');lb.classList.add('open');}));
      close?.addEventListener('click',()=>lb.classList.remove('open'));
      lb?.addEventListener('click',(e)=>{if(e.target===lb) lb.classList.remove('open');});
    </script>
  `);

  const contactHtml = section("contact", `
    <div class="card pad">
      <h2>${esc(pick({ro:"Contact",ru:"Контакты",en:"Contact"}, lang))}</h2>
      <div class="contact-grid">
        <div class="contact-item"><div class="contact-title">WhatsApp</div><a class="contact-val" href="${esc(waLink)}" target="_blank" rel="noopener">${esc(phone)}</a></div>
        <div class="contact-item"><div class="contact-title">Viber</div><a class="contact-val" href="${esc(vbLink)}">${esc(phone)}</a></div>
        <div class="contact-item"><div class="contact-title">Email</div><a class="contact-val" href="mailto:${esc(email)}">${esc(email)}</a></div>
      </div>
    </div>
    <footer class="footer"><div class="container foot"><div>© <span class="gold">${esc(site.brand||"")}</span></div><div>${esc(site.tagline||"")}</div></div></footer>
  `);

  return heroHtml + about + servicesHtml + feesHtml + faqHtml + diasporaHtml + galleryHtml + contactHtml;
}

async function handle({env, lang, path}){
  const site = await getSite(env) || {};
  // seed minimal about if missing
  site.home = site.home || {};
  site.home.about = site.home.about || { text:{ro:"",ru:"",en:""}, bullets:{ro:[],ru:[],en:[]} };
  const countries = await getCountries(env);
  const body = homeBody({lang, site, countries});
  return layout({ title: site.brand || "Avocat Viorel Dodan", lang, site, body, path });
}
module.exports = { handle };
