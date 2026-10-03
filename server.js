const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia_verify_2024';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});app.post('/webhook', async (req, res) => {
  console.log('Incoming:', JSON.stringify(req.body, null, 2));
  try {
    const entry = req.body.entry?.;
    const change = entry?.changes?.;
    const message = change?.value?.messages?.;
    if (message) {
      const from = message.from;
      const text = message.text?.body || 'Hi';
      console.log(Message from ${from}: ${text});
      await axios.post(
        https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages,
        {
          messaging_product: 'whatsapp',
          to: from,
          type: 'text',
          text: { body: Hello! You said: ${text} - Bizmapia bot LIVE for 85901 ✅ }
        },
        { headers: { 'Authorization': Bearer ${WHATSAPP_TOKEN}, 'Content-Type': 'application/json' } }
      );
      console.log('Reply sent to', from);
    }
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
  res.sendStatus(200);
});[0]app.get('/', (req, res) => res.send('Bizmapia Bot Running'));const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(Server running on ${PORT}));
