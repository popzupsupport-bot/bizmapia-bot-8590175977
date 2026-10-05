import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import express from 'express'
import qrcode from 'qrcode'
import fs from 'fs'
import path from 'path'
import pino from 'pino'

const app = express()
const PORT = process.env.PORT || 10000
const AUTH_FOLDER = './auth_info'
let qrCodeData = null
let sock = null
let isConnected = false

// Ensure auth folder exists
if (!fs.existsSync(AUTH_FOLDER)) fs.mkdirSync(AUTH_FOLDER, {recursive:true})

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER)
  
  sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    shouldIgnoreJid: jid => false,
    getMessage: async () => undefined
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) {
      qrCodeData = qr
      console.log('QR Generated - Scan now!')
    }
    if (connection === 'open') {
      isConnected = true
      qrCodeData = null
      console.log('✅ 8590175977 Connected! READY TO REPLY')
    }
    if (connection === 'close') {
      isConnected = false
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log('Closed:', reason)
      if (reason !== DisconnectReason.loggedOut) {
        setTimeout(startBot, 3000)
      } else {
        console.log('Logged out - Need new QR')
        if (fs.existsSync(AUTH_FOLDER)) fs.rmSync(AUTH_FOLDER, {recursive:true, force:true})
        setTimeout(startBot, 3000)
      }
    }
  })

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    try {
      if (type !== 'notify') return
      for (let msg of messages) {
        if (!msg.message) continue
        if (msg.key.fromMe) continue
        
        const from = msg.key.remoteJid
        if (from === 'status@broadcast') continue
        
        // Ignore decryption failures
        let text = ''
        try {
          text = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply?.selectedRowId || ''
        } catch (e) {
          console.log('Ignoring decrypt fail for', from)
          continue
        }
        
        if (!text) continue
        const clean = text.trim().toLowerCase()
        console.log(`📩 FROM ${from}: ${text}`)

        // BIZMAPIA MENU LOGIC
        let reply = ''
        if (['hi','hello','hey','menu','start'].includes(clean)) {
          reply = `Hi 👋 Welcome to BizMapia!\n\n1️⃣ Business Center - 1 Lac\n2️⃣ Business Registration\n3️⃣ Driver Registration\n4️⃣ Customer Care\n5️⃣ Business Opportunity\n\nReply with number (1-5)`
        } else if (clean === '1') {
          reply = `🏢 *Business Center - 1 Lac*\nInvestment: Rs 1,00,000\nEarning: 30k-50k/month\n\nType *YES* to know more`
        } else if (clean === '2') {
          reply = `📝 *Business Registration*\nSend your:\nName, Place, Business Type`
        } else if (clean === '3') {
          reply = `🚗 *Driver Registration*\nSend License + Vehicle details`
        } else if (clean === '4') {
          reply = `📞 *Customer Care*: 8590175977\nWe will call you soon!`
        } else if (clean === '5') {
          reply = `💼 *Business Opportunity*\nGreat income with BizMapia! Type *DETAILS*`
        } else {
          reply = `Thanks for messaging BizMapia! 🙏\nType *Hi* to see menu`
        }

        try {
          await sock.sendMessage(from, { text: reply })
          console.log(`✅ REPLIED to ${from}`)
        } catch (err) {
          console.log('Send failed:', err.message)
        }
      }
    } catch (err) {
      // GLOBAL IGNORE - This fixes Bad MAC crash
      if (err.message && err.message.includes('Bad MAC')) {
        console.log('⚠️ Ignored Bad MAC - continuing...')
        return
      }
      console.log('upsert error ignored:', err.message)
    }
  })
}

app.get('/', (req,res) => res.send(`Bot ${isConnected ? '✅ Connected' : '⏳ Not Connected'} - <a href="/qr">QR</a> | <a href="/clear">Clear</a>`))

app.get('/qr', async (req,res) => {
  if (isConnected) return res.send('<h1>✅ Already Connected! Ready to reply</h1>')
  if (!qrCodeData) return res.send('<h1>⏳ Generating QR... refresh after 5 sec</h1><script>setTimeout(()=>location.reload(),3000)</script>')
  const qrImg = await qrcode.toDataURL(qrCodeData)
  res.send(`<h1>Scan with 8590175977</h1><img src="${qrImg}" width="300"><br><script>setTimeout(()=>location.reload(),20000)</script>`)
})

app.get('/clear', (req,res) => {
  try {
    if (fs.existsSync(AUTH_FOLDER)) fs.rmSync(AUTH_FOLDER, {recursive:true, force:true})
    fs.mkdirSync(AUTH_FOLDER, {recursive:true})
    qrCodeData = null
    isConnected = false
    res.send('Cleared! Now go to /deploy on Render then /qr')
  } catch (e) {
    res.send('Clear error: '+e.message)
  }
})

app.listen(PORT, () => {
  console.log(`Server on ${PORT}`)
  startBot()
})
