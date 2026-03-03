import { renderCountry } from "../../_render_country";
export async function onRequest({ env, params }){ return await renderCountry(env,"en",params.slug); }
