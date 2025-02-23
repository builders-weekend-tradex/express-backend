// Import Express and CORS
import express from "express";
import cors from "cors";

// Import external API call functions
import { getLexiChat } from "./apiCalls/lexi.js";
import { getStockAnalysis } from "./apiCalls/getStockAnalysis.js";

// Mailing imports
import multer from "multer";
import nodemailer from "nodemailer";

// Mailing utilities
const upload = multer();

// Import utility functions
import { removingBrackets } from "./utils/removingBrackets.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.post("/lexi", async (req, res) => {
  const { tickerSymbol } = req.body;

  if (!tickerSymbol) {
    return res.status(400).json({ error: "tickerSymbol is required" });
  }

  try {
    const responseFromLexi = await getLexiChat(tickerSymbol);
    const messageToStream = removingBrackets(
      responseFromLexi.choices[0].message.content
    );
    res.status(200).json(messageToStream);
  } catch (error) {
    console.error("Error calling getLexiChat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/stockAnalysis", async (req, res) => {
  const { tickerSymbol } = req.body;

  if (!tickerSymbol) {
    return res.status(400).json({ error: "tickerSymbol is required" });
  }

  try {
    const stockAnalysisResponse = await getStockAnalysis(
      "JayLacoma/Stock_Market_Analysis",
      tickerSymbol
    );
    return res.status(200).json(stockAnalysisResponse);
  } catch (error) {
    console.error("Error in stock analysis route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Create a transporter using your SMTP settings (e.g., Gmail or any SMTP provider)
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your chosen email service
      auth: {
        user: process.env.USER_NM,
        pass: process.env.PASSWORD_NM,
      },
    });

    // Define the email options, attaching the PDF from memory using its buffer
    const mailOptions = {
      from: process.env.USER_NM,
      to: "TradExBuilder@proton.me",
      subject: "Your PDF Attachment",
      text: "Please find the attached PDF file.",
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully.");
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("An error occurred while sending the email.");
  }
});

app.listen(PORT, () => {
  console.log(`The app is listening on port: ${PORT}`);
});
