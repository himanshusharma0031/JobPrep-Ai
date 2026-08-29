import { useContext,useEffect} from "react";
import { AuthContext } from "../auth.context";
import { login,register,getMe,logout } from "../services/auth.api";


export const useAuth= ()=>{
   const {user,setUser,loading,setLoading} = useContext(AuthContext);

const handleLogin =async({email,password})=>{
   setLoading(true)
   try{
    const data = await login({email,password})
    setUser(data.user)
   }catch(err){
    console.log(err);
   }
   setLoading(false)
}

const handleRegister =async({username,email,password})=>{
   setLoading(true)
   try{
     const data = await register({username,email,password})
   setUser(data.user)
   }catch(err){
     setLoading(false)
   }
}

const handleLogout =async()=>{
   setLoading(true)
   try{
      await logout()
   setUser(null)
   }catch(err){
    console.log(err)
   }
   setLoading(false)
}

useEffect(()=>{
     const getAndSetUser =async()=>{
       try{
          const data = await getMe()
          setUser(data.user)
       }catch(err){
         console.log(err)
       }
        setLoading(false)
     }
     getAndSetUser()
    },[])

return {user,loading,handleLogin,handleRegister,handleLogout}

}