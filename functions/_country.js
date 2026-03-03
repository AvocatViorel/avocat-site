
const { layout, pick, esc } = require("./_shared");
async function getSite(env){ const raw=await env.CONTENT.get("site"); return raw?JSON.parse(raw):null; }
async function getCountries(env){ const raw=await env.CONTENT.get("countries"); return raw?JSON.parse(raw):[]; }
function renderBlocks(blocks){
  return (blocks||[]).map(b=>`
    <div class="hr"></div>
    <h2>${esc(b.title||"")}</h2>
    <div class="muted" style="white-space:pre-wrap;line-height:1.75">${esc(b.body||"")}</div>
    ${Array.isArray(b.bullets)&&b.bullets.length?`<ul class="list">${b.bullets.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
  `).join("");
}
async function handle({env, lang, slug, path}){
  const site = await getSite(env) || {};
  const countries = await getCountries(env);
  const c = countries.find(x => (x.slug||"") === slug);
  if (!c) return new Response("Not found", { status: 404 });
  const page = c.page?.[lang] || c.page?.ro || {};
  const title = pick(c.title, lang) || slug;
  const phone = site.contact?.phone || "";
  const wa = site.contact?.whatsapp || phone || "";
  const vb = site.contact?.viber || phone || "";
  const waLink = wa ? `https://wa.me/${wa.replace(/[^\d]/g,"")}` : "#";
  const vbLink = vb ? `viber://chat?number=${vb.replace(/[^\d+]/g,"")}` : "#";
  const body = `
    <section class="hero minihero"><div class="container hero-inner">
      <div class="kicker"><span class="dot"></span><a class="pill" href="/${lang}/diaspora">${esc(pick({ro:"Diaspora",ru:"Диаспора",en:"Diaspora"}, lang))}</a><span class="pill">${esc(title)}</span></div>
      <h1 class="h1">${esc(page.h1 || (title + " — Diaspora"))}</h1>
      <p class="sub">${esc(page.lead || pick(c.card, lang) || "")}</p>
    </div></section>
    <section class="section"><div class="container"><div class="card pad">
      <div class="media" style="min-height:280px;border-radius:18px;overflow:hidden;border:1px solid var(--line)"><img src="${esc(c.image||"")}" alt=""></div>
      ${renderBlocks(page.blocks)}
      <div class="hr"></div>
      <h2>${esc(pick({ro:"Contact rapid",ru:"Быстрый контакт",en:"Quick contact"}, lang))}</h2>
      <div class="contact-grid">
        <div class="contact-item"><div class="contact-title">WhatsApp</div><a class="contact-val" href="${esc(waLink)}" target="_blank" rel="noopener">${esc(phone)}</a></div>
        <div class="contact-item"><div class="contact-title">Viber</div><a class="contact-val" href="${esc(vbLink)}">${esc(phone)}</a></div>
        <div class="contact-item"><div class="contact-title">Email</div><a class="contact-val" href="mailto:${esc(site.contact?.email||"")}">${esc(site.contact?.email||"")}</a></div>
      </div>
    </div></div></section>`;
  return layout({ title, lang, site, body, path });
}
module.exports = { handle };
