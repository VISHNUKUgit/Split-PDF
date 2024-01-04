import axios from 'axios'

export const commonAPI = async (reqType, url, reqBody, reqHeader) => {
  const reqConfig = {
    method: reqType,
    url,
    data: reqBody,
    headers: reqHeader ? reqHeader : { 'Content-Type': 'application/json' },
  };

  try {
    const response = await axios(reqConfig)
    return response; 
  } catch (error) {
    
    return error;
  }
};