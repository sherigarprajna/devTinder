const express = require('express')

const app = express();
const {adminAuth,userAuth} = require("../middlewers/auth")


app.use("/admin",adminAuth)

app.get("/user",userAuth,(rrq,res)=>{
res.send("user success")
})

app.get("/admin/getUser",(req,res)=>{
res.send("get success")
});

app.get("/admin/deleteUser",(req,res)=>{
    res.send("delete user api success")
});



app.listen(3000,()=>{
    console.log("Server is Running successfully..")
})