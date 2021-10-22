const mongoose = require("mongoose");
//DB SCHEMA
const feelingSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 12,
        trim: true
    },
    feeling: {
        type: String,
        required: true,
        minLength: 50,
        maxLength: 1000,
        trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    }
});
//Access MongoDB
const Feeling = mongoose.model("feeling", userSchema);

module.exports = Feeling;