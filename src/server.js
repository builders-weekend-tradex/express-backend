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

// PDF helpers
import path from "path";
import { fileURLToPath } from "url";

// Import utility functions
import { removingBrackets } from "./utils/removingBrackets.js";
import { createPDF, createPDFFromString } from "./utils/createPdf.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);

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

app.post("/email", async (req, res) => {
  const { tickerSymbol, email, result } = req.body;

  try {
    if (!tickerSymbol) {
      return res.status(400).send("Ticker symbol is required.");
    }

    const dataAnalysisPdf = await createPDF(tickerSymbol);
    const lexiData = await createPDFFromString(result);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_NM,
        pass: process.env.PASSWORD_NM,
      },
    });

    // Define the email options, properly attaching the PDF from buffer
    const mailOptions = {
      from: process.env.USER_NM,
      to: email || "TradExBuilder@proton.me",
      subject: `Your stock analysis for ${tickerSymbol}`,
      text: "Please find the attached stock analysis PDF.",
      attachments: [
        {
          filename: `${tickerSymbol}-stock-analysis.pdf`,
          content: dataAnalysisPdf,
          contentType: "application/pdf",
        },
        {
          filename: `${tickerSymbol}-lexi-analysis.pdf`,
          content: lexiData,
          contentType: "application/pdf",
        },
      ],
    };

    transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully.");
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("An error occurred while sending the email.");
  }
});

app.listen(PORT, () => {
  console.log(`The app is listening on port: ${PORT}`);
});
