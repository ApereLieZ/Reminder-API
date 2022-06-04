const { workerData, parentPort, BroadcastChannel } = require("worker_threads");
const UserDB = require("../db/models/user");
const mongoose = require("mongoose");
const mailer = require("./mailer");
const NoticeManager = require("./NoticeManager");


const noticeManager = new NoticeManager(notify);


async function connect() {
    await mongoose.connect("mongodb://localhost:27017/reminder", {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

async function notify(user, record) {
    console.log(record.text)
    await mailer(user.email, record.text);
    noticeManager.deleteNotice(user._id, record._id);
    await UserDB.deleteRecordByID(user._id, record._id);
}

async function initArray() {
    try {
        await connect();
        await noticeManager.InitTimers();

    } catch (e) {
        console.log(e);
    }

}
initArray();

parentPort.on("message", (jsonObject) => {

    const userWithRecord = JSON.parse(jsonObject);
    if (userWithRecord.type === "set") {
        delete userWithRecord.type;
        noticeManager.addTimer(userWithRecord);
    }


})