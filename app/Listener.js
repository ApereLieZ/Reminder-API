const UserDB = require("../db/models/user");
const { Worker } = require("worker_threads");





function start() {
    const worker = new Worker("./app/sendWorker.js");
    UserDB.on("setRecord", (recordData) => {
        worker.postMessage(recordData);
    })
}

module.exports = start;