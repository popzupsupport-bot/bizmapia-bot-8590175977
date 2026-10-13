// V61.0 HD FULL FINAL - Fixes blurry poster + incomplete response + Token log
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const RAZORPAY_ALL = "https://rzp.io/rzp/mq0zG6mS";
const GENERAL_TEL = "+919745226642";
const BUSINESS_TEL = "+918590175977";

const LINKS = {
  welcomePoster: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.png",
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

app.get('/', (req,res)=>{
  const hasToken =!!process.env.WHATSAPP_TOKEN;
  const hasPhone =!!process.env.PHONE_NUMBER_ID;
  res.status(200).send(`V61.0 HD FULL - Token:${hasToken} Phone:${hasPhone} - ${RAZORPAY_ALL} - ${new Date().toISOString()}`);
});
app.get('/webhook',(req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']);
  res.sendStatus(403);
});

const FIRST_BRIEF = `🌟 *Welcome to Bizmapia – All India, 4-in-1 Services!*

🚖 Affordable Taxi & Auto Rides
🏪 Discover 10,00,000+ Local Businesses
📦 Fast Parcel Delivery Within Hours
🎟️ Book Rooms, Appointments & Movie Tickets
💰 Explore Daily & Monthly Business Income Opportunities

🚀 One App. Four Services. Pan-India Opportunities!

👉 *Please select your language:*`;

const T = {
  en:{ selOpt:"Please select any one from below:", ride:"🚕 Ride - Hailing", dir:"🏢 Business Directory", del:"📦 Online Delivery", book:"🏨 Online Booking", earn:"💰 Earn with Bizmapia", more:"More Options", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle", custPost:"🚕 Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount", drivPost:"🚗 Earn by attaching your vehicle - Earn daily Rs.1500-2500", bookNow:"📲 Book Now", dlDriv:"📲 Download Driver App", delIntro:"📦 BizMapia online delivery - Fast Parcel Delivery in 2 Hours", bookPar:"📦 Book your parcel", regDel:"🛵 Register as Delivery Agent", bookIntro:"🏨 Online Booking - Hotel/Doctor/Cinema", bookRoom:"🏨 Book room", earnIntro:"You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?", high:"💎 High earning", mod:"💼 Moderate", base:"🏠 Base", highIntro:"Great you have selected the right choice. Know details from video link below.\nNote: Only one opportunity in a district, respond earliest.\n\n💎 District Franchise - 15 Lakhs", video:"▶️ Video Link", ben:"📘 Know Benefits", sup:"🤝 Know Support", req:"📋 Requirements", submit:"📝 Submit Application", emi:"💳 EMI options", benText:"🌟 *BENEFITS - District Franchise*\n\n✅ You are the district top level franchisee\n✅ Only you can contact Company directly\n✅ Lifetime royalty income", supText:"🤝 *SUPPORT*\n🎯 12 months marketing support\n🏠 6 months Rent", reqText:"📋 *REQUIREMENTS*\n\n🏢 >= 90 Sqft room\n👨‍💼 1 staff", corpQ:"Did your district contain corporation?", yesCorp:"Yes Corp", noCorp:"No Corp", ready15:"You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.", readyBtn:"✅ Yes Ready - 15L", payReg:"Pay your registration fee Rs.5000 to proceed further.", payBtn:"💳 Pay Rs.5000", emiOpt:"Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"Share contact: Name, Place, District, State, Contact, Occupation", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"📄 Download Tender", date:"Select Agreement Date:", today:"📅 Today", tom:"📅 Tomorrow", thanks:"✅ Thanks! Team will call within 24h.", call:"📞 Call" },
  ml:{ selOpt:"താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക:", ride:"🚕 റൈഡ് - ടാക്സി/ഓട്ടോ", dir:"🏢 ബിസിനസ് ഡയറക്ടറി", del:"📦 ഓൺലൈൻ ഡെലിവറി", book:"🏨 ഓൺലൈൻ ബുക്കിംഗ്", earn:"💰 ബിസ്മാപിയയിൽ നിന്ന് വരുമാനം", more:"കൂടുതൽ ഓപ്ഷനുകൾ", rideOpt:"A. റൈഡ് ബുക്ക് ചെയ്യുക\nB. നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്യുക", bookRide:"റൈഡ് ബുക്ക്", attach:"വാഹനം അറ്റാച്ച്", custPost:"🚕 ഇന്ത്യയിൽ എവിടെയും റൈഡ് ബുക്ക് ചെയ്യൂ", drivPost:"🚗 വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം നേടൂ", bookNow:"📲 ഇപ്പോൾ ബുക്ക് ചെയ്യുക", dlDriv:"📲 ഡ്രൈവർ ആപ്പ് ഡൗൺലോഡ്", delIntro:"📦 ബിസ്മാപിയ ഓൺലൈൻ ഡെലിവറി", bookPar:"📦 പാഴ്സൽ ബുക്ക് ചെയ്യുക", regDel:"🛵 ഡെലിവറി ഏജന്റായി രജിസ്റ്റർ", bookIntro:"🏨 ഓൺലൈൻ ബുക്കിംഗ്", bookRoom:"🏨 റൂം ബുക്ക്", earnIntro:"ഏത് തരം അവസരമാണ് നിങ്ങൾ തിരയുന്നത്?", high:"💎 ഉയർന്ന വരുമാനം", mod:"💼 മിതമായ വരുമാനം", base:"🏠 അടിസ്ഥാന വരുമാനം", highIntro:"നിങ്ങൾ ശരിയായ തിരഞ്ഞെടുപ്പ് നടത്തി.", video:"▶️ വീഡിയോ ലിങ്ക്", ben:"📘 ആനുകൂല്യങ്ങൾ", sup:"🤝 പിന്തുണ", req:"📋 ആവശ്യകതകൾ", submit:"📝 അപേക്ഷ", emi:"💳 EMI", benText:"🌟 ആനുകൂല്യങ്ങൾ", supText:"🤝 പിന്തുണ", reqText:"📋 ആവശ്യകതകൾ", corpQ:"കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp:"അതെ", noCorp:"ഇല്ല", ready15:"15 ലക്ഷം ഫീസ് അടയ്ക്കാൻ തയ്യാറാണോ?", readyBtn:"✅ തയ്യാറാണ് - 15L", payReg:"Rs.5000 അടയ്ക്കുക", payBtn:"💳 Rs.5000", emiOpt:"EMI തിരഞ്ഞെടുക്കുക", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"വിവരങ്ങൾ പങ്കിടുക", occQ:"തൊഴിൽ തിരഞ്ഞെടുക്കുക:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", busman:"ബിസിനസ്സ്മാൻ", tender:"📄 ടെൻഡർ", date:"തീയതി തിരഞ്ഞെടുക്കുക:", today:"📅 ഇന്ന്", tom:"📅 നാളെ", thanks:"✅ നന്ദി!", call:"📞 Call" },
  hi:{ selOpt:"नीचे से कोई एक चुनें:", ride:"🚕 राइड - टैक्सी/ऑटो", dir:"🏢 बिजनेस डायरेक्टरी", del:"📦 ऑनलाइन डिलीवरी", book:"🏨 ऑनलाइन बुकिंग", earn:"💰 बिज़मापिया से कमाएं", more:"और विकल्प", rideOpt:"A. राइड बुक करें\nB. अपना वाहन अटैच करें", bookRide:"राइड बुक करें", attach:"वाहन अटैच करें", custPost:"🚕 भारत में कहीं भी राइड बुक करें", drivPost:"🚗 वाहन अटैच करके रोज कमाएं", bookNow:"📲 अभी बुक करें", dlDriv:"📲 ड्राइवर ऐप डाउनलोड", delIntro:"📦 बिज़मापिया ऑनलाइन डिलीवरी", bookPar:"📦 पार्सल बुक करें", regDel:"🛵 डिलीवरी एजेंट", bookIntro:"🏨 ऑनलाइन बुकिंग", bookRoom:"🏨 रूम बुक करें", earnIntro:"किस तरह का अवसर देख रहे हैं?", high:"💎 उच्च कमाई", mod:"💼 मध्यम", base:"🏠 बेस", highIntro:"सही चुनाव किया है।", video:"▶️ वीडियो लिंक", ben:"📘 लाभ", sup:"🤝 सपोर्ट", req:"📋 आवश्यकताएं", submit:"📝 आवेदन", emi:"💳 EMI", benText:"🌟 लाभ", supText:"🤝 सपोर्ट", reqText:"📋 आवश्यकताएं", corpQ:"क्या कॉर्पोरेशन है?", yesCorp:"हाँ कॉर्प", noCorp:"नहीं कॉर्प", ready15:"15 लाख फीस देने के लिए तैयार हैं?", readyBtn:"✅ हाँ तैयार - 15L", payReg:"Rs.5000 भुगतान करें", payBtn:"💳 Rs.5000", emiOpt:"EMI चुनें", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"संपर्क साझा करें", occQ:"व्यवसाय चुनें:", bus:"बिजनेस", house:"गृहिणी", emp:"कर्मचारी", busman:"व्यवसायी", tender:"📄 टेंडर", date:"तिथि चुनें:", today:"📅 आज", tom:"📅 कल", thanks:"✅ धन्यवाद!", call:"📞 Call" }
};
function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]; }
let userStates = {};
const reminderTimers = {};

async function sendWA(uid, txt, btns=[]){
  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.PHONE_NUMBER_ID;
  console.log(`[SEND CHECK] Token exists:${!!TOKEN} Phone exists:${!!PHONE_ID} To:${uid} Text:${txt.substring(0,50)} Buttons:${btns.map(b=>b.title).join(',')}`);
  if(!TOKEN||!PHONE_ID){
    console.error(`[TOKEN MISSING] Cannot send WhatsApp! TOKEN=${!!TOKEN} PHONE_ID=${!!PHONE_ID}`);
    return null;
  }
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`;
    const headers={ Authorization:`Bearer ${TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    if(btns.length>0){
      const actionBtns = btns.slice(0,3).map(b=>{
        if(b.url) return { type:"phone_number", phone_number: b.url.replace('+',''), text: b.title.substring(0,20) };
        return { type:"reply", reply:{ id:b.payload, title:b.title.substring(0,20) } };
      });
      const r = await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:txt.substring(0,1024) }, action:{ buttons:actionBtns }}}, {headers});
      console.log(`[SENT OK] ID:${r.data.messages?.[0]?.id} To:${uid}`);
      return r.data.messages?.[0]?.id;
    } else {
      const r = await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:txt.substring(0,4000) }}, {headers});
      console.log(`[SENT OK] ID:${r.data.messages?.[0]?.id} To:${uid}`);
      return r.data.messages?.[0]?.id;
    }
  }catch(e){
    console.error(`[WA FAIL] To:${uid}`, JSON.stringify(e.response?.data||e.message));
    return null;
  }
}

async function sendImageWA(uid, imgUrl, cap, btns=[]){
  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.PHONE_NUMBER_ID;
  if(!TOKEN||!PHONE_ID){ return sendWA(uid, cap, btns); }
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`;
    const headers={ Authorization:`Bearer ${TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    await axios.post(url, { messaging_product:"whatsapp", to, type:"image", image:{ link:imgUrl, caption:cap.substring(0,1024) }}, {headers});
    console.log(`[IMAGE SENT] To:${uid}`);
    if(btns.length>0) setTimeout(()=> sendWA(uid, "👇 Tap to continue:", btns), 800);
  }catch(e){ console.error(`[IMAGE FAIL]`, e.response?.data||e.message); await sendWA(uid, cap, btns); }
}

function clearRem(uid){ if(reminderTimers[uid]){ reminderTimers[uid].forEach(t=>clearTimeout(t)); delete reminderTimers[uid]; } }
function getReminderData(lastStep, lang){
  const isBusiness = ['Earn','Benefit','Support','Requirement','Corporation','Ready','Pay','EMI','Lead','Agreement'].some(s=> lastStep.includes(s));
  const callBtn = { title:"📞 Call", payload: isBusiness?"CALL_B":"CALL_G", url: isBusiness? "+918590175977" : "+919745226642" };
  if(lastStep==='Language Selection'){
    return {
      text:`🔔 You left without selecting language.\n\n❌ Left: You started Bizmapia but didn't choose language.\n\n➡️ Next: Select your language (English / हिंदी / മലയാളം).\n\n⚡ Act immediately!`,
      buttons:[ { title:"English", payload:"LANG_EN" }, { title:"हिंदी", payload:"LANG_HI" }, { title:"മലയാളം", payload:"LANG_ML" } ]
    };
  }
  let text=`🔔 You left at ${lastStep}.`; let buttons=[{ title:"▶️ Continue", payload:"RESUME" }, callBtn];
  switch(lastStep){
    case 'Main Menu': text=`🔔 You left at Main Menu.`; buttons=[{ title:getText(lang,'ride'), payload:"OPT_RIDE" }, { title:getText(lang,'earn'), payload:"OPT_EARN" }, callBtn]; break;
    case 'Earn Selection': text=`🔔 You left at Earning Opportunity.`; buttons=[{ title:getText(lang,'high'), payload:"EARN_HIGH" }, { title:getText(lang,'mod'), payload:"EARN_MOD" }, callBtn]; break;
  }
  return { text, buttons: buttons.slice(0,3) };
}
function scheduleRem(uid, lang, flowType, lastStepName){
  clearRem(uid);
  const times = flowType==='DRIVER'? [5*60*1000,30*60*1000,60*60*1000,4*60*60*1000,12*60*60*1000,24*60*60*1000] : [5*60*1000,10*60*1000,60*60*1000,8*60*60*1000,18*60*60*1000,24*60*60*1000];
  const labels = flowType==='DRIVER'? ["5 min","30 min","1 hour","4 hour","12 hour","24 hour"] : ["5 min","10 min","1 hour","8 hour","18 hour","24 hour"];
  reminderTimers[uid]=[];
  times.forEach((delay, idx)=>{
    const tid=setTimeout(async ()=>{
      const state=userStates[uid]; if(!state) return;
      const data = getReminderData(lastStepName, state.lang||lang);
      sendWA(uid, `⏰ Reminder (${labels[idx]}):\n\n${data.text}`, data.buttons);
    }, delay);
    reminderTimers[uid].push(tid);
  });
}

// V61.0 HD FULL - Fixes blurry poster + incomplete
async function sendWelcomeRealtime(uid){
  console.log(`[WELCOME V61 HD] To ${uid}`);
  // 1. FULL RESPONSE INSTANT - Text + Buttons (so user never sees empty)
  await sendWA(uid, FIRST_BRIEF + "\n\n👇 Select language:", [
    { title:"English", payload:"LANG_EN" },
    { title:"हिंदी", payload:"LANG_HI" },
    { title:"മലയാളം", payload:"LANG_ML" }
  ]);
  // 2. HD POSTER 500ms later with HD caption - not blurry
  setTimeout(async ()=>{
    // Send HD poster with full caption to avoid blurry empty
    await sendImageWA(uid, "https://i.ibb.co/fGVVPC3n/fGVVPC3n.png", "🌟 Bizmapia – All India 4-in-1 Services\n\nOne App. Four Services. Pan-India Opportunities!\n\n👉 Tap English / हिंदी / മലയാളം above to continue", []);
    console.log(`[HD POSTER SENT] To ${uid}`);
  }, 500);
  userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', lang:'en' };
  scheduleRem(uid,'en','GENERAL','Language Selection');
}

function sendMain(uid,l){ userStates[uid].lang=l; userStates[uid].flow='MAIN'; userStates[uid].lastStep='Main Menu'; sendWA(uid, getText(l,'selOpt'), [{ title:getText(l,'ride'), payload:"OPT_RIDE" }, { title:getText(l,'earn'), payload:"OPT_EARN" }, { title:getText(l,'more'), payload:"OPT_MORE" }]); scheduleRem(uid,l,'GENERAL','Main Menu'); }
function sendMore(uid,l){ userStates[uid].lastStep='More Options'; sendWA(uid, "More:", [{ title:getText(l,'del'), payload:"OPT_DEL" }, { title:getText(l,'book'), payload:"OPT_BOOK" }, { title:getText(l,'dir'), payload:"OPT_DIR" }]); scheduleRem(uid,l,'GENERAL','More Options'); }
function sendRide(uid,l){ userStates[uid].lastStep='Ride Selection'; sendWA(uid, getText(l,'rideOpt'), [{ title:getText(l,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(l,'attach'), payload:"RIDE_ATTACH" }, { title:"📞 Call", payload:"CALL_G", url: "+919745226642" }]); scheduleRem(uid,l,'GENERAL','Ride Selection'); }
function sendCust(uid,l){ userStates[uid].lastStep='Book a Ride'; sendImageWA(uid, LINKS.customerRidePoster, getText(l,'custPost'), [{ title:getText(l,'bookNow'), payload:"BOOK_NOW" }, { title:"📞 Call", payload:"CALL_G", url: "+919745226642" }]); scheduleRem(uid,l,'GENERAL','Book a Ride'); }
function sendDriv(uid,l){ userStates[uid].lastStep='Driver Attach - Earn Daily'; userStates[uid].flow='DRIVER'; sendImageWA(uid, LINKS.driverPoster, getText(l,'drivPost'), [{ title:getText(l,'dlDriv'), payload:"DL_DRIV" }, { title:"📞 Call", payload:"CALL_G", url: "+919745226642" }]); scheduleRem(uid,l,'DRIVER','Driver Attach - Earn Daily'); }
function sendDel(uid,l){ userStates[uid].lastStep='Delivery'; sendImageWA(uid, LINKS.deliveryPoster, getText(l,'delIntro'), [{ title:getText(l,'bookPar'), payload:"DEL_BOOK" }, { title:getText(l,'regDel'), payload:"DEL_REG" }, { title:"📞 Call", payload:"CALL_G", url: "+919745226642" }]); scheduleRem(uid,l,'GENERAL','Delivery'); }
function sendRoom(uid,l){ userStates[uid].lastStep='Room Booking'; sendWA(uid, getText(l,'bookIntro'), [{ title:getText(l,'bookRoom'), payload:"BOOK_ROOM" }, { title:"📞 Call", payload:"CALL_G", url: "+919745226642" }]); scheduleRem(uid,l,'GENERAL','Room Booking'); }
function sendEarn(uid,l){ userStates[uid].lastStep='Earn Selection'; sendImageWA(uid, LINKS.businessPoster1, getText(l,'earnIntro'), [{ title:getText(l,'high'), payload:"EARN_HIGH" }, { title:getText(l,'mod'), payload:"EARN_MOD" }, { title:getText(l,'base'), payload:"EARN_BASE" }]); scheduleRem(uid,l,'GENERAL','Earn Selection'); }
function sendHigh(uid,l){ userStates[uid].lastStep='High Earning Details'; sendImageWA(uid, LINKS.businessPoster2, getText(l,'highIntro'), [{ title:getText(l,'video'), payload:"KNOW_BEN" }, { title:getText(l,'ben'), payload:"KNOW_BEN" }, { title:"📞 Call", payload:"CALL_B", url: "+918590175977" }]); scheduleRem(uid,l,'GENERAL','High Earning Details'); }
function sendBen(uid,l){ userStates[uid].lastStep='Benefits'; sendImageWA(uid, LINKS.businessPoster1, getText(l,'benText'), [{ title:getText(l,'sup'), payload:"KNOW_SUP" }, { title:"📞 Call", payload:"CALL_B", url: "+918590175977" }]); scheduleRem(uid,l,'GENERAL','Benefits'); }
function sendSup(uid,l){ userStates[uid].lastStep='Support - Rent + Staff + Marketing'; sendImageWA(uid, LINKS.supportPoster, getText(l,'supText'), [{ title:getText(l,'req'), payload:"KNOW_REQ" }, { title:"📞 Call", payload:"CALL_B", url: "+918590175977" }]); scheduleRem(uid,l,'GENERAL','Support - Rent + Staff + Marketing'); }
function sendReq(uid,l){ userStates[uid].lastStep='Requirements'; sendImageWA(uid, LINKS.extraPoster, getText(l,'reqText'), [{ title:getText(l,'submit'), payload:"SUBMIT_APP" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }, { title:"📞 Call", payload:"CALL_B", url: "+918590175977" }]); scheduleRem(uid,l,'GENERAL','Requirements'); }
function askCorp(uid,l){ userStates[uid].lastStep='Corporation Check'; sendWA(uid, getText(l,'corpQ'), [{ title:getText(l,'yesCorp'), payload:"CORP_YES" }, { title:getText(l,'noCorp'), payload:"CORP_NO" }, { title:"📞 Call", payload:"CALL_B", url: "+918590175977" }]); scheduleRem(uid,l,'GENERAL','Corporation Check'); }
function sendReady(uid,l){ userStates[uid].lastStep='Ready to Pay 15L'; sendWA(uid, getText(l,'ready15'), [{ title:getText(l,'readyBtn'), payload:"READY_15L" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }, { title:"📞 Call", payload:"CALL_B", url: "+918590175977" }]); scheduleRem(uid,l,'GENERAL','Ready to Pay 15L'); }
async function sendPay(uid,l){
  userStates[uid].lastStep='Pay Rs.5000';
  const TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_ID = process.env.PHONE_NUMBER_ID;
  if(!TOKEN||!PHONE_ID){ console.error(`[TOKEN MISSING FOR PAY]`); return sendWA(uid, `${getText(l,'payReg')}\n${RAZORPAY_ALL}`); }
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_ID}/messages`;
    const headers={ Authorization:`Bearer ${TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"cta_url", header:{ type:"text", text:"💳 Secure Payment" }, body:{ text:`${getText(l,'payReg')}\n\n👇 Tap below button to pay Rs.5000:` }, footer:{ text:"BizMapia Secure Payment via Razorpay" }, action:{ name:"cta_url", parameters:{ display_text:"💳 Pay Now - Rs.5000", url: RAZORPAY_ALL } } } }, {headers});
    setTimeout(async ()=>{
      await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:"After payment, tap below:" }, action:{ buttons:[ { type:"reply", reply:{ id:"PAY_DONE", title:"✅ I Paid - Rs.5000" } }, { type:"phone_number", phone_number: "918590175977", text:"📞 Call" } ]} } }, {headers});
    }, 1500);
    scheduleRem(uid,l,'GENERAL','Pay Rs.5000 - Razorpay '+RAZORPAY_ALL);
  }catch(e){ sendWA(uid, `${getText(l,'payReg')}\n${RAZORPAY_ALL}`, [{ title:"✅ I Paid", payload:"PAY_DONE" }]); }
}
function sendEMI(uid,l){ userStates[uid].lastStep='EMI Options'; sendWA(uid, getText(l,'emiOpt'), [{ title:getText(l,'emi10'), payload:"EMI_10" }, { title:getText(l,'emi20'), payload:"EMI_20" }, { title:"📞 Call", payload:"CALL_B", url: "+918590175977" }]); scheduleRem(uid,l,'GENERAL','EMI Selection'); }
function startLead(uid,l){ clearRem(uid); userStates[uid]={ lang:l, flow:'LEAD', step:1, data:{}, lastStep:'Lead - Name', lang:l }; sendWA(uid, getText(l,'leadAsk')+"\n\nName as per Aadhaar:"); scheduleRem(uid,l,'GENERAL','Lead - Name'); }
function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; s.lastStep='Lead - Place'; sendWA(uid, "Place / District / State?"); scheduleRem(uid,s.lang,'GENERAL','Lead - Place'); } else if(s.step===2){ s.data.place=txt; s.step=3; s.lastStep='Lead - Occupation'; sendWA(uid, getText(s.lang,'occQ'), [{ title:getText(s.lang,'bus'), payload:"OCC_BUS" }, { title:getText(s.lang,'emp'), payload:"OCC_EMP" }, { title:getText(s.lang,'house'), payload:"OCC_HOUSE" }]); scheduleRem(uid,s.lang,'GENERAL','Lead - Occupation'); } }
function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; s.lastStep='Agreement Date'; sendWA(uid, `${getText(s.lang,'tender')}\n${LINKS.tenderDistrict}\n\n${getText(s.lang,'date')}`, [{ title:getText(s.lang,'today'), payload:"DATE_TODAY" }, { title:getText(s.lang,'tom'), payload:"DATE_TOMORROW" }, { title:"📞 Call", payload:"CALL_B", url: "+918590175977" }]); scheduleRem(uid,s.lang,'GENERAL','Agreement Date'); }
function handleDate(uid,d){ const s=userStates[uid]; clearRem(uid); sendWA(uid, `${getText(s.lang,'thanks')} - ${s.data.name} - ${d}`); delete userStates[uid]; }

function onMessage(uid,txt,payload){
  let state=userStates[uid]; const p=(payload||"").trim(); const lower=(txt||"").toLowerCase().trim();
  const isHi = ["hi","hello","hey","hai","hii","start","menu","*hi*"].includes(lower);
  console.log(`[MSG] ${uid} ${txt} ${p} last=${state?.lastStep} hi=${isHi}`);

  if(p.startsWith("LANG_")){
    const l=p.replace("LANG_","").toLowerCase();
    userStates[uid]={ lang:l, flow:'MAIN', data:{}, lastStep:'Main Menu', lang:l };
    sendMain(uid,l); return;
  }
  if(!state){
    sendWelcomeRealtime(uid); return;
  }
  if(isHi){
    const data = getReminderData('Language Selection','en');
    sendWA(uid, `👋 *Hi! Welcome back!*\n\nYou left without selecting language. Tap your language to unlock all 4 services.`, data.buttons);
    return;
  }
  if(p==="RESUME"){
    const data = getReminderData(state.lastStep, state.lang, state.flow);
    sendWA(uid, `Resuming from ${state.lastStep}...\n\n${data.text}`, data.buttons);
    return;
  }
  if(state.flow==='WELCOME' &&!p.startsWith("LANG_")){
    const data = getReminderData('Language Selection', state.lang, 'GENERAL');
    sendWA(uid, `${data.text}`, data.buttons);
    return;
  }
  const lang=state.lang;
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
  if(state.flow==='LEAD'){ handleLead(uid,txt); return; }
  if(!p && lower){
    const data = getReminderData(state.lastStep, state.lang, state.flow);
    sendWA(uid, `${data.text}`, data.buttons);
  }
}

app.post('/webhook', async (req,res)=>{
  res.sendStatus(200);
  try{
    const entry=req.body.entry?.[0]?.changes?.[0]?.value; const msg=entry?.messages?.[0];
    if(msg){
      const uid=msg.from; const txt=msg.text?.body||""; const pl=msg.interactive?.button_reply?.id||"";
      console.log(`[WEBHOOK] Incoming: ${uid} ${txt} ${pl} Token:${!!process.env.WHATSAPP_TOKEN} Phone:${!!process.env.PHONE_NUMBER_ID}`);
      onMessage(uid,txt,pl||txt);
    }
  }catch(e){ console.error(e.message); }
});

app.listen(process.env.PORT||10000,'0.0.0.0',()=>console.log(`V61.0 HD FULL - https://rzp.io/rzp/mq0zG6mS - Token:${!!process.env.WHATSAPP_TOKEN} Phone:${!!process.env.PHONE_NUMBER_ID}`));
