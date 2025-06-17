const express = require('express')

const app = express();


// app.use("/hello",(req,res)=>{
//     res.send("Hello Hello Hello")
// })
// app.use("/test",(req, res)=>{            // response handler
//     res.send("Hello From the server.!11122ee")
// })

// app.get("/user",(req,res)=>{
//     res.send({firstName: 'Sherigar',secondName: 'Prajna'})
// })

app.get("/user",[(req,res,next)=>{
console.log("response hander 1");
// res.send("Respons1")
next();
},(req,res,next)=>{
console.log("response hander 2");
res.send("Respons2")
}]
)
app.listen(3000,()=>{
    console.log("Server is Running successfully..")
})