// Import necessary React components and libraries
import React, { useContext, useEffect, useState } from 'react';
import { getUserPDF } from '../ApiService/allAPI';
import { uploadResponse } from '../ContextAPI/ContextShare';
import { useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

function AllPdf() {
  const navigate = useNavigate()

  // Access the upload status context
  const { uploadStatus } = useContext(uploadResponse)

  // State to store user PDF data
  const [allData, setAllData] = useState("");

  // Function to fetch user PDF files
  const getUserFiles = async () => {

    // Retrieve user data from sessionStorage
    const userData = sessionStorage.getItem("currentUser");
    const userId = JSON.parse(userData)._id
    try {
          // Fetch user PDF files using the API
          const result = await getUserPDF(userId);
          // Update the state with the fetched data
          setAllData(result.data);
    } catch (error) {
          // Handle errors while fetching user files
          console.error("Error fetching user files:", error);
    }
  };

  // useEffect hook to trigger fetching user files when uploadStatus changes
  useEffect(() => {
    getUserFiles();
  }, [uploadStatus]);

  // Function to navigate to the edit page with file details
  const handlenav = (file) => {
    navigate(`/edit?fileId=${file._id}&uploderId=${file.uploderId}&fileName=${file.files}&title=${file.title}`);
  }

  return (
    <>
      <h1 className='text-center'>All PDF</h1>

      <div>
        {allData && allData.length > 0 ?
          (
            <ListGroup>
              {allData.map((file) => (

                <ListGroup.Item key={file._id} onClick={() => handlenav(file)} action variant="info">
                  {file.title}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )
          :
          (
            <h3 className='text-center'>No Files to show. Please upload some....</h3>
          )}
      </div>
    </>
  );
}

export default AllPdf;
