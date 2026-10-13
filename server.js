const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

app.get('/', (req,res)=>res.send('MINIMAL TEST LIVE'));
app.get('/webhook',(req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']);
  res.sendStatus(403);
});

app.post('/webhook', async (req,res)=>{
  try{
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg) return res.sendStatus(200);
    const from = msg.from;
    const txt = msg.text?.body || msg.interactive?.button_reply?.id || "Hi";
    console.log(`[IN] from ${from} txt ${txt}`);

    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers = { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to = from.replace(/\D/g,"");
    if(to.length===10) to="91"+to;

    const body = {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: `Got your message: ${txt} at ${new Date().toLocaleTimeString()} - Bot is LIVE` }
    };

    const r = await axios.post(url, body, { headers });
    console.log(`[OUT OK] wamid ${r.data.messages?.[0]?.id} to ${to}`);
  }catch(e){
    console.error("[OUT FAIL]", JSON.stringify(e.response?.data || e.message));
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`MINIMAL on ${PORT} PHONE_ID ${PHONE_NUMBER_ID}`));
