const express = require("express");

const app = express();

app.use((req,res)=>{
    res.send("Hello from the server! Ravi");
    
})

app.get('/about', (req, res) => {
    res.send('About Page');
});

app.listen(3000,()=>{
    console.log("server is listening on port 3000...");
    
});