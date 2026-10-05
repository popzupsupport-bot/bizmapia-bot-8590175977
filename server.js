import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import express from 'express'
import qrcode from 'qrcode'
import fs from 'fs'
import pino from 'pino'

const app = express()
const PORT = process.env.PORT || 10000
let qrCodeData = ''
let sock = null
let isConnected = false

function detectLanguage(text) {
  if (!text) return 'en'
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'
  if (/[\u0900-\u097F]/.test(text)) return 'hi'
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'
  return 'en'
}

function getReplyByLanguage(lang, type) {
  const replies = {
    en: {
      menu: `Hi 👋 Welcome to *BizMapia*!\n\n🇮🇳 India's Trusted Business Opportunity\n\n💼 *Opportunities:*\n1️⃣ *Business Center (Online Taxi)* - 1 Lac\n2️⃣ *District Franchisee* - 10-15 Lac\n\nReply: 1-Details, 2-Apply, 3-Support, 4-App Link\nwww.bizmapia.com`,
      img: `Thanks for the image! 📸 Our team will check it and reply soon. Reply HI for menu.`,
      video: `Thanks for the video! 🎥 Received. Our team will view and contact you.\nReply HI for menu.`,
      app: `📱 *BizMapia App Download*\n\nAndroid: https://play.google.com/store/apps/details?id=com.bizmapia.app\nWebsite: www.bizmapia.com`
    },
    ml: {
      menu: `ഹായ് 👋 *BizMapia* യിലേക്ക് സ്വാഗതം!\n\n💼 *ബിസിനസ്സ് അവസരങ്ങൾ:*\n1️⃣ ബിസിനസ്സ് സെന്റർ (ഓൺലൈൻ ടാക്സി) - 1 ലക്ഷം\n2️⃣ ഡിസ്ട്രിക്റ്റ് ഫ്രാഞ്ചൈസി - 10-15 ലക്ഷം\n\nറിപ്ലൈ: 1-വിവരങ്ങൾ, 2-അപേക്ഷ, 3-സപ്പോർട്ട്, 4-ആപ്പ് ലിങ്ക്`,
      img: `ഫോട്ടോയ്ക്ക് നന്ദി! 📸 ടീം പരിശോധിച്ച് മറുപടി നൽകും.`,
      video: `വീഡിയോയ്ക്ക് നന്ദി! 🎥 ലഭിച്ചു.`,
      app: `📱 *BizMapia App ഡൗൺലോഡ്*\nAndroid: https://play.google.com/store/apps/details?id=com.bizmapia.app\nwww.bizmapia.com`
    },
    hi: {
      menu: `नमस्ते 👋 *BizMapia* में स्वागत है!\n\n💼 *बिजनेस अवसर:*\n1️⃣ बिजनेस सेंटर - 1 लाख\n2️⃣ डिस्ट्रिक्ट फ्रेंचाइजी - 10-15 लाख\n\nरिप्लाई: 1-जानकारी, 2-आवेदन, 3-सपोर्ट, 4-ऐप लिंक`,
      img: `फोटो के लिए धन्यवाद! 📸 टीम चेक करेगी।`,
      video: `वीडियो के लिए धन्यवाद! 🎥`,
      app: `📱 *BizMapia App*\nhttps://play.google.com/store/apps/details?id=com.bizmapia.app`
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

        let text = ''
        let isImage =!!msg.message.imageMessage
        let isVideo =!!msg.message.videoMessage
        let isDocument =!!msg.message.documentMessage
        let isLocation =!!msg.message.locationMessage

        if (msg.message.conversation) text = msg.message.conversation
        else if (msg.message.extendedTextMessage?.text) text = msg.message.extendedTextMessage.text
        else if (msg.message.imageMessage?.caption) text = msg.message.imageMessage.caption
        else if (msg.message.videoMessage?.caption) text = msg.message.videoMessage.caption
        else if (msg.message.documentMessage?.caption) text = msg.message.documentMessage.caption

        console.log(`📩 ${isImage?'[IMAGE]':''}${isVideo?'[VIDEO]':''} from ${from}: ${text || 'media'}`)

        const lower = (text || '').toLowerCase().trim()
        const lang = detectLanguage(text)
        const langKey = lang === 'en'? 'en' : lang
        let replyText = ''

        // APP LINK DETECTION
        if (lower.includes('app') || lower.includes('download') || lower.includes('play store') || lower === '4' || text.match(/play\.google\.com|bizmapia/i)) {
          if (lower.includes('app') || lower === '4' || text.includes('play.google.com')) {
            replyText = getReplyByLanguage(langKey, 'app')
          }
        }

        if (!replyText) {
          if (isImage) {
            replyText = getReplyByLanguage(langKey, 'img') + (text? `\nYou wrote: "${text}"` : '')
          } else if (isVideo) {
            replyText = getReplyByLanguage(langKey, 'video')
          } else if (isDocument) {
            replyText = `📄 Document received! Thanks. Reply HI for menu.`
          } else if (isLocation) {
            replyText = `📍 Location received! Thanks. Our team will contact you.\nReply HI for menu.`
          } else if (['hi','hello','hai','hey','hii','namaste','namaskaram'].includes(lower) || lower.startsWith('hi ') || lower.startsWith('hello')) {
            replyText = getReplyByLanguage(langKey, 'menu')
          } else if (lower === '1' || lower.includes('detail')) {
            replyText = langKey==='ml'? `📊 *വിവരങ്ങൾ*\nBusiness Center 1 Lac - Monthly 30k-60k\nDistrict Franchisee 10-15 Lac - Full district rights\nReply 2 to Apply` : `📊 *BizMapia Details*\n1. Business Center 1 Lac - 30k-60k/month\n2. District Franchisee 10-15 Lac\nReply 2 to Apply`
          } else if (lower === '2' || lower.includes('apply') || lower.includes('form')) {
            replyText = `📝 Share:\nFull Name:\nCity:\nPhone:\nInterest:\n\nTeam will call in 24hrs!`
          } else if (lower === '3' || lower.includes('support') || lower.includes('call')) {
            replyText = `📞 Support: +91 85901 75977\n10 AM - 6 PM\nwww.bizmapia.com`
          } else if (text) {
            if (langKey==='ml') replyText = `നന്ദി! "${text}" ലഭിച്ചു 🙏\nHI എന്ന് അയക്കൂ മെനുവിന്.`
            else if (langKey==='hi') replyText = `धन्यवाद! "${text}" मिला 🙏\nHI भेजें मेनू के लिए।`
            else replyText = `Thanks for "${text}" 🙏\nReply *HI* for menu, *4* for App Link\nwww.bizmapia.com`
          }
        }

        if (replyText) {
          await sock.sendMessage(from, { text: replyText })
          console.log(`✅ Replied [${langKey}] to ${from}`)
        }
      } catch (err) {
        console.error('Handler error:', err)
      }
    }
  })
}

app.get('/', (req, res) => {
  res.send(`<h1>BizMapia Bot</h1><p>Status: ${isConnected?'✅ CONNECTED':'⏳ Connecting'} | <a href="/qr">QR</a> | <a href="/clear">Clear</a></p>`)
})

app.get('/qr', async (req, res) => {
  if (isConnected) return res.send('<h1>✅ Connected!</h1>')
  if (!qrCodeData) return res.send('<h1>Wait 5 sec...</h1><script>setTimeout(()=>location.reload(),2000)</script>')
  const qrImage = await qrcode.toDataURL(qrCodeData)
  res.send(`<div style="text-align:center"><h1>Scan QR</h1><img src="${qrImage}" width="350"/><script>setTimeout(()=>location.reload(),15000)</script></div>`)
})

app.get('/clear', (req, res) => {
  try { fs.rmSync('./auth_info', { recursive: true, force: true }) } catch(e){}
  qrCodeData=''; isConnected=false
  res.send('Cleared! Redeploy now')
  setTimeout(()=>process.exit(0),1000)
})

app.listen(PORT, ()=>console.log('Server on '+PORT))
startBot().catch(err => { console.error(err); setTimeout(()=>startBot(),5000) })
