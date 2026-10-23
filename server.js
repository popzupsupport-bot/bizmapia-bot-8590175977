// V99 FINAL - All 16 Changes Applied - Preserving EMI/Advance 600 Steps
// Phone ID 1382103134987818 - 95677 42507 - Changes 1-16 from user
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
let Redis = null;
try { Redis = require('ioredis'); } catch(e) { console.log('ioredis not installed'); }
let google = null;
try { google = require('googleapis').google; } catch(e) { console.log('googleapis not installed'); }

const app = express();
app.use(bodyParser.json());

const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '1382103134987818';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia_verify_2024';
const REDIS_URL = process.env.REDIS_URL;
const SHEET_ID = process.env.SHEET_ID || '1p_A3F_ie2JLguQTmn9WaJqFgNHNn_52B2Vuk8nRELto';
const PORT = process.env.PORT || 10000;

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia&pcampaignid=web_share';
const APP_STORE = 'https://apps.apple.com/in/app/bizmapia/id6761577245';
const WEBSITE = 'https://bizmapia.com/';
const EARN_LINK = 'https://bizmapia.com/earn';
const VIDEO_DISTRICT = 'https://bizmapia.com/video/district'; // Replace with real YouTube link
const VIDEO_CORP = 'https://bizmapia.com/video/corporation';
const VIDEO_CENTER = 'https://bizmapia.com/video/business-center';

const LINKS_V92 = {
  website: WEBSITE,
  driverApp: PLAY_STORE,
  tenderDistrict: "https://bizmapia.com/tender/district.pdf",
  businessLink: "https://bizmapia.com/business",
  earnLink: EARN_LINK,
  razorpay: "https://rzp.io/rzp/mq0zG6mS",
};

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

async function getState(uid){ if(redisReady){ try{ const v=await redis.get(`state:${uid}`); if(v) return JSON.parse(v);}catch{} } return memoryStore.get(uid)||{}; }
async function setState(uid,s){ memoryStore.set(uid,s); if(redisReady){ try{ await redis.set(`state:${uid}`, JSON.stringify(s), 'EX', 86400*7);}catch{} } }
async function getSheets(){ return null; }
async function saveToSheet(tab,row,isNew){ try{ console.log(`SHEET ${tab}`, row); }catch(e){} }

function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

// === MESSAGE BUILDERS ===
function textMessage(to,body){ return { messaging_product:'whatsapp', to, type:'text', text:{body:body.substring(0,4096)} }; }

function interactiveButton(to,body,buttons){
  const btns = buttons.slice(0,3).map(b=>({type:'reply', reply:{id:b.id, title:b.title.substring(0,20)}}));
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{type:'button', body:{text:body.substring(0,1024)}, action:{buttons:btns}} };
}

// NEW CTA BUTTONS - Android, iOS, Call, Website, Video - Change 1-14
function ctaButtons(to,body,ctaList){
  // ctaList: [{type:'url', title, url}, {type:'phone', title, phone}]
  const buttons = ctaList.slice(0,3).map(c=>{
    if(c.type==='url'){
      return { type:'cta_url', title:c.title.substring(0,20), cta_url:c.url };
    } else {
      return { type:'phone_number', title:c.title.substring(0,20), payload:c.phone };
    }
  });
  // WhatsApp Cloud API expects action.buttons with url / phone_number
  // Using type button with cta buttons
  return {
    messaging_product:'whatsapp', to, type:'interactive',
    interactive:{
      type:'button',
      body:{text:body.substring(0,1024)},
      action:{buttons: buttons.map(b=>{
        if(b.type==='cta_url') return {type:'cta_url', title:b.title, cta_url:b.cta_url};
        return {type:'phone_number', title:b.title, payload:b.payload};
      })}
    }
  };
}

function singleCta(to,body,btn){
  return ctaButtons(to,body,[btn]);
}

// === NEW - Repeat Last Step for random input (emoji, sticker, sentence, number, special char) - Fix #17 ===
async function repeatLastStep(uid, state, lang){
  const L = T[lang]||T.en;
  const last = state.lastStep||'';
  const sub = state.sub||'';
  console.log(`REPEAT LAST STEP for ${uid} - last:${last} sub:${sub}`);

  if(sub==='RIDE_BOOK' || last==='Book a Cab'){
    return await sendWithDelay(ctaButtons(uid, L.bookCab, [
      {type:'url', title:'Android', url:PLAY_STORE},
      {type:'url', title:'iOS', url:APP_STORE},
      {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
    ]));
  }
  if(sub==='RIDE_ATTACH' || last==='Attach Cab'){
    return await sendWithDelay(ctaButtons(uid, L.attachCab, [
      {type:'url', title:'Android', url:PLAY_STORE},
      {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
    ]));
  }
  if(sub==='BIZ_REGISTER' || last==='Register Business'){
    return await sendWithDelay(ctaButtons(uid, L.bizRegister, [
      {type:'url', title:'Register your Business', url:WEBSITE},
      {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
    ]));
  }
  if(sub==='BIZ_ADS' || last==='Start Advertising'){
    return await sendWithDelay(ctaButtons(uid, L.bizAds, [
      {type:'url', title:'Advertise Now', url:WEBSITE},
      {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
    ]));
  }
  if(sub==='DEL_ORDER' || last==='Order Stores'){
    return await sendWithDelay(ctaButtons(uid, L.delOrder, [
      {type:'url', title:'Android', url:PLAY_STORE},
      {type:'url', title:'iOS', url:APP_STORE},
      {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
    ]));
  }
  if(sub==='DEL_PARTNER' || last==='Delivery Partner'){
    return await sendWithDelay(ctaButtons(uid, L.delPartner, [
      {type:'url', title:'Android', url:PLAY_STORE},
      {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
    ]));
  }
  if(sub==='BOOK_ROOM' || last==='Book Rooms'){
    return await sendWithDelay(ctaButtons(uid, L.bookRoom, [
      {type:'url', title:'Android', url:PLAY_STORE},
      {type:'url', title:'iOS', url:APP_STORE},
      {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
    ]));
  }
  if(sub==='BOOK_APPOINT' || last==='Book Appointments'){
    return await sendWithDelay(ctaButtons(uid, L.bookAppoint, [
      {type:'url', title:'Android', url:PLAY_STORE},
      {type:'url', title:'iOS', url:APP_STORE},
      {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
    ]));
  }
  if(sub==='BOOK_MOVIE' || last==='Movie Tickets'){
    return await sendWithDelay(ctaButtons(uid, L.bookMovie, [
      {type:'url', title:'Android', url:PLAY_STORE},
      {type:'url', title:'iOS', url:APP_STORE},
      {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
    ]));
  }
  if(sub==='OPP_DISTRICT' || last.includes('High level') || last.includes('District')){
    await sendWithDelay(singleCta(uid, L.highIntroSingle, {type:'url', title:L.seeVideo, url:VIDEO_DISTRICT}));
    await delay(300);
    return await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}]));
  }
  if(sub==='OPP_CORP' || last.includes('Moderate level') || last.includes('Corp')){
    await sendWithDelay(singleCta(uid, L.moderateIntroSingle, {type:'url', title:L.seeVideo, url:VIDEO_CORP}));
    await delay(300);
    return await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}]));
  }
  if(sub==='OPP_CENTER' || last.includes('Base level') || last.includes('Center')){
    await sendWithDelay(singleCta(uid, L.baseIntroSingle, {type:'url', title:L.seeVideo, url:VIDEO_CENTER}));
    await delay(300);
    return await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}]));
  }
  if(last==='Benefits'){
    await sendWithDelay(textMessage(uid,L.benText));
    await delay(300);
    return await sendWithDelay(interactiveButton(uid,'Next:',[{id:'KNOW_SUP',title:L.supBtn},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`} ]));
  }
  if(last==='Support'){
    await sendWithDelay(textMessage(uid,L.supText));
    await delay(300);
    return await sendWithDelay(interactiveButton(uid,'Next:',[{id:'KNOW_REQ',title:L.reqBtn},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`} ]));
  }
  if(last==='Requirements'){
    await sendWithDelay(textMessage(uid,L.reqText));
    await delay(300);
    return await sendWithDelay(interactiveButton(uid,'Next:',[{id:'SUBMIT_APP',title:L.submitBtn},{id:'KNOW_EMI',title:L.emiBtn}]));
  }
  if(last.includes('Corp Check') || last.includes('Submit Application')){
    return await sendWithDelay(interactiveButton(uid,L.corpQ,[{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}]));
  }
  if(last.includes('Ready 15L')){
    return await sendWithDelay(interactiveButton(uid,L.ready15,[{id:'READY_15L',title:L.readyBtn},{id:'KNOW_EMI',title:L.emiBtn}]));
  }
  if(last.includes('Pay Rs5000') || last.includes('EMI Selected')){
    return await sendWithDelay(interactiveButton(uid,L.payReg,[{id:'PAY_DONE',title:L.payBtn},{id:'KNOW_EMI',title:L.emiBtn}]));
  }
  if(last.includes('EMI Options')){
    return await sendWithDelay(interactiveButton(uid,L.emiOpt,[{id:'EMI_10',title:L.emi10},{id:'EMI_20',title:L.emi20}]));
  }
  if(last.includes('Pay Done') || last.includes('Lead')){
    return await sendWithDelay(textMessage(uid,L.leadAsk));
  }
  if(last.includes('Occupation')){
    return await sendWithDelay(interactiveButton(uid,L.occQ,[{id:'OCC_BUSINESS',title:L.bus},{id:'OCC_HOUSE',title:L.house},{id:'OCC_EMP',title:L.emp}]));
  }
  if(last.includes('Date') || last.includes('Occupation')){
    return await sendWithDelay(interactiveButton(uid,L.dateQ,[{id:'DATE_TODAY',title:L.today},{id:'DATE_TOMORROW',title:L.tomorrow}]));
  }
  if(state.service){
    // fallback to last main category
    if(state.service==='SVC_RIDE') return await sendWithDelay(interactiveButton(uid, L.rideSelected, L.rideButtons));
    if(state.service==='SVC_BIZDIR') return await sendWithDelay(interactiveButton(uid, L.bizDirSelected, L.bizDirButtons));
    if(state.service==='SVC_DELIVERY') return await sendWithDelay(interactiveButton(uid, L.deliverySelected, L.deliveryButtons));
    if(state.service==='SVC_BOOKING') return await sendWithDelay(interactiveButton(uid, L.bookingSelected, L.bookingButtons));
    if(state.service==='SVC_OPP') return await sendWithDelay(interactiveButton(uid, L.oppSelected, L.oppButtons));
  }
  // Final fallback - main menu
  await sendWithDelay(interactiveButton(uid, L.mainMenu, L.services.slice(0,3)));
  await delay(300);
  await sendWithDelay(interactiveButton(uid, 'More services:-', L.services.slice(3,5)));
}


async function sendWithDelay(msg){
  const now = Date.now();
  if(now < blockUntil){ console.log(`BLOCKED till ${new Date(blockUntil)}`); return; }
  if(now - lastSendTime < 500){ await delay(500-(now-lastSendTime)); }
  lastSendTime = Date.now();
  try{
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;
    const res = await axios.post(url, msg, {headers:{Authorization:`Bearer ${WHATSAPP_TOKEN}`, 'Content-Type':'application/json'}});
    console.log(`OUT to ${msg.to} - ${msg.type}`, res.data.messages?.[0]?.id||'ok');
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

// === REMINDER FIX Change 12 & 13 - Deduplicate and Context Aware ===
function clearReminders(uid){
  for(let key of reminders.keys()){
    if(key.startsWith(uid+':')){ clearTimeout(reminders.get(key)); reminders.delete(key); }
  }
}
function scheduleReminder(uid, type, lang, ms){
  const key = `${uid}:${type}`;
  if(reminders.has(key)){ clearTimeout(reminders.get(key)); }
  const t = setTimeout(async()=>{
    reminders.delete(key);
    try{
      const state = await getState(uid);
      const L = T[lang]||T.en;
      console.log(`REMINDER ${type} to ${uid} lastStep=${state.lastStep} sub=${state.sub}`);
      if(type.startsWith('install:')){
        const sub = type.split(':')[1];
        // Context aware - Change 12
        if(sub.startsWith('OPP_') || sub.includes('Franchise') || state.service==='SVC_OPP'){
          // Franchise reminder - should show Benefits/Support/Requirements not ride
          const oppMsg = state.lastStep?.includes('District') ? L.highIntroSingle : state.lastStep?.includes('Corp') ? L.moderateIntroSingle : L.baseIntroSingle;
          // After video, remind with expand buttons
          await sendWithDelay(interactiveButton(uid, L.reminderFranchise, [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}]));
        } else {
          await sendWithDelay(interactiveButton(uid, L.haveInstalled1, [{id:'YES_ACTIVATE',title:L.yesActivate},{id:'NO_LATER',title:L.noLater}]));
        }
      } else if(type.startsWith('noLang')||type.startsWith('noService')){
        const L2 = T[lang]||T.en;
        await sendWithDelay(interactiveButton(uid, L2.welcome, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'Hindi'},{id:'LANG_ML',title:'Malayalam'}]));
      }
    }catch(e){ console.log('reminder error', e.message); }
  }, ms);
  reminders.set(key, t);
}

// === TRANSLATIONS - Change 16 Full Hindi/Malayalam ===
const T={
  en:{
    welcome:`Welcome to Bizmapia\nYou are in Indias first 4 in 1 service app platform\nPlease select your preferred language from below:-`,
    mainMenu:`Please click any one service from below to help you further:-`,
    services:[{id:'SVC_RIDE',title:'Ride Hailing'},{id:'SVC_BIZDIR',title:'Business Directory'},{id:'SVC_DELIVERY',title:'Online Delivery'},{id:'SVC_BOOKING',title:'Online Booking'},{id:'SVC_OPP',title:'Business Opportunity'}],
    noLang:`Sorry, You are not selected any Language.\n\nPlease select your preferred language from below:-`,
    noService:`You haven't selected any service yet.\n\nPlease click any one service from below:-`,
    rideSelected:`Great you are selected "Ride Hailing"\nBizmapia is the one and only platform giving all India Ride Hailing service without any boarder.\nPlease select any one option from below:-`,
    rideButtons:[{id:'RIDE_BOOK',title:'Book a Cab'},{id:'RIDE_ATTACH',title:'Attach Cab'}],
    // Change 1 - Book a Cab now buttons not raw links
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
    // Change 10 - Renamed buttons
    oppSelected:`Great you selected "Business Opportunity"\nBecome our service point and start earning. 3 levels of earning.\nYou are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?\nPlease select any one option from below:-`,
    oppButtons:[{id:'OPP_DISTRICT',title:'High level Income'},{id:'OPP_CORP',title:'Moderate level Income'},{id:'OPP_CENTER',title:'Base level Income'}],
    // Change 11 - Single message
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
    services:[{id:'SVC_RIDE',title:'Ride Hailing'},{id:'SVC_BIZDIR',title:'Business Directory'},{id:'SVC_DELIVERY',title:'Online Delivery'},{id:'SVC_BOOKING',title:'Online Booking'},{id:'SVC_OPP',title:'Business Opportunity'}],
    noLang:`क्षमा करें, आपने कोई भाषा नहीं चुनी।\n\nकृपया नीचे से अपनी पसंदीदा भाषा चुनें:-`,
    noService:`आपने अभी तक कोई सेवा नहीं चुनी।\n\nकृपया नीचे से कोई एक सेवा चुनें:-`,
    rideSelected:`बहुत बढ़िया आपने "Ride Hailing" चुना\nBizmapia पूरे भारत में बिना सीमा के राइड सेवा देने वाला एकमात्र प्लेटफॉर्म है।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    rideButtons:[{id:'RIDE_BOOK',title:'Book a Cab'},{id:'RIDE_ATTACH',title:'Attach Cab'}],
    bookCab:`बढ़िया विकल्प, आपने "Book a Cab" सेवा पर क्लिक किया।\nआपको आसपास से Two wheeler/Auto/Hatchback/Sedan/SUV/XUV/Ambulance किफायती दरों पर मिलेगा।\n\nनीचे क्लिक करके ऐप इंस्टॉल करें या हमें कॉल करें:`,
    attachCab:`बहुत बढ़िया आपने "Attach Cab" चुना\nअपना Two wheeler/Auto/Car/SUV जोड़ें और Bizmapia के साथ रोज कमाना शुरू करें।\n\nनीचे क्लिक करें:`,
    haveInstalled1:`क्या आपने हमारा ऐप इंस्टॉल किया है?\n\nयहाँ आप राइड पर अपने विशेष ऑफर सक्रिय कर सकते हैं`,
    haveInstalled24:`क्या आपने हमारा ऐप इंस्टॉल किया है?\n\nआपका मौका समाप्त होने वाला है, यहाँ आप राइड पर अपने विशेष ऑफर सक्रिय कर सकते हैं`,
    yesActivate:'Yes, activate', noLater:'No, will do later',
    activated:`बहुत बढ़िया, हम आपके ऐप लॉगिन में आपका ऑफर सक्रिय कर रहे हैं, अभी हमारे ऐप में लॉगिन करें और अपनी पहली यात्रा पूरी करके अपने ऑफर देखें`,
    helpAdmin:`Help ${HELP_ADMIN}`, helpMarketing:`Help ${HELP_MARKETING}`,
    bizDirSelected:`बहुत बढ़िया आपने "Business Directory" चुना\nअपना व्यवसाय रजिस्टर करें और पूरे भारत से ग्राहक प्राप्त करें।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    bizDirButtons:[{id:'BIZ_REGISTER',title:'Register Business'},{id:'BIZ_ADS',title:'Start Advertising'}],
    bizRegister:`Bizmapia पर अपना व्यवसाय रजिस्टर करें और अधिक ग्राहक, लीड और बुकिंग प्राप्त करना शुरू करें।\n\nनीचे वेबसाइट पर क्लिक करें या कॉल करें:`,
    bizAds:`Bizmapia पर अपने व्यवसाय का विज्ञापन शुरू करें और 10 गुना अधिक ग्राहक प्राप्त करें।\n\nनीचे क्लिक करें:`,
    deliverySelected:`बहुत बढ़िया आपने "Online Delivery" चुना\nस्थानीय स्टोर से कुछ भी 2 घंटे में आपके दरवाजे पर डिलीवरी।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    deliveryButtons:[{id:'DEL_ORDER',title:'Order from Stores'},{id:'DEL_PARTNER',title:'Earn as our delivery partner'}],
    delOrder:`किराना, भोजन, दवा, स्थानीय दुकानों से कुछ भी ऑर्डर करें और 2 घंटे में डिलीवरी प्राप्त करें।\n\nनीचे क्लिक करें:`,
    delPartner:`हमारे डिलीवरी पार्टनर बनें और रोज कमाएं।\n\nनीचे क्लिक करें:`,
    bookingSelected:`बहुत बढ़िया आपने "Online Booking" चुना\nपूरे भारत में किफायती दरों पर रूम, अपॉइंटमेंट, मूवी टिकट बुक करें।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    bookingButtons:[{id:'BOOK_ROOM',title:'Book Rooms'},{id:'BOOK_APPOINT',title:'Book Appointments'},{id:'BOOK_MOVIE',title:'Movie Tickets'}],
    bookRoom:`भारत में कहीं भी सर्वोत्तम दरों पर होटल, रूम, रिज़ॉर्ट बुक करें।\n\nनीचे क्लिक करें:`,
    bookAppoint:`अपॉइंटमेंट बुक करें - डॉक्टर, सैलून, सेवाएं - आपके पास तत्काल बुकिंग।\n\nनीचे क्लिक करें:`,
    bookMovie:`आपके पास मूवी टिकट, इवेंट, शो बुक करें।\n\nनीचे क्लिक करें:`,
    oppSelected:`बहुत बढ़िया आपने "Business Opportunity" चुना\nहमारा सर्विस पॉइंट बनें और कमाना शुरू करें। कमाई के 3 स्तर।\nआप भारत में कहीं से भी Bizmapia से कमाई के अवसर के लिए अपना स्लॉट बुक करने जा रहे हैं। आप किस प्रकार के अवसर की तलाश में हैं?\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    oppButtons:[{id:'OPP_DISTRICT',title:'High level Income'},{id:'OPP_CORP',title:'Moderate level Income'},{id:'OPP_CENTER',title:'Base level Income'}],
    highIntroSingle:`बहुत बढ़िया आपने हमारी उच्च स्तरीय आय अर्जन अवसर का चयन किया है\n\nआइए हमारी जिला फ्रेंचाइजी अवसर के बारे में विवरण जानें\nयाद रखें एक जिले के लिए केवल एक ही आवेदन स्वीकृत है, इसलिए पूरी जानकारी का अध्ययन करें और इस चैट के साथ निर्णय लें।`,
    moderateIntroSingle:`बहुत बढ़िया आपने हमारी मध्यम स्तरीय आय अवसर का चयन किया\n\nआइए हमारी कॉरपोरेशन फ्रेंचाइजी अवसर के बारे में जानें`,
    baseIntroSingle:`बहुत बढ़िया आपने हमारी बेस लेवल आय अवसर का चयन किया\n\nआइए हमारे बिजनेस सेंटर अवसर के बारे में जानें`,
    reminderFranchise:`आप हमारी फ्रेंचाइजी अवसर की जाँच कर रहे थे। अधिक जानने के लिए जारी रखें?`,
    seeVideo:'See the Video',
    benBtn:'Know Benefits', supBtn:'Know Support', reqBtn:'Requirements', submitBtn:'Submit Application', videoBtn:'Video Link', emiBtn:'EMI options',
    benText:`लाभ - जिला फ्रेंचाइजी\n\nलाभ 1 - आप जिला टॉप लेवल फ्रेंचाइजी हैं, आपके जिले की सभी कमाई पर %\nलाभ 2 - केवल आप कंपनी से सीधे संपर्क कर सकते हैं\nलाभ 3 - आजीवन रॉयल्टी आय`,
    supText:`सहायता - कंपनी प्रदान करेगी\nसहायता 1 - 12 महीने मार्केटिंग सहायता\nसहायता 2 - 6 महीने किराया योगदान\nसहायता 3 - 6 महीने स्टाफ वेतन सहायता`,
    reqText:`आवश्यकताएं\n\nआवश्यकता 1 - 90 वर्ग फुट कमरा\nआवश्यकता 2 - 1 पूर्णकालिक स्टाफ\nआवश्यकता 3 - पीसी/लैपटॉप और एंड्रॉइड मोबाइल`,
    corpQ:`क्या आपके जिले में कॉरपोरेशन है?`,
    yesCorp:'Yes Corp', noCorp:'No Corp',
    ready15:`आप आवेदन जमा करने जा रहे हैं, पुष्टि करते हुए कि आप जिला फ्रेंचाइजी शुल्क के रूप में 15 लाख रुपये का भुगतान करने के लिए तैयार हैं।`,
    readyBtn:'Yes Ready - 15L',
    payReg:`बहुत बढ़िया आपने 15L के लिए तैयार होने की पुष्टि की। कृपया अपने जिले को लॉक करने के लिए पंजीकरण शुल्क के रूप में 5000 रुपये का भुगतान करें। Link: ${LINKS_V92.razorpay}`,
    payBtn:'I Have Paid Rs5000',
    emiOpt:`EMI विकल्प उपलब्ध हैं:\nEMI 10 महीने\nEMI 20 महीने`,
    emi10:'EMI 10 Months', emi20:'EMI 20 Months',
    leadAsk:`बहुत बढ़िया! कृपया अपना पूरा नाम, जिला और मोबाइल नंबर टाइप करें`,
    occQ:`आपका व्यवसाय क्या है?`,
    bus:'Business', house:'Housewife', emp:'Employee',
    dateQ:`आप हमारे हेड ऑफिस कब आ सकते हैं?`,
    today:'Today', tomorrow:'Tomorrow',
    tenderLink:`जिला फ्रेंचाइजी के लिए टेंडर दस्तावेज: ${LINKS_V92.tenderDistrict}`,
    thanks:`विवरण जमा करने के लिए धन्यवाद। हमारी फ्रेंचाइजी टीम 24 घंटे के भीतर आपको कॉल करेगी।`,
    noProblem:`कोई बात नहीं! अपना समय लें। जब आप तैयार हों, तो नीचे क्लिक करके इंस्टॉल करें।`,
  },
  ml:{
    welcome:`Bizmapia-യിലേക്ക് സ്വാഗതം\nനിങ്ങൾ ഇന്ത്യയിലെ ആദ്യത്തെ 4 ഇൻ 1 സർവീസ് ആപ്പ് പ്ലാറ്റ്‌ഫോമിലാണ്\nതാഴെ നിന്ന് നിങ്ങളുടെ ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക:-`,
    mainMenu:`കൂടുതൽ സഹായത്തിനായി താഴെ നിന്ന് ഏതെങ്കിലും ഒരു സേവനം ക്ലിക്ക് ചെയ്യുക:-`,
    services:[{id:'SVC_RIDE',title:'Ride Hailing'},{id:'SVC_BIZDIR',title:'Business Directory'},{id:'SVC_DELIVERY',title:'Online Delivery'},{id:'SVC_BOOKING',title:'Online Booking'},{id:'SVC_OPP',title:'Business Opportunity'}],
    noLang:`ക്ഷമിക്കണം, നിങ്ങൾ ഒരു ഭാഷയും തിരഞ്ഞെടുത്തില്ല.\n\nതാഴെ നിന്ന് ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക:-`,
    noService:`നിങ്ങൾ ഇതുവരെ ഒരു സേവനവും തിരഞ്ഞെടുത്തില്ല.\n\nതാഴെ നിന്ന് ഒരു സേവനം ക്ലിക്ക് ചെയ്യുക:-`,
    rideSelected:`നിങ്ങൾ "Ride Hailing" തിരഞ്ഞെടുത്തു, നന്നായി\nBizmapia അതിർത്തിയില്ലാതെ ഇന്ത്യ മുഴുവൻ റൈഡ് ഹെയ്ലിംഗ് സേവനം നൽകുന്ന ഒരേയൊരു പ്ലാറ്റ്‌ഫോമാണ്.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    rideButtons:[{id:'RIDE_BOOK',title:'Book a Cab'},{id:'RIDE_ATTACH',title:'Attach Cab'}],
    bookCab:`മികച്ച തിരഞ്ഞെടുപ്പ്, നിങ്ങൾ "Book a Cab" സേവനം ക്ലിക്ക് ചെയ്തു.\nTwo wheeler/Autorickshaw/Hatchback/Sedan/SUV/XUV/Ambulance അടുത്ത പ്രദേശങ്ങളിൽ നിന്ന് മിതമായ നിരക്കിൽ ലഭിക്കും.\n\nതാഴെ ക്ലിക്ക് ചെയ്ത് ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക അല്ലെങ്കിൽ വിളിക്കുക:`,
    attachCab:`നിങ്ങൾ "Attach Cab" തിരഞ്ഞെടുത്തു\nനിങ്ങളുടെ Two wheeler/Auto/Car/SUV അറ്റാച്ച് ചെയ്ത് Bizmapia-യിലൂടെ ദിവസവും വരുമാനം നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    haveInstalled1:`നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nഇവിടെ നിങ്ങൾക്ക് റൈഡുകളിൽ പ്രത്യേക ഓഫറുകൾ സജീവമാക്കാം`,
    haveInstalled24:`നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nനിങ്ങളുടെ അവസരം അവസാനിക്കാൻ പോകുന്നു, ഇവിടെ റൈഡുകളിൽ ഓഫറുകൾ സജീവമാക്കാം`,
    yesActivate:'Yes, activate', noLater:'No, will do later',
    activated:`നന്നായി, ഞങ്ങൾ നിങ്ങളുടെ ആപ്പ് ലോഗിനിൽ നിങ്ങളുടെ ഓഫർ സജീവമാക്കുന്നു, ഇപ്പോൾ ഞങ്ങളുടെ ആപ്പിൽ ലോഗിൻ ചെയ്ത് ആദ്യ യാത്ര പൂർത്തിയാക്കി നിങ്ങളുടെ ഓഫറുകൾ പരിശോധിക്കുക`,
    helpAdmin:`Help ${HELP_ADMIN}`, helpMarketing:`Help ${HELP_MARKETING}`,
    bizDirSelected:`നിങ്ങൾ "Business Directory" തിരഞ്ഞെടുത്തു, നന്നായി\nനിങ്ങളുടെ ബിസിനസ്സ് രജിസ്റ്റർ ചെയ്ത് ഇന്ത്യ മുഴുവൻ ഉപഭോക്താക്കളെ നേടൂ. 10 ലക്ഷത്തിലധികം പ്രാദേശിക ബിസിനസ്സുകൾ ഇതിനകം ലിസ്റ്റ് ചെയ്തിട്ടുണ്ട്.\nതാഴെ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    bizDirButtons:[{id:'BIZ_REGISTER',title:'Register Business'},{id:'BIZ_ADS',title:'Start Advertising'}],
    bizRegister:`Bizmapia-യിൽ നിങ്ങളുടെ ബിസിനസ്സ് രജിസ്റ്റർ ചെയ്ത് കൂടുതൽ ഉപഭോക്താക്കളെയും ലീഡുകളെയും ബുക്കിംഗുകളെയും നേടാൻ തുടങ്ങൂ.\n\nതാഴെ വെബ്സൈറ്റിൽ ക്ലിക്ക് ചെയ്യുക അല്ലെങ്കിൽ വിളിക്കുക:`,
    bizAds:`Bizmapia-യിൽ നിങ്ങളുടെ ബിസിനസ്സ് പരസ്യം ചെയ്യാൻ തുടങ്ങൂ, 10 മടങ്ങ് കൂടുതൽ ഉപഭോക്താക്കളെ നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    deliverySelected:`നിങ്ങൾ "Online Delivery" തിരഞ്ഞെടുത്തു, നന്നായി\nപ്രാദേശിക സ്റ്റോറുകളിൽ നിന്ന് എന്തും 2 മണിക്കൂറിനുള്ളിൽ നിങ്ങളുടെ വാതിൽക്കൽ ഡെലിവറി.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    deliveryButtons:[{id:'DEL_ORDER',title:'Order from Stores'},{id:'DEL_PARTNER',title:'Earn as our delivery partner'}],
    delOrder:`പലചരക്ക്, ഭക്ഷണം, മരുന്ന്, പ്രാദേശിക സ്റ്റോറുകളിൽ നിന്ന് എന്തും ഓർഡർ ചെയ്ത് 2 മണിക്കൂറിനുള്ളിൽ ഡെലിവറി നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    delPartner:`ഞങ്ങളുടെ ഡെലിവറി പങ്കാളിയായി ദിവസവും വരുമാനം നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    bookingSelected:`നിങ്ങൾ "Online Booking" തിരഞ്ഞെടുത്തു, നന്നായി\nഇന്ത്യയിലുടനീളം മിതമായ നിരക്കിൽ റൂമുകൾ, അപ്പോയിന്റ്മെന്റുകൾ, മൂവി ടിക്കറ്റുകൾ ബുക്ക് ചെയ്യുക.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    bookingButtons:[{id:'BOOK_ROOM',title:'Book Rooms'},{id:'BOOK_APPOINT',title:'Book Appointments'},{id:'BOOK_MOVIE',title:'Movie Tickets'}],
    bookRoom:`ഇന്ത്യയിൽ എവിടെയും മികച്ച നിരക്കിൽ ഹോട്ടലുകൾ, റൂമുകൾ, റിസോർട്ടുകൾ ബുക്ക് ചെയ്യുക.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    bookAppoint:`അപ്പോയിന്റ്മെന്റുകൾ ബുക്ക് ചെയ്യുക - ഡോക്ടർ, സലൂൺ, സേവനങ്ങൾ - നിങ്ങൾക്ക് സമീപം തൽക്ഷണ ബുക്കിംഗ്.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    bookMovie:`നിങ്ങൾക്ക് സമീപമുള്ള മൂവി ടിക്കറ്റുകൾ, ഇവന്റുകൾ, ഷോകൾ ബുക്ക് ചെയ്യുക.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    oppSelected:`നിങ്ങൾ "Business Opportunity" തിരഞ്ഞെടുത്തു, നന്നായി\nഞങ്ങളുടെ സർവീസ് പോയിന്റായി മാറി വരുമാനം നേടാൻ തുടങ്ങൂ. വരുമാനത്തിന്റെ 3 തലങ്ങൾ.\nഇന്ത്യയിൽ എവിടെ നിന്നും Bizmapia-യിൽ നിന്ന് വരുമാന അവസരത്തിനായി നിങ്ങളുടെ സ്ലോട്ട് ബുക്ക് ചെയ്യാൻ പോകുന്നു. നിങ്ങൾ ഏത് തരം അവസരമാണ് തിരയുന്നത്?\nതാഴെ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    oppButtons:[{id:'OPP_DISTRICT',title:'High level Income'},{id:'OPP_CORP',title:'Moderate level Income'},{id:'OPP_CENTER',title:'Base level Income'}],
    highIntroSingle:`നിങ്ങൾ ഞങ്ങളുടെ ഉയർന്ന തലത്തിലുള്ള വരുമാന അവസരം തിരഞ്ഞെടുത്തു, നന്നായി\n\nനമുക്ക് ഞങ്ങളുടെ ജില്ലാ ഫ്രാഞ്ചൈസി അവസരത്തെക്കുറിച്ചുള്ള വിശദാംശങ്ങൾ കണ്ടെത്താം\nഓർക്കുക ഒരു ജില്ലയ്ക്ക് ഒരു അപേക്ഷ മാത്രമേ അംഗീകരിക്കൂ, അതിനാൽ മുഴുവൻ വിശദാംശങ്ങളും പഠിച്ച് ഈ ചാറ്റിലൂടെ തീരുമാനമെടുക്കുക.`,
    moderateIntroSingle:`നിങ്ങൾ ഞങ്ങളുടെ മിതമായ തലത്തിലുള്ള വരുമാന അവസരം തിരഞ്ഞെടുത്തു\n\nനമുക്ക് കോർപ്പറേഷൻ ഫ്രാഞ്ചൈസി അവസരത്തെക്കുറിച്ച് കണ്ടെത്താം`,
    baseIntroSingle:`നിങ്ങൾ ഞങ്ങളുടെ അടിസ്ഥാന തലത്തിലുള്ള വരുമാന അവസരം തിരഞ്ഞെടുത്തു\n\nനമുക്ക് ബിസിനസ് സെന്റർ അവസരത്തെക്കുറിച്ച് കണ്ടെത്താം`,
    reminderFranchise:`നിങ്ങൾ ഞങ്ങളുടെ ഫ്രാഞ്ചൈസി അവസരം പരിശോധിക്കുകയായിരുന്നു. കൂടുതൽ അറിയാൻ തുടരണോ?`,
    seeVideo:'See the Video',
    benBtn:'Know Benefits', supBtn:'Know Support', reqBtn:'Requirements', submitBtn:'Submit Application', videoBtn:'Video Link', emiBtn:'EMI options',
    benText:`ആനുകൂല്യങ്ങൾ - ജില്ലാ ഫ്രാഞ്ചൈസി\n\nആനുകൂല്യം 1 - നിങ്ങൾ ജില്ലയിലെ ടോപ്പ് ലെവൽ ഫ്രാഞ്ചൈസിയാണ്, നിങ്ങളുടെ ജില്ലയിലെ എല്ലാ വരുമാനത്തിലും %\nആനുകൂല്യം 2 - കമ്പനിയുമായി നേരിട്ട് ബന്ധപ്പെടാൻ നിങ്ങൾക്ക് മാത്രമേ കഴിയൂ\nആനുകൂല്യം 3 - ആജീവനാന്ത റോയൽറ്റി വരുമാനം`,
    supText:`പിന്തുണ - കമ്പനി നൽകും\nപിന്തുണ 1 - 12 മാസത്തെ മാർക്കറ്റിംഗ് പിന്തുണ\nപിന്തുണ 2 - 6 മാസത്തെ വാടക സംഭാവന\nപിന്തുണ 3 - 6 മാസത്തെ സ്റ്റാഫ് ശമ്പള പിന്തുണ`,
    reqText:`ആവശ്യകതകൾ\n\nആവശ്യകത 1 - 90 ചതുരശ്ര അടി മുറി\nആവശ്യകത 2 - 1 ഫുൾ ടൈം സ്റ്റാഫ്\nആവശ്യകത 3 - പിസി/ലാപ്ടോപ്പും ആൻഡ്രോയിഡ് മൊബൈലും`,
    corpQ:`നിങ്ങളുടെ ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?`,
    yesCorp:'Yes Corp', noCorp:'No Corp',
    ready15:`നിങ്ങൾ അപേക്ഷ സമർപ്പിക്കാൻ പോകുന്നു, ജില്ലാ ഫ്രാഞ്ചൈസി ഫീസായി 15 ലക്ഷം രൂപ നൽകാൻ നിങ്ങൾ തയ്യാറാണെന്ന് സ്ഥിരീകരിക്കുന്നു.`,
    readyBtn:'Yes Ready - 15L',
    payReg:`നിങ്ങൾ 15L-ന് തയ്യാറാണെന്ന് സ്ഥിരീകരിച്ചു. നിങ്ങളുടെ ജില്ല ലോക്ക് ചെയ്യാൻ രജിസ്ട്രേഷൻ ഫീസായി 5000 രൂപ അടയ്ക്കുക. Link: ${LINKS_V92.razorpay}`,
    payBtn:'I Have Paid Rs5000',
    emiOpt:`EMI ഓപ്ഷനുകൾ ലഭ്യമാണ്:\nEMI 10 മാസം\nEMI 20 മാസം`,
    emi10:'EMI 10 Months', emi20:'EMI 20 Months',
    leadAsk:`മികച്ചത്! ദയവായി നിങ്ങളുടെ പൂർണ്ണ നാമം, ജില്ല, മൊബൈൽ നമ്പർ ടൈപ്പ് ചെയ്യുക`,
    occQ:`നിങ്ങളുടെ തൊഴിൽ എന്താണ്?`,
    bus:'Business', house:'Housewife', emp:'Employee',
    dateQ:`നിങ്ങൾക്ക് ഞങ്ങളുടെ ഹെഡ് ഓഫീസിൽ എപ്പോൾ വരാൻ കഴിയും?`,
    today:'Today', tomorrow:'Tomorrow',
    tenderLink:`ജില്ലാ ഫ്രാഞ്ചൈസിക്കുള്ള ടെൻഡർ ഡോക്യുമെന്റ്: ${LINKS_V92.tenderDistrict}`,
    thanks:`വിശദാംശങ്ങൾ സമർപ്പിച്ചതിന് നന്ദി. ഞങ്ങളുടെ ഫ്രാഞ്ചൈസി ടീം 24 മണിക്കൂറിനുള്ളിൽ നിങ്ങളെ വിളിക്കും.`,
    noProblem:`പ്രശ്നമില്ല! സമയമെടുക്കൂ. നിങ്ങൾ തയ്യാറാകുമ്പോൾ താഴെ ക്ലിക്ക് ചെയ്ത് ഇൻസ്റ്റാൾ ചെയ്യുക.`,
  }
};

app.get('/',(req,res)=>res.send(`V99 listening - Phone ID ${PHONE_NUMBER_ID}`));
app.get('/webhook',(req,res)=>{
  if(req.query['hub.verify_token']===VERIFY_TOKEN){ res.send(req.query['hub.challenge']); }
  else res.sendStatus(403);
});

app.post('/webhook', async(req,res)=>{
  res.sendStatus(200);
  try{
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const msg = value?.messages?.[0];
    if(!msg) return;
    const uid = msg.from;
    const txt = msg.text?.body||'';
    const btnId = msg.button?.payload || msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || '';
    const isHi = ['hi','hello','hey','hai'].includes(txt.toLowerCase().trim());
    const nowIso = new Date().toISOString();

    let state = await getState(uid);
    let lang = state.lang || 'en';

    if(btnId.startsWith('LANG_')){
      const l = btnId.replace('LANG_','').toLowerCase();
      lang = l==='ml'?'ml':l==='hi'?'hi':'en';
      await setState(uid,{lang, lastStep:'Language '+lang});
      const L=T[lang];
      clearReminders(uid);
      await sendWithDelay(interactiveButton(uid, L.mainMenu, L.services.slice(0,3)));
      await delay(300);
      await sendWithDelay(interactiveButton(uid, 'More services:-', L.services.slice(3,5)));
      await saveToSheet('Leads', [nowIso, uid, lang, 'Language Selected', lang, 'Clicked', HELP_ADMIN, 'Language '+lang, ''], false);
      scheduleReminder(uid,'noService:'+Date.now(),lang,1*60*60*1000);
      scheduleReminder(uid,'noService2:'+Date.now(),lang,12*60*60*1000);
      scheduleReminder(uid,'noService3:'+Date.now(),lang,24*60*60*1000);
      return;
    }

    // === Fix #17 - First message ANY input: sentence, alphabet, numeric, special char, emoji, sticker, media ===
    if(!state.lang){
      const L=T.en;
      const msgType = msg.type||'text';
      const rawInput = txt || msgType; // captures emoji, sticker, image etc
      console.log(`FIRST MSG any input from ${uid} type=${msgType} txt=${txt}`);
      await sendWithDelay(interactiveButton(uid, L.welcome, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'Hindi'},{id:'LANG_ML',title:'Malayalam'}]));
      await setState(uid,{first:true, lastStep:'First Message', lang:null});
      await saveToSheet('No_Language', [nowIso, uid, 'none', 'First Message', `First Input: ${rawInput} (${msgType})`, 'Received', HELP_ADMIN, 'First', ''], true);
      clearReminders(uid);
      scheduleReminder(uid,'noLang:'+Date.now(),'en',1*60*60*1000);
      scheduleReminder(uid,'noLang2:'+Date.now(),'en',12*60*60*1000);
      scheduleReminder(uid,'noLang3:'+Date.now(),'en',24*60*60*1000);
      return;
    }
    if(isHi){
      const L=T[lang]||T.en;
      clearReminders(uid);
      await setState(uid,{lang, lastStep:'HI Reset'});
      await sendWithDelay(interactiveButton(uid, L.mainMenu, L.services.slice(0,3)));
      await delay(300);
      await sendWithDelay(interactiveButton(uid, 'More services:-', L.services.slice(3,5)));
      return;
    }

    const L=T[lang]||T.en;

    // Main services
    if(btnId.startsWith('SVC_')){
      state.service=btnId; state.lastStep=btnId; await setState(uid,state);
      clearReminders(uid);
      if(btnId==='SVC_RIDE'){ await sendWithDelay(interactiveButton(uid, L.rideSelected, L.rideButtons)); }
      else if(btnId==='SVC_BIZDIR'){ await sendWithDelay(interactiveButton(uid, L.bizDirSelected, L.bizDirButtons)); }
      else if(btnId==='SVC_DELIVERY'){ await sendWithDelay(interactiveButton(uid, L.deliverySelected, L.deliveryButtons)); }
      else if(btnId==='SVC_BOOKING'){ await sendWithDelay(interactiveButton(uid, L.bookingSelected, L.bookingButtons)); }
      else if(btnId==='SVC_OPP'){ await sendWithDelay(interactiveButton(uid, L.oppSelected, L.oppButtons)); }
      await saveToSheet('Leads', [nowIso, uid, lang, btnId, 'Main Service', 'Clicked', btnId==='SVC_OPP'?HELP_MARKETING:HELP_ADMIN, state.lastStep, ''], false);
      scheduleReminder(uid, `install:${btnId}:1`, lang, 1*60*60*1000);
      scheduleReminder(uid, `install:${btnId}:12`, lang, 12*60*60*1000);
      scheduleReminder(uid, `install:${btnId}:24`, lang, 24*60*60*1000);
      return;
    }

    // === Change 1-9 CTA Buttons ===
    if(btnId==='RIDE_BOOK'){
      state.sub='RIDE_BOOK'; state.lastStep='Book a Cab'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(ctaButtons(uid, L.bookCab, [
        {type:'url', title:'Android', url:PLAY_STORE},
        {type:'url', title:'iOS', url:APP_STORE},
        {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
      ]));
      await saveToSheet('Book_Cab', [nowIso, uid, lang, 'Ride Hailing', 'Book a Cab', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:RIDE_BOOK:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:RIDE_BOOK:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:RIDE_BOOK:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='RIDE_ATTACH'){
      state.sub='RIDE_ATTACH'; state.lastStep='Attach Cab'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(ctaButtons(uid, L.attachCab, [
        {type:'url', title:'Android', url:PLAY_STORE},
        {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
      ]));
      await saveToSheet('Attach_Cab', [nowIso, uid, lang, 'Ride Hailing', 'Attach Cab', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:RIDE_ATTACH:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:RIDE_ATTACH:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:RIDE_ATTACH:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='BIZ_REGISTER'){
      state.sub='BIZ_REGISTER'; state.lastStep='Register Business'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(ctaButtons(uid, L.bizRegister, [
        {type:'url', title:'Register your Business', url:WEBSITE},
        {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
      ]));
      await saveToSheet('Register_Business', [nowIso, uid, lang, 'Business Directory', 'Register Business', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:BIZ_REGISTER:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:BIZ_REGISTER:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:BIZ_REGISTER:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='BIZ_ADS'){
      state.sub='BIZ_ADS'; state.lastStep='Start Advertising'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(ctaButtons(uid, L.bizAds, [
        {type:'url', title:'Advertise Now', url:WEBSITE},
        {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
      ]));
      await saveToSheet('Start_Advertising', [nowIso, uid, lang, 'Business Directory', 'Start Advertising', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:BIZ_ADS:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:BIZ_ADS:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:BIZ_ADS:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='DEL_ORDER'){
      state.sub='DEL_ORDER'; state.lastStep='Order Stores'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(ctaButtons(uid, L.delOrder, [
        {type:'url', title:'Android', url:PLAY_STORE},
        {type:'url', title:'iOS', url:APP_STORE},
        {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
      ]));
      await saveToSheet('Order_Stores', [nowIso, uid, lang, 'Online Delivery', 'Order from Stores', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:DEL_ORDER:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:DEL_ORDER:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:DEL_ORDER:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='DEL_PARTNER'){
      state.sub='DEL_PARTNER'; state.lastStep='Delivery Partner'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(ctaButtons(uid, L.delPartner, [
        {type:'url', title:'Android', url:PLAY_STORE},
        {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
      ]));
      await saveToSheet('Delivery_Partner', [nowIso, uid, lang, 'Online Delivery', 'Delivery Partner', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:DEL_PARTNER:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:DEL_PARTNER:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:DEL_PARTNER:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='BOOK_ROOM'){
      state.sub='BOOK_ROOM'; state.lastStep='Book Rooms'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(ctaButtons(uid, L.bookRoom, [
        {type:'url', title:'Android', url:PLAY_STORE},
        {type:'url', title:'iOS', url:APP_STORE},
        {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
      ]));
      await saveToSheet('Book_Rooms', [nowIso, uid, lang, 'Online Booking', 'Book Rooms', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:BOOK_ROOM:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:BOOK_ROOM:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:BOOK_ROOM:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='BOOK_APPOINT'){
      state.sub='BOOK_APPOINT'; state.lastStep='Book Appointments'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(ctaButtons(uid, L.bookAppoint, [
        {type:'url', title:'Android', url:PLAY_STORE},
        {type:'url', title:'iOS', url:APP_STORE},
        {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
      ]));
      await saveToSheet('Book_Appointments', [nowIso, uid, lang, 'Online Booking', 'Book Appointments', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:BOOK_APPOINT:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:BOOK_APPOINT:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:BOOK_APPOINT:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='BOOK_MOVIE'){
      state.sub='BOOK_MOVIE'; state.lastStep='Movie Tickets'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(ctaButtons(uid, L.bookMovie, [
        {type:'url', title:'Android', url:PLAY_STORE},
        {type:'url', title:'iOS', url:APP_STORE},
        {type:'phone', title:'Call', phone:HELP_ADMIN_FULL}
      ]));
      await saveToSheet('Book_Movie', [nowIso, uid, lang, 'Online Booking', 'Movie Tickets', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:BOOK_MOVIE:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:BOOK_MOVIE:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:BOOK_MOVIE:24', lang, 24*60*60*1000);
      return;
    }

    // === Change 10-11 Business Opportunity ===
    if(btnId==='OPP_DISTRICT'){
      state.sub='OPP_DISTRICT'; state.lastStep='High level Income - District'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(singleCta(uid, L.highIntroSingle, {type:'url', title:L.seeVideo, url:VIDEO_DISTRICT}));
      await delay(500);
      await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}]));
      await saveToSheet('OPP_District', [nowIso, uid, lang, 'Business Opportunity', 'High level Income', 'Clicked', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:OPP_DISTRICT:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:OPP_DISTRICT:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:OPP_DISTRICT:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='OPP_CORP'){
      state.sub='OPP_CORP'; state.lastStep='Moderate level Income - Corp'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(singleCta(uid, L.moderateIntroSingle, {type:'url', title:L.seeVideo, url:VIDEO_CORP}));
      await delay(500);
      await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}]));
      await saveToSheet('OPP_Corp', [nowIso, uid, lang, 'Business Opportunity', 'Moderate level Income', 'Clicked', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:OPP_CORP:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:OPP_CORP:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:OPP_CORP:24', lang, 24*60*60*1000);
      return;
    }
    if(btnId==='OPP_CENTER'){
      state.sub='OPP_CENTER'; state.lastStep='Base level Income - Center'; await setState(uid,state);
      clearReminders(uid);
      await sendWithDelay(singleCta(uid, L.baseIntroSingle, {type:'url', title:L.seeVideo, url:VIDEO_CENTER}));
      await delay(500);
      await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}]));
      await saveToSheet('OPP_Center', [nowIso, uid, lang, 'Business Opportunity', 'Base level Income', 'Clicked', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:OPP_CENTER:1', lang, 1*60*60*1000);
      scheduleReminder(uid, 'install:OPP_CENTER:12', lang, 12*60*60*1000);
      scheduleReminder(uid, 'install:OPP_CENTER:24', lang, 24*60*60*1000);
      return;
    }

    // === EMI / ADVANCE FULLY PRESERVED ===
    if(btnId==='KNOW_BEN'){ state.lastStep='Benefits'; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.benText)); await delay(300); await sendWithDelay(interactiveButton(uid,'Next:',[{id:'KNOW_SUP',title:L.supBtn},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`} ])); await saveToSheet('Franchise_Benefits', [nowIso, uid, lang, 'Business Opportunity', 'Know Benefits', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_BEN:1',lang,1*60*60*1000); scheduleReminder(uid,'install:OPP_BEN:12',lang,12*60*60*1000); scheduleReminder(uid,'install:OPP_BEN:24',lang,24*60*60*1000); return; }
    if(btnId==='KNOW_SUP'){ state.lastStep='Support'; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.supText)); await delay(300); await sendWithDelay(interactiveButton(uid,'Next:',[{id:'KNOW_REQ',title:L.reqBtn},{id:'CALL_MARKETING',title:`Call ${HELP_MARKETING}`} ])); await saveToSheet('Franchise_Support', [nowIso, uid, lang, 'Business Opportunity', 'Know Support', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_SUP:1',lang,1*60*60*1000); scheduleReminder(uid,'install:OPP_SUP:12',lang,12*60*60*1000); scheduleReminder(uid,'install:OPP_SUP:24',lang,24*60*60*1000); return; }
    if(btnId==='KNOW_REQ'){ state.lastStep='Requirements'; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.reqText)); await delay(300); await sendWithDelay(interactiveButton(uid,'Next:',[{id:'SUBMIT_APP',title:L.submitBtn},{id:'KNOW_EMI',title:L.emiBtn}])); await saveToSheet('Franchise_Requirements', [nowIso, uid, lang, 'Business Opportunity', 'Requirements', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_REQ:1',lang,1*60*60*1000); scheduleReminder(uid,'install:OPP_REQ:12',lang,12*60*60*1000); scheduleReminder(uid,'install:OPP_REQ:24',lang,24*60*60*1000); return; }
    if(btnId==='SUBMIT_APP'){ state.lastStep='Submit Application - Corp Check'; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.corpQ,[{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}])); await saveToSheet('Franchise_Submit', [nowIso, uid, lang, 'Business Opportunity', 'Submit Application', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); return; }
    if(btnId==='CORP_YES'||btnId==='CORP_NO'){ state.lastStep='Ready 15L - Corp:'+btnId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.ready15,[{id:'READY_15L',title:L.readyBtn},{id:'KNOW_EMI',title:L.emiBtn}])); await saveToSheet('Franchise_CorpCheck', [nowIso, uid, lang, 'Business Opportunity', 'Corp Check '+btnId, 'Clicked', HELP_MARKETING, state.lastStep, ''], true); return; }
    if(btnId==='READY_15L'){ state.lastStep='Pay Rs5000'; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.payReg,[{id:'PAY_DONE',title:L.payBtn},{id:'KNOW_EMI',title:L.emiBtn}])); await saveToSheet('Franchise_Ready15L', [nowIso, uid, lang, 'Business Opportunity', 'Ready 15L', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); return; }
    if(btnId==='KNOW_EMI'){ state.lastStep='EMI Options'; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.emiOpt,[{id:'EMI_10',title:L.emi10},{id:'EMI_20',title:L.emi20}])); await saveToSheet('Franchise_EMI', [nowIso, uid, lang, 'Business Opportunity', 'EMI Options', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); return; }
    if(btnId==='EMI_10'||btnId==='EMI_20'){ state.lastStep='EMI Selected '+btnId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.payReg,[{id:'PAY_DONE',title:L.payBtn}])); await saveToSheet('Franchise_EMI_Selected', [nowIso, uid, lang, 'Business Opportunity', 'EMI '+btnId, 'Clicked', HELP_MARKETING, state.lastStep, ''], true); return; }
    if(btnId==='PAY_DONE'){ state.lastStep='Pay Done - Lead Start'; state.flow='LEAD'; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.leadAsk)); await saveToSheet('Franchise_PayDone', [nowIso, uid, lang, 'Business Opportunity', 'Pay Done', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); return; }

    if(btnId.startsWith('OCC_')){
      const occ = btnId.replace('OCC_','');
      state.occupation=occ; state.lastStep='Occupation '+occ; await setState(uid,state); clearReminders(uid);
      await sendWithDelay(interactiveButton(uid,L.dateQ,[{id:'DATE_TODAY',title:L.today},{id:'DATE_TOMORROW',title:L.tomorrow}]));
      await saveToSheet('Franchise_Occupation', [nowIso, uid, lang, 'Business Opportunity', 'Occupation '+occ, 'Clicked', HELP_MARKETING, state.lastStep, occ], true);
      return;
    }
    if(btnId.startsWith('DATE_')){
      const date = btnId.replace('DATE_','');
      state.date=date; state.lastStep='Date '+date; await setState(uid,state); clearReminders(uid);
      await sendWithDelay(textMessage(uid,L.tenderLink));
      await delay(300);
      await sendWithDelay(textMessage(uid,L.thanks));
      await saveToSheet('Franchise_Date', [nowIso, uid, lang, 'Business Opportunity', 'Date '+date, 'Clicked', HELP_MARKETING, state.lastStep, JSON.stringify(state)], true);
      await setState(uid,{lang, lastStep:'Completed', flow:'DONE', occupation:state.occupation, date:state.date});
      return;
    }

    if(btnId==='YES_ACTIVATE'){ state.installed=true; state.lastStep='Yes Activate'; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.activated)); await saveToSheet('App_Install', [nowIso, uid, lang, state.sub||'App', 'Yes Activate - Installed', 'Success', state.service==='SVC_OPP' ? HELP_MARKETING : HELP_ADMIN, state.lastStep, ''], true); return; }
    if(btnId==='NO_LATER'){
      state.lastStep='No Later'; await setState(uid,state); clearReminders(uid);
      const isOpp = state.service==='SVC_OPP' || state.sub?.startsWith('OPP_');
      const callNum = isOpp ? HELP_MARKETING_FULL : HELP_ADMIN_FULL;
      const callShort = isOpp ? HELP_MARKETING : HELP_ADMIN;
      // Change 14 - No Later with Android+iOS+Call buttons
      await sendWithDelay(ctaButtons(uid, L.noProblem, [
        {type:'url', title:'Android', url:PLAY_STORE},
        {type:'url', title:'iOS', url:APP_STORE},
        {type:'phone', title:'Call', phone:callNum}
      ]));
      await saveToSheet('App_Install', [nowIso, uid, lang, state.sub||'App', 'No Later - Pending', 'Pending', isOpp?HELP_MARKETING:HELP_ADMIN, state.lastStep, ''], true);
      scheduleReminder(uid, `install:${state.sub||'APP'}:1`, lang, 1*60*60*1000);
      scheduleReminder(uid, `install:${state.sub||'APP'}:12`, lang, 12*60*60*1000);
      scheduleReminder(uid, `install:${state.sub||'APP'}:24`, lang, 24*60*60*1000);
      return;
    }
    if(btnId==='CALL_ADMIN'||btnId==='HELP_ADMIN'){ await sendWithDelay(textMessage(uid,`📞 Customer Care: ${HELP_ADMIN}\n\nTap to call: +91 ${HELP_ADMIN}\n\ntel:+91${HELP_ADMIN}`)); return; }
    if(btnId==='CALL_MARKETING'||btnId==='HELP_MARKETING'){ await sendWithDelay(textMessage(uid,`📞 Franchise Team: ${HELP_MARKETING}\n\nTap to call: +91 ${HELP_MARKETING}\n\ntel:+91${HELP_MARKETING}`)); return; }

    if(state.flow==='LEAD' && txt){
      state.leadData=txt; state.lastStep='Lead Typed'; await setState(uid,state); clearReminders(uid);
      await sendWithDelay(interactiveButton(uid,L.occQ,[{id:'OCC_BUSINESS',title:L.bus},{id:'OCC_HOUSE',title:L.house},{id:'OCC_EMP',title:L.emp}]));
      await saveToSheet('Franchise_Leads', [nowIso, uid, lang, 'Business Opportunity', 'Lead Data', txt, HELP_MARKETING, state.lastStep, txt], true);
      return;
    }

    // === Fix #17 - Random input after any step (sentence, alphabet, numeric, special char, emoji, sticker) ===
    // If user typed random text or sent emoji/sticker/media and not in LEAD flow, repeat last step
    const msgType = msg.type||'text';
    const isSticker = msgType==='sticker';
    const isMedia = ['image','video','audio','document','sticker','reaction'].includes(msgType);
    const isRandomText = txt && btnId==='' && state.flow!=='LEAD'; // not button, not lead
    const isRandomMedia = isMedia || isSticker;
    
    if((isRandomText || isRandomMedia) && state.lang){
      console.log(`RANDOM INPUT detected from ${uid} type=${msgType} txt=${txt} - Repeating last step`);
      await repeatLastStep(uid, state, lang);
      return;
    }

    if(state.lang){ await sendWithDelay(interactiveButton(uid,L.mainMenu,L.services.slice(0,3))); }

  }catch(e){ console.log('webhook error',e.message,e.stack); }
});

app.listen(PORT,'0.0.0.0',async()=>{
  console.log(`V99 FINAL listening on ${PORT} - Phone ID ${PHONE_NUMBER_ID} - ADMIN:${HELP_ADMIN} MARKETING:${HELP_MARKETING}`);
  await getSheets();
});
