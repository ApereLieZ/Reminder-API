const mongoose = require("mongoose");
const Schema = mongoose.Schema;



let userSchema = new Schema({
    name: String,
    login: {
        type: String,
        required: true,
        unique : true
        },
    password: String,
    email: {
        type: String,
        required: true,
        unique : true
        },
    age: Number
})

const User = mongoose.model("User", userSchema);

module.exports = User;