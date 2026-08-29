import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import "../style/Register.css"
const Register =()=>{
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate()

    const {loading,handleRegister} = useAuth();

    const registerUser =async(e)=>{
      e.preventDefault();
      const res = await handleRegister({username,email,password});
      navigate("/")
     // console.log(res.message)
      alert(res.message)
    }
    if(loading){
      <h1>loading....</h1>
    }
    return(
        <div className="register-container">

      <h2>Register</h2>

      <form onSubmit={registerUser}>
        <label htmlFor='username'>UserName:</label>
        <input
          id="username"
          type="text"
          placeholder="Name"
          onChange={(e)=>setUsername(e.target.value)}
        />

        <br/><br/>
        <label htmlFor='email'>Email address:</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>
        <label htmlFor='password'>Password:</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button>Register</button>

      </form>

      <br/>

      <Link to="/login">Already have an account?</Link>

    </div>
    )
}

export default Register;