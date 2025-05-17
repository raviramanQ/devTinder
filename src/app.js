const express = require("express")

const app = express();

// till here we have created a server and our server is listening at port 3000.

app.use("/car",(req,res)=>{   // request  handler
    res.send("this is mercedes car page siayram");
});


app.use((req,res)=>{
    res.send("this is main");
});

app.listen(3000, ()=>{
    console.log('congratulation my server is running')
});

