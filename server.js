// V9 FINAL - BIZMAPIA ONLY - PROPER MALAYALAM & HINDI SCRIPT - 5 Services - No WPBS
// If user selects Malayalam, ALL remaining chats in proper മലയാളം lipi. Hindi in हिंदी देवनागरी.
const express=require('express');const bodyParser=require('body-parser');const axios=require('axios');const fs=require('fs');const {google}=require('googleapis');const app=express();app.use(bodyParser.json());
const VERIFY_TOKEN=process.env.VERIFY_TOKEN||"bizmapia_verify_2024";
const TOKEN=process.env.WHATSAPP_TOKEN;const PHONE_NUMBER_ID=process.env.PHONE_NUMBER_ID;const PORT=process.env.PORT||10000;
const SHEET_ID=(process.env.GOOGLE_SHEET_ID||"1MnPTAMafVTuSX2uQKCpP6GKKadQBLXfrgnySigY8cHY").trim();
const CONTACT_NUMBER="8590175977";
console.log("========== V9 BIZMAPIA ONLY PROPER SCRIPT - "+SHEET_ID.substring(0,30)+" ==========");

const ASSETS={
 posters:{
  welcome:"https://files.catbox.moe/zmj6te.jpg",
  customer:"https://files.catbox.moe/nbjslu.jpg",
  driver:"https://files.catbox.moe/2trzp7.jpg",
  business:"https://files.catbox.moe/sylcqa.jpg",
  opportunity:"https://files.catbox.moe/y8m3lq.jpg",
  freeRecharge:"https://files.catbox.moe/c03g3q.jpg",
  franchiseBrochure:"https://files.catbox.moe/FRANCHISEE-NEW-BIZMAPIA.jpg",
  businessBrochure:"https://files.catbox.moe/BUSINESS-NEW-BIZMAPIA.jpg",
  onlineDelivery:"https://bizmapia.com/posters/online-delivery.jpg",
  onlineBooking:"https://bizmapia.com/posters/online-booking.jpg"
 },
 apps:{
  customer:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia",
  driver:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia_driver",
  bizDirCustomer:"https://play.google.com/store/apps/details?id=com.bizmapia.directory.customer",
  bizDirMerchant:"https://play.google.com/store/apps/details?id=com.bizmapia.directory.merchant",
  deliveryAgent:"https://play.google.com/store/apps/details?id=com.bizmapia.delivery",
  booking:"https://play.google.com/store/apps/details?id=com.bizmapia.booking"
 },
 tenders:{district:"https://bizmapia.com/tenders/district.pdf",corp:"https://bizmapia.com/tenders/corporation.pdf",bc:"https://bizmapia.com/tenders/business_center.pdf"},
 payments:{registration:"https://rzp.io/l/bizmapia5000"},
 calendar:"https://calendly.com/bizmapia/agreement"
};

const LANG_TEXT={
 EN:{
  welcome:"Welcome to Bizmapia! Explore our services, book rides, or partner with us to unlock lucrative business opportunities across India.",
  tapExplore:"Tap to explore:", selectLang:"Please select your preferred language:", mainMenuTitle:"Please select an option from below to continue:", mainMenuBtn:"Select Service",
  ride:"Ride-Hailing", rideDesc:"Book rides or attach vehicle", bizDir:"Business Directory", bizDirDesc:"Search or list business", delivery:"Online Delivery", deliveryDesc:"Parcel & delivery agent", booking:"Online Booking", bookingDesc:"Rooms, Appointments, Cinema", earn:"Earn with Bizmapia", earnDesc:"Franchise 1L-15L",
  rideMenu:"Welcome to Bizmapia Ride-Hailing Services! What would you like to do?", bookRide:"Book a Ride", attachVehicle:"Attach Your Vehicle",
  customerH:"CUSTOMER - Book a Taxi & Services", driverH:"DRIVER PARTNER - Attach Vehicle & Start Earning!",
  bizDirCaption:"Discover local businesses near you, or list your business on Bizmapia Directory!", bizDirChoose:"Choose an option:", searchBiz:"Search Businesses", listBiz:"List Your Business",
  deliveryCaption:"Welcome to Bizmapia Online Delivery! Fast and reliable local deliveries.", deliveryChoose:"Select:", bookParcel:"Book Your Parcel", registerAgent:"Register as Agent",
  bookingCaption:"What would you like to book today?", bookingChoose:"Select booking type:", bookRoom:"Book a Room", bookAppt:"Book Appointment", bookCinema:"Book Cinema Tickets",
  earnCaption:"Welcome to Bizmapia Business Opportunities! What level are you looking for?", earnList:"Select earning level:", highEarn:"High Earning", highDesc:"District Level Franchisee", modEarn:"Moderate Earning", modDesc:"Corp/Municipal Franchisee", baseEarn:"Base Earning", baseDesc:"Business Center Partner",
  watchedQ:"Have you watched our video?", yes:"Yes", no:"No", watchFirst:"Please watch the full video first:",
  benefitsDistrict:"Benefits:\n1: Earn % on all revenue by Corp/Muni & Business Centers\n2: Exclusive point of contact\n3: 5-Year Earning MOU", benefitsCorp:"Benefits:\n1: Earn % on Business Centers\n2: Direct connection to District\n3: 3-Year MOU", benefitsBC:"Benefits:\n1: 1-Year Earning MOU",
  knowSupport:"Know Support", supportDistrict:"Support:\n1: 12 Months marketing\n2: 6 Months rent\n3: 6 Months salary", supportCorp:"Support:\n1: 12 Months marketing\n2: 6 Months rent", supportBC:"Support:\n1: 3 Months local marketing",
  knowReq:"Know Requirements", reqDistrict:"Requirements:\n1: >=100 sq.ft\n2: 1 staff\n3: PC/Laptop, Phone, Internet", reqCorp:"Requirements:\n1: >=50 sq.ft\n2: 1 staff", reqBC:"Requirements:\n1: >=50 sq.ft",
  submitApp:"Submit Application", categoryQ:"Does your district contain a Municipal Corporation?", corpLocQ:"Is your business location inside a Municipal Corporation?", bcLocQ:"Is your business center in Corporation or Municipal area?",
  corpYes:"Yes", corpNo:"No", feeCorpDistrict:"District Franchise Fee for Corporation District is Rs 15 Lakhs.", feeNonCorpDistrict:"Fee for Non-Corporation District is Rs 10 Lakhs.", feeCorp:"Franchise Fee is Rs 5 Lakhs.", feeMuni:"Franchise Fee is Rs 4 Lakhs.", feeBC:"Fee is Rs 1 Lakh for both.",
  readyYes:"Yes, I am Ready", emi:"Know EMI Options", payFee:"Please pay your initial registration fee to proceed:", payCheck:"Have you completed your registration payment?", payYes:"Yes", payNo:"No, I will pay now",
  formName:"*Name :-* Enter your full name:", formContact:"*Contact number :-* Enter mobile number:", formPlace:"*Place :-* Enter place / city:", formOcc:"*Current occupation :-* Select:", thanksEnq:"Thank you", team24:"Our team will contact within 24h", tenderMsg:"Thank you! Download Tender Document & Book Agreement Slot:", yesNoQ:"You want to grab this opportunity?",
  remLang:"Reminder: Please select your preferred language to continue. Call 8590175977", remDriver5:"How to attach your vehicle — Watch tutorial!", remDriver15:"Grab our 1-Year Free Recharge Offer! Register now.", remDriver1h:"Your 1-Year Free Recharge Offer is about to expire!", remDriver12h:"Do you need help registering your vehicle?", remDriver24h:"Your Free Recharge Opportunity is expiring soon!", remDriver48h:"Last Chance! Your free recharge opportunity will expire shortly.", remDriver72h:"Your Free Recharge Opportunity has expired.", grabNow:"Grab Now", contactSupport:"Contact Support", registerAgain:"Register Again"
 },
 HI:{
  welcome:"Bizmapia में आपका स्वागत है! हमारी सेवाओं का अन्वेषण करें, राइड बुक करें, या पूरे भारत में आकर्षक व्यावसायिक अवसरों के लिए हमारे साथ जुड़ें।",
  tapExplore:"एक्सप्लोर करने के लिए टैप करें:", selectLang:"कृपया अपनी पसंदीदा भाषा चुनें:", mainMenuTitle:"जारी रखने के लिए नीचे दिए गए विकल्पों में से एक चुनें:", mainMenuBtn:"सेवा चुनें",
  ride:"राइड-हेलिंग", rideDesc:"राइड बुक करें या वाहन जोड़ें", bizDir:"बिजनेस डायरेक्टरी", bizDirDesc:"बिजनेस खोजें या लिस्ट करें", delivery:"ऑनलाइन डिलीवरी", deliveryDesc:"पार्सल और डिलीवरी एजेंट", booking:"ऑनलाइन बुकिंग", bookingDesc:"रूम, अपॉइंटमेंट, सिनेमा", earn:"Bizmapia के साथ कमाएं", earnDesc:"फ्रेंचाइजी 1L-15L",
  rideMenu:"Bizmapia राइड-हेलिंग सेवाओं में आपका स्वागत है! आप क्या करना चाहते हैं?", bookRide:"राइड बुक करें", attachVehicle:"अपना वाहन जोड़ें",
  customerH:"कस्टमर - टैक्सी और सर्विस बुक करें", driverH:"ड्राइवर पार्टनर - अपनी गाड़ी जोड़ें और कमाना शुरू करें!", bizDirCaption:"अपने पास स्थानीय व्यवसायों की खोज करें, या हजारों ग्राहकों तक पहुंचने के लिए Bizmapia डायरेक्टरी में अपना व्यवसाय लिस्ट करें!", bizDirChoose:"एक विकल्प चुनें:", searchBiz:"बिजनेस खोजें", listBiz:"बिजनेस लिस्ट करें",
  deliveryCaption:"Bizmapia ऑनलाइन डिलीवरी में आपका स्वागत है! तेज़ और विश्वसनीय स्थानीय डिलीवरी।", deliveryChoose:"चुनें:", bookParcel:"अपना पार्सल बुक करें", registerAgent:"एजेंट के रूप में रजिस्टर करें",
  bookingCaption:"आप आज क्या बुक करना चाहते हैं?", bookingChoose:"बुकिंग प्रकार चुनें:", bookRoom:"रूम बुक करें", bookAppt:"अपॉइंटमेंट बुक करें", bookCinema:"सिनेमा टिकट बुक करें",
  earnCaption:"Bizmapia बिजनेस अवसरों में आपका स्वागत है! आप किस स्तर के अवसर की तलाश में हैं?", earnList:"कमाई का स्तर चुनें:", highEarn:"हाई अर्निंग", highDesc:"जिला स्तरीय फ्रेंचाइजी", modEarn:"मध्यम अर्निंग", modDesc:"कॉर्पोरेशन/नगरपालिका फ्रेंचाइजी", baseEarn:"बेस अर्निंग", baseDesc:"बिजनेस सेंटर पार्टनर",
  watchedQ:"क्या आपने हमारा वीडियो देखा है?", yes:"हाँ", no:"नहीं", watchFirst:"कृपया पहले पूरा वीडियो देखें:",
  benefitsDistrict:"फ्रेंचाइजी लाभ:\n1: जिले में शीर्ष-स्तरीय फ्रेंचाइजी के रूप में, आप कॉर्पोरेशन, नगरपालिका और बिजनेस सेंटर द्वारा उत्पन्न सभी राजस्व पर % कमाते हैं।\n2: आप जिले के भीतर कंपनी के लिए विशेष संपर्क बिंदु हैं।\n3: आपको कंपनी से सीधे 5-वर्षीय कानूनी MOU प्राप्त होता है।",
  benefitsCorp:"लाभ:\n1: अपने क्षेत्र में बिजनेस सेंटर के राजस्व पर % कमाएं\n2: जिला फ्रेंचाइजी से सीधा संबंध\n3: 3-वर्षीय कानूनी MOU", benefitsBC:"लाभ:\n1: कंपनी द्वारा स्वीकृत 1-वर्षीय अर्निंग MOU प्राप्त करें।",
  knowSupport:"सपोर्ट जानें", supportDistrict:"सपोर्ट:\n1: 12 महीने मार्केटिंग और विज्ञापन सपोर्ट\n2: 6 महीने ऑफिस किराया योगदान\n3: 6 महीने स्टाफ वेतन योगदान", supportCorp:"सपोर्ट:\n1: 12 महीने मार्केटिंग सपोर्ट\n2: 6 महीने किराया योगदान\n3: 6 महीने स्टाफ वेतन", supportBC:"सपोर्ट:\n1: 3 महीने स्थानीय मार्केटिंग सपोर्ट",
  knowReq:"आवश्यकताएं जानें", reqDistrict:"आवश्यकताएं:\n1: ≥100 sq.ft कमर्शियल स्पेस\n2: न्यूनतम 1 फुल-टाइम स्टाफ\n3: PC/Laptop, Android Phone, Internet", reqCorp:"आवश्यकताएं:\n1: ≥50 sq.ft स्पेस\n2: 1 फुल-टाइम स्टाफ", reqBC:"आवश्यकताएं:\n1: ≥50 sq.ft स्पेस",
  submitApp:"आवेदन जमा करें", categoryQ:"कृपया अपनी व्यावसायिक स्थान श्रेणी चुनें। क्या आपके जिले में नगर निगम है?", corpLocQ:"क्या आपका व्यवसाय स्थान नगर निगम के अंदर है?", bcLocQ:"क्या आपका बिजनेस सेंटर कॉर्पोरेशन या नगरपालिका क्षेत्र में स्थित है?",
  corpYes:"हाँ", corpNo:"नहीं", feeCorpDistrict:"कॉर्पोरेशन जिले के लिए जिला स्तरीय फ्रेंचाइजी शुल्क ₹15 लाख है।", feeNonCorpDistrict:"गैर-कॉर्पोरेशन जिले के लिए शुल्क ₹10 लाख है।", feeCorp:"फ्रेंचाइजी शुल्क ₹5 लाख है।", feeMuni:"फ्रेंचाइजी शुल्क ₹4 लाख है।", feeBC:"दोनों श्रेणियों के लिए शुल्क ₹1 लाख है।",
  readyYes:"हाँ, मैं तैयार हूँ", emi:"EMI विकल्प जानें", payFee:"कृपया आगे बढ़ने के लिए प्रारंभिक पंजीकरण शुल्क का भुगतान करें:", payCheck:"क्या आपने अपना पंजीकरण भुगतान पूरा कर लिया है?", payYes:"हाँ", payNo:"नहीं, मैं अभी भुगतान करूंगा",
  formName:"*नाम :-* अपना पूरा नाम लिखें:", formContact:"*मोबाइल नंबर :-* अपना नंबर लिखें:", formPlace:"*जगह :-* अपना शहर लिखें:", formOcc:"*वर्तमान व्यवसाय :-* चुनें:", thanksEnq:"धन्यवाद", team24:"हमारी टीम 24 घंटे में संपर्क करेगी", tenderMsg:"धन्यवाद! टेंडर दस्तावेज़ डाउनलोड करें और एग्रीमेंट स्लॉट बुक करें:", yesNoQ:"क्या आप यह अवसर लेना चाहते हैं?",
  remLang:"रिमाइंडर: कृपया जारी रखने के लिए अपनी भाषा चुनें। कॉल 8590175977", remDriver5:"अपना वाहन कैसे जोड़ें — हमारा ट्यूटोरियल वीडियो देखें!", remDriver15:"हमारा 1-वर्षीय फ्री रिचार्ज ऑफर प्राप्त करें! अभी रजिस्टर करें।", remDriver1h:"आपका 1-वर्षीय फ्री रिचार्ज ऑफर समाप्त होने वाला है!", remDriver12h:"क्या आपको अपना वाहन रजिस्टर करने में मदद चाहिए?", remDriver24h:"आपका फ्री रिचार्ज अवसर जल्द ही समाप्त हो रहा है!", remDriver48h:"आखिरी मौका! आपका फ्री रिचार्ज अवसर शीघ्र समाप्त होगा।", remDriver72h:"आपका फ्री रिचार्ज अवसर समाप्त हो गया है।", grabNow:"अभी प्राप्त करें", contactSupport:"सपोर्ट से संपर्क करें", registerAgain:"फिर से रजिस्टर करें"
 },
 ML:{
  welcome:"Bizmapia-ലേക്ക് സ്വാഗതം! ഞങ്ങളുടെ സേവനങ്ങൾ പര്യവേക്ഷണം ചെയ്യുക, റൈഡുകൾ ബുക്ക് ചെയ്യുക, അല്ലെങ്കിൽ ഇന്ത്യയിലുടനീളം ലാഭകരമായ ബിസിനസ് അവസരങ്ങൾക്കായി ഞങ്ങളുമായി പങ്കാളിയാകുക.",
  tapExplore:"പര്യവേക്ഷണം ചെയ്യാൻ ടാപ്പ് ചെയ്യുക:", selectLang:"ദയവായി നിങ്ങളുടെ ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക:", mainMenuTitle:"തുടരുന്നതിന് താഴെ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:", mainMenuBtn:"സേവനം തിരഞ്ഞെടുക്കുക",
  ride:"റൈഡ്-ഹെയിലിംഗ്", rideDesc:"റൈഡ് ബുക്ക് ചെയ്യുക അല്ലെങ്കിൽ വാഹനം ചേർക്കുക", bizDir:"ബിസിനസ് ഡയറക്ടറി", bizDirDesc:"ബിസിനസ് തിരയുക അല്ലെങ്കിൽ ലിസ്റ്റ് ചെയ്യുക", delivery:"ഓൺലൈൻ ഡെലിവറി", deliveryDesc:"പാർസൽ & ഡെലിവറി ഏജന്റ്", booking:"ഓൺലൈൻ ബുക്കിംഗ്", bookingDesc:"റൂം, അപ്പോയിന്റ്മെന്റ്, സിനിമ", earn:"Bizmapia-യ്‌ക്കൊപ്പം സമ്പാദിക്കുക", earnDesc:"ഫ്രാഞ്ചൈസി 1L-15L",
  rideMenu:"Bizmapia റൈഡ്-ഹെയിലിംഗ് സേവനങ്ങളിലേക്ക് സ്വാഗതം! നിങ്ങൾ എന്താണ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?", bookRide:"റൈഡ് ബുക്ക് ചെയ്യുക", attachVehicle:"വാഹനം ചേർക്കുക",
  customerH:"കസ്റ്റമർ - ടാക്സി & സർവീസുകൾ ബുക്ക് ചെയ്യുക", driverH:"ഡ്രൈവർ പാർട്ണർ - വാഹനം അറ്റാച്ച് ചെയ്ത് വരുമാനം നേടൂ!", bizDirCaption:"നിങ്ങൾക്ക് സമീപമുള്ള പ്രാദേശിക ബിസിനസുകൾ കണ്ടെത്തുക, അല്ലെങ്കിൽ ആയിരക്കണക്കിന് ഉപഭോക്താക്കളിലേക്ക് എത്താൻ Bizmapia ഡയറക്ടറിയിൽ നിങ്ങളുടെ ബിസിനസ് ലിസ്റ്റ് ചെയ്യുക!", bizDirChoose:"ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:", searchBiz:"ബിസിനസുകൾ തിരയുക", listBiz:"ബിസിനസ് ലിസ്റ്റ് ചെയ്യുക",
  deliveryCaption:"Bizmapia ഓൺലൈൻ ഡെലിവറിയിലേക്ക് സ്വാഗതം! വേഗതയേറിയതും വിശ്വസനീയവുമായ പ്രാദേശിക ഡെലിവറികൾ.", deliveryChoose:"തിരഞ്ഞെടുക്കുക:", bookParcel:"പാർസൽ ബുക്ക് ചെയ്യുക", registerAgent:"ഏജന്റായി രജിസ്റ്റർ ചെയ്യുക",
  bookingCaption:"ഇന്ന് നിങ്ങൾ എന്താണ് ബുക്ക് ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?", bookingChoose:"ബുക്കിംഗ് തരം തിരഞ്ഞെടുക്കുക:", bookRoom:"റൂം ബുക്ക് ചെയ്യുക", bookAppt:"അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക", bookCinema:"സിനിമ ടിക്കറ്റ് ബുക്ക് ചെയ്യുക",
  earnCaption:"Bizmapia ബിസിനസ് അവസരങ്ങളിലേക്ക് സ്വാഗതം! നിങ്ങൾ ഏത് തലത്തിലുള്ള അവസരമാണ് തിരയുന്നത്?", earnList:"വരുമാന നില തിരഞ്ഞെടുക്കുക:", highEarn:"ഉയർന്ന വരുമാനം", highDesc:"ജില്ലാ തല ഫ്രാഞ്ചൈസി", modEarn:"മിതമായ വരുമാനം", modDesc:"കോർപ്പറേഷൻ/മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി", baseEarn:"അടിസ്ഥാന വരുമാനം", baseDesc:"ബിസിനസ് സെന്റർ പാർട്ണർ",
  watchedQ:"നിങ്ങൾ ഞങ്ങളുടെ വീഡിയോ കണ്ടോ?", yes:"അതെ", no:"അല്ല", watchFirst:"ദയവായി ആദ്യം മുഴുവൻ വീഡിയോ കാണുക:",
  benefitsDistrict:"ഫ്രാഞ്ചൈസി ആനുകൂല്യങ്ങൾ:\n1: നിങ്ങളുടെ ജില്ലയിലെ ടോപ്പ്-ലെവൽ ഫ്രാഞ്ചൈസി എന്ന നിലയിൽ, കോർപ്പറേഷൻ, മുനിസിപ്പൽ, ബിസിനസ് സെന്ററുകൾ സൃഷ്ടിക്കുന്ന എല്ലാ വരുമാനത്തിന്റെയും % നിങ്ങൾക്ക് ലഭിക്കും.\n2: നിങ്ങളുടെ ജില്ലയ്ക്കുള്ളിൽ കമ്പനിയുടെ എക്സ്ക്ലൂസീവ് കോൺടാക്റ്റ് പോയിന്റ് നിങ്ങളാണ്.\n3: കമ്പനിയിൽ നിന്ന് നേരിട്ട് 5 വർഷത്തെ നിയമപരമായ Earning MOU ലഭിക്കും.",
  benefitsCorp:"ആനുകൂല്യങ്ങൾ:\n1: നിങ്ങളുടെ പ്രദേശത്തെ ബിസിനസ് സെന്ററുകളുടെ വരുമാനത്തിൽ % നേടുക\n2: ജില്ലാ ഫ്രാഞ്ചൈസിയുമായി നേരിട്ടുള്ള ബന്ധം\n3: 3 വർഷത്തെ നിയമപരമായ MOU", benefitsBC:"ആനുകൂല്യങ്ങൾ:\n1: കമ്പനി അംഗീകരിച്ച 1 വർഷത്തെ Earning MOU ലഭിക്കും.",
  knowSupport:"സപ്പോർട്ട് അറിയുക", supportDistrict:"സപ്പോർട്ട്:\n1: 12 മാസം മാർക്കറ്റിംഗ് & പരസ്യ സപ്പോർട്ട്\n2: 6 മാസം ഓഫീസ് വാടക സംഭാവന\n3: 6 മാസം സ്റ്റാഫ് ശമ്പള സംഭാവന", supportCorp:"സപ്പോർട്ട്:\n1: 12 മാസം മാർക്കറ്റിംഗ് സപ്പോർട്ട്\n2: 6 മാസം വാടക സംഭാവന\n3: 6 മാസം സ്റ്റാഫ് ശമ്പളം", supportBC:"സപ്പോർട്ട്:\n1: 3 മാസം ലോക്കൽ മാർക്കറ്റിംഗ് സപ്പോർട്ട്",
  knowReq:"ആവശ്യകതകൾ അറിയുക", reqDistrict:"ആവശ്യകതകൾ:\n1: ≥100 sq.ft വാണിജ്യ സ്ഥലം\n2: കുറഞ്ഞത് 1 ഫുൾ-ടൈം സ്റ്റാഫ്\n3: PC/Laptop, Android Phone, Internet", reqCorp:"ആവശ്യകതകൾ:\n1: ≥50 sq.ft സ്ഥലം\n2: 1 ഫുൾ-ടൈം സ്റ്റാഫ്", reqBC:"ആവശ്യകതകൾ:\n1: ≥50 sq.ft സ്ഥലം",
  submitApp:"അപേക്ഷ സമർപ്പിക്കുക", categoryQ:"ദയവായി നിങ്ങളുടെ ബിസിനസ് ലൊക്കേഷൻ കാറ്റഗറി തിരഞ്ഞെടുക്കുക. നിങ്ങളുടെ ജില്ലയിൽ മുനിസിപ്പൽ കോർപ്പറേഷൻ ഉണ്ടോ?", corpLocQ:"നിങ്ങളുടെ ബിസിനസ് ലൊക്കേഷൻ മുനിസിപ്പൽ കോർപ്പറേഷനുള്ളിലാണോ?", bcLocQ:"നിങ്ങളുടെ ബിസിനസ് സെന്റർ കോർപ്പറേഷനിലോ മുനിസിപ്പൽ ഏരിയയിലോ ആണോ സ്ഥിതി ചെയ്യുന്നത്?",
  corpYes:"അതെ", corpNo:"അല്ല", feeCorpDistrict:"കോർപ്പറേഷൻ ജില്ലയ്ക്കുള്ള ജില്ലാ തല ഫ്രാഞ്ചൈസി ഫീസ് ₹15 ലക്ഷം ആണ്.", feeNonCorpDistrict:"നോൺ-കോർപ്പറേഷൻ ജില്ലയ്ക്കുള്ള ഫീസ് ₹10 ലക്ഷം ആണ്.", feeCorp:"ഫ്രാഞ്ചൈസി ഫീസ് ₹5 ലക്ഷം ആണ്.", feeMuni:"ഫ്രാഞ്ചൈസി ഫീസ് ₹4 ലക്ഷം ആണ്.", feeBC:"രണ്ട് വിഭാഗങ്ങൾക്കും ഫീസ് ₹1 ലക്ഷം ആണ്।",
  readyYes:"അതെ, ഞാൻ തയ്യാറാണ്", emi:"EMI ഓപ്ഷനുകൾ അറിയുക", payFee:"തുടരുന്നതിന് പ്രാരംഭ രജിസ്ട്രേഷൻ ഫീസ് അടയ്ക്കുക:", payCheck:"നിങ്ങൾ രജിസ്ട്രേഷൻ പേമെന്റ് പൂർത്തിയാക്കിയോ?", payYes:"അതെ", payNo:"അല്ല, ഞാൻ ഇപ്പോൾ പേ ചെയ്യാം",
  formName:"*പേര് :-* നിങ്ങളുടെ പേര് നൽകുക:", formContact:"*ഫോൺ നമ്പർ :-* നമ്പർ നൽകുക:", formPlace:"*സ്ഥലം :-* നിങ്ങളുടെ സ്ഥലം നൽകുക:", formOcc:"*ജോലി :-* തിരഞ്ഞെടുക്കുക:", thanksEnq:"നന്ദി", team24:"ടീം 24 മണിക്കൂറിനുള്ളിൽ ബന്ധപ്പെടും", tenderMsg:"നന്ദി! ടെൻഡർ ഡോക്യുമെന്റ് ഡൗൺലോഡ് ചെയ്ത് എഗ്രിമെന്റ് സ്ലോട്ട് ബുക്ക് ചെയ്യുക:", yesNoQ:"ഈ അവസരം സ്വന്തമാക്കാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?",
  remLang:"റിമൈൻഡർ: തുടരുന്നതിന് ദയവായി നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക. വിളിക്കുക 8590175977", remDriver5:"നിങ്ങളുടെ വാഹനം എങ്ങനെ ചേർക്കാം — ട്യൂട്ടോറിയൽ വീഡിയോ കാണുക!", remDriver15:"ഞങ്ങളുടെ 1 വർഷത്തെ സൗജന്യ റീചാർജ് ഓഫർ നേടൂ! ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക.", remDriver1h:"നിങ്ങളുടെ 1 വർഷത്തെ സൗജന്യ റീചാർജ് ഓഫർ കാലഹരണപ്പെടാൻ പോകുന്നു!", remDriver12h:"നിങ്ങളുടെ വാഹനം രജിസ്റ്റർ ചെയ്യാൻ സഹായം വേണോ?", remDriver24h:"നിങ്ങളുടെ സൗജന്യ റീചാർജ് അവസരം ഉടൻ അവസാനിക്കും!", remDriver48h:"അവസാന അവസരം! നിങ്ങളുടെ സൗജന്യ റീചാർജ് അവസരം ഉടൻ അവസാനിക്കും.", remDriver72h:"നിങ്ങളുടെ സൗജന്യ റീചാർജ് അവസരം കാലഹരണപ്പെട്ടു.", grabNow:"ഇപ്പോൾ നേടുക", contactSupport:"സപ്പോർട്ടുമായി ബന്ധപ്പെടുക", registerAgain:"വീണ്ടും രജിസ്റ്റർ ചെയ്യുക"
 }
};
const getT=(l,k)=>(LANG_TEXT[l]&&LANG_TEXT[l][k])||LANG_TEXT.EN[k];
let sheetsClientCache=null;
async function getSheetsClient(){try{let creds=process.env.GOOGLE_CREDENTIALS;if(!creds)return null;let credentials=JSON.parse(creds);if(credentials.private_key)credentials.private_key=credentials.private_key.replace(/\\\\n/g,'\n');if(sheetsClientCache)return sheetsClientCache;const auth=new google.auth.GoogleAuth({credentials,scopes:['https://www.googleapis.com/auth/spreadsheets']});const client=await auth.getClient();const sheets=google.sheets({version:'v4',auth:client});sheetsClientCache=sheets;return sheets;}catch(e){return null;}}
async function appendToSheet(row){try{const sheets=await getSheetsClient();if(!sheets)return false;await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID,range:'Sheet1!A:I',valueInputOption:'USER_ENTERED',insertDataOption:'INSERT_ROWS',requestBody:{values:[row]}});return true;}catch(e){return false;}}
async function logAllChat(phone,type,status,lang,stage,extra=''){try{const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});const row=[dateStr,phone,type,`${stage} | ${type} | ${status} | ${extra}`.substring(0,490),phone,stage,`${lang} | ${status}`,extra.substring(0,200),lang];await appendToSheet(row);}catch(e){}}
const sessions={};const processedIds=new Set();let pendingChats={}; let driverReminders=[];
async function ensureSheetTab(sheets, title){try{const meta=await sheets.spreadsheets.get({spreadsheetId:SHEET_ID});const exists=meta.data.sheets.some(s=>s.properties.title===title);if(!exists){await sheets.spreadsheets.batchUpdate({spreadsheetId:SHEET_ID, requestBody:{requests:[{addSheet:{properties:{title}}}]}});}}catch(e){}}
async function savePendingToSheet(){try{const sheets=await getSheetsClient();if(!sheets)return;await ensureSheetTab(sheets,"PendingChats");await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID, range:'PendingChats!A2:E'});const rows=Object.keys(pendingChats).map(p=>[p, pendingChats[p].lang, pendingChats[p].stage, pendingChats[p].lastActivity, JSON.stringify(pendingChats[p].reminders)]);if(rows.length>0)await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID, range:'PendingChats!A:E', valueInputOption:'USER_ENTERED', requestBody:{values: rows}});}catch(e){}}
async function loadPendingFromSheet(){try{const sheets=await getSheetsClient();if(!sheets)return {};await ensureSheetTab(sheets,"PendingChats");const res=await sheets.spreadsheets.values.get({spreadsheetId:SHEET_ID, range:'PendingChats!A2:E'});const rows=res.data.values||[];let out={};rows.forEach(r=>{if(r[0])out[r[0]]={lang:r[1]||'EN', stage:r[2], lastActivity:parseInt(r[3]), reminders:JSON.parse(r[4]||'{"r1":false,"r2":false,"r3":false,"r4":false}')};});return out;}catch(e){return {};}}
function setPendingChat(phone,lang,stageName){if(!pendingChats[phone])pendingChats[phone]={lang:lang||"EN",stage:stageName,lastActivity:Date.now(),reminders:{r1:false,r2:false,r3:false,r4:false}};else{pendingChats[phone].lang=lang||pendingChats[phone].lang;pendingChats[phone].stage=stageName;pendingChats[phone].lastActivity=Date.now();pendingChats[phone].reminders={r1:false,r2:false,r3:false,r4:false};}savePendingToSheet();}
function clearPendingChat(phone){if(pendingChats[phone]){delete pendingChats[phone];savePendingToSheet();}}
function getSession(p){if(!sessions[p])sessions[p]={lang:"EN",stage:"NEW",lastOpp:"",form:{},data:{}};return sessions[p];}
async function sendText(to,body){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"text",text:{body}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){}}
async function sendImage(to,link,caption){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"image",image:{link,caption}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,caption);}}
async function sendDocument(to,link,filename){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"document",document:{link,filename}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,filename+": "+link);}}
async function sendButtons(to,body,buttons){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"button",body:{text:body},action:{buttons:buttons.map(b=>({type:"reply",reply:{id:b.id,title:b.title.substring(0,20)}}))}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
async function sendList(to,body,buttonText,sections){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"list",body:{text:body},action:{button:buttonText,sections}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
async function sendContactWithCallUrl(to,body){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"cta_url",body:{text:body},action:{name:"cta_url",parameters:{display_text:"Call Now - 8590175977",url:`tel:+918590175977`}}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
function getOppName(id){const map={opp_1:"District Franchisee (10L-15L)",opp_2:"Corporation Franchisee (5L)",opp_3:"Municipality Franchisee (4L)",opp_4:"Business Center - Taxi (1L)",opp_5:"Business Center - Directory (1L)"};return map[id]||id;}
const OPP_MAP={'OPP_1':'District Franchisee (10L-15L)','OPP_2':'Corporation Franchisee (5L)','OPP_3':'Municipality Franchisee (4L)','OPP_4':'Business Center Taxi (1L)','OPP_5':'Business Center Directory (1L)'};
async function sendWelcome(to){const s=getSession(to);await sendImage(to,ASSETS.posters.welcome,getT(s.lang,"welcome"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(s.lang,"tapExplore"),[{id:"LEARN_MORE",title:"Learn More"}]);}
async function sendLanguage(to){await sendButtons(to,"Please select your preferred language:",[{id:"lang_en",title:"English"},{id:"lang_hi",title:"Hindi (हिंदी)"},{id:"lang_ml",title:"Malayalam (മലയാളം)"}]);}
async function sendMainMenu(to){const s=getSession(to);const l=s.lang;await sendList(to,getT(l,"mainMenuTitle"),getT(l,"mainMenuBtn"),[{title:getT(l,"mainMenuBtn"),rows:[{id:"MENU_RIDE",title:getT(l,"ride"),description:getT(l,"rideDesc")},{id:"MENU_BIZDIR",title:getT(l,"bizDir"),description:getT(l,"bizDirDesc")},{id:"MENU_DELIVERY",title:getT(l,"delivery"),description:getT(l,"deliveryDesc")},{id:"MENU_BOOKING",title:getT(l,"booking"),description:getT(l,"bookingDesc")},{id:"MENU_EARN",title:getT(l,"earn"),description:getT(l,"earnDesc")}]}]);}
async function handleRideMenu(to){const l=getSession(to).lang;await sendButtons(to,getT(l,"rideMenu"),[{id:"RIDE_BOOK",title:getT(l,"bookRide")},{id:"RIDE_ATTACH",title:getT(l,"attachVehicle")}]);}
async function handleBookRide(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.customer,getT(l,"customerH")+"\nApp: "+ASSETS.apps.customer);clearPendingChat(to);}
async function handleAttachVehicle(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.driver,getT(l,"driverH")+"\nApp: "+ASSETS.apps.driver);getSession(to).stage="DRIVER_ONBOARD";addReminder(to,"Driver_FreeRecharge");}
async function handleBizDir(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.business,getT(l,"bizDirCaption"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(l,"bizDirChoose"),[{id:"BIZDIR_SEARCH",title:getT(l,"searchBiz")},{id:"BIZDIR_LIST",title:getT(l,"listBiz")}]);}
async function handleDelivery(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.onlineDelivery,getT(l,"deliveryCaption"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(l,"deliveryChoose"),[{id:"DEL_BOOK",title:getT(l,"bookParcel")},{id:"DEL_AGENT",title:getT(l,"registerAgent")}]);}
async function handleBooking(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.onlineBooking,getT(l,"bookingCaption"));await new Promise(r=>setTimeout(r,800));await sendList(to,getT(l,"bookingChoose"),getT(l,"mainMenuBtn"),[{title:getT(l,"bookingChoose"),rows:[{id:"BOOK_ROOM",title:getT(l,"bookRoom")},{id:"BOOK_APPT",title:getT(l,"bookAppt")},{id:"BOOK_CINEMA",title:getT(l,"bookCinema")}]}]);}
async function handleEarnMenu(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.opportunity,getT(l,"earnCaption"));await new Promise(r=>setTimeout(r,800));await sendList(to,getT(l,"earnList"),getT(l,"mainMenuBtn"),[{title:getT(l,"earnList"),rows:[{id:"opp_1",title:"District Franchisee",description:"10L-15L | 5Y | 12M Ads"},{id:"opp_2",title:"Corporation",description:"5L | 3Y | 12M Ads"},{id:"opp_3",title:"Municipality",description:"4L | 3Y | 12M Ads"},{id:"opp_4",title:"Biz Center - Taxi",description:"1L | 1Y | 3M Ads"},{id:"opp_5",title:"Biz Center - Directory",description:"1L | 1Y | 3M Ads"}]}]);}
async function handleOppLevel(to, id){const s=getSession(to);const l=s.lang;s.lastOpp=id.toUpperCase();s.data.level=id.toUpperCase();s.stage="EARN";setPendingChat(to,l,"OPP_"+id+"_VIEWED");await sendImage(to,ASSETS.posters.opportunity,getOppName(id)+"\n"+getT(l,"oppH"));await new Promise(r=>setTimeout(r,600));await sendText(to,(id==="opp_1"?getT(l,"feeCorpDistrict"):id==="opp_2"?getT(l,"feeCorp"):id==="opp_3"?getT(l,"feeMuni"):getT(l,"feeBC"))+"\n\n"+(s.data.level==="OPP_1"?getT(l,"benefitsDistrict"):s.data.level==="OPP_2"||s.data.level==="OPP_3"?getT(l,"benefitsCorp"):getT(l,"benefitsBC")));await new Promise(r=>setTimeout(r,600));await sendButtons(to,getT(l,"watchedQ"),[{id:"VID_YES",title:getT(l,"yes")},{id:"VID_NO",title:getT(l,"no")}]);}
async function handleVideoYes(to){const s=getSession(to);const l=s.lang;await sendButtons(to,s.data.level==="OPP_1"?getT(l,"supportDistrict"):s.data.level==="OPP_2"||s.data.level==="OPP_3"?getT(l,"supportCorp"):getT(l,"supportBC"),[{id:"KNOW_REQ",title:getT(l,"knowReq")}]);}
async function handleReq(to){const s=getSession(to);const l=s.lang;await sendButtons(to,s.data.level==="OPP_1"?getT(l,"reqDistrict"):s.data.level==="OPP_2"||s.data.level==="OPP_3"?getT(l,"reqCorp"):getT(l,"reqBC"),[{id:"SUBMIT_APP",title:getT(l,"submitApp")}]);}
async function handleSubmitApp(to){const l=getSession(to).lang;await sendButtons(to,getT(l,"categoryQ"),[{id:"CORP_YES",title:getT(l,"corpYes")},{id:"CORP_NO",title:getT(l,"corpNo")}]);}
async function handleCategory(to, isCorp){const s=getSession(to);const l=s.lang;let fee=isCorp?getT(l,"feeCorpDistrict"):getT(l,"feeNonCorpDistrict");if(s.data.level==="OPP_2")fee=isCorp?getT(l,"feeCorp"):getT(l,"feeMuni");if(s.data.level==="OPP_3")fee=isCorp?getT(l,"feeMuni"):getT(l,"feeCorp");if(s.data.level==="OPP_4"||s.data.level==="OPP_5")fee=getT(l,"feeBC");s.data.isCorp=isCorp;await sendButtons(to,fee,[{id:"READY_YES",title:getT(l,"readyYes")},{id:"READY_EMI",title:getT(l,"emi")}]);}
async function handleReady(to, isEMI){const l=getSession(to).lang;let msg=getT(l,"payFee")+"\n"+ASSETS.payments.registration;if(isEMI)msg="EMI: 5L Down + 10/20 Months\n"+ASSETS.payments.registration;await sendText(to,msg);await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(l,"payCheck"),[{id:"PAY_YES",title:getT(l,"payYes")},{id:"PAY_NO",title:getT(l,"payNo")}]);setPendingChat(to,l,"EARN_PAYMENT");}
async function handlePayYes(to){const l=getSession(to).lang;getSession(to).stage="FORM_NAME";setPendingChat(to,l,"FORM_NAME");await sendText(to,getT(l,"formName"));}
async function handlePayNo(to){const l=getSession(to).lang;await sendText(to,getT(l,"payFee")+"\n"+ASSETS.payments.registration);}
async function saveDriverReminders(){try{const sheets=await getSheetsClient();if(!sheets)return;await ensureSheetTab(sheets,"DriverReminders");await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID, range:'DriverReminders!A2:F'});const rows=driverReminders.map(r=>[r.phone, r.type, r.claimedAt, r.sent1h, r.sent24h, r.sent48h]);if(rows.length>0)await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID, range:'DriverReminders!A:F', valueInputOption:'USER_ENTERED', requestBody:{values: rows}});}catch(e){}}
async function loadDriverReminders(){try{const sheets=await getSheetsClient();if(!sheets)return [];await ensureSheetTab(sheets,"DriverReminders");const res=await sheets.spreadsheets.values.get({spreadsheetId:SHEET_ID, range:'DriverReminders!A2:F'});const rows=res.data.values||[];return rows.map(r=>({phone:r[0], type:r[1], claimedAt:parseInt(r[2]), sent1h:r[3]==='true', sent24h:r[4]==='true', sent48h:r[5]==='true', sent72h:false, lang:"EN"}));}catch(e){return [];}}
function addReminder(phone,type){driverReminders.push({phone,type,claimedAt:Date.now(),sent1h:false,sent24h:false,sent48h:false,sent72h:false, lang:getSession(phone).lang});saveDriverReminders();}
async function checkReminders(){const now=Date.now();let changed=false;for(let r of driverReminders){const diffH=(now-r.claimedAt)/(1000*60*60);const sessLang=r.lang||"EN";const tt=LANG_TEXT[sessLang]||LANG_TEXT.EN;if(!r.sent1h&&diffH>=1){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver1h+"\n"+ASSETS.apps.driver);await sendContactWithCallUrl(r.phone,tt.grabNow+" - Call "+CONTACT_NUMBER);r.sent1h=true;changed=true;}else if(!r.sent24h&&diffH>=24){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver24h);r.sent24h=true;changed=true;}else if(!r.sent48h&&diffH>=48){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver48h);r.sent48h=true;changed=true;}else if(!r.sent72h&&diffH>=72){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver72h);r.sent72h=true;changed=true;}}if(changed){driverReminders=driverReminders.filter(r=>!r.sent72h);await saveDriverReminders();}}
async function checkPendingChats(){const now=Date.now();for(let phone in pendingChats){const p=pendingChats[phone];const diffMin=(now-p.lastActivity)/(1000*60);const l=p.lang||"EN";const t=LANG_TEXT[l]||LANG_TEXT.EN;try{if(!p.reminders.r1&&diffMin>=10){await sendContactWithCallUrl(phone,t.remLang+" - Left at "+p.stage);p.reminders.r1=true;await savePendingToSheet();}else if(!p.reminders.r2&&diffMin>=30){await sendContactWithCallUrl(phone,"Reminder 30min - "+p.stage+" - "+CONTACT_NUMBER);p.reminders.r2=true;await savePendingToSheet();}else if(!p.reminders.r3&&diffMin>=1440){await sendImage(phone,ASSETS.posters.opportunity,"24h Reminder - "+p.stage);p.reminders.r3=true;await savePendingToSheet();}else if(!p.reminders.r4&&diffMin>=4320){await sendImage(phone,ASSETS.posters.opportunity,"72h Final - "+p.stage);p.reminders.r4=true;await savePendingToSheet();}}catch(e){}}}
setInterval(checkPendingChats,2*60*1000); setInterval(checkReminders,5*60*1000);
app.get('/',(req,res)=>res.send('V9 BIZMAPIA ONLY PROPER SCRIPT LIVE - 5 Services - EN/HI/ML - Sheet:'+SHEET_ID));
app.get('/webhook',(req,res)=>{if(req.query['hub.verify_token']===VERIFY_TOKEN)res.send(req.query['hub.challenge']);else res.sendStatus(403);});
app.post('/webhook',async(req,res)=>{
 try{
  const msg=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];if(!msg)return res.sendStatus(200);
  if(processedIds.has(msg.id))return res.sendStatus(200);processedIds.add(msg.id);
  const from=msg.from;let rawId=msg.type==="interactive"?(msg.interactive.button_reply?.id||msg.interactive.list_reply?.id||""):(msg.text?.body?.trim()||"");let input=rawId.toLowerCase();const rawText=msg.text?.body||"";const s=getSession(from);
  await logAllChat(from,(rawText||rawId||"HI").substring(0,30),"INBOUND",s.lang,"CHAT_RECEIVED",`Raw:${rawText||rawId} stage:${s.stage}`);
  if(s.stage==="FORM_NAME"){s.form.name=rawText.trim();s.stage="FORM_CONTACT";setPendingChat(from,s.lang,"FORM_CONTACT");await sendText(from,getT(s.lang,"formContact"));return res.sendStatus(200);}
  if(s.stage==="FORM_CONTACT"){s.form.contact=rawText.trim();s.stage="FORM_PLACE";setPendingChat(from,s.lang,"FORM_PLACE");await sendText(from,getT(s.lang,"formPlace"));return res.sendStatus(200);}
  if(s.stage==="FORM_PLACE"){s.form.place=rawText.trim();s.stage="FORM_OCCUPATION";setPendingChat(from,s.lang,"FORM_OCCUPATION");await sendList(from,getT(s.lang,"formOcc"),"Select Occupation",[{title:"Occupation",rows:[{id:"occ_running",title:"Running business"},{id:"occ_planning",title:"Planning to start"},{id:"occ_employee",title:"Employee"}]}]);return res.sendStatus(200);}
  if(s.stage==="FORM_OCCUPATION"){
   if(input.startsWith("occ_")){const m={occ_running:"Running business",occ_planning:"Planning to start",occ_employee:"Employee"};s.form.occupation=m[input]||input;}else s.form.occupation=rawText.trim();
   const oppFullName=OPP_MAP[s.lastOpp]||s.lastOpp;const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
   const leadRow=[dateStr,from,'Franchisee_Lead',oppFullName,s.form.name,s.form.contact,s.form.place,s.form.occupation,s.lang];
   await appendToSheet(leadRow);clearPendingChat(from);
   await sendImage(from,ASSETS.posters.welcome,`${getT(s.lang,"thanksEnq")} ${s.form.name}! ${getT(s.lang,"team24")}`);
   let tenderLink=ASSETS.tenders.district; if(s.lastOpp==="OPP_2"||s.lastOpp==="OPP_3") tenderLink=ASSETS.tenders.corp; if(s.lastOpp==="OPP_4"||s.lastOpp==="OPP_5") tenderLink=ASSETS.tenders.bc;
   await new Promise(r=>setTimeout(r,800));await sendDocument(from,tenderLink,`Tender_${s.lastOpp}.pdf`);
   await sendText(from,`${getT(s.lang,"tenderMsg")}\n${tenderLink}\nSlot: ${ASSETS.calendar}`);
   s.stage="MENU";s.form={};return res.sendStatus(200);
  }
  if(input.includes("hi")||input.includes("hello")||input==="learn_more"||s.stage==="NEW"){
   if(input==="learn_more"||rawId==="LEARN_MORE"){s.stage="LANG";setPendingChat(from,s.lang,"LANG_SELECTION");await sendLanguage(from);return res.sendStatus(200);}
   else {s.stage="WELCOME";await sendWelcome(from);return res.sendStatus(200);}
  }
  if(input.startsWith("lang_")){if(input.includes("en"))s.lang="EN";else if(input.includes("hi"))s.lang="HI";else if(input.includes("ml"))s.lang="ML";s.stage="MAIN_MENU";setPendingChat(from,s.lang,"MAIN_MENU");await logAllChat(from,'LANGUAGE_SELECTED','ACTIVE',s.lang,'MAIN_MENU',`Selected ${s.lang}`);await sendMainMenu(from);return res.sendStatus(200);}
  if(rawId==="MENU_RIDE"){await handleRideMenu(from);return res.sendStatus(200);}
  if(rawId==="MENU_BIZDIR"){await handleBizDir(from);return res.sendStatus(200);}
  if(rawId==="MENU_DELIVERY"){await handleDelivery(from);return res.sendStatus(200);}
  if(rawId==="MENU_BOOKING"){await handleBooking(from);return res.sendStatus(200);}
  if(rawId==="MENU_EARN"){await handleEarnMenu(from);return res.sendStatus(200);}
  if(rawId==="RIDE_BOOK"){await handleBookRide(from);return res.sendStatus(200);}
  if(rawId==="RIDE_ATTACH"){await handleAttachVehicle(from);return res.sendStatus(200);}
  if(rawId==="BIZDIR_SEARCH"){await sendText(from,"Search: "+ASSETS.apps.bizDirCustomer);return res.sendStatus(200);}
  if(rawId==="BIZDIR_LIST"){await sendText(from,"List: "+ASSETS.apps.bizDirMerchant);return res.sendStatus(200);}
  if(rawId==="DEL_BOOK"){await sendText(from,"Book Parcel: "+ASSETS.apps.customer);return res.sendStatus(200);}
  if(rawId==="DEL_AGENT"){await sendText(from,"Agent: "+ASSETS.apps.deliveryAgent);return res.sendStatus(200);}
  if(rawId==="BOOK_ROOM"||rawId==="BOOK_APPT"||rawId==="BOOK_CINEMA"){await sendText(from,"Booking App: "+ASSETS.apps.booking);return res.sendStatus(200);}
  if(["opp_1","opp_2","opp_3","opp_4","opp_5"].includes(input)){await handleOppLevel(from,input);return res.sendStatus(200);}
  if(input==="vid_yes"){await handleVideoYes(from);return res.sendStatus(200);}
  if(input==="vid_no"){await sendText(from,getT(s.lang,"watchFirst"));return res.sendStatus(200);}
  if(input==="know_req"){await handleReq(from);return res.sendStatus(200);}
  if(input==="submit_app"){await handleSubmitApp(from);return res.sendStatus(200);}
  if(input==="corp_yes"){await handleCategory(from,true);return res.sendStatus(200);}
  if(input==="corp_no"){await handleCategory(from,false);return res.sendStatus(200);}
  if(input==="ready_yes"){await handleReady(from,false);return res.sendStatus(200);}
  if(input==="ready_emi"){await handleReady(from,true);return res.sendStatus(200);}
  if(input==="pay_yes"){await handlePayYes(from);return res.sendStatus(200);}
  if(input==="pay_no"){await handlePayNo(from);return res.sendStatus(200);}
  if(input==="call_now"){await sendContactWithCallUrl(from,`Call Now - ${CONTACT_NUMBER} Team: ${CONTACT_NUMBER}`);return res.sendStatus(200);}
  if(input==="menu"){await sendMainMenu(from);return res.sendStatus(200);}
  await sendMainMenu(from);res.sendStatus(200);
 }catch(err){console.log("Webhook error:",err.message);res.sendStatus(200);}});
(async()=>{try{pendingChats=await loadPendingFromSheet();driverReminders=await loadDriverReminders();console.log(`V9 READY - ${Object.keys(pendingChats).length} pending + ${driverReminders.length} reminders`);}catch(e){}})();
app.listen(PORT,()=>console.log(`V9 BIZMAPIA ONLY PROPER SCRIPT LIVE on ${PORT}`));
