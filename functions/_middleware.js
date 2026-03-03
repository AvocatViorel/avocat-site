export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const isAdmin = url.pathname.startsWith("/admin");
  const isApi = url.pathname.startsWith("/api");
  if (isAdmin || isApi) {
    const auth = request.headers.get("Authorization") || "";
    const ok = checkBasicAuth(auth, env.ADMIN_USER, env.ADMIN_PASS);
    if (!ok) return new Response("Auth required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Admin"' } });
  }
  return next();
}
function checkBasicAuth(header, user, pass) {
  if (!user || !pass) return false;
  if (!header.startsWith("Basic ")) return false;
  try {
    const raw = atob(header.slice(6));
    const [u,p] = raw.split(":");
    return u===user && p===pass;
  } catch { return false; }
}
