
const { layout, pick, esc } = require("./_shared");
async function getSite(env){ const raw=await env.CONTENT.get("site"); return raw?JSON.parse(raw):null; }
async function getCountries(env){ const raw=await env.CONTENT.get("countries"); return raw?JSON.parse(raw):[]; }
async function handle({env, lang, path}){
  const site = await getSite(env) || {};
  const countries = await getCountries(env);
  const title = pick({ro:"Diaspora",ru:"Диаспора",en:"Diaspora"}, lang);
  const body = `
    <section class="hero minihero"><div class="container hero-inner">
      <div class="kicker"><span class="dot"></span><span class="pill">${esc(title)}</span></div>
      <h1 class="h1">${esc(pick({ro:"30 țări — ghiduri dedicate",ru:"30 стран — отдельные гиды",en:"30 countries — dedicated guides"}, lang))}</h1>
      <p class="sub">${esc(pick({ro:"Alege țara și intră pe pagina completă.",ru:"Выберите страну и откройте полную страницу.",en:"Choose a country and open the full page."}, lang))}</p>
    </div></section>
    <section class="section"><div class="container"><div class="cardgrid">
      ${countries.map(c=>`
        <a class="card" href="/${lang}/diaspora/${esc(c.slug)}">
          <div class="thumb"><img src="${esc(c.image||"")}" alt=""></div>
          <div class="pad"><h3>${esc(pick(c.title, lang)).toUpperCase()}</h3><p class="muted">${esc(pick(c.card, lang))}</p></div>
        </a>`).join("")}
    </div></div></section>`;
  return layout({ title, lang, site, body, path });
}
module.exports = { handle };
