const express = require("express");
const mongoose = require("mongoose");
const router = require("./routers/router");
const auth_router = require("./routers/auth_router");
const cookieParser = require("cookie-parser");
const listener = require("./app/Listener")();

const PORT = 8080;

const app = new express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(router);
app.use(auth_router);

function listen() {
    app.listen(PORT, () => {
        console.log("Server started localhost:" + PORT)
    })
}

function connect() {
    mongoose.connection
        .on('error', console.log)
        .on('disconnected', connect)
        .once('open', listen);
    return mongoose.connect("mongodb://localhost:27017/reminder", {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

// UserDB.on("setRecord", (email, recordData) => {
//     console.log("WORKER CHEEECK");
// })

connect();

