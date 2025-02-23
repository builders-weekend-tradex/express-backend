import OpenAI from "openai";

export const getLexiChat = async (tickerSymbol) => {
  const client = new OpenAI({
    baseURL: "https://venalisono.ap.xpressai.cloud/api/financials/",
    apiKey: "6c732b41-67fe-4475-9a7c-e71785aa38df",
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
