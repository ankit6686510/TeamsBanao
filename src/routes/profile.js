const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

//profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("unabale to fetch the profile " + err.message);
  }
});

//profile edit api
profileRouter.patch("/profile/edit",userAuth , async (req,res) =>{
    try {
        


    }
    catch(err){

    }
})

module.exports = profileRouter;
