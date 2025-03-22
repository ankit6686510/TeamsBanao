const express = require("express");

const app = express();

//this will method only handle get call to /user
app.get("/user",(req,res)=>{
    res.send({firstname:"ankit" , secondname: "jha"});

});
app.post("/user",(req,res)=>{
    res.send("data successfully saved to db");
});
app.delete("/user",(req,res)=>{
    res.send("user is deleted successfully");
})

//this will match all the http method api call to /test
app.use("/test", (req, res) => {
  res.send("hello from server");
});


app.listen(777, () => {
  console.log("server is successfully listening on port 777");
});
