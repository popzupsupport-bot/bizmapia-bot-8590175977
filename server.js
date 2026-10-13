// ============================================================
// V48.1 REMINDER ULTIMATE - FIXED & WORKING FOR BIZMAPIA
// Poster FIRST, Buttons SECOND | Left Step + Next Step + Action
// ============================================================
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const RAZORPAY_ALL = "https://rzp.io/rzp/mq0zG6mS";
const GENERAL_CALL = "919745226642";
const BUSINESS_CALL = "918590175977";

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
const processedIds = new Set();
const reminderTimers = {};

app.get('/', (req,res)=>res.status(200).send(`V48.1 WORKING - ${new Date().toISOString()} - ${RAZORPAY_ALL}`));
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

👇 Explore Bizmapia in your preferred language to learn more about our services and opportunities.

👉 Please select your language:`;

const T = {
  en:{ selOpt:"Please select any one from below:", ride:"🚕 Ride - Hailing", dir:"🏢 Business Directory", del:"📦 Online Delivery", book:"🏨 Online Booking", earn:"💰 Earn with Bizmapia", more:"More Options", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle", custPost:"🚕 Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount\n\n📲 Download Customer App: "+LINKS.customerApp, drivPost:"🚗 Earn by attaching your vehicle - Earn daily Rs.1500-2500 with Bizmapia\n\n🚖 Taxi/Auto/Bike all accepted\n💰 Daily payout\n📍 Work in your own district", bookNow:"📲 Book Now", dlDriv:"📲 Download Driver App", delIntro:"📦 BizMapia online delivery - Fast Parcel Delivery in 2 Hours anywhere in India\n\n⚡ 2 Hours Delivery\n📍 Pan India\n💰 Low charges", bookPar:"📦 Book your parcel", regDel:"🛵 Register as Delivery Agent", bookIntro:"🏨 Online Booking - Hotel/Doctor/Cinema - Book anywhere in India\n\n🏨 Hotels - Best rates\n🩺 Doctor Appointments\n🎬 Movie Tickets", bookRoom:"🏨 Book room", dlApp:"📲 Download app", earnIntro:"You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?", high:"💎 High earning", mod:"💼 Moderate", base:"🏠 Base", highIntro:"Great you have selected the right choice. Know details from video link below.\nNote: Only one opportunity in a district, respond earliest.\n\n💎 District Franchise - 15 Lakhs\n💼 Corporation - 7 Lakhs\n🏠 Municipal - 3 Lakhs", video:"▶️ Video Link", ben:"📘 Know Benefits", sup:"🤝 Know Support", req:"📋 Requirements", submit:"📝 Submit Application", emi:"💳 EMI options", benText:"🌟 BENEFITS - District Franchise\n\n✅ Benefits 1 - You are the district top level franchisee, percentage on all earnings in your district\n✅ Benefits 2 - Only you can contact Company directly\n✅ Benefits 3 - Lifetime royalty income\n✅ Benefits 4 - Sub-franchise income", supText:"🤝 SUPPORT - Company will provide\n🎯 Support 1 - 12 months marketing support\n🏠 Support 2 - 6 months Rent contribution\n👨‍💼 Support 3 - 6 months Staff salary support\n📱 Support 4 - Full training + CRM + App access", reqText:"📋 REQUIREMENTS\n\n🏢 Requirement 1 - >= 90 Sqft room\n👨‍💼 Requirement 2 - 1 full time staff\n💻 Requirement 3 - PC/Laptop and Android Mobile\n💰 Requirement 4 - Ready to invest\n📄 Requirement 5 - Aadhaar + PAN", corpQ:"Did your district contain corporation?\n\nIf your district HQ has Corporation (e.g. Ernakulam has Kochi Corporation), select Yes Corp.", yesCorp:"Yes Corp", noCorp:"No Corp", ready15:"You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.", readyBtn:"✅ Yes Ready - 15L", payReg:"Pay your registration fee Rs.5000 to proceed further. For District/Corporation/Municipal/Business Center\n\nThis Rs.5000 is part of 15L, not extra.", payBtn:"💳 Pay Rs.5000", emiOpt:"Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"Share contact: Name, Place, District, State, Contact, Occupation", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"📄 Download Tender", date:"Select Agreement Date:", today:"📅 Today", tom:"📅 Tomorrow", thanks:"✅ Thanks! Team will call within 24h.", callG:"📞 97452 26642", callB:"📞 85901 75977" },
  ml:{ selOpt:"താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക:", ride:"🚕 റൈഡ് - ടാക്സി/ഓട്ടോ", dir:"🏢 ബിസിനസ് ഡയറക്ടറി", del:"📦 ഓൺലൈൻ ഡെലിവറി", book:"🏨 ഓൺലൈൻ ബുക്കിംഗ്", earn:"💰 ബിസ്മാപിയയിൽ നിന്ന് വരുമാനം", more:"കൂടുതൽ ഓപ്ഷനുകൾ", rideOpt:"A. റൈഡ് ബുക്ക് ചെയ്യുക\nB. നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്യുക", bookRide:"റൈഡ് ബുക്ക്", attach:"വാഹനം അറ്റാച്ച്", custPost:"🚕 ഇന്ത്യയിൽ എവിടെയും റൈഡ് ബുക്ക് ചെയ്യൂ", drivPost:"🚗 നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്ത് ദിവസവും വരുമാനം നേടൂ", bookNow:"📲 ഇപ്പോൾ ബുക്ക് ചെയ്യുക", dlDriv:"📲 ഡ്രൈവർ ആപ്പ് ഡൗൺലോഡ്", delIntro:"📦 ബിസ്മാപിയ ഓൺലൈൻ ഡെലിവറി", bookPar:"📦 പാഴ്സൽ ബുക്ക് ചെയ്യുക", regDel:"🛵 ഡെലിവറി ഏജന്റായി രജിസ്റ്റർ ചെയ്യുക", bookIntro:"🏨 ഓൺലൈൻ ബുക്കിംഗ്", bookRoom:"🏨 റൂം ബുക്ക് ചെയ്യുക", dlApp:"📲 ആപ്പ് ഡൗൺലോഡ്", earnIntro:"ഏത് തരം അവസരമാണ് നിങ്ങൾ തിരയുന്നത്?", high:"💎 ഉയർന്ന വരുമാനം", mod:"💼 മിതമായ വരുമാനം", base:"🏠 അടിസ്ഥാന വരുമാനം", highIntro:"നിങ്ങൾ ശരിയായ തിരഞ്ഞെടുപ്പ് നടത്തി.", video:"▶️ വീഡിയോ ലിങ്ക്", ben:"📘 ആനുകൂല്യങ്ങൾ", sup:"🤝 പിന്തുണ", req:"📋 ആവശ്യകതകൾ", submit:"📝 അപേക്ഷ", emi:"💳 EMI", benText:"🌟 ആനുകൂല്യങ്ങൾ", supText:"🤝 പിന്തുണ", reqText:"📋 ആവശ്യകതകൾ", corpQ:"കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp:"അതെ", noCorp:"ഇല്ല", ready15:"15 ലക്ഷം ഫീസ് അടയ്ക്കാൻ തയ്യാറാണോ?", readyBtn:"✅ തയ്യാറാണ് - 15L", payReg:"Rs.5000 അടയ്ക്കുക", payBtn:"💳 Rs.5000", emiOpt:"EMI തിരഞ്ഞെടുക്കുക", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"വിവരങ്ങൾ പങ്കിടുക", occQ:"തൊഴിൽ തിരഞ്ഞെടുക്കുക:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", busman:"ബിസിനസ്സ്മാൻ", tender:"📄 ടെൻഡർ", date:"തീയതി തിരഞ്ഞെടുക്കുക:", today:"📅 ഇന്ന്", tom:"📅 നാളെ", thanks:"✅ നന്ദി!", callG:"📞 97452 26642", callB:"📞 85901 75977" },
  hi:{ selOpt:"नीचे से कोई एक चुनें:", ride:"🚕 राइड - टैक्सी/ऑटो", dir:"🏢 बिजनेस डायरेक्टरी", del:"📦 ऑनलाइन डिलीवरी", book:"🏨 ऑनलाइन बुकिंग", earn:"💰 बिज़मापिया से कमाएं", more:"और विकल्प", rideOpt:"A. राइड बुक करें\nB. अपना वाहन अटैच करें", bookRide:"राइड बुक करें", attach:"वाहन अटैच करें", custPost:"🚕 भारत में कहीं भी राइड बुक करें", drivPost:"🚗 अपना वाहन अटैच करके रोज कमाएं", bookNow:"📲 अभी बुक करें", dlDriv:"📲 ड्राइवर ऐप डाउनलोड", delIntro:"📦 बिज़मापिया ऑनलाइन डिलीवरी", bookPar:"📦 पार्सल बुक करें", regDel:"🛵 डिलीवरी एजेंट", bookIntro:"🏨 ऑनलाइन बुकिंग", bookRoom:"🏨 रूम बुक करें", dlApp:"📲 ऐप डाउनलोड", earnIntro:"किस तरह का अवसर देख रहे हैं?", high:"💎 उच्च कमाई", mod:"💼 मध्यम", base:"🏠 बेस", highIntro:"सही चुनाव किया है।", video:"▶️ वीडियो लिंक", ben:"📘 लाभ", sup:"🤝 सपोर्ट", req:"📋 आवश्यकताएं", submit:"📝 आवेदन", emi:"💳 EMI", benText:"🌟 लाभ", supText:"🤝 सपोर्ट", reqText:"📋 आवश्यकताएं", corpQ:"क्या कॉर्पोरेशन है?", yesCorp:"हाँ कॉर्प", noCorp:"नहीं कॉर्प", ready15:"15 लाख फीस देने के लिए तैयार हैं?", readyBtn:"✅ हाँ तैयार - 15L", payReg:"Rs.5000 भुगतान करें", payBtn:"💳 Rs.5000", emiOpt:"EMI चुनें", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"संपर्क साझा करें", occQ:"व्यवसाय चुनें:", bus:"बिजनेस", house:"गृहिणी", emp:"कर्मचारी", busman:"व्यवसायी", tender:"📄 टेंडर", date:"तिथि चुनें:", today:"📅 आज", tom:"📅 कल", thanks:"✅ धन्यवाद!", callG:"📞 97452 26642", callB:"📞 85901 75977" }
};
function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]||""; }

function formatTo(to){
  let clean = String(to).replace(/\D/g,"");
  if(clean.length===10) clean="91"+clean;
  if(clean.length===11 && clean.startsWith("0")) clean="91"+clean.substring(1);
  return clean;
}

async function sendMessage(uid, txt, btns=[]){
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return;
  const to = formatTo(uid);
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    if(btns.length>0){
      const quick=btns.filter(b=>!b.url).slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload||b.title, title:b.title.substring(0,20) }}));
      await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:txt.substring(0,1024) }, action:{ buttons:quick }}}, {headers});
    } else {
      await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:txt }}, {headers});
    }
  }catch(e){ console.error("WA sendMessage:", e.response?.data||e.message); }
}

async function sendImageHD(uid, imgUrl, cap, btns=[]){
  const to = formatTo(uid);
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    await axios.post(url, { messaging_product:"whatsapp", to, type:"image", image:{ link:imgUrl, caption:cap.substring(0,1024) }}, {headers});
    if(btns.length>0){
      setTimeout(async ()=>{
        try{
          const quick = btns.filter(b=>!b.url).slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload||b.title, title:b.title.substring(0,20) }}));
          if(quick.length>0){
            await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:"👇 Please tap to continue:" }, action:{ buttons:quick }}}, {headers});
          }
        }catch(e){}
      }, 1300);
    }
  }catch(e){
    console.error("Image failed, sending text:", e.response?.data||e.message);
    await sendMessage(uid, cap, btns);
  }
}

function clearReminders(uid){ if(reminderTimers[uid]){ reminderTimers[uid].forEach(t=>clearTimeout(t)); delete reminderTimers[uid]; } }

function getReminderData(lastStep, lang, flowType){
  const isBusiness =!['Ride Selection','Book a Ride','Driver Attach - Earn Daily','Delivery','Room Booking','Main Menu','More Options'].includes(lastStep);
  const callBtn = isBusiness? { title: getText(lang,'callB'), payload:"CALL_B" } : { title: getText(lang,'callG'), payload:"CALL_G" };
  let text = ""; let buttons = [];
  switch(lastStep){
    case 'Language Selection': text=`🔔 Reminder: You left without selecting language.\n\n❌ Left: Started Bizmapia but didn't choose language.\n\n➡️ Next: Select language to unlock 4 services.\n\n⚡ Tap now - 10 sec!`; buttons=[{ title:"English", payload:"LANG_EN" }, { title:"हिंदी", payload:"LANG_HI" }, { title:"മലയാളം", payload:"LANG_ML" }]; break;
    case 'Main Menu': text=`🔔 Reminder: You left at Main Menu.\n\n❌ Left: Didn't choose Ride/Earn/Delivery/Booking.\n\n➡️ Next: Choose one service.\n\n⚡ Tap immediately!`; buttons=[{ title:getText(lang,'ride'), payload:"OPT_RIDE" }, { title:getText(lang,'earn'), payload:"OPT_EARN" }, { title:getText(lang,'more'), payload:"OPT_MORE" }]; break;
    case 'More Options': text=`🔔 Reminder: You left at More Options.\n\n❌ Left: Didn't select Delivery/Booking/Directory.\n\n➡️ Next: Select one.\n\n⚡ Tap now!`; buttons=[{ title:getText(lang,'del'), payload:"OPT_DEL" }, { title:getText(lang,'book'), payload:"OPT_BOOK" }, { title:getText(lang,'dir'), payload:"OPT_DIR" }]; break;
    case 'Ride Selection': text=`🔔 Reminder: You left at Ride Selection.\n\n❌ Left: Didn't choose Book a ride or Attach vehicle.\n\n➡️ Next: Tap Book a ride or Attach to earn.\n\n⚡ Act now!`; buttons=[{ title:getText(lang,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(lang,'attach'), payload:"RIDE_ATTACH" }]; break;
    case 'Book a Ride': text=`🔔 Reminder: You left at Book a Ride.\n\n❌ Left: Saw cheapest taxi offer but didn't book.\n\n➡️ Next: Tap Book Now to download app + 10% discount.\n\n⚡ Book now!`; buttons=[{ title:getText(lang,'bookNow'), payload:"BOOK_NOW" }]; break;
    case 'Driver Attach - Earn Daily': text=`🔔 Reminder: You left without attaching vehicle!\n\n❌ Left: Didn't download driver app - Rs.1500-2500 daily pending.\n\n➡️ Next: Download Driver App + attach in 2 mins.\n\n⚡ Limited slots!`; buttons=[{ title:getText(lang,'dlDriv'), payload:"DL_DRIV" }]; break;
    case 'Delivery': text=`🔔 Reminder: You left at Delivery.\n\n❌ Left: Didn't book parcel or register as agent.\n\n➡️ Next: Tap Book parcel or Register.\n\n⚡ Continue!`; buttons=[{ title:getText(lang,'bookPar'), payload:"DEL_BOOK" }, { title:getText(lang,'regDel'), payload:"DEL_REG" }]; break;
    case 'Room Booking': text=`🔔 Reminder: You left at Booking.\n\n❌ Left: Didn't book hotel/doctor/movie.\n\n➡️ Next: Tap Book room.\n\n⚡ Tap now!`; buttons=[{ title:getText(lang,'bookRoom'), payload:"BOOK_ROOM" }]; break;
    case 'Earn Selection': text=`🔔 Reminder: You left at Earning Opportunity.\n\n❌ Left: Didn't choose High/Moderate/Base.\n\n➡️ Next: Select High earning (15L District) - Only 1 per district!\n\n⚡ District closing fast!`; buttons=[{ title:getText(lang,'high'), payload:"EARN_HIGH" }, { title:getText(lang,'mod'), payload:"EARN_MOD" }]; break;
    case 'High Earning Details': text=`🔔 Reminder: You left after High Earning Video.\n\n❌ Left: Watched video but didn't check Benefits.\n\n➡️ Next: Tap Know Benefits for royalty income.\n\n⚡ Tap now!`; buttons=[{ title:getText(lang,'ben'), payload:"KNOW_BEN" }]; break;
    case 'Benefits': text=`🔔 Reminder: You left at Benefits.\n\n❌ Left: Saw benefits but didn't check Support (12M marketing + 6M rent + staff).\n\n➡️ Next: Tap Know Support.\n\n⚡ Continue!`; buttons=[{ title:getText(lang,'sup'), payload:"KNOW_SUP" }]; break;
    case 'Support - Rent + Staff + Marketing': text=`🔔 Reminder: You left at Support.\n\n❌ Left: Saw support but didn't check Requirements.\n\n➡️ Next: Tap Requirements.\n\n⚡ Tap now!`; buttons=[{ title:getText(lang,'req'), payload:"KNOW_REQ" }]; break;
    case 'Requirements': text=`🔔 Reminder: You left at Requirements.\n\n❌ Left: Saw requirements but didn't submit.\n\n➡️ Next: Tap Submit Application to lock district.\n\n⚡ Only 1 slot per district!`; buttons=[{ title:getText(lang,'submit'), payload:"SUBMIT_APP" }, { title:getText(lang,'emi'), payload:"KNOW_EMI" }]; break;
    case 'Corporation Check': text=`🔔 Reminder: You left at Corporation Check.\n\n❌ Left: Didn't tell if district has Corporation.\n\n➡️ Next: Select Yes Corp / No Corp.\n\n⚡ Tap now!`; buttons=[{ title:getText(lang,'yesCorp'), payload:"CORP_YES" }, { title:getText(lang,'noCorp'), payload:"CORP_NO" }]; break;
    case 'Ready to Pay 15L': text=`🔔 Reminder: You left at Ready to Pay 15L!\n\n❌ Left: Confirmed ready but didn't pay Rs.5000.\n\n➡️ Next: Tap Yes Ready - 15L to pay Rs.5000 (part of 15L).\n\n⚡ Pay now before someone else!`; buttons=[{ title:getText(lang,'readyBtn'), payload:"READY_15L" }]; break;
    case 'Pay Rs.5000': text=`🔔 URGENT: You left at Payment!\n\n❌ Left: Reached payment but didn't complete Rs.5000.\n\n➡️ Next: Tap Pay Now - Rs.5000 to secure district. 5000 is part of 15L.\n\n⚡ Act IMMEDIATELY!`; buttons=[{ title:"💳 Pay Now", payload:"READY_15L" }]; break;
    case 'EMI Options': text=`🔔 Reminder: You left at EMI.\n\n❌ Left: Didn't select EMI plan.\n\n➡️ Next: Choose 5L + 10x1L or 5L + 20x50k.\n\n⚡ Select now!`; buttons=[{ title:getText(lang,'emi10'), payload:"EMI_10" }, { title:getText(lang,'emi20'), payload:"EMI_20" }]; break;
    case 'Lead - Name': text=`🔔 Reminder: You left at Lead Form!\n\n❌ Left: Paid Rs.5000 but didn't share Name.\n\n➡️ Next: Type full name as per Aadhaar.\n\n⚡ Share now - Team calls in 24h!`; buttons=[]; break;
    case 'Lead - Place': text=`🔔 Reminder: You left at Place/District.\n\n❌ Left: Shared name but not place.\n\n➡️ Next: Type Place / District / State.\n\n⚡ Complete now!`; buttons=[]; break;
    case 'Lead - Occupation': text=`🔔 Reminder: You left at Occupation.\n\n❌ Left: Didn't select occupation.\n\n➡️ Next: Tap occupation.\n\n⚡ Tap now!`; buttons=[{ title:getText(lang,'bus'), payload:"OCC_BUS" }, { title:getText(lang,'emp'), payload:"OCC_EMP" }, { title:getText(lang,'house'), payload:"OCC_HOUSE" }]; break;
    case 'Agreement Date': text=`🔔 Reminder: You left at Agreement Date.\n\n❌ Left: Didn't select date.\n\n➡️ Next: Select Today/Tomorrow + Download Tender.\n\n⚡ Final step!`; buttons=[{ title:getText(lang,'today'), payload:"DATE_TODAY" }, { title:getText(lang,'tom'), payload:"DATE_TOMORROW" }]; break;
    default: text=`🔔 Reminder: You left at ${lastStep}.\n\n➡️ Tap Continue to resume!`; buttons=[{ title:"▶️ Continue", payload:"RESUME" }];
  }
  const finalButtons = [...buttons.slice(0,2), callBtn].slice(0,3);
  return { text, buttons: finalButtons };
}

function scheduleReminders(uid, lang, flowType, lastStepName){
  clearReminders(uid);
  const isDriver = flowType==='DRIVER';
  const times = isDriver? [5*60*1000,30*60*1000,60*60*1000,4*60*60*1000,12*60*60*1000,24*60*60*1000] : [5*60*1000,10*60*1000,60*60*1000,8*60*60*1000,18*60*60*1000,24*60*60*1000];
  const labels = isDriver? ["5 min","30 min","1 hour","4 hour","12 hour","24 hour"] : ["5 min","10 min","1 hour","8 hour","18 hour","24 hour"];
  reminderTimers[uid]=[];
  times.forEach((delay, idx)=>{
    const tid=setTimeout(async ()=>{
      const state=userStates[uid]; if(!state) return;
      const data = getReminderData(lastStepName, state.lang||lang, flowType);
      const fullText = `⏰ Reminder (${labels[idx]}):\n\n${data.text}`;
      await sendMessage(uid, fullText, data.buttons);
    }, delay);
    reminderTimers[uid].push(tid);
  });
}

function sendFirstBriefWithLang(uid){
  sendImageHD(uid, LINKS.welcomePoster, FIRST_BRIEF_CAPTION, [
    { title:"English", payload:"LANG_EN" },
    { title:"हिंदी", payload:"LANG_HI" },
    { title:"മലയാളം", payload:"LANG_ML" }
  ]);
  userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', data:{} };
  scheduleReminders(uid,'en','GENERAL','Language Selection');
}
function sendMain(uid,l){ userStates[uid].lang=l; userStates[uid].flow='MAIN'; userStates[uid].lastStep='Main Menu'; sendMessage(uid, getText(l,'selOpt'), [{ title:getText(l,'ride'), payload:"OPT_RIDE" }, { title:getText(l,'earn'), payload:"OPT_EARN" }, { title:getText(l,'more'), payload:"OPT_MORE" }]); scheduleReminders(uid,l,'GENERAL','Main Menu'); }
function sendMore(uid,l){ userStates[uid].lastStep='More Options'; sendMessage(uid, "More:", [{ title:getText(l,'del'), payload:"OPT_DEL" }, { title:getText(l,'book'), payload:"OPT_BOOK" }, { title:getText(l,'dir'), payload:"OPT_DIR" }]); scheduleReminders(uid,l,'GENERAL','More Options'); }
function sendRide(uid,l){ userStates[uid].lastStep='Ride Selection'; sendMessage(uid, getText(l,'rideOpt'), [{ title:getText(l,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(l,'attach'), payload:"RIDE_ATTACH" }]); scheduleReminders(uid,l,'GENERAL','Ride Selection'); }
function sendCust(uid,l){ userStates[uid].lastStep='Book a Ride'; sendImageHD(uid, LINKS.customerRidePoster, getText(l,'custPost'), [{ title:getText(l,'bookNow'), payload:"BOOK_NOW" }, { title:getText(l,'callG'), payload:"CALL_G" }]); scheduleReminders(uid,l,'GENERAL','Book a Ride'); }
function sendDriv(uid,l){ userStates[uid].lastStep='Driver Attach - Earn Daily'; userStates[uid].flow='DRIVER'; sendImageHD(uid, LINKS.driverPoster, getText(l,'drivPost'), [{ title:getText(l,'dlDriv'), payload:"DL_DRIV" }, { title:getText(l,'callG'), payload:"CALL_G" }]); scheduleReminders(uid,l,'DRIVER','Driver Attach - Earn Daily'); }
function sendDel(uid,l){ userStates[uid].lastStep='Delivery'; sendImageHD(uid, LINKS.deliveryPoster, getText(l,'delIntro'), [{ title:getText(l,'bookPar'), payload:"DEL_BOOK" }, { title:getText(l,'regDel'), payload:"DEL_REG" }]); scheduleReminders(uid,l,'GENERAL','Delivery'); }
function sendRoom(uid,l){ userStates[uid].lastStep='Room Booking'; sendMessage(uid, getText(l,'bookIntro'), [{ title:getText(l,'bookRoom'), payload:"BOOK_ROOM" }, { title:getText(l,'callG'), payload:"CALL_G" }]); scheduleReminders(uid,l,'GENERAL','Room Booking'); }
function sendEarn(uid,l){ userStates[uid].lastStep='Earn Selection'; sendImageHD(uid, LINKS.businessPoster1, getText(l,'earnIntro'), [{ title:getText(l,'high'), payload:"EARN_HIGH" }, { title:getText(l,'mod'), payload:"EARN_MOD" }, { title:getText(l,'base'), payload:"EARN_BASE" }]); scheduleReminders(uid,l,'GENERAL','Earn Selection'); }
function sendHigh(uid,l){ userStates[uid].lastStep='High Earning Details'; sendImageHD(uid, LINKS.businessPoster2, getText(l,'highIntro'), [{ title:getText(l,'video'), payload:"KNOW_BEN" }, { title:getText(l,'ben'), payload:"KNOW_BEN" }, { title:getText(l,'callB'), payload:"CALL_B" }]); scheduleReminders(uid,l,'GENERAL','High Earning Details'); }
function sendBen(uid,l){ userStates[uid].lastStep='Benefits'; sendImageHD(uid, LINKS.businessPoster1, getText(l,'benText'), [{ title:getText(l,'sup'), payload:"KNOW_SUP" }, { title:getText(l,'callB'), payload:"CALL_B" }]); scheduleReminders(uid,l,'GENERAL','Benefits'); }
function sendSup(uid,l){ userStates[uid].lastStep='Support - Rent + Staff + Marketing'; sendImageHD(uid, LINKS.supportPoster, getText(l,'supText'), [{ title:getText(l,'req'), payload:"KNOW_REQ" }, { title:getText(l,'callB'), payload:"CALL_B" }]); scheduleReminders(uid,l,'GENERAL','Support - Rent + Staff + Marketing'); }
function sendReq(uid,l){ userStates[uid].lastStep='Requirements'; sendImageHD(uid, LINKS.extraPoster, getText(l,'reqText'), [{ title:getText(l,'submit'), payload:"SUBMIT_APP" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }]); scheduleReminders(uid,l,'GENERAL','Requirements'); }
function askCorp(uid,l){ userStates[uid].lastStep='Corporation Check'; sendMessage(uid, getText(l,'corpQ'), [{ title:getText(l,'yesCorp'), payload:"CORP_YES" }, { title:getText(l,'noCorp'), payload:"CORP_NO" }]); scheduleReminders(uid,l,'GENERAL','Corporation Check'); }
function sendReady(uid,l){ userStates[uid].lastStep='Ready to Pay 15L'; sendMessage(uid, getText(l,'ready15'), [{ title:getText(l,'readyBtn'), payload:"READY_15L" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }]); scheduleReminders(uid,l,'GENERAL','Ready to Pay 15L'); }

async function sendPay(uid,l){
  userStates[uid].lastStep='Pay Rs.5000';
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    const to=formatTo(uid);
    await axios.post(url, {
      messaging_product:"whatsapp", to, type:"interactive",
      interactive:{
        type:"cta_url",
        header:{ type:"text", text:"💳 Secure Payment" },
        body:{ text:`${getText(l,'payReg')}\n\nFor District / Corporation / Municipal / Business Center\n\n👇 Tap below button to pay Rs.5000:` },
        footer:{ text:"BizMapia Secure Payment via Razorpay" },
        action:{ name:"cta_url", parameters:{ display_text:"💳 Pay Now - Rs.5000", url: RAZORPAY_ALL } }
      }
    }, {headers});
    setTimeout(async ()=>{
      await axios.post(url, {
        messaging_product:"whatsapp", to, type:"interactive",
        interactive:{ type:"button", body:{ text:"After payment, tap below:" },
          action:{ buttons:[
            { type:"reply", reply:{ id:"PAY_DONE", title:"✅ I Paid - Rs.5000" } },
            { type:"reply", reply:{ id:"CALL_B", title:getText(l,'callB').substring(0,20) } }
          ]}
        }
      }, {headers});
    }, 1500);
    scheduleReminders(uid,l,'GENERAL','Pay Rs.5000');
  }catch(e){
    console.error("Pay failed", e.response?.data);
    sendMessage(uid, `${getText(l,'payReg')}\n${RAZORPAY_ALL}`, [{ title:"✅ I Paid", payload:"PAY_DONE" }]);
  }
}

function sendEMI(uid,l){ userStates[uid].lastStep='EMI Options'; sendMessage(uid, getText(l,'emiOpt'), [{ title:getText(l,'emi10'), payload:"EMI_10" }, { title:getText(l,'emi20'), payload:"EMI_20" }]); scheduleReminders(uid,l,'GENERAL','EMI Selection'); }
function startLead(uid,l){ clearReminders(uid); userStates[uid]={ lang:l, flow:'LEAD', step:1, data:{}, lastStep:'Lead - Name' }; sendMessage(uid, getText(l,'leadAsk')+"\n\nName as per Aadhaar:"); scheduleReminders(uid,l,'GENERAL','Lead - Name'); }
function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; s.lastStep='Lead - Place'; sendMessage(uid, "Place / District / State?"); scheduleReminders(uid,s.lang,'GENERAL','Lead - Place'); } else if(s.step===2){ s.data.place=txt; s.step=3; s.lastStep='Lead - Occupation'; sendMessage(uid, getText(s.lang,'occQ'), [{ title:getText(s.lang,'bus'), payload:"OCC_BUS" }, { title:getText(s.lang,'emp'), payload:"OCC_EMP" }, { title:getText(s.lang,'house'), payload:"OCC_HOUSE" }]); scheduleReminders(uid,s.lang,'GENERAL','Lead - Occupation'); } }
function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; s.lastStep='Agreement Date'; sendMessage(uid, `${getText(s.lang,'tender')}\n${LINKS.tenderDistrict}\n\n${getText(s.lang,'date')}`, [{ title:getText(s.lang,'today'), payload:"DATE_TODAY" }, { title:getText(s.lang,'tom'), payload:"DATE_TOMORROW" }]); scheduleReminders(uid,s.lang,'GENERAL','Agreement Date'); }
function handleDate(uid,d){ const s=userStates[uid]; clearReminders(uid); sendMessage(uid, `${getText(s.lang,'thanks')} - ${s.data.name} - ${d}\nTeam will call within 24h.`); console.log(`CRM_LEAD | ${uid} | ${s.data.name} | ${s.data.place} | ${s.data.occ} | ${d}`); delete userStates[uid]; }

function onMessage(uid,txt,payload){
  let state=userStates[uid];
  const p=(payload||"").trim();
  if(p.startsWith("LANG_")){
    const l=p.replace("LANG_","").toLowerCase();
    userStates[uid]={ lang:l, flow:'MAIN', data:{}, lastStep:'Main Menu', lang:l };
    sendMain(uid,l); return;
  }
  if(!state){
    sendFirstBriefWithLang(uid); return;
  }
  if(p==="RESUME"){
    const data = getReminderData(state.lastStep, state.lang, state.flow);
    sendMessage(uid, `Resuming from ${state.lastStep}...\n\n${data.text}`, data.buttons);
    return;
  }
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
  if(p==="CALL_G"){ sendMessage(uid, `📞 Call General: ${GENERAL_CALL}`); return; }
  if(p==="CALL_B"){ sendMessage(uid, `📞 Call Business: ${BUSINESS_CALL}`); return; }
  if(state.flow==='LEAD' && txt){ handleLead(uid,txt); return; }

  // If user types random text, remind current step
  const data = getReminderData(state.lastStep, lang, state.flow);
  sendMessage(uid, data.text, data.buttons);
}

app.post('/webhook', async (req,res)=>{
  try{
    const entry=req.body.entry?.[0]?.changes?.[0]?.value;
    const msg=entry?.messages?.[0];
    if(msg){
      if(processedIds.has(msg.id)) return res.sendStatus(200);
      processedIds.add(msg.id); setTimeout(()=>processedIds.delete(msg.id),60000);
      const uid=msg.from;
      const txt=msg.text?.body||"";
      const payload=msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || "";
      console.log(`IN | ${uid} | txt:${txt} | payload:${payload}`);
      onMessage(uid,txt,payload||txt);
    }
  }catch(e){ console.error("Webhook error:", e.message); }
  res.sendStatus(200);
});

const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`V48.1 WORKING on ${PORT}`));
