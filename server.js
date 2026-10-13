// ============================================================
// V39.1 PERMANENT - NO AUTO MESSAGE + SHEET LOGGING FIXED
// Same V39.0 flow + Sheet recording
// G: 97452 26642 | B: 85901 75977
// ============================================================
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const { google } = require('googleapis');
const app = express();
app.use(express.json());

const RAZORPAY_5000 = "https://rzp.io/l/bizmapia5000";
const GENERAL_CALL = "919745226642";
const BUSINESS_CALL = "918590175977";

const LINKS = { welcomePoster: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg", customerRidePoster: "https://i.ibb.co/204Ztdvh/204Ztdvh.jpg", driverPoster: "https://i.ibb.co/67jpyTSS/67jpyTSS.jpg", deliveryPoster: "https://i.ibb.co/kgCH9jKM/kgCH9jKM.jpg", businessPoster1: "https://i.ibb.co/1WkT9c8.jpg", businessPoster2: "https://i.ibb.co/Jg2fVh3/Jg2fVh3.jpg", extraPoster: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg", districtVideo: "https://youtu.be/bizmapia-district-video", customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer", driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver", tenderDistrict: "https://bizmapia.com/tender/district.pdf" };

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const SHEET_ID = process.env.SHEET_ID || "1RBPVy_prpB_niVDDa1PixFBy60X7Su11NUYj9ax-sEY";

let userStates = {};
const processedIds = new Set();

// ===== SHEET LOGGING - NEW ONLY THIS =====
async function appendSheet(row){
  try{
    if(!process.env.GOOGLE_CREDENTIALS) return;
    const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const auth = new google.auth.GoogleAuth({ credentials: creds, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    const sheets = google.sheets({ version: 'v4', auth });
    await sheets.spreadsheets.values.append({ spreadsheetId: SHEET_ID, range: "Sheet1!A:E", valueInputOption: "USER_ENTERED", resource: { values: [row] } });
    console.log(`[SHEET] ${row[1]} ${row[2]}`);
  }catch(e){ console.error("[SHEET FAIL]", e.message); }
}
// ===========================================

app.get('/', (req,res)=>res.status(200).send(`V39.1 WITH SHEET - G:97452 26642 | B:85901 75977 - ${new Date().toISOString()}`));
app.get('/webhook',(req,res)=>{ if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']); res.sendStatus(403); });

const FIRST_BRIEF_CAPTION = `🌟 Welcome to Bizmapia - ALL INDIA Super App!

✅ 🚕 Cheapest Taxi/Auto/Bike - 10% Discount
✅ 🏢 Find 1000+ Local Businesses Near You
✅ 📦 Fast Parcel Delivery in 2 Hours
✅ 🏨 Hotel/Doctor/Cinema Booking
✅ 💰 Earn 1-15 Lakhs Monthly with Franchiee

🚀 One App - All Services - All India Opportunity!

👇 Please select your chatting language to get further information in your chosen language.`;

const T = {
  en:{ selOpt:"Please select any one from below:", ride:"🚕 Ride - Hailing", dir:"🏢 Business Directory", del:"📦 Online Delivery", book:"🏨 Online Booking", earn:"💰 Earn with Bizmapia", more:"More Options", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle", custPost:"🚕 Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount", drivPost:"🚗 Earn by attaching your vehicle - Earn daily with Bizmapia", bookNow:"📲 Book Now", dlDriv:"📲 Download Driver App", delIntro:"📦 BizMapia online delivery - Fast Parcel Delivery in 2 Hours anywhere in India", bookPar:"📦 Book your parcel", regDel:"🛵 Register as Delivery Agent", bookIntro:"🏨 Online Booking - Hotel/Doctor/Cinema - Book anywhere in India", bookRoom:"🏨 Book room", dlApp:"📲 Download app", earnIntro:"You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?", high:"💎 High earning", mod:"💼 Moderate", base:"🏠 Base", highIntro:"Great you have selected the right choice. Know details from video link below.\nNote: Only one opportunity in a district, respond earliest.", video:"▶️ Video Link", ben:"📘 Know Benefits", sup:"🤝 Know Support", req:"📋 Requirements", submit:"📝 Submit Application", emi:"💳 EMI options", benText:"Benefits 1 - You are the district top level franchisee, percentage on all earnings.\nBenefits 2 - Only you can contact Company", supText:"Support 1 - 12 months marketing\nSupport 2 - 6 months Rent contribution\nSupport 3 - 6 months Staff salary", reqText:"Requirement 1 - >= 90 Sqft room\nRequirement 2 - 1 full time staff\nRequirement 3 - PC/Laptop and Android Mobile", corpQ:"Did your district contain corporation?", yesCorp:"Yes Corp", noCorp:"No Corp", ready15:"You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.", readyBtn:"✅ Yes Ready - 15L", payReg:"Pay your registration fee Rs.5000 to proceed further", payBtn:"💳 Pay Rs.5000", emiOpt:"Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"Share contact: Name, Place, District, State, Contact, Occupation", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"📄 Download Tender", date:"Select Agreement Date:", today:"📅 Today", tom:"📅 Tomorrow", thanks:"✅ Thanks! Team will call within 24h", callG:"📞 97452 26642", callB:"📞 85901 75977" },
  ml:{ selOpt:"തിരഞ്ഞെടുക്കുക:", ride:"🚕 റൈഡ്", dir:"🏢 ഡയറക്ടറി", del:"📦 ഡെലിവറി", book:"🏨 ബുക്കിംഗ്", earn:"💰 വരുമാനം", more:"കൂടുതൽ", rideOpt:"A. റൈഡ് ബുക്ക്\nB. വാഹനം അറ്റാച്ച്", bookRide:"ബുക്ക്", attach:"അറ്റാച്ച്", custPost:"റൈഡ് ബുക്ക് ചെയ്യാം", drivPost:"വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം", bookNow:"📲 ബുക്ക്", dlDriv:"📲 ഡ്രൈവർ ആപ്പ്", delIntro:"പാഴ്സൽ 2 മണിക്കൂറിൽ", bookPar:"📦 പാഴ്സൽ ബുക്ക്", regDel:"🛵 ഏജന്റ്", bookIntro:"ബുക്കിംഗ്", bookRoom:"🏨 റൂം ബുക്ക്", dlApp:"📲 ആപ്പ്", earnIntro:"വരുമാന അവസരം ബുക്ക് ചെയ്യുക", high:"💎 ഉയർന്ന", mod:"💼 മിതമായ", base:"🏠 ബേസ്", highIntro:"ശരിയായ തീരുമാനം! വീഡിയോ കാണുക", video:"▶️ വീഡിയോ", ben:"📘 ആനുകൂല്യം", sup:"🤝 പിന്തുണ", req:"📋 ആവശ്യം", submit:"📝 അപേക്ഷ", emi:"💳 EMI", benText:"ആനുകൂല്യം 1 - ടോപ്പ് ഫ്രാഞ്ചൈസി", supText:"പിന്തുണ 1 - 12 മാസം മാർക്കറ്റിംഗ്", reqText:"ആവശ്യം 1 - 90 Sqft", corpQ:"കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp:"അതെ", noCorp:"ഇല്ല", ready15:"15 ലക്ഷം ഫീസ് തയ്യാറാണോ?", readyBtn:"✅ തയ്യാർ - 15L", payReg:"Rs.5000 ഫീസ്", payBtn:"💳 Rs.5000", emiOpt:"5 ലക്ഷം + 10/20 മാസം", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"വിവരങ്ങൾ: പേര്, സ്ഥലം, ജില്ല", occQ:"ജോലി:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", busman:"ബിസിനസ്സ്മാൻ", tender:"📄 ടെൻഡർ", date:"തീയതി:", today:"📅 ഇന്ന്", tom:"📅 നാളെ", thanks:"✅ നന്ദി! 24h-ൽ വിളിക്കും", callG:"📞 97452 26642", callB:"📞 85901 75977" },
  hi:{ selOpt:"चुनें:", ride:"🚕 राइड", dir:"🏢 डायरेक्टरी", del:"📦 डिलीवरी", book:"🏨 बुकिंग", earn:"💰 कमाएं", more:"और विकल्प", rideOpt:"A. राइड बुक\nB. वाहन अटैच", bookRide:"बुक", attach:"अटैच", custPost:"राइड बुक करें", drivPost:"वाहन अटैच कमाएं", bookNow:"📲 बुक", dlDriv:"📲 ड्राइवर ऐप", delIntro:"डिलीवरी 2 घंटे में", bookPar:"📦 पार्सल बुक", regDel:"🛵 एजेंट", bookIntro:"बुकिंग", bookRoom:"🏨 रूम बुक", dlApp:"📲 ऐप", earnIntro:"कमाने का अवसर", high:"💎 उच्च", mod:"💼 मध्यम", base:"🏠 बेस", highIntro:"सही चुनाव! वीडियो देखें", video:"▶️ वीडियो", ben:"📘 लाभ", sup:"🤝 सपोर्ट", req:"📋 आवश्यकता", submit:"📝 आवेदन", emi:"💳 EMI", benText:"लाभ 1 - टॉप फ्रैंचाइज़ी", supText:"सपोर्ट 1 - 12 महीने", reqText:"आवश्यकता 1 - 90 Sqft", corpQ:"कॉर्पोरेशन है?", yesCorp:"हाँ", noCorp:"नहीं", ready15:"15 लाख फीस तैयार?", readyBtn:"✅ तैयार - 15L", payReg:"Rs.5000 फीस", payBtn:"💳 Rs.5000", emiOpt:"5 लाख + 10/20 महीना", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"जानकारी: नाम, स्थान", occQ:"व्यवसाय:", bus:"बिजनेस", house:"गृहिणी", emp:"कर्मचारी", busman:"व्यवसायी", tender:"📄 टेंडर", date:"तिथि:", today:"📅 आज", tom:"📅 कल", thanks:"✅ धन्यवाद!", callG:"📞 97452 26642", callB:"📞 85901 75977" }
};
function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]; }
async function sendMessage(uid, txt, btns=[]){ if(!uid) return; const clean=String(uid).replace(/\D/g,""); if(!/^\d{10,15}$/.test(clean)) return; if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return; try{ const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`; const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" }; let to=clean; if(to.length===10) to="91"+to; if(btns.length>0){ const quick=btns.filter(b=>!b.url).slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload||b.title, title:b.title.substring(0,20) }})); await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:txt.substring(0,1024) }, action:{ buttons:quick }}}, {headers}); } else { await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:txt }}, {headers}); } }catch(e){ console.error("WA:", e.response?.data||e.message); } }
async function sendImage(uid, imgUrl, cap, btns=[]){ if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return sendMessage(uid, cap, btns); try{ const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`; const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" }; let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to; if(btns && btns.length>0){ const quick = btns.filter(b=>!b.url).slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload||b.title, title:b.title.substring(0,20) }})); await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", header:{ type:"image", image:{ link:imgUrl } }, body:{ text:cap.substring(0,1024) }, action:{ buttons:quick } }}, {headers}); } else { await axios.post(url, { messaging_product:"whatsapp", to, type:"image", image:{ link:imgUrl, caption:cap.substring(0,1024) }}, {headers}); } }catch(e){ console.error("Img:", e.response?.data||e.message); sendMessage(uid, cap, btns); } }

function sendFirstBriefWithLang(uid){ sendImage(uid, LINKS.welcomePoster, FIRST_BRIEF_CAPTION, [ { title:"English", payload:"LANG_EN" }, { title:"हिंदी", payload:"LANG_HI" }, { title:"മലയാളം", payload:"LANG_ML" } ]); }
function sendMain(uid,l){ sendMessage(uid, getText(l,'selOpt'), [ { title:getText(l,'ride'), payload:"OPT_RIDE" }, { title:getText(l,'earn'), payload:"OPT_EARN" }, { title:getText(l,'more'), payload:"OPT_MORE" } ]); }
function sendMore(uid,l){ sendMessage(uid, "More:", [ { title:getText(l,'del'), payload:"OPT_DEL" }, { title:getText(l,'book'), payload:"OPT_BOOK" }, { title:getText(l,'dir'), payload:"OPT_DIR" } ]); }
function sendRide(uid,l){ sendMessage(uid, getText(l,'rideOpt'), [{ title:getText(l,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(l,'attach'), payload:"RIDE_ATTACH" }]); }
function sendCust(uid,l){ sendImage(uid, LINKS.customerRidePoster, getText(l,'custPost'), [{ title:getText(l,'bookNow'), payload:"BOOK_NOW" }, { title:getText(l,'callG'), payload:"CALL_G" }]); }
function sendDriv(uid,l){ sendImage(uid, LINKS.driverPoster, getText(l,'drivPost'), [{ title:getText(l,'dlDriv'), payload:"DL_DRIV" }, { title:getText(l,'callG'), payload:"CALL_G" }]); }
function sendDel(uid,l){ sendImage(uid, LINKS.deliveryPoster, getText(l,'delIntro'), [{ title:getText(l,'bookPar'), payload:"DEL_BOOK" }, { title:getText(l,'regDel'), payload:"DEL_REG" }]); }
function sendRoom(uid,l){ sendMessage(uid, getText(l,'bookIntro'), [{ title:getText(l,'bookRoom'), payload:"BOOK_ROOM" }, { title:getText(l,'callG'), payload:"CALL_G" }]); }
function sendEarn(uid,l){ sendImage(uid, LINKS.businessPoster1, getText(l,'earnIntro'), [{ title:getText(l,'high'), payload:"EARN_HIGH" }, { title:getText(l,'mod'), payload:"EARN_MOD" }, { title:getText(l,'base'), payload:"EARN_BASE" }]); }
function sendHigh(uid,l){ sendImage(uid, LINKS.businessPoster2, getText(l,'highIntro'), [{ title:getText(l,'video'), payload:"KNOW_BEN" }, { title:getText(l,'ben'), payload:"KNOW_BEN" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }
function sendBen(uid,l){ sendMessage(uid, getText(l,'benText'), [{ title:getText(l,'sup'), payload:"KNOW_SUP" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }
function sendSup(uid,l){ sendMessage(uid, getText(l,'supText'), [{ title:getText(l,'req'), payload:"KNOW_REQ" }, { title:getText(l,'callB'), payload:"CALL_B" }]); }
function sendReq(uid,l){ sendMessage(uid, getText(l,'reqText'), [{ title:getText(l,'submit'), payload:"SUBMIT_APP" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }]); }
function askCorp(uid,l){ sendMessage(uid, getText(l,'corpQ'), [{ title:getText(l,'yesCorp'), payload:"CORP_YES" }, { title:getText(l,'noCorp'), payload:"CORP_NO" }]); }
function sendReady(uid,l){ sendMessage(uid, getText(l,'ready15'), [{ title:getText(l,'readyBtn'), payload:"READY_15L" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }]); }
function sendPay(uid,l){ sendMessage(uid, `${getText(l,'payReg')}\n${RAZORPAY_5000}`, [{ title:getText(l,'payBtn'), payload:"PAY_DONE" }]); }
function sendEMI(uid,l){ sendMessage(uid, getText(l,'emiOpt'), [{ title:getText(l,'emi10'), payload:"EMI_10" }, { title:getText(l,'emi20'), payload:"EMI_20" }]); }
function startLead(uid,l){ userStates[uid]={ lang:l, flow:'LEAD', step:1, data:{}, lang:l }; sendMessage(uid, getText(l,'leadAsk')+"\n\nName as per Aadhaar:"); }
function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; sendMessage(uid, "Place / District / State?"); } else if(s.step===2){ s.data.place=txt; s.step=3; sendMessage(uid, getText(s.lang,'occQ'), [{ title:getText(s.lang,'bus'), payload:"OCC_BUS" }, { title:getText(s.lang,'emp'), payload:"OCC_EMP" }, { title:getText(s.lang,'house'), payload:"OCC_HOUSE" }]); } }
function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; sendMessage(uid, `${getText(s.lang,'tender')}\n${LINKS.tenderDistrict}\n\n${getText(s.lang,'date')}`, [{ title:getText(s.lang,'today'), payload:"DATE_TODAY" }, { title:getText(s.lang,'tom'), payload:"DATE_TOMORROW" }]); }
function handleDate(uid,d){ const s=userStates[uid]; sendMessage(uid, `${getText(s.lang,'thanks')} - ${s.data.name} - ${d}`); delete userStates[uid]; }

function onMessage(uid,txt,payload){
  let state=userStates[uid]; const p=(payload||"").trim(); const lower=(txt||"").toLowerCase().trim();

  // ===== SHEET LOGGING FOR EVERY INBOUND =====
  const time = new Date().toLocaleString('en-GB', {hour12:true});
  const date = new Date().toLocaleDateString('en-GB');
  const fullTime = `${date}, ${time}`;
  const stage = state?.flow || 'WELCOME';
  const logPayload = p || txt;
  appendSheet([fullTime, uid, logPayload, `CHAT_RECEIVED | ${logPayload} | INBOUND | Raw:${logPayload} stage:${stage}`, `${uid} CHAT_`]);
  // =============================================

  if(p.startsWith("LANG_")){ const l=p.replace("LANG_","").toLowerCase(); userStates[uid]={ lang:l, flow:'MAIN', data:{}, lang:l }; sendMain(uid,l); return; }
  if(!state){ userStates[uid]={ lang:'en', flow:'WELCOME', data:{}, lang:'en' }; sendFirstBriefWithLang(uid); return; }
  if(state.flow==='WELCOME'){ if(!p.startsWith("LANG_")){ return; } }
  const lang=state.lang;
  if(p==="OPT_MORE"){ sendMore(uid,lang); return; }
  if(p==="OPT_RIDE"){ sendRide(uid,lang); return; }
  if(p==="RIDE_BOOK"){ sendCust(uid,lang); return; }
  if(p==="RIDE_ATTACH"){ sendDriv(uid,lang); return; }
  if(p==="OPT_DEL"){ sendDel(uid,lang); return; }
  if(p==="OPT_BOOK"||p==="BOOK_ROOM"){ sendRoom(uid,lang); return; }
  if(p==="OPT_EARN"){ sendEarn(uid,lang); return; }
  if(p==="EARN_HIGH"||p==="EARN_MOD"||p==="EARN_BASE"){ sendHigh(uid,lang); return; }
  if(p==="KNOW_BEN"){ sendBen(uid,lang); return; }
  if(p==="KNOW_SUP"){ sendSup(uid,lang); return; }
  if(p==="KNOW_REQ"){ sendReq(uid,lang); return; }
  if(p==="SUBMIT_APP"){ askCorp(uid,lang); return; }
  if(p==="CORP_YES"||p==="CORP_NO"){ sendReady(uid,lang); return; }
  if(p==="READY_15L"){ sendPay(uid,lang); return; }
  if(p==="KNOW_EMI"){ sendEMI(uid,lang); return; }
  if(p==="EMI_10"||p==="EMI_20"){ sendPay(uid,lang); return; }
  if(p==="PAY_DONE"){ startLead(uid,lang); return; }
  if(p.startsWith("OCC_")){ handleOcc(uid,p); return; }
  if(p.startsWith("DATE_")){ handleDate(uid,p.replace("DATE_","")); return; }
  if(state.flow==='LEAD'){ handleLead(uid,txt); return; }
}

app.post('/webhook', async (req,res)=>{
  try{
    const entry=req.body.entry?.[0]?.changes?.[0]?.value; const msg=entry?.messages?.[0];
    if(msg){ if(processedIds.has(msg.id)) return res.sendStatus(200); processedIds.add(msg.id); setTimeout(()=>processedIds.delete(msg.id),60000); const uid=msg.from; if(!uid||String(uid).includes("test")) return res.sendStatus(200); const txt=msg.text?.body||""; const pl=msg.interactive?.button_reply?.id||""; onMessage(uid,txt,pl||txt); } else { const uid=req.body.userId||req.body.from; if(!uid||String(uid).includes("test")) return res.sendStatus(200); const txt=req.body.text||""; const pl=req.body.payload||""; onMessage(uid,txt,pl); }
  }catch(e){ console.error(e.message); }
  res.sendStatus(200);
});
const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`V39.1 WITH SHEET on ${PORT}`));
