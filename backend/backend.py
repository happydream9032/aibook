import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymysql import NULL
from ask import QuackingDuck
from utils import Utils
from database import Database
from flask_mail import Mail, Message
from cryptography.fernet import Fernet
from random import * 
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'application/json'
CORS(app)

mail= Mail(app)
app.config["MAIL_SERVER"]='smtp.gmail.com'  
app.config["MAIL_PORT"] = 465      
app.config["MAIL_USERNAME"] = 'happydream9032@gmail.com'  
app.config['MAIL_PASSWORD'] = 'ongsknfpdqquzbnd'  
#app.config['MAIL_PASSWORD'] = 'picos20022304' 
app.config['MAIL_USE_TLS'] = False  
app.config['MAIL_USE_SSL'] = True  
mail = Mail(app)  

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
    insert_query_result = mysqlDB.insertDBTableData(data, True)
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
    print(data)
    mysqlDB = Database()
    change_dbdata_result = mysqlDB.changeDBDataByID(data)
    return change_dbdata_result

@app.route('/importdatabook', methods=['POST'])
def importDatabookfile():
    data = request.json
    print(data)
    mysqlDB = Database()
    get_by_hash_result = mysqlDB.getDBTableDataByHash(data)
    
    if get_by_hash_result != []:
        print("get_by_hash_result is",get_by_hash_result[0])
        table_id = get_by_hash_result[0][0]
        req_data = {
            "ID" : table_id,
            "DATA" : data["DATA"]
        }
        print("req data is", req_data)
        final_hash_result = mysqlDB.changeDBDataByID(req_data)
    else:
        final_hash_result = mysqlDB.insertDBTableData(data, False)

    return final_hash_result

@app.route('/signup', methods=['POST'])
def addNewUser():
    data = request.json
    util = Utils()

    if data["TYPE"] == 0:
        mysqlDB = Database()
        getuser_by_email_result = mysqlDB.getUsersbyEmail(data, 0)
        if len(getuser_by_email_result) == 0:
            f = Fernet(os.getenv('ENCRYPT_KEY'))
            encrypted_string = f.encrypt(data["PASSWORD"].encode())
            data["PASSWORD"] = encrypted_string
            addUser_result = mysqlDB.adduser(data, 0)
        else:
             return jsonify({"code" : 403, "message" : "User is exist!"})  
        
    otp = randint(100000,999999)   
    mail_message = Message('Hello from the other side!', sender = 'happydream9032@gmail.com', recipients = [data['EMAIL']])
    mail_message.body = "OTP of your account is" + str(otp)

    get_user_by_emal_result = mysqlDB.getUsersbyEmail(data, 0)
    if len(get_user_by_emal_result) > 0:
        token = util.generate_otp_token(get_user_by_emal_result[0][2])
        update_otp_result = mysqlDB.updateOTPbyEmail(otp, get_user_by_emal_result[0][0])
        mail.send(mail_message)
        return jsonify({"code" : 200, "data" : token, "message" : "generate new token"}) 
    else:
        return jsonify({"code" : 401, "message" : "token generate fail!"})  

@app.route('/signin', methods=['POST'])
def signinUser():
    data = request.json
    print(data)
    util = Utils()
    mysqlDB = Database()
    signin_result = mysqlDB.signinUser(data)
    if len(signin_result) > 0 :
        token = util.generate_user_token(signin_result[0][2])
        response_data = {"user" : signin_result, "token" : token}
        return jsonify({"code" : 200, "data" : response_data, "message" : "generate new token"}) 
    elif len(signin_result) == 0:
        return jsonify({"code" : 403, "message" : "User not exists"})
    else:
        return jsonify({"code" : 400, "message" : "Login Failure"})
    
@app.route('/changepassword', methods=['POST'])
def changePassword():
    data = request.json
    print(data)
    mysqlDB = Database()
    changepwd_result = mysqlDB.changePassword(data)
    return changepwd_result

@app.route('/getuserbyitem', methods=['POST'])
def getUserbyItem():
    data = request.json
    print(data)
    mysqlDB = Database()
    signin_result = mysqlDB.getUserbyItem(data)
    return signin_result

@app.route('/deleteuser', methods=['POST'])
def deleteUser():
    data = request.json
    print(data)
    mysqlDB = Database()
    delete_user_result = mysqlDB.deleteUser(data)
    return delete_user_result

@app.route('/verify', methods=['POST'])
def verifyEmail():
    data = request.json
    print(data)
    util = Utils()
    mysqlDB = Database()

    decoded_data = util.validate_token(data["TOKEN"])
    if decoded_data == "403":
        return jsonify({"code" : 403, "message" : "token generate fail!"}) 
    elif decoded_data == "401":
        return jsonify({"code" : 401, "message" : "token is expired"})
    else: 
        validate_user_result = mysqlDB.verifyEmailAddress(decoded_data)
        if len(validate_user_result) > 0:
            validate_success_result = mysqlDB.validateSuccess(validate_user_result[0][0])
            return jsonify({"code" : 200, "data": validate_user_result, "message" : "generate new token"}) 
        else:
            return jsonify({"code" : 403, "message" : "token generate fail!"}) 

@app.route('/googlelogin', methods=['POST'])
def googleLogin():
    data = request.json
    print(data)
    util = Utils()
    mysqlDB = Database()
    get_user_by_emal_result = mysqlDB.getUsersbyEmail(data, 1)
    if len(get_user_by_emal_result) == 0:
        addUser_result = mysqlDB.adduser(data, 1)
    
    get_user_by_emal_result1 = mysqlDB.getUsersbyEmail(data, 1)
    if len(get_user_by_emal_result1) > 0:
        token = util.generate_user_token(get_user_by_emal_result1[0][2])
        response_data = {"id" : get_user_by_emal_result1[0][0], "token" : token}
        return jsonify({"code" : 200, "data" : response_data, "message" : "google user is registerd"}) 
    else:
        return jsonify({"code" : 401, "message" : "token generate fail!"})  

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
