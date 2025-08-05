const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");



// Get all the pending request for the loggedIn user
userRouter.get("/user/request/received",userAuth, async (req,res) => {

    try{

        const allRequestsReceived = await ConnectionRequest.find({
            toUserId : req.user._id,
            status : "interested"
        }).populate("fromUserId", ["firstName","lastName","age","gender","about","skills"]);

        res.json({
            message:"data fetch successfuly",
            data : allRequestsReceived,
        });

    }
    catch(err){

      res.status(400).send("Error :" + err);
    }

    

});

userRouter.get("/user/connections",userAuth, async (req,res) =>{

    try{

        const allConnections = await ConnectionRequest.find({

            $or: [
                { fromUserId : req.user._id , status : "accepted"},
                {toUserId : req.user._id , status : "accepted"}
            ]

        }).populate("fromUserId", ["firstName","lastName","age","gender","about","skills"]).
        populate("toUserId", ["firstName","lastName","age","gender","about","skills"]);;

        const data = allConnections.map((row) => {
            if(row.fromUserId._id.toString() === req.user._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({data});

    }
    catch(err){
        res.status(400).send("Error : " + err);
    }
});

module.exports = userRouter;

