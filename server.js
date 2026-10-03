const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "bizmapia_verify_2024";
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;

console.log("Bot Starting - Token:",!!TOKEN,"PhoneID:",!!PHONE_NUMBER_ID);

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
  },
  videos: {
    opp_1: "https://youtu.be/YOUR_DISTRICT_VIDEO_LINK", // <-- PASTE YOUR LINKS HERE
    opp_2: "https://youtu.be/YOUR_CORPORATION_VIDEO",
    opp_3: "https://youtu.be/YOUR_MUNICIPALITY_VIDEO",
    opp_4: "https://youtu.be/YOUR_TAXI_CENTER_VIDEO",
    opp_5: "https://youtu.be/YOUR_DIRECTORY_VIDEO"
  }
};

const sessions = {};
function getSession(p) { if (!sessions[p]) sessions[p] = { lang: "EN", stage: "NEW", lastOpp: "" }; return sessions[p]; }

async function sendText(to, body) {
  if (!TOKEN ||!PHONE_NUMBER_ID) return;
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"text", text:{ body } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); }
  catch (e) { console.log("Text err:", e.response?.data || e.message); }
}
async function sendImage(to, link, caption) {
  if (!TOKEN ||!PHONE_NUMBER_ID) return;
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"image", image:{ link, caption } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); }
  catch (e) { console.log("Image err, fallback text"); await sendText(to, caption); }
}
async function sendButtons(to, body, buttons) {
  if (!TOKEN ||!PHONE_NUMBER_ID) return;
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text: body }, action:{ buttons: buttons.map(b=>({ type:"reply", reply:{ id:b.id, title:b.title.substring(0,20) } })) } } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); }
  catch (e) { console.log("Btn err:", e.response?.data || e.message); await sendText(to, body + "\nOptions: " + buttons.map(b=>b.title).join(" | ")); }
}
async function sendList(to, body, buttonText, sections) {
  if (!TOKEN ||!PHONE_NUMBER_ID) return;
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"list", body:{ text: body }, action:{ button: buttonText, sections } } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); }
  catch (e) { console.log("List err:", e.response?.data || e.message); await sendText(to, body); }
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
    const rawText = msg.text?.body || "";
    const s = getSession(from);
    console.log("From:", from, "Input:", input, "Lang:", s.lang);

    // IF USER IS SENDING DATA AFTER INTERESTED
    if (s.stage === "DATA" &&!input.startsWith("opp_") &&!["menu","back_to_opp","opp_interested"].includes(input)) {
      console.log("LEAD CAPTURED:", from, rawText, "For:", s.lastOpp);
      await sendText(from, s.lang==="ML"?"✅ വിവരങ്ങൾ ലഭിച്ചു! ഞങ്ങളുടെ ടീം ഉടൻ ബന്ധപ്പെടും 🙏":s.lang==="HI"?"✅ जानकारी मिली! हमारी टीम जल्द संपर्क करेगी 🙏":"✅ Details Received! Our team will contact you soon 🙏\nThank you for interest in " + s.lastOpp);
      s.stage = "MENU";
      await sendButtons(from, s.lang==="ML"?"വേറെ എന്തെങ്കിലും അറിയണോ?":s.lang==="HI"?"क्या आप कुछ और जानना चाहते हैं?":"Want to explore more?", [
        { id: "back_to_opp", title: s.lang==="ML"?"മറ്റ് അവസരങ്ങൾ":"Other Options" },
        { id: "menu", title: "Main Menu" }
      ]);
      return res.sendStatus(200);
    }

    // 1. START
    if (s.stage === "NEW" || ["HI","HELLO","HEY","HLO","START"].includes(input)) {
      s.stage = "LANG";
      await sendImage(from, ASSETS.posters.welcome, "👋 Welcome to Bizmapia! Your Success, Our Platform 🙏");
      await sendButtons(from, "Please select your language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക", [
        { id: "lang_en", title: "English" }, { id: "lang_hi", title: "Hindi" }, { id: "lang_ml", title: "Malayalam" }
      ]);
      return res.sendStatus(200);
    }

    // 2. LANG
    if (s.stage === "LANG" || input.startsWith("lang_")) {
      if (input.includes("lang_en") || input==="A") s.lang="EN";
      else if (input.includes("lang_hi") || input==="B") s.lang="HI";
      else if (input.includes("lang_ml") || input==="C") s.lang="ML";
      s.stage = "MENU";
      const menuText = s.lang==="ML"?"നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?":s.lang==="HI"?"आप क्या जानना चाहते हैं?":"What would you like to know?";
      const custDesc = s.lang==="ML"?"ക്യാബ് അല്ലെങ്കിൽ ബിസിനസ്":s.lang==="HI"?"कैब या बिजनेस खोजें":"Find a cab or business";
      const driverDesc = s.lang==="ML"?"ചേരൂ & സമ്പാദിക്കൂ":s.lang==="HI"?"जुड़ें और कमाएं":"Join & earn";
      const busDesc = s.lang==="ML"?"ഷോപ്പ് രജിസ്റ്റർ ചെയ്യുക":s.lang==="HI"?"दुकान रजिस्टर करें":"Register shop";
      await sendList(from, menuText, "Main Menu", [{ title:"Menu", rows:[
        { id:"customer", title:s.lang==="ML"?"കസ്റ്റമർ":s.lang==="HI"?"कस्टमर":"Customer", description:custDesc },
        { id:"driver", title:s.lang==="ML"?"ഡ്രൈവർ":s.lang==="HI"?"ड्राइवर":"Driver", description:driverDesc },
        { id:"business", title:s.lang==="ML"?"ബിസിനസ്":s.lang==="HI"?"बिजनेस":"Business", description:busDesc },
        { id:"opportunity", title:s.lang==="ML"?"അവസരങ്ങൾ":s.lang==="HI"?"अवसर":"Opportunities", description:"Franchise" }
      ]}]);
      return res.sendStatus(200);
    }

    // 3. MAIN MENU - WITH YOUR NEW DESCRIPTION
    if (["customer","driver","business","opportunity","menu"].includes(input)) {
      const custDesc = s.lang==="ML"?"ക്യാബ് അല്ലെങ്കിൽ ബിസിനസ്":s.lang==="HI"?"कैब या बिजनेस खोजें":"Find a cab or business";
      const driverDesc = s.lang==="ML"?"ചേരൂ & സമ്പാദിക്കൂ":s.lang==="HI"?"जुड़ें और कमाएं":"Join & earn";
      const busDesc = s.lang==="ML"?"ഷോപ്പ് രജിസ്റ്റർ ചെയ്യുക":s.lang==="HI"?"दुकान रजिस्टर करें":"Register shop";
      if (input==="customer") {
        await sendImage(from, ASSETS.posters.customer, "Customer - Find a cab or business");
        await sendButtons(from, `Download: ${ASSETS.apps.customer}`, [{id:"activate",title:"Claim"},{id:"menu",title:"Main Menu"}]);
      } else if (input==="driver") {
        await sendImage(from, ASSETS.posters.driver, "Driver");
        await sendButtons(from, `Auto Rs.33 Car Rs.49 - ${ASSETS.apps.driver}`, [{id:"driver_benefit",title:"Free Recharge"},{id:"menu",title:"Main Menu"}]);
      } else if (input==="business") {
        await sendImage(from, ASSETS.posters.business, "Business Registration");
        await sendButtons(from, "Register your business", [{id:"business_list",title:"How to List"},{id:"menu",title:"Main Menu"}]);
      } else if (input==="opportunity") {
        await sendImage(from, ASSETS.posters.opportunity, "4 Opportunities Under One Brand");
        await sendList(from, s.lang==="ML"?"അവസരം തിരഞ്ഞെടുക്കുക":s.lang==="HI"?"अवसर चुनें":"Select Opportunity", "Select", [{title:"Opp", rows:[
          {id:"opp_1",title:"District Franchisee"},{id:"opp_2",title:"Corporation"},{id:"opp_3",title:"Municipality"},{id:"opp_4",title:"Taxi Center"},{id:"opp_5",title:"Directory"}
        ]}]);
      } else if (input==="menu") {
        const menuText = s.lang==="ML"?"നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?":s.lang==="HI"?"आप क्या जानना चाहते हैं?":"What would you like to know?";
        await sendList(from, menuText, "Main Menu", [{title:"Menu", rows:[
          { id:"customer", title:s.lang==="ML"?"കസ്റ്റമർ":s.lang==="HI"?"कस्टमर":"Customer", description:custDesc },
          { id:"driver", title:s.lang==="ML"?"ഡ്രൈവർ":s.lang==="HI"?"ड्राइवर":"Driver", description:driverDesc },
          { id:"business", title:s.lang==="ML"?"ബിസിനസ്":s.lang==="HI"?"बिजनेस":"Business", description:busDesc },
          { id:"opportunity", title:s.lang==="ML"?"അവസരങ്ങൾ":s.lang==="HI"?"अवसर":"Opportunities", description:"Franchise" }
        ]}]);
      }
      return res.sendStatus(200);
    }

    // 4. FRANCHISEE VIDEO + CONFIRMATION - THIS WAS MISSING BEFORE - NOW FIXED
    const OPP_DETAILS = {
      opp_1: { EN: "💼 *District Franchisee*\nFull District Rights\nHigh Income\nInvestment: Contact us", HI: "💼 *जिला फ्रेंचाइजी*", ML: "💼 *ജില്ലാ ഫ്രാഞ്ചൈസി*" },
      opp_2: { EN: "🏙️ *Corporation Franchisee*", HI: "🏙️ *निगम*", ML: "🏙️ *കോർപ്പറേഷൻ*" },
      opp_3: { EN: "🏘️ *Municipality Franchisee*", HI: "🏘️ *नगर पालिका*", ML: "🏘️ *മുനിസിപ്പാലിറ്റി*" },
      opp_4: { EN: "🚕 *Taxi Business Center*", HI: "🚕 *टैक्सी सेंटर*", ML: "🚕 *ടാക്സി സെന്റർ*" },
      opp_5: { EN: "📖 *Directory Business Center*", HI: "📖 *डायरेक्टरी*", ML: "📖 *ഡയറക്ടറി*" }
    };

    if (input.startsWith("opp_") && OPP_DETAILS[input]) {
      s.lastOpp = input;
      const detail = OPP_DETAILS[input][s.lang] || OPP_DETAILS[input]["EN"];
      const video = ASSETS.videos[input];
      await sendText(from, `${detail}\n\n🎥 *Watch Video:*\n${video}\n\n${s.lang==="ML"?"വീഡിയോ കണ്ടതിനു ശേഷം തുടരുക":s.lang==="HI"?"वीडियो देखने के बाद आगे बढ़ें":"Watch video then proceed"}`);
      await sendButtons(from, s.lang==="ML"?"നിങ്ങൾക്ക് തുടരാൻ താൽപ്പര്യമുണ്ടോ?":s.lang==="HI"?"क्या आप आगे बढ़ना चाहते हैं?":"Do you want to proceed further?", [
        { id: "opp_interested", title: s.lang==="ML"?"മുന്നോട്ട്":s.lang==="HI"?"आगे बढ़ें":"Proceed" },
        { id: "back_to_opp", title: s.lang==="ML"?"മറ്റ് അവസരങ്ങൾ":s.lang==="HI"?"अन्य अवसर":"Other Options" },
        { id: "menu", title: "Main Menu" }
      ]);
      return res.sendStatus(200);
    }

    if (input==="back_to_opp") {
      await sendList(from, s.lang==="ML"?"മറ്റ് അവസരങ്ങൾ":s.lang==="HI"?"अन्य अवसर चुनें":"Select Another Opportunity", "Select", [{title:"Opp", rows:[
        {id:"opp_1",title:"District Franchisee"},{id:"opp_2",title:"Corporation"},{id:"opp_3",title:"Municipality"},{id:"opp_4",title:"Taxi Center"},{id:"opp_5",title:"Directory"}
      ]}]);
      return res.sendStatus(200);
    }

    if (input==="opp_interested") {
      await sendText(from, s.lang==="ML"?"ദയവായി വിവരങ്ങൾ അയയ്ക്കുക:\nName:\nMobile:\nLocation:\nInvestment:":s.lang==="HI"?"कृपया विवरण भेजें:\nName:\nMobile:\nLocation:":`Please send details:\nName:\nMobile:\nLocation:\nFranchisee: ${s.lastOpp}\n\nOur team will call you`);
      s.stage="DATA";
      return res.sendStatus(200);
    }

    if (input==="driver_benefit") {
      await sendImage(from, ASSETS.posters.freeRecharge, "FREE Recharge!");
      await sendButtons(from, `Get FREE recharge - ${ASSETS.apps.driver}`, [{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }

    await sendText(from, "Type Hi to restart 🙏");
    res.sendStatus(200);
  } catch (err) {
    console.log("Prevented Crash:", err.message);
    res.sendStatus(200);
  }
});

app.get('/', (req, res) => res.send('Bizmapia - Video + Confirmation ✅'));
app.listen(PORT, () => console.log(`Running ${PORT}`));
process.on('unhandledRejection', r => console.log("Rej:", r));
process.on('uncaughtException', e => console.log("Exc:", e.message));
