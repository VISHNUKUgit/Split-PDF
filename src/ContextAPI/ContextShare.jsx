import React, { useState, createContext } from 'react';

export const loginResponse = createContext();
export const uploadResponse = createContext();
export const sampleData = createContext();

function ContextShare({ children }) {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [data,setdata] =useState("")

  return (
    <sampleData.Provider value={{data,setdata}}>
    <loginResponse.Provider value={{ isLoggedin, setIsLoggedin }}>
      <uploadResponse.Provider value={{ uploadStatus, setUploadStatus }}>
        {children}
      </uploadResponse.Provider>
    </loginResponse.Provider>
    </sampleData.Provider>
  );
}

export default ContextShare;


