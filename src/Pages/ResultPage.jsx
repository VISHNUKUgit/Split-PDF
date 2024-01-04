import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Cmponents/Navbar';
import { Document, Page } from 'react-pdf';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { serverURL } from '../ApiService/serverURL';
import { saveAs } from 'file-saver';
import Spinner from 'react-bootstrap/Spinner';
import { downLoadRearrangePDF } from '../ApiService/allAPI';

// Component representing the Result Page with modified PDF review and download functionalities.
function ResultPage() {
    // State to manage the number of pages in the modified PDF
    const [numPages, setNumPages] = useState("");

    // State to manage loading integaters
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingForRearrange, setIsLoadingForRearrange] = useState(false)

    // State to manage selected pages for exclusion
    const [selectedPage, setSelectedPages] = useState([])

    //State to manage to show check box
    const [showCheckBox, setShowCheckBox] = useState(false)


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
    const data = params.get('data');

    // URL for the modified PDF
    const fileUrl = `${serverURL}/modified_files/${data}`;

    // Callback function on successful document load
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // Toggle selection of a page
    const togglePageSelection = (page) => {
        const isSelected = selectedPage.includes(page);
        if (isSelected) {
            const temp = selectedPage.filter((selectedPage) => selectedPage !== page)
            setSelectedPages(temp)
        } else {
            const temp = [...selectedPage, page]
            setSelectedPages(temp)
        }

    };

    // Render pages in the modified PDF
    const renderPages = () => {
        const pages = [];
        for (let i = 1; i <= numPages; i++) {
            const isSelected = selectedPage.includes(i);
            pages.push(
                <div key={i} className='position-relative bg-dark p-2 m-3'>
                    {showCheckBox && <input type='checkBox' checked={isSelected}
                        onChange={() => togglePageSelection(i)} className='position-absolute z-1' style={{ right: '10px', top: '9px' }} value={i} />}
                    <Page height={screenSize > 600 ? 272 : 350} pageNumber={i} renderTextLayer={false} renderAnnotationLayer={false} />
                    <h4 className='text-light text-center'>Page {i}</h4>
                </div>
            );
        }
        return pages;
    };

    // Handle download button click
    const handleDownload = async (url) => {
        
        setIsLoading(true)
        try {
            // Fetch the PDF file as a blob
            const response = await fetch(url);
            const blob = await response.blob();

            // using FileSaver.js to save the blob as a file
            saveAs(blob, data);
        } catch (error) {
            console.error('Error downloading the file:', error);

        } finally {
            setIsLoading(false)
            setSelectedPages([])
        }
    };

    // Download PDF based on Rearrange pages
    const rearrangePDF = async () => {
        setIsLoadingForRearrange(true);

        if (selectedPage.length === 0) {
            setIsLoadingForRearrange(false);
            alert("please select order")
        }
        else if (selectedPage.length !== numPages) {
            setIsLoadingForRearrange(false);
            alert("You did't selected all pages ")
        }
        else {
            const details = {
                fileName: data,
                pageNumber: selectedPage
            }

            try {
                const result = await downLoadRearrangePDF(details);
                const fileUrlToDownload = `${serverURL}/modified_files/${result.data.fileName}`;
                if (result.status === 200) {
                   handleDownload(fileUrlToDownload)   
                } else {
                    alert("Error", result);
                }
            } catch (error) {
                console.error("Error generating new PDF:", error);
                alert("An error occurred during PDF generation");
            } finally {
                setIsLoadingForRearrange(false);
            }
        }
    }
    return (
        <>
            <Navbar />
            <div className='mt-5 pt-5 ms-3 ps-5'>
                <Breadcrumb>
                    <Breadcrumb.Item ><Link to={'/home'}>Home</Link></Breadcrumb.Item>
                    {/* <Breadcrumb.Item ><Link to={'/edit'}>Edit</Link></Breadcrumb.Item> */}
                    <Breadcrumb.Item active>Result</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <>
                <h2 className=' text-center text-decoration-underline'>Review the modified PDF document</h2>
                <p className=' text-center'>{numPages === 1 ?'proceed to download PDF' :'If you wish to customize the page order, simply select the pages in your preferred sequence. If no rearrangement is needed, proceed to direct download PDF.'}</p>
            </>

            <div className=' row mx-3'>
                <div className={screenSize > 600 ? 'col-lg-9' : 'mb-5 pb-5'}>
                    <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                        <div className='d-flex flex-wrap'>{numPages && renderPages()}</div>
                    </Document>
                </div>
                <div className={screenSize > 600 ? 'col-lg-3 h-100 border rounded ' : 'position-fixed bottom-0 start-0 bg-primary z-2'}>
                    {showCheckBox || !isLoading   ? <button className={`btn mt-2 btn-success w-100 ${showCheckBox && 'disabled'}`} onClick={()=>handleDownload(fileUrl)}>Download PDF</button>
                        :
                        <button className='btn mt-2 btn-success w-100' >
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Loading...
                        </button>}



                    <button className={`btn mt-2 mb-2 btn-warning w-100 ${ numPages === 1 && 'disabled'} `} data-bs-toggle="collapse" data-bs-target="#collapseExample" onClick={() => setShowCheckBox(!showCheckBox)} aria-expanded="false" aria-controls="collapseExample">
                        Rearrange Page & Download
                    </button>
                    <div className="collapse mb-2" id="collapseExample">
                        <div className="card card-body">
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="Ex: 5,1,3" aria-label="Recipient's username" disabled aria-describedby="button-addon2" value={selectedPage || ""} onChange={(e) => setSelectedPages(e.target.value)} />
                                {!isLoadingForRearrange ?
                                    <button class="btn btn-dark" onClick={rearrangePDF} id="button-addon2">Download</button>
                                    : <button className='btn btn-dark' disabled>
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
                </div>
            </div>
        </>
    )
}

export default ResultPage