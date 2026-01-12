const express = require("express");

const app = express();

// 1) Health check
app.get("/", (req, res) => {
  res.send("Server attivo 🚀");
});

// 2) Webhook Stripe (per ora solo test: log + 200)
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    console.log("✅ Webhook ricevuto");
    console.log("Headers stripe-signature:", req.headers["stripe-signature"]);
    console.log("Body (raw):", req.body?.toString?.("utf8"));

    // Stripe vuole sempre una risposta 2xx veloce
    res.status(200).send("ok");
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
