const express = require("express");

const app = express();

const PORT = process.env.PORT || 6969;

app.get('/', (req,res)=>{
  return res.json({message: 'Hey from Docker 🐋'});
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})