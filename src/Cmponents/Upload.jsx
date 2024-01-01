import React, { useContext, useState } from 'react';
import { uploadPDF } from '../ApiService/allAPI';
import { sampleData, uploadResponse } from '../ContextAPI/ContextShare';

function Upload() {
  const {uploadStatus, setUploadStatus} =useContext(uploadResponse)
  const {data,setdata} = useContext(sampleData)
  const [files, setFiles] = useState([]);
  const [title,setTitle] = useState("")
  const handleFileChange = (e) => {
    setFiles(e.target.files[0]);
    setdata(e.target.files[0])
  };

  const handleUpload = async () => {
    // console.log(files);
    const userData = sessionStorage.getItem("currentUser");
    const user = JSON.parse(userData);
    // console.log(user._id);
    
    const reqBody = new FormData()
    reqBody.append("userId", user._id)
    reqBody.append("title", title)
    reqBody.append("file", files)

    const reqHeader = {
      "Content-Type": "multipart/from-data"
    }

    const result = await uploadPDF(reqBody, reqHeader)

      if (result.status === 200) {
          // console.log(result);
          setUploadStatus(!uploadStatus)
          alert("Uploded Success")
          } 

          else {
          // console.log(result);
          alert("failed")
          }
  };

  return (
    <div className=' d-flex justify-content-center align-items-center flex-column'>
      <h1 className='text-center'>Split PDF</h1>

      <div className='w-100 pt-3 rounded bg-dark d-flex justify-content-center align-items-center flex-column'>
        <img className='w-25 rounded' src="https://play-lh.googleusercontent.com/BkRfMfIRPR9hUnmIYGDgHHKjow-g18-ouP6B2ko__VnyUHSi1spcc78UtZ4sVUtBH4g" alt="" />
        <div className='my-3 w-75 text-center'>
          <input className='form-control' type="text" placeholder='Enter title' onChange={(e)=>setTitle(e.target.value)} />
          <br />
          <input className='form-control' type="file" accept='.pdf' onChange={handleFileChange} />
          <h3 className='btn btn-primary mt-2' onClick={handleUpload}>
            Upload
          </h3>
        </div>
      </div>

      <div>
        
      </div>
    </div>
  );
}

export default Upload;

