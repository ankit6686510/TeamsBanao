const express = require("express");
const authRouter =  express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");




// Sign up route
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt password
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

// Login route
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Email id is not valid");
    }

    const isPasswordValid = await user.validatePassword(password);


    if (isPasswordValid) {
      //create a jwt token
      const token = await user.getJwt();

      // console.log(token);

      //add token in cookie and send response to client
      res.cookie("token", token ,{expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } );

      res.send("Login successful");
    } else {
      throw new Error("Login failed: Incorrect password");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//logout routes

authRouter.post("/logout" , async(req,res)=>{

    res.cookie("token" , null,{
        expires:new Date(Date.now()),

    })
    res.send("Logout successful");

})





module.exports = authRouter;
    

