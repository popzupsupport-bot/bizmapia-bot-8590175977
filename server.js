// =======================================================
// BIZMAPIA - WHATSAPP BOT - FINAL HD ALL INDIA - 2026
// 5 Greetings + 2 Chained Reminders (10min + 10min)
// =======================================================
const express = require('express');
const app = express();
app.use(express.json());

// =======================================================
// CONFIG - REPLACE WITH YOUR GITHUB RAW LINKS AFTER UPLOAD
// =======================================================
const GITHUB_BASE = "https://raw.githubusercontent.com/popzupsupport-bot/bizmapia-bot-8590175977/main/";

const IMAGES = {
  // --- 5 GREETING IMAGES ---
  MAIN: GITHUB_BASE + "bizmapia_welcome_HD_1080.jpg", // Main Chat Welcome
  CUSTOMER: GITHUB_BASE + "bizmapia_customer_welcome_HD.jpg", // Customer App - All India
  DRIVER: GITHUB_BASE + "bizmapia_driver_welcome_HD.jpg", // Driver App - All India
  BUSINESS_REG: GITHUB_BASE + "bizmapia_business_reg_HD.jpg", // Business Registration
  BUSINESS_OPP: GITHUB_BASE + "bizmapia_biz_opp_HD.jpg", // Business Opportunity

  // --- 2 REMINDER IMAGES (Chained 10min + 10min) ---
  BENEFIT_FREE_RECHARGE: GITHUB_BASE + "bizmapia_benefit_reminder_HD.jpg", // After 10 min
  YEARLY_DISCOUNT: GITHUB_BASE + "bizmapia_1year_discount_HD.jpg" // After 20 min (10 min after previous)
};

// Store active reminder timers to avoid duplicate
const activeReminders = new Map();

// =======================================================
// WHATSAPP SEND FUNCTION - EDIT THIS WITH YOUR API
// =======================================================
async function sendWhatsAppMessage(phone, content) {
  // REPLACE WITH YOUR WHATSAPP API (Meta / WATI / Interakt etc)
  // Example for Meta Cloud API:
  /*
  await fetch(`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "image",
      image: { link: content.image, caption: content.caption }
    })
  });
  */
  console.log(`Sending to ${phone}:`, content.caption?.substring(0,50));
}

// =======================================================
// GREETING LOGIC - BASED ON USER SELECTION
// =======================================================
function getGreetingForType(type) {
  switch(type) {
    case "customer":
    case "customer_app":
      return {
        image: IMAGES.CUSTOMER,
        text: `*Welcome to Bizmapia Customer App!* 🙏\n\n= NOW AVAILABLE TO SERVE YOU - ALL INDIA =\n\n✅ Discount Rates on All Trips\n✅ Auto, Car, Bike, Premium - All Available\n✅ 24x7 Service Anywhere in India\n\nReply with your requirement!`
      };
    case "driver":
    case "driver_app":
      return {
        image: IMAGES.DRIVER,
        text: `*Welcome to Bizmapia Driver App!* 🚕\n\n= NOW AVAILABLE TO SERVE YOU - ALL INDIA =\n\n✅ Low Daily Charging Plans\n✅ 33/- Recharge - Unlimited Trips\n✅ Earn Daily Incentive + Income\n\nDownload App & Register Now!`
      };
    case "business_reg":
    case "business_register":
      return {
        image: IMAGES.BUSINESS_REG,
        text: `*Welcome to Bizmapia Business Listing!* 🏪\n\nGet More Customers from Local Search!\n\n✅ 3 Plans: Basic ₹99, Silver ₹199, Golden ₹299\n✅ Advertise Offers as Posters & Videos\n✅ Grow Visibility & Sales\n\nReply YES to register!`
      };
    case "business_opp":
    case "opportunity":
      return {
        image: IMAGES.BUSINESS_OPP,
        text: `*Welcome to Bizmapia Business Opportunities!* 💼\n\n= Get Business Opportunity From Anywhere in India =\n\n✅ States, Districts, Municipalities, Corporations, Panchayaths\n✅ Earn Daily & Monthly Income\n✅ Meroating Income Model\n\nTogether We Create More Opportunities!`
      };
    default:
      return {
        image: IMAGES.MAIN,
        text: `*Welcome to Bizmapia Chat!* 👋\n\nWe are here to help you with:\n\n1️⃣ Customer App - Book Rides\n2️⃣ Driver App - Join as Driver\n3️⃣ Business Registration - List Your Shop\n4️⃣ Business Opportunity - Franchise\n\nReply with option number!`
      };
  }
}

// =======================================================
// CHAINED REMINDER - 10 MIN + 10 MIN LOGIC
// =======================================================
function scheduleChainedReminders(phone) {
  // Clear existing timer if any
  if (activeReminders.has(phone)) {
    clearTimeout(activeReminders.get(phone).timer1);
    clearTimeout(activeReminders.get(phone).timer2);
  }

  // TIMER 1: After 10 minutes - Benefit Free Recharge
  const timer1 = setTimeout(async () => {
    console.log(`Sending 10-min Benefit Reminder to ${phone}`);
    await sendWhatsAppMessage(phone, {
      image: IMAGES.BENEFIT_FREE_RECHARGE,
      caption: `🔔 *Reminder - Benefit: Free Recharge by Listing Vehicle!* (1/2)\n\n*കേരളത്തിലെ ഏത് ടൗണിലും കേവലം 33 രൂപ റീചാർജിൽ 24 മണിക്കൂർ പരിധിയില്ലാത്ത ട്രിപ്പുകൾ!*\n\n✅ *DAILY CHARGING PLANS:*\n• 33 Rupees Plan: Min Charge 30, Additional 22.5/KM\n• 49 Rupees Plan: Min Charge 140, Additional 27/KM\n\n🎁 *INCENTIVE:*\n• GET 100 KM for (Hatchback)\n• Rs.200/- (Sedan)\n• Rs.250/- (Premium/SUV)\n\n👉 *Action:* Login to Driver App > Add Driver & Vehicle Details > Get Approval > Type "TEST RUN"\n\nAvailable in all towns in INDIA 🇮🇳\n#bizmapia #keralataxi`
    });

    // TIMER 2: 10 minutes AFTER Timer 1 (Total 20 min) - Yearly Discount
    const timer2 = setTimeout(async () => {
      console.log(`Sending 20-min Yearly Discount Reminder to ${phone}`);
      await sendWhatsAppMessage(phone, {
        image: IMAGES.YEARLY_DISCOUNT,
        caption: `🎉 *Reminder 2/2 - Benefit 1 Year Subscription & Get Discount!*\n\n*Save More with Yearly Plan!*\n\n🟢 *Basic Plan:*\nMonthly ₹99/- | Yearly ₹999/- | *You Save ₹198/-*\n\n⚪ *Silver Plan:*\nMonthly ₹199/- | Yearly ₹1999/- | *You Save ₹398/-*\n\n🟡 *Golden Plan:*\nMonthly ₹299/- | Yearly ₹2999/- | *You Save ₹598/-*\n\n✨ *Key Benefits:*\n📍 Get More Local Visibility\n🔍 Customer Search\n📈 Grow Your Business\n🤝 Build Trust\n\n📢 *Advertise Your Business Locally* as posters & videos and get more sales!\n\nReply *YEARLY* to activate discount now!`
      });
      activeReminders.delete(phone);
    }, 10 * 60 * 1000); // 10 minutes after first reminder

    // Save timer2
    const existing = activeReminders.get(phone) || {};
    activeReminders.set(phone, { ...existing, timer2 });

  }, 10 * 60 * 1000); // 10 minutes = 600,000 ms

  activeReminders.set(phone, { timer1, timer2: null });
  console.log(`Chained reminders scheduled for ${phone} - 10min + 10min`);
}

function cancelReminders(phone) {
  if (activeReminders.has(phone)) {
    const { timer1, timer2 } = activeReminders.get(phone);
    if (timer1) clearTimeout(timer1);
    if (timer2) clearTimeout(timer2);
    activeReminders.delete(phone);
    console.log(`Reminders cancelled for ${phone} - user completed action`);
  }
}

// =======================================================
// WEBHOOK - MAIN CHAT HANDLER
// =======================================================
app.post('/webhook', async (req, res) => {
  const phone = req.body.phone || req.body.from;
  const message = (req.body.message || "").toLowerCase();

  let greeting;

  if (message.includes("customer") || message == "1") {
    greeting = getGreetingForType("customer");
  } else if (message.includes("driver") || message == "2") {
    greeting = getGreetingForType("driver");
    // START CHAINED REMINDER FOR DRIVER
    scheduleChainedReminders(phone);
  } else if (message.includes("business") && message.includes("regist")) {
    greeting = getGreetingForType("business_reg");
    // START CHAINED REMINDER FOR BUSINESS
    scheduleChainedReminders(phone);
  } else if (message.includes("opportunity") || message == "4") {
    greeting = getGreetingForType("business_opp");
  } else if (message.includes("test run") || message.includes("completed") || message.includes("yearly")) {
    // User completed action - cancel reminders
    cancelReminders(phone);
    greeting = {
      image: null,
      text: `✅ Thank you! Your registration is being verified. Our team will contact you shortly! 🙏`
    };
  } else {
    greeting = getGreetingForType("main");
  }

  // Send greeting
  await sendWhatsAppMessage(phone, {
    image: greeting.image,
    caption: greeting.text
  });

  res.sendStatus(200);
});

app.get('/', (req, res) => res.send('Bizmapia Bot - ALL INDIA HD - Running ✅'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
