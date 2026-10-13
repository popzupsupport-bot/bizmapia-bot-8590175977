const express=require('express');const axios=require('axios');const app=express();app.use(express.json());
const VERIFY_TOKEN=process.env.VERIFY_TOKEN||"bizmapia123";const TOKEN=process.env.WHATSAPP_TOKEN;const PID=process.env.PHONE_NUMBER_ID;
app.get('/',(r,s)=>s.send('TEMPLATE TEST'));
app.get('/webhook',(q,r)=>{if(q.query['hub.mode']==='subscribe'&&q.query['hub.verify_token']===VERIFY_TOKEN)return r.status(200).send(q.query['hub.challenge']);r.sendStatus(403);});
app.post('/webhook',async(req,res)=>{
 try{
  const msg=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]; if(!msg) return res.sendStatus(200);
  const from=msg.from; let to=from.replace(/\D/g,""); if(to.length===10) to="91"+to;
  console.log(`[IN] ${from}`);
  const url=`https://graph.facebook.com/v20.0/${PID}/messages`; const h={Authorization:`Bearer ${TOKEN}`,"Content-Type":"application/json"};
  // Try template hello_world
  const body={messaging_product:"whatsapp",to, type:"template", template:{name:"hello_world", language:{code:"en_US"}}};
  const r=await axios.post(url,body,{headers:h});
  console.log(`[TEMPLATE OUT OK] ${r.data.messages[0].id} to ${to}`);
 }catch(e){console.error("[TEMPLATE FAIL]",JSON.stringify(e.response?.data||e.message));}
 res.sendStatus(200);
});
app.listen(process.env.PORT||10000,'0.0.0.0',()=>console.log('TEMPLATE TEST'));
