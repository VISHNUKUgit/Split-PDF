import React, { useContext, useRef, useState } from 'react';
import { uploadPDF } from '../ApiService/allAPI';
import { uploadResponse } from '../ContextAPI/ContextShare';
import Spinner from 'react-bootstrap/Spinner';

function Upload() {
  const { uploadStatus, setUploadStatus } = useContext(uploadResponse)
  
  const [files, setFiles] = useState("");
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef(null);
  const handleFileChange = (e) => {
    setFiles(e.target.files[0]);
    
  };

  const handleUpload = async () => {
    setIsLoading(false)
    if (!title || !files) {
      setIsLoading(true)
      alert("Please fill all")
    } 
    else{
      try {
        const userData = sessionStorage.getItem("currentUser");
        const user = JSON.parse(userData);
  
        const reqBody = new FormData();
        reqBody.append("userId", user._id);
        reqBody.append("title", title);
        reqBody.append("file", files);
  
        const reqHeader = {
          "Content-Type": "multipart/form-data",
        };
  
        const result = await uploadPDF(reqBody, reqHeader);
  
        if (result.status === 200) {
          setUploadStatus(!uploadStatus);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          setTitle("");
          alert("Uploaded Success");
        } else {
          alert("Upload failed");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("An error occurred during upload");
      } finally {
        setIsLoading(true);
      }
    }  
  }
  

  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>
      <h1 className='text-center'>Split PDF</h1>

      <div className='w-100 pt-3 rounded bg-dark d-flex justify-content-center align-items-center flex-column'>
        <img className='w-25 rounded' src="https://play-lh.googleusercontent.com/BkRfMfIRPR9hUnmIYGDgHHKjow-g18-ouP6B2ko__VnyUHSi1spcc78UtZ4sVUtBH4g" alt="" />
        <div className='my-3 w-75 text-center'>
          <input className='form-control' type="text" placeholder='Enter title' value={title||""} onChange={(e) => setTitle(e.target.value)} />
          <br />
          <input className='form-control' type="file" accept='.pdf' ref={fileInputRef}  onChange={handleFileChange} />
          {isLoading ?
            <h3 className='btn btn-primary mt-2' onClick={handleUpload}>
              Upload
            </h3> :
            <button className='btn btn-primary mt-2' disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </button>}
        </div>
      </div>

      <div>

      </div>
    </div>
  );
}

export default Upload;

