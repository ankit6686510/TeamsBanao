const jwt =  require("jsonwebtoken");
const user = require("../models/user.model");
const userAuth = async (req, res, next) =>{
    try{ 
    //read the token from the req cookies

    // const cookies = req.cookies;
    const {token} = req.cookies
    if(!token){
        throw new Error("token not found")
    }

    const decodedObject =  jwt.verify(token , "Ankitkumarjha@123");

    const  { _id } = decodedObject;
    const user = await user.findById(_id); 
    
    if(!user){
        throw new Error("user not found")
    }
    req.user = user;
    next();
}
catch(err){
    res.status(401).send("Unauthorized")
}
     
   

}
module.exports = {
    userAuth

};