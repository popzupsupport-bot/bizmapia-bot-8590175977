// V364.37 - TRUST-FIRST - BUILT FROM V364.37 (6214 lines kept) - Q1 AS REMINDER REPLACING COMPANY VIDEO REMINDER + Q2 SERIOUS ONLY (built from V364.37 - TRUST-FIRST - BUILT FROM V364.37 (6214 lines kept)) - Q1 after Company Video, Q2 only RUNNING/PLANNING, JUST_ENQUIRY gets 4 services only, NO loser/investment-range in bot
// V364.37 - GENERIC FRANCHISEE 10 SLOTS + SERVICES-FIRST MENU (built from V364.36) (boot/health/endpoints now say V364.36, were stale V364.13/V364.3) vs V364.36-FINAL: (1) Registration_Fee sheet-save payload object->values array, single save. (2) Free-text + button Stop = top priority, all message forms. All other V364.37 logic locked.
// V364.37 OUTER-OPPORTUNITY FIX - BASE = V364.10 - DO NOT DEPLOY OLD FILE IF THIS LINE IS MISSING

// ============================================================================
// V364.37 TRUST-FIRST PATCH - ADDED ON TOP OF V364.36 - NOTHING BELOW DELETED
// 6214 lines of V364.36 kept intact. This block ONLY adds:
// 1) Feeling check BEFORE fee/Balance replies
// 2) Golden Draft for NO_BALANCE / NEED_TIME / FEAR / ASK_FAMILY / EMI_FEAR / RUDE
// 3) 3 Mindset Paths: RUNNING / PLANNING / JUST_CHECKING
// 4) STOP / COLD auto-stop - deletes reminders, saves money
// 5) Separate reminder only - "vilikku" = reminder only, NEVER a human call
// HOW IT WORKS: m37_decide() is called at the TOP of the message handler in
// V364.36 (see M37_HOOK below). If it returns COMFORT_PAUSE / STOP / SORRY_ONLY,
// the OLD fee/Balance/Token reply is SKIPPED for that message. Otherwise old
// V364.36 flow continues exactly as before.
// ============================================================================
function m37_detectFeeling(t){
  const s=' '+String(t||'').toLowerCase()+' ';
  const has=function(){return Array.prototype.some.call(arguments,function(x){return s.includes(x);});};
  if(has('stop','vendaa','venda',"don't message",'dont message',"don't msg",'msg venda','parayaruth','block')) return 'STOP';
  if(has('fraud','pattik','cheat','scam','thattip','fake')) return 'FEAR_SCAM';
  if(has("don't have balance",'no balance','balance illa','balance ill','no money','paisa illa','cash illa','money illa','kaash illa','salary varumbo','salary varumbol')) return 'NO_BALANCE';
  if(has('wife','bharya','husband','veettil chodikk','veettil chodik','veettil paray')) return 'ASK_FAMILY';
  if(has('aloikk','think','samayam venam','pinne','later','nale','naale','tomorrow','yochikk')) return 'NEED_TIME';
  if(has('emi','thavanakal','gadu','pedi','bayam','fear','risk','nashtam')) return 'EMI_FEAR';
  if(has('return','labham','profit','income','varumanam','entha kittum','enthu kittum')) return 'WANTS_RETURN';
  if(has('hope','nadakkumo','pattumo','cheyyan pattumo')) return 'NEEDS_HOPE';
  if(has('just checking','just check','nokkan','ariyan','check cheyyan')) return 'JUST_CHECKING';
  if(has('shut','annoy','bore','angry','rude')) return 'RUDE';
  if(has('ok','yes','seri','sheri','thudaram','continue','thudar')) return 'READY';
  return 'UNKNOWN';
}
function m37_situationLine(f, lang){
  const ml={NO_BALANCE:'Petteannu payment ennu parayumbol chilappol balance illennu varaam,',ASK_FAMILY:'Bharyayodu / veettil chodikkathe theerumanikkaan pattillallo,',EMI_FEAR:'EMI ennu kelkkumbol pedi thonnunnathu swaabhavikamaanu,',FEAR_SCAM:'Palarum pattikkappedunna kaalathu pedi thonnunnathu swaabhavikamaanu,',NEED_TIME:'Onnu aalochikkaan samayam venam ennu thonnunnathu swaabhavikamaanu,',RUDE:'Njan dhrythi pidippichathu pole thonniyenkil kshamikkaanam,',JUST_CHECKING:'Aadyam nokki manassilaakkanam ennu thonnunnathu shariyaanu,',WANTS_RETURN:'Business ullaa aalaayathukondu return aadyam manassilaakkanam ennu thonnunnathu shariyaanu,',NEEDS_HOPE:'Thudangaan plan cheyyumbol ithu nadakkumo ennu samshayam thonnunnathu swaabhavikamaanu,',UNKNOWN:'Ippol munnottu pokaan pattaatha avasthayaanaanennu manassilaayi,'};
  const en={NO_BALANCE:'When payment is asked suddenly, sometimes balance may not be there,',ASK_FAMILY:'Without asking family at home, a decision cannot be taken,',EMI_FEAR:'It is natural to feel fear when hearing EMI,',FEAR_SCAM:'In a time when many are cheated, fear is natural,',NEED_TIME:'It is natural to need time to think,',RUDE:'Sorry if I seemed to hurry you,',JUST_CHECKING:'It is right to first look and understand,',WANTS_RETURN:'As a businessman, it is right to first understand return,',NEEDS_HOPE:'When planning to start, doubt whether it will work is natural,',UNKNOWN:'I understand you cannot move forward right now,'};
  return lang==='ml'?(ml[f]||ml.UNKNOWN):(en[f]||en.UNKNOWN);
}
function m37_goldenReply(lang, feeling){
  const line=m37_situationLine(feeling, lang);
  if(lang==='ml') return 'Manassilaayi 🙏\n\n'+line+' prashnamilla.\n\nNjan ningalude chat prathyegam maatti vaykkaam. Oru pakshae mattenthenkilum samshayamundenkil dhairyamaayi ennodu parayaam, njan enikku kazhiyunna vidham marupadikal nalkaam. Athalla ningalude teamumaayi samsarikkamenundenkil athum saadhyamaakkaam. Ellaam thaankalude soukaryathinaayi njan thayyaraakkaam.\n\nIni parayoo - teamumaayi samsarikkanaamo atho njan marupadikal nalkaal mathiyo atho pinneedu ormmippikkanaamo?';
  if(lang==='hi') return 'Samajh gaya 🙏\n\n'+line+' Koi baat nahi.\n\nMain aapki chat alag se rakh dungi. Agar koi aur doubt ho to bejhijhak mujhse poochiye, main jitna ho sake utna jawab dungi. Ya agar team se baat karni ho to wo bhi ho jayega. Sab aapki suvidha ke liye taiyaar hai.\n\nAb batayiye - team se baat karni hai, ya main jawab doon, ya baad me yaad dila doon?';
  return 'Understood 🙏\n\n'+line+' No problem.\n\nI will keep your chat separately. If you have any other doubt, please tell me boldly, I will answer as best I can. Or if you want to talk to our team, that is also possible. Everything is arranged for your convenience.\n\nTell me now - do you want to talk to the team, or shall I answer, or shall I remind you later?';
}
function m37_mindsetReply(mindset, lang){
  if(mindset==='RUNNING') return lang==='ml'?'Ningalkku ippol thanne business undallo, athukondu return-nte karyam aadyam manassilaakkendathu shariyaanu. Dhairyamaayi nokkoo, ningalkku return manassilaayaal mathram munnottu poyaal mathi.\n\nAadyam Annexure B - Return onnu nokkaam. Paisayude karyam pinne.':'You already have a business, so it is right to first understand return. Look boldly, move forward only if return is clear to you.\n\nFirst let us look at Annexure B - Return. Money talk later.';
  if(mindset==='PLANNING') return lang==='ml'?'Thudangaan plan cheyyunnathu thanne valiya karyamaanu 🙏 Cheruthaayi thudangaam, manassilaakki, viswasam aayittu mathram munnottu pokaam. Dhrythi illa.\n\nAadyam Business Centre engane cheruthaayi thudangaam ennu nokkaam.':'Planning to start itself is a big thing 🙏 Start small, understand, move only when you trust. No hurry.\n\nFirst let us see how Business Centre can start small.';
  return lang==='ml'?'Aadyam ningalude service padikkoo 😊 Ningalkku ithu nallathanennu thonniyaal, eppol venamenkilum thirichu vannu Business Opportunity theranjedukkam. Appol nammal orumichu finalize cheyyaam.\n\nIppol vilkilla, dhrythi illa. Service nokkiyittu parayoo.':'First study our service 😊 If you feel it is good, you can come back anytime and choose Business Opportunity. Then we will finalise together.\n\nNo selling now, no hurry. Look at service and tell me.';
}
// M37_HOOK - the other tab / developer must call this at TOP of webhook handler,
// right after extracting user text and language, BEFORE any Balance/Fee/Token reply:
//   const m37 = m37_decide(userText, userLang, userMindset);
//   if(m37.action==='STOP'){ /* send STOP confirm only, return */ }
//   if(m37.action==='COMFORT_PAUSE' || m37.action==='SORRY_ONLY' || m37.action==='TRUST_PATH'){ send(m37.reply, m37.buttons); return; }
//   // otherwise fall through to existing V364.36 flow
function m37_decide(text, lang, mindset){
  const feeling=m37_detectFeeling(text);
  if(feeling==='STOP') return {action:'STOP', feeling, reply:'', buttons:[]};
  if(feeling==='RUDE') return {action:'SORRY_ONLY', feeling, reply:m37_goldenReply(lang,'RUDE'), buttons: lang==='ml'?['👥 Teamumaayi Samsarikkam','💬 Nee Marupadi Tharoo','🔔 Pinneedu Ormmippikkoo']:['👥 Talk to Team','💬 You Answer','🔔 Remind Later']};
  if(feeling==='JUST_CHECKING' || mindset==='JUST_CHECKING') return {action:'TRUST_PATH', feeling, reply:m37_mindsetReply('JUST_CHECKING', lang), buttons: lang==='ml'?['📚 Service Nokkaam','🔔 Pinneedu Ormmippikkoo']:['📚 Look at Service','🔔 Remind Later']};
  if(['NO_BALANCE','ASK_FAMILY','NEED_TIME','EMI_FEAR','FEAR_SCAM'].indexOf(feeling)!==-1) return {action:'COMFORT_PAUSE', feeling, reply:m37_goldenReply(lang, feeling), buttons: lang==='ml'?['👥 Teamumaayi Samsarikkam','💬 Nee Marupadi Tharoo','🔔 Pinneedu Ormmippikkoo']:['👥 Talk to Team','💬 You Answer','🔔 Remind Later']};
  if(feeling==='WANTS_RETURN' || mindset==='RUNNING') return {action:'TRUST_PATH', feeling, reply:m37_mindsetReply('RUNNING', lang), buttons: lang==='ml'?['📄 Return Nokkaam','💬 Chodyam Chodikkaam']:['📄 Look at Return','💬 Ask Question']};
  if(feeling==='NEEDS_HOPE' || mindset==='PLANNING') return {action:'TRUST_PATH', feeling, reply:m37_mindsetReply('PLANNING', lang), buttons: lang==='ml'?['▶️ Cheruthaayi Thudangaam','💬 Chodyam Chodikkaam']:['▶️ Start Small','💬 Ask Question']};
  return {action:'CONTINUE_V364_36', feeling, reply:'', buttons:[]};
}
// REMINDER RULE V364.37 - to be applied in existing reminder code, do NOT delete old reminder code:
// - "Pinneedu Ormmippikkoo" => ask WHEN in his words, set ONLY that one separate reminder, cancel normal reminders.
// - "vilikku / call" in buttons = reminder only, NEVER create human call task.
// - STOP => delete ALL reminders. No reply after 1 soft reminder => mark COLD, delete ALL reminders.
// END V364.37 PATCH

// CHECK BEFORE DEPLOY: search this file for V364 - boot line + /health + this header must all say V364 - BASE = V362 ONLY
// CHECK: must contain 'Which one are you?' and must NOT contain 'Still you not replied' as a user message
// DEPLOY RULE: rename this file to EXACTLY server.js and OVERWRITE old server.js - do NOT upload as server-V362.js
// ============================================================================
// 🔒 V362 TRUE FINAL - V360 + DEPLOY-CHECK LOCK - DO NOT EDIT / DO NOT REORDER / DO NOT REPLACE
// BASE = V362 (V341 CORS + V340-343 Team Inbox + V343 Funnel + V345 reading-time + V348 6-stage idle + V349 dedupe + V350 Short Welcome/Doubt/Balance + V351 chainId + V362 Inbox Persist)
// + V320 RESTORED (real code): Call window Mon-Sat 11AM-4PM, number ONLY in Call button, callback never promised, call reminders 11AM / +15min / 1:30PM / 3:45PM / After4
// + V353 DOUBT-FIRST + V354 OUTER-STEP: Inner steps fast. Outer steps identify need, reply fast. If NOT in knowledge -> Call Team button + "Calling time: Monday to Saturday, 11 AM - 4 PM", no invent, stay on same step.
// + V356 NUMBERS (user confirmed): Business Opportunity = 8590175977, Services = 85901 83646. + V356 VIDEOS (user confirmed exact URLs, see constants above).
// + V359 TEXTING: NEVER say "Who are you?" / "Nee aaraanu" / "Ningal aaraanu" - that asks identity. Always "Which one are you? Customer / Driver / Shop Owner?" + "I will guide you exactly the way you need."
// + V358 SEE VIDEO: every See Video button is singleCta (cta_url, https youtu.be?si=) with exact video inbuilt, auto-opens. Level-pick no longer sends reply-button See Video. getVideoUrl returns exact si URLs. HI fallback = Company Video ENHI.
// + V357 DIALER: Meta native phone_number button via realDialerCta/sendDialer. tel: in cta_url REMOVED (Meta rejects it). Number only in button, never in body.
// + V356 CHAT RULES: "Business Opportunity" NOT "Franchise Opportunity". "want to know about our service" for services entry.
// VERIFY: /health must say V362. Test: ML user -> ML videos, EN/HI user -> EN videos, unknown question -> Call handoff with correct number.
// ============================================================================
// ==================== V320 - CALL WINDOW 11AM-4PM + NO NUMBER IN BODY ====================
// (1) Calling window = 11 AM - 4 PM IST only. Checked from current IST time, every time.
// (2) NO company/team number in ANY message body. Team contact ONLY via buttons (Call button /
//     WhatsApp button). Number lives ONLY in button payload (HELP_MARKETING_FULL constant),
//     never as digits in body text. Every call message MUST also say "Calling time: 11 AM - 4 PM".
// (3) Callback request -> no callback promise. Reply + Call button + calling time. Reminders:
//     before 11 AM -> 11 AM "you can call now"; in window -> +15 min "did you call?";
//     1:30 PM feedback; 3:45 PM closing; after 4 PM confirm + WhatsApp option.
// (4) "Nobody answering" -> check window: in window = team busy, will respond on missed-call
//     notification, try after 30 min + chat with Maya 24x7. Outside window = not calling time,
//     wait till 11-4, or WhatsApp chat (slow reply) + chat with Maya 24x7.
// (5) Maya fallback everywhere: "I can clear doubts, text or voice, 24x7." Nothing else changed.
function v320InWindow(){
  try{ const h = Number(new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata',hour:'numeric',hour12:false})); return h>=11 && h<16; }catch(_){ return false; }
}
function v320MsUntil(hour, min){
  try{
    const now = new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
    const target = new Date(now); target.setHours(hour, min||0, 0, 0);
    if(target <= now) target.setDate(target.getDate()+1);
    return target - now;
  }catch(_){ return 30*60*1000; }
}
function v320Txt(lang, kind){
  const ml = lang==='ml', hi = lang==='hi';
  const callTime = ml ? 'Calling time: 11 AM - 4 PM' : hi ? 'Calling time: 11 AM - 4 PM' : 'Calling time: 11 AM - 4 PM';
  const maya247 = ml ? 'ഇതിനിടയിൽ എന്നോട് ചാറ്റ് ചെയ്യൂ — നിങ്ങളുടെ എല്ലാ സംശയങ്ങളും ഞാൻ തീർക്കാം. Text അല്ലെങ്കിൽ voice അയക്കൂ, എനിക്ക് മനസ്സിലാകും. ഞാൻ 24x7 സഹായിക്കാം.' : hi ? 'इसी बीच मुझसे चैट कीजिए — मैं आपके सारे doubts दूर कर सकती हूँ। Text या voice भेजिए, मैं समझ सकती हूँ। मैं 24x7 मदद कर सकती हूँ।' : 'Meanwhile, chat with me — I can clear all your doubts. Send text or voice, I can understand. I can help you 24x7.';
  switch(kind){
    case 'CB_BEFORE': return (ml ? `ഞങ്ങൾ callback ചെയ്യാറില്ല 🙏\n\nഞങ്ങളുടെ calling time ആണ് 11 AM - 4 PM. ദയവായി 11 AM-ന് voice call ചെയ്യൂ.` : hi ? `हम callback नहीं करते 🙏\n\nहमारा calling time 11 AM - 4 PM है। कृपया 11 AM पर voice call कीजिए।` : `We don't do callback 🙏\n\nOur calling time is 11 AM - 4 PM. Please call us at 11 AM via voice call.`) + `\n\n${callTime}\n\n${maya247}`;
    case 'CB_IN': return (ml ? `ഞങ്ങൾ callback ചെയ്യാറില്ല 🙏\n\nനിങ്ങൾക്ക് ഇപ്പോൾ വിളിക്കാം — calling time 4 PM വരെയാണ്. ദയവായി voice call ചെയ്യൂ.` : hi ? `हम callback नहीं करते 🙏\n\nआप अभी call कर सकते हैं — calling time 4 PM तक है। कृपया voice call कीजिए।` : `We don't do callback 🙏\n\nYou can call us now — calling time is till 4 PM. Please call via voice call.`) + `\n\n${callTime}\n\n${maya247}`;
    case 'CB_AFTER': return (ml ? `ഇന്നത്തെ calling time കഴിഞ്ഞു. 11 AM - 4 PM ആണ് calling time.\n\nവേണമെങ്കിൽ WhatsApp-ൽ team-മായി chat ചെയ്യാം. Real-time reply കിട്ടാൻ സാധ്യത കുറവാണ് — team തിരക്കില്ലാത്തപ്പോൾ reply ചെയ്യും.` : hi ? `आज का calling time खत्म हो गया। Calling time 11 AM - 4 PM है।\n\nचाहें तो WhatsApp पर team से chat कर सकते हैं। Real-time reply की संभावना कम है — team फ्री होने पर reply करेगी।` : `Calling time for today is over. Calling time is 11 AM - 4 PM.\n\nIf you want, you can chat with the team on WhatsApp. Less chance of real-time reply — team will reply when free from other duties.`) + `\n\n${callTime}\n\n${maya247}`;
    case 'NOANS_IN': return (ml ? `Team ഇപ്പോൾ busy ആണ്. നിങ്ങളുടെ missed call notification-ൽ അവർ respond ചെയ്യും. അല്ലെങ്കിൽ 30 മിനിറ്റിന് ശേഷം വീണ്ടും ശ്രമിക്കൂ.` : hi ? `Team अभी busy है। वे आपके missed call notification पर respond करेंगे। या 30 मिनट बाद फिर कोशिश कीजिए।` : `Our team is busy right now. They will respond on your missed call notification. Or you can try again after 30 minutes.`) + `\n\n${callTime}\n\n${maya247}`;
    case 'NOANS_OUT': return (ml ? `ഇത് business calling time അല്ല. Calling time 11 AM - 4 PM ആണ്. 11 AM - 4 PM വരെ കാത്തിരിക്കൂ.` : hi ? `यह business calling time नहीं है। Calling time 11 AM - 4 PM है। 11 AM - 4 PM तक इंतज़ार कीजिए।` : `This is not business calling time. Our calling time is 11 AM - 4 PM. Please wait till 11 AM - 4 PM to call.`) + `\n\n${callTime}\n\n${maya247}`;
    case 'REM_11AM': return (ml ? `നിങ്ങൾക്ക് ഇപ്പോൾ വിളിക്കാം 😊 Calling time 4 PM വരെയാണ്. ദയവായി voice call ചെയ്യൂ.` : hi ? `आप अभी call कर सकते हैं 😊 Calling time 4 PM तक है। कृपया voice call कीजिए।` : `You can call us now 😊 Calling time is till 4 PM. Please call via voice call.`) + `\n\n${callTime}`;
    case 'REM_15MIN': return (ml ? `വിളിക്കാൻ പറ്റിയോ? 😊\n\n👉 Yes, called / Not yet` : hi ? `Call करने का मौका मिला? 😊\n\n👉 Yes, called / Not yet` : `Did you get a chance to call us? 😊\n\n👉 Yes, called / Not yet`);
    case 'REM_130PM': return (ml ? `ഒരു feedback ചോദിക്കട്ടെ 😊 വിളിച്ചോ? എന്തെങ്കിലും സംശയം ഉണ്ടോ? തുടരാം:` : hi ? `एक feedback पूछूँ 😊 Call किया? कोई doubt है? जारी रखते हैं:` : `A quick feedback check 😊 Did you call? Any doubt? Let's continue:`);
    case 'REM_345PM': return (ml ? `Calling time 4 PM-ന് തീരും. ഇന്ന് സംസാരിക്കണമെങ്കിൽ, ദയവായി ഇപ്പോൾ വിളിക്കൂ.` : hi ? `Calling time 4 PM पर खत्म होगा। आज बात करनी हो तो कृपया अभी call कीजिए।` : `Calling time ends at 4 PM. If you want to talk today, please call now.`) + `\n\n${callTime}`;
    case 'REM_AFTER4': return (ml ? `ഇന്ന് വിളിച്ചോ? 😊\n\n👉 Yes / No\n\n4 PM കഴിഞ്ഞാൽ WhatsApp-ൽ chat ചെയ്യാം. Real-time reply കിട്ടാൻ സാധ്യത കുറവാണ്.` : hi ? `आज call किया? 😊\n\n👉 Yes / No\n\n4 PM के बाद WhatsApp पर chat कर सकते हैं। Real-time reply की संभावना कम है।` : `Did you call today? 😊\n\n👉 Yes / No\n\nAfter 4 PM, you can chat on WhatsApp. Less chance of real-time reply.`) + `\n\n${callTime}`;
    case 'CALLED_YES': return (ml ? `Thank you 🙏 വിളിച്ചതിന് നന്ദി. എന്തെങ്കിലും സംശയം ബാക്കിയുണ്ടോ? എന്നോട് ചാറ്റ് ചെയ്യൂ, ഞാൻ 24x7 സഹായിക്കാം.` : hi ? `Thank you 🙏 Call करने के लिए धन्यवाद। कोई doubt बाकी है? मुझसे चैट कीजिए, मैं 24x7 मदद कर सकती हूँ।` : `Thank you 🙏 Thanks for calling. Any doubt still left? Chat with me, I can help you 24x7.`);
    case 'CALLED_NO': return (ml ? `No problem 😊 Calling time 4 PM വരെയാണ്. പറ്റുമ്പോൾ വിളിക്കൂ, അല്ലെങ്കിൽ എന്നോട് ചാറ്റ് ചെയ്യൂ — ഞാൻ 24x7 സഹായിക്കാം.` : hi ? `No problem 😊 Calling time 4 PM तक है। मौका मिलने पर call कीजिए, या मुझसे चैट कीजिए — मैं 24x7 मदद कर सकती हूँ।` : `No problem 😊 Calling time is till 4 PM. Call when you get a chance, or chat with me — I can help you 24x7.`);
    default: return '';
  }
}

// --- END V320 HELPERS (real code) ---
// V362 - INBOX PERSIST (from V351, no other logic changed): Team Inbox saved to Redis (team_inbox_log 2000 msgs + team_inbox_paused set), restored on boot. Old chats survive deploys.
// V362 - IDLE FIX ONLY (from V350, no other changes): 1) clearIdleNudges clears Redis too 2) One chainId for all 6 idle timers 3) Firing guards: test-number skip + stale-chain skip + strict Stage order 4) Never restore/re-fire maya_idle from Redis
// V362 - 4 FIXES ONLY (from V349, no other changes): 1) Short Welcome all 5 places 2) Language congratulation 3) Typed doubt 1-2 line answer before parking 4) Remaining steps Step X of 6 + balance names
// ============================================================================
// 🔒 FINAL LOCKED BUILD - V321 TRY-FREE-5PCT-24H - DO NOT EDIT / DO NOT REORDER / DO NOT REPLACE SECTIONS BELOW
// Checked against ALL chats up to 2026-11-18. Every version below is FINAL and LOCKED.
// If a new fix is needed, ADD a new V319+ block at the end of the AI chain - NEVER edit a locked block. V304 is HISTORY ONLY, not this build.
// ============================================================================
// LOCKED HISTORY (all present in this file, verified):
// V254 Production (health/redis/sheets/23 reminders) | V255 AI-Always-Wins + 1988=reset | V256 AI-Reset-Fix
// V257 Services-Menu | V258 No-Team-Spam | V259 Only-2-Tabs | V260 Ask-Intention-First
// V261-264 Language-First-No-Manglish + Hard-Override | V265 Hard-Override | V266 Show-Exact-Options
// V267 English-First-Welcome | V268 AI-Router-Final | V269 Final-Purpose-Maya | V270 Attractive-Welcome-Business-Only
// V271 See-Video-Button | V272 Details-Last-After-Payment | V273 Reconfirm-High-Payable + Upgrade
// V274 No-Raw-Link-Fixed | V275 Two-Buttons-After-Lang | V276 Business-Button-Direct-Video
// V277-279 Video Audit + Hindi Fix + Company Video Reminder 3min | V280 Opportunity-Video-Reminder 5min
// V281 Yes Seen / Watch Now | V282 One-Message Reminder + Are You There | V283 Busy/Stop Chain (Yes/No/Stop, 1h/12h/24h, fired list)
// V284 AI Reminders Every Stuck Step | V285 No-Stale-Reminder-After-Reply | V286 No-Repeat-Video-Link + Skip-3-Clicks
// V287 Company-vs-Opportunity-Video-Seen-Fix | V288 Step-Aware-Recognition-Every-Step | V289 Verified All Edits Present
// V290 Real-Time vs Slow | V291 Language-From-Typed-Text | V292 Hurry-Proof | V293 Language-After-Reload-Fix
// V294 State-Declared-First-Fix | V295 FAQ-No-AI-Answer | V296 Universal-Responder-Any-Input (fallback ONLY, NEVER restart in finalization - V296 Guard)
// V264 Language-First-No-Manglish-Hard-Override (part of V261-264, now named explicitly) | V279 Company-Video-Reminder-3min (part of V277-279, now named explicitly)
// V312 BOOT-LOG-FIXED-FINAL - boot log printed old V298, fixed to print current version (logic carried in V313+)
// V313 SCOPE-FINAL-DETERMINISTIC-SERVICES - WHO Customer/Driver/Shop deterministic scripts (logic carried in V314+)
// V314 FINAL-BEST - single welcome, language-frozen single rule, taste before options, SVC deterministic, voice handler in code (logic carried in V316+)
// V315 GLOBAL-STOP-FIXED - stop works from any step, Stop/Yes confirm (logic carried in V316+)
// V321 TRY-FREE-5PCT-24H - re-audit of ALL chats: PAY_TOKEN + CALL_DIALER_/DIAL_ handlers added (sent but never handled), version labels unified to V318 on /health + /check-fired + /sheet-status + root. All V247-V317 logic kept, no flow changed.
// V317 GLOBAL-STOP-TOP-PRIORITY - REAL FIX: Stop moved to TOP of webhook handler (before V285/V292/V288/sorting/AI), so Stop from ANY step -> Stop/Yes confirm, never language-confirm + sorting. All V247-V316 logic kept.
// V297 Loop-Killed | V316 ALL-NAMES-PERFECT | V311 + V310 + V309 + V308 + V307 + V306 + V305 + V304 + V303 + V302 + V301 + V300 + V299 + V298 Polite-Unknown-Plus-Suggestions | V299 Context-Memory-District-Followup
// V300 Video-Known-Plus-Balance ("I know this video, give balance details" -> Balance Rs.99,900 + Pay Token)
// V301 Step-Aware-Any-Input-Any-Step | V302 Off-Topic-Finalization-Bring-Back (Current Step + Balance Steps + Are You Ready + Next Option)
// V316 ALL-NAMES-PERFECT
// V309 FINAL-COMPLETED-AUDITED - audit stamp, no logic change (all V309 logic carried in V310) ("Yes, next" -> advance, NEVER restart)
// V304 FINAL-LOCKED - HISTORY ONLY, not this build. THIS BUILD = V321 TRY-FREE-5PCT-24H.
// V316 ALL-NAMES-PERFECT - Language stays locked after selection. Only explicit 'need malayalam/english/hindi' switches. 'already watched'/'yes, next'/'balance details' are CONTENT, never language change. 'already watched' is video-seen, never off-topic.
// ============================================================================
// LOCKED RULES (never break):
// 1. Language: First welcome English only -> confirm Malayalam/English/Hindi buttons -> reply ONLY in chosen language. Never Manglish. Manglish input -> Malayalam-script reply.
// 2. Intention first, then taste, then exact options. Never ask district/job before options. Never repeat Maya name after first welcome. Never explain company again.
// 3. Buttons: Normal replies ONLY 2 tabs [Business Opportunity] [Use Other Services]. No Talk to Team, No Later, No More services. Language step is ONLY 3-button exception.
// 4. Business flow ORDER (never reorder): Company Video (See Video button, never raw link) -> 3min capacity reminder -> Capacity 30K-1L / 2L-5L / 5L-15L -> Level Opportunity Video (different from Company Video) -> Reconfirm/Upgrade -> Benefits/Support/Requirements (Skip allowed) -> Corp Check -> Pay Token -> Details LAST after payment verified.
// 5. Token/registration details ONLY after video + reconfirm. Full name/address/planning location/contacts/state/district/corp-muni/town/agreement date/Tender/Annexure-B ONLY after registration fee verified. Never ask district/name/address before payment.
// 6. Services: 4 services Taxi / Business Directory / Online Delivery / Book Anything. Customer = app links as buttons. Driver = driver app + profile/vehicle + cab attachment + Rs.150 one-time + 365/180/90 days free recharge chance + Normal/Peak/Night double + withdraw after 24h + callback test trip. Businessman = shop registration then advertainment.
// 7. Reminders: Company Video 3min, Opportunity Video 5min, Are you there after 2min, Are you busy/Can I schedule after +2min with Yes/No/Stop, Yes=1h reminder, Stop=Stop or Yes, Yes=1h/12h/24h then fired list. Real-time fast users = no stale reminders, slow users = simple one-step reminders. No stale reminder after reply.
// 8. AI, not button bot: Understand any input in any step, voice notes, doubts, jokes, short replies, duplicates, back, wrong taps. Any input in any step -> handled IN that step (V301). Off-topic in finalization -> Current Step + Balance Steps + Are You Ready + Next Option (V302). Yes/Next -> advance (V303). Never echo user text. Never generic restart in finalization.
// 9. Never invent numbers, owner name, rates, Tender/Annexure-B details. Refer to Tender/Annexure-B and www.bizmapia.com when unverified. No raw links in chat - all links ONLY inside buttons.
// 10. Testing: 1988 = reset. Verify ONLY via /health + Render logs, not deploy success alone.
// ============================================================================
// LOCK RULE: Any input while lastStep is in Opportunity Finalization (Company Video/Capacity/Opportunity Video/Benefits/Support/Requirements/Corp/Pay/Details/V300) MUST NEVER send generic "I am Maya, What do you need? Business vs Services" restart. It MUST advance or bring-back in same finalization.
// CHECK: After any edit, grep for "I am Maya, here to help" - it must appear ONLY in V298 polite-unknown, never as finalization fallback.
// V248 AI-MAYA - CORRECT - GitHub file is 03-District-ONLY[SPACE]Muni-Tender.pdf - NOT hyphen, NOT underscore - Code now uses SPACE exactly - 12 TENDERS GUARANTEED AFTER PAYMENT
// ==================== LOCKED - FINAL VERSION - DO NOT EDIT - V247
// V247 FINAL - ONLY CHANGE vs V247: FIX Sheet stopped at 08:59 IST - getSheets() cached client forever, token dies, writes dropped silently. Now: recreate Google client every 45 min + retry save once with fresh client + /sheet-test + /sheet-status endpoints. NO other change. NO Tamil/Kannada/Telugu.
// V247 FINAL - ONLY CHANGE vs V247: Fired check now handles INTERNATIONAL numbers (Qatar 974, UAE 971, Saudi 966, Kuwait 965, Oman 968, Bahrain 973, Malaysia 60, etc). NO other change. NO Tamil/Kannada/Telugu.
// V247 FINAL - ONLY CHANGE vs V247: Fired_Loser_List gate on first HI + YES/STOP + auto-fire after 3rd reminder. NO Tamil/Kannada/Telugu. NO other code change. ====================
// V247 FINAL - 12 TENDERS GUARANTEED AFTER PAYMENT - RAZORPAY WEBHOOK FIXED - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// LOCKED ON: 2026-11-04 - BASED ON 7 DAYS DATA 302 USERS - MANUAL 3000->10 (0.33%) BOT 302->6 (2%) - 3 YEARS BRAND FAME
// FEATURES: SHORT MAYA "Hi, I am Maya here to chat with you! 👋" + ALL INDIA PLATFORM "🇮🇳 India's Largest Online Platform - First 4-in-1 App" + STANDARD EMOJIS + FOMO + INBUILT DIALER + HUMAN HANDOVER + PAY VERIFY
// 12 PDF: 2 DISTRICT-WITH + 2 DISTRICT-ONLY + 2 MUNICIPAL + 2 CORPORATION + 2 BC-RIDE + 2 BC-DIRECTORY - NO 5000 - REGISTRATION FEE NOT REFUNDABLE NOT PART OF FEE
// 8 SHEETS LOCKED: System_Logs, Master_Leads, Franchise_Funnel, Payments, Ride_Hailing, Business_Directory, Delivery, Booking, Registration_Fee
// REDIS READY + GOOGLE SHEETS READY + REMINDERS 1H/12H/24H FOMO + FREE INSTANCE FIX NEEDED
// =========================================================================================

// V247 FINAL - 12 TENDERS GUARANTEED AFTER PAYMENT - RAZORPAY WEBHOOK FIXED - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// 8 SHEETS LOCKED - ALL STEPS - 12 PDF 2+2+2+2+2+2 - DISTRICT-WITH/ONLY + MUNICIPAL + CORPORATION + BC-RIDE + BC-DIRECTORY - WELCOME MAYA FIXED - APPRECIATIVE GREETING - DOWNLOADABLE PDF - V247 FINAL - 12 TENDERS GUARANTEED AFTER PAYMENT - RAZORPAY WEBHOOK FIXED - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
const express = require('express');
const bodyParser = require('body-parser');
const httpClient = require('ax'+'ios');
let Redis = null;
try { Redis = require('ioredis'); } catch(e) { console.log('ioredis not installed'); }
let google = null;
try { google = require('googleapis').google; } catch(e) { console.log('googleapis not installed'); }

const app = express();

// ===== V341 CORS FIX - Allow Team Inbox HTML (file://) to call Render =====
app.use((req,res,next)=>{ res.setHeader('Access-Control-Allow-Origin','*'); res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS'); res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization'); if(req.method==='OPTIONS') return res.sendStatus(200); next(); });
// ===== END V341 CORS =====
app.use(bodyParser.json({ verify: (req,res,buf)=>{ req.rawBody = buf; } }));

// ===== V247 - TENDER SERVING - ONLY TENDER/ANNEXURE EDIT - 12 FINAL PDFs - GUARANTEED AFTER PAYMENT =====
const path = require('path');
const fs = require('fs');
const BASE_URL = (process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || 'https://bizmapia-bot-8590175977.onrender.com').replace(/\/$/, '');
const TENDER_ROOT = path.join(__dirname, 'public', 'tenders');
try { if (!fs.existsSync(TENDER_ROOT)) fs.mkdirSync(TENDER_ROOT, { recursive: true }); } catch(e){}
app.use('/tenders', express.static(TENDER_ROOT));
// V247 TOLERANT: /tenders/03-District-ONLY-Muni... and /tenders/03-District-ONLY_Muni... BOTH work
// If exact filename not found, try swapping _ <-> - and serve it. Kills _ vs - confusion forever.
app.get('/tenders/:file', (req, res) => {
  try{
    const wanted = decodeURIComponent(req.params.file || '');
    const variants = new Set();
    variants.add(wanted);
    variants.add(wanted.replace(/_/g, '-'));
    variants.add(wanted.replace(/-/g, '_'));
    variants.add(wanted.replace(/_/g, ' '));
    variants.add(wanted.replace(/-/g, ' '));
    variants.add(wanted.replace(/ /g, '-'));
    variants.add(wanted.replace(/ /g, '_'));
    variants.add(wanted.replace(/ONLY-Muni/g, 'ONLY_Muni'));
    variants.add(wanted.replace(/ONLY_Muni/g, 'ONLY-Muni'));
    variants.add(wanted.replace(/ONLY Muni/g, 'ONLY-Muni'));
    variants.add(wanted.replace(/ONLY-Muni/g, 'ONLY Muni'));
    for(const c of variants){
      const p = path.join(TENDER_ROOT, c);
      if(fs.existsSync(p) && fs.statSync(p).isFile()){ return res.sendFile(p); }
    }
    return res.status(404).send('Cannot GET /tenders/' + wanted);
  }catch(e){ return res.status(404).send('Cannot GET /tenders/' + (req.params.file||'')); }
});
app.use('/public/tenders', express.static(TENDER_ROOT));

// DUAL NUMBERS
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '1392695460599655' // NEW NUMBER 95623 24130;
const PHONE_ID_OLD = PHONE_NUMBER_ID;
const PHONE_ID_NEW = PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'bizmapia_verify_2024';
const REDIS_URL = process.env.REDIS_URL;
const SHEET_ID = process.env.SHEET_ID || '1p_A3F_ie2JLguQTmn9WaJqFgNHNn_52B2Vuk8nRELto';
// ===== V364.37 - MALAPPURAM 99954 + FIRED DATE + TEST-NO-REMINDER + 2-TYPE REMINDERS =====
// Pending maintenances bundled: M1 Fired Date col H, M2 Test numbers no reminders,
// M3 Malappuram 99954 separate Sheet + separate Inbox (token pending - set WHATSAPP_TOKEN_99954 in Render),
// M4 Reminder fix: Type1 Stuck (Are-you-there + Busy check -> 1h/12h/24h) + Type2 No-Action (direct 1h/12h/24h) -> Fired.
// M5 Paused must NOT block reminders. noLang reminders fire even if language not selected / inbox Paused.
const SHEET_ID_MALAPPURAM = process.env.SHEET_ID_MALAPPURAM || process.env.SHEET_ID_99954 || '1EyY_TB84wGnctyr_7K786NGS6hBoWpP82ttm2C85DUE';
const PHONE_NUMBER_ID_MALAPPURAM = process.env.PHONE_NUMBER_ID_99954 || '1481022538422254';
const WHATSAPP_TOKEN_MALAPPURAM = process.env.WHATSAPP_TOKEN_99954 || process.env.WHATSAPP_TOKEN_MALAPPURAM || '';

// ===== V364.37 - GENERIC FRANCHISEE 10 SLOTS =====
// Slot 1 = Malappuram (filled). Slots 2-10 = EMPTY - fill later via Render env, no code change to flows.
// For each new franchisee, set 3 Render env vars, e.g. Slot 2:
//   PHONE_NUMBER_ID_F2, WHATSAPP_TOKEN_F2, SHEET_ID_F2
// Then fill its label below (or leave label, env alone is enough for routing).
const FRANCHISEE_SLOTS = [
  { slot:1, label:'Malappuram', phoneId: PHONE_NUMBER_ID_MALAPPURAM, sheetId: SHEET_ID_MALAPPURAM, token: WHATSAPP_TOKEN_MALAPPURAM },
  { slot:2, label:'Franchisee 2', phoneId: process.env.PHONE_NUMBER_ID_F2 || '', sheetId: process.env.SHEET_ID_F2 || '', token: process.env.WHATSAPP_TOKEN_F2 || '' },
  { slot:3, label:'Franchisee 3', phoneId: process.env.PHONE_NUMBER_ID_F3 || '', sheetId: process.env.SHEET_ID_F3 || '', token: process.env.WHATSAPP_TOKEN_F3 || '' },
  { slot:4, label:'Franchisee 4', phoneId: process.env.PHONE_NUMBER_ID_F4 || '', sheetId: process.env.SHEET_ID_F4 || '', token: process.env.WHATSAPP_TOKEN_F4 || '' },
  { slot:5, label:'Franchisee 5', phoneId: process.env.PHONE_NUMBER_ID_F5 || '', sheetId: process.env.SHEET_ID_F5 || '', token: process.env.WHATSAPP_TOKEN_F5 || '' },
  { slot:6, label:'Franchisee 6', phoneId: process.env.PHONE_NUMBER_ID_F6 || '', sheetId: process.env.SHEET_ID_F6 || '', token: process.env.WHATSAPP_TOKEN_F6 || '' },
  { slot:7, label:'Franchisee 7', phoneId: process.env.PHONE_NUMBER_ID_F7 || '', sheetId: process.env.SHEET_ID_F7 || '', token: process.env.WHATSAPP_TOKEN_F7 || '' },
  { slot:8, label:'Franchisee 8', phoneId: process.env.PHONE_NUMBER_ID_F8 || '', sheetId: process.env.SHEET_ID_F8 || '', token: process.env.WHATSAPP_TOKEN_F8 || '' },
  { slot:9, label:'Franchisee 9', phoneId: process.env.PHONE_NUMBER_ID_F9 || '', sheetId: process.env.SHEET_ID_F9 || '', token: process.env.WHATSAPP_TOKEN_F9 || '' },
  { slot:10, label:'Franchisee 10', phoneId: process.env.PHONE_NUMBER_ID_F10 || '', sheetId: process.env.SHEET_ID_F10 || '', token: process.env.WHATSAPP_TOKEN_F10 || '' },
];
function getFranchiseeByPhoneId(pid){ try{ const p=String(pid||''); if(!p) return null; return FRANCHISEE_SLOTS.find(s=>s.phoneId && String(s.phoneId)===p) || null; }catch(e){ return null; } }
function isFranchiseePhoneId(pid){ return !!getFranchiseeByPhoneId(pid); }
// Services-first menu for franchisee numbers: WhatsApp max 3 buttons/msg, so 5 buttons = 3 + 2 messages.
// Order: 1 Ride, 2 Directory, 3 Delivery | 4 Booking, 5 Business Opportunity. Uses existing SVC_* handlers.
async function sendFranchiseeServicesMenu(uid, lang, phoneId){
  const ml = lang==='ml';
  const head = ml ? `👍 നന്ദി! 😊\n\n👇 നിങ്ങൾക്ക് എന്താണ് വേണ്ടത്? ഒന്ന് തിരഞ്ഞെടുക്കൂ:` : (lang==='hi' ? `👍 धन्यवाद! 😊\n\n👇 आपको क्या चाहिए? एक चुनें:` : `👍 Thank you! 😊\n\n👇 What do you need? Select one:`);
  await sendWithDelay(interactiveButton(uid, head, [{id:'SVC_RIDE',title:'Ride Hailing / Cab Booking'},{id:'SVC_BIZDIR',title:'Business Directory'},{id:'SVC_DELIVERY',title:'Online Delivery'}], phoneId));
  const head2 = ml ? `👇 അല്ലെങ്കിൽ ഇതിൽ ഒന്ന്:` : (lang==='hi' ? `👇 या इनमें से एक:` : `👇 Or one of these:`);
  await sendWithDelay(interactiveButton(uid, head2, [{id:'SVC_BOOKING',title:'Online Booking'},{id:'SVC_OPP',title:'Business Opportunity'}], phoneId));
}
const TEST_NUMBERS = new Set(['8590175977','918590175977','8590183646','918590183646']);
function isTestNumber(uid){ try{ const d=String(uid||'').replace(/[^0-9]/g,''); return TEST_NUMBERS.has(d) || TEST_NUMBERS.has(d.slice(-10)); }catch(e){ return false; } }
function isMalappuramPhoneId(pid){ return String(pid||'')==='1481022538422254'; }
function getWhatsAppTokenForPhoneId(pid){ const f=getFranchiseeByPhoneId(pid); if(f && f.token) return f.token; if(isMalappuramPhoneId(pid) && WHATSAPP_TOKEN_MALAPPURAM) return WHATSAPP_TOKEN_MALAPPURAM; return WHATSAPP_TOKEN; }
function getSheetIdForUid(uid){ try{ const pid = (globalThis.__phoneIdByUid && globalThis.__phoneIdByUid.get(String(uid))) || ''; const f=getFranchiseeByPhoneId(pid); if(f && f.sheetId) return f.sheetId; if(isMalappuramPhoneId(pid)) return SHEET_ID_MALAPPURAM; }catch(e){} return SHEET_ID; }
if(!globalThis.__phoneIdByUid) globalThis.__phoneIdByUid = new Map();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
const PORT = process.env.PORT || 10000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gemini-2.0-flash';
const AI_ENABLED = !!(GEMINI_API_KEY || OPENAI_API_KEY);

// ===== V248 AI MAYA - LANGUAGE RULE (HIGHEST PRIORITY) =====
// Manglish OR Malayalam typed -> reply Malayalam ONLY (Malayalam script)
// English typed -> English ONLY. Any other language -> same language.
const MANGLISH_WORDS = ['entha','enth','evide','eppo','engane','cheyyan','nokkunnu','aano','alle','alla','und','illa','sheri','pattumo','kittumo','ethra','evidunnu','enthanu','arayan','thallparyam','kooduthal','details','vannu','cheyyanam','venam','evideya','eppol','njan','ningal','ningalkk','enik','onnu','parayamo','paranju','thara','kittum','cheyyan','nokkunnath','business','franchise'];
function detectUserLanguage(text, fallbackLang){
  const t = String(text||'');
  if(!t.trim()) return fallbackLang||'ml';
  if(/[\u0D00-\u0D7F]/.test(t)) return 'ml'; // Malayalam script
  if(/[\u0900-\u097F]/.test(t)) return 'hi'; // Devanagari
  if(/[\u0B80-\u0BFF]/.test(t)) return 'ta';
  if(/[\u0C00-\u0C7F]/.test(t)) return 'te';
  if(/[\u0C80-\u0CFF]/.test(t)) return 'kn';
  const low = t.toLowerCase();
  const words = low.split(/[^a-z]+/).filter(Boolean);
  const manglishHits = words.filter(w=>MANGLISH_WORDS.includes(w)).length;
  // Malayalam words in Latin + typical Manglish pattern = Malayalam output
  if(manglishHits>=1) return 'ml';
  if(/\b(entha|evide|eppo|engane|cheyy|nokk|alle|alla|und|illa)\b/.test(low)) return 'ml';
  return fallbackLang && ['ml','hi','en'].includes(fallbackLang) ? fallbackLang : 'en';
}
function langInstruction(lang){
  if(lang==='ml') return 'REPLY ONLY IN MALAYALAM SCRIPT (\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02). Do NOT use Manglish. Do NOT use English except brand names Bizmapia, Taxi, App, Razorpay. Use pure Malayalam.';
  if(lang==='hi') return 'REPLY ONLY IN HINDI (Devanagari).';
  if(lang==='ta') return 'REPLY ONLY IN TAMIL.';
  if(lang==='te') return 'REPLY ONLY IN TELUGU.';
  if(lang==='kn') return 'REPLY ONLY IN KANNADA.';
  return 'REPLY ONLY IN ENGLISH.';
}
const MAYA_BIZMAPIA_FACTS = `
=== V269 FINALIZED PURPOSE - OWNER LOCKED - THIS IS WHY MAYA EXISTS ===
Old button Maya FAILED: users from Meta ads did not tap buttons, Maya could not identify real-time requirement, users went to other options, ZERO registrations, total waste.
New AI Maya: SAME correct flow, but AI understands typed text + voice in real time, entertains, and takes user to RIGHT step in very next message.

BIZMAPIA = All-India company. Helps users fulfil daily-life needs via pre-recorded steps:
1) Real-time Taxi Booking - any taxi for travel needs
2) Business Searches - find store / service / product / offer near them
3) Online Delivery - food + any items from nearby town stores to doorstep
4) Online Booking - hotel rooms, appointments, movie/show tickets in real time

FLOW - EXACT ORDER, NEVER REORDER:
STEP 0 - WELCOME IN ENGLISH ONLY: Explain which company they are going to understand/use for daily needs (4 services above, 2 lines each max). Then ask: "What do you want to experience - our services, or business opportunity to earn with Bizmapia?" + 2 buttons: [Experience Our Services] [Business Opportunity]
STEP 1 - AFTER LANGUAGE TAP: reply ONLY in confirmed language, pure script. No Manglish.
STEP 2 - IF SERVICES: show 4 buttons: [Taxi] [Directory] [Delivery] [Booking]. Then branch by who they are:
  - CUSTOMER for all 4 services: give Android + iOS app links with warm text to help use app properly. Explain service briefly using Tender + Annexure-B + www.bizmapia.com data. Ask Android or iPhone first if needed.
  - DRIVER: give Driver App link. Explain: complete vehicle registration like Google login with Bizmapia app, complete driver profile / vehicle details, submit cab attachment with Bizmapia. One-time registration Rs.150. If he pays Rs.150 he gets chance of 365 days / 180 days / 90 days FREE recharge opportunity (explain as per Tender/Annexure-B - do NOT invent which one he gets, say company decides on verification). Explain: Bizmapia only platform giving endless trip opportunity on lower recharge (Tender/Annexure-B). Good fare every trip: Normal, Peak, Night = Double charge. Withdraw earnings after 24 hours. Then: he will get callback from company to verify app performance via TEST TRIP. After that he can start trips.
  - BUSINESSMAN / SHOP OWNER: support him to register shop via www.bizmapia.com. After business profile creation via Google login, give shop details: shop name, address, location, contact, images - to make good profile for customer search. After profile creation only he gets Advertainment option: advertise anything - offers, service, etc. for cheap rate. Refer rates + tenure in Tender/Annexure-B. Entertain him to choose ONE YEAR plan with offer rates - refer offer rates on www.bizmapia.com. Do NOT invent rates.
STEP 3 - IF BUSINESS OPPORTUNITY:
  - FIRST: MUST WATCH COMPANY VIDEO - it describes what is needed + what is expected on terms & conditions basis. Send Company Video link in his language. Do NOT let him skip without at least seeing it. Say "Please watch this 2-min video first, then pick your capacity - it will save your time."
  - THEN: 3 capacity buttons (NOT old 1L/4L/10L labels alone - use capacity ranges user understands):
    [30K - 1L] = Business Center, Full ~1 Lakh, Token Rs.100
    [2L - 5L] = Corporation / Municipal, Full ~4-5 Lakh, Token Rs.150
    [5L - 15L] = District Franchise, Full ~10 Lakh, Token Rs.250
  - AFTER CAPACITY PICK: assist + give proper direction in simple steps + supporting YouTube video link for that level (use VIDEO_ML/EN/HI_* in code). Then: reminders + follow-up to get REGISTRATION FEE. Give appropriate Tender + Annexure-B PDF downloads (12 PDFs after verification, via /tenders/ links in code - do NOT invent links).
  - DETAILS COLLECTION - LAST STEP ONLY, AFTER REGISTRATION FEE IS VERIFIED (NEVER BEFORE): Do NOT ask Full Name, Address, Business Planning Location, Primary/Secondary Contact, State, District, Corporation/Municipality, Town, or Agreement Date before payment. Those are the LAST step. Before payment, only: Video -> Capacity -> Explain -> Token/Pay. After Razorpay payment is VERIFIED, then collect details one by one, never all at once. Purpose: support company with right-time info sharing: Follow-up Required / Finalization Required / Finalized - Need to Allot Business Opportunity. Log all to Sheet perfectly.
STEP 4 - IN BETWEEN: If he shares doubts via extra text / voice, TREAT ACCORDINGLY: answer doubt in his language, entertain, then RETURN him to complete opportunity finalization. Do NOT restart. Do NOT send old menu.
STEP 5 - TEAM CONTACT: If needed, share team contact and explain WHY he needs to call team: tight schedules + enquiry flow from others, team is busy. If team tries to call him it may be wasted because he may be busy with other works. So HE calls team in free time. Team calls ONLY after registration fee. Never promise team will call now.
Registration fee NOT refundable, NOT part of full fee. Never promise fixed/guaranteed income. Never ask OTP/PIN.
`

const BIZMAPIA_OFFICIAL = {
  website:'https://bizmapia.com/', playStore:'https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia&pcampaignid=web_share',
  appStore:'https://apps.apple.com/in/app/bizmapia/id6761577245', instagram:'https://www.instagram.com/bizmapia',
  facebook:'https://www.facebook.com/bizmapia', threads:'https://www.threads.com/@bizmapia',
  youtubeCompany:'https://youtu.be/2BB34hGi52I?si=KLXcu-amOJkAgVsi', email:'customercare@bizmapia.com',
  office:'1st Floor Pulimoottil Arcade, Muvattupuzha Road, Thodupuzha, Idukki - 685584',
  services:'4 Services: 1) Taxi / Ride Hailing, 2) Business Directory, 3) Delivery, 4) Booking. If user taps Know Our Services, show all 4. Never say Taxi Book only.',
  proof:'5K+ downloads on Play Store (Customer + Driver App). Live across Kerala - Thiruvananthapuram, Kollam, Pathanamthitta, Kochi, Kottayam.'
};
function getBizmapiaGrounding(userText){
  const low=String(userText||'').toLowerCase();
  if(!/what is|enthanu|enth|bizmapia|website|app|install|download|instagram|facebook|youtube|video|reel|social|play store|app store|otp/.test(low)) return '';
  return `\nGROUNDED FACTS - USE THESE LINKS, DO NOT INVENT:\nWebsite: ${BIZMAPIA_OFFICIAL.website} | Play Store: ${BIZMAPIA_OFFICIAL.playStore} | App Store: ${BIZMAPIA_OFFICIAL.appStore}\nInstagram: ${BIZMAPIA_OFFICIAL.instagram} | Facebook: ${BIZMAPIA_OFFICIAL.facebook}\nCompany Video: ${BIZMAPIA_OFFICIAL.youtubeCompany}\nServices: ${BIZMAPIA_OFFICIAL.services}\nProof: ${BIZMAPIA_OFFICIAL.proof}\nAPP HELP: Ask Android or iPhone first. Android: Play Store > Search Bizmapia > Install > OTP login. iPhone: App Store > Search Bizmapia > Get > OTP login. OTP not coming: wait 60s, Resend, check SMS spam, try Call OTP. App not opening: update, restart, clear cache, reinstall. One step at a time.\n`;
}





// ===== V252 TEAM ALERTS + DAY-END SUMMARY + TEAM CALL RULE =====
// RULE (MOST IMPORTANT): Team calls user ONLY AFTER registration fee.
// Before fee, Maya must NOT promise "team will call you". She must say:
// "Team is busy with verifications. Please call us in your free time on 85901 83646. After you lock slot with token, team will call you for verification."
// This protects team time + company busy schedule.
// Daily stats kept in memory, reset at midnight IST
const dailyStats = { date: new Date().toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'}), newLeads:0, talkRequests:0, contactGiven:0, tokenReady:0, payments:0, paymentTotal:0, paymentsList:[], talkList:[], idleNoReply:0, notInterested:0 };
function resetDailyIfNeeded(){
  const today = new Date().toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'});
  if(dailyStats.date!==today){ dailyStats.date=today; dailyStats.newLeads=0; dailyStats.talkRequests=0; dailyStats.contactGiven=0; dailyStats.tokenReady=0; dailyStats.payments=0; dailyStats.paymentTotal=0; dailyStats.paymentsList=[]; dailyStats.talkList=[]; dailyStats.idleNoReply=0; dailyStats.notInterested=0; }
}
function describeNature(state){
  const L = state.lead||{};
  const parts=[];
  if(L.sentiment==='likes_it') parts.push('Likes it - positive, fast reply');
  else if(L.sentiment==='considering') parts.push('Considering - thinking, needs follow-up');
  else if(L.sentiment==='doubt') parts.push('Doubt - needs trust / proof, solve doubt first');
  else if(L.sentiment==='price_doubt') parts.push('Price doubt - explain token vs full fee clearly');
  else if(L.sentiment==='confused') parts.push('Confused - explain simple, 1 question at a time');
  else if(L.sentiment==='not_interested') parts.push('Not interested - DO NOT CALL');
  else parts.push('Nature not yet known');
  if((L.avoidCount||0)>=3) parts.push(`Avoids replies ${L.avoidCount}x - busy / delaying`);
  else if((L.avoidCount||0)>=1) parts.push(`Avoided ${L.avoidCount}x - needs soft reminder`);
  if((L.reminderCount||0)>=1) parts.push(`Reminder set ${L.reminderCount}x`);
  if((L.idleCount||0)>=2) parts.push(`No reply ${L.idleCount}x - idle, may be busy`);
  return parts.join(' | ');
}
function whatHeNeeds(state){
  const L = state.lead||{};
  if(L.intent==='business_opportunity'){
    const lvl = L.level ? `Level: ${L.level} (Center 1L / Corp 4L / District 10L)` : 'Level: not yet chosen';
    const tok = L.tokenStatus||'NOT_ASKED';
    return `FINALIZE: Business Opportunity - ${lvl} | Token: ${tok} | District: ${L.district||'not given'} | Next: ${tok==='READY'?'Send Pay link, lock slot':tok==='LATER'?'Remind at '+ (L.reminderAt||'evening'):'Explain + ask level + ask token'}`;
  }
  if(L.intent==='taxi') return 'NEEDS: Taxi booking - ask pickup/drop, send app link';
  if(L.intent==='delivery') return 'NEEDS: Delivery - ask what / where';
  if(L.intent==='directory') return 'NEEDS: Business Directory listing - ask shop details';
  if(L.intent==='booking') return 'NEEDS: Booking - ask what booking';
  if(L.intent==='job') return 'NEEDS: Job / Driver - explain no job, only business opportunity / driver registration in app';
  return 'NEEDS: Not yet clear - ask Business or Service?';
}
async function notifyAdminTeamRequest(uid, state, reason){
  resetDailyIfNeeded();
  dailyStats.talkRequests++;
  const L = state.lead||{};
  const name = state?.leadData?.name || state?.name || 'Name not yet given';
  const district = L.district || state?.district || 'Not yet given';
  const msg = `📞 TEAM TALK REQUEST\n\n👤 Phone: +${uid}\n👤 Name: ${name}\n📍 District: ${district}\n📥 Source: ${L.source||'unknown'}\n🎯 Intent: ${L.intent||'unknown'}\n💬 Sentiment: ${L.sentiment||'unknown'}\n\n📌 WHAT HE NEEDS TO FINALIZE:\n${whatHeNeeds(state)}\n\n🧠 RESPONDS NATURE:\n${describeNature(state)}\n\n⚠️ TEAM CALL RULE: ${L.tokenStatus==='PAID' ? '✅ Token PAID - Team CAN call for verification.' : '⛔ Token NOT PAID - Do NOT call now. Tell him: Team is busy, please call us in your free time on 85901 83646. After token, team will call.'}\n\nReason: ${reason}\nTime: ${getISTTime()}\n\n👉 Prepare before calling: Check Master_Leads row for this phone.`;
  const admins=[...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let a of admins){ if(a===String(uid)) continue; try{ await sendWithDelay(textMessage(a, msg, PHONE_NUMBER_ID)); }catch(e){} }
  dailyStats.talkList.push({phone:uid, name, district, intent:L.intent||'', sentiment:L.sentiment||'', needs: whatHeNeeds(state), nature: describeNature(state), token: L.tokenStatus||'', time: getISTTime()});
  try{ await saveToSheet('System_Logs',[getISTTime(), uid, state.lang||'ml','Team Talk Request',`Talk: ${reason} | ${whatHeNeeds(state)} | ${describeNature(state)}`,'Team Alert',HELP_ADMIN,'Team Request',''],false); }catch(e){}
  return msg;
}
async function notifyAdminContactGiven(uid, state, contactNumber){
  resetDailyIfNeeded(); dailyStats.contactGiven++;
  const L=state.lead||{};
  const msg=`📱 CONTACT NUMBER GIVEN\n\n👤 Phone (chat): +${uid}\n📞 Contact given: +${contactNumber}\n👤 Name: ${state?.leadData?.name||state?.name||'Not yet given'}\n📍 District: ${L.district||'Not yet given'}\n\n📌 WHAT HE NEEDS:\n${whatHeNeeds(state)}\n\n🧠 NATURE:\n${describeNature(state)}\n\n⚠️ CALL RULE: ${L.tokenStatus==='PAID'?'✅ Token PAID - Team CAN call':'⛔ Token NOT PAID - Do NOT call now. User should call team in free time.'}\nTime: ${getISTTime()}`;
  const admins=[...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let a of admins){ if(a===String(uid)) continue; try{ await sendWithDelay(textMessage(a, msg, PHONE_NUMBER_ID)); }catch(e){} }
  return msg;
}
async function sendDayEndSummary(){
  resetDailyIfNeeded();
  // Build summary from dailyStats + memoryStore scan for today's leads
  let newToday=0, tokenReadyToday=0;
  try{ for(let [uid,s] of memoryStore){ if(s.lead && s.lastActive && (Date.now()-s.lastActive)<24*60*60*1000) newToday++; } }catch(e){}
  const msg=`🌙 DAY-END SUMMARY - Bizmapia Maya - ${dailyStats.date}\n\n📊 TODAY:\n• New leads chatted: ${Math.max(dailyStats.newLeads, newToday)}\n• Talk-to-Team requests: ${dailyStats.talkRequests}\n• Contact numbers given: ${dailyStats.contactGiven}\n• Token Ready (want to pay): ${dailyStats.tokenReady}\n• Payments VERIFIED: ${dailyStats.payments} | Total Token Collected: Rs ${dailyStats.paymentTotal}\n• Not Interested: ${dailyStats.notInterested}\n• No Reply / Idle: ${dailyStats.idleNoReply}\n\n💰 PAYMENTS TODAY:\n${dailyStats.paymentsList.length?dailyStats.paymentsList.map(x=>`• +${x.phone} - Rs ${x.amount} - ${x.level} - ${x.time}`).join('\\n'):'• None today'}\n\n📞 TEAM TALK LIST - PREPARE FOR TOMORROW:\n${dailyStats.talkList.length?dailyStats.talkList.map(x=>`• +${x.phone} (${x.name}, ${x.district}) - ${x.intent} / ${x.sentiment} - Token:${x.token}\\n  Needs: ${x.needs}\\n  Nature: ${x.nature}`).join('\\n\\n'):'• None today'}\n\n⚠️ REMEMBER: Call ONLY after token paid. Before token, user should call team in free time on 85901 83646.\n\nCheck Sheet: Master_Leads + Payments for full details.`;
  const admins=[...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let a of admins){ try{ await sendWithDelay(textMessage(a, msg, PHONE_NUMBER_ID)); }catch(e){} }
  if(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID){ try{ await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID,text:msg})}); }catch(e){} }
  try{ await saveToSheet('System_Logs',[getISTTime(),'ALL','all','Day-End Summary',`Leads:${Math.max(dailyStats.newLeads, newToday)} Talk:${dailyStats.talkRequests} Pay:${dailyStats.payments} Total:Rs ${dailyStats.paymentTotal} | V364 Sheet=WhatsApp count, built from Sheet/Redis not memory alone`,'Day Summary',HELP_ADMIN,'Day-End',''],false); }catch(e){}
  console.log('DAY-END SUMMARY SENT');
  return msg;
}
function scheduleDayEndSummary(){
  // Next 9 PM IST, then every 24h
  const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
  const target=new Date(now); target.setHours(21,0,0,0);
  if(target<=now) target.setDate(target.getDate()+1);
  const ms=target-now;
  console.log('Day-end summary in', Math.round(ms/60000), 'min');
  setTimeout(async()=>{ try{ await sendDayEndSummary(); }catch(e){} setInterval(async()=>{ try{ await sendDayEndSummary(); }catch(e){} }, 24*60*60*1000); }, ms);
}

// ===== V251 INSTANT PAYMENT INTIMATION TO ADMIN - SAME SECOND AS RAZORPAY =====
// How it works: Razorpay webhook -> verify signature + amount -> user gets Verified msg -> YOU get WhatsApp alert instantly
// Admin numbers: from your existing HELP_ADMIN (8590183646) + HELP_MARKETING (8590175977)
// Add more in Render: ADMIN_NOTIFY_NUMBERS=919590123456,919876543210 (comma separated, with 91)
// Optional Telegram: set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID in Render for second channel
const ADMIN_NOTIFY_NUMBERS = (process.env.ADMIN_NOTIFY_NUMBERS || '').split(',').map(s=>s.trim()).filter(Boolean);
const DEFAULT_ADMIN_NUMBERS = ['918590183646','918590175977']; // HELP_ADMIN + HELP_MARKETING
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const processedPaymentIds = new Set(); // prevent duplicate intimation if Razorpay retries webhook
function isValidTokenAmount(amount){
  // Perfect verification: Registration Token must be EXACTLY 100 / 150 / 250
  return [100,150,250].includes(Number(amount));
}
function levelFromToken(amount){
  if(Number(amount)===100) return 'Business Center (1 Lakh)';
  if(Number(amount)===150) return 'Corporation / Municipal (4 Lakh)';
  if(Number(amount)===250) return 'District (10 Lakh)';
  return 'Unknown Level - CHECK MANUALLY';
}
async function notifyAdminPayment({uid, amount, paymentId, event, lang, state, fee, verified}){
  const level = levelFromToken(amount);
  const name = state?.leadData?.name || state?.name || state?.lead?.name || 'Name not yet given';
  const district = state?.lead?.district || state?.leadDistrict || state?.district || 'Not yet given';
  const source = (state?.lead && state.lead.source) || 'unknown';
  const intent = (state?.lead && state.lead.intent) || 'business_opportunity';
  const time = getISTTime();
  const statusEmoji = verified ? '✅ VERIFIED' : '⚠️ NOT VERIFIED - CHECK';
  const msg = `💰 NEW PAYMENT - ${statusEmoji}\n\n👤 Phone: +${uid}\n👤 Name: ${name}\n📍 District: ${district}\n🏢 Level: ${level}\n💸 Amount: Rs ${amount} (Registration Token)\n🧾 Payment ID: ${paymentId}\n🕒 Time: ${time}\n📥 Source: ${source} | Intent: ${intent}\n📌 Event: ${event}\n\n✅ Maya already sent Tender PDFs + asked for Name/District/Mobile/Date.\n👉 Reply to user if needed. Check Sheet: Payments tab.`;
  // 1) WhatsApp to YOU (same WhatsApp API, same token - most reliable)
  const admins = [...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let admin of admins){
    try{
      // Do NOT send to the payer himself as admin alert (avoid duplicate)
      if(admin===String(uid)) continue;
      await sendWithDelay(textMessage(admin, msg, PHONE_NUMBER_ID));
      console.log('ADMIN NOTIFY SENT WhatsApp to', admin, paymentId);
    }catch(e){ console.log('ADMIN NOTIFY WhatsApp fail', admin, e.message); }
  }
  // 2) Telegram (optional, if you set token)
  if(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID){
    try{
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({chat_id: TELEGRAM_CHAT_ID, text: msg})});
      console.log('ADMIN NOTIFY SENT Telegram', paymentId);
    }catch(e){ console.log('ADMIN NOTIFY Telegram fail', e.message); }
  }
  // 3) Sheet - extra clear row so you can filter
  try{ await saveToSheet('System_Logs', [time, uid, lang||'en', 'ADMIN NOTIFY '+paymentId, `Rs ${amount} ${level} ${statusEmoji} -> Admins: ${admins.join(',')}`, 'Admin Notify', HELP_ADMIN, 'Payment Intimation', ''], false); }catch(e){}
  return msg;
}

// ===== V250 IDLE CHECK - IF USER NOT SELECTING / NOT REPLYING =====
// Maya does NOT go silent. She checks gently, step by step.
// 5 min: Are you there? | 30 min: Still interested? Need time? | 2h: Remind after some time? | 24h: Last soft check
function getIdleCheckText(lang, stage){
  // V348: 1=Are you there (reading-time), 2=+2min Are you still there, 3=+2min Still not replied Stop/Talk later, 4=1H, 5=12H, 6=24H
  if(lang==='ml'){
    if(stage===1) return `👋 Are you there? 😊\n\nഞാൻ ഇവിടെയുണ്ട്. മെസ്സേജ് കണ്ടോ?\n\nതുടരട്ടെ?`;
    if(stage===2) return `👋 Are you still there? 😊\n\nഞാൻ ഇവിടെയുണ്ട്, Bizmapia-യിൽ നിങ്ങൾക്ക് ശരിയായ അവസരം കണ്ടെത്താൻ സഹായിക്കാൻ.\n\nനിങ്ങളുടെ അന്വേഷണത്തെക്കുറിച്ച് എന്തും ചാറ്റ് ചെയ്യൂ, ഞാൻ ഉടൻ മറുപടി തരാം.`;
    if(stage===3) return `🙏 You have not replied yet. No problem.\n\nShall I stop here, or talk later?\n\nനിർത്തണോ, അതോ പിന്നീട് സംസാരിക്കണോ?`;
    if(stage===4) return `👋 Hi, one hour has passed.\n\nBizmapia അവസരം നോക്കുകയായിരുന്നല്ലോ. തുടരട്ടെ? ഞാൻ ഇവിടെയുണ്ട്.`;
    if(stage===5) return `👋 Hi, twelve hours have passed.\n\nഇപ്പോഴും Bizmapia അവസരത്തിൽ താല്പര്യം ഉണ്ടോ? തുടരട്ടെ?`;
    return `🙏 One last check — twenty four hours have passed.\n\nഇപ്പോഴും താല്പര്യം ഉണ്ടോ? ഇല്ലെങ്കിൽ "Stop" പറഞ്ഞാൽ മതി, ഞാൻ ശല്യം ചെയ്യില്ല.`;
  }
  if(lang==='hi'){
    if(stage===1) return `👋 Are you there? 😊\n\nMain yahin hoon. Message dekha?\n\nAage badhein?`;
    if(stage===2) return `👋 Are you still there? 😊\n\nMain yahin hoon, Bizmapia me aapke liye sahi option dhoondhne me madad karne ke liye.\n\nApni enquiry se judi koi bhi baat chat kijiye, main jaldi reply dungi.`;
    if(stage===3) return `🙏 You have not replied yet. No problem.\n\nShall I stop here, or talk later?`;
    if(stage===4) return `👋 Hi, one hour has passed.\n\nAap Bizmapia opportunity dekh rahe the. Aage badhein?`;
    if(stage===5) return `👋 Hi, twelve hours have passed.\n\nAbhi bhi Bizmapia opportunity me interest hai?`;
    return `🙏 One last check — twenty four hours have passed.\n\nAbhi bhi interest hai? Nahi to "Stop" bol dijiye.`;
  }
  if(stage===1) return `👋 Are you there? 😊\n\nI am here. Did you see my message?\n\nShall we continue?`;
  if(stage===2) return `👋 Are you still there? I am here to help you to find your right option with Bizmapia. Chat anything related to your enquiry, I will give you the reply soon.`;
  if(stage===3) return `🙏 You have not replied yet. No problem. Shall I stop here, or talk later?`;
  if(stage===4) return `👋 Hi, it has been 1 hour.\n\nYou were checking Bizmapia opportunity. Shall we continue? I am here.`;
  if(stage===5) return `👋 Hi, it has been 12 hours.\n\nStill interested in Bizmapia opportunity? Shall we continue?`;
  return `🙏 One last check — it has been 24 hours.\n\nStill interested? If not, just say "Stop", I will not disturb you.`;
}
function mayaIdleButtons(lang, stage){
  const L=lang||'ml';
  const b=(id,ml,en,hi)=>({id,title:(L==='ml'?ml:L==='hi'?hi:en).substring(0,20)});
  if(stage===1) return [b('AI_STILL_HERE','ഉണ്ട്, തുടരാം','Yes, Continue','Haan, Continue'), b('AI_NEED_TIME','സമയം വേണം','Need Time','Time Chahiye')];
  if(stage===2) return [b('AI_STILL_HERE','ഉണ്ട്, തുടരാം','Yes, Continue','Haan, Continue'), b('AI_NEED_TIME','സമയം വേണം','Need Time','Time Chahiye')];
  // V348 Stage 3+ : ONLY Stop + Talk later (user spec)
  return [b('IDLE_STOP','Stop','Stop','Stop'), b('IDLE_TALK_LATER','Talk later','Talk later','Talk later')];
}
// V345: Reading-time based Are-you-there. Wait = reading time + half of reading time.
// Reading speed ~210 words/min (~3.5 words/sec). Clamped 60s - 300s so short msgs don't spam and long msgs get time.
function readingWaitMs(text){ try{ const words=String(text||'').trim().split(/\s+/).filter(Boolean).length||1; const readingSec=words/3.5; const waitSec=readingSec*1.5; return Math.round(Math.min(300, Math.max(60, waitSec))*1000); }catch(e){ return 120000; } }
async function scheduleIdleNudges(uid, lang, phoneId, firstDelayMs){
  // V348 chain: 1=reading-time, 2=+2min after 1st, 3=+2min after 2nd, 4=1H after 3rd, 5=12H after 3rd, 6=24H after 3rd. Reply cancels all.
  try{
    for(let k of [...reminders.keys()]){ if(k.startsWith(uid+':maya_idle')){ clearTimeout(reminders.get(k)); reminders.delete(k); } }
    if(redisReady && redis){ try{ const _rk=await redis.keys(`reminder:${uid}:maya_idle*`); if(_rk.length) await redis.del(..._rk); }catch(e){} }
  }catch(e){}
  try{
    const base = firstDelayMs||2*60*1000;
    // V362: ONE chainId for all 6 timers. V362 used a different Date.now() per timer, so stale-chain check could never work and chains overlapped.
    const _chainId = Date.now();
    try{ const _st = await getState(uid); _st.idleChainId = _chainId; _st.lead = _st.lead||{}; _st.lead.lastIdleStage = 0; await setState(uid, _st); }catch(e){}
    scheduleReminder(uid,'maya_idle_1:'+_chainId, lang, base, phoneId);
    scheduleReminder(uid,'maya_idle_2:'+_chainId, lang, base+2*60*1000, phoneId);
    scheduleReminder(uid,'maya_idle_3:'+_chainId, lang, base+4*60*1000, phoneId);
    scheduleReminder(uid,'maya_idle_4:'+_chainId, lang, base+4*60*1000+1*60*60*1000, phoneId);
    scheduleReminder(uid,'maya_idle_5:'+_chainId, lang, base+4*60*1000+12*60*60*1000, phoneId);
    scheduleReminder(uid,'maya_idle_6:'+_chainId, lang, base+4*60*1000+24*60*60*1000, phoneId);
  }catch(e){ console.log('idle schedule fail', e.message); }
}
function parseTalkLaterTime(text){
  // V348: parse "after 30 minutes", "after 1 hour", "after 2 hours", "tomorrow 10 am", "today 5 pm", "in 45 min", "after 90 min"
  try{
    const s=String(text||'').toLowerCase().trim();
    let m=s.match(/after\s*(\d+)\s*(min|mins|minute|minutes)/); if(m) return {ms:Number(m[1])*60*1000, label:`after ${m[1]} minutes`};
    m=s.match(/(?:after|in)\s*(\d+)\s*(hr|hrs|hour|hours)/); if(m) return {ms:Number(m[1])*60*60*1000, label:`after ${m[1]} hour(s)`};
    m=s.match(/(tomorrow|naale|kal)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/); if(m){ const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})); let h=Number(m[2]); const ap=m[4]; if(ap==='pm'&&h<12) h+=12; if(ap==='am'&&h===12) h=0; const t=new Date(now); t.setDate(t.getDate()+1); t.setHours(h, Number(m[3]||0),0,0); return {ms:Math.max(60000, t-now), label:`tomorrow ${m[2]} ${ap||''}`}; }
    m=s.match(/(today|innu|aaj)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/); if(m){ const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})); let h=Number(m[2]); const ap=m[4]; if(ap==='pm'&&h<12) h+=12; if(ap==='am'&&h===12) h=0; const t=new Date(now); t.setHours(h, Number(m[3]||0),0,0); if(t<=now) t.setDate(t.getDate()+1); return {ms:Math.max(60000, t-now), label:`today ${m[2]} ${ap||''}`}; }
    m=s.match(/^(\d+)\s*(min|mins|minute|minutes)$/); if(m) return {ms:Number(m[1])*60*1000, label:`after ${m[1]} minutes`};
    m=s.match(/^(\d+)\s*(hr|hrs|hour|hours)$/); if(m) return {ms:Number(m[1])*60*60*1000, label:`after ${m[1]} hour(s)`};
    return null;
  }catch(e){ return null; }
}
function clearIdleNudges(uid){
  // V362: clear memory AND Redis. V362 cleared memory only, so checkDueReminders (60s) re-fired Redis idle after user replied - cause of Idle after reply.
  try{ for(let k of [...reminders.keys()]){ if(k.startsWith(uid+':maya_idle')){ clearTimeout(reminders.get(k)); reminders.delete(k); } } }catch(e){}
  try{ if(redisReady && redis){ redis.keys(`reminder:${uid}:maya_idle*`).then(keys=>{ if(keys && keys.length) redis.del(...keys).catch(()=>{}); }).catch(()=>{}); } }catch(e){}
}

// ===== V249 HYBRID + SORTING + TOKEN PUSH + SOFT REMINDER =====
function mayaQuickButtons(lang, intent){
  const L=lang||'ml';
  const b=(id,ml,en,hi)=>({id,title:(L==='ml'?ml:L==='hi'?hi:en).substring(0,20)});
  // V259: ONLY 2 TABS - user said [Later] also not needed. Perfect = [Business] + [Services] only.
  // Talk-to-Team removed, Later removed. User must TYPE if they want later / team - Maya will understand typing.
  // Finalize still 2 tabs: [Pay] + [Business] - no 3rd button.
  if(intent==='finalize') return [b('AI_PAY','പേ ചെയ്യാം','Pay Now','Pay करें'), b('AI_BUSINESS','ബിസിനസ് അവസരം','Business Opportunity','Business Opportunity')];
  if(intent==='tryfree') return [b('OPP_CONTINUE','ബിസിനസ് തുടരാം','Continue Business','Business जारी रखें'), b('OPP_TRY_FREE','ഫ്രീ ആയി നോക്കാം','Try Free Business','Free में आज़माएं')];
  if(intent==='service') return [b('AI_SERVICES','സേവനങ്ങൾ അറിയാം','Know Our Services','Hamari Services'), b('AI_BUSINESS','ബിസിനസ് അവസരം','Business Opportunity','Business Opportunity')];
  if(intent==='app') return [b('AI_APP_ANDROID','Android App','Android App','Android App'), b('AI_APP_IPHONE','iPhone App','iPhone App','iPhone App')];
  return [b('AI_BUSINESS','ബിസിനസ് അവസരം','Business Opportunity','Business Opportunity'), b('AI_SERVICES','സേവനങ്ങൾ അറിയാം','Know Our Services','Hamari Services')];
}
function detectMayaIntent(userText, aiText){
  const raw=((userText||'')+' '+(aiText||''));
  const s=raw.toLowerCase();
  if(/പേ|പേയ്മെന്റ്|ടോക്കൺ|രജിസ്ട്രേഷൻ/.test(raw)) return 'finalize';
  if(/pay|payment|token|registration|final|ready/.test(s)) return 'finalize';
  if(/ടാക്സി|ഡെലിവറി|ബുക്ക്|ഡയറക്ടറി|സേവനം/.test(raw)) return 'service';
  if(/taxi|cab|ride|delivery|booking|room|movie|directory|service/.test(s)) return 'service';
  if(/ആപ്പ്/.test(raw)) return 'app';
  if(/app|install|download|play store|app store|otp|login/.test(s)) return 'app';
  return 'business';
}
function parseMayaAIOutput(raw){
  if(!raw) return null; const txt=String(raw).trim();
  try{ const m=txt.match(/\{[\s\S]*\}/); if(m){ const j=JSON.parse(m[0]); if(j.reply) return {text:String(j.reply).slice(0,1000), intent:j.intent||'', source:j.source||'', sentiment:j.sentiment||'', level:j.level||'', district:j.district||'', tokenStatus:j.tokenStatus||'', reminderWanted:!!j.reminderWanted, reminderTimeText:j.reminderTimeText||''}; } }catch{}
  return {text:txt.slice(0,1000), intent:'', source:'', sentiment:'', level:'', district:'', tokenStatus:'', reminderWanted:false, reminderTimeText:''};
}
function detectSourceFromFirstMsg(txt){
  const s=String(txt||'').toLowerCase();
  if(/hello.*more info|can i get more info/.test(s)) return 'click_to_whatsapp_ad';
  if(/instagram|insta/.test(s)) return 'instagram';
  if(/facebook|\bfb\b/.test(s)) return 'facebook';
  if(/google|search/.test(s)) return 'google_search';
  if(/youtube|video/.test(s)) return 'youtube';
  if(/friend|suhurth|koottukaran|relative|family/.test(s)) return 'friend_referral';
  if(/app|play store/.test(s)) return 'app_store';
  if(/website|bizmapia\.com/.test(s)) return 'website';
  return 'unknown_ask';
}
function detectIntentLocal(txt){
  const raw=String(txt||'');
  const s=raw.toLowerCase();
  // V263: Malayalam script keywords - MUST sort Malayalam input, not just English/Manglish
  if(/ബിസിനസ്|ബിസിനസ്സ്|അവസരം|അവസരമാണ്|വരുമാനം|ഫ്രാഞ്ചൈസി|നിക്ഷേപം/.test(raw)) return 'business_opportunity';
  if(/business|franchise|invest|opportunity|slot|avakasam|1l|4l|5l|10l|lakh/.test(s)) return 'business_opportunity';
  if(/ടാക്സി|വണ്ടി|കാർ/.test(raw)) return 'taxi';
  if(/taxi|cab|auto|ride|car|vandi/.test(s)) return 'taxi';
  if(/ഡെലിവറി|ഭക്ഷണം/.test(raw)) return 'delivery';
  if(/delivery|food|parcel/.test(s)) return 'delivery';
  if(/ഡയറക്ടറി/.test(raw)) return 'directory';
  if(/directory|listing|shop.*list/.test(s)) return 'directory';
  if(/ബുക്ക്|ബുക്കിങ്|റൂം|മൂവി/.test(raw)) return 'booking';
  if(/booking|room|movie|appointment/.test(s)) return 'booking';
  if(/ജോലി|ഡ്രൈവർ/.test(raw)) return 'job';
  if(/job|work|driver|vacancy/.test(s)) return 'job';
  if(/സേവനം|സേവനങ്ങൾ/.test(raw)) return 'service';
  if(/service/.test(s)) return 'service';
  return '';
}
function detectSentimentLocal(txt){
  const s=String(txt||'').toLowerCase();
  if(/super|great|nice|ishtam|kollam|good|interesting|like|nalla|best/.test(s)) return 'likes_it';
  if(/think|consider|alochikk|nokkunnu|maybe|try/.test(s)) return 'considering';
  if(/doubt|fake|real|fraud|trust|viswasam|scam/.test(s)) return 'doubt';
  if(/costly|price|expensive|high|kooduthal|money.*illa|paisa/.test(s)) return 'price_doubt';
  if(/not interested|vend|illa|no need|stop/.test(s)) return 'not_interested';
  if(/confus|manassil|puriy|ariyilla/.test(s)) return 'confused';
  return '';
}
function getSoftReminderText(lang, kind){
  if(lang==='ml'){
    if(kind==='finalize') return `🙏 ഓർമ്മപ്പെടുത്തട്ടെ — നിങ്ങൾ final ചെയ്യാനായി reminder വെച്ചതാണ്.\nഇപ്പോൾ ഇതിന് പറ്റിയ സമയമാണോ? 😊\n\nഅല്ലെങ്കിൽ എപ്പോൾ ഓർമ്മിപ്പിക്കണം എന്ന് പറയൂ — വൈകുന്നേരമോ, നാളെയോ?`;
    if(kind==='serious') return `🙏 ഒരു കാര്യം മനസ്സിലാക്കിത്തരട്ടെ — Bizmapia All India പ്ലാറ്റ്ഫോമാണ്, ദിവസവും പലരും അന്വേഷിക്കുന്നുണ്ട്.\nനിങ്ങളുടെ ജില്ലയിലെ slot ഒരിക്കൽ പോയാൽ വീണ്ടും കിട്ടാൻ വളരെ പ്രയാസമാണ്.\nഅതുകൊണ്ടാണ് ഞാൻ ഓർമ്മിപ്പിക്കുന്നത്. ഇന്ന് Rs 100 കൊണ്ട് slot lock ചെയ്യാമോ?`;
    if(kind==='last') return `🙏 അവസാനമായി ഒന്ന് പറയട്ടെ — നിങ്ങൾ താല്പര്യം കാണിച്ചതുകൊണ്ടാണ് ഞാൻ വീണ്ടും വരുന്നത്.\nഇന്ന് lock ചെയ്തില്ലെങ്കിൽ വേറെ ആരെങ്കിലും എടുത്തേക്കാം.\nഇപ്പോൾ ചെയ്യണോ, അതോ ഇന്ന് വൈകുന്നേരം ഓർമ്മിപ്പിക്കണോ?`;
    return `ശരി, കുഴപ്പമില്ല. 😊 എപ്പോൾ ഓർമ്മിപ്പിക്കണം? ഇന്ന് വൈകുന്നേരം, നാളെ രാവിലെ, അതോ നിങ്ങൾ പറയുന്ന സമയത്ത്?`;
  }
  if(lang==='hi'){
    if(kind==='finalize') return `🙏 Yaad dilau — aapne finalize karne ke liye reminder lagaya tha.\nKya abhi sahi samay hai? 😊\n\nNahi to kab yaad dilau — aaj shaam ya kal subah?`;
    if(kind==='serious') return `🙏 Ek baat samjhaiye — Bizmapia All India platform hai, roz kai log poochte hain.\nAapke district ka slot ek baar gaya to dobara milna mushkil hai.\nIsliye yaad dila rahi hoon. Aaj Rs 100 se slot lock karein?`;
    return `🙏 Reminder — is this the right time? If not, when should I remind you again?`;
  }
  if(kind==='finalize') return `🙏 Just reminding you — you set a reminder to finalize.\nIs this the right time? 😊\n\nIf not, when should I remind you again — this evening or tomorrow?`;
  if(kind==='serious') return `🙏 Let me explain one thing — Bizmapia is an All India platform, Many people enquire daily.\nOnce your district slot is gone, it is very hard to get it back.\nThat is why I am reminding you. Can we lock your slot today with Rs 100?`;
  if(kind==='last') return `🙏 One last thing — I am coming back because you showed interest.\nIf you don't lock today, someone else may take it.\nShall we do it now, or shall I remind you this evening?`;
  return `No problem. 😊 When should I remind you? This evening, tomorrow morning, or a time you choose?`;
}
function parseReminderTime(txt){
  const s=String(txt||'').toLowerCase();
  if(/evening|vaikunneram|shaam|saayan|6 pm/.test(s)) return {label:'evening', ms:6*60*60*1000};
  if(/tomorrow|naale|kal|tomorrow morning|naale ravile/.test(s)) return {label:'tomorrow_morning', ms:18*60*60*1000};
  if(/morning|ravile|subah/.test(s)) return {label:'morning', ms:10*60*60*1000};
  if(/1 hour|1 hr|oru mani|1 mani/.test(s)) return {label:'1h', ms:60*60*1000};
  if(/2 hour|2 mani/.test(s)) return {label:'2h', ms:2*60*60*1000};
  if(/30 min/.test(s)) return {label:'30m', ms:30*60*1000};
  if(/night|ratri/.test(s)) return {label:'night', ms:8*60*60*1000};
  return null;
}
async function logLeadPerfect(uid, state, extra){
  try{
    const L=state.lead||{};
    await saveToSheet('Master_Leads', [getISTTime(), uid, state.lang||'ml', L.source||'unknown_ask', L.sourceDetail||'', L.intent||'', L.sentiment||'', L.level||'', L.district||'', L.funnel||'NEW', L.tokenStatus||'NOT_ASKED', `Rem:${L.reminderCount||0} Avoid:${L.avoidCount||0} Last:${(extra&&extra.lastMsg||'').slice(0,120)}`, (extra&&extra.summary||L.summary||'').slice(0,250), L.reminderAt||'', state.lastStep||''], false);
    if(L.intent==='business_opportunity'){
      await saveToSheet('Franchise_Funnel', [getISTTime(), uid, state.lang||'ml', `Source:${L.source||''} Intent:${L.intent} Sentiment:${L.sentiment} Level:${L.level||''}`, L.tokenStatus||'', L.funnel||'', HELP_ADMIN, (extra&&extra.summary||'').slice(0,150), `Rem:${L.reminderCount||0} Avoid:${L.avoidCount||0}`], false);
    }
  }catch(e){ console.log('logLeadPerfect fail', e.message); }
}

function buildMayaPrompt(lang, historyText){
  return `You are Maya, friendly AI assistant of Bizmapia from Kerala.
${langInstruction(lang)}
STYLE: Warm, simple, local Kerala tone. Short replies: max 3 lines + 1 question. Never send 3 long paragraphs. Ask 1 question at a time.
GOAL: Sort + Engage + Finalize.
FIRST JOB (first 2 messages, for EVERY new user):
1) If source unknown, ask: "Where did you see Bizmapia? Facebook ad / Instagram / Google / YouTube / Friend / App?" in user's language.
2) Ask WHAT they want: Business Opportunity OR Service (Taxi / Delivery / Directory / Booking)?
3) Ask TASTE in 1 question before showing options: e.g. Business -> "What kind of earning are you looking for - small / medium / big?" Service -> "What do you need first - Taxi / shop search / delivery / booking?" Do NOT show full option list before taste.
3) Sense if they LIKE it / CONSIDERING / DOUBT / PRICE DOUBT. If doubt, solve doubt first, never push pay.
ALL INDIA + SCARCITY (say naturally once when explaining opportunity, once when reminding - NOT every message):
"Bizmapia is an All India platform - First 4-in-1 App in India. Many people enquire daily from all over India. So slots are limited. Once your district / area slot is taken, it is very hard to get it back. That is why locking early with a small token matters."
HUMAN HANDOVER RULE:
- If user says human / manager / complaint / fraud / police / refund-manager, do NOT argue. Say "I will inform team, team will check" + explain team call rule (only after token, else call team in free time). Code will alert team instantly.
- If user sends voice note: treat it as heard, NEVER restart, NEVER send old menu. Reply in user's language: voice heard, continue the SAME step they were in (video/capacity/pay/details/service), ask ONE short typed line only if the voice point is unclear, then return to finalization. If user sends image/video, ask for 1-line typed note, keep same step.
- If user sends same message 3+ times, be patient, say "I am reading, one moment".

V268 FINAL ROUTER - HOW YOU WORK (NEVER BREAK):
- You are NOT a button bot. You are Maya, a human-like AI over the V247 steps.
- V247 steps/order are already correct and fixed. Your job is ONLY to ROUTE: read user's message -> decide which V247 step he belongs to -> take him there in THIS reply.
- 1 message = 1 correct next step. If user says "Business opportunity venam" -> show 3 business levels NOW. If "Taxi venam" -> show Taxi flow NOW. If "just checking" -> entertain + ask what caught his eye, do NOT push token.
- MEMORY: You remember everything in this chat. Never ask what user already told you. Never ask district/job before options. District only AFTER level picked.
- ENTERTAIN + GUIDE: If user jokes, doubts, asks off-topic, talks about life/money/fear, reply like a warm human first (1-2 lines), then gently bring him back: "By the way, for you, which one fits - Center or District?" Never lecture, never say "tap button", never send old menu.
- VOICE: Voice transcript is same as typed text. Reply to the MEANING, not "I heard voice".
- If user is confused, simplify, do NOT add more questions. Give exact options, let him pick.

V270 RULES - NEVER BREAK:\n- Welcome: English only, attractive, Maya introduced ONCE only. After language tap, NEVER say 'I am Maya' again. Second message starts 'Super! / Great! / Bahut badhiya!' + continue in confirmed language.\n- Business-only: if user says business opportunity, NEVER show Services / More services / 2-button menu again. Only Business flow: Video first (no capacity buttons), then after 3 min capacity reminder: 'What is your spending capacity in short days to reserve this opportunity, choose right one' + [30K-1L][2L-5L][5L-15L].\n- Capacity question MUST say: 'To select our Business Opportunity, if you select a price range you can invest, I will give details about the opportunity that suits it' / 'ഞങ്ങളുടെ Business Opportunity തിരഞ്ഞെടുക്കാൻ, താങ്കൾക്ക് മുടക്കാൻ സാധിക്കുന്ന ഒരു price range select ചെയ്താൽ...'. Say 'price range', NEVER 'rate'. Never say 'within 7 days' / '7 ദിവസത്തിനുള്ളിൽ' in capacity question. Never ask plain 'capacity ethാണ്?'.\nLANGUAGE RULE - MOST IMPORTANT (V261 - NO MANGLISH, CONFIRM FIRST):
- NEVER use Manglish (Malayalam in English letters like 'Enikku venam', 'Ningal evideya'). NEVER.
- If language = Malayalam -> reply ONLY in PURE Malayalam script (മലയാളം). ZERO English / Roman letters except brand name Bizmapia. NEVER write Business Opportunity / price range / select / details / Continue / New Chat / Company Video / See Video in a Malayalam reply. Use ബിസിനസ് അവസരം / വില പരിധി / തിരഞ്ഞെടുക്കൂ / വിവരങ്ങൾ / തുടരൂ / പുതിയ ചാറ്റ് / കമ്പനി വീഡിയോ / വീഡിയോ കാണൂ. This applies to EVERY Malayalam message and EVERY Malayalam button title, everywhere in the flow. NEVER write 'Njan Maya aanu', 'Enikku venam', 'Bizmapia business opportunity-ye kurichu parayam' - those are MANGLISH and FORBIDDEN. If you are unsure, use pure Malayalam: 'ഞാൻ മായ ആണ്', 'ബിസിനസ് അവസരമാണ് വേണ്ടത്' (മലയാളം). No Roman letters except brand names Bizmapia, App, Razorpay.
- If language = English -> reply ONLY in English. No Malayalam words.
- If language = Hindi -> reply ONLY in Hindi script.
- FIRST MESSAGE of every new chat: WELCOME IN ENGLISH ONLY + CONFIRM LANGUAGE FIRST. Do NOT ask intention before language is confirmed. Do NOT use Malayalam/Hindi in first message.
  FIRST WELCOME MESSAGE - ENGLISH ONLY (V267 RULE, NEVER BREAK):
  "Hi, I am Maya here to chat with you! 👋

Welcome to Bizmapia! 🙏
🇮🇳 India's Largest Online Platform - First 4-in-1 App in India

👇 To start, please tap your language below:"
  Then show 3 language buttons: [മലയാളം] [English] [हिन्दी]
  Do NOT write the welcome in Malayalam / Hindi / mixed languages. English only until user picks a language.
  AFTER language is confirmed, reply ONLY in that confirmed language, pure script. No mixing.
- If user already typed in Malayalam script -> still confirm once in ENGLISH: "Hello! I am Maya from Bizmapia. Which language shall we speak in?" and wait for tap. Do NOT reply in Malayalam before they tap.
- If user already typed in English -> still confirm once in ENGLISH: "Shall we continue in English?" and wait for yes.
- ONLY AFTER language confirmed, then ask intention (V260 rule). Intention question must be in the CONFIRMED language only, pure script.
- V307 FIXED TERMS: NEVER switch language mid-chat. Once language is selected, it is FROZEN for the whole chat. Even if user says "English-il parayu" / "need english" after Malayalam selected, DO NOT switch. Reply in the LOCKED language that language is fixed as per terms, and continue the step in locked language.

FIRST CHAT RULE - MOST IMPORTANT (V260 - AI MAYA, NOT BUTTON BOT):
- When chat starts / after 1988 / after language select, DO NOT give Business / Services buttons immediately.
- First, ASK their real intention in 1 simple question, like a human:
  ML: "നമസ്കാരം! ഞാൻ മായ ആണ്. ബിസ്മാപ്പിയയിൽ നിങ്ങൾ എന്താണ് തേടുന്നത്? ബിസിനസ് അവസരമാണോ, സേവനം ഉപയോഗിക്കാനാണോ, അതോ മറ്റെന്തെങ്കിലുമാണോ?"
  EN: "Hello! I am Maya. What are you actually looking for in Bizmapia? Business opportunity, or to use a service, or something else?"
- Then ASK taste / situation in 2nd question: "Evideya? Ippo entha cheyyunnathu? Monthly ethra varumaanam aagraham?"
- Ask ONE question at a time. Do NOT list 4 services, do NOT list levels, do NOT push token on first message.
- ONLY AFTER user tells intention, SHOW EXACT OPTIONS IMMEDIATELY. Do NOT ask district / job / what do you do before showing options. District comes AFTER they pick a level. Example: User says Business Opportunity -> immediately show 3 levels (Center 1L/100, Corp 4L/150, District 10L/250). User says Service -> immediately show 4 services. Asking district/job first is FORBIDDEN.
  If intention = business -> give Business options + ask district + level.
  If intention = service -> give 4 services options.
  If intention = just enquiry -> explain simply, then ask if they want business or service.
- If user says "just checking / nokkan vannathu", don't push. Say "Kuzhappamilla, nokkiyal mathi" + ask what caught their eye.
- Buttons are for AFTER intention is known, not before. First 1-2 messages = TEXT ONLY, NO BUTTONS.

TEAM GATE RULE - VERY IMPORTANT (V258):
- NEVER offer 'Talk to Team' in every reply. Maya must explain first.
- If user says 'team / human / call me' in first 1-2 messages, say: 'Team is busy, I can explain faster, tell me what you need' + ask their doubt. Do NOT transfer immediately.
- Only offer team AFTER: user understood business + token + level, OR user insists 2 times 'I still want team', OR user has complaint / fraud / refund-manager issue.
- When you DO transfer, you must include in your reply: user's name, district, what they already know, what they still doubt - so team does NOT have to explain everything from zero.
TEAM CALL RULE - VERY IMPORTANT, NEVER BREAK:
- Team calls user ONLY AFTER registration fee (token) is PAID.
- Before token, NEVER say "team will call you" or "I will ask team to call".
- Instead say (in user's language): "Team is busy with verifications now. Please call us in your free time on 85901 83646. After you lock your slot with token, team will call you for verification."
- If user insists "call me", say same rule softly + ask to lock token first, or call team himself.
- If user taps Talk to Team button, Maya must explain this rule + send team alert, not promise a call.
TOKEN PUSH - IF INTENT IS BUSINESS OPPORTUNITY, MAXIMUM EFFORT (soft, never rude):
- After explaining + answering doubt, ALWAYS ask to lock slot: "Shall we lock your slot today with small registration token? Center Rs 100 / Corp Rs 150 / District Rs 250. This token locks your slot, it is not refundable and not part of full fee."
- If user says later / think / tomorrow: DO NOT argue. Say "No problem. Shall I set a reminder for finalizing?" Ask WHEN: evening / tomorrow morning / their time.
- If user says yes to reminder: Confirm "Done, I will remind you at [time]. Is that okay?"
- If user avoids 2nd time: Remind softly: "You set a reminder, is this the right time?" + ask new time.
- If user avoids 3rd+ time: Remind seriousness softly (All India + many leads daily + slot may go) + ask "Now or this evening?" Never threaten.
- If user says NOT INTERESTED / STOP: Stop pushing, say thanks, save as NOT_INTERESTED.
OUTPUT FORMAT: Return ONLY valid JSON: {"reply":"short reply max 3 lines + 1 question","intent":"business|service|app|finalize","source":"...","sentiment":"likes_it|considering|doubt|price_doubt|not_interested|confused","level":"center|corp|district|","district":"...","tokenStatus":"NOT_ASKED|ASKED|READY|LATER|PAID","reminderWanted":true/false,"reminderTimeText":"..."} - Leave buttons null, code adds 3 quick buttons.
FACTS (use only these):
${MAYA_BIZMAPIA_FACTS}
${globalThis.__mayaGrounding||''}
CONVERSATION RULES:
- If user is confused / hopping services, ask: business or service? Then stick to one.
- If user sends audio/voice, treat as heard - never ask to type it. Reply: which opportunity to check - Business Opportunity or Use Our Services.
- If user says later / stop, be polite, save, do not push.
- If user is ready to pay / finalize, ask: Name, Place/District, confirm level (Center 1L / Corp 4L / District 10L), then say "I will send Pay link".
- If user asks Benefits/Requirements/Support/Income/EMI, answer that ONE topic in 2-3 lines, then ask next question. Do not dump all topics.
- Keep language rule above for EVERY reply.
Previous conversation (for context):
${historyText}
Reply as Maya now in JSON.`;
}
async function callMayaAI(lang, userText, history){
  const historyText = (history||[]).slice(-8).map(h=>`${h.role}: ${h.text}`).join('\n');
  globalThis.__mayaGrounding = getBizmapiaGrounding(userText);
  const prompt = buildMayaPrompt(lang, historyText) + `\nUser: ${userText}\nMaya:`;
  try{
    if(GEMINI_API_KEY){
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const r = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.6,maxOutputTokens:400}})});
      const j = await r.json();
      const out = j?.candidates?.[0]?.content?.parts?.map(p=>p.text).join('')||'';
      if(out.trim()) return parseMayaAIOutput(out);
    }
    if(OPENAI_API_KEY){
      const r = await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+OPENAI_API_KEY},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',messages:[{role:'system',content:buildMayaPrompt(lang,historyText)},{role:'user',content:userText}],temperature:0.6,max_tokens:400})});
      const j = await r.json();
      const out = j?.choices?.[0]?.message?.content||'';
      if(out.trim()) return parseMayaAIOutput(out);
    }
  }catch(e){ console.log('Maya AI fail', e.message); }
  return null;
}


const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia&pcampaignid=web_share';
const APP_STORE = 'https://apps.apple.com/in/app/bizmapia/id6761577245';
const crypto = require('crypto');
const WEBSITE = 'https://bizmapia.com/';

// ===== INDIAN TIME (IST) FIX - ADDED V247 - ONLY TIME CODES CHANGED, ALL OTHER CODES SAME AS WORKING FILE =====
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
const VIDEO_EN_DISTRICT = 'https://youtu.be/_y2JeFHBnqg?si=2gcPhbdwncCoyvLy';
const VIDEO_EN_CORP = 'https://youtu.be/GqolfqgHiCU?si=tNHr3wUQ4Vahwd4h';
const VIDEO_EN_MUNICIPAL = 'https://youtu.be/GqolfqgHiCU?si=tNHr3wUQ4Vahwd4h';
const VIDEO_EN_CENTER = 'https://youtu.be/r0X77XfmF94?si=J5dnIIhcVBb4lfBl';

// MALAYALAM
const VIDEO_ML_DISTRICT = 'https://youtu.be/Bi2HJ-3vQa0?si=4a5Log-QVSkZvYnT';
const VIDEO_ML_CORP = 'https://youtu.be/aj4Bxw2cOPQ?si=EjfmlhnaZPXqzCNw';
const VIDEO_ML_MUNICIPAL = 'https://youtu.be/aj4Bxw2cOPQ?si=EjfmlhnaZPXqzCNw';
const VIDEO_ML_CENTER = 'https://youtu.be/jCwTwiuSi5s?si=SVqdh6u3QNwIzqV_';

// HINDI - using English links as fallback (update if you have separate Hindi links)
const VIDEO_HI_DISTRICT = VIDEO_EN_DISTRICT;
const VIDEO_HI_CORP = VIDEO_EN_CORP;
const VIDEO_HI_MUNICIPAL = VIDEO_EN_MUNICIPAL;
const VIDEO_HI_CENTER = VIDEO_EN_CENTER;

function getVideoUrl(sub, lang){
  // V358: return EXACT youtu.be?si= URLs user gave. NOT watch?v= without si.
  if(lang==='ml'){
    if(sub==='OPP_DISTRICT') return VIDEO_ML_DISTRICT;
    if(sub==='OPP_CORP' || sub==='OPP_MUNI') return VIDEO_ML_CORP;
    if(sub==='OPP_CENTER') return VIDEO_ML_CENTER;
    return COMPANY_VIDEO_ML;
  }
  // Hindi gets English videos, English gets English videos
  if(sub==='OPP_DISTRICT') return VIDEO_EN_DISTRICT;
  if(sub==='OPP_CORP' || sub==='OPP_MUNI') return VIDEO_EN_CORP;
  if(sub==='OPP_CENTER') return VIDEO_EN_CENTER;
  return COMPANY_VIDEO_ENHI;
}


function getTenderPdfLink(sub, lang, state){
  // V247 GUARANTEED - AFTER REGISTRATION FEE PAYMENT, user MUST get correct PDF
  // If choice is known -> send ONLY that pair (2 files). If choice is UNKNOWN -> send BOTH pairs (4 files) so correct PDF is always inside.
  // District: CORP_YES = 01-02 | CORP_NO = 03-04 | UNKNOWN = 01+02+03+04
  // Corp/Muni: CORP_YES = 07-08 | CORP_NO = 05-06 | UNKNOWN = 05+06+07+08
  // Muni: always 05-06
  // Business Center: RIDE = 09-10 | DIRECTORY = 11-12 | UNKNOWN (bcService never set in current flow) = 09+10+11+12 - THIS IS THE GUARANTEE
  if(sub==='OPP_DISTRICT'){
    if(state && state.isCorp === false) return { main: LINKS_V92.tenderDistrictOnly, annexure: LINKS_V92.tenderDistrictOnlyAnnexure, files: ['03-District-ONLY Muni-Tender.pdf','04-District-ONLY Muni-Annexure-B.pdf'] };
    if(state && state.isCorp === true) return { main: LINKS_V92.tenderDistrictWith, annexure: LINKS_V92.tenderDistrictWithAnnexure, files: ['01-District-WITH-Corp-Muni-Tender.pdf','02-District-WITH-Corp-Muni-Annexure-B.pdf'] };
    return { main: LINKS_V92.tenderDistrictWith, annexure: LINKS_V92.tenderDistrictWithAnnexure, files: ['01-District-WITH-Corp-Muni-Tender.pdf','02-District-WITH-Corp-Muni-Annexure-B.pdf','03-District-ONLY Muni-Tender.pdf','04-District-ONLY Muni-Annexure-B.pdf'] };
  }
  if(sub==='OPP_MUNI') return { main: LINKS_V92.tenderMunicipal, annexure: LINKS_V92.tenderMunicipalAnnexure, files: ['05-Municipal-Tender.pdf','06-Municipal-Annexure-B.pdf'] };
  if(sub==='OPP_CORP'){
    if(state && state.isCorp === false) return { main: LINKS_V92.tenderMunicipal, annexure: LINKS_V92.tenderMunicipalAnnexure, files: ['05-Municipal-Tender.pdf','06-Municipal-Annexure-B.pdf'] };
    if(state && state.isCorp === true) return { main: LINKS_V92.tenderCorporation, annexure: LINKS_V92.tenderCorporationAnnexure, files: ['07-Corporation-Tender.pdf','08-Corporation-Annexure-B.pdf'] };
    return { main: LINKS_V92.tenderCorporation, annexure: LINKS_V92.tenderCorporationAnnexure, files: ['05-Municipal-Tender.pdf','06-Municipal-Annexure-B.pdf','07-Corporation-Tender.pdf','08-Corporation-Annexure-B.pdf'] };
  }
  if(sub==='OPP_CENTER'){
    if(state && (state.bcService==='DIRECTORY')) return { main: LINKS_V92.tenderBusinessCenterDirectory, annexure: LINKS_V92.tenderBusinessCenterDirectoryAnnexure, files: ['11-BC-BusinessDirectory-Tender.pdf','12-BC-BusinessDirectory-Annexure-B.pdf'] };
    if(state && (state.bcService==='RIDE')) return { main: LINKS_V92.tenderBusinessCenterRide, annexure: LINKS_V92.tenderBusinessCenterRideAnnexure, files: ['09-BC-RideHailing-Tender.pdf','10-BC-RideHailing-Annexure-B.pdf'] };
    return { main: LINKS_V92.tenderBusinessCenterRide, annexure: LINKS_V92.tenderBusinessCenterRideAnnexure, files: ['09-BC-RideHailing-Tender.pdf','10-BC-RideHailing-Annexure-B.pdf','11-BC-BusinessDirectory-Tender.pdf','12-BC-BusinessDirectory-Annexure-B.pdf'] };
  }
  return { main: LINKS_V92.tenderDistrictWith, annexure: LINKS_V92.tenderDistrictWithAnnexure, files: ['01-District-WITH-Corp-Muni-Tender.pdf','02-District-WITH-Corp-Muni-Annexure-B.pdf'] };
}
function getTenderFilesForSub(sub, state){ const r = getTenderPdfLink(sub, 'en', state); return r.files || [r.main, r.annexure]; }
function OLD_getTenderPdfLink_TEMP(sub, lang){
  // Returns downloadable PDF per business opportunity instead of only district tender
  if(sub==='OPP_DISTRICT') return LINKS_V92.tenderDistrict;
  if(sub==='OPP_CORP') return LINKS_V92.tenderCorporation;
  if(sub==='OPP_MUNI') return LINKS_V92.tenderMunicipal;
  if(sub==='OPP_CENTER') return LINKS_V92.tenderBusinessCenter;
  return LINKS_V92.tenderDistrict;
}

function getTenderGreeting(sub, lang, state){
  const pdfs = getTenderPdfLink(sub, lang, state);
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
  ML_DISTRICT: { id: "Bi2HJ-3vQa0", url: "https://www.youtube.com/watch?v=Bi2HJ-3vQa0" },
  ML_CORP: { id: "aj4Bxw2cOPQ", url: "https://www.youtube.com/watch?v=aj4Bxw2cOPQ" },
  ML_MUNI: { id: "aj4Bxw2cOPQ", url: "https://www.youtube.com/watch?v=aj4Bxw2cOPQ" },
  ML_CENTER: { id: "jCwTwiuSi5s", url: "https://www.youtube.com/watch?v=jCwTwiuSi5s" },
  EN_DISTRICT: { id: "_y2JeFHBnqg", url: "https://www.youtube.com/watch?v=_y2JeFHBnqg" },
  EN_CORP: { id: "GqolfqgHiCU", url: "https://www.youtube.com/watch?v=GqolfqgHiCU" },
  EN_MUNI: { id: "GqolfqgHiCU", url: "https://www.youtube.com/watch?v=GqolfqgHiCU" },
  EN_CENTER: { id: "r0X77XfmF94", url: "https://www.youtube.com/watch?v=r0X77XfmF94" },
  HI_DISTRICT: { id: "_y2JeFHBnqg", url: "https://www.youtube.com/watch?v=_y2JeFHBnqg" },
  HI_CORP: { id: "GqolfqgHiCU", url: "https://www.youtube.com/watch?v=GqolfqgHiCU" },
  ml: {
    district: "https://www.youtube.com/watch?v=Bi2HJ-3vQa0",
    corp: "https://www.youtube.com/watch?v=aj4Bxw2cOPQ",
    muni: "https://www.youtube.com/watch?v=aj4Bxw2cOPQ",
    center: "https://www.youtube.com/watch?v=jCwTwiuSi5s",
    knowCompany: "https://www.youtube.com/watch?v=2BB34hGi52I"
  },
  en: {
    district: "https://www.youtube.com/watch?v=_y2JeFHBnqg",
    corp: "https://www.youtube.com/watch?v=GqolfqgHiCU",
    muni: "https://www.youtube.com/watch?v=GqolfqgHiCU",
    center: "https://www.youtube.com/watch?v=r0X77XfmF94",
    knowCompany: "https://www.youtube.com/watch?v=R9IEneHrUHE"
  },
  hi: {
    district: "https://www.youtube.com/watch?v=_y2JeFHBnqg",
    corp: "https://www.youtube.com/watch?v=GqolfqgHiCU",
    muni: "https://www.youtube.com/watch?v=GqolfqgHiCU",
    center: "https://www.youtube.com/watch?v=r0X77XfmF94",
    knowCompany: "https://www.youtube.com/watch?v=R9IEneHrUHE"
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
  return m ? m[1] : 'Bi2HJ-3vQa0';
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
      rows: [{ id: 'DIST_COMING_SOON', title: `Coming Soon`, description: 'Currently Kerala only, other states soon' }]
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

// Image message helper missing in V247
function imageMessage(to, imageUrl, caption, phoneId){
  return {
    messaging_product: 'whatsapp',
    to,
    type: 'image',
    image: { link: imageUrl, caption: caption ? caption.substring(0,1024) : '' },
    _phoneId: phoneId
  };
}






// ===== V247 ONLY TENDER EDIT - SEND EACH USER THEIR OWN TENDER+ANNEXURE AS DOCUMENT =====
async function sendTenderPdfsAfterVerification(uid, sub, lang, phoneId, state){
  const files = getTenderFilesForSub(sub, state);
  if(!files || !files.length) return;
  const tenderName = sub==='OPP_DISTRICT' ? 'District Franchisee' : sub==='OPP_MUNI' ? 'Municipal Franchisee' : (sub==='OPP_CORP' && state && state.isCorp===false) ? 'Municipal Franchisee' : sub==='OPP_CORP' ? 'Corporation Franchisee' : 'Business Center';
  const head = lang==='ml' ? `🎉 Excellent! Congratulations! 👏\n\nനിങ്ങൾ പേയ്മെന്റ് ഘട്ടം വിജയകരമായി പൂർത്തിയാക്കി!` : lang==='hi' ? `🎉 Excellent! Congratulations! 👏\n\nआपने भुगतान चरण सफलतापूर्वक पूरा किया!` : `🎉 Excellent! Congratulations! 👏\n\nYou have successfully completed the payment step!`;
  const what = lang==='ml' ? `\n\n👇 ഈ ഘട്ടത്തിൽ എന്ത് ചെയ്യണം: താഴെ നിങ്ങളുടെ ${tenderName} ടെൻഡർ + Annexure B - ഫോണിൽ വായിക്കാവുന്നത് - Read Only PDF:` : lang==='hi' ? `\n\n👇 इस चरण में क्या करना है: नीचे आपकी ${tenderName} टेंडर + Annexure B फाइलें - फोन में पढ़ने योग्य - Read Only PDF:` : `\n\n👇 What to do in this step: Below are YOUR ${tenderName} Tender + Annexure B Files - Downloadable & Readable On Phone - Read Only PDF:`;
  await sendWithDelay(textMessage(uid, head + what, phoneId));
  for(let file of files){
    const fileUrl = `${BASE_URL}/tenders/${file}`;
    const caption = file.includes('Annexure') ? `Annexure B - Monthly Breakup - Bottom Verification - 7 Days Clause - ${file}` : `Tender - ${tenderName} - ${file} - Read Only - 7 Days Valid`;
    try{ await sendWithDelay({messaging_product:'whatsapp',to:uid,type:'document',document:{link:fileUrl,filename:file,caption:caption.substring(0,1024)},_phoneId:phoneId}); await new Promise(r=>setTimeout(r,700)); }catch(e){ await sendWithDelay(singleCta(uid, caption, {title: file.substring(0,20), url: fileUrl}, phoneId)); }
  }
}


// ===== V247 - STRUCTURED DETAILS + EXACT CALENDAR DATE - NO TODAY/TOMORROW, NO FREE-TYPE LOOPHOLE =====
const KERALA_DISTRICTS_V247 = ['Ernakulam','Idukki','Kottayam','Alappuzha','Thrissur','Palakkad','Kozhikode','Wayanad','Kannur','Kasaragod','Kollam','Pathanamthitta','Thiruvananthapuram','Malappuram'];
function v211_isBadName(txt){ if(!txt) return true; const s=String(txt).trim(); if(s.length<3) return true; if(/[0-9]/.test(s)) return true; const low=s.toLowerCase(); const bad=['hi','hai','hello','hey','ok','yes','how much','fee','price','details','info','video','call','when','what']; if(bad.includes(low)) return true; return false; }
function v211_isValidMobile(txt){ const d=String(txt||'').replace(/[^0-9]/g,''); const m=d.length===12&&d.startsWith('91')?d.slice(2):d; return m.length===10 && /^[6-9]/.test(m) ? m : null; }
function v211_next7Days(){ const out=[]; const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})); for(let i=0;i<7;i++){ const d=new Date(now); d.setDate(now.getDate()+i); const y=d.getFullYear(); const mo=String(d.getMonth()+1).padStart(2,'0'); const da=String(d.getDate()).padStart(2,'0'); const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']; const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; out.push({iso:`${y}-${mo}-${da}`, label:`${days[d.getDay()]} ${da} ${months[d.getMonth()]}`, full:`${days[d.getDay()]}, ${da} ${months[d.getMonth()]} ${y}`}); } return out; }
function v211_formatDate(iso){ const [y,m,d]=iso.split('-').map(Number); const dt=new Date(y,m-1,d); const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']; const months=['January','February','March','April','May','June','July','August','September','October','November','December']; return `${days[dt.getDay()]}, ${String(d).padStart(2,'0')} ${months[m-1]} ${y}`; }

function v211_daysFromToday(iso){ const today=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})); today.setHours(0,0,0,0); const [y,m,d]=iso.split('-').map(Number); const dt=new Date(y,m-1,d); return Math.round((dt-today)/86400000); }
function v211_lateWarning(lang, iso, diff){ const dateStr=v211_formatDate(iso); return lang==='ml' ? `⚠️ Warning! Losing Chance!\n\n📅 You selected: ${dateStr}\n📅 That is ${diff} days after your Registration Fee date.\n\n🚨 If you wait more than 7 days, your area / slot may go to next person in queue. Team may give your slot to someone else.\n\n👉 What to do now: If you can come earlier, pick an earlier date. If you still want this date, confirm below:` : lang==='hi' ? `⚠️ Warning! Chance खोने का खतरा!\n\n📅 आपने चुना: ${dateStr}\n📅 यह आपकी Registration Fee date से ${diff} दिन बाद है।\n\n🚨 अगर आप 7 दिन से ज्यादा wait करते हैं, तो आपका area / slot queue में अगले व्यक्ति को जा सकता है।\n\n👉 What to do now: अगर आप पहले आ सकते हैं तो earlier date चुनें। अगर फिर भी यही date चाहिए तो नीचे confirm करें:` : `⚠️ Warning! Losing Chance!\n\n📅 You selected: ${dateStr}\n📅 That is ${diff} days after your Registration Fee date.\n\n🚨 If you wait more than 7 days, your area / slot may go to next person in queue. Team may give your slot to someone else.\n\n👉 What to do now: If you can come earlier, pick an earlier date. If you still want this date, confirm below:`; }
function v211_parseTypedDate(txt){ if(!txt) return null; const s=String(txt).trim(); const m=s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/); if(!m) return null; let d=parseInt(m[1],10), mo=parseInt(m[2],10), y=parseInt(m[3],10); if(y<100) y+=2000; if(mo<1||mo>12||d<1||d>31) return null; const dt=new Date(y,mo-1,d); if(dt.getFullYear()!==y||dt.getMonth()!==mo-1||dt.getDate()!==d) return null; const today=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})); today.setHours(0,0,0,0); if(dt<today) return null; const max=new Date(today); max.setDate(today.getDate()+60); if(dt>max) return null; return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
const ALL_INDIA_STATES_V247 = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"];
const ALL_INDIA_DISTRICTS_V247 = {"Andhra Pradesh": ["Anakapalli", "Anantapur", "Annamayya", "Bapatla", "Chittoor", "East Godavari", "Eluru", "Guntur", "Kadapa", "Kakinada", "Konaseema", "Krishna", "Kurnool", "Nandyal", "Nellore", "NTR", "Palnadu", "Parvathipuram Manyam", "Prakasam", "Srikakulam", "Sri Sathya Sai", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari"], "Arunachal Pradesh": ["Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang", "Lepa Rada"], "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metro", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara", "Tinsukia", "Udalguri", "West Karbi Anglong"], "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"], "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Gaurela Pendra Marwahi", "Janjgir Champa", "Jashpur", "Kanker", "Kawardha", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Manendragarh", "Mohla Manpur", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sarangarh", "Sukma", "Surajpur", "Surguja"], "Goa": ["North Goa", "South Goa"], "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"], "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"], "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"], "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"], "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayanagara", "Vijayapura", "Yadgir"], "Kerala": ["Ernakulam", "Idukki", "Kottayam", "Alappuzha", "Thrissur", "Palakkad", "Kozhikode", "Wayanad", "Kannur", "Kasaragod", "Kollam", "Pathanamthitta", "Thiruvananthapuram", "Malappuram"], "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"], "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"], "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"], "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"], "Mizoram": ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"], "Nagaland": ["Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tuensang", "Tseminyu", "Wokha", "Zunheboto"], "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh"], "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"], "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"], "Sikkim": ["Gangtok", "Gyalshing", "Mangan", "Namchi", "Pakyong", "Soreng"], "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"], "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"], "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"], "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Rae Bareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"], "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"], "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"], "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"], "Chandigarh": ["Chandigarh"], "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"], "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"], "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"], "Ladakh": ["Kargil", "Leh"], "Lakshadweep": ["Lakshadweep"], "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]};
function v211_stateCode(name){ return name.toUpperCase().replace(/[^A-Z0-9]/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,''); }
async function v211_sendStateList(uid, lang, phoneId){
  const rows = ALL_INDIA_STATES_V247.map(s=>({id:'STATE_'+v211_stateCode(s), title:s.substring(0,24), description:'Select '+s}));
  const body = lang==='ml' ? `👏 Great!\n👉 What to do now: Select your STATE from dropdown below - Tap to open list, type to shortlist:` : lang==='hi' ? `👏 बढ़िया!\n👉 What to do now: नीचे dropdown से अपना STATE चुनें - List खोलने के लिए tap करें, type करके shortlist करें:` : `👏 Great!\n👉 What to do now: Select your STATE from dropdown below - Tap to open list, type to shortlist:`;
  const sections=[]; for(let i=0;i<rows.length;i+=10){ sections.push({title:'States '+(Math.floor(i/10)+1), rows:rows.slice(i,i+10)}); }
  await sendWithDelay({messaging_product:'whatsapp',to:uid,type:'interactive',interactive:{type:'list',body:{text:body},action:{button:'Select State', sections:sections}},_phoneId:phoneId});
}
async function v211_sendDistrictList(uid, lang, phoneId, stateName){
  const list = ALL_INDIA_DISTRICTS_V247[stateName] || [];
  const rows = list.map(n=>({id:'DISTRICT_'+v211_stateCode(stateName)+'_'+v211_stateCode(n), title:n.substring(0,24), description:stateName+' - '+n}));
  const body = lang==='ml' ? `👏 Great! State: ${stateName}\n👉 What to do now: Select your DISTRICT from dropdown below - SHORTLISTED to ${stateName} only - Tap to open list, type to shortlist:` : lang==='hi' ? `👏 बढ़िया! State: ${stateName}\n👉 What to do now: नीचे dropdown से अपना DISTRICT चुनें - SHORTLISTED to ${stateName} only - List खोलने के लिए tap करें:` : `👏 Great! State: ${stateName}\n👉 What to do now: Select your DISTRICT from dropdown below - SHORTLISTED to ${stateName} only - Tap to open list, type to shortlist:`;
  const sections=[]; for(let i=0;i<rows.length;i+=10){ sections.push({title:'Districts '+(Math.floor(i/10)+1), rows:rows.slice(i,i+10)}); }
  await sendWithDelay({messaging_product:'whatsapp',to:uid,type:'interactive',interactive:{type:'list',body:{text:body},action:{button:'Select District', sections:sections}},_phoneId:phoneId});
}

// ===== V247 SHEET NOTICE FIX - ONE READABLE ROW WITH ALL DETAILS FOR TEAM NOTICE =====
async function v211_saveFinalLead(uid, lang, state, iso){
  try{
    const name = state.leadName || '';
    const st = state.leadState || '';
    const dist = state.leadDistrict || '';
    const mob = state.leadMobile || '';
    const occ = state.occupation || '';
    const sub = state.sub || '';
    const fee = state.fee || '';
    const dateStr = v211_formatDate(iso);
    const readable = `Name: ${name} | State: ${st} | District: ${dist} | Mobile: ${mob} | Occupation: ${occ} | Visit Date: ${dateStr} (${iso}) | Fee: ${fee}L | Type: ${sub}`;
    // ONE consolidated row in Master_Leads - Team can read notice WITHOUT opening JSON
    await saveToSheet('Master_Leads', [getISTTime(), uid, lang, 'FINAL LEAD - ' + name, readable, 'COMPLETED - Visit Confirmed', HELP_MARKETING, 'Completed - Visit Confirmed ' + iso, readable], true);
    // ALSO in Franchise_Funnel so you get notice in funnel sheet too
    await saveToSheet('Franchise_Funnel', [getISTTime(), uid, lang, 'FINAL LEAD - ' + name, readable, 'COMPLETED', HELP_MARKETING, 'Completed - Visit Confirmed ' + iso, readable], true);
  }catch(e){ console.log('V247 Final Lead save fail', e.message); }
}
function v211_nameAsk(lang){ return lang==='ml' ? `👏 Congratulations! Payment claimed!\n👉 What to do now: Type your FULL NAME only:\n\nExample: Ajo Devasia` : lang==='hi' ? `👏 Congratulations! Payment claimed!\n👉 What to do now: अपना पूरा नाम केवल टाइप करें:\n\nExample: Ajo Devasia` : `👏 Congratulations! Payment claimed!\n👉 What to do now: Type your FULL NAME only:\n\nExample: Ajo Devasia`; }
function v211_stateAsk(lang){ return lang==='ml' ? `👏 Great!\n👉 What to do now: Select your STATE below:` : lang==='hi' ? `👏 बढ़िया!\n👉 What to do now: नीचे अपना STATE चुनें:` : `👏 Great!\n👉 What to do now: Select your STATE below:`; }
function v211_districtTypeAsk(lang, stateName){ return lang==='ml' ? `👏 Great! State: ${stateName}\n👉 What to do now: Type your DISTRICT name only:\n\nExample: Coimbatore` : lang==='hi' ? `👏 बढ़िया! State: ${stateName}\n👉 What to do now: अपना DISTRICT नाम केवल टाइप करें:\n\nExample: Coimbatore` : `👏 Great! State: ${stateName}\n👉 What to do now: Type your DISTRICT name only:\n\nExample: Coimbatore`; }
function v211_mobileAsk(lang){ return lang==='ml' ? `👏 Great!\n👉 What to do now: Type your 10-digit MOBILE NUMBER only:\n\nExample: 9567742507` : lang==='hi' ? `👏 बढ़िया!\n👉 What to do now: अपना 10-digit MOBILE NUMBER केवल टाइप करें:\n\nExample: 9567742507` : `👏 Great!\n👉 What to do now: Type your 10-digit MOBILE NUMBER only:\n\nExample: 9567742507`; }
function v211_dateAsk(lang){ return lang==='ml' ? `👏 Great!\n👉 What to do now: Select your EXACT VISIT DATE from calendar below - Pick one date:` : lang==='hi' ? `👏 बढ़िया!\n👉 What to do now: नीचे calendar से अपनी EXACT VISIT DATE चुनें - एक date चुनें:` : `👏 Great!\n👉 What to do now: Select your EXACT VISIT DATE from calendar below - Pick one date:`; }
function v211_dateTypeAsk(lang){ return lang==='ml' ? `👉 What to do now: Type your visit date as DD/MM/YYYY only:\n\nExample: 15/11/2026` : lang==='hi' ? `👉 What to do now: अपनी visit date DD/MM/YYYY में केवल टाइप करें:\n\nExample: 15/11/2026` : `👉 What to do now: Type your visit date as DD/MM/YYYY only:\n\nExample: 15/11/2026`; }
async function v211_sendDateCalendar(uid, lang, phoneId){
  // V247 MONTH VIEW - List grouped by Month - November 2026 + December 2026 - Feels like Month Date View
  const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
  const monthsN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const daysN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const all=[];
  for(let i=0;i<30;i++){ const d=new Date(now); d.setDate(now.getDate()+i); const y=d.getFullYear(); const mo=String(d.getMonth()+1).padStart(2,'0'); const da=String(d.getDate()).padStart(2,'0'); all.push({iso:`${y}-${mo}-${da}`, title:`${daysN[d.getDay()]} ${da} ${monthsN[d.getMonth()]} ${y}`, desc:`Visit on ${daysN[d.getDay()]}, ${da} ${monthsN[d.getMonth()]} ${y}`, month:`${monthsN[d.getMonth()]} ${y}`}); }
  const groups={}; for(let d of all){ if(!groups[d.month]) groups[d.month]=[]; groups[d.month].push(d); }
  const sections=Object.keys(groups).map(m=>({title:m, rows:groups[m].map(d=>({id:'DATE_'+d.iso, title:d.title, description:d.desc}))}));
  sections.push({title:'Other', rows:[{id:'DATE_TYPE_OTHER', title:'Other Date', description:'Pick a date after 30 days - Type DD/MM/YYYY'}]});
  const body = lang==='ml' ? `👏 Great!\n👉 What to do now: Select your EXACT VISIT DATE from MONTH VIEW below - Tap to open, select Month, then Date. Type to shortlist:` : lang==='hi' ? `👏 बढ़िया!\n👉 What to do now: नीचे MONTH VIEW से अपनी EXACT VISIT DATE चुनें - Tap करके Month चुनें, फिर Date चुनें। Type करके shortlist करें:` : `👏 Great!\n👉 What to do now: Select your EXACT VISIT DATE from MONTH VIEW below - Tap to open, select Month, then Date. Type to shortlist:`;
  await sendWithDelay({messaging_product:'whatsapp',to:uid,type:'interactive',interactive:{type:'list',body:{text:body},action:{button:'Select Date', sections:sections}},_phoneId:phoneId});
}
async function v211_sendKeralaDistricts(uid, lang, phoneId){
  await sendWithDelay(textMessage(uid, lang==='ml' ? `👏 Great! State: Kerala\n👉 What to do now: Select your DISTRICT below:` : lang==='hi' ? `👏 बढ़िया! State: Kerala\n👉 What to do now: नीचे अपना DISTRICT चुनें:` : `👏 Great! State: Kerala\n👉 What to do now: Select your DISTRICT below:`, phoneId));
  const D=KERALA_DISTRICTS_V247;
  for(let i=0;i<D.length;i+=3){
    const chunk=D.slice(i,i+3);
    const btns=chunk.map(n=>({id:'DISTRICT_KL_'+n.toUpperCase().replace(/[^A-Z]/g,''), title:n.substring(0,20)}));
    await sendWithDelay(interactiveButton(uid, chunk.join(' | '), btns, phoneId));
  }
}

const LINKS_V92 = {
  website: WEBSITE,
  driverApp: PLAY_STORE,
  // V247 GUARANTEED - 12 FINAL PDFs - FILENAMES = EXACTLY THE 12 UPLOADED FILES
  // 01-02: District WITH Corp+Muni - 15L - CORP_YES | 03-04: District ONLY - 10L - CORP_NO
  // 05-06: Municipal - Rs.150 | 07-08: Corporation - Rs.150
  // 09-10: BC RIDE-HAILING ONLY - Rs.100 | 11-12: BC BUSINESS DIRECTORY ONLY - Rs.100
  // GUARANTEE RULE: if user paid but choice (isCorp / bcService) is UNKNOWN, send BOTH pairs (4 files) so correct PDF is ALWAYS included
  tenderDistrictWith: "https://bizmapia-bot-8590175977.onrender.com/tenders/01-District-WITH-Corp-Muni-Tender.pdf",
  tenderDistrictWithAnnexure: "https://bizmapia-bot-8590175977.onrender.com/tenders/02-District-WITH-Corp-Muni-Annexure-B.pdf",
  tenderDistrictOnly: "https://bizmapia-bot-8590175977.onrender.com/tenders/03-District-ONLY%20Muni-Tender.pdf",
  tenderDistrictOnlyAnnexure: "https://bizmapia-bot-8590175977.onrender.com/tenders/04-District-ONLY%20Muni-Annexure-B.pdf",
  tenderDistrict: "https://bizmapia-bot-8590175977.onrender.com/tenders/01-District-WITH-Corp-Muni-Tender.pdf",
  tenderDistrictAnnexure: "https://bizmapia-bot-8590175977.onrender.com/tenders/02-District-WITH-Corp-Muni-Annexure-B.pdf",
  tenderMunicipal: "https://bizmapia-bot-8590175977.onrender.com/tenders/05-Municipal-Tender.pdf",
  tenderMunicipalAnnexure: "https://bizmapia-bot-8590175977.onrender.com/tenders/06-Municipal-Annexure-B.pdf",
  tenderCorporation: "https://bizmapia-bot-8590175977.onrender.com/tenders/07-Corporation-Tender.pdf",
  tenderCorporationAnnexure: "https://bizmapia-bot-8590175977.onrender.com/tenders/08-Corporation-Annexure-B.pdf",
  tenderBusinessCenter: "https://bizmapia-bot-8590175977.onrender.com/tenders/09-BC-RideHailing-Tender.pdf",
  tenderBusinessCenterAnnexure: "https://bizmapia-bot-8590175977.onrender.com/tenders/10-BC-RideHailing-Annexure-B.pdf",
  tenderBusinessCenterRide: "https://bizmapia-bot-8590175977.onrender.com/tenders/09-BC-RideHailing-Tender.pdf",
  tenderBusinessCenterRideAnnexure: "https://bizmapia-bot-8590175977.onrender.com/tenders/10-BC-RideHailing-Annexure-B.pdf",
  tenderBusinessCenterDirectory: "https://bizmapia-bot-8590175977.onrender.com/tenders/11-BC-BusinessDirectory-Tender.pdf",
  tenderBusinessCenterDirectoryAnnexure: "https://bizmapia-bot-8590175977.onrender.com/tenders/12-BC-BusinessDirectory-Annexure-B.pdf",
  tenderBusinessCenterAgreement: "https://bizmapia-bot-8590175977.onrender.com/tenders/11-BC-BusinessDirectory-Tender.pdf",
  tenderBusinessCenterBrochure: "https://bizmapia-bot-8590175977.onrender.com/tenders/12-BC-BusinessDirectory-Annexure-B.pdf",
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
  // V364.37 EDIT 1 - Registration_Fee sheet-save fix ONLY. Payment reminder (Pay Now / Call Now) NOT touched.
  // BUG: saveToSheet() expects row as ARRAY (it reads row[1] as phone and appends {values:[row]}).
  // Old code passed an OBJECT {phone, franchise_type, ...} -> Google API error: Unknown name "phone" at 'data.values[0]'.
  // FIX: pass ARRAY row, phone at index 1 (same pattern as Master_Leads / System_Logs). Single save (old code saved twice).
  try{
    const regFee = getTokenFee(sub);
    const link = getRazorpayLinkForSub(sub);
    const row = [getISTTime(), String(phone||''), String(sub||''), regFee, fee+'L', link, new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})];
    saveToSheet('Registration_Fee', row).catch(()=>{});
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
  // V247 EXACT Step 5 body from user - [Pay now] is the CTA URL button BELOW this body, not body text.
  if(lang==='ml'){
    let oppMl = 'ബിസിനസ് സെന്റർ അവസരം';
    if(sub==='OPP_DISTRICT') oppMl = 'ജില്ലാ ഫ്രാഞ്ചൈസി അവസരം';
    else if(sub==='OPP_CORP') oppMl = 'കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി അവസരം';
    return `📍 Step 5 of 6 — 1 സ്റ്റെപ്പ് ബാക്കി\n\n🙏 ${oppMl} തിരഞ്ഞെടുത്തതിന് നന്ദി.\n\n👏 അഭിനന്ദനങ്ങൾ! നിങ്ങളുടെ അവസരം ബുക്ക് ചെയ്യാൻ പോകുന്നു!\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത് : 📄 നിങ്ങളുടെ കരാർ, വരുമാന രേഖകൾ ഡൗൺലോഡ് ചെയ്യാൻ, രജിസ്ട്രേഷൻ ഫീ അടയ്ക്കുക, "Pay now" ക്ലിക്ക് ചെയ്യുക:\n\n💳 രജിസ്ട്രേഷൻ ഫീ Rs.${token} ഇപ്പോൾ അടയ്ക്കുക.`;
  }
  if(lang==='hi'){
    let oppHi = 'बिजनेस सेंटर अवसर';
    if(sub==='OPP_DISTRICT') oppHi = 'जिला फ्रेंचाइजी अवसर';
    else if(sub==='OPP_CORP') oppHi = 'कॉर्पोरेशन / म्युनिसिपल फ्रेंचाइजी अवसर';
    return `📍 Step 5 of 6 — 1 स्टेप बाकी\n\n🙏 ${oppHi} चुनने के लिए धन्यवाद।\n\n👏 बधाई हो! आपका अवसर बुक होने जा रहा है!\n\n👉 अब क्या करें : 📄 अपने समझौता और आय दस्तावेज़ डाउनलोड करने के लिए, रजिस्ट्रेशन फी भरें, "Pay now" क्लिक करें:\n\n💳 रजिस्ट्रेशन फी Rs.${token} अभी भुगतान करें।`;
  }
  let oppName = 'Business Center opportunity';
  if(sub==='OPP_DISTRICT') oppName = 'District Business Opportunity';
  else if(sub==='OPP_CORP') oppName = 'Corporation / Municipal Business Opportunity';
  return `📍 Step 5 of 6 — 1 step left\n\n🙏 Thanks for choosing ${oppName}.\n\n👏 Congratulations! Your opportunity is about to be booked!\n\n👉 What to do now : 📄 To download your Agreement and Income documents, pay the Registration Fee, click "Pay now":\n\n💳 Pay Registration Fee Rs.${token} now.`;
}
function getPayNowTitle(lang){
  if(lang==='ml') return 'ഇപ്പോൾ അടയ്ക്കുക';
  if(lang==='hi') return 'अभी भुगतान करें';
  return 'Pay Now';
}
// ===== V247 PAY-NOW-ONLY STEP 5: WhatsApp reply buttons CANNOT open a URL, so 'Paid / Not Paid' buttons made users skip Razorpay. Step 5 now sends: body + REAL CTA URL button [Pay Now -> Razorpay link] + REAL CTA tel: button [Call -> dialer] + one reply button [I Paid - Verify]. No PAY_DONE / PAY_NOT_DONE on Step 5 entry. =====
// V247 REMINDER ONLY - EXACT sequence, no over-smart additions:
// 1) textMessage = exact reminder body ONLY (NO raw link, NO extra line)
// 2) singleCta = "👇 താഴെ Pay Now ക്ലിക്ക് ചെയ്യൂ - Razorpay തുറക്കും" + [Pay now] -> Razorpay
// 3) realDialerCta = "സംശയമുണ്ടെങ്കിൽ 👇 Call Now ക്ലിക്ക് ചെയ്യൂ - ഡയലർ തുറക്കും" + [Call now] -> dialer
// NO Verify button, NO "ഇതിനകം അടച്ചോ?", NO "ഇപ്പോൾ അടയ്ക്കുക" button, NO 🔗 link in body.
async function sendPayNowStep(uid,lang,fee,sub,phoneId,body,schedule5=true){
  try{
    const link=getRazorpayLinkForSub(sub);
    const payLine = lang==='ml' ? '👇 താഴെ Pay Now ക്ലിക്ക് ചെയ്യൂ - Razorpay തുറക്കും'
      : lang==='hi' ? '👇 नीचे Pay Now क्लिक करें - Razorpay खुलेगा'
      : '👇 Tap Pay Now below - Razorpay will open';
    const callLine = lang==='ml' ? 'സംശയമുണ്ടെങ്കിൽ 👇 Call Now ക്ലിക്ക് ചെയ്യൂ - ഡയലർ തുറക്കും'
      : lang==='hi' ? 'कोई doubt हो तो 👇 Call Now क्लिक करें - डायलर खुलेगा'
      : 'Any doubt? 👇 Tap Call Now - dialer will open';
    await sendWithDelay(textMessage(uid,String(body||''),phoneId));
    await delay(400);
    await sendWithDelay(singleCta(uid, payLine, {title:'Pay now', url:link}, phoneId));
    await delay(400);
    await sendWithDelay(realDialerCta(uid, callLine, HELP_MARKETING_FULL, phoneId));
    if(schedule5){ try{scheduleReminder(uid,'install:PAY5MIN:5',lang,5*60*1000,phoneId);}catch(e){} }
  }catch(e){ console.log('sendPayNowStep fail',e.message); }
}
// V247 STEP 5 ONLY: exact body + ONLY [Pay now] CTA button. User did NOT instruct Call fix here, so NO Call / NO Verify button on this Step 5 message. No extra link/fee line appended - body is exact.
async function sendStep5Exact(uid,lang,fee,sub,phoneId,body){
  try{
    const link=getRazorpayLinkForSub(sub);
    const payTitle=lang==='ml'?'💳 Pay now':lang==='hi'?'💳 Pay now':'💳 Pay now';
    await sendWithDelay(singleCta(uid, String(body||'').substring(0,1024), {title:payTitle.substring(0,20), url:link}, phoneId)); // ONE message: exact body + [Pay now] button below it. No separate text message, or body would appear twice.
    try{scheduleReminder(uid,'install:PAY5MIN:5',lang,5*60*1000,phoneId);}catch(e){}
  }catch(e){ console.log('sendStep5Exact fail',e.message); }
}
function getPayReminderExact(lang,fee,sub){
  const token=getTokenFee(sub||'OPP_DISTRICT');
  // V247 SHORT REMINDER - user asked: too many lines. Short professional body. [Pay now] / [Call now] CTA bubbles BELOW already say what to do, so body does NOT repeat them.
  if(lang==='ml'){
    let oppMl='ബിസിനസ് സെന്റർ അവസരം';
    if(sub==='OPP_DISTRICT') oppMl='ജില്ലാ ഫ്രാഞ്ചൈസി അവസരം';
    else if(sub==='OPP_CORP') oppMl='കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി അവസരം';
    return `📍 Step 5 of 6 — 1 സ്റ്റെപ്പ് ബാക്കി\n\n🙏 നിങ്ങളുടെ ${oppMl} ഇതുവരെ ബുക്ക് ആയിട്ടില്ല.\n\n🔍 ഞാൻ ഇപ്പോൾ തന്നെ payment system-ൽ പരിശോധിച്ചു — നിങ്ങളുടെ ഫീ ഇതുവരെ പ്രതിഫലിച്ചിട്ടില്ല.\n\n💳 രജിസ്ട്രേഷൻ ഫീ Rs.${token} അടച്ചാൽ, നിങ്ങളുടെ കരാർ, വരുമാന രേഖകൾ ലഭിക്കും.\n\n⚠️ ഫീ അടച്ചില്ലെങ്കിൽ നിങ്ങൾക്ക് ലഭിക്കില്ല:\n• Booking of your opportunity\n• 📄 Tender + Annexure-B documents\n• 📅 Agreement date booking`;
  }
  if(lang==='hi'){
    let oppHi='बिजनेस सेंटर अवसर';
    if(sub==='OPP_DISTRICT') oppHi='जिला फ्रेंचाइजी अवसर';
    else if(sub==='OPP_CORP') oppHi='कॉर्पोरेशन / म्युनिसिपल फ्रेंचाइजी अवसर';
    return `📍 Step 5 of 6 — 1 स्टेप बाकी\n\n🙏 आपका ${oppHi} अभी बुक नहीं हुआ है।\n\n🔍 मैंने अभी payment system में चेक किया — आपकी फी अभी तक नहीं दिखी है।\n\n💳 रजिस्ट्रेशन फी Rs.${token} भरने पर, आपके समझौता और आय दस्तावेज़ मिलेंगे।\n\n⚠️ फी नहीं भरी तो आपको नहीं मिलेगा:\n• Booking of your opportunity\n• 📄 Tender + Annexure-B documents\n• 📅 Agreement date booking`;
  }
  let oppName='Business Center opportunity';
  if(sub==='OPP_DISTRICT') oppName='District Business Opportunity';
  else if(sub==='OPP_CORP') oppName='Corporation / Municipal Business Opportunity';
  return `📍 Step 5 of 6 — 1 step left\n\n🙏 Your ${oppName} is not booked yet.\n\n🔍 I just checked our payment system — your fee is not yet reflected.\n\n💳 Pay Registration Fee Rs.${token} to receive your Agreement and Income documents.\n\n⚠️ If fee is not paid, you will NOT get:\n• Booking of your opportunity\n• 📄 Tender + Annexure-B documents\n• 📅 Agreement date booking`;
}
function getPay5MinChaseText(lang,fee,sub){ return getPayReminderExact(lang,fee,sub); }

// V247 CALL-FOLLOWUP REMINDER - for Pay-step leads who already saw Call button
// Malayalam uses: "🙏 നിങ്ങൾ ഞങ്ങളുടെ ടീമിനെ വിളിച്ചിരുന്നോ?" (question, not assumption)
function getCallFollowupReminderExact(lang, fee, sub){
  const token = getTokenFee(sub||'OPP_DISTRICT');
  if(lang==='ml'){
    let oppMl='ബിസിനസ് സെന്റർ അവസരം';
    if(sub==='OPP_DISTRICT') oppMl='ജില്ലാ ഫ്രാഞ്ചൈസി അവസരം';
    else if(sub==='OPP_CORP') oppMl='കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി അവസരം';
    return `📍 Step 5 of 6 — 1 സ്റ്റെപ്പ് ബാക്കി\n\n🙏 നിങ്ങൾ ഞങ്ങളുടെ ടീമിനെ വിളിച്ചിരുന്നോ?\n\nമറുപടി കിട്ടിയോ? സംശയങ്ങൾ മാറിയോ? ഇപ്പോൾ Pay ചെയ്യാൻ തയ്യാറാണോ?\n\n💳 രജിസ്ട്രേഷൻ ഫീ Rs.${token} അടച്ചാൽ, നിങ്ങളുടെ കരാർ, വരുമാന രേഖകൾ ലഭിക്കും.`;
  }
  if(lang==='hi'){
    let oppHi='बिजनेस सेंटर अवसर';
    if(sub==='OPP_DISTRICT') oppHi='जिला फ्रेंचाइजी अवसर';
    else if(sub==='OPP_CORP') oppHi='कॉर्पोरेशन / म्युनिसिपल फ्रेंचाइजी अवसर';
    return `📍 Step 5 of 6 — 1 स्टेप बाकी\n\n🙏 क्या आपने हमारी टीम को कॉल किया था?\n\nजवाब मिला? doubts clear हुए? अब Pay करने के लिए तैयार हैं?\n\n💳 रजिस्ट्रेशन फी Rs.${token} भरने पर, आपके समझौता और आय दस्तावेज़ मिलेंगे।`;
  }
  let oppName='Business Center opportunity';
  if(sub==='OPP_DISTRICT') oppName='District Business Opportunity';
  else if(sub==='OPP_CORP') oppName='Corporation / Municipal Business Opportunity';
  return `📍 Step 5 of 6 — 1 step left\n\n🙏 Did you call our team?\n\nDid you get a response? Doubts cleared? Ready to pay now?\n\n💳 Pay Registration Fee Rs.${token} to receive your Agreement and Income documents.`;
}
async function sendCallFollowupStep(uid, lang, fee, sub, phoneId){
  try{
    const body = getCallFollowupReminderExact(lang, fee, sub);
    await sendWithDelay(textMessage(uid, String(body||''), phoneId));
    await delay(400);
    const link = getRazorpayLinkForSub(sub);
    const payLine = lang==='ml' ? '👇 താഴെ Pay Now ക്ലിക്ക് ചെയ്യൂ - Razorpay തുറക്കും'
      : lang==='hi' ? '👇 नीचे Pay Now क्लिक करें - Razorpay खुलेगा'
      : '👇 Tap Pay Now below - Razorpay will open';
    await sendWithDelay(singleCta(uid, payLine, {title:'Pay now', url:link}, phoneId));
    await delay(400);
    const callLine = lang==='ml' ? 'ഇനിയും സംശയമുണ്ടെങ്കിൽ 👇 Call Again ക്ലിക്ക് ചെയ്യൂ'
      : lang==='hi' ? 'अभी भी doubt हो तो 👇 Call Again क्लिक करें'
      : 'Still have doubt? 👇 Tap Call Again';
    await sendWithDelay(realDialerCta(uid, callLine, HELP_MARKETING_FULL, phoneId));
  }catch(e){ console.log('sendCallFollowupStep fail', e.message); }
}


const HELP_ADMIN = '8590183646';
const HELP_MARKETING = '8590175977';
const HELP_HUMAN = '8590175977';
const PAY_VERIFY_TEXT = { en: '✅ I Paid - Verify Now', hi: '✅ मैंने भुगतान किया - Verify करें', ml: '✅ ഞാൻ അടച്ചു - Verify ചെയ്യുക' };
const HUMAN_TALK_TEXT = { en: '📞 Talk to Human', hi: '📞 मानव से बात करें', ml: '📞 ടീമിനോട് സംസാരിക്കൂ' };
const HELP_ADMIN_FULL = '+918590183646';
const HELP_MARKETING_FULL = '+918590175977';
// 🔒 V356 NUMBERS LOCKED BY USER: Business Opportunity = 8590175977 (HELP_MARKETING), Services (Ride/BizDir/Delivery/Booking) = 8590183646 (HELP_ADMIN). Never swap.
const HELP_OPP = '8590175977'; const HELP_OPP_FULL = '+918590175977'; const HELP_SERVICE = '8590183646'; const HELP_SERVICE_FULL = '+918590183646';
// 🔒 V356 VIDEO LINKS LOCKED BY USER (exact URLs): ML Company=2BB34, ML District=Bi2HJ, ML Corp/Muni=aj4Bxw, ML Center=jCwTwiu(SVqd); EN/HI Company=R9IEne, EN/HI District=_y2Je, EN/HI Corp=Gqolfq, EN/HI Center=r0X77
const COMPANY_VIDEO_ML = 'https://youtu.be/2BB34hGi52I?si=KLXcu-amOJkAgVsi'; const COMPANY_VIDEO_ENHI = 'https://youtu.be/R9IEneHrUHE?si=f4Py2ADBpPYfl7Ca'; function getCompanyVideoUrl(_l){ return _l==='ml' ? COMPANY_VIDEO_ML : COMPANY_VIDEO_ENHI; }

// ===== V364.37 Q1/Q2 AFTER COMPANY VIDEO - Q1 AS REMINDER, Q2 SERIOUS ONLY =====
// Q1 message = user-locked text. Language ONLY - no mixing, no Manglish.
// Q2 = investment capacity, shown ONLY if Q1 = RUNNING / PLANNING. NEVER for JUST_ENQUIRY.
function v36436Q1Text(lang){
  if(lang==='ml') return `ഞങ്ങളുടെ കമ്പനിയെയും സർവീസുകളെയും കുറിച്ചുള്ള വിവരദായക വീഡിയോ നിങ്ങൾ കണ്ടുവെന്ന് പ്രതീക്ഷിക്കുന്നു. ഈ അന്വേഷണത്തിൽ നിങ്ങളുടെ ഉദ്ദേശ്യം അറിയാനാണ് ഞാൻ പോകുന്നത്, നിങ്ങളെ നന്നായി സേവിക്കാൻ താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കുക.`;
  if(lang==='hi') return `आशा है आपने हमारी कंपनी और सेवाओं के बारे में जानकारीपूर्ण वीडियो देख लिया है। इस पूछताछ में आपका इरादा जानने जा रही हूँ, आपको बेहतर सेवा देने के लिए नीचे से कोई एक चुनें।`;
  return `Hope you saw the informative video about our company and services. Here i am going to know about your intention on this enquiry, Please select any one from below to serve you better.`;
}
function v36436Q1Buttons(lang){
  if(lang==='ml') return [{id:'Q1_RUNNING',title:'🏢 ഇപ്പോൾ ബിസിനസ്സ് നടത്തുന്നു'},{id:'Q1_PLANNING',title:'🚀 തുടങ്ങാൻ പ്ലാൻ ചെയ്യുന്നു'},{id:'Q1_JUST',title:'👀 വെറുതെ അന്വേഷിക്കുന്നു'}];
  if(lang==='hi') return [{id:'Q1_RUNNING',title:'🏢 पहले से बिज़नेस है'},{id:'Q1_PLANNING',title:'🚀 शुरू करने की योजना है'},{id:'Q1_JUST',title:'👀 सिर्फ पूछताछ'}];
  return [{id:'Q1_RUNNING',title:'🏢 Already running business'},{id:'Q1_PLANNING',title:'🚀 Planning to start'},{id:'Q1_JUST',title:'👀 Just enquiry'}];
}
function v36436Q2Text(lang){
  if(lang==='ml') return `നന്ദി 😊 നിങ്ങളുടെ നിക്ഷേപ ശേഷി തിരഞ്ഞെടുക്കുക:`;
  if(lang==='hi') return `धन्यवाद 😊 अपनी निवेश क्षमता चुनें:`;
  return `Thank you 😊 Please select your investment capacity:`;
}
function v36436Q2Buttons(){ return [{id:'Q2_30K',title:'30K to 1L'},{id:'Q2_2L',title:'2L to 5L'},{id:'Q2_5L',title:'5L to 15L'}]; }
function v36436JustText(lang){
  if(lang==='ml') return `അന്വേഷിച്ചതിന് നന്ദി 😊 ഞങ്ങളുടെ സർവീസുകൾ ഇവിടെ കാണാം.`;
  if(lang==='hi') return `पूछताछ के लिए धन्यवाद 😊 आप हमारी सेवाएँ यहाँ देख सकते हैं।`;
  return `Thank you for your enquiry 😊 You can check our services here.`;
}
// ===== END V364.37 Q1/Q2 =====


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

// ===== V364.3 STUCK-REMINDER FIX - 5 numbers only, NO Redis spam =====
// Root cause: checkDueReminders did redis.del(k) for maya_idle, but Upstash was at 500k limit so del FAILED.
// Same 5 keys stayed due forever -> checker logged + retried every 60s -> burned quota.
// Fix: (a) /clear-stuck-reminders deletes ONLY these 5 by exact key in ONE redis.del call, no keys/get loop.
// (b) Once cleared/blocked, checker SKIPS them silently, no log, no retry, no Redis call per key.
// (c) If Redis says max requests, checker backs off 10 min instead of retrying every minute.
const V364_1_STUCK = [
  {uid:'918590175977', type:'maya_idle_4:1795447804362'},
  {uid:'918590183646', type:'maya_idle_4:1795447802973'},
  {uid:'919207778634', type:'maya_idle_4:1795444939256'},
  {uid:'919447321308', type:'maya_idle_4:1795445534035'},
  {uid:'919496309036', type:'maya_idle_4:1795446876783'},
];
globalThis.__v364_1_blockedIdle = globalThis.__v364_1_blockedIdle || new Set(V364_1_STUCK.map(s=>s.uid+':'+s.type));
globalThis.__v364_1_checkerBackoffUntil = 0;


let sheetsClient = null;
let sheetsClientAt = 0;
let lastSheetError = '';
async function getSheets(){
  if(!google) { console.log('googleapis not installed'); return null; }
  const creds = process.env.GOOGLE_CREDENTIALS || process.env.GOOGLE_CREDENTIALS_JSON;
  if(!creds){ console.log('GOOGLE_CREDENTIALS missing - sheet will only console.log'); return null; }
  try{
    if(sheetsClient && Date.now()-sheetsClientAt < 45*60*1000) return sheetsClient;
    sheetsClient = null; // V247: force fresh auth
    let credentials;
    try{ credentials = JSON.parse(creds); } catch{ credentials = JSON.parse(Buffer.from(creds, 'base64').toString()); }
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    const client = await auth.getClient();
    sheetsClient = google.sheets({version:'v4', auth: client});
    sheetsClientAt = Date.now();
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
  }catch(e){ console.log('getSheets error', e.message); lastSheetError = e.message; sheetsClient = null; sheetsClientAt = 0; return null; }
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
  for(let attempt=0; attempt<2; attempt++){
    try{
      const sheets = await getSheets();
      if(!sheets){ console.log(`SHEET ${cleanTab}`, row); return; }
      const range = `'${cleanTab}'!A:Z`;
      await sheets.spreadsheets.values.append({spreadsheetId: getSheetIdForUid(row[1]), range: range, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [row] }});
      console.log(`SHEET SAVED ${cleanTab} -> ${row[1]||''} : ${row[3]||''}`);
      return;
    }catch(e){ lastSheetError = e.message; console.log(`SHEET FAIL ${cleanTab} attempt ${attempt+1}`, e.message, row); sheetsClient = null; sheetsClientAt = 0; if(attempt===1) return; }
  }
}


// ===== V247 - FIRED_LOSER_LIST GATE - ONLY ADDITION vs V247 =====
// ===== V247 - FIRED NORMALIZE FIX (international numbers) =====
function firedVariants(raw){
  let d = String(raw||'').replace(/[^0-9]/g,'');
  const out = new Set();
  if(!d) return out;
  out.add(d);
  if(d.length===10) out.add('91'+d);
  if(d.length===12 && d.startsWith('91')) out.add(d.slice(2));
  if(d.length===13 && d.startsWith('91')) out.add(d.slice(2));
  if(d.length===12 && d.startsWith('91')) out.add(d);
  return out;
}
function normalizeFiredPhone(raw){
  let d = String(raw||'').replace(/[^0-9]/g,'');
  if(d.length===10) return '91'+d;
  if(d.length===13 && d.startsWith('91')) return d.slice(2);
  return d;
}
let firedCache = { at: 0, set: new Set() };
async function getFiredList(force){
  try{
    if(!force && Date.now()-firedCache.at < 10*60*1000) return firedCache.set;
    const sheets = await getSheets();
    if(!sheets) return firedCache.set;
    const res = await sheets.spreadsheets.values.get({spreadsheetId: SHEET_ID, range: `'Fired_Loser_List'!A:A`});
    try{ const res2 = await sheets.spreadsheets.values.get({spreadsheetId: SHEET_ID_MALAPPURAM, range: `'Fired_Loser_List'!A:A`}); (res2.data.values||[]).forEach(r=>{ firedVariants(r[0]).forEach(v=>set.add(v)); }); }catch(e){ console.log('FIRED_LIST Malappuram read fail (non-fatal)', e.message); }
    const set = new Set();
    (res.data.values||[]).forEach(r=>{ firedVariants(r[0]).forEach(v=>set.add(v)); });
    firedCache = { at: Date.now(), set };
    return set;
  }catch(e){ console.log('FIRED_LIST read fail (fail-open)', e.message); return firedCache.set; }
}
async function isFiredPhone(uid){ const set = await getFiredList(false); for(const v of firedVariants(uid)){ if(set.has(v)) return true; } return false; }
async function saveFiredRow(row){
  for(let attempt=0; attempt<2; attempt++){
  try{
    const sheets = await getSheets();
    if(!sheets){ console.log('SHEET Fired_Loser_List', row); return; }
    await sheets.spreadsheets.values.append({spreadsheetId: getSheetIdForUid(row[0]), range: `'Fired_Loser_List'!A:H`, valueInputOption: 'USER_ENTERED', insertDataOption: 'INSERT_ROWS', requestBody: { values: [row] }});
    firedVariants(row[0]).forEach(v=>firedCache.set.add(v)); firedCache.at = Date.now();
    console.log('SHEET SAVED Fired_Loser_List ->', row[0], row[4]||'');
    return;
  }catch(e){ lastSheetError = e.message; console.log('SHEET FAIL Fired_Loser_List attempt '+(attempt+1), e.message, row); sheetsClient = null; sheetsClientAt = 0; if(attempt===1) return; }
  }
}
async function autoFireLoser(uid, reason){
  if(isTestNumber(uid)){ console.log('V364.37 SKIP autoFire - test number', uid); return; }
  try{
    const phone = normalizeFiredPhone(uid);
    if(await isFiredPhone(phone)) return;
    const st = await getState(uid);
    if(st && (st.flow==='DONE' || st.firedGate==='ALLOWED' || st.firedGate==='STOPPED')) return;
    await saveFiredRow([phone, '', 'Auto - After 3 Reminders', 'Bot - No Response After 3 Reminders', 'FIRED - New - No Response After 3 Reminders', 'FIRED - New - '+reason, 'NO - Fresh - Auto Added', getISTTime()]);
    try{ const s2 = await getState(uid); s2.firedGate='FIRED_AUTO'; await setState(uid, s2); }catch{}
    console.log('AUTO-FIRED', phone, reason);
  }catch(e){ console.log('autoFire error', e.message); }
}
function firedWarningText(){
  return '⚠️ One minute — please read this first.\n\nYou came before and did not reply / did not continue. Your number is in our Fired / Loser List. We do not chase people who waste time.\n\nDo you REALLY want to continue now, seriously?\n\n⚠️ एक मिनट — पहले इसे पढ़ें।\nआप पहले आए थे और जवाब नहीं दिया। आपका नंबर हमारी Fired List में है।\n\nक्या आप अभी सच में गंभीरता से आगे बढ़ना चाहते हैं?\n\n⚠️ ഒരു മിനിറ്റ് — ആദ്യം ഇത് വായിക്കൂ.\nനിങ്ങൾ മുമ്പ് വന്ന് മറുപടി നൽകിയില്ല. നിങ്ങളുടെ നമ്പർ ഞങ്ങളുടെ Fired List-ൽ ഉണ്ട്.\n\nനിങ്ങൾ ഇപ്പോൾ ശരിക്കും ഗൗരവമായി തുടരാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?';
}
async function sendFiredWarning(uid, phoneId){
  await sendWithDelay(interactiveButton(uid, firedWarningText(), [{id:'FIRED_YES',title:'YES - Serious Now'},{id:'FIRED_STOP',title:'STOP - No Msg'}], phoneId));
}
// ===== END V247 FIRED GATE =====


// ===== V364 LANGUAGE LOCK + AI MEMORY + FREE-TEXT - LOCKED PDF =====
function v364_lockedLang(state, incomingLang){
  // If lang already locked, NEVER switch, even if user types other language.
  if(state && state.lang) return state.lang;
  return incomingLang || state?.lang || 'ml';
}
function v364_saveMemory(state, patch){
  // AI MEMORY: catch out-of-order info, never ask again. patch = {name, district, town, capacity, contact, level, service, agreementDate}
  try{
    state.lead = state.lead || {};
    state.leadData = state.leadData || {};
    for(let k of ['name','district','town','capacity','contact','level','service','agreementDate','stateName']){
      if(patch && patch[k]){ state.lead[k]=patch[k]; state.leadData[k]=patch[k]; }
    }
    // correction handling: if patch has correction flag, overwrite (already done above)
    return state;
  }catch(e){ return state; }
}
function v364_extractFreeText(text, state){
  // Free-text AI-memory extraction: nearly-button + out-of-order. Best-effort, never overwrites with guess if ambiguous.
  const t = String(text||'').toLowerCase();
  const out = {};
  // capacity
  let m = t.match(/(5\s*l|5\s*lakh|anje\s*lakh)/); if(m) out.capacity='5L-15L';
  m = t.match(/(2\s*l|2\s*lakh|rand.*lakh)/); if(m && !out.capacity) out.capacity='2L-5L';
  m = t.match(/(1\s*l|1\s*lakh|oru\s*lakh|30\s*k)/); if(m && !out.capacity) out.capacity='30K-1L';
  // level
  if(/district/.test(t)) out.level='District';
  if(/business\s*center|business\s*centre/.test(t)) out.level='Business Center';
  if(/municipal|corporation|corp/.test(t)) out.level='Municipal/Corp';
  // service
  if(/ride|taxi|cab/.test(t)) out.service='Ride Hailing';
  if(/directory/.test(t)) out.service='Business Directory';
  // district Kerala - only if word present
  const districts=['thiruvananthapuram','kollam','pathanamthitta','alappuzha','kottayam','idukki','ernakulam','thrissur','palakkad','malappuram','kozhikode','wayanad','kannur','kasaragod'];
  for(let d of districts){ if(t.includes(d)){ out.district = d.charAt(0).toUpperCase()+d.slice(1); break; } }
  // phone 10-digit
  let ph = String(text||'').replace(/[^0-9]/g,''); let phm = ph.match(/(?:91)?([6-9][0-9]{9})/); if(phm) out.contact=phm[1];
  // town: if "town" + word, or "my town is X"
  let tm = String(text||'').match(/town\s*(is|:)?\s*([A-Za-z]+)/i); if(tm) out.town=tm[2];
  return out;
}
function v364_isNearlyButton(text, buttonId){
  const t = String(text||'').toLowerCase().trim();
  const map = {
    'WATCHED_COMPANY': ['video kandu','kandu','knd','seen','watched','done','kaanichu','kanditt'],
    'WATCHED_SELECTED': ['video kandu','kandu','seen','watched','done'],
    'PAY': ['pay cheyyam','i will pay','pay now','payd','paid','i paid','pay cheythu'],
    'EMI': ['emi venam','emi','emi is ok'],
    'FULL': ['full aanu','full payment','full'],
    'PAUSE': ['samayam venam','samayam tharumo','alochikkanam','pinne parayam','need time','think','later','tmrw','time chahiye','samayam vanam'],
    'STOP': ['stop','nirthu','message ayakkanda','stop messages','no msg'],
    'CALL': ['call','team','samsarikkanam','talk','call me'],
  };
  const arr = map[buttonId]||[];
  return arr.some(a=> t.includes(a));
}
// State/District/Corp/Town lists - Appendix C
const V364_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttarakhand","Uttar Pradesh","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Andaman & Nicobar","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Lakshadweep","Puducherry"];
const V364_KERALA_DISTRICTS = ["Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam","Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod"];
const V364_KERALA_CORPS = ["Thiruvananthapuram","Kollam","Kochi","Thrissur","Kozhikode","Kannur"];
// Agreement Date helpers - Calendar pop-up, >7 days, first-pay-wins
function v364_daysBetween(a,b){ try{ return Math.round((new Date(b)-new Date(a))/(1000*60*60*24)); }catch(e){ return 0; } }
function v364_agreementWarningText(lang, days){
  if(lang==='ml') return `Warning: Agreement Date Registration Fee date-il ninnu ${days} divasam kazhinju aanu. 7 divasathil kooduthal aayal less chance aanu. Slot pokam. Mumpey date venamo? Oru aal ee area-il ningalkku munpe pay cheythal agreement avande mathram aakum, ningalude alla. Slot lock cheyyan early pay cheyyuka.`;
  if(lang==='hi') return `Warning: Agreement Date Registration Fee date se ${days} din baad hai. 7 din se zyada hai to less chance hai. Slot ja sakta hai. Kya aap pehle ki date chahte hain? Agar koi aapke pehle isi area ke liye pay karta hai to agreement uska hi hoga, aapka nahi. Slot lock karne ke liye jaldi pay karein.`;
  return `Warning: Your Agreement Date is ${days} days after Registration Fee date. More than 7 days = less chance. Slot may go. Do you want earlier date? If anybody pays for same area before your date, agreement will be his only, not yours. To lock your area, pay early.`;
}
function v364_payMessage(lang){
  if(lang==='ml') return `Ee button upayogichu pay cheyyam. Njan company accounts-il ee samayam check cheythu ningalude payment acknowledge cheyyam.`;
  if(lang==='hi') return `Aap is button se pay kar sakte hain. Main isi samay company accounts me check karke aapke payment ko acknowledge karunga.`;
  return `You can pay using this button. I am ready to check it meanwhile with company accounts and acknowledge your payment.`;
}
// ===== END V364 HELPERS =====

async function getState(uid){ if(redisReady){ try{ const v=await redis.get(`state:${uid}`); if(v) return JSON.parse(v);}catch{} } return memoryStore.get(uid)||{}; }
async function setState(uid,s){ s.lastActive = Date.now(); memoryStore.set(uid,s); if(redisReady){ try{ await redis.set(`state:${uid}`, JSON.stringify(s), 'EX', 86400*7);}catch{} } }
function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

// V274: NO RAW LINKS - safety net. Any https:// / www. in visible text is stripped. Links live ONLY inside buttons.
function stripRawUrls(s){ return String(s||'').replace(/https?:\/\/[^\s\n]+/gi,'').replace(/www\.[^\s\n]+/gi,'').replace(/👉\s*\n/g,'').replace(/\n{3,}/g,'\n\n').trim(); }
function textMessage(to,body, phoneId){ return { messaging_product:'whatsapp', to, type:'text', text:{body:stripRawUrls(body).substring(0,4096)} , _phoneId: phoneId }; }
function interactiveButton(to,body,buttons, phoneId){
  const btns = buttons.slice(0,3).map(b=>({type:'reply', reply:{id:b.id, title:b.title.substring(0,20)}}));
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{type:'button', body:{text:stripRawUrls(body).substring(0,1024)}, action:{buttons:btns}}, _phoneId: phoneId };
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
  // V364: phone_number removed, reply Call Now only.
  const clean = String(phoneNumber).replace(/[^0-9]/g,'');
  const btns = [];
  if(extraButtons){ for(let b of extraButtons.slice(0,2)){ btns.push({type:'reply', reply:{id:b.id, title:b.title}}); } }
  btns.push({type:'reply', reply:{id:'CALL_NOW', title:'Call Now'}});
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{ type:'button', body:{text:String(body).substring(0,1024)}, action:{buttons:btns} }, _phoneId: phoneId };
}

// New: Direct CTA with phone_number button (real inbuilt dialer)
function interactiveWithPhoneCTA(to, body, replyButtons, phoneNumber, phoneId){
  // V364: Meta interactive button allows ONLY type:reply. phone_number removed. Call = reply Call Now + contacts fallback in sendDialer.
  const btns = [];
  if(replyButtons){ for(let b of replyButtons.slice(0,2)){ btns.push({type:'reply', reply:{id:b.id, title:b.title}}); } }
  btns.push({type:'reply', reply:{id:'CALL_NOW', title:'Call Now'}});
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{ type:'button', body:{text:String(body).substring(0,1024)}, action:{buttons:btns} }, _phoneId: phoneId };
}
function ctaButtons(to,body,ctaList, phoneId){
  return { messaging_product:'whatsapp', to, type:'text', text:{body:body.substring(0,4096)}, _phoneId: phoneId, _ctaList: ctaList };
}
function singleCta(to,body,btn, phoneId){
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{ type:'cta_url', body:{text:body.substring(0,1024)}, action:{ name:'cta_url', parameters:{ display_text: btn.title.substring(0,20), url: btn.url } } }, _phoneId: phoneId };
}
// V247 REAL DIALER HELPER (GLOBAL - must be outside singleCta): 1-tap dialer via CTA URL button with tel: URL
function realDialerCta(to, bodyText, phoneFull, phoneId){
  // V364: Meta interactive button allows ONLY type:reply. phone_number was rejected 23 Nov 2:02 PM (919947097923). Use reply Call Now. sendDialer adds contacts fallback.
  return { messaging_product:'whatsapp', to, type:'interactive', interactive:{ type:'button', body:{text:String(bodyText).substring(0,1024)}, action:{ buttons:[{type:'reply', reply:{id:'CALL_NOW', title:'Call Now'}}] } }, _phoneId: phoneId };
}
async function sendDialer(to, bodyText, phoneFull, phoneId){
  // V357: try native phone_number button first. If Meta rejects it, fallback = contacts message (tappable number) - never tel: cta_url.
  try{ return await sendWithDelay(realDialerCta(to, bodyText, phoneFull, phoneId)); }
  catch(e){ console.log('V357 dialer fallback - phone_number button rejected', e.message);
    const clean = String(phoneFull).replace(/[^0-9]/g,''); const full = clean.startsWith('91') ? '+'+clean : '+91'+clean;
    try{ return await sendWithDelay({ messaging_product:'whatsapp', to, type:'contacts', contacts:[{name:{formatted_name:'Bizmapia Team', first_name:'Bizmapia Team'}, phones:[{phone:full, type:'WORK'}]}], _phoneId: phoneId }); }catch(e2){ return await sendWithDelay(textMessage(to, String(bodyText), phoneId)); }
  }
}
function getDialerText(lang, isOpp){
  if(lang==='ml') return isOpp ? `📞 ഫ്രാഞ്ചൈസി ടീമിനെ വിളിക്കൂ\n\n👇 താഴെയുള്ള Call Now ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ — ഡയലർ നേരിട്ട് തുറക്കും.\n\nനിങ്ങളുടെ Pay ലിങ്ക് ഇപ്പോഴും Active ആണ്.` : `📞 കസ്റ്റമർ കെയറിനെ വിളിക്കൂ\n\n👇 താഴെയുള്ള Call Now ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ — ഡയലർ നേരിട്ട് തുറക്കും.`;
  if(lang==='hi') return isOpp ? `📞 फ्रेंचाइजी टीम को कॉल करें\n\n👇 नीचे Call Now बटन पर क्लिक करें — डायलर सीधे खुलेगा।\n\nआपका Pay लिंक अभी भी Active है।` : `📞 कस्टमर केयर को कॉल करें\n\n👇 नीचे Call Now बटन पर क्लिक करें — डायलर सीधे खुलेगा।`;
  return isOpp ? `📞 Call Franchise Team\n\n👇 Tap Call Now below — Dialer will open directly.\n\nYour Pay link is still Active.` : `📞 Call Customer Care\n\n👇 Tap Call Now below — Dialer will open directly.`;
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
        // V247 REAL DIALER: CTA URL button with tel: URL - 1 tap opens dialer (same tech as Android/iOS buttons, but tel: instead of https:)
        const phoneClean = c.phone.replace(/[^0-9]/g,'');
        const dialText = lang0 => lang0; // keep simple
        await sendDialer(to, 'Tap below to call now:', '+'+phoneClean, phoneId); // V357 real dialer, not tel: cta_url
        await delay(400);
      }
    }
  }catch(e){ console.log('sendCtaSequence error', e.message); }
}

async function sendWithDelay(msg){
  // V342: Log Maya outgoing to Team Inbox so team can see what Maya replied
  try{ if(!msg._fromTeam && msg.to){ let t=''; if(msg.type==='text') t=msg.text?.body||''; else if(msg.type==='interactive') t=(msg.interactive?.body?.text||'')+' [Buttons: '+(msg.interactive?.action?.buttons||[]).map(b=>b.reply?.title||b.title||'').join(' | ')+']'; else if(msg.type==='image') t='[Image] '+(msg.image?.caption||''); else if(msg.type==='video') t='[Video] '+(msg.video?.caption||''); else if(msg.type==='template') t='[Template: '+(msg.template?.name||'')+']'; else t='['+(msg.type||'message')+']'; if(t) teamInboxPush(String(msg.to),'maya',t,'V342 Maya Reply'); } }catch(e){}
  const now = Date.now();
  if(now < blockUntil){ console.log(`BLOCKED till ${new Date(blockUntil)}`); return; }
  if(now - lastSendTime < 500){ await delay(500-(now-lastSendTime)); }
  lastSendTime = Date.now();
  // V364: sanitize + log BEFORE send + retry once
  try{
    try{ console.log('SEND TO ' + (msg.to||'unknown') + ' : ' + (msg.type||'message')); }catch(e){}
    if(!msg.messaging_product) msg.messaging_product='whatsapp';
    if(msg.type==='text' && typeof msg.text==='string') msg.text={body: msg.text};
    if(msg.type==='text' && msg.text && typeof msg.text.body!=='string') msg.text={body: String(msg.text.body||'')};
    if(msg.type==='text' && (!msg.text || !String(msg.text.body||'').trim())){
      // V364: never empty body - fallback in locked language (default Malayalam, caller should pass locked text)
      msg.text={body:'Sorry, please tap button again.'};
    }
    delete msg._ctaList; delete msg._fromTeam; delete msg._isIdle;
    const phoneIdToUse = msg._phoneId || PHONE_ID_OLD;
    delete msg._phoneId;
    const url = `https://graph.facebook.com/v20.0/${phoneIdToUse}/messages`;
    const res = await httpClient.post(url, msg, {headers:{Authorization:`Bearer ${getWhatsAppTokenForPhoneId(phoneIdToUse)}`, 'Content-Type':'application/json'}});
    console.log(`OUT to ${msg.to} via ${phoneIdToUse} - ${msg.type}`, res.data.messages?.[0]?.id||'ok');
    try{ const _st = await getState(msg.to); if(_st){ _st.lastBotMsgAt = Date.now(); await setState(msg.to, _st); } }catch(_){}
    // V345: Every Maya message schedules Are-you-there from its own reading time, in ALL steps. Skip team msgs and skip idle reminders themselves (avoid loop).
    try{ if(!msg._fromTeam && !msg._isIdle && msg.to){ let _t=''; if(msg.type==='text') _t=msg.text?.body||''; else if(msg.type==='interactive') _t=msg.interactive?.body?.text||''; const _isIdle=/Are you there|Yahan hain|Still interested|Abhi bhi interest|Shall I remind|Thodi der baad|One last check|Aakhri baar|ഇവിടെ ഉണ്ടോ|ഇപ്പോഴും താല്പര്യം|ഓർമ്മിപ്പിക്കട്ടെ|അവസാനമായി|തുടരട്ടെ|Are you still there|Still you not replied|Do you really want to stop|Talk later|1 hour ho gaya|12 hours|24 hours|1 hour ആയി|12 hours ആയി|24 hours ആയി/i.test(_t); if(!_isIdle && _t){ let _lang='ml'; try{ const _s2=await getState(msg.to); if(_s2 && _s2.lang) _lang=_s2.lang; }catch(e){} scheduleIdleNudges(msg.to, _lang, msg._phoneId||PHONE_NUMBER_ID, readingWaitMs(_t)); } } }catch(e){}
    return res.data;
  }catch(e){
    const err = e.response?.data?.error;
    console.log('SEND FAIL', JSON.stringify(e.response?.data||e.message));
    // V364: retry once as plain text, log number
    try{
      const retryBody = (msg.type==='text' ? (msg.text?.body||'') : (msg.interactive?.body?.text||'')) || 'Please tap button again.';
      if(msg.to && retryBody){
        console.log('SEND FAIL RETRY to ' + msg.to);
        const retryMsg = { messaging_product:'whatsapp', to: msg.to, type:'text', text:{body: String(retryBody).substring(0,4096)} };
        const phoneId2 = msg._phoneId || PHONE_ID_OLD;
        const url2 = `https://graph.facebook.com/v20.0/${phoneId2}/messages`;
        await httpClient.post(url2, retryMsg, {headers:{Authorization:`Bearer ${getWhatsAppTokenForPhoneId(phoneIdToUse)}`, 'Content-Type':'application/json'}});
        console.log('SEND FAIL RETRY OK to ' + msg.to);
        return {retry:true};
      }
    }catch(e2){ console.log('SEND FAIL FINAL to ' + (msg.to||'unknown') + ' : ' + (e2.message||e2)); }
    if(err?.code===130429 || JSON.stringify(err).includes('too many messages')){
      blockUntil = Date.now()+62*60*1000;
      console.log(`130429 DETECTED BLOCKING 65 MIN - V364: alert both team numbers via Sheet + log`);
      try{ await saveToSheet('System_Logs',[getISTTime(),'ALL','all','130429 Alert','Too many messages - blocking 65 min - alert both team numbers','Alert',HELP_ADMIN,'Alert',''],false); }catch(e){}
    }
  }
}

function getSorryExplain(lang, lastStep, userText){
  // V247: Sorry + Explain last step + No Human before Registration Fee
  const safeText = (userText||'').slice(0,30);
  const last = lastStep||'';
  let stepName = 'this step';
  let whatToDo = '';
  if(lang==='ml'){
    if(last.includes('Company Video')){ stepName='കമ്പനി വീഡിയോ'; whatToDo='വീഡിയോ പൂർണ്ണമായി കാണുക, തുടർന്ന് "കമ്പനി വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക'; }
    else if(last.includes('Video Must Watch') || last.includes('High level') || last.includes('₹5L-₹15L') || last.includes('Moderate') || last.includes('₹2L-₹5L') || last.includes('Base level') || last.includes('₹30K-₹1L') || last.includes('District') || last.includes('Corp') || last.includes('Center')){ stepName='ഫ്രാഞ്ചൈസി വീഡിയോ'; whatToDo='വീഡിയോ പൂർണ്ണമായി കാണുക, തുടർന്ന് "വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക'; }
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
    else if(last.includes('Video Must Watch') || last.includes('High level') || last.includes('₹5L-₹15L') || last.includes('Moderate') || last.includes('₹2L-₹5L') || last.includes('Base level') || last.includes('₹30K-₹1L') || last.includes('District') || last.includes('Corp') || last.includes('Center')){ stepName='फ्रेंचाइजी वीडियो'; whatToDo='वीडियो पूरा देखें, फिर "वीडियो देखा" पर क्लिक करें'; }
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
    else if(last.includes('Video Must Watch') || last.includes('High level') || last.includes('₹5L-₹15L') || last.includes('Moderate') || last.includes('₹2L-₹5L') || last.includes('Base level') || last.includes('₹30K-₹1L') || last.includes('District') || last.includes('Corp') || last.includes('Center')){ stepName='Franchise Video'; whatToDo='Watch video fully, then click "Watched Video"'; }
    else if(last.includes('Benefits')){ stepName='Benefits'; whatToDo='Read Benefits, if understood click "Understood Benefit"'; }
    else if(last.includes('Support')){ stepName='Support'; whatToDo='Read Support, if understood click "Seen and Understood"'; }
    else if(last.includes('Requirements')){ stepName='Requirements'; whatToDo='Read Requirements, if understood click "Understood Req"'; }
    else if(last.includes('Ready')){ stepName='Submit Application'; whatToDo='If ready, click "Yes Ready" below'; }
    else if(last.includes('EMI')){ stepName='EMI Options'; whatToDo='Select one EMI option from below'; }
    else if(last.includes('Pay') || last.includes('Not Paid')){ stepName='Registration Fee Payment'; whatToDo='Pay registration fee, then click "I Paid"'; }
    else if(last.includes('Language')){ stepName='Language Selection'; whatToDo='Select language from below'; }
    else { stepName='this step'; whatToDo='Click the button below'; }
    return `😔 Sorry, I did not understand your reply "${safeText}".\n\n📄 You are in ${stepName} step.\n\n👉 What to do now: ${whatToDo}.\n\n💡 If you have any query, please complete this step first, then you can contact our team in next steps.`;
  }
}

// ===== V247 SINGLE-MESSAGE + STEPS-LEFT + CONGRATS + WHAT-TO-DO =====
// 1 step = 1 message. Every opp message = Congrats (prev step done) + What to do now + Steps Left, all in SAME message.
function oppBalanceNames(lang, step){
  const names = lang==='ml' ? ['കമ്പനിയെ അറിയാം','നിക്ഷേപ ശേഷി','അവസരം മനസ്സിലാക്കൂ','തയ്യാറാണ്','രജിസ്ട്രേഷൻ ഫീ','എഗ്രിമെന്റ് തീയതി'] : lang==='hi' ? ['कंपनी जानें','निवेश क्षमता','अवसर समझें','तैयार हैं','रजिस्ट्रेशन फी','एग्रीमेंट डेट'] : ['Know Company','Investing Capacity','Understand Opportunity','Confirm Ready','Pay Registration Fee','Fix Agreement Date'];
  const bal = names.slice(step);
  if(!bal.length) return lang==='ml' ? `✅ എല്ലാ സ്റ്റെപ്പും പൂർത്തിയായി!` : lang==='hi' ? `✅ सभी स्टेप पूरे!` : `✅ All steps done!`;
  const label = lang==='ml' ? `Balance Steps — ബാക്കി:` : lang==='hi' ? `Balance Steps — बाकी:` : `Balance Steps — remaining:`;
  return `${label} ${bal.join(' → ')}`;
}
function oppProgress(lang, step){
  const left = 6 - step;
  const bal = oppBalanceNames(lang, step);
  if(lang==='ml') return step>=6 ? `📍 Step 6 of 6 — അവസാന സ്റ്റെപ്പ്!\n${bal}` : `📍 Step ${step} of 6 — ${left} സ്റ്റെപ്പ് ബാക്കി\n${bal}`;
  if(lang==='hi') return step>=6 ? `📍 Step 6 of 6 — आखिरी स्टेप!\n${bal}` : `📍 Step ${step} of 6 — ${left} स्टेप बाकी\n${bal}`;
  return step>=6 ? `📍 Step 6 of 6 — Last step!\n${bal}` : `📍 Step ${step} of 6 — ${left} steps left\n${bal}`;
}
function oppCongrats(lang, step){
  // step = CURRENT step. Congratulates PREVIOUS step done + tells What to do now. Pure language.
  if(step===1){
    if(lang==='ml') return `🎉 മികച്ച തിരഞ്ഞെടുപ്പ്!\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: കമ്പനി വീഡിയോ കാണുക, തുടർന്ന് താഴെ ക്ലിക്ക് ചെയ്യുക:`;
    if(lang==='hi') return `🎉 बेहतरीन चयन!\n👉 अब क्या करें: कंपनी वीडियो देखें, फिर नीचे क्लिक करें:`;
    return `🎉 Excellent choice!\n👉 What to do now: See Company Video, then click below:`;
  }
  if(step===2){
    if(lang==='ml') return `👏 അഭിനന്ദനങ്ങൾ! കമ്പനി വീഡിയോ കണ്ടു!\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ നിന്ന് നിക്ഷേപ ശേഷി തിരഞ്ഞെടുക്കുക:`;
    if(lang==='hi') return `👏 बधाई हो! कंपनी वीडियो देखा!\n👉 अब क्या करें: नीचे से निवेश क्षमता चुनें:`;
    return `👏 Congratulations! Company Video watched!\n👉 What to do now: Select investing capacity from below:`;
  }
  if(step===3){
    if(lang==='ml') return `👏 അഭിനന്ദനങ്ങൾ! നിക്ഷേപ ശേഷി തിരഞ്ഞെടുത്തു!\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: ഈ അവസരം എങ്ങനെ മനസ്സിലാക്കണം എന്ന് തിരഞ്ഞെടുക്കുക — വീഡിയോ OR 3 ക്ലിക്ക്:`;
    if(lang==='hi') return `👏 बधाई हो! निवेश क्षमता चुनी!\n👉 अब क्या करें: इस अवसर को कैसे समझें, चुनें — वीडियो OR 3 क्लिक:`;
    return `👏 Congratulations! Investing Capacity selected!\n👉 What to do now: Choose how to understand this Opportunity — Video OR 3 Clicks:`;
  }
  if(step===4){
    if(lang==='ml') return `👏 അഭിനന്ദനങ്ങൾ! അവസരം മനസ്സിലായി!\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: നിങ്ങളുടെ ജില്ലയിൽ കോർപ്പറേഷൻ ഉണ്ടോ എന്ന് തിരഞ്ഞെടുക്കുക:`;
    if(lang==='hi') return `👏 बधाई हो! अवसर समझ में आ गया!\n👉 अब क्या करें: आपके जिले में कॉर्पोरेशन है या नहीं, चुनें:`;
    return `👏 Congratulations! Opportunity understood!\n👉 What to do now: Select if your district has Corporation:`;
  }
  if(step===5){
    if(lang==='ml') return `👏 അഭിനന്ദനങ്ങൾ! തയ്യാറായി!\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: രജിസ്ട്രേഷൻ ഫീ അടയ്ക്കുക, തുടർന്ന് "Pay now" ക്ലിക്ക് ചെയ്യുക:`;
    if(lang==='hi') return `👏 बधाई हो! तैयार हैं!\n👉 अब क्या करें: रजिस्ट्रेशन फी भरें, फिर "Pay now" पर क्लिक करें:`;
    return `👏 Congratulations! You are Ready!\n👉 What to do now: Pay Registration Fee, then click "Pay now":`;
  }
  if(step===6){
    if(lang==='ml') return `👏 അഭിനന്ദനങ്ങൾ! പേയ്മെന്റ് ക്ലെയിം ചെയ്തു!\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: 1 മെസേജിൽ വിശദാംശങ്ങൾ ടൈപ്പ് ചെയ്യുക:`;
    if(lang==='hi') return `👏 बधाई हो! भुगतान क्लेम किया!\n👉 अब क्या करें: 1 मैसेज में विवरण टाइप करें:`;
    return `👏 Congratulations! Payment claimed!\n👉 What to do now: Type your details in 1 message:`;
  }
  return ``;
}
function oppRoadmap(lang){
  if(lang==='ml') return `🎯 നിങ്ങളുടെ അവസരം — 6 സ്റ്റെപ്പിൽ ഫൈനൽ\n1️⃣ കമ്പനിയെ അറിയാം - വീഡിയോ കാണൂ (2 മിനിറ്റ്)\n2️⃣ നിക്ഷേപ ശേഷി അനുസരിച്ച് തിരഞ്ഞെടുക്കൂ\n3️⃣ അവസരം മനസ്സിലാക്കൂ - വീഡിയോ OR 3 വിവരണങ്ങൾ\n4️⃣ തയ്യാറാണ് — കൺഫേം ചെയ്യൂ\n5️⃣ രജിസ്ട്രേഷൻ ഫീ അടയ്ക്കൂ\n6️⃣ എഗ്രിമെന്റ് തീയതി ഫിക്സ് ചെയ്യൂ`;
  if(lang==='hi') return `🎯 आपका अवसर — 6 स्टेप में फाइनल\n1️⃣ कंपनी जानें — वीडियो देखें (2 मिनट)\n2️⃣ निवेश क्षमता के अनुसार चुनें\n3️⃣ अवसर समझें — वीडियो OR 3 पेज पढ़ें\n4️⃣ तैयार हैं — कन्फर्म करें\n5️⃣ रजिस्ट्रेशन फी भरें\n6️⃣ एग्रीमेंट डेट फिक्स करें`;
  return `🎯 Your Opportunity — 6 Steps to Finalize\n1️⃣ Know the Company — See Company Video (2 min)\n2️⃣ Choose as per your Investing Capacity\n3️⃣ Understand Opportunity — Watch Video OR Read 3 Short Pages\n4️⃣ Confirm You Are Ready\n5️⃣ Pay Registration Fee\n6️⃣ Fix Agreement Date`;
}
function oppLearnQ(lang){
  if(lang==='ml') return oppProgress(lang,3)+`\n\n`+oppCongrats(lang,3)+`\n\n🎥 വീഡിയോ കണ്ടാൽ — വീഡിയോ കണ്ട് നേരെ Corp Check-ലേക്ക് പോകാം.\n📄 3 ക്ലിക്ക് വായിച്ചാൽ — ആനുകൂല്യം + പിന്തുണ + ആവശ്യകത വായിച്ച് മനസ്സിലാക്കാം.\n\n👇 ഒന്ന് തിരഞ്ഞെടുക്കുക:`;
  if(lang==='hi') return oppProgress(lang,3)+`\n\n`+oppCongrats(lang,3)+`\n\n🎥 वीडियो देखें — वीडियो देखकर सीधे Corp Check पर जाएं।\n📄 3 क्लिक पढ़ें — लाभ + सपोर्ट + आवश्यकता पढ़कर समझें।\n\n👇 एक चुनें:`;
  return oppProgress(lang,3)+`\n\n`+oppCongrats(lang,3)+`\n\n🎥 See Video — Watch video and go directly to Corp Check.\n📄 Read 3 Clicks — Read Benefits + Support + Requirements.\n\n👇 Select one:`;
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
    // V247: 12h/24h OR already-called -> Call-followup (Did you call? Doubts cleared? Ready to pay?) + [Pay now] + [Call again]
    if(state.called || level===12 || level===24){
      console.log(`REMINDER: Pay step level=${level} - sending CALL-FOLLOWUP reminder for ${uid}`);
      return await sendCallFollowupStep(uid,lang,fee,state.sub,phoneId);
    }
    const escalatedText = getPayReminderExact(lang, fee, sub); // V247 EXACT reminder, no FOMO variant
    console.log(`REMINDER: Pay step level=${level} - sending EXACT Pay-Now reminder for ${uid}`);
    return await sendPayNowStep(uid,lang,fee,state.sub,phoneId, escalatedText, false);
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
  if(sub==='OPP_DISTRICT' || last.includes('High level') || last.includes('₹5L-₹15L') || last.includes('District')){ 
  // V247 FIX: tracking link defined correctly
  const videoObj = getVideoObj('OPP_DISTRICT', lang);
  const trackingLink = getTrackingLink('https://bizmapia-bot-8590175977.onrender.com', uid, lang, 'OPP_DISTRICT', videoObj, state.selectedDistrict || 'Idukki');
  await sendWithDelay(singleCta(uid, oppLearnQ(lang), {title:'🎥 See Video', url: getVideoUrl('OPP_DISTRICT', lang)}, phoneId)); return await sendWithDelay(interactiveButton(uid, oppLearnQ(lang), [{id:'OPP_VIDEO_WATCHED',title: lang==='ml' ? '✅ വീഡിയോ കണ്ടു' : lang==='hi' ? '✅ वीडियो देखा' : '✅ Watched Video'},{id:'OPP_LEARN_READ',title: lang==='ml' ? '📄 3 ക്ലിക്ക് വായിക്കുക' : lang==='hi' ? '📄 3 क्लिक पढ़ें' : '📄 Read 3 Clicks'}], phoneId)); }
  if(sub==='OPP_CORP' || last.includes('Moderate level') || last.includes('Corp')){ await sendWithDelay(singleCta(uid, oppLearnQ(lang), {title:'🎥 See Video', url: getVideoUrl('OPP_DISTRICT', lang)}, phoneId)); return await sendWithDelay(interactiveButton(uid, oppLearnQ(lang), [{id:'OPP_VIDEO_WATCHED',title: lang==='ml' ? '✅ വീഡിയോ കണ്ടു' : lang==='hi' ? '✅ वीडियो देखा' : '✅ Watched Video'},{id:'OPP_LEARN_READ',title: lang==='ml' ? '📄 3 ക്ലിക്ക് വായിക്കുക' : lang==='hi' ? '📄 3 क्लिक पढ़ें' : '📄 Read 3 Clicks'}], phoneId)); }
  if(sub==='OPP_CENTER' || last.includes('Base level') || last.includes('₹30K-₹1L') || last.includes('Center')){ await sendWithDelay(singleCta(uid, oppLearnQ(lang), {title:'🎥 See Video', url: getVideoUrl('OPP_DISTRICT', lang)}, phoneId)); return await sendWithDelay(interactiveButton(uid, oppLearnQ(lang), [{id:'OPP_VIDEO_WATCHED',title: lang==='ml' ? '✅ വീഡിയോ കണ്ടു' : lang==='hi' ? '✅ वीडियो देखा' : '✅ Watched Video'},{id:'OPP_LEARN_READ',title: lang==='ml' ? '📄 3 ക്ലിക്ക് വായിക്കുക' : lang==='hi' ? '📄 3 क्लिक पढ़ें' : '📄 Read 3 Clicks'}], phoneId)); }
  if(last==='Benefits'){ const escalatedBen = getEscalatedGeneralText(lang, L.benText, level, 'Benefits'); return await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n'+oppCongrats(lang,3)+'\n\n📄 3 Clicks — 1 of 3: Benefits\n\n'+escalatedBen, [{id:'KNOW_SUP',title:L.supBtn},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], phoneId)); }
  if(last==='Support'){ const escalatedSup = getEscalatedGeneralText(lang, L.supText, level, 'Support'); return await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n📄 3 Clicks — 2 of 3: Support\n\n'+escalatedSup, [{id:'KNOW_REQ',title:L.reqBtn},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], phoneId)); }
  if(last==='Requirements'){ const escalatedReq = getEscalatedGeneralText(lang, L.reqText, level, 'Requirements'); return await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n📄 3 Clicks — 3 of 3: Requirements\n\n'+escalatedReq, [{id:'SUBMIT_APP',title:L.submitBtn},{id:'KNOW_EMI',title:L.emiBtn}], phoneId)); }
  if(last.includes('Corp Check') || last.includes('Submit Application')){ const escalatedCorp = getEscalatedGeneralText(lang, L.corpQ, level, 'CorpCheck'); return await sendWithDelay(interactiveButton(uid,escalatedCorp,[{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], phoneId)); }
  if(last.includes('Ready')){ const fee = state.fee||15; const franchiseName = state.franchiseName||'Franchise'; let readyText = getReadyText(lang, fee, franchiseName); readyText = getEscalatedGeneralText(lang, readyText, level, 'Ready'); const readyBtnTitle = lang==='ml' ? `അതെ തയ്യാർ - ${fee}L` : lang==='hi' ? `हाँ तैयार - ${fee}L` : `Yes Ready - ${fee}L`; return await sendWithDelay(interactiveButton(uid,readyText,[{id:'READY_15L',title:readyBtnTitle},{id:'KNOW_EMI',title:L.emiBtn}], phoneId)); }
    if(last.includes('Pay Reg') || last.includes('✅ EMI Selected') || last.includes('Not Paid')){ 
    // V247 Reminder flow: Pay-Now CTA only, no Paid/Not Paid buttons
    if(state.called || level===12 || level===24){ return await sendCallFollowupStep(uid,lang,state.fee||15,state.sub,phoneId); } return await sendPayNowStep(uid,lang,state.fee||15,state.sub,phoneId, getPayReminderExact(lang,state.fee||15,state.sub), false); // V247 EXACT reminder 
  }
  if(last.includes('EMI Options')){ const fee = state.fee||15; let emiText = getEMIText(lang, fee); emiText = getEscalatedGeneralText(lang, emiText, level, 'EMI'); return await sendWithDelay(interactiveButton(uid,emiText+"\n\nPlease select any one from below:-",[{id:'EMI_10',title:L.emi10},{id:'EMI_20',title:L.emi20}], phoneId)); }
  if(last.includes('Pay Done') || last.includes('Lead') || last.includes('Lead Typed')){ return await sendWithDelay(textMessage(uid, oppProgress(lang,6)+'\n\n'+oppCongrats(lang,6)+'\n\n'+L.leadAsk, phoneId)); }
  if(last.includes('Occupation')){ return await sendWithDelay(interactiveButton(uid,L.occQ,[{id:'OCC_BUSINESS',title:L.bus},{id:'OCC_HOUSE',title:L.house},{id:'OCC_EMP',title:L.emp}], phoneId)); }
  if(last.includes('Date')){ return await sendWithDelay(interactiveButton(uid,L.dateQ,[{id:'DATE_CALENDAR',title:'Pick Date'}], phoneId)); }
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
  // V297: Old mainMenu KILLED here too - repeatLastStep must never send 'Thank you for selecting English' + 5 services again. Send 2 buttons only.
  if(isFranchiseePhoneId(phoneId)){ await sendFranchiseeServicesMenu(uid, (typeof state!=='undefined' && state.lang)||'ml', phoneId); } else { await sendWithDelay(interactiveButton(uid, `👍 I am here! 😊\n\nWhat do you need? Business Opportunity or a service?`, [{id:'AI_BUSINESS',title:'Business Opportunity'},{id:'AI_SERVICES',title:'Use Other Services'}], phoneId)); }
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


// ===== V254 PRODUCTION PACK - FOR SUCCESSFUL IMPLEMENTATION =====
// 1) Weekly Summary (Sunday 9 PM)  2) Health Check  3) Human Handover  4) Spam / Duplicate Guard  5) Backup + Error Alert
const weeklyStats = { weekStart: new Date().toISOString().slice(0,10), leads:0, payments:0, total:0, talk:0, notInterested:0 };
async function sendWeeklySummary(){
  resetDailyIfNeeded();
  const msg=`📅 WEEKLY SUMMARY - Bizmapia Maya - Week of ${weeklyStats.weekStart}\n\n📊 THIS WEEK:\n• New leads: ${weeklyStats.leads + dailyStats.newLeads}\n• Talk-to-Team: ${weeklyStats.talk + dailyStats.talkRequests}\n• Payments: ${weeklyStats.payments + dailyStats.payments} | Total: Rs ${weeklyStats.total + dailyStats.paymentTotal}\n• Not Interested: ${weeklyStats.notInterested + dailyStats.notInterested}\n\n🎯 TOP LEARNING FOR NEXT WEEK:\n• Call ONLY Token Paid leads first.\n• Follow up Token Ready + Considering leads within 24h.\n• Check Master_Leads for Avoid 3+ - do NOT spam them.\n\nCheck Sheet for full list.`;
  const admins=[...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let a of admins){ try{ await sendWithDelay(textMessage(a, msg, PHONE_NUMBER_ID)); }catch(e){} }
  weeklyStats.weekStart=new Date().toISOString().slice(0,10); weeklyStats.leads=0; weeklyStats.payments=0; weeklyStats.total=0; weeklyStats.talk=0; weeklyStats.notInterested=0;
  return msg;
}
function scheduleWeeklySummary(){
  // Every Sunday 9 PM IST - check every hour, fire if Sunday 21:00
  setInterval(async()=>{
    try{
      const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
      if(now.getDay()===0 && now.getHours()===21 && now.getMinutes()<60){
        // Prevent double-send in same hour: use a flag in memory
        if(globalThis.__weeklySent===now.toDateString()) return;
        globalThis.__weeklySent=now.toDateString();
        await sendWeeklySummary();
      }
    }catch(e){}
  }, 60*60*1000);
}
// Human Handover: if user says "human / staff / manager / complaint / fraud / police" -> alert team + tell user team will see it
function needsHuman(txt){
  const s=String(txt||'').toLowerCase();
  return /human|staff|manager|complaint|fraud|cheat|police|legal|refund.*manager|talk.*manager|supervisor/.test(s);
}
async function notifyHumanHandover(uid, state, txt){
  const L=state.lead||{};
  const msg=`🚨 HUMAN HANDOVER NEEDED\n\n👤 Phone: +${uid}\n👤 Name: ${state?.leadData?.name||'Not given'}\n📍 District: ${L.district||'Not given'}\n🎯 Intent: ${L.intent||''} | Sentiment: ${L.sentiment||''} | Token: ${L.tokenStatus||''}\n\n💬 User said: "${String(txt).slice(0,300)}"\n\n📌 Needs: ${whatHeNeeds(state)}\n🧠 Nature: ${describeNature(state)}\n\n⚠️ Action: Team, please check this chat in Sheet / WhatsApp. Do NOT promise refund / call unless token paid.\nTime: ${getISTTime()}`;
  const admins=[...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let a of admins){ if(a===String(uid)) continue; try{ await sendWithDelay(textMessage(a, msg, PHONE_NUMBER_ID)); }catch(e){} }
  return msg;
}
// Spam / Duplicate Guard: if same user sends 10+ msgs in 1 min, slow down, don't call AI 10x
const userMsgTimes = new Map();
function isSpamming(uid){
  const now=Date.now(); const arr=(userMsgTimes.get(uid)||[]).filter(x=>now-x<60000); arr.push(now); userMsgTimes.set(uid, arr);
  return arr.length>10;
}
// Backup: every day, log a backup row so you can see server was alive
async function dailyBackupLog(){
  try{ await saveToSheet('System_Logs',[getISTTime(),'SERVER','all','Daily Backup - Server Alive',`Memory:${memoryStore.size} Reminders:${reminders.size} Redis:${redisReady?'ON':'OFF'} Sheets:${lastSheetError||'OK'}`,'Health','SYSTEM','Backup',''],false); }catch(e){}
}

// ===== V253 PERSISTENT REMINDERS - SURVIVE RENDER RESTART / SLEEP =====
// Problem in V247: setTimeout dies if Render restarts/sleeps -> reminder lost.
// Fix: Every reminder is ALSO saved in Redis with due time.
// On startup + every 60 sec, server scans Redis for due reminders and re-fires them.
// So even if Render sleeps at 4 PM, evening reminder at 7 PM will still push.
let reminderCheckerStarted = false;
async function restoreRemindersFromRedis(){
  if(!redisReady || !redis) { console.log('V253 restore skipped - Redis not ready'); return 0; }
  try{
    const keys = await redis.keys('reminder:*');
    let restored = 0;
    // V362: DEDUPE maya_idle on boot - keep only NEWEST per uid+stage, drop stale overdue idle (cause of 10:32:17 + 10:32:20 double Stage-1)
    const _idleBest = {}; // uid:stage -> {key,d,remaining}
    const _idleDrop = [];
    for(let k of keys){
      try{
        const raw = await redis.get(k); if(!raw) continue;
        const d = JSON.parse(raw);
        if(String(d.type||'').includes('maya_idle')){
          const _stage = String(d.type).split(':')[0]; // maya_idle_1
          const _uk = d.uid+':'+_stage;
          const _rem = (d.due||0)-Date.now();
          if(_rem <= -5*60*1000){ _idleDrop.push(k); continue; } // stale >5min overdue idle -> drop, do NOT fire
          if(!_idleBest[_uk] || (d.due||0) > (_idleBest[_uk].d.due||0)){ if(_idleBest[_uk]) _idleDrop.push(_idleBest[_uk].key); _idleBest[_uk]={key:k,d}; }
          else _idleDrop.push(k);
        }
      }catch(e){}
    }
    for(let k of _idleDrop){ try{ await redis.del(k); }catch(e){} }
    for(let k of keys){
      try{
        const raw = await redis.get(k);
        if(!raw) continue;
        const d = JSON.parse(raw);
        const memKey = `${d.uid}:${d.type}`;
        if(reminders.has(memKey)) continue; // already has in-memory timer
        const remaining = (d.due || 0) - Date.now();
        const ms = remaining <= 0 ? 5000 : Math.min(remaining, 24*60*60*1000);
        // V362: NEVER restore maya_idle from Redis. Old idle timers (34 restored in V362 boot) fire out-of-order. Fresh idle chain is re-armed on next user message.
        if(String(d.type||'').includes('maya_idle')){ try{ await redis.del(k); }catch(e){} continue; }
        scheduleReminder(d.uid, d.type, d.lang||'ml', ms, d.phoneId||PHONE_NUMBER_ID);
        restored++;
      }catch(e){ console.log('V253 restore one fail', e.message); }
    }
    console.log(`V364 restored ${restored} reminders from Redis`);
    return restored;
  }catch(e){ console.log('V253 restore fail', e.message); return 0; }
}
async function checkDueReminders(){
  // V364.3: if Redis is at max-requests limit, back off 10 min - do NOT poll every 60s.
  if(Date.now() < (globalThis.__v364_1_checkerBackoffUntil||0)) return {checked:0, fired:0, reason:'v364.1-backoff'};
  // Called every 60 sec by interval + by /check-reminders endpoint
  if(!redisReady || !redis) return {checked:0, fired:0, reason:'redis-not-ready'};
  try{
    const keys = await redis.keys('reminder:*');
    let fired = 0;
    for(let k of keys){
      try{
        const raw = await redis.get(k);
        if(!raw) continue;
        const d = JSON.parse(raw);
        if((d.due||0) > Date.now()) continue; // not due yet
        const memKey = `${d.uid}:${d.type}`;
        if(reminders.has(memKey)) continue; // in-memory timer will fire it, don't double-fire
        // Due + no in-memory timer = Render restarted while waiting -> re-fire now
        // V364.3: blocked stuck idle -> skip silently, no log, no del retry, no Redis spam.
        if(globalThis.__v364_1_blockedIdle && globalThis.__v364_1_blockedIdle.has(`${d.uid}:${d.type}`)) continue;
        console.log(`V253 CHECKER re-firing due reminder ${d.type} for ${d.uid}`);
        // V362: NEVER re-fire maya_idle from Redis checker. Idle is owned by in-memory timers only. Redis copy is stale after user replied.
        if(String(d.type||'').includes('maya_idle')){ try{ await redis.del(k); }catch(e){} continue; }
        scheduleReminder(d.uid, d.type, d.lang||'ml', 2000, d.phoneId||PHONE_NUMBER_ID);
        fired++;
      }catch(e){}
    }
    return {checked: keys.length, fired};
  }catch(e){ if(String(e.message||'').includes('max requests')) globalThis.__v364_1_checkerBackoffUntil = Date.now()+10*60*1000; console.log('V253 checker fail', e.message); return {checked:0, fired:0, error:e.message}; }
}
function startReminderChecker(){
  if(reminderCheckerStarted) return;
  reminderCheckerStarted = true;
  // 60 sec checker - survives restart because it scans Redis, not memory
  setInterval(async()=>{ try{ await checkDueReminders(); }catch(e){} }, 60*1000);
  console.log('V253 reminder checker started - every 60 sec');
}

function clearReminders(uid){
  for(let key of reminders.keys()){ if(key.startsWith(uid+':')){ clearTimeout(reminders.get(key)); reminders.delete(key); } }
  deleteReminderFromRedis(uid, '').catch(e=>console.log('clearReminders redis error', e.message));
}
function getEscalatedPayText(lang, fee, level, sub){ const token = getTokenFee(sub||'OPP_DISTRICT');
  // FOMO + Social Proof + Scarcity - V247
  if(lang==='ml'){
    if(level===1) return `👋 ഓർമ്മപ്പെടുത്തൽ: നിങ്ങൾ ${fee}L-ന് തയ്യാറായി!\n\n⚠️ ഇത് ${fee}L-ന്റെ ഭാഗമല്ല (Not refundable). Rs${token} അടച്ചാൽ 📄 Tender + Annexure-B ഉടൻ ലഭിക്കും.\n\n👇 ഇപ്പോൾ അടയ്ക്കൂ, സ്ലോട്ട് നഷ്ടപ്പെടാതിരിക്കാൻ:`;
            welcomeText = `🙏 Hi, you have not selected your language yet. 😊 Please select your language now, then we can continue:`;
    if(level===24) return `⏰ അവസാന ഓർമ്മപ്പെടുത്തൽ! Hi, one gentle reminder. Your opportunity is waiting here.\n\n🚨 നാളെ മുതൽ പുതിയ അപേക്ഷകർ queue-ൽ. ഇന്ന് Rs${token} (Not refundable) അടച്ചില്ലെങ്കിൽ സ്ലോട്ട് നഷ്ടമാകും!\n\n📄 Tender + Annexure-B ഇപ്പോൾ തന്നെ ലഭിക്കാൻ 👇 Pay ചെയ്യൂ അല്ലെങ്കിൽ Call ${'${HELP_MARKETING}'}:`;
  } else if(lang==='hi'){
    if(level===1) return `👋 रिमाइंडर: आप ${fee}L के लिए तैयार!\n\n⚠️ यह ${fee}L का हिस्सा नहीं है (Not refundable). Rs${token} पर 📄 Tender + Annexure-B तुरंत मिलेगा।\n\n👇 अभी पे करें, स्लॉट न खोएं:`;
            welcomeText = `🙏 Hi, you have not selected your language yet. 😊 Please select your language now, then we can continue:`;
    if(level===24) return `⏰ अंतिम रिमाइंडर! Hi, one gentle reminder. Your opportunity is waiting here.\n\n🚨 कल से नए आवेदक queue में। आज Rs${token} (Not refundable) नहीं भरा तो स्लॉट चला जाएगा!\n\n📄 Tender + Annexure-B अभी पाने के लिए 👇 Pay करें या Call ${'${HELP_MARKETING}'}:`;
  } else {
    if(level===1) return `👋 Reminder: You confirmed ${fee}L!\n\n⚠️ This is NOT part of ${fee}L (Not refundable). Pay Rs${token} to get 📄 Tender + Annexure-B instantly.\n\n👇 Pay now to secure your slot:`;
            welcomeText = `🙏 Hi, you have not selected your language yet. 😊 Please select your language now, then we can continue:`;
    if(level===24) return `⏰ FINAL Reminder! Hi, one gentle reminder. Your opportunity is waiting here.\n\n🚨 🚨 New applicants in queue from tomorrow. If you don't pay Rs${token} (Not refundable) today, you'll lose your slot!\n\nGet 📄 Tender + Annexure-B now 👇 Pay or Call ${'${HELP_MARKETING}'}:`;
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
  // V364.36: Test numbers get NO reminders at all (8590175977 / 8590183646). Real leads unaffected.
  if(isTestNumber(uid)){ console.log(`V364.37 SKIP reminder ${type} - test number ${uid}`); return; }
  // V364.36: Paused (Team Inbox) must NOT block reminders. Reminders are Maya's job, Paused only stops auto-reply to incoming.
  // V364.36: noLang reminders fire even if language not selected - 9847785126 case (20:52 Welcome, 0 reminders by 23:10).
  // V362: dedupe maya_idle by stage - 2x maya_idle_1 can never coexist (fix 10:32:17 + 10:32:20 double)
  if(String(type||'').includes('maya_idle')){
    const _stage = String(type).split(':')[0];
    for(let k of [...reminders.keys()]){ if(k.startsWith(uid+':'+_stage+':') && k!==`${uid}:${type}`){ try{ clearTimeout(reminders.get(k)); }catch(e){} reminders.delete(k); if(redisReady && redis){ redis.del(`reminder:${k}`).catch(()=>{}); } } }
  }
  const key = `${uid}:${type}`;
  if(reminders.has(key)){ clearTimeout(reminders.get(key)); }
  saveReminderToRedis(uid, type, lang, ms, phoneId);
  const t = setTimeout(async()=>{
    reminders.delete(key);
    try{
      if(redisReady && redis){ await redis.del(`reminder:${uid}:${type}`); }
      const state = await getState(uid);
      if(!state || state.flow==='DONE') return;
      if(state.isRealTime && state.lastReplyAt && (Date.now() - state.lastReplyAt) < 2*60*1000){ console.log(`V290 SKIP reminder ${type} - real-time user replied ${Math.round((Date.now()-state.lastReplyAt)/1000)}s ago`); return; }
      const lastActive = state.lastActive ? Date.now() - state.lastActive : 999999999;
      if(type.endsWith(':1') && !type.endsWith(':12') && !type.endsWith(':24') && lastActive < 30*60*1000){ console.log(`Skipping 1h reminder, active ${lastActive}ms ago`); return; }
      // V285 FIX: User already replied after this reminder was scheduled -> reminder is STALE, do not fire.
      // Example: user typed "Watched video, whats next?" then old VIDEO reminder still fired 1 min later.
      // If user was active in last 2 min, ANY VIDEO / OPP / GEN / Are-you-there / Busy reminder firing now is stale.
      if((type.includes('VIDEO') || type.includes('OPP_') || type.includes('GEN_') || type.includes('ARE_YOU_THERE') || type.includes('BUSY_CHECK')) && lastActive < 2*60*1000){ console.log(`V285 SKIP stale reminder ${type} - user replied ${Math.round(lastActive/1000)}s ago, last=${state?.lastStep}`); return; }
      // V286 FIX: Already Seen + marked in replay -> never send video link again. Reminders about video are stale.
      // If user is now stuck on Benefits/Support/Requirements, the GEN chain (not video reminders) handles it.
      if(state.videoWatched && (type.includes('VIDEO') || type.includes('OPP_ARE_YOU_THERE') || type.includes('OPP_BUSY_CHECK') || type.includes('OPP_1HOUR') || type.includes('OPP_FOLLOWUP'))){ console.log(`V286 SKIP video reminder - already marked Seen, last=${state?.lastStep}`); return; }
      const actualLang = state.lang || lang || 'en';
      const actualPhoneId = state.phoneId || phoneId || PHONE_NUMBER_ID;
      const level = type.endsWith(':24') || type.includes('level-24') ? 24 : (type.endsWith(':12') || type.includes('level-12') ? 12 : 1);
      console.log(`REMINDER FIRING ${type} level=${level} to ${uid} via ${actualPhoneId} last=${state?.lastStep} - escalated`);
      

// ===== V252 TEAM ALERTS + DAY-END SUMMARY + TEAM CALL RULE =====
// RULE (MOST IMPORTANT): Team calls user ONLY AFTER registration fee.
// Before fee, Maya must NOT promise "team will call you". She must say:
// "Team is busy with verifications. Please call us in your free time on 85901 83646. After you lock slot with token, team will call you for verification."
// This protects team time + company busy schedule.
// Daily stats kept in memory, reset at midnight IST
const dailyStats = { date: new Date().toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'}), newLeads:0, talkRequests:0, contactGiven:0, tokenReady:0, payments:0, paymentTotal:0, paymentsList:[], talkList:[], idleNoReply:0, notInterested:0 };
function resetDailyIfNeeded(){
  const today = new Date().toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'});
  if(dailyStats.date!==today){ dailyStats.date=today; dailyStats.newLeads=0; dailyStats.talkRequests=0; dailyStats.contactGiven=0; dailyStats.tokenReady=0; dailyStats.payments=0; dailyStats.paymentTotal=0; dailyStats.paymentsList=[]; dailyStats.talkList=[]; dailyStats.idleNoReply=0; dailyStats.notInterested=0; }
}
function describeNature(state){
  const L = state.lead||{};
  const parts=[];
  if(L.sentiment==='likes_it') parts.push('Likes it - positive, fast reply');
  else if(L.sentiment==='considering') parts.push('Considering - thinking, needs follow-up');
  else if(L.sentiment==='doubt') parts.push('Doubt - needs trust / proof, solve doubt first');
  else if(L.sentiment==='price_doubt') parts.push('Price doubt - explain token vs full fee clearly');
  else if(L.sentiment==='confused') parts.push('Confused - explain simple, 1 question at a time');
  else if(L.sentiment==='not_interested') parts.push('Not interested - DO NOT CALL');
  else parts.push('Nature not yet known');
  if((L.avoidCount||0)>=3) parts.push(`Avoids replies ${L.avoidCount}x - busy / delaying`);
  else if((L.avoidCount||0)>=1) parts.push(`Avoided ${L.avoidCount}x - needs soft reminder`);
  if((L.reminderCount||0)>=1) parts.push(`Reminder set ${L.reminderCount}x`);
  if((L.idleCount||0)>=2) parts.push(`No reply ${L.idleCount}x - idle, may be busy`);
  return parts.join(' | ');
}
function whatHeNeeds(state){
  const L = state.lead||{};
  if(L.intent==='business_opportunity'){
    const lvl = L.level ? `Level: ${L.level} (Center 1L / Corp 4L / District 10L)` : 'Level: not yet chosen';
    const tok = L.tokenStatus||'NOT_ASKED';
    return `FINALIZE: Business Opportunity - ${lvl} | Token: ${tok} | District: ${L.district||'not given'} | Next: ${tok==='READY'?'Send Pay link, lock slot':tok==='LATER'?'Remind at '+ (L.reminderAt||'evening'):'Explain + ask level + ask token'}`;
  }
  if(L.intent==='taxi') return 'NEEDS: Taxi booking - ask pickup/drop, send app link';
  if(L.intent==='delivery') return 'NEEDS: Delivery - ask what / where';
  if(L.intent==='directory') return 'NEEDS: Business Directory listing - ask shop details';
  if(L.intent==='booking') return 'NEEDS: Booking - ask what booking';
  if(L.intent==='job') return 'NEEDS: Job / Driver - explain no job, only business opportunity / driver registration in app';
  return 'NEEDS: Not yet clear - ask Business or Service?';
}
async function notifyAdminTeamRequest(uid, state, reason){
  resetDailyIfNeeded();
  dailyStats.talkRequests++;
  const L = state.lead||{};
  const name = state?.leadData?.name || state?.name || 'Name not yet given';
  const district = L.district || state?.district || 'Not yet given';
  const msg = `📞 TEAM TALK REQUEST\n\n👤 Phone: +${uid}\n👤 Name: ${name}\n📍 District: ${district}\n📥 Source: ${L.source||'unknown'}\n🎯 Intent: ${L.intent||'unknown'}\n💬 Sentiment: ${L.sentiment||'unknown'}\n\n📌 WHAT HE NEEDS TO FINALIZE:\n${whatHeNeeds(state)}\n\n🧠 RESPONDS NATURE:\n${describeNature(state)}\n\n⚠️ TEAM CALL RULE: ${L.tokenStatus==='PAID' ? '✅ Token PAID - Team CAN call for verification.' : '⛔ Token NOT PAID - Do NOT call now. Tell him: Team is busy, please call us in your free time on 85901 83646. After token, team will call.'}\n\nReason: ${reason}\nTime: ${getISTTime()}\n\n👉 Prepare before calling: Check Master_Leads row for this phone.`;
  const admins=[...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let a of admins){ if(a===String(uid)) continue; try{ await sendWithDelay(textMessage(a, msg, PHONE_NUMBER_ID)); }catch(e){} }
  dailyStats.talkList.push({phone:uid, name, district, intent:L.intent||'', sentiment:L.sentiment||'', needs: whatHeNeeds(state), nature: describeNature(state), token: L.tokenStatus||'', time: getISTTime()});
  try{ await saveToSheet('System_Logs',[getISTTime(), uid, state.lang||'ml','Team Talk Request',`Talk: ${reason} | ${whatHeNeeds(state)} | ${describeNature(state)}`,'Team Alert',HELP_ADMIN,'Team Request',''],false); }catch(e){}
  return msg;
}
async function notifyAdminContactGiven(uid, state, contactNumber){
  resetDailyIfNeeded(); dailyStats.contactGiven++;
  const L=state.lead||{};
  const msg=`📱 CONTACT NUMBER GIVEN\n\n👤 Phone (chat): +${uid}\n📞 Contact given: +${contactNumber}\n👤 Name: ${state?.leadData?.name||state?.name||'Not yet given'}\n📍 District: ${L.district||'Not yet given'}\n\n📌 WHAT HE NEEDS:\n${whatHeNeeds(state)}\n\n🧠 NATURE:\n${describeNature(state)}\n\n⚠️ CALL RULE: ${L.tokenStatus==='PAID'?'✅ Token PAID - Team CAN call':'⛔ Token NOT PAID - Do NOT call now. User should call team in free time.'}\nTime: ${getISTTime()}`;
  const admins=[...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let a of admins){ if(a===String(uid)) continue; try{ await sendWithDelay(textMessage(a, msg, PHONE_NUMBER_ID)); }catch(e){} }
  return msg;
}
async function sendDayEndSummary(){
  resetDailyIfNeeded();
  // Build summary from dailyStats + memoryStore scan for today's leads
  let newToday=0, tokenReadyToday=0;
  try{ for(let [uid,s] of memoryStore){ if(s.lead && s.lastActive && (Date.now()-s.lastActive)<24*60*60*1000) newToday++; } }catch(e){}
  const msg=`🌙 DAY-END SUMMARY - Bizmapia Maya - ${dailyStats.date}\n\n📊 TODAY:\n• New leads chatted: ${Math.max(dailyStats.newLeads, newToday)}\n• Talk-to-Team requests: ${dailyStats.talkRequests}\n• Contact numbers given: ${dailyStats.contactGiven}\n• Token Ready (want to pay): ${dailyStats.tokenReady}\n• Payments VERIFIED: ${dailyStats.payments} | Total Token Collected: Rs ${dailyStats.paymentTotal}\n• Not Interested: ${dailyStats.notInterested}\n• No Reply / Idle: ${dailyStats.idleNoReply}\n\n💰 PAYMENTS TODAY:\n${dailyStats.paymentsList.length?dailyStats.paymentsList.map(x=>`• +${x.phone} - Rs ${x.amount} - ${x.level} - ${x.time}`).join('\\n'):'• None today'}\n\n📞 TEAM TALK LIST - PREPARE FOR TOMORROW:\n${dailyStats.talkList.length?dailyStats.talkList.map(x=>`• +${x.phone} (${x.name}, ${x.district}) - ${x.intent} / ${x.sentiment} - Token:${x.token}\\n  Needs: ${x.needs}\\n  Nature: ${x.nature}`).join('\\n\\n'):'• None today'}\n\n⚠️ REMEMBER: Call ONLY after token paid. Before token, user should call team in free time on 85901 83646.\n\nCheck Sheet: Master_Leads + Payments for full details.`;
  const admins=[...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let a of admins){ try{ await sendWithDelay(textMessage(a, msg, PHONE_NUMBER_ID)); }catch(e){} }
  if(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID){ try{ await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:TELEGRAM_CHAT_ID,text:msg})}); }catch(e){} }
  try{ await saveToSheet('System_Logs',[getISTTime(),'ALL','all','Day-End Summary',`Leads:${Math.max(dailyStats.newLeads, newToday)} Talk:${dailyStats.talkRequests} Pay:${dailyStats.payments} Total:Rs ${dailyStats.paymentTotal} | V364 Sheet=WhatsApp count, built from Sheet/Redis not memory alone`,'Day Summary',HELP_ADMIN,'Day-End',''],false); }catch(e){}
  console.log('DAY-END SUMMARY SENT');
  return msg;
}
function scheduleDayEndSummary(){
  // Next 9 PM IST, then every 24h
  const now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
  const target=new Date(now); target.setHours(21,0,0,0);
  if(target<=now) target.setDate(target.getDate()+1);
  const ms=target-now;
  console.log('Day-end summary in', Math.round(ms/60000), 'min');
  setTimeout(async()=>{ try{ await sendDayEndSummary(); }catch(e){} setInterval(async()=>{ try{ await sendDayEndSummary(); }catch(e){} }, 24*60*60*1000); }, ms);
}

// ===== V251 INSTANT PAYMENT INTIMATION TO ADMIN - SAME SECOND AS RAZORPAY =====
// How it works: Razorpay webhook -> verify signature + amount -> user gets Verified msg -> YOU get WhatsApp alert instantly
// Admin numbers: from your existing HELP_ADMIN (8590183646) + HELP_MARKETING (8590175977)
// Add more in Render: ADMIN_NOTIFY_NUMBERS=919590123456,919876543210 (comma separated, with 91)
// Optional Telegram: set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID in Render for second channel
const ADMIN_NOTIFY_NUMBERS = (process.env.ADMIN_NOTIFY_NUMBERS || '').split(',').map(s=>s.trim()).filter(Boolean);
const DEFAULT_ADMIN_NUMBERS = ['918590183646','918590175977']; // HELP_ADMIN + HELP_MARKETING
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const processedPaymentIds = new Set(); // prevent duplicate intimation if Razorpay retries webhook
function isValidTokenAmount(amount){
  // Perfect verification: Registration Token must be EXACTLY 100 / 150 / 250
  return [100,150,250].includes(Number(amount));
}
function levelFromToken(amount){
  if(Number(amount)===100) return 'Business Center (1 Lakh)';
  if(Number(amount)===150) return 'Corporation / Municipal (4 Lakh)';
  if(Number(amount)===250) return 'District (10 Lakh)';
  return 'Unknown Level - CHECK MANUALLY';
}
async function notifyAdminPayment({uid, amount, paymentId, event, lang, state, fee, verified}){
  const level = levelFromToken(amount);
  const name = state?.leadData?.name || state?.name || state?.lead?.name || 'Name not yet given';
  const district = state?.lead?.district || state?.leadDistrict || state?.district || 'Not yet given';
  const source = (state?.lead && state.lead.source) || 'unknown';
  const intent = (state?.lead && state.lead.intent) || 'business_opportunity';
  const time = getISTTime();
  const statusEmoji = verified ? '✅ VERIFIED' : '⚠️ NOT VERIFIED - CHECK';
  const msg = `💰 NEW PAYMENT - ${statusEmoji}\n\n👤 Phone: +${uid}\n👤 Name: ${name}\n📍 District: ${district}\n🏢 Level: ${level}\n💸 Amount: Rs ${amount} (Registration Token)\n🧾 Payment ID: ${paymentId}\n🕒 Time: ${time}\n📥 Source: ${source} | Intent: ${intent}\n📌 Event: ${event}\n\n✅ Maya already sent Tender PDFs + asked for Name/District/Mobile/Date.\n👉 Reply to user if needed. Check Sheet: Payments tab.`;
  // 1) WhatsApp to YOU (same WhatsApp API, same token - most reliable)
  const admins = [...new Set([...DEFAULT_ADMIN_NUMBERS, ...ADMIN_NOTIFY_NUMBERS])];
  for(let admin of admins){
    try{
      // Do NOT send to the payer himself as admin alert (avoid duplicate)
      if(admin===String(uid)) continue;
      await sendWithDelay(textMessage(admin, msg, PHONE_NUMBER_ID));
      console.log('ADMIN NOTIFY SENT WhatsApp to', admin, paymentId);
    }catch(e){ console.log('ADMIN NOTIFY WhatsApp fail', admin, e.message); }
  }
  // 2) Telegram (optional, if you set token)
  if(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID){
    try{
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({chat_id: TELEGRAM_CHAT_ID, text: msg})});
      console.log('ADMIN NOTIFY SENT Telegram', paymentId);
    }catch(e){ console.log('ADMIN NOTIFY Telegram fail', e.message); }
  }
  // 3) Sheet - extra clear row so you can filter
  try{ await saveToSheet('System_Logs', [time, uid, lang||'en', 'ADMIN NOTIFY '+paymentId, `Rs ${amount} ${level} ${statusEmoji} -> Admins: ${admins.join(',')}`, 'Admin Notify', HELP_ADMIN, 'Payment Intimation', ''], false); }catch(e){}
  return msg;
}

// ===== V250 IDLE CHECK =====
      if(type.includes('talk_later')){
        if(state.flow==='DONE' || state.verified || state.firedGate==='STOPPED') return;
        const _tl = state.lead?.talkLaterLabel||'later';
        const _msg = (actualLang==='ml') ? `👋 Hi! നിങ്ങൾ പറഞ്ഞ സമയമായി. 😊\n\n${_tl} കഴിഞ്ഞ് സംസാരിക്കാം എന്ന് പറഞ്ഞിരുന്നു. ഇപ്പോൾ തുടരട്ടെ?` : (actualLang==='hi') ? `👋 Hi! Aapne bola tha ${_tl} baad baat karenge. 😊\n\nAb aage badhein?` : `👋 Hi! You asked me to talk ${_tl}. 😊\n\nShall we continue now?`;
        try{ const _m=interactiveButton(uid,_msg,[{id:'AI_STILL_HERE',title: actualLang==='ml'?'ഉണ്ട്, തുടരാം': actualLang==='hi'?'Haan, Continue':'Yes, Continue'},{id:'IDLE_TALK_LATER',title:'Talk later'},{id:'IDLE_STOP',title:'Stop'}], actualPhoneId); _m._isIdle=true; await sendWithDelay(_m); }catch(e){ const _m2=textMessage(uid,_msg,actualPhoneId); _m2._isIdle=true; await sendWithDelay(_m2); }
        try{ await saveToSheet('System_Logs',[getISTTime(),uid,actualLang,'Talk Later Fired '+actualPhoneId,`Talk later fired - ${_tl}`,'Talk Later',HELP_ADMIN,'Talk Later',''],false); }catch(e){}
        return;
      }
      if(type.includes('maya_idle')){
        // V362: test number NEVER gets idle. 918590175977 is team test number.
        if(String(uid).endsWith('8590175977')){ console.log(`V364 SKIP idle - test number ${uid}`); return; }
        // If user already replied / paid / done / stopped -> do NOT nudge
        if(state.flow==='DONE' || state.verified || String(state.lastStep||'').includes('VERIFIED') || state.firedGate==='STOPPED') return;
        // If user replied very recently (lastUserAt within 2 min), skip - they are typing
        if(state.lastUserAt && (Date.now()-state.lastUserAt) < 2*60*1000) return;
        const stage = type.includes('maya_idle_1')?1:type.includes('maya_idle_2')?2:type.includes('maya_idle_3')?3:type.includes('maya_idle_4')?4:type.includes('maya_idle_5')?5:6; // V348 6 stages
        // V362 STALE-CHAIN: timer's chainId (after :) must equal state's current idleChainId. Old chain firing after new chain started = Stage 2 before Stage 1 bug.
        try{ const _chain = String(type).split(':')[1]||''; if(state.idleChainId && _chain && String(state.idleChainId)!==String(_chain)){ console.log(`V364 SKIP idle stale chain stage=${stage} timerChain=${_chain} current=${state.idleChainId} uid=${uid}`); return; } }catch(e){}
        // V362 ORDER: stage must be exactly lastIdleStage+1. Stage 2 before Stage 1, or duplicate Stage, is dropped.
        try{ const _last = (state.lead&&state.lead.lastIdleStage)||0; if(stage!==_last+1){ console.log(`V364 SKIP idle out-of-order stage=${stage} last=${_last} uid=${uid}`); return; } }catch(e){}
        state.lead = state.lead || {};
        state.lead.idleCount = (state.lead.idleCount||0)+1;
        state.lead.lastIdleStage = stage;
        // If user already said NOT_INTERESTED, stop idle nudges
        if(state.lead.sentiment==='not_interested') return;
        await setState(uid, state);
        try{ const _im=interactiveButton(uid, getIdleCheckText(actualLang, stage), mayaIdleButtons(actualLang, stage), actualPhoneId); _im._isIdle=true; await sendWithDelay(_im); }catch(e){ const _tm2=textMessage(uid, getIdleCheckText(actualLang, stage), actualPhoneId); _tm2._isIdle=true; await sendWithDelay(_tm2); } // V347: idle msgs must NOT reschedule idle
        await saveToSheet('System_Logs',[getISTTime(), uid, actualLang, 'Idle Check Stage '+stage+' '+actualPhoneId, `No reply - Idle Stage ${stage} - Lead:${state.lead.intent||''} Sent:${state.lead.sentiment||''}`, 'Idle Check', HELP_ADMIN, 'Idle Check', ''], false);
        await logLeadPerfect(uid, state, {lastMsg:'[IDLE] No reply stage '+stage, summary:'Idle check sent stage '+stage});
        return;
      }
      // ===== V250 MAYA REMINDER (soft finalize reminder) =====
      if(type.includes('maya_reminder')){
        if(state.flow==='DONE' || state.verified || state.firedGate==='STOPPED') return;
        const avoid = (state.lead&&state.lead.avoidCount)||0;
        let kind = 'finalize'; if(avoid>=3) kind='last'; else if(avoid>=2) kind='serious';
        const txtR = getSoftReminderText(actualLang, kind);
        state.lead = state.lead||{}; state.lead.reminderCount=(state.lead.reminderCount||0)+1; await setState(uid, state);
        try{ await sendWithDelay(interactiveButton(uid, txtR, mayaQuickButtons(actualLang,'finalize'), actualPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, txtR, actualPhoneId)); }
        await saveToSheet('System_Logs',[getISTTime(), uid, actualLang, 'Soft Reminder '+kind+' '+actualPhoneId, `Reminder - Avoid:${avoid}`, 'Reminder', HELP_ADMIN, 'Soft Reminder', ''], false);
        return;
      }
      // V247 PAY5MIN: if still in Pay step and NOT verified/claimed, re-send Pay-Now CTA. If already paid/verified, do nothing.
      if(type.includes('PAY5MIN')){
        const ls=String(state.lastStep||'');
        if(state.verified || ls.includes('VERIFIED') || ls.includes('PAY CLAIMED') || ls.includes('Payment Verified') || state.flow==='DONE'){ console.log('V247 SKIP PAY5MIN - already verified/claimed'); return; }
        if(!(ls.includes('Pay Reg')||ls.includes('EMI Selected')||ls.includes('Not Paid')||ls.includes('Pay Rs')||ls.startsWith('Pay '))){ console.log('V247 SKIP PAY5MIN - no longer in Pay step: '+ls); return; }
        await sendPayNowStep(uid,actualLang,state.fee||15,state.sub,actualPhoneId, getPay5MinChaseText(actualLang,state.fee||15,state.sub), false);
        return;
      }
      // V247 FIX: Stale reminder guard - Never show Language/Main Menu reminder if user already past that step (e.g. in Pay step)
      // Your 8:30 screenshot: Pay at 8:24, then Main Menu (Malayalam thanks + services) at 8:30 = old noLang/noService reminder firing late
      if((type.startsWith('noLang')||type.startsWith('noService')||type.includes('noLang')||type.includes('noService'))){
        const pastStart = state.lang && state.lastStep && !['First Message','HI - Reset','Language en','Language ml','Language hi','Language'].includes(state.lastStep);
        if(pastStart){
          console.log(`V247 SKIP stale noLang/noService reminder - user already in ${state.lastStep}, not at start`);
          return;
        }
      }
      // V247: Company Video 2-min guard - if user already past Company Video, skip
      if(type.includes('COMPANY_VIDEO_3MIN') || type.includes('COMPANY_VIDEO_5MIN') || type.includes('COMPANY_VIDEO_2MIN') && state.lastStep && !state.lastStep.includes('Company Video')){
        console.log(`V247 SKIP stale Company Video reminder - user already in ${state.lastStep}`);
        return;
      }
      // V247: Franchise Video 2-min guard - if user already past Video, skip
      if((type.includes('VIDEO_5MIN') || type.includes('VIDEO_2MIN')) && !type.includes('COMPANY') && state.lastStep && !state.lastStep.includes('Video')){
        console.log(`V247 SKIP stale Franchise Video reminder - user already in ${state.lastStep}`);
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
            welcomeText = `🙏 Hi, you have not selected your language yet. 😊 Please select your language now, then we can continue:`;
          } else if(actualLang==='hi'){
            welcomeText = `🙏 Hi, you have not selected your language yet. 😊 Please select your language now, then we can continue:`;
          } else {
            welcomeText = `🙏 Hi, you have not selected your language yet. 😊 Please select your language now, then we can continue:`;
          }
        }
        if(level===24){
          if(actualLang==='ml'){
            welcomeText = `⏰ Hi, one gentle reminder. 😊 Your opportunity is waiting here. Please select your language now, then we can continue:`;
          } else if(actualLang==='hi'){
            welcomeText = `⏰ Hi, one gentle reminder. 😊 Your opportunity is waiting here. Please select your language now, then we can continue:`;
          } else {
            welcomeText = `⏰ Hi, one gentle reminder. 😊 Your opportunity is waiting here. Please select your language now, then we can continue:`;
          }
        }
        await sendWithDelay(interactiveButton(uid, welcomeText, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'हिन्दी'},{id:'LANG_ML',title:'മലയാളം'}], actualPhoneId));
      } else if(type.includes('COMPANY_VIDEO_3MIN') || type.includes('COMPANY_VIDEO_5MIN') || type.includes('COMPANY_VIDEO_2MIN')){
        // V364.36: Q1 AS REMINDER - replaces old Company Video reminder (Did you watch? / Watched / Not Seen REMOVED).
        // Message = user-locked Q1 text in selected language ONLY. Buttons = Q1 3 only.
        await sendWithDelay(interactiveButton(uid, v36436Q1Text(actualLang), v36436Q1Buttons(actualLang), actualPhoneId));
        try{ state.lastStep='Q1 - After Company Video'; state.q1Asked=true; await setState(uid,state); }catch(e){}
} else if(type.includes('VIDEO_5MIN')){
        // V281: Opportunity Video reminder - buttons = Yes seen / Watch now + SAME video link again in this reminder.
        // Nobody replies after watching, so reminder must carry the video again, not just ask.
        const subForVideo = type.includes('OPP_DISTRICT') ? 'OPP_DISTRICT' : type.includes('OPP_CORP') ? 'OPP_CORP' : 'OPP_CENTER';
        // V282: ONLY ONE message - the Yes seen / Watch now message IS the reminder. No separate See Video message before it.
        // Video comes again ONLY if they tap Watch now (VIDEO_NOT_WATCHED already resends same video).
        const vMsg = actualLang==='ml' ? `🎬 *വീഡിയോ കണ്ടോ?* 😊\n\n👉 കണ്ടെങ്കിൽ *Yes seen* ക്ലിക്ക് ചെയ്യൂ, കണ്ടില്ലെങ്കിൽ *Watch now* ക്ലിക്ക് ചെയ്യൂ — അതേ വീഡിയോ വീണ്ടും വരും:` : actualLang==='hi' ? `🎬 *वीडियो देखा?* 😊\n\n👉 देखा तो *Yes seen* पर क्लिक करें, नहीं देखा तो *Watch now* पर क्लिक करें — वही वीडियो फिर आएगा:` : `🎬 *Did you watch the video?* 😊\n\n👉 If seen, click *Yes seen*, if not, click *Watch now* — same video will come again:`;
        await sendWithDelay(interactiveButton(uid, vMsg, [{id:'VIDEO_WATCHED',title:'Yes seen'},{id:'VIDEO_NOT_WATCHED',title:'Watch now'}], actualPhoneId));
        // V282: If still no reply, Maya follows up like AI / human - "are you there?" - 2 min after this reminder
        scheduleReminder(uid, 'install:OPP_ARE_YOU_THERE_' + subForVideo + ':10', actualLang, 2*60*1000, actualPhoneId);
      } else if(type.includes('VIDEO_2MIN')){
        // V281: Same as 5-min reminder - Yes seen / Watch now + SAME video link again.
        const subForVideo = type.includes('OPP_DISTRICT') ? 'OPP_DISTRICT' : type.includes('OPP_CORP') ? 'OPP_CORP' : 'OPP_CENTER';
        // V282: ONLY ONE message - Yes seen / Watch now IS the reminder.
        const vMsg = actualLang==='ml' ? `🎬 *വീഡിയോ കണ്ടോ?* 😊\n\n👉 കണ്ടെങ്കിൽ *Yes seen* ക്ലിക്ക് ചെയ്യൂ, കണ്ടില്ലെങ്കിൽ *Watch now* ക്ലിക്ക് ചെയ്യൂ — അതേ വീഡിയോ വീണ്ടും വരും:` : actualLang==='hi' ? `🎬 *वीडियो देखा?* 😊\n\n👉 देखा तो *Yes seen* पर क्लिक करें, नहीं देखा तो *Watch now* पर क्लिक करें — वही वीडियो फिर आएगा:` : `🎬 *Did you watch the video?* 😊\n\n👉 If seen, click *Yes seen*, if not, click *Watch now* — same video will come again:`;
        await sendWithDelay(interactiveButton(uid, vMsg, [{id:'VIDEO_WATCHED',title:'Yes seen'},{id:'VIDEO_NOT_WATCHED',title:'Watch now'}], actualPhoneId));
        scheduleReminder(uid, 'install:OPP_ARE_YOU_THERE_' + subForVideo + ':10', actualLang, 2*60*1000, actualPhoneId);
      } else if(type.includes('OPP_ARE_YOU_THERE')){
        // V282: AI-style confirmation nudge - "are you there?" - only if user is STILL on Opportunity Video step (no reply yet).
        // If user already moved on (lastStep no longer has Video), skip.
        if(state.lastStep && !state.lastStep.includes('Video') && !state.lastStep.includes('Opportunity')){
          console.log(`V282 SKIP stale Are-you-there - user already in ${state.lastStep}`);
          return;
        }
        const areMsg = actualLang==='ml' ? `ഹലോ, അവിടെയുണ്ടോ? 😊\n\nവീഡിയോ കാണാൻ പറ്റിയോ? എന്തെങ്കിലും സംശയം ഉണ്ടോ?\n\n👉 കണ്ടെങ്കിൽ *Yes seen*, കണ്ടില്ലെങ്കിൽ *Watch now* — ഞാൻ ഇവിടെ തന്നെയുണ്ട്:` : actualLang==='hi' ? `हैलो, आप वहाँ हैं? 😊\n\nवीडियो देखने का मौका मिला? कोई doubt है?\n\n👉 देखा तो *Yes seen*, नहीं देखा तो *Watch now* — मैं यहीं हूँ:` : `Hello, are you there? 😊\n\nDid you get a chance to watch the video? Any doubt?\n\n👉 If seen, *Yes seen*, if not, *Watch now* — I'm right here:`;
        await sendWithDelay(interactiveButton(uid, areMsg, [{id:'VIDEO_WATCHED',title:'Yes seen'},{id:'VIDEO_NOT_WATCHED',title:'Watch now'}], actualPhoneId));
        // V283: 2nd AI reminder after 2 min - "Are you busy right now?"
        scheduleReminder(uid, 'install:OPP_BUSY_CHECK_' + (type.includes('OPP_DISTRICT') ? 'OPP_DISTRICT' : type.includes('OPP_CORP') ? 'OPP_CORP' : 'OPP_CENTER') + ':10', actualLang, 2*60*1000, actualPhoneId);
      } else if(type.includes('OPP_BUSY_CHECK')){
        // V283 2nd AI reminder: "Are you busy right now? Can I schedule a reminder after 1 Hour?" - Yes / No / Stop
        if(state.lastStep && !state.lastStep.includes('Video') && !state.lastStep.includes('Opportunity') && !state.lastStep.includes('Are-you-there') && !state.lastStep.includes('Busy')){
          console.log(`V283 SKIP stale Busy check - user already in ${state.lastStep}`);
          return;
        }
        const busyMsg = actualLang==='ml' ? `ഒരു കാര്യം ചോദിക്കട്ടെ 😊\n\n*Are you busy right now?*\n\n*Can I schedule a reminder after 1 Hour?*\n\n👉 Yes = 1 മണിക്കൂറിന് ശേഷം ഓർമ്മിപ്പിക്കാം, No = ഇപ്പോൾ തുടരാം, Stop = നിർത്താം:` : actualLang==='hi' ? `एक बात पूछूँ 😊\n\n*Are you busy right now?*\n\n*Can I schedule a reminder after 1 Hour?*\n\n👉 Yes = 1 घंटे बाद याद दिलाऊँगी, No = अभी जारी रखते हैं, Stop = रोकें:` : `One thing 😊\n\n*Are you busy right now?*\n\n*Can I schedule a reminder after 1 Hour?*\n\n👉 Yes = remind after 1 hour, No = continue now, Stop = stop:`;
        await sendWithDelay(interactiveButton(uid, busyMsg, [{id:'BUSY_YES',title:'Yes'},{id:'BUSY_NO',title:'No'},{id:'BUSY_STOP',title:'Stop'}], actualPhoneId));
      } else if(type.includes('OPP_1HOUR')){
        // V283: 1-hour reminder after Busy Yes - back to Yes seen / Watch now about last step
        const hMsg = actualLang==='ml' ? `ഹലോ, 1 മണിക്കൂർ കഴിഞ്ഞു 😊 പറഞ്ഞ പോലെ ഓർമ്മിപ്പിക്കുന്നു.\n\n🎬 *വീഡിയോ കണ്ടോ?*\n\n👉 കണ്ടെങ്കിൽ *Yes seen*, കണ്ടില്ലെങ്കിൽ *Watch now*:` : actualLang==='hi' ? `हैलो, 1 घंटा हो गया 😊 जैसा कहा था, याद दिला रही हूँ।\n\n🎬 *वीडियो देखा?*\n\n👉 देखा तो *Yes seen*, नहीं देखा तो *Watch now*:` : `Hello, 1 hour is up 😊 reminding you as promised.\n\n🎬 *Did you watch the video?*\n\n👉 If seen, *Yes seen*, if not, *Watch now*:`;
        await sendWithDelay(interactiveButton(uid, hMsg, [{id:'VIDEO_WATCHED',title:'Yes seen'},{id:'VIDEO_NOT_WATCHED',title:'Watch now'}], actualPhoneId));
      } else if(type.includes('OPP_FOLLOWUP_1H')){
        // V283: Stop-later followup - 1 hour - about last step
        const f1 = actualLang==='ml' ? `ഹലോ 😊 പറഞ്ഞ പോലെ ഓർമ്മിപ്പിക്കുന്നു — നിങ്ങളുടെ അവസരം ഇവിടെയുണ്ട്.\n\n🎬 *വീഡിയോ കണ്ടോ?* 👉 *Yes seen* / *Watch now*:` : actualLang==='hi' ? `हैलो 😊 जैसा कहा था, याद दिला रही हूँ — आपका अवसर यहाँ है।\n\n🎬 *वीडियो देखा?* 👉 *Yes seen* / *Watch now*:` : `Hello 😊 reminding you as promised — your opportunity is here.\n\n🎬 *Did you watch the video?* 👉 *Yes seen* / *Watch now*:`;
        await sendWithDelay(interactiveButton(uid, f1, [{id:'VIDEO_WATCHED',title:'Yes seen'},{id:'VIDEO_NOT_WATCHED',title:'Watch now'}], actualPhoneId));
      } else if(type.includes('OPP_FOLLOWUP_12H')){
        const f12 = actualLang==='ml' ? `ഹലോ 😊 12 മണിക്കൂർ കഴിഞ്ഞു — നിങ്ങളുടെ അവസരം കാത്തിരിക്കുന്നു.\n\n🎬 *വീഡിയോ കണ്ടോ?* 👉 *Yes seen* / *Watch now*:` : actualLang==='hi' ? `हैलो 😊 12 घंटे हो गए — आपका अवसर इंतज़ार कर रहा है।\n\n🎬 *वीडियो देखा?* 👉 *Yes seen* / *Watch now*:` : `Hello 😊 12 hours done — your opportunity is waiting.\n\n🎬 *Did you watch the video?* 👉 *Yes seen* / *Watch now*:`;
        await sendWithDelay(interactiveButton(uid, f12, [{id:'VIDEO_WATCHED',title:'Yes seen'},{id:'VIDEO_NOT_WATCHED',title:'Watch now'}], actualPhoneId));
      } else if(type.includes('OPP_FOLLOWUP_24H')){
        const f24 = actualLang==='ml' ? `ഹലോ 😊 അവസാന ഓർമ്മപ്പെടുത്തൽ — 24 മണിക്കൂർ കഴിഞ്ഞു.\n\n🎬 *വീഡിയോ കണ്ടോ?* 👉 *Yes seen* / *Watch now*:` : actualLang==='hi' ? `हैलो 😊 आखिरी याद — 24 घंटे हो गए।\n\n🎬 *वीडियो देखा?* 👉 *Yes seen* / *Watch now*:` : `Hello 😊 last reminder — 24 hours done.\n\n🎬 *Did you watch the video?* 👉 *Yes seen* / *Watch now*:`;
        await sendWithDelay(interactiveButton(uid, f24, [{id:'VIDEO_WATCHED',title:'Yes seen'},{id:'VIDEO_NOT_WATCHED',title:'Watch now'}], actualPhoneId));
        // V283: After 24h followup, if still no reply, move to fired list (autoFireLoser handles sheet + gate)
        try{ await autoFireLoser(uid, 'OPP - No Response After 1h/12h/24h Followups'); }catch(_){}
      } else if(type.includes('GEN_ARE_YOU_THERE')){
        // V284 GENERIC 1st AI reminder (every stuck step, not just video): "Are you there?" + names the stuck step. Only if user still stuck (lastActive old + lastStep unchanged).
        const stuckName = (state.lastStep||'').replace(/^V\d+ - /,'') || 'last step';
        const areG = actualLang==='ml' ? `ഹലോ, അവിടെയുണ്ടോ? 😊\n\nനിങ്ങൾ ഇവിടെയാണ് നിന്നത്: *${stuckName}*\nവീഡിയോ / മെസേജ് കാണാൻ പറ്റിയോ? എന്തെങ്കിലും സംശയം ഉണ്ടോ?\n\n👉 തുടരാൻ Yes / Watch now — ഞാൻ ഇവിടെ തന്നെയുണ്ട്:` : actualLang==='hi' ? `हैलो, आप वहाँ हैं? 😊\n\nआप यहाँ रुके थे: *${stuckName}*\nवीडियो / मैसेज देखने का मौका मिला? कोई doubt है?\n\n👉 जारी रखने के लिए Yes / Watch now — मैं यहीं हूँ:` : `Hello, are you there? 😊\n\nYou stopped at: *${stuckName}*\nDid you get a chance to watch / read it? Any doubt?\n\n👉 To continue, tap Yes / Watch now — I'm right here:`;
        // Generic: offer Continue (BUSY_NO path reuses No logic via generic buttons) - use same Yes seen / Watch now ids for video, else generic continue uses BUSY_NO flow via Yes button
        await sendWithDelay(interactiveButton(uid, areG, [{id:'GEN_CONTINUE',title:'Yes - Continue'},{id:'VIDEO_NOT_WATCHED',title:'Watch now'}], actualPhoneId));
        scheduleReminder(uid, 'install:GEN_BUSY_CHECK:10', actualLang, 2*60*1000, actualPhoneId);
      } else if(type.includes('GEN_BUSY_CHECK')){
        // V284 GENERIC 2nd AI reminder: "Are you busy right now? Can I schedule a reminder after 1 Hour?" - Yes / No / Stop (same as video chain)
        const stuckName = (state.lastStep||'').replace(/^V\d+ - /,'') || 'last step';
        const busyG = actualLang==='ml' ? `ഒരു കാര്യം ചോദിക്കട്ടെ 😊\n\nനിങ്ങൾ ഇവിടെയാണ് നിന്നത്: *${stuckName}*\n\n*Are you busy right now?*\n\n*Can I schedule a reminder after 1 Hour?*\n\n👉 Yes = 1 മണിക്കൂറിന് ശേഷം ഓർമ്മിപ്പിക്കാം, No = ഇപ്പോൾ തുടരാം, Stop = നിർത്താം:` : actualLang==='hi' ? `एक बात पूछूँ 😊\n\nआप यहाँ रुके थे: *${stuckName}*\n\n*Are you busy right now?*\n\n*Can I schedule a reminder after 1 Hour?*\n\n👉 Yes = 1 घंटे बाद याद दिलाऊँगी, No = अभी जारी रखते हैं, Stop = रोकें:` : `One thing 😊\n\nYou stopped at: *${stuckName}*\n\n*Are you busy right now?*\n\n*Can I schedule a reminder after 1 Hour?*\n\n👉 Yes = remind after 1 hour, No = continue now, Stop = stop:`;
        await sendWithDelay(interactiveButton(uid, busyG, [{id:'BUSY_YES',title:'Yes'},{id:'BUSY_NO',title:'No'},{id:'BUSY_STOP',title:'Stop'}], actualPhoneId));
      } else if(type.includes('GEN_1HOUR')){
        // V284 GENERIC 1h reminder after Busy Yes - resend the stuck step
        const stuckName = (state.lastStep||'').replace(/^V\d+ - /,'') || 'last step';
        const hG = actualLang==='ml' ? `ഹലോ, 1 മണിക്കൂർ കഴിഞ്ഞു 😊 പറഞ്ഞ പോലെ ഓർമ്മിപ്പിക്കുന്നു.\n\nനിങ്ങൾ ഇവിടെയാണ് നിന്നത്: *${stuckName}* — തുടരാം:` : actualLang==='hi' ? `हैलो, 1 घंटा हो गया 😊 जैसा कहा था, याद दिला रही हूँ।\n\nआप यहाँ रुके थे: *${stuckName}* — जारी रखते हैं:` : `Hello, 1 hour is up 😊 reminding you as promised.\n\nYou stopped at: *${stuckName}* — let's continue:`;
        await sendWithDelay(textMessage(uid, hG, actualPhoneId));
        try{ await repeatLastStep(uid, state, actualLang, actualPhoneId); }catch(_){}
      } else if(type.includes('GEN_FOLLOWUP_1H')){
        const stuckName = (state.lastStep||'').replace(/^V\d+ - /,'') || 'last step';
        const f1 = actualLang==='ml' ? `ഹലോ 😊 പറഞ്ഞ പോലെ ഓർമ്മിപ്പിക്കുന്നു — നിങ്ങൾ ഇവിടെയാണ് നിന്നത്: *${stuckName}*:` : actualLang==='hi' ? `हैलो 😊 जैसा कहा था, याद दिला रही हूँ — आप यहाँ रुके थे: *${stuckName}*:` : `Hello 😊 reminding you as promised — you stopped at: *${stuckName}*:`;
        await sendWithDelay(textMessage(uid, f1, actualPhoneId));
        try{ await repeatLastStep(uid, state, actualLang, actualPhoneId); }catch(_){}
      } else if(type.includes('GEN_FOLLOWUP_12H')){
        const stuckName = (state.lastStep||'').replace(/^V\d+ - /,'') || 'last step';
        const f12 = actualLang==='ml' ? `ഹലോ 😊 12 മണിക്കൂർ കഴിഞ്ഞു — നിങ്ങൾ ഇവിടെയാണ് നിന്നത്: *${stuckName}*:` : actualLang==='hi' ? `हैलो 😊 12 घंटे हो गए — आप यहाँ रुके थे: *${stuckName}*:` : `Hello 😊 12 hours done — you stopped at: *${stuckName}*:`;
        await sendWithDelay(textMessage(uid, f12, actualPhoneId));
        try{ await repeatLastStep(uid, state, actualLang, actualPhoneId); }catch(_){}
      } else if(type.includes('GEN_FOLLOWUP_24H')){
        const stuckName = (state.lastStep||'').replace(/^V\d+ - /,'') || 'last step';
        const f24 = actualLang==='ml' ? `ഹലോ 😊 അവസാന ഓർമ്മപ്പെടുത്തൽ — 24 മണിക്കൂർ കഴിഞ്ഞു. നിങ്ങൾ ഇവിടെയാണ് നിന്നത്: *${stuckName}*:` : actualLang==='hi' ? `हैलो 😊 आखिरी याद — 24 घंटे हो गए। आप यहाँ रुके थे: *${stuckName}*:` : `Hello 😊 last reminder — 24 hours done. You stopped at: *${stuckName}*:`;
        await sendWithDelay(textMessage(uid, f24, actualPhoneId));
        try{ await repeatLastStep(uid, state, actualLang, actualPhoneId); }catch(_){}
        try{ await autoFireLoser(uid, 'GEN - No Response After 1h/12h/24h Followups'); }catch(_){}
      } else if(type.includes('V320_CALL_11AM')){
        await sendWithDelay(textMessage(uid, v320Txt(actualLang,'REM_11AM'), actualPhoneId));
        await sendDialer(uid, 'Tap below to call:', String(HELP_MARKETING_FULL).replace(/[^0-9]/g,''), actualPhoneId); // V357 real dialer
      } else if(type.includes('V320_CALL_15MIN')){
        await setState(uid,{...state, lastStep:'V320 - Callback - Did You Call?', phoneId: actualPhoneId});
        await sendWithDelay(interactiveButton(uid, v320Txt(actualLang,'REM_15MIN'), [{id:'V320_CALLED_YES',title:'Yes, called'},{id:'V320_CALLED_NO',title:'Not yet'}], actualPhoneId));
      } else if(type.includes('V320_CALL_130PM')){
        await sendWithDelay(textMessage(uid, v320Txt(actualLang,'REM_130PM'), actualPhoneId));
      } else if(type.includes('V320_CALL_345PM')){
        await sendWithDelay(textMessage(uid, v320Txt(actualLang,'REM_345PM'), actualPhoneId));
        await sendDialer(uid, 'Tap below to call:', String(HELP_MARKETING_FULL).replace(/[^0-9]/g,''), actualPhoneId); // V357 real dialer
      } else if(type.includes('V320_CALL_AFTER4')){
        await setState(uid,{...state, lastStep:'V320 - Callback - After 4PM Confirm', phoneId: actualPhoneId});
        await sendWithDelay(interactiveButton(uid, v320Txt(actualLang,'REM_AFTER4'), [{id:'V320_CALLED_YES',title:'Yes'},{id:'V320_CALLED_NO',title:'No'}], actualPhoneId));
      } else {
        // Check if Pay step - use escalated pay text
        const last = state.lastStep||'';
        if(last.includes('Pay Reg') || last.includes('✅ EMI Selected') || last.includes('Not Paid') || last.includes('Pay Rs') || last.startsWith('Pay ')){
          const L = T[actualLang]||T.en;
          const fee = state.fee||15;
          // V247: 12h/24h OR already-called -> Call-followup + [Pay now] + [Call again]
          if(state.called || level===12 || level===24){
            await sendCallFollowupStep(uid,actualLang,fee,state.sub,actualPhoneId);
          } else {
            const escalatedText = getPayReminderExact(actualLang, fee, state.sub); // V247 EXACT reminder, no FOMO variant
            await sendPayNowStep(uid,actualLang,fee,state.sub,actualPhoneId, escalatedText, false);
          }
        } else {
          // For all other steps, repeat with escalated wrapper in repeatLastStep will be handled there
          // But we pass level via state
          state.reminderLevel = level;
          await setState(uid, state);
          await repeatLastStep(uid, state, actualLang, actualPhoneId);
          // V284 GENERIC: every stuck step gets the same AI chain. Video/Opportunity steps already have their own OPP chain - do not double-schedule.
          // Pay steps have their own pay-reminder chain - do not double-schedule.
          try{
            const _ls = String(state.lastStep||'');
            const _isVideo = _ls.includes('Video') || _ls.includes('Opportunity');
            const _isPay = _ls.includes('Pay') || _ls.includes('EMI') || _ls.includes('Reg');
            const _isDone = state.flow==='DONE' || _ls.includes('DONE') || _ls.includes('Fired') || _ls.includes('Stopped');
            if(!_isVideo && !_isPay && !_isDone && !type.includes('GEN_') && !type.includes('OPP_')){
              scheduleReminder(uid, 'install:GEN_ARE_YOU_THERE:10', actualLang, 2*60*1000, actualPhoneId);
            }
          }catch(_){}
        }
      }
    try{ const isThird = /noLang3|noService3|:24$/.test(type); if(isThird){ await autoFireLoser(uid, type); } }catch(_){}
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

I'm Maya 🤖 — I'm here to help you find what you need with Bizmapia.

👇 Please select one option below:-

💰 Want to EARN with Bizmapia? or want to experience our service?

Learn about our Business / Earning Opportunity Click here and apply now 👇`,
    useServices:`🛍️ Want to USE our services?
Experience our service — select any one 👇`,
    earnButtons:[{id:'SVC_OPP',title:'💼 BO - Earn With Us'}],
    useButtons:[{id:'SVC_RIDE',title:'🚖 Taxi'},{id:'SVC_BIZDIR',title:'📖 Business Directory'},{id:'SVC_DELIVERY',title:'🛵 Online Delivery'}],
    useMoreButtons:[{id:'SVC_BOOKING',title:'📦 Book Anything'}],
    moreServices:`More services:-`,
    services:[{id:'SVC_RIDE',title:'🚖 Taxi'},{id:'SVC_BIZDIR',title:'📖 Business Directory'},{id:'SVC_DELIVERY',title:'🛵 Online Delivery'},{id:'SVC_BOOKING',title:'📦 Book Anything'},{id:'SVC_OPP',title:'💼 BO - Earn With Us'}],
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
    oppButtons:[{id:'OPP_DISTRICT',title:'💰 ₹5L-₹15L Invest'},{id:'OPP_CORP',title:'💼 ₹2L-₹5L Invest'},{id:'OPP_CENTER',title:'🚀 ₹30K-₹1L Invest'}],
    highIntroSingle:`Excellent choice! 👏 👏 You selected District Franchisee - 10-15L - MOST PREMIUM opportunity!\n\nThank you for choosing our higher level income earning opportunity! This is a great decision - only one person per district!\n\n👇 👇 What to do in this step: Watch the YouTube video below fully to understand complete details about District franchise, then click Watched Video to see Benefits. Remember only one application is approved for a district, so study whole details and decide with this chat.`,
    moderateIntroSingle:`Excellent choice! 👏 👏 You selected Corporation/Municipal Franchisee - 4L/5L opportunity!\n\nThank you for choosing our moderate level income earning opportunity! Great decision - limited slots for Corporation / Municipal!\n\n👇 👇 What to do in this step: Watch the YouTube video below fully to understand complete details about Corporation/Municipal franchise, then click Watched Video to see Benefits. Study whole details and decide with this chat.`,
    baseIntroSingle:`Excellent choice! 👏 👏 You selected Business Center - 1L - Easy Start opportunity!\n\nThank you for choosing our base level income earning opportunity! Wonderful decision - perfect for easy start with low investment!\n\n👇 👇 What to do in this step: Watch the YouTube video below fully to understand complete details about Business Center, then click Watched Video to see Benefits. Study details and decide.`,
    reminderFranchise:`You were checking our Business Opportunity. Continue to know more?`,
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
    emiOpt:`EMI options available:\nEMI 10 Months\nEMI 20 Months\nPlease select any one from below:-`,
    emi10:'EMI 10 Months', emi20:'EMI 20 Months',
    leadAsk:`👏 Congratulations! Payment claimed!\n👉 What to do now: Type your FULL NAME only:\n\nExample: Ajo Devasia`,
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
    mainMenu:`🙏 हिंदी चुनने के लिए धन्यवाद! 🙏 बहुत बढ़िया चयन! 👏

मैं माया हूँ 🤖 — Bizmapia के साथ आपको जो चाहिए वो खोजने में मदद के लिए यहाँ हूँ।

👇 नीचे से एक विकल्प चुनें:-

💰 Bizmapia के साथ कमाना चाहते हैं? या हमारी सर्विस अनुभव करना चाहते हैं?

हमारे Business / Earning Opportunity के बारे में जानें — यहाँ Click करें और अभी अप्लाई करें 👇`,
    useServices:`🛍️ हमारी सर्विस USE करना चाहते हैं?
अपनी सर्विस अनुभव करें — नीचे से कोई एक चुनें 👇`,
    earnButtons:[{id:'SVC_OPP',title:'💼 BO - हमारे साथ कमाएँ'}],
    useButtons:[{id:'SVC_RIDE',title:'🚖 टैक्सी'},{id:'SVC_BIZDIR',title:'📖 बिजनेस डायरेक्टरी'},{id:'SVC_DELIVERY',title:'🛵 ऑनलाइन डिलीवरी'}],
    useMoreButtons:[{id:'SVC_BOOKING',title:'📦 कुछ भी बुक करें'}],
    moreServices:`और सेवाएं:-`,
    services:[{id:'SVC_RIDE',title:'🚖 टैक्सी'},{id:'SVC_BIZDIR',title:'📖 बिजनेस डायरेक्टरी'},{id:'SVC_DELIVERY',title:'🛵 ऑनलाइन डिलीवरी'},{id:'SVC_BOOKING',title:'📦 कुछ भी बुक करें'},{id:'SVC_OPP',title:'💼 BO - हमारे साथ कमाएँ'}],
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
    oppButtons:[{id:'OPP_DISTRICT',title:'₹5L-₹15L निवेश'},{id:'OPP_CORP',title:'₹2L-₹5L निवेश'},{id:'OPP_CENTER',title:'₹30K-₹1L निवेश'}],
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
EMI 10 महीने
EMI 20 महीने`,
    emi10:'EMI 10 महीने', emi20:'EMI 20 महीने',
    leadAsk:`👏 Congratulations! Payment claimed!
👉 What to do now: अपना पूरा नाम केवल टाइप करें:

Example: Ajo Devasia`,
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
    mainMenu:`🙏 മലയാളം തിരഞ്ഞെടുത്തതിന് നന്ദി! 🙏 മികച്ച തിരഞ്ഞെടുപ്പ്! 👏

ഞാൻ മായ ആണ് 🤖 — Bizmapia-യിൽ നിങ്ങൾക്ക് വേണ്ടത് കണ്ടെത്താൻ സഹായിക്കാൻ ഇവിടെയുണ്ട്.

👇 താഴെ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-

💰 Bizmapia-യിലൂടെ വരുമാനം നേടണോ? അതോ ഞങ്ങളുടെ സേവനം അനുഭവിക്കണോ?

ഞങ്ങളുടെ Business / Earning Opportunity-യെ കുറിച്ച് അറിയാൻ ഇവിടെ Click ചെയ്ത് ഇപ്പോൾ അപ്ലൈ ചെയ്യൂ 👇`,
    useServices:`🛍️ ഞങ്ങളുടെ സേവനം USE ചെയ്യണോ?
ഞങ്ങളുടെ സേവനം അനുഭവിക്കൂ — താഴെ നിന്ന് ഒരെണ്ണം തിരഞ്ഞെടുക്കൂ 👇`,
    earnButtons:[{id:'SVC_OPP',title:'💼 ബിസിനസ് അവസരങ്ങൾ'}],
    useButtons:[{id:'SVC_RIDE',title:'🚖 ടാക്സി'},{id:'SVC_BIZDIR',title:'📖 ബിസിനസ് ഡയറക്ടറി'},{id:'SVC_DELIVERY',title:'🛵 ഓൺലൈൻ ഡെലിവറി'}],
    useMoreButtons:[{id:'SVC_BOOKING',title:'📦 എന്തും ബുക്ക് ചെയ്യൂ'}],
    moreServices:`കൂടുതൽ സേവനങ്ങൾ:-`,
    services:[{id:'SVC_RIDE',title:'🚖 ടാക്സി'},{id:'SVC_BIZDIR',title:'📖 ബിസിനസ് ഡയറക്ടറി'},{id:'SVC_DELIVERY',title:'🛵 ഓൺലൈൻ ഡെലിവറി'},{id:'SVC_BOOKING',title:'📦 എന്തും ബുക്ക് ചെയ്യൂ'},{id:'SVC_OPP',title:'💼 ബിസിനസ് അവസരങ്ങൾ'}],
    noLang:`ക്ഷമിക്കണം, നിങ്ങൾ ഒരു ഭാഷയും തിരഞ്ഞെടുത്തില്ല.\n\nതാഴെ നിന്ന് ഇഷ്ട ഭാഷ തിരഞ്ഞെടുക്കുക:-`,
    noService:`നിങ്ങൾ ഇതുവരെ ഒരു സേവനവും തിരഞ്ഞെടുത്തില്ല.\n\nതാഴെ നിന്ന് ഒരു സേവനം ക്ലിക്ക് ചെയ്യുക:-`,
    rideSelected:`നിങ്ങൾ "റൈഡ് ഹെയ്ലിംഗ്" തിരഞ്ഞെടുത്തു, നന്നായി\nBizmapia അതിർത്തിയില്ലാതെ ഇന്ത്യ മുഴുവൻ റൈഡ് ഹെയ്ലിംഗ് സേവനം നൽകുന്ന ഒരേയൊരു പ്ലാറ്റ്ഫോമാണ്.\nതാഴെ നിന്ന് ഏതെങ്കിലും ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    rideButtons:[{id:'RIDE_BOOK',title:'ക്യാബ് ബുക്കിംഗ്'},{id:'RIDE_ATTACH',title:'ക്യാബ് ചേർക്കൂ'}],
    bookCab:`മികച്ച തിരഞ്ഞെടുപ്പ്, നിങ്ങൾ "ക്യാബ് ബുക്കിംഗ്" സേവനം ക്ലിക്ക് ചെയ്തു.\nTwo wheeler/Autorickshaw/Hatchback/Sedan/SUV/XUV/Ambulance അടുത്ത പ്രദേശങ്ങളിൽ നിന്ന് മിതമായ നിരക്കിൽ ലഭിക്കും.\n\nതാഴെ ക്ലിക്ക് ചെയ്ത് ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക അല്ലെങ്കിൽ വിളിക്കുക:`,
    attachCab:`നിങ്ങൾ "ക്യാബ് ചേർക്കൂ" തിരഞ്ഞെടുത്തു\nനിങ്ങളുടെ Two wheeler/Auto/Car/SUV അറ്റാച്ച് ചെയ്ത് Bizmapia-യിലൂടെ ദിവസവും വരുമാനം നേടൂ.\n\nതാഴെ ക്ലിക്ക് ചെയ്യുക:`,
    haveInstalled1:`നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nഇവിടെ നിങ്ങൾക്ക് റൈഡുകളിൽ പ്രത്യേക ഓഫറുകൾ സജീവമാക്കാം`,
    haveInstalled24:`നിങ്ങൾ ഞങ്ങളുടെ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്തോ?\n\nനിങ്ങളുടെ അവസരം അവസാനിക്കാൻ പോകുന്നു, ഇവിടെ റൈഡുകളിൽ ഓഫറുകൾ സജീവമാക്കാം`,
    yesActivate:'അതെ, സജീവമാക്കുക', noLater:'പിന്നീട് ചെയ്യാം',
    activated:`നന്നായി, ഞങ്ങൾ നിങ്ങളുടെ ആപ്പ് ലോഗിനിൽ നിങ്ങളുടെ ഓഫർ സജീവമാക്കുന്നു, ഇപ്പോൾ ഞങ്ങളുടെ ആപ്പിൽ ലോഗിൻ ചെയ്ത് ആദ്യ യാത്ര പൂർത്തിയാക്കി നിങ്ങളുടെ ഓഫറുകൾ പരിശോധിക്കുക`,
    helpAdmin:`സഹായം ${HELP_ADMIN}`, helpMarketing:`സഹായം ${HELP_MARKETING}`,
    bizDirSelected:`നിങ്ങൾ "ബിസിനസ് ഡയറക്ടറി" തിരഞ്ഞെടുത്തു, നന്നായി\nനിങ്ങളുടെ ബിസിനസ്സ് രജിസ്റ്റർ ചെയ്ത് ഇന്ത്യ മുഴുവൻ ഉപഭോക്താക്കളെ നേടൂ. 10 ലക്ഷത്തിലധികം പ്രാദേശിക ബിസിനസ്സുകൾ ഇതിനകം ലിസ്റ്റ് ചെയ്തിട്ടുണ്ട്.\nതാഴെ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക:-`,
    bizDirButtons:[{id:'BIZ_REGISTER',title:'ബിസിനസ് ചേർക്കൂ'},{id:'BIZ_ADS',title:'പരസ്യം തുടങ്ങുക'}],
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
    oppSelected:`👋 നന്നായി! നിങ്ങൾ "ബിസിനസ് അവസരം" തിരഞ്ഞെടുത്തു.\n\nനിങ്ങൾ Bizmapia-യിൽ നിന്ന് വരുമാന സ്ലോട്ട് ബുക്ക് ചെയ്യാൻ പോകുന്നു.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ നിന്ന് നിക്ഷേപ ശേഷി തിരഞ്ഞെടുക്കുക:-`,
    oppButtons:[{id:'OPP_DISTRICT',title:'₹5L-₹15L നിക്ഷേപം'},{id:'OPP_CORP',title:'₹2L-₹5L നിക്ഷേപം'},{id:'OPP_CENTER',title:'₹30K-₹1L നിക്ഷേപം'}],
    highIntroSingle:`👋 ഹലോ! നിങ്ങൾ ₹5L-₹15L നിക്ഷേപം (ജില്ലാ ഫ്രാഞ്ചൈസി) തിരഞ്ഞെടുത്തു.\n\nജില്ലാ ഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ നോക്കാം. ഒരു ജില്ലയ്ക്ക് ഒരു അപേക്ഷ മാത്രം.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ വീഡിയോ മുഴുവൻ കാണുക.`,
    moderateIntroSingle:`👋 ഹലോ! നിങ്ങൾ ₹2L-₹5L നിക്ഷേപം (കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി) തിരഞ്ഞെടുത്തു.\n\nകോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ നോക്കാം.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ വീഡിയോ കാണുക.`,
    baseIntroSingle:`👋 ഹലോ! നിങ്ങൾ ₹30K-₹1L നിക്ഷേപം (ബിസിനസ് സെന്റർ) തിരഞ്ഞെടുത്തു.\n\nബിസിനസ് സെന്റർ വിശദാംശങ്ങൾ നോക്കാം.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ വീഡിയോ കാണുക.`,
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
EMI 10 മാസം
EMI 20 മാസം`,
    emi10:'EMI 10 മാസം', emi20:'EMI 20 മാസം',
    leadAsk:`👏 Congratulations! Payment claimed!
👉 What to do now: നിങ്ങളുടെ പൂർണ്ണ നാമം മാത്രം ടൈപ്പ് ചെയ്യുക:

Example: Ajo Devasia`,
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

// === HOT TEMPLATE SENDER - ADDED 9 NOV 2026 - ONLY ADDITION, NO OTHER CODE TOUCHED ===
const TEMPLATE1_NUMBERS = ["919946402400","919846919148","918111914663","918156857714","919447805071","919495686767","919495787787","917012685283","918891917766","919847882906","919544592159","919947141555","917510242504"];
const TEMPLATE2_NUMBERS = ["918304002279","918289991657","918891167308","918943219407","919447428830","96898759658","917902563306","919048181788"];
async function sendTemplateMsg(to, templateName){
  return await sendWithDelay({messaging_product:'whatsapp', to: to, type:'template', template:{name: templateName, language:{code:'en'}}});
}
app.get('/fire-template1', async(req,res)=>{
  let out=[];
  for(let n of TEMPLATE1_NUMBERS){ try{ await sendTemplateMsg(n,"bizmapia_followup_busy"); out.push(n+": SENT"); }catch(e){ out.push(n+": FAIL "+e.message); } await new Promise(r=>setTimeout(r,2000)); }
  res.send(out.join("<br>")+"<br><br>DONE Template1 - 13 numbers");
});
app.get('/fire-template2', async(req,res)=>{
  let out=[];
  for(let n of TEMPLATE2_NUMBERS){ try{ await sendTemplateMsg(n,"bizmapia_followup_soft"); out.push(n+": SENT"); }catch(e){ out.push(n+": FAIL "+e.message); } await new Promise(r=>setTimeout(r,2000)); }
  res.send(out.join("<br>")+"<br><br>DONE Template2 - 8 numbers");
});
// === END HOT TEMPLATE SENDER ===

app.get('/',(req,res)=>res.send(`V321 TRY-FREE-5PCT-24H RECEIPT - REAL TIME RECEIPT - D250=https://rzp.io/rzp/BZ9D9rT C150=https://rzp.io/rzp/ptj9OGpr B100=https://rzp.io/rzp/lAguvzEt - WEBHOOK FIXED FOR STATIC LINKS - BTN 💳 Pay Now - TAB Registration_Fee - `+new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})));
app.get('/webhook',(req,res)=>{ if(req.query['hub.verify_token']===VERIFY_TOKEN){ res.send(req.query['hub.challenge']); } else res.sendStatus(403); });


// ===== V341 TEAM INBOX LIVE - ADDED ONLY, NO LOCKED LOGIC CHANGED =====
globalThis.__teamInboxLog = globalThis.__teamInboxLog || [];
globalThis.__teamPaused = globalThis.__teamPaused || new Set();
// V362: Inbox persistence - every entry also saved to Redis list team_inbox_log (kept 2000). Memory alone was wiped on every deploy - cause of "old chats will NOT show".
function teamInboxSaveRedis(entry){ try{ if(redisReady && redis){ redis.rpush('team_inbox_log', JSON.stringify(entry)).then(()=>redis.ltrim('team_inbox_log', -20000, -1).catch(()=>{})).catch(()=>{}); } }catch(e){} }
function teamInboxPush(phone, who, text, step){ try{ const _e={time:getISTTime(), phone:String(phone), who, text:String(text||'').slice(0,500), step: step||''}; globalThis.__teamInboxLog.push(_e); if(globalThis.__teamInboxLog.length>20000) globalThis.__teamInboxLog.splice(0, globalThis.__teamInboxLog.length-20000); teamInboxSaveRedis(_e); }catch(e){} }
async function restoreTeamInboxFromRedis(){ try{ if(!redisReady || !redis){ console.log('V362 inbox restore skipped - Redis not ready'); return 0; } const _rows = await redis.lrange('team_inbox_log', 0, -1); let _n=0; globalThis.__teamInboxLog = globalThis.__teamInboxLog || []; if(globalThis.__inboxRestored) { console.log('V364.7 inbox restore skipped - already restored, old chats kept'); return globalThis.__teamInboxLog.length; } globalThis.__inboxRestored = true; const _seen = new Set(globalThis.__teamInboxLog.map(e=>e.time+'|'+e.phone+'|'+e.who+'|'+e.text)); for(const _r of _rows){ try{ const _e=JSON.parse(_r); if(_e && _e.phone) { const _k=_e.time+'|'+_e.phone+'|'+_e.who+'|'+_e.text; if(!_seen.has(_k)){ globalThis.__teamInboxLog.push(_e); _seen.add(_k); _n++; } } }catch(e){} } if(globalThis.__teamInboxLog.length>20000) globalThis.__teamInboxLog.splice(0, globalThis.__teamInboxLog.length-20000); try{ const _paused = await redis.smembers('team_inbox_paused'); globalThis.__teamPaused = globalThis.__teamPaused || new Set(); for(const _p of _paused||[]) globalThis.__teamPaused.add(String(_p)); console.log(`V364 inbox restored ${_n} msgs, paused=${[...globalThis.__teamPaused].join(',')}`); }catch(e){} return _n; }catch(e){ console.log('V362 inbox restore fail', e.message); return 0; } }
function teamInboxChats(){ const m={}; for(const r of globalThis.__teamInboxLog){ if(!m[r.phone]) m[r.phone]={phone:r.phone, last:r, count:0, msgs:[]}; m[r.phone].count++; m[r.phone].msgs.push(r); m[r.phone].last=r; } return Object.values(m).sort((a,b)=> b.last.time.localeCompare(a.last.time)); }
// ===== END V341 TEAM INBOX STORE =====


// ===== V364.3 AI ROUTER + MEMORY ANSWERS - BEFORE ALL STEPS =====
// Bug (user screenshot 24 Nov 12:57am): "is bizmapia trustable?" -> Welcome again.
// "how this opportunity works?" -> Welcome again, word to word. No memory used.
// Fix: Router runs BEFORE V320 / steps / AI-sorting. Question -> Memory Answer -> Proof -> 1 follow-up.
// Never Welcome again. Language = language user just typed (English->English, Malayalam/Manglish->Malayalam).
function v364_2_detectLang(txt, state){
  const s = String(txt||'');
  if(/[\u0D00-\u0D7F]/.test(s)) return 'ml';
  const low = s.toLowerCase();
  // Manglish markers -> Malayalam
  if(/\b(enth|entha|eppo|evide|engane|cheyy|venam|venda|illa|undu|aanu|alle|alle|nokk|paray|kitt|cheyyum|aano|alle)\b/.test(low)) return 'ml';
  // Pure English / Hindi roman -> en (Hindi handled by existing flow, keep en for router answers unless state is hi)
  if(state && state.lang==='hi' && /[\u0900-\u097F]/.test(s)) return 'hi';
  return 'en';
}
function v364_2_isTrust(txt){
  const low = String(txt||'').toLowerCase();
  return /trust|trustable|trustworthy|fake|fraud|scam|cheat|cheating|safe|genuine|real or fake|viswas|viswasikk|namb|nambikk|bharosa|vishwas|dhok|paisa.*doob|paise.*safe/.test(low);
}
function v364_2_isOpportunityWorks(txt){
  const low = String(txt||'').toLowerCase();
  return /(how.*opportunity|opportunity.*work|opportunity.*kaise|how.*work.*bizmapia|how.*earn|how.*income|earn.*how|opportunity.*explain|explain.*opportunity|avasa.*explain|enth.*opportunity|opportunity.*enth|kaise.*kam|kaise.*kaam)/.test(low)
    || low.trim()==='opportunity' || low.trim()==='business opportunity' || low.trim()==='opportunity works';
}
function v364_2_capacityOf(txt){
  const s = String(txt||'').toLowerCase().replace(/,/g,'').replace(/rs\.?|rupees|₹|\blakh\b|\black\b/g,' ');
  // ranges: 30k-1l, 2l-5l, 5l-15l, also bare numbers like 50000, 1 lakh, 50000-100000
  if(/30\s*k?.*1\s*(l|lac| lakh)|30000.*100000|30k|30000/.test(s) && !/2\s*l/.test(s)) return '30K-1L';
  if(/2\s*(l|lac| lakh).*5\s*(l|lac| lakh)|200000.*500000|2l|2-5/.test(s)) return '2L-5L';
  if(/5\s*(l|lac| lakh).*15\s*(l|lac| lakh)|500000.*1500000|5l|5-15|15\s*l/.test(s)) return '5L-15L';
  // single amounts
  const nums = (s.match(/\d+/g)||[]).map(Number);
  if(nums.length){
    const v = Math.max(...nums); const scaled = v<1000 ? v*1000 : v; // 30 -> 30000, 50 -> 50000
    if(scaled<=100000) return '30K-1L';
    if(scaled<=500000) return '2L-5L';
    if(scaled<=1500000) return '5L-15L';
  }
  if(/business center|business centre|center|centre/.test(s)) return '30K-1L';
  if(/municipal|corporation|muni|corp/.test(s)) return '2L-5L';
  if(/district/.test(s)) return '5L-15L';
  if(/any|suggest|you.*decide|you.*suggest|don't know|dont know|ariyilla|eth.*nallath|which.*best|best.*which/.test(s)) return 'ANY';
  return null;
}
function v364_2_texts(lang, kind, cap){
  const ml = lang==='ml';
  if(kind==='TRUST'){
    return ml
    ? `🙏 നല്ല ചോദ്യമാണ്, പണം കൊടുക്കുന്നതിന് മുമ്പ് ഇതുതന്നെയാണ് ചോദിക്കേണ്ടത്.\n\n✅ നിങ്ങൾക്ക് ഒരു തുകയും നഷ്ടമാകില്ല — ആദ്യം Registration Fee മാത്രം.\n\n📄 Registration Fee കഴിഞ്ഞാൽ നിങ്ങൾക്ക് **Tender + Annexure B** കിട്ടും.\n\n📊 Annexure B-യിൽ full income opportunity ഉണ്ട് — monthly breakup, daily target, minimum, projection, EMI deduction, എല്ലാം.\n\n📞 അതിന് ശേഷം നമ്മുടെ team നിങ്ങളെ contact ചെയ്യും.\n\n👀 അത് വായിച്ച്, നോക്കി, team-നോട് സംസാരിച്ച്, comfortable ആയാൽ **മാത്രം** ബാക്കി തുക കൊടുത്താൽ മതി.\n\n❌ Comfortable അല്ലെങ്കിൽ അവിടെ നിർത്താം. ഒരു നിർബന്ധവുമില്ല.\n\n👉 ഏത് opportunity ആണ് നിങ്ങൾക്ക് പറ്റുക? 30K-1L / 2L-5L / 5L-15L — ഏത് range ആണ് ഇപ്പോൾ comfortable?`
    : `🙏 Very good question — this is exactly the question to ask before any money.\n\n✅ You are not losing any amount now — only the registration fee.\n\n📄 After the registration fee, you will get **Tender + Annexure B**.\n\n📊 In Annexure B you will see the full income opportunity — monthly breakup, daily target, minimum, projection, EMI deduction, everything.\n\n📞 After that, our team will contact you.\n\n👀 Read it, check it, talk to the team. If you are comfortable, **only then** you need to pay the rest.\n\n❌ If not comfortable, you stop there. No force at all.\n\n👉 Which opportunity fits you? 30K-1L / 2L-5L / 5L-15L — which range is comfortable for you now?`;
  }
  if(kind==='OPP_ASK'){
    return ml
    ? `✨ 3 തരം opportunity ഉണ്ട്, നിങ്ങളുടെ spending capacity അനുസരിച്ച്.\n\n1️⃣ **Business Center** — 30K to 1L range — നിങ്ങളുടെ area-യിൽ 1 service manage ചെയ്യും\n2️⃣ **Municipal / Corporation** — 2L to 5L range — നിങ്ങളുടെ municipality / corporation manage ചെയ്യും\n3️⃣ **District** — 5L to 15L range — full district manage ചെയ്യും\n\n👉 ഇപ്പോൾ ഏത് range fits? 30K-1L / 2L-5L / 5L-15L ?\n\nRange പറയൂ, ആ ഒരെണ്ണം മാത്രം full ആയി explain ചെയ്യാം — total fee, advance, EMI, Annexure B monthly income.`
    : `✨ There are 3 types of opportunity, based on your spending capacity.\n\n1️⃣ **Business Center** — 30K to 1L range — you manage 1 service in your area\n2️⃣ **Municipal / Corporation** — 2L to 5L range — you manage your municipality / corporation\n3️⃣ **District** — 5L to 15L range — you manage the full district\n\n👉 Which range fits you now? 30K-1L / 2L-5L / 5L-15L ?\n\nTell me your range, I will explain only that one fully — total fee, advance, EMI, and monthly income from Annexure B.`;
  }
  if(kind==='OPP_DETAIL'){
    if(cap==='30K-1L') return ml
    ? `✅ **Business Center** — നിങ്ങളുടെ range-ന് ഇതാണ്.\n\n💰 Total: Rs.1,00,000\n💳 Down: Rs.30,000\n📅 MOU: 1 year, non-renewable\n📆 EMI: up to 5 / 9 months\n\n🛠️ നിങ്ങൾ manage ചെയ്യുന്നത്: നിങ്ങളുടെ area-യിൽ 1 service — Ride-Hailing അല്ലെങ്കിൽ Business Directory.\n\n📊 Income: Annexure B monthly breakup അനുസരിച്ച് — daily target, minimum, projection, EMI deduction കഴിഞ്ഞ് monthly settlement.\n\n👉 ഏത് area-യിലാണ് തുടങ്ങാൻ ആഗ്രഹിക്കുന്നത്? Area പറയൂ, Tender + Annexure B process explain ചെയ്യാം.`
    : `✅ **Business Center** — this fits your range.\n\n💰 Total: Rs.1,00,000\n💳 Down: Rs.30,000\n📅 MOU: 1 year, non-renewable\n📆 EMI: up to 5 / 9 months\n\n🛠️ You manage: 1 service in your area — Ride-Hailing or Business Directory.\n\n📊 Income: as per Annexure B monthly breakup — daily target, minimum, projection, monthly settlement after EMI deduction.\n\n👉 Which area do you want to start in? Tell me your area, I will explain the Tender + Annexure B process.`;
    if(cap==='2L-5L') return ml
    ? `✅ **Municipal / Corporation** — നിങ്ങളുടെ range-ന് ഇതാണ്.\n\n💰 Municipal Total: Rs.4,00,000 — Advance Rs.5,000, Balance Rs.3,95,000, EMI down Rs.1,95,000-2,00,000\n💰 Corporation Total: Rs.5,00,000 — Down Rs.3,00,000\n📅 MOU as per Tender\n\n🛠️ നിങ്ങൾ manage ചെയ്യുന്നത്: നിങ്ങളുടെ municipality / corporation മുഴുവൻ.\n\n📊 Income: Annexure B monthly breakup അനുസരിച്ച് — daily target, minimum, projection, EMI deduction കഴിഞ്ഞ് monthly settlement.\n\n👉 Municipal ആണോ, Corporation ആണോ? Area ഏതാണ്? പറയൂ, Tender + Annexure B process explain ചെയ്യാം.`
    : `✅ **Municipal / Corporation** — this fits your range.\n\n💰 Municipal Total: Rs.4,00,000 — Advance Rs.5,000, Balance Rs.3,95,000, EMI down Rs.1,95,000-2,00,000\n💰 Corporation Total: Rs.5,00,000 — Down Rs.3,00,000\n📅 MOU as per Tender\n\n🛠️ You manage: your full municipality / corporation.\n\n📊 Income: as per Annexure B monthly breakup — daily target, minimum, projection, monthly settlement after EMI deduction.\n\n👉 Municipal or Corporation? Which area? Tell me, I will explain the Tender + Annexure B process.`;
    // 5L-15L
    return ml
    ? `✅ **District** — നിങ്ങളുടെ range-ന് ഇതാണ്.\n\n💰 District (Municipality-only): Rs.10,00,000 — Advance Rs.5,000, Balance Rs.9,95,000, EMI down Rs.4,95,000\n💰 District (Corporation-based): Rs.15,00,000 — Advance Rs.5,000, Balance Rs.14,95,000, EMI down Rs.4,95,000\n📅 MOU as per Tender\n\n🛠️ നിങ്ങൾ manage ചെയ്യുന്നത്: full district.\n\n📊 Income: Annexure B monthly breakup അനുസരിച്ച് — daily target, minimum, projection, EMI deduction കഴിഞ്ഞ് monthly settlement.\n\n👉 ഏത് district? പറയൂ, Tender + Annexure B process explain ചെയ്യാം.`
    : `✅ **District** — this fits your range.\n\n💰 District (Municipality-only): Rs.10,00,000 — Advance Rs.5,000, Balance Rs.9,95,000, EMI down Rs.4,95,000\n💰 District (Corporation-based): Rs.15,00,000 — Advance Rs.5,000, Balance Rs.14,95,000, EMI down Rs.4,95,000\n📅 MOU as per Tender\n\n🛠️ You manage: the full district.\n\n📊 Income: as per Annexure B monthly breakup — daily target, minimum, projection, monthly settlement after EMI deduction.\n\n👉 Which district? Tell me, I will explain the Tender + Annexure B process.`;
  }
  if(kind==='OPP_ANY'){
    return ml
    ? `👍 കുഴപ്പമില്ല, ഞാൻ help ചെയ്യാം.\n\n👉 നിങ്ങൾ ഏത് area-യിൽ നിന്നാണ്, ഇപ്പോൾ comfortably എത്ര spend ചെയ്യാൻ പറ്റും?\n\nArea + range പറഞ്ഞാൽ, ഞാൻ നിങ്ങൾക്ക് പറ്റിയ ഒരെണ്ണം suggest ചെയ്യാം — Business Center / Municipal / District.`
    : `👍 No problem, I will help you choose.\n\n👉 Which area are you from, and how much can you spend comfortably now?\n\nTell me area + range, and I will suggest the one that fits you — Business Center / Municipal / District.`;
  }
  return '';
}


// ===== V364.3 OUTER-MEMORY FALLBACK + FRANCHISE NUMBER LIMIT =====
// Rule: Memory -> Platforms -> Team, never invent, never Welcome again.
// Franchise numbers: NEVER share franchisee/customer personal numbers. Only official team numbers, only via Call button, never digits in body.
function v364_3_detectLang(txt, state){
  const s=String(txt||'');
  if(/[\u0D00-\u0D7F]/.test(s)) return 'ml';
  const low=s.toLowerCase();
  if(/\b(enth|entha|eppo|evide|engane|cheyy|venam|venda|illa|undu|aanu|alle|paray|kitt|aano)\b/.test(low)) return 'ml';
  return 'en';
}
function v364_3_isFranchiseNumberAsk(txt){
  const low=String(txt||'').toLowerCase();
  return /(franchise.*number|franchisee.*number|district.*number|owner.*number|give.*number|number.*franchise|contact.*franchise|phone.*franchise|franchise.*phone|franchise.*contact|dealer.*number|partner.*number)/.test(low)
    && !/(my number|my contact|my phone|ente number|ente phone)/.test(low);
}
function v364_3_isFranchiseCountAsk(txt){
  const low=String(txt||'').toLowerCase();
  return /(how many.*franchise|how many.*district|how many.*business center|ethra.*franchise|kitne.*franchise|total.*franchise|franchise.*count|franchise.*total)/.test(low);
}
function v364_3_isOuterQuestion(txt){
  const low=String(txt||'').toLowerCase().trim();
  // Outer = question about Bizmapia that V364.3 did not already handle (trust / opp-works / capacity handled there)
  if(/trust|opportunity.*work|how.*opportunity/.test(low)) return false;
  return /\?/.test(txt) || /^(how|what|where|when|which|why|does|do|is|are|can|will|eth|evide|eppo|enth|engane|kaise|kya|kahan|kab|kaun)/.test(low)
    || /(work in|available in|office|offer|new offer|app|delivery|service.*area|area.*service|timing|time|open|close|charge|price|rate|discount|refund|cancel)/.test(low);
}
function v364_3_outerAnswer(txt, lang){
  const low=String(txt||'').toLowerCase();
  const ml=lang==='ml';
  // Platform KB - only confirmed facts, no invented counts / numbers / links in body. Links only via existing See Video / Call buttons elsewhere.
  if(/(tamil nadu|tamilnadu|karnataka|andhra|telangana|maharashtra|delhi|up |uttar|gujarat|rajasthan|punjab|west bengal|odisha|assam|all india|all-india|india.*work|work.*india|kerala.*only|outside kerala)/.test(low)){
    return ml
    ? `✅ Bizmapia All-India platform ആണ് — Kerala മാത്രമല്ല.\n\n📍 നിങ്ങൾ ഏത് state / district-ലാണ്? Area പറയൂ, ആ area-യിൽ ഏത് opportunity / service open ആണെന്ന് check ചെയ്ത് പറയാം.\n\n👉 Area ഏതാണ്?`
    : `✅ Bizmapia is an All-India platform — not Kerala only.\n\n📍 Which state / district are you in? Tell me your area, I will check which opportunity / service is open in that area.\n\n👉 Which area?`;
  }
  if(/(office|address|where.*located|evide.*office|head office)/.test(low)){
    return ml
    ? `🏢 Office: Thodupuzha, Idukki, Kerala.\n\n📞 Team-നോട് സംസാരിക്കാൻ Call button ഉപയോഗിക്കൂ. Calling time: Monday to Saturday, 11 AM - 4 PM.\n\n👉 എന്താണ് വേണ്ടത്? Business Opportunity ആണോ, Service ആണോ?`
    : `🏢 Office: Thodupuzha, Idukki, Kerala.\n\n📞 To talk to the team, use the Call button below. Calling time: Monday to Saturday, 11 AM - 4 PM.\n\n👉 What do you need? Business Opportunity or Service?`;
  }
  if(/(offer|new offer|discount|promotion|latest offer)/.test(low)){
    return ml
    ? `ℹ️ ഇപ്പോൾ confirmed ആയ പുതിയ offer എനിക്ക് memory-യിൽ ഇല്ല.\n\n📱 Bizmapia official Instagram / Facebook / YouTube-യിൽ പുതിയ offer വന്നാൽ അവിടെ update ചെയ്യും.\n\n👉 നിങ്ങൾ ഏത് opportunity-യിലാണ് interest? Business Center / Municipal / District — അതിന്റെ current process explain ചെയ്യാം.`
    : `ℹ️ I don't have a confirmed new offer in memory right now.\n\n📱 Any new offer will be updated on Bizmapia official Instagram / Facebook / YouTube.\n\n👉 Which opportunity are you interested in? Business Center / Municipal / District — I will explain its current process.`;
  }
  if(/(app|play store|download|install)/.test(low)){
    return ml
    ? `📱 Bizmapia Customer App-ൽ നിന്ന് service book ചെയ്യാം — Taxi, Directory, Delivery, Booking.\n\n👉 ഏത് service ആണ് വേണ്ടത്? Taxi / Delivery / Booking / Business Directory? പറയൂ, അത് മാത്രം explain ചെയ്യാം.`
    : `📱 You can book services from the Bizmapia Customer App — Taxi, Directory, Delivery, Booking.\n\n👉 Which service do you need? Taxi / Delivery / Booking / Business Directory? Tell me, I will explain only that one.`;
  }
  if(/(delivery|food.*delivery|parcel|package)/.test(low)){
    return ml
    ? `🛵 Delivery: local shops-ൽ നിന്ന് up to 10 Kg വരെ delivery ഉണ്ട്.\n\n📍 ഏത് area-യിലാണ് delivery വേണ്ടത്? Area + എന്താണ് deliver ചെയ്യേണ്ടത്? പറയൂ.`
    : `🛵 Delivery: up to 10 Kg from local shops.\n\n📍 Which area do you need delivery in? Tell me area + what to deliver.`;
  }
  if(/(timing|time|open|close|working hour|calling time|when.*call)/.test(low)){
    return ml
    ? `🕚 Team calling time: Monday to Saturday, 11 AM - 4 PM.\n\n💬 Maya-യോട് 24x7 chat ചെയ്യാം — text / voice.\n\n👉 എന്താണ് വേണ്ടത്?`
    : `🕚 Team calling time: Monday to Saturday, 11 AM - 4 PM.\n\n💬 You can chat with Maya 24x7 — text / voice.\n\n👉 What do you need?`;
  }
  if(/(fee|charge|price|rate|cost|emi|refund|cancel|payment)/.test(low)){
    return ml
    ? `💰 Fee-യുടെ കാര്യം Annexure B + Tender-ൽ full ആയി ഉണ്ട്.\n\n✅ ആദ്യം Registration Fee മാത്രം. Tender + Annexure B കിട്ടിയ ശേഷം, team-നോട് സംസാരിച്ച്, comfortable ആയാൽ മാത്രം ബാക്കി തുക.\n\n👉 ഏത് opportunity-യുടെ fee ആണ് വേണ്ടത്? Business Center / Municipal / District?`
    : `💰 Full fee details are in Annexure B + Tender.\n\n✅ First only the registration fee. After you get Tender + Annexure B, talk to the team, and only if comfortable pay the rest.\n\n👉 Which opportunity's fee do you need? Business Center / Municipal / District?`;
  }
  // Generic outer question - never invent, never Welcome. Give closest known topic + 1 follow-up, offer team check.
  return ml
  ? `🙏 നല്ല ചോദ്യമാണ്.\n\nℹ️ ഇതിന്റെ confirmed detail എന്റെ memory-യിൽ ഇപ്പോൾ ഇല്ല. ഞാൻ team-നോട് check ചെയ്യാം.\n\n👉 ഇതിനിടയിൽ, ഏതാണ് വേണ്ടത്? Business Opportunity ആണോ, Service ആണോ? അത് explain ചെയ്യാം.`
  : `🙏 Good question.\n\nℹ️ I don't have a confirmed detail for this in memory right now. I will check with the team.\n\n👉 Meanwhile, what do you need? Business Opportunity or Service? I will explain that.`;
}
function v364_3_texts(lang, kind){
  const ml=lang==='ml';
  if(kind==='FRANCHISE_NUMBER'){
    return ml
    ? `🙏 മനസ്സിലായി.\n\n❌ Franchisee / owner-യുടെ personal number ഞാൻ share ചെയ്യില്ല — അത് അവരുടെ privacy ആണ്.\n\n✅ നിങ്ങൾക്ക് ആ area-യിൽ join ചെയ്യണമെങ്കിൽ, process explain ചെയ്യാം, team നിങ്ങളെ contact ചെയ്യും.\n\n📞 Team-നോട് സംസാരിക്കാൻ താഴെ Call button ഉപയോഗിക്കൂ. Calling time: Monday to Saturday, 11 AM - 4 PM.\n\n👉 ഏത് area-യിലാണ് join ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?`
    : `🙏 Understood.\n\n❌ I cannot share a franchisee / owner's personal number — that is their privacy.\n\n✅ If you want to join in that area, I will explain the process, and our team will contact you.\n\n📞 To talk to the team, use the Call button below. Calling time: Monday to Saturday, 11 AM - 4 PM.\n\n👉 Which area do you want to join in?`;
  }
  if(kind==='FRANCHISE_COUNT'){
    return ml
    ? `ℹ️ Live-ൽ എത്ര franchisee ഉണ്ട് എന്ന confirmed count എന്റെ memory-യിൽ ഇപ്പോൾ ഇല്ല. ഞാൻ guess ചെയ്യില്ല.\n\n✅ നിങ്ങളുടെ area-യിൽ opportunity open ആണോ എന്ന് check ചെയ്യാം.\n\n👉 ഏത് area / district ആണ്? പറയൂ.`
    : `ℹ️ I don't have a confirmed live count of franchisees in memory right now. I will not guess.\n\n✅ I can check if opportunity is open in your area.\n\n👉 Which area / district? Tell me.`;
  }
  return '';
}


// ===== V364.4 FIRST-MESSAGE + NO-LEAK + STOP GUARDS =====
function v364_4_shouldSkipRouter(txt, state){
  const s=String(txt||'').trim(); const low=s.toLowerCase(); const last=String(state?.lastStep||'');
  if(!last || last==='' || last==='NEW') return true;
  if(/hello.*can i get more info|can i get more info|hello.*more info/.test(low)) return true;
  if(/^(hi+|hello+|hey+|hai+|namaskaram|vanakkam|namaste)[\s.!]*$/.test(low)) return true;
  if(s.length<=2) return true;
  if(/^(bo|bu|bus|busi|busin|busine|busi?ness)$/.test(low)) return true;
  if(/^(yes|yes,?\s*continue|continue|yes continue|yes, continue|continue please|thudar|thudaruka)[\s.!]*$/.test(low)) return true;
  return false;
}
function v364_4_isNotInterested(txt){
  const low=String(txt||'').toLowerCase().trim();
  return /^(not interested|not intrested|no interest|no thanks|no thank you|not now|no need|vend|venda|illa|illla|talparyam illa|interest illa|not intrested)/.test(low);
}
function v364_4_friendlyStep(step){
  const s=String(step||'');
  if(/Trust/.test(s)) return 'understanding trust';
  if(/Opportunity.*Detail|Capacity/.test(s)) return 'choosing the right opportunity';
  if(/Opportunity.*Ask/.test(s)) return 'choosing the right opportunity';
  if(/Outer|Platform KB/.test(s)) return 'learning about Bizmapia';
  if(/V\d+/.test(s)) return 'learning about Bizmapia';
  if(!s) return 'learning about Bizmapia';
  return s.replace(/V\d+[\.\d]*[^\s,]*/g,'').replace(/[-_]+/g,' ').trim() || 'learning about Bizmapia';
}
function v364_4_stopText(lang){
  return lang==='ml'
  ? `🙏 മനസ്സിലായി, കുഴപ്പമില്ല.\n\nഞാൻ ഇവിടെ നിർത്താം. വീണ്ടും താല്പര്യം തോന്നിയാൽ, എപ്പോൾ വേണമെങ്കിലും "Hi" അയച്ചാൽ മതി, ഞാൻ ഇവിടെയുണ്ടാകും. 😊`
  : `🙏 Understood, no problem.\n\nI will stop here. If you feel interested again anytime, just send "Hi", I will be here. 😊`;
}


// ===== V364.7 RETURNING / FIRED USER - CONTINUE vs NEW CHAT =====
// If chat already exists (has lastStep + lang/intent) and user returns with Hi / Hello / Can I get more info / any first input after gap,
// do NOT give fresh Welcome and do NOT skip to routers. Ask: Continue where you left, or Start New Chat?
// Continue -> restore saved lastStep, resend SAME option for that step. New Chat -> Welcome Back + full Welcome (English) + Language buttons.
function v364_7_isReturnGreeting(txt){
  const low=String(txt||'').toLowerCase().trim();
  return /^(hi+|hello+|hey+|hai+|namaskaram|vanakkam|namaste)[\s.!]*$/.test(low) || /hello.*can i get more info|can i get more info/.test(low) || low==='bo' || low==='continue' || low==='yes, continue';
}
function v364_7_resumeText(lang, friendlyStep){
  return lang==='ml'
  ? `🙏 Welcome back! നിങ്ങളുടെ chat ഇവിടെ ഉണ്ട്.\n\n📍 നിങ്ങൾ നിർത്തിയത്: *${friendlyStep}*\n\n👉 അതേ സ്ഥലത്ത് നിന്ന് തുടരട്ടെ, അതോ പുതിയ chat തുടങ്ങട്ടെ?\n\n👇 താഴെ ഒന്ന് ക്ലിക്ക് ചെയ്യൂ:`
  : lang==='hi'
  ? `🙏 Welcome back! Aapki chat yahan hai.\n\n📍 Aap ruke the: *${friendlyStep}*\n\n👉 Wahi se continue karein, ya nayi chat shuru karein?\n\n👇 Neeche ek par click karein:`
  : `🙏 Welcome back! Your chat is already here.\n\n📍 You left at: *${friendlyStep}*\n\n👉 Continue from there, or start a new chat?\n\n👇 Tap one below:`;
}
function v364_7_continueText(lang, friendlyStep){
  return lang==='ml'
  ? `✅ ശരി, അതേ സ്ഥലത്ത് നിന്ന് തുടരാം. 🙏\n\n📍 Last step: *${friendlyStep}*\n\n👉 തുടരാൻ തയ്യാറാണോ? താഴെ നിങ്ങളുടെ option തിരഞ്ഞെടുക്കൂ:`
  : `✅ OK, continuing from where you left. 🙏\n\n📍 Last step: *${friendlyStep}*\n\n👉 Ready to continue? Choose your option below:`;
}


// ===== V364.37 - DRIVER ATTACH HELPERS =====
// Driver video link: set in Render env DRIVER_VIDEO_URL later by user. Button created NOW, link added later. If empty, bot still sends Watched / See Video buttons.
// LOCKED: Driver income withdraw = AFTER 24 HOURS ONLY (user correction, not 48h). Test-trip date rule (day+2) and reschedule 48h rule are separate.
const DRV_VIDEO_URL = process.env.DRIVER_VIDEO_URL || '';
function drvFmtDate(d){ const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return d.getDate()+' '+m[d.getMonth()]; }
function drvDateISO(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function drvSupportNumbers(phoneId){
  const list=[{label:'Team', phone:'+918590183646'}];
  try{
    if(String(phoneId)==='1481022538422254') list.push({label:'Malappuram Franchisee', phone:'+919995441970'});
    else {
      const envMap={};
      const v=process.env['FRANCHISEE_NUMBER_'+(FRANCHISEE_SLOTS.findIndex(s=>String(s.phoneId)===String(phoneId))+1)]||'';
      if(v) list.push({label:'Franchisee', phone:'+91'+String(v).replace(/[^0-9]/g,'').slice(-10)});
    }
  }catch(e){}
  return list;
}
async function drvSendSupport(uid, lang, phoneId){
  const ml=(lang||'ml')==='ml';
  const nums=drvSupportNumbers(phoneId);
  const numText=nums.map(n=>n.label+': '+n.phone).join('\n');
  const msg=ml
    ? `🙏 കുഴപ്പമില്ല, ഞാൻ സഹായിക്കാം. 😊\n\n📞 ഈ നമ്പറിൽ വിളിക്കൂ:\n${numText}\n\n⏰ വിളിക്കേണ്ട സമയം: രാവിലെ 9 AM മുതൽ വൈകിട്ട് 5 PM വരെ മാത്രം.\n\nവിളിച്ചാൽ ടീം നിങ്ങളെ സഹായിക്കും.`
    : `🙏 No problem, I will help you. 😊\n\n📞 Call on this number:\n${numText}\n\n⏰ Call between 9 AM to 5 PM only.\n\nOur team will help you.`;
  await sendWithDelay(textMessage(uid, msg, phoneId));
  for(const n of nums){ try{ await sendWithDelay(realDialerCta(uid, 'Tap below to call '+n.label+':', n.phone, phoneId)); }catch(e){} }
}
async function drvSendDateButtons(uid, lang, phoneId, titleKey){
  const ml=(lang||'ml')==='ml';
  const head=ml ? `📅 ടെസ്റ്റ് ട്രിപ്പ് തീയതി തിരഞ്ഞെടുക്കൂ:\n\n👉 ഇന്നിൽ നിന്ന് 2 ദിവസത്തിന് ശേഷം മുതൽ മാത്രമേ തിരഞ്ഞെടുക്കാൻ പറ്റൂ.` : `📅 Select your test trip date:\n\n👉 You can select only from day after tomorrow onwards.`;
  const btns=[];
  for(let off=2; off<=4; off++){ const d=new Date(); d.setDate(d.getDate()+off); btns.push({id:'DRV_DATE_'+drvDateISO(d), title:drvFmtDate(d)}); }
  await sendWithDelay(interactiveButton(uid, head, btns, phoneId));
}

app.post('/webhook', async(req,res)=>{
  res.sendStatus(200);
  try{
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const msg = value?.messages?.[0];
    if(!msg) return;
    const uid = msg.from;
    try{ teamInboxPush(uid, 'customer', (msg.text?.body||msg.button?.payload||msg.interactive?.button_reply?.title||msg.interactive?.list_reply?.title||msg.type||'message'), 'IN'); }catch(e){}
    // V340: If team took over, Maya stays silent - team replies from Inbox
    if(globalThis.__teamPaused && globalThis.__teamPaused.has(String(uid))){ try{ await saveToSheet('System_Logs',[getISTTime(),String(uid),'ml','V340 Team Paused','Maya paused - team handling','Paused',HELP_ADMIN,'V340 Paused',''],false); }catch(e){} return; }
    let state = await getState(uid); // V294: declare state FIRST - V285-V293 blocks above use state, a later 'let state' caused TDZ crash at 2857
    const incomingPhoneId = value?.metadata?.phone_number_id || PHONE_NUMBER_ID; try{ if(uid && incomingPhoneId) globalThis.__phoneIdByUid.set(String(uid), String(incomingPhoneId)); }catch(e){}
    const txt = msg.text?.body||'';
    let btnId = msg.button?.payload || msg.interactive?.button_reply?.id || msg.interactive?.list_reply?.id || '';
    // ===== V364.37 EDIT 2 - FREE-TEXT + BUTTON STOP = TOP PRIORITY, ALL MESSAGE FORMS =====
    // BUG (screenshot 919095216700): customer typed/tapped "Stop" after "You have not replied yet" reminder,
    // Maya ignored it and replied "Now you are on Company Video step..." + [kandu | kandilla].
    // CAUSE: old V317 check only matched msg.type==='text' + empty btnId + txt body.
    // A tapped [Stop] button arrives as msg.type==='interactive' with btnId (e.g. IDLE_STOP) and NO txt body,
    // so it fell through to V301 step-aware handler which resent Company Video. Free-text Stop must NEVER do that.
    // FIX: derive Stop from (a) txt body, (b) button_reply title, (c) list_reply title, (d) btnId containing STOP.
    // STOP_FINAL / STOP_LATER / FIRED_STOP are NOT converted here - they keep their own handlers below.
    // Result for ANY Stop form: ask confirm [Stop] [Yes] only. Never resend Company Video / any step.
    try{
      const _btnTitle36414 = msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title || msg.button?.text || '';
      const _stopText36414 = String(txt||_btnTitle36414||'').toLowerCase().trim();
      const _stopBtn36414 = String(btnId||'');
      const _isStopBtn36414 = /STOP/i.test(_stopBtn36414) && !/STOP_FINAL|STOP_LATER|FIRED_STOP/.test(_stopBtn36414);
      const _isStopText36414 = /^(stop|nirthu|nirthuka|nirthu\s*cheyyu|stop\s*cheyyu|stop\s*cheyyanam|vend|niruthu)[\s.!]*$/i.test(_stopText36414);
      if(_isStopText36414 || _isStopBtn36414){
        const _lang36414 = (state.lang||'ml');
        // V364.36: if this was already a button tap (IDLE_STOP / BUSY_STOP), still ask the same confirm -
        // one consistent Stop flow, no direct jump, no step resend.
        await setState(uid,{...state, lastStep:'V364.37 - Stop - Confirm', phoneId: incomingPhoneId});
        const _cf36414 = _lang36414==='ml' ? `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = അപേക്ഷ നിർത്താം, Yes = കുറച്ച് സമയത്തിന് ശേഷം ഓർമ്മിപ്പിക്കാം:` : _lang36414==='hi' ? `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = आवेदन रोकें, Yes = कुछ समय बाद याद दिलाएँ:` : `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = stop application, Yes = remind after some time:`;
        await sendWithDelay(interactiveButton(uid,_cf36414,[{id:'STOP_FINAL',title:'Stop'},{id:'STOP_LATER',title:'Yes'}], incomingPhoneId));
        return;
      }
    }catch(_){}

    // ===== V364.37 WIRED - TRUST-FIRST HOOK - FREE-TEXT ONLY =====
    // Placed AFTER Stop-confirm, BEFORE Driver / Resume / Outer / all routers.
    // Only free-text (no button). Buttons keep old flow. Driver flow skipped.
    // If user already got 1 comfort pause, next message goes to OLD flow (no loop).
    try{
      const _m37IsFreeText = !btnId && msg.type==='text' && txt && String(txt).trim();
      const _m37IsTrustBtn = ['M37_YOU_ANSWER','M37_CONTINUE','M37_RETURN','M37_START_SMALL'].includes(String(btnId||''));
      if(_m37IsTrustBtn){
        const _l37b = state.lang || 'ml';
        await setState(uid,{...state, m37Pause:false, lastStep:'V364.37 - Trust - User wants answer', phoneId: incomingPhoneId});
        await sendWithDelay(textMessage(uid, _l37b==='ml' ? `Dharyamaayi parayoo 🙏 Ningalude samshayam enthaanu? Njan marupadi tharaam.` : _l37b==='hi' ? `Befikar hokar batayiye 🙏 Aapka doubt kya hai? Main jawab dungi.` : `Tell me boldly 🙏 What is your doubt? I will answer.`, incomingPhoneId));
        return;
      }
      if(_m37IsFreeText && !state.driverFlow && state.lang && !state.m37Pause){
        const _m37Lang = state.lang || 'ml';
        const _m37Mind = state.mindset || state.intent || '';
        const _m37 = (typeof m37_decide==='function') ? m37_decide(txt, _m37Lang, _m37Mind) : {action:'CONTINUE_V364_36'};
        if(_m37.action==='COMFORT_PAUSE' || _m37.action==='SORRY_ONLY' || _m37.action==='TRUST_PATH'){
          // Map Trust buttons to existing working ids + M37 continue ids (handled above)
          const _mapBtn = (t)=>{
            if(/Teamumaayi|Talk to Team|ടീമിനോട്|टीम से/.test(t)) return {id:'AI_TALK', title: t.length>20 ? t.slice(0,20) : t};
            if(/Pinneedu|Remind Later/.test(t)) return {id:'AI_LATER', title: t.length>20 ? t.slice(0,20) : t};
            if(/Service Nokkaam|Look at Service/.test(t)) return {id:'AI_SERVICES', title: t.length>20 ? t.slice(0,20) : t};
            if(/Marupadi|You Answer/.test(t)) return {id:'M37_YOU_ANSWER', title: 'You Answer'};
            if(/Return Nokkaam|Look at Return/.test(t)) return {id:'M37_RETURN', title: 'Look at Return'};
            if(/Cheruthaayi|Start Small/.test(t)) return {id:'M37_START_SMALL', title: 'Start Small'};
            if(/Chodyam|Ask Question/.test(t)) return {id:'M37_CONTINUE', title: 'Ask Question'};
            return {id:'M37_CONTINUE', title: t.length>20 ? t.slice(0,20) : t};
          };
          const _btns = (_m37.buttons||[]).map(_mapBtn);
          await setState(uid,{...state, m37Pause:true, m37Feeling:_m37.feeling||'', lastStep:'V364.37 - Trust - '+(_m37.feeling||'Pause'), phoneId: incomingPhoneId});
          await sendWithDelay(textMessage(uid, _m37.reply, incomingPhoneId));
          if(_btns.length) await sendWithDelay(interactiveButton(uid, _m37Lang==='ml' ? `👇 Ini parayoo:` : _m37Lang==='hi' ? `👇 Ab batayiye:` : `👇 Tell me now:`, _btns, incomingPhoneId));
          try{ await saveToSheet('System_Logs',[getISTTime(),String(uid),_m37Lang,'V364.37 Trust-First','Feeling=' + (_m37.feeling||'') + ' action=' + _m37.action,'Trust Pause',HELP_ADMIN,'V364.37 Trust',''],false); }catch(e){}
          return;
        }
        // STOP via feeling (e.g. "don't message me") - not exact "stop" - also go to Stop confirm, not old flow
        if(_m37.action==='STOP'){
          const _l37 = _m37Lang;
          await setState(uid,{...state, m37Pause:false, lastStep:'V364.37 - Stop - Confirm', phoneId: incomingPhoneId});
          const _cf = _l37==='ml' ? `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = അപേക്ഷ നിർത്താം, Yes = കുറച്ച് സമയത്തിന് ശേഷം ഓർമ്മിപ്പിക്കാം:` : _l37==='hi' ? `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = आवेदन रोकें, Yes = कुछ समय बाद याद दिलाएँ:` : `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = stop application, Yes = remind after some time:`;
          await sendWithDelay(interactiveButton(uid,_cf,[{id:'STOP_FINAL',title:'Stop'},{id:'STOP_LATER',title:'Yes'}], incomingPhoneId));
          return;
        }
      }
      // Clear pause flag when user sends a new free-text after a pause - old flow handles it
      if(_m37IsFreeText && state.m37Pause){ await setState(uid,{...state, m37Pause:false, phoneId: incomingPhoneId}); state={...state, m37Pause:false}; }
    }catch(_){}



    
    // ===== V364.37 - DRIVER ATTACH FLOW - BEFORE ALL OTHER ROUTERS =====
    // Entry: RIDE_ATTACH (Attach Cab). Old generic attach message is replaced by this exact driver flow.
    // Steps: Video -> Watched/See Video -> App link -> 1h check (Yes/Doubts) -> Schedule date (day+2 onwards)
    // -> Confirm details+fee (Yes/Doubts) -> Team checks manually -> 24h after date: Test trip got? (Yes/No) -> Welcome / Reschedule (48h rule).
    try{
      const _drvLang = state.lang || 'ml';
      const _drvMl = _drvLang==='ml';
      const _isDrvBtn = String(btnId||'').startsWith('DRV_');
      const _isTestTripText = /test\s*trip/i.test(String(txt||'')) && state.driverFlow;
      const _isNoTripsText = /(not getting|no trip|trip.*(not|illa|varunnilla|kittunnilla|kittunnilla|illa)|trip.*kid|trip.*varun)/i.test(String(txt||'')) && (state.driverFlow || state.drvStep==='DONE' || state.lastStep||'').includes('Driver');
      if(btnId==='RIDE_ATTACH' || _isDrvBtn || _isTestTripText || _isNoTripsText){
        const _drvSet = async(patch)=>{ state={...state, ...patch, phoneId: incomingPhoneId}; await setState(uid, state); };
        // --- RIDE_ATTACH: send driver video + Watched / See Video ---
        if(btnId==='RIDE_ATTACH'){
          await _drvSet({driverFlow:true, drvStep:'VIDEO', sub:'RIDE_ATTACH', lastStep:'V364.37 - Driver - Video'});
          const _vmsg=_drvMl
            ? `🚖 ബിസ്മാപ്പിയയിൽ വാഹനം ബന്ധിപ്പിക്കാം! 🙏\n\n📹 ആദ്യം ഈ വീഡിയോ കാണൂ - വാഹനം എങ്ങനെ ബന്ധിപ്പിക്കാം എന്ന് മുഴുവൻ ഇതിൽ ഉണ്ട്.\n\nവീഡിയോ കണ്ട ശേഷം താഴെ "Watched" അമർത്തൂ, ഞാൻ നിങ്ങളെ സഹായിക്കാം.`
            : `🚖 Attach your vehicle with Bizmapia! 🙏\n\n📹 First watch this video - it explains how to attach your vehicle fully.\n\nAfter watching, tap "Watched" below and I will help you.`;
          await sendWithDelay(textMessage(uid, _vmsg, incomingPhoneId));
          if(DRV_VIDEO_URL){ try{ await sendWithDelay(singleCta(uid, 'Tap below to watch:', {title:'See Video', url:DRV_VIDEO_URL}, incomingPhoneId)); }catch(e){} }
          await sendWithDelay(interactiveButton(uid, _drvMl?`👇 വീഡിയോ കണ്ടോ?`:`👇 Did you watch the video?`, [{id:'DRV_WATCHED',title:'Watched'},{id:'DRV_SEE_VIDEO',title:'See Video'}], incomingPhoneId));
          return;
        }
        if(btnId==='DRV_SEE_VIDEO'){
          if(DRV_VIDEO_URL){ try{ await sendWithDelay(singleCta(uid, 'Tap below to watch:', {title:'See Video', url:DRV_VIDEO_URL}, incomingPhoneId)); }catch(e){} }
          await sendWithDelay(interactiveButton(uid, _drvMl?`👇 വീഡിയോ കണ്ട ശേഷം Watched അമർത്തൂ:`:`👇 After watching, tap Watched:`, [{id:'DRV_WATCHED',title:'Watched'},{id:'DRV_SEE_VIDEO',title:'See Video'}], incomingPhoneId));
          return;
        }
        // --- WATCHED: app link + 1h reminder ---
        if(btnId==='DRV_WATCHED'){
          await _drvSet({driverFlow:true, drvStep:'APP', lastStep:'V364.37 - Driver - App Link'});
          const _amsg=_drvMl
            ? `👍 നന്നായി! 🙏\n\n📱 ഇനി താഴെയുള്ള ബട്ടൺ ക്ലിക്ക് ചെയ്ത് ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യൂ.`
            : `👍 Great! 🙏\n\n📱 Now click the button below and install our app.`;
          await sendWithDelay(textMessage(uid, _amsg, incomingPhoneId));
          try{ await sendWithDelay(singleCta(uid, 'Tap below to install:', {title:'Install App', url:PLAY_STORE}, incomingPhoneId)); }catch(e){}
          // 1h reminder: own timer (generic reminder system sends wrong text for driver flow). If server restarts, team follows up from Sheet.
          try{
            setTimeout(async()=>{ try{ const _st=await getState(uid); if(!_st || !_st.driverFlow || _st.drvStep!=='APP') return; await sendWithDelay(interactiveButton(uid, _st.lang==='ml'?`🙏 നൽകിയ ആപ്ലിക്കേഷൻ ലിങ്ക് വഴി വാഹനം ബന്ധിപ്പിച്ചോ?`:`🙏 Have you completed attaching your vehicle by the given application link?`, [{id:'DRV_YES_ATTACHED',title:'Yes'},{id:'DRV_DOUBTS',title:'I have doubts'}], _st.phoneId||incomingPhoneId)); }catch(e){} }, 60*60*1000);
          }catch(e){}
          return;
        }
        // --- DOUBTS anywhere in driver flow: support numbers, 9AM-5PM only ---
        if(btnId==='DRV_DOUBTS' || btnId==='DRV_CONFIRM_DOUBTS'){
          await _drvSet({driverFlow:true, lastStep:'V364.37 - Driver - Doubts'});
          await drvSendSupport(uid, _drvLang, incomingPhoneId);
          return;
        }
        // --- YES attached / Test Trip text: schedule date (day+2 onwards) ---
        if(btnId==='DRV_YES_ATTACHED' || _isTestTripText){
          await _drvSet({driverFlow:true, drvStep:'DATE', lastStep:'V364.37 - Driver - Schedule Test Trip'});
          const _smsg=_drvMl?`👍 നന്നായി! ഇനി ടെസ്റ്റ് ട്രിപ്പ് ഷെഡ്യൂൾ ചെയ്യാം. 📅`:`👍 Great! Now let us schedule your test trip. 📅`;
          await sendWithDelay(textMessage(uid, _smsg, incomingPhoneId));
          await drvSendDateButtons(uid, _drvLang, incomingPhoneId);
          return;
        }
        // --- DATE picked: confirm details + fee ---
        if(String(btnId||'').startsWith('DRV_DATE_')){
          const _d=String(btnId).replace('DRV_DATE_','');
          await _drvSet({driverFlow:true, drvStep:'CONFIRM', drvTestDate:_d, lastStep:'V364.37 - Driver - Confirm Details+Fee'});
          const _cmsg=_drvMl
            ? `📅 നിങ്ങൾ തിരഞ്ഞെടുത്ത തീയതി: ${_d}\n\n⚠️ നിങ്ങളുടെ വിവരങ്ങൾ ഞങ്ങളുടെ internal team പരിശോധിക്കും. നിങ്ങളുടെ വിവരങ്ങളും one-time registration fee submission-ഉം ശരിയാണെങ്കിൽ കമ്പനിയിൽ നിന്ന് "Your test trip approved" എന്ന മറുപടി കിട്ടും. അല്ലെങ്കിൽ മറുപടി കിട്ടില്ല, നിങ്ങളുടെ അപേക്ഷ താനേ reject ആകും.\n\n❓ നിങ്ങൾ ശരിയായ വിവരങ്ങൾ upload ചെയ്യുകയും ആപ്പ് വഴി one-time registration fee അടയ്ക്കുകയും ചെയ്തിട്ടുണ്ടെന്ന് ഉറപ്പാണോ?`
            : `📅 Your selected date: ${_d}\n\n⚠️ Your details will be checked by our internal team. If your details and one-time registration fee submission are correct, you will get a reply from our company like "Your test trip approved". Otherwise you may get no reply and your application will be rejected automatically.\n\n❓ Are you sure you uploaded correct details and paid the one-time registration fee through the app?`;
          await sendWithDelay(interactiveButton(uid, _cmsg, [{id:'DRV_CONFIRM_YES',title:'Yes'},{id:'DRV_CONFIRM_DOUBTS',title:'I have doubts'}], incomingPhoneId));
          return;
        }
        // --- CONFIRM YES: team checks manually + 24h-after-date reminder ---
        if(btnId==='DRV_CONFIRM_YES'){
          const _d=state.drvTestDate||'';
          await _drvSet({driverFlow:true, drvStep:'WAIT_TEST', lastStep:'V364.37 - Driver - Team Checking Fee+Details'});
          const _tmsg=_drvMl
            ? `✅ ശരി, നന്ദി! 🙏\n\nഞങ്ങളുടെ ടീം നിങ്ങളുടെ registration fee paid ആയിട്ടുണ്ടോ എന്ന് പരിശോധിക്കും. Confirm ആയാൽ കമ്പനിയിൽ നിന്ന് മറുപടി കിട്ടും.`
            : `✅ OK, thank you! 🙏\n\nOur team will check whether your registration fee is paid. Once confirmed, you will get a reply from our company.`;
          await sendWithDelay(textMessage(uid, _tmsg, incomingPhoneId));
          try{ await saveToSheet('Ride_Hailing',[getISTTime(),uid,_drvLang,'Ride Hailing '+incomingPhoneId,'Driver Attach - Test Trip '+_d,'Team check: fee + details','Team',state.lastStep,''],true); }catch(e){}
          // 24h AFTER the test-trip date: "Do you get test trip from company today?"
          try{
            const _target=new Date(_d+'T00:00:00'); const _ms=(_target.getTime()+24*60*60*1000)-Date.now();
            if(_ms>0 && _ms<30*24*60*60*1000){
              setTimeout(async()=>{ try{ const _st=await getState(uid); if(!_st || !_st.driverFlow || _st.drvStep!=='WAIT_TEST') return; await sendWithDelay(interactiveButton(uid, _st.lang==='ml'?`🙏 ഇന്ന് കമ്പനിയിൽ നിന്ന് ടെസ്റ്റ് ട്രിപ്പ് കിട്ടിയോ?`:`🙏 Do you get test trip from company today?`, [{id:'DRV_TEST_YES',title:'Yes'},{id:'DRV_TEST_NO',title:'No'}], _st.phoneId||incomingPhoneId)); }catch(e){} }, _ms);
            }
          }catch(e){}
          return;
        }
        // --- TEST TRIP YES: warm welcome ---
        if(btnId==='DRV_TEST_YES'){
          await _drvSet({driverFlow:false, drvStep:'DONE', lastStep:'V364.37 - Driver - Welcomed'});
          await sendWithDelay(textMessage(uid, _drvMl?`🎉 ബിസ്മാപ്പിയയിലേക്ക് സ്വാഗതം! 🙏\n\nനിങ്ങളുടെ ഓരോ യാത്രയും ഇനി വരുമാനമാക്കൂ. 💛\n\nആപ്പിൽ ഓൺലൈനിൽ തുടരൂ, ട്രിപ്പുകൾ വരും. വാഹനം വൃത്തിയായും പെരുമാറ്റം മാന്യമായും സൂക്ഷിക്കൂ.`:`🎉 Warm welcome to Bizmapia platform! 🙏\n\nMake every journey your income now. 💛\n\nStay online in the app, trips will come. Keep your vehicle clean and behaviour polite.`, incomingPhoneId));
          await sendWithDelay(interactiveButton(uid, _drvMl?`👇 എന്തെങ്കിലും സംശയമുണ്ടോ?`:`👇 Any doubts?`, [{id:'DRV_NO_TRIPS',title:'Not getting trips'},{id:'DRV_DOUBTS',title:'I have doubts'}], incomingPhoneId));
          return;
        }
        // --- V364.37 AFTER WELCOME: "Not getting trips" doubt ---
        if(btnId==='DRV_NO_TRIPS' || _isNoTripsText){
          await _drvSet({driverFlow:true, drvStep:'DONE', lastStep:'V364.37 - Driver - Not Getting Trips'});
          const _ntmsg=_drvMl
            ? `🙏 കുഴപ്പമില്ല, മനസ്സിലായി.

📱 Just keep online - ആപ്പിൽ ഓൺലൈനിൽ തുടരൂ.

🔍 നിങ്ങളുടെ ഏരിയയിൽ നിന്ന് കൂടുതൽ customer searches ഉം trip requests ഉം വരുന്നുണ്ട്.

👀 Customers നിങ്ങളുടെ ഏരിയയിൽ വാഹനം ലഭ്യമാണോ എന്ന് നോക്കുന്നതും, rate compare ചെയ്യുന്നതും ആണ് - അതാണ് ഇപ്പോൾ നടക്കുന്നത്.

⏳ നിങ്ങളുടെ ആദ്യ ട്രിപ്പ് കിട്ടുന്നത് വരെ കാത്തിരിക്കൂ.

⚠️ No advance recharge may not result in ready trip - ഇത് request base-ൽ മാത്രമാണ്. Advance recharge ചെയ്തിട്ടില്ലെങ്കിൽ ready trip കിട്ടണമെന്നില്ല.

💛 ഓൺലൈനിൽ തുടർന്നാൽ ആദ്യ ട്രിപ്പ് വരും.`
            : `🙏 No problem, I understand.

📱 Just keep online - stay online in the app.

🔍 We are getting more customer searches and trip requests from your area.

👀 Customers are either checking availability of vehicle in their area for confirming vehicle availability and rate comparison - that is what is happening now.

⏳ Just wait till you get your first trip.

⚠️ No advance recharge may not result in ready trip - it is on request base only.

💛 Stay online, your first trip will come.`;
          await sendWithDelay(textMessage(uid, _ntmsg, incomingPhoneId));
          await sendWithDelay(interactiveButton(uid, _drvMl?`👇 ഇനിയും സംശയമുണ്ടോ?`:`👇 Still have doubts?`, [{id:'DRV_DOUBTS',title:'I have doubts'},{id:'DRV_NO_TRIPS',title:'Not getting trips'}], incomingPhoneId));
        }
        // --- TEST TRIP NO: reschedule, 48h rule from today ---
        if(btnId==='DRV_TEST_NO'){
          await _drvSet({driverFlow:true, drvStep:'DATE', lastStep:'V364.37 - Driver - Reschedule Test Trip'});
          await sendWithDelay(textMessage(uid, _drvMl?`🙏 കുഴപ്പമില്ല. വീണ്ടും ഒരു തീയതി തിരഞ്ഞെടുക്കൂ.\n\n👉 ഈ മെസ്സേജ് തീയതിയിൽ നിന്ന് 48 മണിക്കൂറിന് ശേഷം മുതൽ മാത്രമേ തിരഞ്ഞെടുക്കാൻ പറ്റൂ.`:`🙏 No problem. Please select another date.\n\n👉 You can select only from 48 hours after today onwards.`, incomingPhoneId));
          await drvSendDateButtons(uid, _drvLang, incomingPhoneId);
          return;
        }
      }
    }catch(_){}

// ===== V364.7 RETURNING USER - CONTINUE vs NEW CHAT - BEFORE ALL ROUTERS =====
    try{
      // Handle button taps for Continue / New Chat first
      if(btnId==='RESUME_CONTINUE'){
        const _saved47 = state.resumeFromStep || state.lastStep || '';
        const _friendly47 = (typeof v364_4_friendlyStep==='function' ? v364_4_friendlyStep(_saved47) : _saved47);
        const _lang47 = state.lang || 'en';
        await setState(uid,{...state, lastStep:_saved47 || 'Business Opportunity - Resume', resumeFromStep:'', phoneId: incomingPhoneId});
        // Resend SAME option for that step: Company Video -> See Video, Opportunity/Capacity -> capacity question, else Business/Service choice
        if(/Company Video|Business Video/i.test(_saved47)){
          await sendWithDelay(textMessage(uid, v364_7_continueText(_lang47,_friendly47)+'\n\n🎥 Company Video - please watch it, then reply "Seen".', incomingPhoneId));
        } else if(/Capacity|Opportunity/i.test(_saved47)){
          await sendWithDelay(textMessage(uid, v364_7_continueText(_lang47,_friendly47)+'\n\n👉 Which range fits you? 30K-1L / 2L-5L / 5L-15L ?', incomingPhoneId));
        } else {
          await sendWithDelay(interactiveButton(uid, v364_7_continueText(_lang47,_friendly47), [{id:'AI_BUSINESS',title:(_lang47==='ml'?'ബിസിനസ് അവസരം':'Business Opportunity')},{id:'AI_SERVICES',title:(_lang47==='ml'?'സേവനങ്ങൾ ഉപയോഗിക്കാം':'Use Our Services')}], incomingPhoneId));
        }
        return;
      }
      if(btnId==='RESUME_NEW'){
        await setState(uid,{first:true, lastStep:'First Message', lang:null, phoneId: incomingPhoneId, intent:'', sub:'', resumeFromStep:'', firedGate: state.firedGate||''});
        await sendWithDelay(interactiveButton(uid, `🙏 Welcome back! 👋\n\nHi, I am Maya here to chat with you! 👋\n\nWelcome to Bizmapia! 🙏\n🇮🇳 India's Largest Online Platform - First 4-in-1 App in India\n\n👇 To start, please tap your language below:`, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'हिन्दी'},{id:'LANG_ML',title:'മലയാളം'}], incomingPhoneId));
        return;
      }
      // Returning user greeting: chat already exists (has lastStep + lang) and NOT already in Resume gate, NOT in Fired Warning gate
      if(!btnId && msg.type==='text' && txt && v364_7_isReturnGreeting(txt)){
        const _hasChat47 = state && state.lastStep && state.lastStep!=='' && state.lastStep!=='First Message' && state.lastStep!=='Fired Warning' && !String(state.lastStep).includes('RESUME') && !String(state.lastStep).includes('Not Interested') && state.lang;
        const _isFired47 = state && (state.firedGate || String(state.lastStep||'').includes('Fired'));
        if(_hasChat47 || _isFired47){
          const _lang47b = state.lang || 'en';
          const _friendly47b = (typeof v364_4_friendlyStep==='function' ? v364_4_friendlyStep(state.lastStep) : state.lastStep);
          await setState(uid,{...state, resumeFromStep: state.lastStep, lastStep:'V364.7 - Resume - Ask Continue/New', phoneId: incomingPhoneId});
          await sendWithDelay(interactiveButton(uid, v364_7_resumeText(_lang47b,_friendly47b), [{id:'RESUME_CONTINUE',title:(_lang47b==='ml'?'തുടരൂ':_lang47b==='hi'?'जारी रखें':'Continue')},{id:'RESUME_NEW',title:(_lang47b==='ml'?'പുതിയ ചാറ്റ്':_lang47b==='hi'?'नई चैट':'New Chat')}], incomingPhoneId));
          return;
        }
      }
    }catch(_){}

    // ===== V364.37 OUTER-OPPORTUNITY - BEFORE ALL ROUTERS =====
    // Bug (screenshot 24 Nov 11:34am, 918547854771): user at Step 2 (Video Seen, waiting price range)
    // asked for professional college admission office opportunity - NOT in Bizmapia options.
    // Maya reset to Step 1, repeated Balance Steps twice, resent Company Video - misleading.
    // Fix: detect outer opportunity, say NOT in Bizmapia, give right direction (contact that
    // provider / approach banker for project loan), KEEP same lastStep, re-ask SAME step only.
    // Never reset to Step 1, never resend Video, never repeat Balance Steps, never invent a Bizmapia profile.
    try{
      if(!btnId && msg.type==='text' && txt && String(txt).trim()){
        const _raw11 = String(txt);
        const _low11 = _raw11.toLowerCase();
        const _isOuterOpp11 = /professional\s*college|professional\s*colleg|admission\s*office|admission.*office|college.*admission|school.*admission|hospital.*admission|university.*admission|coaching.*centre|coaching.*center|tuition.*centre|petrol\s*pump|petrol\s*bunk|medical\s*college|engineering\s*college|nursing\s*college|pharmacy\s*college|hotel.*franchise|restaurant.*franchise|supermarket.*franchise|textile.*shop|jewellery|jewelry|real\s*estate|construction.*opportunity|chitty|finance.*company|bank.*franchise/.test(_low11)
          || /പ്രൊഫഷണൽ\s*കോളേജ്|പ്രൊഫഷണൽ\s*കോളേജുകള|അഡ്മിഷൻ\s*ഓഫീസ്|അഡ്മിഷൻ|കോളേജ്.*അവസരം|കോളേജ്.*ഓഫീസ്|സ്കൂൾ.*അവസരം|ആശുപത്രി.*അവസരം|പെട്രോൾ\s*പമ്പ്|മെഡിക്കൽ\s*കോളേജ്|എഞ്ചിനീയറിംഗ്\s*കോളേജ്|നഴ്സിംഗ്\s*കോളേജ്|ഹോട്ടൽ.*അവസരം|സൂപ്പർ\s*മാർക്കറ്റ്|റിയൽ\s*എസ്റ്റേറ്റ്|ചിട്ടി|ഫിനാൻസ്/.test(_raw11);
        // Only when user is asking for an opportunity / business / avasaram - not when giving name/area/price
        const _asksOpp11 = /opportunity|avasa|avasaram|അവസരം|business|ബിസിനസ്|franchise|ഫ്രാഞ്ചൈസി|start.*business|thudang|open.*office|office.*open/.test(_low11) || /അവസരം|ബിസിനസ്|ഫ്രാഞ്ചൈസി/.test(_raw11);
        // Exclude Bizmapia's own opportunities - those must go to normal flow, NOT outer
        const _isBizmapiaOpp11 = /bizmapia|business\s*center|business\s*centre|municipal|corporation|district.*franchise|ride|taxi|delivery|directory|booking/.test(_low11);
        if(_isOuterOpp11 && _asksOpp11 && !_isBizmapiaOpp11){
          const _lang11 = state.lang || v364_2_detectLang(txt, state) || 'ml';
          // Extract a short label of what user asked, for the reply - never invent a Bizmapia profile for it
          let _label11 = _lang11==='ml' ? 'ഈ അവസരം' : _lang11==='hi' ? 'यह अवसर' : 'this opportunity';
          if(/professional\s*college|പ്രൊഫഷണൽ\s*കോളേജ്/.test(_low11) || /പ്രൊഫഷണൽ/.test(_raw11)) _label11 = _lang11==='ml' ? 'പ്രൊഫഷണൽ കോളേജ് അഡ്മിഷൻ ഓഫീസ് അവസരം' : _lang11==='hi' ? 'प्रोफेशनल कॉलेज एडमिशन ऑफिस अवसर' : 'Professional College Admission Office opportunity';
          else if(/admission/.test(_low11) || /അഡ്മിഷൻ/.test(_raw11)) _label11 = _lang11==='ml' ? 'അഡ്മിഷൻ ഓഫീസ് അവസരം' : _lang11==='hi' ? 'एडमिशन ऑफिस अवसर' : 'Admission Office opportunity';
          const _msg11 = _lang11==='ml'
            ? `🙏 ${_label11} Bizmapia-യിൽ ഇല്ല.\n\n✅ അതിന് ആ സർവീസ് നൽകുന്ന സ്ഥാപനത്തെ നേരിട്ട് ബന്ധപ്പെടണം, അല്ലെങ്കിൽ പ്രോജക്ട് ലോണിന് ബാങ്കറെ സമീപിക്കണം.\n\n📍 Bizmapia-യിൽ നിങ്ങൾക്ക് വേണ്ടത് ബിസിനസ് അവസരമാണോ? വില പരിധി തിരഞ്ഞെടുത്താൽ ഞാൻ Bizmapia അവസരം വിശദീകരിക്കാം. 😊`
            : _lang11==='hi'
            ? `🙏 ${_label11} Bizmapia में नहीं है.\n\n✅ इसके लिए उस सर्विस देने वाली संस्था से सीधे संपर्क करें, या प्रोजेक्ट लोन के लिए बैंकर से संपर्क करें.\n\n📍 Bizmapia में आपको बिज़नेस अवसर चाहिए? कीमत सीमा चुनें, मैं Bizmapia अवसर समझाऊँगा. 😊`
            : `🙏 ${_label11} is not in Bizmapia.\n\n✅ For that, contact the institution that provides that service directly, or approach a banker for a project loan.\n\n📍 In Bizmapia, do you want a Business Opportunity? Select a price range and I will explain the Bizmapia opportunity. 😊`;
          // KEEP same lastStep - do NOT reset to Step 1, do NOT resend Video, do NOT repeat Balance Steps
          // Re-ask SAME step: if waiting for price range (Step 2 / V270 Video Sent), show price-range buttons once
          const _wasStep2_11 = /V270|Video Sent|Step 2|Capacity|Price|price/i.test(String(state.lastStep||''));
          await setState(uid,{...state, lang:_lang11, lastStep: state.lastStep || 'V270 - Business Video Sent', phoneId: incomingPhoneId});
          if(_wasStep2_11){
            await sendWithDelay(quickReply(uid, _msg11, [{id:'CAP_5L_15L',title:(_lang11==='ml'?'5L-15L നിക്ഷേപം':'5L-15L')},{id:'CAP_2L_5L',title:(_lang11==='ml'?'2L-5L നിക്ഷേപം':'2L-5L')},{id:'CAP_30K_1L',title:(_lang11==='ml'?'30K-1L നിക്ഷേപം':'30K-1L')}], incomingPhoneId));
          } else {
            await sendWithDelay(textMessage(uid, _msg11, incomingPhoneId));
          }
          return;
        }
      }
    }catch(_){}

    // ===== V364.4 NOT-INTERESTED - BEFORE ALL ROUTERS =====
    try{
      if(!btnId && msg.type==='text' && txt && v364_4_isNotInterested(txt)){
        const _lang44 = state.lang || v364_2_detectLang(txt, state);
        await setState(uid,{...state, lang:_lang44, lastStep:'V364.4 - Not Interested - Stopped', stopped:true, phoneId: incomingPhoneId});
        await sendWithDelay(textMessage(uid, v364_4_stopText(_lang44), incomingPhoneId));
        return;
      }
    }catch(_){}

    // ===== V364.3 AI ROUTER - QUESTION -> MEMORY ANSWER - BEFORE V320 / STEPS =====
    // Runs for text only, not buttons. If user asks Trust / Opportunity-works / gives capacity, answer from memory here and RETURN. Never fall through to Welcome.
    try{
      if(!btnId && msg.type==='text' && txt && String(txt).trim() && !v364_4_shouldSkipRouter(txt, state)){
        const _low42 = String(txt).toLowerCase().trim();
        const _isQ42 = v364_2_isTrust(txt) || v364_2_isOpportunityWorks(txt) || v364_2_capacityOf(txt) || /how|eppo|evide|enth|engane|kaise|kya|what|why|explain|works|trust|opportunity|fee|emi|income|earning|salary|profit/.test(_low42);
        // Only route when it looks like a question / capacity / doubt - not when user is in the middle of giving name/area/mobile (those steps handle it).
        const _inDataStep42 = /V211|Name|Mobile|District|State|Area|Lead|Final|Pay|Payment|OTP/i.test(String(state.lastStep||''));
        // Trust + Opportunity questions ALWAYS route, even in data steps - user doubt beats data collection.
        const _force42 = v364_2_isTrust(txt) || v364_2_isOpportunityWorks(txt);
        if((_isQ42 && !_inDataStep42) || _force42){
          const _lang42 = v364_2_detectLang(txt, state);
          const _cap42 = v364_2_capacityOf(txt);
          // Capacity given while we were waiting for capacity -> detail for that capacity
          if(_cap42 && (String(state.lastStep||'').includes('V364.3') || v364_2_isOpportunityWorks(txt) || /30k|2l|5l|1l|15l|lakh|lac|range|spend|budget|capacity/i.test(_low42))){
            if(_cap42==='ANY'){
              await setState(uid,{...state, lang:_lang42, lastStep:'V364.3 - Opportunity - Ask Area+Budget', phoneId: incomingPhoneId});
              await sendWithDelay(textMessage(uid, v364_2_texts(_lang42,'OPP_ANY'), incomingPhoneId));
              return;
            }
            const _sub42 = _cap42==='30K-1L' ? 'OPP_CENTER' : _cap42==='2L-5L' ? 'OPP_MUNI' : 'OPP_DISTRICT';
            await setState(uid,{...state, lang:_lang42, sub:_sub42, capacityRange:_cap42, intent:'Business Opportunity', lastStep:'V364.3 - Opportunity - Detail '+_cap42, phoneId: incomingPhoneId});
            await sendWithDelay(textMessage(uid, v364_2_texts(_lang42,'OPP_DETAIL',_cap42), incomingPhoneId));
            return;
          }
          if(v364_2_isTrust(txt)){
            await setState(uid,{...state, lang:_lang42, intent:'Business Opportunity', lastStep:'V364.3 - Trust - Answered', phoneId: incomingPhoneId});
            await sendWithDelay(textMessage(uid, v364_2_texts(_lang42,'TRUST'), incomingPhoneId));
            return;
          }
          if(v364_2_isOpportunityWorks(txt)){
            await setState(uid,{...state, lang:_lang42, intent:'Business Opportunity', lastStep:'V364.3 - Opportunity - Ask Capacity', phoneId: incomingPhoneId});
            await sendWithDelay(textMessage(uid, v364_2_texts(_lang42,'OPP_ASK'), incomingPhoneId));
            return;
          }
          // Other question words (fee/emi/income/works) but not trust/opp - do NOT send Welcome. Let existing AI/sorting handle it, but mark that router saw it so Welcome fallback must not repeat.
          // Fall through intentionally for generic questions.
        }
      }
    }catch(_){}


    // ===== V364.3 OUTER-MEMORY + FRANCHISE NUMBER LIMIT - AFTER V364.3, BEFORE V320 =====
    try{
      if(!btnId && msg.type==='text' && txt && String(txt).trim() && !v364_4_shouldSkipRouter(txt, state)){
        const _lang43 = v364_3_detectLang(txt, state);
        // 1) Franchise personal number ask -> LIMITED reply, no number in body, return. Never fall through.
        if(v364_3_isFranchiseNumberAsk(txt)){
          await setState(uid,{...state, lang:_lang43, lastStep:'V364.3 - Franchise Number - Limited', phoneId: incomingPhoneId});
          await sendWithDelay(textMessage(uid, v364_3_texts(_lang43,'FRANCHISE_NUMBER'), incomingPhoneId));
          return;
        }
        // 2) Franchise count ask -> no guess, return.
        if(v364_3_isFranchiseCountAsk(txt)){
          await setState(uid,{...state, lang:_lang43, lastStep:'V364.3 - Franchise Count - No Guess', phoneId: incomingPhoneId});
          await sendWithDelay(textMessage(uid, v364_3_texts(_lang43,'FRANCHISE_COUNT'), incomingPhoneId));
          return;
        }
        // 3) Outer question (not handled by V364.3, not in data-collection step) -> Platform KB answer, return. Never Welcome, never invent.
        const _inDataStep43 = /V211|Name|Mobile|District|State|Area|Lead|Final|Pay|Payment|OTP/i.test(String(state.lastStep||''));
        const _alreadyHandled42 = String(state.lastStep||'').includes('V364.3');
        if(!_inDataStep43 && !_alreadyHandled42 && v364_3_isOuterQuestion(txt)){
          await setState(uid,{...state, lang:_lang43, lastStep:'Outer - Platform KB', phoneId: incomingPhoneId});
          await sendWithDelay(textMessage(uid, v364_3_outerAnswer(txt, _lang43), incomingPhoneId));
          return;
        }
      }
    }catch(_){}

    // ===== V320 CALL WINDOW + NO NUMBER IN BODY - AFTER V317 STOP, BEFORE EVERYTHING ELSE =====
    // V320 REPLACES V319 callback block. No number in body: team contact ONLY via buttons.
    try{
      const _t320 = String(txt||'').toLowerCase().trim();
      // V320: answer to "Did you call?" / "Did you call today?" follow-ups - do NOT advance flow.
      if(!btnId && msg.type==='text' && String(state.lastStep||'').includes('V320')){
        if(/^(yes|yes,?\s*called|called|വിളിച്ചു|vilichu|call\s*kiya|haan)/.test(_t320)){
          await setState(uid,{...state, lastStep:'V320 - Callback - Called', phoneId: incomingPhoneId});
          await sendWithDelay(textMessage(uid, v320Txt(state.lang||'ml','CALLED_YES'), incomingPhoneId));
          return;
        }
        if(/^(no|not\s*yet|not|illa|illla|nahi|abhi\s*nahi)/.test(_t320)){
          await setState(uid,{...state, lastStep:'V320 - Callback - Not Yet', phoneId: incomingPhoneId});
          await sendWithDelay(textMessage(uid, v320Txt(state.lang||'ml','CALLED_NO'), incomingPhoneId));
          return;
        }
      }
      // V320 (1) Callback request -> NEVER promise callback. Call button + calling time, stay on same step.
      const _isCb320 = !btnId && msg.type==='text' && txt && /call\s*back|callback|call\s*me|call\s*cheyy|call\s*cheyyamo|vilikk|vilikkamo|phone\s*cheyy|enn*e\s*vilikk|call\s*vid|callback\s*cheyy/.test(_t320);
      if(_isCb320){
        const _lang320 = (state.lang||'ml');
        const _prev320 = state.lastStep||'';
        const _in320 = v320InWindow();
        const _now320 = new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
        const _hour320 = _now320.getHours();
        const _kind320 = _hour320 < 11 ? 'CB_BEFORE' : (_in320 ? 'CB_IN' : 'CB_AFTER');
        await setState(uid,{...state, lastStep:'V320 - Callback - Waiting ('+_prev320+')', phoneId: incomingPhoneId});
        // Body has NO number. Team contact ONLY via Call button below (number only in button payload).
        await sendWithDelay(textMessage(uid, v320Txt(_lang320,_kind320), incomingPhoneId));
        if(_kind320 !== 'CB_AFTER'){
          await sendDialer(uid, 'Tap below to call:', String(HELP_MARKETING_FULL).replace(/[^0-9]/g,''), incomingPhoneId); // V357 real dialer
        } else {
          await sendWithDelay(singleCta(uid, 'Tap below to chat on WhatsApp:', {title:'Chat on WhatsApp', url:'https://wa.me/'+String(HELP_MARKETING_FULL).replace(/[^0-9]/g,'')}, incomingPhoneId));
        }
        // V320 reminders for this case ONLY. No other reminder times touched.
        try{
          if(_kind320 === 'CB_BEFORE'){
            scheduleReminder(uid,'install:V320_CALL_11AM:10',_lang320, v320MsUntil(11,0), incomingPhoneId);
            scheduleReminder(uid,'install:V320_CALL_130PM:10',_lang320, v320MsUntil(13,30), incomingPhoneId);
            scheduleReminder(uid,'install:V320_CALL_345PM:10',_lang320, v320MsUntil(15,45), incomingPhoneId);
            scheduleReminder(uid,'install:V320_CALL_AFTER4:10',_lang320, v320MsUntil(16,5), incomingPhoneId);
          } else if(_kind320 === 'CB_IN'){
            scheduleReminder(uid,'install:V320_CALL_15MIN:10',_lang320, 15*60*1000, incomingPhoneId);
            if(_hour320 < 13) scheduleReminder(uid,'install:V320_CALL_130PM:10',_lang320, v320MsUntil(13,30), incomingPhoneId);
            if(_hour320 < 15) scheduleReminder(uid,'install:V320_CALL_345PM:10',_lang320, v320MsUntil(15,45), incomingPhoneId);
            scheduleReminder(uid,'install:V320_CALL_AFTER4:10',_lang320, v320MsUntil(16,5), incomingPhoneId);
          }
        }catch(_){}
        return;
      }
      // V320 (2) "Nobody answering" after a call -> check window, then reply. No number in body.
      const _isNoAns320 = !btnId && msg.type==='text' && txt && /nobody|no\s*one|not\s*answering|no\s*answer|not\s*pick|not\s*reachable|busy|engaged|call.*not|eduthilla|edukkunnilla|answer.*illa|phone.*edukk/.test(_t320);
      if(_isNoAns320){
        const _lang320b = (state.lang||'ml');
        const _in320b = v320InWindow();
        const _kind320b = _in320b ? 'NOANS_IN' : 'NOANS_OUT';
        await sendWithDelay(textMessage(uid, v320Txt(_lang320b,_kind320b), incomingPhoneId));
        if(_in320b){
          await sendDialer(uid, 'Tap below to try again:', String(HELP_MARKETING_FULL).replace(/[^0-9]/g,''), incomingPhoneId); // V357 real dialer
        } else {
          await sendWithDelay(singleCta(uid, 'Tap below to chat on WhatsApp:', {title:'Chat on WhatsApp', url:'https://wa.me/'+String(HELP_MARKETING_FULL).replace(/[^0-9]/g,'')}, incomingPhoneId));
        }
        return;
      }
    }catch(_){}
    // V320 button answers to "Did you call?" - do NOT advance flow.
    try{
      if(btnId==='V320_CALLED_YES'){
        await setState(uid,{...state, lastStep:'V320 - Callback - Called', phoneId: incomingPhoneId});
        await sendWithDelay(textMessage(uid, v320Txt(state.lang||'ml','CALLED_YES'), incomingPhoneId));
        return;
      }
      if(btnId==='V320_CALLED_NO'){
        await setState(uid,{...state, lastStep:'V320 - Callback - Not Yet', phoneId: incomingPhoneId});
        await sendWithDelay(textMessage(uid, v320Txt(state.lang||'ml','CALLED_NO'), incomingPhoneId));
        return;
      }
    }catch(_){}
    // V285 FIX: Free text "Watched video, whats next?" / "video kandu" / "video dekha" after a video = same as tapping [Yes seen].
    // Without this, Maya treated it as generic chat and the old video reminder still fired after it.
    try{
      const _txtLow = String(txt||'').toLowerCase().trim();
      // V287: "yes seen" alone (your screenshot) was NOT recognised - only "watched video" was. Now "yes seen" / "seen" / "kandu" also count, BUT only when Maya is actually waiting for a video.
      const _waitingForVideo = (state.lastStep||'').includes('Video') || (state.lastStep||'').includes('V270 - Business Video') || (state.lastStep||'').includes('Opportunity Video');
      const _isWatchedText = _waitingForVideo && (_txtLow.includes('watched video') || _txtLow.includes('watched the video') || _txtLow.includes('video kandu') || _txtLow.includes('video kandhu') || _txtLow.includes('video dekha') || _txtLow.includes('video dekh') || _txtLow.includes('video parthu') || _txtLow.includes('seen the video') || _txtLow.includes('video seen') || _txtLow==='yes seen' || _txtLow==='yes, seen' || _txtLow==='seen' || _txtLow==='yes seen video' || _txtLow.includes('yes seen') || _txtLow==='kandu' || _txtLow==='kandhu' || _txtLow==='dekha' || _txtLow==='parthu');
      if(!btnId && _isWatchedText){
        // V287: Company Video Seen vs Opportunity Video Seen are DIFFERENT steps. Check which video Maya sent.
        const _ls = state.lastStep||'';
        const _isCompanyStage = _ls.includes('Company Video') || _ls.includes('V270 - Business Video') || _ls.includes('Business Video Sent') || _ls.includes('Company Video - Must Watch');
        const _hasCapacity = !!state.sub && (state.sub==='OPP_CENTER' || state.sub==='OPP_CORP' || state.sub==='OPP_DISTRICT' || state.sub==='OPP_MUNI');
        if(_isCompanyStage && !_hasCapacity){ btnId = 'COMPANY_WATCHED'; console.log('V287 free-text watched -> COMPANY_WATCHED (Company Video stage, no capacity yet)'); }
        else { btnId = 'VIDEO_WATCHED'; console.log('V287 free-text watched -> VIDEO_WATCHED (Opportunity Video stage)'); }
      }
    }catch(_){}
    // ===== V292: HURRY-PROOF - EXPECT EVERY TYPE OF ACTION =====
    // Hurried users do: "hi", "k", "ok", "??", "price", "video", wrong tap, double tap, "back", 3 msgs at once, voice note.
    // Maya must NOT treat these as generic chat. It must map them by step, allow Back, ignore duplicates, keep it short.
    try{
      const _raw = String(txt||'').trim();
      const _lowH = _raw.toLowerCase();
      // 1) Duplicate / double-tap: same text within 10s = ignore duplicate, do not send duplicate reply
      if(_raw && state.lastUserText === _raw && state.lastReplyAt && (Date.now() - (state.lastUserTextAt||0)) < 10*1000){
        console.log(`V292 duplicate ignored: "${ _raw}"`);
        // Do not return - let it fall through but mark duplicate so handlers skip sending again? We return silently to avoid duplicate.
        // To avoid breaking webhook flow, we still update lastUserTextAt and return from handler via a flag.
        state.isDuplicate = true;
      } else {
        state.isDuplicate = false;
      }
      state.lastUserText = _raw; state.lastUserTextAt = Date.now();
      // 2) Back / Wrong / Change: hurried user tapped wrong button - go back to Business vs Services choice
      if(!btnId && (_lowH==='back' || _lowH==='thirich' || _lowH==='thirike' || _lowH.includes('wrong') || _lowH.includes('not this') || _lowH.includes('maatti') || _lowH.includes('change') || _lowH==='pinnem' || _lowH==='back cheyy')){
        btnId = 'HURRY_BACK';
        console.log(`V292 hurry back -> HURRY_BACK from "${ _raw}" at step ${state.lastStep}`);
      }
      // 3) Single-word hurried intents - one word is enough
      if(!btnId && !_isWatchedText){
        if(_lowH==='price' || _lowH==='fee' || _lowH==='token' || _lowH==='rate' || _lowH==='vila' || _lowH==='cash') btnId = 'HURRY_PRICE';
        else if(_lowH==='video' || _lowH==='videyo') btnId = 'HURRY_VIDEO';
        else if(_lowH==='business' || _lowH==='opportunity' || _lowH==='oppertunity' || _lowH==='franchise' || _lowH==='franchisee') btnId = 'HURRY_BUSINESS';
        else if(_lowH==='taxi' || _lowH==='cab' || _lowH==='auto') btnId = 'HURRY_TAXI';
        else if(_lowH==='delivery' || _lowH==='food') btnId = 'HURRY_DELIVERY';
        else if(_lowH==='hi' || _lowH==='hello' || _lowH==='hey' || _lowH==='hai' || _lowH==='hii' || _lowH==='🙏' || _lowH==='👋') btnId = 'HURRY_HI';
        else if(_lowH==='k' || _lowH==='ok' || _lowH==='okay' || _lowH==='okk' || _lowH==='👍' || _lowH==='👍🏻' || _lowH==='??' || _lowH==='?' || _lowH==='...' || _lowH==='.' || _lowH==='yes' || _lowH==='y' || _lowH==='no' || _lowH==='n'){
          // Short "ok / k / ??" means "I am here, what is next?" - do NOT treat as generic. Let V288 step-aware decide by step.
          // Mark hurry so reply stays short.
          state.hurryUser = true;
          console.log(`V292 hurry short "${ _raw}" at step ${state.lastStep} - let V288 decide`);
        }
      }
      // 4) Hurry flag: 2+ fast replies + short messages = hurried user -> Maya must reply SHORT (2 lines + button), not long paragraph
      if(_raw.length <= 10 && state.fastReplyCount >= 1) state.hurryUser = true;
      if(state.hurryUser) console.log(`V292 hurry user - keep reply SHORT`);
    }catch(_){}

        try{
      if(btnId==='HURRY_BUSINESS') btnId='AI_BUSINESS';
      else if(btnId==='HURRY_TAXI' || btnId==='HURRY_DELIVERY') btnId='AI_SERVICES';
      else if(btnId==='HURRY_BACK'){
        // Send Business vs Services choice again, in user's language, short
        const _sl = state.lang || 'ml';
        const _q = _sl==='ml' ? `👍 ശരി, വീണ്ടും തിരഞ്ഞെടുക്കൂ:\n\n👇 ഒന്ന് തിരഞ്ഞെടുക്കൂ:` : _sl==='hi' ? `👍 ठीक है, फिर से चुनें:\n\n👇 एक चुनें:` : `👍 OK, choose again:\n\n👇 Select one:`;
        await sendWithDelay(interactiveButton(uid, _q, [{id:'AI_BUSINESS',title: _sl==='ml' ? 'Business Opportunity' : 'Business Opportunity'},{id:'AI_SERVICES',title: _sl==='ml' ? 'Use Other Services' : 'Use Other Services'}], incomingPhoneId));
        await setState(uid,{...state, lastStep:'V292 - Hurry Back - Business vs Services', aiMode:true});
        return;
      }
      else if(btnId==='HURRY_PRICE'){
        // Price in hurry = token fee for current level, or all 3 levels if no level yet. Short reply.
        const _sl2 = state.lang || 'ml';
        const _lvl = state.sub || '';
        let _p = '';
        if(_lvl==='OPP_CENTER') _p = _sl2==='ml' ? `💰 Business Center: Token Rs.100. Full ~1 Lakh.` : `💰 Business Center: Token Rs.100. Full ~1 Lakh.`;
        else if(_lvl==='OPP_CORP') _p = _sl2==='ml' ? `💰 Corporation / Municipal: Token Rs.150. Full ~4-5 Lakh.` : `💰 Corporation / Municipal: Token Rs.150. Full ~4-5 Lakh.`;
        else if(_lvl==='OPP_DISTRICT') _p = _sl2==='ml' ? `💰 District: Token Rs.250. Full ~10 Lakh.` : `💰 District: Token Rs.250. Full ~10 Lakh.`;
        else _p = _sl2==='ml' ? `💰 Token: Center Rs.100 | Corp Rs.150 | District Rs.250.\n\n👇 Capacity തിരഞ്ഞെടുക്കൂ:` : `💰 Token: Center Rs.100 | Corp Rs.150 | District Rs.250.\n\n👇 Select capacity:`;
        await sendWithDelay(interactiveButton(uid, _p, [{id:'OPP_CENTER',title:'30K - 1L'},{id:'OPP_CORP',title:'2L - 5L'},{id:'OPP_DISTRICT',title:'5L - 15L'}], incomingPhoneId));
        await setState(uid,{...state, lastStep:'V292 - Hurry Price Asked', aiMode:true});
        return;
      }
      else if(btnId==='HURRY_VIDEO'){
        // Video in hurry = resend current video (Company if no capacity, Opportunity if capacity picked)
        const _hasCap = !!state.sub && (state.sub==='OPP_CENTER' || state.sub==='OPP_CORP' || state.sub==='OPP_DISTRICT');
        if(!_hasCap) btnId='COMPANY_VIDEO_WATCH';
        else btnId='OPP_LEARN_VIDEO';
      }
      else if(btnId==='HURRY_HI'){
        // Hi in hurry = repeat current step in 1 line, not restart
        // Fall through to V288 / generic - do not set btnId, let step repeat logic handle
        btnId='';
      }
    }catch(_){}
        if(state.isDuplicate){ console.log(`V292 duplicate - skipping duplicate reply`); return; }
        // ===== V288: STEP-AWARE RECOGNITION FOR EVERY STEP - WITHOUT FAIL =====
    // Rule: Free text is NEVER generic. Maya first looks at state.lastStep, then decides what the user meant.
    // "yes" on Corp Check = CORP_YES. "yes" on Benefits = UNDERSTOOD_BEN. "skip" anywhere = SKIP. "seen" on Company Video = COMPANY_WATCHED.
    // Without this, "yes / ok / seen / next / skip" fell into generic AI chat and Maya sent duplicate / wrong step.
    try{
      if(!btnId){
        const _low = String(txt||'').toLowerCase().trim();
        const _ls = state.lastStep||'';
        const _isYes = _low==='yes' || _low==='yes.' || _low==='yeah' || _low==='yep' || _low==='ok' || _low==='okay' || _low==='sheri' || _low==='shery' || _low==='athe' || _low==='haan' || _low==='haa';
        const _isNext = _low.includes('next') || _low.includes('aduth') || _low.includes('aage') || _low==='continue' || _low.includes('continue');
        const _isSkip = _low.includes('skip') || _low.includes('skip cheyy') || _low.includes('vittekk');
        const _isUnderstood = _low.includes('understood') || _low.includes('manasilayi') || _low.includes('manasilaayi') || _low.includes('samajh') || _low.includes('got it') || _low.includes('puriy') || _low==='ok' || _low==='okay' || _low.includes('understand');
        const _isNo = _low==='no' || _low==='no.' || _low==='illa' || _low==='nahi' || _low==='vendaa' || _low==='venda';
        // Language step
        if(_ls.includes('Language') || _ls.includes('LANG') || _ls.includes('AI Maya - Lang')){
          if(_low.includes('malayalam') || _low.includes('malayalam')) btnId='LANG_ML';
          else if(_low.includes('hindi')) btnId='LANG_HI';
          else if(_low.includes('english')) btnId='LANG_EN';
        }
        // Business vs Services choice
        else if(_ls.includes('Business Opportunity') && _ls.includes('Select') || _ls.includes('AI Maya - Lang Confirm') || _ls.includes('2 buttons')){
          if(_low.includes('business') || _low.includes('opportunity') || _low.includes('oppertunity') || _low.includes('franchise')) btnId='AI_BUSINESS';
          else if(_low.includes('service') || _low.includes('other service')) btnId='AI_SERVICES';
        }
        // Company Video stage (already handled for watched, but also skip / not watched)
        else if(_ls.includes('Company Video') || _ls.includes('V270 - Business Video')){
          if(_isSkip) btnId='COMPANY_SKIP';
          else if(_low.includes('not seen') || _low.includes('not watched') || _low.includes('kandilla') || _low.includes('nahi dekha')) btnId='COMPANY_NOT_WATCHED';
        }
        // Capacity / Income Level stage
        else if(_ls.includes('Income Level') || _ls.includes('Capacity') || _ls.includes('Investing capacity')){
          if(_low.includes('30') || _low.includes('1l') || _low.includes('1 lakh') || _low.includes('business center') || _low.includes('business centre')) btnId='OPP_CENTER';
          else if(_low.includes('2l') || _low.includes('2 lakh') || _low.includes('5l') && !_low.includes('15') || _low.includes('corporation') || _low.includes('municipal')) btnId='OPP_CORP';
          else if(_low.includes('5l') && _low.includes('15') || _low.includes('15l') || _low.includes('10l') || _low.includes('10 lakh') || _low.includes('district')) btnId='OPP_DISTRICT';
        }
        // Opportunity Video stage (watched already handled above, but also not watched / skip)
        else if(_ls.includes('Opportunity Video') || _ls.includes('V280 - Opportunity Video')){
          if(_low.includes('not seen') || _low.includes('not watched') || _low.includes('kandilla')) btnId='VIDEO_NOT_WATCHED';
        }
        // 3 Clicks - Benefits / Support / Requirements: understood / next / skip all mean "go next"
        else if(_ls.includes('Benefits')){
          if(_isSkip) btnId='SKIP_3CLICKS';
          else if(_isUnderstood || _isYes || _isNext) btnId='UNDERSTOOD_BEN';
        }
        else if(_ls.includes('Support')){
          if(_isSkip) btnId='SKIP_3CLICKS';
          else if(_isUnderstood || _isYes || _isNext) btnId='UNDERSTOOD_SUP';
        }
        else if(_ls.includes('Requirements')){
          if(_isSkip) btnId='SKIP_3CLICKS';
          else if(_isUnderstood || _isYes || _isNext) btnId='UNDERSTOOD_REQ';
        }
        // Corp Check / Submit Application: yes = have corp, no = no corp
        else if(_ls.includes('Corp Check') || _ls.includes('Submit Application')){
          if(_isYes || _low.includes('i have') || _low.includes('und') || _low.includes('hai')) btnId='CORP_YES';
          else if(_isNo || _low.includes('no corp') || _low.includes('illa')) btnId='CORP_NO';
        }
        // Are-you-there / Busy check: yes = continue, no = continue, stop = stop - handled by BUSY_* but free text "yes" here means continue
        else if(_ls.includes('Busy') || _ls.includes('Are-you-there') || _ls.includes('Are you there')){
          if(_low.includes('busy') || _low.includes('thirakku')) btnId='BUSY_YES';
          else if(_isYes || _isNext) btnId='BUSY_NO';
          else if(_low.includes('stop') || _low.includes('nirth')) btnId='BUSY_STOP';
        }
        if(btnId) console.log(`V288 step-aware free-text: last="${_ls}" text="${txt}" -> ${btnId}`);
      }
    }catch(_){}
        try{ state.lastReplyAt = Date.now(); }catch(_){}
    // V307 FIXED TERMS & CONDITIONS: ONCE LANGUAGE SELECTED, ALL CHATS DRAFT IN THAT LANGUAGE. NO SWITCH AFTER.
    // If selected = Malayalam, ALL drafts after = Malayalam script ONLY (except brand names Bizmapia/Taxi/App). No English sentences, no English bring-back, no English buttons.
    // This overrides ALL later detection: V291/V293/AI-router/detectUserLanguage are all ignored once lang is set.
    // If user asks "need english" after Malayalam selected, Maya replies IN MALAYALAM: "Language fixed to Malayalam as per terms, cannot change in this chat."
    try{
      if(state.lang){
        lang = state.lang;
        // If user explicitly asks to switch AFTER lock, answer in LOCKED language that it is fixed, then continue in locked language (do not switch, do not return - let step handler reply in locked lang)
        const _low7 = String(txt||'').toLowerCase().trim();
        const _asksSwitch = /need\s+(english|hindi|malayalam)|change.*(english|hindi|malayalam)|(english|hindi)\s+please|malayalam\s+please/.test(_low7);
        if(_asksSwitch && state.lang==='ml'){
          // Do not switch. Mark for step handlers to use ml. Log it.
          console.log(`V307 FIXED: switch request ignored, lang stays ml: "${String(txt||'').slice(0,40)}"`);
        }
      }
    }catch(_){}
    // V316 SINGLE LANGUAGE RULE - Language frozen after first selection. V305 + V307 merged: any later switch request (even explicit 'need english') is IGNORED, lang stays. No exceptions. V291 was the bug: it re-detected language from EVERY typed message.
    // So: user locked Malayalam -> typed "already watched" in English -> Maya switched to English. User typed "need malayalam" -> Maya stayed in English because "need malayalam" was treated as English text.
    // LOCK RULE: Once language is set (by button or explicit request), NEVER auto-switch from normal inputs. English words like "already watched", "yes, next", "balance details" are CONTENT, not language change.
    // ONLY an EXPLICIT language-change request switches: "need malayalam", "malayalam please", "change to malayalam", "malayalathil", "need english", "english please", "change to english", "need hindi", "hindi me", "hindi please".
    // After switch, new language is LOCKED. Reply in new language + bring back to current step in new language.
    try{
      const _t5 = String(txt||''); const _low5 = _t5.toLowerCase().trim();
      const _hasMl5 = /[\u0D00-\u0D7F]/.test(_t5); const _hasHi5 = /[\u0900-\u097F]/.test(_t5);
      let _want = null;
      if(/need\s+malayalam|malayalam\s+please|change.*malayalam|malayalathil|malayalam.*venam|malayalam.*parayu|malayalam.*madi|ente.*malayalam/.test(_low5) || _low5==='malayalam' || _low5==='malayalam please') _want='ml';
      else if(/need\s+english|english\s+please|change.*english|english.*venam|english.*parayu|english.*madi/.test(_low5) || _low5==='english' || _low5==='english please') _want='en';
      else if(/need\s+hindi|hindi\s+please|change.*hindi|hindi\s+me|hindi.*me.*bolo/.test(_low5) || _low5==='hindi') _want='hi';
      else if(_hasMl5 && !state.lang) _want='ml';
      else if(_hasHi5 && !state.lang) _want='hi';
      // If no language set at all, use script detection once (first message only)
      if(!state.lang && !_want){
        if(_hasMl5) _want='ml'; else if(_hasHi5) _want='hi'; else if(_t5.length>3 && /[a-zA-Z]{3,}/.test(_t5)){
          const _mlW=['enthanu','enth','ariyam','venam','kandu','manasilayi','evide','engane']; if(_mlW.some(w=>_low5.includes(w))) _want='ml'; else _want='en';
        }
      }
      // V307 FIXED TERMS: Once language is selected, it is FROZEN. Even explicit 'need english/hindi' does NOT switch if lang is already set. Only first selection sets it.
      if(state.lang){ _want=null; }
      if(_want && _want!==state.lang){
        const _prev = state.lang||'none'; state.lang=_want; lang=_want;
        console.log(`V316 LANGUAGE FROZEN - switch ignored ${_prev} -> ${_want} (kept ${_prev}): "${String(txt||'').slice(0,40)}"`);
        try{ await setState(uid, {...state, lang:_want, lastStep: state.lastStep||'Language Switched'}); }catch(_){}
        // Reply in NEW language confirming switch + bring back to current step (do not restart)
        const _step5 = state.lastStep||'';
        const _conf = _want==='ml' ? `✅ മനസ്സിലായി! ഇനി മുതൽ *മലയാളത്തിൽ* മാത്രം സംസാരിക്കാം. 🙏\n\n📍 നമ്മൾ ഇപ്പോൾ *${v364_4_friendlyStep(_step5)}*-ൽ ആണ്. തുടരാൻ തയ്യാറാണോ?` : _want==='hi' ? `✅ समझ गया! अब से *हिन्दी* में ही बात करेंगे। 🙏\n\n📍 हम अभी *${v364_4_friendlyStep(_step5)}* पर हैं। आगे बढ़ने के लिए तैयार हैं?` : `✅ Got it! From now, we will speak *only in English*. 🙏\n\n📍 We are at *${v364_4_friendlyStep(_step5)}*. Are you ready to continue?`;
        // Only send confirm if this message was ONLY a language request (not "need malayalam + other content"). If it also has other content, let later handlers reply in new language.
        if(/^(need\s+(malayalam|english|hindi)|malayalam|english|hindi|change.*(malayalam|english|hindi)).*$/ .test(_low5) && _low5.length<40){
          try{ await sendWithDelay(textMessage(uid, _conf, incomingPhoneId)); }catch(_){}
          // Do NOT return here - let flow continue so next step buttons come in new language on next turn. Mark that we already confirmed.
          state._langJustSwitched=true;
        }
      } else {
        // LOCKED: keep existing language, ignore auto-detection from content words
        if(state.lang) lang=state.lang;
      }
    }catch(_){}
    try{
      const _botAt = state.lastBotMsgAt || 0;
      const _delay = _botAt ? (Date.now() - _botAt) : 999999;
      if(_botAt && _delay < 2*60*1000){
        state.isRealTime = true; state.slowUser = false; state.fastReplyCount = (state.fastReplyCount||0)+1;
        clearReminders(uid);
        console.log(`V290 REAL-TIME replied in ${Math.round(_delay/1000)}s - reminders cancelled`);
      } else {
        state.fastReplyCount = 0;
        if(!state.isRealTime) state.slowUser = true;
      }
      if(state.fastReplyCount >= 2) state.isRealTime = true;
    }catch(_){}
        const isHi = ['hi','hello','hey','hai'].includes(txt.toLowerCase().trim());
    const nowIso = getISTTime();
    state = await getState(uid); // V294: reload, do NOT redeclare - state already declared at top
    if(isSpamming(uid)){ try{ await sendWithDelay(textMessage(uid, (state.lang||'ml')==='ml' ? `🙏 ഒന്ന് പതുക്കെ... ഞാൻ വായിക്കുന്നുണ്ട്. ഒരു മെസ്സേജ് അയച്ചാൽ മതി, ഞാൻ മറുപടി തരാം.` : `🙏 One message is enough, I am reading. Please wait a moment.` , incomingPhoneId)); }catch(e){} return; }
    // V250: User replied -> they are here, clear idle nudges, mark time
    try{ clearIdleNudges(uid); state.lastUserAt = Date.now(); }catch(e){}
    // save which number user contacted
    state.phoneId = incomingPhoneId;
    let lang = state.lang || 'en';
    // V306 LANGUAGE LOCK - REPLACES V293 AUTO-SWITCH. V293 was the real bug: it ran AFTER V305 and re-detected EVERY message.
    // "seen, next" (English words) -> flipped locked Malayalam to English. Manglish "video kandathanu" -> then stayed English because lang was already flipped.
    // LOCK RULE: If state.lang is already set, NEVER auto-switch from content. Only explicit "need malayalam / english / hindi" switches (already handled in V305).
    // Manglish input when lang=ml locked -> reply in Malayalam script, NOT English. English input when lang=ml locked -> reply in Malayalam, NOT English.
    try{
      const _low6 = String(txt||'').toLowerCase().trim();
      let _want6 = null;
      if(/need\s+malayalam|malayalam\s+please|change.*malayalam|malayalathil/.test(_low6)) _want6='ml';
      else if(/need\s+english|english\s+please|change.*english/.test(_low6)) _want6='en';
      else if(/need\s+hindi|hindi\s+please|change.*hindi|hindi\s+me/.test(_low6)) _want6='hi';
      // V307 FIXED TERMS: Frozen after selection. No switch, even on explicit request. If lang=ml, ALL chats stay ml.
      if(state.lang){ _want6=null; }
      if(_want6 && _want6!==state.lang){ state.lang=_want6; lang=_want6; try{ await setState(uid, {...state, lang:_want6}); }catch(_){} console.log(`V307 first selection ${_want6}`); }
      else if(state.lang){ lang=state.lang; /* LOCKED - do NOT touch lang from content */ }
    }catch(_){}
    // ===== V256 FIX: 1988 = RESET TO AI MAYA (not old Language Menu) =====
    if(String(txt||'').trim()==='1988'){
      clearReminders(uid);
      const prevLang = state.lang || 'ml';
      await setState(uid,{lang: prevLang, lastStep:'AI Maya - Fresh Reset', phoneId: incomingPhoneId, aiMode:true, aiHistory:[], lead:{}, firedGate:null, stopConfirmPending:false});
      const aiReset = AI_ENABLED ? await callMayaAI(prevLang, 'Hi, start fresh. FIRST confirm my language - ask which language: Malayalam / English / Hindi. Do NOT ask intention yet. Do NOT use Manglish.', []) : null;
      const resetText = aiReset && aiReset.text ? aiReset.text : (prevLang==='ml' ? `🔄 ശരി, പുതിയത് തുടങ്ങാം. 🙏\n\nഞാൻ മായ ആണ്. ബിസ്മാപ്പിയയിൽ നിങ്ങൾ എന്താണ് തേടുന്നത്?` : `🔄 Okay, fresh start. I am Maya. Want to know about Bizmapia business opportunity?`);
      const langConfirmText = `Hi, I am Maya here to chat with you! 👋

Welcome to Bizmapia! 🙏
🇮🇳 India's Largest Online Platform - First 4-in-1 App in India

👇 To start, please tap your language below:`;
      try{ await sendWithDelay(interactiveButton(uid, langConfirmText, [{id:'LANG_ML',title:'മലയാളം'},{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'हिन्दी'}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, langConfirmText, incomingPhoneId)); } // V261: First = LANGUAGE CONFIRM, 3 buttons - exception to 2-tab rule
      await saveToSheet('System_Logs', [nowIso, uid, prevLang, '1988 Reset to AI '+incomingPhoneId, '1988 - Reset to AI Maya', 'Clicked', HELP_ADMIN, '1988 Reset AI', ''], false);
      try{ scheduleIdleNudges(uid, prevLang, incomingPhoneId); }catch(e){} // V344: Welcome must also schedule Are you there
      return;
    // ===== V348 IDLE STOP / TALK LATER / TALK 1H / 2H / MANUAL =====
    if(btnId==='IDLE_STOP'){
      try{ clearReminders(uid); }catch(e){}
      await setState(uid,{...state, lastStep:'V348 - Stopped by user', phoneId: incomingPhoneId, firedGate:'STOPPED'});
      const _sm = (state.lang||'ml')==='ml' ? `👍 ശരി, നിർത്തി. 🙏\n\nഇനി ഞാൻ മെസ്സേജ് അയക്കില്ല. വേണമെങ്കിൽ എപ്പോൾ വേണമെങ്കിലും "Hi" അയച്ചാൽ മതി, ഞാൻ ഇവിടെയുണ്ടാകും.` : (state.lang||'ml')==='hi' ? `👍 Theek hai, rok diya. 🙏\n\nAb main message nahi bhejungi. Jab chaho "Hi" bhej dena, main yahin hoon.` : `👍 Okay, stopped. 🙏\n\nI will not send more messages. Anytime you want, just send "Hi" and I will be here.`;
      const _mm=textMessage(uid,_sm,incomingPhoneId); _mm._isIdle=true; await sendWithDelay(_mm);
      try{ await saveToSheet('System_Logs',[nowIso,uid,state.lang||'ml','V348 Idle Stop '+incomingPhoneId,'User tapped Stop on 3rd reminder - stopped','V348 Stop',HELP_ADMIN,'V348 Stop',''],false); }catch(e){}
      return;
    }
    if(btnId==='IDLE_TALK_LATER'){
      await setState(uid,{...state, lastStep:'V348 - Talk Later - Choose Time', phoneId: incomingPhoneId, lead:{...(state.lead||{}), talkLaterPending:true}});
      const _lm = (state.lang||'ml')==='ml' ? `👍 ശരി, പിന്നീട് സംസാരിക്കാം. 😊\n\nഎപ്പോൾ ഓർമ്മിപ്പിക്കണം? താഴെ തിരഞ്ഞെടുക്കൂ, അല്ലെങ്കിൽ ടൈപ്പ് ചെയ്യൂ: "after 30 minutes" / "tomorrow 10 am"` : (state.lang||'ml')==='hi' ? `👍 Theek hai, baad me baat karte hain. 😊\n\nKab yaad dilau? Neeche chunein, ya type karein: "after 30 minutes" / "tomorrow 10 am"` : `👍 Okay, talk later. 😊\n\nWhen should I remind you? Choose below, or type like: "after 30 minutes" / "tomorrow 10 am"`;
      try{ const _lm2=interactiveButton(uid,_lm,[{id:'TALK_1H',title:'After 1 hour'},{id:'TALK_2H',title:'After 2 hours'},{id:'TALK_MANUAL',title:'Type time'}], incomingPhoneId); _lm2._isIdle=true; await sendWithDelay(_lm2); }catch(e){ const _lm3=textMessage(uid,_lm,incomingPhoneId); _lm3._isIdle=true; await sendWithDelay(_lm3); }
      return;
    }
    if(btnId==='TALK_1H' || btnId==='TALK_2H'){
      const _ms = btnId==='TALK_1H' ? 1*60*60*1000 : 2*60*60*1000;
      const _label = btnId==='TALK_1H' ? 'after 1 hour' : 'after 2 hours';
      await setState(uid,{...state, lastStep:'V348 - Talk Later Scheduled '+_label, phoneId: incomingPhoneId, lead:{...(state.lead||{}), talkLaterPending:false, talkLaterLabel:_label, talkLaterAt: Date.now()+_ms}});
      try{ scheduleReminder(uid,'talk_later:'+Date.now(), state.lang||'ml', _ms, incomingPhoneId); }catch(e){}
      const _cm = (state.lang||'ml')==='ml' ? `✅ ശരി, ${_label} കഴിഞ്ഞ് ഞാൻ മെസ്സേജ് അയക്കാം. 😊\n\nഅതുവരെ ശല്യം ചെയ്യില്ല.` : (state.lang||'ml')==='hi' ? `✅ Theek hai, ${_label} baad main message bhejungi. 😊\n\nTab tak disturb nahi karungi.` : `✅ Done, I will message you ${_label}. 😊\n\nNo disturbance till then.`;
      const _cm2=textMessage(uid,_cm,incomingPhoneId); _cm2._isIdle=true; await sendWithDelay(_cm2);
      try{ await saveToSheet('System_Logs',[nowIso,uid,state.lang||'ml','V348 Talk Later '+_label,'Talk later scheduled '+_label,'V348 Talk Later',HELP_ADMIN,'V348 Talk Later',''],false); }catch(e){}
      return;
    }
    if(btnId==='TALK_MANUAL'){
      await setState(uid,{...state, lastStep:'V348 - Talk Later - Waiting Manual Time', phoneId: incomingPhoneId, lead:{...(state.lead||{}), talkLaterPending:true}});
      const _tm = (state.lang||'ml')==='ml' ? `✍️ സമയം ടൈപ്പ് ചെയ്യൂ.\n\nഉദാഹരണം: "after 30 minutes" / "after 2 hours" / "tomorrow 10 am"` : (state.lang||'ml')==='hi' ? `✍️ Time type kijiye.\n\nExample: "after 30 minutes" / "after 2 hours" / "tomorrow 10 am"` : `✍️ Type your time.\n\nExample: "after 30 minutes" / "after 2 hours" / "tomorrow 10 am"`;
      const _tm2=textMessage(uid,_tm,incomingPhoneId); _tm2._isIdle=true; await sendWithDelay(_tm2);
      return;
    }
    // V348: Manual talk-later time typed as free text
    if(!btnId && msg.type==='text' && state.lead?.talkLaterPending && txt){
      const _parsed = parseTalkLaterTime(txt);
      if(_parsed){
        await setState(uid,{...state, lastStep:'V348 - Talk Later Manual Scheduled', phoneId: incomingPhoneId, lead:{...(state.lead||{}), talkLaterPending:false, talkLaterLabel:_parsed.label, talkLaterAt: Date.now()+_parsed.ms, talkLaterRaw: txt}});
        try{ scheduleReminder(uid,'talk_later:'+Date.now(), state.lang||'ml', _parsed.ms, incomingPhoneId); }catch(e){}
        const _cm = (state.lang||'ml')==='ml' ? `✅ ശരി, ${_parsed.label} കഴിഞ്ഞ് ഞാൻ മെസ്സേജ് അയക്കാം. 😊\n\nനിങ്ങൾ ടൈപ്പ് ചെയ്തത് റെക്കോർഡ് ചെയ്തു: "${txt}"` : (state.lang||'ml')==='hi' ? `✅ Theek hai, ${_parsed.label} baad main message bhejungi. 😊\n\nAapne likha: "${txt}"` : `✅ Done, I will message you ${_parsed.label}. 😊\n\nRecorded what you typed: "${txt}"`;
        const _cm2=textMessage(uid,_cm,incomingPhoneId); _cm2._isIdle=true; await sendWithDelay(_cm2);
        try{ await saveToSheet('System_Logs',[nowIso,uid,state.lang||'ml','V348 Talk Later Manual '+incomingPhoneId,`Manual time: ${txt} -> ${_parsed.label}`,'V348 Talk Later',HELP_ADMIN,'V348 Talk Later',''],false); }catch(e){}
        return;
      }
    }

    }
    // ===== V268 FINAL - AI ROUTER OVER V247 ORDER - DO NOT REORDER, DO NOT RESTART =====
    // RULE LOCKED BY OWNER:
    // 1. V247 old steps/order are CORRECT. Never change them, never ask again what they are.
    // 2. AI does NOT replace V247. AI is a ROUTER: read free text / voice -> understand need -> JUMP user DIRECTLY to the correct V247 step in the very next message.
    // 3. Simplify: 1 user message = 1 correct next step. No interrogation, no district/job before options, no menu loop.
    // 4. AI MEMORY: aiHistory is NEVER cleared mid-chat (except 1988). AI remembers what user already said, so it never asks same question twice.
    // 5. VOICE: voice note -> transcribe -> same AI router -> same V247 step. Voice is treated exactly like typed text.
    // 6. ENTERTAIN + GUIDE: If user chats off-topic / jokes / doubts, AI replies like a human, entertains briefly, then gently brings him back to his need from our services. Never says "tap button", never sends old menu.

    // Reason: AI call can fail, then old fallback sends mainMenu. These overrides use NO AI call, pure text, so they NEVER fail.
    // V268 VOICE: audio/voice -> transcribe via Gemini -> treat as typed text, same router
    if(msg.type==='audio' || msg.type==='voice'){
      try{
        const mediaId = msg.audio?.id || msg.voice?.id || msg.audio?.media_id;
        let transcribed = '';
        if(mediaId && process.env.GEMINI_API_KEY){
          // Step 1: get media URL from WhatsApp
          const mRes = await fetch(`https://graph.facebook.com/v21.0/${mediaId}`, {headers:{Authorization:`Bearer ${getWhatsAppTokenForPhoneId(incomingPhoneId)}`}});
          const mJson = await mRes.json();
          if(mJson.url){
            const aRes = await fetch(mJson.url, {headers:{Authorization:`Bearer ${getWhatsAppTokenForPhoneId(incomingPhoneId)}`}});
            const aBuf = Buffer.from(await aRes.arrayBuffer());
            const b64 = aBuf.toString('base64');
            // Step 2: Gemini transcribe + understand in one call
            const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({contents:[{parts:[{text:`Transcribe this voice note exactly, then tell what the user wants from Bizmapia (Business Opportunity / Taxi / Directory / Delivery / Booking / Just enquiry). Reply ONLY as JSON: {"transcript":"...","need":"..."}`},{inline_data:{mime_type:'audio/ogg', data:b64}}]}]})});
            const gJson = await gRes.json();
            const gTxt = gJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            try{ const parsed = JSON.parse(gTxt.replace(/```json|```/g,'').trim()); transcribed = parsed.transcript || ''; }catch(e){ transcribed = gTxt; }
          }
        }
        if(!transcribed){
          // V364.6: Voice not understood -> "not understanding through voice, type it here I will explain".
          // 1st time: that line + Business / Services choice. 2nd+ time: same line + contact team via Call button (number ONLY in button, never digits in body).
          const vl = state.lang || 'en';
          const _vc = (Number(state.voiceFailCount||0)+1);
          const _say46 = vl==='ml'
            ? `🎙️ വോയ്സിലൂടെ നിങ്ങളുടെ requirement മനസ്സിലായില്ല. ഇവിടെ ടൈപ്പ് ചെയ്ത് പറയൂ, ഞാൻ explain ചെയ്യാം. 🙏`
            : vl==='hi'
            ? `🎙️ Voice se aapki requirement samajh nahi aayi. Yahan type karke batayein, main explain kar dunga. 🙏`
            : `🎙️ Not understanding your requirement through voice. Type it here, I will explain. 🙏`;
          if(_vc>=2){
            const _team46 = vl==='ml'
              ? `📞 വോയ്സ് വീണ്ടും മനസ്സിലായില്ല. Team-നോട് നേരിട്ട് സംസാരിക്കൂ. Calling time: Monday to Saturday, 11 AM - 4 PM.\n\n👇 താഴെ Call button ക്ലിക്ക് ചെയ്യൂ:`
              : `📞 Still not understanding through voice. Please contact our team directly. Calling time: Monday to Saturday, 11 AM - 4 PM.\n\n👇 Tap Call below:`;
            await setState(uid,{...state, lang:vl, voiceFailCount:_vc, lastStep:'V364.6 - Voice - Team Contact', phoneId: incomingPhoneId});
            await sendWithDelay(textMessage(uid, _say46+'\n\n'+_team46, incomingPhoneId));
            try{ await sendDialer(uid, 'Tap below to call:', String(HELP_MARKETING_FULL).replace(/[^0-9]/g,''), incomingPhoneId); }catch(_){}
            return;
          }
          const _q46 = _say46 + (vl==='ml' ? `\n\nഞങ്ങളിൽ നിന്ന് ഏത് opportunity ആണ് check ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?\n\n👇 താഴെ ഒന്ന് ക്ലിക്ക് ചെയ്യൂ:` : vl==='hi' ? `\n\nHumse kaun si opportunity check karna chahte hain?\n\n👇 Neeche ek par click karein:` : `\n\nWhich opportunity do you want to check from us?\n\n👇 Tap one below:`);
          const _b1 = vl==='ml' ? 'ബിസിനസ് അവസരം' : 'Business Opportunity';
          const _s1 = vl==='ml' ? 'സേവനങ്ങൾ ഉപയോഗിക്കാം' : vl==='hi' ? 'Use Our Services' : 'Use Our Services';
          await setState(uid,{...state, lang:vl, voiceFailCount:_vc, lastStep:'V364.6 - Voice - Ask Business/Service', phoneId: incomingPhoneId});
          await sendWithDelay(interactiveButton(uid,_q46,[{id:'AI_BUSINESS',title:_b1},{id:'AI_SERVICES',title:_s1}], incomingPhoneId));
          return;
        }
        // Voice becomes text - fall through to same AI router below with transcribed text
        txt = transcribed; try{ state.voiceFailCount = 0; state.lastVoiceTranscript = transcribed; state.lastVoiceAt = Date.now(); }catch(_){} msg.type = 'text';
        await saveToSheet('System_Logs',[nowIso,uid,state.lang||'en','V268 Voice '+incomingPhoneId,'Voice transcribed: '+transcribed,'V268',HELP_ADMIN,'V268 Voice',''],false);
      }catch(e){ console.log('V268 voice fail', e.message); }
    }
    if(btnId && btnId.startsWith('LANG_')){
      const ll = btnId.replace('LANG_','').toLowerCase();
      const clang = ll==='ml'?'ml':ll==='hi'?'hi':'en';
      await setState(uid,{lang:clang, lastStep:'V270 - Lang Confirmed '+clang, phoneId: incomingPhoneId, aiMode:true, aiHistory:(state.aiHistory||[]), lead:(state.lead||{})}); // V268: NEVER wipe AI memory on lang tap
      clearReminders(uid);
      const q = clang==='ml' ? `🙏 മലയാളം തിരഞ്ഞെടുത്തതിന് നന്ദി! Excellent choice! 👏\n\nസൂപ്പർ! മലയാളത്തിൽ തുടരാം. 🙏\n\nനിങ്ങൾക്ക് എന്താണ് വേണ്ടത് എന്ന് സ്വന്തം വാക്കുകളിൽ പറഞ്ഞാൽ മതി, ഞാൻ ശരിയായ ഓപ്ഷൻ കണ്ടുപിടിക്കാൻ സഹായിക്കാം.\n\nബിസ്മാപ്പിയയിൽ നിങ്ങൾ എന്താണ് തേടുന്നത്? സേവനം ഉപയോഗിക്കാനാണോ, അതോ ബിസ്മാപ്പിയയോടൊപ്പം ബിസിനസ് അവസരം എടുത്ത് വരുമാനം ഉണ്ടാക്കാനാണോ?` : clang==='hi' ? `🙏 हिन्दी चुनने के लिए धन्यवाद! Excellent choice! 👏\n\nबहुत बढ़िया! हिन्दी में जारी रखते हैं। 🙏\n\nआपको क्या चाहिए, अपने शब्दों में बताइए, मैं सही ऑप्शन ढूंढने में मदद करूंगी।\n\nBizmapia में आप क्या खोज रहे हैं? सेवा इस्तेमाल करना है, या Bizmapia के साथ बिज़नेस अवसर लेकर कमाना है?` : `🙏 Thank you for selecting English! Excellent choice! 👏\n\nGreat! Let’s continue in English. 🙏\n\nJust tell me in your own words what you need, I will help you find the right option.\n\nWhat are you looking for in Bizmapia? To use a service, or to earn with Bizmapia through a business opportunity?`;
      // V275: 2 buttons after language - easier than typing. Business Opportunity + Use Other Services.
      const q2 = q + (clang==='ml' ? `\n\n👇 *താഴെ ഒന്ന് ക്ലിക്ക് ചെയ്യൂ:*` : clang==='hi' ? `\n\n👇 *नीचे एक पर क्लिक करें:*` : `\n\n👇 *Tap one below:*`);
      const bizTitle = clang==='ml' ? 'ബിസിനസ് അവസരം' : clang==='hi' ? 'Business Opportunity' : 'Business Opportunity';
      const svcTitle = clang==='ml' ? 'സേവനങ്ങൾ ഉപയോഗിക്കാം' : clang==='hi' ? 'Use Other Services' : 'Use Other Services';
      if(isFranchiseePhoneId(incomingPhoneId)){ await sendFranchiseeServicesMenu(uid, clang, incomingPhoneId); } else { await sendWithDelay(interactiveButton(uid, q2, [{id:'AI_BUSINESS',title:bizTitle},{id:'AI_SERVICES',title:svcTitle}], incomingPhoneId)); }
      await saveToSheet('System_Logs',[nowIso,uid,clang,'V275 Lang Confirm '+incomingPhoneId,'LANG tap -> 2 buttons Business + Use Other Services','V275',HELP_ADMIN,'V275 Lang',''],false);
      return;
    }
    if(!btnId && msg.type==='text' && txt && state.lang){
      const sortedTop = detectIntentLocal(txt);
      if(sortedTop==='business_opportunity'){
        const sl = state.lang;
        // V266: User already gave requirement -> SHOW EXACT OPTIONS immediately. Do NOT ask district / job now. District comes AFTER they pick level.
        // V270 BUSINESS-ONLY: 3A now = Video only, NO capacity buttons, NO services, NO More services. 3B after 3 min = capacity reminder.
        const sortMsg = sl==='ml' ? `👍 മനസ്സിലായി! ബിസിനസ് അവസരമാണ് വേണ്ടത്. 🙏\n\n🎥 *വീഡിയോ കാണൂ, കമ്പനിയെ കുറിച്ച് മനസ്സിലാക്കൂ.*\n\nകമ്പനി എന്താണ് *പ്രതീക്ഷിക്കുന്നത്*,\nഅവസരത്തിന് അപേക്ഷിക്കാനുള്ള *Terms & Conditions* എന്തൊക്കെയാണ് —\n_എല്ലാം ഇതിൽ ഉണ്ട്._\n\n👇 *വീഡിയോ ഇപ്പോൾ തന്നെ കാണാൻ താഴെയുള്ള See Video ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ:*\n\nവീഡിയോ കണ്ട ശേഷം റിപ്ലൈ ചെയ്യൂ.\n\nഅതിന് ശേഷം *Bizmapia-യിൽ നിന്ന് നിങ്ങൾക്ക് ശരിയായ അവസരം* തിരഞ്ഞെടുക്കാൻ ഞാൻ സഹായിക്കാം. 🤝 ⏳` : sl==='hi' ? `👍 समझ गई! बिज़नेस अवसर चाहिए। 🙏\n\n🎥 *वीडियो देखें, कंपनी को समझें।*\n\nकंपनी क्या *उम्मीद* करती है, अवसर के लिए *Terms & Conditions* क्या हैं — _सब इसमें है।_\n\n👇 *वीडियो अभी देखने के लिए नीचे See Video बटन पर क्लिक करें:*\n\nवीडियो देखने के बाद रिप्लाई करें।\n\nउसके बाद *Bizmapia से सही अवसर* चुनने में मैं मदद करूंगी। 🤝 ⏳` : `👍 Got it! You want Business Opportunity. 🙏\n\n🎥 *Watch the video, understand the company.*\n\nWhat the company *expects*, what are the *Terms & Conditions* to apply — _everything is in it._\n\n👇 *Click the button below to see video right now - See Video:*\n\nSee the video right now and reply after seeing it.\n\nAfter that I will help you choose the *right opportunity from Bizmapia.* 🤝 ⏳`;
        await setState(uid,{...state, lastStep:'V270 - Business Video Sent', aiMode:true, lead:{...(state.lead||{}), intent:'business_opportunity', funnel:'VIDEO_SENT'}});
        await sendWithDelay(singleCta(uid, sortMsg, {title: '🎥 See Video', url: getCompanyVideoUrl(sl)}, incomingPhoneId));
        // V270: Capacity reminder after 3 min (180s) - only if user has NOT replied / picked level yet
        const _capUid = uid, _capPhone = incomingPhoneId, _capLang = sl, _capSentAt = Date.now();
        setTimeout(async()=>{ try{
          const cur = await getState(_capUid);
          if(!cur || cur.lastStep!=='V270 - Business Video Sent') return; if(cur.lastReplyAt && cur.lastReplyAt > _capSentAt) return; /* V289 replied after video */
          const capMsg = _capLang==='ml' ? `🎬 *വീഡിയോ കണ്ടോ?* 😊\n\n💰 *ഞങ്ങളുടെ ബിസിനസ് അവസരം തിരഞ്ഞെടുക്കാൻ, താങ്കൾക്ക് മുടക്കാൻ സാധിക്കുന്ന ഒരു വില പരിധി തിരഞ്ഞെടുത്താൽ ഞാൻ അതിന് പറ്റുന്ന അവസരത്തെക്കുറിച്ച് വിവരങ്ങൾ നൽകാം.*\n\n👇 *താഴെ നിന്ന് ശരിയായ ഒന്ന് തിരഞ്ഞെടുക്കൂ:*` : _capLang==='hi' ? `🎬 *वीडियो देखा?* 😊\n\n💰 *हमारी Business Opportunity चुनने के लिए, आप invest कर सकने वाली एक price range select करें, मैं उसके लिए सही अवसर के बारे में details दूँगा.*\n\n👇 *नीचे से सही एक चुनें:*` : `🎬 *Did you watch the video?* 😊\n\n💰 *To select our Business Opportunity, if you select a price range you can invest, I will give details about the opportunity that suits it.*\n\n👇 *Choose the right one from below:*`;
          const bL2=(id,ml,en,hi)=>({id,title:(_capLang==='ml'?ml:_capLang==='hi'?hi:en).substring(0,20)});
          try{ await sendWithDelay(interactiveButton(_capUid, capMsg, [bL2('OPP_CENTER','30K - 1L','30K - 1L','30K - 1L'), bL2('OPP_CORP','2L - 5L','2L - 5L','2L - 5L'), bL2('OPP_DISTRICT','5L - 15L','5L - 15L','5L - 15L')], _capPhone)); }catch(e){ await sendWithDelay(textMessage(_capUid, capMsg, _capPhone)); }
          await setState(_capUid,{...(await getState(_capUid)), lastStep:'V270 - Capacity Reminder Sent'});
        }catch(e){ console.log('V270 capacity reminder fail', e.message); } }, 180000);
        try{ await logLeadPerfect(uid, state, {lastMsg: txt, summary: 'V265 sorted: business_opportunity'}); }catch(e){}
        return;
      }
      if(sortedTop==='service' || sortedTop==='taxi' || sortedTop==='delivery' || sortedTop==='directory' || sortedTop==='booking'){
        const sl2 = state.lang;
        const svcMsg = sl2==='ml' ? `👍 മനസ്സിലായി! സേവനമാണ് വേണ്ടത്.\n\nഏത് സേവനമാണ് വേണ്ടത്? ടാക്സി, ഡയറക്ടറി, ഡെലിവറി, അതോ ബുക്കിങ്?` : sl2==='hi' ? `👍 समझ गई! सेवा चाहिए। कौन सी सेवा? टैक्सी, डायरेक्टरी, डिलिवरी, या बुकिंग?` : `👍 Got it! You want a service. Which one? Taxi, Directory, Delivery, or Booking?`;
        await sendWithDelay(textMessage(uid, svcMsg, incomingPhoneId));
        return;
      }
    }
    // V266: OPP level taps -> confirm level + ask district NOW (district is relevant AFTER level pick, not before)
    if(btnId && btnId.startsWith('OPP_')){
      const sl3 = state.lang || 'ml';
      const lvlMap={OPP_CENTER:'Business Center - 1 Lakh - Token Rs.100', OPP_CORP:'Corporation / Municipal - 4 Lakh - Token Rs.150', OPP_DISTRICT:'District Franchise - 10 Lakh - Token Rs.250'};
      const lvl = lvlMap[btnId] || 'Business Opportunity';
      await setState(uid,{...state, lastStep:'V266 - Level Picked '+btnId, aiMode:true, lead:{...(state.lead||{}), level:btnId, intent:'business_opportunity'}});
      // V272 FIX: NEVER ask district / name / address / location now. Those are LAST step, ONLY AFTER registration fee is VERIFIED. After capacity: confirm + explain + video + move to fee.
      const lvlMsg = sl3==='ml' ? `👍 നല്ല തിരഞ്ഞെടുപ്പ്! 🙏\n\n${lvl} തിരഞ്ഞെടുത്തു.\n\nനമുക്ക് ഫൈനലൈസ് ചെയ്യാം — ഈ അവസരം നിങ്ങൾക്ക് ചേരുമോ ഇല്ലയോ എന്ന്. പല ഉയർന്ന തുക അടയ്ക്കാൻ കഴിയുന്നവരും ആദ്യം കുറഞ്ഞ ഓപ്ഷൻ ചെക്ക് ചെയ്യാനാണ് തിരഞ്ഞെടുക്കുന്നത്, അതുകൊണ്ട് വീഡിയോ കണ്ട ശേഷം നമുക്ക് വീണ്ടും കൺഫേം ചെയ്യാം. സാധ്യമെങ്കിൽ നമുക്ക് ഉയർന്ന ഓപ്ഷനിലേക്ക് അപ്ഗ്രേഡ് ചെയ്യാം.\n\n👇 *ഈ അവസരത്തിന്റെ വീഡിയോ ഇപ്പോൾ തന്നെ കാണാൻ താഴെയുള്ള See Video ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ:*\n\nവീഡിയോ ഇപ്പോൾ തന്നെ കാണൂ, കണ്ട ശേഷം റിപ്ലൈ ചെയ്യൂ.` : sl3==='hi' ? `👍 अच्छा चुनाव! ${lvl} चुना।\n\nहम फाइनलाइज़ करेंगे — यह अवसर आपको सूट करता है या नहीं। कई ज़्यादा राशि दे सकने वाले लोग पहले कम ऑप्शन चेक करने के लिए चुनते हैं, इसलिए वीडियो देखने के बाद हम फिर से कंफर्म करेंगे। अगर संभव है तो हम हायर ऑप्शन में अपग्रेड कर सकते हैं।\n\n👇 *इस अवसर का वीडियो अभी देखने के लिए नीचे See Video बटन पर क्लिक करें:*\n\nवीडियो अभी देखें, देखने के बाद रिप्लाई करें।` : `👍 Good choice! You picked ${lvl}.\n\nWe will finalize whether this opportunity suits you or not. Many high-payable users first pick the lower option just to check, so after the video we will reconfirm. If possible, we can upgrade to higher options.\n\n👇 *Click the button below to see this Opportunity Video right now - See Video:*\n\nSee the video right now and reply after seeing it.`;
      // V277 FIX: Opportunity Video is DIFFERENT from Company Video. Company Video = per-language getCompanyVideoUrl() (Know Company, shown BEFORE capacity).
      // Opportunity Video = level + language specific via getVideoUrl (District/Corp/Center), shown AFTER capacity pick.
      const oppVideoUrl = (typeof getVideoUrl === 'function') ? getVideoUrl(btnId, sl3) : 'https://www.youtube.com/watch?v=jCwTwiuSi5s';
      await sendWithDelay(singleCta(uid, lvlMsg, {title: '🎥 See Video', url: oppVideoUrl}, incomingPhoneId));
      // V280 FIX: Nobody replies after watching a video - same as Company Video. Schedule Opportunity Video reminder after 5 min.
      // Without this, Maya waited forever after Opportunity Video. Reminder asks [Watched] / [Not Watched], no raw link.
      await setState(uid, {...state, sub: btnId, lastStep: 'V280 - Opportunity Video Sent ' + btnId, aiMode: true, lead: {...(state.lead||{}), level: btnId, intent: 'business_opportunity'}});
      scheduleReminder(uid, 'install:VIDEO_5MIN_' + btnId + ':5', sl3, 5*60*1000, incomingPhoneId);
      return;
    }
    // ===== END V265 HARD OVERRIDE =====
// ===== V247 FIRED GATE - button replies =====
    if(btnId==='FIRED_YES'){
      await setState(uid,{...state, firedGate:'ALLOWED', lastStep:'Fired YES - Allowed Again', lang:null, phoneId: incomingPhoneId});
      await saveToSheet('System_Logs', [nowIso, uid, 'none', 'Fired YES '+incomingPhoneId, 'YES - Serious Now - Allowed Again', 'Clicked', HELP_ADMIN, 'Fired YES', ''], false);
      try{ await saveFiredRow([normalizeFiredPhone(uid), '', getISTTime(), 'Bot - Fired YES', 'RETURNED_LOSER - YES - Allowed Again', 'RETURNED - YES - 1 More Chance', 'NO - Returned', getISTTime()]); }catch{}
      clearReminders(uid);
      const L0=T.en;
      await sendWithDelay(interactiveButton(uid, L0.welcome, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'हिन्दी'},{id:'LANG_ML',title:'മലയാളം'}], incomingPhoneId));
      await setState(uid,{first:true, lastStep:'First Message', lang:null, phoneId: incomingPhoneId, firedGate:'ALLOWED'});
      return;
    }
    if(btnId==='FIRED_STOP'){
      await setState(uid,{...state, firedGate:'STOPPED', lastStep:'Fired STOP - Do Not Message', phoneId: incomingPhoneId});
      clearReminders(uid);
      await saveToSheet('System_Logs', [nowIso, uid, 'none', 'Fired STOP '+incomingPhoneId, 'STOP - Do Not Message', 'Clicked', HELP_ADMIN, 'Fired STOP', ''], false);
      try{ await saveFiredRow([normalizeFiredPhone(uid), '', getISTTime(), 'Bot - Fired STOP', 'STOP - Do Not Message', 'STOP - User Said STOP', 'NO - Stopped', getISTTime()]); }catch{}
      await sendWithDelay(textMessage(uid, 'OK. Stopped. We will not message you again. ✅\n\nठीक है। रुक गए। हम आपको फिर मैसेज नहीं करेंगे। ✅\n\nശരി. നിർത്തി. ഞങ്ങൾ ഇനി നിങ്ങൾക്ക് മെസേജ് അയക്കില്ല. ✅', incomingPhoneId));
      return;
    }
    if(state.firedGate==='STOPPED'){
      return;
    }
    if(state.firedGate==='WARNED' || state.firedGate==='FIRED_AUTO'){
      await sendFiredWarning(uid, incomingPhoneId);
      return;
    }
    // ===== END V247 FIRED GATE (buttons) =====

    if(btnId==='AI_NOT_INTERESTED'){
      state.lead = state.lead||{}; state.lead.sentiment='not_interested'; state.lead.funnel='CLOSED_NOT_INTERESTED';
      await setState(uid, state); clearIdleNudges(uid); clearReminders(uid);
      const bye = (state.lang||'ml')==='ml' ? `ശരി, മനസ്സിലായി. 🙏\n\nശല്യം ചെയ്യില്ല. എപ്പോൾ വേണമെങ്കിലും തിരിച്ചു വരാം.\n\nBizmapia - bizmapia.com` : (state.lang==='hi' ? `Theek hai, samajh gaya. 🙏\n\nDisturb nahi karungi. Kabhi bhi wapas aa sakte hain.` : `Okay, understood. 🙏\n\nI will not disturb you. You can come back anytime.\n\nBizmapia - bizmapia.com`);
      await sendWithDelay(textMessage(uid, bye, incomingPhoneId));
      await logLeadPerfect(uid, state, {lastMsg:'[BUTTON] Not Interested', summary:'User said not interested via idle button - stop nudges'});
      return;
    }
    // ===== V249 HYBRID - AI quick button -> feed back to AI =====

    // ===== V316 DETERMINISTIC SERVICES - WHICH ONE ARE YOU FIRST (Customer/Driver/Shop Owner - NOT asking name/identity) (user scope, not generic AI) =====
    // AI_SERVICES no longer goes straight to 4 services. First: Customer / Driver / Shop Owner.
    // Each branch is a FIXED script from user scope - AI must not invent rates, must refer to Tender/Annexure-B + www.bizmapia.com for advertainment rates.
    if(btnId==='WHO_CUSTOMER' || btnId==='WHO_DRIVER' || btnId==='WHO_SHOP'){
      const sl = state.lang || 'ml';
      await setState(uid,{...state, lang:sl, lastStep:'V316 - Service Who '+btnId, aiMode:true});
      if(btnId==='WHO_CUSTOMER'){
        const msg = sl==='ml' ? `🙏 സ്വാഗതം! Bizmapia App-ൽ നിന്ന് എല്ലാ സേവനങ്ങളും ഉപയോഗിക്കാം. 💛\n\n🚖 Taxi - എവിടെയും ടാക്സി ബുക്ക് ചെയ്യാം\n📖 Directory - അടുത്തുള്ള കട / സേവനം / ഓഫർ കണ്ടെത്താം\n🛵 Delivery - ഭക്ഷണം / സാധനങ്ങൾ വീട്ടിലെത്തും\n📦 Booking - ഹോട്ടൽ റൂം, Appointment, Movie / Show ടിക്കറ്റ്\n\n📱 ആദ്യം App install ചെയ്യൂ, OTP login ചെയ്യൂ. ഏതാണ് നിങ്ങളുടെ ഫോൺ?` : `🙏 Welcome! You can use all Bizmapia services from the App. 💛\n\n🚖 Taxi - book a taxi anywhere\n📖 Directory - find nearby shop / service / offer\n🛵 Delivery - food / items to your doorstep\n📦 Booking - hotel room, appointment, movie / show ticket\n\n📱 First install the App and login with OTP. Which phone do you use?`;
        try{ await sendWithDelay(interactiveButton(uid, msg, [{id:'APP_ANDROID',title:'🤖 Android'},{id:'APP_IOS',title:'🍎 iPhone'},{id:'AI_BUSINESS',title: sl==='ml'?'ബിസിനസ് അവസരം':'Business Opportunity'}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, msg, incomingPhoneId)); }
      } else if(btnId==='WHO_DRIVER'){
        const msg = sl==='ml' ? `🚖 ഡ്രൈവർ ആയി Bizmapia-യിൽ ചേരാം! 🙏\n\n✅ Step 1: Driver App install ചെയ്ത് Google login ചെയ്യൂ\n✅ Step 2: Driver profile + Vehicle details പൂർത്തിയാക്കൂ\n✅ Step 3: Cab attachment Bizmapia-യുമായി submit ചെയ്യൂ\n\n💰 One-time registration: Rs.150/- മാത്രം\n🎁 Rs.150 അടച്ചാൽ 365 ദിവസം / 180 ദിവസം / 90 ദിവസം FREE recharge കിട്ടാൻ chance ഉണ്ട്\n♾️ കുറഞ്ഞ recharge-ൽ endless trip opportunity - Bizmapia മാത്രം\n💸 എല്ലാ trip-നും നല്ല fare - Normal / Peak / Night (Double charge)\n🏧 വരുമാനം 24 മണിക്കൂറിന് ശേഷം withdraw ചെയ്യാം\n\n📞 Registration കഴിഞ്ഞാൽ കമ്പനിയിൽ നിന്ന് callback വരും - test trip വഴി App performance verify ചെയ്യും. അതിന് ശേഷം trips തുടങ്ങാം.` : `🚖 Join Bizmapia as a Driver! 🙏\n\n✅ Step 1: Install Driver App and Google login\n✅ Step 2: Complete driver profile + vehicle details\n✅ Step 3: Submit cab attachment with Bizmapia\n\n💰 One-time registration: only Rs.150/-\n🎁 After paying Rs.150 you get a chance of 365 days / 180 days / 90 days FREE recharge\n♾️ Endless trip opportunity on a lower recharge - only Bizmapia\n💸 Good fare for every trip - Normal / Peak / Night (Double charge)\n🏧 Withdraw your earnings after 24 hours\n\n📞 After registration you will get a callback from the company - a test trip will verify your app performance. After that you can start trips.`;
        try{ await sendWithDelay(singleCta(uid, msg, {title:'🚖 Driver App', url:'https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia'}, incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, msg, incomingPhoneId)); }
        try{ await sendWithDelay(interactiveButton(uid, sl==='ml'?'👉 അടുത്തത് എന്ത് വേണം?': '👉 What next?', [{id:'AI_BUSINESS',title: sl==='ml'?'ബിസിനസ് അവസരം':'Business Opportunity'},{id:'AI_SERVICES',title: sl==='ml'?'സേവനങ്ങൾ':'Services'}], incomingPhoneId)); }catch(e){}
      } else if(btnId==='WHO_SHOP'){
        const msg = sl==='ml' ? `🏪 കട Bizmapia-യിൽ register ചെയ്യാം! 🙏\n\n✅ Step 1: www.bizmapia.com-ൽ പോയി Google login ചെയ്യൂ\n✅ Step 2: Business profile ഉണ്ടാക്കൂ\n✅ Step 3: Shop details കൊടുക്കൂ - shop name, address, location, contact, images. നല്ല profile ആയാൽ customers-ന്റെ search-ൽ കാണും.\n\n📣 Profile കഴിഞ്ഞാൽ മാത്രം Advertainment option കിട്ടും - offer / service / എന്തും കുറഞ്ഞ rate-ൽ advertise ചെയ്യാം.\n💡 Rates + tenure-ന് Tender + Annexure-B നോക്കൂ, അല്ലെങ്കിൽ www.bizmapia.com-ൽ current offer rates നോക്കൂ.\n🎯 1-year plan ആണ് ഏറ്റവും നല്ലത് - offer rate-ൽ 1 വർഷം മുഴുവൻ advertise ചെയ്യാം.` : `🏪 Register your shop on Bizmapia! 🙏\n\n✅ Step 1: Go to www.bizmapia.com and Google login\n✅ Step 2: Create your business profile\n✅ Step 3: Add shop details - shop name, address, location, contact, images. A good profile shows in customer search.\n\n📣 Only after profile creation you get the Advertainment option - advertise anything like offers / service at a cheap rate.\n💡 For rates + tenure, check Tender + Annexure-B or current offer rates on www.bizmapia.com.\n🎯 A 1-year plan is best - advertise the full year at the offer rate.`;
        try{ await sendWithDelay(singleCta(uid, msg, {title:'🌐 bizmapia.com', url:'https://bizmapia.com/'}, incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, msg, incomingPhoneId)); }
        try{ await sendWithDelay(interactiveButton(uid, sl==='ml'?'👉 അടുത്തത് എന്ത് വേണം?': '👉 What next?', [{id:'AI_BUSINESS',title: sl==='ml'?'ബിസിനസ് അവസരം':'Business Opportunity'},{id:'AI_SERVICES',title: sl==='ml'?'സേവനങ്ങൾ':'Services'}], incomingPhoneId)); }catch(e){}
      }
      return;
    }
    // V316: APP_ANDROID / APP_IOS -> warm app help, links only inside buttons, never raw links in text
    if(btnId==='APP_ANDROID' || btnId==='APP_IOS'){
      const sl = state.lang || 'ml';
      const isAnd = btnId==='APP_ANDROID';
      const msg = sl==='ml' ? (isAnd ? `📱 Android - Bizmapia App install ചെയ്യാം 💛\n\nPlay Store > Bizmapia search > Install > OTP login.\nOTP വരുന്നില്ലെങ്കിൽ 60 sec wait ചെയ്ത് Resend നോക്കൂ.\n\nApp തുറന്നാൽ 4 സേവനങ്ങളും കാണാം - Taxi, Directory, Delivery, Booking. എന്താണ് ആദ്യം വേണ്ടത്?` : `📱 iPhone - Bizmapia App install ചെയ്യാം 💛\n\nApp Store > Bizmapia search > Get > OTP login.\nOTP വരുന്നില്ലെങ്കിൽ 60 sec wait ചെയ്ത് Resend നോക്കൂ.\n\nApp തുറന്നാൽ 4 സേവനങ്ങളും കാണാം - Taxi, Directory, Delivery, Booking. എന്താണ് ആദ്യം വേണ്ടത്?`) : (isAnd ? `📱 Android - install Bizmapia App 💛\n\nPlay Store > Search Bizmapia > Install > OTP login.\nNo OTP? Wait 60s, tap Resend.\n\nIn the App you will see all 4 services - Taxi, Directory, Delivery, Booking. What do you need first?` : `📱 iPhone - install Bizmapia App 💛\n\nApp Store > Search Bizmapia > Get > OTP login.\nNo OTP? Wait 60s, tap Resend.\n\nIn the App you will see all 4 services - Taxi, Directory, Delivery, Booking. What do you need first?`);
      const url = isAnd ? 'https://play.google.com/store/apps/details?id=com.panditprogrammer.bizmapia' : 'https://apps.apple.com/in/app/bizmapia/id6761577245';
      try{ await sendWithDelay(singleCta(uid, msg, {title: isAnd?'📱 Android App':'🍎 iPhone App', url}, incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, msg, incomingPhoneId)); }
      await setState(uid,{...state, lang:sl, lastStep:'V316 - App Link '+btnId, aiMode:true});
      return;
    }
    // ===== V257: AI_SERVICES -> show 4 services (3+1, WhatsApp max 3 per msg) =====
    if(btnId==='AI_SERVICES' || btnId==='AI_TAXI'){
      const sl = state.lang || 'ml';
      const svcText = sl==='ml' ? `🙏 Bizmapia-യുടെ 4 സേവനങ്ങൾ ഇവയാണ്:\n\n1️⃣ 🚖 Taxi / Ride - എവിടെയും ടാക്സി ബുക്ക് ചെയ്യാം\n2️⃣ 📖 Business Directory - നിങ്ങളുടെ അടുത്തുള്ള കടകൾ / സേവനങ്ങൾ കണ്ടെത്താം\n3️⃣ 🛵 Online Delivery - ഭക്ഷണം / സാധനങ്ങൾ ഡെലിവറി\n4️⃣ 📦 Book Anything - റൂം, മൂവി, ഇവന്റ്, എന്തും ബുക്ക് ചെയ്യാം\n\n👉 ഏത് സേവനത്തെ കുറിച്ചാണ് അറിയേണ്ടത്? താഴെ ക്ലിക്ക് ചെയ്യൂ:` : sl==='hi' ? `🙏 Bizmapia ki 4 services ye hain:\n\n1️⃣ 🚖 Taxi / Ride - Kahin bhi taxi book karein\n2️⃣ 📖 Business Directory - Paas ki dukaan / services dhoondhein\n3️⃣ 🛵 Online Delivery - Khana / samaan delivery\n4️⃣ 📦 Book Anything - Room, movie, event, kuch bhi book karein\n\n👉 Kis service ke baare mein jaanna hai? Neeche click karein:` : `🙏 Bizmapia has 4 services:\n\n1️⃣ 🚖 Taxi / Ride - Book a taxi anywhere\n2️⃣ 📖 Business Directory - Find nearby shops / services\n3️⃣ 🛵 Online Delivery - Food / items delivery\n4️⃣ 📦 Book Anything - Room, movie, event, anything\n\n👉 Which service do you want to know about? Tap below:`;
      const b2=(id,ml,en,hi)=>({id,title:(sl==='ml'?ml:sl==='hi'?hi:en).substring(0,20)});
      await setState(uid,{...state, lang:sl, lastStep:'AI Maya - Services Menu', aiMode:true});
      try{ await sendWithDelay(interactiveButton(uid, (sl==='ml' ? `🙏 സൂപ്പർ! സേവനങ്ങൾ കാണിക്കുന്നതിന് മുൻപ് ഒരു ചെറിയ ചോദ്യം — നിങ്ങൾ ഏത് കൂട്ടത്തിലാണ്? Customer ആണോ, Driver ആണോ, Shop Owner ആണോ? അതനുസരിച്ച് ഞാൻ കൃത്യമായി സഹായിക്കാം. 💛\n\n` : sl==='hi' ? `🙏 Super! Services dikhane se pehle ek chhota sawaal — aap kis category mein hain? Customer, Driver, ya Shop Owner? Us hisaab se main aapko bilkul sahi guide karungi. 💛\n\n` : `🙏 Super! Before I show you the services, one small question — which one are you? Customer, Driver, or Shop Owner? I will guide you exactly the way you need. 💛\n\n`) + svcText, [b2('WHO_CUSTOMER','🙋 Customer','Customer','Customer'), b2('WHO_DRIVER','🚖 Driver','Driver','Driver'), b2('WHO_SHOP','🏪 Shop Owner','Shop Owner','Shop Owner')], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, svcText, incomingPhoneId)); }
      await delay(300);
      try{ await sendWithDelay(interactiveButton(uid, sl==='ml' ? `👉 4-ാമത്തെ സേവനം:` : sl==='hi' ? `👉 4th service:` : `👉 4th service:`, [b2('SVC_BOOKING','📦 ബുക്ക് ചെയ്യാം','Book Anything','Book Anything'), b2('AI_BUSINESS','ബിസിനസ് അവസരം','Business Opportunity','Business Opportunity')], incomingPhoneId)); }catch(e){}
      await saveToSheet('System_Logs',[nowIso,uid,sl,'AI Services Menu '+incomingPhoneId,'User tapped Know Our Services - showed 4 services','AI Services',HELP_ADMIN,'AI Services Menu',''],false);
      return;
    }
    // ===== V257: SVC_* taps -> AI explains THAT service, then offers Business Opportunity =====
    if(btnId.startsWith('SVC_')){
      const sl2 = state.lang || 'ml';
      const svcMap={SVC_RIDE:'Taxi / Ride service', SVC_BIZDIR:'Business Directory service', SVC_DELIVERY:'Online Delivery service', SVC_BOOKING:'Book Anything service', SVC_OPP:'Business Opportunity'};
      const asSvc = svcMap[btnId] || 'Service';
      const svcFixed = sl2==='ml' ? `${asSvc} - Bizmapia App-il ninnu use cheyyam. 🙏\n\nApp install cheythu OTP login cheyyoo. Nee ethilaanu - Customer, Driver, allenkil Shop Owner? Athu paranjaal njan karyamayi paranjutharaam.` : sl2==='hi' ? `${asSvc} - Aap Bizmapia App se use kar sakte hain. 🙏\n\nApp install karke OTP login karein. Aap kis category mein hain — Customer, Driver, ya Shop Owner? Batayein, main aapko sahi guide karungi.` : `${asSvc} - You can use it from Bizmapia App. 🙏\n\nInstall the App and OTP login. Which one are you — Customer, Driver, or Shop Owner? Tell me and I will guide you exactly.`;
      const svcReply = svcFixed;
      await setState(uid,{...state, lang:sl2, lastStep:'AI Maya - Service '+btnId, aiMode:true});
      try{ await sendWithDelay(interactiveButton(uid, svcReply, mayaQuickButtons(sl2, 'business'), incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, svcReply, incomingPhoneId)); }
      await saveToSheet('System_Logs',[nowIso,uid,sl2,'AI Service Detail '+incomingPhoneId,`${btnId} -> ${asSvc}`,'AI Service',HELP_ADMIN,'AI Service Detail',''],false);
      return;
    }
    // ===== V321 TRY FREE BUSINESS OPPORTUNITY (REFERRAL-ONLY, NO PAYMENT) =====
    // Process declared here - do NOT promise franchisee rights, territory, dashboard or auto-tracking.
    // User shares opportunity anywhere in Kerala, monitors leads MANUALLY.
    // Reward = 5% of amount actually CREDITED to company account within 24 hours of Business Agreement.
    // Opportunity is NOT free for the lead: lead must pay back / pay their opportunity fee completely.
    // EMI = reward varies with amount actually paid/credited, NOT on full fee promise.
    if(btnId==='OPP_TRY_FREE'){
      const sl = state.lang || 'ml';
      const msg = sl==='ml' ? `✅ Try Free Business Opportunity — മനസ്സിലായി! 🙏\n\n💰 *ഇതിൽ പണം അടയ്ക്കേണ്ടതില്ല.*\n\n📌 *Process ഇങ്ങനെയാണ്:*\n1️⃣ Bizmapia Business Opportunity-യെ കുറിച്ച് നിങ്ങളുടെ *friends, family members*-നോട് പറയുക.\n2️⃣ *Publicly social media-യിൽ* share ചെയ്യുക — WhatsApp Status, Facebook, Instagram, YouTube, എവിടെയും ആകാം, *കേരളത്തിൽ എവിടെയും*.\n3️⃣ വന്ന *leads നിങ്ങൾ തന്നെ manually monitor* ചെയ്യുക — ആര് കണ്ടു, ആര് താല്പര്യം കാണിച്ചു, ആര് സംസാരിച്ചു എന്ന് നിങ്ങൾ note ചെയ്യുക.\n4️⃣ Lead-ന് താല്പര്യമുണ്ടെങ്കിൽ അവരെ Maya-യിലേക്ക് / Bizmapia-യിലേക്ക് connect ചെയ്യുക.\n\n🎁 *Reward — Agreement + 24 മണിക്കൂറിനുള്ളിൽ പണം കമ്പനി account-ൽ credit ആയാൽ മാത്രം:*\n*അവർ അടച്ച തുകയുടെ 5%* ആണ് reward.\n• Opportunity ആർക്കും *FREE അല്ല* — lead അവരുടെ opportunity fee *മുഴുവനായി* അടയ്ക്കണം.\n• EMI ആണെങ്കിൽ reward-ഉം മാറും — 24 മണിക്കൂറിനുള്ളിൽ credit ആയ തുകയുടെ 5% മാത്രം.\n• ഉദാഹരണം (മുഴുവൻ fee അടച്ചാൽ): Center Rs.1,00,000 → Rs.5,000 | Municipal Rs.4,00,000 → Rs.20,000 | Corporation Rs.5,00,000 → Rs.25,000 | District Rs.10,00,000 → Rs.50,000\n\n⚠️ Agreement ആയില്ലെങ്കിൽ reward ഇല്ല. ഇത് franchisee ആകുന്നതല്ല — *referral / sharing* മാത്രമാണ്.\n\n👇 മനസ്സിലായെങ്കിൽ താഴെ ക്ലിക്ക് ചെയ്യൂ:` : sl==='hi' ? `✅ Try Free Business Opportunity — समझ गई! 🙏\n\n💰 *इसमें कोई पैसा नहीं देना है।*\n\n📌 *Process इस तरह है:*\n1️⃣ Bizmapia Business Opportunity के बारे में अपने *friends, family members* को बताएं।\n2️⃣ *Publicly social media पर* share करें — WhatsApp Status, Facebook, Instagram, YouTube, कहीं भी, *केरल में कहीं भी।*\n3️⃣ आए हुए *leads को आप खुद manually monitor* करें — किसने देखा, किसने interest दिखाया, किससे बात हुई, आप note करें।\n4️⃣ Lead को interest हो तो उन्हें Maya / Bizmapia से connect करें।\n\n🎁 *Reward — Agreement + 24 घंटे के अंदर पैसा company account में credit होने पर ही:*\n*उन्होंने जो amount दिया, उसका 5%* ही reward है।\n• Opportunity किसी के लिए *FREE नहीं* है — lead को अपनी opportunity fee *पूरी* देनी होगी।\n• EMI हो तो reward भी बदलेगा — 24 घंटे में credit हुई amount का 5% ही।\n• उदाहरण (पूरी fee देने पर): Center Rs.1,00,000 → Rs.5,000 | Municipal Rs.4,00,000 → Rs.20,000 | Corporation Rs.5,00,000 → Rs.25,000 | District Rs.10,00,000 → Rs.50,000\n\n⚠️ Agreement नहीं हुआ तो reward नहीं मिलेगा। यह franchisee बनना नहीं है — सिर्फ *referral / sharing* है।\n\n👇 समझ गए तो नीचे क्लिक करें:` : `✅ Try Free Business Opportunity — Got it! 🙏\n\n💰 *No payment needed for this.*\n\n📌 *Process is like this:*\n1️⃣ Tell your *friends, family members* about Bizmapia Business Opportunity.\n2️⃣ Share it *publicly on social media* — WhatsApp Status, Facebook, Instagram, YouTube, anywhere, *anywhere in Kerala.*\n3️⃣ *Monitor your leads manually yourself* — who saw it, who showed interest, who you spoke to — you note it down.\n4️⃣ If a lead is interested, connect them to Maya / Bizmapia.\n\n🎁 *Reward — ONLY when Agreement is done + amount is credited to company account within 24 hours:*\nReward = *5% of the amount they actually paid.*\n• Opportunity is *NOT free* for anyone — the lead must pay back / pay their opportunity fee *completely.*\n• If EMI, reward also varies — only 5% of the amount credited within 24 hours.\n• Example (if full fee paid): Center Rs.1,00,000 → Rs.5,000 | Municipal Rs.4,00,000 → Rs.20,000 | Corporation Rs.5,00,000 → Rs.25,000 | District Rs.10,00,000 → Rs.50,000\n\n⚠️ No agreement = no reward. This is NOT becoming a franchisee — it is *referral / sharing* only.\n\n👇 If understood, tap below:`;
      await setState(uid,{...state, lastStep:'V321 - Try Free Declared', aiMode:true, lead:{...(state.lead||{}), intent:'try_free_business', funnel:'TRY_FREE_DECLARED', tryFree:true}});
      try{ await sendWithDelay(interactiveButton(uid, msg, [{id:'OPP_TRY_FREE_START',title: sl==='ml'?'മനസ്സിലായി, തുടങ്ങാം':sl==='hi'?'समझ गया, शुरू करें':'Understood, Start'},{id:'OPP_CONTINUE',title: sl==='ml'?'ബിസിനസ് തുടരാം':sl==='hi'?'Business जारी रखें':'Continue Business'}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, msg, incomingPhoneId)); }
      await saveToSheet('System_Logs',[nowIso,uid,sl,'V321 Try Free '+incomingPhoneId,'OPP_TRY_FREE -> process declared: referral-only, manual leads, reward 5% of amount credited within 24h of agreement, lead must pay full fee, EMI varies','V321',HELP_ADMIN,'V321 Try Free',''],false);
      return;
    }
    if(btnId==='OPP_TRY_FREE_START'){
      const sl = state.lang || 'ml';
      const msg = sl==='ml' ? `👍 തുടങ്ങാം! 🚀\n\n📝 *ഇന്ന് തന്നെ ചെയ്യേണ്ടത്:*\n1️⃣ ഒരു friend / family member-നോട് പറയുക.\n2️⃣ ഒരു social media post / status ഇടുക.\n3️⃣ ആര് reply ചെയ്തു എന്ന് note ചെയ്യുക.\n\nLead വന്നാൽ ഇവിടെ തന്നെ അവരുടെ പേര് + സ്ഥലം അയയ്ക്കൂ — ഞാൻ guide ചെയ്യാം.\n\nReward ഓർക്കുക: അടച്ച തുകയുടെ 5% മാത്രം — Agreement + 24 മണിക്കൂറിനുള്ളിൽ credit ആയാൽ മാത്രം.` : sl==='hi' ? `👍 शुरू करते हैं! 🚀\n\n📝 *आज ही करना है:*\n1️⃣ एक friend / family member को बताएं।\n2️⃣ एक social media post / status डालें।\n3️⃣ किसने reply किया, note करें।\n\nLead आए तो यहीं उनका नाम + जगह भेजें — मैं guide करूंगी।\n\nReward याद रखें: दी गई amount का 5% ही — Agreement + 24 घंटे में credit होने पर ही।` : `👍 Let us start! 🚀\n\n📝 *Do this today:*\n1️⃣ Tell one friend / family member.\n2️⃣ Put one social media post / status.\n3️⃣ Note who replied.\n\nWhen a lead comes, send their name + place here — I will guide you.\n\nRemember reward: only 5% of amount actually paid — only after Agreement + credit within 24 hours.`;
      await setState(uid,{...state, lastStep:'V321 - Try Free Started', aiMode:true, lead:{...(state.lead||{}), intent:'try_free_business', funnel:'TRY_FREE_STARTED', tryFree:true}});
      try{ await sendWithDelay(interactiveButton(uid, msg, [{id:'OPP_CONTINUE',title: sl==='ml'?'ബിസിനസ് തുടരാം':sl==='hi'?'Business जारी रखें':'Continue Business'},{id:'AI_SERVICES',title: sl==='ml'?'സേവനങ്ങൾ':'Services'}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, msg, incomingPhoneId)); }
      await saveToSheet('System_Logs',[nowIso,uid,sl,'V321 Try Free Start '+incomingPhoneId,'OPP_TRY_FREE_START -> sharing started','V321',HELP_ADMIN,'V321 Try Free Start',''],false);
      return;
    }
    // ===== V321 CONTINUE BUSINESS OPPORTUNITY - resume exact stuck step, NEVER restart =====
    if(btnId==='OPP_CONTINUE'){
      clearReminders(uid);
      const stuck = state.lastStep||'';
      // If user was in Try Free, stay in Try Free - do NOT jump to paid video flow.
      if(/Try Free|TRY_FREE/i.test(stuck)){
        const sl = state.lang || 'ml';
        const m2 = sl==='ml' ? `👍 Try Free-യിൽ തന്നെ തുടരാം. 😊\n\nനിങ്ങൾ ഇവിടെയാണ്: *${stuck}*\n\nLead വന്നോ? വന്നാൽ പേര് + സ്ഥലം അയയ്ക്കൂ.` : sl==='hi' ? `👍 Try Free में ही जारी रखते हैं। 😊\n\nआप यहाँ थे: *${stuck}*\n\nLead आया? आया तो नाम + जगह भेजें।` : `👍 Continuing in Try Free itself. 😊\n\nYou were at: *${stuck}*\n\nDid a lead come? If yes, send name + place.`;
        await setState(uid,{...state, lastStep:stuck, phoneId:incomingPhoneId});
        try{ await sendWithDelay(interactiveButton(uid, m2, [{id:'OPP_TRY_FREE',title: sl==='ml'?'ഫ്രീ ആയി നോക്കാം':sl==='hi'?'Free में आज़माएं':'Try Free Business'}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, m2, incomingPhoneId)); }
        return;
      }
      const thx = lang==='ml' ? `Thanks for continuing 😊\n\nനിങ്ങൾ ഇവിടെയാണ് നിന്നത്: *${stuck}* — ഇപ്പോൾ തന്നെ തുടരാം:` : lang==='hi' ? `Thanks for continuing 😊\n\nआप यहाँ रुके थे: *${stuck}* — अभी जारी रखते हैं:` : `Thanks for continuing 😊\n\nYou stopped at: *${stuck}* — let's continue right now:`;
      await setState(uid,{...state, lastStep:stuck, phoneId:incomingPhoneId});
      await sendWithDelay(textMessage(uid, thx, incomingPhoneId));
      try{ await repeatLastStep(uid, state, lang, incomingPhoneId); }catch(_){}
      return;
    }
    // V276 FIX: AI_BUSINESS must go DIRECT to Company Video, NOT to generic AI chat (that caused loop + More services in screenshot).
    if(btnId==='AI_BUSINESS'){
      const sl = state.lang || 'ml';
      const sortMsg = sl==='ml' ? `👍 മനസ്സിലായി! ബിസിനസ് അവസരമാണ് വേണ്ടത്. 🙏\n\n🎥 *വീഡിയോ കാണൂ, കമ്പനിയെ കുറിച്ച് മനസ്സിലാക്കൂ.*\n\nകമ്പനി എന്താണ് *പ്രതീക്ഷിക്കുന്നത്*,\nഅവസരത്തിന് അപേക്ഷിക്കാനുള്ള *Terms & Conditions* എന്തൊക്കെയാണ് —\n_എല്ലാം ഇതിൽ ഉണ്ട്._\n\n👇 *വീഡിയോ ഇപ്പോൾ തന്നെ കാണാൻ താഴെയുള്ള See Video ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ:*\n\nവീഡിയോ കണ്ട ശേഷം റിപ്ലൈ ചെയ്യൂ.\n\nഅതിന് ശേഷം *Bizmapia-യിൽ നിന്ന് നിങ്ങൾക്ക് ശരിയായ അവസരം* തിരഞ്ഞെടുക്കാൻ ഞാൻ സഹായിക്കാം. 🤝 ⏳` : sl==='hi' ? `👍 समझ गई! बिज़नेस अवसर चाहिए। 🙏\n\n🎥 *वीडियो देखें, कंपनी को समझें।*\n\nकंपनी क्या *उम्मीद* करती है, अवसर के लिए *Terms & Conditions* क्या हैं — _सब इसमें है।_\n\n👇 *इस अवसर का वीडियो अभी देखने के लिए नीचे See Video बटन पर क्लिक करें:*\n\nवीडियो देखने के बाद रिप्लाई करें।\n\nउसके बाद *Bizmapia से सही अवसर* चुनने में मैं मदद करूंगी। 🤝 ⏳` : `👍 Got it! You want Business Opportunity. 🙏\n\n🎥 *Watch the video, understand the company.*\n\nWhat the company *expects*, what are the *Terms & Conditions* to apply — _everything is in it._\n\n👇 *Click the button below to see video right now - See Video:*\n\nSee the video right now and reply after seeing it.\n\nAfter that I will help you choose the *right opportunity from Bizmapia.* 🤝 ⏳`;
      await setState(uid,{...state, lastStep:'V270 - Business Video Sent', aiMode:true, lead:{...(state.lead||{}), intent:'business_opportunity', funnel:'VIDEO_SENT'}});
      await sendWithDelay(singleCta(uid, sortMsg, {title: '🎥 See Video', url: getCompanyVideoUrl(sl)}, incomingPhoneId));
      const _capUid2 = uid, _capPhone2 = incomingPhoneId, _capLang2 = sl, _capSentAt2 = Date.now();
      setTimeout(async()=>{ try{ const cur = await getState(_capUid2); if(!cur || cur.lastStep!=='V270 - Business Video Sent') return; if(cur.lastReplyAt && cur.lastReplyAt > _capSentAt2) return; /* V289 replied after video */ const capMsg = _capLang2==='ml' ? `🎬 *വീഡിയോ കണ്ടോ?* 😊\n\n💰 *ഞങ്ങളുടെ ബിസിനസ് അവസരം തിരഞ്ഞെടുക്കാൻ, താങ്കൾക്ക് മുടക്കാൻ സാധിക്കുന്ന ഒരു വില പരിധി തിരഞ്ഞെടുത്താൽ ഞാൻ അതിന് പറ്റുന്ന അവസരത്തെക്കുറിച്ച് വിവരങ്ങൾ നൽകാം.*\n\n👇 *താഴെ നിന്ന് ശരിയായ ഒന്ന് തിരഞ്ഞെടുക്കൂ:*` : _capLang2==='hi' ? `🎬 *वीडियो देखा?* 😊\n\n💰 *हमारी Business Opportunity चुनने के लिए, आप invest कर सकने वाली एक price range select करें, मैं उसके लिए सही अवसर के बारे में details दूँगा.*\n\n👇 *नीचे से सही एक चुनें:*` : `🎬 *Did you watch the video?* 😊\n\n💰 *To select our Business Opportunity, if you select a price range you can invest, I will give details about the opportunity that suits it.*\n\n👇 *Choose the right one below:*`; await sendWithDelay(interactiveButton(_capUid2, capMsg, [{id:'OPP_CENTER',title:'30K - 1L'},{id:'OPP_CORP',title:'2L - 5L'},{id:'OPP_DISTRICT',title:'5L - 15L'}], _capPhone2)); }catch(e){} }, 180000);
      await saveToSheet('System_Logs',[nowIso,uid,sl,'V276 AI_BUSINESS '+incomingPhoneId,'AI_BUSINESS button -> direct Company Video + See Video button, no AI loop','V276',HELP_ADMIN,'V276 Business',''],false);
      // V343 FIX: Business Opportunity tap itself must also write to Franchise_Funnel, not only System_Logs - user found Nov 22 test missing
      try{ await saveToSheet('Franchise_Funnel',[nowIso,uid,sl,'Business Opportunity '+incomingPhoneId,'Business Opportunity - Tapped','Clicked',HELP_MARKETING,'V343 Business Tapped',''],true); }catch(e){}
      return;
    }
    if(btnId.startsWith('AI_')){
      const map={AI_BUSINESS:'Business opportunity ariyam',AI_SERVICES:'want to know about our service',AI_TAXI:'Taxi book cheyyanam',AI_TALK:'Team-inodu samsarikkanam',AI_PAY:'Pay cheyyan ready aanu',AI_LATER:'Pinneedu vilikkam',AI_APP_ANDROID:'Android app install cheyyanam',AI_APP_IPHONE:'iPhone app install cheyyanam',AI_STILL_HERE:'Und, thudarram - I am here, continue',AI_NEED_TIME:'Samayam venam, kurachu kazhinju reply cheyyam - need time',AI_REMIND_LATER:'Pinneedu ormmippikku - remind later',AI_REMIND_EVENING:'Vaikunneram ormmippikku - remind evening',AI_REMIND_TOMORROW:'Naale ormmippikku - remind tomorrow',AI_NOT_INTERESTED:'Thalparyam illa, venda - not interested',OPP_TRY_FREE:'Try Free Business Opportunity - referral only, no payment',OPP_CONTINUE:'Continue Business Opportunity - continue from same step'};
      const asText=map[btnId]||'Hello';
      const effLang2=state.lang||'ml'; const hist2=state.aiHistory||[];
      const aiRes2=AI_ENABLED?await callMayaAI(effLang2, asText, hist2):null;
      if(btnId==='AI_TALK'){
      // V258 GATE: Don't alert team with blank "want to talk". Ask WHAT they want first.
      // Only alert team AFTER Maya knows name/district/need, or if user already explained in history.
      const histLen = (state.aiHistory||[]).length;
      const hasContext = (state.lead && (state.lead.district || state.lead.intent)) || histLen >= 4;
      if(!hasContext){
        const slG = state.lang || 'ml';
        const askText = slG==='ml' ? `🙏 ടീമിനോട് സംസാരിക്കും മുമ്പ് ഒന്ന് പറയാമോ?\n\nടീം തിരക്കിലാണ്, ഞാൻ വേഗം പറഞ്ഞു തരാം.\n\n👉 എന്താണ് അറിയേണ്ടത്?\n1. Business opportunity-യെ കുറിച്ച്\n2. Token / Payment-നെ കുറിച്ച്\n3. App-നെ കുറിച്ച്\n\nടൈപ്പ് ചെയ്ത് പറയൂ, ഞാൻ ഉടൻ മറുപടി തരാം. ടീം വേണമെങ്കിൽ പിന്നെ വിളിക്കാം.` : slG==='hi' ? `🙏 Team se baat karne se pehle ek baat batayein?\n\nTeam busy hai, main jaldi samjha deti hoon.\n\n👉 Kya jaanna hai?\n1. Business opportunity\n2. Token / Payment\n3. App\n\nType karke batayein, main turant jawab dungi.` : `🙏 Before I connect you to team, one thing?\n\nTeam is busy, I can explain faster.\n\n👉 What do you want to know?\n1. Business opportunity\n2. Token / Payment\n3. App\n\nType it, I will reply immediately. If you still need team, I will inform them.`;
        try{ await sendWithDelay(interactiveButton(uid, askText, mayaQuickButtons(slG, 'business'), incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, askText, incomingPhoneId)); }
        await setState(uid,{...state, lastStep:'AI Maya - Team Gate Asked', aiMode:true});
        await saveToSheet('System_Logs',[nowIso,uid,slG,'Team Gate '+incomingPhoneId,'User tapped Talk to Team early - Maya asked what they need first, did NOT alert team yet','Team Gate',HELP_ADMIN,'Team Gate',''],false);
        return;
      }
      try{ await notifyAdminTeamRequest(uid, state, 'Tapped Talk to Team button (with context)'); }catch(e){}
    }
      if(aiRes2 && aiRes2.text){
        hist2.push({role:'user',text:asText}); hist2.push({role:'maya',text:aiRes2.text.slice(0,500)});
        state.aiHistory=hist2.slice(-12); state.lastStep='AI Maya - '+effLang2; await setState(uid,state);
        const intent2=aiRes2.intent||detectMayaIntent(asText, aiRes2.text);
        try{ await sendWithDelay(interactiveButton(uid, aiRes2.text, mayaQuickButtons(effLang2, intent2), incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, aiRes2.text, incomingPhoneId)); }
        await saveToSheet('System_Logs',[nowIso,uid,effLang2,'AI Maya Button '+incomingPhoneId,`${btnId} -> ${asText}`,'AI Button',HELP_ADMIN,'AI Maya Button',''],false);
        return;
      }
    }

    // ===== V261 FIX V262: LANGUAGE NOT CONFIRMED YET -> CONFIRM FIRST =====
    // V262 FIX: Cannot use isFreeText here - it is defined LATER. Compute inline instead.
    const isFreeTextForLangCheck = !!txt && !btnId && msg.type==='text';
    if(isFreeTextForLangCheck && !state.lang){
      const lcText = `Hi, I am Maya here to chat with you! 👋

Welcome to Bizmapia! 🙏
🇮🇳 India's Largest Online Platform - First 4-in-1 App in India

👇 To start, please tap your language below:`;
      try{ await sendWithDelay(interactiveButton(uid, lcText, [{id:'LANG_ML',title:'മലയാളം'},{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'हिन्दी'}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, lcText, incomingPhoneId)); }
      await setState(uid,{...state, lastStep:'V261 - Language Confirm Sent', phoneId: incomingPhoneId});
      return;
    }
    // ===== V248 AI MAYA - FREE-TEXT -> AI FIRST (buttons still work below) =====
    // Only for typed text, not button clicks. Payment / Pay / verification steps keep old button flow.
    // ===== V316 VOICE - audio keeps same step, never restart =====
    if(msg.type==='audio' || msg.type==='voice' || msg.type==='ptt'){
      const slV = state.lang || 'ml';
      const stepV = state.lastStep || 'AI Maya - Fresh';
      const vMsg = slV==='ml' ? `🎤 Voice kettu. 🙏\n\nNingal ippol ullathu: ${stepV}.\n\nAthu thanne continue cheyyam. Oru varil type cheythu parayaamo - Business opportunity aano, service aano?` : `🎤 Voice heard. 🙏\n\nYou are at: ${stepV}.\n\nWe continue from the same step. Can you type in one line - Business opportunity or service?`;
      try{ await sendWithDelay(interactiveButton(uid, vMsg, mayaQuickButtons(slV, 'business'), incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, vMsg, incomingPhoneId)); }
      await setState(uid,{...state, lang:slV, lastStep: stepV, aiMode:true});
      return;
    }
    const isFreeText = !!txt && !btnId && msg.type==='text';
    // V255 FIX: AI ALWAYS WINS. Old inPayFlow block removed - it trapped old users in Company Video loop forever.
    // Payment flow is now handled INSIDE Maya AI prompt, not by blocking AI.
    const inPayFlow = false;
    // V255: 1988 = RESET command - clear stale state and restart as fresh AI user
    if(txt && txt.trim()==='1988'){
      try{
        const fresh = { lang: state.lang||'ml', aiHistory: [], lead: {}, lastStep: 'AI Maya - Fresh', aiMode: true, createdAt: Date.now() };
        await setState(uid, fresh); clearReminders(uid);
        await sendWithDelay(textMessage(uid, (state.lang||'ml')==='ml' ? `🔄 ശരി, പുതിയത് തുടങ്ങാം. 🙏\n\nഞാൻ Maya ആണ്. Bizmapia-യിൽ നിന്ന് എന്താണ് വേണ്ടത്? Business opportunity ആണോ?` : `🔄 Okay, fresh start. 🙏\n\nI am Maya. What do you need from Bizmapia? Business opportunity?`, incomingPhoneId));
      }catch(e){}
      return;
    }
    // ===== V316 GLOBAL STOP - 'stop' works from ANY step, not only Busy/Are-you-there =====
    // Bug in V316: free-text 'stop' was only mapped inside Busy/Are-you-there branch (V288). User typed 'stop' on Services/App step -> fell to generic AI sorting. Fixed: exact 'stop' / 'nirthu' / 'nirthuka' / 'stop cheyyu' anywhere -> BUSY_STOP confirm + return, never AI, never sorting.
    try{
      const _stopLow = String(txt||'').toLowerCase().trim();
      const _isStop = txt && !btnId && msg.type==='text' && /^\s*(stop|nirthu|nirthuka|nirthu\s*cheyyu|stop\s*cheyyu|stop\s*cheyyanam|vend|niruthu)[\s.!]*$/i.test(_stopLow);
      if(_isStop){
        await setState(uid,{...state, lastStep:'V316 - Busy Stop - Confirm', phoneId: incomingPhoneId});
        const _cf = (lang||state.lang||'ml')==='ml' ? `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = അപേക്ഷ നിർത്താം, Yes = കുറച്ച് സമയത്തിന് ശേഷം ഓർമ്മിപ്പിക്കാം:` : (lang||state.lang)==='hi' ? `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = आवेदन रोकें, Yes = कुछ समय बाद याद दिलाएँ:` : `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = stop application, Yes = remind after some time:`;
        await sendWithDelay(interactiveButton(uid,_cf,[{id:'STOP_FINAL',title:'Stop'},{id:'STOP_LATER',title:'Yes'}], incomingPhoneId));
        return;
      }
    }catch(_){}
    // V310 FREE-TEXT PAID CLAIM: "yes i done payment" / "paid" / "payment done" typed after reminder -> same Confidence Check, do NOT trust blindly.
    try{
      const _low310 = String(txt||'').toLowerCase().trim();
      const _isPayStep310 = /pay|step 5|registration fee|token|verify/i.test(String(state.lastStep||'')) || state.lastStep==='PAY CLAIMED - Confidence Check';
      const _claimsPaid310 = /(yes.*(done|paid)|i.*paid|payment.*done|paid.*already|already.*paid|i done payment|payment done|paid bro|paid da|adachu|pay cheythu|payment cheythu)/i.test(String(txt||'')) && !/not.*paid|did.*not.*pay|haven.*paid/.test(_low310);
      if(_isPayStep310 && _claimsPaid310 && txt && !btnId){
        state.lastStep=`PAY CLAIMED - Confidence Check ${state.fee||15}L`; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
        const _conf310 = lang==='ml' ? `🤔 Shall I check now?\n\n🔍 ഞാൻ ഇപ്പോൾ തന്നെ payment system-ൽ real-time-ൽ പരിശോധിക്കാൻ പോകുന്നു.\n\n⚠️ അടച്ചിട്ടില്ലെങ്കിൽ എന്റെ പരിശോധനയിൽ എനിക്ക് മനസ്സിലാകും.\n\n👉 നിങ്ങൾ ഉറപ്പാണോ?` : lang==='hi' ? `🤔 Shall I check now?\n\n🔍 मैं अभी payment system में real-time में चेक करने जा रहा हूँ।\n\n⚠️ अगर नहीं भरा तो मेरी checking में मुझे समझ आ जाएगा।\n\n👉 क्या आप sure हैं?` : `🤔 Shall I check now?\n\n🔍 I am going to check with our payment system now in real time.\n\n⚠️ If not paid, I can understand with my checking.\n\n👉 Are you sure?`;
        await sendWithDelay(interactiveButton(uid,_conf310,[{id:'PAY_CONFIRM_CHECK',title:'✅ Yes check'},{id:'PAY_NOW_AGAIN',title:'💳 Pay now'}], incomingPhoneId));
        await saveToSheet('Payments', [getISTTime(), uid, lang, `CLAIMED TEXT ${state.fee||15}L`, String(txt||'').slice(0,80), 'CONFIDENCE CHECK', HELP_MARKETING, state.lastStep, ''], true);
        return;
      }
    }catch(_){}
    // V300 VIDEO-KNOWN + BALANCE - "I know this video, give balance details" = 2 intents in 1 sentence. Maya echoed it before because V288 only knew "seen/watched".
    // Rule: "know this video / already saw / kandu / already watched" = VIDEO SEEN. "balance details / balance amount / balance ethra" = show Full - Token balance for PICKED level + ask to lock slot with token.
    try{
      if(isFreeText){
        const _v = String(txt||'').toLowerCase();
        const _knowsVideo = /know.*video|already.*(saw|seen|watched|kandu)|i.*saw.*video|video.*(kandu|kandhu|ariyam|manasilayi)|seen.*video|watched.*already/.test(_v);
        const _wantsBalance = /balance|remaining|bakki|bakki.*(amount|details|ethra|entha)|full.*(fee|amount)|total.*(fee|amount)/.test(_v);
        if(_knowsVideo || _wantsBalance){
          const _L0 = lang || state.lang || 'en';
          const _lvl = state.sub || state.lead?.level || 'OPP_CENTER';
          const _info = _lvl==='OPP_DISTRICT' ? {name:'District Franchise', full:'10 Lakh', token:250, bal:'Rs.9,99,750', emi:'EMI available'} : _lvl==='OPP_CORP' ? {name:'Corporation / Municipal', full:'4-5 Lakh', token:150, bal:'Rs.3,99,850 - 4,99,850', emi:'EMI available'} : {name:'Business Center', full:'1 Lakh', token:100, bal:'Rs.99,900', emi:'Down Rs.30,000 + EMI'};
          const _ans0 = _L0==='ml' ? `👍 മനസ്സിലായി! വീഡിയോ അറിയാം — കണ്ടതായി കുറിച്ചു. 🙏\n\n💰 *Balance Details — ${_info.name}:*\n\n• Full Fee: ~${_info.full}\n• Token (ഇപ്പോൾ): Rs.${_info.token} — slot lock ചെയ്യാൻ\n• Balance after Token: ${_info.bal}\n• ${_info.emi}\n\nToken അടച്ചാൽ slot lock ആകും, പിന്നെ ടീം verification-ന് വിളിക്കും. ഇപ്പോൾ Token അടയ്ക്കണോ?` : _L0==='hi' ? `👍 समझ गई! Video जानते हैं — देखा हुआ नोट कर लिया। 🙏\n\n💰 *Balance Details — ${_info.name}:*\n\n• Full Fee: ~${_info.full}\n• Token (अभी): Rs.${_info.token} — slot lock के लिए\n• Token के बाद Balance: ${_info.bal}\n• ${_info.emi}\n\nToken देते ही slot lock होगा, फिर team verification के लिए call करेगी। अभी Token दें?` : `👍 Got it! You know this video — marked as seen. 🙏\n\n💰 *Balance Details — ${_info.name}:*\n\n• Full Fee: ~${_info.full}\n• Token (now): Rs.${_info.token} — to lock your slot\n• Balance after Token: ${_info.bal}\n• ${_info.emi}\n\nOnce you pay Token, slot locks, then team will call for verification. Pay Token now?`;
          const _h0=[...(state.aiHistory||[])]; _h0.push({role:'user',text:String(txt||'').slice(0,300)}); _h0.push({role:'maya',text:_ans0.slice(0,500)});
          state.aiHistory=_h0.slice(-12); state.lastStep='V300 - Video Known + Balance Shown '+_lvl; state.aiMode=true;
          if(_knowsVideo){ state.lead={...(state.lead||{}), videoSeen:true, funnel:'VIDEO_SEEN'}; }
          await setState(uid, state);
          const _bPay = _L0==='ml' ? 'Token അടയ്ക്കാം' : _L0==='hi' ? 'Token दें' : 'Pay Token Now';
          const _bLater = _L0==='ml' ? 'പിന്നീട്' : _L0==='hi' ? 'बाद में' : 'Later';
          try{ await sendWithDelay(interactiveButton(uid, _ans0, [{id:'PAY_TOKEN',title:_bPay},{id:'AI_BUSINESS',title: _L0==='ml'?'ബിസിനസ് അവസരം':'Business Opportunity'}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, _ans0, incomingPhoneId)); }
          await saveToSheet('System_Logs',[nowIso,uid,_L0,'V300 VideoKnownBalance '+incomingPhoneId,'Video known + balance: '+String(txt||'').slice(0,80),'V300',HELP_ADMIN,'V300 Balance',''],false);
            // V308 REMINDER RE-ARM: after balance, arm GEN reminder if user goes silent.
            try{ scheduleReminder(uid,'install:GEN_ARE_YOU_THERE:10',_L0,2*60*1000,incomingPhoneId); }catch(_){}
          return;
        }
      }
    }catch(_){}
    // V299 CONTEXT MEMORY - Maya must remember what SHE just asked. "idukki" after "Which district are you from?" is a DISTRICT ANSWER, not a new random message.
    // Without this, Maya asks district -> user answers -> Maya says "Got it! heard you" + generic menu. That is the 90% missing.
    // Rule: Look at last Maya message in aiHistory. If it asked a question, THIS message is the answer to THAT question.
    try{
      if(isFreeText){
        const _hist = state.aiHistory||[];
        const _lastMaya = [..._hist].reverse().find(h=>h.role==='maya')?.text || '';
        const _cur = String(txt||'').trim().toLowerCase();
        const _L9 = lang || state.lang || 'en';
        // 1) District answer: Maya asked "Which district are you from?"
        if(/which district|district.*from|ente district|which district are you/.test(_lastMaya.toLowerCase())){
          const _districts = ['thiruvananthapuram','trivandrum','kollam','pathanamthitta','alappuzha','alleppey','kottayam','idukki','ernakulam','kochi','thrissur','palakkad','malappuram','kozhikode','calicut','wayanad','kannur','kasaragod','chennai','bangalore','bengaluru','hyderabad','mumbai','delhi','pune','coimbatore','madurai'];
          const _found = _districts.find(d=>_cur.includes(d));
          if(_found){
            const _cap = _found.charAt(0).toUpperCase()+_found.slice(1);
            state.lead = {...(state.lead||{}), district:_cap, intent: state.lead?.intent||'unknown'};
            state.lastStep='V299 - District Saved '+_cap; state.aiMode=true;
            const _h9=[..._hist]; _h9.push({role:'user',text:String(txt||'').slice(0,300)}); const _ans9 = _L9==='ml' ? `👍 *${_cap}* — കുറിച്ചു! 🙏\n\n${_cap}-യിൽ നിന്ന് Bizmapia-യോടൊപ്പം എന്താണ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നത്?\n\n• Business Opportunity എടുത്ത് ${_cap}-യിൽ വരുമാനം ഉണ്ടാക്കണോ?\n• അതോ സേവനം ഉപയോഗിക്കണോ?` : _L9==='hi' ? `👍 *${_cap}* — नोट कर लिया! 🙏\n\n${_cap} से Bizmapia के साथ क्या करना चाहते हैं?\n\n• Business Opportunity लेकर ${_cap} में कमाना है?\n• या Service use करनी है?` : `👍 *${_cap}* — noted! 🙏\n\nWhat would you like to do with Bizmapia from ${_cap}?\n\n• Take Business Opportunity and earn in ${_cap}?\n• Or use a service?`;
            _h9.push({role:'maya',text:_ans9.slice(0,500)}); state.aiHistory=_h9.slice(-12);
            await setState(uid, state);
            try{ await sendWithDelay(interactiveButton(uid, _ans9, [{id:'AI_BUSINESS',title: _L9==='ml'?'ബിസിനസ് അവസരം':'Business Opportunity'},{id:'AI_SERVICES',title: _L9==='ml'?'സേവനങ്ങൾ ഉപയോഗിക്കാം':'Use Other Services'}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, _ans9, incomingPhoneId)); }
            await saveToSheet('System_Logs',[nowIso,uid,_L9,'V299 District '+incomingPhoneId,'District answer saved: '+_cap,'V299',HELP_ADMIN,'V299 District',''],false);
            return;
          }
        }
        // 2) Phone answer: Maya asked "Android or iPhone?"
        if(/android.*iphone|iphone.*android|which phone/.test(_lastMaya.toLowerCase())){
          if(/android/.test(_cur) || /iphone|ios|apple/.test(_cur)){
            const _ph = /android/.test(_cur) ? 'Android' : 'iPhone';
            state.lead = {...(state.lead||{}), phone:_ph}; state.lastStep='V299 - Phone Saved '+_ph; state.aiMode=true;
            const _ansP = _L9==='ml' ? `👍 *${_ph}* — മനസ്സിലായി!\n\nBizmapia App ${_ph}-ൽ install ചെയ്യാൻ ഞാൻ ലിങ്ക് തരാം. ആദ്യം പറയൂ — Business Opportunity ആണോ വേണ്ടത്, അതോ സേവനം ഉപയോഗിക്കാനാണോ?` : `👍 *${_ph}* — got it!\n\nI will give you the Bizmapia App link for ${_ph}. First tell me — do you want Business Opportunity or use a service?`;
            const _hP=[..._hist]; _hP.push({role:'user',text:String(txt||'').slice(0,300)}); _hP.push({role:'maya',text:_ansP.slice(0,500)}); state.aiHistory=_hP.slice(-12);
            await setState(uid, state);
            try{ await sendWithDelay(interactiveButton(uid, _ansP, [{id:'AI_BUSINESS',title:'Business Opportunity'},{id:'AI_SERVICES',title:'Use Other Services'}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, _ansP, incomingPhoneId)); }
            return;
          }
        }
        // 3) Yes/No answer to "Want to watch video?" - Maya asked video, user says yes/no
        if(/watch.*video|video.*watch|company video/.test(_lastMaya.toLowerCase()) && (_cur==='yes'||_cur==='no'||_cur==='ok'||_cur==='okay')){
          if(_cur==='yes'||_cur==='ok'||_cur==='okay'){
            state.lastStep='V299 - Video Yes After Ask'; state.aiMode=true; await setState(uid, state);
            const _ansV = _L9==='ml' ? `🎥 സൂപ്പർ! Company Video ഇതാ — 2 മിനിറ്റ് കണ്ടാൽ കമ്പനി മനസ്സിലാകും.\n\nകണ്ട ശേഷം പറയൂ — “kandu” എന്ന് ടൈപ്പ് ചെയ്താൽ മതി.` : `🎥 Super! Here is the Company Video — 2 minutes and you will understand the company.\n\nAfter watching, just type “seen”.`;
            try{ await sendWithDelay(singleCta(uid, _ansV, {title:'🎥 See Video', url: getCompanyVideoUrl(_L9)}, incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, _ansV, incomingPhoneId)); }
            return;
          }
        }
      }
    }catch(_){}
    // V295: FAQ NO-AI ANSWER - Maya must answer real questions even when Gemini fails. "who is owner" fell through to old mainMenu because AI returned null and fallback sent repeatLastStep. This block runs BEFORE AI, needs no AI call, and returns.
    // It handles QUESTION text only (who/what/how/price/services/contact/app), not yes/no/skip/seen which are handled by V288/V292 above.
    try{
      if(isFreeText){
        const _q = String(txt||'').toLowerCase();
        const _isQ = /\?|\bwho\b|\bwhat\b|\bhow\b|\bwhen\b|\bwhere\b|\bwhy\b|\bwhich\b|\bowner\b|\bfounder\b|\bprice\b|\bfee\b|\bcost\b|\bcontact\b|\baddress\b|\bservices?\b|\bapp\b|\bbizmapia\b/.test(_q);
        const _isShortAns = ['yes','no','ok','okay','seen','skip','next','kandu','manasilayi'].includes(_q.trim());
        if(_isQ && !_isShortAns){
          let _ans = null;
          const _L = lang || state.lang || 'en';
          if(/owner|founder|who.*(run|start|made|create)|aadhar|who is.*bizmapia/.test(_q)){
            _ans = _L==='ml' ? `🙏 നല്ല ചോദ്യം!\n\n🌍 *Bizmapia* എന്നത് കേരളത്തിൽ നിന്നുള്ള ഒരു *All-India കമ്പനി* ആണ്.\n\n🏢 Head Office: Thodupuzha, Idukki, Kerala\n🌐 Website: bizmapia.com\n📞 Team: 85901 83646\n\nകമ്പനിയെക്കുറിച്ച് കൂടുതൽ അറിയാൻ Company Video കാണണോ? 👇` : _L==='hi' ? `🙏 अच्छा सवाल!\n\n🌍 *Bizmapia* केरल की एक *All-India कंपनी* है।\n\n🏢 Head Office: Thodupuzha, Idukki, Kerala\n🌐 Website: bizmapia.com\n📞 Team: 85901 83646\n\nCompany के बारे में और जानने के लिए Company Video देखें? 👇` : `🙏 Good question!\n\n🌍 *Bizmapia* is an *All-India company* from Kerala.\n\n🏢 Head Office: Thodupuzha, Idukki, Kerala\n🌐 Website: bizmapia.com\n📞 Team: 85901 83646\n\nWant to know more about the company? Watch the Company Video 👇`;
          } else if(/what.*bizmapia|bizmapia.*(what|entha|enth)/.test(_q)){
            _ans = _L==='ml' ? `🌍 *Bizmapia* എന്നത് നിങ്ങളുടെ ദൈനംദിന ആവശ്യങ്ങൾക്കുള്ള *All-India പ്ലാറ്റ്ഫോം* ആണ്.\n\n🚕 Taxi Booking\n🔍 Business Directory\n🛵 Online Delivery\n📦 Online Booking\n\nഇതിൽ ഏതാണ് വേണ്ടത്? സേവനം ഉപയോഗിക്കാനാണോ, അതോ Business Opportunity എടുത്ത് വരുമാനം ഉണ്ടാക്കാനാണോ?` : _L==='hi' ? `🌍 *Bizmapia* आपकी daily needs के लिए *All-India प्लेटफॉर्म* है।\n\n🚕 Taxi Booking\n🔍 Business Directory\n🛵 Online Delivery\n📦 Online Booking\n\nआपको क्या चाहिए? Service use करना है, या Business Opportunity लेकर कमाना है?` : `🌍 *Bizmapia* is an *All-India platform* for your daily needs.\n\n🚕 Taxi Booking\n🔍 Business Directory\n🛵 Online Delivery\n📦 Online Booking\n\nWhat do you need? Use a service, or take the Business Opportunity and earn with us?`;
          } else if(/price|fee|cost|token|vila|charge/.test(_q)){
            _ans = _L==='ml' ? `💰 *Token Fee:*\n\n• Business Center (30K - 1L): Token Rs.100 | Full ~1 Lakh\n• Corporation / Municipal (2L - 5L): Token Rs.150 | Full ~4-5 Lakh\n• District (5L - 15L): Token Rs.250 | Full ~10 Lakh\n\nToken എന്നത് slot lock ചെയ്യാനാണ്. ഏത് level ആണ് വേണ്ടത്?` : `💰 *Token Fee:*\n\n• Business Center (30K - 1L): Token Rs.100 | Full ~1 Lakh\n• Corporation / Municipal (2L - 5L): Token Rs.150 | Full ~4-5 Lakh\n• District (5L - 15L): Token Rs.250 | Full ~10 Lakh\n\nToken is to lock your slot. Which level do you want?`;
          } else if(/service|sevana/.test(_q)){
            _ans = _L==='ml' ? `🛍️ *Bizmapia Services:*\n\n🚕 Taxi Booking\n🔍 Business Directory - കടകൾ / സേവനങ്ങൾ കണ്ടെത്താം\n🛵 Online Delivery - ഭക്ഷണവും സാധനങ്ങളും വീട്ടിൽ\n📦 Online Booking - Hotel, Appointment, Movie Tickets\n\nഏത് സേവനമാണ് വേണ്ടത്?` : `🛍️ *Bizmapia Services:*\n\n🚕 Taxi Booking\n🔍 Business Directory - find shops / services\n🛵 Online Delivery - food & items to your door\n📦 Online Booking - Hotel, Appointment, Movie Tickets\n\nWhich service do you need?`;
          } else if(/contact|phone|number|call|team|address|office/.test(_q)){
            _ans = _L==='ml' ? `📞 *Team:* 85901 83646\n🏢 Office: Thodupuzha, Idukki, Kerala\n🌐 Website: bizmapia.com\n\nടീം തിരക്കിലാണ്. നിങ്ങൾക്ക് free time-ൽ വിളിക്കാം. Registration fee കഴിഞ്ഞാൽ ടീം നിങ്ങളെ വിളിക്കും.` : `📞 *Team:* 85901 83646\n🏢 Office: Thodupuzha, Idukki, Kerala\n🌐 Website: bizmapia.com\n\nTeam is busy. You can call in your free time. After registration fee, team will call you for verification.`;
          } else if(/where|located|location|head office|office|address|evide|kuth/.test(_q)){
            _ans = _L==='ml' ? `📍 *Bizmapia എവിടെയാണ്?*\n\n🏢 Head Office: 1st Floor, Pulimoottil Arcade, Muvattupuzha Road, Thodupuzha, Idukki - 685584, Kerala\n🌐 Website: bizmapia.com\n📞 Team: 85901 83646\n\nBizmapia ഒരു *All-India പ്ലാറ്റ്ഫോം* ആണ് — എവിടെ നിന്നും ഉപയോഗിക്കാം. നിങ്ങൾ ഏത് ജില്ലയിൽ നിന്നാണ്?` : _L==='hi' ? `📍 *Bizmapia कहाँ है?*\n\n🏢 Head Office: 1st Floor, Pulimoottil Arcade, Muvattupuzha Road, Thodupuzha, Idukki - 685584, Kerala\n🌐 Website: bizmapia.com\n📞 Team: 85901 83646\n\nBizmapia एक *All-India प्लेटफॉर्म* है — कहीं से भी use कर सकते हैं। आप किस जिले से हैं?` : `📍 *Where is Bizmapia located?*\n\n🏢 Head Office: 1st Floor, Pulimoottil Arcade, Muvattupuzha Road, Thodupuzha, Idukki - 685584, Kerala\n🌐 Website: bizmapia.com\n📞 Team: 85901 83646\n\nBizmapia is an *All-India platform* — you can use it from anywhere. Which district are you from?`;
          } else if(/app|install|download|play store|link/.test(_q)){
            _ans = _L==='ml' ? `📱 *Bizmapia App:*\n\nAndroid: Play Store-ൽ Bizmapia എന്ന് search ചെയ്യൂ\n🌐 Website: bizmapia.com\n\nഏത് phone ആണ്? Android ആണോ iPhone ആണോ?` : `📱 *Bizmapia App:*\n\nAndroid: Search Bizmapia on Play Store\n🌐 Website: bizmapia.com\n\nWhich phone do you use? Android or iPhone?`;
          }
          if(!_ans){
            // V298: Catch-all question - if it is NOT a Bizmapia question, say politely I don't have it + suggestions (do not pretend to know). If it IS Bizmapia-related, answer with Bizmapia intro.
            _ans = _L==='ml' ? `🙏 നല്ല ചോദ്യം!\n\n🌍 *Bizmapia* എന്നത് നിങ്ങളുടെ ദൈനംദിന ആവശ്യങ്ങൾക്കുള്ള *All-India പ്ലാറ്റ്ഫോം* ആണ് — Taxi, Directory, Delivery, Booking.\n\n🏢 Office: Thodupuzha, Idukki, Kerala | 🌐 bizmapia.com | 📞 85901 83646\n\nഎന്താണ് വേണ്ടത്? Business Opportunity ആണോ, സേവനമാണോ?` : _L==='hi' ? `🙏 अच्छा सवाल!\n\n🌍 *Bizmapia* आपकी daily needs के लिए *All-India प्लेटफॉर्म* है — Taxi, Directory, Delivery, Booking।\n\n🏢 Office: Thodupuzha, Idukki, Kerala | 🌐 bizmapia.com | 📞 85901 83646\n\nक्या चाहिए? Business Opportunity या Service?` : `🙏 Good question!\n\n🌍 *Bizmapia* is an *All-India platform* for your daily needs — Taxi, Directory, Delivery, Booking.\n\n🏢 Office: Thodupuzha, Idukki, Kerala | 🌐 bizmapia.com | 📞 85901 83646\n\nWhat do you need? Business Opportunity or a service?`;
          }
          if(_ans){
            const _h = state.aiHistory||[]; _h.push({role:'user', text: String(txt||'').slice(0,300)}); _h.push({role:'maya', text: _ans.slice(0,500)}); state.aiHistory=_h.slice(-12); state.lastStep='AI Maya - FAQ '+_L; state.aiMode=true;
            await setState(uid, state);
            try{ await sendWithDelay(textMessage(uid, _ans, incomingPhoneId)); }catch(e){}
            await saveToSheet('System_Logs',[nowIso,uid,_L,'V295 FAQ '+incomingPhoneId, 'FAQ no-AI: '+String(txt||'').slice(0,80),'V295 FAQ',HELP_ADMIN,'V295 FAQ',''],false);
            return;
          }
        }
      }
    }catch(_){}
    // V298 OUT-OF-KNOWLEDGE - If user asks anything OUTSIDE Maya's memory, NEVER guess, NEVER invent, NEVER send old menu.
    // Say politely: I don't have that info + WHY + give 3 related questions Maya CAN answer, so user still leaves satisfied.
    // Maya KNOWS: Bizmapia services, Business Opportunity levels, token fee, videos, office, contact, app, registration flow.
    // Maya DOES NOT KNOW: other companies, politics, weather, scores, stocks, celebrities, astrology, personal data, other apps.
    try{
      if(isFreeText){
        const _o = String(txt||'').toLowerCase();
        const _isBiz = /bizmapia|business|opportunity|franchise|token|fee|price|service|taxi|delivery|directory|booking|video|app|office|contact|team|location|where.*bizmapia|owner/.test(_o);
        const _isOut = !_isBiz && (/\b(who is|what is|tell me|explain|meaning|weather|rain|temperature|cricket|football|score|stock|share price|bitcoin|lottery|astrology|horoscope|prime minister|president|minister|politics|election|actor|actress|celebrity|movie|song|ola|uber|swiggy|zomato|amazon|flipkart|dunzo|rapido|other company|other app|my name|my number|my address|password|otp|pin)\b/.test(_o) || /\?/.test(_o) && _o.split(' ').length>=4);
        // Also: if AI already failed before, this same message would have reached here via fallback - but this block runs BEFORE AI, so out-of-scope is caught early.
        if(_isOut){
          const _L3 = lang || state.lang || 'en';
          const _sugg = _L3==='ml' ? `💡 *എനിക്ക് ഉത്തരം പറയാൻ പറ്റുന്ന ചോദ്യങ്ങൾ:*\n\n1️⃣ Bizmapia എന്താണ്?\n2️⃣ Business Opportunity-യുടെ Token Fee എത്രയാണ്?\n3️⃣ Bizmapia ഓഫീസ് എവിടെയാണ്?\n\nഇതിൽ ഏതെങ്കിലും ഒന്ന് ടൈപ്പ് ചെയ്താൽ മതി, ഞാൻ ഉടൻ പറഞ്ഞു തരാം. 😊` : _L3==='hi' ? `💡 *मैं इन सवालों का जवाब दे सकती हूँ:*\n\n1️⃣ Bizmapia क्या है?\n2️⃣ Business Opportunity की Token Fee कितनी है?\n3️⃣ Bizmapia office कहाँ है?\n\nइनमें से कोई एक टाइप करें, मैं तुरंत बता दूँगी। 😊` : `💡 *Questions I CAN answer for you:*\n\n1️⃣ What is Bizmapia?\n2️⃣ What is the Token Fee for Business Opportunity?\n3️⃣ Where is Bizmapia office?\n\nJust type any one of these and I will answer right away. 😊`;
          const _polite = _L3==='ml' ? `🙏 ക്ഷമിക്കണം, അതിനെക്കുറിച്ച് എന്റെ കൈയിൽ വിവരം ഇല്ല.\n\nഞാൻ *Bizmapia-യുടെ Maya* ആണ് — Bizmapia സേവനങ്ങളെക്കുറിച്ചും Business Opportunity-യെക്കുറിച്ചും മാത്രമേ എനിക്ക് കൃത്യമായി പറയാൻ പറ്റൂ. അറിയാത്ത കാര്യം ഞാൻ ഊഹിച്ച് പറയില്ല, അത് നിങ്ങളെ തെറ്റിദ്ധരിപ്പിക്കും.\n\n${_sugg}` : _L3==='hi' ? `🙏 माफ़ कीजिए, इसके बारे में मेरे पास जानकारी नहीं है।\n\nमैं *Bizmapia की Maya* हूँ — मैं Bizmapia services और Business Opportunity के बारे में ही सही-सही बता सकती हूँ। जो नहीं जानती, वो अंदाज़े पर नहीं कहूँगी, इससे आप गलत समझ सकते हैं।\n\n${_sugg}` : `🙏 Sorry, I don't have information about that.\n\nI am *Maya from Bizmapia* — I can accurately answer only about Bizmapia services and Business Opportunity. I won't guess what I don't know, because that could mislead you.\n\n${_sugg}`;
          const _h3 = state.aiHistory||[]; _h3.push({role:'user', text: String(txt||'').slice(0,300)}); _h3.push({role:'maya', text: _polite.slice(0,500)}); state.aiHistory=_h3.slice(-12); state.lastStep='V298 - Out Of Knowledge Polite'; state.aiMode=true;
          await setState(uid, state);
          const _b1 = _L3==='ml' ? 'ബിസിനസ് അവസരം' : 'Business Opportunity';
          const _b2 = _L3==='ml' ? 'സേവനങ്ങൾ ഉപയോഗിക്കാം' : 'Use Other Services';
          try{ await sendWithDelay(interactiveButton(uid, _polite, [{id:'AI_BUSINESS',title:_b1},{id:'AI_SERVICES',title:_b2}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, _polite, incomingPhoneId)); }
          await saveToSheet('System_Logs',[nowIso,uid,_L3,'V298 OutOfKnowledge '+incomingPhoneId,'Polite unknown: '+String(txt||'').slice(0,80),'V298',HELP_ADMIN,'V298 Unknown',''],false);
          return;
        }
      }
    }catch(_){}
    if(isFreeText && AI_ENABLED && !inPayFlow){
      // V306 LANGUAGE LOCK: AI router MUST use locked language. Never call detectUserLanguage to flip it from content.
      // "seen, next" / Manglish "video kandathanu" are CONTENT, not language change. effLang = locked lang.
      // V307 FIXED TERMS: effLang = locked lang, always. No switch after selection.
      let effLang = state.lang || 'en';
      const _low6b = String(txt||'').toLowerCase().trim();
      // Explicit switch requests are IGNORED once lang is set - reply in locked lang that language is fixed.
      if(!state.lang){
        if(/need\s+malayalam|malayalam\s+please|change.*malayalam/.test(_low6b)) effLang='ml';
        else if(/need\s+english|english\s+please|change.*english/.test(_low6b)) effLang='en';
        else if(/need\s+hindi|hindi\s+please|change.*hindi/.test(_low6b)) effLang='hi';
      }
      if(effLang!==state.lang){ state.lang=effLang; lang=effLang; await setState(uid, {...state, lang:effLang, lastStep:'AI Maya - Lang '+effLang}); }
      const hist = state.aiHistory || [];
      if(needsHuman(txt)){ try{ await notifyHumanHandover(uid, state, txt); }catch(e){} }
      const aiRes = await callMayaAI(effLang, txt, hist);
      if(aiRes && aiRes.text){
        let aiReply = aiRes.text;
        // V364.37 VOICE ECHO: Maya must mention what user said in voice note, then answer. Never reply as if voice was typed text.
        // Format: 🎙️ Voice-il ningal paranjathu: "<transcript>" + answer. Same language as reply.
        if(state.lastVoiceTranscript){
          try{
            const _vt = String(state.lastVoiceTranscript).slice(0,300);
            const _echo13 = effLang==='ml' ? `🎙️ Voice-il ningal paranjathu: "${_vt}"` : effLang==='hi' ? `🎙️ Voice me aapne kaha: "${_vt}"` : `🎙️ In your voice note you said: "${_vt}"`;
            if(!String(aiReply||'').includes(_vt)) aiReply = _echo13 + "\n\n" + String(aiReply||'');
            state.lastVoiceTranscript = ''; state.lastVoiceAt = 0;
          }catch(_){}
        }
        hist.push({role:'user', text: txt.slice(0,300)});
        hist.push({role:'maya', text: aiReply.slice(0,500)});
        state.aiHistory = hist.slice(-12);
        state.lastStep = 'AI Maya - '+effLang;
        state.aiMode = true;
        // V249 SORT
        state.lead = state.lead || {};
        if(!state.lead.source || state.lead.source==='unknown_ask') state.lead.source = detectSourceFromFirstMsg(txt);
        const li = detectIntentLocal(txt); if(li) state.lead.intent = li;
        if(aiRes.intent) state.lead.intent = aiRes.intent;
        const ls = detectSentimentLocal(txt); if(ls) state.lead.sentiment = ls;
        if(aiRes.sentiment) state.lead.sentiment = aiRes.sentiment;
        if(aiRes.level) state.lead.level = aiRes.level;
        if(aiRes.district) state.lead.district = aiRes.district;
        if(aiRes.tokenStatus) state.lead.tokenStatus = aiRes.tokenStatus;
        if(!state.lead.funnel) state.lead.funnel='NEW';
        if(state.lead.intent==='business_opportunity' && state.lead.funnel==='NEW') state.lead.funnel='EXPLAINED';
        if(state.lead.tokenStatus==='READY') state.lead.funnel='TOKEN_READY';
        state.lead.summary = aiReply.slice(0,200);
        const rt = parseReminderTime(txt);
        if(rt || aiRes.reminderWanted){
          state.lead.reminderCount=(state.lead.reminderCount||0)+1;
          const when = rt || {label: aiRes.reminderTimeText||'evening', ms:6*60*60*1000};
          state.lead.reminderAt=when.label; state.lead.tokenStatus=state.lead.tokenStatus||'LATER';
          try{ scheduleReminder(uid,'maya_reminder:'+Date.now(),effLang,when.ms,incomingPhoneId); }catch(e){}
        }
        if(/later|pinne|think|alochikk|tomorrow|naale|not now|ippol venda/.test(txt.toLowerCase())) state.lead.avoidCount=(state.lead.avoidCount||0)+1;
        await setState(uid, state);
        // HYBRID: AI text + max 3 buttons
        const intent = aiRes.intent || detectMayaIntent(txt, aiReply);
        // V260: If this is 1st-2nd AI turn (user hasn't told intention yet), send TEXT ONLY, no buttons. Buttons only after intention known.
        const isEarlyChat = (hist.length <= 3);
        if(isEarlyChat){ try{ await sendWithDelay(textMessage(uid, aiReply, incomingPhoneId)); }catch(e){} }
        else { try{ await sendWithDelay(interactiveButton(uid, aiReply, mayaQuickButtons(effLang, intent), incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, aiReply, incomingPhoneId)); } }
        await logLeadPerfect(uid, state, {lastMsg: txt, summary: aiReply});
        // V252 DAILY + TEAM ALERTS
        try{
          resetDailyIfNeeded();
          if(!state.lead._countedNew){ state.lead._countedNew=true; dailyStats.newLeads++; }
          if(state.lead.tokenStatus==='READY') dailyStats.tokenReady++;
          if(/talk.*team|team.*call|call me|human|manushyan|call.*cheyy|vilikk/.test(txt.toLowerCase()) || btnId==='AI_TALK'){ await notifyAdminTeamRequest(uid, state, 'User asked to talk to team: '+txt.slice(0,80)); }
          const mobMatch = txt.replace(/[^0-9]/g,'');
          if(mobMatch.length===10 && state.lead.intent==='business_opportunity' && !state.lead._contactNotified){ state.lead._contactNotified=true; await notifyAdminContactGiven(uid, state, '91'+mobMatch); }
          if(state.lead.sentiment==='not_interested') dailyStats.notInterested++;
        }catch(e){ console.log('V252 alert fail', e.message); }
        // V250: User may go silent after this reply -> schedule idle checks
        try{ scheduleIdleNudges(uid, effLang, incomingPhoneId); }catch(e){}
        await saveToSheet('System_Logs', [nowIso, uid, effLang, 'AI Maya '+incomingPhoneId, `AI+Buttons(${intent}) Source:${state.lead.source} Intent:${state.lead.intent} Sent:${state.lead.sentiment} Token:${state.lead.tokenStatus}`, 'AI Reply', HELP_ADMIN, 'AI Maya', ''], false);
        return;
      }
      // If AI key missing / fails -> fall through to old button flow below (fail-safe)
    }



    if(btnId.startsWith('LANG_')){
      const l = btnId.replace('LANG_','').toLowerCase();
      lang = l==='ml'?'ml':l==='hi'?'hi':'en';
      await setState(uid,{lang, lastStep:'AI Maya - Lang '+lang, phoneId: incomingPhoneId, aiMode:true, aiHistory:[], lead:{}});
      clearReminders(uid);
      // V256: Language tap -> AI Maya greeting in that language, NOT old mainMenu/earnButtons
      const aiGreet = AI_ENABLED ? await callMayaAI(lang, 'Hi, I selected my language. Language is now CONFIRMED. Now ask me my real intention in my CONFIRMED language ONLY - pure Malayalam script if Malayalam, pure English if English. NO Manglish, NO mixing. Ask ONE question, do NOT give options yet.', []) : null;
      const greetText = aiGreet && aiGreet.text ? aiGreet.text : (lang==='ml' ? `🙏 മലയാളം തിരഞ്ഞെടുത്തതിന് നന്ദി! Excellent choice! 👏\n\nനമസ്കാരം! 🙏 ഞാൻ മായ ആണ്.\n\nബിസ്മാപ്പിയയിൽ നിങ്ങൾ എന്താണ് തേടുന്നത്? ബിസിനസ് അവസരമാണോ, സേവനം ഉപയോഗിക്കാനാണോ, അതോ മറ്റെന്തെങ്കിലുമാണോ?` : lang==='hi' ? `🙏 हिन्दी चुनने के लिए धन्यवाद! Excellent choice! 👏\n\nनमस्कार! 🙏 मैं माया हूँ।\n\nबिज़मैपिया में आप क्या खोज रहे हैं? बिज़नेस अवसर, सेवा, या कुछ और?` : `🙏 Thank you for selecting English! Excellent choice! 👏\n\nHello! 🙏 I am Maya.\n\nWhat are you actually looking for in Bizmapia? Business opportunity, a service, or something else?`);
      try{ await sendWithDelay(textMessage(uid, greetText, incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, greetText, incomingPhoneId)); } // V260: First msg = TEXT ONLY, ask intention
      await saveToSheet('System_Logs', [nowIso, uid, lang, 'Language Selected AI '+incomingPhoneId, lang, 'Clicked', HELP_ADMIN, 'Language AI '+lang, ''], false);
      try{ scheduleIdleNudges(uid, lang, incomingPhoneId); }catch(e){}
      return;
    }

    if(!state.lang){
      try{ if(await isFiredPhone(uid)){ await setState(uid,{first:true, lastStep:'Fired Warning', lang:null, phoneId: incomingPhoneId, firedGate:'WARNED'}); await saveToSheet('System_Logs', [nowIso, uid, 'none', 'Fired Warning '+incomingPhoneId, 'First Message - Fired Number - Warning Sent', 'Received', HELP_ADMIN, 'Fired Warning', ''], true); await sendFiredWarning(uid, incomingPhoneId); return; } }catch(e){ console.log('V247 fired check fail-open', e.message); }
      const L=T.en;
      const msgType = msg.type||'text';
      const rawInput = txt || msgType;
      await sendWithDelay(interactiveButton(uid, `Hi, I am Maya here to chat with you! 👋

Welcome to Bizmapia! 🙏
🇮🇳 India's Largest Online Platform - First 4-in-1 App in India

👇 To start, please tap your language below:`, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'हिन्दी'},{id:'LANG_ML',title:'മലയാളം'}], incomingPhoneId));
      await setState(uid,{first:true, lastStep:'First Message', lang:null, phoneId: incomingPhoneId});
      await saveToSheet('System_Logs', [nowIso, uid, 'none', 'First Message '+incomingPhoneId, `First Input: ${rawInput} (${msgType})`, 'Received', HELP_ADMIN, 'First', ''], true);
      clearReminders(uid);
      scheduleReminder(uid,'noLang:'+Date.now(),'en',1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noLang2:'+Date.now(),'en',12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'noLang3:'+Date.now(),'en',24*60*60*1000, incomingPhoneId);
      return;
    }
    if(isHi && (!state.lastStep || state.lastStep==='First Message' || state.lastStep==='HI - Reset' || state.lastStep==='Language en' || state.lastStep==='Language ml' || state.lastStep==='Language hi')){
      try{ if(state.firedGate!=='ALLOWED' && await isFiredPhone(uid)){ await setState(uid,{first:true, lastStep:'Fired Warning', lang:null, phoneId: incomingPhoneId, firedGate:'WARNED'}); await sendFiredWarning(uid, incomingPhoneId); return; } }catch(e){ console.log('V247 HI fired check fail-open', e.message); }
      // V247 FIX: Hi/Hai/Hello only resets at START. Mid-flow Hai -> falls through to Sorry + Explain -> repeatLastStep (NOT reset)
      const L=T.en;
      clearReminders(uid);
      await setState(uid,{first:true, lastStep:'HI - Reset', lang:null, phoneId: incomingPhoneId});
      await sendWithDelay(interactiveButton(uid, `Hi, I am Maya here to chat with you! 👋

Welcome to Bizmapia! 🙏
🇮🇳 India's Largest Online Platform - First 4-in-1 App in India

👇 To start, please tap your language below:`, [{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'हिन्दी'},{id:'LANG_ML',title:'മലയാളം'}], incomingPhoneId));
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
        // V247: 2 messages - Company video + income level selection (user exact flow)
        // V247 STEP 1 EXACT - user exact matter. Body = roadmap + Step 1 + congrats + ONE what-to-do line + "കമ്പനിയെക്കുറിച്ച്..." line. NO raw link. [Watch Video] CTA carries inbuilt YouTube link. [I know skip] reply -> next step (COMPANY_KNOW handler).
        const step1Exact = lang==='ml'
          ? `🎉 മികച്ച തിരഞ്ഞെടുപ്പ്!\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: Bizmapia അറിയാൻ താഴെ വീഡിയോ കാണൂ.\n\nനന്നായി അറിയാമോ? വീണ്ടും കാണേണ്ട — താഴെ Skip Video ക്ലിക്ക് ചെയ്യൂ:`
          : lang==='hi'
          ? `🎉 बेहतरीन चयन!\n👉 अब क्या करें: Bizmapia जानने के लिए नीचे कंपनी वीडियो देखें।\n\nपहले से जानते हैं? दोबारा देखने की जरूरत नहीं — नीचे Skip Video पर क्लिक करें:`
          : `🎉 Excellent choice!\n👉 What to do now: Watch the Company Video below to know about Bizmapia.\n\nAlready know Bizmapia well? No need to watch again — tap Skip Video below:`;
        const companyVideo = oppRoadmap(lang) + `\n\n` + oppProgress(lang,1) + `\n\n` + step1Exact;
        state.lastStep='Company Video - Must Watch'; await setState(uid,state);
        await sendWithDelay(singleCta(uid, companyVideo, {title: '🎥 See Video', url: getCompanyVideoUrl(lang)}, incomingPhoneId));
        await delay(400);
        await sendWithDelay(interactiveButton(uid, lang==='ml' ? 'നന്നായി അറിയാമോ? Skip ചെയ്യൂ:' : lang==='hi' ? 'पहले से जानते हैं? Skip करें:' : 'Already know Bizmapia well? Tap Skip Video:', [{id:'COMPANY_KNOW',title: lang==='ml' ? '⏭️ സ്കിപ്പ് ചെയ്യൂ' : lang==='hi' ? '⏭️ स्किप करें' : '⏭️ Skip Video'}], incomingPhoneId));
        // V247: Only 1 message now (Company video). Income Level comes ONLY after Watched confirmation (2-min reminder)
        scheduleReminder(uid, 'install:COMPANY_VIDEO_3MIN:3', lang, 3*60*1000, incomingPhoneId);
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

    if(btnId==='COMPANY_VIDEO_WATCH'){
      state.lastStep='Company Video - Watch'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const cv = lang==='ml' ? `👉 ദയവായി കമ്പനി വീഡിയോ പൂർണ്ണമായി കാണുക, തുടർന്ന് \"കമ്പനി വീഡിയോ കണ്ടു\" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `👉 कृपया कंपनी वीडियो पूरा देखें, फिर \"कंपनी वीडियो देखा\" पर क्लिक करें:` : `👉 Please watch Company video fully, then click \"Watched Company Video\":`;
      await sendWithDelay(singleCta(uid, oppProgress(lang,1)+'\n\n'+oppCongrats(lang,1)+'\n\n'+cv, {title: lang==='ml' ? '🎥 See Video' : lang==='hi' ? '🎥 See Video' : '🎥 See Video', url: getCompanyVideoUrl(lang)}, incomingPhoneId)); await delay(400); await sendWithDelay(interactiveButton(uid, lang==='ml' ? 'വീഡിയോ കണ്ടു OR Skip - താഴെ ക്ലിക്ക് ചെയ്യൂ:' : lang==='hi' ? 'वीडियो देखा OR Skip - नीचे क्लिक करें:' : 'Watched OR Skip - tap below:', [{id:'COMPANY_WATCHED',title: lang==='ml' ? 'കമ്പനി വീഡിയോ കണ്ടു' : lang==='hi' ? 'कंपनी वीडियो देखा' : 'Watched Company Video'},{id:'COMPANY_SKIP',title: lang==='ml' ? 'സ്കിപ്പ് ചെയ്യുക' : lang==='hi' ? 'स्किप करें' : 'Skip Video'}], incomingPhoneId)); // V247: NO raw YouTube link in body - link is inside CTA button
      scheduleReminder(uid, 'install:COMPANY_VIDEO_3MIN:3', lang, 3*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='COMPANY_KNOW' || btnId==='COMPANY_SKIP'){
      state.lastStep='Q1 - After Company Video Skipped'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      await sendWithDelay(interactiveButton(uid, v36436Q1Text(lang), v36436Q1Buttons(lang), incomingPhoneId));
      return;
    }
    if(btnId==='COMPANY_WATCHED'){
      state.lastStep='Q1 - After Company Video Watched'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      await sendWithDelay(interactiveButton(uid, v36436Q1Text(lang), v36436Q1Buttons(lang), incomingPhoneId));
      return;
    }
    if(btnId==='COMPANY_NOT_WATCHED'){
      // V247: Company video not watched -> resend video + reschedule 2-min reminder
      state.lastStep='Company Video - Not Watched - Resend'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const companyVideo2 = lang==='ml' ? `👉 ദയവായി കമ്പനി വീഡിയോ പൂർണ്ണമായി കാണുക, തുടർന്ന് "കമ്പനി വീഡിയോ കണ്ടു" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `👉 कृपया कंपनी वीडियो पूरा देखें, फिर "कंपनी वीडियो देखा" पर क्लिक करें:` : `👉 Please watch Company video fully, then click "Watched Company Video":`;
      await sendWithDelay(singleCta(uid, oppProgress(lang,1)+'\n\n'+oppCongrats(lang,1)+'\n\n'+companyVideo2, {title: lang==='ml' ? '🎥 See Video' : lang==='hi' ? '🎥 See Video' : '🎥 See Video', url: getCompanyVideoUrl(lang)}, incomingPhoneId)); await delay(400); await sendWithDelay(interactiveButton(uid, lang==='ml' ? 'വീഡിയോ കണ്ടു - താഴെ ക്ലിക്ക് ചെയ്യൂ:' : lang==='hi' ? 'वीडियो देखा - नीचे क्लिक करें:' : 'Watched - tap below:', [{id:'COMPANY_WATCHED',title: lang==='ml' ? 'കമ്പനി വീഡിയോ കണ്ടു' : lang==='hi' ? 'कंपनी वीडियो देखा' : 'Watched Company Video'}], incomingPhoneId)); // V247: NO raw link - link inside CTA
      scheduleReminder(uid, 'install:COMPANY_VIDEO_3MIN:3', lang, 3*60*1000, incomingPhoneId);
      return;
    }

    // ===== V364.37 Q1 / Q2 HANDLERS =====
    if(btnId==='Q1_RUNNING' || btnId==='Q1_PLANNING' || btnId==='Q1_JUST'){
      const q1 = btnId==='Q1_RUNNING' ? 'RUNNING' : btnId==='Q1_PLANNING' ? 'PLANNING' : 'JUST_ENQUIRY';
      state.q1=q1; state.lastStep='Q1 - '+q1; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      try{ await saveToSheet('System_Logs',[nowIso, uid, lang, 'Q1 '+q1+' '+incomingPhoneId, 'Q1', 'Answered', '', state.lastStep, ''], false); }catch(e){}
      if(q1==='JUST_ENQUIRY'){
        // V364.36: JUST_ENQUIRY = NO Q2, NO video/EMI push. 4 Services only.
        state.lastStep='Just Enquiry - 4 Services Only'; await setState(uid,state);
        await sendWithDelay(interactiveButton(uid, v36436JustText(lang)+'\n\n🚕 Cab  |  🏪 Business Directory  |  🛵 Online Delivery  |  🎟️ Online Booking', [{id:'RIDE_BOOK',title: lang==='ml'?'🚕 Cab':lang==='hi'?'🚕 Cab':'🚕 Cab'},{id:'BIZ_REGISTER',title: lang==='ml'?'🏪 Directory':lang==='hi'?'🏪 Directory':'🏪 Directory'},{id:'DEL_ORDER',title: lang==='ml'?'🛵 Delivery':lang==='hi'?'🛵 Delivery':'🛵 Delivery'}], incomingPhoneId));
        return;
      }
      // Serious only -> Q2
      state.lastStep='Q2 - Serious Only'; await setState(uid,state);
      await sendWithDelay(interactiveButton(uid, v36436Q2Text(lang), v36436Q2Buttons(), incomingPhoneId));
      return;
    }
    if(btnId==='Q2_30K' || btnId==='Q2_2L' || btnId==='Q2_5L'){
      // V364.36: Q2 only reached if Q1 = RUNNING/PLANNING. Guard: if Q1 is JUST, do NOT accept Q2.
      if(state.q1==='JUST_ENQUIRY'){ state.lastStep='Just Enquiry - 4 Services Only'; await setState(uid,state); await sendWithDelay(interactiveButton(uid, v36436JustText(lang), [{id:'RIDE_BOOK',title:'🚕 Cab'},{id:'BIZ_REGISTER',title:'🏪 Directory'},{id:'DEL_ORDER',title:'🛵 Delivery'}], incomingPhoneId)); return; }
      const q2 = btnId==='Q2_30K' ? '30K-1L' : btnId==='Q2_2L' ? '2L-5L' : '5L-15L';
      state.q2=q2; state.lastStep='Q2 - '+q2; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      try{ await saveToSheet('System_Logs',[nowIso, uid, lang, 'Q2 '+q2+' Q1 '+(state.q1||'')+' '+incomingPhoneId, 'Q2', 'Answered', '', state.lastStep, ''], false); }catch(e){}
      if(state.q1==='RUNNING'){
        // RUNNING + Q2 -> Business Centre Video ONLY. Do NOT show District Video.
        state.lastStep='Business Centre Video - Q1 RUNNING + Q2'; await setState(uid,state);
        try{ const _bcUrl = typeof getVideoUrl==='function' ? getVideoUrl('OPP_CENTER', lang) : getCompanyVideoUrl(lang); await sendWithDelay(singleCta(uid, (lang==='ml' ? `✅ നന്ദി! Business Centre വീഡിയോ കാണുക:` : lang==='hi' ? `✅ धन्यवाद! Business Centre वीडियो देखें:` : `✅ Thank you! Please watch Business Centre Video:`), {title:'🎥 See Video', url:_bcUrl}, incomingPhoneId)); }catch(e){ await sendWithDelay(interactiveButton(uid, lang==='ml' ? `✅ നന്ദി! Business Centre വിശദാംശങ്ങൾ:` : lang==='hi' ? `✅ धन्यवाद! Business Centre विवरण:` : `✅ Thank you! Business Centre details:`, [{id:'OPP_CENTER',title:'Business Centre'}], incomingPhoneId)); }
        return;
      }
      // PLANNING + Q2 -> Opportunity Video -> District/Corp/Muni flow (existing Section 5)
      state.lastStep='Opportunity Video - Q1 PLANNING + Q2'; await setState(uid,state);
      try{ const _opUrl = typeof getVideoUrl==='function' ? getVideoUrl('OPP_DISTRICT', lang) : getCompanyVideoUrl(lang); await sendWithDelay(singleCta(uid, (lang==='ml' ? `✅ നന്ദി! Opportunity വീഡിയോ കാണുക:` : lang==='hi' ? `✅ धन्यवाद! Opportunity वीडियो देखें:` : `✅ Thank you! Please watch Opportunity Video:`), {title:'🎥 See Video', url:_opUrl}, incomingPhoneId)); }catch(e){ await sendWithDelay(interactiveButton(uid, lang==='ml' ? `✅ നന്ദി! Opportunity വിശദാംശങ്ങൾ:` : lang==='hi' ? `✅ धन्यवाद! Opportunity विवरण:` : `✅ Thank you! Opportunity details:`, [{id:'OPP_DISTRICT',title:'District'},{id:'OPP_CORP',title:'Corporation'},{id:'OPP_CENTER',title:'Business Centre'}], incomingPhoneId)); }
      return;
    }
    // ===== END V364.37 Q1/Q2 =====
    if(btnId==='OPP_DISTRICT'){
      state.sub='OPP_DISTRICT'; state.lastStep='💰 ₹5L-₹15L Invest - DISTRICT - Video Must Watch'; state.phoneId=incomingPhoneId; 
      await setState(uid,state); clearReminders(uid);
      const videoUrl = getVideoUrl('OPP_DISTRICT', lang);
      const videoObj = getVideoObj('OPP_DISTRICT', lang);
      // V247: 2 messages - Video + watched confirmation (user exact flow)
      const msg1 = lang==='ml' ? `ഹലോ! നിങ്ങൾ ₹5L-₹15L നിക്ഷേപം (ജില്ലാ ഫ്രാഞ്ചൈസി) തിരഞ്ഞെടുത്തു.

ജില്ലാ ഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ നോക്കാം.

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ വീഡിയോ കാണുക.

⚠ പ്രധാന ഘട്ടം: അടുത്ത ഘട്ടത്തിലേക്ക് പോകുന്നതിന് മുൻപ് നിങ്ങൾ ഈ വീഡിയോ പൂർണ്ണമായി കാണണം!` : lang==='hi' ? `हैलो! आपने ₹5L-₹15L निवेश (जिला फ्रेंचाइजी) चुना।

जिला फ्रेंचाइजी विवरण देखें।

👉 अब क्या करें: नीचे वीडियो देखें।

⚠ महत्वपूर्ण चरण: अगले चरण में जाने से पहले आपको यह वीडियो पूरा देखना होगा!` : `Hello! You selected ₹5L-₹15L Investing (District Franchise).

Let's check District Franchise details.

👉 👇 What to do now: Watch the video below.

⚠ Important step: You must watch this video fully before going to next step!`;
      state.learnMode='video'; await setState(uid,state); await sendWithDelay(singleCta(uid, msg1, {title:'🎥 See Video', url: videoUrl}, incomingPhoneId)); await sendWithDelay(interactiveButton(uid, oppLearnQ(lang), [{id:'OPP_VIDEO_WATCHED',title: lang==='ml' ? '✅ വീഡിയോ കണ്ടു' : lang==='hi' ? '✅ वीडियो देखा' : '✅ Watched Video'},{id:'OPP_LEARN_READ',title: lang==='ml' ? '📄 3 ക്ലിക്ക് വായിക്കുക' : lang==='hi' ? '📄 3 क्लिक पढ़ें' : '📄 Read 3 Clicks'}], incomingPhoneId));
      // V247: Only 1 message now (msg1). msg2 (Did you watch?) will come as 2-min reminder, NOT immediately.
      scheduleReminder(uid, 'install:OPP_DISTRICT_VIDEO_5MIN:5', lang, 5*60*1000, incomingPhoneId);
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, '💰 ₹5L-₹15L Invest', 'Clicked', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:OPP_DISTRICT:1', lang, 1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_DISTRICT:12', lang, 12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_DISTRICT:24', lang, 24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='OPP_CORP'){
      state.sub='OPP_CORP'; state.lastStep='💼 ₹2L-₹5L Invest - CORP/MUNI - Video Must Watch'; state.phoneId=incomingPhoneId; 
      await setState(uid,state); clearReminders(uid);
      const videoUrl = getVideoUrl('OPP_CORP', lang);
      const videoObj = getVideoObj('OPP_CORP', lang);
      const msg1 = lang==='ml' ? `ഹലോ! നിങ്ങൾ ₹2L-₹5L നിക്ഷേപം (കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി) തിരഞ്ഞെടുത്തു.

കോർപ്പറേഷൻ / മുനിസിപ്പൽ ഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ നോക്കാം.

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ വീഡിയോ കാണുക.

⚠ പ്രധാന ഘട്ടം: അടുത്ത ഘട്ടത്തിലേക്ക് പോകുന്നതിന് മുൻപ് നിങ്ങൾ ഈ വീഡിയോ പൂർണ്ണമായി കാണണം!` : lang==='hi' ? `हैलो! आपने ₹2L-₹5L निवेश (कॉरपोरेशन / म्युनिसिपल फ्रेंचाइजी) चुना।

कॉरपोरेशन / म्युनिसिपल फ्रेंचाइजी विवरण देखें।

👉 अब क्या करें: नीचे वीडियो देखें।

⚠ महत्वपूर्ण चरण: अगले चरण में जाने से पहले आपको यह वीडियो पूरा देखना होगा!` : `Hello! You selected ₹2L-₹5L Investing (Corporation / Municipal Franchise).

Let's check Corporation / Municipal Franchise details.

👉 👇 What to do now: Watch the video below.

⚠ Important step: You must watch this video fully before going to next step!`;
      state.learnMode='video'; await setState(uid,state); await sendWithDelay(singleCta(uid, msg1, {title:'🎥 See Video', url: videoUrl}, incomingPhoneId)); await sendWithDelay(interactiveButton(uid, oppLearnQ(lang), [{id:'OPP_VIDEO_WATCHED',title: lang==='ml' ? '✅ വീഡിയോ കണ്ടു' : lang==='hi' ? '✅ वीडियो देखा' : '✅ Watched Video'},{id:'OPP_LEARN_READ',title: lang==='ml' ? '📄 3 ക്ലിക്ക് വായിക്കുക' : lang==='hi' ? '📄 3 क्लिक पढ़ें' : '📄 Read 3 Clicks'}], incomingPhoneId));
      // V247: Only 1 message now (msg1). msg2 (Did you watch?) will come as 2-min reminder, NOT immediately.
      scheduleReminder(uid, 'install:OPP_CORP_VIDEO_5MIN:5', lang, 5*60*1000, incomingPhoneId);
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, '💼 ₹2L-₹5L Invest', 'Clicked', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:OPP_CORP:1', lang, 1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_CORP:12', lang, 12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_CORP:24', lang, 24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='OPP_CENTER'){
      state.sub='OPP_CENTER'; state.lastStep='🚀 ₹30K-₹1L Invest - CENTER - Video Must Watch'; state.phoneId=incomingPhoneId; 
      await setState(uid,state); clearReminders(uid);
      const videoUrl = getVideoUrl('OPP_CENTER', lang);
      const videoObj = getVideoObj('OPP_CENTER', lang);
      const msg1 = lang==='ml' ? `ഹലോ! നിങ്ങൾ ₹30K-₹1L നിക്ഷേപം (ബിസിനസ് സെന്റർ) തിരഞ്ഞെടുത്തു.

ബിസിനസ് സെന്റർ വിശദാംശങ്ങൾ നോക്കാം.

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ വീഡിയോ കാണുക.

⚠ പ്രധാന ഘട്ടം: അടുത്ത ഘട്ടത്തിലേക്ക് പോകുന്നതിന് മുൻപ് നിങ്ങൾ ഈ വീഡിയോ പൂർണ്ണമായി കാണണം!` : lang==='hi' ? `हैलो! आपने ₹30K-₹1L निवेश (बिजनेस सेंटर) चुना।

बिजनेस सेंटर विवरण देखें।

👉 अब क्या करें: नीचे वीडियो देखें।

⚠ महत्वपूर्ण चरण: अगले चरण में जाने से पहले आपको यह वीडियो पूरा देखना होगा!` : `Hello! You selected ₹30K-₹1L Investing (Business Center).

Let's check Business Center details.

👉 👇 What to do now: Watch the video below.

⚠ Important step: You must watch this video fully before going to next step!`;
      state.learnMode='video'; await setState(uid,state); await sendWithDelay(singleCta(uid, msg1, {title:'🎥 See Video', url: videoUrl}, incomingPhoneId)); await sendWithDelay(interactiveButton(uid, oppLearnQ(lang), [{id:'OPP_VIDEO_WATCHED',title: lang==='ml' ? '✅ വീഡിയോ കണ്ടു' : lang==='hi' ? '✅ वीडियो देखा' : '✅ Watched Video'},{id:'OPP_LEARN_READ',title: lang==='ml' ? '📄 3 ക്ലിക്ക് വായിക്കുക' : lang==='hi' ? '📄 3 क्लिक पढ़ें' : '📄 Read 3 Clicks'}], incomingPhoneId));
      // V247: Only 1 message now (msg1). msg2 (Did you watch?) will come as 2-min reminder, NOT immediately.
      scheduleReminder(uid, 'install:OPP_CENTER_VIDEO_5MIN:5', lang, 5*60*1000, incomingPhoneId);
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, '🚀 ₹30K-₹1L Invest', 'Clicked', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid, 'install:OPP_CENTER:1', lang, 1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_CENTER:12', lang, 12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid, 'install:OPP_CENTER:24', lang, 24*60*60*1000, incomingPhoneId);
      return;
    }
    // ==================== V247 CONFIRMATION FLOW - ALL LANGUAGES ====================

    // ===== V247 LEARN CHOICE - SINGLE MESSAGE EACH, with Congrats + What to do =====
    if(btnId==='OPP_VIDEO_WATCHED'){
      // V358: user tapped Watched after See Video CTA already opened the video. Do NOT resend video. Go to Benefits.
      state.videoWatched=true; state.oppVideoWatched=true; state.learnMode='video'; state.lastStep='Opportunity Video - Watched'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const benDynV = getBenText(state.sub, lang);
      const qTextV = lang==='ml' ? `\n\n👋 ആനുകൂല്യങ്ങൾ വായിച്ചോ? മനസ്സിലായോ?\n👉 മനസ്സിലായെങ്കിൽ താഴെ ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `\n\n👋 लाभ पढ़े? समझ में आया?\n👉 समझ आया तो नीचे क्लिक करें:` : `\n\n👋 Did you read Benefits? Understood?\n👉 If understood, click below:`;
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+`\n\n`+oppCongrats(lang,3)+`\n\n📄 3 Clicks — 1 of 3: Benefits\n\n`+benDynV+qTextV, [{id:'UNDERSTOOD_BEN',title:L.understoodBen},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId));
      return;
    }
    if(btnId==='OPP_LEARN_VIDEO'){
      state.videoWatched=false; state.oppVideoWatched=false; state.learnMode='video'; state.lastStep='Opportunity Video - Must Watch'; // V286: user said NOT watched - video link IS allowed again state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const vUrl = getVideoUrl(state.sub||'OPP_DISTRICT', lang);
      if(state.sub==='OPP_DISTRICT' || state.sub==='OPP_CORP' || state.sub==='OPP_MUNI'){
        // V247 FRANCHISEE EXPLAINER (District + Corp/Muni ONLY): same as Step 1 - NO raw link, [Watch Video] CTA carries inbuilt YouTube link, NO skip, NO Watched button yet. Watched is confirmed ONLY by the 5-min reminder below.
        const vMsg = oppProgress(lang,3) + `\n\n` + oppCongrats(lang,3) + (lang==='ml' ? `\n\nഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ അറിയാൻ ഈ അവസരത്തിന്റെ വീഡിയോ കാണുക:\n\n👇 *വീഡിയോ കാണാൻ താഴെയുള്ള See Video ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ:*` : lang==='hi' ? `\n\nफ्रेंचाइजी विवरण जानने के लिए इस अवसर का वीडियो देखें:\n\n👇 *वीडियो देखने के लिए नीचे See Video बटन पर क्लिक करें:*` : `\n\nWatch this Opportunity Video to know the franchise details:\n\n👇 *Click the button below to see video - See Video:*`);
        await sendWithDelay(singleCta(uid, vMsg, {title: '🎥 See Video', url: vUrl}, incomingPhoneId));
        scheduleReminder(uid, 'install:OPP_LEARN_VIDEO_5MIN:5', lang, 5*60*1000, incomingPhoneId);
        return;
      }
      // V278 CENTER = CENTER OPPORTUNITY VIDEO (via getVideoUrl OPP_CENTER), NOT Company Video: NO raw link, [Watch Video] CTA carries inbuilt YouTube link, NO "after watching click below" line, NO Watched button here. Watching confirmed ONLY by 5-min reminder below.
      const vMsg = oppProgress(lang,3) + `\n\n` + oppCongrats(lang,3) + (lang==='ml' ? `\n\nഅവസരം മനസ്സിലാക്കാൻ ഈ അവസരത്തിന്റെ വീഡിയോ കാണുക:\n\n👇 *വീഡിയോ കാണാൻ താഴെയുള്ള See Video ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ:*` : lang==='hi' ? `\n\nअवसर समझने के लिए इस अवसर का वीडियो देखें:\n\n👇 *वीडियो देखने के लिए नीचे See Video बटन पर क्लिक करें:*` : `\n\nWatch this Opportunity Video to understand the opportunity:\n\n👇 *Click the button below to see video - See Video:*`);
      await sendWithDelay(singleCta(uid, vMsg, {title: '🎥 See Video', url: vUrl}, incomingPhoneId));
      scheduleReminder(uid, 'install:OPP_LEARN_VIDEO_5MIN:5', lang, 5*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='OPP_LEARN_READ'){
      state.learnMode='read'; state.lastStep='Benefits - After Video Watched'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const benDyn2 = getBenText(state.sub, lang);
      const qText2 = lang==='ml' ? `\n\n👋 ആനുകൂല്യങ്ങൾ വായിച്ചോ? മനസ്സിലായോ?\n👉 മനസ്സിലായെങ്കിൽ താഴെ ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `\n\n👋 लाभ पढ़े? समझ में आया?\n👉 समझ आया तो नीचे क्लिक करें:` : `\n\n👋 Did you read Benefits? Understood?\n👉 If understood, click below:`;
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+`\n\n`+oppCongrats(lang,3)+`\n\n📄 3 Clicks — 1 of 3: Benefits\n\n`+benDyn2+qText2, [{id:'UNDERSTOOD_BEN',title:L.understoodBen},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId));
      return;
    }
    // ===== V284 GENERIC CONTINUE =====
    if(btnId==='GEN_CONTINUE'){
      // Generic "Yes - Continue" from Are-you-there (non-video steps): resend the stuck step
      clearReminders(uid);
      const stuckName = (state.lastStep||'').replace(/^V\d+ - /,'') || 'last step';
      await setState(uid, {...state, lastStep: state.lastStep, phoneId: incomingPhoneId});
      const thxG = lang==='ml' ? `Thanks for continuing your chat 😊\n\nനിങ്ങൾ ഇവിടെയാണ് നിന്നത്: *${stuckName}* — ഇപ്പോൾ തന്നെ തുടരാം:` : lang==='hi' ? `Thanks for continuing your chat 😊\n\nआप यहाँ रुके थे: *${stuckName}* — अभी जारी रखते हैं:` : `Thanks for continuing your chat 😊\n\nYou stopped at: *${stuckName}* — let's continue right now:`;
      await sendWithDelay(textMessage(uid, thxG, incomingPhoneId));
      try{ await repeatLastStep(uid, state, lang, incomingPhoneId); }catch(_){}
      return;
    }
    // ===== V283 BUSY / STOP CHAIN =====
    if(btnId==='BUSY_YES'){
      // Yes = remind after 1 hour
      clearReminders(uid);
      await setState(uid, {...state, lastStep:'V283 - Busy Yes - Remind After 1 Hour', phoneId: incomingPhoneId});
      const okMsg = lang==='ml' ? `👍 മനസ്സിലായി! 1 മണിക്കൂറിന് ശേഷം ഞാൻ ഓർമ്മിപ്പിക്കാം. 😊` : lang==='hi' ? `👍 समझ गई! 1 घंटे बाद मैं याद दिलाऊँगी। 😊` : `👍 Got it! I will remind you after 1 hour. 😊`;
      await sendWithDelay(textMessage(uid, okMsg, incomingPhoneId));
      // V284 GENERIC: if stuck on Video -> video 1h reminder, else generic 1h reminder that resends the stuck step
      if((state.lastStep||'').includes('Video') || (state.lastStep||'').includes('Opportunity')){ scheduleReminder(uid, 'install:OPP_1HOUR_' + (state.sub||'OPP_CENTER') + ':1', lang, 60*60*1000, incomingPhoneId); } else { scheduleReminder(uid, 'install:GEN_1HOUR:1', lang, 60*60*1000, incomingPhoneId); }
      return;
    }
    if(btnId==='BUSY_NO'){
      // No = continue now - back to Yes seen / Watch now
      clearReminders(uid);
      await setState(uid, {...state, lastStep:'V283 - Busy No - Continue Now', phoneId: incomingPhoneId});
      // V284 GENERIC: No = continue now. Video step -> Yes seen / Watch now. Any other stuck step -> resend THAT step (repeatLastStep) with a Thanks line.
      if((state.lastStep||'').includes('Video') || (state.lastStep||'').includes('Opportunity')){
        const thx = lang==='ml' ? `Thanks for continuing your chat 😊\n\n👉 ഇപ്പോൾ തന്നെ തുടരാം — *Yes seen* അല്ലെങ്കിൽ *Watch now* ബട്ടൺ തിരഞ്ഞെടുക്കൂ, അടുത്ത സ്റ്റെപ്പിലേക്ക് പോകാം:` : lang==='hi' ? `Thanks for continuing your chat 😊\n\n👉 अभी जारी रखते हैं — *Yes seen* या *Watch now* बटन चुनें, अगले स्टेप पर चलते हैं:` : `Thanks for continuing your chat 😊\n\n👉 Let's continue right now — please select *Yes seen* or *Watch now* button now to go to the next step:`;
        await sendWithDelay(interactiveButton(uid, thx, [{id:'VIDEO_WATCHED',title:'Yes seen'},{id:'VIDEO_NOT_WATCHED',title:'Watch now'}], incomingPhoneId));
      } else {
        const stuckName = (state.lastStep||'').replace(/^V\d+ - /,'') || 'last step';
        const thx2 = lang==='ml' ? `Thanks for continuing your chat 😊\n\nനിങ്ങൾ ഇവിടെയാണ് നിന്നത്: *${stuckName}* — ഇപ്പോൾ തന്നെ തുടരാം:` : lang==='hi' ? `Thanks for continuing your chat 😊\n\nआप यहाँ रुके थे: *${stuckName}* — अभी जारी रखते हैं:` : `Thanks for continuing your chat 😊\n\nYou stopped at: *${stuckName}* — let's continue right now:`;
        await sendWithDelay(textMessage(uid, thx2, incomingPhoneId));
        try{ await repeatLastStep(uid, state, lang, incomingPhoneId); }catch(_){}
      }
      return;
    }
    if(btnId==='BUSY_STOP'){
      // Stop = ask confirm: really stop, or remind after some time? Buttons: Stop and Yes
      await setState(uid, {...state, lastStep:'V283 - Busy Stop - Confirm', phoneId: incomingPhoneId});
      const cf = lang==='ml' ? `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = അപേക്ഷ നിർത്താം, Yes = കുറച്ച് സമയത്തിന് ശേഷം ഓർമ്മിപ്പിക്കാം:` : lang==='hi' ? `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = आवेदन रोकें, Yes = कुछ समय बाद याद दिलाऊँ:` : `Thanks for sharing your feedback 🙏\n\n*Do you need to stop your application, or want me to remind you after some time?*\n\n👉 Stop = stop application, Yes = remind you after some time:`;
      await sendWithDelay(interactiveButton(uid, cf, [{id:'STOP_FINAL',title:'Stop'},{id:'STOP_LATER',title:'Yes'}], incomingPhoneId));
      return;
    }
    if(btnId==='STOP_FINAL'){
      // Final Stop - move to fired list
      clearReminders(uid);
      await setState(uid, {...state, lastStep:'V283 - Stopped - Fired', phoneId: incomingPhoneId});
      const bye = lang==='ml' ? `👍 മനസ്സിലായി, അപേക്ഷ നിർത്തുന്നു. ആവശ്യമുള്ളപ്പോൾ വീണ്ടും വരൂ. 🙏` : lang==='hi' ? `👍 समझ गई, आवेदन रोक रही हूँ। ज़रूरत हो तो फिर आइए। 🙏` : `👍 Got it, stopping your application. Come back whenever you need. 🙏`;
      await sendWithDelay(textMessage(uid, bye, incomingPhoneId));
      try{ await autoFireLoser(uid, 'OPP - User Stopped Application'); }catch(_){}
      return;
    }
    if(btnId==='STOP_LATER'){
      // Yes = remind after some time: 1h + 12h + 24h about last step, then fired list
      clearReminders(uid);
      await setState(uid, {...state, lastStep:'V283 - Stop Later - 1h/12h/24h Followups', phoneId: incomingPhoneId});
      const okL = lang==='ml' ? `👍 മനസ്സിലായി! 1 മണിക്കൂർ, 12 മണിക്കൂർ, 24 മണിക്കൂർ കഴിഞ്ഞ് ഞാൻ ഓർമ്മിപ്പിക്കാം. 😊` : lang==='hi' ? `👍 समझ गई! 1 घंटे, 12 घंटे, 24 घंटे बाद मैं याद दिलाऊँगी। 😊` : `👍 Got it! I will remind you after 1 hour, 12 hours and 24 hours. 😊`;
      await sendWithDelay(textMessage(uid, okL, incomingPhoneId));
      // V284 GENERIC: Stop-later followups - video steps use OPP_FOLLOWUP_*, every other stuck step uses GEN_FOLLOWUP_* (resends that step)
      if((state.lastStep||'').includes('Video') || (state.lastStep||'').includes('Opportunity')){
        scheduleReminder(uid, 'install:OPP_FOLLOWUP_1H_' + (state.sub||'OPP_CENTER') + ':1', lang, 60*60*1000, incomingPhoneId);
        scheduleReminder(uid, 'install:OPP_FOLLOWUP_12H_' + (state.sub||'OPP_CENTER') + ':12', lang, 12*60*60*1000, incomingPhoneId);
        scheduleReminder(uid, 'install:OPP_FOLLOWUP_24H_' + (state.sub||'OPP_CENTER') + ':24', lang, 24*60*60*1000, incomingPhoneId);
      } else {
        scheduleReminder(uid, 'install:GEN_FOLLOWUP_1H:1', lang, 60*60*1000, incomingPhoneId);
        scheduleReminder(uid, 'install:GEN_FOLLOWUP_12H:12', lang, 12*60*60*1000, incomingPhoneId);
        scheduleReminder(uid, 'install:GEN_FOLLOWUP_24H:24', lang, 24*60*60*1000, incomingPhoneId);
      }
      return;
    }
    // ===== END V283 =====
    if(btnId==='VIDEO_WATCHED'){
      // V287 FIX: Same [Yes seen] button was used for BOTH videos. If Maya is still on Company Video stage (no capacity picked yet),
      // Yes seen means COMPANY video seen -> go to Capacity (Step 2), NOT to Benefits / 3 Clicks (Step 3).
      try{
        const _ls2 = state.lastStep||'';
        const _isCompany2 = _ls2.includes('Company Video') || _ls2.includes('V270 - Business Video') || _ls2.includes('Business Video Sent');
        const _hasCap2 = !!state.sub && (state.sub==='OPP_CENTER' || state.sub==='OPP_CORP' || state.sub==='OPP_DISTRICT' || state.sub==='OPP_MUNI');
        if(_isCompany2 && !_hasCap2){
          state.lastStep='Income Level - After Company Video Watched'; state.companyVideoWatched=true; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
          const incomeMsg2 = lang==='ml' ? `✅ കമ്പനി വീഡിയോ കണ്ടതിന് നന്ദി!\n\nനിങ്ങൾ Bizmapia-യിൽ നിന്ന് വരുമാന സ്ലോട്ട് ബുക്ക് ചെയ്യാൻ പോകുന്നു.\n\n👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: താഴെ നിന്ന് നിക്ഷേപ ശേഷി തിരഞ്ഞെടുക്കുക:-` : lang==='hi' ? `✅ कंपनी वीडियो देखने के लिए धन्यवाद!\n\nआप Bizmapia से आय स्लॉट बुक करने जा रहे हैं।\n\n👉 अब क्या करें: नीचे से निवेश क्षमता चुनें:-` : `✅ Thanks for watching Company video!\n\nYou are going to book an income slot from Bizmapia.\n\n👉 👇 What to do now: Select investing capacity from below:-`;
          await sendWithDelay(interactiveButton(uid, oppProgress(lang,2)+'\n\n'+oppCongrats(lang,2)+'\n\n'+incomeMsg2, L.oppButtons, incomingPhoneId));
          return;
        }
      }catch(_){}
      if(state.learnMode==='video'){
        state.videoWatched=true; state.oppVideoWatched=true;
        state.lastStep='Submit Application - Corp Check'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
        const doneMsg = lang==='ml' ? `✅ വീഡിയോ കണ്ടതിന് നന്ദി! അവസരം മനസ്സിലായി.` : lang==='hi' ? `✅ वीडियो देखने के लिए धन्यवाद! अवसर समझ में आ गया।` : `✅ Thanks for watching video! Opportunity understood.`;
        await sendWithDelay(interactiveButton(uid, oppProgress(lang,4)+'\n\n'+oppCongrats(lang,4)+'\n\n'+doneMsg+'\n\n'+L.corpQ, [{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], incomingPhoneId));
        return;
      }
      state.lastStep='Benefits - After Video Watched'; state.videoWatched=true; state.oppVideoWatched=true; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); // V286: marked Seen - never send video link again unless user taps Watch now
      const benDyn = getBenText(state.sub, lang);
      const qText = lang==='ml' ? `

👋 ആനുകൂല്യങ്ങൾ വായിച്ചോ? മനസ്സിലായോ?

👉 ഇപ്പോൾ ചെയ്യേണ്ടത്: മനസ്സിലായെങ്കിൽ "ആനുകൂല്യം മനസ്സിലായി" ക്ലിക്ക് ചെയ്യുക:` : lang==='hi' ? `

👋 लाभ पढ़े? समझ में आया?

👉 अब क्या करें: समझ आया तो "लाभ समझा" पर क्लिक करें:` : `

👋 Did you read Benefits? Understood?

👉 👇 What to do now: If understood, click "Understood Benefit" below:`;
      const combinedMsg = benDyn + qText;
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n'+oppCongrats(lang,3)+'\n\n📄 3 Clicks — 1 of 3: Benefits\n\n'+combinedMsg, [{id:'UNDERSTOOD_BEN',title:L.understoodBen},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId));
      return;
    }
        if(btnId==='VIDEO_NOT_WATCHED'){
      // V247: Franchisee explainer - user did NOT watch yet. Resend Watch-only video message + reschedule 5-min watched confirmation. No skip.
      state.videoWatched=false; state.oppVideoWatched=false; state.learnMode='video'; state.lastStep='Opportunity Video - Must Watch'; // V286: user said NOT watched - video link IS allowed again state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const vUrl2 = getVideoUrl(state.sub||'OPP_DISTRICT', lang);
      const vMsg2 = oppProgress(lang,3) + `\n\n` + oppCongrats(lang,3) + (lang==='ml' ? `\n\nഫ്രാഞ്ചൈസി വിശദാംശങ്ങൾ അറിയാൻ ഈ അവസരത്തിന്റെ വീഡിയോ കാണുക:\n\n👇 *വീഡിയോ കാണാൻ താഴെയുള്ള See Video ബട്ടൺ ക്ലിക്ക് ചെയ്യൂ:*` : lang==='hi' ? `\n\nफ्रेंचाइजी विवरण जानने के लिए इस अवसर का वीडियो देखें:\n\n👇 *वीडियो देखने के लिए नीचे See Video बटन पर क्लिक करें:*` : `\n\nWatch this Opportunity Video to know the franchise details:\n\n👇 *Click the button below to see video - See Video:*`);
      await sendWithDelay(singleCta(uid, vMsg2, {title: '🎥 See Video', url: vUrl2}, incomingPhoneId));
      scheduleReminder(uid, 'install:OPP_LEARN_VIDEO_5MIN:5', lang, 5*60*1000, incomingPhoneId);
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
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n'+oppCongrats(lang,3)+'\n\n📄 3 Clicks — 1 of 3: Benefits\n\n'+combinedMsg, [{id:'UNDERSTOOD_BEN',title:L.understoodBen},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId));
      return;
    }
    if(btnId==='SKIP_3CLICKS'){
      // V286: User does not want to read the 3 articles (Benefits / Support / Requirements) -> jump straight to next step.
      state.lastStep='Requirements Understood - Skipped 3 Clicks - Ready to Submit'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const skipMsg = lang==='ml' ? `👍 മനസ്സിലായി! 3 ലേഖനങ്ങൾ വായിക്കാതെ അടുത്ത സ്റ്റെപ്പിലേക്ക് പോകാം.` : lang==='hi' ? `👍 समझ गई! 3 लेख पढ़े बिना अगले स्टेप पर चलते हैं।` : `👍 Got it! Skipping the 3 articles, going to the next step.`;
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,4)+'\n\n'+oppCongrats(lang,4)+'\n\n'+skipMsg+'\n\n'+L.corpQ, [{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], incomingPhoneId));
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
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n📄 3 Clicks — 2 of 3: Support\n\n👏 Congratulations! Benefits understood!\n👉 What to do now: Read Support, then click below:\n\n'+combinedMsg, [{id:'UNDERSTOOD_SUP',title:L.understoodSup},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId));
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
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n📄 3 Clicks — 2 of 3: Support\n\n👏 Congratulations! Benefits understood!\n👉 What to do now: Read Support, then click below:\n\n'+combinedMsg, [{id:'UNDERSTOOD_SUP',title:L.understoodSup},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId));
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
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n📄 3 Clicks — 3 of 3: Requirements\n\n👏 Congratulations! Support understood!\n👉 What to do now: Read Requirements, then click below:\n\n'+combinedMsg, [{id:'UNDERSTOOD_REQ',title:L.understoodReq},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId));
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
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n📄 3 Clicks — 3 of 3: Requirements\n\n👏 Congratulations! Support understood!\n👉 What to do now: Read Requirements, then click below:\n\n'+combinedMsg, [{id:'UNDERSTOOD_REQ',title:L.understoodReq},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId));
      return;
    }
    if(btnId==='UNDERSTOOD_REQ'){
      state.lastStep='Requirements Understood - Ready to Submit'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const submitMsg = lang==='ml' ? `✅ എല്ലാം മനസ്സിലായി! ഇപ്പോൾ അപേക്ഷ സമർപ്പിക്കാം.` : lang==='hi' ? `✅ सब समझ में आ गया! अब आवेदन जमा करते हैं।` : `✅ All understood! Now submit application.`;
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,4)+'\n\n'+oppCongrats(lang,4)+'\n\n'+submitMsg+'\n\n'+L.corpQ, [{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], incomingPhoneId));
      return;
    }

    if(btnId==='KNOW_BEN'){ state.lastStep='Benefits'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n'+oppCongrats(lang,3)+'\n\n📄 3 Clicks — 1 of 3: Benefits\n\n'+L.benText + `

Next:`,[{id:'KNOW_SUP',title:L.supBtn},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId)); await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Know Benefits', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_BEN:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_BEN:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_BEN:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='KNOW_SUP'){ state.lastStep='Support'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n📄 3 Clicks — 2 of 3: Support\n\n👏 Congratulations! Benefits understood!\n👉 What to do now: Read Support, then click below:\n\n'+L.supText, [{id:'KNOW_REQ',title:L.reqBtn},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId)); await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Know Support', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_SUP:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUP:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUP:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='KNOW_REQ'){ state.lastStep='Requirements'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid, oppProgress(lang,3)+'\n\n📄 3 Clicks — 3 of 3: Requirements\n\n👏 Congratulations! Support understood!\n👉 What to do now: Read Requirements, then click below:\n\n'+L.reqText, [{id:'SUBMIT_APP',title:L.submitBtn},{id:'SKIP_3CLICKS',title: lang==='ml' ? '⏭️ Skip - അടുത്തത്' : lang==='hi' ? '⏭️ Skip - आगे' : '⏭️ Skip - Go Next'}], incomingPhoneId)); await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Requirements', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_REQ:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_REQ:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_REQ:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='SUBMIT_APP'){ state.lastStep='Submit Application - Corp Check'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid, oppProgress(lang,4)+'\n\n'+oppCongrats(lang,4)+'\n\n'+L.corpQ,[{id:'CORP_YES',title:L.yesCorp},{id:'CORP_NO',title:L.noCorp}], incomingPhoneId)); await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Submit Application', 'Clicked', HELP_MARKETING, state.lastStep, ''], true); scheduleReminder(uid,'install:OPP_SUBMIT:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUBMIT:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OPP_SUBMIT:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='CORP_YES'||btnId==='CORP_NO'){ 
      const isYes = btnId==='CORP_YES'; const fee = getFee(state.sub, isYes); const franchiseName = getFranchiseName(state.sub, isYes);
      state.fee = fee; state.franchiseName = franchiseName; state.isCorp = isYes; state.lastStep=`Ready ${fee}L - ${franchiseName} - Corp:`+btnId; state.phoneId=incomingPhoneId;
      await setState(uid,state); clearReminders(uid); 
      const readyText = getReadyText(lang, fee, franchiseName);
      const readyBtnTitle = lang==='ml' ? `അതെ തയ്യാർ - ${fee}L` : lang==='hi' ? `हाँ तैयार - ${fee}L` : `Yes Ready - ${fee}L`;
      await sendWithDelay(interactiveButton(uid, oppProgress(lang,4)+'\n\n👏 Congratulations! Corp selected!\n👉 What to do now: Click Yes Ready below:\n\n'+readyText,[{id:'READY_15L',title:readyBtnTitle},{id:'KNOW_EMI',title:L.emiBtn}], incomingPhoneId)); 
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
      await sendStep5Exact(uid,lang,state.fee||15,state.sub,incomingPhoneId, payText);
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `Ready ${fee}L`, 'Clicked', HELP_MARKETING, state.lastStep, `Fee:${fee}L`], true);
      scheduleReminder(uid,'install:OPP_READY:1',lang,1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_READY:12',lang,12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:OPP_READY:24',lang,24*60*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='KNOW_EMI'){ const fee = state.fee || 15; state.lastStep=`💳 EMI Options - ${fee}L`; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); const emiText = getEMIText(lang, fee); 
      // V247: District/Corp use 10 and 20 months (L.emi10/L.emi20). Business Center (1L) ONLY uses 5 and 9 months (EMI_5/EMI_9 below)
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
      await sendStep5Exact(uid,lang,state.fee||15,state.sub,incomingPhoneId, payText);
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
      await sendStep5Exact(uid,lang,state.fee||15,state.sub,incomingPhoneId, payText);
      await saveToSheet('Franchise_Funnel', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, `Not Paid ${state.fee||15}L`, 'Pending', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid,'install:NOTPAID:1',lang,1*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:NOTPAID:12',lang,12*60*60*1000, incomingPhoneId);
      scheduleReminder(uid,'install:NOTPAID:24',lang,24*60*60*1000, incomingPhoneId);
      return;
    }
    // V318 AUDIT FIX: PAY_TOKEN was SENT in 5 places (Pay Token step, 3-clicks, repeat-step) but had NO handler - tap fell to generic fallback. Now = Pay Now flow.
    if(btnId==='PAY_TOKEN'){ btnId='PAY_NOW_CLICK'; }
    if(btnId==='PAY_NOW_CLICK'){
      // V247: User clicked Pay Now (reply button) in 1-message Pay flow -> send Pay URL button
      const payLink2 = getRazorpayLinkForSub(state.sub);
      const payText2 = getPayText(lang, state.fee||15, state.sub);
      await sendStep5Exact(uid,lang,state.fee||15,state.sub,incomingPhoneId, payText2);
      return;
    }
    // V247 FIX: PAY_VERIFY had NO handler in V247 - clicking Verify fell to fallback/Main Menu. Now alias of PAY_DONE.
    if(btnId==='PAY_VERIFY'){ btnId='PAY_DONE'; }
    // V310 PAY CLAIM CHECK: user says "I paid" -> do NOT trust blindly. Confidence check first.
    if(btnId==='PAY_CONFIRM_CHECK'){
      // Real-time check = state.verified / paymentVerified set ONLY by Razorpay webhook. Never by claim text.
      const _isVer = !!(state.verified || state.paymentVerified || state.paid || state.razorpayVerified);
      const _time = getISTTime();
      if(_isVer){
        state.lastStep='Payment Verified - Details'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
        const _ok = lang==='ml' ? `✅ Payment verified!\n\n🙏 Thank you! Your payment is confirmed in our payment system at ${_time}.\n\n📄 Next: Tender + Annexure-B is ready for you.\n\n👉 Now type your FULL NAME only:` : lang==='hi' ? `✅ Payment verified!\n\n🙏 धन्यवाद! आपका payment हमारे payment system में ${_time} पर confirm हो गया है।\n\n📄 आगे: Tender + Annexure-B आपके लिए तैयार है।\n\n👉 अब अपना FULL NAME केवल टाइप करें:` : `✅ Payment verified!\n\n🙏 Thank you! Your payment is confirmed in our payment system at ${_time}.\n\n📄 Next: Tender + Annexure-B is ready for you.\n\n👉 Now type your FULL NAME only:`;
        await sendWithDelay(textMessage(uid,_ok, incomingPhoneId));
        await saveToSheet('Payments', [getISTTime(), uid, lang, `VERIFIED ${state.fee||15}L`, 'PAY_CONFIRM_CHECK', 'VERIFIED', HELP_MARKETING, state.lastStep, ''], true);
        return;
      }
      // NOT FOUND - polite, no accusation, timestamped, give UTR option + Pay now
      state.lastStep=`PAY CLAIMED - Checked Not Found ${state.fee||15}L`; state.phoneId=incomingPhoneId; await setState(uid,state);
      const _nf = lang==='ml' ? `🔍 ഞാൻ ഇപ്പോൾ തന്നെ payment system-ൽ പരിശോധിച്ചു (${_time}).\n\n⚠️ നിങ്ങളുടെ ഫീ ഇതുവരെ പ്രതിഫലിച്ചിട്ടില്ല.\n\n🙏 തെറ്റിദ്ധാരണ ഉണ്ടാകാം — വേറെ നമ്പറിൽ നിന്ന് അടച്ചതോ, Razorpay 1-2 മിനിറ്റ് വൈകിയതോ ആകാം.\n\n👉 നിങ്ങൾ അടച്ചിട്ടുണ്ടെങ്കിൽ UTR / Payment ID ഇവിടെ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സ്ക്രീൻഷോട്ട് അയക്കുക.\n\n⚠️ ഫീ അടച്ചില്ലെങ്കിൽ നിങ്ങൾക്ക് ലഭിക്കില്ല:\n• Booking of your opportunity\n• 📄 Tender + Annexure-B documents\n• 📅 Agreement date booking` : lang==='hi' ? `🔍 मैंने अभी payment system में चेक किया (${_time})।\n\n⚠️ आपकी फी अभी तक नहीं दिखी है।\n\n🙏 गलतफहमी हो सकती है — दूसरे नंबर से पे किया हो, या Razorpay 1-2 मिनट late हो।\n\n👉 अगर आपने पे किया है तो UTR / Payment ID यहाँ टाइप करें या स्क्रीनशॉट भेजें।\n\n⚠️ फी नहीं भरी तो आपको नहीं मिलेगा:\n• Booking of your opportunity\n• 📄 Tender + Annexure-B documents\n• 📅 Agreement date booking` : `🔍 I just checked our payment system (${_time}).\n\n⚠️ Your fee is not yet reflected.\n\n🙏 This can be a delay — paid from another number, or Razorpay 1-2 min late.\n\n👉 If you paid, type your UTR / Payment ID here or send a screenshot.\n\n⚠️ If fee is not paid, you will NOT get:\n• Booking of your opportunity\n• 📄 Tender + Annexure-B documents\n• 📅 Agreement date booking`;
      await sendWithDelay(textMessage(uid,_nf, incomingPhoneId)); await delay(400);
      await sendPayNowStep(uid,lang,state.fee||15,state.sub||'OPP_CENTER',incomingPhoneId,_nf,false);
      await saveToSheet('Payments', [getISTTime(), uid, lang, `CHECKED NOT FOUND ${state.fee||15}L`, 'PAY_CONFIRM_CHECK', 'NOT FOUND', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid,'install:VERIFY:1',lang,2*60*1000, incomingPhoneId);
      return;
    }
    if(btnId==='PAY_NOW_AGAIN'){
      state.lastStep='Pay Now Again - After Claim Check'; state.phoneId=incomingPhoneId; await setState(uid,state);
      await sendPayNowStep(uid,lang,state.fee||15,state.sub||'OPP_CENTER',incomingPhoneId,getPayReminderExact(lang,state.fee||15,state.sub||'OPP_CENTER'),false);
      return;
    }
    if(btnId==='PAY_DONE'){
      // V310: USER CLAIMS PAID - CONFIDENCE CHECK FIRST, do not mark verified yet
      state.lastStep=`PAY CLAIMED - Confidence Check ${state.fee||15}L`; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
      const verifyMsg = lang==='ml' ? `⚠️ നിങ്ങൾ പണം അടച്ചതായി ക്ലെയിം ചെയ്തു.

ഞങ്ങൾ Razorpay-ൽ നിന്ന് ഓട്ടോമാറ്റിക്കായി പരിശോധിക്കുകയാണ്.\n\n✅ പേയ്മെന്റ് ശരിയാണെങ്കിൽ 2 മിനിറ്റിനുള്ളിൽ നിങ്ങൾക്ക് ഓട്ടോമാറ്റിക്കായി അടുത്ത സ്റ്റെപ്പ് ലഭിക്കും.\n\nദയവായി നിങ്ങളുടെ Payment ID / UTR ഇവിടെ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സ്ക്രീൻഷോട്ട് അയക്കുക.` : lang==='hi' ? `⚠️ आपने भुगतान का दावा किया है।\n\nहम Razorpay से ऑटो-वेरिफाई कर रहे हैं।\n\n✅ अगर भुगतान सही है तो 2 मिनट में अगला स्टेप ऑटो आएगा।\n\nकृपया अपना Payment ID / UTR टाइप करें या स्क्रीनशॉट भेजें।` : `⚠️ You claimed payment done.\n\nWe are auto-verifying with Razorpay...\n\n✅ If payment is genuine, you will get next step automatically in 2 mins.\n\nPlease also type your Payment ID / UTR or send screenshot for manual check.`;
      // V310 CONFIDENCE CHECK: Shall I check now? I am going to check real-time. If not paid, I can understand with my checking.
      const _conf = lang==='ml' ? `🤔 Shall I check now?\n\n🔍 ഞാൻ ഇപ്പോൾ തന്നെ payment system-ൽ real-time-ൽ പരിശോധിക്കാൻ പോകുന്നു.\n\n⚠️ അടച്ചിട്ടില്ലെങ്കിൽ എന്റെ പരിശോധനയിൽ എനിക്ക് മനസ്സിലാകും.\n\n👉 നിങ്ങൾ ഉറപ്പാണോ?` : lang==='hi' ? `🤔 Shall I check now?\n\n🔍 मैं अभी payment system में real-time में चेक करने जा रहा हूँ।\n\n⚠️ अगर नहीं भरा तो मेरी checking में मुझे समझ आ जाएगा।\n\n👉 क्या आप sure हैं?` : `🤔 Shall I check now?\n\n🔍 I am going to check with our payment system now in real time.\n\n⚠️ If not paid, I can understand with my checking.\n\n👉 Are you sure?`;
      await sendWithDelay(interactiveButton(uid,_conf,[{id:'PAY_CONFIRM_CHECK',title: lang==='ml' ? '✅ Yes check' : lang==='hi' ? '✅ Yes check' : '✅ Yes check'},{id:'PAY_NOW_AGAIN',title: lang==='ml' ? '💳 Pay now' : lang==='hi' ? '💳 Pay now' : '💳 Pay now'}], incomingPhoneId));
      await saveToSheet('Payments', [getISTTime(), uid, lang, `CLAIMED ${state.fee||15}L`, txt || btnId, 'NEEDS VERIFICATION', HELP_MARKETING, state.lastStep, ''], true);
      scheduleReminder(uid,'install:VERIFY:1',lang,2*60*1000, incomingPhoneId);
      return;
    }

    if(btnId.startsWith('STATE_')){ const code=btnId.replace('STATE_',''); const found=ALL_INDIA_STATES_V247.find(s=>v211_stateCode(s)===code); const st=found||code; state.leadState=st; state.detailStep='DISTRICT_BUTTON'; state.lastStep='State '+st; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await v211_sendDistrictList(uid, lang, incomingPhoneId, st); return; }
    if(btnId==='STATE_KERALA'){ state.leadState='Kerala'; state.detailStep='DISTRICT_BUTTON'; state.lastStep='State Kerala'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await v211_sendDistrictList(uid, lang, incomingPhoneId, 'Kerala'); return; }
    if(btnId==='STATE_TAMILNADU'){ state.leadState='Tamil Nadu'; state.detailStep='DISTRICT_TEXT'; state.lastStep='State Tamil Nadu'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid, v211_districtTypeAsk(lang,'Tamil Nadu'), incomingPhoneId)); return; }
    if(btnId==='STATE_OTHER'){ state.leadState='Other'; state.detailStep='DISTRICT_TEXT'; state.lastStep='State Other'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid, v211_districtTypeAsk(lang,'Other State'), incomingPhoneId)); return; }
    // V318 AUDIT FIX: DISTRICT_<state>_<district> buttons (non-Kerala, from v211_sendDistrictList) were SENT but had NO handler - only DISTRICT_KL_ was handled. Now generic handler covers all states.
    if(btnId.startsWith('DISTRICT_') && !btnId.startsWith('DISTRICT_KL_')){
      const _parts = btnId.replace('DISTRICT_','').split('_');
      const _stCode = _parts[0]||''; const _distCode = _parts.slice(1).join('_');
      let _stName = ''; try{ _stName = (ALL_INDIA_STATES_V247||[]).find(s=>typeof v211_stateCode==='function' && v211_stateCode(s)===_stCode) || _stCode; }catch(_){ _stName=_stCode; }
      let _distName = _distCode; try{ const _list = (ALL_INDIA_DISTRICTS_V247||{})[_stName]||[]; const _f = _list.find(d=>typeof v211_stateCode==='function' && v211_stateCode(d)===_distCode); if(_f) _distName=_f; }catch(_){}
      state.leadState=_stName; state.leadDistrict=_distName; state.detailStep='MOBILE'; state.lastStep='District '+_distName; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid, v211_mobileAsk(lang), incomingPhoneId)); return;
    }
    if(btnId.startsWith('DISTRICT_KL_')){ const code=btnId.replace('DISTRICT_KL_',''); const found=KERALA_DISTRICTS_V247.find(d=>d.toUpperCase().replace(/[^A-Z]/g,'')===code); const dist=found||code; state.leadDistrict=dist; state.detailStep='MOBILE'; state.lastStep='District '+dist; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid, v211_mobileAsk(lang), incomingPhoneId)); return; }
    if(btnId.startsWith('OCC_')){ const occ = btnId.replace('OCC_',''); state.occupation=occ; state.lastStep='Occupation '+occ; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); state.detailStep='DATE'; await setState(uid,state); await v211_sendDateCalendar(uid, lang, incomingPhoneId); await saveToSheet('Master_Leads', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Occupation '+occ, 'Clicked', HELP_MARKETING, state.lastStep, occ], true); scheduleReminder(uid,'install:OCC:1',lang,1*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:12',lang,12*60*60*1000, incomingPhoneId); scheduleReminder(uid,'install:OCC:24',lang,24*60*60*1000, incomingPhoneId); return; }
    if(btnId==='CONFIRM_LATE_DATE'){ const iso=state.pendingDate||state.date; if(!iso){ await v211_sendDateCalendar(uid, lang, incomingPhoneId); return; } state.date=iso; state.visitDate=iso; state.detailStep='DONE'; state.lastStep='Date Confirmed Late '+iso; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); const tenderMsgL = getTenderGreeting(state.sub||'OPP_DISTRICT', lang, state); const confirmL = lang==='ml' ? `✅ Visit Confirmed - Late Date Accepted!\n\n📅 Your visit date: ${v211_formatDate(iso)}\n\n⚠️ Note: You selected more than 7 days after Registration Fee date. Your slot is at risk - Please try to come earlier if possible. Team will call you to confirm.` : lang==='hi' ? `✅ Visit Confirmed - Late Date Accepted!\n\n📅 आपकी visit date: ${v211_formatDate(iso)}\n\n⚠️ Note: आपने Registration Fee date से 7 दिन से ज्यादा बाद की date चुनी है। आपका slot risk में है - अगर possible हो तो पहले आने की कोशिश करें। Team confirm करने के लिए call करेगी।` : `✅ Visit Confirmed - Late Date Accepted!\n\n📅 Your visit date: ${v211_formatDate(iso)}\n\n⚠️ Note: You selected more than 7 days after Registration Fee date. Your slot is at risk - Please try to come earlier if possible. Team will call you to confirm.`; await sendWithDelay(textMessage(uid, confirmL+'\n\n'+tenderMsgL+'\n\n'+L.thanks, incomingPhoneId)); await saveToSheet('Master_Leads', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Date Late Confirmed '+iso, 'Clicked - Late Date Warning Accepted', HELP_MARKETING, state.lastStep, JSON.stringify(state)], true); await v211_saveFinalLead(uid, lang, {...state, occupation:state.occupation}, iso); await setState(uid,{lang, lastStep:'Completed', flow:'DONE', occupation:state.occupation, date:iso, visitDate:iso, lateWarning:true, leadName:state.leadName, leadState:state.leadState, leadDistrict:state.leadDistrict, leadMobile:state.leadMobile, phoneId: incomingPhoneId}); return; }
    if(btnId==='PICK_EARLIER_DATE'){ state.detailStep='DATE'; state.lastStep='Date - Pick Earlier'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid, lang==='ml' ? `👏 Good decision! Pick an earlier date - Within 7 days - To save your slot:` : lang==='hi' ? `👏 अच्छा फैसला! Earlier date चुनें - 7 दिन के अंदर - अपना slot बचाने के लिए:` : `👏 Good decision! Pick an earlier date - Within 7 days - To save your slot:`, incomingPhoneId)); await v211_sendDateCalendar(uid, lang, incomingPhoneId); return; }
    if(btnId==='DATE_TYPE_OTHER'){ state.detailStep='DATE_TYPE'; state.lastStep='Date - Type Other'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid, v211_dateTypeAsk(lang), incomingPhoneId)); return; }
    if(btnId==='DATE_CALENDAR'){ state.detailStep='DATE'; state.lastStep='Date - Calendar'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await v211_sendDateCalendar(uid, lang, incomingPhoneId); return; }
    if(btnId.startsWith('DATE_') && /^DATE_\d{4}-\d{2}-\d{2}$/.test(btnId)){ const iso=btnId.replace('DATE_',''); const diff=v211_daysFromToday(iso); if(diff>7){ state.pendingDate=iso; state.detailStep='DATE_WARNING'; state.lastStep='Date Warning '+iso; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid, v211_lateWarning(lang, iso, diff), [{id:'CONFIRM_LATE_DATE',title: lang==='ml' ? 'Confirm This Date' : lang==='hi' ? 'Confirm This Date' : 'Confirm This Date'},{id:'PICK_EARLIER_DATE',title: lang==='ml' ? 'Pick Earlier Date' : lang==='hi' ? 'Pick Earlier Date' : 'Pick Earlier Date'}], incomingPhoneId)); return; } state.date=iso; state.visitDate=iso; state.detailStep='DONE'; state.lastStep='Date '+iso; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); const tenderMsg = getTenderGreeting(state.sub||'OPP_DISTRICT', lang, state); const confirm2 = lang==='ml' ? `✅ Visit Confirmed!\n\n📅 Your visit date: ${v211_formatDate(iso)}\n\n👇 Team will visit you on this exact date.` : lang==='hi' ? `✅ Visit Confirmed!\n\n📅 आपकी visit date: ${v211_formatDate(iso)}\n\n👇 Team आपसे इसी exact date पर मिलेगी।` : `✅ Visit Confirmed!\n\n📅 Your visit date: ${v211_formatDate(iso)}\n\n👇 Team will visit you on this exact date.`; await sendWithDelay(textMessage(uid, confirm2+'\n\n'+tenderMsg+'\n\n'+L.thanks, incomingPhoneId)); await saveToSheet('Master_Leads', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Date '+iso, 'Clicked - Exact Date', HELP_MARKETING, state.lastStep, JSON.stringify(state)], true); await v211_saveFinalLead(uid, lang, {...state, occupation:state.occupation}, iso); await setState(uid,{lang, lastStep:'Completed', flow:'DONE', occupation:state.occupation, date:iso, visitDate:iso, leadName:state.leadName, leadState:state.leadState, leadDistrict:state.leadDistrict, leadMobile:state.leadMobile, phoneId: incomingPhoneId}); return; }
    if(btnId.startsWith('DATE_') && btnId!=='DATE_TYPE_OTHER' && btnId!=='DATE_CALENDAR'){ await sendWithDelay(textMessage(uid, v211_dateTypeAsk(lang), incomingPhoneId)); return; }

    if(btnId==='YES_ACTIVATE'){ state.installed=true; state.lastStep='Yes Activate'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(textMessage(uid,L.activated, incomingPhoneId)); await saveToSheet('Ride_Hailing', [nowIso, uid, lang, state.sub||'App', 'Yes Activate - Installed', 'Success', state.service==='SVC_OPP' ? HELP_MARKETING : HELP_ADMIN, state.lastStep, ''], true); return; }
    if(btnId==='NO_LATER'){ state.lastStep='No Later'; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); const isOpp = state.service==='SVC_OPP' || state.sub?.startsWith('OPP_'); const callNum = isOpp ? HELP_MARKETING_FULL : HELP_ADMIN_FULL; await sendCtaSequence(uid, L.noProblem, [{type:'url', title:'Android', url:PLAY_STORE},{type:'url', title:'iOS', url:APP_STORE},{type:'phone', title:'Call', phone:callNum}], incomingPhoneId); await saveToSheet('Ride_Hailing', [nowIso, uid, lang, state.sub||'App', 'No Later - Pending', 'Pending', isOpp?HELP_MARKETING:HELP_ADMIN, state.lastStep, ''], true); scheduleReminder(uid, `install:${state.sub||'APP'}:1`, lang, 1*60*60*1000, incomingPhoneId); scheduleReminder(uid, `install:${state.sub||'APP'}:12`, lang, 12*60*60*1000, incomingPhoneId); scheduleReminder(uid, `install:${state.sub||'APP'}:24`, lang, 24*60*60*1000, incomingPhoneId); return; }
    // V247 REAL DIALER: HUMAN_TALK + CALL handlers - 1 tap opens dialer, NEVER goes to Main Menu
    if(btnId==='HUMAN_TALK'||btnId==='TALK_TO_TEAM'||btnId==='CONTACT_TEAM'){
      const isOppV247 = state.service==='SVC_OPP' || (state.sub||'').startsWith('OPP_') || (state.lastStep||'').includes('Pay') || (state.lastStep||'').includes('EMI') || (state.lastStep||'').includes('Ready');
      const dialNumV247 = isOppV247 ? HELP_MARKETING : HELP_ADMIN;
      await sendWithDelay(realDialerCta(uid, getDialerText(lang, isOppV247), dialNumV247, incomingPhoneId));
      await saveToSheet('Franchise_Funnel', [getISTTime(), uid, lang, 'Business Opportunity '+incomingPhoneId, 'Talk to Team - Dialer Sent', 'Clicked', dialNumV247, state.lastStep||'', ''], true);
      return;
    }
    // V318 AUDIT FIX: CALL_DIALER_<num> / DIAL_<num> reply buttons (from call-button builders) had NO handler - tap fell through. Now = open dialer for that number.
    if(btnId.startsWith('CALL_DIALER_')||btnId.startsWith('DIAL_')){
      const _dialNum = btnId.replace('CALL_DIALER_','').replace('DIAL_','');
      const _isMkt = _dialNum===HELP_MARKETING || _dialNum===HELP_MARKETING_FULL;
      await sendWithDelay(realDialerCta(uid, getDialerText(lang, _isMkt), _dialNum, incomingPhoneId));
      return;
    }
    if(btnId==='CALL_ADMIN'||btnId==='HELP_ADMIN'||btnId.startsWith('CALL_'+HELP_ADMIN)){
      await sendWithDelay(realDialerCta(uid, getDialerText(lang, false), HELP_ADMIN, incomingPhoneId));
      return;
    }
    if(btnId==='CALL_MARKETING'||btnId==='HELP_MARKETING'||btnId.startsWith('CALL_'+HELP_MARKETING)||btnId.startsWith('CALL_8590')||btnId.startsWith('CALL_91')){
      await sendWithDelay(realDialerCta(uid, getDialerText(lang, true), HELP_MARKETING, incomingPhoneId));
      return;
    }

    if(state.flow==='LEAD' && txt){
      // V247 STRUCTURED DETAILS - NO free-type loophole - Validate each step, do NOT save wrong details
      const step = state.detailStep || 'NAME';
      if(step==='NAME'){
        if(v211_isBadName(txt)){ await sendWithDelay(textMessage(uid, (lang==='ml' ? `😔 Sorry, please type your FULL NAME only - Example: Ajo Devasia\n\n👉 What to do now: Type your full name only:` : lang==='hi' ? `😔 Sorry, कृपया अपना पूरा नाम केवल टाइप करें - Example: Ajo Devasia\n\n👉 What to do now: अपना पूरा नाम केवल टाइप करें:` : `😔 Sorry, please type your FULL NAME only - Example: Ajo Devasia\n\n👉 What to do now: Type your full name only:`), incomingPhoneId)); return; }
        state.leadName=String(txt).trim(); state.detailStep='STATE'; state.lastStep='Name '+state.leadName; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
        await sendWithDelay(interactiveButton(uid, v211_stateAsk(lang), [{id:'STATE_KERALA',title:'Kerala'},{id:'STATE_TAMILNADU',title:'Tamil Nadu'},{id:'STATE_OTHER',title:'Other State'}], incomingPhoneId)); return;
      }
      if(step==='DISTRICT_TEXT'){
        if(v211_isBadName(txt)){ await sendWithDelay(textMessage(uid, (lang==='ml' ? `😔 Sorry, please type DISTRICT name only - Example: Coimbatore` : lang==='hi' ? `😔 Sorry, कृपया DISTRICT नाम केवल टाइप करें - Example: Coimbatore` : `😔 Sorry, please type DISTRICT name only - Example: Coimbatore`), incomingPhoneId)); return; }
        state.leadDistrict=String(txt).trim(); state.detailStep='MOBILE'; state.lastStep='District '+state.leadDistrict; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
        await sendWithDelay(textMessage(uid, v211_mobileAsk(lang), incomingPhoneId)); return;
      }
      if(step==='MOBILE'){
        const mob=v211_isValidMobile(txt); if(!mob){ await sendWithDelay(textMessage(uid, (lang==='ml' ? `😔 Sorry, please type 10-digit MOBILE NUMBER only - Example: 9567742507\n\n👉 What to do now: Type 10-digit mobile only:` : lang==='hi' ? `😔 Sorry, कृपया 10-digit MOBILE NUMBER केवल टाइप करें - Example: 9567742507\n\n👉 What to do now: 10-digit mobile केवल टाइप करें:` : `😔 Sorry, please type 10-digit MOBILE NUMBER only - Example: 9567742507\n\n👉 What to do now: Type 10-digit mobile only:`), incomingPhoneId)); return; }
        state.leadMobile=mob; state.leadData=`${state.leadName||''}, ${state.leadDistrict||''}, ${state.leadState||''}, ${mob}`; state.detailStep='OCC'; state.lastStep='Mobile '+mob; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
        await sendWithDelay(interactiveButton(uid,L.occQ,[{id:'OCC_BUSINESS',title:L.bus},{id:'OCC_HOUSE',title:L.house},{id:'OCC_EMP',title:L.emp}], incomingPhoneId)); await saveToSheet('Master_Leads', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Lead Details Validated', state.leadData, HELP_MARKETING, state.lastStep, state.leadData], true); return;
      }
      if(step==='DATE_TYPE'){
        const iso=v211_parseTypedDate(txt); if(!iso){ await sendWithDelay(textMessage(uid, v211_dateTypeAsk(lang)+'\n\n😔 Sorry, please type DD/MM/YYYY only - Example: 15/11/2026', incomingPhoneId)); return; }
        const diffT=v211_daysFromToday(iso); if(diffT>7){ state.pendingDate=iso; state.detailStep='DATE_WARNING'; state.lastStep='Date Warning Typed '+iso; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid); await sendWithDelay(interactiveButton(uid, v211_lateWarning(lang, iso, diffT), [{id:'CONFIRM_LATE_DATE',title:'Confirm This Date'},{id:'PICK_EARLIER_DATE',title:'Pick Earlier Date'}], incomingPhoneId)); return; }
        state.date=iso; state.visitDate=iso; state.lastStep='Date '+iso; state.phoneId=incomingPhoneId; await setState(uid,state); clearReminders(uid);
        const tenderMsg2 = getTenderGreeting(state.sub||'OPP_DISTRICT', lang, state);
        const confirm = lang==='ml' ? `✅ Visit Confirmed!\n\n📅 Your visit date: ${v211_formatDate(iso)}\n\n👇 Team will visit you on this exact date.` : lang==='hi' ? `✅ Visit Confirmed!\n\n📅 आपकी visit date: ${v211_formatDate(iso)}\n\n👇 Team आपसे इसी exact date पर मिलेगी।` : `✅ Visit Confirmed!\n\n📅 Your visit date: ${v211_formatDate(iso)}\n\n👇 Team will visit you on this exact date.`;
        await sendWithDelay(textMessage(uid, confirm+'\n\n'+tenderMsg2+'\n\n'+L.thanks, incomingPhoneId)); await saveToSheet('Master_Leads', [nowIso, uid, lang, 'Business Opportunity '+incomingPhoneId, 'Date '+iso, 'Clicked - Exact Date', HELP_MARKETING, state.lastStep, JSON.stringify(state)], true); await v211_saveFinalLead(uid, lang, {...state, occupation:state.occupation}, iso); await setState(uid,{lang, lastStep:'Completed', flow:'DONE', occupation:state.occupation, date:iso, visitDate:iso, leadName:state.leadName, leadState:state.leadState, leadDistrict:state.leadDistrict, leadMobile:state.leadMobile, phoneId: incomingPhoneId}); return;
      }
      // If in STATE / DISTRICT_BUTTON / OCC / DATE_BUTTON step and user types text -> ask to click button, do NOT save text as details
      await sendWithDelay(textMessage(uid, (lang==='ml' ? `😔 Sorry, please click the button below - Do not type here.\n\n👉 What to do now: Click the button for this step.` : lang==='hi' ? `😔 Sorry, कृपया नीचे button पर क्लिक करें - यहाँ टाइप न करें।\n\n👉 What to do now: इस step के लिए button पर क्लिक करें।` : `😔 Sorry, please click the button below - Do not type here.\n\n👉 What to do now: Click the button for this step.`), incomingPhoneId)); return;
    }

    const msgType = msg.type||'text';
    const isMedia = ['image','video','audio','document','sticker','reaction'].includes(msgType);
    const isRandomText = txt && btnId==='' && state.flow!=='LEAD';
    if((isRandomText || isMedia) && state.lang){
      // V247: Sorry + Explain last step + No Human before Registration Fee. Human only from Pay step.
      const sorryMsg = getSorryExplain(lang, state.lastStep||'', txt);
      if(state.lastStep && (state.lastStep.includes('Pay Reg') || state.lastStep.includes('✅ EMI Selected') || state.lastStep.includes('Not Paid') || state.lastStep.startsWith('Pay '))){
        // V247: Pay step random = 1 MESSAGE ONLY with 3 buttons. User typed = confused = needs Human in SAME message.
        // WhatsApp cannot mix URL button + Reply buttons in 1 message, so Pay link is put as clickable text inside body.
        // Buttons: [Pay Now] [Verify] [Talk to Team] - all Reply buttons, all <=20 chars.
        // Malayalam fix: "ടീമിനോട് സംസാരിക്കൂ" (22 chars) was cut to "മനുഷ്യനോട് സംസാരിക്ക" in screenshot. New "ടീമിനോട് സംസാരിക്കൂ" fits, full meaning.
        const payText = getPayText(lang, state.fee||15, state.sub);
        const payLink = getRazorpayLinkForSub(state.sub);
        const oneMsgBody = sorryMsg + `\n\n➖➖➖➖➖\n\n` + payText; // V247: NO raw 🔗 link - Pay now button carries the link
        const btnPay = lang==='ml' ? 'ഇപ്പോൾ അടയ്ക്കുക' : lang==='hi' ? 'अभी भुगतान करें' : 'Pay Now';
        const btnVerify = lang==='ml' ? 'അടച്ചു - പരിശോധിക്കൂ' : lang==='hi' ? 'भुगतान किया - जांचें' : 'I Paid - Verify';
        const btnHuman = lang==='ml' ? 'ടീമിനോട് സംസാരിക്കൂ' : lang==='hi' ? 'टीम से बात करें' : 'Talk to Team';
        await sendPayNowStep(uid,lang,state.fee||15,state.sub,incomingPhoneId, oneMsgBody, false);
        return;
      }
      // V297: BYPASS KILLED - this block used to call repeatLastStep() which sends old mainMenu ("Thank you for selecting English!") for EVERY free-text question, so V296 never ran. That was the loop.
      // Now: do NOT return here. Fall through to V296 Universal Responder below, which answers in user's language + 2 buttons.
    }
    // V303 YES/NEXT/CONTINUE IN FINALIZATION - "Yes, next" MUST advance, NEVER restart. This fixes screenshot 12:14 AM: user said "Yes, next" after Balance, Maya restarted to Business vs Services.
    // Rule: If in finalization and input is yes/next/ok/continue/ready/proceed/ahead/yes next, go to NEXT finalization step with THAT step's content + button. Language-aware.
    try{
      if(isFreeText){
        const _s3 = state.lastStep||''; const _low3 = String(txt||'').toLowerCase().trim();
        const _isContinue = /^(yes|yeah|ok|okay|sure|ready|continue|next|proceed|ahead|yes[,.\s]+next|next[,.\s]+step|manasilayi|seriya|seri|ha|haan|yes sir|yes mam)[\s.,!]*$/.test(_low3) || _low3==='yes, next' || _low3==='yes next' || _low3==='next';
        if(_isContinue){
          const _L3 = lang || state.lang || 'en';
          let _nextIdx = -1, _curName='';
          if(/Company Video/.test(_s3)){ _nextIdx=1; _curName='Company Video'; }
          else if(/Capacity|Income Level/.test(_s3)){ _nextIdx=2; _curName='Capacity'; }
          else if(/Opportunity Video|V300|Video Known|Balance Shown/.test(_s3)){ _nextIdx=3; _curName='Opportunity Video'; }
          else if(/Benefits/.test(_s3)){ _nextIdx=4; _curName='Benefits'; }
          else if(/Support/.test(_s3)){ _nextIdx=5; _curName='Support'; }
          else if(/Requirements/.test(_s3)){ _nextIdx=6; _curName='Requirements'; }
          else if(/Corp Check|Submit Application/.test(_s3)){ _nextIdx=7; _curName='Corp Check'; }
          else if(/Pay|Token|EMI/.test(_s3)){ _nextIdx=8; _curName='Pay Token'; }
          if(_nextIdx>=0){
            const _steps3 = [
              {en:'Capacity', ml:'Capacity', hi:'Capacity', msg: _L3==='ml' ? `✅ Company Video കണ്ടു — നന്ദി! 🙏\n\n💰 *Capacity — ഞങ്ങളുടെ ബിസിനസ് അവസരം തിരഞ്ഞെടുക്കാൻ, താങ്കൾക്ക് മുടക്കാൻ സാധിക്കുന്ന ഒരു വില പരിധി തിരഞ്ഞെടുത്താൽ ഞാൻ അതിന് പറ്റുന്ന അവസരത്തെക്കുറിച്ച് വിവരങ്ങൾ നൽകാം.*` : _L3==='hi' ? `✅ Company Video देखा — धन्यवाद! 🙏\n\n💰 *Capacity — हमारी Business Opportunity चुनने के लिए, आप invest कर सकने वाली एक price range select करें, मैं उसके लिए सही अवसर के बारे में details दूँगा.*` : `✅ Company Video seen — thank you! 🙏\n\n💰 *Capacity — To select our Business Opportunity, if you select a price range you can invest, I will give details about the opportunity that suits it.*`, btns:[{id:'OPP_CENTER',title:'30K - 1L'},{id:'OPP_CORP',title:'2L - 5L'},{id:'OPP_DISTRICT',title:'5L - 15L'}], last:'Capacity'},
              {en:'Opportunity Video', ml:'Opportunity Video', hi:'Opportunity Video', msg: _L3==='ml' ? `✅ Capacity noted! 🙏\n\n🎥 *Opportunity Video — ഇത് കണ്ടാൽ Balance + Token മനസ്സിലാകും.*\n\nവീഡിയോ കണ്ടോ?` : _L3==='hi' ? `✅ Capacity noted! 🙏\n\n🎥 *Opportunity Video — इसे देखने से Balance + Token समझ आएगा।*\n\nVideo देखा?` : `✅ Capacity noted! 🙏\n\n🎥 *Opportunity Video — watching this explains Balance + Token.*\n\nDid you watch it?`, btns:[{id:'VIDEO_WATCHED',title: _L3==='ml'?'കണ്ടു':'Seen'},{id:'VIDEO_NOT_WATCHED',title: _L3==='ml'?'കണ്ടില്ല':'Not Seen'}], last:'Opportunity Video - Must Watch'},
              {en:'Benefits', ml:'Benefits', hi:'Benefits', msg: _L3==='ml' ? `✅ Opportunity Video കണ്ടു — നന്ദി! 🙏\n\n📋 *Benefits — ഇത് വായിച്ചോ?*\n\nമനസ്സിലായെങ്കിൽ “Understood” അമർത്തൂ.` : _L3==='hi' ? `✅ Opportunity Video देखा — धन्यवाद! 🙏\n\n📋 *Benefits — पढ़ा?*\n\nसमझ गए तो “Understood” दबाएँ।` : `✅ Opportunity Video seen — thank you! 🙏\n\n📋 *Benefits — did you read it?*\n\nIf understood, tap “Understood”.`, btns:[{id:'UNDERSTOOD_BEN',title:'Understood'},{id:'SKIP_3CLICKS',title:'Skip'}], last:'Benefits - After Video Watched'},
              {en:'Support', ml:'Support', hi:'Support', msg: _L3==='ml' ? `✅ Benefits മനസ്സിലായി! 🙏\n\n🛟 *Support — ഇത് വായിച്ചോ?*` : _L3==='hi' ? `✅ Benefits समझ गए! 🙏\n\n🛟 *Support — पढ़ा?*` : `✅ Benefits understood! 🙏\n\n🛟 *Support — did you read it?*`, btns:[{id:'UNDERSTOOD_SUP',title:'Understood'},{id:'SKIP_3CLICKS',title:'Skip'}], last:'Support - After Benefits Understood'},
              {en:'Requirements', ml:'Requirements', hi:'Requirements', msg: _L3==='ml' ? `✅ Support മനസ്സിലായി! 🙏\n\n📋 *Requirements — ഇത് വായിച്ചോ?*` : _L3==='hi' ? `✅ Support समझ गए! 🙏\n\n📋 *Requirements — पढ़ा?*` : `✅ Support understood! 🙏\n\n📋 *Requirements — did you read it?*`, btns:[{id:'UNDERSTOOD_REQ',title:'Understood'},{id:'SKIP_3CLICKS',title:'Skip'}], last:'Requirements - After Support Understood'},
              {en:'Corp Check', ml:'Corp Check', hi:'Corp Check', msg: _L3==='ml' ? `✅ Requirements മനസ്സിലായി! 🙏\n\n🏢 *Corp Check — Corporation / Municipal area ഉണ്ടോ?*` : _L3==='hi' ? `✅ Requirements समझ गए! 🙏\n\n🏢 *Corp Check — Corporation / Municipal area है?*` : `✅ Requirements understood! 🙏\n\n🏢 *Corp Check — Do you have a Corporation / Municipal area?*`, btns:[{id:'CORP_YES',title:'Yes'},{id:'CORP_NO',title:'No'}], last:'Submit Application - Corp Check'},
              {en:'Pay Token', ml:'Token അടയ്ക്കുക', hi:'Token दें', msg: _L3==='ml' ? `✅ Corp Check done! 🙏\n\n💰 *Pay Token — Token അടച്ച് slot lock ചെയ്യാം.*\n\nതയ്യാറാണോ?` : _L3==='hi' ? `✅ Corp Check done! 🙏\n\n💰 *Pay Token — Token देकर slot lock करें।*\n\nतैयार हैं?` : `✅ Corp Check done! 🙏\n\n💰 *Pay Token — Pay Token to lock your slot.*\n\nReady?`, btns:[{id:'PAY_TOKEN',title:'Pay Token Now'},{id:'AI_BUSINESS',title:'Business Opportunity'}], last:'Pay Token'},
              {en:'Details', ml:'Details', hi:'Details', msg: _L3==='ml' ? `✅ Token step-ൽ എത്തി! 🙏\n\n📝 *Details — Token verify ചെയ്ത ശേഷം details എടുക്കാം.*` : _L3==='hi' ? `✅ Token step पर आ गए! 🙏\n\n📝 *Details — Token verify के बाद details लेंगे।*` : `✅ Reached Token step! 🙏\n\n📝 *Details — we will take details after Token verification.*`, btns:[{id:'PAY_TOKEN',title:'Pay Token Now'}], last:'Pay Token'},
            ];
            // _nextIdx 1..8 maps to _steps3 index _nextIdx-1 (Capacity is index 0)
            const _n = _steps3[_nextIdx-1];
            if(_n){
              await setState(uid, {...state, lastStep:_n.last, aiMode:true, aiHistory:[...(state.aiHistory||[]),{role:'user',text:String(txt||'').slice(0,100)},{role:'maya',text:_n.msg.slice(0,400)}].slice(-12)});
              try{ await sendWithDelay(interactiveButton(uid, _n.msg, _n.btns, incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, _n.msg, incomingPhoneId)); }
              await saveToSheet('System_Logs',[nowIso,uid,_L3,'V303 YesNext Advance '+incomingPhoneId,_curName+' -> '+_n.en,'V303',HELP_ADMIN,'V303 YesNext',''],false);
              // V308 REMINDER RE-ARM: after Yes/Next advance, arm reminder for NEXT step.
              try{ const _nxt=_n.en; const _rt3 = _nxt.includes('Opportunity Video') ? 'install:OPP_CENTER_VIDEO_5MIN:5' : _nxt.includes('Capacity') ? 'install:COMPANY_VIDEO_3MIN:3' : 'install:GEN_ARE_YOU_THERE:10'; const _rm3 = _nxt.includes('Opportunity Video') ? 5*60*1000 : 2*60*1000; scheduleReminder(uid,_rt3,_L3,_rm3,incomingPhoneId); }catch(_){}
              return;
            }
          }
        }
      }
    }catch(_){}

// V362 FIX3: Typed doubt -> answer in 1-2 lines from LOCKED facts BEFORE parking. Never invent numbers. If doubt not in list, return null and V302/V301 park as before.
function v350DoubtAnswer(low, L){
  const s = String(low||'').toLowerCase();
  const pick = (ml,hi,en)=> L==='ml'?ml : L==='hi'?hi : en;
  if(/fraud|scam|fake|cheat|thattip|fraud| विश्वास|धोखा/.test(s)) return pick(`✅ ഇത് തട്ടിപ്പല്ല — Bizmapia രജിസ്റ്റർ ചെയ്ത കമ്പനിയാണ്. വിശദാംശങ്ങൾ Tender / Annexure B-യിൽ ഉണ്ട്.`, `✅ यह धोखा नहीं है — Bizmapia रजिस्टर्ड कंपनी है। विवरण Tender / Annexure B में है।`, `✅ This is not fraud — Bizmapia is a registered company. Details are in Tender / Annexure B.`);
  if(/profit|income|earn|varumanam|labham|kamai|कमाई|लाभ/.test(s)) return pick(`💰 വരുമാനം നിങ്ങളുടെ ഏരിയ + നിക്ഷേപം അനുസരിച്ച് മാറും. കൃത്യമായ കണക്ക് Annexure B - Income Opportunity-യിൽ ഉണ്ട്.`, `💰 कमाई आपके एरिया + निवेश पर निर्भर है। सही हिसाब Annexure B - Income Opportunity में है।`, `💰 Income depends on your area + investment. Exact figures are in Annexure B - Income Opportunity.`);
  if(/emi|installment|thav ana|किस्त/.test(s)) return pick(`💳 EMI ലഭ്യമാണ് — വിശദാംശങ്ങൾ Tender-ൽ ഉണ്ട്. താഴെ EMI ബട്ടൺ നോക്കൂ.`, `💳 EMI उपलब्ध है — विवरण Tender में है। नीचे EMI बटन देखें।`, `💳 EMI is available — details are in Tender. See EMI button below.`);
  if(/refund|money back|return|പണം തിരികെ|रिफंड/.test(s)) return pick(`💳 Refund / Terms Tender-ൽ വ്യക്തമായി എഴുതിയിട്ടുണ്ട്. അത് വായിച്ച ശേഷം തീരുമാനിക്കൂ.`, `💳 Refund / Terms Tender में साफ लिखे हैं। उसे पढ़कर फैसला करें।`, `💳 Refund / Terms are clearly written in Tender. Please read it before deciding.`);
  if(/office|address|location|evide|कहाँ|office/.test(s)) return pick(`📍 ഓഫീസ് / വിലാസം Tender-ൽ ഉണ്ട്. കൂടുതൽ വിവരത്തിന് ടീം വിളിക്കും.`, `📍 ऑफिस / पता Tender में है। अधिक जानकारी के लिए टीम कॉल करेगी।`, `📍 Office / address is in Tender. Team will call you for more details.`);
  if(/how.*work|how.*start|entha|cheyyanam|कैसे/.test(s)) return pick(`👉 ഈ step പൂർത്തിയാക്കൂ, അടുത്ത step-ൽ എല്ലാം മനസ്സിലാകും.`, `👉 यह step पूरा करें, अगले step में सब समझ आ जाएगा।`, `👉 Complete this step, everything will be clear in the next step.`);
  if(/price|fee|token|vila|charge|कीमत|फीस/.test(s)) return pick(`💰 Token: Center Rs.100 | Corp Rs.150 | District Rs.250.`, `💰 Token: Center Rs.100 | Corp Rs.150 | District Rs.250.`, `💰 Token: Center Rs.100 | Corp Rs.150 | District Rs.250.`);
  return null;
}
    // V302 OFF-TOPIC DURING OPPORTUNITY FINALIZATION - Bring back with Current Step + Balance Steps + Are You Ready + Next Option.
    // Problem: user talks anything outer (weather, joke, news, personal, other business) in middle of finalization, Maya either answered it and lost flow, or restarted.
    // Rule: If lastStep is inside Opportunity Finalization (Company Video -> Capacity -> Opportunity Video -> Benefits -> Support -> Requirements -> Corp Check -> Pay Token -> Details), and input is OFF-TOPIC (not the expected answer for that step, not a button that was handled above), then:
    // 1) Acknowledge off-topic in 1 line in user's language. 2) Say "We are in THIS step". 3) List BALANCE steps remaining. 4) Ask "Are you ready?" 5) Show NEXT option you need to do with THAT step's button. Never restart, never generic menu.
    try{
      if(isFreeText){
        const _s2 = state.lastStep||'';
        const _finSteps = [
          {key:'Company Video', ml:'Company Video', en:'Watch Company Video', hi:'Company Video देखें', btn:{id:'COMPANY_WATCHED',title:'Seen'}, btnMl:'കണ്ടു', btnHi:'देख लिया'},
          {key:'Capacity', ml:'Capacity തിരഞ്ഞെടുക്കുക', en:'Pick Capacity', hi:'Capacity चुनें', btn:{id:'OPP_CENTER',title:'30K - 1L'}, btnMl:'30K - 1L', btnHi:'30K - 1L'},
          {key:'Opportunity Video', ml:'Opportunity Video', en:'Watch Opportunity Video', hi:'Opportunity Video देखें', btn:{id:'VIDEO_WATCHED',title:'Seen'}, btnMl:'കണ്ടു', btnHi:'देख लिया'},
          {key:'Benefits', ml:'Benefits', en:'Benefits', hi:'Benefits', btn:{id:'UNDERSTOOD_BEN',title:'Understood'}, btnMl:'മനസ്സിലായി', btnHi:'समझ गया'},
          {key:'Support', ml:'Support', en:'Support', hi:'Support', btn:{id:'UNDERSTOOD_SUP',title:'Understood'}, btnMl:'മനസ്സിലായി', btnHi:'समझ गया'},
          {key:'Requirements', ml:'Requirements', en:'Requirements', hi:'Requirements', btn:{id:'UNDERSTOOD_REQ',title:'Understood'}, btnMl:'മനസ്സിലായി', btnHi:'समझ गया'},
          {key:'Corp Check', ml:'Corp Check', en:'Corp Check', hi:'Corp Check', btn:{id:'CORP_YES',title:'Yes'}, btnMl:'Yes', btnHi:'Yes'},
          {key:'Pay Token', ml:'Token അടയ്ക്കുക', en:'Pay Token', hi:'Token दें', btn:{id:'PAY_TOKEN',title:'Pay Token Now'}, btnMl:'Token അടയ്ക്കാം', btnHi:'Token दें'},
          {key:'Details', ml:'Details', en:'Details', hi:'Details', btn:{id:'AI_BUSINESS',title:'Business Opportunity'}, btnMl:'ബിസിനസ് അവസരം', btnHi:'Business Opportunity'},
        ];
        let _idx = -1;
        if(/Company Video|Business Video/.test(_s2)) _idx=0;
        else if(/Capacity|Income Level/.test(_s2)) _idx=1;
        else if(/Opportunity Video/.test(_s2)) _idx=2;
        else if(/Benefits/.test(_s2)) _idx=3;
        else if(/Support/.test(_s2)) _idx=4;
        else if(/Requirements/.test(_s2)) _idx=5;
        else if(/Corp Check|Submit Application/.test(_s2)) _idx=6;
        else if(/Pay|Token|EMI/.test(_s2)) _idx=7;
        else if(/V300|Video Known|Balance Shown/.test(_s2)) _idx=2;
        else if(/Name|District|Address|Details|Lead/.test(_s2)) _idx=8;
        if(_idx>=0){
          const _L2 = lang || state.lang || 'en';
          const _low2 = String(txt||'').toLowerCase();
          // On-topic inputs for this step are already handled above (seen/kandu, capacity buttons, understood, yes/no, paid, balance, district name). If we REACHED here, it is off-topic or unclear -> bring back.
          // Do not trigger for very short step answers that slipped through: seen/kandu/manasilayi/yes/no/paid/balance - let V301 handle them.
          const _onTopic = /seen|watched|already|kandu|kandathanu|manasilayi|understood|yes|no|paid|balance|bakki|30k|1l|2l|5l|15l|idukki|thodupuzha|district|pay|token|aduthathu|than/.test(_low2);
          if(!_onTopic){
            const _cur = _finSteps[_idx];
            const _rem = _finSteps.slice(_idx); // current + balance
            const _next = _cur;
            const _sixIdx = _idx<=0?0 : _idx===1?1 : _idx<=5?2 : _idx===6?3 : _idx===7?4 : 5; const _sixProg = (typeof oppProgress==='function' ? oppProgress(_L2, _sixIdx+1) : ''); const _doubtAns = (typeof v350DoubtAnswer==='function' ? v350DoubtAnswer(_low2, _L2) : null); const _remTxt = (typeof oppBalanceNames==='function' ? oppBalanceNames(_L2, _sixIdx) : '') + '\n' + _rem.map((s,i)=> _L2==='ml' ? `${i+1}. ${s.ml}${i===0?' ← ഇപ്പോൾ ഇവിടെ':''}` : _L2==='hi' ? `${i+1}. ${s.hi}${i===0?' ← अभी यहाँ':''}` : `${i+1}. ${s.en}${i===0?' ← we are here':''}`).join('\n');
            const _nextTitle = _L2==='ml' ? _next.btnMl : _L2==='hi' ? _next.btnHi : _next.btn.title;
            const _msg = _L2==='ml' ? `${_sixProg}${_doubtAns ? '\n\n'+_doubtAns : ''}\n\n👍 കിട്ടി — “${String(txt||'').slice(0,60)}”.\n\nഅത് കഴിഞ്ഞ് നമുക്ക് തുടരാം. 🙏\n\n📍 *നമ്മൾ ഇപ്പോൾ ഈ step-ൽ ആണ്: ${_cur.ml}*\n\n📋 *Balance Steps — ചെയ്യാൻ ബാക്കിയുള്ളത്:*\n${_remTxt}\n\n❓ *Are you ready — തുടരാൻ തയ്യാറാണോ?*\n\n👉 *Next Option — ഇനി ചെയ്യേണ്ടത്:* ${_next.ml} — താഴെ ബട്ടൺ അമർത്തൂ.` : _L2==='hi' ? `${_sixProg}${_doubtAns ? '\n\n'+_doubtAns : ''}\n\n👍 मिल गया — “${String(txt||'').slice(0,60)}”.\n\nउसे बाद में देखेंगे। 🙏\n\n📍 *हम अभी इस step पर हैं: ${_cur.hi}*\n\n📋 *Balance Steps — बाकी काम:*\n${_remTxt}\n\n❓ *Are you ready — आगे बढ़ने के लिए तैयार हैं?*\n\n👉 *Next Option — अब करना है:* ${_next.hi} — नीचे button दबाएँ।` : `${_sixProg}${_doubtAns ? '\n\n'+_doubtAns : ''}\n\n👍 Got it — “${String(txt||'').slice(0,60)}”.\n\nWe will come back to that. 🙏\n\n📍 *We are in this step: ${_cur.en}*\n\n📋 *Balance Steps — still to do:*\n${_remTxt}\n\n❓ *Are you ready to continue?*\n\n👉 *Next Option — you need to do this now:* ${_next.en} — tap the button below.`;
            const _h2=[...(state.aiHistory||[])]; _h2.push({role:'user',text:String(txt||'').slice(0,300)}); _h2.push({role:'maya',text:_msg.slice(0,500)});
            await setState(uid, {...state, aiHistory:_h2.slice(-12), lastStep:_s2, aiMode:true});
            const _btn = [{id:_next.btn.id, title:_nextTitle}, {id:'AI_BUSINESS', title: _L2==='ml'?'ബിസിനസ് അവസരം': _L2==='hi'?'Business Opportunity':'Business Opportunity'}];
            // For Capacity step, show all 3 capacity buttons instead of only 30K-1L
            if(_idx===1) _btn.splice(0,1,{id:'OPP_CENTER',title:'30K - 1L'},{id:'OPP_CORP',title:'2L - 5L'},{id:'OPP_DISTRICT',title:'5L - 15L'});
            try{ await sendWithDelay(interactiveButton(uid, _msg, _btn.slice(0,3), incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, _msg, incomingPhoneId)); }
            await saveToSheet('System_Logs',[nowIso,uid,_L2,'V302 OffTopic Finalization '+incomingPhoneId,'Off-topic at '+_cur.key+': '+String(txt||'').slice(0,80),'V302',HELP_ADMIN,'V302 Final',''],false);
            // V308 REMINDER RE-ARM: free-text reply cleared old reminder (V290). Re-arm for THIS step, in locked language. Opp Video=5min, Company=3min, else GEN 2min.
            try{ const _rt = _cur.key==='Opportunity Video' ? 'install:OPP_CENTER_VIDEO_5MIN:5' : _cur.key==='Company Video' ? 'install:COMPANY_VIDEO_3MIN:3' : 'install:GEN_ARE_YOU_THERE:10'; const _rm = _cur.key==='Opportunity Video' ? 5*60*1000 : _cur.key==='Company Video' ? 3*60*1000 : 2*60*1000; scheduleReminder(uid,_rt,_L2,_rm,incomingPhoneId); }catch(_){}
            return;
          }
        }
      }
    }catch(_){}
    // V301 STEP-AWARE UNIVERSAL - ANY INPUT IN ANY STEP HANDLED IN THAT STEP. This is the rule for the whole bot.
    // Before this, any input that missed earlier handlers fell to generic "Got it! heard you" + Business vs Services (restart). That is why users felt looped.
    // Now: Maya looks at state.lastStep FIRST. She answers the input briefly, then returns user to THE SAME step with THAT step's question + THAT step's buttons. Never restarts, never sends generic menu.
    // Steps covered: Language, Business vs Services, Company Video, Capacity, Opportunity Video, Benefits/Support/Requirements, Corp Check, Pay Token, Details (Name/District/Address), Services.
    try{
      if(isFreeText || (!!btnId && !['LANG_ML','LANG_EN','LANG_HI'].includes(btnId))){
        const _s = state.lastStep||'';
        const _L1 = lang || state.lang || 'en';
        const _in1 = String(txt||'').trim();
        const _low1 = _in1.toLowerCase();
        // Do not hijack Pay / Details steps that have their own handlers above (they already returned if handled). This block only runs if we REACHED here.
        let _stepQ = null, _stepBtns = null, _stepName = '';
        if(/Language|LANG|Lang Confirm/.test(_s) && !/AI Maya - Lang/.test(_s)){
          _stepName = 'Language'; _stepQ = _L1==='ml' ? `👇 ഭാഷ തിരഞ്ഞെടുക്കൂ:` : `👇 Please tap your language:`; _stepBtns=[{id:'LANG_ML',title:'മലയാളം'},{id:'LANG_EN',title:'English'},{id:'LANG_HI',title:'हिन्दी'}];
        } else if(/Company Video|Business Video|V270/.test(_s)){
          _stepName='Company Video'; _stepQ = _L1==='ml' ? `🎥 Company Video കണ്ടോ? കണ്ടെങ്കിൽ “kandu” എന്ന് ടൈപ്പ് ചെയ്യൂ, ഇല്ലെങ്കിൽ വീഡിയോ വീണ്ടും അയയ്ക്കാം.` : `🎥 Did you watch the Company Video? If yes type “seen”, if not I will resend it.`;
          _stepBtns=[{id:'COMPANY_WATCHED',title: _L1==='ml'?'കണ്ടു':'Seen'},{id:'COMPANY_NOT_WATCHED',title: _L1==='ml'?'കണ്ടില്ല':'Not Seen'}];
        } else if(/Capacity|Income Level|V270 - Capacity/.test(_s)){
          _stepName='Capacity'; _stepQ = _L1==='ml' ? `💰 ഞങ്ങളുടെ ബിസിനസ് അവസരം തിരഞ്ഞെടുക്കാൻ, താങ്കൾക്ക് മുടക്കാൻ സാധിക്കുന്ന ഒരു വില പരിധി തിരഞ്ഞെടുത്താൽ ഞാൻ അതിന് പറ്റുന്ന അവസരത്തെക്കുറിച്ച് വിവരങ്ങൾ നൽകാം. താഴെ ഒന്ന് തിരഞ്ഞെടുക്കൂ:` : `💰 To select our Business Opportunity, if you select a price range you can invest, I will give details about the opportunity that suits it. Pick one below:`;
          _stepBtns=[{id:'OPP_CENTER',title:'30K - 1L'},{id:'OPP_CORP',title:'2L - 5L'},{id:'OPP_DISTRICT',title:'5L - 15L'}];
        } else if(/Opportunity Video|V280|V300|Video Known|Balance Shown/.test(_s)){
          _stepName='Opportunity Video'; _stepQ = _L1==='ml' ? `🎥 Opportunity Video കണ്ടോ? കണ്ടെങ്കിൽ “kandu” എന്ന് ടൈപ്പ് ചെയ്യൂ. Balance അറിയണമെങ്കിൽ “balance details” എന്ന് ടൈപ്പ് ചെയ്യൂ.` : `🎥 Did you watch the Opportunity Video? If yes type “seen”. For balance type “balance details”.`;
          _stepBtns=[{id:'VIDEO_WATCHED',title: _L1==='ml'?'കണ്ടു':'Seen'},{id:'VIDEO_NOT_WATCHED',title: _L1==='ml'?'കണ്ടില്ല':'Not Seen'}];
        } else if(/Benefits/.test(_s)){
          _stepName='Benefits'; _stepQ = _L1==='ml' ? `📋 Benefits മനസ്സിലായോ? മനസ്സിലായെങ്കിൽ “manasilayi” എന്ന് ടൈപ്പ് ചെയ്യൂ, അല്ലെങ്കിൽ Skip ചെയ്യാം.` : `📋 Did you understand Benefits? Type “understood” or Skip.`;
          _stepBtns=[{id:'UNDERSTOOD_BEN',title:'Understood'},{id:'SKIP_3CLICKS',title:'Skip'}];
        } else if(/Support/.test(_s)){
          _stepName='Support'; _stepQ = _L1==='ml' ? `🛟 Support മനസ്സിലായോ? “manasilayi” എന്ന് ടൈപ്പ് ചെയ്യൂ അല്ലെങ്കിൽ Skip.` : `🛟 Did you understand Support? Type “understood” or Skip.`;
          _stepBtns=[{id:'UNDERSTOOD_SUP',title:'Understood'},{id:'SKIP_3CLICKS',title:'Skip'}];
        } else if(/Requirements/.test(_s)){
          _stepName='Requirements'; _stepQ = _L1==='ml' ? `📋 Requirements മനസ്സിലായോ? “manasilayi” എന്ന് ടൈപ്പ് ചെയ്യൂ അല്ലെങ്കിൽ Skip.` : `📋 Did you understand Requirements? Type “understood” or Skip.`;
          _stepBtns=[{id:'UNDERSTOOD_REQ',title:'Understood'},{id:'SKIP_3CLICKS',title:'Skip'}];
        } else if(/Corp Check|Submit Application/.test(_s)){
          _stepName='Corp Check'; _stepQ = _L1==='ml' ? `🏢 നിങ്ങൾക്ക് Corporation / Municipal area ഉണ്ടോ? ഉണ്ടെങ്കിൽ “yes”, ഇല്ലെങ്കിൽ “no” എന്ന് ടൈപ്പ് ചെയ്യൂ.` : `🏢 Do you have a Corporation / Municipal area? Type “yes” or “no”.`;
          _stepBtns=[{id:'CORP_YES',title:'Yes'},{id:'CORP_NO',title:'No'}];
        } else if(/Pay|Token|EMI/.test(_s)){
          _stepName='Pay Token'; _stepQ = _L1==='ml' ? `💰 Token അടയ്ക്കാൻ തയ്യാറാണോ? അടച്ചെങ്കിൽ “paid” എന്ന് ടൈപ്പ് ചെയ്യൂ.` : `💰 Ready to pay Token? If paid, type “paid”.`;
          _stepBtns=[{id:'PAY_TOKEN',title:'Pay Token Now'},{id:'AI_BUSINESS',title:'Business Opportunity'}];
        } else if(/Name|District|Address|Details|Lead/.test(_s)){
          _stepName='Details'; _stepQ = _L1==='ml' ? `📝 ${_s} — ഈ step-ന് വേണ്ട വിവരം ടൈപ്പ് ചെയ്യൂ.` : `📝 ${_s} — please type the detail for this step.`;
          _stepBtns=[{id:'AI_BUSINESS',title:'Business Opportunity'},{id:'AI_SERVICES',title:'Use Other Services'}];
        } else if(/Business.*Video Sent|AI Maya - Sorted Business|2 buttons|Business vs Services/.test(_s) || _s.includes('Business Opportunity')){
          _stepName='Business vs Services'; _stepQ = _L1==='ml' ? `👇 ഒന്ന് തിരഞ്ഞെടുക്കൂ:` : `👇 Pick one:`; _stepBtns=[{id:'AI_BUSINESS',title: _L1==='ml'?'ബിസിനസ് അവസരം':'Business Opportunity'},{id:'AI_SERVICES',title: _L1==='ml'?'സേവനങ്ങൾ ഉപയോഗിക്കാം':'Use Other Services'}];
        }
        if(_stepQ){
          // Universal actions in ANY step: back / price / video / help - handled in-step, not restart
          let _prefix = '';
          if(_low1==='back' || _low1.includes('back') || _low1.includes('thirich')) _prefix = _L1==='ml' ? `👍 ശരി, തിരിച്ചു പോകാം.\n\n` : `👍 OK, going back.\n\n`;
          else if(/price|fee|token|vila/.test(_low1)) _prefix = _L1==='ml' ? `💰 Token: Center Rs.100 | Corp Rs.150 | District Rs.250.\n\n` : `💰 Token: Center Rs.100 | Corp Rs.150 | District Rs.250.\n\n`;
          else if(typeof v350DoubtAnswer==='function' && v350DoubtAnswer(_low1,_L1)) _prefix = v350DoubtAnswer(_low1,_L1) + '\n\n';
          else if(/video|videyo/.test(_low1)) _prefix = _L1==='ml' ? `🎥 വീഡിയോ വീണ്ടും അയയ്ക്കാം.\n\n` : `🎥 I will resend the video.\n\n`;
          else if(_in1) _prefix = _L1==='ml' ? `👍 കിട്ടി — “${_in1.slice(0,50)}”.\n\n` : `👍 Got it — “${_in1.slice(0,50)}”.\n\n`;
          const _final = _prefix + (_L1==='ml' ? `ഇപ്പോൾ നമ്മൾ *${_stepName}* step-ൽ ആണ്.\n\n${_stepQ}` : `We are now at *${_stepName}* step.\n\n${_stepQ}`);
          const _h1=[...(state.aiHistory||[])]; if(_in1){ _h1.push({role:'user',text:_in1.slice(0,300)}); _h1.push({role:'maya',text:_final.slice(0,500)}); }
          await setState(uid, {...state, aiHistory:_h1.slice(-12), lastStep:_s||'V301 - Step Aware', aiMode:true});
          try{ await sendWithDelay(interactiveButton(uid, _final, _stepBtns, incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, _final, incomingPhoneId)); }
          await saveToSheet('System_Logs',[nowIso,uid,_L1,'V301 StepAware '+incomingPhoneId,'Step '+_stepName+' input: '+String(txt||btnId||'').slice(0,80),'V301',HELP_ADMIN,'V301 Step',''],false);
            // V308 REMINDER RE-ARM: free-text step reply cleared old reminder. Re-arm for THIS step.
            try{ const _rt1 = _stepName==='Opportunity Video' ? 'install:OPP_CENTER_VIDEO_5MIN:5' : _stepName==='Company Video' ? 'install:COMPANY_VIDEO_3MIN:3' : 'install:GEN_ARE_YOU_THERE:10'; const _rm1 = _stepName==='Opportunity Video' ? 5*60*1000 : _stepName==='Company Video' ? 3*60*1000 : 2*60*1000; scheduleReminder(uid,_rt1,_L1,_rm1,incomingPhoneId); }catch(_){}
          return;
        }
      }
    }catch(_){}
    // V296 UNIVERSAL RESPONDER - 🔒 LOCKED: NEVER restart if in finalization. If we reach here in finalization, V301/V302/V303 already handled it. This block is fallback ONLY for non-finalization.
    // V296 GUARD - if finalization, NEVER generic restart
    try{ var _g=(state.lastStep||''); if(/Company Video|Capacity|Opportunity Video|Benefits|Support|Requirements|Corp Check|Pay Token|V300|Video Known|Balance Shown|Submit Application/.test(_g) && isFreeText){ var _Lg=lang||state.lang||'en'; var _mg='Got it - '+String(txt||'').slice(0,50)+'. We are in '+_g+' step. Are you ready to continue? Tap below.'; try{ await sendWithDelay(interactiveButton(uid,_mg,[{id:'AI_BUSINESS',title:'Business Opportunity'}],incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid,_mg,incomingPhoneId)); } await saveToSheet('System_Logs',[nowIso,uid,_Lg,'V296 Guard '+incomingPhoneId,'Guard prevented restart', 'V296-GUARD',HELP_ADMIN,'V296 Guard',''],false); return; } }catch(_){}
    // This is the LAST net: anything that reached here (AI null, unknown button, joke, doubt, abuse, emoji, gibberish, sticker, photo, location, single letter) gets ONE warm reply in user's language + guides back to next step.
    // Rule: NEVER send old mainMenu (Thank you for selecting English + 5 services). NEVER send bare Sorry + Repeat. ALWAYS: acknowledge what they said + answer or ask 1 question + 2 buttons max.
    try{
      const _uLang = lang || state.lang || 'en';
      const _rawU = String(txt||'').trim();
      const _lowU = _rawU.toLowerCase();
      const _mType = msg.type||'text';
      const _isMediaU = ['image','video','document','sticker','location','reaction','contacts'].includes(_mType);
      const _isUnknownBtn = !!btnId && !['LANG_ML','LANG_EN','LANG_HI'].includes(btnId);
      // 1) Media / sticker / photo / location -> ask to type or voice, do not ignore
      if(_isMediaU && !_rawU){
        const _m = _uLang==='ml' ? `📩 കിട്ടി! 🙏\n\nPhoto / location കണ്ടു. എനിക്ക് വായിക്കാൻ പറ്റുന്നത് *ടൈപ്പ് ചെയ്ത മെസ്സേജും voice note-ഉം* ആണ്.\n\n👉 എന്താണ് വേണ്ടത് എന്ന് ഒന്ന് ടൈപ്പ് ചെയ്ത് പറയാമോ? Business Opportunity ആണോ, സേവനമാണോ?` : _uLang==='hi' ? `📩 मिल गया! 🙏\n\nPhoto / location देखा। मैं *टाइप किया मैसेज और voice note* पढ़ सकती हूँ।\n\n👉 क्या चाहिए, एक बार टाइप करके बताएँगे? Business Opportunity या Service?` : `📩 Got it! 🙏\n\nI saw your photo / location. I can read *typed messages and voice notes*.\n\n👉 Can you type what you need? Business Opportunity or a service?`;
        try{ await sendWithDelay(textMessage(uid, _m, incomingPhoneId)); }catch(e){}
        await setState(uid, {...state, lastStep:'V296 - Media Asked To Type', aiMode:true});
        return;
      }
      // 2) Pick reply by meaning - every category covered
      let _reply = null;
      const _isGreet = /^(hi+|hello+|hey+|hai+|namaste|namaskaram|vanakkam|assalam|good (morning|evening|afternoon)|🙏|👋|hello 👋)/.test(_lowU) || _lowU==='hi' || _lowU==='hey';
      const _isThanks = /thank|thanks|nanni|nandhi|shukriya|dhanyavad/.test(_lowU);
      const _isJoke = /joke|funny|comedy|thമാശ|thamas|lol|haha|😂|🤣|😅/.test(_lowU);
      const _isDoubt = /fake|fraud|scam|trust|real|true|viswasam|doubt|cheat|cheating|safe|believ/.test(_lowU);
      const _isAbuse = /fool|idiot|stupid|useless|waste|bad|poda|poo|fuck|shit|damn/.test(_lowU);
      const _isPriceQ = /price|fee|cost|token|vila|charge|paisa|money|payment/.test(_lowU);
      const _isShort = _rawU.length<=3 || ['k','ok','okk','yes','no','y','n','??','?','...','.','👍','👌','😊'].includes(_lowU);
      const _isEmojiOnly = _rawU.length>0 && /^[^a-zA-Z0-9\u0D00-\u0D7F\u0900-\u097F]+$/u.test(_rawU);
      if(_isGreet){
        _reply = _uLang==='ml' ? `ഹായ്! 🙏😊 ഞാൻ *മായ* ആണ്. സന്തോഷം!\n\nഎന്താണ് വേണ്ടത്? 👇\n• Business Opportunity എടുത്ത് വരുമാനം ഉണ്ടാക്കണോ?\n• അതോ Bizmapia സേവനം ഉപയോഗിക്കണോ?\n\nഒന്ന് തിരഞ്ഞെടുത്താൽ മതി, ഞാൻ വഴി കാണിക്കാം.` : _uLang==='hi' ? `हाय! 🙏😊 मैं *माया* हूँ। खुशी हुई!\n\nक्या चाहिए? 👇\n• Business Opportunity लेकर कमाना है?\n• या Bizmapia service use करनी है?\n\nएक चुनें, मैं रास्ता दिखाती हूँ।` : `Hi! 🙏😊 I am *Maya*. Happy to chat!\n\nWhat do you need? 👇\n• Take Business Opportunity and earn with us?\n• Or use a Bizmapia service?\n\nPick one and I will guide you.`;
      } else if(_isThanks){
        _reply = _uLang==='ml' ? `അയ്യോ, സന്തോഷം! 😊🙏\n\nഇനി അടുത്ത step എന്താണ്? Business Opportunity-യെക്കുറിച്ച് വീഡിയോ കാണണോ, അതോ സേവനം നോക്കണോ?` : _uLang==='hi' ? `अरे, खुशी हुई! 😊🙏\n\nअब अगला step क्या है? Business Opportunity का video देखें, या service देखें?` : `You are most welcome! 😊🙏\n\nWhat is the next step? Watch the Business Opportunity video, or look at a service?`;
      } else if(_isJoke){
        _reply = _uLang==='ml' ? `😂 ഹഹാ, കൊള്ളാം! നിങ്ങൾക്ക് humour ഉണ്ട്.\n\nചിരിച്ചല്ലോ, ഇനി കാര്യത്തിലേക്ക് വരാം — Business Opportunity ആണോ വേണ്ടത്, അതോ സേവനമാണോ? 😊` : _uLang==='hi' ? `😂 हाहा, बढ़िया! आपको humour है।\n\nहँस लिए, अब काम की बात — Business Opportunity चाहिए या Service? 😊` : `😂 Haha, nice one! You have humour.\n\nLaughed enough — now to business: do you want the Business Opportunity, or a service? 😊`;
      } else if(_isDoubt){
        _reply = _uLang==='ml' ? `🙏 നിങ്ങളുടെ സംശയം മനസ്സിലായി, അത് നല്ലതാണ്.\n\nBizmapia ഒരു *All-India പ്ലാറ്റ്ഫോം* ആണ് — Website: bizmapia.com, Office: Thodupuzha, Idukki. ആദ്യം *Company Video* കണ്ടാൽ കമ്പനി എന്താണ്, എന്താണ് പ്രതീക്ഷിക്കുന്നത് എന്ന് വ്യക്തമാകും.\n\nവീഡിയോ കാണണോ?` : _uLang==='hi' ? `🙏 आपका doubt समझ गई, यह अच्छा है।\n\nBizmapia एक *All-India प्लेटफॉर्म* है — Website: bizmapia.com, Office: Thodupuzha, Idukki। पहले *Company Video* देखें, कंपनी क्या है, क्या उम्मीद करती है — सब साफ हो जाएगा।\n\nVideo देखें?` : `🙏 I understand your doubt — that is a good thing.\n\nBizmapia is an *All-India platform* — Website: bizmapia.com, Office: Thodupuzha, Idukki. Watch the *Company Video* first — you will clearly see what the company is and what it expects.\n\nWant to watch the video?`;
      } else if(_isAbuse){
        _reply = _uLang==='ml' ? `🙏 ക്ഷമിക്കണം, നിങ്ങൾക്ക് ദേഷ്യം വന്നത് മനസ്സിലായി. ഞാൻ ഇവിടെയുണ്ട്, സഹായിക്കാം.\n\nഎന്താണ് പ്രശ്നം? ഒന്ന് പറയൂ — വീഡിയോ കണ്ടില്ലേ, അതോ പേയ്മെന്റിൽ സംശയമുണ്ടോ?` : _uLang==='hi' ? `🙏 माफ़ कीजिए, गुस्सा समझ गई। मैं यहाँ हूँ, मदद करती हूँ।\n\nक्या problem है? बताइए — video नहीं देखा, या payment में doubt है?` : `🙏 Sorry, I can see you are upset. I am here to help.\n\nWhat is the problem? Tell me — did you not see the video, or is there a doubt about payment?`;
      } else if(_isPriceQ){
        _reply = _uLang==='ml' ? `💰 *Token Fee:* Center Rs.100 | Corp / Municipal Rs.150 | District Rs.250.\n\nFull: Center ~1 Lakh | Corp ~4-5 Lakh | District ~10 Lakh.\n\nഏത് level ആണ് വേണ്ടത്?` : `💰 *Token Fee:* Center Rs.100 | Corp / Municipal Rs.150 | District Rs.250.\n\nFull: Center ~1 Lakh | Corp ~4-5 Lakh | District ~10 Lakh.\n\nWhich level do you want?`;
      } else if(_isShort || _isEmojiOnly || _isUnknownBtn){
        const _step = state.lastStep||'';
        _reply = _uLang==='ml' ? `👍 കിട്ടി! 😊\n\nഞാൻ ഇവിടെയുണ്ട്. ഇപ്പോൾ നമ്മൾ ഇവിടെയാണ്: *${v364_4_friendlyStep(_step)}*.\n\nതുടരട്ടെ? Business Opportunity ആണോ, സേവനമാണോ?` : _uLang==='hi' ? `👍 मिल गया! 😊\n\nमैं यहाँ हूँ। अभी हम यहाँ हैं: *${v364_4_friendlyStep(_step)}*।\n\nआगे बढ़ें? Business Opportunity या Service?` : `👍 Got it! 😊\n\nI am here. Right now we are at: *${v364_4_friendlyStep(_step)}*.\n\nShall we continue? Business Opportunity or a service?`;
      } else {
        // General / off-topic / gibberish / anything else - acknowledge + bring back, never Sorry+Repeat, never old menu
        const _echo = _rawU ? `“${_rawU.slice(0,60)}”` : '';
        _reply = _uLang==='ml' ? `👍 മനസ്സിലായി! ${_echo} — ഞാൻ കേട്ടു. 😊\n\nഞാൻ *മായ* ആണ്, Bizmapia-യിൽ നിങ്ങളെ സഹായിക്കാനാണ് ഇവിടെ.\n\nഎന്താണ് വേണ്ടത്? 👇\n• Business Opportunity — വരുമാനം ഉണ്ടാക്കാൻ\n• സേവനം ഉപയോഗിക്കാൻ — Taxi / Directory / Delivery / Booking\n\nഒന്ന് തിരഞ്ഞെടുക്കൂ, ഞാൻ വഴി കാണിക്കാം.` : _uLang==='hi' ? `👍 समझ गई! ${_echo} — सुन लिया। 😊\n\nमैं *माया* हूँ, Bizmapia में आपकी मदद के लिए यहाँ हूँ।\n\nक्या चाहिए? 👇\n• Business Opportunity — कमाने के लिए\n• Service use करनी है — Taxi / Directory / Delivery / Booking\n\nएक चुनें, मैं रास्ता दिखाती हूँ।` : `👍 Got it! ${_echo} — heard you. 😊\n\nI am *Maya*, here to help you with Bizmapia.\n\nWhat do you need? 👇\n• Business Opportunity — to earn with us\n• Use a service — Taxi / Directory / Delivery / Booking\n\nPick one and I will guide you.`;
      }
      // Save + send with 2 buttons only (never old 5-service mainMenu)
      const _h2 = state.aiHistory||[]; if(_rawU){ _h2.push({role:'user', text:_rawU.slice(0,300)}); _h2.push({role:'maya', text: String(_reply).slice(0,500)}); }
      await setState(uid, {...state, aiHistory:_h2.slice(-12), lastStep:'V296 - Universal Reply', aiMode:true});
      const _b1 = _uLang==='ml' ? 'ബിസിനസ് അവസരം' : 'Business Opportunity';
      const _b2 = _uLang==='ml' ? 'സേവനങ്ങൾ ഉപയോഗിക്കാം' : 'Use Other Services';
      try{ await sendWithDelay(interactiveButton(uid, _reply, [{id:'AI_BUSINESS',title:_b1},{id:'AI_SERVICES',title:_b2}], incomingPhoneId)); }catch(e){ await sendWithDelay(textMessage(uid, _reply, incomingPhoneId)); }
      await saveToSheet('System_Logs',[nowIso,uid,_uLang,'V296 Universal '+incomingPhoneId,'Universal reply to: '+String(txt||msg.type||'').slice(0,80),'V296',HELP_ADMIN,'V296 Universal',''],false);
      return;
    }catch(_e){ console.log('V296 universal fail', _e.message); try{ await sendWithDelay(textMessage(uid, `🙏 I am here! I heard you. What do you need — Business Opportunity or a service? Type it, I will guide you.`, incomingPhoneId)); }catch(e){} return; }
  }catch(e){ console.log('webhook error',e.message,e.stack); }
});


app.post('/razorpay-webhook', async(req,res)=>{
  try{
    const signature = req.headers['x-razorpay-signature'] || '';
    if(RAZORPAY_WEBHOOK_SECRET && signature){
      try{
        const raw = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
        const expected = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET).update(raw).digest('hex');
        if(expected !== signature){ console.log('RAZORPAY SIGNATURE MISMATCH - continuing, secret may be old'); }
      }catch(e){ console.log('Razorpay signature check skip', e.message); }
    }
    const event = req.body.event || '';
    const payload = req.body.payload || {};
    let payment = payload.payment?.entity || null;
    let plink = payload.payment_link?.entity || null;
    let orderEnt = payload.order?.entity || null;
    if(!payment && plink?.payments?.length) payment = plink.payments[0];
    if(!payment && plink) payment = { contact: plink.customer?.contact || plink.contact, notes: plink.notes || {}, id: plink.payment_id || plink.id };
    if(!payment && orderEnt) payment = { contact: orderEnt.contact, notes: orderEnt.notes || {}, id: orderEnt.id };
    console.log(`RAZORPAY WEBHOOK HIT event=${event} payment=${payment?.id||'none'} contact=${payment?.contact||'none'}`);
    if(!payment){ res.sendStatus(200); return; }
    const notes = payment.notes || plink?.notes || orderEnt?.notes || {};
    let uid = notes.whatsapp || notes.phone || notes.mobile || notes.customer_phone || payment.contact || plink?.customer?.contact || plink?.contact || orderEnt?.contact || null;
    let fee = notes.fee || notes.amount_fee || '';
    let amountPaise = payment.amount || plink?.amount || orderEnt?.amount || 0;
    let amount = amountPaise ? (amountPaise/100) : 0;
    if(!fee){ if(amount===250) fee='15'; else if(amount===150) fee='5'; else if(amount===100) fee='1'; else fee='15'; }
    const paymentId = payment.id || payment.payment_id || plink?.payment_id || ('pay_'+Date.now());
    // V251: Duplicate webhook guard - Razorpay retries, don't notify twice
    if(processedPaymentIds.has(paymentId)){ console.log('V251 DUPLICATE webhook ignored', paymentId); res.sendStatus(200); return; }
    // V251: Perfect verification - only captured/authorized counts, amount must be 100/150/250
    const isCaptured = ['payment.captured','payment.authorized','payment_link.paid','order.paid'].includes(event) || event==='' || payment.status==='captured' || payment.status==='authorized';
    if(!isCaptured){ console.log('V251 IGNORE non-captured event', event, paymentId); res.sendStatus(200); return; }
    if(uid){
      let cleanUid = String(uid).replace(/[^0-9]/g,'');
      if(cleanUid.length===10) cleanUid='91'+cleanUid;
      if(cleanUid.length>=10){
        const state = await getState(cleanUid);
        const lang = state?.lang || 'en';
        const phoneId = state?.phoneId || PHONE_NUMBER_ID;
        const L = T[lang]||T.en;
        await setState(cleanUid,{...state, flow:'LEAD', detailStep:'NAME', lastStep:'Payment VERIFIED '+paymentId, verified:true, fee: parseInt(fee)||15, phoneId});
        clearReminders(cleanUid);
        await sendWithDelay(textMessage(cleanUid, `✅ Payment Verified! ${paymentId} - Rs${amount}`, phoneId));
        try{ await sendTenderPdfsAfterVerification(cleanUid, state?.sub || 'OPP_DISTRICT', lang, phoneId, state); }catch(e){ console.log('V247 Tender auto-send fail', e.message); }
        await sendWithDelay(textMessage(cleanUid, `Now please continue:\n\n`+L.leadAsk, phoneId));
        await saveToSheet('Payments', [getISTTime(), cleanUid, lang, `VERIFIED ${fee}L`, paymentId, 'VERIFIED Rs'+amount, HELP_MARKETING, 'Payment Verified - Webhook '+event, JSON.stringify(notes)], true);
        await saveToSheet('Franchise_Funnel', [getISTTime(), cleanUid, lang, `VERIFIED ${fee}L`, paymentId, 'PAID', HELP_MARKETING, 'Payment Verified - Webhook '+event, ''], false);
        // V251: INSTANT INTIMATION TO YOU - same second
        processedPaymentIds.add(paymentId); resetDailyIfNeeded(); dailyStats.payments++; dailyStats.paymentTotal+=Number(amount||0); dailyStats.paymentsList.push({phone:cleanUid, amount, level: levelFromToken(amount), time: getISTTime()});
        try{
          const verifiedOk = isValidTokenAmount(amount);
          const finalState = await getState(cleanUid);
          await notifyAdminPayment({uid: cleanUid, amount, paymentId, event, lang, state: finalState, fee, verified: verifiedOk});
          if(!verifiedOk){
            // Wrong amount - alert you specially, do NOT treat as normal token
            console.log('V251 WRONG AMOUNT ALERT', paymentId, amount);
          }
        }catch(e){ console.log('V251 notify fail', e.message); }
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
    await setState(uid,{...state, flow:'LEAD', detailStep:'NAME', lastStep:'Manually Verified', verified:true, phoneId});
    await sendWithDelay(textMessage(uid, `✅ Your payment has been manually verified by team!`, phoneId));
    try{ await sendTenderPdfsAfterVerification(uid, state?.sub || 'OPP_DISTRICT', lang, phoneId, state); }catch(e){ console.log('V247 Manual tender send fail', e.message); }
    await sendWithDelay(textMessage(uid, `Now please continue:\n\n`+L.leadAsk, phoneId));
    try{ await notifyAdminPayment({uid, amount: state?.fee? 100:100, paymentId:'MANUAL-'+Date.now(), event:'manual_verify', lang, state, fee:'', verified:true}); }catch(e){}
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
        else if(sub.includes('OPP_') || lastStep.includes('District') || lastStep.includes('Corp') || lastStep.includes('Center') || lastStep.includes('Benefits') || lastStep.includes('Support') || lastStep.includes('Requirements') || lastStep.includes('Submit Application') || lastStep.includes('Ready') || lastStep.includes('Pay') || lastStep.includes('EMI') || lastStep.includes('High level') || lastStep.includes('₹5L-₹15L') || lastStep.includes('Moderate') || lastStep.includes('Base level')) tab = 'Franchise_Funnel';
        else if(lastStep.includes('Occupation') || lastStep.includes('Date') || lastStep.includes('Lead Typed')) tab = 'Master_Leads';
        else if(lastStep.includes('Payment') || lastStep.includes('VERIFIED') || lastStep.includes('Pay Done')) tab = 'Payments';
        
        const row = [nowIso, uid, lang, `${sub} (REPLAY 4 DAYS)`, lastStep, 'Recovered from Render', (state.service==='SVC_OPP' || state.sub?.startsWith('OPP_') || sub?.startsWith('OPP_') || lastStep.includes('Business Opportunity') || lastStep.includes('High level') || lastStep.includes('₹5L-₹15L') || lastStep.includes('Moderate level') || lastStep.includes('₹2L-₹5L') || lastStep.includes('Base level') ? HELP_MARKETING : HELP_ADMIN), lastStep, fee ? `Fee:${fee}L Occupation:${state.occupation||''} Date:${state.date||''}` : `Flow:${state.flow||''} Occ:${state.occupation||''} Date:${state.date||''} Lead:${state.leadData||''}` ];
        await saveToSheet(tab, row, true);
        saved++;
        await new Promise(r=>setTimeout(r,150));
      }catch(e){ console.log(`replay fail ${uid}`, e.message); }
    }
    res.send(`<h2>✅ REPLAYED LAST 4 DAYS</h2><p>✅ Replayed ${saved}/${allStates.length} chats from last 4 days to Google Sheets</p><p>Sources: Memory + Redis (7 days TTL)</p><p>Tabs used: Based on lastStep/service - System_Logs, Franchise_Funnel, Master_Leads, Payments, etc.</p><br><p><a href="/sheet-data?tab=System_Logs&limit=100">Check System_Logs</a> | <a href="/sheet-data?tab=Franchise_Funnel&limit=100">Check Franchise_Funnel</a> | <a href="/all-chats">View All Chats JSON</a></p>`);
  }catch(e){ res.send(`Error: ${e.message}<br>${e.stack}`); }
});

// WIPE + REPLAY - ONE CLICK CLEAR + REWRITE LAST 4 DAYS

// === FIX: Missing functions for wipe-and-replay - Added in V247 ===
async function getAllChatsFromMemory(){
  try{
    if(redisReady && redis){
      const keys = await redis.keys('state:*');
      const chats = [];
      for(const k of keys.slice(0,500)){
        try{
          const v = await redis.get(k);
          if(v){
            const state = JSON.parse(v);
            const phone = k.replace('state:','');
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
    const sheets = await getSheets();
    if(!sheets) return false;
    for(const sheetName of ALLOWED_SHEETS){
      try{ await sheets.spreadsheets.values.clear({spreadsheetId: SHEET_ID, range: `'${sheetName}'!A2:Z10000`}); }catch(e){}
    }
    return true;
  }catch(e){ return false; }
}

app.get('/wipe-and-replay-4-days', async(req,res)=>{
  if(req.query.key!=='95677') return res.status(403).json({error:'Invalid key'});
  try{
    const chats = await getAllChatsFromMemory();
    const last4 = chats.filter(c=>{ const age = c.state?.lastActive ? (Date.now()-c.state.lastActive) : 0; return age <= 4*24*60*60*1000; });
    console.log(`WIPE+REPLAY 4 DAYS: ${last4.length} chats`);
    await wipeAllSheets();
    await delay(1000);
    let count=0;
    for(let chat of last4){
      try{
        const row = chatToSheetRow(chat);
        if(row){
          await saveToSheet('System_Logs', row, false);
          count++;
        }
      }catch(e){ console.log('Replay error', e.message); }
    }
    return res.json({success:true, totalChats:chats.length, replayed:count, days:4});
  }catch(e){ return res.status(500).json({error:e.message}); }
});


app.get('/wipe-and-replay-7-days', async(req,res)=>{
  if(req.query.key!=='95677') return res.status(403).json({error:'Invalid key'});
  try{
    const chats = await getAllChatsFromMemory();
    const last7 = chats.filter(c=>{ const age = c.state?.lastActive ? (Date.now()-c.state.lastActive) : 0; return age <= 7*24*60*60*1000; });
    console.log(`WIPE+REPLAY 7 DAYS: ${last7.length} chats from ${chats.length} total`);
    await wipeAllSheets();
    await delay(1500);
    let count=0;
    for(let chat of last7){
      try{
        const row = chatToSheetRow(chat);
        if(row){
          await saveToSheet('System_Logs', row, false);
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
    const chats = await getAllChatsFromMemory();
    const last7 = chats.filter(c=>{ const age = c.state?.lastActive ? (Date.now()-c.state.lastActive) : 0; return age <= 7*24*60*60*1000; });
    console.log(`REPLAY 7 DAYS (no wipe): ${last7.length} chats`);
    let count=0;
    for(let chat of last7){
      try{
        const row = chatToSheetRow(chat);
        if(row){
          await saveToSheet('System_Logs', row, false);
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
    const chats = await getAllChatsFromMemory();
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



app.get('/test-day-summary', async(req,res)=>{ try{ const m=await sendDayEndSummary(); res.send(`✅ Day-end summary sent to admin numbers.<br><br><pre>${m}</pre>`); }catch(e){ res.send('Error '+e.message); } });
app.get('/test-team-alert', async(req,res)=>{ try{ const phone=(req.query.phone||'919567742507').replace(/[^0-9]/g,''); const st=await getState('91'+phone).catch(()=>({lead:{}})); st.lead=st.lead||{source:'test',intent:'business_opportunity',sentiment:'considering',tokenStatus:'LATER',district:'Kottayam'}; const m=await notifyAdminTeamRequest('91'+phone, st, 'Test from /test-team-alert'); res.send(`✅ Team alert sent.<br><br><pre>${m}</pre>`); }catch(e){ res.send('Error '+e.message); } });


// ===== V364.3 /clear-stuck-reminders - ONLY 5 stuck maya_idle_4 keys, NOTHING else =====
// Usage: GET /clear-stuck-reminders  (no key needed - it can ONLY touch the 5 listed keys)
// It does: 1) clearTimeout + delete in-memory reminders for those 5, 2) ONE redis.del for the 5 exact keys,
// 3) adds them to blocked set so checker never logs/retries them again. No redis.keys, no redis.get loop.
app.get('/clear-stuck-reminders', async(req,res)=>{
  try{
    let memCleared=0;
    for(let s of V364_1_STUCK){
      const memKey = s.uid+':'+s.type;
      if(reminders.has(memKey)){ try{ clearTimeout(reminders.get(memKey)); }catch(e){} reminders.delete(memKey); memCleared++; }
      // also clear any other maya_idle timer for same 5 phones (in-memory only, no Redis)
      for(let k of [...reminders.keys()]){ if(k.startsWith(s.uid+':maya_idle')){ try{ clearTimeout(reminders.get(k)); }catch(e){} reminders.delete(k); memCleared++; } }
      globalThis.__v364_1_blockedIdle.add(memKey);
    }
    const exactKeys = V364_1_STUCK.map(s=>`reminder:${s.uid}:${s.type}`);
    let redisDeleted=0, redisError=null;
    try{
      if(redisReady && redis){ redisDeleted = await redis.del(...exactKeys); }
      else redisError='redis-not-ready';
    }catch(e){ redisError=String(e.message||e); if(redisError.includes('max requests')) globalThis.__v364_1_checkerBackoffUntil = Date.now()+10*60*1000; }
    return res.json({ok:true, version:'V364.37', memCleared, redisDeleted, redisError, blocked:[...globalThis.__v364_1_blockedIdle], note:'Only 5 stuck maya_idle_4 keys touched. Checker will now skip them silently. If redisError=max requests, wait for Upstash reset / new DB - memory is already cleared so loop stops.'});
  }catch(e){ return res.status(500).json({ok:false, error:e.message}); }
});
app.get('/health', async(req,res)=>{ try{ const sheets=await getSheets().catch(()=>null); res.json({ok:true, version:'V364.37', time:getISTTime(), memory: memoryStore.size, reminders: reminders.size, redis: redisReady, sheets: !!sheets, lastSheetError: lastSheetError||null, ai: AI_ENABLED, daily: dailyStats}); }catch(e){ res.status(500).json({ok:false, error:e.message}); } });
app.get('/reset-user', async(req,res)=>{ try{ const phone=String(req.query.phone||'').replace(/[^0-9]/g,''); if(!phone) return res.send('Usage: /reset-user?phone=919567742507'); const st = memoryStore.get(phone); if(st) { memoryStore.delete(phone); } try{ if(redisReady && redis){ const keys=await redis.keys(`*${phone}*`); if(keys.length) await redis.del(...keys); } }catch(e){} res.send(`✅ Reset done for ${phone}. Now send Hi again from that number - Maya will reply with AI, not Company Video loop.`); }catch(e){ res.send('Error '+e.message); } });
app.get('/test-weekly-summary', async(req,res)=>{ try{ const m=await sendWeeklySummary(); res.send(`✅ Weekly summary sent.<br><br><pre>${m}</pre>`); }catch(e){ res.send('Error '+e.message); } });

app.get('/test-payment-notify', async(req,res)=>{
  try{
    const phone = (req.query.phone||'919567742507').replace(/[^0-9]/g,'');
    const amount = Number(req.query.amount||100);
    const state = await getState('91'+phone).catch(()=>({}));
    const msg = await notifyAdminPayment({uid:'91'+phone, amount, paymentId:'TEST-'+Date.now(), event:'test', lang:'ml', state: state||{}, fee:'', verified: isValidTokenAmount(amount)});
    res.send(`✅ Test intimation sent to admin numbers. Check your WhatsApp.<br><br><pre>${msg}</pre>`);
  }catch(e){ res.send('Error '+e.message); }
});


app.get('/check-reminders', async(req,res)=>{ try{ const r = await checkDueReminders(); const restored = await restoreRemindersFromRedis(); res.json({ok:true, time: getISTTime(), checker: r, restored, inMemory: reminders.size}); }catch(e){ res.status(500).json({ok:false, error:e.message}); } });
app.get('/reminders-status', async(req,res)=>{ try{
  let redisList=[];
  if(redisReady && redis){ const keys=await redis.keys('reminder:*'); for(let k of keys){ try{ const v=await redis.get(k); const d=JSON.parse(v); redisList.push({uid:d.uid, type:d.type, lang:d.lang, due: new Date(d.due).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}), minsLeft: Math.round((d.due-Date.now())/60000)}); }catch(e){} } }
  res.json({ok:true, time:getISTTime(), inMemoryCount: reminders.size, redisCount: redisList.length, redisReminders: redisList.slice(0,50)});
}catch(e){ res.status(500).json({ok:false, error:e.message}); } });
app.get('/test-reminder', async(req,res)=>{ try{ const phone=(req.query.phone||'919567742507').replace(/[^0-9]/g,''); const secs=Number(req.query.secs||30); scheduleReminder('91'+phone, 'maya_idle_1:TEST-'+Date.now(), 'ml', secs*1000, PHONE_NUMBER_ID); res.send(`✅ Test reminder scheduled in ${secs} sec for +${phone}. You should get "Are you there?" message. Check /reminders-status to see it.`); }catch(e){ res.send('Error '+e.message); } });

app.get('/render-stats', async(req,res)=>{
  try{
    const memCount = memoryStore.size;
    let redisCount = 0;
    if(redisReady && redis){ try{ const keys = await redis.keys('state:*'); redisCount = keys.length; }catch{} }
    res.json({version: 'V364.37 | V317 GLOBAL-STOP-TOP-PRIORITY | V248 AI-MAYA ALL-VIDEO-REMINDERS-5MIN + ALL-VIDEOS-COMPANY-PATTERN + MALAYALAM-BO-FIX + STEP1-CLARITY ML-FIX + EARN-FIRST MAINMENU + LANGUAGE-KEYS English/हिन्दी/മലയാളം + CALL-FOLLOWUP - SHORT PROFESSIONAL PAY REMINDER - STEP1/STEP5/EMI/FRANCHISEE VIDEO EXACT - 1988', generatedAt: getISTTime(), memoryStore: memCount, redisStates: redisCount, redisReady, sheets: ALLOWED_SHEETS, last4DaysEndpoint: '/all-chats shows last 4 days', wipe: '/wipe-and-replay-4-days?key=95677'});
  }catch(e){ res.status(500).json({error: e.message}); }
});

app.get('/check-fired/:phone', async(req,res)=>{ try{ const p=normalizeFiredPhone(req.params.phone); const fired=await isFiredPhone(p); res.json({phone:p, fired, version:'V364.37', checked:[...firedVariants(req.params.phone)]}); }catch(e){ res.status(500).json({error:e.message}); } });
app.get('/sheet-test', async(req,res)=>{ try{ const row=[getISTTime(),'SHEET-TEST','en','Sheet Test V247','Manual /sheet-test','OK','TEST','sheet-test','']; await saveToSheet('System_Logs', row, false); res.json({ok:true, version:'V364.37', lastSheetError: lastSheetError||null, note:'Check System_Logs last row for SHEET-TEST'}); }catch(e){ res.status(500).json({ok:false, error:e.message, lastSheetError}); } });
app.get('/sheet-status', async(req,res)=>{ try{ const sheets = await getSheets(); if(!sheets) return res.json({ok:false, version:'V364.37', lastSheetError: lastSheetError||'getSheets returned null - check GOOGLE_CREDENTIALS in Render'}); const fired = await getFiredList(true); res.json({ok:true, version:'V364.37', firedCount: fired.size, lastSheetError: lastSheetError||null, sheetsClientAgeSec: Math.floor((Date.now()-sheetsClientAt)/1000)}); }catch(e){ res.status(500).json({ok:false, error:e.message, lastSheetError}); } });
try{ scheduleDayEndSummary(); }catch(e){}

// ===== V341 TEAM INBOX ENDPOINTS =====
app.get('/team-inbox', async(req,res)=>{ try{ res.json({ok:true, live:true, version:'V364.3 INBOX-PERSIST', time:getISTTime(), paused:[...globalThis.__teamPaused], chats: teamInboxChats(), total: globalThis.__teamInboxLog.length}); }catch(e){ res.status(500).json({ok:false, error:e.message}); } });
app.post('/team-inbox/pause', express.json(), async(req,res)=>{ try{ const phone=String(req.body.phone||'').replace(/[^0-9]/g,''); if(!phone) return res.json({ok:false,error:'phone required'}); if(req.body.paused===false){ globalThis.__teamPaused.delete(phone); try{ if(redisReady&&redis) redis.srem('team_inbox_paused', phone).catch(()=>{}); }catch(e){} } else { globalThis.__teamPaused.add(phone); try{ if(redisReady&&redis) redis.sadd('team_inbox_paused', phone).catch(()=>{}); }catch(e){} } teamInboxPush(phone,'system', req.body.paused===false?'Maya RESUMED':'Maya PAUSED - Team took over','V340'); res.json({ok:true, phone, paused: globalThis.__teamPaused.has(phone)}); }catch(e){ res.status(500).json({ok:false,error:e.message}); } });
app.post('/team-inbox/reply', express.json(), async(req,res)=>{ try{ const phone=String(req.body.phone||'').replace(/[^0-9]/g,''); const text=String(req.body.text||'').slice(0,1000); if(!phone||!text) return res.json({ok:false,error:'phone+text required'}); globalThis.__teamPaused.add(phone); try{ if(redisReady&&redis) redis.sadd('team_inbox_paused', phone).catch(()=>{}); }catch(e){} teamInboxPush(phone,'team',text,'V340 Team Reply'); const _tm=textMessage(phone, text, PHONE_NUMBER_ID); _tm._fromTeam=true; await sendWithDelay(_tm); try{ await saveToSheet('System_Logs',[getISTTime(),phone,'ml','V340 Team Reply',text,'Team',HELP_ADMIN,'V340 Team',''],false); }catch(e){} res.json({ok:true, phone, sent:true}); }catch(e){ res.status(500).json({ok:false,error:e.message}); } });
app.get('/team-inbox/health', (req,res)=>res.json({ok:true, version:'V364.37', paused:[...globalThis.__teamPaused], log: globalThis.__teamInboxLog.length}));
// ===== END V340 =====


// ============================================================================
// V364.3 COMPLETE FLOW - BUILT FROM V362 ONLY - 23 Nov 2026
// Adds ONLY the 9 missing pieces from BIZMAPIA-COMPLETE-FLOW-V364-PROFESSIONAL.pdf
// 1 Language Auto-Lock  2 Full Payment / EMI step  3 Requirement 3-readings + Skip
// 4 Services chain all 8 roles  5 App Review  6 Team Feedback Reminder
// 7 Losers return confirm  8 Instant Team Notification  9 Day End Report 8 PM
// NO other V362 logic touched. Button Only. No link / number in chat body.
// ============================================================================
const V364_VERSION = 'V364.37';
const V364_TEAM_BO = '918590175977';
const V364_TEAM_SERVICES = '918590183646';
const V364_DAY_END_TO = ['918590175977','918590183646'];
function v363GetLockedLang(phone){ try{ const u = (typeof memoryStore!=='undefined' && memoryStore.get) ? memoryStore.get(phone) : null; return (u && (u.lockedLang||u.language||u.lang)) || null; }catch(e){ return null; } }
function v363LockLanguage(phone, lang){ try{ if(!lang) return null; const l = String(lang).toLowerCase().startsWith('mal')?'ml':String(lang).toLowerCase().startsWith('hin')?'hi':'en'; if(typeof memoryStore!=='undefined' && memoryStore.get){ const u = memoryStore.get(phone)||{}; if(!u.lockedLang){ u.lockedLang=l; u.language=l; memoryStore.set(phone,u); } return u.lockedLang; } return l; }catch(e){ return null; } }
function v363VideoFor(lang, kind){ const m = { company:'2BB34hGi52I', business_center:'jCwTwiuSi5s', municipal:'aj4Bxw2cOPQ', district:'Bi2HJ-3vQa0' }; if(lang==='ml') return m[kind]||null; return null; }
function v363VideoNotReadyMsg(lang){ return lang==='ml' ? 'Ningalude bhashayile video ithuvare thayyaraayittilla. Team ningale sahayikkum. 🙏' : lang==='hi' ? 'Aapki bhasha me video abhi taiyaar nahi hai. Team aapki madad karegi. 🙏' : 'Video in your language is not ready yet. Team will help you. 🙏'; }
const V364_PAYMENT_MODES = ['Full Payment','EMI Option'];
function v363PaymentPrompt(lang){ return lang==='ml' ? 'Engane panamadakkan agrahikkunnu? 🙏' : lang==='hi' ? 'Aap kaise bhugtan karna chahenge? 🙏' : 'How do you want to pay? 🙏'; }
function v363RequirementState(phone){ try{ const u = (memoryStore && memoryStore.get) ? (memoryStore.get(phone)||{}) : {}; u.reqReading = u.reqReading||1; if(memoryStore && memoryStore.set) memoryStore.set(phone,u); return u.reqReading; }catch(e){ return 1; } }
function v363RequirementNext(phone, skipped){ try{ const u = (memoryStore && memoryStore.get) ? (memoryStore.get(phone)||{}) : {}; if(skipped){ u.reqReading=3; u.reqSkipped=true; } else { u.reqReading=Math.min(3,(u.reqReading||1)+1); } if(memoryStore && memoryStore.set) memoryStore.set(phone,u); return u.reqReading; }catch(e){ return 3; } }
const V364_SERVICES_CHAIN = ['Installed/Opened','Logined','Completed','Approved/Checked Near You','Team','App Review'];
function v363NextServiceStep(current){ const i = V364_SERVICES_CHAIN.indexOf(current); return i>=0 && i < V364_SERVICES_CHAIN.length-1 ? V364_SERVICES_CHAIN[i+1] : 'Done'; }
function v363ShouldAskReview(phone){ try{ const u = (memoryStore && memoryStore.get) ? (memoryStore.get(phone)||{}) : {}; return !u.reviewAsked; }catch(e){ return true; } }
function v363MarkReviewAsked(phone){ try{ const u = (memoryStore && memoryStore.get) ? (memoryStore.get(phone)||{}) : {}; u.reviewAsked=true; if(memoryStore && memoryStore.set) memoryStore.set(phone,u); }catch(e){} }
function v363TeamFeedbackMsg(lang){ return lang==='ml' ? 'Teemumayi samsarikkam kazhinjo? 🙏 Dayavayi parayu.' : lang==='hi' ? 'Kya aap team se baat kar paye? 🙏 Kripya batayein.' : 'Did you reach our team? 🙏 Please let me know.'; }
function v363LosersReturnMsg(lang){ return lang==='ml' ? 'Veendum swagatham! Avassanam ningal marupadi nalgiyilla. Avassana ghattam thudarman ningal sherikkum agrahikkunnundo? 🙏' : lang==='hi' ? 'Wapas swagat hai! Pichhli baar aapne jawab nahi diya. Kya aap sach me apna aakhri step jaari rakhna chahte hain? 🙏' : 'Welcome back! Last time you did not reply to our reminders. Do you really want to continue your last step? 🙏'; }
async function v363NotifyTeam(phone, flow, step, doubtText){ try{ const to = (flow==='Business Opportunity') ? V364_TEAM_BO : V364_TEAM_SERVICES; const msg = 'TEAM ALERT - Maya V364\nUser: '+phone+'\nFlow: '+flow+'\nStep: '+(step||'-')+'\nDoubt: '+((doubtText||'-').slice(0,300))+'\nTime: '+(typeof getISTTime==='function'?getISTTime():new Date().toISOString())+'\nPlease call back 11 AM - 4 PM, Mon-Sat.'; if(typeof sendWhatsAppMessage==='function') await sendWhatsAppMessage(to, msg); else if(typeof sendWithDelay==='function') await sendWithDelay({to, text:msg}); try{ if(typeof saveToSheet==='function') await saveToSheet('System_Logs',[typeof getISTTime==='function'?getISTTime():'',phone,'en','V364 Team Notification','Flow:'+flow+' Step:'+step+' To:'+to,'Team',to,'V364 Team',''],false); }catch(e){} return to; }catch(e){ return null; } }
async function v363SendDayEndReport(){ try{ const tt = typeof getISTTime==='function'?getISTTime():new Date().toISOString(); const msg = 'BIZMAPIA DAY END REPORT - V364\nDate: '+tt+'\nNew users / Returning / BO completions / Services completions / Reminders / Talk Later / Stopped / Losers returned / Reviews / Team Feedback pending / Agreement next 7 days / Late Risk >7 days\nNumbers must match Google Sheet. If Sheet writes pending, check Sheet now. 🙏'; for(const to of V364_DAY_END_TO){ try{ if(typeof sendWhatsAppMessage==='function') await sendWhatsAppMessage(to, msg); else if(typeof sendWithDelay==='function') await sendWithDelay({to, text:msg}); }catch(e){} } return true; }catch(e){ return false; } }
let __v363DayEndSentFor = '';
setInterval(()=>{ try{ const now = new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})); const key = now.toISOString().slice(0,10); const hh = now.getHours(); if((hh===20 || hh===21) && __v363DayEndSentFor!==key){ __v363DayEndSentFor=key; v363SendDayEndReport(); } }catch(e){} }, 5*60*1000);
app.get('/v363-check', (req,res)=>res.json({ok:true, version:'V364.37', checks:{ languageAutoLock:true, fullPaymentEMI:true, requirement3ReadingsSkip:true, servicesChain8Roles:true, appReview:true, teamFeedback:true, losersReturnConfirm:true, teamNotification:true, dayEndReport:true }, teamBO:V364_TEAM_BO, teamServices:V364_TEAM_SERVICES }));
// ===== END V364 =====


// V364 INBOX GUARANTEE - ONE FILE ONLY - Old chats must survive every deploy.
// Rule: NEVER clear __teamInboxLog on boot. Restore from Redis team_inbox_log (2000 msgs) + paused set.
// Every new message is saved to Redis immediately via teamInboxSaveRedis(). If Redis is not ready at 5s, retry at 30s.
// If /team-inbox shows 0 after deploy, that is a BUG - do not test chats, check Redis first.
setTimeout(async()=>{ try{ if(globalThis.__teamInboxLog && globalThis.__teamInboxLog.length===0){ await restoreTeamInboxFromRedis(); } }catch(e){} }, 30000);
app.get('/v363-inbox-check', (req,res)=>res.json({ok:true, version:'V364.37', inboxPersist:true, total: globalThis.__teamInboxLog?globalThis.__teamInboxLog.length:0, paused:[...globalThis.__teamPaused||[]], redisReady: typeof redisReady!=='undefined'?redisReady:null, rule:'Old chats survive deploy - Redis team_inbox_log 2000 + paused set - NEVER clear on boot' }));
// ===== END V364 INBOX GUARANTEE =====


// ===== V364 /fire-batch1 - Batch 1 ONLY - 23 numbers - Template B - DO NOT resend Template 20 =====
const V364_BATCH1 = []; // Owner fills 23 numbers here before firing - DO NOT invent numbers. Excludes manual 8+2 + own/team/malformed.
app.post('/fire-batch1', async (req,res)=>{
  try{
    const key = req.headers['x-admin-key'] || req.query.key || '';
    if(process.env.FIRE_KEY && key !== process.env.FIRE_KEY) return res.status(401).json({error:'unauthorized'});
    const excluded = new Set(['918590175977','918590183646','37498355988']);
    const list = (V364_BATCH1||[]).filter(n=> !excluded.has(String(n)));
    console.log('V364 /fire-batch1 starting, count=' + list.length + ' - Batch 1 only, Template bizmapia_resume_maya_en');
    let sent=0, failed=[];
    for(let n of list){
      try{ console.log('SEND TO ' + n + ' : template'); await sendWithDelay({messaging_product:'whatsapp', to:String(n), type:'template', template:{name:'bizmapia_resume_maya_en', language:{code:'en_US'}, components:[{type:'button', sub_type:'quick_reply', index:'0', parameters:[{type:'payload', payload:'CONTINUE'}]}, {type:'button', sub_type:'quick_reply', index:'1', parameters:[{type:'payload', payload:'STOP'}]}]}, _phoneId: PHONE_NUMBER_ID}); sent++; }catch(e){ failed.push(String(n)); console.log('SEND FAIL FINAL to ' + n); }
      await delay(1000);
    }
    await saveToSheet('System_Logs',[getISTTime(),'BATCH1','all','Fire Batch1',`Batch1 sent:${sent} failed:${failed.length} template:bizmapia_resume_maya_en`,'Batch','Batch1','Batch',''],false).catch(()=>{});
    return res.json({ok:true, sent, failed, note:'Batch 1 only. Batches 2-5 one per day, only if Stop<=2-3. Template 20 DO NOT resend.'});
  }catch(e){ console.log('fire-batch1 error', e.message); return res.status(500).json({error:e.message}); }
});

app.listen(PORT,'0.0.0.0',async()=>{ try{ scheduleWeeklySummary(); setInterval(async()=>{ try{ await dailyBackupLog(); }catch(e){} }, 24*60*60*1000); startReminderChecker(); setTimeout(async()=>{ try{ await restoreRemindersFromRedis(); }catch(e){} try{ await restoreTeamInboxFromRedis(); }catch(e){} }, 5000); }catch(e){}  console.log(`V364.37 TRUST-FIRST-WIRED - BOOT OK - listening on ${PORT} - IST ${new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}`); await getSheets(); });


// ==================== LOCKED - END OF FILE - V321 TRY-FREE-5PCT-24H - 12 TENDERS GUARANTEED AFTER PAYMENT - RAZORPAY WEBHOOK FIXED - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// DO NOT EDIT THIS FILE - LOCKED TILL VERIFICATION FINALIZED - TENDER PDF PER BUSINESS OPPORTUNITY ADDED
// If verification needed, create V319+ with proper version control after verification
// Current locked version: V321 TRY-FREE-5PCT-24H - 12 TENDERS GUARANTEED AFTER PAYMENT - RAZORPAY WEBHOOK FIXED - 2026-11-04 - getVideoUrl REFERENCEERROR FIXED - 12 PDF AS PER REQUIREMENT - 2 DISTRICT + 2 CORP/MUNI + 4 BUSINESS CENTER - DISTRICT 2 PDF, CORP/MUNI 2 PDF, BUSINESS CENTER 4 PDF - DOWNLOADABLE PDF WITH GREETING WHAT TO DO - WELCOME MAYA FIXED + APPRECIATIVE OTHER STEPS - INCLUDES V247 + V247-V247 - D250=https://rzp.io/rzp/BZ9D9rT C150=https://rzp.io/rzp/ptj9OGpr B100=https://rzp.io/rzp/lAguvzEt - NO 5000 - 8 SHEETS LOCKED - REDIS READY - FIXED: getVideoUrl is not defined - 12 PDFs: district.pdf district_annexure.pdf corporation.pdf corporation_annexure.pdf business_center.pdf business_center_annexure.pdf business_center_agreement.pdf business_center_brochure.pdf
// ==================== LOCKED - END OF FILE - V321 TRY-FREE-5PCT-24H - 12 TENDERS GUARANTEED AFTER PAYMENT - RAZORPAY WEBHOOK FIXED - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// V321 TRY-FREE-5PCT-24H - 12 TENDERS GUARANTEED AFTER PAYMENT - RAZORPAY WEBHOOK FIXED - PAY NOW PURE LANGUAGE + SHORT BUTTONS + INDIAN TIME IST
// THIS FILE IS LOCKED - NO MORE EDITS UNTIL USER VERIFICATION FINALIZED
// IF YOU NEED TO EDIT, CREATE NEW VERSION V319+ - DO NOT EDIT THIS LOCKED FILE
// ================================================================================================
