const { workerData, parentPort, BroadcastChannel } = require("worker_threads");
const UserDB = require("../db/models/user");
const mongoose = require("mongoose");
//const mailer = require("./mailer");
const { time } = require("console");

function mailer(text, email){
    console.log(text, email);
}

async function connect(){
     await mongoose.connect("mongodb://localhost:27017/reminder", {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

class Notice{
    timerArray = [];
    constructor(user){
        this.email = user.email;
        this.records = user.records;
        this.id = user._id;
        this.make();
    }

    make(){
        for(let record of this.records){
            let timeId = setTimeout(mailer, this.toSeconds(record.time), this.email, record.text);
            this.timerArray.push({timeId: timeId, recordID: record._id});
            console.log("Iter");
        }
        console.log("done")
    }



    toSeconds(time) {
        const planTime = new Date(time).getTime();
        return planTime - Date.now();
    }
}

let timeOutArray = [];

async function initArray() {
    try {
        await connect();
        const userArray = await UserDB.getAllRecordsWithEmail();
        for(let user of userArray){
            timeOutArray.push(new Notice(user))
        }
    }catch (e){
        console.log(e);
    }
    
}
initArray();

parentPort.on("message", (obj) => {
    console.log(obj);
})