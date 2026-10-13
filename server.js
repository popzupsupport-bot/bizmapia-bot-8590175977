// V48.8 FINAL - YOUR CODE FIXED - API 917025630644
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const RAZORPAY_ALL = "https://rzp.io/rzp/mq0zG6mS";
const MAIN_API = "917025630644";
const GENERAL_CALL = "919745226642";
const BUSINESS_CALL = "918590175977";

const LINKS = {
  welcomePoster: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  customerRidePoster: "https://i.ibb.co/204Ztdvh/204Ztdvh.jpg",
  driverPoster: "https://i.ibb.co/67jpyTSS/67jpyTSS.jpg",
  deliveryPoster: "https://i.ibb.co/kgCH9jKM/kgCH9jKM.jpg",
  businessPoster1: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  businessPoster2: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  extraPoster: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  supportPoster: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  tenderDistrict: "https://bizmapia.com/tender/district.pdf",
  videoLink: "https://youtu.be/VIDEO_ID"
};

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let userStates = {};
const processedIds = new Set();
const reminderTimers = {};
app.get('/', (req,res)=>res.status(200).send('V48.8 FIXED - '+MAIN_API+' - '+new Date().toISOString()));
app.get('/webhook',(req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']);
  res.sendStatus(403);
});

const FIRST_BRIEF = `Welcome to Bizmapia - All India, 4-in-1 Services!

Taxi & Auto Rides
Discover 10,00,000+ Local Businesses
Fast Parcel Delivery Within Hours
Book Rooms, Appointments & Movie Tickets
Explore Daily & Monthly Business Income

One App. Four Services. Pan-India!

Please select your language:`;

function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]||""; }
function formatTo(to){ let c=String(to).replace(/\D/g,""); if(c.length===10) c="91"+c; return c; }

async function sendMessage(uid, txt, btns){
  if(!btns) btns=[];
  const to=formatTo(uid);
  try{
    const url="https://graph.facebook.com/v20.0/"+PHONE_NUMBER_ID+"/messages";
    const headers={ Authorization:"Bearer "+WHATSAPP_TOKEN, "Content-Type":"application/json" };
    let resp;
    if(btns.length>0){
      const quick=btns.slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload, title:b.title.substring(0,20) } }));
      resp = await axios.post(url, { messaging_product:"whatsapp", to: to, type:"interactive", interactive:{ type:"button", body:{ text:txt.substring(0,1024) }, action:{ buttons:quick } } }, { headers: headers });
    } else {
      resp = await axios.post(url, { messaging_product:"whatsapp", to: to, type:"text", text:{ body:txt } }, { headers: headers });
    }
    const mid = resp.data && resp.data.messages && resp.data.messages[0]? resp.data.messages[0].id : "sent";
    console.log("OUT OK to "+to+" "+mid);
  }catch(e){ console.log("SEND FAIL", e.response && e.response.data? JSON.stringify(e.response.data) : e.message); }
}
async function sendImageHD(uid, imgUrl, cap, btns){
  if(!btns) btns=[];
  const to=formatTo(uid);
  try{
    const url="https://graph.facebook.com/v20.0/"+PHONE_NUMBER_ID+"/messages";
    const headers={ Authorization:"Bearer "+WHATSAPP_TOKEN, "Content-Type":"application/json" };
    console.log("TRY IMAGE to "+to);
    await axios.post(url, { messaging_product:"whatsapp", to: to, type:"image", image:{ link:imgUrl, caption:cap.substring(0,1024) } }, { headers: headers });
    console.log("OUT IMAGE OK to "+to);
    if(btns.length>0){
      setTimeout(()=>{ sendMessage(uid, "Please select your language:", btns); }, 2500);
      setTimeout(()=>{ sendMessage(uid, "Tap to select:", btns); }, 5000);
    }
  }catch(e){
    const errMsg = e.response && e.response.data && e.response.data.error && e.response.data.error.message? e.response.data.error.message : "image fail";
    console.log("IMAGE FAIL "+errMsg);
    await sendMessage(uid, cap, btns);
  }
}

function clearReminders(uid){ if(reminderTimers[uid]){ reminderTimers[uid].forEach(t=>clearTimeout(t)); delete reminderTimers[uid]; } }
function setReminders(uid,l){
  clearReminders(uid);
  const t1=setTimeout(()=>{ if(userStates[uid]) sendMessage(uid, "Still there? Please continue:", [{title:getText(l,'ride'), payload:"OPT_RIDE"}, {title:getText(l,'earn'), payload:"OPT_EARN"}]); }, 3*60*1000);
  const t2=setTimeout(()=>{ if(userStates[uid]) sendMessage(uid, "Reminder: Your Bizmapia franchise slot is waiting!", [{title:"Continue", payload:"OPT_EARN"}]); }, 10*60*1000);
  reminderTimers[uid]=[t1,t2];
}

function sendFirst(uid){
  console.log("sendFirst to "+uid);
  sendImageHD(uid, LINKS.welcomePoster, FIRST_BRIEF, [
    { title:"English", payload:"LANG_EN" },
    { title:"Hindi", payload:"LANG_HI" },
    { title:"Malayalam", payload:"LANG_ML" }
  ]);
  userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', data:{} };
  setReminders(uid,'en');
}
function sendMain(uid,l){ userStates[uid].lang=l; userStates[uid].flow='MAIN'; userStates[uid].lastStep='Main Menu'; sendMessage(uid, getText(l,'selOpt'), [{ title:getText(l,'ride'), payload:"OPT_RIDE" }, { title:getText(l,'earn'), payload:"OPT_EARN" }, { title:getText(l,'more'), payload:"OPT_MORE" }]); }
function sendMore(uid,l){ userStates[uid].lastStep='More Options'; sendMessage(uid, "More:", [{ title:getText(l,'del'), payload:"OPT_DEL" }, { title:getText(l,'book'), payload:"OPT_BOOK" }, { title:getText(l,'dir'), payload:"OPT_DIR" }]); }
function sendRide(uid,l){ userStates[uid].lastStep='Ride Selection'; sendMessage(uid, getText(l,'rideOpt'), [{ title:getText(l,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(l,'attach'), payload:"RIDE_ATTACH" }]); }
function sendCust(uid,l){ userStates[uid].lastStep='Book a Ride'; sendImageHD(uid, LINKS.customerRidePoster, getText(l,'custPost'), [{ title:getText(l,'bookNow'), payload:"BOOK_NOW" }, { title:getText(l,'callG'), payload:"CALL_G" }]); }
function sendDriv(uid,l){ userStates[uid].lastStep='Driver Attach'; userStates[uid].flow='DRIVER'; sendImageHD(uid, LINKS.driverPoster, getText(l,'drivPost'), [{ title:getText(l,'dlDriv'), payload:"DL_DRIV" }, { title:getText(l,'callG'), payload:"CALL_G" }]); }
function sendDel(uid,l){ userStates[uid].lastStep='Delivery'; sendImageHD(uid, LINKS.deliveryPoster, getText(l,'delIntro'), [{ title:getText(l,'bookPar'), payload:"DEL_BOOK" }, { title:getText(l,'regDel'), payload:"DEL_REG" }]); }
function sendRoom(uid,l){ userStates[uid].lastStep='Room Booking'; sendMessage(uid, getText(l,'bookIntro'), [{ title:getText(l,'bookRoom'), payload:"BOOK_ROOM" }, { title:getText(l,'callG'), payload:"CALL_G" }]); }
function sendEarn(uid,l){ userStates[uid].lastStep='Earn Selection'; sendImageHD(uid, LINKS.businessPoster1, getText(l,'earnIntro'), [{ title:getText(l,'high'), payload:"EARN_HIGH" }, { title:getText(l,'mod'), payload:"EARN_MOD" }, { title:getText(l,'base'), payload:"EARN_BASE" }]); }
function sendHigh(uid,l){ userStates[uid].lastStep='High Earning Details'; sendImageHD(uid, LINKS.businessPoster2, getText(l,'highIntro'), [{ title:getText(l,'video'), payload:"KNOW_BEN" }, { title:getText(l,'ben'), payload:"KNOW_BEN" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }
function sendBen(uid,l){ userStates[uid].lastStep='Benefits'; sendImageHD(uid, LINKS.businessPoster1, getText(l,'benText'), [{ title:getText(l,'sup'), payload:"KNOW_SUP" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }
function sendSup(uid,l){ userStates[uid].lastStep='Support'; sendImageHD(uid, LINKS.supportPoster, getText(l,'supText'), [{ title:getText(l,'req'), payload:"KNOW_REQ" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }
function sendReq(uid,l){ userStates[uid].lastStep='Requirements'; sendImageHD(uid, LINKS.extraPoster, getText(l,'reqText'), [{ title:getText(l,'submit'), payload:"SUBMIT_APP" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }]); }
function askCorp(uid,l){ userStates[uid].lastStep='Corporation Check'; sendMessage(uid, getText(l,'corpQ'), [{ title:getText(l,'yesCorp'), payload:"CORP_YES" }, { title:getText(l,'noCorp'), payload:"CORP_NO" }]); }
function sendReady(uid,l){ userStates[uid].lastStep='Ready to Pay 15L'; sendMessage(uid, getText(l,'ready15'), [{ title:getText(l,'readyBtn'), payload:"READY_15L" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }]); }
async function sendPay(uid,l){
  userStates[uid].lastStep='Pay Rs.5000';
  try{
    const url="https://graph.facebook.com/v20.0/"+PHONE_NUMBER_ID+"/messages";
    const headers={ Authorization:"Bearer "+WHATSAPP_TOKEN, "Content-Type":"application/json" };
    const to=formatTo(uid);
    await axios.post(url, {
      messaging_product:"whatsapp", to: to, type:"interactive",
      interactive:{ type:"cta_url", body:{ text:getText(l,'payReg')+"\n\nTap below to pay Rs.5000:" }, action:{ name:"cta_url", parameters:{ display_text:"Pay Now - Rs.5000", url:RAZORPAY_ALL } } }
    }, { headers: headers });
    setTimeout(()=>{ sendMessage(uid, "After payment:", [{ title:"I Paid - Rs.5000", payload:"PAY_DONE" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }, 2000);
  }catch(e){ sendMessage(uid, getText(l,'payReg')+"\n"+RAZORPAY_ALL, [{ title:"I Paid", payload:"PAY_DONE" }]); }
}

function sendEMI(uid,l){ userStates[uid].lastStep='EMI Options'; sendMessage(uid, getText(l,'emiOpt'), [{ title:getText(l,'emi10'), payload:"EMI_10" }, { title:getText(l,'emi20'), payload:"EMI_20" }]); }
function startLead(uid,l){ clearReminders(uid); userStates[uid]={ lang:l, flow:'LEAD', step:1, data:{}, lastStep:'Lead - Name' }; sendMessage(uid, getText(l,'leadAsk')+"\n\nName as per Aadhaar:"); }
function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; s.lastStep='Lead - Place'; sendMessage(uid, "Place / District / State?"); } else if(s.step===2){ s.data.place=txt; s.step=3; s.lastStep='Lead - Occupation'; sendMessage(uid, getText(s.lang,'occQ'), [{ title:getText(s.lang,'bus'), payload:"OCC_BUS" }, { title:getText(s.lang,'emp'), payload:"OCC_EMP" }, { title:getText(s.lang,'house'), payload:"OCC_HOUSE" }]); } }
function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; s.lastStep='Agreement Date'; sendMessage(uid, getText(s.lang,'tender')+"\n"+LINKS.tenderDistrict+"\n\n"+getText(s.lang,'date'), [{ title:getText(s.lang,'today'), payload:"DATE_TODAY" }, { title:getText(s.lang,'tom'), payload:"DATE_TOMORROW" }]); }
function handleDate(uid,d){ const s=userStates[uid]; clearReminders(uid); sendMessage(uid, getText(s.lang,'thanks')+" - "+s.data.name+" - "+d); delete userStates[uid]; }
function onMessage(uid,txt,payload){
  let state=userStates[uid];
  const p=(payload||"").trim();
  if(p.startsWith("LANG_")){ const l=p.replace("LANG_","").toLowerCase(); userStates[uid]={ lang:l, flow:'MAIN', data:{}, lastStep:'Main Menu' }; sendMain(uid,l); return; }
  if(!state){ sendFirst(uid); return; }
  const lang=state.lang||'en';
  if(p==="OPT_MORE"){ sendMore(uid,lang); return; }
  if(p==="OPT_RIDE"){ sendRide(uid,lang); return; }
  if(p==="RIDE_BOOK"){ sendCust(uid,lang); return; }
  if(p==="RIDE_ATTACH"){ sendDriv(uid,lang); return; }
  if(p==="OPT_DEL"){ sendDel(uid,lang); return; }
  if(p==="OPT_BOOK"||p==="BOOK_ROOM"){ sendRoom(uid,lang); return; }
  if(p==="OPT_EARN"){ sendEarn(uid,lang); return; }
  if(p==="EARN_HIGH"||p==="EARN_MOD"||p==="EARN_BASE"){ sendHigh(uid,lang); return; }
  if(p==="KNOW_BEN"){ sendBen(uid,lang); return; }
  if(p==="KNOW_SUP"){ sendSup(uid,lang); return; }
  if(p==="KNOW_REQ"){ sendReq(uid,lang); return; }
  if(p==="SUBMIT_APP"){ askCorp(uid,lang); return; }
  if(p==="CORP_YES"||p==="CORP_NO"){ sendReady(uid,lang); return; }
  if(p==="READY_15L"){ sendPay(uid,lang); return; }
  if(p==="KNOW_EMI"){ sendEMI(uid,lang); return; }
  if(p==="EMI_10"||p==="EMI_20"){ sendPay(uid,lang); return; }
  if(p==="PAY_DONE"){ startLead(uid,lang); return; }
  if(p.startsWith("OCC_")){ handleOcc(uid,p); return; }
  if(p.startsWith("DATE_")){ handleDate(uid,p.replace("DATE_","")); return; }
  if(state.flow==='LEAD' && txt){ handleLead(uid,txt); return; }
}
```js
app.post('/webhook', async (req,res)=>{
res.sendStatus(200);
try{
const body=req.body;
if(!body.object || body.object!=='whatsapp_business_account') return;
for(const entry of body.entry){
for(const change of entry.changes){
if(!change.value.messages) continue;
for(const msg of change.value.messages){
if(processedIds.has(msg.id)) continue;
processedIds.add(msg.id);
const from=msg.from;
const txt=msg.text? msg.text.body : "";
const btn=msg.button? msg.button.payload : msg.interactive? (msg.interactive.button_reply? msg.interactive.button_reply.id : msg.interactive.list_reply? msg.interactive.list_reply.id : "") : "";
const pl=btn || txt;
console.log("IN from "+from+" pl="+pl);
onMessage(from, txt, pl);
}
}
}
}catch(e){ console.log("WEBHOOK ERR", e.message); }
});

const PORT=process.env.PORT||3000;
app.listen(PORT, ()=>{ console.log("V48.8 FIXED LISTEN "+PORT); });
```
```js
const T = {
en: {
selOpt:"Please select an option:", ride:"Taxi Rides", earn:"Earn Money", more:"More Services", rideOpt:"Select ride option:", bookRide:"Book a Ride", attach:"Attach Vehicle", del:"Delivery", book:"Room Booking", dir:"Business Search",
custPost:"*Customer Ride* - Book taxi/auto instantly! Download customer app and get rides in minutes.",
drivPost:"*Driver - Attach Vehicle* - Join Bizmapia drivers, earn daily income! Download driver app.",
delIntro:"*Fast Parcel Delivery* - Same day delivery within hours! Pan-India network.",
bookIntro:"*Rooms, Appointments, Tickets* - Book easily via Bizmapia!", bookRoom:"Book Room",
earnIntro:"*Earn with Bizmapia* - Choose your model:\nHigh Franchise\nModerate\nBase",
highIntro:"*HIGH EARNING - District Franchise* - 15 Lakhs investment, full district rights, high monthly income! Limited slots.",
mod:"Moderate (5L)", base:"Base (1.5L)", high:"High (15L)", video:"Video", ben:"Benefits", callB:"Call Business Team", callG:"Call: General", bookNow:"Book Now", dlDriv:"Download Driver App", bookPar:"Book Parcel", regDel:"Register Delivery",
benText:"*BENEFITS:* \n- Full district control\n- All 4 services income\n- Monthly recurring\n- Support & training",
sup:"Support", supText:"*SUPPORT:* \n- 24/7 help\n- Marketing kit\n- App training\n- Legal docs",
req:"Requirements", reqText:"*REQUIREMENTS:* \n- Office space\n- Investment capacity\n- Good network\n\nReady to proceed?",
submit:"Submit Application", emi:"EMI Options", corpQ:"Is your corporation registered?", yesCorp:"Yes", noCorp:"No", ready15:"Ready to invest 15L for district franchise?", readyBtn:"Yes Ready 15L", payReg:"*Registration Fee: Rs.5000* - Pay to lock your district. Refundable if not selected.",
emiOpt:"*EMI Available:*\n10 months or 20 months", emi10:"EMI 10 Months", emi20:"EMI 20 Months",
leadAsk:"*Lead Form:* Application submitted! Our team will contact you.", occQ:"Occupation?", bus:"Business", emp:"Employee", house:"Housewife", tender:"Tender Details PDF:", date:"Select agreement date:", today:"Today", tom:"Tomorrow", thanks:"Thank you! Your district is reserved"
},
hi: { selOpt:"Kripya vikalp chunen:", ride:"Taxi Rides", earn:"Paisa Kamaye", more:"Aur Seva", rideOpt:"Ride vikalp:", bookRide:"Ride Book Kare", attach:"Gaadi Jode", del:"Delivery", book:"Room Booking", dir:"Business Search", custPost:"Customer Ride - Turant book kare!", drivPost:"Driver - Gaadi jode!", delIntro:"Tez parcel delivery!", bookIntro:"Room booking!", bookRoom:"Room Book", earnIntro:"Bizmapia se kamaye - Model chune", highIntro:"HIGH - District Franchise - 15 Lakh", mod:"Moderate (5L)", base:"Base (1.5L)", high:"High (15L)", video:"Video", ben:"Benefits", callB:"Business Team Ko Call", callG:"Call", bookNow:"Book Now", dlDriv:"Driver App", bookPar:"Parcel Book", regDel:"Delivery Register", benText:"BENEFITS: Full district", sup:"Support", supText:"SUPPORT: 24/7 help", req:"Requirements", reqText:"REQUIREMENTS: Office chahiye", submit:"Application Bheje", emi:"EMI", corpQ:"Corporation registered hai?", yesCorp:"Haan", noCorp:"Nahi", ready15:"15L invest ke liye ready?", readyBtn:"Haan 15L Ready", payReg:"Registration Rs.5000", emiOpt:"EMI: 10 mahine ya 20 mahine", emi10:"10 Mahine", emi20:"20 Mahine", leadAsk:"Form - Name likhe", occQ:"Occupation?", bus:"Business", emp:"Employee", house:"Housewife", tender:"Tender PDF:", date:"Date chune:", today:"Aaj", tom:"Kal", thanks:"Dhanyavaad!" },
ml: { selOpt:"Dayavaayi oru option therenjedukkuka:", ride:"Taxi Rides", earn:"Paisa Sampadikkuka", more:"Kooduthal Sevanangal", rideOpt:"Ride option:", bookRide:"Ride Book Cheyyuka", attach:"Vahana Cherukka", del:"Delivery", book:"Room Booking", dir:"Business Search", custPost:"Customer Ride - Ippol book cheyyu!", drivPost:"Driver - Vahana cheru!", delIntro:"Vega parcel delivery!", bookIntro:"Room booking!", bookRoom:"Room Book", earnIntro:"Bizmapia vazhi sampadikkuka - Model therenjedukkuka", highIntro:"HIGH - District Franchise - 15 Lakhs", mod:"Moderate (5L)", base:"Base (1.5L)", high:"High (15L)", video:"Video", ben:"Benefits", callB:"Business Team Vilikkuka", callG:"Call", bookNow:"Book Now", dlDriv:"Driver App", bookPar:"Parcel Book", regDel:"Delivery Register", benText:"BENEFITS: Full district", sup:"Support", supText:"SUPPORT: 24/7 help", req:"Requirements", reqText:"REQUIREMENTS: Office vendam", submit:"Application Ayakkuka", emi:"EMI", corpQ:"Corporation registered ano?", yesCorp:"Athe", noCorp:"Alla", ready15:"15L invest cheyyan ready ano?", readyBtn:"Athe 15L Ready", payReg:"Registration Rs.5000", emiOpt:"EMI: 10 masam atho 20 masam", emi10:"10 Masam", emi20:"20 Masam", leadAsk:"Form - Peru ezhuthuka", occQ:"Joli?", bus:"Business", emp:"Employee", house:"Housewife", tender:"Tender PDF:", date:"Date therenjedukkuka:", today:"Innu", tom:"Nale", thanks:"Nandi!" }
};
```
