from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from gemini import generate_rizz, gemini_transcribe
from google import genai

app = Flask(__name__)
CORS(app)

# Function that recieves data from the front end
@app.route('/rizzify', methods=['POST'])
def rizzify():
    data = request.get_json()

    relationship = data.get('relationship')
    if relationship is None:
        relationship = "acquaintance"
    print(relationship)
    
    current_message = data.get('current_message')
    print(current_message)

    chat_history = data.get('chat_history')
    print(chat_history)

    return_msg = generate_rizz(relationship, chat_history, current_message)
    if return_msg is None:
        return jsonify({"status": "error", "msg": "Failed to generate a message."})
    else:
        return jsonify({"status": "success", "msg": return_msg})

@app.route('/audio_advice', methods=['POST'])
def audio_advice():
    data = request.get_json()
    relationship = data.get('relationship')

    filename = str(data.get('filename'))
    transcription = gemini_transcribe(filename)

    chat_history = [{'type': 'text', 'sender': str(relationship), 'content': str(transcription)}]

    return_msg = generate_rizz(relationship, chat_history)
    if return_msg is None:
        return jsonify({"status": "error", "msg": "Failed to generate a message."})
    else:
        return jsonify({"status": "success", "msg": return_msg})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81)
    