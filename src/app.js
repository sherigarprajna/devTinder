const express = require('express')

const app = express();


app.use("/hello",(req,res)=>{
    res.send("Hello Hello Hello")
})
app.use("/test",(req, res)=>{            // response handler
    res.send("Hello From the server.!11122ee")
})

app.listen(3000,()=>{
    console.log("Server is Running successfully..")
})