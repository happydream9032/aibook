import os
import jwt
from datetime import datetime, timedelta
import time, json
from dotenv import load_dotenv

load_dotenv()

class Utils:
  def __init__(self):
    self.secret_key = os.getenv('ENCRYPT_KEY')
    self.private_key = os.getenv('PRIVATE_KEY')
    self.public_key = os.getenv('PUBLIC_KEY')

  def generate_otp_token(self, data):
    token = jwt.encode({
            'public_id': data,
            'exp' : datetime.utcnow() + timedelta(seconds=60)
        }, self.secret_key, algorithm='HS256')
    
    return token
  
  def generate_user_token(self, data):
    token = jwt.encode({
            'public_id': data,
            'exp' : datetime.utcnow() + timedelta(minutes=21600)
        }, self.secret_key, algorithm='HS256')
    
    return token
  
  def validate_token(self, token):
    try:
      data = jwt.decode(token, self.secret_key, algorithms=['HS256'])
      print("======================", data)
      return data['public_id']
    # except jwt.ExpiredSignature:
    #   return "401"
    except:
      return "403"