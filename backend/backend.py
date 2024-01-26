from flask import Flask, request, jsonify
from flask_cors import CORS
from ask import QuackingDuck
from database import Database
from flask_cors import cross_origin
import json

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'application/json'
CORS(app)

@app.route('/runprompt', methods=['POST'])
def runPrompt():
    data = request.json

    schema = data["schema"]
    prompt = data["prompt"]
    model_type = data["model"]

    model = "gpt-3.5-turbo"

    quack = QuackingDuck(schema, model)
    quack.explain_content()

    sql_query = quack.ask(prompt, debug=True)
    result_query = sql_query.replace('"', "'")
    print("sql_query is === ", sql_query)
    return sql_query

@app.route('/getdbtable', methods=['POST'])
def getDBTable():
    mysqlDB = Database()
    select_query_result = mysqlDB.getDBTableData()
    return select_query_result

@app.route('/insertdbtable', methods=['POST'])
def insertDBTable():
    data = request.json
    print("insert data is", data)
    mysqlDB = Database()
    insert_query_result = mysqlDB.insertDBTableData(data)
    if insert_query_result != "" :
        return insert_query_result
    
@app.route('/deletedbtable', methods=['POST'])
def deleteDBTable():
    data = request.json
    print("delete data is", data)
    mysqlDB = Database()
    delete_query_result = mysqlDB.deleteDBTableData(data)
    if delete_query_result != "" :
        return delete_query_result
    
@app.route('/getdbbyhash', methods=['POST'])
def getDBByHash():
    data = request.json
    print("get db data is", data)
    mysqlDB = Database()
    select_query_byhash_result = mysqlDB.getDBTableDataByHash(data)
    return select_query_byhash_result

@app.route('/changedbname', methods=['POST'])
def changeDBName():
    data = request.json
    mysqlDB = Database()
    change_dbname_result = mysqlDB.changeDBNameByID(data)
    return change_dbname_result

@app.route('/changedbdata', methods=['POST'])
def changeDBData():
    data = request.json
    mysqlDB = Database()
    change_dbdata_result = mysqlDB.changeDBDataByID(data)
    return change_dbdata_result

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
