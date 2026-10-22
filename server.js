// FINAL POPZUP BOT V93 - 95677 42507 - 17 FLOWS - TEXT-ONLY - 1.2s DELAY - 65MIN BLOCK
// Phone Number ID: 1382103134987818 (Bizmapia 95677 42507) - Fresh number, no 130429
// Help: 85901 83646 (Ride/Business/Delivery/Booking) / 85901 75977 (Opportunity)

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { createClient } = require('redis');

const app = express();
app.use(bodyParser.json());

// ENV - UPDATE THESE IN RENDER
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '1382103134987818';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia_verify_2024';
const REDIS_URL = process.env.REDIS_URL || null;

const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia&pcampaignid=web_share';
const APP_STORE = 'https://apps.apple.com/in/app/bizmapia/id6761577245';

const HELP_RIDE = '8590183646';
const HELP_BIZ = '8590175977';

// 65-min auto block to prevent 130429 loop
let blockUntil = 0;
let lastSendTime = 0;

let redisClient = null;
if (REDIS_URL) {
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on('error', (e) => console.log('REDIS ERROR', e));
  redisClient.connect().then(() => console.log('REDIS CONNECTED')).catch(() => {});
}

function isBlocked() {
  return Date.now() < blockUntil;
}
function setBlock(mins = 65) {
  blockUntil = Date.now() + mins * 60 * 1000;
  console.log(`V93 BLOCK SET FOR ${mins} MIN TILL ${new Date(blockUntil).toISOString()}`);
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function sendWithDelay(payload) {
  if (isBlocked()) {
    console.log('V93 BLOCKED - NOT SENDING', payload.to);
    return { blocked: true };
  }
  const now = Date.now();
  const diff = now - lastSendTime;
  if (diff < 1200) await delay(1200 - diff);
  lastSendTime = Date.now();
  try {
    const res = await axios.post(`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`, payload, {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
    });
    console.log(`META SUCCESS to ${payload.to}`, res.data.messages?.[0]?.id);
    return res.data;
  } catch (e) {
    const errData = e.response?.data?.error;
    console.log(`META ERROR to ${payload.to}`, errData?.code, errData?.message);
    if (errData?.code === 130429 || errData?.code === 131042) {
      setBlock(65);
    }
    throw e;
  }
}

function interactiveButton(to, body, buttons) {
  // buttons: [{id, title}]
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: body.substring(0, 1024) },
      action: { buttons: buttons.slice(0, 3).map(b => ({ type: 'reply', reply: { id: b.id, title: b.title.substring(0, 20) } })) }
    }
  };
}

function textMessage(to, body) {
  return { messaging_product: 'whatsapp', to, type: 'text', text: { body: body.substring(0, 4096) } };
}

// TRANSLATIONS
const T = {
  en: {
    welcome: `Welcome to Bizmapia 👋\n\nYou are in India's first 4 in 1 service app platform\n\nPlease select your preferred language from below:-`,
    btn_en: 'English', btn_hi: 'Hindi', btn_ml: 'Malayalam',
    noLang: `Sorry, You are not selected any Language.\n\nPlease select your preferred language from below:-`,
    mainMenu: `Please click any one service from below to help you further:-`,
    services: [
      { id: 'SVC_RIDE', title: 'Ride Hailing' },
      { id: 'SVC_BIZDIR', title: 'Business Directory' },
      { id: 'SVC_DELIVERY', title: 'Online Delivery' },
      { id: 'SVC_BOOKING', title: 'Online Booking' },
      { id: 'SVC_OPP', title: 'Business Opportunity' }
    ],
    noService: `You haven't selected any service yet.\n\nPlease click any one service from below:-`,
    rideSelected: `Great you are selected "Ride Hailing"\nBizmapia is the one and only platform giving all India Ride Hailing service without any boarder.\nPlease select any one from below to give more details :-`,
    rideButtons: [{ id: 'RIDE_BOOK', title: 'Book a Cab' }, { id: 'RIDE_ATTACH', title: 'Attach Cab' }],
    bookCab: `Great choice, you are clicked our "Book a Cab" service.\nYou will get Two wheelers/Autorickshaws/Hatchback/Sedan/SUV/XUV/Ambulances from near by areas at affordable rates.\n\nClick the link below to install our app\nPlay store :- ${PLAY_STORE}\nApp store :- ${APP_STORE}`,
    attachCab: `Great you selected "Attach Cab"\nAttach your Two wheeler/Auto/Car/SUV and start earning daily with Bizmapia all India rides.\n\nInstall driver app:\nPlay store :- ${PLAY_STORE}\n\nNeed help? Call ${HELP_RIDE}`,
    haveInstalled1: `Have you installed our app?\n\nHere you can activate your special offers on rides`,
    haveInstalled24: `Have you installed our app?\n\nYour chance going to expire, Here you can activate your special offers on rides`,
    yesActivate: 'Yes, activate', noLater: 'No, will do later',
    activated: `Great, we are activating your offer in your app login, Login to our app now and check your offers by completing your first trip\n\nFeel free to chat on our customer care for future contacts\n📞 Help: ${HELP_RIDE} - Tap to call`,
    helpButtonLabel: `Help 📞 ${HELP_RIDE}`,
    helpOppLabel: `Help 📞 ${HELP_BIZ}`,
    // Business Directory
    bizDirSelected: `Great you selected "Business Directory"\nRegister your business and get customers from all India. 10 Lakh+ local businesses already listed.`,
    bizDirButtons: [{ id: 'BIZ_REGISTER', title: 'Register Business' }, { id: 'BIZ_ADS', title: 'Start Advertising' }],
    bizRegister: `Register your business on Bizmapia and start getting more customers, leads and bookings.\n\nInstall app:\n${PLAY_STORE}\n${APP_STORE}`,
    bizAds: `Start advertising your business on Bizmapia and get 10x more customers.\n\nInstall app to create ad:\n${PLAY_STORE}`,
    // Delivery
    deliverySelected: `Great you selected "Online Delivery"\nBook anything from local stores to your door step delivery in 2 hours.`,
    deliveryButtons: [{ id: 'DEL_ORDER', title: 'Order from Stores' }, { id: 'DEL_PARTNER', title: 'Delivery Partner' }],
    delOrder: `Order Grocery, Food, Medicine, Anything from local stores and get delivered in 2 hours.\n\nInstall app:\n${PLAY_STORE}\n${APP_STORE}`,
    delPartner: `Become our delivery partner and earn daily.\n\nInstall app:\n${PLAY_STORE}`,
    // Booking - 3 subs
    bookingSelected: `Great you selected "Online Booking"\nBook Rooms, Appointments, Movie Tickets at affordable rates all India.`,
    bookingButtons: [{ id: 'BOOK_ROOM', title: 'Book Rooms' }, { id: 'BOOK_APPOINT', title: 'Book Appointments' }, { id: 'BOOK_MOVIE', title: 'Movie Tickets' }],
    bookRoom: `Book Hotels, Rooms, Resorts anywhere in India at best rates.\n\nInstall app:\n${PLAY_STORE}\n${APP_STORE}`,
    bookAppoint: `Book Appointments - Doctor, Salon, Services - Instant booking near you.\n\nInstall app:\n${PLAY_STORE}\n${APP_STORE}`,
    bookMovie: `Book Movie Tickets, Events, Shows near you.\n\nInstall app:\n${PLAY_STORE}\n${APP_STORE}`,
    // Opportunity - 3 subs Higher/Moderate/Base
    oppSelected: `Great you selected "Business Opportunity"\nBecome our service point and start earning. 3 levels of earning.`,
    oppButtons: [{ id: 'OPP_DISTRICT', title: 'District Franchise' }, { id: 'OPP_CORP', title: 'Corporation Franchise' }, { id: 'OPP_CENTER', title: 'Business Center' }],
    oppDistrict: `District Franchise - Higher earning\nBecome District Franchise owner and earn from entire district rides, businesses, deliveries, bookings.\n\nContact for franchise: ${HELP_BIZ}\n\nInstall app:\n${PLAY_STORE}`,
    oppCorp: `Corporation / Municipal Franchisee - Moderate earning\nBecome Corporation/Municipality franchisee and earn from your city.\n\nContact: ${HELP_BIZ}\n${PLAY_STORE}`,
    oppCenter: `Business Center - Base earning\nBecome our Business Center (service point) and earn per service.\n\nContact: ${HELP_BIZ}\n${PLAY_STORE}`,
  },
  hi: {
    welcome: `बिज़मैपिया में आपका स्वागत है 👋\n\nआप भारत के पहले 4 इन 1 सर्विस ऐप प्लेटफॉर्म पर हैं\n\nकृपया नीचे से अपनी पसंदीदा भाषा चुनें:-`,
    btn_en: 'English', btn_hi: 'हिन्दी', btn_ml: 'മലയാളം',
    noLang: `क्षमा करें, आपने कोई भाषा नहीं चुनी है।\n\nकृपया नीचे से अपनी पसंदीदा भाषा चुनें:-`,
    mainMenu: `कृपया आगे मदद के लिए नीचे से कोई एक सेवा चुनें:-`,
    services: [
      { id: 'SVC_RIDE', title: 'राइड हेलिंग' },
      { id: 'SVC_BIZDIR', title: 'बिजनेस डायरेक्टरी' },
      { id: 'SVC_DELIVERY', title: 'ऑनलाइन डिलीवरी' },
      { id: 'SVC_BOOKING', title: 'ऑनलाइन बुकिंग' },
      { id: 'SVC_OPP', title: 'बिजनेस अवसर' }
    ],
    noService: `आपने अभी तक कोई सेवा नहीं चुनी है।\n\nकृपया नीचे से कोई एक सेवा चुनें:-`,
    rideSelected: `बहुत बढ़िया आपने "राइड हेलिंग" चुना है। बिज़मैपिया एकमात्र प्लेटफॉर्म है जो पूरे भारत में बिना किसी बॉर्डर के राइड हेलिंग सेवा दे रहा है। अधिक जानकारी के लिए नीचे से चुनें:-`,
    rideButtons: [{ id: 'RIDE_BOOK', title: 'कैब बुक करें' }, { id: 'RIDE_ATTACH', title: 'कैब अटैच करें' }],
    bookCab: `बढ़िया विकल्प, आपने हमारी "कैब बुक करें" सेवा चुनी है।\nआपको पास के क्षेत्रों से Two wheelers/Auto/Hatchback/Sedan/SUV/XUV/Ambulances किफायती दरों पर मिलेंगे।\n\nऐप इंस्टॉल करने के लिए नीचे क्लिक करें\nPlay store :- ${PLAY_STORE}\nApp store :- ${APP_STORE}`,
    attachCab: `आपने "कैब अटैच करें" चुना है। अपनी गाड़ी अटैच करें और रोज कमाना शुरू करें।\n\nमदद के लिए कॉल करें ${HELP_RIDE}`,
    haveInstalled1: `क्या आपने हमारा ऐप इंस्टॉल किया है?\n\nयहाँ आप राइड पर अपने स्पेशल ऑफर एक्टिवेट कर सकते हैं`,
    haveInstalled24: `क्या आपने हमारा ऐप इंस्टॉल किया है?\n\nआपका मौका खत्म होने वाला है, यहाँ आप राइड पर अपने स्पेशल ऑफर एक्टिवेट कर सकते हैं`,
    yesActivate: 'हाँ, एक्टिवेट करें', noLater: 'नहीं, बाद में करूँगा',
    activated: `बहुत बढ़िया, हम आपके ऐप लॉगिन में आपका ऑफर एक्टिवेट कर रहे हैं, अभी अपने ऐप में लॉगिन करें और अपनी पहली यात्रा पूरी करके अपने ऑफर चेक करें\n\nकस्टमर केयर: 📞 ${HELP_RIDE}`,
    helpButtonLabel: `मदद 📞 ${HELP_RIDE}`,
    helpOppLabel: `मदद 📞 ${HELP_BIZ}`,
    bizDirSelected: `आपने "बिजनेस डायरेक्टरी" चुना है। अपना बिजनेस रजिस्टर करें और पूरे भारत से कस्टमर पाएं।`,
    bizDirButtons: [{ id: 'BIZ_REGISTER', title: 'बिजनेस रजिस्टर करें' }, { id: 'BIZ_ADS', title: 'विज्ञापन शुरू करें' }],
    bizRegister: `Bizmapia पर अपना बिजनेस रजिस्टर करें और ज्यादा कस्टमर पाएं।\n\n${PLAY_STORE}`,
    bizAds: `Bizmapia पर अपने बिजनेस का विज्ञापन शुरू करें।\n\n${PLAY_STORE}`,
    deliverySelected: `आपने "ऑनलाइन डिलीवरी" चुना है। लोकल स्टोर से कुछ भी 2 घंटे में घर मंगवाएं।`,
    deliveryButtons: [{ id: 'DEL_ORDER', title: 'स्टोर से ऑर्डर करें' }, { id: 'DEL_PARTNER', title: 'डिलीवरी पार्टनर' }],
    delOrder: `ग्रोसरी, फूड, दवा कुछ भी लोकल स्टोर से 2 घंटे में मंगवाएं।\n\n${PLAY_STORE}\n${APP_STORE}`,
    delPartner: `हमारे डिलीवरी पार्टनर बनें और रोज कमाएं।\n\n${PLAY_STORE}`,
    bookingSelected: `आपने "ऑनलाइन बुकिंग" चुना है। रूम, अपॉइंटमेंट, मूवी टिकट बुक करें।`,
    bookingButtons: [{ id: 'BOOK_ROOM', title: 'रूम बुक करें' }, { id: 'BOOK_APPOINT', title: 'अपॉइंटमेंट बुक करें' }, { id: 'BOOK_MOVIE', title: 'मूवी टिकट' }],
    bookRoom: `पूरे भारत में होटल, रूम सबसे अच्छी दरों पर बुक करें।\n\n${PLAY_STORE}`,
    bookAppoint: `अपॉइंटमेंट बुक करें - डॉक्टर, सैलून, सर्विस - तुरंत बुकिंग।\n\n${PLAY_STORE}`,
    bookMovie: `मूवी टिकट, इवेंट्स पास में बुक करें।\n\n${PLAY_STORE}`,
    oppSelected: `आपने "बिजनेस अवसर" चुना है। हमारा सर्विस पॉइंट बनें और कमाना शुरू करें। 3 लेवल।`,
    oppButtons: [{ id: 'OPP_DISTRICT', title: 'जिला फ्रेंचाइजी' }, { id: 'OPP_CORP', title: 'नगर निगम फ्रेंचाइजी' }, { id: 'OPP_CENTER', title: 'बिजनेस सेंटर' }],
    oppDistrict: `जिला फ्रेंचाइजी - अधिक कमाई\nपूरे जिले से कमाएं।\n\nसंपर्क: ${HELP_BIZ}\n${PLAY_STORE}`,
    oppCorp: `नगर निगम फ्रेंचाइजी - मध्यम कमाई\nअपने शहर से कमाएं।\n\nसंपर्क: ${HELP_BIZ}`,
    oppCenter: `बिजनेस सेंटर - बेस कमाई\nहमारा बिजनेस सेंटर बनें।\n\nसंपर्क: ${HELP_BIZ}`,
  },
  ml: {
    welcome: `ബിസ്മാപ്പിയയിലേക്ക് സ്വാഗതം 👋\n\nനിങ്ങൾ ഇന്ത്യയിലെ ആദ്യത്തെ 4 ഇൻ 1 സർവീസ് ആപ്പ് പ്ലാറ്റ്‌ഫോമിലാണ്\n\nദയവായി താഴെ നിന്ന് നിങ്ങളുടെ ഇഷ്ടമുള്ള ഭാഷ തിരഞ്ഞെടുക്കുക:-`,
    btn_en: 'English', btn_hi: 'हिन्दी', btn_ml: 'മലയാളം',
    noLang: `ക്ഷമിക്കണം, നിങ്ങൾ ഒരു ഭാഷയും തിരഞ്ഞെടുത്തിട്ടില്ല.\n\nദയവായി താഴെ നിന്ന് ഭാഷ തിരഞ്ഞെടുക്കുക:-`,
    mainMenu: `കൂടുതൽ സഹായത്തിനായി താഴെ നിന്ന് ഒരു സേവനം തിരഞ്ഞെടുക്കുക:-`,
    services: [
      { id: 'SVC_RIDE', title: 'റൈഡ് ഹെയ്ലിംഗ്' },
      { id: 'SVC_BIZDIR', title: 'ബിസിനസ് ഡയറക്ടറി' },
      { id: 'SVC_DELIVERY', title: 'ഓൺലൈൻ ഡെലിവറി' },
      { id: 'SVC_BOOKING', title: 'ഓൺലൈൻ ബുക്കിംഗ്' },
      { id: 'SVC_OPP', title: 'ബിസിനസ് അവസരം' }
    ],
    noService: `നിങ്ങൾ ഇതുവരെ ഒരു സേവനവും തിരഞ്ഞെടുത്തിട്ടില്ല.\n\nദയവായി താഴെ നിന്ന് ഒരു സേവനം തിരഞ്ഞെടുക്കുക:-`,
    rideSelected: `നിങ്ങൾ "റൈഡ് ഹെയ്ലിംഗ്" തിരഞ്ഞെടുത്തു. അതിർത്തികളില്ലാതെ ഇന്ത്യ മുഴുവൻ റൈഡ് ഹെയ്ലിംഗ് സേവനം നൽകുന്ന ഒരേയൊരു പ്ലാറ്റ്‌ഫോമാണ് ബിസ്മാപ്പിയ. കൂടുതൽ വിവരങ്ങൾക്ക് താഴെ നിന്ന് തിരഞ്ഞെടുക്കുക:-`,
    rideButtons: [{ id: 'RIDE_BOOK', title: 'ക്യാബ് ബുക്ക് ചെയ്യുക' }, { id: 'RIDE_ATTACH', title: 'ക്യാബ് അറ്റാച്ച് ചെയ്യുക' }],
    bookCab: `മികച്ച തിരഞ്ഞെടുപ്പ്, നിങ്ങൾ ഞങ്ങളുടെ "ക്യാബ് ബുക്ക് ചെയ്യുക" സേവനം തിരഞ്ഞെടുത്തു.\nനിങ്ങൾക്ക് സമീപ പ്രദേശങ്ങളിൽ നിന്ന് Two wheelers/Auto/Hatchback/Sedan/SUV/XUV/Ambulances മിതമായ നിരക്കിൽ ലഭിക്കും.\n\nആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യാൻ താഴെ ക്ലിക്ക് ചെയ്യുക\nPlay store :- ${PLAY_STORE}\nApp store :- ${APP_STORE}`,
    attachCab: `നിങ്ങൾ "ക്യാബ് അറ്റാച്ച് ചെയ്യുക" തിരഞ്ഞെടുത്തു. നിങ്ങളുടെ വാഹനം അറ്റാച്ച് ചെയ്ത് ദിവസവും വരുമാനം നേടുക.\n\nസഹായത്തിന് വിളിക്കുക ${HELP_RIDE}`,
    haveInstalled1: `നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nഇവിടെ നിങ്ങൾക്ക് റൈഡുകളിൽ സ്പെഷ്യൽ ഓഫറുകൾ ആക്ടിവേറ്റ് ചെയ്യാം`,
    haveInstalled24: `നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nനിങ്ങളുടെ അവസരം അവസാനിക്കാൻ പോകുന്നു, ഇവിടെ റൈഡുകളിൽ ഓഫറുകൾ ആക്ടിവേറ്റ് ചെയ്യാം`,
    yesActivate: 'അതെ, ആക്ടിവേറ്റ് ചെയ്യുക', noLater: 'അല്ല, പിന്നീട് ചെയ്യാം',
    activated: `മികച്ചത്, നിങ്ങളുടെ ആപ്പ് ലോഗിനിൽ ഞങ്ങൾ ഓഫർ ആക്ടിവേറ്റ് ചെയ്യുന്നു, ഇപ്പോൾ ആപ്പിൽ ലോഗിൻ ചെയ്ത് ആദ്യ യാത്ര പൂർത്തിയാക്കി ഓഫറുകൾ പരിശോധിക്കുക\n\nകസ്റ്റമർ കെയർ: 📞 ${HELP_RIDE}`,
    helpButtonLabel: `സഹായം 📞 ${HELP_RIDE}`,
    helpOppLabel: `സഹായം 📞 ${HELP_BIZ}`,
    bizDirSelected: `നിങ്ങൾ "ബിസിനസ് ഡയറക്ടറി" തിരഞ്ഞെടുത്തു. നിങ്ങളുടെ ബിസിനസ് രജിസ്റ്റർ ചെയ്ത് ഇന്ത്യ മുഴുവൻ നിന്ന് കസ്റ്റമേഴ്സിനെ നേടുക.`,
    bizDirButtons: [{ id: 'BIZ_REGISTER', title: 'ബിസിനസ് രജിസ്റ്റർ' }, { id: 'BIZ_ADS', title: 'പരസ്യം തുടങ്ങുക' }],
    bizRegister: `Bizmapia-യിൽ നിങ്ങളുടെ ബിസിനസ് രജിസ്റ്റർ ചെയ്യുക.\n\n${PLAY_STORE}`,
    bizAds: `Bizmapia-യിൽ പരസ്യം തുടങ്ങുക.\n\n${PLAY_STORE}`,
    deliverySelected: `നിങ്ങൾ "ഓൺലൈൻ ഡെലിവറി" തിരഞ്ഞെടുത്തു. ലോക്കൽ സ്റ്റോറുകളിൽ നിന്ന് എന്തും 2 മണിക്കൂറിൽ വീട്ടിൽ എത്തിക്കും.`,
    deliveryButtons: [{ id: 'DEL_ORDER', title: 'സ്റ്റോറിൽ നിന്ന് ഓർഡർ' }, { id: 'DEL_PARTNER', title: 'ഡെലിവറി പാർട്ണർ' }],
    delOrder: `ഗ്രോസറി, ഫുഡ്, മരുന്ന് എന്തും 2 മണിക്കൂറിൽ വീട്ടിൽ.\n\n${PLAY_STORE}\n${APP_STORE}`,
    delPartner: `ഞങ്ങളുടെ ഡെലിവറി പാർട്ണറായി ദിവസവും വരുമാനം നേടുക.\n\n${PLAY_STORE}`,
    bookingSelected: `നിങ്ങൾ "ഓൺലൈൻ ബുക്കിംഗ്" തിരഞ്ഞെടുത്തു. റൂമുകൾ, അപ്പോയിന്റ്മെന്റുകൾ, മൂവി ടിക്കറ്റുകൾ ബുക്ക് ചെയ്യുക.`,
    bookingButtons: [{ id: 'BOOK_ROOM', title: 'റൂം ബുക്ക് ചെയ്യുക' }, { id: 'BOOK_APPOINT', title: 'അപ്പോയിന്റ്മെന്റ് ബുക്ക്' }, { id: 'BOOK_MOVIE', title: 'മൂവി ടിക്കറ്റ്' }],
    bookRoom: `ഇന്ത്യയിലുടനീളം ഹോട്ടലുകൾ, റൂമുകൾ മികച്ച നിരക്കിൽ ബുക്ക് ചെയ്യുക.\n\n${PLAY_STORE}`,
    bookAppoint: `അപ്പോയിന്റ്മെന്റുകൾ ബുക്ക് ചെയ്യുക - ഡോക്ടർ, സലൂൺ, സേവനങ്ങൾ.\n\n${PLAY_STORE}`,
    bookMovie: `മൂവി ടിക്കറ്റുകൾ, ഇവന്റുകൾ അടുത്ത് ബുക്ക് ചെയ്യുക.\n\n${PLAY_STORE}`,
    oppSelected: `നിങ്ങൾ "ബിസിനസ് അവസരം" തിരഞ്ഞെടുത്തു. ഞങ്ങളുടെ സർവീസ് പോയിന്റ് ആയി വരുമാനം തുടങ്ങുക. 3 ലെവലുകൾ.`,
    oppButtons: [{ id: 'OPP_DISTRICT', title: 'ജില്ലാ ഫ്രാഞ്ചൈസി' }, { id: 'OPP_CORP', title: 'കോർപ്പറേഷൻ ഫ്രാഞ്ചൈസി' }, { id: 'OPP_CENTER', title: 'ബിസിനസ് സെന്റർ' }],
    oppDistrict: `ജില്ലാ ഫ്രാഞ്ചൈസി - ഉയർന്ന വരുമാനം\nമുഴുവൻ ജില്ലയിൽ നിന്നും വരുമാനം.\n\nബന്ധപ്പെടുക: ${HELP_BIZ}\n${PLAY_STORE}`,
    oppCorp: `കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി - മിതമായ വരുമാനം\nനിങ്ങളുടെ നഗരത്തിൽ നിന്ന് വരുമാനം.\n\nബന്ധപ്പെടുക: ${HELP_BIZ}`,
    oppCenter: `ബിസിനസ് സെന്റർ - അടിസ്ഥാന വരുമാനം\nഞങ്ങളുടെ ബിസിനസ് സെന്ററായി മാറുക.\n\nബന്ധപ്പെടുക: ${HELP_BIZ}`,
  }
};

async function getUserLang(phone) {
  if (!redisClient) return 'en';
  try {
    const lang = await redisClient.get(`lang:${phone}`);
    return lang || 'en';
  } catch { return 'en'; }
}
async function setUserLang(phone, lang) {
  if (!redisClient) return;
  await redisClient.set(`lang:${phone}`, lang);
}
async function setState(phone, state) {
  if (!redisClient) return;
  await redisClient.set(`state:${phone}`, JSON.stringify(state), { EX: 86400 * 2 });
}
async function getState(phone) {
  if (!redisClient) return null;
  try {
    const s = await redisClient.get(`state:${phone}`);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

// Reminder scheduler using setTimeout + Redis
function scheduleReminder(phone, type, lang, delayMs) {
  const key = `rem:${phone}:${type}`;
  setTimeout(async () => {
    if (!redisClient) return;
    const state = await getState(phone);
    // Check if user already progressed beyond this reminder
    if (type === 'noLang' && state && state.lang) return;
    if (type === 'noService' && state && state.service) return;
    if (type === 'install' && state && state.installed) return;

    const L = T[lang] || T.en;
    let msg = null, btns = null;
    if (type === 'noLang') {
      msg = L.noLang;
      btns = [{ id: 'LANG_EN', title: L.btn_en }, { id: 'LANG_HI', title: L.btn_hi }, { id: 'LANG_ML', title: L.btn_ml }];
    } else if (type === 'noService') {
      msg = L.noService;
      // send 5 services as two messages if needed, but here 3 max, so send first 3 then next 2
      btns = L.services.slice(0, 3);
    } else if (type.startsWith('install:')) {
      const is24 = type.includes('24');
      msg = is24 ? L.haveInstalled24 : L.haveInstalled1;
      btns = [{ id: 'YES_ACTIVATE', title: L.yesActivate }, { id: 'NO_LATER', title: L.noLater }];
    }
    if (msg && btns) {
      try {
        await sendWithDelay(interactiveButton(phone, msg, btns));
        console.log(`REMINDER SENT ${type} to ${phone}`);
      } catch {}
    }
  }, delayMs);
}

// Webhook verification
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    if (!value) return;

    // Handle status callbacks (130429 detection)
    if (value.statuses) {
      const st = value.statuses[0];
      if (st.status === 'failed' && (st.errors?.[0]?.code === 130429 || st.errors?.[0]?.code === 131042)) {
        console.log(`STATUS failed to ${st.recipient_id} - code 130429, Rate limit hit`);
        setBlock(65);
      }
      return;
    }

    const msg = value.messages?.[0];
    if (!msg) return;
    const from = msg.from;
    const phone = from;
    console.log(`IN ${from} ${msg.text?.body || msg.button?.text || msg.interactive?.button_reply?.title || msg.type}`);

    if (isBlocked()) {
      console.log(`BLOCKED - IGNORING ${from}`);
      return;
    }

    const text = msg.text?.body?.trim();
    const btnId = msg.button?.payload || msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id;

    let lang = await getUserLang(phone);
    let state = await getState(phone) || {};

    // Language selection
    if (btnId === 'LANG_EN' || (text && text.toLowerCase() === 'english')) {
      lang = 'en'; await setUserLang(phone, 'en'); state.lang = 'en'; await setState(phone, state);
      const L = T.en;
      await sendWithDelay(interactiveButton(phone, L.mainMenu, L.services.slice(0,3)));
      await delay(300);
      await sendWithDelay(interactiveButton(phone, 'More services:-', L.services.slice(3,5)));
      scheduleReminder(phone, 'noService', lang, 1*60*60*1000);
      scheduleReminder(phone, 'noService', lang, 12*60*60*1000);
      scheduleReminder(phone, 'noService', lang, 24*60*60*1000);
      return;
    }
    if (btnId === 'LANG_HI' || text?.toLowerCase() === 'hindi' || text === 'हिन्दी') {
      lang = 'hi'; await setUserLang(phone, 'hi'); state.lang = 'hi'; await setState(phone, state);
      const L = T.hi;
      await sendWithDelay(interactiveButton(phone, L.mainMenu, L.services.slice(0,3)));
      await delay(300);
      await sendWithDelay(interactiveButton(phone, 'अधिक सेवाएं:-', L.services.slice(3,5)));
      scheduleReminder(phone, 'noService', lang, 1*60*60*1000);
      scheduleReminder(phone, 'noService', lang, 12*60*60*1000);
      scheduleReminder(phone, 'noService', lang, 24*60*60*1000);
      return;
    }
    if (btnId === 'LANG_ML' || text?.toLowerCase() === 'malayalam' || text === 'മലയാളം') {
      lang = 'ml'; await setUserLang(phone, 'ml'); state.lang = 'ml'; await setState(phone, state);
      const L = T.ml;
      await sendWithDelay(interactiveButton(phone, L.mainMenu, L.services.slice(0,3)));
      await delay(300);
      await sendWithDelay(interactiveButton(phone, 'കൂടുതൽ സേവനങ്ങൾ:-', L.services.slice(3,5)));
      scheduleReminder(phone, 'noService', lang, 1*60*60*1000);
      scheduleReminder(phone, 'noService', lang, 12*60*60*1000);
      scheduleReminder(phone, 'noService', lang, 24*60*60*1000);
      return;
    }

    const L = T[lang] || T.en;

    // First message / Hi
    if (!state.lang || text?.toLowerCase() === 'hi' || text?.toLowerCase() === 'hai' || text?.toLowerCase() === 'hello' || btnId === 'START') {
      if (!state.lang) {
        console.log(`FIRST MESSAGE from ${phone}`);
        await sendWithDelay(interactiveButton(phone, T.en.welcome, [{ id: 'LANG_EN', title: 'English' }, { id: 'LANG_HI', title: 'Hindi' }, { id: 'LANG_ML', title: 'Malayalam' }]));
        state = { first: true }; await setState(phone, state);
        scheduleReminder(phone, 'noLang', 'en', 1*60*60*1000);
        scheduleReminder(phone, 'noLang', 'en', 12*60*60*1000);
        scheduleReminder(phone, 'noLang', 'en', 24*60*60*1000);
        return;
      }
    }

    // Main service selection
    if (btnId && btnId.startsWith('SVC_')) {
      state.service = btnId; await setState(phone, state);
      if (btnId === 'SVC_RIDE') {
        await sendWithDelay(interactiveButton(phone, L.rideSelected, L.rideButtons));
      } else if (btnId === 'SVC_BIZDIR') {
        await sendWithDelay(interactiveButton(phone, L.bizDirSelected, L.bizDirButtons));
      } else if (btnId === 'SVC_DELIVERY') {
        await sendWithDelay(interactiveButton(phone, L.deliverySelected, L.deliveryButtons));
      } else if (btnId === 'SVC_BOOKING') {
        await sendWithDelay(interactiveButton(phone, L.bookingSelected, L.bookingButtons.slice(0,3)));
      } else if (btnId === 'SVC_OPP') {
        await sendWithDelay(interactiveButton(phone, L.oppSelected, L.oppButtons.slice(0,3)));
      }
      return;
    }

    // Ride sub
    if (btnId === 'RIDE_BOOK') {
      state.sub = 'RIDE_BOOK'; state.lastService = 'RIDE'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.bookCab));
      scheduleReminder(phone, 'install:RIDE_BOOK:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:RIDE_BOOK:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:RIDE_BOOK:24', lang, 24*60*60*1000);
      return;
    }
    if (btnId === 'RIDE_ATTACH') {
      state.sub = 'RIDE_ATTACH'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.attachCab));
      await sendWithDelay(interactiveButton(phone, 'Need help?', [{ id: 'HELP_RIDE', title: L.helpButtonLabel }]));
      return;
    }

    // Business Directory sub
    if (btnId === 'BIZ_REGISTER') {
      state.sub = 'BIZ_REGISTER'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.bizRegister));
      scheduleReminder(phone, 'install:BIZ_REGISTER:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:BIZ_REGISTER:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:BIZ_REGISTER:24', lang, 24*60*60*1000);
      return;
    }
    if (btnId === 'BIZ_ADS') {
      state.sub = 'BIZ_ADS'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.bizAds));
      scheduleReminder(phone, 'install:BIZ_ADS:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:BIZ_ADS:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:BIZ_ADS:24', lang, 24*60*60*1000);
      return;
    }

    // Delivery sub
    if (btnId === 'DEL_ORDER') {
      state.sub = 'DEL_ORDER'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.delOrder));
      scheduleReminder(phone, 'install:DEL_ORDER:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:DEL_ORDER:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:DEL_ORDER:24', lang, 24*60*60*1000);
      return;
    }
    if (btnId === 'DEL_PARTNER') {
      state.sub = 'DEL_PARTNER'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.delPartner));
      return;
    }

    // Booking sub - 3
    if (btnId === 'BOOK_ROOM') {
      state.sub = 'BOOK_ROOM'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.bookRoom));
      scheduleReminder(phone, 'install:BOOK_ROOM:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:BOOK_ROOM:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:BOOK_ROOM:24', lang, 24*60*60*1000);
      return;
    }
    if (btnId === 'BOOK_APPOINT') {
      state.sub = 'BOOK_APPOINT'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.bookAppoint));
      scheduleReminder(phone, 'install:BOOK_APPOINT:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:BOOK_APPOINT:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:BOOK_APPOINT:24', lang, 24*60*60*1000);
      return;
    }
    if (btnId === 'BOOK_MOVIE') {
      state.sub = 'BOOK_MOVIE'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.bookMovie));
      scheduleReminder(phone, 'install:BOOK_MOVIE:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:BOOK_MOVIE:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:BOOK_MOVIE:24', lang, 24*60*60*1000);
      return;
    }

    // Opportunity sub - 3 Higher/Moderate/Base
    if (btnId === 'OPP_DISTRICT') {
      state.sub = 'OPP_DISTRICT'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.oppDistrict));
      await sendWithDelay(interactiveButton(phone, 'Contact for District Franchise', [{ id: 'HELP_OPP', title: L.helpOppLabel }]));
      scheduleReminder(phone, 'install:OPP_DISTRICT:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:OPP_DISTRICT:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:OPP_DISTRICT:24', lang, 24*60*60*1000);
      return;
    }
    if (btnId === 'OPP_CORP') {
      state.sub = 'OPP_CORP'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.oppCorp));
      await sendWithDelay(interactiveButton(phone, 'Contact for Corporation Franchise', [{ id: 'HELP_OPP', title: L.helpOppLabel }]));
      scheduleReminder(phone, 'install:OPP_CORP:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:OPP_CORP:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:OPP_CORP:24', lang, 24*60*60*1000);
      return;
    }
    if (btnId === 'OPP_CENTER') {
      state.sub = 'OPP_CENTER'; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.oppCenter));
      await sendWithDelay(interactiveButton(phone, 'Contact for Business Center', [{ id: 'HELP_OPP', title: L.helpOppLabel }]));
      scheduleReminder(phone, 'install:OPP_CENTER:1', lang, 1*60*60*1000);
      scheduleReminder(phone, 'install:OPP_CENTER:12', lang, 12*60*60*1000);
      scheduleReminder(phone, 'install:OPP_CENTER:24', lang, 24*60*60*1000);
      return;
    }

    // Yes activate / No later
    if (btnId === 'YES_ACTIVATE') {
      state.installed = true; await setState(phone, state);
      await sendWithDelay(textMessage(phone, L.activated));
      await sendWithDelay(interactiveButton(phone, 'Need more help?', [{ id: 'HELP_RIDE', title: L.helpButtonLabel }]));
      return;
    }
    if (btnId === 'NO_LATER') {
      await sendWithDelay(textMessage(phone, `No problem! Take your time. When you are ready, click below to install.\n${PLAY_STORE}\n\nHelp: ${state.service === 'SVC_OPP' || state.sub?.startsWith('OPP_') ? HELP_BIZ : HELP_RIDE}`));
      return;
    }

    if (btnId === 'HELP_RIDE') {
      await sendWithDelay(textMessage(phone, `📞 Customer Care: ${HELP_RIDE}\n\nTap to call: +91 ${HELP_RIDE}\nWe are here to help you!`));
      return;
    }
    if (btnId === 'HELP_OPP') {
      await sendWithDelay(textMessage(phone, `📞 Franchise Team: ${HELP_BIZ}\n\nTap to call: +91 ${HELP_BIZ}\nWe are here to help you!`));
      return;
    }

    // Fallback - show main menu again if language exists
    if (state.lang) {
      await sendWithDelay(interactiveButton(phone, L.mainMenu, L.services.slice(0,3)));
    }

  } catch (err) {
    console.error('WEBHOOK ERROR', err.message);
  }
});

app.get('/', (req, res) => res.send('V93 FINAL 95677 42507 - 17 FLOWS - TEXT ONLY - 1.2s DELAY - 65MIN BLOCK - READY'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`V93 listening on ${PORT} - No 2h Block - Ready - Phone ID ${PHONE_NUMBER_ID}`));
