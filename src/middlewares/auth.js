
const User = require("../models/user.js")
const jwt = require("jsonwebtoken");


const userAuth = async (req,res,next)=>{

    try{
    if(!req.cookies){
            throw new Error('cookie not found')
    }

    console.log(req);

    const {token} = req.cookies;


    if(!token){
        throw new Error("invalid token");
    }

    var decoded = await jwt.verify(token,'urs48#jfj')

    const {_id_} = decoded;

    let user_detail = await User.findById(_id_).exec();

    if(!user_detail){

     throw new Error('invalid user');
    }

    req.user = user_detail;

    next()
}
catch(err){
    res.status(400).send('error:'+err.message);
}
}



module.exports = {
userAuth
};