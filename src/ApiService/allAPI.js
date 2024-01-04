import { commonAPI } from "./commonAPI"
import { serverURL } from "./serverURL"

// REGISTER
export const registerUser = async(user)=>{
    return await commonAPI("POST",`${serverURL}/user/register`,user,"")
   }

// LOGIN
   export const logInUser = async(user)=>{
    return await commonAPI("POST",`${serverURL}/user/login`,user,"")
   }

// UPLOAD PDF
export const uploadPDF =async (body,header)=>{
   return await commonAPI("POST",`${serverURL}/upload`,body,header)
} 
// GET USER PDF
export const getUserPDF =async (userId)=>{
   const id ={id:userId}
   return await commonAPI("POST",`${serverURL}/get_pdf`,id,"")
} 
// GENERATE PDF
export const createNewPDF =async (details)=>{
   
   return await commonAPI("POST",`${serverURL}/create-new-pdf`,details,"")
} 
// downLoad Rearranged PDF
export const downLoadRearrangePDF =async (details)=>{
   
   return await commonAPI("POST",`${serverURL}/rearrange-download-pdf`,details,"")
} 