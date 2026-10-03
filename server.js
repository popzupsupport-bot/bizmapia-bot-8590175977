const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "bizmapia_verify_2024";
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;

// ===== FINAL 6 POSTERS - YOUR FINAL MAPPING =====
const ASSETS = {
  posters: {
    welcome: "https://ibb.co/FbptYg3F", // VERY FIRST Hi message - https://ibb.co/FbptYg3F
    customer: "https://ibb.co/3XsWd3p", // A - Customer - https://ibb.co/3XsWd3p
    driver: "https://ibb.co/2153CSjp", // B - Driver - https://ibb.co/2153CSjp
    business: "https://ibb.co/3yjrdVxk", // C - Business Reg - https://ibb.co/3yjrdVxk
    opportunity: "https://ibb.co/gbPYBbMt", // D - Business Opp - https://ibb.co/gbPYBbMt
    freeRecharge: "https://ibb.co/LXVpRKQp" // Free Recharge Benefit - https://ibb.co/LXVpRKQp
  },
  apps: {
    customer: "https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia&pcampaignid=web_share",
    driver: "https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia_driver&pcampaignid=web_share"
  },
  videos: {
    intro: "https://YOUR_LINK/bizmapia-intro.mp4",
    driverDemo: "https://YOUR_LINK/driver-demo.mp4",
    businessDemo: "https://YOUR_LINK/business-demo.mp4"
  }
};

const sessions = {};
async function sendText(to, body) {
  await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp", to, type: "text", text: { body }
  }, { headers: { Authorization: `Bearer ${TOKEN}` } });
}
async function sendImg(to, link, caption) {
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp", to, type: "image", image: { link, caption }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) {
    await sendText(to, caption + "\n\n" + link);
  }
}
function getSession(p) { if (!sessions[p]) sessions[p] = { stage: "NEW" }; return sessions[p]; }

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) res.send(req.query['hub.challenge']);
  else res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  const m = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!m) return res.sendStatus(200);
  const from = m.from;
  const txt = m.text?.body?.trim() || "";
  const up = txt.toUpperCase();
  const s = getSession(from);

  // 1. WELCOME HI - Poster FbptYg3F
  if (s.stage === "NEW" || ["HI","HELLO","HEY","HLO"].includes(up)) {
    s.stage = "LANG";
    await sendImg(from, ASSETS.posters.welcome, "👋 Welcome to Bizmapia!\nYour Success, Our Platform 🙏\n50+ Franchisees in Kerala - 4 Opportunities Under One Brand");
    await sendText(from, `👋 *Welcome to Bizmapia!*\n\nThank you for your enquiry.\n\nPlease select language:\n\nA — English\nB — Hindi\nC — Malayalam\n\nReply A/B/C`);
    return res.sendStatus(200);
  }

  if (s.stage === "LANG") {
    s.stage = "MENU";
    await sendText(from, `Thank you! English selected 🇬🇧\n\nPlease select:\n\nA — Customer / Trip Discounts\nB — Driver Opportunity\nC — Business Registration\nD — Bizmapia Business Opportunities\n\nReply A, B, C or D`);
    return res.sendStatus(200);
  }

  // A - CUSTOMER - Poster 3XsWd3p + Customer App Link
  if (s.stage === "MENU" && up === "A") {
    s.stage = "CUS";
    await sendImg(from, ASSETS.posters.customer, "📍 Find Businesses Near You - Customer App");
    await sendText(from, `👋 *Bizmapia Customer App*\n\n📲 *Download Customer App:*\n${ASSETS.apps.customer}\n\n✅ Find:\n- Online Taxi 🚖\n- Online Delivery 🛵\n- Best Businesses Near You\n\nReply: ACTIVATE - To Activate Trip Discounts`);
    return res.sendStatus(200);
  }

  // B - DRIVER - Poster 2153CSjp + Driver App Link
  if (s.stage === "MENU" && up === "B") {
    s.stage = "DRV1";
    await sendImg(from, ASSETS.posters.driver, "🚖 Join as Driver - Earn Daily 💰\nDaily Payout Available");
    await sendText(from, `🚖 *Bizmapia Driver Opportunity!*\n\n📲 *Download Driver App:*\n${ASSETS.apps.driver}\n\n💰 Benefits:\n- Auto Rs.33 for 24hr unlimited trips\n- Car Rs.49 Only\n- Incentive: 100KM = Rs.100-250/-\n- Joining Fee: Rs.150/-\n\nReply: LIST`);
    return res.sendStatus(200);
  }

  if (s.stage === "DRV1" && up.includes("LIST")) {
    s.stage = "DRV2";
    await sendText(from, `🚗 *How to List Vehicle*\nLogin → Add Driver & Vehicle → Approval → TEST RUN → Ready for Trips!\n\nReply: BENEFIT`);
    return res.sendStatus(200);
  }

  if (s.stage === "DRV2" && up.includes("BENEFIT")) {
    s.stage = "DRV3";
    await sendImg(from, ASSETS.posters.freeRecharge, "🎁 FREE Recharge Benefit!\nList Vehicle & Get FREE Recharge\nAuto Rs.33 / Car Rs.49\nAvailable All Towns INDIA 🇮🇳 & Kerala");
    await sendText(from, `🎉 *FREE Recharge Benefit!*\n\n📲 Driver App:\n${ASSETS.apps.driver}\n\nList your vehicle and get FREE recharge benefit!\n\nReply: CLAIM`);
    return res.sendStatus(200);
  }

  // C - BUSINESS - Poster 3yjrdVxk
  if (s.stage === "MENU" && up === "C") {
    s.stage = "BUS";
    await sendImg(from, ASSETS.posters.business, "🏪 Register Your Business - All India Available");
    await sendText(from, `🏪 *Business Registration*\n\nList your business on Bizmapia\n\nReply: LIST - How to List Business`);
    return res.sendStatus(200);
  }

  // D - BUSINESS OPP - Poster gbPYBbMt
  if (s.stage === "MENU" && up === "D") {
    s.stage = "OPP";
    await sendImg(from, ASSETS.posters.opportunity, "🚀 Bizmapia Business Opportunities\n4 Opportunities Under One Brand");
    await sendText(from, `🚀 *Business Opportunities*\n\n1️⃣ District Franchisee\n2️⃣ Corporation Franchisee\n3️⃣ Municipality Franchisee\n4️⃣ Business Center - Taxi\n5️⃣ Business Center - Directory\n\nReply 1-5`);
    return res.sendStatus(200);
  }

  if (s.stage === "OPP" && ["1","2","3","4","5"].includes(up)) {
    s.stage = "OPP2";
    await sendText(from, `🎥 Demo for Opportunity ${up}\n\nReply:\nA — I'm Interested\nB — Call Me\nC — Book Call Back\nD — Other Opportunities`);
    return res.sendStatus(200);
  }

  // Data collection
  if (txt.includes("Name:") || txt.includes("Business Name:")) {
    await sendText(from, `✅ Thank you! Details recorded. Our team will contact you. Keep WhatsApp available 🙏`);
    s.stage = "DONE";
    return res.sendStatus(200);
  }

  if (s.stage === "BUS" && up.includes("LIST")) {
    s.stage = "DATA";
    await sendText(from, `Send:\nBusiness Name:\nOwner Name:\nMobile:\nCategory:\nLocation:\nDistrict:`);
    return res.sendStatus(200);
  }

  if (s.stage === "CUS" && up.includes("ACTIVATE")) {
    await sendText(from, `🎁 Send:\nName:\nMobile:\nLocation:`);
    return res.sendStatus(200);
  }

  if (s.stage === "DRV3" && up.includes("CLAIM")) {
    s.stage = "DATA";
    await sendText(from, `Send:\nName:\nMobile:\nVehicle Type:\nVehicle Number:\nLocation:`);
    return res.sendStatus(200);
  }

  await sendText(from, `Please choose:\nA — Customer\nB — Driver\nC — Business\nD — Opportunities\nOr type HELP for team`);
  res.sendStatus(200);
});

app.get('/', (req, res) => res.send('Bizmapia Bot - 6 Posters Final ✅'));
app.listen(PORT, () => console.log(`Running ${PORT}`));
