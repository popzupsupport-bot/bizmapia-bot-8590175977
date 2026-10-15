// V80 FINAL - STRONG RATE LIMIT FIX 130429 - 15sec global / 30sec per user - No 5min spam - Clears old reminders - Same V79 features EN/HI/ML
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const RAZORPAY_ALL = "https://rzp.io/rzp/mq0zG6mS";
const BOT_OWN_NUMBER = "917025630644";
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || "";
const GOOGLE_SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_CREDENTIALS || "";
const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK || "";

let sheetsClient = null;
async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_JSON) return null;
  try {
    const { google } = require('googleapis');
    let credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    const client = await auth.getClient();
    sheetsClient = google.sheets({ version: 'v4', auth: client });
    console.log("Sheets client ready");
    return sheetsClient;
  } catch(e) { console.log("Sheets init fail", e.message); return null; }
}
async function ensureSheetExists(sheets, sheetName, headers) {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: GOOGLE_SHEET_ID });
    const exists = meta.data.sheets.some(s => s.properties.title === sheetName);
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({ spreadsheetId: GOOGLE_SHEET_ID, resource: { requests: [{ addSheet: { properties: { title: sheetName } } }] } });
      if (headers) {
        await sheets.spreadsheets.values.update({ spreadsheetId: GOOGLE_SHEET_ID, range: `'${sheetName}'!A1`, valueInputOption: 'RAW', resource: { values: [headers] } });
      }
      console.log(`Created sheet ${sheetName}`);
    }
  } catch(e) { console.log(`Ensure ${sheetName} ${e.message}`); }
}
async function pushToSheetDirect(entry) {
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_JSON) return false;
  try {
    const sheets = await getSheetsClient(); if(!sheets) return false;
    const isBusinessOpp = entry.flow.includes('EARN')||entry.flow.includes('DISTRICT')||entry.flow.includes('CORP')||entry.flow.includes('MUNICIPAL')||entry.flow.includes('BC_')||entry.flow.includes('READY')||entry.flow.includes('PAY')||entry.flow.includes('LEAD')||entry.flow.includes('EMI');
    const isDriver = entry.flow.includes('DRIVER')||entry.flow.includes('RIDE_ATTACH')||entry.isDriver;
    const isCustomer = entry.flow.includes('RIDE_CUSTOMER');
    const isBusinessDir = entry.flow.includes('BUSINESS_DIR')||entry.isBusinessDir;
    const isFinalLead = entry.isFinalLead||entry.direction==='FINAL_LEAD';
    const rowAll = [entry.date, entry.phone, entry.direction, entry.flow, entry.lastStep, entry.message, entry.payload, entry.currentFee, entry.currentType, entry.name, entry.place, entry.occ, entry.agreementDate];
    await sheets.spreadsheets.values.append({ spreadsheetId: GOOGLE_SHEET_ID, range: `'Sheet6 - All Logs'!A:M`, valueInputOption: 'USER_ENTERED', resource: { values: [rowAll] } });
    console.log(`Sheet6 OK ${entry.phone}`);
    if(isFinalLead){
      await sheets.spreadsheets.values.append({ spreadsheetId: GOOGLE_SHEET_ID, range: `'Sheet1 - Final Leads'!A:K`, valueInputOption: 'USER_ENTERED', resource: { values: [[entry.date, entry.phone, entry.name, entry.place, entry.currentFee, entry.currentType, entry.occ, entry.agreementDate, entry.flow, entry.lastStep, entry.message]] } });
      await sheets.spreadsheets.values.append({ spreadsheetId: GOOGLE_SHEET_ID, range: `'Sheet2 - Business Opportunity'!A:J`, valueInputOption: 'USER_ENTERED', resource: { values: [[entry.date, entry.phone, entry.flow, entry.lastStep, entry.message, entry.payload, entry.currentFee, entry.currentType, entry.name, entry.place]] } });
    } else if(isBusinessOpp){
      await sheets.spreadsheets.values.append({ spreadsheetId: GOOGLE_SHEET_ID, range: `'Sheet2 - Business Opportunity'!A:J`, valueInputOption: 'USER_ENTERED', resource: { values: [[entry.date, entry.phone, entry.flow, entry.lastStep, entry.message, entry.payload, entry.currentFee, entry.currentType, entry.name, entry.place]] } });
    } else if(isDriver){
      await sheets.spreadsheets.values.append({ spreadsheetId: GOOGLE_SHEET_ID, range: `'Sheet3 - Drivers'!A:I`, valueInputOption: 'USER_ENTERED', resource: { values: [[entry.date, entry.phone, entry.flow, entry.lastStep, entry.message, entry.payload, entry.reminderType||"", "Yes", entry.name]] } });
    } else if(isCustomer){
      await sheets.spreadsheets.values.append({ spreadsheetId: GOOGLE_SHEET_ID, range: `'Sheet4 - Customers'!A:F`, valueInputOption: 'USER_ENTERED', resource: { values: [[entry.date, entry.phone, entry.flow, entry.lastStep, entry.message, entry.payload]] } });
    } else if(isBusinessDir){
      await sheets.spreadsheets.values.append({ spreadsheetId: GOOGLE_SHEET_ID, range: `'Sheet5 - Business Directory'!A:H`, valueInputOption: 'USER_ENTERED', resource: { values: [[entry.date, entry.phone, entry.flow, entry.lastStep, entry.message, entry.payload, "Yes", "1 Year Discount"]] } });
    }
    return true;
  } catch(e){ console.log(`Sheet fail ${e.message} for ${entry.phone} ${entry.flow}`); return false; }
}

const POSTERS = {
  welcome: "https://i.ibb.co/F4YWDzvg/bizmapia-welcome-HD-1080.png",
  customerRide: "https://i.ibb.co/C3KWxFJv/bizmapia-customer-welcome-HD.png",
  driverRide: "https://i.ibb.co/mC3pLbyq/bizmapia-driver-welcome-HD.png",
  businessDir: "https://i.ibb.co/RTz6MWy3/bizmapia-business-reg-HD.png",
  delivery: "https://i.ibb.co/nN5pMLm8/Bizmapia-Fast-Safe-Local-Delivery.png",
  booking: "https://i.ibb.co/Y7FmRY7v/Bizmapia-Online-Booking-Made-Easy.png",
  businessOpp: "https://i.ibb.co/DPrK49YV/bizmapia-biz-opp-HD.png",
  driverReminderBenefits: "https://i.ibb.co/TxHz2jFH/bizmapia-benefit-reminder-HD.png",
  businessReminderOffer: "https://i.ibb.co/d0vbRFYs/bizmapia-1year-discount-HD.png",
};
const LINKS = { customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer", driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver", businessApp: "https://play.google.com/store/apps/details?id=com.bizmapia.business", tenderDistrict: "https://bizmapia.com/tender/district.pdf" };
const PHONES = { gopalan: "919745226642", business: "918590175977", displayG: "97452 26642", displayB: "85901 75977" };

let userStates = {}; const processedIds = new Set(); const lastSentPerUser = new Map(); const recentWelcomes = new Map(); const lastInteractionPerUser = new Map();
let reminderStore = {};
const REMINDER_FILE = path.join(__dirname, 'reminders.json');
// V80: Clear old reminders on startup to fix 130429 spam
try{ 
  if(fs.existsSync(REMINDER_FILE)){ 
    fs.unlinkSync(REMINDER_FILE); 
    console.log("Old reminders cleared - fixing 130429");
  } 
  reminderStore = {}; 
} catch(e){ reminderStore={}; }
function saveReminders(){ try{ fs.writeFileSync(REMINDER_FILE, JSON.stringify(reminderStore, null, 2)); }catch(e){} }
let crmLogs = [];
function logCRM(uid, dir, msg, payload, flow, step, extra={}){
  const entry = { timestamp: new Date().toISOString(), date: new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}), phone: uid, direction: dir, message: (msg||"").substring(0,500), payload: payload||"", flow: flow||"", lastStep: step||"", currentFee: extra.currentFee||userStates[uid]?.data?.currentFee||"", currentType: extra.currentType||userStates[uid]?.data?.currentType||"", name: extra.name||userStates[uid]?.data?.name||"", place: extra.place||userStates[uid]?.data?.place||"", occ: extra.occ||userStates[uid]?.data?.occ||"", agreementDate: extra.agreementDate||"", isDriver: extra.isDriver||false, isBusinessDir: extra.isBusinessDir||false, isFinalLead: extra.isFinalLead||false, reminderType: extra.reminderType||"" };
  crmLogs.push(entry); if(crmLogs.length>5000) crmLogs.shift();
  if(GOOGLE_SHEET_ID && GOOGLE_SERVICE_ACCOUNT_JSON) pushToSheetDirect(entry); else if(GOOGLE_SHEET_WEBHOOK) axios.post(GOOGLE_SHEET_WEBHOOK, entry, {timeout: 5000}).catch(()=>{});
}
function updateReminder(uid, lastStep, lastButtons, lastPoster, lastText, flow, fee, type, isDriver=false, isBusinessDir=false){ 
  // V80: No 5min reminder - only 30min+ to avoid 130429
  reminderStore[uid] = { uid, lastActivity: Date.now(), lastStep, lastButtons, lastPoster, lastText, flow, fee, type, isDriver, isBusinessDir, reminderCount: 0 }; 
  saveReminders(); 
}
async function sendReminder(uid, reminderType){
  const r = reminderStore[uid]; if(!r) return; 
  let posterToUse = r.lastPoster; let text = ""; let buttons = r.lastButtons;
  if(r.isDriver) posterToUse = POSTERS.driverReminderBenefits; else if(r.isBusinessDir) posterToUse = POSTERS.businessReminderOffer;
  const lang = userStates[uid]?.lang || 'en';
  // V80: Removed 5min reminder - start from 30min
  if(reminderType==='30min'){ 
    text = lang==='hi' ? `⏰ *30 मिनट - कोई जवाब नहीं*\n\n*${r.lastStep}* पर रुके थे\n\n👉 *अभी करें:* ${getWhatToDo(r,lang)}` : lang==='ml' ? `⏰ *30 മിനിറ്റ് - മറുപടി ഇല്ല*\n\n*${r.lastStep}* ൽ നിർത്തി\n\n👉 *ഇപ്പോൾ ചെയ്യുക:* ${getWhatToDo(r,lang)}` : `⏰ *30 min - No response*\n\nLeft at *${r.lastStep}*\n\n👉 *Do NOW:* ${getWhatToDo(r,lang)}`; r.reminderCount=1; 
  }
  else if(reminderType==='8h'){ text = `🔔 *8h reminder*\n\nAt *${r.lastStep}*\n\n👉 ${getWhatToDo(r,lang)}\n🎁 ${getWhatYouGet(r,lang)}`; r.reminderCount=2; }
  else if(reminderType==='16h'){ text = `⏰ *16h pending*\n\nLeft at *${r.lastStep}*`; r.reminderCount=3; }
  else if(reminderType==='24h'){ 
    if(r.isDriver){ text=`⚠️ *24h Driver pending*\n\nAt *${r.lastStep}*`; r.reminderCount=4; } 
    else{ 
      text = lang==='hi' ? `❌ *24 घंटे FINAL - मौका गया*\n\n*${r.lastStep}* पर 24 घंटे पहले रुके थे\n\nफिर से शुरू करें:\n\n👇 चुनें:` : lang==='ml' ? `❌ *24 മണിക്കൂർ FINAL - അവസരം നഷ്ടമായി*\n\n*${r.lastStep}* ൽ 24 മണിക്കൂർ മുൻപ് നിർത്തി\n\nവീണ്ടും തിരഞ്ഞെടുക്കൂ:` : `❌ *24h FINAL - Lost chance*\n\nAt *${r.lastStep}* 24h ago. Retry!\n\n👇 Select:`; 
      buttons = lang==='hi' ? [{title:"राइड - हैलिंग",payload:"OPT_RIDE"},{title:"बिजनेस डायरेक्टरी",payload:"OPT_DIR"},{title:"बिज़मापिया से कमाएं",payload:"OPT_EARN"}] : lang==='ml' ? [{title:"റൈഡ് - ഹെയ്‌ലിംഗ്",payload:"OPT_RIDE"},{title:"ബിസിനസ് ഡയറക്ടറി",payload:"OPT_DIR"},{title:"ബിസ്മാപിയയിൽ നിന്ന് നേടൂ",payload:"OPT_EARN"}] : [{title:"Ride - Hailing",payload:"OPT_RIDE"},{title:"Business Directory",payload:"OPT_DIR"},{title:"Earn with Bizmapia",payload:"OPT_EARN"}]; r.reminderCount=4; setTimeout(()=>{delete reminderStore[uid];saveReminders();},60000); 
    } 
  }
  else if(reminderType==='48h' && r.isDriver){ text=`🔔 *Driver 48h - 2nd Last Chance*`; r.reminderCount=5; }
  else if(reminderType==='72h' && r.isDriver){ text=`❌ *72h FINAL - Last chance*`; buttons=[{title:"Attach Vehicle",payload:"RIDE_ATTACH"},{title:"Book a Ride",payload:"RIDE_BOOK"},{title:"Main Menu",payload:"MAIN_MENU"}]; r.reminderCount=6; setTimeout(()=>{delete reminderStore[uid];saveReminders();},60000); } else return;
  r.lastReminderTime=Date.now(); saveReminders(); logCRM(uid,`REMINDER_${reminderType}`,text,buttons?.map(b=>b.payload).join("|"),r.flow,`Reminder ${reminderType} - ${r.lastStep}`,{currentFee:r.fee,currentType:r.type,isDriver:r.isDriver,isBusinessDir:r.isBusinessDir,reminderType:reminderType}); sendImageWithButtons(uid,posterToUse,text,buttons);
}
function getWhatToDo(r,lang='en'){ if(r.isDriver) return lang==='hi' ? "ड्राइवर ऐप डाउनलोड करें, रजिस्टर करें, लाइसेंस/RC/आधार अपलोड करें, रोज़ Rs.1500-2500 कमाएं" : lang==='ml' ? "ഡ്രൈവർ ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക, രജിസ്റ്റർ ചെയ്യുക, ലൈസൻസ്/RC/ആധാർ അപ്‌ലോഡ് ചെയ്യുക, ദിവസം Rs.1500-2500 നേടുക" : "Download Driver App, Register, Upload License/RC/Aadhaar, Earn Rs.1500-2500 daily"; if(r.isBusinessDir) return lang==='hi' ? "बिजनेस ऐप डाउनलोड करें, बिजनेस जोड़ें, FREE लिस्टिंग + 1 साल डिस्काउंट" : lang==='ml' ? "ബിസിനസ് ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക, ബിസിനസ് ചേർക്കുക, FREE ലിസ്റ്റിംഗ് + 1 വർഷ കിഴിവ്" : "Download Business App, Add business, FREE listing + 1 Year Discount"; return lang==='hi' ? "नीचे दिए बटन पर टैप करके जारी रखें: "+r.lastStep : lang==='ml' ? "താഴെയുള്ള ബട്ടണിൽ ടാപ്പ് ചെയ്ത് തുടരുക: "+r.lastStep : "Tap buttons below to continue: "+r.lastStep; }
function getWhatYouGet(r,lang='en'){ if(r.isDriver) return lang==='hi' ? "रोज़ Rs.1500-2500, डेली पेमेंट, बोनस" : lang==='ml' ? "ദിവസം Rs.1500-2500, ഡെയ്‌ലി പേയ്‌മെന്റ്, ബോണസ്" : "Rs.1500-2500 daily, Daily payout, Bonus"; if(r.isBusinessDir) return lang==='hi' ? "FREE लिस्टिंग, 10 लाख+ नेटवर्क, 1 साल ऑफर" : lang==='ml' ? "FREE ലിസ്റ്റിംഗ്, 10 ലക്ഷം+ നെറ്റ്‌വർക്ക്, 1 വർഷ ഓഫർ" : "FREE listing, 10L+ network, 1 Year Offer"; return lang==='hi' ? "24 घंटे में टीम कॉल करेगी" : lang==='ml' ? "24 മണിക്കൂറിനുള്ളിൽ ടീം വിളിക്കും" : "Team call within 24h"; }

// V80: Only 30min+ reminders, no 5min spam
setInterval(()=>{ const now=Date.now(); for(const uid in reminderStore){ const r=reminderStore[uid]; if(!r) continue; const diffM=(now-r.lastActivity)/60000; const diffH=diffM/60; if(diffM>=30 && diffM<31 && r.reminderCount===0) sendReminder(uid,'30min'); else if(diffH>=8 && diffH<8.05 && r.reminderCount===1) sendReminder(uid,'8h'); else if(diffH>=16 && diffH<16.05 && r.reminderCount===2) sendReminder(uid,'16h'); else if(diffH>=24 && diffH<24.05 && r.reminderCount===3) sendReminder(uid,'24h'); else if(r.isDriver && diffH>=48 && diffH<48.05 && r.reminderCount===4) sendReminder(uid,'48h'); else if(r.isDriver && diffH>=72 && diffH<72.05 && r.reminderCount===5) sendReminder(uid,'72h'); else if(!r.isDriver && diffH>25){ delete reminderStore[uid]; saveReminders(); } else if(r.isDriver && diffH>73){ delete reminderStore[uid]; saveReminders(); } } },60*1000);

// V80 STRONG RATE LIMIT: 15sec global, 30sec per user - Fixes 130429
let lastGlobalSendTime=0; const GLOBAL_GAP_MS=15000; const PER_USER_GAP_MS=30000; const sendQueue=[]; let isProcessingQueue=false;
async function processQueue(){ if(isProcessingQueue) return; isProcessingQueue=true; while(sendQueue.length>0){ if(sendQueue.length>10){ sendQueue.splice(0, sendQueue.length-10); } const now=Date.now(); const globalWait=Math.max(0,(lastGlobalSendTime+GLOBAL_GAP_MS)-now); if(globalWait>0) await new Promise(r=>setTimeout(r,globalWait)); const job=sendQueue[0]; const uid=job.uid; const lastPerUser=lastSentPerUser.get(uid)||0; const perUserWait=Math.max(0,(lastPerUser+PER_USER_GAP_MS)-Date.now()); if(perUserWait>0) await new Promise(r=>setTimeout(r,perUserWait)); sendQueue.shift(); try{ await job.fn(); lastGlobalSendTime=Date.now(); lastSentPerUser.set(uid,Date.now()); }catch(e){ const errStr=JSON.stringify(e.response?.data||e.message); if(errStr.includes('130429')){ logCRM(uid,"OUT_FAILED_130429",`Rate limit 130429 - ${job.debug}`,job.payload,"RATE_LIMIT","Rate limit"); console.log(`130429 RATE LIMIT - Waiting 60s for ${uid}`); await new Promise(r=>setTimeout(r,60000)); if((job.retryCount||0)>1){ console.log(`130429 - Dropping message for ${uid} after retry`); lastGlobalSendTime=Date.now()+60000; lastSentPerUser.set(uid,Date.now()+60000); continue; } job.retryCount=(job.retryCount||0)+1; sendQueue.unshift(job); lastGlobalSendTime=Date.now()+60000; lastSentPerUser.set(uid,Date.now()+60000); continue; } else { console.log("Queue error",errStr.substring(0,400)); lastGlobalSendTime=Date.now(); lastSentPerUser.set(uid,Date.now()); } } } isProcessingQueue=false; }
function enqueueSend(uid,fn,debug="",payload=""){ sendQueue.push({uid,fn,debug,payload, retryCount:0}); processQueue(); }

app.get('/',(req,res)=>res.status(200).send(`V80 RATE LIMIT FIX 130429 - 15sec/30sec - EN/HI/ML - 9 Posters - More Options Fixed - Direct Sheets Fixed - Reminders - <a href="/crm">CRM</a> | <a href="/reminders">Reminders</a> | <a href="/setup-sheets">Setup Sheets</a> | <a href="/clear-reminders">Clear Reminders</a>`));
app.get('/clear-reminders',(req,res)=>{ reminderStore={}; try{ if(fs.existsSync(REMINDER_FILE)) fs.unlinkSync(REMINDER_FILE); }catch(e){} saveReminders(); res.send("All reminders cleared! 130429 fixed. Now test Hi again."); });
app.get('/setup-sheets', async (req,res)=>{
  if(!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_JSON) return res.send(`Set GOOGLE_SHEET_ID and GOOGLE_CREDENTIALS env. Current SHEET_ID=${GOOGLE_SHEET_ID?'SET':'NOT SET'} CREDS=${GOOGLE_SERVICE_ACCOUNT_JSON?'SET':'NOT SET'}`);
  try{
    const sheets = await getSheetsClient(); if(!sheets) return res.send("Sheets client fail");
    await ensureSheetExists(sheets, "Sheet1 - Final Leads", ["Timestamp IST", "Phone", "Name", "Place/District", "Fee", "Type", "Occupation", "Agreement Date", "Flow", "Last Step", "Full Message"]);
    await ensureSheetExists(sheets, "Sheet2 - Business Opportunity", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Fee", "Type", "Name", "Place"]);
    await ensureSheetExists(sheets, "Sheet3 - Drivers", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Reminder Type", "Is Driver", "Name"]);
    await ensureSheetExists(sheets, "Sheet4 - Customers", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload"]);
    await ensureSheetExists(sheets, "Sheet5 - Business Directory", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Is BusinessDir", "Offer"]);
    await ensureSheetExists(sheets, "Sheet6 - All Logs", ["Timestamp IST", "Phone", "Direction", "Flow", "Last Step", "Message", "Payload", "Fee", "Type", "Name", "Place", "Occ", "Agreement Date"]);
    res.send("SUCCESS! All 6 sheets created! Range parse fixed!");
  }catch(e){ res.send("Error: "+e.message); }
});
app.get('/crm',(req,res)=>{ const html=`<html><body><h2>CRM V80 Rate Limit Fix ${crmLogs.length} logs</h2><p><a href="/reminders">Reminders</a> | <a href="/setup-sheets">Setup Sheets</a> | <a href="/clear-reminders">Clear Reminders</a></p><table border=1><tr><th>Date</th><th>Phone</th><th>Dir</th><th>Flow</th><th>Step</th><th>Fee</th><th>Msg</th></tr>${crmLogs.slice(-100).reverse().map(l=>`<tr><td>${l.date}</td><td>${l.phone}</td><td>${l.direction}</td><td>${l.flow}</td><td>${l.lastStep}</td><td>${l.currentFee}</td><td>${l.payload}<br/>${l.message}</td></tr>`).join('')}</table></body></html>`; res.send(html); });
app.get('/reminders',(req,res)=>{ const html=`<html><body><h2>Reminders ${Object.keys(reminderStore).length} pending - V80 No 5min spam</h2><table border=1><tr><th>Phone</th><th>Last Step</th><th>Diff</th><th>Count</th><th>Type</th></tr>${Object.values(reminderStore).map(r=>{const diffM=Math.floor((Date.now()-r.lastActivity)/60000);return `<tr><td>${r.uid}</td><td>${r.lastStep}</td><td>${diffM} min</td><td>${r.reminderCount}</td><td>${r.fee}</td></tr>`;}).join('')}</table></body></html>`; res.send(html); });
app.get('/webhook',(req,res)=>{ if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']); res.sendStatus(403); });

const T = {
  en: {
    selOpt:"Please select any one from below:", ride:"Ride - Hailing", dir:"Business Directory", del:"Online Delivery", book:"Online Booking", earn:"Earn with Bizmapia", more:"More Options",
    rideGoodChoice:"✅ Good choice! *Ride - Hailing*\n\nNow book/attach Cab/Auto/Bike/Ambulance anywhere India.", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle",
    custGoodChoice:"✅ Good choice! *Book a Ride*\n\nNow see cheapest Taxi/Auto/Bike with 10% Discount.", custPost:"🚖 Book ride anywhere India\nCheapest Taxi/Auto/Bike - 10% Discount\nCab/Auto/Bike/Ambulance\n\n📱 App Link Below",
    drivGoodChoice:"✅ Good choice! *Attach Vehicle*\n\nNow see how to earn Rs.1500-2500 daily.", drivPost:"💰 Attach vehicle\nDaily Rs.1500-2500\nTaxi/Auto/Bike/Ambulance\nDaily payout\n\n📱 App Link Below",
    businessDirGoodChoice:"✅ Good choice! *Business Directory*\n\nNow list your business FREE or search 10,00,000+ businesses.", businessDirIntro:"🏪 Business Directory\n10,00,000+ Businesses\n✅ Free Listing\n✅ More Customers\n✅ 1 Year Discount Offer!",
    businessDirBtn1:"List My Business", businessDirBtn2:"Search Business", businessDirBtn3:"How to List?",
    businessListGoodChoice:"✅ Good choice! *List Business*\n\nNow learn benefits & procedure to list FREE.", businessListIntro:"📝 LIST YOUR BUSINESS\nList FREE on Bizmapia!\n✅ Photo, Contact, Location\n✅ Direct customer calls\n✅ 1 Year Discount Offer!",
    businessListBenefits:"🌟 BENEFITS - Business Directory\n✅ 100% Free basic\n✅ Get nearby calls\n✅ Google + Bizmapia\n✅ Rating & Review\n✅ 1 Year Discount!", businessListProcedure:"📋 PROCEDURE\n1. Download Business App\n2. Add Business\n3. Enter Name, Category, Address\n4. Add Photos, Contact\n5. Submit\n6. Live in 24h",
    businessSearchGoodChoice:"✅ Good choice! *Search Business*\n\nNow search any business anywhere India.", businessSearchIntro:"🔍 SEARCH BUSINESS\nFind any business India\n✅ Name, category, place\n✅ 10 lakh+ listed", businessSearchHow:"How to Search?\n1. Download App\n2. Search name/category\n3. Select place\n4. Get contact\n5. Call directly",
    deliveryGoodChoice:"✅ Good choice! *Online Delivery*\n\nNow send parcel in 2 Hours anywhere India, or join as agent.", deliveryIntro:"📦 Online Delivery\n⚡ 2 Hours Delivery\n📍 Anywhere India\n💰 Cheapest Rates", deliveryBtn1:"Book Parcel", deliveryBtn2:"Join as Agent", deliveryBtn3:"How it Works?",
    deliveryBookGoodChoice:"✅ Good choice! *Book Parcel*\n\nNow see parcel types & booking procedure.", deliveryBookIntro:"📦 BOOK PARCEL\nSend anything in 2 Hours!\n✅ Documents, Food, Gifts, Medicine",
    deliveryBookProcedure:"📋 PROCEDURE - Book Parcel\n1. Download App\n2. Select Delivery\n3. Enter Pickup/Delivery Address\n4. Enter parcel details\n5. Get price\n6. Confirm & Pay\n7. Pickup 30 mins\n8. Delivered 2 Hours!", deliveryBookCharges:"💰 CHARGES\n• City: Rs.50+\n• District: Rs.100+\n• Inter-District: KM based",
    deliveryAgentGoodChoice:"✅ Good choice! *Join as Agent*\n\nNow see benefits, requirements, procedure to earn daily.", deliveryAgentIntro:"🏍️ JOIN AS AGENT\n💰 Rs.800-1500/day\n✅ Part/full time\n✅ Own bike\n✅ Daily payout",
    deliveryAgentBenefits:"🌟 BENEFITS - Join as Agent\n✅ Rs.800-1500/day\n✅ Bonus per delivery\n✅ No office\n✅ Work near your area\n✅ Daily payout", deliveryAgentRequirements:"📋 REQUIREMENTS - Join as Agent\n✅ Bike + License + RC\n✅ Android Mobile\n✅ Aadhaar + PAN\n✅ 18+ Age", deliveryAgentProcedure:"📋 PROCEDURE - Join as Agent\n1. Download Driver App\n2. Register as Agent\n3. Upload Bike, License, Aadhaar\n4. Verify 24h\n5. Training\n6. Start Earning!",
    riderBenefitsDetail:"🏍️ RIDER BENEFITS\n💰 Daily Rs.1500-2500\n✅ Part time / Full time\n✅ Own vehicle\n✅ Daily payout\n✅ Bonus", driverRemindBenefits:"🔔 DRIVER REMINDER - Benefits\n💰 Earn Rs.1500-2500 daily!\n🚖 Taxi/Auto/Bike/Ambulance\n✅ Daily payout\n✅ Bonus",
    bookingGoodChoice:"✅ Good choice! *Online Booking*\n\nNow book Rooms, Appointments, Movie Tickets in 1 click.", bookIntro:"🏨 Online Booking\nBook Rooms, Appointments & Movie Tickets in 1 Click!\n✅ Rooms - Hotels, Resorts\n✅ Appointments - Doctors, Salons\n✅ Movies - All Theatres",
    bookRoom:"Book Room", bookAppointment:"Book Appointment", bookMovie:"Book Movie",
    bookRoomGoodChoice:"✅ Good choice! *Book Rooms*", bookRoomDetail:"🏨 BOOK ROOMS\nHotels | Resorts | Homestays\n✅ Affordable Rates\n✅ Instant Confirmation",
    bookAppointmentGoodChoice:"✅ Good choice! *Book Appointments*", bookAppointmentDetail:"🩺 BOOK APPOINTMENTS\nDoctors | Salons | Services\n✅ Instant Confirmation",
    bookMovieGoodChoice:"✅ Good choice! *Book Movie Tickets*", bookMovieDetail:"🎬 BOOK MOVIE TICKETS\nLatest Movies | All Theatres\n✅ Easy, Fast, Affordable",
    earnGoodChoice:"✅ Good choice! *Earn with Bizmapia*\n\nNow choose High, Moderate, Base opportunity.", earnIntro:"💰 Earn with Bizmapia\nChoose your opportunity",
    high:"High Earning (15L)", mod:"Moderate (3-7L)", base:"Base (Business Center)",
    highGoodChoice:"✅ Good choice! *High Earning*\n\nNow see District/Corp/Municipal details. ONE per district.", highIntro:"🔥 HIGH EARNING\nOnly ONE per district!\n💰 District - 15L\nCorp - 7L\nMunicipal - 3L", highOptDistrict:"District - 15L", highOptCorp:"Corporation - 7L", highOptMuni:"Municipal - 3L",
    moderateGoodChoice:"✅ Good choice! *Moderate Earning*", moderateIntro:"💼 MODERATE EARNING - 3-7L CONFIRMED\nChoose:\n• Corp - 7L\n• Municipal - 3L\n• BC - 50K-1L", corpGoodChoice:"✅ Good choice! *Corporation 7L*", corpIntro:"🏙️ CORPORATION - 7 Lakhs\n• Corporation area\n• Control Business Centers", municipalGoodChoice:"✅ Good choice! *Municipal 3L*", municipalIntro:"🏘️ MUNICIPAL - 3 Lakhs\n• Municipality area",
    baseGoodChoice:"✅ Good choice! *Base - Business Center*", baseIntro:"🏪 BASE - BUSINESS CENTER - 50K-1L CONFIRMED\nLow Investment, High Return", businessCenterIntro:"🏪 BUSINESS CENTER - 50K-1L\n• Panchayat/Small Town\n• You are local center\n• Earn from 4 services", businessCenterBenefits:"🌟 BENEFITS - BC\n✅ 50K-1L low invest\n✅ Earn 4 services\n✅ 90sqft enough",
    procedureDistrict:"PROCEDURE - District 15L\n1. Know benefits\n2. Corp check Yes/No\n3. Confirm ready 15L\n4. Pay Rs.5000\n5. Share Name, Place, District\n6. Agreement Date\n7. Tender\n8. Team call 24h\n9. Balance + Training", procedureBusinessCenter:"PROCEDURE - BC 50K-1L\n1. Know benefits\n2. Requirements 90sqft\n3. Pay Rs.5000\n4. Share details\n5. Agreement Date", procedureCommon:"GENERAL PROCEDURE - All 4 types\n1. Select type\n2. Benefits, Support, Requirements\n3. Corp check\n4. Ready to pay\n5. Pay Rs.5000\n6. EMI\n7. Share details\n8. Occupation\n9. Agreement date\n10. Tender\n11. Verification\n12. Launch",
    benDistrict:"BENEFITS - District 15L\n✅ Top level franchisee\n✅ % on ALL earnings\n✅ Direct Company contact\n✅ Lifetime royalty", benCorp:"BENEFITS - Corp 7L\n✅ Control corp area\n✅ % from BCs", benBusinessCenter:"BENEFITS - BC 50K-1L\n✅ Low invest\n✅ Earn 4 services",
    supText:"SUPPORT\n✅ 12 months marketing\n✅ 6 months Rent (District)\n✅ 6 months Staff salary\n✅ Software + Training", reqDistrict:"REQUIREMENTS - District 15L\n✅ 90 Sqft room\n✅ 1 staff\n✅ PC/Mobile\n✅ Ready 15L\n✅ Aadhaar + PAN", reqBusinessCenter:"REQUIREMENTS - BC\n✅ 90 Sqft room\n✅ 1 staff\n✅ PC/Mobile\n✅ Ready 50K-1L",
    corpQGoodChoice:"✅ Good choice! Ready to submit.\n\nNow: Did district contain corporation?", corpQ:"Did district contain corporation? If HQ has Corporation (e.g. Kochi), select Yes Corp.", yesCorp:"Yes Corp", noCorp:"No Corp",
    readyGoodChoice:"✅ Good choice! Corp status confirmed.\n\nNow confirm ready to pay fee.", ready15:"Confirm ready to pay 15 Lakhs as District fee.\n👉 Next: Pay Rs.5000 registration.", ready7:"Confirm ready to pay 7 Lakhs as Corporation fee.", ready3:"Confirm ready to pay 3 Lakhs as Municipal fee.", readyBC:"Confirm ready to pay 50K-1L as Business Center fee.", readyBtn15:"Yes Ready - 15L", readyBtn7:"Yes Ready - 7L", readyBtn3:"Yes Ready - 3L", readyBtnBC:"Yes Ready - BC",
    payGoodChoice:"✅ Good choice! Ready confirmed.\n\nNow pay Rs.5000 registration. Part of total fee, not extra.", payReg:"Pay Rs.5000 to proceed.\nPart of total fee, not extra.\nTap Pay Now below.", emiGoodChoice:"✅ Good choice! EMI options.", emiOpt:"Select EMI:\nDown 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10:"5L + 10x1L", emi20:"5L + 20x50k", emiBusiness:"BC EMI",
    leadGoodChoice:"✅ Good choice! Payment done.\n\nNow share contact details. Final step.", leadAsk:"Share contact:\nName, Place, District, State, Contact, Occupation\n\nName as per Aadhaar:", occQGoodChoice:"✅ Good choice! Place shared.\n\nNow select occupation.", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", tender:"Download Tender", dateGoodChoice:"✅ Good choice! Occupation selected.\n\nNow select agreement date.", date:"Select Agreement Date:", today:"Today", tom:"Tomorrow", thanksGoodChoice:"✅ Great! All details received.\n\n", thanks:"Thanks! Team will call within 24h. Application submitted!",
    callG:"97452 26642", callB:"85901 75977", bookNow:"Book Now", dlDriv:"Driver App", knowProcedure:"Know Procedure", backToEarn:"Back to Earn", viewTender:"View Tender", video:"Video Link", benefits:"Benefits", support:"Support", requirements:"Requirements", submit:"Submit Application", pay:"Pay Rs.5000", emi:"EMI Options", howToList:"How to List?", searchBusiness:"Search Business", howItWorks:"How it Works?", bookParcel:"Book Parcel", joinAgent:"Join as Agent", listBusiness:"List Business", downloadApp:"Download App"
  },
  hi: {
    selOpt:"कृपया नीचे दिए गए विकल्पों में से कोई एक चुनें:", ride:"राइड - हैलिंग", dir:"बिजनेस डायरेक्टरी", del:"ऑनलाइन डिलीवरी", book:"ऑनलाइन बुकिंग", earn:"बिज़मापिया से कमाएं", more:"और विकल्प",
    rideGoodChoice:"✅ बहुत अच्छा! *राइड - हैलिंग*\n\nअब पूरे भारत में कहीं भी कैब/ऑटो/बाइक/एम्बुलेंस बुक/अटैच करें।", rideOpt:"A. राइड बुक करें\nB. अपना वाहन अटैच करें", bookRide:"राइड बुक करें", attach:"वाहन अटैच करें",
    custGoodChoice:"✅ बढ़िया! *राइड बुक करें*\n\nअब 10% छूट के साथ सबसे सस्ती टैक्सी/ऑटो/बाइक देखें।", custPost:"🚖 पूरे भारत में राइड बुक करें\nसबसे सस्ती टैक्सी/ऑटो/बाइक - 10% छूट\nकैब/ऑटो/बाइक/एम्बुलेंस\n\n📱 नीचे ऐप लिंक",
    drivGoodChoice:"✅ बढ़िया! *वाहन अटैच करें*\n\nअब रोज़ Rs.1500-2500 कैसे कमाएं देखें।", drivPost:"💰 वाहन अटैच करें\nरोज़ Rs.1500-2500\nटैक्सी/ऑटो/बाइक/एम्बुलेंस\nरोज़ पेमेंट\n\n📱 नीचे ऐप लिंक",
    businessDirGoodChoice:"✅ बहुत अच्छा! *बिजनेस डायरेक्टरी*\n\nअब अपना बिजनेस FREE लिस्ट करें या 10 लाख+ बिजनेस सर्च करें।", businessDirIntro:"🏪 बिजनेस डायरेक्टरी\n10 लाख+ बिजनेस\n✅ फ्री लिस्टिंग\n✅ ज्यादा ग्राहक\n✅ 1 साल डिस्काउंट ऑफर!",
    businessDirBtn1:"मेरा बिजनेस लिस्ट करें", businessDirBtn2:"बिजनेस सर्च करें", businessDirBtn3:"कैसे लिस्ट करें?",
    businessListGoodChoice:"✅ बढ़िया! *बिजनेस लिस्ट*\n\nअब FREE लिस्टिंग के फायदे और तरीका जानें।", businessListIntro:"📝 अपना बिजनेस लिस्ट करें\nबिज़मापिया पर FREE लिस्ट करें!\n✅ फोटो, संपर्क, लोकेशन\n✅ सीधे ग्राहक कॉल\n✅ 1 साल डिस्काउंट ऑफर!",
    businessListBenefits:"🌟 फायदे - बिजनेस डायरेक्टरी\n✅ 100% फ्री बेसिक\n✅ नजदीकी कॉल पाएं\n✅ Google + बिज़मापिया\n✅ रेटिंग और रिव्यू\n✅ 1 साल डिस्काउंट!", businessListProcedure:"📋 तरीका\n1. बिजनेस ऐप डाउनलोड करें\n2. बिजनेस जोड़ें\n3. नाम, कैटेगरी, पता भरें\n4. फोटो, संपर्क जोड़ें\n5. सबमिट करें\n6. 24 घंटे में लाइव",
    businessSearchGoodChoice:"✅ बढ़िया! *बिजनेस सर्च*\n\nअब पूरे भारत में कोई भी बिजनेस सर्च करें।", businessSearchIntro:"🔍 बिजनेस सर्च\nभारत में कोई भी बिजनेस खोजें\n✅ नाम, कैटेगरी, जगह\n✅ 10 लाख+ लिस्टेड", businessSearchHow:"कैसे सर्च करें?\n1. ऐप डाउनलोड करें\n2. नाम/कैटेगरी सर्च करें\n3. जगह चुनें\n4. संपर्क पाएं\n5. सीधे कॉल करें",
    deliveryGoodChoice:"✅ बढ़िया! *ऑनलाइन डिलीवरी*\n\nअब 2 घंटे में कहीं भी पार्सल भेजें, या एजेंट बनें।", deliveryIntro:"📦 ऑनलाइन डिलीवरी\n⚡ 2 घंटे डिलीवरी\n📍 पूरे भारत में\n💰 सबसे सस्ता", deliveryBtn1:"पार्सल बुक करें", deliveryBtn2:"एजेंट बनें", deliveryBtn3:"कैसे काम करता है?",
    deliveryBookGoodChoice:"✅ बढ़िया! *पार्सल बुक*\n\nअब पार्सल प्रकार और बुकिंग तरीका देखें।", deliveryBookIntro:"📦 पार्सल बुक करें\n2 घंटे में कुछ भी भेजें!\n✅ दस्तावेज़, खाना, उपहार, दवा",
    deliveryBookProcedure:"📋 तरीका - पार्सल बुक\n1. ऐप डाउनलोड करें\n2. डिलीवरी चुनें\n3. पिकअप/डिलीवरी पता भरें\n4. पार्सल विवरण भरें\n5. कीमत देखें\n6. कन्फर्म और पे करें\n7. 30 मिनट में पिकअप\n8. 2 घंटे में डिलीवरी!", deliveryBookCharges:"💰 चार्ज\n• शहर: Rs.50+\n• जिला: Rs.100+\n• अंतर-जिला: KM के अनुसार",
    deliveryAgentGoodChoice:"✅ बढ़िया! *एजेंट बनें*\n\nअब रोज़ कमाने के फायदे, जरूरतें, तरीका देखें।", deliveryAgentIntro:"🏍️ एजेंट बनें\n💰 रोज़ Rs.800-1500\n✅ पार्ट/फुल टाइम\n✅ खुद की बाइक\n✅ रोज़ पेमेंट",
    deliveryAgentBenefits:"🌟 फायदे - एजेंट बनें\n✅ रोज़ Rs.800-1500\n✅ प्रति डिलीवरी बोनस\n✅ कोई ऑफिस नहीं\n✅ अपने एरिया में काम\n✅ रोज़ पेमेंट", deliveryAgentRequirements:"📋 जरूरतें - एजेंट बनें\n✅ बाइक + लाइसेंस + RC\n✅ एंड्रॉयड मोबाइल\n✅ आधार + PAN\n✅ 18+ उम्र", deliveryAgentProcedure:"📋 तरीका - एजेंट बनें\n1. ड्राइवर ऐप डाउनलोड करें\n2. एजेंट के रूप में रजिस्टर करें\n3. बाइक, लाइसेंस, आधार अपलोड करें\n4. 24 घंटे में वेरिफाई\n5. ट्रेनिंग\n6. कमाना शुरू करें!",
    riderBenefitsDetail:"🏍️ राइडर फायदे\n💰 रोज़ Rs.1500-2500\n✅ पार्ट टाइम / फुल टाइम\n✅ खुद का वाहन\n✅ रोज़ पेमेंट\n✅ बोनस", driverRemindBenefits:"🔔 ड्राइवर रिमाइंडर - फायदे\n💰 रोज़ Rs.1500-2500 कमाएं!\n🚖 टैक्सी/ऑटो/बाइक/एम्बुलेंस\n✅ रोज़ पेमेंट\n✅ बोनस",
    bookingGoodChoice:"✅ बढ़िया! *ऑनलाइन बुकिंग*\n\nअब 1 क्लिक में रूम, अपॉइंटमेंट, मूवी टिकट बुक करें।", bookIntro:"🏨 ऑनलाइन बुकिंग\n1 क्लिक में रूम, अपॉइंटमेंट और मूवी टिकट बुक करें!\n✅ रूम - होटल, रिसॉर्ट\n✅ अपॉइंटमेंट - डॉक्टर, सैलून\n✅ मूवी - सभी थिएटर",
    bookRoom:"रूम बुक करें", bookAppointment:"अपॉइंटमेंट बुक करें", bookMovie:"मूवी बुक करें",
    bookRoomGoodChoice:"✅ बढ़िया! *रूम बुक*", bookRoomDetail:"🏨 रूम बुक करें\nहोटल | रिसॉर्ट | होमस्टे\n✅ किफायती दर\n✅ तुरंत कन्फर्म",
    bookAppointmentGoodChoice:"✅ बढ़िया! *अपॉइंटमेंट बुक*", bookAppointmentDetail:"🩺 अपॉइंटमेंट बुक करें\nडॉक्टर | सैलून | सर्विस\n✅ तुरंत कन्फर्म",
    bookMovieGoodChoice:"✅ बढ़िया! *मूवी टिकट बुक*", bookMovieDetail:"🎬 मूवी टिकट बुक करें\nनवीनतम फिल्में | सभी थिएटर\n✅ आसान, तेज़, किफायती",
    earnGoodChoice:"✅ बढ़िया! *बिज़मापिया से कमाएं*\n\nअब हाई, मॉडरेट, बेस अवसर चुनें।", earnIntro:"💰 बिज़मापिया से कमाएं\nअपना अवसर चुनें",
    high:"ज्यादा कमाई (15L)", mod:"मध्यम (3-7L)", base:"बेस (बिजनेस सेंटर)",
    highGoodChoice:"✅ बढ़िया! *ज्यादा कमाई*\n\nअब जिला/कॉर्प/नगरपालिका विवरण देखें। प्रति जिला केवल ONE।", highIntro:"🔥 ज्यादा कमाई\nप्रति जिला केवल ONE!\n💰 जिला - 15L\nकॉर्प - 7L\nनगरपालिका - 3L", highOptDistrict:"जिला - 15L", highOptCorp:"निगम - 7L", highOptMuni:"नगरपालिका - 3L",
    moderateGoodChoice:"✅ बढ़िया! *मध्यम कमाई*", moderateIntro:"💼 मध्यम कमाई - 3-7L कन्फर्म\nचुनें:\n• कॉर्प - 7L\n• नगरपालिका - 3L\n• BC - 50K-1L", corpGoodChoice:"✅ बढ़िया! *निगम 7L*", corpIntro:"🏙️ निगम - 7 लाख\n• निगम क्षेत्र\n• बिजनेस सेंटर कंट्रोल", municipalGoodChoice:"✅ बढ़िया! *नगरपालिका 3L*", municipalIntro:"🏘️ नगरपालिका - 3 लाख\n• नगरपालिका क्षेत्र",
    baseGoodChoice:"✅ बढ़िया! *बेस - बिजनेस सेंटर*", baseIntro:"🏪 बेस - बिजनेस सेंटर - 50K-1L कन्फर्म\nकम निवेश, ज्यादा रिटर्न", businessCenterIntro:"🏪 बिजनेस सेंटर - 50K-1L\n• पंचायत/छोटा शहर\n• आप लोकल सेंटर हैं\n• 4 सेवाओं से कमाएं", businessCenterBenefits:"🌟 फायदे - BC\n✅ 50K-1L कम निवेश\n✅ 4 सेवाओं से कमाएं\n✅ 90sqft काफी",
    procedureDistrict:"तरीका - जिला 15L\n1. फायदे जानें\n2. कॉर्प चेक Yes/No\n3. 15L के लिए तैयार कन्फर्म\n4. Rs.5000 पे करें\n5. नाम, जगह, जिला शेयर करें\n6. एग्रीमेंट तारीख\n7. टेंडर\n8. 24 घंटे में टीम कॉल\n9. बैलेंस + ट्रेनिंग", procedureBusinessCenter:"तरीका - BC 50K-1L\n1. फायदे जानें\n2. जरूरतें 90sqft\n3. Rs.5000 पे करें\n4. विवरण शेयर करें\n5. एग्रीमेंट तारीख", procedureCommon:"सामान्य तरीका - सभी 4 प्रकार\n1. प्रकार चुनें\n2. फायदे, सपोर्ट, जरूरतें\n3. कॉर्प चेक\n4. पे करने के लिए तैयार\n5. Rs.5000 पे करें\n6. EMI\n7. विवरण शेयर करें\n8. पेशा\n9. एग्रीमेंट तारीख\n10. टेंडर\n11. वेरिफिकेशन\n12. लॉन्च",
    benDistrict:"फायदे - जिला 15L\n✅ टॉप लेवल फ्रेंचाइजी\n✅ सभी कमाई पर %\n✅ सीधे कंपनी संपर्क\n✅ लाइफटाइम रॉयल्टी", benCorp:"फायदे - कॉर्प 7L\n✅ कॉर्प एरिया कंट्रोल\n✅ BC से %", benBusinessCenter:"फायदे - BC 50K-1L\n✅ कम निवेश\n✅ 4 सेवाओं से कमाएं",
    supText:"सपोर्ट\n✅ 12 महीने मार्केटिंग\n✅ 6 महीने किराया (जिला)\n✅ 6 महीने स्टाफ सैलरी\n✅ सॉफ्टवेयर + ट्रेनिंग", reqDistrict:"जरूरतें - जिला 15L\n✅ 90 Sqft रूम\n✅ 1 स्टाफ\n✅ PC/मोबाइल\n✅ 15L तैयार\n✅ आधार + PAN", reqBusinessCenter:"जरूरतें - BC\n✅ 90 Sqft रूम\n✅ 1 स्टाफ\n✅ PC/मोबाइल\n✅ 50K-1L तैयार",
    corpQGoodChoice:"✅ बढ़िया! सबमिट करने के लिए तैयार।\n\nअब: क्या जिले में कॉर्पोरेशन है?", corpQ:"क्या जिले में कॉर्पोरेशन है? अगर HQ में कॉर्पोरेशन है (जैसे कोच्चि), तो Yes Corp चुनें।", yesCorp:"Yes Corp", noCorp:"No Corp",
    readyGoodChoice:"✅ बढ़िया! कॉर्प स्थिति कन्फर्म।\n\nअब फीस पे करने के लिए तैयार कन्फर्म करें।", ready15:"15 लाख जिला फीस के रूप में पे करने के लिए तैयार कन्फर्म करें।\n👉 अगला: Rs.5000 रजिस्ट्रेशन पे करें।", ready7:"7 लाख निगम फीस के रूप में पे करने के लिए तैयार कन्फर्म करें।", ready3:"3 लाख नगरपालिका फीस के रूप में पे करने के लिए तैयार कन्फर्म करें।", readyBC:"50K-1L बिजनेस सेंटर फीस के रूप में पे करने के लिए तैयार कन्फर्म करें।", readyBtn15:"हाँ तैयार - 15L", readyBtn7:"हाँ तैयार - 7L", readyBtn3:"हाँ तैयार - 3L", readyBtnBC:"हाँ तैयार - BC",
    payGoodChoice:"✅ बढ़िया! तैयार कन्फर्म।\n\nअब Rs.5000 रजिस्ट्रेशन पे करें। कुल फीस का हिस्सा, अतिरिक्त नहीं।", payReg:"Rs.5000 पे करके आगे बढ़ें।\nकुल फीस का हिस्सा, अतिरिक्त नहीं।\nनीचे Pay Now पर टैप करें।", emiGoodChoice:"✅ बढ़िया! EMI विकल्प।", emiOpt:"EMI चुनें:\nडाउन 5 लाख + 10 महीने / डाउन 5 लाख + 20 महीने", emi10:"5L + 10x1L", emi20:"5L + 20x50k", emiBusiness:"BC EMI",
    leadGoodChoice:"✅ बढ़िया! पेमेंट हो गया।\n\nअब संपर्क विवरण शेयर करें। अंतिम चरण।", leadAsk:"संपर्क शेयर करें:\nनाम, जगह, जिला, राज्य, संपर्क, पेशा\n\nआधार के अनुसार नाम:", occQGoodChoice:"✅ बढ़िया! जगह शेयर की।\n\nअब पेशा चुनें।", occQ:"पेशा चुनें:", bus:"बिजनेस", house:"हाउसवाइफ", emp:"कर्मचारी", tender:"टेंडर डाउनलोड करें", dateGoodChoice:"✅ बढ़िया! पेशा चुना।\n\nअब एग्रीमेंट तारीख चुनें।", date:"एग्रीमेंट तारीख चुनें:", today:"आज", tom:"कल", thanksGoodChoice:"✅ बहुत बढ़िया! सभी विवरण मिल गए।\n\n", thanks:"धन्यवाद! टीम 24 घंटे में कॉल करेगी। आवेदन सबमिट हो गया!",
    callG:"97452 26642", callB:"85901 75977", bookNow:"अभी बुक करें", dlDriv:"ड्राइवर ऐप", knowProcedure:"तरीका जानें", backToEarn:"वापस कमाएं पर", viewTender:"टेंडर देखें", video:"वीडियो लिंक", benefits:"फायदे", support:"सपोर्ट", requirements:"जरूरतें", submit:"आवेदन सबमिट करें", pay:"Rs.5000 पे करें", emi:"EMI विकल्प", howToList:"कैसे लिस्ट करें?", searchBusiness:"बिजनेस सर्च करें", howItWorks:"कैसे काम करता है?", bookParcel:"पार्सल बुक करें", joinAgent:"एजेंट बनें", listBusiness:"बिजनेस लिस्ट करें", downloadApp:"ऐप डाउनलोड करें"
  },
  ml: {
    selOpt:"ദയവായി താഴെയുള്ളവയിൽ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കൂ:", ride:"റൈഡ് - ഹെയ്‌ലിംഗ്", dir:"ബിസിനസ് ഡയറക്ടറി", del:"ഓൺലൈൻ ഡെലിവറി", book:"ഓൺലൈൻ ബുക്കിംഗ്", earn:"ബിസ്മാപിയയിൽ നിന്ന് നേടൂ", more:"കൂടുതൽ ഓപ്ഷനുകൾ",
    rideGoodChoice:"✅ നല്ല തിരഞ്ഞെടുപ്പ്! *റൈഡ് - ഹെയ്‌ലിംഗ്*\n\nഇനി ഇന്ത്യയിൽ എവിടെയും ക്യാബ്/ഓട്ടോ/ബൈക്ക്/ആംബുലൻസ് ബുക്ക്/അറ്റാച്ച് ചെയ്യാം.", rideOpt:"A. റൈഡ് ബുക്ക് ചെയ്യുക\nB. വാഹനം അറ്റാച്ച് ചെയ്യുക", bookRide:"റൈഡ് ബുക്ക് ചെയ്യുക", attach:"വാഹനം അറ്റാച്ച് ചെയ്യുക",
    custGoodChoice:"✅ നല്ലത്! *റൈഡ് ബുക്ക് ചെയ്യുക*\n\nഇനി 10% കിഴിവോടെ ഏറ്റവും വിലകുറഞ്ഞ ടാക്സി/ഓട്ടോ/ബൈക്ക് കാണുക.", custPost:"🚖 ഇന്ത്യയിൽ എവിടെയും റൈഡ് ബുക്ക് ചെയ്യുക\nഏറ്റവും വിലകുറഞ്ഞ ടാക്സി/ഓട്ടോ/ബൈക്ക് - 10% കിഴിവ്\nക്യാബ്/ഓട്ടോ/ബൈക്ക്/ആംബുലൻസ്\n\n📱 താഴെ ആപ്പ് ലിങ്ക്",
    drivGoodChoice:"✅ നല്ലത്! *വാഹനം അറ്റാച്ച് ചെയ്യുക*\n\nഇനി ദിവസം Rs.1500-2500 എങ്ങനെ നേടാം എന്ന് കാണുക.", drivPost:"💰 വാഹനം അറ്റാച്ച് ചെയ്യുക\nദിവസം Rs.1500-2500\nടാക്സി/ഓട്ടോ/ബൈക്ക്/ആംബുലൻസ്\nഡെയ്‌ലി പേയ്‌മെന്റ്\n\n📱 താഴെ ആപ്പ് ലിങ്ക്",
    businessDirGoodChoice:"✅ നല്ല തിരഞ്ഞെടുപ്പ്! *ബിസിനസ് ഡയറക്ടറി*\n\nഇനി ബിസിനസ് FREE ആയി ലിസ്റ്റ് ചെയ്യുക അല്ലെങ്കിൽ 10 ലക്ഷം+ ബിസിനസ് സെർച്ച് ചെയ്യുക.", businessDirIntro:"🏪 ബിസിനസ് ഡയറക്ടറി\n10 ലക്ഷം+ ബിസിനസുകൾ\n✅ ഫ്രീ ലിസ്റ്റിംഗ്\n✅ കൂടുതൽ കസ്റ്റമേഴ്സ്\n✅ 1 വർഷ കിഴിവ് ഓഫർ!",
    businessDirBtn1:"എന്റെ ബിസിനസ് ലിസ്റ്റ് ചെയ്യുക", businessDirBtn2:"ബിസിനസ് സെർച്ച് ചെയ്യുക", businessDirBtn3:"എങ്ങനെ ലിസ്റ്റ് ചെയ്യാം?",
    businessListGoodChoice:"✅ നല്ലത്! *ബിസിനസ് ലിസ്റ്റ്*\n\nഇനി FREE ലിസ്റ്റിംഗിന്റെ ഗുണങ്ങളും രീതിയും അറിയുക.", businessListIntro:"📝 ബിസിനസ് ലിസ്റ്റ് ചെയ്യുക\nബിസ്മാപിയയിൽ FREE ആയി ലിസ്റ്റ് ചെയ്യുക!\n✅ ഫോട്ടോ, കോൺടാക്റ്റ്, ലൊക്കേഷൻ\n✅ നേരിട്ട് കസ്റ്റമർ കോൾ\n✅ 1 വർഷ കിഴിവ് ഓഫർ!",
    businessListBenefits:"🌟 ഗുണങ്ങൾ - ബിസിനസ് ഡയറക്ടറി\n✅ 100% ഫ്രീ ബേസിക്\n✅ അടുത്തുള്ള കോളുകൾ നേടുക\n✅ Google + ബിസ്മാപിയ\n✅ റേറ്റിംഗും റിവ്യൂവും\n✅ 1 വർഷ കിഴിവ്!", businessListProcedure:"📋 രീതി\n1. ബിസിനസ് ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക\n2. ബിസിനസ് ചേർക്കുക\n3. പേര്, കാറ്റഗറി, വിലാസം നൽകുക\n4. ഫോട്ടോ, കോൺടാക്റ്റ് ചേർക്കുക\n5. സബ്മിറ്റ് ചെയ്യുക\n6. 24 മണിക്കൂറിൽ ലൈവ്",
    businessSearchGoodChoice:"✅ നല്ലത്! *ബിസിനസ് സെർച്ച്*\n\nഇനി ഇന്ത്യയിൽ എവിടെയും ഏതെങ്കിലും ബിസിനസ് സെർച്ച് ചെയ്യുക.", businessSearchIntro:"🔍 ബിസിനസ് സെർച്ച്\nഇന്ത്യയിൽ ഏതെങ്കിലും ബിസിനസ് കണ്ടെത്തുക\n✅ പേര്, കാറ്റഗറി, സ്ഥലം\n✅ 10 ലക്ഷം+ ലിസ്റ്റ് ചെയ്തത്", businessSearchHow:"എങ്ങനെ സെർച്ച് ചെയ്യാം?\n1. ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക\n2. പേര്/കാറ്റഗറി സെർച്ച് ചെയ്യുക\n3. സ്ഥലം തിരഞ്ഞെടുക്കുക\n4. കോൺടാക്റ്റ് നേടുക\n5. നേരിട്ട് വിളിക്കുക",
    deliveryGoodChoice:"✅ നല്ലത്! *ഓൺലൈൻ ഡെലിവറി*\n\nഇനി 2 മണിക്കൂറിൽ എവിടെയും പാഴ്സൽ അയയ്ക്കുക, അല്ലെങ്കിൽ ഏജന്റ് ആകുക.", deliveryIntro:"📦 ഓൺലൈൻ ഡെലിവറി\n⚡ 2 മണിക്കൂർ ഡെലിവറി\n📍 ഇന്ത്യയിൽ എവിടെയും\n💰 ഏറ്റവും കുറഞ്ഞ നിരക്ക്", deliveryBtn1:"പാഴ്സൽ ബുക്ക് ചെയ്യുക", deliveryBtn2:"ഏജന്റ് ആകുക", deliveryBtn3:"എങ്ങനെ പ്രവർത്തിക്കുന്നു?",
    deliveryBookGoodChoice:"✅ നല്ലത്! *പാഴ്സൽ ബുക്ക്*\n\nഇനി പാഴ്സൽ തരങ്ങളും ബുക്കിംഗ് രീതിയും കാണുക.", deliveryBookIntro:"📦 പാഴ്സൽ ബുക്ക് ചെയ്യുക\n2 മണിക്കൂറിൽ എന്തും അയയ്ക്കുക!\n✅ രേഖകൾ, ഭക്ഷണം, സമ്മാനങ്ങൾ, മരുന്ന്",
    deliveryBookProcedure:"📋 രീതി - പാഴ്സൽ ബുക്ക്\n1. ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക\n2. ഡെലിവറി തിരഞ്ഞെടുക്കുക\n3. പിക്കപ്പ്/ഡെലിവറി വിലാസം നൽകുക\n4. പാഴ്സൽ വിശദാംശങ്ങൾ നൽകുക\n5. വില കാണുക\n6. കൺഫേം ചെയ്ത് പേ ചെയ്യുക\n7. 30 മിനിറ്റിൽ പിക്കപ്പ്\n8. 2 മണിക്കൂറിൽ ഡെലിവറി!", deliveryBookCharges:"💰 നിരക്കുകൾ\n• നഗരം: Rs.50+\n• ജില്ല: Rs.100+\n• ഇന്റർ-ജില്ല: KM അനുസരിച്ച്",
    deliveryAgentGoodChoice:"✅ നല്ലത്! *ഏജന്റ് ആകുക*\n\nഇനി ദിവസം നേടാനുള്ള ഗുണങ്ങൾ, ആവശ്യങ്ങൾ, രീതി കാണുക.", deliveryAgentIntro:"🏍️ ഏജന്റ് ആകുക\n💰 ദിവസം Rs.800-1500\n✅ പാർട്ട്/ഫുൾ ടൈം\n✅ സ്വന്തം ബൈക്ക്\n✅ ഡെയ്‌ലി പേയ്‌മെന്റ്",
    deliveryAgentBenefits:"🌟 ഗുണങ്ങൾ - ഏജന്റ് ആകുക\n✅ ദിവസം Rs.800-1500\n✅ ഓരോ ഡെലിവറിക്കും ബോണസ്\n✅ ഓഫീസ് ഇല്ല\n✅ നിങ്ങളുടെ ഏരിയയിൽ ജോലി\n✅ ഡെയ്‌ലി പേയ്‌മെന്റ്", deliveryAgentRequirements:"📋 ആവശ്യങ്ങൾ - ഏജന്റ് ആകുക\n✅ ബൈക്ക് + ലൈസൻസ് + RC\n✅ ആൻഡ്രോയിഡ് മൊബൈൽ\n✅ ആധാർ + PAN\n✅ 18+ പ്രായം", deliveryAgentProcedure:"📋 രീതി - ഏജന്റ് ആകുക\n1. ഡ്രൈവർ ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക\n2. ഏജന്റ് ആയി രജിസ്റ്റർ ചെയ്യുക\n3. ബൈക്ക്, ലൈസൻസ്, ആധാർ അപ്‌ലോഡ് ചെയ്യുക\n4. 24 മണിക്കൂറിൽ വെരിഫൈ\n5. ട്രെയിനിംഗ്\n6. നേടാൻ തുടങ്ങുക!",
    riderBenefitsDetail:"🏍️ റൈഡർ ഗുണങ്ങൾ\n💰 ദിവസം Rs.1500-2500\n✅ പാർട്ട് ടൈം / ഫുൾ ടൈം\n✅ സ്വന്തം വാഹനം\n✅ ഡെയ്‌ലി പേയ്‌മെന്റ്\n✅ ബോണസ്", driverRemindBenefits:"🔔 ഡ്രൈവർ ഓർമ്മ - ഗുണങ്ങൾ\n💰 ദിവസം Rs.1500-2500 നേടൂ!\n🚖 ടാക്സി/ഓട്ടോ/ബൈക്ക്/ആംബുലൻസ്\n✅ ഡെയ്‌ലി പേയ്‌മെന്റ്\n✅ ബോണസ്",
    bookingGoodChoice:"✅ നല്ലത്! *ഓൺലൈൻ ബുക്കിംഗ്*\n\nഇനി 1 ക്ലിക്കിൽ റൂം, അപ്പോയിന്റ്മെന്റ്, മൂവി ടിക്കറ്റ് ബുക്ക് ചെയ്യുക.", bookIntro:"🏨 ഓൺലൈൻ ബുക്കിംഗ്\n1 ക്ലിക്കിൽ റൂം, അപ്പോയിന്റ്മെന്റ് & മൂവി ടിക്കറ്റ് ബുക്ക് ചെയ്യുക!\n✅ റൂം - ഹോട്ടൽ, റിസോർട്ട്\n✅ അപ്പോയിന്റ്മെന്റ് - ഡോക്ടർ, സലൂൺ\n✅ മൂവി - എല്ലാ തിയേറ്ററുകളും",
    bookRoom:"റൂം ബുക്ക് ചെയ്യുക", bookAppointment:"അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക", bookMovie:"മൂവി ബുക്ക് ചെയ്യുക",
    bookRoomGoodChoice:"✅ നല്ലത്! *റൂം ബുക്ക്*", bookRoomDetail:"🏨 റൂം ബുക്ക് ചെയ്യുക\nഹോട്ടൽ | റിസോർട്ട് | ഹോംസ്റ്റേ\n✅ താങ്ങാവുന്ന നിരക്ക്\n✅ തൽക്ഷണ കൺഫർമേഷൻ",
    bookAppointmentGoodChoice:"✅ നല്ലത്! *അപ്പോയിന്റ്മെന്റ് ബുക്ക്*", bookAppointmentDetail:"🩺 അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക\nഡോക്ടർ | സലൂൺ | സർവീസ്\n✅ തൽക്ഷണ കൺഫർമേഷൻ",
    bookMovieGoodChoice:"✅ നല്ലത്! *മൂവി ടിക്കറ്റ് ബുക്ക്*", bookMovieDetail:"🎬 മൂവി ടിക്കറ്റ് ബുക്ക് ചെയ്യുക\nപുതിയ സിനിമകൾ | എല്ലാ തിയേറ്ററുകളും\n✅ എളുപ്പം, വേഗം, താങ്ങാവുന്ന",
    earnGoodChoice:"✅ നല്ലത്! *ബിസ്മാപിയയിൽ നിന്ന് നേടൂ*\n\nഇനി ഹൈ, മോഡറേറ്റ്, ബേസ് അവസരം തിരഞ്ഞെടുക്കൂ.", earnIntro:"💰 ബിസ്മാപിയയിൽ നിന്ന് നേടൂ\nനിങ്ങളുടെ അവസരം തിരഞ്ഞെടുക്കൂ",
    high:"ഉയർന്ന വരുമാനം (15L)", mod:"മിതമായ (3-7L)", base:"ബേസ് (ബിസിനസ് സെന്റർ)",
    highGoodChoice:"✅ നല്ലത്! *ഉയർന്ന വരുമാനം*\n\nഇനി ജില്ല/കോർപ്/മുനിസിപ്പൽ വിവരങ്ങൾ കാണുക. ഒരു ജില്ലയിൽ ONE മാത്രം.", highIntro:"🔥 ഉയർന്ന വരുമാനം\nഒരു ജില്ലയിൽ ONE മാത്രം!\n💰 ജില്ല - 15L\nകോർപ് - 7L\nമുനിസിപ്പൽ - 3L", highOptDistrict:"ജില്ല - 15L", highOptCorp:"കോർപ്പറേഷൻ - 7L", highOptMuni:"മുനിസിപ്പൽ - 3L",
    moderateGoodChoice:"✅ നല്ലത്! *മിതമായ വരുമാനം*", moderateIntro:"💼 മിതമായ വരുമാനം - 3-7L കൺഫേംഡ്\nതിരഞ്ഞെടുക്കൂ:\n• കോർപ് - 7L\n• മുനിസിപ്പൽ - 3L\n• BC - 50K-1L", corpGoodChoice:"✅ നല്ലത്! *കോർപ്പറേഷൻ 7L*", corpIntro:"🏙️ കോർപ്പറേഷൻ - 7 ലക്ഷം\n• കോർപ്പറേഷൻ ഏരിയ\n• ബിസിനസ് സെന്ററുകൾ നിയന്ത്രിക്കുക", municipalGoodChoice:"✅ നല്ലത്! *മുനിസിപ്പൽ 3L*", municipalIntro:"🏘️ മുനിസിപ്പൽ - 3 ലക്ഷം\n• മുനിസിപ്പാലിറ്റി ഏരിയ",
    baseGoodChoice:"✅ നല്ലത്! *ബേസ് - ബിസിനസ് സെന്റർ*", baseIntro:"🏪 ബേസ് - ബിസിനസ് സെന്റർ - 50K-1L കൺഫേംഡ്\nകുറഞ്ഞ നിക്ഷേപം, ഉയർന്ന റിട്ടേൺ", businessCenterIntro:"🏪 ബിസിനസ് സെന്റർ - 50K-1L\n• പഞ്ചായത്ത്/ചെറിയ പട്ടണം\n• നിങ്ങൾ ലോക്കൽ സെന്റർ ആണ്\n• 4 സേവനങ്ങളിൽ നിന്ന് നേടൂ", businessCenterBenefits:"🌟 ഗുണങ്ങൾ - BC\n✅ 50K-1L കുറഞ്ഞ നിക്ഷേപം\n✅ 4 സേവനങ്ങളിൽ നിന്ന് നേടൂ\n✅ 90sqft മതി",
    procedureDistrict:"നടപടിക്രമം - ജില്ല 15L\n1. ഗുണങ്ങൾ അറിയുക\n2. കോർപ് ചെക്ക് Yes/No\n3. 15L ന് തയ്യാർ എന്ന് കൺഫേം ചെയ്യുക\n4. Rs.5000 പേ ചെയ്യുക\n5. പേര്, സ്ഥലം, ജില്ല പങ്കിടുക\n6. കരാർ തീയതി\n7. ടെൻഡർ\n8. 24 മണിക്കൂറിൽ ടീം കോൾ\n9. ബാലൻസ് + ട്രെയിനിംഗ്", procedureBusinessCenter:"നടപടിക്രമം - BC 50K-1L\n1. ഗുണങ്ങൾ അറിയുക\n2. ആവശ്യങ്ങൾ 90sqft\n3. Rs.5000 പേ ചെയ്യുക\n4. വിശദാംശങ്ങൾ പങ്കിടുക\n5. കരാർ തീയതി", procedureCommon:"പൊതു നടപടിക്രമം - എല്ലാ 4 തരങ്ങളും\n1. തരം തിരഞ്ഞെടുക്കുക\n2. ഗുണങ്ങൾ, സപ്പോർട്ട്, ആവശ്യങ്ങൾ\n3. കോർപ് ചെക്ക്\n4. പേ ചെയ്യാൻ തയ്യാർ\n5. Rs.5000 പേ ചെയ്യുക\n6. EMI\n7. വിശദാംശങ്ങൾ പങ്കിടുക\n8. തൊഴിൽ\n9. കരാർ തീയതി\n10. ടെൻഡർ\n11. വെരിഫിക്കേഷൻ\n12. ലോഞ്ച്",
    benDistrict:"ഗുണങ്ങൾ - ജില്ല 15L\n✅ ടോപ്പ് ലെവൽ ഫ്രാഞ്ചൈസി\n✅ എല്ലാ വരുമാനത്തിലും %\n✅ നേരിട്ട് കമ്പനി ബന്ധം\n✅ ജീവിതകാല റോയൽറ്റി", benCorp:"ഗുണങ്ങൾ - കോർപ് 7L\n✅ കോർപ് ഏരിയ നിയന്ത്രിക്കുക\n✅ BC കളിൽ നിന്ന് %", benBusinessCenter:"ഗുണങ്ങൾ - BC 50K-1L\n✅ കുറഞ്ഞ നിക്ഷേപം\n✅ 4 സേവനങ്ങളിൽ നിന്ന് നേടൂ",
    supText:"സപ്പോർട്ട്\n✅ 12 മാസം മാർക്കറ്റിംഗ്\n✅ 6 മാസം വാടക (ജില്ല)\n✅ 6 മാസം സ്റ്റാഫ് ശമ്പളം\n✅ സോഫ്റ്റ്‌വെയർ + ട്രെയിനിംഗ്", reqDistrict:"ആവശ്യങ്ങൾ - ജില്ല 15L\n✅ 90 Sqft മുറി\n✅ 1 സ്റ്റാഫ്\n✅ PC/മൊബൈൽ\n✅ 15L തയ്യാർ\n✅ ആധാർ + PAN", reqBusinessCenter:"ആവശ്യങ്ങൾ - BC\n✅ 90 Sqft മുറി\n✅ 1 സ്റ്റാഫ്\n✅ PC/മൊബൈൽ\n✅ 50K-1L തയ്യാർ",
    corpQGoodChoice:"✅ നല്ലത്! സമർപ്പിക്കാൻ തയ്യാർ.\n\nഇനി: ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?", corpQ:"ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ? HQ വിൽ കോർപ്പറേഷൻ ഉണ്ടെങ്കിൽ (ഉദാ. കൊച്ചി), Yes Corp തിരഞ്ഞെടുക്കുക.", yesCorp:"Yes Corp", noCorp:"No Corp",
    readyGoodChoice:"✅ നല്ലത്! കോർപ് സ്റ്റാറ്റസ് കൺഫേം ചെയ്തു.\n\nഇനി ഫീസ് പേ ചെയ്യാൻ തയ്യാർ എന്ന് കൺഫേം ചെയ്യുക.", ready15:"15 ലക്ഷം ജില്ല ഫീസായി പേ ചെയ്യാൻ തയ്യാർ എന്ന് കൺഫേം ചെയ്യുക.\n👉 അടുത്തത്: Rs.5000 രജിസ്ട്രേഷൻ പേ ചെയ്യുക.", ready7:"7 ലക്ഷം കോർപ്പറേഷൻ ഫീസായി പേ ചെയ്യാൻ തയ്യാർ എന്ന് കൺഫേം ചെയ്യുക.", ready3:"3 ലക്ഷം മുനിസിപ്പൽ ഫീസായി പേ ചെയ്യാൻ തയ്യാർ എന്ന് കൺഫേം ചെയ്യുക।", readyBC:"50K-1L ബിസിനസ് സെന്റർ ഫീസായി പേ ചെയ്യാൻ തയ്യാർ എന്ന് കൺഫേം ചെയ്യുക.", readyBtn15:"അതെ തയ്യാർ - 15L", readyBtn7:"അതെ തയ്യാർ - 7L", readyBtn3:"അതെ തയ്യാർ - 3L", readyBtnBC:"അതെ തയ്യാർ - BC",
    payGoodChoice:"✅ നല്ലത്! തയ്യാർ കൺഫേം ചെയ്തു.\n\nഇനി Rs.5000 രജിസ്ട്രേഷൻ പേ ചെയ്യുക. മൊത്തം ഫീസിന്റെ ഭാഗം, അധികമല്ല.", payReg:"Rs.5000 പേ ചെയ്ത് മുന്നോട്ട് പോകുക.\nമൊത്തം ഫീസിന്റെ ഭാഗം, അധികമല്ല.\nതാഴെ Pay Now ടാപ്പ് ചെയ്യുക.", emiGoodChoice:"✅ നല്ലത്! EMI ഓപ്ഷനുകൾ.", emiOpt:"EMI തിരഞ്ഞെടുക്കുക:\nഡൗൺ 5 ലക്ഷം + 10 മാസം / ഡൗൺ 5 ലക്ഷം + 20 മാസം", emi10:"5L + 10x1L", emi20:"5L + 20x50k", emiBusiness:"BC EMI",
    leadGoodChoice:"✅ നല്ലത്! പേയ്മെന്റ് കഴിഞ്ഞു.\n\nഇനി കോൺടാക്റ്റ് വിശദാംശങ്ങൾ പങ്കിടുക. അവസാന ഘട്ടം.", leadAsk:"കോൺടാക്റ്റ് പങ്കിടുക:\nപേര്, സ്ഥലം, ജില്ല, സംസ്ഥാനം, കോൺടാക്റ്റ്, തൊഴിൽ\n\nആധാർ പ്രകാരമുള്ള പേര്:", occQGoodChoice:"✅ നല്ലത്! സ്ഥലം പങ്കിട്ടു.\n\nഇനി തൊഴിൽ തിരഞ്ഞെടുക്കുക.", occQ:"തൊഴിൽ തിരഞ്ഞെടുക്കുക:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", tender:"ടെൻഡർ ഡൗൺലോഡ് ചെയ്യുക", dateGoodChoice:"✅ നല്ലത്! തൊഴിൽ തിരഞ്ഞെടുത്തു.\n\nഇനി കരാർ തീയതി തിരഞ്ഞെടുക്കുക.", date:"കരാർ തീയതി തിരഞ്ഞെടുക്കുക:", today:"ഇന്ന്", tom:"നാളെ", thanksGoodChoice:"✅ മികച്ചത്! എല്ലാ വിശദാംശങ്ങളും ലഭിച്ചു.\n\n", thanks:"നന്ദി! ടീം 24 മണിക്കൂറിനുള്ളിൽ വിളിക്കും. അപേക്ഷ സമർപ്പിച്ചു!",
    callG:"97452 26642", callB:"85901 75977", bookNow:"ഇപ്പോൾ ബുക്ക് ചെയ്യുക", dlDriv:"ഡ്രൈവർ ആപ്പ്", knowProcedure:"രീതി അറിയുക", backToEarn:"തിരികെ നേടൂവിലേക്ക്", viewTender:"ടെൻഡർ കാണുക", video:"വീഡിയോ ലിങ്ക്", benefits:"ഗുണങ്ങൾ", support:"സപ്പോർട്ട്", requirements:"ആവശ്യങ്ങൾ", submit:"അപേക്ഷ സമർപ്പിക്കുക", pay:"Rs.5000 പേ ചെയ്യുക", emi:"EMI ഓപ്ഷനുകൾ", howToList:"എങ്ങനെ ലിസ്റ്റ് ചെയ്യാം?", searchBusiness:"ബിസിനസ് സെർച്ച് ചെയ്യുക", howItWorks:"എങ്ങനെ പ്രവർത്തിക്കുന്നു?", bookParcel:"പാഴ്സൽ ബുക്ക് ചെയ്യുക", joinAgent:"ഏജന്റ് ആകുക", listBusiness:"ബിസിനസ് ലിസ്റ്റ് ചെയ്യുക", downloadApp:"ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക"
  }
};

function getText(l,k){ if(T[l] && T[l][k]) return T[l][k]; if(T.en[k]) return T.en[k]; return ""; }
function formatTo(to){ let c=String(to).replace(/\D/g,""); if(c.startsWith("91") && c.length===12) return c; if(c.length===10) return "91"+c; return c; }

function doSendMessage(uid, txt, btnsRaw){
  return new Promise(async (resolve, reject)=>{
    const to=formatTo(uid); if(to===BOT_OWN_NUMBER) return resolve();
    try{
      const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
      const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
      let data;
      if(btnsRaw && btnsRaw.length>0){
        const hasCall=btnsRaw.some(b=>b.phone);
        if(hasCall){
          const buttons=[]; for(let b of btnsRaw.slice(0,3)){ if(b.phone){ buttons.push({type:"phone_number",phone_number:b.phone,title:b.title.substring(0,20)}); }else{ buttons.push({type:"reply",reply:{id:b.payload,title:b.title.substring(0,20)}}); } }
          data={ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{text:String(txt).substring(0,1024)}, action:{buttons} } };
        }else{
          const quick=btnsRaw.slice(0,3).map(b=>({type:"reply",reply:{id:b.payload,title:b.title.substring(0,20)}}));
          data={ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{text:String(txt).substring(0,1024)}, action:{buttons:quick} } };
        }
      }else{ data={ messaging_product:"whatsapp", to, type:"text", text:{body:String(txt).substring(0,4096)} }; }
      await axios.post(url,data,{headers});
      logCRM(uid,"OUT",txt,btnsRaw?.map(b=>b.payload||b.title).join("|"),userStates[uid]?.flow||"",userStates[uid]?.lastStep||"",{currentFee:userStates[uid]?.data?.currentFee, currentType:userStates[uid]?.data?.currentType});
      resolve();
    }catch(e){ reject(e); }
  });
}
function doSendImageWithButtons(uid, imgUrl, caption, btnsRaw){
  return new Promise(async (resolve, reject)=>{
    const to=formatTo(uid); if(to===BOT_OWN_NUMBER) return resolve();
    try{
      const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
      const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
      let buttons=[]; for(let b of btnsRaw.slice(0,3)){ if(b.phone){ buttons.push({type:"phone_number",phone_number:b.phone,title:b.title.substring(0,20)}); }else{ buttons.push({type:"reply",reply:{id:b.payload,title:b.title.substring(0,20)}}); } }
      const data={ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", header:{type:"image",image:{link:imgUrl}}, body:{text:String(caption).substring(0,1024)}, action:{buttons} } };
      await axios.post(url,data,{headers});
      logCRM(uid,"OUT",caption,btnsRaw?.map(b=>b.payload||b.title).join("|"),userStates[uid]?.flow||"",userStates[uid]?.lastStep||"",{currentFee:userStates[uid]?.data?.currentFee, currentType:userStates[uid]?.data?.currentType});
      resolve();
    }catch(e){ reject(e); }
  });
}
function sendMessage(uid, txt, btns){ enqueueSend(uid, ()=>doSendMessage(uid, txt, btns), txt.substring(0,100), btns?.map(b=>b.payload).join(",")); }
function sendImageWithButtons(uid, imgUrl, caption, btns){ enqueueSend(uid, ()=>doSendImageWithButtons(uid, imgUrl, caption, btns), caption.substring(0,100), btns?.map(b=>b.payload).join(",")); }
function callButton(display, phone){ return {title:display, phone:phone}; }
function replyButton(title, payload){ return {title, payload}; }

const FIRST_BRIEF_EN=`🌟 Welcome to Bizmapia - All India 4-in-1 Services!

🚖 Affordable Taxi & Auto
🏪 View/attach Businesses with 10,00,000+ Local Businesses
📦 Fast Food/Grocery/Parcel Delivery
🎟 Rooms, Appointment, Movie Tickets
💰 Earn with Bizmapia Business opportunity

One App. Four Services. Pan-India!

👇 Select language:`;
const FIRST_BRIEF_HI=`🌟 बिज़मापिया में आपका स्वागत है - पूरे भारत में 4-इन-1 सेवाएं!

🚖 किफायती टैक्सी और ऑटो
🏪 10,00,000+ लोकल बिजनेस देखें/जोड़ें
📦 तेज़ फूड/ग्रॉसरी/पार्सल डिलीवरी
🎟 रूम, अपॉइंटमेंट, मूवी टिकट
💰 बिज़मापिया बिजनेस अवसर से कमाएं

एक ऐप। चार सेवाएं। पूरे भारत में!

👇 भाषा चुनें:`;
const FIRST_BRIEF_ML=`🌟 ബിസ്മാപിയയിലേക്ക് സ്വാഗതം - ഇന്ത്യ മുഴുവൻ 4-ഇൻ-1 സേവനങ്ങൾ!

🚖 താങ്ങാവുന്ന ടാക്സി & ഓട്ടോ
🏪 10,00,000+ ലോക്കൽ ബിസിനസുകൾ കാണുക/ചേർക്കുക
📦 വേഗത്തിലുള്ള ഫുഡ്/ഗ്രോസറി/പാഴ്സൽ ഡെലിവറി
🎟 റൂം, അപ്പോയിന്റ്മെന്റ്, മൂവി ടിക്കറ്റ്
💰 ബിസ്മാപിയ ബിസിനസ് അവസരത്തിൽ നിന്ന് നേടൂ

ഒരു ആപ്പ്. നാല് സേവനങ്ങൾ. ഇന്ത്യ മുഴുവൻ!

👇 ഭാഷ തിരഞ്ഞെടുക്കൂ:`;

async function sendFirst(uid){
  const lastWelcome=recentWelcomes.get(uid);
  if(lastWelcome && Date.now()-lastWelcome<60000) return;
  if(formatTo(uid)===BOT_OWN_NUMBER) return;
  userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', data:{ currentFee:"15L", currentType:"District" } };
  recentWelcomes.set(uid,Date.now()); setTimeout(()=>recentWelcomes.delete(uid),60000);
  const btns=[replyButton("English","LANG_EN"),replyButton("हिन्दी","LANG_HI"),replyButton("മലയാളം","LANG_ML")];
  sendImageWithButtons(uid,POSTERS.welcome,FIRST_BRIEF_EN,btns);
  updateReminder(uid,'Language Selection',btns,POSTERS.welcome,FIRST_BRIEF_EN,'WELCOME','15L','District',false,false);
}
async function sendMain(uid,l){ 
  userStates[uid].lang=l; userStates[uid].flow='MAIN'; userStates[uid].lastStep='Main Menu'; 
  const btns=[replyButton(getText(l,'ride'),"OPT_RIDE"),replyButton(getText(l,'earn'),"OPT_EARN"),replyButton(getText(l,'more'),"OPT_MORE")]; 
  const txt=getText(l,'selOpt'); 
  const brief = l==='hi' ? FIRST_BRIEF_HI : l==='ml' ? FIRST_BRIEF_ML : FIRST_BRIEF_EN;
  sendImageWithButtons(uid,POSTERS.welcome,brief+"\n\n"+txt,btns); 
  updateReminder(uid,'Main Menu',btns,POSTERS.welcome,txt,'MAIN',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); 
}
async function sendMore(uid,l){ userStates[uid].lastStep='More Options'; const btns=[replyButton(getText(l,'del'),"OPT_DEL"),replyButton(getText(l,'book'),"OPT_BOOK"),replyButton(getText(l,'dir'),"OPT_DIR")]; const txt=getText(l,'more')+" - "+getText(l,'selOpt'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'More Options',btns,POSTERS.businessOpp,txt,'MORE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendRide(uid,l){ userStates[uid].lastStep='Ride Selection'; const btns=[replyButton(getText(l,'bookRide'),"RIDE_BOOK"),replyButton(getText(l,'attach'),"RIDE_ATTACH")]; const txt=getText(l,'rideGoodChoice')+"\n\n"+getText(l,'rideOpt'); sendImageWithButtons(uid,POSTERS.customerRide,txt,btns); updateReminder(uid,'Ride Selection',btns,POSTERS.customerRide,txt,'RIDE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendCust(uid,l){ userStates[uid].lastStep='Book a Ride - Customer'; const btns=[replyButton(getText(l,'bookNow'),"BOOK_NOW"), callButton(PHONES.displayG, PHONES.gopalan)]; const txt=getText(l,'custGoodChoice')+"\n\n"+getText(l,'custPost')+"\n\n"+LINKS.customerApp; sendImageWithButtons(uid,POSTERS.customerRide,txt,btns); updateReminder(uid,'Book a Ride - Customer',btns,POSTERS.customerRide,txt,'RIDE_CUSTOMER',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDriv(uid,l){ userStates[uid].lastStep='Driver Attach - Benefits'; userStates[uid].flow='DRIVER'; const btns=[replyButton(getText(l,'dlDriv'),"DL_DRIV"), callButton(PHONES.displayG, PHONES.gopalan), replyButton(getText(l,'benefits'),"DRIVER_BENEFITS")]; const txt=getText(l,'drivGoodChoice')+"\n\n"+getText(l,'riderBenefitsDetail')+"\n\n"+getText(l,'drivPost')+"\n\n"+LINKS.driverApp; sendImageWithButtons(uid,POSTERS.driverRide,txt,btns); updateReminder(uid,'Driver Attach - Benefits',btns,POSTERS.driverRide,txt,'DRIVER',userStates[uid].data.currentFee,userStates[uid].data.currentType,true,false); }
async function sendDriverBenefits(uid,l){ userStates[uid].lastStep='Rider Benefits - Reminder'; const btns=[replyButton(getText(l,'dlDriv'),"DL_DRIV"), callButton(PHONES.displayG, PHONES.gopalan), replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'riderBenefitsDetail')+"\n\n"+getText(l,'driverRemindBenefits')+"\n\n"+LINKS.driverApp; sendImageWithButtons(uid,POSTERS.driverReminderBenefits,txt,btns); updateReminder(uid,'Rider Benefits - Reminder',btns,POSTERS.driverReminderBenefits,txt,'DRIVER_BENEFITS',userStates[uid].data.currentFee,userStates[uid].data.currentType,true,false); }
async function sendBusinessDir(uid,l){ userStates[uid].lastStep='Business Directory Main'; const btns=[replyButton(getText(l,'businessDirBtn1'),"BIZ_LIST"),replyButton(getText(l,'businessDirBtn2'),"BIZ_SEARCH"),replyButton(getText(l,'businessDirBtn3'),"BIZ_HOW")]; const txt=getText(l,'businessDirGoodChoice')+"\n\n"+getText(l,'businessDirIntro'); sendImageWithButtons(uid,POSTERS.businessDir,txt,btns); updateReminder(uid,'Business Directory Main',btns,POSTERS.businessDir,txt,'BUSINESS_DIR',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,true); }
async function sendBusinessList(uid,l){ userStates[uid].lastStep='Business Directory - List'; const btns=[replyButton(getText(l,'benefits'),"BIZ_BENEFITS"),replyButton(getText(l,'requirements'),"BIZ_PROCEDURE"),replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD")]; const txt=getText(l,'businessListGoodChoice')+"\n\n"+getText(l,'businessListIntro'); sendImageWithButtons(uid,POSTERS.businessDir,txt,btns); updateReminder(uid,'Business Directory - List',btns,POSTERS.businessDir,txt,'BUSINESS_DIR_LIST',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,true); }
async function sendBusinessListBenefits(uid,l){ const btns=[replyButton(getText(l,'requirements'),"BIZ_PROCEDURE"),replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD"),replyButton(getText(l,'backToEarn'),"OPT_DIR")]; const txt=getText(l,'businessListBenefits'); sendImageWithButtons(uid,POSTERS.businessReminderOffer,txt,btns); updateReminder(uid,'Business Directory - Benefits',btns,POSTERS.businessReminderOffer,txt,'BUSINESS_DIR_BENEFITS',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,true); }
async function sendBusinessListProcedure(uid,l){ const btns=[replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD"),replyButton(getText(l,'businessDirBtn2'),"BIZ_SEARCH"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'businessListProcedure'); sendImageWithButtons(uid,POSTERS.businessDir,txt,btns); updateReminder(uid,'Business Directory - Procedure',btns,POSTERS.businessDir,txt,'BUSINESS_DIR_PROCEDURE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,true); }
async function sendBusinessSearch(uid,l){ userStates[uid].lastStep='Business Directory - Search'; const btns=[replyButton(getText(l,'howToList'),"BIZ_HOW"),replyButton(getText(l,'searchBusiness'),"BIZ_SEARCH_HOW"),replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD")]; const txt=getText(l,'businessSearchGoodChoice')+"\n\n"+getText(l,'businessSearchIntro'); sendImageWithButtons(uid,POSTERS.businessDir,txt,btns); updateReminder(uid,'Business Directory - Search',btns,POSTERS.businessDir,txt,'BUSINESS_DIR_SEARCH',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,true); }
async function sendBusinessSearchHow(uid,l){ const btns=[replyButton(getText(l,'listBusiness'),"BIZ_LIST"),replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'businessSearchHow'); sendImageWithButtons(uid,POSTERS.businessDir,txt,btns); updateReminder(uid,'Business Directory - Search How',btns,POSTERS.businessDir,txt,'BUSINESS_DIR_SEARCH_HOW',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,true); }
async function sendDel(uid,l){ userStates[uid].lastStep='Delivery Main'; const btns=[replyButton(getText(l,'deliveryBtn1'),"DEL_BOOK"),replyButton(getText(l,'deliveryBtn2'),"DEL_AGENT"),replyButton(getText(l,'deliveryBtn3'),"DEL_HOW")]; const txt=getText(l,'deliveryGoodChoice')+"\n\n"+getText(l,'deliveryIntro'); sendImageWithButtons(uid,POSTERS.delivery,txt,btns); updateReminder(uid,'Delivery Main',btns,POSTERS.delivery,txt,'DELIVERY',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDeliveryBook(uid,l){ userStates[uid].lastStep='Delivery - Book Parcel'; const btns=[replyButton(getText(l,'requirements'),"DEL_BOOK_PROC"),replyButton("Charges","DEL_CHARGES"),replyButton(getText(l,'downloadApp'),"DEL_APP_DOWNLOAD")]; const txt=getText(l,'deliveryBookGoodChoice')+"\n\n"+getText(l,'deliveryBookIntro'); sendImageWithButtons(uid,POSTERS.delivery,txt,btns); updateReminder(uid,'Delivery - Book Parcel',btns,POSTERS.delivery,txt,'DELIVERY_BOOK',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDeliveryBookProcedure(uid,l){ const btns=[replyButton("Charges","DEL_CHARGES"),replyButton(getText(l,'joinAgent'),"DEL_AGENT"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'deliveryBookProcedure'); sendImageWithButtons(uid,POSTERS.delivery,txt,btns); updateReminder(uid,'Delivery - Book Procedure',btns,POSTERS.delivery,txt,'DELIVERY_BOOK_PROC',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDeliveryCharges(uid,l){ const btns=[replyButton(getText(l,'bookParcel'),"DEL_BOOK"),replyButton(getText(l,'joinAgent'),"DEL_AGENT"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'deliveryBookCharges'); sendImageWithButtons(uid,POSTERS.delivery,txt,btns); updateReminder(uid,'Delivery - Charges',btns,POSTERS.delivery,txt,'DELIVERY_CHARGES',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDeliveryAgent(uid,l){ userStates[uid].lastStep='Delivery - Agent'; const btns=[replyButton(getText(l,'benefits'),"DEL_AGENT_BEN"),replyButton(getText(l,'requirements'),"DEL_AGENT_REQ"),replyButton(getText(l,'downloadApp'),"DEL_APP_DOWNLOAD")]; const txt=getText(l,'deliveryAgentGoodChoice')+"\n\n"+getText(l,'deliveryAgentIntro'); sendImageWithButtons(uid,POSTERS.delivery,txt,btns); updateReminder(uid,'Delivery - Agent',btns,POSTERS.delivery,txt,'DELIVERY_AGENT',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDeliveryAgentBenefits(uid,l){ const btns=[replyButton(getText(l,'requirements'),"DEL_AGENT_REQ"),replyButton(getText(l,'knowProcedure'),"DEL_AGENT_PROC"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'deliveryAgentBenefits'); sendImageWithButtons(uid,POSTERS.driverReminderBenefits,txt,btns); updateReminder(uid,'Delivery - Agent Benefits',btns,POSTERS.driverReminderBenefits,txt,'DELIVERY_AGENT_BEN',userStates[uid].data.currentFee,userStates[uid].data.currentType,true,false); }
async function sendDeliveryAgentRequirements(uid,l){ const btns=[replyButton(getText(l,'knowProcedure'),"DEL_AGENT_PROC"),replyButton(getText(l,'downloadApp'),"DEL_APP_DOWNLOAD"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'deliveryAgentRequirements'); sendImageWithButtons(uid,POSTERS.delivery,txt,btns); updateReminder(uid,'Delivery - Agent Requirements',btns,POSTERS.delivery,txt,'DELIVERY_AGENT_REQ',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDeliveryAgentProcedure(uid,l){ const btns=[replyButton(getText(l,'downloadApp'),"DEL_APP_DOWNLOAD"),replyButton(getText(l,'bookParcel'),"DEL_BOOK"),callButton(PHONES.displayG, PHONES.gopalan)]; const txt=getText(l,'deliveryAgentProcedure')+"\n\n"+LINKS.driverApp; sendImageWithButtons(uid,POSTERS.delivery,txt,btns); updateReminder(uid,'Delivery - Agent Procedure',btns,POSTERS.delivery,txt,'DELIVERY_AGENT_PROC',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendRoom(uid,l){ userStates[uid].lastStep='Room Booking'; const btns=[replyButton(getText(l,'bookRoom'),"BOOK_ROOM_DETAIL"),replyButton(getText(l,'bookAppointment'),"BOOK_APPOINTMENT"),replyButton(getText(l,'bookMovie'),"BOOK_MOVIE")]; const txt=getText(l,'bookingGoodChoice')+"\n\n"+getText(l,'bookIntro'); sendImageWithButtons(uid,POSTERS.booking,txt,btns); updateReminder(uid,'Room Booking',btns,POSTERS.booking,txt,'BOOKING',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendRoomDetail(uid,l){ const btns=[replyButton(getText(l,'bookAppointment'),"BOOK_APPOINTMENT"),replyButton(getText(l,'bookMovie'),"BOOK_MOVIE"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'bookRoomGoodChoice')+"\n\n"+getText(l,'bookRoomDetail'); sendImageWithButtons(uid,POSTERS.booking,txt,btns); updateReminder(uid,'Room Booking Detail',btns,POSTERS.booking,txt,'BOOKING_ROOM',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendAppointmentDetail(uid,l){ const btns=[replyButton(getText(l,'bookRoom'),"BOOK_ROOM_DETAIL"),replyButton(getText(l,'bookMovie'),"BOOK_MOVIE"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'bookAppointmentGoodChoice')+"\n\n"+getText(l,'bookAppointmentDetail'); sendImageWithButtons(uid,POSTERS.booking,txt,btns); updateReminder(uid,'Appointment Detail',btns,POSTERS.booking,txt,'BOOKING_APPOINTMENT',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendMovieDetail(uid,l){ const btns=[replyButton(getText(l,'bookRoom'),"BOOK_ROOM_DETAIL"),replyButton(getText(l,'bookAppointment'),"BOOK_APPOINTMENT"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'bookMovieGoodChoice')+"\n\n"+getText(l,'bookMovieDetail'); sendImageWithButtons(uid,POSTERS.booking,txt,btns); updateReminder(uid,'Movie Detail',btns,POSTERS.booking,txt,'BOOKING_MOVIE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendEarn(uid,l){ userStates[uid].lastStep='Earn Selection'; const btns=[replyButton(getText(l,'high'),"EARN_HIGH"),replyButton(getText(l,'mod'),"EARN_MOD"),replyButton(getText(l,'base'),"EARN_BASE")]; const txt=getText(l,'earnGoodChoice')+"\n\n"+getText(l,'earnIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Earn Selection',btns,POSTERS.businessOpp,txt,'EARN',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendHigh(uid,l){ userStates[uid].lastStep='High Earning'; const btns=[replyButton(getText(l,'highOptDistrict'),"FRAN_DISTRICT"),replyButton(getText(l,'highOptCorp'),"FRAN_CORP"),replyButton(getText(l,'highOptMuni'),"FRAN_MUNICIPAL")]; const txt=getText(l,'highGoodChoice')+"\n\n"+getText(l,'highIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'High Earning',btns,POSTERS.businessOpp,txt,'EARN_HIGH',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendModerate(uid,l){ userStates[uid].lastStep='Moderate Earning CONFIRMED'; const btns=[replyButton("Corporation - 7L","FRAN_CORP"),replyButton("Municipal - 3L","FRAN_MUNICIPAL"),replyButton(getText(l,'businessCenter'),"FRAN_BC")]; const txt=getText(l,'moderateGoodChoice')+"\n\n"+getText(l,'moderateIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Moderate Earning',btns,POSTERS.businessOpp,txt,'EARN_MOD',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendBase(uid,l){ userStates[uid].lastStep='Base Earning CONFIRMED'; const btns=[replyButton("Business Center","FRAN_BC"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE_BC"),replyButton(getText(l,'benefits'),"BEN_BC")]; const txt=getText(l,'baseGoodChoice')+"\n\n"+getText(l,'baseIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Base Earning',btns,POSTERS.businessOpp,txt,'EARN_BASE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDistrictDetail(uid,l){ userStates[uid].data.currentFee="15L"; userStates[uid].data.currentType="District"; userStates[uid].lastStep='District Detail'; const btns=[replyButton(getText(l,'video'),"VIDEO_DISTRICT"),replyButton(getText(l,'support'),"SUP_DISTRICT"),replyButton(getText(l,'requirements'),"REQ_DISTRICT")]; const txt=getText(l,'benDistrict') ? `✅ Good choice! *${userStates[uid].data.currentType}*\n\n${getText(l,'benDistrict')}` : getText(l,'highIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'District Detail',btns,POSTERS.businessOpp,txt,'DISTRICT_DETAIL','15L','District',false,false); }
async function sendCorpDetail(uid,l){ userStates[uid].data.currentFee="7L"; userStates[uid].data.currentType="Corporation"; userStates[uid].lastStep='Corporation Detail'; const btns=[replyButton(getText(l,'benefits'),"BEN_CORP"),replyButton(getText(l,'support'),"SUP_CORP"),replyButton(getText(l,'requirements'),"REQ_CORP")]; const txt=`✅ Good choice! *${getText(l,'corpGoodChoice')}*\n\n${getText(l,'corpIntro')}\n\n${getText(l,'benCorp')}`; sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Corporation Detail',btns,POSTERS.businessOpp,txt,'CORP_DETAIL','7L','Corporation',false,false); }
async function sendMunicipalDetail(uid,l){ userStates[uid].data.currentFee="3L"; userStates[uid].data.currentType="Municipal"; userStates[uid].lastStep='Municipal Detail'; const btns=[replyButton(getText(l,'benefits'),"BEN_MUNI"),replyButton(getText(l,'support'),"SUP_MUNI"),replyButton(getText(l,'requirements'),"REQ_MUNI")]; const txt=`${getText(l,'municipalGoodChoice')}\n\n${getText(l,'municipalIntro')}\n\n${getText(l,'benBusinessCenter')}`; sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Municipal Detail',btns,POSTERS.businessOpp,txt,'MUNICIPAL_DETAIL','3L','Municipal',false,false); }
async function sendBusinessCenterDetail(uid,l){ userStates[uid].data.currentFee="BC"; userStates[uid].data.currentType="Business Center"; userStates[uid].lastStep='Business Center Detail'; const btns=[replyButton(getText(l,'benefits'),"BEN_BC"),replyButton(getText(l,'support'),"SUP_BC"),replyButton(getText(l,'requirements'),"REQ_BC")]; const txt=`${getText(l,'baseGoodChoice')}\n\n${getText(l,'businessCenterIntro')}\n\n${getText(l,'businessCenterBenefits')}`; sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Business Center Detail',btns,POSTERS.businessOpp,txt,'BC_DETAIL','BC','Business Center',false,false); }
async function sendProcedure(uid,l,type="common"){ userStates[uid].lastStep='Procedure '+type; let text=""; if(type==="district") text=getText(l,'procedureDistrict'); else if(type==="bc") text=getText(l,'procedureBusinessCenter'); else text=getText(l,'procedureCommon'); const btns=[replyButton(getText(l,'viewTender'),"VIEW_TENDER"),replyButton(getText(l,'submit'),"SUBMIT_APP"),replyButton(getText(l,'backToEarn'),"OPT_EARN")]; sendImageWithButtons(uid,POSTERS.businessOpp,text,btns); updateReminder(uid,'Procedure '+type,btns,POSTERS.businessOpp,text,'PROCEDURE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendBen(uid,l){ const type=userStates[uid].data.currentType||"District"; let text=""; if(type==="District") text=getText(l,'benDistrict'); else if(type==="Corporation") text=getText(l,'benCorp'); else text=getText(l,'benBusinessCenter'); const btns=[replyButton(getText(l,'support'),"KNOW_SUP"),replyButton(getText(l,'requirements'),"KNOW_REQ"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE")]; const fullText=text; sendImageWithButtons(uid,POSTERS.businessOpp,fullText,btns); updateReminder(uid,'Benefits - '+type,btns,POSTERS.businessOpp,fullText,'BENEFITS',userStates[uid].data.currentFee,type,false,false); }
async function sendBenBC(uid,l){ const btns=[replyButton(getText(l,'support'),"SUP_BC"),replyButton(getText(l,'requirements'),"REQ_BC"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE_BC")]; const txt=getText(l,'businessCenterBenefits'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Benefits - BC',btns,POSTERS.businessOpp,txt,'BENEFITS_BC','BC','Business Center',false,false); }
async function sendSup(uid,l){ const btns=[replyButton(getText(l,'requirements'),"KNOW_REQ"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE"),replyButton(getText(l,'submit'),"SUBMIT_APP")]; const txt=getText(l,'supText'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Support',btns,POSTERS.businessOpp,txt,'SUPPORT',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendReq(uid,l){ const type=userStates[uid].data.currentType||"District"; let text=(type==="Business Center")?getText(l,'reqBusinessCenter'):getText(l,'reqDistrict'); const btns=[replyButton(getText(l,'submit'),"SUBMIT_APP"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE"),replyButton(getText(l,'emi'),"KNOW_EMI")]; const fullText=text; sendImageWithButtons(uid,POSTERS.businessOpp,fullText,btns); updateReminder(uid,'Requirements - '+type,btns,POSTERS.businessOpp,fullText,'REQUIREMENTS',userStates[uid].data.currentFee,type,false,false); }
async function askCorp(uid,l){ userStates[uid].lastStep='Corporation Check'; const btns=[replyButton(getText(l,'yesCorp'),"CORP_YES"),replyButton(getText(l,'noCorp'),"CORP_NO")]; const txt=getText(l,'corpQGoodChoice')+"\n\n"+getText(l,'corpQ'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Corporation Check',btns,POSTERS.businessOpp,txt,'CORP_CHECK',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendReady(uid,l){ const fee=userStates[uid].data.currentFee||"15L"; let text="",btn=""; if(fee==="15L"){text=getText(l,'ready15');btn=getText(l,'readyBtn15');}else if(fee==="7L"){text=getText(l,'ready7');btn=getText(l,'readyBtn7');}else if(fee==="3L"){text=getText(l,'ready3');btn=getText(l,'readyBtn3');}else{text=getText(l,'readyBC');btn=getText(l,'readyBtnBC');} userStates[uid].lastStep='Ready to Pay '+fee; const btns=[replyButton(btn,"READY_"+fee),replyButton(getText(l,'emi'),"KNOW_EMI")]; const txt=getText(l,'readyGoodChoice')+"\n\n"+text; sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Ready to Pay '+fee,btns,POSTERS.businessOpp,txt,'READY_TO_PAY',fee,userStates[uid].data.currentType,false,false); }
async function sendPay(uid,l){ userStates[uid].lastStep='Pay Rs.5000 - '+userStates[uid].data.currentFee; const btns=[replyButton(l==='hi'?"मैंने Rs.5000 पे किया":"ഞാൻ Rs.5000 പേ ചെയ്തു","PAY_DONE"), callButton(PHONES.displayB, PHONES.business)]; const txt=getText(l,'payGoodChoice')+"\n\n"+getText(l,'payReg'); const to=formatTo(uid); const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`; const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" }; enqueueSend(uid, async()=>{ try{ await axios.post(url,{ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"cta_url", header:{type:"image",image:{link:POSTERS.businessOpp}}, body:{ text: txt+"\n\nTap below to pay Rs.5000:" }, action:{ name:"cta_url", parameters:{ display_text: l==='hi'?"अभी पे करें - Rs.5000": l==='ml'?"ഇപ്പോൾ പേ ചെയ്യൂ - Rs.5000":"Pay Now - Rs.5000", url:RAZORPAY_ALL } } } },{headers}); logCRM(uid,"OUT",txt,"PAY_CTA",userStates[uid].flow,userStates[uid].lastStep,{currentFee:userStates[uid].data.currentFee, currentType:userStates[uid].data.currentType}); updateReminder(uid,'Pay Rs.5000 - '+userStates[uid].data.currentFee,btns,POSTERS.businessOpp,txt,'PAY',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); setTimeout(()=>{ sendMessage(uid, l==='hi'?"पेमेंट के बाद मदद चाहिए? कॉल करने के लिए टैप करें:" : l==='ml'?"പേയ്മെന്റിന് ശേഷം സഹായം വേണോ? വിളിക്കാൻ ടാപ്പ് ചെയ്യൂ:":"After payment - Need help? Tap to call:",btns); },6000); }catch(e){ await axios.post(url,{ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"cta_url", body:{ text: txt }, action:{ name:"cta_url", parameters:{ display_text:"Pay Now - Rs.5000", url:RAZORPAY_ALL } } } },{headers}); } }, "Pay CTA", "PAY_CTA"); }
async function sendEMI(uid,l){ userStates[uid].lastStep='EMI Options'; const btns=[replyButton(getText(l,'emi10'),"EMI_10"),replyButton(getText(l,'emi20'),"EMI_20"),replyButton(getText(l,'emiBusiness'),"EMI_BC")]; const txt=getText(l,'emiGoodChoice')+"\n\n"+getText(l,'emiOpt'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'EMI Options',btns,POSTERS.businessOpp,txt,'EMI',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function startLead(uid,l){ userStates[uid]={ lang:l, flow:'LEAD', step:1, data:userStates[uid].data, lastStep:'Lead - Name' }; const txt=getText(l,'leadGoodChoice')+"\n\n"+getText(l,'leadAsk')+"\n\n"+ (l==='hi'?"आधार के अनुसार नाम:": l==='ml'?"ആധാർ പ്രകാരമുള്ള പേര്:":"Name as per Aadhaar:"); sendImageWithButtons(uid,POSTERS.businessOpp,txt,[]); updateReminder(uid,'Lead - Name',[],POSTERS.businessOpp,txt,'LEAD',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; s.lastStep='Lead - Place'; const msg= s.lang==='hi' ? "जगह / जिला / राज्य?" : s.lang==='ml' ? "സ്ഥലം / ജില്ല / സംസ്ഥാനം?" : "Place / District / State?"; sendImageWithButtons(uid,POSTERS.businessOpp,msg,[]); updateReminder(uid,'Lead - Place',[],POSTERS.businessOpp,msg,'LEAD',s.data.currentFee,s.data.currentType,false,false); }else if(s.step===2){ s.data.place=txt; s.step=3; s.lastStep='Lead - Occupation'; const btns=[replyButton(getText(s.lang,'bus'),"OCC_BUS"),replyButton(getText(s.lang,'emp'),"OCC_EMP"),replyButton(getText(s.lang,'house'),"OCC_HOUSE")]; const msg=getText(s.lang,'occQGoodChoice')+"\n\n"+getText(s.lang,'occQ'); sendImageWithButtons(uid,POSTERS.businessOpp,msg,btns); updateReminder(uid,'Lead - Occupation',btns,POSTERS.businessOpp,msg,'LEAD',s.data.currentFee,s.data.currentType,false,false); } }
async function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; s.lastStep='Agreement Date'; const btns=[replyButton(getText(s.lang,'today'),"DATE_TODAY"),replyButton(getText(s.lang,'tom'),"DATE_TOMORROW")]; const msg=getText(s.lang,'dateGoodChoice')+"\n\n"+getText(s.lang,'tender')+": "+LINKS.tenderDistrict+"\n\n"+getText(s.lang,'date'); sendImageWithButtons(uid,POSTERS.businessOpp,msg,btns); updateReminder(uid,'Agreement Date',btns,POSTERS.businessOpp,msg,'LEAD',s.data.currentFee,s.data.currentType,false,false); }
async function handleDate(uid,d){ const s=userStates[uid]; const btns=[replyButton("Main Menu","MAIN_MENU"), callButton(PHONES.displayB, PHONES.business)]; const dateText = d==='TODAY' ? getText(s.lang,'today') : d==='TOMORROW' ? getText(s.lang,'tom') : d; const msg=getText(s.lang,'thanksGoodChoice')+getText(s.lang,'thanks')+" - "+s.data.name+" - "+dateText+" - Fee:"+s.data.currentFee; sendImageWithButtons(uid,POSTERS.welcome,msg,btns); logCRM(uid,"FINAL_LEAD",`FINAL LEAD - Fee:${s.data.currentFee} Type:${s.data.currentType} Name:${s.data.name} Place:${s.data.place} Occ:${s.data.occ} Date:${d} Lang:${s.lang}`,`FINAL_${s.data.currentFee}`,s.flow,`Agreement Date - ${d}`,{currentFee:s.data.currentFee, currentType:s.data.currentType, name:s.data.name, place:s.data.place, occ:s.data.occ, agreementDate:d, isFinalLead:true}); delete reminderStore[uid]; saveReminders(); delete userStates[uid]; }

async function onMessage(uid,txt,payload){
  let state=userStates[uid];
  const p=(payload||"").trim();
  const t=(txt||"").toLowerCase().trim();
  const lastInteraction=lastInteractionPerUser.get(uid)||0;
  if(p && Date.now()-lastInteraction<10000 && p===(userStates[uid]?.lastPayload||"")) return;
  lastInteractionPerUser.set(uid,Date.now());
  logCRM(uid,"IN",txt,p,state?.flow||"NEW",state?.lastStep||"First",{currentFee:state?.data?.currentFee, currentType:state?.data?.currentType});
  if(reminderStore[uid]){ reminderStore[uid].lastActivity=Date.now(); reminderStore[uid].reminderCount=0; saveReminders(); }
  const isHi=["hi","hello","hey","hai","start","menu","नमस्ते","ഹായ്"].includes(t);
  if(p.startsWith("LANG_")){ const l=p.replace("LANG_","").toLowerCase(); userStates[uid]={ lang:l, flow:'MAIN', data:{ currentFee:"15L", currentType:"District" }, lastStep:'Main Menu', lastPayload:p }; await sendMain(uid,l); return; }
  if(!state){ await sendFirst(uid); return; }
  if(isHi){ const lastWelcome=recentWelcomes.get(uid); if(lastWelcome && Date.now()-lastWelcome<60000) return; delete userStates[uid]; delete reminderStore[uid]; saveReminders(); await sendFirst(uid); return; }
  const lang=state.lang||'en'; userStates[uid].lastPayload=p;
  if(p==="MAIN_MENU") return await sendMain(uid,lang);
  if(p==="OPT_MORE") return await sendMore(uid,lang);
  if(p==="OPT_RIDE") return await sendRide(uid,lang);
  if(p==="RIDE_BOOK") return await sendCust(uid,lang);
  if(p==="RIDE_ATTACH"||p==="DRIVER_BENEFITS") return await sendDriverBenefits(uid,lang);
  if(p==="OPT_DIR") return await sendBusinessDir(uid,lang);
  if(p==="BIZ_LIST") return await sendBusinessList(uid,lang);
  if(p==="BIZ_BENEFITS") return await sendBusinessListBenefits(uid,lang);
  if(p==="BIZ_PROCEDURE") return await sendBusinessListProcedure(uid,lang);
  if(p==="BIZ_APP_DOWNLOAD"||p==="BIZ_HOW") return await sendBusinessListProcedure(uid,lang);
  if(p==="BIZ_SEARCH") return await sendBusinessSearch(uid,lang);
  if(p==="BIZ_SEARCH_HOW") return await sendBusinessSearchHow(uid,lang);
  if(p==="OPT_DEL") return await sendDel(uid,lang);
  if(p==="DEL_BOOK") return await sendDeliveryBook(uid,lang);
  if(p==="DEL_BOOK_PROC") return await sendDeliveryBookProcedure(uid,lang);
  if(p==="DEL_CHARGES") return await sendDeliveryCharges(uid,lang);
  if(p==="DEL_AGENT") return await sendDeliveryAgent(uid,lang);
  if(p==="DEL_AGENT_BEN") return await sendDeliveryAgentBenefits(uid,lang);
  if(p==="DEL_AGENT_REQ") return await sendDeliveryAgentRequirements(uid,lang);
  if(p==="DEL_AGENT_PROC") return await sendDeliveryAgentProcedure(uid,lang);
  if(p==="DEL_APP_DOWNLOAD"||p==="DEL_HOW") return await sendDeliveryAgentProcedure(uid,lang);
  if(p==="OPT_BOOK") return await sendRoom(uid,lang);
  if(p==="BOOK_ROOM_DETAIL") return await sendRoomDetail(uid,lang);
  if(p==="BOOK_APPOINTMENT") return await sendAppointmentDetail(uid,lang);
  if(p==="BOOK_MOVIE") return await sendMovieDetail(uid,lang);
  if(p==="OPT_EARN") return await sendEarn(uid,lang);
  if(p==="EARN_HIGH") return await sendHigh(uid,lang);
  if(p==="EARN_MOD") return await sendModerate(uid,lang);
  if(p==="EARN_BASE") return await sendBase(uid,lang);
  if(p==="FRAN_DISTRICT") return await sendDistrictDetail(uid,lang);
  if(p==="FRAN_CORP") return await sendCorpDetail(uid,lang);
  if(p==="FRAN_MUNICIPAL") return await sendMunicipalDetail(uid,lang);
  if(p==="FRAN_BC") return await sendBusinessCenterDetail(uid,lang);
  if(p==="KNOW_PROCEDURE") return await sendProcedure(uid,lang,"common");
  if(p==="KNOW_PROCEDURE_BC") return await sendProcedure(uid,lang,"bc");
  if(p==="KNOW_BEN"||p==="BEN_DISTRICT"||p==="BEN_CORP"||p==="BEN_MUNI") return await sendBen(uid,lang);
  if(p==="BEN_BC") return await sendBenBC(uid,lang);
  if(p==="KNOW_SUP"||p==="SUP_DISTRICT"||p==="SUP_CORP"||p==="SUP_MUNI"||p==="SUP_BC") return await sendSup(uid,lang);
  if(p==="KNOW_REQ"||p==="REQ_DISTRICT"||p==="REQ_CORP"||p==="REQ_MUNI"||p==="REQ_BC") return await sendReq(uid,lang);
  if(p==="SUBMIT_APP") return await askCorp(uid,lang);
  if(p==="CORP_YES"||p==="CORP_NO") return await sendReady(uid,lang);
  if(p.startsWith("READY_")) return await sendPay(uid,lang);
  if(p==="KNOW_EMI"||p==="EMI_10"||p==="EMI_20"||p==="EMI_BC") return await sendPay(uid,lang);
  if(p==="VIEW_TENDER") return await askCorp(uid,lang);
  if(p==="PAY_DONE") return await startLead(uid,lang);
  if(p.startsWith("OCC_")) return await handleOcc(uid,p);
  if(p.startsWith("DATE_")) return await handleDate(uid,p.replace("DATE_",""));
  if(state.flow==='LEAD' && txt) return await handleLead(uid,txt);
}

app.post('/webhook', async (req,res)=>{
  res.sendStatus(200);
  try{
    const value=req.body.entry?.[0]?.changes?.[0]?.value;
    if(value?.statuses?.[0]){ const st=value.statuses[0]; if(st.errors){ const errJson=JSON.stringify(st.errors); if(errJson.includes('130429')){ logCRM(st.recipient_id,"OUT_FAILED_130429_DELIVERY",`Delivery failed 130429 - ID:${st.id}`, "", "RATE_LIMIT", "Delivery Rate limit 130429"); } } return; }
    const msg=value?.messages?.[0];
    if(msg){ if(processedIds.has(msg.id)) return; processedIds.add(msg.id); setTimeout(()=>processedIds.delete(msg.id),120000); const uid=msg.from; const txt=msg.text?.body||""; const payload=msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || ""; await onMessage(uid,txt,payload||txt); }
  }catch(e){ console.log("webhook error", e.message); }
});

const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`V80 RATE LIMIT FIX 130429 - 15sec/30sec - No 5min spam - Cleared old reminders - BOT ${BOT_OWN_NUMBER} on ${PORT}`));
