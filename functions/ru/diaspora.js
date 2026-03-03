const { handle } = require('../_diaspora_list');
export async function onRequest({ env }){
  const html = await handle({ env, lang: 'ru', path: '/diaspora' });
  return new Response(html, { headers: { 'content-type':'text/html; charset=utf-8' } });
}
