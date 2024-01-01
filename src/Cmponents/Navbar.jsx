import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginResponse } from '../ContextAPI/ContextShare'

function Navbar() {
  const {isLoggedin, setIsLoggedin} = useContext(loginResponse)
  const [isAuthorised, setIsAuthorised] = useState(false);
  const navigate = useNavigate()

  useEffect(()=>{
    if(sessionStorage.getItem("currentUser")){
      setIsAuthorised(true)
    }else
    {
      setIsAuthorised(false)
    }
  },[isLoggedin])

  const handleLogout=()=>{
    sessionStorage.removeItem("currentUser");
    setIsLoggedin(false)
  }
  return (
    <nav class=" navbar navbar-dark bg-primary  fixed-top">
  <div class="container-fluid">
  <a class="navbar-brand ps-5" onClick={()=>navigate(!isAuthorised?'/':'/home')}  style={{cursor:'pointer'}}><h3>PDFSlice.com</h3></a>
    <button class="navbar-toggler " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Dark offcanvas</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page">Home</a>
            
              <Link to={'/'} onClick={handleLogout}>{!isAuthorised?'Login':'Log Out'}</Link>

            
            
          </li>
        </ul>
        
      </div>
    </div>
  </div>
</nav>
  )
}

export default Navbar