const UserDB = require("../db/models/user");
const { Worker } = require("worker_threads");


function start() {
    const worker = new Worker("./app/sendWorker.js");
    UserDB.on("setRecord", (recordData) => {
        recordData.type = "set";
        worker.postMessage(JSON.stringify(recordData));
    })
}

module.exports = start;