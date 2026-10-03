const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia_verify_2024';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // your permanent token
const PORT = process.env.PORT || 10000;

app.get('/webhook', (req, res) => {
  console.log(`VERIFY ATTEMPT: ${req.query['hub.verify_token']}`);
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log('WEBHOOK VERIFIED');
    return res.send(req.query['hub.challenge']);
  }
  res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  console.log('INCOMING', JSON.stringify(req.body));
  res.sendStatus(200); // ACK immediately so Meta doesn't retry

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    
    // --- IGNORE META TEST PAYLOAD ---
    const phone_number_id = value?.metadata?.phone_number_id;
    const display_number = value?.metadata?.display_phone_number;
    if (!phone_number_id || phone_number_id === '123456123' || display_number === '16505551111') {
      console.log('Ignoring test webhook, not replying');
      return;
    }

    const message = value?.messages?.[0];
    if (!message) return;

    const from = message.from;
    const text = message.text?.body || '';

    console.log(`Real message from ${from}: ${text}`);

    // Your bot reply logic here
    const replyText = `Hi! You said: ${text} - Bizmapia bot is live!`;

    await axios.post(
      `https://graph.facebook.com/v20.0/${phone_number_id}/messages`,
      {
        messaging_product: 'whatsapp',
        to: from,
        text: { body: replyText }
      },
      {
        headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
      }
    );
    console.log(`REPLIED to ${from}`);

  } catch (e) {
    console.error('POST ERROR', e.response?.data || e.message);
  }
});

app.get('/', (req, res) => res.send('Bot running'));

app.listen(PORT, () => console.log(`Server running on ${PORT} - NEW CODE 2020-10-03T18:40:30Z`));
