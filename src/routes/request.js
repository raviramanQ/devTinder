const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");


requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res) => {

    try{

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const isAllowedStatus = ["ignored","interested"];

        if(!isAllowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type: " + status});
        };

        // is toUsedId exist in db

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message:"user not found"});
        }

        // if there is already existing connection request in db

        const isExistConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId, toUserId},
                {fromUserId:toUserId , toUserId:fromUserId},
            ],
        });

        if(isExistConnectionRequest){
           return res.status(400).json({message:"Connection request already exist"});
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
           
        });

        const data = await connectionRequest.save();

        res.json({
            message: `${req.user.firstName} is ${status} ${status === 'interested' ? 'in' : ''} ${toUser.firstName}`,
            data,
        });


    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
    
    });


module.exports = requestRouter;
