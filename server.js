// ============================================================
// V43.0 FINAL - NEW SCRIPT - FULL CODE
// New Welcome: ALL INDIA 4 services in 1 App!
// ============================================================
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const RAZORPAY_ALL = "https://rzp.io/rzp/mq0zG6mS";
const GENERAL_CALL = "919745226642";
const BUSINESS_CALL = "918590175977";

const LINKS = {
  welcomePoster: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg", // Replace with your new HD poster link for 4K quality
  customerRidePoster: "https://i.ibb.co/204Ztdvh/204Ztdvh.jpg",
  driverPoster: "https://i.ibb.co/67jpyTSS/67jpyTSS.jpg",
  deliveryPoster: "https://i.ibb.co/kgCH9jKM/kgCH9jKM.jpg",
  businessPoster1: "https://i.ibb.co/1WkT9c8.jpg",
  businessPoster2: "https://i.ibb.co/Jg2fVh3/Jg2fVh3.jpg",
  extraPoster: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  districtVideo: "https://youtu.be/bizmapia-district-video",
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  tenderDistrict: "https://bizmapia.com/tender/district.pdf"
};

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let userStates = {};
const processedIds = new Set();

app.get('/', (req,res)=>res.status(200).send(`V43.0 NEW SCRIPT FINAL HD - ${RAZORPAY_ALL} - ${new Date().toISOString()}`));
app.get('/webhook',(req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']);
  res.sendStatus(403);
});

// NEW SCRIPT AS YOU GAVE
const FIRST_BRIEF_CAPTION = `🌟 Welcome to Bizmapia - ALL INDIA 4 services in 1 App!

✅ 🚕 Cheapest Taxi/Auto/Bike – Attractive rates
✅ 🏢 Find 1000000+ Local Businesses Near You
✅ 📦 Fast Parcel Delivery in anywhere within Hours
✅ 🏨 Room/Appointment/Movie Booking
✅ 💰 Earn attractive income Daily/Monthly with Business opportunities

🚀 One App - All Services - All India Opportunity!

👇 Want to know more about Bizmapia and its opportunities, Please select your chatting language to get further information in your chosen language.`;

const T = {
  en:{
    selOpt:"Please select any one from below:", ride:"🚕 Ride - Hailing", dir:"🏢 Business Directory", del:"📦 Online Delivery", book:"🏨 Online Booking", earn:"💰 Earn with Bizmapia", more:"More Options",
    rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle",
    custPost:"🚕 Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount", drivPost:"🚗 Earn by attaching your vehicle - Earn daily with Bizmapia", bookNow:"📲 Book Now", dlDriv:"📲 Download Driver App",
    delIntro:"📦 BizMapia online delivery - Fast Parcel Delivery in 2 Hours anywhere in India", bookPar:"📦 Book your parcel", regDel:"🛵 Register as Delivery Agent",
    bookIntro:"🏨 Online Booking - Hotel/Doctor/Cinema - Book anywhere in India", bookRoom:"🏨 Book room", dlApp:"📲 Download app",
    earnIntro:"You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?", high:"💎 High earning", mod:"💼 Moderate", base:"🏠 Base",
    highIntro:"Great you have selected the right choice. Know details from video link below.\nNote: Only one opportunity in a district, respond earliest.", video:"▶️ Video Link", ben:"📘 Know Benefits", sup:"🤝 Know Support", req:"📋 Requirements", submit:"📝 Submit Application", emi:"💳 EMI options",
    benText:"Benefits 1 - You are the district top level franchisee, percentage on all earnings.\nBenefits 2 - Only you can contact Company", supText:"Support 1 - 12 months marketing\nSupport 2 - 6 months Rent contribution\nSupport 3 - 6 months Staff salary", reqText:"Requirement 1 - >= 90 Sqft room\nRequirement 2 - 1 full time staff\nRequirement 3 - PC/Laptop and Android Mobile",
    corpQ:"Did your district contain corporation?", yesCorp:"Yes Corp", noCorp:"No Corp", ready15:"You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.", readyBtn:"✅ Yes Ready - 15L",
    payReg:"Pay your registration fee Rs.5000 to proceed further. For District/Corporation/Municipal/Business Center", payBtn:"💳 Pay Rs.5000", emiOpt:"Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10:"5L + 10x1L", emi20:"5L + 20x50k",
    leadAsk:"Share contact: Name, Place, District, State, Contact, Occupation", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"📄 Download Tender", date:"Select Agreement Date:", today:"📅 Today", tom:"📅 Tomorrow", thanks:"✅ Thanks! Team will call within 24h", callG:"📞 97452 26642", callB:"📞 85901 75977"
  },
  ml:{
    selOpt:"താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക:", ride:"🚕 റൈഡ് - ടാക്സി/ഓട്ടോ", dir:"🏢 ബിസിനസ് ഡയറക്ടറി", del:"📦 ഓൺലൈൻ ഡെലിവറി", book:"🏨 ഓൺലൈൻ ബുക്കിംഗ്", earn:"💰 ബിസ്മാപിയയിൽ നിന്ന് വരുമാനം", more:"കൂടുതൽ ഓപ്ഷനുകൾ",
    rideOpt:"A. റൈഡ് ബുക്ക് ചെയ്യുക\nB. നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്യുക", bookRide:"റൈഡ് ബുക്ക്", attach:"വാഹനം അറ്റാച്ച്",
    custPost:"🚕 ഇന്ത്യയിൽ എവിടെയും റൈഡ് ബുക്ക് ചെയ്യൂ - ഏറ്റവും വിലകുറഞ്ഞ ടാക്സി/ഓട്ടോ/ബൈക്ക് 10% കിഴിവോടെ", drivPost:"🚗 നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്ത് ദിവസവും വരുമാനം നേടൂ - ബിസ്മാപിയയോടൊപ്പം", bookNow:"📲 ഇപ്പോൾ ബുക്ക് ചെയ്യുക", dlDriv:"📲 ഡ്രൈവർ ആപ്പ് ഡൗൺലോഡ്",
    delIntro:"📦 ബിസ്മാപിയ ഓൺലൈൻ ഡെലിവറി - ഇന്ത്യയിൽ എവിടെയും 2 മണിക്കൂറിൽ പാഴ്സൽ ഡെലിവറി", bookPar:"📦 പാഴ്സൽ ബുക്ക് ചെയ്യുക", regDel:"🛵 ഡെലിവറി ഏജന്റായി രജിസ്റ്റർ ചെയ്യുക",
    bookIntro:"🏨 ഓൺലൈൻ ബുക്കിംഗ് - ഹോട്ടൽ/ഡോക്ടർ/സിനിമ - ഇന്ത്യയിൽ എവിടെയും ബുക്ക് ചെയ്യൂ", bookRoom:"🏨 റൂം ബുക്ക് ചെയ്യുക", dlApp:"📲 ആപ്പ് ഡൗൺലോഡ്",
    earnIntro:"ഇന്ത്യയിൽ എവിടെ നിന്നും ബിസ്മാപിയയിൽ നിന്ന് വരുമാന അവസരം ബുക്ക് ചെയ്യാൻ പോകുകയാണ്. ഏത് തരം അവസരമാണ് നിങ്ങൾ തിരയുന്നത്?", high:"💎 ഉയർന്ന വരുമാനം", mod:"💼 മിതമായ വരുമാനം", base:"🏠 അടിസ്ഥാന വരുമാനം",
    highIntro:"നിങ്ങൾ ശരിയായ തിരഞ്ഞെടുപ്പ് നടത്തി. താഴെയുള്ള വീഡിയോ ലിങ്കിൽ നിന്ന് വിശദാംശങ്ങൾ അറിയുക.\nകുറിപ്പ്: ഒരു ജില്ലയിൽ ഒരു അവസരം മാത്രം, എത്രയും പെട്ടെന്ന് പ്രതികരിക്കുക.", video:"▶️ വീഡിയോ ലിങ്ക്", ben:"📘 ആനുകൂല്യങ്ങൾ അറിയുക", sup:"🤝 പിന്തുണ അറിയുക", req:"📋 ആവശ്യകതകൾ", submit:"📝 അപേക്ഷ സമർപ്പിക്കുക", emi:"💳 EMI ഓപ്ഷനുകൾ",
    benText:"ആനുകൂല്യം 1 - നിങ്ങൾ ജില്ലാ ടോപ്പ് ലെവൽ ഫ്രാഞ്ചൈസിയാണ്, എല്ലാ വരുമാനത്തിലും ശതമാനം.\nആനുകൂല്യം 2 - നിങ്ങൾക്ക് മാത്രമേ കമ്പനിയുമായി ബന്ധപ്പെടാൻ കഴിയൂ", supText:"പിന്തുണ 1 - 12 മാസം മാർക്കറ്റിംഗ്\nപിന്തുണ 2 - 6 മാസം വാടക സഹായം\nപിന്തുണ 3 - 6 മാസം സ്റ്റാഫ് ശമ്പളം", reqText:"ആവശ്യകത 1 - 90 Sqft മുറി\nആവശ്യകത 2 - 1 മുഴുവൻ സമയ ജീവനക്കാരൻ\nആവശ്യകത 3 - PC/Laptop ഉം Android മൊബൈലും",
    corpQ:"നിങ്ങളുടെ ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp:"അതെ കോർപ്പറേഷൻ", noCorp:"ഇല്ല കോർപ്പറേഷൻ", ready15:"നിങ്ങൾ അപേക്ഷ സമർപ്പിക്കാൻ പോകുകയാണ്, 15 ലക്ഷം ജില്ലാ ഫ്രാഞ്ചൈസി ഫീസ് അടയ്ക്കാൻ തയ്യാറാണെന്ന് സ്ഥിരീകരിക്കുക.", readyBtn:"✅ തയ്യാറാണ് - 15L",
    payReg:"രജിസ്ട്രേഷൻ ഫീസ് Rs.5000 അടയ്ക്കുക. ജില്ല/കോർപ്പറേഷൻ/മുനിസിപ്പൽ/ബിസിനസ് സെന്ററിന്", payBtn:"💳 Rs.5000 അടയ്ക്കുക", emiOpt:"EMI തിരഞ്ഞെടുക്കുക: 5 ലക്ഷം + 10 മാസം / 5 ലക്ഷം + 20 മാസം", emi10:"5L + 10x1L", emi20:"5L + 20x50k",
    leadAsk:"ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ പങ്കിടുക: പേര്, സ്ഥലം, ജില്ല, സംസ്ഥാനം, കോൺടാക്ട്, തൊഴിൽ", occQ:"തൊഴിൽ തിരഞ്ഞെടുക്കുക:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", busman:"ബിസിനസ്സ്മാൻ", tender:"📄 ടെൻഡർ ഡൗൺലോഡ്", date:"കരാർ തീയതി തിരഞ്ഞെടുക്കുക:", today:"📅 ഇന്ന്", tom:"📅 നാളെ", thanks:"✅ നന്ദി! ടീം 24 മണിക്കൂറിനുള്ളിൽ വിളിക്കും", callG:"📞 97452 26642", callB:"📞 85901 75977"
  },
  hi:{
    selOpt:"नीचे से कोई एक चुनें:", ride:"🚕 राइड - टैक्सी/ऑटो", dir:"🏢 बिजनेस डायरेक्टरी", del:"📦 ऑनलाइन डिलीवरी", book:"🏨 ऑनलाइन बुकिंग", earn:"💰 बिज़मापिया से कमाएं", more:"और विकल्प",
    rideOpt:"A. राइड बुक करें\nB. अपना वाहन अटैच करें", bookRide:"राइड बुक करें", attach:"वाहन अटैच करें",
    custPost:"🚕 भारत में कहीं भी राइड बुक करें - सबसे सस्ती टैक्सी/ऑटो/बाइक 10% छूट के साथ", drivPost:"🚗 अपना वाहन अटैच करके रोज कमाएं - बिज़मापिया के साथ", bookNow:"📲 अभी बुक करें", dlDriv:"📲 ड्राइवर ऐप डाउनलोड",
    delIntro:"📦 बिज़मापिया ऑनलाइन डिलीवरी - भारत में कहीं भी 2 घंटे में तेज़ पार्सल डिलीवरी", bookPar:"📦 पार्सल बुक करें", regDel:"🛵 डिलीवरी एजेंट के रूप में रजिस्टर करें",
    bookIntro:"🏨 ऑनलाइन बुकिंग - होटल/डॉक्टर/सिनेमा - भारत में कहीं भी बुक करें", bookRoom:"🏨 रूम बुक करें", dlApp:"📲 ऐप डाउनलोड",
    earnIntro:"आप भारत में कहीं से भी बिज़मापिया से कमाने के अवसर के लिए अपना स्लॉट बुक करने जा रहे हैं। आप किस तरह का अवसर देख रहे हैं?", high:"💎 उच्च कमाई", mod:"💼 मध्यम कमाई", base:"🏠 बेस कमाई",
    highIntro:"बहुत बढ़िया आपने सही चुनाव किया है। नीचे दिए गए वीडियो लिंक से विवरण जानें।\nनोट: एक जिले में केवल एक अवसर, सबसे पहले जवाब दें।", video:"▶️ वीडियो लिंक", ben:"📘 लाभ जानें", sup:"🤝 सपोर्ट जानें", req:"📋 आवश्यकताएं", submit:"📝 आवेदन जमा करें", emi:"💳 EMI विकल्प",
    benText:"लाभ 1 - आप जिले के टॉप लेवल फ्रैंचाइजी हैं, सभी कमाई पर प्रतिशत।\nलाभ 2 - केवल आप ही कंपनी से संपर्क कर सकते हैं", supText:"सपोर्ट 1 - 12 महीने मार्केटिंग\nसपोर्ट 2 - 6 महीने किराया योगदान\nसपोर्ट 3 - 6 महीने स्टाफ सैलरी", reqText:"आवश्यकता 1 - 90 Sqft कमरा\nआवश्यकता 2 - 1 फुल टाइम स्टाफ\nआवश्यकता 3 - PC/Laptop और Android मोबाइल",
    corpQ:"क्या आपके जिले में कॉर्पोरेशन है?", yesCorp:"हाँ कॉर्प", noCorp:"नहीं कॉर्प", ready15:"आप आवेदन जमा करने जा रहे हैं, पुष्टि करें कि आप 15 लाख जिला फ्रैंचाइजी फीस देने के लिए तैयार हैं।", readyBtn:"✅ हाँ तैयार - 15L",
    payReg:"अपनी रजिस्ट्रेशन फीस Rs.5000 का भुगतान करें। जिला/कॉर्पोरेशन/नगरपालिका/बिजनेस सेंटर के लिए", payBtn:"💳 Rs.5000 भुगतान", emiOpt:"EMI चुनें: 5 लाख + 10 महीने / 5 लाख + 20 महीने", emi10:"5L + 10x1L", emi20:"5L + 20x50k",
    leadAsk:"संपर्क साझा करें: नाम, स्थान, जिला, राज्य, संपर्क, व्यवसाय", occQ:"व्यवसाय चुनें:", bus:"बिजनेस", house:"गृहिणी", emp:"कर्मचारी", busman:"व्यवसायी", tender:"📄 टेंडर डाउनलोड", date:"समझौता तिथि चुनें:", today:"📅 आज", tom:"📅 कल", thanks:"✅ धन्यवाद! टीम 24 घंटे में कॉल करेगी", callG:"📞 97452 26642", callB:"📞 85901 75977"
  }
};
function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]; }

async function sendMessage(uid, txt, btns=[]){
  if(!uid) return; const clean=String(uid).replace(/\D/g,""); if(!/^\d{10,15}$/.test(clean)) return;
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return;
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`; const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=clean; if(to.length===10) to="91"+to;
    if(btns.length>0){
      const quick=btns.filter(b=>!b.url).slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload||b.title, title:b.title.substring(0,20) }}));
      await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:txt.substring(0,1024) }, action:{ buttons:quick }}}, {headers});
    } else {
      await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:txt }}, {headers});
    }
  }catch(e){ console.error("WA:", e.response?.data||e.message); }
}

async function sendImageHD(uid, imgUrl, cap, btns=[]){
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return sendMessage(uid, cap, btns);
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    await axios.post(url, { messaging_product:"whatsapp", to, type:"image", image:{ link:imgUrl, caption:cap.substring(0,1024) }}, {headers});
    if(btns.length>0){
      setTimeout(async ()=>{
        const quick = btns.filter(b=>!b.url).slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload||b.title, title:b.title.substring(0,20) }}));
        if(quick.length>0){
          await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:"👇 Please tap to continue:" }, action:{ buttons:quick }}}, {headers});
        }
      }, 800);
    }
  }catch(e){ console.error("HD Img:", e.response?.data||e.message); sendMessage(uid, cap, btns); }
}

function sendFirstBriefWithLang(uid){
  sendImageHD(uid, LINKS.welcomePoster, FIRST_BRIEF_CAPTION, [
    { title:"English", payload:"LANG_EN" },
    { title:"हिंदी", payload:"LANG_HI" },
    { title:"മലയാളം", payload:"LANG_ML" }
  ]);
}
function sendMain(uid,l){ sendMessage(uid, getText(l,'selOpt'), [{ title:getText(l,'ride'), payload:"OPT_RIDE" }, { title:getText(l,'earn'), payload:"OPT_EARN" }, { title:getText(l,'more'), payload:"OPT_MORE" }]); }
function sendMore(uid,l){ sendMessage(uid, "More:", [{ title:getText(l,'del'), payload:"OPT_DEL" }, { title:getText(l,'book'), payload:"OPT_BOOK" }, { title:getText(l,'dir'), payload:"OPT_DIR" }]); }
function sendRide(uid,l){ sendMessage(uid, getText(l,'rideOpt'), [{ title:getText(l,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(l,'attach'), payload:"RIDE_ATTACH" }]); }
function sendCust(uid,l){ sendImageHD(uid, LINKS.customerRidePoster, getText(l,'custPost'), [{ title:getText(l,'bookNow'), payload:"BOOK_NOW" }, { title:getText(l,'callG'), payload:"CALL_G" }]); }
function sendDriv(uid,l){ sendImageHD(uid, LINKS.driverPoster, getText(l,'drivPost'), [{ title:getText(l,'dlDriv'), payload:"DL_DRIV" }, { title:getText(l,'callG'), payload:"CALL_G" }]); }
function sendDel(uid,l){ sendImageHD(uid, LINKS.deliveryPoster, getText(l,'delIntro'), [{ title:getText(l,'bookPar'), payload:"DEL_BOOK" }, { title:getText(l,'regDel'), payload:"DEL_REG" }]); }
function sendRoom(uid,l){ sendMessage(uid, getText(l,'bookIntro'), [{ title:getText(l,'bookRoom'), payload:"BOOK_ROOM" }, { title:getText(l,'callG'), payload:"CALL_G" }]); }
function sendEarn(uid,l){ sendImageHD(uid, LINKS.businessPoster1, getText(l,'earnIntro'), [{ title:getText(l,'high'), payload:"EARN_HIGH" }, { title:getText(l,'mod'), payload:"EARN_MOD" }, { title:getText(l,'base'), payload:"EARN_BASE" }]); }
function sendHigh(uid,l){ sendImageHD(uid, LINKS.businessPoster2, getText(l,'highIntro'), [{ title:getText(l,'video'), payload:"KNOW_BEN" }, { title:getText(l,'ben'), payload:"KNOW_BEN" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }
function sendBen(uid,l){ sendMessage(uid, getText(l,'benText'), [{ title:getText(l,'sup'), payload:"KNOW_SUP" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }
function sendSup(uid,l){ sendMessage(uid, getText(l,'supText'), [{ title:getText(l,'req'), payload:"KNOW_REQ" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }
function sendReq(uid,l){ sendMessage(uid, getText(l,'reqText'), [{ title:getText(l,'submit'), payload:"SUBMIT_APP" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }]); }
function askCorp(uid,l){ sendMessage(uid, getText(l,'corpQ'), [{ title:getText(l,'yesCorp'), payload:"CORP_YES" }, { title:getText(l,'noCorp'), payload:"CORP_NO" }]); }
function sendReady(uid,l){ sendMessage(uid, getText(l,'ready15'), [{ title:getText(l,'readyBtn'), payload:"READY_15L" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }]); }

async function sendPay(uid,l){
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return sendMessage(uid, `${getText(l,'payReg')}\n${RAZORPAY_ALL}`, [{ title:getText(l,'payBtn'), payload:"PAY_DONE" }]);
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
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
  }catch(e){
    console.error("Pay Btn:", e.response?.data||e.message);
    sendMessage(uid, `${getText(l,'payReg')}\n${RAZORPAY_ALL}\n\n💳 Pay Now: ${RAZORPAY_ALL}`, [{ title:"✅ I Paid", payload:"PAY_DONE" }]);
  }
}

function sendEMI(uid,l){ sendMessage(uid, getText(l,'emiOpt'), [{ title:getText(l,'emi10'), payload:"EMI_10" }, { title:getText(l,'emi20'), payload:"EMI_20" }]); }
function startLead(uid,l){ userStates[uid]={ lang:l, flow:'LEAD', step:1, data:{}, lang:l }; sendMessage(uid, getText(l,'leadAsk')+"\n\nName as per Aadhaar:"); }
function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; sendMessage(uid, "Place / District / State?"); } else if(s.step===2){ s.data.place=txt; s.step=3; sendMessage(uid, getText(s.lang,'occQ'), [{ title:getText(s.lang,'bus'), payload:"OCC_BUS" }, { title:getText(s.lang,'emp'), payload:"OCC_EMP" }, { title:getText(s.lang,'house'), payload:"OCC_HOUSE" }]); } }
function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; sendMessage(uid, `${getText(s.lang,'tender')}\n${LINKS.tenderDistrict}\n\n${getText(s.lang,'date')}`, [{ title:getText(s.lang,'today'), payload:"DATE_TODAY" }, { title:getText(s.lang,'tom'), payload:"DATE_TOMORROW" }]); }
function handleDate(uid,d){ const s=userStates[uid]; sendMessage(uid, `${getText(s.lang,'thanks')} - ${s.data.name} - ${d}`); delete userStates[uid]; }

function onMessage(uid,txt,payload){
  let state=userStates[uid]; const p=(payload||"").trim(); const lowerTxt=(txt||"").toLowerCase().trim();
  if(p.startsWith("LANG_")){
    const l=p.replace("LANG_","").toLowerCase();
    userStates[uid]={ lang:l, flow:'MAIN', data:{}, lang:l };
    sendMain(uid,l); return;
  }
  if(!state){ userStates[uid]={ lang:'en', flow:'WELCOME', data:{}, lang:'en' }; sendFirstBriefWithLang(uid); return; }
  if(state.flow==='WELCOME' &&!p.startsWith("LANG_")){
    sendImageHD(uid, LINKS.welcomePoster, `🔔 Reminder: You left at language selection.\n\n${FIRST_BRIEF_CAPTION}`, [
      { title:"English", payload:"LANG_EN" },
      { title:"हिंदी", payload:"LANG_HI" },
      { title:"മലയാളം", payload:"LANG_ML" }
    ]);
    return;
  }
  if(!p && lowerTxt){
    const lang=state.lang;
    if(state.flow==='MAIN'){
      sendMessage(uid, `🔔 Reminder: You left at main menu.\n\n${getText(lang,'selOpt')}`, [
        { title:getText(lang,'ride'), payload:"OPT_RIDE" },
        { title:getText(lang,'earn'), payload:"OPT_EARN" },
        { title:getText(lang,'more'), payload:"OPT_MORE" }
      ]); return;
    }
    if(state.flow==='LEAD'){
      if(state.step===1) sendMessage(uid, `🔔 Reminder: Please share your Name as per Aadhaar:`);
      else if(state.step===2) sendMessage(uid, `🔔 Reminder: Please share Place / District / State?`);
      else if(state.step===3) sendMessage(uid, `🔔 Reminder: ${getText(lang,'occQ')}`, [
        { title:getText(lang,'bus'), payload:"OCC_BUS" },
        { title:getText(lang,'emp'), payload:"OCC_EMP" },
        { title:getText(lang,'house'), payload:"OCC_HOUSE" }
      ]);
      return;
    }
    sendMain(uid,lang); return;
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
}

app.post('/webhook', async (req,res)=>{
  try{
    const entry=req.body.entry?.[0]?.changes?.[0]?.value; const msg=entry?.messages?.[0];
    if(msg){
      if(processedIds.has(msg.id)) return res.sendStatus(200); processedIds.add(msg.id); setTimeout(()=>processedIds.delete(msg.id),60000);
      const uid=msg.from; if(!uid||String(uid).includes("test")) return res.sendStatus(200);
      const txt=msg.text?.body||""; const pl=msg.interactive?.button_reply?.id||"";
      onMessage(uid,txt,pl||txt);
    } else {
      const uid=req.body.userId||req.body.from; if(!uid||String(uid).includes("test")) return res.sendStatus(200);
      const txt=req.body.text||""; const pl=req.body.payload||""; onMessage(uid,txt,pl);
    }
  }catch(e){ console.error(e.message); }
  res.sendStatus(200);
});

const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`V43.0 NEW SCRIPT FINAL HD on ${PORT} - ${RAZORPAY_ALL}`));
