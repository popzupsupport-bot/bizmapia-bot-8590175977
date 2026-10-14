// V76 FINAL - Direct Google Sheets API INSIDE server.js - No Apps Script Needed - Works Perfect in Render
// INSTALL: npm install googleapis
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

// GOOGLE SHEET - Direct API - Set these 2 in Render Environment
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || ""; // Your Sheet ID from URL: docs.google.com/spreadsheets/d/THIS_PART/
const GOOGLE_SERVICE_ACCOUNT_JSON = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || ""; // Full JSON content of service account
const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK || ""; // Optional fallback webhook

let sheetsClient = null;
async function getSheetsClient() {
  if (sheetsClient) return sheetsClient;
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_JSON) return null;
  try {
    const { google } = require('googleapis');
    let credentials;
    try {
      credentials = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);
    } catch(e) {
      console.log("GOOGLE_SERVICE_ACCOUNT_JSON parse error - Make sure it's full JSON");
      return null;
    }
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    sheetsClient = google.sheets({ version: 'v4', auth: client });
    console.log("Google Sheets API client ready - Direct mode");
    return sheetsClient;
  } catch(e) {
    console.log("Sheets API init fail - Install googleapis: npm install googleapis - Error:", e.message);
    return null;
  }
}

async function ensureSheetExists(sheets, sheetName, headers) {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: GOOGLE_SHEET_ID });
    const exists = meta.data.sheets.some(s => s.properties.title === sheetName);
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: GOOGLE_SHEET_ID,
        resource: { requests: [{ addSheet: { properties: { title: sheetName } } }] }
      });
      if (headers) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: GOOGLE_SHEET_ID,
          range: `${sheetName}!A1`,
          valueInputOption: 'RAW',
          resource: { values: [headers] }
        });
        // Bold header
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: GOOGLE_SHEET_ID,
          resource: {
            requests: [{
              repeatCell: {
                range: { sheetId: meta.data.sheets.find(s=>s.properties.title===sheetName)?.properties.sheetId || 0, startRowIndex: 0, endRowIndex: 1 },
                cell: { userEnteredFormat: { backgroundColor: { red: 0.26, green: 0.52, blue: 0.96 }, textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } } } },
                fields: "userEnteredFormat(backgroundColor,textFormat)"
              }
            }]
          }
        });
      }
      console.log(`Created sheet ${sheetName}`);
    }
  } catch(e) {
    console.log(`Ensure sheet ${sheetName} error:`, e.message);
  }
}

async function pushToSheetDirect(entry) {
  if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_JSON) return false;
  try {
    const sheets = await getSheetsClient();
    if (!sheets) return false;

    const timestamp = entry.date;
    const phone = entry.phone;
    const direction = entry.direction;
    const flow = entry.flow;
    const lastStep = entry.lastStep;
    const message = entry.message;
    const payload = entry.payload;
    const fee = entry.currentFee || "";
    const type = entry.currentType || "";
    const name = entry.name || "";
    const place = entry.place || "";
    const occ = entry.occ || "";
    const agreementDate = entry.agreementDate || "";

    const isBusinessOpp = flow.includes('EARN') || flow.includes('DISTRICT') || flow.includes('CORP') || flow.includes('MUNICIPAL') || flow.includes('BC_') || flow.includes('READY') || flow.includes('PAY') || flow.includes('LEAD') || flow.includes('EMI');
    const isDriver = flow.includes('DRIVER') || flow.includes('RIDE_ATTACH') || entry.isDriver === true;
    const isCustomer = flow.includes('RIDE_CUSTOMER') || flow.includes('CUSTOMER');
    const isBusinessDir = flow.includes('BUSINESS_DIR') || entry.isBusinessDir === true;
    const isFinalLead = entry.isFinalLead === true || direction === 'FINAL_LEAD';

    // Always push to All Logs
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Sheet6 - All Logs!A:M',
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[timestamp, phone, direction, flow, lastStep, message, payload, fee, type, name, place, occ, agreementDate]] }
    });

    if (isFinalLead) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'Sheet1 - Final Leads!A:K',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[timestamp, phone, name, place, fee, type, occ, agreementDate || lastStep, flow, lastStep, message]] }
      });
      // Also to Business Opp
      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'Sheet2 - Business Opportunity!A:J',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[timestamp, phone, flow, lastStep, message, payload, fee, type, name, place]] }
      });
    } else if (isBusinessOpp) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'Sheet2 - Business Opportunity!A:J',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[timestamp, phone, flow, lastStep, message, payload, fee, type, name, place]] }
      });
    } else if (isDriver) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'Sheet3 - Drivers!A:I',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[timestamp, phone, flow, lastStep, message, payload, entry.reminderType || "", entry.isDriver ? "Yes" : "", name]] }
      });
    } else if (isCustomer) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'Sheet4 - Customers!A:F',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[timestamp, phone, flow, lastStep, message, payload]] }
      });
    } else if (isBusinessDir) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: GOOGLE_SHEET_ID,
        range: 'Sheet5 - Business Directory!A:H',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[timestamp, phone, flow, lastStep, message, payload, "Yes", "1 Year Discount"]] }
      });
    }

    console.log(`Direct Sheet OK ${phone} ${flow} -> ${isFinalLead?'Final Leads':isBusinessOpp?'Business Opp':isDriver?'Drivers':isCustomer?'Customers':isBusinessDir?'Business Dir':'All Logs'}`);
    return true;
  } catch(e) {
    console.log(`Direct Sheet FAIL: ${e.message}`);
    return false;
  }
}

// 9 POSTERS
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

const LINKS = {
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  businessApp: "https://play.google.com/store/apps/details?id=com.bizmapia.business",
  tenderDistrict: "https://bizmapia.com/tender/district.pdf",
};
const PHONES = { gopalan: "919745226642", business: "918590175977", displayG: "97452 26642", displayB: "85901 75977" };

let userStates = {};
const processedIds = new Set();
const lastSentPerUser = new Map();
const recentWelcomes = new Map();
const lastInteractionPerUser = new Map();

let reminderStore = {};
const REMINDER_FILE = path.join(__dirname, 'reminders.json');
try{ if(fs.existsSync(REMINDER_FILE)){ reminderStore = JSON.parse(fs.readFileSync(REMINDER_FILE,'utf8')); } }catch(e){ reminderStore={}; }
function saveReminders(){ try{ fs.writeFileSync(REMINDER_FILE, JSON.stringify(reminderStore, null, 2)); }catch(e){} }

let crmLogs = [];
function logCRM(uid, dir, msg, payload, flow, step, extra={}){
  const entry = {
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}),
    phone: uid, direction: dir, message: (msg||"").substring(0,500), payload: payload||"", flow: flow||"", lastStep: step||"",
    currentFee: extra.currentFee||userStates[uid]?.data?.currentFee||"", currentType: extra.currentType||userStates[uid]?.data?.currentType||"",
    name: extra.name||userStates[uid]?.data?.name||"", place: extra.place||userStates[uid]?.data?.place||"", occ: extra.occ||userStates[uid]?.data?.occ||"",
    agreementDate: extra.agreementDate||"", isDriver: extra.isDriver||false, isBusinessDir: extra.isBusinessDir||false, isFinalLead: extra.isFinalLead||false, reminderType: extra.reminderType||""
  };
  crmLogs.push(entry);
  if(crmLogs.length>5000) crmLogs.shift();
  console.log(`CRM ${dir} | ${uid} | ${flow} | ${step} | ${msg.substring(0,80)}`);
  
  // Try direct Sheets API first, then webhook fallback
  if(GOOGLE_SHEET_ID && GOOGLE_SERVICE_ACCOUNT_JSON){
    pushToSheetDirect(entry);
  } else if(GOOGLE_SHEET_WEBHOOK && GOOGLE_SHEET_WEBHOOK.startsWith('http')){
    axios.post(GOOGLE_SHEET_WEBHOOK, entry, {timeout: 5000}).catch(()=>{});
  }
}

function updateReminder(uid, lastStep, lastButtons, lastPoster, lastText, flow, fee, type, isDriver=false, isBusinessDir=false){
  reminderStore[uid] = { uid, lastActivity: Date.now(), lastStep, lastButtons, lastPoster, lastText, flow, fee, type, isDriver, isBusinessDir, reminderCount: 0 };
  saveReminders();
}

async function sendReminder(uid, reminderType){
  const r = reminderStore[uid];
  if(!r) return;
  let posterToUse = r.lastPoster;
  let text = "";
  let buttons = r.lastButtons;
  if(r.isDriver) posterToUse = POSTERS.driverReminderBenefits;
  else if(r.isBusinessDir) posterToUse = POSTERS.businessReminderOffer;
  
  if(reminderType==='5min'){ text=`⏰ *5 min reminder*\n\nYou left at *${r.lastStep}*\n\n${r.lastText.substring(0,250)}\n\n👉 *What to do:* ${getWhatToDo(r)}\n🎁 *What you get:* ${getWhatYouGet(r)}\n\nTap now:`; r.reminderCount=1; }
  else if(reminderType==='30min'){ text=`⏰ *30 min - No response*\n\nLeft at *${r.lastStep}*\n\n👉 *Do NOW:* ${getWhatToDo(r)}\n🎁 *Get:* ${getWhatYouGet(r)}\n\n⚡ Tap now:`; r.reminderCount=2; }
  else if(reminderType==='8h'){ text=`🔔 *8h reminder*\n\nAt *${r.lastStep}*\n\n👉 ${getWhatToDo(r)}\n🎁 ${getWhatYouGet(r)}`; r.reminderCount=3; }
  else if(reminderType==='16h'){ text=`⏰ *16h pending*\n\nLeft at *${r.lastStep}*\n\n👉 ${getWhatToDo(r)}\n🎁 ${getWhatYouGet(r)}`; r.reminderCount=4; }
  else if(reminderType==='24h'){
    if(r.isDriver){ text=`⚠️ *24h Driver pending*\n\nAt *${r.lastStep}* 24h ago.\n\n👉 ${getWhatToDo(r)}`; r.reminderCount=5; }
    else{ text=`❌ *24h FINAL - Lost chance*\n\nAt *${r.lastStep}* 24h ago. Retry now!\n\n👇 Select again:`; buttons=[{title:"Ride - Hailing",payload:"OPT_RIDE"},{title:"Business Directory",payload:"OPT_DIR"},{title:"Earn with Bizmapia",payload:"OPT_EARN"}]; r.reminderCount=5; setTimeout(()=>{delete reminderStore[uid];saveReminders();},60000); }
  }
  else if(reminderType==='48h' && r.isDriver){ text=`🔔 *Driver 48h - 2nd Last Chance*\n\nLeft at *${r.lastStep}* 48h ago.\n\n👉 ${getWhatToDo(r)}\n🎁 ${getWhatYouGet(r)}`; r.reminderCount=6; }
  else if(reminderType==='72h' && r.isDriver){ text=`❌ *72h LAST - Lost*\n\nAt *${r.lastStep}* 72h ago. Retry!\n\n👇 Select:`; buttons=[{title:"Attach Vehicle",payload:"RIDE_ATTACH"},{title:"Book a Ride",payload:"RIDE_BOOK"},{title:"Main Menu",payload:"MAIN_MENU"}]; r.reminderCount=7; setTimeout(()=>{delete reminderStore[uid];saveReminders();},60000); }
  else return;
  r.lastReminderTime=Date.now(); saveReminders();
  logCRM(uid,`REMINDER_${reminderType}`,text,buttons?.map(b=>b.payload).join("|"),r.flow,`Reminder ${reminderType} - ${r.lastStep}`,{currentFee:r.fee,currentType:r.type,isDriver:r.isDriver,isBusinessDir:r.isBusinessDir,reminderType:reminderType});
  sendImageWithButtons(uid,posterToUse,text,buttons);
}
function getWhatToDo(r){ if(r.isDriver) return "Download Driver App, Register, Upload docs, Earn 1500-2500/day"; if(r.isBusinessDir) return "Download Business App, Add business, FREE listing + 1 Year Discount"; return "Tap buttons below to continue: "+r.lastStep; }
function getWhatYouGet(r){ if(r.isDriver) return "Rs.1500-2500 daily, Daily payout"; if(r.isBusinessDir) return "FREE listing, 10L+ network, 1 Year Discount"; return "Team call within 24h"; }

setInterval(()=>{
  const now=Date.now();
  for(const uid in reminderStore){
    const r=reminderStore[uid]; if(!r) continue;
    const diffM=(now-r.lastActivity)/60000; const diffH=diffM/60;
    if(diffM>=5 && diffM<6 && r.reminderCount===0) sendReminder(uid,'5min');
    else if(diffM>=30 && diffM<31 && r.reminderCount===1) sendReminder(uid,'30min');
    else if(diffH>=8 && diffH<8.05 && r.reminderCount===2) sendReminder(uid,'8h');
    else if(diffH>=16 && diffH<16.05 && r.reminderCount===3) sendReminder(uid,'16h');
    else if(diffH>=24 && diffH<24.05 && r.reminderCount===4) sendReminder(uid,'24h');
    else if(r.isDriver && diffH>=48 && diffH<48.05 && r.reminderCount===5) sendReminder(uid,'48h');
    else if(r.isDriver && diffH>=72 && diffH<72.05 && r.reminderCount===6) sendReminder(uid,'72h');
    else if(!r.isDriver && diffH>25){ delete reminderStore[uid]; saveReminders(); }
    else if(r.isDriver && diffH>73){ delete reminderStore[uid]; saveReminders(); }
  }
},60*1000);

let lastGlobalSendTime=0;
const GLOBAL_GAP_MS=5000;
const PER_USER_GAP_MS=10000;
const sendQueue=[];
let isProcessingQueue=false;

async function processQueue(){
  if(isProcessingQueue) return;
  isProcessingQueue=true;
  while(sendQueue.length>0){
    if(sendQueue.length>10){ sendQueue.splice(0, sendQueue.length-10); }
    const now=Date.now();
    const globalWait=Math.max(0,(lastGlobalSendTime+GLOBAL_GAP_MS)-now);
    if(globalWait>0) await new Promise(r=>setTimeout(r,globalWait));
    const job=sendQueue[0];
    const uid=job.uid;
    const lastPerUser=lastSentPerUser.get(uid)||0;
    const perUserWait=Math.max(0,(lastPerUser+PER_USER_GAP_MS)-Date.now());
    if(perUserWait>0) await new Promise(r=>setTimeout(r,perUserWait));
    sendQueue.shift();
    try{
      await job.fn();
      lastGlobalSendTime=Date.now();
      lastSentPerUser.set(uid,Date.now());
    }catch(e){
      const errStr=JSON.stringify(e.response?.data||e.message);
      if(errStr.includes('130429')){
        console.log(`130429 for ${uid} - wait 30s`);
        logCRM(uid,"OUT_FAILED_130429",`Rate limit 130429 - ${job.debug}`,job.payload,"RATE_LIMIT","Rate limit");
        await new Promise(r=>setTimeout(r,30000));
        if((job.retryCount||0)>2){ lastGlobalSendTime=Date.now()+15000; lastSentPerUser.set(uid,Date.now()+15000); continue; }
        job.retryCount=(job.retryCount||0)+1;
        sendQueue.unshift(job);
        lastGlobalSendTime=Date.now()+15000;
        lastSentPerUser.set(uid,Date.now()+15000);
        continue;
      }else{
        console.log("Queue error",errStr.substring(0,400));
        lastGlobalSendTime=Date.now();
        lastSentPerUser.set(uid,Date.now());
      }
    }
  }
  isProcessingQueue=false;
}
function enqueueSend(uid,fn,debug="",payload=""){ sendQueue.push({uid,fn,debug,payload, retryCount:0}); processQueue(); }

app.get('/',(req,res)=>res.status(200).send(`V76 FINAL - Direct Sheets API Inside - 9 Posters - More Options Fixed - Rate Limit Safe 5s/10s - 5 Sheet CRM Direct - Reminders 5min,30min,8h,16h,24h FINAL + Driver 48h,72h - ${Object.keys(reminderStore).length} pending - Sheet Direct: ${GOOGLE_SHEET_ID?'SET':'NOT SET'} Webhook: ${GOOGLE_SHEET_WEBHOOK?'SET':'NOT SET'} - <a href="/crm">CRM</a> | <a href="/reminders">Reminders</a> | <a href="/setup-sheets">Setup Sheets</a>`));
app.get('/setup-sheets', async (req,res)=>{
  if(!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_JSON) return res.send("Set GOOGLE_SHEET_ID and GOOGLE_SERVICE_ACCOUNT_JSON env first. See instructions.");
  try{
    const sheets = await getSheetsClient();
    if(!sheets) return res.send("Sheets client fail - Check JSON and install googleapis");
    await ensureSheetExists(sheets, "Sheet1 - Final Leads", ["Timestamp IST", "Phone", "Name", "Place/District", "Fee", "Type", "Occupation", "Agreement Date", "Flow", "Last Step", "Full Message"]);
    await ensureSheetExists(sheets, "Sheet2 - Business Opportunity", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Fee", "Type", "Name", "Place"]);
    await ensureSheetExists(sheets, "Sheet3 - Drivers", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Reminder Type", "Is Driver", "Name"]);
    await ensureSheetExists(sheets, "Sheet4 - Customers", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload"]);
    await ensureSheetExists(sheets, "Sheet5 - Business Directory", ["Timestamp IST", "Phone", "Flow", "Last Step", "Message", "Payload", "Is BusinessDir", "Offer"]);
    await ensureSheetExists(sheets, "Sheet6 - All Logs", ["Timestamp IST", "Phone", "Direction", "Flow", "Last Step", "Message", "Payload", "Fee", "Type", "Name", "Place", "Occ", "Agreement Date"]);
    res.send("All 6 sheets created! Sheet1 Final Leads, Sheet2 Business Opp, Sheet3 Drivers, Sheet4 Customers, Sheet5 Business Dir, Sheet6 All Logs - Check your Google Sheet now.");
  }catch(e){ res.send("Error setup sheets: "+e.message); }
});
app.get('/crm',(req,res)=>{
  const html=`<html><head><title>CRM V76 Direct Sheets</title><style>body{font-family:Arial;margin:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;font-size:11px}th{background:#f2f2f2}.in{background:#e3f2fd}.out{background:#fff3e0}.fail{background:#ffebee}.rem{background:#e8f5e9}</style></head><body><h2>V76 FINAL - Direct Sheets Inside - ${crmLogs.length} logs - Sheet: ${GOOGLE_SHEET_ID?'Direct SET':'Webhook '+ (GOOGLE_SHEET_WEBHOOK?'SET':'NOT SET')}</h2><p><a href="/reminders">Reminders</a> | <a href="/setup-sheets">Setup Sheets (Click once)</a></p><table><tr><th>Date IST</th><th>Phone</th><th>Dir</th><th>Flow</th><th>Last Step</th><th>Fee</th><th>Message</th></tr>${crmLogs.slice(-100).reverse().map(l=>`<tr class="${l.direction==='IN'?'in':l.direction.includes('FAILED')?'fail':l.direction.includes('REMINDER')?'rem':'out'}"><td>${l.date}</td><td>${l.phone}</td><td><b>${l.direction}</b></td><td>${l.flow}</td><td>${l.lastStep}</td><td>${l.currentFee}</td><td><b>${l.payload}</b><br/>${l.message}</td></tr>`).join('')}</table></body></html>`;
  res.send(html);
});
app.get('/reminders',(req,res)=>{
  const html=`<html><head><title>Reminders V76</title><style>body{font-family:Arial;margin:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;font-size:11px}th{background:#f2f2f2}</style></head><body><h2>Reminders Others 5min,30min,8h,16h,24h FINAL | Driver 48h,72h FINAL - ${Object.keys(reminderStore).length} pending</h2><table><tr><th>Phone</th><th>Last Step</th><th>Diff</th><th>Count</th><th>Type</th></tr>${Object.values(reminderStore).map(r=>{const diffM=Math.floor((Date.now()-r.lastActivity)/60000);return `<tr><td>${r.uid}</td><td>${r.lastStep}</td><td>${diffM} min</td><td>${r.reminderCount}</td><td>Driver:${r.isDriver} Biz:${r.isBusinessDir} Fee:${r.fee}</td></tr>`;}).join('')}</table></body></html>`;
  res.send(html);
});
app.get('/webhook',(req,res)=>{ if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']); res.sendStatus(403); });

const FIRST_BRIEF=`🌟 Welcome to Bizmapia - All India 4-in-1 Services!

🚖 Affordable Taxi & Auto
🏪 View/attach Businesses with 10,00,000+ Local Businesses
📦 Fast Food/Grocery/Parcel Delivery
🎟 Rooms, Appointment, Movie Tickets
💰 Earn with Bizmapia Business opportunity

One App. Four Services. Pan-India!

👇 Select language:`;

const T={
  en:{
    selOpt:"Please select any one from below:", ride:"Ride - Hailing", dir:"Business Directory", del:"Online Delivery", book:"Online Booking", earn:"Earn with Bizmapia", more:"More Options",
    rideGoodChoice:"✅ Good choice! *Ride - Hailing*\n\nNow book/attach Cab/Auto/Bike/Ambulance anywhere India.", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle",
    custGoodChoice:"✅ Good choice! *Book a Ride*\n\nNow see cheapest Taxi/Auto/Bike with 10% Discount.", custPost:"🚖 Book ride anywhere India\nCheapest Taxi/Auto/Bike - 10% Discount\nCab/Auto/Bike/Ambulance\n\n📱 "+LINKS.customerApp,
    drivGoodChoice:"✅ Good choice! *Attach Vehicle*\n\nNow see how to earn Rs.1500-2500 daily.", drivPost:"💰 Attach vehicle\nDaily Rs.1500-2500\nTaxi/Auto/Bike/Ambulance\nDaily payout\n\n📱 "+LINKS.driverApp,
    businessDirGoodChoice:"✅ Good choice! *Business Directory*\n\nNow list your business FREE or search 10,00,000+ businesses.", businessDirIntro:"🏪 Business Directory\n10,00,000+ Businesses\n✅ Free Listing\n✅ More Customers\n✅ 1 Year Discount Offer!",
    businessDirBtn1:"List My Business", businessDirBtn2:"Search Business", businessDirBtn3:"How to List?",
    businessListGoodChoice:"✅ Good choice! *List Business*\n\nNow learn benefits & procedure to list FREE.", businessListIntro:"📝 LIST YOUR BUSINESS\nList FREE on Bizmapia!\n✅ Photo, Contact, Location\n✅ Direct customer calls\n✅ 1 Year Discount Offer!",
    businessListBenefits:"🌟 BENEFITS - Business Directory\n✅ 100% Free basic\n✅ Get nearby calls\n✅ Google + Bizmapia\n✅ Rating & Review\n✅ 1 Year Discount!", businessListProcedure:"📋 PROCEDURE\n1. Download Business App\n2. Add Business\n3. Enter Name, Category, Address\n4. Add Photos, Contact\n5. Submit\n6. Live in 24h",
    businessSearchGoodChoice:"✅ Good choice! *Search Business*\n\nNow search any business anywhere India.", businessSearchIntro:"🔍 SEARCH BUSINESS\nFind any business India\n✅ Name, category, place\n✅ 10 lakh+ listed",
    businessSearchHow:"How to Search?\n1. Download App\n2. Search name/category\n3. Select place\n4. Get contact\n5. Call directly",
    deliveryGoodChoice:"✅ Good choice! *Online Delivery*\n\nNow send parcel in 2 Hours anywhere India, or join as agent.", deliveryIntro:"📦 Online Delivery\n⚡ 2 Hours Delivery\n📍 Anywhere India\n💰 Cheapest Rates", deliveryBtn1:"Book Parcel", deliveryBtn2:"Join as Agent", deliveryBtn3:"How it Works?",
    deliveryBookGoodChoice:"✅ Good choice! *Book Parcel*\n\nNow see parcel types & booking procedure.", deliveryBookIntro:"📦 BOOK PARCEL\nSend anything in 2 Hours!\n✅ Documents, Food, Gifts, Medicine",
    deliveryBookProcedure:"📋 PROCEDURE - Book Parcel\n1. Download App\n2. Select Delivery\n3. Enter Pickup/Delivery Address\n4. Enter parcel details\n5. Get price\n6. Confirm & Pay\n7. Pickup 30 mins\n8. Delivered 2 Hours!", deliveryBookCharges:"💰 CHARGES\n• City: Rs.50+\n• District: Rs.100+\n• Inter-District: KM based",
    deliveryAgentGoodChoice:"✅ Good choice! *Join as Agent*\n\nNow see benefits, requirements, procedure to earn daily.", deliveryAgentIntro:"🏍️ JOIN AS AGENT\n💰 Rs.800-1500/day\n✅ Part/full time\n✅ Own bike\n✅ Daily payout",
    deliveryAgentBenefits:"🌟 BENEFITS - Join as Agent\n✅ Rs.800-1500/day\n✅ Bonus per delivery\n✅ No office\n✅ Work near your area\n✅ Daily payout", deliveryAgentRequirements:"📋 REQUIREMENTS - Join as Agent\n✅ Bike + License + RC\n✅ Android Mobile\n✅ Aadhaar + PAN\n✅ 18+ Age", 
    deliveryAgentProcedure:"📋 PROCEDURE - Join as Agent\n1. Download Driver App\n2. Register as Agent\n3. Upload Bike, License, Aadhaar\n4. Verify 24h\n5. Training\n6. Start Earning!\n"+LINKS.driverApp,
    riderBenefitsDetail:"🏍️ RIDER BENEFITS\n💰 Daily Rs.1500-2500\n✅ Part time / Full time\n✅ Own vehicle\n✅ Daily payout\n✅ Bonus", driverRemindBenefits:"🔔 DRIVER REMINDER - Benefits\n💰 Earn Rs.1500-2500 daily!\n🚖 Taxi/Auto/Bike/Ambulance\n✅ Daily payout\n✅ Bonus\n\nDownload Driver App:\n"+LINKS.driverApp,
    bookingGoodChoice:"✅ Good choice! *Online Booking*\n\nNow book Rooms, Appointments, Movie Tickets in 1 click.", bookIntro:"🏨 Online Booking\nBook Rooms, Appointments & Movie Tickets in 1 Click!\n✅ Rooms - Hotels, Resorts\n✅ Appointments - Doctors, Salons\n✅ Movies - All Theatres",
    bookRoom:"Book Room", bookAppointment:"Book Appointment", bookMovie:"Book Movie",
    bookRoomGoodChoice:"✅ Good choice! *Book Rooms*", bookRoomDetail:"🏨 BOOK ROOMS\nHotels | Resorts | Homestays\n✅ Affordable Rates\n✅ Instant Confirmation",
    bookAppointmentGoodChoice:"✅ Good choice! *Book Appointments*", bookAppointmentDetail:"🩺 BOOK APPOINTMENTS\nDoctors | Salons | Services\n✅ Instant Confirmation",
    bookMovieGoodChoice:"✅ Good choice! *Book Movie Tickets*", bookMovieDetail:"🎬 BOOK MOVIE TICKETS\nLatest Movies | All Theatres\n✅ Easy, Fast, Affordable",
    earnGoodChoice:"✅ Good choice! *Earn with Bizmapia*\n\nNow choose High, Moderate, Base opportunity.", earnIntro:"💰 Earn with Bizmapia\nChoose your opportunity",
    high:"High Earning (15L)", mod:"Moderate (3-7L)", base:"Base (Business Center)",
    highGoodChoice:"✅ Good choice! *High Earning*\n\nNow see District/Corp/Municipal details. ONE per district.", highIntro:"🔥 HIGH EARNING\nOnly ONE per district!\n💰 District - 15L\nCorp - 7L\nMunicipal - 3L", highOptDistrict:"District - 15L", highOptCorp:"Corporation - 7L", highOptMuni:"Municipal - 3L",
    moderateGoodChoice:"✅ Good choice! *Moderate Earning*", moderateIntro:"💼 MODERATE EARNING - 3-7L CONFIRMED\nChoose:\n• Corp - 7L\n• Municipal - 3L\n• BC - 50K-1L", 
    corpGoodChoice:"✅ Good choice! *Corporation 7L*", corpIntro:"🏙️ CORPORATION - 7 Lakhs\n• Corporation area\n• Control Business Centers", 
    municipalGoodChoice:"✅ Good choice! *Municipal 3L*", municipalIntro:"🏘️ MUNICIPAL - 3 Lakhs\n• Municipality area",
    baseGoodChoice:"✅ Good choice! *Base - Business Center*", baseIntro:"🏪 BASE - BUSINESS CENTER - 50K-1L CONFIRMED\nLow Investment, High Return", 
    businessCenterIntro:"🏪 BUSINESS CENTER - 50K-1L\n• Panchayat/Small Town\n• You are local center\n• Earn from 4 services", businessCenterBenefits:"🌟 BENEFITS - BC\n✅ 50K-1L low invest\n✅ Earn 4 services\n✅ 90sqft enough",
    franchiseeGoodChoice:"✅ Good choice! *All Franchisee Types*", franchiseeIntro:"📋 ALL TYPES CONFIRMED\n1️⃣ District - 15L\n2️⃣ Corp - 7L\n3️⃣ Municipal - 3L\n4️⃣ BC - 50K-1L",
    procedureDistrict:"PROCEDURE - District 15L\n1. Know benefits\n2. Corp check Yes/No\n3. Confirm ready 15L\n4. Pay Rs.5000\n5. Share Name, Place, District\n6. Agreement Date\n7. Tender\n8. Team call 24h\n9. Balance + Training", procedureBusinessCenter:"PROCEDURE - BC 50K-1L\n1. Know benefits\n2. Requirements 90sqft\n3. Pay Rs.5000\n4. Share details\n5. Agreement Date", procedureCommon:"GENERAL PROCEDURE - All 4 types\n1. Select type\n2. Benefits, Support, Requirements\n3. Corp check\n4. Ready to pay\n5. Pay Rs.5000\n6. EMI\n7. Share details\n8. Occupation\n9. Agreement date\n10. Tender\n11. Verification\n12. Launch",
    benDistrict:"BENEFITS - District 15L\n✅ Top level franchisee\n✅ % on ALL earnings\n✅ Direct Company contact\n✅ Lifetime royalty", benCorp:"BENEFITS - Corp 7L\n✅ Control corp area\n✅ % from BCs", benBusinessCenter:"BENEFITS - BC 50K-1L\n✅ Low invest\n✅ Earn 4 services",
    supText:"SUPPORT\n✅ 12 months marketing\n✅ 6 months Rent (District)\n✅ 6 months Staff salary\n✅ Software + Training",
    reqDistrict:"REQUIREMENTS - District 15L\n✅ 90 Sqft room\n✅ 1 staff\n✅ PC/Mobile\n✅ Ready 15L\n✅ Aadhaar + PAN", reqBusinessCenter:"REQUIREMENTS - BC\n✅ 90 Sqft room\n✅ 1 staff\n✅ PC/Mobile\n✅ Ready 50K-1L",
    corpQGoodChoice:"✅ Good choice! Ready to submit.\n\nNow: Did district contain corporation?", corpQ:"Did district contain corporation? If HQ has Corporation (e.g. Kochi), select Yes Corp.", yesCorp:"Yes Corp", noCorp:"No Corp",
    readyGoodChoice:"✅ Good choice! Corp status confirmed.\n\nNow confirm ready to pay fee.", ready15:"Confirm ready to pay 15 Lakhs as District fee.\n👉 Next: Pay Rs.5000 registration.", ready7:"Confirm ready to pay 7 Lakhs as Corporation fee.", ready3:"Confirm ready to pay 3 Lakhs as Municipal fee.", readyBC:"Confirm ready to pay 50K-1L as Business Center fee.", readyBtn15:"Yes Ready - 15L", readyBtn7:"Yes Ready - 7L", readyBtn3:"Yes Ready - 3L", readyBtnBC:"Yes Ready - BC",
    payGoodChoice:"✅ Good choice! Ready confirmed.\n\nNow pay Rs.5000 registration. Part of total fee, not extra.", payReg:"Pay Rs.5000 to proceed.\nPart of total fee, not extra.\nTap Pay Now below.", emiGoodChoice:"✅ Good choice! EMI options.", emiOpt:"Select EMI:\nDown 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10:"5L + 10x1L", emi20:"5L + 20x50k", emiBusiness:"BC EMI",
    leadGoodChoice:"✅ Good choice! Payment done.\n\nNow share contact details. Final step.", leadAsk:"Share contact:\nName, Place, District, State, Contact, Occupation\n\nName as per Aadhaar:", occQGoodChoice:"✅ Good choice! Place shared.\n\nNow select occupation.", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", tender:"Download Tender", dateGoodChoice:"✅ Good choice! Occupation selected.\n\nNow select agreement date.", date:"Select Agreement Date:", today:"Today", tom:"Tomorrow", thanksGoodChoice:"✅ Great! All details received.\n\n", thanks:"Thanks! Team will call within 24h. Application submitted!",
    callG:"97452 26642", callB:"85901 75977", bookNow:"Book Now", dlDriv:"Driver App",
    knowProcedure:"Know Procedure", backToEarn:"Back to Earn", viewTender:"View Tender", video:"Video Link", benefits:"Benefits", support:"Support", requirements:"Requirements", submit:"Submit Application", pay:"Pay Rs.5000", emi:"EMI Options",
    howToList:"How to List?", searchBusiness:"Search Business", howItWorks:"How it Works?", bookParcel:"Book Parcel", joinAgent:"Join as Agent", listBusiness:"List Business", downloadApp:"Download App"
  }
};

function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]||""; }
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

async function sendFirst(uid){
  const lastWelcome=recentWelcomes.get(uid);
  if(lastWelcome && Date.now()-lastWelcome<60000) return;
  if(formatTo(uid)===BOT_OWN_NUMBER) return;
  userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', data:{ currentFee:"15L", currentType:"District" } };
  recentWelcomes.set(uid,Date.now()); setTimeout(()=>recentWelcomes.delete(uid),60000);
  const btns=[replyButton("English","LANG_EN"),replyButton("Hindi","LANG_HI"),replyButton("Malayalam","LANG_ML")];
  sendImageWithButtons(uid,POSTERS.welcome,FIRST_BRIEF,btns);
  updateReminder(uid,'Language Selection',btns,POSTERS.welcome,FIRST_BRIEF,'WELCOME','15L','District',false,false);
}
async function sendMain(uid,l){ userStates[uid].lang=l; userStates[uid].flow='MAIN'; userStates[uid].lastStep='Main Menu'; const btns=[replyButton(getText(l,'ride'),"OPT_RIDE"),replyButton(getText(l,'earn'),"OPT_EARN"),replyButton(getText(l,'more'),"OPT_MORE")]; const txt=getText(l,'selOpt'); sendImageWithButtons(uid,POSTERS.welcome,txt,btns); updateReminder(uid,'Main Menu',btns,POSTERS.welcome,txt,'MAIN',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendMore(uid,l){ userStates[uid].lastStep='More Options'; const btns=[replyButton(getText(l,'del'),"OPT_DEL"),replyButton(getText(l,'book'),"OPT_BOOK"),replyButton(getText(l,'dir'),"OPT_DIR")]; const txt="More Options - Select any one from below:"; sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'More Options',btns,POSTERS.businessOpp,txt,'MORE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendRide(uid,l){ userStates[uid].lastStep='Ride Selection'; const btns=[replyButton(getText(l,'bookRide'),"RIDE_BOOK"),replyButton(getText(l,'attach'),"RIDE_ATTACH")]; const txt=getText(l,'rideGoodChoice')+"\n\n"+getText(l,'rideOpt'); sendImageWithButtons(uid,POSTERS.customerRide,txt,btns); updateReminder(uid,'Ride Selection',btns,POSTERS.customerRide,txt,'RIDE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendCust(uid,l){ userStates[uid].lastStep='Book a Ride - Customer'; const btns=[replyButton(getText(l,'bookNow'),"BOOK_NOW"), callButton(PHONES.displayG, PHONES.gopalan)]; const txt=getText(l,'custGoodChoice')+"\n\n"+getText(l,'custPost'); sendImageWithButtons(uid,POSTERS.customerRide,txt,btns); updateReminder(uid,'Book a Ride - Customer',btns,POSTERS.customerRide,txt,'RIDE_CUSTOMER',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDriv(uid,l){ userStates[uid].lastStep='Driver Attach - Benefits'; userStates[uid].flow='DRIVER'; const btns=[replyButton(getText(l,'dlDriv'),"DL_DRIV"), callButton(PHONES.displayG, PHONES.gopalan), replyButton("Benefits","DRIVER_BENEFITS")]; const txt=getText(l,'drivGoodChoice')+"\n\n"+getText(l,'riderBenefitsDetail')+"\n\n"+getText(l,'drivPost'); sendImageWithButtons(uid,POSTERS.driverRide,txt,btns); updateReminder(uid,'Driver Attach - Benefits',btns,POSTERS.driverRide,txt,'DRIVER',userStates[uid].data.currentFee,userStates[uid].data.currentType,true,false); }
async function sendDriverBenefits(uid,l){ userStates[uid].lastStep='Rider Benefits - Reminder'; const btns=[replyButton(getText(l,'dlDriv'),"DL_DRIV"), callButton(PHONES.displayG, PHONES.gopalan), replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'riderBenefitsDetail')+"\n\n"+getText(l,'driverRemindBenefits'); sendImageWithButtons(uid,POSTERS.driverReminderBenefits,txt,btns); updateReminder(uid,'Rider Benefits - Reminder',btns,POSTERS.driverReminderBenefits,txt,'DRIVER_BENEFITS',userStates[uid].data.currentFee,userStates[uid].data.currentType,true,false); }
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
async function sendDeliveryAgentProcedure(uid,l){ const btns=[replyButton(getText(l,'downloadApp'),"DEL_APP_DOWNLOAD"),replyButton(getText(l,'bookParcel'),"DEL_BOOK"),callButton(PHONES.displayG, PHONES.gopalan)]; const txt=getText(l,'deliveryAgentProcedure'); sendImageWithButtons(uid,POSTERS.delivery,txt,btns); updateReminder(uid,'Delivery - Agent Procedure',btns,POSTERS.delivery,txt,'DELIVERY_AGENT_PROC',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendRoom(uid,l){ userStates[uid].lastStep='Room Booking'; const btns=[replyButton(getText(l,'bookRoom'),"BOOK_ROOM_DETAIL"),replyButton(getText(l,'bookAppointment'),"BOOK_APPOINTMENT"),replyButton(getText(l,'bookMovie'),"BOOK_MOVIE")]; const txt=getText(l,'bookingGoodChoice')+"\n\n"+getText(l,'bookIntro'); sendImageWithButtons(uid,POSTERS.booking,txt,btns); updateReminder(uid,'Room Booking',btns,POSTERS.booking,txt,'BOOKING',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendRoomDetail(uid,l){ const btns=[replyButton(getText(l,'bookAppointment'),"BOOK_APPOINTMENT"),replyButton(getText(l,'bookMovie'),"BOOK_MOVIE"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'bookRoomGoodChoice')+"\n\n"+getText(l,'bookRoomDetail'); sendImageWithButtons(uid,POSTERS.booking,txt,btns); updateReminder(uid,'Room Booking Detail',btns,POSTERS.booking,txt,'BOOKING_ROOM',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendAppointmentDetail(uid,l){ const btns=[replyButton(getText(l,'bookRoom'),"BOOK_ROOM_DETAIL"),replyButton(getText(l,'bookMovie'),"BOOK_MOVIE"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'bookAppointmentGoodChoice')+"\n\n"+getText(l,'bookAppointmentDetail'); sendImageWithButtons(uid,POSTERS.booking,txt,btns); updateReminder(uid,'Appointment Detail',btns,POSTERS.booking,txt,'BOOKING_APPOINTMENT',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendMovieDetail(uid,l){ const btns=[replyButton(getText(l,'bookRoom'),"BOOK_ROOM_DETAIL"),replyButton(getText(l,'bookAppointment'),"BOOK_APPOINTMENT"),replyButton("Main Menu","MAIN_MENU")]; const txt=getText(l,'bookMovieGoodChoice')+"\n\n"+getText(l,'bookMovieDetail'); sendImageWithButtons(uid,POSTERS.booking,txt,btns); updateReminder(uid,'Movie Detail',btns,POSTERS.booking,txt,'BOOKING_MOVIE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendEarn(uid,l){ userStates[uid].lastStep='Earn Selection'; const btns=[replyButton(getText(l,'high'),"EARN_HIGH"),replyButton(getText(l,'mod'),"EARN_MOD"),replyButton(getText(l,'base'),"EARN_BASE")]; const txt=getText(l,'earnGoodChoice')+"\n\n"+getText(l,'earnIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Earn Selection',btns,POSTERS.businessOpp,txt,'EARN',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendHigh(uid,l){ userStates[uid].lastStep='High Earning'; const btns=[replyButton(getText(l,'highOptDistrict'),"FRAN_DISTRICT"),replyButton(getText(l,'highOptCorp'),"FRAN_CORP"),replyButton(getText(l,'highOptMuni'),"FRAN_MUNICIPAL")]; const txt=getText(l,'highGoodChoice')+"\n\n"+getText(l,'highIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'High Earning',btns,POSTERS.businessOpp,txt,'EARN_HIGH',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendModerate(uid,l){ userStates[uid].lastStep='Moderate Earning CONFIRMED'; const btns=[replyButton("Corporation - 7L","FRAN_CORP"),replyButton("Municipal - 3L","FRAN_MUNICIPAL"),replyButton(getText(l,'businessCenter'),"FRAN_BC")]; const txt=getText(l,'moderateGoodChoice')+"\n\n"+getText(l,'moderateIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Moderate Earning',btns,POSTERS.businessOpp,txt,'EARN_MOD',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendBase(uid,l){ userStates[uid].lastStep='Base Earning CONFIRMED'; const btns=[replyButton("Business Center","FRAN_BC"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE_BC"),replyButton(getText(l,'benefits'),"BEN_BC")]; const txt=getText(l,'baseGoodChoice')+"\n\n"+getText(l,'baseIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Base Earning',btns,POSTERS.businessOpp,txt,'EARN_BASE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendDistrictDetail(uid,l){ userStates[uid].data.currentFee="15L"; userStates[uid].data.currentType="District"; userStates[uid].lastStep='District Detail'; const btns=[replyButton(getText(l,'video'),"VIDEO_DISTRICT"),replyButton(getText(l,'support'),"SUP_DISTRICT"),replyButton(getText(l,'requirements'),"REQ_DISTRICT")]; const txt=getText(l,'benGoodChoice')+"\n\n"+getText(l,'benDistrict'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'District Detail',btns,POSTERS.businessOpp,txt,'DISTRICT_DETAIL','15L','District',false,false); }
async function sendCorpDetail(uid,l){ userStates[uid].data.currentFee="7L"; userStates[uid].data.currentType="Corporation"; userStates[uid].lastStep='Corporation Detail'; const btns=[replyButton(getText(l,'benefits'),"BEN_CORP"),replyButton(getText(l,'support'),"SUP_CORP"),replyButton(getText(l,'requirements'),"REQ_CORP")]; const txt=getText(l,'corpGoodChoice')+"\n\n"+getText(l,'corpIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Corporation Detail',btns,POSTERS.businessOpp,txt,'CORP_DETAIL','7L','Corporation',false,false); }
async function sendMunicipalDetail(uid,l){ userStates[uid].data.currentFee="3L"; userStates[uid].data.currentType="Municipal"; userStates[uid].lastStep='Municipal Detail'; const btns=[replyButton(getText(l,'benefits'),"BEN_MUNI"),replyButton(getText(l,'support'),"SUP_MUNI"),replyButton(getText(l,'requirements'),"REQ_MUNI")]; const txt=getText(l,'municipalGoodChoice')+"\n\n"+getText(l,'municipalIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Municipal Detail',btns,POSTERS.businessOpp,txt,'MUNICIPAL_DETAIL','3L','Municipal',false,false); }
async function sendBusinessCenterDetail(uid,l){ userStates[uid].data.currentFee="BC"; userStates[uid].data.currentType="Business Center"; userStates[uid].lastStep='Business Center Detail'; const btns=[replyButton(getText(l,'benefits'),"BEN_BC"),replyButton(getText(l,'support'),"SUP_BC"),replyButton(getText(l,'requirements'),"REQ_BC")]; const txt=getText(l,'baseGoodChoice')+"\n\n"+getText(l,'businessCenterIntro'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Business Center Detail',btns,POSTERS.businessOpp,txt,'BC_DETAIL','BC','Business Center',false,false); }
async function sendProcedure(uid,l,type="common"){ userStates[uid].lastStep='Procedure '+type; let text=""; if(type==="district") text=getText(l,'procedureDistrict'); else if(type==="bc") text=getText(l,'procedureBusinessCenter'); else text=getText(l,'procedureCommon'); const btns=[replyButton(getText(l,'viewTender'),"VIEW_TENDER"),replyButton(getText(l,'submit'),"SUBMIT_APP"),replyButton(getText(l,'backToEarn'),"OPT_EARN")]; sendImageWithButtons(uid,POSTERS.businessOpp,text,btns); updateReminder(uid,'Procedure '+type,btns,POSTERS.businessOpp,text,'PROCEDURE',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendBen(uid,l){ const type=userStates[uid].data.currentType||"District"; let text=""; if(type==="District") text=getText(l,'benDistrict'); else if(type==="Corporation") text=getText(l,'benCorp'); else text=getText(l,'benBusinessCenter'); const btns=[replyButton(getText(l,'support'),"KNOW_SUP"),replyButton(getText(l,'requirements'),"KNOW_REQ"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE")]; const fullText=getText(l,'benGoodChoice')+"\n\n"+text; sendImageWithButtons(uid,POSTERS.businessOpp,fullText,btns); updateReminder(uid,'Benefits - '+type,btns,POSTERS.businessOpp,fullText,'BENEFITS',userStates[uid].data.currentFee,type,false,false); }
async function sendBenBC(uid,l){ const btns=[replyButton(getText(l,'support'),"SUP_BC"),replyButton(getText(l,'requirements'),"REQ_BC"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE_BC")]; const txt=getText(l,'benGoodChoice')+"\n\n"+getText(l,'businessCenterBenefits'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Benefits - BC',btns,POSTERS.businessOpp,txt,'BENEFITS_BC','BC','Business Center',false,false); }
async function sendSup(uid,l){ const btns=[replyButton(getText(l,'requirements'),"KNOW_REQ"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE"),replyButton(getText(l,'submit'),"SUBMIT_APP")]; const txt=getText(l,'supGoodChoice')+"\n\n"+getText(l,'supText'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Support',btns,POSTERS.businessOpp,txt,'SUPPORT',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendReq(uid,l){ const type=userStates[uid].data.currentType||"District"; let text=(type==="Business Center")?getText(l,'reqBusinessCenter'):getText(l,'reqDistrict'); const btns=[replyButton(getText(l,'submit'),"SUBMIT_APP"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE"),replyButton(getText(l,'emi'),"KNOW_EMI")]; const fullText=getText(l,'reqGoodChoice')+"\n\n"+text; sendImageWithButtons(uid,POSTERS.businessOpp,fullText,btns); updateReminder(uid,'Requirements - '+type,btns,POSTERS.businessOpp,fullText,'REQUIREMENTS',userStates[uid].data.currentFee,type,false,false); }
async function askCorp(uid,l){ userStates[uid].lastStep='Corporation Check'; const btns=[replyButton(getText(l,'yesCorp'),"CORP_YES"),replyButton(getText(l,'noCorp'),"CORP_NO")]; const txt=getText(l,'corpQGoodChoice')+"\n\n"+getText(l,'corpQ'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Corporation Check',btns,POSTERS.businessOpp,txt,'CORP_CHECK',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function sendReady(uid,l){ const fee=userStates[uid].data.currentFee||"15L"; let text="",btn=""; if(fee==="15L"){text=getText(l,'ready15');btn=getText(l,'readyBtn15');}else if(fee==="7L"){text=getText(l,'ready7');btn=getText(l,'readyBtn7');}else if(fee==="3L"){text=getText(l,'ready3');btn=getText(l,'readyBtn3');}else{text=getText(l,'readyBC');btn=getText(l,'readyBtnBC');} userStates[uid].lastStep='Ready to Pay '+fee; const btns=[replyButton(btn,"READY_"+fee),replyButton(getText(l,'emi'),"KNOW_EMI")]; const txt=getText(l,'readyGoodChoice')+"\n\n"+text; sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'Ready to Pay '+fee,btns,POSTERS.businessOpp,txt,'READY_TO_PAY',fee,userStates[uid].data.currentType,false,false); }
async function sendPay(uid,l){ userStates[uid].lastStep='Pay Rs.5000 - '+userStates[uid].data.currentFee; const btns=[replyButton("I Paid - Rs.5000","PAY_DONE"), callButton(PHONES.displayB, PHONES.business)]; const txt=getText(l,'payGoodChoice')+"\n\n"+getText(l,'payReg'); const to=formatTo(uid); const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`; const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" }; enqueueSend(uid, async()=>{ try{ await axios.post(url,{ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"cta_url", header:{type:"image",image:{link:POSTERS.businessOpp}}, body:{ text: txt+"\n\nTap below to pay Rs.5000:" }, action:{ name:"cta_url", parameters:{ display_text:"Pay Now - Rs.5000", url:RAZORPAY_ALL } } } },{headers}); logCRM(uid,"OUT",txt,"PAY_CTA",userStates[uid].flow,userStates[uid].lastStep,{currentFee:userStates[uid].data.currentFee, currentType:userStates[uid].data.currentType}); updateReminder(uid,'Pay Rs.5000 - '+userStates[uid].data.currentFee,btns,POSTERS.businessOpp,txt,'PAY',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); setTimeout(()=>{ sendMessage(uid,"After payment - Need help? Tap to call:",btns); },6000); }catch(e){ await axios.post(url,{ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"cta_url", body:{ text: txt }, action:{ name:"cta_url", parameters:{ display_text:"Pay Now - Rs.5000", url:RAZORPAY_ALL } } } },{headers}); } }, "Pay CTA", "PAY_CTA"); }
async function sendEMI(uid,l){ userStates[uid].lastStep='EMI Options'; const btns=[replyButton(getText(l,'emi10'),"EMI_10"),replyButton(getText(l,'emi20'),"EMI_20"),replyButton(getText(l,'emiBusiness'),"EMI_BC")]; const txt=getText(l,'emiGoodChoice')+"\n\n"+getText(l,'emiOpt'); sendImageWithButtons(uid,POSTERS.businessOpp,txt,btns); updateReminder(uid,'EMI Options',btns,POSTERS.businessOpp,txt,'EMI',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function startLead(uid,l){ userStates[uid]={ lang:l, flow:'LEAD', step:1, data:userStates[uid].data, lastStep:'Lead - Name' }; const txt=getText(l,'leadGoodChoice')+"\n\n"+getText(l,'leadAsk')+"\n\nName as per Aadhaar:"; sendImageWithButtons(uid,POSTERS.businessOpp,txt,[]); updateReminder(uid,'Lead - Name',[],POSTERS.businessOpp,txt,'LEAD',userStates[uid].data.currentFee,userStates[uid].data.currentType,false,false); }
async function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; s.lastStep='Lead - Place'; const msg="Place / District / State?"; sendImageWithButtons(uid,POSTERS.businessOpp,msg,[]); updateReminder(uid,'Lead - Place',[],POSTERS.businessOpp,msg,'LEAD',s.data.currentFee,s.data.currentType,false,false); }else if(s.step===2){ s.data.place=txt; s.step=3; s.lastStep='Lead - Occupation'; const btns=[replyButton(getText(s.lang,'bus'),"OCC_BUS"),replyButton(getText(s.lang,'emp'),"OCC_EMP"),replyButton(getText(s.lang,'house'),"OCC_HOUSE")]; const msg=getText(s.lang,'occQGoodChoice')+"\n\n"+getText(s.lang,'occQ'); sendImageWithButtons(uid,POSTERS.businessOpp,msg,btns); updateReminder(uid,'Lead - Occupation',btns,POSTERS.businessOpp,msg,'LEAD',s.data.currentFee,s.data.currentType,false,false); } }
async function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; s.lastStep='Agreement Date'; const btns=[replyButton(getText(s.lang,'today'),"DATE_TODAY"),replyButton(getText(s.lang,'tom'),"DATE_TOMORROW")]; const msg=getText(s.lang,'dateGoodChoice')+"\n\n"+getText(s.lang,'tender')+"\n"+LINKS.tenderDistrict+"\n\n"+getText(s.lang,'date'); sendImageWithButtons(uid,POSTERS.businessOpp,msg,btns); updateReminder(uid,'Agreement Date',btns,POSTERS.businessOpp,msg,'LEAD',s.data.currentFee,s.data.currentType,false,false); }
async function handleDate(uid,d){ const s=userStates[uid]; const btns=[replyButton("Main Menu","MAIN_MENU"), callButton(PHONES.displayB, PHONES.business)]; const msg=getText(s.lang,'thanksGoodChoice')+getText(s.lang,'thanks')+" - "+s.data.name+" - "+d+" - Fee:"+s.data.currentFee; sendImageWithButtons(uid,POSTERS.welcome,msg,btns); logCRM(uid,"FINAL_LEAD",`FINAL LEAD - Fee:${s.data.currentFee} Type:${s.data.currentType} Name:${s.data.name} Place:${s.data.place} Occ:${s.data.occ} Date:${d}`,`FINAL_${s.data.currentFee}`,s.flow,`Agreement Date - ${d}`,{currentFee:s.data.currentFee, currentType:s.data.currentType, name:s.data.name, place:s.data.place, occ:s.data.occ, agreementDate:d, isFinalLead:true}); delete reminderStore[uid]; saveReminders(); delete userStates[uid]; }

async function onMessage(uid,txt,payload){
  let state=userStates[uid];
  const p=(payload||"").trim();
  const t=(txt||"").toLowerCase().trim();
  const lastInteraction=lastInteractionPerUser.get(uid)||0;
  if(p && Date.now()-lastInteraction<10000 && p===(userStates[uid]?.lastPayload||"")) return;
  lastInteractionPerUser.set(uid,Date.now());
  logCRM(uid,"IN",txt,p,state?.flow||"NEW",state?.lastStep||"First",{currentFee:state?.data?.currentFee, currentType:state?.data?.currentType});
  if(reminderStore[uid]){ reminderStore[uid].lastActivity=Date.now(); reminderStore[uid].reminderCount=0; saveReminders(); }
  const isHi=["hi","hello","hey","hai","start","menu"].includes(t);
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
    if(value?.statuses?.[0]){
      const st=value.statuses[0];
      if(st.errors){
        const errJson=JSON.stringify(st.errors);
        if(errJson.includes('130429')){ logCRM(st.recipient_id,"OUT_FAILED_130429_DELIVERY",`Delivery failed 130429 - ID:${st.id}`, "", "RATE_LIMIT", "Delivery Rate limit 130429"); }
      }
      return;
    }
    const msg=value?.messages?.[0];
    if(msg){
      if(processedIds.has(msg.id)) return;
      processedIds.add(msg.id); setTimeout(()=>processedIds.delete(msg.id),120000);
      const uid=msg.from; const txt=msg.text?.body||""; const payload=msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || "";
      await onMessage(uid,txt,payload||txt);
    }
  }catch(e){ console.log("webhook error", e.message); }
});

const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`V76 FINAL Direct Sheets Inside - 9 Posters - More Options Fixed - Rate Limit Safe 5s/10s - Direct Sheets: ${GOOGLE_SHEET_ID?'SET':'NOT SET'} - BOT ${BOT_OWN_NUMBER} on ${PORT}`));
