// ========================================================
// BIZMAPIA - ENTIRE BOT CODE - V24.3 FINAL
// PAN INDIA - ML + EN + HI - All 23 Changes + Back Button
// ========================================================
const RAZORPAY_LINK = "https://rzp.io/l/bizmapia5000";
const SUPPORT_NUMBER = "97784 61515";
const EXCEL_FILE = "franchise_leads.xlsx";

const reminderTimers = {};
let userStates = {};

// -------- LANG DETECT --------
function detectLang(text=""){
  if(/[അ-ഹ]/.test(text)) return 'ml';
  if(/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
}
function sendMessage(userId, text, buttons=[]){
  console.log("SEND", userId, text, buttons);
  // Replace with your WhatsApp API
}
function set5MinReminder(userId, type, data){
  if(reminderTimers[userId]) clearTimeout(reminderTimers[userId]);
  reminderTimers[userId] = setTimeout(()=>{
    if(type==='video') sendVideoReminder(userId, data.lang);
    if(type==='payment') sendPaymentReminder(userId, data);
  }, 5*60*1000);
}
function clearReminder(userId){ if(reminderTimers[userId]) clearTimeout(reminderTimers[userId]); }

// -------- CHANGE 23: BACK BUTTON - ML + EN + HI --------
function getBackButtons(lang){
  const m = {
    ml: {back:"⬅️ മുൻ മെനുവിലേക്ക് പോകുക", main:"🏠 പ്രധാന മെനു", later:"⏰ പിന്നീട് ഓർമ്മിപ്പിക്കുക"},
    en: {back:"⬅️ Go to Previous Menu", main:"🏠 Main Menu", later:"⏰ Remind Later"},
    hi: {back:"⬅️ पिछले मेनू पर जाएं", main:"🏠 मुख्य मेनू", later:"⏰ बाद में याद दिलाएं"}
  };
  const l = m[lang]||m.en;
  return [
    {type:"quick_reply", title:l.back, payload:"GO_BACK"},
    {type:"quick_reply", title:l.main, payload:"MAIN_MENU"},
    {type:"quick_reply", title:l.later, payload:"REMIND_LATER"}
  ];
}
function getSimpleBack(lang){
  const m = {
    ml: {back:"⬅️ മുൻ മെനു", main:"🏠 പ്രധാന മെനു"},
    en: {back:"⬅️ Previous Menu", main:"🏠 Main Menu"},
    hi: {back:"⬅️ पिछला मेनू", main:"🏠 मुख्य मेनू"}
  };
  const l = m[lang]||m.en;
  return [
    {type:"quick_reply", title:l.back, payload:"GO_BACK"},
    {type:"quick_reply", title:l.main, payload:"MAIN_MENU"}
  ];
}

// ===================== ENTIRE BOT - MAIN MENU =====================
function sendMainMenu(userId, lang='en'){
  const msgs = {
    ml:`👋 സ്വാഗതം BizMapia-ലേക്ക് - PAN INDIA
നിങ്ങൾക്ക് എന്ത് വേണം?

🚕 റൈഡ് ബുക്ക് ചെയ്യുക
📦 ഡയറക്ടറി - കടകൾ കണ്ടെത്തുക
📦 ഡെലിവറി സർവീസ്
🏠 ബുക്കിംഗ് & ഫ്രാഞ്ചൈസി അവസരങ്ങൾ

👇 തിരഞ്ഞെടുക്കുക - ഇന്ത്യയിലെവിടെയും പ്രവർത്തിക്കും:`,
    en:`👋 Welcome to BizMapia - PAN INDIA
What do you need?

🚕 Book a Ride
📦 Directory - Find Shops
📦 Delivery Service
🏠 Booking & Franchise Opportunities

👇 Select - Works Anywhere in India:`,
    hi:`👋 BizMapia में आपका स्वागत है - पूरे भारत में
आपको क्या चाहिए?

🚕 राइड बुक करें
📦 डायरेक्टरी - दुकानें खोजें
📦 डिलीवरी सेवा
🏠 बुकिंग और फ्रैंचाइज़ी अवसर

👇 चुनें - पूरे भारत में काम करता है:`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"quick_reply", title: lang==='ml'?"🚕 റൈഡ്": lang==='hi'?"🚕 राइड":"🚕 Ride", payload:"RIDE"},
    {type:"quick_reply", title: lang==='ml'?"📦 ഡയറക്ടറി": lang==='hi'?"📦 डायरेक्टरी":"📦 Directory", payload:"DIRECTORY"},
    {type:"quick_reply", title: lang==='ml'?"🏠 ഫ്രാഞ്ചൈസി": lang==='hi'?"🏠 फ्रैंचाइज़ी":"🏠 Franchise", payload:"FRANCHISE"},
    {type:"quick_reply", title:"📞 97784 61515", payload:"CALL_SUPPORT"}
  ]);
}

// ===================== FRANCHISE INTRO =====================
function sendFranchiseIntro(userId, lang){
  const msgs = {
    ml:`ഫ്രാഞ്ചൈസി അവസരങ്ങൾ - നിങ്ങളുടെ ജില്ലയിൽ ബിസിനസ്സ് തുടങ്ങൂ! - PAN INDIA

ചുവടെയുള്ള ലിങ്കിൽ നിങ്ങളുടെ ജില്ലയുണ്ടോ എന്ന് നോക്കൂ - ഇല്ലെങ്കിൽ കോർപ്പറേഷൻ ഫ്രാഞ്ചൈസി എടുക്കാം.
ഇന്ത്യയിലെവിടെയും ഈ മോഡൽ പ്രവർത്തിക്കും!

👇 തിരഞ്ഞെടുക്കുക:`,
    en:`Franchise Opportunities - Start Business in Your District! - PAN INDIA
Check link below if your district is available - else you can take Corporation Franchise.
This model works anywhere in India!
👇 Select:`,
    hi:`फ्रैंचाइज़ी अवसर - अपने जिले में व्यवसाय शुरू करें! - पूरे भारत में
नीचे लिंक में देखें कि आपका जिला उपलब्ध है या नहीं - नहीं तो कॉर्पोरेशन फ्रैंचाइज़ी ले सकते हैं।
यह मॉडल पूरे भारत में काम करता है!
👇 चुनें:`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"quick_reply", title: lang==='ml'?"ബിസിനസ്സ് അവസരങ്ങൾ": lang==='hi'?"व्यापार के अवसर":"Business Opportunities", payload:"BUSINESS_OPPS"},
   ...getSimpleBack(lang),
    {type:"quick_reply", title:"📞 97784 61515", payload:"CALL_SUPPORT"}
  ]);
}

function sendBusinessOpps(userId, lang){
  const msgs = {
    ml:`കമ്പനിയെക്കുറിച്ചു കൂടുതൽ അറിയാൻ താഴെ ക്ലിക്ക് ചെയ്യൂ. ലെവൽ, വരുമാനം, സപ്പോർട്ട് എല്ലാം ഉണ്ട്. PAN INDIA മോഡൽ!`,
    en:`Know more about company - Level, Income, Support - Click below. PAN INDIA Model!`,
    hi:`कंपनी के बारे में अधिक जानें - लेवल, आय, सपोर्ट - नीचे क्लिक करें। पूरे भारत में मॉडल!`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"quick_reply", title: lang==='ml'?"ലെവൽ വിവരങ്ങൾ": lang==='hi'?"लेवल जानकारी":"Level Info", payload:"LEVEL_INFO"},
   ...getSimpleBack(lang)
  ]);
}

function sendLevelInfo(userId, lang){
  const msgs = {
    ml:`ലെവൽ 1: ജില്ലാ ഫ്രാഞ്ചൈസി - 10-15L - 5Y MOU - All India-യിൽ നിങ്ങളുടെ ജില്ല സുരക്ഷിതം!
ലെവൽ 2: കോർപ്പറേഷൻ ഫ്രാഞ്ചൈസി - കുറഞ്ഞ നിക്ഷേപം!`,
    en:`Level 1: District Franchise - 10-15L - 5Y MOU - Your district secured PAN INDIA!
Level 2: Corporation Franchise - Lower Investment!`,
    hi:`लेवल 1: जिला फ्रैंचाइज़ी - 10-15L - 5 साल MOU - आपका जिला पूरे भारत में सुरक्षित!
लेवल 2: कॉर्पोरेशन फ्रैंचाइज़ी - कम निवेश!`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"quick_reply", title: lang==='ml'?"ജില്ലാ ഫ്രാഞ്ചൈസി ഫീസ്": lang==='hi'?"जिला फ्रैंचाइज़ी फीस":"District Fee", payload:"DISTRICT_FEE"},
   ...getSimpleBack(lang)
  ]);
}

// ===================== DISTRICT FEE 10-15L =====================
function sendDistrictFee(userId, lang){
  const msgs = {
    ml:`💰 ജില്ലാ ഫ്രാഞ്ചൈസി ഫീസ്: 10 - 15 ലക്ഷം (ജില്ല അനുസരിച്ച്) - PAN INDIA
✅ 5 വർഷ MOU ✅ 12 മാസം മാർക്കറ്റിംഗ് ✅ ഏരിയ ലോക്ക് - All India സുരക്ഷിതം
EMI ലഭ്യമാണ് - 5L ഡൗൺ + ബാക്കി EMI!`,
    en:`💰 District Franchise Fee: 10-15 Lakhs (As per district) - PAN INDIA
✅ 5 Year MOU ✅ 12 Months Marketing ✅ Area Lock Secured PAN INDIA
EMI Available - 5L Down + Rest EMI!`,
    hi:`💰 जिला फ्रैंचाइज़ी फीस: 10-15 लाख (जिले के अनुसार) - पूरे भारत में
✅ 5 साल MOU ✅ 12 महीने मार्केटिंग ✅ एरिया लॉक पूरे भारत में सुरक्षित
EMI उपलब्ध - 5L डाउन + बाकी EMI!`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"quick_reply", title: lang==='ml'?"EMI ഓപ്ഷൻ": lang==='hi'?"EMI विकल्प":"EMI Options", payload:"SHOW_EMI"},
    {type:"url", title: lang==='ml'?"💳 പേയ്മെന്റ് ചെയ്യൂ": lang==='hi'?"💳 भुगतान करें":"💳 Pay Now", url: RAZORPAY_LINK},
   ...getSimpleBack(lang)
  ]);
}

// ===================== CHANGE 17: SUPPORT - മുന്നൊരുക്കങ്ങൾ =====================
function sendDistrictSupport(userId, lang){
  const msgs = {
    ml:`ജില്ലാ ഫ്രാഞ്ചൈസി സപ്പോർട്ട് - PAN INDIA:
1. 12 മാസം മാർക്കറ്റിംഗ് - കമ്പനി നിങ്ങളുടെ പരസ്യത്തിന് കൂടുതൽ ഊന്നൽ നൽകും
2. 6 മാസം വാടക സഹായം*
3. 6 മാസം ശമ്പളം സഹായം*
4. ഫുൾ ട്രെയിനിംഗ് + പിന്തുണ സഹായം
ഈ സപ്പോർട്ടോടെ മികച്ച വരുമാനം! ഇന്ത്യയിലെവിടെയും!
👇 മുന്നൊരുക്കങ്ങൾ കാണുക:`,
    en:`District Franchise Support - PAN INDIA:
1. 12 Months Marketing - Extra push to YOUR ads
2. 6 Months Rent Support*
3. 6 Months Salary Support*
4. Full Training + Support
Start earning daily/monthly! Works anywhere in India!
👇 View Preparations:`,
    hi:`जिला फ्रैंचाइज़ी सपोर्ट - पूरे भारत में:
1. 12 महीने मार्केटिंग - कंपनी आपके विज्ञापन पर ज्यादा फोकस करेगी
2. 6 महीने किराया सहायता*
3. 6 महीने सैलरी सहायता*
4. फुल ट्रेनिंग + सपोर्ट
इस सपोर्ट के साथ बेहतरीन कमाई शुरू करें!
👇 तैयारी देखें:`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"quick_reply", title: lang==='ml'?"മുന്നൊരുക്കങ്ങൾ": lang==='hi'?"तैयारी देखें":"Preparations", payload:"PREPARATION_LIST"},
   ...getSimpleBack(lang),
    {type:"quick_reply", title:"📞 97784 61515", payload:"CALL_SUPPORT"}
  ]);
}

// ===================== CHANGE 18: EMI =====================
function sendEMIOptions(userId, lang){
  const msgs = {
    ml:`💳 EMI ഓപ്ഷൻ - 2 ഓപ്ഷനുകൾ - PAN INDIA:
15L വലിയ തുക - അതിനാൽ EMI - 5L ഡൗൺ + ബാക്കി 10/20 മാസത്തിൽ!
പ്ലാൻ 1: 10 മാസം - ഡൗൺ 5L + 1L x10M =15L
പ്ലാൻ 2: 20 മാസം - ഡൗൺ 5L + 50k x20M =15L
രണ്ടിനും അതേ MOU!
👇 Choose your EMI:`,
    en:`💳 EMI Options - 2 Options - PAN INDIA:
Total 15L - So EMI - 5L Down + Rest in 10 or 20 months!
Plan 1: 10M - Down 5L + 1L x10 =15L - Fast
Plan 2: 20M - Down 5L + 50k x20 =15L - Low EMI
Same MOU & Support!
👇 Choose your EMI:`,
    hi:`💳 EMI विकल्प - 2 विकल्प - पूरे भारत में:
कुल 15L - इसलिए EMI - 5L डाउन + बाकी 10/20 महीने में!
प्लान 1: 10 महीने - डाउन 5L + 1L x10 =15L
प्लान 2: 20 महीने - डाउन 5L + 50k x20 =15L
दोनों में समान MOU!
👇 अपना EMI चुनें:`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"quick_reply", title:"Plan 1: 10M - 1L/Month", payload:"EMI_PLAN_1"},
    {type:"quick_reply", title:"Plan 2: 20M - 50K/Month", payload:"EMI_PLAN_2"},
   ...getSimpleBack(lang),
    {type:"quick_reply", title:"📞 97784 61515", payload:"CALL_SUPPORT"}
  ]);
}

// ===================== CHANGE 19-20: PAYMENT =====================
function sendPaymentMessage(userId, lang, plan=""){
  const msgs = {
    ml:`✅ ഡൗൺ പേയ്മെന്റിന് ശേഷം - PAN INDIA:
- ഏരിയ ലോക്ക് - All India-യിൽ മറ്റാർക്കും ലഭിക്കില്ല
- 5Y MOU - മാർക്കറ്റിംഗ് തുടങ്ങും - മാസം 1 മുതൽ വരുമാനം
⚠️ ഏരിയ ലോക്ക് ചെയ്യാൻ പേയ്മെന്റ് പ്രധാനം
👇 ഇപ്പോൾ ഡൗൺ പേയ്മെന്റ് അടച്ച് ലോക്ക് ചെയ്യൂ: ${plan}`,
    en:`✅ After Down Payment - PAN INDIA:
- Area LOCKED - No one else in All India can take it
- 5Y MOU - Marketing starts - Earn from Month 1
⚠️ Payment important to lock area
👇 Lock now with down payment: ${plan}`,
    hi:`✅ डाउन पेमेंट के बाद - पूरे भारत में:
- एरिया लॉक - पूरे भारत में कोई और नहीं ले सकता
- 5 साल MOU - मार्केटिंग शुरू - महीने 1 से कमाई
⚠️ एरिया लॉक करने के लिए भुगतान जरूरी
👇 अभी डाउन पेमेंट करके लॉक करें: ${plan}`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"url", title: lang==='ml'?"💳 ഇപ്പോൾ പേയ്മെന്റ് ചെയ്യൂ - ലോക്ക് ചെയ്യുക": lang==='hi'?"💳 अभी भुगतान करें - लॉक करें":"💳 Pay Now - Lock Area", url: RAZORPAY_LINK},
   ...getBackButtons(lang)
  ]);
  set5MinReminder(userId, 'payment', {lang, plan});
}

function sendPaymentReminder(userId, data){
  const lang=data.lang||'en';
  const msgs = {
    ml:`⏰ പേയ്മെന്റ് ചെയ്തോ? - 5 മിനിറ്റ് ആയി! ഏരിയ മറ്റൊരാൾക്ക് ലഭിക്കും - All India! ദയവായി ഇപ്പോൾ അടക്കൂ.`,
    en:`⏰ Did you pay? - 5 minutes passed! Your area may go to someone else - PAN INDIA! Please pay now.`,
    hi:`⏰ क्या आपने भुगतान किया? - 5 मिनट हो गए! आपका एरिया किसी और को मिल सकता है - पूरे भारत में! कृपया अभी भुगतान करें।`
  };
  sendMessage(userId, msgs[lang], [
    {type:"quick_reply", title: lang==='ml'?"✅ അതെ, ചെയ്തു": lang==='hi'?"✅ हाँ, किया":"✅ Yes, Paid", payload:"PAYMENT_DONE"},
    {type:"url", title: lang==='ml'?"💳 ഇപ്പോൾ അടക്കൂ": lang==='hi'?"💳 अभी भुगतान करें":"💳 Pay Now", url: RAZORPAY_LINK},
   ...getBackButtons(lang)
  ]);
}

// ===================== VIDEO + 5 MIN =====================
function sendVideoMessage(userId, lang){
  const msgs = {
    ml:`📹 2 മിനിറ്റ് വീഡിയോ കാണൂ - ഇന്ത്യ മുഴുവൻ പ്രവർത്തിക്കുന്ന മോഡൽ!`,
    en:`📹 Watch 2 min video - Model works all over India!`,
    hi:`📹 2 मिनट का वीडियो देखें - मॉडल पूरे भारत में काम करता है!`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"url", title:"▶️ Watch Video", url:"https://your-video.com"},
   ...getSimpleBack(lang)
  ]);
  set5MinReminder(userId, 'video', {lang});
}
function sendVideoReminder(userId, lang){
  const msgs = {
    ml:`⏰ വീഡിയോ കണ്ടോ? - 5 മിനിറ്റ് ആയി!`,
    en:`⏰ Did you watch video? - 5 minutes passed!`,
    hi:`⏰ क्या वीडियो देखा? - 5 मिनट हो गए!`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"quick_reply", title:"✅ Watched", payload:"VIDEO_WATCHED"},
    {type:"quick_reply", title:"▶️ Watch Again", payload:"RESEND_VIDEO"},
   ...getBackButtons(lang)
  ]);
}

// ===================== FIX "ഇല്ല" =====================
function handleNoResponse(userId, lang){
  const msgs = {
    ml:`ചുവടെയുള്ള ലിങ്കിൽ ജില്ലയുണ്ടോ എന്ന് നോക്കൂ - ഇല്ലെങ്കിൽ കോർപ്പറേഷൻ ഫ്രാഞ്ചൈസി എടുക്കാം. All India ലഭ്യം!`,
    en:`Check link if your district available - else you can take Corporation Franchise. Available PAN INDIA!`,
    hi:`नीचे लिंक में देखें कि आपका जिला उपलब्ध है या नहीं - नहीं तो कॉर्पोरेशन फ्रैंचाइज़ी ले सकते हैं। पूरे भारत में उपलब्ध!`
  };
  sendMessage(userId, msgs[lang]||msgs.en, [
    {type:"url", title:"🔗 District List", url:"https://district-list.com"},
    {type:"quick_reply", title:"Corporation Franchise", payload:"CORP_FRANCHISE"},
   ...getSimpleBack(lang)
  ]);
}

// ===================== AFTER PAYMENT 4 STEPS + DATE → EXCEL =====================
function handlePaymentDone(userId, lang){
  clearReminder(userId);
  userStates[userId] = {step:1, data:{}, lang:lang, history:[]};
  const msgs = {
    ml:`✅ പേയ്മെന്റ് സ്ഥിരീകരണം! All India-യിൽ ഏരിയ ലോക്ക് ചെയ്തു!
📋 ഘട്ടം 1/4: ആധാർ പ്രകാരമുള്ള മുഴുവൻ പേര്:`,
    en:`✅ Payment Confirmed! Area locked PAN INDIA!
📋 Step 1/4: Enter full name as per Aadhaar:`,
    hi:`✅ भुगतान की पुष्टि हुई! एरिया पूरे भारत में लॉक हो गया!
📋 चरण 1/4: आधार के अनुसार पूरा नाम दर्ज करें:`
  };
  sendMessage(userId, msgs[lang]||msgs.en, getSimpleBack(lang));
}

function handleOnboarding(userId, text, lang){
  const s=userStates[userId]; if(!s) return;
  const curLang=s.lang;

  if(s.step===1){ s.data.name=text; s.history.push(1); s.step=2;
    sendMessage(userId, curLang==='ml'?`📋 ഘട്ടം 2/4: ഏത് ജില്ല / നഗരം? (All India)` : curLang==='hi'?`📋 चरण 2/4: कौन सा जिला / शहर? (पूरे भारत में)`:`📋 Step 2/4: Which district/city? (PAN INDIA)`, getSimpleBack(curLang));
  }else if(s.step===2){ s.data.district=text; s.history.push(2); s.step=3;
    sendMessage(userId, curLang==='ml'?`📋 ഘട്ടം 3/4: ജോലി / അനുഭവം?` : curLang==='hi'?`📋 चरण 3/4: नौकरी / अनुभव?`:`📋 Step 3/4: Current job/experience?`, getSimpleBack(curLang));
  }else if(s.step===3){ s.data.experience=text; s.history.push(3); s.step=4;
    const msg = curLang==='ml'?`📋 ഘട്ടം 4/4: നിക്ഷേപത്തിന് തയ്യാറാണോ? എപ്പോൾ തുടങ്ങാം? 👇 തീയതി തിരഞ്ഞെടുക്കുക:` : curLang==='hi'?`📋 चरण 4/4: निवेश के लिए तैयार हैं? कब शुरू कर सकते हैं? 👇 तारीख चुनें:`:`📋 Step 4/4: Ready to invest? When can you start? 👇 Select date:`;
    sendMessage(userId, msg, [
      {type:"quick_reply", title: curLang==='ml'?"📅 ഇന്ന് തന്നെ": curLang==='hi'?"📅 आज ही":"📅 Today", payload:"DATE_TODAY"},
      {type:"quick_reply", title: curLang==='ml'?"📅 നാളെ": curLang==='hi'?"📅 कल":"📅 Tomorrow", payload:"DATE_TOMORROW"},
      {type:"quick_reply", title: curLang==='ml'?"📅 ഈ ആഴ്ച": curLang==='hi'?"📅 इस सप्ताह":"📅 This Week", payload:"DATE_THIS_WEEK"},
      {type:"quick_reply", title: curLang==='ml'?"📅 അടുത്ത ആഴ്ച": curLang==='hi'?"📅 अगले सप्ताह":"📅 Next Week", payload:"DATE_NEXT_WEEK"},
      {type:"quick_reply", title: curLang==='ml'?"📅 ഈ മാസം": curLang==='hi'?"📅 इस महीने":"📅 This Month", payload:"DATE_THIS_MONTH"},
      {type:"quick_reply", title: curLang==='ml'?"📅 Custom": curLang==='hi'?"📅 कस्टम":"📅 Custom Date", payload:"DATE_CUSTOM"},
     ...getBackButtons(curLang)
    ]);
  }
}

function handleDate(userId, dateVal){
  const s=userStates[userId]; if(!s) return;
  const finalData={whatsapp:userId, name:s.data.name, district:s.data.district, experience:s.data.experience, investment_date:dateVal, language:s.lang, timestamp:new Date().toISOString(), status:"Pending Manual Confirmation - PAN INDIA"};
  saveToExcel(finalData);
  sendMessage(userId, s.lang==='ml'?`✅ നന്ദി ${s.data.name}! തീയതി: ${dateVal}\nടീം 24h-ൽ വിളിക്കും - 📞 ${SUPPORT_NUMBER}` : s.lang==='hi'?`✅ धन्यवाद ${s.data.name}! तारीख: ${dateVal}\nटीम 24 घंटे में कॉल करेगी - 📞 ${SUPPORT_NUMBER}`:`✅ Thanks ${s.data.name}! Date: ${dateVal}\nTeam will call in 24h - 📞 ${SUPPORT_NUMBER}`, getSimpleBack(s.lang));
  delete userStates[userId];
}

function saveToExcel(d){
  try{ const XLSX=require('xlsx'); const fs=require('fs'); let wb, ws; if(fs.existsSync(EXCEL_FILE)){ wb=XLSX.readFile(EXCEL_FILE); ws=wb.Sheets[wb.SheetNames[0]]; }else{ wb=XLSX.utils.book_new(); ws=XLSX.utils.json_to_sheet([]); XLSX.utils.book_append_sheet(wb,ws,"Leads"); } const j=XLSX.utils.sheet_to_json(ws); j.push(d); const n=XLSX.utils.json_to_sheet(j); wb.Sheets[wb.SheetNames[0]]=n; XLSX.writeFile(wb,EXCEL_FILE); }catch(e){ require('fs').appendFileSync('backup.txt', JSON.stringify(d)+"\n"); }
}

function handleGoBack(userId){
  const s=userStates[userId]; if(!s||s.history.length===0){ sendMainMenu(userId, s?.lang||'en'); return; }
  const prev=s.history.pop(); s.step=prev;
  sendMessage(userId, `⬅️ Go Back - Step ${prev}/4 again:`, getSimpleBack(s.lang));
}
function handleRemindLater(userId){ sendMessage(userId, `⏰ Okay, will remind after 30 min!`); setTimeout(()=>{ const s=userStates[userId]; if(s&&s.step===4) sendMessage(userId, `⏰ Reminder: Select investment date!`, getBackButtons(s.lang)); else sendPaymentReminder(userId, {lang:s?.lang||'en'}); }, 30*60*1000); }

// ===================== ROUTER - ENTIRE =====================
function onMessage(userId, text, payload){
  const lang=detectLang(text+" "+(payload||""));
  if(payload==="GO_BACK") handleGoBack(userId);
  else if(payload==="MAIN_MENU") sendMainMenu(userId, lang);
  else if(payload==="REMIND_LATER") handleRemindLater(userId);
  else if(payload==="FRANCHISE"||text.toLowerCase().includes("franchise")||text.includes("ഫ്രാഞ്ചൈസി")) sendFranchiseIntro(userId, lang);
  else if(payload==="BUSINESS_OPPS") sendBusinessOpps(userId, lang);
  else if(payload==="LEVEL_INFO") sendLevelInfo(userId, lang);
  else if(payload==="DISTRICT_FEE") sendDistrictFee(userId, lang);
  else if(payload==="SHOW_EMI") sendEMIOptions(userId, lang);
  else if(payload?.startsWith("EMI_PLAN")) sendPaymentMessage(userId, lang, payload);
  else if(payload==="PAYMENT_DONE") handlePaymentDone(userId, lang);
  else if(payload?.startsWith("DATE_")) handleDate(userId, payload.replace("DATE_",""));
  else if(payload==="VIDEO_WATCHED"){ clearReminder(userId); sendDistrictSupport(userId, lang); }
  else if(text.trim()==="ഇല്ല"||payload==="NO") handleNoResponse(userId, lang);
  else if(userStates[userId]) handleOnboarding(userId, text, lang);
  else sendMainMenu(userId, lang);
}

module.exports={onMessage};
