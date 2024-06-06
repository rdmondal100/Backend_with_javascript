require("dotenv").config()
const express = require('express')
const app = express()
const port = 3000

app.get('/',(req,res)=>{
  res.send("Hello wrold")
})


app.get('/twitter',(req,res)=>{
  res.send("Twitter navigating")
})


app.get('/login',(req,res)=>{
  res.send("<b>Trying to login  </b>")
})

app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${port}`)
})