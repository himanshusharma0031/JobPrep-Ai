const userModal = require('../Model/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenBlacklistModal = require('../Model/blacklist.js');

const registerUser =async(req,res)=>{
  try{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(404).json({
            message:'please enter all fields'
        })
    }
    const userExists = await userModal.findOne({$or: [{username},{ email }]});

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModal.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
        {id: user._id,name:user.username},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
    )
    
    res.cookie("token",token,{
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    res.status(201).json({
      message: "Registration Successful",
      user,
    })
  }catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

const loginUser = async(req,res)=>{
   try {
    const { email, password } = req.body;

    const user = await userModal.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
        {id: user._id,name:user.username},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
    )
    
    res.cookie("token",token,{
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    res.json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}


const logout = async(req,res) =>{
  try{
    const token = req.cookies.token;
    if(token){
      await tokenBlacklistModal.create({token})
    }
    res.clearCookie("token",{
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    res.status(200).json({
      message:"User logout successfully",
    })
     
  }catch(err){
    res.status(500).json({
      message:err.message,
    })
  }
}

const getme=async(req,res)=>{
  try{
     const user = await userModal.findById(req.user.id)
   res.status(200).json({
    message:"user details fetched succesfully",
    user,
   })
  }catch(err){
    res.status(500).json({
      message:err.message,
    })
  }
}
module.exports = {registerUser,loginUser,logout,getme};