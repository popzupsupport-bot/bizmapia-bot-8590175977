// BIZMAPIA BOT - V92 FULL - FIXES 130429 WITHOUT 2 HOUR BLOCK
const express = require('express');
const axios = require('axios');
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

// ===== REDIS SETUP =====
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
    redis.on('connect', () => { console.log('REDIS CONNECTED'); redisReady = true; });
    redis.on('ready', () => { console.log('REDIS READY'); redisReady = true; });
    redis.on('error', (e) => { console.log('Redis error:', e.message); redisReady = false; });
    redis.on('close', () => { console.log('Redis closed'); redisReady = false; });
  } catch(e) { console.log('Redis init failed:', e.message); }
} else {
  console.log('REDIS_URL not set - using memory fallback');
}

const lastWelcomeMem = new Map();
const processedMem = new Map();
const rateLimitMem = {};
const sendingLockMem = new Map();
const userStates = {};
const reminders = {};

let globalMsgCount = 0;
let globalMsgWindowStart = Date.now();
const GLOBAL_MAX_PER_MIN = 20;

console.log('=== BIZMAPIA BOT V92 FULL FIX ===');

async function isDuplicateMessage(msgId) {
  try {
    if (redis && redisReady) {
      const exists = await redis.get('msg:' + msgId);
      if (exists) return true;
      await redis.set('msg:' + msgId, '1', 'EX', 300);
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
      const exists = await redis.get('welcome:' + uid);
      if (exists) return true;
      await redis.set('welcome:' + uid, '1', 'EX', 300); // V92 FINAL: 5 min cooldown to avoid 130429
      return false;
    }
  } catch(e) {}
  const now = Date.now();
  if (lastWelcomeMem.has(uid) && now - lastWelcomeMem.get(uid) < 300000) return true; // 5 min
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
    console.log('GLOBAL RATE LIMIT waiting ' + Math.ceil(wait/1000) + 's');
    await new Promise(r => setTimeout(r, wait));
    globalMsgWindowStart = Date.now();
    globalMsgCount = 0;
  }
  globalMsgCount++;
  try {
    if (redis && redisReady) {
      const last = await redis.get('rate:' + uid);
      if (last) {
        const gap = Date.now() - parseInt(last);
        if (gap < 2000) {
          const wait = 2000 - gap;
          console.log('Cooldown ' + uid + ' waiting ' + Math.ceil(wait/1000) + 's');
          await new Promise(r => setTimeout(r, wait));
        }
      }
      await redis.set('rate:' + uid, Date.now().toString(), 'EX', 120);
      return;
    }
  } catch(e) {}
  const now2 = Date.now();
  const last = rateLimitMem[uid] || 0;
  const gap = now2 - last;
  if (gap < 2000) await new Promise(r => setTimeout(r, 2000 - gap));
  rateLimitMem[uid] = Date.now();
}

async function acquireLock(uid) {
  try {
    if (redis && redisReady) {
      const res = await redis.set('lock:' + uid, '1', 'EX', 20, 'NX');
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
      await redis.del('lock:' + uid);
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
  razorpay: "https://rzp.io/rzp/mq0zG6mS",
};
const BOT_NUMBER = "917025630644";
const BUSINESS_CALL = "918590175977";
const GENERAL_CALL = "919745226642";
const FIRST_BRIEF = "Welcome to Bizmapia - All India 4-in-1 Services!\n\nAffordable Taxi & Auto\n10,00,000+ Local Businesses\nFast Parcel in 2 Hours\nRooms, Doctor, Movie Tickets\nDaily & Monthly Income\n\nOne App. Four Services. Pan-India!\n\n" + LINKS.website + "\n" + LINKS.customerApp + "\n\nSelect language:";

const T = {
  en: {
    selOpt: "Please select any one from below:", ride: "Ride - Hailing", dir: "Business Directory", del: "Online Delivery", book: "Online Booking", earn: "Earn with Bizmapia", more: "More Options",
    rideOpt: "A. Book a ride\nB. Attach your vehicle", bookRide: "Book a ride", attach: "Attach your vehicle",
    custPost: "Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount\n\nDownload Customer App: " + LINKS.customerApp + "\nBook: " + LINKS.rideLink + "\nCall: " + BUSINESS_CALL,
    drivPost: "Earn by attaching your vehicle - Earn daily Rs.1500-2500\n\nTaxi/Auto/Bike all accepted\nDaily payout\nDriver App: " + LINKS.driverApp,
    bookNow: "Book Now", dlDriv: "Driver App",
    delIntro: "BizMapia online delivery - Fast Parcel Delivery in 2 Hours anywhere in India\n\nBook: " + LINKS.website + "/delivery",
    bookPar: "Book parcel", regDel: "Register as Agent",
    bookIntro: "Online Booking - Hotel/Doctor/Cinema - Book anywhere in India\n\n" + LINKS.website + "/booking", bookRoom: "Book room", dlApp: "Download app",
    earnIntro: "You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?",
    high: "High earning", mod: "Moderate", base: "Base",
    highIntro: "Great you have selected the right choice. Only one opportunity in a district.\n\nDistrict Franchise - 15 Lakhs\nCorporation - 7 Lakhs\nMunicipal - 3 Lakhs\n\nLink: " + LINKS.earnLink,
    video: "Video Link", ben: "Know Benefits", sup: "Know Support", req: "Requirements", submit: "Submit Application", emi: "EMI options",
    benText: "BENEFITS - District Franchise\n\nBenefits 1 - You are district top level franchisee, % on all earnings in your district\nBenefits 2 - Only you can contact Company directly\nBenefits 3 - Lifetime royalty income\n\nWebsite: " + LINKS.website,
    supText: "SUPPORT - Company will provide\nSupport 1 - 12 months marketing support\nSupport 2 - 6 months Rent contribution\nSupport 3 - 6 months Staff salary support\n\nCall: " + BUSINESS_CALL,
    reqText: "REQUIREMENTS\n\nRequirement 1 - 90 Sqft room\nRequirement 2 - 1 full time staff\nRequirement 3 - PC/Laptop and Android Mobile\nRequirement 4 - Ready to invest\nRequirement 5 - Aadhaar + PAN\n\nApply: " + LINKS.earnLink,
    corpQ: "Did your district contain corporation? If your district HQ has Corporation (e.g. Ernakulam has Kochi Corporation), select Yes Corp.", yesCorp: "Yes Corp", noCorp: "No Corp",
    ready15: "You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.", readyBtn: "Yes Ready - 15L",
    payReg: "Pay your registration fee Rs.5000 to proceed further. For District/Corporation/Municipal/Business Center\n\nThis Rs.5000 is part of 15L, not extra.\n\nPay Link: " + LINKS.razorpay, payBtn: "Pay Rs.5000",
    emiOpt: "Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10: "5L + 10x1L", emi20: "5L + 20x50k",
    leadAsk: "Share contact: Name, Place, District, State, Contact, Occupation", occQ: "Select Occupation:", bus: "Business", house: "Housewife", emp: "Employee", busman: "Businessman",
    tender: "Download Tender", date: "Select Agreement Date:", today: "Today", tom: "Tomorrow",
    thanks: "Thanks! Team will call within 24h.", callG: GENERAL_CALL, callB: BUSINESS_CALL
  },
  hi: {
    selOpt: "Niche se ek chune:", ride: "Ride", dir: "Business Directory", del: "Delivery", book: "Booking", earn: "Bizmapia Kamai", more: "Adhik Vikalp",
    rideOpt: "A. Ride Book\nB. Vahan Attach", bookRide: "Ride Book", attach: "Vahan Attach", custPost: "Bharat me kahi bhi ride book kare", drivPost: "Vahan attach kar kamaye", bookNow: "Abhi Book", dlDriv: "Driver App",
    delIntro: "Bizmapia Delivery", bookPar: "Parcel Book", regDel: "Agent Register", bookIntro: "Online Booking", bookRoom: "Room Book", dlApp: "App Download",
    earnIntro: "Kis prakar ka avsar chahiye?", high: "Uchh Kamai", mod: "Madhyam", base: "Base", highIntro: "Sahi chunav. Jila franchise 15 lakh", video: "Video", ben: "Labh", sup: "Support", req: "Jarurate", submit: "Avedan", emi: "EMI",
    benText: "Labh - Jila franchise", supText: "Support - Company degi", reqText: "Jarurate - 90 sqft room, staff, laptop", corpQ: "Kya aapke jile me corporation hai?", yesCorp: "Haan Corp", noCorp: "Nahi", ready15: "15 lakh fees ke liye taiyar?", readyBtn: "Haan Taiyar", payReg: "Rs.5000 panjikaran shulk - " + LINKS.razorpay, payBtn: "Rs.5000 Bhare", emiOpt: "EMI chune", emi10: "5L + 10x1L", emi20: "5L + 20x50k", leadAsk: "Sampark sajha kare", occQ: "Vyavsay:", bus: "Business", house: "Grihini", emp: "Karmchari", busman: "Vyapari", tender: "Tender", date: "Tarikh:", today: "Aaj", tom: "Kal", thanks: "Dhanyavad! 24 ghante me call aayegi", callG: GENERAL_CALL, callB: BUSINESS_CALL
  },
  ml: {
    selOpt: "Thazhe ninnu onnu thiranjedukkuka:", ride: "Ride", dir: "Business Directory", del: "Delivery", book: "Booking", earn: "Bismapia Varumanam", more: "Kooduthal",
    rideOpt: "A. Ride Book\nB. Vahanam Attach", bookRide: "Ride Book", attach: "Vahanam Attach", custPost: "Indiayil evideyum ride book cheyyu", drivPost: "Vahanam attach cheythu varumanam", bookNow: "Book Cheyyuka", dlDriv: "Driver App",
    delIntro: "Bismapia Delivery", bookPar: "Parcel Book", regDel: "Agent Register", bookIntro: "Online Booking", bookRoom: "Room Book", dlApp: "App Download",
    earnIntro: "Ethu tharam avasaramanu?", high: "Uyarnna Varumanam", mod: "Mithamaya", base: "Adisthana", highIntro: "Sariyaya thiranjeduppu.", video: "Video", ben: "Aanukulyangal", sup: "Pinthuna", req: "Aavashyakathakal", submit: "Apeksha", emi: "EMI",
    benText: "Aanukulyangal", supText: "Pinthuna", reqText: "Aavashyakathakal", corpQ: "Corporation undo?", yesCorp: "Athe", noCorp: "Illa", ready15: "15 laksham fees?", readyBtn: "Thayarannu", payReg: "Rs.5000 adayakku - " + LINKS.razorpay, payBtn: "Rs.5000", emiOpt: "EMI thiranjedukkuka", emi10: "5L + 10x1L", emi20: "5L + 20x50k", leadAsk: "Vivarangal pankiduka", occQ: "Thozhil:", bus: "Business", house: "House Wife", emp: "Jeevanakkaran", busman: "Businessman", tender: "Tender", date: "Theeyathi:", today: "Innu", tom: "Nale", thanks: "Nandi!", callG: GENERAL_CALL, callB: BUSINESS_CALL
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
    if (range.includes(' - ') || range.includes(' ')) { if (!range.startsWith("'")) { const parts = range.split('!'); safeRange = "'" + parts[0] + "'!" + parts[1]; } }
    await client.spreadsheets.values.append({ spreadsheetId: SHEET_ID, range: safeRange, valueInputOption: 'USER_ENTERED', requestBody: { values } });
  } catch (e) { console.log('Sheet skip ' + range + ': ' + e.message); }
}

async function sendWhatsAppMessage(to, payload) {
  if (!await acquireLock(to)) {
    console.log('LOCKED skip duplicate to ' + to);
    return false;
  }
  try {
    await checkRateLimit(to);
    const url = 'https://graph.facebook.com/v21.0/' + PHONE_NUMBER_ID + '/messages';
    console.log('SENDING to ' + to + ' via ' + PHONE_NUMBER_ID + ': ' + JSON.stringify(payload).substring(0, 300));
    const res = await axios.post(url, { messaging_product: 'whatsapp', to: to, ...payload }, { headers: { Authorization: 'Bearer ' + WHATSAPP_TOKEN, 'Content-Type': 'application/json' } });
    console.log('META SUCCESS to ' + to + ': ' + JSON.stringify(res.data) + ' WAMID:' + (res.data.messages && res.data.messages[0] ? res.data.messages[0].id : ''));
    console.log('OUT to ' + to + ': ' + (payload.type || (payload.interactive && payload.interactive.type)) + ' - ' + (res.data.messages && res.data.messages[0] ? res.data.messages[0].id : ''));
    return true;
  } catch (e) {
    const errData = e.response && e.response.data;
    const err = errData && errData.error;
    console.log('META ERROR to ' + to + ' Status:' + (e.response && e.response.status) + ' Code:' + (err && err.code) + ' Message:' + (err && err.message));
    if (err && err.code === 131053) {
      try {
        const textOnlyPayload = { type: 'interactive', interactive: { type: 'button', body: { text: payload.interactive && payload.interactive.body ? payload.interactive.body.text : FIRST_BRIEF }, action: payload.interactive && payload.interactive.action } };
        await axios.post('https://graph.facebook.com/v21.0/' + PHONE_NUMBER_ID + '/messages', { messaging_product: 'whatsapp', to: to, ...textOnlyPayload }, { headers: { Authorization: 'Bearer ' + WHATSAPP_TOKEN, 'Content-Type': 'application/json' } });
        console.log('RETRY SUCCESS without image to ' + to);
        return true;
      } catch (retryE) {}
    }
    if (err && err.code === 130429) {
      console.log('130429 HIT for ' + to + ' - V92 fix: waiting 30s and retrying once, NOT blocking 2 hours');
      await new Promise(r => setTimeout(r, 30000));
      try {
        const url = 'https://graph.facebook.com/v21.0/' + PHONE_NUMBER_ID + '/messages';
        await axios.post(url, { messaging_product: 'whatsapp', to: to, ...payload }, { headers: { Authorization: 'Bearer ' + WHATSAPP_TOKEN, 'Content-Type': 'application/json' } });
        console.log('V92 RETRY SUCCESS after 30s for ' + to);
        return true;
      } catch (retryErr) {
        console.log('V92 RETRY FAILED for ' + to);
      }
    }
    return false;
  } finally {
    await releaseLock(to);
  }
}

async function sendMessage(uid, text, buttons) {
  const btns = buttons ? buttons.slice(0, 3).map(b => ({ type: 'reply', reply: { id: b.payload, title: b.title.substring(0, 20) } })) : [];
  if (btns.length) return await sendWhatsAppMessage(uid, { type: 'interactive', interactive: { type: 'button', body: { text: text }, action: { buttons: btns } } });
  return await sendWhatsAppMessage(uid, { type: 'text', text: { body: text } });
}
async function sendImageHD(uid, imageLink, caption, buttons) {
  const btns = buttons ? buttons.slice(0, 3).map(b => ({ type: 'reply', reply: { id: b.payload, title: b.title.substring(0, 20) } })) : [];
  if (btns.length) return await sendWhatsAppMessage(uid, { type: 'interactive', interactive: { type: 'button', header: { type: 'image', image: { link: imageLink } }, body: { text: caption }, footer: { text: "bizmapia.com - 7025630644" }, action: { buttons: btns } } });
  else return await sendWhatsAppMessage(uid, { type: 'image', image: { link: imageLink, caption: caption } });
}

async function sendFirst(uid) {
  if (await isWelcomeCooldown(uid)) { console.log('Cooldown for ' + uid + ' skipping'); return; }
  userStates[uid] = { lang: null, flow: 'LANG', lastStep: 'Welcome', data: {} };
  console.log('V92 TEXT-ONLY welcome to ' + uid);
  await sendMessage(uid, FIRST_BRIEF, [{ title: "English", payload: "LANG_en" }, { title: "Hindi", payload: "LANG_hi" }, { title: "Malayalam", payload: "LANG_ml" }]);
  // setReminder(uid, 'WELCOME'); // disabled for final fix
}
async function sendMain(uid, l) {
  userStates[uid].lang = l; userStates[uid].lastStep = 'Main Menu';
  await sendMessage(uid, getText(l, 'selOpt') + "\n\n" + LINKS.website + "\n" + LINKS.customerApp + "\n" + BUSINESS_CALL, [{ title: getText(l, 'ride'), payload: "OPT_RIDE" }, { title: getText(l, 'dir'), payload: "OPT_DIR" }, { title: getText(l, 'more'), payload: "OPT_MORE" }]);
}
async function sendMore(uid, l) {
  userStates[uid].lastStep = 'More Options';
  await sendMessage(uid, getText(l, 'selOpt') + "\n\n" + LINKS.website + "\n\nBusiness Directory - 10L+ businesses\nDelivery - Fast Parcel 2 Hours\nBooking - Hotel/Doctor/Movie\nEarn - District Franchise\n\n" + LINKS.website, [{ title: getText(l, 'dir'), payload: "OPT_DIR" }, { title: getText(l, 'del'), payload: "OPT_DEL" }, { title: getText(l, 'book'), payload: "OPT_BOOK" }]);
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
  const url = 'https://graph.facebook.com/v21.0/' + PHONE_NUMBER_ID + '/messages';
  const headers = { Authorization: 'Bearer ' + WHATSAPP_TOKEN, "Content-Type": "application/json" };
  try {
    await axios.post(url, { messaging_product: "whatsapp", to: to, type: "interactive", interactive: { type: "cta_url", body: { text: getText(l, 'payReg') + "\n\nTap below to pay Rs.5000:" }, action: { name: "cta_url", parameters: { display_text: "Pay Now - Rs.5000", url: LINKS.razorpay } } } }, { headers: headers });
    console.log('PAY CTA sent to ' + to);
    setTimeout(() => { sendMessage(uid, "After payment, click:", [{ title: "I Paid - Rs.5000", payload: "PAY_DONE" }, { title: getText(l, 'callB'), payload: "CALL_B" }]); }, 1500);
  } catch (e) {
    console.log("PAY CTA FAIL", e.response && e.response.data);
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
    if (count === 1) return { text: 'Reminder ' + count + '/3: You left at ' + step + '\n\n' + getText(l,'drivPost') + '\n\nEarn Rs.1500-2500 daily! Type Hi to continue.', image: IMAGES.driver, buttons: [{title: getText(l,'dlDriv'), payload: 'DL_DRIV'}, {title: 'Back', payload: 'BACK_MAIN'}] };
    if (count === 2) return { text: 'Still waiting at ' + step + ' - 12 hours ago\n\nDriver App: ' + LINKS.driverApp, image: IMAGES.driver, buttons: [{title: getText(l,'dlDriv'), payload: 'DL_DRIV'}, {title: getText(l,'callB'), payload: 'CALL_B'}] };
    return { text: 'Last reminder for ' + step + '\n\nCall us: ' + BUSINESS_CALL, image: IMAGES.driver, buttons: [{title: getText(l,'callB'), payload: 'CALL_B'}] };
  }
  if (step.includes('Business') || step.includes('Pay') || step.includes('Lead') || step.includes('Ready') || step.includes('High') || step.includes('Benefits') || step.includes('Earn')) {
    if (count === 1) return { text: 'Reminder ' + count + '/3: You left at ' + step + '\n\n' + getText(l,'benText'), image: IMAGES.benefit, buttons: [{title: getText(l,'ben'), payload: 'KNOW_BEN'}, {title: getText(l,'callB'), payload: 'CALL_B'}] };
    if (count === 2) return { text: '12h ago you were at ' + step + '\n\n' + getText(l,'supText'), image: IMAGES.extra, buttons: [{title: getText(l,'sup'), payload: 'KNOW_SUP'}, {title: getText(l,'callB'), payload: 'CALL_B'}] };
    return { text: 'Final reminder for ' + step + '\n\nPay Rs.5000: ' + LINKS.razorpay, image: IMAGES.discount, buttons: [{title: 'Pay Rs.5000', payload: 'READY_15L'}, {title: getText(l,'callB'), payload: 'CALL_B'}] };
  }
  if (count === 1) return { text: 'Reminder ' + count + '/3: You are at ' + step + '. Type Hi to continue.', image: null, buttons: null };
  if (count === 2) return { text: 'Reminder ' + count + '/3: Still at ' + step + ' after 12 hours.', image: IMAGES.business, buttons: null };
  return { text: 'Last reminder ' + count + '/3: You are at ' + step + ' for 24h.', image: null, buttons: null };
}

async function sendReminderStage(uid, step, lang, count) {
  const s = userStates[uid];
  if (!s) { clearReminderSequence(uid); return; }
  if (s.lastStep !== step) { clearReminderSequence(uid); return; }
  const content = getReminderContent(step, count, lang);
  console.log('V91 Reminder ' + count + '/3 sending to ' + uid + ' - ' + step);
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
  const lang = state && state.lang || 'en';
  const actualStep = state && state.lastStep || step;
  console.log('Smart Reminder set for ' + uid + ' - ' + actualStep);
  const t1 = setTimeout(() => sendReminderStage(uid, actualStep, lang, 1), 2*60*60*1000);
  const t2 = setTimeout(() => sendReminderStage(uid, actualStep, lang, 2), 12*60*60*1000);
  const t3 = setTimeout(() => sendReminderStage(uid, actualStep, lang, 3), 24*60*60*1000);
  reminderStore[uid] = { step: actualStep, lang: lang, timers: [t1,t2,t3] };
  reminders[uid] = t1;
  try {
    if (redis && redisReady) {
      redis.set('reminder:' + uid, JSON.stringify({step: actualStep, lang: lang, start: Date.now()}), 'EX', 25*60*60);
    }
  } catch(e){}
}

function clearReminderSequence(uid) {
  if (reminderStore[uid]) {
    reminderStore[uid].timers.forEach(t => clearTimeout(t));
    delete reminderStore[uid];
  }
  if (reminders[uid]) { clearTimeout(reminders[uid]); delete reminders[uid]; }
  try { if (redis && redisReady) redis.del('reminder:' + uid); } catch(e){}
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
    // setReminder(uid, 'Main Menu'); // disabled
    await saveToSheet('UserState!A:D', [[uid, l, new Date().toISOString(), 'main_menu']]);
    return;
  }
  if (!state) { console.log('FIRST MESSAGE from ' + uid); await sendFirst(uid); return; }
  if (isHi) { console.log('HI RESET -> ' + uid); clearReminders(uid); delete userStates[uid]; await sendFirst(uid); return; }
  const lang = state.lang || 'en';
  if (p === "OPT_MORE" || p === "MORE_OPTIONS") return await sendMore(uid, lang);
  if (p === "OPT_RIDE") return await sendRide(uid, lang);
  if (p === "OPT_DIR") { state.lastStep = 'Business Directory'; await sendMessage(uid, 'Business Directory - 10L+ businesses\n\nView: ' + LINKS.businessLink + '\nAdd: ' + LINKS.website + '/register\n\nCall ' + BUSINESS_CALL, [{ title: "View Biz", payload: "VIEW_BIZ" }, { title: "Add Biz", payload: "ADD_BIZ" }, { title: "Back", payload: "BACK_MAIN" }]); setReminder(uid, 'Business Directory'); return; }
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
  if (p === "CALL_B") { await sendMessage(uid, 'Call Business: ' + BUSINESS_CALL + '\nGeneral: ' + GENERAL_CALL + '\nWebsite: ' + LINKS.website); return; }
  if (state.flow === 'LEAD' && txt) return await handleLead(uid, txt);
  await sendMain(uid, lang);
}

app.get('/', (req, res) => res.send('Bizmapia Bot V92 TEXT-ONLY - ' + new Date().toISOString() + ' - Redis:' + (redisReady?'ON':'Memory') + ' - Fix: No 2h block'));
app.get('/webhook', (req, res) => { if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']); res.sendStatus(403); });
app.get('/health', (req, res) => res.send('OK V92 TEXT-ONLY - ' + (redisReady?'Redis ON':'Memory fallback')));
app.get('/ping', (req, res) => res.send('pong'));
app.get('/test-send', async (req, res) => {
  const to = req.query.to || '918590175977';
  console.log('TEST-SEND to ' + to);
  await sendFirst(to);
  res.send('V92 Test welcome sent to ' + to);
});

app.get('/clear-block/:number', async (req, res) => {
  const num = req.params.number;
  try {
    if (redis && redisReady) {
      await redis.del('block:' + num);
      await redis.del('rate:' + num);
      await redis.del('welcome:' + num);
      await redis.del('rate:block:' + num);
      const keys = await redis.keys('*' + num + '*');
      if(keys.length) await redis.del(...keys);
      res.send('Cleared block for ' + num + '. Deleted: ' + keys.join(',') + '. Now send Hi again.');
    } else {
      delete rateLimitMem[num];
      lastWelcomeMem.delete(num);
      res.send('Cleared memory block for ' + num);
    }
  } catch(e){ res.send('Error:' + e.message); }
});

app.get('/clear-reminders', async (req, res) => {
  Object.values(reminders).forEach(id => clearTimeout(id));
  Object.keys(reminders).forEach(k => delete reminders[k]);
  Object.values(reminderStore).forEach(r => r.timers.forEach(t => clearTimeout(t)));
  Object.keys(reminderStore).forEach(k => delete reminderStore[k]);
  lastWelcomeMem.clear(); processedMem.clear(); sendingLockMem.clear();
  Object.keys(rateLimitMem).forEach(k => delete rateLimitMem[k]);
  try { if (redis && redisReady) { const keys = await redis.keys('msg:*'); if(keys.length) await redis.del(...keys); const k2 = await redis.keys('welcome:*'); if(k2.length) await redis.del(...k2); const k3 = await redis.keys('rate:*'); if(k3.length) await redis.del(...k3); const k4 = await redis.keys('block:*'); if(k4.length) await redis.del(...k4); const k5 = await redis.keys('lock:*'); if(k5.length) await redis.del(...k5); } } catch(e){}
  res.send('Cleared all reminders - Spam block removed! Now send Hi again');
});

app.get('/clear-all', async (req, res) => {
  try {
    if (redis && redisReady) {
      const allKeys = await redis.keys('*');
      if(allKeys.length) await redis.del(...allKeys);
      res.send('Cleared ALL ' + allKeys.length + ' Redis keys - Bot fully reset. Now send Hi');
    } else {
      lastWelcomeMem.clear(); processedMem.clear(); sendingLockMem.clear();
      Object.keys(rateLimitMem).forEach(k=>delete rateLimitMem[k]);
      res.send('Cleared all memory - Bot reset');
    }
  } catch(e){ res.send('Error:' + e.message); }
});

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const value = req.body.entry && req.body.entry[0] && req.body.entry[0].changes && req.body.entry[0].changes[0] && req.body.entry[0].changes[0].value;
    if (value && value.statuses && value.statuses[0]) {
      const st = value.statuses[0];
      console.log('STATUS ' + st.status + ' to ' + st.recipient_id + ' - ' + JSON.stringify(st.errors || 'OK') + ' - id:' + st.id);
      if (st.errors && JSON.stringify(st.errors).includes('130429')) {
        console.log('V92 INFO: 130429 detected for ' + st.recipient_id + ' - NOT blocking, just logging');
      }
      return;
    }
    const msg = value && value.messages && value.messages[0];
    if (msg) {
      if (await isDuplicateMessage(msg.id)) { console.log('Duplicate ' + msg.id + ' skip'); return; }
      const uid = msg.from;
      const txt = msg.text && msg.text.body || "";
      const payload = (msg.interactive && msg.interactive.button_reply && msg.interactive.button_reply.id) || (msg.interactive && msg.interactive.list_reply && msg.interactive.list_reply.id) || (msg.button && msg.button.payload) || "";
      console.log("IN " + uid + " " + txt + " " + payload);
      await onMessage(uid, txt, payload || txt);
    }
  } catch (e) { console.log("webhook error", e.message, e.stack); }
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log('V92 listening on ' + PORT + ' - No 2h Block - Ready');
  await getSheets();
});
