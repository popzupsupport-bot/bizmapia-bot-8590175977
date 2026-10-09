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
const SHEET_ID = process.env.GOOGLE_SHEET_ID || process.env.SHEET_ID || process.env.GOOGLE_SHEET_ID_2 || "1MnPTAMafVTuSX2uQKCpP6GKKadQBLXfrgnySigY8cHY";
const CONTACT_NUMBER = "8590175977";
const EMAIL_ID = "bizmapia.com@gmail.com";
const WEBSITE = "www.bizmapia.com";
const WPBS_PAYMENT_LINK = "https://rzp.io/rzp/WxKS0dZ";
const WPBS_AMOUNT = "₹2,500";
console.log("========== GOD MODE + WPBS 3Q ENHANCED COMPARISON ==========");
console.log("NEW POSTER:", "https://files.catbox.moe/pw2zi4.png");
console.log("WPBS LINK:", WPBS_PAYMENT_LINK);
console.log("ENHANCED: NOT belongs to 4999 + Comparison + Restart");
console.log("====================================");
const pendingChatsMemory = {};
async function getSheetsClient(){try{let creds=process.env.GOOGLE_CREDENTIALS;if(!creds)return null;let credentials=JSON.parse(creds);if(credentials.private_key)credentials.private_key=credentials.private_key.replace(/\\n/g,'\n');const auth=new google.auth.GoogleAuth({credentials,scopes:['https://www.googleapis.com/auth/spreadsheets']});return google.sheets({version:'v4',auth});}catch(e){return null;}}
async function appendToSheet(row){try{const sheets=await getSheetsClient();if(!sheets||!SHEET_ID)return;let finalRow=row.slice(0,9);await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID,range:'Sheet1!A:I',valueInputOption:'USER_ENTERED',requestBody:{values:[finalRow]}});}catch(e){}}
async function logAllChat(phone,type,status,lang,stage,extra=''){try{const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});const details=`${stage} | ${type} | ${status} | ${extra}`.substring(0,200);const langInfo=`${lang} | ${status} | ${stage}`;const row=[dateStr,phone,type,details,'',phone,'',stage,langInfo];const sheets=await getSheetsClient();if(!sheets||!SHEET_ID)return;await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID,range:'Sheet1!A:I',valueInputOption:'USER_ENTERED',requestBody:{values:[row]}});}catch(e){}}
const ASSETS={posters:{welcome:"https://files.catbox.moe/zmj6te.jpg",customer:"https://files.catbox.moe/nbjslu.jpg",driver:"https://files.catbox.moe/2trzp7.jpg",business:"https://files.catbox.moe/sylcqa.jpg",opportunity:"https://files.catbox.moe/y8m3lq.jpg",selectOption:"https://files.catbox.moe/pw2zi4.png",freeRecharge:"https://files.catbox.moe/c03g3q.jpg",businessBenefit:"https://files.catbox.moe/8ayus6.jpg",franchiseBrochure:"https://files.catbox.moe/FRANCHISEE-NEW-BIZMAPIA.jpg",businessBrochure:"https://files.catbox.moe/BUSINESS-NEW-BIZMAPIA.jpg",wpbs:"https://files.catbox.moe/28603553272640227"},apps:{customer:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia",driver:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia_driver"},videos:{main_opp:"https://youtu.be/8ZnDlvbgG_c?si=a5ONBZg6Oe8WuGTP",opp_1:"https://youtu.be/_y2JeFHBnqg?si=igKYEPjGheuARuZe",opp_2:"https://youtu.be/GqolfqgHiCU?si=ySBbc_qLD2mLyBmN",opp_3:"https://youtu.be/GqolfqgHiCU?si=qTxRIIeq7iP5X5Jh",opp_4:"https://youtu.be/r0X77XfmF94?si=XdbPE4Ml2_jkv8zW",opp_5:"https://youtu.be/r0X77XfmF94?si=XdbPE4Ml2_jkv8zW"}};
const LANG_TEXT={EN:{whatToKnow:"What would you like to know?",selectMenu:"Please select from menu below 👇",hiAgain:"👉 Type *HI* to Start Again 🙏",customerH:"🚕 *CUSTOMER - Book a Taxi & Services*",driverH:"🚕 *DRIVER PARTNER - Attach Your Vehicle & Start Earning!*",businessH:"🏪 *BUSINESS OWNER - List Your Business & Get Customers*",oppH:"💼 *FRANCHISE OPPORTUNITY - Own a Franchise in Your Area*",oppSub:"4 Business Opportunities Under One Brand",formName:"*Name :-*\nEnter your full name:",formContact:"*Contact number :-*\nEnter mobile number:",formPlace:"*Place :-*\nEnter place / city:",formOcc:"*Current occupation :-*\nSelect:",yesNoQ:"You want to grab this opportunity?",thanksEnq:"✅ Thank you",team24:"Our team will contact within 24h 🙏"},HI:{whatToKnow:"आप क्या जानना चाहते हैं?",selectMenu:"कृपया नीचे दिए गए मेनू से चुनें 👇",hiAgain:"👉 फिर से शुरू करने के लिए *HI* टाइप करें 🙏",customerH:"🚕 *कस्टमर - टैक्सी और सर्विस बुक करें*",driverH:"🚕 *ड्राइवर पार्टनर - अपनी गाड़ी जोड़ें और कमाना शुरू करें!*",businessH:"🏪 *बिजनेस ओनर - अपना बिजनेस लिस्ट करें और ग्राहक पाएं*",oppH:"💼 *फ्रेंचाइजी अवसर - अपने क्षेत्र में फ्रेंचाइजी लें*",oppSub:"एक ब्रांड के तहत 4 बिजनेस अवसर",formName:"*नाम :-*\nअपना पूरा नाम लिखें:",formContact:"*मोबाइल नंबर :-*\nअपना नंबर लिखें:",formPlace:"*जगह :-*\nअपना शहर लिखें:",formOcc:"*वर्तमान व्यवसाय :-*\nचुनें:",yesNoQ:"क्या आप यह अवसर लेना चाहते हैं?",thanksEnq:"✅ धन्यवाद",team24:"हमारी टीम 24 घंटे में संपर्क करेगी 🙏"},ML:{whatToKnow:"നിങ്ങൾ എന്താണ് അറിയാൻ ആഗ്രഹിക്കുന്നത്?",selectMenu:"ദയവായി താഴെയുള്ള മെനുവിൽ നിന്ന് തിരഞ്ഞെടുക്കുക 👇",hiAgain:"👉 വീണ്ടും ആരംഭിക്കാൻ *HI* ടൈപ്പ് ചെയ്യുക 🙏",customerH:"🚕 *കസ്റ്റമർ - ടാക്സി & സർവീസുകൾ ബുക്ക് ചെയ്യുക*",driverH:"🚕 *ഡ്രൈവർ പാർട്ണർ - വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം നേടൂ!*",businessH:"🏪 *ബിസിനസ് ഓണർ - ബിസിനസ് ലിസ്റ്റ് ചെയ്ത് കസ്റ്റമേഴ്സിനെ നേടൂ*",oppH:"💼 *ഫ്രാഞ്ചൈസി അവസരം - ഏരിയയിൽ ഫ്രാഞ്ചൈസി സ്വന്തമാക്കൂ*",oppSub:"ഒരു ബ്രാൻഡിന് കീഴിൽ 4 ബിസിനസ് അവസരങ്ങൾ",formName:"*പേര് :-*\nനിങ്ങളുടെ പേര് നൽകുക:",formContact:"*ഫോൺ നമ്പർ :-*\nനമ്പർ നൽകുക:",formPlace:"*സ്ഥലം :-*\nനിങ്ങളുടെ സ്ഥലം നൽകുക:",formOcc:"*ജോലി :-*\nതിരഞ്ഞെടുക്കുക:",yesNoQ:"ഈ അവസരം സ്വന്തമാക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",thanksEnq:"✅ നന്ദി",team24:"ടീം 24 മണിക്കൂറിനുള്ളിൽ ബന്ധപ്പെടും 🙏"}};
const getT=(lang,key)=>(LANG_TEXT[lang]&&LANG_TEXT[lang][key])||LANG_TEXT.EN[key];
const sessions={};const oppTimers={};const processedIds=new Set();
function getSession(p){if(!sessions[p])sessions[p]={lang:"EN",stage:"NEW",lastOpp:"",form:{}};return sessions[p];}
async function sendText(to,body){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"text",text:{body}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){}}
async function sendImage(to,link,caption){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"image",image:{link,caption}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,caption);}}
async function sendButtons(to,body,buttons){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"button",body:{text:body},action:{buttons:buttons.map(b=>({type:"reply",reply:{id:b.id,title:b.title.substring(0,20)}}))}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
async function sendList(to,body,buttonText,sections){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"list",body:{text:body},action:{button:buttonText,sections}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
async function sendWelcomeTextAndLanguage(to){const welcomeText=`👋 *Welcome to Bizmapia! Your Success, Our Platform* 🙏\n\nThank you for reaching out to us!\n\nPlease select your language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക 👇`;await sendButtons(to,welcomeText,[{id:"lang_en",title:"English"},{id:"lang_hi",title:"Hindi"},{id:"lang_ml",title:"Malayalam"}]);}
function loadReminders(){try{if(fs.existsSync("/tmp/reminders.json"))return JSON.parse(fs.readFileSync("/tmp/reminders.json"));}catch(e){}return [];}
function saveReminders(list){try{fs.writeFileSync("/tmp/reminders.json",JSON.stringify(list));}catch(e){}}
function addReminder(phone,type){const list=loadReminders();list.push({phone,type,claimedAt:Date.now(),sent1h:false,sent24h:false,sent48h:false,sent72h:false});saveReminders(list);}
async function checkReminders(){let list=loadReminders();let changed=false;const now=Date.now();for(let r of list){const diffH=(now-r.claimedAt)/(1000*60*60);if(!r.sent1h&&diffH>=1){await sendImage(r.phone,ASSETS.posters.freeRecharge,`⏰ *Your free recharge going to expire*\n\n33 Rupees Recharge - 24hr Unlimited Trips\nActivate now:\n${ASSETS.apps.driver}`);r.sent1h=true;changed=true;}if(!r.sent24h&&diffH>=24){await sendText(r.phone,`🔔 *Re-activate discount*\nYour FREE recharge pending:\n${ASSETS.apps.driver}`);r.sent24h=true;changed=true;}if(!r.sent48h&&diffH>=48){await sendText(r.phone,`💬 *Need help to verify?*\nTeam can help:\n${ASSETS.apps.driver}`);r.sent48h=true;changed=true;}if(!r.sent72h&&diffH>=72){await sendText(r.phone,`😔 *Free recharge expired*\nStill join:\n${ASSETS.apps.driver}`);r.sent72h=true;changed=true;}}if(changed)saveReminders(list.filter(r=>!r.sent72h));}
setInterval(checkReminders,5*60*1000);
let pendingChats=pendingChatsMemory;
function setPendingChat(phone,lang,stageName){if(!pendingChats[phone])pendingChats[phone]={lang:lang||"EN",stage:stageName,lastActivity:Date.now(),reminders:{r1:false,r2:false,r3:false}};else{pendingChats[phone].lang=lang||pendingChats[phone].lang;pendingChats[phone].stage=stageName;pendingChats[phone].lastActivity=Date.now();}try{fs.writeFileSync("/tmp/pending_chats.json",JSON.stringify(pendingChats));}catch(e){}}
function clearPendingChat(phone){if(pendingChats[phone]){delete pendingChats[phone];try{fs.writeFileSync("/tmp/pending_chats.json",JSON.stringify(pendingChats));}catch(e){}}}
function getPendingReminderText(lang,attempt,stage){if(lang==="HI"){if(attempt===1)return`👋 नमस्ते! आपने Bizmapia चैट अधूरा छोड़ दिया था।\n\nआप ${stage} पर थे - सिर्फ 1 मिनट में पूरा करें।\n👉 जारी रखने के लिए *HI* टाइप करें\n📞 ${CONTACT_NUMBER}`;if(attempt===2)return`⏰ *Reminder - आपका Bizmapia रजिस्ट्रेशन Pending है!*\nType *HI* to continue 🙏`;if(attempt===3)return`🔔 *Last Chance - Bizmapia*\n👉 *HI* लिखकर पूरा करें\n📞 ${CONTACT_NUMBER}`;}else if(lang==="ML"){if(attempt===1)return`👋 ഹായ്! നിങ്ങൾ Bizmapia ചാറ്റ് പൂർത്തിയാക്കിയില്ല।\n${stage} - 1 മിനിറ്റിൽ പൂർത്തിയാക്കൂ!\n👉 തുടരാൻ *HI* ടൈപ്പ് ചെയ്യുക`;if(attempt===2)return`⏰ *Reminder - Bizmapia Pending!*\nType *HI* 🙏`;if(attempt===3)return`🔔 *Last Chance - Bizmapia*\n👉 *HI* ടൈപ്പ് ചെയ്യുക`; }else{if(attempt===1)return`👋 Hi! You left your Bizmapia chat incomplete.\nYou were at ${stage} - Complete in 1 min!\n👉 Reply *HI* to continue\n📞 ${CONTACT_NUMBER} | ${EMAIL_ID}`;if(attempt===2)return`⏰ *Reminder - Your Bizmapia Registration is Pending!*\nReply *HI* 🙏`;if(attempt===3)return`🔔 *Last Chance - Bizmapia Franchise*\n👉 Reply *HI* to complete\n📞 ${CONTACT_NUMBER}`;}}
async function checkPendingChats(){const now=Date.now();let changed=false;for(let phone in pendingChats){const p=pendingChats[phone];const diffMin=(now-p.lastActivity)/(1000*60);if(!p.reminders.r1&&diffMin>=10){const text=getPendingReminderText(p.lang,1,p.stage);await sendText(phone,text);await logAllChat(phone,'AUTO_REMINDER','REMINDER_10MIN_SENT',p.lang,p.stage,'10min reminder');setTimeout(async()=>{const rows=getMainMenuRows(p.lang);await sendList(phone,getT(p.lang,"selectMenu"),"Main Menu",[{title:"Menu",rows}]);},3000);p.reminders.r1=true;changed=true;}else if(!p.reminders.r2&&diffMin>=30){const text=getPendingReminderText(p.lang,2,p.stage);await sendText(phone,text);await logAllChat(phone,'AUTO_REMINDER','REMINDER_30MIN_SENT',p.lang,p.stage,'30min reminder');p.reminders.r2=true;changed=true;}else if(!p.reminders.r3&&diffMin>=1440){const text=getPendingReminderText(p.lang,3,p.stage);await sendImage(phone,ASSETS.posters.opportunity,text);await logAllChat(phone,'AUTO_REMINDER','REMINDER_24H_SENT',p.lang,p.stage,'24h reminder');p.reminders.r3=true;changed=true;}}for(let phone in pendingChats){if((now-pendingChats[phone].lastActivity)>72*60*60*1000&&pendingChats[phone].reminders.r3){delete pendingChats[phone];changed=true;}}if(changed)try{fs.writeFileSync("/tmp/pending_chats.json",JSON.stringify(pendingChats));}catch(e){}}
setInterval(checkPendingChats,2*60*1000);
function getOppName(id){const map={opp_1:"District Franchisee (10L-15L)",opp_2:"Corporation Franchisee (5L)",opp_3:"Municipality Franchisee (4L)",opp_4:"Business Center - Taxi (1L)",opp_5:"Business Center - Directory (1L)"};return map[id]||id;}
function getOppFeeCard(id){const cards={opp_1:`━━━━━━━━━━━━━━━━━━━━━━\n💼 *DISTRICT FRANCHISEE*\n💰 ₹10L-₹15L Investment\n📍 Full District Rights | 5 Year MOU\n🏠 Rent + Salary Support\n📢 Ad Support: 12 Months\n━━━━━━━━━━━━━━━━━━━━━━\nContact: ${CONTACT_NUMBER}\nEmail: ${EMAIL_ID}`,opp_2:`━━━━━━━━━━━━━━━━━━━━━━\n🏢 *CORPORATION FRANCHISEE*\n💰 ₹5L Investment\n📍 Corporation Rights | 3 Year MOU\n🏠 Rent + Salary Support\n📢 Ad Support: 12 Months\n━━━━━━━━━━━━━━━━━━━━━━`,opp_3:`━━━━━━━━━━━━━━━━━━━━━━\n🏘️ *MUNICIPALITY FRANCHISEE*\n💰 ₹4L Investment\n📍 Municipality Rights | 3 Year MOU\n🏠 Rent + Salary Support\n📢 Ad Support: 12 Months\n━━━━━━━━━━━━━━━━━━━━━━`,opp_4:`━━━━━━━━━━━━━━━━━━━━━━\n🚕 *BUSINESS CENTER - TAXI*\n💰 ₹1L Investment\n📍 Area Rights | 1 Year MOU\n❌ No Rent / No Salary\n📢 Ad Support: 3 Months Selected Service\n━━━━━━━━━━━━━━━━━━━━━━`,opp_5:`━━━━━━━━━━━━━━━━━━━━━━\n📖 *BUSINESS CENTER - DIRECTORY*\n💰 ₹1L Investment\n📍 Area Rights | 1 Year MOU\n❌ No Rent / No Salary\n📢 Ad Support: 3 Months Selected Service\n━━━━━━━━━━━━━━━━━━━━━━`};return cards[id]||"";}
const OPP_MAP={'OPP_1':'District Franchisee (10L-15L) - 5Y - Rent+Salary - 12M Ads','OPP_2':'Corporation Franchisee (5L) - 3Y - Rent+Salary - 12M Ads','OPP_3':'Municipality Franchisee (4L) - 3Y - Rent+Salary - 12M Ads','OPP_4':'Business Center Taxi (1L) - 1Y - 3M Ads','OPP_5':'Business Center Directory (1L) - 1Y - 3M Ads'};
function getMainMenuRows(lang){if(lang==="HI"){return[{id:"customer",title:"कस्टमर",description:"टैक्सी और सर्विस बुक करें"},{id:"driver",title:"ड्राइवर पार्टनर",description:"गाड़ी जोड़ें और कमाना शुरू करें"},{id:"business",title:"बिजनेस ओनर",description:"बिजनेस लिस्ट करें और ग्राहक पाएं"},{id:"opportunity",title:"फ्रेंचाइजी अवसर",description:"अपने क्षेत्र में फ्रेंचाइजी लें"}];}else if(lang==="ML"){return[{id:"customer",title:"കസ്റ്റമർ",description:"ടാക്സി & സർവീസ് ബുക്ക് ചെയ്യുക"},{id:"driver",title:"ഡ്രൈവർ പാർട്ണർ",description:"വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം"},{id:"business",title:"ബിസിനസ് ഓണർ",description:"ബിസിനസ് ലിസ്റ്റ് ചെയ്ത് കസ്റ്റമേഴ്സ്"},{id:"opportunity",title:"ഫ്രാഞ്ചൈസി അവസരം",description:"നിങ്ങളുടെ ഏരിയയിൽ ഫ്രാഞ്ചൈസി"}];}else{return[{id:"customer",title:"Customer",description:"Book a Taxi & Services"},{id:"driver",title:"Driver Partner",description:"Attach Your Vehicle & Start Earning"},{id:"business",title:"Business Owner",description:"List Your Business & Get Customers"},{id:"opportunity",title:"Franchise Opportunity",description:"Own a Franchise in Your Area"}];}}
app.get('/webhook',(req,res)=>{if(req.query['hub.verify_token']===VERIFY_TOKEN)res.send(req.query['hub.challenge']);else res.sendStatus(403);});
app.get('/',(req,res)=>res.send('Bizmapia Bot GOD MODE + WPBS 3Q Enhanced Comparison LIVE ✅'));
app.get('/pending',(req,res)=>{res.json({total_pending:Object.keys(pendingChats).length,pending_chats:pendingChats,driver_reminders:loadReminders().length});});
app.get('/wpbs',(req,res)=>{res.json({status:"LIVE", poster:"https://files.catbox.moe/pw2zi4.png", payment_link:WPBS_PAYMENT_LINK, amount:WPBS_AMOUNT, support:CONTACT_NUMBER});});
app.get('/test-sheet', async (req,res)=>{await logAllChat("919999999999","TEST","TEST_SHEET","EN","TEST_STAGE","Manual test");res.send(`✅ Test log sent! Time: ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}`);});
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
console.log(`[INBOUND] ${from} : ${rawText || rawId}`);
await logAllChat(from,(rawText||rawId||"HI").substring(0,30),"INBOUND",s.lang,"CHAT_RECEIVED",`Raw: ${rawText||rawId}`.substring(0,150));
if(s.stage==="FORM_NAME"){s.form.name=rawText.replace(/\n/g,' ').trim();s.stage="FORM_CONTACT";setPendingChat(from,s.lang,"FORM_CONTACT");await logAllChat(from,'FORM','NAME_GIVEN',s.lang,'FORM_CONTACT',s.form.name);await sendText(from,getT(s.lang,"formContact"));return res.sendStatus(200);}
if(s.stage==="FORM_CONTACT"){s.form.contact=rawText.replace(/\n/g,' ').trim();s.stage="FORM_PLACE";setPendingChat(from,s.lang,"FORM_PLACE");await logAllChat(from,'FORM','CONTACT_GIVEN',s.lang,'FORM_PLACE',s.form.contact);await sendText(from,getT(s.lang,"formPlace"));return res.sendStatus(200);}
if(s.stage==="FORM_PLACE"){s.form.place=rawText.replace(/\n/g,' ').trim();s.stage="FORM_OCCUPATION";setPendingChat(from,s.lang,"FORM_OCCUPATION");await logAllChat(from,'FORM','PLACE_GIVEN',s.lang,'FORM_OCCUPATION',s.form.place);await sendList(from,getT(s.lang,"formOcc"),"Select Occupation",[{title:"Occupation",rows:[{id:"occ_running",title:"Running business"},{id:"occ_planning",title:"Planning to start"},{id:"occ_employee",title:"Employee"},{id:"occ_partner",title:"Business Partner"},{id:"occ_nri",title:"NRI"},{id:"occ_retired",title:"Retired"}]}]);return res.sendStatus(200);}
if(s.stage==="FORM_OCCUPATION"){
if(input.startsWith("occ_")){const m={occ_running:"Running business",occ_planning:"Planning to start",occ_employee:"Employee",occ_partner:"Business Partner",occ_nri:"NRI",occ_retired:"Retired"};s.form.occupation=m[input]||input;}else s.form.occupation=rawText.replace(/\n/g,' ').trim();
const oppFullName=OPP_MAP[s.lastOpp]||getOppName(s.lastOpp.toLowerCase())||s.lastOpp;
const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
const sheetRow=[dateStr,from,'Franchisee_Lead',oppFullName,s.form.name,s.form.contact,s.form.place,s.form.occupation,s.lang];
await appendToSheet(sheetRow);await logAllChat(from,'Franchisee_Lead','COMPLETED',s.lang,'LEAD_COMPLETED',`${oppFullName} | ${s.form.name}`);
clearPendingChat(from);
await sendImage(from,ASSETS.posters.welcome,`${getT(s.lang,"thanksEnq")} ${s.form.name}!\n${getT(s.lang,"team24")}\nContact: ${CONTACT_NUMBER} / ${EMAIL_ID}`);
s.stage="MENU";s.form={};s.lastOpp="";
await new Promise(r=>setTimeout(r,2000));
await sendImage(from,ASSETS.posters.franchiseBrochure,`📄 Bizmapia Franchise Brochure\n12 Months Ad Support & 3 Months\nContact: ${CONTACT_NUMBER}\nEmail: ${EMAIL_ID}\n${WEBSITE}`);
await sendButtons(from,"Explore more?",[{id:"view_opp_levels",title:"View Opportunities"},{id:"menu",title:"Main Menu"}]);
return res.sendStatus(200);}
if(s.stage==="BUSINESS_DATA"){const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});const cleanBusiness=rawText.replace(/\n/g,' | ').substring(0,200);const sheetRow=[dateStr,from,'Business_Lead',cleanBusiness,cleanBusiness,'','','',s.lang];await appendToSheet(sheetRow);await logAllChat(from,'Business_Lead','COMPLETED',s.lang,'BUSINESS_COMPLETED',cleanBusiness);clearPendingChat(from);await sendImage(from,ASSETS.posters.welcome,`✅ Business Details Received! ${getT(s.lang,"team24")}`);s.stage="MENU";s.lastOpp="";await new Promise(r=>setTimeout(r,2000));await sendImage(from,ASSETS.posters.businessBrochure,`📄 Business Listing Benefits\nContact: ${CONTACT_NUMBER}\nEmail: ${EMAIL_ID}\n${WEBSITE}`);await sendButtons(from,"What next?",[{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
// ===== WPBS 3-QUESTION PLAN SORTING =====
if(input==="wpbs" || input.includes("whatsapp automation")){
  s.stage="WPBS_Q1";
  s.form = s.form || {};
  s.form.wpbs = { levels: [] };
  setPendingChat(from,s.lang,"WPBS_Q1_MSG");
  await logAllChat(from,'AD_SELECTION','WPBS_Q1_START',s.lang,'WPBS_Q1','Selected WPBS - Q1 Started');
  await sendText(from,`🔍 *Let's find perfect WPBS plan for you - 3 quick questions (30 sec)*\n\n*Q1/3: Messages per month?*`);
  await sendButtons(from,"Select:",[
    {id:"wpbs_q1_l1", title:"Upto 1000"},
    {id:"wpbs_q1_l2", title:"1000-5000"},
    {id:"wpbs_q1_l3", title:"Above 5000"}
  ]);
  return res.sendStatus(200);
}
if(s.stage==="WPBS_Q1" && input.startsWith("wpbs_q1_")){
  let lvl = input.includes("_l3")?"L3":input.includes("_l2")?"L2":"L1";
  s.form.wpbs.q1=input;
  s.form.wpbs.q1_lvl=lvl;
  s.form.wpbs.q1_text = lvl==="L1"?"Upto 1000":lvl==="L2"?"1000-5000":"Above 5000";
  s.form.wpbs.levels=[lvl];
  s.stage="WPBS_Q2";
  setPendingChat(from,s.lang,"WPBS_Q2_NUMBERS");
  await logAllChat(from,'WPBS_Q1','ANSWERED_'+lvl,s.lang,'WPBS_Q2',`Q1: ${input} => ${lvl}`);
  await sendText(from,`*Q2/3: How many WhatsApp Numbers / Bots?*`);
  await sendButtons(from,"Select:",[
    {id:"wpbs_q2_l1", title:"1 Number"},
    {id:"wpbs_q2_l2", title:"2 to 5"},
    {id:"wpbs_q2_l3", title:"More than 5"}
  ]);
  return res.sendStatus(200);
}
if(s.stage==="WPBS_Q2" && input.startsWith("wpbs_q2_")){
  let lvl = input.includes("_l3")?"L3":input.includes("_l2")?"L2":"L1";
  s.form.wpbs.q2=input;
  s.form.wpbs.q2_lvl=lvl;
  s.form.wpbs.q2_text = lvl==="L1"?"1 Number":lvl==="L2"?"2 to 5":"More than 5";
  s.form.wpbs.levels.push(lvl);
  s.stage="WPBS_Q3";
  setPendingChat(from,s.lang,"WPBS_Q3_ADS");
  await logAllChat(from,'WPBS_Q2','ANSWERED_'+lvl,s.lang,'WPBS_Q3',`Q2: ${input} => ${lvl}`);
  await sendText(from,`*Q3/3: How many Ads with same bot?*`);
  await sendButtons(from,"Select:",[
    {id:"wpbs_q3_l1", title:"1 Ad"},
    {id:"wpbs_q3_l2", title:"2 to 5 Ads"},
    {id:"wpbs_q3_l3", title:"More than 5 Ads"}
  ]);
  return res.sendStatus(200);
}
if(s.stage==="WPBS_Q3" && input.startsWith("wpbs_q3_")){
  let lvl = input.includes("_l3")?"L3":input.includes("_l2")?"L2":"L1";
  s.form.wpbs.q3=input;
  s.form.wpbs.q3_lvl=lvl;
  s.form.wpbs.q3_text = lvl==="L1"?"1 Ad":lvl==="L2"?"2 to 5 Ads":"More than 5 Ads";
  s.form.wpbs.levels.push(lvl);
  let q1Text = s.form.wpbs.q1_text;
  let q2Text = s.form.wpbs.q2_text;
  let q3Text = s.form.wpbs.q3_text;
  let finalLevel="L1"; let price="₹4999/-"; let details="1 Number | Upto 1000 Msgs | 1 Ad";
  if(s.form.wpbs.levels.includes("L2")){ finalLevel="L2"; price="₹9999/-"; details="2-5 Numbers | 1000-5000 Msgs | 2-5 Ads"; }
  if(s.form.wpbs.levels.includes("L3")){ finalLevel="L3"; price="₹14,999/- Onwards"; details="5+ Numbers | 5000+ Msgs | 5+ Ads - Full Automation+API"; }
  s.form.wpbs.recommended=finalLevel;
  s.form.wpbs.finalPrice=price;
  s.stage="WPBS_RECOMMENDED";
  setPendingChat(from,s.lang,"WPBS_RECOMMENDED");
  let caption = "";
  if(finalLevel==="L1"){
    caption=`✅ *Analysis Done! You BELONG to ₹4999 Plan! 🎉*\n\n📊 Your Requirement:\n• Msgs/Month: ${q1Text} => ${s.form.wpbs.q1_lvl}\n• Numbers: ${q2Text} => ${s.form.wpbs.q2_lvl}\n• Ads: ${q3Text} => ${s.form.wpbs.q3_lvl}\n\n💎 *Recommended: ${finalLevel} = ${price}*\n📋 Includes: ${details}\n✅ Perfect Match - You are eligible for L1!\n\n🎯 *Your requirement smaller? Your bill smaller too!*\n🔒 *Lock Now @ ${WPBS_AMOUNT} Advance*\n💳 Pay: ${WPBS_PAYMENT_LINK}\n`;
  } else {
    caption=`⚠️ *You are NOT belongs to our ₹4999 Plan*\n\n📊 *Comparison:*\n\n*₹4999 Plan (L1) Criteria:*\n• Msgs/Month: Upto 1000\n• Numbers: 1 Number\n• Ads: 1 Ad\n\n*Your Submitted Requirement:*\n• Msgs/Month: ${q1Text} => Belongs to ${s.form.wpbs.q1_lvl} ${s.form.wpbs.q1_lvl!=="L1"?"❌":"✅"}\n• Numbers: ${q2Text} => Belongs to ${s.form.wpbs.q2_lvl} ${s.form.wpbs.q2_lvl!=="L1"?"❌":"✅"}\n• Ads: ${q3Text} => Belongs to ${s.form.wpbs.q3_lvl} ${s.form.wpbs.q3_lvl!=="L1"?"❌":"✅"}\n\n*Your Requirement Belongs To:*\n• Msgs Criteria => ${s.form.wpbs.q1_lvl} Plan\n• Numbers Criteria => ${s.form.wpbs.q2_lvl} Plan\n• Ads Criteria => ${s.form.wpbs.q3_lvl} Plan\n\n💎 *FINAL Recommended: ${finalLevel} = ${price}*\n📋 Includes: ${details}\n💰 Total: ${price} | Advance: ${WPBS_AMOUNT} | Balance after demo\n\n🔄 *If you by mistakenly choose questionnaire, go back to questionnaire and fill again to get your correct plan for requirement.*\n\n💳 Pay: ${WPBS_PAYMENT_LINK}\n`;
  }
  await sendImage(from, ASSETS.posters.wpbs || ASSETS.posters.selectOption, caption);
  await new Promise(r=>setTimeout(r,1000));
  if(finalLevel==="L1"){
    await sendButtons(from,`Lock your ${finalLevel} plan:`,[
      {id:"wpbs_pay_"+finalLevel.toLowerCase(), title:`Pay ₹2500 - ${finalLevel}`},
      {id:"wpbs_paid", title:"I Paid - Confirm"}
    ]);
  } else {
    await sendButtons(from,`Your plan is ${finalLevel} - Not L1:`,[
      {id:"wpbs_pay_"+finalLevel.toLowerCase(), title:`Pay ₹2500 - ${finalLevel}`},
      {id:"wpbs_restart", title:"Restart Questionnaire"},
      {id:"wpbs_paid", title:"I Paid - Confirm"}
    ]);
  }
  await logAllChat(from,'WPBS_SORTED',finalLevel,s.lang,'WPBS_RECOMMENDED',`Q1:${s.form.wpbs.q1_lvl}(${q1Text}) Q2:${s.form.wpbs.q2_lvl}(${q2Text}) Q3:${s.form.wpbs.q3_lvl}(${q3Text}) => ${finalLevel}`);
  return res.sendStatus(200);
}
if(input==="wpbs_restart"){
  s.stage="WPBS_Q1";
  s.form = s.form || {};
  s.form.wpbs = { levels: [] };
  setPendingChat(from,s.lang,"WPBS_Q1_MSG");
  await logAllChat(from,'WPBS','RESTARTED',s.lang,'WPBS_Q1','Restarted questionnaire - mistakenly chosen');
  await sendText(from,`🔄 *Restarting Questionnaire - Fill again correctly*\n\n*Q1/3: Messages per month?*`);
  await sendButtons(from,"Select:",[
    {id:"wpbs_q1_l1", title:"Upto 1000"},
    {id:"wpbs_q1_l2", title:"1000-5000"},
    {id:"wpbs_q1_l3", title:"Above 5000"}
  ]);
  return res.sendStatus(200);
}
if(input.startsWith("wpbs_pay_")){
  let lvl=input.split("_").pop().toUpperCase();
  setPendingChat(from,s.lang,"WPBS_PAYMENT");
  await logAllChat(from,'WPBS','PAYMENT_LINK_SENT_'+lvl,s.lang,'WPBS_PAYMENT',WPBS_PAYMENT_LINK);
  await sendText(from,`💳 *Pay ${WPBS_AMOUNT} Advance to Lock ${lvl}*\n\n🔒 *Lock Your WPBS Plan (${lvl}):*\n👉 ${WPBS_PAYMENT_LINK}\n\n✅ *After Payment:*\n✓ Razorpay auto-sends receipt to phone/email - No upload needed\n✓ Team calls you in 2 hrs on *${CONTACT_NUMBER}* for demo & setup\n✓ Balance after live demo\n\n❓ Help? Call: ${CONTACT_NUMBER}`);
  await sendButtons(from,"After payment click:",[
    {id:"wpbs_paid",title:"I Paid - Confirm"},
    {id:"menu",title:"Main Menu"}
  ]);
  return res.sendStatus(200);
}
if(input==="wpbs_paid"){
  let lvl = s.form?.wpbs?.recommended || "L1";
  let total = lvl==="L1"?4999:lvl==="L2"?9999:14999;
  let balance = total-2500;
  const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
  const q1 = s.form?.wpbs?.q1_lvl || "L1";
  const q2 = s.form?.wpbs?.q2_lvl || "L1";
  const q3 = s.form?.wpbs?.q3_lvl || "L1";
  const q1T = s.form?.wpbs?.q1_text || "";
  const q2T = s.form?.wpbs?.q2_text || "";
  const q3T = s.form?.wpbs?.q3_text || "";
  const sheetRow=[dateStr,from,'WPBS_Lead',`WPBS ${lvl} - Advance 2500 - Q1:${q1}(${q1T}) Q2:${q2}(${q2T}) Q3:${q3}(${q3T}) => ${lvl} | Total ${total}`,from,from,'',`PAID_${lvl}`,s.lang];
  await appendToSheet(sheetRow);
  await logAllChat(from,'WPBS_Lead','PAID_CONFIRMED_'+lvl,s.lang,'WPBS_PAID',`Advance 2500 Paid | ${lvl} | Q1:${q1} Q2:${q2} Q3:${q3} | Balance ${balance}`);
  clearPendingChat(from);
  await sendText(from,`🎉 *Thank you for locking WPBS ${lvl} Plan! ✅*\n\n✅ Payment of ${WPBS_AMOUNT} Advance received (Razorpay receipt auto-sent)\n\n📊 Your Final Plan: *${lvl}*\n💰 Total: ₹${total} | Paid: ₹2500 | Balance: ₹${balance} payable after demo\n\n📊 Your Requirement:\n• Msgs: ${q1T} (${q1})\n• Numbers: ${q2T} (${q2})\n• Ads: ${q3T} (${q3})\n\n📞 *Next Step:* Our team will call you in 2 hours on *${CONTACT_NUMBER}* for demo & final confirmation.\n🚀 Deployment from *DAY 8* Onwards\n\n📞 Support: ${CONTACT_NUMBER}\n🌐 ${WEBSITE}`);
  s.stage="COMPLETED_WPBS";
  return res.sendStatus(200);
}
const VALID_IDS=['lang_en','lang_hi','lang_ml','english','hindi','malayalam','customer','driver','business','opportunity','opportunities_franchise','view_opp_levels','opp_search','franchise_opportunity','opp_1','opp_2','opp_3','opp_4','opp_5','opp_yes','opp_no','activate','driver_benefit','driver_claim','business_list','menu','view_opp_levels','occ_running','occ_planning','occ_employee','occ_partner','occ_nri','occ_retired','wpbs','wpbs_payment','wpbs_paid','wpbs_info','wpbs_q1_l1','wpbs_q1_l2','wpbs_q1_l3','wpbs_q2_l1','wpbs_q2_l2','wpbs_q2_l3','wpbs_q3_l1','wpbs_q3_l2','wpbs_q3_l3','wpbs_pay_l1','wpbs_pay_l2','wpbs_pay_l3','wpbs_restart','hi','hello','hey','hlo','start','hai'];
const isInteractive=msg.type==="interactive";
const isValidButton=VALID_IDS.some(v=>input===v||input.includes(v)||inputUpper===v.toUpperCase())||isInteractive;
if(!isValidButton &&!["FORM_NAME","FORM_CONTACT","FORM_PLACE","FORM_OCCUPATION","BUSINESS_DATA","AD_SELECTION","WPBS_Q1","WPBS_Q2","WPBS_Q3","WPBS_RECOMMENDED","WPBS_PAYMENT"].includes(s.stage)){
  console.log(`[CATCH-ALL] Invalid "${rawText||rawId}" -> Welcome`);
  await logAllChat(from,'CATCH_ALL','INVALID_INPUT',s.lang,'WELCOME_SENT',`Invalid: ${rawText||rawId}`.substring(0,150));
  s.stage="LANG";setPendingChat(from,s.lang,"LANG_SELECTION");await sendWelcomeTextAndLanguage(from);return res.sendStatus(200);
}
if(s.stage==="NEW"||["hi","hello","hey","hlo","start","hai"].includes(input)){
  s.stage="LANG";s.form={};s.lastOpp="";setPendingChat(from,s.lang,"LANG_SELECTION");
  await logAllChat(from,'CHAT_STARTED','NEW_USER_HI',s.lang,'LANG_SELECTION','User said HI');
  await sendImage(from,ASSETS.posters.welcome,"👋 Welcome to Bizmapia! Your Success, Our Platform 🙏\n\nThank you for reaching out!");
  await new Promise(r=>setTimeout(r,800));
  await sendButtons(from,"Select language / भाषा चुनें / ഭാഷ തിരഞ്ഞെടുക്കുക",[{id:"lang_en",title:"English"},{id:"lang_hi",title:"Hindi"},{id:"lang_ml",title:"Malayalam"}]);
  return res.sendStatus(200);
}
if(s.stage==="LANG"||input.startsWith("lang_")){
  if(input.includes("en"))s.lang="EN";else if(input.includes("hi"))s.lang="HI";else if(input.includes("ml"))s.lang="ML";
  s.stage="AD_SELECTION";
  setPendingChat(from,s.lang,"AD_SELECTION");
  await logAllChat(from,'LANGUAGE_SELECTED','ACTIVE',s.lang,'AD_SELECTION',`Selected ${s.lang}`);
  const caption=`🎯 *SELECT YOUR OPTION FROM POSTERS*\n\nYou saw our ad! Which opportunity are you interested in?\n\n*Left - WHATSAPP AUTOMATION (WPBS):*\n✅ Low-cost Business Automation\n💰 Starts from ₹4999/- Onwards\n🚀 Deployment from Day 8\n📞 ${CONTACT_NUMBER}\n\n*Right - BUSINESS OPPORTUNITY:*\n✅ 4 Opportunities Under One Brand\n✅ 50+ Franchisees Allotted in Kerala\n💰 1L to 15L Investment\n\n👇 *Please select your option below:*`;
  await sendImage(from,ASSETS.posters.selectOption,caption);
  await new Promise(r=>setTimeout(r,1000));
  await sendButtons(from,"Select your option:",[{id:"wpbs",title:"WhatsApp Automation"},{id:"opportunity",title:"Business Opportunity"}]);
  return res.sendStatus(200);
}
if(input==="customer"){setPendingChat(from,s.lang,"CUSTOMER_VIEWED");await logAllChat(from,'MENU_CLICK','CUSTOMER',s.lang,'CUSTOMER_VIEWED','Clicked Customer');await sendImage(from,ASSETS.posters.customer,`${getT(s.lang,"customerH")}\n✅ Taxi ✅ Delivery ✅ Business Offers\nContact: ${CONTACT_NUMBER}`);await new Promise(r=>setTimeout(r,800));await sendText(from,`📲 *Download Customer App:*\n${ASSETS.apps.customer}`);await sendButtons(from,getT(s.lang,"whatToKnow"),[{id:"activate",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(input==="activate"){clearPendingChat(from);await logAllChat(from,'CUSTOMER','APP_DOWNLOAD',s.lang,'ACTIVATE','Customer app');await sendText(from,`✅ *Offer Activated!*\nOpen app:\n📲 ${ASSETS.apps.customer}`);return res.sendStatus(200);}
if(input==="driver"){setPendingChat(from,s.lang,"DRIVER_VIEWED");await logAllChat(from,'MENU_CLICK','DRIVER',s.lang,'DRIVER_VIEWED','Clicked Driver');await sendImage(from,ASSETS.posters.driver,`${getT(s.lang,"driverH")}\nAuto Rs.33 / Car Rs.49\nContact: ${CONTACT_NUMBER}`);await new Promise(r=>setTimeout(r,800));await sendText(from,`📲 Download Driver App:\n${ASSETS.apps.driver}`);await sendButtons(from,"Claim your free recharge:",[{id:"driver_benefit",title:"Free Recharge"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(input==="driver_benefit"){setPendingChat(from,s.lang,"DRIVER_BENEFIT");await logAllChat(from,'DRIVER','BENEFIT_VIEWED',s.lang,'DRIVER_BENEFIT','Viewed free recharge');await sendImage(from,ASSETS.posters.freeRecharge,"🎉 *FREE Recharge Benefit!*\n33 Rs Recharge = 24hr Unlimited Trips");await new Promise(r=>setTimeout(r,800));await sendText(from,`📲 Get FREE Recharge:\n${ASSETS.apps.driver}`);await sendButtons(from,"Claim:",[{id:"driver_claim",title:"Claim Now"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(input==="driver_claim"){clearPendingChat(from);await logAllChat(from,'DRIVER','CLAIMED',s.lang,'DRIVER_CLAIM','Free recharge claimed');await sendText(from,`✅ *Your free recharge going to activate*\n📲 ${ASSETS.apps.driver}`);addReminder(from,"Driver_FreeRecharge");s.stage="MENU";return res.sendStatus(200);}
if(input==="business"){setPendingChat(from,s.lang,"BUSINESS_VIEWED");await logAllChat(from,'MENU_CLICK','BUSINESS',s.lang,'BUSINESS_VIEWED','Clicked Business');await sendImage(from,ASSETS.posters.business,`${getT(s.lang,"businessH")}\nGet More Local Visibility`);await new Promise(r=>setTimeout(r,800));await sendButtons(from,"Register your business",[{id:"business_list",title:"How to List"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(input==="business_list"){setPendingChat(from,s.lang,"BUSINESS_FORM_PENDING");await logAllChat(from,'BUSINESS','FORM_STARTED',s.lang,'BUSINESS_FORM_PENDING','Started business form');await sendImage(from,ASSETS.posters.businessBenefit,"🎉 *Benefit 1 Year Subscription and Get Discount*");await new Promise(r=>setTimeout(r,1000));await sendText(from,"📝 *Send business details in ONE message:*\n\nShop Name:\nMobile:\nCategory:\nLocation:");s.stage="BUSINESS_DATA";s.lastOpp="Business";return res.sendStatus(200);}
if(["opportunity","opportunities_franchise","view_opp_levels","opp_search","franchise_opportunity"].includes(input)){setPendingChat(from,s.lang,"FRANCHISE_OPPORTUNITY_VIEWED");await logAllChat(from,'MENU_CLICK','FRANCHISE',s.lang,'FRANCHISE_OPPORTUNITY','Clicked Business Opportunity - Right Poster');await sendImage(from,ASSETS.posters.opportunity,`${getT(s.lang,"oppH")}\n${getT(s.lang,"oppSub")}\nContact: ${CONTACT_NUMBER} | ${EMAIL_ID}`);await new Promise(r=>setTimeout(r,800));await sendText(from,`🎥 Watch About Bizmapia:\n${ASSETS.videos.main_opp}`);await new Promise(r=>setTimeout(r,800));await sendList(from,`💰 Select Franchise Level:\nDistrict 10L-15L (5Y, 12M Ads)\nMuni/Corp 4L-5L (3Y, 12M Ads)\nBusiness Center 1L (1Y, 3M Ads)`,"View Opportunities",[{title:"All Franchise Opportunities",rows:[{id:"opp_1",title:"District Franchisee",description:"💰 10L-15L | 5Y | 12M Ads"},{id:"opp_2",title:"Corporation Franchisee",description:"💰 5L | 3Y | 12M Ads"},{id:"opp_3",title:"Municipality Franchisee",description:"💰 4L | 3Y | 12M Ads"},{id:"opp_4",title:"Business Center - Taxi",description:"💰 1L | 1Y | 3M Ads"},{id:"opp_5",title:"Business Center - Directory",description:"💰 1L | 1Y | 3M Ads"}]}]);await new Promise(r=>setTimeout(r,1200));await sendButtons(from,"👇 If list not visible:",[{id:"opp_1",title:"District (10L-15L)"},{id:"opp_2",title:"Corporation (5L)"},{id:"opp_3",title:"Municipality (4L)"}]);await new Promise(r=>setTimeout(r,800));await sendButtons(from,"More:",[{id:"opp_4",title:"Taxi Center (1L)"},{id:"opp_5",title:"Directory (1L)"},{id:"menu",title:"Main Menu"}]);return res.sendStatus(200);}
if(["opp_1","opp_2","opp_3","opp_4","opp_5"].includes(input)){s.lastOpp=inputUpper;setPendingChat(from,s.lang,`OPP_${input}_VIEWED`);await logAllChat(from,'FRANCHISE_LEVEL','VIEWED',s.lang,`OPP_${input}_VIEWED`,getOppName(input));await sendImage(from,ASSETS.posters.opportunity,`💼 *${getOppName(input)}*`);await new Promise(r=>setTimeout(r,800));await sendText(from,getOppFeeCard(input));await new Promise(r=>setTimeout(r,800));await sendText(from,`🎥 Watch full awareness:\n${ASSETS.videos[input]}\nContact: ${CONTACT_NUMBER}`);if(oppTimers[from])clearTimeout(oppTimers[from]);oppTimers[from]=setTimeout(async()=>{await sendButtons(from,`⏰ ${getT(s.lang,"yesNoQ")}`,[{id:"opp_yes",title:"Yes"},{id:"opp_no",title:"No"},{id:"opp_search",title:"Search Other"}]);},5*60*1000);await new Promise(r=>setTimeout(r,800));await sendButtons(from,getT(s.lang,"yesNoQ"),[{id:"opp_yes",title:"Yes"},{id:"opp_no",title:"No"},{id:"opp_search",title:"Search Other"}]);return res.sendStatus(200);}
if(input==="opp_yes"){if(oppTimers[from])clearTimeout(oppTimers[from]);s.stage="FORM_NAME";s.form={};setPendingChat(from,s.lang,"FORM_NAME");await logAllChat(from,'FRANCHISE','YES_CLICKED',s.lang,'FORM_NAME',`Said YES to ${s.lastOpp}`);await sendText(from,getT(s.lang,"formName"));return res.sendStatus(200);}
if(input==="opp_no"){if(oppTimers[from])clearTimeout(oppTimers[from]);clearPendingChat(from);await logAllChat(from,'FRANCHISE','NO_OPTED_OUT',s.lang,'OPTED_OUT',`Said NO to ${s.lastOpp}`);await sendText(from,`You are opted out 🙏\nType *HI* to start again.\nContact: ${CONTACT_NUMBER}`);s.stage="NEW";return res.sendStatus(200);}
if(input==="menu"||input==="view_opp_levels"){s.stage="MENU";setPendingChat(from,s.lang,"MAIN_MENU");await logAllChat(from,'MENU','MAIN_MENU',s.lang,'MAIN_MENU','Back to main menu');await sendList(from,getT(s.lang,"whatToKnow"),"Main Menu",[{title:"Menu",rows:getMainMenuRows(s.lang)}]);return res.sendStatus(200);}
if(s.stage==="MENU"){setPendingChat(from,s.lang,"MAIN_MENU");await sendList(from,getT(s.lang,"selectMenu"),"Main Menu",[{title:"Menu",rows:getMainMenuRows(s.lang)}]);return res.sendStatus(200);}
await sendText(from,getT(s.lang,"hiAgain"));res.sendStatus(200);}catch(err){console.log(err);res.sendStatus(200);}});
app.post('/razorpay-webhook',(req,res)=>{console.log("Razorpay:",req.body.event);res.status(200).send("OK");});
app.listen(PORT,()=>console.log(`Bizmapia GOD MODE + WPBS 3Q Enhanced Comparison Running on ${PORT}`));
