const mongoose = require('mongoose');

// @admin schema
const adminSchema = new mongoose.Schema({
    type: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
})


// @user schema model
const userSchema = new mongoose.Schema({
    type: {
        required: true,
        type: String
    },
    fname: {
        required: true,
        type: String
    },
    lname: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    age: {
        required: true,
        type: String
    },
    phoneNumber: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String,
    }
})

// defined model for agent
const agentSchema = new mongoose.Schema({
    type: {
        required: true,
        type: String
    },
    fname: {
        required: true,
        type: String
    },
    lname: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    age: {
        required: true,
        type: String
    },
    phoneNumber: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String,
    }
})

// Property Schema
const propertySchema = new mongoose.Schema({
    agentId: {
        type: String,
        required: true
    },
    type: {
        type: String,
    },
    address: {
        type: String,
    },
    area: {
        type: String,
    },
    price: {
        type: String,
    },
    city: {
        type: String
    },
    zip: {
        type: String
    },
    image: {
        type: String,
    },
    bookedBy: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// @create admin collection
const adminCollection = mongoose.model("admin_", adminSchema);

// @create user collection
const userCollection = mongoose.model("userRegisteration", userSchema);

// @create agent collection
const agentCollection = mongoose.model("agentRegister", agentSchema);

// @create property
const propertyCollection = mongoose.model("properties", propertySchema);

// export all collections
module.exports = { userCollection, agentCollection, propertyCollection, adminCollection }