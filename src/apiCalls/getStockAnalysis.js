import { Client } from "@gradio/client";

/**
 * Fetch stock market analysis using a specified Gradio client.
 * @param {string} clientName - The Gradio client name (e.g., "JayLacoma/Stock_Market_Analysis").
 * @param {string} ticker - The stock ticker symbol (e.g., "NVDA").
 * @param {string} startDate - The start date for analysis (default: "2022-01-01").
 * @param {string} endDate - The end date for analysis (default: "2026-01-01").
 * @returns {Promise<any>} - The result of the stock analysis.
 */

export const getStockAnalysis = async (
  clientName,
  ticker,
  startDate = "2022-01-01",
  endDate = "2026-01-01"
) => {
  try {
    const client = await Client.connect("JayLacoma/Stock_Market_Analysis");
    const result = await client.predict("/stock_analysis", {
      ticker: ticker,
      start_date: startDate,
      end_date: endDate,
    });

    return result;
  } catch (error) {
    console.error("Error fetching stock analysis:", error);
    return null;
  }
};
