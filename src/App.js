import { Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Home from "./Pages/Home";
import EditingPage from "./Pages/EditingPage";
import { useContext, useEffect, useState } from "react";
import { loginResponse } from "./ContextAPI/ContextShare";
import ResultPage from "./Pages/ResultPage";
import ErrorPage from "./Pages/ErrorPage";

function App() {
  // Context for login state
  const {isLoggedin, setIsLoggedin} = useContext(loginResponse)

  // State to manage user authorization status
  const [isAuthorised, setIsAuthorised] = useState(false);

  // useEffect hook to run when the isLoggedin state changes and check if there is a 
  //current user in the session storage ,If a user is logged in, set the authorization 
  //status to true

  useEffect(()=>{
    if(sessionStorage.getItem("currentUser")){
      setIsAuthorised(true)
    }else
    {
      setIsAuthorised(false)
    }
  },[isLoggedin])

  return (
    <>
  <Routes>
    <Route path="/" element={<LandingPage/>}/>
    <Route path="/home" element={isAuthorised?<Home/>:<ErrorPage/>}/>
    <Route path="/edit" element={isAuthorised?<EditingPage/>:<ErrorPage/>}/>
    <Route path="/result" element={isAuthorised?<ResultPage/>:<ErrorPage/>}/>
  </Routes>
    </>
  );
}

export default App;
