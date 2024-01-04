import React, { useState } from 'react'
import img from '../images/LandingIMG.png'
import Authentication from '../Cmponents/Authentication'
function LandingPage() {

    // mobile sreen
    const [screenSize, setScreenSize] = useState(window.innerWidth)
    window.addEventListener('resize', function () {
        const screenWidth = window.innerWidth;
        setScreenSize(screenWidth)
    });

    return (

        <div className='bg-dark'>
            <div className={`vh-100  d-flex justify-content-center align-items-center ${screenSize > 600 && 'container'} `}>
                <div className='border rounded shadow w-100 d-flex bg-light'>
                    {screenSize > 600 && 
                    <div className='w-50 bg-white'>
                        <img className='w-100' src={img} alt="" />
                    </div> 
                    }
                    < div className={`d-flex justify-content-center align-items-center ${screenSize > 600 ? 'w-50' : 'w-100 vh-100'}`}>
                        <Authentication />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LandingPage