// ============================================================
// server.js - BIZMAPIA BOT V24.9 FINAL - FULL CODE
// Fix for your Render log: (#131000) test_user malformed
// All 23 Changes | PAN INDIA | ML+EN+HI | Back + Reminders
// ============================================================
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================== CONFIG =====================
const RAZORPAY_LINK = "https://rzp.io/l/bizmapia5000";
const SUPPORT_NUMBER = "97784 61515";
const VIDEO_LINK = "https://your-video-link.com";
const DISTRICT_LIST_LINK = "https://your-district-list.com";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let userStates = {};
const reminderTimers = {};
let processedIds = new Set();

// ===================== HEALTH CHECK =====================
app.get('/', (req, res) => {
  res.status(200).send(`✅ BizMapia Bot V24.9 LIVE - PAN INDIA - Fix for test_user - Port ${process.env.PORT || 10000} - ${new Date().toISOString()}`);
});
app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// ===================== HELPERS =====================
function detectLang(text = "") {
  if (/[അ-ഹ]/.test(text)) return 'ml';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
}

function getBackButtons(lang) {
  const m = {
    ml: { back: "⬅️ മുൻ മെനുവിലേക്ക് പോകുക", main: "🏠 പ്രധാന മെനു", later: "⏰ പിന്നീട് ഓർമ്മിപ്പിക്കുക" },
    en: { back: "⬅️ Go to Previous Menu", main: "🏠 Main Menu", later: "⏰ Remind Later" },
    hi: { back: "⬅️ पिछले मेनू पर जाएं", main: "🏠 मुख्य मेनू", later: "⏰ बाद में याद दिलाएं" }
  };
  const l = m[lang] || m.en;
  return [
    { title: l.back, payload: "GO_BACK" },
    { title: l.main, payload: "MAIN_MENU" },
    { title: l.later, payload: "REMIND_LATER" }
  ];
}

function getSimpleBack(lang) {
  const m = {
    ml: { back: "⬅️ മുൻ മെനു", main: "🏠 പ്രധാന മെനു" },
    en: { back: "⬅️ Previous Menu", main: "🏠 Main Menu" },
    hi: { back: "⬅️ पिछला मेनू", main: "🏠 मुख्य मेनू" }
  };
  const l = m[lang] || m.en;
  return [
    { title: l.back, payload: "GO_BACK" },
    { title: l.main, payload: "MAIN_MENU" }
  ];
}

// ===================== FIXED: REAL WHATSAPP SEND - VALIDATION ADDED =====================
async function sendMessage(userId, text, buttons = []) {
  console.log(`SEND to ${userId}: ${text.substring(0, 100)}... Buttons:`, buttons.map(b => b.title || b.payload));

  // === FIX FOR YOUR LOG ERROR: Skip test_user ===
  if (!userId || userId === "test_user" || typeof userId!== "string") {
    console.log(`Skipping - test_user / invalid - Not sending WA (This fixes your red error in log)`);
    return true;
  }
  // Only numbers 10-15 digits allowed for WhatsApp
  const cleanId = userId.replace(/\D/g, "");
  if (!/^\d{10,15}$/.test(cleanId)) {
    console.log(`Skipping - Invalid phone format: ${userId} -> ${cleanId}`);
    return true;
  }

  if (!WHATSAPP_TOKEN ||!PHONE_NUMBER_ID) {
    console.log("NO TOKEN - Set WHATSAPP_TOKEN and PHONE_NUMBER_ID in Render ENV");
    return true;
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers = { Authorization: `Bearer ${WHATSAPP_TOKEN}`, "Content-Type": "application/json" };

    let to = cleanId;
    if (to.length === 10) to = "91" + to;

    if (buttons && buttons.length > 0) {
      const urlBtn = buttons.find(b => b.url);
      const quickBtns = buttons.filter(b =>!b.url).slice(0, 3);
      if (quickBtns.length > 0) {
        const actionButtons = quickBtns.map(b => ({
          type: "reply",
          reply: { id: b.payload || b.title, title: b.title.substring(0, 20) }
        }));
        await axios.post(url, {
          messaging_product: "whatsapp",
          to: to,
          type: "interactive",
          interactive: { type: "button", body: { text: text.substring(0, 1024) }, action: { buttons: actionButtons } }
        }, { headers });
        console.log("✅ Button sent to", to);
      }
      if (urlBtn) {
        await axios.post(url, {
          messaging_product: "whatsapp",
          to: to,
          type: "text",
          text: { body: `${urlBtn.title}: ${urlBtn.url}` }
        }, { headers });
      }
    } else {
      await axios.post(url, {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text }
      }, { headers });
      console.log("✅ Text sent to", to);
    }
  } catch (e) {
    console.error("WA Send Error:", JSON.stringify(e.response?.data || e.message).substring(0,500));
  }
  return true;
}

function set5MinReminder(userId, type, data) {
  if (reminderTimers[userId]) clearTimeout(reminderTimers[userId]);
  reminderTimers[userId] = setTimeout(() => {
    if (type === 'video') sendVideoReminder(userId, data.lang);
    if (type === 'payment') sendPaymentReminder(userId, data);
  }, 5 * 60 * 1000);
}
function clearReminder(userId) { if (reminderTimers[userId]) clearTimeout(reminderTimers[userId]); }

// ===================== FLOWS - YOUR V24.4 ORIGINAL =====================
function sendMainMenu(userId, lang = 'en') {
  const msgs = {
    ml: `👋 സ്വാഗതം BizMapia-ലേക്ക് - PAN INDIA
നിങ്ങൾക്ക് എന്ത് വേണം?
🚕 റൈഡ് ബുക്ക് ചെയ്യുക
📦 ഡയറക്ടറി - കടകൾ കണ്ടെത്തുക
📦 ഡെലിവറി സർവീസ്
🏠 ബുക്കിംഗ് & ഫ്രാഞ്ചൈസി അവസരങ്ങൾ
👇 തിരഞ്ഞെടുക്കുക - ഇന്ത്യയിലെവിടെയും പ്രവർത്തിക്കും:`,
    en: `👋 Welcome to BizMapia - PAN INDIA
What do you need?
🚕 Book a Ride
📦 Directory - Find Shops
📦 Delivery Service
🏠 Booking & Franchise Opportunities
👇 Select - Works Anywhere in India:`,
    hi: `👋 BizMapia में आपका स्वागत है - पूरे भारत में
आपको क्या चाहिए?
🚕 राइड बुक करें
📦 डायरेक्टरी - दुकानें खोजें
📦 डिलीवरी सेवा
🏠 बुकिंग और फ्रैंचाइज़ी अवसर
👇 चुनें:`
  };
  sendMessage(userId, msgs[lang] || msgs.en, [
    { title: "🚕 Ride", payload: "RIDE" },
    { title: lang === 'ml'? "🏠 ഫ്രാഞ്ചൈസി" : lang === 'hi'? "🏠 फ्रैंचाइज़ी" : "🏠 Franchise", payload: "FRANCHISE" },
    { title: "📞 97784 61515", payload: "CALL_SUPPORT" }
  ]);
}

function sendFranchiseIntro(userId, lang) {
  const msgs = {
    ml: `ഫ്രാഞ്ചൈസി അവസരങ്ങൾ - നിങ്ങളുടെ ജില്ലയിൽ ബിസിനസ്സ് തുടങ്ങൂ! - PAN INDIA
ചുവടെയുള്ള ലിങ്കിൽ നിങ്ങളുടെ ജില്ലയുണ്ടോ എന്ന് നോക്കൂ - ഇല്ലെങ്കിൽ കോർപ്പറേഷൻ ഫ്രാഞ്ചൈസി എടുക്കാം.
ഇന്ത്യയിലെവിടെയും ഈ മോഡൽ പ്രവർത്തിക്കും!`,
    en: `Franchise Opportunities - Start Business in Your District! - PAN INDIA
Check link below if your district is available - else Corporation Franchise.
Model works anywhere in India!`,
    hi: `फ्रैंचाइज़ी अवसर - अपने जिले में व्यवसाय शुरू करें! - पूरे भारत में
नीचे लिंक में देखें कि आपका जिला उपलब्ध है या नहीं।`
  };
  sendMessage(userId, msgs[lang] || msgs.en, [
    { title: lang === 'ml'? "ബിസിനസ്സ് അവസരങ്ങൾ" : lang === 'hi'? "व्यापार के अवसर" : "Business Opportunities", payload: "BUSINESS_OPPS" },
 ...getSimpleBack(lang)
  ]);
}

function sendDistrictFee(userId, lang) {
  const msgs = {
    ml: `💰 ജില്ലാ ഫ്രാഞ്ചൈസി ഫീസ്: 10 - 15 ലക്ഷം (ജില്ല അനുസരിച്ച്) - PAN INDIA
✅ 5 വർഷ MOU ✅ 12 മാസം മാർക്കറ്റിംഗ് ✅ ഏരിയ ലോക്ക് - All India സുരക്ഷിതം
EMI ലഭ്യമാണ് - 5L ഡൗൺ + ബാക്കി EMI!`,
    en: `💰 District Franchise Fee: 10-15 Lakhs (As per district) - PAN INDIA
✅ 5 Year MOU ✅ 12 Months Marketing ✅ Area Lock Secured PAN INDIA
EMI Available - 5L Down + Rest EMI!`,
    hi: `💰 जिला फ्रैंचाइज़ी फीस: 10-15 लाख - पूरे भारत में
✅ 5 साल MOU ✅ 12 महीने मार्केटिंग ✅ एरिया लॉक सुरक्षित`
  };
  sendMessage(userId, msgs[lang] || msgs.en, [
    { title: lang === 'ml'? "EMI ഓപ്ഷൻ" : lang === 'hi'? "EMI विकल्प" : "EMI Options", payload: "SHOW_EMI" },
    { title: lang === 'ml'? "💳 പേയ്മെന്റ് ചെയ്യൂ" : lang === 'hi'? "💳 भुगतान करें" : "💳 Pay Now", url: RAZORPAY_LINK },
 ...getSimpleBack(lang)
  ]);
}

function sendDistrictSupport(userId, lang) {
  const msgs = {
    ml: `ജില്ലാ ഫ്രാഞ്ചൈസി സപ്പോർട്ട് - PAN INDIA:
1. 12 മാസം മാർക്കറ്റിംഗ് - കമ്പനി നിങ്ങളുടെ പരസ്യത്തിന് കൂടുതൽ ഊന്നൽ നൽകും
2. 6 മാസം വാടക സഹായം*
3. 6 മാസം ശമ്പളം സഹായം*
4. ഫുൾ ട്രെയിനിംഗ് + പിന്തുണ സഹായം
👇 മുന്നൊരുക്കങ്ങൾ കാണുക:`,
    en: `District Franchise Support - PAN INDIA:
1. 12 Months Marketing - Extra push to YOUR ads
2. 6 Months Rent Support*
3. 6 Months Salary Support*
4. Full Training + Support
👇 View Preparations:`,
    hi: `जिला फ्रैंचाइज़ी सपोर्ट - पूरे भारत में:
1. 12 महीने मार्केटिंग 2. 6 महीने किराया सहायता 3. 6 महीने सैलरी सहायता 4. फुल ट्रेनिंग`
  };
  sendMessage(userId, msgs[lang] || msgs.en, [
    { title: lang === 'ml'? "മുന്നൊരുക്കങ്ങൾ" : lang === 'hi'? "तैयारी देखें" : "Preparations", payload: "PREPARATION_LIST" },
 ...getSimpleBack(lang),
    { title: "📞 97784 61515", payload: "CALL_SUPPORT" }
  ]);
}

function sendEMIOptions(userId, lang) {
  const msgs = {
    ml: `💳 EMI ഓപ്ഷൻ - 2 ഓപ്ഷനുകൾ - PAN INDIA:
15L വലിയ തുക - അതിനാൽ EMI - 5L ഡൗൺ + ബാക്കി 10/20 മാസത്തിൽ!
പ്ലാൻ 1: 10 മാസം - ഡൗൺ 5L + 1L x10M =15L
പ്ലാൻ 2: 20 മാസം - ഡൗൺ 5L + 50k x20M =15L
👇 Choose your EMI:`,
    en: `💳 EMI Options - 2 Options - PAN INDIA:
Total 15L - EMI - 5L Down + Rest in 10 or 20 months!
Plan 1: 10M - Down 5L + 1L x10 =15L
Plan 2: 20M - Down 5L + 50k x20 =15L
👇 Choose your EMI:`,
    hi: `💳 EMI विकल्प - 2 विकल्प - पूरे भारत में:
कुल 15L - 5L डाउन + बाकी 10/20 महीने में!
प्लान 1: 10 महीने - डाउन 5L + 1L x10
प्लान 2: 20 महीने - डाउन 5L + 50k x20`
  };
  sendMessage(userId, msgs[lang] || msgs.en, [
    { title: "Plan 1: 10M - 1L/Month", payload: "EMI_PLAN_1" },
    { title: "Plan 2: 20M - 50K/Month", payload: "EMI_PLAN_2" },
 ...getSimpleBack(lang)
  ]);
}

function sendPaymentMessage(userId, lang, plan = "") {
  const msgs = {
    ml: `✅ ഡൗൺ പേയ്മെന്റിന് ശേഷം - PAN INDIA:
- ഏരിയ ലോക്ക് - All India-യിൽ മറ്റാർക്കും ലഭിക്കില്ല
- 5Y MOU - മാർക്കറ്റിംഗ് തുടങ്ങും
👇 ഇപ്പോൾ ഡൗൺ പേയ്മെന്റ് അടച്ച് ലോക്ക് ചെയ്യൂ: ${plan}`,
    en: `✅ After Down Payment - PAN INDIA:
- Area LOCKED - No one else in All India can take it
- 5Y MOU - Marketing starts
👇 Lock now with down payment: ${plan}`,
    hi: `✅ डाउन पेमेंट के बाद - पूरे भारत में:
- एरिया लॉक - पूरे भारत में कोई और नहीं ले सकता
👇 अभी लॉक करें: ${plan}`
  };
  sendMessage(userId, msgs[lang] || msgs.en, [
    { title: lang === 'ml'? "💳 ഇപ്പോൾ പേയ്മെന്റ് ചെയ്യൂ - ലോക്ക് ചെയ്യുക" : lang === 'hi'? "💳 अभी भुगतान करें - लॉक करें" : "💳 Pay Now - Lock Area", url: RAZORPAY_LINK },
 ...getBackButtons(lang)
  ]);
  set5MinReminder(userId, 'payment', { lang, plan });
}

function sendPaymentReminder(userId, data) {
  const lang = data.lang || 'en';
  const msgs = {
    ml: `⏰ പേയ്മെന്റ് ചെയ്തോ? - 5 മിനിറ്റ് ആയി! ഏരിയ മറ്റൊരാൾക്ക് ലഭിക്കും - All India!`,
    en: `⏰ Did you pay? - 5 minutes passed! Area may go to someone else - PAN INDIA!`,
    hi: `⏰ क्या भुगतान किया? - 5 मिनट हो गए! एरिया किसी और को मिल सकता है!`
  };
  sendMessage(userId, msgs[lang], [
    { title: lang === 'ml'? "✅ അതെ, ചെയ്തു" : lang === 'hi'? "✅ हाँ, किया" : "✅ Yes, Paid", payload: "PAYMENT_DONE" },
    { title: lang === 'ml'? "💳 ഇപ്പോൾ അടക്കൂ" : lang === 'hi'? "💳 अभी भुगतान करें" : "💳 Pay Now", url: RAZORPAY_LINK },
 ...getBackButtons(lang)
  ]);
}

function sendVideoReminder(userId, lang) {
  sendMessage(userId, lang === 'ml'? `⏰ വീഡിയോ കണ്ടോ? - 5 മിനിറ്റ് ആയി!` : `⏰ Did you watch video? - 5 min passed!`, [
    { title: "✅ Watched", payload: "VIDEO_WATCHED" },
    { title: "▶️ Watch Again", payload: "RESEND_VIDEO" },
 ...getBackButtons(lang)
  ]);
}

function handleNoResponse(userId, lang) {
  const msgs = {
    ml: `ചുവടെയുള്ള ലിങ്കിൽ ജില്ലയുണ്ടോ എന്ന് നോക്കൂ - ഇല്ലെങ്കിൽ കോർപ്പറേഷൻ ഫ്രാഞ്ചൈസി എടുക്കാം. All India ലഭ്യം!`,
    en: `Check link if district available - else Corporation Franchise - PAN INDIA!`,
    hi: `लिंक में देखें जिला उपलब्ध है या नहीं - नहीं तो कॉर्पोरेशन फ्रैंचाइज़ी।`
  };
  sendMessage(userId, msgs[lang] || msgs.en, [
    { title: "🔗 District List", url: DISTRICT_LIST_LINK },
 ...getSimpleBack(lang)
  ]);
}

function handlePaymentDone(userId, lang) {
  clearReminder(userId);
  userStates[userId] = { step: 1, data: {}, lang: lang, history: [] };
  const msgs = {
    ml: `✅ പേയ്മെന്റ് സ്ഥിരീകരണം! All India-യിൽ ഏരിയ ലോക്ക് ചെയ്തു!
📋 ഘട്ടം 1/4: ആധാർ പ്രകാരമുള്ള മുഴുവൻ പേര്:`,
    en: `✅ Payment Confirmed! Area locked PAN INDIA!
📋 Step 1/4: Enter full name as per Aadhaar:`,
    hi: `✅ भुगतान की पुष्टि हुई! एरिया पूरे भारत में लॉक!
📋 चरण 1/4: आधार के अनुसार पूरा नाम:`
  };
  sendMessage(userId, msgs[lang] || msgs.en, getSimpleBack(lang));
}

function handleOnboarding(userId, text) {
  const s = userStates[userId]; if (!s) return;
  const lang = s.lang;
  if (s.step === 1) {
    s.data.name = text; s.history.push(1); s.step = 2;
    sendMessage(userId, lang === 'ml'? `📋 ഘട്ടം 2/4: ഏത് ജില്ല / നഗരം? (All India)` : lang === 'hi'? `📋 चरण 2/4: जिला / शहर?` : `📋 Step 2/4: Which district/city?`, getSimpleBack(lang));
  } else if (s.step === 2) {
    s.data.district = text; s.history.push(2); s.step = 3;
    sendMessage(userId, lang === 'ml'? `📋 ഘട്ടം 3/4: ജോലി / അനുഭവം?` : lang === 'hi'? `📋 चरण 3/4: नौकरी / अनुभव?` : `📋 Step 3/4: Current job/experience?`, getSimpleBack(lang));
  } else if (s.step === 3) {
    s.data.experience = text; s.history.push(3); s.step = 4;
    sendMessage(userId, lang === 'ml'? `📋 ഘട്ടം 4/4: എപ്പോൾ തുടങ്ങാം? 👇 തീയതി:` : lang === 'hi'? `📋 चरण 4/4: कब शुरू कर सकते हैं? 👇 तारीख:` : `📋 Step 4/4: When can you start? 👇 Select date:`, [
      { title: "📅 Today", payload: "DATE_TODAY" },
      { title: "📅 Tomorrow", payload: "DATE_TOMORROW" },
      { title: "📅 This Week", payload: "DATE_THIS_WEEK" },
      { title: "📅 Next Week", payload: "DATE_NEXT_WEEK" },
      { title: "📅 This Month", payload: "DATE_THIS_MONTH" },
   ...getBackButtons(lang)
    ]);
  }
}

function handleDate(userId, dateVal) {
  const s = userStates[userId]; if (!s) return;
  const finalData = { whatsapp: userId, name: s.data.name, district: s.data.district, experience: s.data.experience, investment_date: dateVal, language: s.lang, timestamp: new Date().toISOString(), status: "Pending Manual Confirmation - PAN INDIA" };
  try {
    fs.appendFileSync('/tmp/leads_backup.txt', JSON.stringify(finalData) + "\n");
    console.log("NEW LEAD:", finalData);
  } catch (e) { console.error(e); }
  sendMessage(userId, `✅ Thanks ${s.data.name}! Date: ${dateVal} - Team will call 24h - 📞 ${SUPPORT_NUMBER}`, getSimpleBack(s.lang));
  delete userStates[userId];
}

function handleGoBack(userId) {
  const s = userStates[userId];
  if (!s || s.history.length === 0) { sendMainMenu(userId, s?.lang || 'en'); return; }
  const prev = s.history.pop(); s.step = prev;
  sendMessage(userId, `⬅️ Go Back - Step ${prev}/4 again:`, getSimpleBack(s.lang));
}
function handleRemindLater(userId) {
  sendMessage(userId, `⏰ Okay, will remind after 30 min!`);
  setTimeout(() => {
    const s = userStates[userId];
    if (s && s.step === 4) sendMessage(userId, `⏰ Reminder: Select date!`, getBackButtons(s.lang));
    else sendPaymentReminder(userId, { lang: s?.lang || 'en' });
  }, 30 * 60 * 1000);
}

function onMessage(userId, text, payload) {
  const combined = (text + " " + payload).toLowerCase();
  const lang = detectLang(text + " " + (payload || ""));
  console.log("ON MESSAGE:", userId, "text:", text, "payload:", payload, "lang:", lang);

  if (payload === "GO_BACK" || combined.includes("go_back") || combined.includes("മുൻ മെനു")) handleGoBack(userId);
  else if (payload === "MAIN_MENU" || combined.includes("main menu") || combined.includes("പ്രധാന മെനു")) sendMainMenu(userId, lang);
  else if (payload === "REMIND_LATER" || combined.includes("remind")) handleRemindLater(userId);
  else if (payload === "FRANCHISE" || combined.includes("franchise") || text.includes("ഫ്രാഞ്ചൈസി")) sendFranchiseIntro(userId, lang);
  else if (payload === "BUSINESS_OPPS" || combined.includes("business") || combined.includes("ബിസിനസ്സ്")) sendDistrictFee(userId, lang);
  else if (payload === "SHOW_EMI" || combined.includes("emi")) sendEMIOptions(userId, lang);
  else if (payload?.startsWith("EMI_PLAN")) sendPaymentMessage(userId, lang, payload);
  else if (payload === "PAYMENT_DONE" || combined.includes("paid")) handlePaymentDone(userId, lang);
  else if (payload?.startsWith("DATE_")) handleDate(userId, payload.replace("DATE_", ""));
  else if (payload === "VIDEO_WATCHED") { clearReminder(userId); sendDistrictSupport(userId, lang); }
  else if (text.trim() === "ഇല്ല" || payload === "NO") handleNoResponse(userId, lang);
  else if (userStates[userId]) handleOnboarding(userId, text);
  else sendMainMenu(userId, lang);
}

// ===================== WEBHOOK - FIXED TO IGNORE test_user =====================
app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    const msg = entry?.messages?.[0];
    if (msg) {
      if (processedIds.has(msg.id)) { console.log("Duplicate skip", msg.id); return res.sendStatus(200); }
      processedIds.add(msg.id); setTimeout(()=>processedIds.delete(msg.id), 60000);
      const userId = msg.from;
      const text = msg.text?.body || "";
      const payload = msg.interactive?.button_reply?.id || msg.interactive?.button_reply?.title || msg.button?.text || "";
      console.log("✅ REAL WA:", userId, text, payload);
      onMessage(userId, text, payload || text);
    } else {
      const userId = req.body.userId || req.body.from;
      if (!userId || userId === "test_user" || userId === "test") {
        console.log("Ignoring fake test webhook - No WA send - This fixes red error");
        return res.sendStatus(200);
      }
      const text = req.body.text || "";
      const payload = req.body.payload || "";
      console.log("Webhook Test:", userId, text, payload);
      onMessage(userId, text, payload);
    }
  } catch (e) {
    console.error("Webhook Error (server stays live):", e.message);
  }
  res.status(200).send('OK');
});

app.get('/leads', (req, res) => {
  try {
    if (fs.existsSync('/tmp/leads_backup.txt')) {
      res.type('text/plain').send(fs.readFileSync('/tmp/leads_backup.txt', 'utf8'));
    } else {
      res.send('No leads yet - /tmp/leads_backup.txt not found');
    }
  } catch (e) { res.send('Error reading leads'); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`==> Your service is live 🎉`);
  console.log(`==> Available at your primary URL https://bizmapia-bot-8590175977.onrender.com`);
  console.log(`==> Detected service running on port ${PORT}`);
  console.log(`✅ BizMapia Bot V24.9 PAN INDIA Ready - test_user bug fixed`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception - Server stays LIVE:', err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection - Server stays LIVE:', err.message);
});
