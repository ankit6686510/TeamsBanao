const express = require("express");
const connectDb = require("./config/database");
const user = require("./models/user.model");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req.body);

    const {firstName,lastName,emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    req.body.password = passwordHash;

    const newUser = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await newUser.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

app.post("/login" , async (req,res) =>{
  try{
    const {emailId, password} = req.body;
    const user = await User.findOne({emailId:emailId});

    if(!user){
      throw new Error("Email id is not valid")
    }
    const isPasswordValid = await bcrypt.compare(password , user.password);

    if(isPasswordValid){
      res.send("login successfull")
    }else{
      throw new Error("login failed")
    }
    

  }
  catch(err){  
    res.status(400).send("Error" + err.message)

  }
})

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const foundUser = await User.findOne({ email: userEmail });
    if (!foundUser) return res.status(404).send("User not found");
    res.status(200).json(foundUser);
  } catch (err) {
    res.status(400).send("Error retrieving user: " + err.message);
  }
});

//feed api
app.get("/feed", async (req, res) => {
  try{
    const users = await User.find({});
    res.send(users);
  }
  catch(err){
    res.status(400).send("something went wrong: " + err.message); 
  }
})

//delete api
app.delete("/user/", async (req, res) => {
  const userId  = req.body.userId;
  try{
    const user =  await User.findByIdAndDelete({_id:userId});
    // const user =  await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  }
  catch(err){
    res.status(400).send("something went wrong: " + err.message);
  }
  
})


//updating user details
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const Allowed_Updates = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Updates.includes(k)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Update not allowed");
    }

    if (data?.skills && data.skills.length > 10) {
      throw new Error("Skills should be less than 10");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
  }
});

connectDb()
  .then(() => {
    console.log("Database connection established successfully...");
    app.listen(777, () => {
      console.log("Server is listening on port 777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
