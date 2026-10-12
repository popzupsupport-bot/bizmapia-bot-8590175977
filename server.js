// V10 FIXED - ALL LIST LIMITS CHECKED - PROPER MALAYALAM/HINDI - BIZMAPIA ONLY
const express=require('express');const bodyParser=require('body-parser');const axios=require('axios');const fs=require('fs');const {google}=require('googleapis');const app=express();app.use(bodyParser.json());
const VERIFY_TOKEN=process.env.VERIFY_TOKEN||"bizmapia_verify_2024";
const TOKEN=process.env.WHATSAPP_TOKEN;const PHONE_NUMBER_ID=process.env.PHONE_NUMBER_ID;const PORT=process.env.PORT||10000;
const SHEET_ID=(process.env.GOOGLE_SHEET_ID||"1MnPTAMafVTuSX2uQKCpP6GKKadQBLXfrgnySigY8cHY").trim();
const CONTACT_NUMBER="8590175977";
console.log("========== V10 FIXED ALL LIMITS - "+SHEET_ID.substring(0,20)+" ==========");

const ASSETS={
 posters:{
  welcome:"https://files.catbox.moe/zmj6te.jpg",
  customer:"https://files.catbox.moe/nbjslu.jpg",
  driver:"https://files.catbox.moe/2trzp7.jpg",
  business:"https://files.catbox.moe/sylcqa.jpg",
  opportunity:"https://files.catbox.moe/y8m3lq.jpg",
  freeRecharge:"https://files.catbox.moe/c03g3q.jpg",
  franchiseBrochure:"https://files.catbox.moe/FRANCHISEE-NEW-BIZMAPIA.jpg",
  businessBrochure:"https://files.catbox.moe/BUSINESS-NEW-BIZMAPIA.jpg",
  onlineDelivery:"https://bizmapia.com/posters/online-delivery.jpg",
  onlineBooking:"https://bizmapia.com/posters/online-booking.jpg"
 },
 apps:{
  customer:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia",
  driver:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia_driver",
  bizDirCustomer:"https://play.google.com/store/apps/details?id=com.bizmapia.directory.customer",
  bizDirMerchant:"https://play.google.com/store/apps/details?id=com.bizmapia.directory.merchant",
  deliveryAgent:"https://play.google.com/store/apps/details?id=com.bizmapia.delivery",
  booking:"https://play.google.com/store/apps/details?id=com.bizmapia.booking"
 },
 tenders:{district:"https://bizmapia.com/tenders/district.pdf",corp:"https://bizmapia.com/tenders/corporation.pdf",bc:"https://bizmapia.com/tenders/business_center.pdf"},
 payments:{registration:"https://rzp.io/l/bizmapia5000"},
 calendar:"https://calendly.com/bizmapia/agreement"
};

// FIXED: All button titles <20 chars, row titles <24, descriptions <72
const LANG_TEXT={
 EN:{
  welcome:"Welcome to Bizmapia! Explore services, book rides, or partner with us.",
  tapExplore:"Tap to explore:", selectLang:"Please select your preferred language:", mainMenuTitle:"Select an option to continue:", mainMenuBtn:"Menu",
  ride:"Ride Service", rideDesc:"Book ride or attach vehicle", bizDir:"Biz Directory", bizDirDesc:"Search or list business", delivery:"Delivery", deliveryDesc:"Parcel & agent", booking:"Booking", bookingDesc:"Room, Appt, Cinema", earn:"Franchise", earnDesc:"Earn 1L-15L",
  rideMenu:"Ride-Hailing! What to do?", bookRide:"Book Ride", attachVehicle:"Attach Vehicle",
  customerH:"CUSTOMER - Book Taxi", driverH:"DRIVER - Attach Vehicle!",
  bizDirCaption:"Find local businesses or list yours!", bizDirChoose:"Choose:", searchBiz:"Search Biz", listBiz:"List Biz",
  deliveryCaption:"Fast local deliveries.", deliveryChoose:"Select:", bookParcel:"Book Parcel", registerAgent:"Join as Agent",
  bookingCaption:"What to book today?", bookingChoose:"Select booking:", bookRoom:"Room", bookAppt:"Appointment", bookCinema:"Cinema",
  earnCaption:"Business Opportunities! Choose level:", earnList:"Select level:", highEarn:"High Earning", highDesc:"District Franchisee", modEarn:"Moderate", modDesc:"Corp/Muni Franchisee", baseEarn:"Base", baseDesc:"Business Center",
  watchedQ:"Watched video?", yes:"Yes", no:"No", watchFirst:"Please watch full video first:",
  benefitsDistrict:"Benefits: 1: Earn % on all Corp/Muni & BC revenue 2: Exclusive contact 3: 5-Year MOU", benefitsCorp:"Benefits: 1: Earn % on BC 2: Direct to District 3: 3-Year MOU", benefitsBC:"Benefits: 1: 1-Year MOU",
  knowSupport:"Support", supportDistrict:"Support: 1: 12M marketing 2: 6M rent 3: 6M salary", supportCorp:"Support: 1: 12M marketing 2: 6M rent", supportBC:"Support: 1: 3M marketing",
  knowReq:"Requirements", reqDistrict:"Req: 1: >=100 sq.ft 2: 1 staff 3: PC/Phone/Net", reqCorp:"Req: 1: >=50 sq.ft 2: 1 staff", reqBC:"Req: 1: >=50 sq.ft",
  submitApp:"Apply Now", categoryQ:"Does your district have Corp?", corpLocQ:"Inside Corp location?", bcLocQ:"Corp or Muni area?",
  corpYes:"Yes", corpNo:"No", feeCorpDistrict:"Corp District Fee Rs 15 Lakhs.", feeNonCorpDistrict:"Non-Corp Fee Rs 10 Lakhs.", feeCorp:"Fee Rs 5 Lakhs.", feeMuni:"Fee Rs 4 Lakhs.", feeBC:"Fee Rs 1 Lakh.",
  readyYes:"Yes Ready", emi:"EMI Options", payFee:"Pay registration fee:", payCheck:"Payment done?", payYes:"Yes Paid", payNo:"Pay Now",
  formName:"*Name:* Enter full name:", formContact:"*Contact:* Enter mobile:", formPlace:"*Place:* Enter city:", formOcc:"*Occupation:* Select:", thanksEnq:"Thank you", team24:"Team will contact in 24h", tenderMsg:"Download Tender & Book Slot:", yesNoQ:"Grab this opportunity?",
  remLang:"Reminder: Select language. Call 8590175977", remDriver5:"How to attach vehicle - Watch!", remDriver15:"Get 1-Year Free Recharge!", remDriver1h:"Free Recharge expiring!", remDriver12h:"Need help registering?", remDriver24h:"Free Recharge expiring soon!", remDriver48h:"Last Chance Free Recharge!", remDriver72h:"Free Recharge expired.", grabNow:"Grab Now", contactSupport:"Support", registerAgain:"Register"
 },
 HI:{
  welcome:"Bizmapia में स्वागत है! सेवाओं का अन्वेषण करें, राइड बुक करें।",
  tapExplore:"एक्सप्लोर करें:", selectLang:"भाषा चुनें:", mainMenuTitle:"जारी रखने के लिए विकल्प चुनें:", mainMenuBtn:"मेनू",
  ride:"राइड सेवा", rideDesc:"राइड बुक करें", bizDir:"बिजनेस लिस्ट", bizDirDesc:"बिजनेस खोजें", delivery:"डिलीवरी", deliveryDesc:"पार्सल सेवा", booking:"बुकिंग", bookingDesc:"रूम, अपॉइंटमेंट", earn:"फ्रेंचाइजी", earnDesc:"1L-15L कमाएं",
  rideMenu:"राइड सेवा! क्या करना है?", bookRide:"राइड बुक करें", attachVehicle:"वाहन जोड़ें",
  customerH:"कस्टमर - टैक्सी बुक करें", driverH:"ड्राइवर - वाहन जोड़ें!", bizDirCaption:"स्थानीय व्यवसाय खोजें या लिस्ट करें!", bizDirChoose:"चुनें:", searchBiz:"खोजें", listBiz:"लिस्ट करें",
  deliveryCaption:"तेज़ डिलीवरी सेवा।", deliveryChoose:"चुनें:", bookParcel:"पार्सल बुक", registerAgent:"एजेंट बनें",
  bookingCaption:"आज क्या बुक करना है?", bookingChoose:"बुकिंग चुनें:", bookRoom:"रूम", bookAppt:"अपॉइंटमेंट", bookCinema:"सिनेमा",
  earnCaption:"बिजनेस अवसर! स्तर चुनें:", earnList:"स्तर चुनें:", highEarn:"हाई अर्निंग", highDesc:"जिला फ्रेंचाइजी", modEarn:"मध्यम", modDesc:"कॉर्प फ्रेंचाइजी", baseEarn:"बेस", baseDesc:"बिजनेस सेंटर",
  watchedQ:"वीडियो देखा?", yes:"हाँ", no:"नहीं", watchFirst:"पहले वीडियो देखें:",
  benefitsDistrict:"लाभ: 1: सभी राजस्व पर % 2: विशेष संपर्क 3: 5-वर्ष MOU", benefitsCorp:"लाभ: 1: BC पर % 2: जिला से संबंध 3: 3-वर्ष MOU", benefitsBC:"लाभ: 1: 1-वर्ष MOU",
  knowSupport:"सपोर्ट", supportDistrict:"सपोर्ट: 1: 12M मार्केटिंग 2: 6M किराया 3: 6M वेतन", supportCorp:"सपोर्ट: 1: 12M मार्केटिंग 2: 6M किराया", supportBC:"सपोर्ट: 1: 3M मार्केटिंग",
  knowReq:"जरूरतें", reqDistrict:"जरूरत: 1: 100 sq.ft 2: 1 स्टाफ 3: PC/फोन", reqCorp:"जरूरत: 1: 50 sq.ft 2: 1 स्टाफ", reqBC:"जरूरत: 1: 50 sq.ft",
  submitApp:"आवेदन करें", categoryQ:"जिले में कॉर्पोरेशन है?", corpLocQ:"कॉर्प में लोकेशन?", bcLocQ:"कॉर्प या मुनि एरिया?",
  corpYes:"हाँ", corpNo:"नहीं", feeCorpDistrict:"कॉर्प जिला फीस ₹15 लाख।", feeNonCorpDistrict:"नॉन-कॉर्प फीस ₹10 लाख।", feeCorp:"फीस ₹5 लाख।", feeMuni:"फीस ₹4 लाख।", feeBC:"फीस ₹1 लाख।",
  readyYes:"हाँ तैयार", emi:"EMI देखें", payFee:"रजिस्ट्रेशन फीस भरें:", payCheck:"पेमेंट हुआ?", payYes:"हाँ हुआ", payNo:"अभी भरें",
  formName:"*नाम:* पूरा नाम लिखें:", formContact:"*नंबर:* मोबाइल लिखें:", formPlace:"*जगह:* शहर लिखें:", formOcc:"*काम:* चुनें:", thanksEnq:"धन्यवाद", team24:"24 घंटे में संपर्क करेंगे", tenderMsg:"टेंडर डाउनलोड करें:", yesNoQ:"अवसर लेना है?",
  remLang:"रिमाइंडर: भाषा चुनें 8590175977", remDriver5:"वाहन कैसे जोड़ें - देखें!", remDriver15:"1 साल फ्री रिचार्ज पाएं!", remDriver1h:"फ्री रिचार्ज खत्म हो रहा!", remDriver12h:"मदद चाहिए?", remDriver24h:"फ्री रिचार्ज जल्द खत्म!", remDriver48h:"आखिरी मौका!", remDriver72h:"फ्री रिचार्ज खत्म।", grabNow:"अभी लें", contactSupport:"सपोर्ट", registerAgain:"फिर रजिस्टर"
 },
 ML:{
  welcome:"Bizmapia-ലേക്ക് സ്വാഗതം! സേവനങ്ങൾ കാണുക, റൈഡ് ബുക്ക് ചെയ്യുക.",
  tapExplore:"കാണുക:", selectLang:"ഭാഷ തിരഞ്ഞെടുക്കുക:", mainMenuTitle:"തുടരാൻ ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:", mainMenuBtn:"മെനു",
  ride:"റൈഡ് സേവനം", rideDesc:"റൈഡ് ബുക്ക് ചെയ്യുക", bizDir:"ബിസിനസ് ലിസ്റ്റ്", bizDirDesc:"ബിസിനസ് തിരയുക", delivery:"ഡെലിവറി", deliveryDesc:"പാർസൽ സേവനം", booking:"ബുക്കിംഗ്", bookingDesc:"റൂം, അപ്പോയിന്റ്മെന്റ്", earn:"ഫ്രാഞ്ചൈസി", earnDesc:"1L-15L നേടൂ",
  rideMenu:"റൈഡ് സേവനം! എന്ത് ചെയ്യണം?", bookRide:"റൈഡ് ബുക്ക്", attachVehicle:"വാഹനം ചേർക്കുക",
  customerH:"കസ്റ്റമർ - ടാക്സി ബുക്ക്", driverH:"ഡ്രൈവർ - വാഹനം ചേർക്കൂ!", bizDirCaption:"ബിസിനസുകൾ കണ്ടെത്തുക അല്ലെങ്കിൽ ലിസ്റ്റ് ചെയ്യുക!", bizDirChoose:"തിരഞ്ഞെടുക്കുക:", searchBiz:"തിരയുക", listBiz:"ലിസ്റ്റ് ചെയ്യുക",
  deliveryCaption:"വേഗത്തിലുള്ള ഡെലിവറി।", deliveryChoose:"തിരഞ്ഞെടുക്കുക:", bookParcel:"പാർസൽ ബുക്ക്", registerAgent:"ഏജന്റ് ആകുക",
  bookingCaption:"ഇന്ന് എന്ത് ബുക്ക് ചെയ്യണം?", bookingChoose:"ബുക്കിംഗ് തിരഞ്ഞെടുക്കുക:", bookRoom:"റൂം", bookAppt:"അപ്പോയിന്റ്മെന്റ്", bookCinema:"സിനിമ",
  earnCaption:"ബിസിനസ് അവസരം! ലെവൽ തിരഞ്ഞെടുക്കുക:", earnList:"ലെവൽ തിരഞ്ഞെടുക്കുക:", highEarn:"ഉയർന്ന വരുമാനം", highDesc:"ജില്ലാ ഫ്രാഞ്ചൈസി", modEarn:"മിതമായ", modDesc:"കോർപ്പ് ഫ്രാഞ്ചൈസി", baseEarn:"ബേസ്", baseDesc:"ബിസിനസ് സെന്റർ",
  watchedQ:"വീഡിയോ കണ്ടോ?", yes:"അതെ", no:"അല്ല", watchFirst:"ദയവായി വീഡിയോ കാണുക:",
  benefitsDistrict:"ആനുകൂല്യം: 1: എല്ലാ വരുമാനത്തിൽ % 2: പ്രത്യേക ബന്ധം 3: 5 വർഷ MOU", benefitsCorp:"ആനുകൂല്യം: 1: BC വരുമാനത്തിൽ % 2: ജില്ലയുമായി ബന്ധം 3: 3 വർഷ MOU", benefitsBC:"ആനുകൂല്യം: 1: 1 വർഷ MOU",
  knowSupport:"സപ്പോർട്ട്", supportDistrict:"സപ്പോർട്ട്: 1: 12M മാർക്കറ്റിംഗ് 2: 6M വാടക 3: 6M ശമ്പളം", supportCorp:"സപ്പോർട്ട്: 1: 12M മാർക്കറ്റിംഗ് 2: 6M വാടക", supportBC:"സപ്പോർട്ട്: 1: 3M മാർക്കറ്റിംഗ്",
  knowReq:"ആവശ്യകത", reqDistrict:"ആവശ്യം: 1: 100 sq.ft 2: 1 സ്റ്റാഫ് 3: PC/ഫോൺ", reqCorp:"ആവശ്യം: 1: 50 sq.ft 2: 1 സ്റ്റാഫ്", reqBC:"ആവശ്യം: 1: 50 sq.ft",
  submitApp:"അപേക്ഷിക്കൂ", categoryQ:"ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?", corpLocQ:"കോർപ്പറേഷനിൽ ആണോ?", bcLocQ:"കോർപ്പോ/മുനിയോ?",
  corpYes:"അതെ", corpNo:"അല്ല", feeCorpDistrict:"കോർപ്പ് ജില്ലാ ഫീസ് ₹15 ലക്ഷം।", feeNonCorpDistrict:"നോൺ-കോർപ്പ് ഫീസ് ₹10 ലക്ഷം।", feeCorp:"ഫീസ് ₹5 ലക്ഷം।", feeMuni:"ഫീസ് ₹4 ലക്ഷം।", feeBC:"ഫീസ് ₹1 ലക്ഷം।",
  readyYes:"അതെ റെഡി", emi:"EMI കാണുക", payFee:"ഫീസ് അടയ്ക്കുക:", payCheck:"പേയ്മെന്റ് ചെയ്തോ?", payYes:"അതെ ചെയ്തു", payNo:"ഇപ്പോൾ അടയ്ക്കൂ",
  formName:"*പേര്:* പേര് നൽകുക:", formContact:"*ഫോൺ:* നമ്പർ നൽകുക:", formPlace:"*സ്ഥലം:* സ്ഥലം നൽകുക:", formOcc:"*ജോലി:* തിരഞ്ഞെടുക്കുക:", thanksEnq:"നന്ദി", team24:"24 മണിക്കൂറിൽ ബന്ധപ്പെടും", tenderMsg:"ടെൻഡർ ഡൗൺലോഡ് ചെയ്യുക:", yesNoQ:"അവസരം എടുക്കണോ?",
  remLang:"റിമൈൻഡർ: ഭാഷ തിരഞ്ഞെടുക്കുക 8590175977", remDriver5:"വാഹനം എങ്ങനെ ചേർക്കാം - കാണുക!", remDriver15:"1 വർഷത്തെ ഫ്രീ റീചാർജ് നേടൂ!", remDriver1h:"ഫ്രീ റീചാർജ് അവസാനിക്കുന്നു!", remDriver12h:"സഹായം വേണോ?", remDriver24h:"ഫ്രീ റീചാർജ് ഉടൻ തീരും!", remDriver48h:"അവസാന അവസരം!", remDriver72h:"ഫ്രീ റീചാർജ് തീർന്നു।", grabNow:"ഇപ്പോൾ നേടുക", contactSupport:"സപ്പോർട്ട്", registerAgain:"വീണ്ടും"
 }
};
const getT=(l,k)=>(LANG_TEXT[l]&&LANG_TEXT[l][k])||LANG_TEXT.EN[k];
let sheetsClientCache=null;
async function getSheetsClient(){try{let creds=process.env.GOOGLE_CREDENTIALS;if(!creds)return null;let credentials=JSON.parse(creds);if(credentials.private_key)credentials.private_key=credentials.private_key.replace(/\\\\n/g,'\n');if(sheetsClientCache)return sheetsClientCache;const auth=new google.auth.GoogleAuth({credentials,scopes:['https://www.googleapis.com/auth/spreadsheets']});const client=await auth.getClient();const sheets=google.sheets({version:'v4',auth:client});sheetsClientCache=sheets;return sheets;}catch(e){return null;}}
async function appendToSheet(row){try{const sheets=await getSheetsClient();if(!sheets)return false;await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID,range:'Sheet1!A:I',valueInputOption:'USER_ENTERED',insertDataOption:'INSERT_ROWS',requestBody:{values:[row]}});return true;}catch(e){return false;}}
async function logAllChat(phone,type,status,lang,stage,extra=''){try{const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});const row=[dateStr,phone,type,`${stage} | ${type} | ${status} | ${extra}`.substring(0,490),phone,stage,`${lang} | ${status}`,extra.substring(0,200),lang];await appendToSheet(row);}catch(e){}}
const sessions={};const processedIds=new Set();let pendingChats={}; let driverReminders=[];
async function ensureSheetTab(sheets, title){try{const meta=await sheets.spreadsheets.get({spreadsheetId:SHEET_ID});const exists=meta.data.sheets.some(s=>s.properties.title===title);if(!exists){await sheets.spreadsheets.batchUpdate({spreadsheetId:SHEET_ID, requestBody:{requests:[{addSheet:{properties:{title}}}]}});}}catch(e){}}
async function savePendingToSheet(){try{const sheets=await getSheetsClient();if(!sheets)return;await ensureSheetTab(sheets,"PendingChats");await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID, range:'PendingChats!A2:E'});const rows=Object.keys(pendingChats).map(p=>[p, pendingChats[p].lang, pendingChats[p].stage, pendingChats[p].lastActivity, JSON.stringify(pendingChats[p].reminders)]);if(rows.length>0)await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID, range:'PendingChats!A:E', valueInputOption:'USER_ENTERED', requestBody:{values: rows}});}catch(e){}}
async function loadPendingFromSheet(){try{const sheets=await getSheetsClient();if(!sheets)return {};await ensureSheetTab(sheets,"PendingChats");const res=await sheets.spreadsheets.values.get({spreadsheetId:SHEET_ID, range:'PendingChats!A2:E'});const rows=res.data.values||[];let out={};rows.forEach(r=>{if(r[0])out[r[0]]={lang:r[1]||'EN', stage:r[2], lastActivity:parseInt(r[3]), reminders:JSON.parse(r[4]||'{"r1":false,"r2":false,"r3":false,"r4":false}')};});return out;}catch(e){return {};}}
function setPendingChat(phone,lang,stageName){if(!pendingChats[phone])pendingChats[phone]={lang:lang||"EN",stage:stageName,lastActivity:Date.now(),reminders:{r1:false,r2:false,r3:false,r4:false}};else{pendingChats[phone].lang=lang||pendingChats[phone].lang;pendingChats[phone].stage=stageName;pendingChats[phone].lastActivity=Date.now();pendingChats[phone].reminders={r1:false,r2:false,r3:false,r4:false};}savePendingToSheet();}
function clearPendingChat(phone){if(pendingChats[phone]){delete pendingChats[phone];savePendingToSheet();}}
function getSession(p){if(!sessions[p])sessions[p]={lang:"EN",stage:"NEW",lastOpp:"",form:{},data:{}};return sessions[p];}
async function sendText(to,body){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"text",text:{body}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){}}
async function sendImage(to,link,caption){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"image",image:{link,caption}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,caption);}}
async function sendDocument(to,link,filename){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"document",document:{link,filename}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,filename+": "+link);}}
async function sendButtons(to,body,buttons){try{const safeButtons=buttons.map(b=>({type:"reply",reply:{id:b.id,title:b.title.substring(0,20)}}));await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"button",body:{text:body.substring(0,1024)},action:{buttons:safeButtons}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
async function sendList(to,body,buttonText,sections){try{const safeSections=sections.map(sec=>({title:sec.title.substring(0,24),rows:sec.rows.map(r=>({id:r.id,title:r.title.substring(0,24),description:(r.description||"").substring(0,72)}))}));await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"list",body:{text:body.substring(0,1024)},action:{button:buttonText.substring(0,20),sections:safeSections}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){console.log("List failed:",e.response?.data||e.message);await sendText(to,body);}}
async function sendContactWithCallUrl(to,body){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"cta_url",body:{text:body},action:{name:"cta_url",parameters:{display_text:"Call Now - 8590175977",url:`tel:+918590175977`}}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
function getOppName(id){const map={opp_1:"District Franchisee (10L-15L)",opp_2:"Corporation (5L)",opp_3:"Municipality (4L)",opp_4:"Biz Center Taxi (1L)",opp_5:"Biz Center Directory (1L)"};return map[id]||id;}
const OPP_MAP={'OPP_1':'District (10L-15L)','OPP_2':'Corporation (5L)','OPP_3':'Municipality (4L)','OPP_4':'Biz Center Taxi (1L)','OPP_5':'Biz Center Directory (1L)'};
async function sendWelcome(to){const s=getSession(to);await sendImage(to,ASSETS.posters.welcome,getT(s.lang,"welcome"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(s.lang,"tapExplore"),[{id:"LEARN_MORE",title:"Learn More"}]);}
async function sendLanguage(to){await sendButtons(to,"Please select your preferred language:",[{id:"lang_en",title:"English"},{id:"lang_hi",title:"Hindi (हिंदी)"},{id:"lang_ml",title:"Malayalam (മലയാളം)"}]);}
async function sendMainMenu(to){const s=getSession(to);const l=s.lang;await sendList(to,getT(l,"mainMenuTitle"),getT(l,"mainMenuBtn"),[{title:"Services",rows:[{id:"MENU_RIDE",title:getT(l,"ride"),description:getT(l,"rideDesc")},{id:"MENU_BIZDIR",title:getT(l,"bizDir"),description:getT(l,"bizDirDesc")},{id:"MENU_DELIVERY",title:getT(l,"delivery"),description:getT(l,"deliveryDesc")},{id:"MENU_BOOKING",title:getT(l,"booking"),description:getT(l,"bookingDesc")},{id:"MENU_EARN",title:getT(l,"earn"),description:getT(l,"earnDesc")}]}]);}
async function handleRideMenu(to){const l=getSession(to).lang;await sendButtons(to,getT(l,"rideMenu"),[{id:"RIDE_BOOK",title:getT(l,"bookRide")},{id:"RIDE_ATTACH",title:getT(l,"attachVehicle")}]);}
async function handleBookRide(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.customer,getT(l,"customerH")+"\nApp: "+ASSETS.apps.customer);clearPendingChat(to);}
async function handleAttachVehicle(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.driver,getT(l,"driverH")+"\nApp: "+ASSETS.apps.driver);getSession(to).stage="DRIVER_ONBOARD";addReminder(to,"Driver_FreeRecharge");}
async function handleBizDir(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.business,getT(l,"bizDirCaption"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(l,"bizDirChoose"),[{id:"BIZDIR_SEARCH",title:getT(l,"searchBiz")},{id:"BIZDIR_LIST",title:getT(l,"listBiz")}]);}
async function handleDelivery(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.onlineDelivery,getT(l,"deliveryCaption"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(l,"deliveryChoose"),[{id:"DEL_BOOK",title:getT(l,"bookParcel")},{id:"DEL_AGENT",title:getT(l,"registerAgent")}]);}
async function handleBooking(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.onlineBooking,getT(l,"bookingCaption"));await new Promise(r=>setTimeout(r,800));await sendList(to,getT(l,"bookingChoose"),getT(l,"mainMenuBtn"),[{title:"Booking",rows:[{id:"BOOK_ROOM",title:getT(l,"bookRoom")},{id:"BOOK_APPT",title:getT(l,"bookAppt")},{id:"BOOK_CINEMA",title:getT(l,"bookCinema")}]}]);}
async function handleEarnMenu(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.opportunity,getT(l,"earnCaption"));await new Promise(r=>setTimeout(r,800));await sendList(to,getT(l,"earnList"),getT(l,"mainMenuBtn"),[{title:"Franchise",rows:[{id:"opp_1",title:"District",description:"10L-15L | 5Y | 12M Ads"},{id:"opp_2",title:"Corporation",description:"5L | 3Y | 12M Ads"},{id:"opp_3",title:"Municipality",description:"4L | 3Y | 12M Ads"},{id:"opp_4",title:"BC - Taxi",description:"1L | 1Y | 3M Ads"},{id:"opp_5",title:"BC - Directory",description:"1L | 1Y | 3M Ads"}]}]);}
async function handleOppLevel(to, id){const s=getSession(to);const l=s.lang;s.lastOpp=id.toUpperCase();s.data.level=id.toUpperCase();s.stage="EARN";setPendingChat(to,l,"OPP_"+id+"_VIEWED");await sendImage(to,ASSETS.posters.opportunity,getOppName(id));await new Promise(r=>setTimeout(r,600));await sendText(to,(id==="opp_1"?getT(l,"feeCorpDistrict"):id==="opp_2"?getT(l,"feeCorp"):id==="opp_3"?getT(l,"feeMuni"):getT(l,"feeBC"))+"\n\n"+(s.data.level==="OPP_1"?getT(l,"benefitsDistrict"):s.data.level==="OPP_2"||s.data.level==="OPP_3"?getT(l,"benefitsCorp"):getT(l,"benefitsBC")));await new Promise(r=>setTimeout(r,600));await sendButtons(to,getT(l,"watchedQ"),[{id:"VID_YES",title:getT(l,"yes")},{id:"VID_NO",title:getT(l,"no")}]);}
async function handleVideoYes(to){const s=getSession(to);const l=s.lang;await sendButtons(to,s.data.level==="OPP_1"?getT(l,"supportDistrict"):s.data.level==="OPP_2"||s.data.level==="OPP_3"?getT(l,"supportCorp"):getT(l,"supportBC"),[{id:"KNOW_REQ",title:getT(l,"knowReq")}]);}
async function handleReq(to){const s=getSession(to);const l=s.lang;await sendButtons(to,s.data.level==="OPP_1"?getT(l,"reqDistrict"):s.data.level==="OPP_2"||s.data.level==="OPP_3"?getT(l,"reqCorp"):getT(l,"reqBC"),[{id:"SUBMIT_APP",title:getT(l,"submitApp")}]);}
async function handleSubmitApp(to){const l=getSession(to).lang;await sendButtons(to,getT(l,"categoryQ"),[{id:"CORP_YES",title:getT(l,"corpYes")},{id:"CORP_NO",title:getT(l,"corpNo")}]);}
async function handleCategory(to, isCorp){const s=getSession(to);const l=s.lang;let fee=isCorp?getT(l,"feeCorpDistrict"):getT(l,"feeNonCorpDistrict");if(s.data.level==="OPP_2")fee=isCorp?getT(l,"feeCorp"):getT(l,"feeMuni");if(s.data.level==="OPP_3")fee=isCorp?getT(l,"feeMuni"):getT(l,"feeCorp");if(s.data.level==="OPP_4"||s.data.level==="OPP_5")fee=getT(l,"feeBC");s.data.isCorp=isCorp;await sendButtons(to,fee,[{id:"READY_YES",title:getT(l,"readyYes")},{id:"READY_EMI",title:getT(l,"emi")}]);}
async function handleReady(to, isEMI){const l=getSession(to).lang;let msg=getT(l,"payFee")+"\n"+ASSETS.payments.registration;if(isEMI)msg="EMI: 5L Down + 10/20 Months\n"+ASSETS.payments.registration;await sendText(to,msg);await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(l,"payCheck"),[{id:"PAY_YES",title:getT(l,"payYes")},{id:"PAY_NO",title:getT(l,"payNo")}]);setPendingChat(to,l,"EARN_PAYMENT");}
async function handlePayYes(to){const l=getSession(to).lang;getSession(to).stage="FORM_NAME";setPendingChat(to,l,"FORM_NAME");await sendText(to,getT(l,"formName"));}
async function handlePayNo(to){const l=getSession(to).lang;await sendText(to,getT(l,"payFee")+"\n"+ASSETS.payments.registration);}
async function saveDriverReminders(){try{const sheets=await getSheetsClient();if(!sheets)return;await ensureSheetTab(sheets,"DriverReminders");await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID, range:'DriverReminders!A2:F'});const rows=driverReminders.map(r=>[r.phone, r.type, r.claimedAt, r.sent1h, r.sent24h, r.sent48h]);if(rows.length>0)await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID, range:'DriverReminders!A:F', valueInputOption:'USER_ENTERED', requestBody:{values: rows}});}catch(e){}}
async function loadDriverReminders(){try{const sheets=await getSheetsClient();if(!sheets)return [];await ensureSheetTab(sheets,"DriverReminders");const res=await sheets.spreadsheets.values.get({spreadsheetId:SHEET_ID, range:'DriverReminders!A2:F'});const rows=res.data.values||[];return rows.map(r=>({phone:r[0], type:r[1], claimedAt:parseInt(r[2]), sent1h:r[3]==='true', sent24h:r[4]==='true', sent48h:r[5]==='true', sent72h:false, lang:"EN"}));}catch(e){return [];}}
function addReminder(phone,type){driverReminders.push({phone,type,claimedAt:Date.now(),sent1h:false,sent24h:false,sent48h:false,sent72h:false, lang:getSession(phone).lang});saveDriverReminders();}
async function checkReminders(){const now=Date.now();let changed=false;for(let r of driverReminders){const diffH=(now-r.claimedAt)/(1000*60*60);const sessLang=r.lang||"EN";const tt=LANG_TEXT[sessLang]||LANG_TEXT.EN;if(!r.sent1h&&diffH>=1){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver1h+"\n"+ASSETS.apps.driver);await sendContactWithCallUrl(r.phone,tt.grabNow+" - Call "+CONTACT_NUMBER);r.sent1h=true;changed=true;}else if(!r.sent24h&&diffH>=24){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver24h);r.sent24h=true;changed=true;}else if(!r.sent48h&&diffH>=48){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver48h);r.sent48h=true;changed=true;}else if(!r.sent72h&&diffH>=72){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver72h);r.sent72h=true;changed=true;}}if(changed){driverReminders=driverReminders.filter(r=>!r.sent72h);await saveDriverReminders();}}
async function checkPendingChats(){const now=Date.now();for(let phone in pendingChats){const p=pendingChats[phone];const diffMin=(now-p.lastActivity)/(1000*60);const l=p.lang||"EN";const t=LANG_TEXT[l]||LANG_TEXT.EN;try{if(!p.reminders.r1&&diffMin>=10){await sendContactWithCallUrl(phone,t.remLang+" - Left at "+p.stage);p.reminders.r1=true;await savePendingToSheet();}else if(!p.reminders.r2&&diffMin>=30){await sendContactWithCallUrl(phone,"Reminder 30min - "+p.stage+" - "+CONTACT_NUMBER);p.reminders.r2=true;await savePendingToSheet();}else if(!p.reminders.r3&&diffMin>=1440){await sendImage(phone,ASSETS.posters.opportunity,"24h Reminder - "+p.stage);p.reminders.r3=true;await savePendingToSheet();}else if(!p.reminders.r4&&diffMin>=4320){await sendImage(phone,ASSETS.posters.opportunity,"72h Final - "+p.stage);p.reminders.r4=true;await savePendingToSheet();}}catch(e){}}}
setInterval(checkPendingChats,2*60*1000); setInterval(checkReminders,5*60*1000);
app.get('/',(req,res)=>res.send('V10 FIXED ALL LIMITS - 5 Services - EN/HI/ML - '+SHEET_ID));
app.get('/webhook',(req,res)=>{if(req.query['hub.verify_token']===VERIFY_TOKEN)res.send(req.query['hub.challenge']);else res.sendStatus(403);});
app.post('/webhook',async(req,res)=>{
 try{
  const msg=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];if(!msg)return res.sendStatus(200);
  if(processedIds.has(msg.id))return res.sendStatus(200);processedIds.add(msg.id);
  const from=msg.from;let rawId=msg.type==="interactive"?(msg.interactive.button_reply?.id||msg.interactive.list_reply?.id||""):(msg.text?.body?.trim()||"");let input=rawId.toLowerCase();const rawText=msg.text?.body||"";const s=getSession(from);
  await logAllChat(from,(rawText||rawId||"HI").substring(0,30),"INBOUND",s.lang,"CHAT_RECEIVED",`Raw:${rawText||rawId} stage:${s.stage}`);
  if(s.stage==="FORM_NAME"){s.form.name=rawText.trim();s.stage="FORM_CONTACT";setPendingChat(from,s.lang,"FORM_CONTACT");await sendText(from,getT(s.lang,"formContact"));return res.sendStatus(200);}
  if(s.stage==="FORM_CONTACT"){s.form.contact=rawText.trim();s.stage="FORM_PLACE";setPendingChat(from,s.lang,"FORM_PLACE");await sendText(from,getT(s.lang,"formPlace"));return res.sendStatus(200);}
  if(s.stage==="FORM_PLACE"){s.form.place=rawText.trim();s.stage="FORM_OCCUPATION";setPendingChat(from,s.lang,"FORM_OCCUPATION");await sendList(from,getT(s.lang,"formOcc"),"Select",[{title:"Job",rows:[{id:"occ_running",title:"Running business"},{id:"occ_planning",title:"Planning start"},{id:"occ_employee",title:"Employee"}]}]);return res.sendStatus(200);}
  if(s.stage==="FORM_OCCUPATION"){
   if(input.startsWith("occ_")){const m={occ_running:"Running business",occ_planning:"Planning to start",occ_employee:"Employee"};s.form.occupation=m[input]||input;}else s.form.occupation=rawText.trim();
   const oppFullName=OPP_MAP[s.lastOpp]||s.lastOpp;const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
   const leadRow=[dateStr,from,'Franchisee_Lead',oppFullName,s.form.name,s.form.contact,s.form.place,s.form.occupation,s.lang];
   await appendToSheet(leadRow);clearPendingChat(from);
   await sendImage(from,ASSETS.posters.welcome,`${getT(s.lang,"thanksEnq")} ${s.form.name}! ${getT(s.lang,"team24")}`);
   let tenderLink=ASSETS.tenders.district; if(s.lastOpp==="OPP_2"||s.lastOpp==="OPP_3") tenderLink=ASSETS.tenders.corp; if(s.lastOpp==="OPP_4"||s.lastOpp==="OPP_5") tenderLink=ASSETS.tenders.bc;
   await new Promise(r=>setTimeout(r,800));await sendDocument(from,tenderLink,`Tender_${s.lastOpp}.pdf`);
   await sendText(from,`${getT(s.lang,"tenderMsg")}\n${tenderLink}\nSlot: ${ASSETS.calendar}`);
   s.stage="MENU";s.form={};return res.sendStatus(200);
  }
  if(input.includes("hi")||input.includes("hello")||input==="learn_more"||s.stage==="NEW"){
   if(input==="learn_more"||rawId==="LEARN_MORE"){s.stage="LANG";setPendingChat(from,s.lang,"LANG_SELECTION");await sendLanguage(from);return res.sendStatus(200);}
   else {s.stage="WELCOME";await sendWelcome(from);return res.sendStatus(200);}
  }
  if(input.startsWith("lang_")){if(input.includes("en"))s.lang="EN";else if(input.includes("hi"))s.lang="HI";else if(input.includes("ml"))s.lang="ML";s.stage="MAIN_MENU";setPendingChat(from,s.lang,"MAIN_MENU");await logAllChat(from,'LANGUAGE_SELECTED','ACTIVE',s.lang,'MAIN_MENU',`Selected ${s.lang}`);await sendMainMenu(from);return res.sendStatus(200);}
  if(rawId==="MENU_RIDE"){await handleRideMenu(from);return res.sendStatus(200);}
  if(rawId==="MENU_BIZDIR"){await handleBizDir(from);return res.sendStatus(200);}
  if(rawId==="MENU_DELIVERY"){await handleDelivery(from);return res.sendStatus(200);}
  if(rawId==="MENU_BOOKING"){await handleBooking(from);return res.sendStatus(200);}
  if(rawId==="MENU_EARN"){await handleEarnMenu(from);return res.sendStatus(200);}
  if(rawId==="RIDE_BOOK"){await handleBookRide(from);return res.sendStatus(200);}
  if(rawId==="RIDE_ATTACH"){await handleAttachVehicle(from);return res.sendStatus(200);}
  if(rawId==="BIZDIR_SEARCH"){await sendText(from,"Search: "+ASSETS.apps.bizDirCustomer);return res.sendStatus(200);}
  if(rawId==="BIZDIR_LIST"){await sendText(from,"List: "+ASSETS.apps.bizDirMerchant);return res.sendStatus(200);}
  if(rawId==="DEL_BOOK"){await sendText(from,"Book Parcel: "+ASSETS.apps.customer);return res.sendStatus(200);}
  if(rawId==="DEL_AGENT"){await sendText(from,"Agent: "+ASSETS.apps.deliveryAgent);return res.sendStatus(200);}
  if(rawId==="BOOK_ROOM"||rawId==="BOOK_APPT"||rawId==="BOOK_CINEMA"){await sendText(from,"Booking App: "+ASSETS.apps.booking);return res.sendStatus(200);}
  if(["opp_1","opp_2","opp_3","opp_4","opp_5"].includes(input)){await handleOppLevel(from,input);return res.sendStatus(200);}
  if(input==="vid_yes"){await handleVideoYes(from);return res.sendStatus(200);}
  if(input==="vid_no"){await sendText(from,getT(s.lang,"watchFirst"));return res.sendStatus(200);}
  if(input==="know_req"){await handleReq(from);return res.sendStatus(200);}
  if(input==="submit_app"){await handleSubmitApp(from);return res.sendStatus(200);}
  if(input==="corp_yes"){await handleCategory(from,true);return res.sendStatus(200);}
  if(input==="corp_no"){await handleCategory(from,false);return res.sendStatus(200);}
  if(input==="ready_yes"){await handleReady(from,false);return res.sendStatus(200);}
  if(input==="ready_emi"){await handleReady(from,true);return res.sendStatus(200);}
  if(input==="pay_yes"){await handlePayYes(from);return res.sendStatus(200);}
  if(input==="pay_no"){await handlePayNo(from);return res.sendStatus(200);}
  if(input==="call_now"){await sendContactWithCallUrl(from,`Call Now - ${CONTACT_NUMBER} Team: ${CONTACT_NUMBER}`);return res.sendStatus(200);}
  if(input==="menu"){await sendMainMenu(from);return res.sendStatus(200);}
  await sendMainMenu(from);res.sendStatus(200);
 }catch(err){console.log("Webhook error:",err.message);res.sendStatus(200);}});
(async()=>{try{pendingChats=await loadPendingFromSheet();driverReminders=await loadDriverReminders();console.log(`V10 READY - ${Object.keys(pendingChats).length} pending + ${driverReminders.length} reminders`);}catch(e){}})();
app.listen(PORT,()=>console.log(`V10 FIXED LIVE on ${PORT}`));
