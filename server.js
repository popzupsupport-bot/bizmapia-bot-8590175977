const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
const express = require('express')
const qrcode = require('qrcode')
const fs = require('fs')
const pino = require('pino')

const app = express()
const PORT = process.env.PORT || 10000
let qrCodeData = ''
let sock = null
let isConnected = false

// ===== LANGUAGE DETECTOR =====
function detectLanguage(text) {
  if (!text) return 'en'
  // Malayalam Unicode range
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'
  // Hindi / Devanagari
  if (/[\u0900-\u097F]/.test(text)) return 'hi'
  // Tamil
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'
  // Check common Malayalam words in English letters
  const mlWords = ['ente', 'njan', 'sherikk', 'enthina', 'engane', 'evide', 'samsaarikkam', 'business', 'malayalam']
  const lower = text.toLowerCase()
  if (mlWords.some(w => lower.includes(w)) && lower.includes('malayalam')) return 'ml_translit'
  return 'en'
}

function getReplyByLanguage(lang, type) {
  const replies = {
    en: {
      menu: `Hi 👋 Welcome to *BizMapia*!\n\n🇮🇳 India's Trusted Business Opportunity\n\n💼 *Opportunities:*\n1️⃣ *Business Center (Online Taxi)* - 1 Lac\n2️⃣ *District Franchisee* - 10-15 Lac\n\nReply: 1-Details, 2-Apply, 3-Support, 4-App Link\nwww.bizmapia.com`,
      thanks: `Thanks for the image! 📸 Our team will check it and reply soon. Reply HI for menu.`,
      video: `Thanks for the video! 🎥 Received. Our team will view and contact you.\nReply HI for menu.`,
      app: `📱 *BizMapia App Download*\n\nAndroid: https://play.google.com/store/apps/details?id=com.bizmapia.app\n\nWebsite: www.bizmapia.com\n\nDownload app to see all business opportunities!`
    },
    ml: {
      menu: `ഹായ് 👋 *BizMapia* യിലേക്ക് സ്വാഗതം!\n\n💼 *ബിസിനസ്സ് അവസരങ്ങൾ:*\n1️⃣ ബിസിനസ്സ് സെന്റർ (ഓൺലൈൻ ടാക്സി) - 1 ലക്ഷം\n2️⃣ ഡിസ്ട്രിക്റ്റ് ഫ്രാഞ്ചൈസി - 10-15 ലക്ഷം\n\nറിപ്ലൈ: 1-വിവരങ്ങൾ, 2-അപേക്ഷ, 3-സപ്പോർട്ട്, 4-ആപ്പ് ലിങ്ക്`,
      thanks: `ഫോട്ടോയ്ക്ക് നന്ദി! 📸 ടീം പരിശോധിച്ച് മറുപടി നൽകും. മെനുവിന് HI എന്ന് റിപ്ലൈ ചെയ്യൂ.`,
      video: `വീഡിയോയ്ക്ക് നന്ദി! 🎥 ലഭിച്ചു. ടീം കണ്ട് ബന്ധപ്പെടും.`,
      app: `📱 *BizMapia App ഡൗൺലോഡ്*\n\nAndroid: https://play.google.com/store/apps/details?id=com.bizmapia.app\n\nwww.bizmapia.com`
    },
    hi: {
      menu: `नमस्ते 👋 *BizMapia* में आपका स्वागत है!\n\n💼 *बिजनेस अवसर:*\n1️⃣ बिजनेस सेंटर (ऑनलाइन टैक्सी) - 1 लाख\n2️⃣ डिस्ट्रिक्ट फ्रेंचाइजी - 10-15 लाख\n\nरिप्लाई: 1-जानकारी, 2-आवेदन, 3-सपोर्ट, 4-ऐप लिंक`,
      thanks: `फोटो के लिए धन्यवाद! 📸 टीम चेक करके जवाब देगी।`,
      video: `वीडियो के लिए धन्यवाद! 🎥 प्राप्त हुआ।`,
      app: `📱 *BizMapia App डाउनलोड*\n\nhttps://play.google.com/store/apps/details?id=com.bizmapia.app`
    }
  }
  return replies[lang]?.[type] || replies['en'][type]
}

async function startBot() {
  const { version } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

  sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['BizMapia Bot', 'Chrome', '1.0.0'],
    markOnlineOnConnect: true,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) { qrCodeData = qr; isConnected = false; console.log('NEW QR GENERATED - /qr') }
    if (connection === 'close') {
      isConnected = false
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode!== DisconnectReason.loggedOut
      if (shouldReconnect) setTimeout(() => startBot(), 3000)
    } else if (connection === 'open') {
      isConnected = true; qrCodeData = ''; console.log('✅ 8590175977 Connected!')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type!== 'notify') return
    for (const msg of messages) {
      try {
        if (!msg.message) continue
        if (msg.key.remoteJid === 'status@broadcast') continue
        if (msg.key.fromMe) continue
        const from = msg.key.remoteJid
        if (from.endsWith('@g.us')) continue

        // ===== EXTRACT ALL MESSAGE TYPES =====
        let text = ''
        let isImage =!!msg.message.imageMessage
        let isVideo =!!msg.message.videoMessage
        let isDocument =!!msg.message.documentMessage
        let isLocation =!!msg.message.locationMessage
        let hasAppLink = false

        if (msg.message.conversation) text = msg.message.conversation
        else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text
        else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption
        else if (msg.message.videoMessage?.caption) text = msg.message.videoMessage.caption
        else if (msg.message.documentMessage?.caption) text = msg.message.documentMessage.caption

        console.log(`📩 ${isImage?'[IMAGE]':''}${isVideo?'[VIDEO]':''}${isDocument?'[DOC]':''} from ${from}: ${text || 'media'}`)

        // ===== DETECT APP LINKS =====
        const combinedText = text + ' ' + (msg.message.extendedTextMessage?.matchedText || '')
        if (combinedText.match(/play\.google\.com|bizmapia\.com\/app|app link|apk|download app/i) || combinedText.includes('bizmapia')) {
          hasAppLink = combinedText.toLowerCase().includes('app')
        }

        const lang = detectLanguage(text)
        const lower = text.toLowerCase().trim()
        let replyText = ''

        // ===== 1. HANDLE IMAGE =====
        if (isImage) {
          if (text) {
            replyText = getReplyByLanguage(lang, 'thanks') + `\n\nYou wrote: "${text}"\nOur team will review.`
          } else {
            replyText = getReplyByLanguage(lang, 'thanks')
          }
        }
        // ===== 2. HANDLE VIDEO =====
        else if (isVideo) {
          replyText = getReplyByLanguage(lang, 'video')
        }
        // ===== 3. HANDLE APP LINK REQUEST =====
        else if (hasAppLink || lower.includes('app link') || lower === '4' || lower.includes('download')) {
          replyText = getReplyByLanguage(lang, 'app')
        }
        // ===== 4. HANDLE DOCUMENT / LOCATION =====
        else if (isDocument) {
          replyText = `📄 Document received! Thanks. Our team will check.\nReply HI for menu.`
        }
        else if (isLocation) {
          replyText = `📍 Location received! Thanks for sharing. Our team will contact you based on your city.\nReply HI for menu.`
        }
        // ===== 5. HANDLE TEXT WITH LANGUAGE SUPPORT =====
        else if (['hi','hello','hai','hey','hii','helo','namaste','namaskaram'].includes(lower) || lower.startsWith('hi ') || lower.startsWith('hello')) {
          replyText = getReplyByLanguage(lang === 'ml_translit'? 'ml' : lang, 'menu')
        }
        else if (lower === '1' || lower.includes('detail') || lower.includes('oppertunity') || lower.includes('vivaram')) {
          if (lang === 'ml') {
            replyText = `📊 *BizMapia വിവരങ്ങൾ*\n\n*1. Business Center (1 Lac)*\n✅ ഓൺലൈൻ ടാക്സി ബുക്കിംഗ് സെന്റർ\n✅ വീട്ടിൽ നിന്ന് ജോലി\n✅ മാസ വരുമാനം 30k-60k\n\n*2. District Franchisee (10-15 Lac)*\n✅ മുഴുവൻ ജില്ലയുടെ അവകാശം\n✅ ഉയർന്ന കമ്മീഷൻ\n\nഏതാണ് താൽപ്പര്യം? 1 അല്ലെങ്കിൽ 2 റിപ്ലൈ ചെയ്യൂ.`
          } else if (lang === 'hi') {
            replyText = `📊 *BizMapia जानकारी*\n\n*1. Business Center (1 Lakh)*\n✅ ऑनलाइन टैक्सी बुकिंग सेंटर\n✅ घर से काम\n✅ मासिक आय 30k-60k\n\n*2. District Franchisee (10-15 Lakh)*\n✅ पूरे जिले का अधिकार\n\nकौन सा पसंद है? 1 या 2 भेजें।`
          } else {
            replyText = `📊 *BizMapia Details*\n\n*1. Business Center (1 Lac)*\n✅ Online Taxi Booking Center\n✅ Work from home\n✅ Monthly 30k-60k\n\n*2. District Franchisee (10-15 Lac)*\n✅ Full District Rights\n✅ High commission\n\nWhich one? Reply 1 or 2.`
          }
        }
        else if (lower === '2' || lower.includes('apply') || lower.includes('form') || lower.includes('apeksha')) {
          replyText = getReplyByLanguage(lang === 'ml_translit'? 'ml' : lang, 'menu').includes('BizMapia')? `📝 Share details:\nFull Name:\nCity:\nPhone:\nInterest: (Business Center/District)\n\nTeam will call in 24hrs!` : `📝 Details share cheyyu:\nName:\nCity:\nPhone:\n\nTeam vilikkum!`
        }
        else if (lower === '3' || lower.includes('support') || lower.includes('call') || lower.includes('talk')) {
          replyText = `📞 *Support*\nCall/WhatsApp: +91 85901 75977\n10 AM - 6 PM\nwww.bizmapia.com`
        }
        else if (text) {
          // Default with language
          if (lang === 'ml') {
            replyText = `നന്ദി! "${text}" എന്ന നിങ്ങളുടെ മെസ്സേജ് ലഭിച്ചു 🙏\nടീം ഉടൻ മറുപടി നൽകും.\n\nമെനുവിന് HI എന്ന് അയക്കൂ.`
          } else if (lang === 'hi') {
            replyText = `धन्यवाद! आपका मैसेज "${text}" मिला 🙏\nटीम जल्द जवाब देगी।\n\nमेनू के लिए HI भेजें।`
          } else {
            replyText = `Thanks for "${text}" 🙏\nOur team will reply soon!\n\nReply *HI* for menu\n*4* for App Link\nwww.bizmapia.com`
          }
        }

        if (replyText) {
          await sock.sendMessage(from, { text: replyText })
          console.log(`✅ Replied [${lang}] to ${from}`)
        }

      } catch (err) {
        console.error('Handler error:', err)
      }
    }
  })
}

app.get('/', (req, res) => res.send(`<h1>BizMapia Bot</h1><p>Status: ${isConnected?'✅ CONNECTED':'⏳ Connecting'} | <a href="/qr">QR</a> | <a href="/clear">Clear</a></p>`))
app.get('/qr', async (req, res) => {
  if (isConnected) return res.send('<h1>✅ Connected!</h1>')
  if (!qrCodeData) return res.send('<h1>Wait 5 sec...</h1><script>setTimeout(()=>location.reload(),2000)</script>')
  const qrImage = await qrcode.toDataURL(qrCodeData)
  res.send(`<div style="text-align:center"><h1>Scan QR</h1><img src="${qrImage}" width="350"/><script>setTimeout(()=>location.reload(),15000)</script></div>`)
})
app.get('/clear', (req, res) => {
  try { fs.rmSync('./auth_info', {recursive:true, force:true}) } catch(e){}
  qrCodeData=''; isConnected=false
  res.send('Cleared! Redeploy now')
  setTimeout(()=>process.exit(0),1000)
})
app.listen(PORT, ()=>console.log('Server on '+PORT))
startBot()
