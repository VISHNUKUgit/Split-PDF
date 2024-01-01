import React, { useContext } from 'react'
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import Swal from 'sweetalert2'
import { Navigate, useNavigate } from 'react-router-dom';
import { logInUser, registerUser } from '../ApiService/allAPI';
import { loginResponse } from '../ContextAPI/ContextShare';



function Authentication() {
    const {isLoggedin, setIsLoggedin} = useContext(loginResponse)
    // console.log(isLoggedin);
    const navigate = useNavigate()
    const [isForSignUp, setIsForSignUp] = useState(true)
    const [authData, setAuthData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const registerForm = () => {
        setAuthData({
            username: "",
            email: "",
            password: ""
        })
        setIsForSignUp(false);
    }

    const signUpForm = () => {
        setAuthData({
            username: "",
            email: "",
            password: ""
        })
        setIsForSignUp(true);
    }
    const handleAuth = async (e) => {
        e.preventDefault()
        const { username, email, password } = authData

        if (isForSignUp) {
            if (!username || !email || !password) {
                alert("Please fill in all fields");
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert("Invalid email");
                } else {
                    try {
                        const result = await registerUser(authData);

                        if (result.status === 200) {
                            console.log(result.data);
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
                        else{
                            alert(result.response.data);
                        }
                    } catch (error) {
                        alert(error)
                        
                    }


                }
            }
        } else {
            if (!email || !password) {
                alert("Please fill in all fields");
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert("Invalid email");
                } else {
                    try {
                        const result = await logInUser(authData);
                        if (result.status === 200) {
                            sessionStorage.setItem("currentUser", JSON.stringify(result.data));
                            setIsLoggedin(true)
                            setAuthData({
                                username: "",
                                email: "",
                                password: ""
                            });
                            Swal.fire({
                                title: "Authentication success",
                                html: "Welcome",
                                icon: "success",
                                allowOutsideClick: false
                            }).then((result) => {
                                if (result.isConfirmed) {

                                    navigate('/home')
                                }
                            });
                        }
                        else{
                            alert(result.response.data)
                        }
                    } catch (error) {
                        console.log(error);
                    }

                }
            }
        }


    }
    return (

        <div className='w-50 d-flex flex-column'>

            <div className="d-flex flex-column">
                <h2 className='fw-bolder text-center'>{isForSignUp ? "Sign Up" : "Sign In"}</h2>
                <form className="d-flex flex-column">
                    {
                        isForSignUp ?
                            <TextField className='mt-2' label="Username" variant="standard" value={authData.username || ""} type='text' onChange={(e) => setAuthData({ ...authData, username: e.target.value })} required /> : ''
                    }
                    <TextField className='mt-2' label="Email" variant="standard" value={authData.email || ""} type='email' onChange={(e) => setAuthData({ ...authData, email: e.target.value })} required />

                    <TextField className='mt-2' label="Password" variant="standard" value={authData.password || ""} type='password' onChange={(e) => setAuthData({ ...authData, password: e.target.value })} required />

                    <button className='btn btn-success w-100 mt-3 shadow' onClick={(e) => handleAuth(e)} type='submit'>{isForSignUp ? "Register" : "Sign In"}</button>
                </form>


            </div>
            {
                isForSignUp ?
                    <div className='mt-2'>
                        <p>Already have an account? Click here to{" "} <span className='text-primary' style={{ cursor: "pointer" }} onClick={registerForm}>Sign in</span>  </p>
                    </div> : <div className='mt-2'>
                        <p>New user? Click here to {" "}<span className='text-primary' style={{ cursor: "pointer" }} onClick={signUpForm}>Register</span>  </p>
                    </div>
            }
        </div>

    )
}

export default Authentication