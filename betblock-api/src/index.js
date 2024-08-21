import express from "express";
import nftController from "./nft/nft.controller.js";
import dotenv from 'dotenv'
import https from 'https'
import fs from 'fs'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Betblock API!");
});

app.listen(port, () => {
  console.log(`[server]: ⚡️ Server is running at http://localhost:${port}`);
});

if (process.env.NODE_ENV === 'production') {
  const options = {
    cert: fs.readFileSync(process.env.PATH_SSL_CERTIFICATE),
    key: fs.readFileSync(process.env.PATH_SSL_KEY)
  }
  https.createServer(options, app).listen(443)
}

// Setup routes
app.use(nftController);