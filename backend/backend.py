from flask import Flask, request, jsonify
from flask_cors import CORS
from ask import QuackingDuck
from flask_cors import cross_origin
import json

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'application/json'
CORS(app)

@app.route('/runprompt', methods=['POST'])
def runprompt():
    data = request.json
    print("data is", data)
    schema = data["schema"]
    prompt = data["prompt"]
    model_type = data["model"]

    model = "gpt-3.5-turbo"

    quack = QuackingDuck(schema, model)
    quack.explain_content()

    sql_query = quack.ask(prompt, debug=True)
    result_query = sql_query.replace('"', "'")
    print("sql_query is === ", result_query)
    return result_query

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
