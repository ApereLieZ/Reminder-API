
require("dotenv").config();
const secureKey = process.env.SECUREKEY;
const jwt = require("jsonwebtoken");
const UserDB = require("../db/models/user");


exports.getRecords = async function (req, res) {
    try {
        console.log(req.user)
        const records = await UserDB.getRecords(req.user._id);
        console.log(records)
        if (records.length <= 0) {
            return res.send("No records")
        } 
        res.send(records);
    }catch(e){
        res.send(e);
    }
}


exports.deleteRecord = async function (req, res) {
    if (!req.body || !req.body.id) {
        return send("No id")
    }
    try {
        const response = await UserDB.deleteRecordByID(req.body.id)
        res.send(response);
    } catch (e) {
        res.send(e.message);
        console.log(e);
    }
}

exports.deleteAllRecords = async function (req, res) {
    try {
        await UserDB.deleteAllRecords(req.body.id);
        res.send("ok");
    } catch (e) {
        res.send(e);
    }
}

exports.setRecord = async function (req, res) {
    if (!req.body) {
        return send("No date and text")
    } else if (!req.body.text || !req.body.date) {
        return res.send("no data or text")
    }
    try {
        let dateOfRemind = new Date(+req.body.date).getTime();
        if (dateOfRemind <= Date.now())
            return res.send("incorect Date");

        let recordData = { text: req.body.text, time: new Date(+req.body.date) }
        await UserDB.setRecord(req.user._id, recordData);
        return res.send("ok");

    } catch(e) {
        return res.send(e);
    }


}



exports.AuthCheck = function (req, res, next) {
    try {
        if (!req.headers.authorization) {
            res.status(403).json({ message: "Not autorize" });
            return
        } else {
            const userDataDecoded = jwt.verify(req.headers.authorization, secureKey);
            req.user = userDataDecoded.data;
        }
        next();

    }
    catch (e) {
        res.status(403).json({ message: e });
    }
}