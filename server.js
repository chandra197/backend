require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// =====================================
// NODEMAILER CONFIG
// =====================================

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    logger: true,
    debug: true
});

// =====================================
// ROOT ROUTE
// =====================================

app.get("/", (req, res) => {
    res.send("Backend Running ❤️");
});

// =====================================
// ENVIRONMENT CHECK
// =====================================

app.get("/env-check", (req, res) => {

    res.json({
        EMAIL_USER: process.env.EMAIL_USER || "Missing",
        EMAIL_PASS_EXISTS: !!process.env.EMAIL_PASS,
        NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || "Missing"
    });

});

// =====================================
// SMTP VERIFY
// =====================================

app.get("/verify", async (req, res) => {

    try {

        console.log("Starting SMTP verification...");

        await transporter.verify();

        console.log("SMTP verification successful");

        res.send("SMTP Connection Successful ✅");

    } catch (err) {

        console.error("VERIFY ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message,
            code: err.code,
            command: err.command
        });

    }

});

// =====================================
// TEST EMAIL
// =====================================

app.get("/test-mail", async (req, res) => {

    try {

        console.log("Sending test email...");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL,
            subject: "Backend Test Email",
            text: "If you received this email, Nodemailer is working correctly."
        });

        console.log("Mail sent:", info.messageId);

        res.send("Test Email Sent Successfully ✅");

    } catch (err) {

        console.error("MAIL ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message,
            code: err.code,
            command: err.command
        });

    }

});

// =====================================
// BIRTHDAY RESPONSE ENDPOINT
// =====================================

app.post("/api/date-response", async (req, res) => {

    try {

        const { response } = req.body;

        console.log("Received response:", response);

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL,
            subject: "Shreeya Birthday Website Response ❤️",
            html: `
                <h2>New Response Received ❤️</h2>

                <p>
                    <strong>Response:</strong>
                    ${response}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${new Date().toLocaleString()}
                </p>
            `
        });

        console.log("Mail sent:", info.messageId);

        res.status(200).json({
            success: true
        });

    } catch (err) {

        console.error("API ERROR:", err);

        res.status(500).json({
            success: false,
            message: err.message,
            code: err.code,
            command: err.command
        });

    }

});

// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`
===================================
Server Running ❤️
Port: ${PORT}
===================================
`);

});
