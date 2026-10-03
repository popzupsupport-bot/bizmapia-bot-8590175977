const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// In-memory user session - use DB in production
const users = new Map(); // from -> {lang, category, step, timer, data}

const LINKS = {
  POSTER_CUSTOMER: "https://bizmapia.com/poster-customer.jpg",
  APP_LINK: "https://play.google.com/store/apps/details?id=com.bizmapia",
  DEMO_DRIVER: "https://bizmapia.com/demo-driver.mp4",
  DEMO_BUSINESS: "https://bizmapia.com/demo-business.mp4",
  DEMO_FRANCHISEE_DISTRICT: "https://bizmapia.com/district.mp4",
  DEMO_FRANCHISEE_CORP: "https://bizmapia.com/corp.mp4",
  DEMO_FRANCHISEE_MUNI: "https://bizmapia.com/muni.mp4",
  DEMO_TAXI: "https://bizmapia.com/taxi.mp4",
  DEMO_DIRECTORY: "https://bizmapia.com/directory.mp4",
  POSTER_BIZ_OPP: "https://bizmapia.com/biz-opp.jpg"
};

async function sendMessage(to, payload) {
  await axios.post(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    { messaging_product: "whatsapp", to,...payload },
    { headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` } }
  );
}
function text(body) { return { type: "text", text: { body } }; }
function buttons(body, btns) {
  return {
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: { buttons: btns.map(b => ({ type: "reply", reply: { id: b.id, title: b.title } })) }
    }
  };
}

app.get('/', (req,res)=>res.send('BizMapia Funnel Bot Live'));
app.get('/webhook', (req,res)=>{
  if(req.query['hub.mode']==='subscribe' && req.query['hub.verify_token']===VERIFY_TOKEN) res.send(req.query['hub.challenge']);
  else res.sendStatus(403);
});

app.post('/webhook', async (req,res)=>{
  try{
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg){ return res.sendStatus(200); }
    const from = msg.from;
    const input = (msg.text?.body || msg.button?.text || msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || "").trim();
    const lower = input.toLowerCase();

    if(!users.has(from)) users.set(from, { lang: null, category: null, step: 0, adRef: msg.referral || null });
    const user = users.get(from);
    console.log(`[${from}] Step:${user.step} Cat:${user.category} Input:${input}`);

    // STEP 0 - Language Selection (First Message from Social Media)
    if(!user.lang){
      if(["a","english"].includes(lower)){
        user.lang="EN"; user.step=1;
        await sendMessage(from, buttons(
          `Welcome to Bizmapia\nThank you for your enquiry. We're happy to help you learn more about Bizmapia platform & Business opportunities.\n\nPlease select to get more details:`,
          [{id:"A",title:"A - Customer"},{id:"B",title:"B - Driver"},{id:"C",title:"C - Business"}]
        ));
        // Add D option second message due to 3-button limit
        await sendMessage(from, buttons(`Select:`, [{id:"D",title:"D - Opportunity"}]));
      } else if(["b","hindi"].includes(lower)){
        user.lang="HI";
        await sendMessage(from, text(`Hindi flow coming soon. Please type A`));
        user.lang="EN"; user.step=1;
      } else if(["c","malayalam"].includes(lower)){
        user.lang="ML"; user.step=1;
        await sendMessage(from, text(`Malayalam - Welcome to Bizmapia... Type A/B/C/D`));
      } else {
        await sendMessage(from, buttons(
          `Welcome to Bizmapia\nThank you for your enquiry. We're happy to help you learn more about Bizmapia platform & Business opportunities.\nPlease select your preferred language from below :-`,
          [{id:"A",title:"A English"},{id:"B",title:"B Hindi"},{id:"C",title:"C Malayalam"}]
        ));
      }
      return res.sendStatus(200);
    }

    // CATEGORISE
    if(!user.category){
      if(["a","customer","A - Customer"].includes(input) || lower.includes("customer")){
        user.category="A"; user.step=1;
        await sendMessage(from, text(`*Customer Welcome* 👋\nPoster: ${LINKS.POSTER_CUSTOMER}\nApp Link: ${LINKS.APP_LINK}\n\nStep - 2: Activate your trip discounts`));
        await sendMessage(from, buttons(`Click to Activate Trip Discounts & get offers`, [{id:"ACTIVATE_TRIP", title:"Activate Discounts"}]));
      } else if(input.startsWith("B") || lower.includes("driver")){
        user.category="B"; user.step=1;
        await sendMessage(from, text(`*Driver Welcome* 🚕\nPoster & App: ${LINKS.APP_LINK}\n\nStep-2 How to list your vehicle?`));
        await sendMessage(from, text(`Demo Video: ${LINKS.DEMO_DRIVER}\n\nStep-3 Benefit free recharge by listing your vehicle\nPoster: ${LINKS.POSTER_CUSTOMER}`));
        await sendMessage(from, buttons(`Claim your free recharge now`, [{id:"CLAIM_RECHARGE_DRIVER", title:"Claim Recharge"}]));
      } else if(input.startsWith("C") || lower.includes("business") &&!lower.includes("opportunity")){
        user.category="C"; user.step=1;
        await sendMessage(from, text(`*Business Registration Welcome* 🏪\nPoster & App: ${LINKS.APP_LINK}`));
        await sendMessage(from, text(`Step-2 How to list your business?\nDemo: ${LINKS.DEMO_BUSINESS}\n\nStep-3 Benefit 1 Year subscription and get discount\nPoster: ${LINKS.POSTER_CUSTOMER}`));
        await sendMessage(from, buttons(`Claim Subscription Discount`, [{id:"CLAIM_SUBS", title:"Claim Discount"}]));
      } else if(input.startsWith("D") || lower.includes("opportunity")){
        user.category="D"; user.step=1;
        await sendMessage(from, text(`*Business Opportunity Welcome* 💼\nPoster: ${LINKS.POSTER_BIZ_OPP}\n\nStep-2 Know about "bizmapia"`));
        await sendMessage(from, text(`Demo Video: ${LINKS.DEMO_DIRECTORY}\n\nStep-3 Acknowledge - Select opportunity:`));
        await sendMessage(from, buttons(`Select Franchisee Type:`, [{id:"DISTRICT",title:"District Level"},{id:"CORP",title:"Corporation"},{id:"MUNI",title:"Municipality"}]));
        await sendMessage(from, buttons(`More Options:`, [{id:"TAXI_CENTER",title:"Taxi Business"},{id:"DIR_CENTER",title:"Directory Center"}]));
      } else {
        await sendMessage(from, buttons(`Select any one below to get more details`, [{id:"A",title:"A Customer"},{id:"B",title:"B Driver"},{id:"C",title:"C Business"}]));
      }
      return res.sendStatus(200);
    }

    // CATEGORY A FLOW
    if(user.category==="A"){
      if(lower.includes("activate")){
        console.log(`>> Bulk message data ADD for ${from} - CUSTOMER`);
        await sendMessage(from, text(`✅ Your trip discounts activated! You will get bulk offers now. Thank you!`));
        user.step=99; // end
      }
    }

    // CATEGORY B & C FLOW - With Timers (After confirming status manually)
    if(user.category==="B" || user.category==="C"){
      if(input.startsWith("CLAIM")){
        console.log(`>> Bulk message data ADD for ${from} - ${user.category}`);
        await sendMessage(from, text(`✅ Claimed! Your free benefit activated. Our team will manually confirm status.`));
        user.step=5;
        // Timer Logic - 1 Hour Reminder
        setTimeout(async()=>{
          if(users.get(from)?.step===5){
            await sendMessage(from, text(`⏰ Your opportunity is going to expire soon! (1 Hour reminder)`));
            await sendMessage(from, buttons(`Re-activate your free benefit`, [{id:"REACTIVATE", title:"Re-activate Now"}]));
            users.get(from).step=6;
          }
        }, 60*60*1000); // 1 hour

        setTimeout(async()=>{
          if([6].includes(users.get(from)?.step)){
            await sendMessage(from, buttons(`Need Help? (48 Hour)`, [{id:"HELP_48",title:"Need Help"}]));
            users.get(from).step=7;
          }
        }, 48*60*60*1000); // 48 hour

        setTimeout(async()=>{
          if(users.get(from)?.step===7){
            await sendMessage(from, text(`😔 Sorry message - Your opportunity expired after 72 Hours.`));
            console.log(`>> Bulk message data REMOVE for ${from}`);
            users.get(from).step=8;
          }
        }, 72*60*60*1000); // 72 hour
      }
      if(lower.includes("reactivate")){ await sendMessage(from, text(`✅ Re-activated!`)); user.step=5; }
    }

    // CATEGORY D FLOW
    if(user.category==="D"){
      if(["DISTRICT","CORP","MUNI","TAXI_CENTER","DIR_CENTER"].includes(input)){
        const videoMap = { DISTRICT:LINKS.DEMO_FRANCHISEE_DISTRICT, CORP:LINKS.DEMO_FRANCHISEE_CORP, MUNI:LINKS.DEMO_FRANCHISEE_MUNI, TAXI_CENTER:LINKS.DEMO_TAXI, DIR_CENTER:LINKS.DEMO_DIRECTORY };
        await sendMessage(from, text(`*${input}*\nDemo Video: ${videoMap[input]}\n\nStep-5 Feedback: Are you Interested?`));
        await sendMessage(from, buttons(`Interested?`, [{id:"INTERESTED",title:"Yes Interested"},{id:"CALL_US",title:"Call Us"},{id:"BOOK_CALLBACK",title:"Book Call Back"}]));
        user.step=4; user.selectedOpp=input;
      }
      if(lower.includes("interested") || input==="INTERESTED"){
        await sendMessage(from, buttons(`Great! Choose action (24 Hour):`, [{id:"CALL_US",title:"Call Us"},{id:"BOOK_CALLBACK",title:"Book Callback"}]));
        console.log(`INTIMATION NEEDED for ${from} - Interested in ${user.selectedOpp}`);
        user.step=5;
        // 48 Hour reminder for D
        setTimeout(async()=>{
          if(users.get(from)?.step===5){
            await sendMessage(from, text(`Stuck for a decision? (48 Hour Reminder)`));
            await sendMessage(from, buttons(`Contact Us`, [{id:"CALL_US",title:"Call Us"},{id:"BOOK_CALLBACK",title:"Book Call Back"},{id:"OTHER_OPP",title:"Other Opportunity"}]));
            users.get(from).step=6;
          }
        }, 48*60*60*1000);
      }
      if(lower.includes("call us") || input==="CALL_US"){
        console.log(`INTIMATION NEEDED - CALL US ${from}`);
        await sendMessage(from, text(`📞 Our team will call you from +91 8590175977 within 10 mins!`));
      }
      if(lower.includes("book") || input==="BOOK_CALLBACK"){
        console.log(`INTIMATION NEEDED - BOOK CALLBACK ${from}`);
        await sendMessage(from, text(`Please share your preferred Date/Time for call back (Ex: Tomorrow 10 AM)`));
      }
      if(input==="OTHER_OPP"){ user.category=null; await sendMessage(from, text(`Go back to Step-4 - Select other opportunity`)); }
      if(lower.includes("not interested")){
        await sendMessage(from, text(`No problem! Go to Customer Greeting\nPoster: ${LINKS.POSTER_CUSTOMER}\nApp: ${LINKS.APP_LINK}`));
        await sendMessage(from, buttons(`Activate your trip discounts`, [{id:"ACTIVATE_TRIP",title:"Activate Discounts"}]));
        console.log(`>> Bulk message data ADD for ${from} - Customer from D`);
        user.category="A";
      }
      // Step-7 Yo are not selected anything!
      if(user.step===4 &&!["DISTRICT","CORP","MUNI","TAXI_CENTER","DIR_CENTER","INTERESTED","CALL_US","BOOK_CALLBACK"].includes(input)){
        await sendMessage(from, text(`You are not selected anything!`));
        await sendMessage(from, buttons(`Select:`, [{id:"CALL_US",title:"Call Us"},{id:"BOOK_CALLBACK",title:"Book Call Back"}]));
      }
    }

    res.sendStatus(200);
  }catch(e){
    console.error(e.response?.data || e.message);
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT||10000;
app.listen(PORT,()=>console.log(`Funnel Bot running on ${PORT}`));
