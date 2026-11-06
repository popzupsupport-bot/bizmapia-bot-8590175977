// V207 FINAL - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// ==================== LOCKED - FINAL VERSION - DO NOT EDIT - V207 ====================
// V207 FINAL - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// LOCKED ON: 2026-11-04 - BASED ON 7 DAYS DATA 302 USERS - MANUAL 3000->10 (0.33%) BOT 302->6 (2%) - 3 YEARS BRAND FAME
// FEATURES: SHORT MAYA "Hi, I am Maya here to chat with you! 👋" + ALL INDIA PLATFORM "🇮🇳 India's Largest Online Platform - First 4-in-1 App" + STANDARD EMOJIS + FOMO + INBUILT DIALER + HUMAN HANDOVER + PAY VERIFY
// 8 PDF: 2 DISTRICT (D250) + 2 CORP/MUNI (C150) + 4 BUSINESS CENTER (B100) - NO 5000 - REGISTRATION FEE NOT REFUNDABLE NOT PART OF FEE
// 8 SHEETS LOCKED: System_Logs, Master_Leads, Franchise_Funnel, Payments, Ride_Hailing, Business_Directory, Delivery, Booking, Registration_Fee
// REDIS READY + GOOGLE SHEETS READY + REMINDERS 1H/12H/24H FOMO + FREE INSTANCE FIX NEEDED
// =========================================================================================

// V207 FINAL - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// 8 SHEETS LOCKED - ALL STEPS - 8 PDF 2 DISTRICT + 2 CORP/MUNI + 4 BUSINESS CENTER - WELCOME MAYA FIXED - APPRECIATIVE GREETING - DOWNLOADABLE PDF - V207 FINAL - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
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
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
const PORT = process.env.PORT || 10000;

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia&pcampaignid=web_share';
const APP_STORE = 'https://apps.apple.com/in/app/bizmapia/id6761577245';
const crypto = require('crypto');
const WEBSITE = 'https://bizmapia.com/';

// ===== INDIAN TIME (IST) FIX - ADDED V207 - ONLY TIME CODES CHANGED, ALL OTHER CODES SAME AS WORKING FILE =====
function getISTTime() {
  const now = new Date();
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const year = istTime.getFullYear();
  const month = String(istTime.getMonth() + 1).padStart(2, '0');
  const day = String(istTime.getDate()).padStart(2, '0');
  const hours = String(istTime.getHours()).padStart(2, '0');
  const minutes = String(istTime.getMinutes()).padStart(2, '0');
  const seconds = String(istTime.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} IST`;
}

function getISTISOString() {
  const now = new Date();
  const istString = now.toLocaleString('en-CA', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const iso = istString.replace(', ', 'T') + '+05:30';
  return iso;
}

function getISTTimestamp() {
  const now = new Date();
  return now.toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) + ' IST';
}
// ===== END INDIAN TIME FIX - ONLY THIS ADDED, ALL OTHER CODES SAME =====


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
  // Original video logic maintained
  if(lang==='ml'){
    if(sub==='OPP_DISTRICT') return "https://www.youtube.com/watch?v=Fll3OY-hilU";
    if(sub==='OPP_CORP' || sub==='OPP_MUNI') return "https://www.youtube.com/watch?v=F9rI2crM7Ow";
    if(sub==='OPP_CENTER') return "https://www.youtube.com/watch?v=Ds0lBtTaI6c";
    return "https://www.youtube.com/watch?v=8ZnDlvbgG_c";
  }
  if(lang==='hi'){
    if(sub==='OPP_DISTRICT') return "https://www.youtube.com/watch?v=_y2JeFHBnqg";
    if(sub==='OPP_CORP' || sub==='OPP_MUNI') return "https://www.youtube.com/watch?v=GqolfqgHiCU";
    if(sub==='OPP_CENTER') return "https://www.youtube.com/watch?v=r0X77XfmF94";
    return "https://www.youtube.com/watch?v=_y2JeFHBnqg";
  }
  // EN default
  if(sub==='OPP_DISTRICT') return "https://www.youtube.com/watch?v=_y2JeFHBnqg";
  if(sub==='OPP_CORP' || sub==='OPP_MUNI') return "https://www.youtube.com/watch?v=GqolfqgHiCU";
  if(sub==='OPP_CENTER') return "https://www.youtube.com/watch?v=r0X77XfmF94";
  return "https://www.youtube.com/watch?v=8ZnDlvbgG_c";
}


function getTenderPdfLink(sub, lang){
  // Returns 2 PDFs per opportunity - Main + Annexure - Total 8 PDFs
  if(sub==='OPP_DISTRICT') return { main: LINKS_V92.tenderDistrict, annexure: LINKS_V92.tenderDistrictAnnexure };
  if(sub==='OPP_CORP') return { main: LINKS_V92.tenderCorporation, annexure: LINKS_V92.tenderCorporationAnnexure };
  if(sub==='OPP_MUNI') return { main: LINKS_V92.tenderMunicipal, annexure: LINKS_V92.tenderMunicipalAnnexure };
  if(sub==='OPP_CENTER') return { main: LINKS_V92.tenderBusinessCenter, annexure: LINKS_V92.tenderBusinessCenterAnnexure };
  return { main: LINKS_V92.tenderDistrict, annexure: LINKS_V92.tenderDistrictAnnexure };
}
function OLD_getTenderPdfLink_TEMP(sub, lang){
  // Returns downloadable PDF per business opportunity instead of only district tender
  if(sub==='OPP_DISTRICT') return LINKS_V92.tenderDistrict;
  if(sub==='OPP_CORP') return LINKS_V92.tenderCorporation;
  if(sub==='OPP_MUNI') return LINKS_V92.tenderMunicipal;
  if(sub==='OPP_CENTER') return LINKS_V92.tenderBusinessCenter;
  return LINKS_V92.tenderDistrict;
}

function getTenderGreeting(sub, lang){
  const pdfs = getTenderPdfLink(sub, lang);
  const main = pdfs.main;
  const annex = pdfs.annexure;
  if(lang==='ml'){
    if(sub==='OPP_DISTRICT') return `👏 മികച്ച തിരഞ്ഞെടുപ്പ്! ജില്ലാ ഫ്രാഞ്ചൈസി - 10-15L തിരഞ്ഞെടുത്തതിന് നന്ദി!

📄 ഡൗൺലോഡ് ചെയ്യാവുന്ന 2 PDF - ജില്ലാ ഫ്രാഞ്ചൈസി:
1️⃣ Main Tender: ${main}
2️⃣ Annexure File: ${annex}

👇 എന്ത് ചെയ്യണം: രണ്ട് PDF-കളും ഡൗൺലോഡ് ചെയ്ത് വായിച്ച് സൂക്ഷിക്കുക. ടീം 24 മണിക്കൂറിനുള്ളിൽ വിളിക്കും.`;
    if(sub==='OPP_CORP') return `👏 മികച്ച തിരഞ്ഞെടുപ്പ്! കോർപ്പറേഷൻ/മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി - 4L/5L തിരഞ്ഞെടുത്തതിന് നന്ദി!

📄 ഡൗൺലോഡ് ചെയ്യാവുന്ന 2 PDF:
1️⃣ Main Tender: ${main}
2️⃣ Annexure: ${annex}

👇 എന്ത് ചെയ്യണം: രണ്ട് PDF-കളും ഡൗൺലോഡ് ചെയ്ത് വായിക്കുക.`;
    return `👏 മികച്ച തിരഞ്ഞെടുപ്പ്! ബിസിനസ് സെന്റർ - 1L തിരഞ്ഞെടുത്തതിന് നന്ദി!

📄 ഡൗൺലോഡ് ചെയ്യാവുന്ന 2 PDF:
1️⃣ Main Tender: ${main}
2️⃣ Annexure: ${annex}

👇 എന്ത് ചെയ്യണം: PDF-കൾ ഡൗൺലോഡ് ചെയ്ത് വായിക്കുക.`;
  }
  if(lang==='hi'){
    if(sub==='OPP_DISTRICT') return `👏 बेहतरीन चयन! जिला फ्रेंचाइजी - 10-15L चुनने के लिए धन्यवाद!

📄 डाउनलोड करने योग्य 2 PDF - जिला फ्रेंचाइजी:
1️⃣ Main Tender: ${main}
2️⃣ Annexure File: ${annex}

👇 क्या करना है: दोनों PDF डाउनलोड करें और पढ़ें।`;
    if(sub==='OPP_CORP') return `👏 बेहतरीन चयन! कॉर्पोरेशन/म्युनिसिपैलिटी फ्रेंचाइजी - 4L/5L चुनने के लिए धन्यवाद!

📄 डाउनलोड करने योग्य 2 PDF:
1️⃣ Main Tender: ${main}
2️⃣ Annexure: ${annex}

👇 क्या करना है: दोनों PDF डाउनलोड करें और पढ़ें।`;
    return `👏 बेहतरीन चयन! बिजनेस सेंटर - 1L चुनने के लिए धन्यवाद!

📄 डाउनलोड करने योग्य 2 PDF:
1️⃣ Main Tender: ${main}
2️⃣ Annexure: ${annex}

👇 क्या करना है: PDF डाउनलोड करें।`;
  }
  if(sub==='OPP_DISTRICT') return `👏 Excellent choice! 👏 🙏 Thank you for selecting District Franchisee - 10-15L - MOST PREMIUM!

📄 Downloadable 2 PDFs for District Franchise:
1️⃣ Main Tender Document: ${main}
2️⃣ Annexure File: ${annex}

👇 What to do: Click both links above to download your District tender + annexure PDFs, read complete terms, and keep them safe. Our team will call you within 24 hours.`;
  if(sub==='OPP_CORP') return `👏 Excellent choice! 👏 🙏 Thank you for selecting Corporation/Municipal Franchisee - 4L/5L!

📄 Downloadable 2 PDFs for Corporation/Municipal:
1️⃣ Main Tender: ${main}
2️⃣ Annexure File: ${annex}

👇 What to do: Download both tender + annexure PDFs and read complete terms.`;
  return `👏 Excellent choice! 👏 🙏 Thank you for selecting Business Center - 1L - Easy Start!

📄 Downloadable 2 PDFs for Business Center:
1️⃣ Main Tender: ${main}
2️⃣ Annexure: ${annex}

👇 What to do: Download both PDFs and read them.`;
}
;


// YOUTUBE_VIDEOS_ALL - FIX for ReferenceError - Defined before getVideoObj
const YOUTUBE_VIDEOS_ALL = {
  ML_DISTRICT: { id: "Fll3OY-hilU", url: "https://www.youtube.com/watch?v=Fll3OY-hilU" },
  ML_CORP: { id: "F9rI2crM7Ow", url: "https://www.youtube.com/watch?v=F9rI2crM7Ow" },
  ML_MUNI: { id: "F9rI2crM7Ow", url: "https://www.youtube.com/watch?v=F9rI2crM7Ow" },
  ML_CENTER: { id: "Ds0lBtTaI6c", url: "https://www.youtube.com/watch?v=Ds0lBtTaI6c" },
  EN_DISTRICT: { id: "_y2JeFHBnqg", url: "https://www.youtube.com/watch?v=_y2JeFHBnqg" },
  EN_CORP: { id: "GqolfqgHiCU", url: "https://www.youtube.com/watch?v=GqolfqgHiCU" },
  EN_MUNI: { id: "GqolfqgHiCU", url: "https://www.youtube.com/watch?v=GqolfqgHiCU" },
  EN_CENTER: { id: "r0X77XfmF94", url: "https://www.youtube.com/watch?v=r0X77XfmF94" },
  HI_DISTRICT: { id: "_y2JeFHBnqg", url: "https://www.youtube.com/watch?v=_y2JeFHBnqg" },
  HI_CORP: { id: "GqolfqgHiCU", url: "https://www.youtube.com/watch?v=GqolfqgHiCU" },
  ml: {
    district: "https://www.youtube.com/watch?v=Fll3OY-hilU",
    corp: "https://www.youtube.com/watch?v=F9rI2crM7Ow",
    muni: "https://www.youtube.com/watch?v=F9rI2crM7Ow",
    center: "https://www.youtube.com/watch?v=Ds0lBtTaI6c",
    knowCompany: "https://www.youtube.com/watch?v=8ZnDlvbgG_c"
  },
  en: {
    district: "https://www.youtube.com/watch?v=_y2JeFHBnqg",
    corp: "https://www.youtube.com/watch?v=GqolfqgHiCU",
    muni: "https://www.youtube.com/watch?v=GqolfqgHiCU",
    center: "https://www.youtube.com/watch?v=r0X77XfmF94",
    knowCompany: "https://www.youtube.com/watch?v=8ZnDlvbgG_c"
  },
  hi: {
    district: "https://www.youtube.com/watch?v=_y2JeFHBnqg",
    corp: "https://www.youtube.com/watch?v=GqolfqgHiCU",
    muni: "https://www.youtube.com/watch?v=GqolfqgHiCU",
    center: "https://www.youtube.com/watch?v=r0X77XfmF94",
    knowCompany: "https://www.youtube.com/watch?v=8ZnDlvbgG_c"
  }
};



function getVideoObj(sub, lang){
  if(lang==='ml'){
    if(sub==='OPP_DISTRICT') return YOUTUBE_VIDEOS_ALL.ML_DISTRICT;
    if(sub==='OPP_CORP') return YOUTUBE_VIDEOS_ALL.ML_CORP;
    if(sub==='OPP_CENTER') return YOUTUBE_VIDEOS_ALL.ML_CENTER;
  }
  if(sub==='OPP_DISTRICT') return YOUTUBE_VIDEOS_ALL.EN_DISTRICT;
  if(sub==='OPP_CORP') return YOUTUBE_VIDEOS_ALL.EN_CORP;
  if(sub==='OPP_CENTER') return YOUTUBE_VIDEOS_ALL.EN_CENTER;
  return YOUTUBE_VIDEOS_ALL.EN_DISTRICT;
}

function getTrackingLink(domain, phone, lang, sub, videoObj, district){
  const type = sub.replace('OPP_','').toLowerCase();
  const params = new URLSearchParams({
    phone: phone,
    lang: lang,
    type: type,
    videoId: videoObj.id,
    district: district || 'Idukki',
    fee: videoObj.fee
  });
  return `${domain}/video-watch?${params.toString()}`;
}

function getVideoIdFromUrl(url){
  const m = url.match(/youtu\.be\/([^?]+)/) || url.match(/v=([^&]+)/);
  return m ? m[1] : 'Fll3OY-hilU';
}

function getStateSections(lang){
  return [{
    title: lang==='ml' ? 'സംസ്ഥാനങ്ങൾ' : 'States',
    rows: ALL_STATES.slice(0,10).map((s) => ({
      id: `STATE_${s.toUpperCase().replace(/[^A-Z0-9]/g,'_')}`,
      title: s.substring(0,24),
      description: `Select ${s}`
    }))
  },
  {
    title: lang==='ml' ? 'കേരളം (നിലവിൽ)' : 'Kerala (Current)',
    rows: [{ id: 'STATE_KERALA', title: 'Kerala', description: lang==='ml' ? 'നിലവിൽ കേരളം മാത്രം' : 'Currently Kerala only - 14 Districts' }]
  }];
}

function getDistrictSections(lang, stateName){
  if(stateName!=='Kerala' && stateName!=='KERALA'){
    return [{
      title: 'Coming Soon',
      rows: [{ id: 'DIST_COMING_SOON', title: `${stateName} - Coming Soon`, description: 'Currently Kerala only, other states soon' }]
    }];
  }
  const districts = KERALA_DATA.districts;
  return [
    {
      title: lang==='ml' ? 'ജില്ലകൾ 1-10' : 'Districts 1-10',
      rows: districts.slice(0,10).map(d => ({
        id: `DIST_${d.code}`,
        title: d.name.substring(0,24),
        description: `${d.corporation.length>0 ? d.corporation[0].split(' ')[0]+' Corp + ' : ''}${d.municipalities.length} Muni - 1 slot`
      }))
    },
    {
      title: lang==='ml' ? 'ജില്ലകൾ 11-14' : 'Districts 11-14',
      rows: districts.slice(10,14).map(d => ({
        id: `DIST_${d.code}`,
        title: d.name.substring(0,24),
        description: `${d.municipalities.length} Municipalities - 1 slot`
      }))
    }
  ];
}

function getCorpMuniSections(lang, districtCode){
  const dist = KERALA_DATA.districts.find(d => d.code === districtCode);
  if(!dist) return [];
  const sections = [];
  if(dist.corporation.length>0){
    sections.push({
      title: lang==='ml' ? 'കോർപ്പറേഷൻ (4 സ്ലോട്ട്)' : 'Corporation (4 slots)',
      rows: dist.corporation.map((corp, idx) => ({
        id: `CORP_${districtCode}_${idx}`,
        title: corp.replace(' Corporation','').substring(0,24),
        description: lang==='ml' ? '4 സ്ലോട്ട് - 4 സോൺ' : '4 slots - 4 zones'
      }))
    });
  }
  if(dist.municipalities.length>0){
    const chunks = [];
    for(let i=0; i<dist.municipalities.length; i+=10){
      chunks.push(dist.municipalities.slice(i, i+10));
    }
    chunks.forEach((chunk, chunkIdx) => {
      sections.push({
        title: lang==='ml' ? `മുനിസിപ്പാലിറ്റി ${chunkIdx+1}` : `Municipality ${chunkIdx+1}`,
        rows: chunk.map((muni, idx) => ({
          id: `MUNI_${districtCode}_${chunkIdx*10+idx}`,
          title: muni.substring(0,24),
          description: lang==='ml' ? '1 സ്ലോട്ട് മാത്രം' : '1 slot only'
        }))
      });
    });
  }
  return sections;
}

async function checkBooking(areaType, areaName) {
  let booked = 0;
  if(redisReady && redis){
    try{
      const key = `booking:${areaType}:${areaName.toLowerCase().replace(/[^a-z0-9]/g,'_')}`;
      const val = await redis.get(key);
      if(val) booked = parseInt(val) || 0;
    }catch(e){ console.log('booking check fail', e.message); }
  }
  let maxSlots = 1;
  if(areaType==='district') maxSlots = 1;
  if(areaType==='corporation') maxSlots = 4;
  if(areaType==='municipality') maxSlots = 1;
  if(areaType==='business_center') maxSlots = 3;
  const remaining = maxSlots - booked;
  return { booked, maxSlots, remaining, available: remaining > 0, status: remaining > 0 ? `Available ${remaining}/${maxSlots}` : `Fully Booked ${booked}/${maxSlots}` };
}

async function saveBooking(areaType, areaName) {
  if(redisReady && redis){
    try{
      const key = `booking:${areaType}:${areaName.toLowerCase().replace(/[^a-z0-9]/g,'_')}`;
      await redis.incr(key);
      await redis.expire(key, 86400*30);
      console.log(`BOOKING SAVED ${key}`);
    }catch(e){ console.log('booking save fail', e.message); }
  }
}

function formatChanceMessage(lang, areaName, fee, bookingInfo, altOptions){
  const L = T[lang]||T.en;
  const slotInfo = lang==='ml' 
    ? `${areaName} - ${bookingInfo.remaining}/${bookingInfo.maxSlots} സ്ലോട്ട് ബാക്കി (ബുക്ക് ചെയ്തത് ${bookingInfo.booked}/${bookingInfo.maxSlots})`
    : `${areaName} - ${bookingInfo.remaining}/${bookingInfo.maxSlots} slots left (Booked ${bookingInfo.booked}/${bookingInfo.maxSlots})`;
  if(bookingInfo.available){
    let template = L.chanceAvailable || `🎉 {AREA} AVAILABLE!\n{SLOT_INFO}\nFee: {FEE}`;
    return template.replace('{AREA}', areaName).replace('{SLOT_INFO}', slotInfo).replace('{FEE}', fee).replace('{FEE}', fee);
  } else {
    let template = L.chanceBooked || `❌ {AREA} FULLY BOOKED!\n{SLOT_INFO}\nTry {ALT_OPTIONS}`;
    const altText = altOptions || (lang==='ml' ? 'മറ്റ് ജില്ല/മുനിസിപ്പാലിറ്റി/ബിസിനസ് സെന്റർ' : 'Other District/Municipality/Business Center');
    return template.replace('{AREA}', areaName).replace('{SLOT_INFO}', slotInfo).replace('{ALT_OPTIONS}', altText);
  }
}

// Image message helper missing in V149
function imageMessage(to, imageUrl, caption, phoneId){
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'image',
    image: { link: imageUrl, caption: caption ? caption.substring(0,1024) : '' },
    _phoneId: phoneId
  };
}





const LINKS_V92 = {
  website: WEBSITE,
  driverApp: PLAY_STORE,
  // 8 PDFs Total - 2 District, 2 Municipal+Corp, 4 Business Center
  tenderDistrict: "https://bizmapia.com/tender/district.pdf",
  tenderDistrictAnnexure: "https://bizmapia.com/tender/district_annexure.pdf",
  tenderCorporation: "https://bizmapia.com/tender/corporation.pdf",
  tenderCorporationAnnexure: "https://bizmapia.com/tender/corporation_annexure.pdf",
  tenderBusinessCenter: "https://bizmapia.com/tender/business_center.pdf",
  tenderBusinessCenterAnnexure: "https://bizmapia.com/tender/business_center_annexure.pdf",
  tenderBusinessCenterAgreement: "https://bizmapia.com/tender/business_center_agreement.pdf",
  tenderBusinessCenterBrochure: "https://bizmapia.com/tender/business_center_brochure.pdf",
  businessLink: "https://bizmapia.com/business",
  earnLink: EARN_LINK,
  razorpay: "https://rzp.io/rzp/BZ9D9rT",
  razorpayCorp: "https://rzp.io/rzp/ptj9OGpr",
  razorpayCenter: "https://rzp.io/rzp/lAguvzEt"
};

function getRegistrationFee(sub){
  if(sub==='OPP_DISTRICT') return 250;
  if(sub==='OPP_CORP') return 150;
  if(sub==='OPP_CENTER') return 100;
  return 250;
}
function getRazorpayLinkForSub(sub){
  if(sub==='OPP_DISTRICT') return 'https://rzp.io/rzp/BZ9D9rT';
  if(sub==='OPP_CORP') return 'https://rzp.io/rzp/ptj9OGpr';
  if(sub==='OPP_CENTER') return 'https://rzp.io/rzp/lAguvzEt';
  return 'https://rzp.io/rzp/BZ9D9rT';
}

function getRegistrationFeeTab(){
  return 'Registration_Fee';
}

const PRICING = {
  DISTRICT: { WITH_CORP: 15, WITHOUT_CORP: 10 },
  CORP: { WITH_CORP: 5, WITHOUT_CORP: 4 },
  CENTER: { DEFAULT: 1 }
};

function getEMIText(lang, fee){
  if(fee>=15){
    return lang==='ml' ? `💳 EMI ഓപ്ഷനുകൾ ${fee}L-ന്:\n\n1️⃣ Option 1: Down 5L + 10 മാസം x 1L = ${fee}L

2️⃣ Option 2: Down 5L + 20 മാസം x 50k = ${fee}L` :
           lang==='hi' ? `💳 EMI विकल्प ${fee} लाख के लिए:\n\n1️⃣ विकल्प 1: डाउन 5 लाख + 10 महीने x 1 लाख = ${fee} लाख

2️⃣ विकल्प 2: डाउन 5 लाख + 20 महीने x 50 हजार = ${fee} लाख` :
           `💳 EMI Options for ${fee}L:\n\n1️⃣ Option 1: Down 5L + 10 Months x 1L = ${fee}L

2️⃣ Option 2: Down 5L + 20 Months x 50k = ${fee}L`;
  } else if(fee>=10){
    return lang==='ml' ? `💳 EMI ഓപ്ഷനുകൾ ${fee}L-ന്:\n\n1️⃣ Option 1: Down 5L + 10 മാസം x 50k = ${fee}L

2️⃣ Option 2: Down 5L + 20 മാസം x 25k = ${fee}L` :
           lang==='hi' ? `💳 EMI विकल्प ${fee} लाख के लिए:\n\n1️⃣ विकल्प 1: डाउन 5 लाख + 10 महीने x 50 हजार = ${fee} लाख

2️⃣ विकल्प 2: डाउन 5 लाख + 20 महीने x 25 हजार = ${fee} लाख` :
           `💳 EMI Options for ${fee}L:\n\n1️⃣ Option 1: Down 5L + 10 Months x 50K = ${fee}L

2️⃣ Option 2: Down 5L + 20 Months x 25K = ${fee}L`;
  } else if(fee===5){
    return lang==='ml' ? `💳 EMI ഓപ്ഷനുകൾ ${fee}L-ന്:\n\n1️⃣ Option 1: Down 3L + 10 മാസം x 20k = ${fee}L

2️⃣ Option 2: Down 3L + 20 മാസം x 10k = ${fee}L` :
           lang==='hi' ? `💳 EMI विकल्प ${fee} लाख के लिए:\n\n1️⃣ विकल्प 1: डाउन 3 लाख + 10 महीने = ${fee} लाख

2️⃣ विकल्प 2: डाउन 3 लाख + 20 महीने = ${fee} लाख` :
           `💳 EMI Options for ${fee}L:\n\n1️⃣ Option 1: Down 3L + 10 Months x 20k = ${fee}L

2️⃣ Option 2: Down 3L + 20 Months x 10k = ${fee}L`;
  } else if(fee===4){
    return lang==='ml' ? `💳 EMI ഓപ്ഷനുകൾ ${fee}L-ന്:\n\n1️⃣ Option 1: Down 2L + 10 മാസം x 20k = ${fee}L

2️⃣ Option 2: Down 2L + 20 മാസം x 10k = ${fee}L` :
           lang==='hi' ? `💳 EMI विकल्प ${fee} लाख के लिए:\n\n1️⃣ विकल्प 1: डाउन 2 लाख + 10 महीने x 20 हजार = ${fee} लाख

2️⃣ विकल्प 2: डाउन 2 लाख + 20 महीने x 10 हजार = ${fee} लाख` :
           `💳 EMI Options for ${fee}L:\n\n1️⃣ Option 1: Down 2L + 10 Months x 20k = ${fee}L

2️⃣ Option 2: Down 2L + 20 Months x 10k = ${fee}L`;
  } else {
    // Business Center 1L: 5 months and 9 months as per requirement (not 10/20)
    return lang==='ml' ? `Business Center ${fee}L-ന് EMI: Option 1: Down Rs.30000 + 5 മാസം x Rs.14000 = ${fee}L

2️⃣ Option 2: Down Rs.30000 + 9 മാസം x Rs.7778 = ${fee}L` :
           lang==='hi' ? `Business Center ${fee} लाख के लिए EMI: विकल्प 1: डाउन 30 हजार + 5 महीने x 14 हजार = ${fee} लाख

2️⃣ विकल्प 2: डाउन 30 हजार + 9 महीने x 7778 = ${fee} लाख` :
           `Business Center EMI for ${fee}L: Option 1: Down Rs.30000 + 5 Months x Rs.14000 = ${fee}L

2️⃣ Option 2: Down Rs.30000 + 9 Months x Rs.7778 = ${fee}L`;
  }
}
function getFee(sub, corpYes){
  if(sub==='OPP_DISTRICT'){ return corpYes ? PRICING.DISTRICT.WITH_CORP : PRICING.DISTRICT.WITHOUT_CORP; }
  else if(sub==='OPP_CORP'){ return corpYes ? PRICING.CORP.WITH_CORP : PRICING.CORP.WITHOUT_CORP; }
  else if(sub==='OPP_CENTER'){ return PRICING.CENTER.DEFAULT; }
  return 15;
}

function getTokenFee(sub){
  if(sub==='OPP_DISTRICT') return 250;
  if(sub==='OPP_CORP') return 150;
  if(sub==='OPP_CENTER') return 100;
  return 250;
}
function saveRegistrationFee(phone, sub, fee){
  try{
    const regFee = getTokenFee(sub);
    const link = getRazorpayLinkForSub(sub);
    const data = {
      phone: phone,
      franchise_type: sub,
      registration_fee: regFee,
      full_fee: fee+'L',
      razorpay_link: link,
      timestamp: getISTTime(),
      date_ist: new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})
    };
    saveToSheet('Registration_Fee', data).catch(()=>{});
    saveToSheet(getRegistrationFeeTab(), data).catch(()=>{});
  }catch(e){ console.log('REG FEE SAVE FAIL', e.message); }
}
function getRegistrationFeeForSheet(sub){ return getTokenFee(sub); }
function getTokenFeeText(sub){
  const fee = getTokenFee(sub);
  if(sub==='OPP_DISTRICT') return `District Franchise - Registration Fee Rs${fee} (Not refundable)`;
  if(sub==='OPP_CORP') return `Corp/Municipal Franchise - Registration Fee Rs${fee} (Not refundable)`;
  if(sub==='OPP_CENTER') return `Business Center - Registration Fee Rs${fee} (Not refundable)`;
  return `Registration Fee Rs${fee} (Not refundable)`;
}


function getFranchiseName(sub, corpYes){
  if(sub==='OPP_DISTRICT'){ return corpYes ? 'District with Corporation' : 'District without Corporation'; }
  else if(sub==='OPP_CORP'){ return corpYes ? 'Corporation Franchise' : 'Municipal Franchise'; }
  else if(sub==='OPP_CENTER'){ return 'Business Center'; }
  return 'Franchise';
}
function getReadyText(lang, fee, franchiseName){
  if(lang==='ml'){ return `✅ നിങ്ങൾ അപേക്ഷ സമർപ്പിക്കാൻ പോകുന്നു.\n\n🏢 ${franchiseName} ഫീസായി ${fee} ലക്ഷം രൂപ നൽകാൻ നിങ്ങൾ തയ്യാറാണെന്ന് സ്ഥിരീകരിക്കുന്നു.\n\n👉 തയ്യാറാണെങ്കിൽ താഴെ ക്ലിക്ക് ചെയ്യുക.`; }
  else if(lang==='hi'){ return `✅ आप आवेदन जमा करने जा रहे हैं।\n\n🏢 ${franchiseName} शुल्क के रूप में ${fee} लाख रुपये का भुगतान करने के लिए तैयार हैं, इसकी पुष्टि करें।\n\n👉 तैयार हैं तो नीचे क्लिक करें।`; }
  else { return `✅ You are going to submit application.\n\n🏢 Confirming you are ready to pay ${fee} Lakhs as ${franchiseName} franchise fee.\n\n👉 If ready, click below.`; }
}

async function createRazorpayPaymentLink(uid, sub, fee){
  try{
    if(sub==='OPP_DISTRICT') return 'https://rzp.io/rzp/BZ9D9rT';
    if(sub==='OPP_CORP') return 'https://rzp.io/rzp/ptj9OGpr';
    if(sub==='OPP_CENTER') return 'https://rzp.io/rzp/lAguvzEt';
    if(fee===1) return 'https://rzp.io/rzp/lAguvzEt';
    if(fee===4 || fee===5) return 'https://rzp.io/rzp/ptj9OGpr';
    return 'https://rzp.io/rzp/BZ9D9rT';
  }catch(e){
    return 'https://rzp.io/rzp/BZ9D9rT';
  }
}

function verifyRazorpaySignature(body, signature, secret){
  try{
    const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
    return expected === signature;
  }catch{ return false; }
}

function getPayText(lang, fee, sub){
  const token = getTokenFee(sub||'OPP_DISTRICT');
  // PURE LANGUAGE RULE: ML=100% Malayalam, HI=100% Hindi, EN=100% English - NO MIXING - V207 + STANDARD EMOJIS + SPACING
  if(lang==='ml'){
    let oppMl = 'ബിസിനസ് സെന്റർ അവസരം';
    if(sub==='OPP_DISTRICT') oppMl = 'ജില്ലാ ഫ്രാഞ്ചൈസി അവസരം';
    else if(sub==='OPP_CORP') oppMl = 'കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി അവസരം';
    return `🙏 ${oppMl} തിരഞ്ഞെടുത്തതിന് നന്ദി.\n\n📄 നിങ്ങളുടെ കരാർ, വരുമാന രേഖകൾ ഡൗൺലോഡ് ചെയ്യാൻ\n\n💳 രജിസ്ട്രേഷൻ ഫീ Rs.${token} ഇപ്പോൾ അടയ്ക്കുക.`;
  }
  if(lang==='hi'){
    let oppHi = 'बिजनेस सेंटर अवसर';
    if(sub==='OPP_DISTRICT') oppHi = 'जिला फ्रेंचाइजी अवसर';
    else if(sub==='OPP_CORP') oppHi = 'कॉर्पोरेशन / म्युनिसिपल फ्रेंचाइजी अवसर';
    return `🙏 ${oppHi} चुनने के लिए धन्यवाद।\n\n📄 अपने समझौता और आय दस्तावेज़ डाउनलोड करने के लिए\n\n💳 पंजीकरण शुल्क Rs.${token} अभी भुगतान करें।`;
  }
  let oppName = 'Business Center opportunity';
  if(sub==='OPP_DISTRICT') oppName = 'District Franchise opportunity';
  else if(sub==='OPP_CORP') oppName = 'Corporation / Municipal Franchise opportunity';
  return `🙏 Thanks for choosing ${oppName}.\n\n📄 To download your Agreement and Income documents\n\n💳 Pay your registration fee Rs.${token} now.`;
}
function getPayNowTitle(lang){
  if(lang==='ml') return 'ഇപ്പോൾ അടയ്ക്കുക';
  if(lang==='hi') return 'अभी भुगतान करें';
  return 'Pay Now';
}

const HELP_ADMIN = '8590183646';
const HELP_MARKETING = '8590175977';
const HELP_HUMAN = '8590175977';
const PAY_VERIFY_TEXT = { en: '✅ I Paid - Verify Now', hi: '✅ मैंने भुगतान किया - Verify करें', ml: '✅ ഞാൻ അടച്ചു - Verify ചെയ്യുക' };
const HUMAN_TALK_TEXT = { en: '📞 Talk to Human', hi: '📞 मानव से बात करें', ml: '📞 ടീമിനോട് സംസാരിക്കൂ' };
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
    // Auto-ensure 8 sheets exist
    try{
      const spreadsheetId = process.env.SHEET_ID || '1p_A3F_ie2JLguQTmn9WaJqFgNHNn_52B2Vuk8nRELto';
      const meta = await sheetsClient.spreadsheets.get({spreadsheetId});
      const existingTitles = meta.data.sheets.map(s=>s.properties.title);
      const required8 = ['System_Logs','Master_Leads','Franchise_Funnel','Payments','Ride_Hailing','Business_Directory','Delivery','Booking','Registration_Fee'];
      const missing = required8.filter(t=>!existingTitles.includes(t));
      if(missing.length>0){
        console.log('Creating missing 8 sheets:', missing.join(','));
        const requests = missing.map(title=>({addSheet:{properties:{title}}}));
        await sheetsClient.spreadsheets.batchUpdate({spreadsheetId, requestBody:{requests}});
        console.log('Created missing sheets');
      }
    }catch(e){ console.log('8 sheets check error', e.message); }
    return sheetsClient;
  }catch(e){ console.log('getSheets error', e.message); return null; }
}


const ALLOWED_SHEETS = ['System_Logs','Master_Leads','Franchise_Funnel','Payments','Ride_Hailing','Business_Directory','Delivery','Booking','Registration_Fee'];
const OLD_TABS_MAP = {
  'Leads':'System_Logs','No_Language':'System_Logs','HI_Reset':'System_Logs','Franchise_Leads':'Master_Leads','Franchise_Submit':'Franchise_Funnel','Franchise_Benefits':'Franchise_Funnel','Franchise_Support':'Franchise_Funnel','Franchise_Requirements':'Franchise_Funnel','Franchise_CorpCheck':'Franchise_Funnel','Franchise_EMI':'Franchise_Funnel','Franchise_EMI_Selected':'Franchise_Funnel','Franchise_NotPaid':'Franchise_Funnel','Franchise_Ready15L':'Franchise_Funnel','Franchise_Occupation':'Master_Leads','Franchise_Date':'Master_Leads','Franchise_PayDone':'Payments','Franchise_PayDone_VERIFIED':'Payments','Payment_Failed':'Payments','Unverified_Payments':'Payments','OPP_District':'Franchise_Funnel','OPP_Corp':'Franchise_Funnel','OPP_Center':'Franchise_Funnel','App_Install':'System_Logs','Attach_Cab':'Ride_Hailing','Book_Cab':'Ride_Hailing','Book_Rooms':'Booking','Book_Appointments':'Booking','Book_Movie':'Booking','Order_Stores':'Delivery','Delivery_Partner':'Delivery','Register_Business':'Business_Directory','Start_Advertising':'Business_Directory','Book_Apartments':'Booking'
};
async function saveToSheet(tab, row, isNew){
  let cleanTab = String(tab).trim();
  if(!ALLOWED_SHEETS.includes(cleanTab)){
    const redirected = OLD_TABS_MAP[cleanTab] || 'Franchise_Funnel';
    console.log(`⚠ BLOCKED old tab ${cleanTab} -> Redirecting to ${redirected}`);
    cleanTab = redirected;
  }
  try{
    const sheets = await getSheets();
    if(!sheets){ console.log(`SHEET ${cleanTab}`, row); return; }
    const range = `'${cleanTab}'!A:Z`;
    await sheets.spreadsheets.values.append({spreadsheetId: SHEET_ID, range: range, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [row] }});
    console.log(`SHEET SAVED ${cleanTab} -> ${row[1]||''} : ${row[3]||''}`);
  }catch(e){ console.log(`SHEET FAIL ${cleanTab}`, e.message, row); }
}


async function getState(uid){ if(redisReady){ try{ const v=await redis.get(`state:${uid}`); if(v) return JSON.parse(v);}catch{} } return memoryStore.get(uid)||{}; }
async function setState(uid,s){ s.lastActive = Date.now(); memoryStore.set(uid,s); if(redisReady){ try{ await redis.set(`state:${uid}`, JSON.stringify(s), 'EX', 86400*7);}catch{} } }
function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

function textMessage(to,body, phoneId){ return { messaging_product:'whatsapp', to, type:'text', text:{body:body.substring(0,4096)} , _phoneId: phoneId }; }
function interactiveButton(to,body,buttons, phoneId){
  const btns = buttons.slice(0,3).map(b=>({type:'reply', reply:{id:b.id, title:b.title.substring(0,20)}}));
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{type:'button', body:{text:body.substring(0,1024)}, action:{buttons:btns}}, _phoneId: phoneId };
}

function interactiveWithCallButtons(to, body, replyButtons, phoneNumber, phoneTitle, phoneId){
  // replyButtons: array of {id, title} (max 2 if we add call, max 3 total)
  // phoneNumber: 8590175977, phoneTitle: Call button text
  // Returns payload with both reply buttons + call button (inbuilt dialer)
  try{
    const buttons = [];
    // Add reply buttons (max 2 when we have call button)
    if(replyButtons && replyButtons.length>0){
      for(let i=0;i<Math.min(replyButtons.length,2);i++){
        buttons.push({type:'reply', reply:{id: replyButtons[i].id, title: replyButtons[i].title}});
      }
    }
    // Add call button as CTA? WhatsApp interactive supports call button via action?
    // Using type: phone_number button
    // For Cloud API: we need to use interactive type with action that includes phone_number
    // Actually we will send as separate CTA URL button with tel: link fallback + phone button
    // Best: Use reply button that triggers call + also send contact with phone that is tappable
    
    // For now, we add call button as reply that says Call, but also include phone number in body as clickable
    // WhatsApp auto makes phone numbers in body tappable for dialer
    
    // Add call button as reply that will trigger human handover
    if(phoneNumber && phoneTitle){
      buttons.push({type:'reply', reply:{id:'CALL_DIALER_'+phoneNumber, title: phoneTitle}});
    }
    
    return {
      messaging_product: 'whatsapp',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {text: body},
        action: {buttons: buttons}
      }
    };
  }catch(e){ console.log('interactiveWithCall error', e.message); return interactiveButton(to, body, replyButtons, phoneId); }
}

function interactiveCallDialer(to, body, phoneNumber, phoneTitle, extraButtons, phoneId){
  // New: Sends message with inbuilt dialer - uses WhatsApp CTA call button
  // extraButtons: additional reply buttons
  try{
    // WhatsApp Cloud API now supports call button in interactive?
    // We implement as: interactive with type button + action buttons including phone_number type
    // If not supported, fallback to reply button + phone number in text (which is tappable)
    
    const allButtons = [];
    
    if(extraButtons){
      for(let b of extraButtons.slice(0,2)){
        allButtons.push({type:'reply', reply:{id:b.id, title:b.title}});
      }
    }
    
    // Add call dialer button - using phone_number type (CTA)
    // Payload format for call button
    allButtons.push({type:'reply', reply:{id:'DIAL_'+phoneNumber, title: phoneTitle || `📞 Call ${phoneNumber}`}});
    
    // Include phone number in body to make it tappable (WhatsApp makes numbers clickable)
    const bodyWithPhone = body + `\n\n📞 ${phoneNumber} (Tap to call)`;
    
    return {
      messaging_product: 'whatsapp',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {text: bodyWithPhone},
        action: {buttons: allButtons}
      }
    };
  }catch(e){ console.log('interactiveCallDialer error', e.message); return interactiveButton(to, body, extraButtons, phoneId); }
}

// New: Direct CTA with phone_number button (real inbuilt dialer)
function interactiveWithPhoneCTA(to, body, replyButtons, phoneNumber, phoneId){
  // This uses WhatsApp's native call button - user taps and phone dialer opens
  // Format: action with buttons including type phone_number
  try{
    // Build CTA buttons
    // For Cloud API, we need to use type: cta_url? No, for call we use phone_number
    // Actually supported format for call button in interactive:
    // {type: 'call', payload: ...} - Let's use official format
    
    const buttons = [];
    if(replyButtons){
      for(let b of replyButtons.slice(0,2)){
        buttons.push({type:'reply', reply:{id:b.id, title:b.title}});
      }
    }
    
    // Add phone call button - using special type
    // We will send as separate message type: contacts + interactive?
    // Simplest: Send body with phone number that WhatsApp makes tappable + reply button
    
    // Enhance body to include phone as tappable
    const enhancedBody = body.includes(phoneNumber) ? body : body + `\n\n📞 Tap to call: ${phoneNumber}`;
    
    return {
      messaging_product: 'whatsapp',
      to: to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {text: enhancedBody},
        action: {buttons: buttons.length>0 ? buttons : [{type:'reply', reply:{id:'CALL_'+phoneNumber, title:`📞 Call ${phoneNumber}`}}]}
      }
    };
  }catch(e){
    console.log('interactiveWithPhoneCTA error', e.message);
    return interactiveButton(to, body, replyButtons, phoneId);
  }
}

function ctaButtons(to,body,ctaList, phoneId){
  return { messaging_product:'whatsapp', to, type:'text', text:{body:body.substring(0,4096)}, _phoneId: phoneId, _ctaList: ctaList };
}
function singleCta(to,body,btn, phoneId){
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{ type:'cta_url', body:{text:body.substring(0,1024)}, action:{ name:'cta_url', parameters:{ display_text: btn.title.substring(0,20), url: btn.url } } }, _phoneId: phoneId };
}
async function sendCtaSequence(to, body, ctaList, phoneId){
  try{
    await sendWithDelay(textMessage(to, body, phoneId));
    await delay(400);
    for(let c of ctaList.slice(0,3)){
      if(c.type==='url'){
        await sendWithDelay(singleCta(to, c.title+': Tap below', {title:c.title.substring(0,20), url:c.url}, phoneId));
        await delay(600);
      } else if(c.type==='phone'){
        const phoneClean = c.phone.replace(/\+/g,'');
        await sendWithDelay(textMessage(to, 'Call: '+c.phone+' Tap: tel:'+phoneClean, phoneId));
        await delay(400);
      }
    }
  }catch(e){ console.log('sendCtaSequence error', e.message); }
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
      blockUntil = Date.now()+62*60*1000;
      console.log(`130429 DETECTED BLOCKING 65 MIN`);
    }
  }
}

function getSorryExplain(lang, lastStep, userText){
  // V207: Sorry + Explain last step + No Human before Registration Fee
  const safeText = (userText||'').slice(0,30);
  const last = lastStep||'';
  let stepName = 'this step';
  let whatToDo = '';
  if(lang==='ml'){
    if(last.includes('Company Video')){ stepName='കമ്പനി വീഡിയോ'; whatToDo='വീഡിയോ പൂർണ്ണമായി കാണുക, തുടർന്ന് "കമ്പനി വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക'; }
    else if(last.includes('Video Must Watch') || last.includes('High level') || last.includes('Moderate') || last.includes('Base level') || last.includes('District') || last.includes('Corp') || last.includes('Center')){ stepName='ഫ്രാഞ്ചൈസി വീഡിയോ'; whatToDo='വീഡിയോ പൂർണ്ണമായി കാണുക, തുടർന്ന് "വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക'; }
    else if(last.includes('Benefits')){ stepName='ആനുകൂല്യങ്ങൾ'; whatToDo='ആനുകൂല്യങ്ങൾ വായിക്കുക, മനസ്സിലായെങ്കിൽ "ആനുകൂല്യം മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക'; }
    else if(last.includes('Support')){ stepName='പിന്തുണ'; whatToDo='പിന്തുണ വായിക്കുക, മനസ്സിലായെങ്കിൽ "കണ്ടു മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക'; }
    else if(last.includes('Requirements')){ stepName='ആവശ്യകതകൾ'; whatToDo='ആവശ്യകതകൾ വായിക്കുക, മനസ്സിലായെങ്കിൽ "ആവശ്യകത മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക'; }
    else if(last.includes('Ready')){ stepName='അപേക്ഷ സമർപ്പിക്കൽ'; whatToDo='തയ്യാറാണെങ്കിൽ താഴെ "അതെ തയ്യാർ" ക്ലിക്ക് ചെയ്യുക'; }
    else if(last.includes('EMI')){ stepName='EMI ഓപ്ഷനുകൾ'; whatToDo='താഴെ നിന്ന് ഒരു EMI ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക'; }
    else if(last.includes('Pay') || last.includes('Not Paid')){ stepName='രജിസ്ട്രേഷൻ ഫീ അടയ്ക്കൽ'; whatToDo='രജിസ്ട്രേഷൻ ഫീ അടയ്ക്കുക, തുടർന്ന് "അടച്ചു" ക്ലിക്ക് ചെയ്യുക'; }
    else if(last.includes('Language')){ stepName='ഭാഷ തിരഞ്ഞെടുക്കൽ'; whatToDo='താഴെ നിന്ന് ഭാഷ തിരഞ്ഞെടുക്കുക'; }
    else { stepName='ഈ ഘട്ടം'; whatToDo='താഴെ നൽകിയിരിക്കുന്ന ബട്ടണിൽ ക്ലിക്ക് ചെയ്യുക'; }
    return `😔 ക്ഷമിക്കണം, നിങ്ങളുടെ "${safeText}" എന്ന മറുപടി മനസ്സിലായില്ല.\n\n📄 നിങ്ങൾ ${stepName} ഘട്ടത്തിലാണ്.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: ${whatToDo}.\n\n💡 എന്തെങ്കിലും സംശയമുണ്ടെങ്കിൽ, ആദ്യം ഈ ഘട്ടം പൂർത്തിയാക്കുക, തുടർന്ന് അടുത്ത ഘട്ടങ്ങളിൽ നിങ്ങൾക്ക് ഞങ്ങളുടെ ടീമുമായി ബന്ധപ്പെടാം.`;
  } else if(lang==='hi'){
    if(last.includes('Company Video')){ stepName='कंपनी वीडियो'; whatToDo='वीडियो पूरा देखें, फिर "कंपनी वीडियो देखा" पर क्लिक करें'; }
    else if(last.includes('Video Must Watch') || last.includes('High level') || last.includes('Moderate') || last.includes('Base level') || last.includes('District') || last.includes('Corp') || last.includes('Center')){ stepName='फ्रेंचाइजी वीडियो'; whatToDo='वीडियो पूरा देखें, फिर "वीडियो देखा" पर क्लिक करें'; }
    else if(last.includes('Benefits')){ stepName='लाभ'; whatToDo='लाभ पढ़ें, समझ आईं तो "लाभ समझा" पर क्लिक करें'; }
    else if(last.includes('Support')){ stepName='सपोर्ट'; whatToDo='सपोर्ट पढ़ें, समझ आया तो "देखा और समझा" पर क्लिक करें'; }
    else if(last.includes('Requirements')){ stepName='आवश्यकताएं'; whatToDo='आवश्यकताएं पढ़ें, समझ आईं तो "आवश्यकता समझी" पर क्लिक करें'; }
    else if(last.includes('Ready')){ stepName='आवेदन जमा'; whatToDo='तैयार हैं तो नीचे "हाँ तैयार" पर क्लिक करें'; }
    else if(last.includes('EMI')){ stepName='EMI विकल्प'; whatToDo='नीचे से एक EMI विकल्प चुनें'; }
    else if(last.includes('Pay') || last.includes('Not Paid')){ stepName='पंजीकरण शुल्क भुगतान'; whatToDo='पंजीकरण शुल्क भुगतान करें, फिर "भुगतान किया" पर क्लिक करें'; }
    else if(last.includes('Language')){ stepName='भाषा चयन'; whatToDo='नीचे से भाषा चुनें'; }
    else { stepName='इस चरण'; whatToDo='नीचे दिए गए बटन पर क्लिक करें'; }
    return `😔 माफ़ कीजिए, आपका "${safeText}" जवाब समझ नहीं आया।\n\n📄 आप ${stepName} चरण में हैं।\n\n👉 अब क्या करें: ${whatToDo}।\n\n💡 कोई सवाल है तो पहले यह चरण पूरा करें, फिर अगले चरणों में आप हमारी टीम से संपर्क कर सकते हैं।`;
  } else {
    if(last.includes('Company Video')){ stepName='Company Video'; whatToDo='Watch video fully, then click "Watched Company Video"'; }
    else if(last.includes('Video Must Watch') || last.includes('High level') || last.includes('Moderate') || last.includes('Base level') || last.includes('District') || last.includes('Corp') || last.includes('Center')){ stepName='Franchise Video'; whatToDo='Watch video fully, then click "Watched Video"'; }
    else if(last.includes('Benefits')){ stepName='Benefits'; whatToDo='Read Benefits, if understood click "Understood Benefit"'; }
    else if(last.includes('Support')){ stepName='Support'; whatToDo='Read Support, if understood click "Seen and Understood"'; }
    else if(last.includes('Requirements')){ stepName='Requirements'; whatToDo='Read Requirements, if understood click "Understood Req"'; }
    else if(last.includes('Ready')){ stepName='Submit Application'; whatToDo='If ready, click "Yes Ready" below'; }
    else if(last.includes('EMI')){ stepName='EMI Options'; whatToDo='Select one EMI option from below'; }
    else if(last.includes('Pay') || last.includes('Not Paid')){ stepName='Registration Fee Payment'; whatToDo='Pay registration fee, then click "I Paid"'; }
    else if(last.includes('Language')){ stepName='Language Selection'; whatToDo='Select language from below'; }
    else { stepName='this step'; whatToDo='Click the button below'; }
    return `😔 Sorry, I don't understand your reply "${safeText}".\n\n📄 You are in ${stepName} step.\n\n👉 What to do now: ${whatToDo}.\n\n💡 If you have any query, please complete this step first, then you can contact our team in next steps.`;
  }
}
async function repeatLastStep(uid, state, lang, phoneId){
  const L = T[lang]||T.en;
  const last = state.lastStep||'';
  const sub = state.sub||'';
  console.log(`REPEAT LAST STEP for ${uid} via ${phoneId} - last:${last} sub:${sub} lang:${lang}`);
  const level = state.reminderLevel || 1;
  // PAY STEP - TOP PRIORITY FOR REMINDERS - Handled in scheduleReminder for escalated text, but keep fallback
  if(last.includes('Pay Reg') || last.includes('✅ EMI Selected') || last.includes('Not Paid') || last.includes('Pay Rs') || last.startsWith('Pay ')){
    const fee = state.fee||15;
    const escalatedText = getEscalatedPayText(lang, fee, level);
    console.log(`REMINDER: Pay step level=${level} - sending 3 buttons Yes/No/Call for ${uid}`);
    return await sendWithDelay(interactiveButton(uid, escalatedText, [{id:'PAY_DONE',title:L.payBtn},{id:'PAY_NOT_DONE',title:L.notPaid},{id:'PAY_VERIFY',title:PAY_VERIFY_TEXT[actualLang]||PAY_VERIFY_TEXT['en']},{id:'HUMAN_TALK',title:HUMAN_TALK_TEXT[actualLang]||HUMAN_TALK_TEXT['en']},{id:'CALL_MARKETING',title:`📞 Tap to call: ${HELP_MARKETING} - ${HELP_MARKETING}`}], phoneId));
  }
  if(sub==='RIDE_BOOK' || last==='Book a Cab'){ const escalatedCab = getEscalatedGeneralText(lang, L.bookCab, level, 'Book a Cab'); return await sendCtaSequence(uid, escalatedCab, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId); }
  if(sub==='RIDE_ATTACH' || last==='Attach Cab'){ const escalated = getEscalatedGeneralText(lang, L.attachCab, level, 'Attach Cab'); return await sendCtaSequence(uid, escalated, [{type:'url', title:'Android', url:PLAY_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId); }
  if(sub==='BIZ_REGISTER' || last==='Register Business'){ const escalated = getEscalatedGeneralText(lang, L.bizRegister, level, 'Register'); return await sendCtaSequence(uid, escalated, [{type:'url', title:'Register', url:WEBSITE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId); }
  if(sub==='BIZ_ADS' || last==='Start Advertising'){ const escalated = getEscalatedGeneralText(lang, L.bizAds, level, 'Ads'); return await sendCtaSequence(uid, escalated, [{type:'url', title:'Advertise Now', url:WEBSITE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId); }
  if(sub==='DEL_ORDER' || last==='Order Stores'){ const escalated = getEscalatedGeneralText(lang, L.delOrder, level, 'Order'); return await sendCtaSequence(uid, escalated, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId); }
  if(sub==='DEL_PARTNER' || last==='Delivery Partner'){ const escalated = getEscalatedGeneralText(lang, L.delPartner, level, 'Partner'); return await sendCtaSequence(uid, escalated, [{type:'url', title:'Android', url:PLAY_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId); }
  if(sub==='BOOK_ROOM' || last==='Book Rooms'){ return await sendCtaSequence(uid, L.bookRoom, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId); }
  if(sub==='BOOK_APPOINT' || last==='Book Appointments'){ return await sendCtaSequence(uid, L.bookAppoint, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId); }
  if(sub==='BOOK_MOVIE' || last==='Movie Tickets'){ return await sendCtaSequence(uid, L.bookMovie, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], phoneId); }
  if(sub==='OPP_DISTRICT' || last.includes('High level') || last.includes('District')){ 
  // V155 FIX: tracking link defined correctly
  const videoObj = getVideoObj('OPP_DISTRICT', lang);
  const trackingLink = getTrackingLink('https://bizmapia-bot-8590175977.onrender.com', uid, lang, 'OPP_DISTRICT', videoObj, state.selectedDistrict || 'Idukki');
  await sendWithDelay(singleCta(uid, L.highIntroSingle, {type:'url', title:L.seeVideo, url:getVideoUrl('OPP_DISTRICT', lang)}, phoneId)); await delay(500); return await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}], phoneId)); }
  if(sub==='OPP_CORP' || last.includes('Moderate level') || last.includes('Corp')){ await sendWithDelay(singleCta(uid, L.moderateIntroSingle, {type:'url', title:L.seeVideo, url:getVideoUrl('OPP_CORP', lang)}, phoneId)); await delay(500); return await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}], phoneId)); }
  if(sub==='OPP_CENTER' || last.includes('Base level') || last.includes('Center')){ await sendWithDelay(singleCta(uid, L.baseIntroSingle, {type:'url', title:L.seeVideo, url:getVideoUrl('OPP_CENTER', lang)}, phoneId)); await delay(500); return await sendWithDelay(interactiveButton(uid, 'Next step:-', [{id:'KNOW_BEN',title:L.benBtn},{id:'KNOW_SUP',title:L.supBtn},{id:'KNOW_REQ',title:L.reqBtn}], phoneId)); }
  if(last==='Benefits'){ const escalatedBen = getEscalatedGeneralText(lang, L.benText, level, 'Benefits'); await sendWithDelay(textMessage(uid,escalatedBen, phoneId)); await delay(300); return await sendWithDelay(interactiveWithPhoneCTA(uid,'Next:',[{id:'KNOW_SUP',title:L.supBtn}], HELP_MARKETING, phoneId)); }
  if(last==='Support'){ const escalatedSup = getEscalatedGeneralText(lang, L.supText, level, 'Support'); await sendWithDelay(textMessage(uid,escalatedSup, phoneId)); await delay(300); return await sendWithDelay(interactiveWithPhoneCTA(uid,'Next:',[{id:'KNOW_REQ',title:L.reqBtn}], HELP_MARKETING, phoneId)); }
  if(last==='Requirements'){ const escalatedReq = getEscalatedGeneralText(lang, L.reqText, level, 'Requirements'); await sendWithDelay(textMessage(uid,escalatedReq, phoneId)); await delay(300); return await sendWithDelay(interactiveButton(uid,'Next:',[{id:'SUBMIT_APP',title:L.submitBtn},{id:'KNOW_EMI',title:L.emiBtn}], phoneId)); }
  if(last.includes('Corp Check') || last.includes('Submit Application')){ const escalatedCorp = getEscalatedGeneralText(lang, L.corpQ, level, 'CorpCheck'); return await sendWithDelay(interactiveButton(uid,escalatedCorp,[{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], phoneId)); }
  if(last.includes('Ready')){ const fee = state.fee||15; const franchiseName = state.franchiseName||'Franchise'; let readyText = getReadyText(lang, fee, franchiseName); readyText = getEscalatedGeneralText(lang, readyText, level, 'Ready'); const readyBtnTitle = lang==='ml' ? `അതെ തയ്യാർ - ${fee}L` : lang==='hi' ? `हाँ तैयार - ${fee}L` : `Yes Ready - ${fee}L`; return await sendWithDelay(interactiveButton(uid,readyText,[{id:'READY_15L',title:readyBtnTitle},{id:'KNOW_EMI',title:L.emiBtn}], phoneId)); }
    if(last.includes('Pay Reg') || last.includes('✅ EMI Selected') || last.includes('Not Paid')){ 
    // Reminder flow: Yes paid / Not paid / Call
    return await sendWithDelay(interactiveButton(uid, L.payAfter, [{id:'PAY_DONE',title:L.payBtn},{id:'PAY_NOT_DONE',title:L.notPaid},{id:'PAY_VERIFY',title:PAY_VERIFY_TEXT[actualLang]||PAY_VERIFY_TEXT['en']},{id:'HUMAN_TALK',title:HUMAN_TALK_TEXT[actualLang]||HUMAN_TALK_TEXT['en']},{id:'CALL_MARKETING',title:`📞 Tap to call: ${HELP_MARKETING} - ${HELP_MARKETING}`}])); 
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
    if(last.includes('Company Video')){
      const cMsg2 = lang==='ml' ? `ഹലോ! കമ്പനി വീഡിയോ കണ്ടോ?\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: വീഡിയോ കണ്ടെങ്കിൽ താഴെ "കമ്പനി വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക, തുടർന്ന് വരുമാന തലം തിരഞ്ഞെടുക്കാം:` : lang==='hi' ? `हैलो! कंपनी वीडियो देखा?\n\n👉 अब क्या करें: अगर वीडियो देख लिया है तो नीचे "कंपनी वीडियो देखा" पर क्लिक करें, फिर आय स्तर चुनें:` : `Hello! Did you watch Company video?\n\n👉 👇 What to do now: If you watched full video, click "Watched Company Video" below, then select Income Level:`;
      const cW = lang==='ml' ? 'കമ്പനി വീഡിയോ കണ്ടു' : lang==='hi' ? 'कंपनी वीडियो देखा' : 'Watched Company Video';
      const cN = lang==='ml' ? 'കമ്പനി വീഡിയോ കണ്ടില്ല' : lang==='hi' ? 'कंपनी वीडियो नहीं देखा' : 'Company Video Not Seen';
      return await sendWithDelay(interactiveButton(uid, cMsg2, [{id:'COMPANY_WATCHED',title:cW},{id:'COMPANY_NOT_WATCHED',title:cN}], phoneId));
    }
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
  deleteReminderFromRedis(uid, '').catch(e=>console.log('clearReminders redis error', e.message));
}
function getEscalatedPayText(lang, fee, level, sub){ const token = getTokenFee(sub||'OPP_DISTRICT');
  // FOMO + Social Proof + Scarcity - V182
  if(lang==='ml'){
    if(level===1) return `👋 ഓർമ്മപ്പെടുത്തൽ: നിങ്ങൾ ${fee}L-ന് തയ്യാറായി!\n\n⚠️ ഇത് ${fee}L-ന്റെ ഭാഗമല്ല (Not refundable). Rs${token} അടച്ചാൽ 📄 Tender + Annexure-B ഉടൻ ലഭിക്കും.\n\n👇 ഇപ്പോൾ അടയ്ക്കൂ, സ്ലോട്ട് നഷ്ടപ്പെടാതിരിക്കാൻ:`;
    if(level===12) return `⚠️ നിങ്ങളുടെ ${fee}L ഏരിയ ഇപ്പോഴും ലോക്ക് ആയിട്ടില്ല!\n\n🔥 ഇന്ന് ${fee}L-ന് 3 പേർ അന്വേഷിച്ചു. നിങ്ങളുടെ ജില്ലയിലെ സ്ലോട്ട് പരിമിതം!\n\nRs${token} (Not refundable, ${fee}L-ന്റെ ഭാഗമല്ല) അടച്ചാൽ 📄 Tender + Annexure-B + ⭐ Priority Verification ലഭിക്കും.\n\n👇 ഇപ്പോൾ ലോക്ക് ചെയ്യൂ:`;
    if(level===24) return `⏰ അവസാന ഓർമ്മപ്പെടുത്തൽ! നിങ്ങളുടെ ${fee}L ഏരിയ അടുത്ത ആളിന് പോകാൻ പോകുന്നു!\n\n🚨 നാളെ മുതൽ പുതിയ അപേക്ഷകർ queue-ൽ. ഇന്ന് Rs${token} (Not refundable) അടച്ചില്ലെങ്കിൽ സ്ലോട്ട് നഷ്ടമാകും!\n\n📄 Tender + Annexure-B ഇപ്പോൾ തന്നെ ലഭിക്കാൻ 👇 Pay ചെയ്യൂ അല്ലെങ്കിൽ Call ${'${HELP_MARKETING}'}:`;
  } else if(lang==='hi'){
    if(level===1) return `👋 रिमाइंडर: आप ${fee}L के लिए तैयार!\n\n⚠️ यह ${fee}L का हिस्सा नहीं है (Not refundable). Rs${token} पर 📄 Tender + Annexure-B तुरंत मिलेगा।\n\n👇 अभी पे करें, स्लॉट न खोएं:`;
    if(level===12) return `⚠️ आपका ${fee}L एरिया अभी भी लॉक नहीं!\n\n🔥 आज ${fee}L के लिए 3 लोगों ने पूछा। आपके जिले में स्लॉट लिमिटेड!\n\nRs${token} (Not refundable, ${fee}L का हिस्सा नहीं) पर 📄 Tender + Annexure-B + ⭐ Priority Verification मिलेगा।\n\n👇 अभी लॉक करें:`;
    if(level===24) return `⏰ अंतिम रिमाइंडर! आपका ${fee}L एरिया अगले व्यक्ति को जाने वाला है!\n\n🚨 कल से नए आवेदक queue में। आज Rs${token} (Not refundable) नहीं भरा तो स्लॉट चला जाएगा!\n\n📄 Tender + Annexure-B अभी पाने के लिए 👇 Pay करें या Call ${'${HELP_MARKETING}'}:`;
  } else {
    if(level===1) return `👋 Reminder: You confirmed ${fee}L!\n\n⚠️ This is NOT part of ${fee}L (Not refundable). Pay Rs${token} to get 📄 Tender + Annexure-B instantly.\n\n👇 Pay now to secure your slot:`;
    if(level===12) return `⚠️ Your ${fee}L area is still NOT locked!\n\n🔥 🔥 3 people enquired for ${fee}L today. ⚠️ Slots in your district are limited!\n\nPay Rs${token} (Not refundable, NOT part of ${fee}L) to get 📄 Tender + Annexure-B + ⭐ Priority Verification.\n\n👇 Lock it now:`;
    if(level===24) return `⏰ FINAL Reminder! Your ${fee}L area is about to go to next person!\n\n🚨 🚨 New applicants in queue from tomorrow. If you don't pay Rs${token} (Not refundable) today, you'll lose your slot!\n\nGet 📄 Tender + Annexure-B now 👇 Pay or Call ${'${HELP_MARKETING}'}:`;
  }
  return `💳 After Registration Fee Rs${token} (Not refundable, NOT part of fee) payment, please select:-`;
}

function getEscalatedGeneralText(lang, originalText, level, stepName){
  if(level===1) return originalText;
  if(level===12){
    if(lang==='ml') return `⚠ ഓർമ്മപ്പെടുത്തൽ: ${originalText}\n\n🔥 നിങ്ങളുടെ സ്ലോട്ട് ഇപ്പോഴും ഓപ്പൺ ആണ്! ഇന്ന് 3 പേർ ${stepName} നോക്കി. തുടരാൻ താഴെ ക്ലിക്ക് ചെയ്യൂ!`;
    if(lang==='hi') return `⚠ रिमाइंडर: ${originalText}\n\n🔥 आपका स्लॉट अभी भी ओपन है! आज 3 लोगों ने ${stepName} देखा। जारी रखने के लिए नीचे क्लिक करें!`;
    return `⚠ Reminder: ${originalText}\n\n🔥 Your slot is still open! 3 people checked ${stepName} today. Click below to continue!`;
  }
  if(level===24){
    if(lang==='ml') return `⏰ അവസാന ഓർമ്മപ്പെടുത്തൽ: ${originalText}\n\n🚨 നാളെ മുതൽ പുതിയ ആളുകൾ queue-ൽ! ഇന്ന് പൂർത്തിയാക്കിയില്ലെങ്കിൽ സ്ലോട്ട് നഷ്ടമാകും. 👇 ഇപ്പോൾ തുടരൂ!`;
    if(lang==='hi') return `⏰ अंतिम रिमाइंडर: ${originalText}\n\n🚨 कल से नए लोग queue में! आज पूरा नहीं किया तो स्लॉट चला जाएगा। 👇 अभी जारी रखें!`;
    return `⏰ FINAL Reminder: ${originalText}\n\n🚨 New people in queue from tomorrow! If not completed today, you'll lose slot. 👇 Continue now!`;
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
      if(type.endsWith(':1') && !type.endsWith(':12') && !type.endsWith(':24') && lastActive < 30*60*1000){ console.log(`Skipping 1h reminder, active ${lastActive}ms ago`); return; }
      const actualLang = state.lang || lang || 'en';
      const actualPhoneId = state.phoneId || phoneId || PHONE_NUMBER_ID;
      const level = type.endsWith(':24') || type.includes('level-24') ? 24 : (type.endsWith(':12') || type.includes('level-12') ? 12 : 1);
      console.log(`REMINDER FIRING ${type} level=${level} to ${uid} via ${actualPhoneId} last=${state?.lastStep} - escalated`);
      // V207 FIX: Stale reminder guard - Never show Language/Main Menu reminder if user already past that step (e.g. in Pay step)
      // Your 8:30 screenshot: Pay at 8:24, then Main Menu (Malayalam thanks + services) at 8:30 = old noLang/noService reminder firing late
      if((type.startsWith('noLang')||type.startsWith('noService')||type.includes('noLang')||type.includes('noService'))){
        const pastStart = state.lang && state.lastStep && !['First Message','HI - Reset','Language en','Language ml','Language hi','Language'].includes(state.lastStep);
        if(pastStart){
          console.log(`V207 SKIP stale noLang/noService reminder - user already in ${state.lastStep}, not at start`);
          return;
        }
      }
      // V207: Company Video 2-min guard - if user already past Company Video, skip
      if(type.includes('COMPANY_VIDEO_2MIN') && state.lastStep && !state.lastStep.includes('Company Video')){
        console.log(`V207 SKIP stale Company Video reminder - user already in ${state.lastStep}`);
        return;
      }
      // V207: Franchise Video 2-min guard - if user already past Video, skip
      if(type.includes('VIDEO_2MIN') && !type.includes('COMPANY') && state.lastStep && !state.lastStep.includes('Video')){
        console.log(`V207 SKIP stale Franchise Video reminder - user already in ${state.lastStep}`);
        return;
      }
      if(type.startsWith('noLang')||type.startsWith('noService')){
        const L = T[actualLang]||T.en;
        let welcomeText = L.welcome;
        // FOMO for welcome - short + urgent
        if(level===1){
          // 1h: Keep original welcome (already sent, this is reminder)
          welcomeText = L.welcome;
        }
        if(level===12){
          // 12h: Short FOMO version - don't repeat long welcome
          if(actualLang==='ml'){
            welcomeText = `⚠️ നിങ്ങൾ ഇതുവരെ ഭാഷ തിരഞ്ഞെടുത്തില്ല!\n\n🔥 നിങ്ങളുടെ ജില്ലയിലെ സ്ലോട്ട് പരിമിതം! ഇന്ന് 3 പേർ ബിസിനസ് അവസരം നോക്കി.\n\n👇 ഇപ്പോൾ ഭാഷ തിരഞ്ഞെടുത്ത് തുടരൂ:`;
          } else if(actualLang==='hi'){
            welcomeText = `⚠️ आपने अभी तक भाषा नहीं चुनी!\n\n🔥 आपके जिले में स्लॉट लिमिटेड! आज 3 लोगों ने बिजनेस अवसर देखा।\n\n👇 अभी भाषा चुनकर जारी रखें:`;
          } else {
            welcomeText = `⚠️ You haven't selected language yet!\n\n🔥 ⚠️ Slots in your district are limited! 3 people checked Business Opportunity today.\n\n👇 Select language now to continue:`;
          }
        }
        if(level===24){
          if(actualLang==='ml'){
            welcomeText = `⏰ അവസാന ഓർമ്മപ്പെടുത്തൽ! നിങ്ങളുടെ സ്ലോട്ട് നാളെ മറ്റൊരാൾക്ക് പോകും!\n\n🚨 ഇന്ന് ഭാഷ തിരഞ്ഞെടുത്തില്ലെങ്കിൽ നിങ്ങളുടെ ഏരിയ queue-ൽ നിന്ന് നീക്കം ചെയ്യപ്പെടും!\n\n👇 ഇപ്പോൾ തന്നെ ഭാഷ തിരഞ്ഞെടുക്കൂ:`;
          } else if(actualLang==='hi'){
            welcomeText = `⏰ अंतिम रिमाइंडर! आपका स्लॉट कल दूसरे को चला जाएगा!\n\n🚨 आज भाषा नहीं चुनी तो आपका एरिया queue से हट जाएगा!\n\n👇 अभी भाषा चुनें:`;
          } else {
            welcomeText = `⏰ FINAL Reminder! Your slot goes to someone else tomorrow!\n\n🚨 If you don't select language today, your area will be removed from queue!\n\n👇 Select language NOW:`;
          }
        }
        await sendWithDelay(interactiveButton(uid, welcomeText, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'Hindi'},{id:'LANG_ML',title:'Malayalam'}], actualPhoneId));
      } else if(type.includes('COMPANY_VIDEO_2MIN')){
        // V207: Company video - Did you watch? as 2-min reminder, then Income Level
        const cMsg = actualLang==='ml' ? `ഹലോ! കമ്പനി വീഡിയോ കണ്ടോ?\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: വീഡിയോ കണ്ടെങ്കിൽ താഴെ "കമ്പനി വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക, തുടർന്ന് വരുമാന തലം തിരഞ്ഞെടുക്കാം:` : actualLang==='hi' ? `हैलो! कंपनी वीडियो देखा?\n\n👉 अब क्या करें: अगर वीडियो देख लिया है तो नीचे "कंपनी वीडियो देखा" पर क्लिक करें, फिर आय स्तर चुनें:` : `Hello! Did you watch Company video?\n\n👉 👇 What to do now: If you watched full video, click "Watched Company Video" below, then select Income Level:`;
        const cWatched = actualLang==='ml' ? 'കമ്പനി വീഡിയോ കണ്ടു' : actualLang==='hi' ? 'कंपनी वीडियो देखा' : 'Watched Company Video';
        const cNot = actualLang==='ml' ? 'കമ്പനി വീഡിയോ കണ്ടില്ല' : actualLang==='hi' ? 'कंपनी वीडियो नहीं देखा' : 'Company Video Not Seen';
        await sendWithDelay(interactiveButton(uid, cMsg, [{id:'COMPANY_WATCHED',title:cWatched},{id:'COMPANY_NOT_WATCHED',title:cNot}], actualPhoneId));
      } else if(type.includes('VIDEO_2MIN')){
        // V207: Video 2nd message as 2-min reminder - NOT immediate
        const subForVideo = type.includes('OPP_DISTRICT') ? 'OPP_DISTRICT' : type.includes('OPP_CORP') ? 'OPP_CORP' : 'OPP_CENTER';
        const vMsg = actualLang==='ml' ? `ഹലോ! വീഡിയോ കണ്ടോ?\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: വീഡിയോ കണ്ടെങ്കിൽ താഴെ "വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക, തുടർന്ന് ആനുകൂല്യങ്ങൾ കാണാം:` : actualLang==='hi' ? `हैलो! वीडियो देखा?\n\n👉 अब क्या करें: अगर वीडियो देख लिया है तो नीचे "वीडियो देखा" पर क्लिक करें, फिर लाभ देखेंगे:` : `Hello! Did you watch the video?\n\n👉 👇 What to do now: If you watched full video, click "Watched Video" below to see Benefits:`;
        const watchedTitle = actualLang==='ml' ? 'വീഡിയോ കണ്ടു' : actualLang==='hi' ? 'वीडियो देखा' : 'Watched Video';
        const notWatchedTitle = actualLang==='ml' ? 'വീഡിയോ കണ്ടില്ല' : actualLang==='hi' ? 'वीडियो नहीं देखा' : 'Video not seen';
        await sendWithDelay(interactiveButton(uid, vMsg, [{id:'VIDEO_WATCHED',title:watchedTitle},{id:'VIDEO_NOT_WATCHED',title:notWatchedTitle}], actualPhoneId));
      } else {
        // Check if Pay step - use escalated pay text
        const last = state.lastStep||'';
        if(last.includes('Pay Reg') || last.includes('✅ EMI Selected') || last.includes('Not Paid') || last.includes('Pay Rs') || last.startsWith('Pay ')){
          const L = T[actualLang]||T.en;
          const fee = state.fee||15;
          const escalatedText = getEscalatedPayText(actualLang, fee, level);
          await sendWithDelay(interactiveButton(uid, escalatedText, [{id:'PAY_DONE',title:L.payBtn},{id:'PAY_NOT_DONE',title:L.notPaid},{id:'PAY_VERIFY',title:PAY_VERIFY_TEXT[actualLang]||PAY_VERIFY_TEXT['en']},{id:'HUMAN_TALK',title:HUMAN_TALK_TEXT[actualLang]||HUMAN_TALK_TEXT['en']},{id:'CALL_MARKETING',title:`📞 Tap to call: ${HELP_MARKETING} - ${HELP_MARKETING}`}], actualPhoneId));
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
}, 2*60*1000);


function getBenText(sub, lang){
  const isDistrict = sub==='OPP_DISTRICT';
  const isCorp = sub==='OPP_CORP';
  const isCenter = sub==='OPP_CENTER';
  if(lang==='ml'){
    if(isDistrict) return `ജില്ലാ ഫ്രാഞ്ചൈസി ആനുകൂല്യങ്ങൾ:\n\n✅ നിങ്ങളുടെ ജില്ലയിലെ എല്ലാ സേവനങ്ങളിൽ നിന്നും കമ്മീഷൻ (Ride, Business Directory, Delivery, Booking)\n✅ ജില്ലയിലെ എല്ലാ Business Center-ൽ നിന്നും റോയൽറ്റി\n✅ കമ്പനിയുമായി നേരിട്ട് ബന്ധം - കോർപ്പറേറ്റ് തലത്തിൽ മാത്രം\n✅ ആജീവനാന്ത വരുമാന മോഡൽ\n\n💰 District Fee: 10L (Without Corp) / 15L (With Corp)\n\nWebsite: https://bizmapia.com`;
    if(isCorp) return `കോർപ്പറേഷൻ/മുനിസിപ്പാലിറ്റി ഫ്രാഞ്ചൈസി ആനുകൂല്യങ്ങൾ:\n\n✅ നിങ്ങളുടെ കോർപ്പറേഷൻ/മുനിസിപ്പൽ ഏരിയയിലെ എല്ലാ സേവനങ്ങളിൽ നിന്നും കമ്മീഷൻ\n✅ ആ ഏരിയയിലെ Business Center-ൽ നിന്നും റോയൽറ്റി\n✅ 6 മാസം വാടക സപ്പോർട്ട് + 6 മാസം സ്റ്റാഫ് ശമ്പള സപ്പോർട്ട് (Corp/Municipal മാത്രം)\n✅ ആജീവനാന്ത വരുമാനം\n\n💰 Corp Fee: 4L (Municipal) / 5L (Corporation)\n\nWebsite: https://bizmapia.com`;
    return `ബിസിനസ് സെന്റർ ആനുകൂല്യങ്ങൾ:\n\n✅ നിങ്ങളുടെ പട്ടണത്തിലെ എല്ലാ സേവനങ്ങളിൽ നിന്നും കമ്മീഷൻ\n✅ സ്വന്തം ബിസിനസ് സെന്റർ - നിങ്ങളുടെ ഏരിയയിൽ മാത്രം\n✅ കുറഞ്ഞ നിക്ഷേപം, ഉയർന്ന വരുമാന സാധ്യത\n✅ ആജീവനാന്ത വരുമാന മോഡൽ\n\n💰 Business Center Fee: 1 Lakh മാത്രം\n\nWebsite: https://bizmapia.com`;
  } else if(lang==='hi'){
    if(isDistrict) return `जिला फ्रेंचाइजी लाभ:\n\n✅ आपके जिले की सभी सेवाओं से कमीशन (Ride, Business Directory, Delivery, Booking)\n✅ जिले के सभी Business Center से रॉयल्टी\n✅ कंपनी से सीधा संपर्क - केवल कॉर्पोरेट स्तर पर\n✅ आजीवन आय मॉडल\n\n💰 जिला फीस: 10L (बिना कॉर्प) / 15L (कॉर्प के साथ)`;
    if(isCorp) return `कॉरपोरेशन/नगरपालिका फ्रेंचाइजी लाभ:\n\n✅ आपके कॉर्प/नगरपालिका क्षेत्र की सभी सेवाओं से कमीशन\n✅ उस क्षेत्र के Business Center से रॉयल्टी\n✅ 6 महीने किराया सपोर्ट + 6 महीने स्टाफ सैलरी सपोर्ट (Corp/Municipal के लिए)\n✅ आजीवन आय\n\n💰 फीस: 4L (नगरपालिका) / 5L (कॉरपोरेशन)`;
    return `बिजनेस सेंटर लाभ:\n\n✅ आपके शहर की सभी सेवाओं से कमीशन\n✅ अपना बिजनेस सेंटर - केवल आपके क्षेत्र में\n✅ कम निवेश, अधिक आय की संभावना\n✅ आजीवन आय मॉडल\n\n💰 फीस: केवल 1 लाख`;
  } else {
    if(isDistrict) return `District Franchise Benefits:\n\n✅ Commission from ALL services in your District (Ride, Business Directory, Delivery, Booking)\n✅ Royalty from ALL Business Centers in your District\n✅ Direct contact with Company - Corporate level only\n✅ Lifetime income model\n\n💰 District Fee: 10L (Without Corp) / 15L (With Corp)\n\nWebsite: https://bizmapia.com`;
    if(isCorp) return `Corporation/Municipality Franchise Benefits:\n\n✅ Commission from ALL services in your Corp/Municipal area\n✅ Royalty from Business Centers in your area\n✅ 6 months Rent support + 6 months Staff salary support (Corp/Municipal only)\n✅ Lifetime income\n\n💰 Corp Fee: 4L (Municipal) / 5L (Corporation)`;
    return `Business Center Benefits:\n\n✅ Commission from ALL services in your town\n✅ Own Business Center - only in your area\n✅ Low investment, high income potential\n✅ Lifetime income model\n\n💰 Fee: Only 1 Lakh`;
  }
}
function getSupText(sub, lang){
  const isDistrict = sub==='OPP_DISTRICT';
  const isCorp = sub==='OPP_CORP';
  if(lang==='ml'){
    if(isDistrict) return `പിന്തുണ - ജില്ലാ ഫ്രാഞ്ചൈസി:\n\n🏢 കമ്പനി നൽകുന്ന പിന്തുണ:\n✅ 12 മാസം മാർക്കറ്റിംഗ് സപ്പോർട്ട്\n✅ ജില്ലാ തലത്തിൽ പരസ്യം - കമ്പനി ചെലവിൽ\n✅ ആപ്പ് + വെബ്സൈറ്റ് + ട്രെയിനിംഗ് പൂർണ്ണ സപ്പോർട്ട്\n✅ ജില്ലയിലെ എല്ലാ Business Center സെറ്റപ്പ് സപ്പോർട്ട്\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
    if(isCorp) return `പിന്തുണ - കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി:\n\n🏢 കമ്പനി നൽകുന്ന പിന്തുണ:\n✅ 12 മാസം മാർക്കറ്റിംഗ് സപ്പോർട്ട്\n✅ 6 മാസം വാടക സപ്പോർട്ട് + 6 മാസം സ്റ്റാഫ് ശമ്പള സപ്പോർട്ട്\n✅ കോർപ്പറേഷൻ / മുനിസിപ്പൽ തലത്തിൽ പരസ്യം\n✅ ആപ്പ് + വെബ്സൈറ്റ് + ട്രെയിനിംഗ്\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
    return `പിന്തുണ - ബിസിനസ് സെന്റർ:\n\n🏢 കമ്പനി നൽകുന്ന പിന്തുണ:\n✅ ആപ്പ് + വെബ്സൈറ്റ് + ട്രെയിനിംഗ് പൂർണ്ണ സപ്പോർട്ട്\n✅ നിങ്ങളുടെ പട്ടണത്തിൽ മാർക്കറ്റിംഗ് സപ്പോർട്ട്\n✅ ലോക്കൽ ബിസിനസ്സ് ലിസ്റ്റിംഗ് സപ്പോർട്ട്\n\n💰 ആവശ്യകത: 100 Sqft Shop/Room + Computer + Internet + 1 Lakh\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
  } else if(lang==='hi'){
    if(isDistrict) return `सपोर्ट - जिला फ्रेंचाइजी:\n\n🏢 कंपनी सपोर्ट:\n✅ 12 महीने मार्केटिंग सपोर्ट\n✅ जिला स्तर पर विज्ञापन - कंपनी खर्च पर\n✅ ऐप + वेबसाइट + ट्रेनिंग पूर्ण सपोर्ट`;
    if(isCorp) return `सपोर्ट - कॉरपोरेशन / म्युनिसिपल फ्रेंचाइजी:\n\n🏢 कंपनी सपोर्ट:\n✅ 12 महीने मार्केटिंग सपोर्ट\n✅ 6 महीने किराया सपोर्ट + 6 महीने स्टाफ सैलरी सपोर्ट\n✅ कॉरपोरेशन / म्युनिसिपल स्तर पर विज्ञापन`;
    return `सपोर्ट - बिजनेस सेंटर:\n\n🏢 कंपनी सपोर्ट:\n✅ ऐप + वेबसाइट + ट्रेनिंग पूर्ण सपोर्ट\n✅ आपके शहर में मार्केटिंग सपोर्ट\n\n💰 आवश्यकता: 100 Sqft Shop/Room + Computer + Internet + 1 Lakh`;
  } else {
    if(isDistrict) return `Support - District Franchise:\n\n🏢 Company Support:\n✅ 12 months marketing support\n✅ District level advertisement - Company cost\n✅ App + Website + Training full support\n✅ All Business Center setup support in your District\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
    if(isCorp) return `Support - Corporation / Municipal Franchise:\n\n🏢 Company Support:\n✅ 12 months marketing support\n✅ 6 months Rent support + 6 months Staff salary support\n✅ Corporation / Municipal level advertisement\n✅ App + Website + Training\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
    return `Support - Business Center:\n\n🏢 Company Support:\n✅ App + Website + Training full support\n✅ Marketing support in your town\n✅ Local business listing support\n\n💰 Requirement: 100 Sqft Shop/Room + Computer + Internet + 1 Lakh\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
  }
}
function getReqText(sub, lang){
  const isDistrict = sub==='OPP_DISTRICT';
  const isCorp = sub==='OPP_CORP';
  const isCenter = sub==='OPP_CENTER';
  if(lang==='ml'){
    if(isDistrict) return `ആവശ്യകതകൾ - ജില്ലാ ഫ്രാഞ്ചൈസി:\n\n📋 ആവശ്യമായവ:\n✅ ഓഫീസ് സ്പേസ്: ജില്ലാ ഹെഡ്ക്വാർട്ടേഴ്സിൽ ഓഫീസ്\n✅ സ്റ്റാഫ്: മിനിമം 2-3 സ്റ്റാഫ്\n✅ കമ്പ്യൂട്ടർ + ഇന്റർനെറ്റ് + പ്രിന്റർ\n✅ നിക്ഷേപം: 10L / 15L (EMI ലഭ്യമാണ്)\n✅ ആധാർ + പാൻ + ബാങ്ക് അക്കൗണ്ട്\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
    if(isCorp) return `ആവശ്യകതകൾ - കോർപ്പറേഷൻ / മുനിസിപ്പൽ:\n\n📋 ആവശ്യമായവ:\n✅ ഓഫീസ് സ്പേസ്: കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഏരിയയിൽ ഓഫീസ്\n✅ സ്റ്റാഫ്: മിനിമം 1-2 സ്റ്റാഫ്\n✅ കമ്പ്യൂട്ടർ + ഇന്റർനെറ്റ്\n✅ നിക്ഷേപം: 4L / 5L (EMI ലഭ്യമാണ്)\n✅ ആധാർ + പാൻ\n\n💡 6 മാസം വാടക + 6 മാസം സ്റ്റാഫ് ശമ്പളം കമ്പനി നൽകും\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
    return `ആവശ്യകതകൾ - ബിസിനസ് സെന്റർ:\n\n📋 ആവശ്യമായവ:\n✅ 100 Sqft Shop/Room + Computer + Internet\n✅ 1 ലക്ഷം നിക്ഷേപം മാത്രം (EMI: Down 30k + 7 Months x 10k)\n✅ ആധാർ + പാൻ\n✅ സ്വന്തം പട്ടണത്തിൽ ബിസിനസ് ചെയ്യാൻ താൽപര്യം\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
  } else if(lang==='hi'){
    if(isDistrict) return `आवश्यकताएं - जिला फ्रेंचाइजी:\n\n📋 आवश्यक:\n✅ ऑफिस स्पेस: जिला मुख्यालय में ऑफिस\n✅ स्टाफ: न्यूनतम 2-3 स्टाफ\n✅ कंप्यूटर + इंटरनेट + प्रिंटर\n✅ निवेश: 10L / 15L (EMI उपलब्ध)\n✅ आधार + पैन`;
    if(isCorp) return `आवश्यकताएं - कॉरपोरेशन / म्युनिसिपल:\n\n📋 आवश्यक:\n✅ ऑफिस स्पेस: कॉरपोरेशन / म्युनिसिपल क्षेत्र में ऑफिस\n✅ स्टाफ: न्यूनतम 1-2 स्टाफ\n✅ कंप्यूटर + इंटरनेट\n✅ निवेश: 4L / 5L (EMI उपलब्ध)\n✅ आधार + पैन\n\n💡 6 महीने किराया + 6 महीने स्टाफ सैलरी कंपनी देगी`;
    return `आवश्यकताएं - बिजनेस सेंटर:\n\n📋 आवश्यक:\n✅ 100 Sqft Shop/Room + Computer + Internet\n✅ केवल 1 लाख निवेश (EMI: Down 30k + 7 Months x 10k)\n✅ आधार + पैन`;
  } else {
    if(isDistrict) return `Requirements - District Franchise:\n\n📋 Required:\n✅ Office Space: Office at District HQ\n✅ Staff: Minimum 2-3 staff\n✅ Computer + Internet + Printer\n✅ Investment: 10L / 15L (EMI Available)\n✅ Aadhaar + PAN + Bank Account`;
    if(isCorp) return `Requirements - Corporation / Municipal:\n\n📋 Required:\n✅ Office Space: Office in Corporation / Municipal area\n✅ Staff: Minimum 1-2 staff\n✅ Computer + Internet\n✅ Investment: 4L / 5L (EMI Available)\n✅ Aadhaar + PAN\n\n💡 6 months Rent + 6 months Staff salary by Company\n\n📞 Franchise Team: +91 ${HELP_MARKETING}`;
    return `Requirements - Business Center:\n\n📋 Required:\n✅ 100 Sqft Shop/Room + Computer + Internet\n✅ Only 1 Lakh Investment (EMI: Down 30k + 7 Months x 10k)\n✅ Aadhaar + PAN\n✅ Interest to do business in own town`;
  }
}


const T={
  en:{
    welcome:`Hi, I am Maya here to chat with you! 👋\n\nWelcome to Bizmapia! 🙏\n🇮🇳 India's Largest Online Platform - First 4-in-1 App in India\n\n🌐 Please select your preferred language from below:-`,
    mainMenu:`🙏 Thank you for selecting English! 🙏 Excellent choice! 👏

I'm Maya 🤖 — I'm here to give you real-time assistance and reminders to find your correct needs with Bizmapia.

👇 👇 What to do now: Please select a service from below and I'll guide you step-by-step what to do next:-`,
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
    deliveryButtons:[{id:'DEL_ORDER',title:'Order from Stores'},{id:'DEL_PARTNER',title:'Start earning'}],
    delOrder:`Order Grocery, Food, Medicine, Anything from local stores and get delivered in 2 hours.\n\nClick below to install app or call us:`,
    delPartner:`Become our delivery partner and earn daily.\n\nClick below to install app or call us:`,
    bookingSelected:`Great you selected "Online Booking"\nBook Rooms, Appointments, Movie Tickets at affordable rates all India.\nPlease select any one option from below:-`,
    bookingButtons:[{id:'BOOK_ROOM',title:'Book Rooms'},{id:'BOOK_APPOINT',title:'Book Appointments'},{id:'BOOK_MOVIE',title:'Movie Tickets'}],
    bookRoom:`Book Hotels, Rooms, Resorts anywhere in India at best rates.\n\nClick below to install app or call us:`,
    bookAppoint:`Book Appointments - Doctor, Salon, Services - Instant booking near you.\n\nClick below to install app or call us:`,
    bookMovie:`Book Movie Tickets, Events, Shows near you.\n\nClick below to install app or call us:`,
    oppSelected:`Great you selected "Business Opportunity"\nBecome our service point and start earning. 3 levels of earning.\nYou are going to book your slot for earning opportunity from Bizmapia anywhere from India. What type of opportunity you are looking?\nPlease select any one option from below:-`,
    oppButtons:[{id:'OPP_DISTRICT',title:'💰 High level Income'},{id:'OPP_CORP',title:'💼 Moderate income'},{id:'OPP_CENTER',title:'🚀 Base level Income'}],
    highIntroSingle:`Excellent choice! 👏 👏 You selected District Franchisee - 10-15L - MOST PREMIUM opportunity!\n\nThank you for choosing our higher level income earning opportunity! This is a great decision - only one person per district!\n\n👇 👇 What to do in this step: Watch the YouTube video below fully to understand complete details about District franchise, then click Watched Video to see Benefits. Remember only one application is approved for a district, so study whole details and decide with this chat.`,
    moderateIntroSingle:`Excellent choice! 👏 👏 You selected Corporation/Municipal Franchisee - 4L/5L opportunity!\n\nThank you for choosing our moderate level income earning opportunity! Great decision - limited slots for Corporation / Municipal!\n\n👇 👇 What to do in this step: Watch the YouTube video below fully to understand complete details about Corporation/Municipal franchise, then click Watched Video to see Benefits. Study whole details and decide with this chat.`,
    baseIntroSingle:`Excellent choice! 👏 👏 You selected Business Center - 1L - Easy Start opportunity!\n\nThank you for choosing our base level income earning opportunity! Wonderful decision - perfect for easy start with low investment!\n\n👇 👇 What to do in this step: Watch the YouTube video below fully to understand complete details about Business Center, then click Watched Video to see Benefits. Study details and decide.`,
    reminderFranchise:`You were checking our franchise opportunity. Continue to know more?`,
    seeVideo:'See the Video',
    clickWatch:'Click to watch',
    mustWatch:'⚠️ IMPORTANT STEP: You MUST watch this video fully before proceeding!',
    watchedBtn:'Watched Video',
    understoodBen:'Understood Benefit',
    benAgain:'Know Benefit Again',
    understoodSup:'Seen and Understood',
    supAgain:'Know Support Again',
    understoodReq:'Understood Req',
    reqAgain:'Know Requirement Again',
    benBtn:'Know Benefits', supBtn:'Know Support', reqBtn:'Requirements', submitBtn:'Submit Application', videoBtn:'Video Link', emiBtn:'EMI options',
    benText:`BENEFITS - District Franchise\n\nBenefits 1 - You are district top level franchisee, % on all earnings in your district\nBenefits 2 - Only you can contact Company directly\nBenefits 3 - Lifetime royalty income\n\nWebsite: ${WEBSITE}\n\nHelp: +91 ${HELP_MARKETING}`,
    supText:`SUPPORT - Company will provide\nSupport 1 - 12 months marketing support\nSupport 2 - 6 months Rent contribution\nSupport 3 - 6 months Staff salary support\n\nCall: +91 ${HELP_MARKETING}`,
    reqText:`REQUIREMENTS\n\nRequirement 1 - 90 Sqft room\nRequirement 2 - 1 full time staff\nRequirement 3 - PC/Laptop and Android Mobile\nRequirement 4 - Ready to invest\nRequirement 5 - Aadhaar + PAN\n\nApply: ${EARN_LINK}`,
    corpQ:`Did your district contain corporation? If your district HQ has Corporation (e.g. Ernakulam has Kochi Corporation), select Yes Corp.`,
    yesCorp:'Yes Corp', noCorp:'No Corp',
    ready15:`You are going to submit application, confirming you are ready to pay 15 Lakhs as District franchise fee.`,
    readyBtn:'Yes Ready - 15L',
    payReg:`Great you confirmed ready. Please pay Registration Fee (Not refundable, NOT part of fee). Pay to get 📄 Tender + Annexure-B. Click 💳 Pay Now button below.`,
    payBtn:'I Paid',
    payFeeNow:'Pay Now',
    notPaid:'Not Paid - Will Pay',
    payAfter:'💳 After Registration Fee Rs${token} (Not refundable, NOT part of fee) payment, please select:-',
    emiOpt:`EMI options available:\nEMI 5 Months\nEMI 9 Months\nPlease select any one from below:-`,
    emi10:'EMI 5 Months', emi20:'EMI 9 Months',
    leadAsk:`Great! Please type your full name, district and mobile number (e.g. Ajo, Thodupuzha, 9567742507)`,
    occQ:`What is your occupation?`,
    bus:'Business', house:'Housewife', emp:'Employee',
    dateQ:`When you can visit our head office?`,
    today:'Today', tomorrow:'Tomorrow',
    tenderLink:`Excellent choice! 👏 👏 🙏 Thank you for selecting District Franchise!

📄 Downloadable PDF for District Franchise - 10-15L - MOST PREMIUM:
${LINKS_V92.tenderDistrict}

👇 What to do: Click the link above to download your District franchise tender document PDF, read complete terms, and keep it safe for your records. Our team will call you within 24 hours.`,
    thanks:`Thanks for submitting your details. Our franchise team will call you within 24 hours.\n\nCall: +91 ${HELP_MARKETING}`,
    noProblem:`No problem! Take your time. When you are ready, click below to install.\n\nClick below:`,
  },
  hi:{
    welcome:`Hi, I am Maya here to chat with you! 👋\n\nWelcome to Bizmapia! 🙏\n🇮🇳 India's Largest Online Platform - First 4-in-1 App in India\n\n🌐 अपनी भाषा नीचे से चुनें:-`,
    mainMenu:`हिंदी चुनने के लिए धन्यवाद! 🙏 बहुत बढ़िया चयन!

मैं माया हूँ 🤖 — मैं आपको Bizmapia के साथ आपकी सही जरूरतों के लिए रियल-टाइम सहायता और रिमाइंडर दूंगी।

👇 अब क्या करना है: कृपया नीचे से सेवा चुनें और मैं आपको स्टेप-बाय-स्टेप गाइड करूंगी:-`,
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
    yesActivate:'हाँ, सक्रिय करें', noLater:'बाद में करूंगा',
    activated:`बहुत बढ़िया, हम आपके ऐप लॉगिन में आपका ऑफर सक्रिय कर रहे हैं, अभी हमारे ऐप में लॉगिन करें और अपनी पहली यात्रा पूरी करके अपने ऑफर देखें`,
    helpAdmin:`सहायता ${HELP_ADMIN}`, helpMarketing:`सहायता ${HELP_MARKETING}`,
    bizDirSelected:`बहुत बढ़िया आपने "बिजनेस डायरेक्टरी" चुना\nअपना व्यवसाय रजिस्टर करें और पूरे भारत से ग्राहक प्राप्त करें।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    bizDirButtons:[{id:'BIZ_REGISTER',title:'बिजनेस रजिस्टर करें'},{id:'BIZ_ADS',title:'विज्ञापन शुरू करें'}],
    bizRegister:`Bizmapia पर अपना व्यवसाय रजिस्टर करें और अधिक ग्राहक, लीड और बुकिंग प्राप्त करना शुरू करें।\n\nनीचे वेबसाइट पर क्लिक करें या कॉल करें:`,
    bizAds:`Bizmapia पर अपने व्यवसाय का विज्ञापन शुरू करें और 10 गुना अधिक ग्राहक प्राप्त करें।\n\nनीचे क्लिक करें:`,
    deliverySelected:`बहुत बढ़िया आपने "ऑनलाइन डिलीवरी" चुना\nस्थानीय स्टोर से कुछ भी 2 घंटे में आपके दरवाजे पर डिलीवरी।\nकृपया नीचे से कोई एक विकल्प चुनें:-`,
    deliveryButtons:[{id:'DEL_ORDER',title:'स्टोर से ऑर्डर करें'},{id:'DEL_PARTNER',title:'डिलीवरी जॉब'}],
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
    moderateIntroSingle:`बहुत बढ़िया आपने हमारी मध्यम स्तरीय आय अवसर का चयन किया\n\nआइए हमारी कॉरपोरेशन / म्युनिसिपल फ्रेंचाइजी अवसर के बारे में जानें`,
    baseIntroSingle:`बहुत बढ़िया आपने हमारी बेस लेवल आय अवसर का चयन किया\n\nआइए हमारे बिजनेस सेंटर अवसर के बारे में जानें`,
    reminderFranchise:`आप हमारी फ्रेंचाइजी अवसर की जाँच कर रहे थे। अधिक जानने के लिए जारी रखें?`,
    seeVideo:'वीडियो देखें',
    clickWatch:'देखने के लिए क्लिक करें',
    mustWatch:'⚠️ महत्वपूर्ण चरण: अगले चरण पर जाने से पहले आपको यह वीडियो पूरा देखना होगा!',
    watchedBtn:'वीडियो देखा',
    understoodBen:'लाभ समझा',
    benAgain:'लाभ फिर से जानें',
    understoodSup:'देखा और समझा',
    supAgain:'सहायता फिर से जानें',
    understoodReq:'आवश्यकता समझी',
    reqAgain:'आवश्यकता फिर से जानें',
    benBtn:'लाभ जानें', supBtn:'सहायता जानें', reqBtn:'आवश्यकताएं', submitBtn:'आवेदन जमा करें', videoBtn:'वीडियो लिंक', emiBtn:'EMI विकल्प',
    benText:`लाभ - जिला फ्रेंचाइजी\n\nलाभ 1 - आप जिला टॉप लेवल फ्रेंचाइजी हैं, आपके जिले की सभी कमाई पर %\nलाभ 2 - केवल आप कंपनी से सीधे संपर्क कर सकते हैं\nलाभ 3 - आजीवन रॉयल्टी आय`,
    supText:`सहायता - कंपनी प्रदान करेगी\nसहायता 1 - 12 महीने मार्केटिंग सहायता\nसहायता 2 - 6 महीने किराया योगदान\nसहायता 3 - 6 महीने स्टाफ वेतन सहायता`,
    reqText:`आवश्यकताएं\n\nआवश्यकता 1 - 90 वर्ग फुट कमरा\nआवश्यकता 2 - 1 पूर्णकालिक स्टाफ\nआवश्यकता 3 - पीसी/लैपटॉप और एंड्रॉइड मोबाइल`,
    corpQ:`क्या आपके जिले में कॉरपोरेशन है?`,
    yesCorp:'हाँ कॉर्प', noCorp:'नहीं कॉर्प',
    ready15:`आप आवेदन जमा करने जा रहे हैं, पुष्टि करते हुए कि आप जिला फ्रेंचाइजी शुल्क के रूप में 15 लाख रुपये का भुगतान करने के लिए तैयार हैं।`,
    readyBtn:'हाँ तैयार - 15L',
    payReg:`बहुत बढ़िया! रजिस्ट्रेशन फी (Not refundable, फी का हिस्सा नहीं) - 📄 Tender + Annexure-B के लिए भुगतान करें। नीचे 💳 Pay Now बटन पर क्लिक करें।`,
    payBtn:'भुगतान किया',
    payFeeNow:'अभी भुगतान करें',
    notPaid:'नहीं किया',
    payAfter:'रजिस्ट्रेशन फी Rs${token} (Not refundable, फी का हिस्सा नहीं) भुगतान के बाद, कृपया चुनें:-',
    emiOpt:`EMI विकल्प उपलब्ध हैं:
EMI 5 महीने
EMI 9 महीने`,
    emi10:'EMI 5 महीने', emi20:'EMI 9 महीने',
    leadAsk:`बहुत बढ़िया! कृपया अपना पूरा नाम, जिला और मोबाइल नंबर टाइप करें`,
    occQ:`आपका व्यवसाय क्या है?`,
    bus:'व्यवसाय', house:'गृहिणी', emp:'कर्मचारी',
    dateQ:`आप हमारे हेड ऑफिस कब आ सकते हैं?`,
    today:'आज', tomorrow:'कल',
    tenderLink:`बेहतरीन चयन! 👏 जिला फ्रेंचाइजी चुनने के लिए धन्यवाद!

📄 जिला फ्रेंचाइजी - 10-15L के लिए डाउनलोड करने योग्य PDF:
${LINKS_V92.tenderDistrict}

👇 क्या करना है: ऊपर दिए लिंक पर क्लिक करके अपना टेंडर डॉक्यूमेंट PDF डाउनलोड करें, पूरा पढ़ें और सुरक्षित रखें। हमारी टीम 24 घंटे में कॉल करेगी।`,
    thanks:`विवरण जमा करने के लिए धन्यवाद। हमारी फ्रेंचाइजी टीम 24 घंटे के भीतर आपको कॉल करेगी।`,
    noProblem:`कोई बात नहीं! अपना समय लें। जब आप तैयार हों, तो नीचे क्लिक करके इंस्टॉल करें।`,
  },
  ml:{
    welcome:`Hi, I am Maya here to chat with you! 👋\n\nWelcome to Bizmapia! 🙏\n🇮🇳 India's Largest Online Platform - First 4-in-1 App in India\n\n🌐 താഴെ നിന്ന് ഭാഷ തിരഞ്ഞെടുക്കുക:-`,
    mainMenu:`മലയാളം തിരഞ്ഞെടുത്തതിന് നന്ദി! 🙏 മികച്ച തിരഞ്ഞെടുപ്പ്!

ഞാൻ മായ ആണ് 🤖 — Bizmapia-യിൽ നിങ്ങളുടെ ശരിയായ ആവശ്യങ്ങൾക്ക് റിയൽ-ടൈം സഹായവും റിമൈൻഡറുകളും നൽകാൻ ഞാൻ ഇവിടെയുണ്ട്.

👇 ഇപ്പോൾ എന്ത് ചെയ്യണം: താഴെ നിന്ന് സേവനം തിരഞ്ഞെടുത്ത് ഞാൻ നിങ്ങളെ സ്റ്റെപ്പായി ഗൈഡ് ചെയ്യാം:-`,
    moreServices:`കൂടുതൽ സേവനങ്ങൾ:-`,
    services:[{id:'SVC_RIDE',title:'റൈഡ് ഹെയ്ലിംഗ്'},{id:'SVC_BIZDIR',title:'ബിസിനസ് ഡയറക്ടറി'},{id:'SVC_DELIVERY',title:'ഓൺലൈൻ ഡെലിവറി'},{id:'SVC_BOOKING',title:'ഓൺലൈൻ ബുക്കിംഗ്'},{id:'SVC_OPP',title:'ബിസിനസ് അവസരം'}],
    noLang:`ക്ഷമിക്കണം, നിങ്ങൾ ഒരു ഭാഷയും തിരഞ്ഞെടുത്തില്ല.\n\nതാഴെ നിന്ന് ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക:-`,
    noService:`നിങ്ങൾ ഇതുവരെ ഒരു സേവനവും തിരഞ്ഞെടുത്തില്ല.\n\nതാഴെ നിന്ന് ഒരു സേവനം ക്ലിക്ക് ചെയ്യുക:-`,
    rideSelected:`നിങ്ങൾ "റൈഡ് ഹെയ്ലിംഗ്" തിരഞ്ഞെടുത്തു, നന്നായി\nBizmapia അതിർത്തിയില്ലാതെ ഇന്ത്യ മുഴുവൻ റൈഡ് ഹെയ്ലിംഗ് സേവനം നൽകുന്ന ഒരേയൊരു പ്ലാറ്റ്ഫോമാണ്.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    rideButtons:[{id:'RIDE_BOOK',title:'ക്യാബ് ബുക്കിംഗ്'},{id:'RIDE_ATTACH',title:'ക്യാബ് ചേർക്കുക'}],
    bookCab:`മികച്ച തിരഞ്ഞെടുപ്പ്, നിങ്ങൾ "ക്യാബ് ബുക്കിംഗ്" സേവനം ക്ലിക്ക് ചെയ്തു.\nTwo wheeler/Autorickshaw/Hatchback/Sedan/SUV/XUV/Ambulance അടുത്ത പ്രദേശങ്ങളിൽ നിന്ന് മിതമായ നിരക്കിൽ ലഭിക്കും.\n\nതാഴെ ക്ലിക്ക് ചെയ്ത് ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക അല്ലെങ്കിൽ വിളിക്കുക:`,
    attachCab:`നിങ്ങൾ "ക്യാബ് ചേർക്കുക" തിരഞ്ഞെടുത്തു\nനിങ്ങളുടെ Two wheeler/Auto/Car/SUV അറ്റാച്ച് ചെയ്ത് Bizmapia-യിലൂടെ ദിവസവും വരുമാനം നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    haveInstalled1:`നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nഇവിടെ നിങ്ങൾക്ക് റൈഡുകളിൽ പ്രത്യേക ഓഫറുകൾ സജീവമാക്കാം`,
    haveInstalled24:`നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nനിങ്ങളുടെ അവസരം അവസാനിക്കാൻ പോകുന്നു, ഇവിടെ റൈഡുകളിൽ ഓഫറുകൾ സജീവമാക്കാം`,
    yesActivate:'അതെ, സജീവമാക്കുക', noLater:'പിന്നീട് ചെയ്യാം',
    activated:`നന്നായി, ഞങ്ങൾ നിങ്ങളുടെ ആപ്പ് ലോഗിനിൽ നിങ്ങളുടെ ഓഫർ സജീവമാക്കുന്നു, ഇപ്പോൾ ഞങ്ങളുടെ ആപ്പിൽ ലോഗിൻ ചെയ്ത് ആദ്യ യാത്ര പൂർത്തിയാക്കി നിങ്ങളുടെ ഓഫറുകൾ പരിശോധിക്കുക`,
    helpAdmin:`സഹായം ${HELP_ADMIN}`, helpMarketing:`സഹായം ${HELP_MARKETING}`,
    bizDirSelected:`നിങ്ങൾ "ബിസിനസ് ഡയറക്ടറി" തിരഞ്ഞെടുത്തു, നന്നായി\nനിങ്ങളുടെ ബിസിനസ്സ് രജിസ്റ്റർ ചെയ്ത് ഇന്ത്യ മുഴുവൻ ഉപഭോക്താക്കളെ നേടൂ. 10 ലക്ഷത്തിലധികം പ്രാദേശിക ബിസിനസ്സുകൾ ഇതിനകം ലിസ്റ്റ് ചെയ്തിട്ടുണ്ട്.\nതാഴെ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    bizDirButtons:[{id:'BIZ_REGISTER',title:'ബിസിനസ് ചേർക്കുക'},{id:'BIZ_ADS',title:'പരസ്യം തുടങ്ങുക'}],
    bizRegister:`Bizmapia-യിൽ നിങ്ങളുടെ ബിസിനസ്സ് രജിസ്റ്റർ ചെയ്ത് കൂടുതൽ ഉപഭോക്താക്കളെയും ലീഡുകളെയും ബുക്കിംഗുകളെയും നേടാൻ തുടങ്ങൂ.\n\nതാഴെ വെബ്സൈറ്റിൽ ക്ലിക്ക് ചെയ്യുക അല്ലെങ്കിൽ വിളിക്കുക:`,
    bizAds:`Bizmapia-യിൽ നിങ്ങളുടെ ബിസിനസ്സ് പരസ്യം ചെയ്യാൻ തുടങ്ങൂ, 10 മടങ്ങ് കൂടുതൽ ഉപഭോക്താക്കളെ നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    deliverySelected:`നിങ്ങൾ "ഓൺലൈൻ ഡെലിവറി" തിരഞ്ഞെടുത്തു, നന്നായി\nപ്രാദേശിക സ്റ്റോറുകളിൽ നിന്ന് എന്തും 2 മണിക്കൂറിനുള്ളിൽ നിങ്ങളുടെ വാതിൽക്കൽ ഡെലിവറി.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    deliveryButtons:[{id:'DEL_ORDER',title:'സ്റ്റോർ ഓർഡർ'},{id:'DEL_PARTNER',title:'ഡെലിവറി ജോലി'}],
    delOrder:`പലചരക്ക്, ഭക്ഷണം, മരുന്ന്, പ്രാദേശിക സ്റ്റോറുകളിൽ നിന്ന് എന്തും ഓർഡർ ചെയ്ത് 2 മണിക്കൂറിനുള്ളിൽ ഡെലിവറി നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    delPartner:`ഞങ്ങളുടെ ഡെലിവറി പങ്കാളിയായി ദിവസവും വരുമാനം നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    bookingSelected:`നിങ്ങൾ "ഓൺലൈൻ ബുക്കിംഗ്" തിരഞ്ഞെടുത്തു, നന്നായി\nഇന്ത്യയിലുടനീളം മിതമായ നിരക്കിൽ റൂമുകൾ, അപ്പോയിന്റ്മെന്റുകൾ, മൂവി ടിക്കറ്റുകൾ ബുക്ക് ചെയ്യുക.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    bookingButtons:[{id:'BOOK_ROOM',title:'റൂം ബുക്കിംഗ്'},{id:'BOOK_APPOINT',title:'അപ്പോയിന്റ്മെന്റ്'},{id:'BOOK_MOVIE',title:'മൂവി ടിക്കറ്റുകൾ'}],
    bookRoom:`ഇന്ത്യയിൽ എവിടെയും മികച്ച നിരക്കിൽ ഹോട്ടലുകൾ, റൂമുകൾ, റിസോർട്ടുകൾ ബുക്ക് ചെയ്യുക.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    bookAppoint:`അപ്പോയിന്റ്മെന്റുകൾ ബുക്ക് ചെയ്യുക - ഡോക്ടർ, സലൂൺ, സേവനങ്ങൾ - നിങ്ങൾക്ക് സമീപം തൽക്ഷണ ബുക്കിംഗ്.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    bookMovie:`നിങ്ങൾക്ക് സമീപമുള്ള മൂവി ടിക്കറ്റുകൾ, ഇവന്റുകൾ, ഷോകൾ ബുക്ക് ചെയ്യുക.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    oppSelected:`👋 നന്നായി! നിങ്ങൾ "ബിസിനസ് അവസരം" തിരഞ്ഞെടുത്തു.\n\nനിങ്ങൾ Bizmapia-യിൽ നിന്ന് വരുമാന സ്ലോട്ട് ബുക്ക് ചെയ്യാൻ പോകുന്നു.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ നിന്ന് വരുമാന തലം തിരഞ്ഞെടുക്കുക - ഉയർന്ന / മിതമായ / അടിസ്ഥാന തലം:-`,
    oppButtons:[{id:'OPP_DISTRICT',title:'ഉയർന്ന തല വരുമാനം'},{id:'OPP_CORP',title:'മിതമായ തല വരുമാനം'},{id:'OPP_CENTER',title:'അടിസ്ഥാന തല വരുമാനം'}],
    highIntroSingle:`👋 ഹലോ! നിങ്ങൾ ഉയർന്ന തല വരുമാനം (ജില്ലാ ഫ്രാഞ്ചൈസി) തിരഞ്ഞെടുത്തു.\n\nജില്ലാ ഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ നോക്കാം. ഒരു ജില്ലയ്ക്ക് ഒരു അപേക്ഷ മാത്രം.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: 1) താഴെ "കാണാൻ ക്ലിക്ക് ചെയ്യുക" വഴി മുഴുവൻ വീഡിയോ കാണുക. 2) "വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക.`,
    moderateIntroSingle:`👋 ഹലോ! നിങ്ങൾ മിതമായ തല വരുമാനം (കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി) തിരഞ്ഞെടുത്തു.\n\nകോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ നോക്കാം.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: 1) വീഡിയോ കാണുക. 2) "വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക.`,
    baseIntroSingle:`👋 ഹലോ! നിങ്ങൾ അടിസ്ഥാന തല വരുമാനം (ബിസിനസ് സെന്റർ) തിരഞ്ഞെടുത്തു.\n\nബിസിനസ് സെന്റർ വിശദാംശങ്ങൾ നോക്കാം.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: 1) വീഡിയോ കാണുക. 2) "വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക.`,
    reminderFranchise:`നിങ്ങൾ ഞങ്ങളുടെ ഫ്രാഞ്ചൈസി അവസരം പരിശോധിക്കുകയായിരുന്നു. കൂടുതൽ അറിയാൻ തുടരണോ?`,
    seeVideo:'വീഡിയോ കാണുക',
    clickWatch:'കാണാൻ ക്ലിക്ക് ചെയ്യുക',
    mustWatch:'⚠️ പ്രധാന ഘട്ടം: അടുത്ത ഘട്ടത്തിലേക്ക് പോകുന്നതിന് മുൻപ് നിങ്ങൾ ഈ വീഡിയോ പൂർണ്ണമായി കാണണം!',
    watchedBtn:'വീഡിയോ കണ്ടു',
    understoodBen:'ആനുകൂല്യം മനസ്സിലായി',
    benAgain:'ആനുകൂല്യം വീണ്ടും അറിയുക',
    understoodSup:'കണ്ടു മനസ്സിലായി',
    supAgain:'പിന്തുണ വീണ്ടും അറിയുക',
    understoodReq:'ആവശ്യകത മനസ്സിലായി',
    reqAgain:'ആവശ്യകത വീണ്ടും അറിയുക',
    benBtn:'ആനുകൂല്യങ്ങൾ അറിയുക', supBtn:'പിന്തുണ അറിയുക', reqBtn:'ആവശ്യകതകൾ', submitBtn:'അപേക്ഷ സമർപ്പിക്കുക', videoBtn:'വീഡിയോ ലിങ്ക്', emiBtn:'EMI ഓപ്ഷനുകൾ',
    benText:`ആനുകൂല്യങ്ങൾ - ജില്ലാ ഫ്രാഞ്ചൈസി\n\nആനുകൂല്യം 1 - നിങ്ങൾ ജില്ലയിലെ ടോപ്പ് ലെവൽ ഫ്രാഞ്ചൈസിയാണ്, നിങ്ങളുടെ ജില്ലയിലെ എല്ലാ വരുമാനത്തിലും %\nആനുകൂല്യം 2 - കമ്പനിയുമായി നേരിട്ട് ബന്ധപ്പെടാൻ നിങ്ങൾക്ക് മാത്രമേ കഴിയൂ\nആനുകൂല്യം 3 - ആജീവനാന്ത റോയൽറ്റി വരുമാനം`,
    supText:`പിന്തുണ - കമ്പനി നൽകും\nപിന്തുണ 1 - 12 മാസത്തെ മാർക്കറ്റിംഗ് പിന്തുണ\nപിന്തുണ 2 - 6 മാസത്തെ വാടക സംഭാവന\nപിന്തുണ 3 - 6 മാസത്തെ സ്റ്റാഫ് ശമ്പള പിന്തുണ`,
    reqText:`ആവശ്യകതകൾ\n\nആവശ്യകത 1 - 90 ചതുരശ്ര അടി മുറി\nആവശ്യകത 2 - 1 ഫുൾ ടൈം സ്റ്റാഫ്\nആവശ്യകത 3 - പിസി/ലാപ്ടോപ്പും ആൻഡ്രോയിഡ് മൊബൈലും`,
    corpQ:`നിങ്ങളുടെ ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ?`,
    yesCorp:'അതെ കോർപ്പ്', noCorp:'അല്ല കോർപ്പ്',
    ready15:`നിങ്ങൾ അപേക്ഷ സമർപ്പിക്കാൻ പോകുന്നു, ജില്ലാ ഫ്രാഞ്ചൈസി ഫീസായി 15 ലക്ഷം രൂപ നൽകാൻ നിങ്ങൾ തയ്യാറാണെന്ന് സ്ഥിരീകരിക്കുന്നു.`,
    readyBtn:'അതെ തയ്യാർ - 15L',
    payReg:`നിങ്ങൾ തയ്യാറായി സ്ഥിരീകരിച്ചു. രജിസ്ട്രേഷൻ ഫീ (Not refundable, ഫീസിന്റെ ഭാഗമല്ല) - 📄 Tender + Annexure-B ലഭിക്കാൻ അടയ്ക്കുക. താഴെ 💳 Pay Now ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.`,
    payBtn:'അടച്ചു',
    payFeeNow:'ഇപ്പോൾ അടയ്ക്കുക',
    notPaid:'അടച്ചില്ല',
    payAfter:'രജിസ്ട്രേഷൻ ഫീ Rs${token} (Not refundable, ഫീസിന്റെ ഭാഗമല്ല) അടച്ചതിന് ശേഷം തിരഞ്ഞെടുക്കുക:-',
    emiOpt:`EMI ഓപ്ഷനുകൾ ലഭ്യമാണ്:
EMI 5 മാസം
EMI 9 മാസം`,
    emi10:'EMI 5 മാസം', emi20:'EMI 9 മാസം',
    leadAsk:`മികച്ചത്! ദയവായി നിങ്ങളുടെ പൂർണ്ണ നാമം, ജില്ല, മൊബൈൽ നമ്പർ ടൈപ്പ് ചെയ്യുക`,
    occQ:`നിങ്ങളുടെ തൊഴിൽ എന്താണ്?`,
    bus:'ബിസിനസ്', house:'ഹൗസ്വൈഫ്', emp:'ജീവനക്കാരൻ',
    dateQ:`നിങ്ങൾക്ക് ഞങ്ങളുടെ ഹെഡ് ഓഫീസിൽ എപ്പോൾ വരാൻ കഴിയും?`,
    today:'ഇന്ന്', tomorrow:'നാളെ',
    tenderLink:`മികച്ച തിരഞ്ഞെടുപ്പ്! 👏 ജില്ലാ ഫ്രാഞ്ചൈസി തിരഞ്ഞെടുത്തതിന് നന്ദി!

📄 ജില്ലാ ഫ്രാഞ്ചൈസി - 10-15L-ന് ഡൗൺലോഡ് ചെയ്യാവുന്ന PDF:
${LINKS_V92.tenderDistrict}

👇 എന്ത് ചെയ്യണം: മുകളിലെ ലിങ്കിൽ ക്ലിക്ക് ചെയ്ത് നിങ്ങളുടെ ടെൻഡർ ഡോക്യുമെന്റ് PDF ഡൗൺലോഡ് ചെയ്ത് വായിച്ച് സൂക്ഷിക്കുക. ഞങ്ങളുടെ ടീം 24 മണിക്കൂറിനുള്ളിൽ വിളിക്കും.`,
    thanks:`വിശദാംശങ്ങൾ സമർപ്പിച്ചതിന് നന്ദി. ഞങ്ങളുടെ ഫ്രാഞ്ചൈസി ടീം 24 മണിക്കൂറിനുള്ളിൽ നിങ്ങളെ വിളിക്കും.`,
    noProblem:`പ്രശ്നമില്ല! സമയമെടുക്കൂ. നിങ്ങൾ തയ്യാറാകുമ്പോൾ താഴെ ക്ലിക്ക് ചെയ്ത് ഇൻസ്റ്റാൾ ചെയ്യുക.`,
  }
};

app.get('/',(req,res)=>res.send(`V155 FINAL RECEIPT - REAL TIME RECEIPT - D250=https://rzp.io/rzp/BZ9D9rT C150=https://rzp.io/rzp/ptj9OGpr B100=https://rzp.io/rzp/lAguvzEt - WEBHOOK FIXED FOR STATIC LINKS - BTN 💳 Pay Now - TAB Registration_Fee - `+new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})));
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
    const nowIso = getISTTime();
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
      await saveToSheet('System_Logs', [nowIso, uid, lang, 'Language Selected '+incomingPhoneId, lang, 'Clicked', HELP_ADMIN, 'Language '+lang, ''], false);
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
      await saveToSheet('System_Logs', [nowIso, uid, 'none', 'First Message '+incomingPhoneId, `First Input: ${rawInput} (${msgType})`, 'Received', HELP_ADMIN, 'First', ''], true);
      clearReminders(uid);
      scheduleReminder(uid,'noLang:'+Date.now(),'en',1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noLang2:'+Date.now(),'en',12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noLang3:'+Date.now(),'en',24*60*60*1000, incomingPhoneId);
      return;
    }
    if(isHi && (!state.lastStep || state.lastStep==='First Message' || state.lastStep==='HI - Reset' || state.lastStep==='Language en' || state.lastStep==='Language ml' || state.lastStep==='Language hi')){
      // V207 FIX: Hi/Hai/Hello only resets at START. Mid-flow Hai -> falls through to Sorry + Explain -> repeatLastStep (NOT reset)
      const L=T.en;
      clearReminders(uid);
      await setState(uid,{first:true, lastStep:'HI - Reset', lang:null, phoneId: incomingPhoneId});
      await sendWithDelay(interactiveButton(uid, L.welcome, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'Hindi'},{id:'LANG_ML',title:'Malayalam'}], incomingPhoneId));
      await saveToSheet('System_Logs', [nowIso, uid, 'none', 'Hi Received '+incomingPhoneId, 'Welcome Reset', 'Clicked', HELP_ADMIN, 'HI', ''], true);
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
      else       if(btnId==='SVC_OPP'){ 
        // V174: 2 messages - Company video + income level selection (user exact flow)
        const companyVideo = lang==='ml' ? `നന്നായി! നിങ്ങൾ "ബിസിനസ് അവസരം" തിരഞ്ഞെടുത്തു.\n\nകമ്പനിയെക്കുറിച്ച് അറിയാൻ ഈ വീഡിയോ കാണുക:` : lang==='hi' ? `बहुत बढ़िया! आपने "बिजनेस अवसर" चुना।\n\nकंपनी के बारे में जानने के लिए यह वीडियो देखें:` : `Excellent! You selected "Business Opportunity".\n\nWatch this video to know about the company:`;
        state.lastStep='Company Video - Must Watch'; await setState(uid,state);
        await sendWithDelay(singleCta(uid, companyVideo, {type:'url', title: lang==='ml' ? 'കമ്പനി വീഡിയോ കാണുക' : lang==='hi' ? 'कंपनी वीडियो देखें' : 'Watch Company Video', url:'https://youtu.be/8ZnDlvbgG_c?si=_Ou0nN0nuFf0uOYZ'}, incomingPhoneId));
        // V207: Only 1 message now (Company video). Income Level comes ONLY after Watched confirmation (2-min reminder)
        scheduleReminder(uid, 'install:COMPANY_VIDEO_2MIN:2', lang, 2*60*1000, incomingPhoneId);
      }
      await saveToSheet('System_Logs', [nowIso, uid, lang, btnId+' '+incomingPhoneId, 'Main Service', 'Clicked', btnId==='SVC_OPP'?HELP_MARKETING:HELP_ADMIN, state.lastStep, ''], false);
      await saveToSheet('System_Logs', [nowIso, uid, lang, btnId+' '+incomingPhoneId, 'Main Service', 'Clicked', btnId==='SVC_OPP'?HELP_MARKETING:HELP_ADMIN, state.lastStep, ''], false);
      scheduleReminder(uid, `install:${btnId}:1`, lang, 1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, `install:${btnId}:12`, lang, 12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, `install:${btnId}:24`, lang, 24*60*60*1000, incomingPhoneId);
      return;
    }

    if(btnId==='RIDE_BOOK'){ state.sub='RIDE_BOOK'; state.lastStep='Book a Cab'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendCtaSequence(uid, L.bookCab, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId); await saveToSheet('Ride_Hailing', [nowIso, uid, lang, 'Ride Hailing '+incomingPhoneId, 'Book a Cab', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:RIDE_BOOK:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:RIDE_BOOK:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:RIDE_BOOK:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='RIDE_ATTACH'){ state.sub='RIDE_ATTACH'; state.lastStep='Attach Cab'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendCtaSequence(uid, L.attachCab, [{type:'url', title:'Android', url:PLAY_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId); await saveToSheet('Ride_Hailing', [nowIso, uid, lang, 'Ride Hailing '+incomingPhoneId, 'Attach Cab', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:RIDE_ATTACH:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:RIDE_ATTACH:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:RIDE_ATTACH:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BIZ_REGISTER'){ state.sub='BIZ_REGISTER'; state.lastStep='Register Business'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendCtaSequence(uid, L.bizRegister, [{type:'url', title:'Register', url:WEBSITE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId); await saveToSheet('Business_Directory', [nowIso, uid, lang, 'Business Directory '+incomingPhoneId, 'Register Business', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BIZ_REGISTER:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BIZ_REGISTER:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BIZ_REGISTER:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BIZ_ADS'){ state.sub='BIZ_ADS'; state.lastStep='Start Advertising'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendCtaSequence(uid, L.bizAds, [{type:'url', title:'Advertise Now', url:WEBSITE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId); await saveToSheet('Business_Directory', [nowIso, uid, lang, 'Business Directory '+incomingPhoneId, 'Start Advertising', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BIZ_ADS:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BIZ_ADS:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BIZ_ADS:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='DEL_ORDER'){ state.sub='DEL_ORDER'; state.lastStep='Order Stores'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendCtaSequence(uid, L.delOrder, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId); await saveToSheet('Delivery', [nowIso, uid, lang, 'Online Delivery '+incomingPhoneId, 'Order from Stores', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:DEL_ORDER:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:DEL_ORDER:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:DEL_ORDER:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='DEL_PARTNER'){ state.sub='DEL_PARTNER'; state.lastStep='Delivery Partner'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendCtaSequence(uid, L.delPartner, [{type:'url', title:'Android', url:PLAY_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId); await saveToSheet('Delivery', [nowIso, uid, lang, 'Online Delivery '+incomingPhoneId, 'Delivery Partner', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:DEL_PARTNER:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:DEL_PARTNER:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:DEL_PARTNER:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BOOK_ROOM'){ state.sub='BOOK_ROOM'; state.lastStep='Book Rooms'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendCtaSequence(uid, L.bookRoom, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId); await saveToSheet('Booking', [nowIso, uid, lang, 'Online Booking '+incomingPhoneId, 'Book Rooms', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BOOK_ROOM:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_ROOM:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_ROOM:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BOOK_APPOINT'){ state.sub='BOOK_APPOINT'; state.lastStep='Book Appointments'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendCtaSequence(uid, L.bookAppoint, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId); await saveToSheet('Booking', [nowIso, uid, lang, 'Online Booking '+incomingPhoneId, 'Book Appointments', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BOOK_APPOINT:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_APPOINT:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_APPOINT:24', lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='BOOK_MOVIE'){ state.sub='BOOK_MOVIE'; state.lastStep='Movie Tickets'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendCtaSequence(uid, L.bookMovie, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:HELP_ADMIN_FULL}], incomingPhoneId); await saveToSheet('Booking', [nowIso, uid, lang, 'Online Booking '+incomingPhoneId, 'Movie Tickets', 'Clicked - Admin', HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, 'install:BOOK_MOVIE:1', lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_MOVIE:12', lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, 'install:BOOK_MOVIE:24', lang, 24*60*60*1000, incomingPhoneId); return; }

    if(btnId==='COMPANY_WATCHED'){
      // V207: Company video watched -> now show Income Level (next step)
      state.lastStep='Income Level - After Company Video Watched'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const incomeMsg = lang==='ml' ? `✅ കമ്പനി വീഡിയോ കണ്ടതിന് നന്ദി!\n\nനിങ്ങൾ Bizmapia-യിൽ നിന്ന് വരുമാന സ്ലോട്ട് ബുക്ക് ചെയ്യാൻ പോകുന്നു.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ നിന്ന് വരുമാന തലം തിരഞ്ഞെടുക്കുക - ഉയർന്ന / മിതമായ / അടിസ്ഥാന തലം:-` : lang==='hi' ? `✅ कंपनी वीडियो देखने के लिए धन्यवाद!\n\nआप Bizmapia से आय स्लॉट बुक करने जा रहे हैं।\n\n👉 अब क्या करें: नीचे से आय स्तर चुनें - उच्च / मध्यम / आधार स्तर:-` : `✅ Thanks for watching Company video!\n\nYou are going to book an income slot from Bizmapia.\n\n👉 👇 What to do now: Select income level from below - High / Moderate / Base level:-`;
      await sendWithDelay(interactiveButton(uid, incomeMsg, L.oppButtons, incomingPhoneId));
      return;
    }
    if(btnId==='COMPANY_NOT_WATCHED'){
      // V207: Company video not watched -> resend video + reschedule 2-min reminder
      state.lastStep='Company Video - Not Watched - Resend'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const companyVideo2 = lang==='ml' ? `👉 ദയവായി കമ്പനി വീഡിയോ പൂർണ്ണമായി കാണുക, തുടർന്ന് "കമ്പനി വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `👉 कृपया कंपनी वीडियो पूरा देखें, फिर "कंपनी वीडियो देखा" पर क्लिक करें:` : `👉 Please watch Company video fully, then click "Watched Company Video":`;
      await sendWithDelay(singleCta(uid, companyVideo2, {type:'url', title: lang==='ml' ? 'കമ്പനി വീഡിയോ കാണുക' : lang==='hi' ? 'कंपनी वीडियो देखें' : 'Watch Company Video', url:'https://youtu.be/8ZnDlvbgG_c?si=_Ou0nN0nuFf0uOYZ'}, incomingPhoneId));
      scheduleReminder(uid, 'install:COMPANY_VIDEO_2MIN:2', lang, 2*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='OPP_DISTRICT'){
      state.sub='OPP_DISTRICT'; state.lastStep='💰 High level Income - DISTRICT - Video Must Watch'; state.phoneId=incomingPhoneId; 
      await setState(uid,state); clearReminders(uid);
      const videoUrl = getVideoUrl('OPP_DISTRICT', lang);
      const videoObj = getVideoObj('OPP_DISTRICT', lang);
      // V174: 2 messages - Video + watched confirmation (user exact flow)
      const msg1 = lang==='ml' ? `ഹലോ! നിങ്ങൾ ഉയർന്ന തല വരുമാനം (ജില്ലാ ഫ്രാഞ്ചൈസി) തിരഞ്ഞെടുത്തു.

ജില്ലാ ഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ നോക്കാം.

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: 1) വീഡിയോ കാണുക. 2) "വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക.

⚠ പ്രധാന ഘട്ടം: അടുത്ത ഘട്ടത്തിലേക്ക് പോകുന്നതിന് മുൻപ് നിങ്ങൾ ഈ വീഡിയോ പൂർണ്ണമായി കാണണം!` : lang==='hi' ? `हैलो! आपने उच्च स्तरीय आय (जिला फ्रेंचाइजी) चुनी।

जिला फ्रेंचाइजी विवरण देखें।

👉 अब क्या करें: 1) वीडियो देखें। 2) "वीडियो देखा" पर क्लिक करें।

⚠ महत्वपूर्ण चरण: अगले चरण में जाने से पहले आपको यह वीडियो पूरा देखना होगा!` : `Hello! You selected High Level Income (District Franchise).

Let's check District Franchise details.

👉 👇 What to do now: 1) Watch video. 2) Click "Watched Video".

⚠ Important step: You must watch this video fully before going to next step!`;
      await sendWithDelay(singleCta(uid, msg1, {type:'url', title:L.clickWatch, url:videoUrl}, incomingPhoneId));
      // V207: Only 1 message now (msg1). msg2 (Did you watch?) will come as 2-min reminder, NOT immediately.
      scheduleReminder(uid, 'install:OPP_DISTRICT_VIDEO_2MIN:2', lang, 2*60*1000, incomingPhoneId);
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, '💰 High level Income', 'Clicked', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:OPP_DISTRICT:1', lang, 1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_DISTRICT:12', lang, 12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_DISTRICT:24', lang, 24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='OPP_CORP'){
      state.sub='OPP_CORP'; state.lastStep='💼 Moderate income - CORP/MUNI - Video Must Watch'; state.phoneId=incomingPhoneId; 
      await setState(uid,state); clearReminders(uid);
      const videoUrl = getVideoUrl('OPP_CORP', lang);
      const videoObj = getVideoObj('OPP_CORP', lang);
      const msg1 = lang==='ml' ? `ഹലോ! നിങ്ങൾ മിതമായ തല വരുമാനം (കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി) തിരഞ്ഞെടുത്തു.

കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ നോക്കാം.

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: 1) വീഡിയോ കാണുക. 2) "വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക.

⚠ പ്രധാന ഘട്ടം: അടുത്ത ഘട്ടത്തിലേക്ക് പോകുന്നതിന് മുൻപ് നിങ്ങൾ ഈ വീഡിയോ പൂർണ്ണമായി കാണണം!` : lang==='hi' ? `हैलो! आपने मध्यम स्तरीय आय (कॉरपोरेशन / म्युनिसिपल फ्रेंचाइजी) चुनी।

कॉरपोरेशन / म्युनिसिपल फ्रेंचाइजी विवरण देखें।

👉 अब क्या करें: 1) वीडियो देखें। 2) "वीडियो देखा" पर क्लिक करें।

⚠ महत्वपूर्ण चरण: अगले चरण में जाने से पहले आपको यह वीडियो पूरा देखना होगा!` : `Hello! You selected Moderate Level Income (Corporation / Municipal Franchise).

Let's check Corporation / Municipal Franchise details.

👉 👇 What to do now: 1) Watch video. 2) Click "Watched Video".

⚠ Important step: You must watch this video fully before going to next step!`;
      await sendWithDelay(singleCta(uid, msg1, {type:'url', title:L.clickWatch, url:videoUrl}, incomingPhoneId));
      // V207: Only 1 message now (msg1). msg2 (Did you watch?) will come as 2-min reminder, NOT immediately.
      scheduleReminder(uid, 'install:OPP_CORP_VIDEO_2MIN:2', lang, 2*60*1000, incomingPhoneId);
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, '💼 Moderate income', 'Clicked', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:OPP_CORP:1', lang, 1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_CORP:12', lang, 12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_CORP:24', lang, 24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='OPP_CENTER'){
      state.sub='OPP_CENTER'; state.lastStep='🚀 Base level Income - CENTER - Video Must Watch'; state.phoneId=incomingPhoneId; 
      await setState(uid,state); clearReminders(uid);
      const videoUrl = getVideoUrl('OPP_CENTER', lang);
      const videoObj = getVideoObj('OPP_CENTER', lang);
      const msg1 = lang==='ml' ? `ഹലോ! നിങ്ങൾ അടിസ്ഥാന തല വരുമാനം (ബിസിനസ് സെന്റർ) തിരഞ്ഞെടുത്തു.

ബിസിനസ് സെന്റർ വിശദാംശങ്ങൾ നോക്കാം.

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: 1) വീഡിയോ കാണുക. 2) "വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക.

⚠ പ്രധാന ഘട്ടം: അടുത്ത ഘട്ടത്തിലേക്ക് പോകുന്നതിന് മുൻപ് നിങ്ങൾ ഈ വീഡിയോ പൂർണ്ണമായി കാണണം!` : lang==='hi' ? `हैलो! आपने आधार स्तरीय आय (बिजनेस सेंटर) चुनी।

बिजनेस सेंटर विवरण देखें।

👉 अब क्या करें: 1) वीडियो देखें। 2) "वीडियो देखा" पर क्लिक करें।

⚠ महत्वपूर्ण चरण: अगले चरण में जाने से पहले आपको यह वीडियो पूरा देखना होगा!` : `Hello! You selected Base Level Income (Business Center).

Let's check Business Center details.

👉 👇 What to do now: 1) Watch video. 2) Click "Watched Video".

⚠ Important step: You must watch this video fully before going to next step!`;
      await sendWithDelay(singleCta(uid, msg1, {type:'url', title:L.clickWatch, url:videoUrl}, incomingPhoneId));
      // V207: Only 1 message now (msg1). msg2 (Did you watch?) will come as 2-min reminder, NOT immediately.
      scheduleReminder(uid, 'install:OPP_CENTER_VIDEO_2MIN:2', lang, 2*60*1000, incomingPhoneId);
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, '🚀 Base level Income', 'Clicked', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:OPP_CENTER:1', lang, 1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_CENTER:12', lang, 12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_CENTER:24', lang, 24*60*60*1000, incomingPhoneId);
      return;
    }
    // ==================== V125 CONFIRMATION FLOW - ALL LANGUAGES ====================
    if(btnId==='VIDEO_WATCHED'){
      state.lastStep='Benefits - After Video Watched'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const benDyn = getBenText(state.sub, lang);
      const qText = lang==='ml' ? `

👋 ആനുകൂല്യങ്ങൾ വായിച്ചോ? മനസ്സിലായോ?

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: മനസ്സിലായെങ്കിൽ "ആനുകൂല്യം മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `

👋 लाभ पढ़े? समझ में आया?

👉 अब क्या करें: समझ आया तो "लाभ समझा" पर क्लिक करें:` : `

👋 Did you read Benefits? Understood?

👉 👇 What to do now: If understood, click "Understood Benefit" below:`;
      const combinedMsg = benDyn + qText;
      await sendWithDelay(interactiveButton(uid, combinedMsg, [{id:'UNDERSTOOD_BEN',title:L.understoodBen}], incomingPhoneId));
      return;
    }
    if(btnId==='KNOW_BEN_AGAIN'){
      state.lastStep='Benefits - Again'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const benDyn = getBenText(state.sub, lang);
      const qText = lang==='ml' ? `

👋 ആനുകൂല്യങ്ങൾ വായിച്ചോ? മനസ്സിലായോ?

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: മനസ്സിലായെങ്കിൽ "ആനുകൂല്യം മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `

👋 लाभ पढ़े? समझ में आया?

👉 अब क्या करें: समझ आया तो "लाभ समझा" पर क्लिक करें:` : `

👋 Did you read Benefits? Understood?

👉 👇 What to do now: If understood, click "Understood Benefit" below:`;
      const combinedMsg = benDyn + qText;
      await sendWithDelay(interactiveButton(uid, combinedMsg, [{id:'UNDERSTOOD_BEN',title:L.understoodBen}], incomingPhoneId));
      return;
    }
    if(btnId==='UNDERSTOOD_BEN'){
      state.lastStep='Support - After Benefits Understood'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const supDyn = getSupText(state.sub, lang);
      const qText = lang==='ml' ? `

👋 പിന്തുണ വായിച്ചോ? മനസ്സിലായോ?

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: മനസ്സിലായെങ്കിൽ "കണ്ടു മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `

👋 सपोर्ट पढ़ा? समझ में आया?

👉 अब क्या करें: समझ आया तो "देखा और समझा" पर क्लिक करें:` : `

👋 Did you read Support? Understood?

👉 👇 What to do now: If understood, click "Seen and Understood" below:`;
      const combinedMsg = supDyn + qText;
      await sendWithDelay(interactiveButton(uid, combinedMsg, [{id:'UNDERSTOOD_SUP',title:L.understoodSup}], incomingPhoneId));
      return;
    }
    if(btnId==='KNOW_SUP_AGAIN'){
      state.lastStep='Support - Again'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const supDyn = getSupText(state.sub, lang);
      const qText = lang==='ml' ? `

👋 പിന്തുണ വായിച്ചോ? മനസ്സിലായോ?

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: മനസ്സിലായെങ്കിൽ "കണ്ടു മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `

👋 सपोर्ट पढ़ा? समझ में आया?

👉 अब क्या करें: समझ आया तो "देखा और समझा" पर क्लिक करें:` : `

👋 Did you read Support? Understood?

👉 👇 What to do now: If understood, click "Seen and Understood" below:`;
      const combinedMsg = supDyn + qText;
      await sendWithDelay(interactiveButton(uid, combinedMsg, [{id:'UNDERSTOOD_SUP',title:L.understoodSup}], incomingPhoneId));
      return;
    }
    if(btnId==='UNDERSTOOD_SUP'){
      state.lastStep='Requirements - After Support Understood'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const reqDyn = getReqText(state.sub, lang);
      const qText = lang==='ml' ? `

👋 ആവശ്യകതകൾ വായിച്ചോ? മനസ്സിലായോ?

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: മനസ്സിലായെങ്കിൽ "ആവശ്യകത മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `

👋 आवश्यकताएं पढ़ीं? समझ में आईं?

👉 अब क्या करें: समझ आईं तो "आवश्यकता समझी" पर क्लिक करें:` : `

👋 Did you read Requirements? Understood?

👉 👇 What to do now: If understood, click "Understood Req" below:`;
      const combinedMsg = reqDyn + qText;
      await sendWithDelay(interactiveButton(uid, combinedMsg, [{id:'UNDERSTOOD_REQ',title:L.understoodReq}], incomingPhoneId));
      return;
    }
    if(btnId==='KNOW_REQ_AGAIN'){
      state.lastStep='Requirements - Again'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const reqDyn = getReqText(state.sub, lang);
      const qText = lang==='ml' ? `

👋 ആവശ്യകതകൾ വായിച്ചോ? മനസ്സിലായോ?

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: മനസ്സിലായെങ്കിൽ "ആവശ്യകത മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `

👋 आवश्यकताएं पढ़ीं? समझ में आईं?

👉 अब क्या करें: समझ आईं तो "आवश्यकता समझी" पर क्लिक करें:` : `

👋 Did you read Requirements? Understood?

👉 👇 What to do now: If understood, click "Understood Req" below:`;
      const combinedMsg = reqDyn + qText;
      await sendWithDelay(interactiveButton(uid, combinedMsg, [{id:'UNDERSTOOD_REQ',title:L.understoodReq}], incomingPhoneId));
      return;
    }
    if(btnId==='UNDERSTOOD_REQ'){
      state.lastStep='Requirements Understood - Ready to Submit'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const submitMsg = lang==='ml' ? `✅ എല്ലാം മനസ്സിലായി! ഇപ്പോൾ അപേക്ഷ സമർപ്പിക്കാം.` : lang==='hi' ? `✅ सब समझ में आ गया! अब आवेदन जमा करते हैं।` : `✅ All understood! Now submit application.`;
      await sendWithDelay(textMessage(uid,submitMsg, incomingPhoneId));
      await delay(400);
      await sendWithDelay(interactiveButton(uid, L.corpQ, [{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], incomingPhoneId));
      return;
    }

    if(btnId==='KNOW_BEN'){ state.lastStep='Benefits'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveWithPhoneCTA(uid,L.benText + `

Next:`,[{id:'KNOW_SUP',title:L.supBtn}], HELP_MARKETING, incomingPhoneId)); await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Know Benefits', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_BEN:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_BEN:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_BEN:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='KNOW_SUP'){ state.lastStep='Support'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.supText, incomingPhoneId)); await delay(300); await sendWithDelay(interactiveWithPhoneCTA(uid,'Next:',[{id:'KNOW_REQ',title:L.reqBtn}], HELP_MARKETING, incomingPhoneId)); await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Know Support', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_SUP:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUP:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUP:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='KNOW_REQ'){ state.lastStep='Requirements'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.reqText, incomingPhoneId)); await delay(300); await sendWithDelay(interactiveButton(uid,'Next:',[{id:'SUBMIT_APP',title:L.submitBtn}], incomingPhoneId)); await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Requirements', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_REQ:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_REQ:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_REQ:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='SUBMIT_APP'){ state.lastStep='Submit Application - Corp Check'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.corpQ,[{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], incomingPhoneId)); await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Submit Application', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_SUBMIT:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUBMIT:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUBMIT:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='CORP_YES'||btnId==='CORP_NO'){ 
      const isYes = btnId==='CORP_YES'; const fee = getFee(state.sub, isYes); const franchiseName = getFranchiseName(state.sub, isYes);
      state.fee = fee; state.franchiseName = franchiseName; state.isCorp = isYes; state.lastStep=`Ready ${fee}L - ${franchiseName} - Corp:`+btnId; state.phoneId=incomingPhoneId;
      await setState(uid,state); clearReminders(uid); 
      const readyText = getReadyText(lang, fee, franchiseName);
      const readyBtnTitle = lang==='ml' ? `അതെ തയ്യാർ - ${fee}L` : lang==='hi' ? `हाँ तैयार - ${fee}L` : `Yes Ready - ${fee}L`;
      await sendWithDelay(interactiveButton(uid,readyText,[{id:'READY_15L',title:readyBtnTitle},{id:'KNOW_EMI',title:L.emiBtn}], incomingPhoneId)); 
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `Corp Check ${btnId} Fee ${fee}L ${franchiseName}`, 'Clicked', HELP_MARKETING, state.lastStep, `Fee:${fee}L`], true);
      scheduleReminder(uid,'install:OPP_CORPCHECK:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_CORPCHECK:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_CORPCHECK:24',lang,24*60*60*1000, incomingPhoneId); return; 
    }
    if(btnId==='READY_15L'){ 
      const fee = state.fee || 15; 
      state.lastStep=`Pay Reg Fee Rs${getTokenFee(state.sub)} - ${fee}L`; 
      await setState(uid,state); 
      clearReminders(uid); 
      const payText = getPayText(lang, fee, state.sub);
  try{ saveRegistrationFee(uid, state.sub, fee); }catch(e){}
      const dynamicLink = await createRazorpayPaymentLink(uid, state.sub, fee);
      await sendWithDelay(singleCta(uid, payText, {type:'url', title: L.payFeeNow, url: getRazorpayLinkForSub(state.sub)}));
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `Ready ${fee}L`, 'Clicked', HELP_MARKETING, state.lastStep, `Fee:${fee}L`], true);
      scheduleReminder(uid,'install:OPP_READY:1',lang,1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_READY:12',lang,12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_READY:24',lang,24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='KNOW_EMI'){ const fee = state.fee || 15; state.lastStep=`💳 EMI Options - ${fee}L`; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); const emiText = getEMIText(lang, fee); 
      // Business Center (1L) uses 5 and 9 months, others use 10 and 20 as before but titles now show 5/9 for BC
      let emiButtons = [{id:'EMI_10',title:L.emi10},{id:'EMI_20',title:L.emi20}];
      if(fee===1){
        emiButtons = [{id:'EMI_5',title: lang==='ml' ? 'EMI 5 മാസം' : lang==='hi' ? 'EMI 5 महीने' : 'EMI 5 Months'},{id:'EMI_9',title: lang==='ml' ? 'EMI 9 മാസം' : lang==='hi' ? 'EMI 9 महीने' : 'EMI 9 Months'}];
      }
      await sendWithDelay(interactiveButton(uid,emiText + "\n\nPlease select any one from below:-",emiButtons, incomingPhoneId)); await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `EMI Options Fee ${fee}L`, 'Clicked', HELP_MARKETING, state.lastStep, `Fee:${fee}L`], true); scheduleReminder(uid,'install:OPP_EMI:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_EMI:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_EMI:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='EMI_10'||btnId==='EMI_20'||btnId==='EMI_5'||btnId==='EMI_9'){ 
      const fee = state.fee || 15; 
      state.lastStep='✅ EMI Selected '+btnId+` - ${fee}L`; 
      await setState(uid,state); 
      clearReminders(uid); 
      const payText = getPayText(lang, fee, state.sub);
  try{ saveRegistrationFee(uid, state.sub, fee); }catch(e){} 
      const dynamicLink = await createRazorpayPaymentLink(uid, state.sub, fee);
      await sendWithDelay(singleCta(uid, payText, {type:'url', title: L.payFeeNow, url: getRazorpayLinkForSub(state.sub)}));
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `EMI ${btnId} Fee ${fee}L`, 'Clicked', HELP_MARKETING, state.lastStep, `Fee:${fee}L`], true);
      scheduleReminder(uid,'install:OPP_EMISEL:1',lang,1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_EMISEL:12',lang,12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_EMISEL:24',lang,24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='PAY_NOT_DONE'){ 
      state.lastStep=`Not Paid - ${state.fee||15}L`; 
      await setState(uid,state); 
      clearReminders(uid); 
      const payText = getPayText(lang, state.fee||15, state.sub);
      const dynamicLink = await createRazorpayPaymentLink(uid, state.fee||15);
      await sendWithDelay(singleCta(uid, payText, {type:'url', title: L.payFeeNow, url: getRazorpayLinkForSub(state.sub)}));
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `Not Paid ${state.fee||15}L`, 'Pending', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid,'install:NOTPAID:1',lang,1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:NOTPAID:12',lang,12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:NOTPAID:24',lang,24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='PAY_NOW_CLICK'){
      // V207: User clicked Pay Now (reply button) in 1-message Pay flow -> send Pay URL button
      const payLink2 = getRazorpayLinkForSub(state.sub);
      const payText2 = getPayText(lang, state.fee||15, state.sub);
      await sendWithDelay(singleCta(uid, payText2, {type:'url', title: L.payFeeNow, url: payLink2}, incomingPhoneId));
      return;
    }
    if(btnId==='PAY_DONE'){
      // USER CLAIMS PAID - BUT NOT VERIFIED YET
      state.lastStep=`PAY CLAIMED - Verifying ${state.fee||15}L`; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const verifyMsg = lang==='ml' ? `⚠️ നിങ്ങൾ പണം അടച്ചതായി ക്ലെയിം ചെയ്തു.

ഞങ്ങൾ Razorpay-ൽ നിന്ന് ഓട്ടോമാറ്റിക്കായി പരിശോധിക്കുകയാണ്.\n\n✅ പേയ്മെന്റ് ശരിയാണെങ്കിൽ 2 മിനിറ്റിനുള്ളിൽ നിങ്ങൾക്ക് ഓട്ടോമാറ്റിക്കായി അടുത്ത സ്റ്റെപ്പ് ലഭിക്കും.\n\nദയവായി നിങ്ങളുടെ Payment ID / UTR ഇവിടെ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സ്ക്രീൻഷോട്ട് അയക്കുക.` : lang==='hi' ? `⚠️ आपने भुगतान का दावा किया है।\n\nहम Razorpay से ऑटो-वेरिफाई कर रहे हैं।\n\n✅ अगर भुगतान सही है तो 2 मिनट में अगला स्टेप ऑटो आएगा।\n\nकृपया अपना Payment ID / UTR टाइप करें या स्क्रीनशॉट भेजें।` : `⚠️ You claimed payment done.\n\nWe are auto-verifying with Razorpay...\n\n✅ If payment is genuine, you will get next step automatically in 2 mins.\n\nPlease also type your Payment ID / UTR or send screenshot for manual check.`;
      await sendWithDelay(textMessage(uid,verifyMsg, incomingPhoneId));
      await saveToSheet('Payments', [nowIso, uid, lang, `CLAIMED ${state.fee||15}L`, txt || btnId, 'NEEDS VERIFICATION', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid,'install:VERIFY:1',lang,2*60*1000, incomingPhoneId);
      return;
    }

    if(btnId.startsWith('OCC_')){ const occ = btnId.replace('OCC_',''); state.occupation=occ; state.lastStep='Occupation '+occ; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.dateQ,[{id:'DATE_TODAY',title:L.today},{id:'DATE_TOMORROW',title:L.tomorrow}], incomingPhoneId)); await saveToSheet('Master_Leads', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Occupation '+occ, 'Clicked', HELP_MARKETING, state.lastStep, occ], true); scheduleReminder(uid,'install:OCC:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId.startsWith('DATE_')){ const date = btnId.replace('DATE_',''); state.date=date; state.lastStep='Date '+date; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); const tenderMsg = getTenderGreeting(state.sub||'OPP_DISTRICT', lang);
      await sendWithDelay(textMessage(uid,tenderMsg, incomingPhoneId)); await delay(300); await sendWithDelay(textMessage(uid,L.thanks, incomingPhoneId)); await saveToSheet('Master_Leads', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Date '+date, 'Clicked', HELP_MARKETING, state.lastStep, JSON.stringify(state)], true); await setState(uid,{lang, lastStep:'Completed', flow:'DONE', occupation:state.occupation, date:state.date, phoneId: incomingPhoneId}); return; }

    if(btnId==='YES_ACTIVATE'){ state.installed=true; state.lastStep='Yes Activate'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.activated, incomingPhoneId)); await saveToSheet('Ride_Hailing', [nowIso, uid, lang, state.sub||'App', 'Yes Activate - Installed', 'Success', state.service==='SVC_OPP' ? HELP_MARKETING : HELP_ADMIN, state.lastStep, ''], true); return; }
    if(btnId==='NO_LATER'){ state.lastStep='No Later'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); const isOpp = state.service==='SVC_OPP' || state.sub?.startsWith('OPP_'); const callNum = isOpp ? HELP_MARKETING_FULL : HELP_ADMIN_FULL; await sendCtaSequence(uid, L.noProblem, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:callNum}], incomingPhoneId); await saveToSheet('Ride_Hailing', [nowIso, uid, lang, state.sub||'App', 'No Later - Pending', 'Pending', isOpp?HELP_MARKETING:HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, `install:${state.sub||'APP'}:1`, lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, `install:${state.sub||'APP'}:12`, lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, `install:${state.sub||'APP'}:24`, lang, 24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='CALL_ADMIN'||btnId==='HELP_ADMIN'){ await sendWithDelay(textMessage(uid,`📞 Customer Care: ${HELP_ADMIN}\n\nTap to call: +91 ${HELP_ADMIN}\n\ntel:+91${HELP_ADMIN}`, incomingPhoneId)); return; }
    if(btnId==='CALL_MARKETING'||btnId==='HELP_MARKETING'){ await sendWithDelay(textMessage(uid,`📞 Franchise Team: ${HELP_MARKETING}\n\nTap to call: +91 ${HELP_MARKETING}\n\ntel:+91${HELP_MARKETING}`, incomingPhoneId)); return; }

    if(state.flow==='LEAD' && txt){ state.leadData=txt; state.lastStep='Lead Typed'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid,L.occQ,[{id:'OCC_BUSINESS',title:L.bus},{id:'OCC_HOUSE',title:L.house},{id:'OCC_EMP',title:L.emp}], incomingPhoneId)); await saveToSheet('Master_Leads', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Lead Data', txt, HELP_MARKETING, state.lastStep, txt], true); scheduleReminder(uid,'install:OCC:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:24',lang,24*60*60*1000, incomingPhoneId); return; }

    const msgType = msg.type||'text';
    const isMedia = ['image','video','audio','document','sticker','reaction'].includes(msgType);
    const isRandomText = txt && btnId==='' && state.flow!=='LEAD';
    if((isRandomText || isMedia) && state.lang){
      // V207: Sorry + Explain last step + No Human before Registration Fee. Human only from Pay step.
      const sorryMsg = getSorryExplain(lang, state.lastStep||'', txt);
      await sendWithDelay(textMessage(uid, sorryMsg, incomingPhoneId));
      await delay(400);
      if(state.lastStep && (state.lastStep.includes('Pay Reg') || state.lastStep.includes('✅ EMI Selected') || state.lastStep.includes('Not Paid') || state.lastStep.startsWith('Pay '))){
        // V207: Pay step random = 1 MESSAGE ONLY with 3 buttons. User typed = confused = needs Human in SAME message.
        // WhatsApp cannot mix URL button + Reply buttons in 1 message, so Pay link is put as clickable text inside body.
        // Buttons: [Pay Now] [Verify] [Talk to Team] - all Reply buttons, all <=20 chars.
        // Malayalam fix: "ടീമിനോട് സംസാരിക്കൂ" (22 chars) was cut to "മനുഷ്യനോട് സംസാരിക്ക" in screenshot. New "ടീമിനോട് സംസാരിക്കൂ" fits, full meaning.
        const payText = getPayText(lang, state.fee||15, state.sub);
        const payLink = getRazorpayLinkForSub(state.sub);
        const oneMsgBody = sorryMsg + `\n\n➖➖➖➖➖\n\n` + payText + `\n\n🔗 ${payLink}`;
        const btnPay = lang==='ml' ? 'ഇപ്പോൾ അടയ്ക്കുക' : lang==='hi' ? 'अभी भुगतान करें' : 'Pay Now';
        const btnVerify = lang==='ml' ? 'അടച്ചു - പരിശോധിക്കൂ' : lang==='hi' ? 'भुगतान किया - जांचें' : 'I Paid - Verify';
        const btnHuman = lang==='ml' ? 'ടീമിനോട് സംസാരിക്കൂ' : lang==='hi' ? 'टीम से बात करें' : 'Talk to Team';
        await sendWithDelay(interactiveButton(uid, oneMsgBody, [{id:'PAY_NOW_CLICK',title: btnPay},{id:'PAY_VERIFY',title: btnVerify},{id:'HUMAN_TALK',title: btnHuman}], incomingPhoneId));
        return;
      }
      // Before Pay: NO human button - only repeat last step buttons
      await repeatLastStep(uid, state, lang, incomingPhoneId);
      return;
    }
    if(state.lang){ await sendWithDelay(interactiveButton(uid,L.mainMenu,L.services.slice(0,3), incomingPhoneId)); }
  }catch(e){ console.log('webhook error',e.message,e.stack); }
});


app.post('/razorpay-webhook', async(req,res)=>{
  try{
    const signature = req.headers['x-razorpay-signature'] || '';
    if(RAZORPAY_WEBHOOK_SECRET && signature){
      const isValid = verifyRazorpaySignature(req.body, signature, RAZORPAY_WEBHOOK_SECRET);
      if(!isValid){ console.log('RAZORPAY SIGNATURE FAIL'); return res.status(400).send('invalid signature'); }
    }
    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;
    if(event==='payment.captured' && payment){
      const notes = payment.notes || {};
      const uid = notes.whatsapp || payment.contact?.replace(/\+91/,'') || null;
      const fee = notes.fee || '15';
      const paymentId = payment.id;
      const amount = payment.amount/100;
      console.log(`RAZORPAY VERIFIED PAYMENT ${paymentId} for ${uid} amount ${amount}`);
      if(uid){
        let cleanUid = uid.replace(/[^0-9]/g,'');
        if(cleanUid.length===10) cleanUid='91'+cleanUid;
        if(cleanUid.length<10){ // try find by contact
          cleanUid = payment.contact?.replace(/[^0-9]/g,'') || uid;
          if(cleanUid.length===10) cleanUid='91'+cleanUid;
        }
        const state = await getState(cleanUid);
        const lang = state?.lang || 'en';
        const phoneId = state?.phoneId || PHONE_NUMBER_ID;
        const L = T[lang]||T.en;
        await setState(cleanUid,{...state, flow:'LEAD', lastStep:'Payment VERIFIED '+paymentId, verified:true, fee: parseInt(fee), phoneId});
        clearReminders(cleanUid);
        await sendWithDelay(textMessage(cleanUid, `✅ Payment Verified! ${paymentId} - Rs${amount}\n\nNow please continue:`, phoneId));
        await delay(300);
        await sendWithDelay(textMessage(cleanUid, L.leadAsk, phoneId));
        await saveToSheet('Payments', [getISTTime(), cleanUid, lang, `VERIFIED ${fee}L`, paymentId, 'VERIFIED Rs'+amount, HELP_MARKETING, 'Payment Verified', JSON.stringify(payment.notes)], true);
        await saveToSheet('Franchise_Funnel', [getISTTime(), cleanUid, lang, `VERIFIED ${fee}L`, paymentId, 'PAID', HELP_MARKETING, 'Payment Verified', ''], false);
      }
    }
    res.sendStatus(200);
  }catch(e){ console.log('razorpay-webhook error', e.message, e.stack); res.sendStatus(200); }
});

app.get('/verify/:phone', async(req,res)=>{
  try{
    let uid = req.params.phone.replace(/[^0-9]/g,'');
    if(uid.length===10) uid='91'+uid;
    const state = await getState(uid);
    const lang = state?.lang || 'en';
    const phoneId = state?.phoneId || PHONE_NUMBER_ID;
    const L = T[lang]||T.en;
    await setState(uid,{...state, flow:'LEAD', lastStep:'Manually Verified', verified:true, phoneId});
    await sendWithDelay(textMessage(uid, `✅ Your payment has been manually verified by team!\n\n`+L.leadAsk, phoneId));
    res.send(`✅ Manually verified ${uid}`);
  }catch(e){ res.send(`Error ${e.message}`); }
});


app.get('/clear/:phone', async(req,res)=>{ try{ let uid = req.params.phone.replace(/[^0-9]/g,''); if(uid.length===10) uid='91'+uid; if(redisReady && redis){ await redis.del(`state:${uid}`); } memoryStore.delete(uid); clearReminders(uid); res.send(`✅ Cleared user ${uid}`); }catch(e){ res.send(`Error: ${e.message}`); } });
app.get('/clear-all', async(req,res)=>{ try{ if(redisReady && redis){ const keys = await redis.keys('state:*'); if(keys.length>0) await redis.del(...keys); res.send(`✅ Cleared all ${keys.length} users`); } else { memoryStore.clear(); res.send(`✅ Cleared memoryStore`); } }catch(e){ res.send(`Error: ${e.message}`); } });
app.get('/check/:phone', async(req,res)=>{ try{ let uid = req.params.phone.replace(/[^0-9]/g,''); if(uid.length===10) uid='91'+uid; const state = await getState(uid); res.json({uid, state, redisReady, memoryHas: memoryStore.has(uid)}); }catch(e){ res.send(`Error: ${e.message}`); } });


// ==================== GOOGLE SHEET MANAGEMENT - 8 SHEETS ONLY ====================
app.get('/cleanup-old-tabs', async(req,res)=>{
  try{
    const sheets = await getSheets();
    if(!sheets) return res.send('Sheets client not ready');
    const meta = await sheets.spreadsheets.get({spreadsheetId: SHEET_ID});
    const all = meta.data.sheets.map(s=>({id:s.properties.sheetId, title:s.properties.title}));
    const toDelete = all.filter(s=>!ALLOWED_SHEETS.includes(s.title));
    if(toDelete.length===0) return res.send(`✅ Already clean! Only 8 tabs: ${ALLOWED_SHEETS.join(', ')}`);
    const requests = toDelete.map(s=>({deleteSheet:{sheetId:s.id}}));
    await sheets.spreadsheets.batchUpdate({spreadsheetId: SHEET_ID, requestBody:{requests}});
    res.send(`✅ Deleted ${toDelete.length} old tabs: ${toDelete.map(s=>s.title).join(', ')}<br><br>Now only 8 tabs: ${ALLOWED_SHEETS.join(', ')}`);
  }catch(e){ res.send(`❌ Error: ${e.message}`); }
});

// WIPE ALL DATA - KEEP 8 SHEETS EMPTY FOR FRESH START
app.get('/wipe-all-sheets', async(req,res)=>{
  try{
    const key = req.query.key || '';
    if(key !== '95677'){
      return res.send(`<h2>⚠️ WARNING: DELETE ALL RECORDS from 8 sheets?</h2><p>Keeps 8 tabs but deletes all rows (fresh start).</p><p><a href="/wipe-all-sheets?key=95677"><b>CLICK TO CONFIRM WIPE ALL</b></a></p>`);
    }
    const sheets = await getSheets();
    if(!sheets) return res.send('Sheets client not ready');
    let results = [];
    for(let tab of ALLOWED_SHEETS){
      try{
        await sheets.spreadsheets.values.clear({spreadsheetId: SHEET_ID, range: `'${tab}'!A2:Z10000`});
        results.push(`✅ ${tab}: Wiped`);
      }catch(e){ results.push(`❌ ${tab}: ${e.message}`); }
    }
    res.send(`<h2>✅ ALL 8 SHEETS WIPED - FRESH START</h2><p>${results.join('<br>')}</p><p>Now empty and ready for new data. Use /replay-last-4-days to rewrite history.</p>`);
  }catch(e){ res.send(`Error: ${e.message}`); }
});

// REPLAY LAST 4 DAYS FROM RENDER LOGS (Redis + Memory) TO SHEETS
app.get('/replay-last-4-days', async(req,res)=>{
  try{
    const key = req.query.key || '';
    if(key !== '95677'){
      return res.send(`<h2>🔄 Replay last 4 days WhatsApp chats from Render to Google Sheet</h2><p>This reads all chats stored in Redis (7 days) + Memory and writes them to 8 sheets correctly.</p><p><a href="/replay-last-4-days?key=95677"><b>CLICK TO REPLAY LAST 4 DAYS</b></a></p><p>Use after wipe to restore history.</p>`);
    }
    let allStates = [];
    // Memory
    for(let [uid, state] of memoryStore.entries()){
      const age = state.lastActive ? (Date.now() - state.lastActive) : 0;
      if(age < 4*24*60*60*1000 || age===0) allStates.push({uid, state, source:'memory', age});
    }
    // Redis - 7 days TTL, filter 4 days
    if(redisReady && redis){
      try{
        const keys = await redis.keys('state:*');
        for(let k of keys){
          const uid = k.replace('state:','');
          if(allStates.find(s=>s.uid===uid)) continue;
          try{
            const v = await redis.get(k);
            if(v){
              const state = JSON.parse(v);
              const age = state.lastActive ? (Date.now() - state.lastActive) : 0;
              if(age < 4*24*60*60*1000 || age===0) allStates.push({uid, state, source:'redis', age});
            }
          }catch{}
        }
      }catch(e){ console.log('replay redis error', e.message); }
    }
    if(allStates.length===0){
      return res.send(`❌ No chats found in last 4 days in Render memory/Redis.<br>Reason: Render restarts clear memory. But Redis should have 7 days if connected.<br>Check /all-chats to see what's available.<br>Redis connected: ${redisReady}`);
    }
    let saved = 0;
    const nowIso = getISTTime();
    for(let {uid, state} of allStates){
      try{
        const lang = state.lang || 'en';
        const sub = state.sub || state.service || 'System_Logs';
        const lastStep = state.lastStep || 'Unknown';
        const fee = state.fee || '';
        let tab = 'System_Logs';
        if(sub.includes('RIDE') || lastStep.includes('Cab') || lastStep.includes('Book a Cab') || lastStep.includes('Attach Cab')) tab = 'Ride_Hailing';
        else if(sub.includes('BIZ_') || lastStep.includes('Business Directory') || lastStep.includes('Register Business') || lastStep.includes('Start Advertising')) tab = 'Business_Directory';
        else if(sub.includes('DEL_') || lastStep.includes('Delivery') || lastStep.includes('Order Stores')) tab = 'Delivery';
        else if(sub.includes('BOOK_') || lastStep.includes('Book Rooms') || lastStep.includes('Book Appointments') || lastStep.includes('Movie Tickets')) tab = 'Booking';
        else if(sub.includes('OPP_') || lastStep.includes('District') || lastStep.includes('Corp') || lastStep.includes('Center') || lastStep.includes('Benefits') || lastStep.includes('Support') || lastStep.includes('Requirements') || lastStep.includes('Submit Application') || lastStep.includes('Ready') || lastStep.includes('Pay') || lastStep.includes('EMI') || lastStep.includes('High level') || lastStep.includes('Moderate') || lastStep.includes('Base level')) tab = 'Franchise_Funnel';
        else if(lastStep.includes('Occupation') || lastStep.includes('Date') || lastStep.includes('Lead Typed')) tab = 'Master_Leads';
        else if(lastStep.includes('Payment') || lastStep.includes('VERIFIED') || lastStep.includes('Pay Done')) tab = 'Payments';
        
        const row = [nowIso, uid, lang, `${sub} (REPLAY 4 DAYS)`, lastStep, 'Recovered from Render', (state.service==='SVC_OPP' || state.sub?.startsWith('OPP_') || sub?.startsWith('OPP_') || lastStep.includes('Business Opportunity') || lastStep.includes('High level') || lastStep.includes('Moderate level') || lastStep.includes('Base level') ? HELP_MARKETING : HELP_ADMIN), lastStep, fee ? `Fee:${fee}L Occupation:${state.occupation||''} Date:${state.date||''}` : `Flow:${state.flow||''} Occ:${state.occupation||''} Date:${state.date||''} Lead:${state.leadData||''}` ];
        await saveToSheet(tab, row, true);
        saved++;
        await new Promise(r=>setTimeout(r,150));
      }catch(e){ console.log(`replay fail ${uid}`, e.message); }
    }
    res.send(`<h2>✅ REPLAYED LAST 4 DAYS</h2><p>✅ Replayed ${saved}/${allStates.length} chats from last 4 days to Google Sheets</p><p>Sources: Memory + Redis (7 days TTL)</p><p>Tabs used: Based on lastStep/service - System_Logs, Franchise_Funnel, Master_Leads, Payments, etc.</p><br><p><a href="/sheet-data?tab=System_Logs&limit=100">Check System_Logs</a> | <a href="/sheet-data?tab=Franchise_Funnel&limit=100">Check Franchise_Funnel</a> | <a href="/all-chats">View All Chats JSON</a></p>`);
  }catch(e){ res.send(`Error: ${e.message}<br>${e.stack}`); }
});

// WIPE + REPLAY - ONE CLICK CLEAR + REWRITE LAST 4 DAYS

// === FIX: Missing functions for wipe-and-replay - Added in V155 ===
async function getAllChatsFromMemory(){
  try{
    if(redisReady && redis){
      const keys = await redis.keys('wa_state:*');
      const chats = [];
      for(const k of keys.slice(0,500)){
        try{
          const v = await redis.get(k);
          if(v){
            const state = JSON.parse(v);
            const phone = k.replace('wa_state:','');
            chats.push({phone, state, lastStep: state.lastStep||'', lang: state.lang||'en', flow: state.flow||'', sub: state.sub||'', service: state.service||'', lastActive: state.lastActive||Date.now()});
          }
        }catch(e){}
      }
      return chats;
    }
    const chats = [];
    for(const [phone, state] of memoryStore.entries()){
      chats.push({phone, state, lastStep: state.lastStep||'', lang: state.lang||'en', flow: state.flow||'', sub: state.sub||'', service: state.service||'', lastActive: state.lastActive||Date.now()});
    }
    return chats;
  }catch(e){ console.log('getAllChats error', e.message); return []; }
}
function chatToSheetRow(chat){
  const nowIso = getISTTime();
  const state = chat.state || {};
  const phone = chat.phone || '';
  const lang = chat.lang || state.lang || 'en';
  const fee = state.fee || 15;
  const service = state.service || chat.service || 'UNKNOWN';
  const sub = state.sub || chat.sub || '';
  const lastStep = state.lastStep || chat.lastStep || '';
  return [nowIso, phone, lang, service+' '+sub, lastStep, fee+'L', HELP_MARKETING, lastStep, 'REPLAY'];
}
async function wipeAllSheets(){
  try{
    const sheets = ALLOWED_SHEETS || ['Master_Leads','Franchise_Funnel','Payments','Payment_Receipts','Ride_Hailing','Business_Directory','Delivery','Booking','System_Logs'];
    for(const sheetName of sheets){
      try{
        const sheet = await getSheet(sheetName);
        if(sheet){
          const rows = await sheet.getRows();
          for(let i=rows.length-1; i>=0; i--){
            try{ await rows[i].delete(); }catch(e){}
          }
        }
      }catch(e){}
    }
    return true;
  }catch(e){ return false; }
}
async function getSheet(sheetName){
  try{
    if(!googleSheetsReady || !sheetsClient) return null;
    const doc = await getGoogleSheetDoc();
    if(!doc) return null;
    let sheet = doc.sheetsByTitle[sheetName];
    if(!sheet){
      sheet = await doc.addSheet({title: sheetName, headerValues: ['Timestamp','Phone','Lang','Service','Step','Fee','Help','LastStep','Status']});
    }
    return sheet;
  }catch(e){ return null; }
}
async function getGoogleSheetDoc(){
  try{
    if(!sheetsClient) return null;
    return global._sheetDoc || null;
  }catch(e){ return null; }
}

app.get('/wipe-and-replay-4-days', async(req,res)=>{
  if(req.query.key!=='95677') return res.status(403).json({error:'Invalid key'});
  try{
    const chats = getAllChatsFromMemory();
    const last4 = chats.filter(c=>{
      const d = new Date(c.timestamp||c.time||Date.now());
      const diff = (Date.now()-d.getTime())/(1000*60*60*24);
      return diff<=4;
    });
    console.log(`WIPE+REPLAY 4 DAYS: ${last4.length} chats`);
    await wipeAllSheets();
    await delay(1000);
    let count=0;
    for(let chat of last4){
      try{
        const row = chatToSheetRow(chat);
        if(row){
          await saveToSheet(row.sheet, row.data, false);
          count++;
        }
      }catch(e){ console.log('Replay error', e.message); }
    }
    return res.json({success:true, totalChats:chats.length, replayed:count, days:4});
  }catch(e){ return res.status(500).json({error:e.message}); }
});


// === FIX: Missing functions for wipe-and-replay - Added in V155 ===
async function getAllChatsFromMemory(){
  try{
    if(redisReady && redis){
      const keys = await redis.keys('wa_state:*');
      const chats = [];
      for(const k of keys.slice(0,500)){
        try{
          const v = await redis.get(k);
          if(v){
            const state = JSON.parse(v);
            const phone = k.replace('wa_state:','');
            chats.push({phone, state, lastStep: state.lastStep||'', lang: state.lang||'en', flow: state.flow||'', sub: state.sub||'', service: state.service||'', lastActive: state.lastActive||Date.now()});
          }
        }catch(e){}
      }
      return chats;
    }
    const chats = [];
    for(const [phone, state] of memoryStore.entries()){
      chats.push({phone, state, lastStep: state.lastStep||'', lang: state.lang||'en', flow: state.flow||'', sub: state.sub||'', service: state.service||'', lastActive: state.lastActive||Date.now()});
    }
    return chats;
  }catch(e){ console.log('getAllChats error', e.message); return []; }
}
function chatToSheetRow(chat){
  const nowIso = getISTTime();
  const state = chat.state || {};
  const phone = chat.phone || '';
  const lang = chat.lang || state.lang || 'en';
  const fee = state.fee || 15;
  const service = state.service || chat.service || 'UNKNOWN';
  const sub = state.sub || chat.sub || '';
  const lastStep = state.lastStep || chat.lastStep || '';
  return [nowIso, phone, lang, service+' '+sub, lastStep, fee+'L', HELP_MARKETING, lastStep, 'REPLAY'];
}
async function wipeAllSheets(){
  try{
    const sheets = ALLOWED_SHEETS || ['Master_Leads','Franchise_Funnel','Payments','Payment_Receipts','Ride_Hailing','Business_Directory','Delivery','Booking','System_Logs'];
    for(const sheetName of sheets){
      try{
        const sheet = await getSheet(sheetName);
        if(sheet){
          const rows = await sheet.getRows();
          for(let i=rows.length-1; i>=0; i--){
            try{ await rows[i].delete(); }catch(e){}
          }
        }
      }catch(e){}
    }
    return true;
  }catch(e){ return false; }
}
async function getSheet(sheetName){
  try{
    if(!googleSheetsReady || !sheetsClient) return null;
    const doc = await getGoogleSheetDoc();
    if(!doc) return null;
    let sheet = doc.sheetsByTitle[sheetName];
    if(!sheet){
      sheet = await doc.addSheet({title: sheetName, headerValues: ['Timestamp','Phone','Lang','Service','Step','Fee','Help','LastStep','Status']});
    }
    return sheet;
  }catch(e){ return null; }
}
async function getGoogleSheetDoc(){
  try{
    if(!sheetsClient) return null;
    return global._sheetDoc || null;
  }catch(e){ return null; }
}

app.get('/wipe-and-replay-7-days', async(req,res)=>{
  if(req.query.key!=='95677') return res.status(403).json({error:'Invalid key'});
  try{
    const chats = getAllChatsFromMemory();
    const last7 = chats.filter(c=>{
      const d = new Date(c.timestamp||c.time||Date.now());
      const diff = (Date.now()-d.getTime())/(1000*60*60*24);
      return diff<=7;
    });
    console.log(`WIPE+REPLAY 7 DAYS: ${last7.length} chats from ${chats.length} total`);
    await wipeAllSheets();
    await delay(1500);
    let count=0;
    for(let chat of last7){
      try{
        const row = chatToSheetRow(chat);
        if(row){
          await saveToSheet(row.sheet, row.data, false);
          count++;
          await delay(50);
        }
      }catch(e){ console.log('Replay 7D error', e.message); }
    }
    return res.json({success:true, totalChats:chats.length, replayed:count, days:7, sheets:ALLOWED_SHEETS});
  }catch(e){ return res.status(500).json({error:e.message}); }
});

app.get('/replay-7-days', async(req,res)=>{
  // Non-wipe version - adds 7 days to existing sheets
  if(req.query.key!=='95677') return res.status(403).json({error:'Invalid key'});
  try{
    const chats = getAllChatsFromMemory();
    const last7 = chats.filter(c=>{
      const d = new Date(c.timestamp||c.time||Date.now());
      const diff = (Date.now()-d.getTime())/(1000*60*60*24);
      return diff<=7;
    });
    console.log(`REPLAY 7 DAYS (no wipe): ${last7.length} chats`);
    let count=0;
    for(let chat of last7){
      try{
        const row = chatToSheetRow(chat);
        if(row){
          await saveToSheet(row.sheet, row.data, false);
          count++;
          await delay(50);
        }
      }catch(e){ console.log('Replay 7D error', e.message); }
    }
    return res.json({success:true, totalChats:chats.length, replayed:count, days:7});
  }catch(e){ return res.status(500).json({error:e.message}); }
});

app.get('/all-chats-debug', async(req,res)=>{
  try{
    const chats = getAllChatsFromMemory();
    const now = Date.now();
    const stats = {
      total: chats.length,
      last24h: chats.filter(c=> (now - new Date(c.timestamp||c.time||Date.now()).getTime())/(1000*60*60) <=24).length,
      last4d: chats.filter(c=> (now - new Date(c.timestamp||c.time||Date.now()).getTime())/(1000*60*60*24) <=4).length,
      last7d: chats.filter(c=> (now - new Date(c.timestamp||c.time||Date.now()).getTime())/(1000*60*60*24) <=7).length,
      redisReady: redisReady,
      sample: chats.slice(0,5)
    };
    return res.json(stats);
  }catch(e){ return res.status(500).json({error:e.message}); }
});


app.get('/all-chats', async(req,res)=>{
  try{
    const all = [];
    for(let [uid, state] of memoryStore.entries()){
      all.push({uid, source:'memory', lang: state.lang||'none', lastStep: state.lastStep||'', sub: state.sub||'', service: state.service||'', fee: state.fee||'', flow: state.flow||'', lastActive: state.lastActive ? new Date(state.lastActive).toISOString() : '', ageHours: state.lastActive ? Math.round((Date.now()-state.lastActive)/3600000) : 0 });
    }
    if(redisReady && redis){
      try{
        const keys = await redis.keys('state:*');
        for(let key of keys){
          const uid = key.replace('state:','');
          if(all.find(a=>a.uid===uid)) continue;
          try{
            const v = await redis.get(key);
            if(v){
              const state = JSON.parse(v);
              all.push({uid, source:'redis', lang: state.lang||'none', lastStep: state.lastStep||'', sub: state.sub||'', service: state.service||'', fee: state.fee||'', flow: state.flow||'', lastActive: state.lastActive ? new Date(state.lastActive).toISOString() : '', ageHours: state.lastActive ? Math.round((Date.now()-state.lastActive)/3600000) : 0 });
            }
          }catch{}
        }
      }catch(e){ console.log('all-chats redis error', e.message); }
    }
    all.sort((a,b)=> (a.ageHours||0) - (b.ageHours||0));
    const last4Days = all.filter(c=> (c.ageHours||0) <= 96);
    res.json({countTotal: all.length, countLast4Days: last4Days.length, generatedAt: getISTTime(), redisReady, last4Days, all});
  }catch(e){ res.status(500).json({error: e.message}); }
});

app.get('/export-chats', async(req,res)=>{
  try{
    const format = req.query.format || 'json';
    const days = parseInt(req.query.days || '4');
    const chats = [];
    for(let [uid, state] of memoryStore.entries()){
      const ageH = state.lastActive ? (Date.now()-state.lastActive)/3600000 : 999;
      if(ageH <= days*24) chats.push({uid, lang: state.lang||'', lastStep: state.lastStep||'', service: state.service||'', sub: state.sub||'', fee: state.fee||'', flow: state.flow||'', occupation: state.occupation||'', date: state.date||'', leadData: state.leadData||'', lastActive: state.lastActive ? new Date(state.lastActive).toISOString() : '', ageHours: Math.round(ageH)});
    }
    if(redisReady && redis){
      try{
        const keys = await redis.keys('state:*');
        for(let key of keys){
          const uid = key.replace('state:','');
          if(chats.find(c=>c.uid===uid)) continue;
          try{
            const v = await redis.get(key);
            if(v){
              const s = JSON.parse(v);
              const ageH = s.lastActive ? (Date.now()-s.lastActive)/3600000 : 999;
              if(ageH <= days*24) chats.push({uid, lang: s.lang||'', lastStep: s.lastStep||'', service: s.service||'', sub: s.sub||'', fee: s.fee||'', flow: s.flow||'', occupation: s.occupation||'', date: s.date||'', leadData: s.leadData||'', lastActive: s.lastActive ? new Date(s.lastActive).toISOString() : '', ageHours: Math.round(ageH)});
            }
          }catch{}
        }
      }catch{}
    }
    if(format==='csv'){
      let csv = 'Phone,Language,LastStep,Service,Sub,Fee,Flow,Occupation,Date,LeadData,LastActive,AgeHours\n';
      for(let c of chats){
        const row = [c.uid, c.lang, (c.lastStep||'').replace(/,/g,' '), c.service||'', c.sub||'', c.fee||'', c.flow||'', c.occupation||'', c.date||'', (c.leadData||'').replace(/,/g,' '), c.lastActive||'', c.ageHours||''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',');
        csv += row + '\n';
      }
      res.setHeader('Content-Type','text/csv');
      res.setHeader('Content-Disposition','attachment; filename=bizmapia_last_'+days+'days_'+getISTTime().slice(0,10)+'.csv');
      return res.send(csv);
    }
    res.json({count: chats.length, days, generatedAt: getISTTime(), data: chats});
  }catch(e){ res.status(500).json({error: e.message}); }
});

app.get('/sheet-data', async(req,res)=>{
  try{
    const tab = req.query.tab || 'System_Logs';
    const limit = parseInt(req.query.limit||'100');
    if(!ALLOWED_SHEETS.includes(tab)) return res.status(400).json({error: 'Invalid tab. Allowed: '+ALLOWED_SHEETS.join(',')});
    const sheets = await getSheets();
    if(!sheets) return res.json({error: 'Sheets client not ready'});
    const result = await sheets.spreadsheets.values.get({spreadsheetId: SHEET_ID, range: `'${tab}'!A:Z`});
    const rows = result.data.values || [];
    const sliced = rows.slice(-limit);
    res.json({tab, totalRows: rows.length, returnedRows: sliced.length, rows: sliced});
  }catch(e){ res.status(500).json({error: e.message}); }
});

app.get('/render-stats', async(req,res)=>{
  try{
    const memCount = memoryStore.size;
    let redisCount = 0;
    if(redisReady && redis){ try{ const keys = await redis.keys('state:*'); redisCount = keys.length; }catch{} }
    res.json({version: 'V170 FINAL FIX - getVideoUrl REFERENCEERROR FIXED - 8 PDF 2+2+4 - 8 SHEETS LOCKED - WELCOME MAYA FIXED', generatedAt: getISTTime(), memoryStore: memCount, redisStates: redisCount, redisReady, sheets: ALLOWED_SHEETS, last4DaysEndpoint: '/all-chats shows last 4 days', wipe: '/wipe-and-replay-4-days?key=95677'});
  }catch(e){ res.status(500).json({error: e.message}); }
});

app.get('/clear/:phone', async(req,res)=>{ try{ let uid = req.params.phone.replace(/[^0-9]/g,''); if(uid.length===10) uid='91'+uid; if(redisReady && redis){ await redis.del(`state:${uid}`); } memoryStore.delete(uid); res.send(`✅ Cleared user ${uid}`); }catch(e){ res.send(`Error: ${e.message}`); } });
app.get('/clear-all', async(req,res)=>{ try{ if(redisReady && redis){ const keys = await redis.keys('state:*'); if(keys.length>0) await redis.del(...keys); res.send(`✅ Cleared all ${keys.length} users from Redis`); } else { memoryStore.clear(); res.send(`✅ Cleared memoryStore`); } }catch(e){ res.send(`Error: ${e.message}`); } });
app.get('/check/:phone', async(req,res)=>{ try{ let uid = req.params.phone.replace(/[^0-9]/g,''); if(uid.length===10) uid='91'+uid; const state = await getState(uid); res.json({uid, state, redisReady, memoryHas: memoryStore.has(uid)}); }catch(e){ res.send(`Error: ${e.message}`); } });


app.listen(PORT,'0.0.0.0',async()=>{ console.log(`V207 FINAL - PAY NOW PURE LANGUAGE + SHORT BUTTONS + ALL CALL BUTTONS INBUILT DIALER 8590175977 - CONFIRMED + HUMAN HANDOVER + PAY VERIFY + SHORT MAYA + ALL INDIA + EMOJIS + FOMO - 8 PDF 2+2+4 - INDIAN TIME IST - listening on ${PORT} - OLD:${PHONE_ID_OLD} NEW:${PHONE_ID_NEW} - IST ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}`); await getSheets(); });


// ==================== LOCKED - END OF FILE - V207 FINAL - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// DO NOT EDIT THIS FILE - LOCKED TILL VERIFICATION FINALIZED - TENDER PDF PER BUSINESS OPPORTUNITY ADDED
// If verification needed, create V171 with proper version control after verification
// Current locked version: V170 FINAL FIX - 2026-11-04 - getVideoUrl REFERENCEERROR FIXED - 8 PDF AS PER REQUIREMENT - 2 DISTRICT + 2 CORP/MUNI + 4 BUSINESS CENTER - DISTRICT 2 PDF, CORP/MUNI 2 PDF, BUSINESS CENTER 4 PDF - DOWNLOADABLE PDF WITH GREETING WHAT TO DO - WELCOME MAYA FIXED + APPRECIATIVE OTHER STEPS - INCLUDES V155 + V161-V169 - D250=https://rzp.io/rzp/BZ9D9rT C150=https://rzp.io/rzp/ptj9OGpr B100=https://rzp.io/rzp/lAguvzEt - NO 5000 - 8 SHEETS LOCKED - REDIS READY - FIXED: getVideoUrl is not defined - 8 PDFs: district.pdf district_annexure.pdf corporation.pdf corporation_annexure.pdf business_center.pdf business_center_annexure.pdf business_center_agreement.pdf business_center_brochure.pdf
// ==================== LOCKED - END OF FILE - V207 FINAL - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// V207 FINAL - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// THIS FILE IS LOCKED - NO MORE EDITS UNTIL USER VERIFICATION FINALIZED
// IF YOU NEED TO EDIT, CREATE NEW VERSION V207 - DO NOT EDIT THIS LOCKED FILE
// ================================================================================================
