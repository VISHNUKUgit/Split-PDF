import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Cmponents/Navbar';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { createNewPDF } from '../ApiService/allAPI';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Spinner from 'react-bootstrap/Spinner';
import { serverURL } from '../ApiService/serverURL';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(pdfWorker, import.meta.url).toString();

function EditingPage() {
  // State to manage the number of pages in the PDF
  const [numPages, setNumPages] = useState("");
  // State to manage selected pages for exclusion
  const [selectedPage, setSelectedPages] = useState([])
  // State to manage loading state during PDF generation
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // State to manage screen size for responsive design
  const [screenSize, setScreenSize] = useState(window.innerWidth)

  // Event listener for screen size changes
  window.addEventListener('resize', function () {

    const screenWidth = window.innerWidth;

    setScreenSize(screenWidth)
  });

  // Extract parameters from URL
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const fileId = params.get('fileId');
  const fileName = params.get('fileName');
  const title = params.get('title');

  // PDF file URL
  const fileUrl = `${serverURL}/files/${fileName}`;

  // Callback function on successful document load
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Toggle selection of a page
  const togglePageSelection = (page) => {
    const isSelected = selectedPage.includes(page);
    if (isSelected) {

      const temp = selectedPage.filter((selectedPage) => selectedPage !== page)
      const newSelectedPages = temp.sort((a, b) => a - b);
      setSelectedPages(newSelectedPages)
    } else {

      const temp = [...selectedPage, page]
      const newSelectedPages = temp.sort((a, b) => a - b);
      setSelectedPages(newSelectedPages)
    }

  };

  // Render pages in the document
  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      const isSelected = selectedPage.includes(i);
      pages.push(
        <div key={i} className='position-relative bg-dark p-2 m-3'>
          <input type='checkBox' checked={isSelected}
            onChange={() => togglePageSelection(i)} className='position-absolute z-1' style={{ right: '10px', top: '9px' }} value={i} />
          <Page height={screenSize > 600 ? 272 : 350} pageNumber={i} renderTextLayer={false} renderAnnotationLayer={false} />
          <h4 className='text-light text-center'>Page {i}</h4>
        </div>
      );
    }
    return pages;
  };

  // Generate new PDF based on selected pages
  const generatePDF = async () => {
    
    if (selectedPage.length === 0) {
      alert("please select a page number")
    }
    // else if (selectedPage.length === numPages) {
    //   alert("You have selected all pages , there is no pages to create new one")
    // }
    else {
      setIsLoading(true)
      const details = {
        id: fileId,
        fileName,
        pageNumber: selectedPage
      }

      try {
        const result = await createNewPDF(details);

        if (result.status === 200) {
          navigate(`/result?data=${result.data.fileName}&fileId=${fileId}&fileName=${fileName}`);
        } else {
          alert("Error", result);
        }
      } catch (error) {
        console.error("Error generating new PDF:", error);
        alert("An error occurred during PDF generation");
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className='mt-5 pt-5 ms-3 ps-5'>
        <Breadcrumb>
          <Breadcrumb.Item ><Link to={'/home'}>Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item active>Edit</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <>
        <>
          <h2 className='text-decoration-underline text-center'>Slice PDF</h2>
          
        </>

        <div className=' row mx-3'>
          <div className={screenSize > 600 ? 'col-lg-9' : 'col-lg-9 mb-5 pb-5'}>
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <><h2>Title:{title}</h2></>
              <><p>Check the box to select the pages you wish to <span className='fw-bolder'>create</span> a new PDF document</p></>
              <div className='d-flex flex-wrap'>{numPages && renderPages()}</div>
            </Document>
          </div>
          <div className={screenSize > 600 ? 'col-lg-3 h-100 border rounded' : 'position-fixed bottom-0 start-0 bg-primary z-2'}>
            {/* <label className='text-black' htmlFor="selectedPage"> selectedPage:</label> */}
            <input className='form-control mt-2' id='selectedPage' placeholder='selectedPage:' disabled type="text" value={selectedPage || ""} />
            
            {!isLoading ?
              <button className='btn mb-2 mt-2 btn-success w-100' onClick={generatePDF}>Generate new PDF</button> 
              :
              <button className='btn mb-2 mt-2 btn-success w-100' disabled>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Loading...
              </button>
            }
          </div>
        </div>
      </>
    </>
  );
}

export default EditingPage;
