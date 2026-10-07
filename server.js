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

// ===== 7 POSTERS - ALL 1080x1080 FIXED BY ME - REPLACE WITH YOUR NEW IMGBB LINKS =====
const ASSETS = {
  posters: {
    welcome: "https://i.ibb.co/FbptYg3F/welcome.jpg", // 1
    customer: "https://i.ibb.co/3XsWd3p/customer.jpg", // 2
    driver: "https://i.ibb.co/2153CSjp/driver.jpg", // 3
    business: "https://i.ibb.co/3yjrdVxk/business.jpg", // 4
    opportunity: "https://i.ibb.co/gbPYBbMt/opportunity.jpg", // 5
    freeRecharge: "https://i.ibb.co/LXVpRKQp/free-recharge.jpg", // 6 - Auto 33rs poster
    businessBenefit: "https://i.ibb.co/REPLACE/business-benefit-yearly.jpg" // 7 - Yearly Discount poster - YOU MUST REPLACE THIS ONE
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
const processedIds = new Set(); // LOOP FIX

function getSession(p){ if(!sessions[p]) sessions[p]={lang:"EN",stage:"NEW",lastOpp:"",form:{}}; return sessions[p]; }

async function sendText(to, body){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"text",text:{body}}, {headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ console.log("text err", e.response?.data); } }
async function sendImage(to, link, caption){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"image",image:{link,caption}}, {headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ console.log("img err"); await sendText(to,caption); } }
async function sendButtons(to, body, buttons){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"button",body:{text:body},action:{buttons:buttons.map(b=>({type:"reply",reply:{id:b.id,title:b.title.substring(0,20)}}))}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ await sendText(to,body); } }
async function sendList(to, body, buttonText, sections){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"list",body:{text:body},action:{button:buttonText,sections}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ await sendText(to,body); } }

function loadReminders(){ try{ if(fs.existsSync(REMINDER_FILE)) return JSON.parse(fs.readFileSync(REMINDER_FILE)); }catch(e){} return []; }
function saveReminders(list){ try{ fs.writeFileSync(REMINDER_FILE, JSON.stringify(list)); }catch(e){} }
function addReminder(phone, type){ const list = loadReminders(); list.push({ phone, type, claimedAt: Date.now(), sent1h:false, sent24h:false, sent48h:false, sent72h:false }); saveReminders(list); console.log(`CRM_LEAD | Phone:${phone} | Type:${type}`); }

async function checkReminders(){
  let list = loadReminders(); let changed=false; const now=Date.now();
  for(let r of list){
    const diffH = (now - r.claimedAt)/(1000*60*60);
    if(!r.sent1h && diffH>=1){
      await sendImage(r.phone, ASSETS.posters.freeRecharge, `⏰ *Your free recharge opportunity going to expire*\n\nKerala Town Offer - Only 33 Rupees Recharge - 24hr Unlimited Trips\nActivate before expiry:\n${ASSETS.apps.driver}`);
      r.sent1h=true; changed=true;
    }
    if(!r.sent24h && diffH>=24){ await sendText(r.phone,`🔔 *Re-activate your subscription discount*\nYour FREE recharge is still pending:\n${ASSETS.apps.driver}`); r.sent24h=true; changed=true; }
    if(!r.sent48h && diffH>=48){ await sendText(r.phone,`💬 *Need help to verify?*\nOur team can help you verify driver & vehicle:\n${ASSETS.apps.driver}`); r.sent48h=true; changed=true; }
    if(!r.sent72h && diffH>=72){ await sendText(r.phone,`😔 *Your free recharge opportunity expired*\nBut you can still join Bizmapia Driver:\n${ASSETS.apps.driver}`); r.sent72h=true; changed=true; }
  }
  if(changed) saveReminders(list.filter(r=>!r.sent72h));
}
setInterval(checkReminders, 5*60*1000);

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
function getOppFeeCard(id){
  const cards={
    opp_1: `━━━━━━━━━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹10 Lakhs to ₹15 Lakhs\n📍 *Coverage:* Full District Rights\n👑 *Level:* Highest - 1 District = 1 Franchisee\n💸 *Income:* Highest Income Potential\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_2: `━━━━━━━━━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹5 Lakhs Only\n📍 *Coverage:* Full Corporation Rights\n🏙️ *Level:* Corporation Level\n💸 *Income:* High City Level Income\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_3: `━━━━━━━━━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹4 Lakhs Only\n📍 *Coverage:* Municipality Rights\n🏡 *Level:* Municipality Level\n💸 *Income:* Town Level Income\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_4: `━━━━━━━━━━━━━━━━━━━━━━\n🚕 *BUSINESS CENTER - ONLINE TAXI*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹1 Lakh Only\n📍 *Coverage:* Taxi Business Center\n🚖 *Business:* Online Taxi\n💸 *Income:* Daily Rides Income\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_5: `━━━━━━━━━━━━━━━━━━━━━━\n📖 *BUSINESS CENTER - BUSINESS DIRECTORY*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹1 Lakh Only\n📍 *Coverage:* Business Listing Center\n📚 *Business:* Business Directory\n💸 *Income:* Listing Income\n━━━━━━━━━━━━━━━━━━━━━━`
  };
  return cards[id]||"";
}
function scheduleOppDecision(phone, oppName){
  if(oppTimers[phone]) clearTimeout(oppTimers[phone]);
  oppTimers[phone] = setTimeout(async ()=>{
    await sendText(phone, `⏰ *You want to grab this opportunity?*\n\nYou viewed *${oppName}* 5 mins ago.\nDo you want to proceed?`);
    await sendButtons(phone, "You want to grab this opportunity?", [{id:"opp_yes", title:"Yes"}, {id:"opp_no", title:"No"}, {id:"opp_search", title:"Search Other"}]);
  }, 5*60*1000);
}

app.get('/webhook',(req,res)=>{ if(req.query['hub.verify_token']===VERIFY_TOKEN) res.send(req.query['hub.challenge']); else res.sendStatus(403); });
app.get('/check-reminders', async (req,res)=>{ await checkReminders(); res.send('Checked'); });
app.get('/',(req,res)=>res.send('Bizmapia Bot Final 7 Posters - All Fixed ✅'));

app.post('/webhook', async (req,res)=>{
  try{
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg) return res.sendStatus(200);
    if(processedIds.has(msg.id)) return res.sendStatus(200); // LOOP FIX - ignore duplicate
    processedIds.add(msg.id);
    if(processedIds.size > 1000) processedIds.clear();

    const from = msg.from;
    let input = msg.type==="interactive"? (msg.interactive.button_reply?.id || msg.interactive.list_reply?.id || "") : (msg.text?.body?.trim().toUpperCase() || "");
    const rawText = msg.text?.body || "";
    const s = getSession(from);

    if(input.includes("OPP") && custTimers[from]){ clearTimeout(custTimers[from]); delete custTimers[from]; }

    // === FORM FLOW ===
    if(s.stage==="FORM_NAME"){
      if(!rawText || rawText.length < 2){ await sendText(from, "Please enter valid full name:"); return res.sendStatus(200); }
      s.form.name = rawText; s.stage="FORM_CONTACT";
      await sendText(from, `Thanks ${rawText} 🙏\n\n*Contact number :-*\nPlease enter your mobile number:`);
      return res.sendStatus(200);
    }
    if(s.stage==="FORM_CONTACT"){ s.form.contact = rawText; s.stage="FORM_PLACE"; await sendText(from, `*Place :-*\nPlease enter your place / city:`); return res.sendStatus(200); }
    if(s.stage==="FORM_PLACE"){
      s.form.place = rawText; s.stage="FORM_OCCUPATION";
      await sendList(from, "*Current occupation :-*\nPlease select your occupation:", "Select Occupation", [{title:"Occupation", rows:[
        {id:"occ_running", title:"Running business"}, {id:"occ_planning", title:"Planning to start a business"}, {id:"occ_employee", title:"Employee"}, {id:"occ_partner", title:"Business Partner"}, {id:"occ_nri", title:"NRI"}, {id:"occ_retired", title:"Retired"}
      ]}]);
      return res.sendStatus(200);
    }
    if(s.stage==="FORM_OCCUPATION"){
      if(input.startsWith("OCC_")){ const m={OCC_RUNNING:"Running business",OCC_PLANNING:"Planning to start a business",OCC_EMPLOYEE:"Employee",OCC_PARTNER:"Business Partner",OCC_NRI:"NRI",OCC_RETIRED:"Retired"}; s.form.occupation = m[input]||input; }
      else if(rawText.length > 2){ s.form.occupation = rawText; }
      else { await sendText(from, "Please select occupation from list:"); return res.sendStatus(200); }
      console.log(`CRM_LEAD | Phone:${from} | Type:Franchisee_Lead | Franchise:${s.lastOpp} | Name:${s.form.name} | Contact:${s.form.contact} | Place:${s.form.place} | Occupation:${s.form.occupation}`);
      await sendImage(from, ASSETS.posters.welcome, `✅ Thank you ${s.form.name}!\nYour enquiry for ${getOppName(s.lastOpp)} received!\n\nName: ${s.form.name}\nContact: ${s.form.contact}\nPlace: ${s.form.place}\nOccupation: ${s.form.occupation}\n\nOur team will contact within 24 hours 🙏`);
      s.stage="MENU"; s.form={}; s.lastOpp="";
      await sendButtons(from,"Explore more?",[{id:"view_opp_levels",title:"View Opportunities"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }

    if(s.stage==="BUSINESS_DATA"){
      if(rawText.length > 5){
        console.log(`CRM_LEAD | Phone:${from} | Type:Business | Details:${rawText}`);
        await sendImage(from, ASSETS.posters.welcome, "✅ Business Details Received! Team will contact soon 🙏\n\nYou will get more local visibility with Yearly Plan - Save up to ₹598!");
        s.stage="MENU"; s.lastOpp="";
        await sendButtons(from,"What next?",[{id:"menu",title:"Main Menu"}]);
        return res.sendStatus(200);
      }
    }

    // === NEW + LANGUAGE - ALL 3 LANGUAGES 100% WORKING ===
    if(s.stage==="NEW" || ["HI","HELLO","HEY","HLO","START","HAI"].includes(input)){
      s.stage="LANG"; s.form={}; s.lastOpp="";
      await sendImage(from, ASSETS.posters.welcome, "👋 Welcome to Bizmapia! Your Success, Our Platform 🙏");
      await new Promise(r=>setTimeout(r,800));
      await sendButtons(from,"Select language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക",[{id:"lang_en",title:"English"},{id:"lang_hi",title:"Hindi"},{id:"lang_ml",title:"Malayalam"}]);
      return res.sendStatus(200);
    }
    if(s.stage==="LANG" || input.startsWith("LANG_")){
      if(input.includes("EN")) s.lang="EN"; else if(input.includes("HI")) s.lang="HI"; else if(input.includes("ML")) s.lang="ML";
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

    if(input==="CUSTOMER"){
      await sendImage(from, ASSETS.posters.customer, "Customer - Find a cab or business\n✅ Taxi ✅ Delivery ✅ Offers");
      await sendText(from, `📲 *Download Customer App:*\n${ASSETS.apps.customer}\n\nAll India Taxi & Business Offers`);
      await sendButtons(from,"Choose option:",[{id:"activate",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="ACTIVATE"){
      console.log(`CRM_LEAD | Phone:${from} | Type:Customer_ClaimNow`);
      await sendText(from,`✅ *Offer Activated!*\nOpen app and register:\n📲 ${ASSETS.apps.customer}`);
      if(custTimers[from]) clearTimeout(custTimers[from]);
      custTimers[from]=setTimeout(async()=>{ await sendText(from,`⏰ *Reminder: Activate your trip discount*\nOpen app now:\n${ASSETS.apps.customer}`); },5*60*1000);
      return res.sendStatus(200);
    }
    if(input==="DRIVER"){
      await sendImage(from, ASSETS.posters.driver, "Driver - Join & Earn Daily!\nAuto Rs.33 Car Rs.49\n✅ Benefit free recharge by listing your vehicle");
      await sendText(from,`🚕 *Benefit free recharge by listing your vehicle*\n📲 Download Driver App:\n${ASSETS.apps.driver}`);
      await sendButtons(from,"Claim your free recharge:",[{id:"driver_benefit",title:"Free Recharge"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="DRIVER_BENEFIT"){
      // USING NEW 33rs POSTER HERE
      await sendImage(from, ASSETS.posters.freeRecharge, "🎉 FREE Recharge Benefit!\nകേരളത്തിലെ ഏത് ടൗണിലും കേവലം 33 രൂപ റീച്ചാർജ്ജിൽ 24 മണിക്കൂർ പരിധിയില്ലാത്ത ട്രിപ്പുകൾ നേടൂ\nDaily Charging Plans + Incentive 100KM for Rs.200/250\nAvailable in all towns in INDIA");
      await sendText(from,`✅ *Benefit free recharge by listing your vehicle*\n📲 Get FREE Recharge:\n${ASSETS.apps.driver}\n\nDOWNLOAD APP NOW - Login & Add Vehicle -> TEST RUN`);
      await sendButtons(from,"Claim:",[{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="DRIVER_CLAIM"){
      await sendText(from,`✅ *Your free recharge going to activate on your account, keep your vehicle verified and ready to accept trip*\n📲 ${ASSETS.apps.driver}\n\n1. Register vehicle\n2. Upload RC & License\n3. Verify`);
      addReminder(from,"Driver_FreeRecharge");
      s.stage="MENU";
      return res.sendStatus(200);
    }
    if(input==="BUSINESS"){
      await sendImage(from, ASSETS.posters.business, "Business Registration - All India");
      await sendButtons(from,"Register your business",[{id:"business_list",title:"How to List"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="BUSINESS_LIST"){
      // USING NEW YEARLY BENEFIT POSTER HERE FOR ENCOURAGEMENT
      await sendImage(from, ASSETS.posters.businessBenefit, "🎉 Benefit 1 Year Subscription and Get Discount\nBasic Monthly ₹99/- Yearly ₹999/- Save ₹198 | Silver Monthly ₹199/- Yearly ₹1999/- Save ₹398 | Golden Monthly ₹299/- Yearly ₹2999/- Save ₹598\nKey Benefits: Get More Local Visibility, Customer Search, Grow Your Business, Build Trust, Advertise Your Business Locally as posters and videos");
      await new Promise(r=>setTimeout(r,1000));
      await sendText(from,"📝 *Send your business details in ONE message:*\n\nShop Name:\nMobile:\nCategory:\nLocation:\n\nExample:\nMy Shop, 9876543210, Grocery, Kollam");
      s.stage="BUSINESS_DATA"; s.lastOpp="Business";
      return res.sendStatus(200);
    }

    if(input==="OPPORTUNITY" || input==="OPPORTUNITIES_FRANCHISE" || input==="VIEW_OPP_LEVELS" || input==="OPP_SEARCH"){
      await sendImage(from, ASSETS.posters.opportunity, "4 Business Opportunities Under One Brand - Bizmapia\nGrow Your Business And Build A Successful Future\nHigh Returns & Complete Support!");
      await new Promise(r=>setTimeout(r,1000));
      await sendText(from,`Want to know about Bizmapia company? Click the video link here 👇\n\n🎥 ${ASSETS.videos.main_opp}`);
      await new Promise(r=>setTimeout(r,1000));
      await sendList(from,"💰 *Select your franchisee level with Investment to know more:*", "View Opportunities", [{title:"All Opportunities With Fee",rows:[
        {id:"opp_1",title:"District Franchisee",description:"💰 10L > 15L Investment"},
        {id:"opp_2",title:"Corporation Franchisee",description:"💰 5L Investment"},
        {id:"opp_3",title:"Municipality Franchisee",description:"💰 4L Investment"},
        {id:"opp_4",title:"Business Center - Online Taxi",description:"💰 1L Investment"},
        {id:"opp_5",title:"Business Center - Business Directory",description:"💰 1L Investment"}
      ]}]);
      await new Promise(r=>setTimeout(r,1500));
      await sendButtons(from,"👇 *If above list not visible, select opportunity directly:*",[
        {id:"opp_1", title:"District (10L>15L)"},
        {id:"opp_2", title:"Corporation (5L)"},
        {id:"opp_3", title:"Municipality (4L)"}
      ]);
      await new Promise(r=>setTimeout(r,800));
      await sendButtons(from,"More Opportunities - Select any one to proceed further:",[
        {id:"opp_4", title:"Taxi Center (1L)"},
        {id:"opp_5", title:"Directory (1L)"},
        {id:"menu", title:"Main Menu"}
      ]);
      return res.sendStatus(200);
    }

    if(["OPP_1","OPP_2","OPP_3","OPP_4","OPP_5"].includes(input)){
      s.lastOpp = input;
      await sendImage(from, ASSETS.posters.opportunity, `${getOppName(input)} - Bizmapia`);
      await new Promise(r=>setTimeout(r,800));
      await sendText(from, getOppFeeCard(input));
      await new Promise(r=>setTimeout(r,800));
      await sendText(from,`🎥 *${getOppName(input)} - Watch to get full awareness:*\n${ASSETS.videos[input.toLowerCase()]}\n\nWatch full video to understand investment, income & infrastructure.`);
      scheduleOppDecision(from, getOppName(input));
      await new Promise(r=>setTimeout(r,800));
      await sendButtons(from,"You want to grab this opportunity?",[
        {id:"opp_yes", title:"Yes"},
        {id:"opp_no", title:"No"},
        {id:"opp_search", title:"Search Other"}
      ]);
      return res.sendStatus(200);
    }

    if(input==="OPP_YES"){
      if(oppTimers[from]) clearTimeout(oppTimers[from]);
      s.stage="FORM_NAME"; s.form={};
      await sendText(from, `Great! You want to grab this opportunity 🎉\n\n*${getOppName(s.lastOpp)}*\n\n*Name :-*\nEnter your full name:`);
      return res.sendStatus(200);
    }
    if(input==="OPP_NO"){
      if(oppTimers[from]) clearTimeout(oppTimers[from]);
      console.log(`CRM_LEAD | Phone:${from} | Type:Opted_Out | Franchise:${s.lastOpp}`);
      await sendText(from, `You are successfully opt out from our business enquiry 🙏\n\nIf you change mind, type *HI* to start again.\n\nThank you for contacting Bizmapia!`);
      s.stage="NEW"; return res.sendStatus(200);
    }

    if(input==="MENU"){
      s.stage="MENU";
      const menuText = s.lang==="ML"? "നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?" : s.lang==="HI"? "आप क्या जानना चाहते हैं?" : "What would you like to know?";
      await sendList(from, menuText,"Main Menu",[{title:"Menu",rows:[
        {id:"customer",title:"Customer"},{id:"driver",title:"Driver"},{id:"business",title:"Business"},{id:"opportunity",title:"Opportunities"}
      ]}]);
      return res.sendStatus(200);
    }

    // LOOP FIX - if in MENU and random text, show menu again
    if(s.stage==="MENU"){
      const menuText = s.lang==="ML"? "ദയവായി മെനുവിൽ നിന്ന് തിരഞ്ഞെടുക്കുക 👇" : s.lang==="HI"? "कृपया मेनू से चुनें 👇" : "Please select from menu below 👇";
      await sendList(from, menuText,"Main Menu",[{title:"Menu",rows:[{id:"customer",title:"Customer"},{id:"driver",title:"Driver"},{id:"business",title:"Business"},{id:"opportunity",title:"Opportunities"}]}]);
      return res.sendStatus(200);
    }

    await sendText(from,"━━━━━━━━━━━━━━━\n🔄 *RESTART MENU*\n👉 Type *HI* to Start Again 👈\n━━━━━━━━━━━━━━━\n\nJust send *Hi* 🙏");
    res.sendStatus(200);
  }catch(err){ console.log(err); res.sendStatus(200); }
});

app.listen(PORT,()=>console.log(`Bizmapia Bot Running on ${PORT} - 7 Posters Loop Fixed`));
