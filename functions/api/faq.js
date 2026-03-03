import { DEFAULT_FAQ } from "../defaults.js";
import { keyFor, kvGetJSON, json } from "./kv.js";

export async function onRequest(context){
  const kv = context.env.CONTENT;
  const stored = kv ? await kvGetJSON(kv, keyFor("faq")) : null;
  return json(stored || DEFAULT_FAQ);
}
