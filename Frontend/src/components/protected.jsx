import { useAuth } from "../hooks/useAuth";
import React from "react";
import { Navigate } from "react-router-dom";
const Protected = ({children})=>{
  const {loading,user} = useAuth();
 if(loading){
    return(
      <h1>loading....</h1>
    )
  }
 
  if(!user){
     return <Navigate to="/login" replace />;
  }

  return children
}

export default Protected;