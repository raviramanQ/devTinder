const express = require("express")

const app = express();

// till here we have created a server and our server is listening at port 3000.




// app.use("/car",(req,res)=>{   // request  handler
//     res.send("this is mercedes car page siayram");
// });
// app.use("/",(req,res)=>{
//     res.send("this is main");
// });


app.get("/data/:dataId/:makeId",(req,res)=>{

    console.log(req.params);
    res.send({
        name:"ravi",
        age:"28"
    });
})

app.post("/data",(req,res)=>{
    res.send("post request");
})



app.listen(3000, ()=>{
    console.log('congratulation my server is running')
});

