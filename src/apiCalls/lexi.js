import OpenAI from "openai";

export const getLexiChat = async (tickerSymbol) => {
  const client = new OpenAI({
    baseURL: "https://venalisono.ap.xpressai.cloud/api/financials/",
    apiKey: "715e5a8-6650-4921-acc7-ad9ff3efa153",
  });

  const response = await client.chat.completions.create({
    model: "Lexi", // Available models: Lexi, LexiOnboarding
    messages: [
      {
        role: "user",
        content: `summarize this file /data/home/${tickerSymbol}.pdf`,
      },
    ],
  });

  return response;
};
