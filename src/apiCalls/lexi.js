import OpenAI from "openai";

export const getLexiChat = async (tickerSymbol) => {
  const client = new OpenAI({
    baseURL: "https://venalisono.ap.xpressai.cloud/api/financials/",
    apiKey: "b6750e38-5ea3-4452-b854-e27977533c23",
  });

  const response = await client.chat.completions.create({
    model: "Lexi", // Available models: Lexi, LexiOnboarding
    messages: [
      {
        role: "user",
        content: `summarize this file/data/home/${tickerSymbol}.pdf`,
      },
    ],
  });

  return response;
};
