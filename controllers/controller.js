
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secureKey = process.env.SECUREKEY;;
const UserDB = require("../db/models/user");


exports.postRegister = async function (req, res) {
    if (!req.body) return res.sendStatus(400);

    try {
        let user = await UserDB.setUser(req.body)

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


exports.getLogin = async function (req, res) {
    if (!req.body) return res.sendStatus(400);
    try {
        const user = await UserDB.getUser(req.body);
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




