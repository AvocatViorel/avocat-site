export function keyFor(type, lang){
  if(type === "site") return `site:${lang}`;
  if(type === "services") return "services";
  if(type === "pricing") return "pricing";
  if(type === "faq") return "faq";
  if(type === "countries") return "countries";
  if(type === "articles") return "articles";
  throw new Error("Unknown type");
}

export async function kvGetJSON(kv, key){
  const v = await kv.get(key);
  if(!v) return null;
  try { return JSON.parse(v); } catch(e){ return null; }
}

export async function kvPutJSON(kv, key, data){
  await kv.put(key, JSON.stringify(data));
}

export function corsHeaders(request, env){
  const allow = env.ALLOW_ORIGIN || "*";
  return {
    "access-control-allow-origin": allow,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    "vary": "origin",
  };
}

export function json(data, extraHeaders={}){
  return new Response(JSON.stringify(data), {
    headers: { "content-type":"application/json; charset=utf-8", "cache-control":"no-store", ...extraHeaders }
  });
}
