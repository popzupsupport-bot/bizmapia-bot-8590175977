const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "bizmapia_verify_2024";
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;
const REMINDER_FILE = "/tmp/reminders.json";

const ASSETS = {
  posters: {
    welcome: "https://i.ibb.co/FbptYg3F/welcome.jpg",
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
function getSession(p) { if (!sessions[p]) sessions[p] = { lang: "EN", stage: "NEW", lastOpp: "" }; return sessions[p]; }

async function sendText(to, body) {
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"text", text:{ body } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); } catch(e){}
}
async function sendImage(to, link, caption) {
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"image", image:{ link, caption } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); } catch(e){ await sendText(to,caption); }
}
async function sendButtons(to, body, buttons) {
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text: body }, action:{ buttons: buttons.map(b=>({ type:"reply", reply:{ id:b.id, title:b.title.substring(0,20) } })) } } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); } catch(e){ await sendText(to,body); }
}
async function sendList(to, body, buttonText, sections) {
  try { await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"list", body:{ text: body }, action:{ button: buttonText, sections } } }, { headers:{ Authorization:`Bearer ${TOKEN}` } }); } catch(e){ await sendText(to,body); }
}

// ===== PERSISTENT REMINDER SYSTEM =====
function loadReminders(){ try{ if(fs.existsSync(REMINDER_FILE)) return JSON.parse(fs.readFileSync(REMINDER_FILE)); }catch(e){} return []; }
function saveReminders(list){ try{ fs.writeFileSync(REMINDER_FILE, JSON.stringify(list)); }catch(e){} }
function addReminder(phone, type){
  const list = loadReminders();
  list.push({ phone, type, claimedAt: Date.now(), sent1h:false, sent24h:false, sent48h:false, sent72h:false });
  saveReminders(list);
  console.log(`CRM_LEAD | Phone:${phone} | Type:${type} | Claim saved for 72h funnel`);
}

async function checkReminders(){
  let list = loadReminders();
  let changed = false;
  const now = Date.now();
  for(let r of list){
    const diffH = (now - r.claimedAt) / (1000*60*60);

    if(!r.sent1h && diffH >= 1){
      await sendText(r.phone, `⏰ *Your free recharge opportunity going to expire*\n\nYou claimed Free Recharge but vehicle not verified yet. Activate before expiry:\n${ASSETS.apps.driver}`);
      await sendButtons(r.phone, "Activate now?", [{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      r.sent1h = true; changed = true;
    }
    if(!r.sent24h && diffH >= 24){
      await sendText(r.phone, `🔔 *Re-activate your subscription discount*\n\nYour FREE recharge is still pending. Re-activate now & get Rs.33 Auto / Rs.49 Car:\n${ASSETS.apps.driver}`);
      await sendButtons(r.phone, "Re-activate:", [{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      r.sent24h = true; changed = true;
    }
    if(!r.sent48h && diffH >= 48){
      await sendText(r.phone, `💬 *Help Message: Need help to verify?*\n\nOur team can help you activate free recharge. Reply HELP or contact support.\nTry again:\n${ASSETS.apps.driver}`);
      await sendButtons(r.phone, "Need help?", [{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      r.sent48h = true; changed = true;
    }
    if(!r.sent72h && diffH >= 72){
      await sendText(r.phone, `😔 *Sorry: Your free recharge opportunity expired*\n\nYour free recharge window closed, but you can still join Bizmapia Driver & start earning daily.\n${ASSETS.apps.driver}`);
      r.sent72h = true; changed = true;
    }
  }
  if(changed) saveReminders(list.filter(r=>!r.sent72h)); // Keep only non-expired
}
setInterval(checkReminders, 5*60*1000); // Check every 5 min

app.get('/webhook', (req, res) => { if (req.query['hub.verify_token'] === VERIFY_TOKEN) res.send(req.query['hub.challenge']); else res.sendStatus(403); });
app.get('/check-reminders', async (req,res)=>{ await checkReminders(); res.send('Checked'); });
app.get('/', (req,res)=>res.send('Bizmapia Bot - Persistent 72h Funnel ✅'));

app.post('/webhook', async (req, res) => {
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return res.sendStatus(200);
    const from = msg.from;
    let input = msg.type === "interactive"? (msg.interactive.button_reply?.id || msg.interactive.list_reply?.id || "") : (msg.text?.body?.trim().toUpperCase() || "");
    const rawText = msg.text?.body || "";
    const s = getSession(from);

    if (s.stage === "DATA" && rawText.length > 3 &&!input.startsWith("opp_") &&!["menu","back_to_opp","opp_interested","driver_benefit","driver_claim","activate","business_list","customer","driver","business","opportunity"].includes(input)) {
      console.log(`CRM_LEAD | Phone:${from} | Type:${s.lastOpp || "General"} | Details:${rawText}`);
      await sendImage(from, ASSETS.posters.welcome, "✅ Details Received!");
      s.stage = "MENU";
      await sendButtons(from, "Explore more?", [{ id: "menu", title: "Main Menu" }]);
      return res.sendStatus(200);
    }

    if (s.stage === "NEW" || ["HI","HELLO","HEY","HLO","START"].includes(input)) {
      s.stage = "LANG";
      await sendImage(from, ASSETS.posters.welcome, "👋 Welcome to Bizmapia!");
      await sendButtons(from, "Select language", [{ id: "lang_en", title: "English" }, { id: "lang_hi", title: "Hindi" }, { id: "lang_ml", title: "Malayalam" }]);
      return res.sendStatus(200);
    }
    if (s.stage === "LANG" || input.startsWith("lang_")) {
      if (input.includes("en")) s.lang="EN"; else if (input.includes("hi")) s.lang="HI"; else if (input.includes("ml")) s.lang="ML";
      s.stage = "MENU";
      await sendList(from, s.lang==="ML"?"നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?":"What would you like to know?", "Main Menu", [{ title:"Menu", rows:[
        { id:"customer", title:"Customer", description:"Find a cab or business" },
        { id:"driver", title:"Driver", description:"Join & earn" },
        { id:"business", title:"Business", description:"Register shop" },
        { id:"opportunity", title:"Opportunities", description:"Franchise" }
      ]}]);
      return res.sendStatus(200);
    }

    // ===== CUSTOMER - CORRECT ORDER =====
    if (input==="customer") {
      await sendImage(from, ASSETS.posters.customer, "Customer - Find a cab or business\n✅ Taxi\n✅ Delivery\n✅ Offers");
      await sendText(from, `📲 *Download Customer App:*\n${ASSETS.apps.customer}`);
      await sendButtons(from, "Choose:", [{ id:"activate", title:"Claim Now" },{ id:"menu", title:"Main Menu" }]);
      return res.sendStatus(200);
    }
    if (input==="activate") {
      console.log(`CRM_LEAD | Phone:${from} | Type:Customer_ClaimNow`);
      await sendText(from, `✅ *Offer Activated!*\nOpen app and register to avail this offer\n\n📲 ${ASSETS.apps.customer}`);
      await sendButtons(from, "Need help?", [{ id:"menu", title:"Main Menu" }]);
      // 5 min customer reminder (short)
      setTimeout(async()=>{
        await sendText(from, `⏰ *Reminder: Activate your trip discount*\n${ASSETS.apps.customer}`);
      },5*60*1000);
      return res.sendStatus(200);
    }

    // ===== DRIVER - CORRECT ORDER + 72H FUNNEL =====
    if (input==="driver") {
      await sendImage(from, ASSETS.posters.driver, "Driver - Join & Earn Daily!\nAuto Rs.33 Car Rs.49");
      await sendText(from, `🚕 *Benefit free recharge by listing your vehicle*\n\n📲 Driver App:\n${ASSETS.apps.driver}\n\nClick Free Recharge to know benefits`);
      await sendButtons(from, "Choose:", [{ id:"driver_benefit", title:"Free Recharge" },{ id:"menu", title:"Main Menu" }]);
      return res.sendStatus(200);
    }
    if (input==="driver_benefit") {
      await sendImage(from, ASSETS.posters.freeRecharge, "🎉 FREE Recharge Benefit!\nList vehicle & get FREE recharge");
      await sendText(from, `📲 *Claim your free recharge:*\n${ASSETS.apps.driver}`);
      await sendButtons(from, "Claim now:", [{ id:"driver_claim", title:"Claim Now" },{ id:"menu", title:"Main Menu" }]);
      return res.sendStatus(200);
    }
    if (input==="driver_claim") {
      await sendText(from, `✅ *Your free recharge going to activate on your account, keep your vehicle verified and ready to accept trip*\n\n📲 ${ASSETS.apps.driver}\n\n1. Register vehicle\n2. Upload RC & License\n3. Verify`);
      await sendButtons(from, "Status?", [{ id:"menu", title:"Main Menu" }]);
      addReminder(from, "Driver_FreeRecharge"); // Saves for 1h/24h/48h/72h
      return res.sendStatus(200);
    }

    if (input==="business") {
      await sendImage(from, ASSETS.posters.business, "Business Registration");
      await sendButtons(from, "Register shop & get more customers", [{ id:"business_list", title:"How to List" },{ id:"menu", title:"Main Menu" }]);
      return res.sendStatus(200);
    }
    if (input==="business_list") {
      await sendText(from, "Send details:\nShop Name:\nMobile:\nCategory:\nLocation:");
      s.stage="DATA"; s.lastOpp="Business";
      return res.sendStatus(200);
    }

    if (["opportunity"].includes(input)) {
      await sendImage(from, ASSETS.posters.opportunity, "4 Opportunities Under One Brand");
      await sendText(from, `🎥 Overview:\n${ASSETS.videos.main_opp}`);
      await sendList(from, "Select Level", "Select", [{title:"Levels", rows:[
        {id:"opp_1",title:"District Franchisee"},{id:"opp_2",title:"Corporation"},{id:"opp_3",title:"Municipality"},{id:"opp_4",title:"Taxi Center"},{id:"opp_5",title:"Business Listing"}
      ]}]);
      return res.sendStatus(200);
    }
    if (input.startsWith("opp_")) {
      s.lastOpp = input;
      await sendImage(from, ASSETS.posters.opportunity, `Franchisee: ${input}`);
      await sendText(from, `🎥 Watch:\n${ASSETS.videos[input]}`);
      await sendButtons(from, "Proceed?", [{ id: "opp_interested", title: "Proceed" },{ id: "back_to_opp", title: "Other Options" },{ id: "menu", title: "Main Menu" }]);
      return res.sendStatus(200);
    }
    if (input==="back_to_opp") {
      await sendList(from, "Select Another", "Select", [{title:"Levels", rows:[
        {id:"opp_1",title:"District"},{id:"opp_2",title:"Corporation"},{id:"opp_3",title:"Municipality"},{id:"opp_4",title:"Taxi"},{id:"opp_5",title:"Listing"}
      ]}]);
      return res.sendStatus(200);
    }
    if (input==="opp_interested") {
      await sendText(from, `Send details for ${s.lastOpp}:\nName:\nMobile:\nLocation:`);
      s.stage="DATA";
      return res.sendStatus(200);
    }
    if (input==="menu") {
      await sendList(from, "What would you like to know?", "Main Menu", [{ title:"Menu", rows:[
        { id:"customer", title:"Customer", description:"Find a cab or business" },
        { id:"driver", title:"Driver", description:"Join & earn" },
        { id:"business", title:"Business" },
        { id:"opportunity", title:"Opportunities" }
      ]}]);
      return res.sendStatus(200);
    }

    await sendText(from, "Type Hi to restart 🙏");
    res.sendStatus(200);
  } catch (err) { res.sendStatus(200); }
});

app.listen(PORT, () => console.log(`Running ${PORT}`));
