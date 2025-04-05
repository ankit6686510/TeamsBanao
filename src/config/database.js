const mongoose = require("mongoose");

const connectDb = async() =>{
    await mongoose.connect( 
        "mongodb+srv://ankit6686510:ankitjha@cluster0.enuhrms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/TeamsBanao"
    );

}
module.exports = connectDb;