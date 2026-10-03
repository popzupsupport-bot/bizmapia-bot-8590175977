const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const PORT = process.env.PORT || 3000;

// FINAL VIDEO LINKS - LOCKED
const LINKS = {
  demo_bizmapia: "https://youtu.be/8ZnDlvbgG_c?si=VZbpfbs3KJIYjJAJ",
  demo_district: "https://youtu.be/_y2JeFHBnqg?si=uUK-w1EbY0btOrjb",
  demo_corp: "https://youtu.be/GqolfqgHiCU?si=fKRSB_z04VIdtZMp",
  demo_muni: "https://youtu.be/GqolfqgHiCU?si=fKRSB_z04VIdtZMp",
  demo_business_center: "https://youtu.be/r0X77XfmF94?si=K8PJSEAK3YP-KVKi",
};

async function send(to, data) {
  await axios.post(`https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
  { messaging_product: "whatsapp", to,...data },
  { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } });
}
const btn = (body, buttons) => ({ type:"interactive", interactive:{ type:"button", body:{text:body}, action:{buttons:buttons.map(b=>({type:"reply", reply:b}))}} });

// WEBHOOK VERIFY
app.get('/webhook', (req,res)=>{
  if(req.query['hub.verify_token']===VERIFY_TOKEN) res.send(req.query['hub.challenge']);
  else res.sendStatus(403);
});

// MAIN REPLY LOGIC
app.post('/webhook', async (req,res)=>{
  try {
    const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if(!msg) return res.sendStatus(200);
    const from = msg.from;
    const text = (msg.text?.body || "").toLowerCase();
    const id = msg.interactive?.button_reply?.id || "";

    console.log(`INCOMING ${from}: ${text} ${id}`);

    // WELCOME MENU
    if(text.includes("hi") || text.includes("hello") || text.includes("menu") || id==="MENU") {
      await send(from, btn("Welcome to Bizmapia! 🙏\nOne Platform... Endless Opportunities\n\nSelect Service:", [
        {id:"CAT_A", title:"A. Customer"},
        {id:"CAT_B", title:"B. Driver"},
        {id:"CAT_C", title:"C. Business Reg"}
      ]));
      await send(from, btn("More Options:", [
        {id:"CAT_D", title:"D. Business Opp"},
        {id:"FEED_CALL", title:"📞 Call Us"},
        {id:"FEED_CHAT", title:"💬 Chat Team"}
      ]));
    }
    // CAT A - CUSTOMER (SAME)
    else if(id==="CAT_A" || text.includes("customer")) {
      await send(from, { type:"text", text:{ body:`🚕 *Bizmapia Online Taxi - Customer*\n\nAvailable ALL INDIA\nBook Auto / Cab / Bike in 2 min\n\n📲 Download App: bizmapia.com` }});
      await send(from, btn("Customer Options:", [
        {id:"CAT_B", title:"Become Driver"},
        {id:"CAT_C", title:"List Business"},
        {id:"MENU", title:"🔙 Main Menu"}
      ]));
    }
    // CAT B - DRIVER - NEW SCRIPT - CHAT TO TEAM (NO VIDEO)
    else if(id==="CAT_B" || text.includes("driver")) {
      await send(from, { type:"text", text:{ body:`🚕 *Welcome Driver to Bizmapia Online Taxi!*\n\nAvailable to Serve You ALL INDIA\n\n*Benefit:*\nAuto - Rs.33 / Day\nCab - Rs.49 / Day\nNo Commission - Unlimited Rides` }});
      await send(from, { type:"text", text:{ body:`🚕 How to list your vehicle?\n\n💬 Chat to our team for vehicle listing assistance` }});
      await send(from, btn("Next Step:", [
        {id:"FEED_CHAT_TEAM_DRIVER", title:"💬 Chat to Our Team"},
        {id:"FEED_CALL", title:"📞 Call Us"},
        {id:"MENU", title:"🔙 Main Menu"}
      ]));
    }
    // CAT C - BUSINESS REG - NEW SCRIPT - CHAT TO TEAM (NO VIDEO)
    else if(id==="CAT_C" || text.includes("business reg")) {
      await send(from, { type:"text", text:{ body:`🏪 *Welcome to Bizmapia Business Registration!*\n\nAvailable to Serve You ALL INDIA\n\nList your Shop / Service & Get More Customers` }});
      await send(from, { type:"text", text:{ body:`🏪 How to list your business?\n\n💬 Chat to our team for business listing assistance` }});
      await send(from, btn("Next Step:", [
        {id:"FEED_CHAT_TEAM_BIZ", title:"💬 Chat to Our Team"},
        {id:"FEED_CALL", title:"📞 Call Us"},
        {id:"MENU", title:"🔙 Main Menu"}
      ]));
    }
    // CAT D - BUSINESS OPPORTUNITY - NEW VIDEOS
    else if(id==="CAT_D" || text.includes("opportunity")) {
      await send(from, { type:"text", text:{ body:`💼 *Bizmapia Business Opportunity*\n\nBecome Partner & Earn Monthly\n\nSelect Type:` }});
      await send(from, btn("Business Types:", [
        {id:"OPP_KNOW", title:"Know Business Opp"},
        {id:"OPP_DISTRICT", title:"District Franchise"},
        {id:"OPP_CORP", title:"Corp Franchise"}
      ]));
      await send(from, btn("More:", [
        {id:"OPP_MUNI", title:"Muni Franchise"},
        {id:"OPP_CENTER", title:"Business Center"},
        {id:"MENU", title:"🔙 Main Menu"}
      ]));
    }
    // OPP VIDEOS
    else if(id==="OPP_KNOW") await send(from, { type:"text", text:{ body:`🎥 Know Business Opp\n${LINKS.demo_bizmapia}` }});
    else if(id==="OPP_DISTRICT") await send(from, { type:"text", text:{ body:`🎥 District Franchisee\n${LINKS.demo_district}` }});
    else if(id==="OPP_CORP") await send(from, { type:"text", text:{ body:`🎥 Corporation Franchise\n${LINKS.demo_corp}` }});
    else if(id==="OPP_MUNI") await send(from, { type:"text", text:{ body:`🎥 Municipality Franchise\n${LINKS.demo_muni}` }});
    else if(id==="OPP_CENTER") await send(from, { type:"text", text:{ body:`🎥 Business Center (All Types)\n${LINKS.demo_business_center}` }});

    // CHAT TO TEAM - DRIVER
    else if(id==="FEED_CHAT_TEAM_DRIVER") {
      await send(from, { type:"text", text:{ body:`💬 *Our Team Ready for Vehicle Listing!*\n\nPlease share:\n1. Vehicle Type (Auto/Car/Bike)\n2. District\n3. RC Photo\n\nExecutive will call in 5 min\n📞 +91 7025630644` }});
    }
    // CHAT TO TEAM - BUSINESS
    else if(id==="FEED_CHAT_TEAM_BIZ") {
      await send(from, { type:"text", text:{ body:`💬 *Our Team Ready for Business Listing!*\n\nPlease share:\n1. Business Name\n2. Category\n3. District & Location\n4. Business Photo\n\nExecutive will call in 5 min\n📞 +91 7025630644` }});
    }
    else if(id==="FEED_CALL" || text.includes("call")) {
      await send(from, { type:"text", text:{ body:`📞 Call Us: +91 7025630644\nAvailable 9AM - 9PM` }});
    }

    res.sendStatus(200);
  } catch(e){ console.error(e.response?.data || e.message); res.sendStatus(200); }
});

app.get('/', (req,res)=> res.send('Bizmapia Bot Live - 7025630644'));
app.listen(PORT, ()=> console.log(`Bot running on ${PORT}`));
