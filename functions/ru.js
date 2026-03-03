import { renderHome } from "./_render_home";
export async function onRequest({ env }){ return new Response(await renderHome(env,"ru"), { headers: { "content-type":"text/html; charset=utf-8" } }); }
