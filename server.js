// V17 FINAL - FIXED REMINDER SHOWS WHAT USER DID LAST + ALL PREVIOUS FIXES
const express=require('express');const bodyParser=require('body-parser');const axios=require('axios');const fs=require('fs');const {google}=require('googleapis');const app=express();app.use(bodyParser.json());
const VERIFY_TOKEN=process.env.VERIFY_TOKEN||"bizmapia_verify_2024";
const TOKEN=process.env.WHATSAPP_TOKEN;const PHONE_NUMBER_ID=process.env.PHONE_NUMBER_ID;const PORT=process.env.PORT||10000;
const SHEET_ID=(process.env.GOOGLE_SHEET_ID||"1MnPTAMafVTuSX2uQKCpP6GKKadQBLXfrgnySigY8cHY").trim();
const CONTACT_NUMBER="8590175977";
console.log("========== V17 FINAL - REMINDER WITH LAST ACTION ==========");

const ASSETS={
 posters:{welcome:"https://files.catbox.moe/zmj6te.jpg",customer:"https://files.catbox.moe/nbjslu.jpg",driver:"https://files.catbox.moe/2trzp7.jpg",business:"https://files.catbox.moe/sylcqa.jpg",opportunity:"https://files.catbox.moe/y8m3lq.jpg",freeRecharge:"https://files.catbox.moe/c03g3q.jpg",franchiseBrochure:"https://files.catbox.moe/FRANCHISEE-NEW-BIZMAPIA.jpg",businessBrochure:"https://files.catbox.moe/BUSINESS-NEW-BIZMAPIA.jpg",onlineDelivery:"https://bizmapia.com/posters/online-delivery.jpg",onlineBooking:"https://bizmapia.com/posters/online-booking.jpg"},
 apps:{customer:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia",driver:"https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia_driver",bizDirCustomer:"https://play.google.com/store/apps/details?id=com.bizmapia.directory.customer",bizDirMerchant:"https://play.google.com/store/apps/details?id=com.bizmapia.directory.merchant",deliveryAgent:"https://play.google.com/store/apps/details?id=com.bizmapia.delivery",booking:"https://play.google.com/store/apps/details?id=com.bizmapia.booking"},
 videos:{main_opp:"https://youtu.be/8ZnDlvbgG_c",opp_1:"https://youtu.be/_y2JeFHBnqg",opp_2:"https://youtu.be/GqolfqgHiCU",opp_3:"https://youtu.be/GqolfqgHiCU",opp_4:"https://youtu.be/r0X77XfmF94",opp_5:"https://youtu.be/r0X77XfmF94"},
 tenders:{district:"https://bizmapia.com/tenders/district.pdf",corp:"https://bizmapia.com/tenders/corporation.pdf",bc:"https://bizmapia.com/tenders/business_center.pdf"},
 payments:{registration:"https://rzp.io/l/bizmapia5000"},calendar:"https://calendly.com/bizmapia/agreement"
};

const LANG_TEXT={
 EN:{
  welcome:"🎉 Welcome to Bizmapia - ALL INDIA Super App!\n\n✅ Cheapest Taxi/Auto/Bike - 10% Discount\n✅ Find 1000+ Local Businesses Near You\n✅ Fast Parcel Delivery in 2 Hours\n✅ Hotel/Doctor/Cinema Booking\n✅ Earn 1-15 Lakhs Monthly with Franchise\n\n👇 Tap Learn More to start",
  tapExplore:"👇 Tap to see services:", mainMenuTitle:"👋 Hello! What do you need today?\n\n🚕 RIDE - Need taxi? Or Have vehicle to earn?\n📍 DIRECTORY - Search business OR List your shop & get customers\n📦 DELIVERY - Send parcel OR Become agent & earn\n🏨 BOOKING - Rooms, Doctor, Cinema\n💰 FRANCHISE - Start your own business, earn monthly\n\n👉 Choose one below:", mainMenuBtn:"Menu",
  ride:"Ride Service", rideDesc:"Book ride OR Earn with vehicle", bizDir:"Biz Directory", bizDirDesc:"Search OR List business & get calls", delivery:"Delivery", deliveryDesc:"Send parcel OR Earn as agent", booking:"Booking", bookingDesc:"Rooms, Doctor, Cinema booking", earn:"Franchise", earnDesc:"Start business, earn 1L-15L",
  rideMenu:"🚕 BIZMAPIA RIDE - ALL INDIA!\n👉 CUSTOMER: Need ride? LOWEST fare + 10% Discount + 24/7\n👉 DRIVER: Have vehicle? Attach & Earn ₹1000-2000 Daily + 1-Year FREE Recharge!\n\n👇 What do you want?", bookRide:"Book Ride", attachVehicle:"Attach Vehicle",
  customerH:"✅ CUSTOMER - CHEAPEST RIDE!\n🔹 Lowest Fare\n🔹 Extra 10% Discount\n🔹 24/7 All India\nHOW TO BOOK:\n1. Click App Link 👇\n2. Install App\n3. Register\n4. Book instantly\n\n👇 Download Now:", driverH:"💰 DRIVER - EARN ₹1000-2000 DAILY!\n🔹 1-Year FREE Recharge - Zero Commission!\n🔹 Daily Payment\n🎁 LIMITED: Free Recharge 1 Year!\nHOW TO START:\n1. Click App Link 👇\n2. Install Driver App\n3. Upload RC, License\n4. Start TODAY!\n\n👇 Register Now:",
  bizDirCaption:"📍 BIZ DIRECTORY!\n👉 CUSTOMER: Search ANY business\n👉 OWNER: List shop FREE, get 100s calls daily, grow 3X!\n\n👇 Choose:", bizDirChoose:"👇 Select one:", searchBiz:"Search Biz", listBiz:"List My Biz",
  deliveryCaption:"📦 FAST DELIVERY - 2 HOUR!\n👉 SEND PARCEL? Pickup from home & deliver in 2h\n👉 EARN? Become Agent, earn ₹30-50 per delivery\n\n👇 Select:", deliveryChoose:"👇 Choose:", bookParcel:"Send Parcel", registerAgent:"Earn as Agent",
  bookingCaption:"🏨 ONE APP FOR ALL BOOKINGS!\n✅ Hotel Rooms - Lowest Price\n✅ Doctor, Salon - Instant Appointment\n✅ Cinema - 10 secs\n\n👇 What to book?", bookingChoose:"👇 Select booking:", bookRoom:"Room", bookAppt:"Appointment", bookCinema:"Cinema",
  earnCaption:"💰 BIZMAPIA FRANCHISE - YOUR OWN BUSINESS!\n🔹 DISTRICT (10-15L) - Full district control, earn from ALL, 5Y MOU, Marketing+Rent+Salary Support\n🔹 CORP/MUNI (4-5L) - City control, earn from BC, 3Y MOU\n🔹 BC (1L) - Low investment, earn from Taxi+Directory, 1Y MOU\nAbout Bizmapia:", earnList:"👇 Select earning level:", highEarn:"District - 10L", highDesc:"Full district, 5Y MOU", modEarn:"Corp/Muni - 4L", modDesc:"City control, 3Y MOU", baseEarn:"BC - 1L", baseDesc:"Low investment, 1Y MOU",
  videoExplain:"📹 IMPORTANT: Watch this 2-min video to understand earning, support & MOU:", videoInstruction:"👆 Click link above, watch full video, then click Yes.",
  watchedQ:"✅ Did you watch FULL video?", yes:"Yes Watched", no:"Not Yet", watchFirst:"⚠️ Please watch FULL 2-min video first:",
  benefitsDistrict:"💰 DISTRICT - WHY TOP LEVEL & HIGHEST EARNING?\n1. 👑 EXCLUSIVE BOSS OF FULL DISTRICT\n2. 💸 PASSIVE INCOME - Earn % from EVERY Corp/Muni & BC - Earn even when you sleep!\n3. 📜 5-YEAR MOU\n4. 🚀 Top District earning 2-3 Lakhs monthly\n\n👇 Want support? Click 'See Support':",
  benefitsCorp:"💰 CORP/MUNI BENEFITS:\n1. 🏙️ CONTROL YOUR CITY\n2. 💰 Earn % from all BC under you\n3. 📜 3-Year MOU\n4. 📈 Earning 50k-1L monthly\n\n👇 Want support?", benefitsBC:"💰 BC (1 LAKH) - LOW INVESTMENT:\n1. Only 1 Lakh\n2. 1-Year MOU - Upgrade later\n3. Earn from Taxi + Directory\n\n👇 Want support?",
  knowSupport:"🎁 See Support", supportDistrict:"🎁 DISTRICT SUPPORT (Worth Lakhs!):\n1. 📢 12 MONTHS MARKETING\n2. 🏢 6 MONTHS RENT\n3. 👨‍💼 6 MONTHS SALARY\n4. 🎓 FULL TRAINING + MANAGER\n\n👇 Now see what is required - Click 'See Requirements':",
  supportCorp:"🎁 CORP SUPPORT:\n1. 12 Months Marketing\n2. 6 Months Rent\n3. 6 Months Salary\n4. Full Training\n\n👇 See requirements:", supportBC:"🎁 BC SUPPORT:\n1. 3 Months Marketing\n2. Full Training\n3. App Support\n\n👇 See requirements:",
  knowReq:"📋 See Requirements", reqDistrict:"📋 DISTRICT REQUIREMENTS:\n\nTo start District, you need 3 things (Very easy):\n1. 🏢 SPACE: 100 sq.ft commercial space\n2. 👨‍💼 STAFF: 1 full-time staff - Company helps\n3. 💻 EQUIPMENT: Laptop, Phone, Internet\n\nIf you have these 3, YOU ARE ELIGIBLE! Company gives remaining support!\n\n👇 If you have these, Click 'Apply Now':",
  reqCorp:"📋 CORP REQUIREMENTS:\n1. SPACE: 50 sq.ft office/shop\n2. STAFF: 1 full-time\n3. Laptop, Phone, Internet\n\nIf you have this, you can start!\n👇 Apply Now:", reqBC:"📋 BC REQUIREMENTS:\n1. SPACE: 50 sq.ft shop\n2. Phone & Internet\n\nIf you have 50 sq.ft shop, you can start TODAY!\n👇 Apply Now:",
  submitApp:"✅ Yes, I Have - Apply Now", categoryQ:"📍 IMPORTANT QUESTION - To Decide Fee & Area:\nIs your DISTRICT a Corporation district? Does your district have Corporation city?\nExample: Ernakulam - Has Kochi Corporation - So YES\nIdukki - No Corporation - So NO\n\nWhy ask? Corp district more population, more earning - Fee 15L. Non-Corp fee 10L but FULL district control with same 5Y MOU!\n\n👇 Select:", corpLocQ:"📍 Is your LOCATION inside Corporation city? Or outside?\nInside Corp fee 5L, Outside Muni fee 4L - Both same 3Y MOU!\n\n👇 Is your location INSIDE?", bcLocQ:"📍 Is your BC location in Corp or Muni?\nFee same 1L for both\n\n👇 Your BC location is in?",
  corpYes:"Yes, Has Corp", corpNo:"No, No Corp",
  feeCorpDistrict:"💰 CORP DISTRICT FEE: Rs 15 Lakhs - WHY 15L?\nCorp district = BIGGER population = MORE Business Centers = MORE Earning!\nWhat you get:\n✅ Full District Control\n✅ 5-Year MOU\n✅ 12M Marketing + 6M Rent + Salary\n✅ Highest Earning - 2-3L monthly\nInvestment for BIG business!\n\n👇 If ready, choose payment option:",
  feeNonCorpDistrict:"💰 NON-CORP DISTRICT FEE: Rs 10 Lakhs - LOWER INVESTMENT, SAME BENEFITS!\nWhat you get:\n✅ Full District Control\n✅ Same 5-Year MOU\n✅ Same Support\n✅ Earning 1-2L monthly\n✅ Save 5 Lakhs!\n\n👇 Ready with 10L?",
  feeCorp:"💰 CORPORATION FEE: Rs 5 Lakhs - CITY BOSS!\n✅ Full Corporation Control\n✅ 3-Year MOU\n✅ 12M Marketing + Rent + Salary\n✅ Earning 50k-1L monthly\n\n👇 Ready?", feeMuni:"💰 MUNICIPALITY FEE: Rs 4 Lakhs\n✅ Full Municipality Control\n✅ Same 3-Year MOU\n✅ Same Support\n✅ Earning 30k-70k\n\n👇 Ready with 4L?", feeBC:"💰 BC FEE: Rs 1 Lakh ONLY\n✅ Your area BC - 2-3 km radius\n✅ 1-Year MOU\n✅ 3 Months Marketing + Training\n✅ Earn from Day 1\n✅ Upgrade after 1 year\n\n👇 Ready with 1L?",
  readyYes:"Yes, I Am Ready", emi:"EMI Options - 2 Plans",
  emiChoose:"💳 EMI - 2 OPTIONS:\n\nWe understand 15L is big - So EASY EMI - Pay 5L Down + Remaining in 10 or 20 Months!\n\n📋 PLAN 1: 10 MONTHS - FASTER:\n• Down: 5L Now\n• Monthly: 1L x 10M = 10L\n• Total: 15L\n\n📋 PLAN 2: 20 MONTHS - LOW MONTHLY:\n• Down: 5L Now\n• Monthly: 50k x 20M = 10L\n• Total: 15L\n\nBoth same benefits!\n\n👇 Which EMI plan comfortable?",
  emi10:"EMI 10 Months - 1L/mo", emi10Desc:"5L Down + 10x1L - Fast", emi20:"EMI 20 Months - 50k/mo", emi20Desc:"5L Down + 20x50k - Low monthly",
  emi10Detail:"📋 YOU SELECTED: EMI 10 MONTHS - FASTER:\n💰 Breakdown:\n• Today: Rs 5,00,000\n• Monthly: Rs 1,00,000 x 10 = 10,00,000\n• Total: 15,00,000\n• Completion: 10 Months\n\n✅ After down payment:\n• Area LOCKED\n• 5-Year MOU starts\n• Marketing starts\n• Earn from Month 1\n\n👇 Now pay Down Payment to lock area:",
  emi20Detail:"📋 YOU SELECTED: EMI 20 MONTHS - LOW MONTHLY:\n💰 Breakdown:\n• Today: Rs 5,00,000\n• Monthly: Rs 50,000 x 20 = 10,00,000\n• Total: 15,00,000\n• Completion: 20 Months\n\n✅ After down payment:\n• Area LOCKED\n• 5-Year MOU starts\n• Marketing starts\n• Earn from Month 1\n• Only 50k/month - Easy!\n\n👇 Now pay Down Payment:",
  payFee:"💳 PAYMENT TO LOCK YOUR AREA:\n\nTo lock your area (No one else can take), pay initial Registration Fee. This locks area and starts MOU.\n\nAfter payment:\n1. Area LOCKED\n2. Company calls within 24h\n3. Tender + Agreement slot\n4. Marketing starts\n5. Earn from Month 1\n\n👇 Click payment link below to pay and lock area now:\n",
  payCheck:"✅ Did you complete payment to lock area?", payYes:"Yes, I Paid", payNo:"Pay Now",
  formName:"📝 FINAL STEP - Step 1/4:\n*Name:* Enter FULL NAME as per Aadhaar:", formContact:"📝 Step 2/4:\n*Mobile:* Enter 10-digit mobile:", formPlace:"📝 Step 3/4:\n*Place:* Enter City/Place where you want franchisee:", formOcc:"📝 Step 4/4:\n*Job:* Select what you do currently:", thanksEnq:"Thank you", team24:"Team will call within 24h with tender and agreement slot.", tenderMsg:"✅ TENDER & AGREEMENT SLOT - NEXT STEPS:", yesNoQ:"Want to grab opportunity?",
  // IMPROVED REMINDERS - SHOWS WHAT USER DID LAST
  remResume:"⏰ Reminder: You left your franchise application incomplete - Complete now to lock your area!",
  remLang:"Reminder: Select language 8590175977",
  remDriver5:"How to attach vehicle - Watch!", remDriver15:"Get 1-Year Free Recharge!", remDriver1h:"Free Recharge expiring!", remDriver12h:"Need help?", remDriver24h:"Free Recharge expiring soon!", remDriver48h:"Last Chance!", remDriver72h:"Free Recharge expired.", grabNow:"Grab Now", contactSupport:"Call Support", registerAgain:"Register"
 },
 ML:{
  welcome:"🎉 Bizmapia-ലേക്ക് സ്വാഗതം - ALL INDIA സൂപ്പർ ആപ്പ്!\n\n✅ കുറഞ്ഞ നിരക്കിൽ Taxi/Auto/Bike - 10% കിഴിവ്\n✅ 1000+ ലോക്കൽ ബിസിനസുകൾ\n✅ 2 മണിക്കൂറിൽ ഡെലിവറി\n✅ ഹോട്ടൽ/ഡോക്ടർ/സിനിമ ബുക്കിംഗ്\n✅ ഫ്രാഞ്ചൈസി വഴി 1-15 ലക്ഷം\n\n👇 Learn More ടാപ്പ് ചെയ്യൂ",
  tapExplore:"👇 സേവനങ്ങൾ കാണുക:", selectLang:"ഭാഷ തിരഞ്ഞെടുക്കുക:", mainMenuTitle:"👋 നിങ്ങൾക്ക് എന്ത് വേണം?\n\n🚕 റൈഡ് - ടാക്സി വേണോ? വാഹനം വെച്ച് സമ്പാദിക്കണോ?\n📍 ഡയറക്ടറി - ബിസിനസ് തിരയണോ? കട ലിസ്റ്റ് ചെയ്ത് കസ്റ്റമേഴ്‌സ് നേടണോ?\n📦 ഡെലിവറി - പാർസൽ അയക്കണോ? ഏജന്റ് ആയി സമ്പാദിക്കണോ?\n🏨 ബുക്കിംഗ് - റൂം, ഡോക്ടർ, സിനിമ\n💰 ഫ്രാഞ്ചൈസി - സ്വന്തം ബിസിനസ് തുടങ്ങൂ\n\n👇 തിരഞ്ഞെടുക്കുക:", mainMenuBtn:"മെനു",
  ride:"റൈഡ് സേവനം", rideDesc:"റൈഡ് ബുക്ക് അല്ലെങ്കിൽ വാഹനം വെച്ച് നേടുക", bizDir:"ബിസിനസ് ലിസ്റ്റ്", bizDirDesc:"ബിസിനസ് തിരയുക അല്ലെങ്കിൽ ലിസ്റ്റ് ചെയ്ത് കോൾ നേടുക", delivery:"ഡെലിവറി", deliveryDesc:"പാർസൽ അയക്കുക അല്ലെങ്കിൽ ഏജന്റ് ആകുക", booking:"ബുക്കിംഗ്", bookingDesc:"റൂം, ഡോക്ടർ, സിനിമ ബുക്കിംഗ്", earn:"ഫ്രാഞ്ചൈസി", earnDesc:"ബിസിനസ് തുടങ്ങൂ 1L-15L നേടൂ",
  rideMenu:"🚕 BIZMAPIA റൈഡ് - ALL INDIA!\n\n👉 കസ്റ്റമർ: കുറഞ്ഞ നിരക്ക് + 10% കിഴിവ്\n👉 ഡ്രൈവർ: ദിവസം ₹1000-2000 + 1 വർഷം ഫ്രീ റീചാർജ്!\n\n👇 എന്ത് ചെയ്യണം?", bookRide:"റൈഡ് ബുക്ക്", attachVehicle:"വാഹനം ചേർക്കുക",
  customerH:"✅ കസ്റ്റമർ - കുറഞ്ഞ നിരക്ക്! 🔹 കുറഞ്ഞ നിരക്ക് 🔹 10% Extra കിഴിവ് 🔹 24/7 All India\n\nബുക്ക് ചെയ്യുന്ന വിധം:\n1. App ലിങ്ക് ക്ലിക്ക് 👇\n2. App ഇൻസ്റ്റാൾ\n3. രജിസ്റ്റർ\n4. ബുക്ക് ചെയ്യൂ\n\n👇 ഡൗൺലോഡ് ചെയ്യൂ:",
  driverH:"💰 ഡ്രൈവർ - ദിവസം ₹1000-2000! 🔹 1 വർഷം ഫ്രീ റീചാർജ് - Zero കമ്മീഷൻ! 🔹 ദിവസേന പേയ്മെന്റ്\n\n🎁 ഓഫർ: 1 വർഷം ഫ്രീ!\nതുടങ്ങുന്ന വിധം:\n1. App ലിങ്ക് 👇\n2. Driver App\n3. RC, ലൈസൻസ്\n4. ഇന്ന് മുതൽ നേടൂ!\n\n👇 രജിസ്റ്റർ ചെയ്യൂ:",
  bizDirCaption:"📍 ബിസിനസ് ഡയറക്ടറി - കസ്റ്റമർക്കും കടക്കാരനും!\n👉 കസ്റ്റമർ: ഏത് ബിസിനസും തിരയൂ\n👉 കടക്കാരൻ: FREE ലിസ്റ്റ്, ദിവസം 100 കോൾ, 3X വളർച്ച!\n\n👇 എന്ത് വേണം?", bizDirChoose:"👇 തിരഞ്ഞെടുക്കുക:", searchBiz:"തിരയുക", listBiz:"ലിസ്റ്റ് ചെയ്യുക",
  deliveryCaption:"📦 ഫാസ്റ്റ് ഡെലിവറി - 2 മണിക്കൂറിൽ! 👉 പാർസൽ അയക്കണോ? വീട്ടിൽ നിന്ന് പിക്കപ്പ് 👉 സമ്പാദിക്കണോ? ഏജന്റ് ആകൂ ₹30-50\n\n👇 തിരഞ്ഞെടുക്കുക:", deliveryChoose:"👇 തിരഞ്ഞെടുക്കുക:", bookParcel:"പാർസൽ അയക്കുക", registerAgent:"ഏജന്റ് ആകുക",
  bookingCaption:"🏨 എല്ലാ ബുക്കിംഗും ഒരു ആപ്പിൽ! ✅ ഹോട്ടൽ - കുറഞ്ഞ വില ✅ ഡോക്ടർ, സലൂൺ - ഉടൻ ✅ സിനിമ - 10 സെക്കൻഡിൽ\n\n👇 എന്ത് ബുക്ക് ചെയ്യണം?", bookingChoose:"👇 ബുക്കിംഗ് തിരഞ്ഞെടുക്കുക:", bookRoom:"റൂം", bookAppt:"അപ്പോയിന്റ്മെന്റ്", bookCinema:"സിനിമ",
  earnCaption:"💰 ഫ്രാഞ്ചൈസി - സ്വന്തം ബോസ് ആകൂ! 🔹 ജില്ല (10-15L) - മുഴുവൻ ജില്ലയും നിങ്ങളുടേത്, എല്ലാവരിൽ നിന്നും %, 5 വർഷ MOU, സപ്പോർട്ട് 🔹 കോർപ്പ്/മുനി (4-5L) - നഗരം കൺട്രോൾ 🔹 സെന്റർ (1L) - കുറഞ്ഞ നിക്ഷേപം\n\nBizmapia-യെ കുറിച്ച്:", earnList:"👇 ലെവൽ തിരഞ്ഞെടുക്കുക:", highEarn:"ജില്ല - 10L", highDesc:"മുഴുവൻ ജില്ല, 5Y MOU", modEarn:"കോർപ്പ് - 4L", modDesc:"നഗരം കൺട്രോൾ, 3Y", baseEarn:"സെന്റർ - 1L", baseDesc:"കുറഞ്ഞ നിക്ഷേപം, 1Y",
  videoExplain:"📹 ഈ വീഡിയോ കാണൂ - എങ്ങനെ സമ്പാദിക്കും, ഫുൾ സപ്പോർട്ട്, MOU:", videoInstruction:"👆 മുകളിലെ വീഡിയോയിൽ ക്ലിക്ക് ചെയ്യൂ, മുഴുവൻ 2-മിനിറ്റ് കാണൂ, പിന്നെ Yes ക്ലിക്ക് ചെയ്യൂ.",
  watchedQ:"വീഡിയോ കണ്ടോ?", yes:"അതെ കണ്ടു", no:"ഇല്ല", watchFirst:"👉 മുഴുവൻ വീഡിയോ കാണൂ:",
  benefitsDistrict:"💰 ജില്ലാ നേട്ടങ്ങൾ: 1. മുഴുവൻ ജില്ലയുടെയും ഏക കോൺടാക്റ്റ് 2. എല്ലായിടത്തു നിന്നും % - 57 സെന്ററിൽ നിന്നും എല്ലാ മാസവും % - ഉറങ്ങുമ്പോഴും വരുമാനം! 3. 5 വർഷത്തെ MOU 4. ടോപ്പ് ജില്ലാ ഫ്രാഞ്ചൈസികൾ 2-3 ലക്ഷം സമ്പാദിക്കുന്നു\n\n👇 സപ്പോർട്ട് കാണുക:", benefitsCorp:"💰 കോർപ്പ് നേട്ടങ്ങൾ: 1. ഏരിയ കൺട്രോൾ 2. എല്ലാ സെന്ററിൽ നിന്നും % 3. 3 വർഷത്തെ MOU\n\n👇 സപ്പോർട്ട് കാണുക:", benefitsBC:"💰 സെന്റർ നേട്ടങ്ങൾ: 1. 1 ലക്ഷം മാത്രം 2. 1 വർഷത്തെ MOU\n\n👇 സപ്പോർട്ട് കാണുക:",
  knowSupport:"സപ്പോർട്ട് കാണുക", supportDistrict:"🎁 ജില്ലാ സപ്പോർട്ട്: 1. 12 മാസം മാർക്കറ്റിംഗ് - കമ്പനി ലക്ഷങ്ങൾ പരസ്യത്തിന് ചെലവഴിക്കും 2. 6 മാസം വാടക 3. 6 മാസം ശമ്പളം 4. ഫുൾ ട്രെയിനിംഗ് + മാനേജർ\n\nഈ സപ്പോർട്ടോടെ മാസം 1 മുതൽ സമ്പാദിച്ചു തുടങ്ങാം!\n\n👇 ആവശ്യകത കാണുക:", supportCorp:"🎁 കോർപ്പ് സപ്പോർട്ട്: 1. 12 മാസം മാർക്കറ്റിംഗ് 2. 6 മാസം വാടക 3. 6 മാസം ശമ്പളം 4. ട്രെയിനിംഗ്\n\n👇 ആവശ്യകത കാണുക:", supportBC:"🎁 സെന്റർ സപ്പോർട്ട്: 1. 3 മാസം മാർക്കറ്റിംഗ് 2. ട്രെയിനിംഗ് 3. ആപ്പ് സപ്പോർട്ട്\n\n👇 ആവശ്യകത കാണുക:",
  knowReq:"ആവശ്യകത കാണുക", reqDistrict:"📋 ജില്ലാ ആവശ്യങ്ങൾ: എന്താണ് വേണ്ടത്? ശ്രദ്ധിച്ച് വായിക്കുക:\n\n1. 🏢 സ്ഥലം: കുറഞ്ഞത് 100 sq.ft വാണിജ്യ സ്ഥലം - ഓഫീസിനും സ്റ്റാഫിനും - ജില്ലാ ആസ്ഥാനത്ത് ചെറിയ ഓഫീസ് വേണം\n2. 👨‍💼 സ്റ്റാഫ്: 1 ഫുൾ-ടൈം സ്റ്റാഫ് - കമ്പനി സഹായിക്കും\n3. 💻 ഉപകരണങ്ങൾ: Laptop, Phone, Net\n\nഈ 3 എണ്ണം ഉണ്ടെങ്കിൽ നിങ്ങൾ യോഗ്യനാണ്! ബാക്കി സപ്പോർട്ട് കമ്പനി തരും! വീട്ടമ്മമാർ, വിരമിച്ചവർ, കടക്കാർ ഇതേ ആവശ്യകതകളോടെ തുടങ്ങി സമ്പാദിക്കുന്നു!\n\n👇 ഇവ ഉണ്ടെങ്കിൽ 'അപേക്ഷിക്കൂ' ക്ലിക്ക് ചെയ്യൂ:", reqCorp:"📋 കോർപ്പ് ആവശ്യങ്ങൾ: 1. 50 sq.ft ഓഫീസ്/കട 2. 1 സ്റ്റാഫ് 3. Laptop, Phone, Net\n\nഇത് ഉണ്ടെങ്കിൽ തുടങ്ങാം! 👇 അപേക്ഷിക്കൂ:", reqBC:"📋 സെന്റർ ആവശ്യങ്ങൾ: 1. 50 sq.ft കട - നിലവിലുള്ള കട മതി 2. Phone & Internet\n\n50 sq.ft കട ഉണ്ടെങ്കിൽ ഇന്ന് തുടങ്ങാം! 👇 അപേക്ഷിക്കൂ:",
  submitApp:"അപേക്ഷിക്കൂ", categoryQ:"📍 പ്രധാനപ്പെട്ട ചോദ്യം - ഫീസ് & ഏരിയ തീരുമാനിക്കാൻ:\n\nനിങ്ങളുടെ ജില്ല ഒരു കോർപ്പറേഷൻ ജില്ലയാണോ? അതായത് - ജില്ലയിൽ Municipal Corporation നഗരം ഉണ്ടോ?\n\nഉദാ: എറണാകുളം - കൊച്ചി കോർപ്പറേഷൻ ഉണ്ട് - അതെ\nഉദാ: ഇടുക്കി - കോർപ്പറേഷൻ ഇല്ല - അല്ല\n\nഎന്തുകൊണ്ട്? കോർപ്പറേഷൻ ജില്ലയിൽ കൂടുതൽ ജനസംഖ്യ, കൂടുതൽ വരുമാനം - ഫീസ് 15 ലക്ഷം. നോൺ-കോർപ്പ് 10 ലക്ഷം എന്നാൽ മുഴുവൻ ജില്ലാ കൺട്രോൾ അതേ 5Y MOU & സപ്പോർട്ടോടെ!\n\n👇 തിരഞ്ഞെടുക്കുക:", corpLocQ:"📍 ലൊക്കേഷൻ കോർപ്പറേഷൻ നഗര പരിധിക്കുള്ളിലാണോ? അതോ പുറത്ത് മുനിസിപ്പാലിറ്റി/പഞ്ചായത്തിൽ ആണോ?\nകോർപ്പിനുള്ളിൽ ഫീസ് 5 ലക്ഷം, പുറത്ത് മുനി ഫീസ് 4 ലക്ഷം - രണ്ടിനും അതേ 3Y MOU!\n\n👇 ലൊക്കേഷൻ കോർപ്പറേഷനുള്ളിലാണോ?", bcLocQ:"📍 BC ലൊക്കേഷൻ കോർപ്പിലാണോ മുനിയിലാണോ? ഫീസ് രണ്ടിനും 1 ലക്ഷം\n\n👇 BC ലൊക്കേഷൻ എവിടെയാണ്?",
  corpYes:"അതെ Corp", corpNo:"അല്ല Muni", feeCorpDistrict:"💰 കോർപ്പ് ജില്ലാ ഫീസ്: Rs 15 ലക്ഷം - എന്തുകൊണ്ട് 15L?\n\nകോർപ്പ് ജില്ല = വലിയ ജനസംഖ്യ = കൂടുതൽ ബിസിനസ് സെന്ററുകൾ = കൂടുതൽ വരുമാനം!\n\n15 ലക്ഷത്തിൽ എന്ത് ലഭിക്കും:\n✅ മുഴുവൻ ജില്ലാ കൺട്രോൾ\n✅ 5 വർഷത്തെ MOU\n✅ 12 മാസം മാർക്കറ്റിംഗ് + 6 മാസം വാടക + ശമ്പള സപ്പോർട്ട്\n✅ ഏറ്റവും ഉയർന്ന വരുമാനം - 2-3L പ്രതിമാസം\n\nഇത് വലിയ ബിസിനസിനുള്ള നിക്ഷേപം - 6-8 മാസത്തിൽ തിരിച്ചു സമ്പാദിക്കും!\n\n👇 വലിയ ബിസിനസിന് തയ്യാറാണെങ്കിൽ പേയ്‌മെന്റ് ഓപ്ഷൻ:", feeNonCorpDistrict:"💰 നോൺ-കോർപ്പ് ജില്ലാ ഫീസ്: Rs 10 ലക്ഷം - കുറഞ്ഞ നിക്ഷേപം, അതേ നേട്ടങ്ങൾ!\n\n10 ലക്ഷത്തിൽ എന്ത് ലഭിക്കും (5 ലക്ഷം ലാഭിക്കൂ!):\n✅ മുഴുവൻ ജില്ലാ കൺട്രോൾ\n✅ അതേ 5 വർഷത്തെ MOU\n✅ അതേ സപ്പോർട്ട്\n✅ നല്ല വരുമാനം - 1-2L പ്രതിമാസം\n\n👇 10 ലക്ഷത്തിൽ തയ്യാറാണോ?", feeCorp:"💰 കോർപ്പ് ഫീസ്: Rs 5 ലക്ഷം - സിറ്റി ബോസ്!\n✅ മുഴുവൻ കോർപ്പറേഷൻ കൺട്രോൾ\n✅ 3 വർഷത്തെ MOU\n✅ 12 മാസം മാർക്കറ്റിംഗ് + വാടക + ശമ്പള സപ്പോർട്ട്\n✅ 50k-1L പ്രതിമാസം\n\n👇 തയ്യാറാണോ?", feeMuni:"💰 മുനി ഫീസ്: Rs 4 ലക്ഷം - കുറഞ്ഞ നിക്ഷേപം!\n✅ മുഴുവൻ മുനിസിപ്പാലിറ്റി കൺട്രോൾ\n✅ അതേ 3Y MOU\n✅ അതേ സപ്പോർട്ട്\n✅ 30k-70k പ്രതിമാസം\n\n👇 4 ലക്ഷത്തിൽ തയ്യാറാണോ?", feeBC:"💰 BC ഫീസ്: Rs 1 ലക്ഷം മാത്രം - ചെറുതായി തുടങ്ങൂ, ദിവസം 1 മുതൽ നേടൂ!\n✅ നിങ്ങളുടെ ഏരിയ BC - 2-3 km\n✅ 1 വർഷത്തെ MOU\n✅ 3 മാസം മാർക്കറ്റിംഗ് + ട്രെയിനിംഗ്\n✅ ദിവസം 1 മുതൽ നേടൂ\n✅ 1 വർഷത്തിന് ശേഷം അപ്‌ഗ്രേഡ്\n\nപല BC 20k-40k പ്രതിമാസം 1 ലക്ഷത്തിൽ സമ്പാദിക്കുന്നു!\n\n👇 1 ലക്ഷത്തിൽ തയ്യാറാണോ?",
  readyYes:"അതെ റെഡി", emi:"EMI കാണുക",
  emiChoose:"💳 EMI ഓപ്ഷൻ - 2 ഓപ്ഷനുകൾ:\n\n15L വലിയ തുക - അതിനാൽ EMI - 5L ഡൗൺ + ബാക്കി 10 അല്ലെങ്കിൽ 20 മാസത്തിൽ!\n\n📋 പ്ലാൻ 1: 10 മാസം - വേഗത്തിൽ:\n• ഡൗൺ: 5L\n• പ്രതിമാസം: 1L x 10M = 10L\n• ആകെ: 15L\n\n📋 പ്ലാൻ 2: 20 മാസം - കുറഞ്ഞ മാസം:\n• ഡൗൺ: 5L\n• പ്രതിമാസം: 50k x 20M = 10L\n• ആകെ: 15L\n\nരണ്ടിനും അതേ നേട്ടങ്ങൾ, MOU, സപ്പോർട്ട്!\n\n👇 ഏത് EMI സൗകര്യപ്രദം?",
  emi10:"EMI 10 മാസം - 1L/മാസം", emi10Desc:"5L ഡൗൺ + 10x1L - വേഗത്തിൽ", emi20:"EMI 20 മാസം - 50k/മാസം", emi20Desc:"5L ഡൗൺ + 20x50k - കുറഞ്ഞ മാസം",
  emi10Detail:"📋 നിങ്ങൾ തിരഞ്ഞെടുത്തു: EMI 10 മാസം - വേഗത്തിൽ:\n\n💰 വിവരം:\n• ഇന്ന്: Rs 5,00,000\n• പ്രതിമാസം: Rs 1,00,000 x 10 = 10,00,000\n• ആകെ: 15,00,000\n• പൂർത്തി: 10 മാസം\n\n✅ ഡൗൺ പേയ്‌മെന്റിന് ശേഷം:\n• ഏരിയ ലോക്ക് ചെയ്തു\n• 5Y MOU തുടങ്ങും\n• മാർക്കറ്റിംഗ് തുടങ്ങും\n• മാസം 1 മുതൽ സമ്പാദിക്കാം\n\n👇 ഇപ്പോൾ ഡൗൺ പേയ്‌മെന്റ് അടച്ച് ലോക്ക് ചെയ്യൂ:",
  emi20Detail:"📋 നിങ്ങൾ തിരഞ്ഞെടുത്തു: EMI 20 മാസം - കുറഞ്ഞ മാസം:\n\n💰 വിവരം:\n• ഇന്ന്: Rs 5,00,000\n• പ്രതിമാസം: Rs 50,000 x 20 = 10,00,000\n• ആകെ: 15,00,000\n• പൂർത്തി: 20 മാസം\n\n✅ ഡൗൺ പേയ്‌മെന്റിന് ശേഷം:\n• ഏരിയ ലോക്ക് ചെയ്തു\n• 5Y MOU തുടങ്ങും\n• മാർക്കറ്റിംഗ് തുടങ്ങും\n• മാസം 1 മുതൽ സമ്പാദിക്കാം\n• 50k/മാസം മാത്രം - എളുപ്പം!\n\n👇 ഇപ്പോൾ ഡൗൺ പേയ്‌മെന്റ് അടച്ച് ലോക്ക് ചെയ്യൂ:",
  payFee:"💳 ഏരിയ ലോക്ക് ചെയ്യാൻ പേയ്‌മെന്റ് - പ്രധാനം - ശ്രദ്ധിച്ച് വായിക്കുക:\n\nഏരിയ ലോക്ക് ചെയ്യാൻ (മറ്റാർക്കും എടുക്കാൻ കഴിയില്ല), രജിസ്ട്രേഷൻ ഫീസ് അടയ്ക്കണം.\n\nപേയ്‌മെന്റിന് ശേഷം:\n1. ഏരിയ ലോക്ക് ചെയ്തു\n2. കമ്പനി 24 മണിക്കൂറിനുള്ളിൽ വിളിക്കും\n3. ടെൻഡർ + കരാർ സ്ലോട്ട്\n4. മാർക്കറ്റിംഗ് തുടങ്ങും\n5. മാസം 1 മുതൽ സമ്പാദിക്കാം\n\n👇 ഏരിയ ലോക്ക് ചെയ്യാൻ പേയ്‌മെന്റ് ലിങ്കിൽ ക്ലിക്ക് ചെയ്യൂ:\n",
  payCheck:"പേയ്മെന്റ് ചെയ്തോ?", payYes:"അതെ ചെയ്തു", payNo:"ഇപ്പോൾ അടയ്ക്കൂ",
  formName:"📝 അവസാന ഘട്ടം - ഘട്ടം 1/4:\n*പേര്:* ആധാർ പ്രകാരം മുഴുവൻ പേര് നൽകുക:", formContact:"📝 ഘട്ടം 2/4:\n*ഫോൺ:* 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക:", formPlace:"📝 ഘട്ടം 3/4:\n*സ്ഥലം:* ഫ്രാഞ്ചൈസി വേണ്ട സ്ഥലത്തിന്റെ പേര് നൽകുക:", formOcc:"📝 ഘട്ടം 4/4:\n*ജോലി:* നിലവിൽ എന്ത് ചെയ്യുന്നു എന്ന് തിരഞ്ഞെടുക്കുക:", thanksEnq:"നന്ദി", team24:"ടീം 24 മണിക്കൂറിനുള്ളിൽ ടെൻഡറും കരാർ സ്ലോട്ടുമായി വിളിക്കും.", tenderMsg:"✅ ടെൻഡർ & കരാർ സ്ലോട്ട് - അടുത്ത ഘട്ടങ്ങൾ:", yesNoQ:"അവസരം എടുക്കണോ?",
  remResume:"⏰ റിമൈൻഡർ: നിങ്ങൾ അപേക്ഷ പൂർത്തിയാക്കാതെ വിട്ടു - ഏരിയ ലോക്ക് ചെയ്യാൻ ഇപ്പോൾ പൂർത്തിയാക്കൂ!",
  remLang:"⏰ റിമൈൻഡർ: ഭാഷ തിരഞ്ഞെടുക്കുക 8590175977 വിളിക്കുക", remDriver5:"വാഹനം എങ്ങനെ ചേർക്കാം - കാണൂ!", remDriver15:"🎁 1 വർഷത്തെ ഫ്രീ റീചാർജ് ഓഫർ!", remDriver1h:"⏰ ഫ്രീ റീചാർജ് ഉടൻ തീരും! ഇപ്പോൾ ക്ലെയിം ചെയ്യൂ!", remDriver12h:"സഹായം വേണോ? 8590175977", remDriver24h:"⏰ 24 മണിക്കൂർ റിമൈൻഡർ - ഫ്രീ റീചാർജ് ഉടൻ തീരും!", remDriver48h:"⏰ അവസാന അവസരം! ഫ്രീ റീചാർജ് ഓഫർ അവസാനിക്കുന്നു!", remDriver72h:"ഫ്രീ റീചാർജ് ഓഫർ കാലഹരണപ്പെട്ടു", grabNow:"ഫ്രീ റീചാർജ് ക്ലെയിം ചെയ്യൂ", contactSupport:"സപ്പോർട്ട് വിളിക്കുക - 8590175977", registerAgain:"വീണ്ടും രജിസ്റ്റർ ചെയ്യുക"
 }
};
const getT=(l,k)=>(LANG_TEXT[l]&&LANG_TEXT[l][k])||LANG_TEXT.EN[k];
let sheetsClientCache=null;
async function getSheetsClient(){try{let creds=process.env.GOOGLE_CREDENTIALS;if(!creds)return null;let credentials=JSON.parse(creds);if(credentials.private_key)credentials.private_key=credentials.private_key.replace(/\\\\n/g,'\n');if(sheetsClientCache)return sheetsClientCache;const auth=new google.auth.GoogleAuth({credentials,scopes:['https://www.googleapis.com/auth/spreadsheets']});const client=await auth.getClient();const sheets=google.sheets({version:'v4',auth:client});sheetsClientCache=sheets;return sheets;}catch(e){return null;}}
async function appendToSheet(row){try{const sheets=await getSheetsClient();if(!sheets)return false;await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID,range:'Sheet1!A:I',valueInputOption:'USER_ENTERED',insertDataOption:'INSERT_ROWS',requestBody:{values:[row]}});return true;}catch(e){return false;}}
async function logAllChat(phone,type,status,lang,stage,extra=''){try{const dateStr=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});const row=[dateStr,phone,type,`${stage} | ${type} | ${status} | ${extra}`.substring(0,490),phone,stage,`${lang} | ${status}`,extra.substring(0,200),lang];await appendToSheet(row);}catch(e){}}
const sessions={};const processedIds=new Set();let pendingChats={}; let driverReminders=[];

// ===== IMPROVED REMINDER LOGIC - SHOWS LAST ACTION =====
function getOppDisplayName(lastOpp){
  if(!lastOpp) return "";
  const map={OPP_1:"District Franchisee (10-15L)",OPP_2:"Corporation (5L)",OPP_3:"Municipality (4L)",OPP_4:"Biz Center Taxi (1L)",OPP_5:"Biz Center Directory (1L)"};
  return map[lastOpp]||lastOpp;
}
function getLastActionText(stage, lastOpp, lang){
  const oppName=getOppDisplayName(lastOpp);
  const l=lang||"EN";
  if(l==="ML"){
    if(stage.includes("OPP_")&&stage.includes("VIEWED")) return `നിങ്ങൾ ${oppName} തിരഞ്ഞെടുത്തു, വീഡിയോ കാണുകയായിരുന്നു`;
    if(stage==="EMI_SELECTION") return `നിങ്ങൾ ${oppName} ന് EMI ഓപ്ഷൻ തിരഞ്ഞെടുത്തു, 10 മാസമോ 20 മാസമോ തിരഞ്ഞെടുക്കാനായിരുന്നു`;
    if(stage==="EARN_PAYMENT") return `നിങ്ങൾ ${oppName} തിരഞ്ഞെടുത്തു, പേയ്മെന്റ് ചെയ്യാനായിരുന്നു - ഏരിയ കാത്തിരിക്കുന്നു!`;
    if(stage==="FORM_NAME") return `നിങ്ങൾ ${oppName} ന് പേയ്മെന്റ് ചെയ്തു, പേര് നൽകാനായിരുന്നു`;
    if(stage==="FORM_CONTACT") return `നിങ്ങൾ ${oppName} ന് അപേക്ഷിക്കുന്നു, ഫോൺ നമ്പർ നൽകാനായിരുന്നു`;
    if(stage==="FORM_PLACE") return `നിങ്ങൾ ${oppName} ന് അപേക്ഷിക്കുന്നു, സ്ഥലം നൽകാനായിരുന്നു`;
    if(stage==="FORM_OCCUPATION") return `നിങ്ങൾ ${oppName} ന് അപേക്ഷിക്കുന്നു, ജോലി തിരഞ്ഞെടുക്കാനായിരുന്നു`;
    if(stage==="CATEGORY_QUESTION") return `നിങ്ങൾ ${oppName} തിരഞ്ഞെടുത്തു, Corporation ഉണ്ടോ എന്ന ചോദ്യത്തിലായിരുന്നു`;
    return `നിങ്ങൾ ${oppName||stage} -ൽ ആയിരുന്നു`;
  } else {
    if(stage.includes("OPP_")&&stage.includes("VIEWED")) return `You selected ${oppName} and were watching video`;
    if(stage==="EMI_SELECTION") return `You selected EMI for ${oppName} and were choosing 10 or 20 months plan`;
    if(stage==="EARN_PAYMENT") return `You selected ${oppName} and were at payment step - Your area is still waiting!`;
    if(stage==="FORM_NAME") return `You paid for ${oppName} and were entering your name`;
    if(stage==="FORM_CONTACT") return `You are applying for ${oppName} and were entering contact`;
    if(stage==="FORM_PLACE") return `You are applying for ${oppName} and were entering place`;
    if(stage==="FORM_OCCUPATION") return `You are applying for ${oppName} and were selecting occupation`;
    if(stage==="CATEGORY_QUESTION") return `You selected ${oppName} and were at Corporation question`;
    return `You were at ${oppName||stage}`;
  }
}

async function ensureSheetTab(sheets, title){try{const meta=await sheets.spreadsheets.get({spreadsheetId:SHEET_ID});const exists=meta.data.sheets.some(s=>s.properties.title===title);if(!exists){await sheets.spreadsheets.batchUpdate({spreadsheetId:SHEET_ID, requestBody:{requests:[{addSheet:{properties:{title}}}]}});}}catch(e){}}
async function savePendingToSheet(){try{const sheets=await getSheetsClient();if(!sheets)return;await ensureSheetTab(sheets,"PendingChats");await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID, range:'PendingChats!A2:F'});const rows=Object.keys(pendingChats).map(p=>[p, pendingChats[p].lang, pendingChats[p].stage, pendingChats[p].lastActivity, JSON.stringify(pendingChats[p].reminders), pendingChats[p].lastOpp||""]);if(rows.length>0)await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID, range:'PendingChats!A:F', valueInputOption:'USER_ENTERED', requestBody:{values: rows}});}catch(e){}}
async function loadPendingFromSheet(){try{const sheets=await getSheetsClient();if(!sheets)return {};await ensureSheetTab(sheets,"PendingChats");const res=await sheets.spreadsheets.values.get({spreadsheetId:SHEET_ID, range:'PendingChats!A2:F'});const rows=res.data.values||[];let out={};rows.forEach(r=>{if(r[0])out[r[0]]={lang:r[1]||'EN', stage:r[2], lastActivity:parseInt(r[3]), reminders:JSON.parse(r[4]||'{"r1":false,"r2":false,"r3":false,"r4":false}'), lastOpp:r[5]||""};});return out;}catch(e){return {};}}
function setPendingChat(phone,lang,stageName,lastOpp=""){if(!pendingChats[phone])pendingChats[phone]={lang:lang||"EN",stage:stageName,lastActivity:Date.now(),reminders:{r1:false,r2:false,r3:false,r4:false},lastOpp:lastOpp};else{pendingChats[phone].lang=lang||pendingChats[phone].lang;pendingChats[phone].stage=stageName;pendingChats[phone].lastActivity=Date.now();pendingChats[phone].reminders={r1:false,r2:false,r3:false,r4:false};if(lastOpp) pendingChats[phone].lastOpp=lastOpp;}savePendingToSheet();}
function clearPendingChat(phone){if(pendingChats[phone]){delete pendingChats[phone];savePendingToSheet();}}
function getSession(p){if(!sessions[p])sessions[p]={lang:"EN",stage:"NEW",lastOpp:"",form:{},data:{}};return sessions[p];}
async function sendText(to,body){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"text",text:{body}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){}}
async function sendImage(to,link,caption){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"image",image:{link,caption:caption.substring(0,1024)}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,caption);}}
async function sendDocument(to,link,filename){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"document",document:{link,filename}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,filename+": "+link);}}
async function sendButtons(to,body,buttons){try{const safe=buttons.map(b=>({type:"reply",reply:{id:b.id,title:b.title.substring(0,20)}}));await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"button",body:{text:body.substring(0,1024)},action:{buttons:safe}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
async function sendList(to,body,buttonText,sections){try{const safeSections=sections.map(sec=>({title:sec.title.substring(0,24),rows:sec.rows.map(r=>({id:r.id,title:r.title.substring(0,24),description:(r.description||"").substring(0,72)}))}));await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"list",body:{text:body.substring(0,1024)},action:{button:buttonText.substring(0,20),sections:safeSections}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){console.log("List failed:",e.response?.data||e.message);await sendText(to,body);}}
async function sendContactWithCallUrl(to,body){try{await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,{messaging_product:"whatsapp",to,type:"interactive",interactive:{type:"cta_url",body:{text:body},action:{name:"cta_url",parameters:{display_text:"Call Now - 8590175977",url:`tel:+918590175977`}}}},{headers:{Authorization:`Bearer ${TOKEN}`}});}catch(e){await sendText(to,body);}}
function getOppName(id){const map={opp_1:"District Franchisee (10L-15L)",opp_2:"Corporation (5L)",opp_3:"Municipality (4L)",opp_4:"Biz Center Taxi (1L)",opp_5:"Biz Center Directory (1L)"};return map[id]||id;}
const OPP_MAP={'OPP_1':'District (10L-15L)','OPP_2':'Corporation (5L)','OPP_3':'Municipality (4L)','OPP_4':'Biz Center Taxi (1L)','OPP_5':'Biz Center Directory (1L)'};
async function sendWelcome(to){const s=getSession(to);await sendImage(to,ASSETS.posters.welcome,getT(s.lang,"welcome"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(s.lang,"tapExplore"),[{id:"LEARN_MORE",title:"Learn More"}]);}
async function sendLanguage(to){await sendButtons(to,"Please select your preferred language:",[{id:"lang_en",title:"English"},{id:"lang_hi",title:"Hindi (हिंदी)"},{id:"lang_ml",title:"Malayalam (മലയാളം)"}]);}
async function sendMainMenu(to){const s=getSession(to);const l=s.lang;await sendList(to,getT(l,"mainMenuTitle"),getT(l,"mainMenuBtn"),[{title:"Services",rows:[{id:"MENU_RIDE",title:getT(l,"ride"),description:getT(l,"rideDesc")},{id:"MENU_BIZDIR",title:getT(l,"bizDir"),description:getT(l,"bizDirDesc")},{id:"MENU_DELIVERY",title:getT(l,"delivery"),description:getT(l,"deliveryDesc")},{id:"MENU_BOOKING",title:getT(l,"booking"),description:getT(l,"bookingDesc")},{id:"MENU_EARN",title:getT(l,"earn"),description:getT(l,"earnDesc")}]}]);}
async function handleRideMenu(to){const l=getSession(to).lang;await sendButtons(to,getT(l,"rideMenu"),[{id:"RIDE_BOOK",title:getT(l,"bookRide")},{id:"RIDE_ATTACH",title:getT(l,"attachVehicle")}]);}
async function handleBookRide(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.customer,getT(l,"customerH")+"\n"+ASSETS.apps.customer);clearPendingChat(to);}
async function handleAttachVehicle(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.driver,getT(l,"driverH")+"\n"+ASSETS.apps.driver);getSession(to).stage="DRIVER_ONBOARD";addReminder(to,"Driver_FreeRecharge");}
async function handleBizDir(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.business,getT(l,"bizDirCaption"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(l,"bizDirChoose"),[{id:"BIZDIR_SEARCH",title:getT(l,"searchBiz")},{id:"BIZDIR_LIST",title:getT(l,"listBiz")}]);}
async function handleDelivery(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.onlineDelivery,getT(l,"deliveryCaption"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(l,"deliveryChoose"),[{id:"DEL_BOOK",title:getT(l,"bookParcel")},{id:"DEL_AGENT",title:getT(l,"registerAgent")}]);}
async function handleBooking(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.onlineBooking,getT(l,"bookingCaption"));await new Promise(r=>setTimeout(r,800));await sendList(to,getT(l,"bookingChoose"),getT(l,"mainMenuBtn"),[{title:"Booking",rows:[{id:"BOOK_ROOM",title:getT(l,"bookRoom")},{id:"BOOK_APPT",title:getT(l,"bookAppt")},{id:"BOOK_CINEMA",title:getT(l,"bookCinema")}]}]);}
async function handleEarnMenu(to){const l=getSession(to).lang;await sendImage(to,ASSETS.posters.opportunity,getT(l,"earnCaption"));await new Promise(r=>setTimeout(r,800));await sendText(to,`${getT(l,"videoExplain")}\n${ASSETS.videos.main_opp}\n\n${getT(l,"videoInstruction")}`);await new Promise(r=>setTimeout(r,800));await sendList(to,getT(l,"earnList"),getT(l,"mainMenuBtn"),[{title:"Franchise",rows:[{id:"opp_1",title:"District",description:"10L-15L | 5Y | 12M Ads"},{id:"opp_2",title:"Corporation",description:"5L | 3Y | 12M Ads"},{id:"opp_3",title:"Municipality",description:"4L | 3Y | 12M Ads"},{id:"opp_4",title:"BC - Taxi",description:"1L | 1Y | 3M Ads"},{id:"opp_5",title:"BC - Directory",description:"1L | 1Y | 3M Ads"}]}]);}
async function handleOppLevel(to, id){const s=getSession(to);const l=s.lang;s.lastOpp=id.toUpperCase();s.data.level=id.toUpperCase();s.stage="EARN";setPendingChat(to,l,"OPP_"+id+"_VIEWED",s.lastOpp);await sendImage(to,ASSETS.posters.opportunity,getOppName(id));await new Promise(r=>setTimeout(r,600));await sendText(to,(id==="opp_1"?getT(l,"feeCorpDistrict"):id==="opp_2"?getT(l,"feeCorp"):id==="opp_3"?getT(l,"feeMuni"):getT(l,"feeBC"))+"\n\n"+(s.data.level==="OPP_1"?getT(l,"benefitsDistrict"):s.data.level==="OPP_2"||s.data.level==="OPP_3"?getT(l,"benefitsCorp"):getT(l,"benefitsBC")));await new Promise(r=>setTimeout(r,1000));let v=ASSETS.videos.opp_1;if(id==="opp_2")v=ASSETS.videos.opp_2;if(id==="opp_3")v=ASSETS.videos.opp_3;if(id==="opp_4")v=ASSETS.videos.opp_4;if(id==="opp_5")v=ASSETS.videos.opp_5;await sendText(to,getT(l,"videoExplain")+"\n"+v+"\n\n"+getT(l,"videoInstruction"));await new Promise(r=>setTimeout(r,800));await sendButtons(to,getT(l,"watchedQ"),[{id:"VID_YES",title:getT(l,"yes")},{id:"VID_NO",title:getT(l,"no")}]);}
async function handleVideoYes(to){const s=getSession(to);const l=s.lang;await sendButtons(to,s.data.level==="OPP_1"?getT(l,"supportDistrict"):s.data.level==="OPP_2"||s.data.level==="OPP_3"?getT(l,"supportCorp"):getT(l,"supportBC"),[{id:"KNOW_REQ",title:getT(l,"knowReq")}]);}
async function handleReq(to){const s=getSession(to);const l=s.lang;await sendButtons(to,s.data.level==="OPP_1"?getT(l,"reqDistrict"):s.data.level==="OPP_2"||s.data.level==="OPP_3"?getT(l,"reqCorp"):getT(l,"reqBC"),[{id:"SUBMIT_APP",title:getT(l,"submitApp")}]);}
async function handleSubmitApp(to){const l=getSession(to).lang;setPendingChat(to,l,"CATEGORY_QUESTION",getSession(to).lastOpp);await sendButtons(to,getT(l,"categoryQ"),[{id:"CORP_YES",title:getT(l,"corpYes")},{id:"CORP_NO",title:getT(l,"corpNo")}]);}
async function handleCategory(to, isCorp){const s=getSession(to);const l=s.lang;let fee=isCorp?getT(l,"feeCorpDistrict"):getT(l,"feeNonCorpDistrict");if(s.data.level==="OPP_2")fee=isCorp?getT(l,"feeCorp"):getT(l,"feeMuni");if(s.data.level==="OPP_3")fee=isCorp?getT(l,"feeMuni"):getT(l,"feeCorp");if(s.data.level==="OPP_4"||s.data.level==="OPP_5")fee=getT(l,"feeBC");s.data.isCorp=isCorp;setPendingChat(to,l,"FEE_SHOWN",s.lastOpp);await sendButtons(to,fee,[{id:"READY_YES",title:getT(l,"readyYes")},{id:"READY_EMI",title:getT(l,"emi")}]);}
async function handleReady(to, isEMI){
 const s=getSession(to);const l=s.lang;
 if(!isEMI){
  let msg=getT(l,"payFee")+"\n"+ASSETS.payments.registration;
  await sendText(to,msg);
  await new Promise(r=>setTimeout(r,800));
  await sendButtons(to,getT(l,"payCheck"),[{id:"PAY_YES",title:getT(l,"payYes")},{id:"PAY_NO",title:getT(l,"payNo")}]);
  setPendingChat(to,l,"EARN_PAYMENT",s.lastOpp);
 }else{
  await sendList(to,getT(l,"emiChoose"),getT(l,"mainMenuBtn"),[{title:"EMI Plans",rows:[{id:"EMI_10",title:getT(l,"emi10"),description:getT(l,"emi10Desc")},{id:"EMI_20",title:getT(l,"emi20"),description:getT(l,"emi20Desc")}]}]);
  setPendingChat(to,l,"EMI_SELECTION",s.lastOpp);
 }
}
async function handleEMISelect(to, plan){
 const l=getSession(to).lang;const s=getSession(to);s.data.emiPlan=plan;
 let detail = plan==="EMI_10"? getT(l,"emi10Detail") : getT(l,"emi20Detail");
 await sendText(to,detail+"\n\n"+getT(l,"payFee")+"\n"+ASSETS.payments.registration);
 await new Promise(r=>setTimeout(r,800));
 await sendButtons(to,getT(l,"payCheck"),[{id:"PAY_YES",title:getT(l,"payYes")},{id:"PAY_NO",title:getT(l,"payNo")}]);
 setPendingChat(to,l,"EARN_PAYMENT",s.lastOpp);
}
async function handlePayYes(to){const l=getSession(to).lang;const s=getSession(to);setPendingChat(to,l,"FORM_NAME",s.lastOpp);await sendText(to,getT(l,"formName"));}
async function handlePayNo(to){const l=getSession(to).lang;await sendText(to,getT(l,"payFee")+"\n"+ASSETS.payments.registration);}
async function saveDriverReminders(){try{const sheets=await getSheetsClient();if(!sheets)return;await ensureSheetTab(sheets,"DriverReminders");await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID, range:'DriverReminders!A2:F'});const rows=driverReminders.map(r=>[r.phone, r.type, r.claimedAt, r.sent1h, r.sent24h, r.sent48h]);if(rows.length>0)await sheets.spreadsheets.values.append({spreadsheetId:SHEET_ID, range:'DriverReminders!A:F', valueInputOption:'USER_ENTERED', requestBody:{values: rows}});}catch(e){}}
async function loadDriverReminders(){try{const sheets=await getSheetsClient();if(!sheets)return [];await ensureSheetTab(sheets,"DriverReminders");const res=await sheets.spreadsheets.values.get({spreadsheetId:SHEET_ID, range:'DriverReminders!A2:F'});const rows=res.data.values||[];return rows.map(r=>({phone:r[0], type:r[1], claimedAt:parseInt(r[2]), sent1h:r[3]==='true', sent24h:r[4]==='true', sent48h:r[5]==='true', sent72h:false, lang:"EN"}));}catch(e){return [];}}
function addReminder(phone,type){driverReminders.push({phone,type,claimedAt:Date.now(),sent1h:false,sent24h:false,sent48h:false,sent72h:false, lang:getSession(phone).lang});saveDriverReminders();}
async function checkReminders(){const now=Date.now();let changed=false;for(let r of driverReminders){const diffH=(now-r.claimedAt)/(1000*60*60);const sessLang=r.lang||"EN";const tt=LANG_TEXT[sessLang]||LANG_TEXT.EN;if(!r.sent1h&&diffH>=1){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver1h+"\n"+ASSETS.apps.driver);await sendContactWithCallUrl(r.phone,tt.grabNow+" - Call "+CONTACT_NUMBER);r.sent1h=true;changed=true;}else if(!r.sent24h&&diffH>=24){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver24h);r.sent24h=true;changed=true;}else if(!r.sent48h&&diffH>=48){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver48h);r.sent48h=true;changed=true;}else if(!r.sent72h&&diffH>=72){await sendImage(r.phone,ASSETS.posters.freeRecharge,tt.remDriver72h);r.sent72h=true;changed=true;}}if(changed){driverReminders=driverReminders.filter(r=>!r.sent72h);await saveDriverReminders();}}

// FIXED REMINDER - SHOWS LAST ACTION
async function checkPendingChats(){
  const now=Date.now();
  for(let phone in pendingChats){
    const p=pendingChats[phone];const diffMin=(now-p.lastActivity)/(1000*60);const l=p.lang||"EN";const t=LANG_TEXT[l]||LANG_TEXT.EN;
    const lastAction = getLastActionText(p.stage, p.lastOpp, l);
    try{
      if(!p.reminders.r1&&diffMin>=10){
        if(l==="ML"){
          await sendContactWithCallUrl(phone,`⏰ റിമൈൻഡർ (10 മിനിറ്റ്): ${lastAction}\n\nനിങ്ങളുടെ ഏരിയ ഇപ്പോഴും നിങ്ങൾക്കായി കാത്തിരിക്കുന്നു! പൂർത്തിയാക്കാൻ HI എന്ന് ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ വിളിക്കുക ${CONTACT_NUMBER}`);
        } else {
          await sendContactWithCallUrl(phone,`⏰ Reminder (10min): ${lastAction}\n\nYour area is still waiting for you! Type HI to resume or Call ${CONTACT_NUMBER}`);
        }
        await logAllChat(phone,'AUTO_REMINDER','REMINDER_10MIN',l,p.stage,`${lastAction}`);
        p.reminders.r1=true;await savePendingToSheet();
      }
      else if(!p.reminders.r2&&diffMin>=30){
        if(l==="ML"){
          await sendContactWithCallUrl(phone,`⏰ 30 മിനിറ്റ് റിമൈൻഡർ: ${lastAction}\n\nഏരിയ ലോക്ക് ചെയ്യാൻ ഇപ്പോൾ പൂർത്തിയാക്കൂ! ${CONTACT_NUMBER}`);
        } else {
          await sendContactWithCallUrl(phone,`⏰ 30min Reminder: ${lastAction}\n\nComplete now to lock your area! ${CONTACT_NUMBER}`);
        }
        p.reminders.r2=true;await savePendingToSheet();
      }
      else if(!p.reminders.r3&&diffMin>=1440){
        await sendImage(phone,ASSETS.posters.opportunity,l==="ML"?`24 മണിക്കൂർ റിമൈൻഡർ: ${lastAction}\n\nഏരിയ കാത്തിരിക്കുന്നു!`:`24h Reminder: ${lastAction}`);
        p.reminders.r3=true;await savePendingToSheet();
      }
      else if(!p.reminders.r4&&diffMin>=4320){
        await sendImage(phone,ASSETS.posters.opportunity,l==="ML"?`അവസാന റിമൈൻഡർ: ${lastAction}\n\nഅവസാന അവസരം!`:`Final Reminder: ${lastAction} - Last chance!`);
        p.reminders.r4=true;await savePendingToSheet();
      }
    }catch(e){console.log("Reminder error",e.message);}
  }
}

setInterval(checkPendingChats,5*60*1000); setInterval(checkReminders,5*60*1000);
app.get('/',(req,res)=>res.send('V17 FINAL - REMINDER WITH LAST ACTION - '+SHEET_ID));
app.get('/webhook',(req,res)=>{if(req.query['hub.verify_token']===VERIFY_TOKEN)res.send(req.query['hub.challenge']);else res.sendStatus(403);});
app.post('/webhook',async(req,res)=>{
 try{
  const msg=req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];if(!msg)return res.sendStatus(200);
  if(processedIds.has(msg.id))return res.sendStatus(200);processedIds.add(msg.id);
  const from=msg.from;let rawId=msg.type==="interactive"?(msg.interactive.button_reply?.id||msg.interactive.list_reply?.id||""):(msg.text?.body?.trim()||"");let input=rawId.toLowerCase();const rawText=msg.text?.body||"";const s=getSession(from);
  await logAllChat(from,(rawText||rawId||"HI").substring(0,30),"INBOUND",s.lang,"CHAT_RECEIVED",`Raw:${rawText||rawId} stage:${s.stage}`);
  if(s.stage==="FORM_NAME"){s.form.name=rawText.trim();s.stage="FORM_CONTACT";setPendingChat(from,s.lang,"FORM_CONTACT",s.lastOpp);await sendText(from,getT(s.lang,"formContact"));return res.sendStatus(200);}
  if(s.stage==="FORM_CONTACT"){s.form.contact=rawText.trim();s.stage="FORM_PLACE";setPendingChat(from,s.lang,"FORM_PLACE",s.lastOpp);await sendText(from,getT(s.lang,"formPlace"));return res.sendStatus(200);}
  if(s.stage==="FORM_PLACE"){s.form.place=rawText.trim();s.stage="FORM_OCCUPATION";setPendingChat(from,s.lang,"FORM_OCCUPATION",s.lastOpp);await sendList(from,getT(s.lang,"formOcc"),"Select",[{title:"Job",rows:[{id:"occ_running",title:"Running business"},{id:"occ_planning",title:"Planning start"},{id:"occ_employee",title:"Employee"}]}]);return res.sendStatus(200);}
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
   if(input==="learn_more"||rawId==="LEARN_MORE"){s.stage="LANG";setPendingChat(from,s.lang,"LANG_SELECTION","");await sendLanguage(from);return res.sendStatus(200);}
   else {s.stage="WELCOME";await sendWelcome(from);return res.sendStatus(200);}
  }
  if(input.startsWith("lang_")){if(input.includes("en"))s.lang="EN";else if(input.includes("hi"))s.lang="HI";else if(input.includes("ml"))s.lang="ML";s.stage="MAIN_MENU";setPendingChat(from,s.lang,"MAIN_MENU","");await logAllChat(from,'LANGUAGE_SELECTED','ACTIVE',s.lang,'MAIN_MENU',`Selected ${s.lang}`);await sendMainMenu(from);return res.sendStatus(200);}
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
  if(input==="emi_10"){await handleEMISelect(from,"EMI_10");return res.sendStatus(200);}
  if(input==="emi_20"){await handleEMISelect(from,"EMI_20");return res.sendStatus(200);}
  if(input==="pay_yes"){await handlePayYes(from);return res.sendStatus(200);}
  if(input==="pay_no"){await handlePayNo(from);return res.sendStatus(200);}
  if(input==="call_now"){await sendContactWithCallUrl(from,`Call Now - ${CONTACT_NUMBER}`);return res.sendStatus(200);}
  if(input==="menu"){await sendMainMenu(from);return res.sendStatus(200);}
  await sendMainMenu(from);res.sendStatus(200);
 }catch(err){console.log("Webhook error:",err.message);res.sendStatus(200);}});
(async()=>{try{pendingChats=await loadPendingFromSheet();driverReminders=await loadDriverReminders();console.log(`V17 READY - ${Object.keys(pendingChats).length} pending + ${driverReminders.length} reminders`);}catch(e){}})();
app.listen(PORT,()=>console.log(`V17 FINAL LIVE on ${PORT}`));
