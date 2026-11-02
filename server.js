// V142 FINAL - IST TIMING ONLY - Asia/Kolkata - FIXED SYNTAX - NO OTHER EDIT - 2026-11-02

// V142 FINAL - IST TIMING FIXED - INDIAN TIME - ALL BUGS FIXED 1h/12h/24h 95623 24130 - Sheet + Reminders + EMI - Sheet + Reminders + EMI NUMBER - Supports 2 WhatsApp numbers + Exact Step Reminders + Sheet Write
const express = require('express');
const bodyParser = require('body-parser');
const httpClient = require('ax'+'ios');
let Redis = null;
try { Redis = require('ioredis'); } catch(e) { console.log('ioredis not installed'); }
let google = null;
try { google = require('googleapis').google; } catch(e) { console.log('googleapis not installed'); }

const app = express();
app.use(bodyParser.json());

// DUAL NUMBERS
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '1392695460599655' // NEW NUMBER 95623 24130;
const PHONE_ID_OLD = PHONE_NUMBER_ID;
const PHONE_ID_NEW = PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia_verify_2024';
const REDIS_URL = process.env.REDIS_URL;
const SHEET_ID = process.env.SHEET_ID || '1p_A3F_ie2JLguQTmn9WaJqFgNHNn_52B2Vuk8nRELto';
const PORT = process.env.PORT || 10000;

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia&pcampaignid=web_share';
const APP_STORE = 'https://apps.apple.com/in/app/bizmapia/id6761577245';
const WEBSITE = 'https://bizmapia.com/';
const EARN_LINK = 'https://bizmapia.com/earn';
// VIDEO LINKS - ALL LANGUAGES
// ENGLISH
const VIDEO_EN_DISTRICT = 'https://youtu.be/_y2JeFHBnqg?si=QLXX8704ovUY_5jC';
const VIDEO_EN_CORP = 'https://youtu.be/GqolfqgHiCU?si=ImdJxNRlg1TfSDxo';
const VIDEO_EN_MUNICIPAL = 'https://youtu.be/GqolfqgHiCU?si=ImdJxNRlg1TfSDxo';
const VIDEO_EN_CENTER = 'https://youtu.be/r0X77XfmF94?si=_8Fej-ncUiO9GRCn';

// MALAYALAM
const VIDEO_ML_DISTRICT = 'https://youtu.be/Fll3OY-hilU?si=O5VnmyCXTdlfhpsB';
const VIDEO_ML_CORP = 'https://youtu.be/F9rI2crM7Ow?si=zAIEKYNDZ2mv1BO_';
const VIDEO_ML_MUNICIPAL = 'https://youtu.be/F9rI2crM7Ow?si=zAIEKYNDZ2mv1BO_';
const VIDEO_ML_CENTER = 'https://youtu.be/Ds0lBtTaI6c?si=oQWgGTrCYg-ODBzF';

// HINDI - using English links as fallback (update if you have separate Hindi links)
const VIDEO_HI_DISTRICT = VIDEO_EN_DISTRICT;
const VIDEO_HI_CORP = VIDEO_EN_CORP;
const VIDEO_HI_MUNICIPAL = VIDEO_EN_MUNICIPAL;
const VIDEO_HI_CENTER = VIDEO_EN_CENTER;

function getVideoUrl(sub, lang){
  if(lang==='ml'){
    if(sub==='OPP_DISTRICT') return VIDEO_ML_DISTRICT;
    if(sub==='OPP_CORP') return VIDEO_ML_CORP;
    if(sub==='OPP_CENTER') return VIDEO_ML_CENTER;
  }
  if(lang==='hi'){
    if(sub==='OPP_DISTRICT') return VIDEO_HI_DISTRICT;
    if(sub==='OPP_CORP') return VIDEO_HI_CORP;
    if(sub==='OPP_CENTER') return VIDEO_HI_CENTER;
  }
  // en default
  if(sub==='OPP_DISTRICT') return VIDEO_EN_DISTRICT;
  if(sub==='OPP_CORP') return VIDEO_EN_CORP;
  if(sub==='OPP_CENTER') return VIDEO_EN_CENTER;
  return VIDEO_EN_DISTRICT;
}


const LINKS_V92 = {
  website: WEBSITE,
  driverApp: PLAY_STORE,
  tenderDistrict: "https://bizmapia.com/tender/district.pdf",
  businessLink: "https://bizmapia.com/business",
  earnLink: EARN_LINK,
  razorpay: "https://rzp.io/rzp/mq0zG6mS",
};

const PRICING = {
  DISTRICT: { WITH_CORP: 15, WITHOUT_CORP: 10 },
  CORP: { WITH_CORP: 5, WITHOUT_CORP: 4 },
  CENTER: { DEFAULT: 1 }
};

function getEMIText(lang, fee){
  if(fee>=15){
    return lang==='ml' ? `EMI ഓപ്ഷനുകൾ ${fee}L-ന്:\nOption 1: Down 5L + 10 മാസം x 1L = ${fee}L\nOption 2: Down 5L + 20 മാസം x 50k = ${fee}L` :
           lang==='hi' ? `EMI विकल्प ${fee} लाख के लिए:\nविकल्प 1: डाउन 5 लाख + 10 महीने x 1 लाख = ${fee} लाख\nविकल्प 2: डाउन 5 लाख + 20 महीने x 50 हजार = ${fee} लाख` :
           `EMI Options for ${fee}L:\nOption 1: Down 5L + 10 Months x 1L = ${fee}L\nOption 2: Down 5L + 20 Months x 50k = ${fee}L`;
  } else if(fee>=10){
    return lang==='ml' ? `EMI ഓപ്ഷനുകൾ ${fee}L-ന്:\nOption 1: Down 5L + 10 മാസം x 50k = ${fee}L\nOption 2: Down 5L + 20 മാസം x 25k = ${fee}L` :
           lang==='hi' ? `EMI विकल्प ${fee} लाख के लिए:\nविकल्प 1: डाउन 5 लाख + 10 महीने x 50 हजार = ${fee} लाख\nविकल्प 2: डाउन 5 लाख + 20 महीने x 25 हजार = ${fee} लाख` :
           `EMI Options for ${fee}L:\nOption 1: Down 5L + 10 Months x 50K = ${fee}L\nOption 2: Down 5L + 20 Months x 25K = ${fee}L`;
  } else if(fee===5){
    return lang==='ml' ? `EMI ഓപ്ഷനുകൾ ${fee}L-ന്:\nOption 1: Down 3L + 10 മാസം x 20k = ${fee}L\nOption 2: Down 3L + 20 മാസം x 10k = ${fee}L` :
           lang==='hi' ? `EMI विकल्प ${fee} लाख के लिए:\nविकल्प 1: डाउन 3 लाख + 10 महीने = ${fee} लाख\nविकल्प 2: डाउन 3 लाख + 20 महीने = ${fee} लाख` :
           `EMI Options for ${fee}L:\nOption 1: Down 3L + 10 Months x 20k = ${fee}L\nOption 2: Down 3L + 20 Months x 10k = ${fee}L`;
  } else if(fee===4){
    return lang==='ml' ? `EMI ഓപ്ഷനുകൾ ${fee}L-ന്:\nOption 1: Down 2L + 10 മാസം x 20k = ${fee}L\nOption 2: Down 2L + 20 മാസം x 10k = ${fee}L` :
           lang==='hi' ? `EMI विकल्प ${fee} लाख के लिए:\nविकल्प 1: डाउन 2 लाख + 10 महीने x 20 हजार = ${fee} लाख\nविकल्प 2: डाउन 2 लाख + 20 महीने x 10 हजार = ${fee} लाख` :
           `EMI Options for ${fee}L:\nOption 1: Down 2L + 10 Months x 20k = ${fee}L\nOption 2: Down 2L + 20 Months x 10k = ${fee}L`;
  } else {
    return lang==='ml' ? `Business Center ${fee}L-ന് EMI: Down Rs.30000 + 7 മാസം x Rs.10000 = ${fee}L` :
           lang==='hi' ? `Business Center ${fee} लाख के लिए EMI: डाउन 30 हजार + 7 महीने x 10 हजार = ${fee} लाख` :
           `Business Center EMI for ${fee}L: Down Rs.30000 + 7 Months x Rs.10000 = ${fee}L`;
  }
}
function getFee(sub, corpYes){
  if(sub==='OPP_DISTRICT'){ return corpYes ? PRICING.DISTRICT.WITH_CORP : PRICING.DISTRICT.WITHOUT_CORP; }
  else if(sub==='OPP_CORP'){ return corpYes ? PRICING.CORP.WITH_CORP : PRICING.CORP.WITHOUT_CORP; }
  else if(sub==='OPP_CENTER'){ return PRICING.CENTER.DEFAULT; }
  return 15;
}
function getFranchiseName(sub, corpYes){
  if(sub==='OPP_DISTRICT'){ return corpYes ? 'District with Corporation' : 'District without Corporation'; }
  else if(sub==='OPP_CORP'){ return corpYes ? 'Corporation Franchise' : 'Municipal Franchise'; }
  else if(sub==='OPP_CENTER'){ return 'Business Center'; }
  return 'Franchise';
}
function getReadyText(lang, fee, franchiseName){
  if(lang==='ml'){ return `നിങ്ങൾ അപേക്ഷ സമർപ്പിക്കാൻ പോകുന്നു, ${franchiseName} ഫീസായി ${fee} ലക്ഷം രൂപ നൽകാൻ നിങ്ങൾ തയ്യാറാണെന്ന് സ്ഥിരീകരിക്കുന്നു.`; }
  else if(lang==='hi'){ return `आप आवेदन जमा करने जा रहे हैं, पुष्टि करते हुए कि आप ${franchiseName} शुल्क के रूप में ${fee} लाख रुपये का भुगतान करने के लिए तैयार हैं।`; }
  else { return `You are going to submit application, confirming you are ready to pay ${fee} Lakhs as ${franchiseName} franchise fee.`; }
}
function getPayText(lang, fee){
  if(lang==='ml'){ return `നിങ്ങൾ ${fee}L-ന് തയ്യാറാണെന്ന് സ്ഥിരീകരിച്ചു. നിങ്ങളുടെ ഏരിയ ലോക്ക് ചെയ്യാൻ രജിസ്ട്രേഷൻ ഫീസായി 5000 രൂപ അടയ്ക്കുക. ഇത് ${fee}L-ന്റെ ഭാഗമാണ്, താഴെയുള്ള ബട്ടൺ ക്ലിക്ക് ചെയ്ത് അടയ്ക്കുക.`; }
  else if(lang==='hi'){ return `बहुत बढ़िया आपने ${fee}L के लिए तैयार होने की पुष्टि की। कृपया अपने एरिया को लॉक करने के लिए पंजीकरण शुल्क के रूप में 5000 रुपये का भुगतान करें। यह ${fee}L का हिस्सा है, नीचे बटन पर क्लिक करके भुगतान करें।`; }
  else { return `Great you confirmed ready for ${fee}L. Please pay Rs5000 as registration fee to lock your area. This is part of ${fee}L, click the button below to pay.`; }
}

const HELP_ADMIN = '8590183646';
const HELP_MARKETING = '8590175977';
const HELP_ADMIN_FULL = '+918590183646';
const HELP_MARKETING_FULL = '+918590175977';

let blockUntil = 0, lastSendTime = 0;
let redis = null, redisReady = false;
if (REDIS_URL && Redis) {
  try {
    redis = new Redis(REDIS_URL, { tls: {}, maxRetriesPerRequest: null, enableReadyCheck: false, retryStrategy: t => Math.min(t*50,2000) });
    redis.on('connect', () => { redisReady = true; console.log('REDIS CONNECTED'); });
    redis.on('ready', () => { redisReady = true; console.log('REDIS READY'); });
    redis.on('error', e => { console.log('Redis error', e.message); redisReady = false; });
  } catch(e) { console.log('Redis init fail', e.message); }
}

const memoryStore = new Map();
const reminders = new Map();

let sheetsClient = null;
async function getSheets(){
  if(!google) { console.log('googleapis not installed'); return null; }
  const creds = process.env.GOOGLE_CREDENTIALS || process.env.GOOGLE_CREDENTIALS_JSON;
  if(!creds){ console.log('GOOGLE_CREDENTIALS missing - sheet will only console.log'); return null; }
  try{
    if(sheetsClient) return sheetsClient;
    let credentials;
    try{ credentials = JSON.parse(creds); } catch{ credentials = JSON.parse(Buffer.from(creds, 'base64').toString()); }
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    const client = await auth.getClient();
    sheetsClient = google.sheets({version:'v4', auth: client});
    console.log('Google Sheets client ready');
    return sheetsClient;
  }catch(e){ console.log('getSheets error', e.message); return null; }
}

async function saveToSheet(tab, row, isNew){
  try{
    const sheets = await getSheets();
    if(!sheets){
      console.log(`SHEET ${tab}`, row);
      return;
    }
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${tab}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] }
    });
    console.log(`SHEET SAVED ${tab} -> ${row[1]||''} : ${row[3]||''}`);
  }catch(e){
    console.log(`SHEET FAIL ${tab}`, e.message, row);
  }
}

async function getState(uid){ if(redisReady){ try{ const v=await redis.get(`state:${uid}`); if(v) return JSON.parse(v);}catch{} } return memoryStore.get(uid)||{}; }
async function setState(uid,s){ s.lastActive = Date.now(); memoryStore.set(uid,s); if(redisReady){ try{ await redis.set(`state:${uid}`, JSON.stringify(s), 'EX', 86400*7);}catch{} } }
function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

function textMessage(to,body, phoneId){ return { messaging_product:'whatsapp', to, type:'text', text:{body:body.substring(0,4096)} , _phoneId: phoneId }; }
function interactiveButton(to,body,buttons, phoneId){
  const btns = buttons.slice(0,3).map(b=>({type:'reply', reply:{id:b.id, title:b.title.substring(0,20)}}));
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{type:'button', body:{text:body.substring(0,1024)}, action:{buttons:btns}}, _phoneId: phoneId };
}
function ctaButtons(to,body,ctaList, phoneId){
  const buttons = ctaList.slice(0,3).map(c=>{
    if(c.type==='url'){ return { type:'cta_url', title:c.title.substring(0,20), cta_url:c.url }; }
    else { return { type:'phone_number', title:c.title.substring(0,20), payload:c.phone }; }
  });
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{ type:'button', body:{text:body.substring(0,1024)}, action:{buttons: buttons} }, _phoneId: phoneId };
}
function singleCta(to,body,btn, phoneId){
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{ type:'cta_url', body:{text:body.substring(0,1024)}, action:{ name:'cta_url', parameters:{ display_text: btn.title.substring(0,20), url: btn.url } } }, _phoneId: phoneId };
}

async function sendWithDelay(msg){
  const now = Date.now();
  if(now < blockUntil){ console.log(`BLOCKED till ${new Date(blockUntil)}`); return; }
  if(now - lastSendTime < 500){ await delay(500-(now-lastSendTime)); }
  lastSendTime = Date.now();
  try{
    const phoneIdToUse = msg._phoneId || PHONE_ID_OLD;
    delete msg._phoneId;
    const url = `https://graph.facebook.com/v20.0/${phoneIdToUse}/messages`;
    const res = await httpClient.post(url, msg, {headers:{Authorization:`Bearer ${WHATSAPP_TOKEN}`, 'Content-Type':'application/json'}});
    console.log(`OUT to ${msg.to} via ${phoneIdToUse} - ${msg.type}`, res.data.messages?.[0]?.id||'ok');
    return res.data;
  }catch(e){
    const err = e.response?.data?.error;
    console.log('SEND FAIL', JSON.stringify(e.response?.data||e.message));
    if(err?.code===130429 || JSON.stringify(err).includes('too many messages')){
      blockUntil = Date.now()+65*60*1000;
      console.log(`130429 DETECTED BLOCKING 65 MIN`);
    }
  }
}

async function repeatLastStep(uid, state, lang, phoneId){
  const L = T[lang]||T.en;
  const last = state.lastStep||'';
  const sub = state.sub||'';
  console.log(`REPEAT LAST STEP for ${uid} via ${phoneId} - last:${last} sub:${sub} lang:${lang}`);
  const level = state.reminderLevel || 1;
  // PAY STEP - TOP PRIORITY FOR REMINDERS - Handled in scheduleReminder for escalated text, but keep fallback
  if(last.includes('Pay Rs5000') || last.includes('EMI Selected') || last.includes('Not Paid') || last.includes('Pay Rs') || last.startsWith('Pay ')){
    const fee = state.fee||15;
    const escalatedText = getEscalatedPayText(lang, fee, level);
    console.log(`REMINDER: Pay step level=${level} - sending 3 buttons Yes/No/Call for ${uid}`);
    return await sendWithDelay(interactiveButton(uid, escalatedText, [{id:'PAY_DONE',title:L.payBtn},{id:'PAY_NOT_DONE',title:L.notPaid},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`}], phoneId));
  }
  if(sub==='RIDE_BOOK' || last==='Book a Cab'){ const escalatedCab = getEscalatedGeneralText(lang, L.bookCab, level, 'Book a Cab'); return await sendWithDelay(ctaButtons(uid, escalatedCab, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId)); }
  if(sub==='RIDE_ATTACH' || last==='Attach Cab'){ const escalated = getEscalatedGeneralText(lang, L.attachCab, level, 'Attach Cab'); return await sendWithDelay(ctaButtons(uid, escalated, [{type:'url', title:'Android', url:PLAY_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId)); }
  if(sub==='BIZ_REGISTER' || last==='Register Business'){ const escalated = getEscalatedGeneralText(lang, L.bizRegister, level, 'Register'); return await sendWithDelay(ctaButtons(uid, escalated, [{type:'url', title:'Register your Business', url:WEBSITE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId)); }
  if(sub==='BIZ_ADS' || last==='Start Advertising'){ const escalated = getEscalatedGeneralText(lang, L.bizAds, level, 'Ads'); return await sendWithDelay(ctaButtons(uid, escalated, [{type:'url', title:'Advertise Now', url:WEBSITE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId)); }
  if(sub==='DEL_ORDER' || last==='Order Stores'){ const escalated = getEscalatedGeneralText(lang, L.delOrder, level, 'Order'); return await sendWithDelay(ctaButtons(uid, escalated, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId)); }
  if(sub==='DEL_PARTNER' || last==='Delivery Partner'){ const escalated = getEscalatedGeneralText(lang, L.delPartner, level, 'Partner'); return await sendWithDelay(ctaButtons(uid, escalated, [{type:'url', title:'Android', url:PLAY_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId)); }
  if(sub==='BOOK_ROOM' || last==='Book Rooms'){ return await sendWithDelay(ctaButtons(uid, L.bookRoom, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId)); }
  if(sub==='BOOK_APPOINT' || last==='Book Appointments'){ return await sendWithDelay(ctaButtons(uid, L.bookAppoint, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId)); }
  if(sub==='BOOK_MOVIE' || last==='Movie Tickets'){ return await sendWithDelay(ctaButtons(uid, L.bookMovie, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId)); }
  if(sub==='OPP_DISTRICT' || last.includes('High level') || last.includes('District')){ await sendWithDelay(singleCta(uid, L.highIntroSingle, {type:'url', title:L.seeVideo, url:getVideoUrl('OPP_DISTRICT', lang)}, phoneId)); await delay(500); return await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}], phoneId)); }
  if(sub==='OPP_CORP' || last.includes('Moderate level') || last.includes('Corp')){ await sendWithDelay(singleCta(uid, L.moderateIntroSingle, {type:'url', title:L.seeVideo, url:getVideoUrl('OPP_CORP', lang)}, phoneId)); await delay(500); return await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}], phoneId)); }
  if(sub==='OPP_CENTER' || last.includes('Base level') || last.includes('Center')){ await sendWithDelay(singleCta(uid, L.baseIntroSingle, {type:'url', title:L.seeVideo, url:getVideoUrl('OPP_CENTER', lang)}, phoneId)); await delay(500); return await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}], phoneId)); }
  if(last==='Benefits'){ const escalatedBen = getEscalatedGeneralText(lang, L.benText, level, 'Benefits'); await sendWithDelay(textMessage(uid,escalatedBen, phoneId)); await delay(300); return await sendWithDelay(interactiveButton(uid,'Next:',[{id:'KNOW_SUP',title:L.supBtn},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`} ], phoneId)); }
  if(last==='Support'){ const escalatedSup = getEscalatedGeneralText(lang, L.supText, level, 'Support'); await sendWithDelay(textMessage(uid,escalatedSup, phoneId)); await delay(300); return await sendWithDelay(interactiveButton(uid,'Next:',[{id:'KNOW_REQ',title:L.reqBtn},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`} ], phoneId)); }
  if(last==='Requirements'){ const escalatedReq = getEscalatedGeneralText(lang, L.reqText, level, 'Requirements'); await sendWithDelay(textMessage(uid,escalatedReq, phoneId)); await delay(300); return await sendWithDelay(interactiveButton(uid,'Next:',[{id:'SUBMIT_APP',title:L.submitBtn},{id:'KNOW_EMI',title:L.emiBtn}], phoneId)); }
  if(last.includes('Corp Check') || last.includes('Submit Application')){ const escalatedCorp = getEscalatedGeneralText(lang, L.corpQ, level, 'CorpCheck'); return await sendWithDelay(interactiveButton(uid,escalatedCorp,[{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], phoneId)); }
  if(last.includes('Ready')){ const fee = state.fee||15; const franchiseName = state.franchiseName||'Franchise'; let readyText = getReadyText(lang, fee, franchiseName); readyText = getEscalatedGeneralText(lang, readyText, level, 'Ready'); const readyBtnTitle = lang==='ml' ? `അതെ തയ്യാർ - ${fee}L` : lang==='hi' ? `हाँ तैयार - ${fee}L` : `Yes Ready - ${fee}L`; return await sendWithDelay(interactiveButton(uid,readyText,[{id:'READY_15L',title:readyBtnTitle},{id:'KNOW_EMI',title:L.emiBtn}], phoneId)); }
    if(last.includes('Pay Rs5000') || last.includes('EMI Selected') || last.includes('Not Paid')){ 
    // Reminder flow: Yes paid / Not paid / Call
    return await sendWithDelay(interactiveButton(uid, L.payAfter, [{id:'PAY_DONE',title:L.payBtn},{id:'PAY_NOT_DONE',title:L.notPaid},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`}])); 
  }
  if(last.includes('EMI Options')){ const fee = state.fee||15; let emiText = getEMIText(lang, fee); emiText = getEscalatedGeneralText(lang, emiText, level, 'EMI'); return await sendWithDelay(interactiveButton(uid,emiText+"\n\nPlease select any one from below:-",[{id:'EMI_10',title:L.emi10},{id:'EMI_20',title:L.emi20}], phoneId)); }
  if(last.includes('Pay Done') || last.includes('Lead') || last.includes('Lead Typed')){ return await sendWithDelay(textMessage(uid,L.leadAsk, phoneId)); }
  if(last.includes('Occupation')){ return await sendWithDelay(interactiveButton(uid,L.occQ,[{id:'OCC_BUSINESS',title:L.bus},{id:'OCC_HOUSE',title:L.house},{id:'OCC_EMP',title:L.emp}], phoneId)); }
  if(last.includes('Date')){ return await sendWithDelay(interactiveButton(uid,L.dateQ,[{id:'DATE_TODAY',title:L.today},{id:'DATE_TOMORROW',title:L.tomorrow}], phoneId)); }
  if(state.service){
    if(state.service==='SVC_RIDE') return await sendWithDelay(interactiveButton(uid, L.rideSelected, L.rideButtons, phoneId));
    if(state.service==='SVC_BIZDIR') return await sendWithDelay(interactiveButton(uid, L.bizDirSelected, L.bizDirButtons, phoneId));
    if(state.service==='SVC_DELIVERY') return await sendWithDelay(interactiveButton(uid, L.deliverySelected, L.deliveryButtons, phoneId));
    if(state.service==='SVC_BOOKING') return await sendWithDelay(interactiveButton(uid, L.bookingSelected, L.bookingButtons, phoneId));
    if(state.service==='SVC_OPP') return await sendWithDelay(interactiveButton(uid, L.oppSelected, L.oppButtons, phoneId));
  }
  await sendWithDelay(interactiveButton(uid, L.mainMenu, L.services.slice(0,3), phoneId));
  await delay(300);
  await sendWithDelay(interactiveButton(uid, 'More services:-', L.services.slice(3,5), phoneId));
}



async function saveReminderToRedis(uid, type, lang, ms, phoneId){
  try{ if(redisReady && redis){ const key = `reminder:${uid}:${type}`; const data = JSON.stringify({lang, due: Date.now()+ms, type, uid, phoneId}); await redis.set(key, data, 'EX', Math.ceil(ms/1000)+86400); } }catch(e){ console.log('saveReminder error', e.message); }
}
async function deleteReminderFromRedis(uid, typePattern){
  try{
    if(redisReady && redis){
      if(typePattern){ const keys = await redis.keys(`reminder:${uid}:${typePattern}*`); if(keys.length>0) await redis.del(...keys); }
      else { const keys = await redis.keys(`reminder:${uid}:*`); if(keys.length>0) await redis.del(...keys); }
    }
  }catch(e){ console.log('deleteReminder error', e.message); }
}
function clearReminders(uid){
  for(let key of reminders.keys()){ if(key.startsWith(uid+':')){ clearTimeout(reminders.get(key)); reminders.delete(key); } }
  deleteReminderFromRedis(uid, '');
}
function getEscalatedPayText(lang, fee, level){
  // level: 1=1h, 12=12h, 24=24h
  if(lang==='ml'){
    if(level===1) return `പണമടച്ചതിന് ശേഷം തിരഞ്ഞെടുക്കുക:-`;
    if(level===12) return `⚠️ നിങ്ങളുടെ ${fee}L ഏരിയ ഇപ്പോഴും ലോക്ക് ചെയ്തിട്ടില്ല - പണമടച്ചോ?\n\nപണമടച്ചതിന് ശേഷം തിരഞ്ഞെടുക്കുക:-`;
    if(level===24) return `⏰ അവസാന ഓർമ്മപ്പെടുത്തൽ - നിങ്ങളുടെ ${fee}L ഏരിയ മറ്റൊരാൾക്ക് പോകുന്നതിന് മുൻപ് പണമടയ്ക്കൂ!\n\nപണമടച്ചതിന് ശേഷം തിരഞ്ഞെടുക്കുക:-`;
  } else if(lang==='hi'){
    if(level===1) return `भुगतान के बाद, कृपया चुनें:-`;
    if(level===12) return `⚠️ आपका ${fee}L एरिया अभी भी लॉक नहीं है - क्या आपने भुगतान किया?\n\nभुगतान के बाद, कृपया चुनें:-`;
    if(level===24) return `⏰ अंतिम रिमाइंडर - आपका ${fee}L एरिया किसी और को जाने से पहले भुगतान करें!\n\nभुगतान के बाद, कृपया चुनें:-`;
  } else {
    if(level===1) return `After payment, please select:-`;
    if(level===12) return `⚠️ Your ${fee}L area is still not locked - have you paid?\n\nAfter payment, please select:-`;
    if(level===24) return `⏰ Last reminder - Pay before your ${fee}L area goes to someone else!\n\nAfter payment, please select:-`;
  }
  return `After payment, please select:-`;
}

function getEscalatedGeneralText(lang, originalText, level, stepName){
  if(level===1) return originalText;
  if(level===12){
    if(lang==='ml') return `⚠️ ഓർമ്മപ്പെടുത്തൽ: ${originalText}\n\nനിങ്ങളുടെ സ്ലോട്ട് ഇപ്പോഴും ഓപ്പൺ ആണ്!`;
    if(lang==='hi') return `⚠️ रिमाइंडर: ${originalText}\n\nआपका स्लॉट अभी भी खुला है!`;
    return `⚠️ Reminder: ${originalText}\n\nYour slot is still open!`;
  }
  if(level===24){
    if(lang==='ml') return `⏰ അവസാന ഓർമ്മപ്പെടുത്തൽ: ${originalText}\n\nഇത് അവസാന അവസരമാണ്!`;
    if(lang==='hi') return `⏰ अंतिम रिमाइंडर: ${originalText}\n\nयह आखिरी मौका है!`;
    return `⏰ Last reminder: ${originalText}\n\nThis is your last chance!`;
  }
  return originalText;
}

function scheduleReminder(uid, type, lang, ms, phoneId){
  const key = `${uid}:${type}`;
  if(reminders.has(key)){ clearTimeout(reminders.get(key)); }
  saveReminderToRedis(uid, type, lang, ms, phoneId);
  const t = setTimeout(async()=>{
    reminders.delete(key);
    try{
      if(redisReady && redis){ await redis.del(`reminder:${uid}:${type}`); }
      const state = await getState(uid);
      if(!state || state.flow==='DONE') return;
      const lastActive = state.lastActive ? Date.now() - state.lastActive : 999999999;
      if(type.includes(':1') && lastActive < 30*60*1000){ console.log(`Skipping 1h reminder, active ${lastActive}ms ago`); return; }
      const actualLang = state.lang || lang || 'en';
      const actualPhoneId = state.phoneId || phoneId || PHONE_NUMBER_ID;
      const level = type.includes(':24') ? 24 : type.includes(':12') ? 12 : 1;
      console.log(`REMINDER FIRING ${type} level=${level} to ${uid} via ${actualPhoneId} last=${state?.lastStep} - escalated`);
      if(type.startsWith('noLang')||type.startsWith('noService')){
        const L = T[actualLang]||T.en;
        let welcomeText = L.welcome;
        if(level===12) welcomeText = (actualLang==='ml' ? `⚠️ ` : actualLang==='hi' ? `⚠️ ` : `⚠️ `) + welcomeText + (actualLang==='ml' ? `\n\nനിങ്ങൾ ഇതുവരെ ഭാഷ തിരഞ്ഞെടുത്തില്ല!` : actualLang==='hi' ? `\n\nआपने अभी तक भाषा नहीं चुनी!` : `\n\nYou haven't selected language yet!`);
        if(level===24) welcomeText = `⏰ ` + L.welcome + (actualLang==='ml' ? `\n\nഅവസാന ഓർമ്മപ്പെടുത്തൽ!` : actualLang==='hi' ? `\n\nअंतिम रिमाइंडर!` : `\n\nLast reminder!`);
        await sendWithDelay(interactiveButton(uid, welcomeText, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'Hindi'},{id:'LANG_ML',title:'Malayalam'}], actualPhoneId));
      } else {
        // Check if Pay step - use escalated pay text
        const last = state.lastStep||'';
        if(last.includes('Pay Rs5000') || last.includes('EMI Selected') || last.includes('Not Paid') || last.includes('Pay Rs') || last.startsWith('Pay ')){
          const L = T[actualLang]||T.en;
          const fee = state.fee||15;
          const escalatedText = getEscalatedPayText(actualLang, fee, level);
          await sendWithDelay(interactiveButton(uid, escalatedText, [{id:'PAY_DONE',title:L.payBtn},{id:'PAY_NOT_DONE',title:L.notPaid},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`}], actualPhoneId));
        } else {
          // For all other steps, repeat with escalated wrapper in repeatLastStep will be handled there
          // But we pass level via state
          state.reminderLevel = level;
          await setState(uid, state);
          await repeatLastStep(uid, state, actualLang, actualPhoneId);
        }
      }
    }catch(e){ console.log('reminder error', e.message, e.stack); }
  }, ms);
  reminders.set(key, t);
}

setInterval(async()=>{
  try{
    if(!redisReady || !redis) return;
    const keys = await redis.keys('reminder:*');
    if(!keys.length) return;
    let dueCount = 0;
    for(let key of keys){
      const dataStr = await redis.get(key);
      if(!dataStr) continue;
      const data = JSON.parse(dataStr);
      if(Date.now() >= data.due){
        dueCount++;
        await redis.del(key);
        scheduleReminder(data.uid, data.type, data.lang, 1000, data.phoneId);
      }
    }
    if(dueCount>0) console.log(`Fired ${dueCount} due persistent reminders`);
  }catch(e){ console.log('reminder interval error', e.message); }
}, 5*60*1000);

const T={
  en:{
    welcome:`Welcome to Bizmapia\nYou are in Indias first 4 in 1 service app platform\nPlease select your preferred language from below:-`,
    mainMenu:`Please click any one service from below to help you further:-`,
    moreServices:`More services:-`,
    services:[{id:'SVC_RIDE',title:'Ride Hailing'},{id:'SVC_BIZDIR',title:'Business Directory'},{id:'SVC_DELIVERY',title:'Online Delivery'},{id:'SVC_BOOKING',title:'Online Booking'},{id:'SVC_OPP',title:'Business Opportunity'}],
    noLang:`Sorry, You are not selected any Language.\n\nPlease select your preferred language from below:-`,
    noService:`You haven't selected any service yet.\n\nPlease click any one service from below:-`,
    rideSelected:`Great you are selected "Ride Hailing"\nBizmapia is the one and only platform giving all India Ride Hailing service without any boarder.\nPlease select any one option from below:-`,
    rideButtons:[{id:'RIDE_BOOK',title:'Book a Cab'},{id:'RIDE_ATTACH',title:'Attach Cab'}],
    bookCab:`Great choice, you are clicked our "Book a Cab" service.\nYou will get Two wheelers/Autorickshaws/Hatchback/Sedan/SUV/XUV/Ambulances from near by areas at affordable rates.\n\nClick below to install our app or call us:`,
    attachCab:`Great you selected "Attach Cab"\nAttach your Two wheeler/Auto/Car/SUV and start earning daily with Bizmapia all India rides.\n\nClick below to install driver app or call us:`,
    haveInstalled1:`Have you installed our app?\n\nHere you can activate your special offers on rides`,
    haveInstalled24:`Have you installed our app?\n\nYour chance going to expire, Here you can activate your special offers on rides`,
    yesActivate:'Yes, activate', noLater:'No, will do later',
    activated:`Great, we are activating your offer in your app login, Login to our app now and check your offers by completing your first trip\n\nFeel free to chat on our customer care for future contacts`,
    helpAdmin:`Help ${HELP_ADMIN}`, helpMarketing:`Help ${HELP_MARKETING}`,
    bizDirSelected:`Great you selected "Business Directory"\nRegister your business and get customers from all India. 10 Lakh+ local businesses already listed.\nPlease select any one option from below:-`,
    bizDirButtons:[{id:'BIZ_REGISTER',title:'Register Business'},{id:'BIZ_ADS',title:'Start Advertising'}],
    bizRegister:`Register your business on Bizmapia and start getting more customers, leads and bookings.\n\nClick below to register on website or call us:`,
    bizAds:`Start advertising your business on Bizmapia and get 10x more customers.\n\nClick below to start advertising or call us:`,
    deliverySelected:`Great you selected "Online Delivery"\nBook anything from local stores to your door step delivery in 2 hours.\nPlease select any one option from below:-`,
    deliveryButtons:[{id:'DEL_ORDER',title:'Order from Stores'},{id:'DEL_PARTNER',title:'Earn as our delivery partner'}],
    delOrder:`Order Grocery, Food, Medicine, Anything from local stores and get delivered in 2 hours.\n\nClick below to install app or call us:`,
    delPartner:`Become our delivery partner and earn daily.\n\nClick below to install app or call us:`,
    bookingSelected:`Great you selected "Online Booking"\nBook Rooms, Appointments, Movie Tickets at affordable rates all India.\nPlease select any one option from below:-`,
    bookingButtons:[{id:'BOOK_ROOM',title:'Book Rooms'},{id:'BOOK_APPOINT',title:'Book Appointments'},{id:'BOOK_MOVIE',title:'Movie Tickets'}],
    bookRoom:`Book Hotels, Rooms, Resorts anywhere in India at best rates.\n\nClick below to install app or call us:`,
    bookAppoint:`Book Appointments - Doctor, Salon, Services - Instant booking near you.\n\nClick below to install app or call us:`,
    bookMovie:`Book Movie Tickets, Events, Shows near you.\n\nClick below to install app or call us:`,
    oppSelected:`Great you selected "Business Opportunity"\nBecome our service point and start earning. 3 levels of earning.\nYou are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?\nPlease select any one option from below:-`,
    oppButtons:[{id:'OPP_DISTRICT',title:'High level Income'},{id:'OPP_CORP',title:'Moderate level Income'},{id:'OPP_CENTER',title:'Base level Income'}],
    highIntroSingle:`Great you are selected our Higher level income earning opportunity\n\nLets find details about our District franchise opportunity\nRemember only one application is approved for a district, so study the whole details and make a decision with this chat.`,
    moderateIntroSingle:`Great you are selected our Moderate level income earning opportunity\n\nLets find details about our Corporation franchise opportunity\nRemember limited slots for corporation, so study whole details and make decision with this chat.`,
    baseIntroSingle:`Great you are selected our Base level income earning opportunity\n\nLets find details about our Business Center opportunity\nBase earning model for your town, study details and decide.`,
    reminderFranchise:`You were checking our franchise opportunity. Continue to know more?`,
    seeVideo:'See the Video',
    benBtn:'Know Benefits', supBtn:'Know Support', reqBtn:'Requirements', submitBtn:'Submit Application', videoBtn:'Video Link', emiBtn:'EMI options',
    benText:`BENEFITS - District Franchise\n\nBenefits 1 - You are district top level franchisee, % on all earnings in your district\nBenefits 2 - Only you can contact Company directly\nBenefits 3 - Lifetime royalty income\n\nWebsite: ${WEBSITE}\n\nHelp: +91 ${HELP_MARKETING}`,
    supText:`SUPPORT - Company will provide\nSupport 1 - 12 months marketing support\nSupport 2 - 6 months Rent contribution\nSupport 3 - 6 months Staff salary support\n\nCall: +91 ${HELP_MARKETING}`,
    reqText:`REQUIREMENTS\n\nRequirement 1 - 90 Sqft room\nRequirement 2 - 1 full time staff\nRequirement 3 - PC/Laptop and Android Mobile\nRequirement 4 - Ready to invest\nRequirement 5 - Aadhaar + PAN\n\nApply: ${EARN_LINK}`,
    corpQ:`Did your district contain corporation? If your district HQ has Corporation (e.g. Ernakulam has Kochi Corporation), select Yes Corp.`,
    yesCorp:'Yes Corp', noCorp:'No Corp',
    ready15:`You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.`,
    readyBtn:'Yes Ready - 15L',
    payReg:`Great you confirmed ready for 15L. Please pay Rs5000 as registration fee to lock your district. Link: ${LINKS_V92.razorpay} - Part of 15L`,
    payBtn:'I Have Paid Rs5000',
    payFeeNow:'Pay fee now',
    notPaid:'Not paid 5000',
    payAfter:'After payment, please select:-',
    emiOpt:`EMI options available:\nEMI 10 Months\nEMI 20 Months\nPlease select any one from below:-`,
    emi10:'EMI 10 Months', emi20:'EMI 20 Months',
    leadAsk:`Great! Please type your full name, district and mobile number (e.g. Ajo, Thodupuzha, 9567742507)`,
    occQ:`What is your occupation?`,
    bus:'Business', house:'Housewife', emp:'Employee',
    dateQ:`When you can visit our head office?`,
    today:'Today', tomorrow:'Tomorrow',
    tenderLink:`Tender document for District Franchise: ${LINKS_V92.tenderDistrict}`,
    thanks:`Thanks for submitting your details. Our franchise team will call you within 24 hours.\n\nCall: +91 ${HELP_MARKETING}`,
    noProblem:`No problem! Take your time. When you are ready, click below to install.\n\nClick below:`,
  },
  hi:{
    welcome:`Bizmapia में आपका स्वागत है\nआप भारत के पहले 4 इन 1 सर्विस ऐप प्लेटफॉर्म पर हैं\nकृपया नीचे से अपनी पसंदीदा भाषा चुनें:-`,
    mainMenu:`कृपया आगे सहायता के लिए नीचे से कोई एक सेवा चुनें:-`,
    moreServices:`और सेवाएं:-`,
    services:[{id:'SVC_RIDE',title:'राइड हेलिंग'},{id:'SVC_BIZDIR',title:'बिजनेस डायरेक्टरी'},{id:'SVC_DELIVERY',title:'ऑनलाइन डिलीवरी'},{id:'SVC_BOOKING',title:'ऑनलाइन बुकिंग'},{id:'SVC_OPP',title:'बिजनेस अवसर'}],
    noLang:`क्षमा करें, आपने कोई भाषा नहीं चुनी।\n\nकृपया नीचे से अपनी पसंदीदा भाषा चुनें:-`,
    noService:`आपने अभी तक कोई सेवा नहीं चुनी।\n\nकृपया नीचे से कोई एक सेवा चुनें:-`,
    rideSelected:`बहुत बढ़िया आपने "राइड हेलिंग" चुना\nBizmapia पूरे भारत में बिना सीमा के राइड सेवा देने वाला एकमात्र प्लेटफॉर्म है।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    rideButtons:[{id:'RIDE_BOOK',title:'कैब बुक करें'},{id:'RIDE_ATTACH',title:'कैब जोड़ें'}],
    bookCab:`बढ़िया विकल्प, आपने "कैब बुक करें" सेवा पर क्लिक किया।\nआपको आसपास से Two wheeler/Auto/Hatchback/Sedan/SUV/XUV/Ambulance किफायती दरों पर मिलेगा।\n\nनीचे क्लिक करके ऐप इंस्टॉल करें या हमें कॉल करें:`,
    attachCab:`बहुत बढ़िया आपने "कैब जोड़ें" चुना\nअपना Two wheeler/Auto/Car/SUV जोड़ें और Bizmapia के साथ रोज कमाना शुरू करें।\n\nनीचे क्लिक करें:`,
    haveInstalled1:`क्या आपने हमारा ऐप इंस्टॉल किया है?\n\nयहाँ आप राइड पर अपने विशेष ऑफर सक्रिय कर सकते हैं`,
    haveInstalled24:`क्या आपने हमारा ऐप इंस्टॉल किया है?\n\nआपका मौका समाप्त होने वाला है, यहाँ आप राइड पर अपने विशेष ऑफर सक्रिय कर सकते हैं`,
    yesActivate:'हाँ, सक्रिय करें', noLater:'नहीं, बाद में करूंगा',
    activated:`बहुत बढ़िया, हम आपके ऐप लॉगिन में आपका ऑफर सक्रिय कर रहे हैं, अभी हमारे ऐप में लॉगिन करें और अपनी पहली यात्रा पूरी करके अपने ऑफर देखें`,
    helpAdmin:`सहायता ${HELP_ADMIN}`, helpMarketing:`सहायता ${HELP_MARKETING}`,
    bizDirSelected:`बहुत बढ़िया आपने "बिजनेस डायरेक्टरी" चुना\nअपना व्यवसाय रजिस्टर करें और पूरे भारत से ग्राहक प्राप्त करें।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    bizDirButtons:[{id:'BIZ_REGISTER',title:'बिजनेस रजिस्टर करें'},{id:'BIZ_ADS',title:'विज्ञापन शुरू करें'}],
    bizRegister:`Bizmapia पर अपना व्यवसाय रजिस्टर करें और अधिक ग्राहक, लीड और बुकिंग प्राप्त करना शुरू करें।\n\nनीचे वेबसाइट पर क्लिक करें या कॉल करें:`,
    bizAds:`Bizmapia पर अपने व्यवसाय का विज्ञापन शुरू करें और 10 गुना अधिक ग्राहक प्राप्त करें।\n\nनीचे क्लिक करें:`,
    deliverySelected:`बहुत बढ़िया आपने "ऑनलाइन डिलीवरी" चुना\nस्थानीय स्टोर से कुछ भी 2 घंटे में आपके दरवाजे पर डिलीवरी।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    deliveryButtons:[{id:'DEL_ORDER',title:'स्टोर से ऑर्डर करें'},{id:'DEL_PARTNER',title:'डिलीवरी पार्टनर बनकर कमाएं'}],
    delOrder:`किराना, भोजन, दवा, स्थानीय दुकानों से कुछ भी ऑर्डर करें और 2 घंटे में डिलीवरी प्राप्त करें।\n\nनीचे क्लिक करें:`,
    delPartner:`हमारे डिलीवरी पार्टनर बनें और रोज कमाएं।\n\nनीचे क्लिक करें:`,
    bookingSelected:`बहुत बढ़िया आपने "ऑनलाइन बुकिंग" चुना\nपूरे भारत में किफायती दरों पर रूम, अपॉइंटमेंट, मूवी टिकट बुक करें।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    bookingButtons:[{id:'BOOK_ROOM',title:'रूम बुक करें'},{id:'BOOK_APPOINT',title:'अपॉइंटमेंट बुक करें'},{id:'BOOK_MOVIE',title:'मूवी टिकट'}],
    bookRoom:`भारत में कहीं भी सर्वोत्तम दरों पर होटल, रूम, रिज़ॉर्ट बुक करें।\n\nनीचे क्लिक करें:`,
    bookAppoint:`अपॉइंटमेंट बुक करें - डॉक्टर, सैलून, सेवाएं - आपके पास तत्काल बुकिंग।\n\nनीचे क्लिक करें:`,
    bookMovie:`आपके पास मूवी टिकट, इवेंट, शो बुक करें।\n\nनीचे क्लिक करें:`,
    oppSelected:`बहुत बढ़िया आपने "बिजनेस अवसर" चुना\nहमारा सर्विस पॉइंट बनें और कमाना शुरू करें। कमाई के 3 स्तर।\nआप भारत में कहीं से भी Bizmapia से कमाई के अवसर के लिए अपना स्लॉट बुक करने जा रहे हैं। आप किस प्रकार के अवसर की तलाश में हैं?\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    oppButtons:[{id:'OPP_DISTRICT',title:'उच्च स्तरीय आय'},{id:'OPP_CORP',title:'मध्यम स्तरीय आय'},{id:'OPP_CENTER',title:'आधार स्तरीय आय'}],
    highIntroSingle:`बहुत बढ़िया आपने हमारी उच्च स्तरीय आय अर्जन अवसर का चयन किया है\n\nआइए हमारी जिला फ्रेंचाइजी अवसर के बारे में विवरण जानें\nयाद रखें एक जिले के लिए केवल एक ही आवेदन स्वीकृत है, इसलिए पूरी जानकारी का अध्ययन करें और इस चैट के साथ निर्णय लें।`,
    moderateIntroSingle:`बहुत बढ़िया आपने हमारी मध्यम स्तरीय आय अवसर का चयन किया\n\nआइए हमारी कॉरपोरेशन फ्रेंचाइजी अवसर के बारे में जानें`,
    baseIntroSingle:`बहुत बढ़िया आपने हमारी बेस लेवल आय अवसर का चयन किया\n\nआइए हमारे बिजनेस सेंटर अवसर के बारे में जानें`,
    reminderFranchise:`आप हमारी फ्रेंचाइजी अवसर की जाँच कर रहे थे। अधिक जानने के लिए जारी रखें?`,
    seeVideo:'वीडियो देखें',
    benBtn:'लाभ जानें', supBtn:'सहायता जानें', reqBtn:'आवश्यकताएं', submitBtn:'आवेदन जमा करें', videoBtn:'वीडियो लिंक', emiBtn:'EMI विकल्प',
    benText:`लाभ - जिला फ्रेंचाइजी\n\nलाभ 1 - आप जिला टॉप लेवल फ्रेंचाइजी हैं, आपके जिले की सभी कमाई पर %\nलाभ 2 - केवल आप कंपनी से सीधे संपर्क कर सकते हैं\nलाभ 3 - आजीवन रॉयल्टी आय`,
    supText:`सहायता - कंपनी प्रदान करेगी\nसहायता 1 - 12 महीने मार्केटिंग सहायता\nसहायता 2 - 6 महीने किराया योगदान\nसहायता 3 - 6 महीने स्टाफ वेतन सहायता`,
    reqText:`आवश्यकताएं\n\nआवश्यकता 1 - 90 वर्ग फुट कमरा\nआवश्यकता 2 - 1 पूर्णकालिक स्टाफ\nआवश्यकता 3 - पीसी/लैपटॉप और एंड्रॉइड मोबाइल`,
    corpQ:`क्या आपके जिले में कॉरपोरेशन है?`,
    yesCorp:'हाँ कॉर्प', noCorp:'नहीं कॉर्प',
    ready15:`आप आवेदन जमा करने जा रहे हैं, पुष्टि करते हुए कि आप जिला फ्रेंचाइजी शुल्क के रूप में 15 लाख रुपये का भुगतान करने के लिए तैयार हैं।`,
    readyBtn:'हाँ तैयार - 15L',
    payReg:`बहुत बढ़िया आपने 15L के लिए तैयार होने की पुष्टि की। कृपया अपने जिले को लॉक करने के लिए पंजीकरण शुल्क के रूप में 5000 रुपये का भुगतान करें। Link: ${LINKS_V92.razorpay}`,
    payBtn:'मैंने 5000 भुगतान किया',
    payFeeNow:'अभी भुगतान करें',
    notPaid:'भुगतान नहीं किया',
    payAfter:'भुगतान के बाद, कृपया चुनें:-',
    emiOpt:`EMI विकल्प उपलब्ध हैं:\nEMI 10 महीने\nEMI 20 महीने`,
    emi10:'EMI 10 महीने', emi20:'EMI 20 महीने',
    leadAsk:`बहुत बढ़िया! कृपया अपना पूरा नाम, जिला और मोबाइल नंबर टाइप करें`,
    occQ:`आपका व्यवसाय क्या है?`,
    bus:'व्यवसाय', house:'गृहिणी', emp:'कर्मचारी',
    dateQ:`आप हमारे हेड ऑफिस कब आ सकते हैं?`,
    today:'आज', tomorrow:'कल',
    tenderLink:`जिला फ्रेंचाइजी के लिए टेंडर दस्तावेज: ${LINKS_V92.tenderDistrict}`,
    thanks:`विवरण जमा करने के लिए धन्यवाद। हमारी फ्रेंचाइजी टीम 24 घंटे के भीतर आपको कॉल करेगी।`,
    noProblem:`कोई बात नहीं! अपना समय लें। जब आप तैयार हों, तो नीचे क्लिक करके इंस्टॉल करें।`,
  },
  ml:{
    welcome:`Bizmapia-യിലേക്ക് സ്വാഗതം\nനിങ്ങൾ ഇന്ത്യയിലെ ആദ്യത്തെ 4 ഇൻ 1 സർവീസ് ആപ്പ് പ്ലാറ്റ്ഫോമിലാണ്\nതാഴെ നിന്ന് നിങ്ങളുടെ ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക:-`,
    mainMenu:`കൂടുതൽ സഹായത്തിനായി താഴെ നിന്ന് ഏതെങ്കിലും ഒരു സേവനം ക്ലിക്ക് ചെയ്യുക:-`,
    moreServices:`കൂടുതൽ സേവനങ്ങൾ:-`,
    services:[{id:'SVC_RIDE',title:'റൈഡ് ഹെയ്ലിംഗ്'},{id:'SVC_BIZDIR',title:'ബിസിനസ് ഡയറക്ടറി'},{id:'SVC_DELIVERY',title:'ഓൺലൈൻ ഡെലിവറി'},{id:'SVC_BOOKING',title:'ഓൺലൈൻ ബുക്കിംഗ്'},{id:'SVC_OPP',title:'ബിസിനസ് അവസരം'}],
    noLang:`ക്ഷമിക്കണം, നിങ്ങൾ ഒരു ഭാഷയും തിരഞ്ഞെടുത്തില്ല.\n\nതാഴെ നിന്ന് ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക:-`,
    noService:`നിങ്ങൾ ഇതുവരെ ഒരു സേവനവും തിരഞ്ഞെടുത്തില്ല.\n\nതാഴെ നിന്ന് ഒരു സേവനം ക്ലിക്ക് ചെയ്യുക:-`,
    rideSelected:`നിങ്ങൾ "റൈഡ് ഹെയ്ലിംഗ്" തിരഞ്ഞെടുത്തു, നന്നായി\nBizmapia അതിർത്തിയില്ലാതെ ഇന്ത്യ മുഴുവൻ റൈഡ് ഹെയ്ലിംഗ് സേവനം നൽകുന്ന ഒരേയൊരു പ്ലാറ്റ്ഫോമാണ്.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    rideButtons:[{id:'RIDE_BOOK',title:'ക്യാബ് ബുക്ക് ചെയ്യുക'},{id:'RIDE_ATTACH',title:'ക്യാബ് അറ്റാച്ച് ചെയ്യുക'}],
    bookCab:`മികച്ച തിരഞ്ഞെടുപ്പ്, നിങ്ങൾ "ക്യാബ് ബുക്ക് ചെയ്യുക" സേവനം ക്ലിക്ക് ചെയ്തു.\nTwo wheeler/Autorickshaw/Hatchback/Sedan/SUV/XUV/Ambulance അടുത്ത പ്രദേശങ്ങളിൽ നിന്ന് മിതമായ നിരക്കിൽ ലഭിക്കും.\n\nതാഴെ ക്ലിക്ക് ചെയ്ത് ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക അല്ലെങ്കിൽ വിളിക്കുക:`,
    attachCab:`നിങ്ങൾ "ക്യാബ് അറ്റാച്ച് ചെയ്യുക" തിരഞ്ഞെടുത്തു\nനിങ്ങളുടെ Two wheeler/Auto/Car/SUV അറ്റാച്ച് ചെയ്ത് Bizmapia-യിലൂടെ ദിവസവും വരുമാനം നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    haveInstalled1:`നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nഇവിടെ നിങ്ങൾക്ക് റൈഡുകളിൽ പ്രത്യേക ഓഫറുകൾ സജീവമാക്കാം`,
    haveInstalled24:`നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nനിങ്ങളുടെ അവസരം അവസാനിക്കാൻ പോകുന്നു, ഇവിടെ റൈഡുകളിൽ ഓഫറുകൾ സജീവമാക്കാം`,
    yesActivate:'അതെ, സജീവമാക്കുക', noLater:'അല്ല, പിന്നീട് ചെയ്യാം',
    activated:`നന്നായി, ഞങ്ങൾ നിങ്ങളുടെ ആപ്പ് ലോഗിനിൽ നിങ്ങളുടെ ഓഫർ സജീവമാക്കുന്നു, ഇപ്പോൾ ഞങ്ങളുടെ ആപ്പിൽ ലോഗിൻ ചെയ്ത് ആദ്യ യാത്ര പൂർത്തിയാക്കി നിങ്ങളുടെ ഓഫറുകൾ പരിശോധിക്കുക`,
    helpAdmin:`സഹായം ${HELP_ADMIN}`, helpMarketing:`സഹायം ${HELP_MARKETING}`,
    bizDirSelected:`നിങ്ങൾ "ബിസിനസ് ഡയറക്ടറി" തിരഞ്ഞെടുത്തു, നന്നായി\nനിങ്ങളുടെ ബിസിനസ്സ് രജിസ്റ്റർ ചെയ്ത് ഇന്ത്യ മുഴുവൻ ഉപഭോക്താക്കളെ നേടൂ. 10 ലക്ഷത്തിലധികം പ്രാദേശിക ബിസിനസ്സുകൾ ഇതിനകം ലിസ്റ്റ് ചെയ്തിട്ടുണ്ട്.\nതാഴെ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    bizDirButtons:[{id:'BIZ_REGISTER',title:'ബിസിനസ് രജിസ്റ്റർ ചെയ്യുക'},{id:'BIZ_ADS',title:'പരസ്യം തുടങ്ങുക'}],
    bizRegister:`Bizmapia-യിൽ നിങ്ങളുടെ ബിസിനസ്സ് രജിസ്റ്റർ ചെയ്ത് കൂടുതൽ ഉപഭോക്താക്കളെയും ലീഡുകളെയും ബുക്കിംഗുകളെയും നേടാൻ തുടങ്ങൂ.\n\nതാഴെ വെബ്സൈറ്റിൽ ക്ലിക്ക് ചെയ്യുക അല്ലെങ്കിൽ വിളിക്കുക:`,
    bizAds:`Bizmapia-യിൽ നിങ്ങളുടെ ബിസിനസ്സ് പരസ്യം ചെയ്യാൻ തുടങ്ങൂ, 10 മടങ്ങ് കൂടുതൽ ഉപഭോക്താക്കളെ നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    deliverySelected:`നിങ്ങൾ "ഓൺലൈൻ ഡെലിവറി" തിരഞ്ഞെടുത്തു, നന്നായി\nപ്രാദേശിക സ്റ്റോറുകളിൽ നിന്ന് എന്തും 2 മണിക്കൂറിനുള്ളിൽ നിങ്ങളുടെ വാതിൽക്കൽ ഡെലിവറി.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    deliveryButtons:[{id:'DEL_ORDER',title:'സ്റ്റോറുകളിൽ നിന്ന് ഓർഡർ'},{id:'DEL_PARTNER',title:'ഡെലിവറി പങ്കാളിയായി സമ്പാദിക്കുക'}],
    delOrder:`പലചരക്ക്, ഭക്ഷണം, മരുന്ന്, പ്രാദേശിക സ്റ്റോറുകളിൽ നിന്ന് എന്തും ഓർഡർ ചെയ്ത് 2 മണിക്കൂറിനുള്ളിൽ ഡെലിവറി നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    delPartner:`ഞങ്ങളുടെ ഡെലിവറി പങ്കാളിയായി ദിവസവും വരുമാനം നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    bookingSelected:`നിങ്ങൾ "ഓൺലൈൻ ബുക്കിംഗ്" തിരഞ്ഞെടുത്തു, നന്നായി\nഇന്ത്യയിലുടനീളം മിതമായ നിരക്കിൽ റൂമുകൾ, അപ്പോയിന്റ്മെന്റുകൾ, മൂവി ടിക്കറ്റുകൾ ബുക്ക് ചെയ്യുക.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    bookingButtons:[{id:'BOOK_ROOM',title:'റൂമുകൾ ബുക്ക് ചെയ്യുക'},{id:'BOOK_APPOINT',title:'അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക'},{id:'BOOK_MOVIE',title:'മൂവി ടിക്കറ്റുകൾ'}],
    bookRoom:`ഇന്ത്യയിൽ എവിടെയും മികച്ച നിരക്കിൽ ഹോട്ടലുകൾ, റൂമുകൾ, റിസോർട്ടുകൾ ബുക്ക് ചെയ്യുക.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    bookAppoint:`അപ്പോയിന്റ്മെന്റുകൾ ബുക്ക് ചെയ്യുക - ഡോക്ടർ, സലൂൺ, സേവനങ്ങൾ - നിങ്ങൾക്ക് സമീപം തൽക്ഷണ ബുക്കിംഗ്.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    bookMovie:`നിങ്ങൾക്ക് സമീപമുള്ള മൂവി ടിക്കറ്റുകൾ, ഇവന്റുകൾ, ഷോകൾ ബുക്ക് ചെയ്യുക.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    oppSelected:`നിങ്ങൾ "ബിസിനസ് അവസരം" തിരഞ്ഞെടുത്തു, നന്നായി\nഞങ്ങളുടെ സർവീസ് പോയിന്റായി മാറി വരുമാനം നേടാൻ തുടങ്ങൂ. വരുമാനത്തിന്റെ 3 തലങ്ങൾ.\nഇന്ത്യയിൽ എവിടെ നിന്നും Bizmapia-യിൽ നിന്ന് വരുമാന അവസരത്തിനായി നിങ്ങളുടെ സ്ലോട്ട് ബുക്ക് ചെയ്യാൻ പോകുന്നു. നിങ്ങൾ ഏത് തരം അവസരമാണ് തിരയുന്നത്?\nതാഴെ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    oppButtons:[{id:'OPP_DISTRICT',title:'ഉയർന്ന തല വരുമാനം'},{id:'OPP_CORP',title:'മിതമായ തല വരുമാനം'},{id:'OPP_CENTER',title:'അടിസ്ഥാന തല വരുമാനം'}],
    highIntroSingle:`നിങ്ങൾ ഞങ്ങളുടെ ഉയർന്ന തലത്തിലുള്ള വരുമാന അവസരം തിരഞ്ഞെടുത്തു, നന്നായി\n\nനമുക്ക് ഞങ്ങളുടെ ജില്ലാ ഫ്രാഞ്ചൈസി അവസരത്തെക്കുറിച്ചുള്ള വിശദാംശങ്ങൾ കണ്ടെത്താം\nഓർക്കുക ഒരു ജില്ലയ്ക്ക് ഒരു അപേക്ഷ മാത്രമേ അംഗീകരിക്കൂ, അതിനാൽ മുഴുവൻ വിശദാംശങ്ങളും പഠിച്ച് ഈ ചാറ്റിലൂടെ തീരുമാനമെടുക്കുക.`,
    moderateIntroSingle:`നിങ്ങൾ ഞങ്ങളുടെ മിതമായ തലത്തിലുള്ള വരുമാന അവസരം തിരഞ്ഞെടുത്തു\n\nനമുക്ക് കോർപ്പറേഷൻ ഫ്രാഞ്ചൈസി അവസരത്തെക്കുറിച്ച് കണ്ടെത്താം`,
    baseIntroSingle:`നിങ്ങൾ ഞങ്ങളുടെ അടിസ്ഥാന തലത്തിലുള്ള വരുമാന അവസരം തിരഞ്ഞെടുത്തു\n\nനമുക്ക് ബിസിനസ് സെന്റർ അവസരത്തെക്കുറിച്ച് കണ്ടെത്താം`,
    reminderFranchise:`നിങ്ങൾ ഞങ്ങളുടെ ഫ്രാഞ്ചൈസി അവസരം പരിശോധിക്കുകയായിരുന്നു. കൂടുതൽ അറിയാൻ തുടരണോ?`,
    seeVideo:'വീഡിയോ കാണുക',
    benBtn:'ആനുകൂല്യങ്ങൾ അറിയുക', supBtn:'പിന്തുണ അറിയുക', reqBtn:'ആവശ്യകതകൾ', submitBtn:'അപേക്ഷ സമർപ്പിക്കുക', videoBtn:'വീഡിയോ ലിങ്ക്', emiBtn:'EMI ഓപ്ഷനുകൾ',
    benText:`ആനുകൂല്യങ്ങൾ - ജില്ലാ ഫ്രാഞ്ചൈസി\n\nആനുകൂല്യം 1 - നിങ്ങൾ ജില്ലയിലെ ടോപ്പ് ലെവൽ ഫ്രാഞ്ചൈസിയാണ്, നിങ്ങളുടെ ജില്ലയിലെ എല്ലാ വരുമാനത്തിലും %\nആനുകൂല്യം 2 - കമ്പനിയുമായി നേരിട്ട് ബന്ധപ്പെടാൻ നിങ്ങൾക്ക് മാത്രമേ കഴിയൂ\nആനുകൂല്യം 3 - ആജീവനാന്ത റോയൽറ്റി വരുമാനം`,
    supText:`പിന്തുണ - കമ്പനി നൽകും\nപിന്തുണ 1 - 12 മാസത്തെ മാർക്കറ്റിംഗ് പിന്തുണ\nപിന്തുണ 2 - 6 മാസത്തെ വാടക സംഭാവന\nപിന്തുണ 3 - 6 മാസത്തെ സ്റ്റാഫ് ശമ്പള പിന്തുണ`,
    reqText:`ആവശ്യകതകൾ\n\nആവശ്യകത 1 - 90 ചതുരശ്ര അടി മുറി\nആവശ്യകത 2 - 1 ഫുൾ ടൈം സ്റ്റാഫ്\nആവശ്യകത 3 - പിസി/ലാപ്ടോപ്പും ആൻഡ്രോയിഡ് മൊബൈലും`,
    corpQ:`നിങ്ങളുടെ ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?`,
    yesCorp:'അതെ കോർപ്പ്', noCorp:'അല്ല കോർപ്പ്',
    ready15:`നിങ്ങൾ അപേക്ഷ സമർപ്പിക്കാൻ പോകുന്നു, ജില്ലാ ഫ്രാഞ്ചൈസി ഫീസായി 15 ലക്ഷം രൂപ നൽകാൻ നിങ്ങൾ തയ്യാറാണെന്ന് സ്ഥിരീകരിക്കുന്നു.`,
    readyBtn:'അതെ തയ്യാർ - 15L',
    payReg:`നിങ്ങൾ 15L-ന് തയ്യാറാണെന്ന് സ്ഥിരീകരിച്ചു. നിങ്ങളുടെ ജില്ല ലോക്ക് ചെയ്യാൻ രജിസ്ട്രേഷൻ ഫീസായി 5000 രൂപ അടയ്ക്കുക. Link: ${LINKS_V92.razorpay}`,
    payBtn:'ഞാൻ 5000 അടച്ചു',
    payFeeNow:'ഫീസ് ഇപ്പോൾ അടയ്ക്കുക',
    notPaid:'അടച്ചില്ല',
    payAfter:'പണമടച്ചതിന് ശേഷം തിരഞ്ഞെടുക്കുക:-',
    emiOpt:`EMI ഓപ്ഷനുകൾ ലഭ്യമാണ്:\nEMI 10 മാസം\nEMI 20 മാസം`,
    emi10:'EMI 10 മാസം', emi20:'EMI 20 മാസം',
    leadAsk:`മികച്ചത്! ദയവായി നിങ്ങളുടെ പൂർണ്ണ നാമം, ജില്ല, മൊബൈൽ നമ്പർ ടൈപ്പ് ചെയ്യുക`,
    occQ:`നിങ്ങളുടെ തൊഴിൽ എന്താണ്?`,
    bus:'ബിസിനസ്', house:'ഹൗസ്വൈഫ്', emp:'ജീവനക്കാരൻ',
    dateQ:`നിങ്ങൾക്ക് ഞങ്ങളുടെ ഹെഡ് ഓഫീസിൽ എപ്പോൾ വരാൻ കഴിയും?`,
    today:'ഇന്ന്', tomorrow:'നാളെ',
    tenderLink:`ജില്ലാ ഫ്രാഞ്ചൈസിക്കുള്ള ടെൻഡർ ഡോക്യുമെന്റ്: ${LINKS_V92.tenderDistrict}`,
    thanks:`വിശദാംശങ്ങൾ സമർപ്പിച്ചതിന് നന്ദി. ഞങ്ങളുടെ ഫ്രാഞ്ചൈസി ടീം 24 മണിക്കൂറിനുള്ളിൽ നിങ്ങളെ വിളിക്കും.`,
    noProblem:`പ്രശ്നമില്ല! സമയമെടുക്കൂ. നിങ്ങൾ തയ്യാറാകുമ്പോൾ താഴെ ക്ലിക്ക് ചെയ്ത് ഇൻസ്റ്റാൾ ചെയ്യുക.`,
  }
};

app.get('/',(req,res)=>res.send(`V142 FINAL - IST TIMING FIXED - INDIAN TIME - ALL BUGS FIXED 1h/12h/24h 95623 24130 - Sheet + Reminders + EMI - Sheet + Reminders + EMI - OLD:${PHONE_ID_OLD} NEW:${PHONE_ID_NEW}`));
app.get('/webhook',(req,res)=>{ if(req.query['hub.verify_token']===VERIFY_TOKEN){ res.send(req.query['hub.challenge']); } else res.sendStatus(403); });

app.post('/webhook', async(req,res)=>{
  res.sendStatus(200);
  try{
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const msg = value?.messages?.[0];
    if(!msg) return;
    const uid = msg.from;
    const incomingPhoneId = value?.metadata?.phone_number_id || PHONE_NUMBER_ID;
    const txt = msg.text?.body||'';
    const btnId = msg.button?.payload || msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || '';
    const isHi = ['hi','hello','hey','hai'].includes(txt.toLowerCase().trim());
    const nowIso = new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});
    let state = await getState(uid);
    // save which number user contacted
    state.phoneId = incomingPhoneId;
    let lang = state.lang || 'en';

    if(btnId.startsWith('LANG_')){
      const l = btnId.replace('LANG_','').toLowerCase();
      lang = l==='ml'?'ml':l==='hi'?'hi':'en';
      await setState(uid,{lang, lastStep:'Language '+lang, phoneId: incomingPhoneId});
      const L=T[lang];
      clearReminders(uid);
      await sendWithDelay(interactiveButton(uid, L.mainMenu, L.services.slice(0,3), incomingPhoneId));
      await delay(300);
      await sendWithDelay(interactiveButton(uid, 'More services:-', L.services.slice(3,5), incomingPhoneId));
      await saveToSheet('Leads', [nowIso, uid, lang, 'Language Selected '+incomingPhoneId, lang, 'Clicked', HELP_ADMIN, 'Language '+lang, ''], false);
      scheduleReminder(uid,'noService:'+Date.now(),lang,1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noService2:'+Date.now(),lang,12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noService3:'+Date.now(),lang,24*60*60*1000, incomingPhoneId);
      return;
    }

    if(!state.lang){
      const L=T.en;
      const msgType = msg.type||'text';
      const rawInput = txt || msgType;
      await sendWithDelay(interactiveButton(uid, L.welcome, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'Hindi'},{id:'LANG_ML',title:'Malayalam'}], incomingPhoneId));
      await setState(uid,{first:true, lastStep:'First Message', lang:null, phoneId: incomingPhoneId});
      await saveToSheet('No_Language', [nowIso, uid, 'none', 'First Message '+incomingPhoneId, `First Input: ${rawInput} (${msgType})`, 'Received', HELP_ADMIN, 'First', ''], true);
      clearReminders(uid);
      scheduleReminder(uid,'noLang:'+Date.now(),'en',1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noLang2:'+Date.now(),'en',12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noLang3:'+Date.now(),'en',24*60*60*1000, incomingPhoneId);
      return;
    }
    if(isHi){
      const L=T.en;
      clearReminders(uid);
      await setState(uid,{first:true, lastStep:'HI - Reset', lang:null, phoneId: incomingPhoneId});
      await sendWithDelay(interactiveButton(uid, L.welcome, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'Hindi'},{id:'LANG_ML',title:'Malayalam'}], incomingPhoneId));
      await saveToSheet('HI_Reset', [nowIso, uid, 'none', 'Hi Received '+incomingPhoneId, 'Welcome Reset', 'Clicked', HELP_ADMIN, 'HI', ''], true);
      scheduleReminder(uid,'noLang:'+Date.now(),'en',1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noLang2:'+Date.now(),'en',12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noLang3:'+Date.now(),'en',24*60*60*1000, incomingPhoneId);
      return;
    }

    const L=T[lang]||T.en;

    if(btnId.startsWith('SVC_')){
      state.service=btnId; state.lastStep=btnId; state.phoneId=incomingPhoneId; await setState(uid,state);
      clearReminders(uid);
      if(btnId==='SVC_RIDE'){ await sendWithDelay(interactiveButton(uid, L.rideSelected, L.rideButtons, incomingPhoneId)); }
      else if(btnId==='SVC_BIZDIR'){ await sendWithDelay(interactiveButton(uid, L.bizDirSelected, L.bizDirButtons, incomingPhoneId)); }
      else if(btnId==='SVC_DELIVERY'){ await sendWithDelay(interactiveButton(uid, L.deliverySelected, L.deliveryButtons, incomingPhoneId)); }
      else if(btnId==='SVC_BOOKING'){ await sendWithDelay(interactiveButton(uid, L.bookingSelected, L.bookingButtons, incomingPhoneId)); }
      else if(btnId==='SVC_OPP'){ await sendWithDelay(interactiveButton(uid, L.oppSelected, L.oppButtons, incomingPhoneId)); }
      await saveToSheet('Leads', [nowIso, uid, lang, btnId+' '+incomingPhoneId, 'Main Service', 'Clicked', btnId==='SVC_OPP'?HELP_MARKETING:HELP_ADMIN, state.lastStep, ''], false);
      scheduleReminder(uid, `install:${btnId}:1`, lang, 1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, `install:${btnId}:12`, lang, 12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, `install:${btnId}:24`, lang, 24*60*60*1000, incomingPhoneId);
      return;
    }

    if(btnId==='RIDE_BOOK'){ state.sub='RIDE_BOOK'; state.lastStep='Book a Cab'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(ctaButtons(uid, L.bookCab, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId)); await saveToSheet('Book_Cab', [nowIso, uid, lang, 'Ride Hailing '+incomingPhoneId, 'Book a Cab', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:RIDE_BOOK:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:RIDE_BOOK:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:RIDE_BOOK:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='RIDE_ATTACH'){ state.sub='RIDE_ATTACH'; state.lastStep='Attach Cab'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(ctaButtons(uid, L.attachCab, [{type:'url', title:'Android', url:PLAY_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId)); await saveToSheet('Attach_Cab', [nowIso, uid, lang, 'Ride Hailing '+incomingPhoneId, 'Attach Cab', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:RIDE_ATTACH:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:RIDE_ATTACH:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:RIDE_ATTACH:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BIZ_REGISTER'){ state.sub='BIZ_REGISTER'; state.lastStep='Register Business'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(ctaButtons(uid, L.bizRegister, [{type:'url', title:'Register your Business', url:WEBSITE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId)); await saveToSheet('Register_Business', [nowIso, uid, lang, 'Business Directory '+incomingPhoneId, 'Register Business', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BIZ_REGISTER:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BIZ_REGISTER:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BIZ_REGISTER:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BIZ_ADS'){ state.sub='BIZ_ADS'; state.lastStep='Start Advertising'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(ctaButtons(uid, L.bizAds, [{type:'url', title:'Advertise Now', url:WEBSITE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId)); await saveToSheet('Start_Advertising', [nowIso, uid, lang, 'Business Directory '+incomingPhoneId, 'Start Advertising', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BIZ_ADS:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BIZ_ADS:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BIZ_ADS:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='DEL_ORDER'){ state.sub='DEL_ORDER'; state.lastStep='Order Stores'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(ctaButtons(uid, L.delOrder, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId)); await saveToSheet('Order_Stores', [nowIso, uid, lang, 'Online Delivery '+incomingPhoneId, 'Order from Stores', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:DEL_ORDER:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:DEL_ORDER:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:DEL_ORDER:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='DEL_PARTNER'){ state.sub='DEL_PARTNER'; state.lastStep='Delivery Partner'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(ctaButtons(uid, L.delPartner, [{type:'url', title:'Android', url:PLAY_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId)); await saveToSheet('Delivery_Partner', [nowIso, uid, lang, 'Online Delivery '+incomingPhoneId, 'Delivery Partner', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:DEL_PARTNER:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:DEL_PARTNER:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:DEL_PARTNER:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BOOK_ROOM'){ state.sub='BOOK_ROOM'; state.lastStep='Book Rooms'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(ctaButtons(uid, L.bookRoom, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId)); await saveToSheet('Book_Rooms', [nowIso, uid, lang, 'Online Booking '+incomingPhoneId, 'Book Rooms', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BOOK_ROOM:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_ROOM:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_ROOM:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BOOK_APPOINT'){ state.sub='BOOK_APPOINT'; state.lastStep='Book Appointments'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(ctaButtons(uid, L.bookAppoint, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId)); await saveToSheet('Book_Appointments', [nowIso, uid, lang, 'Online Booking '+incomingPhoneId, 'Book Appointments', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BOOK_APPOINT:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_APPOINT:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_APPOINT:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BOOK_MOVIE'){ state.sub='BOOK_MOVIE'; state.lastStep='Movie Tickets'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(ctaButtons(uid, L.bookMovie, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId)); await saveToSheet('Book_Movie', [nowIso, uid, lang, 'Online Booking '+incomingPhoneId, 'Movie Tickets', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BOOK_MOVIE:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_MOVIE:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_MOVIE:24', lang, 24*60*60*1000, incomingPhoneId); return; }

    if(btnId==='OPP_DISTRICT'){ state.sub='OPP_DISTRICT'; state.lastStep='High level Income - District'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(singleCta(uid, L.highIntroSingle, {type:'url', title:L.seeVideo, url:getVideoUrl('OPP_DISTRICT', lang)}, incomingPhoneId)); await delay(500); await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}], incomingPhoneId)); await saveToSheet('OPP_District', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'High level Income', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid, 'install:OPP_DISTRICT:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:OPP_DISTRICT:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:OPP_DISTRICT:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='OPP_CORP'){ state.sub='OPP_CORP'; state.lastStep='Moderate level Income - Corp'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(singleCta(uid, L.moderateIntroSingle, {type:'url', title:L.seeVideo, url:getVideoUrl('OPP_CORP', lang)}, incomingPhoneId)); await delay(500); await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}], incomingPhoneId)); await saveToSheet('OPP_Corp', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Moderate level Income', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid, 'install:OPP_CORP:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:OPP_CORP:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:OPP_CORP:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='OPP_CENTER'){ state.sub='OPP_CENTER'; state.lastStep='Base level Income - Center'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(singleCta(uid, L.baseIntroSingle, {type:'url', title:L.seeVideo, url:getVideoUrl('OPP_CENTER', lang)}, incomingPhoneId)); await delay(500); await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}], incomingPhoneId)); await saveToSheet('OPP_Center', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Base level Income', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid, 'install:OPP_CENTER:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:OPP_CENTER:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:OPP_CENTER:24', lang, 24*60*60*1000, incomingPhoneId); return; }

    if(btnId==='KNOW_BEN'){ state.lastStep='Benefits'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.benText, incomingPhoneId)); await delay(300); await sendWithDelay(interactiveButton(uid,'Next:',[{id:'KNOW_SUP',title:L.supBtn},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`} ], incomingPhoneId)); await saveToSheet('Franchise_Benefits', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Know Benefits', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_BEN:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_BEN:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_BEN:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='KNOW_SUP'){ state.lastStep='Support'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.supText, incomingPhoneId)); await delay(300); await sendWithDelay(interactiveButton(uid,'Next:',[{id:'KNOW_REQ',title:L.reqBtn},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`} ], incomingPhoneId)); await saveToSheet('Franchise_Support', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Know Support', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_SUP:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUP:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUP:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='KNOW_REQ'){ state.lastStep='Requirements'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.reqText, incomingPhoneId)); await delay(300); await sendWithDelay(interactiveButton(uid,'Next:',[{id:'SUBMIT_APP',title:L.submitBtn}], incomingPhoneId)); await saveToSheet('Franchise_Requirements', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Requirements', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_REQ:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_REQ:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_REQ:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='SUBMIT_APP'){ state.lastStep='Submit Application - Corp Check'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.corpQ,[{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], incomingPhoneId)); await saveToSheet('Franchise_Submit', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Submit Application', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_SUBMIT:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUBMIT:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUBMIT:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='CORP_YES'||btnId==='CORP_NO'){ 
      const isYes = btnId==='CORP_YES'; const fee = getFee(state.sub, isYes); const franchiseName = getFranchiseName(state.sub, isYes);
      state.fee = fee; state.franchiseName = franchiseName; state.isCorp = isYes; state.lastStep=`Ready ${fee}L - ${franchiseName} - Corp:`+btnId; state.phoneId=incomingPhoneId;
      await setState(uid,state); clearReminders(uid); 
      const readyText = getReadyText(lang, fee, franchiseName);
      const readyBtnTitle = lang==='ml' ? `അതെ തയ്യാർ - ${fee}L` : lang==='hi' ? `हाँ तैयार - ${fee}L` : `Yes Ready - ${fee}L`;
      await sendWithDelay(interactiveButton(uid,readyText,[{id:'READY_15L',title:readyBtnTitle},{id:'KNOW_EMI',title:L.emiBtn}], incomingPhoneId)); 
      await saveToSheet('Franchise_CorpCheck', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `Corp Check ${btnId} Fee ${fee}L ${franchiseName}`, 'Clicked', HELP_MARKETING, state.lastStep, `Fee:${fee}L`], true);
      scheduleReminder(uid,'install:OPP_CORPCHECK:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_CORPCHECK:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_CORPCHECK:24',lang,24*60*60*1000, incomingPhoneId); return; 
    }
    if(btnId==='READY_15L'){ 
      const fee = state.fee || 15; 
      state.lastStep=`Pay Rs5000 - ${fee}L`; 
      await setState(uid,state); 
      clearReminders(uid); 
      const payText = getPayText(lang, fee);
      // Only Pay fee now button now - reminder will be Yes/No/Call later
      await sendWithDelay(singleCta(uid, payText, {type:'url', title:L.payFeeNow, url:LINKS_V92.razorpay}));
      await saveToSheet('Franchise_Ready15L', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `Ready ${fee}L`, 'Clicked', HELP_MARKETING, state.lastStep, `Fee:${fee}L`], true);
      scheduleReminder(uid,'install:OPP_READY:1',lang,1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_READY:12',lang,12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_READY:24',lang,24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='KNOW_EMI'){ const fee = state.fee || 15; state.lastStep=`EMI Options - ${fee}L`; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); const emiText = getEMIText(lang, fee); await sendWithDelay(interactiveButton(uid,emiText + "\n\nPlease select any one from below:-",[{id:'EMI_10',title:L.emi10},{id:'EMI_20',title:L.emi20}], incomingPhoneId)); await saveToSheet('Franchise_EMI', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `EMI Options Fee ${fee}L`, 'Clicked', HELP_MARKETING, state.lastStep, `Fee:${fee}L`], true); scheduleReminder(uid,'install:OPP_EMI:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_EMI:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_EMI:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='EMI_10'||btnId==='EMI_20'){ 
      const fee = state.fee || 15; 
      state.lastStep='EMI Selected '+btnId+` - ${fee}L`; 
      await setState(uid,state); 
      clearReminders(uid); 
      const payText = getPayText(lang, fee); 
      await sendWithDelay(singleCta(uid, payText, {type:'url', title:L.payFeeNow, url:LINKS_V92.razorpay}));
      await saveToSheet('Franchise_EMI_Selected', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `EMI ${btnId} Fee ${fee}L`, 'Clicked', HELP_MARKETING, state.lastStep, `Fee:${fee}L`], true);
      scheduleReminder(uid,'install:OPP_EMISEL:1',lang,1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_EMISEL:12',lang,12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_EMISEL:24',lang,24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='PAY_NOT_DONE'){ 
      state.lastStep=`Not Paid - ${state.fee||15}L`; 
      await setState(uid,state); 
      clearReminders(uid); 
      const payText = getPayText(lang, state.fee||15);
      await sendWithDelay(singleCta(uid, payText, {type:'url', title:L.payFeeNow, url:LINKS_V92.razorpay}));
      await saveToSheet('Franchise_NotPaid', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `Not Paid ${state.fee||15}L`, 'Pending', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid,'install:NOTPAID:1',lang,1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:NOTPAID:12',lang,12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:NOTPAID:24',lang,24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='PAY_DONE'){ state.lastStep='Pay Done - Lead Start'; state.flow='LEAD'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.leadAsk, incomingPhoneId)); await saveToSheet('Franchise_PayDone', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Pay Done', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:LEAD:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:LEAD:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:LEAD:24',lang,24*60*60*1000, incomingPhoneId); return; }

    if(btnId.startsWith('OCC_')){ const occ = btnId.replace('OCC_',''); state.occupation=occ; state.lastStep='Occupation '+occ; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.dateQ,[{id:'DATE_TODAY',title:L.today},{id:'DATE_TOMORROW',title:L.tomorrow}], incomingPhoneId)); await saveToSheet('Franchise_Occupation', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Occupation '+occ, 'Clicked', HELP_MARKETING, state.lastStep, occ], true); scheduleReminder(uid,'install:OCC:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId.startsWith('DATE_')){ const date = btnId.replace('DATE_',''); state.date=date; state.lastStep='Date '+date; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.tenderLink, incomingPhoneId)); await delay(300); await sendWithDelay(textMessage(uid,L.thanks, incomingPhoneId)); await saveToSheet('Franchise_Date', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Date '+date, 'Clicked', HELP_MARKETING, state.lastStep, JSON.stringify(state)], true); await setState(uid,{lang, lastStep:'Completed', flow:'DONE', occupation:state.occupation, date:state.date, phoneId: incomingPhoneId}); return; }

    if(btnId==='YES_ACTIVATE'){ state.installed=true; state.lastStep='Yes Activate'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.activated, incomingPhoneId)); await saveToSheet('App_Install', [nowIso, uid, lang, state.sub||'App', 'Yes Activate - Installed', 'Success', state.service==='SVC_OPP' ? HELP_MARKETING : HELP_ADMIN, state.lastStep, ''], true); return; }
    if(btnId==='NO_LATER'){ state.lastStep='No Later'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); const isOpp = state.service==='SVC_OPP' || state.sub?.startsWith('OPP_'); const callNum = isOpp ? HELP_MARKETING_FULL : HELP_ADMIN_FULL; await sendWithDelay(ctaButtons(uid, L.noProblem, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:callNum}], incomingPhoneId)); await saveToSheet('App_Install', [nowIso, uid, lang, state.sub||'App', 'No Later - Pending', 'Pending', isOpp?HELP_MARKETING:HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, `install:${state.sub||'APP'}:1`, lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, `install:${state.sub||'APP'}:12`, lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, `install:${state.sub||'APP'}:24`, lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='CALL_ADMIN'||btnId==='HELP_ADMIN'){ await sendWithDelay(textMessage(uid,`📞 Customer Care: ${HELP_ADMIN}\n\nTap to call: +91 ${HELP_ADMIN}\n\ntel:+91${HELP_ADMIN}`, incomingPhoneId)); return; }
    if(btnId==='CALL_MARKETING'||btnId==='HELP_MARKETING'){ await sendWithDelay(textMessage(uid,`📞 Franchise Team: ${HELP_MARKETING}\n\nTap to call: +91 ${HELP_MARKETING}\n\ntel:+91${HELP_MARKETING}`, incomingPhoneId)); return; }

    if(state.flow==='LEAD' && txt){ state.leadData=txt; state.lastStep='Lead Typed'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.occQ,[{id:'OCC_BUSINESS',title:L.bus},{id:'OCC_HOUSE',title:L.house},{id:'OCC_EMP',title:L.emp}], incomingPhoneId)); await saveToSheet('Franchise_Leads', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Lead Data', txt, HELP_MARKETING, state.lastStep, txt], true); scheduleReminder(uid,'install:OCC:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:24',lang,24*60*60*1000, incomingPhoneId); return; }

    const msgType = msg.type||'text';
    const isMedia = ['image','video','audio','document','sticker','reaction'].includes(msgType);
    const isRandomText = txt && btnId==='' && state.flow!=='LEAD';
    if((isRandomText || isMedia) && state.lang){
      if(state.lastStep && (state.lastStep.includes('Pay Rs5000') || state.lastStep.includes('EMI Selected') || state.lastStep.includes('Not Paid') || state.lastStep.startsWith('Pay '))){
        const payText = getPayText(lang, state.fee||15);
        await sendWithDelay(singleCta(uid, payText, {type:'url', title:L.payFeeNow, url:LINKS_V92.razorpay}, incomingPhoneId));
        return;
      }
      await repeatLastStep(uid, state, lang, incomingPhoneId); 
      return; 
    }
    if(state.lang){ await sendWithDelay(interactiveButton(uid,L.mainMenu,L.services.slice(0,3), incomingPhoneId)); }
  }catch(e){ console.log('webhook error',e.message,e.stack); }
});

app.get('/clear/:phone', async(req,res)=>{ try{ let uid = req.params.phone.replace(/[^0-9]/g,''); if(uid.length===10) uid='91'+uid; if(redisReady && redis){ await redis.del(`state:${uid}`); } memoryStore.delete(uid); clearReminders(uid); res.send(`✅ Cleared user ${uid}`); }catch(e){ res.send(`Error: ${e.message}`); } });
app.get('/clear-all', async(req,res)=>{ try{ if(redisReady && redis){ const keys = await redis.keys('state:*'); if(keys.length>0) await redis.del(...keys); res.send(`✅ Cleared all ${keys.length} users`); } else { memoryStore.clear(); res.send(`✅ Cleared memoryStore`); } }catch(e){ res.send(`Error: ${e.message}`); } });
app.get('/check/:phone', async(req,res)=>{ try{ let uid = req.params.phone.replace(/[^0-9]/g,''); if(uid.length===10) uid='91'+uid; const state = await getState(uid); res.json({uid, state, redisReady, memoryHas: memoryStore.has(uid)}); }catch(e){ res.send(`Error: ${e.message}`); } });

app.listen(PORT,'0.0.0.0',async()=>{ console.log(`V142 FINAL - IST TIMING FIXED - INDIAN TIME - ALL BUGS FIXED 1h/12h/24h 95623 24130 - Sheet + Reminders + EMI - Sheet + Reminders + EMI listening on ${PORT} - OLD:${PHONE_ID_OLD} NEW:${PHONE_ID_NEW}`); await getSheets(); });
