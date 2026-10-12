// ============================================================
// server.js - V24.5 - WhatsApp Cloud API Direct - FULL CODE
// PAN INDIA | ML+EN+HI | All 23 Changes + Real WhatsApp Send
// ============================================================
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
app.use(express.json());

// ===================== CONFIG - SET IN RENDER ENV =====================
const RAZORPAY_LINK = "https://rzp.io/l/bizmapia5000";
const SUPPORT_NUMBER = "97784 61515";
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "bizmapia123"; // You set this in Meta Dashboard
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // From Meta
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID; // From Meta
const GRAPH_URL = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

let userStates = {};
const reminderTimers = {};

// ===================== HEALTH =====================
app.get('/', (req,res)=> res.status(200).send(`✅ V24.5 LIVE - Cloud API Connected - Port ${process.env.PORT}`));

// ===================== VERIFY WEBHOOK - META NEEDS THIS =====================
app.get('/webhook', (req,res)=>{
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if(mode === 'subscribe' && token === VERIFY_TOKEN){
    console.log("WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else res.sendStatus(403);
});

// ===================== REAL WHATSAPP SEND - CLOUD API =====================
async function sendMessage(to, text, buttons=[]){
  if(!WHATSAPP_TOKEN ||!PHONE_NUMBER_ID){
    console.log("SEND (No token set):", to, text.substring(0,100));
    return;
  }

  try{
    // If buttons exist, send interactive buttons (max 3)
    if(buttons && buttons.length > 0){
      // Separate URL buttons
      const urlBtn = buttons.find(b=>b.type==="url");
      const quickBtns = buttons.filter(b=>b.type!=="url").slice(0,3);

      if(quickBtns.length>0){
        const components = quickBtns.map(b=>({
          type:"reply",
          reply:{ id: b.payload, title: b.title.substring(0,20) }
        }));
        await axios.post(GRAPH_URL, {
          messaging_product:"whatsapp",
          to: to,
          type:"interactive",
          interactive:{
            type:"button",
            body:{ text: text.substring(0,1024) },
            action:{ buttons: components }
          }
        },{
          headers:{ Authorization:`Bearer ${WHATSAPP_TOKEN}`, "Content-Type":"application/json" }
        });
      }
      // If URL button also, send it as separate message with link
      if(urlBtn){
        await axios.post(GRAPH_URL, {
          messaging_product:"whatsapp",
          to: to,
          type:"text",
          text:{ body: `${urlBtn.title}: ${urlBtn.url}` }
        },{ headers:{ Authorization:`Bearer ${WHATSAPP_TOKEN}` } });
      }
    } else {
      // Plain text
      await axios.post(GRAPH_URL, {
        messaging_product:"whatsapp",
        to: to,
        type:"text",
        text:{ body: text }
      },{ headers:{ Authorization:`Bearer ${WHATSAPP_TOKEN}` } });
    }
    console.log(`✅ SENT to ${to}`);
  }catch(e){
    console.error("Send Error:", e.response?.data || e.message);
  }
}

function detectLang(t=""){ if(/[അ-ഹ]/.test(t)) return 'ml'; if(/[\u0900-\u097F]/.test(t)) return 'hi'; return 'en'; }
function getBackButtons(lang){
  const m={ ml:{back:"⬅️ മുൻ മെനു", main:"🏠 പ്രധാന മെനു", later:"⏰ പിന്നീട്"}, en:{back:"⬅️ Previous", main:"🏠 Main Menu", later:"⏰ Remind Later"}, hi:{back:"⬅️ पिछला मेनू", main:"🏠 मुख्य मेनू", later:"⏰ बाद में"} };
  const l=m[lang]||m.en;
  return [{title:l.back, payload:"GO_BACK"}, {title:l.main, payload:"MAIN_MENU"}, {title:l.later, payload:"REMIND_LATER"}];
}
function getSimpleBack(lang){
  const m={ ml:{back:"⬅️ മുൻ മെനു", main:"🏠 പ്രധാന മെനു"}, en:{back:"⬅️ Previous", main:"🏠 Main Menu"}, hi:{back:"⬅️ पिछला मेनू", main:"🏠 मुख्य मेनू"} };
  const l=m[lang]||m.en;
  return [{title:l.back, payload:"GO_BACK"}, {title:l.main, payload:"MAIN_MENU"}];
}
function set5MinReminder(uid,type,data){ if(reminderTimers[uid]) clearTimeout(reminderTimers[uid]); reminderTimers[uid]=setTimeout(()=>{ if(type==='payment') sendPaymentReminder(uid,data); }, 5*60*1000); }
function clearReminder(uid){ if(reminderTimers[uid]) clearTimeout(reminderTimers[uid]); }

// ===================== FLOWS - SAME AS V24.4 =====================
function sendMainMenu(uid, lang='en'){
  const msg = lang==='ml'?`👋 സ്വാഗതം BizMapia-ലേക്ക് - PAN INDIA
🚕 റൈഡ്
🏠 ഫ്രാഞ്ചൈസി - നിങ്ങളുടെ ജില്ലയിൽ ബിസിനസ്സ് തുടങ്ങൂ - All India മോഡൽ
👇 തിരഞ്ഞെടുക്കുക:`: lang==='hi'?`👋 BizMapia में स्वागत है - पूरे भारत में
🚕 राइड
🏠 फ्रैंचाइज़ी
👇 चुनें:`:`👋 Welcome to BizMapia - PAN INDIA
🚕 Ride
🏠 Franchise - Start in your district - All India model
👇 Select:`;
  sendMessage(uid, msg, [{title:lang==='ml'?"🏠 ഫ്രാഞ്ചൈസി": lang==='hi'?"🏠 फ्रैंचाइज़ी":"🏠 Franchise", payload:"FRANCHISE"}, {title:"📞 97784 61515", payload:"CALL_SUPPORT"}]);
}
function sendFranchiseIntro(uid, lang){ sendMessage(uid, lang==='ml'?"ഫ്രാഞ്ചൈസി അവസരങ്ങൾ - PAN INDIA - ചുവടെയുള്ള ലിങ്കിൽ ജില്ലയുണ്ടോ എന്ന് നോക്കൂ":"Franchise Opportunities - PAN INDIA - Check district list", [{title:lang==='ml'?"ബിസിനസ്സ് അവസരങ്ങൾ": lang==='hi'?"व्यापार के अवसर":"Business Opportunities", payload:"BUSINESS_OPPS"},...getSimpleBack(lang)]); }
function sendDistrictFee(uid, lang){ sendMessage(uid, lang==='ml'?`💰 ജില്ലാ ഫ്രാഞ്ചൈസി ഫീസ്: 10-15 ലക്ഷം - PAN INDIA\n✅ 5Y MOU ✅ 12M Marketing ✅ Area Lock\nEMI - 5L Down + Rest`:`💰 District Franchise: 10-15L - PAN INDIA\n✅ 5Y MOU ✅ 12M Marketing ✅ Area Lock\nEMI - 5L Down + Rest`, [{title:lang==='ml'?"EMI ഓപ്ഷൻ": lang==='hi'?"EMI विकल्प":"EMI Options", payload:"SHOW_EMI"}, {title:"💳 Pay Now", payload:"PAY_NOW", type:"url", url:RAZORPAY_LINK},...getSimpleBack(lang)]); }
function sendEMIOptions(uid, lang){ sendMessage(uid, `💳 EMI - 2 Options - PAN INDIA\nPlan1: 10M - 5L Down + 1Lx10\nPlan2: 20M - 5L Down + 50kx20`, [{title:"Plan 1: 10M - 1L/M", payload:"EMI_PLAN_1"}, {title:"Plan 2: 20M - 50K/M", payload:"EMI_PLAN_2"},...getSimpleBack(lang)]); }
function sendPaymentMessage(uid, lang, plan){ sendMessage(uid, `✅ Down Payment ശേഷം - PAN INDIA\n- Area LOCKED\n- 5Y MOU\nLock now: ${plan}\nLink: ${RAZORPAY_LINK}`, [{title:lang==='ml'?"💳 ഇപ്പോൾ പേയ്മെന്റ് ചെയ്യൂ": lang==='hi'?"💳 अभी भुगतान करें":"💳 Pay Now", type:"url", url:RAZORPAY_LINK},...getBackButtons(lang)]); set5MinReminder(uid,'payment',{lang,plan}); }
function sendPaymentReminder(uid,data){ sendMessage(uid, (data.lang==='ml'?"⏰ പേയ്മെന്റ് ചെയ്തോ? 5 മിനിറ്റ് ആയി! ഏരിയ മറ്റൊരാൾക്ക് ലഭിക്കും - All India!": data.lang==='hi'?"⏰ क्या भुगतान किया? एरिया किसी और को मिल सकता है!":"⏰ Did you pay? Area may go to someone else!")+`\n${RAZORPAY_LINK}`, [{title:"✅ Yes Paid", payload:"PAYMENT_DONE"},...getBackButtons(data.lang)]); }
function sendDistrictSupport(uid,lang){ sendMessage(uid, lang==='ml'?"ജില്ലാ സപ്പോർട്ട് - 12M Marketing + 6M Rent + 6M Salary - PAN INDIA":"District Support - 12M Marketing + 6M Rent + 6M Salary - PAN INDIA", [{title:lang==='ml'?"മുന്നൊരുക്കങ്ങൾ": lang==='hi'?"तैयारी":"Preparations", payload:"PREPARATION_LIST"},...getSimpleBack(lang)]); }
function handlePaymentDone(uid,lang){ clearReminder(uid); userStates[uid]={step:1,data:{},lang,history:[]}; sendMessage(uid, lang==='ml'?"✅ പേയ്മെന്റ്! Area Locked PAN INDIA\n📋 1/4: ആധാർ പ്രകാരമുള്ള പേര്:":lang==='hi'?"✅ भुगतान! Area Locked\n📋 1/4: आधार के अनुसार नाम:":"✅ Payment! Area Locked PAN INDIA\n📋 1/4: Full name as per Aadhaar:", getSimpleBack(lang)); }
function handleOnboarding(uid,text){ const s=userStates[uid]; if(!s) return; if(s.step===1){ s.data.name=text; s.history.push(1); s.step=2; sendMessage(uid, `📋 2/4: District/City? (PAN INDIA)`, getSimpleBack(s.lang)); } else if(s.step===2){ s.data.district=text; s.history.push(2); s.step=3; sendMessage(uid, `📋 3/4: Job/Experience?`, getSimpleBack(s.lang)); } else if(s.step===3){ s.data.experience=text; s.history.push(3); s.step=4; sendMessage(uid, `📋 4/4: When can you start? Select date:`, [{title:"📅 Today", payload:"DATE_TODAY"}, {title:"📅 Tomorrow", payload:"DATE_TOMORROW"}, {title:"📅 This Week", payload:"DATE_THIS_WEEK"},...getBackButtons(s.lang)]); } }
function handleDate(uid,val){ const s=userStates[uid]; const data={wa:uid,name:s.data.name,district:s.data.district,exp:s.data.experience,date:val,time:new Date().toISOString()}; fs.appendFileSync('/tmp/leads.txt', JSON.stringify(data)+"\n"); console.log("LEAD:",data); sendMessage(uid, `✅ Thanks ${s.data.name}! Date: ${val} - Team will call 24h - ${SUPPORT_NUMBER}`, getSimpleBack(s.lang)); delete userStates[uid]; }
function handleGoBack(uid){ const s=userStates[uid]; if(!s||s.history.length===0) return sendMainMenu(uid,s?.lang||'en'); const p=s.history.pop(); s.step=p; sendMessage(uid, `⬅️ Back to Step ${p}/4`, getSimpleBack(s.lang)); }

function onMessage(uid,text,payload){
  const lang=detectLang(text+" "+payload);
  if(payload==="GO_BACK") handleGoBack(uid);
  else if(payload==="MAIN_MENU") sendMainMenu(uid,lang);
  else if(payload==="FRANCHISE"||text.toLowerCase().includes("franchise")||text.includes("ഫ്രാഞ്ചൈസി")) sendFranchiseIntro(uid,lang);
  else if(payload==="BUSINESS_OPPS") sendDistrictFee(uid,lang);
  else if(payload==="SHOW_EMI") sendEMIOptions(uid,lang);
  else if(payload?.startsWith("EMI_PLAN")) sendPaymentMessage(uid,lang,payload);
  else if(payload==="PAYMENT_DONE") handlePaymentDone(uid,lang);
  else if(payload?.startsWith("DATE_")) handleDate(uid,payload.replace("DATE_",""));
  else if(userStates[uid]) handleOnboarding(uid,text);
  else sendMainMenu(uid,lang);
}

// ===================== CLOUD API WEBHOOK PARSER =====================
app.post('/webhook', async (req,res)=>{
  try{
    const body=req.body;
    if(body.object){
      const entry=body.entry?.[0]?.changes?.[0]?.value;
      const msg=entry?.messages?.[0];
      if(msg){
        const from=msg.from; // 91xxxxxxxxxx
        const text=msg.text?.body || "";
        const btn=msg.button?.text || msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || "";
        console.log(`Webhook: ${from} - ${text} - ${btn}`);
        onMessage(from, text, btn || text);
      }
    } else {
      // Old test format
      const uid=req.body.userId||req.body.from||"test_user"; const txt=req.body.text||""; const pl=req.body.payload||""; onMessage(uid,txt,pl);
    }
  }catch(e){ console.error("Webhook err:", e.message); }
  res.sendStatus(200);
});

app.get('/leads',(req,res)=>{ try{ res.type('text').send(fs.readFileSync('/tmp/leads.txt','utf8')); }catch{ res.send('No leads yet'); } });

const PORT=process.env.PORT||10000;
app.listen(PORT,'0.0.0.0',()=> console.log(`==> Live on ${PORT} - Cloud API Ready`));
