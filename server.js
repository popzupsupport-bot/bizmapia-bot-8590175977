const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "bizmapia_verify_2024";
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;

const ASSETS = {
  posters: {
    welcome: "https://i.ibb.co/FbptYg3F/welcome.jpg", // Change to your direct.jpg link if ibb.co page link fails
    customer: "https://i.ibb.co/3XsWd3p/customer.jpg",
    driver: "https://i.ibb.co/2153CSjp/driver.jpg",
    business: "https://i.ibb.co/3yjrdVxk/business.jpg",
    opportunity: "https://i.ibb.co/gbPYBbMt/opportunity.jpg",
    freeRecharge: "https://i.ibb.co/LXVpRKQp/free-recharge.jpg"
  },
  apps: {
    customer: "https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia",
    driver: "https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia_driver"
  },
  videos: {
    main_opp: "https://youtu.be/8ZnDlvbgG_c?si=a5ONBZg6Oe8WuGTP",
    opp_1: "https://youtu.be/_y2JeFHBnqg?si=igKYEPjGheuARuZe",
    opp_2: "https://youtu.be/GqolfqgHiCU?si=ySBbc_qLD2mLyBmN",
    opp_3: "https://youtu.be/GqolfqgHiCU?si=qTxRIIeq7iP5X5Jh",
    opp_4: "https://youtu.be/r0X77XfmF94?si=XdbPE4Ml2_jkv8zW",
    opp_5: "https://youtu.be/r0X77XfmF94?si=XdbPE4Ml2_jkv8zW"
  }
};

const sessions = {};
function getSession(p) { if (!sessions[p]) sessions[p] = { lang: "EN", stage: "NEW", lastOpp: "", lastType: "" }; return sessions[p]; }

async function sendText(to, body) {
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"text", text:{ body } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); }
  catch (e) { console.log("Text err"); }
}
async function sendImage(to, link, caption) {
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"image", image:{ link, caption } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); }
  catch (e) { console.log("Image failed, fallback"); await sendText(to, caption); }
}
async function sendButtons(to, body, buttons) {
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text: body }, action:{ buttons: buttons.map(b=>({ type:"reply", reply:{ id:b.id, title:b.title.substring(0,20) } })) } } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); }
  catch (e) { await sendText(to, body); }
}
async function sendList(to, body, buttonText, sections) {
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"list", body:{ text: body }, action:{ button: buttonText, sections } } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); }
  catch (e) { await sendText(to, body); }
}

app.get('/webhook', (req, res) => { if (req.query['hub.verify_token'] === VERIFY_TOKEN) res.send(req.query['hub.challenge']); else res.sendStatus(403); });

app.post('/webhook', async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);
    const from = msg.from;
    let input = msg.type === "interactive"? (msg.interactive.button_reply?.id || msg.interactive.list_reply?.id || "") : (msg.text?.body?.trim().toUpperCase() || "");
    const rawText = msg.text?.body || "";
    const s = getSession(from);
    console.log("Input:", input, "Lang:", s.lang, "Stage:", s.stage);

    // LEAD CAPTURE - AFTER PROCEED / CLAIM
    if (s.stage === "DATA" &&!["menu","back_to_opp","opp_interested","driver_benefit","driver_claim","activate","business_list"].includes(input) &&!input.startsWith("opp_") &&!["customer","driver","business","opportunity"].includes(input)) {
      console.log("LEAD CAPTURED:", from, rawText, s.lastType, s.lastOpp);
      await sendImage(from, ASSETS.posters.welcome, s.lang==="ML"?"✅ വിവരങ്ങൾ ലഭിച്ചു! ടീം ഉടൻ ബന്ധപ്പെടും":s.lang==="HI"?"✅ जानकारी मिली!":"✅ Details Received! Our team will contact you soon 🙏\nLead for: " + (s.lastOpp || s.lastType));
      s.stage = "MENU";
      await sendButtons(from, s.lang==="ML"?"മറ്റെന്തെങ്കിലും അറിയണോ?":s.lang==="HI"?"क्या और जानना चाहते हैं?":"Want to explore more?", [
        { id: "menu", title: "Main Menu" },
        { id: "back_to_opp", title: "Other Options" }
      ]);
      return res.sendStatus(200);
    }

    if (s.stage === "NEW" || ["HI","HELLO","HEY","HLO","START"].includes(input)) {
      s.stage = "LANG";
      await sendImage(from, ASSETS.posters.welcome, "👋 Welcome to Bizmapia! Your Success, Our Platform 🙏\n50+ Franchisees in Kerala");
      await sendButtons(from, "Select language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക", [
        { id: "lang_en", title: "English" }, { id: "lang_hi", title: "Hindi" }, { id: "lang_ml", title: "Malayalam" }
      ]);
      return res.sendStatus(200);
    }

    if (s.stage === "LANG" || input.startsWith("lang_")) {
      if (input.includes("en")||input==="A") s.lang="EN"; else if (input.includes("hi")||input==="B") s.lang="HI"; else if (input.includes("ml")||input==="C") s.lang="ML";
      s.stage = "MENU";
      const menuText = s.lang==="ML"?"നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?":s.lang==="HI"?"आप क्या जानना चाहते हैं?":"What would you like to know?";
      await sendList(from, menuText, "Main Menu", [{ title:"Menu", rows:[
        { id:"customer", title:s.lang==="ML"?"കസ്റ്റമർ":s.lang==="HI"?"कस्टमर":"Customer", description: s.lang==="ML"?"ക്യാബ് അല്ലെങ്കിൽ ബിസിനസ്":s.lang==="HI"?"कैब या बिजनेस खोजें":"Find a cab or business" },
        { id:"driver", title:s.lang==="ML"?"ഡ്രൈവർ":s.lang==="HI"?"ड्राइवर":"Driver", description: s.lang==="ML"?"ചേരൂ & സമ്പാദിക്കൂ":s.lang==="HI"?"जुड़ें और कमाएं":"Join & earn" },
        { id:"business", title:s.lang==="ML"?"ബിസിനസ്":s.lang==="HI"?"बिजनेस":"Business", description: s.lang==="ML"?"ഷോപ്പ് രജിസ്റ്റർ ചെയ്യുക":s.lang==="HI"?"दुकान रजिस्टर करें":"Register shop" },
        { id:"opportunity", title:s.lang==="ML"?"അവസരങ്ങൾ":s.lang==="HI"?"अवसर":"Opportunities", description:"Franchise" }
      ]}]);
      return res.sendStatus(200);
    }

    // MAIN MENU
    if (["customer","driver","business","opportunity","menu"].includes(input)) {
      if (input==="customer") {
        await sendImage(from, ASSETS.posters.customer, s.lang==="ML"?"കസ്റ്റമർ ആപ്പ് - ക്യാബ് അല്ലെങ്കിൽ ബിസിനസ് കണ്ടെത്തുക":s.lang==="HI"?"कस्टमर - कैब या बिजनेस खोजें":"Customer - Find a cab or business\n✅ Taxi\n✅ Delivery\n✅ Offers");
        await sendButtons(from, `📲 Download Customer App:\n${ASSETS.apps.customer}`, [
          { id:"activate", title: s.lang==="ML"?"ക്ലെയിം ചെയ്യുക":s.lang==="HI"?"क्लेम करें":"Claim Now" },
          { id:"menu", title:"Main Menu" }
        ]);
      } else if (input==="driver") {
        await sendImage(from, ASSETS.posters.driver, "Driver - Join & Earn Daily!\nAuto Rs.33 Car Rs.49");
        await sendButtons(from, `🚕 Driver App:\n${ASSETS.apps.driver}\n\nClick Free Recharge to know benefits`, [
          { id:"driver_benefit", title:"Free Recharge" },
          { id:"menu", title:"Main Menu" }
        ]);
      } else if (input==="business") {
        await sendImage(from, ASSETS.posters.business, "Business Registration - All India");
        await sendButtons(from, "Register your shop & get more customers", [
          { id:"business_list", title:"How to List" },
          { id:"menu", title:"Main Menu" }
        ]);
      } else if (input==="opportunity") {
        await sendImage(from, ASSETS.posters.opportunity, "4 Opportunities Under One Brand");
        await sendText(from, `🎥 *Opportunity Overview:*\n${ASSETS.videos.main_opp}`);
        await sendList(from, "Select Franchisee Level", "Select", [{title:"Levels", rows:[
          {id:"opp_1",title:"District Franchisee", description:"Full District"},
          {id:"opp_2",title:"Corporation Franchisee", description:"Corporation"},
          {id:"opp_3",title:"Municipality Franchisee", description:"Municipality"},
          {id:"opp_4",title:"Taxi Business Center", description:"Online Taxi"},
          {id:"opp_5",title:"Business Listing Center", description:"Business Listing"}
        ]}]);
      } else if (input==="menu") {
        const menuText = s.lang==="ML"?"നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?":s.lang==="HI"?"आप क्या जानना चाहते हैं?":"What would you like to know?";
        await sendList(from, menuText, "Main Menu", [{ title:"Menu", rows:[
          { id:"customer", title:s.lang==="ML"?"കസ്റ്റമർ":s.lang==="HI"?"कस्टमर":"Customer", description: s.lang==="ML"?"ക്യാബ് അല്ലെങ്കിൽ ബിസിനസ്":s.lang==="HI"?"कैब या बिजनेस खोजें":"Find a cab or business" },
          { id:"driver", title:s.lang==="ML"?"ഡ്രൈവർ":s.lang==="HI"?"ड्राइवर":"Driver", description: s.lang==="ML"?"ചേരൂ & സമ്പാദിക്കൂ":s.lang==="HI"?"जुड़ें और कमाएं":"Join & earn" },
          { id:"business", title:s.lang==="ML"?"ബിസിനസ്":s.lang==="HI"?"बिजनेस":"Business", description: s.lang==="ML"?"ഷോപ്പ് രജിസ്റ്റർ ചെയ്യുക":s.lang==="HI"?"दुकान रजिस्टर करें":"Register shop" },
          { id:"opportunity", title:s.lang==="ML"?"അവസരങ്ങൾ":s.lang==="HI"?"अवसर":"Opportunities", description:"Franchise" }
        ]}]);
      }
      return res.sendStatus(200);
    }

    // DRIVER FREE RECHARGE - IMAGE MAINTAINED
    if (input==="driver_benefit") {
      await sendImage(from, ASSETS.posters.freeRecharge, "🎉 FREE Recharge Benefit!\nList vehicle & get FREE recharge");
      await sendButtons(from, `Get FREE recharge now:\n${ASSETS.apps.driver}`, [
        { id:"driver_claim", title:"Claim Now" },
        { id:"menu", title:"Main Menu" }
      ]);
      return res.sendStatus(200);
    }

    // ALL CLAIM HANDLERS - FIXED - NO MORE "Type Hi to restart"
    if (input==="driver_claim") {
      s.lastType = "Driver - Free Recharge Claim";
      await sendImage(from, ASSETS.posters.driver, "Driver Claim Received!");
      await sendText(from, s.lang==="ML"?"ദയവായി വിവരങ്ങൾ അയയ്ക്കുക:\nName:\nMobile:\nVehicle No:\nLocation:":s.lang==="HI"?"कृपया विवरण भेजें:\nName:\nMobile:\nVehicle:":"Please send details for Driver Claim:\nName:\nMobile:\nVehicle No:\nLocation:");
      s.stage="DATA";
      return res.sendStatus(200);
    }

    if (input==="activate") {
      s.lastType = "Customer - Activation";
      await sendImage(from, ASSETS.posters.customer, "Customer Activation");
      await sendText(from, s.lang==="ML"?"വിവരങ്ങൾ അയയ്ക്കുക:\nName:\nMobile:\nLocation:":s.lang==="HI"?"विवरण भेजें:":"Please send for Customer Activation:\nName:\nMobile:\nLocation:");
      s.stage="DATA";
      return res.sendStatus(200);
    }

    if (input==="business_list") {
      s.lastType = "Business Listing";
      await sendImage(from, ASSETS.posters.business, "How to List Your Business");
      await sendText(from, s.lang==="ML"?"ബിസിനസ് രജിസ്റ്റർ ചെയ്യാൻ വിവരങ്ങൾ അയയ്ക്കുക:\nShop Name:\nMobile:\nLocation:":s.lang==="HI"?"बिजनेस रजिस्टर के लिए विवरण भेजें:":"Send details to Register Business:\nShop Name:\nMobile:\nCategory:\nLocation:");
      s.stage="DATA";
      return res.sendStatus(200);
    }

    // FRANCHISEE VIDEOS
    const OPP_DETAILS = {
      opp_1: "💼 *District Level Franchisee*\nFull District Rights",
      opp_2: "🏙️ *Corporation Level Franchisee*\nCorporation Rights",
      opp_3: "🏘️ *Municipality Level Franchisee*\nMunicipality Rights",
      opp_4: "🚕 *Business Center - Online Taxi*",
      opp_5: "📖 *Business Center - Business Listing*"
    };

    if (input.startsWith("opp_") && OPP_DETAILS[input]) {
      s.lastOpp = input;
      const video = ASSETS.videos[input];
      await sendImage(from, ASSETS.posters.opportunity, OPP_DETAILS[input]);
      await sendText(from, `🎥 *Watch Video:*\n${video}\n\nWatch video then proceed`);
      await sendButtons(from, "Do you want to proceed further?", [
        { id: "opp_interested", title: "Proceed" },
        { id: "back_to_opp", title: "Other Options" },
        { id: "menu", title: "Main Menu" }
      ]);
      return res.sendStatus(200);
    }

    if (input==="back_to_opp") {
      await sendList(from, "Select Another Opportunity", "Select", [{title:"Levels", rows:[
        {id:"opp_1",title:"District Franchisee"},{id:"opp_2",title:"Corporation"},{id:"opp_3",title:"Municipality"},{id:"opp_4",title:"Taxi Center"},{id:"opp_5",title:"Business Listing"}
      ]}]);
      return res.sendStatus(200);
    }

    if (input==="opp_interested") {
      await sendText(from, `Please send details for ${s.lastOpp}:\nName:\nMobile:\nLocation:\nInvestment Range:`);
      s.stage="DATA";
      return res.sendStatus(200);
    }

    await sendText(from, "Type Hi to restart 🙏");
    res.sendStatus(200);
  } catch (err) {
    console.log("Prevented Crash:", err.message);
    res.sendStatus(200);
  }
});

app.get('/', (req, res) => res.send('Bizmapia Bot - All Images + Videos Fixed ✅'));
app.listen(PORT, () => console.log(`Running ${PORT}`));
