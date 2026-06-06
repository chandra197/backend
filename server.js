require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
    res.send("Backend Running ❤️");
});

app.get("/test-mail", async (req, res) => {

    try {

        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: process.env.NOTIFICATION_EMAIL,
            subject: "Backend Test Email",
            html: "<p>Resend is working ✅</p>"
        });

        res.json(data);

    } catch (err) {

        console.error(err);

        res.status(500).json(err);

    }

});

app.post("/api/date-response", async (req, res) => {

    try {

        const { response } = req.body;

        await resend.emails.send({
            from: "onboarding@resend.dev",
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

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
