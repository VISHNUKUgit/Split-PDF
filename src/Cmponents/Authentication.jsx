// Import necessary React components and libraries
import React, { useContext } from 'react'
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { logInUser, registerUser } from '../ApiService/allAPI';
import { loginResponse } from '../ContextAPI/ContextShare';
import Spinner from 'react-bootstrap/Spinner';

// Authentication component
function Authentication() {
    // Initialize navigation hook
    const navigate = useNavigate()

    // State for loading indicator
    const[isLoading,setIsLoading] = useState(true)

    // Context for login state
    const { setIsLoggedin } = useContext(loginResponse)
    const [isForSignUp, setIsForSignUp] = useState(true)

    // State for authentication form data
    const [authData, setAuthData] = useState({
        username: "",
        email: "",
        password: ""
    })

    // Function to switch to registration form
    const registerForm = () => {
        setAuthData({
            username: "",
            email: "",
            password: ""
        })
        setIsForSignUp(false);
    }

    // Function to switch to login form
    const signUpForm = () => {
        setAuthData({
            username: "",
            email: "",
            password: ""
        })
        setIsForSignUp(true);
    }

    // Function to handle authentication (registration or login)
    const handleAuth = async (e) => {
        e.preventDefault()

        setIsLoading(false)// Start loading indicator
        
        const { username, email, password } = authData

        // Registration logic
        if (isForSignUp) {

            
            // Check if any of the required fields are empty
            if (!username || !email || !password) {
                setIsLoading(true)
                alert("Please fill in all fields");
            } 
            else 
            {
                // Regular expression to validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                // Check if email is in a valid format
                if (!emailRegex.test(email)) {
                    setIsLoading(true)
                    alert("Invalid email");
                } 
                else 
                {
                    try 
                    {   
                        // Attempt to register the user using the provided data
                        const result = await registerUser(authData);

                        if (result.status === 200) {
                            // Registration successful
                            

                            // Display success message using SweetAlert2
                            Swal.fire({
                                title: `Registraion Success`,
                                html: `Please Sign in`,
                                icon: "success",
                                allowOutsideClick: false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    registerForm()
                                }
                            });
                            setAuthData({
                                username: "",
                                email: "",
                                password: ""
                            });
                        }
                        else 
                        {   
                            // Registration failed, display error message
                            
                            alert(result.response.data);
                        }
                    } 
                    catch (error) 
                    {
                        // Handle unexpected errors during registration
                        
                        alert(error)
                    }
                    finally {
                        // Set loading to true after upload completion
                        setIsLoading(true);
                      }
                }
            }
        } 
        else
        // Login logic
        {   
            // Check if any of the required fields are empty
            if (!email || !password) {
                setIsLoading(true)
                alert("Please fill in all fields");
            } 
            else 
            {
                // Regular expression to validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                // Check if email is in a valid format
                if (!emailRegex.test(email)) {
                    setIsLoading(true)
                    alert("Invalid email");
                } 
                else 
                {
                    try {
                        // Attempt to login the user using the provided data
                        const result = await logInUser(authData);
                        if (result.status === 200) {
                            // login successful
                            

                            // Store user data in sessionStorage
                            sessionStorage.setItem("currentUser", JSON.stringify(result.data));

                            // Set login state to true
                            setIsLoggedin(true)

                            // Reset form data
                            setAuthData({
                                username: "",
                                email: "",
                                password: ""
                            });

                            // Display success message using SweetAlert2
                            Swal.fire({
                                title: "Authentication success",
                                html: "Welcome",
                                icon: "success",
                                allowOutsideClick: false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // If user confirms the success message, navigate to the home page
                                    navigate('/home')
                                }
                            });
                        }
                        else 
                        {
                            // Login failed, display error message
                            
                            alert(result.response.data)  
                        }
                    } 
                    catch (error) 
                    {
                        // Handle unexpected errors during login
                        
                        console.log(error);   
                    }
                    finally {
                        // Set loading to true after upload completion
                        setIsLoading(true);
                      }
                }
            }
        }
    }
    return (

        <div className='w-75 d-flex flex-column'>

            <h1 className='text-center fw-bolder mb-5'>P<span className='text-danger'>D</span>F <span className='text-warning'>S</span>li<span className='text-info'>c</span>e.</h1>
            <div className="d-flex flex-column">

                <h2 className=' text-center'>{isForSignUp ? "Sign Up" : "Sign In"}</h2>

                <form className="d-flex flex-column">
                    {
                    isForSignUp &&
                    <TextField className='mt-2' label="Username" variant="standard" value={authData.username || ""} type='text' onChange={(e) => setAuthData({ ...authData, username: e.target.value })} required />
                    }
                    <TextField className='mt-2' label="Email" variant="standard" value={authData.email || ""} type='email' onChange={(e) => setAuthData({ ...authData, email: e.target.value })} required />
                    <TextField className='mt-2' label="Password" variant="standard" value={authData.password || ""} type='password' onChange={(e) => setAuthData({ ...authData, password: e.target.value })} required />
                    {
                    isLoading ?
                    <button className='btn btn-success w-100 mt-3 shadow' onClick={(e) => handleAuth(e)} type='submit'>{isForSignUp ? "Register" : "Sign In"}</button>
                    :
                    <button className='btn btn-success w-100 mt-3 shadow' disabled>
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
                </form>
            
            </div>
            {
            isForSignUp ?
            <div className='mt-2'>
                    <p>Already have an account? Click here to{" "} <span className='text-primary' style={{ cursor: "pointer" }} onClick={registerForm}>Sign in</span>  </p>
            </div> 
            : 
            <div className='mt-2'>
                    <p>New user? Click here to {" "}<span className='text-primary' style={{ cursor: "pointer" }} onClick={signUpForm}>Register</span>  </p>
            </div>
            }
        </div>
    )
}
export default Authentication