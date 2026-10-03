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
  if (!TOKEN ||!PHONE_NUMBER_ID) return;
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp", to, type: "text", text: { body }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) { console.log("sendText error:", e.response?.data || e.message); }
}
async function sendImage(to, link, caption) {
  if (!TOKEN ||!PHONE_NUMBER_ID) return;
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp", to, type: "image", image: { link, caption }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) {
    console.log("sendImage error, sending text");
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
  } catch (e) { console.log("sendButtons error:", e.response?.data || e.message); await sendText(to, body); }
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
    console.log("Incoming:", from, input, "Lang:", s.lang);

    // 1. HI + WELCOME POSTER FbptYg3F
    if (s.stage === "NEW" || ["HI","HELLO","HEY","HLO","START"].includes(input)) {
      s.stage = "LANG";
      await sendImage(from, ASSETS.posters.welcome, "👋 Welcome to Bizmapia! Your Success, Our Platform 🙏\n50+ Franchisees in Kerala");
      await sendButtons(from, "Please select your language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക", [
        { id: "lang_en", title: "English" }, { id: "lang_hi", title: "Hindi" }, { id: "lang_ml", title: "Malayalam" }
      ]);
      return res.sendStatus(200);
    }

    // 2. LANGUAGE SELECTION - MALAYALAM BUG FIXED
    if (s.stage === "LANG" || input.startsWith("lang_")) {
      if (input === "lang_en" || input === "A") s.lang = "EN";
      else if (input === "lang_hi" || input === "B") s.lang = "HI";
      else if (input === "lang_ml" || input === "C") s.lang = "ML";
      s.stage = "MENU";
      const menuText = s.lang === "ML"? "നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?": s.lang === "HI"? "आप क्या जानना चाहते हैं?": "What would you like to know?";
      const custDesc = s.lang === "ML"? "ക്യാബ് അല്ലെങ്കിൽ ബിസിനസ്": s.lang === "HI"? "कैब या बिजनेस खोजें": "Find a cab or business";
      const driverDesc = s.lang === "ML"? "ചേരൂ & സമ്പാദിക്കൂ": s.lang === "HI"? "जुड़ें और कमाएं": "Join & earn";
      const busDesc = s.lang === "ML"? "ഷോപ്പ് രജിസ്റ്റർ ചെയ്യുക": s.lang === "HI"? "दुकान रजिस्टर करें": "Register shop";

      await sendList(from, menuText, "Main Menu", [{ title: "Menu", rows: [
        { id: "customer", title: s.lang==="ML"?"കസ്റ്റമർ":s.lang==="HI"?"कस्टमर":"Customer", description: custDesc },
        { id: "driver", title: s.lang==="ML"?"ഡ്രൈവർ":s.lang==="HI"?"ड्राइवर":"Driver", description: driverDesc },
        { id: "business", title: s.lang==="ML"?"ബിസിനസ്":s.lang==="HI"?"बिजनेस":"Business", description: busDesc },
        { id: "opportunity", title: s.lang==="ML"?"അവസരങ്ങൾ":s.lang==="HI"?"अवसर":"Opportunities", description: "Franchise" }
      ]}]);
      return res.sendStatus(200);
    }

    // 3. MENU - UPDATED DESCRIPTIONS MAINTAINED
    if (["customer","driver","business","opportunity","menu"].includes(input)) {
      const custDesc = s.lang === "ML"? "ക്യാബ് അല്ലെങ്കിൽ ബിസിനസ്": s.lang === "HI"? "कैब या बिजनेस खोजें": "Find a cab or business";
      const driverDesc = s.lang === "ML"? "ചേരൂ & സമ്പാദിക്കൂ": s.lang === "HI"? "जुड़ें और कमाएं": "Join & earn";
      const busDesc = s.lang === "ML"? "ഷോപ്പ് രജിസ്റ്റർ ചെയ്യുക": s.lang === "HI"? "दुकान रजिस्टर करें": "Register shop";

      if (input === "customer") {
        await sendImage(from, ASSETS.posters.customer, s.lang==="ML"?"കസ്റ്റമർ ആപ്പ്":s.lang==="HI"?"कस्टमर ऐप":"Customer App - Find a cab or business");
        await sendButtons(from, `📲 Download: ${ASSETS.apps.customer}\n✅ Taxi 🚖\n✅ Delivery 🛵\n✅ Business Offers`, [{id:"activate",title: s.lang==="ML"?"ക്ലെയിം ചെയ്യുക":s.lang==="HI"?"क्लेम करें":"Claim Now"},{id:"menu",title:"Main Menu"}]);
      } else if (input === "driver") {
        await sendImage(from, ASSETS.posters.driver, "Driver Opportunity");
        await sendButtons(from, `Earn Daily!\nAuto Rs.33 Car Rs.49\n${ASSETS.apps.driver}`, [{id:"driver_benefit",title:"Free Recharge"},{id:"menu",title:"Main Menu"}]);
      } else if (input === "business") {
        await sendImage(from, ASSETS.posters.business, "Business Registration - All India");
        await sendButtons(from, "Register your business & get more customers", [{id:"business_list",title:"How to List"},{id:"menu",title:"Main Menu"}]);
      } else if (input === "opportunity") {
        await sendImage(from, ASSETS.posters.opportunity, "4 Opportunities Under One Brand");
        await sendList(from, "Select Opportunity", "Select", [{title:"Opp", rows:[
          {id:"opp_1",title:"District Franchisee"},{id:"opp_2",title:"Corporation"},{id:"opp_3",title:"Municipality"},{id:"opp_4",title:"Taxi Center"},{id:"opp_5",title:"Directory"}
        ]}]);
      } else if (input === "menu") {
        const menuText = s.lang === "ML"? "നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?": s.lang === "HI"? "आप क्या जानना चाहते हैं?": "What would you like to know?";
        await sendList(from, menuText, "Main Menu", [{title:"Menu", rows:[
          { id: "customer", title: s.lang==="ML"?"കസ്റ്റമർ":s.lang==="HI"?"कस्टमर":"Customer", description: custDesc },
          { id: "driver", title: s.lang==="ML"?"ഡ്രൈവർ":s.lang==="HI"?"ड्राइवर":"Driver", description: driverDesc },
          { id: "business", title: s.lang==="ML"?"ബിസിനസ്":s.lang==="HI"?"बिजनेस":"Business", description: busDesc },
          { id: "opportunity", title: s.lang==="ML"?"അവസരങ്ങൾ":s.lang==="HI"?"अवसर":"Opportunities", description: "Franchise" }
        ]}]);
      }
      return res.sendStatus(200);
    }

    if (input === "driver_benefit") {
      await sendImage(from, ASSETS.posters.freeRecharge, "FREE Recharge Benefit! LXVpRKQp");
      await sendButtons(from, `List vehicle & get FREE recharge\n${ASSETS.apps.driver}`, [{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }

    await sendText(from, "Type Hi to restart menu 🙏");
    res.sendStatus(200);
  } catch (err) {
    console.log("Crash prevented:", err.message);
    res.sendStatus(200);
  }
});

app.get('/', (req, res) => res.send('Bizmapia Bot - Find a cab or business ✅'));
app.listen(PORT, () => console.log(`Running ${PORT}`));
process.on('unhandledRejection', (r) => console.log(r));
process.on('uncaughtException', (e) => console.log(e.message));
