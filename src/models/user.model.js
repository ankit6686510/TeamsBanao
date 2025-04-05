const mongoose  =  require("mongoose");
const validate =  require("validator");

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
module.exports =  mongoose.model("user",userSchema);