
const { layout, pick, esc } = require("./_shared");
async function getSite(env){ const raw=await env.CONTENT.get("site"); return raw?JSON.parse(raw):null; }
async function getArticles(env){ const raw=await env.CONTENT.get("articles"); return raw?JSON.parse(raw):[]; }
async function handle({env, lang, path}){
  const site = await getSite(env) || {};
  const arts = await getArticles(env);
  const title = pick({ro:"Articole",ru:"Статьи",en:"Articles"}, lang);
  const body = `
    <section class="hero minihero"><div class="container hero-inner">
      <div class="kicker"><span class="dot"></span><span class="pill">${esc(title)}</span></div>
      <h1 class="h1">${esc(title)}</h1>
      <p class="sub">${esc(pick({ro:"Ghiduri și explicații juridice.",ru:"Юридические гиды.",en:"Legal guides."}, lang))}</p>
    </div></section>
    <section class="section"><div class="container"><div class="cardgrid">
      ${arts.map(a=>`
        <a class="card" href="/${lang}/articole/${esc(a.slug)}">
          <div class="thumb"><img src="${esc(a.image||"/images/photo-04-card.webp")}" alt=""></div>
          <div class="pad"><h3>${esc(pick(a.title, lang)||a.slug)}</h3><p class="muted">${esc(pick(a.excerpt, lang)||"")}</p></div>
        </a>`).join("")}
    </div></div></section>`;
  return layout({ title, lang, site, body, path });
}
module.exports = { handle };
