from google import genai

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/get_data', methods=['POST'])
def get_data():
    data = request.get_json()
    filename = str(data.get('filename'))
    client = genai.Client(api_key="AIzaSyByfScdoYEExsECaBOvaHqXEgOfI19uBOA")

    myfile = client.files.upload(file=filename)
    prompt = 'Generate a transcript of the speech.'

    response = client.models.generate_content(
      model='gemini-2.0-flash',
      contents=[prompt, myfile]
    )

    print(response.text)

    return jsonify({'message': 'Hello from Flask!'}), 200

if __name__ == '__main__':
    app.run(debug=True)