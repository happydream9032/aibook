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

  def getDBTableData(self):
    self.mycursor.execute("SELECT * FROM tbl_tables")
    myresult = self.mycursor.fetchall()
    return myresult
  
  def insertDBTableData(self, data, type):
    print(">>>>>>>>>>>>>", data, type)
    if type == True:
      characters = str(data["TABLE_NAME"]) + str(data["USER_ID"]) + "generateTableID"
      generated_string = ''.join(random.choices(characters, k=22))
    else :
      generated_string = data["HASH"]
    sql = "INSERT INTO tbl_tables (user_id, table_name, status, data, created_at, hash) VALUES (%s, %s, %s, %s, %s, %s)"
    val = (data["USER_ID"], data["TABLE_NAME"], data["STATUS"], data["DATA"], data["CREATED_AT"], generated_string)
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
    val = (0, data["EMAIL"], data["PASSWORD"], status, data["IMAGE"], data["CREATE_AT"], data["LOGIN_TYPE"], data["IP_ADDRESS"], data["IP_LOCATION"], "")
    self.mycursor.execute(sql, val)
    self.mydb.commit()
    return data["EMAIL"]
  
  def getUsersbyEmail(self, data, type):
    if type == 0:
      sql ="SELECT * FROM tbl_users WHERE login_type = %s AND email = %s"
      adr = (0, data["EMAIL"] )
    elif type == 1:
      sql ="SELECT * FROM tbl_users WHERE login_type = %s AND email = %s"
      adr = (1, data["EMAIL"] )
    elif type == 2:
      sql ="SELECT * FROM tbl_users WHERE email = %s"
      adr = (data["EMAIL"], )
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
    print(">>>>>>>>>>>>>>", data)
    sql = "SELECT * FROM tbl_users WHERE email = %s"
    val = (data,)
    self.mycursor.execute(sql, val)
    myresult = self.mycursor.fetchall()
    return myresult
  
  def signinUser(self, data):
    sql = "SELECT * FROM tbl_users WHERE email = %s AND status = %s"
    val = (data["EMAIL"], 1)
    self.mycursor.execute(sql, val)
    myresult = self.mycursor.fetchall()
    return myresult
  
