const express = require("express");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => {
    res.send("Buy and sale project is running on!!");
})

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
})