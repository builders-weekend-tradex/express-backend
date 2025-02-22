const express = require("express");
const cors = require("express-cors");
const { getLexiChat } = require("./lexi");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/lexi", (req, res) => {
    const { tickerSymbol } = req.body;

    const responseFromLexi = getLexiChat(tickerSymbol);

    console.log(responseFromLexi)
})


app.listen(PORT, () => {
    console.log(`The app is listening on port: ${PORT}`)
})