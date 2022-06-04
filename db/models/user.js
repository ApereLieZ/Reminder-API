const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventEmmiter = require("events");



let userSchema = new Schema({
    name: String,
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        min: 18,
        max: 120,
        required: true
    },
    records: [
        {
            time: { type: Date },
            text: { type: String }
        }
    ]
})

const User = mongoose.model("User", userSchema);

class UserDB extends EventEmmiter {
    async setUser(userData) {
        try {
            const user = new User({
                name: userData.name,
                login: userData.login,
                password: userData.password,
                email: userData.email,
                age: userData.age
            })

            await user.save();
            return user;

        } catch (err) {
            throw err;
        }
    }

    async getUser(userData) {
        try {
            const user = await User.findOne({ login: userData.login, password: userData.password });
            return user;
        } catch (err) {
            throw err;
        }
    }

    async getAllRecordsWithEmail() {
        try {
            const UserArr = await User.find().select("email records");
            return UserArr;
        } catch (error) {
            console.log(err);
            throw err;
        }
    }

    async setRecord(userID, recordData) {
        try {
            const user = await User.findOneAndUpdate({ _id: userID }, {
                $push: { records: recordData }
            }, { new: true })
            
            let recordNewElement = await User.aggregate([
                { $project: { id: 1, records: { $slice: [ "$records", -1 ] } } }
             ]);
            this.emit("setRecord", { _id: userID, email: user.email, records: {_id : recordNewElement[0]._id, ...recordData} });
        } catch (err) {
            console.log(err);
            throw err;
        }

    }

    async getRecords(userID) {
        try {
            const data = await User.findById(userID).select("records");

            const records = data.records;
            return records;

        } catch (err) {
            throw err;
        }

    }

    async deleteRecordByID(userID, recordID) {
        try {
            const response = await User.updateOne(
                { _id: userID },
                { $pull: { records: { _id: recordID } } }
            )
            this.emit("deleteRecord", { userID: userID, recordID: recordID });
        } catch (err) {
            throw err;
        }
    }

    async deleteAllRecords(userID) {
        try {
            const response = await User.updateOne(
                { _id: userID },
                { $set: { records: [] } }
            )
            this.emit("deleteRecord", { userID: userID });
        } catch (err) {
            throw err;
        }
    }
}


const exportUser = new UserDB;

module.exports = exportUser;