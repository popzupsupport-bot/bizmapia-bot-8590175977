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

// --- CLEAN BAD MAC ONCE ---
try {
  if (fs.existsSync('./auth_info_baileys')) {
    fs.rmSync('./auth_info_baileys', { recursive: true, force: true });
    console.log("=== Old Auth Deleted - Clean Start ===");
  }
} catch(e){}

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

const ASSETS = {
  images: {
    welcome: ['bizmapia_welcome_HD_1080.jpg', 'bizmapia_welcome_HD.jpg'],
    customer: ['bizmapia_customer_welcome_HD.jpg'],
    driver: ['bizmapia_driver_welcome_HD.jpg'],
    business: ['bizmapia_business_reg_HD.jpg'],
    opportunity: ['bizmapia_biz_opp_HD.jpg'],
    benefit: ['bizmapia_benefit_reminder_HD.jpg'],
    discount: ['bizmapia_1year_discount_HD.jpg'],
    freeRecharge: ['bizmapia_benefit_reminder_HD.jpg']
  },
  apps: {
    customer: 'https://play.google.com/store/apps/details?id=com.bizmapia.customer',
    driver: 'https://play.google.com/store/apps/details?id=com.bizmapia.driver',
    business: 'https://play.google.com/store/apps/details?id=com.bizmapia.business'
  }
};

let sock = null;
let qrCodeData = null;
const userStages = new Map();

async function sendImageWithCaption(to, imageName, caption) {
  try {
    const imgPath = path.join(__dirname, imageName);
    if (!fs.existsSync(imgPath)) {
      await sock.sendMessage(to, { text: caption });
      return;
    }
    await sock.sendMessage(to, { image: fs.readFileSync(imgPath), caption: caption });
  } catch (e) {
    await sock.sendMessage(to, { text: caption });
  }
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Bizmapia Bot', 'Chrome', '1.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      qrCodeData = await qrcode.toDataURL(qr);
      console.log("QR Generated - open /qr to scan");
    }
    if (connection === 'open') {
      console.log("✅ WhatsApp Connected Successfully! 8590175977 is now bot");
      qrCodeData = null;
    }
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
      console.log("Connection closed, reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;
      const from = msg.key.remoteJid;
      if (!from || from.includes('status@broadcast')) continue;

      const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").trim();
      const lower = text.toLowerCase();
      console.log(`Received from ${from}: ${text}`);

      if (!userStages.has(from)) userStages.set(from, { stage: 'NEW' });
      let user = userStages.get(from);

      // WELCOME
      if (lower === 'hi' || lower === 'hello' || lower === 'hai' || user.stage === 'NEW') {
        const welcomeMsg = `👋 *Welcome to Bizmapia!* \n\nIndia's Fastest Growing Local Business Network\n\nPlease select your language:\n\n1️⃣ English\n2️⃣ हिंदी\n3️⃣ മലയാളം\n\nReply with 1, 2 or 3`;
        await sendImageWithCaption(from, ASSETS.images.welcome[0], welcomeMsg);
        user.stage = 'LANG';
        continue;
      }

      if (user.stage === 'LANG') {
        if (lower === '1' || lower.includes('english')) {
          user.lang = 'en';
          user.stage = 'MENU';
          await sock.sendMessage(from, { text: `✅ English Selected\n\n*How can we help you?*\n\n1️⃣ Customer App - Order Services\n2️⃣ Driver / Partner Job\n3️⃣ Business Registration - Add Your Shop\n4️⃣ Business Opportunity\n5️⃣ Help & Support\n\nReply with number (1-5)` });
        } else if (lower === '2') {
          user.lang = 'hi';
          user.stage = 'MENU';
          await sock.sendMessage(from, { text: `✅ हिंदी चुनी गई\n\n1️⃣ कस्टमर ऐप\n2️⃣ ड्राइवर जॉब\n3️⃣ बिजनेस रजिस्ट्रेशन\n4️⃣ बिजनेस अपॉर्चुनिटी\n\nनंबर भेजें` });
        } else if (lower === '3') {
          user.lang = 'ml';
          user.stage = 'MENU';
          await sock.sendMessage(from, { text: `✅ മലയാളം തിരഞ്ഞെടുത്തു\n\n1️⃣ കസ്റ്റമർ ആപ്പ്\n2️⃣ ഡ്രൈവർ ജോലി\n3️⃣ ബിസിനസ് രജിസ്ട്രേഷൻ\n4️⃣ ബിസിനസ് അവസരം\n\nനമ്പർ അയക്കുക` });
        }
        continue;
      }

      if (user.stage === 'MENU') {
        if (lower === '1') {
          await sendImageWithCaption(from, ASSETS.images.customer[0], `📱 *Bizmapia Customer App*\n\nOrder Food, Grocery, Medicine & More from nearby shops\n\n👉 Download Now:\n${ASSETS.apps.customer}\n\nType *hi* for main menu`);
        } else if (lower === '2') {
          await sendImageWithCaption(from, ASSETS.images.driver[0], `🚚 *Join as Bizmapia Driver / Partner*\n\nEarn ₹25,000 - ₹40,000 per month\n\n👉 Download Driver App:\n${ASSETS.apps.driver}\n\nType *hi* for menu`);
        } else if (lower === '3') {
          await sendImageWithCaption(from, ASSETS.images.business[0], `🏪 *Register Your Business FREE*\n\nGet more customers from your area!\n\n👉 Download Business App:\n${ASSETS.apps.business}\n\nOur team will call you in 24hrs\nType *hi* for menu`);
        } else if (lower === '4') {
          await sendImageWithCaption(from, ASSETS.images.opportunity[0], `💼 *Bizmapia Business Opportunity*\n\nBecome District / Mandal Partner & Earn Big!\n\nInvestment starts from low budget\n\nReply *INTERESTED* and our team will call you.\nType *hi* for menu`);
        } else {
          await sock.sendMessage(from, { text: `For support call: 8590175977\nType *hi* to start again` });
        }
      }
    }
  });
}

app.get('/', (req, res) => {
  res.send(`<h2>Bizmapia Bot 8590175977</h2><p>Status: ${sock? 'Connected ✅' : 'Starting...'} </p><a href="/qr">View QR</a>`);
});

app.get('/qr', async (req, res) => {
  if (!qrCodeData) return res.send(`<h2>${sock? '✅ Connected Already - No QR Needed' : 'Wait... Generating QR... Refresh after 10 sec'}</h2>`);
  res.send(`<div style="text-align:center"><h2>Scan with 8590175977 WhatsApp</h2><img src="${qrCodeData}" style="width:300px"><p>WhatsApp > Linked Devices > Link a Device</p></div>`);
});

app.listen(PORT, () => { console.log(`Server running on ${PORT}`); startBot(); });
