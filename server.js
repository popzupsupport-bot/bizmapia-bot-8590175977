require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia123';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;

// Simple in-memory sessions
const sessions = new Map();

function log(...args) { console.log(new Date().toISOString(),...args); }

async function sendMessage(to, data) {
  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
  try {
    await axios.post(url, {
      messaging_product: 'whatsapp',
      to: to,
     ...data
    }, {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    log('Send Error:', e.response?.data || e.message);
  }
}

function sendLanguageMenu(to) {
  return sendMessage(to, {
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: 'Welcome to Bizmapia 🙏\n\nSelect your language / अपनी भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക' },
      footer: { text: 'Bizmapia Business Assistant' },
      action: {
        button: 'Select Language',
        sections: [{
          title: 'Languages',
          rows: [
            { id: 'lang_english', title: 'English', description: 'Continue in English' },
            { id: 'lang_hindi', title: 'हिंदी', description: 'हिंदी में जारी रखें' },
            { id: 'lang_malayalam', title: 'മലയാളം', description: 'മലയാളത്തിൽ തുടരുക' }
          ]
        }]
      }
    }
  });
}

function getUserInput(message) {
  // Log full message for debugging
  log('RAW MESSAGE:', JSON.stringify(message));

  if (message.interactive) {
    if (message.interactive.list_reply) {
      return {
        id: message.interactive.list_reply.id.toLowerCase(),
        text: message.interactive.list_reply.title.toLowerCase()
      };
    }
    if (message.interactive.button_reply) {
      return {
        id: message.interactive.button_reply.id.toLowerCase(),
        text: message.interactive.button_reply.title.toLowerCase()
      };
    }
  }
  if (message.text) {
    return {
      id: message.text.body.toLowerCase().trim(),
      text: message.text.body.toLowerCase().trim()
    };
  }
  return { id: '', text: '' };
}

app.get('/', (req, res) => res.send('Bizmapia Bot Running ✅'));

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    log('Webhook Verified!');
    return res.send(req.query['hub.challenge']);
  }
  return res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  res.sendStatus(200); // Always 200 to Meta fast

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) return;

    const from = message.from;
    const input = getUserInput(message);

    log(`From: ${from} | ID: ${input.id} | Text: ${input.text}`);

    let session = sessions.get(from);
    if (!session || input.text === 'hi' || input.text === 'hello' || input.text === 'hey' || input.id === 'hi') {
      session = { step: 'LANGUAGE', language: null };
      sessions.set(from, session);
      await sendLanguageMenu(from);
      return;
    }

    // STEP 1: LANGUAGE SELECTION - FIXED FOR ALL CASES
    if (session.step === 'LANGUAGE') {
      let lang = null;

      if (input.id.includes('english') || input.text.includes('english')) lang = 'english';
      else if (input.id.includes('hindi') || input.text.includes('हिंदी')) lang = 'hindi';
      else if (input.id.includes('malayalam') || input.text.includes('malayalam') || input.text.includes('മലയാളം')) lang = 'malayalam';

      // Also handle direct row titles
      else if (input.id === 'lang_english' || input.id === 'lang_en') lang = 'english';
      else if (input.id === 'lang_hindi' || input.id === 'lang_hi') lang = 'hindi';
      else if (input.id === 'lang_malayalam' || input.id === 'lang_ml') lang = 'malayalam';

      if (lang) {
        session.language = lang;
        session.step = 'MAIN_MENU';
        sessions.set(from, session);
        log(`Language selected: ${lang} for ${from}`);

        if (lang === 'english') {
          await sendMessage(from, { type: 'text', text: { body: `✅ English selected!\n\nWelcome to Bizmapia!\n\nType:\n1️⃣ For Business Listing\n2️⃣ For Services\n3️⃣ For Support` } });
        } else if (lang === 'hindi') {
          await sendMessage(from, { type: 'text', text: { body: `✅ हिंदी चुनी गई!\n\nबिज़मैपिया में आपका स्वागत है!\n\nटाइप करें:\n1️⃣ बिज़नेस लिस्टिंग के लिए\n2️⃣ सेवाओं के लिए` } });
        } else {
          await sendMessage(from, { type: 'text', text: { body: `✅ മലയാളം തിരഞ്ഞെടുത്തു!\n\nബിസ്മാപിയയിലേക്ക് സ്വാഗതം!\n\nടൈപ്പ് ചെയ്യുക:\n1️⃣ ബിസിനസ് ലിസ്റ്റിംഗിന്\n2️⃣ സേവനങ്ങൾക്ക്` } });
        }
        return;
      } else {
        log(`Invalid language input, resending menu`);
        await sendLanguageMenu(from);
        return;
      }
    }

    // STEP 2 ONWARDS
    if (session.step === 'MAIN_MENU') {
      await sendMessage(from, { type: 'text', text: { body: `You are in main menu (${session.language}). You typed: ${input.text}\n\nType HI to start again.` } });
    }

  } catch (err) {
    log('Webhook Error:', err.message);
  }
});

app.listen(PORT, () => log(`Bizmapia Bot Running on ${PORT}`));
