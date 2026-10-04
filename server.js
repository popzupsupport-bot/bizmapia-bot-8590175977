const express = require('express');
const fs = require('fs');
const path = require('path');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const P = require('pino');

const app = express();
app.use(express.json());
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
    discount: ['bizmapia_1year_discount_HD.jpg']
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
const oppTimers = {};
const custTimers = {};

function getSession(phone){
  if(!sessions[phone]) sessions[phone]={ lang:"EN", stage:"NEW", lastOpp:"", form:{}, name:"" };
  return sessions[phone];
}
function getImagePath(key){
  const list = ASSETS.images[key] || [];
  for(let name of list){
    const full = path.join(__dirname, name);
    if(fs.existsSync(full)) return full;
  }
  return null;
}
function getOppName(id){
  const map={
    opp_1:"District Franchisee (10L > 15L Investment)",
    opp_2:"Corporation Franchisee (5L Investment)",
    opp_3:"Municipality Franchisee (4L Investment)",
    opp_4:"Business Center - Online Taxi (1L Investment)",
    opp_5:"Business Center - Business Directory (1L Investment)"
  };
  return map[id]||id;
}
function getOppFeeCard(id, lang){
  if(lang==="ML"){
    const cards={
      opp_1: `━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n━━━━━━━━━━━━━━\n💰 നിക്ഷേപം: ₹10 ലക്ഷം മുതൽ ₹15 ലക്ഷം വരെ\n📍 കവറേജ്: മുഴുവൻ ജില്ല അവകാശം\n👑 ലെവൽ: ഏറ്റവും ഉയർന്നത്`,
      opp_2: `━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n━━━━━━━━━━━━━━\n💰 നിക്ഷേപം: ₹5 ലക്ഷം മാത്രം`,
      opp_3: `━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n━━━━━━━━━━━━━━\n💰 നിക്ഷേപം: ₹4 ലക്ഷം മാത്രം`,
      opp_4: `━━━━━━━━━━━━━━\n🚕 *BUSINESS CENTER - TAXI*\n━━━━━━━━━━━━━━\n💰 നിക്ഷേപം: ₹1 ലക്ഷം മാത്രം`,
      opp_5: `━━━━━━━━━━━━━━\n📖 *BUSINESS CENTER - DIRECTORY*\n━━━━━━━━━━━━━━\n💰 നിക്ഷേപം: ₹1 ലക്ഷം മാത്രം`
    };
    return cards[id]||"";
  }
  const cards={
    opp_1: `━━━━━━━━━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹10 Lakhs to ₹15 Lakhs\n📍 *Coverage:* Full District Rights\n👑 *Level:* Highest - 1 District = 1 Franchisee\n💸 *Income:* Highest Income Potential`,
    opp_2: `━━━━━━━━━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹5 Lakhs Only\n📍 *Coverage:* Full Corporation Rights`,
    opp_3: `━━━━━━━━━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹4 Lakhs Only`,
    opp_4: `━━━━━━━━━━━━━━━━━━━━━━\n🚕 *BUSINESS CENTER - ONLINE TAXI*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹1 Lakh Only`,
    opp_5: `━━━━━━━━━━━━━━━━━━━━━━\n📖 *BUSINESS CENTER - BUSINESS DIRECTORY*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹1 Lakh Only`
  };
  return cards[id]||"";
}
function t(lang, en, hi, ml){
  if(lang==="ML") return ml;
  if(lang==="HI") return hi;
  return en;
}

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({ auth: state, logger: P({ level: 'silent' }), browser: ["Bizmapia Bot", "Chrome", "1.0.0"] });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async (update)=>{
    const { connection, lastDisconnect, qr } = update;
    if(qr) qrcode.generate(qr,{small:true});
    if(connection==='close'){
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut;
      if(shouldReconnect) startBot();
    } else if(connection==='open'){
      console.log("==> Your service is live");
      console.log("==> WhatsApp Connected Successfully!");
    }
  });

  sock.ev.on('messages.upsert', async (m)=>{
    try{
      const msg = m.messages[0];
      if(!msg.message || msg.key.fromMe) return;
      const from = msg.key.remoteJid;
      if(!from) return;

      const msgType = Object.keys(msg.message)[0];
      let body = '';
      if(msgType==='conversation') body = msg.message.conversation;
      else if(msgType==='extendedTextMessage') body = msg.message.extendedTextMessage.text;
      else if(msgType==='buttonsResponseMessage') body = msg.message.buttonsResponseMessage.selectedButtonId;
      else if(msgType==='listResponseMessage') body = msg.message.listResponseMessage.singleSelectReply.selectedRowId;

      const rawText = (body || '').trim();
      const input = rawText.toUpperCase();
      const s = getSession(from);
      console.log(`Received from ${from}: ${rawText}`);

      if(s.stage==="FORM_NAME"){
        s.form.name = rawText; s.stage="FORM_CONTACT";
        await sock.sendMessage(from, { text: t(s.lang, `Thanks ${rawText} 🙏\n\n*Contact number :-*`, `धन्यवाद ${rawText} 🙏\n\n*संपर्क नंबर :-*`, `നന്ദി ${rawText} 🙏\n\n*ബന്ധപ്പെടാനുള്ള നമ്പർ :-*`) });
        return;
      }
      if(s.stage==="FORM_CONTACT"){
        s.form.contact = rawText; s.stage="FORM_PLACE";
        await sock.sendMessage(from, { text: t(s.lang, "*Place :-*\nPlease enter your place / city:", "*स्थान :-*", "*സ്ഥലം :-*") });
        return;
      }
      if(s.stage==="FORM_PLACE"){
        s.form.place = rawText; s.stage="FORM_OCCUPATION";
        await sock.sendMessage(from, {
          text: "*Current occupation :-*\n1. Running business\n2. Planning to start a business\n3. Employee\n4. Business Partner\n5. NRI\n6. Retired",
          buttons: [
            {buttonId:"occ_running", buttonText:{displayText:"Running business"}, type:1},
            {buttonId:"occ_planning", buttonText:{displayText:"Planning"}, type:1},
            {buttonId:"occ_employee", buttonText:{displayText:"Employee"}, type:1}
          ]
        });
        return;
      }
      if(s.stage==="FORM_OCCUPATION" || input.startsWith("OCC_")){
        const mapOcc={OCC_RUNNING:"Running business",OCC_PLANNING:"Planning to start a business",OCC_EMPLOYEE:"Employee",OCC_PARTNER:"Business Partner",OCC_NRI:"NRI",OCC_RETIRED:"Retired","1":"Running business","2":"Planning to start a business","3":"Employee","4":"Business Partner","5":"NRI","6":"Retired"};
        s.form.occupation = mapOcc[input] || rawText;
        console.log(`CRM_LEAD | Phone:${from} | Type:Franchisee_Lead | Franchise:${s.lastOpp} | Name:${s.form.name} | Contact:${s.form.contact} | Place:${s.form.place} | Occupation:${s.form.occupation}`);
        const img = getImagePath('discount');
        if(img) await sock.sendMessage(from, { image: fs.readFileSync(img), caption: `✅ Thank you ${s.form.name}!\nYour enquiry for ${getOppName(s.lastOpp)} received!\nName: ${s.form.name}\nContact: ${s.form.contact}\nPlace: ${s.form.place}\nOccupation: ${s.form.occupation}\n\nOur team will contact within 24 hours 🙏` });
        s.stage="MENU"; s.form={};
        await sock.sendMessage(from, { text: "Explore more?", buttons:[{buttonId:"view_opp_levels", buttonText:{displayText:"View Opportunities"}, type:1},{buttonId:"menu", buttonText:{displayText:"Main Menu"}, type:1}] });
        return;
      }

      if(s.stage==="NEW" || ["HI","HELLO","HEY","HLO","START","HAI"].includes(input)){
        s.stage="LANG";
        const welcomeImg = getImagePath('welcome');
        if(welcomeImg) await sock.sendMessage(from, { image: fs.readFileSync(welcomeImg), caption: "👋 Welcome to Bizmapia! Your Success, Our Platform 🙏" });
        await sock.sendMessage(from, {
          text: "Select language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക",
          buttons:[
            {buttonId:"lang_en", buttonText:{displayText:"English"}, type:1},
            {buttonId:"lang_hi", buttonText:{displayText:"Hindi - हिंदी"}, type:1},
            {buttonId:"lang_ml", buttonText:{displayText:"Malayalam - മലയാളം"}, type:1}
          ]
        });
        return;
      }

      if(s.stage==="LANG" || input.startsWith("LANG_")){
        if(input.includes("EN")) s.lang="EN"; else if(input.includes("HI")) s.lang="HI"; else if(input.includes("ML")) s.lang="ML";
        s.stage="MENU";
        const menuText = t(s.lang, "What would you like to know?", "आप क्या जानना चाहते हैं?", "നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?");
        await sock.sendMessage(from, { text: menuText, buttons:[{buttonId:"customer", buttonText:{displayText:"Customer"}, type:1},{buttonId:"driver", buttonText:{displayText:"Driver"}, type:1},{buttonId:"business", buttonText:{displayText:"Business"}, type:1},{buttonId:"opportunity", buttonText:{displayText:"Opportunities"}, type:1}] });
        return;
      }

      if(input==="CUSTOMER"){
        const img = getImagePath('customer');
        if(img) await sock.sendMessage(from, { image: fs.readFileSync(img), caption: `Customer - Find a cab or business\n📲 ${ASSETS.apps.customer}` });
        await sock.sendMessage(from, { text: "Choose:", buttons:[{buttonId:"activate", buttonText:{displayText:"Claim Now"}, type:1},{buttonId:"menu", buttonText:{displayText:"Main Menu"}, type:1}] });
        return;
      }
      if(input==="ACTIVATE"){
        await sock.sendMessage(from, { text: `✅ Offer Activated!\n${ASSETS.apps.customer}` });
        if(custTimers[from]) clearTimeout(custTimers[from]);
        custTimers[from]=setTimeout(async()=>{ await sock.sendMessage(from, { text: `⏰ Reminder: Activate your trip discount\n${ASSETS.apps.customer}` }); },5*60*1000);
        return;
      }
      if(input==="DRIVER" || input==="DRIVER_BENEFIT"){
        const img = input==="DRIVER_BENEFIT"? getImagePath('benefit') : getImagePath('driver');
        if(img) await sock.sendMessage(from, { image: fs.readFileSync(img), caption: `Driver - Join & Earn\n📲 ${ASSETS.apps.driver}` });
        await sock.sendMessage(from, { text: "Claim:", buttons:[{buttonId:"driver_claim", buttonText:{displayText:"Claim Now"}, type:1},{buttonId:"menu", buttonText:{displayText:"Main Menu"}, type:1}] });
        return;
      }
      if(input==="DRIVER_CLAIM"){
        await sock.sendMessage(from, { text: `✅ Your free recharge going to activate\n📲 ${ASSETS.apps.driver}` });
        return;
      }
      if(input==="BUSINESS"){
        const img = getImagePath('business');
        if(img) await sock.sendMessage(from, { image: fs.readFileSync(img), caption: "Business Registration" });
        await sock.sendMessage(from, { text: "Register:", buttons:[{buttonId:"business_list", buttonText:{displayText:"How to List"}, type:1},{buttonId:"menu", buttonText:{displayText:"Main Menu"}, type:1}] });
        return;
      }
      if(input==="OPPORTUNITY" || input==="VIEW_OPP_LEVELS" || input==="OPP_SEARCH"){
        const img = getImagePath('opportunity');
        if(img) await sock.sendMessage(from, { image: fs.readFileSync(img), caption: "4 Business Opportunities Under One Brand - Bizmapia" });
        await sock.sendMessage(from, { text: `Want to know about Bizmapia? 🎥 ${ASSETS.videos.main_opp}` });
        await sock.sendMessage(from, {
          text: t(s.lang, "💰 Select your franchisee level:", "💰 फ्रेंचाइजी स्तर चुनें:", "💰 ഫ്രാഞ്ചൈസി ലെവൽ തിരഞ്ഞെടുക്കുക:"),
          buttons:[{buttonId:"opp_1", buttonText:{displayText:"District (10L>15L)"}, type:1},{buttonId:"opp_2", buttonText:{displayText:"Corporation (5L)"}, type:1},{buttonId:"opp_3", buttonText:{displayText:"Municipality (4L)"}, type:1}]
        });
        await sock.sendMessage(from, { text: "More:", buttons:[{buttonId:"opp_4", buttonText:{displayText:"Taxi Center (1L)"}, type:1},{buttonId:"opp_5", buttonText:{displayText:"Directory (1L)"}, type:1},{buttonId:"menu", buttonText:{displayText:"Main Menu"}, type:1}] });
        return;
      }
      if(["OPP_1","OPP_2","OPP_3","OPP_4","OPP_5"].includes(input)){
        s.lastOpp=input;
        const img = getImagePath('opportunity');
        if(img) await sock.sendMessage(from, { image: fs.readFileSync(img), caption: `${getOppName(input)} - Bizmapia` });
        await sock.sendMessage(from, { text: getOppFeeCard(input, s.lang) });
        await sock.sendMessage(from, { text: `🎥 Watch: ${ASSETS.videos[input.toLowerCase()]}` });
        if(oppTimers[from]) clearTimeout(oppTimers[from]);
        oppTimers[from]=setTimeout(async()=>{
          await sock.sendMessage(from, {
            text: t(s.lang, `⏰ You want to grab this opportunity? You viewed ${getOppName(input)} 5 mins ago.`, `⏰ क्या आप यह अवसर लेना चाहते हैं?`, `⏰ ഈ അവസരം നിങ്ങൾക്ക് വേണോ?`),
            buttons:[{buttonId:"opp_yes", buttonText:{displayText:"Yes"}, type:1},{buttonId:"opp_no", buttonText:{displayText:"No"}, type:1},{buttonId:"opp_search", buttonText:{displayText:"Search Other"}, type:1}]
          });
        },5*60*1000);
        await sock.sendMessage(from, { text: "You want to grab this opportunity?", buttons:[{buttonId:"opp_yes", buttonText:{displayText:"Yes"}, type:1},{buttonId:"opp_no", buttonText:{displayText:"No"}, type:1},{buttonId:"opp_search", buttonText:{displayText:"Search Other"}, type:1}] });
        return;
      }
      if(input==="OPP_YES"){
        if(oppTimers[from]) clearTimeout(oppTimers[from]);
        s.stage="FORM_NAME"; s.form={};
        await sock.sendMessage(from, { text: t(s.lang, `Great! You want to grab this opportunity 🎉\n\n*${getOppName(s.lastOpp)}*\n\n*Name :-*\nEnter your full name:`, `बढ़िया! नाम दर्ज करें:`, `മികച്ചത്! പേര് നൽകുക: ${getOppName(s.lastOpp)}`) });
        return;
      }
      if(input==="OPP_NO"){
        if(oppTimers[from]) clearTimeout(oppTimers[from]);
        await sock.sendMessage(from, { text: t(s.lang, "You are successfully opt out 🙏 Type *HI* to start again.", "आप बाहर निकल गए", "നിങ്ങൾ ഒഴിവാക്കി") });
        s.stage="NEW"; return;
      }
      if(input==="MENU"){
        await sock.sendMessage(from, { text: "Main Menu", buttons:[{buttonId:"customer", buttonText:{displayText:"Customer"}, type:1},{buttonId:"driver", buttonText:{displayText:"Driver"}, type:1},{buttonId:"business", buttonText:{displayText:"Business"}, type:1},{buttonId:"opportunity", buttonText:{displayText:"Opportunities"}, type:1}] });
        return;
      }
      await sock.sendMessage(from, { text: "🔄 Type *HI* to Start Again 🙏" });
    }catch(err){ console.error("Error:", err); }
  });
}

app.get('/', (req,res)=>res.send('Bizmapia Bot Full - HD + Malayalam + Language ✅'));
app.get('/health', (req,res)=>res.send('OK'));
startBot();
app.listen(PORT, ()=>{ console.log(`Server running on ${PORT}`); console.log("==> Your service is live"); });
