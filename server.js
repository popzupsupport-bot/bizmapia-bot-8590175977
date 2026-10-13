// ============================================================
// V58.0 FINAL LOCKED - V48.1 Base + Malayalam + Call Auto-Dialer + Hi Fix
// Base: Your V47 starred full T - No other change
// ============================================================
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const RAZORPAY_ALL = "https://rzp.io/rzp/mq0zG6mS";
const GENERAL_CALL = "919745226642";
const BUSINESS_CALL = "918590175977";
const GENERAL_TEL = "+919745226642";
const BUSINESS_TEL = "+918590175977";

const LINKS = {
  welcomePoster: "https://i.ibb.co/fGVVPC3n/fGVVPC3n.jpg",
  customerRidePoster: "https://i.ibb.co/204Ztdvh/204Ztdvh.jpg",
  driverPoster: "https://i.ibb.co/67jpyTSS/67jpyTSS.jpg",
  deliveryPoster: "https://i.ibb.co/kgCH9jKM/kgCH9jKM.jpg",
  businessPoster1: "https://i.ibb.co/1WkT9c8.jpg",
  businessPoster2: "https://i.ibb.co/Jg2fVh3/Jg2fVh3.jpg",
  extraPoster: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  supportPoster: "https://i.ibb.co/svWFBpYy/svWFBpYy.jpg",
  districtVideo: "https://youtu.be/bizmapia-district-video",
  customerApp: "https://play.google.com/store/apps/details?id=com.bizmapia.customer",
  driverApp: "https://play.google.com/store/apps/details?id=com.bizmapia.driver",
  tenderDistrict: "https://bizmapia.com/tender/district.pdf"
};

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

let userStates = {};
const reminderTimers = {};

app.get('/', (req,res)=>res.status(200).send(`V58.0 FINAL - ${RAZORPAY_ALL}`));
app.get('/webhook',(req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) return res.status(200).send(req.query['hub.challenge']);
  res.sendStatus(403);
});

const FIRST_BRIEF_CAPTION = `🌟 Welcome to Bizmapia – All India, 4-in-1 Services!

🚖 Affordable Taxi & Auto Rides
🏪 Discover 10,00,000+ Local Businesses
📦 Fast Parcel Delivery Within Hours
🎟️ Book Rooms, Appointments & Movie Tickets
💰 Explore Daily & Monthly Business Income Opportunities

🚀 One App. Four Services. Pan-India Opportunities!

👇 Explore Bizmapia in your preferred language to learn more about our services and opportunities.

👉 Please select your language:`;

// FULL T FROM V47 STARRED - 100% RESTORED
const T = {
  en:{
    selOpt:"Please select any one from below:", ride:"🚕 Ride - Hailing", dir:"🏢 Business Directory", del:"📦 Online Delivery", book:"🏨 Online Booking", earn:"💰 Earn with Bizmapia", more:"More Options",
    rideOpt:"A. Book a ride\nB. Attach your vehicle", bookRide:"Book a ride", attach:"Attach your vehicle",
    custPost:"🚕 Book your ride anywhere in India - Cheapest Taxi/Auto/Bike with 10% Discount\n\n📲 Download Customer App: "+LINKS.customerApp,
    drivPost:"🚗 Earn by attaching your vehicle - Earn daily Rs.1500-2500 with Bizmapia\n\n🚖 Taxi/Auto/Bike all accepted\n💰 Daily payout\n📍 Work in your own district",
    bookNow:"📲 Book Now", dlDriv:"📲 Download Driver App",
    delIntro:"📦 BizMapia online delivery - Fast Parcel Delivery in 2 Hours anywhere in India\n\n⚡ 2 Hours Delivery\n📍 Pan India\n💰 Low charges",
    bookPar:"📦 Book your parcel", regDel:"🛵 Register as Delivery Agent",
    bookIntro:"🏨 Online Booking - Hotel/Doctor/Cinema - Book anywhere in India\n\n🏨 Hotels - Best rates\n🩺 Doctor Appointments\n🎬 Movie Tickets",
    bookRoom:"🏨 Book room", dlApp:"📲 Download app",
    earnIntro:"You are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?", high:"💎 High earning", mod:"💼 Moderate", base:"🏠 Base",
    highIntro:"Great you have selected the right choice. Know details from video link below.\nNote: Only one opportunity in a district, respond earliest.\n\n💎 District Franchise - 15 Lakhs\n💼 Corporation - 7 Lakhs\n🏠 Municipal - 3 Lakhs", video:"▶️ Video Link", ben:"📘 Know Benefits", sup:"🤝 Know Support", req:"📋 Requirements", submit:"📝 Submit Application", emi:"💳 EMI options",
    benText:"🌟 BENEFITS - District Franchise\n\n✅ Benefits 1 - You are the district top level franchisee, percentage on all earnings in your district (Ride + Business Directory + Delivery + Booking)\n✅ Benefits 2 - Only you can contact Company directly, no middle man\n✅ Benefits 3 - Lifetime royalty income\n✅ Benefits 4 - Sub-franchise income (Corporation/Municipal/Business Center)\n✅ Benefits 5 - Your district, your business empire",
    supText:"🤝 SUPPORT - Company will provide\n🎯 Support 1 - 12 months marketing support (Digital + Offline + Posters)\n🏠 Support 2 - 6 months Rent contribution for your office\n👨‍💼 Support 3 - 6 months Staff salary support (1 staff)\n📱 Support 4 - Full training + CRM + App access\n📞 Support 5 - Dedicated business manager support",
    reqText:"📋 REQUIREMENTS\n\n🏢 Requirement 1 - >= 90 Sqft room in main town/city\n👨‍💼 Requirement 2 - 1 full time staff (Company will train)\n💻 Requirement 3 - PC/Laptop and Android Mobile with internet\n💰 Requirement 4 - Ready to invest for district opportunity\n📄 Requirement 5 - Aadhaar + PAN",
    corpQ:"Did your district contain corporation?\n\nIf your district HQ has Corporation (e.g. Ernakulam has Kochi Corporation), select Yes Corp. This changes your fee structure.", yesCorp:"Yes Corp", noCorp:"No Corp", ready15:"You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.\n\nThis is fully refundable as per tender terms if not selected. Only one per district.", readyBtn:"✅ Yes Ready - 15L",
    payReg:"Pay your registration fee Rs.5000 to proceed further. For District/Corporation/Municipal/Business Center\n\nThis Rs.5000 is part of 15L, not extra. Balance after verification.", payBtn:"💳 Pay Rs.5000", emiOpt:"Select EMI: Down 5 Lac + 10 Months / Down 5 Lac + 20 Months\n\nDown 5L to lock your district today, rest in EMI.", emi10:"5L + 10x1L", emi20:"5L + 20x50k",
    leadAsk:"Share contact: Name, Place, District, State, Contact, Occupation\n\nPlease send details line by line", occQ:"Select Occupation:", bus:"Business", house:"Housewife", emp:"Employee", busman:"Businessman", tender:"📄 Download Tender", date:"Select Agreement Date:", today:"📅 Today", tom:"📅 Tomorrow", thanks:"✅ Thanks! Team will call within 24h. Your district slot is now under verification.", callG:"📞 Call", callB:"📞 Call"
  },
  ml:{ selOpt:"താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക:", ride:"🚕 റൈഡ് - ടാക്സി/ഓട്ടോ", dir:"🏢 ബിസിനസ് ഡയറക്ടറി", del:"📦 ഓൺലൈൻ ഡെലിവറി", book:"🏨 ഓൺലൈൻ ബുക്കിംഗ്", earn:"💰 ബിസ്മാപിയയിൽ നിന്ന് വരുമാനം", more:"കൂടുതൽ ഓപ്ഷനുകൾ", rideOpt:"A. റൈഡ് ബുക്ക് ചെയ്യുക\nB. നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്യുക", bookRide:"റൈഡ് ബുക്ക്", attach:"വാഹനം അറ്റാച്ച്", custPost:"🚕 ഇന്ത്യയിൽ എവിടെയും റൈഡ് ബുക്ക് ചെയ്യൂ - ഏറ്റവും വിലകുറഞ്ഞ ടാക്സി/ഓട്ടോ/ബൈക്ക് 10% കിഴിവോടെ", drivPost:"🚗 നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്ത് ദിവസവും Rs.1500-2500 വരുമാനം നേടൂ - ബിസ്മാപിയയോടൊപ്പം", bookNow:"📲 ഇപ്പോൾ ബുക്ക് ചെയ്യുക", dlDriv:"📲 ഡ്രൈവർ ആപ്പ് ഡൗൺലോഡ്", delIntro:"📦 ബിസ്മാപിയ ഓൺലൈൻ ഡെലിവറി - ഇന്ത്യയിൽ എവിടെയും 2 മണിക്കൂറിൽ പാഴ്സൽ ഡെലിവറി", bookPar:"📦 പാഴ്സൽ ബുക്ക് ചെയ്യുക", regDel:"🛵 ഡെലിവറി ഏജന്റായി രജിസ്റ്റർ ചെയ്യുക", bookIntro:"🏨 ഓൺലൈൻ ബുക്കിംഗ് - ഹോട്ടൽ/ഡോക്ടർ/സിനിമ - ഇന്ത്യയിൽ എവിടെയും ബുക്ക് ചെയ്യൂ", bookRoom:"🏨 റൂം ബുക്ക് ചെയ്യുക", dlApp:"📲 ആപ്പ് ഡൗൺലോഡ്", earnIntro:"ഇന്ത്യയിൽ എവിടെ നിന്നും ബിസ്മാപിയയിൽ നിന്ന് വരുമാന അവസരം ബുക്ക് ചെയ്യാൻ പോകുകയാണ്. ഏത് തരം അവസരമാണ് നിങ്ങൾ തിരയുന്നത്?", high:"💎 ഉയർന്ന വരുമാനം", mod:"💼 മിതമായ വരുമാനം", base:"🏠 അടിസ്ഥാന വരുമാനം", highIntro:"നിങ്ങൾ ശരിയായ തിരഞ്ഞെടുപ്പ് നടത്തി. താഴെയുള്ള വീഡിയോ ലിങ്കിൽ നിന്ന് വിശദാംശങ്ങൾ അറിയുക.\nകുറിപ്പ്: ഒരു ജില്ലയിൽ ഒരു അവസരം മാത്രം, എത്രയും പെട്ടെന്ന് പ്രതികരിക്കുക.", video:"▶️ വീഡിയോ ലിങ്ക്", ben:"📘 ആനുകൂല്യങ്ങൾ അറിയുക", sup:"🤝 പിന്തുണ അറിയുക", req:"📋 ആവശ്യകതകൾ", submit:"📝 അപേക്ഷ സമർപ്പിക്കുക", emi:"💳 EMI ഓപ്ഷനുകൾ", benText:"🌟 ആനുകൂല്യങ്ങൾ - ജില്ലാ ഫ്രാഞ്ചൈസി\n\n✅ നിങ്ങൾ ജില്ലാ ടോപ്പ് ലെവൽ ഫ്രാഞ്ചൈസിയാണ്, എല്ലാ വരുമാനത്തിലും ശതമാനം\n✅ നിങ്ങൾക്ക് മാത്രമേ കമ്പനിയുമായി നേരിട്ട് ബന്ധപ്പെടാൻ കഴിയൂ\n✅ ജീവിതകാല റോയൽറ്റി വരുമാനം\n✅ സബ്-ഫ്രാഞ്ചൈസി വരുമാനം", supText:"🤝 പിന്തുണ - കമ്പനി നൽകും\n\n🎯 12 മാസം മാർക്കറ്റിംഗ് പിന്തുണ\n🏠 6 മാസം വാടക സഹായം\n👨‍💼 6 മാസം സ്റ്റാഫ് ശമ്പള പിന്തുണ", reqText:"📋 ആവശ്യകതകൾ\n\n🏢 90 Sqft മുറി\n👨‍💼 1 മുഴുവൻ സമയ ജീവനക്കാരൻ\n💻 PC/Laptop ഉം Android മൊബൈലും", corpQ:"നിങ്ങളുടെ ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?", yesCorp:"അതെ കോർപ്പറേഷൻ", noCorp:"ഇല്ല കോർപ്പറേഷൻ", ready15:"നിങ്ങൾ അപേക്ഷ സമർപ്പിക്കാൻ പോകുകയാണ്, 15 ലക്ഷം ജില്ലാ ഫ്രാഞ്ചൈസി ഫീസ് അടയ്ക്കാൻ തയ്യാറാണെന്ന് സ്ഥിരീകരിക്കുക.", readyBtn:"✅ തയ്യാറാണ് - 15L", payReg:"രജിസ്ട്രേഷൻ ഫീസ് Rs.5000 അടയ്ക്കുക. ജില്ല/കോർപ്പറേഷൻ/മുനിസിപ്പൽ/ബിസിനസ് സെന്ററിന്", payBtn:"💳 Rs.5000 അടയ്ക്കുക", emiOpt:"EMI തിരഞ്ഞെടുക്കുക: 5 ലക്ഷം + 10 മാസം / 5 ലക്ഷം + 20 മാസം", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ പങ്കിടുക: പേര്, സ്ഥലം, ജില്ല, സംസ്ഥാനം, കോൺടാക്ട്, തൊഴിൽ", occQ:"തൊഴിൽ തിരഞ്ഞെടുക്കുക:", bus:"ബിസിനസ്", house:"ഹൗസ് വൈഫ്", emp:"ജീവനക്കാരൻ", busman:"ബിസിനസ്സ്മാൻ", tender:"📄 ടെൻഡർ ഡൗൺലോഡ്", date:"കരാർ തീയതി തിരഞ്ഞെടുക്കുക:", today:"📅 ഇന്ന്", tom:"📅 നാളെ", thanks:"✅ നന്ദി! ടീം 24 മണിക്കൂറിനുള്ളിൽ വിളിക്കും", callG:"📞 Call", callB:"📞 Call" },
  hi:{ selOpt:"नीचे से कोई एक चुनें:", ride:"🚕 राइड - टैक्सी/ऑटो", dir:"🏢 बिजनेस डायरेक्टरी", del:"📦 ऑनलाइन डिलीवरी", book:"🏨 ऑनलाइन बुकिंग", earn:"💰 बिज़मापिया से कमाएं", more:"और विकल्प", rideOpt:"A. राइड बुक करें\nB. अपना वाहन अटैच करें", bookRide:"राइड बुक करें", attach:"वाहन अटैच करें", custPost:"🚕 भारत में कहीं भी राइड बुक करें - सबसे सस्ती टैक्सी/ऑटो/बाइक 10% छूट के साथ", drivPost:"🚗 अपना वाहन अटैच करके रोज Rs.1500-2500 कमाएं - बिज़मापिया के साथ", bookNow:"📲 अभी बुक करें", dlDriv:"📲 ड्राइवर ऐप डाउनलोड", delIntro:"📦 बिज़मापिया ऑनलाइन डिलीवरी - भारत में कहीं भी 2 घंटे में तेज़ पार्सल डिलीवरी", bookPar:"📦 पार्सल बुक करें", regDel:"🛵 डिलीवरी एजेंट के रूप में रजिस्टर करें", bookIntro:"🏨 ऑनलाइन बुकिंग - होटल/डॉक्टर/सिनेमा - भारत में कहीं भी बुक करें", bookRoom:"🏨 रूम बुक करें", dlApp:"📲 ऐप डाउनलोड", earnIntro:"आप भारत में कहीं से भी बिज़मापिया से कमाने के अवसर के लिए अपना स्लॉट बुक करने जा रहे हैं। आप किस तरह का अवसर देख रहे हैं?", high:"💎 उच्च कमाई", mod:"💼 मध्यम कमाई", base:"🏠 बेस कमाई", highIntro:"बहुत बढ़िया आपने सही चुनाव किया है। नीचे दिए गए वीडियो लिंक से विवरण जानें।\nनोट: एक जिले में केवल एक अवसर, सबसे पहले जवाब दें।", video:"▶️ वीडियो लिंक", ben:"📘 लाभ जानें", sup:"🤝 सपोर्ट जानें", req:"📋 आवश्यकताएं", submit:"📝 आवेदन जमा करें", emi:"💳 EMI विकल्प", benText:"🌟 लाभ - जिला फ्रैंचाइजी\n\n✅ आप जिले के टॉप लेवल फ्रैंचाइजी हैं, सभी कमाई पर प्रतिशत\n✅ केवल आप ही कंपनी से सीधे संपर्क कर सकते हैं\n✅ लाइफटाइम रॉयल्टी आय\n✅ सब-फ्रैंचाइजी आय", supText:"🤝 सपोर्ट - कंपनी देगी\n\n🎯 12 महीने मार्केटिंग सपोर्ट\n🏠 6 महीने किराया योगदान\n👨‍💼 6 महीने स्टाफ सैलरी सपोर्ट", reqText:"📋 आवश्यकताएं\n\n🏢 90 Sqft कमरा\n👨‍💼 1 फुल टाइम स्टाफ\n💻 PC/Laptop और Android मोबाइल", corpQ:"क्या आपके जिले में कॉर्पोरेशन है?", yesCorp:"हाँ कॉर्प", noCorp:"नहीं कॉर्प", ready15:"आप आवेदन जमा करने जा रहे हैं, पुष्टि करें कि आप 15 लाख जिला फ्रैंचाइजी फीस देने के लिए तैयार हैं।", readyBtn:"✅ हाँ तैयार - 15L", payReg:"अपनी रजिस्ट्रेशन फीस Rs.5000 का भुगतान करें। जिला/कॉर्पोरेशन/नगरपालिका/बिजनेस सेंटर के लिए", payBtn:"💳 Rs.5000 भुगतान", emiOpt:"EMI चुनें: 5 लाख + 10 महीने / 5 लाख + 20 महीने", emi10:"5L + 10x1L", emi20:"5L + 20x50k", leadAsk:"संपर्क साझा करें: नाम, स्थान, जिला, राज्य, संपर्क, व्यवसाय", occQ:"व्यवसाय चुनें:", bus:"बिजनेस", house:"गृहिणी", emp:"कर्मचारी", busman:"व्यवसायी", tender:"📄 टेंडर डाउनलोड", date:"समझौता तिथि चुनें:", today:"📅 आज", tom:"📅 कल", thanks:"✅ धन्यवाद! टीम 24 घंटे में कॉल करेगी", callG:"📞 Call", callB:"📞 Call" }
};
function getText(l,k){ return (T[l]||T.en)[k]||T.en[k]; }

async function sendMessage(uid, txt, btns=[]){
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return;
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    if(btns.length>0){
      const hasCall = btns.some(b=>b.url && b.url.startsWith('tel:'));
      let actionBtns;
      if(hasCall){
        actionBtns = btns.slice(0,3).map(b=>{
          if(b.url) return { type:"phone_number", phone_number: b.url.replace('tel:','').replace('+',''), text: b.title.substring(0,20) };
          return { type:"reply", reply:{ id:b.payload, title:b.title.substring(0,20) } };
        });
      } else {
        actionBtns = btns.slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload, title:b.title.substring(0,20) }}));
      }
      await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:txt.substring(0,1024) }, action:{ buttons:actionBtns }}}, {headers});
    } else {
      await axios.post(url, { messaging_product:"whatsapp", to, type:"text", text:{ body:txt }}, {headers});
    }
  }catch(e){ console.error("WA:", e.response?.data||e.message); }
}

async function sendImageHD(uid, imgUrl, cap, btns=[]){
  if(!WHATSAPP_TOKEN||!PHONE_NUMBER_ID) return sendMessage(uid, cap, btns);
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    await axios.post(url, { messaging_product:"whatsapp", to, type:"image", image:{ link:imgUrl, caption:cap.substring(0,1024) }}, {headers});
    if(btns.length>0){
      setTimeout(async ()=>{
        try{
          const hasCall = btns.some(b=>b.url);
          let actionBtns;
          if(hasCall){
            actionBtns = btns.slice(0,3).map(b=>{
              if(b.url) return { type:"phone_number", phone_number: b.url.replace('tel:','').replace('+',''), text: b.title.substring(0,20) };
              return { type:"reply", reply:{ id:b.payload, title:b.title.substring(0,20) } };
            });
          } else {
            actionBtns = btns.slice(0,3).map(b=>({ type:"reply", reply:{ id:b.payload, title:b.title.substring(0,20) }}));
          }
          await axios.post(url, { messaging_product:"whatsapp", to, type:"interactive", interactive:{ type:"button", body:{ text:"👇 Please tap to continue:" }, action:{ buttons:actionBtns }}}, {headers});
        }catch(e){}
      }, 1200);
    }
  }catch(e){ sendMessage(uid, cap, btns); }
}

function clearReminders(uid){ if(reminderTimers[uid]){ reminderTimers[uid].forEach(t=>clearTimeout(t)); delete reminderTimers[uid]; } }

// ONLY CHANGED PART: Malayalam fix + Call auto-dialer
function getReminderData(lastStep, lang){
  const isBusiness = ['Earn','Benefits','Support','Requirements','Corporation','Ready to Pay','Pay Rs','EMI','Lead','Agreement'].some(s=> lastStep.includes(s));
  const callBtn = { title:"📞 Call", payload: isBusiness?"CALL_B":"CALL_G", url: isBusiness? BUSINESS_TEL : GENERAL_TEL };

  if(lastStep==='Language Selection'){
    return {
      text:`🔔 You left without selecting language.\n\n❌ What you left: You started Bizmapia but didn't choose your chatting language, so you didn't see any service.\n\n➡️ Next step: Select your language (English / हिंदी / മലയാളം) to unlock all 4 services.\n\n⚡ Act immediately: Your session is waiting. Tap your language now to continue!`,
      buttons:[
        { title:"English", payload:"LANG_EN" },
        { title:"हिंदी", payload:"LANG_HI" },
        { title:"മലയാളം", payload:"LANG_ML" }
      ]
    };
  }

  let text=""; let buttons=[];
  switch(lastStep){
    case 'Main Menu': text=`🔔 You left at Main Menu without selecting any service.\n\n❌ Left: You didn't choose Ride, Earn, Delivery or Booking.\n\n➡️ Next: Choose one service to proceed.\n\n⚡ Act now: Your district slot is open, but only one per district. Tap immediately!`; buttons=[{ title:getText(lang,'ride'), payload:"OPT_RIDE" }, { title:getText(lang,'earn'), payload:"OPT_EARN" }, callBtn]; break;
    case 'More Options': text=`🔔 You left at More Options.`; buttons=[{ title:getText(lang,'del'), payload:"OPT_DEL" }, { title:getText(lang,'book'), payload:"OPT_BOOK" }, callBtn]; break;
    case 'Ride Selection': text=`🔔 You left at Ride Selection.`; buttons=[{ title:getText(lang,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(lang,'attach'), payload:"RIDE_ATTACH" }, callBtn]; break;
    case 'Book a Ride': text=`🔔 You left at Book a Ride without booking.`; buttons=[{ title:getText(lang,'bookNow'), payload:"BOOK_NOW" }, callBtn]; break;
    case 'Driver Attach - Earn Daily': text=`🔔 You left without attaching your vehicle - Earning pending!`; buttons=[{ title:getText(lang,'dlDriv'), payload:"DL_DRIV" }, callBtn]; break;
    case 'Delivery': text=`🔔 You left at Delivery.`; buttons=[{ title:getText(lang,'bookPar'), payload:"DEL_BOOK" }, { title:getText(lang,'regDel'), payload:"DEL_REG" }, callBtn]; break;
    case 'Room Booking': text=`🔔 You left at Online Booking.`; buttons=[{ title:getText(lang,'bookRoom'), payload:"BOOK_ROOM" }, callBtn]; break;
    case 'Earn Selection': text=`🔔 You left at Earning Opportunity without selecting income type.\n\n❌ Left: You didn't choose High/Moderate/Base earning.\n\n➡️ Next: Select High earning (15L District) to lock your district - Only 1 per district!\n\n⚡ Act immediately - District closing fast!`; buttons=[{ title:getText(lang,'high'), payload:"EARN_HIGH" }, { title:getText(lang,'mod'), payload:"EARN_MOD" }, callBtn]; break;
    case 'High Earning Details': text=`🔔 You left after seeing High Earning Video.`; buttons=[{ title:getText(lang,'ben'), payload:"KNOW_BEN" }, { title:getText(lang,'video'), payload:"KNOW_BEN" }, callBtn]; break;
    case 'Benefits': text=`🔔 You left at Benefits.`; buttons=[{ title:getText(lang,'sup'), payload:"KNOW_SUP" }, callBtn]; break;
    case 'Support - Rent + Staff + Marketing': text=`🔔 You left at Support.`; buttons=[{ title:getText(lang,'req'), payload:"KNOW_REQ" }, callBtn]; break;
    case 'Requirements': text=`🔔 You left at Requirements.`; buttons=[{ title:getText(lang,'submit'), payload:"SUBMIT_APP" }, { title:getText(lang,'emi'), payload:"KNOW_EMI" }, callBtn]; break;
    case 'Corporation Check': text=`🔔 You left at Corporation Check.`; buttons=[{ title:getText(lang,'yesCorp'), payload:"CORP_YES" }, { title:getText(lang,'noCorp'), payload:"CORP_NO" }, callBtn]; break;
    case 'Ready to Pay 15L': text=`🔔 You left at Ready to Pay 15L - District almost locked!`; buttons=[{ title:getText(lang,'readyBtn'), payload:"READY_15L" }, { title:getText(lang,'emi'), payload:"KNOW_EMI" }, callBtn]; break;
    case 'Pay Rs.5000': text=`🔔 URGENT: You left at Payment - District NOT locked yet!`; buttons=[{ title:"💳 Pay Now", payload:"READY_15L" }, callBtn]; break;
    case 'Pay Rs.5000 - Razorpay https://rzp.io/rzp/mq0zG6mS': text=`🔔 URGENT: You left at Payment - District NOT locked yet!`; buttons=[{ title:"💳 Pay Now", payload:"READY_15L" }, callBtn]; break;
    case 'EMI Selection': text=`🔔 You left at EMI Options.`; buttons=[{ title:getText(lang,'emi10'), payload:"EMI_10" }, { title:getText(lang,'emi20'), payload:"EMI_20" }, callBtn]; break;
    case 'Lead - Name': text=`🔔 You left at Lead Form - Payment done but details pending!`; buttons=[{ title:"▶️ Continue", payload:"RESUME" }, callBtn]; break;
    case 'Lead - Place': text=`🔔 You left at Place/District.`; buttons=[{ title:"▶️ Continue", payload:"RESUME" }, callBtn]; break;
    case 'Lead - Occupation': text=`🔔 You left at Occupation selection.`; buttons=[{ title:getText(lang,'bus'), payload:"OCC_BUS" }, { title:getText(lang,'emp'), payload:"OCC_EMP" }, callBtn]; break;
    case 'Agreement Date': text=`🔔 You left at Agreement Date.`; buttons=[{ title:getText(lang,'today'), payload:"DATE_TODAY" }, { title:getText(lang,'tom'), payload:"DATE_TOMORROW" }, callBtn]; break;
    default: text=`🔔 You left at ${lastStep} without completing.`; buttons=[{ title:"▶️ Continue", payload:"RESUME" }, callBtn];
  }
  return { text, buttons: buttons.slice(0,3) };
}

function scheduleReminders(uid, lang, flowType, lastStepName){
  clearReminders(uid);
  const isDriver = flowType==='DRIVER';
  const times = isDriver? [5*60*1000,30*60*1000,60*60*1000,4*60*60*1000,12*60*60*1000,24*60*60*1000] : [5*60*1000,10*60*1000,60*60*1000,8*60*60*1000,18*60*60*1000,24*60*60*1000];
  const labels = isDriver? ["5 min","30 min","1 hour","4 hour","12 hour","24 hour"] : ["5 min","10 min","1 hour","8 hour","18 hour","24 hour"];
  reminderTimers[uid]=[];
  times.forEach((delay, idx)=>{
    const tid=setTimeout(async ()=>{
      const state=userStates[uid]; if(!state) return;
      const data = getReminderData(lastStepName, state.lang||lang);
      const fullText = `⏰ Reminder (${labels[idx]}):\n\n${data.text}`;
      sendMessage(uid, fullText, data.buttons);
    }, delay);
    reminderTimers[uid].push(tid);
  });
}

function sendFirstBriefWithLang(uid){
  sendImageHD(uid, LINKS.welcomePoster, FIRST_BRIEF_CAPTION, [
    { title:"English", payload:"LANG_EN" },
    { title:"हिंदी", payload:"LANG_HI" },
    { title:"മലയാളം", payload:"LANG_ML" }
  ]);
  userStates[uid]={ lang:'en', flow:'WELCOME', lastStep:'Language Selection', data:{}, lang:'en' };
  scheduleReminders(uid,'en','GENERAL','Language Selection');
}

function sendMain(uid,l){ if(!userStates[uid]) userStates[uid]={}; userStates[uid].lang=l; userStates[uid].flow='MAIN'; userStates[uid].lastStep='Main Menu'; sendMessage(uid, getText(l,'selOpt'), [{ title:getText(l,'ride'), payload:"OPT_RIDE" }, { title:getText(l,'earn'), payload:"OPT_EARN" }, { title:getText(l,'more'), payload:"OPT_MORE" }]); scheduleReminders(uid,l,'GENERAL','Main Menu'); }
function sendMore(uid,l){ userStates[uid].lastStep='More Options'; sendMessage(uid, "More:", [{ title:getText(l,'del'), payload:"OPT_DEL" }, { title:getText(l,'book'), payload:"OPT_BOOK" }, { title:getText(l,'dir'), payload:"OPT_DIR" }]); scheduleReminders(uid,l,'GENERAL','More Options'); }
function sendRide(uid,l){ userStates[uid].lastStep='Ride Selection'; sendMessage(uid, getText(l,'rideOpt'), [{ title:getText(l,'bookRide'), payload:"RIDE_BOOK" }, { title:getText(l,'attach'), payload:"RIDE_ATTACH" }, { title:"📞 Call", payload:"CALL_G", url: GENERAL_TEL }]); scheduleReminders(uid,l,'GENERAL','Ride Selection'); }
function sendCust(uid,l){ userStates[uid].lastStep='Book a Ride'; sendImageHD(uid, LINKS.customerRidePoster, getText(l,'custPost'), [{ title:getText(l,'bookNow'), payload:"BOOK_NOW" }, { title:"📞 Call", payload:"CALL_G", url: GENERAL_TEL }]); scheduleReminders(uid,l,'GENERAL','Book a Ride'); }
function sendDriv(uid,l){ userStates[uid].lastStep='Driver Attach - Earn Daily'; userStates[uid].flow='DRIVER'; sendImageHD(uid, LINKS.driverPoster, getText(l,'drivPost'), [{ title:getText(l,'dlDriv'), payload:"DL_DRIV" }, { title:"📞 Call", payload:"CALL_G", url: GENERAL_TEL }]); scheduleReminders(uid,l,'DRIVER','Driver Attach - Earn Daily'); }
function sendDel(uid,l){ userStates[uid].lastStep='Delivery'; sendImageHD(uid, LINKS.deliveryPoster, getText(l,'delIntro'), [{ title:getText(l,'bookPar'), payload:"DEL_BOOK" }, { title:getText(l,'regDel'), payload:"DEL_REG" }, { title:"📞 Call", payload:"CALL_G", url: GENERAL_TEL }]); scheduleReminders(uid,l,'GENERAL','Delivery'); }
function sendRoom(uid,l){ userStates[uid].lastStep='Room Booking'; sendMessage(uid, getText(l,'bookIntro'), [{ title:getText(l,'bookRoom'), payload:"BOOK_ROOM" }, { title:"📞 Call", payload:"CALL_G", url: GENERAL_TEL }]); scheduleReminders(uid,l,'GENERAL','Room Booking'); }
function sendEarn(uid,l){ userStates[uid].lastStep='Earn Selection'; sendImageHD(uid, LINKS.businessPoster1, getText(l,'earnIntro'), [{ title:getText(l,'high'), payload:"EARN_HIGH" }, { title:getText(l,'mod'), payload:"EARN_MOD" }, { title:getText(l,'base'), payload:"EARN_BASE" }]); scheduleReminders(uid,l,'GENERAL','Earn Selection'); }
function sendHigh(uid,l){ userStates[uid].lastStep='High Earning Details'; sendImageHD(uid, LINKS.businessPoster2, getText(l,'highIntro'), [{ title:getText(l,'video'), payload:"KNOW_BEN" }, { title:getText(l,'ben'), payload:"KNOW_BEN" }, { title:"📞 Call", payload:"CALL_B", url: BUSINESS_TEL }]); scheduleReminders(uid,l,'GENERAL','High Earning Details'); }
function sendBen(uid,l){ userStates[uid].lastStep='Benefits'; sendImageHD(uid, LINKS.businessPoster1, getText(l,'benText'), [{ title:getText(l,'sup'), payload:"KNOW_SUP" }, { title:"📞 Call", payload:"CALL_B", url: BUSINESS_TEL }]); scheduleReminders(uid,l,'GENERAL','Benefits'); }
function sendSup(uid,l){ userStates[uid].lastStep='Support - Rent + Staff + Marketing'; sendImageHD(uid, LINKS.supportPoster, getText(l,'supText'), [{ title:getText(l,'req'), payload:"KNOW_REQ" }, { title:"📞 Call", payload:"CALL_B", url: BUSINESS_TEL }]); scheduleReminders(uid,l,'GENERAL','Support - Rent + Staff + Marketing'); }
function sendReq(uid,l){ userStates[uid].lastStep='Requirements'; sendImageHD(uid, LINKS.extraPoster, getText(l,'reqText'), [{ title:getText(l,'submit'), payload:"SUBMIT_APP" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }, { title:"📞 Call", payload:"CALL_B", url: BUSINESS_TEL }]); scheduleReminders(uid,l,'GENERAL','Requirements'); }
function askCorp(uid,l){ userStates[uid].lastStep='Corporation Check'; sendMessage(uid, getText(l,'corpQ'), [{ title:getText(l,'yesCorp'), payload:"CORP_YES" }, { title:getText(l,'noCorp'), payload:"CORP_NO" }, { title:"📞 Call", payload:"CALL_B", url: BUSINESS_TEL }]); scheduleReminders(uid,l,'GENERAL','Corporation Check'); }
function sendReady(uid,l){ userStates[uid].lastStep='Ready to Pay 15L'; sendMessage(uid, getText(l,'ready15'), [{ title:getText(l,'readyBtn'), payload:"READY_15L" }, { title:getText(l,'emi'), payload:"KNOW_EMI" }, { title:"📞 Call", payload:"CALL_B", url: BUSINESS_TEL }]); scheduleReminders(uid,l,'GENERAL','Ready to Pay 15L'); }

async function sendPay(uid,l){
  userStates[uid].lastStep='Pay Rs.5000';
  try{
    const url=`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const headers={ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" };
    let to=String(uid).replace(/\D/g,""); if(to.length===10) to="91"+to;
    await axios.post(url, {
      messaging_product:"whatsapp", to, type:"interactive",
      interactive:{
        type:"cta_url",
        header:{ type:"text", text:"💳 Secure Payment" },
        body:{ text:`${getText(l,'payReg')}\n\n👇 Tap below button to pay Rs.5000:` },
        footer:{ text:"BizMapia Secure Payment via Razorpay" },
        action:{ name:"cta_url", parameters:{ display_text:"💳 Pay Now - Rs.5000", url: RAZORPAY_ALL } }
      }
    }, {headers});
    setTimeout(async ()=>{
      await axios.post(url, {
        messaging_product:"whatsapp", to, type:"interactive",
        interactive:{ type:"button", body:{ text:"After payment, tap below:" },
          action:{ buttons:[
            { type:"reply", reply:{ id:"PAY_DONE", title:"✅ I Paid - Rs.5000" } },
            { type:"phone_number", phone_number: BUSINESS_CALL, text:"📞 Call" }
          ]}
        }
      }, {headers});
    }, 1500);
    scheduleReminders(uid,l,'GENERAL','Pay Rs.5000 - Razorpay '+RAZORPAY_ALL);
  }catch(e){ sendMessage(uid, `${getText(l,'payReg')}\n${RAZORPAY_ALL}`, [{ title:"✅ I Paid", payload:"PAY_DONE" }]); }
}

function sendEMI(uid,l){ userStates[uid].lastStep='EMI Options'; sendMessage(uid, getText(l,'emiOpt'), [{ title:getText(l,'emi10'), payload:"EMI_10" }, { title:getText(l,'emi20'), payload:"EMI_20" }, { title:"📞 Call", payload:"CALL_B", url: BUSINESS_TEL }]); scheduleReminders(uid,l,'GENERAL','EMI Selection'); }
function startLead(uid,l){ clearReminders(uid); userStates[uid]={ lang:l, flow:'LEAD', step:1, data:{}, lastStep:'Lead - Name', lang:l }; sendMessage(uid, getText(l,'leadAsk')+"\n\nName as per Aadhaar:"); scheduleReminders(uid,l,'GENERAL','Lead - Name'); }
function handleLead(uid,txt){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=txt; s.step=2; s.lastStep='Lead - Place'; sendMessage(uid, "Place / District / State?"); scheduleReminders(uid,s.lang,'GENERAL','Lead - Place'); } else if(s.step===2){ s.data.place=txt; s.step=3; s.lastStep='Lead - Occupation'; sendMessage(uid, getText(s.lang,'occQ'), [{ title:getText(s.lang,'bus'), payload:"OCC_BUS" }, { title:getText(s.lang,'emp'), payload:"OCC_EMP" }, { title:getText(s.lang,'house'), payload:"OCC_HOUSE" }]); scheduleReminders(uid,s.lang,'GENERAL','Lead - Occupation'); } }
function handleOcc(uid,occ){ const s=userStates[uid]; s.data.occ=occ; s.step=4; s.lastStep='Agreement Date'; sendMessage(uid, `${getText(s.lang,'tender')}\n${LINKS.tenderDistrict}\n\n${getText(s.lang,'date')}`, [{ title:getText(s.lang,'today'), payload:"DATE_TODAY" }, { title:getText(s.lang,'tom'), payload:"DATE_TOMORROW" }, { title:"📞 Call", payload:"CALL_B", url: BUSINESS_TEL }]); scheduleReminders(uid,s.lang,'GENERAL','Agreement Date'); }
function handleDate(uid,d){ const s=userStates[uid]; clearReminders(uid); sendMessage(uid, `${getText(s.lang,'thanks')} - ${s.data.name} - ${d}`); delete userStates[uid]; }

function onMessage(uid,txt,payload){
  let state=userStates[uid]; const p=(payload||"").trim(); const lowerTxt=(txt||"").toLowerCase().trim();
  const isHi = ["hi","hello","hey","hai","hii","start","menu"].includes(lowerTxt);

  if(p.startsWith("LANG_")){
    const l=p.replace("LANG_","").toLowerCase();
    userStates[uid]={ lang:l, flow:'MAIN', data:{}, lastStep:'Main Menu', lang:l };
    sendMain(uid,l); return;
  }
  if(!state){
    sendFirstBriefWithLang(uid); return;
  }
  if(isHi){
    // Hi = text only, guaranteed reply (no poster resend)
    const data = getReminderData('Language Selection','en');
    sendMessage(uid, `👋 Hi! Welcome back!\n\nYou left without selecting language. Tap your language to unlock all 4 services.`, data.buttons);
    return;
  }
  if(p==="RESUME"){
    const data = getReminderData(state.lastStep, state.lang, state.flow);
    sendMessage(uid, `Resuming from ${state.lastStep}...\n\n${data.text}`, data.buttons);
    return;
  }
  if(state.flow==='WELCOME' &&!p.startsWith("LANG_")){
    const data = getReminderData('Language Selection', state.lang, 'GENERAL');
    sendMessage(uid, `${data.text}`, data.buttons);
    return;
  }
  if(!p && lowerTxt && state.flow!=='LEAD'){
    const data = getReminderData(state.lastStep, state.lang, state.flow);
    sendMessage(uid, `${data.text}`, data.buttons);
    return;
  }
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
    if(msg){
      const uid=msg.from; const txt=msg.text?.body||""; const pl=msg.interactive?.button_reply?.id||"";
      onMessage(uid,txt,pl||txt);
    } else {
      const uid=req.body.userId||req.body.from; if(!uid||String(uid).includes("test")) return res.sendStatus(200);
      const txt=req.body.text||""; const pl=req.body.payload||""; onMessage(uid,txt,pl);
    }
  }catch(e){ console.error(e.message); }
  res.sendStatus(200);
});

app.listen(process.env.PORT||10000,'0.0.0.0',()=>console.log(`V58.0 FINAL - ${RAZORPAY_ALL}`));
