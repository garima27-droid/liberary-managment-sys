const express = require("express");
const { log } = require("node:console");

const app = express()

const PORT = 8081;

app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).json({
        message: "Home page:-)"
    })
})
// app.all('*',(req,res)=>{                 // it will handle any other methods
//  res.status(500).json({
//   message:"Not Build Yet"
//  })
// })
  app.listen(PORT,()=>{
    console.log(`Server listning and running on http://localhost:${PORT}`);
    
  })