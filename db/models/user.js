const mongoose = require("mongoose");
const Schema = mongoose.Schema;



let userSchema = new Schema({
    name: String,
    login: {
        type: String,
        required: true,
        unique : true
        },
    password: {
        type: String,
        required: true
        },
    email: {
        type: String,
        required: true,
        unique : true
        },
    age: {
        type: Number,
        min:18,
        max: 120,
        required:true
    },
    records: [
        {
            time: {type: Date},
            text: {type: String}
        }
    ]
})

const User = mongoose.model("User", userSchema);

module.exports = User;