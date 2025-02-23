import puppeteer from "puppeteer";

export async function createPDF(tickerSymbol) {
  // Launch Puppeteer browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Dynamically create the URL based on the provided ticker symbol
  const url = `https://bunarivenna-stock-analysis-${tickerSymbol.toLowerCase()}.hf.space/`;

  // Navigate to the URL
  await page.goto(url);

  // Generate the PDF and save it to the specified path
  await page.pdf({ path: "output.pdf", format: "A4" });

  // Close the browser
  await browser.close();
}