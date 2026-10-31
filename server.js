
// V113 FIXED REMINDER PAY TOP PRIORITY 95623 24130 - Sheet + Reminders + EMI - Sheet + Reminders + EMI NUMBER - Supports 2 WhatsApp numbers + Exact Step Reminders + Sheet Write
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
  // PAY STEP - TOP PRIORITY FOR REMINDERS - Yesterday's requirement
  );

app.get('/clear/:phone', async(req,res)=>{ try{ let uid = req.params.phone.replace(/[^0-9]/g,''); if(uid.length===10) uid='91'+uid; if(redisReady && redis){ await redis.del(`state:${uid}`); } memoryStore.delete(uid); clearReminders(uid); res.send(`✅ Cleared user ${uid}`); }catch(e){ res.send(`Error: ${e.message}`); } });
app.get('/clear-all', async(req,res)=>{ try{ if(redisReady && redis){ const keys = await redis.keys('state:*'); if(keys.length>0) await redis.del(...keys); res.send(`✅ Cleared all ${keys.length} users`); } else { memoryStore.clear(); res.send(`✅ Cleared memoryStore`); } }catch(e){ res.send(`Error: ${e.message}`); } });
app.get('/check/:phone', async(req,res)=>{ try{ let uid = req.params.phone.replace(/[^0-9]/g,''); if(uid.length===10) uid='91'+uid; const state = await getState(uid); res.json({uid, state, redisReady, memoryHas: memoryStore.has(uid)}); }catch(e){ res.send(`Error: ${e.message}`); } });

app.listen(PORT,'0.0.0.0',async()=>{ console.log(`V113 FIXED REMINDER PAY TOP PRIORITY 95623 24130 - Sheet + Reminders + EMI - Sheet + Reminders + EMI listening on ${PORT} - OLD:${PHONE_ID_OLD} NEW:${PHONE_ID_NEW}`); await getSheets(); });
