const mongoose = require("mongoose");
//DB SCHEMA ie, requirements for posting a feeling
const feelingSchema = mongoose.Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     minLength: 4,
    //     maxLength: 12,
    //     trim: true
    // },
    feeling: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1000,
        trim: true
    },
    // tothevoid: {
    //     type: Boolean,
    //     required: true,
    // },
    
    date: {
      type: Date,
      required: true,
      default: Date.now
    }
});
//Access MongoDB
const Feeling = mongoose.model("feeling", feelingSchema);

module.exports = Feeling;