import puppeteer from "puppeteer";
import PDFDocument from "pdfkit";

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

export async function createPDFFromString(content) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    // Write the provided string content into the PDF
    doc.font("Helvetica").fontSize(12).text(content, { align: "left" });

    // Finalize the PDF and end the stream
    doc.end();
  });
}
