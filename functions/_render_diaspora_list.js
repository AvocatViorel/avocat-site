import { layout, pick, esc, kvGet } from "./_shared";
export async function renderDiasporaList(env, lang){
  const site = await kvGet(env,"site",{});
  const countries = await kvGet(env,"countries",[]);
  const title = pick({ro:"Diaspora",ru:"Диаспора",en:"Diaspora"}, lang);
  const body = `<section class="hero minihero"><div class="container hero-inner">
    <div class="kicker"><span class="dot"></span><span class="pill">${esc(title)}</span></div>
    <h1 class="h1">${esc(pick({ro:"30 țări — ghiduri dedicate",ru:"30 стран — отдельные гиды",en:"30 countries — guides"}, lang))}</h1>
    <p class="sub">${esc(pick({ro:"Alege țara și intră pe pagina completă.",ru:"Выберите страну.",en:"Choose a country."}, lang))}</p>
  </div></section>
  <section class="section"><div class="container"><div class="cardgrid">
    ${countries.map(c=>`<a class="card" href="/${lang}/diaspora/${esc(c.slug)}">
      <div class="thumb"><img src="${esc(c.image||"")}" alt=""></div>
      <div class="pad"><h3>${esc(pick(c.title, lang)).toUpperCase()}</h3><p class="muted">${esc(pick(c.card, lang))}</p></div>
    </a>`).join("")}
  </div></div></section>`;
  return layout({ title, lang, site, body, path:"/diaspora" });
}
