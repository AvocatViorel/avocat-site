import { DEFAULT_ARTICLES } from "../defaults.js";
import { keyFor, kvGetJSON, json } from "./kv.js";

export async function onRequest(context){
  const kv = context.env.CONTENT;
  const stored = kv ? await kvGetJSON(kv, keyFor("articles")) : null;
  return json(stored || DEFAULT_ARTICLES);
}
