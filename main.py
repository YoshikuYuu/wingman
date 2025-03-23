from flask import Flask, jsonify, render_template, request
from gemini import generate_rizz

app = Flask(__name__, static_url_path='/static')

@app.route('/')
@app.route('/wingman')
def wingman():
    return render_template('index.html')

# Function that recieves data from the front end
@app.route('/rizzify', methods=['POST'])
def rizzify():
    # data = request.get_json()

    # Test data
    data = {
        "relationship": "friend",
        "current_message": "Hey, how are you doing?",
        "chat_history": [
            {
                "type": "text",
                "sender": "user",
                "content": "Hey, how are you doing?"
            },
            {
                "type": "text",
                "sender": "recipient",
                "content": "I'm good, how about you?"
            }
        ]
    }

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

if __name__ == '__main__':
    # app.run(port=8000, host="0.0.0.0", debug=True)
    rizzify()
