import { DEFAULT_SITE, DEFAULT_SERVICES, DEFAULT_PRICING, DEFAULT_FAQ, DEFAULT_COUNTRIES, DEFAULT_ARTICLES } from "../defaults.js";
import { keyFor, kvPutJSON, json } from "./kv.js";

export async function onRequest(context){
  const { request, env } = context;
  const kv = env.CONTENT;
  if(!kv) return new Response("KV binding CONTENT missing", { status: 500 });

  const body = await request.json().catch(()=>null);
  if(!body) return new Response("Invalid JSON", { status: 400 });

  const lang = (body.lang || "ro").toLowerCase();
  const site = body.site;
  const services = body.services;
  const pricing = body.pricing;
  const faq = body.faq;
  const countries = body.countries;
  const articles = body.articles;

  if(!site || typeof site !== "object") return new Response("Missing site", { status: 400 });
  if(!Array.isArray(services)) return new Response("services must be array", { status: 400 });
  if(!Array.isArray(pricing)) return new Response("pricing must be array", { status: 400 });
  if(!Array.isArray(faq)) return new Response("faq must be array", { status: 400 });
  if(!Array.isArray(countries)) return new Response("countries must be array", { status: 400 });
  if(!Array.isArray(articles)) return new Response("articles must be array", { status: 400 });

  const fallback = DEFAULT_SITE[lang] || DEFAULT_SITE.ro;
  const safeSite = {
    contact: { ...fallback.contact, ...(site.contact || {}) },
    strings: { ...fallback.strings, ...(site.strings || {}) }
  };

  await kvPutJSON(kv, keyFor("site", lang), safeSite);
  await kvPutJSON(kv, keyFor("services"), services.length ? services : DEFAULT_SERVICES);
  await kvPutJSON(kv, keyFor("pricing"), pricing.length ? pricing : DEFAULT_PRICING);
  await kvPutJSON(kv, keyFor("faq"), faq.length ? faq : DEFAULT_FAQ);
  await kvPutJSON(kv, keyFor("countries"), countries.length ? countries : DEFAULT_COUNTRIES);
  await kvPutJSON(kv, keyFor("articles"), articles.length ? articles : DEFAULT_ARTICLES);

  return json({ ok:true });
}
