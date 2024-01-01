import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Cmponents/Navbar';
import { Document, Page } from 'react-pdf';
import Breadcrumb from 'react-bootstrap/Breadcrumb'

function ResultPage() {
    const [numPages, setNumPages] = useState("");

    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const data = params.get('data');
    const fileUrl = `http://localhost:4000/modified_files/${data}`;

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const renderPages = () => {
        const pages = [];
        for (let i = 1; i <= numPages; i++) {
            pages.push(
                <div key={i} className='position-relative bg-dark p-2 m-3'>
                    <Page height={272} pageNumber={i} renderTextLayer={false} renderAnnotationLayer={false} />
                    <h4 className='text-light text-center'>Page {i}</h4>
                </div>
            );
        }
        return pages;
    };

    return (
        <div>
            <Navbar />
            <div className='mt-5 pt-5 ms-3 ps-5'>
                <Breadcrumb>
                    <Breadcrumb.Item ><Link to={'/home'}>Home</Link></Breadcrumb.Item>
                    {/* <Breadcrumb.Item ><Link to={'/edit'}>Edit</Link></Breadcrumb.Item> */}
                    <Breadcrumb.Item active>Result</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className=''>
                <h2 className=' text-center text-decoration-underline'>Review the modified PDF document</h2>
            </div>

            <div className=' row mx-3'>
                <div className='col-lg-9'>
                    <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                        <div className='d-flex flex-wrap'>{numPages && renderPages()}</div>
                    </Document>
                </div>
                <div className='col-lg-3 h-100 border rounded '>
                    <button className='btn my-4 btn-success w-100'>DownLoad PDF</button>
                </div>
            </div>
        </div>
    )
}

export default ResultPage