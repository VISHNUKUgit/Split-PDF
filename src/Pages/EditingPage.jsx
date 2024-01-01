import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Cmponents/Navbar';
import { Document, Page } from 'react-pdf';
// import { sampleData } from '../ContextAPI/ContextShare';
import { pdfjs } from 'react-pdf';
import { createNewPDF } from '../ApiService/allAPI';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Spinner from 'react-bootstrap/Spinner';
import { serverURL } from '../ApiService/serverURL';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function EditingPage() {

  const [numPages, setNumPages] = useState("");
  const [selectedPage, setSelectedPages] = useState([])
  const [isClicked, setIsClicked] = useState(false)
  const navigate = useNavigate()

  // mobile sreen
  const [screenSize, setScreenSize] = useState(window.innerWidth)
  window.addEventListener('resize', function () {

      const screenWidth = window.innerWidth;

      setScreenSize(screenWidth)
  });

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const fileId = params.get('fileId');
  // const uploderId = params.get('uploderId');
  const fileName = params.get('fileName');
  const title = params.get('title');


  const fileUrl = `${serverURL}/files/${fileName}`;
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

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

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      const isSelected = selectedPage.includes(i);
      pages.push(
        <div key={i} className='position-relative bg-dark p-2 m-3'>
          <input type='checkBox' checked={isSelected}
            onChange={() => togglePageSelection(i)} className='position-absolute z-1' style={{ right: '10px', top: '9px' }} value={i} />
          <Page height={screenSize >600? 272:234} pageNumber={i} renderTextLayer={false} renderAnnotationLayer={false} />
          <h4 className='text-light text-center'>Page {i}</h4>
        </div>
      );
    }
    return pages;
  };

  const generatePDF = async () => {
    if (selectedPage.length === 0) {
      alert("please select a page number")
    } else {
      setIsClicked(true)
      const details = {
        id: fileId,
        fileName,
        pageNumber: selectedPage
      }

      const result = await createNewPDF(details);

      if (result.status === 200) {
        // console.log(result.data)
        navigate(`/result?data=${result.data.fileName}`);
        setIsClicked(false)

      } else {
        alert("Error", result);
      }


    }
  }

  return (
    <div>
      <Navbar />
      <div className='mt-5 pt-5 ms-3 ps-5'>
        <Breadcrumb>
          <Breadcrumb.Item ><Link to={'/home'}>Home</Link></Breadcrumb.Item>
          <Breadcrumb.Item active>Edit</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className=''>

        <div >
          <h2 className='text-decoration-underline text-center'>Split PDF</h2>
        </div>

        <div className=' row mx-3'>
          <div className='col-lg-9'>
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <div><h2>Title:{title}</h2></div>
              <div><p>Choose the pages you wish to <span className='fw-bolder'>exclude</span> from this PDF to create a new document</p></div>
              <div className='d-flex flex-wrap'>{numPages && renderPages()}</div>
            </Document>
          </div>
          <div className={screenSize>600 ?'col-lg-3 h-100 border rounded':'position-fixed bottom-0 start-0 bg-primary z-2'}>
            <label className='text-black' htmlFor="selectedPage"> selectedPage:</label>
            <input className='form-control' id='selectedPage' type="text" value={selectedPage || ""} />
            <br />
            {!isClicked ?
              <button className='btn mb-4 btn-success w-100' onClick={generatePDF}>Generate new PDF</button> :
              <button className='btn mb-4 btn-success w-100' disabled>
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
      </div>

    </div>
  );
}

export default EditingPage;
