const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "bizmapia_verify_2024";
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;

console.log("Token exists:",!!TOKEN, "Phone ID exists:",!!PHONE_NUMBER_ID);

const ASSETS = {
  posters: {
    welcome: "https://ibb.co/FbptYg3F",
    customer: "https://ibb.co/3XsWd3p",
    driver: "https://ibb.co/2153CSjp",
    business: "https://ibb.co/3yjrdVxk",
    opportunity: "https://ibb.co/gbPYBbMt",
    freeRecharge: "https://ibb.co/LXVpRKQp"
  },
  apps: {
    customer: "https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia",
    driver: "https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia_driver"
  }
};

const sessions = {};
function getSession(p) { if (!sessions[p]) sessions[p] = { lang: "EN", stage: "NEW" }; return sessions[p]; }

async function sendText(to, body) {
  if (!TOKEN ||!PHONE_NUMBER_ID) { console.log("Missing Token/Phone ID, skip send"); return; }
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp", to, type: "text", text: { body }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) { console.log("sendText error:", e.response?.data || e.message); }
}
async function sendImage(to, link, caption) {
  if (!TOKEN ||!PHONE_NUMBER_ID) { console.log("Missing Token/Phone ID, skip send"); return; }
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp", to, type: "image", image: { link, caption }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) {
    console.log("sendImage error, sending text instead:", e.response?.data?.error?.message || e.message);
    await sendText(to, caption);
  }
}
async function sendButtons(to, body, buttons) {
  if (!TOKEN ||!PHONE_NUMBER_ID) return;
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp", to, type: "interactive",
      interactive: { type: "button", body: { text: body }, action: { buttons: buttons.map(b => ({ type: "reply", reply: { id: b.id, title: b.title.substring(0,20) } })) } }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) { console.log("sendButtons error:", e.response?.data || e.message); await sendText(to, body + "\n\nOptions: " + buttons.map(b=>b.title).join(", ")); }
}
async function sendList(to, body, buttonText, sections) {
  if (!TOKEN ||!PHONE_NUMBER_ID) return;
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp", to, type: "interactive",
      interactive: { type: "list", body: { text: body }, action: { button: buttonText, sections } }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) { console.log("sendList error:", e.response?.data || e.message); await sendText(to, body); }
}

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) res.send(req.query['hub.challenge']);
  else res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);
    const from = msg.from;
    let input = msg.type === "interactive"? (msg.interactive.button_reply?.id || msg.interactive.list_reply?.id || "") : (msg.text?.body?.trim().toUpperCase() || "");
    const s = getSession(from);
    console.log("Incoming:", from, input, "Stage:", s.stage, "Lang:", s.lang);

    if (s.stage === "NEW" || ["HI","HELLO","HEY","HLO"].includes(input)) {
      s.stage = "LANG";
      await sendImage(from, ASSETS.posters.welcome, "👋 Welcome to Bizmapia! Your Success, Our Platform 🙏");
      await sendButtons(from, "Please select your language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക", [
        { id: "lang_en", title: "English" }, { id: "lang_hi", title: "Hindi" }, { id: "lang_ml", title: "Malayalam" }
      ]);
      return res.sendStatus(200);
    }

    if (s.stage === "LANG" || input.startsWith("lang_")) {
      if (input === "lang_en") s.lang = "EN"; else if (input === "lang_hi") s.lang = "HI"; else if (input === "lang_ml") s.lang = "ML";
      s.stage = "MENU";
      const menuText = s.lang === "ML"? "നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?" : s.lang === "HI"? "आप क्या जानना चाहते हैं?" : "What would you like to know?";
      await sendList(from, menuText, "Main Menu", [{ title: "Menu", rows: [
        { id: "customer", title: s.lang==="ML"?"കസ്റ്റമർ":s.lang==="HI"?"कस्टमर":"Customer", description: "Find businesses" },
        { id: "driver", title: s.lang==="ML"?"ഡ്രൈവർ":s.lang==="HI"?"ड्राइवर":"Driver", description: "Join & earn" },
        { id: "business", title: s.lang==="ML"?"ബിസിനസ്":s.lang==="HI"?"बिजनेस":"Business", description: "Register shop" },
        { id: "opportunity", title: s.lang==="ML"?"അവസരങ്ങൾ":s.lang==="HI"?"अवसर":"Opportunities", description: "Franchise" }
      ]}]);
      return res.sendStatus(200);
    }

    if (["customer","driver","business","opportunity","menu"].includes(input)) {
      if (input === "customer") {
        await sendImage(from, ASSETS.posters.customer, "Customer App");
        await sendButtons(from, `Download: ${ASSETS.apps.customer}`, [{id:"activate",title:"Claim"},{id:"menu",title:"Main Menu"}]);
      } else if (input === "driver") {
        await sendImage(from, ASSETS.posters.driver, "Driver App");
        await sendButtons(from, `Download: ${ASSETS.apps.driver}\nAuto Rs.33 Car Rs.49`, [{id:"driver_benefit",title:"Free Recharge"},{id:"menu",title:"Main Menu"}]);
      } else if (input === "business") {
        await sendImage(from, ASSETS.posters.business, "Business Reg - All India");
        await sendButtons(from, "Register your business", [{id:"business_list",title:"How to List"},{id:"menu",title:"Main Menu"}]);
      } else if (input === "opportunity") {
        await sendImage(from, ASSETS.posters.opportunity, "Business Opportunities");
        await sendList(from, "4 Opportunities Under One Brand", "Select", [{title:"Opp", rows:[
          {id:"opp_1",title:"District"},{id:"opp_2",title:"Corporation"},{id:"opp_3",title:"Municipality"},{id:"opp_4",title:"Taxi Center"},{id:"opp_5",title:"Directory"}
        ]}]);
      } else if (input === "menu") {
        s.stage = "MENU";
        await sendList(from, "Main Menu", "Menu", [{title:"Menu", rows:[
          {id:"customer",title:"Customer"},{id:"driver",title:"Driver"},{id:"business",title:"Business"},{id:"opportunity",title:"Opportunities"}
        ]}]);
      }
      return res.sendStatus(200);
    }

    if (input.includes("BENEFIT") || input === "driver_benefit") {
      await sendImage(from, ASSETS.posters.freeRecharge, "FREE Recharge Benefit!");
      await sendButtons(from, `List vehicle & get FREE recharge\n${ASSETS.apps.driver}`, [{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }

    await sendText(from, "Please select from menu. Type Hi to restart.");
    res.sendStatus(200);
  } catch (err) {
    console.log("Webhook crash prevented:", err.message);
    res.sendStatus(200);
  }
});

app.get('/', (req, res) => res.send('Bizmapia Bot Stable - Crash Proof ✅'));
app.listen(PORT, () => console.log(`Running ${PORT}`));

process.on('unhandledRejection', (r) => console.log("Unhandled Rejection:", r));
process.on('uncaughtException', (e) => console.log("Uncaught Exception:", e.message));
