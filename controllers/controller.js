
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

        const abb = await user.save();
        
        let token = jwt.sign(req.body, secureKey);
        res.send(token); 
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

exports.getLogin = async function(req, res) {
    if (!req.body) return res.sendStatus(400);
    try {
        const result = await User.findOne({login: req.body.login, password: req.body.password});
        if(result){
            res.send(result);
        }else{
            res.send("No User");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

exports.AuthCheck = function(req, res, next) {
    try {
        if (!req.headers.authorization) {
            res.status(403).json({ message: "Not autorize" });
        } else {
            const decoded = jwt.verify(req.headers.authorization, secureKey);
        }

    }
    catch (e) {
        console.log(e);
        res.status(403).json({ message: e });
    } finally {
        next();
    }
}