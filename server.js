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
const oppTimers = {};
function getSession(p){ if(!sessions[p]) sessions[p]={lang:"EN",stage:"NEW",lastOpp:"",form:{}}; return sessions[p]; }

async function sendText(to, body){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"text",text:{body}}, {headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){} }
async function sendImage(to, link, caption){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"image",image:{link,caption}}, {headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ await sendText(to,caption); } }
async function sendButtons(to, body, buttons){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"button",body:{text:body},action:{buttons:buttons.map(b=>({type:"reply",reply:{id:b.id,title:b.title.substring(0,20)}}))}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ await sendText(to,body); } }
async function sendList(to, body, buttonText, sections){ try{ await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"list",body:{text:body},action:{button:buttonText,sections}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){ await sendText(to,body); } }

function loadReminders(){ try{ if(fs.existsSync(REMINDER_FILE)) return JSON.parse(fs.readFileSync(REMINDER_FILE)); }catch(e){} return []; }
function saveReminders(list){ try{ fs.writeFileSync(REMINDER_FILE, JSON.stringify(list)); }catch(e){} }
function addReminder(phone, type){
  const list = loadReminders();
  list.push({ phone, type, claimedAt: Date.now(), sent1h:false, sent24h:false, sent48h:false, sent72h:false });
  saveReminders(list);
}
async function checkReminders(){
  let list = loadReminders(); let changed=false; const now=Date.now();
  for(let r of list){
    const diffH = (now - r.claimedAt)/(1000*60*60);
    if(!r.sent1h && diffH>=1){ await sendText(r.phone,`⏰ *Your free recharge opportunity going to expire*\n${ASSETS.apps.driver}`); r.sent1h=true; changed=true; }
    if(!r.sent24h && diffH>=24){ await sendText(r.phone,`🔔 *Re-activate your subscription discount*\n${ASSETS.apps.driver}`); r.sent24h=true; changed=true; }
    if(!r.sent48h && diffH>=48){ await sendText(r.phone,`💬 *Need help to verify?*\n${ASSETS.apps.driver}`); r.sent48h=true; changed=true; }
    if(!r.sent72h && diffH>=72){ await sendText(r.phone,`😔 *Your free recharge opportunity expired*\n${ASSETS.apps.driver}`); r.sent72h=true; changed=true; }
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
    opp_1: `━━━━━━━━━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹10 Lakhs to ₹15 Lakhs\n📍 *Coverage:* Full District Rights\n👑 *Level:* Highest Level - 1 District = 1 Franchisee\n💸 *Income:* Highest Income Potential\n👥 *Team:* Full district team under you\n✅ *Best For:* High Investment Entrepreneurs\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_2: `━━━━━━━━━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹5 Lakhs Only\n📍 *Coverage:* Full Corporation Rights\n🏙️ *Level:* Corporation Level\n💸 *Income:* High Income - City Level Business\n👥 *Team:* Corporation team\n✅ *Best For:* City Level Entrepreneurs\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_3: `━━━━━━━━━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹4 Lakhs Only\n📍 *Coverage:* Municipality Rights\n🏡 *Level:* Municipality Level\n💸 *Income:* Good Income - Town Level\n👥 *Team:* Municipality team\n✅ *Best For:* Small Town Investors\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_4: `━━━━━━━━━━━━━━━━━━━━━━\n🚕 *BUSINESS CENTER - ONLINE TAXI*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹1 Lakh Only\n📍 *Coverage:* Taxi Business Center\n🚖 *Level:* Online Taxi Business\n💸 *Income:* Daily Income from Rides\n👥 *Team:* Drivers under you\n✅ *Best For:* Low Investment - Taxi Business\n━━━━━━━━━━━━━━━━━━━━━━`,
    opp_5: `━━━━━━━━━━━━━━━━━━━━━━\n📖 *BUSINESS CENTER - BUSINESS DIRECTORY*\n━━━━━━━━━━━━━━━━━━━━━━\n💰 *Investment:* ₹1 Lakh Only\n📍 *Coverage:* Business Listing Center\n📚 *Level:* Business Directory\n💸 *Income:* Income from Business Listings\n👥 *Team:* Businesses under you\n✅ *Best For:* Low Investment - Listing Business\n━━━━━━━━━━━━━━━━━━━━━━`
  };
  return cards[id]||"";
}

function scheduleOppDecision(phone, oppName){
  if(oppTimers[phone]) clearTimeout(oppTimers[phone]);
  oppTimers[phone] = setTimeout(async ()=>{
    await sendText(phone, `⏰ *Reminder: You want to grab this opportunity?*\n\nYou viewed *${oppName}* 5 minutes ago.\nDo you want to proceed with Bizmapia franchisee?`);
    await sendButtons(phone, "You want to grab this opportunity?", [
      {id:"opp_yes", title:"Yes"},
      {id:"opp_no", title:"No"},
      {id:"opp_search", title:"Search Other"}
    ]);
  }, 5*60*1000);
}

app.get('/webhook',(req,res)=>{ if(req.query['hub.verify_token']===VERIFY_TOKEN) res.send(req.query['hub.challenge']); else res.sendStatus(403); });
app.get('/check-reminders', async (req,res)=>{ await checkReminders(); res.send('Checked'); });
app.get('/',(req,res)=>res.send('Bizmapia Final Fee Structure ✅'));

app.post('/webhook', async (req,res)=>{
  try{
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg) return res.sendStatus(200);
    const from = msg.from;
    let input = msg.type==="interactive"? (msg.interactive.button_reply?.id || msg.interactive.list_reply?.id || "") : (msg.text?.body?.trim().toUpperCase() || "");
    const rawText = msg.text?.body || "";
    const s = getSession(from);

    if(s.stage==="FORM_NAME"){
      s.form.name = rawText; s.stage="FORM_CONTACT";
      await sendText(from, `Thanks ${rawText} 🙏\n\n*Contact number :-*\nPlease enter your mobile number:`);
      return res.sendStatus(200);
    }
    if(s.stage==="FORM_CONTACT"){
      s.form.contact = rawText; s.stage="FORM_PLACE";
      await sendText(from, `*Place :-*\nPlease enter your place / city:`);
      return res.sendStatus(200);
    }
    if(s.stage==="FORM_PLACE"){
      s.form.place = rawText; s.stage="FORM_OCCUPATION";
      await sendList(from, "*Current occupation :-*\nPlease select your occupation:", "Select Occupation", [{title:"Occupation", rows:[
        {id:"occ_running", title:"Running business"},
        {id:"occ_planning", title:"Planning to start a business"},
        {id:"occ_employee", title:"Employee"},
        {id:"occ_partner", title:"Business Partner"},
        {id:"occ_nri", title:"NRI"},
        {id:"occ_retired", title:"Retired"}
      ]}]);
      return res.sendStatus(200);
    }
    if(s.stage==="FORM_OCCUPATION" || input.startsWith("occ_")){
      if(input.startsWith("occ_")){
        const occMap={occ_running:"Running business",occ_planning:"Planning to start a business",occ_employee:"Employee",occ_partner:"Business Partner",occ_nri:"NRI",occ_retired:"Retired"};
        s.form.occupation = occMap[input] || input;
      } else { s.form.occupation = rawText; }
      console.log(`CRM_LEAD | Phone:${from} | Type:Franchisee_Lead | Franchise:${s.lastOpp} | Name:${s.form.name} | Contact:${s.form.contact} | Place:${s.form.place} | Occupation:${s.form.occupation}`);
      await sendImage(from, ASSETS.posters.welcome, `✅ Thank you ${s.form.name}!\nYour enquiry for ${getOppName(s.lastOpp)} received!\n\nName: ${s.form.name}\nContact: ${s.form.contact}\nPlace: ${s.form.place}\nOccupation: ${s.form.occupation}\n\nOur team will contact you within 24 hours 🙏`);
      s.stage="MENU"; s.form={};
      await sendButtons(from,"Explore more?",[{id:"view_opp_levels",title:"View Opportunities"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }

    if(s.stage==="DATA" && rawText.length>3 &&!input.startsWith("opp_") &&!input.startsWith("occ_") &&!["menu","view_opp_levels","opp_yes","opp_no","opp_search","driver_benefit","driver_claim","activate","business_list","customer","driver","business","opportunity"].includes(input)){
      console.log(`CRM_LEAD | Phone:${from} | Type:${s.lastOpp || "General"} | Details:${rawText}`);
      await sendImage(from, ASSETS.posters.welcome, "✅ Details Received! Team will contact soon 🙏");
      s.stage="MENU";
      await sendButtons(from,"Explore more?",[{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }

    if(s.stage==="NEW" || ["HI","HELLO","HEY","HLO","START","HAI"].includes(input)){
      s.stage="LANG";
      await sendImage(from, ASSETS.posters.welcome, "👋 Welcome to Bizmapia! Your Success, Our Platform 🙏");
      await sendButtons(from,"Select language",[{id:"lang_en",title:"English"},{id:"lang_hi",title:"Hindi"},{id:"lang_ml",title:"Malayalam"}]);
      return res.sendStatus(200);
    }
    if(s.stage==="LANG" || input.startsWith("lang_")){
      if(input.includes("en")) s.lang="EN"; else if(input.includes("hi")) s.lang="HI"; else if(input.includes("ml")) s.lang="ML";
      s.stage="MENU";
      await sendList(from, "What would you like to know?", "Main Menu", [{title:"Menu",rows:[
        {id:"customer",title:"Customer"},{id:"driver",title:"Driver"},{id:"business",title:"Business"},{id:"opportunity",title:"Opportunities Franchise"}
      ]}]);
      return res.sendStatus(200);
    }

    if(input==="customer"){
      await sendImage(from, ASSETS.posters.customer, "Customer - Find a cab or business");
      await sendText(from, `📲 *Download Customer App:*\n${ASSETS.apps.customer}`);
      await sendButtons(from,"Choose:",[{id:"activate",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="activate"){
      console.log(`CRM_LEAD | Phone:${from} | Type:Customer_ClaimNow`);
      await sendText(from,`✅ *Offer Activated!*\n📲 ${ASSETS.apps.customer}`);
      return res.sendStatus(200);
    }
    if(input==="driver"){
      await sendImage(from, ASSETS.posters.driver, "Driver - Join & Earn Daily! Rs.33 / Rs.49");
      await sendText(from,`🚕 *Benefit free recharge by listing your vehicle*\n📲 ${ASSETS.apps.driver}`);
      await sendButtons(from,"Claim:",[{id:"driver_benefit",title:"Free Recharge"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="driver_benefit"){
      await sendImage(from, ASSETS.posters.freeRecharge, "🎉 FREE Recharge Benefit!");
      await sendText(from,`📲 Get FREE Recharge:\n${ASSETS.apps.driver}`);
      await sendButtons(from,"Claim:",[{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="driver_claim"){
      await sendText(from,`✅ *Your free recharge going to activate on your account, keep your vehicle verified and ready to accept trip*\n📲 ${ASSETS.apps.driver}`);
      addReminder(from,"Driver_FreeRecharge");
      return res.sendStatus(200);
    }
    if(input==="business"){
      await sendImage(from, ASSETS.posters.business, "Business Registration");
      await sendButtons(from,"Register shop",[{id:"business_list",title:"How to List"},{id:"menu",title:"Main Menu"}]);
      return res.sendStatus(200);
    }
    if(input==="business_list"){
      await sendText(from,"Send details:\nShop Name:\nMobile:\nCategory:\nLocation:");
      s.stage="DATA"; s.lastOpp="Business";
      return res.sendStatus(200);
    }

    // OPPORTUNITY MAIN
    if(input==="opportunity" || input==="opportunities_franchise" || input==="view_opp_levels" || input==="opp_search"){
      await sendImage(from, ASSETS.posters.opportunity, "4 Opportunities Under One Brand - Bizmapia Business Opportunities");
      await sendText(from,`Want to know about Bizmapia company? Click the video link here 👇\n\n🎥 ${ASSETS.videos.main_opp}`);

      await sendList(from,"💰 *Select your franchisee level with Investment:*\nChoose to know more:", "View Opportunities", [{title:"All Opportunities With Fee",rows:[
        {id:"opp_1",title:"District Franchisee",description:"💰 10L > 15L Investment"},
        {id:"opp_2",title:"Corporation Franchisee",description:"💰 5L Investment"},
        {id:"opp_3",title:"Municipality Franchisee",description:"💰 4L Investment"},
        {id:"opp_4",title:"Business Center - Online Taxi",description:"💰 1L Investment"},
        {id:"opp_5",title:"Business Center - Business Directory",description:"💰 1L Investment"}
      ]}]);

      setTimeout(async ()=>{
        await sendButtons(from,"👇 *Or click below to select opportunity directly:*",[
          {id:"opp_1", title:"District Franchisee"},
          {id:"opp_2", title:"Corporation"},
          {id:"opp_3", title:"Municipality"}
        ]);
        setTimeout(async ()=>{
          await sendButtons(from,"More Opportunities:",[
            {id:"opp_4", title:"Online Taxi (1L)"},
            {id:"opp_5", title:"Business Directory (1L)"},
            {id:"menu", title:"Main Menu"}
          ]);
        },800);
      },1200);
      return res.sendStatus(200);
    }

    if(input.startsWith("opp_") && ["opp_1","opp_2","opp_3","opp_4","opp_5"].includes(input)){
      s.lastOpp = input;
      const oppName = getOppName(input);
      await sendImage(from, ASSETS.posters.opportunity, `${oppName}`);
      await sendText(from, getOppFeeCard(input));
      await sendText(from,`🎥 *${oppName} - Watch to get full awareness:*\n${ASSETS.videos[input]}\n\n👆 Watch full video to understand investment, income & infrastructure.`);
      scheduleOppDecision(from, oppName);
      await sendButtons(from,"Have you watched the video? You want to grab this opportunity?",[
        {id:"opp_yes", title:"Yes"},
        {id:"opp_no", title:"No"},
        {id:"opp_search", title:"Search Other"}
      ]);
      return res.sendStatus(200);
    }

    if(input==="opp_yes"){
      if(oppTimers[from]) clearTimeout(oppTimers[from]);
      s.stage="FORM_NAME"; s.form={};
      await sendText(from, `Great! You want to grab this opportunity 🎉\n\n*${getOppName(s.lastOpp)}* - Please fill details:\n\n*Name :-*\nEnter your full name:`);
      return res.sendStatus(200);
    }
    if(input==="opp_no"){
      if(oppTimers[from]) clearTimeout(oppTimers[from]);
      console.log(`CRM_LEAD | Phone:${from} | Type:Opted_Out | Franchise:${s.lastOpp}`);
      await sendText(from, `You are successfully opt out from our business enquiry 🙏\n\nIf you change mind, type *HI* to start again.\n\nThank you for contacting Bizmapia!`);
      s.stage="NEW";
      return res.sendStatus(200);
    }
    if(input==="menu"){
      await sendList(from,"What would you like to know?","Main Menu",[{title:"Menu",rows:[
        {id:"customer",title:"Customer"},{id:"driver",title:"Driver"},{id:"business",title:"Business"},{id:"opportunity",title:"Opportunities"}
      ]}]);
      return res.sendStatus(200);
    }

    await sendText(from,"━━━━━━━━━━━━━━━\n🔄 *RESTART MENU*\n👉 Type *HI* to Start Again 👈\n━━━━━━━━━━━━━━━\n\nJust send *Hi* 🙏");
    res.sendStatus(200);
  }catch(err){ res.sendStatus(200); }
});

app.listen(PORT,()=>console.log(`Running ${PORT}`));
