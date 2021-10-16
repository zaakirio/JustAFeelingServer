const express = require('express')
const cors = require('cors')
const user_router = require('./router/user')
const port = process.env.PORT
require('./config/db')

const app = express()

//app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())
app.use(user_router)


app.listen(port, () => {
  console.log(`Server is up and running :-) on port ${port}`)})

