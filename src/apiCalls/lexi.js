import OpenAI from "openai";

export const getLexiChat = async (tickerSymbol) => {
  const client = new OpenAI({
    baseURL: "https://venalisono.ap.xpressai.cloud/api/fin/",
    apiKey: "7acaa0cf-43f3-4480-a67b-655244ee1915",
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

export const getMoreInformation = async (tickerSymbol) => {
  const client = new OpenAI({
    baseURL: "https://venalisono.ap.xpressai.cloud/api/fin/",
    apiKey: "7acaa0cf-43f3-4480-a67b-655244ee1915",
  });

  const response = await client.chat.completions.create({
    model: "Lexi", // Available models: Lexi, LexiOnboarding
    messages: [
      {
        role: "user",
        content: tickerSymbol,
      },
    ],
  });

  return response;
};
