const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 12,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
        //maxLength: 50
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

const User = mongoose.model("user", userSchema);

module.exports = User;
