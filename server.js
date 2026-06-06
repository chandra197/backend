require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post("/api/date-response", async (req, res) => {

    try {

        const { response } = req.body;

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

        res.json({
            success: true
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false
        });

    }

});

app.get("/", (req, res) => {
      try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL,
            subject: "Render Email Test",
            text: "If you received this, email is working."
        });

        res.send("Email Sent Successfully");

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }
   
});

app.listen(process.env.PORT, () => {

    console.log(
        `Server running on port ${process.env.PORT}`
    );

});
