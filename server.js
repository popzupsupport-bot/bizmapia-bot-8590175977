const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

app.get('/', (req, res) => res.send('BizMapia Bot Live - Kochi'));

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body || "Hi";
      console.log(`From ${from}: ${text}`);

      // Reply logic for BizMapia
      let reply = `Hello! 👋 Welcome to BizMapia!\n\nYou said: "${text}"\n\nWe are Kerala's business directory. How can I help you find businesses today?`;

      if (text.toLowerCase().includes("hi") || text.toLowerCase().includes("hello")) {
        reply = `Hi! 👋 This is BizMapia - Kochi's Business Hub.\n\nTell me what you need:\n1. Find a business\n2. List your business\n3. Support`;
      }

      await axios.post(
        `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply }
        },
        {
          headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
        }
      );
      console.log("Replied to", from);
    }
    res.sendStatus(200);
  } catch (e) {
    console.error("Error:", e.response?.data || e.message);
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Bot running on ${PORT}`));
