// ============================================================
// V57.0 FIXED - Logs token missing + Guaranteed Hi reply
// Fixes 11:11:40 Incoming but no reply
// ============================================================
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const RAZORPAY_ALL = "https://rzp.io/rzp/mq0zG6mS";
const GENERAL_CALL = "919745226642";
const BUSINESS_CALL = "918590175977";
const GENERAL_TEL = "tel:+919745226642";
const BUSINESS_TEL = "tel:+918590175977";

const LINKS = {
  welcomePoster: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  customerRidePoster: "https://i.ibb.co/204Ztdvh/204Ztdvh.jpg",
  driverPoster: "https://i.ibb.co/67jpyTSS/67jpyTSS.jpg",
  deliveryPoster: "https://i.ibb.co/kgCH9jKM/kgCH9jKM.jpg",
  businessPoster1: "https://i.ibb.co/1WkT9c8.jpg",
  businessPoster2: "https://i.ibb.co/Jg2fVh3/Jg2fVh3.jpg",
  extraPoster: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  supportPoster: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  tenderDistrict: "https://bizmapia.com/tender/district.pdf"
};

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let userStates = {};
const reminderTimers = {};

app.get('/', (req,res)=>{
  const hasToken =!!WHATSAPP_TOKEN;
  const hasPhone =!!PHONE_NUMBER_ID;
  res.status(200).send(`V57.0 TOKEN CHECK - Token:${hasToken} Phone:${hasPhone} - ${RAZORPAY_ALL} - ${new Date().toISOString()}`);
});
app.get('/webhook',(req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']);
  res.sendStatus(403);
});

const FIRST_BRIEF_CAPTION = `🌟 Welcome to Bizmapia – All India, 4-in-1 Services!
🚖 Affordable Taxi & Auto Rides
🏪 Discover 10,00,000+ Local Businesses
📦 Fast Parcel Delivery Within Hours
🎟️ Book Rooms, Appointments & Movie Tickets
💰 Explore Daily & Monthly Business Income Opportunities
🚀 One App. Four Services. Pan-India Opportunities!
👉 Please select your language:`;

const T = {
  en:{ selOpt:"Please select any one from below:", ride:"🚕 Ride - Hailing", dir:"🏢 Business Directory", del:"📦 Online Delivery", book:"🏨 Online Booking", earn:"💰 Earn with Bizmapia", more:"More Options", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle", custPost:"🚕 Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount", drivPost:"🚗 Earn by attaching your vehicle - Earn daily Rs.1500-2500", bookNow:"📲 Book Now", dlDriv:"📲 Download Driver App", delIntro:"📦 BizMapia online delivery - Fast Parcel Delivery in 2 Hours", bookPar:"📦 Book your parcel", regDel:"🛵 Register as Delivery Agent", bookIntro:"🏨 Online Booking - Hotel/Doctor/Cinema", bookRoom:"🏨 Book room", earnIntro:"You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?", high:"💎 High earning", mod:"💼 Moderate", base:"🏠 Base", highIntro:"Great you have selected the right choice. Know details from video link below.\nNote: Only one opportunity in a district, respond earliest.\n\n💎 District Franchise - 15 Lakhs", video:"▶️ Video Link", ben:"📘 Know Benefits", sup:"🤝 Know Support", req:"📋 Requirements", submit:"📝 Submit Application", emi:"💳 EMI options", benText:"🌟 BENEFITS - District Franchise\n\n✅ Benefits 1 - You are the district top level franchisee\n✅ Benefits 2 - Only you can contact Company directly\n✅ Benefits 3 - Lifetime royalty income", supText:"🤝 SUPPORT - Company will provide\n🎯 Support 1 - 12 months marketing support\n🏠 Support 2 - 6 months Rent contribution", reqText:"📋 REQUIREMENTS\n\n🏢 Requirement 1 - >= 90 Sqft room\n👨‍💼 Requirement 2 - 1 full time staff", corpQ:"Did your district contain corporation?", yesCorp:"Yes Corp", noCorp:"No Corp", ready15:"You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.\n\nThis is fully refundable as per tender terms if not selected.", readyBtn:"✅ Yes Ready - 15L", payReg:"Pay your registration fee Rs.5000 to proceed further.", payBtn:"💳 Pay Rs.5000", emiOpt:"Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"Share contact: Name, Place, District, State, Contact, Occupation", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"📄 Download Tender", date:"Select Agreement Date:", today:"📅 Today", tom:"📅 Tomorrow", thanks:"✅ Thanks! Team will call within 24h.", callG:"📞 Call", callB:"📞 Call" },
  ml:{ selOpt:"താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക:", ride:"🚕 റൈഡ് - ടാക്സി/ഓട്ടോ", dir:"🏢 ബിസിനസ് ഡയറക്ടറി", del:"📦 ഓൺലൈൻ ഡെലിവറി", book:"🏨 ഓൺലൈൻ ബുക്കിംഗ്", earn:"💰 ബിസ്മാപിയയിൽ നിന്ന് വരുമാനം", more:"കൂടുതൽ ഓപ്ഷനുകൾ", rideOpt:"A. റൈഡ് ബുക്ക് ചെയ്യുക\nB. നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്യുക", bookRide:"റൈഡ് ബുക്ക്", attach:"വാഹനം അറ്റാച്ച്", custPost:"🚕 ഇന്ത്യയിൽ എവിടെയും റൈഡ് ബുക്ക് ചെയ്യൂ", drivPost:"🚗 നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്ത് ദിവസവും വരുമാനം നേടൂ", bookNow:"📲 ഇപ്പോൾ ബുക്ക് ചെയ്യുക", dlDriv:"📲 ഡ്രൈവർ ആപ്പ് ഡൗൺലോഡ്", delIntro:"📦 ബിസ്മാപിയ ഓൺലൈൻ ഡെലിവറി", bookPar:"📦 പാഴ്സൽ ബുക്ക് ചെയ്യുക", regDel:"🛵 ഡെലിവറി ഏജന്റായി രജിസ്റ്റർ ചെയ്യുക", bookIntro:"🏨 ഓൺലൈൻ ബുക്കിംഗ്", bookRoom:"🏨 റൂം ബുക്ക് ചെയ്യുക", dlApp:"📲 ആപ്പ് ഡൗൺലോഡ്", earnIntro:"ഏത് തരം അവസരമാണ് നിങ്ങൾ തിരയുന്നത്?", high:"💎 ഉയർന്ന വരുമാനം", mod:"💼 മിതമായ വരുമാനം", base:"🏠 അടിസ്ഥാന വരുമാനം", highIntro:"നിങ്ങൾ ശരിയായ തിരഞ്ഞെടുപ്പ് നടത്തി.", video:"▶️ വീഡിയോ ലിങ്ക്", ben:"📘 ആനുകൂല്യങ്ങൾ", sup:"🤝 പിന്തുണ", req:"📋 ആവശ്യകതകൾ", submit:"📝 അപേക്ഷ", emi:"💳 EMI", benText:"🌟 ആനുകൂല്യങ്ങൾ", supText:"🤝 പിന്തുണ", reqText:"📋 ആവശ്യകതകൾ", corpQ:"കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp:"അതെ", noCorp:"ഇല്ല", ready15:"15 ലക്ഷം ഫീസ് അടയ്ക്കാൻ തയ്യാറാണോ?", readyBtn:"✅ തയ്യാറാണ് - 15L", payReg:"Rs.5000 അടയ്ക്കുക", payBtn:"💳 Rs.5000", emiOpt:"EMI തിരഞ്ഞെടുക്കുക", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"വിവരങ്ങൾ പങ്കിടുക", occQ:"തൊഴിൽ തിരഞ്ഞെടുക്കുക:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", busman:"ബിസിനസ്സ്മാൻ", tender:"📄 ടെൻഡർ", date:"തീയതി തിരഞ്ഞെടുക്കുക:", today:"📅 ഇന്ന്", tom:"📅 നാളെ", thanks:"✅ നന്ദി!", callG:"📞 Call", callB:"📞 Call" },
  hi:{ selOpt:"नीचे से कोई एक चुनें:", ride:"🚕 राइड - टैक्सी/ऑटो", dir:"🏢 बिजनेस डायरेक्टरी", del:"📦 ऑनलाइन डिलीवरी", book:"🏨 ऑनलाइन बुकिंग", earn:"💰 बिज़मापिया से कमाएं", more:"और विकल्प", rideOpt:"A. राइड बुक करें\nB. अपना वाहन अटैच करें", bookRide:"राइड बुक करें", attach:"वाहन अटैच करें", custPost:"🚕 भारत में कहीं भी राइड बुक करें", drivPost:"🚗 अपना वाहन अटैच करके रोज कमाएं", bookNow:"📲 अभी बुक करें", dlDriv:"📲 ड्राइवर ऐप डाउनलोड", delIntro:"📦 बिज़मापिया ऑनलाइन डिलीवरी", bookPar:"📦 पार्सल बुक करें", regDel:"🛵 डिलीवरी एजेंट", bookIntro:"🏨 ऑनलाइन बुकिंग", bookRoom:"🏨 रूम बुक करें", dlApp:"📲 ऐप डाउनलोड", earnIntro:"किस तरह का अवसर देख रहे हैं?", high:"💎 उच्च कमाई", mod:"💼 मध्यम", base:"🏠 बेस", highIntro:"सही चुनाव किया है।", video:"▶️ वीडियो लिंक", ben:"📘 लाभ", sup:"🤝 सपोर्ट", req:"📋 आवश्यकताएं", submit:"📝 आवेदन", emi:"💳 EMI", benText:"🌟 लाभ", supText:"🤝 सपोर्ट", reqText:"📋 आवश्यकताएं", corpQ:"क्या कॉर्पोरेशन है?", yesCorp:"हाँ कॉर्प", noCorp:"नहीं कॉर्प", ready15:"15 लाख फीस देने के लिए तैयार हैं?", readyBtn:"✅ हाँ तैयार - 15L", payReg:"Rs.5000 भुगतान करें", payBtn:"💳 Rs.5000", emiOpt:"EMI चुनें", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"संपर्क साझा करें", occQ:"व्यवसाय चुनें:", bus:"बिजनेस", house:"गृहिणी", emp:"कर्मचारी", busman:"व्यवसायी", tender:"📄 टेंडर", date:"तिथि चुनें:", today:"📅 आज", tom:"📅 कल", thanks:"✅ धन्यवाद!", callG:"📞 Call", callB:"📞 Call" }
};
function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]; }

async function sendPlain(uid, txt){
  console.log(`[SEND PLAIN] To ${uid}, token exists:${!!WHATSAPP_TOKEN}, phoneId exists:${!!PHONE_NUMBER_ID}`);
  if(!WHATSAPP_TOKEN ||!PHONE_NUMBER_ID){
    console.error(`[TOKEN MISSING] WHATSAPP_TOKEN=${!!WHATSAPP_TOKEN} PHONE_NUMBER_ID=${!!PHONE_NUMBER_ID} - Check Render Environment variables!`);
    return;
  }
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    const res = await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:txt.substring(0,4000) }}, {headers});
    console.log(`[PLAIN SENT] To ${uid} - ID:${res.data.messages?.[0]?.id}`);
  }catch(e){
    console.error(`[PLAIN FAIL] To ${uid}`, e.response?.data || e.message);
  }
}

async function sendButtons(uid, txt, btns){
  console.log(`[SEND BUTTONS] To ${uid} - ${btns.map(b=>b.title).join(',')}`);
  if(!WHATSAPP_TOKEN ||!PHONE_NUMBER_ID){
    console.error(`[TOKEN MISSING FOR BUTTONS]`);
    return sendPlain(uid, txt);
  }
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    const hasCall = btns.some(b=>b.url && b.url.startsWith('tel:'));
    let actionBtns;
    if(hasCall){
      actionBtns = btns.slice(0,3).map(b=>{
        if(b.url && b.url.startsWith('tel:')) return { type:"phone_number", phone_number: b.url.replace('tel:',''), text: b.title.substring(0,20) };
        else return { type:"reply", reply:{ id:b.payload, title:b.title.substring(0,20) } };
      });
    } else {
      actionBtns = btns.slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload, title:b.title.substring(0,20) }}));
    }
    const res = await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:txt.substring(0,1024) }, action:{ buttons:actionBtns }}}, {headers});
    console.log(`[BUTTONS SENT] To ${uid} - ID:${res.data.messages?.[0]?.id}`);
  }catch(e){
    console.error(`[BUTTONS FAIL] To ${uid}`, e.response?.data || e.message);
    await sendPlain(uid, txt + "\n\nReply: English / Hindi / Malayalam");
  }
}

async function sendImageHD(uid, imgUrl, cap, btns=[]){
  if(!WHATSAPP_TOKEN ||!PHONE_NUMBER_ID){
    console.error(`[TOKEN MISSING FOR IMAGE]`);
    return sendPlain(uid, cap);
  }
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    await axios.post(url, { messaging_product:"whatsapp", to, type:"image", image:{ link:imgUrl, caption:cap.substring(0,1024) }}, {headers});
    if(btns.length>0) setTimeout(()=> sendButtons(uid, "👇 Please tap to continue:", btns), 1200);
  }catch(e){
    console.error(`[IMAGE FAIL]`, e.response?.data || e.message);
    await sendPlain(uid, cap);
    if(btns.length>0) setTimeout(()=> sendButtons(uid, "👇 Please tap to continue:", btns), 1200);
  }
}

function clearReminders(uid){ if(reminderTimers[uid]){ reminderTimers[uid].forEach(t=>clearTimeout(t)); delete reminderTimers[uid]; } }

function getReminderData(lastStep, lang){
  const callGeneral = { title:"📞 Call", payload:"CALL_G", url: GENERAL_TEL };
  const callBusiness = { title:"📞 Call", payload:"CALL_B", url: BUSINESS_TEL };
  const isBusiness = ['Earn','Benefit','Support','15L','5000','EMI','Lead','Agreement','Corporation'].some(s=> lastStep.includes(s));
  const callBtn = isBusiness? callBusiness : callGeneral;
  if(lastStep==='Language Selection'){
    return { text:`You left without selecting language. Please select your language to unlock 4 services.`, buttons:[{ title:"English", payload:"LANG_EN" }, { title:"हिंदी", payload:"LANG_HI" }, { title:"മലയാളം", payload:"LANG_ML" }] };
  }
  let text=""; let buttons=[];
  switch(lastStep){
    case 'Main Menu': text=`You left at Main Menu.`; buttons=[{ title:getText(lang,'ride'), payload:"OPT_RIDE" }, { title:getText(lang,'earn'), payload:"OPT_EARN" }, callBtn]; break;
    default: text=`You left at ${lastStep}.`; buttons=[{ title:"▶️ Continue", payload:"RESUME" }, callBtn];
  }
  return { text, buttons };
}

function scheduleReminders(uid, lang, flowType, lastStepName){
  clearReminders(uid);
  const times = flowType==='DRIVER'? [5*60*1000,30*60*1000,60*60*1000,4*60*60*1000,12*60*60*1000,24*60*60*1000] : [5*60*1000,10*60*1000,60*60*1000,8*60*60*1000,18*60*60*1000,24*60*60*1000];
  const labels = flowType==='DRIVER'? ["5 min","30 min","1 hour","4 hour","12 hour","24 hour"] : ["5 min","10 min","1 hour","8 hour","18 hour","24 hour"];
  reminderTimers[uid]=[];
  times.forEach((delay, idx)=>{
    const tid=setTimeout(async ()=>{
      const state=userStates[uid]; if(!state) return;
      const data = getReminderData(lastStepName, state.lang||lang);
      sendButtons(uid, `⏰ Reminder (${labels[idx]}): ${data.text}`, data.buttons);
    }, delay);
    reminderTimers[uid].push(tid);
  });
}

function sendFirstPoster(uid){
  console.log(`[FIRST POSTER] To ${uid}`);
  sendImageHD(uid, LINKS.welcomePoster, FIRST_BRIEF_CAPTION, [
    { title:"English", payload:"LANG_EN" },
    { title:"हिंदी", payload:"LANG_HI" },
    { title:"മലയാളം", payload:"LANG_ML" }
  ]);
  userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', firstPosterSent:true };
  scheduleReminders(uid,'en','GENERAL','Language Selection');
}

async function sendHiReplyGuaranteed(uid){
  console.log(`[HI GUARANTEED] To ${uid}`);
  await sendPlain(uid, `👋 Hi! Welcome back to Bizmapia!

You left without selecting language. Please select your language to unlock all 4 services.`);
  setTimeout(()=>{
    sendButtons(uid, `Please select your language:`, [
      { title:"English", payload:"LANG_EN" },
      { title:"हिंदी", payload:"LANG_HI" },
      { title:"മലയാളം", payload:"LANG_ML" }
    ]);
  }, 1000);
  if(!userStates[uid]) userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection' };
  else { userStates[uid].flow='WELCOME'; userStates[uid].lastStep='Language Selection'; }
  scheduleReminders(uid,'en','GENERAL','Language Selection');
}

function sendMain(uid,l){ userStates[uid].lang=l; userStates[uid].flow='MAIN'; userStates[uid].lastStep='Main Menu'; sendButtons(uid, getText(l,'selOpt'), [{ title:getText(l,'ride'), payload:"OPT_RIDE" }, { title:getText(l,'earn'), payload:"OPT_EARN" }, { title:getText(l,'more'), payload:"OPT_MORE" }]); scheduleReminders(uid,l,'GENERAL','Main Menu'); }

function onMessage(uid,txt,payload){
  let state=userStates[uid];
  const p=(payload||"").trim();
  const lower=(txt||"").toLowerCase().trim();
  const isHi = ["hi","hello","hey","hai","start","menu"].some(w=> lower===w || lower.includes(w) );
  console.log(`[ONMESSAGE] uid=${uid} txt=${txt} payload=${p} lastStep=${state?.lastStep} isHi=${isHi} token=${!!WHATSAPP_TOKEN}`);

  if(p.startsWith("LANG_")){
    const l=p.replace("LANG_","").toLowerCase();
    userStates[uid]={ lang:l, flow:'MAIN', lastStep:'Main Menu', firstPosterSent:true };
    sendMain(uid,l); return;
  }
  if(!state){
    console.log(`[NO STATE] Sending first poster to ${uid}`);
    sendFirstPoster(uid); return;
  }
  if(isHi || state.flow==='WELCOME' || state.lastStep==='Language Selection'){
    console.log(`[HI PATH] Guaranteed reply to ${uid}`);
    sendHiReplyGuaranteed(uid);
    return;
  }
  const data = getReminderData(state.lastStep, state.lang||'en');
  sendButtons(uid, data.text, data.buttons);
}

app.post('/webhook', async (req,res)=>{
  try{
    const entry=req.body.entry?.[0]?.changes?.[0]?.value;
    const msg=entry?.messages?.[0];
    if(msg){
      const uid=msg.from;
      const txt=msg.text?.body||"";
      const pl=msg.interactive?.button_reply?.id||"";
      console.log(`[WEBHOOK] Incoming: ${uid} ${txt} ${pl} - Token:${!!WHATSAPP_TOKEN} Phone:${!!PHONE_NUMBER_ID}`);
      onMessage(uid,txt,pl||txt);
    }
  }catch(e){ console.error("[WEBHOOK ERROR]", e.message); }
  res.sendStatus(200);
});

app.listen(process.env.PORT||10000,'0.0.0.0',()=>console.log(`V57.0 RUNNING - Token:${!!WHATSAPP_TOKEN} Phone:${!!PHONE_NUMBER_ID} - ${RAZORPAY_ALL}`));
