const jwt = require('jsonwebtoken');
const tokenBlacklistModal = require('../Model/blacklist');

const authUser =async(req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        res.status(401).json({
            message:'please login first',
        })
    }
    const istokenBlacklisted = await tokenBlacklistModal.findOne({token})
    if(istokenBlacklisted){
        res.status(401).json({
            message:'Unauthorized user',
        })
    }
    try{
      const user = jwt.verify(token,process.env.JWT_SECRET)
      req.user = user;
    next();

    }catch(err){
        res.status(400).json({
            message:"invalid user"
        })
    }
}

module.exports = {authUser};