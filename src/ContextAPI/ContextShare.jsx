import React, { useState, createContext } from 'react';

// Create Contexts for different types of shared data
export const loginResponse = createContext();
export const uploadResponse = createContext();

// Main context provider component
function ContextShare({ children }) {
   // State to manage user login status
  const [isLoggedin, setIsLoggedin] = useState(false);

  // State to manage upload status
  const [uploadStatus, setUploadStatus] = useState(false);

  

  return (
    // Provider for loginResponse context
    <loginResponse.Provider value={{ isLoggedin, setIsLoggedin }}>

       {/* Provider for uploadResponse context */}
      <uploadResponse.Provider value={{ uploadStatus, setUploadStatus }}>

        {/* Render children components wrapped with context providers */}
        {children}
      </uploadResponse.Provider>

    </loginResponse.Provider>
    
  );
}

// Export the main context provider component
export default ContextShare;


