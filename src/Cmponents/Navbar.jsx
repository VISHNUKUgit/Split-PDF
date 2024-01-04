import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginResponse } from '../ContextAPI/ContextShare'

function Navbar() {
  // Access the login state context
  const { isLoggedin, setIsLoggedin } = useContext(loginResponse)

  // State to track user authorization status
  const [isAuthorised, setIsAuthorised] = useState(false);
  const navigate = useNavigate()

  // useEffect hook to update user authorization status when isLoggedin changes
  useEffect(() => {
    setIsAuthorised(!!sessionStorage.getItem("currentUser"));
  }, [isLoggedin]);
  
// Function to handle user logout
  const handleLogout = () => {

    // Remove user data from sessionStorage
    sessionStorage.removeItem("currentUser");

     // Update login state to false
    setIsLoggedin(false)

    // Navigate to the home page
    navigate('/')
  }
  return (
    <nav className=" navbar navbar-dark bg-primary  fixed-top">
      <div className="container-fluid">

        <span className="navbar-brand ps-5" onClick={() => navigate(!isAuthorised ? '/' : '/home')} style={{ cursor: 'pointer' }}><h3>P<span className='text-danger'>D</span>F <span className='text-warning'>S</span>li<span className='text-info'>c</span>e.com</h3></span>

        <button className="navbar-toggler " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">

          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>

          <div className="offcanvas-body">

            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">

              <li className="nav-item">
                <Link style={{textDecoration:'none'}} className='text-light' to={'/home'}>Home</Link>
              </li>

              <li class="nav-item">
                <span style={{cursor:'pointer'}} onClick={handleLogout}>{!isAuthorised ? 'Login' : 'Log Out'}</span>
              </li>

            </ul>

          </div>

        </div>
        
      </div>
    </nav>
  )
}

export default Navbar