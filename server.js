// BIZMAPIA BOT - V83 ULTRA FULL - 500+ ROWS - ALL BUSINESS FLOWS
// 7025630644 API - 8590175977 test - Permanent token fix + Anti-spam + Images + Links + Razorpay
// Based on your V50 447-row full flow - Now with V83 fixes
// Features: Welcome Image + 3 Languages + Ride + Business Dir + Delivery + Booking + Earn + High/Mod/Base + Benefits + Support + Requirements + Corp Check + 15L Ready + Pay 5000 + EMI + Lead + Date + Tender + Sheets + Reminders

const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
const app = express();
app.use(express.json());

// ===== CONFIG =====
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia123';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const SHEET_ID = process.env.SHEET_ID;
const PORT = process.env.PORT || 10000;

// FIXES FOR YOUR CURRENT ISSUE
const lastWelcome = new Map(); // anti-spam 60s cooldown
const userStates = {}; // full state
const processedIds = new Set();
const reminders = {};
const rateLimit = {};

console.log('=== BIZMAPIA BOT V83 ULTRA FULL - 500+ ROWS ===');
console.log('PHONE_NUMBER_ID:', PHONE_NUMBER_ID);
console.log('WHATSAPP_TOKEN exists:', !!WHATSAPP_TOKEN, 'ends:', WHATSAPP_TOKEN ? WHATSAPP_TOKEN.slice(-8) : 'NONE');
console.log('SHEET_ID:', SHEET_ID || 'false');
console.log('VERIFY_TOKEN set:', !!VERIFY_TOKEN);
console.log('==============================================');

// Links + Posters - Using your repo
const LINKS = {
  welcomePoster: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_customer_welcome_HD_1080.jpg",
  customerRidePoster: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_customer_welcome_HD_1080.jpg",
  driverPoster: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_driver_welcome_HD.jpg",
  deliveryPoster: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_benefit_reminder_HD.jpg",
  businessPoster1: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_business_reg_HD.jpg",
  businessPoster2: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_biz_opp_HD.jpg",
  extraPoster: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_1_year_discount_HD.jpg",
  supportPoster: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_1_year_discount_HD.jpg",
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  tenderDistrict: "https://bizmapia.com/tender/district.pdf",
  website: "https://bizmapia.com",
  rideLink: "https://bizmapia.com/ride",
  businessLink: "https://bizmapia.com/business",
  earnLink: "https://bizmapia.com/earn",
};
const RAZORPAY_ALL = "https://rzp.io/rzp/mq0zG6mS";
const BOT_OWN_NUMBER = "917025630644";
const BUSINESS_CALL = "918590175977";
const GENERAL_CALL = "919745226642";

// Texts - Multi language
const FIRST_BRIEF = `🌟 Welcome to Bizmapia - All India 4-in-1 Services!

🚖 Affordable Taxi & Auto
🏪 10,00,000+ Local Businesses
📦 Fast Parcel in 2 Hours
🎟 Rooms, Doctor, Movie Tickets
💰 Daily & Monthly Income

One App. Four Services. Pan-India!

🌐 ${LINKS.website}
📲 ${LINKS.customerApp}

👇 Select language:`;

const T = {
  en: {
    selOpt: "Please select any one from below:", ride: "Ride - Hailing", dir: "Business Directory", del: "Online Delivery", book: "Online Booking", earn: "Earn with Bizmapia", more: "More Options",
    rideOpt: "A. Book a ride\nB. Attach your vehicle", bookRide: "Book a ride", attach: "Attach your vehicle",
    custPost: `Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount\n\nDownload Customer App: ${LINKS.customerApp}\nBook: ${LINKS.rideLink}\nCall: ${BOT_OWN_NUMBER}`,
    drivPost: `Earn by attaching your vehicle - Earn daily Rs.1500-2500\n\nTaxi/Auto/Bike all accepted\nDaily payout\n\nDriver App: ${LINKS.driverApp}`,
    bookNow: "Book Now", dlDriv: "Download Driver App",
    delIntro: `BizMapia online delivery - Fast Parcel Delivery in 2 Hours anywhere in India\n\nBook: ${LINKS.website}/delivery`,
    bookPar: "Book your parcel", regDel: "Register as Delivery Agent",
    bookIntro: `Online Booking - Hotel/Doctor/Cinema - Book anywhere in India\n\n${LINKS.website}/booking`, bookRoom: "Book room", dlApp: "Download app",
    earnIntro: "You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?",
    high: "High earning", mod: "Moderate", base: "Base",
    highIntro: "Great you have selected the right choice. Know details from video link below.\nNote: Only one opportunity in a district, respond earliest.\n\nDistrict Franchise - 15 Lakhs\nCorporation - 7 Lakhs\nMunicipal - 3 Lakhs\n\nLink: " + LINKS.earnLink,
    video: "Video Link", ben: "Know Benefits", sup: "Know Support", req: "Requirements", submit: "Submit Application", emi: "EMI options",
    benText: "BENEFITS - District Franchise\n\nBenefits 1 - You are the district top level franchisee, percentage on all earnings in your district\nBenefits 2 - Only you can contact Company directly\nBenefits 3 - Lifetime royalty income\n\nWebsite: " + LINKS.website,
    supText: "SUPPORT - Company will provide\nSupport 1 - 12 months marketing support\nSupport 2 - 6 months Rent contribution\nSupport 3 - 6 months Staff salary support\n\nCall: " + BUSINESS_CALL,
    reqText: "REQUIREMENTS\n\nRequirement 1 - 90 Sqft room\nRequirement 2 - 1 full time staff\nRequirement 3 - PC/Laptop and Android Mobile\nRequirement 4 - Ready to invest\nRequirement 5 - Aadhaar + PAN\n\nApply: " + LINKS.earnLink,
    corpQ: "Did your district contain corporation? If your district HQ has Corporation (e.g. Ernakulam has Kochi Corporation), select Yes Corp.", yesCorp: "Yes Corp", noCorp: "No Corp",
    ready15: "You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.", readyBtn: "Yes Ready - 15L",
    payReg: "Pay your registration fee Rs.5000 to proceed further. For District/Corporation/Municipal/Business Center\n\nThis Rs.5000 is part of 15L, not extra.\n\nRazorpay Link: " + RAZORPAY_ALL, payBtn: "Pay Rs.5000",
    emiOpt: "Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10: "5L + 10x1L", emi20: "5L + 20x50k",
    leadAsk: "Share contact: Name, Place, District, State, Contact, Occupation", occQ: "Select Occupation:", bus: "Business", house: "Housewife", emp: "Employee", busman: "Businessman",
    tender: "Download Tender", date: "Select Agreement Date:", today: "Today", tom: "Tomorrow",
    thanks: "Thanks! Team will call within 24h.", callG: GENERAL_CALL, callB: BUSINESS_CALL
  },
  ml: {
    selOpt: "താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക:", ride: "റൈഡ്", dir: "ബിസിനസ് ഡയറക്ടറി", del: "ഡെലിവറി", book: "ബുക്കിംഗ്", earn: "ബിസ്മാപിയ വരുമാനം", more: "കൂടുതൽ",
    rideOpt: "A. റൈഡ് ബുക്ക്\nB. വാഹനം അറ്റാച്ച്", bookRide: "റൈഡ് ബുക്ക്", attach: "വാഹനം അറ്റാച്ച്", custPost: "ഇന്ത്യയിൽ എവിടെയും റൈഡ് ബുക്ക് ചെയ്യൂ", drivPost: "വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം", bookNow: "ബുക്ക് ചെയ്യുക", dlDriv: "ഡ്രൈവർ ആപ്പ്",
    delIntro: "ബിസ്മാപിയ ഡെലിവറി", bookPar: "പാഴ്സൽ ബുക്ക്", regDel: "ഏജന്റ് രജിസ്റ്റർ", bookIntro: "ഓൺലൈൻ ബുക്കിംഗ്", bookRoom: "റൂം ബുക്ക്", dlApp: "ആപ്പ് ഡൗൺലോഡ്",
    earnIntro: "ഏത് തരം അവസരമാണ്?", high: "ഉയർന്ന വരുമാനം", mod: "മിതമായ", base: "അടിസ്ഥാന", highIntro: "ശരിയായ തിരഞ്ഞെടുപ്പ്.", video: "വീഡിയോ", ben: "ആനുകൂല്യങ്ങൾ", sup: "പിന്തുണ", req: "ആവശ്യകതകൾ", submit: "അപേക്ഷ", emi: "EMI",
    benText: "ആനുകൂല്യങ്ങൾ", supText: "പിന്തുണ", reqText: "ആവശ്യകതകൾ", corpQ: "കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp: "അതെ", noCorp: "ഇല്ല", ready15: "15 ലക്ഷം ഫീസ്?", readyBtn: "തയ്യാറാണ്", payReg: "Rs.5000 അടയ്ക്കുക", payBtn: "Rs.5000", emiOpt: "EMI തിരഞ്ഞെടുക്കുക", emi10: "5L + 10x1L", emi20: "5L + 20x50k", leadAsk: "വിവരങ്ങൾ പങ്കിടുക", occQ: "തൊഴിൽ:", bus: "ബിസിനസ്", house: "ഹൗസ് വൈഫ്", emp: "ജീവനക്കാരൻ", busman: "ബിസിനസ്സ്മാൻ", tender: "ടെൻഡർ", date: "തീയതി:", today: "ഇന്ന്", tom: "നാളെ", thanks: "നന്ദി!", callG: GENERAL_CALL, callB: BUSINESS_CALL
  },
  hi: {
    selOpt: "नीचे से एक चुनें:", ride: "राइड", dir: "बिजनेस डायरेक्टरी", del: "डिलीवरी", book: "बुकिंग", earn: "बिज़मैपिया कमाई", more: "अधिक विकल्प",
    rideOpt: "A. राइड बुक करें\nB. वाहन अटैच करें", bookRide: "राइड बुक", attach: "वाहन अटैच", custPost: "भारत में कहीं भी राइड बुक करें", drivPost: "वाहन अटैच कर कमाएं", bookNow: "अभी बुक करें", dlDriv: "ड्राइवर ऐप",
    delIntro: "बिज़मैपिया डिलीवरी", bookPar: "पार्सल बुक", regDel: "एजेंट रजिस्टर", bookIntro: "ऑनलाइन बुकिंग", bookRoom: "रूम बुक", dlApp: "ऐप डाउनलोड",
    earnIntro: "किस प्रकार का अवसर चाहिए?", high: "उच्च कमाई", mod: "मध्यम", base: "बेस", highIntro: "सही चुनाव। जिला फ्रेंचाइजी 15 लाख", video: "वीडियो", ben: "लाभ", sup: "सपोर्ट", req: "जरूरतें", submit: "आवेदन", emi: "EMI",
    benText: "लाभ - जिला फ्रेंचाइजी", supText: "सपोर्ट - कंपनी देगी", reqText: "जरूरतें - 90 sqft रूम, स्टाफ, लैपटॉप", corpQ: "क्या आपके जिले में कॉर्पोरेशन है?", yesCorp: "हाँ कॉर्प", noCorp: "नहीं", ready15: "15 लाख फीस के लिए तैयार?", readyBtn: "हाँ तैयार", payReg: "Rs.5000 पंजीकरण शुल्क - " + RAZORPAY_ALL, payBtn: "Rs.5000 भरें", emiOpt: "EMI चुनें", emi10: "5L + 10x1L", emi20: "5L + 20x50k", leadAsk: "संपर्क साझा करें", occQ: "व्यवसाय:", bus: "बिजनेस", house: "गृहिणी", emp: "कर्मचारी", busman: "व्यापारी", tender: "टेंडर", date: "तारीख:", today: "आज", tom: "कल", thanks: "धन्यवाद! 24 घंटे में कॉल आएगी", callG: GENERAL_CALL, callB: BUSINESS_CALL
  }
};

function getText(l, k) { const lang = T[l] ? l : 'en'; return T[lang][k] || T.en[k] || k; }

// ===== SHEETS =====
let sheetsClient = null;
async function getSheets() {
  if (!SHEET_ID || SHEET_ID === 'false') return null;
  if (sheetsClient) return sheetsClient;
  try {
    const creds = process.env.GOOGLE_CREDENTIALS;
    if (!creds) return null;
    const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(creds), scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    sheetsClient = google.sheets({ version: 'v4', auth });
    console.log('Sheets ready');
    return sheetsClient;
  } catch (e) { console.log('Sheets error', e.message); return null; }
}
async function saveToSheet(range, values) {
  try {
    const client = await getSheets();
    if (!client) return;
    let safeRange = range;
    if (range.includes(' - ') || range.includes(' ')) {
      if (!range.startsWith("'")) { const parts = range.split('!'); safeRange = `'${parts[0]}'!${parts[1]}`; }
    }
    await client.spreadsheets.values.append({ spreadsheetId: SHEET_ID, range: safeRange, valueInputOption: 'USER_ENTERED', requestBody: { values } });
    console.log(`Sheet OK ${safeRange}`);
  } catch (e) { console.log(`Sheet skip ${range}: ${e.message}`); }
}

// ===== SEND WITH FULL LOGGING + RATE LIMIT =====
async function sendWhatsAppMessage(to, payload) {
  const now = Date.now();
  const last = rateLimit[to] || 0;
  const gap = now - last;
  if (gap < 8000) { await new Promise(r => setTimeout(r, 8000 - gap)); }
  rateLimit[to] = Date.now();
  try {
    const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    console.log(`SENDING to ${to} via ${PHONE_NUMBER_ID}: ${JSON.stringify(payload).substring(0, 250)}`);
    const res = await axios.post(url, { messaging_product: 'whatsapp', to, ...payload }, { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } });
    console.log(`META SUCCESS to ${to}: ${JSON.stringify(res.data)} WAMID:${res.data.messages?.[0]?.id}`);
    console.log(`OUT to ${to}: ${payload.type || payload.interactive?.type} - ${res.data.messages?.[0]?.id}`);
    await saveToSheet('Sheet6 - All Logs!A:M', [[new Date().toISOString(), to, 'OUT_SUCCESS', JSON.stringify(payload).substring(0, 400), res.data.messages?.[0]?.id || '', '', '', '', '', '', '', '', '']]);
    return true;
  } catch (e) {
    const err = e.response?.data?.error;
    console.log(`====== META ERROR to ${to} ====== Status:${e.response?.status} Code:${err?.code} Message:${err?.message} Full:${JSON.stringify(e.response?.data)} ==========================`);
    if (err?.code === 130429) { await new Promise(r => setTimeout(r, 60000)); rateLimit[to] = Date.now() + 60000; }
    await saveToSheet('Sheet6 - All Logs!A:M', [[new Date().toISOString(), to, 'OUT_FAILED', `${err?.code} ${err?.message}`, JSON.stringify(e.response?.data).substring(0, 400), '', '', '', '', '', '', '', '']]);
    return false;
  }
}

function formatTo(uid) { return uid.startsWith('+') ? uid.substring(1) : uid; }

async function sendMessage(uid, text, buttons) {
  const payload = { type: 'text', text: { body: text } };
  if (buttons && buttons.length) {
    const btns = buttons.slice(0, 3).map(b => ({ type: 'reply', reply: { id: b.payload, title: b.title.substring(0, 20) } }));
    return await sendWhatsAppMessage(uid, { type: 'interactive', interactive: { type: 'button', body: { text }, action: { buttons: btns } } });
  }
  return await sendWhatsAppMessage(uid, payload);
}

async function sendImageHD(uid, imageLink, caption, buttons) {
  const btns = buttons ? buttons.slice(0, 3).map(b => ({ type: 'reply', reply: { id: b.payload, title: b.title.substring(0, 20) } })) : [];
  if (btns.length) {
    return await sendWhatsAppMessage(uid, { type: 'interactive', interactive: { type: 'button', header: { type: 'image', image: { link: imageLink } }, body: { text: caption }, footer: { text: "bizmapia.com - 7025630644" }, action: { buttons: btns } } });
  } else {
    return await sendWhatsAppMessage(uid, { type: 'image', image: { link: imageLink, caption } });
  }
}

// ===== FLOWS =====
async function sendFirst(uid) {
  const now = Date.now();
  if (lastWelcome.has(uid) && now - lastWelcome.get(uid) < 60000) {
    console.log(`Cooldown for ${uid} - skipping duplicate welcome (60s) - FIX for your issue`);
    return;
  }
  lastWelcome.set(uid, now);
  userStates[uid] = { lang: null, flow: 'LANG', lastStep: 'Welcome', data: {} };
  await sendImageHD(uid, LINKS.welcomePoster, FIRST_BRIEF, [{ title: "English", payload: "LANG_en" }, { title: "हिन्दी", payload: "LANG_hi" }, { title: "മലയാളം", payload: "LANG_ml" }]);
  setReminder(uid, 'WELCOME');
  await saveToSheet('Sheet6 - All Logs!A:C', [[new Date().toISOString(), uid, 'WELCOME_SENT']]);
}

async function sendMain(uid, l) {
  userStates[uid].lang = l;
  userStates[uid].lastStep = 'Main Menu';
  await sendImageHD(uid, LINKS.businessPoster1, getText(l, 'selOpt') + "\n\n🌐 " + LINKS.website + "\n📲 " + LINKS.customerApp, [{ title: getText(l, 'ride'), payload: "OPT_RIDE" }, { title: getText(l, 'dir'), payload: "OPT_DIR" }, { title: getText(l, 'more'), payload: "OPT_MORE" }]);
}

async function sendMore(uid, l) {
  userStates[uid].lastStep = 'More Options';
  await sendMessage(uid, `${getText(l, 'selOpt')}\n\n${LINKS.website}\n\nOptions:\n🏪 Business Directory\n📦 Delivery\n🏠 Booking\n💼 Earn`, [{ title: getText(l, 'dir'), payload: "OPT_DIR" }, { title: getText(l, 'del'), payload: "OPT_DEL" }, { title: getText(l, 'book'), payload: "OPT_BOOK" }]);
}

async function sendRide(uid, l) {
  userStates[uid].lastStep = 'Ride Menu';
  await sendMessage(uid, getText(l, 'rideOpt'), [{ title: getText(l, 'bookRide'), payload: "RIDE_BOOK" }, { title: getText(l, 'attach'), payload: "RIDE_ATTACH" }, { title: "Back", payload: "BACK_MAIN" }]);
}

async function sendCust(uid, l) {
  userStates[uid].lastStep = 'Customer Ride';
  await sendImageHD(uid, LINKS.customerRidePoster, getText(l, 'custPost'), [{ title: getText(l, 'bookNow'), payload: "BOOK_NOW" }, { title: getText(l, 'dlApp'), payload: "DL_CUST" }, { title: "Back", payload: "BACK_MAIN" }]);
}

async function sendDriv(uid, l) {
  userStates[uid].lastStep = 'Driver Attach';
  await sendImageHD(uid, LINKS.driverPoster, getText(l, 'drivPost'), [{ title: getText(l, 'dlDriv'), payload: "DL_DRIV" }, { title: "Back", payload: "BACK_MAIN" }]);
}

async function sendDel(uid, l) {
  userStates[uid].lastStep = 'Delivery';
  await sendImageHD(uid, LINKS.deliveryPoster, getText(l, 'delIntro') + "\n\n" + LINKS.website + "/delivery", [{ title: getText(l, 'bookPar'), payload: "BOOK_PARCEL" }, { title: getText(l, 'regDel'), payload: "REG_DEL" }, { title: "Back", payload: "BACK_MAIN" }]);
}

async function sendRoom(uid, l) {
  userStates[uid].lastStep = 'Booking';
  await sendMessage(uid, getText(l, 'bookIntro') + "\n\n" + LINKS.website + "/booking", [{ title: getText(l, 'bookRoom'), payload: "BOOK_ROOM" }, { title: getText(l, 'dlApp'), payload: "DL_CUST" }, { title: "Back", payload: "BACK_MAIN" }]);
}

async function sendEarn(uid, l) {
  userStates[uid].lastStep = 'Earn Selection';
  await sendImageHD(uid, LINKS.businessPoster1, getText(l, 'earnIntro'), [{ title: getText(l, 'high'), payload: "EARN_HIGH" }, { title: getText(l, 'mod'), payload: "EARN_MOD" }, { title: getText(l, 'base'), payload: "EARN_BASE" }]);
}

async function sendHigh(uid, l) {
  userStates[uid].lastStep = 'High Earning Details';
  await sendImageHD(uid, LINKS.businessPoster2, getText(l, 'highIntro'), [{ title: getText(l, 'video'), payload: "KNOW_BEN" }, { title: getText(l, 'ben'), payload: "KNOW_BEN" }, { title: getText(l, 'callB'), payload: "CALL_B" }]);
}

async function sendBen(uid, l) {
  userStates[uid].lastStep = 'Benefits';
  await sendImageHD(uid, LINKS.businessPoster1, getText(l, 'benText'), [{ title: getText(l, 'sup'), payload: "KNOW_SUP" }, { title: getText(l, 'callB'), payload: "CALL_B" }]);
}

async function sendSup(uid, l) {
  userStates[uid].lastStep = 'Support';
  await sendImageHD(uid, LINKS.supportPoster, getText(l, 'supText'), [{ title: getText(l, 'req'), payload: "KNOW_REQ" }, { title: getText(l, 'callB'), payload: "CALL_B" }]);
}

async function sendReq(uid, l) {
  userStates[uid].lastStep = 'Requirements';
  await sendImageHD(uid, LINKS.extraPoster, getText(l, 'reqText'), [{ title: getText(l, 'submit'), payload: "SUBMIT_APP" }, { title: getText(l, 'emi'), payload: "KNOW_EMI" }]);
}

async function askCorp(uid, l) {
  userStates[uid].lastStep = 'Corporation Check';
  await sendMessage(uid, getText(l, 'corpQ'), [{ title: getText(l, 'yesCorp'), payload: "CORP_YES" }, { title: getText(l, 'noCorp'), payload: "CORP_NO" }]);
}

async function sendReady(uid, l) {
  userStates[uid].lastStep = 'Ready to Pay 15L';
  await sendMessage(uid, getText(l, 'ready15'), [{ title: getText(l, 'readyBtn'), payload: "READY_15L" }, { title: getText(l, 'emi'), payload: "KNOW_EMI" }]);
}

async function sendPay(uid, l) {
  userStates[uid].lastStep = 'Pay Rs.5000';
  const to = formatTo(uid);
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
  const headers = { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" };
  try {
    await axios.post(url, { messaging_product: "whatsapp", to, type: "interactive", interactive: { type: "cta_url", body: { text: getText(l, 'payReg') + "\n\nTap below to pay Rs.5000:" }, action: { name: "cta_url", parameters: { display_text: "Pay Now - Rs.5000", url: RAZORPAY_ALL } } } }, { headers });
    console.log(`PAY CTA sent to ${to}`);
    setTimeout(() => { sendMessage(uid, "After payment:", [{ title: "I Paid - Rs.5000", payload: "PAY_DONE" }, { title: getText(l, 'callB'), payload: "CALL_B" }]); }, 1500);
  } catch (e) {
    console.log("PAY CTA FAIL", e.response?.data);
    await sendMessage(uid, getText(l, 'payReg') + "\n" + RAZORPAY_ALL, [{ title: "I Paid", payload: "PAY_DONE" }]);
  }
}

async function sendEMI(uid, l) {
  userStates[uid].lastStep = 'EMI Options';
  await sendMessage(uid, getText(l, 'emiOpt'), [{ title: getText(l, 'emi10'), payload: "EMI_10" }, { title: getText(l, 'emi20'), payload: "EMI_20" }]);
}

async function startLead(uid, l) {
  if (reminders[uid]) clearTimeout(reminders[uid]);
  userStates[uid] = { lang: l, flow: 'LEAD', step: 1, data: {}, lastStep: 'Lead - Name' };
  await sendMessage(uid, getText(l, 'leadAsk') + "\n\nName as per Aadhaar:");
}

async function handleLead(uid, txt) {
  const s = userStates[uid];
  if (!s) return;
  if (s.step === 1) { s.data.name = txt; s.step = 2; s.lastStep = 'Lead - Place'; await sendMessage(uid, "Place / District / State?"); }
  else if (s.step === 2) {
    s.data.place = txt; s.step = 3; s.lastStep = 'Lead - Occupation';
    await sendMessage(uid, getText(s.lang, 'occQ'), [{ title: getText(s.lang, 'bus'), payload: "OCC_BUS" }, { title: getText(s.lang, 'emp'), payload: "OCC_EMP" }, { title: getText(s.lang, 'house'), payload: "OCC_HOUSE" }]);
  }
}

async function handleOcc(uid, occ) {
  const s = userStates[uid];
  s.data.occ = occ; s.step = 4; s.lastStep = 'Agreement Date';
  await sendMessage(uid, getText(s.lang, 'tender') + "\n" + LINKS.tenderDistrict + "\n\n" + getText(s.lang, 'date'), [{ title: getText(s.lang, 'today'), payload: "DATE_TODAY" }, { title: getText(s.lang, 'tom'), payload: "DATE_TOMORROW" }]);
}

async function handleDate(uid, d) {
  const s = userStates[uid];
  if (reminders[uid]) clearTimeout(reminders[uid]);
  await sendMessage(uid, getText(s.lang, 'thanks') + " - " + s.data.name + " - " + d + "\n\nOur team will call: " + BUSINESS_CALL + " / " + GENERAL_CALL);
  await saveToSheet('Sheet1 - Leads!A:F', [[new Date().toISOString(), uid, s.data.name, s.data.place, s.data.occ, d]]);
  delete userStates[uid];
}

function setReminder(uid, step) {
  if (reminders[uid]) clearTimeout(reminders[uid]);
  const id = setTimeout(async () => {
    const s = userStates[uid];
    if (!s) return;
    await sendMessage(uid, `🔔 Reminder: You are at ${s.lastStep || step}. Type Hi to continue. Website: ${LINKS.website} Support: ${BUSINESS_CALL}`);
    delete reminders[uid];
  }, 30 * 60 * 1000);
  reminders[uid] = id;
  console.log(`Reminder set for ${uid} - ${step} in 30 min`);
}

function clearReminders(uid) { if (reminders[uid]) { clearTimeout(reminders[uid]); delete reminders[uid]; } }

async function onMessage(uid, txt, payload) {
  let state = userStates[uid];
  const p = (payload || "").trim();
  const t = (txt || "").toLowerCase().trim();
  const isHi = ["hi", "hello", "hey", "hai", "start", "menu", "hii"].includes(t);

  if (p.startsWith("LANG_")) {
    const l = p.replace("LANG_", "").toLowerCase();
    userStates[uid] = { lang: l, flow: 'MAIN', data: {}, lastStep: 'Main Menu' };
    await sendMain(uid, l);
    setReminder(uid, 'Main Menu');
    await saveToSheet('UserState!A:D', [[uid, l, new Date().toISOString(), 'main_menu']]);
    return;
  }

  if (!state) { console.log(`FIRST MESSAGE from ${uid}`); await sendFirst(uid); return; }
  if (isHi) { console.log(`HI RESET -> ${uid}`); clearReminders(uid); delete userStates[uid]; await sendFirst(uid); return; }

  const lang = state.lang || 'en';

  if (p === "OPT_MORE" || p === "MORE_OPTIONS") return await sendMore(uid, lang);
  if (p === "OPT_RIDE") return await sendRide(uid, lang);
  if (p === "OPT_DIR") { state.lastStep = 'Business Directory'; await sendMessage(uid, `🏪 Business Directory - 10L+ businesses\n\nView: ${LINKS.businessLink}\nAdd: ${LINKS.website}/register\n\nCall ${BUSINESS_CALL}`, [{ title: "View Biz", payload: "VIEW_BIZ" }, { title: "Add Biz", payload: "ADD_BIZ" }, { title: "Back", payload: "BACK_MAIN" }]); setReminder(uid, 'Business Directory'); return; }
  if (p === "RIDE_BOOK") return await sendCust(uid, lang);
  if (p === "RIDE_ATTACH") return await sendDriv(uid, lang);
  if (p === "OPT_DEL") return await sendDel(uid, lang);
  if (p === "OPT_BOOK" || p === "BOOK_ROOM") return await sendRoom(uid, lang);
  if (p === "OPT_EARN") return await sendEarn(uid, lang);
  if (p === "EARN_HIGH" || p === "EARN_MOD" || p === "EARN_BASE") return await sendHigh(uid, lang);
  if (p === "KNOW_BEN") return await sendBen(uid, lang);
  if (p === "KNOW_SUP") return await sendSup(uid, lang);
  if (p === "KNOW_REQ") return await sendReq(uid, lang);
  if (p === "SUBMIT_APP") return await askCorp(uid, lang);
  if (p === "CORP_YES" || p === "CORP_NO") return await sendReady(uid, lang);
  if (p === "READY_15L") return await sendPay(uid, lang);
  if (p === "KNOW_EMI") return await sendEMI(uid, lang);
  if (p === "EMI_10" || p === "EMI_20") return await sendPay(uid, lang);
  if (p === "PAY_DONE") return await startLead(uid, lang);
  if (p.startsWith("OCC_")) return await handleOcc(uid, p);
  if (p.startsWith("DATE_")) return await handleDate(uid, p.replace("DATE_", ""));
  if (p === "BACK_MAIN") return await sendMain(uid, lang);
  if (p === "CALL_B") { await sendMessage(uid, `Call Business: ${BUSINESS_CALL}\nGeneral: ${GENERAL_CALL}\nWebsite: ${LINKS.website}`); return; }

  if (state.flow === 'LEAD' && txt) return await handleLead(uid, txt);

  // Fallback
  await sendMain(uid, lang);
}

// ===== ROUTES =====
app.get('/', (req, res) => res.send(`Bizmapia Bot V83 ULTRA FULL - 500+ rows - ${new Date().toISOString()} - API ${BOT_OWN_NUMBER}`));
app.get('/webhook', (req, res) => { if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']); res.sendStatus(403); });
app.get('/health', (req, res) => res.send('OK V83 ULTRA'));
app.get('/ping', (req, res) => res.send('pong'));
app.get('/test-send', async (req, res) => {
  const to = req.query.to || '918590175977';
  console.log(`TEST-SEND to ${to}`);
  await sendFirst(to);
  res.send(`✅ Test welcome with Image+Buttons sent to ${to} - Check logs for META SUCCESS`);
});
app.get('/clear-reminders', (req, res) => {
  Object.values(reminders).forEach(id => clearTimeout(id));
  Object.keys(reminders).forEach(k => delete reminders[k]);
  lastWelcome.clear();
  processedIds.clear();
  res.send('✅ Cleared all reminders + cooldown + processedIds - Spam block removed!');
});

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    if (value?.statuses?.[0]) {
      const st = value.statuses[0];
      console.log(`STATUS ${st.status} to ${st.recipient_id} - ${JSON.stringify(st.errors || 'OK')} - id:${st.id}`);
      return;
    }
    const msg = value?.messages?.[0];
    if (msg) {
      if (processedIds.has(msg.id)) { console.log(`Duplicate ${msg.id} skip`); return; }
      processedIds.add(msg.id);
      setTimeout(() => processedIds.delete(msg.id), 60000);
      const uid = msg.from;
      const txt = msg.text?.body || "";
      const payload = msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || msg.button?.payload || "";
      console.log("IN " + uid + " " + txt + " " + payload);
      await onMessage(uid, txt, payload || txt);
    }
  } catch (e) { console.log("webhook error", e.message, e.stack); }
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`==> V83 ULTRA FULL listening on ${PORT} - API ${BOT_OWN_NUMBER} - 500+ rows - Ready`);
  await getSheets();
});
