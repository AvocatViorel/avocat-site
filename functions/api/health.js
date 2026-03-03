import { json } from "./kv.js";

export async function onRequest(context){
  const hasKV = !!context.env.CONTENT;
  return json({ ok: hasKV });
}
