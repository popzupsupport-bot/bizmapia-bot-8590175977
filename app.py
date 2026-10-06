from flask import Flask, request
import os, requests

app = Flask(__name__)

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "bizmapia_official_123")
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")

@app.route("/")
def home():
    return "Bot is live! Bizmapia"

@app.route("/webhook", methods=["GET"])
def verify():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")
    if mode == "subscribe" and token == VERIFY_TOKEN:
        print(f"✅ WEBHOOK VERIFIED")
        return challenge, 200
    return "Verification failed", 403

@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json()
    print(f"📩 INCOMING: {data}") # This will now show in Render Logs

    try:
        entry = data["entry"][0]["changes"][0]["value"]
        if "messages" in entry:
            msg = entry["messages"][0]
            from_num = msg["from"]
            text = msg["text"]["body"]
            print(f"From {from_num}: {text}")

            # Reply
            url = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"
            headers = {"Authorization": f"Bearer {WHATSAPP_TOKEN}", "Content-Type": "application/json"}
            payload = {
                "messaging_product": "whatsapp",
                "to": from_num,
                "text": {"body": f"You said: {text}\n\nBizmapia bot is working! 🚀"}
            }
            r = requests.post(url, headers=headers, json=payload)
            print(f"Reply status: {r.status_code} {r.text}")
    except Exception as e:
        print(f"Error: {e}")

    return "OK", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
