import { Router } from "express";
import {
  invokeDallE,
  addImageToIPFS,
  addMetadataToIPFS,
  mintNFT
} from './nft.service.js'
import {CID} from 'multiformats/cid'
import dotenv from 'dotenv'

dotenv.config();

const nftController = Router();

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  next();
}

nftController.get("/generateImage", apiKeyMiddleware, async (req, res, next) => {
  const words = req.query.words;
  const tokenId = req.query?.tokenId;

  let output = await invokeDallE(words).catch((error) => {
    res.status(400).json({error: error.message})
  })

  let binaryData = Buffer.from(output, 'base64');
  const imageCid = await addImageToIPFS(binaryData).catch((error) => {
    res.status(500).json({error: error.message});
  })

  const metadataCID = await addMetadataToIPFS(imageCid, tokenId, words).catch(error => {
    res.status(500).json({error: error.message})
  })
  await mintNFT(metadataCID, tokenId)
});

nftController.get("/validateKey", apiKeyMiddleware, async (req, res, next) => {
  res.send({message: 'This key is valid!'})
});

export default nftController;
