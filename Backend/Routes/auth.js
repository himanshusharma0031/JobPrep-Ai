const {Router} = require('express');
const authRouter = Router();
const {registerUser,loginUser,logout,getme} = require('../Controller/auth.js');
const {authUser} = require('../Middlewares/auth.js');


authRouter.post('/register',registerUser);
authRouter.post('/login',loginUser);
authRouter.get('/logout',logout)
authRouter.get('/get-me',authUser,getme)

module.exports = authRouter;