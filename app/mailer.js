const nodemailer = require("nodemailer");
require("dotenv").config();
async function SendNotification(email, text) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAILPASSWORD
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'Reminder API <nodejsyivanov@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "yivanov", // Subject line
        text: "notification from reminder API", // plain text body
        html: `<b>${text}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = SendNotification;