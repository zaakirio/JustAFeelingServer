const mongoose = require('mongoose')
//Connection 
mongoose.connect(
    process.env.CONNECTION_STRING, {
    useNewUrlParser: true
})