import React, { useContext, useEffect, useState } from 'react';
import { getUserPDF } from '../ApiService/allAPI';
import { uploadResponse } from '../ContextAPI/ContextShare';
import { useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

function AllPdf() {
  const navigate = useNavigate()
  const { uploadStatus, setUploadStatus } = useContext(uploadResponse)
  const [allData, setAllData] = useState("");

  const getUserFiles = async () => {
    const userData = sessionStorage.getItem("currentUser");
    const userId = JSON.parse(userData)._id
    try {
      // console.log(userId);
      const result = await getUserPDF(userId); // Use userId.uploderId
      setAllData(result.data);

    } catch (error) {
      console.error("Error fetching user files:", error);
    }
  };

  useEffect(() => {
    getUserFiles();
  }, [uploadStatus]);
  // console.log(allData);
  // handle nav
  const handlenav = (file) => {

    navigate(`/edit?fileId=${file._id}&uploderId=${file.uploderId}&fileName=${file.files}&title=${file.title}`);


  }

  return (
    <div className=''>
      <h1 className='text-center'>All PDF</h1>

      <div className='border'>
        {Array.isArray(allData) & allData.length > 0 ? (
          // Display files here using the data in 'allData'
          <ListGroup>
            {allData.map((file, index) => (

              <ListGroup.Item key={index} onClick={() => handlenav(file)} action variant="info">
                {file.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <h3 className='text-center'>No Files to show. Please upload some....</h3>
        )}
      </div>
    </div>
  );
}

export default AllPdf;
