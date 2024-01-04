import React from 'react'
import Navbar from '../Cmponents/Navbar'
import Upload from '../Cmponents/Upload'
import AllPdf from '../Cmponents/AllPdf'
import Breadcrumb from 'react-bootstrap/Breadcrumb'

function Home() {
  return (
    <>
      <Navbar />
      <div className='mt-5 pt-5 ms-3 ps-5'>
        <Breadcrumb>
          <Breadcrumb.Item active>Home</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className='container d-flex '>
        <div className='row  w-100'>
          <div className='col-lg-8  px-1'>
            <Upload />
          </div>
          <div className='col-lg-4'>
            <AllPdf />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home