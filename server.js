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

// === ASSETS ===
const ASSETS = {
  images: { welcome: ['bizmapia_welcome_HD_1080.jpg','bizmapia_welcome_HD.jpg','bizmapia_welcome.jpg'], customer: ['bizmapia_customer_welcome_HD.jpg'], driver: ['bizmapia_driver_welcome_HD.jpg'], business: ['bizmapia_business_reg_HD.jpg'], opportunity: ['bizmapia_biz_opp_HD.jpg'] },
  apps: { customer: 'https://play.google.com/store/apps/details?id=com.bizmapia.customer', driver: 'https://play.google.com/store/apps/details?id=com.bizmapia.driver', business: 'https://play.google.com/store/apps/details?id=com.bizmapia.business' }
};

// === LANGUAGES - FULL ===
const LANG = {
  en: {
    welcome: `👋 *Welcome to Bizmapia!*\n\n🇮🇳 India's Fastest Growing Local Business Network\n\nPlease select your language:\n\n1️⃣ English\n2️⃣ हिंदी (Hindi)\n3️⃣ മലയാളം (Malayalam)\n\nReply with 1, 2 or 3`,
    menu: `✅ *English Selected*\n\n*How can we help you?*\n\n1️⃣ Customer App - Order Food, Grocery\n2️⃣ Driver / Delivery Partner - Earn ₹25k-40k\n3️⃣ Business Registration - FREE\n4️⃣ Business Opportunity - Partner\n5️⃣ Help & Support\n\nReply with number (1-5)`,
    customer: `📱 *Bizmapia Customer App*\nOrder in 30 mins!\n\n👉 Download:\n${'https://play.google.com/store/apps/details?id=com.bizmapia.customer'}\n\nType *hi* for menu`,
    driver: `🚚 *Driver Job*\nEarn ₹25k-40k\n\n👉 ${'https://play.google.com/store/apps/details?id=com.bizmapia.driver'}\n\nType *hi*`,
    business: `🏪 *Business FREE Registration*\n\n👉 ${'https://play.google.com/store/apps/details?id=com.bizmapia.business'}\n\nType *hi*`,
    opportunity: `💼 *Business Opportunity*\nReply INTERESTED\n\nType *hi*`,
    help: `📞 Support: 8590175977\nType *hi*`
  },
  hi: {
    menu: `✅ *हिंदी चुनी गई*\n\n1️⃣ कस्टमर ऐप\n2️⃣ ड्राइवर जॉब - ₹25k-40k\n3️⃣ बिजनेस रजिस्ट्रेशन FREE\n4️⃣ बिजनेस अपॉर्चुनिटी\n5️⃣ हेल्प\n\nनंबर भेजें (1-5)`,
    customer: `📱 *कस्टमर ऐप*\n👉 https://play.google.com/store/apps/details?id=com.bizmapia.customer\n\n*hi* टाइप करें`,
    driver: `🚚 *ड्राइवर बनें - ₹25k-40k*\n👉 https://play.google.com/store/apps/details?id=com.bizmapia.driver\n*hi*`,
    business: `🏪 *बिजनेस FREE*\n👉 https://play.google.com/store/apps/details?id=com.bizmapia.business\n*hi*`,
    opportunity: `💼 *बिजनेस अपॉर्चुनिटी*\nINTERESTED लिखें\n*hi*`,
    help: `📞 8590175977\n*hi*`
  },
  ml: {
    menu: `✅ *മലയാളം*\n\n1️⃣ കസ്റ്റമർ ആപ്പ്\n2️⃣ ഡ്രൈവർ ജോലി - ₹25k-40k\n3️⃣ ബിസിനസ് FREE\n4️⃣ അവസരം\n5️⃣ ഹെൽപ്പ്\n\nനമ്പർ (1-5)`,
    customer: `📱 *കസ്റ്റമർ ആപ്പ്*\n👉 https://play.google.com/store/apps/details?id=com.bizmapia.customer\n*hi*`,
    driver: `🚚 *ഡ്രൈവർ - ₹25k-40k*\n👉 https://play.google.com/store/apps/details?id=com.bizmapia.driver\n*hi*`,
    business: `🏪 *ബിസിനസ് FREE*\n👉 https://play.google.com/store/apps/details?id=com.bizmapia.business\n*hi*`,
    opportunity: `💼 *അവസരം*\nINTERESTED\n*hi*`,
    help: `📞 8590175977\n*hi*`
  }
};

function getLang(user, key){ return (LANG[user.lang||'en'] && LANG[user.lang||'en'][key]) || LANG.en[key]; }
async function sendImg(to, names, caption){
  try{
    for(let n of names){ const p=path.join(__dirname,n); if(fs.existsSync(p)){ await sock.sendMessage(to,{image:fs.readFileSync(p),caption}); return; } }
    await sock.sendMessage(to,{text:caption});
  }catch(e){ await sock.sendMessage(to,{text:caption}); }
}

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  sock = makeWASocket({ auth: state, logger: pino({level:'silent'}), browser: ['Bizmapia','Chrome','1.0'] });
  sock.ev.on('creds.update', saveCreds);
  if(!state.creds.registered){ setTimeout(async()=>{ try{ pairingCode = await sock.requestPairingCode(PHONE_NUMBER); console.log("PAIRING CODE: "+pairingCode);}catch(e){} }, 3000); }
  sock.ev.on('connection.update', async (update)=>{
    const { connection, lastDisconnect, qr } = update;
    if(qr) qrCodeData = await qrcode.toDataURL(qr);
    if(connection==='open'){ console.log("✅ 8590175977 Connected!"); qrCodeData=null; pairingCode=null; }
    if(connection==='close'){ const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut; if(shouldReconnect) startBot(); }
  });
  sock.ev.on('messages.upsert', async ({messages})=>{
    for(const msg of messages){
      if(!msg.message || msg.key.fromMe) continue;
      const from = msg.key.remoteJid;
      if(from.includes('status@broadcast')) continue;
      const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").trim();
      const lower = text.toLowerCase();
      if(!userStages.has(from)) userStages.set(from,{stage:'NEW',lang:'en'});
      let user = userStages.get(from);
      if(lower==='hi' || lower==='hello' || lower==='hai' || user.stage==='NEW'){
        await sendImg(from, ASSETS.images.welcome, LANG.en.welcome);
        user.stage='LANG'; continue;
      }
      if(user.stage==='LANG'){
        if(lower==='1' || lower.includes('english')){ user.lang='en'; user.stage='MENU'; await sock.sendMessage(from,{text:LANG.en.menu}); }
        else if(lower==='2' || lower.includes('hindi') || lower.includes('हिंदी')){ user.lang='hi'; user.stage='MENU'; await sock.sendMessage(from,{text:LANG.hi.menu}); }
        else if(lower==='3' || lower.includes('malayalam') || lower.includes('മലയാളം')){ user.lang='ml'; user.stage='MENU'; await sock.sendMessage(from,{text:LANG.ml.menu}); }
        else{ await sock.sendMessage(from,{text:LANG.en.welcome}); }
        continue;
      }
      if(user.stage==='MENU'){
        if(lower==='1') await sendImg(from, ASSETS.images.customer, getLang(user,'customer'));
        else if(lower==='2') await sendImg(from, ASSETS.images.driver, getLang(user,'driver'));
        else if(lower==='3') await sendImg(from, ASSETS.images.business, getLang(user,'business'));
        else if(lower==='4') await sendImg(from, ASSETS.images.opportunity, getLang(user,'opportunity'));
        else if(lower==='5') await sock.sendMessage(from,{text:getLang(user,'help')});
        else await sock.sendMessage(from,{text:getLang(user,'menu')});
      }
    }
  });
}

// --- ROUTES ---
app.get('/clear', (req,res)=>{
  try{
    if(fs.existsSync('./auth_info')) fs.rmSync('./auth_info',{recursive:true, force:true});
    res.send("<h2>✅ Session Cleared! Now go to Render > Manual Deploy > Clear build cache & Deploy</h2>");
  }catch(e){ res.send("Error: "+e.message); }
});
app.get('/', (req,res)=>res.send(`<h2>Bizmapia 8590175977 - ${sock?'Connected ✅':'Starting...'}</h2><a href='/qr'>QR</a> | <a href='/pair'>Pairing</a> | <a href='/clear'>Clear Session</a>`));
app.get('/qr', (req,res)=>{
  if(!qrCodeData) return res.send(sock?'<h2>Connected ✅</h2>':'<h2>Generating QR... Refresh</h2><a href="/pair">Pairing Code</a>');
  res.send(`<div style="text-align:center"><h2>Scan with 8590175977</h2><img src="${qrCodeData}" width="300"><p><a href="/pair">Pairing Code</a></p></div>`);
});
app.get('/pair', (req,res)=>{
  if(pairingCode) res.send(`<div style="text-align:center"><h1 style="font-size:55px;letter-spacing:8px;margin-top:50px;">${pairingCode}</h1><h3>WhatsApp > Linked Devices > Link with phone number</h3></div>`);
  else res.send(sock?'<h2>Already Connected ✅</h2>':'<h2>Generating Code... Refresh 10 sec</h2>');
});

app.listen(PORT, ()=>{ console.log(`Server on ${PORT}`); startBot(); });
