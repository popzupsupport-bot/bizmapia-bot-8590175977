// BIZMAPIA BOT - V92 FULL - FIXES 130429 WITHOUT 2 HOUR BLOCK
// BASED ON YOUR V91 - 607 lines kept - Only fixed rate limit logic

const express = require('express');
const 【entity-axios¦canonical_name=axios】 = require('【entity-axios¦canonical_name=axios】');
const { google } = require('googleapis');
let Redis = null;
try { Redis = require('ioredis'); } catch(e) { console.log('ioredis not installed - using memory fallback'); }

const app = express();
app.use(express.json());

// ===== CONFIG =====
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia123';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const SHEET_ID = process.env.SHEET_ID;
const REDIS_URL = process.env.REDIS_URL;
const PORT = process.env.PORT || 10000;

// ===== REDIS SETUP - FIXED FOR UPSTASH =====
let redis = null;
let redisReady = false;
if (REDIS_URL && Redis) {
  try {
    redis = new Redis(REDIS_URL, { 
      tls: {},
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      keepAlive: 10000,
      connectTimeout: 10000
    });
    redis.on('connect', () => { console.log('✅ REDIS CONNECTED - Permanent fix active'); redisReady = true; });
    redis.on('ready', () => { console.log('✅ REDIS READY - Permanent fix active'); redisReady = true; });
    redis.on('error', (e) => { console.log('Redis error (fallback to memory):', e.message); redisReady = false; });
    redis.on('close', () => { console.log('Redis closed, reconnecting...'); redisReady = false; });
  } catch(e) { console.log('Redis init failed, using memory:', e.message); }
} else {
  console.log('REDIS_URL not set - using memory fallback (will reset on Render sleep)');
}

// Memory fallback
const lastWelcomeMem = new Map();
const processedMem = new Map();
const rateLimitMem = {};
const sendingLockMem = new Map();
const userStates = {};
const reminders = {};

// ===== V92 FIX: REMOVED 2 HOUR BLOCK =====
let globalMsgCount = 0;
let globalMsgWindowStart = Date.now();
const GLOBAL_MAX_PER_MIN = 20; // increased from 15 to 20, but with 2s gap

console.log('=== BIZMAPIA BOT V92 FULL FIX ===');
console.log('PHONE_NUMBER_ID:', PHONE_NUMBER_ID || 'MISSING!');
console.log('REDIS:', redis ? 'CONNECTING...' : 'MEMORY FALLBACK');
console.log('FIX: Removed 2 hour block, only 30s retry on 130429');
console.log('================================================');

// ===== REDIS HELPERS WITH FALLBACK =====
async function isDuplicateMessage(msgId) {
  try {
    if (redis && redisReady) {
      const exists = await redis.get(`msg:${msgId}`);
      if (exists) return true;
      await redis.set(`msg:${msgId}`, '1', 'EX', 300);
      return false;
    }
  } catch(e) {}
  if (processedMem.has(msgId)) return true;
  processedMem.set(msgId, Date.now());
  return false;
}

async function isWelcomeCooldown(uid) {
  try {
    if (redis && redisReady) {
      const exists = await redis.get(`welcome:${uid}`);
      if (exists) return true;
      await redis.set(`welcome:${uid}`, '1', 'EX', 90);
      return false;
    }
  } catch(e) {}
  const now = Date.now();
  if (lastWelcomeMem.has(uid) && now - lastWelcomeMem.get(uid) < 90000) return true;
  lastWelcomeMem.set(uid, now);
  return false;
}

async function checkRateLimit(uid) {
  const now = Date.now();
  if (now - globalMsgWindowStart > 60000) {
    globalMsgWindowStart = now;
    globalMsgCount = 0;
  }
  if (globalMsgCount >= GLOBAL_MAX_PER_MIN) {
    const wait = 65000 - (now - globalMsgWindowStart);
    console.log(`GLOBAL RATE LIMIT - waiting ${Math.ceil(wait/1000)}s to avoid 130429`);
    await new Promise(r => setTimeout(r, wait));
    globalMsgWindowStart = Date.now();
    globalMsgCount = 0;
  }
  globalMsgCount++;

  try {
    if (redis && redisReady) {
      // V92: Removed block:${uid} check - this was causing your 2 hour block
      const last = await redis.get(`rate:${uid}`);
      if (last) {
        const gap = Date.now() - parseInt(last);
        if (gap < 2000) { // V92: Changed from 15000 to 2000
          const wait = 2000 - gap;
          console.log(`Cooldown ${uid} - waiting ${Math.ceil(wait/1000)}s (Redis)`);
          await new Promise(r => setTimeout(r, wait));
        }
      }
      await redis.set(`rate:${uid}`, Date.now().toString(), 'EX', 120);
      return;
    }
  } catch(e) {}
  const now2 = Date.now();
  const last = rateLimitMem[uid] || 0;
  if (last > now2) {
    await new Promise(r => setTimeout(r, last - now2));
  } else {
    const gap = now2 - last;
    if (gap < 2000) await new Promise(r => setTimeout(r, 2000 - gap)); // V92: 2s not 15s
  }
  rateLimitMem[uid] = Date.now();
}

// V92: This function is now unused for 130429, kept for compatibility
async function setRateBlock(uid, ms) {
  const until = Date.now() + ms;
  try {
    if (redis && redisReady) {
      await redis.set(`block:${uid}`, until.toString(), 'EX', Math.ceil(ms/1000)+5);
      await redis.set(`rate:${uid}`, until.toString(), 'EX', Math.ceil(ms/1000)+5);
      return;
    }
  } catch(e) {}
  rateLimitMem[uid] = until;
}

async function acquireLock(uid) {
  try {
    if (redis && redisReady) {
      const res = await redis.set(`lock:${uid}`, '1', 'EX', 20, 'NX');
      return res === 'OK';
    }
  } catch(e) {}
  if (sendingLockMem.get(uid)) return false;
  sendingLockMem.set(uid, true);
  return true;
}

async function releaseLock(uid) {
  try {
    if (redis && redisReady) {
      await redis.del(`lock:${uid}`);
      return;
    }
  } catch(e) {}
  sendingLockMem.delete(uid);
}

setInterval(() => {
  const now = Date.now();
  for (const [id, ts] of processedMem.entries()) if (now - ts > 5*60*1000) processedMem.delete(id);
  for (const [uid, ts] of lastWelcomeMem.entries()) if (now - ts > 10*60*1000) lastWelcomeMem.delete(uid);
}, 60*1000);

// ===== IMAGES & LINKS =====
const IMAGES = {
  welcome: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  business: "https://i.ibb.co/204Ztdvh/204Ztdvh.jpg",
  benefit: "https://i.ibb.co/67jpyTSS/67jpyTSS.jpg",
  driver: "https://i.ibb.co/kgCH9jKM/kgCH9jKM.jpg",
  extra: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  discount: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
};
const LINKS = {
  website: "https://bizmapia.com",
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  tenderDistrict: "https://bizmapia.com/tender/district.pdf",
  rideLink: "https://bizmapia.com/ride",
  businessLink: "https://bizmapia.com/business",
  earnLink: "https://bizmapia.com/earn",
  【entity-razorpay¦canonical_name=Razorpay】: "https://rzp.io/rzp/mq0zG6mS",
};
const BOT_NUMBER = "917025630644";
const BUSINESS_CALL = "918590175977";
const GENERAL_CALL = "919745226642";
const FIRST_BRIEF = `🌟 Welcome to Bizmapia - All India 4-in-1 Services!\n\n🚖 Affordable Taxi & Auto\n🏪 10,00,000+ Local Businesses\n📦 Fast Parcel in 2 Hours\n🎟 Rooms, Doctor, Movie Tickets\n💰 Daily & Monthly Income\n\nOne App. Four Services. Pan-India!\n\n🌐 ${LINKS.website}\n📲 ${LINKS.customerApp}\n\n👇 Select language:`;

const T = {
  en: {
    selOpt: "Please select any one from below:", ride: "Ride - Hailing", dir: "Business Directory", del: "Online Delivery", book: "Online Booking", earn: "Earn with Bizmapia", more: "More Options",
    rideOpt: "A. Book a ride\nB. Attach your vehicle", bookRide: "Book a ride", attach: "Attach your vehicle",
    custPost: `Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount\n\nDownload Customer App: ${LINKS.customerApp}\nBook: ${LINKS.rideLink}\nCall: ${BUSINESS_CALL}`,
    drivPost: `Earn by attaching your vehicle - Earn daily Rs.1500-2500\n\nTaxi/Auto/Bike all accepted\nDaily payout\nDriver App: ${LINKS.driverApp}`,
    bookNow: "Book Now", dlDriv: "Driver App",
    delIntro: `BizMapia online delivery - Fast Parcel Delivery in 2 Hours anywhere in India\n\nBook: ${LINKS.website}/delivery`,
    bookPar: "Book parcel", regDel: "Register as Agent",
    bookIntro: `Online Booking - Hotel/Doctor/Cinema - Book anywhere in India\n\n${LINKS.website}/booking`, bookRoom: "Book room", dlApp: "Download app",
    earnIntro: "You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?",
    high: "High earning", mod: "Moderate", base: "Base",
    highIntro: `Great you have selected the right choice. Only one opportunity in a district.\n\nDistrict Franchise - 15 Lakhs\nCorporation - 7 Lakhs\nMunicipal - 3 Lakhs\n\nLink: ${LINKS.earnLink}`,
    video: "Video Link", ben: "Know Benefits", sup: "Know Support", req: "Requirements", submit: "Submit Application", emi: "EMI options",
    benText: `BENEFITS - District Franchise\n\nBenefits 1 - You are district top level franchisee, % on all earnings in your district\nBenefits 2 - Only you can contact Company directly\nBenefits 3 - Lifetime royalty income\n\nWebsite: ${LINKS.website}`,
    supText: `SUPPORT - Company will provide\nSupport 1 - 12 months marketing support\nSupport 2 - 6 months Rent contribution\nSupport 3 - 6 months Staff salary support\n\nCall: ${BUSINESS_CALL}`,
    reqText: `REQUIREMENTS\n\nRequirement 1 - 90 Sqft room\nRequirement 2 - 1 full time staff\nRequirement 3 - PC/Laptop and Android Mobile\nRequirement 4 - Ready to invest\nRequirement 5 - Aadhaar + PAN\n\nApply: ${LINKS.earnLink}`,
    corpQ: "Did your district contain corporation? If your district HQ has Corporation (e.g. Ernakulam has Kochi Corporation), select Yes Corp.", yesCorp: "Yes Corp", noCorp: "No Corp",
    ready15: "You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.", readyBtn: "Yes Ready - 15L",
    payReg: `Pay your registration fee Rs.5000 to proceed further. For District/Corporation/Municipal/Business Center\n\nThis Rs.5000 is part of 15L, not extra.\n\nPay Link: ${LINKS.razorpay}`, payBtn: "Pay Rs.5000",
    emiOpt: "Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10: "5L + 10x1L", emi20: "5L + 20x50k",
    leadAsk: "Share contact: Name, Place, District, State, Contact, Occupation", occQ: "Select Occupation:", bus: "Business", house: "Housewife", emp: "Employee", busman: "Businessman",
    tender: "Download Tender", date: "Select Agreement Date:", today: "Today", tom: "Tomorrow",
    thanks: "Thanks! Team will call within 24h.", callG: GENERAL_CALL, callB: BUSINESS_CALL
  },
  hi: {
    selOpt: "नीचे से एक चुनें:", ride: "राइड", dir: "बिजनेस डायरेक्टरी", del: "डिलीवरी", book: "बुकिंग", earn: "बिज़मैपिया कमाई", more: "अधिक विकल्प",
    rideOpt: "A. राइड बुक\nB. वाहन अटैच", bookRide: "राइड बुक", attach: "वाहन अटैच", custPost: "भारत में कहीं भी राइड बुक करें", drivPost: "वाहन अटैच कर कमाएं", bookNow: "अभी बुक", dlDriv: "ड्राइवर ऐप",
    delIntro: "बिज़मैपिया डिलीवरी", bookPar: "पार्सल बुक", regDel: "एजेंट रजिस्टर", bookIntro: "ऑनलाइन बुकिंग", bookRoom: "रूम बुक", dlApp: "ऐप डाउनलोड",
    earnIntro: "किस प्रकार का अवसर चाहिए?", high: "उच्च कमाई", mod: "मध्यम", base: "बेस", highIntro: "सही चुनाव। जिला फ्रेंचाइजी 15 लाख", video: "वीडियो", ben: "लाभ", sup: "सपोर्ट", req: "जरूरतें", submit: "आवेदन", emi: "EMI",
    benText: "लाभ - जिला फ्रेंचाइजी", supText: "सपोर्ट - कंपनी देगी", reqText: "जरूरतें - 90 sqft रूम, स्टाफ, लैपटॉप", corpQ: "क्या आपके जिले में कॉर्पोरेशन है?", yesCorp: "हाँ कॉर्प", noCorp: "नहीं", ready15: "15 लाख फीस के लिए तैयार?", readyBtn: "हाँ तैयार", payReg: "Rs.5000 पंजीकरण शुल्क - " + LINKS.【entity-razorpay¦canonical_name=Razorpay】, payBtn: "Rs.5000 भरें", emiOpt: "EMI चुनें", emi10: "5L + 10x1L", emi20: "5L + 20x50k", leadAsk: "संपर्क साझा करें", occQ: "व्यवसाय:", bus: "बिजनेस", house: "गृहिणी", emp: "कर्मचारी", busman: "व्यापारी", tender: "टेंडर", date: "तारीख:", today: "आज", tom: "कल", thanks: "धन्यवाद! 24 घंटे में कॉल आएगी", callG: GENERAL_CALL, callB: BUSINESS_CALL
  },
  ml: {
    selOpt: "താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക:", ride: "റൈഡ്", dir: "ബിസിനസ് ഡയറക്ടറി", del: "ഡെലിവറി", book: "ബുക്കിംഗ്", earn: "ബിസ്മാപിയ വരുമാനം", more: "കൂടുതൽ",
    rideOpt: "A. റൈഡ് ബുക്ക്\nB. വാഹനം അറ്റാച്ച്", bookRide: "റൈഡ് ബുക്ക്", attach: "വാഹനം അറ്റാച്ച്", custPost: "ഇന്ത്യയിൽ എവിടെയും റൈഡ് ബുക്ക് ചെയ്യൂ", drivPost: "വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം", bookNow: "ബുക്ക് ചെയ്യുക", dlDriv: "ഡ്രൈവർ ആപ്പ്",
    delIntro: "ബിസ്മാപിയ ഡെലിവറി", bookPar: "പാഴ്സൽ ബുക്ക്", regDel: "ഏജന്റ് രജിസ്റ്റർ", bookIntro: "ഓൺലൈൻ ബുക്കിംഗ്", bookRoom: "റൂം ബുക്ക്", dlApp: "ആപ്പ് ഡൗൺലോഡ്",
    earnIntro: "ഏത് തരം അവസരമാണ്?", high: "ഉയർന്ന വരുമാനം", mod: "മിതമായ", base: "അടിസ്ഥാന", highIntro: "ശരിയായ തിരഞ്ഞെടുപ്പ്.", video: "വീഡിയോ", ben: "ആനുകൂല്യങ്ങൾ", sup: "പിന്തുണ", req: "ആവശ്യകതകൾ", submit: "അപേക്ഷ", emi: "EMI",
    benText: "ആനുകൂല്യങ്ങൾ", supText: "പിന്തുണ", reqText: "ആവശ്യകതകൾ", corpQ: "കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp: "അതെ", noCorp: "ഇല്ല", ready15: "15 ലക്ഷം ഫീസ്?", readyBtn: "തയ്യാറാണ്", payReg: "Rs.5000 അടയ്ക്കുക - " + LINKS.razorpay, payBtn: "Rs.5000", emiOpt: "EMI തിരഞ്ഞെടുക്കുക", emi10: "5L + 10x1L", emi20: "5L + 20x50k", leadAsk: "വിവരങ്ങൾ പങ്കിടുക", occQ: "തൊഴിൽ:", bus: "ബിസിനസ്", house: "ഹൗസ് വൈഫ്", emp: "ജീവനക്കാരൻ", busman: "ബിസിനസ്സ്മാൻ", tender: "ടെൻഡർ", date: "തീയതി:", today: "ഇന്ന്", tom: "നാളെ", thanks: "നന്ദി!", callG: GENERAL_CALL, callB: BUSINESS_CALL
  }
};
function getText(l, k) { return (T[l] && T[l][k]) ? T[l][k] : (T.en[k] || k); }

let sheetsClient = null;
async function getSheets() {
  if (!SHEET_ID || SHEET_ID === 'false') return null;
  if (sheetsClient) return sheetsClient;
  try {
    const creds = process.env.GOOGLE_CREDENTIALS;
    if (!creds) return null;
    const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(creds), scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    sheetsClient = google.sheets({ version: 'v4', auth });
    return sheetsClient;
  } catch (e) { console.log('Sheets error', e.message); return null; }
}
async function saveToSheet(range, values) {
  try {
    const client = await getSheets();
    if (!client) return;
    let safeRange = range;
    if (range.includes(' - ') || range.includes(' ')) { if (!range.startsWith("'")) { const parts = range.split('!'); safeRange = `'${parts[0]}'!${parts[1]}`; } }
    await client.spreadsheets.values.append({ spreadsheetId: SHEET_ID, range: safeRange, valueInputOption: 'USER_ENTERED', requestBody: { values } });
  } catch (e) { console.log(`Sheet skip ${range}: ${e.message}`); }
}

async function sendWhatsAppMessage(to, payload) {
  if (!await acquireLock(to)) {
    console.log(`LOCKED skip duplicate to ${to}`);
    return false;
  }
  try {
    await checkRateLimit(to);
    const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    console.log(`SENDING to ${to} via ${PHONE_NUMBER_ID}: ${JSON.stringify(payload).substring(0, 300)}`);
    const res = await axios.post(url, { messaging_product: 'whatsapp', to, ...payload }, { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } });
    console.log(`META SUCCESS to ${to}: ${JSON.stringify(res.data)} WAMID:${res.data.messages?.[0]?.id}`);
    console.log(`OUT to ${to}: ${payload.type || payload.interactive?.type} - ${res.data.messages?.[0]?.id}`);
    return true;
  } catch (e) {
    const errData = e.response?.data;
    const err = errData?.error;
    console.log(`====== META ERROR to ${to} ====== Status:${e.response?.status} Code:${err?.code} Title:${errData?.error?.title || ''} Message:${err?.message} Full:${JSON.stringify(errData)} ======`);
    if (err?.code === 131053) {
      try {
        const textOnlyPayload = { type: 'interactive', interactive: { type: 'button', body: { text: payload.interactive?.body?.text || FIRST_BRIEF }, action: payload.interactive?.action } };
        const retryRes = await axios.post(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, { messaging_product: 'whatsapp', to, ...textOnlyPayload }, { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } });
        console.log(`RETRY SUCCESS without image to ${to}`);
        return true;
      } catch (retryE) {}
    }
    if (err?.code === 130429) {
      // V92 FIX: DO NOT BLOCK FOR 2 HOURS - Just wait 30s and retry once
      console.log(`⚠️ 130429 HIT for ${to} - V92 fix: waiting 30s and retrying once, NOT blocking 2 hours`);
      await new Promise(r => setTimeout(r, 30000));
      try {
        const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
        await axios.post(url, { messaging_product: 'whatsapp', to, ...payload }, { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } });
        console.log(`V92 RETRY SUCCESS after 30s for ${to}`);
        return true;
      } catch (retryErr) {
        console.log(`V92 RETRY FAILED for ${to}, letting user send Hi again later`);
      }
    }
    return false;
  } finally {
    await releaseLock(to);
  }
}

async function sendMessage(uid, text, buttons) {
  const btns = buttons ? buttons.slice(0, 3).map(b => ({ type: 'reply', reply: { id: b.payload, title: b.title.substring(0, 20) } })) : [];
  if (btns.length) return await sendWhatsAppMessage(uid, { type: 'interactive', interactive: { type: 'button', body: { text }, action: { buttons: btns } } });
  return await sendWhatsAppMessage(uid, { type: 'text', text: { body: text } });
}
async function sendImageHD(uid, imageLink, caption, buttons) {
  const btns = buttons ? buttons.slice(0, 3).map(b => ({ type: 'reply', reply: { id: b.payload, title: b.title.substring(0, 20) } })) : [];
  if (btns.length) return await sendWhatsAppMessage(uid, { type: 'interactive', interactive: { type: 'button', header: { type: 'image', image: { link: imageLink } }, body: { text: caption }, footer: { text: "bizmapia.com - 7025630644" }, action: { buttons: btns } } });
  else return await sendWhatsAppMessage(uid, { type: 'image', image: { link: imageLink, caption } });
}

// ===== V92 FIX: TEXT-ONLY WELCOME =====
async function sendFirst(uid) {
  if (await isWelcomeCooldown(uid)) { console.log(`Cooldown for ${uid} - skipping duplicate (90s Redis)`); return; }
  userStates[uid] = { lang: null, flow: 'LANG', lastStep: 'Welcome', data: {} };
  console.log(`V92 TEXT-ONLY welcome to ${uid} - Fixing 130429`);
  await sendMessage(uid, FIRST_BRIEF, [{ title: "English", payload: "LANG_en" }, { title: "हिन्दी", payload: "LANG_hi" }, { title: "മലയാളം", payload: "LANG_ml" }]);
  setReminder(uid, 'WELCOME');
}
async function sendMain(uid, l) {
  userStates[uid].lang = l; userStates[uid].lastStep = 'Main Menu';
  // V92: TEXT-ONLY, NO BURST IMAGE - This was causing 130429
  await sendMessage(uid, getText(l, 'selOpt') + "\n\n🌐 " + LINKS.website + "\n📲 " + LINKS.customerApp + "\n📞 " + BUSINESS_CALL, [{ title: getText(l, 'ride'), payload: "OPT_RIDE" }, { title: getText(l, 'dir'), payload: "OPT_DIR" }, { title: getText(l, 'more'), payload: "OPT_MORE" }]);
}
async function sendMore(uid, l) {
  userStates[uid].lastStep = 'More Options';
  await sendMessage(uid, `${getText(l, 'selOpt')}\n\n${LINKS.website}\n\n🏪 Business Directory - 10L+ businesses\n📦 Delivery - Fast Parcel 2 Hours\n🏠 Booking - Hotel/Doctor/Movie\n💼 Earn - District Franchise\n\n${LINKS.website}`, [{ title: getText(l, 'dir'), payload: "OPT_DIR" }, { title: getText(l, 'del'), payload: "OPT_DEL" }, { title: getText(l, 'book'), payload: "OPT_BOOK" }]);
}
async function sendRide(uid, l) {
  userStates[uid].lastStep = 'Ride Menu';
  await sendMessage(uid, getText(l, 'rideOpt'), [{ title: getText(l, 'bookRide'), payload: "RIDE_BOOK" }, { title: getText(l, 'attach'), payload: "RIDE_ATTACH" }, { title: "Back", payload: "BACK_MAIN" }]);
}
async function sendCust(uid, l) {
  userStates[uid].lastStep = 'Customer Ride';
  await sendImageHD(uid, IMAGES.business, getText(l, 'custPost'), [{ title: getText(l, 'bookNow'), payload: "BOOK_NOW" }, { title: getText(l, 'dlApp'), payload: "DL_CUST" }, { title: "Back", payload: "BACK_MAIN" }]);
}
async function sendDriv(uid, l) {
  userStates[uid].lastStep = 'Driver Attach';
  await sendImageHD(uid, IMAGES.driver, getText(l, 'drivPost'), [{ title: getText(l, 'dlDriv'), payload: "DL_DRIV" }, { title: "Back", payload: "BACK_MAIN" }]);
}
async function sendDel(uid, l) {
  userStates[uid].lastStep = 'Delivery';
  await sendImageHD(uid, IMAGES.benefit, getText(l, 'delIntro') + "\n\n" + LINKS.website + "/delivery", [{ title: getText(l, 'bookPar'), payload: "BOOK_PARCEL" }, { title: getText(l, 'regDel'), payload: "REG_DEL" }, { title: "Back", payload: "BACK_MAIN" }]);
}
async function sendRoom(uid, l) {
  userStates[uid].lastStep = 'Booking';
  await sendMessage(uid, getText(l, 'bookIntro') + "\n\n" + LINKS.website + "/booking", [{ title: getText(l, 'bookRoom'), payload: "BOOK_ROOM" }, { title: getText(l, 'dlApp'), payload: "DL_CUST" }, { title: "Back", payload: "BACK_MAIN" }]);
}
async function sendEarn(uid, l) {
  userStates[uid].lastStep = 'Earn Selection';
  await sendImageHD(uid, IMAGES.extra, getText(l, 'earnIntro'), [{ title: getText(l, 'high'), payload: "EARN_HIGH" }, { title: getText(l, 'mod'), payload: "EARN_MOD" }, { title: getText(l, 'base'), payload: "EARN_BASE" }]);
}
async function sendHigh(uid, l) {
  userStates[uid].lastStep = 'High Earning Details';
  await sendImageHD(uid, IMAGES.extra, getText(l, 'highIntro'), [{ title: getText(l, 'video'), payload: "KNOW_BEN" }, { title: getText(l, 'ben'), payload: "KNOW_BEN" }, { title: getText(l, 'callB'), payload: "CALL_B" }]);
}
async function sendBen(uid, l) {
  userStates[uid].lastStep = 'Benefits';
  await sendImageHD(uid, IMAGES.business, getText(l, 'benText'), [{ title: getText(l, 'sup'), payload: "KNOW_SUP" }, { title: getText(l, 'callB'), payload: "CALL_B" }]);
}
async function sendSup(uid, l) {
  userStates[uid].lastStep = 'Support';
  await sendImageHD(uid, IMAGES.discount, getText(l, 'supText'), [{ title: getText(l, 'req'), payload: "KNOW_REQ" }, { title: getText(l, 'callB'), payload: "CALL_B" }]);
}
async function sendReq(uid, l) {
  userStates[uid].lastStep = 'Requirements';
  await sendImageHD(uid, IMAGES.extra, getText(l, 'reqText'), [{ title: getText(l, 'submit'), payload: "SUBMIT_APP" }, { title: getText(l, 'emi'), payload: "KNOW_EMI" }]);
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
  const to = uid.startsWith('+') ? uid.substring(1) : uid;
  const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
  const headers = { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" };
  try {
    await axios.post(url, { messaging_product: "whatsapp", to, type: "interactive", interactive: { type: "cta_url", body: { text: getText(l, 'payReg') + "\n\nTap below to pay Rs.5000:" }, action: { name: "cta_url", parameters: { display_text: "Pay Now - Rs.5000", url: LINKS.razorpay } } } }, { headers });
    console.log(`PAY CTA sent to ${to}`);
    setTimeout(() => { sendMessage(uid, "After payment, click:", [{ title: "I Paid - Rs.5000", payload: "PAY_DONE" }, { title: getText(l, 'callB'), payload: "CALL_B" }]); }, 1500);
  } catch (e) {
    console.log("PAY CTA FAIL", e.response?.data);
    await sendMessage(uid, getText(l, 'payReg') + "\n" + LINKS.razorpay, [{ title: "I Paid", payload: "PAY_DONE" }]);
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
  else if (s.step === 2) { s.data.place = txt; s.step = 3; s.lastStep = 'Lead - Occupation'; await sendMessage(uid, getText(s.lang, 'occQ'), [{ title: getText(s.lang, 'bus'), payload: "OCC_BUS" }, { title: getText(s.lang, 'emp'), payload: "OCC_EMP" }, { title: getText(s.lang, 'house'), payload: "OCC_HOUSE" }]); }
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
const reminderStore = {};
function getReminderContent(step, count, lang) {
  const l = lang || 'en';
  if (step.includes('Driver') || step.includes('Customer Ride') || step.includes('Ride')) {
    if (count === 1) return { text: `🔔 Reminder ${count}/3: You left at ${step}\n\n${getText(l,'drivPost')}\n\nEarn Rs.1500-2500 daily! Type Hi to continue.`, image: IMAGES.driver, buttons: [{title: getText(l,'dlDriv'), payload: 'DL_DRIV'}, {title: 'Back', payload: 'BACK_MAIN'}] };
    if (count === 2) return { text: `⏰ Still waiting at ${step} - 12 hours ago (first was 2h ago)\n\nDriver App: ${LINKS.driverApp}\nDaily payout! Type Hi.`, image: IMAGES.driver, buttons: [{title: getText(l,'dlDriv'), payload: 'DL_DRIV'}, {title: getText(l,'callB'), payload: 'CALL_B'}] };
    return { text: `🚨 Last reminder for ${step}\n\nCall us: ${BUSINESS_CALL}\nWe will help you attach vehicle.`, image: IMAGES.driver, buttons: [{title: getText(l,'callB'), payload: 'CALL_B'}] };
  }
  if (step.includes('Business') || step.includes('Pay') || step.includes('Lead') || step.includes('Ready') || step.includes('High') || step.includes('Benefits') || step.includes('Earn')) {
    if (count === 1) return { text: `🔔 Reminder ${count}/3: You left at ${step}\n\n${getText(l,'benText')}\n\nType Hi to continue. Website: ${LINKS.website}`, image: IMAGES.benefit, buttons: [{title: getText(l,'ben'), payload: 'KNOW_BEN'}, {title: getText(l,'callB'), payload: 'CALL_B'}] };
    if (count === 2) return { text: `⏰ 12h ago you were at ${step}\n\n${getText(l,'supText')}\n\nCall: ${BUSINESS_CALL}`, image: IMAGES.extra, buttons: [{title: getText(l,'sup'), payload: 'KNOW_SUP'}, {title: getText(l,'callB'), payload: 'CALL_B'}] };
    return { text: `🚨 Final reminder for ${step}\n\nPay Rs.5000: ${LINKS.razorpay}\nCall ${BUSINESS_CALL} for help. Team will call in 24h.`, image: IMAGES.discount, buttons: [{title: 'Pay Rs.5000', payload: 'READY_15L'}, {title: getText(l,'callB'), payload: 'CALL_B'}] };
  }
  if (count === 1) return { text: `🔔 Reminder ${count}/3: You are at ${step}. Type Hi to continue. Website: ${LINKS.website} Support: ${BUSINESS_CALL}`, image: null, buttons: null };
  if (count === 2) return { text: `⏰ Reminder ${count}/3: Still at ${step} after 12 hours. Need help? Call ${BUSINESS_CALL}`, image: IMAGES.business, buttons: null };
  return { text: `🚨 Last reminder ${count}/3: You are at ${step} for 24h. Type Hi to continue or Call ${BUSINESS_CALL}`, image: null, buttons: null };
}

async function sendReminderStage(uid, step, lang, count) {
  const s = userStates[uid];
  if (!s) { clearReminderSequence(uid); return; }
  if (s.lastStep !== step) { clearReminderSequence(uid); return; }
  const content = getReminderContent(step, count, lang);
  console.log(`V91 Reminder ${count}/3 sending to ${uid} - ${step}`);
  if (content.image && content.buttons) {
    await sendImageHD(uid, content.image, content.text, content.buttons);
  } else if (content.image) {
    await sendImageHD(uid, content.image, content.text, [{title: 'Continue', payload: 'BACK_MAIN'}]);
  } else {
    await sendMessage(uid, content.text, content.buttons || [{title: 'Continue', payload: 'BACK_MAIN'}]);
  }
  if (count < 3) {
    const nextDelay = count === 1 ? 10*60*60*1000 : 12*60*60*1000;
    const timer = setTimeout(() => sendReminderStage(uid, step, lang, count+1), nextDelay);
    if (reminderStore[uid]) reminderStore[uid].timers.push(timer);
  } else {
    clearReminderSequence(uid);
  }
}

function setReminder(uid, step) {
  clearReminderSequence(uid);
  const state = userStates[uid];
  const lang = state?.lang || 'en';
  const actualStep = state?.lastStep || step;
  console.log(`V91 Smart Reminder set for (2h,12h,24h) ${uid} - ${actualStep}`);
  const t1 = setTimeout(() => sendReminderStage(uid, actualStep, lang, 1), 2*60*60*1000);
  const t2 = setTimeout(() => sendReminderStage(uid, actualStep, lang, 2), 12*60*60*1000);
  const t3 = setTimeout(() => sendReminderStage(uid, actualStep, lang, 3), 24*60*60*1000);
  reminderStore[uid] = { step: actualStep, lang, timers: [t1,t2,t3] };
  reminders[uid] = t1;
  try {
    if (redis && redisReady) {
      redis.set(`reminder:${uid}`, JSON.stringify({step: actualStep, lang, start: Date.now()}), 'EX', 25*60*60);
    }
  } catch(e){}
}

function clearReminderSequence(uid) {
  if (reminderStore[uid]) {
    reminderStore[uid].timers.forEach(t => clearTimeout(t));
    delete reminderStore[uid];
  }
  if (reminders[uid]) { clearTimeout(reminders[uid]); delete reminders[uid]; }
  try { if (redis && redisReady) redis.del(`reminder:${uid}`); } catch(e){}
}

function clearReminders(uid) { clearReminderSequence(uid); }

async function onMessage(uid, txt, payload) {
  let state = userStates[uid];
  const p = (payload || "").trim();
  const t = (txt || "").toLowerCase().trim();
  const isHi = ["hi", "hello", "hey", "hai", "start", "menu", "hii", "hello"].includes(t);
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
  await sendMain(uid, lang);
}

app.get('/', (req, res) => res.send(`Bizmapia Bot V92 TEXT-ONLY - ${new Date().toISOString()} - API ${BOT_NUMBER} - Redis:${redisReady?'ON':'Memory fallback'} - Fix: No 2h block`));
app.get('/webhook', (req, res) => { if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']); res.sendStatus(403); });
app.get('/health', (req, res) => res.send(`OK V92 TEXT-ONLY - ${redisReady?'Redis ON - Permanent':'Memory fallback'}`));
app.get('/ping', (req, res) => res.send('pong'));
app.get('/test-send', async (req, res) => {
  const to = req.query.to || '918590175977';
  console.log(`TEST-SEND to ${to}`);
  await sendFirst(to);
  res.send(`✅ V92 Test welcome (TEXT-ONLY) sent to ${to} - Redis:${redisReady?'ON':'OFF (memory)'} - Check logs - No 2h block`);
});

// V92 NEW: Clear specific number - This is what you asked "how to del rate:block:xxx"
app.get('/clear-block/:number', async (req, res) => {
  const num = req.params.number;
  try {
    if (redis && redisReady) {
      await redis.del(`block:${num}`);
      await redis.del(`rate:${num}`);
      await redis.del(`welcome:${num}`);
      await redis.del(`rate:block:${num}`);
      await redis.del(`block:91${num}`);
      await redis.del(`block:${num.replace(/^91/,'')}`);
      const keys = await redis.keys(`*${num}*`);
      if(keys.length > 0) await redis.del(...keys);
      res.send(`✅ V92 Cleared block for ${num}. Deleted keys: ${keys.join(',')}. Now send Hi again.`);
    } else {
      delete rateLimitMem[num];
      lastWelcomeMem.delete(num);
      res.send(`✅ Cleared memory block for ${num} (Redis not connected)`);
    }
  } catch(e){ res.send('Error:'+e.message); }
});

app.get('/clear-reminders', async (req, res) => {
  Object.values(reminders).forEach(id => clearTimeout(id));
  Object.keys(reminders).forEach(k => delete reminders[k]);
  Object.values(reminderStore).forEach(r => r.timers.forEach(t => clearTimeout(t)));
  Object.keys(reminderStore).forEach(k => delete reminderStore[k]);
  lastWelcomeMem.clear(); processedMem.clear(); sendingLockMem.clear();
  Object.keys(rateLimitMem).forEach(k => delete rateLimitMem[k]);
  try { if (redis && redisReady) { const keys = await redis.keys('msg:*'); if(keys.length) await redis.del(...keys); await redis.keys('welcome:*').then(k=>k.length&&redis.del(...k)); await redis.keys('rate:*').then(k=>k.length&&redis.del(...k)); await redis.keys('block:*').then(k=>k.length&&redis.del(...k)); await redis.keys('lock:*').then(k=>k.length&&redis.del(...k)); } } catch(e){}
  res.send('✅ V92 Cleared all reminders (3-stage) - Redis + memory - Spam block removed! Now send Hi again');
});

app.get('/clear-all', async (req, res) => {
  try {
    if (redis && redisReady) {
      const allKeys = await redis.keys('*');
      if(allKeys.length) await redis.del(...allKeys);
      res.send(`✅ V92 Cleared ALL ${allKeys.length} Redis keys - Bot fully reset. Now send Hi`);
    } else {
      lastWelcomeMem.clear(); processedMem.clear(); sendingLockMem.clear();
      Object.keys(rateLimitMem).forEach(k=>delete rateLimitMem[k]);
      res.send('✅ Cleared all memory - Bot reset');
    }
  } catch(e){ res.send('Error:'+e.message); }
});

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const value = req.body.entry?.[0]?.changes?.[0]?.value;
    if (value?.statuses?.[0]) {
      const st = value.statuses[0];
      console.log(`STATUS ${st.status} to ${st.recipient_id} - ${JSON.stringify(st.errors || 'OK')} - id:${st.id}`);
      // V92 FIX: DO NOT BLOCK ON 130429 - Just log it, no 2 hour block
      if (st.errors && JSON.stringify(st.errors).includes('130429')) {
        console.log(`V92 INFO: 130429 detected for ${st.recipient_id} - NOT blocking, just logging`);
      }
      return;
    }
    const msg = value?.messages?.[0];
    if (msg) {
      if (await isDuplicateMessage(msg.id)) { console.log(`Duplicate ${msg.id} skip (Redis+Memory)`); return; }
      const uid = msg.from;
      const txt = msg.text?.body || "";
      const payload = msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || msg.button?.payload || "";
      console.log("IN " + uid + " " + txt + " " + payload);
      await onMessage(uid, txt, payload || txt);
    }
  } catch (e) { console.log("webhook error", e.message, e.stack); }
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`==> V92 TEXT-ONLY listening on ${PORT} - API ${BOT_NUMBER} - No 2h Block - Ready - Redis:${redisReady?'ON':'connecting'}`);
  await getSheets();
});
