import os
import hashlib
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from pymysql import NULL
from ask import QuackingDuck
from utils import Utils
from miniodemo import MinIODemo
from database import Database
from flask_mail import Mail, Message
from random import * 
from dotenv import load_dotenv
from gevent.pywsgi import WSGIServer

load_dotenv()

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'application/json'
CORS(app)

mail= Mail(app)

app.config['MAIL_SERVER']= os.getenv('EMAIL_SERVER')
app.config["MAIL_PORT"] = 465  
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = os.getenv('SENDER_EMAIL')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
# app.config["SECRET_KEY"] = 'top-secret!'  
#app.config['MAIL_PASSWORD'] = 'vinpjvdslfigvoqu'  
# app.config['MAIL_USERNAME'] = 'apikey'
# app.config['MAIL_PASSWORD'] = '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'
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
    data = request.json
    select_query_result = mysqlDB.getDBTableData(data)
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
    mysqlDB = Database()
    getuser_by_email_result = mysqlDB.getUsersbyEmail(data, 3)
    if len(getuser_by_email_result) == 0:
        hash_value = hashlib.md5(data["PASSWORD"].encode()).hexdigest()
        data["PASSWORD"] = hash_value
        addUser_result = mysqlDB.adduser(data, 0)
        otp = randint(100000,999999)   
        mail_message = Message('Hello from the databook.ai!', sender = os.getenv('SENDER_EMAIL'), recipients = [data['EMAIL']])
        mail_message.body = "OTP of your account is -" + str(otp)
        print("sdfsd")
        mail.send(mail_message)
        get_user_by_emal_result = mysqlDB.getUsersbyEmail(data, 3)
        if len(get_user_by_emal_result) > 0:
            token = util.generate_otp_token(get_user_by_emal_result[0][2])
            update_otp_result = mysqlDB.updateOTPbyEmail(otp, get_user_by_emal_result[0][0])
            return jsonify({"code" : 200, "data" : token, "message" : "generate new token"}) 
        else:
            return jsonify({"code" : 401, "message" : "token generate fail!"})
    else:
        return jsonify({"code" : 403, "message" : "User is exist!"})
      
@app.route('/resetOTPcode', methods=['POST'])
def resetOTPCode():
    data = request.json
    mysqlDB = Database()
    util = Utils()

    otp = randint(100000,999999)   
    print(str(otp), data["EMAIL"])
    mail_message = Message('Hello from the databook.ai!', sender = os.getenv('SENDER_EMAIL'), recipients = [data['EMAIL']])
    mail_message.body = "OTP of your account is -" + str(otp)

    get_user_by_emal_result = mysqlDB.getUsersbyEmail(data, 3)
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
    signin_result = mysqlDB.getUsersbyEmail(data, 2)
    if len(signin_result) > 0 :
        token = util.generate_user_token(signin_result[0][2])
        response_data = {"user" : signin_result, "token" : token}
        print("signin user is", response_data)
        return jsonify({"code" : 200, "data" : response_data, "message" : "generate new token"}) 
    elif len(signin_result) == 0:
        return jsonify({"code" : 403, "message" : "User not exists"})
    else:
        return jsonify({"code" : 400, "message" : "Login Failure"})
    
@app.route('/changepassword', methods=['POST'])
def changePassword():
    data = request.json
    mysqlDB = Database()
    encrypted_string = hashlib.md5(data["CURRENT_PASSWORD"].encode()).hexdigest()

    get_allusers_by_id = mysqlDB.getAllUsersById(0, data["ID"])
    print(get_allusers_by_id[0][3], encrypted_string)

    if get_allusers_by_id[0][3] == encrypted_string:
        encrypted_string1 = hashlib.md5(data["NEW_PASSWORD"].encode()).hexdigest()
        changepwd_result = mysqlDB.changeUserPassword(encrypted_string1, data["ID"])
        return jsonify({"code" : 200, "data" : encrypted_string1,"message" : "Changing password is successful!"})
    else:
        return jsonify({"code" : 401, "message" : "can't find user data"}) 

@app.route('/getUsersbyEmail', methods=['POST'])
def getUsersbyEmail():
    data = request.json
    print(data)
    mysqlDB = Database()
    signin_result = mysqlDB.getUsersbyEmail(data, 3)
    return signin_result

@app.route('/getUsersbyID', methods=['POST'])
def getUsersbyID():
    data = request.json
    print(data)
    mysqlDB = Database()
    signin_result = mysqlDB.getUserByID(data)
    return signin_result

@app.route('/deleteuser', methods=['POST'])
def deleteUser():
    data = request.json
    mysqlDB = Database()
    get_allusers_by_id = mysqlDB.getUsersbyEmail(data, 3)
    if len(get_allusers_by_id) > 0:
        for i in range(len(get_allusers_by_id)):
            delete_user_result = mysqlDB.deleteUserData(get_allusers_by_id[i][0])
        return jsonify({"code" : 200, "message" : "generate new token"}) 
    else:
        return jsonify({"code" : 401, "message" : "Can't find user data"})
    
@app.route('/verify', methods=['POST'])
def verifyEmail():
    data = request.json
    print(data)
    util = Utils()
    mysqlDB = Database()

    decoded_data = util.validate_token(data["TOKEN"])
    if decoded_data == "403":
        return jsonify({"code" : 403, "message" : "token generate fail!"}) 
    # elif decoded_data == "401":
    #     return jsonify({"code" : 401, "message" : "token is expired"})
    else: 
        validate_user_result = mysqlDB.verifyEmailAddress(decoded_data)
        if len(validate_user_result) > 0:
            for i in range(len(validate_user_result)):
                validate_success_result = mysqlDB.validateSuccess(validate_user_result[i][0])
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
        encrypted_string = hashlib.md5(data["PASSWORD"].encode()).hexdigest()
        data["PASSWORD"] = encrypted_string
        addUser_result = mysqlDB.adduser(data, 1)
    
        get_user_by_emal_result1 = mysqlDB.getUsersbyEmail(data, 1)
        if len(get_user_by_emal_result1) > 0:
            token = util.generate_user_token(get_user_by_emal_result1[0][2])
            response_data = {"id" : get_user_by_emal_result1[0][0], "token" : token}
            print(response_data,"<<<<<<<<<<<")
            return jsonify({"code" : 200, "data" : response_data, "message" : "google user is registerd"}) 
        else:
            return jsonify({"code" : 401, "message" : "token generate fail!"})  
    else:
        return jsonify({"code" : 403, "message" : "User is already existed"})   

@app.route('/changeavatar', methods=['POST', 'GET'])
def changeAvatar():
    data = request.json
    mysqlDB = Database()
    get_allusers_by_id = mysqlDB.getAllUsersById(0, data["ID"])
    if len(get_allusers_by_id) > 0:
        for i in range(len(get_allusers_by_id)):
            upload_file_result = mysqlDB.uploadfile(get_allusers_by_id[i][0], data["FILENAME"])
        return jsonify({"code" : 200, "message" : "File uploaded successfully"}) 
    else :
        return jsonify({"code" : 401, "message" : "can't find user data"})

@app.route('/uploads', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part in the request', 400
    file = request.files['file']

    if file.filename == '':
        return 'No selected image file', 400
    if file:
        file.save('uploads/' + file.filename)
        return jsonify({"code" : 200, "message" : "File uploaded successfully"}) 
    else:
        return jsonify({"code" : 401, "message" : "Can't upload image"})

@app.route('/files/<filename>', methods=['POST', 'GET'])
def get_uploaded_file(filename):
    return send_from_directory('uploads', filename)

@app.route('/uploadstomonio/<bucketname>', methods=['POST'])
def upload_file_MinIO(bucketname):
    if 'file' not in request.files:
        return 'No file part in the request', 400
    file = request.files['file']

    if file.filename == '':
        return 'No selected image file', 400
    if file:
        file.save('uploads/' + file.filename)
        minio_instance = MinIODemo(bucketname)
        file_name = minio_instance.upload_file(file.filename)
        print("file_name is", file_name)
        return jsonify({"code" : 200, "message" : "File uploaded successfully"}) 
    else:
        return jsonify({"code" : 401, "message" : "Can't upload image"})
    
@app.route('/miniofiles', methods=['GET'])
def get_minio_file():
    buckectname = request.args.get('BUCKETNAME')
    filename = request.args.get('FILENAME')
    secretkey = request.args.get('SECRETKEY')
    accesskey = request.args.get('ACCESSKEY')

    minio_instance = MinIODemo(accesskey, secretkey, buckectname)
    file_name = minio_instance.get_file(filename)
    print("file_name is", file_name)
    return send_file('uploads/' + file_name, as_attachment=True)
    #return jsonify({"code" : 200, "message" : "File uploaded successfully"})  

@app.route('/getdatafile', methods=['GET'])
def get_data_file():
    file_name = request.args.get('FILENAME')
    return send_file('uploads/' + file_name, as_attachment=True)
    #return jsonify({"code" : 200, "message" : "File uploaded successfully"})  

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    # from waitress import serve
    # serve(app, host='0.0.0.0', port=5000) 
    # http_server = WSGIServer(('', 5000), app)
    # http_server.serve_forever()
    # http_server = WSGIServer(("127.0.0.1", 5000), app)
    # http_server.serve_forever()
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=5000)
