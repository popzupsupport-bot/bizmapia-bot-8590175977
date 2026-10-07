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

// === 7 POSTERS - ALL 1080x1080 HD - UPLOAD THE FIXED ONES I GAVE YOU AND REPLACE LINKS ===
const ASSETS = {
  posters: {
    welcome: "https://i.ibb.co/NEW/welcome-final-1080.jpg", // 1 - NEW Bizmapia Chat girl poster you just gave
    customer: "https://i.ibb.co/3XsWd3p/customer.jpg", // 2
    driver: "https://i.ibb.co/2153CSjp/driver.jpg", // 3
    business: "https://i.ibb.co/3yjrdVxk/business.jpg", // 4
    opportunity: "https://i.ibb.co/gbPYBbMt/opportunity.jpg", // 5
    freeRecharge: "https://i.ibb.co/LXVpRKQp/free-recharge.jpg", // 6 - 33rs auto poster for driver reminder
    businessBenefit: "https://i.ibb.co/NEW/business-benefit-yearly.jpg" // 7 - Yearly discount poster
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
const processedIds = new Set();

function getSession(p){ if(!sessions[p]) sessions[p]={lang:"EN",stage:"NEW",lastOpp:"",form:{}}; return sessions[p]; }

async function sendText(to, body){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"text",text:{body}}, {headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){} }
async function sendImage(to, link, caption){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"image",image:{link,caption}}, {headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ await sendText(to,caption); } }
async function sendButtons(to, body, buttons){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"button",body:{text:body},action:{buttons:buttons.map(b=>({type:"reply",reply:{id:b.id,title:b.title.substring(0,20)}}))}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ await sendText(to,body); } }
async function sendList(to, body, buttonText, sections){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"list",body:{text:body},action:{button:buttonText,sections}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ await sendText(to,body); } }

function loadReminders(){ try{ if(fs.existsSync(REMINDER_FILE)) return JSON.parse(fs.readFileSync(REMINDER_FILE)); }catch(e){} return []; }
function saveReminders(list){ try{ fs.writeFileSync(REMINDER_FILE, JSON.stringify(list)); }catch(e){} }
function addReminder(phone, type){ const list = loadReminders(); list.push({ phone, type, claimedAt: Date.now(), sent1h:false, sent24h:false, sent48h:false, sent72h:false }); saveReminders(list); }

async function checkReminders(){
  let list = loadReminders(); let changed=false; const now=Date.now();
  for(let r of list){
    const diffH = (now - r.claimedAt)/(1000*60*60);
    if(!r.sent1h && diffH>=1){
      await sendImage(r.phone, ASSETS.posters.freeRecharge, `⏰ *Your free recharge going to expire*\n\n33 Rupees Recharge - 24hr Unlimited Trips\nActivate now:\n${ASSETS.apps.driver}`);
      r.sent1h=true; changed=true;
    }
    if(!r.sent24h && diffH>=24){ await sendText(r.phone,`🔔 *Re-activate discount*\nYour FREE recharge pending:\n${ASSETS.apps.driver}`); r.sent24h=true; changed=true; }
    if(!r.sent48h && diffH>=48){ await sendText(r.phone,`💬 *Need help to verify?*\nTeam can help:\n${ASSETS.apps.driver}`); r.sent48h=true; changed=true; }
    if(!r.sent72h && diffH>=72){ await sendText(r.phone,`😔 *Free recharge expired*\nStill join:\n${ASSETS.apps.driver}`); r.sent72h=true; changed=true; }
  }
  if(changed) saveReminders(list.filter(r=>!r.sent72h));
}
setInterval(checkReminders, 5*60*1000);

function getOppName(id){
  const map={ opp_1:"District Franchisee (10L > 15L)", opp_2:"Corporation Franchisee (5L)", opp_3:"Municipality Franchisee (4L)", opp_4:"Taxi Center (1L)", opp_5:"Directory Center (1L)" };
  return map[id]||id;
}
function getOppFeeCard(id){
  const cards={
    opp_1: `━━━━━━━━━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n💰 ₹10L > ₹15L Investment\n📍 Full District Rights\n👑 1 District = 1 Franchisee\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_2: `━━━━━━━━━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n💰 ₹5L Only\n📍 Corporation Rights\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_3: `━━━━━━━━━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n💰 ₹4L Only\n📍 Municipality Rights\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_4: `━━━━━━━━━━━━━━━━━━━━━━\n🚕 *TAXI CENTER*\n💰 ₹1L Only\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_5: `━━━━━━━━━━━━━━━━━━━━━━\n📖 *DIRECTORY CENTER*\n💰 ₹1L Only\n━━━━━━━━━━━━━━━━━━━━━━`
  };
  return cards[id]||"";
}

app.get('/webhook',(req,res)=>{ if(req.query['hub.verify_token']===VERIFY_TOKEN) res.send(req.query['hub.challenge']); else res.sendStatus(403); });
app.get('/',(req,res)=>res.send('Bizmapia Bot - All Tabs Fixed ✅'));

app.post('/webhook', async (req,res)=>{
  try{
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg) return res.sendStatus(200);
    if(processedIds.has(msg.id)) return res.sendStatus(200);
    processedIds.add(msg.id);
    if(processedIds.size > 1000) processedIds.clear();

    const from = msg.from;
    // FIX: Keep original ID lowercase, don't uppercase everything
    let rawId = msg.type==="interactive"? (msg.interactive.button_reply?.id || msg.interactive.list_reply?.id || "") : (msg.text?.body?.trim() || "");
    let input = rawId.toLowerCase(); // for menu matching
    let inputUpper = rawId.toUpperCase(); // for OPP codes
    const rawText = msg.text?.body || "";
    const s = getSession(from);

    // ===== FORM FLOW =====
    if(s.stage==="FORM_NAME"){
      s.form.name = rawText; s.stage="FORM_CONTACT";
      await sendText(from, `Thanks ${rawText} 🙏\n\n*Contact number :-*\nEnter mobile number:`);
      return res.sendStatus(200);
    }
    if(s.stage==="FORM_CONTACT"){ s.form.contact = rawText; s.stage="FORM_PLACE"; await sendText(from, `*Place :-*\nEnter place / city:`); return res.sendStatus(200); }
    if(s.stage==="FORM_PLACE"){
      s.form.place = rawText; s.stage="FORM_OCCUPATION";
      await sendList(from, "*Current occupation :-*\nSelect:", "Select Occupation", [{title:"Occupation", rows:[
        {id:"occ_running", title:"Running business"}, {id:"occ_planning", title:"Planning to start"}, {id:"occ_employee", title:"Employee"}, {id:"occ_partner", title:"Business Partner"}, {id:"occ_nri", title:"NRI"}, {id:"occ_retired", title:"Retired"}
      ]}]);
      return res.sendStatus(200);
    }
    if(s.stage==="FORM_OCCUPATION"){
      if(input.startsWith("occ_")){ const m={occ_running:"Running business",occ_planning:"Planning to start",occ_employee:"Employee",occ_partner:"Business Partner",occ_nri:"NRI",occ_retired:"Retired"}; s.form.occupation = m[input]||input; }
      else s.form.occupation = rawText;
      console.log(`CRM_LEAD | ${from} | ${s.lastOpp} | ${s.form.name} | ${s.form.contact} | ${s.form.place} | ${s.form.occupation}`);
      await sendImage(from, ASSETS.posters.welcome, `✅ Thank you ${s.form.name}!\nYour enquiry for ${getOppName(s.lastOpp)} received!\nOur team will contact within 24h 🙏`);
      s.stage="MENU"; s.form={}; s.lastOpp="";
      await sendButtons(from,"Explore more?",[{id:"view_opp_levels",title:"View Opportunities"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(s.stage==="BUSINESS_DATA"){
      console.log(`CRM_LEAD | ${from} | Business | ${rawText}`);
      await sendImage(from, ASSETS.posters.welcome, "✅ Business Details Received! Team will contact soon 🙏\n\nYearly Plan saves up to ₹598!");
      s.stage="MENU"; s.lastOpp="";
      await sendButtons(from,"What next?",[{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }

    // ===== NEW USER =====
    if(s.stage==="NEW" || ["hi","hello","hey","hlo","start","hai"].includes(input)){
      s.stage="LANG"; s.form={}; s.lastOpp="";
      await sendImage(from, ASSETS.posters.welcome, "👋 Welcome to Bizmapia! Your Success, Our Platform 🙏\n\nThank you for reaching out! We are happy to connect with you.");
      await new Promise(r=>setTimeout(r,800));
      await sendButtons(from,"Select language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക",[{id:"lang_en",title:"English"},{id:"lang_hi",title:"Hindi"},{id:"lang_ml",title:"Malayalam"}]);
      return res.sendStatus(200);
    }
    if(s.stage==="LANG" || input.startsWith("lang_")){
      if(input.includes("en")) s.lang="EN"; else if(input.includes("hi")) s.lang="HI"; else if(input.includes("ml")) s.lang="ML";
      s.stage="MENU";
      const menuText = s.lang==="ML"? "നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?" : s.lang==="HI"? "आप क्या जानना चाहते हैं?" : "What would you like to know?";
      await sendList(from, menuText, "Main Menu", [{title:"Menu",rows:[
        {id:"customer",title:"Customer",description:"Find a cab or business"},
        {id:"driver",title:"Driver",description:"Join & earn"},
        {id:"business",title:"Business",description:"Register shop"},
        {id:"opportunity",title:"Opportunities Franchise",description:"Franchise Levels"}
      ]}]);
      return res.sendStatus(200);
    }

    // ===== MAIN TABS - FIXED WITH LOWERCASE MATCHING =====
    if(input==="customer"){
      // IMAGE IN CORRECT POSITION - HD quality, with caption
      await sendImage(from, ASSETS.posters.customer, "🚕 *CUSTOMER - Find a cab or business*\n✅ Taxi ✅ Delivery ✅ Business Offers\nAll India Service");
      await new Promise(r=>setTimeout(r,800));
      await sendText(from, `📲 *Download Customer App:*\n${ASSETS.apps.customer}\n\nBook a ride easily & travel with confidence.`);
      await sendButtons(from,"Choose:",[{id:"activate",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="activate"){
      await sendText(from,`✅ *Offer Activated!*\nOpen app:\n📲 ${ASSETS.apps.customer}`);
      if(custTimers[from]) clearTimeout(custTimers[from]);
      custTimers[from]=setTimeout(async()=>{ await sendText(from,`⏰ *Reminder: Activate your trip discount*\n${ASSETS.apps.customer}`); },5*60*1000);
      return res.sendStatus(200);
    }
    if(input==="driver"){
      await sendImage(from, ASSETS.posters.driver, "🚕 *DRIVER - Join & Earn Daily!*\nAuto Rs.33 / Car Rs.49\n✅ Benefit free recharge by listing your vehicle");
      await new Promise(r=>setTimeout(r,800));
      await sendText(from,`🚕 *Benefit free recharge by listing your vehicle*\n📲 Download Driver App:\n${ASSETS.apps.driver}`);
      await sendButtons(from,"Claim your free recharge:",[{id:"driver_benefit",title:"Free Recharge"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="driver_benefit"){
      await sendImage(from, ASSETS.posters.freeRecharge, "🎉 *FREE Recharge Benefit!*\nകേരളത്തിലെ ഏത് ടൗണിലും 33 രൂപ റീച്ചാർജ്ജിൽ 24 മണിക്കൂർ unlimited trips\nDaily Plans + Incentive 100KM Rs.200/250");
      await new Promise(r=>setTimeout(r,800));
      await sendText(from,`✅ *Benefit free recharge by listing your vehicle*\n📲 Get FREE Recharge:\n${ASSETS.apps.driver}\n\nLogin -> Add Driver & Vehicle -> TEST RUN`);
      await sendButtons(from,"Claim:",[{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="driver_claim"){
      await sendText(from,`✅ *Your free recharge going to activate, keep your vehicle verified and ready to accept trip*\n📲 ${ASSETS.apps.driver}`);
      addReminder(from,"Driver_FreeRecharge");
      s.stage="MENU";
      return res.sendStatus(200);
    }
    if(input==="business"){
      await sendImage(from, ASSETS.posters.business, "🏪 *BUSINESS REGISTRATION - All India*\nGet More Local Visibility | More Customers | Higher Sales");
      await new Promise(r=>setTimeout(r,800));
      await sendButtons(from,"Register your business",[{id:"business_list",title:"How to List"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="business_list"){
      await sendImage(from, ASSETS.posters.businessBenefit, "🎉 *Benefit 1 Year Subscription and Get Discount*\nBasic ₹999/yr Save ₹198 | Silver ₹1999/yr Save ₹398 | Golden ₹2999/yr Save ₹598\nKey Benefits: Local Visibility, Customer Search, Grow Business, Build Trust");
      await new Promise(r=>setTimeout(r,1000));
      await sendText(from,"📝 *Send business details in ONE message:*\n\nShop Name:\nMobile:\nCategory:\nLocation:\n\nExample: My Shop, 9876543210, Grocery, Kollam");
      s.stage="BUSINESS_DATA"; s.lastOpp="Business";
      return res.sendStatus(200);
    }

    // ===== OPPORTUNITY - FIXED =====
    if(["opportunity","opportunities_franchise","view_opp_levels","opp_search"].includes(input)){
      await sendImage(from, ASSETS.posters.opportunity, "💼 *4 Business Opportunities Under One Brand - Bizmapia*\nGrow Your Business And Build A Successful Future\nHigh Returns & Complete Support!");
      await new Promise(r=>setTimeout(r,800));
      await sendText(from,`🎥 Want to know about Bizmapia? Watch:\n${ASSETS.videos.main_opp}`);
      await new Promise(r=>setTimeout(r,800));
      await sendList(from,"💰 *Select franchisee level with Investment to know more:*", "View Opportunities", [{title:"All Opportunities With Fee",rows:[
        {id:"opp_1",title:"District Franchisee",description:"💰 10L > 15L"},
        {id:"opp_2",title:"Corporation Franchisee",description:"💰 5L"},
        {id:"opp_3",title:"Municipality Franchisee",description:"💰 4L"},
        {id:"opp_4",title:"Business Center - Online Taxi",description:"💰 1L"},
        {id:"opp_5",title:"Business Center - Business Directory",description:"💰 1L"}
      ]}]);
      await new Promise(r=>setTimeout(r,1200));
      await sendButtons(from,"👇 If list not visible, select:",[{id:"opp_1", title:"District (10L>15L)"},{id:"opp_2", title:"Corporation (5L)"},{id:"opp_3", title:"Municipality (4L)"}]);
      await new Promise(r=>setTimeout(r,800));
      await sendButtons(from,"More Opportunities:",[{id:"opp_4", title:"Taxi Center (1L)"},{id:"opp_5", title:"Directory (1L)"},{id:"menu", title:"Main Menu"}]);
      return res.sendStatus(200);
    }

    if(["opp_1","opp_2","opp_3","opp_4","opp_5"].includes(input)){
      s.lastOpp = inputUpper;
      await sendImage(from, ASSETS.posters.opportunity, `💼 *${getOppName(input)}* - Bizmapia Franchisee`);
      await new Promise(r=>setTimeout(r,800));
      await sendText(from, getOppFeeCard(input));
      await new Promise(r=>setTimeout(r,800));
      await sendText(from,`🎥 *${getOppName(input)} - Watch full awareness:*\n${ASSETS.videos[input]}\n\nWatch to understand investment, income & infrastructure.`);
      if(oppTimers[from]) clearTimeout(oppTimers[from]);
      oppTimers[from]=setTimeout(async()=>{
        await sendButtons(from,`⏰ *You want to grab this opportunity?*\nYou viewed ${getOppName(input)} 5 mins ago.`, [{id:"opp_yes", title:"Yes"}, {id:"opp_no", title:"No"}, {id:"opp_search", title:"Search Other"}]);
      },5*60*1000);
      await new Promise(r=>setTimeout(r,800));
      await sendButtons(from,"You want to grab this opportunity?",[{id:"opp_yes", title:"Yes"},{id:"opp_no", title:"No"},{id:"opp_search", title:"Search Other"}]);
      return res.sendStatus(200);
    }

    if(input==="opp_yes"){
      if(oppTimers[from]) clearTimeout(oppTimers[from]);
      s.stage="FORM_NAME"; s.form={};
      await sendText(from, `Great! You want to grab this opportunity 🎉\n\n*${getOppName(s.lastOpp.toLowerCase())}*\n\n*Name :-*\nEnter your full name:`);
      return res.sendStatus(200);
    }
    if(input==="opp_no"){
      if(oppTimers[from]) clearTimeout(oppTimers[from]);
      await sendText(from, `You are opted out 🙏\nType *HI* to start again.\nThank you for contacting Bizmapia!`);
      s.stage="NEW"; return res.sendStatus(200);
    }

    if(input==="menu" || input==="view_opp_levels"){
      s.stage="MENU";
      const menuText = s.lang==="ML"? "നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?" : s.lang==="HI"? "आप क्या जानना चाहते हैं?" : "What would you like to know?";
      await sendList(from, menuText,"Main Menu",[{title:"Menu",rows:[{id:"customer",title:"Customer"},{id:"driver",title:"Driver"},{id:"business",title:"Business"},{id:"opportunity",title:"Opportunities"}]}]);
      return res.sendStatus(200);
    }

    // If in MENU and random text, show menu (not loop)
    if(s.stage==="MENU"){
      const menuText = s.lang==="ML"? "ദയവായി മെനുവിൽ നിന്ന് തിരഞ്ഞെടുക്കുക 👇" : s.lang==="HI"? "कृपया मेनू से चुनें 👇" : "Please select from menu below 👇";
      await sendList(from, menuText,"Main Menu",[{title:"Menu",rows:[{id:"customer",title:"Customer"},{id:"driver",title:"Driver"},{id:"business",title:"Business"},{id:"opportunity",title:"Opportunities"}]}]);
      return res.sendStatus(200);
    }

    await sendText(from,"👉 Type *HI* to Start Again 🙏");
    res.sendStatus(200);
  }catch(err){ console.log(err); res.sendStatus(200); }
});

app.listen(PORT,()=>console.log(`Bizmapia Bot Running - All Tabs Fixed on ${PORT}`));
