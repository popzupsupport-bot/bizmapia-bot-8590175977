require('dotenv').config();
const express=require('express'), bodyParser=require('body-parser'), axios=require('axios');
const app=express(); app.use(bodyParser.json());
const PHONE_ID=process.env.PHONE_ID, TOKEN=process.env.PERMANENT_TOKEN;
const URL=`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;
const VERIFY=process.env.VERIFY_TOKEN;

async function send(to,txt){
 try{await axios.post(URL,{messaging_product:"whatsapp",to,type:"text",text:{body:txt}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){console.log(e.response?.data);}
}
app.get('/',(req,res)=>res.send('Bizmapia 8590175977 Bot LIVE ✅'));
app.get('/webhook',(req,res)=>{ if(req.query['hub.verify_token']==VERIFY) res.send(req.query['hub.challenge']); else res.sendStatus(403); });
app.post('/webhook', async (req,res)=>{
 const m=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]; if(!m) return res.sendStatus(200);
 const from=m.from; const text=(m.text?.body||"").toLowerCase();
 console.log(from,text);
 if(text.includes("hi")||text.includes("hello")||text=="start"||text=="a"){
   await send(from,"Welcome to Bizmapia! 🙏\n\n1. Customer App - All India Discount\n2. Driver App - Earn Daily\n3. Business\n\nReply 1 / 2 / 3");
   return res.sendStatus(200);
 }
 if(text=="1"){
   await send(from,"🚖 Customer App - Your Poster 1\nALL INDIA DISCOUNT AVAILABLE\n📲 Download: https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia\n\nType ACTIVATE");
   return res.sendStatus(200);
 }
 if(text=="2"){
   await send(from,"🚖 Driver App - Poster 2\nFare Rates All India\n\n🎁 Kerala Special: Auto 33Rs, Sedan 49Rs, Premium 49Rs\n100KM=100-250Rs Incentive\nDaily Payout | Fee 150Rs\n\n[Poster 3]\n\nType CLAIM");
   return res.sendStatus(200);
 }
 if(text.includes("claim")||text.includes("activate")){
   await send(from,"✅ Auto Approved for 8590175977!\nCustomer -> Activated List\nDriver -> Pending Verification + Free Recharge Credited!\nReminders will come 1H, 24H, 48H, 72H");
   return res.sendStatus(200);
 }
 res.sendStatus(200);
});
app.listen(process.env.PORT||3000,()=>console.log("LIVE for 8590175977"));