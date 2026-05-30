import express, { json } from "express";
import { createTransport } from "nodemailer";
import { config } from "dotenv";

config();

const app = express();
app.use(json());

const transporter = createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_REC,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}

${message}
      `,
    });

    res.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
