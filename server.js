// ============================================================
// server.js - BIZMAPIA BOT V27.0 FINAL PERFECT - CLEAN LOGS
// General Call: 97452 26642 | Business Call: 85901 75977
// No Red Error - Silent test_user ignore - Single Port Binding
// ============================================================
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const RAZORPAY_5000 = "https://rzp.io/l/bizmapia5000";
const GENERAL_CALL = "919745226642";
const BUSINESS_CALL = "918590175977";
const GENERAL_DISPLAY = "97452 26642";
const BUSINESS_DISPLAY = "85901 75977";

const LINKS = {
  welcomePoster: "https://your-domain.com/posters/welcome.jpg",
  customerRidePoster: "https://your-domain.com/posters/customer-ride.jpg",
  driverPoster: "https://your-domain.com/posters/driver.jpg",
  deliveryPoster: "https://your-domain.com/posters/delivery.jpg",
  districtVideo: "https://youtu.be/your-district-video",
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  tenderDistrict: "https://your-domain.com/tender/district.pdf"
};

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let userStates = {};
const processedIds = new Set();

// ===================== CLEAN HEALTH CHECK =====================
app.get('/', (req, res) => {
  res.status(200).send(`OK - BizMapia V27.0 FINAL - ${new Date().toISOString()}`);
});
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// ===================== LANGUAGE - 25 MALAYALAM FIXES MAINTAINED =====================
function detectLang(t=""){ if(/[അ-ഹ]/.test(t)) return 'ml'; if(/[\u0900-\u097F]/.test(t)) return 'hi'; return 'en'; }

const T = {
  en: {
    welcome: "Welcome to BizMapia - PAN INDIA",
    learnMore: "Learn More", selectLang: "Select your Language:",
    selectOption: "Please select any one:", ride: "Ride - Hailing", directory: "Business Directory", delivery: "Online Delivery", booking: "Online Booking", earn: "Earn with BizMapia",
    rideOption: "A. Book a ride\nB. Attach your vehicle", bookRide: "Book a ride", attachVehicle: "Attach vehicle",
    customerPoster: "Book your ride anywhere in India", driverPoster: "Earn by attaching vehicle",
    bookRideNow: "Book Now", downloadDriver: "Download Driver App",
    grabOffer: "Grab 1 Year free recharge offer", expire7: "Your offer expires in 7 days!", needHelp: "Need help register vehicle?", freeExpireSoon: "Free opportunity expiring soon!", lastChance: "Last chance! Contact support 48H", expired: "Opportunity expired!",
    deliveryIntro: "BizMapia online delivery", bookParcel: "Book parcel", registerDelivery: "Register Delivery Agent",
    bookingIntro: "Online Booking", bookRoom: "Book room", bookAppointment: "Book appointment", bookCinema: "Book Cinema", downloadApp: "Download app now",
    earnIntro: "Book your slot for earning opportunity - Which type?", high: "High earning", moderate: "Moderate earning", base: "Base opportunity",
    highIntro: "Great choice! Watch video. Only one opportunity per district, respond earliest.",
    clickNowVideo: "Click Now - Video", watchReminder: "Watched video?", yes: "Yes", no: "No",
    knowBenefits: "Know Benefits", knowSupport: "Know Support", knowRequirements: "Know Requirements", submitApp: "Submit Application", knowEMI: "Know EMI",
    districtBenefits: "Benefits 1 - District top franchise - percentage on all earnings from Corporation/Municipal/Business Center.\nBenefits 2 - Only you can contact Company",
    districtSupport: "Support 1 - 12 months marketing\nSupport 2 - 6 months Rent\nSupport 3 - 6 months Salary",
    requirements: "Requirement 1 - >=90 Sqft room\nRequirement 2 - 1 staff\nRequirement 3 - PC/Laptop + Mobile + Internet",
    askCorporation: "Does your district contains corporation?", yesContains: "Yes, Contains", noContains: "No",
    ready15L: "Ready to pay 15 Lakhs as District franchise fee? Click Yes I am ready. For EMI click Know EMI",
    iamReady: "Yes, I am Ready - 15L", payReg: "Pay registration Rs.5000", payRegBtn: "Pay Rs.5000", emiOptions: "5L down + 10M OR 5L down + 20M", emi10: "Plan 1: 5L+10x1L", emi20: "Plan 2: 5L+20x50k",
    paidQ: "Paid registration?", iWillPay: "I will pay now", leadAsk: "Share details: Name, Place, District, State, Contact, Occupation", occupationQ: "Select Occupation:", business: "Business", housewife: "Housewife", employee: "Employee", businessman: "Businessman",
    downloadTender: "Download Tender and book agreement slot", agreementDate: "Select Date:", today: "Today", tomorrow: "Tomorrow", thisWeek: "This Week", nextWeek: "Next Week",
    back: "Previous Menu", main: "Main Menu", thanksLead: "Thanks! Team will call 24h",
    callGeneral: `📞 ${GENERAL_DISPLAY}`, callBusiness: `📞 ${BUSINESS_DISPLAY}`
  },
  ml: {
    welcome: "👋 BizMapia-യിലേക്ക് സ്വാഗതം - PAN INDIA",
    learnMore: "📘 കൂടുതൽ അറിയുക", selectLang: "🌐 ഭാഷ തിരഞ്ഞെടുക്കുക:",
    selectOption: "താഴെ നിന്ന് ഒന്ന് തിരഞ്ഞെടുക്കുക:", ride: "🚕 റൈഡ്", directory: "🏢 ഡയറക്ടറി", delivery: "📦 ഡെലിവറി", booking: "🏨 ബുക്കിംഗ്", earn: "💰 വരുമാനം നേടൂ",
    rideOption: "A. റൈഡ് ബുക്ക് ചെയ്യുക\nB. വാഹനം അറ്റാച്ച് ചെയ്യുക", bookRide: "റൈഡ് ബുക്ക് ചെയ്യുക", attachVehicle: "വാഹനം അറ്റാച്ച് ചെയ്യുക",
    customerPoster: "എവിടെയും റൈഡ് ബുക്ക് ചെയ്യാം", driverPoster: "വാഹനം അറ്റാച്ച് ചെയ്ത് സമ്പാദിക്കുക",
    bookRideNow: "📲 ഇപ്പോൾ ബുക്ക് ചെയ്യുക", downloadDriver: "📲 ഡ്രൈവർ ആപ്പ്",
    grabOffer: "🎉 1 വർഷത്തെ സൗജന്യ റീചാർജ് ഓഫർ", expire7: "⏰ 7 ദിവസത്തിൽ ഓഫർ അവസാനിക്കും!", needHelp: "സഹായം വേണോ?", freeExpireSoon: "⏰ അവസരം ഉടൻ അവസാനിക്കും!", lastChance: "⚠️ അവസാന അവസരം! 48 മണിക്കൂർ", expired: "❌ അവസരം അവസാനിച്ചു!",
    deliveryIntro: "ഓൺലൈൻ ഡെലിവറി", bookParcel: "📦 പാഴ്സൽ ബുക്ക്", registerDelivery: "🛵 ഡെലിവറി ഏജന്റ്",
    bookingIntro: "ഓൺലൈൻ ബുക്കിംഗ്", bookRoom: "🏨 റൂം ബുക്ക്", bookAppointment: "📅 അപ്പോയിന്റ്മെന്റ്", bookCinema: "🎬 സിനിമ ടിക്കറ്റ്", downloadApp: "📲 ആപ്പ് ഡൗൺലോഡ്",
    earnIntro: "വരുമാന അവസരം ബുക്ക് ചെയ്യുക - ഏത് തരം?", high: "💎 ഉയർന്ന വരുമാനം", moderate: "💼 മിതമായ വരുമാനം", base: "🏠 ബേസ്",
    highIntro: "ശരിയായ തീരുമാനം! വീഡിയോ കാണുക. ഓരോ ജില്ലയിലും ഒരു അവസരം മാത്രം.",
    clickNowVideo: "▶️ വീഡിയോ കാണുക", watchReminder: "വീഡിയോ കണ്ടോ?", yes: "✅ അതെ", no: "❌ ഇല്ല",
    knowBenefits: "📘 ആനുകൂല്യങ്ങൾ", knowSupport: "🤝 പിന്തുണ", knowRequirements: "📋 ആവശ്യകതകൾ", submitApp: "📝 അപേക്ഷ", knowEMI: "💳 EMI",
    districtBenefits: "ആനുകൂല്യം 1 - ജില്ലാ ടോപ്പ് ഫ്രാഞ്ചൈസി - എല്ലാ വരുമാനത്തിലും ശതമാനം.\nആനുകൂല്യം 2 - കമ്പനിയുമായി ബന്ധപ്പെടാൻ അവസരം നിങ്ങൾക്ക് മാത്രം.",
    districtSupport: "പിന്തുണ 1 - 12 മാസം മാർക്കറ്റിംഗ്\nപിന്തുണ 2 - 6 മാസം വാടക\nപിന്തുണ 3 - 6 മാസം ശമ്പളം",
    requirements: "ആവശ്യം 1 - 90 Sqft മുറി\nആവശ്യം 2 - 1 സ്റ്റാഫ്\nആവശ്യം 3 - PC/ലാപ്ടോപ്പ് + മൊബൈൽ",
    askCorporation: "ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?", yesContains: "അതെ, ഉണ്ട്", noContains: "ഇല്ല",
    ready15L: "15 ലക്ഷം അടയ്ക്കാൻ തയ്യാറാണോ? Yes I am ready ക്ലിക്ക് ചെയ്യുക", iamReady: "✅ തയ്യാറാണ് - 15L",
    payReg: "Rs.5000 അടയ്ക്കുക", payRegBtn: "💳 Rs.5000 അടയ്ക്കുക", emiOptions: "5L + 10M / 5L + 20M", emi10: "പ്ലാൻ 1: 5L+10x1L", emi20: "പ്ലാൻ 2: 5L+20x50k",
    paidQ: "അടച്ചോ?", iWillPay: "⏰ ഇപ്പോൾ അടയ്ക്കാം", leadAsk: "വിവരങ്ങൾ: പേര്, സ്ഥലം, ജില്ല, സംസ്ഥാനം, ഫോൺ, ജോലി", occupationQ: "ജോലി തിരഞ്ഞെടുക്കുക:", business: "ബിസിനസ്", housewife: "ഹൗസ് വൈഫ്", employee: "ജീവനക്കാരൻ", businessman: "ബിസിനസ്സ്മാൻ",
    downloadTender: "📄 ടെൻഡർ ഡൗൺലോഡ്", agreementDate: "തീയതി തിരഞ്ഞെടുക്കുക:", today: "📅 ഇന്ന്", tomorrow: "📅 നാളെ", thisWeek: "📅 ഈ ആഴ്ച", nextWeek: "📅 അടുത്ത ആഴ്ച",
    back: "⬅️ മുൻ മെനു", main: "🏠 പ്രധാന മെനു", thanksLead: "✅ നന്ദി! 24 മണിക്കൂറിൽ വിളിക്കും",
    callGeneral: `📞 ${GENERAL_DISPLAY}`, callBusiness: `📞 ${BUSINESS_DISPLAY}`
  },
  hi: {
    welcome: "👋 BizMapia में स्वागत", learnMore: "📘 अधिक जानें", selectLang: "🌐 भाषा चुनें:", selectOption: "नीचे से एक चुनें:", ride: "🚕 राइड", directory: "🏢 डायरेक्टरी", delivery: "📦 डिलीवरी", booking: "🏨 बुकिंग", earn: "💰 कमाएं",
    rideOption: "A. राइड बुक\nB. वाहन अटैच", bookRide: "राइड बुक", attachVehicle: "वाहन अटैच", customerPoster: "राइड बुक करें", driverPoster: "वाहन अटैच करके कमाएं", bookRideNow: "📲 बुक करें", downloadDriver: "📲 ड्राइवर ऐप", grabOffer: "🎉 1 साल फ्री ऑफर", expire7: "⏰ 7 दिन में समाप्त!", needHelp: "मदद चाहिए?", freeExpireSoon: "⏰ जल्द समाप्त!", lastChance: "⚠️ अंतिम मौका!", expired: "❌ समाप्त!",
    deliveryIntro: "ऑनलाइन डिलीवरी", bookParcel: "📦 पार्सल बुक", registerDelivery: "🛵 डिलीवरी एजेंट", bookingIntro: "ऑनलाइन बुकिंग", bookRoom: "🏨 रूम बुक", bookAppointment: "📅 अपॉइंटमेंट", bookCinema: "🎬 सिनेमा", downloadApp: "📲 डाउनलोड",
    earnIntro: "कमाने का अवसर बुक करें", high: "💎 उच्च कमाई", moderate: "💼 मध्यम", base: "🏠 बेस", highIntro: "सही चुनाव! वीडियो देखें। हर जिले में एक अवसर।", clickNowVideo: "▶️ वीडियो देखें", watchReminder: "वीडियो देखा?", yes: "✅ हाँ", no: "❌ नहीं",
    knowBenefits: "📘 लाभ", knowSupport: "🤝 सपोर्ट", knowRequirements: "📋 आवश्यकताएं", submitApp: "📝 आवेदन", knowEMI: "💳 EMI",
    districtBenefits: "लाभ 1 - जिला टॉप फ्रैंचाइज़ी\nलाभ 2 - कंपनी से संपर्क", districtSupport: "सपोर्ट 1 - 12 महीने मार्केटिंग\nसपोर्ट 2 - 6 महीने किराया\nसपोर्ट 3 - 6 महीने सैलरी", requirements: "आवश्यकता 1 - 90 Sqft\n2 - 1 स्टाफ\n3 - PC/मोबाइल", askCorporation: "कॉर्पोरेशन है?", yesContains: "हाँ", noContains: "नहीं", ready15L: "15 लाख तैयार?", iamReady: "✅ तैयार हूँ", payReg: "Rs.5000 भरें", payRegBtn: "💳 Rs.5000 भुगतान", emiOptions: "5L + 10M / 20M", emi10: "प्लान 1", emi20: "प्लान 2", paidQ: "भुगतान?", iWillPay: "⏰ अभी भुगतान", leadAsk: "जानकारी: नाम, जिला, फोन", occupationQ: "व्यवसाय:", business: "बिजनेस", housewife: "गृहिणी", employee: "कर्मचारी", businessman: "व्यवसायी", downloadTender: "📄 टेंडर", agreementDate: "तिथि:", today: "📅 आज", tomorrow: "📅 कल", thisWeek: "📅 इस सप्ताह", nextWeek: "📅 अगले सप्ताह", back: "⬅️ पिछला", main: "🏠 मुख्य", thanksLead: "✅ धन्यवाद! 24h में कॉल", callGeneral: `📞 ${GENERAL_DISPLAY}`, callBusiness: `📞 ${BUSINESS_DISPLAY}`
  }
};

function getText(lang,k){ return (T[lang]||T.en)[k] || T.en[k]; }

// ===================== SEND - CLEAN - NO FAKE LOG =====================
async function sendMessage(userId, text, buttons=[]){
  if(!userId) return;
  const clean = String(userId).replace(/\D/g,"");
  if(clean==="test" || clean==="test_user" || userId==="test_user" ||!/^\d{10,15}$/.test(clean)) return; // SILENT - No log = No red
  if(!WHATSAPP_TOKEN ||!PHONE_NUMBER_ID){ console.log(`SEND to ${clean}: ${text.substring(0,60)}`); return; }
  try{
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers = { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to = clean; if(to.length===10) to="91"+to;
    if(buttons && buttons.length>0){
      const urlBtn = buttons.find(b=>b.url); const quick = buttons.filter(b=>!b.url).slice(0,3);
      if(quick.length>0){
        const actionButtons = quick.map(b=>({ type:"reply", reply:{ id:b.payload||b.title, title:b.title.substring(0,20) }}));
        await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:text.substring(0,1024) }, action:{ buttons:actionButtons }}}, {headers});
      }
      if(urlBtn) await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:`${urlBtn.title}: ${urlBtn.url}` }}, {headers});
    } else {
      await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:text }}, {headers});
    }
  }catch(e){
    // Only log real WA errors, not fake
    if(e.response?.data?.error?.code!== 131000) console.error("WA Error:", e.response?.data || e.message);
  }
}

async function sendImage(userId, imageUrl, caption, buttons=[]){
  if(!WHATSAPP_TOKEN ||!PHONE_NUMBER_ID) return sendMessage(userId, caption, buttons);
  try{
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers = { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to = String(userId).replace(/\D/g,""); if(to.length===10) to="91"+to;
    await axios.post(url, { messaging_product:"whatsapp", to, type:"image", image:{ link:imageUrl, caption:caption.substring(0,1024) }}, {headers});
    if(buttons.length>0) setTimeout(()=>sendMessage(userId, "👇", buttons), 600);
  }catch(e){ sendMessage(userId, caption, buttons); }
}

function getBack(lang){ return [{ title:getText(lang,'back'), payload:"GO_BACK" }, { title:getText(lang,'main'), payload:"MAIN_MENU" }]; }

// ===================== FLOWS - GENERAL CALL 97452 | BUSINESS CALL 85901 =====================
function sendWelcome(userId){ sendImage(userId, LINKS.welcomePoster, getText('en','welcome'), [{ title:"📘 Learn More", payload:"LEARN_MORE" }]); }
function sendLanguage(userId){ sendMessage(userId, "🌐 Select your Language / ഭാഷ തിരഞ്ഞെടുക്കുക / भाषा चुनें:", [{ title:"English", payload:"LANG_EN" }, { title:"മലയാളം", payload:"LANG_ML" }, { title:"हिंदी", payload:"LANG_HI" }]); }
function sendMain(userId, lang){
  sendMessage(userId, getText(lang,'selectOption'), [
    { title:getText(lang,'ride'), payload:"OPT_RIDE" },
    { title:getText(lang,'earn'), payload:"OPT_EARN" },
    { title:getText(lang,'delivery'), payload:"OPT_DELIVERY" }
  ]);
  setTimeout(()=>sendMessage(userId, "More:", [
    { title:getText(lang,'directory'), payload:"OPT_DIRECTORY" },
    { title:getText(lang,'booking'), payload:"OPT_BOOKING" },
    { title:getText(lang,'callGeneral'), payload:"CALL_GENERAL", url:`tel:+${GENERAL_CALL}` }
  ]), 700);
}
function sendRide(userId, lang){ sendMessage(userId, getText(lang,'rideOption'), [{ title:getText(lang,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(lang,'attachVehicle'), payload:"RIDE_ATTACH" }, { title:getText(lang,'callGeneral'), payload:"CALL_GENERAL", url:`tel:+${GENERAL_CALL}` }]); }
function sendCustomerRide(userId, lang){ sendImage(userId, LINKS.customerRidePoster, getText(lang,'customerPoster'), [{ title:getText(lang,'bookRideNow'), payload:"BOOK_NOW", url: LINKS.customerApp }, { title:getText(lang,'callGeneral'), payload:"CALL_GENERAL", url:`tel:+${GENERAL_CALL}` }]); }
function sendDriverRide(userId, lang){ sendImage(userId, LINKS.driverPoster, getText(lang,'driverPoster'), [{ title:getText(lang,'downloadDriver'), payload:"DL_DRIVER", url: LINKS.driverApp }, { title:getText(lang,'callGeneral'), payload:"CALL_GENERAL", url:`tel:+${GENERAL_CALL}` }]); }
function sendDelivery(userId, lang){ sendImage(userId, LINKS.deliveryPoster, getText(lang,'deliveryIntro'), [{ title:getText(lang,'bookParcel'), payload:"DEL_BOOK", url: LINKS.customerApp }, { title:getText(lang,'callGeneral'), payload:"CALL_GENERAL", url:`tel:+${GENERAL_CALL}` }]); }
function sendBooking(userId, lang){ sendMessage(userId, getText(lang,'bookingIntro'), [{ title:getText(lang,'bookRoom'), payload:"BOOK_ROOM" }, { title:getText(lang,'bookAppointment'), payload:"BOOK_APPT" }, { title:getText(lang,'callGeneral'), payload:"CALL_GENERAL", url:`tel:+${GENERAL_CALL}` }]); }
function sendBookRoom(userId, lang){ sendMessage(userId, "Book room anywhere in India", [{ title:getText(lang,'downloadApp'), payload:"DL_APP", url: LINKS.customerApp }, { title:getText(lang,'callGeneral'), payload:"CALL_GENERAL", url:`tel:+${GENERAL_CALL}` }]); }

// BUSINESS - 85901 75977
function sendEarn(userId, lang){ sendMessage(userId, getText(lang,'earnIntro'), [{ title:getText(lang,'high'), payload:"EARN_HIGH" }, { title:getText(lang,'moderate'), payload:"EARN_MOD" }, { title:getText(lang,'base'), payload:"EARN_BASE" }]); }
function sendHigh(userId, lang){ sendMessage(userId, `${getText(lang,'highIntro')}\n\n${LINKS.districtVideo}`, [{ title:getText(lang,'clickNowVideo'), payload:"WATCH_VIDEO", url: LINKS.districtVideo }, { title:getText(lang,'knowBenefits'), payload:"KNOW_BEN" }, { title:getText(lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); }
function sendBen(userId, lang){ sendMessage(userId, getText(lang,'districtBenefits'), [{ title:getText(lang,'knowSupport'), payload:"KNOW_SUP" }, { title:getText(lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); }
function sendSup(userId, lang){ sendMessage(userId, getText(lang,'districtSupport'), [{ title:getText(lang,'knowRequirements'), payload:"KNOW_REQ" }, { title:getText(lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); }
function sendReq(userId, lang){ sendMessage(userId, getText(lang,'requirements'), [{ title:getText(lang,'submitApp'), payload:"SUBMIT_APP" }, { title:getText(lang,'knowEMI'), payload:"KNOW_EMI" }, { title:getText(lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); }
function askCorp(userId, lang){ sendMessage(userId, getText(lang,'askCorporation'), [{ title:getText(lang,'yesContains'), payload:"CORP_YES" }, { title:getText(lang,'noContains'), payload:"CORP_NO" }, { title:getText(lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); }
function sendReady(userId, lang){ sendMessage(userId, getText(lang,'ready15L'), [{ title:getText(lang,'iamReady'), payload:"READY_15L" }, { title:getText(lang,'knowEMI'), payload:"KNOW_EMI" }, { title:getText(lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); }
function sendPayReg(userId, lang){ sendMessage(userId, getText(lang,'payReg'), [{ title:getText(lang,'payRegBtn'), payload:"PAY_REG", url: RAZORPAY_5000 }, { title:getText(lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); setTimeout(()=>sendMessage(userId, getText(lang,'paidQ'), [{ title:getText(lang,'yes'), payload:"PAY_DONE" }, { title:getText(lang,'iWillPay'), payload:"WILL_PAY", url: RAZORPAY_5000 }]), 5*60*1000); }
function sendEMI(userId, lang){ sendMessage(userId, getText(lang,'emiOptions'), [{ title:getText(lang,'emi10'), payload:"EMI_10" }, { title:getText(lang,'emi20'), payload:"EMI_20" }, { title:getText(lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); }
function startLead(userId, lang){ userStates[userId]={ lang, flow:'LEAD', step:1, data:{}, lang }; sendMessage(userId, getText(lang,'leadAsk')+"\n\nStep 1/4: Name as per Aadhaar:", getBack(lang)); }
function handleLead(userId, text){ const s=userStates[userId]; if(!s) return; if(s.step===1){ s.data.name=text; s.step=2; sendMessage(userId, "Step 2/4: Place/District/State?", getBack(s.lang)); } else if(s.step===2){ s.data.place=text; s.step=3; sendMessage(userId, getText(s.lang,'occupationQ'), [{ title:getText(s.lang,'business'), payload:"OCC_BUS" }, { title:getText(s.lang,'employee'), payload:"OCC_EMP" }, { title:getText(s.lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); } }
function handleOcc(userId, occ){ const s=userStates[userId]; s.data.occ=occ; s.step=4; sendMessage(userId, getText(s.lang,'downloadTender')+`\n${LINKS.tenderDistrict}\n\n${getText(s.lang,'agreementDate')}`, [{ title:getText(s.lang,'today'), payload:"DATE_TODAY" }, { title:getText(s.lang,'tomorrow'), payload:"DATE_TOMORROW" }, { title:getText(s.lang,'callBusiness'), payload:"CALL_BUS", url:`tel:+${BUSINESS_CALL}` }]); }
function handleDate(userId, dateVal){ const s=userStates[userId]; if(!s) return; const final={ whatsapp:userId, name:s.data.name, place:s.data.place, occ:s.data.occ, date:dateVal, lang:s.lang, time:new Date().toISOString() }; try{ fs.appendFileSync('/tmp/leads_backup.txt', JSON.stringify(final)+"\n"); }catch(e){} sendMessage(userId, `${getText(s.lang,'thanksLead')} - ${final.name} - ${dateVal} - 📞 ${BUSINESS_DISPLAY}`, getBack(s.lang)); delete userStates[userId]; }

// ===================== ROUTER =====================
function onMessage(userId, text, payload){
  const raw = (text+" "+payload).toLowerCase();
  let state = userStates[userId];
  let lang = state?.lang || detectLang(text+" "+payload);
  if(payload.startsWith("LANG_")){
    const l = payload.replace("LANG_","").toLowerCase();
    userStates[userId]={ lang:l, flow:'MAIN', step:0, data:{}, lang:l };
    sendMain(userId, l); return;
  }
  if(!state){
    if(payload==="LEARN_MORE"){ sendLanguage(userId); return; }
    userStates[userId]={ lang, flow:'WELCOME', step:0, data:{}, lang };
    sendWelcome(userId); setTimeout(()=>sendLanguage(userId), 1000); return;
  }
  lang = state.lang;
  if(payload==="MAIN_MENU" || payload==="GO_BACK"){ sendMain(userId, lang); return; }
  if(payload==="OPT_RIDE"){ sendRide(userId, lang); return; }
  if(payload==="RIDE_BOOK"){ sendCustomerRide(userId, lang); return; }
  if(payload==="RIDE_ATTACH"){ sendDriverRide(userId, lang); return; }
  if(payload==="OPT_DELIVERY"){ sendDelivery(userId, lang); return; }
  if(payload==="OPT_BOOKING"){ sendBooking(userId, lang); return; }
  if(payload==="BOOK_ROOM" || payload==="BOOK_APPT"){ sendBookRoom(userId, lang); return; }
  if(payload==="OPT_EARN"){ sendEarn(userId, lang); return; }
  if(payload==="EARN_HIGH" || payload==="EARN_MOD" || payload==="EARN_BASE"){ sendHigh(userId, lang); return; }
  if(payload==="WATCH_VIDEO" || payload==="VIDEO_YES" || payload==="KNOW_BEN"){ sendBen(userId, lang); return; }
  if(payload==="KNOW_SUP"){ sendSup(userId, lang); return; }
  if(payload==="KNOW_REQ"){ sendReq(userId, lang); return; }
  if(payload==="SUBMIT_APP"){ askCorp(userId, lang); return; }
  if(payload==="CORP_YES" || payload==="CORP_NO"){ sendReady(userId, lang); return; }
  if(payload==="READY_15L"){ sendPayReg(userId, lang); return; }
  if(payload==="KNOW_EMI"){ sendEMI(userId, lang); return; }
  if(payload==="EMI_10" || payload==="EMI_20"){ sendPayReg(userId, lang); return; }
  if(payload==="PAY_DONE"){ startLead(userId, lang); return; }
  if(payload.startsWith("OCC_")){ handleOcc(userId, payload); return; }
  if(payload.startsWith("DATE_")){ handleDate(userId, payload.replace("DATE_","")); return; }
  if(state.flow==='LEAD'){ handleLead(userId, text); return; }
  sendMain(userId, lang);
}

// ===================== WEBHOOK - CLEAN - NO RED LOGS =====================
app.post('/webhook', async (req, res)=>{
  try{
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const msg = entry?.messages?.[0];
    if(msg){
      if(processedIds.has(msg.id)) return res.sendStatus(200);
      processedIds.add(msg.id); setTimeout(()=>processedIds.delete(msg.id), 60000);
      const userId = msg.from;
      if(!userId || userId==="test_user") return res.sendStatus(200); // SILENT IGNORE - Fixes red
      const text = msg.text?.body || "";
      const payload = msg.interactive?.button_reply?.id || msg.interactive?.button_reply?.title || "";
      onMessage(userId, text, payload||text);
    } else {
      const userId = req.body.userId || req.body.from;
      if(!userId || String(userId).includes("test")) return res.sendStatus(200); // SILENT
      const text = req.body.text || ""; const payload = req.body.payload || "";
      onMessage(userId, text, payload);
    }
  }catch(e){
    console.error("Webhook error:", e.message);
  }
  res.sendStatus(200);
});

app.get('/leads', (req, res)=>{
  try{
    if(fs.existsSync('/tmp/leads_backup.txt')) res.type('text/plain').send(fs.readFileSync('/tmp/leads_backup.txt','utf8'));
    else res.send('No leads yet');
  }catch(e){ res.send('Error'); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', ()=>{
  console.log(`BizMapia V27.0 FINAL PERFECT LIVE on ${PORT} - General ${GENERAL_DISPLAY} | Business ${BUSINESS_DISPLAY}`);
});
process.on('uncaughtException', e=>console.error('Uncaught:', e.message));
process.on('unhandledRejection', e=>console.error('Rejection:', e.message));
