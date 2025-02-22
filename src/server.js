const express = require("express");
const cors = require("cors")
const { getLexiChat } = require("./apiCalls/lexi");
const { removingBrackets } = require("./utils/removingBrackets")

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.post("/lexi", async (req, res) => {
    const { tickerSymbol } = req.body;

    if (!tickerSymbol) {
        return res.status(400).json({ error: "tickerSymbol is required" });
    }

    try {
        const responseFromLexi = await getLexiChat(tickerSymbol);
        const messageToStream = removingBrackets(responseFromLexi.choices[0].message.content)
        console.log(responseFromLexi.choices[0].message.content)
        console.log(responseFromLexi)
        res.status(200).json(messageToStream);
    } catch (error) {
        console.error("Error calling getLexiChat:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`The app is listening on port: ${PORT}`);
});
