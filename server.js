require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// ======================
// EMAIL TRANSPORTER
// ======================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ======================
// HEALTH CHECK
// ======================

app.get("/", (req, res) => {
    res.send("Backend Running ❤️");
});

// ======================
// TEST EMAIL
// ======================

app.get("/test-mail", async (req, res) => {

    try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL,
            subject: "Backend Test Email",
            text: "If you received this email, Nodemailer is working correctly."
        });

        res.send("Test Email Sent Successfully ✅");

    } catch (err) {

        console.error("MAIL ERROR:", err);

        res.status(500).send(`
            Email Failed ❌

            ${err.message}
        `);

    }

});

// ======================
// DATE RESPONSE API
// ======================

app.post("/api/date-response", async (req, res) => {

    try {

        const { response } = req.body;

        console.log("Received Response:", response);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL,
            subject: "Shreeya Birthday Website Response ❤️",
            html: `
                <h2>New Response Received</h2>

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

        res.status(200).json({
            success: true,
            message: "Email Sent Successfully"
        });

    } catch (error) {

        console.error("API ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

// ======================
// START SERVER
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`
==================================
Server Running ❤️
Port: ${PORT}
==================================
`);

});
