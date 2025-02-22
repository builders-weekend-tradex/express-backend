// Import Express and CORS
import express from "express";
import cors from "cors";

// Import external API call functions
import { getLexiChat } from "./apiCalls/lexi.js";
import { getStockAnalysis } from "./apiCalls/getStockAnalysis.js";

// Import utility functions
import { removingBrackets } from "./utils/removingBrackets.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// Array of client names for stock analysis
const stockAnalysisChoicesClientNames = ["JayLacoma/Stock_Market_Analysis"];

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
    const stockAnalysisResponse = await Promise.all(
      stockAnalysisChoicesClientNames.map(async (clientName) => {
        try {
          return await getStockAnalysis(clientName, tickerSymbol);
        } catch (error) {
          console.error(`Error fetching from ${clientName}:`, error);
          return { clientName, error: "Failed to fetch data" };
        }
      })
    );

    res.status(200).json(stockAnalysisResponse);
  } catch (error) {
    console.error("Error in stock analysis route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`The app is listening on port: ${PORT}`);
});
