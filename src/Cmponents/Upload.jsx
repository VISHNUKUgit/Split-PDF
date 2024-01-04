// Import necessary React components and libraries
import React, { useContext, useRef, useState } from 'react';
import { uploadPDF } from '../ApiService/allAPI';
import { uploadResponse } from '../ContextAPI/ContextShare';
import Spinner from 'react-bootstrap/Spinner';

function Upload() {

  // Access the upload status context
  const { uploadStatus, setUploadStatus } = useContext(uploadResponse)

  // State for form inputs and loading status
  const [files, setFiles] = useState("");
  const [title, setTitle] = useState("")

  // State for loading indicator
  const [isLoading, setIsLoading] = useState(true)

  // Reference to the file input element
  const fileInputRef = useRef(null);

  // Handle file change event
  const handleFileChange = (e) => {
    setFiles(e.target.files[0]);

  };

  // Handle the file upload process
  const handleUpload = async () => {
    setIsLoading(false)

    // Check if title and files are provided
    if (!title || !files) {
      setIsLoading(true)
      alert("Please fill all")
    }
    else {
      try {

        // Get user data from sessionStorage
        const userData = sessionStorage.getItem("currentUser");
        const user = JSON.parse(userData);

        // Create form data with user ID, title, and file
        const reqBody = new FormData();
        reqBody.append("userId", user._id);
        reqBody.append("title", title);
        reqBody.append("file", files);

        // Set headers for the request
        const reqHeader = {
          "Content-Type": "multipart/form-data",
        };

        // Make the API call to upload the PDF
        const result = await uploadPDF(reqBody, reqHeader);
        
        if (result.status === 200) {
          
              // Update upload status and reset form
              setUploadStatus(!uploadStatus);

              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }

              setTitle("");
              alert("File uploaded successfully!");

        } else {
          // Alert if upload fails
          alert(result.response.data.error);
        }
      } catch (error) {
        // Handle errors during the upload process
        console.error("Error uploading file:", error);
        alert("An error occurred during upload");
      } finally {
        // Set loading to true after upload completion
        setIsLoading(true);
      }
    }
  }


  return (
    <div className='d-flex justify-content-center align-items-center flex-column'>

      <h1 className='text-center'>Upload PDF</h1>

      <div className='w-100 pt-3 rounded bg-dark d-flex justify-content-center align-items-center flex-column'>
        <img className='w-25 rounded' src="https://play-lh.googleusercontent.com/BkRfMfIRPR9hUnmIYGDgHHKjow-g18-ouP6B2ko__VnyUHSi1spcc78UtZ4sVUtBH4g" alt="" />
        <div className='my-3 w-75 text-center'>
          <input className='form-control' type="text" placeholder='Enter title (title should be unique)' value={title || ""} onChange={(e) => setTitle(e.target.value)} />
          <br />
          <input className='form-control' type="file" accept='.pdf' ref={fileInputRef} onChange={handleFileChange} />
          {isLoading ?
            <h3 className='btn btn-primary mt-2' onClick={handleUpload}>
              Upload
            </h3> 
            :
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
      
    </div>
  );
}

export default Upload;

