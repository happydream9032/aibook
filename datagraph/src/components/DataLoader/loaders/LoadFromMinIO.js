import React, { useState, useEffect, useCallback } from 'react'
import axios from "axios";
import classNames from 'classnames'
import S from './UrlFetch.module.scss'

export default function LoadFromMinIO({
  setUserInput,
  setLoadingError,
}) {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [fileName, setFileName] = useState("");
  const [bucketName, setBucketName] = useState("");
  const [isBtnDisable, setBtnDisable] = useState(false);

  useEffect(() => {
    if (accessKey !== "" && secretKey !== "" && fileName !== "" && bucketName !== "") { 
      setBtnDisable(true)
    }
  },[accessKey, secretKey, fileName, bucketName])

  const getFileFromMinIO = useCallback(
    async () => {
    try {
      let select_apiUrl = "http://127.0.0.1:5000/miniofiles1";
      let response = await axios.get(select_apiUrl, {
        params: {
          ACCESSKEY: accessKey,
          SECRETKEY: secretKey,
          BUCKETNAME: bucketName,
          FILENAME: fileName
        },
        responseType: 'blob' // Ensure the response is treated as a Blob
      });
      
      let blob = new Blob([response.data], { type: "text/csv" });
      let file = new File([blob], "temp.csv", {
        type: "text/csv",
        lastModified: Date.now(),
      });

      const reader = new FileReader()
      reader.addEventListener('load', (e) => {
        console.log("===",e.target.result)
        setUserInput(e.target.result)
        setLoadingError(null)
      })
      reader.readAsText(file)
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  },
    [setLoadingError, setUserInput, accessKey,secretKey,bucketName,  fileName]
  )

  const handleSubmit = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      getFileFromMinIO()
      return false
    },
    [getFileFromMinIO]
  )

  return (
    <form onSubmit={handleSubmit}>
      <span className='w-100 fs-4 fw-bolder text-gray-500 my-1'>Access Key :</span>
      <input
        className={classNames('w-100 my-1', S['url-input'])}
        value={accessKey}
        onChange={(e) => {
          setAccessKey(e.target.value)
        }}
      />
      <span className='w-100 fs-4 fw-bolder text-gray-500 my-1'>Secret Key :</span>
      <input
        className={classNames('w-100 my-1', S['url-input'])}
        value={secretKey}
        onChange={(e) => {
          setSecretKey(e.target.value)
        }}
      />
      <span className='w-100 fs-4 fw-bolder text-gray-500 my-1'>Bucket Name :</span>
      <input
        className={classNames('w-100 my-1', S['url-input'])}
        value={bucketName}
        onChange={(e) => {
          setBucketName(e.target.value)
        }}
      />
      <span className='w-100 fs-4 fw-bolder text-gray-500 my-1'>File Name :</span>
      <input
        className={classNames('w-100 my-1', S['url-input'])}
        value={fileName}
        onChange={(e) => {
          setFileName(e.target.value)
        }}
      />
      <div className="text-right">
        <button
          className="btn btn-sm btn-success mt-3"
          disabled={!isBtnDisable}
          type="submit"
        >
          Load data
        </button>
      </div>
    </form>
  )
}
