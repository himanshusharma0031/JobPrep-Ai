import axios from 'axios';
import { data } from 'react-router-dom';

const api = axios.create({
    baseURL : "https://jobprep-ai-o1d9.onrender.com",
    withCredentials : true
})
export const register = async({username,email,password}) =>{
    try{
       const response =  await api.post("/api/auth/register",{
        username,email,password},)
    return response.data;
    }catch(err){
          console.error(
            "Register error:",
            err.response?.data || err.message
        );
        }  
    }

export const login =async({email,password})=>{
    try{
      const response = await api.post("/api/auth/login",{
        email,password
    })
   return response.data;
    }catch(err){
       console.error(
            "login error:",
            err.response.data
        );
    }
    
}

export const logout = async()=>{
    try{
      const response = await api.get("/api/auth/logout")
    return response.data;
    }catch(err){
        console.error(
            "logout error:",
            err.response?.data || err.message
        );
    }
}

export const getMe = async()=>{
    try{
      const response = await api.get("/api/auth/get-me")
    return response.data;
    }catch(err){
        console.error(
            "Register error:",
            err.response?.data || err.message
        );
    }
}


//https://jobprep-ai-o1d9.onrender.com