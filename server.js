// BIZMAPIA BOT - V83 FULL FINAL - READY TO PASTE - NO MORE EDITS
// This is COMPLETE code - Buttons + Images + Links + All Features
// Your API: 7025630644 - Test: 8590175977 - Phone ID: 122444880087590305
// Fixes: Permanent token + Language loop + 130429 + Anti-spam cooldown

const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia123';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const SHEET_ID = process.env.SHEET_ID;
const PORT = process.env.PORT || 10000;

// Anti-spam cooldown - FIX for your current issue
const lastWelcome = new Map(); // phone -> timestamp
const userStates = {};
const reminders = {};
const rateLimit = {};

console.log('=== BIZMAPIA BOT V83 FULL FINAL - READY ===');
console.log('PHONE_NUMBER_ID:', PHONE_NUMBER_ID);
console.log('WHATSAPP_TOKEN exists:', !!WHATSAPP_TOKEN, 'ends:', WHATSAPP_TOKEN ? WHATSAPP_TOKEN.slice(-8) : 'NONE');
console.log('SHEET_ID:', SHEET_ID || 'false');
console.log('==========================================');

// Your images from GitHub repo - public raw links
const IMAGES = {
  welcome: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_customer_welcome_HD_1080.jpg",
  business: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_business_reg_HD.jpg",
  benefit: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_benefit_reminder_HD.jpg",
  driver: "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/bizmapia_driver_welcome_HD.jpg",
};

const TEXTS = {
  en: {
    welcome: "⭐ Welcome to Bizmapia - All India 4-in-1 Services!\n\n🚕 Affordable Taxi & Auto\n🏢 View/attach Businesses with 10,00,000+ Local Businesses\n🍔 Fast Food/Grocery/Parcel Delivery\n🏠 Rooms, Doctor Appointment, Movie Tickets\n💼 Earn with Bizmapia Business opportunity\n\nOne App. Four Services. Pan-India!\n🌐 https://bizmapia.com\n📲 https://play.google.com/store/apps/details?id=com.bizmapia\n\n👇 Select language:",
    mainMenu: "Choose your service - https://bizmapia.com",
    rideMenu: "🚕 Ride - Hailing Service:\nBook anywhere in India - Cheapest Taxi/Auto\n\nLinks:\n📲 Customer App: https://play.google.com/store/apps/details?id=com.bizmapia.customer\n🚖 Book: https://bizmapia.com/ride\n📞 7025630644",
    moreOptions: "More Options:\n\n🏪 Business Directory - 10L+ businesses\n📦 Fast Parcel in 2 Hours\n🏠 Rooms/Doctor/Movies\n\nhttps://bizmapia.com",
    earnMenu: "💼 Earn with Bizmapia - Choose plan:\n\nDistrict Franchise, Corporation, Municipal\nDetails: https://bizmapia.com/earn\nVideo: https://bizmapia.com/video"
  },
  hi: {
    welcome: "⭐ Bizmapia में आपका स्वागत है - ऑल इंडिया 4-इन-1 सेवाएं!\n\n🚕 सस्ती टैक्सी और ऑटो\n🏢 10,00,000+ स्थानीय व्यवसाय\n🍔 फास्ट फूड/किराना/पार्सल\n\nhttps://bizmapia.com\n\n👇 भाषा चुनें:",
    mainMenu: "अपनी सेवा चुनें - https://bizmapia.com",
    rideMenu: "🚕 सवारी सेवा - https://bizmapia.com/ride",
    moreOptions: "अधिक विकल्प - https://bizmapia.com",
    earnMenu: "💼 Bizmapia के साथ कमाएं - https://bizmapia.com/earn"
  },
  ml: {
    welcome: "⭐ Bizmapia-യിലേക്ക് സ്വാഗതം - ഓൾ ഇന്ത്യ 4-ഇൻ-1 സേവനങ്ങൾ!\n\n🚕 താങ്ങാനാവുന്ന ടാക്സി & ഓട്ടോ\n🏢 10,00,000+ പ്രാദേശിക ബിസിനസുകൾ\n\nhttps://bizmapia.com\n\n👇 ഭാഷ തിരഞ്ഞെടുക്കുക:",
    mainMenu: "നിങ്ങളുടെ സേവനം തിരഞ്ഞെടുക്കുക - https://bizmapia.com",
    rideMenu: "🚕 റൈഡ് സേവനം - https://bizmapia.com/ride",
    moreOptions: "കൂടുതൽ ഓപ്ഷനുകൾ - https://bizmapia.com",
    earnMenu: "💼 Bizmapia-യോടൊപ്പം സമ്പാദിക്കുക - https://bizmapia.com/earn"
  }
};

let sheetsClient = null;
async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  try {
    const creds = process.env.GOOGLE_CREDENTIALS;
    if (!creds) return null;
    const auth = new google.auth.GoogleAuth({ credentials: JSON.parse(creds), scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    sheetsClient = google.sheets({ version: 'v4', auth });
    console.log('Sheets client ready');
    return sheetsClient;
  } catch (e) { console.log('Sheets skip:', e.message); return null; }
}

async function saveToSheet(range, values) {
  try {
    const client = await getSheetsClient();
    if (!client || !SHEET_ID || SHEET_ID === 'false') return;
    let safeRange = range;
    if (range.includes(' - ') || range.includes(' ')) {
      if (!range.startsWith("'")) { const parts = range.split('!'); safeRange = `'${parts[0]}'!${parts[1]}`; }
    }
    await client.spreadsheets.values.append({ spreadsheetId: SHEET_ID, range: safeRange, valueInputOption: 'USER_ENTERED', requestBody: { values } });
    console.log(`Sheet OK: ${safeRange}`);
  } catch (e) { console.log(`Sheet skip [${range}]:`, e.message); }
}

async function sendWhatsAppMessage(to, payload) {
  const now = Date.now();
  const last = rateLimit[to] || 0;
  const gap = now - last;
  if (gap < 8000) {
    console.log(`Rate limit wait ${8000 - gap}ms for ${to}`);
    await new Promise(r => setTimeout(r, 8000 - gap));
  }
  rateLimit[to] = Date.now();
  try {
    const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    console.log(`SENDING to ${to} via ${PHONE_NUMBER_ID}: ${JSON.stringify(payload).substring(0, 200)}`);
    const response = await axios.post(url, { messaging_product: 'whatsapp', to: to, ...payload }, { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' } });
    console.log(`META SUCCESS to ${to}: ${JSON.stringify(response.data)} - WAMID: ${response.data.messages?.[0]?.id}`);
    console.log(`OUT to ${to}: ${payload.type || 'interactive'} - WAMID: ${response.data.messages?.[0]?.id}`);
    return true;
  } catch (e) {
    const errData = e.response?.data;
    console.log(`====== META ERROR to ${to} ====== Status:${e.response?.status} Code:${errData?.error?.code} Message:${errData?.error?.message} Full:${JSON.stringify(errData)} ==========================`);
    if (errData?.error?.code === 130429) { await new Promise(r => setTimeout(r, 60000)); rateLimit[to] = Date.now() + 60000; }
    return false;
  }
}

async function sendWelcome(to, lang = 'en') {
  // ANTI-SPAM FIX - This fixes your current issue of not getting reply after many Hi
  const now = Date.now();
  if (lastWelcome.has(to) && now - lastWelcome.get(to) < 60000) {
    console.log(`Cooldown for ${to} - Skipping duplicate welcome (60s cooldown active)`);
    return;
  }
  lastWelcome.set(to, now);
  
  const t = TEXTS[lang] || TEXTS.en;
  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'image', image: { link: IMAGES.welcome } },
      body: { text: t.welcome },
      footer: { text: "One App. Four Services. Pan-India! - bizmapia.com" },
      action: { buttons: [{ type: 'reply', reply: { id: 'lang_en', title: 'English' } }, { type: 'reply', reply: { id: 'lang_hi', title: 'हिन्दी' } }, { type: 'reply', reply: { id: 'lang_ml', title: 'മലയാളം' } }] }
    }
  });
}

async function sendMainMenu(to, lang = 'en') {
  const t = TEXTS[lang] || TEXTS.en;
  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'image', image: { link: IMAGES.business } },
      body: { text: t.mainMenu + "\n\n🌐 Website: https://bizmapia.com\n📲 App: https://play.google.com/store/apps/details?id=com.bizmapia\n📞 Support: 7025630644 - 8590175977" },
      footer: { text: "Bizmapia - One App, Four Services" },
      action: { buttons: [{ type: 'reply', reply: { id: 'service_ride', title: '🚖 Ride - Hailing' } }, { type: 'reply', reply: { id: 'service_more', title: 'More Options' } }, { type: 'reply', reply: { id: 'service_earn', title: 'Earn with Bizmapia' } }] }
    }
  });
  if (userStates[to]) { userStates[to].step = 'main_menu'; userStates[to].lastActive = Date.now(); }
}

async function sendRideMenu(to, lang) {
  const t = TEXTS[lang] || TEXTS.en;
  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      header: { type: 'image', image: { link: IMAGES.benefit } },
      body: { text: t.rideMenu },
      action: { buttons: [{ type: 'reply', reply: { id: 'ride_book', title: '🚖 Book Ride' } }, { type: 'reply', reply: { id: 'ride_attach', title: 'Attach Vehicle' } }, { type: 'reply', reply: { id: 'back_main', title: '🔙 Back' } }] }
    }
  });
}

function setReminder(to) {
  if (reminders[to]) clearTimeout(reminders[to]);
  const timeoutId = setTimeout(async () => {
    const state = userStates[to];
    if (!state || state.step === 'completed') return;
    await sendWhatsAppMessage(to, { type: 'text', text: { body: '👋 Still there? Continue your Bizmapia service. Type Hi to restart. Website: https://bizmapia.com Support: 7025630644' } });
    delete reminders[to];
  }, 30 * 60 * 1000);
  reminders[to] = timeoutId;
  console.log(`Reminder set for ${to} in 30 min`);
}

// Routes
app.get('/', (req, res) => res.send('Bizmapia Bot V83 FULL FINAL - Buttons+Image+Links - Ready'));
app.get('/webhook', (req, res) => { if (req.query['hub.verify_token'] === VERIFY_TOKEN) res.send(req.query['hub.challenge']); else res.sendStatus(403); });
app.get('/health', (req, res) => res.send('OK V83 FULL'));
app.get('/ping', (req, res) => res.send('pong'));
app.get('/test-send', async (req, res) => {
  const to = req.query.to || '918590175977';
  console.log(`TEST-SEND to ${to}`);
  const ok = await sendWhatsAppMessage(to, { type: 'text', text: { body: `Test from V83 FULL FINAL - ${new Date().toISOString()} - Buttons+Image+Links Ready - API 7025630644` } });
  if (ok) {
    await sendWelcome(to);
    res.send(`✅ Test sent to ${to} - Welcome with Image+Buttons also sent - Check logs for META SUCCESS`);
  } else {
    res.status(500).send(`FAILED to ${to} - Check logs for META ERROR`);
  }
});
app.get('/clear-reminders', (req, res) => { Object.values(reminders).forEach(id => clearTimeout(id)); Object.keys(reminders).forEach(k => delete reminders[k]); lastWelcome.clear(); res.send('Cleared reminders + cooldown!'); });

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const msg = value?.messages?.[0];
    if (!msg) {
      if (value?.statuses?.[0]) {
        const st = value.statuses[0];
        console.log(`STATUS ${st.status} to ${st.recipient_id} - ${JSON.stringify(st.errors || 'OK')} - id:${st.id}`);
      }
      return;
    }
    const from = msg.from;
    const type = msg.type;
    console.log(`IN from ${from}: ${type} ${msg.text?.body || msg.interactive?.button_reply?.id || ''}`);
    await saveToSheet('Sheet6 - All Logs!A:C', [[new Date().toISOString(), from, type + ' ' + (msg.text?.body || msg.interactive?.button_reply?.id || '')]]);

    if (!userStates[from]) userStates[from] = { lang: null, step: 'welcome', lastActive: Date.now(), phone: from };
    if (reminders[from]) { clearTimeout(reminders[from]); delete reminders[from]; }

    if (type === 'text') {
      const body = msg.text.body.toLowerCase().trim();
      if (['hi', 'hello', 'hey', 'hai', 'hii', 'start', 'menu', 'hello'].includes(body)) {
        userStates[from].step = 'welcome';
        await sendWelcome(from, userStates[from].lang || 'en');
        setReminder(from);
        return;
      }
    }

    let buttonId = null;
    if (type === 'interactive' && msg.interactive?.type === 'button_reply') buttonId = msg.interactive.button_reply.id;
    else if (type === 'button' && msg.button?.payload) buttonId = msg.button.payload;

    if (!buttonId) {
      if (userStates[from].step === 'welcome' || !userStates[from].lang) {
        await sendWelcome(from, userStates[from].lang || 'en');
        setReminder(from);
        return;
      }
    }

    if (buttonId && buttonId.startsWith('lang_')) {
      let lang = 'en';
      if (buttonId === 'lang_hi') lang = 'hi';
      if (buttonId === 'lang_ml') lang = 'ml';
      userStates[from] = { ...userStates[from], lang: lang, step: 'main_menu', lastActive: Date.now(), phone: from };
      console.log(`User ${from} language set to ${lang}`);
      await new Promise(r => setTimeout(r, 500));
      await sendMainMenu(from, lang);
      setReminder(from);
      await saveToSheet('UserState!A:D', [[from, lang, new Date().toISOString(), 'main_menu']]);
      return;
    }

    const currentLang = userStates[from]?.lang || 'en';
    if (buttonId === 'service_ride' || buttonId === 'ride_book') { userStates[from].step = 'ride_menu'; await sendRideMenu(from, currentLang); setReminder(from); return; }
    if (buttonId === 'service_more') {
      userStates[from].step = 'more_options';
      await sendWhatsAppMessage(from, {
        type: 'interactive',
        interactive: {
          type: 'button',
          header: { type: 'image', image: { link: IMAGES.business } },
          body: { text: TEXTS[currentLang].moreOptions + "\n\nLinks:\nBusiness: https://bizmapia.com/business\nDelivery: https://bizmapia.com/delivery\nBooking: https://bizmapia.com/booking\nEarn: https://bizmapia.com/earn" },
          action: { buttons: [{ type: 'reply', reply: { id: 'more_business', title: 'Business Directory' } }, { type: 'reply', reply: { id: 'more_delivery', title: 'Delivery' } }, { type: 'reply', reply: { id: 'back_main', title: '🔙 Back' } }] }
        }
      });
      setReminder(from);
      return;
    }
    if (buttonId === 'service_earn') {
      userStates[from].step = 'earn_menu';
      await sendWhatsAppMessage(from, {
        type: 'interactive',
        interactive: {
          type: 'button',
          header: { type: 'image', image: { link: IMAGES.driver } },
          body: { text: TEXTS[currentLang].earnMenu + "\n\nPay: https://rzp.io/rzp/mq0zG6mS\nSupport: 7025630644" },
          action: { buttons: [{ type: 'reply', reply: { id: 'earn_high', title: 'High Income' } }, { type: 'reply', reply: { id: 'earn_moderate', title: 'Moderate' } }, { type: 'reply', reply: { id: 'back_main', title: '🔙 Back' } }] }
        }
      });
      setReminder(from);
      return;
    }
    if (buttonId === 'back_main') { await sendMainMenu(from, currentLang); setReminder(from); return; }
    if (buttonId) {
      await sendWhatsAppMessage(from, { type: 'text', text: { body: `You selected: ${buttonId}\n\nOur team will contact you at ${from}.\n\nWebsite: https://bizmapia.com\nSupport: 7025630644 / 8590175977\nThank you!` } });
      setReminder(from);
    }
  } catch (err) { console.log('Webhook error:', err.message, err.stack); }
});

app.listen(PORT, async () => {
  console.log(`==> V83 FULL FINAL listening on ${PORT} - API 7025630644 - READY - Buttons+Image+Links`);
  await getSheetsClient();
});
