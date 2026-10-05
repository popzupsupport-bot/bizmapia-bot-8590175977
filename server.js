import express from 'express';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import fs from 'fs';
import qrcode from 'qrcode';
import cors from 'cors';
import pino from 'pino';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

let sock = null;
let qrCodeData = null;
let pairingCode = null;
const PHONE_NUMBER = "918590175977";
const userStages = new Map();

// ===== ASSETS =====
const ASSETS = {
  images: {
    welcome: ['bizmapia_welcome_HD_1080.jpg', 'bizmapia_welcome_HD.jpg', 'bizmapia_welcome.jpg'],
    customer: ['bizmapia_customer_welcome_HD.jpg'],
    driver: ['bizmapia_driver_welcome_HD.jpg'],
    business: ['bizmapia_business_reg_HD.jpg'],
    opportunity: ['bizmapia_biz_opp_HD.jpg', 'bizmapia_benefit_reminder_HD.jpg'],
  },
  apps: {
    customer: 'https://play.google.com/store/apps/details?id=com.bizmapia.customer',
    driver: 'https://play.google.com/store/apps/details?id=com.bizmapia.driver',
    business: 'https://play.google.com/store/apps/details?id=com.bizmapia.business'
  }
};

// ===== FULL LANGUAGES =====
const LANG = {
  en: {
    welcome: `👋 *Welcome to Bizmapia!*\n\n🇮🇳 India's Fastest Growing Local Business Network\n\nPlease select your language:\n\n1️⃣ English\n2️⃣ हिंदी (Hindi)\n3️⃣ മലയാളം (Malayalam)\n\nReply with 1, 2 or 3`,
    menu: `✅ *English Selected*\n\n*How can we help you?*\n\n1️⃣ Customer App - Order Food, Grocery, Medicine\n2️⃣ Driver / Delivery Partner Job - Earn ₹25k-40k\n3️⃣ Business Registration - Add Your Shop FREE\n4️⃣ Business Opportunity - Become Partner\n5️⃣ Help & Support\n\nReply with number (1-5)`,
    customer: `📱 *Bizmapia Customer App*\n\nOrder Food, Grocery, Medicine & More from nearby shops in 30 mins!\n\n✨ Best Offers & Fast Delivery\n\n👉 Download Now:\n${'https://play.google.com/store/apps/details?id=com.bizmapia.customer'}\n\nType *hi* for main menu`,
    driver: `🚚 *Join as Bizmapia Driver / Delivery Partner*\n\n💰 Earn ₹25,000 - ₹40,000 per month\n⏰ Flexible Timing\n🎁 Daily Bonus\n\n👉 Download Driver App:\n${'https://play.google.com/store/apps/details?id=com.bizmapia.driver'}\n\nOur team will call you in 24 hours\n\nType *hi* for main menu`,
    business: `🏪 *Register Your Business FREE on Bizmapia*\n\n✅ Get more customers from your area\n✅ Free online shop\n✅ Manage orders easily\n\n👉 Download Business App:\n${'https://play.google.com/store/apps/details?id=com.bizmapia.business'}\n\nOur executive will visit you in 24hrs\n\nType *hi* for main menu`,
    opportunity: `💼 *Bizmapia Business Opportunity*\n\nBecome District / Mandal Partner & Earn Big!\n\n💸 Earn from every order in your area\n🏆 Low Investment, High Return\n\nReply *INTERESTED* - our team will call you\n\nType *hi* for main menu`,
    help: `📞 *Bizmapia Support*\n\nCall/WhatsApp: 8590175977\nEmail: support@bizmapia.com\n\nType *hi* for main menu`
  },
  hi: {
    menu: `✅ *हिंदी चुनी गई*\n\n*हम आपकी कैसे मदद कर सकते हैं?*\n\n1️⃣ कस्टमर ऐप - खाना, ग्रोसरी ऑर्डर करें\n2️⃣ ड्राइवर / डिलीवरी पार्टनर जॉब - ₹25k-40k कमाएं\n3️⃣ बिजनेस रजिस्ट्रेशन - अपनी दुकान FREE में जोड़ें\n4️⃣ बिजनेस अपॉर्चुनिटी - पार्टनर बनें\n5️⃣ हेल्प & सपोर्ट\n\nनंबर भेजें (1-5)`,
    customer: `📱 *Bizmapia कस्टमर ऐप*\nनजदीकी दुकानों से 30 मिनट में ऑर्डर करें!\n\n👉 डाउनलोड करें:\nhttps://play.google.com/store/apps/details?id=com.bizmapia.customer\n\n*hi* टाइप करें मेनू के लिए`,
    driver: `🚚 *Bizmapia ड्राइवर बनें*\n₹25,000 - ₹40,000 महीना कमाएं\n\n👉 डाउनलोड:\nhttps://play.google.com/store/apps/details?id=com.bizmapia.driver\n\n*hi* टाइप करें`,
    business: `🏪 *अपना बिजनेस FREE में जोड़ें*\nज्यादा ग्राहक पाएं!\n\n👉 डाउनलोड:\nhttps://play.google.com/store/apps/details?id=com.bizmapia.business\n\n*hi* टाइप करें`,
    opportunity: `💼 *बिजनेस अपॉर्चुनिटी*\nजिला पार्टनर बनें!\n*INTERESTED* लिखें\n\n*hi* टाइप करें`,
    help: `📞 सपोर्ट: 8590175977\n*hi* टाइप करें`
  },
  ml: {
    menu: `✅ *മലയാളം തിരഞ്ഞെടുത്തു*\n\n*എങ്ങനെ സഹായിക്കാം?*\n\n1️⃣ കസ്റ്റമർ ആപ്പ് - ഭക്ഷണം, ഗ്രോസറി ഓർഡർ ചെയ്യുക\n2️⃣ ഡ്രൈവർ ജോലി - ₹25k-40k സമ്പാദിക്കുക\n3️⃣ ബിസിനസ് രജിസ്ട്രേഷൻ - നിങ്ങളുടെ കട FREE ആയി ചേർക്കുക\n4️⃣ ബിസിനസ് അവസരം - പാർട്ണർ ആകുക\n5️⃣ ഹെൽപ്പ് & സപ്പോർട്ട്\n\nനമ്പർ അയക്കുക (1-5)`,
    customer: `📱 *Bizmapia കസ്റ്റമർ ആപ്പ്*\n30 മിനിറ്റിൽ അടുത്തുള്ള കടകളിൽ നിന്ന് ഓർഡർ ചെയ്യുക!\n\n👉 ഡൗൺലോഡ്:\nhttps://play.google.com/store/apps/details?id=com.bizmapia.customer\n\nമെനുവിന് *hi* ടൈപ്പ് ചെയ്യുക`,
    driver: `🚚 *Bizmapia ഡ്രൈവർ ആകൂ*\n₹25,000 - ₹40,000 പ്രതിമാസം നേടൂ\n\n👉 ഡൗൺലോഡ്:\nhttps://play.google.com/store/apps/details?id=com.bizmapia.driver\n\n*hi* ടൈപ്പ് ചെയ്യുക`,
    business: `🏪 *നിങ്ങളുടെ ബിസിനസ് FREE ആയി ചേർക്കുക*\nകൂടുതൽ ഉപഭോക്താക്കളെ നേടൂ!\n\n👉 ഡൗൺലോഡ്:\nhttps://play.google.com/store/apps/details?id=com.bizmapia.business\n\n*hi* ടൈപ്പ് ചെയ്യുക`,
    opportunity: `💼 *ബിസിനസ് അവസരം*\nജില്ലാ പാർട്ണർ ആകൂ!\n*INTERESTED* എന്ന് അയക്കൂ\n\n*hi* ടൈപ്പ് ചെയ്യുക`,
    help: `📞 സപ്പോർട്ട്: 8590175977\n*hi* ടൈപ്പ് ചെയ്യുക`
  }
};

function getLangText(user, key) {
  const lang = user.lang || 'en';
  return LANG[lang]?.[key] || LANG.en[key];
}

async function sendImageWithCaption(to, imageNames, caption) {
  try {
    for (let name of imageNames) {
      const p = path.join(__dirname, name);
      if (fs.existsSync(p)) {
        await sock.sendMessage(to, { image: fs.readFileSync(p), caption });
        return;
      }
    }
    await sock.sendMessage(to, { text: caption });
  } catch(e) { await sock.sendMessage(to, { text: caption }); }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }), browser: ['Bizmapia','Chrome','1.0'] });
  sock.ev.on('creds.update', saveCreds);

  if (!state.creds.registered) {
    setTimeout(async () => {
      try { pairingCode = await sock.requestPairingCode(PHONE_NUMBER); console.log("PAIRING CODE: "+pairingCode); } catch(e){}
    }, 4000);
  }

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) qrCodeData = await qrcode.toDataURL(qr);
    if (connection === 'open') { console.log("✅ 8590175977 Connected!"); qrCodeData = null; pairingCode = null; }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startBot();
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      const from = msg.key.remoteJid;
      if (from.includes('status@broadcast')) continue;
      const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").trim();
      const lower = text.toLowerCase();
      if (!userStages.has(from)) userStages.set(from, { stage: 'NEW', lang: 'en' });
      let user = userStages.get(from);

      if (lower === 'hi' || lower === 'hello' || lower === 'hai' || lower === 'hey' || user.stage === 'NEW') {
        await sendImageWithCaption(from, ASSETS.images.welcome, LANG.en.welcome);
        user.stage = 'LANG'; continue;
      }
      if (user.stage === 'LANG') {
        if (lower === '1' || lower.includes('english')) { user.lang = 'en'; user.stage = 'MENU'; await sock.sendMessage(from, { text: LANG.en.menu }); }
        else if (lower === '2' || lower.includes('hindi') || lower.includes('हिंदी')) { user.lang = 'hi'; user.stage = 'MENU'; await sock.sendMessage(from, { text: LANG.hi.menu }); }
        else if (lower === '3' || lower.includes('malayalam') || lower.includes('മലയാളം')) { user.lang = 'ml'; user.stage = 'MENU'; await sock.sendMessage(from, { text: LANG.ml.menu }); }
        else { await sock.sendMessage(from, { text: LANG.en.welcome }); }
        continue;
      }
      if (user.stage === 'MENU') {
        if (lower === '1') await sendImageWithCaption(from, ASSETS.images.customer, getLangText(user, 'customer'));
        else if (lower === '2') await sendImageWithCaption(from, ASSETS.images.driver, getLangText(user, 'driver'));
        else if (lower === '3') await sendImageWithCaption(from, ASSETS.images.business, getLangText(user, 'business'));
        else if (lower === '4') await sendImageWithCaption(from, ASSETS.images.opportunity, getLangText(user, 'opportunity'));
        else if (lower === '5') await sock.sendMessage(from, { text: getLangText(user, 'help') });
        else { await sock.sendMessage(from, { text: getLangText(user, 'menu') }); }
      }
    }
  });
}

app.get('/', (req,res)=>res.send(`<h2>Bizmapia 8590175977 - ${sock?'Connected ✅':'Starting...'}</h2><a href='/qr'>QR</a> | <a href='/pair'>Pairing Code</a>`));
app.get('/qr', (req,res)=>{
  if(!qrCodeData) return res.send(sock?'<h2>Connected ✅</h2>':'<h2>Generating QR... Refresh 10 sec</h2><a href="/pair">Try Pairing Code</a>');
  res.send(`<div style="text-align:center"><h2>Scan with 8590175977</h2><img src="${qrCodeData}" width="300"><p><a href="/pair">Pairing Code (Better)</a></p></div>`);
});
app.get('/clear', (req,res)=>{
  try {
    fs.rmSync('./auth_info', {recursive:true, force:true});
    console.log("Auth cleared by /clear");
    res.send("<h2>✅ Session Cleared! Now go to Render > Manual Deploy > Clear build cache & Deploy</h2>");
  } catch(e){ res.send("Error: "+e.message); }
});
  if(pairingCode) res.send(`<div style="text-align:center"><h1 style="font-size:55px; letter-spacing:8px; margin-top:50px;">${pairingCode}</h1><h3>WhatsApp > Linked Devices > Link with phone number > Enter this code</h3></div>`);
  else res.send(sock?'<h2>Already Connected ✅</h2>':'<h2>Generating Pairing Code... Refresh after 10 sec</h2>');
});

app.listen(PORT, ()=>{ console.log(`Server on ${PORT}`); startBot(); });
