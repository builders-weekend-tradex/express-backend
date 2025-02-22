import OpenAI from 'openai';

export const getLexiChat = async(ticketSymbol) => {
const client = new OpenAI({
    baseURL: "https://venalisono.ap.xpressai.cloud/api/financials/",
    apiKey: "552d9c79-8de5-4d19-aae9-492469097221"
});

const response = await client.chat.completions.create({
    model: "Lexi", // Available models: Lexi, LexiOnboarding
    messages: [
        { role: "user", content: `summarize this file/data/home/${tickerSymbol}.pdf`}
    ]
});

return response;
}