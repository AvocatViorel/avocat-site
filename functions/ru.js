const { handle } = require('./_home');
export async function onRequest({ env }){
  const html = await handle({ env, lang: 'ru', path: '/' });
  return new Response(html, { headers: { 'content-type':'text/html; charset=utf-8' } });
}
