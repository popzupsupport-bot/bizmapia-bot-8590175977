import makeWASocket from '@whiskeysockets/baileys'
import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import express from 'express'
import qrcode from 'qrcode'
import fs from 'fs'
import pino from 'pino'

const app = express()
const PORT = process.env.PORT || 10000
let qrCodeData = ''
let sock = null
let isConnected = false

async function startBot() {
  const { version } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  sock = makeWASocket({
    version, auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['BizMapia', 'Chrome', '1.0'],
    markOnlineOnConnect: true,
    retryRequestDelayMs: 500
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) { qrCodeData = qr; isConnected = false; console.log('NEW QR at /qr') }
    if (connection === 'close') {
      isConnected = false
      const code = lastDisconnect?.error?.output?.statusCode
      console.log('Closed:', code)
      if (code !== DisconnectReason.loggedOut) setTimeout(startBot, 3000)
      else {
        try{fs.rmSync('./auth_info',{recursive:true,force:true})}catch(e){}
        qrCodeData=''; setTimeout(startBot,2000)
      }
    } else if (connection === 'open') {
      isConnected = true; qrCodeData=''; console.log('✅ 8590175977 Connected! READY TO REPLY')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      try {
        if (!msg.message) continue
        if (msg.key.fromMe) continue
        const from = msg.key.remoteJid
        if (from.endsWith('@g.us')) continue
        if (from === 'status@broadcast') continue

        let text = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || msg.message.documentMessage?.caption || ''
        let isImage = !!msg.message.imageMessage
        let isVideo = !!msg.message.videoMessage
        
        console.log(`📩 FROM ${from}: ${text || (isImage?'[IMAGE]':'[VIDEO]')}`)

        let reply = ''
        const lower = text.toLowerCase()
        const isML = /[\u0D00-\u0D7F]/.test(text)

        if (isImage) reply = isML ? 'ഫോട്ടോയ്ക്ക് നന്ദി! 📸 Team check ചെയ്യും. HI എന്ന് അയക്കൂ' : 'Thanks for image 📸 Team will check. Reply HI for menu'
        else if (isVideo) reply = isML ? 'വീഡിയോയ്ക്ക് നന്ദി! 🎥 ലഭിച്ചു' : 'Thanks for video 🎥 Received! Reply HI'
        else if (lower.includes('app') || lower === '4' || lower.includes('download')) reply = `📱 *BizMapia App*\nhttps://play.google.com/store/apps/details?id=com.bizmapia.app\nwww.bizmapia.com`
        else if (['hi','hello','hai','hey'].includes(lower) || lower.startsWith('hi')) {
          reply = isML ? `ഹായ് 👋 *BizMapia* സ്വാഗതം!\n1️⃣ Business Center - 1 Lac\n2️⃣ District Franchisee - 10-15 Lac\nറിപ്ലൈ: 1-വിവരം, 2-അപേക്ഷ, 4-ആപ്പ്` : `Hi 👋 Welcome to *BizMapia*!\n1️⃣ Business Center - 1 Lac\n2️⃣ District Franchisee - 10-15 Lac\nReply: 1-Details, 2-Apply, 3-Support, 4-App Link\nwww.bizmapia.com`
        } else if (text) reply = `Thanks for "${text}" 🙏 Our team will reply soon!\nReply *HI* for menu, *4* for App Link`
        else reply = `Hi 👋 Welcome to BizMapia! Reply HI`

        if (reply) {
          await sock.sendMessage(from, { text: reply })
          console.log(`✅ REPLIED to ${from}`)
        }
      } catch (e) {
        if (e.message && e.message.includes('Bad MAC')) {
          console.log('⚠️ Ignored Bad MAC old msg')
          continue
        }
        console.error('Reply error:', e.message)
      }
    }
  })
}

app.get('/', (req,res)=>res.send(`<h1>BizMapia Bot ${isConnected?'✅ CONNECTED':'⏳'}</h1><a href="/qr">QR</a> | <a href="/clear">Clear</a>`))
app.get('/qr', async (req,res)=>{
  if (isConnected) return res.send('<h1>✅ Connected! Ready to test from 95677</h1>')
  if (!qrCodeData) return res.send('Generating QR...<script>setTimeout(()=>location.reload(),2000)</script>')
  const img = await qrcode.toDataURL(qrCodeData)
  res.send(`<center><img src="${img}" width="350"/><p>Scan with 85901 phone</p></center><script>setTimeout(()=>location.reload(),15000)</script>`)
})
app.get('/clear', (req,res)=>{
  try{fs.rmSync('./auth_info',{recursive:true,force:true})}catch(e){}
  qrCodeData=''; isConnected=false
  res.send('<h1>Cleared! Now go Render > Manual Deploy > Clear cache & Deploy</h1>')
  setTimeout(()=>process.exit(0),800)
})
app.listen(PORT, ()=>console.log('Server '+PORT))
startBot().catch(e=>{ console.error(e); setTimeout(startBot,3000) })
