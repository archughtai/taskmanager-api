const mongoose = require('mongoose');
var validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task.js')




const userSchema = new mongoose.Schema({
    name: {
        type: String, required: true, trim: true
    },
    tokens: [{ token: { type: String, required: true } }],
    age:
    {
        type: Number,
        validate(value) {
            if (value < 0) { throw new Error('Age must be a positive number') }
        },
        default: 0
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) { throw new Error('Email is invalid') }
        }
    },
    password: {
        type: String,
        minLength: [7, "provide more than 6 letters"],
        //[6, "Atleast 6 characters required"],
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('Password cannot be password')
            }
        }
    },
    avatar:{type:Buffer}

}, {timestamps: true});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
   
    return userObject
}

//methods are accessible to instances
userSchema.methods.generateAuthToken = async function () {
    //   console.log('hi')
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    // console.log(token)
    //const arr= [{token:token}]
    user.tokens = user.tokens.concat({ token: token })
    await user.save()
    return token
}

//Schema Statics are methods that can be invoked directly by a Model 
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({ email: email })
    //   console.log(email)
    if (!user) { throw new Error('Unable to login') }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) { throw new Error('Unable to login') }
    // console.log('hi')
    //  console.log(user)
    return user

}


//hash the plain text password before saving, this is middleware
userSchema.pre('save', async function (next) {
    //ismodified is mongoose functionality
    //this is user in this cases
    const user = this
    if (user.isModified('password')) {
        //        console.log('hi3')
        user.password = await bcrypt.hash(user.password, 8)
    }
    //    console.log('hiii')
    // console.log(this.password)
    next()
})

//delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})


const User = mongoose.model('User', userSchema);

module.exports = User