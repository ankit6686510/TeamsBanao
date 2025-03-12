const express = require('express');

const app =  express();

app.use("/",(req,res) => {
    res.send("namaste from dashboard");


});

app.use("/hello",(req,res) =>{
    res.send("hello hello hello!!")
})

app.use("/test",(req,res) =>{
    res.send("hello from server")
});

app.listen(777,() =>{
    console.log("server is successfully listening on port 777")
});