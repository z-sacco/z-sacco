const requestHandler = require("../server");

module.exports = (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const routePath = requestUrl.searchParams.get("path");
  if (routePath) req.url = `/api/${routePath}`;
  return requestHandler(req, res);
};
