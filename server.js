import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import express from 'express'
import qrcode from 'qrcode'
import fs from 'fs'
import pino from 'pino'

const app = express()
const PORT = process.env.PORT || 10000
let qr = null
let conn = false

async function start(){
  if (!fs.existsSync('./auth_info')) fs.mkdirSync('./auth_info',{recursive:true})
  const {state,saveCreds} = await useMultiFileAuthState('./auth_info')
  const sock = makeWASocket({auth:state,logger:pino({level:'silent'}),browser:['Bot','Chrome','1.0']})
  sock.ev.on('creds.update',saveCreds)
  sock.ev.on('connection.update',u=>{
    if(u.qr){qr=u.qr;console.log('QR')}
    if(u.connection==='open'){conn=true;qr=null;console.log('OPEN')}
    if(u.connection==='close'){conn=false;setTimeout(start,3000)}
  })
  sock.ev.on('messages.upsert',async m=>{
    for(let msg of m.messages){
      if(msg.key.fromMe) continue
      let t = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''
      if(!t) continue
      console.log('MSG:',t)
      await sock.sendMessage(msg.key.remoteJid,{text:'Got: '+t})
    }
  })
}
start()

app.get('/',(req,res)=>res.send('Running <a href="/qr">QR</a> <a href="/clear">Clear</a>'))
app.get('/qr',async(req,res)=>{
  if(conn) return res.send('CONNECTED')
  if(!qr) return res.send('Wait...<script>setTimeout(()=>location.reload(),3000)</script>')
  res.send(`<img src="${await qrcode.toDataURL(qr)}" style="width:300px">`)
})
app.get('/clear',(req,res)=>{
  if(fs.existsSync('./auth_info')) fs.rmSync('./auth_info',{recursive:true,force:true})
  fs.mkdirSync('./auth_info',{recursive:true})
  res.send('Cleared - <a href="/qr">Get QR</a>')
})
app.listen(PORT,()=>console.log(PORT))
