const jwt = require('jsonwebtoken');
const tokenBlacklistModal = require('../Model/blacklist');

const authUser =async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
       return res.status(401).json({
            message:'please login first',
        })
    }
    const istokenBlacklisted = await tokenBlacklistModal.findOne({token})
    if(istokenBlacklisted){
       return res.status(401).json({
            message:'Unauthorized user',
        })
    }
    try{
      const user = jwt.verify(token,process.env.JWT_SECRET)
      req.user = user;
    next();

    }catch(err){
       return res.status(401).json({
            message:"invalid user"
        })
    }
}

module.exports = {authUser};