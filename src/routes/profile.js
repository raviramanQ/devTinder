const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const {validateEditProfileData} = require("../utils/validation.js");


profileRouter.get("/profile/view",userAuth,async (req,res)=>{

    try{
    
        res.send({message:'user----',user:req.user});
    
    }
    catch(err){
    
        res.status(400).send("ERROR---- : " + err.message);
    
    }
    });


profileRouter.patch("/profile/edit",userAuth,async (req,res) => {

    try{

      const isValidEditData = validateEditProfileData(req);

      if(!isValidEditData){

        throw new Error("invalid data");
      }

      const loggedInUser = req.user;

      Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));

      await loggedInUser.save();

      res.send("profileUpdate successfully");


    }
    catch(err){

        res.status(400).send("error :" + err.message);
    }

});


profileRouter.patch("/profile/editPassword")
module.exports = profileRouter;
