const requestHandler = require("../server");
const crypto = require("crypto");

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function login(req, res) {
  const input = req.body && typeof req.body === "object"
    ? req.body
    : JSON.parse(String(req.body || "{}"));
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || process.env.SUPABASE_ANON_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    || "";

  if (!supabaseUrl || !supabaseKey) {
    return sendJson(res, 503, { error: "Supabase is not configured in this Vercel deployment." });
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/api_login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      payload: {
        role: input.role,
        email: input.email,
        identity: input.identity,
        passwordHash: crypto.createHash("sha256").update(String(input.password || "")).digest("hex"),
        rememberDevice: Boolean(input.rememberDevice),
      },
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return sendJson(res, response.status, { error: data.message || data.error || "Invalid login details." });
  }
  return sendJson(res, 200, data);
}

module.exports = async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const routePath = requestUrl.searchParams.get("path");
    if (req.method === "POST" && routePath === "auth/login") return await login(req, res);
    if (routePath) req.url = `/api/${routePath}`;
    return await requestHandler(req, res);
  } catch (error) {
    if (!res.headersSent) return sendJson(res, 500, { error: error.message || "Server error." });
    res.end();
  }
};
