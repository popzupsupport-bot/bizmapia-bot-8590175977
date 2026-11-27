/* BIZMAPIA - MAYA WHATSAPP BOT - server.js - V364.37 - TRUST-FIRST OWNER ENGINE - LOCKED
   Built from uploaded V364.15 COMPLETE FLOW + Owner Golden Draft
   One server.js, one Render service, one webhook for all numbers.
   DO NOT deploy without user confirmation. Verify ONLY via /health + Render logs. */
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const VERSION = 'V364.37';
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia_verify';
const PORT = process.env.PORT || 3000;
function configFor(phoneNumberId){
  const map = {
    [process.env.PHONE_NUMBER_ID_MAIN_OPP || 'MAIN_OPP']: { token: process.env.WHATSAPP_TOKEN_MAIN, sheet: process.env.SHEET_ID_MAIN, label:'MAIN_OPP', servicesFirst:false },
    [process.env.PHONE_NUMBER_ID_MAIN_SVC || 'MAIN_SVC']: { token: process.env.WHATSAPP_TOKEN_MAIN, sheet: process.env.SHEET_ID_MAIN, label:'MAIN_SVC', servicesFirst:false },
    [process.env.PHONE_NUMBER_ID_99954 || '1481022538422254']: { token: process.env.WHATSAPP_TOKEN_99954, sheet: process.env.SHEET_ID_99954 || '1EyY_TB84wGnctyr_7K786NGS6hBoWpP82ttm2C85DUE', label:'FRANCHISEE_MALAPPURAM', servicesFirst:true },
  };
  for(let i=2;i<=10;i++){ const pid=process.env['PHONE_NUMBER_ID_F'+i]; if(pid) map[pid]={token:process.env['WHATSAPP_TOKEN_F'+i], sheet:process.env['SHEET_ID_F'+i], label:'FRANCHISEE_F'+i, servicesFirst:true}; }
  return map[phoneNumberId] || { token: process.env.WHATSAPP_TOKEN_MAIN, sheet: process.env.SHEET_ID_MAIN, label:'MAIN', servicesFirst:false };
}
const chats = new Map();
const reminders = new Map();
const TEST_NUMBERS = ['918590175977','918590183646','8590175977','8590183646'];
function getChat(phone){ if(!chats.has(phone)) chats.set(phone,{lang:null,mindset:null,feeling:null,step:'WELCOME',stopped:false,cold:false,separateReminder:null,normalRemindersOff:false,lastMsgAt:Date.now(),pendingCold:false,phone}); return chats.get(phone); }
function log(){ console.log('['+VERSION+']', ...arguments); }
async function sheetLog(phone, data){ log('SHEET', phone, JSON.stringify(data)); }
async function sheetSetFired(phone){ log('SHEET FIRED', phone, 'Column H Fired Date IST'); }
async function sendTo(senderId, token, to, body, buttons){
  if(!token){ log('NO TOKEN - mock send to', to, String(body).slice(0,150)); return; }
  const payload = { messaging_product:'whatsapp', recipient_type:'individual', to, type:'text', text:{preview_url:false, body} };
  if(buttons && buttons.length){ payload.type='interactive'; payload.interactive={ type:'button', body:{text:body}, action:{buttons: buttons.slice(0,3).map(function(b,i){ return {type:'reply', reply:{id:'BTN_'+i, title:String(b).slice(0,20)}}; })} }; delete payload.text; }
  try{ await axios.post('https://graph.facebook.com/v21.0/'+senderId+'/messages', payload, {headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'}}); }
  catch(e){ log('SEND ERR', (e.response && e.response.data) || e.message); }
}
function detectFeeling(t){
  const s = ' ' + String(t||'').toLowerCase() + ' ';
  const has = function(){ return Array.prototype.some.call(arguments, function(x){ return s.includes(x); }); };
  if(has('stop','vendaa','venda',"don't message",'dont message',"don't msg",'msg venda','parayaruth','block','unsubscribe')) return 'STOP';
  if(has('fraud','pattik','cheat','scam','thattip','fake','kalav')) return 'FEAR_SCAM';
  if(has("don't have balance",'no balance','balance illa','balance ill','no money','paisa illa','cash illa','money illa','kaash illa','salary varumbo','salary varumbol','salary')) return 'NO_BALANCE';
  if(has('wife','bharya','husband','veettil chodikk','veettil chodik','veettil paray','family')) return 'ASK_FAMILY';
  if(has('aloikk','aalo','think','samayam venam','pinne','later','nale','naale','tomorrow','yochikk')) return 'NEED_TIME';
  if(has('emi','thavanakal','gadu','pedi','bayam','fear','risk','nashtam','lose')) return 'EMI_FEAR';
  if(has('return','labham','profit','income','varumanam','entha kittum','enthu kittum','kittum')) return 'WANTS_RETURN';
  if(has('hope','nadakkumo','pattumo','cheyyan pattumo','sadhikkumo','can i','will it work')) return 'NEEDS_HOPE';
  if(has('just checking','just check','nokkan','ariyan','check cheyyan','just enquiry')) return 'JUST_CHECKING';
  if(has('shut','mind','annoy','bore','angry','rude')) return 'RUDE';
  if(has('ok','yes','seri','sheri','thudaram','continue','thudar','start')) return 'READY';
  return 'UNKNOWN';
}
function situationLine(feeling, lang){
  const ml = { NO_BALANCE:'Petteannu payment ennu parayumbol chilappol balance illennu varaam,', ASK_FAMILY:'Bharyayodu / veettil chodikkathe theerumanikkaan pattillallo,', EMI_FEAR:'EMI ennu kelkkumbol pedi thonnunnathu swaabhavikamaanu,', FEAR_SCAM:'Palarum pattikkappedunna kaalathu pedi thonnunnathu swaabhavikamaanu,', NEED_TIME:'Onnu aalochikkaan samayam venam ennu thonnunnathu swaabhavikamaanu,', RUDE:'Njan dhrythi pidippichathu pole thonniyenkil kshamikkaanam,', JUST_CHECKING:'Aadyam nokki manassilaakkanam ennu thonnunnathu shariyaanu,', WANTS_RETURN:'Business ullaa aalaayathukondu return aadyam manassilaakkanam ennu thonnunnathu shariyaanu,', NEEDS_HOPE:'Thudangaan plan cheyyumbol ithu nadakkumo ennu samshayam thonnunnathu swaabhavikamaanu,', UNKNOWN:'Ippol munnottu pokaan pattaatha avasthayaanaanennu manassilaayi,' };
  const en = { NO_BALANCE:'When payment is asked suddenly, sometimes balance may not be there,', ASK_FAMILY:'Without asking family at home, a decision cannot be taken,', EMI_FEAR:'It is natural to feel fear when hearing EMI,', FEAR_SCAM:'In a time when many are cheated, fear is natural,', NEED_TIME:'It is natural to need time to think,', RUDE:'Sorry if I seemed to hurry you,', JUST_CHECKING:'It is right to first look and understand,', WANTS_RETURN:'As a businessman, it is right to first understand return,', NEEDS_HOPE:'When planning to start, doubt whether it will work is natural,', UNKNOWN:'I understand you cannot move forward right now,' };
  return lang==='ml' ? (ml[feeling]||ml.UNKNOWN) : (en[feeling]||en.UNKNOWN);
}
function goldenReply(lang, feeling){
  const line = situationLine(feeling, lang);
  if(lang==='ml') return 'Manassilaayi 🙏\n\n' + line + ' prashnamilla.\n\nNjan ningalude chat prathyegam maatti vaykkaam. Oru pakshae mattenthenkilum samshayamundenkil dhairyamaayi ennodu parayaam, njan enikku kazhiyunna vidham marupadikal nalkaam. Athalla ningalude teamumaayi samsarikkamenundenkil athum saadhyamaakkaam. Ellaam thaankalude soukaryathinaayi njan thayyaraakkaam.\n\nIni parayoo - teamumaayi samsarikkanaamo atho njan marupadikal nalkaal mathiyo atho pinneedu ormmippikkanaamo?';
  if(lang==='hi') return 'Samajh gaya 🙏\n\n' + line + ' Koi baat nahi.\n\nMain aapki chat alag se rakh dungi. Agar koi aur doubt ho to bejhijhak mujhse poochiye, main jitna ho sake utna jawab dungi. Ya agar team se baat karni ho to wo bhi ho jayega. Sab aapki suvidha ke liye taiyaar hai.\n\nAb batayiye - team se baat karni hai, ya main jawab doon, ya baad me yaad dila doon?';
  return 'Understood 🙏\n\n' + line + ' No problem.\n\nI will keep your chat separately. If you have any other doubt, please tell me boldly, I will answer as best I can. Or if you want to talk to our team, that is also possible. Everything is arranged for your convenience.\n\nTell me now - do you want to talk to the team, or shall I answer, or shall I remind you later?';
}
function mindsetReply(mindset, lang){
  if(mindset==='RUNNING') return lang==='ml' ? 'Ningalkku ippol thanne business undallo, athukondu return-nte karyam aadyam manassilaakkendathu shariyaanu. Dhairyamaayi nokkoo, ningalkku return manassilaayaal mathram munnottu poyaal mathi.\n\nAadyam Annexure B - Return onnu nokkaam. Paisayude karyam pinne.' : 'You already have a business, so it is right to first understand return. Look boldly, move forward only if return is clear to you.\n\nFirst let us look at Annexure B - Return. Money talk later.';
  if(mindset==='PLANNING') return lang==='ml' ? 'Thudangaan plan cheyyunnathu thanne valiya karyamaanu 🙏 Cheruthaayi thudangaam, manassilaakki, viswasam aayittu mathram munnottu pokaam. Dhrythi illa.\n\nAadyam Business Centre engane cheruthaayi thudangaam ennu nokkaam.' : 'Planning to start itself is a big thing 🙏 Start small, understand, move only when you trust. No hurry.\n\nFirst let us see how Business Centre can start small.';
  return lang==='ml' ? 'Aadyam ningalude service padikkoo 😊 Ningalkku ithu nallathanennu thonniyaal, eppol venamenkilum thirichu vannu Business Opportunity theranjedukkam. Appol nammal orumichu finalize cheyyaam.\n\nIppol vilkilla, dhrythi illa. Service nokkiyittu parayoo.' : 'First study our service 😊 If you feel it is good, you can come back anytime and choose Business Opportunity. Then we will finalise together.\n\nNo selling now, no hurry. Look at service and tell me.';
}
function cancelAllReminders(phone){ if(reminders.has(phone)){ reminders.get(phone).forEach(clearTimeout); reminders.delete(phone); } log('REMINDERS CANCELLED', phone); }
function scheduleSoftReminder(senderId, token, phone, chat, delayMs, label){
  if(TEST_NUMBERS.indexOf(phone) !== -1) return;
  if(chat.stopped || chat.cold) return;
  cancelAllReminders(phone);
  const id = setTimeout(async function(){
    if(Date.now() - chat.lastMsgAt < delayMs) return;
    if(chat.stopped || chat.cold) return;
    const txt = chat.lang==='ml' ? 'Namaskaaram 😊 Thaledivasam paranja samayathu ormmippikkunnu. Ippol nokkatte? Ningalude avasaram ippozhum surakshithamaanu. Oru minittil thudaraam 👇' : 'Namaste 😊 Reminding you at the time you mentioned. Shall we look now? Your opportunity is still safe. We can continue in one minute 👇';
    await sendTo(senderId, token, phone, txt, [chat.lang==='ml'?'▶️ Thudaraam':'▶️ Continue']);
    await sheetSetFired(phone);
    chat.pendingCold = true;
    const id2 = setTimeout(function(){ if(chat.pendingCold && !chat.stopped){ chat.cold=true; chat.separateReminder=null; chat.normalRemindersOff=true; sheetLog(phone,{Feeling:'COLD',Stopped_At:'COLD - No Reply After 1 Soft Reminder',Reminder:'NONE'}); log('COLD STOP', phone); } }, 24*60*60*1000);
    reminders.set(phone, [id2]);
  }, delayMs);
  reminders.set(phone,[id]);
  log('SEPARATE REMINDER SCHEDULED', phone, label, delayMs);
}
function setSeparateReminder(senderId, token, phone, chat, userText){
  const t = String(userText||'').toLowerCase();
  let when='ONE_SOFT_TOMORROW', delay=24*60*60*1000;
  if(t.includes('nale')||t.includes('naale')||t.includes('tomorrow')){ when='TOMORROW'; delay=24*60*60*1000; }
  else if(t.includes('vaikitt')||t.includes('evening')||t.includes('vykitt')){ when='TODAY_EVENING'; delay=6*60*60*1000; }
  else if(t.includes('salary')){ when='SALARY_DAY_ASK_DATE'; delay=24*60*60*1000; }
  else if(t.includes('pinne')||t.includes('later')){ when='LATER_ONE_SOFT'; delay=24*60*60*1000; }
  chat.separateReminder=when; chat.normalRemindersOff=true; chat.stopped=false; chat.cold=false; chat.pendingCold=false;
  cancelAllReminders(phone);
  scheduleSoftReminder(senderId, token, phone, chat, delay, when);
  sheetLog(phone,{Reminder:'SEPARATE_ONLY: '+when, NormalReminders:'OFF'});
  return when;
}
function decide(chat, text, lang){
  const feeling = detectFeeling(text);
  chat.feeling = feeling; chat.pendingCold = false;
  if(chat.stopped) return {action:'STOP', reply:'', buttons:[]};
  if(feeling==='STOP'){ chat.stopped=true; chat.separateReminder=null; chat.normalRemindersOff=true; cancelAllReminders(chat.phone); sheetLog(chat.phone,{Feeling:'STOP',Stopped_At:'STOP - Do Not Disturb',Reminder:'NONE'}); return {action:'STOP', reply:'', buttons:[]}; }
  if(feeling==='RUDE'){ chat.normalRemindersOff=true; cancelAllReminders(chat.phone); sheetLog(chat.phone,{Feeling:'RUDE',Stopped_At:'RUDE - Paused'}); return {action:'SORRY_ONLY', reply: goldenReply(lang,'RUDE'), buttons: lang==='ml'?['👥 Teamumaayi Samsarikkam','💬 Nee Marupadi Tharoo','🔔 Pinneedu Ormmippikkoo']:['👥 Talk to Team','💬 You Answer','🔔 Remind Later']}; }
  if(feeling==='JUST_CHECKING' || chat.mindset==='JUST_CHECKING'){ return {action:'TRUST_PATH', reply: mindsetReply('JUST_CHECKING', lang), buttons: lang==='ml'?['📚 Service Nokkaam','🔔 Pinneedu Ormmippikkoo']:['📚 Look at Service','🔔 Remind Later']}; }
  if(['NO_BALANCE','ASK_FAMILY','NEED_TIME','EMI_FEAR','FEAR_SCAM'].indexOf(feeling)!==-1){ sheetLog(chat.phone,{Feeling:feeling,Decision:'COMFORT_PAUSE'}); return {action:'COMFORT_PAUSE', reply: goldenReply(lang, feeling), buttons: lang==='ml'?['👥 Teamumaayi Samsarikkam','💬 Nee Marupadi Tharoo','🔔 Pinneedu Ormmippikkoo']:['👥 Talk to Team','💬 You Answer','🔔 Remind Later']}; }
  if(feeling==='WANTS_RETURN' || chat.mindset==='RUNNING'){ return {action:'TRUST_PATH', reply: mindsetReply('RUNNING', lang), buttons: lang==='ml'?['📄 Return Nokkaam','💬 Chodyam Chodikkaam']:['📄 Look at Return','💬 Ask Question']}; }
  if(feeling==='NEEDS_HOPE' || chat.mindset==='PLANNING'){ return {action:'TRUST_PATH', reply: mindsetReply('PLANNING', lang), buttons: lang==='ml'?['▶️ Cheruthaayi Thudangaam','💬 Chodyam Chodikkaam']:['▶️ Start Small','💬 Ask Question']}; }
  if(feeling==='READY'){ return {action:'SELL_FAST', reply: lang==='ml'?'Super 🙏 Appol otta minittil thudaraam. Adutha ore oru step mathram.': lang==='hi'?'Super 🙏 Toh ek minute me aage badhte hain. Bas ek hi next step.':'Super 🙏 Then let us continue in one minute. Only one next step.', buttons:['▶️ Thudaraam']}; }
  return {action:'COMFORT_PAUSE', reply: goldenReply(lang,'UNKNOWN'), buttons: lang==='ml'?['👥 Teamumaayi Samsarikkam','💬 Nee Marupadi Tharoo','🔔 Pinneedu Ormmippikkoo']:['👥 Talk to Team','💬 You Answer','🔔 Remind Later']};
}
app.get('/', function(req,res){ res.send('Bizmapia Maya '+VERSION+' - TRUST-FIRST - BOOT OK'); });
app.get('/health', function(req,res){ res.json({version:VERSION, status:'OK', boot: VERSION+' TRUST-FIRST - BOOT OK'}); });
app.get('/webhook', function(req,res){ if(req.query['hub.verify_token']===VERIFY_TOKEN) return res.send(req.query['hub.challenge']); return res.sendStatus(403); });
app.post('/webhook', async function(req,res){
  res.sendStatus(200);
  try{
    const entry = req.body.entry && req.body.entry[0];
    const change = entry && entry.changes && entry.changes[0];
    const value = change && change.value;
    const senderId = value && value.metadata && value.metadata.phone_number_id;
    const msg = value && value.messages && value.messages[0];
    if(!msg || !msg.from) return;
    const phone = msg.from;
    const cfg = configFor(senderId);
    const token = cfg.token;
    const chat = getChat(phone); chat.phone=phone;
    chat.lastMsgAt = Date.now(); chat.pendingCold=false;
    let text = '';
    if(msg.type==='text') text = (msg.text && msg.text.body) || '';
    else if(msg.type==='interactive') text = (msg.interactive && ((msg.interactive.button_reply && msg.interactive.button_reply.title) || (msg.interactive.list_reply && msg.interactive.list_reply.title))) || '';
    else if(msg.type==='button') text = (msg.button && msg.button.text) || '';
    else if(msg.type==='audio' || msg.type==='voice') text = '[voice note]';
    if(msg.type==='audio' || msg.type==='voice'){ await sendTo(senderId, token, phone, chat.lang==='ml' ? 'Ningalude voice note kettuu 🙏' : 'Heard your voice note 🙏', []); }
    if(!chat.lang){
      if(/malayalam/i.test(text) || /മലയാളം/.test(text)) chat.lang='ml';
      else if(/hindi/i.test(text) || /हिन्दी/.test(text)) chat.lang='hi';
      else if(/english/i.test(text)) chat.lang='en';
      else { await sendTo(senderId, token, phone, 'Welcome to Bizmapia 🙏\n\nPlease choose your language:\nEnglish / Hindi / Malayalam', ['English','Hindi','Malayalam']); return; }
      await sendTo(senderId, token, phone, chat.lang==='ml' ? 'Namaskaaram 🙏 Bizmapia-yilekku swaagatham.\n\nNingal ethinu aanu vannathu?' : chat.lang==='hi' ? 'Namaste 🙏 Bizmapia me swagat hai.\n\nAap kis liye aaye hain?' : 'Welcome to Bizmapia 🙏\n\nWhat are you here for?', chat.lang==='ml'?['Business Opportunity','Use Other Services']:['Business Opportunity','Use Other Services']);
      return;
    }
    const lang = chat.lang;
    if(/running|already.*business|office|business.*und/i.test(text)) chat.mindset='RUNNING';
    else if(/planning|start|thudang|new business/i.test(text)) chat.mindset='PLANNING';
    else if(/just checking|just check|nokkan|check/i.test(text)) chat.mindset='JUST_CHECKING';
    if(/pinneedu|remind later|later/i.test(text) && !/nale|naale|vaikitt|salary|tomorrow|evening/i.test(text)){
      const q = lang==='ml' ? 'Shari 🙏 Eppol ormmippikkanam ennu ningalude vaakkil parayoo - udhaharanam: nale vaikittu, allenkil shambalam varumbol. Njan athe samayathu mathram ormmippikkaam, athu vare disturb cheyyilla.' : 'Okay 🙏 Tell me in your words when to remind - e.g. tomorrow evening, or when salary comes. I will remind only at that time, I will not disturb till then.';
      await sendTo(senderId, token, phone, q, []);
      sheetLog(phone,{Decision:'ASK_REMINDER_TIME'});
      return;
    }
    if(/nale|naale|vaikitt|salary|tomorrow|evening/i.test(text) && chat.feeling!=='READY'){
      const when = setSeparateReminder(senderId, token, phone, chat, text);
      const ok = lang==='ml' ? 'Shari 🙏 ' + when + ' mathram njan ormmippikkaam. Athu vare njan disturb cheyyilla. Ningalude chat prathyegam maatti vechittundu.' : 'Okay 🙏 I will remind only at ' + when + '. I will not disturb till then. Your chat is kept separately.';
      await sendTo(senderId, token, phone, ok, []);
      return;
    }
    if(/team|teamumaayi|talk to team/i.test(text)){ chat.normalRemindersOff=true; cancelAllReminders(phone); await sendTo(senderId, token, phone, lang==='ml' ? 'Shari 🙏 Teamumaayi samsarikkam. Ningalude chat team-inu kaymaari. Oru chinnna samayam tharumo?' : 'Okay 🙏 Let us talk to the team. Your chat is handed to the team. Please give a little time?', []); sheetLog(phone,{Decision:'TEAM_HANDOVER'}); return; }
    const d = decide(chat, text, lang);
    if(d.action==='STOP'){ await sendTo(senderId, token, phone, lang==='ml' ? 'Shari, nirthunnu 🙏 Inime njan message ayakkilla. Ningalkku aavashyam varumbol thirichu message cheyyaam.' : 'Okay, stopping 🙏 I will not message again. Message me whenever you need.', []); return; }
    await sendTo(senderId, token, phone, d.reply, d.buttons);
    await sheetLog(phone,{Feeling:chat.feeling, Mindset:chat.mindset, Decision:d.action, NormalReminders: chat.normalRemindersOff?'OFF':'ON', SeparateReminder: chat.separateReminder||'NONE'});
    if(!chat.stopped) cancelAllReminders(phone);
    if(d.action==='SELL_FAST' && chat.step==='WELCOME'){ chat.step='COMPANY_VIDEO_SENT'; await sendTo(senderId, token, phone, lang==='ml' ? 'Aadyam Company Video onnu nokkoo 👇' : 'First, please watch the Company Video 👇', [lang==='ml'?'▶️ See Video':'▶️ See Video']); }
  }catch(e){ log('WEBHOOK ERR', e); }
});
app.listen(PORT, function(){ log(VERSION+' TRUST-FIRST - BOOT OK on '+PORT); });
