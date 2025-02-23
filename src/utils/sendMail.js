import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

const createMailOptions = (stockSymbol) => ({
  from: {
    name: "TradEx",
    address: process.env.USER,
  },
  to: ["TradExBuilder@proton.me"],
  subject: `Here is your daily analysis for ${stockSymbol}`,
  text: "", // Plain text body
  html: "<b>Here is your daily analysis report for.</b>", // HTML body
});

const sendMail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendMail, transporter, createMailOptions };
