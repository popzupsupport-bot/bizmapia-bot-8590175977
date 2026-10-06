from flask import Flask, request
import requests, os, json

app = Flask(__name__)

VERIFY_TOKEN = os.getenv("VERIFY_TOKEN", "bizmapia_official_123")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")

@app.route("/")
def home():
    return "Bizmapia Bot Live - OK", 200

@app.route("/webhook", methods=["GET"])
def verify():
    mode = request.args.get("hub.mode")
    token = request.args.get("hub.verify_token")
    challenge = request.args.get("hub.challenge")
    if mode == "subscribe" and token == VERIFY_TOKEN:
        return challenge, 200
    return "Forbidden", 403

@app.route("/webhook", methods=["POST"])
def webhook():
    data = request.get_json()
    print(f"INCOMING: {json.dumps(data)}")
    try:
        entry = data['entry'][0]['changes'][0]['value']
        if 'messages' in entry:
            msg = entry['messages'][0]
            from_number = msg['from']
            text = msg.get('text', {}).get('body', '').lower()
            if "hi" in text or "hello" in text:
                reply = "Hi! Welcome to Bizmapia 👋\n\n1. Franchise Enquiry\n2. Location Availability\n3. Investment Details\n4. Talk to Team\n\nReply with number (1-4)"
            elif text == "1":
                reply = "Great! Please share Name, City & Budget."
            elif text == "2":
                reply = "Please share your city/district."
            elif text == "3":
                reply = "Franchise starts from 5L to 25L. Which model interests you?"
            else:
                reply = f"You said: {text}\nReply Hi for menu."
            send_whatsapp(from_number, reply)
    except Exception as e:
        print(f"Error: {e}")
    return "OK", 200

def send_whatsapp(to, body):
    url = f"https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages"
    headers = {"Authorization": f"Bearer {WHATSAPP_TOKEN}", "Content-Type": "application/json"}
    payload = {"messaging_product": "whatsapp","to": to,"type": "text","text": {"body": body}}
    r = requests.post(url, headers=headers, json=payload)
    print(f"Reply status: {r.status_code} {r.text}")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
