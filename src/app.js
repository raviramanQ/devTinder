const express = require("express")
const {adminAuth,userLoginAuth} = require("./middlewares/auth");

const app = express();


// app.use("/admin",adminAuth);
// app.get("/admin/getAllData",adminAuth,(req,res)=>{
//     console.log('come4');
//     res.status(200).send("success4");
// })

// user login auth 

// app.get("/login/getdetails",userLoginAuth,(req,res)=>{
//     res.status(200).send("login successfully");
// })
app.use("/error",(req,res,next)=>{
    console.log('ppsssss');
    
    // if(err){
    //     res.status(500).send("something went wrong");
    // }
});
app.get("/error/handling",(req,res)=>{
    console.log('ppp');
    
    throw new Error("errroooorrrooor");

    res.send("user data send");
})

// app.use("/",(req,res)=>{

//     console.log(req.params);
//     // res.send({
//     //     name:"Ram",
//     //     age:"Infinite"
//     // });
// })

// app.get("/data",(req,res)=>{

//     console.log(req.params);
//     res.send({
//         name:"ravi",
//         age:"28"
//     });
// })


app.listen(3000, ()=>{
    console.log('congratulation my server is running')
});


// till here we have created a server and our server is listening at port 3000.




// app.use("/car",(req,res)=>{   // request  handler
//     res.send("this is mercedes car page siayram");
// });
// app.use("/",(req,res)=>{
//     res.send("this is main");
// });

// # dynamic route req.params
// app.get("/data/:dataId/:makeId",(req,res)=>{

//     console.log(req.params);
//     res.send({
//         name:"ravi",
//         age:"28"
//     });
// })

// app.use("/",(req,res)=>{

//     console.log(req.params);
//     res.send({
//         name:"Ram",
//         age:"Infinite"
//     });
// })

// app.get("/data",(req,res)=>{

//     console.log(req.params);
//     res.send({
//         name:"ravi",
//         age:"28"
//     });
// })



// app.post("/data",(req,res,next)=>{
//     res.send("post request3");
//     next();
// },(req,res)=>{
//    res.send("post response 2");
// })


// admin auth

// app.use("/admin",(req,res,next)=>{
//     const token = "Manshi@123";
//     console.log('come1');
//     const isValidAuth = token == "Manshi@123";

//     if(!isValidAuth)
//     {
//         res.status(401).send("Unauthorized User");
    
//     }
//     else{
//         console.log('ooo');
        
//         next();
//     }
// });
