// Import Express and CORS
import express from "express";
import cors from "cors";

import PDFDocument from "pdfkit";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.post("/generate-pdf", async (req, res) => {
  const { result, chartResults, tickerSymbol } = req.body;

  const url = iframeUrls[tickerSymbol];
  if (!url) {
    console.error("Invalid ticker symbol received:", tickerSymbol);
    return res.status(400).send("Invalid ticker symbol");
  }

  try {
    console.log(`Generating PDF for ${tickerSymbol}...`);

    // Create a PDF document
    const doc = new PDFDocument({ autoFirstPage: false });
    const filePath = path.join(__dirname, `stock_analysis_${tickerSymbol}.pdf`);

    // Pipe the document to a file
    const fileStream = fs.createWriteStream(filePath);
    doc.pipe(fileStream);

    // Add a page to the PDF for the textual result
    doc.addPage();
    doc.fontSize(12).text(result || "No textual analysis available.", {
      align: "left",
      width: 500,
      lineGap: 10,
    });

    doc.end();

    // Wait until the PDF is fully created, then send it to the client
    fileStream.on("finish", () => {
      console.log("PDF generated successfully. Sending it to the client.");
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=stock_analysis_${tickerSymbol}.pdf`
      );
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("Error sending PDF file:", err);
          res.status(500).send("Failed to send PDF");
        } else {
          fs.unlinkSync(screenshotPath);
          fs.unlinkSync(filePath);
        }
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF");
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

    const attachments = req.files.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: "application/pdf",
    }));

    // Define the email options, attaching the PDF from memory using its buffer
    const mailOptions = {
      from: process.env.USER_NM,
      to: "TradExBuilder@proton.me",
      subject: `Your stock analysis for ${tickeSymbol}`,
      text: "Please find the attached PDF files",
      attachments: attachments,
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
