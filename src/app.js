const express = require('express')

const app = express();
const {adminAuth,userAuth} = require("../middlewers/auth")


app.use("/admin",adminAuth)

app.get("/user",userAuth,(req,res)=>{
    throw new Error("Error....")
res.send("user success")
})

app.get("/admin/getUser",(req,res)=>{
res.send("get success")
});

app.get("/admin/deleteUser",(req,res)=>{
    res.send("delete user api success")
});

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("Something went wrong")
    }
})


app.listen(3000,()=>{
    console.log("Server is Running successfully..")
})