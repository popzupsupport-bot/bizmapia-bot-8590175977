from flask import Flask, request
import os, requests

app = Flask(__name__)

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "bizmapia123")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
PHONE_ID = os.getenv("PHONE_NUMBER_ID")

@app.route("/")
def home():
    return "Bot is live!"

@app.route("/webhook", methods=["GET", "POST"])
def webhook():
    if request.method == "GET":
        token = request.args.get("hub.verify_token")
        challenge = request.args.get("hub.challenge")
        if token == VERIFY_TOKEN:
            return challenge, 200
        return "Wrong token", 403

    if request.method == "POST":
        print("=== WEBHOOK POST RECEIVED ===")
        print(request.json)
        data = request.json
        try:
            for entry in data.get("entry", []):
                for change in entry.get("changes", []):
                    value = change.get("value", {})
                    messages = value.get("messages", [])
                    if messages:
                        msg = messages[0]
                        from_num = msg["from"]
                        text = msg.get("text", {}).get("body", "Hi").lower()

                        print(f"Message from {from_num}: {text}")

                        # Reply
                        url = f"https://graph.facebook.com/v20.0/{PHONE_ID}/messages"
                        headers = {"Authorization": f"Bearer {ACCESS_TOKEN}", "Content-Type": "application/json"}
                        payload = {
                            "messaging_product": "whatsapp",
                            "to": from_num,
                            "text": {"body": f"Hello! You said: {text}\n\nBot is WORKING! 🎉\nType: menu"}
                        }
                        r = requests.post(url, headers=headers, json=payload)
                        print(f"Reply status: {r.status_code} {r.text}")
        except Exception as e:
            print(f"Error: {e}")
        return "OK", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
