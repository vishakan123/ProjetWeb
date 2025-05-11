// gateway/server.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Redirige les appels API vers le backend
app.use(
  "/api",
  createProxyMiddleware({
    target: "http://progweb-backend:5000",
    changeOrigin: true,
  })
);

// Redirige tout le reste vers le frontend
app.use(
  "/",
  createProxyMiddleware({
    target: "http://progweb-frontend:3000",
    changeOrigin: true,
  })
);

app.listen(80, () => {
  console.log("🚪 Gateway running on port 80");
});
