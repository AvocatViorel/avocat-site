export async function onRequest({ env, request }){
  const origin = new URL(request.url).origin;
  const countries = JSON.parse((await env.CONTENT.get("countries")) || "[]");
  const articles = JSON.parse((await env.CONTENT.get("articles")) || "[]");
  const urls = new Set(["/","/ro","/ru","/en","/ro/diaspora","/ru/diaspora","/en/diaspora","/ro/articole","/ru/articole","/en/articole"]);
  for(const c of countries){ urls.add(`/ro/diaspora/${c.slug}`); urls.add(`/ru/diaspora/${c.slug}`); urls.add(`/en/diaspora/${c.slug}`); }
  for(const a of articles){ urls.add(`/ro/articole/${a.slug}`); urls.add(`/ru/articole/${a.slug}`); urls.add(`/en/articole/${a.slug}`); }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Array.from(urls).map(u=>`  <url><loc>${origin}${u}</loc></url>`).join("\n")}\n</urlset>`;
  return new Response(xml, { headers: { "content-type":"application/xml; charset=utf-8" }});
}
