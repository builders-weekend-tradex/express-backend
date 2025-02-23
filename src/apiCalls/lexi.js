import OpenAI from "openai";

export const getLexiChat = async (tickerSymbol) => {
  const client = new OpenAI({
    baseURL: "https://venalisono.ap.xpressai.cloud/api/fin/",
    apiKey: "aca4be81-f10a-4349-bca3-527270472755",
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
