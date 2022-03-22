const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv/config')

const api = process.env.API_URL
const cors = require('cors')
const morgan = require("morgan")
const userRouter = require('./modules/users/userRouter')


app.use(cors())

// for displaying http requests on the console 
app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded())
app.use(`${api}/users`, userRouter)

mongoose.connect('mongodb://localhost:27017/user-auth');
app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`)
})
