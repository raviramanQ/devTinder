const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user")

app.use(express.json());




app.post("/signup",async (req,res) => {
    // creating a new instance of the user model

    const user = new User(req.body);

    try{
    await user.save();
    res.send("user added successfully")
    }catch (err) {
        res.status(400).send("Error saving the user:" + err.message);
    }
});


app.post("/user",async (req,res)=>{
console.log('ooo',req.body);

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

app.patch("/updateUserDetail", async(req,res)=>{

    const id = req.body._id;
    
    const data = req.body;

    try{
        const updateUser = await User.findByIdAndUpdate({_id:id},data, {
        returnDocument:"after",
        runValidators:true

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



