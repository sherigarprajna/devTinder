const adminAuth = (req,res,next)=>{
const token = 'abc'
const authorisedtoken = token === 'abc'
console.log("authorisation!!!!");
if(!authorisedtoken){
    res.status(401).send('unauthorized')
}
next()
};

const userAuth = (req,res,next)=>{
const token = 'user'
const authorisedtoken = token === 'user1'

if(!authorisedtoken){
    res.status(401).send('unauthorized')
}
next()
};

module.exports={
    adminAuth,
    userAuth
}