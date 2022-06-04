
const UserDB = require("../db/models/user");

class NoticeManager {
    userArr = []

    constructor(cb){
        this.cb = cb;
    }
   
    deleteNotice(UserID, recordID) {
        const result = this.userArr.filter(user => user._id === UserID)[0];
        for (let record of result.records) {
            if (record._id === recordID) {
                clearInterval(record.timerID);
                const index = result.records.indexOf(record);
                if (index > -1)
                    result.records.splice(index, 1);
                break;
            }
        }
    }

   

    

    async InitTimers() {
        this.userArr = await UserDB.getAllRecordsWithEmail();
        for (let user of this.userArr) {
            this.setTimers(user);
        }
        console.log("done")
    }

    setTimers(user) {
        for (let record of user.records) {
            this.setTimer(record, user)
        }
    }

    setTimer(record, user) {
        let timerID = setTimeout(this.cb, this.toSeconds(record.time), user, record);
        record.timerID = timerID;
        console.log("time set");

    }

    addTimer(userData) {
        let user = this.userArr.filter(user => user._id == userData._id)[0];
        if (user) {
            user.records.push(userData.records);
            this.setTimer(userData.records, { email: user.email, _id: user._id });
            // console.log("ok");
        }
    }


    toSeconds(time) {
        const planTime = new Date(time).getTime();
        return planTime - Date.now();
    }
}

module.exports = NoticeManager;