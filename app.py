import os
import requests
from flask import Flask, request

app = Flask(__name__)

# --- Load from Render Environment (NEVER hardcode tokens here) ---
VERIFY_TOKEN = os.environ.get("VERIFY_TOKEN", "popzup123")
ACCESS_TOKEN = os.environ.get("ACCESS_TOKEN", "")
PHONE_ID = os.environ.get("PHONE_NUMBER_ID", "")
# Meta API Version
API_VERSION = "v20.0"

@app.route("/", methods=["GET"])
def home():
    return "Bot is live! - PopzUp / Bizmapia", 200

@app.route("/webhook", methods=["GET"])
def verify_webhook():
    # For Meta verification
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")

    if mode == "subscribe" and token == VERIFY_TOKEN:
        print("WEBHOOK VERIFIED!")
        return challenge, 200
    else:
        return "Verification failed", 403

@app.route("/webhook", methods=["POST"])
def webhook():
    try:
        data = request.get_json()
        print(f"WEBHOOK POST RECEIVED: {data}")

        if not data:
            return "OK", 200

        for entry in data.get("entry", []):
            for change in entry.get("changes", []):
                value = change.get("value", {})
                messages = value.get("messages", [])

                if not messages:
                    continue

                msg = messages[0]
                from_num = msg.get("from")
                msg_type = msg.get("type")

                if msg_type == "text":
                    text = msg.get("text", {}).get("body", "").lower().strip()
                    print(f"Message from {from_num}: {text}")

                    # Simple reply logic
                    if text in ["hi", "hello", "hey", "menu", "start"]:
                        reply_text = "👋 Welcome to PopzUp / Bizmapia!\n\n✅ Bot is WORKING!\n\nType:\n1. menu\n2. help\n3. test"
                    else:
                        reply_text = f"Hello!! You said: {text}\n\nBot is WORKING! 🤖\n\nType: menu"

                    # Send reply
                    url = f"https://graph.facebook.com/{API_VERSION}/{PHONE_ID}/messages"
                    headers = {
                        "Authorization": f"Bearer {ACCESS_TOKEN}",
                        "Content-Type": "application/json"
                    }
                    payload = {
                        "messaging_product": "whatsapp",
                        "to": from_num,
                        "type": "text",
                        "text": {"body": reply_text}
                    }

                    r = requests.post(url, headers=headers, json=payload)
                    print(f"Reply status: {r.status_code} {r.text}")

    except Exception as e:
        print(f"Error: {e}")

    return "OK", 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    print(f"Starting on port {port}")
    app.run(host="0.0.0.0", port=port)
