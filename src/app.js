const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation.js")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());

app.use(cookieParser());

app.post("/signup",async (req,res) => {
    try{
    // validate data

    validateSignUpData(req);

    const {firstName,lastName,emailId,password} = req.body;

    // Encrypt the password

    const passwordHash = await bcrypt.hash(password,10);

    // console.log(passwordHash);

    // creating a new instance of the user model

    const user = new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash,
    });

   
    await user.save();
    res.send("user added successfully")
    }catch (err) {
        res.status(400).send("Error saving the user:" + err.message);
    }
});

app.post("/login",async (req,res) =>{
try{
    const {emailId,password} = req.body;


    const user = await User.findOne({ emailId: emailId}).exec();

    console.log(user._id);

    if(!user){
        throw new Error("invalid credentials");
        
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(isPasswordValid){
      
        // create a jwt token

        var token = jwt.sign({ _id_: user._id }, 'urs48#jfj');



        // Add the token to the cookie and send the response back to  the user

        res.cookie('token',token);



        res.send("Login Successfully");
    }
    else{
        throw new Error("invalid credentials");
        
    }
}catch (err){
    res.status(400).send("ERROR :" + err.message);
}
    
});

app.post("/profile",async (req,res)=>{

    try{

     const cookies = req.cookies;

    console.log(cookies);

    const {token} = cookies;

    if(!token){

        throw new Error('Invalid token');
    }    

    var decoded = jwt.verify(token, 'urs48#jfj');

    const { _id_ } = decoded;     
    // find user with this userId of mongoDB

    let  user_detail = await User.findById(_id_).exec();

    if(!user_detail){
        throw new Error('user not found');
    }

    res.send({message:'user----',user:user_detail})    
}
catch(err){

    res.status(400).send("ERROR---- : " + err.message);

}
})


app.post("/user",async (req,res)=>{

    // fetch user on the basis of email
    try{
         const user = await User.find({emailId: req.body.emailId});

         res.status(200).send(user);

    }catch (err) {
        res.status(400).send("error"+ err.message);
    }
    
});


app.get("/feed",async (req,res)=>{

    try{
        const users = await User.find();
        res.send(users);
    }
    catch (err) {
        res.status(400).send("issue");
    }



});

app.post("/findOneUser",async (req,res)=>{

    try{
        const userOne = await User.findOne({emailId: req.body.emailId}).sort({age:1});

        res.send(userOne);
    }
    catch (err) {
        res.status(400).send("issue");

    }
});


app.delete("/deleteUser", async(req,res)=>{
    try{
        const deleteUser = await User.findOneAndDelete({_id : req.body.userId});

        res.send(deleteUser);
    }
    catch (err){
        res.status(400).send("error");
    }
})

app.patch("/updateUserDetail/:_id", async(req,res)=>{

    const id = req.params?._id;
    
    const data = req.body;

    try{

        const ALLOWED_UPDATES  = ["_id","photoUrl","about","age","emailId","skills","gender"];

        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWED_UPDATES.includes(k)
        
        );

       if(!isUpdateAllowed){

           throw new Error("Update not allowed");
       }
       console.log(typeof data?.skills);
  
    console.log( data?.skills.length);

       if(data?.skills.length > 5)
       {
        console.log('-----');
        
        throw new Error("limit exceeds for skills");

       }

// return;

        const updateUser = await User.findByIdAndUpdate({_id:id},data, {
        returnDocument:"after",
        runValidators:true,

        });

        res.status(200).send("data updated successfully"+updateUser);
    }
    catch (err){
        res.status(400).send("error"+err.message);


    }
})

app.put("/updateUserDetailPut", async(req,res)=>{

    const id = req.body._id;
    
    const data = req.body;

    try{
        const updateUser = await User.replaceOne({_id:id},data, {
        returnDocument:"after",
        });

        res.status(200).send("data updated successfully"+updateUser);
    }
    catch (err){
        res.status(400).send("error");


    }
})


connectDB().then(()=>{
    console.log("DB connected");
    app.listen(3000, ()=>{
        console.log('congratulation my server is running')
    });
}).catch(err=>{
    console.error("Database cannot be established");
});



