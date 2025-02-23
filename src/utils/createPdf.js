import puppeteer from "puppeteer";

export async function createPDF(tickerSymbol) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = `https://bunarivenna-stock-analysis-${tickerSymbol.toLowerCase()}.hf.space/`;
  await page.goto(url, { waitUntil: "domcontentloaded" });

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 20000);
  });

  // Generate the PDF and store it in a buffer
  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();
  return pdfBuffer;
}
