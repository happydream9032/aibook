import os
import random
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

class Database:
  def __init__(self):
    self.mydb = mysql.connector.connect(
      host=str(os.getenv('MYSQL_HOSTNAME')),
      user=str(os.getenv('MYSQL_USERNAME')),
      password=str(os.getenv('MYSQL_PASSWORD')),
      database=str(os.getenv('MYSQL_DATABASE'))
    )
    self.mycursor = self.mydb.cursor()

  def getDBTableData(self, data):
    sql = "SELECT * FROM tbl_tables WHERE user_id = %s"
    val = (data["ID"],)
    self.mycursor.execute(sql,val)
    myresult = self.mycursor.fetchall()
    return myresult
  
  def insertDBTableData(self, data, type):
    print(">>>>>>>>>>>>>", data, type)
    if type == True:
      characters = str(data["TABLENAME"]) + str(data["USER_ID"]) + "generateTableID"
      generated_string = ''.join(random.choices(characters, k=22))
    else :
      generated_string = data["HASH"]
    sql = "INSERT INTO tbl_tables (user_id, table_name, status, data, created_at, hash) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (data["USER_ID"], data["TABLENAME"], data["STATUS"], data["DATA"], data["CREATED_AT"], generated_string)
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return generated_string

  
  def deleteDBTableData(self, data):
    sql = "DELETE FROM tbl_tables WHERE id = %s"
    val = (data["ID"],)
    self.mycursor.execute(sql, val)
    self.mydb.commit()

    return str(data["ID"])

  def getDBTableDataByHash(self, data):
    sql ="SELECT * FROM tbl_tables WHERE hash = %s"
    adr = (data["HASH"], )
    self.mycursor.execute(sql, adr)
    myresult = self.mycursor.fetchall()
    return myresult
  
  def changeDBNameByID(self, data):
    sql = "UPDATE tbl_tables SET table_name = %s WHERE id = %s"
    val = (data["DB_NAME"], data["ID"])
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return data

  def changeDBDataByID(self, data):
    sql = "UPDATE tbl_tables SET data = %s WHERE id = %s"
    val = (data["DATA"], data["ID"])
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return data["DATA"]

  def changeUserDatabaseItem(self, data):
    sql = "UPDATE tbl_users SET database = %s WHERE id = %s"
    val = (data["DATABASE"], data["ID"])
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return data
  
  def adduser(self, data, status):
    sql = "INSERT INTO tbl_users (user_id, email, password, status, image, created_at, login_type, ip_address, location, otp) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (data["USER_ID"], data["EMAIL"], data["PASSWORD"], status, data["IMAGE"], data["CREATE_AT"], data["LOGIN_TYPE"], data["IP_ADDRESS"], data["IP_LOCATION"], "")
    self.mycursor.execute(sql, val)
    print("100")
    self.mydb.commit()
    return data["EMAIL"]
  
  def getUsersbyEmail(self, data, type):
    if type == 0:
      sql ="SELECT * FROM tbl_users WHERE email = %s AND status = %s"
      adr = (data["EMAIL"], 1)
    elif type == 1:
      sql ="SELECT * FROM tbl_users WHERE (id = %s OR user_id = %s) AND email = %s"
      adr = ( data["USER_ID"],  data["USER_ID"], data["EMAIL"])
    self.mycursor.execute(sql, adr)
    myresult = self.mycursor.fetchall()
    return myresult

  def updateOTPbyEmail(self, value, id):
    sql = "UPDATE tbl_users SET otp = %s WHERE id = %s"
    val = (value, id)
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return value
  
  def validateSuccess(self, id):
    sql = "UPDATE tbl_users SET status = %s WHERE id = %s"
    val = (1, id)
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return "success"
  
  def verifyEmailAddress(self, data):
    sql = "SELECT * FROM tbl_users WHERE email = %s"
    val = (data,)
    self.mycursor.execute(sql, val)
    myresult = self.mycursor.fetchall()
    return myresult
  
  def getUserByID(self, data):
    sql = "SELECT * FROM tbl_users WHERE id = %s OR user_id = %s"
    val = (data["USER_ID"],data["USER_ID"])
    self.mycursor.execute(sql, val)
    myresult = self.mycursor.fetchall()
    return myresult
  
  def addEmailAddress(self, data):
    sql = "INSERT INTO tbl_users (user_id, email, password, status, image, created_at, login_type, ip_address, location, otp) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (data["USER_ID"], data["EMAIL"], data["PASSWORD"], 0, data["IMAGE"], data["CREATE_AT"], data["LOGIN_TYPE"], data["IP_ADDRESS"], data["IP_LOCATION"], "")
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return data["EMAIL"]
  
  def verifyUserEmailAddress(self, data):
    sql = "SELECT * FROM tbl_users WHERE (id = %s OR user_id = %s) AND email = %s"
    val = (data["USER_ID"],data["USER_ID"],data["EMAIL"])
    self.mycursor.execute(sql, val)
    myresult = self.mycursor.fetchall()
    return myresult
  
  def uploadfile(self, id, name):
    sql = "UPDATE tbl_users SET image = %s WHERE id = %s"
    val = (name, id)
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return name

  def getAllUsersById(self, type, id):
    if type == 0:
      sql = "SELECT * FROM tbl_users WHERE (id = %s OR user_id = %s) AND status = %s"
      val = (id, id, 1)
    if type == 1:
      sql = "SELECT * FROM tbl_users WHERE id = %s"
      val = (id,)
    self.mycursor.execute(sql, val)
    myresult = self.mycursor.fetchall()
    return myresult
  
  def changeUserPassword(self, data, id):
    sql = "UPDATE tbl_users SET password = %s WHERE id = %s"
    val = (data, id)
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return data
  
  def deleteUserData(self, id):
    sql = "DELETE FROM tbl_users WHERE id = %s"
    val = (id,)
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return str(id)
