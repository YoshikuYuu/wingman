from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from gemini import generate_rizz, gemini_transcribe
from google import genai
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)
CORS(app)

# Function that recieves data from the front end
@app.route('/rizzify', methods=['POST'])
def rizzify():
    data = request.get_json()
    relationship = data.get('relationship')
    if relationship is None:
        relationship = "acquaintance"
    print(f"Relationship: {f"Relationship: {relationship}"}")
    
    current_message = data.get('current_message')
    if current_message is None:
        current_message = ""
    if current_message is None:
        current_message = ""
    print("Cur msg: " + "Cur msg: " + current_message)

    print(data)

    chat_history_json = data.get('chat_history')[-10:]
    if chat_history_json is None:
        chat_history_json = []
    
    chat_history = []
    for msg in chat_history_json:
        if msg.get('imageSrc') is not None and msg.get('imageSrc') != '':
            chat_history.append({"type": "image", "sender": msg.get('username'), "content": msg.get('imageSrc')})
        elif msg.get('message') is not None and msg.get('message') != '':
            chat_history.append({"type": "text", "sender": msg.get('username'), "content": msg.get('message')})

    chat_history_json = data.get('chat_history')[-10:]
    if chat_history_json is None:
        chat_history_json = []
    
    chat_history = []
    for msg in chat_history_json:
        if msg.get('imageSrc') is not None and msg.get('imageSrc') != '':
            chat_history.append({"type": "image", "sender": msg.get('username'), "content": msg.get('imageSrc')})
        elif msg.get('message') is not None and msg.get('message') != '':
            chat_history.append({"type": "text", "sender": msg.get('username'), "content": msg.get('message')})

    print(chat_history)
    
    
    return_msg = generate_rizz(relationship, chat_history, current_message)
    if return_msg is None:
        return jsonify({"status": "error", "msg": "Failed to generate a message."})
    else:
        return jsonify({"status": "success", "msg": return_msg})

if __name__ == '__main__':

    app.run(port=8000, host="0.0.0.0", debug=True)
