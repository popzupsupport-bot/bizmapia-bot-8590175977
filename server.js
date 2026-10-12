// ============================================================
// BIZMAPIA BOT V31.0 FINAL - 5:45PM PERFECT CODE + YOUR REQUIREMENTS
// First Reply EXACT as 5:54 PM Screenshot - No loop - No double language
// General Call: 97452 26642 | Business Call: 85901 75977
// Malayalam 25 corrections + Persistent Lang + Clean Logs
// Deploy Time: Based on 5:45PM perfect deploy
// ============================================================
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const RAZORPAY_5000 = "https://rzp.io/l/bizmapia5000";
const GENERAL_CALL = "919745226642"; // All general calling
const BUSINESS_CALL = "918590175977"; // Business opportunity only

const LINKS = {
  // USE YOUR ORIGINAL POSTER FROM 5:54 PM - Upload this file to public link
  // Your original file: wa_image_8231549747661799433 / wa_image_4764987674057763807 cropped
  welcomePoster: "https://i.ibb.co/YOUR-ORIGINAL-POSTER-LINK.jpg", // <-- Put real link here
  customerRidePoster: "https://your-domain.com/customer.jpg",
  driverPoster: "https://your-domain.com/driver.jpg",
  deliveryPoster: "https://your-domain.com/delivery.jpg",
  districtVideo: "https://youtu.be/your-district-video",
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  tenderDistrict: "https://your-domain.com/tender/district.pdf"
};

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let userStates = {};
const processedIds = new Set();

app.get('/', (req,res)=>res.status(200).send(`V31.0 5:45PM PERFECT RESTORED - ${new Date().toISOString()}`));
app.get('/webhook',(req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']);
  res.sendStatus(403);
});

function detectLang(t=""){ if(/[അ-ഹ]/.test(t)) return 'ml'; if(/[\u0900-\u097F]/.test(t)) return 'hi'; return 'en'; }

// EXACT CAPTION FROM YOUR 5:54 PM PERFECT FIRST REPLY
const ORIGINAL_FIRST_CAPTION = `🌟 Welcome to Bizmapia - ALL INDIA Super App!

✅ Cheapest Taxi/Auto/Bike - 10% Discount
✅ Find 1000+ Local Businesses Near You
✅ Fast Parcel Delivery in 2 Hours
✅ Hotel/Doctor/Cinema Booking
✅ Earn 1-15 Lakhs Monthly with Franchiee

One App - All Services
👉 Tap Learn More to start in your language`;

const T = {
  en:{ selLang:"🌐 Select your Language / Tap to start in your language:", selOpt:"Please select any one from below:", ride:"🚕 Ride - Hailing", dir:"🏢 Business Directory", del:"📦 Online Delivery", book:"🏨 Online Booking", earn:"💰 Earn with Bizmapia", rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle", custPost:"Book your ride anywhere in India", drivPost:"Earn by attaching your vehicle", bookNow:"📲 Book Now", dlDriv:"📲 Download Driver App", delIntro:"BizMapia online delivery expansion", bookPar:"📦 Book your parcel", regDel:"🛵 Register as Delivery Agent", bookIntro:"Online Booking Expansion", bookRoom:"🏨 Book room - Anywhere in India", dlApp:"📲 Download app now", earnIntro:"You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?", high:"💎 High earning opportunity", mod:"💼 Moderate earning opportunity", base:"🏠 Base opportunity", highIntro:"Great you have selected the right choice. Know details from video link below.\nAdditional notes: This opportunity is providing only one opportunity in a district, So be careful to learn and respond as earliest as possible.", video:"▶️ Click Now - Video", watched:"Have you watched our video?", yes:"✅ Yes", no:"❌ No", ben:"📘 Know Benefits", sup:"🤝 Know Support", req:"📋 Know Requirements", submit:"📝 Submit Application", emi:"💳 Know EMI options", benText:"Benefits 1 - You are the district top level franchisee who have the benefits of percentage on all earnings by Corporation/Municipal/Business Center from your district.\nBenefits 2 - You have only getting chance to contact Company", supText:"Support 1 - 12 months marketing advertisement support\nSupport 2 - 6 months Rent contribution from company\nSupport 3 - 6 months Staff salary contribution from company", reqText:"Requirement 1 - >= 90 Sqft room\nRequirement 2 - 1 full time staff\nRequirement 3 - PC/Laptop and Android Mobile with Internet", corpQ:"Please select your District belongs to which category, Did your district contains corporation?", yesCorp:"Yes, Contains Corporation", noCorp:"No Corporation", ready15:"You are going to submit your application right now, before that please click Yes I am ready confirming that you are ready to pay 15 Lakhs as District level franchise fee. If you want to know EMI options select Know EMI", readyBtn:"✅ Yes, I am Ready - 15L", payReg:"Pay your registration fee Rs.5000 to proceed further", payBtn:"💳 Pay Registration Fee - Rs.5000", emiOpt:"Select EMI: Down payment 5 Lac + remaining 10 Months / Down payment 5 Lac + remaining 20 Months", emi10:"Plan 1: 5L + 10x1L", emi20:"Plan 2: 5L + 20x50k", paidQ:"Have you paid your registration?", willPay:"⏰ I will pay now - Rs.5000", leadAsk:"Share your contact information: Name, Place, District, State, Contact number, Occupation", occQ:"Select your Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"📄 Download Tender document and book your agreement slot", date:"Select Agreement Date:", today:"📅 Today", tom:"📅 Tomorrow", week:"📅 This Week", nextW:"📅 Next Week", back:"⬅️ Previous Menu", main:"🏠 Main Menu", thanks:"✅ Thanks! Application received - Team will call within 24h", callG:`📞 97452 26642`, callB:`📞 85901 75977`, learn:"Learn More"},
  ml:{ selLang:"🌐 നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക:", selOpt:"താഴെ കൊടുത്തിരിക്കുന്നതിൽ നിന്ന് ഒന്ന് തിരഞ്ഞെടുക്കുക:", ride:"🚕 റൈഡ് - ഹെയ്‌ലിംഗ്", dir:"🏢 ബിസിനസ് ഡയറക്ടറി", del:"📦 ഓൺലൈൻ ഡെലിവറി", book:"🏨 ഓൺലൈൻ ബുക്കിംഗ്", earn:"💰 BizMapia-യിലൂടെ വരുമാനം നേടൂ", rideOpt:"A. റൈഡ് ബുക്ക് ചെയ്യുക\nB. നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്യുക", bookRide:"റൈഡ് ബുക്ക് ചെയ്യുക", attach:"വാഹനം അറ്റാച്ച് ചെയ്യുക", custPost:"കസ്റ്റമർ പോസ്റ്റർ - എവിടെയും റൈഡ് ബുക്ക് ചെയ്യാം", drivPost:"ഡ്രൈവർ പോസ്റ്റർ - വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം നേടൂ", bookNow:"📲 ഇപ്പോൾ ബുക്ക് ചെയ്യുക", dlDriv:"📲 ഡ്രൈവർ ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക", delIntro:"Bizmapia ഓൺലൈൻ ഡെലിവറി - പാഴ്സൽ എവിടെയും എത്തിക്കാം", bookPar:"📦 പാഴ്സൽ ബുക്ക് ചെയ്യുക", regDel:"🛵 ഡെലിവറി ഏജന്റായി രജിസ്റ്റർ ചെയ്യുക", bookIntro:"ഓൺലൈൻ ബുക്കിംഗ്", bookRoom:"🏨 റൂം ബുക്ക് ചെയ്യുക - ഇന്ത്യയിൽ എവിടെയും", dlApp:"📲 ആപ്പ് ഡൗൺലോഡ് ചെയ്യുക", earnIntro:"BizMapia-യിലൂടെ വരുമാനം നേടാനുള്ള സ്ലോട്ട് ബുക്ക് ചെയ്യാൻ പോകുകയാണ് - ഏത് തരം അവസരം?", high:"💎 ഉയർന്ന വരുമാന അവസരം", mod:"💼 മിതമായ വരുമാനം", base:"🏠 ബേസ് അവസരം", highIntro:"നിങ്ങൾ ശരിയായ തീരുമാനമാണ് എടുത്തത്! വീഡിയോ ലിങ്കിൽ നിന്ന് വിശദാംശങ്ങൾ അറിയുക.\n\nകുറിപ്പ്: ഓരോ ജില്ലയിലും ഒരു അവസരം മാത്രമേ ഉള്ളൂ, എത്രയും വേഗം പ്രതികരിക്കുക.", video:"▶️ വീഡിയോ കാണുക", watched:"വീഡിയോ കണ്ടോ?", yes:"✅ അതെ, കണ്ടു", no:"❌ ഇല്ല", ben:"📘 ആനുകൂല്യങ്ങൾ അറിയുക", sup:"🤝 പിന്തുണ അറിയുക", req:"📋 ആവശ്യകതകൾ", submit:"📝 അപേക്ഷ സമർപ്പിക്കുക", emi:"💳 EMI ഓപ്ഷൻ", benText:"ആനുകൂല്യം 1 - നിങ്ങൾ ജില്ലാ ടോപ്പ് ഫ്രാഞ്ചൈസി ആണ്, കോർപ്പറേഷൻ/മുനിസിപ്പൽ/ബിസിനസ് സെന്ററിൽ നിന്നുള്ള എല്ലാ വരുമാനത്തിലും ശതമാനം ലഭിക്കും.\nആനുകൂല്യം 2 - കമ്പനിയുമായി ബന്ധപ്പെടാൻ അവസരം നിങ്ങൾക്ക് മാത്രം.", supText:"പിന്തുണ 1 - 12 മാസം മാർക്കറ്റിംഗ്\nപിന്തുണ 2 - 6 മാസം വാടക സഹായം\nപിന്തുണ 3 - 6 മാസം സ്റ്റാഫ് ശമ്പള സഹായം", reqText:"ആവശ്യം 1 - >=90 Sqft മുറി\nആവശ്യം 2 - 1 ഫുൾ ടൈം സ്റ്റാഫ്\nആവശ്യം 3 - PC/ലാപ്ടോപ്പ് + ആൻഡ്രോയ്ഡ് + ഇന്റർനെറ്റ്", corpQ:"നിങ്ങളുടെ ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp:"അതെ, ഉണ്ട്", noCorp:"ഇല്ല", ready15:"15 ലക്ഷം ഫീസ് അടയ്ക്കാൻ തയ്യാറാണോ? തയ്യാറാണെങ്കിൽ 'അതെ, ഞാൻ തയ്യാറാണ്' ക്ലിക്ക് ചെയ്യുക. EMI അറിയണമെങ്കിൽ 'EMI ഓപ്ഷൻ' ക്ലിക്ക് ചെയ്യുക.", readyBtn:"✅ അതെ, തയ്യാറാണ് - 15L", payReg:"Rs.5000 രജിസ്ട്രേഷൻ ഫീസ് അടയ്ക്കുക", payBtn:"💳 Rs.5000 അടയ്ക്കുക", emiOpt:"ഡൗൺ 5 ലക്ഷം + 10 മാസം / ഡൗൺ 5 ലക്ഷം + 20 മാസം", emi10:"പ്ലാൻ 1: 5L + 10x1L", emi20:"പ്ലാൻ 2: 5L + 20x50k", paidQ:"രജിസ്ട്രേഷൻ അടച്ചോ?", willPay:"⏰ ഇപ്പോൾ അടയ്ക്കാം", leadAsk:"നിങ്ങളുടെ വിവരങ്ങൾ: പേര്, സ്ഥലം, ജില്ല, സംസ്ഥാനം, ഫോൺ, ജോലി", occQ:"ജോലി തിരഞ്ഞെടുക്കുക:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", busman:"ബിസിനസ്സ്മാൻ", tender:"📄 ടെൻഡർ ഡോക്യുമെന്റ് ഡൗൺലോഡ് ചെയ്യുക", date:"കരാർ തീയതി തിരഞ്ഞെടുക്കുക:", today:"📅 ഇന്ന്", tom:"📅 നാളെ", week:"📅 ഈ ആഴ്ച", nextW:"📅 അടുത്ത ആഴ്ച", back:"⬅️ മുൻ മെനുവിലേക്ക് പോകുക", main:"🏠 പ്രധാന മെനു", thanks:"✅ നന്ദി! 24 മണിക്കൂറിനുള്ളിൽ ടീം വിളിക്കും", callG:`📞 97452 26642`, callB:`📞 85901 75977`, learn:"കൂടുതൽ അറിയുക"},
  hi:{ selLang:"🌐 अपनी भाषा चुनें:", selOpt:"नीचे से एक चुनें:", ride:"🚕 राइड", dir:"🏢 डायरेक्टरी", del:"📦 डिलीवरी", book:"🏨 बुकिंग", earn:"💰 कमाएं", rideOpt:"A. राइड बुक करें\nB. वाहन अटैच करें", bookRide:"राइड बुक करें", attach:"वाहन अटैच करें", custPost:"राइड बुक करें - कहीं भी", drivPost:"वाहन अटैच करके कमाएं", bookNow:"📲 अभी बुक करें", dlDriv:"📲 ड्राइवर ऐप", delIntro:"ऑनलाइन डिलीवरी", bookPar:"📦 पार्सल बुक करें", regDel:"🛵 डिलीवरी एजेंट", bookIntro:"ऑनलाइन बुकिंग", bookRoom:"🏨 रूम बुक करें", dlApp:"📲 ऐप डाउनलोड", earnIntro:"BizMapia से कमाने का अवसर बुक करें", high:"💎 उच्च कमाई", mod:"💼 मध्यम कमाई", base:"🏠 बेस", highIntro:"सही चुनाव! वीडियो देखें। हर जिले में केवल एक अवसर।", video:"▶️ वीडियो देखें", watched:"वीडियो देखा?", yes:"✅ हाँ", no:"❌ नहीं", ben:"📘 लाभ जानें", sup:"🤝 सपोर्ट", req:"📋 आवश्यकताएं", submit:"📝 आवेदन", emi:"💳 EMI", benText:"लाभ 1 - जिला टॉप फ्रैंचाइज़ी, सभी कमाई पर प्रतिशत\nलाभ 2 - कंपनी से संपर्क का मौका", supText:"सपोर्ट 1 - 12 महीने मार्केटिंग\nसपोर्ट 2 - 6 महीने किराया\nसपोर्ट 3 - 6 महीने सैलरी", reqText:"आवश्यकता 1 - 90 Sqft\nआवश्यकता 2 - 1 स्टाफ\nआवश्यकता 3 - PC/लैपटॉप + मोबाइल", corpQ:"क्या जिले में कॉर्पोरेशन है?", yesCorp:"हाँ", noCorp:"नहीं", ready15:"15 लाख फीस के लिए तैयार हैं?", readyBtn:"✅ हाँ तैयार हूँ", payReg:"Rs.5000 रजिस्ट्रेशन भरें", payBtn:"💳 Rs.5000 भुगतान", emiOpt:"5 लाख डाउन + 10/20 महीने", emi10:"प्लान 1: 5L+10x1L", emi20:"प्लान 2: 5L+20x50k", paidQ:"भुगतान किया?", willPay:"⏰ अभी भुगतान", leadAsk:"जानकारी दें: नाम, स्थान, जिला, राज्य, फोन, व्यवसाय", occQ:"व्यवसाय चुनें:", bus:"बिजनेस", house:"गृहिणी", emp:"कर्मचारी", busman:"व्यवसायी", tender:"📄 टेंडर डाउनलोड करें", date:"तिथि चुनें:", today:"📅 आज", tom:"📅 कल", week:"📅 इस सप्ताह", nextW:"📅 अगले सप्ताह", back:"⬅️ पिछला मेनू", main:"🏠 मुख्य मेनू", thanks:"✅ धन्यवाद! 24h में कॉल", callG:`📞 97452 26642`, callB:`📞 85901 75977`, learn:"अधिक जानें"}
};
function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]; }

async function sendMessage(uid, txt, btns=[]){
  if(!uid) return; const clean=String(uid).replace(/\D/g,""); if(clean.includes("test")||uid==="test_user"||!/^\d{10,15}$/.test(clean)) return;
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID){ console.log(`SEND ${clean}: ${txt.substring(0,80)}`); return; }
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`; const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=clean; if(to.length===10) to="91"+to;
    if(btns && btns.length>0){
      const urlBtn=btns.find(b=>b.url); const quick=btns.filter(b=>!b.url).slice(0,3);
      if(quick.length>0){
        const ab=quick.map(b=>({ type:"reply", reply:{ id:b.payload||b.title, title:b.title.substring(0,20) }}));
        await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:txt.substring(0,1024) }, action:{ buttons:ab }}}, {headers});
      }
      if(urlBtn) await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:`${urlBtn.title}: ${urlBtn.url}` }}, {headers});
    } else { await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:txt }}, {headers}); }
  }catch(e){ console.error("WA:", e.response?.data||e.message); }
}
async function sendImage(uid, imgUrl, cap, btns=[]){
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return sendMessage(uid, cap, btns);
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`; const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    await axios.post(url, { messaging_product:"whatsapp", to, type:"image", image:{ link:imgUrl, caption:cap.substring(0,1024) }}, {headers});
    if(btns.length>0) setTimeout(()=>sendMessage(uid, "👇 Tap to see all services:", btns), 800);
  }catch(e){ sendMessage(uid, cap, btns); }
}

function sendOriginalFirst(uid){ sendImage(uid, LINKS.welcomePoster, ORIGINAL_FIRST_CAPTION, [{ title:getText('en','learn'), payload:"LEARN_MORE" }]); }
function sendLanguage(uid){ sendMessage(uid, T.en.selLang, [{ title:"English", payload:"LANG_EN" }, { title:"മലയാളം", payload:"LANG_ML" }, { title:"हिंदी", payload:"LANG_HI" }]); }
function sendMain(uid,l){
  sendMessage(uid, getText(l,'selOpt'), [{ title:getText(l,'ride'), payload:"OPT_RIDE" }, { title:getText(l,'earn'), payload:"OPT_EARN" }, { title:getText(l,'del'), payload:"OPT_DEL" }]);
  setTimeout(()=>sendMessage(uid, "More:", [{ title:getText(l,'dir'), payload:"OPT_DIR" }, { title:getText(l,'book'), payload:"OPT_BOOK" }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]), 600);
}
function sendRide(uid,l){ sendMessage(uid, getText(l,'rideOpt'), [{ title:getText(l,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(l,'attach'), payload:"RIDE_ATTACH" }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendCust(uid,l){ sendImage(uid, LINKS.customerRidePoster, getText(l,'custPost'), [{ title:getText(l,'bookNow'), payload:"BOOK_NOW", url:LINKS.customerApp }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendDriv(uid,l){ sendImage(uid, LINKS.driverPoster, getText(l,'drivPost'), [{ title:getText(l,'dlDriv'), payload:"DL_DRIV", url:LINKS.driverApp }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendDel(uid,l){ sendImage(uid, LINKS.deliveryPoster, getText(l,'delIntro'), [{ title:getText(l,'bookPar'), payload:"DEL_BOOK", url:LINKS.customerApp }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendBook(uid,l){ sendMessage(uid, getText(l,'bookIntro'), [{ title:getText(l,'bookRoom'), payload:"BOOK_ROOM" }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
function sendRoom(uid,l){ sendMessage(uid, "Book anywhere", [{ title:getText(l,'dlApp'), payload:"DL_APP", url:LINKS.customerApp }, { title:getText(l,'callG'), payload:"CALL_G", url:`tel:+${GENERAL_CALL}` }]); }
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
function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; sendMessage(uid, "Step 2/4: Place/District/State?"); } else if(s.step===2){ s.data.place=txt; s.step=3; sendMessage(uid, getText(s.lang,'occQ'), [{ title:getText(s.lang,'bus'), payload:"OCC_BUS" }, { title:getText(s.lang,'emp'), payload:"OCC_EMP" }]); } }
function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; sendMessage(uid, getText(s.lang,'tender')+`\n${LINKS.tenderDistrict}\n\n${getText(s.lang,'date')}`, [{ title:getText(s.lang,'today'), payload:"DATE_TODAY" }, { title:getText(s.lang,'tom'), payload:"DATE_TOMORROW" }]); }
function handleDate(uid,d){ const s=userStates[uid]; const final={ whatsapp:uid, name:s.data.name, place:s.data.place, occ:s.data.occ, date:d, lang:s.lang, time:new Date().toISOString() }; try{ fs.appendFileSync('/tmp/leads_backup.txt', JSON.stringify(final)+"\n"); }catch(e){} sendMessage(uid, `${getText(s.lang,'thanks')} - ${final.name} - ${d} - 📞 85901 75977`, [{ title:getText(s.lang,'callB'), payload:"CALL_B", url:`tel:+${BUSINESS_CALL}` }]); delete userStates[uid]; }

function onMessage(uid,txt,payload){
  let state=userStates[uid];
  if(payload.startsWith("LANG_")){
    const l=payload.replace("LANG_","").toLowerCase(); userStates[uid]={ lang:l, flow:'MAIN', data:{}, lang:l }; sendMain(uid,l); return;
  }
  if(!state){
    if(payload==="LEARN_MORE"){ sendLanguage(uid); return; }
    userStates[uid]={ lang:'en', flow:'WELCOME', data:{}, lang:'en' };
    sendOriginalFirst(uid); // EXACT as 5:54 PM perfect
    return;
  }
  const lang=state.lang;
  if(payload==="MAIN_MENU"||payload==="GO_BACK"){ sendMain(uid,lang); return; }
  if(payload==="OPT_RIDE"){ sendRide(uid,lang); return; }
  if(payload==="RIDE_BOOK"){ sendCust(uid,lang); return; }
  if(payload==="RIDE_ATTACH"){ sendDriv(uid,lang); return; }
  if(payload==="OPT_DEL"){ sendDel(uid,lang); return; }
  if(payload==="OPT_BOOK"||payload==="BOOK_ROOM"){ sendRoom(uid,lang); return; }
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
  }catch(e){ console.error(e.message); }
  res.sendStatus(200);
});

const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=>console.log(`V31.0 5:45PM PERFECT RESTORED - G:97452 26642 | B:85901 75977 on ${PORT}`));
