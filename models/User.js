const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
})

// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Generate auth token for user
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//Verify credentials, username lookup
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({username} )
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User