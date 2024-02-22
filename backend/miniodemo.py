import os
from minio import Minio
from minio.error import S3Error
from dotenv import load_dotenv

load_dotenv()

class MinIODemo:
  def __init__(self, accesskey, secretkey, bucketname):
      self.bucketname = bucketname

      self.client = Minio(
        "localhost:9000",
        access_key=accesskey,
        secret_key=secretkey,
        region="my-region",
        secure = False
      )

      found = self.client.bucket_exists(self.bucketname)
      if not found:
          self.client.make_bucket(self.bucketname)
          print("Created bucket", self.bucketname)
      else:
          print("Bucket", self.bucketname, "already exists")

  def upload_file(self, filename):
      if filename.find(".csv") != -1 or filename.find(".CSV") != -1:
        content_type = "text/csv"
      elif filename.find(".arrow") != -1 or filename.find(".ARROW") != -1:
        content_type = "application/vnd.apache.arrow.file"
      elif filename.find(".parquet") != -1 or filename.find(".PARQUET") != -1:
        content_type = "application/vnd.apache.parquet"

      source_file = "uploads/"+ filename
      self.client.fput_object(
        self.bucketname, filename, source_file, content_type
      )
      return self.bucketname, source_file, filename
  
  def get_file(self, filename):
      filepath = "results/" + filename
      self.client.fget_object(self.bucketname, filename, filepath)
      return filename
      