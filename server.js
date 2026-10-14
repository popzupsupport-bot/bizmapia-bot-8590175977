// V64 FINAL - Google Sheets CRM + Failed Tries Recording + No Rate Limit - BOT 7025630644
// FIXES: Records IN to Google Sheet even if OUT fails with 130429
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
// SET YOUR GOOGLE SHEET WEBHOOK URL HERE - Get from Apps Script
const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK || ""; // e.g. https://script.google.com/macros/s/AKfyc.../exec

const POSTERS = {
  onlineBooking: "https://i.ibb.co/Y7FmRY7v/Bizmapia-Online-Booking-Made-Easy.png",
  delivery: "https://i.ibb.co/nN5pMLm8/Bizmapia-Fast-Safe-Local-Delivery.png",
  businessDir: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  businessList: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  businessSearch: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  rideCustomer: "https://i.ibb.co/204Ztdvh/204Ztdvh.jpg",
  rideDriver: "https://i.ibb.co/67jpyTSS/67jpyTSS.jpg",
  districtFranchise: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  corporation: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  municipal: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  businessCenter: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  franchisee: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  benefits: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  support: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  requirements: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  extra: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
};

const LINKS = {
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  businessApp: "https://play.google.com/store/apps/details?id=com.bizmapia.business",
  businessWebsite: "https://bizmapia.com",
  tenderDistrict: "https://bizmapia.com/tender/district.pdf",
};

const PHONES = {
  gopalan: "919745226642",
  business: "918590175977",
  displayG: "97452 26642",
  displayB: "85901 75977",
};

let userStates = {};
const processedIds = new Set();
const lastSentPerUser = new Map();
const recentWelcomes = new Map();

let crmLogs = [];
const CRM_FILE = path.join(__dirname, 'crm_logs.json');
try{ if(fs.existsSync(CRM_FILE)){ crmLogs = JSON.parse(fs.readFileSync(CRM_FILE,'utf8')); } }catch(e){ crmLogs=[]; }
function saveCRM(){ try{ fs.writeFileSync(CRM_FILE, JSON.stringify(crmLogs.slice(-5000), null, 2)); }catch(e){} }

// V64: Push to Google Sheets - Even for failed tries
async function pushToGoogleSheet(entry){
  // 1. Local CRM
  crmLogs.push(entry);
  if(crmLogs.length%5===0) saveCRM();
  console.log(`CRM ${entry.direction} | ${entry.phone} | ${entry.flow} | ${entry.lastStep} | ${entry.message.substring(0,80)}`);

  // 2. Google Sheet Webhook (if configured)
  if(GOOGLE_SHEET_WEBHOOK && GOOGLE_SHEET_WEBHOOK.startsWith('http')){
    try{
      // Format for your V6 Sheet structure: Date, Phone, Name, Message, Stage, Full Log
      const sheetPayload = {
        timestamp: entry.date,
        phone: entry.phone,
        name: entry.name || "",
        message: entry.message,
        payload: entry.payload,
        direction: entry.direction,
        flow: entry.flow,
        lastStep: entry.lastStep,
        fee: entry.currentFee,
        type: entry.currentType,
        // V6 compatible format
        sheetRow: [
          entry.date,
          entry.phone,
          entry.name || "",
          `${entry.direction} | ${entry.message} | ${entry.payload} | ${entry.flow} | ${entry.lastStep} | Fee:${entry.currentFee}`,
          entry.payload,
        ]
      };
      await axios.post(GOOGLE_SHEET_WEBHOOK, sheetPayload, {timeout: 5000});
      console.log(`Google Sheet push OK for ${entry.phone} ${entry.direction}`);
    }catch(e){
      console.log(`Google Sheet push FAIL for ${entry.phone}: ${e.message} - Will retry later`);
      // Don't fail the main flow, just log locally
    }
  } else {
    if(entry.direction==='IN'){
      console.log(`GOOGLE_SHEET_WEBHOOK not set - IN logged only locally. Set env var GOOGLE_SHEET_WEBHOOK to your Apps Script URL to push to sheet.`);
    }
  }
}

function logCRM(uid, direction, message, payload, flow, lastStep, extra={}){
  const entry = {
    id: Date.now()+"_"+Math.random().toString(36).substring(2,7),
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'}),
    phone: uid, direction, message:(message||"").substring(0,500), payload:payload||"", flow:flow||"", lastStep:lastStep||"",
    currentFee:extra.currentFee||"", currentType:extra.currentType||"",
    name:extra.name||userStates[uid]?.data?.name||"", place:extra.place||userStates[uid]?.data?.place||"", occ:extra.occ||userStates[uid]?.data?.occ||"",
  };
  // V64: Push immediately, don't wait for OUT success
  pushToGoogleSheet(entry);
  return entry;
}

// V64 Queue: Per-user 12s + Global 6s + Retry
let lastGlobalSendTime = 0;
const GLOBAL_GAP_MS = 6000;
const PER_USER_GAP_MS = 12000;
const sendQueue = [];
let isProcessingQueue = false;

async function processQueue(){
  if(isProcessingQueue) return;
  isProcessingQueue = true;
  while(sendQueue.length > 0){
    const now = Date.now();
    const globalWait = Math.max(0, (lastGlobalSendTime + GLOBAL_GAP_MS) - now);
    if(globalWait>0) await new Promise(r=>setTimeout(r, globalWait));
    
    const job = sendQueue[0];
    const uid = job.uid;
    const lastPerUser = lastSentPerUser.get(uid) || 0;
    const perUserWait = Math.max(0, (lastPerUser + PER_USER_GAP_MS) - Date.now());
    if(perUserWait>0){
      console.log(`Per-user wait ${perUserWait}ms for ${uid}`);
      await new Promise(r=>setTimeout(r, perUserWait));
    }
    
    sendQueue.shift();
    try{
      await job.fn();
      lastGlobalSendTime = Date.now();
      lastSentPerUser.set(uid, Date.now());
    }catch(e){
      const errStr = JSON.stringify(e.response?.data||e.message);
      if(errStr.includes('130429')){
        console.log(`130429 for ${uid} - Waiting 20s and retry`);
        // Log the failed attempt to CRM as FAILED but still recorded
        logCRM(uid, "OUT_FAILED_130429", `Rate limit hit - Will retry in 20s - Message: ${job.debug||""}`, job.payload||"", "RATE_LIMIT", "Rate limit hit", {currentFee:""});
        await new Promise(r=>setTimeout(r, 20000));
        sendQueue.unshift(job);
        lastGlobalSendTime = Date.now() + 15000;
        lastSentPerUser.set(uid, Date.now() + 15000);
        continue;
      }else{
        console.log("Queue error", errStr);
        lastGlobalSendTime = Date.now();
        lastSentPerUser.set(uid, Date.now());
      }
    }
  }
  isProcessingQueue = false;
}

function enqueueSend(uid, fn, debug="", payload=""){
  sendQueue.push({uid: uid, fn: fn, debug: debug, payload: payload});
  processQueue();
}

app.get('/', (req,res)=>res.status(200).send(`V64 Google Sheets CRM + Failed Tries - ${crmLogs.length} logs - Bot:${BOT_OWN_NUMBER} - <a href="/crm">View CRM</a> | Sheet Webhook: ${GOOGLE_SHEET_WEBHOOK ? 'SET' : 'NOT SET - Set GOOGLE_SHEET_WEBHOOK env var'}`));
app.get('/crm', (req,res)=>{
  const html=`<html><head><title>CRM ${crmLogs.length}</title><style>body{font-family:Arial;margin:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;font-size:11px}th{background:#f2f2f2}.in{background:#e3f2fd}.out{background:#fff3e0}.fail{background:#ffebee}</style></head><body><h2>📊 V64 CRM - ${crmLogs.length} Records - Includes FAILED tries</h2><p>Google Sheet: ${GOOGLE_SHEET_WEBHOOK ? 'Connected' : 'Not connected - set GOOGLE_SHEET_WEBHOOK env'} | <a href="/crm/download">Download JSON</a> | Auto-refresh 10s</p><table><tr><th>Date IST</th><th>Phone</th><th>Dir</th><th>Flow</th><th>Last Step</th><th>Message/Payload</th><th>Status</th></tr>${crmLogs.slice(-200).reverse().map(l=>`<tr class="${l.direction==='IN'?'in':l.direction.includes('FAILED')?'fail':'out'}"><td>${l.date}</td><td>${l.phone}</td><td><b>${l.direction}</b></td><td>${l.flow}</td><td>${l.lastStep}</td><td><b>${l.payload}</b><br/>${l.message}</td><td>${l.direction.includes('FAILED')?'❌ Failed but Recorded':'✅ Recorded'}</td></tr>`).join('')}</table><script>setTimeout(()=>location.reload(),10000)</script></body></html>`;
  res.send(html);
});
app.get('/crm/download', (req,res)=>{ res.setHeader('Content-disposition','attachment; filename=crm_logs.json'); res.setHeader('Content-type','application/json'); res.send(JSON.stringify(crmLogs,null,2)); });
app.get('/webhook',(req,res)=>{ if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']); res.sendStatus(403); });

const FIRST_BRIEF = `🌟 Welcome to Bizmapia - All India 4-in-1 Services!

🚖 Affordable Taxi & Auto
🏪 View/attach Businesses with 10,00,000+ Local Businesses
📦 Fast Food/Grocery/Parcel Delivery
🎟 Rooms, Appointment, Movie Tickets
💰 Earn with Bizmapia Business opportunity

One App. Four Services. Pan-India!

👇 Select language:`;

const T = {
  en:{
    selOpt:"Please select any one from below:", ride:"Ride - Hailing", dir:"Business Directory", del:"Online Delivery", book:"Online Booking", earn:"Earn with Bizmapia", more:"More Options",
    rideGoodChoice:"✅ Good choice! *Ride - Hailing*\n\nNow book/attach Cab/Auto/Bike/Ambulance anywhere India.", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle",
    custGoodChoice:"✅ Good choice! *Book a Ride*\n\nNow see cheapest Taxi/Auto/Bike with 10% Discount.", custPost:"🚖 Book ride anywhere India\nCheapest Taxi/Auto/Bike - 10% Discount\nCab/Auto/Bike/Ambulance\n\n📱 "+LINKS.customerApp,
    drivGoodChoice:"✅ Good choice! *Attach Vehicle*\n\nNow see how to earn Rs.1500-2500 daily.", drivPost:"💰 Attach vehicle\nDaily Rs.1500-2500\nTaxi/Auto/Bike/Ambulance\nDaily payout\n\n📱 "+LINKS.driverApp,
    businessDirGoodChoice:"✅ Good choice! *Business Directory*\n\nNow list your business FREE or search 10,00,000+ businesses.", businessDirIntro:"🏪 Business Directory\n10,00,000+ Businesses\n✅ Free Listing\n✅ More Customers",
    businessDirBtn1:"List My Business", businessDirBtn2:"Search Business", businessDirBtn3:"How to List?",
    businessListGoodChoice:"✅ Good choice! *List Business*\n\nNow learn benefits & procedure to list FREE.", businessListIntro:"📝 LIST YOUR BUSINESS\nList FREE on Bizmapia!\n✅ Photo, Contact, Location\n✅ Direct customer calls",
    businessListBenefits:"🌟 BENEFITS\n✅ 100% Free basic\n✅ Get nearby calls\n✅ Google + Bizmapia\n✅ Rating & Review", businessListProcedure:"📋 PROCEDURE\n1. Download Business App\n2. Add Business\n3. Enter Name, Category, Address\n4. Add Photos, Contact\n5. Submit\n6. Live in 24h",
    businessListApp:"Download:\n"+LINKS.businessApp, businessSearchGoodChoice:"✅ Good choice! *Search Business*\n\nNow search any business anywhere India.", businessSearchIntro:"🔍 SEARCH BUSINESS\nFind any business India\n✅ Name, category, place\n✅ 10 lakh+ listed",
    businessSearchHow:"How to Search?\n1. Download App\n2. Search name/category\n3. Select place\n4. Get contact\n5. Call directly",
    deliveryGoodChoice:"✅ Good choice! *Online Delivery*\n\nNow send parcel in 2 Hours anywhere India, or join as agent.", deliveryIntro:"📦 Online Delivery\n⚡ 2 Hours Delivery\n📍 Anywhere India\n💰 Cheapest Rates", deliveryBtn1:"Book Parcel", deliveryBtn2:"Join as Agent", deliveryBtn3:"How it Works?",
    deliveryBookGoodChoice:"✅ Good choice! *Book Parcel*\n\nNow see parcel types & booking procedure.", deliveryBookIntro:"📦 BOOK PARCEL\nSend anything in 2 Hours!\n✅ Documents, Food, Gifts, Medicine",
    deliveryBookProcedure:"📋 PROCEDURE - Book Parcel\n1. Download App\n2. Select Delivery\n3. Enter Pickup/Delivery Address\n4. Enter parcel details\n5. Get price\n6. Confirm & Pay\n7. Pickup 30 mins\n8. Delivered 2 Hours!", deliveryBookCharges:"💰 CHARGES\n• City: Rs.50+\n• District: Rs.100+\n• Inter-District: KM based",
    deliveryAgentGoodChoice:"✅ Good choice! *Join as Agent*\n\nNow see benefits, requirements, procedure to earn daily.", deliveryAgentIntro:"🏍️ JOIN AS AGENT\n💰 Rs.800-1500/day\n✅ Part/full time\n✅ Own bike\n✅ Daily payout",
    deliveryAgentBenefits:"🌟 BENEFITS\n✅ Rs.800-1500/day\n✅ Bonus\n✅ No office\n✅ Work near area", deliveryAgentRequirements:"📋 REQUIREMENTS\n✅ Bike + License + RC\n✅ Android Mobile\n✅ Aadhaar + PAN\n✅ 18+ Age",
    deliveryAgentProcedure:"📋 PROCEDURE - Join\n1. Download Driver App\n2. Register as Agent\n3. Upload Bike, License, Aadhaar\n4. Verify 24h\n5. Training\n6. Start!\n"+LINKS.driverApp,
    bookingGoodChoice:"✅ Good choice! *Online Booking*\n\nNow book Rooms, Appointments, Movie Tickets in 1 click.", bookIntro:"🏨 Online Booking\nBook Rooms, Appointments & Movie Tickets in 1 Click!\n✅ Rooms - Hotels, Resorts\n✅ Appointments - Doctors, Salons\n✅ Movies - All Theatres\nAffordable, Instant, Safe!",
    bookRoom:"Book Room", bookAppointment:"Book Appointment", bookMovie:"Book Movie",
    bookRoomGoodChoice:"✅ Good choice! *Book Rooms*\n\nNow see how to book hotels/resorts/homestays.", bookRoomDetail:"🏨 BOOK ROOMS\nHotels | Resorts | Homestays\n✅ Affordable Rates\n✅ Instant Confirmation\n✅ Safe Payments",
    bookAppointmentGoodChoice:"✅ Good choice! *Book Appointments*", bookAppointmentDetail:"🩺 BOOK APPOINTMENTS\nDoctors | Salons | Services\n✅ Instant Confirmation\n✅ Trusted",
    bookMovieGoodChoice:"✅ Good choice! *Book Movie Tickets*", bookMovieDetail:"🎬 BOOK MOVIE TICKETS\nLatest Movies | All Theatres\n✅ Easy, Fast, Affordable",
    earnGoodChoice:"✅ Good choice! *Earn with Bizmapia*\n\nNow choose High, Moderate, Base opportunity.", earnIntro:"💰 Earn with Bizmapia\nChoose your opportunity\nWhat type you looking?",
    high:"High Earning (15L)", mod:"Moderate (3-7L)", base:"Base (Business Center)", franchisee:"Franchisee", businessCenter:"Business Center",
    highGoodChoice:"✅ Good choice! *High Earning*\n\nNow see District/Corp/Municipal details. ONE per district.", highIntro:"🔥 HIGH EARNING\nOnly ONE per district!\n💰 District - 15L\nCorp - 7L\nMunicipal - 3L", highOptDistrict:"District - 15L", highOptCorp:"Corporation - 7L", highOptMuni:"Municipal - 3L",
    moderateGoodChoice:"✅ Good choice! *Moderate Earning*\n\nNow see Corporation 7L & Municipal 3L details.", moderateIntro:"💼 MODERATE EARNING - 3-7L CONFIRMED\n\nCity/Town level entrepreneurs\nChoose:\n• Corp - 7L - Full corp control\n• Municipal - 3L - Municipality\n• BC - 50K-1L", 
    corpGoodChoice:"✅ Good choice! *Corporation 7L*\n\nNow see benefits, support, requirements.", corpIntro:"🏙️ CORPORATION - 7 Lakhs\n• Corporation area\n• Control Business Centers", 
    municipalGoodChoice:"✅ Good choice! *Municipal 3L*", municipalIntro:"🏘️ MUNICIPAL - 3 Lakhs\n• Municipality area\n• Good income, low invest",
    baseGoodChoice:"✅ Good choice! *Base - Business Center*\n\nNow see low investment 50K-1L opportunity.", baseIntro:"🏪 BASE - BUSINESS CENTER - 50K-1L CONFIRMED\n\nLow Investment, High Return\nPerfect for small towns, villages\n• Panchayat/Small Town\n• Earn from 4 services", 
    businessCenterIntro:"🏪 BUSINESS CENTER - 50K-1L\n• Panchayat/Small Town\n• You are local center\n• Earn from 4 services\n• Company leads\n• Training", businessCenterBenefits:"🌟 BENEFITS - BC\n✅ 50K-1L low invest\n✅ Earn 4 services\n✅ 90sqft enough\n✅ Marketing support",
    franchiseeGoodChoice:"✅ Good choice! *All Franchisee Types*", franchiseeIntro:"📋 ALL TYPES CONFIRMED\n1️⃣ District - 15L\n2️⃣ Corp - 7L\n3️⃣ Municipal - 3L\n4️⃣ BC - 50K-1L",
    procedureGoodChoice:"✅ Good choice! *Procedure*", procedureTitle:"📝 PROCEDURE", procedureDistrict:"PROCEDURE - District 15L\n1. Know benefits\n2. Corp check Yes/No\n3. Confirm ready 15L\n4. Pay Rs.5000 (part of 15L)\n5. Share Name, Place, District\n6. Agreement Date\n7. Tender\n8. Team call 24h\n9. Balance + Training", procedureBusinessCenter:"PROCEDURE - BC 50K-1L\n1. Know benefits\n2. Requirements 90sqft\n3. Pay Rs.5000\n4. Share details\n5. Agreement Date\n6. Tender\n7. Verification\n8. Balance + Start", procedureCommon:"GENERAL PROCEDURE - All 4 types\n1. Select type\n2. Benefits, Support, Requirements\n3. Corp check\n4. Ready to pay\n5. Pay Rs.5000\n6. EMI\n7. Share details\n8. Occupation\n9. Agreement date\n10. Tender\n11. Verification\n12. Launch",
    benGoodChoice:"✅ Good choice! *Benefits*", benTitle:"🌟 BENEFITS", benDistrict:"BENEFITS - District 15L\n✅ Top level franchisee\n✅ % on ALL earnings\n✅ Direct Company contact\n✅ Lifetime royalty", benCorp:"BENEFITS - Corp 7L\n✅ Control corp area\n✅ % from BCs", benBusinessCenter:"BENEFITS - BC 50K-1L\n✅ Low invest\n✅ Earn 4 services",
    supGoodChoice:"✅ Good choice! *Support*", supTitle:"🤝 SUPPORT", supText:"SUPPORT\n✅ 12 months marketing\n✅ 6 months Rent (District)\n✅ 6 months Staff salary\n✅ Software + Training",
    reqGoodChoice:"✅ Good choice! *Requirements*", reqTitle:"📋 REQUIREMENTS", reqDistrict:"REQUIREMENTS - District 15L\n✅ 90 Sqft room\n✅ 1 staff\n✅ PC/Mobile\n✅ Ready 15L\n✅ Aadhaar + PAN", reqBusinessCenter:"REQUIREMENTS - BC\n✅ 90 Sqft room\n✅ 1 staff\n✅ PC/Mobile\n✅ Ready 50K-1L\n✅ Aadhaar + PAN",
    corpQGoodChoice:"✅ Good choice! Ready to submit.\n\nNow: Did district contain corporation?", corpQ:"Did district contain corporation? If HQ has Corporation (e.g. Kochi), select Yes Corp.", yesCorp:"Yes Corp", noCorp:"No Corp",
    readyGoodChoice:"✅ Good choice! Corp status confirmed.\n\nNow confirm ready to pay fee.", ready15:"Confirm ready to pay 15 Lakhs as District fee.\n👉 Next: Pay Rs.5000 registration.", ready7:"Confirm ready to pay 7 Lakhs as Corporation fee.", ready3:"Confirm ready to pay 3 Lakhs as Municipal fee.", readyBC:"Confirm ready to pay 50K-1L as Business Center fee.", readyBtn15:"Yes Ready - 15L", readyBtn7:"Yes Ready - 7L", readyBtn3:"Yes Ready - 3L", readyBtnBC:"Yes Ready - BC",
    payGoodChoice:"✅ Good choice! Ready confirmed.\n\nNow pay Rs.5000 registration. Part of total fee, not extra.", payReg:"Pay Rs.5000 to proceed.\nPart of total fee, not extra.\nTap Pay Now below.", emiGoodChoice:"✅ Good choice! EMI options.", emiOpt:"Select EMI:\nDown 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10:"5L + 10x1L", emi20:"5L + 20x50k", emiBusiness:"BC EMI",
    leadGoodChoice:"✅ Good choice! Payment done.\n\nNow share contact details. Final step.", leadAsk:"Share contact:\nName, Place, District, State, Contact, Occupation\n\nName as per Aadhaar:", occQGoodChoice:"✅ Good choice! Place shared.\n\nNow select occupation.", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"Download Tender", dateGoodChoice:"✅ Good choice! Occupation selected.\n\nNow select agreement date.", date:"Select Agreement Date:", today:"Today", tom:"Tomorrow", thanksGoodChoice:"✅ Great! All details received.\n\n", thanks:"Thanks! Team will call within 24h. Application submitted!",
    callG:"97452 26642", callB:"85901 75977", bookNow:"Book Now", dlDriv:"Driver App",
    knowProcedure:"Know Procedure", knowFranchiseeTypes:"All Franchisee Types", backToEarn:"Back to Earn", viewTender:"View Tender", video:"Video Link", benefits:"Benefits", support:"Support", requirements:"Requirements", submit:"Submit Application", pay:"Pay Rs.5000", emi:"EMI Options",
    howToList:"How to List?", searchBusiness:"Search Business", howItWorks:"How it Works?", bookParcel:"Book Parcel", joinAgent:"Join as Agent", listBusiness:"List Business", downloadApp:"Download App"
  }
};

function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]||""; }
function formatTo(to){ let c=String(to).replace(/\D/g,""); if(c.startsWith("91") && c.length===12) return c; if(c.length===10) return "91"+c; return c; }

function doSendMessage(uid, txt, btnsRaw){
  return new Promise(async (resolve, reject)=>{
    const to=formatTo(uid); if(to===BOT_OWN_NUMBER){ return resolve(); }
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
      const resp=await axios.post(url,data,{headers});
      console.log(`OUT OK to ${to} -> ${resp.data.messages?.[0]?.id}`);
      logCRM(uid,"OUT",txt,btnsRaw?.map(b=>b.payload||b.title).join("|"),userStates[uid]?.flow||"",userStates[uid]?.lastStep||"",{currentFee:userStates[uid]?.data?.currentFee,currentType:userStates[uid]?.data?.currentType});
      resolve();
    }catch(e){ console.log("SEND FAIL", JSON.stringify(e.response?.data,null,2)); reject(e); }
  });
}

function doSendImageWithButtons(uid, imgUrl, caption, btnsRaw){
  return new Promise(async (resolve, reject)=>{
    const to=formatTo(uid); if(to===BOT_OWN_NUMBER){ return resolve(); }
    try{
      const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`;
      const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
      let buttons=[]; for(let b of btnsRaw.slice(0,3)){ if(b.phone){ buttons.push({type:"phone_number",phone_number:b.phone,title:b.title.substring(0,20)}); }else{ buttons.push({type:"reply",reply:{id:b.payload,title:b.title.substring(0,20)}}); } }
      const data={ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", header:{type:"image",image:{link:imgUrl}}, body:{text:String(caption).substring(0,1024)}, action:{buttons} } };
      const resp=await axios.post(url,data,{headers});
      console.log(`OUT IMAGE OK to ${to} -> ${resp.data.messages?.[0]?.id}`);
      logCRM(uid,"OUT",caption,btnsRaw?.map(b=>b.payload||b.title).join("|"),userStates[uid]?.flow||"",userStates[uid]?.lastStep||"",{currentFee:userStates[uid]?.data?.currentFee,currentType:userStates[uid]?.data?.currentType});
      resolve();
    }catch(e){ console.log("IMAGE FAIL", JSON.stringify(e.response?.data,null,2)); reject(e); }
  });
}

function sendMessage(uid, txt, btns){ enqueueSend(uid, ()=>doSendMessage(uid, txt, btns), txt.substring(0,100), btns?.map(b=>b.payload).join(",")); }
function sendImageWithButtons(uid, imgUrl, caption, btns){ enqueueSend(uid, ()=>doSendImageWithButtons(uid, imgUrl, caption, btns), caption.substring(0,100), btns?.map(b=>b.payload).join(",")); }
function callButton(display, phone){ return {title:display, phone:phone}; }
function replyButton(title, payload){ return {title, payload}; }

async function sendFirst(uid){
  const lastWelcome = recentWelcomes.get(uid);
  if(lastWelcome && Date.now()-lastWelcome < 15000){ console.log(`BLOCK double welcome ${uid}`); return; }
  console.log(`sendFirst V64 to ${uid}`);
  if(formatTo(uid)===BOT_OWN_NUMBER) return;
  userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', data:{ currentFee:"15L", currentType:"District" } };
  recentWelcomes.set(uid, Date.now()); setTimeout(()=>recentWelcomes.delete(uid),20000);
  sendMessage(uid,FIRST_BRIEF,[replyButton("English","LANG_EN"),replyButton("Hindi","LANG_HI"),replyButton("Malayalam","LANG_ML")]);
}
async function sendMain(uid,l){ userStates[uid].lang=l; userStates[uid].flow='MAIN'; userStates[uid].lastStep='Main Menu'; sendMessage(uid,getText(l,'selOpt'),[replyButton(getText(l,'ride'),"OPT_RIDE"),replyButton(getText(l,'earn'),"OPT_EARN"),replyButton(getText(l,'more'),"OPT_MORE")]); }
async function sendMore(uid,l){ userStates[uid].lastStep='More Options'; sendMessage(uid,"More:",[replyButton(getText(l,'del'),"OPT_DEL"),replyButton(getText(l,'book'),"OPT_BOOK"),replyButton(getText(l,'dir'),"OPT_DIR")]); }
async function sendRide(uid,l){ userStates[uid].lastStep='Ride Selection'; sendImageWithButtons(uid,POSTERS.rideCustomer,getText(l,'rideGoodChoice')+"\n\n"+getText(l,'rideOpt'),[replyButton(getText(l,'bookRide'),"RIDE_BOOK"),replyButton(getText(l,'attach'),"RIDE_ATTACH")]); }
async function sendCust(uid,l){ userStates[uid].lastStep='Book a Ride'; sendImageWithButtons(uid,POSTERS.rideCustomer,getText(l,'custGoodChoice')+"\n\n"+getText(l,'custPost'),[replyButton(getText(l,'bookNow'),"BOOK_NOW"), callButton(PHONES.displayG, PHONES.gopalan)]); }
async function sendDriv(uid,l){ userStates[uid].lastStep='Driver Attach'; userStates[uid].flow='DRIVER'; sendImageWithButtons(uid,POSTERS.rideDriver,getText(l,'drivGoodChoice')+"\n\n"+getText(l,'drivPost'),[replyButton(getText(l,'dlDriv'),"DL_DRIV"), callButton(PHONES.displayG, PHONES.gopalan)]); }
async function sendBusinessDir(uid,l){ userStates[uid].lastStep='Business Directory Main'; sendImageWithButtons(uid,POSTERS.businessDir,getText(l,'businessDirGoodChoice')+"\n\n"+getText(l,'businessDirIntro'),[replyButton(getText(l,'businessDirBtn1'),"BIZ_LIST"),replyButton(getText(l,'businessDirBtn2'),"BIZ_SEARCH"),replyButton(getText(l,'businessDirBtn3'),"BIZ_HOW")]); }
async function sendBusinessList(uid,l){ userStates[uid].lastStep='Business Directory - List'; sendImageWithButtons(uid,POSTERS.businessList,getText(l,'businessListGoodChoice')+"\n\n"+getText(l,'businessListIntro'),[replyButton(getText(l,'benefits'),"BIZ_BENEFITS"),replyButton(getText(l,'requirements'),"BIZ_PROCEDURE"),replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD")]); }
async function sendBusinessListBenefits(uid,l){ sendImageWithButtons(uid,POSTERS.businessList,getText(l,'businessListBenefits'),[replyButton(getText(l,'requirements'),"BIZ_PROCEDURE"),replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD"),replyButton(getText(l,'backToEarn'),"OPT_DIR")]); }
async function sendBusinessListProcedure(uid,l){ sendImageWithButtons(uid,POSTERS.businessList,getText(l,'businessListProcedure'),[replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD"),replyButton(getText(l,'businessDirBtn2'),"BIZ_SEARCH"),replyButton("Main Menu","MAIN_MENU")]); }
async function sendBusinessSearch(uid,l){ userStates[uid].lastStep='Business Directory - Search'; sendImageWithButtons(uid,POSTERS.businessSearch,getText(l,'businessSearchGoodChoice')+"\n\n"+getText(l,'businessSearchIntro'),[replyButton(getText(l,'howToList'),"BIZ_HOW"),replyButton(getText(l,'searchBusiness'),"BIZ_SEARCH_HOW"),replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD")]); }
async function sendBusinessSearchHow(uid,l){ sendMessage(uid,getText(l,'businessSearchHow'),[replyButton(getText(l,'listBusiness'),"BIZ_LIST"),replyButton(getText(l,'downloadApp'),"BIZ_APP_DOWNLOAD"),replyButton("Main Menu","MAIN_MENU")]); }
async function sendDel(uid,l){ userStates[uid].lastStep='Delivery Main'; sendImageWithButtons(uid,POSTERS.delivery,getText(l,'deliveryGoodChoice')+"\n\n"+getText(l,'deliveryIntro'),[replyButton(getText(l,'deliveryBtn1'),"DEL_BOOK"),replyButton(getText(l,'deliveryBtn2'),"DEL_AGENT"),replyButton(getText(l,'deliveryBtn3'),"DEL_HOW")]); }
async function sendDeliveryBook(uid,l){ userStates[uid].lastStep='Delivery - Book Parcel'; sendImageWithButtons(uid,POSTERS.delivery,getText(l,'deliveryBookGoodChoice')+"\n\n"+getText(l,'deliveryBookIntro'),[replyButton(getText(l,'requirements'),"DEL_BOOK_PROC"),replyButton("Charges","DEL_CHARGES"),replyButton(getText(l,'downloadApp'),"DEL_APP_DOWNLOAD")]); }
async function sendDeliveryBookProcedure(uid,l){ sendImageWithButtons(uid,POSTERS.delivery,getText(l,'deliveryBookProcedure'),[replyButton("Charges","DEL_CHARGES"),replyButton(getText(l,'joinAgent'),"DEL_AGENT"),replyButton("Main Menu","MAIN_MENU")]); }
async function sendDeliveryCharges(uid,l){ sendMessage(uid,getText(l,'deliveryBookCharges'),[replyButton(getText(l,'bookParcel'),"DEL_BOOK"),replyButton(getText(l,'joinAgent'),"DEL_AGENT"),replyButton("Main Menu","MAIN_MENU")]); }
async function sendDeliveryAgent(uid,l){ userStates[uid].lastStep='Delivery - Agent'; sendImageWithButtons(uid,POSTERS.delivery,getText(l,'deliveryAgentGoodChoice')+"\n\n"+getText(l,'deliveryAgentIntro'),[replyButton(getText(l,'benefits'),"DEL_AGENT_BEN"),replyButton(getText(l,'requirements'),"DEL_AGENT_REQ"),replyButton(getText(l,'downloadApp'),"DEL_APP_DOWNLOAD")]); }
async function sendDeliveryAgentBenefits(uid,l){ sendImageWithButtons(uid,POSTERS.delivery,getText(l,'deliveryAgentBenefits'),[replyButton(getText(l,'requirements'),"DEL_AGENT_REQ"),replyButton(getText(l,'knowProcedure'),"DEL_AGENT_PROC"),replyButton("Main Menu","MAIN_MENU")]); }
async function sendDeliveryAgentRequirements(uid,l){ sendImageWithButtons(uid,POSTERS.delivery,getText(l,'deliveryAgentRequirements'),[replyButton(getText(l,'knowProcedure'),"DEL_AGENT_PROC"),replyButton(getText(l,'downloadApp'),"DEL_APP_DOWNLOAD"),replyButton("Main Menu","MAIN_MENU")]); }
async function sendDeliveryAgentProcedure(uid,l){ sendImageWithButtons(uid,POSTERS.delivery,getText(l,'deliveryAgentProcedure'),[replyButton(getText(l,'downloadApp'),"DEL_APP_DOWNLOAD"),replyButton(getText(l,'bookParcel'),"DEL_BOOK"),callButton(PHONES.displayG, PHONES.gopalan)]); }
async function sendRoom(uid,l){ userStates[uid].lastStep='Room Booking'; sendImageWithButtons(uid,POSTERS.onlineBooking,getText(l,'bookingGoodChoice')+"\n\n"+getText(l,'bookIntro'),[replyButton(getText(l,'bookRoom'),"BOOK_ROOM_DETAIL"),replyButton(getText(l,'bookAppointment'),"BOOK_APPOINTMENT"),replyButton(getText(l,'bookMovie'),"BOOK_MOVIE")]); }
async function sendRoomDetail(uid,l){ sendImageWithButtons(uid,POSTERS.onlineBooking,getText(l,'bookRoomGoodChoice')+"\n\n"+getText(l,'bookRoomDetail'),[replyButton(getText(l,'bookAppointment'),"BOOK_APPOINTMENT"),replyButton(getText(l,'bookMovie'),"BOOK_MOVIE"),replyButton("Main Menu","MAIN_MENU")]); }
async function sendAppointmentDetail(uid,l){ sendImageWithButtons(uid,POSTERS.onlineBooking,getText(l,'bookAppointmentGoodChoice')+"\n\n"+getText(l,'bookAppointmentDetail'),[replyButton(getText(l,'bookRoom'),"BOOK_ROOM_DETAIL"),replyButton(getText(l,'bookMovie'),"BOOK_MOVIE"),replyButton("Main Menu","MAIN_MENU")]); }
async function sendMovieDetail(uid,l){ sendImageWithButtons(uid,POSTERS.onlineBooking,getText(l,'bookMovieGoodChoice')+"\n\n"+getText(l,'bookMovieDetail'),[replyButton(getText(l,'bookRoom'),"BOOK_ROOM_DETAIL"),replyButton(getText(l,'bookAppointment'),"BOOK_APPOINTMENT"),replyButton("Main Menu","MAIN_MENU")]); }
async function sendEarn(uid,l){ userStates[uid].lastStep='Earn Selection'; sendImageWithButtons(uid,POSTERS.districtFranchise,getText(l,'earnGoodChoice')+"\n\n"+getText(l,'earnIntro'),[replyButton(getText(l,'high'),"EARN_HIGH"),replyButton(getText(l,'mod'),"EARN_MOD"),replyButton(getText(l,'base'),"EARN_BASE")]); }
async function sendHigh(uid,l){ userStates[uid].lastStep='High Earning'; sendImageWithButtons(uid,POSTERS.districtFranchise,getText(l,'highGoodChoice')+"\n\n"+getText(l,'highIntro'),[replyButton(getText(l,'highOptDistrict'),"FRAN_DISTRICT"),replyButton(getText(l,'highOptCorp'),"FRAN_CORP"),replyButton(getText(l,'highOptMuni'),"FRAN_MUNICIPAL")]); }
async function sendModerate(uid,l){ userStates[uid].lastStep='Moderate Earning CONFIRMED'; sendImageWithButtons(uid,POSTERS.corporation,getText(l,'moderateGoodChoice')+"\n\n"+getText(l,'moderateIntro'),[replyButton("Corporation - 7L","FRAN_CORP"),replyButton("Municipal - 3L","FRAN_MUNICIPAL"),replyButton(getText(l,'businessCenter'),"FRAN_BC")]); }
async function sendBase(uid,l){ userStates[uid].lastStep='Base Earning CONFIRMED'; sendImageWithButtons(uid,POSTERS.businessCenter,getText(l,'baseGoodChoice')+"\n\n"+getText(l,'baseIntro'),[replyButton("Business Center","FRAN_BC"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE_BC"),replyButton(getText(l,'benefits'),"BEN_BC")]); }
async function sendFranchiseeTypes(uid,l){ userStates[uid].lastStep='All Franchisee Types'; sendImageWithButtons(uid,POSTERS.franchisee,getText(l,'franchiseeGoodChoice')+"\n\n"+getText(l,'franchiseeIntro'),[replyButton("District - 15L","FRAN_DISTRICT"),replyButton("Corporation - 7L","FRAN_CORP"),replyButton("Business Center","FRAN_BC")]); }
async function sendDistrictDetail(uid,l){ userStates[uid].data.currentFee="15L"; userStates[uid].data.currentType="District"; userStates[uid].lastStep='District Detail'; sendImageWithButtons(uid,POSTERS.districtFranchise,getText(l,'benGoodChoice')+"\n\n"+getText(l,'benDistrict'),[replyButton(getText(l,'video'),"VIDEO_DISTRICT"),replyButton(getText(l,'support'),"SUP_DISTRICT"),replyButton(getText(l,'requirements'),"REQ_DISTRICT")]); }
async function sendCorpDetail(uid,l){ userStates[uid].data.currentFee="7L"; userStates[uid].data.currentType="Corporation"; userStates[uid].lastStep='Corporation Detail'; sendImageWithButtons(uid,POSTERS.corporation,getText(l,'corpGoodChoice')+"\n\n"+getText(l,'corpIntro'),[replyButton(getText(l,'benefits'),"BEN_CORP"),replyButton(getText(l,'support'),"SUP_CORP"),replyButton(getText(l,'requirements'),"REQ_CORP")]); }
async function sendMunicipalDetail(uid,l){ userStates[uid].data.currentFee="3L"; userStates[uid].data.currentType="Municipal"; userStates[uid].lastStep='Municipal Detail'; sendImageWithButtons(uid,POSTERS.municipal,getText(l,'municipalGoodChoice')+"\n\n"+getText(l,'municipalIntro'),[replyButton(getText(l,'benefits'),"BEN_MUNI"),replyButton(getText(l,'support'),"SUP_MUNI"),replyButton(getText(l,'requirements'),"REQ_MUNI")]); }
async function sendBusinessCenterDetail(uid,l){ userStates[uid].data.currentFee="BC"; userStates[uid].data.currentType="Business Center"; userStates[uid].lastStep='Business Center Detail'; sendImageWithButtons(uid,POSTERS.businessCenter,getText(l,'baseGoodChoice')+"\n\n"+getText(l,'businessCenterIntro'),[replyButton(getText(l,'benefits'),"BEN_BC"),replyButton(getText(l,'support'),"SUP_BC"),replyButton(getText(l,'requirements'),"REQ_BC")]); }
async function sendProcedure(uid,l,type="common"){ userStates[uid].lastStep='Procedure '+type; let text=""; if(type==="district") text=getText(l,'procedureDistrict'); else if(type==="bc") text=getText(l,'procedureBusinessCenter'); else text=getText(l,'procedureCommon'); sendImageWithButtons(uid,POSTERS.extra,text,[replyButton(getText(l,'viewTender'),"VIEW_TENDER"),replyButton(getText(l,'submit'),"SUBMIT_APP"),replyButton(getText(l,'backToEarn'),"OPT_EARN")]); }
async function sendBen(uid,l){ const type=userStates[uid].data.currentType||"District"; let text=""; if(type==="District") text=getText(l,'benDistrict'); else if(type==="Corporation") text=getText(l,'benCorp'); else text=getText(l,'benBusinessCenter'); sendImageWithButtons(uid,POSTERS.benefits,getText(l,'benGoodChoice')+"\n\n"+text,[replyButton(getText(l,'support'),"KNOW_SUP"),replyButton(getText(l,'requirements'),"KNOW_REQ"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE")]); }
async function sendBenBC(uid,l){ sendImageWithButtons(uid,POSTERS.businessCenter,getText(l,'benGoodChoice')+"\n\n"+getText(l,'businessCenterBenefits'),[replyButton(getText(l,'support'),"SUP_BC"),replyButton(getText(l,'requirements'),"REQ_BC"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE_BC")]); }
async function sendSup(uid,l){ sendImageWithButtons(uid,POSTERS.support,getText(l,'supGoodChoice')+"\n\n"+getText(l,'supText'),[replyButton(getText(l,'requirements'),"KNOW_REQ"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE"),replyButton(getText(l,'submit'),"SUBMIT_APP")]); }
async function sendReq(uid,l){ const type=userStates[uid].data.currentType||"District"; let text=(type==="Business Center")?getText(l,'reqBusinessCenter'):getText(l,'reqDistrict'); sendImageWithButtons(uid,POSTERS.requirements,getText(l,'reqGoodChoice')+"\n\n"+text,[replyButton(getText(l,'submit'),"SUBMIT_APP"),replyButton(getText(l,'knowProcedure'),"KNOW_PROCEDURE"),replyButton(getText(l,'emi'),"KNOW_EMI")]); }
async function askCorp(uid,l){ userStates[uid].lastStep='Corporation Check'; sendMessage(uid,getText(l,'corpQGoodChoice')+"\n\n"+getText(l,'corpQ'),[replyButton(getText(l,'yesCorp'),"CORP_YES"),replyButton(getText(l,'noCorp'),"CORP_NO")]); }
async function sendReady(uid,l){ const fee=userStates[uid].data.currentFee||"15L"; let text="",btn=""; if(fee==="15L"){text=getText(l,'ready15');btn=getText(l,'readyBtn15');}else if(fee==="7L"){text=getText(l,'ready7');btn=getText(l,'readyBtn7');}else if(fee==="3L"){text=getText(l,'ready3');btn=getText(l,'readyBtn3');}else{text=getText(l,'readyBC');btn=getText(l,'readyBtnBC');} userStates[uid].lastStep='Ready to Pay '+fee; sendMessage(uid,getText(l,'readyGoodChoice')+"\n\n"+text,[replyButton(btn,"READY_"+fee),replyButton(getText(l,'emi'),"KNOW_EMI")]); }
async function sendPay(uid,l){ userStates[uid].lastStep='Pay Rs.5000 - '+userStates[uid].data.currentFee; const to=formatTo(uid); const url=`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`; const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" }; enqueueSend(uid, async()=>{ await axios.post(url,{ messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"cta_url", body:{ text:getText(l,'payGoodChoice')+"\n\n"+getText(l,'payReg')+"\n\nTap below to pay Rs.5000:" }, action:{ name:"cta_url", parameters:{ display_text:"Pay Now - Rs.5000", url:RAZORPAY_ALL } } } },{headers}); console.log(`OUT PAY OK to ${to}`); setTimeout(()=>{ sendMessage(uid,"After payment - Need help? Tap to call:",[replyButton("I Paid - Rs.5000","PAY_DONE"), callButton(PHONES.displayB, PHONES.business)]); },7000); }, "Pay CTA", "PAY_CTA"); }
async function sendEMI(uid,l){ userStates[uid].lastStep='EMI Options'; sendMessage(uid,getText(l,'emiGoodChoice')+"\n\n"+getText(l,'emiOpt'),[replyButton(getText(l,'emi10'),"EMI_10"),replyButton(getText(l,'emi20'),"EMI_20"),replyButton(getText(l,'emiBusiness'),"EMI_BC")]); }
async function startLead(uid,l){ userStates[uid]={ lang:l, flow:'LEAD', step:1, data:userStates[uid].data, lastStep:'Lead - Name' }; sendMessage(uid,getText(l,'leadGoodChoice')+"\n\n"+getText(l,'leadAsk')+"\n\nName as per Aadhaar:"); }
async function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; s.lastStep='Lead - Place'; sendMessage(uid,"Place / District / State?"); }else if(s.step===2){ s.data.place=txt; s.step=3; s.lastStep='Lead - Occupation'; sendMessage(uid,getText(s.lang,'occQGoodChoice')+"\n\n"+getText(s.lang,'occQ'),[replyButton(getText(s.lang,'bus'),"OCC_BUS"),replyButton(getText(s.lang,'emp'),"OCC_EMP"),replyButton(getText(s.lang,'house'),"OCC_HOUSE")]); } }
async function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; s.lastStep='Agreement Date'; sendMessage(uid,getText(s.lang,'dateGoodChoice')+"\n\n"+getText(s.lang,'tender')+"\n"+LINKS.tenderDistrict+"\n\n"+getText(s.lang,'date'),[replyButton(getText(s.lang,'today'),"DATE_TODAY"),replyButton(getText(s.lang,'tom'),"DATE_TOMORROW")]); }
async function handleDate(uid,d){ const s=userStates[uid]; sendMessage(uid,getText(s.lang,'thanksGoodChoice')+getText(s.lang,'thanks')+" - "+s.data.name+" - "+d+" - Fee:"+s.data.currentFee); delete userStates[uid]; saveCRM(); }

async function onMessage(uid,txt,payload){
  let state=userStates[uid];
  const p=(payload||"").trim();
  const t=(txt||"").toLowerCase().trim();
  // V64 FIX: Log IN to CRM and Google Sheet IMMEDIATELY - Even if OUT fails later
  logCRM(uid,"IN",txt,p,state?.flow||"NEW",state?.lastStep||"First Message",{currentFee:state?.data?.currentFee,currentType:state?.data?.currentType});
  const isHi=["hi","hello","hey","hai","start","menu"].includes(t);
  if(p.startsWith("LANG_")){ const l=p.replace("LANG_","").toLowerCase(); userStates[uid]={ lang:l, flow:'MAIN', data:{ currentFee:"15L", currentType:"District" }, lastStep:'Main Menu' }; await sendMain(uid,l); return; }
  if(!state){ console.log(`FIRST MESSAGE from ${uid}`); await sendFirst(uid); return; }
  if(isHi){ const lastWelcome = recentWelcomes.get(uid); if(lastWelcome && Date.now()-lastWelcome < 15000){ console.log(`Ignoring HI ${uid}`); return; } console.log(`HI RESET -> ${uid}`); delete userStates[uid]; await sendFirst(uid); return; }
  const lang=state.lang||'en';
  if(p==="MAIN_MENU") return await sendMain(uid,lang);
  if(p==="OPT_MORE") return await sendMore(uid,lang);
  if(p==="OPT_RIDE") return await sendRide(uid,lang);
  if(p==="RIDE_BOOK") return await sendCust(uid,lang);
  if(p==="RIDE_ATTACH") return await sendDriv(uid,lang);
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
  if(p==="KNOW_TYPES") return await sendFranchiseeTypes(uid,lang);
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
  if(p==="VIDEO_DISTRICT") return await sendBen(uid,lang);
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
    if(value?.statuses?.[0]){ const st=value.statuses[0]; if(st.errors){ console.log(`STATUS ${st.status} to ${st.recipient_id} - ${JSON.stringify(st.errors)} - id:${st.id}`); if(JSON.stringify(st.errors).includes('130429')){ logCRM(st.recipient_id, "OUT_FAILED_130429_DELIVERY", `Delivery failed - Rate limit - ID:${st.id}`, "", "RATE_LIMIT", "Delivery Rate limit"); } } return; }
    const msg=value?.messages?.[0];
    if(msg){
      if(processedIds.has(msg.id)){ console.log(`Duplicate ${msg.id} ignored`); return; }
      processedIds.add(msg.id); setTimeout(()=>processedIds.delete(msg.id),60000);
      const uid=msg.from; const txt=msg.text?.body||""; const payload=msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || "";
      console.log("IN "+uid+" "+txt+" "+payload);
      await onMessage(uid,txt,payload||txt);
    }
  }catch(e){ console.log("webhook error", e.message); }
});

const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`V64 Google Sheets CRM + Failed Recording - ${crmLogs.length} logs - BOT ${BOT_OWN_NUMBER} - Sheet:${GOOGLE_SHEET_WEBHOOK ? 'SET' : 'NOT SET'} on ${PORT} - /crm`));
