const mongoose  =  require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required : true,
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email" + value);
                
            }
            
        },
       
    },
    password:{
        type:String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password" + value);
                
            }
            
        },
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male" , " female" , "other"].includes(value)){
                throw new Error("invalid gender")
            }
        }
    },
    photoUrl:{
        type:String,
        default : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid photo url" + value);
                
            }
            
        },
    },
    about : {
        type : String,
        default: " ",
    },
    skills : {
        type : [String],
    },
   



},
{
    timestamps:true,
}
);
userSchema.methods.getJwt =  async function(){

    const  user = this;
   const token =  await jwt.sign({ _id: user._id }, "Ankitkumarjha@123",{
        expiresIn: "7d",
      });
      return token;
};
userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

module.exports =  mongoose.model("user",userSchema);