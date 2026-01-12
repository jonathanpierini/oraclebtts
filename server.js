const express = require("express");
const Stripe = require("stripe");

const app = express();

// ✅ Stripe client (serve la secret key)
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ✅ Webhook: qui serve RAW body (non json)
app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("❌ Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Evento ricevuto
    console.log("✅ Stripe event:", event.type);

    // TODO: qui dopo ci mettiamo la logica (es: attivare abbonamento)
    return res.json({ received: true });
  }
);

// Per le altre route puoi usare JSON normalmente
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server attivo ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
