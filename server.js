const express = require('express');
const fs = require('fs');
const path = require('path');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const P = require('pino');
const QRCodeLib = require('qrcode');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

// ========= ASSETS =========
const ASSETS = {
  images: {
    welcome: ['bizmapia_welcome_HD_1080.jpg','bizmapia_welcome_HD.jpg'],
    customer: ['bizmapia_customer_welcome_HD.jpg'],
    driver: ['bizmapia_driver_welcome_HD.jpg'],
    business: ['bizmapia_business_reg_HD.jpg'],
    opportunity: ['bizmapia_biz_opp_HD.jpg'],
    benefit: ['bizmapia_benefit_reminder_HD.jpg'],
    discount: ['bizmapia_1year_discount_HD.jpg'],
    freeRecharge: ['bizmapia_benefit_reminder_HD.jpg']
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
const REMINDER_FILE = "/tmp/reminders.json";

function getSession(p){ if(!sessions[p]) sessions[p]={lang:"EN",stage:"NEW",lastOpp:"",form:{}}; return sessions[p]; }
function getImagePath(key){
  for(let name of (ASSETS.images[key]||[])){
    let full = path.join(__dirname,name);
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
    return {
      opp_1: `━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n💰 നിക്ഷേപം: ₹10L > ₹15L\n📍 മുഴുവൻ ജില്ല അവകാശം\n👑 1 ജില്ല = 1 ഫ്രാഞ്ചൈസി`,
      opp_2: `━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n💰 നിക്ഷേപം: ₹5 ലക്ഷം`,
      opp_3: `━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n💰 നിക്ഷേപം: ₹4 ലക്ഷം`,
      opp_4: `━━━━━━━━━━━━━━\n🚕 *TAXI BUSINESS CENTER*\n💰 നിക്ഷേപം: ₹1 ലക്ഷം`,
      opp_5: `━━━━━━━━━━━━━━\n📖 *DIRECTORY BUSINESS CENTER*\n💰 നിക്ഷേപം: ₹1 ലക്ഷം`
    }[id];
  }
  if(lang==="HI"){
    return {
      opp_1: `━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n💰 निवेश: ₹10L > ₹15L\n📍 पूरा जिला अधिकार`,
      opp_2: `━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n💰 निवेश: ₹5 लाख`,
      opp_3: `━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n💰 निवेश: ₹4 लाख`,
      opp_4: `━━━━━━━━━━━━━━\n🚕 *TAXI BUSINESS CENTER*\n💰 निवेश: ₹1 लाख`,
      opp_5: `━━━━━━━━━━━━━━\n📖 *DIRECTORY BUSINESS CENTER*\n💰 निवेश: ₹1 लाख`
    }[id];
  }
  const cards={
    opp_1: `━━━━━━━━━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹10 Lakhs to ₹15 Lakhs\n📍 *Coverage:* Full District Rights\n👑 *Level:* Highest - 1 District = 1 Franchisee\n💸 *Income:* Highest Income Potential\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_2: `━━━━━━━━━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹5 Lakhs Only\n📍 *Coverage:* Full Corporation Rights\n🏙️ *Level:* Corporation Level\n💸 *Income:* High City Level Income\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_3: `━━━━━━━━━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹4 Lakhs Only\n📍 *Coverage:* Municipality Rights\n🏡 *Level:* Municipality Level\n💸 *Income:* Town Level Income\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_4: `━━━━━━━━━━━━━━━━━━━━━━\n🚕 *BUSINESS CENTER - ONLINE TAXI*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹1 Lakh Only\n📍 *Coverage:* Taxi Business Center\n🚖 *Business:* Online Taxi\n💸 *Income:* Daily Rides Income\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_5: `━━━━━━━━━━━━━━━━━━━━━━\n📖 *BUSINESS CENTER - BUSINESS DIRECTORY*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹1 Lakh Only\n📍 *Coverage:* Business Listing Center\n📚 *Business:* Business Directory\n💸 *Income:* Listing Income\n━━━━━━━━━━━━━━━━━━━━━━`
  };
  return cards[id];
}
function t(lang,en,hi,ml){ if(lang==="ML") return ml; if(lang==="HI") return hi; return en; }
function loadReminders(){ try{ if(fs.existsSync(REMINDER_FILE)) return JSON.parse(fs.readFileSync(REMINDER_FILE)); }catch(e){} return []; }
function saveReminders(list){ try{ fs.writeFileSync(REMINDER_FILE, JSON.stringify(list)); }catch(e){} }
function addReminder(phone,type){ const list=loadReminders(); list.push({phone,type,claimedAt:Date.now(),sent1h:false,sent24h:false,sent48h:false,sent72h:false}); saveReminders(list); console.log(`CRM_LEAD | Phone:${phone} | Type:${type}`); }

let sockGlobal = null;

async function checkReminders(){
  if(!sockGlobal) return;
  let list=loadReminders(); let changed=false; const now=Date.now();
  for(let r of list){
    const diffH=(now-r.claimedAt)/(1000*60*60);
    if(!r.sent1h && diffH>=1){ await sockGlobal.sendMessage(r.phone+"@s.whatsapp.net",{text:`⏰ *Your free recharge opportunity going to expire*\nActivate before expiry:\n${ASSETS.apps.driver}`}); r.sent1h=true; changed=true; }
    if(!r.sent24h && diffH>=24){ await sockGlobal.sendMessage(r.phone+"@s.whatsapp.net",{text:`🔔 *Re-activate your subscription discount*\nYour FREE recharge is still pending:\n${ASSETS.apps.driver}`}); r.sent24h=true; changed=true; }
    if(!r.sent48h && diffH>=48){ await sockGlobal.sendMessage(r.phone+"@s.whatsapp.net",{text:`💬 *Need help to verify?*\nOur team can help:\n${ASSETS.apps.driver}`}); r.sent48h=true; changed=true; }
    if(!r.sent72h && diffH>=72){ await sockGlobal.sendMessage(r.phone+"@s.whatsapp.net",{text:`😔 *Your free recharge opportunity expired*\nBut you can still join Bizmapia Driver:\n${ASSETS.apps.driver}`}); r.sent72h=true; changed=true; }
  }
  if(changed) saveReminders(list.filter(r=>!r.sent72h));
}
setInterval(checkReminders, 5*60*1000);

// ====== BOT START ======
async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({ auth: state, logger: P({level:'silent'}), browser: ["Bizmapia Bot","Chrome","1.0.0"] });
  sockGlobal = sock;
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async (update)=>{
    const { connection, lastDisconnect, qr } = update;
    if(qr){
      qrcode.generate(qr,{small:false});
      global.latestQR = qr;
      QRCodeLib.toFile('./qr.png', qr, ()=>{ console.log('QR at /qr'); });
    }
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
      const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
      const from=msg.key.remoteJid; if(!from) return;
      const type=Object.keys(msg.message)[0];
      let body='';
      if(type==='conversation') body=msg.message.conversation;
      else if(type==='extendedTextMessage') body=msg.message.extendedTextMessage.text;
      else if(type==='buttonsResponseMessage') body=msg.message.buttonsResponseMessage.selectedButtonId;
      else if(type==='listResponseMessage') body=msg.message.listResponseMessage.singleSelectReply.selectedRowId;
      const rawText=(body||'').trim();
      const input=rawText.toUpperCase();
      const s=getSession(from);
      console.log(`Received from ${from}: ${rawText}`);

      if(input.includes("OPP") && custTimers[from]) clearTimeout(custTimers[from]);

      // FORM
      if(s.stage==="FORM_NAME"){ s.form.name=rawText; s.stage="FORM_CONTACT"; await sock.sendMessage(from,{text:t(s.lang,`Thanks ${rawText} 🙏\n\n*Contact number :-*\nPlease enter your mobile number:`,`धन्यवाद ${rawText} 🙏\n*संपर्क नंबर :-*`,`നന്ദി ${rawText} 🙏\n*ബന്ധപ്പെടാനുള്ള നമ്പർ :-*`)}); return; }
      if(s.stage==="FORM_CONTACT"){ s.form.contact=rawText; s.stage="FORM_PLACE"; await sock.sendMessage(from,{text:t(s.lang,"*Place :-*\nPlease enter your place / city:","*स्थान :-*","*സ്ഥലം :-*")}); return; }
      if(s.stage==="FORM_PLACE"){
        s.form.place=rawText; s.stage="FORM_OCCUPATION";
        await sock.sendMessage(from,{
          text: t(s.lang,"*Current occupation :-*\nSelect: 1.Running business 2.Planning 3.Employee 4.Partner 5.NRI 6.Retired","*वर्तमान व्यवसाय :-*","*നിലവിലെ തൊഴിൽ :-*"),
          buttons:[{buttonId:"occ_running",buttonText:{displayText:"Running business"},type:1},{buttonId:"occ_planning",buttonText:{displayText:"Planning business"},type:1},{buttonId:"occ_employee",buttonText:{displayText:"Employee"},type:1}]
        });
        return;
      }
      if(s.stage==="FORM_OCCUPATION"||input.startsWith("OCC_")){
        const map={OCC_RUNNING:"Running business",OCC_PLANNING:"Planning to start a business",OCC_EMPLOYEE:"Employee",OCC_PARTNER:"Business Partner",OCC_NRI:"NRI",OCC_RETIRED:"Retired","1":"Running business","2":"Planning to start a business","3":"Employee","4":"Business Partner","5":"NRI","6":"Retired"};
        s.form.occupation=map[input]||rawText;
        console.log(`CRM_LEAD | Phone:${from} | Type:Franchisee_Lead | Franchise:${s.lastOpp} | Name:${s.form.name} | Contact:${s.form.contact} | Place:${s.form.place} | Occupation:${s.form.occupation}`);
        const img=getImagePath('discount');
        if(img) await sock.sendMessage(from,{image:fs.readFileSync(img),caption:`✅ Thank you ${s.form.name}!\nYour enquiry for ${getOppName(s.lastOpp)} received!\nName:${s.form.name}\nContact:${s.form.contact}\nPlace:${s.form.place}\nOccupation:${s.form.occupation}\n\nOur team will contact within 24 hours 🙏`});
        s.stage="MENU"; s.form={};
        await sock.sendMessage(from,{text:"Explore more?",buttons:[{buttonId:"view_opp_levels",buttonText:{displayText:"View Opportunities"},type:1},{buttonId:"menu",buttonText:{displayText:"Main Menu"},type:1}]});
        return;
      }
      if(s.stage==="DATA" && rawText.length>3){
        console.log(`CRM_LEAD | Phone:${from} | Type:${s.lastOpp||"General"} | Details:${rawText}`);
        const img=getImagePath('welcome');
        if(img) await sock.sendMessage(from,{image:fs.readFileSync(img),caption:"✅ Details Received! Team will contact soon 🙏"});
        else await sock.sendMessage(from,{text:"✅ Details Received!"});
        s.stage="MENU";
        await sock.sendMessage(from,{text:"Explore more?",buttons:[{buttonId:"menu",buttonText:{displayText:"Main Menu"},type:1}]});
        return;
      }

      // START
      if(s.stage==="NEW"||["HI","HELLO","HEY","HLO","START","HAI"].includes(input)){
        s.stage="LANG";
        const wImg=getImagePath('welcome');
        if(wImg) await sock.sendMessage(from,{image:fs.readFileSync(wImg),caption:"👋 Welcome to Bizmapia! Your Success, Our Platform 🙏"});
        await sock.sendMessage(from,{text:"Select language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക",buttons:[{buttonId:"lang_en",buttonText:{displayText:"English"},type:1},{buttonId:"lang_hi",buttonText:{displayText:"Hindi - हिंदी"},type:1},{buttonId:"lang_ml",buttonText:{displayText:"Malayalam - മലയാളം"},type:1}]});
        return;
      }
      if(s.stage==="LANG"||input.startsWith("LANG_")){
        if(input.includes("EN")) s.lang="EN"; else if(input.includes("HI")) s.lang="HI"; else if(input.includes("ML")) s.lang="ML";
        s.stage="MENU";
        await sock.sendMessage(from,{text:t(s.lang,"What would you like to know?","आप क्या जानना चाहते हैं?","നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?"),buttons:[{buttonId:"customer",buttonText:{displayText:"Customer"},type:1},{buttonId:"driver",buttonText:{displayText:"Driver"},type:1},{buttonId:"business",buttonText:{displayText:"Business"},type:1},{buttonId:"opportunity",buttonText:{displayText:"Opportunities"},type:1}]});
        return;
      }

      if(input==="CUSTOMER"){
        const img=getImagePath('customer');
        if(img) await sock.sendMessage(from,{image:fs.readFileSync(img),caption:`Customer - Find a cab or business\n✅ Taxi ✅ Delivery ✅ Offers\n\n📲 ${ASSETS.apps.customer}`});
        else await sock.sendMessage(from,{text:`Customer App:\n${ASSETS.apps.customer}`});
        await sock.sendMessage(from,{text:"Choose option:",buttons:[{buttonId:"activate",buttonText:{displayText:"Claim Now"},type:1},{buttonId:"menu",buttonText:{displayText:"Main Menu"},type:1}]});
        return;
      }
      if(input==="ACTIVATE"){
        console.log(`CRM_LEAD | Phone:${from} | Type:Customer_ClaimNow`);
        await sock.sendMessage(from,{text:`✅ *Offer Activated!*\nOpen app and register:\n📲 ${ASSETS.apps.customer}`});
        if(custTimers[from]) clearTimeout(custTimers[from]);
        custTimers[from]=setTimeout(async()=>{ await sock.sendMessage(from,{text:`⏰ *Reminder: Activate your trip discount*\nOpen app now:\n${ASSETS.apps.customer}`}); },5*60*1000);
        return;
      }
      if(input==="DRIVER"){
        const img=getImagePath('driver');
        if(img) await sock.sendMessage(from,{image:fs.readFileSync(img),caption:`Driver - Join & Earn Daily!\nAuto Rs.33 Car Rs.49\n✅ Benefit free recharge by listing your vehicle\n📲 ${ASSETS.apps.driver}`});
        await sock.sendMessage(from,{text:"Claim your free recharge:",buttons:[{buttonId:"driver_benefit",buttonText:{displayText:"Free Recharge"},type:1},{buttonId:"menu",buttonText:{displayText:"Main Menu"},type:1}]});
        return;
      }
      if(input==="DRIVER_BENEFIT"){
        const img=getImagePath('benefit')||getImagePath('freeRecharge');
        if(img) await sock.sendMessage(from,{image:fs.readFileSync(img),caption:`🎉 FREE Recharge Benefit!\nList your vehicle & get FREE recharge\n📲 ${ASSETS.apps.driver}`});
        await sock.sendMessage(from,{text:"Claim:",buttons:[{buttonId:"driver_claim",buttonText:{displayText:"Claim Now"},type:1},{buttonId:"menu",buttonText:{displayText:"Main Menu"},type:1}]});
        return;
      }
      if(input==="DRIVER_CLAIM"){
        await sock.sendMessage(from,{text:`✅ *Your free recharge going to activate on your account, keep your vehicle verified and ready to accept trip*\n📲 ${ASSETS.apps.driver}\n\n1. Register vehicle\n2. Upload RC & License\n3. Verify`});
        addReminder(from.split('@')[0],"Driver_FreeRecharge");
        return;
      }
      if(input==="BUSINESS"){
        const img=getImagePath('business');
        if(img) await sock.sendMessage(from,{image:fs.readFileSync(img),caption:"Business Registration - All India"});
        await sock.sendMessage(from,{text:"Register your business",buttons:[{buttonId:"business_list",buttonText:{displayText:"How to List"},type:1},{buttonId:"menu",buttonText:{displayText:"Main Menu"},type:1}]});
        return;
      }
      if(input==="BUSINESS_LIST"){ await sock.sendMessage(from,{text:"Send details:\nShop Name:\nMobile:\nCategory:\nLocation:"}); s.stage="DATA"; s.lastOpp="Business"; return; }

      if(["OPPORTUNITY","VIEW_OPP_LEVELS","OPP_SEARCH"].includes(input)){
        const img=getImagePath('opportunity');
        if(img) await sock.sendMessage(from,{image:fs.readFileSync(img),caption:"4 Business Opportunities Under One Brand - Bizmapia\nGrow Your Business And Build A Successful Future\nHigh Returns & Complete Support!"});
        await new Promise(r=>setTimeout(r,800));
        await sock.sendMessage(from,{text:`Want to know about Bizmapia company? Click the video link here 👇\n\n🎥 ${ASSETS.videos.main_opp}`});
        await new Promise(r=>setTimeout(r,800));
        await sock.sendMessage(from,{
          text: t(s.lang,"💰 *Select your franchisee level with Investment to know more:*","💰 फ्रेंचाइजी स्तर चुनें:","💰 ഫ്രാഞ്ചൈസി ലെവൽ തിരഞ്ഞെടുക്കുക:"),
          buttons:[{buttonId:"opp_1",buttonText:{displayText:"District (10L>15L)"},type:1},{buttonId:"opp_2",buttonText:{displayText:"Corp (5L)"},type:1},{buttonId:"opp_3",buttonText:{displayText:"Muni (4L)"},type:1}]
        });
        await sock.sendMessage(from,{text:"More Opportunities:",buttons:[{buttonId:"opp_4",buttonText:{displayText:"Taxi Center (1L)"},type:1},{buttonId:"opp_5",buttonText:{displayText:"Directory (1L)"},type:1},{buttonId:"menu",buttonText:{displayText:"Main Menu"},type:1}]});
        return;
      }

      if(["OPP_1","OPP_2","OPP_3","OPP_4","OPP_5"].includes(input)){
        s.lastOpp=input;
        const img=getImagePath('opportunity');
        if(img) await sock.sendMessage(from,{image:fs.readFileSync(img),caption:`${getOppName(input)} - Bizmapia`});
        await sock.sendMessage(from,{text:getOppFeeCard(input,s.lang)});
        await new Promise(r=>setTimeout(r,800));
        await sock.sendMessage(from,{text:`🎥 *${getOppName(input)} - Watch to get full awareness:*\n${ASSETS.videos[input.toLowerCase()]}\n\nWatch full video to understand investment, income & infrastructure.`});
        if(oppTimers[from]) clearTimeout(oppTimers[from]);
        oppTimers[from]=setTimeout(async()=>{
          await sock.sendMessage(from,{text:t(s.lang,`⏰ *You want to grab this opportunity?*\n\nYou viewed *${getOppName(input)}* 5 mins ago.\nDo you want to proceed?`,`⏰ क्या आप यह अवसर लेना चाहते हैं?`,`⏰ ഈ അവസരം നിങ്ങൾക്ക് വേണോ?`),buttons:[{buttonId:"opp_yes",buttonText:{displayText:"Yes"},type:1},{buttonId:"opp_no",buttonText:{displayText:"No"},type:1},{buttonId:"opp_search",buttonText:{displayText:"Search Other"},type:1}]});
        },5*60*1000);
        await sock.sendMessage(from,{text:t(s.lang,"You want to grab this opportunity?","क्या आप यह अवसर लेना चाहते हैं?","ഈ അവസരം നിങ്ങൾക്ക് വേണോ?"),buttons:[{buttonId:"opp_yes",buttonText:{displayText:"Yes"},type:1},{buttonId:"opp_no",buttonText:{displayText:"No"},type:1},{buttonId:"opp_search",buttonText:{displayText:"Search Other"},type:1}]});
        return;
      }

      if(input==="OPP_YES"){
        if(oppTimers[from]) clearTimeout(oppTimers[from]);
        s.stage="FORM_NAME"; s.form={};
        await sock.sendMessage(from,{text:t(s.lang,`Great! You want to grab this opportunity 🎉\n\n*${getOppName(s.lastOpp)}*\n\n*Name :-*\nEnter your full name:`,`बढ़िया! नाम दर्ज करें:`,`മികച്ചത്! ${getOppName(s.lastOpp)}\n\n*പേര് :-*`)});
        return;
      }
      if(input==="OPP_NO"){
        if(oppTimers[from]) clearTimeout(oppTimers[from]);
        console.log(`CRM_LEAD | Phone:${from} | Type:Opted_Out | Franchise:${s.lastOpp}`);
        await sock.sendMessage(from,{text:t(s.lang,"You are successfully opt out from our business enquiry 🙏\n\nIf you change mind, type *HI* to start again.","आप सफलतापूर्वक बाहर निकल गए","നിങ്ങൾ വിജയകരമായി ഒഴിവാക്കി")});
        s.stage="NEW"; return;
      }
      if(input==="MENU"){
        await sock.sendMessage(from,{text:"Main Menu",buttons:[{buttonId:"customer",buttonText:{displayText:"Customer"},type:1},{buttonId:"driver",buttonText:{displayText:"Driver"},type:1},{buttonId:"business",buttonText:{displayText:"Business"},type:1},{buttonId:"opportunity",buttonText:{displayText:"Opportunities"},type:1}]});
        return;
      }
      await sock.sendMessage(from,{text:"━━━━━━━━━━━━━━━\n🔄 *RESTART MENU*\n👉 Type *HI* to Start Again 👈\n━━━━━━━━━━━━━━━"});
    }catch(err){ console.error("Error:",err); }
  });
}

app.get('/',(req,res)=>res.send('Bizmapia Bot Full - HD + Malayalam + All Features ✅'));
app.get('/health',(req,res)=>res.send('OK'));
app.get('/qr', async (req,res)=>{
  if(global.latestQR){
    const dataUrl = await QRCodeLib.toDataURL(global.latestQR);
    res.send(`<html><body style="text-align:center;padding:30px;font-family:sans-serif"><h1>Scan QR - Bizmapia Bot</h1><img src="${dataUrl}" style="width:320px;border:10px solid #000"><p>WhatsApp > Linked Devices > Link a Device</p><p>Auto refresh in 10 sec</p><script>setTimeout(()=>location.reload(),10000)</script></body></html>`);
  } else res.send('Bot already connected! No QR needed. Logs show "WhatsApp Connected Successfully!"');
});

startBot();
app.listen(PORT,()=>{ console.log(`Server running on ${PORT}`); console.log("==> Your service is live"); });
