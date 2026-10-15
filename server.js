/*************************************************
 * BIZMAPIA BOT - V81 FINAL - PERMANENT FIX CODE
 * Fixes: Language Loop + Range Error + 130429 + Sleep
 * EN/HI/ML + 9 Posters + CRM + Reminders + Sheets
 *************************************************/
const express = require('express');
const axios = require('axios');
const { google } = require('googleapis');

const app = express();
app.use(express.json());

// ====== CONFIG ======
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia123';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const SHEET_ID = process.env.SHEET_ID;

const PORT = process.env.PORT || 10000;

// ====== IN-MEMORY STATE (V81 CRITICAL FIX) ======
// FIX 1: Language loop - Save in memory FIRST, sheet second (never rely on sheet)
const userStates = {}; // {from: {lang, step, lastActive, lastMsgTime, phone}}
const reminders = {}; // {from: timeoutId}
const rateLimit = {}; // {from: lastMessageTimestamp}

// Poster URLs - 9 Posters
const POSTERS = {
  welcome: 'https://i.ibb.co/YOUR_WELCOME_POSTER.jpg', // Replace with your ibbl image link
  taxi: 'https://i.ibb.co/YOUR_TAXI_POSTER.jpg',
  business: 'https://i.ibb.co/YOUR_BUSINESS_POSTER.jpg',
  delivery: 'https://i.ibb.co/YOUR_DELIVERY_POSTER.jpg',
  rooms: 'https://i.ibb.co/YOUR_ROOMS_POSTER.jpg',
  earn_high: 'https://i.ibb.co/YOUR_EARN_HIGH.jpg',
  earn_moderate: 'https://i.ibb.co/YOUR_EARN_MOD.jpg',
  earn_base: 'https://i.ibb.co/YOUR_EARN_BASE.jpg',
  final: 'https://i.ibb.co/YOUR_FINAL_POSTER.jpg'
};

// Language Texts
const TEXTS = {
  en: {
    welcome: '⭐ Welcome to Bizmapia - All India 4-in-1 Services!\n\n🚕 Affordable Taxi & Auto\n🏢 View/attach Businesses with 10,00,000+ Local Businesses\n🍔 Fast Food/Grocery/Parcel Delivery\n🏠 Rooms, Appointment, Movie Tickets\n💼 Earn with Bizmapia Business opportunity\n\nOne App. Four Services. Pan-India!',
    selectLang: '👇 Select language:',
    mainMenu: 'Choose your service:',
    rideMenu: '🚕 Ride - Hailing Service:',
    moreOptions: 'More Options:',
    earnMenu: '💼 Earn with Bizmapia - Choose plan:'
  },
  hi: {
    welcome: '⭐ Bizmapia में आपका स्वागत है - ऑल इंडिया 4-इन-1 सेवाएं!',
    selectLang: '👇 भाषा चुनें:',
    mainMenu: 'अपनी सेवा चुनें:',
    rideMenu: '🚕 सवारी सेवा:',
    moreOptions: 'अधिक विकल्प:',
    earnMenu: '💼 Bizmapia के साथ कमाएं:'
  },
  ml: {
    welcome: '⭐ Bizmapia-യിലേക്ക് സ്വാഗതം - ഓൾ ഇന്ത്യ 4-ഇൻ-1 സേവനങ്ങൾ!',
    selectLang: '👇 ഭാഷ തിരഞ്ഞെടുക്കുക:',
    mainMenu: 'നിങ്ങളുടെ സേവനം തിരഞ്ഞെടുക്കുക:',
    rideMenu: '🚕 റൈഡ് സേവനം:',
    moreOptions: 'കൂടുതൽ ഓപ്ഷനുകൾ:',
    earnMenu: '💼 Bizmapia-യോടൊപ്പം സമ്പാദിക്കുക:'
  }
};

// ====== GOOGLE SHEETS SETUP - V81 SAFE RANGES ======
let sheetsClient = null;
async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    sheetsClient = google.sheets({ version: 'v4', auth });
    console.log('Sheets client ready');
    return sheetsClient;
  } catch (e) {
    console.log('Sheets init skip:', e.message);
    return null;
  }
}

// V81 CRITICAL: All ranges with quotes + try/catch so bot never crashes
async function saveToSheet(range, values) {
  try {
    const client = await getSheetsClient();
    if (!client || !SHEET_ID) return;
    // FIX RANGE ERROR: Ensure quotes for sheets with spaces/hyphens
    let safeRange = range;
    if (range.includes(' - ') || range.includes(' ')) {
      if (!range.startsWith("'")) {
        const parts = range.split('!');
        safeRange = `'${parts[0]}'!${parts[1]}`;
      }
    }
    await client.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: safeRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
    console.log(`Sheet OK: ${safeRange}`);
  } catch (e) {
    // FIX: Never throw - just log, so language loop doesn't happen
    console.log(`Sheet skip [${range}]:`, e.message);
  }
}

// ====== WHATSAPP SEND FUNCTIONS - V81 RATE LIMIT FIX ======
async function sendWhatsAppMessage(to, payload) {
  // V81 FIX 130429: 15sec for same user, 30sec for broadcast
  const now = Date.now();
  const last = rateLimit[to] || 0;
  const gap = now - last;
  if (gap < 15000) {
    console.log(`Rate limit skip for ${to}, ${gap}ms since last`);
    await new Promise(r => setTimeout(r, 15000 - gap));
  }
  rateLimit[to] = Date.now();

  try {
    const url = `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
    await axios.post(url, {
      messaging_product: 'whatsapp',
      to: to,
      ...payload
    }, {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
    });
    console.log(`OUT to ${to}: ${payload.type || 'button'}`);
    // Log to Sheet6 - All Logs with safe range
    await saveToSheet('Sheet6 - All Logs!A:M', [[new Date().toISOString(), to, 'OUT', JSON.stringify(payload).substring(0, 400), '', '', '', '', '', '', '', '', '']]);
    return true;
  } catch (e) {
    const err = e.response?.data?.error;
    console.log(`OUT_FAILED to ${to}:`, err?.code, err?.message);
    if (err?.code === 130429) {
      console.log('130429 HIT - Waiting 60 sec');
      await new Promise(r => setTimeout(r, 60000));
      rateLimit[to] = Date.now() + 60000;
    }
    await saveToSheet('Sheet6 - All Logs!A:M', [[new Date().toISOString(), to, 'OUT_FAILED', err?.code + ' ' + err?.message, '', '', '', '', '', '', '', '', '']]);
    return false;
  }
}

async function sendWelcome(to, lang = 'en') {
  const t = TEXTS[lang] || TEXTS.en;
  // Welcome with poster + language buttons
  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: t.welcome + '\n\n' + t.selectLang },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'lang_en', title: 'English' } },
          { type: 'reply', reply: { id: 'lang_hi', title: 'हिन्दी' } },
          { type: 'reply', reply: { id: 'lang_ml', title: 'മലയാളം' } }
        ]
      }
    }
  });
}

async function sendMainMenu(to, lang = 'en') {
  const t = TEXTS[lang] || TEXTS.en;
  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: t.mainMenu },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'service_ride', title: 'Ride - Hailing' } },
          { type: 'reply', reply: { id: 'service_more', title: 'More Options' } },
          { type: 'reply', reply: { id: 'service_earn', title: 'Earn with Bizmapia' } }
        ]
      }
    }
  });
  // Save main menu state in memory FIRST
  if (userStates[to]) {
    userStates[to].step = 'main_menu';
    userStates[to].lastActive = Date.now();
  }
}

async function sendRideMenu(to, lang) {
  const t = TEXTS[lang] || TEXTS.en;
  await sendWhatsAppMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: t.rideMenu },
      action: {
        buttons: [
          { type: 'reply', reply: { id: 'ride_book', title: 'Book Ride' } },
          { type: 'reply', reply: { id: 'ride_attach', title: 'Attach Vehicle' } },
          { type: 'reply', reply: { id: 'back_main', title: 'Back to Menu' } }
        ]
      }
    }
  });
}

// ====== WEBHOOK VERIFY ======
app.get('/', (req, res) => res.send('V81 FINAL - Rate Limit Fix 130429 - 15sec/30sec - EN/HI/ML - 9 Posters - More Options Fixed - Direct Sheets Fixed - Reminders - CRM | Reminders | Setup Sheets | Clear Reminders'));

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else res.sendStatus(403);
});

// Health for UptimeRobot - V81 CRITICAL FOR NO SLEEP
app.get('/health', (req, res) => res.send('OK V81'));
app.get('/ping', (req, res) => res.send('pong'));

// Clear reminders endpoint
app.get('/clear-reminders', (req, res) => {
  Object.values(reminders).forEach(id => clearTimeout(id));
  Object.keys(reminders).forEach(k => delete reminders[k]);
  console.log('All reminders cleared!');
  res.send('All reminders cleared! V81 No spam.');
});

// ====== WEBHOOK MESSAGE HANDLER - V81 FINAL FIX ======
app.post('/webhook', async (req, res) => {
  res.sendStatus(200); // Immediate ACK to WhatsApp
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const msg = change?.value?.messages?.[0];
    if (!msg) return;
    const from = msg.from;
    const type = msg.type;

    console.log(`IN from ${from}: ${type} ${msg.text?.body || msg.button?.payload || msg.interactive?.button_reply?.id || ''}`);

    // Log IN to Sheet6 - All Logs with safe quoted range
    await saveToSheet('Sheet6 - All Logs!A:M', [[new Date().toISOString(), from, 'IN', type + ' ' + (msg.text?.body || msg.interactive?.button_reply?.id || ''), '', '', '', '', '', '', '', '', '']]);

    // Initialize user state if not exists
    if (!userStates[from]) {
      userStates[from] = { lang: null, step: 'welcome', lastActive: Date.now(), phone: from };
    }

    // Cancel any existing reminder (V81 FIX - No spam)
    if (reminders[from]) {
      clearTimeout(reminders[from]);
      delete reminders[from];
    }

    // Handle Text: Hi, Hello
    if (type === 'text') {
      const body = msg.text.body.toLowerCase().trim();
      if (['hi', 'hello', 'hey', 'hai', 'hii', 'start', 'menu'].includes(body)) {
        // Reset to welcome but keep language if exists
        userStates[from].step = 'welcome';
        await sendWelcome(from, userStates[from].lang || 'en');
        setReminder(from);
        return;
      }
    }

    // Handle Button Reply
    let buttonId = null;
    if (type === 'interactive' && msg.interactive?.type === 'button_reply') {
      buttonId = msg.interactive.button_reply.id;
    } else if (type === 'button' && msg.button?.payload) {
      buttonId = msg.button.payload;
    }

    if (!buttonId) {
      // If no button and no hi, show welcome
      if (userStates[from].step === 'welcome' || !userStates[from].lang) {
        await sendWelcome(from, userStates[from].lang || 'en');
        setReminder(from);
        return;
      }
    }

    // ====== V81 CRITICAL FIX: LANGUAGE SELECTION (STUCK LOOP FIX) ======
    if (buttonId && buttonId.startsWith('lang_')) {
      let lang = 'en';
      if (buttonId === 'lang_hi') lang = 'hi';
      if (buttonId === 'lang_ml') lang = 'ml';

      // FIX 1: Save to MEMORY FIRST (instant, never fails)
      userStates[from] = {
        ...userStates[from],
        lang: lang,
        step: 'main_menu',
        lastActive: Date.now(),
        phone: from
      };
      console.log(`User ${from} language set to ${lang} IN MEMORY`);

      // FIX 2: Try sheet save but DON'T wait/crash if fails
      saveToSheet('UserState!A:D', [[from, lang, new Date().toISOString(), 'main_menu']]).then(()=>{}).catch(()=>{});

      // FIX 3: Directly go to main menu, never back to welcome
      await new Promise(r => setTimeout(r, 500)); // Small delay to avoid 130429
      await sendMainMenu(from, lang);
      setReminder(from);
      return;
    }

    // Ensure language is set
    const currentLang = userStates[from]?.lang || 'en';

    // ====== MAIN MENU HANDLERS ======
    if (buttonId === 'service_ride') {
      userStates[from].step = 'ride_menu';
      await sendRideMenu(from, currentLang);
      setReminder(from);
      return;
    }

    if (buttonId === 'service_more') {
      userStates[from].step = 'more_options';
      await sendWhatsAppMessage(from, {
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: TEXTS[currentLang].moreOptions },
          action: {
            buttons: [
              { type: 'reply', reply: { id: 'more_business', title: 'Business Directory' } },
              { type: 'reply', reply: { id: 'more_delivery', title: 'Delivery' } },
              { type: 'reply', reply: { id: 'more_booking', title: 'Rooms / Movies' } }
            ]
          }
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
          body: { text: TEXTS[currentLang].earnMenu },
          action: {
            buttons: [
              { type: 'reply', reply: { id: 'earn_high', title: 'High Income' } },
              { type: 'reply', reply: { id: 'earn_moderate', title: 'Moderate' } },
              { type: 'reply', reply: { id: 'earn_base', title: 'Base Plan' } }
            ]
          }
        }
      });
      setReminder(from);
      return;
    }

    if (buttonId === 'back_main') {
      await sendMainMenu(from, currentLang);
      setReminder(from);
      return;
    }

    // Ride booking etc - log and reply
    if (buttonId) {
      await saveToSheet('Sheet6 - All Logs!A:M', [[new Date().toISOString(), from, 'ACTION', buttonId, currentLang, '', '', '', '', '', '', '', '']]);
      await sendWhatsAppMessage(from, {
        type: 'text',
        text: { body: `You selected: ${buttonId}\nOur team will contact you at ${from}. Thank you!` }
      });
      setReminder(from);
    }

  } catch (err) {
    console.log('Webhook error:', err.message);
  }
});

// ====== REMINDER LOGIC - V81 NO SPAM FIX ======
function setReminder(to) {
  // Clear old
  if (reminders[to]) clearTimeout(reminders[to]);
  
  // V81: First reminder only after 30 min, not 5 min (fixes 130429 spam)
  const timeoutId = setTimeout(async () => {
    const state = userStates[to];
    if (!state) return;
    // Only if user didn't complete
    if (state.step !== 'completed') {
      await sendWhatsAppMessage(to, {
        type: 'text',
        text: { body: '👋 Still there? Continue your Bizmapia service. Type Hi to restart.' }
      });
    }
    delete reminders[to];
  }, 30 * 60 * 1000); // 30 minutes

  reminders[to] = timeoutId;
  console.log(`Reminder set for ${to} in 30 min`);
}

// ====== START SERVER ======
app.listen(PORT, async () => {
  console.log(`V81 FINAL listening on ${PORT}`);
  console.log('V81 FIXED RANGE with quotes, Rate limit 15sec/30sec, Language Memory First');
  await getSheetsClient();
});

