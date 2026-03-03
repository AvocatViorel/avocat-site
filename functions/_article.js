
const { layout, pick, esc } = require("./_shared");
async function getSite(env){ const raw=await env.CONTENT.get("site"); return raw?JSON.parse(raw):null; }
async function getArticles(env){ const raw=await env.CONTENT.get("articles"); return raw?JSON.parse(raw):[]; }
async function handle({env, lang, slug, path}){
  const site = await getSite(env) || {};
  const arts = await getArticles(env);
  const a = arts.find(x => (x.slug||"") === slug);
  if (!a) return new Response("Not found", { status: 404 });
  const title = pick(a.title, lang) || slug;
  const bodyText = pick(a.body, lang) || "";
  const body = `
    <section class="hero minihero"><div class="container hero-inner">
      <div class="kicker"><span class="dot"></span><a class="pill" href="/${lang}/articole">${esc(pick({ro:"Articole",ru:"Статьи",en:"Articles"}, lang))}</a></div>
      <h1 class="h1">${esc(title)}</h1>
      <p class="sub">${esc(pick(a.excerpt, lang)||"")}</p>
    </div></section>
    <section class="section"><div class="container"><div class="card pad">
      <div class="media" style="min-height:260px;border-radius:18px;overflow:hidden;border:1px solid var(--line)"><img src="${esc(a.image||"/images/photo-04-wide.webp")}" alt=""></div>
      <div class="hr"></div>
      <div class="muted" style="white-space:pre-wrap;line-height:1.75">${esc(bodyText)}</div>
    </div></div></section>`;
  return layout({ title, lang, site, body, path });
}
module.exports = { handle };
