const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user.model");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json()); // middleware to parse JSON data
app.use(cookieparser());

// Sign up route
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
//profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    // const cookies = req.cookies;
    // const { token } = cookies;

    // if (!token) {
    //   throw new Error("invalid token");
    // }

    // const decodedMessage = await jwt.verify(token, "Ankitkumarjha@123");
    // console.log(decodedMessage);

    // const { _id } = decodedMessage;
    // console.log("the logged in user is " + _id);

    const user = req.user;
   

    // console.log(cookies);
    res.send(user);
    // to read a cookie we need cookie parser as it parse
  } catch (err) {
    res.status(400).send("unabale to fetch the profile " + err.message);
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const foundUser = await User.findOne({ emailId: userEmail });
    if (!foundUser) return res.status(404).send("User not found");
    res.status(200).json(foundUser);
  } catch (err) {
    res.status(400).send("Error retrieving user: " + err.message);
  }
});

// Feed - get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

// Delete user by ID
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

// Update user details
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

// Health check route
app.get("/health", (req, res) => {
  res.send("Server is healthy and running");
});

// Start the server
connectDb()
  .then(() => {
    console.log("Database connection established successfully...");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
