const { handle } = require('../../_country');
export async function onRequest({ env, params }){
  const res = await handle({ env, lang: 'ru', slug: params.slug, path: '/diaspora/' + params.slug });
  if (res instanceof Response) return res;
  return new Response(res, { headers: { 'content-type':'text/html; charset=utf-8' } });
}
