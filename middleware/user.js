const jwt = require("jsonwebtoken");
const {JWT_USER_SECRET} = require("../routes/config")

function userMiddleware(req , res , next){
    const token = req.headers.token;
    const verify = jwt.verify(token,JWT_USER_SECRET)
    if (verify){
        req.userid =verify.id;
        next()
            
    }else{
        res.status(403).json({
            message:"you are not signed up"
        })
    }
}

module.exports ={
    userMiddleware
}