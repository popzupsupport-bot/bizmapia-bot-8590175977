import os, requests
from flask import Flask, request

app = Flask(__name__)

# YOUR CREDENTIALS - Will be set in Render ENV
VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "bizmapia_official_123")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID", "1244468008759305")
VERSION = "v20.0"

def send_whatsapp(to, text):
    url = f"https://graph.facebook.com/{VERSION}/{PHONE_NUMBER_ID}/messages"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}", "Content-Type": "application/json"}
    data = {
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text}
    }
    r = requests.post(url, headers=headers, json=data)
    print(r.text)
    return r

@app.route("/")
def home():
    return "Bizmapia Official Bot Running - +91 70256 30644"

@app.route("/webhook", methods=["GET"])
def verify():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")
    if mode == "subscribe" and token == VERIFY_TOKEN:
        return challenge, 200
    return "Verification failed", 403

@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json()
    try:
        if data["object"] == "whatsapp_business_account":
            for entry in data["entry"]:
                for change in entry["changes"]:
                    if change["field"] == "messages":
                        value = change["value"]
                        if "messages" in value:
                            msg = value["messages"][0]
                            from_number = msg["from"]
                            msg_text = msg.get("text", {}).get("body", "").lower()

                            print(f"From {from_number}: {msg_text}")

                            # === BIZMAPIA BOT LOGIC ===
                            if "hi" in msg_text or "hello" in msg_text or "hey" in msg_text:
                                reply = "👋 Welcome to *Bizmapia*!\n\nYour Local Business Discovery Platform\n\n1️⃣ Search Business\n2️⃣ Add Business\n3️⃣ Support\n\nReply with number!"
                            elif msg_text == "1":
                                reply = "🔍 Send me Business Name or Category (e.g., 'Restaurant in Mannarkkad')"
                            elif msg_text == "2":
                                reply = "➕ To add your business, visit: https://bizmapia.com/add-business"
                            elif msg_text == "3":
                                reply = "📞 Support: +91 70256 30644\n🌐 Website: bizmapia.com"
                            else:
                                reply = f"You said: {msg_text}\n\nReply *HI* for main menu."

                            send_whatsapp(from_number, reply)
    except Exception as e:
        print(f"Error: {e}")

    return "OK", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
