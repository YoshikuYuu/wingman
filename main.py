from flask import Flask, jsonify, render_template, request
from wingman import *

app = Flask(__name__, static_url_path='/static')

@app.route('/')
@app.route('/wingman')
def wingman():
    return render_template('index.html')

# Function that recieves data from the front end
@app.route('/apply_rizz', methods=['POST'])
def apply_rizz():
    data = request.get_json()
    
    history = data.get('history')
    current_message = data.get('current_message')
    me_id = data.get('me_id')

    return_msg = api_call(history, current_message, me_id)
    return jsonify({"msg": return_msg})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81)