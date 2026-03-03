import { DEFAULT_SITE, DEFAULT_SERVICES, DEFAULT_PRICING, DEFAULT_FAQ, DEFAULT_COUNTRIES, DEFAULT_ARTICLES } from "../defaults.js";
import { keyFor, kvPutJSON, json } from "./kv.js";

export async function onRequest(context){
  const kv = context.env.CONTENT;
  if(!kv) return new Response("KV binding CONTENT missing", { status: 500 });

  const body = await context.request.json().catch(()=>null);
  if(!body || body.confirm !== true) return new Response("Confirm required", { status: 400 });

  for (const lang of ["ro","ru","en"]) {
    await kvPutJSON(kv, keyFor("site", lang), DEFAULT_SITE[lang]);
  }
  await kvPutJSON(kv, keyFor("services"), DEFAULT_SERVICES);
  await kvPutJSON(kv, keyFor("pricing"), DEFAULT_PRICING);
  await kvPutJSON(kv, keyFor("faq"), DEFAULT_FAQ);
  await kvPutJSON(kv, keyFor("countries"), DEFAULT_COUNTRIES);
  await kvPutJSON(kv, keyFor("articles"), DEFAULT_ARTICLES);

  return json({ ok:true, reset:true });
}
