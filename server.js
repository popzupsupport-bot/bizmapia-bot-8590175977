// ============================================================
// BIZMAPIA BOT V29.0 FINAL CORRECT - STEP BY STEP
// General Call: 97452 26642 | Business Call: 85901 75977
// First Message: ORIGINAL POSTER ONLY + Learn More (NO language)
// After Learn More: Language ONCE -> Main Menu -> No Loop
// Clean logs - No red - No test_user log
// ============================================================
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== CONFIG - REPLACE ONLY THIS POSTER LINK ==========
const RAZORPAY_5000 = "https://rzp.io/l/bizmapia5000";
const GENERAL_CALL = "919745226642";
const BUSINESS_CALL = "918590175977";

const LINKS = {
  welcomePoster: "https://i.ibb.co/YOUR-REAL-LINK-HERE.jpg", // <-- STEP1: PUT REAL LINK HERE
  customerRidePoster: "https://your-domain.com/customer.jpg",
  driverPoster: "https://your-domain.com/driver.jpg",
  deliveryPoster: "https://your-domain.com/delivery.jpg",
  districtVideo: "https://youtu.be/district-video",
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  tenderDistrict: "https://your-domain.com/tender.pdf"
};

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let userStates = {};
const processedIds = new Set();

// ========== HEALTH ==========
app.get('/', (req,res)=>res.status(200).send(`V29.0 FINAL CORRECT - LIVE ${new Date().toISOString()}`));
app.get('/health',(req,res)=>res.send('OK'));
app.get('/webhook',(req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']);
  res.sendStatus(403);
});

// ========== LANGUAGE ==========
function detectLang(t=""){ if(/[അ-ഹ]/.test(t)) return 'ml'; if(/[\u0900-\u097F]/.test(t)) return 'hi'; return 'en'; }

const ORIGINAL_WELCOME = `🌟 Welcome to BizMapia - ALL INDIA Super App!

✅ Cheapest Tex/Auto/Bike - 10% Discount
✅ Find 1000+ Local Businesses Near You
✅ Fast Parcel Delivery in 2 Hours
✅ Hotel/Doctor/Cinema Booking
✅ Earn 1-15 Lakhs Monthly with Franchiee

One App - All Services
👉 Tap Learn More to start in your language`;

const T = {
  en:{ selLang:"🌐 Select your Language / Tap to start in your language:", english:"English", malayalam:"മലയാളം", hindi:"हिंदी", selOpt:"👇 Tap to see all services:", ride:"🚕 Ride - Hailing", dir:"🏢 Business Directory", del:"📦 Online Delivery", book:"🏨 Online Booking", earn:"💰 Earn with Bizmapia", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach vehicle", custPost:"Book ride anywhere in India", drivPost:"Earn attaching vehicle", bookNow:"📲 Book Now", dlDriv:"📲 Download Driver App", delIntro:"Fast Parcel Delivery in 2 Hours", bookPar:"📦 Book parcel", regDel:"🛵 Register Delivery Agent", bookIntro:"Hotel/Doctor/Cinema Booking", bookRoom:"🏨 Book room", bookApp:"📅 Book appointment", bookCin:"🎬 Book Cinema", dlApp:"📲 Download app now", earnIntro:"Book slot for earning - Which type?", high:"💎 High earning", mod:"💼 Moderate earning", base:"🏠 Base opportunity", highIntro:"Great choice! Only one per district, respond earliest.", video:"▶️ Watch Video", watched:"Watched video?", yes:"✅ Yes", no:"❌ No", ben:"📘 Know Benefits", sup:"🤝 Know Support", req:"📋 Know Requirements", submit:"📝 Submit Application", emi:"💳 Know EMI", benText:"Benefits 1 - District top franchise % on all earnings\nBenefits 2 - Only you can contact Company", supText:"Support 1 - 12 months marketing\nSupport 2 - 6 months Rent\nSupport 3 - 6 months Salary", reqText:"Req 1 - >=90 Sqft room\nReq 2 - 1 staff\nReq 3 - PC/Laptop + Mobile + Internet", corpQ:"Does district contains corporation?", yesCorp:"Yes, Contains", noCorp:"No Corporation", ready15:"Ready to pay 15 Lakhs? Click Yes I am ready. For EMI click Know EMI", readyBtn:"✅ Yes, I am Ready - 15L", payReg:"Pay registration Rs.5000", payBtn:"💳 Pay Rs.5000", emiOpt:"5L down + 10M OR 5L + 20M", emi10:"Plan 1: 5L+10x1L", emi20:"Plan 2: 5L+20x50k", paidQ:"Paid registration?", willPay:"I will pay now", leadAsk:"Share details: Name, Place, District, State, Contact, Occupation", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"Download Tender and book agreement slot", date:"Select Date:", today:"Today", tom:"Tomorrow", week:"This Week", nextW:"Next Week", back:"Previous Menu", main:"Main Menu", thanks:"Thanks! Team will call 24h", callG:`📞 97452 26642`, callB:`📞 85901 75977`, learn:"Learn More"},
  ml:{ selLang:"🌐 ഭാഷ തിരഞ്ഞെടുക്കുക / Tap to start:", english:"English", malayalam:"മലയാളം", hindi:"हिंदी", selOpt:"👇 താഴെ നിന്ന് തിരഞ്ഞെടുക്കുക:", ride:"🚕 റൈഡ്", dir:"🏢 ഡയറക്ടറി", del:"📦 ഡെലിവറി", book:"🏨 ബുക്കിംഗ്", earn:"💰 വരുമാനം നേടൂ", rideOpt:"A. റൈഡ് ബുക്ക്\nB. വാഹനം അറ്റാച്ച്", bookRide:"റൈഡ് ബുക്ക്", attach:"വാഹനം അറ്റാച്ച്", custPost:"എവിടെയും റൈഡ് ബുക്ക്", drivPost:"വാഹനം അറ്റാച്ച് ചെയ്ത് സമ്പാദിക്കുക", bookNow:"📲 ബുക്ക് ചെയ്യുക", dlDriv:"📲 ഡ്രൈവർ ആപ്പ്", delIntro:"2 മണിക്കൂറിൽ പാഴ്സൽ", bookPar:"📦 പാഴ്സൽ ബുക്ക്", regDel:"🛵 ഏജന്റ് രജിസ്റ്റർ", bookIntro:"ഹോട്ടൽ/ഡോക്ടർ/സിനിമ ബുക്കിംഗ്", bookRoom:"🏨 റൂം ബുക്ക്", bookApp:"📅 അപ്പോയിന്റ്മെന്റ്", bookCin:"🎬 സിനിമ", dlApp:"📲 ആപ്പ് ഡൗൺലോഡ്", earnIntro:"1-15 ലക്ഷം വരുമാന അവസരം - ഏത് തരം?", high:"💎 ഉയർന്ന വരുമാനം", mod:"💼 മിതമായ", base:"🏠 ബേസ്", highIntro:"ശരിയായ തീരുമാനം! ഓരോ ജില്ലയിലും ഒരു അവസരം മാത്രം.", video:"▶️ വീഡിയോ കാണുക", watched:"വീഡിയോ കണ്ടോ?", yes:"✅ അതെ", no:"❌ ഇല്ല", ben:"📘 ആനുകൂല്യങ്ങൾ", sup:"🤝 പിന്തുണ", req:"📋 ആവശ്യകതകൾ", submit:"📝 അപേക്ഷ", emi:"💳 EMI", benText:"ആനുകൂല്യം 1 - ജില്ലാ ടോപ്പ് - എല്ലാ വരുമാനത്തിലും ശതമാനം\n2 - കമ്പനിയുമായി ബന്ധപ്പെടാൻ അവസരം", supText:"പിന്തുണ 1 - 12 മാസം മാർക്കറ്റിംഗ്\n2 - 6 മാസം വാടക\n3 - 6 മാസം ശമ്പളം", reqText:"ആവശ്യം 1 - 90 Sqft മുറി\n2 - 1 സ്റ്റാഫ്\n3 - PC/മൊബൈൽ", corpQ:"ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp:"അതെ, ഉണ്ട്", noCorp:"ഇല്ല", ready15:"15 ലക്ഷം തയ്യാറാണോ? Yes I am ready ക്ലിക്ക് ചെയ്യുക", readyBtn:"✅ തയ്യാറാണ് - 15L", payReg:"Rs.5000 അടയ്ക്കുക", payBtn:"💳 Rs.5000 അടയ്ക്കുക", emiOpt:"5L + 10M / 5L + 20M", emi10:"പ്ലാൻ 1: 5L+10x1L", emi20:"പ്ലാൻ 2: 5L+20x50k", paidQ:"അടച്ചോ?", willPay:"⏰ ഇപ്പോൾ അടയ്ക്കാം", leadAsk:"വിവരങ്ങൾ: പേര്, സ്ഥലം, ജില്ല, സംസ്ഥാനം, ഫോൺ, ജോലി", occQ:"ജോലി തിരഞ്ഞെടുക്കുക:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", busman:"ബിസിനസ്സ്മാൻ", tender:"📄 ടെൻഡർ ഡൗൺലോഡ്", date:"തീയതി തിരഞ്ഞെടുക്കുക:", today:"📅 ഇന്ന്", tom:"📅 നാളെ", week:"📅 ഈ ആഴ്ച", nextW:"📅 അടുത്ത ആഴ്ച", back:"⬅️ മുൻ മെനു", main:"🏠 പ്രധാന മെനു", thanks:"✅ നന്ദി! 24 മണിക്കൂറിൽ വിളിക്കും", callG:`📞 97452 26642`, callB:`📞 85901 75977`, learn:"കൂടുതൽ അറിയുക"},
  hi:{ selLang:"🌐 भाषा चुनें / Tap to start:", english:"English", malayalam:"മലയാളം", hindi:"हिंदी", selOpt:"👇 नीचे से चुनें:", ride:"🚕 राइड", dir:"🏢 डायरेक्टरी", del:"📦 डिलीवरी", book:"🏨 बुकिंग", earn:"💰 कमाएं", rideOpt:"A. राइड बुक\nB. वाहन अटैच", bookRide:"राइड बुक", attach:"वाहन अटैच", custPost:"कहीं भी राइड बुक", drivPost:"वाहन अटैच करके कमाएं", bookNow:"📲 बुक करें", dlDriv:"📲 ड्राइवर ऐप", delIntro:"2 घंटे में पार्सल", bookPar:"📦 पार्सल बुक", regDel:"🛵 एजेंट", bookIntro:"होटल/डॉक्टर/सिनेमा बुकिंग", bookRoom:"🏨 रूम बुक", bookApp:"📅 अपॉइंटमेंट", bookCin:"🎬 सिनेमा", dlApp:"📲 डाउनलोड", earnIntro:"1-15 लाख कमाने का अवसर - कौन सा?", high:"💎 उच्च कमाई", mod:"💼 मध्यम", base:"🏠 बेस", highIntro:"सही चुनाव! हर जिले में एक अवसर।", video:"▶️ वीडियो देखें", watched:"वीडियो देखा?", yes:"✅ हाँ", no:"❌ नहीं", ben:"📘 लाभ", sup:"🤝 सपोर्ट", req:"📋 आवश्यकताएं", submit:"📝 आवेदन", emi:"💳 EMI", benText:"लाभ 1 - जिला टॉप - सभी कमाई पर प्रतिशत\n2 - कंपनी से संपर्क", supText:"सपोर्ट 1 - 12 महीने मार्केटिंग\n2 - 6 महीने किराया\n3 - 6 महीने सैलरी", reqText:"आवश्यकता 1 - 90 Sqft\n2 - 1 स्टाफ\n3 - PC/मोबाइल", corpQ:"जिले में कॉर्पोरेशन है?", yesCorp:"हाँ", noCorp:"नहीं", ready15:"15 लाख तैयार हैं?", readyBtn:"✅ तैयार हूँ - 15L", payReg:"Rs.5000 भरें", payBtn:"💳 Rs.5000 भुगतान", emiOpt:"5L + 10M / 20M", emi10:"प्लान 1", emi20:"प्लान 2", paidQ:"भुगतान किया?", willPay:"⏰ अभी भुगतान", leadAsk:"जानकारी: नाम, जिला, फोन", occQ:"व्यवसाय:", bus:"बिजनेस", house:"गृहिणी", emp:"कर्मचारी", busman:"व्यवसायी", tender:"📄 टेंडर डाउनलोड", date:"तिथि चुनें:", today:"📅 आज", tom:"📅 कल", week:"📅 इस सप्ताह", nextW:"📅 अगले सप्ताह", back:"⬅️ पिछला", main:"🏠 मुख्य", thanks:"✅ धन्यवाद! 24h में कॉल", callG:`📞 97452 26642`, callB:`📞 85901 75977`, learn:"अधिक जानें"}
};
function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]; }

// ========== SEND - CLEAN NO RED ==========
async function sendMessage(uid, txt, btns=[]){
  if(!uid) return; const clean=String(uid).replace(/\D/g,""); if(clean.includes("test")||uid==="test_user"||!/^\d{10,15}$/.test(clean)) return;
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID){ console.log(`SEND ${clean}: ${txt.substring(0,80)}`); return; }
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=clean; if(to.length===10) to="91"+to;
    if(btns && btns.length>0){
      const urlBtn=btns.find(b=>b.url); const quick=btns.filter(b=>!b.url).slice(0,3);
      if(quick.length>0){
        const ab=quick.map(b=>({ type:"reply", reply:{ id:b.payload||b.title, title:b.title.substring(0,20) }}));
        await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:txt.substring(0,1024) }, action:{ buttons:ab }}}, {headers});
      }
      if(urlBtn) await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:`${urlBtn.title}: ${urlBtn.url}` }}, {headers});
    } else {
      await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:txt }}, {headers});
    }
  }catch(e){ console.error("WA:", e.response?.data||e.message); }
}
async function sendImage(uid, imgUrl, cap, btns=[]){
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return sendMessage(uid, cap, btns);
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    await axios.post(url, { messaging_product:"whatsapp", to, type:"image", image:{ link:imgUrl, caption:cap.substring(0,1024) }}, {headers});
    if(btns.length>0) setTimeout(()=>sendMessage(uid, "👇", btns), 700);
  }catch(e){
    console.log("Image failed, sending text fallback:", e.response?.data?.error?.message);
    sendMessage(uid, cap, btns);
  }
}

// ========== FLOWS ==========
function sendOriginalWelcome(uid){ sendImage(uid, LINKS.welcomePoster, ORIGINAL_WELCOME, [{ title:"Learn More", payload:"LEARN_MORE" }]); }
function sendLanguage(uid){ sendMessage(uid, T.en.selLang, [{ title:"English", payload:"LANG_EN" }, { title:"മലയാളം", payload:"LANG_ML" }, { title:"हिंदी", payload:"LANG_HI" }]); }
function sendMain(uid, lang){
  sendMessage(uid, getText(lang,'selOpt'), [
    { title:getText(lang,'ride'), payload:"OPT_RIDE" },
    { title:getText(lang,'earn'), payload:"OPT_EARN" },
    { title:getText(lang,'del'), payload:"OPT_DEL" }
  ]);
  setTimeout(()=>sendMessage(uid, "More:", [
    { title:getText(lang,'dir'), payload:"OPT_DIR" },
    { title:getText(lang,'book'), payload:"OPT_BOOK" },
    { title:getText(lang,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }
  ]), 600);
}
function sendRide(uid,l){ sendMessage(uid, getText(l,'rideOpt'), [{ title:getText(l,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(l,'attach'), payload:"RIDE_ATTACH" }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendCust(uid,l){ sendImage(uid, LINKS.customerRidePoster, getText(l,'custPost'), [{ title:getText(l,'bookNow'), payload:"BOOK_NOW", url:LINKS.customerApp }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendDriv(uid,l){ sendImage(uid, LINKS.driverPoster, getText(l,'drivPost'), [{ title:getText(l,'dlDriv'), payload:"DL_DRIV", url:LINKS.driverApp }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendDel(uid,l){ sendImage(uid, LINKS.deliveryPoster, getText(l,'delIntro'), [{ title:getText(l,'bookPar'), payload:"DEL_BOOK", url:LINKS.customerApp }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendBook(uid,l){ sendMessage(uid, getText(l,'bookIntro'), [{ title:getText(l,'bookRoom'), payload:"BOOK_ROOM" }, { title:getText(l,'bookApp'), payload:"BOOK_APP" }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendRoom(uid,l){ sendMessage(uid, "Book anywhere in India", [{ title:getText(l,'dlApp'), payload:"DL_APP", url:LINKS.customerApp }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendEarn(uid,l){ sendMessage(uid, getText(l,'earnIntro'), [{ title:getText(l,'high'), payload:"EARN_HIGH" }, { title:getText(l,'mod'), payload:"EARN_MOD" }, { title:getText(l,'base'), payload:"EARN_BASE" }]); }
function sendHigh(uid,l){ sendMessage(uid, `${getText(l,'highIntro')}\n${LINKS.districtVideo}`, [{ title:getText(l,'video'), payload:"WATCH_VIDEO", url:LINKS.districtVideo }, { title:getText(l,'ben'), payload:"KNOW_BEN" }, { title:getText(l,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); }
function sendBen(uid,l){ sendMessage(uid, getText(l,'benText'), [{ title:getText(l,'sup'), payload:"KNOW_SUP" }, { title:getText(l,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); }
function sendSup(uid,l){ sendMessage(uid, getText(l,'supText'), [{ title:getText(l,'req'), payload:"KNOW_REQ" }, { title:getText(l,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); }
function sendReq(uid,l){ sendMessage(uid, getText(l,'reqText'), [{ title:getText(l,'submit'), payload:"SUBMIT_APP" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }, { title:getText(l,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); }
function askCorp(uid,l){ sendMessage(uid, getText(l,'corpQ'), [{ title:getText(l,'yesCorp'), payload:"CORP_YES" }, { title:getText(l,'noCorp'), payload:"CORP_NO" }, { title:getText(l,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); }
function sendReady(uid,l){ sendMessage(uid, getText(l,'ready15'), [{ title:getText(l,'readyBtn'), payload:"READY_15L" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }, { title:getText(l,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); }
function sendPay(uid,l){ sendMessage(uid, getText(l,'payReg'), [{ title:getText(l,'payBtn'), payload:"PAY_REG", url:RAZORPAY_5000 }, { title:getText(l,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); setTimeout(()=>sendMessage(uid, getText(l,'paidQ'), [{ title:getText(l,'yes'), payload:"PAY_DONE" }, { title:getText(l,'willPay'), payload:"WILL_PAY", url:RAZORPAY_5000 }]), 5*60*1000); }
function sendEMI(uid,l){ sendMessage(uid, getText(l,'emiOpt'), [{ title:getText(l,'emi10'), payload:"EMI_10" }, { title:getText(l,'emi20'), payload:"EMI_20" }, { title:getText(l,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); }
function startLead(uid,l){ userStates[uid]={ lang:l, flow:'LEAD', step:1, data:{}, lang:l }; sendMessage(uid, getText(l,'leadAsk')+"\n\nStep 1/4: Name as per Aadhaar:", [{ title:getText(l,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); }
function handleLead(uid, txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; sendMessage(uid, "Step 2/4: Place/District/State?"); } else if(s.step===2){ s.data.place=txt; s.step=3; sendMessage(uid, getText(s.lang,'occQ'), [{ title:getText(s.lang,'bus'), payload:"OCC_BUS" }, { title:getText(s.lang,'emp'), payload:"OCC_EMP" }]); } }
function handleOcc(uid, occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; sendMessage(uid, getText(s.lang,'tender')+`\n${LINKS.tenderDistrict}\n\n${getText(s.lang,'date')}`, [{ title:getText(s.lang,'today'), payload:"DATE_TODAY" }, { title:getText(s.lang,'tom'), payload:"DATE_TOMORROW" }, { title:getText(s.lang,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); }
function handleDate(uid, d){ const s=userStates[uid]; if(!s) return; const final={ whatsapp:uid, name:s.data.name, place:s.data.place, occ:s.data.occ, date:d, lang:s.lang, time:new Date().toISOString() }; try{ fs.appendFileSync('/tmp/leads_backup.txt', JSON.stringify(final)+"\n"); }catch(e){} sendMessage(uid, `${getText(s.lang,'thanks')} - ${final.name} - ${d} - 📞 85901 75977`, [{ title:getText(s.lang,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); delete userStates[uid]; }

// ========== ROUTER - FIXED NO LOOP ==========
function onMessage(uid, txt, payload){
  let state=userStates[uid]; let lang=state?.lang||detectLang(txt+" "+payload);
  if(payload.startsWith("LANG_")){
    const l=payload.replace("LANG_","").toLowerCase(); userStates[uid]={ lang:l, flow:'MAIN', step:0, data:{}, lang:l }; sendMain(uid,l); return;
  }
  if(!state){
    // FIRST TIME USER SAYS Hi - SEND ONLY ORIGINAL WELCOME POSTER - NO LANGUAGE
    if(payload==="LEARN_MORE"){
      // After Learn More click, send language ONCE
      sendLanguage(uid); return;
    }
    userStates[uid]={ lang:'en', flow:'WELCOME', step:0, data:{}, lang:'en' };
    sendOriginalWelcome(uid); // <-- ONLY THIS FIRST
    return;
  }
  lang=state.lang;
  if(payload==="MAIN_MENU"||payload==="GO_BACK"){ sendMain(uid,lang); return; }
  if(payload==="OPT_RIDE"){ sendRide(uid,lang); return; }
  if(payload==="RIDE_BOOK"){ sendCust(uid,lang); return; }
  if(payload==="RIDE_ATTACH"){ sendDriv(uid,lang); return; }
  if(payload==="OPT_DEL"){ sendDel(uid,lang); return; }
  if(payload==="OPT_BOOK"||payload==="BOOK_ROOM"||payload==="BOOK_APP"){ sendRoom(uid,lang); return; }
  if(payload==="OPT_EARN"){ sendEarn(uid,lang); return; }
  if(payload==="EARN_HIGH"||payload==="EARN_MOD"||payload==="EARN_BASE"){ sendHigh(uid,lang); return; }
  if(payload==="WATCH_VIDEO"||payload==="KNOW_BEN"){ sendBen(uid,lang); return; }
  if(payload==="KNOW_SUP"){ sendSup(uid,lang); return; }
  if(payload==="KNOW_REQ"){ sendReq(uid,lang); return; }
  if(payload==="SUBMIT_APP"){ askCorp(uid,lang); return; }
  if(payload==="CORP_YES"||payload==="CORP_NO"){ sendReady(uid,lang); return; }
  if(payload==="READY_15L"){ sendPay(uid,lang); return; }
  if(payload==="KNOW_EMI"){ sendEMI(uid,lang); return; }
  if(payload==="EMI_10"||payload==="EMI_20"){ sendPay(uid,lang); return; }
  if(payload==="PAY_DONE"){ startLead(uid,lang); return; }
  if(payload.startsWith("OCC_")){ handleOcc(uid,payload); return; }
  if(payload.startsWith("DATE_")){ handleDate(uid,payload.replace("DATE_","")); return; }
  if(state.flow==='LEAD'){ handleLead(uid,txt); return; }
  sendMain(uid,lang);
}

// ========== WEBHOOK - CLEAN NO RED ==========
app.post('/webhook', async (req,res)=>{
  try{
    const entry=req.body.entry?.[0]?.changes?.[0]?.value; const msg=entry?.messages?.[0];
    if(msg){
      if(processedIds.has(msg.id)) return res.sendStatus(200); processedIds.add(msg.id); setTimeout(()=>processedIds.delete(msg.id),60000);
      const uid=msg.from; if(!uid||String(uid).includes("test")) return res.sendStatus(200);
      const txt=msg.text?.body||""; const pl=msg.interactive?.button_reply?.id||"";
      onMessage(uid,txt,pl||txt);
    } else {
      const uid=req.body.userId||req.body.from; if(!uid||String(uid).includes("test")) return res.sendStatus(200);
      const txt=req.body.text||""; const pl=req.body.payload||""; onMessage(uid,txt,pl);
    }
  }catch(e){ console.error("Webhook:", e.message); }
  res.sendStatus(200);
});

app.get('/leads',(req,res)=>{ try{ if(fs.existsSync('/tmp/leads_backup.txt')) res.type('text/plain').send(fs.readFileSync('/tmp/leads_backup.txt','utf8')); else res.send('No leads'); }catch(e){ res.send('Error'); } });

const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`V29.0 FINAL CORRECT LIVE ${PORT} - G:97452 26642 | B:85901 75977 - NO LOOP`));
