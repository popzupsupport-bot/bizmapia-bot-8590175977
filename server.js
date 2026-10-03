const express = require('express');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia_verify_2024';

app.get('/', (req,res)=> res.send('OK - Bot Running'));

app.get('/webhook', (req,res)=>{
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  console.log('VERIFY ATTEMPT:', token);
  if(mode === 'subscribe' && token === VERIFY_TOKEN){
    console.log('WEBHOOK VERIFIED');
    return res.status(200).send(challenge);
  }else{
    console.log('VERIFY FAILED - Expected:', VERIFY_TOKEN, 'Got:', token);
    return res.sendStatus(403);
  }
});

app.post('/webhook', async (req,res)=>{
  try{
    console.log('INCOMING:', JSON.stringify(req.body).substring(0,500));
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const msg = value?.messages?.[0];
    if(msg){
      const from = msg.from;
      const phoneId = value.metadata.phone_number_id;
      const token = process.env.WHATSAPP_TOKEN;
      await require('axios').post(`https://graph.facebook.com/v20.0/${phoneId}/messages`,{
        messaging_product:'whatsapp',
        to: from,
        text:{body:`Got it! You said: ${msg.text?.body || 'media'}\n\nBot is working now ✅`}
      },{headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'}});
      console.log('REPLY SENT to', from);
    }
    res.sendStatus(200);
  }catch(e){
    console.error('POST ERROR', e.response?.data || e.message);
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT} - NEW CODE ${new Date().toISOString()}`));
