const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "bizmapia_verify_2024";
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;

// ===== FINAL 6 POSTERS + APPS - REPLACE ibb.co WITH i.ibb.co DIRECT LINK =====
const ASSETS = {
  posters: {
    welcome: "https://i.ibb.co/FbptYg3F/welcome.jpg", // https://ibb.co/FbptYg3F
    customer: "https://i.ibb.co/3XsWd3p/customer.jpg", // https://ibb.co/3XsWd3p
    driver: "https://i.ibb.co/2153CSjp/driver.jpg", // https://ibb.co/2153CSjp
    business: "https://i.ibb.co/3yjrdVxk/business.jpg", // https://ibb.co/3yjrdVxk
    opportunity: "https://i.ibb.co/gbPYBbMt/opportunity.jpg", // https://ibb.co/gbPYBbMt
    freeRecharge: "https://i.ibb.co/LXVpRKQp/free.jpg" // https://ibb.co/LXVpRKQp
  },
  apps: {
    customer: "https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia",
    driver: "https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia_driver"
  }
};

// ===== 3 LANGUAGE TRANSLATIONS =====
const LANG = {
  EN: {
    welcome: "👋 *Welcome to Bizmapia!*\nYour Success, Our Platform 🙏\n50+ Franchisees in Kerala",
    chooseLang: "Please select your language",
    langSelected: "Thank you! English selected 🇬🇧",
    menuTitle: "What would you like to know?",
    menu: "Select an option from below 👇",
    btn_customer: "🛍️ Customer",
    btn_driver: "🚕 Driver",
    btn_business: "🏪 Business",
    btn_opp: "🚀 Opportunities",
    customer_title: "🛍️ Bizmapia Customer App",
    customer_desc: `📍 Find Best Businesses Near You\n\n📲 *Download Customer App:*\n${ASSETS.apps.customer}\n\n✅ Online Taxi 🚖\n✅ Online Delivery 🛵\n✅ Business Search & Offers`,
    driver_title: "🚕 Driver Opportunity",
    driver_desc: `💰 Earn Daily - Daily Payout!\n\n📲 *Driver App:*\n${ASSETS.apps.driver}\n\n- Auto Rs.33 for 24hr unlimited\n- Car Rs.49 Only\n- 100KM Incentive Rs.100-250/-\n- Joining Rs.150/-`,
    business_title: "🏪 Business Registration",
    business_desc: "Register your business on Bizmapia - All India Available. Get more customers!",
    opp_title: "🚀 Business Opportunities",
    opp_desc: "4 Opportunities Under One Brand - Daily + Monthly Income",
    btn_list: "📋 How to List",
    btn_benefit: "🎁 Free Recharge Benefit",
    btn_claim: "✅ Claim Now",
    btn_interested: "✅ I'm Interested",
    btn_call: "📞 Call Me",
    btn_callback: "📅 Book Callback",
    btn_more: "🔄 More Info",
    ask_data: "Please send your details:",
    thank_data: "✅ Thank you! Details recorded. Our team will contact you soon. Keep WhatsApp available 🙏"
  },
  HI: {
    welcome: "👋 *Bizmapia में आपका स्वागत है!*\nआपकी सफलता, हमारा प्लेटफॉर्म 🙏\nकेरल में 50+ फ्रेंचाइजी",
    chooseLang: "कृपया अपनी भाषा चुनें",
    langSelected: "धन्यवाद! हिंदी चुनी गई 🇮🇳",
    menuTitle: "आप क्या जानना चाहते हैं?",
    menu: "नीचे से एक विकल्प चुनें 👇",
    btn_customer: "🛍️ कस्टमर",
    btn_driver: "🚕 ड्राइवर",
    btn_business: "🏪 बिजनेस",
    btn_opp: "🚀 अवसर",
    customer_title: "🛍️ Bizmapia कस्टमर ऐप",
    customer_desc: `📍 अपने पास के सर्वश्रेष्ठ बिजनेस खोजें\n\n📲 *कस्टमर ऐप डाउनलोड करें:*\n${ASSETS.apps.customer}`,
    driver_title: "🚕 ड्राइवर अवसर",
    driver_desc: `💰 रोज कमाएं - डेली पेमेंट!\n\n📲 *ड्राइवर ऐप:*\n${ASSETS.apps.driver}\n\n- ऑटो Rs.33 में 24 घंटे अनलिमिटेड\n- कार Rs.49 मात्र\n- 100KM पर Rs.100-250/- इंसेंटिव`,
    business_title: "🏪 बिजनेस रजिस्ट्रेशन",
    business_desc: "अपने बिजनेस को Bizmapia पर रजिस्टर करें - पूरे भारत में उपलब्ध",
    opp_title: "🚀 बिजनेस अवसर",
    opp_desc: "एक ब्रांड के तहत 4 अवसर - दैनिक + मासिक आय",
    btn_list: "📋 कैसे लिस्ट करें",
    btn_benefit: "🎁 फ्री रिचार्ज लाभ",
    btn_claim: "✅ अभी क्लेम करें",
    btn_interested: "✅ मुझे रुचि है",
    btn_call: "📞 मुझे कॉल करें",
    btn_callback: "📅 कॉल बैक बुक करें",
    btn_more: "🔄 अधिक जानकारी",
    ask_data: "कृपया अपना विवरण भेजें:",
    thank_data: "✅ धन्यवाद! विवरण दर्ज किया गया। हमारी टीम जल्द ही संपर्क करेगी।"
  },
  ML: {
    welcome: "👋 *ബിസ്മാപ്പിയയിലേക്ക് സ്വാഗതം!*\nനിങ്ങളുടെ വിജയം, ഞങ്ങളുടെ പ്ലാറ്റ്ഫോം 🙏\nകേരളത്തിൽ 50+ ഫ്രാഞ്ചൈസികൾ",
    chooseLang: "ദയവായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    langSelected: "നന്ദി! മലയാളം തിരഞ്ഞെടുത്തു 🇮🇳",
    menuTitle: "നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?",
    menu: "താഴെ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക 👇",
    btn_customer: "🛍️ കസ്റ്റമർ",
    btn_driver: "🚕 ഡ്രൈവർ",
    btn_business: "🏪 ബിസിനസ്",
    btn_opp: "🚀 അവസരങ്ങൾ",
    customer_title: "🛍️ ബിസ്മാപ്പിയ കസ്റ്റമർ ആപ്പ്",
    customer_desc: `📍 നിങ്ങൾക്ക് സമീപമുള്ള മികച്ച ബിസിനസുകൾ കണ്ടെത്തുക\n\n📲 *കസ്റ്റമർ ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക:*\n${ASSETS.apps.customer}`,
    driver_title: "🚕 ഡ്രൈവർ അവസരം",
    driver_desc: `💰 ദിവസവും സമ്പാദിക്കൂ - ദിവസേന പേഔട്ട്!\n\n📲 *ഡ്രൈവർ ആപ്പ്:*\n${ASSETS.apps.driver}\n\n- ഓട്ടോ Rs.33 ന് 24 മണിക്കൂർ അൺലിമിറ്റഡ്\n- കാർ Rs.49 മാത്രം\n- 100KM ന് Rs.100-250/- ഇൻസെന്റീവ്`,
    business_title: "🏪 ബിസിനസ് രജിസ്ട്രേഷൻ",
    business_desc: "നിങ്ങളുടെ ബിസിനസ് ബിസ്മാപ്പിയയിൽ രജിസ്റ്റർ ചെയ്യുക - എല്ലാ ഇന്ത്യയിലും ലഭ്യമാണ്",
    opp_title: "🚀 ബിസിനസ് അവസരങ്ങൾ",
    opp_desc: "ഒരു ബ്രാൻഡിന് കീഴിൽ 4 അവസരങ്ങൾ - ദിവസേന + പ്രതിമാസ വരുമാനം",
    btn_list: "📋 എങ്ങനെ ലിസ്റ്റ് ചെയ്യാം",
    btn_benefit: "🎁 ഫ്രീ റീചാർജ് ആനുകൂല്യം",
    btn_claim: "✅ ഇപ്പോൾ ക്ലെയിം ചെയ്യുക",
    btn_interested: "✅ എനിക്ക് താൽപ്പര്യമുണ്ട്",
    btn_call: "📞 എന്നെ വിളിക്കൂ",
    btn_callback: "📅 കോൾ ബാക്ക് ബുക്ക് ചെയ്യുക",
    btn_more: "🔄 കൂടുതൽ വിവരങ്ങൾ",
    ask_data: "ദയവായി നിങ്ങളുടെ വിവരങ്ങൾ അയയ്ക്കുക:",
    thank_data: "✅ നന്ദി! വിവരങ്ങൾ രേഖപ്പെടുത്തി. ഞങ്ങളുടെ ടീം ഉടൻ ബന്ധപ്പെടും."
  }
};

const sessions = {};
function getSession(p) { if (!sessions[p]) sessions[p] = { lang: "EN", stage: "NEW" }; return sessions[p]; }
function t(session, key) { return LANG[session.lang || "EN"][key] || LANG["EN"][key]; }

async function sendText(to, body) {
  await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp", to, type: "text", text: { body }
  }, { headers: { Authorization: `Bearer ${TOKEN}` } });
}
async function sendImage(to, link, caption) {
  try {
    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp", to, type: "image", image: { link, caption }
    }, { headers: { Authorization: `Bearer ${TOKEN}` } });
  } catch (e) { await sendText(to, caption); }
}
async function sendButtons(to, body, buttons) {
  // buttons = [{id, title}]
  await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp", to, type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: { buttons: buttons.map(b => ({ type: "reply", reply: { id: b.id, title: b.title } })) }
    }
  }, { headers: { Authorization: `Bearer ${TOKEN}` } });
}
async function sendList(to, body, buttonText, sections) {
  await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
    messaging_product: "whatsapp", to, type: "interactive",
    interactive: {
      type: "list",
      body: { text: body },
      action: { button: buttonText, sections }
    }
  }, { headers: { Authorization: `Bearer ${TOKEN}` } });
}

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) res.send(req.query['hub.challenge']);
  else res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg) return res.sendStatus(200);
  const from = msg.from;

  // Get button or text input
  let input = "";
  if (msg.type === "interactive") {
    input = msg.interactive.button_reply?.id || msg.interactive.list_reply?.id || "";
  } else {
    input = msg.text?.body?.trim().toUpperCase() || "";
  }

  const session = getSession(from);

  // 1. HI -> WELCOME POSTER FbptYg3F + LANGUAGE BUTTONS
  if (session.stage === "NEW" || ["HI","HELLO","HEY","HLO","START"].includes(input)) {
    session.stage = "LANG";
    await sendImage(from, ASSETS.posters.welcome, LANG.EN.welcome);
    await sendButtons(from, LANG.EN.chooseLang, [
      { id: "lang_en", title: "🇬🇧 English" },
      { id: "lang_hi", title: "🇮🇳 Hindi" },
      { id: "lang_ml", title: "🇮🇳 Malayalam" }
    ]);
    return res.sendStatus(200);
  }

  // 2. LANGUAGE SELECTION - FIXED BUG FOR MALAYALAM
  if (session.stage === "LANG" || input.startsWith("lang_")) {
    if (input === "lang_en" || input === "A") session.lang = "EN";
    else if (input === "lang_hi" || input === "B") session.lang = "HI";
    else if (input === "lang_ml" || input === "C") session.lang = "ML";

    session.stage = "MENU";
    await sendText(from, t(session, "langSelected"));

    // Professional List Menu (4 options)
    await sendList(from, t(session, "menu"), t(session, "menuTitle"), [{
      title: "Main Menu",
      rows: [
        { id: "customer", title: t(session, "btn_customer"), description: "Find businesses & offers" },
        { id: "driver", title: t(session, "btn_driver"), description: "Join & earn daily" },
        { id: "business", title: t(session, "btn_business"), description: "Register your shop" },
        { id: "opportunity", title: t(session, "btn_opp"), description: "Franchise & Business Center" }
      ]
    }]);
    return res.sendStatus(200);
  }

  // 3. MENU HANDLING
  // CUSTOMER - Poster 3XsWd3p
  if (input === "customer" || input === "A") {
    await sendImage(from, ASSETS.posters.customer, t(session, "customer_title"));
    await sendButtons(from, t(session, "customer_desc"), [
      { id: "activate", title: t(session, "btn_claim") },
      { id: "menu", title: "🏠 Main Menu" }
    ]);
    return res.sendStatus(200);
  }

  // DRIVER - Poster 2153CSjp
  if (input === "driver" || input === "B") {
    session.stage = "DRIVER";
    await sendImage(from, ASSETS.posters.driver, t(session, "driver_title"));
    await sendButtons(from, t(session, "driver_desc"), [
      { id: "driver_list", title: t(session, "btn_list") },
      { id: "menu", title: "🏠 Main Menu" }
    ]);
    return res.sendStatus(200);
  }

  if (input === "driver_list") {
    await sendButtons(from, t(session, "btn_list") + "\nLogin → Add Vehicle → Approval → TEST RUN → Ready!", [
      { id: "driver_benefit", title: t(session, "btn_benefit") },
      { id: "menu", title: "🏠 Main Menu" }
    ]);
    return res.sendStatus(200);
  }

  if (input === "driver_benefit") {
    await sendImage(from, ASSETS.posters.freeRecharge, "🎁 FREE Recharge Benefit!"); // LXVpRKQp
    await sendButtons(from, `🎁 *FREE Recharge by Listing Vehicle!*\n\n${ASSETS.apps.driver}`, [
      { id: "driver_claim", title: t(session, "btn_claim") },
      { id: "menu", title: "🏠 Main Menu" }
    ]);
    return res.sendStatus(200);
  }

  // BUSINESS - Poster 3yjrdVxk
  if (input === "business" || input === "C") {
    session.stage = "BUSINESS";
    await sendImage(from, ASSETS.posters.business, t(session, "business_title"));
    await sendButtons(from, t(session, "business_desc"), [
      { id: "business_list", title: t(session, "btn_list") },
      { id: "menu", title: "🏠 Main Menu" }
    ]);
    return res.sendStatus(200);
  }

  // OPPORTUNITY - Poster gbPYBbMt
  if (input === "opportunity" || input === "D") {
    session.stage = "OPP";
    await sendImage(from, ASSETS.posters.opportunity, t(session, "opp_title"));
    await sendList(from, t(session, "opp_desc"), "Select Opportunity", [{
      title: "Opportunities",
      rows: [
        { id: "opp_1", title: "District Franchisee", description: "Full district rights" },
        { id: "opp_2", title: "Corporation Franchisee", description: "Corporation rights" },
        { id: "opp_3", title: "Municipality Franchisee", description: "Municipality rights" },
        { id: "opp_4", title: "Business Center - Taxi", description: "Taxi business" },
        { id: "opp_5", title: "Business Center - Directory", description: "Directory business" }
      ]
    }]);
    return res.sendStatus(200);
  }

  if (input.startsWith("opp_")) {
    await sendButtons(from, `You selected ${input}. Want to continue?`, [
      { id: "opp_interested", title: t(session, "btn_interested") },
      { id: "opp_call", title: t(session, "btn_call") },
      { id: "opp_callback", title: t(session, "btn_callback") }
    ]);
    return res.sendStatus(200);
  }

  if (input === "menu") {
    session.stage = "MENU";
    await sendList(from, t(session, "menu"), t(session, "menuTitle"), [{
      title: "Main Menu",
      rows: [
        { id: "customer", title: t(session, "btn_customer") },
        { id: "driver", title: t(session, "btn_driver") },
        { id: "business", title: t(session, "btn_business") },
        { id: "opportunity", title: t(session, "btn_opp") }
      ]
    }]);
    return res.sendStatus(200);
  }

  // DATA COLLECTION - Works in all languages
  if (["activate","driver_claim","business_list","opp_interested","opp_call","opp_callback"].includes(input)) {
    if (input === "opp_call") {
      await sendText(from, t(session, "thank_data"));
      return res.sendStatus(200);
    }
    await sendText(from, t(session, "ask_data") + "\n\nName:\nMobile:\nLocation:\nBusiness/Vehicle Details:");
    session.stage = "DATA";
    return res.sendStatus(200);
  }

  if (session.stage === "DATA" && msg.text?.body?.includes("Name:")) {
    await sendText(from, t(session, "thank_data"));
    session.stage = "DONE";
    return res.sendStatus(200);
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => res.send('Bizmapia Professional Bot - 3 Languages + Buttons ✅'));
app.listen(PORT, () => console.log(`Running ${PORT}`));
