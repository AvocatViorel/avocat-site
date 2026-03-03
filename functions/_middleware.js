export async function onRequest(context) {
  const { request, next } = context;

  const url = new URL(request.url);

  // Protejăm doar /admin
  if (url.pathname.startsWith("/admin")) {

    const auth = request.headers.get("Authorization");

    const USER = "viorel";
    const PASS = "parazit23@";

    const valid = "Basic " + btoa(`${USER}:${PASS}`);

    if (auth !== valid) {
      return new Response("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Area"',
        },
      });
    }
  }

  return next();
}
