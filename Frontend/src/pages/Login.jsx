import React, { useState } from 'react';
import {useNavigate,Link} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast'
import "../style/Login.css"

const Login =()=>{
  const navigate = useNavigate();
  const [email,setEmail] =useState("");
  const [password,setPassword] = useState("");

  const {loading,handleLogin} = useAuth();

  const handlelogin =async(e)=>{
      e.preventDefault();
     const res = await handleLogin({email,password})
     console.log(res)
      if (res.message == "Login Successful") {
          toast.success(res.message);
          navigate("/");
        } else {
          toast.error(res.message);
        }
  } 
 if(loading){
    return (
      <div className="loader-container">
      <div className="loader"></div>
    </div>
    )
  }
    return(
     <div className="login-container">

      <h2>Login</h2>

      <form onSubmit={handlelogin}>
        <label htmlFor='email'>Email address:</label>
        <input
          id='email'
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />
        <label htmlFor='password'>Password:</label>
        <input
          id='password'
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button>Login</button>

      </form>

      <br />

      <Link to="/register">Create Account</Link>

    </div>
  )
} 

export default Login;