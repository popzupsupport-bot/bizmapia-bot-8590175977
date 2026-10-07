const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const { google } = require('googleapis');
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "bizmapia_verify_2024";
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 10000;
// FIX 1: Support both SHEET_ID and GOOGLE_SHEET_ID env
const SHEET_ID = process.env.GOOGLE_SHEET_ID || process.env.SHEET_ID || process.env.GOOGLE_SHEET_ID_2;
const CONTACT_NUMBER = "85901 75977";
const EMAIL_ID = "bizmapia.com@gmail.com";
const WEBSITE = "www.bizmapia.in";

// FIX 2: In-Memory pending (Render /tmp deletes files)
const pendingChatsMemory = {};

async function getSheetsClient(){
  try{
    let creds=process.env.GOOGLE_CREDENTIALS;
    if(!creds) {
      console.log("NO GOOGLE_CREDENTIALS ENV!");
      return null;
    }
    let credentials=JSON.parse(creds);
    if(credentials.private_key) credentials.private_key=credentials.private_key.replace(/\\n/g,'\n');
    const auth=new google.auth.GoogleAuth({credentials,scopes:['https://www.googleapis.com/auth/spreadsheets']});
    return google.sheets({version:'v4',auth});
  }catch(e){
    console.error("SHEETS CLIENT ERROR:", e.message);
    return null;
  }
}

// FIX 3: REALTIME SHEET MAINTENANCE - 9 COLUMN COMPATIBLE
async function appendToSheet(row){
  try{
    const sheets=await getSheetsClient();
    if(!sheets) return;
    // Always write to A:I (9 cols) to match your current sheet
    // Row: Date | Phone | Type | Details | Name | Contact | Place | Occupation | Lang/Status
    let finalRow = row.slice(0,9); // Ensure only 9 cols
    await sheets.spreadsheets.values.append({
      spreadsheetId:SHEET_ID,
      range:'Sheet1!A:I',
      valueInputOption:'USER_ENTERED',
      requestBody:{values:[finalRow]}
    });
    console.log("SHEET LOG SUCCESS:", finalRow[1], finalRow[2]);
  }catch(e){
    console.error("SHEET LOG FAILED:", e.message, e.response?.data);
  }
}

// FIX 4: logAllChat now 9 cols - REALTIME CHAT TRACKING
async function logAllChat(phone, type, status, lang, stage, extra=''){
  try{
    const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
    // 9 cols: A Date, B Phone, C Type, D Details, E Name, F Contact, G Place, H Job, I Lang/Status/Stage
    const details = `${stage} | ${type} | ${status} | ${extra}`.substring(0,200);
    const langInfo = `${lang} | ${status} | ${stage}`;
    const row=[dateStr, phone, type, details, '', phone, '', stage, langInfo];
    const sheets=await getSheetsClient();
    if(!sheets) return;
    await sheets.spreadsheets.values.append({
      spreadsheetId:SHEET_ID,
      range:'Sheet1!A:I',
      valueInputOption:'USER_ENTERED',
      requestBody:{values:[row]}
    });
    console.log(`GOD MODE REALTIME LOG: ${phone} | ${stage} | ${type}`);
  }catch(e){
    console.error("GOD MODE LOG FAILED:", e.message);
  }
}

const ASSETS={posters:{welcome:"https://files.catbox.moe/zmj6te.jpg",customer:"https://files.catbox.moe/nbjslu.jpg",driver:"https://files.catbox.moe/2trzp7.jpg",business:"https://files.catbox.moe/sylcqa.jpg",opportunity:"https://files.catbox.moe/y8m3lq.jpg",freeRecharge:"https://files.catbox.moe/c03g3q.jpg",businessBenefit:"https://files.catbox.moe/8ayus6.jpg",franchiseBrochure:"https://files.catbox.moe/FRANCHISEE-NEW-BIZMAPIA.jpg",businessBrochure:"https://files.catbox.moe/BUSINESS-NEW-BIZMAPIA.jpg"},apps:{customer:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia",driver:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia_driver"},videos:{main_opp:"https://youtu.be/8ZnDlvbgG_c?si=a5ONBZg6Oe8WuGTP",opp_1:"https://youtu.be/_y2JeFHBnqg?si=igKYEPjGheuARuZe",opp_2:"https://youtu.be/GqolfqgHiCU?si=ySBbc_qLD2mLyBmN",opp_3:"https://youtu.be/GqolfqgHiCU?si=qTxRIIeq7iP5X5Jh",opp_4:"https://youtu.be/r0X77XfmF94?si=XdbPE4Ml2_jkv8zW",opp_5:"https://youtu.be/r0X77XfmF94?si=XdbPE4Ml2_jkv8zW"}};

const LANG_TEXT={EN:{whatToKnow:"What would you like to know?",selectMenu:"Please select from menu below 👇",hiAgain:"👉 Type *HI* to Start Again 🙏",customerH:"🚕 *CUSTOMER - Book a Taxi & Services*",driverH:"🚕 *DRIVER PARTNER - Attach Your Vehicle & Start Earning!*",businessH:"🏪 *BUSINESS OWNER - List Your Business & Get Customers*",oppH:"💼 *FRANCHISE OPPORTUNITY - Own a Franchise in Your Area*",oppSub:"4 Business Opportunities Under One Brand",formName:"*Name :-*\nEnter your full name:",formContact:"*Contact number :-*\nEnter mobile number:",formPlace:"*Place :-*\nEnter place / city:",formOcc:"*Current occupation :-*\nSelect:",yesNoQ:"You want to grab this opportunity?",thanksEnq:"✅ Thank you",team24:"Our team will contact within 24h 🙏"},HI:{whatToKnow:"आप क्या जानना चाहते हैं?",selectMenu:"कृपया नीचे दिए गए मेनू से चुनें 👇",hiAgain:"👉 फिर से शुरू करने के लिए *HI* टाइप करें 🙏",customerH:"🚕 *कस्टमर - टैक्सी और सर्विस बुक करें*",driverH:"🚕 *ड्राइवर पार्टनर - अपनी गाड़ी जोड़ें और कमाना शुरू करें!*",businessH:"🏪 *बिजनेस ओनर - अपना बिजनेस लिस्ट करें और ग्राहक पाएं*",oppH:"💼 *फ्रेंचाइजी अवसर - अपने क्षेत्र में फ्रेंचाइजी लें*",oppSub:"एक ब्रांड के तहत 4 बिजनेस अवसर",formName:"*नाम :-*\nअपना पूरा नाम लिखें:",formContact:"*मोबाइल नंबर :-*\nअपना नंबर लिखें:",formPlace:"*जगह :-*\nअपना शहर लिखें:",formOcc:"*वर्तमान व्यवसाय :-*\nचुनें:",yesNoQ:"क्या आप यह अवसर लेना चाहते हैं?",thanksEnq:"✅ धन्यवाद",team24:"हमारी टीम 24 घंटे में संपर्क करेगी 🙏"},ML:{whatToKnow:"നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?",selectMenu:"ദയവായി താഴെയുള്ള മെനുവിൽ നിന്ന് തിരഞ്ഞെടുക്കുക 👇",hiAgain:"👉 വീണ്ടും ആരംഭിക്കാൻ *HI* ടൈപ്പ് ചെയ്യുക 🙏",customerH:"🚕 *കസ്റ്റമർ - ടാക്സി & സർവീസുകൾ ബുക്ക് ചെയ്യുക*",driverH:"🚕 *ഡ്രൈവർ പാർട്ണർ - വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം നേടൂ!*",businessH:"🏪 *ബിസിനസ് ഓണർ - ബിസിനസ് ലിസ്റ്റ് ചെയ്ത് കസ്റ്റമേഴ്സിനെ നേടൂ*",oppH:"💼 *ഫ്രാഞ്ചൈസി അവസരം - ഏരിയയിൽ ഫ്രാഞ്ചൈസി സ്വന്തമാക്കൂ*",oppSub:"ഒരു ബ്രാൻഡിന് കീഴിൽ 4 ബിസിനസ് അവസരങ്ങൾ",formName:"*പേര് :-*\nനിങ്ങളുടെ പേര് നൽകുക:",formContact:"*ഫോൺ നമ്പർ :-*\nനമ്പർ നൽകുക:",formPlace:"*സ്ഥലം :-*\nനിങ്ങളുടെ സ്ഥലം നൽകുക:",formOcc:"*ജോലി :-*\nതിരഞ്ഞെടുക്കുക:",yesNoQ:"ഈ അവസരം സ്വന്തമാക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",thanksEnq:"✅ നന്ദി",team24:"ടീം 24 മണിക്കൂറിനുള്ളിൽ ബന്ധപ്പെടും 🙏"}};

const getT=(lang,key)=>(LANG_TEXT[lang]&&LANG_TEXT[lang][key])||LANG_TEXT.EN[key];
const sessions={};const oppTimers={};const custTimers={};const processedIds=new Set();
function getSession(p){if(!sessions[p])sessions[p]={lang:"EN",stage:"NEW",lastOpp:"",form:{}};return sessions[p];}
async function sendText(to,body){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"text",text:{body}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){}}
async function sendImage(to,link,caption){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"image",image:{link,caption}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,caption);}}
async function sendButtons(to,body,buttons){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"button",body:{text:body},action:{buttons:buttons.map(b=>({type:"reply",reply:{id:b.id,title:b.title.substring(0,20)}}))}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
async function sendList(to,body,buttonText,sections){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"list",body:{text:body},action:{button:buttonText,sections}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
function loadReminders(){try{if(fs.existsSync("/tmp/reminders.json"))return JSON.parse(fs.readFileSync("/tmp/reminders.json"));}catch(e){}return [];}
function saveReminders(list){try{fs.writeFileSync("/tmp/reminders.json",JSON.stringify(list));}catch(e){}}
function addReminder(phone,type){const list=loadReminders();list.push({phone,type,claimedAt:Date.now(),sent1h:false,sent24h:false,sent48h:false,sent72h:false});saveReminders(list);}
async function checkReminders(){let list=loadReminders();let changed=false;const now=Date.now();for(let r of list){const diffH=(now-r.claimedAt)/(1000*60*60);if(!r.sent1h&&diffH>=1){await sendImage(r.phone,ASSETS.posters.freeRecharge,`⏰ *Your free recharge going to expire*\n\n33 Rupees Recharge - 24hr Unlimited Trips\nActivate now:\n${ASSETS.apps.driver}`);r.sent1h=true;changed=true;}if(!r.sent24h&&diffH>=24){await sendText(r.phone,`🔔 *Re-activate discount*\nYour FREE recharge pending:\n${ASSETS.apps.driver}`);r.sent24h=true;changed=true;}if(!r.sent48h&&diffH>=48){await sendText(r.phone,`💬 *Need help to verify?*\nTeam can help:\n${ASSETS.apps.driver}`);r.sent48h=true;changed=true;}if(!r.sent72h&&diffH>=72){await sendText(r.phone,`😔 *Free recharge expired*\nStill join:\n${ASSETS.apps.driver}`);r.sent72h=true;changed=true;}}if(changed)saveReminders(list.filter(r=>!r.sent72h));}
setInterval(checkReminders,5*60*1000);

// FIX 5: Pending chats now use memory + file both for Render safety
function loadPendingChats(){return pendingChatsMemory;}
function savePendingChats(data){Object.assign(pendingChatsMemory, data); try{fs.writeFileSync("/tmp/pending_chats.json",JSON.stringify(data));}catch(e){}}
let pendingChats=pendingChatsMemory;
function setPendingChat(phone,lang,stageName){
  if(!pendingChats[phone]) pendingChats[phone]={lang:lang||"EN",stage:stageName,lastActivity:Date.now(),reminders:{r1:false,r2:false,r3:false}};
  else{pendingChats[phone].lang=lang||pendingChats[phone].lang; pendingChats[phone].stage=stageName; pendingChats[phone].lastActivity=Date.now();}
  savePendingChats(pendingChats);
}
function clearPendingChat(phone){if(pendingChats[phone]){delete pendingChats[phone];savePendingChats(pendingChats);}}
function getPendingReminderText(lang,attempt,stage){
  if(lang==="HI"){
    if(attempt===1) return `👋 नमस्ते! आपने Bizmapia चैट अधूरा छोड़ दिया था।\n\nआप ${stage} पर थे - सिर्फ 1 मिनट में पूरा करें।\n👉 जारी रखने के लिए *HI* टाइप करें\n📞 ${CONTACT_NUMBER} | ${EMAIL_ID}`;
    if(attempt===2) return `⏰ *Reminder - आपका Bizmapia रजिस्ट्रेशन Pending है!*\n30 मिनट पहले आपने जानकारी देखी थी।\nType *HI* to continue 🙏\nSupport: ${EMAIL_ID}`;
    if(attempt===3) return `🔔 *Last Chance - Bizmapia*\nकल आपने रुचि दिखाई थी। आज आपका स्लॉट रिज़र्व है!\n12 महीने विज्ञापन सपोर्ट उपलब्ध है।\n👉 *HI* लिखकर पूरा करें\n📞 ${CONTACT_NUMBER}`;
  } else if(lang==="ML"){
    if(attempt===1) return `👋 ഹായ്! നിങ്ങൾ Bizmapia ചാറ്റ് പൂർത്തിയാക്കിയില്ല।\n${stage} - 1 മിനിറ്റിൽ പൂർത്തിയാക്കൂ!\n👉 തുടരാൻ *HI* ടൈപ്പ് ചെയ്യുക\n📞 ${CONTACT_NUMBER}`;
    if(attempt===2) return `⏰ *Reminder - Bizmapia Pending!*\n30 മിനിറ്റ് മുൻപ് നോക്കിയിരുന്നു।\nType *HI* 🙏`;
    if(attempt===3) return `🔔 *Last Chance - Bizmapia*\nഇന്നലെ താൽപ്പര്യം കാണിച്ചിരുന്നു।\n👉 *HI* ടൈപ്പ് ചെയ്യുക\n📞 ${CONTACT_NUMBER}`;
  } else {
    if(attempt===1) return `👋 Hi! You left your Bizmapia chat incomplete.\nYou were at ${stage} - Complete in 1 min!\n👉 Reply *HI* to continue\n📞 ${CONTACT_NUMBER} | ${EMAIL_ID}\n🌐 ${WEBSITE}`;
    if(attempt===2) return `⏰ *Reminder - Your Bizmapia Registration is Pending!*\nYou checked 30 mins ago. Want to complete now?\nReply *HI* 🙏\nSupport: ${EMAIL_ID}`;
    if(attempt===3) return `🔔 *Last Chance - Bizmapia Franchise*\nYesterday you showed interest. Your slot is still reserved!\n12 Months Ad Support + Rent + Salary\n👉 Reply *HI* to complete\n📞 ${CONTACT_NUMBER} | ${EMAIL_ID}`;
  }
}
async function checkPendingChats(){
  const now=Date.now(); let changed=false;
  for(let phone in pendingChats){
    const p=pendingChats[phone]; const diffMin=(now-p.lastActivity)/(1000*60);
    if(!p.reminders.r1&&diffMin>=10){
      const text=getPendingReminderText(p.lang,1,p.stage);
      await sendText(phone,text);
      await logAllChat(phone, 'AUTO_REMINDER', 'REMINDER_10MIN_SENT', p.lang, p.stage, '10min reminder');
      setTimeout(async()=>{const rows=getMainMenuRows(p.lang);await sendList(phone,getT(p.lang,"selectMenu"),"Main Menu",[{title:"Menu",rows}]);},3000);
      p.reminders.r1=true; changed=true;
    } else if(!p.reminders.r2&&diffMin>=30){
      const text=getPendingReminderText(p.lang,2,p.stage);
      await sendText(phone,text);
      await logAllChat(phone, 'AUTO_REMINDER', 'REMINDER_30MIN_SENT', p.lang, p.stage, '30min reminder');
      p.reminders.r2=true; changed=true;
    } else if(!p.reminders.r3&&diffMin>=1440){
      const text=getPendingReminderText(p.lang,3,p.stage);
      await sendImage(phone,ASSETS.posters.opportunity,text);
      await logAllChat(phone, 'AUTO_REMINDER', 'REMINDER_24H_SENT', p.lang, p.stage, '24h reminder');
      p.reminders.r3=true; changed=true;
    }
  }
  for(let phone in pendingChats){
    if((now-pendingChats[phone].lastActivity)>72*60*60*1000&&pendingChats[phone].reminders.r3){delete pendingChats[phone]; changed=true;}
  }
  if(changed) savePendingChats(pendingChats);
}
setInterval(checkPendingChats,2*60*1000);

function getOppName(id){const map={opp_1:"District Franchisee (10L-15L)",opp_2:"Corporation Franchisee (5L)",opp_3:"Municipality Franchisee (4L)",opp_4:"Business Center - Taxi (1L)",opp_5:"Business Center - Directory (1L)"};return map[id]||id;}
function getOppFeeCard(id){const cards={opp_1:`━━━━━━━━━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n💰 ₹10L-₹15L Investment\n📍 Full District Rights | 5 Year MOU\n🏠 Rent + Salary Support\n📢 Ad Support: 12 Months\n━━━━━━━━━━━━━━━━━━━━━━\nContact: ${CONTACT_NUMBER}\nEmail: ${EMAIL_ID}`,opp_2:`━━━━━━━━━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n💰 ₹5L Investment\n📍 Corporation Rights | 3 Year MOU\n🏠 Rent + Salary Support\n📢 Ad Support: 12 Months\n━━━━━━━━━━━━━━━━━━━━━━`,opp_3:`━━━━━━━━━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n💰 ₹4L Investment\n📍 Municipality Rights | 3 Year MOU\n🏠 Rent + Salary Support\n📢 Ad Support: 12 Months\n━━━━━━━━━━━━━━━━━━━━━━`,opp_4:`━━━━━━━━━━━━━━━━━━━━━━\n🚕 *BUSINESS CENTER - TAXI*\n💰 ₹1L Investment\n📍 Area Rights | 1 Year MOU\n❌ No Rent / No Salary\n📢 Ad Support: 3 Months Selected Service\n━━━━━━━━━━━━━━━━━━━━━━`,opp_5:`━━━━━━━━━━━━━━━━━━━━━━\n📖 *BUSINESS CENTER - DIRECTORY*\n💰 ₹1L Investment\n📍 Area Rights | 1 Year MOU\n❌ No Rent / No Salary\n📢 Ad Support: 3 Months Selected Service\n━━━━━━━━━━━━━━━━━━━━━━`};return cards[id]||"";}
const OPP_MAP={'OPP_1':'District Franchisee (10L-15L) - 5Y - Rent+Salary - 12M Ads','OPP_2':'Corporation Franchisee (5L) - 3Y - Rent+Salary - 12M Ads','OPP_3':'Municipality Franchisee (4L) - 3Y - Rent+Salary - 12M Ads','OPP_4':'Business Center Taxi (1L) - 1Y - 3M Ads','OPP_5':'Business Center Directory (1L) - 1Y - 3M Ads'};
function getMainMenuRows(lang){if(lang==="HI"){return[{id:"customer",title:"कस्टमर",description:"टैक्सी और सर्विस बुक करें"},{id:"driver",title:"ड्राइवर पार्टनर",description:"गाड़ी जोड़ें और कमाना शुरू करें"},{id:"business",title:"बिजनेस ओनर",description:"बिजनेस लिस्ट करें और ग्राहक पाएं"},{id:"opportunity",title:"फ्रेंचाइजी अवसर",description:"अपने क्षेत्र में फ्रेंचाइजी लें"}];}else if(lang==="ML"){return[{id:"customer",title:"കസ്റ്റമർ",description:"ടാക്സി & സർവീസ് ബുക്ക് ചെയ്യുക"},{id:"driver",title:"ഡ്രൈവർ പാർട്ണർ",description:"വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം"},{id:"business",title:"ബിസിനസ് ഓണർ",description:"ബിസിനസ് ലിസ്റ്റ് ചെയ്ത് കസ്റ്റമേഴ്സ്"},{id:"opportunity",title:"ഫ്രാഞ്ചൈസി അവസരം",description:"നിങ്ങളുടെ ഏരിയയിൽ ഫ്രാഞ്ചൈസി"}];}else{return[{id:"customer",title:"Customer",description:"Book a Taxi & Services"},{id:"driver",title:"Driver Partner",description:"Attach Your Vehicle & Start Earning"},{id:"business",title:"Business Owner",description:"List Your Business & Get Customers"},{id:"opportunity",title:"Franchise Opportunity",description:"Own a Franchise in Your Area"}];}}

app.get('/webhook',(req,res)=>{if(req.query['hub.verify_token']===VERIFY_TOKEN)res.send(req.query['hub.challenge']);else res.sendStatus(403);});
app.get('/',(req,res)=>res.send('Bizmapia Bot GOD MODE - ALL CHATS TRACKED - Realtime Sheet Maintenance ✅ Running on 10000'));
app.get('/pending',(req,res)=>{res.json({total_pending:Object.keys(pendingChats).length,pending_chats:pendingChats,driver_reminders:loadReminders().length});});

app.post('/webhook',async(req,res)=>{
try{
const msg=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
if(!msg)return res.sendStatus(200);
if(processedIds.has(msg.id))return res.sendStatus(200);
processedIds.add(msg.id);if(processedIds.size>1000)processedIds.clear();
const from=msg.from;
let rawId=msg.type==="interactive"?(msg.interactive.button_reply?.id||msg.interactive.list_reply?.id||""):(msg.text?.body?.trim()||"");
let input=rawId.toLowerCase();let inputUpper=rawId.toUpperCase();
const rawText=msg.text?.body||"";
const s=getSession(from);

if(s.stage==="FORM_NAME"){s.form.name=rawText.replace(/\n/g,' ').trim();s.stage="FORM_CONTACT";setPendingChat(from,s.lang,"FORM_CONTACT"); await logAllChat(from, 'FORM', 'NAME_GIVEN', s.lang, 'FORM_CONTACT', s.form.name); await sendText(from,getT(s.lang,"formContact"));return res.sendStatus(200);}
if(s.stage==="FORM_CONTACT"){s.form.contact=rawText.replace(/\n/g,' ').trim();s.stage="FORM_PLACE";setPendingChat(from,s.lang,"FORM_PLACE"); await logAllChat(from, 'FORM', 'CONTACT_GIVEN', s.lang, 'FORM_PLACE', s.form.contact); await sendText(from,getT(s.lang,"formPlace"));return res.sendStatus(200);}
if(s.stage==="FORM_PLACE"){s.form.place=rawText.replace(/\n/g,' ').trim();s.stage="FORM_OCCUPATION";setPendingChat(from,s.lang,"FORM_OCCUPATION"); await logAllChat(from, 'FORM', 'PLACE_GIVEN', s.lang, 'FORM_OCCUPATION', s.form.place); await sendList(from,getT(s.lang,"formOcc"),"Select Occupation",[{title:"Occupation",rows:[{id:"occ_running",title:"Running business"},{id:"occ_planning",title:"Planning to start"},{id:"occ_employee",title:"Employee"},{id:"occ_partner",title:"Business Partner"},{id:"occ_nri",title:"NRI"},{id:"occ_retired",title:"Retired"}]}]);return res.sendStatus(200);}
if(s.stage==="FORM_OCCUPATION"){
if(input.startsWith("occ_")){const m={occ_running:"Running business",occ_planning:"Planning to start",occ_employee:"Employee",occ_partner:"Business Partner",occ_nri:"NRI",occ_retired:"Retired"};s.form.occupation=m[input]||input;}else s.form.occupation=rawText.replace(/\n/g,' ').trim();
const oppFullName=OPP_MAP[s.lastOpp]||getOppName(s.lastOpp.toLowerCase())||s.lastOpp;
const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
const sheetRow=[dateStr,from,'Franchisee_Lead',oppFullName,s.form.name,s.form.contact,s.form.place,s.form.occupation,s.lang];
await appendToSheet(sheetRow); await logAllChat(from, 'Franchisee_Lead', 'COMPLETED', s.lang, 'LEAD_COMPLETED', `${oppFullName} | ${s.form.name}`);
clearPendingChat(from);
await sendImage(from,ASSETS.posters.welcome,`${getT(s.lang,"thanksEnq")} ${s.form.name}!\n${getT(s.lang,"team24")}\nContact: ${CONTACT_NUMBER} / ${EMAIL_ID}`);
s.stage="MENU";s.form={};s.lastOpp="";
await new Promise(r=>setTimeout(r,2000));
await sendImage(from,ASSETS.posters.franchiseBrochure,`📄 Bizmapia Franchise Brochure\n12 Months Ad Support & 3 Months\nContact: ${CONTACT_NUMBER}\nEmail: ${EMAIL_ID}\n${WEBSITE}`);
await sendButtons(from,"Explore more?",[{id:"view_opp_levels",title:"View Opportunities"},{id:"menu",title:"Main Menu"}]);
return res.sendStatus(200);}
if(s.stage==="BUSINESS_DATA"){const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});const cleanBusiness=rawText.replace(/\n/g,' | ').substring(0,200);const sheetRow=[dateStr,from,'Business_Lead',cleanBusiness,cleanBusiness,'','','',s.lang];await appendToSheet(sheetRow); await logAllChat(from, 'Business_Lead', 'COMPLETED', s.lang, 'BUSINESS_COMPLETED', cleanBusiness); clearPendingChat(from);await sendImage(from,ASSETS.posters.welcome,`✅ Business Details Received! ${getT(s.lang,"team24")}`);s.stage="MENU";s.lastOpp="";await new Promise(r=>setTimeout(r,2000));await sendImage(from,ASSETS.posters.businessBrochure,`📄 Business Listing Benefits\nContact: ${CONTACT_NUMBER}\nEmail: ${EMAIL_ID}\n${WEBSITE}`);await sendButtons(from,"What next?",[{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(s.stage==="NEW"||["hi","hello","hey","hlo","start","hai"].includes(input)){s.stage="LANG";s.form={};s.lastOpp="";setPendingChat(from,s.lang,"LANG_SELECTION"); await logAllChat(from, 'CHAT_STARTED', 'NEW_USER_HI', s.lang, 'LANG_SELECTION', 'User said HI'); await sendImage(from,ASSETS.posters.welcome,"👋 Welcome to Bizmapia! Your Success, Our Platform 🙏\n\nThank you for reaching out!");await new Promise(r=>setTimeout(r,800));await sendButtons(from,"Select language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക",[{id:"lang_en",title:"English"},{id:"lang_hi",title:"Hindi"},{id:"lang_ml",title:"Malayalam"}]);return res.sendStatus(200);}
if(s.stage==="LANG"||input.startsWith("lang_")){if(input.includes("en"))s.lang="EN";else if(input.includes("hi"))s.lang="HI";else if(input.includes("ml"))s.lang="ML";s.stage="MENU";setPendingChat(from,s.lang,"MAIN_MENU"); await logAllChat(from, 'LANGUAGE_SELECTED', 'ACTIVE', s.lang, 'MAIN_MENU', `Selected ${s.lang}`); await sendList(from,getT(s.lang,"whatToKnow"),"Main Menu",[{title:"Menu",rows:getMainMenuRows(s.lang)}]);return res.sendStatus(200);}
if(input==="customer"){setPendingChat(from,s.lang,"CUSTOMER_VIEWED"); await logAllChat(from, 'MENU_CLICK', 'CUSTOMER', s.lang, 'CUSTOMER_VIEWED', 'Clicked Customer'); await sendImage(from,ASSETS.posters.customer,`${getT(s.lang,"customerH")}\n✅ Taxi ✅ Delivery ✅ Business Offers\nContact: ${CONTACT_NUMBER}`);await new Promise(r=>setTimeout(r,800));await sendText(from,`📲 *Download Customer App:*\n${ASSETS.apps.customer}`);await sendButtons(from,getT(s.lang,"whatToKnow"),[{id:"activate",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(input==="activate"){clearPendingChat(from); await logAllChat(from, 'CUSTOMER', 'APP_DOWNLOAD', s.lang, 'ACTIVATE', 'Customer app'); await sendText(from,`✅ *Offer Activated!*\nOpen app:\n📲 ${ASSETS.apps.customer}`);return res.sendStatus(200);}
if(input==="driver"){setPendingChat(from,s.lang,"DRIVER_VIEWED"); await logAllChat(from, 'MENU_CLICK', 'DRIVER', s.lang, 'DRIVER_VIEWED', 'Clicked Driver'); await sendImage(from,ASSETS.posters.driver,`${getT(s.lang,"driverH")}\nAuto Rs.33 / Car Rs.49\nContact: ${CONTACT_NUMBER}`);await new Promise(r=>setTimeout(r,800));await sendText(from,`📲 Download Driver App:\n${ASSETS.apps.driver}`);await sendButtons(from,"Claim your free recharge:",[{id:"driver_benefit",title:"Free Recharge"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(input==="driver_benefit"){setPendingChat(from,s.lang,"DRIVER_BENEFIT"); await logAllChat(from, 'DRIVER', 'BENEFIT_VIEWED', s.lang, 'DRIVER_BENEFIT', 'Viewed free recharge'); await sendImage(from,ASSETS.posters.freeRecharge,"🎉 *FREE Recharge Benefit!*\n33 Rs Recharge = 24hr Unlimited Trips");await new Promise(r=>setTimeout(r,800));await sendText(from,`📲 Get FREE Recharge:\n${ASSETS.apps.driver}`);await sendButtons(from,"Claim:",[{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(input==="driver_claim"){clearPendingChat(from); await logAllChat(from, 'DRIVER', 'CLAIMED', s.lang, 'DRIVER_CLAIM', 'Free recharge claimed'); await sendText(from,`✅ *Your free recharge going to activate*\n📲 ${ASSETS.apps.driver}`);addReminder(from,"Driver_FreeRecharge");s.stage="MENU";return res.sendStatus(200);}
if(input==="business"){setPendingChat(from,s.lang,"BUSINESS_VIEWED"); await logAllChat(from, 'MENU_CLICK', 'BUSINESS', s.lang, 'BUSINESS_VIEWED', 'Clicked Business'); await sendImage(from,ASSETS.posters.business,`${getT(s.lang,"businessH")}\nGet More Local Visibility`);await new Promise(r=>setTimeout(r,800));await sendButtons(from,"Register your business",[{id:"business_list",title:"How to List"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(input==="business_list"){setPendingChat(from,s.lang,"BUSINESS_FORM_PENDING"); await logAllChat(from, 'BUSINESS', 'FORM_STARTED', s.lang, 'BUSINESS_FORM_PENDING', 'Started business form'); await sendImage(from,ASSETS.posters.businessBenefit,"🎉 *Benefit 1 Year Subscription and Get Discount*");await new Promise(r=>setTimeout(r,1000));await sendText(from,"📝 *Send business details in ONE message:*\n\nShop Name:\nMobile:\nCategory:\nLocation:");s.stage="BUSINESS_DATA";s.lastOpp="Business";return res.sendStatus(200);}
if(["opportunity","opportunities_franchise","view_opp_levels","opp_search","franchise_opportunity"].includes(input)){setPendingChat(from,s.lang,"FRANCHISE_OPPORTUNITY_VIEWED"); await logAllChat(from, 'MENU_CLICK', 'FRANCHISE', s.lang, 'FRANCHISE_OPPORTUNITY', 'Clicked Franchise Opportunity'); await sendImage(from,ASSETS.posters.opportunity,`${getT(s.lang,"oppH")}\n${getT(s.lang,"oppSub")}\nContact: ${CONTACT_NUMBER} | ${EMAIL_ID}`);await new Promise(r=>setTimeout(r,800));await sendText(from,`🎥 Watch About Bizmapia:\n${ASSETS.videos.main_opp}`);await new Promise(r=>setTimeout(r,800));await sendList(from,`💰 Select Franchise Level:\nDistrict 10L-15L (5Y, 12M Ads)\nMuni/Corp 4L-5L (3Y, 12M Ads)\nBusiness Center 1L (1Y, 3M Ads)`,"View Opportunities",[{title:"All Franchise Opportunities",rows:[{id:"opp_1",title:"District Franchisee",description:"💰 10L-15L | 5Y | 12M Ads"},{id:"opp_2",title:"Corporation Franchisee",description:"💰 5L | 3Y | 12M Ads"},{id:"opp_3",title:"Municipality Franchisee",description:"💰 4L | 3Y | 12M Ads"},{id:"opp_4",title:"Business Center - Taxi",description:"💰 1L | 1Y | 3M Ads"},{id:"opp_5",title:"Business Center - Directory",description:"💰 1L | 1Y | 3M Ads"}]}]);await new Promise(r=>setTimeout(r,1200));await sendButtons(from,"👇 If list not visible:",[{id:"opp_1",title:"District (10L-15L)"},{id:"opp_2",title:"Corporation (5L)"},{id:"opp_3",title:"Municipality (4L)"}]);await new Promise(r=>setTimeout(r,800));await sendButtons(from,"More:",[{id:"opp_4",title:"Taxi Center (1L)"},{id:"opp_5",title:"Directory (1L)"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(["opp_1","opp_2","opp_3","opp_4","opp_5"].includes(input)){s.lastOpp=inputUpper;setPendingChat(from,s.lang,`OPP_${input}_VIEWED`); await logAllChat(from, 'FRANCHISE_LEVEL', 'VIEWED', s.lang, `OPP_${input}_VIEWED`, getOppName(input)); await sendImage(from,ASSETS.posters.opportunity,`💼 *${getOppName(input)}*`);await new Promise(r=>setTimeout(r,800));await sendText(from,getOppFeeCard(input));await new Promise(r=>setTimeout(r,800));await sendText(from,`🎥 Watch full awareness:\n${ASSETS.videos[input]}\nContact: ${CONTACT_NUMBER}`);if(oppTimers[from])clearTimeout(oppTimers[from]);oppTimers[from]=setTimeout(async()=>{await sendButtons(from,`⏰ ${getT(s.lang,"yesNoQ")}`,[{id:"opp_yes",title:"Yes"},{id:"opp_no",title:"No"},{id:"opp_search",title:"Search Other"}]);},5*60*1000);await new Promise(r=>setTimeout(r,800));await sendButtons(from,getT(s.lang,"yesNoQ"),[{id:"opp_yes",title:"Yes"},{id:"opp_no",title:"No"},{id:"opp_search",title:"Search Other"}]);return res.sendStatus(200);}
if(input==="opp_yes"){if(oppTimers[from])clearTimeout(oppTimers[from]);s.stage="FORM_NAME";s.form={};setPendingChat(from,s.lang,"FORM_NAME"); await logAllChat(from, 'FRANCHISE', 'YES_CLICKED', s.lang, 'FORM_NAME', `Said YES to ${s.lastOpp}`); await sendText(from,getT(s.lang,"formName"));return res.sendStatus(200);}
if(input==="opp_no"){if(oppTimers[from])clearTimeout(oppTimers[from]);clearPendingChat(from); await logAllChat(from, 'FRANCHISE', 'NO_OPTED_OUT', s.lang, 'OPTED_OUT', `Said NO to ${s.lastOpp}`); await sendText(from,`You are opted out 🙏\nType *HI* to start again.\nContact: ${CONTACT_NUMBER}`);s.stage="NEW";return res.sendStatus(200);}
if(input==="menu"||input==="view_opp_levels"){s.stage="MENU";setPendingChat(from,s.lang,"MAIN_MENU"); await logAllChat(from, 'MENU', 'MAIN_MENU', s.lang, 'MAIN_MENU', 'Back to main menu'); await sendList(from,getT(s.lang,"whatToKnow"),"Main Menu",[{title:"Menu",rows:getMainMenuRows(s.lang)}]);return res.sendStatus(200);}
if(s.stage==="MENU"){setPendingChat(from,s.lang,"MAIN_MENU");await sendList(from,getT(s.lang,"selectMenu"),"Main Menu",[{title:"Menu",rows:getMainMenuRows(s.lang)}]);return res.sendStatus(200);}
await sendText(from,getT(s.lang,"hiAgain"));res.sendStatus(200);}catch(err){console.log(err);res.sendStatus(200);}});

app.listen(PORT,()=>console.log(`Bizmapia Bot GOD MODE - ALL CHATS TRACKED - Realtime Sheet Maintenance Running on ${PORT}`));