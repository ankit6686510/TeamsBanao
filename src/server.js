const express = require("express");
const connectDb = require("./config/database");

const cookieparser = require("cookie-parser");

const app = express();
app.use(express.json()); // middleware to parse JSON data
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);

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
