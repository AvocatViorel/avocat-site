import { DEFAULT_SITE, nowYear } from "../defaults.js";
import { keyFor, kvGetJSON, json } from "./kv.js";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const lang = (url.searchParams.get("lang") || "ro").toLowerCase();

  const kv = env.CONTENT;
  const key = keyFor("site", lang);
  const stored = kv ? await kvGetJSON(kv, key) : null;
  const fallback = DEFAULT_SITE[lang] || DEFAULT_SITE.ro;
  const site = stored || fallback;

  const year = nowYear();
  const strings = { ...(site.strings || {}) };
  strings.footer = `© ${year} ${strings.brandLine || "Avocat Viorel Dodan"}.`;

  return json({ ...site, strings });
}
