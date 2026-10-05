import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import express from 'express'
import qrcode from 'qrcode'
import fs from 'fs'
import pino from 'pino'

const app = express()
const PORT = process.env.PORT || 10000
const AUTH = './auth_info'
let qr = null
let sock = null
let connected = false

if (!fs.existsSync(AUTH)) fs.mkdirSync(AUTH, { recursive: true })

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH)
  sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['Bot', 'Chrome', '1.0'],
    syncFullHistory: false
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (u) => {
    if (u.qr) { qr = u.qr; console.log('QR READY') }
    if (u.connection === 'open') { connected = true; qr = null; console.log('CONNECTED!') }
    if (u.connection === 'close') { connected = false; setTimeout(start, 3000) }
  })
  sock.ev.on('messages.upsert', async (m) => {
    console.log('MESSAGE EVENT!')
    for (let msg of m.messages) {
      if (msg.key.fromMe) continue
      if (!msg.message) continue
      let text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''
      if (!text) continue
      let from = msg.key.remoteJid
      console.log(`Got: ${text} from ${from}`)
      await sock.sendMessage(from, { text: `I got your message: ${text}` })
      console.log('Replied!')
    }
  })
}
start()

app.get('/', (req,res)=>res.send('Simple Bot Running'))
app.get('/qr', async (req,res)=>{
  if (connected) return res.send('Already Connected')
  if (!qr) return res.send('Wait 5 sec... <script>setTimeout(()=>location.reload(),3000)</script>')
  let img = await qrcode.toDataURL(qr)
  res.send(`<img src="${img}" style="width:300px"><br>Scan now`)
})
app.get('/clear', (req,res)=>{
  if (fs.existsSync(AUTH)) fs.rmSync(AUTH,{recursive:true,force:true})
  fs.mkdirSync(AUTH,{recursive:true})
  res.send('Cleared')
})
app.listen(PORT, ()=>console.log('Server '+PORT))
