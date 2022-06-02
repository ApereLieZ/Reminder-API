
const { send } = require("express/lib/response");
const jwt = require("jsonwebtoken");
const secureKey = "adawdiaefsjkjnAWDJoAdjioAWJDop";
const User = require("../db/models/user");


exports.postRegister = async function (req, res) {
    if (!req.body) return res.sendStatus(400);

    try {

        const user = new User({
            name: req.body.name,
            login: req.body.login,
            password: req.body.password,
            email: req.body.email,
            age: req.body.age
        })

        await user.save();

        let token = jwt.sign({
            data: user,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        }, secureKey);
        res.send(token);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

exports.deleteRecord = async function(req, res) {
    if(!req.body || !req.body.id){
        return send("No id")
    }
    try{
        const response = await User.updateOne(
            {_id: req.user._id},    
            { $pull: { records: {_id: req.body.id} }}
        )

        res.send(response);
    }catch(e){
        res.send(e.message);
        console.log(e);
    }
}

exports.deleteAllRecords = async function(req, res) {
    try{
        const response = await User.updateOne(
            {_id: req.user._id},
            {$set: {records : []}}
        )
        res.send("ok");
    }catch(e){
        res.send(e.message);
    }
}

exports.setRecord = async function (req, res) {
    if (!req.body) {
        return send("No date and time")
    } else if (!req.body.text || !req.body.date) {
        return res.send("no data or text")
    }
    try {
        let dateOfRemind = new Date(+req.body.date).getTime();
        if (dateOfRemind <= Date.now())
            return res.send("incorect Data");
        
        let obj = {text: req.body.text, time: new Date(+req.body.date)}
        const user = await User.updateOne({_id: req.user._id}, {
            $push: {records: obj}
        })
        return res.send("ok");

    } catch {
        return res.send("incorect data");
    }




}

exports.getLogin = async function (req, res) {
    if (!req.body) return res.sendStatus(400);
    try {
        const user = await User.findOne({ login: req.body.login, password: req.body.password });
        if (user) {
            let token = jwt.sign({
                data: user,
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            }, secureKey);
            res.send(token);
        } else {
            res.send("No User");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}



exports.getRecords = async function (req, res) {
    const data = await User.findById(req.user._id).select("records");
    const records = data.records;
    console.log(data);
    if (records.length <= 0) {
        return res.send("No records")
    }
    res.send(records);
}

//midlware
exports.AuthCheck = function (req, res, next) {
    try {
        if (!req.headers.authorization) {
            res.status(403).json({ message: "Not autorize" });
            return
        } else {
            const decoded = jwt.verify(req.headers.authorization, secureKey);
            req.user = decoded.data;
        }

    }
    catch (e) {
        console.log(e);
        res.status(403).json({ message: e });
        return;
    } finally {
        next();
    }
}