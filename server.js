// V50 - TEMPLATE + MAINTENANCE - BOT: 7025630644 - FINAL CLEAN
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const RAZORPAY_ALL = "https://rzp.io/rzp/mq0zG6mS";
const BOT_OWN_NUMBER = "917025630644"; // YOUR API NUMBER - 7025630644
const BUSINESS_CALL = "918590175977";
const GENERAL_CALL = "919745226642";

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
};

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WELCOME_TEMPLATE = process.env.WELCOME_TEMPLATE || "";

let userStates = {};
const processedIds = new Set();
const reminderTimers = {};

app.get('/', (req,res)=>res.status(200).send(`V50 TEMPLATE READY - Bot:${BOT_OWN_NUMBER} - ${new Date().toISOString()}`));
app.get('/webhook',(req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']);
  res.sendStatus(403);
});

const FIRST_BRIEF = `🌟 Welcome to Bizmapia - All India 4-in-1 Services!

🚖 Affordable Taxi & Auto
🏪 10,00,000+ Local Businesses
📦 Fast Parcel in 2 Hours
🎟 Rooms, Doctor, Movie Tickets
💰 Daily & Monthly Income

One App. Four Services. Pan-India!

👇 Select language:`;

const T = {
  en:{ selOpt:"Please select any one from below:", ride:"Ride - Hailing", dir:"Business Directory", del:"Online Delivery", book:"Online Booking", earn:"Earn with Bizmapia", more:"More Options", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle", custPost:"Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount\n\nDownload Customer App: "+LINKS.customerApp, drivPost:"Earn by attaching your vehicle - Earn daily Rs.1500-2500\n\nTaxi/Auto/Bike all accepted\nDaily payout", bookNow:"Book Now", dlDriv:"Download Driver App", delIntro:"BizMapia online delivery - Fast Parcel Delivery in 2 Hours anywhere in India", bookPar:"Book your parcel", regDel:"Register as Delivery Agent", bookIntro:"Online Booking - Hotel/Doctor/Cinema - Book anywhere in India", bookRoom:"Book room", dlApp:"Download app", earnIntro:"You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?", high:"High earning", mod:"Moderate", base:"Base", highIntro:"Great you have selected the right choice. Know details from video link below.\nNote: Only one opportunity in a district, respond earliest.\n\nDistrict Franchise - 15 Lakhs\nCorporation - 7 Lakhs\nMunicipal - 3 Lakhs", video:"Video Link", ben:"Know Benefits", sup:"Know Support", req:"Requirements", submit:"Submit Application", emi:"EMI options", benText:"BENEFITS - District Franchise\n\nBenefits 1 - You are the district top level franchisee, percentage on all earnings in your district\nBenefits 2 - Only you can contact Company directly\nBenefits 3 - Lifetime royalty income", supText:"SUPPORT - Company will provide\nSupport 1 - 12 months marketing support\nSupport 2 - 6 months Rent contribution\nSupport 3 - 6 months Staff salary support", reqText:"REQUIREMENTS\n\nRequirement 1 - 90 Sqft room\nRequirement 2 - 1 full time staff\nRequirement 3 - PC/Laptop and Android Mobile\nRequirement 4 - Ready to invest\nRequirement 5 - Aadhaar + PAN", corpQ:"Did your district contain corporation? If your district HQ has Corporation (e.g. Ernakulam has Kochi Corporation), select Yes Corp.", yesCorp:"Yes Corp", noCorp:"No Corp", ready15:"You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.", readyBtn:"Yes Ready - 15L", payReg:"Pay your registration fee Rs.5000 to proceed further. For District/Corporation/Municipal/Business Center\n\nThis Rs.5000 is part of 15L, not extra.", payBtn:"Pay Rs.5000", emiOpt:"Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"Share contact: Name, Place, District, State, Contact, Occupation", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"Download Tender", date:"Select Agreement Date:", today:"Today", tom:"Tomorrow", thanks:"Thanks! Team will call within 24h.", callG:"97452 26642", callB:"85901 75977" },
  ml:{ selOpt:"താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക:", ride:"റൈഡ്", dir:"ബിസിനസ് ഡയറക്ടറി", del:"ഡെലിവറി", book:"ബുക്കിംഗ്", earn:"ബിസ്മാപിയ വരുമാനം", more:"കൂടുതൽ", rideOpt:"A. റൈഡ് ബുക്ക്\nB. വാഹനം അറ്റാച്ച്", bookRide:"റൈഡ് ബുക്ക്", attach:"വാഹനം അറ്റാച്ച്", custPost:"ഇന്ത്യയിൽ എവിടെയും റൈഡ് ബുക്ക് ചെയ്യൂ", drivPost:"വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം", bookNow:"ബുക്ക് ചെയ്യുക", dlDriv:"ഡ്രൈവർ ആപ്പ്", delIntro:"ബിസ്മാപിയ ഡെലിവറി", bookPar:"പാഴ്സൽ ബുക്ക്", regDel:"ഏജന്റ് രജിസ്റ്റർ", bookIntro:"ഓൺലൈൻ ബുക്കിംഗ്", bookRoom:"റൂം ബുക്ക്", dlApp:"ആപ്പ് ഡൗൺലോഡ്", earnIntro:"ഏത് തരം അവസരമാണ്?", high:"ഉയർന്ന വരുമാനം", mod:"മിതമായ", base:"അടിസ്ഥാന", highIntro:"ശരിയായ തിരഞ്ഞെടുപ്പ്.", video:"വീഡിയോ", ben:"ആനുകൂല്യങ്ങൾ", sup:"പിന്തുണ", req:"ആവശ്യകതകൾ", submit:"അപേക്ഷ", emi:"EMI", benText:"ആനുകൂല്യങ്ങൾ", supText:"പിന്തുണ", reqText:"ആവശ്യകതകൾ", corpQ:"കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp:"അതെ", noCorp:"ഇല്ല", ready15:"15 ലക്ഷം ഫീസ്?", readyBtn:"തയ്യാറാണ്", payReg:"Rs.5000 അടയ്ക്കുക", payBtn:"Rs.5000", emiOpt:"EMI തിരഞ്ഞെടുക്കുക", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"വിവരങ്ങൾ പങ്കിടുക", occQ:"തൊഴിൽ:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", busman:"ബിസിനസ്സ്മാൻ", tender:"ടെൻഡർ", date:"തീയതി:", today:"ഇന്ന്", tom:"നാളെ", thanks:"നന്ദി!", callG:"97452 26642", callB:"85901 75977" },
  hi:{ selOpt:"नीचे से कोई एक चुनें:", ride:"राइड", dir:"बिजनेस", del:"डिलीवरी", book:"बुकिंग", earn:"बिज़मापिया से कमाएं", more:"और विकल्प", rideOpt:"A. राइड बुक\nB. वाहन अटैच", bookRide:"राइड बुक", attach:"वाहन अटैच", custPost:"भारत में राइड बुक करें", drivPost:"वाहन अटैच करके कमाएं", bookNow:"बुक करें", dlDriv:"ड्राइवर ऐप", delIntro:"डिलीवरी", bookPar:"पार्सल बुक", regDel:"एजेंट", bookIntro:"बुकिंग", bookRoom:"रूम बुक", dlApp:"ऐप", earnIntro:"किस तरह का अवसर?", high:"उच्च कमाई", mod:"मध्यम", base:"बेस", highIntro:"सही चुनाव।", video:"वीडियो", ben:"लाभ", sup:"सपोर्ट", req:"जरूरतें", submit:"आवेदन", emi:"EMI", benText:"लाभ", supText:"सपोर्ट", reqText:"जरूरतें", corpQ:"कॉर्पोरेशन है?", yesCorp:"हाँ", noCorp:"नहीं", ready15:"15 लाख फीस?", readyBtn:"हाँ तैयार", payReg:"Rs.5000 भुगतान", payBtn:"Rs.5000", emiOpt:"EMI चुनें", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"संपर्क साझा करें", occQ:"व्यवसाय:", bus:"बिजनेस", house:"गृहिणी", emp:"कर्मचारी", busman:"व्यवसायी", tender:"टेंडर", date:"तिथि:", today:"आज", tom:"कल", thanks:"धन्यवाद!", callG:"97452 26642", callB:"85901 75977" }
};

function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]||""; }
function formatTo(to){
  let c=String(to).replace(/\D/g,"");
  if(c.startsWith("91") && c.length===12) return c;
  if(c.length===10) return "91"+c;
  return c;
}

async function sendMessage(uid, txt, btns){
  if(!btns) btns=[];
  const to=formatTo(uid);
  if(to===BOT_OWN_NUMBER){ console.log(`SKIP SELF ${to}`); return; }
  try{
    const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let data;
    if(btns.length>0){
      const quick=btns.slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload, title:String(b.title).substring(0,20) } }));
      data={ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:String(txt).substring(0,1024) }, action:{ buttons:quick } } };
    }else{
      data={ messaging_product:"whatsapp", to, type:"text", text:{ body:String(txt).substring(0,4096) } };
    }
    const resp=await axios.post(url,data,{headers});
    console.log(`OUT OK to ${to} BTNS:${btns.length} -> ${resp.data.messages?.[0]?.id}`);
  }catch(e){ console.log("SEND FAIL", JSON.stringify(e.response?.data,null,2)); }
}

async function sendTemplate(uid, templateName, langCode="en_US"){
  const to=formatTo(uid);
  if(to===BOT_OWN_NUMBER) return false;
  try{
    const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    const resp=await axios.post(url,{
      messaging_product:"whatsapp",
      to,
      type:"template",
      template:{ name:templateName, language:{ code:langCode } }
    },{headers});
    console.log(`OUT TEMPLATE ${templateName} to ${to} -> ${resp.data.messages?.[0]?.id}`);
    return true;
  }catch(e){
    console.log(`TEMPLATE ${templateName} FAIL`, JSON.stringify(e.response?.data,null,2));
    return false;
  }
}

async function sendImageHD(uid, imgUrl, cap, btns){
  const to=formatTo(uid);
  if(to===BOT_OWN_NUMBER) return;
  try{
    const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    await axios.post(url,{ messaging_product:"whatsapp", to, type:"image", image:{ link:imgUrl, caption:String(cap).substring(0,1024) } },{headers});
    console.log(`OUT IMAGE OK to ${to}`);
    if(btns && btns.length>0) setTimeout(()=>{ sendMessage(uid,"👇 Please select:",btns); },1200);
  }catch(e){
    console.log("IMAGE FAIL fallback", e.response?.data?.error?.message || e.message);
    await sendMessage(uid,cap,btns);
  }
}

function clearReminders(uid){ if(reminderTimers[uid]){ reminderTimers[uid].forEach(t=>clearTimeout(t)); delete reminderTimers[uid]; } }
function setReminders(uid,l){
  clearReminders(uid);
  const t1=setTimeout(()=>{ const s=userStates[uid]; if(s && s.flow!=='WELCOME') sendMessage(uid,"👋 Still there?",[{title:getText(l,'ride'),payload:"OPT_RIDE"},{title:getText(l,'earn'),payload:"OPT_EARN"}]); },3*60*1000);
  reminderTimers[uid]=[t1];
}

async function sendFirst(uid){
  console.log(`sendFirst to ${uid} - V50`);
  if(formatTo(uid)===BOT_OWN_NUMBER) return;
  if(WELCOME_TEMPLATE){
    const ok=await sendTemplate(uid,WELCOME_TEMPLATE,"en_US");
    if(ok){
      setTimeout(async()=>{
        await sendMessage(uid,FIRST_BRIEF,[
          {title:"English",payload:"LANG_EN"},
          {title:"Hindi",payload:"LANG_HI"},
          {title:"Malayalam",payload:"LANG_ML"}
        ]);
      },1500);
      userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', data:{} };
      setReminders(uid,'en');
      return;
    }
  }
  await sendMessage(uid,FIRST_BRIEF,[
    {title:"English",payload:"LANG_EN"},
    {title:"Hindi",payload:"LANG_HI"},
    {title:"Malayalam",payload:"LANG_ML"}
  ]);
  userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', data:{} };
  setReminders(uid,'en');
}

async function sendMain(uid,l){ userStates[uid].lang=l; userStates[uid].flow='MAIN'; userStates[uid].lastStep='Main Menu'; await sendMessage(uid,getText(l,'selOpt'),[{title:getText(l,'ride'),payload:"OPT_RIDE"},{title:getText(l,'earn'),payload:"OPT_EARN"},{title:getText(l,'more'),payload:"OPT_MORE"}]); }
async function sendMore(uid,l){ userStates[uid].lastStep='More Options'; await sendMessage(uid,"More:",[{title:getText(l,'del'),payload:"OPT_DEL"},{title:getText(l,'book'),payload:"OPT_BOOK"},{title:getText(l,'dir'),payload:"OPT_DIR"}]); }
async function sendRide(uid,l){ userStates[uid].lastStep='Ride Selection'; await sendMessage(uid,getText(l,'rideOpt'),[{title:getText(l,'bookRide'),payload:"RIDE_BOOK"},{title:getText(l,'attach'),payload:"RIDE_ATTACH"}]); }
async function sendCust(uid,l){ userStates[uid].lastStep='Book a Ride'; await sendImageHD(uid,LINKS.customerRidePoster,getText(l,'custPost'),[{title:getText(l,'bookNow'),payload:"BOOK_NOW"},{title:getText(l,'callG'),payload:"CALL_G"}]); }
async function sendDriv(uid,l){ userStates[uid].lastStep='Driver Attach'; userStates[uid].flow='DRIVER'; await sendImageHD(uid,LINKS.driverPoster,getText(l,'drivPost'),[{title:getText(l,'dlDriv'),payload:"DL_DRIV"},{title:getText(l,'callG'),payload:"CALL_G"}]); }
async function sendDel(uid,l){ userStates[uid].lastStep='Delivery'; await sendImageHD(uid,LINKS.deliveryPoster,getText(l,'delIntro'),[{title:getText(l,'bookPar'),payload:"DEL_BOOK"},{title:getText(l,'regDel'),payload:"DEL_REG"}]); }
async function sendRoom(uid,l){ userStates[uid].lastStep='Room Booking'; await sendMessage(uid,getText(l,'bookIntro'),[{title:getText(l,'bookRoom'),payload:"BOOK_ROOM"},{title:getText(l,'callG'),payload:"CALL_G"}]); }
async function sendEarn(uid,l){ userStates[uid].lastStep='Earn Selection'; await sendImageHD(uid,LINKS.businessPoster1,getText(l,'earnIntro'),[{title:getText(l,'high'),payload:"EARN_HIGH"},{title:getText(l,'mod'),payload:"EARN_MOD"},{title:getText(l,'base'),payload:"EARN_BASE"}]); }
async function sendHigh(uid,l){ userStates[uid].lastStep='High Earning Details'; await sendImageHD(uid,LINKS.businessPoster2,getText(l,'highIntro'),[{title:getText(l,'video'),payload:"KNOW_BEN"},{title:getText(l,'ben'),payload:"KNOW_BEN"},{title:getText(l,'callB'),payload:"CALL_B"}]); }
async function sendBen(uid,l){ userStates[uid].lastStep='Benefits'; await sendImageHD(uid,LINKS.businessPoster1,getText(l,'benText'),[{title:getText(l,'sup'),payload:"KNOW_SUP"},{title:getText(l,'callB'),payload:"CALL_B"}]); }
async function sendSup(uid,l){ userStates[uid].lastStep='Support'; await sendImageHD(uid,LINKS.supportPoster,getText(l,'supText'),[{title:getText(l,'req'),payload:"KNOW_REQ"},{title:getText(l,'callB'),payload:"CALL_B"}]); }
async function sendReq(uid,l){ userStates[uid].lastStep='Requirements'; await sendImageHD(uid,LINKS.extraPoster,getText(l,'reqText'),[{title:getText(l,'submit'),payload:"SUBMIT_APP"},{title:getText(l,'emi'),payload:"KNOW_EMI"}]); }
async function askCorp(uid,l){ userStates[uid].lastStep='Corporation Check'; await sendMessage(uid,getText(l,'corpQ'),[{title:getText(l,'yesCorp'),payload:"CORP_YES"},{title:getText(l,'noCorp'),payload:"CORP_NO"}]); }
async function sendReady(uid,l){ userStates[uid].lastStep='Ready to Pay 15L'; await sendMessage(uid,getText(l,'ready15'),[{title:getText(l,'readyBtn'),payload:"READY_15L"},{title:getText(l,'emi'),payload:"KNOW_EMI"}]); }
async function sendPay(uid,l){
  userStates[uid].lastStep='Pay Rs.5000';
  const to=formatTo(uid);
  const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
  const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
  try{
    await axios.post(url,{ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"cta_url", body:{ text:getText(l,'payReg')+"\n\nTap below to pay Rs.5000:" }, action:{ name:"cta_url", parameters:{ display_text:"Pay Now - Rs.5000", url:RAZORPAY_ALL } } } },{headers});
    setTimeout(()=>{ sendMessage(uid,"After payment:",[{title:"I Paid - Rs.5000",payload:"PAY_DONE"},{title:getText(l,'callB'),payload:"CALL_B"}]); },1500);
  }catch(e){
    console.log("PAY CTA FAIL", e.response?.data);
    await sendMessage(uid,getText(l,'payReg')+"\n"+RAZORPAY_ALL,[{title:"I Paid",payload:"PAY_DONE"}]);
  }
}
async function sendEMI(uid,l){ userStates[uid].lastStep='EMI Options'; await sendMessage(uid,getText(l,'emiOpt'),[{title:getText(l,'emi10'),payload:"EMI_10"},{title:getText(l,'emi20'),payload:"EMI_20"}]); }
async function startLead(uid,l){ clearReminders(uid); userStates[uid]={ lang:l, flow:'LEAD', step:1, data:{}, lastStep:'Lead - Name' }; await sendMessage(uid,getText(l,'leadAsk')+"\n\nName as per Aadhaar:"); }
async function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; s.lastStep='Lead - Place'; await sendMessage(uid,"Place / District / State?"); }else if(s.step===2){ s.data.place=txt; s.step=3; s.lastStep='Lead - Occupation'; await sendMessage(uid,getText(s.lang,'occQ'),[{title:getText(s.lang,'bus'),payload:"OCC_BUS"},{title:getText(s.lang,'emp'),payload:"OCC_EMP"},{title:getText(s.lang,'house'),payload:"OCC_HOUSE"}]); } }
async function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; s.lastStep='Agreement Date'; await sendMessage(uid,getText(s.lang,'tender')+"\n"+LINKS.tenderDistrict+"\n\n"+getText(s.lang,'date'),[{title:getText(s.lang,'today'),payload:"DATE_TODAY"},{title:getText(s.lang,'tom'),payload:"DATE_TOMORROW"}]); }
async function handleDate(uid,d){ const s=userStates[uid]; clearReminders(uid); await sendMessage(uid,getText(s.lang,'thanks')+" - "+s.data.name+" - "+d); delete userStates[uid]; }

async function onMessage(uid,txt,payload){
  let state=userStates[uid];
  const p=(payload||"").trim();
  const t=(txt||"").toLowerCase().trim();
  const isHi=["hi","hello","hey","hai","start","menu"].includes(t);
  if(p.startsWith("LANG_")){ const l=p.replace("LANG_","").toLowerCase(); userStates[uid]={ lang:l, flow:'MAIN', data:{}, lastStep:'Main Menu' }; await sendMain(uid,l); return; }
  if(!state){ console.log(`FIRST MESSAGE from ${uid}`); await sendFirst(uid); return; }
  if(isHi){ console.log(`HI RESET -> ${uid}`); clearReminders(uid); delete userStates[uid]; await sendFirst(uid); return; }
  const lang=state.lang||'en';
  if(p==="OPT_MORE") return await sendMore(uid,lang);
  if(p==="OPT_RIDE") return await sendRide(uid,lang);
  if(p==="RIDE_BOOK") return await sendCust(uid,lang);
  if(p==="RIDE_ATTACH") return await sendDriv(uid,lang);
  if(p==="OPT_DEL") return await sendDel(uid,lang);
  if(p==="OPT_BOOK"||p==="BOOK_ROOM") return await sendRoom(uid,lang);
  if(p==="OPT_EARN") return await sendEarn(uid,lang);
  if(p==="EARN_HIGH"||p==="EARN_MOD"||p==="EARN_BASE") return await sendHigh(uid,lang);
  if(p==="KNOW_BEN") return await sendBen(uid,lang);
  if(p==="KNOW_SUP") return await sendSup(uid,lang);
  if(p==="KNOW_REQ") return await sendReq(uid,lang);
  if(p==="SUBMIT_APP") return await askCorp(uid,lang);
  if(p==="CORP_YES"||p==="CORP_NO") return await sendReady(uid,lang);
  if(p==="READY_15L") return await sendPay(uid,lang);
  if(p==="KNOW_EMI") return await sendEMI(uid,lang);
  if(p==="EMI_10"||p==="EMI_20") return await sendPay(uid,lang);
  if(p==="PAY_DONE") return await startLead(uid,lang);
  if(p.startsWith("OCC_")) return await handleOcc(uid,p);
  if(p.startsWith("DATE_")) return await handleDate(uid,p.replace("DATE_",""));
  if(state.flow==='LEAD' && txt) return await handleLead(uid,txt);
}

app.post('/webhook', async (req,res)=>{
  res.sendStatus(200);
  try{
    const value=req.body.entry?.[0]?.changes?.[0]?.value;
    if(value?.statuses?.[0]){
      const st=value.statuses[0];
      console.log(`STATUS ${st.status} to ${st.recipient_id} - ${JSON.stringify(st.errors||'OK')} - id:${st.id}`);
      return;
    }
    const msg=value?.messages?.[0];
    if(msg){
      if(processedIds.has(msg.id)) return;
      processedIds.add(msg.id);
      setTimeout(()=>processedIds.delete(msg.id),60000);
      const uid=msg.from;
      const txt=msg.text?.body||"";
      const payload=msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || "";
      console.log("IN "+uid+" "+txt+" "+payload);
      await onMessage(uid,txt,payload||txt);
    }
  }catch(e){ console.log("webhook error", e.message); }
});

const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`V50 BOT ${BOT_OWN_NUMBER} TEMPLATE READY on ${PORT}`));
